# General Pitfalls

Cross-cutting gotchas that aren't tied to a specific API or config option. Authoritative docs:
- Known limitations: https://hyperformula.handsontable.com/docs/guide/known-limitations.html
- Built-in functions (full list): https://hyperformula.handsontable.com/docs/guide/built-in-functions.html
- Runtime differences vs Excel/Sheets: https://hyperformula.handsontable.com/docs/guide/list-of-differences.html

## Error handling

See [error-handling.md](error-handling.md) — checking `CellError`, `ErrorType` enum, `getCellValueDetailedType`, common error causes.

## Always call `destroy()` in long-running apps

HyperFormula maintains internal data structures (dependency graph, address mapping) that are **not** garbage-collected until `destroy()` is called. Leaking instances in servers or SPAs accumulates memory.

```ts
hf.destroy();
// After destroy() the instance is unusable — create a new one if needed.
```

v3.3 fixed two longstanding leak sources inside live instances — pending lazy transformations and undo/redo history were not being trimmed. If you maintain very long-lived instances with heavy mutation throughput, also see `maxPendingLazyTransformations` in [configuration.md](configuration.md) to bound the lazy-transformation queue. `destroy()` is still mandatory at teardown.

## Force a string that looks like a formula

Prefix with `'` (apostrophe) to store the literal text instead of evaluating.

```ts
// Stored as the literal string "=SUM(1,2)", not a formula:
hf.setCellContents({ sheet: 0, col: 0, row: 0 }, "'=SUM(1,2)");
```

## Don't assume Excel parity

~68% of Excel functions are covered. Runtime differences exist even for implemented functions. Before relying on behavior, check:

- Full built-in list: https://hyperformula.handsontable.com/docs/guide/built-in-functions.html
- Runtime differences: https://hyperformula.handsontable.com/docs/guide/list-of-differences.html

Lookup behavior over ranges with empty cells changed in v3.4.0: `MATCH`, `VLOOKUP`, `HLOOKUP`, and `XLOOKUP` previously returned wrong results or `#N/A` when the search range contained empty cells, and `VLOOKUP`/`HLOOKUP`/`XLOOKUP` were fixed to return `0` instead of an empty value when the matched cell in the result range is empty. On versions before 3.4.0, treat lookup results over sparse ranges as suspect and suggest upgrading.

## `licenseKey` is always required

Every factory method (`buildFromArray`, `buildFromSheets`, `buildEmpty`) requires `licenseKey`. Use `'gpl-v3'` for open-source use or your commercial key.

## Page freeze on long digit strings (fixed in 3.4.0)

Entering a long string of digits containing a non-digit character near the end (e.g. `012...789a` or `012...789 123`) could freeze the page in versions before 3.4.0. If a user reports this symptom, upgrading to ≥ 3.4.0 fixes it.

## `MOD` sign behavior changed in 3.5.0

Before 3.5.0, `MOD` returned a remainder with the sign of the **dividend**, differing from Excel and Google Sheets when the arguments have opposite signs. From 3.5.0 onward, `MOD` returns a remainder with the sign of the **divisor**, matching Excel and Sheets (e.g. `=MOD(-3, 12)` now returns `9` instead of `-3`). If you relied on the old sign behavior, audit any `MOD` formulas with mixed-sign arguments after upgrading.

## `AVERAGEIF` division-by-zero false positive (fixed in 3.5.0)

Before 3.5.0, `AVERAGEIF` incorrectly returned a division-by-zero error when the calculated average was `0`. This is fixed in 3.5.0.

## `MAXPOOL` / `MEDIANPOOL` stride and error handling (changed in 3.5.0)

Before 3.5.0, passing a stride greater than the window size returned `#VALUE!`. From 3.5.0, a stride larger than the window is accepted — the windows skip the rows and columns between them. Additionally, these functions now return `#VALUE!` (instead of throwing an uncaught `TypeError` or `RangeError`) when the window is larger than the range or the range dimensions reduced by the window size are not whole multiples of the stride, and `#NUM!` when the window size or stride is not a positive integer.

## Statistical precision improved in 3.5.0

`VAR`, `STDEV`, `DEVSQ`, `COVARIANCE.P`, `COVARIANCE.S`, `SLOPE`, `STEYX`, `DVAR`, `DSTDEV`, their variants, and the matching `SUBTOTAL` modes previously lost precision on data with a large mean and a small spread. All of them except `DEVSQ` could also return an error or `0` for very large or very small values even when the result was within range; `DEVSQ` returned `0` for very small values. These are fixed in 3.5.0. `SLOPE` and `STEYX` also previously returned `#NUM!` or an arbitrary number instead of `#DIV/0!` when all x values are equal, and `STEYX` returned `#NUM!` or `0` instead of the correct standard error for near-collinear points — both fixed in 3.5.0.

## Localized `VSTACK` / `HSTACK` names corrected in 3.5.0

14 language packs had localized names for `VSTACK` and `HSTACK` that did not match Microsoft Excel; 3.5.0 corrects them. If a formula in a non-English `language` config used the old localized name, it resolves to `#NAME?` after upgrading — switch to the Excel name for that language (or the canonical English `VSTACK` / `HSTACK`).

## `VERSION` function output changed in 3.5.0

The `VERSION` function now returns only the HyperFormula version string (e.g. `HyperFormula v3.5.0`) without the license key status appended. Code that parsed the old format must be updated.

## Known hard limits

- **Single workbook per instance** — no multi-workbook support.
- No 3D references, dynamic arrays, async functions, structured references ("Tables"), or relative named expressions.
- `IF` reports cycles for all branches, even unreachable ones.
- Custom function result arrays don't auto-resize when dependencies change.
