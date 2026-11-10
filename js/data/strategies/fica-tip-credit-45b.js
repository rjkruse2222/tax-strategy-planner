/* ============================================================================
 * STRATEGY: FICA Tip Credit (§45B)
 * One source object → advisor view, client PDF, client slideshow.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'fica-tip-credit-45b',
  name: 'FICA Tip Credit (§45B)',
  category: 'Credits & Incentives',
  applyOrder: 88,
  modeled: true,

  advisor: {
    summary:
      'Employers whose employees receive tips can claim a nonrefundable credit ' +
      'for the employer share of FICA (7.65%) paid on those tips, to the extent ' +
      'the tips exceed the amount needed to bring the employee to $5.15/hour ' +
      '(the 1997 minimum wage, frozen for this computation). The credit ' +
      'reimburses a payroll tax the employer must pay anyway on income the ' +
      'employer never controls. Historically a food-and-beverage benefit, it ' +
      'has been extended to additional tipped industries. Wages used for the ' +
      'credit cannot also be deducted (§45B(c)) — enter the net figure.',
    mechanics: [
      'Creditable tips = total reported tips MINUS the tips needed to raise the ' +
      'employee\'s wage to $5.15/hour. Tips that merely fill the gap up to $5.15 ' +
      'do not count; everything above does.',
      'Credit = 7.65% × creditable tips (the employer OASDI + Medicare share). ' +
      'It is a general business credit, nonrefundable, carried on Form 3800.',
      'The $5.15 floor is statutory and does NOT rise with the current minimum ' +
      'wage — over time nearly all reported tips become creditable.',
      'Only tips treated as wages for FICA count; service charges the employer ' +
      'controls are wages, not tips, and are excluded.',
      'No double benefit: the employer may not also deduct the FICA taxes for ' +
      'which the credit is claimed (§45B(c)). Enter the credit net of any ' +
      'associated deduction reduction.',
      'Recent legislation (OBBBA, P.L. 119-21) expanded the range of tipped ' +
      'establishments eligible — confirm the industry qualifies for the year at ' +
      'issue before relying on the credit.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §45B', note: 'Credit for employer FICA on tips above the $5.15/hour floor; nonrefundable general business credit.' },
      { type: 'IRC', cite: 'IRC §45B(c)', note: 'No deduction for the FICA taxes taken into account in computing the credit — prevents a double benefit.' },
      { type: 'Admin', cite: 'Form 8846; Form 3800', note: 'Credit for employer social security and Medicare taxes paid on certain employee tips; general business credit carryforward.' },
      { type: 'Admin', cite: 'OBBBA (P.L. 119-21), July 2025', note: 'Broadened eligible tipped industries beyond food and beverage. Verify the specific establishment types and effective year before relying on it.' }
    ],
    requirements: [
      'Employees who customarily receive tips that are reported and treated as FICA wages.',
      'Accurate tip reporting (Form 4070/allocated tips) so creditable tips can be computed employee-by-employee.',
      'An eligible establishment type for the tax year in question.',
      'Coordination so the FICA-tax deduction is reduced by the credit (§45B(c)).'
    ],
    risks: [
      'Understated tip reporting shrinks the credit — the credit rewards good reporting, which some employers under-collect.',
      'Service charges (mandatory gratuities) are not tips and do not qualify — misclassifying them overstates the credit.',
      'Nonrefundable: low-tax years strand it in carryforward (§39), not modeled here.',
      'Industry-eligibility changes under recent law must be verified for the specific year.'
    ],
    bestFit: [
      'Restaurants, bars, and other food-and-beverage employers with substantial reported tips.',
      'Newly eligible tipped-service businesses under the expanded rules (verify).',
      'Employers already diligent about tip reporting — the credit is essentially free money they may be leaving on the table.'
    ],
    implementation: [
      'Pull reported-tip totals by employee for the year.',
      'For each employee, subtract the tips needed to reach $5.15/hour; the remainder is creditable.',
      'Multiply creditable tips by 7.65% to get the credit.',
      'Reduce the FICA-tax deduction by the credit (§45B(c)) and report on Form 8846 → Form 3800.'
    ]
  },

  client: {
    teaser: 'You are already paying a tax on money your customers hand your staff — take some back',
    headline: 'Get back the payroll tax you pay on tips',
    plainEnglish: [
      'When your employees earn tips, you as the employer have to pay Social Security and Medicare tax on those tips — even though the tip money went straight from the customer to your staff and never touched your bank account. The tax code gives you a credit to offset most of that.',
      'It works out to about 7.65% of the tips your team reports (above a small floor). For a busy restaurant or bar, that adds up to real money every year, and it is a credit many businesses simply never claim.',
      'The main requirement is good tip reporting, which you should be doing anyway. Once the reporting is clean, the credit is largely automatic.'
    ],
    analogy: 'You are being taxed on money you never got to hold. This credit hands most of that tax back.',
    benefits: [
      'Roughly 7.65% of reported tips comes back as a tax credit',
      'Offsets a payroll tax you already have to pay',
      'Rewards the accurate tip reporting you should already do',
      'Available every year'
    ],
    steps: [
      'We total the tips your team reported for the year',
      'We calculate the creditable portion above the small floor',
      'We claim the credit on your business return',
      'We coordinate it with your other payroll numbers'
    ],
    considerations: [
      'Mandatory service charges are treated as wages, not tips, and do not count — only genuine tips qualify.',
      'The credit only helps in a year you owe tax; unused amounts carry forward.'
    ]
  },

  inputs: [
    { key: 'creditAmount', label: '§45B credit (7.65% × creditable tips)', type: 'currency', default: 0 }
  ],

  appliesTo: function (profile) {
    return true; // depends on payroll/tip facts the advisor computes
  },

  /**
   * Adds the advisor-computed §45B credit to otherCredits (nonrefundable,
   * applied after the child tax credit). §45B(c) reduces the FICA deduction by
   * the credit — enter the net figure. §39 carryovers not modeled.
   */
  apply: function (profile, params, yearIndex, state) {
    var p = Object.assign({}, profile);
    var notes = [];
    var amt = Math.max(0, params.creditAmount || 0);
    p.otherCredits = (p.otherCredits || 0) + amt;
    if (yearIndex === 0) {
      notes.push(TSIQ.fmt.usd(amt) + ' §45B FICA tip credit applied (nonrefundable). ' +
        'Compute as 7.65% of reported tips above the $5.15/hour floor; the FICA deduction is reduced by the credit (§45B(c)).');
      notes.push('Projection assumes similar tip levels each year. Verify the establishment type qualifies for the year (OBBBA expanded eligible industries).');
    }
    return { profile: p, notes: notes };
  }
});
