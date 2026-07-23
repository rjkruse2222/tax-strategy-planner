/* ============================================================================
 * STRATEGY: Community-Property Double Step-Up (§1014(b)(6))
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'community-property-step-up',
  name: 'Community-Property Double Step-Up (§1014(b)(6))',
  category: 'Succession & Exit',
  applyOrder: 84,

  advisor: {
    summary:
      'Under §1014(a), property acquired from a decedent generally takes a basis ' +
      'equal to fair market value at death — a "step-up" (or step-down) that erases ' +
      'built-in gain or loss. For jointly held property in a common-law state, only ' +
      'the decedent\'s one-half interest gets this treatment; the survivor\'s half ' +
      'keeps its original basis. §1014(b)(6) provides a materially better result for ' +
      'community property: when one spouse dies, the ENTIRE community-property asset ' +
      '— both the decedent\'s half and the surviving spouse\'s half — receives a basis ' +
      'step-up to fair market value, provided at least one half was includible in the ' +
      'decedent\'s gross estate. The surviving spouse can then sell the asset with ' +
      'little or no capital gain. This is available automatically to couples with ' +
      'community property in a community-property state, and, increasingly, to ' +
      'couples in common-law states who elect into a community-property regime via a ' +
      'community-property trust in a state that permits opting in.',
    mechanics: [
      '§1014(a) sets the general basis-at-death rule: fair market value on the date ' +
      'of death (or the alternate valuation date if elected under §2032).',
      '§1014(b)(6) extends full step-up to both halves of community property if at ' +
      'least one-half of the whole interest was includible in the decedent\'s gross ' +
      'estate — this is the "double step-up," contrasted with jointly-held property ' +
      'in a common-law state, where only the decedent\'s half steps up and the ' +
      'survivor\'s half retains its original (often much lower) basis.',
      'Community-property states include Arizona, California, Idaho, Louisiana, ' +
      'Nevada, New Mexico, Texas, Washington, and Wisconsin (via its marital property ' +
      'regime), plus Alaska, Florida, Kentucky, South Dakota, and Tennessee where ' +
      'spouses may elect community property by agreement or trust.',
      'Couples domiciled in a common-law state can achieve the same result by moving ' +
      'assets into a community-property trust formed under the law of a state that ' +
      'permits non-residents to opt in (e.g., Alaska, South Dakota, Tennessee); the ' +
      'trust converts separately-owned or common-law marital property into community ' +
      'property by agreement between the spouses.',
      'The benefit is realized at the FIRST spouse\'s death — the surviving spouse\'s ' +
      'basis in the entire asset resets to date-of-death fair market value, ' +
      'eliminating built-in gain accumulated during the marriage up to that point ' +
      '(post-death appreciation is not affected and is taxed normally on a later sale).',
      'Only property properly characterized as community property qualifies — ' +
      'commingling, retitling, or state-law formalities matter; separate property ' +
      '(inherited assets, pre-marital assets not converted, assets titled and held as ' +
      'separate property under state law) does not get the double step-up.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §1014(a)', note: 'General rule: basis of property acquired from a decedent is its fair market value at the date of death (or alternate valuation date).' },
      { type: 'IRC', cite: 'IRC §1014(b)(6)', note: 'Extends full basis step-up to the surviving spouse\'s one-half interest in community property, provided at least one-half of the whole was included in the decedent\'s gross estate.' }
    ],
    requirements: [
      'The couple must actually hold the asset as community property under applicable state law, or via a validly formed community-property trust for couples in an opt-in state.',
      'At least one-half of the community-property interest must be includible in the decedent spouse\'s gross estate (routine for genuinely community-held property).',
      'Clear title and documentation establishing community-property character — retitling, marital property agreements, or the trust instrument, kept with the estate records.',
      'For the trust-election approach: formation under a state statute that permits non-resident opt-in (e.g., Alaska, South Dakota, Tennessee) and compliance with that state\'s formalities.',
      'Coordination with the couple\'s overall estate plan — converting assets to community property affects each spouse\'s individual control and disposition rights over "their" half.'
    ],
    risks: [
      'Converting separate property to community property changes each spouse\'s legal rights over it — on divorce, community property is typically split differently than separate property, so this is not a tax-only decision.',
      'Poor documentation or informal commingling can leave the community-property character of an asset unclear or contestable at the first spouse\'s death, undermining the double step-up.',
      'The community-property trust election is a relatively newer, less-litigated technique for common-law-state couples; some practitioners view it as carrying more uncertainty than native community-property-state ownership, though multiple states\' statutes have been in place for years.',
      'The benefit is triggered only at death — lifetime transfers or a divorce before death do not produce a step-up, and if the community asset is sold before the first death, no benefit applies.',
      'Only applies to property genuinely part of the community estate; assets kept as separate property (by agreement, inheritance, or gift with no commingling) get no step-up beyond the normal §1014(a) rule for the decedent\'s share, if any.'
    ],
    bestFit: [
      'Married couples in a community-property state holding significantly appreciated assets (a business, real estate, a concentrated investment) jointly as community property.',
      'Common-law-state couples with substantial unrealized gain on jointly-titled assets and no near-term plans to divorce, who are comfortable with the marital-property consequences of a community-property trust.',
      'Couples where one spouse is significantly older or in poorer health, making the first-death step-up event more near-term and the planning more time-sensitive.'
    ],
    implementation: [
      'Inventory jointly-held appreciated assets and identify built-in gain that would benefit from a full basis step-up at the first spouse\'s death.',
      'For community-property-state residents: confirm title and characterization align with community-property status; correct informal common-law-style titling if needed.',
      'For common-law-state residents: engage counsel to evaluate forming a community-property trust in an opt-in jurisdiction and to weigh the marital-property tradeoffs.',
      'Retitle or transfer qualifying assets into the community-property trust (or confirm community characterization) with proper documentation.',
      'At the first spouse\'s death, obtain a qualified appraisal establishing date-of-death fair market value to substantiate the new basis on both halves of the asset.'
    ]
  },

  client: {
    teaser: 'A little-known titling move that can erase capital gains tax for a surviving spouse',
    headline: 'Get a full basis reset — not just half — when the first spouse passes',
    plainEnglish: [
      'When a married couple owns an asset together and one spouse dies, the tax law usually resets only half the asset\'s value to what it is worth today — the surviving spouse\'s half keeps its old, often much lower, purchase price. If certain states\' rules apply to how you hold your property, the ENTIRE asset gets reset in value, not just half. That means if the surviving spouse later sells the asset, there may be little or no capital gains tax to pay.',
      'This is automatic for couples who live in one of the community-property states and hold their assets that way. For couples elsewhere, there is a way to opt into similar treatment by moving qualifying assets into a special trust set up under the laws of a state that allows it, even though you do not live there.',
      'This is a titling and planning decision, not just a tax one — how you hold property this way can affect what happens to it in a divorce, so it is worth doing deliberately and with proper documentation, not as an afterthought.'
    ],
    analogy: 'It is the difference between getting a fresh coat of paint on half your house versus the whole house — the more of the value gets reset, the less taxable gain is left when you eventually sell.',
    benefits: [
      'Can eliminate most or all capital gains tax on appreciated assets when the surviving spouse later sells',
      'Applies automatically to couples in community-property states who hold assets that way',
      'Available to couples elsewhere through a properly structured trust',
      'No cost to the government to elect — it is a matter of how title is held, not an extra tax filing'
    ],
    steps: [
      'We review which of your jointly-held assets have the most built-in gain',
      'We confirm whether your state already gives you this treatment, or whether a trust makes sense for you',
      'We coordinate the titling or trust paperwork with your estate attorney',
      'At the first spouse\'s passing, we help obtain the appraisal that documents the new, higher basis'
    ],
    considerations: [
      'This changes how the asset is legally treated between spouses, which matters if you ever divorce — this is not purely a tax decision.',
      'The benefit only shows up when the first spouse passes away — it does not help with a lifetime sale.',
      'Good documentation of how the asset is held matters; informal or unclear titling can put the benefit at risk.'
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
