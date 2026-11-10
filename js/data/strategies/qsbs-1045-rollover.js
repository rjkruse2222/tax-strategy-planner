/* ============================================================================
 * STRATEGY: §1045 QSBS Rollover
 * One source object → advisor view, client PDF, client slideshow.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'qsbs-1045-rollover',
  name: '§1045 QSBS Rollover',
  category: 'Income Timing & Character',
  applyOrder: 49,
  modeled: false,

  advisor: {
    summary:
      '§1045 lets a taxpayer who sells qualified small business stock (QSBS, ' +
      'as defined in §1202(c)) held more than 6 months, but not long enough ' +
      'to reach a §1202 exclusion tier, elect to defer recognition of the ' +
      'gain by purchasing replacement QSBS within 60 days of the sale. Gain is ' +
      'recognized only to the extent sale proceeds exceed the cost of the ' +
      'replacement stock, and the replacement stock\'s holding period tacks ' +
      'onto the original stock\'s holding period for purposes of the §1202 ' +
      'clock. This bridges an early, otherwise-taxable exit (say, an ' +
      'acquisition at 18 months) into eventual §1202 exclusion treatment on ' +
      'the replacement stock once the combined holding period reaches the ' +
      'exclusion tiers, without giving up the deferral in the interim.',
    mechanics: [
      'Eligibility: the stock sold must be QSBS under §1202(c) at the time of ' +
      'sale (domestic C corp, original issuance, gross-asset ceiling, active ' +
      'business test) and must have been held MORE THAN 6 months — a lower ' +
      'bar than §1202\'s own 3/4/5-year exclusion tiers.',
      'Mechanics: within 60 days after the sale, the taxpayer purchases ' +
      'replacement QSBS (any qualifying small business stock, not ' +
      'necessarily the same issuer). Recognized gain is limited to the ' +
      'excess of amount realized over the cost of the replacement stock; the ' +
      'rest is deferred by reducing the replacement stock\'s basis.',
      'Holding-period tacking: the replacement stock\'s holding period ' +
      'includes the period the original stock was held (§1223 principles as ' +
      'applied under §1045), which is what lets a taxpayer who sold at, say, ' +
      '18 months eventually reach the §1202 3-year (50%), 4-year (75%), or ' +
      '5-year (100%) tiers on the replacement stock sooner than starting a ' +
      'fresh clock.',
      'Election is made on the timely filed return (including extensions) ' +
      'for the year of sale, by reporting the sale on Form 8949 with the ' +
      'appropriate §1045 rollover adjustment and attaching the required ' +
      'replacement-stock information; consult current Form 8949/Schedule D ' +
      'instructions for the exact reporting format in the year of sale.',
      'Deferred, not excluded: unlike §1202\'s permanent exclusion, §1045 ' +
      'only defers gain by carrying over (reduced) basis into the ' +
      'replacement stock — the deferred gain resurfaces on a later, ' +
      'non-qualifying disposition of the replacement stock unless that later ' +
      'sale itself qualifies for §1202 exclusion (or another §1045 rollover).',
      'Available to individuals and certain pass-through entities (partnerships, ' +
      'S corporations) that held the original QSBS; partner-level or ' +
      'shareholder-level elections have their own mechanical rules that ' +
      'should be verified against the specific ownership structure.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §1045', note: 'Rollover of gain from the sale of QSBS held more than 6 months into replacement QSBS purchased within 60 days; recognized gain limited to proceeds in excess of replacement cost; basis carryover with holding-period tacking.' },
      { type: 'IRC', cite: 'IRC §1202', note: 'The exclusion regime §1045 rollover is designed to reach — tiered 50/75/100% exclusion at 3/4/5-year holds (OBBBA, stock acquired after 7/4/2025) or the pre-OBBBA 5-year cliff, which the tacked holding period on the replacement stock works toward.' },
      { type: 'IRC', cite: 'IRC §1202(c)', note: 'Defines qualified small business stock — the same definition §1045 requires the original (and replacement) stock to satisfy: domestic C corp, original issuance, gross-asset ceiling, active qualified business.' }
    ],
    requirements: [
      'Original stock qualified as QSBS under §1202(c) at the time of the sale and was held more than 6 months.',
      'Replacement QSBS purchased within 60 days after the sale date — a hard, short window requiring advance planning before the original sale closes if possible.',
      'Replacement stock itself must meet the §1202(c) QSBS definition at the time of purchase (domestic C corp, original issuance, asset ceiling, active business).',
      'Election made on a timely filed return (with extensions) for the year of the original sale, with the sale and rollover properly reported.',
      'Basis and holding-period records maintained connecting the original stock to the replacement stock for all future dispositions.'
    ],
    risks: [
      'The 60-day replacement window is unforgiving and often collides with real-world deal timing (escrow releases, earnouts) — plan the rollover before the sale closes, not after.',
      'Finding genuinely qualifying replacement QSBS within 60 days can be difficult — not every early-stage investment qualifies, and diligence on the replacement issuer\'s QSBS status takes time the window may not allow.',
      'Deferral is not exclusion: if the replacement stock is later sold before it independently qualifies for §1202 (or another §1045 rollover), the originally deferred gain plus any further appreciation is fully taxable.',
      'A subsequent disqualifying event at the replacement issuer (redemption, business-type change, exceeding the asset ceiling after issuance under some readings) can jeopardize the eventual §1202 payoff the rollover was built around.',
      'Complex basis-tracking across rollovers increases the chance of a reporting error on Form 8949 if not documented carefully at each step.'
    ],
    bestFit: [
      'QSBS holders forced into an early, otherwise fully taxable exit (acquisition, tender offer) before reaching a §1202 exclusion tier.',
      'Clients willing and able to identify and fund a qualifying replacement investment within 60 days.',
      'Situations where deferring and tacking toward §1202 materially beats paying full capital gains tax now — modeled case-by-case against the client\'s liquidity needs.'
    ],
    implementation: [
      'As soon as an early QSBS sale becomes likely, begin sourcing candidate replacement QSBS investments so the 60-day window is not a scramble.',
      'Before closing the original sale, diligence the replacement issuer\'s QSBS eligibility (entity type, gross assets at issuance, active business) — do not assume any "startup" investment qualifies.',
      'Close on the replacement stock purchase within 60 days of the original sale date; retain issuance documents supporting its own §1202(c) qualification.',
      'Report the original sale and the §1045 election on the year-of-sale return (Form 8949/Schedule D with the rollover adjustment) and retain records tying the deferred gain and tacked holding period to the replacement stock.',
      'Calendar the replacement stock\'s tacked holding-period milestones toward the §1202 3/4/5-year tiers for eventual exit planning; coordinate with the QSBS §1202 exclusion strategy at that later sale.'
    ]
  },

  client: {
    teaser: 'A way to sell early and still keep your shot at the biggest startup-stock tax break',
    headline: 'Sold your startup stock too soon? You may not have lost the big break',
    plainEnglish: [
      'There is a huge tax break for people who hold qualifying small-company stock long enough — but sometimes life (or an acquisition offer) does not wait for the clock to run out. If you sell qualifying stock after holding it more than six months but before you have held it long enough for the full exclusion, there is a rule that lets you roll the sale proceeds into a new qualifying investment within 60 days and keep your holding-period clock running instead of starting over.',
      'Think of it as a bridge: it does not erase the tax on your original sale forever, but it postpones it, and it carries your "time served" forward into the new investment. If that new investment is held long enough, it can still qualify for the same powerful tax-free treatment the original stock was working toward.',
      'The window to act is short — just 60 days from your sale — so this only works when we know about the sale in advance and can help line up a qualifying replacement investment in time.'
    ],
    analogy: 'It is like changing flights mid-trip without losing the frequent-flyer miles you already earned — you still land at the same destination, just on a different plane.',
    benefits: [
      'Defers tax on an early sale instead of paying it all immediately',
      'Carries your holding-period clock forward into the new investment',
      'Keeps the door open to the full startup-stock tax exclusion later',
      'Gives you flexibility to exit an investment early without giving up the long-term tax plan'
    ],
    steps: [
      'We confirm your original stock and the timing qualify for this rollover',
      'We help you evaluate qualifying replacement investments before your 60-day window closes',
      'We handle the tax reporting to properly defer the gain and document the rollover',
      'We track your new holding-period clock toward the eventual tax-free milestone'
    ],
    considerations: [
      'You must reinvest within 60 days — there is no flexibility on this deadline, so we need advance notice of any planned sale.',
      'This defers the tax, it does not erase it — if the new investment is later sold before it independently qualifies, the deferred gain becomes taxable then.',
      'Finding a genuinely qualifying replacement investment in time takes real diligence — not every startup investment counts.'
    ]
  },

  inputs: [],

  appliesTo: function (profile) {
    return true; // advisory: depends on sale/replacement-purchase facts outside the profile
  },

  apply: function (profile, params, yearIndex, state) {
    return { profile: profile, notes: yearIndex === 0
      ? ['Advisory strategy — appears in the plan documents but does not change the scenario math.']
      : [] };
  }
});
