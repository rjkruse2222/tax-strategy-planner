# `.pln` write-back: design proposal

**Status: proposal. Nothing in this document is built, and nothing gets built
without the owner's go-ahead.** Written 2026-11-11. It rests on the facts in
`docs/pln-format-notes.md` §12 (writing a `.pln`), which were proven on one
real plan with Planning 2026.01000. No client data appears here.

## 1. What it would do

Today the loop is: import a `.pln`, model strategies, print the CCH Planner
Tie-Back Sheet, then key each scenario's values into the Planner by hand.
Write-back would do part of that keying: take the Tie-Back values and produce
a **patched copy** of the imported `.pln`, one file per scenario, for the
advisor to open in the Planner. The Planner recalculates on open, so the
advisor still opens, checks and saves each file there. The source plan is
never modified.

## 2. The case against building it now

This comes first because it is the stronger side of the argument today.

- **Coverage is one row out of fifteen.** The Tie-Back Sheet has 15 input
  rows. Exactly one has a write-proven Planner input cell (S-corp /
  partnership ordinary income, with its QBI twin). One more has a located but
  unwritten cell (entity W-2 wages). The other 13 (both wage rows, Schedule C,
  rental, capital gain, dividends, interest, other income, adjustments, the
  four itemized rows) have no known input cell.
- **Most strategies move more than one row.** A scenario that changes wages,
  adjustments or deductions along with passthrough income would come out half
  written. A half-written plan is worse than an unwritten one if anyone
  mistakes it for finished.
- **Later years are governed by AutoFlow, not by the file** (notes §12.3). A
  value patched into a year column that follows an earlier column is not what
  the Planner shows, and the file marker for "this cell has its own entry" is
  unknown.
- **The Planner step stays manual.** Open, check, save. Write-back removes
  typing, not review.
- **The format is reverse-engineered from one release.** Every new Planning
  version has to be re-verified before the writer may touch a file from it.
- **Time saved at today's coverage is small**: one or two cells per scenario.

So the feature is worth building only if most Tie-Back rows can be mapped to
input cells first. That is a research task in the Planner, not a coding task.
**Recommendation: approve Phase 0 (§7) only, and decide the build on what it
finds.** Confidence that the file mechanics work: high (proven once on the
Planner). Confidence that enough cells can be mapped: unknown until tried.

## 3. Facts the design rests on

From notes §12:

1. Only an **existing input cell** can be changed by file. Cases, year columns
   and activities cannot be added.
2. `FileData` must be re-encoded as a literal-only deflate stream, labeled
   method 9, with the Planner's header layout and data descriptor kept.
3. The Planner recalculates and re-runs AutoFlow on open. Stored computed
   values in a raw patched file are stale, and this app's importer reads
   stored computed values.
4. A later year column with no entry of its own follows the earlier column.
5. Copy Case in the Planner is not durable. One scenario per plan file.
6. The K-1 activity income and the QBI item income are separate inputs.

From this app:

7. The Tie-Back Sheet holds one number per row per year. The plan holds one
   number per activity (or per W-2, per QBI item).
8. The app's projection always starts at the tax year of
   `TSIQ.TABLES_2026`, whichever plan column was imported, and grows later
   years by the growth rate. Plan year columns carry their own tax years.
9. The app does not remember which file, case or year column an import came
   from. After Apply only the form values remain.

## 4. What can be written today

| Tie-Back row                          | Planner input cell (notes §12.4)           | Status                                    |
|---------------------------------------|--------------------------------------------|-------------------------------------------|
| S-corp / partnership ordinary income  | screen 559 +0x7b, per activity             | written and confirmed in the Planner      |
| (its QBI side; no Tie-Back row)       | screen 984 +0xe3, per QBI item             | written and confirmed in the Planner      |
| Entity W-2 wages (§199A wage limit)   | screen 984 +0xa3, per QBI item             | located, not write-tested                 |
| All other rows                        | not located                                | keyed by hand                             |

Qualified Property Basis (984 +0xab) is located but the app does not model
the UBIA prong, so nothing would ever be written there.

