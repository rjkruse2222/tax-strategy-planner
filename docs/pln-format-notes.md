# CCH ProSystem fx Planning (`.pln`) format notes

Reverse-engineered from two real plans — one written by **2025.02000** and one
created in 2025.02000 and upgraded in place to **2026.01000** ("AccuPlnr") —
for the browser parser in `js/engine/pln-parser.js`. No client data appears
here — only structure, offsets, and encodings. The two versions turned out to
be **byte-compatible for everything the parser reads**; see §11 for the
version-specific caveats.

§12 covers **writing**: patching input cells in a copy of a plan. It was
verified on 2026.01000 only, and the repo has no writer.

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
  (case screen 419) hold them but were empty in both samples. See §12.4: a
  Qualified Wages input cell has since been located on the QBI input screen
  (984).
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

## 12. Writing a `.pln` (patching input cells in a copy)

Sections 1 to 11 are about reading. This section records what was proven on
2026-11-11 by patching a real plan written by **Planning 2026.01000** and
opening the result in the Planner. Nothing here has been tried on 2025.02000
or any other version. As above, no client data appears: structure, offsets
and encodings only.

This repo has **no writer**. `js/engine/pln-parser.js` only reads. The working
reference is two Python scripts (`plnlib.py`, `pln_patch.py`) kept with firm
working files outside the repo. A writer for this app is proposed, not built,
in `docs/pln-write-back-design.md`.

What is known to work is narrow: **changing the value of an input cell that
already exists in the plan.** Nothing else.

§12.8 to §12.10 were added on 2026-11-20 from a read-only survey of 29 real
plans written by eight producer versions (2022.02000 to 2026.02000). Those
sections say what the files show. They are marked where the Planner has not
yet confirmed a point.

### 12.1 Container fields a writer must reproduce

The reader takes sizes from the central directory and never looks at the
fields below, which is why §1 does not mention them. A writer has to get them
right.

| Member           | Method        | On a rewrite                               |
|------------------|---------------|--------------------------------------------|
| `FileInfo`       | 8 (DEFLATE)   | copied through, compressed bytes unchanged |
| `FileData`       | 9 (Deflate64) | re-encoded (§12.2)                         |
| `<ClientID>.log` | 9 (Deflate64) | copied through, compressed bytes unchanged |

`FileData` carries general-purpose flags **`0x000a`**: bit 3 (`0x0008`, a data
descriptor follows the member data) plus bit 1 (`0x0002`, one of the two
compression-option bits the ZIP specification defines for the deflate methods;
a hint about the compressor setting, not something a reader needs in order to
decode the data).

The Planner's use of bit 3 is unusual in one respect. The ZIP specification
has a writer zero the CRC-32 and both sizes in the local header when bit 3 is
set. The Planner writes the **real** CRC-32, compressed size and uncompressed
size in the local header **and** follows the data with a signed 16-byte data
descriptor:

```
"PK\x07\x08"   u32 crc32   u32 compressed size   u32 uncompressed size
```

A rewrite keeps method 9, the flags, the version fields, the DOS time and
date, the names, the extra fields, the attributes, the member order and the
archive comment exactly as found. It changes only what follows from the new
data:

- `FileData`'s compressed bytes;
- its CRC-32 and compressed size, in three places: local header, data
  descriptor, central-directory entry (the uncompressed size does not change
  when cells are patched in place);
- the local-header offset stored in the central directory for each member that
  sits after `FileData`;
- the central-directory offset in the end-of-central-directory record.

The layout is stable. All 29 surveyed plans, across all eight versions, have
the same three members in the same order, methods 8 / 9 / 9, flags `0x0002` /
`0x000a` / `0x0002`, a data descriptor on `FileData` only, real CRC-32 and
sizes in every local header, and no archive comment.

### 12.2 Producing a `FileData` stream the Planner accepts

