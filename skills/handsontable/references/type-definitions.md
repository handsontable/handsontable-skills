# Handsontable TypeScript Type Definitions

> Last verified: July 2026 · signatures copied verbatim from the `handsontable@17.1.0` and
> `handsontable@18.0.0` npm packages (and `@handsontable/react-wrapper@17.1.0` / `@18.0.0`).

Curated subset of the public type surface — enough to write correctly-typed Handsontable code
without reading the shipped `.d.ts` files. Type names and import idioms are the **same in v17 and
v18**; version-specific differences are tagged inline.

Types are **bundled with the package** in both versions. Never install `@types/handsontable` — it
is a deprecated stub on npm.

---

## v17 vs v18: what changed in the type system

v18 rewrote the core from JavaScript (with hand-maintained `.d.ts` files) to native TypeScript
(with `.d.ts` generated from source). Consumer impact:

| | v17.x (JS core) | v18.x (TypeScript core) |
|---|---|---|
| Type definitions | Hand-maintained, 273 `.d.ts` files (~5.5k lines) | Generated from TS source, 779 `.d.ts` files (~44k lines) |
| `package.json` types field | `typings` | `types`, plus dual `.d.ts`/`.d.mts` per subpath (fixes ESM/CJS type resolution) |
| Minimum TypeScript | — | **5.1+** |
| `GridSettings` ↔ hooks | `GridSettings extends Events` (hooks inherited) | Hooks **inlined** in `GridSettings`; `Events = Required<Pick<GridSettings, HookKey>>` (derivation inverted, same names) |
| `CellValue` | `any` | `unknown` (stricter — narrow before use) |
| `CellProperties.instance` | `Core` | `Handsontable` (the `HotInstance` interface, v18+) |
| `handsontable/common` subpath | exists (undocumented) | **removed** — import from `handsontable` instead |
| Renderer/editor/validator params | loosely typed | strengthened to the real `CellProperties` |

No public types were renamed or removed — v18's surface is a superset of v17's.

## Import idioms

Works in **both** v17 and v18 (recommended):

```ts
// Named type imports from the root
import Handsontable from 'handsontable';
import type { GridSettings, ColumnSettings, CellProperties, CellChange, ChangeSource } from 'handsontable';

// Namespace style (equivalent; common in older codebases)
const settings: Handsontable.GridSettings = { licenseKey: 'non-commercial-and-evaluation' };
```

The `handsontable/settings` subpath also resolves these types in both versions, **but in v17 it is
types-only** (no runtime entry) — use it only with `import type`. In v18 it is a full barrel.

```ts
import type { GridSettings, CellProperties } from 'handsontable/settings'; // import type only in v17
```

Migrating v17 → v18: any `from 'handsontable/common'` import must become `from 'handsontable'`
(same type names; the subpath was removed).

---

## The settings hierarchy

Everything derives from one interface. Verbatim from v18 `settings.d.ts` (v17 is structurally
identical — deltas noted):

```ts
// The full options interface — every configuration option and (in v18) every hook.
// ~150 options; see the curated excerpt below.
export interface GridSettings { /* ... */ }          // v17: interface GridSettings extends Events

// Column settings inherit grid settings but overload `data` to be column-specific.
export interface ColumnSettings extends Omit<GridSettings, 'data'> {
    data?: string | number | ColumnDataGetterSetterFunction;
}

// Additional cell-specific meta data.
export interface CellMeta extends ColumnSettings {
    className?: string | string[];
    readOnly?: boolean;
    valid?: boolean;
    comment?: CommentObject;
    isSearchResult?: boolean;
    hidden?: boolean;
    skipRowOnPaste?: boolean;
}

// A rendered cell object with computed properties — what renderers/editors/validators receive.
export interface CellProperties extends CellMeta {
    row: number;
    col: number;
    instance: Handsontable;   // v17: instance: Core
    visualRow: number;
    visualCol: number;
    prop: string | number;
}
```

Practical consequences:

- Any option valid on the grid is valid per-column (`columns: [...]`) and per-cell (`cells`/`cell`)
  because `ColumnSettings`/`CellMeta` inherit `GridSettings`.
- Type custom renderers/editors/validators against `CellProperties` — it carries the full merged
  config plus cell coordinates and the instance.
