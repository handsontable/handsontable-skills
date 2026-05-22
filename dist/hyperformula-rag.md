# hyperformula skill

_Flattened single-doc build of `skills/hyperformula/` for RAG ingestion. Source of truth is the skill directory._

---

## skills/hyperformula/SKILL.md

---
name: hyperformula
description: >
  Use this skill when the user works with HyperFormula (HF) — a headless,
  open-source TypeScript spreadsheet calculation engine. Use it when the user:
  mentions HyperFormula or HF; wants to integrate Excel-like formulas into a
  JS/TS app; evaluate formulas programmatically in a browser or Node.js;
  simulate spreadsheet or Excel calculation behavior server-side; run
  calculations over data parsed from XLSX files (e.g. via SheetJS) in code;
  build a pricing engine, financial model, or what-if analysis in code; define
  custom spreadsheet functions or named expressions outside of a UI context. Do
  NOT use this skill for: general Excel questions unrelated to HF; general
  Google Sheets questions; generic spreadsheet formula-syntax questions outside
  an HF context; formulas used inside Handsontable (use the "handsontable"
  skill instead).
---

# HyperFormula

HyperFormula is a **headless, open-source TypeScript spreadsheet calculation engine** for embedding spreadsheet logic in any JavaScript/TypeScript application (browser or Node.js). ~420 built-in functions, dependency graph, undo/redo, i18n (17 languages). Dual-licensed: GPLv3 or commercial.

- Docs: https://hyperformula.handsontable.com/
- npm: https://www.npmjs.com/package/hyperformula
- GitHub: https://github.com/handsontable/hyperformula

## Where to go next

Task-oriented references in `references/` (open the one that matches what the user is doing):

- [`getting-started.md`](references/getting-started.md) — how to install, create an instance (`buildFromArray` / `buildFromSheets` / `buildEmpty`), and work with cell addresses. Open this for onboarding questions and first-run errors.
- [`api-quickref.md`](references/api-quickref.md) — runnable examples for CRUD, rows/columns, sheets, exporting data, batching, named expressions, events, undo/redo, clipboard. Open this when implementing or debugging HF API calls.
- [`custom-functions.md`](references/custom-functions.md) — extending HyperFormula via `FunctionPlugin`: minimal plugin, argument types, volatile functions, range arguments, returning arrays, error handling, aliases, localized names. Open this when adding or debugging custom spreadsheet functions.
- [`configuration.md`](references/configuration.md) — `ConfigParams` options, Excel-compatibility preset, Google-Sheets preset, and config-related pitfalls (separator collisions, Node ICU, `precisionRounding` change in v3). Open this when tuning behavior or diagnosing locale issues.
- [`vue3.md`](references/vue3.md) — Vue 3 integration: `markRaw` requirement, Composition API, Pinia/Vuex stores, `destroy()` on unmount. Open this when embedding HF in a Vue 3 app.
- [`error-handling.md`](references/error-handling.md) — inspecting `CellError`, `ErrorType` enum, `getCellValueDetailedType`, common error causes (`#NAME?`, `#CYCLE!`, `#REF!`, …). Open this when a cell returns an error or you need to branch on result type.
- [`general-pitfalls.md`](references/general-pitfalls.md) — cross-cutting gotchas: `destroy()` lifecycle, forcing literal strings, Excel-parity caveats, hard limits. Open this when results look wrong or memory grows unboundedly.

Below this section is the **Documentation map** — the canonical directory of links to the official HyperFormula docs. Use it when pointing the user to authoritative material.

## Documentation map

All links resolve to `hyperformula.handsontable.com` unless noted.

### Introduction
- Welcome / Homepage: https://hyperformula.handsontable.com/
- Demo: https://hyperformula.handsontable.com/docs/guide/demo.html

### Overview
- Quality (test coverage, CI): https://hyperformula.handsontable.com/docs/guide/quality.html
- Supported browsers: https://hyperformula.handsontable.com/docs/guide/supported-browsers.html
- Dependencies: https://hyperformula.handsontable.com/docs/guide/dependencies.html
- Licensing (GPLv3 vs commercial): https://hyperformula.handsontable.com/docs/guide/licensing.html
- Support: https://hyperformula.handsontable.com/docs/guide/support.html

