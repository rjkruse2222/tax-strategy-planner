# Strategy Mining Ledger

Systematic pass over the 143 substantive communities of the tax-education
knowledge graph (1,003 transcripts + Bradford articles → 4,873 concepts),
diffed against the strategy library. Every authorable concept is classified:
**NEW** (author), **EXISTING** (already in library), **KB** (client-guide
material, not a planner strategy), or **FLAGGED** (stale / abusive / listed
transaction — excluded per the vetting gate and CLAUDE.md's no-invented-
citations / accuracy-first rules).

Base corpus: 1,003 files (909 Bradford articles + 82 academy transcripts).
This is a candidate ledger, not a reproduction of any source content.

## NEW — authored (business/entity, first batch of 9)

| Strategy | Authority | Type |
|---|---|---|
| IC-DISC export commission | §§991–997 | modeled |
| FICA Tip Credit | §45B | modeled |
| Retirement plan startup credits | §45E / §45T | modeled |
| Qualified Joint Venture election | §761(f) | advisory |
| §754 basis step-up | §754 / §743(b) / §734(b) | advisory |
| §338(h)(10) M&A election | §338(h)(10) | advisory |
| R&D payroll-tax credit | §41(h) / §3111(f) | advisory |
| IRMAA planning | SSA §1839(i) | advisory |
| Carried interest / §1061 | §1061 | advisory |

## NEW — to author (second batch, investment / estate / other)

| Strategy | Authority | Type | Cluster |
|---|---|---|---|
| QCD (IRA-to-charity) | §408(d)(8) | modeled | 78, 79 |
| NUA (employer stock) | §402(e)(4) | advisory | (equity) |
| §83(b) election | §83(b) | advisory | (equity) |
| §1045 QSBS rollover | §1045 | advisory | 88 |
| Trader mark-to-market election | §475(f) | advisory | 54 |
| Crypto tax-loss harvesting (wash-sale gap) | §1091 (n/a to property) | advisory | 96, 138 |
| §1033 involuntary conversion deferral | §1033 | advisory | 135 |
| Intra-family / below-market loans | §7872 (AFR) | advisory | 111 |
| §336(e) election (noncorporate buyer) | §336(e) | advisory | 133 |
| DSUE portability election | §2010(c) | advisory | (estate) |
| GRAT | §2702 | advisory | (estate) |
| ILIT / Crummey trust | §2042 / Crummey | advisory | (estate) |
| GST exemption planning | §2631 | advisory | (estate) |
| Community-property double step-up | §1014(b)(6) | advisory | 75, 85 |

*(§121 home-sale planning, controlled-group avoidance, and education funding /
529-to-Roth were considered and deferred: the first two are largely compliance
+ fact-specific, and 529-to-Roth is an individual item better suited to the KB.)*

## EXISTING — already in the library (graph confirms coverage)

The corpus overwhelmingly reinforced what the library already has. Representative
already-covered concepts by cluster: vehicle expense method & heavy-vehicle §179
(0,4,55,71,120,131), §199A in all its forms — SSTB, aggregation, wage limit,
rental safe harbor (2,37,38,46,61,93,102,105,141), home office (6,18,66,113,114,
118), cost segregation (65), 1031 (16,65), opportunity zones (91), reasonable
comp (24,73,141), hiring children (13,32,39,77), Augusta (2,42), HRAs/ICHRA/
QSEHRA/§105 (12,43,44,49,59,94,112,139), SE health (36,119,129,139), retirement
plans (2,56), PTET/SALT (10,86,92), NOL (9,90,136), de minimis / repairs (110),
gain-loss harvesting (93), DAF bunching (93), C-corp conversion & QSBS (10,88,
107,122), entity selection (11,42), accountable plan (69,114), meals (140),
§127 education (53), passive activity / REPS / STR loophole (30,31,68,89,106,
121), grouping election (121), bonus depreciation (28,55,67,71), §179 (9,37).

## KB — client-guide material (not planner strategies)

The single largest bucket. These are the compliance and reference articles that
belong in the client knowledge base, not the strategy engine:

- **Substantiation:** §274(d) records, mileage logs, $75 receipt rule, digital
  records (48,66,131,142)
- **Health/retirement mechanics:** HSA triple benefit, RMDs, contribution
  limits, Medicare parts (56,70,112,119)
- **Education funding:** 529, Coverdell, 529-to-Roth, student loan interest
  (99,108,128)
- **Penalties & authority:** preparer penalties, reasonable cause, authority
  hierarchy, disclosure standards, statute of limitations (81,95,97,98,125)
- **Foreign reporting:** FBAR, PFIC, 5471/8865, BOI (132)
- **Historical/expired relief:** PPP, ERC, COVID leave credits, EIDL
  (35,41,60,74,90,104,116,117,125,128,130) — retain as reference only
- **Individual credits:** CTC, AOTC, ACA PTC, child-care (individual side)

## FLAGGED — excluded (stale / abusive / listed transaction)

Not authored. Recorded so the exclusion is visible and defensible:

| Concept | Reason | Cluster |
|---|---|---|
| Abusive §831(b) micro-captive | Listed transaction (T.D. 10029, Jan 2025); Form 8886 | 127 |
| Syndicated conservation easements | Listed transaction (Notice 2017-10); SECURE 2.0 §605 2.5× cap | 126 |
| Monetized installment sale (§453) | Listed transaction / IRS "danger area" | 84 |
| Restricted Property Trust / 419 welfare-benefit | Abusive, 419-adjacent | (life ins.) |
| Empowerment Zone employment credit | Lapsed / expired | 47 |
| Clean vehicle credits (§30D/§45W/§25E/§30C) | Terminated by OBBBA (2025–26) | 47,67,124 |
| Self-directed IRA / checkbook LLC | Prohibited-transaction risk (§4975) — judgment-only | 70 |
| Roth-owned IC-DISC | Aggressive (Summa Holdings, 6th Cir.); IRS-contested — judgment | 64,127 |
| Personal captive & legit conservation | Left out per advisor decision despite legitimacy | — |

## Why the net-new count is what it is

~1,000 files → ~3,000 unique concepts. After collapsing heavy aliasing,
removing definitions/doctrines/cases, removing the ~85 already-covered
strategies, routing the large compliance/reference bucket to the KB, excluding
stale/abusive concepts, and setting aside individual-only items, the genuinely
new, current, authorable strategies land at **~23** (9 + 14). The corpus's
larger value is (1) validating the library's mainstream coverage is complete,
(2) supplying the KB outline, (3) flagging OBBBA updates to existing strategies,
and (4) the do-not-sell list above.