- v17 quirk: `handsontable/settings` exports its own `Omit<T, K>` helper that shadows TypeScript's
  built-in if imported carelessly. Don't import `Omit` from Handsontable.

## Core data types

Verbatim from v18 `settings.d.ts` (v17 is identical except the `unknown`s are `any`:
`CellValue = any`, `RowObject { [prop: string]: any }`):

```ts
// A row object — one of the two data shapes (the other is an array of values).
export interface RowObject {
    [prop: string]: unknown;
}

// A cell value. v18: unknown (narrow before use). v17: any.
export type CellValue = unknown;

// A single row of source data.
export type SourceRowData = RowObject | CellValue[];

// Options for the select cell type's editor.
export interface SelectOptionsObject {
    [prop: string]: string;
}

// Custom getter/setter used as `data` in ColumnSettings.
export interface ColumnDataGetterSetterFunction {
    (row: RowObject | CellValue[]): CellValue;
    (row: RowObject | CellValue[], value: CellValue): void;
}

// A cell change: [row, column, prevValue, nextValue] — the payload of afterChange etc.
export type CellChange = [number, string | number | ColumnDataGetterSetterFunction, CellValue, CellValue];

// Why a change happened — always check this in afterChange to skip 'loadData'.
export type ChangeSource = 'auto' | 'edit' | 'loadData' | 'updateData' | 'populateFromArray' |
    'spliceCol' | 'spliceRow' | 'timeValidate' | 'dateValidate' | 'validateCells' |
    'Autofill.fill' | 'ContextMenu.clearColumn' | 'ContextMenu.columnLeft' | 'ContextMenu.columnRight' |
    'ContextMenu.removeColumn' | 'ContextMenu.removeRow' | 'ContextMenu.rowAbove' | 'ContextMenu.rowBelow' |
    'CopyPaste.paste' | 'CopyPaste.cut' | 'UndoRedo.redo' | 'UndoRedo.undo' |
    'ColumnSummary.set' | 'ColumnSummary.reset' | 'DataProvider.revert';   // last one v17.1+
```

## GridSettings — most-used options (typed)

Curated excerpt, verbatim from v18 `core/settings.d.ts`. The full interface has ~150 options —
this is the working set:

```ts
export interface GridSettings {
    // Data & shape
    data?: unknown[][] | object[];
    columns?: ColumnSettings[] | ((column: number) => ColumnSettings);
    cells?: (row: number, column: number, prop: string | number) => object;
    cell?: object[];
    colHeaders?: boolean | string[] | ((column: number) => string);
    rowHeaders?: boolean | string[] | ((row: number) => string);
    width?: number | string | (() => number | string);
    height?: number | string | (() => number | string);
    minSpareRows?: number;
    stretchH?: 'none' | 'all' | 'last';

    // Cell behavior
    type?: string;                       // narrow with the CellType union below
    source?: unknown[] | ((query: string, callback: (items: unknown[]) => void) => void);
    readOnly?: boolean;
    allowEmpty?: boolean;
    allowInvalid?: boolean;
    wordWrap?: boolean;
    placeholder?: string | number;
    className?: string | string[];
    locale?: string;
    numericFormat?: object;              // Intl.NumberFormat options in v18
    dateFormat?: Intl.DateTimeFormatOptions;  // v18; string pattern in v17
    checkedTemplate?: unknown;
    uncheckedTemplate?: unknown;
    selectOptions?: string[] | number[] | object[] | Record<string, string> |
        ((visualRow: number, visualColumn: number, prop: string | number) => string[] | Record<string, string>);

    // Cell functions
    renderer?: string | ((hotInstance: HotInstance, td: HTMLTableCellElement, row: number, col: number,
        prop: string | number, value: CellValue, cellProperties: CellProperties) => HTMLTableCellElement | void);
    editor?: string | (new (...args: unknown[]) => unknown) | boolean;
    validator?: string | RegExp | ((value: unknown, callback: (valid: boolean) => void) => void);

    // Selection & navigation
    selectionMode?: 'single' | 'range' | 'multiple';
    autoWrapCol?: boolean;
    autoWrapRow?: boolean;

    // Freezing
    fixedColumnsStart?: number;
    fixedRowsTop?: number;
    fixedRowsBottom?: number;

    // Plugins (boolean enables defaults; object configures)
    columnSorting?: boolean | object;
    multiColumnSorting?: boolean | object;
    filters?: boolean | object;
    dropdownMenu?: boolean | object | string[];
    contextMenu?: boolean | object | string[];
    comments?: boolean | object | object[];
    customBorders?: boolean | object[];
    mergeCells?: boolean | object | object[];
    manualColumnMove?: boolean | number[];
    manualColumnResize?: boolean | number[];
    manualRowMove?: boolean | number[];
    manualRowResize?: boolean | number[];
    hiddenColumns?: boolean | object;
    hiddenRows?: boolean | object;
    nestedHeaders?: NestedHeader[][];
    nestedRows?: boolean;
    trimRows?: boolean | number[];
    search?: boolean | object;
    copyPaste?: boolean | object;
    undo?: boolean;
    pagination?: boolean | object;       // v17+
    dataProvider?: DataProviderConfig;   // v17.1+
    formulas?: boolean | {
        engine: unknown;                 // HyperFormula class or instance
        sheetName?: string;
        [key: string]: unknown;
    };

    // Theming & misc
    themeName?: string;
    licenseKey?: string;
    sanitizer?: (html: string, ...args: any[]) => string;   // v18+ (DOMPurify no longer bundled)
}
```

