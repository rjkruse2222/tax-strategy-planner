# Tax Strategy Planner — project context

Client-side tax planning tool (plain ES5, no build step, no dependencies, runs
off `file://`). Reconstructed context file — the original was lost when the
project was uploaded to GitHub.

## Architecture rules

- **All tax constants live in `js/data/tax-tables-2026.js`.** The engine and
  strategies read only from `TSIQ.TABLES_2026`. Never hardcode a rate, limit,
  or threshold anywhere else (statutory fixed amounts with a citation in an
  adjacent note are the only exception).
- `js/engine/tax-engine.js` computes one year from a profile; no
  strategy-specific logic in the engine. `js/engine/scenario-engine.js`
  composes strategies in `applyOrder` over the projection.
- Strategies self-register by pushing onto `TSIQ.strategyModules` from files in
  `js/data/strategies/`. Follow `docs/strategy-authoring-spec.md` exactly —
  including the profile-field table (`adjustments`, `qbiReduction`,
  `otherCredits`, `otherTaxes`, `corpTaxPaid`, `ptetPaid`, `stateAddback`).
- `apply()` must copy the profile (`Object.assign({}, profile)`), never mutate.
  Multi-year memory goes in the shared `state` object with namespaced keys.
- After adding or renaming a strategy file run
  `node scripts/build-index.js` then `node scripts/validate-strategies.js`,
  and fix anything the validator reports before committing.

## Accuracy first

- Never show acceleration/deferral as permanent savings — model the later-year
  give-back (see cost-segregation.js's suspended-loss pattern).
- Real costs a strategy creates (payroll taxes on new wages, entity-level
  taxes) must appear in the burden via `otherTaxes`/`corpTaxPaid`/`ptetPaid`,
  not just in notes.
- Every authority citation must be real and correctly characterized. No
  invented cases, rulings, or section numbers.
- 2026 figures come from Rev. Proc. 2025-32, Notice 2025-67, Rev. Proc.
  2025-19, and OBBBA (P.L. 119-21). When updating for 2027, update the tables
  file AND sweep strategy prose for hardcoded dollar figures.

## Scope — not modeled (v1)

- AMT (exemption amounts are in the tables for future use; engine ignores them)
- Depreciation recapture on sale; §461(l) excess business loss limitation
- Refundable ACTC portion of the child tax credit
- State tax beyond a flat effective rate (no brackets, no state conformity
  differences); PTET modeled with a state-base addback
- Excess Social Security withholding coordination across employers
- Social Security benefit taxability phase-ins (mapped to Other Income)
- Inflation indexing in projection years 2+ (2026 tables reused)
- §199A UBIA prong (W-2 wage limit only)

Disclose these when relevant rather than silently pretending they're handled.

## Known caveats for advisors

- Mutually exclusive strategy combinations are enforced via `conflictsWith`
  declarations (see the authoring spec) — the UI disables conflicting
  checkboxes and Run Comparison blocks conflicting pairs. Conflicts cover
  double-counting and legal incompatibility, not every unwise pairing — read
  the planning notes.
- `ownerWages` (existing S-corp owner salary) is a Section 1 input; include
  it in the entity W-2 wages field too for the §199A wage limit.
- CCH round-trip: `.pln` import reads a ProSystem fx Planning file
  (js/engine/pln-parser.js, format notes in docs/pln-format-notes.md); the
  CCH Tie-Back Sheet (js/renderers/cch-tieback.js) maps post-strategy
  profiles back to Planning input rows for verification there.