The Planner reads `FileData` as Deflate64, and the reference keeps it labeled
method 9. zlib (and so Python's and Node's `zlib` modules) and the browser's
`CompressionStream` write classic DEFLATE only, and a classic stream cannot
simply be relabeled as method 9: the two formats give different meanings to
length code 285 and to distance codes 30 and 31 (§1). An ordinary compressor
uses length code 285 constantly on this kind of data, because it is the code
for a 258-byte match and long runs of zero bytes compress to exactly that.

What works is a raw deflate stream made of **literals only**. With no matches
there are no length or distance codes at all, so the three symbols the two
formats read differently never occur, and the stream is valid as both classic
DEFLATE and Deflate64. zlib produces this with the `Z_HUFFMAN_ONLY` strategy:

```
Python:  zlib.compressobj(9, zlib.DEFLATED, -15, 9, zlib.Z_HUFFMAN_ONLY)
```

(`-15` selects a raw stream with no zlib header or trailer.) The Planner
opened a plan whose `FileData` was re-encoded this way, with method 9, the
original header fields and the data descriptor kept as in §12.1.

Checked for this note on **synthetic data only**, not on the Planner:

- The parser's bundled inflater, in Deflate64 mode, reads a `Z_HUFFMAN_ONLY`
  stream back byte for byte. zlib emitted dynamic-Huffman blocks only for
  that stream (no stored blocks, no fixed-Huffman blocks).
- The same inflater, told the stream is Deflate64, fails on an ordinary zlib
  level-9 stream of the same data. That is the relabeling failure described
  above.
- A stream of stored blocks only also reads back in Deflate64 mode. Whether
  the Planner accepts a stored-only or fixed-Huffman-only stream has not been
  tried. Only `Z_HUFFMAN_ONLY` output has been opened there.

A literal-only stream is larger than the Planner's own, so a patched file is
bigger than its source (about three times the size on the two plans tried;
more than eleven times with stored blocks). That is expected.

**A literal-only stream is also a fingerprint.** Every Planner-written
`FileData` stream in the 29 surveyed plans contains match symbols (between
about 12,000 and 62,000 of them). A stream with none was not written by the
Planner, which means it is a raw patch whose computed values are stale
(§12.3).

### 12.3 The Planner recalculates on open

On every open the Planner recalculates the whole plan and re-runs AutoFlow.
Three things follow.

**Only input cells need patching.** Stored computed values (the summary grid
of §6, the worksheets of §7, the computed copies of an input inside its own
record) are replaced when the Planner opens the file, so a patch leaves them
alone.

**A raw patched file is stale inside.** Until the Planner has opened the file
and saved it again, every stored computed value still reflects the old inputs.
`pln-parser.js` reads stored computed values, so importing a raw patched file
returns the **old** totals. For the cells in §12.4 every tie-out check in the
parser still passes, because the parser never reads screens 559 or 984 and
the stale values it does read are consistent with each other. Open the
patched file in the Planner, check it, save it, and import or deliver the
saved copy, never the raw patch.

**Later year columns can follow earlier ones.** A year column that has no
entry of its own for an input takes the earlier column's value on load, even
though the file stores a value in that cell. A patch to one column therefore
also moves every later column that follows it, and a value patched into a
following column is not what the Planner will show. What marks a cell as
having its own entry is an "entered" bit, one per cell, described in §12.8.

### 12.4 Input cells identified

All are in section 0 (the federal plan) of a case-year chunk, and all are
float64 LE (§5). A record is addressed by
`(caseId, yearColumn, section, screen id, instance)` (§3.1 to §3.3); plan
case 1 is `caseId` 2. On both screens the doubles sit on the same 8-byte grid
as the summary screen: slot `k` at payload `+0x63 + 8*k`.

| Planner input                                                      | Screen | Instance        | Offset (slot) |
|--------------------------------------------------------------------|--------|-----------------|---------------|
| Passthrough K-1 activity: "Ordinary or Other Rental Income (Loss)" | 559    | activity number | +0x7b (3)     |
| Passthrough QBI item: "Ordinary Income or Loss"                    | 984    | QBI item number | +0xe3 (16)    |
| Passthrough QBI item: "Qualified Wages"                            | 984    | QBI item number | +0xa3 (8)     |
| Passthrough QBI item: "Qualified Property Basis"                   | 984    | QBI item number | +0xab (9)     |

