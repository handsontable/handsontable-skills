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

## Known hard limits

- **Single workbook per instance** — no multi-workbook support.
- No 3D references, dynamic arrays, async functions, structured references ("Tables"), or relative named expressions.
- `IF` reports cycles for all branches, even unreachable ones.
- Custom function result arrays don't auto-resize when dependencies change.
