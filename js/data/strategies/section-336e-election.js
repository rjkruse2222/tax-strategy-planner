/* ============================================================================
 * STRATEGY: §336(e) Election (Asset-Sale Treatment)
 * Advisory — appears in plan documents, does not change scenario math.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'section-336e-election',
  name: '§336(e) Election (Asset-Sale Treatment)',
  category: 'Succession & Exit',
  applyOrder: 78,
  modeled: false,

  advisor: {
    summary:
      'A §336(e) election lets a "qualified stock disposition" of an S ' +
      'corporation (or a corporate subsidiary) be treated, for tax purposes ' +
      'only, as if the target sold all its assets and liquidated — the same ' +
      'stepped-up, depreciable/amortizable asset basis a §338(h)(10) election ' +
      'produces. The critical difference: §338(h)(10) requires the buyer to be ' +
      'a corporation making a qualified stock purchase; §336(e) has no such ' +
      'requirement, so it fills the gap whenever the buyer is an individual, a ' +
      'private-equity fund organized as a partnership/LLC, or any other ' +
      'non-corporate purchaser. It is also unilateral — elected by the seller ' +
      'side alone, with no buyer signature required — though the deal price is ' +
      'still typically negotiated around the seller\'s resulting tax cost.',
    mechanics: [
      'Qualified stock disposition: a sale, exchange, distribution, or any ' +
      'combination that disposes of at least 80% of the vote and value of the ' +
      'target\'s stock within a 12-month period — the disposition, not the ' +
      'identity of the acquirer, is what makes the target eligible.',
      'No corporate-purchaser requirement: unlike §338(h)(10), the acquiring ' +
      'party need not be a corporation, which is exactly why §336(e) exists — ' +
      'to reach deals with individual buyers, family offices, or PE funds ' +
      'taxed as partnerships that could never make a §338(h)(10) election.',
      'Unilateral election: the election is made by the S corporation and its ' +
      'shareholders (or the selling consolidated group), not jointly with the ' +
      'buyer. For an S corp target, each shareholder — selling and ' +
      'non-selling — must consent, similar to the shareholder-consent ' +
      'requirement for a §338(h)(10) S-corp election.',
      'Deemed-sale mechanics: "old target" is treated as selling all its ' +
      'assets to an unrelated "new target" at fair market value and then ' +
      'liquidating; the deemed-sale gain computation and asset basis rules ' +
      'generally track the §338 operating rules by cross-reference.',
      'No Form 8023: the election is made by attaching a statement to the ' +
      'timely filed return of the S corporation (and, as applicable, each ' +
      'consenting shareholder) for the year of the disposition — there is no ' +
      'separate election form comparable to Form 8023 used for §338 elections.',
      'Legal form is unaffected: outside of tax, the transaction remains what ' +
      'it actually was — a stock sale. Only the tax treatment is recast, which ' +
      'is why buyer cooperation is not legally required even though the price ' +
      'is usually negotiated with the tax result in mind.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §336(e)', note: 'Authorizes regulations permitting a qualified stock disposition of an S corp or subsidiary to be treated as a deemed asset sale, without requiring a corporate purchaser.' },
      { type: 'Reg', cite: 'Treas. Reg. §1.336-1 through -5', note: 'The operative regulations: §1.336-1 definitions and scope (including "qualified stock disposition"), §1.336-2 election mechanics and consent requirements, §1.336-3 deemed-sale tax consequences, §1.336-4 special asset/liability allocation rules, §1.336-5 effective dates.' },
      { type: 'IRC', cite: 'IRC §338(h)(10)', note: 'The joint-election analog available only when the purchaser is a corporation — see the "Section 338(h)(10) Election" strategy; §336(e) is the tool when the buyer is not corporate.' },
      { type: 'IRC', cite: 'IRC §1060', note: 'Governs the purchase-price allocation across asset classes underlying the deemed asset sale.' }
    ],
    requirements: [
      'A qualified stock disposition: 80% vote/value of the target disposed of within a 12-month period, by sale, exchange, distribution, or a combination.',
      'A valid S election for an S-corp target, confirmed in diligence.',
      'Consent of every S-corp shareholder — selling and non-selling — since the election binds the entity as a whole.',
      'A supportable §1060 purchase-price allocation across asset classes.',
      'A timely-filed election statement attached to the required returns for the disposition year — there is no extension analog to a missed Form 8023 deadline.'
    ],
    risks: [
      'Because the election is unilateral, a seller can make it without buyer agreement, but the buyer\'s offer price should already reflect the seller\'s resulting ordinary-income/recapture exposure — negotiate the gross-up before electing, not after.',
      'A single non-consenting S-corp shareholder can block the election entirely.',
      'Deemed-sale gain is computed asset-by-asset, which can convert what would have been capital gain on a plain stock sale into ordinary income (e.g., depreciation recapture) — model the seller\'s after-tax proceeds, not just the buyer\'s step-up benefit.',
      'A defective or previously terminated S election undermines the whole structure — core due-diligence item, same as for §338(h)(10).',
      'State conformity to §336(e) and to the deemed-asset-sale character of gain varies by state — confirm separately.'
    ],
    bestFit: [
      'Sales of S corporations to non-corporate buyers — individuals, family offices, independent sponsors, or PE funds organized as partnerships/LLCs — where §338(h)(10) is simply unavailable.',
      'Deals with substantial goodwill or other step-up-eligible assets where the buyer values the future amortization/depreciation enough to pay for it.',
      'Sellers with manageable ordinary-income/recapture exposure, so the asset-sale recast does not erode net proceeds.'
    ],
    implementation: [
      'Confirm the disposition meets the 80% vote/value, 12-month qualified-stock-disposition test and that the S election is valid and intact.',
      'Model both sides — buyer step-up value vs. seller ordinary-income exposure — and negotiate any price gross-up before signing.',
      'Obtain written consent from every S-corp shareholder, selling and non-selling.',
      'Prepare the §1060 purchase-price allocation supporting the deemed asset sale.',
      'Attach the election statement to the S corporation\'s and consenting shareholders\' timely filed returns for the disposition year; report the deemed asset sale accordingly.'
    ]
  },

  client: {
    teaser: 'Even when the buyer isn\'t a corporation, how you paper the sale can still change your tax bill by six figures',
    headline: 'Get asset-sale tax treatment even when your buyer isn\'t a corporation',
    plainEnglish: [
      'There is a special election that lets the sale of your company\'s stock be taxed as if it were a sale of the company\'s individual assets instead — which is often exactly what a buyer wants, because it gives them bigger future tax write-offs. Most people have heard of the version of this election that requires the buyer to be a corporation. This is the version that works when the buyer is not — an individual, a family office, or an investment fund structured as a partnership.',
      'Unlike that other version, you and your company can make this election on your own — the buyer does not have to sign off on it. But because the election can shift some of your gain into a higher-taxed category, a well-advised seller still uses it as a bargaining chip: the buyer benefits, so the buyer should pay for it.',
      'This is a deal-structuring decision made at the negotiating table, not something we compute from your annual tax return. We model both sides before you agree to anything.'
    ],
    analogy: 'It is the same "sell the keys vs. sell everything inside" choice as the corporate-buyer version of this election — just built for the deals where the buyer isn\'t a corporation at all.',
    benefits: [
      'Can increase what a non-corporate buyer is willing to pay',
      'Delivers the buyer-favored asset-sale tax result without needing the buyer\'s signature',
      'A real negotiation lever at the closing table',
      'Modeled for your specific numbers before you agree to anything'
    ],
    steps: [
      'We confirm your sale qualifies (80% or more of the company changing hands within a 12-month window)',
      'We model the result for you and for the buyer',
      'We help you negotiate the price to reflect it',
      'We file the required election statement correctly and on time'
    ],
    considerations: [
      'It can shift some of your gain into a higher-taxed bucket — we check that it still nets out in your favor before recommending it.',
      'For an S corporation, every shareholder — not just those selling — has to consent.'
    ]
  },

  inputs: [],

  appliesTo: function (profile) {
    return true;
  },

  apply: function (profile, params, yearIndex, state) {
    return { profile: profile, notes: yearIndex === 0
      ? ['Advisory strategy — appears in the plan documents but does not change the scenario math. This is a transaction-structuring election modeled at deal time, not from annual return inputs. See the "Section 338(h)(10) Election" strategy for the joint-election analog used when the buyer is a corporation.']
      : [] };
  }
});