### Getting Started
- Client-side installation: https://hyperformula.handsontable.com/docs/guide/client-side-installation.html
- Server-side installation (Node.js): https://hyperformula.handsontable.com/docs/guide/server-side-installation.html
- Basic usage: https://hyperformula.handsontable.com/docs/guide/basic-usage.html
- Advanced usage: https://hyperformula.handsontable.com/docs/guide/advanced-usage.html
- Configuration options guide: https://hyperformula.handsontable.com/docs/guide/configuration-options.html
- License key setup: https://hyperformula.handsontable.com/docs/guide/license-key.html

### Framework Integration
- React: https://hyperformula.handsontable.com/docs/guide/integration-with-react.html
- Vue: https://hyperformula.handsontable.com/docs/guide/integration-with-vue.html
- Angular: https://hyperformula.handsontable.com/docs/guide/integration-with-angular.html
- Svelte: https://hyperformula.handsontable.com/docs/guide/integration-with-svelte.html

### Data Operations
- Basic operations (CRUD): https://hyperformula.handsontable.com/docs/guide/basic-operations.html
- Batch operations: https://hyperformula.handsontable.com/docs/guide/batch-operations.html
- Clipboard operations: https://hyperformula.handsontable.com/docs/guide/clipboard-operations.html
- Undo-redo: https://hyperformula.handsontable.com/docs/guide/undo-redo.html
- Sorting data: https://hyperformula.handsontable.com/docs/guide/sorting-data.html

### Formulas
- Specifications and limits: https://hyperformula.handsontable.com/docs/guide/specifications-and-limits.html
- Cell references (relative, absolute, mixed, cross-sheet): https://hyperformula.handsontable.com/docs/guide/cell-references.html
- Types of values: https://hyperformula.handsontable.com/docs/guide/types-of-values.html
- Types of errors: https://hyperformula.handsontable.com/docs/guide/types-of-errors.html
- Types of operators: https://hyperformula.handsontable.com/docs/guide/types-of-operators.html
- Order of precedence: https://hyperformula.handsontable.com/docs/guide/order-of-precendece.html
- Built-in functions (full list, ~400): https://hyperformula.handsontable.com/docs/guide/built-in-functions.html
- Volatile functions: https://hyperformula.handsontable.com/docs/guide/volatile-functions.html
- Named expressions: https://hyperformula.handsontable.com/docs/guide/named-expressions.html
- Array formulas / ARRAYFORMULA: https://hyperformula.handsontable.com/docs/guide/arrays.html

### Internationalization
- i18n features (17 languages): https://hyperformula.handsontable.com/docs/guide/i18n-features.html
- Localizing function names: https://hyperformula.handsontable.com/docs/guide/localizing-functions.html
- Date and time handling: https://hyperformula.handsontable.com/docs/guide/date-and-time-handling.html

### Compatibility
- Microsoft Excel compatibility: https://hyperformula.handsontable.com/docs/guide/compatibility-with-microsoft-excel.html
- Google Sheets compatibility: https://hyperformula.handsontable.com/docs/guide/compatibility-with-google-sheets.html
- Runtime differences (Excel & Sheets): https://hyperformula.handsontable.com/docs/guide/list-of-differences.html

### Advanced Topics
- Key concepts (AST, dependency graph, evaluation): https://hyperformula.handsontable.com/docs/guide/key-concepts.html
- Dependency graph: https://hyperformula.handsontable.com/docs/guide/dependency-graph.html
- Building & testing from source: https://hyperformula.handsontable.com/docs/guide/building.html
- Custom functions (FunctionPlugin): https://hyperformula.handsontable.com/docs/guide/custom-functions.html
- Performance: https://hyperformula.handsontable.com/docs/guide/performance.html
- Known limitations: https://hyperformula.handsontable.com/docs/guide/known-limitations.html
- File import: https://hyperformula.handsontable.com/docs/guide/file-import.html