The reference patch script writes the first two rows (one K-1 activity and one
QBI item, in one year column). The Planner showed the new values and
recalculated from them. The wages and basis cells were identified on the same
record.

Notes:

- **The K-1 activity and the QBI item are separate inputs.** The plan examined
  held different values in 559 +0x7b and 984 +0xe3, so the Planner does not
  force them equal. A change to passthrough income that should also move QBI
  has to be written to both. How a QBI item is tied to its activity in the
  file, if it is tied at all, has not been established.
- **Computed copies.** In the plan examined, the value entered at 559 +0x7b
  also appeared at nine other offsets of the same record and on the K-1
  worksheet, screen 566, at +0xb3 and +0xbb (§7.4). Those are computed; the
  patch leaves them alone (§12.3). Finding a value in a record does not make
  that offset the input cell.
- **The worksheet line is not always the input.** Across the surveyed plans
  the K-1 worksheet line (566 +0xbb) equals the activity's ordinary income
  (559 +0x7b, same instance) in 158 of 227 activity and worksheet pairs. In
  the rest the worksheet line also reflects the activity's other K-1 items or
  a limitation.
- **Screens 914 and 915** (instances 4465 and up, and 10001) are computed QBI
  worksheets, not inputs.
- §8 says the K-1 input screens (case screen 419) hold the §199A wages but
  were empty in both samples. That was never verified. The Qualified Wages
  cell above is on the QBI input screen, 984.

### 12.5 What cannot be done by file

**Adding a case or an activity.** Records are full of 32-bit heap pointers
from the original serialization, beyond the one at +0x18 (§3.1): for example
at +0x5b, and inside value slots that are otherwise empty. Cloning a case
chunk, or building a new activity record from an existing one, would copy
pointers whose meaning is unknown, so it is not safe. Cases and activities
have to be added in the Planner. The same caution applies to adding a year
column, which is also a whole chunk (§3.2); that was not tried.

### 12.6 Planner behavior that decides how scenarios are laid out

This is program behavior rather than file format, but it decides what a writer
should target. In the Planner, **Edit > Copy Case/Column** produces a case
whose later-year values are overwritten by Year 1 inputs on the next open, or
on Add Item. It was tested three ways (case copy, column copy, copy with
AutoFlow off) with the same result. The durable pattern is **one scenario per
plan file**.

The cause is in the file: the copy carries the values but not the entered
bits of §12.8, so on the next open every later-year cell of the copied case
counts as following Year 1. Restoring the bits by file, right after the copy
and before the plan is reopened, makes the copied case hold. That was proven
on 2026-11-11 with a third reference script (`pln_mark_entered.py`): the
result held through a Planner save and a reopen.

### 12.7 Patch procedure (what the reference does)

1. Read the source and never modify it. Refuse to write over an existing
   destination file.
2. Inflate `FileData` as Deflate64 and check its length and CRC-32 against
   the headers.
3. Walk the records (§3). For each patch, find the `0x0e` record matching
   `(caseId, yearColumn, section, screen id, instance)`. Anything other than
   exactly one match stops the run.
4. Read the float64 at the payload offset and compare it with the value
   expected to be there now. Any mismatch stops the run before anything is
   written.
5. Overwrite those 8 bytes with the new value.
6. Re-encode `FileData` literal-only (§12.2), recompute the CRC-32 and sizes,
   and rewrite the archive (§12.1).
7. Read the new file back from disk and prove what changed: same member list;
   `FileInfo` and the log identical, compressed bytes included; `FileData`
   the same length; every differing byte inside a patched 8-byte cell; the
   record walk still ending exactly at end of file.