## 5. Approaches considered

**A. Writer inside the app (recommended if Phase 0 passes).** A new ES5
module does the patch in the browser and downloads the new file. Fits the
product: no install, runs off `file://`, the plan never leaves the machine.
Cost: zlib is not available in a browser and `CompressionStream` emits
matches, so the module needs its own literal-only encoder and CRC-32, plus a
preview screen.

**B. Node script plus a manifest.** The app exports the intended cell values
as JSON and `node scripts/...` applies them with Node's zlib
(`Z_HUFFMAN_ONLY`, the same zlib call already proven from Python). Least new
code and a proven encoder. Rejected for general use: it needs Node and a
terminal on the advisor's machine, adds a file hop, and the choices a person
has to make (which activity, which column) still need a screen or become
hand-edited JSON.

**C. No writer.** Keep keying by hand. Correct the Tie-Back guidance (§9) and
keep the Python scripts for one-off patches. No format risk, almost no work,
no automation. This is where things stand if Phase 0 does not pass.

## 6. Proposed design (approach A)

### 6.1 Flow

1. The advisor imports a Planner-saved `.pln`, applies it, picks strategies
   and runs the comparison, as today.
2. The advisor clicks **Write Tie-Back to .pln** and picks the source `.pln`
   again (the app keeps no copy, fact 9).
3. The app asks three things, each with a default only when there is exactly
   one candidate:
   - which plan **case** to patch;
   - which plan **year column** receives the Tie-Back's first year (default:
     the column whose tax year equals the app's tax year; none if no column
     matches);
   - which **passthrough activity** and which **QBI item** carry the change,
     shown by number and current value.
4. The app shows a **preview** for the baseline and each scenario: every cell
   it would change (old value, new value) and every Tie-Back row it will not
   write, with the values to key. Nothing is written yet.
5. On confirm, the app downloads one patched file per section that has at
   least one cell to change (normally the scenarios, not the baseline), and
   shows a printable write-back report.
6. The advisor opens each file in the Planner, keys the rows the report lists,
   checks the result and saves.
7. **Re-check.** The advisor runs step 2 again on the saved copy. The preview
   must now show nothing left to change in the written rows. Anything still
   showing a difference did not hold (AutoFlow, or a loss limitation in the
   Planner) and is keyed by hand. Write-back is not finished until this
   passes.

### 6.2 Components

| Piece | Responsibility |
|-------|----------------|
| `js/engine/pln-parser.js` (small additive change) | Expose the existing inflater, ZIP reader, record walk and chunk grouping on one internal object so the writer does not duplicate them. Count match symbols while inflating, for the guard in §6.6. No change to what the importer returns for a Planner-saved file. |
| `js/engine/pln-writer.js` (new) | Pure functions over byte arrays, no DOM. (1) Read the container with every header field. (2) List the writable cells of a case and year column. (3) Build a patch list from Tie-Back values and the advisor's choices. (4) Apply the patches and rebuild the archive. (5) Prove the result. Also holds the cell map, keyed by producer version, and the literal-only encoder and CRC-32. |
| `js/app.js`, `index.html` | The button, the dialog of §6.1 steps 2 to 5, the downloads. |
| `js/renderers/cch-tieback.js` | Export the row table so the writer and the sheet use one list of rows. |
| `scripts/test-pln-writer.js` (new) | Node tests on synthetic fixtures (§8). |

The writer addresses a record by its instance field, not by position in the
file. (The parser's `screens()` helper sorts on a property its elements do
not carry, so its order is simply file order. That is harmless for the
importer and is not something to rely on here.)

### 6.3 What value gets written

For one section (baseline or a scenario) and the chosen year column:

```
target = Tie-Back "S-corp / partnership ordinary income" for the first year
now    = sum of the plan's K-1 worksheets for that column (screen 566 +0xbb,
         the same sum the importer checks before trusting the passthrough line)
change = target - now

activity cell (559 +0x7b, chosen activity):  new = old + change
QBI cell      (984 +0xe3, chosen QBI item):  new = old + change
```

