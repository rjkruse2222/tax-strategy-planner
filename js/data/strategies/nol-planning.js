/* ============================================================================
 * STRATEGY: NOL Carryforward Planning (§172)
 * One source object → advisor view, client PDF, client slideshow.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'nol-planning',
  name: 'NOL Carryforward Planning',
  category: 'Income Timing & Character',
  applyOrder: 4,
  modeled: true,

  advisor: {
    summary:
      'Post-2017 net operating losses carry forward indefinitely but cannot be ' +
      'carried back (limited farming exception), and the deduction is capped at ' +
      '80% of taxable income computed without the NOL (§172(a)(2)). Because the ' +
      'carryforward never expires, the planning question is WHEN to absorb it: ' +
      'an NOL burned against 22%-bracket income is worth far less than the same ' +
      'NOL against a 37% year, so income acceleration into an NOL-shielded year ' +
      '(Roth conversions, gain recognition, bonus timing) is often the play. ' +
      'Interaction traps: the NOL deduction does not reduce QBI (the §199A ' +
      'qualified business loss carryover is a separate, parallel mechanism), and ' +
      'the 80% cap means a large NOL year still leaves 20% of income exposed.',
    mechanics: [
      'Post-2017 NOLs: no carryback (except 2-year carryback for farming ' +
      'losses), indefinite carryforward, deduction limited to 80% of taxable ' +
      'income before the NOL (§172(a)(2)); pre-2018 NOLs remain 100%-usable ' +
      'and expire after 20 years — order and track the vintages separately.',
      'The NOL originates after the §461(l) excess business loss gate: the ' +
      'disallowed EBL becomes part of NEXT year\'s NOL, so a big loss year ' +
      'often produces both a current deduction (up to the threshold) and a ' +
      'carryforward.',
      'Rate arbitrage is the core play: hold discretionary income (Roth ' +
      'conversions, asset sales, dividends from a controlled C corp) for NOL ' +
      'years, or conversely avoid wasting NOL absorption on income that would ' +
      'have been taxed at low brackets anyway.',
      'QBI interplay: §172 and §199A run on separate tracks — the NOL ' +
      'deduction does not reduce current-year QBI, but a negative-QBI year ' +
      'creates its own qualified business loss carryforward (§199A(c)(2)) that ' +
      'reduces FUTURE QBI. A loss year quietly damages future QBI deductions ' +
      'even while the NOL shelters ordinary income.',
      'The 80% cap means NOLs cannot zero out a big year — plan estimated ' +
      'payments and AMT-adjacent items on the exposed 20%.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §172(a)(2)', note: 'NOL deduction for post-2017 losses limited to 80% of taxable income computed without regard to the NOL deduction.' },
      { type: 'IRC', cite: 'IRC §172(b)(1)(A)', note: 'No carryback / indefinite carryforward for post-2017 NOLs (farming losses retain a 2-year carryback, §172(b)(1)(B)).' },
      { type: 'IRC', cite: 'IRC §461(l)(2)', note: 'Disallowed excess business loss is treated as an NOL carryover to the following year — the upstream gate that feeds §172.' },
      { type: 'IRC', cite: 'IRC §199A(c)(2)', note: 'Negative QBI carries forward as a separate qualified business loss — the NOL deduction itself does not reduce QBI.' },
      { type: 'Admin', cite: 'IRS Pub. 536', note: 'NOL computation for individuals — the nonbusiness/business income and deduction adjustments in computing the loss.' },
      { type: 'Admin', cite: 'Form 1045, Schedule A / return statement', note: 'NOL computation schedule; carryforward tracked by an attached statement each year.' }
    ],
    requirements: [
      'A computed and documented NOL carryforward — the loss-year return must correctly separate business from nonbusiness income and deductions (Pub. 536 worksheet).',
      'Vintage tracking: pre-2018 NOLs (100% usable, 20-year life) vs. post-2017 NOLs (80% cap, indefinite) applied in the correct order.',
      'A projection of future-year brackets so absorption is aimed at the highest-rate years.',
      'Coordination with §461(l) in the loss year and §199A carryovers in the following years.'
    ],
    risks: [
      'The 80% cap: taxable income cannot be fully zeroed by post-2017 NOLs — clients who spend the "no tax this year" assumption get a surprise on the residual 20%.',
      'Wasting NOL against low-bracket income — absorption at 12–22% when a 32–37% year was coming is a permanent value loss.',
      'Computation errors in the loss year (nonbusiness deduction adjustments) compound silently for years; the IRS can challenge the carryforward in any open year it is used.',
      'The parallel §199A qualified business loss carryover reduces future QBI deductions — the projected benefit of NOL years is often overstated when this is missed.',
      'State conformity varies widely (different caps, carryforward periods, and some states disallow NOLs entirely).'
    ],
    bestFit: [
      'Clients emerging from a loss year (startup ramp, bad year, large bonus depreciation) with a documented carryforward.',
      'Clients with discretionary income timing — Roth conversions, gain harvesting, controlled distributions — to aim at the shielded year.',
      'Multi-entity owners whose loss and income years can be sequenced.'
    ],
    implementation: [
      'Reconstruct and document the carryforward by vintage (pre-2018 vs. post-2017) with the Pub. 536 computation for each loss year.',
      'Project the next 3–5 years of brackets in this tool; pick the absorption year(s) with the highest marginal rates.',
      'Accelerate discretionary income into the shielded year (Roth conversion sized to the NOL after the 80% cap; harvest gains; time bonuses).',
      'Attach the NOL statement to each return; recompute the remaining carryforward annually.',
      'Track the separate §199A qualified business loss carryover and reflect it in QBI projections.'
    ]
  },

  client: {
    teaser: 'Uses a past bad year to erase tax on your best years ahead',
    headline: 'Turn a loss year into a tax shield',
    plainEnglish: [
      'If your business ever lost money on paper — from a slow year, a big equipment write-off, or startup costs — the tax law doesn\'t just forget it. That loss becomes a credit-like shield you carry forward, and it can cancel out income in future years.',
      'The catch is that the shield is worth different amounts depending on WHEN you use it. Used against a modest-income year, it erases tax at low rates. Used against a big year, the same shield erases tax at the highest rates — sometimes nearly double the savings from the identical loss.',
      'Our job is to aim it. We track exactly how much shield you have, project your income, and time things — like retirement account conversions or asset sales — so the shield lands on your most expensive income.'
    ],
    analogy: 'It\'s like a stack of gift cards that never expire: spending them on your most expensive purchase gets you the most value, so we save them for exactly that.',
    benefits: [
      'A past loss becomes real dollars saved on future returns',
      'The shield never expires under current law — no pressure to waste it',
      'Big planned income events (conversions, sales) can be sheltered deliberately',
      'We track the running balance so nothing is lost to a filing mistake'
    ],
    steps: [
      'We verify and document exactly how much loss carryforward you have',
      'We project your next several years and pick the smartest year to use it',
      'We time income events into the shielded year when it helps',
      'Each year we file the supporting schedule and update the remaining balance'
    ],
    considerations: [
      'The shield can cancel most, but not all, of a year\'s income — current law leaves about 20% of a big year still taxable, and we plan for that piece.',
      'Using it well means sometimes waiting — spending it on a low-income year wastes much of its value.'
    ]
  },

  inputs: [
    { key: 'nolAvailable', label: 'NOL carryforward used this year', type: 'currency', default: 100000 }
  ],

  appliesTo: function (profile) {
    return true;
  },

  /**
   * The NOL is applied as an above-the-line adjustment, and the §172(a)(2)
   * 80%-of-taxable-income limitation IS enforced here against a documented
   * PROXY for pre-NOL taxable income built from the profile at this
   * strategy's early applyOrder (4 — before most other strategies mutate the
   * profile):
   *   proxy = all income fields (rentalNet excluded when it is a loss with
   *           rentalLossesUsable false, mirroring the engine's §469 gate)
   *           − existing above-the-line adjustments
   *           − the greater of the standard deduction or the entered itemized
   *             deductions (property tax counted at no more than the SALT cap;
   *             state income tax portion of SALT unknowable here, omitted).
   * The SE-tax deduction and the QBI deduction are NOT in the proxy, so the
   * cap base is somewhat overstated and the cap correspondingly generous —
   * flagged in the note; the advisor verifies against the actual projection.
   * The 0.80 multiplier is the statutory §172(a)(2) percentage (post-2017
   * losses), not an indexed table amount. Applied in year 1 only — a one-time
   * absorption, not a recurring deduction. Does not reduce QBI (correct:
   * routed through `adjustments`, not the business income fields).
   */
  apply: function (profile, params, yearIndex, state) {
    var p = Object.assign({}, profile);
    var notes = [];
    var tb = TSIQ.TABLES_2026;
    var nol = params.nolAvailable || 0;

    if (yearIndex === 0 && nol > 0) {
      var fs = p.filingStatus || 'single';
      var rental = (p.rentalNet < 0 && !p.rentalLossesUsable) ? 0 : (p.rentalNet || 0);
      var incomeSum = (p.wages || 0) + (p.ownerWages || 0) + (p.scheduleCNet || 0) +
        (p.passthroughK1 || 0) + rental + (p.ltcg || 0) + (p.qualDiv || 0) +
        (p.interest || 0) + (p.otherIncome || 0);
      var itemizedApprox = Math.min((p.propertyTax || 0), tb.salt.cap[fs]) +
        (p.mortgageInterest || 0) + (p.charitable || 0) + (p.otherItemized || 0);
      var dedApprox = Math.max(tb.standardDeduction[fs], itemizedApprox);
      var preNolTI = Math.max(0, incomeSum - (p.adjustments || 0) - dedApprox);
      // 80% of pre-NOL taxable income — statutory percentage, §172(a)(2).
      var allowed = Math.min(nol, 0.80 * preNolTI);

      p.adjustments = (p.adjustments || 0) + allowed;
      if (allowed < nol) {
        notes.push('§172(a)(2) limitation ENFORCED: of the ' + TSIQ.fmt.usd(nol) +
          ' NOL entered, only ' + TSIQ.fmt.usd(allowed) + ' is deducted — 80% of the ' +
          TSIQ.fmt.usd(preNolTI) + ' pre-NOL taxable-income proxy. The remaining ' +
          TSIQ.fmt.usd(nol - allowed) + ' stays in the carryforward (its later-year ' +
          'absorption is not modeled).');
      } else {
        notes.push('Year 1: ' + TSIQ.fmt.usd(allowed) + ' NOL carryforward deducted — within ' +
          'the §172(a)(2) 80% limitation (cap: ' + TSIQ.fmt.usd(0.80 * preNolTI) +
          ', 80% of the ' + TSIQ.fmt.usd(preNolTI) + ' pre-NOL taxable-income proxy).');
      }
      notes.push('The 80% cap uses a proxy for pre-NOL taxable income (income fields less ' +
        'above-the-line adjustments and the larger of standard/entered itemized deductions; ' +
        'the SE-tax deduction and QBI are not in the proxy, so the cap runs slightly ' +
        'generous) — verify against actual projected taxable income before filing.');
      notes.push('The NOL deduction does not reduce the §199A QBI base (modeled correctly here); ' +
        'any separate §199A qualified business loss carryover must be handled in the QBI inputs.');
    }
    return { profile: p, notes: notes };
  }
});