8. Open the new file in the Planner, confirm the input screens and the
   recalculated totals, and save. Use the saved copy from then on (§12.3).

### 12.8 Cell arrays and the entered bits

A case record (`0x0e`, `caseId` >= 2) holds one array of cells and, after it,
one attribute byte per cell. This layout decodes 20,836 of the 20,908 case
records in the 29 surveyed plans (99.7%), in every section and every version.

```
+0x4a  u16   number of cells entered in this column (attribute bit 0)
+0x4e  u16   a related count (see below; not relied on)
+0x50  u16   number of cells with attribute bit 6
+0x53  u32   length of the payload from +0x5b on (payload size = this + 0x5b)
+0x5b  u32   heap pointer, then u32 0
+0x63  N cells, 8 bytes each: a float64, or for a text cell a 4-byte heap
       pointer followed by 4 zero bytes
q      = 0x63 + 8*N:  u32 (the same pointer value as at +0x5b), u16 0, u16 M
q+8    M format entries, 8 bytes each: COLORREF (R, G, B, 0), u16 0, u16 flags
       (M is 0 on many screens)
then   1 byte (0)
then   N attribute bytes, one per cell, in cell order
then   text buffers: [len u8][00][00][text]
```

So cell `k` has its value at `+0x63 + 8*k` and its attribute byte at
`q + 8 + 8*M + 1 + k`. N is not stored in the header. A reader finds `q` by
walking the cell array in 8-byte steps until it meets the pointer value from
+0x5b again, then checks that the N bytes at the computed position are all
attribute values.

**Attribute byte.** Only eight values occur: `0x00`, `0x01`, `0x02`, `0x03`,
`0x40`, `0x41`, `0x42`, `0x43`.

| bit          | meaning                                                          |
|--------------|------------------------------------------------------------------|
| 0 (`0x01`)   | **entered in this column**. Counted at +0x4a.                    |
| 1 (`0x02`)   | set on most cells that hold a value, entered or computed. Exact rule not established. |
| 6 (`0x40`)   | set on cells that take part in the flow between year columns, in first and later columns alike. Counted at +0x50. Exact rule not established. |

A cell that follows an earlier column reads `0x42` or `0x40`. The same cell
entered in its own column reads `0x43` or `0x41`. An entered cell with bit 6
clear reads `0x01` or `0x03`. The pairs seen between an entered cell and the
same cell not entered are `0x43`/`0x42`, `0x41`/`0x40`, `0x03`/`0x42`,
`0x01`/`0x40` and `0x01`/`0x00`.

Checked against the headers of the decoded records: +0x4a equals the number
of attribute bytes with bit 0 in 99.1% of them, and +0x50 equals the number
with bit 6 in 96.9%. +0x4e equals the number with bit 1 in only 79%, so its
meaning is not pinned down. The length at +0x53 holds in all but 95 of the
20,908 records.

**Marking a cell as entered by file.** Set bit 0 of the cell's attribute byte
and add one to the count at +0x4a. This was proven on 2026-11-11 on the
copied-case problem of §12.6. It has **not** yet been tested for the plain
case of writing a new value into a later-year cell that currently follows.

**Cell counts change between versions.** N (and M) for a screen are the same
in every plan of one version but grow when a release adds rows:

| Screen                 | N / M by producer version                                       |
|------------------------|-----------------------------------------------------------------|
| 3 (summary grid)       | 292 / 0 in all eight versions                                   |
| 20 (taxes paid)        | 61 / 79 (2022.02000); 63 / 82 (2023 to 2025); 64 / 83 (2026.x)  |
| 29 (tax computation)   | 100 / 0 in all                                                  |
| 35 (Schedule A)        | 107 / 0 through 2025.02000; 111 / 0 (2026.01000); 114 / 0 (2026.02000) |
| 322 (W-2)              | 42 / 45 through 2025.02000; 44 / 47 (2026.x)                    |
| 559 (K-1 activity)     | 249 / 0 (2022.02000); 250 / 0 after                             |
| 566 (K-1 worksheet)    | 31 / 31 in all                                                  |
| 984 (QBI item)         | 45 / 45 in the four versions that have it                       |

