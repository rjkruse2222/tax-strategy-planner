/* ============================================================================
 * STRATEGY: §1033 Involuntary Conversion Deferral
 * One source object → advisor view, client PDF, client slideshow.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'section-1033-involuntary-conversion',
  name: '§1033 Involuntary Conversion Deferral',
  category: 'Real Estate & Cost Recovery',
  applyOrder: 52,
  modeled: false,

  advisor: {
    summary:
      'When property is destroyed, stolen, condemned, or sold under threat of ' +
      'condemnation, §1033 lets the taxpayer defer gain recognized on ' +
      'insurance or condemnation proceeds that exceed adjusted basis, provided ' +
      'the proceeds are reinvested in property of similar or related use ' +
      'within the statutory replacement period. Unlike a §1031 like-kind ' +
      'exchange, which is elective and voluntary, §1033 is triggered by an ' +
      'involuntary event — a casualty, theft, or condemnation — not a ' +
      'taxpayer-initiated sale. The replacement property\'s basis carries over ' +
      '(reduced/increased by any gain not recognized or additional cash ' +
      'invested), preserving deferral rather than eliminating the gain.',
    mechanics: [
      'Qualifying events: destruction (in whole or part), theft, seizure, ' +
      'condemnation, or sale/exchange under threat or imminence of ' +
      'condemnation. A voluntary sale with no condemnation threat does not ' +
      'qualify — that is §1031 territory, not §1033.',
      'Deferral requires reinvestment in property "similar or related in ' +
      'service or use" to the converted property — a stricter standard for ' +
      'owner-used property than §1031\'s broad like-kind test, though real ' +
      'property held for investment or business use condemned under §1033(g) ' +
      'gets the more flexible like-kind standard.',
      'Replacement period: generally ends 2 years after the close of the ' +
      'first tax year in which any part of the gain is realized; extended to ' +
      '3 years for real property (land or buildings) held for productive use ' +
      'in a trade or business or for investment that is condemned or sold ' +
      'under threat of condemnation (§1033(g)). The period can start before ' +
      'the conversion (e.g., when condemnation becomes threatened).',
      'Recognition is limited to the extent proceeds are NOT reinvested — if ' +
      'every dollar of proceeds over basis is reinvested, no gain is ' +
      'currently recognized; any proceeds retained (not reinvested) are taxed ' +
      'to the extent of gain realized.',
      'Basis carryover: the replacement property\'s basis equals its cost, ' +
      'reduced by the amount of gain not recognized (i.e., the deferred gain ' +
      'attaches to the replacement, similar in spirit to §1031 but computed ' +
      'under §1033\'s own rules) — this is deferral, not forgiveness; a later ' +
      'sale of the replacement recognizes the built-in gain.',
      'An affirmative election to defer is required (there is no automatic ' +
      'nonrecognition) and is typically made by not reporting the gain on the ' +
      'return for the year of realization, with a statement describing the ' +
      'conversion and the replacement — or, if replacement has not yet ' +
      'occurred, by disclosure and later amendment if the replacement period ' +
      'is not met and the deferred gain becomes taxable.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §1033', note: 'Core involuntary-conversion deferral rule: nonrecognition of gain on proceeds reinvested in similar-use replacement property within the replacement period.' },
      { type: 'IRC', cite: 'IRC §1033(g)', note: 'Real property held for productive use in a trade or business or for investment that is condemned (or sold/exchanged under threat of condemnation) gets a like-kind (not similar-use) replacement standard and a 3-year replacement period.' },
      { type: 'Admin', cite: 'Form 4684 (Casualties and Thefts)', note: 'Reporting form for casualty/theft gains and losses, including the computation feeding into an involuntary-conversion deferral election.' }
    ],
    requirements: [
      'A qualifying involuntary event: casualty, theft, seizure, condemnation, or a sale/exchange under threat or imminence of condemnation — a voluntary sale does not qualify.',
      'Insurance or condemnation proceeds that exceed the property\'s adjusted basis (a gain position) — if proceeds are less than basis, this is a loss, not a §1033 deferral question.',
      'Reinvestment in property similar or related in service or use (or, for §1033(g) real property, like-kind) within the replacement period.',
      'A timely, affirmative election to defer, generally made by not reporting the gain and attaching a statement identifying the conversion and replacement (or committing to replace within the period).',
      'Recordkeeping tying the specific proceeds received to the specific replacement property acquired, and the dates of both the conversion event and the replacement.'
    ],
    risks: [
      'Missing the replacement-period deadline (2 years generally; 3 years for §1033(g) real property) converts the entire deferred gain into current-year taxable income in the year the period expires — track the deadline like a filing deadline, not a planning target.',
      '"Similar or related in service or use" is a facts-and-circumstances functional test for owner-used property (stricter than §1031\'s like-kind standard) — a straightforward property-type swap that would pass under §1031 can fail the similar-use test outside §1033(g).',
      'Partial reinvestment only defers gain to the extent reinvested — cash retained from the proceeds is taxed currently to the extent of realized gain.',
      'Depreciation recapture on the converted property is a separate layer not addressed by the deferral election and is outside this tool\'s scope (see CLAUDE.md scope notes on recapture).',
      'The deferred gain is basis-reduced into the replacement property — a future sale of the replacement recognizes the built-in gain; this is timing, not permanent avoidance, and should never be presented to the client as tax-free.'
    ],
    bestFit: [
      'Clients whose business or investment real property is condemned, or credibly threatened with condemnation, by a government authority (eminent domain, highway/utility projects).',
      'Clients suffering a casualty (fire, storm, other disaster) or theft where insurance proceeds exceed the property\'s tax basis.',
      'Clients able and willing to identify and close on replacement property within the statutory window — this is not a strategy for an undecided client running out the clock.'
    ],
    implementation: [
      'Document the involuntary event immediately: condemnation notice, insurance claim, police report, or threat-of-condemnation correspondence, with dates.',
      'Compute the gain realized (proceeds less adjusted basis) and calendar the replacement-period deadline (2 years generally / 3 years for §1033(g) real property) from the correct starting point.',
      'Identify and acquire replacement property that is similar or related in service or use (like-kind if §1033(g) applies) before the deadline.',
      'Report the casualty/condemnation on Form 4684 for the year of realization and attach a statement making the deferral election; retain proof linking proceeds to the replacement acquisition.',
      'If replacement has not closed by the return\'s filing deadline, disclose the intent to replace and monitor the deadline; amend if the period lapses without replacement.'
    ]
  },

  client: {
    teaser: 'When you lose property you did not choose to give up, the tax law gives you time to recover without a tax hit',
    headline: 'Rebuild after a loss without an extra tax bill',
    plainEnglish: [
      'Sometimes property is taken from you rather than sold by choice — a fire destroys a building, a thief takes valuable property, or the government condemns land for a highway or utility project. If the insurance payout or condemnation award is more than what you originally paid (adjusted for improvements and depreciation), that difference is normally a taxable gain — even though you never chose to sell.',
      'The tax law recognizes that is not the same as a voluntary sale. If you use the proceeds to buy replacement property that serves a similar purpose, within a set window of time (usually two years, three years for business or investment real estate taken by the government), you can defer paying tax on that gain until you eventually sell the replacement property.',
      'This is a deferral, not a permanent write-off — the gain moves into the replacement property and would be taxed on a future sale. But it means a disaster or condemnation does not also become a surprise tax bill in the year it happens, while you are already dealing with rebuilding.'
    ],
    analogy: 'It is like an insurance claim for your tax bill: the loss itself does not have to also cost you in taxes, as long as you put the money back into a similar asset in time.',
    benefits: [
      'No current tax on the gain from insurance or condemnation proceeds, as long as you reinvest in time',
      'Applies to casualties, theft, and government condemnation — not just one type of event',
      'Business and investment real property taken by condemnation gets extra time (three years) and more flexibility in what counts as a replacement',
      'Keeps cash available for rebuilding instead of diverting it to an unexpected tax bill'
    ],
    steps: [
      'We document the event and calculate the gain as soon as it happens',
      'We calendar your exact replacement deadline so it never gets missed',
      'We help confirm the replacement property qualifies before you commit to it',
      'We file the election and keep the paper trail your return needs'
    ],
    considerations: [
      'The replacement deadline is firm — miss it and the deferred gain becomes taxable all at once.',
      'The replacement property has to genuinely serve a similar purpose to what was lost; not just any purchase qualifies.',
      'This defers the tax, it does not erase it — the gain follows the replacement property until it is eventually sold.'
    ]
  },

  inputs: [],

  appliesTo: function (profile) {
    return true;
  },

  apply: function (profile, params, yearIndex, state) {
    return { profile: profile, notes: yearIndex === 0
      ? ['Advisory strategy — appears in the plan documents but does not change the scenario math.']
      : [] };
  }
});
