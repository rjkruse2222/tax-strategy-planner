/* ============================================================================
 * STRATEGY: Irrevocable Life Insurance Trust (ILIT)
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'ilit-life-insurance-trust',
  name: 'Irrevocable Life Insurance Trust (ILIT)',
  category: 'Succession & Exit',
  applyOrder: 83,

  advisor: {
    summary:
      'An ILIT is an irrevocable trust that owns and is the beneficiary of a life ' +
      'insurance policy on the grantor\'s life. Because the trust — not the insured ' +
      '— owns the policy and the insured retains no incidents of ownership, the ' +
      'death benefit is excluded from the insured\'s gross estate under §2042, ' +
      'avoiding estate tax on proceeds that can otherwise be a large, illiquid ' +
      'estate-tax exposure. The ILIT provides estate liquidity (to pay estate tax, ' +
      'debts, or buy out a business interest) or funds an inheritance equalization ' +
      'plan, entirely outside probate and outside the taxable estate. Premiums are ' +
      'typically funded through annual gifts to the trust, converted into present-' +
      'interest gifts eligible for the annual gift-tax exclusion via Crummey ' +
      'withdrawal powers given to trust beneficiaries. If an existing policy is ' +
      'transferred into the trust rather than purchased new by the trust, §2035\'s ' +
      'three-year lookback can pull the proceeds back into the estate if the ' +
      'insured dies within three years of the transfer.',
    mechanics: [
      'The ILIT, not the insured, applies for and owns the policy (or an existing ' +
      'policy is transferred to the trust); the trust is both owner and beneficiary, ' +
      'and the insured retains no right to change the beneficiary, borrow against, ' +
      'surrender, or assign the policy — any of which would be an "incident of ' +
      'ownership" that pulls the proceeds back into the gross estate under §2042.',
      'The grantor makes annual cash gifts to the trust to cover premiums. Because a ' +
      'gift to an irrevocable trust is normally a gift of a future interest (not ' +
      'eligible for the annual exclusion), the trust gives beneficiaries a temporary ' +
      '(typically 30-day) right to withdraw their share of each contribution — a ' +
      '"Crummey" withdrawal power — which converts the gift into a present interest ' +
      'qualifying for the §2503(b) annual exclusion.',
      'Written Crummey notices must be sent to each beneficiary with withdrawal ' +
      'rights each time a contribution is made, and the beneficiary must have a real, ' +
      'communicated opportunity to withdraw (even though the expectation, honored by ' +
      'custom and often by a "hanging power" formula to manage lapse issues, is that ' +
      'they will not exercise it) — form matters as much as substance here.',
      'If an existing policy the insured already owned is transferred into the ILIT ' +
      '(rather than the trust purchasing a new policy directly), §2035 includes the ' +
      'death benefit in the gross estate if the insured dies within three years of ' +
      'the transfer — the "three-year rule." New policies applied for and owned by ' +
      'the trust from inception avoid this exposure entirely.',
      'ILITs are typically drafted as grantor trusts for income tax purposes and the ' +
      'trust is unfunded except for insurance and premium-gift cash, so there is ' +
      'usually no separate income tax return complexity beyond the gift/Crummey ' +
      'administration.',
      'Proceeds held in the ILIT (rather than paid directly to heirs) can be structured ' +
      'to provide liquidity to the estate — e.g., the trustee lends proceeds to the ' +
      'estate or purchases estate assets — without those proceeds themselves becoming ' +
      'part of the taxable estate, and without dictating how the underlying business ' +
      'or other assets must be liquidated to pay estate costs.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §2042', note: 'Includes life insurance proceeds in the gross estate if payable to the estate, or if the insured possessed any incident of ownership at death — the rule the ILIT is structured to avoid.' },
      { type: 'IRC', cite: 'IRC §2035', note: 'Three-year lookback: proceeds of a policy transferred by the insured within three years of death are pulled back into the gross estate — the reason new policies should be applied for directly by the trust.' },
      { type: 'IRC', cite: 'IRC §2503(b)', note: 'The annual gift-tax exclusion — available only for gifts of a present interest, which is why Crummey withdrawal powers are used to convert premium-gift contributions into present interests.' }
    ],
    requirements: [
      'An irrevocable trust document naming the trust as policy owner and beneficiary, with Crummey withdrawal powers for beneficiaries and no retained powers for the grantor over the policy.',
      'The insured must not act as trustee in a way that retains incidents of ownership, and must not personally pay premiums directly to the insurer (gifts should flow through the trust).',
      'A qualified independent trustee (not the insured, and typically not the insured\'s spouse if broad powers are retained) to administer Crummey notices and premium payments.',
      'For existing policies transferred in: awareness of, and if possible planning around, the §2035 three-year lookback; for new policies, direct application and ownership by the trust from day one.',
      'Timely, documented Crummey notices to each beneficiary with withdrawal rights for every contribution to the trust.'
    ],
    risks: [
      'Retained incidents of ownership (even informal ones, like the insured continuing to pay premiums personally or retaining a right to change beneficiaries) can cause full inclusion under §2042, defeating the entire structure.',
      'Failure to send or document Crummey notices is a common exam issue — the IRS has challenged annual-exclusion treatment where notices were not sent or beneficiaries had no genuine withdrawal opportunity.',
      'The §2035 three-year rule means a transferred (not newly purchased) policy provides no estate-tax benefit if the insured dies within three years of the transfer — a real risk for older or unhealthy insureds.',
      'Irrevocability is real: the grantor permanently gives up access to and control over the policy and its cash value; this is not reversible if circumstances change.',
      'Crummey withdrawal rights that are too broad or too numerous can create gift-tax and generation-skipping-transfer complications (the "5-and-5" and "hanging power" issues) — drafting quality matters.'
    ],
    bestFit: [
      'Insureds with an estate likely to face estate tax exposure or an illiquid estate (closely held business, real estate) needing cash at death to pay tax or equalize inheritances among heirs.',
      'Clients who do not currently own a policy and can have the trust apply for and own a new one from inception, avoiding the §2035 lookback entirely.',
      'Families wanting to keep insurance proceeds out of probate and outside the reach of the insured\'s creditors and estate tax.'
    ],
    implementation: [
      'Engage estate planning counsel to draft the ILIT with Crummey withdrawal provisions and select an independent trustee.',
      'Apply for a new policy directly in the trust\'s name (preferred), or if transferring an existing policy, document the transfer date and calendar the three-year §2035 window.',
      'Establish an annual gifting schedule to fund premiums; send written Crummey notices to each beneficiary with withdrawal rights for every contribution.',
      'Confirm the insured retains no incidents of ownership — no premium payments made personally, no retained right to borrow, assign, or change the beneficiary.',
      'Coordinate with the overall estate plan on how proceeds will be used at death (loan to the estate, purchase of estate assets, direct distribution) to provide liquidity without re-including the proceeds in the estate.'
    ]
  },

  client: {
    teaser: 'Life insurance proceeds your family keeps entirely — none of it lost to estate costs',
    headline: 'Keep life insurance proceeds out of your taxable estate',
    plainEnglish: [
      'Most people assume life insurance is automatically tax-free to their family. The death benefit itself usually is income-tax-free — but if you personally own the policy, its full value can still count as part of your taxable estate, which can create an unexpected tax bill for a large estate. An ILIT fixes this by having a trust — not you — own the policy from the start.',
      'You fund the trust with a gift each year to cover the premium, and the trust pays the insurance company. Because the trust owns the policy and you keep no strings attached to it, the death benefit passes to your family completely outside your taxable estate. If your estate needs cash to pay taxes, settle debts, or buy out a business partner, the trust can provide that liquidity without those insurance dollars being taxed themselves.',
      'The one thing to plan around: if you move an existing policy into the trust rather than starting a new one there, the tax law gives it a three-year "probation period" — if something happens to you within three years of the transfer, the benefit reverts to being included in your estate. Starting a brand-new policy inside the trust avoids that issue entirely.'
    ],
    analogy: 'It is like putting the insurance policy in a locked box that is not part of your house — so when your house is counted up for estate purposes, what is in the box is not counted with it.',
    benefits: [
      'Keeps life insurance proceeds out of your taxable estate entirely',
      'Provides cash your family or your estate can use immediately, without probate delay',
      'Can fund an inheritance equalization plan (e.g., a family business goes to one child, insurance proceeds to the others)',
      'Ongoing premiums can be funded with modest annual gifts that use your annual gift-tax exclusion'
    ],
    steps: [
      'We design the trust and select an independent trustee to manage it',
      'We help apply for a new policy owned directly by the trust, avoiding a waiting period',
      'You make an annual gift to the trust; we handle the notices required to keep those gifts tax-free',
      'At your death, proceeds flow to the trust and out to your family or your estate exactly as planned — outside the taxable estate'
    ],
    considerations: [
      'This is irrevocable — once the trust owns the policy, you give up control over it permanently.',
      'If you move an existing policy in rather than starting fresh, there is a three-year waiting period before the estate-tax benefit is guaranteed.',
      'The annual gift notices are a real paperwork requirement, not optional — we handle them, but they must happen every year.'
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
