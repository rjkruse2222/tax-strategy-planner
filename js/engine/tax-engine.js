/* ============================================================================
 * TAX ENGINE — computes a single tax year from a profile object.
 * Reads all constants from TSIQ.TABLES_2026. No strategy-specific logic here.
 *
 * Profile shape (the "return data" for one year):
 * {
 *   filingStatus: 'single'|'mfj'|'mfs'|'hoh',
 *   wages,            // outside W-2 wages (jobs other than the client's entity)
 *   ownerWages,       // W-2 wages the client's own entity pays them (S-corp)
 *   scheduleCNet,     // sole proprietorship net profit (SE income)
 *   passthroughK1,    // S-corp / partnership ordinary income (QBI, not SE)
 *   entityW2Wages,    // total W-2 wages the entity pays (for §199A wage limit)
 *   isSSTB,           // specified service trade or business flag
 *   rentalNet,        // Schedule E rental net (after current depreciation)
 *   rentalLossesUsable, // true = RE pro / passive income available (§469)
 *   ltcg, qualDiv, interest, otherIncome,
 *   propertyTax, mortgageInterest, charitable, otherItemized,
 *   stateRate,        // flat effective state rate, decimal (simplification)
 *   ptetPaid          // entity-level state tax paid (PTET strategy)
 * }
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};

(function () {
  var T = function () { return TSIQ.TABLES_2026; };

  function bracketTax(taxable, brackets) {
    var tax = 0;
    for (var i = 0; i < brackets.length; i++) {
      var lower = brackets[i][0];
      var rate = brackets[i][1];
      var upper = (i + 1 < brackets.length) ? brackets[i + 1][0] : Infinity;
      if (taxable <= lower) break;
      tax += (Math.min(taxable, upper) - lower) * rate;
    }
    return tax;
  }

  // Preferential-rate tax on LTCG + qualified dividends, stacked on top of
  // ordinary taxable income against the 0/15/20 breakpoints.
  function prefRateTax(ordinaryTaxable, prefIncome, fs) {
    var bp = T().ltcgBreakpoints[fs];
    var tax = 0, remaining = prefIncome, stackTop = ordinaryTaxable;
    // 0% band
    var room0 = Math.max(0, bp[0] - stackTop);
    var in0 = Math.min(remaining, room0);
    remaining -= in0; stackTop += in0;
    // 15% band
    var room15 = Math.max(0, bp[1] - Math.max(stackTop, bp[0]));
    var in15 = Math.min(remaining, room15);
    tax += in15 * 0.15; remaining -= in15; stackTop += in15;
    // 20% band
    tax += remaining * 0.20;
    return tax;
  }

  // §199A QBI deduction — simplified but structurally correct:
  // - full 20% below the taxable-income threshold
  // - W-2 wage limit (50% of wages; UBIA prong not modeled) phased in above it
  // - SSTB benefit phased out entirely across the phase-in range
  // - overall cap: 20% of (taxable income before QBI − net capital gain)
  function qbiDeduction(p, agi, deduction, seDeduction) {
    var t = T().qbi, fs = p.filingStatus;
    var qbiIncome = Math.max(0,
      (p.scheduleCNet - seDeduction) + p.passthroughK1 - (p.qbiReduction || 0));
    if (qbiIncome <= 0) return 0;

    var tiBeforeQBI = Math.max(0, agi - deduction);
    var tentative = t.rate * qbiIncome;
    var wageLimit = 0.50 * (p.entityW2Wages || 0);

    var threshold = t.threshold[fs];
    var range = t.phaseInRange[fs];
    var excess = tiBeforeQBI - threshold;
    var applicable;

    if (excess <= 0) {
      applicable = tentative;
    } else {
      var phasePct = Math.min(1, excess / range);
      if (p.isSSTB) {
        // SSTB: the whole deduction phases out across the range.
        var reducedTentative = tentative * (1 - phasePct);
        var reducedWageLimit = wageLimit * (1 - phasePct);
        applicable = (phasePct >= 1) ? 0
          : Math.min(reducedTentative,
              reducedTentative - (reducedTentative - reducedWageLimit) * phasePct);
        applicable = Math.max(0, applicable);
      } else {
        // Non-SSTB: phase in the wage limitation.
        if (tentative <= wageLimit) {
          applicable = tentative;
        } else {
          applicable = tentative - (tentative - wageLimit) * phasePct;
        }
        applicable = Math.max(0, applicable);
      }
    }
    var netCapGain = Math.max(0, (p.ltcg || 0)) + Math.max(0, (p.qualDiv || 0));
    var overallCap = t.rate * Math.max(0, tiBeforeQBI - netCapGain);
    return Math.max(0, Math.min(applicable, overallCap));
  }

  /**
   * Compute one tax year. `state` carries multi-year memory (suspended
   * passive losses) and belongs to the scenario, not the profile.
   * Returns a detailed breakdown object.
   */
  TSIQ.computeYear = function (profile, state) {
    var p = Object.assign({
      wages: 0, ownerWages: 0, scheduleCNet: 0, passthroughK1: 0,
      entityW2Wages: 0, isSSTB: false, rentalNet: 0, rentalLossesUsable: true,
      ltcg: 0, qualDiv: 0, interest: 0, otherIncome: 0,
      propertyTax: 0, mortgageInterest: 0, charitable: 0, otherItemized: 0,
      stateRate: 0, ptetPaid: 0, stateAddback: 0,
      kidsCTC: 0, otherDeps: 0,
      fedWithholding: 0, fedEstimates: 0, stateWithholding: 0, stateEstimates: 0,
      // Generic hooks set by strategies:
      adjustments: 0,    // above-the-line deductions (retirement, SE health, HSA…)
      qbiReduction: 0,   // amounts that also reduce §199A qualified business income
      otherCredits: 0,   // nonrefundable credits other than CTC (R&D, WOTC, 45F…)
      corpTaxPaid: 0,    // entity-level federal tax (C-corp conversion strategy)
      otherTaxes: 0      // additional payroll/other federal taxes strategies create
                         // (e.g., FICA on kids' S-corp wages)
    }, profile);
    state = state || {};
    var tb = T(), fs = p.filingStatus, f = tb.fica;

    // ---- Self-employment tax (§1401/1402), coordinated with W-2 SS wages ----
    var seNetEarnings = Math.max(0, p.scheduleCNet) * f.seNetEarningsFactor;
    var ficaWages = p.wages + p.ownerWages;
    var ssRoomLeft = Math.max(0, f.ssWageBase - ficaWages);
    var seSS = Math.min(seNetEarnings, ssRoomLeft) * f.ssRate;
    var seMedicare = seNetEarnings * f.medicareRate;
    var seTax = seSS + seMedicare;
    var seDeduction = seTax / 2;

    // ---- Payroll tax on owner W-2 wages (both halves — a real cost of the
    // S-corp structure; the employer half is already deducted from entity
    // profit by the strategy, and is also deductible here economically) ----
    var ownerSS = Math.min(p.ownerWages, f.ssWageBase) * f.ssRate;
    var ownerMedicare = p.ownerWages * f.medicareRate;
    var ownerPayrollTax = ownerSS + ownerMedicare;

    // ---- Additional Medicare (0.9% over threshold, wages + SE earnings) ----
    var medicareBase = p.wages + p.ownerWages + seNetEarnings;
    var addlMedicare = f.additionalMedicareRate *
      Math.max(0, medicareBase - f.additionalMedicareThreshold[fs]);

    // ---- Passive rental loss suspension (§469, simplified carryforward) ----
    var rentalAllowed = p.rentalNet;
    var suspendedUsed = 0, suspendedAdded = 0;
    state.suspendedRentalLoss = state.suspendedRentalLoss || 0;
    if (p.rentalNet < 0 && !p.rentalLossesUsable) {
      suspendedAdded = -p.rentalNet;
      state.suspendedRentalLoss += suspendedAdded;
      rentalAllowed = 0;
    } else if (p.rentalNet > 0 && state.suspendedRentalLoss > 0) {
      suspendedUsed = Math.min(p.rentalNet, state.suspendedRentalLoss);
      state.suspendedRentalLoss -= suspendedUsed;
      rentalAllowed = p.rentalNet - suspendedUsed;
    }

    // ---- AGI ----
    var totalIncome = p.wages + p.ownerWages + p.scheduleCNet + p.passthroughK1 +
      rentalAllowed + p.ltcg + p.qualDiv + p.interest + p.otherIncome;
    var agi = totalIncome - seDeduction - p.adjustments;

    // ---- State tax (flat effective rate — documented simplification).
    // stateAddback restores federal-only deductions (e.g., the PTET the entity
    // deducted) to the state base, since credit states add them back.
    // PTET paid at the entity level credits against the personal liability. ----
    var stateTaxGross = Math.max(0, agi + p.stateAddback) * p.stateRate;
    var personalStateTax = Math.max(0, stateTaxGross - p.ptetPaid);

    // ---- Itemized vs standard, with OBBBA SALT cap phase-down ----
    var saltPaid = personalStateTax + p.propertyTax;
    var s = tb.salt;
    var effectiveCap = Math.max(
      s.floor[fs],
      s.cap[fs] - s.phaseDownRate * Math.max(0, agi - s.phaseDownStart[fs])
    );
    var saltDeduction = Math.min(saltPaid, effectiveCap);
    var itemized = saltDeduction + p.mortgageInterest + p.charitable + p.otherItemized;
    var standardDed = tb.standardDeduction[fs];
    var deduction = Math.max(standardDed, itemized);
    var usedItemized = itemized > standardDed;

    // ---- QBI, taxable income, income tax ----
    var qbi = qbiDeduction(p, agi, deduction, seDeduction);
    var taxableIncome = Math.max(0, agi - deduction - qbi);
    var prefIncome = Math.min(taxableIncome, Math.max(0, p.ltcg) + Math.max(0, p.qualDiv));
    var ordinaryTaxable = taxableIncome - prefIncome;
    var ordinaryTax = bracketTax(ordinaryTaxable, tb.brackets[fs]);
    var capGainsTax = prefRateTax(ordinaryTaxable, prefIncome, fs);
    var incomeTaxBeforeCredits = ordinaryTax + capGainsTax;

    // ---- Child tax credit / other-dependent credit (§24, OBBBA amounts).
    // Phase-out: $50 per $1,000 (or fraction) of MAGI over the threshold.
    // Applied as nonrefundable (ACTC refundable portion not modeled in v1). ----
    var c = tb.ctc;
    var grossCTC = p.kidsCTC * c.perChild + p.otherDeps * c.perOtherDependent;
    var ctcExcess = Math.max(0, agi - c.phaseOutThreshold[fs]);
    var ctcReduction = Math.ceil(ctcExcess / 1000) * c.phaseOutPer1000;
    var ctcAllowed = Math.min(Math.max(0, grossCTC - ctcReduction), incomeTaxBeforeCredits);
    // Other nonrefundable credits (strategy hook) — applied after CTC.
    var otherCreditsAllowed = Math.min(p.otherCredits, incomeTaxBeforeCredits - ctcAllowed);
    var incomeTax = incomeTaxBeforeCredits - ctcAllowed - otherCreditsAllowed;

    // ---- NIIT (§1411) — rental treated as passive NII unless losses-usable
    // toggle indicates real estate professional status ----
    var nii = Math.max(0, p.ltcg) + Math.max(0, p.qualDiv) + Math.max(0, p.interest) +
      (p.rentalLossesUsable ? 0 : Math.max(0, rentalAllowed));
    var niit = tb.niit.rate * Math.max(0, Math.min(nii,
      Math.max(0, agi - tb.niit.magiThreshold[fs])));

    var totalFederal = incomeTax + seTax + addlMedicare + niit + ownerPayrollTax +
      p.corpTaxPaid + p.otherTaxes;
    var totalState = personalStateTax + p.ptetPaid;
    var totalBurden = totalFederal + totalState;

    // ---- Payments to date → remaining balance due (current year only;
    // the scenario engine zeroes payments for projection years 2+). ----
    var fedPayments = p.fedWithholding + p.fedEstimates;
    var statePayments = p.stateWithholding + p.stateEstimates;
    var fedBalanceDue = totalFederal - fedPayments;
    var stateBalanceDue = personalStateTax - statePayments;

    return {
      profile: p,
      totalIncome: totalIncome, agi: agi,
      deduction: deduction, usedItemized: usedItemized,
      saltDeduction: saltDeduction, saltEffectiveCap: effectiveCap,
      qbiDeduction: qbi, taxableIncome: taxableIncome,
      ordinaryTax: ordinaryTax, capGainsTax: capGainsTax,
      incomeTaxBeforeCredits: incomeTaxBeforeCredits,
      ctcAllowed: ctcAllowed, otherCreditsAllowed: otherCreditsAllowed,
      corpTaxPaid: p.corpTaxPaid, otherTaxes: p.otherTaxes, incomeTax: incomeTax,
      fedPayments: fedPayments, statePayments: statePayments,
      totalPayments: fedPayments + statePayments,
      fedBalanceDue: fedBalanceDue, stateBalanceDue: stateBalanceDue,
      totalBalanceDue: fedBalanceDue + stateBalanceDue,
      seTax: seTax, ownerPayrollTax: ownerPayrollTax,
      addlMedicare: addlMedicare, niit: niit,
      totalFederal: totalFederal,
      personalStateTax: personalStateTax, ptetPaid: p.ptetPaid,
      totalState: totalState, totalBurden: totalBurden,
      suspendedRentalLossAdded: suspendedAdded,
      suspendedRentalLossUsed: suspendedUsed,
      suspendedRentalLossBalance: state.suspendedRentalLoss
    };
  };
})();