### Upgrade & Migration
- Release notes / Changelog: https://hyperformula.handsontable.com/docs/guide/release-notes.html
- 0.6 → 1.0 migration: https://hyperformula.handsontable.com/docs/guide/migration-from-0.6-to-1.0.html
- 1.x → 2.0 migration: https://hyperformula.handsontable.com/docs/guide/migration-from-1.x-to-2.0.html
- 2.x → 3.0 migration: https://hyperformula.handsontable.com/docs/guide/migration-from-2.x-to-3.0.html

### API Reference
- API overview: https://hyperformula.handsontable.com/docs/api/
- HyperFormula class (all methods): https://hyperformula.handsontable.com/docs/api/classes/hyperformula.html
- ConfigParams interface (all options): https://hyperformula.handsontable.com/docs/api/interfaces/configparams.html
- Listeners interface (all events): https://hyperformula.handsontable.com/docs/api/interfaces/listeners.html

### npm
- npm page: https://www.npmjs.com/package/hyperformula

### Community & Support
- GitHub repo: https://github.com/handsontable/hyperformula
- GitHub Issues: https://github.com/handsontable/hyperformula/issues
- GitHub Discussions: https://github.com/handsontable/hyperformula/discussions
- Developer Forum: https://forum.handsontable.com/
- Commercial support: support@handsontable.com
- Sales (commercial license): sales@handsontable.com
- Contact form: https://handsontable.com/contact

---

> **Last updated: 2026-05-20 · Aligned with HyperFormula 3.3.0.**
> If the user is on a newer release, confirm API shape against the latest docs (see the **Release notes** link above) before relying on this file.

---

## skills/hyperformula/references/api-quickref.md

# API Quick Reference

Runnable examples for the most-used HyperFormula APIs. Authoritative docs:
- Basic operations: https://hyperformula.handsontable.com/docs/guide/basic-operations.html
- Batch operations: https://hyperformula.handsontable.com/docs/guide/batch-operations.html
- Named expressions: https://hyperformula.handsontable.com/docs/guide/named-expressions.html
- Clipboard operations: https://hyperformula.handsontable.com/docs/guide/clipboard-operations.html
- Undo-redo: https://hyperformula.handsontable.com/docs/guide/undo-redo.html
- Sorting data: https://hyperformula.handsontable.com/docs/guide/sorting-data.html
- HyperFormula class (all methods): https://hyperformula.handsontable.com/docs/api/classes/hyperformula.html
- Listeners (all events): https://hyperformula.handsontable.com/docs/api/interfaces/listeners.html

## CRUD

```ts
// Write: string, number, or formula
hf.setCellContents({ sheet: 0, col: 0, row: 0 }, 'Hello');
hf.setCellContents({ sheet: 0, col: 1, row: 0 }, '=A1 & " World"');

// Read
hf.getCellValue({ sheet: 0, col: 1, row: 0 });    // computed result
hf.getCellFormula({ sheet: 0, col: 1, row: 0 });  // '=A1 & " World"'
hf.getCellType({ sheet: 0, col: 0, row: 0 });     // CellType.FORMULA | VALUE | EMPTY
```

## Rows and columns

Second arg is `[startIndex, count]`, not a list of indexes.

```ts
hf.addRows(sheetId, [rowIndex, numberOfRows]);
hf.removeRows(sheetId, [rowIndex, numberOfRows]);
hf.addColumns(sheetId, [colIndex, numberOfColumns]);
hf.removeColumns(sheetId, [colIndex, numberOfColumns]);
```

## Sheets

```ts
hf.addSheet('NewSheet');
hf.removeSheet(sheetId);
hf.renameSheet(sheetId, 'BetterName');
hf.countSheets();
hf.getSheetName(sheetId);
hf.getSheetId('SheetName');
hf.getSheetDimensions(sheetId); // → { width, height }
```

## Export data

