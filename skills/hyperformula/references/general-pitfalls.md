# General Pitfalls

Cross-cutting gotchas that aren't tied to a specific API or config option. Authoritative docs:
- Known limitations: https://hyperformula.handsontable.com/guide/known-limitations.html
- Built-in functions (full list): https://hyperformula.handsontable.com/guide/built-in-functions.html
- Runtime differences vs Excel/Sheets: https://hyperformula.handsontable.com/guide/list-of-differences.html

## Error handling

See [error-handling.md](error-handling.md) — checking `CellError`, `ErrorType` enum, `getCellValueDetailedType`, common error causes.

## Always call `destroy()` in long-running apps

HyperFormula maintains internal data structures (dependency graph, address mapping) that are **not** garbage-collected until `destroy()` is called. Leaking instances in servers or SPAs accumulates memory.

```ts
hf.destroy();
// After destroy() the instance is unusable — create a new one if needed.
```

## Force a string that looks like a formula

Prefix with `'` (apostrophe) to store the literal text instead of evaluating.

```ts
// Stored as the literal string "=SUM(1,2)", not a formula:
hf.setCellContents({ sheet: 0, col: 0, row: 0 }, "'=SUM(1,2)");
```

## Don't assume Excel parity

~68% of Excel functions are covered. Runtime differences exist even for implemented functions. Before relying on behavior, check:

- Full built-in list: https://hyperformula.handsontable.com/guide/built-in-functions.html
- Runtime differences: https://hyperformula.handsontable.com/guide/list-of-differences.html

## `licenseKey` is always required

Every factory method (`buildFromArray`, `buildFromSheets`, `buildEmpty`) requires `licenseKey`. Use `'gpl-v3'` for open-source use or your commercial key.

## Known hard limits

- **Single workbook per instance** — no multi-workbook support.
- No 3D references, dynamic arrays, async functions, structured references ("Tables"), or relative named expressions.
- `IF` reports cycles for all branches, even unreachable ones.
- Custom function result arrays don't auto-resize when dependencies change.
