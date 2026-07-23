/* ============================================================================
 * STRATEGY: GST Exemption Planning (§2631)
 * Advisory — appears in plan documents, does not change scenario math.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'gst-exemption-planning',
  name: 'GST Exemption Planning (§2631)',
  category: 'Succession & Exit',
  applyOrder: 81,
  modeled: false,

  advisor: {
    summary:
      'The generation-skipping transfer (GST) tax is a flat, top-rate tax ' +
      'layered on top of gift and estate tax whenever a transfer skips a ' +
      'generation — a gift or bequest to a grandchild, or a distribution from ' +
      'a trust to a grandchild-level beneficiary. Every individual has a GST ' +
      'exemption equal to the basic exclusion amount ($15,000,000 in 2026, ' +
      'permanent under OBBBA) that can be allocated to a gift or a trust to ' +
      'shield it — and everything it grows into — from GST tax at every ' +
      'future generational layer, indefinitely. Allocation is not automatic ' +
      'in every case, and getting the timing right (allocating before, not ' +
      'after, appreciation) is where most of the planning value lives; ' +
      'dynasty trusts are the primary vehicle built to hold a fully GST-' +
      'exempt fund for multiple generations.',
    mechanics: [
      'GST tax (§2601) applies at a flat rate equal to the top estate/gift tax ' +
      'rate to three types of generation-skipping transfers: direct skips ' +
      '(outright gifts/bequests to a "skip person," typically a grandchild or ' +
      'more remote descendant), taxable terminations (a trust interest ending ' +
      'in favor of a skip person), and taxable distributions (a trust ' +
      'distribution to a skip person).',
      'GST exemption (§2631): each individual has a lifetime GST exemption ' +
      'equal to the basic exclusion amount, allocated by the transferor (or ' +
      'the transferor\'s executor) to specific transfers or trusts.',
      'Inclusion ratio (§2642): the fraction of a trust or transfer allocated ' +
      'GST exemption divided into the fraction actually subject to GST tax. ' +
      'Full allocation produces an inclusion ratio of zero — the trust is ' +
      'entirely GST-exempt, and every dollar of future growth and every future ' +
      'distribution to any generation, however remote, passes GST-tax-free.',
      'Allocation timing is the core planning lever: allocating exemption when ' +
      'a trust is funded (low value) locks in exemption against that low ' +
      'value — all subsequent appreciation is exempt for free. Allocating ' +
      'late, after the asset has appreciated, "wastes" exemption covering ' +
      'value that already accrued.',
      'Allocation mechanics (§2632): exemption can be allocated affirmatively ' +
      'on a timely filed Form 709, or automatically under the §2632(b)/(c) ' +
      'default rules for direct skips and transfers to "GST trusts." The ' +
      'automatic rules are a safety net, not a substitute for planning — a ' +
      'transferor can elect OUT of automatic allocation where exemption is ' +
      'better saved for a different transfer, or elect IN where a transfer ' +
      'would not otherwise qualify.',
      'Dynasty trusts pair naturally with a fully allocated GST exemption: a ' +
      'trust with a zero inclusion ratio, funded in a state that has ' +
      'abolished or extended its rule against perpetuities, can compound value ' +
      'across many generations without another layer of transfer tax at each ' +
      'generational change.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §2601', note: 'Imposes the generation-skipping transfer tax on direct skips, taxable terminations, and taxable distributions.' },
      { type: 'IRC', cite: 'IRC §2631', note: 'Establishes each individual\'s GST exemption, equal to the basic exclusion amount — $15,000,000 for 2026 (see TSIQ.TABLES_2026.limits.gift), made permanent by OBBBA.' },
      { type: 'IRC', cite: 'IRC §2632', note: 'Governs allocation of GST exemption, including the automatic-allocation rules for direct skips and transfers to GST trusts, and the ability to elect in or out of automatic allocation.' },
      { type: 'IRC', cite: 'IRC §2642', note: 'Defines the inclusion ratio — the mechanism that determines what fraction of a trust remains subject to GST tax after exemption is allocated; full allocation yields a zero inclusion ratio.' },
      { type: 'Admin', cite: 'Form 709', note: 'United States Gift (and Generation-Skipping Transfer) Tax Return — used to report gifts, allocate (or elect out of automatic allocation of) GST exemption, and report the resulting inclusion ratio.' }
    ],
    requirements: [
      'An inventory of lifetime GST exemption used to date, coordinated with the annual gifting/lifetime exemption program so GST and gift/estate exemption tracking stay in sync.',
      'A decision, transfer by transfer, on whether the automatic allocation rules produce the right result — and a timely Form 709 election out (or in) where they do not.',
      'For trust-based planning, drafting that supports a durable, long-term GST-exempt trust (perpetuities-friendly situs, trustee succession, distribution standards appropriate for multiple generations).',
      'Timely allocation relative to funding — the exemption should be allocated when value is contributed, not after it appreciates.'
    ],
    risks: [
      'Automatic allocation can silently consume exemption on transfers where it was not needed, or fail to protect a transfer the transferor assumed was covered — both require affirmatively checking the automatic-allocation rules against intent, transfer by transfer.',
      'Late allocation locks in the appreciated value at the time of allocation rather than the value at funding, wasting exemption on growth that already occurred; a formula allocation clause in the trust instrument can mitigate this but must be drafted correctly.',
      'An inclusion ratio between zero and one (partial allocation) leaves the trust partially taxable at every future skip — sloppy partial allocations are worse than either full allocation or a deliberate decision not to allocate.',
      'GST exemption and gift/estate exemption are tracked separately even though they share the same dollar figure — a taxpayer can run out of one before the other if allocations are not coordinated.',
      'Perpetual or very-long-term dynasty trusts require ongoing trustee and situs administration over generations; state rule-against-perpetuities law varies and must be confirmed for the trust\'s state of situs.'
    ],
    bestFit: [
      'Families using lifetime gifting or trust funding for grandchildren or later generations, where an unallocated transfer would otherwise trigger GST tax on top of gift/estate tax.',
      'Dynasty trust structures intended to benefit multiple generations from a single, fully GST-exempt funding.',
      'Clients whose estate/gift exemption planning already contemplates skip-generation beneficiaries (grandchildren, great-grandchildren) as primary or contingent beneficiaries.',
      'Situations where early, low-value funding of a trust makes locking in GST exemption against that low value especially valuable before anticipated appreciation.'
    ],
    implementation: [
      'Map planned and completed transfers against skip-person beneficiaries to identify which are, or could become, generation-skipping transfers.',
      'For each transfer, determine whether §2632 automatic allocation applies and whether that default result matches intent; file a timely Form 709 election in or out where it does not.',
      'For new dynasty-trust funding, allocate GST exemption to the full contribution as of the funding date, before anticipated appreciation, and confirm the resulting inclusion ratio on Form 709.',
      'Select a trust situs and draft distribution/trustee-succession provisions built for multi-generation duration, consistent with the state\'s rule against perpetuities (or its abolition).',
      'Maintain a running ledger of GST exemption used vs. remaining, tracked separately from — but coordinated with — the client\'s gift/estate exemption ledger.'
    ]
  },

  client: {
    teaser: 'A separate tax hides behind gifts to grandchildren — this makes sure it never applies',
    headline: 'Protect gifts to grandchildren from an extra layer of tax',
    plainEnglish: [
      'There is a tax most people have never heard of that applies specifically to gifts and inheritances that skip a generation — money that goes straight to grandchildren, or to a trust set up to benefit them, instead of passing through your children first. It is charged on top of regular estate and gift tax, at a steep flat rate.',
      'The good news is that everyone has a separate allowance — currently $15 million — that can be used specifically to protect gifts and trusts from this extra tax. Used correctly, especially when a trust is funded early and then grows for years or decades, that allowance can shield not just the money you put in, but everything it ever grows into, for every future generation.',
      'The tricky part is that this protection is not automatically applied the right way in every situation, and timing matters enormously — protecting a dollar before it grows is far more efficient than protecting it after. We track this separately from your regular gift and estate planning to make sure nothing slips through.'
    ],
    analogy: 'Think of it as buying insurance on the seed rather than the eventual tree — the earlier you protect it, the more growth you cover for free.',
    benefits: [
      'Shields gifts and trusts benefiting grandchildren (or later generations) from an extra, flat-rate tax',
      'Can protect decades of future growth inside a properly funded trust, not just the original gift',
      'Works hand-in-hand with your regular lifetime gifting and estate exemption planning',
      'Enables true multi-generation ("dynasty") trusts that compound wealth across your family tree'
    ],
    steps: [
      'We map which of your planned gifts or trusts could skip a generation',
      'We confirm the automatic protections apply where you want them — and file the paperwork where they do not',
      'For new trusts benefiting grandchildren, we protect the full amount at funding, before it grows',
      'We keep a running record of how much of this separate allowance you have used'
    ],
    considerations: [
      'This allowance is tracked separately from your regular estate/gift allowance — using one does not automatically use the other correctly, so both need coordinated tracking.',
      'Protecting a trust after it has already grown in value wastes some of the allowance — earlier is better.',
      'Long-lasting family trusts require an ongoing trustee and location, so there is real administration behind this benefit, not just a one-time filing.'
    ]
  },

  inputs: [],

  appliesTo: function (profile) {
    return true; // advisory — driven by transfer/beneficiary facts, not return inputs
  },

  apply: function (profile, params, yearIndex, state) {
    return { profile: profile, notes: yearIndex === 0
      ? ['Advisory strategy — appears in the plan documents but does not change the scenario math.']
      : [] };
  }
});