```ts
hf.getSheetValues(sheetId);        // computed values as 2D array
hf.getSheetSerialized(sheetId);    // formulas/raw values as 2D array
hf.getAllSheetsValues();            // { SheetName: values[][] }
hf.getAllSheetsSerialized();        // { SheetName: formulas[][] }
```

## Batch operations

Every `setCellContents` call triggers a full dependency-graph recalculation. Always batch when writing more than one cell.

```ts
// Preferred: batch() — returns ExportedChange[]
const changes = hf.batch(() => {
  hf.setCellContents({ sheet: 0, col: 0, row: 0 }, '100');
  hf.setCellContents({ sheet: 0, col: 0, row: 1 }, '200');
  hf.addRows(0, [2, 1]);
});
// `changes` contains all cells that were recalculated.

// For bulk imports (value writes only):
hf.suspendEvaluation();
// ... hundreds of setCellContents calls ...
hf.resumeEvaluation();  // single recalc

// PITFALL: structural ops (addRows/moveRows/...) during suspendEvaluation
// have degraded performance. Use batch() when mixing structural + value writes.
```

## Sorting

`setRowOrder` takes a **permutation array**, not a comparator. Compute the new index sequence externally, then pass it in.

```ts
// Sort rows by the value in column 0
const rowCount = hf.getSheetDimensions(0).height;
const indexes = Array.from({ length: rowCount }, (_, i) => i);
indexes.sort((a, b) => {
  const va = hf.getCellValue({ sheet: 0, col: 0, row: a }) as number;
  const vb = hf.getCellValue({ sheet: 0, col: 0, row: b }) as number;
  return va - vb;
});
hf.setRowOrder(0, indexes); // e.g. [2, 0, 1, 3]
```

## Named expressions

Reusable names for values or formulas. Can be global or scoped to a sheet (local shadows global).

```ts
hf.addNamedExpression('TAX_RATE', '0.21');
hf.addNamedExpression('TOTAL_REVENUE', '=SUM(Revenue!A:A)');

hf.setCellContents({ sheet: 0, col: 0, row: 0 }, '=1000 * TAX_RATE');

hf.listNamedExpressions(); // all registered names
```

## Custom functions

See [custom-functions.md](custom-functions.md) — `FunctionPlugin`, argument types, volatile functions, range arguments, returning arrays, error handling, aliases, localized names.

## Events

Subscribe via `.on()` on the instance. Full list: https://hyperformula.handsontable.com/docs/api/interfaces/listeners.html

```ts
hf.on('valuesUpdated', (changes) => {
  changes.forEach((c) => console.log(c.address, c.newValue));
});

hf.on('sheetAdded', (addedSheetName) => { /* ... */ });
hf.on('sheetRemoved', (removedSheetName, removedSheetData) => { /* ... */ });
hf.on('sheetRenamed', (oldName, newName) => { /* ... */ });
```

## Undo / redo

```ts
hf.undo();
hf.redo();
hf.isThereSomethingToUndo();
hf.isThereSomethingToRedo();
hf.clearUndoStack();
```

Configure depth via `undoLimit` in `ConfigParams` (see [configuration.md](configuration.md)).

## Clipboard

```ts
hf.copy({ start: { sheet: 0, col: 0, row: 0 }, end: { sheet: 0, col: 1, row: 1 } });
hf.cut ({ start: { sheet: 0, col: 0, row: 0 }, end: { sheet: 0, col: 1, row: 1 } });
hf.paste({ sheet: 0, col: 5, row: 5 });
hf.isClipboardEmpty();
hf.clearClipboard();
```

---

## skills/hyperformula/references/configuration.md

# Configuration

`ConfigParams` + compatibility presets + config-specific pitfalls. Authoritative docs:
- Configuration options guide: https://hyperformula.handsontable.com/docs/guide/configuration-options.html
- ConfigParams (all options): https://hyperformula.handsontable.com/docs/api/interfaces/configparams.html
- Excel compatibility: https://hyperformula.handsontable.com/docs/guide/compatibility-with-microsoft-excel.html
- Google Sheets compatibility: https://hyperformula.handsontable.com/docs/guide/compatibility-with-google-sheets.html

