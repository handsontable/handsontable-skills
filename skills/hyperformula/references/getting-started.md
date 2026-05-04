# Getting Started

Install, create an instance, read/write cells. Authoritative docs:
- Client-side install: https://hyperformula.handsontable.com/guide/client-side-installation.html
- Server-side install: https://hyperformula.handsontable.com/guide/server-side-installation.html
- Basic usage: https://hyperformula.handsontable.com/guide/basic-usage.html

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
