---
name: hyperformula
description: >
  Use this skill whenever the user asks about HyperFormula — a headless, open-source spreadsheet
  calculation engine written in TypeScript. Triggers include: mentions of "hyperformula",
  "HyperFormula", "headless spreadsheet", "formula engine", "spreadsheet calculation engine",
  server-side formula evaluation, evaluating Excel/Google Sheets formulas in code, "buildFromArray",
  "buildFromSheets", "buildEmpty", custom spreadsheet functions (FunctionPlugin), named expressions
  in a non-UI context, or embedding spreadsheet logic in a backend or browser app without a grid UI.
  Also trigger when the user wants to evaluate formulas programmatically, add spreadsheet-like
  computation to any JS/TS application, do what-if analysis on the server side, or implement a
  pricing engine or financial model in code. Do NOT use this skill when the user is working with
  HyperFormula inside Handsontable's Formulas plugin — that is covered by the handsontable skill.
---

# HyperFormula

HyperFormula is a **headless, open-source spreadsheet calculation engine** built in TypeScript. It
has no UI — it is a pure computation engine for embedding spreadsheet logic in any JavaScript or
TypeScript application (browser or Node.js).

- **Latest version:** 3.2.0 (February 2026)
- **Language:** TypeScript
- **~400 built-in functions** (~68% Excel coverage): math, logical, lookup, text, date/time, statistical, financial, information, array
- **Also provides:** dependency graph traversal (precedents/dependents), undo/redo (configurable depth), data type auto-detection, clipboard operations, sorting, and i18n (17 languages for localized function names)
- **License:** GPLv3 (open source) or commercial. Use `licenseKey: 'gpl-v3'` for open source.
- **Works in:** All modern browsers + Node.js 13+ (requires full ICU support)

Always check `references/docs-map.md` (in this skill folder) for the full organized link directory
when you need to point the user to specific documentation.

### What this skill does NOT cover

- **HyperFormula inside Handsontable** (the Formulas plugin) — use the "handsontable" skill instead.
- **UI/grid rendering** — HyperFormula is headless. If the user needs a visible spreadsheet, point them to Handsontable.
- **Excel file I/O** — HyperFormula doesn't read/write `.xlsx` files. Use a library like SheetJS for parsing, then feed the data to HyperFormula.

---

## Installation

### npm

```bash
npm install hyperformula
```

### CDN (jsDelivr)

```html
<script src="https://cdn.jsdelivr.net/npm/hyperformula/dist/hyperformula.full.min.js"></script>
```

Pin a version with `hyperformula@3.2.0` in the URL.

### Server-side (Node.js)

Same npm install. Requires Node.js 13+ with full ICU for locale-aware string comparison. Older
Node versions may not compare culture-insensitive strings correctly.

- Client-side installation: https://hyperformula.handsontable.com/guide/client-side-installation.html
- Server-side installation: https://hyperformula.handsontable.com/guide/server-side-installation.html

---

## Creating an Instance

HyperFormula provides three static factory methods. All require a `licenseKey`.

### buildFromArray — single sheet from a 2D array

```ts
import { HyperFormula } from 'hyperformula';

const hf = HyperFormula.buildFromArray(
  [
    ['10', '20', '=SUM(A1:B1)'],
    ['30', '40', '=SUM(A2:B2)'],
  ],
  { licenseKey: 'gpl-v3' }
);

// Read a computed value (zero-indexed: sheet, col, row)
console.log(hf.getCellValue({ sheet: 0, col: 2, row: 0 })); // 30
```

### buildFromSheets — multi-sheet workbook

```ts
const hf = HyperFormula.buildFromSheets(
  {
    Revenue: [['100', '200', '=SUM(A1:B1)']],
    Expenses: [['50', '=Revenue!C1 - A1']],
  },
  { licenseKey: 'gpl-v3' }
);
```

Cross-sheet references use `SheetName!CellRef` syntax, just like Excel.

### buildEmpty — start with nothing, add sheets later

```ts
const hf = HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' });
const sheetName = hf.addSheet('Data');
const sheetId = hf.getSheetId(sheetName);

hf.setCellContents({ sheet: sheetId, col: 0, row: 0 }, [['10', '20', '=SUM(A1:B1)']]);
```

### Cell addresses

All addresses use zero-indexed `{ sheet: number, col: number, row: number }`.

- Basic usage guide: https://hyperformula.handsontable.com/guide/basic-usage.html
- Advanced usage guide: https://hyperformula.handsontable.com/guide/advanced-usage.html