## ConfigParams highlights

Pass as the second argument to any factory method.

```ts
const hf = HyperFormula.buildEmpty({
  licenseKey: 'gpl-v3',           // required — 'gpl-v3' for open source
  precisionRounding: 10,          // decimal rounding precision (default 10; was 14 before v3)
  functionArgSeparator: ',',      // separator between function arguments
  dateFormats: ['DD/MM/YYYY', 'DD-MM-YYYY'],
  nullDate: { year: 1900, month: 1, day: 1 },
  leapYear1900: false,            // Excel bug compat: treat 1900 as leap year
  maxRows: 40000,                 // max rows per sheet (default 40000)
  maxColumns: 18278,              // max columns per sheet (default 18278 = 'ZZZ')
  undoLimit: 20,                  // undo history depth
  maxPendingLazyTransformations: 1000, // v3.3+ — cap accumulated lazy transformations before cleanup
});
```

## Excel compatibility preset

```ts
const hf = HyperFormula.buildEmpty({
  licenseKey: 'gpl-v3',
  useArrayArithmetic: true,
  useWildcards: true,
  evaluateNullToZero: true,
  leapYear1900: true,     // Excel's intentional 1900 leap-year bug
  ignoreWhiteSpace: 'any',
  caseSensitive: false,
  accentSensitive: true,
});
```

## Google Sheets compatibility preset

Defaults already match Google Sheets behavior (`leapYear1900: false`, `useArrayArithmetic: false`).

```ts
const hf = HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' });
```

## Config-specific pitfalls

### Vue 3

Vue 3 requires wrapping the instance with `markRaw` — see [vue3.md](vue3.md) for the full integration guide (React / Angular / Svelte need no special handling).

### `functionArgSeparator` vs `thousandSeparator` collision

These two options **cannot share a character**. European locales that use `,` as thousand separator must change the argument separator:

```ts
const hf = HyperFormula.buildEmpty({
  licenseKey: 'gpl-v3',
  thousandSeparator: ',',
  decimalSeparator: '.',
  functionArgSeparator: ';',  // must differ from thousandSeparator
});
```

### Node.js must have full ICU

String comparisons (used in `MATCH`, `VLOOKUP`, sorting) can silently produce wrong results on Node.js < 13 or builds without full ICU. Verify at startup:

```ts
// Must report 'full' (or a detailed ICU version), not 'small'.
console.log(process.versions.icu);
```

### Tuning `maxPendingLazyTransformations` (v3.3+)

HyperFormula defers some structural transformations (row/column insertions, moves) and applies them lazily. In long-lived instances with heavy mutation throughput — bulk imports, frequent undo/redo, scripted batch edits — the pending queue can grow before cleanup. v3.3 fixed the unbounded-growth leak; this option lets you cap the queue explicitly. Lower values trade memory for more frequent flush work; the default is suitable for typical UI workloads.

### `precisionRounding` default changed in v3

Before v3 the default was `14`. It is now `10`. Calculations relying on the old precision need an explicit override:

```ts
const hf = HyperFormula.buildEmpty({
  licenseKey: 'gpl-v3',
  precisionRounding: 14,  // pre-v3 behavior
});
```

---

## skills/hyperformula/references/custom-functions.md

# Custom Functions

Extend HyperFormula with your own functions via `FunctionPlugin`. Authoritative doc:
- Custom functions guide: https://hyperformula.handsontable.com/docs/guide/custom-functions.html

## Minimal plugin

Register **before** creating any instance — functions registered after `buildFromArray` / `buildFromSheets` / `buildEmpty` won't be available.

