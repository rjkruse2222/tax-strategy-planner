/* ============================================================================
 * STRATEGY: Section 338(h)(10) Election (Stock Sale Taxed as Asset Sale)
 * Advisory — appears in plan documents, does not change scenario math.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'section-338h10-election',
  name: 'Section 338(h)(10) Election (M&A)',
  category: 'Succession & Exit',
  applyOrder: 79,
  modeled: false,

  advisor: {
    summary:
      'In the sale of an S corporation (or a corporate subsidiary), a joint ' +
      '§338(h)(10) election lets the parties treat a legal STOCK sale as an ASSET ' +
      'sale for tax purposes. The buyer gets a stepped-up, depreciable/amortizable ' +
      'basis in the target\'s assets (including newly created goodwill), while the ' +
      'seller keeps the simplicity of transferring stock. Both sides must consent. ' +
      'The election reprices the deal: the buyer\'s basis step-up is worth real ' +
      'future deductions, and the seller may face more ordinary income (recapture) ' +
      'than in a plain stock sale — so it is negotiated, not automatic.',
    mechanics: [
      'A qualified stock purchase (≥ 80% of the target within 12 months) by a ' +
      'corporation is recast as if the target sold all its assets at fair value ' +
      'and liquidated — the buyer takes a cost basis in those assets.',
      'The election is JOINT: an S corporation\'s selling shareholders and the ' +
      'buyer both sign; a missing signature voids it.',
      'Seller consequences: gain is computed asset-by-asset, so depreciation ' +
      'recapture (§1245) and certain items are ordinary rather than capital — ' +
      'often raising the seller\'s rate versus a straight stock sale.',
      'Buyer benefit: the basis step-up (especially in goodwill amortizable over ' +
      '15 years under §197) generates deductions a stock purchase would not — ' +
      'buyers frequently pay a gross-up to compensate the seller.',
      'For S targets, confirm the S election was valid; a defective S election can ' +
      'undermine the (h)(10) structure and is a core due-diligence item.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §338(h)(10)', note: 'Joint election to treat a qualified stock purchase of an S corp or subsidiary as a deemed asset sale/liquidation.' },
      { type: 'Reg', cite: 'Treas. Reg. §1.338(h)(10)-1', note: 'Eligibility, the joint-election mechanics, and the deemed sale/liquidation computations.' },
      { type: 'IRC', cite: 'IRC §197', note: 'Amortization of acquired goodwill and intangibles over 15 years — the main source of the buyer\'s step-up benefit.' },
      { type: 'Admin', cite: 'Form 8023', note: 'Elections under §338 for corporations making qualified stock purchases.' }
    ],
    requirements: [
      'A qualified stock purchase: a corporate buyer acquiring ≥ 80% of an S corporation or a corporate subsidiary within 12 months.',
      'A valid S election for an S-corp target (verified in diligence).',
      'Joint consent — all selling S shareholders and the buyer sign Form 8023.',
      'A purchase-price allocation (§1060 classes) supporting the deemed asset sale.'
    ],
    risks: [
      'Seller ordinary-income exposure (recapture) can exceed a plain stock sale — model the seller\'s after-tax proceeds, not just the buyer\'s benefit.',
      'A defective or terminated S election can blow up the structure and trigger built-in gains issues.',
      'It requires buyer cooperation; the economics only work if the price reflects the shifted tax burden.',
      'State conformity and transfer taxes vary — confirm the state result separately.'
    ],
    bestFit: [
      'Sales of S corporations where the buyer values a basis step-up and will pay a gross-up for it.',
      'Deals with substantial goodwill the buyer can amortize.',
      'Sellers with low ordinary recapture exposure, so the election does not erode their proceeds.'
    ],
    implementation: [
      'Confirm the transaction is a qualified stock purchase and the target\'s S election is valid.',
      'Model both sides: buyer step-up deductions vs. seller ordinary-income/recapture, and negotiate any gross-up.',
      'Prepare the §1060 purchase-price allocation across asset classes.',
      'File Form 8023 with both parties\' signatures by the due date; report the deemed asset sale on the target\'s final return.'
    ]
  },

  client: {
    teaser: 'How you paper the sale of your company can change your tax bill by six figures',
    headline: 'Structure your business sale for the best tax result',
    plainEnglish: [
      'When you sell your company, the deal can be written as a sale of your ownership shares or as a sale of the company\'s assets — and the tax results are very different. There is a special election that lets a share sale be taxed like an asset sale, which is often exactly what a buyer wants because it gives them bigger future write-offs.',
      'Because that election helps the buyer, a well-advised seller uses it as a bargaining chip — buyers will frequently pay more to get it. But it can also shift some of your gain into a higher-taxed category, so it is not automatically good for you.',
      'This is a negotiation lever, and getting it right can move real money. We model both sides so you know what to ask for and what to accept.'
    ],
    analogy: 'It is the difference between selling the keys to your business and selling everything inside it — same handshake, very different tax outcome.',
    benefits: [
      'Can increase what a buyer is willing to pay',
      'Turns a share sale into the asset sale buyers prefer',
      'A powerful negotiation lever at the closing table',
      'Modeled for your specific numbers before you agree'
    ],
    steps: [
      'We confirm your sale can use the election',
      'We model the result for you and for the buyer',
      'We help you negotiate the price to reflect it',
      'We file the election correctly with both signatures'
    ],
    considerations: [
      'It can shift some of your gain into a higher-taxed bucket — we check that it still nets out in your favor.',
      'It only works if the buyer signs too, so it is part of the deal negotiation.'
    ]
  },

  inputs: [],

  appliesTo: function (profile) {
    return true;
  },

  apply: function (profile, params, yearIndex, state) {
    return { profile: profile, notes: yearIndex === 0
      ? ['Advisory strategy — appears in the plan documents but does not change the scenario math. This is a transaction-structuring election modeled at deal time, not from annual return inputs.']
      : [] };
  }
});
