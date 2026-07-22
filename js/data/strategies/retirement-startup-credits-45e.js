/* ============================================================================
 * STRATEGY: Small Employer Retirement Plan Startup & Auto-Enrollment Credits
 *           (§45E and §45T)
 * One source object → advisor view, client PDF, client slideshow.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'retirement-startup-credits-45e',
  name: 'Retirement Plan Startup Credits (§45E / §45T)',
  category: 'Credits & Incentives',
  applyOrder: 89,
  modeled: true,

  advisor: {
    summary:
      'SECURE 2.0 turned the cost of launching a small-employer retirement plan ' +
      'into a set of tax credits. §45E now covers 100% of startup and ' +
      'administration costs (up to $5,000/year for three years) for employers ' +
      'with 50 or fewer employees, plus a separate employer-contribution credit ' +
      'of up to $1,000 per employee (phasing down over five years). §45T adds ' +
      '$500/year for three years for including an eligible automatic-enrollment ' +
      'feature. Together they can make the first years of a new 401(k) or SIMPLE ' +
      'nearly free, on top of the deduction for the plan contributions ' +
      'themselves.',
    mechanics: [
      '§45E startup credit: 100% of qualified startup costs (plan setup and ' +
      'administration, employee education) for employers with ≤ 50 employees, ' +
      'capped at $5,000/year, for the first three plan years. Employers with ' +
      '51–100 employees get 50%.',
      'Employer-contribution credit (§45E as amended): up to $1,000 per employee ' +
      'earning under a wage threshold, phased 100/100/75/50/25% across the first ' +
      'five years; reduced for employers with 51–100 employees.',
      '§45T auto-enrollment credit: a flat $500/year for three years for adding ' +
      'an eligible automatic contribution arrangement (EACA) to a new or ' +
      'existing plan.',
      'Available to employers that did not maintain a qualified plan for ' +
      'substantially the same employees in the prior three years.',
      'Credits reduce the deduction for the same costs (no double benefit) — ' +
      'enter amounts net. The plan contributions themselves remain separately ' +
      'deductible and are modeled by the retirement-plan strategies.',
      'All are nonrefundable general business credits (Form 3800). This file ' +
      'models the credits only; pair it with a retirement-plan strategy for the ' +
      'contribution deduction.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §45E', note: 'Small employer pension plan startup cost credit — 100% (≤50 employees) of up to $5,000/year for 3 years, plus the employer-contribution credit, as amended by SECURE 2.0.' },
      { type: 'IRC', cite: 'IRC §45T', note: 'Auto-enrollment credit: $500/year for 3 years for an eligible automatic contribution arrangement.' },
      { type: 'Admin', cite: 'SECURE 2.0 Act (Div. T, P.L. 117-328), §§102–103', note: 'Increased the startup credit to 100% for small employers and added the per-employee contribution credit.' },
      { type: 'Admin', cite: 'Form 8881; Form 3800', note: 'Credit for small employer pension plan startup costs and auto-enrollment; general business credit reporting.' }
    ],
    requirements: [
      'A new qualified plan (401(k), SEP, SIMPLE, or DB) — the employer must not have maintained one for substantially the same employees in the prior 3 years.',
      '50 or fewer employees for the full startup credit (100% rate); 51–100 employees receive reduced credits.',
      'At least one non-highly-compensated employee for the startup credit.',
      'For §45T: an eligible automatic-enrollment feature written into the plan.',
      'Cost and contribution records to support each credit; amounts entered net of the corresponding deduction.'
    ],
    risks: [
      'The employer-contribution credit phases down (100→25%) over five years and is keyed to employees under a wage threshold — the headline "$1,000/employee" overstates later years.',
      'The "no plan in the prior three years" test disqualifies employers restarting a recently terminated plan.',
      'Nonrefundable: startup-year losses common to new-plan sponsors can strand the credit in carryforward (not modeled).',
      'Credits reduce the deduction for the same costs — failing to net double-counts the benefit.'
    ],
    bestFit: [
      'Small businesses (≤ 50 employees) launching their first 401(k) or SIMPLE.',
      'Owners already planning large personal contributions who can layer the deduction on top of the credits.',
      'Employers adding auto-enrollment (increasingly required) who can capture the §45T $500.'
    ],
    implementation: [
      'Confirm no qualified plan covered substantially the same employees in the prior 3 years.',
      'Establish the plan and include an eligible automatic-enrollment arrangement to capture §45T.',
      'Track startup/administration costs and any per-employee employer contributions for the year.',
      'Compute the credits on Form 8881, net the related deductions, and carry to Form 3800.'
    ]
  },

  client: {
    teaser: 'Starting a retirement plan for your team can cost you almost nothing at first',
    headline: 'Let the government pay to start your retirement plan',
    plainEnglish: [
      'Setting up a 401(k) or similar plan for your business used to mean eating the setup and administration costs yourself. Now, for smaller businesses, the tax code covers those costs almost entirely through credits — up to $5,000 a year for the first three years, plus extra credits if you contribute for your employees and if you add automatic enrollment.',
      'That is on top of the usual tax deduction you get for the money you and your team put into the plan. So the first few years of a new plan can be close to free, while you build retirement savings and a benefit that helps you keep good employees.',
      'The main catch is that this is for genuinely new plans — you cannot restart a plan you just closed and claim it. When it fits, it is one of the best deals in the code for a growing small business.'
    ],
    analogy: 'It is like the government covering the sign-up fee — and part of the membership dues — for the retirement plan you were thinking about anyway.',
    benefits: [
      'Up to $5,000/year for three years toward plan startup costs',
      'Extra credits for contributing to employees and for auto-enrollment',
      'Stacks on top of the normal deduction for contributions',
      'Helps attract and keep good people'
    ],
    steps: [
      'We confirm you qualify and pick the right plan type',
      'We build in auto-enrollment to capture the extra credit',
      'We track the eligible costs and contributions',
      'We claim the credits on your return'
    ],
    considerations: [
      'This is for new plans — a plan you recently closed and reopen will not qualify.',
      'Some of the credits shrink after the first couple of years, so the biggest benefit is early.'
    ]
  },

  inputs: [
    { key: 'creditAmount', label: 'Total §45E + §45T credits for the year', type: 'currency', default: 0 }
  ],

  appliesTo: function (profile) {
    return true; // depends on plan-startup facts the advisor computes
  },

  /**
   * Adds the advisor-computed startup/auto-enrollment credits to otherCredits
   * (nonrefundable). Credits reduce the deduction for the same costs — enter
   * net. The contribution DEDUCTION itself is modeled by the paired
   * retirement-plan strategy, not here. §39 carryovers not modeled.
   */
  apply: function (profile, params, yearIndex, state) {
    var p = Object.assign({}, profile);
    var notes = [];
    var amt = Math.max(0, params.creditAmount || 0);
    p.otherCredits = (p.otherCredits || 0) + amt;
    if (yearIndex === 0) {
      notes.push(TSIQ.fmt.usd(amt) + ' §45E/§45T retirement-plan startup credits applied (nonrefundable). ' +
        'Enter net of the deduction reduction for the same costs. The contribution deduction is modeled separately by your retirement-plan strategy.');
      notes.push('These credits run only the first few plan years and the contribution credit phases down (100→25%). Adjust the amount by year rather than assuming it repeats flat.');
    }
    return { profile: p, notes: notes };
  }
});