```ts
import { HyperFormula, FunctionPlugin, FunctionArgumentType } from 'hyperformula';

class MyPlugin extends FunctionPlugin {
  greet(ast, state) {
    return this.runFunction(
      ast.args,
      state,
      this.metadata('GREET'),
      (name) => `Hello, ${name}!`
    );
  }
}

MyPlugin.implementedFunctions = {
  GREET: {
    method: 'greet',
    parameters: [{ argumentType: FunctionArgumentType.STRING }],
  },
};

const translations = { enGB: { GREET: 'GREET' }, enUS: { GREET: 'GREET' } };

// PITFALL: registration MUST happen before any instance is built.
HyperFormula.registerFunctionPlugin(MyPlugin, translations);

const hf = HyperFormula.buildFromArray(
  [['World', '=GREET(A1)']],
  { licenseKey: 'gpl-v3' }
);
console.log(hf.getCellValue({ sheet: 0, col: 1, row: 0 })); // "Hello, World!"
```

## Volatile functions

Mark a function as volatile so it recalculates on every change (like `RAND` or `NOW`). Volatile functions are expensive in large sheets — use sparingly.

```ts
MyPlugin.implementedFunctions = {
  RAND_ID: {
    method: 'randId',
    parameters: [],
    isVolatile: true,
  },
};
```

## Argument types

```ts
import { FunctionArgumentType } from 'hyperformula';

// FunctionArgumentType.NUMBER
// FunctionArgumentType.STRING
// FunctionArgumentType.BOOLEAN
// FunctionArgumentType.NOERROR
// FunctionArgumentType.SCALAR
// FunctionArgumentType.RANGE       // accepts a cell range
// FunctionArgumentType.ANY
```

Use `optionalArg: true`, `defaultValue`, and `minValue` / `maxValue` to validate arguments declaratively:

```ts
MyPlugin.implementedFunctions = {
  CLAMP: {
    method: 'clamp',
    parameters: [
      { argumentType: FunctionArgumentType.NUMBER },
      { argumentType: FunctionArgumentType.NUMBER, optionalArg: true, defaultValue: 0 },
      { argumentType: FunctionArgumentType.NUMBER, optionalArg: true, defaultValue: 100 },
    ],
  },
};
```

## Range arguments

Use `RANGE` argument type when the function takes a cell area. The callback receives the range as a 2D array.

```ts
class SumPositivesPlugin extends FunctionPlugin {
  sumPositives(ast, state) {
    return this.runFunction(
      ast.args,
      state,
      this.metadata('SUM_POSITIVES'),
      (range) => {
        let total = 0;
        for (const row of range.data) {
          for (const v of row) if (typeof v === 'number' && v > 0) total += v;
        }
        return total;
      }
    );
  }
}

SumPositivesPlugin.implementedFunctions = {
  SUM_POSITIVES: {
    method: 'sumPositives',
    parameters: [{ argumentType: FunctionArgumentType.RANGE }],
  },
};
```

## Returning arrays

Custom functions can return 2D arrays. **PITFALL:** result arrays don't auto-resize when upstream dependencies change — the footprint is fixed at first evaluation.

```ts
class SplitPlugin extends FunctionPlugin {
  splitToRow(ast, state) {
    return this.runFunction(
      ast.args,
      state,
      this.metadata('SPLIT_ROW'),
      (text, sep) => [text.split(sep)]  // 2D array: one row, N cols
    );
  }
}
```

## Error handling

Return a `CellError` to signal a formula error:

```ts
import { CellError, ErrorType } from 'hyperformula';

class DividePlugin extends FunctionPlugin {
  safeDivide(ast, state) {
    return this.runFunction(
      ast.args,
      state,
      this.metadata('SAFE_DIVIDE'),
      (a, b) => (b === 0 ? new CellError(ErrorType.DIV_BY_ZERO) : a / b)
    );
  }
}
```

## Aliases and localized names

Expose one method under multiple function names, or localize:

```ts
MyPlugin.aliases = {
  HELLO: 'GREET', // calling =HELLO(x) runs the greet() method
};

const translations = {
  enGB: { GREET: 'GREET' },
  plPL: { GREET: 'POWITAJ' }, // =POWITAJ("Świat") in Polish
};
HyperFormula.registerFunctionPlugin(MyPlugin, translations);
```

## Unregister / introspect

