# CCH ProSystem fx Planning (`.pln`) format notes

Reverse-engineered from two real plans — one written by **2025.02000** and one
created in 2025.02000 and upgraded in place to **2026.01000** ("AccuPlnr") —
for the browser parser in `js/engine/pln-parser.js`. No client data appears
here — only structure, offsets, and encodings. The two versions turned out to
be **byte-compatible for everything the parser reads**; see §11 for the
version-specific caveats.

## 1. Container

A `.pln` is a plain **ZIP** archive (local file headers + central directory +
EOCD). It holds exactly three members:

| Member          | Contents                                  | Typical size |
|-----------------|-------------------------------------------|--------------|
| `FileInfo`      | plan metadata (text)                      | ~6 KB        |
| `FileData`      | the binary plan database                  | ~1.5 MB      |
| `<ClientID>.log`| plain-text audit log (ignored)            | ~8 KB        |

**Compression caveat (important).** `FileInfo` uses classic DEFLATE (method 8),
but `FileData` and the log use **method 9 = Deflate64 / "Enhanced Deflate"**.
`DecompressionStream('deflate-raw')` and any plain zlib inflater **cannot**
decode method 9 (they fail with *"too many length or distance symbols"*). The
parser therefore bundles a small pure-JS INFLATE that implements both classic
DEFLATE and the Deflate64 extensions:

- length code **285** = base 3 + **16 extra bits** (classic DEFLATE fixes it at 258),
- distance codes **30 and 31** (base 32769 / 49153, 14 extra bits each),
- a 64 KB back-reference window.

For method 8 the parser prefers the platform `DecompressionStream` when present
and falls back to the bundled inflater; method 9 always uses the bundled
inflater; method 0 (stored) is copied.

## 2. `FileInfo`

```
0x000  u32 = 4
0x008  "UD  "                     (4 bytes: 0x55 0x44 0x20 0x20)
0x00C  00 01 00 00
0x010  text block, CRLF-separated "Label:\t<value>" lines:
         Plan Name:\t<v>
         Plan Description:\t<v>
         Prepared By:\t<v>
         Client ID:\t\t<v>       (note: two tabs)
         Taxpayer Name:\t<v>
         Spouse Name:  \t<v>
       (block terminates at a run of NUL bytes)
0x400  producer version string, NUL-terminated (e.g. "2025.02000")
0x410  user display name, NUL-terminated
0x510  original absolute file path, NUL-terminated
```

Identical in both versions. Note the fields are only as good as the preparer's
data entry — plans exist whose `Plan Name` holds the taxpayer name while
`Taxpayer Name` is blank.

## 3. `FileData` record stream

A flat, back-to-back sequence of length-prefixed records to EOF:

```
[u8 type][u8 sub][u8 00][u32 size LE][payload … size bytes]
```

The middle byte is always `0x00`; `size` is the payload length (header
excluded). Walking `off += 7 + size` consumes the file exactly. Record types
observed:

| type | role                                                            |
|------|-----------------------------------------------------------------|
| 0x01 | file/root header (once)                                         |
| 0x06 | chunk marker                                                     |
| 0x08 | chunk sub-header                                                 |
| 0x0a | **section marker** (partitions a chunk — see §3.3)              |
| 0x0c | screen/section header, 58-byte payload (form id + UI geometry)  |
| 0x0e | **screen data / labels** — the payload that matters             |

### 3.1 `0x0e` payload header

```
+0x18  u32   heap pointer from the original C++ serialization (ignore)
+0x20  u8    caseId       (0x01 = shared template; N>=2 = plan case N-1)
+0x21  u8    yearColumn   (1-based year-column index of this data column)
+0x22  01 00
+0x24  u16   screen id    (form type; unique only WITHIN a section, see §3.3)
+0x26  u16   instance     (1-based; e.g. W-2 #1, #2, …)
```

### 3.2 Chunking — cases and year columns

Records are partitioned into contiguous chunks by `(caseId, yearColumn)`:

- `(01,01)` — **template**: screen labels, activity names, plan config. No
  values. (Screen ids in the template are generally the **case screen id + 1**
  for the activity input screens — e.g. W-2 labels live on template screen 323
  while W-2 case data lives on screen 322 — so never join template labels to
  case values by id.)
- `(N,y)`, N ≥ 2 — the data column for **case N-1, year column y**.

