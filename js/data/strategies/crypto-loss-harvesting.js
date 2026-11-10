/* ============================================================================
 * STRATEGY: Crypto Tax-Loss Harvesting (Wash-Sale Gap)
 * One source object → advisor view, client PDF, client slideshow.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'crypto-loss-harvesting',
  name: 'Crypto Tax-Loss Harvesting (Wash-Sale Gap)',
  category: 'Income Timing & Character',
  applyOrder: 51,
  modeled: false,

  advisor: {
    summary:
      'The §1091 wash-sale rule disallows a loss on the sale of "stock or ' +
      'securities" when substantially identical property is reacquired within ' +
      '30 days before or after the sale. The IRS has held since Notice 2014-21 ' +
      'that convertible virtual currency is PROPERTY, not a security, for ' +
      'federal tax purposes. Under current law that combination lets a ' +
      'taxpayer sell a crypto position at a loss and immediately repurchase ' +
      'the same coin — preserving market exposure — without §1091 disallowing ' +
      'the loss. The harvested loss offsets capital gains and up to $3,000 of ' +
      'ordinary income per year under §1211(b), with any excess carrying ' +
      'forward. This is a timing/character gap in the current statute, not a ' +
      'permanent exemption, and Congress has repeatedly proposed extending ' +
      'wash-sale treatment to digital assets.',
    mechanics: [
      '§1091 applies only to "stock or securities" (and, separately, ' +
      'contracts/options to acquire or sell them) — its text has never been ' +
      'extended by statute to cover property that is not stock or a security.',
      'Notice 2014-21 states that convertible virtual currency is treated as ' +
      'property for federal tax purposes; general property transactions apply ' +
      '(basis, holding period, gain/loss on each disposition) rather than the ' +
      'securities rules.',
      'Practical effect: sell a crypto lot at a loss, recognize the loss ' +
      'immediately, and repurchase the same asset the same day without the ' +
      '30-day-before/30-day-after window that would taint an identical stock ' +
      'trade — new basis is simply the repurchase price, no basis carryover ' +
      'adjustment as §1091 would otherwise require.',
      'Loss netting is ordinary capital-gain rules: short-term losses net ' +
      'against short-term gains, long-term against long-term, then cross-net; ' +
      'a net capital loss offsets up to $3,000 of ordinary income per year ' +
      '(§1211(b)), with the excess carried forward indefinitely retaining ' +
      'character (§1212(b)).',
      'This is loss harvesting, not gain avoidance — it only produces a real ' +
      'cash-tax benefit when there is a genuine unrealized loss to realize; ' +
      'repurchasing does not create a loss, it only preserves exposure while ' +
      'one is captured.',
      'Every disposition (including the immediate repurchase-and-later-sale) ' +
      'is a separate taxable event requiring its own basis and holding-period ' +
      'tracking — exchanges and wallets rarely produce broker-quality basis ' +
      'reporting, so recordkeeping is the practical bottleneck, not the law.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §1091', note: 'Wash-sale disallowance is limited by its text to losses on "stock or securities" (and related contracts/options) — it does not by its terms reach other property.' },
      { type: 'Admin', cite: 'IRS Notice 2014-21', note: 'Convertible virtual currency is treated as property, not currency or a security, for federal tax purposes — the basis for concluding §1091 does not apply to crypto under current law.' },
      { type: 'IRC', cite: 'IRC §1211(b)', note: 'Capital losses allowed against capital gains plus up to $3,000 of ordinary income per year ($1,500 MFS).' },
      { type: 'IRC', cite: 'IRC §1212(b)', note: 'Indefinite carryforward of unused capital losses, retaining short/long character.' }
    ],
    requirements: [
      'A taxable (non-retirement-account) position in a digital asset with an unrealized loss versus its tax basis.',
      'Lot-level basis and acquisition-date records sufficient to identify which lots are sold (specific identification where the exchange/wallet supports it).',
      'Willingness to immediately repurchase to maintain market exposure — the strategy only preserves the client\'s position while capturing the loss; it is not a market-timing call.',
      'A realized or projected capital gain (or ordinary income up to the $3,000 cap) for the loss to offset in the current or a carryforward year.'
    ],
    risks: [
      'NOT PERMANENT: multiple legislative proposals (including prior Build Back Better-style drafts and subsequent bills) have sought to extend wash-sale treatment to digital assets; this gap exists only because no such statute has yet been enacted — monitor every year for a change effective date.',
      'Recordkeeping risk: cross-exchange and wallet-to-wallet transfers, staking, and DeFi transactions often break basis chains — the IRS can challenge a claimed loss for lack of substantiation even where the law otherwise allows it.',
      'Economic substance: repeated same-day round-trips with no genuine market risk in between invite an economic-substance or sham-transaction challenge in an aggressive fact pattern, even absent a wash-sale statute — document a real, if brief, market-exposure gap where practical.',
      'State conformity varies; some states may apply their own loss rules differently — verify state treatment separately.',
      'This does not extend to actual securities (including crypto-linked ETPs, which ARE securities) — do not apply the same treatment to a spot-crypto ETF or trust share.'
    ],
    bestFit: [
      'Clients holding direct digital-asset positions (not crypto ETFs/ETPs) with unrealized losses and offsetting capital gains elsewhere in the portfolio.',
      'Clients who already use conventional loss harvesting (see the Capital Gain & Loss Harvesting strategy) and have crypto as a distinct, separately tracked asset class.',
      'Clients comfortable with the reversal risk if Congress closes the gap — size the plan around current-year benefit, not a multi-year assumption.'
    ],
    implementation: [
      'Pull exchange/wallet transaction history and reconcile lot-level basis before year end; specific-identification where the platform supports it.',
      'Identify lots with unrealized losses; confirm they are true property positions (not ETPs/securities) before relying on the §1091 gap.',
      'Execute the sale and repurchase, documenting timestamps and prices for the file.',
      'Report each disposition on Form 8949/Schedule D; track any §1211(b)/§1212(b) carryforward in the permanent file.',
      'Re-confirm current law each filing season before repeating — flag any enacted digital-asset wash-sale legislation immediately to the client.'
    ]
  },

  client: {
    teaser: 'A timing gap in how digital assets are taxed compared to stocks',
    headline: 'Turn crypto dips into tax savings, without leaving the market',
    plainEnglish: [
      'If you sell a stock at a loss and buy it right back within 30 days, the tax law erases the loss — you have to wait it out or buy something different. Digital assets like Bitcoin and Ethereum are not treated as stocks or securities under current tax rules; they are treated as property. That difference means, under today\'s law, you can sell a losing crypto position and buy it right back immediately, capturing the tax loss without giving up your position.',
      'The captured loss can reduce taxes on other investment gains, plus up to $3,000 of your regular income each year, with anything left over carrying into future years.',
      'This is a rule about how the law currently draws a line between "securities" and "property" — not a permanent guarantee. Lawmakers have proposed closing this gap more than once, so we treat it as a this-year opportunity to revisit annually, not a strategy to build a multi-year plan around.'
    ],
    analogy: 'It is like a coupon that works for one type of purchase but not a nearly identical one next door — useful while the store honors it, but the store could change the policy any time.',
    benefits: [
      'Captures real tax losses on crypto dips without exiting your position',
      'Losses offset other investment gains and up to $3,000 of ordinary income each year',
      'Unused losses carry forward automatically',
      'No 30-day waiting period the way there is with stocks'
    ],
    steps: [
      'We review your crypto holdings for positions currently worth less than you paid',
      'We confirm your records support the loss (crypto recordkeeping is the tricky part, not the tax law)',
      'You sell and immediately repurchase to stay invested',
      'We report the loss and track anything that carries forward'
    ],
    considerations: [
      'This is a gap in current law that Congress has repeatedly tried to close — we revisit it every year rather than assuming it continues.',
      'It only helps if you have an actual loss to capture; buying and selling by itself does not create tax savings.',
      'Good records matter — crypto exchanges do not always report basis the way stock brokers do, so we need clean transaction history.'
    ]
  },

  inputs: [],

  appliesTo: function (profile) {
    return true;
  },

  apply: function (profile, params, yearIndex, state) {
    return { profile: profile, notes: yearIndex === 0
      ? ['Advisory strategy — appears in the plan documents but does not change the scenario math. See the Capital Gain & Loss Harvesting strategy for the modeled mechanics of loss harvesting; this entry documents the current-law wash-sale gap specific to digital assets and is not modeled separately to avoid double-counting harvested losses.']
      : [] };
  }
});
