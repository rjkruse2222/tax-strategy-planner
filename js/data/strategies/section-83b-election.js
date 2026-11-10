/* ============================================================================
 * STRATEGY: §83(b) Election (Restricted Stock)
 * One source object → advisor view, client PDF, client slideshow.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'section-83b-election',
  name: '§83(b) Election (Restricted Stock)',
  category: 'Income Timing & Character',
  applyOrder: 22,
  modeled: false,

  advisor: {
    summary:
      'Under §83(a), a service provider who receives property (typically ' +
      'restricted/founder stock or an early-exercised option) in connection ' +
      'with the performance of services recognizes ordinary income only when ' +
      'the property is no longer subject to a substantial risk of forfeiture ' +
      '(usually at vesting), measured by the FMV at that later date. A §83(b) ' +
      'election lets the recipient instead include the spread — FMV minus any ' +
      'amount paid — in income NOW, at grant, while the stock is presumably ' +
      'worth very little. If FMV at grant is at or near the purchase price, ' +
      'current ordinary income is near zero, the holding period for capital ' +
      'gain purposes starts running immediately, and ALL future appreciation ' +
      'is taxed as capital gain (long-term, once held over a year) rather than ' +
      'ordinary income at each vesting tranche. The election is irrevocable ' +
      'and must be filed within a hard 30-day window with no exceptions.',
    mechanics: [
      'Without the election, §83(a) taxes each vesting tranche as ordinary ' +
      'income (and wages/SE income if received for services) at the FMV on ' +
      'the vesting date — capturing all appreciation between grant and each ' +
      'vesting date as ordinary income, and restarting the capital-gain ' +
      'holding period at each tranche.',
      'With a timely §83(b) election, the full spread at grant (FMV minus ' +
      'amount paid, if any) is included in income in the grant year; no ' +
      'further ordinary income is recognized as the stock later vests, and ' +
      'the capital-gain holding period begins at grant, not at each vesting date.',
      'Filed by delivering a written statement to the IRS office where the ' +
      'taxpayer files their return within 30 days of the transfer of ' +
      'property (Treas. Reg. §1.83-2), with a copy to the service ' +
      'recipient (employer) and (historically) attached to that year\'s ' +
      'return; confirm current e-file mailing procedure at filing time.',
      'If the stock is later forfeited (employment terminates before ' +
      'vesting, company fails) after a §83(b) election was made and tax was ' +
      'paid on the grant-date spread, no deduction is allowed for the tax ' +
      'paid on that spread — only a capital loss limited to the amount, if ' +
      'any, actually paid for the stock (Treas. Reg. §1.83-2(a)). The election ' +
      'is a bet the equity survives and grows.',
      'Best economics arise when the spread at grant is small (founder ' +
      'stock at incorporation, or an early exercise of options immediately ' +
      'after grant before FMV rises) — the smaller the current inclusion, the ' +
      'larger the future ordinary-income-to-capital-gain conversion.',
      'The election is irrevocable except with IRS consent under limited ' +
      'circumstances (mistake of fact about the underlying transaction); it ' +
      'cannot be reversed simply because the stock later declines in value.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §83(a)', note: 'Default rule: ordinary income on transfer of property for services is recognized when the property is transferable or no longer subject to a substantial risk of forfeiture, measured at that later FMV.' },
      { type: 'IRC', cite: 'IRC §83(b)', note: 'Election to include the grant-date spread in income immediately instead, starting the capital-gain holding period at grant; no deduction for tax paid if the property is later forfeited.' },
      { type: 'Reg', cite: 'Treas. Reg. §1.83-2', note: 'How and when to make the election: written statement filed with the IRS within 30 days of transfer, contents required, and the no-loss-deduction-on-forfeiture rule.' }
    ],
    requirements: [
      'Property must be "substantially nonvested" (subject to a substantial risk of forfeiture) at grant for the election to matter — vested stock is taxed at grant regardless.',
      'Written election filed with the IRS within 30 days of the transfer — calendar-day count from the grant/transfer date, no extensions, no reasonable-cause relief.',
      'Copy of the election delivered to the service recipient (employer/company) and retained by the taxpayer.',
      'FMV at grant must be defensible — a 409A valuation or comparable contemporaneous support for private-company stock.',
      'Taxpayer must have the cash to pay tax now on the grant-date spread (and, if applicable, cash to purchase the shares).'
    ],
    risks: [
      'THE 30-DAY DEADLINE IS ABSOLUTE — there is no late-election relief for a missed §83(b) filing (unlike some other elections with §9100 relief); missing it forecloses the strategy permanently for that grant.',
      'If the equity is later forfeited or the company fails, tax already paid on the grant-date spread is not refunded and is not deductible — only a capital loss for actual cash paid for the stock, if any.',
      'Filing accelerates tax into a year when the taxpayer may have no liquidity to pay it, especially for larger grants or higher grant-date FMVs.',
      'An aggressive or unsupported low FMV at grant invites exam risk if the valuation cannot be substantiated.',
      'Once made, the election cannot be undone if the stock unexpectedly appreciates faster than planned before the taxpayer wanted the income recognized (it cuts the other way too — the client cannot "wait and see").'
    ],
    bestFit: [
      'Founders and very early employees receiving restricted stock or exercising options immediately after grant, when FMV is at or near the purchase price.',
      'Clients with the cash on hand to pay tax on the (ideally small) grant-date spread without selling the illiquid stock.',
      'Situations with a credible, contemporaneous FMV determination (recent 409A or arm\'s-length pricing).'
    ],
    implementation: [
      'Identify the transfer date the instant restricted stock is issued or an option is early-exercised — the 30-day clock starts there, not at a later "decision" date.',
      'Obtain or confirm a defensible FMV as of the transfer date before drafting the election.',
      'Prepare and timely file the written §83(b) election with the IRS service center for the taxpayer\'s return, and deliver a copy to the company; keep proof of mailing (certified mail, return receipt).',
      'Report the includible spread (if any) as income for the grant year; retain the election copy with permanent tax records for future basis and holding-period support.',
      'Track the adjusted basis (amount paid plus amount included in income) and the grant-date start of the holding period for use when the stock is eventually sold.'
    ]
  },

  client: {
    teaser: 'A simple 30-day paperwork move that can turn future stock gains into the lowest tax rate you\'ll ever see on them',
    headline: 'Lock in today\'s low value on your equity — before it grows',
    plainEnglish: [
      'When you receive company stock that you have to earn over time (it "vests"), the tax law normally waits and taxes you later, as each piece vests, based on what it\'s worth on that future date — usually much higher than what it was worth when you got it. There\'s a special election that lets you flip that around: pay tax now, while the stock is worth little or nothing extra, and then owe nothing more as it vests. All the growth from here becomes long-term investment gain instead of ordinary income — a much better tax rate, once you\'ve held it a year.',
      'The catch is timing: you have exactly 30 days from the day you receive the stock to file this election with the IRS. There are no exceptions and no do-overs if you miss it — not for a good reason, not for any reason. So this only works if we act immediately when the stock is granted.',
      'There is also a real risk to weigh: if you leave the company early or it doesn\'t work out and your unvested shares are forfeited, the tax you already paid on the grant-date value is gone — you don\'t get it back. This is a strategy for equity you believe in and plan to stick with.'
    ],
    analogy: 'It is like paying sales tax on a house lot before you build on it, instead of paying tax on the finished mansion later — as long as you\'re confident you\'re going to build.',
    benefits: [
      'Converts future stock appreciation from ordinary income into (long-term) capital gain rates',
      'Starts your favorable long-term holding period on day one instead of restarting it each time a chunk vests',
      'Current tax bill can be very small or near zero if filed right when the stock is worth little',
      'One simple form, filed once, with no ongoing complexity'
    ],
    steps: [
      'The moment you\'re granted restricted stock or early-exercise an option, we start the 30-day clock',
      'We confirm a defensible value for the stock as of the grant date',
      'We prepare and file the election with the IRS well inside the deadline, with proof of mailing',
      'We track your basis and holding period for when you eventually sell'
    ],
    considerations: [
      'The 30-day deadline cannot be extended for any reason — if we miss it, this door is closed for good on that grant.',
      'If the stock is later forfeited or the company fails, the tax you paid up front is not refunded — this only makes sense for equity you believe in.',
      'You need to be able to pay the tax bill now, in cash, without selling the (illiquid) stock itself.'
    ]
  },

  inputs: [],

  appliesTo: function (profile) {
    return true; // advisory: depends on grant-date facts outside the profile
  },

  apply: function (profile, params, yearIndex, state) {
    return { profile: profile, notes: yearIndex === 0
      ? ['Advisory strategy — appears in the plan documents but does not change the scenario math.']
      : [] };
  }
});
