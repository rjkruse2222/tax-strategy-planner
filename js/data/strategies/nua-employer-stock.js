/* ============================================================================
 * STRATEGY: Net Unrealized Appreciation (§402(e)(4))
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'nua-employer-stock',
  name: 'Net Unrealized Appreciation (§402(e)(4))',
  category: 'Retirement',
  applyOrder: 68,
  modeled: false,

  advisor: {
    summary:
      'When a participant takes a qualifying lump-sum distribution of employer ' +
      'securities from a qualified plan (401(k), ESOP, profit-sharing plan), ' +
      '§402(e)(4) allows the participant to pay ordinary income tax only on the ' +
      'stock\'s COST BASIS at the time of distribution. The net unrealized ' +
      'appreciation (NUA) — the excess of fair market value over basis at ' +
      'distribution — is not taxed until the stock is later sold, and at that ' +
      'point it is taxed at long-term capital gain rates under §1(h) regardless ' +
      'of the actual holding period, with no NIIT exposure at the time of the ' +
      'distribution itself. This trades an up-front ordinary-income hit on ' +
      'basis for LTCG treatment on the appreciation — most powerful when the ' +
      'stock is highly appreciated and the participant is in a high ordinary ' +
      'bracket, since it avoids converting a large embedded capital gain into ' +
      'ordinary income (and avoiding a subsequent taxable rollover-and-sale ' +
      'that would otherwise recharacterize the whole gain as ordinary IRA ' +
      'income when eventually withdrawn).',
    mechanics: [
      'Requires a "lump-sum distribution": the participant\'s entire balance ' +
      'under all of the employer\'s plans of that type is distributed within ' +
      'one taxable year, triggered by separation from service, reaching age ' +
      '59½, death, or disability (for a self-employed participant).',
      'At distribution, ordinary income tax (and, if applicable, the 10% ' +
      'early-distribution penalty on the basis portion if under 59½ without ' +
      'another exception) applies only to the plan\'s cost basis in the stock, ' +
      'reported on Form 1099-R with the NUA amount separately identified in ' +
      'box 6.',
      'The NUA itself is not taxed at distribution and is not subject to the ' +
      '3.8% NIIT under §1411 at that time, since it has not yet been recognized ' +
      'as income.',
      'When the stock is later sold, the NUA portion is taxed at long-term ' +
      'capital gain rates under §1(h) no matter how long it is actually held ' +
      'after distribution; any further appreciation after distribution is ' +
      'short- or long-term capital gain depending on the post-distribution ' +
      'holding period.',
      'Rolling the stock into an IRA instead of taking it as an NUA ' +
      'distribution forfeits the strategy entirely — all future withdrawals ' +
      'from the IRA, including what would have been NUA, are taxed as ordinary ' +
      'income, and this election cannot be made after a rollover has occurred.',
      'The decision is irrevocable stock-by-stock at distribution and depends ' +
      'heavily on plan-specific facts (available lump-sum treatment, cost ' +
      'basis records, the participant\'s liquidity needs and diversification ' +
      'preferences) that are outside what a projected tax return can compute.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §402(e)(4)', note: 'Net unrealized appreciation rule for lump-sum distributions of employer securities from a qualified plan — ordinary income limited to cost basis; NUA deferred until sale.' },
      { type: 'IRC', cite: 'IRC §1(h)', note: 'Long-term capital gain rate structure applied to the NUA when the stock is later sold, regardless of the actual post-distribution holding period for the NUA portion.' }
    ],
    requirements: [
      'A true lump-sum distribution: the entire balance of all the employer\'s plans of that type paid out within one taxable year.',
      'A qualifying triggering event: separation from service, attainment of age 59½, death, or disability (self-employed).',
      'Employer securities held within the qualified plan with a determinable cost basis distinct from current fair market value.',
      'The stock must be distributed in kind (not sold inside the plan and distributed as cash) and NOT rolled into an IRA.',
      'Sufficient outside liquidity to pay the ordinary tax (and any 10% penalty) due on the basis portion in the distribution year, since the stock itself is illiquid appreciation until sold.'
    ],
    risks: [
      'Any rollover of part or all of the distribution to an IRA taints the lump-sum-distribution requirement for that portion and forfeits NUA treatment on it — this is a common, irreversible mistake.',
      'If the "entire balance" requirement is not met (e.g., an outstanding plan loan or a prior partial distribution in the same year), the lump-sum-distribution status can fail entirely.',
      'Ordinary tax (and possible 10% penalty) is due in the distribution year even though the stock has not been sold and no cash may have been received — a liquidity trap without other funds on hand.',
      'Concentrates the participant in a single stock outside the diversification of a typical rollover IRA; a subsequent decline in the stock before sale erodes the benefit that was already taxed.',
      'Cost basis records from the plan administrator must be accurate and well-documented — disputes over basis directly change both the ordinary income recognized and the NUA amount.',
      'Post-distribution appreciation is capital gain but is short-term if the stock is sold within a year of distribution — only the NUA portion itself gets automatic long-term treatment.'
    ],
    bestFit: [
      'Retiring or separating employees holding significantly appreciated employer stock inside a 401(k) or ESOP, with cost basis well below current fair market value.',
      'Participants in high ordinary-income brackets who have other funds available to pay the basis-year tax without selling the stock.',
      'Clients comfortable holding a concentrated equity position for some period after distribution, with a diversification plan for the shares over time.'
    ],
    implementation: [
      'Confirm lump-sum-distribution eligibility with the plan administrator (triggering event, single-year full-balance distribution, no disqualifying rollovers).',
      'Obtain the plan\'s documented cost-basis calculation for the employer stock before making any distribution election.',
      'Model the basis-year ordinary tax (and penalty exposure if under 59½) against available outside liquidity before electing NUA treatment.',
      'Direct the plan to distribute the stock in kind to a taxable brokerage account — not an IRA — and roll any non-stock plan assets to an IRA separately if desired.',
      'Track the distribution-date fair market value and basis for 1099-R reporting and for computing capital gain on eventual sale.',
      'Coordinate the sale timing of the shares with the client\'s broader diversification and cash-flow plan; remember only the NUA is automatically long-term.'
    ]
  },

  client: {
    teaser: 'A little-known move for company stock sitting inside your retirement plan that can turn a chunk of future tax into a much lower rate',
    headline: 'Get company stock out of your retirement plan at a lower tax rate',
    plainEnglish: [
      'If you hold shares of your employer\'s stock inside your 401(k) or similar retirement plan, and that stock has grown a lot in value, there is a special rule that can save you real money when you leave the company. Normally, everything that comes out of a 401(k) is taxed at your regular income tax rate, which can be quite high.',
      'This rule lets you pay tax on just the original cost of the stock at your regular rate, and then pay the lower long-term investment tax rate on all the growth — but only when you actually sell the shares later, not right away. The catch is the stock has to come out of the plan as actual shares, not cash, and it cannot be rolled into an IRA — once you roll it over, this opportunity is gone for good.',
      'This only makes sense in specific situations, and getting it right depends on details about your plan and your stock that a projection alone cannot capture, so we walk through the numbers with you before you leave your employer, not after.'
    ],
    analogy: 'It is like separating a rock you bought for $10 from the $90 it grew to be worth — you pay ordinary tax on the $10 now, and a lower rate on the $90 only when you decide to sell.',
    benefits: [
      'Pays your regular tax rate only on what the stock originally cost, not what it is worth today',
      'The growth is taxed at the lower long-term investment rate whenever you sell',
      'No extra investment surtax on that growth at the time you take the distribution',
      'Can be a meaningful saving if your company stock has appreciated substantially'
    ],
    steps: [
      'We review your plan statements to see if you qualify and what the stock\'s original cost basis is',
      'We model the up-front tax bill against your other resources to make sure you can afford it',
      'We coordinate the in-kind stock distribution with your plan administrator — timing matters',
      'We help you plan when to eventually sell the shares'
    ],
    considerations: [
      'This is a one-time, irreversible decision made when you leave your employer — it cannot be undone or added later.',
      'You owe tax on the original cost of the stock in the year you take it out, even before you sell any shares, so you need other cash available.',
      'Rolling the stock into an IRA instead of taking it out directly eliminates this opportunity entirely.'
    ]
  },

  inputs: [],

  appliesTo: function (profile) {
    return true; // depends on plan/lump-sum facts outside the return
  },

  apply: function (profile, params, yearIndex, state) {
    return { profile: profile, notes: yearIndex === 0
      ? ['Advisory strategy — appears in the plan documents but does not change the scenario math.']
      : [] };
  }
});
