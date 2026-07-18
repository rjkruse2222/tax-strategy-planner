# CCH ProSystem fx Planning (`.pln`) format notes

Reverse-engineered from a single **2025.02000** ("AccuPlnr") plan for the
browser parser in `js/engine/pln-parser.js`. No client data appears here — only
structure, offsets, and encodings. Treat everything below as version-specific
until confirmed against another producer version.

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

Parse the text block by splitting on `\r\n`, then per line take the label before
the first `:` and the value after the first tab (trim tabs/spaces). The label
set is fixed; `Plan Name` / `Plan Description` are often blank.

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
| 0x08 | chunk sub-header (holds constants `5,6`)                         |
| 0x0a | chunk sub-header (holds constants `758,1001`)                    |
| 0x0c | screen/section header, 58-byte payload (form id + UI geometry)  |
| 0x0e | **screen data / labels** — the payload that matters             |

### 3.1 `0x0e` payload header

```
+0x18  u32   heap pointer from the original C++ serialization (ignore)
+0x20  u8    caseGroup   (0x01 = shared template, 0x02 = a case)
+0x21  u8    caseNum     (1-based case number when caseGroup == 2)
+0x22  01 00
+0x24  u16   screen id   (stable screen/form type within a chunk)
+0x26  u16   instance    (1-based; e.g. W-2 #1, #2, …)
```

### 3.2 Chunking (cases)

Records are partitioned by `(caseGroup, caseNum)`:

- `(01,01)` — **template**: screen labels, activity names, plan config. No values.
- `(02, N)` — **case N**: the numeric values + computed rows for one scenario.

A plan with 3 scenarios has one template chunk and three case chunks. Each case
chunk repeats the same screen set; only the values differ. (Screen ids are **not
identical** between the template and the case chunks — e.g. the W-2 screen is one
id in the template and a different id in the cases — so do not join template
labels to case values by id. The parser reads what it needs positionally.)

## 4. Numeric encoding

All amounts are **IEEE-754 float64, little-endian**. There is no currency
scaling; dollars are stored as their literal double value. (Confirmed on W-2
records where the withheld amounts equal 6.2% / 1.45% of the wage base exactly,
and SS tax caps at 6.2% of the annual wage base.)

## 5. The summary grid (tie-out anchor)

Each **case chunk** contains one **screen id `3`** record (~3126 bytes) that is
the plan's computed 1040 waterfall. Its doubles begin at payload **+0x63**,
indexed `slot k → payload + 0x63 + 8*k`. Validated slots (stable across all
cases in the reference plan):

| slot | meaning                                    |
|------|--------------------------------------------|
| 0    | wages (income line 1)                      |
| 19   | total income                               |
| 23   | adjustments to income                      |
| 29   | adjusted gross income (AGI)                |
| 108  | taxable income before QBI                  |
| 140  | deduction (standard or itemized)           |
| 141  | taxable income (final)                      |
| 143  | qualified business income deduction        |
| 195  | ordinary-rate income portion of AGI        |
| 210  | preferential income (net LTCG + qual. div.)|
| 281  | total tax                                  |

**Self-consistency (used to validate the decode before trusting it):**

```
AGI            = total income − adjustments          (slot 29 = 19 − 23)
taxable income = AGI − deduction − QBI deduction     (slot 141 = 29 − 140 − 143)
AGI            = ordinary income + preferential income (slot 29 = 195 + 210)
```

The parser reads the slots, checks the first two identities to the dollar, and
**drops the case's reference figures (with a warning) if they do not reconcile**
— never emitting a number it can't tie out.

## 6. Wages

`wages` = summary slot 0. Because slot 0 is not covered by the AGI arithmetic,
the parser independently sums W-2 Box-1 across the case chunk and only emits
`wages` when the two agree (≤ 2%):

- Find the **W-2 screen id**: the screen id shared by records whose `+0x83`
  value equals 6.2% of a wage base at `+0x93`/`+0x9b` (capped or uncapped) —
  the FICA signature.
- Sum **Box-1 (`+0x73`)** across every record of that screen id.

W-2 record layout (screen data, offsets within payload):

| offset | field                                      |
|--------|--------------------------------------------|
| +0x73  | Box-1 taxable wages                         |
| +0x83  | Social Security / Tier-1 tax withheld (6.2%)|
| +0x8b  | Medicare tax withheld (~1.45%)              |
| +0x93  | FICA wages (if different)                    |
| +0x9b  | Medicare wages (if different)               |

Other per-field W-2 slots exist but are laid out irregularly (not a clean
label-parallel array), so only Box-1 is decoded.

## 7. Filing status

Each case chunk stores a status caption such as `"MFJ, 2 Exempt"` /
`"Single, 1 Exempt"` as a NUL-terminated ASCII run inside a record payload. The
parser scans for a token immediately followed by `Exempt` and maps
`MFJ/MFS/HOH/Single/QW` → `mfj/mfs/hoh/single/mfj`.

## 8. Tax year

Detected as the mode of plausible year `u32` values (2018–2035) across
`FileData`; requires ≥ 4 occurrences to avoid stray ints. Applied as the year
label on each case's single decoded column.

## 9. What is NOT decoded (gaps)

- **Per-source income line items** beyond wages — interest, dividends, Schedule
  C, K-1 / passthrough, Schedule E rentals, capital gains. The activity records
  exist per case (screen ids for W-2, interest, dividends, Sch C, K-1, etc.) but
  their internal value layouts vary by screen and were not decoded to a
  reliable, tie-out-checkable field. The summary grid gives the aggregates
  instead.
- **LTCG vs. qualified dividends split** — stored combined (slot 210). Only the
  combined preferential-income figure is recoverable; the parser emits neither
  `ltcg` nor `qualDiv` and warns.
- **Itemized-deduction components, dependents, withholding/estimates** — not
  decoded.
- **SE tax and state tax** references — not located (the reference plan is a
  no-income-tax state, so state tax is absent there).
- **Multi-year projection columns** — the reference plan is single-year per
  case. If a plan uses multiple projection years per case, only the primary
  computed column is currently read; this needs a multi-year sample to confirm.

## 10. Version caveats

- All offsets/slot indices are from **2025.02000**. The record framing, the
  float64 encoding, the `(caseGroup, caseNum)` tagging, and the ZIP/Deflate64
  container are likely stable across nearby versions; the **summary-grid slot
  indices** and the **W-2 field offsets** are the most likely to shift and are
  guarded at runtime by the tie-out check (grid) and the FICA cross-check
  (wages), so a layout change degrades to "omitted + warning" rather than a
  wrong number.
