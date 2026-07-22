/* ============================================================================
 * STRATEGY: Carried Interest Holding-Period Planning (§1061)
 * Advisory — appears in plan documents, does not change scenario math.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'carried-interest-1061',
  name: 'Carried Interest Planning (§1061)',
  category: 'Income Timing & Character',
  applyOrder: 48,
  modeled: false,

  advisor: {
    summary:
      'A service partner who holds a profits interest ("carry" or "promote") in ' +
      'an investment or real-estate partnership can receive long-term capital ' +
      'gain on the partnership\'s gains — but §1061 requires a THREE-year holding ' +
      'period (not one) for that gain to be long-term. Gain on assets held one to ' +
      'three years is recharacterized as short-term (ordinary-rate) capital gain. ' +
      'Planning is about tracking and managing holding periods, structuring the ' +
      'interest so it qualifies, and understanding the exceptions — a legitimate, ' +
      'well-established approach for developers and fund sponsors, distinct from ' +
      'abusive schemes.',
    mechanics: [
      '§1061 applies to an "applicable partnership interest" — a profits interest ' +
      'held in connection with providing services in a business of raising/' +
      'investing capital or developing specified assets.',
      'Three-year test: net long-term gain allocable to the carry is treated as ' +
      'short-term unless the underlying asset (or the interest) was held more ' +
      'than three years. The extra two years over the normal LTCG period is the ' +
      'crux.',
      'Capital invested by the partner (a true capital interest, not the ' +
      'service-based profits interest) is generally outside §1061 — segregating ' +
      'invested capital from carry matters.',
      'Gains already taxed at capital rates outside §1231/§1(h) mechanics — e.g., ' +
      'certain §1231 gains and qualified dividends — may fall outside the ' +
      'recharacterization; the interaction is technical and asset-specific.',
      'Holding-period tracking at the asset level drives the result: selling a ' +
      'development a few months early can convert the sponsor\'s promote from ' +
      'long-term to short-term treatment.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §1061', note: 'Three-year holding period for long-term capital gain on an applicable partnership interest (carried interest); one-to-three-year gain recharacterized as short-term.' },
      { type: 'Reg', cite: 'Treas. Reg. §1.1061-1 through -6', note: 'Definitions of applicable partnership interest, the recharacterization computation, capital-interest exceptions, and reporting.' },
      { type: 'IRC', cite: 'IRC §1231', note: 'Character of gains on real property used in a trade or business — relevant to how a developer\'s promote is taxed alongside §1061.' }
    ],
    requirements: [
      'A service partner holding a profits interest (carry/promote) in a fund or real-estate partnership.',
      'Asset-level and interest-level holding-period records to apply the three-year test.',
      'Structuring that separates a partner\'s invested capital interest from the service-based carry.',
      'Coordination with the partnership\'s disposition timing decisions.'
    ],
    risks: [
      'The two extra years matter: disposing between one and three years turns the promote into short-term gain at ordinary rates.',
      'Legislative risk — carried-interest treatment is a recurring reform target; positions should not assume permanence.',
      'The capital-interest exception is fact-intensive; sloppy structuring can pull invested capital into recharacterization.',
      'Reporting is detailed (the §1061 worksheets and partnership disclosures) and errors invite scrutiny.'
    ],
    bestFit: [
      'Real-estate developers and sponsors earning a promote on projects they can hold past three years.',
      'Fund managers and general partners with carried interests in longer-horizon strategies.',
      'Sponsors who can influence disposition timing to clear the three-year line.'
    ],
    implementation: [
      'Identify applicable partnership interests and separate them from any true capital interest.',
      'Track holding periods at the asset and interest level against the three-year test.',
      'Where feasible, sequence dispositions to hold past three years before recognizing promote gain.',
      'Complete the §1061 recharacterization worksheets and partnership disclosures accurately.'
    ]
  },

  client: {
    teaser: 'If you earn a share of the profits on deals you manage, when you sell can change your tax rate',
    headline: 'Protect the lower tax rate on your deal profits',
    plainEnglish: [
      'If you develop real estate or run investment deals and earn a share of the profits (often called a "promote" or "carry"), that profit can qualify for the lower long-term capital-gains rate — but only if the underlying asset is held long enough. The law sets that bar at three years for this kind of income, not the usual one year.',
      'That means selling a project even a few months too early can bump your share of the profit from the low rate up to your ordinary, higher rate. Simply being aware of the three-year line — and timing sales around it when you can — protects real money.',
      'It also matters how your interest is set up, so that money you actually invested is kept separate from the profit share you earn for your work. We handle both the tracking and the structure.'
    ],
    analogy: 'For this kind of income, the finish line for the lower tax rate is three years, not one — crossing it a little early costs you the better rate.',
    benefits: [
      'Keeps your deal profits at the lower long-term rate',
      'Flags the three-year line before you sell too soon',
      'Structures your interest to protect invested capital',
      'Applies every time you earn a promote or carry'
    ],
    steps: [
      'We identify which of your interests are affected',
      'We track the three-year clock on each deal',
      'We time sales past the line where we can',
      'We keep your invested money separate from your profit share'
    ],
    considerations: [
      'The three-year rule is stricter than the usual one-year rule, so patience around the sale date pays off.',
      'How this income is taxed is a frequent target for law changes, so we do not assume today\'s rules are permanent.'
    ]
  },

  inputs: [],

  appliesTo: function (profile) {
    return true;
  },

  apply: function (profile, params, yearIndex, state) {
    return { profile: profile, notes: yearIndex === 0
      ? ['Advisory strategy — appears in the plan documents but does not change the scenario math. The benefit is character preservation via holding-period management, driven by partnership-level facts outside the individual return.']
      : [] };
  }
});
