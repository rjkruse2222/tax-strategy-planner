/* ============================================================================
 * STRATEGY: Grantor Retained Annuity Trust (GRAT)
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'grat-planning',
  name: 'Grantor Retained Annuity Trust (GRAT)',
  category: 'Succession & Exit',
  applyOrder: 82,

  advisor: {
    summary:
      'A GRAT is an irrevocable trust to which the grantor transfers appreciating ' +
      'assets while retaining the right to a fixed annuity for a term of years. ' +
      'Under §2702, the taxable gift is the fair market value of the transferred ' +
      'assets minus the actuarial present value of the retained annuity, computed ' +
      'using the §7520 rate in effect for the month of the transfer. A "zeroed-out" ' +
      'GRAT sets the annuity so the present value of the retained interest equals ' +
      '(or nearly equals) the value transferred, driving the taxable gift close to ' +
      'zero. If the assets appreciate and produce income faster than the §7520 ' +
      'hurdle rate over the term, the excess passes to the remainder beneficiaries ' +
      'entirely free of further gift or estate tax. The principal risk is mortality: ' +
      'if the grantor dies before the annuity term ends, some or all of the trust ' +
      'assets are pulled back into the grantor\'s gross estate, and the strategy ' +
      'produces no transfer-tax benefit.',
    mechanics: [
      'Grantor transfers assets to an irrevocable trust and retains a fixed-dollar ' +
      'or fixed-percentage annuity payable annually (or more frequently) for a stated ' +
      'term of years; at the end of the term, remaining trust assets pass to the ' +
      'named remainder beneficiaries (often a dynasty trust for children).',
      'The §7520 rate — published monthly by the IRS and equal to 120% of the ' +
      'applicable federal midterm rate, rounded — is the assumed growth rate used to ' +
      'value the retained annuity under Treas. Reg. §25.2702-3. Locking in the rate ' +
      'for the month of funding is a one-time election; later months\' rates do not matter.',
      'Zeroed-out (or near-zero) GRATs solve for an annuity payout large enough that ' +
      'the present value of the retained interest approximately equals the value of ' +
      'the contributed assets, so the taxable gift reported on Form 709 is minimal — ' +
      'preserving the grantor\'s lifetime gift/estate exemption for other uses.',
      'GRATs are typically structured as grantor trusts for income tax purposes ' +
      '(the grantor continues to pay income tax on trust income, which is itself an ' +
      'additional tax-free gift to the remainder beneficiaries since the trust is not ' +
      'depleted by its own tax liability).',
      'Short-term, rolling GRATs (2-3 years) funded with volatile, high-upside assets ' +
      '(concentrated stock, pre-IPO shares, carried interests) are the classic use case: ' +
      'they minimize the mortality-risk window per GRAT while maximizing the odds that ' +
      'at least some GRATs in the rolling series outperform the §7520 hurdle.',
      'If the grantor dies during the term, §2036 pulls some or all of the trust ' +
      'corpus back into the gross estate (the extent depends on the annuity structure ' +
      'and remaining term) — the downside is a failed technique, not a penalty; the ' +
      'assets are simply taxed as if the GRAT had never been done.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §2702', note: 'Special valuation rules for transfers in trust with retained interests — values a non-qualifying retained interest at zero unless it is a "qualified interest" (e.g., a qualified annuity interest).' },
      { type: 'Reg', cite: 'Treas. Reg. §25.2702-3', note: 'Defines a qualified annuity interest (fixed amount or fixed percentage, payable at least annually) and the actuarial method for valuing it using the §7520 rate.' },
      { type: 'Admin', cite: 'IRC §7520', note: 'Sets the discount rate (published monthly by the IRS, 120% of the applicable federal midterm rate) used to value the retained annuity interest and the resulting taxable gift.' },
      { type: 'IRC', cite: 'IRC §2036', note: 'Retained-interest estate-inclusion rule — the mechanism by which trust assets are pulled back into the gross estate if the grantor dies during the annuity term.' },
      { type: 'Admin', cite: 'Form 709', note: 'United States Gift (and Generation-Skipping Transfer) Tax Return — reports the GRAT transfer and the computed remainder gift.' }
    ],
    requirements: [
      'An irrevocable trust document establishing the annuity term, payout schedule, and remainder beneficiaries, drafted to satisfy the qualified-annuity-interest rules of Treas. Reg. §25.2702-3.',
      'Assets genuinely expected to outperform the §7520 rate in effect for the funding month — volatility and upside potential matter more than absolute expected return.',
      'A qualified appraisal for hard-to-value or non-marketable assets (closely held stock, real estate, carried interests) to support the reported gift value.',
      'Annual annuity payments actually made on schedule (in cash or in-kind at fair value) — administrative failure to pay can jeopardize qualified-interest status.',
      'A grantor healthy enough, and a term short enough, to make the mortality risk acceptable; consider rolling short-term GRATs instead of one long-term GRAT.'
    ],
    risks: [
      'Mortality risk: death during the term causes some or all assets to be included in the gross estate under §2036 — the technique simply fails, with no separate penalty, but the planning opportunity (and often the appreciation) is lost.',
      'Underperformance risk: if the assets do not outperform the §7520 hurdle, nothing passes to remainder beneficiaries beyond the annuity already returned to the grantor — no harm done, but no benefit either (a "heads I win, tails I tie" profile, not a guarantee).',
      'Valuation risk on hard-to-value assets invites IRS challenge; a formula clause and qualified appraisal help but do not eliminate exam risk.',
      'A zeroed-out GRAT with a de minimis gift may draw more scrutiny on whether the qualified-annuity-interest requirements were met precisely (rounding, payment timing).',
      'Rolling short-term GRATs multiply administrative cost and complexity (separate trusts, appraisals, annual filings) relative to a single long-term GRAT.',
      'Congress has repeatedly proposed minimum-term and minimum-gift-value requirements for GRATs (none enacted as of this writing) — monitor for legislative change before committing to a long rolling program.'
    ],
    bestFit: [
      'Owners of a concentrated, volatile, high-upside asset (pre-IPO or recently IPO\'d stock, a carried interest, a fast-growing closely held business) in reasonably good health.',
      'Clients who have used or want to preserve their $15,000,000 (2026) lifetime gift/estate exemption for other transfers, since a zeroed-out GRAT uses little to none of it.',
      'Estates large enough that shifting future appreciation outside the taxable estate is worth the administrative cost and complexity of trust and appraisal work.'
    ],
    implementation: [
      'Identify a candidate asset with genuine upside volatility and obtain a qualified appraisal if not publicly traded.',
      'Select the §7520 rate for the intended funding month and model the annuity payout needed to zero out (or near-zero) the taxable gift over the chosen term (typically 2-10 years).',
      'Engage estate planning counsel to draft the irrevocable trust satisfying Treas. Reg. §25.2702-3\'s qualified-annuity-interest requirements.',
      'Fund the trust, retitle the assets, and calendar the annuity payment dates — payments must be made on time, in cash or in-kind at fair value.',
      'File Form 709 reporting the transfer and the computed gift value; retain the appraisal and §7520 computation in the file.',
      'Consider a rolling short-term GRAT program (new 2-3 year GRAT funded annually) to diversify mortality risk across multiple trusts.'
    ]
  },

  client: {
    teaser: 'Pass future growth on a volatile asset to your family — outside your taxable estate',
    headline: 'Give away the growth, keep the income',
    plainEnglish: [
      'If you own an asset you think is about to grow a lot in value — a stake in a business before a sale, or a concentrated stock position — there is a way to give that future growth to your kids or grandkids without using up your estate tax exemption, while you keep getting paid back over a set number of years.',
      'You put the asset into an irrevocable trust and the trust pays you back a fixed amount each year for a period you choose, say five years. If the asset grows faster than a government-set benchmark rate during that time, everything above the benchmark passes to your family at the end of the term — free of gift and estate tax. If it does not grow that fast, you simply get the asset\'s value back through the payments, and nothing is lost.',
      'The one real risk is health: this only works if you live through the payment term. If something happens to you before the term ends, the asset comes back into your estate as if none of this had happened — so shorter terms and starting while healthy both matter.'
    ],
    analogy: 'It is like betting the house you already own will be worth more in five years, and agreeing that if it is, the extra value goes straight to your kids — tax-free.',
    benefits: [
      'Shifts future appreciation on a volatile, high-upside asset to your family free of gift and estate tax',
      'Uses little to none of your lifetime gift/estate exemption if structured as a "zeroed-out" GRAT',
      'You keep receiving annuity payments throughout the term — this is not a loss of income',
      'Works best on exactly the kind of asset most families already have concentration risk in'
    ],
    steps: [
      'We identify the best asset candidate and get it properly valued',
      'We work with estate counsel to draft the trust and set the payment schedule',
      'You transfer the asset in and receive scheduled payments back each year',
      'At the end of the term, anything left in the trust passes to your family tax-free'
    ],
    considerations: [
      'This only works if you outlive the payment term — we will help you choose a term that fits your health and risk tolerance.',
      'There is no guarantee of a benefit — if the asset does not outperform the benchmark rate, you simply get your value back with no downside, but also no transfer to your family.',
      'This requires irrevocably giving up control of the asset to the trust, subject to getting the scheduled payments back.'
    ]
  },

  inputs: [],

  appliesTo: function (profile) { return true; },

  apply: function (profile, params, yearIndex, state) {
    return { profile: profile, notes: yearIndex === 0
      ? ['Advisory strategy — appears in the plan documents but does not change the scenario math.']
      : [] };
  }
});
