/* ============================================================================
 * STRATEGY: Trader Tax Status & §475(f) Election
 * One source object → advisor view, client PDF, client slideshow.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'trader-mark-to-market-475f',
  name: 'Trader Tax Status & §475(f) Election',
  category: 'Income Timing & Character',
  applyOrder: 50,
  modeled: false,

  advisor: {
    summary:
      'A taxpayer whose securities (and/or commodities) trading is frequent, ' +
      'substantial, regular, and continuous enough to constitute a trade or ' +
      'business — "trader tax status" (TTS) — rather than mere investing can ' +
      'deduct ordinary and necessary trading-business expenses (platform ' +
      'fees, data feeds, home-office costs, margin interest as investment ' +
      'interest or business interest depending on facts) that an investor ' +
      'cannot. Separately, a qualifying trader may make a §475(f) ' +
      'mark-to-market election, which converts securities and/or commodities ' +
      'gains and losses from capital to ORDINARY character, marks open ' +
      'positions to market at year-end as if sold, and — critically — removes ' +
      'both the $3,000 annual capital-loss limitation of §1211(b) and the ' +
      '§1091 wash-sale rule for the electing positions. The tradeoff is losing ' +
      'preferential long-term capital gains rates on any gains. TTS itself is ' +
      'a facts-and-circumstances determination with no bright-line safe ' +
      'harbor, and the §475(f) election has an unforgiving timing trap for an ' +
      'existing trading activity.',
    mechanics: [
      'Trader tax status is not defined by a bright-line test in the Code; ' +
      'courts and the IRS look to trading frequency (near-daily activity), ' +
      'dollar volume, holding periods (short, typically intraday to a few ' +
      'days), continuity/regularity throughout the year, and the taxpayer\'s ' +
      'purpose (seeking to profit from short-term market swings, not ' +
      'long-term appreciation or dividend/interest income).',
      'Without TTS, a taxpayer is an "investor": trading gains/losses are ' +
      'capital, investment expenses are largely non-deductible after TCJA\'s ' +
      'suspension of miscellaneous itemized deductions, and margin interest ' +
      'is limited investment interest expense.',
      'With TTS but WITHOUT a §475(f) election, the taxpayer deducts trading ' +
      'business expenses on Schedule C (net trading business expenses only — ' +
      'trading gains/losses themselves generally still remain capital, ' +
      'reported on Schedule D/Form 8949) and avoids self-employment tax on ' +
      'trading gains (trading is not a §1402 trade or business for SE tax ' +
      'purposes even with TTS).',
      'The §475(f) election converts the character of gains and losses from ' +
      'trading (for the electing activity) to ORDINARY, requires marking open ' +
      'positions to market at year-end (unrealized gain/loss recognized as ' +
      'if sold at FMV on the last business day of the year, with a ' +
      'corresponding basis adjustment), removes the $3,000 capital-loss cap ' +
      'of §1211(b) so ordinary losses offset any income without limit, and ' +
      'removes the §1091 wash-sale rule for the marked positions.',
      'Cost of the election: gains lose access to preferential long-term ' +
      'capital gains rates — everything is ordinary, which can hurt a trader ' +
      'with substantial net gains in a low-loss year. The election is ' +
      'irrevocable without IRS consent and, once made, generally applies to ' +
      'all subsequent years until revoked with consent.',
      'Timing trap for an EXISTING trading business: the §475(f) election ' +
      'for an ongoing activity must be made by attaching a statement to a ' +
      'timely filed return (or extension) for the PRIOR tax year — i.e., the ' +
      'election is due by the original due date of the return for the year ' +
      'BEFORE the year it is to take effect (Rev. Proc. 99-17). A new ' +
      'trading entity formed during the year has a narrower window tied to ' +
      'its formation. Missing the deadline means waiting an entire additional year.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §475(f)', note: 'Permits a trader in securities and/or commodities to elect mark-to-market accounting, converting trading gains/losses to ordinary character and requiring year-end mark-to-market of open positions.' },
      { type: 'IRC', cite: 'IRC §1211(b)', note: 'The $3,000 annual limit on deducting net capital losses against ordinary income that a valid §475(f) election avoids by converting the character to ordinary.' },
      { type: 'IRC', cite: 'IRC §1091', note: 'The wash-sale rule disallowing losses on substantially identical securities repurchased within 30 days — does not apply to positions covered by a valid §475(f) mark-to-market election.' },
      { type: 'Admin', cite: 'Rev. Proc. 99-17', note: 'Procedure for making and the timing of the §475(f) election — for an existing trading business, the election statement is due with the return (or extension) for the year PRECEDING the first election year.' }
    ],
    requirements: [
      'Trading activity that is frequent, substantial in dollar volume, and continuous/regular throughout the year — sporadic or seasonal trading does not qualify.',
      'A genuine profit motive from short-term price swings, evidenced by short average holding periods, not long-term investment or income-collection intent.',
      'Substantial time devoted to trading as a business activity (courts often look for it to be the taxpayer\'s primary or a very significant activity).',
      'For the §475(f) election on an existing activity: a timely filed statement attached to the PRIOR year\'s return (or a timely extension of it) — the election cannot be made retroactively after that deadline passes.',
      'Contemporaneous records supporting both trader status (trade logs, time records) and, if elected, the mark-to-market computation on open positions at year-end.'
    ],
    risks: [
      'Trader tax status has no statutory safe harbor — the IRS and Tax Court apply a facts-and-circumstances test, and borderline traders (part-time, lower volume, longer average holds) are a recurring audit and litigation issue.',
      'The §475(f) election TIMING TRAP is unforgiving: for an existing trading business, missing the prior-year due date means the earliest possible effective year is pushed out a full additional year — there is no way to elect mid-year for the current year\'s activity once that date has passed.',
      'The election is a package deal for the electing trading business — a trader cannot selectively mark only losing positions; once made it generally binds all covered positions and future years absent IRS consent to revoke.',
      'Converting to ordinary character sacrifices preferential long-term capital gains rates on winning positions — in a strong up year this can raise the tax bill relative to staying a capital-gain investor.',
      'Trading is not a §1402 trade or business for self-employment tax even with TTS/§475(f) — do not assume SE tax exposure changes, and do not overstate the benefit by conflating it with QBI/passthrough treatment.',
      'Segregating a genuine long-term investment portfolio from the mark-to-market trading book (a valid, IRS-recognized practice) requires clean, contemporaneous separation — commingled accounts undermine both the TTS claim and the election\'s integrity.'
    ],
    bestFit: [
      'Active, full-time or near-full-time traders with high volume, short average holding periods, and demonstrable continuity across the year.',
      'Traders currently absorbing losses beyond the $3,000 capital-loss cap, or repeatedly hit by wash-sale disallowances on active short-term positions.',
      'Clients who plan far enough ahead to make the §475(f) election by the prior-year deadline rather than discovering the strategy after the window has closed.'
    ],
    implementation: [
      'Document trading activity contemporaneously now (trade frequency, volume, average holding period, time spent) to build the facts-and-circumstances case for TTS before any exam.',
      'If TTS is supportable, set up a trading business structure (Schedule C, or an entity) to deduct trading expenses; confirm SE tax does not apply to the trading gains themselves.',
      'To make the §475(f) election for an existing activity, prepare and timely file the election statement with the return (or extension) for the year BEFORE the intended first mark-to-market year — calendar this deadline well in advance.',
      'Segregate any long-term investment holdings the client wants to keep on capital-gain treatment from the mark-to-market trading account, with a contemporaneous identification, consistent with IRS guidance on securities traders.',
      'At year-end after the election is in effect, compute the mark-to-market adjustment on open positions and report trading gains/losses as ordinary income (generally Form 4797), reflecting no $3,000 loss cap and no wash-sale adjustments on the marked positions.'
    ]
  },

  client: {
    teaser: 'For active traders: a way to deduct trading costs and free losses from the usual annual cap',
    headline: 'Trade for a living? Your tax treatment can catch up to your activity',
    plainEnglish: [
      'If you trade stocks or other securities actively enough — frequently, in real volume, day in and day out — the tax law can treat you as running a trading business rather than just being an investor. That unlocks the ability to deduct your trading costs (data feeds, platforms, a home office) the way any business deducts its expenses.',
      'There is also an optional election that goes further: it treats all your trading gains and losses as ordinary business income instead of investment gains. The upside is real — you lose the usual $3,000-a-year cap on deducting trading losses, and a rule that disallows losses when you quickly re-buy a security you just sold no longer applies to you. The tradeoff is that your winning trades no longer get the lower long-term investment tax rate — everything is taxed at ordinary rates instead.',
      'Two things make this strategy tricky: qualifying as a trader is a judgment call with no simple checklist, and the deeper election has a strict advance deadline — it has to be filed with the PRIOR year\'s return, so it cannot be decided after the fact. We need to plan this well before the year it would apply to.'
    ],
    analogy: 'It is like switching from an amateur athlete\'s tax treatment to a professional\'s — you get to deduct your gear and travel like a business, but you also play by the pros\' rules going forward.',
    benefits: [
      'Deduct real trading-business costs that an ordinary investor cannot',
      'Optional election removes the $3,000 annual cap on deducting trading losses',
      'Optional election also turns off the rule that disallows losses on quick re-purchases',
      'Formalizes tax treatment that matches genuinely active, full-time-style trading'
    ],
    steps: [
      'We review your trading activity and volume to assess whether trader status is supportable',
      'We help you keep the records that support that status if questioned',
      'If it fits, we prepare the special election well ahead of its strict prior-year deadline',
      'We handle the year-end reporting once the election is in place'
    ],
    considerations: [
      'This only fits genuinely active traders — occasional or part-time trading will not qualify, and claiming it without the activity to back it up is an audit risk.',
      'The deeper election trades away the lower long-term capital gains rate on winning trades in exchange for the loss and wash-sale benefits — it is a real tradeoff, not a free upgrade.',
      'The election deadline is unusually early — it must be filed with the prior year\'s return, so waiting until this year is over to decide is too late.'
    ]
  },

  inputs: [],

  appliesTo: function (profile) {
    return true; // advisory: depends on trading-activity facts and election timing outside the profile
  },

  apply: function (profile, params, yearIndex, state) {
    return { profile: profile, notes: yearIndex === 0
      ? ['Advisory strategy — appears in the plan documents but does not change the scenario math.']
      : [] };
  }
});