```ts
HyperFormula.unregisterFunctionPlugin(MyPlugin);
HyperFormula.unregisterFunction('GREET');
HyperFormula.getRegisteredFunctionNames('enGB');
```

---

## skills/hyperformula/references/error-handling.md

# Error Handling

Inspect cell values that may be errors, tell error types apart, and check value shape. Authoritative docs:
- Types of errors: https://hyperformula.handsontable.com/docs/guide/types-of-errors.html
- Types of values: https://hyperformula.handsontable.com/docs/guide/types-of-values.html

## Always check `CellError` before using a result

Cell values can be errors (`#DIV/0!`, `#VALUE!`, `#REF!`, etc.). Always test before using a result.

```ts
import { CellError, ErrorType } from 'hyperformula';

const value = hf.getCellValue({ sheet: 0, col: 0, row: 0 });

if (value instanceof CellError) {
  // ErrorType enum: DIV_BY_ZERO, VALUE, REF, NAME, NUM, NA, CYCLE, ERROR
  switch (value.type) {
    case ErrorType.CYCLE:
      console.log('Circular reference');
      break;
    case ErrorType.NAME:
      // Usually: function not registered (check plugin registration or i18n language)
      console.log('Unknown name:', value.message);
      break;
    default:
      console.log('Error:', value.type, value.message);
  }
} else {
  console.log('Value:', value);
}
```

## `#CYCLE!` is HyperFormula-specific

Standard spreadsheet apps report cycles differently. HyperFormula's `IF` also reports cycles for all branches, even unreachable ones — this can produce `#CYCLE!` in formulas that Excel or Sheets would evaluate.

## Inspect value shape without catching errors

```ts
import { CellValueDetailedType } from 'hyperformula';

hf.getCellValueDetailedType({ sheet: 0, col: 0, row: 0 });
// → CellValueDetailedType.NUMBER | STRING | BOOLEAN | ERROR | EMPTY | ...
```

Use the detailed type when you need to distinguish e.g. number vs empty without touching the value.

## Returning errors from custom functions

Custom `FunctionPlugin` methods can return a `CellError` to surface a formula error. See [custom-functions.md](custom-functions.md) for the full pattern.

```ts
import { CellError, ErrorType } from 'hyperformula';

return new CellError(ErrorType.DIV_BY_ZERO);
```

## Common causes

| Error | Common cause |
|---|---|
| `#NAME?` | Function not registered (check `registerFunctionPlugin` order or `language` config) |
| `#CYCLE!` | Circular reference — or an `IF` branch that *could* produce one |
| `#REF!` | Deleted row/column broke a formula reference |
| `#VALUE!` | Type mismatch — e.g. passing a string where a number is expected |
| `#DIV/0!` | Division by zero, including empty cells coerced to 0 |
| `#NUM!` | Out-of-range numeric result (e.g. `SQRT(-1)`) |
| `#N/A` | Lookup miss (`MATCH`, `VLOOKUP`) or propagated from an upstream `#N/A` |

---

## skills/hyperformula/references/general-pitfalls.md

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

## `licenseKey` is always required

Every factory method (`buildFromArray`, `buildFromSheets`, `buildEmpty`) requires `licenseKey`. Use `'gpl-v3'` for open-source use or your commercial key.

## Known hard limits

- **Single workbook per instance** — no multi-workbook support.
- No 3D references, dynamic arrays, async functions, structured references ("Tables"), or relative named expressions.
- `IF` reports cycles for all branches, even unreachable ones.
- Custom function result arrays don't auto-resize when dependencies change.

---

## skills/hyperformula/references/getting-started.md

# Getting Started

Install, create an instance, read/write cells. Authoritative docs:
- Client-side install: https://hyperformula.handsontable.com/docs/guide/client-side-installation.html
- Server-side install: https://hyperformula.handsontable.com/docs/guide/server-side-installation.html
- Basic usage: https://hyperformula.handsontable.com/docs/guide/basic-usage.html

## Install

### npm

```bash
npm install hyperformula
```