**This was misread in the first pass.** A single-case plan with three year
columns serializes as `(2,1) (2,2) (2,3)` — which looks deceptively like
"caseGroup 2, cases 1..3" — while a three-case plan serializes as
`(2,x) (3,1) (4,1)`. `+0x20` is the case, `+0x21` the year column, in **both**
2025.02000 and 2026.01000. A case's year columns need not start at 1 (a case
whose only populated column is year 2 stores just `(N,2)`); empty year columns
are simply not written. Ground truth for the split is the per-chunk case/year
settings record (§4).

### 3.3 Sections within a chunk

Inside one chunk, `0x0a` marker records split the `0x0e` records into
**sections**:

- **section 0 — the federal plan**: activity input screens + computed federal
  worksheets. Everything the parser decodes comes from here.
- later sections: tax-rate tables, the resident-state plan (screens for the
  state return; carries the state tax, city tax, and the column's year again),
  and more state/city detail.

Sections **reuse screen ids** (there is a federal screen 29 and a state screen
29), so a decoder must track the section index: reset a counter to 0 whenever
the `(caseId, yearColumn)` tag changes, increment it at each `0x0a` record.

## 4. Case/year settings — screen 207

Each case-year chunk carries one screen-207 record (~1.4 KB) with the column's
identity. Strings are stored as `[len u8][00][00][text NUL]`; read the text at
label offset + 3:

| offset  | field                                             |
|---------|---------------------------------------------------|
| +0x83   | u32 **tax year** of this column (e.g. 2025)       |
| +0x2c7  | case caption (the case's display name)            |
| +0x2f3  | year-column caption (e.g. "Year 2"; may be blank) |
| +0x30b  | resident state code (e.g. "OH"; blank = none)     |
| +0x323  | taxpayer full name                                |
| +0x377  | spouse full name                                  |

Verified: a one-case three-column plan shows the same case caption in all three
chunks with years 2024/2025/2026 (the 2024 column's W-2s use the 2024 Social
Security wage cap — independent confirmation); a three-case plan shows three
different captions, all year 2025. The parser falls back to the mode of
plausible year u32s across `FileData` when +0x83 is out of range.

## 5. Numeric encoding

All amounts are **IEEE-754 float64, little-endian**. No currency scaling.
(Confirmed on W-2 records where withheld amounts equal 6.2% / 1.45% of the wage
base exactly, capped at the year's Social Security wage base.)

## 6. The summary grid — screen 3 (tie-out anchor)

Each case-year chunk's federal section contains one screen-3 record
(~3126 bytes; a second, 408-byte screen-3 record appears later and is empty).
Doubles begin at payload **+0x63**, indexed `slot k → payload + 0x63 + 8*k`.
Validated slots (stable across both producer versions):

| slot | meaning                                                    |
|------|------------------------------------------------------------|
| 0    | wages (income line 1)                                      |
| 1    | taxable interest                                           |
| 2    | tax-exempt interest (display only — NOT in total income)   |
| 3    | ordinary dividends (1040 line 3b, includes qualified)      |
| 6    | business income (Schedule C, total)                        |
| 7    | capital gain/(loss) — Schedule D net (ST + LT)             |
| 10   | other gains (Form 4797 / installment-sale ordinary income) |
| 17   | other income                                               |
| 19   | total income                                               |
| 23   | adjustments subset (equals slot 34 in simple plans)        |
| 29   | adjusted gross income (AGI)                                |
| 34   | **adjustments to income (full line — use this one)**       |
| 108  | taxable income before QBI                                  |
| 140  | deduction (standard or itemized)                           |
| 141  | taxable income (final)                                     |
| 143  | qualified business income deduction                        |
| 195  | ordinary-rate income portion of AGI                        |
| 210  | **Schedule E line — rents/royalties/partnerships/S-corps** |
| 281  | net-tax row (2025.02000 only; written 0 by 2026.01000)     |

Slots 4, 5, 8, 9, 11–16, 18 are additional income lines (state refunds,
alimony, farm, unemployment, retirement, Social Security, …) whose individual
captions have not been pinned to a slot; they participate in the total-income
identity below and surface only inside the imported "other income" residual.

**Corrections vs. the first pass:** slot 210 is *not* "preferential income
(LTCG + qualified dividends)" — it is the Schedule E line (proved by summing
the per-K-1 worksheets, §7.4, to the dollar in both plans). Qualified
dividends and net LTCG live on the tax-computation worksheet (§7.3). And slot
23 is only a subset of adjustments: a plan with an "other adjustment" activity
shows it in slot 34 but not 23, so the AGI identity must use 34 (fall back to
23 for old fixtures).

**Self-consistency (checked before trusting anything):**

```
AGI          = total income − adjustments            (29 = 19 − 34, else 19 − 23)
taxable      = AGI − deduction − QBI deduction       (141 = 29 − 140 − 143)
total income = Σ(income slots 0..18, excluding 2) + slot 210
ordinary     = Σ(income slots, excl. 2) − adjustments (195; implied by the above)
```

A case-year whose grid fails the first two identities is dropped (warning);
per-line income fields additionally require the third.

## 7. Federal worksheets with validated fixed offsets

All in section 0 of each case-year chunk. Every emitted field is gated on the
listed cross-check; when the check fails the field is omitted with a warning.

### 7.1 W-2 — screen 322 (detected by FICA signature)

One record per W-2. Offsets within payload:

| offset | field                                        |
|--------|----------------------------------------------|
| +0x73  | Box-1 taxable wages                          |
| +0x7b  | **federal income tax withheld**              |
| +0x83  | Social Security / Tier-1 tax withheld (6.2%) |
| +0x8b  | Medicare tax withheld (incl. 0.9% additional)|
| +0x93  | FICA wages (if different)                    |
| +0x9b  | Medicare wages (if different)                |

The parser still *detects* the W-2 screen by its FICA signature (a +0x83 value
equal to 6.2% of a base at +0x93/+0x9b, capped or uncapped) rather than
hard-coding 322, because other worksheets can accidentally trip the signature:
every candidate screen id is summed and the one whose Box-1 total matches grid
slot 0 wins. `wages` = grid slot 0, emitted only on that match;
`fedWithholding` = Σ +0x7b of the same records (W-2 withholding only — 1099
withholding is not decoded). +0x8b matching the Form-8959 worksheet's Medicare
figures, and +0x7b being populated for an employee in a no-income-tax state,
pin those two columns down.

### 7.2 Interest/dividend totals — screen 675

`+0x63` = taxable interest (grid slot 1), `+0x6b` = total ordinary dividends
(grid slot 3). Both must match the grid to the dollar before the app's
combined "interest + non-qualified dividends" field is emitted.

### 7.3 Tax computation (Schedule D worksheet) — screen 29

| offset | field                                                    |
|--------|----------------------------------------------------------|
| +0xab  | taxable income used for the rate math (can differ from    |
|        | slot 141 by separately-taxed items, e.g. 4972 lump sums) |
| +0x10b | **qualified dividends**                                  |
| +0x11b | **net long-term capital gain taxed at capital rates**    |
| +0x123 | preferential total (= 0x10b + 0x11b)                     |
| +0x163 | ordinary-rate portion (= 0xab − 0x123)                   |
| +0x293 | **regular income tax** (the worksheet's result)          |

Gate: both internal identities must hold to the dollar. The +0x293 figure was
verified against hand-computed bracket tax in three case-years. Note the LTCG
figure is what the plan *taxes* at capital rates — suspended passive capital
losses on the Schedule E side are not in it, so it can differ from the
Schedule D line (slot 7); the short-term slice (slot 7 − LTCG) lands in the
imported "other income" residual.

### 7.4 Partnership/S-corp ("K-1") worksheets — screen 566

One instance per passthrough activity; `+0xbb` = the activity's net income or
loss (worksheet line 6, "Partnership, S Corporation and Estate Income
Worksheet" — template screen 567 carries the labels). **Σ over instances equals
grid slot 210 to the dollar** in every case-year of both sample plans; that
equality is the gate for emitting `passthroughK1` (= slot 210). When they
differ, slot 210 contains rental/royalty or estate amounts the parser cannot
split, and nothing is emitted.

### 7.5 Self-employment worksheet — screen 44

`+0x193` = total self-employment (Schedule C) earnings; must equal grid slot 6
for `scheduleCNet` to be emitted. (The record also carries the SS wage base,
e.g. 176100 for 2025.)

### 7.6 Schedule A — screen 35 (~1.1 KB; ignore the larger same-id screens in other sections)

| offset | field                                            |
|--------|--------------------------------------------------|
| +0x63  | property-type (non-income) taxes                 |
| +0x7b  | state/local income taxes for Schedule A          |
| +0x93  | SALT actually deducted (after the cap)           |
| +0x9b  | home mortgage interest                           |
| +0xa3  | investment interest                              |
| +0xbb  | total interest deduction (= 0x9b + 0xa3)         |
| +0xd3  | charitable contributions (allowed, incl. c/o)    |
| +0x133 | itemized total                                   |
| +0x14b | standard deduction for comparison                |

Gate: `0x93 + 0xbb + 0xd3 == 0x133` to the dollar (a plan with medical or
other undecoded Schedule A lines fails the gate and the components are
omitted). `otherItemized` = total − SALT − mortgage − charitable (captures
investment interest etc.). The +0x7b figure equals entered state payments
(§7.7) plus the plan's own computed state+city accrual — verified to the
dollar.

### 7.7 Taxes-paid input — screen 20

`+0x7b` = state/local income taxes paid (imported as `stateWithholding`, with a
warning that the file does not distinguish withholding from estimates);
`+0x93` = home mortgage interest as entered. The record is only trusted when
its mortgage figure mirrors Schedule A's.

### 7.8 Filing status and dependents

Each case-year chunk stores a status caption such as `"MFJ, 3 Exempt"` as a
NUL-terminated ASCII run inside a record payload. The token before the comma
maps `MFJ/MFS/HOH/Single/QW → mfj/mfs/hoh/single/mfj`; the exemption count
minus the taxpayer/spouse count (2 for MFJ, else 1) is the dependent count,
imported as `otherDeps` (the file does not say which dependents are
CTC-qualifying children — warned).

## 8. What is NOT decoded (gaps, with reasons)

- **Per-slot captions for income slots 4, 5, 8, 9, 11–16, 18** (state refunds,
  alimony, farm, unemployment, retirement, Social Security…): both sample
  plans populate too few of them to pin captions to slots. Their sum is
  emitted as the `otherIncome` residual of the (validated) total-income
  identity — the total always ties; only the per-line naming is coarse. Slot
  10 (other gains) and the Schedule D short-term slice ride along in the same
  residual.
- **Rental net vs. passthrough split** when both are present: slot 210 is the
  whole Schedule E line; only the passthrough part is independently provable
  (§7.4). Plans with rentals fail that gate and get a warning instead of a
  guessed split.
- **Estimated-payment screens** (federal and state "APE" screens): present but
  empty in both samples, so their value offsets are unverified — `fedEstimates`
  / `stateEstimates` are never emitted.
- **1099 withholding** (interest/dividend/1099-R federal withholding): the
  sampler values in the reference plan made the candidate offsets ambiguous.
- **Dependent birth dates / CTC eligibility** — not located.
- **`entityW2Wages`** (§199A wage-limit wages on K-1s): the K-1 input screens
  (case screen 419) hold them but were empty in both samples.
- **SE tax / total-tax-after-credits reference rows**: the grid's tax-section
  slots (§6 slot 246+) demonstrably differ between the two producer versions,
  so only slot 281 (2025.02000, emitted when > 0) and the validated regular
  income tax (§7.3) are surfaced.

## 9. Retirement/SS note

A 1099-R totals worksheet (screen 674: per-distribution gross amounts and a
total at +0x163) and a Social-Security area exist, but in the reference plan
all retirement entries netted to zero taxable income, so no taxable-amount
offset could be validated. When a plan has taxable retirement income it will
appear (correctly, but unlabeled) in the `otherIncome` residual.

## 10. The `.log` member

Plain text audit log. Useful during analysis (it records the producer versions
that created/updated the file) but ignored by the parser.

## 11. Version notes — 2025.02000 vs. 2026.01000

Everything above is byte-identical across the two versions **except**:

- **Grid tax-section slots (≥ ~246)**: 2025.02000 wrote a net-tax figure at
  slot 281 and SE-tax-like figures near 246–259; the 2026.01000 sample writes
  0 at 281 and different content at 246–259. The parser suppresses slot 281
  when it is 0 against positive taxable income and never reads 246–259.
- **W-2 template labels** gained OBBBA fields ("Overtime Pay", "Cash Tips") in
  2026.01000; the case-record offsets (§7.1) did not move.
- The `FileInfo` layout, record framing, chunk/section structure, and every
  worksheet offset in §7 are unchanged. An upgraded file keeps its original
  content; "Updating file … to version 2026.01000" in the log is in-place.

The parser is layout-guarded at runtime everywhere: a future layout change
degrades to "field omitted + warning", never a wrong number.
