# API Quick Reference

Runnable examples for the most-used HyperFormula APIs. Authoritative docs:
- Basic operations: https://hyperformula.handsontable.com/guide/basic-operations.html
- Batch operations: https://hyperformula.handsontable.com/guide/batch-operations.html
- Named expressions: https://hyperformula.handsontable.com/guide/named-expressions.html
- Custom functions: https://hyperformula.handsontable.com/guide/custom-functions.html
- Clipboard operations: https://hyperformula.handsontable.com/guide/clipboard-operations.html
- Undo-redo: https://hyperformula.handsontable.com/guide/undo-redo.html
- Sorting data: https://hyperformula.handsontable.com/guide/sorting-data.html
- HyperFormula class (all methods): https://hyperformula.handsontable.com/api/classes/hyperformula.html
- Listeners (all events): https://hyperformula.handsontable.com/api/interfaces/listeners.html

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

Extend HyperFormula via `FunctionPlugin`. Register **before** creating any instance.

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
    // isVolatile: true,  // set for RAND/NOW-like behavior (recalc on every change)
  },
};

const translations = { enGB: { GREET: 'GREET' }, enUS: { GREET: 'GREET' } };

// PITFALL: this MUST run before buildFromArray / buildFromSheets / buildEmpty.
HyperFormula.registerFunctionPlugin(MyPlugin, translations);

const hf = HyperFormula.buildFromArray(
  [['World', '=GREET(A1)']],
  { licenseKey: 'gpl-v3' }
);
console.log(hf.getCellValue({ sheet: 0, col: 1, row: 0 })); // "Hello, World!"
```

The full guide covers argument validation, range arguments, returning arrays, error handling, and localized names: https://hyperformula.handsontable.com/guide/custom-functions.html

## Events

Subscribe via `.on()` on the instance. Full list: https://hyperformula.handsontable.com/api/interfaces/listeners.html

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