### CDN (jsDelivr, pinned version)

```html
<script src="https://cdn.jsdelivr.net/npm/hyperformula@3.2.0/dist/hyperformula.full.min.js"></script>
```

### Node.js

Same npm install. Requires Node.js 13+ with full ICU for locale-aware string comparison.

## Create an instance

Every factory method requires `licenseKey`. Use `'gpl-v3'` for open-source use or your commercial key.

### `buildFromArray` — single sheet from a 2D array

```ts
import { HyperFormula } from 'hyperformula';

const hf = HyperFormula.buildFromArray(
  [
    ['10', '20', '=SUM(A1:B1)'],
    ['30', '40', '=SUM(A2:B2)'],
  ],
  { licenseKey: 'gpl-v3' }
);

console.log(hf.getCellValue({ sheet: 0, col: 2, row: 0 })); // 30
```

### `buildFromSheets` — multi-sheet workbook

```ts
const hf = HyperFormula.buildFromSheets(
  {
    Revenue: [['100', '200', '=SUM(A1:B1)']],
    Expenses: [['50', '=Revenue!C1 - A1']],
  },
  { licenseKey: 'gpl-v3' }
);
```

Cross-sheet references use `SheetName!CellRef` syntax.

### `buildEmpty` — start empty, add sheets later

```ts
const hf = HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' });
const sheetName = hf.addSheet('Data');
const sheetId = hf.getSheetId(sheetName);

hf.setCellContents({ sheet: sheetId, col: 0, row: 0 }, [
  ['10', '20', '=SUM(A1:B1)'],
]);
```

## Cell addresses

All addresses use zero-indexed `{ sheet, col, row }`. Convert to/from A1 notation with built-in helpers:

```ts
hf.simpleCellAddressFromString('B3', 0);
// → { sheet: 0, col: 1, row: 2 }

hf.simpleCellAddressToString({ sheet: 0, col: 1, row: 2 }, 0);
// → 'B3'
```

---

## skills/hyperformula/references/vue3.md

# Vue 3

HyperFormula + Vue 3 integration. Authoritative doc:
- Vue integration guide: https://hyperformula.handsontable.com/docs/guide/integration-with-vue.html

## Always wrap the instance with `markRaw`

Vue 3's Composition API wraps objects in a reactive Proxy that intercepts property access and **corrupts HyperFormula's internal state**, causing silent data corruption or crashes. React, Angular, and Svelte need no special handling.

```ts
import { markRaw } from 'vue';
import { HyperFormula } from 'hyperformula';

const hf = markRaw(
  HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' })
);
```

Use the same wrapper no matter where the instance is held — `ref`, `reactive`, component state, a store (Pinia/Vuex), or a composable. If the raw HyperFormula instance ever reaches Vue's reactivity system, it must be marked.

## Composition API example

```ts
import { onBeforeUnmount, ref } from 'vue';
import { markRaw } from 'vue';
import { HyperFormula } from 'hyperformula';

export function useHyperFormula() {
  const hf = markRaw(
    HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' })
  );

  // Free internal data structures when the component unmounts.
  onBeforeUnmount(() => hf.destroy());

  const result = ref<unknown>(null);

  function evaluate(formula: string) {
    hf.setCellContents({ sheet: 0, col: 0, row: 0 }, formula);
    result.value = hf.getCellValue({ sheet: 0, col: 0, row: 0 });
  }

  return { evaluate, result };
}
```

## Pinia / Vuex store

```ts
import { defineStore } from 'pinia';
import { markRaw } from 'vue';
import { HyperFormula } from 'hyperformula';

export const useCalcStore = defineStore('calc', {
  state: () => ({
    hf: markRaw(
      HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' })
    ),
  }),
});
```

## Cleanup

HyperFormula's internal graph is **not** garbage-collected until `destroy()` is called. In SPAs this accumulates memory over time.

```ts
import { onBeforeUnmount } from 'vue';

onBeforeUnmount(() => hf.destroy());
// After destroy() the instance is unusable — create a new one if needed.
```
