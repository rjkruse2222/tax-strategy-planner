/* ============================================================================
 * STRATEGY: C-Corp Conversion (Retained Earnings / QSBS)
 * One source object → advisor view, client PDF, client slideshow.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'c-corp-conversion',
  name: 'C-Corp Conversion (Retained Earnings / QSBS)',
  category: 'Entity Structure',
  applyOrder: 11, // restructures income right after S-corp election in ordering
  conflictsWith: ['s-corp-election'],
  conflictNote: 'A business is taxed as either an S corporation or a C corporation ' +
    'for a given year (§1361/§1362) — the two conversions cannot apply to the same entity.',
  modeled: true,

  advisor: {
    summary:
      'Operate the business as a C corporation taxed at the flat 21% rate (§11) ' +
      'instead of passing profit through to the owner\'s 1040. The owner takes a ' +
      'reasonable W-2 salary; remaining profit is taxed once at 21% and retained ' +
      'for reinvestment, compounding at the corporate rate rather than the ' +
      'owner\'s marginal rate. Dividends actually paid are a second tax layer at ' +
      'qualified-dividend rates (§301/§316; §1(h)(11)). The long-game payoff is ' +
      '§1202 QSBS: for stock acquired after 7/4/2025, OBBBA allows exclusion of ' +
      'up to $15M (or 10x basis) of gain — 50%/75%/100% at 3/4/5-year holds — if ' +
      'the corporation stays under the $75M gross-asset cap and runs a qualified ' +
      'active business. The trade-offs are the dividend double tax, loss of the ' +
      '§199A deduction on the corporate profit, and the §531/§541 penalty-tax ' +
      'regimes on passive or hoarded earnings.',
    mechanics: [
      'Sole-prop (or SMLLC) incorporates under §351, or an existing LLC checks ' +
      'the box (Form 8832) to be taxed as a C corporation. Owner becomes a W-2 ' +
      'employee; corporation files Form 1120.',
      'Corporate profit after salary, employer payroll tax, and admin cost is ' +
      'taxed at the flat 21% rate (§11) — no SE tax, no individual brackets, ' +
      'but also no §199A/QBI deduction on that profit.',
      'Retained earnings compound inside the corporation at the 21% rate. The ' +
      'benefit versus a passthrough is a rate spread play: it works when the ' +
      'owner\'s marginal rate (up to 37% + Medicare taxes) exceeds 21% and the ' +
      'cash genuinely stays in the business.',
      'Cash the owner pulls out beyond salary is a dividend — taxable again at ' +
      '0/15/20% qualified-dividend rates plus 3.8% NIIT (§301/§316). The ' +
      'combined double-taxed rate (~36–40% top) usually exceeds the passthrough ' +
      'rate, so the structure only wins when distributions are low.',
      '§1202 exit: original-issuance C-corp stock in a qualified trade or ' +
      'business (most non-service businesses; SSTB-type fields are excluded ' +
      'under §1202(e)(3)) with gross assets ≤ $75M at issuance. For stock ' +
      'acquired after 7/4/2025, OBBBA allows a 50% exclusion at a 3-year hold, ' +
      '75% at 4 years, 100% at 5 years, capped at the greater of $15M ' +
      '(inflation-indexed) or 10x basis per issuer.',
      'Guardrails: §541 imposes a 20% personal holding company tax where ≥60% ' +
      'of adjusted ordinary gross income is passive and 5 or fewer individuals ' +
      'own >50%; §531 imposes the 20% accumulated earnings tax on earnings ' +
      'retained beyond reasonable business needs (generally above the $250,000 ' +
      'credit; $150,000 for service corporations).'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §11', note: 'Flat 21% corporate rate (TCJA, permanent).' },
      { type: 'IRC', cite: 'IRC §1202 (as amended by OBBBA, P.L. 119-21)', note: 'QSBS exclusion for stock acquired after 7/4/2025: $75M gross-asset cap, greater of $15M or 10x basis per issuer, tiered 50/75/100% exclusion at 3/4/5-year holding periods.' },
      { type: 'IRC', cite: 'IRC §§301, 316; §1(h)(11)', note: 'Distributions out of E&P are dividends — the second tax layer, at qualified-dividend rates for domestic corporations.' },
      { type: 'IRC', cite: 'IRC §531', note: 'Accumulated earnings tax: 20% on earnings retained beyond reasonable business needs; documented growth/expansion plans are the defense.' },
      { type: 'IRC', cite: 'IRC §541', note: 'Personal holding company tax: 20% on undistributed PHC income where the income and ownership tests are met — the trap for investment-heavy closely held corps.' },
      { type: 'IRC', cite: 'IRC §351', note: 'Tax-free incorporation of the existing business in exchange for stock (start of the §1202 holding period and original-issuance requirement).' },
      { type: 'IRC', cite: 'IRC §199A', note: 'By contrast: C-corp profit gets no QBI deduction — part of the honest rate comparison against a passthrough.' }
    ],
    requirements: [
      'A qualified active trade or business if §1202 is part of the thesis — §1202(e)(3) excludes health, law, consulting, financial services, and other reputation/skill businesses.',
      'Stock must be acquired at original issuance from the corporation (direct incorporation or check-the-box conversion; an S corporation\'s existing stock does not qualify — the corporation must be a C corp when the stock is issued).',
      'Aggregate gross assets ≤ $75M at and immediately after issuance (OBBBA cap for post-7/4/2025 stock).',
      'Genuine reinvestment need for retained earnings — documented expansion plans defend against §531.',
      'Payroll for the owner\'s salary and Form 1120 compliance annually.'
    ],
    risks: [
      'Double taxation on any cash the owner actually needs personally — model dividends honestly; if the owner distributes most of the profit, the passthrough usually wins.',
      'Accumulated earnings tax (§531) if retention outruns documented business needs; personal holding company tax (§541) if the corporation drifts into passive income.',
      'Loss of §199A: the 21% rate must be compared against the owner\'s effective passthrough rate AFTER the QBI deduction, not the headline bracket.',
      'Locked-in structure: getting appreciated assets back out of a C corporation is itself a taxable event; converting back to passthrough status has its own toll charges (e.g., BIG tax if re-electing S).',
      '§1202 is a facts-heavy exclusion — qualified business, original issuance, gross-asset test, and holding period must all be documented from day one; a later exam reconstructs all of it.',
      'State treatment varies — some states do not conform to §1202.'
    ],
    bestFit: [
      'Profitable businesses that genuinely reinvest most earnings (equipment, inventory, hiring) rather than distributing them.',
      'Owners in the 32–37% brackets where the 21% corporate rate creates a real deferral spread.',
      'Businesses with a plausible 3–5+ year exit where §1202 could exclude some or all of the sale gain.',
      'Non-SSTB businesses (SSTBs fail the §1202 qualified-business test).'
    ],
    implementation: [
      'Model the full comparison: passthrough (with QBI) vs. 21% + dividend layer at the client\'s actual distribution needs. This tool defaults to 100% of after-tax profit distributed — the honest base case; lower the distribution % to model retention, and the notes quantify the deferred shareholder-level tax embedded in retained earnings.',
      'Incorporate under §351 or file Form 8832 for an existing LLC; issue stock and record the §1202 gross-asset test as of issuance.',
      'Set reasonable W-2 compensation and run payroll; document board minutes for retained-earnings plans (the §531 defense file).',
      'Adopt a dividend policy — deliberately low if the retained-earnings thesis is the point.',
      'Calendar the §1202 holding-period milestones (3/4/5 years from issuance) in the permanent file.',
      'File Form 1120 annually; monitor passive-income mix against the §541 tests.'
    ]
  },

  client: {
    teaser: 'A flat, lower tax rate on profits you keep in the business — and a path to a tax-free sale someday',
    headline: 'Keep profits in the business at a 21% rate — and set up a tax-free exit',
    plainEnglish: [
      'Right now, every dollar your business earns lands on your personal tax return, where rates can run well over 30% — even for profit you never take out of the company. Restructuring as a regular corporation changes that: profit the business keeps is taxed at a flat 21%, period.',
      'That gap matters when you are reinvesting. Money kept in the company to buy equipment, hire, or build inventory grows from a bigger after-tax base every year. The catch is that money you pull out for yourself beyond your salary gets taxed a second time, so this works best when the business — not your household — needs the cash.',
      'There is also a powerful long-term prize: if you hold the company\'s stock long enough and later sell the business, current law can make millions of dollars of that sale completely tax-free. The clock starts when we set the structure up, which is a reason to plan early rather than later.'
    ],
    analogy: 'Think of it as a greenhouse for your profits: money that stays inside grows in a better climate, but every trip outside the greenhouse costs a toll — so we design it for profits you truly intend to keep planted.',
    benefits: [
      'A flat 21% rate on profits kept in the business, instead of your higher personal rate',
      'More after-tax money compounding inside the company each year',
      'A potential exit where a large part of the sale price is tax-free after a 5-year hold',
      'A salary and structure that look and feel like any established company'
    ],
    steps: [
      'We run the numbers both ways — your current setup versus the corporate structure — using your real profit and spending needs',
      'We handle the incorporation paperwork and set up your salary through payroll',
      'We document everything the future tax-free-sale rules require, starting day one',
      'Each year we review how much to pay out versus keep in, so the math keeps working for you'
    ],
    considerations: [
      'Money you take out beyond your salary is taxed twice — this structure is for owners who reinvest most of their profit, and we will be honest if that is not you.',
      'The tax-free-sale benefit requires holding the stock for years and meeting several technical tests — we set up the documentation now, but the payoff is down the road.',
      'Undoing this structure later has real costs, so we treat it as a long-term commitment, not an experiment.'
    ]
  },

  inputs: [
    { key: 'ownerSalary', label: 'Owner W-2 salary (reasonable comp)', type: 'currency', default: 120000 },
    { key: 'distributionPct', label: '% of after-tax C-corp profit distributed annually', type: 'percent', default: 100, max: 100 },
    { key: 'dividendsPaid', label: 'Or: explicit annual dividends (overrides the % when > 0)', type: 'currency', default: 0 },
    { key: 'adminCost', label: 'Annual payroll + 1120 compliance cost', type: 'currency', default: 3000 }
  ],

  appliesTo: function (profile) {
    return true; // validated in apply(): needs Schedule C income
  },

  /**
   * Converts Schedule C income into: owner W-2 wages + corporate profit taxed
   * at the flat 21% rate (§11) + a qualified-dividend layer on the amount
   * distributed. Employer FICA and admin cost reduce corporate profit.
   * Distribution model: by DEFAULT 100% of after-tax profit flows out as
   * qualified dividends each year — the honest base case, so the headline
   * comparison includes the shareholder-level second tax layer. Lowering
   * distributionPct models retention: the retained portion bears only the 21%
   * tax in the scenario math, and the notes quantify the DEFERRED
   * shareholder-level tax (15/18.8/23.8%) embedded in it plus §531 exposure.
   * An explicit dividendsPaid amount (> 0) OVERRIDES the percentage —
   * advisor-entered dollars win, and may exceed current-year after-tax profit
   * to model distributions out of prior accumulated E&P.
   * Simplification: dividends are assumed fully qualified (§1(h)(11));
   * corporate-level state tax is not modeled.
   */
  apply: function (profile, params, yearIndex, state) {
    var p = Object.assign({}, profile);
    var notes = [];
    if (p.scheduleCNet <= 0) {
      notes.push('No Schedule C (sole proprietorship) profit found — nothing to convert. ' +
        'This strategy models incorporating a sole proprietorship as a C corporation.');
      return { profile: p, notes: notes };
    }
    var tb = TSIQ.TABLES_2026;
    var f = tb.fica;
    var salary = Math.min(params.ownerSalary, p.scheduleCNet); // can't pay more than profit
    if (salary < params.ownerSalary && yearIndex === 0) {
      notes.push('Salary capped at business profit of ' + TSIQ.fmt.usd(p.scheduleCNet) + '.');
    }
    var employerFICA = Math.min(salary, f.ssWageBase) * (f.ssRate / 2) +
      salary * (f.medicareRate / 2);
    var corpProfit = p.scheduleCNet - salary - employerFICA - (params.adminCost || 0);
    var corpTax = Math.max(0, corpProfit) * tb.corporateRate;
    var afterTaxProfit = Math.max(0, corpProfit) - corpTax;

    // Distribution layer: default 100% of after-tax profit out as qualified
    // dividends; explicit dividendsPaid dollars override the percentage.
    var pctRaw = (params.distributionPct !== undefined ? params.distributionPct : 100);
    var pct = Math.max(0, Math.min(100, pctRaw)) / 100;
    var dividends = (params.dividendsPaid || 0) > 0
      ? params.dividendsPaid
      : afterTaxProfit * pct;
    var retained = Math.max(0, afterTaxProfit - dividends);

    // Deferred shareholder-level rates on retained earnings when eventually
    // distributed. The 15%/20% qualified-dividend brackets (§1(h)(11)) are
    // statutory rates the engine also applies in prefRateTax; NIIT from tables.
    var divRateLow = 0.15;                  // §1(h)(11) 15% bracket
    var divRateHigh = 0.20 + tb.niit.rate;  // 20% top bracket + 3.8% NIIT

    p.corpTaxPaid = (p.corpTaxPaid || 0) + corpTax;
    p.ownerWages = (p.ownerWages || 0) + salary;
    p.qualDiv = (p.qualDiv || 0) + dividends;
    p.scheduleCNet = 0;

    // Multi-year memory: cumulative retained earnings drive the §531 note.
    state.cCorpConvRetained = (state.cCorpConvRetained || 0) + retained;

    if (yearIndex === 0) {
      notes.push('C-corp profit of ' + TSIQ.fmt.usd(Math.max(0, corpProfit)) +
        ' taxed at the flat 21% rate (§11): ' + TSIQ.fmt.usd(corpTax) +
        ' corporate tax, leaving ' + TSIQ.fmt.usd(afterTaxProfit) + ' after tax.');
      if (dividends > 0) {
        notes.push(TSIQ.fmt.usd(dividends) +
          ((params.dividendsPaid || 0) > 0
            ? ' of advisor-entered dividends (overriding the distribution %)'
            : ' — ' + TSIQ.fmt.pct(pct, 0) + ' of after-tax profit —') +
          ' modeled as qualified dividends on the personal return: the second ' +
          'tax layer (§301/§316; §1(h)(11)).');
        if (dividends > afterTaxProfit) {
          notes.push('Warning: dividends exceed current-year after-tax corporate profit of ' +
            TSIQ.fmt.usd(afterTaxProfit) + ' — sustainable only from prior accumulated E&P.');
        }
      }
      if (retained > 0) {
        notes.push('Retained (undistributed) after-tax profit of ' + TSIQ.fmt.usd(retained) +
          ' per year bears only the 21% corporate layer in this projection — but the ' +
          'shareholder-level tax is deferred, not eliminated. Paying it out later costs ' +
          '15% / 18.8% / 23.8% (qualified-dividend rate, with 3.8% NIIT, and the 20% top ' +
          'bracket; §1(h)(11), §1411): roughly ' + TSIQ.fmt.usd(retained * divRateLow) +
          '–' + TSIQ.fmt.usd(retained * divRateHigh) + ' of embedded future tax on each ' +
          'year\'s retention. Savings shown versus a passthrough are substantially ' +
          'timing, not permanent.');
        notes.push('§531 accumulated earnings tax: 20% penalty on earnings retained ' +
          'beyond reasonable business needs, generally above the $250,000 credit ' +
          '($150,000 for service corporations; §535(c)(2)). Board minutes documenting ' +
          'expansion plans are the defense file — start them in year one.');
      }
      notes.push('No §199A/QBI deduction applies to C-corp profit — the scenario math ' +
        'reflects losing it. Watch §541 (personal holding company) exposure if the ' +
        'corporation drifts into passive investment income.');
      if (corpProfit < 0) {
        notes.push('Warning: salary + payroll costs exceed profit — conversion is not beneficial at this income level.');
      }
    }

    // Year-specific: flag the year cumulative retention crosses the §531 credit.
    if (!state.cCorpConvAETFlagged && state.cCorpConvRetained > 250000) {
      state.cCorpConvAETFlagged = true;
      notes.push('Year ' + (yearIndex + 1) + ': cumulative modeled retained earnings ' +
        'reach ' + TSIQ.fmt.usd(state.cCorpConvRetained) + ', past the $250,000 ' +
        '§531/§535(c)(2) accumulated-earnings credit — deferred shareholder-level tax ' +
        'embedded so far: ' + TSIQ.fmt.usd(state.cCorpConvRetained * divRateLow) + '–' +
        TSIQ.fmt.usd(state.cCorpConvRetained * divRateHigh) + '.');
    }
    return { profile: p, notes: notes };
  }
});
