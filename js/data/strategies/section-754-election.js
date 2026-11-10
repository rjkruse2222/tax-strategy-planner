/* ============================================================================
 * STRATEGY: Section 754 Election (Inside Basis Step-Up)
 * Advisory — appears in plan documents, does not change scenario math.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'section-754-election',
  name: 'Section 754 Election (Inside Basis Step-Up)',
  category: 'Entity Structure',
  applyOrder: 47,
  modeled: false,

  advisor: {
    summary:
      'A partnership (or LLC taxed as one) can elect under §754 to adjust the ' +
      'basis of its assets when a partnership interest changes hands or when it ' +
      'distributes property. With the election in place, §743(b) steps up the ' +
      'incoming partner\'s share of inside asset basis to match what they paid, ' +
      'and §734(b) adjusts basis after certain distributions. The step-up ' +
      'generates additional depreciation/amortization and reduces gain on a ' +
      'later sale — often a substantial benefit when appreciated partnership ' +
      'interests are bought or inherited. Whether the specific dollars materialize ' +
      'depends on facts outside the return, so this is presented advisory.',
    mechanics: [
      '§743(b): on a sale or exchange of a partnership interest, or on death, the ' +
      'transferee\'s share of inside basis is stepped up (or down) to their ' +
      'outside basis — extra depreciation and less gain flow only to that partner.',
      '§734(b): on certain distributions (e.g., a distribution in excess of the ' +
      'distributee\'s basis, or of property with a basis disparity), the ' +
      'partnership adjusts the basis of its remaining assets.',
      'The §754 election is made on a timely partnership return and, once made, ' +
      'applies to all future transfers and distributions until formally revoked.',
      'On a partner\'s death, the outside basis steps up to fair market value; a ' +
      '§743(b) adjustment translates that into inside basis so the heirs get real ' +
      'depreciation and reduced gain — a frequently missed post-mortem step.',
      'A §754 election is a double-edged sword: it also mandates step-DOWNS when ' +
      'inside basis exceeds a purchaser\'s cost, and it adds annual tracking, so ' +
      'weigh it before making a permanent election.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §754', note: 'Election to adjust the basis of partnership property on transfers (§743) and distributions (§734).' },
      { type: 'IRC', cite: 'IRC §743(b)', note: 'Basis adjustment to the transferee partner on a sale/exchange of an interest or on death.' },
      { type: 'IRC', cite: 'IRC §734(b)', note: 'Basis adjustment to remaining partnership property after certain distributions.' },
      { type: 'Reg', cite: 'Treas. Reg. §1.754-1', note: 'How and when to make (and revoke) the election; the statement filed with the return.' }
    ],
    requirements: [
      'A partnership or LLC taxed as a partnership with a triggering event: a purchased or inherited interest, or a qualifying distribution.',
      'A written §754 election statement filed with a timely partnership return for the year of the triggering event.',
      'A basis computation for the transferee (§743(b)) or remaining assets (§734(b)), including asset-by-asset allocation under §755.',
      'Ongoing recordkeeping to track the special basis adjustments each year.'
    ],
    risks: [
      'The election is (practically) permanent — it also forces step-DOWNS in later years when they hurt.',
      'Missing the election in the year of transfer/death forfeits the step-up; late relief is limited.',
      'Allocation under §755 among asset classes is technical and drives how fast the benefit is realized.',
      'Adds meaningful annual complexity and cost to the partnership\'s accounting.'
    ],
    bestFit: [
      'Partnerships/LLCs with appreciated assets where interests are bought, sold, or inherited.',
      'Families inheriting an interest in a real-estate or operating partnership — the step-up can be very large.',
      'Buyers of a partnership interest who want depreciation matching their purchase price.'
    ],
    implementation: [
      'Identify the triggering event (purchase, sale, or death of a partner; qualifying distribution).',
      'Model the step-up: incremental depreciation/amortization and reduced future gain for the transferee.',
      'File the §754 election statement with a timely partnership return; compute §743(b)/§734(b) and allocate under §755.',
      'Track the special basis adjustments annually and revisit whether the standing election still serves the partnership.'
    ]
  },

  client: {
    teaser: 'When a share of a business changes hands, its hidden tax value often gets left on the table',
    headline: 'Capture the tax basis you actually paid for',
    plainEnglish: [
      'When you buy into a partnership or LLC — or inherit a share of one — you often pay full market price, but for tax purposes the business keeps using its old, lower cost figures. That mismatch quietly costs you: less depreciation to write off and more taxable gain when things are eventually sold.',
      'A specific election lets the business line up its internal tax values with what you actually paid. The result is more deductions for you going forward and a smaller tax bill when assets are sold down the road. It is especially valuable when a share passes at someone\'s death.',
      'It has to be done at the right time and it is a lasting choice, so we model whether it helps in your situation before recommending it.'
    ],
    analogy: 'It is like buying a house at today\'s price but being told to depreciate it at 1990 prices — this election lets you use the price you really paid.',
    benefits: [
      'More depreciation to deduct after you buy or inherit an interest',
      'Less taxable gain when assets are later sold',
      'Especially powerful when a share passes at death',
      'Matches your tax write-offs to what you actually paid'
    ],
    steps: [
      'We spot the triggering event (a purchase, sale, or inheritance)',
      'We estimate the extra deductions and tax savings',
      'We make the election on time and set up the tracking',
      'We monitor whether the choice keeps serving you'
    ],
    considerations: [
      'It has to be elected in the right year — miss it and the benefit is largely lost.',
      'It is a lasting choice that can occasionally work against you, so we weigh it carefully first.'
    ]
  },

  inputs: [],

  appliesTo: function (profile) {
    return true;
  },

  apply: function (profile, params, yearIndex, state) {
    return { profile: profile, notes: yearIndex === 0
      ? ['Advisory strategy — appears in the plan documents but does not change the scenario math. The step-up benefit depends on partnership-level basis facts outside the individual return.']
      : [] };
  }
});
