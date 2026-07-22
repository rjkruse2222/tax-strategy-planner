/* ============================================================================
 * STRATEGY: Qualified Joint Venture Election (§761(f))
 * Advisory — appears in plan documents, does not change scenario math.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'qualified-joint-venture-761f',
  name: 'Qualified Joint Venture Election (§761(f))',
  category: 'Entity Structure',
  applyOrder: 46,
  modeled: false,

  advisor: {
    summary:
      'When both spouses materially participate in an unincorporated business ' +
      'they jointly own, §761(f) lets them elect out of partnership treatment ' +
      'and instead each report their share on a separate Schedule C (or F). ' +
      'This avoids a Form 1065 and its penalties, gives each spouse their own ' +
      'self-employment earnings (building independent Social Security records), ' +
      'and simplifies the return. It is a filing/administrative election, not a ' +
      'dollar-saving strategy — the combined income tax is essentially unchanged.',
    mechanics: [
      'Available only to a business co-owned solely by spouses filing jointly, ' +
      'where both materially participate and no other partners exist.',
      'Each spouse files a separate Schedule C/F reporting their share of income ' +
      'and expenses, and a separate Schedule SE — no partnership return.',
      'A business held inside a state-law entity (an LLC) generally cannot use ' +
      '§761(f); the exception is a spousal LLC in a community-property state ' +
      'treated as a disregarded entity under Rev. Proc. 2002-69.',
      'Splitting SE income can raise total SE tax if one spouse was already over ' +
      'the Social Security wage base (the other spouse\'s share now incurs OASDI ' +
      'again) — quantify before electing.',
      'Each spouse\'s independent earnings record can increase future Social ' +
      'Security benefits and each spouse\'s own retirement-plan contribution room.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §761(f)', note: 'Qualified joint venture election: a spousal business is not treated as a partnership; each spouse takes their share on their own schedule.' },
      { type: 'Admin', cite: 'Rev. Proc. 2002-69', note: 'Spousal wholly-owned entities in community-property states may be treated as disregarded — the path for a spousal LLC.' },
      { type: 'Admin', cite: 'IRS Schedule C/F & SE instructions (QJV)', note: 'Mechanics of splitting income and expenses across two Schedules C/F and two Schedules SE.' }
    ],
    requirements: [
      'A business owned only by spouses who file a joint return, with both materially participating.',
      'No other owners and, generally, no state-law entity wrapper (except a community-property-state spousal LLC).',
      'Income and expenses split proportionately to each spouse\'s interest.',
      'Consistent treatment: two Schedules C/F and two Schedules SE each year.'
    ],
    risks: [
      'Not a tax saver — combined income tax is roughly unchanged; the value is administrative and Social Security credits.',
      'Can INCREASE total SE tax when one spouse already exceeds the wage base.',
      'Generally unavailable to LLC-held businesses outside community-property states — a common misconception.',
      'Both spouses must genuinely materially participate; a passive spouse does not qualify.'
    ],
    bestFit: [
      'Husband-wife businesses currently filing (or facing) a partnership return they would rather avoid.',
      'Couples who want each spouse to build an independent Social Security and retirement-contribution record.',
      'Simple co-owned operations without outside investors.'
    ],
    implementation: [
      'Confirm sole spousal ownership, joint filing, and material participation by both.',
      'Determine each spouse\'s ownership share for the income/expense split.',
      'Discontinue the Form 1065 (or elect at inception); file two Schedules C/F and two Schedules SE.',
      'Revisit annually if one spouse\'s wages approach the Social Security wage base.'
    ]
  },

  client: {
    teaser: 'If you and your spouse run a business together, your tax paperwork may be harder than it needs to be',
    headline: 'Simplify a business you run with your spouse',
    plainEnglish: [
      'When a married couple owns and runs a business together, the IRS can treat it as a partnership — which means a separate, more complicated tax return with its own penalties for filing late. There is an election that lets you skip all of that and simply split the business between the two of you on your regular personal return.',
      'Besides being simpler, it gives each of you your own record of earnings toward Social Security and your own room to save in a retirement plan, instead of everything landing under one spouse.',
      'This is about making your paperwork cleaner and your Social Security fairer, not about cutting your tax bill — we are honest that the tax itself stays about the same.'
    ],
    analogy: 'It is like filing one clean set of forms instead of standing up a whole separate company just because you and your spouse work side by side.',
    benefits: [
      'Avoids a separate, more complex partnership tax return',
      'Each spouse builds their own Social Security record',
      'Each spouse gets their own retirement-savings room',
      'Simpler filing every year'
    ],
    steps: [
      'We confirm you both qualify (you both work in the business)',
      'We set each spouse\'s share of the business',
      'We report it cleanly on your personal return',
      'We revisit it each year as your incomes change'
    ],
    considerations: [
      'This mainly simplifies filing — it does not usually lower your total tax.',
      'If your business is set up as an LLC, this option is generally only available in certain states; we check yours.'
    ]
  },

  inputs: [],

  appliesTo: function (profile) {
    return true;
  },

  apply: function (profile, params, yearIndex, state) {
    return { profile: profile, notes: yearIndex === 0
      ? ['Advisory strategy — appears in the plan documents but does not change the scenario math. Value is administrative (no Form 1065) and Social Security/retirement crediting, not income-tax dollars.']
      : [] };
  }
});