---

## CRUD Operations

```ts
// Set a cell value (string, number, or formula)
hf.setCellContents({ sheet: 0, col: 0, row: 0 }, 'Hello');
hf.setCellContents({ sheet: 0, col: 1, row: 0 }, '=A1 & " World"');

// Read values
hf.getCellValue({ sheet: 0, col: 1, row: 0 });   // computed result
hf.getCellFormula({ sheet: 0, col: 1, row: 0 });  // '=A1 & " World"'

// Rows and columns — second arg is [startIndex, count]
hf.addRows(sheetId, [rowIndex, numberOfRows]);
hf.removeRows(sheetId, [rowIndex, numberOfRows]);
hf.addColumns(sheetId, [colIndex, numberOfColumns]);
hf.removeColumns(sheetId, [colIndex, numberOfColumns]);

// Sheets
hf.addSheet('NewSheet');
hf.removeSheet(sheetId);
hf.renameSheet(sheetId, 'BetterName');
```

### Batch operations (performance)

Wrap multiple mutations in a batch to defer recalculation until the end:

```ts
const changes = hf.batch(() => {
  hf.setCellContents({ sheet: 0, col: 0, row: 0 }, '100');
  hf.setCellContents({ sheet: 0, col: 0, row: 1 }, '200');
  hf.addRows(0, [2, 1]);
});
// `changes` contains all cells that were recalculated
```

- Basic operations: https://hyperformula.handsontable.com/guide/basic-operations.html
- Batch operations: https://hyperformula.handsontable.com/guide/batch-operations.html
- Clipboard operations: https://hyperformula.handsontable.com/guide/clipboard-operations.html
- Undo-redo: https://hyperformula.handsontable.com/guide/undo-redo.html

---

## Named Expressions

Define reusable names for values or formulas:

```ts
hf.addNamedExpression('TAX_RATE', '0.21');
hf.addNamedExpression('TOTAL_REVENUE', '=SUM(Revenue!A:A)');

// Use in any cell formula
hf.setCellContents({ sheet: 0, col: 0, row: 0 }, '=1000 * TAX_RATE');
```

Named expressions can be global or scoped to a specific sheet.

Guide: https://hyperformula.handsontable.com/guide/named-expressions.html

---

## Custom Functions

Extend HyperFormula with your own functions by creating a `FunctionPlugin`:

```ts
import { HyperFormula, FunctionPlugin, FunctionArgumentType } from 'hyperformula';

class MyPlugin extends FunctionPlugin {
  greet(ast, state) {
    return this.runFunction(ast.args, state, this.metadata('GREET'), (name) => `Hello, ${name}!`);
  }
}

MyPlugin.implementedFunctions = {
  GREET: {
    method: 'greet',
    parameters: [{ argumentType: FunctionArgumentType.STRING }],
  },
};

const translations = { enGB: { GREET: 'GREET' }, enUS: { GREET: 'GREET' } };

// Register BEFORE creating an instance
HyperFormula.registerFunctionPlugin(MyPlugin, translations);

const hf = HyperFormula.buildFromArray([['World', '=GREET(A1)']], { licenseKey: 'gpl-v3' });
console.log(hf.getCellValue({ sheet: 0, col: 1, row: 0 })); // "Hello, World!"
```

Key steps: extend FunctionPlugin → define `implementedFunctions` with method + parameters →
add translations → register with `HyperFormula.registerFunctionPlugin()` → create instance.

The full guide covers argument validation, range arguments, returning arrays, error handling,
function aliases, and localized function names:
https://hyperformula.handsontable.com/guide/custom-functions.html

---

## Events

Subscribe to events on the HyperFormula instance:

```ts
hf.on('valuesUpdated', (changes) => {
  changes.forEach((c) => console.log(c.address, c.newValue));
});

hf.on('sheetAdded', (addedSheetName) => { /* ... */ });
hf.on('sheetRemoved', (removedSheetName, removedSheetData) => { /* ... */ });
hf.on('sheetRenamed', (oldName, newName) => { /* ... */ });
```

Full event list: https://hyperformula.handsontable.com/api/interfaces/listeners.html

---

## Key Configuration Options

Pass options as the second argument to any factory method:

```ts
const hf = HyperFormula.buildEmpty({
  licenseKey: 'gpl-v3',           // required — 'gpl-v3' for open source
  precisionRounding: 10,          // decimal rounding precision (default 10, was 14 before v3)
  functionArgSeparator: ',',      // separator between function arguments
  dateFormats: ['DD/MM/YYYY', 'DD-MM-YYYY'],
  nullDate: { year: 1900, month: 1, day: 1 },
  leapYear1900: false,            // Excel bug compat: treat 1900 as leap year
  maxRows: 40000,                 // max rows per sheet (default 40000)
  maxColumns: 18278,              // max columns per sheet (default 18278, = 'ZZZ')
});
```

Full options reference: https://hyperformula.handsontable.com/api/interfaces/configparams.html

---

## Compatibility & Limitations

HyperFormula aims for Excel/Google Sheets formula syntax compatibility but has known differences:

- ~400 built-in functions covering ~68% of Excel's function set
- Supported categories: math/trig, engineering, statistical, financial, logical, lookup/reference, text, date/time, information, array
- Runtime differences exist between HyperFormula and Excel/Sheets — consult the docs before assuming identical behavior

Key limitations:
- **Single workbook per instance** — no multi-workbook support
- No 3D references, dynamic arrays, async functions, structured references ("Tables"), or relative named expressions
- The IF function reports cycles for all branches, even unreachable ones
- Custom function result arrays don't auto-resize when dependencies change
- Node.js < 13 needs full ICU enabled for correct locale handling

- Built-in functions list: https://hyperformula.handsontable.com/guide/built-in-functions.html
- Excel compatibility: https://hyperformula.handsontable.com/guide/compatibility-with-microsoft-excel.html
- Google Sheets compatibility: https://hyperformula.handsontable.com/guide/compatibility-with-google-sheets.html
- Runtime differences: https://hyperformula.handsontable.com/guide/list-of-differences.html
- Known limitations: https://hyperformula.handsontable.com/guide/known-limitations.html

---

## Error Handling

Cell values can be errors (e.g., `#DIV/0!`, `#VALUE!`, `#REF!`). Always check before using a result:

```ts
import { CellError, ErrorType } from 'hyperformula';

const value = hf.getCellValue({ sheet: 0, col: 0, row: 0 });

if (value instanceof CellError) {
  console.log('Error type:', value.type);   // e.g., ErrorType.DIV_BY_ZERO
  console.log('Error message:', value.message);
} else {
  console.log('Value:', value);
}
```

You can also check what type a cell holds with `getCellValueDetailedType()`, which returns
`CellValueDetailedType` (NUMBER, STRING, BOOLEAN, ERROR, EMPTY).

- Types of errors: https://hyperformula.handsontable.com/guide/types-of-errors.html
- Types of values: https://hyperformula.handsontable.com/guide/types-of-values.html

---

## Cleanup / Lifecycle

In long-running applications (servers, SPAs), call `destroy()` when you're done with an instance to
free memory. HyperFormula maintains internal data structures (dependency graph, address mapping) that
won't be garbage-collected until `destroy()` is called.

```ts
hf.destroy();
```

After `destroy()`, the instance is unusable — create a new one if needed.

---

## Common Pitfalls

- **Forgetting `licenseKey`**: Every factory method requires it. Use `'gpl-v3'` for open source or your commercial key.
- **Not calling `destroy()`**: In servers or SPAs, leaking instances accumulates memory. Always clean up when done.
- **Node.js without full ICU**: String comparisons (used in MATCH, VLOOKUP, sorting) can silently produce wrong results on Node.js < 13 or builds without full ICU. Verify with `process.versions.icu`.
- **Assuming Excel parity**: ~68% of Excel functions are covered. Check the built-in functions list before assuming a function exists. Runtime differences can also produce different results for the same formula.
- **Registering custom functions after instance creation**: `registerFunctionPlugin()` must be called before `buildFromArray` / `buildFromSheets` / `buildEmpty`. Functions registered afterward won't be available.

---

## Version Awareness

- **Current:** 3.2.0 (February 2026)
- **v3.0 breaking changes:** i18n import paths changed, `precisionRounding` default changed (see Key Configuration Options above), moduleResolution changes for TypeScript projects.
- Migration guides cover every major version boundary — link users to the right one.

For the full organized directory of documentation links, read `references/docs-map.md` in this
skill's folder.

- Release notes: https://hyperformula.handsontable.com/guide/release-notes.html
- 2.x → 3.0 migration: https://hyperformula.handsontable.com/guide/migration-from-2.x-to-3.0.html
