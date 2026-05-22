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
