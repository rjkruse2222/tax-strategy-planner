/* ============================================================================
 * STRATEGY: R&D Payroll Tax Credit Election (§41(h) / §3111(f))
 * Advisory — coordinates with the income-tax R&D credit; see notes.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'rd-payroll-credit-41h',
  name: 'R&D Payroll Tax Credit Election (§41(h))',
  category: 'Credits & Incentives',
  applyOrder: 82,
  modeled: false,

  advisor: {
    summary:
      'A "qualified small business" — generally under $5M of current-year gross ' +
      'receipts and no gross receipts more than five years ago — can elect under ' +
      '§41(h) to apply up to $500,000 of its research credit against the ' +
      'employer share of payroll taxes instead of income tax. For a pre-profit ' +
      'startup with an income-tax liability of zero, this converts an otherwise ' +
      'useless carryforward into immediate cash flow. It is the same §41 credit ' +
      'the firm already computes — the election just changes which tax it offsets. ' +
      'This is presented advisory because its value lives in payroll, not the ' +
      'income-tax return this tool models.',
    mechanics: [
      'Eligibility: a qualified small business with < $5M of gross receipts for ' +
      'the credit year AND no gross receipts before the five-tax-year window — ' +
      'i.e., genuinely early-stage.',
      'Election cap: up to $500,000 of the §41 research credit per year may be ' +
      'applied against payroll tax ($250,000 against the employer OASDI share; ' +
      'the Inflation Reduction Act added a further $250,000 against the employer ' +
      'Medicare share).',
      'The election is made on Form 6765 with a timely-filed return; the credit ' +
      'is then claimed against payroll on Form 8974 filed with Form 941, ' +
      'beginning the quarter after the income-tax return is filed.',
      'Same credit, different tax: dollars elected against payroll are NOT also ' +
      'available as an income-tax credit — coordinate with the standard R&D ' +
      'credit so the same research spend is not counted twice.',
      'Best paired with, not stacked on, the income-tax R&D credit: use the ' +
      'payroll election for the portion a zero-income startup cannot otherwise ' +
      'use, and the income credit once the firm is profitable.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §41(h)', note: 'Election by a qualified small business to apply the research credit against payroll tax; the < $5M receipts and five-year tests.' },
      { type: 'IRC', cite: 'IRC §3111(f)', note: 'Applies the elected credit against the employer share of Social Security (and, post-IRA, Medicare) tax.' },
      { type: 'Admin', cite: 'Inflation Reduction Act (P.L. 117-169), §13902', note: 'Raised the payroll-offset cap from $250,000 to $500,000 by adding the Medicare-tax component (post-2022).' },
      { type: 'Admin', cite: 'Form 6765; Form 8974', note: 'Credit computation and the payroll-tax-offset election; claiming the credit against Form 941 payroll taxes.' }
    ],
    requirements: [
      'A qualified small business: < $5M current-year gross receipts and no gross receipts more than five years ago.',
      'Qualified research expenses substantiated under §41 (the same documentation the income-tax credit requires).',
      'A timely-filed return making the §41(h) election on Form 6765.',
      'Payroll to offset — the benefit is only as large as the employer FICA the business actually pays.',
      'Coordination with the income-tax R&D credit so the same expenses are not double-counted.'
    ],
    risks: [
      'Not incremental to the income-tax credit — it is the same credit redirected; do not model both on the same research dollars.',
      'The gross-receipts tests are strict; a firm with early revenue or a longer history may not qualify.',
      'Benefit is capped by actual payroll — a founder-only company with minimal wages gets limited cash.',
      'Timing lag: the offset starts the quarter after the return is filed, not the moment expenses are incurred.'
    ],
    bestFit: [
      'Pre-profit startups with real research spend and W-2 payroll but little or no income-tax liability.',
      'Venture-backed technology and life-sciences companies within their first five years of receipts.',
      'Businesses whose income-tax R&D credit would otherwise sit unused in carryforward.'
    ],
    implementation: [
      'Confirm qualified-small-business status (receipts tests) and compute qualified research expenses.',
      'Decide how much of the §41 credit to elect against payroll vs. carry as an income-tax credit.',
      'Make the election on a timely-filed Form 6765; claim the offset on Form 8974 with Form 941 starting the next quarter.',
      'Track the split so the standard R&D credit strategy does not also claim the elected dollars.'
    ]
  },

  client: {
    teaser: 'A young company with no profit yet can still turn its research into cash',
    headline: 'Get cash back for research before you are profitable',
    plainEnglish: [
      'The research tax credit usually only helps once your business is profitable and owes income tax. But a young company often spends the most on developing its product exactly when it is losing money — so the credit just sits there unused.',
      'There is an election that lets a qualifying early-stage business apply its research credit against its payroll taxes instead — the Social Security and Medicare tax you pay on your team\'s wages. That turns the credit into real cash you keep now, up to a sizable annual limit, instead of a benefit you might use years later.',
      'It is the same research credit either way; the election just changes which tax bill it reduces. We coordinate it with the regular credit so nothing is double-counted.'
    ],
    analogy: 'Instead of a coupon you can only use once you are making money, this lets a startup redeem the same coupon against the payroll taxes it is already paying today.',
    benefits: [
      'Turns the research credit into cash before you are profitable',
      'Offsets payroll taxes you are already paying',
      'Up to a large yearly limit for qualifying startups',
      'Same credit — just redirected to where it helps now'
    ],
    steps: [
      'We confirm your company qualifies as an early-stage business',
      'We document and calculate your research credit',
      'We make the election and claim it against your payroll taxes',
      'We coordinate it with the regular credit so nothing overlaps'
    ],
    considerations: [
      'It is the same credit as the regular research credit, not an extra one — we make sure it is only counted once.',
      'The cash is limited by how much payroll tax you actually pay, so a company with very few wages gets less.'
    ]
  },

  inputs: [],

  appliesTo: function (profile) {
    return true;
  },

  apply: function (profile, params, yearIndex, state) {
    return { profile: profile, notes: yearIndex === 0
      ? ['Advisory strategy — appears in the plan documents but does not change the income-tax scenario math. This election redirects the SAME §41 credit to payroll tax; model the income-tax R&D credit with the rd-credit strategy and do not count the same research dollars twice.']
      : [] };
  }
});