Values are rounded to whole dollars. A change under 50 cents writes nothing.

Why the whole change goes to one chosen activity: the app has one passthrough
number and the plan has one per activity, so someone has to say where a
change belongs. A person keying the sheet makes the same choice. Spreading it
pro rata would quietly alter activities the strategy never touched.

Why the QBI cell moves by the same amount rather than being set equal: the
two inputs are separate and may differ on purpose. The preview flags a plan
whose two values differ so the advisor can decide.

This rule assumes a dollar of activity income reaches the K-1 worksheet as a
dollar. That fails when a passive, basis or at-risk limitation binds. The
re-check in step 7 is what catches it.

The entity W-2 wages row follows the same pattern on 984 +0xa3, but only
after that cell passes a write test (§7, item 3).

**Later years are not written in the first version.** The file cannot say
whether a later column has its own entry (fact 4), and reporting a cell as
written when the Planner may discard it is exactly the kind of wrong number
this project avoids. Later-year Tie-Back values are listed in the report as
values to key. If Phase 0 finds the own-entry marker, later columns that have
their own entry can be written as well.

### 6.4 Gates

The writer refuses to produce a file, with a plain message, when any of
these is true:

- The producer version in `FileInfo` is not on the verified list (today
  exactly `2026.01000`).
- The container is not as notes §12.1 describes: three members, methods
  8 / 9 / 9, `FileData` flags `0x000a`, local header and data descriptor
  agreeing with the central directory, CRC-32 and length correct on every
  member.
- The source is itself a raw patch that the Planner has not re-saved (§6.6).
  Its stored totals are stale, so `now` in §6.3 would be wrong.
- The record walk does not end exactly at end of file.
- A target record is not found exactly once, is too short for the offset, or
  holds a value that is not a finite number.
- The chosen column's summary grid fails the importer's own tie-out checks.
- A cell is not in the verified map for that version. There is no override.
- The post-write proof fails: every member must still pass CRC-32 and length,
  `FileInfo` and the log must be byte-identical, `FileData` must be the same
  length with every changed byte inside a patched 8-byte cell, and the record
  walk must still end at end of file.

The writer never writes to a computed cell, never adds or removes a record,
and never touches the source file.

### 6.5 Output and report

File name: `<source name> - <section label> (patched, not recalculated).pln`,
with `PARTIAL` added when the report lists rows still to key. The name is
meant to make a raw patch hard to mistake for a finished plan.

The report (same style as the Tie-Back Sheet, internal only) lists, per file:
the source file and case, each cell written with old and new value, each row
**not** written with the values to key, the existing Tie-Back notes on PTET,
entity-level tax and payroll tax, and the remaining steps 6 and 7.

### 6.6 Import guard for raw patched files

Today the importer would read a raw patched file and return stale totals
without complaint (fact 3). Proposed guard: a `FileData` stream that inflates
with **zero match symbols** was not written by the Planner. On such a file the
importer returns no case data and says: open this file in CCH Planning, save
it, and import the saved copy.

This costs one counter in the existing inflater and puts no marker in the
file. It also catches files patched with the Python scripts. It depends on
Planner-written streams always containing matches, which is expected for a
real compressor on this data but has to be confirmed on real plans before it
ships (§7, item 2).

### 6.7 Encoder

zlib's `Z_HUFFMAN_ONLY` output is what the Planner has opened, and on test
data that output is dynamic-Huffman blocks only. Two ways to produce a
literal-only stream in plain ES5:

- **Stored blocks only** (preferred): about fifteen lines and nothing subtle
  to get wrong. Valid in both formats on paper and readable by this repo's
  inflater in Deflate64 mode, but not yet opened by the Planner.
- **Dynamic-Huffman, literals only** (fallback): about 150 lines, the block
  type already proven.

One Planner test (§7, item 1) picks between them.

## 7. Phases

**Phase 0: research in the Planner. No code in this repo; results go into
notes §12.** Work is done on scratch copies of a plan, in a separate Planner
instance.