## Hooks (Events)

Hooks are optional callback properties on `GridSettings` — pass them in the config object (or as
props on `<HotTable>`). Both versions also export the map of all hooks as `Events`. The ~20 most
used, verbatim from v18:

```ts
afterInit?: () => void;
afterChange?: (changes: CellChange[] | null, source: ChangeSource) => void;
beforeChange?: (changes: (CellChange | null)[], source: ChangeSource) => void | boolean;  // return false to cancel
afterSetDataAtCell?: (changes: CellChange[], source?: ChangeSource) => void;
afterSelection?: (row: number, column: number, row2: number, column2: number,
    preventScrolling: { value: boolean }, selectionLayerLevel: number) => void;
afterSelectionEnd?: (row: number, column: number, row2: number, column2: number, selectionLayerLevel: number) => void;
afterDeselect?: () => void;
afterOnCellMouseDown?: (event: MouseEvent, coords: CellCoords, TD: HTMLTableCellElement) => void;
beforeKeyDown?: (event: KeyboardEvent) => void;
afterCreateRow?: (index: number, amount: number, source?: ChangeSource) => void;
afterRemoveRow?: (index: number, amount: number, physicalRows: number[], source?: ChangeSource) => void;
afterCreateCol?: (index: number, amount: number, source?: ChangeSource) => void;
afterRemoveCol?: (index: number, amount: number, physicalColumns: number[], source?: ChangeSource) => void;
afterLoadData?: (sourceData: unknown[], initialLoad: boolean, source: ChangeSource | undefined) => void;
beforeValidate?: (value: CellValue, row: number, prop: string | number, source?: ChangeSource) => void;
afterValidate?: (isValid: boolean, value: CellValue, row: number, prop: string | number, source: ChangeSource) => void | boolean;
afterColumnSort?: (currentSortConfig: ColumnSortingConfig[], destinationSortConfigs: ColumnSortingConfig[]) => void;
afterFilter?: (conditionsStack: ColumnConditions[]) => void;
afterFormulasValuesUpdate?: (changes: unknown[]) => void;
beforePaste?: (data: CellValue[][], coords: RangeType[]) => void | boolean;  // return false to cancel
afterPaste?: (data: CellValue[][], coords: RangeType[]) => void;
afterUndo?: (action: UndoRedoAction) => void;
afterRender?: (isForced: boolean) => void;
afterDestroy?: () => void;
```

There are ~278 hooks total — same naming pattern (`before*` cancellable by returning `false`,
`after*` notification-only). Full list: https://handsontable.com/docs/react-data-grid/api/hooks/

## Registry string unions

`type`, `editor`, `renderer`, and `validator` accept these names (each union ends in `| string`,
so custom registered names are also valid). Literal values verified in the v18 package:

```ts
export type CellType = 'autocomplete' | 'checkbox' | 'date' | 'dropdown' | 'handsontable' |
    'intl-date' | 'intl-time' | 'numeric' | 'password' | 'select' | 'text' | 'time' | string;
// 'multiselect' (v17+) is also a registered cell type, though absent from the v18.0.0 union literal.

export type EditorType = 'autocomplete' | 'base' | 'checkbox' | 'date' | 'dropdown' | 'handsontable' |
    'intl-date' | 'intl-time' | 'multiselect' | 'numeric' | 'password' | 'select' | 'text' | 'time' | string;

export type RendererType = 'autocomplete' | 'base' | 'checkbox' | 'date' | 'dropdown' | 'handsontable' |
    'html' | 'intl-date' | 'intl-time' | 'multiselect' | 'numeric' | 'password' | 'select' | 'text' | 'time' | string;

export type ValidatorType = 'autocomplete' | 'date' | 'dropdown' | 'intl-date' | 'intl-time' |
    'multiselect' | 'numeric' | 'time' | string;
```

## Instance & coordinate types

```ts
// v18+: the typed Core API surface (getData, selectCell, getPlugin, batch, ...).
import type { HotInstance } from 'handsontable';
// v17: the equivalent is the default export's class type — use `Handsontable` itself:
import Handsontable from 'handsontable';
let hot: Handsontable;   // works in both versions

// Coordinates (classes, both versions)
import { CellCoords, CellRange } from 'handsontable';

// Selection range shape used by copy/paste hooks
export interface RangeType {
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
}
```

Key `HotInstance` signatures (v18, verbatim — v17's `Core` is equivalent for these):

```ts
getSettings(): GridSettings;
updateSettings(settings: Partial<GridSettings>, init?: boolean): void;
addHook<K extends keyof Events>(key: K, callback: Events[K] | Array<Events[K]>, orderIndex?: number): void;
selectCell(row: number, column: number, endRow?: number, endCol?: number, scrollToCell?: boolean, changeListener?: boolean): boolean;
getSelected(): number[][] | undefined;
getSelectedRange(): CellRange[] | undefined;
```

## React wrapper types (`@handsontable/react-wrapper`)

`<HotTable>` props **are** `GridSettings` — with `renderer`/`editor` swapped for React component
types (the native function/class forms move to `hotRenderer`/`hotEditor`). Verbatim from
`types.d.ts` (identical in 17.1.0 and 18.0.0):

```ts
export interface HotTableProps extends ReplaceRenderersEditors<Handsontable.GridSettings> {
    id?: string;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
}

export interface HotColumnProps extends ReplaceRenderersEditors<Handsontable.ColumnSettings> {
    children?: ReactNode;
}

// What you get from a ref on <HotTable>
export interface HotTableRef {
    hotElementRef: HTMLElement;
    hotInstance: Handsontable | null;
}

// Props your component-based renderer receives
export interface HotRendererProps {
    instance: Handsontable.Core;
    TD: HTMLTableCellElement;
    row: number;
    col: number;
    prop: string | number;
    value: any;
    cellProperties: Handsontable.CellProperties;
}
```

Typed usage:

```tsx
import { useRef } from 'react';
import { HotTable } from '@handsontable/react-wrapper';
import type { HotTableRef } from '@handsontable/react-wrapper';
import type { CellChange, ChangeSource } from 'handsontable';

const MyGrid = () => {
  const hotRef = useRef<HotTableRef>(null);

  const onAfterChange = (changes: CellChange[] | null, source: ChangeSource) => {
    if (source === 'loadData' || !changes) return;
    changes.forEach(([row, prop, oldVal, newVal]) => console.log(row, prop, oldVal, newVal));
  };

  return (
    <HotTable
      ref={hotRef}
      data={[['A1', 'B1']]}
      afterChange={onAfterChange}
      height="auto"
      licenseKey="non-commercial-and-evaluation"
    />
  );
};
```

## Reading the shipped definitions

When a signature isn't covered here, read the package's own `.d.ts` (version-pinned, always
accurate for that version):

- v18 `GridSettings` + all hooks: https://cdn.jsdelivr.net/npm/handsontable@18.0.0/core/settings.d.ts
- v18 data types & hierarchy: https://cdn.jsdelivr.net/npm/handsontable@18.0.0/settings.d.ts
- v17 equivalents: https://cdn.jsdelivr.net/npm/handsontable@17.1.0/settings.d.ts and https://cdn.jsdelivr.net/npm/handsontable@17.1.0/common.d.ts
- v18 TypeScript source (types generated from here): https://github.com/handsontable/handsontable/blob/develop/handsontable/src/core/settings.ts

Or locally: `node_modules/handsontable/*.d.ts` in any project with Handsontable installed.
