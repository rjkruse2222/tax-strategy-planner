/* ============================================================================
 * STRATEGY: Intra-Family Loans (§7872 / AFR)
 * One source object → advisor view, client PDF, client slideshow.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'intra-family-loans-7872',
  name: 'Intra-Family Loans (§7872 / AFR)',
  category: 'Succession & Exit',
  applyOrder: 46,
  modeled: false,

  advisor: {
    summary:
      'A family member can lend to another family member — to buy a home, ' +
      'fund a business, or seed an investment — at the Applicable Federal ' +
      'Rate (AFR), which is typically well below commercial lending rates, ' +
      'without the arrangement being recharacterized as a gift, as long as ' +
      'the loan charges interest at or above the AFR and is documented as a ' +
      'bona fide loan. §7872 governs below-market loans between related ' +
      'parties: charge less than the AFR and the code imputes interest income ' +
      'to the lender and a gift (or compensation) from lender to borrower for ' +
      'the foregone interest. Charge at least the AFR and none of that ' +
      'applies. If the borrower can invest the proceeds at a return above the ' +
      'AFR, the spread compounds outside the lender\'s estate — a classic ' +
      'estate-freeze technique — but that outcome depends entirely on the ' +
      'loan being real, not a disguised gift.',
    mechanics: [
      '§7872 recharacterizes a below-market loan between related parties: the ' +
      'lender is treated as receiving imputed interest at the AFR (taxable ' +
      'income) and as making a gift (for a gift loan) or paying compensation ' +
      '(for a compensation-related loan) to the borrower equal to the ' +
      'foregone interest — even though no cash actually changes hands for ' +
      'that imputed amount.',
      'The AFR is published monthly by the IRS under §1274(d), in short-term ' +
      '(≤3 years), mid-term (>3 to 9 years), and long-term (>9 years) tiers, ' +
      'each with annual/semiannual/monthly/annual compounding variants — the ' +
      'rate is fixed for the life of a term loan by selecting the AFR in ' +
      'effect for the month the loan is made (or, for demand loans, the ' +
      'blended annual rate applies and floats).',
      '§7872(d) provides a de minimis exception for gift loans of $10,000 or ' +
      'less between individuals (not applicable if the proceeds are used to ' +
      'buy income-producing property) and a $100,000 aggregate exception ' +
      '(with imputed interest capped at the borrower\'s net investment income, ' +
      'and a further exception if that net investment income is $1,000 or ' +
      'less) — verify current-year thresholds and whether they still fit the ' +
      'fact pattern before relying on either exception.',
      'Charging at least the AFR removes the loan entirely from §7872\'s reach ' +
      '— no imputed interest, no imputed gift — so the lender\'s actual stated ' +
      'interest (at or above AFR) is simply ordinary interest income, and the ' +
      'borrower\'s payments are simply loan repayment, not a taxable event.',
      'Estate-freeze mechanics: if the loan proceeds are invested (or used in ' +
      'a business) that earns a total return above the AFR cost of the loan, ' +
      'the excess return accrues to the borrower (the younger generation) ' +
      'without using any gift or estate tax exemption — the lender\'s estate ' +
      'is frozen at the face amount of the loan (plus any accrued but unpaid ' +
      'interest) rather than growing with the underlying asset.',
      'A loan that is not respected as bona fide debt (no note, no fixed ' +
      'repayment terms, no expectation or practice of repayment, interest not ' +
      'actually paid) risks being recharacterized as an outright gift of the ' +
      'full principal for gift-tax purposes under general gift-tax principles ' +
      'and §2512 valuation concepts — the AFR-compliance analysis under §7872 ' +
      'does not by itself establish that a real loan exists.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §7872', note: 'Below-market loans between related parties: imputes interest income to the lender and a gift or compensation payment to the borrower for interest charged below the AFR; contains the de minimis and $100,000 gift-loan exceptions.' },
      { type: 'IRC', cite: 'IRC §1274(d)', note: 'Source of the Applicable Federal Rate, published monthly by the IRS in short-term, mid-term, and long-term tiers used to test whether a loan is below-market under §7872.' },
      { type: 'IRC', cite: 'IRC §2512', note: 'General gift-tax valuation principles relevant to whether an intra-family transfer structured as a loan is respected as debt or recharacterized as a gift of principal.' }
    ],
    requirements: [
      'A written promissory note with a fixed principal, a stated maturity or demand terms, a stated interest rate at or above the applicable AFR tier for the loan\'s term, and a defined repayment schedule.',
      'Interest actually charged and actually paid (or accrued and tracked) consistent with the note — not merely documented and ignored.',
      'A genuine expectation and practical ability of the borrower to repay — the lender should not be a client for whom "loan" is understood by both parties as a euphemism for "gift."',
      'Selection of the correct AFR tier (short/mid/long-term) based on the loan\'s actual term, using the rate published for the month the loan is made (fixed for term loans; the blended rate floats annually for demand loans).',
      'For larger loans intended to fund an investment or business meant to outperform the AFR, an intended use of proceeds capable of generating that spread — otherwise the estate-freeze benefit does not materialize.'
    ],
    risks: [
      'Recharacterization as a gift is the central risk: informal family loans that are never enforced, never repaid, or lack documentation are the fact pattern courts and the IRS look for — treat every intra-family loan with the same rigor as an arm\'s-length loan.',
      'Loans exceeding the lender\'s available applicable exclusion amount and later forgiven (in whole or part) are gifts at the time of forgiveness, using gift-tax exemption or triggering gift tax at that time — forgiveness should be a deliberate, documented decision, not a default outcome.',
      'The estate-freeze upside is not guaranteed — if the borrower\'s investment underperforms the AFR (or loses money), the family is worse off than an outright gift would have been, and the borrower still owes principal and interest.',
      'Demand loans use a blended annual rate that resets each year — a lender who intends a long-term fixed-rate arrangement should use a term loan with the corresponding AFR tier, not a demand note.',
      'Imputed interest under §7872 is taxable to the lender annually even if not actually collected in a below-AFR scenario — a reason to simply charge at least the AFR rather than rely on an exception.',
      'State usury and family-law considerations (e.g., loans tied up in a later divorce or dispute) are outside this tool\'s scope — coordinate with counsel on non-tax risk.'
    ],
    bestFit: [
      'Families wanting to help a child or grandchild buy a home, start or expand a business, or make an investment, while keeping future appreciation out of the lender\'s taxable estate.',
      'Lenders with more liquidity than gift-tax exemption they wish to use currently, who are comfortable extending credit rather than making an outright gift.',
      'Situations where the borrower has a credible plan to generate a return above the AFR (a business, an investment strategy, or simply financing at a below-market rate versus a bank).',
      'Estate-freeze planning generally: pairs conceptually with GRATs, installment sales to grantor trusts, and other freeze techniques, though it is simpler to document and does not require a trust.'
    ],
    implementation: [
      'Determine the loan term and select the corresponding AFR tier (short/mid/long-term) for the month of the loan; document the published rate used.',
      'Draft a promissory note: principal, interest rate, payment schedule, maturity, and default terms — treat it as a real loan document, not a formality.',
      'Set up an actual payment mechanism (checks, bank transfers) and keep records of every payment made and received.',
      'If the loan funds an investment or business, keep separate documentation of how proceeds were used and their performance versus the AFR cost.',
      'Revisit annually: confirm interest is being paid or properly accrued, and document any decision to modify terms, forgive amounts (as a deliberate gift using exemption), or call the loan.'
    ]
  },

  client: {
    teaser: 'A way to help family financially that can shift future growth to the next generation, not just hand over cash',
    headline: 'Lend within the family — at a rate the IRS accepts, on terms that protect everyone',
    plainEnglish: [
      'When you want to help a child or grandchild buy a home, start a business, or make an investment, there are two basic ways to do it: give them the money outright, or lend it to them. The tax law sets a minimum interest rate each month — usually well below what a bank would charge — and as long as you charge at least that rate and treat it like a real loan, it is not treated as a gift.',
      'If the money you lend is used well — say, to buy a home that appreciates or fund a business that grows — the value created above what you charged in interest belongs to the person you lent to, not to you. That means future growth moves to the next generation without using up any of your lifetime gift and estate tax exemption.',
      'The key word is "real." This only works if the loan looks and acts like a loan: a written agreement, a real interest rate, and interest that actually gets paid. A loan in name only, that everyone understands will never be repaid, will not hold up and could simply be treated as a gift of the entire amount.'
    ],
    analogy: 'Think of it as being the family\'s bank instead of the family\'s ATM — you charge a rate low enough to genuinely help, but real enough that it stays a loan in the eyes of the law.',
    benefits: [
      'Interest rates that can be well below what a commercial lender would charge',
      'Does not use up your lifetime gift and estate tax exemption, as long as it is properly documented',
      'If the borrower\'s use of the money grows in value, that growth belongs to them, outside your taxable estate',
      'More flexible than an outright gift — the money can come back to you if circumstances change'
    ],
    steps: [
      'We help you pick the right minimum interest rate for the loan\'s length',
      'We draft a proper loan document — amount, rate, payment schedule, maturity',
      'We set up how payments will actually be made and tracked',
      'We check in each year to make sure everything still looks like, and is treated as, a real loan'
    ],
    considerations: [
      'This only works if it is a genuine loan — real payments, real terms, real expectation of repayment.',
      'If the investment or use of funds underperforms, the family could end up worse off than simply making a gift.',
      'Forgiving the loan later is possible but is itself treated as a gift at that time — it should be a deliberate decision, not something that just happens by default.'
    ]
  },

  inputs: [],

  appliesTo: function (profile) {
    return true;
  },

  apply: function (profile, params, yearIndex, state) {
    return { profile: profile, notes: yearIndex === 0
      ? ['Advisory strategy — appears in the plan documents but does not change the scenario math.']
      : [] };
  }
});
