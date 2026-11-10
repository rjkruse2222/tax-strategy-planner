/* ============================================================================
 * STRATEGY: DSUE Portability Election (§2010(c))
 * Advisory — appears in plan documents, does not change scenario math.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'dsue-portability-election',
  name: 'DSUE Portability Election (§2010(c))',
  category: 'Succession & Exit',
  applyOrder: 80,
  modeled: false,

  advisor: {
    summary:
      'When the first spouse in a marriage dies, §2010(c) lets the executor ' +
      'elect "portability" — transferring that spouse\'s unused estate/gift ' +
      'exemption (the Deceased Spousal Unused Exclusion, or DSUE, amount) to ' +
      'the surviving spouse. The surviving spouse can then apply the DSUE ' +
      'amount, on top of their own basic exclusion amount ($15,000,000 in ' +
      '2026, permanent under OBBBA), against their own future lifetime gifts ' +
      'or estate at death. The election is made on a timely filed Form 706 — ' +
      'even for an estate with no tax liability and no other reason to file — ' +
      'and it is easy to miss, which is why Rev. Proc. 2022-32 provides a ' +
      'simplified procedure to elect late, within five years of the first ' +
      'spouse\'s death, for estates that were not otherwise required to file.',
    mechanics: [
      'DSUE amount: the lesser of (1) the basic exclusion amount in effect in ' +
      'the year the first spouse died, or (2) the excess of that spouse\'s ' +
      'applicable exclusion amount over the value of the taxable estate plus ' +
      'adjusted taxable gifts actually used.',
      'Election vehicle: Form 706 (United States Estate (and Generation-' +
      'Skipping Transfer) Tax Return), filed by the deceased spouse\'s ' +
      'executor, computing and reporting the DSUE amount even where the ' +
      'estate owes no tax and is below the filing threshold.',
      '"Last deceased spouse" rule: the surviving spouse may only use the ' +
      'DSUE amount from their most recently deceased spouse — remarriage and ' +
      'a subsequent spouse\'s death can change (or, if the new spouse leaves ' +
      'no usable DSUE, eliminate) what is available, so timing of large gifts ' +
      'after remarriage needs a fresh look.',
      'Use during life or at death: the survivor can apply the inherited DSUE ' +
      'amount against lifetime gift tax as well as against estate tax at their ' +
      'own death — it is not limited to the second death.',
      'Deadline and late relief: the normal Form 706 due date is nine months ' +
      'after death, extendable six months on Form 4768. Rev. Proc. 2022-32 ' +
      'gives estates that were not otherwise required to file a simplified ' +
      'method to elect portability up to five years after the date of death — ' +
      'superseding the prior two-year relief window in Rev. Proc. 2017-34.',
      'Estates that ARE required to file (value exceeds the filing threshold) ' +
      'do not get the simplified five-year relief and must instead pursue a ' +
      'private letter ruling for late-election relief if the normal deadline ' +
      'is missed.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §2010(c)', note: 'Defines the applicable exclusion amount as the basic exclusion amount plus the DSUE amount, and requires an affirmative portability election by the deceased spouse\'s executor.' },
      { type: 'Reg', cite: 'Treas. Reg. §20.2010-2', note: 'Requirements for making the portability election, including that it be made on a timely filed, complete and properly prepared estate tax return.' },
      { type: 'IRC', cite: 'IRC §2505', note: 'Unified credit against gift tax — incorporates the applicable exclusion amount (and therefore any inherited DSUE) so the surviving spouse can use it against lifetime gifts, not only at death.' },
      { type: 'Admin', cite: 'Form 706', note: 'United States Estate (and Generation-Skipping Transfer) Tax Return — the return on which the portability election is made.' },
      { type: 'Admin', cite: 'Rev. Proc. 2022-32', note: 'Simplified method to elect portability up to five years after the decedent\'s date of death for estates not otherwise required to file Form 706; supersedes the two-year window in Rev. Proc. 2017-34.' }
    ],
    requirements: [
      'A timely filed, complete Form 706 for the first spouse to die, even where no estate tax is due and the estate is below the filing threshold.',
      'Affirmative election — portability is NOT automatic; a return filed without electing (or with the election affirmatively opted out of) forfeits the DSUE amount.',
      'If the deadline was missed and the estate was not otherwise required to file, a Form 706 filed within five years of death, with the Rev. Proc. 2022-32 statement, to claim simplified late relief.',
      'Coordination with the surviving spouse\'s own estate plan — the DSUE amount should be accounted for before the survivor makes large lifetime gifts.'
    ],
    risks: [
      'The single biggest risk is simply not filing — smaller estates with no tax due often see no reason to file a return, and the DSUE amount is lost the day the deadline passes without relief being available.',
      'The five-year simplified relief window in Rev. Proc. 2022-32 is not unlimited — estates required to file for other reasons do not qualify for it, and estates that miss even the five-year mark need a private letter ruling (§2010(c) late-relief PLRs are discretionary and not guaranteed).',
      'Remarriage exposure: because only the LAST deceased spouse\'s DSUE counts, a surviving spouse who remarries and outlives (or is predeceased by) a second spouse can lose an unused DSUE amount from the first marriage if it was not used before the second spouse\'s death.',
      'A DSUE amount claimed on audit can be adjusted by the IRS even after the statute of limitations closes on the deceased spouse\'s own estate tax liability, since the DSUE computation stays open until it is actually used by the survivor.',
      'State estate taxes generally are NOT portable even where the federal DSUE is elected — several states with their own estate tax do not recognize portability at all, so state-level planning is separate.'
    ],
    bestFit: [
      'Any married client whose first-to-die spouse\'s estate is below the federal filing threshold and where no Form 706 would otherwise be filed — the "just file it anyway" case.',
      'Blended families or remarriage situations where locking in a DSUE amount before a subsequent marriage protects it under the last-deceased-spouse rule.',
      'Surviving spouses expecting significant future appreciation or a large liquidity event (business sale, concentrated stock position) who want maximum exclusion available for later lifetime gifting.'
    ],
    implementation: [
      'At the first spouse\'s death, evaluate whether a Form 706 is otherwise required; if not, file one anyway solely to elect portability and compute the DSUE amount.',
      'File within nine months of death (or fifteen months with a timely Form 4768 extension).',
      'If the deadline has already passed and no Form 706 was ever required, use the Rev. Proc. 2022-32 simplified procedure within five years of the date of death.',
      'Document the resulting DSUE amount in the surviving spouse\'s estate planning file and revisit it before any large lifetime gift or upon remarriage.',
      'On the surviving spouse\'s own later Form 706 (or lifetime Form 709 gift tax returns), apply the inherited DSUE amount ahead of, or alongside, their own basic exclusion amount as advantageous.'
    ]
  },

  client: {
    teaser: 'A form filed after the first spouse\'s death that can protect millions for the survivor — even when no tax is owed today',
    headline: 'Don\'t let your spouse\'s unused exemption disappear',
    plainEnglish: [
      'Everyone gets a large, once-in-a-lifetime allowance that shields wealth from federal estate and gift tax — currently $15 million per person. When a married person dies without using all of theirs, there is a way to pass the leftover amount to the surviving spouse, effectively doubling what the survivor can later give away or leave to heirs tax-free.',
      'The catch is that this does not happen automatically. Someone has to file a specific tax return and check a box — even if the estate is nowhere near large enough to owe any tax and would otherwise have no reason to file anything at all. Skip that filing and the unused allowance can be gone for good.',
      'There is a safety net if the deadline is missed by mistake — a simplified process to fix it within five years — but after that, getting it back is much harder and not guaranteed. We treat this as a "file it anyway" item at the first spouse\'s death, every time.'
    ],
    analogy: 'Think of it like a phone plan\'s unused data rolling over — but only if someone actively requests the rollover before the window closes. Otherwise it just evaporates.',
    benefits: [
      'Can preserve millions of dollars of additional tax-free giving capacity for the surviving spouse',
      'Costs relatively little to file, especially compared to what is protected',
      'Available even when the first spouse\'s estate owes zero tax',
      'A five-year safety net exists if the original deadline is missed'
    ],
    steps: [
      'We review the situation at the first spouse\'s death and confirm whether this election applies',
      'We prepare and file the return that makes the election, on time',
      'If a deadline was already missed, we check whether the five-year simplified fix is still available',
      'We document the preserved amount so it is ready for the surviving spouse\'s own planning'
    ],
    considerations: [
      'The return must be filed even when no tax is due — that is the single most common way this benefit is lost.',
      'If the surviving spouse remarries, only the most recently deceased spouse\'s unused allowance counts, so timing matters.',
      'Most states with their own estate tax do not honor this — this protects the federal allowance only.'
    ]
  },

  inputs: [],

  appliesTo: function (profile) {
    return true; // advisory — driven by marital/estate facts at the first death, not return inputs
  },

  apply: function (profile, params, yearIndex, state) {
    return { profile: profile, notes: yearIndex === 0
      ? ['Advisory strategy — appears in the plan documents but does not change the scenario math. This is an estate-administration election made at the first spouse\'s death, not from annual return inputs.']
      : [] };
  }
});
