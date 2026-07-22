/* ============================================================================
 * STRATEGY: IRMAA Planning (Medicare Premium Surcharge Management)
 * Advisory — appears in plan documents, does not change scenario math.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'irmaa-planning',
  name: 'IRMAA Planning (Medicare Surcharge)',
  category: 'Income Timing & Character',
  applyOrder: 20,
  modeled: false,

  advisor: {
    summary:
      'The Income-Related Monthly Adjustment Amount (IRMAA) raises a Medicare ' +
      'beneficiary\'s Part B and Part D premiums once modified AGI crosses a ' +
      'series of cliffs, based on the return filed two years earlier. The ' +
      'brackets are cliffs, not phase-ins: one dollar over a threshold can cost ' +
      'hundreds of dollars per month, per spouse, for the whole year. Managing ' +
      'MAGI around those thresholds — through Roth conversion timing, qualified ' +
      'charitable distributions, capital-gain sequencing, and bunching — is a ' +
      'real, recurring savings lever for clients on or approaching Medicare. The ' +
      'surcharge is a Medicare premium, not an income tax, so it is presented ' +
      'advisory rather than modeled in the income-tax projection.',
    mechanics: [
      'Two-year lookback: 2026 premiums are set by 2024 MAGI. Planning must be ' +
      'done in the determination year, not when the higher premium appears.',
      'MAGI = AGI plus tax-exempt interest. It captures items that never show as ' +
      'taxable income — municipal-bond interest still counts toward the cliff.',
      'Cliff structure: crossing a threshold by $1 moves the beneficiary (and ' +
      'each spouse separately) into a higher premium tier for all twelve months ' +
      '— the marginal cost of the last dollar can be enormous.',
      'Levers: time Roth conversions to fill a bracket without tipping the cliff; ' +
      'use qualified charitable distributions (§408(d)(8)) to satisfy RMDs ' +
      'without raising MAGI; sequence capital gains and bunch income into ' +
      'alternate years.',
      'Life-changing events (retirement, work stoppage, death of a spouse) allow ' +
      'a request to use current-year income via Form SSA-44 rather than the ' +
      'two-year-old return.'
    ],
    authority: [
      { type: 'Admin', cite: 'Social Security Act §1839(i) (42 U.S.C. §1395r(i))', note: 'The income-related monthly adjustment to Medicare Part B premiums; the tiered MAGI thresholds and two-year lookback.' },
      { type: 'Admin', cite: '42 U.S.C. §1395w-113(a)(7)', note: 'The parallel Part D income-related adjustment.' },
      { type: 'IRC', cite: 'IRC §408(d)(8)', note: 'Qualified charitable distribution — satisfies RMDs without increasing AGI/MAGI, a core IRMAA lever.' },
      { type: 'Admin', cite: 'Form SSA-44', note: 'Medicare Income-Related Monthly Adjustment Amount — Life-Changing Event, to use current-year income after a qualifying event.' }
    ],
    requirements: [
      'A client on Medicare, or within roughly two years of enrolling, where MAGI is near a threshold.',
      'A MAGI projection for the determination year (two years before the premium year).',
      'Flexible income levers available: IRA/Roth balances, charitable intent for QCDs, or discretionary gains to time.',
      'For SSA-44 relief: a qualifying life-changing event and documentation.'
    ],
    risks: [
      'Two-year lag surprises clients — the planning window closes before the higher premium is ever seen.',
      'Tax-exempt interest counts toward MAGI; a "tax-free" muni portfolio can still push a client over a cliff.',
      'Over-managing IRMAA can conflict with income-tax bracket goals — coordinate the two; the income-tax saving usually dominates.',
      'Thresholds and premium amounts change annually and are not in this tool\'s tables — verify current figures.'
    ],
    bestFit: [
      'Retirees and near-retirees with MAGI hovering near an IRMAA threshold.',
      'Clients with large traditional IRAs facing RMDs who are charitably inclined (QCD candidates).',
      'Households doing multi-year Roth conversions who can shape income to the cliffs.'
    ],
    implementation: [
      'Project determination-year MAGI (including tax-exempt interest) against the current IRMAA thresholds.',
      'Model levers: size Roth conversions to the next cliff, route RMDs through QCDs, and sequence gains.',
      'Where a life-changing event occurred, file Form SSA-44 to use current-year income.',
      'Revisit annually — thresholds move and the two-year lookback keeps the target rolling.'
    ]
  },

  client: {
    teaser: 'One extra dollar of income can quietly raise your Medicare premiums for a whole year',
    headline: 'Keep your Medicare premiums from jumping',
    plainEnglish: [
      'Medicare premiums are not the same for everyone. Once your income crosses certain lines, your Part B and Part D premiums jump — sometimes by a few hundred dollars a month, and again for a spouse. And it is based on your tax return from two years ago, so by the time the higher bill arrives, the chance to prevent it has usually passed.',
      'The good news is these jumps happen at specific income levels, so with a little planning we can keep your income just under the lines in the years that matter — by timing things like retirement-account conversions, charitable gifts straight from your IRA, and when you take gains.',
      'It takes looking ahead a couple of years, which is exactly the kind of thing an ongoing planning relationship is for. Small moves at the right time protect real dollars every year.'
    ],
    analogy: 'Medicare premiums work like a staircase, not a ramp — step one inch too high and you pay the higher rate all year. We help you stop on the right step.',
    benefits: [
      'Avoids sudden jumps in your Medicare premiums',
      'Protects both spouses from separate surcharges',
      'Uses moves you may already be making, just timed better',
      'Pays off year after year in retirement'
    ],
    steps: [
      'We project your income against the Medicare thresholds two years out',
      'We time conversions, gifts, and gains to stay under the lines',
      'We route required IRA withdrawals to charity when it helps',
      'We revisit it every year as the thresholds move'
    ],
    considerations: [
      'It is based on your income from two years earlier, so this only works if we plan ahead.',
      'Even tax-free bond interest counts toward the limit — we factor that in.'
    ]
  },

  inputs: [],

  appliesTo: function (profile) {
    return true;
  },

  apply: function (profile, params, yearIndex, state) {
    return { profile: profile, notes: yearIndex === 0
      ? ['Advisory strategy — appears in the plan documents but does not change the income-tax scenario math. IRMAA is a Medicare premium surcharge (not an income tax); thresholds are not in the 2026 tables and must be verified for the determination year.']
      : [] };
  }
});
