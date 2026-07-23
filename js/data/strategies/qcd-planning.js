/* ============================================================================
 * STRATEGY: Qualified Charitable Distribution (§408(d)(8))
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'qcd-planning',
  name: 'Qualified Charitable Distribution (§408(d)(8))',
  category: 'Income Timing & Character',
  applyOrder: 21,

  advisor: {
    summary:
      'Under §408(d)(8), an IRA owner age 70½ or older may direct the trustee ' +
      'to transfer up to the annual indexed limit directly from a traditional ' +
      'IRA to a public charity. The distribution is excluded from gross income ' +
      'entirely — it never touches AGI — and it counts toward the owner\'s ' +
      'required minimum distribution under §401(a)(9) for the year. Because the ' +
      'benefit is an EXCLUSION rather than a below-the-line deduction, it lowers ' +
      'AGI/MAGI directly, which helps with IRMAA tiering, the §1411 net ' +
      'investment income tax threshold, and other MAGI-based phase-outs, and it ' +
      'benefits non-itemizers who get no value from a charitable deduction. The ' +
      'tradeoff is no double benefit: the same dollars cannot also be claimed as ' +
      'a charitable deduction on Schedule A.',
    mechanics: [
      'Distribution must go directly from the IRA trustee to a qualifying ' +
      'public charity — funds cannot pass through the taxpayer\'s hands (a ' +
      'check made payable to the charity but mailed to the taxpayer is ' +
      'generally acceptable; a distribution paid to the owner and then ' +
      'donated is NOT a QCD).',
      'Only traditional IRAs (and inactive SEP/SIMPLE IRAs) qualify directly; ' +
      'Roth IRAs generally have no need since qualified Roth distributions are ' +
      'already tax-free, and employer plans (401(k), 403(b)) are not eligible ' +
      'unless first rolled to an IRA.',
      'The excluded amount counts toward the owner\'s RMD for the year, so a ' +
      'QCD can satisfy some or all of an otherwise-taxable required distribution.',
      'The annual per-taxpayer QCD limit is indexed for inflation; the figure ' +
      'was $108,000 for 2025 — VERIFY the current-year indexed figure before ' +
      'advising, since this file does not read it from a table.',
      'A separate, one-time-only election under §408(d)(8)(F) allows up to a ' +
      'lower indexed limit to fund a charitable remainder trust or charitable ' +
      'gift annuity with QCD dollars — available once in the taxpayer\'s ' +
      'lifetime and subject to its own stricter payout-timing rules; verify ' +
      'the current-year figure separately from the general QCD limit.',
      'No charitable deduction may be claimed for the same distribution — ' +
      'claiming both the exclusion and a Schedule A deduction is a double ' +
      'benefit the IRS will disallow.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §408(d)(8)', note: 'Qualified charitable distribution: excludes from gross income up to the annual indexed limit, transferred directly from an IRA to a public charity by an owner age 70½ or older; no charitable deduction for the excluded amount.' },
      { type: 'IRC', cite: 'IRC §401(a)(9)', note: 'Required minimum distribution rules — a QCD counts toward the IRA owner\'s RMD for the year in which it is made.' },
      { type: 'IRC', cite: 'IRC §1411', note: 'Net investment income tax — QCDs are not investment income and, because they are excluded from AGI, help keep MAGI under the §1411 threshold rather than adding to it.' },
      { type: 'Admin', cite: 'Form 1040 instructions, IRA distributions line', note: 'Reporting mechanics: the full IRA distribution is reported on the gross-distribution line, with the QCD amount excluded from the taxable-amount line and "QCD" written next to it.' }
    ],
    requirements: [
      'IRA owner must be age 70½ or older on the date of the distribution.',
      'Funds must move directly from the IRA trustee to a qualifying public charity — no donor-advised funds, private foundations, or supporting organizations.',
      'Distribution must otherwise qualify as one that would be includible in income (i.e., not already basis from nondeductible contributions).',
      'No charitable deduction claimed for the same dollars on Schedule A.',
      'Amount does not exceed the current-year indexed annual limit (verify before filing).'
    ],
    risks: [
      'Funds routed through the owner\'s hands before reaching the charity disqualify the transfer as a QCD — it becomes a taxable distribution plus a separate (and possibly limited) charitable deduction.',
      'Distributions to a donor-advised fund or private non-operating foundation do not qualify, even though contributions to those vehicles are otherwise deductible.',
      'If a deductible IRA contribution was made at or after age 70½ in the same or a prior year, current law requires reducing the QCD exclusion by the cumulative post-70½ deductible contributions not already used to reduce a prior QCD — coordinate carefully with any late-career IRA contributions.',
      'Charity must provide the same contemporaneous written acknowledgment required for any gift of that size, or the exclusion can be challenged on audit.',
      'Overstating the amount transferred as a QCD when part of the distribution went to a non-qualifying recipient results in that portion being fully taxable.'
    ],
    bestFit: [
      'IRA owners 70½+ who are already charitably inclined and either take the standard deduction or are near enough to it that a Schedule A deduction would add little value.',
      'Clients near an IRMAA tier threshold, the §1411 NIIT threshold, or another MAGI-based phase-out where lowering AGI (not just taxable income) matters.',
      'Clients subject to RMDs who would rather redirect some or all of the distribution to charity than receive it as taxable income.'
    ],
    implementation: [
      'Confirm the owner\'s age (70½+) and the current-year indexed QCD limit before the transfer.',
      'Instruct the IRA custodian in writing to issue the distribution directly to the named qualifying charity — many custodians have a standard QCD request form.',
      'Obtain a contemporaneous written acknowledgment from the charity showing no goods or services were received in exchange.',
      'On Form 1040, report the full 1099-R gross distribution, subtract the QCD amount from the taxable portion, and write "QCD" next to the line.',
      'Do not include the QCD amount in itemized charitable contributions on Schedule A.',
      'If using the one-time CRT/CGA election, coordinate the payout-timing and trust-drafting requirements with counsel before year-end — this election cannot be undone.'
    ]
  },

  client: {
    teaser: 'A way to give to charity that can lower your income tax bill more than writing a check ever could',
    headline: 'Send your IRA distribution straight to charity — tax-free',
    plainEnglish: [
      'If you are 70½ or older and have a traditional IRA, you can have your IRA custodian send money directly to a charity you choose instead of sending it to you. That money is never counted as your income — not a deduction you have to itemize to use, but a full exclusion, as if it never happened for tax purposes.',
      'If you are required to take money out of your IRA each year (a required minimum distribution), this satisfies that requirement too. So instead of pulling money out, paying tax on it, and then writing a check to your favorite charity, you can skip the tax altogether by having the money go straight from your IRA to the charity.',
      'This is especially valuable if you take the standard deduction and would not get any tax benefit from a normal charitable gift, or if you are trying to keep your income under a threshold that affects your Medicare premiums or other benefits.'
    ],
    analogy: 'It is like giving the charity your gift before the tax collector ever sees it, instead of paying the tax first and giving what is left over.',
    benefits: [
      'The distributed amount is never included in your taxable income',
      'Counts toward your required minimum distribution for the year',
      'Helps keep your income under thresholds that affect Medicare premiums and other benefits',
      'Works even if you do not itemize deductions'
    ],
    steps: [
      'We confirm you meet the age requirement and check the current-year limit',
      'We work with your IRA custodian to send the transfer directly to your chosen charity',
      'We make sure you get a proper written receipt from the charity',
      'We report it correctly on your return so it is excluded from your taxable income'
    ],
    considerations: [
      'The money must go directly from your IRA to the charity — if it passes through your hands first, the tax benefit is lost.',
      'You cannot also claim a charitable deduction for the same gift.',
      'Only certain charities qualify — donor-advised funds and some private foundations do not.'
    ]
  },

  inputs: [
    { key: 'qcdAmount', label: 'QCD amount (direct IRA-to-charity transfer)', type: 'currency', default: 20000, max: 108000 }
  ],

  appliesTo: function (profile) {
    return true; // age 70½ and IRA ownership validated by the advisor, not the profile
  },

  /**
   * Models the QCD as an exclusion by reducing otherIncome (representing the
   * IRA distribution/RMD that would otherwise be taxable) rather than adding
   * a deduction — this is what actually lowers AGI/MAGI for IRMAA and NIIT
   * purposes. Capped at otherIncome available in the profile; no charitable
   * deduction is added since none may be claimed for the same dollars.
   */
  apply: function (profile, params, yearIndex, state) {
    var p = Object.assign({}, profile);
    var notes = [];
    var requested = Math.max(0, params.qcdAmount || 0);
    var available = p.otherIncome || 0;
    var applied = Math.min(requested, available);
    p.otherIncome = Math.max(0, available - applied);

    if (yearIndex === 0) {
      if (requested > 108000) {
        notes.push('WARNING: entered amount exceeds the $108,000 (2025) annual indexed QCD ' +
          'limit — verify the current-year indexed figure before advising; the excess is not ' +
          'a valid QCD.');
      }
      if (applied < requested) {
        notes.push('WARNING: only ' + TSIQ.fmt.usd(applied) + ' of the requested ' +
          TSIQ.fmt.usd(requested) + ' QCD was modeled because the profile\'s Other Income ' +
          '(representing the taxable IRA/RMD income) was insufficient. Enter the IRA ' +
          'distribution/RMD amount in Other Income to model the full QCD.');
      }
      notes.push(TSIQ.fmt.usd(applied) + ' transferred directly from the IRA to a qualifying ' +
        'public charity is EXCLUDED from gross income under §408(d)(8) (modeled as a reduction ' +
        'to Other Income) — not claimed as a Schedule A deduction. Requires the owner be age ' +
        '70½+ and the transfer go directly trustee-to-charity.');
      notes.push('Because this lowers AGI/MAGI directly (an exclusion, not a deduction), it can ' +
        'help with IRMAA tiering and the §1411 net investment income tax threshold, and it ' +
        'benefits taxpayers who do not itemize. Counts toward the year\'s RMD under §401(a)(9). ' +
        'No charitable deduction may also be taken for the same dollars.');
    }
    return { profile: p, notes: notes };
  }
});