1. Does the Planner open a `FileData` re-encoded as stored blocks only?
2. Do Planner-written `FileData` streams always contain match symbols? Count
   them on several real plans (a script, no Planner needed).
3. Write-test Qualified Wages (984 +0xa3).
4. Find the own-entry marker: type a value into a later-year cell that
   currently follows, save as a new file, diff the two files record by record
   (ignoring heap pointers), then test whether setting the marker by file
   holds on open.
5. Find where activity and QBI item names are stored, so the dialog can show
   names instead of numbers.
6. Map more input cells, most useful first: W-2 taxable wages (screen 322
   +0x73 is the candidate, notes §7.1), adjustments to income, Schedule C net
   profit, the itemized rows, rental net, capital gain, qualified dividends,
   interest, other income. Method for each: change one input in the Planner,
   save as a new file, diff; then patch only the candidate cell in the
   original and open it. A cell enters the map only after that write test.
7. Repeat one write test on a second plan, to show the offsets are not
   particular to one file.
8. Confirm the dollar-for-dollar assumption of §6.3 on a nonpassive activity.

**Go or no-go after Phase 0.** Build if the two wage rows and adjustments to
income are write-proven, so that the common owner-compensation and retirement
strategies produce complete files. Otherwise stay with approach C.

**Phase 1: writer core, import guard, tests.** No screen yet. Rough size:
500 lines of JS and 250 of tests (moderate confidence).

**Phase 2: the dialog, preview, downloads and report.** Rough size: 200 lines.

**Phase 3: extend the cell map** as further cells pass a write test. One table
row and one fixture each.

## 8. Testing

- **No real plan goes in the repo.** Tests build a synthetic `.pln` in memory:
  a minimal record stream (template chunk, one case with two year columns,
  screens 207, 3, 559, 566 and 984) zipped with the Planner's header layout.
- Tests cover: container round trip (headers preserved, three places updated),
  encoder output read back by the repo's inflater in Deflate64 mode, CRC-32
  against known vectors, every gate in §6.4 with a fixture that trips it, the
  post-write proof, the value rule of §6.3, and the import guard.
- Synthetic tests prove the writer's logic. They cannot prove the Planner
  accepts a file. That stays a manual check with a real plan outside the repo
  before each release and after each Planning update. An optional local run
  can point the test script at a real plan through an environment variable,
  writing output to a temp folder.
- `scripts/e2e-smoke.js` gains one step: the button opens the dialog.

## 9. Existing guidance this changes (not changed in this branch)

Two things learned on 2026-11-11 bear on text already in the app. Both are
proposed wording changes for the owner to approve separately.

1. **QBI on the Tie-Back Sheet.** The sheet says not to key the QBI reduction
   because CCH computes §199A itself. On the plan examined, the QBI item's
   "Ordinary Income or Loss" was its own input and did not equal the K-1
   activity's income. If that holds generally, an advisor who keys new
   passthrough income and leaves the QBI item alone gets a stale QBI
   deduction in the Planner. The passthrough row should say to update the QBI
   item as well. Confidence: moderate (one plan; whether the Planner can be
   set to derive it is unknown).
2. **"Baseline to Case 1, Scenario 2 to Case 2."** The README and the sheet's
   case tags point advisors at multiple cases in one plan. The natural way to
   make Case 2 is Copy Case, which is not durable (notes §12.6). The guidance
   should be one plan file per scenario.

## 10. Decisions for the owner

Each has a recommended default. A plain go-ahead accepts all of them.

1. **Run Phase 0?** Recommended: yes. It needs the Planner and a scratch copy
   of a plan, and changes nothing in this repo except notes §12.
2. **Build gate.** Recommended: build approach A only if Phase 0 proves the
   wage rows and adjustments to income.
3. **Where a passthrough change lands.** Recommended: the activity the
   advisor picks, never pro rata.
4. **Years.** Recommended: first version writes one year column and lists
   later years to key.
5. **The two wording fixes in §9.** Recommended: make them now, as their own
   small change, whatever happens to the writer.
