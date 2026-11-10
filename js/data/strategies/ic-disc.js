/* ============================================================================
 * STRATEGY: IC-DISC (Interest Charge Domestic International Sales Corporation)
 * One source object → advisor view, client PDF, client slideshow.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'ic-disc',
  name: 'IC-DISC (Export Commission Entity)',
  category: 'Entity Structure',
  applyOrder: 55,
  modeled: true,

  advisor: {
    summary:
      'An IC-DISC is a paper corporation that a U.S. exporter forms to convert ' +
      'ordinary export profit into qualified-dividend income. The operating ' +
      'company pays the DISC a commission — the greater of 4% of qualified ' +
      'export gross receipts or 50% of combined export net income (§994) — and ' +
      'deducts it as an ordinary expense. The DISC pays no federal income tax on ' +
      'that commission (§991). When the DISC distributes to its shareholders, ' +
      'they report the money as qualified dividends taxed at 0/15/20% plus NIIT ' +
      'rather than ordinary rates up to 37%. The benefit is pure rate arbitrage ' +
      'on income the business already earns from exporting.',
    mechanics: [
      'The DISC must be a separate domestic C corporation with a single class of ' +
      'stock and at least $2,500 of capital, and must elect DISC status on Form ' +
      '4876-A within 90 days of the start of its first tax year.',
      'Commission = greater of 4% of qualified export gross receipts OR 50% of ' +
      'combined taxable income from export sales (§994 intercompany pricing). ' +
      'Transaction-by-transaction grouping can raise the total above either ' +
      'aggregate figure.',
      '"Qualified export property" (§993): property manufactured, grown, or ' +
      'extracted in the U.S., held for sale/lease for use outside the U.S., with ' +
      'no more than 50% foreign content. Engineering and architectural services ' +
      'on foreign projects can also qualify.',
      'The operating company deducts the commission (ordinary, reduces ' +
      'pass-through or Schedule C income and, for a sole prop, self-employment ' +
      'tax). The DISC owes no tax on it; shareholders are taxed only on actual or ' +
      'deemed distributions as qualified dividends (§995).',
      'The "interest charge" is the cost of deferral on undistributed DISC income ' +
      'above $10M of export receipts — modest at current rates. Most closely held ' +
      'DISCs distribute currently and simply capture the rate spread.',
      'Character conversion, not creation: no benefit if the owner is already in ' +
      'the 0% qualified-dividend bracket, and the spread narrows for lower ' +
      'ordinary brackets. Model the delta between the owner\'s ordinary rate and ' +
      'the qualified-dividend rate on the commission amount.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §§991–997', note: 'The IC-DISC regime: §991 (DISC not taxed), §992 (qualification), §993 (qualified export receipts/property), §994 (intercompany pricing — 4%/50% commission methods), §995 (shareholder taxation).' },
      { type: 'Reg', cite: 'Treas. Reg. §1.994-1', note: 'The transfer-pricing methods and transaction-grouping rules that determine the maximum commission.' },
      { type: 'IRC', cite: 'IRC §1(h)(11)', note: 'DISC distributions are qualified dividend income to individual shareholders — the source of the rate arbitrage.' },
      { type: 'Admin', cite: 'Form 1120-IC-DISC; Form 4876-A', note: 'Annual DISC return and the election to be treated as a DISC (due within 90 days of the DISC tax year start).' }
    ],
    requirements: [
      'Genuine export activity: U.S.-produced goods (or qualifying engineering/architectural services) sold for use outside the United States.',
      'A separate, properly capitalized domestic C corporation with a timely Form 4876-A election and a single class of stock.',
      'A written commission agreement between the operating company and the DISC, with commissions actually computed and paid.',
      'Owners in an ordinary bracket meaningfully above the qualified-dividend rate — the spread is the entire benefit.'
    ],
    risks: [
      'No spread, no benefit: for owners already at low ordinary rates the commission just relocates income with setup cost left over.',
      'Qualified-export-property sourcing (the 50%-foreign-content limit) is fact-intensive and is where exams focus.',
      'The Roth-IRA-owned DISC (blessed in Summa Holdings, Inc. v. Comm\'r, 848 F.3d 779 (6th Cir. 2017)) is an aggressive amplification the IRS still contests outside that circuit — do not default to it.',
      'Requires real recordkeeping: the 4%/50% computation and transaction grouping must be documented annually.',
      'Annual compliance cost (separate return, bookkeeping) can outweigh the benefit below a few hundred thousand dollars of export income.'
    ],
    bestFit: [
      'Closely held manufacturers, distributors, growers, or software/engineering firms with meaningful foreign sales.',
      'Pass-through owners in the top ordinary brackets who currently pay 32–37% on export profit.',
      'Businesses with clean books able to substantiate export receipts and property sourcing.'
    ],
    implementation: [
      'Confirm qualified export receipts and property sourcing; quantify combined export net income.',
      'Form and capitalize the DISC (≥ $2,500), issue a single class of stock, and file Form 4876-A within 90 days of the DISC tax-year start.',
      'Adopt a written commission agreement; compute the commission under the 4%/50% methods with transaction grouping.',
      'Pay the commission from the operating company to the DISC; the DISC distributes to shareholders as qualified dividends.',
      'File Form 1120-IC-DISC annually and track any interest charge on deferred income above the $10M receipts threshold.'
    ]
  },

  client: {
    teaser: 'If you sell to customers overseas, part of that profit is taxed the wrong way',
    headline: 'Turn export profit into lower-taxed income',
    plainEnglish: [
      'If your business sells products (or certain design and engineering services) to customers outside the United States, the law offers a special reward. You set up a small, separate company that acts as a middleman on those export sales. Your main business pays that company a commission and deducts it, and the commission comes back to you taxed at the lower dividend rate instead of the higher rate that normally applies to business profit.',
      'Nothing about how you run your business changes. You keep selling the same products to the same overseas customers. The structure simply re-labels a slice of the profit you already earn so it is taxed the way investment income is — which for most owners is a meaningfully lower rate.',
      'It only helps if you are in a higher tax bracket and genuinely export, so we check both before recommending it. When it fits, it can quietly save real money every year with no change to operations.'
    ],
    analogy: 'It is like getting paid the same money, but on a lower-tax pay stub — available only because you sell to the rest of the world.',
    benefits: [
      'Converts a portion of export profit to the lower dividend tax rate',
      'No change to how you sell or who you sell to',
      'Repeats every year you export',
      'Fully sanctioned by a decades-old part of the tax code'
    ],
    steps: [
      'We confirm your overseas sales qualify and estimate the benefit',
      'We set up and register the small commission company for you',
      'Each year we calculate the commission and the paperwork',
      'The money reaches you taxed at the lower rate'
    ],
    considerations: [
      'It only pays off if you truly export and are in a higher bracket — we verify both first.',
      'There is a separate small tax return each year, so the export profit needs to be large enough to justify the upkeep.'
    ]
  },

  inputs: [
    { key: 'commission', label: 'Annual IC-DISC commission (4% of export receipts or 50% of export net income)', type: 'currency', default: 0 }
  ],

  suggest: function (p) {
    if ((p.scheduleCNet > 0 || p.passthroughK1 > 0)) {
      return { reason: 'If any business profit comes from exports, an IC-DISC can convert it to qualified-dividend rates.' };
    }
    return null;
  },

  appliesTo: function (profile) {
    return true; // validated in apply(): needs business income and an entered commission
  },

  /**
   * Shifts the commission out of ordinary business income and into qualified
   * dividends, capturing the ordinary-vs-QD rate spread. Deducts from
   * scheduleCNet (also saving SE tax) if present, else from passthroughK1;
   * adds the same amount to qualDiv. Requires an advisor-entered commission
   * computed under §994 — the tool does not derive it from export receipts.
   */
  apply: function (profile, params, yearIndex, state) {
    var p = Object.assign({}, profile);
    var notes = [];
    var comm = Math.max(0, params.commission || 0);
    if (comm <= 0) {
      if (yearIndex === 0) {
        notes.push('No commission entered — enter the §994 commission (greater of 4% of qualified export receipts or 50% of export net income) to model the benefit. No change applied.');
      }
      return { profile: p, notes: notes };
    }
    if (p.scheduleCNet > 0) {
      var fromC = Math.min(comm, p.scheduleCNet);
      p.scheduleCNet = p.scheduleCNet - fromC;
      p.qualDiv = (p.qualDiv || 0) + fromC;
      if (fromC < comm) notes.push('Commission capped at available Schedule C net income for modeling.');
      comm = fromC;
    } else if (p.passthroughK1 > 0) {
      var fromK = Math.min(comm, p.passthroughK1);
      p.passthroughK1 = p.passthroughK1 - fromK;
      p.qualDiv = (p.qualDiv || 0) + fromK;
      if (fromK < comm) notes.push('Commission capped at available pass-through income for modeling.');
      comm = fromK;
    } else {
      notes.push('No business income to source the commission from — an IC-DISC needs an operating company with export profit. No benefit modeled.');
      return { profile: p, notes: notes };
    }
    if (yearIndex === 0) {
      notes.push(TSIQ.fmt.usd(comm) + ' export commission reclassified from ordinary business income to qualified dividends (§§991–995). ' +
        'The benefit is the spread between your ordinary rate and the qualified-dividend rate — it is zero if you are in the 0% dividend bracket.');
      notes.push('COMMISSION MUST BE SUBSTANTIATED: the tool models whatever amount is entered. It must be computed under §994 (4% of qualified export gross receipts or 50% of combined export taxable income, with transaction grouping) and supported by export-property sourcing records (≤ 50% foreign content).');
    }
    return { profile: p, notes: notes };
  }
});