The attribute bytes therefore sit at different payload offsets in different
versions, and a cell index is only good for the versions it was checked on.

### 12.9 Candidate input cells from a census of entered bits

**None of the cells in this section has been write-tested in the Planner.**
They are candidates, found from the files alone.

Method: over the 95 case-year chunks of the 29 plans, take every cell that
carries the entered bit in at least one record, sum it over the instances of
its screen in a chunk, and count the chunks where that sum equals a computed
line (a summary-grid slot of §6 or a worksheet line of §7) to the dollar.

| Computed line                              | Candidate input cell          | Chunks matched | Records with the entered bit |
|--------------------------------------------|-------------------------------|----------------|------------------------------|
| Wages (grid slot 0)                        | screen 322, cell 2 (+0x73)    | 78 of 85       | 74                           |
| Taxable interest (grid slot 1)             | screen 342, cell 28 (+0x143)  | 62 of 83       | 85                           |
| Ordinary dividends (grid slot 3)           | screen 439, cell 0 (+0x63)    | 56 of 60       | 28                           |
| Qualified dividends (screen 29 +0x10b)     | screen 439, cell 32 (+0x163)  | 61 of 61       | 28                           |
| Schedule A charitable (screen 35 +0xd3)    | screen 422, cell 6 (+0x93)    | 58 of 60       | 91                           |
| Schedule A mortgage interest (35 +0x9b)    | screen 20, cell 6 (+0x93)     | 68 of 68       | 18                           |
| Schedule A property taxes (35 +0x63)       | screen 20, cell 2 (+0x73)     | 25 of 26       | 6                            |

Screen 322 is the W-2 activity (§7.1) and screen 20 the taxes-paid input
(§7.7); the census agrees with what those sections already read. Screens 342,
439 and 422 are the interest, dividend and contribution activities: their row
labels sit on template screens 343, 440 and 423.

Lines with **no** single entered cell behind them:

- **Schedule C net profit** (grid slot 6). The business activity is screen
  557. Its net is computed (cell 13 equals the grid line in 59 of 59 chunks)
  from several entered rows; cell 6 (+0x93) is the row entered most often.
- **Capital gain** (grid slot 7). Capital transactions are one record each on
  screen 331 (labels on template 332: sales price, basis, dates), so there is
  no net-gain input.
- **Adjustments to income** (grid slot 34), **other income** (slot 17), and
  the rental part of the Schedule E line. Nothing found.

### 12.10 Where activity names are stored

Activity names are in the template chunk (`caseId` 1), not in the case
records. Each activity type has a list screen there with one instance per
activity, and the name appears as text of the form
`<caption> - (<n>. <name>)`, with the name left empty when the activity was
never named.

| Activity (case screen)        | Template list screen | Caption                  | Plans where the instance counts agree |
|-------------------------------|----------------------|--------------------------|---------------------------------------|
| W-2 (322)                     | 457                  | Wage Information         | 10 of 10                              |
| Interest (342)                | 494                  | Interest Income          | 20 of 20                              |
| Dividends (439)               | 495                  | Dividend Income          | 8 of 8                                |
| Contributions (422)           | 503                  | Contribution Information | 15 of 15                              |
| Capital transactions (331)    | 471                  | Capital Transactions     | 15 of 15                              |
| Schedule C business (557)     | 459                  | Business Information     | 3 of 3                                |
| Passthrough K-1 (559)         | 467                  | K1 Information           | 19 of 19                              |
| QBI item (984)                | 987                  | K1 Information           | 9 of 9                                |

(Counted only on plans with two or more activities of the type, where a
match is informative.) Row labels for a screen are on a separate template
screen, usually the case screen id plus one (§3.2), but they are stored in
display order, which is not cell order, so a label cannot be tied to a cell
from the template alone.
