# handsontable skill

_Flattened single-doc build of `skills/handsontable/` for RAG ingestion. Source of truth is the skill directory._

---

## skills/handsontable/SKILL.md

---
name: handsontable
description: >
  Use this skill whenever the user asks about Handsontable — a JavaScript data grid component with
  spreadsheet-like UX. Triggers include: mentions of "handsontable", "HotTable", "data grid",
  "@handsontable/react-wrapper", spreadsheet component in React/Angular/Vue, HyperFormula formulas
  inside a grid, cell types (dropdown, checkbox, date, numeric) in a grid context, or questions
  about Handsontable theming, plugins, hooks, configuration options, or column/row features. Also
  trigger when the user wants to add an editable spreadsheet-like table to a web app, or asks about
  copy/paste, sorting, filtering, frozen rows/columns, merged cells, or context menus in a grid.
  This skill covers Handsontable used with any framework (React, Angular, Vue 3, vanilla JS) and
  HyperFormula as the Formulas plugin engine inside Handsontable. Do NOT use this skill for
  headless/standalone HyperFormula usage without Handsontable — that is covered by the separate
  "hyperformula" skill.
---

# Handsontable

Handsontable is a JavaScript **data grid component** (not a full spreadsheet application) that
brings spreadsheet-like UX to web apps: cell editing, copy/paste, sorting, filtering, formulas,
keyboard navigation, context menus, merged cells, frozen rows/columns, conditional formatting, data
validation, pagination, and 400+ built-in formulas via HyperFormula.

- **Latest version:** 18.0.0 (June 2026)
- **Frameworks:** Vanilla JS/TS, React (`@handsontable/react-wrapper`), Angular (`@handsontable/angular-wrapper`), Vue 3 (`@handsontable/vue3`)
- **React wrapper requires:** React 18+
- **License:** Dual — free for non-commercial use (`licenseKey: 'non-commercial-and-evaluation'`), paid for commercial. Per-developer annual license, offline validation (no server connection). Tiers: Hobby (free, non-commercial), Trial (free 45 days), Standard (from $999/yr), Priority (from $1,299/yr), Enterprise (custom). See [Pricing](https://handsontable.com/pricing).

Always check `references/docs-map.md` (in this skill folder) for the full organized link directory
when you need to point the user to specific documentation or need to look up more info.

This skill folder also ships topic references with verified, copy-pasteable patterns — read the
relevant one before writing code in its area:

- `references/custom-cells.md` — custom renderers, editors, validators, and full custom cell
  types (React component editors, `useHotEditor`, the v17+ factory API, conditional formatting).
- `references/data-workflows.md` — saving to a backend, syncing grids, dependent dropdowns,
  bulk validation with an error summary, CSV/Excel import, CSV/XLSX/PDF export, undo/redo UI.
- `references/interaction-plugins.md` — custom context-menu items, programmatic Filters and
  Search APIs, keyboard shortcuts, ColumnSummary, persisting column layout, and the
  EmptyDataState / Loading / Dialog plugins.
- `references/type-definitions.md` — the public TypeScript type surface (v17 and v18).

### What this skill does NOT cover

- **Standalone HyperFormula** (headless formula engine without a grid UI) — use the "hyperformula" skill instead.
- **Other data grid libraries** (AG Grid, TanStack Table, etc.).
- **Full spreadsheet applications** — Handsontable is a component you embed, not a standalone app like Google Sheets.

---

## React Quick Start (Recommended)

### Install

```bash
npm install handsontable @handsontable/react-wrapper
```

### Minimal working example

```jsx
import { HotTable } from '@handsontable/react-wrapper';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';

registerAllModules();

const MyGrid = () => (
  <HotTable
    themeName="ht-theme-main"
    data={[
      ['', 'Tesla', 'Volvo', 'Toyota', 'Ford'],
      ['2019', 10, 11, 12, 13],
      ['2020', 20, 11, 14, 13],
      ['2021', 30, 15, 12, 13],
    ]}
    colHeaders={true}
    rowHeaders={true}
    height="auto"
    autoWrapRow={true}
    autoWrapCol={true}
    licenseKey="non-commercial-and-evaluation"
  />
);

export default MyGrid;
```

Key points:
- `registerAllModules()` registers every built-in plugin. To reduce bundle size, import only what
  you need — see [Modules guide](https://handsontable.com/docs/react-data-grid/modules/).
- `height` is required (or the grid won't render). Use `"auto"`, a pixel number, or a CSS string.
- All Handsontable configuration options are passed as props on `<HotTable>`.
- Full installation guide: https://handsontable.com/docs/react-data-grid/installation/

---

## Vanilla JS Quick Start

### Install

```bash
npm install handsontable
```

### CDN (jsDelivr)

```html
<script src="https://cdn.jsdelivr.net/npm/handsontable/dist/handsontable.full.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/handsontable/styles/handsontable.min.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/handsontable/styles/ht-theme-main.min.css" />
```

To pin a specific version, add `@18.0` after `handsontable` in the URL (e.g.,
`handsontable@18.0/dist/handsontable.full.min.js`).

### Minimal working example

```js
import Handsontable from 'handsontable';
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';

const container = document.getElementById('grid');

new Handsontable(container, {
  data: [
    ['', 'Tesla', 'Volvo', 'Toyota', 'Ford'],
    ['2019', 10, 11, 12, 13],
    ['2020', 20, 11, 14, 13],
    ['2021', 30, 15, 12, 13],
  ],
  colHeaders: true,
  rowHeaders: true,
  height: 'auto',
  themeName: 'ht-theme-main',
  autoWrapRow: true,
  autoWrapCol: true,
  licenseKey: 'non-commercial-and-evaluation',
});
```

Full JS docs: https://handsontable.com/docs/javascript-data-grid/installation/

---

## Other Frameworks

### Angular (v16–22)

```bash
npm install handsontable @handsontable/angular-wrapper
```

The Angular wrapper supports Angular 16–22 as of Handsontable v18. If you're on an older Angular version, upgrade Angular first.

Docs: https://handsontable.com/docs/angular-data-grid/installation/

### Vue 3

```bash
npm install handsontable @handsontable/vue3
```

Docs: https://handsontable.com/docs/vue-data-grid/installation/

All framework wrappers share the same version number as the core library and expose the same
configuration options. The React examples in this skill translate directly — just use the
framework's component syntax. Note: Vue 2 (`@handsontable/vue`) is deprecated — use Vue 3.

---

## Theming: Light / Dark / Auto

Handsontable v15+ includes a built-in theme system. Three themes ship out of the box: **main**
(default, spreadsheet-like), **horizon** (clean, analytics-focused), **classic** (legacy
replacement).

### CSS file approach (simplest)

Import the base stylesheet plus a theme:

```js
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
```

Then set the theme on the grid:

```jsx
<HotTable themeName="ht-theme-main" /* ... */ />
```

**Dark mode:**
- System preference (auto): `themeName="ht-theme-main-dark-auto"`
- Forced dark: `themeName="ht-theme-main-dark"`

Replace `main` with `horizon` or `classic` for other themes.

### Theme API approach (runtime switching)

```js
import { mainTheme, registerTheme } from 'handsontable/themes';

const theme = registerTheme(mainTheme)
  .setColorScheme('auto')       // 'light' | 'dark' | 'auto'
  .setDensityType('comfortable'); // 'compact' | 'default' | 'comfortable'
```

Then pass it as a prop:

```jsx
<HotTable theme={theme} /* ... */ />
```

### CDN theme files

```html
<!-- Theme CSS (includes light and dark mode support) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/handsontable/styles/ht-theme-main.min.css" />
```

In v17, dark mode is controlled via `themeName` or the Theme API — there are no separate `-dark` or
`-dark-auto` CSS files. Load the base theme CSS above and set the mode at runtime.

For CSS variable customization, the Theme Builder, Figma design system, and 200+ design tokens, see:
- [Themes guide](https://handsontable.com/docs/react-data-grid/themes/)
- [Theme customization](https://handsontable.com/docs/react-data-grid/theme-customization/)
- [Theme Builder tool](https://handsontable.com/theme-builder)

---

## Common Configuration Patterns

All options below are passed as props on `<HotTable>` (React) or in the config object (vanilla JS).
For the full options reference: https://handsontable.com/docs/react-data-grid/api/options/

### Data binding

```jsx
// Array of arrays
data={[['A1', 'B1'], ['A2', 'B2']]}

// Array of objects
data={[{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]}
columns={[{ data: 'id' }, { data: 'name' }]}
```

Docs: https://handsontable.com/docs/react-data-grid/binding-to-data/

### Column & row headers

```jsx
colHeaders={['ID', 'Name', 'Price']}  // custom labels, or {true} for A, B, C...
rowHeaders={true}                      // 1, 2, 3... or pass an array
```

### Column types (cell types)

Set via the `columns` array or `cells` function. Built-in types:

- `text` (default), `numeric`, `date`, `time`, `checkbox`, `select`, `dropdown`,
  `autocomplete`, `password`, `handsontable` (nested grid), `multiselect` (v17+),
  `intl-date` (v18+), `intl-time` (v18+)

> v18 **reimplemented** the `date` and `time` cell types natively — moment.js and Pikaday were
> removed, but the `date` and `time` type names still work and are interchangeable with the new
> `intl-date` / `intl-time` names (same implementation). In v18+, all four take object-based
> format options (`Intl.DateTimeFormat` shape) and require ISO 8601 source data; the legacy
> string `dateFormat`/`timeFormat` and `datePickerConfig` options are ignored with a console
> warning, and `correctFormat` was removed. Date/time cells no longer auto-correct input —
> normalize or correct entered values with `valueParser` and/or `valueSetter`.
> `datePickerConfig` has no replacement; the editor is the browser native date input.

```jsx
columns={[
  { data: 'name', type: 'text' },
  // Numeric formatting in v18+ uses Intl.NumberFormat options — the old
  // `numericFormat.pattern` / `culture` (numbro syntax) were removed.
  {
    data: 'price',
    type: 'numeric',
    locale: 'en-US',
    numericFormat: { style: 'currency', currency: 'USD', minimumFractionDigits: 2 },
  },
  { data: 'active', type: 'checkbox' },
  { data: 'category', type: 'dropdown', source: ['A', 'B', 'C'] },
  // v18+ intl-date: ISO 8601 in source data, Intl.DateTimeFormat options for display.
  {
    data: 'startDate',
    type: 'intl-date',
    locale: 'en-GB',
    dateFormat: { year: 'numeric', month: '2-digit', day: '2-digit' },
  },
]}
```

Full cell types reference: https://handsontable.com/docs/react-data-grid/cell-type/

### Sorting & filtering

```jsx
columnSorting={true}        // single-column sort
// or
multiColumnSorting={true}   // multi-column sort

filters={true}              // enable column filters
dropdownMenu={true}         // column header menu with filter UI
```

### Frozen rows/columns

```jsx
fixedRowsTop={1}
fixedRowsBottom={1}
fixedColumnsStart={2}
```

### Other common options

```jsx
readOnly={true}                 // entire grid read-only (or per-cell/column)
contextMenu={true}              // right-click menu
mergeCells={[{ row: 0, col: 0, rowspan: 2, colspan: 2 }]}
manualColumnResize={true}
manualRowResize={true}
stretchH="all"                  // stretch columns to fill width: 'none' | 'last' | 'all'
```

### Per-column config with HotColumn (React)

```jsx
import { HotTable, HotColumn } from '@handsontable/react-wrapper';

<HotTable data={data} licenseKey="non-commercial-and-evaluation">
  <HotColumn title="Name" data="name" />
  <HotColumn title="Active" data="active" type="checkbox" />
</HotTable>
```

Docs: https://handsontable.com/docs/react-data-grid/hot-column/

> `@handsontable/react-wrapper@18.x` peer-requires `handsontable@^18`. On aligned versions, removing a `<HotColumn>` correctly removes the column — a v17-era phantom-column bug was fixed in 18.0 ([#12596](https://github.com/handsontable/handsontable/issues/12596)).

---

## HyperFormula Integration (Formulas Plugin)

HyperFormula powers Handsontable's Formulas plugin, providing 400+ spreadsheet functions (SUM,
AVERAGE, IF, VLOOKUP, etc.). This section covers using HyperFormula **inside** Handsontable only.

### Install

```bash
npm install hyperformula
```

> **v18 change:** HyperFormula is no longer bundled with Handsontable — it must be installed
> separately (verified in the `handsontable@18.0.0` npm package: `dependencies: {}`) and passed
> to the Formulas plugin as shown below.

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/hyperformula/dist/hyperformula.full.min.js"></script>
```

### Simple setup (auto-created instance)

Pass the `HyperFormula` class directly — Handsontable creates an instance automatically:

```jsx
import { HyperFormula } from 'hyperformula';

<HotTable
  data={[
    ['10', '20', '=SUM(A1:B1)'],
    ['30', '40', '=SUM(A2:B2)'],
  ]}
  formulas={{ engine: HyperFormula }}
  colHeaders={true}
  licenseKey="non-commercial-and-evaluation"
/>
```

### External instance (for multi-sheet or shared engine)

Create a HyperFormula instance with the `'internal-use-in-handsontable'` license key:

```jsx
import { HyperFormula } from 'hyperformula';

const hfInstance = HyperFormula.buildEmpty({
  licenseKey: 'internal-use-in-handsontable',
});

// Sheet 1
<HotTable
  data={data1}
  formulas={{ engine: hfInstance, sheetName: 'Sheet1' }}
  licenseKey="non-commercial-and-evaluation"
/>

// Sheet 2 — shares the same engine, enabling cross-sheet references
<HotTable
  data={data2}
  formulas={{ engine: hfInstance, sheetName: 'Sheet2' }}
  licenseKey="non-commercial-and-evaluation"
/>
```

Cross-sheet formula example: `=SUM(Sheet1!A:A)`

### Named expressions

```jsx
formulas={{
  engine: HyperFormula,
  namedExpressions: [
    { name: 'TAX_RATE', expression: 0.21 },
  ],
}}
```

Use in cells: `=A1 * TAX_RATE`

### Listening for formula changes

```jsx
<HotTable
  formulas={{ engine: HyperFormula }}
  afterFormulasValuesUpdate={(changes) => {
    changes.forEach((c) => console.log(c.address, c.newValue));
  }}
/>
```

### Known limitations

- Formulas don't work with nested object data.
- Moving rows/columns with formulas requires the ManualRowMove / ManualColumnMove plugins (not IndexMapper).
- `getSourceData()` operates on physical indexes; formulas use visual indexes.

Full guide: https://handsontable.com/docs/react-data-grid/formula-calculation/
HyperFormula functions list: https://hyperformula.handsontable.com/docs/guide/built-in-functions.html
HyperFormula version compatibility table: https://handsontable.com/docs/react-data-grid/formula-calculation/#hyperformula-version-support

---

## Server-side data with DataProvider (v17.1+, unchanged in v18)

The **DataProvider plugin** (new in v17.1) wires the grid up to a remote data source so rows are fetched, sorted, and mutated server-side instead of held in memory. Use it for datasets too large to load up front, or when the source of truth lives in a backend.

The `dataProvider` option is an object with five required keys: a row-id resolver, a paginated `fetchRows` callback, and three mutation callbacks. For a read-only grid, stub the mutation callbacks with `async () => {}` — they must still be present.

```jsx
<HotTable
  colHeaders={['ID', 'Name', 'Email']}
  pagination={{ pageSize: 25 }}
  columnSorting={true}
  emptyDataState={true}
  height={360}
  licenseKey="non-commercial-and-evaluation"
  dataProvider={{
    // Required: how to extract a stable id from each row
    rowId: 'id',

    // Required: paginated fetch. `sort` and `filters` are null when not active.
    // Second arg carries an AbortSignal — pass it to fetch() so the plugin
    // can cancel superseded requests when the user pages/sorts quickly.
    async fetchRows({ page, pageSize, sort, filters }, { signal }) {
      const params = new URLSearchParams({ page, pageSize });
      if (sort) {
        // sort = { prop: string, order: 'asc' | 'desc' }
        params.set('sortBy', sort.prop);
        params.set('order', sort.order);
      }
      if (filters) {
        params.set('filters', JSON.stringify(filters));
      }
      const res = await fetch(`/api/users?${params}`, { signal });
      const { rows, totalRows } = await res.json();
      return { rows, totalRows };
    },

    // Required. Stub with async () => {} if your grid is read-only.
    // The plugin auto-refetches the current page after each callback resolves.
    // See the plugin API ref for the exact payload shapes.
    onRowsCreate: async () => {},
    onRowsUpdate: async () => {},
    onRowsRemove: async () => {},
  }}
/>
```

### Loading and error UI

The plugin fires three hooks you can wire up as `<HotTable>` props for loading indicators and error surfaces:

- `beforeDataProviderFetch(params)` — fires before each fetch. `params.skipLoading` is set when the plugin wants to suppress your loading indicator (e.g., during a quick refetch).
- `afterDataProviderFetch(result)` — fires after a successful fetch.
- `afterDataProviderFetchError(error)` — fires when `fetchRows` throws or returns a rejected promise.

### Companion options

The plugin is built to pair with `pagination` (paginates server-side), `columnSorting` (single-column server-side sort), and `emptyDataState` (loading + empty state UI). Enable all three when you use DataProvider.

### Authoritative references

- Guide: https://handsontable.com/docs/react-data-grid/server-side-data-fetching/
- Recipe (REST API): https://handsontable.com/docs/react-data-grid/recipes/data-management/load-data-rest-api/
- Plugin API: https://handsontable.com/docs/react-data-grid/api/data-provider/

## Layout & UI slots (v18+)

v18 introduced a new layout system that renders plugin UI elements into orderable wrapper slots around the grid. The `layout` option lets you control the order of elements in the `top` and `bottom` slots — for example, deciding whether the pagination bar shows above or below the column summary.

```jsx
<HotTable
  pagination={{ pageSize: 25 }}
  columnSummary={/* ... */}
  layout={{
    // Elements you list are placed first in that order; anything else
    // renders after them in the default weight order.
    bottom: ['pagination', 'summary'],
  }}
  licenseKey="non-commercial-and-evaluation"
/>
```

Notes (from the v18 docs):

- `layout` accepts an object with optional `top` and `bottom` arrays of element key strings.
- The grid itself and the overlays layer (modal/dialog surfaces) are **not** orderable through this option.
- The license notification always renders last in the `bottom` slot regardless of your ordering.

Full options reference: https://handsontable.com/docs/react-data-grid/api/options/#layout

---

## Notifications (v17.1+, unchanged in v18)

The **Notification plugin** (new in v17.1) shows non-blocking toast notifications anchored to the grid — useful for confirming saves, surfacing validation errors, or signaling background sync state. Enable with `notifications: true` and trigger via `hot.getPlugin('notifications').showMessage(...)`. See the plugin guide for placement, severity levels, and auto-dismiss timing: https://handsontable.com/docs/react-data-grid/notification/

---

## Events & Hooks

Handsontable hooks are passed as props on `<HotTable>`:

```jsx
<HotTable
  afterChange={(changes, source) => {
    if (source !== 'loadData') {
      console.log('Cell changed:', changes);
    }
  }}
  beforeChange={(changes, source) => {
    // Return false to cancel the edit
  }}
  afterSelection={(row, col, row2, col2) => {
    console.log('Selected:', row, col, 'to', row2, col2);
  }}
/>
```

There are 100+ hooks available. Full reference: https://handsontable.com/docs/react-data-grid/api/hooks/

Guide: https://handsontable.com/docs/react-data-grid/events-and-hooks/

---

## Accessing the Instance (Ref)

Use a ref to call Handsontable's core methods:

```jsx
import { useRef } from 'react';

const MyGrid = () => {
  const hotRef = useRef(null);

  const handleClick = () => {
    const hot = hotRef.current?.hotInstance;
    if (hot) {
      console.log(hot.getData());       // get all data
      hot.selectCell(0, 0);             // select a cell
    }
  };

  return (
    <>
      <HotTable ref={hotRef} /* ...options */ />
      <button onClick={handleClick}>Get Data</button>
    </>
  );
};
```

Core API reference: https://handsontable.com/docs/react-data-grid/api/core/

---

## TypeScript & Type Definitions

Types are bundled with the package in every version — never install `@types/handsontable` (a
deprecated stub). The universal import idiom (works in v17 and v18):

```ts
import Handsontable from 'handsontable';
import type { GridSettings, ColumnSettings, CellProperties, CellChange, ChangeSource } from 'handsontable';
```

Everything derives from `GridSettings` (the full options interface): `ColumnSettings` →
`CellMeta` → `CellProperties`, and React's `HotTableProps` spreads `GridSettings` directly.
v18 rewrote the core in TypeScript (native types, TS 5.1+, stricter `CellValue: unknown`); v17
and earlier used hand-maintained `.d.ts` files with the same public names. The
`handsontable/common` subpath was removed in v18 — import from `handsontable` instead.

**For the curated type reference — settings hierarchy, typed options excerpt, hook signatures,
registry unions, React wrapper types, and v17↔v18 differences — read
`references/type-definitions.md` in this skill's folder.**

---

## Performance & Large Datasets

Handsontable virtualizes rendering automatically — only visible rows and columns are in the DOM, so
grids with 10k–100k+ rows perform well out of the box. For bulk programmatic updates, wrap mutations
in `batch()` to defer re-rendering until all changes are applied:

```jsx
hotRef.current.hotInstance.batch(() => {
  // set many cells, add rows, etc.
});
```

For further tuning (disabling auto-size, reducing plugin overhead), see:
- [Performance guide](https://handsontable.com/docs/react-data-grid/performance/)
- [Batch operations](https://handsontable.com/docs/react-data-grid/batch-operations/)
- [Bundle size optimization](https://handsontable.com/docs/react-data-grid/bundle-size/)

---

## Recipes (v17+)

Handsontable v17 introduced a Recipes section in the docs — ready-made patterns for common use cases
(data validation workflows, dynamic column generation, etc.). Check the recipes index before building
something from scratch: https://handsontable.com/docs/react-data-grid/recipes/

---

## Common Pitfalls

- **Forgetting `height`**: The grid won't render without a `height` prop. Use `"auto"`, a pixel value, or a CSS string.
- **Not filtering `loadData` in `afterChange`**: The `afterChange` hook fires on initial data load with `source === 'loadData'`. Always check the source to avoid infinite loops when syncing changes back to state.
- **Using the old wrapper packages**: v17 removed `@handsontable/react` and `@handsontable/angular`. Use `@handsontable/react-wrapper` and `@handsontable/angular-wrapper`.
- **Using legacy CSS imports**: `handsontable.full.min.css` was removed in v17. Use `handsontable/styles/handsontable.min.css` plus a theme file.
- **Formulas with nested object data**: HyperFormula formulas don't work when `data` is an array of nested objects — use flat objects or arrays of arrays.
- **HTML in headers/menus/dialogs is not auto-sanitized in v18+**: DOMPurify was dropped from the bundle. If you render untrusted HTML in `colHeaders`, `rowHeaders`, context menus, dialogs, or select editors, pass a `sanitizer: (html) => …` function that returns the sanitized string (e.g., using your own DOMPurify install).
- **Legacy date/time formatting options removed in v18**: the `date` and `time` cell types were **not** removed — they were reimplemented natively (moment.js and Pikaday are gone), and `intl-date` / `intl-time` are interchangeable names for the same implementations. All four use object-based format options (`Intl.DateTimeFormat` shape) and require ISO 8601 source data (`YYYY-MM-DD` for dates; 24-hour `HH:mm`, `HH:mm:ss`, or `HH:mm:ss.SSS` for times). The old string `dateFormat`/`timeFormat` and `datePickerConfig` options are ignored with a console warning; `correctFormat` was removed. The editor is now a native `<input type="date">` / `<input type="time">`. To restore the old `correctFormat` behavior (normalize/correct entered values), implement it via `valueParser` and/or `valueSetter`. There is no replacement for `datePickerConfig`.
- **Legacy `numericFormat.pattern` / `numericFormat.culture` removed in v18**: numbro is no longer bundled. Use `Intl.NumberFormat` options on `numericFormat` (`style`, `currency`, `minimumFractionDigits`, …) together with a `locale` on the column config.
- **`handsontable/common` subpath is gone in v18**: import types from `handsontable` directly (e.g., `import type { GridSettings, CellChange } from 'handsontable';`).
- **`hot.undo()` / `hot.redo()` core methods removed in v17.0**: use the UndoRedo plugin instead — `hot.getPlugin('undoRedo').undo()` / `.redo()`. (The v18.0 changelog re-lists this removal, but it shipped in v17.0.)
- **PersistentState plugin removed in v17.0**: no drop-in replacement — persist column widths / row heights / your own state to `localStorage` manually if needed. Beware: in v18.0 the related `saveManualColumnWidths()` / `loadManualColumnWidths()` / `saveManualRowHeights()` / `loadManualRowHeights()` plugin methods exist again, but only as deprecated no-op stubs that log a warning.
- **Custom CSS targeting the wrapper**: v18 introduced new wrapper elements (`.ht-grid-content`, `.ht-slot-top`, `.ht-slot-bottom`, `.ht-overlay`). Selectors like `.ht-root-wrapper > .ht-grid > .handsontable` will break — target `.ht-grid-content > .handsontable` instead. Also, the `--ht-wrapper-border-radius` CSS var was renamed to `--ht-border-radius`, and `--ht-wrapper-border-width` / `--ht-wrapper-border-color` were removed.

---

## Version Awareness

Handsontable docs are versioned. The latest docs live at `/docs/react-data-grid/` (which redirects
to the current version). To link to a specific version, use `/docs/17.0/react-data-grid/`.

When helping a user, check which version they are on — breaking changes between major versions are
common. Point them to the relevant migration guide if they're upgrading.

For the full organized directory of documentation links, read `references/docs-map.md` in this
skill's folder.

### v18.0 Breaking Changes (latest, June 2026)

- **TypeScript core.** Handsontable's core is now written in TypeScript. Public types re-export from `handsontable` directly; the `handsontable/common` subpath was **removed**. TypeScript 5.1+ is required for consumers.
- **HyperFormula unbundled.** `handsontable@18.0.0` ships with `dependencies: {}` — install `hyperformula` separately and pass it to the Formulas plugin.
- **Date/time cell types reimplemented natively.** moment.js and Pikaday were removed, but the `date` and `time` type names remain and are interchangeable with the new `intl-date` / `intl-time` names (same implementation). Formats are `Intl.DateTimeFormat`-shaped option objects, source data must be ISO 8601, and the editor is a native date/time input. String `dateFormat`/`timeFormat` and `datePickerConfig` are ignored with a console warning; `correctFormat` is removed. Use `valueParser` / `valueSetter` for date/time value correction; `datePickerConfig` has no replacement.
- **Legacy numeric formatting removed.** `numericFormat.pattern` and `numericFormat.culture` (numbro syntax) are gone. Use `Intl.NumberFormat` options + `locale`.
- **DOMPurify dropped.** HTML in headers, menus, dialogs, and select editors is no longer auto-sanitized. Pass a `sanitizer: (html) => …` function if you render untrusted HTML.
- **`saveManualColumnWidths()` / `loadManualColumnWidths()` / `saveManualRowHeights()` / `loadManualRowHeights()` are deprecated no-ops.** These ManualColumnResize / ManualRowResize methods lost their storage when the PersistentState plugin was removed in v17.0; in v18.0 they only log a deprecation warning (`load…` returns `[]`). Note: the v18.0 changelog also re-lists the PersistentState plugin and core `hot.undo()` / `hot.redo()` removals, but both actually shipped in v17.0 (see v17.0 Breaking Changes below).
- **New layout system.** New `layout` option orders plugin UI elements in the `top` and `bottom` wrapper slots. New DOM elements (`.ht-slot-top`, `.ht-slot-bottom`, `.ht-overlay`, `.ht-grid-content`) — audit custom CSS.
- **Theme tokens.** `--ht-wrapper-border-radius` renamed to `--ht-border-radius`; `--ht-wrapper-border-width` and `--ht-wrapper-border-color` removed.
- **Angular support broadened.** Angular 16–22 (was 17–19 in v17.1).
- **New options:** `hashRevealDelay` (password cells), `visibleWhen` (nested headers), `layout`.
- **React/Vue wrapper fixes:** removing a `<HotColumn>` no longer leaves a phantom column ([#12596](https://github.com/handsontable/handsontable/issues/12596)); `height: '100%'` inside a fixed-height parent no longer hides the wrapped table ([#12445](https://github.com/handsontable/handsontable/issues/12445)). Both wrappers peer-require `handsontable@^18` — keep versions aligned.
- **Performance:** ~50% memory reduction overall; on 100k × 100 grids, ~90% memory reduction and ~30× faster initial render, per the release blog.

Migration guide: https://handsontable.com/docs/react-data-grid/migration-from-17.1-to-18.0/

### v17.1 changes (May 2026)

- **New plugins:** DataProvider (server-side row loading via `dataProvider` option), Notification (toast notifications).
- **NestedHeaders rowspan:** column headers can now span multiple header rows.
- **ExportFile:** XLSX export added; the `columnHeaders` option was renamed to `colHeaders` (see Common Pitfalls).
- **Angular wrapper:** modernized for Angular 17–19; simpler setup, fewer deps.
- **Touch:** long-press now opens the context menu on touch devices.
- **TypeScript:** `dateFormat` option now accepts `Intl.DateTimeFormatOptions`.
- No removals or deprecations in v17.1.

### v17.0 Breaking Changes

- Removed legacy wrapper packages (`@handsontable/react`, `@handsontable/angular`). Use
  `@handsontable/react-wrapper` and `@handsontable/angular-wrapper`.
- Removed legacy CSS (`handsontable.full.min.css`). Use `handsontable/styles/` imports.
- Removed core-js from dependencies.
- Removed the PersistentState plugin, its `persistentState` option, and the `persistentStateSave` /
  `persistentStateLoad` / `persistentStateReset` hooks. The `saveManualColumnWidths` /
  `loadManualColumnWidths` / `saveManualRowHeights` / `loadManualRowHeights` plugin methods also
  stopped existing at runtime (v18.0 reintroduced them as deprecated no-op stubs).
- Removed the core `hot.undo()` / `hot.redo()` / `hot.clearUndo()` / `hot.isUndoAvailable()` /
  `hot.isRedoAvailable()` methods and the `hot.undoRedo` property. Use the UndoRedo plugin:
  `hot.getPlugin('undoRedo').undo()` / `.redo()`.
- Deprecated bundled HyperFormula (will require separate install in v18).
- Deprecated numbro.js, Pikaday, moment.js, DOMPurify — use native alternatives.

v17.0 migration guide: https://handsontable.com/docs/react-data-grid/migration-from-16.2-to-17.0/

---

## skills/handsontable/references/custom-cells.md

# Custom Cells (Renderers, Editors, Validators)

> Last verified: July 2026 · against Handsontable 18.0 docs (handsontable/handsontable@develop docs source)

A **renderer** controls how a cell looks in the DOM, an **editor** controls how values are
entered, and a **validator** checks a value when editing finishes. Reach for a renderer for
display-only changes, an editor for custom input UI, a validator for data rules — and bundle all
three into a **custom cell type** when you want a reusable `type: 'my-type'` alias.

---

## Custom renderers

### Function renderer signature

A renderer receives the cell's `<td>` and mutates it directly. Same signature in every framework:

```js
renderer(hotInstance, td, row, col, prop, value, cellProperties)
```

Declare it inline under the `renderer` key of a `columns` entry, or (React) pass a rendering
function as the `hotRenderer` prop of `HotTable` or `HotColumn`. Clear the TD
(`Handsontable.dom.empty(td)`), build DOM from `value`, append, and `return td` — see the
conditional-formatting example below for a complete function renderer.

### React component renderer (`renderer` prop)

Pass a React component to the `renderer` prop of `HotTable` or `HotColumn`. The component receives
`row`, `col`, `prop`, `value`, `TD`, and `cellProperties` as props.

**Required:** component-based renderers are created after table initialization, so they cannot be
used with `autoRowSize` / `autoColumnSize`. Turn both off (`autoColumnSize` is on by default).

```tsx
import { HotTable, HotColumn } from '@handsontable/react-wrapper';

const RendererComponent = (props: RendererProps) => {
  return (
    <>
      Row: {props.row}, column: {props.col}, value: {props.value}
    </>
  );
};

<HotTable
  data={hotData}
  autoRowSize={false}
  autoColumnSize={false}
  licenseKey="non-commercial-and-evaluation"
>
  <HotColumn width={250} renderer={RendererComponent} />
</HotTable>
```

### Named renderers with `registerRenderer`

Register a renderer under a string alias, then reference it by name (works in all frameworks):

```js
import { registerRenderer } from 'handsontable/renderers';

function customRenderer(hotInstance, td, row, column, prop, value, cellProperties) {
  // ...your custom logic of the renderer
}

// Register an alias
registerRenderer("my.custom", customRenderer);
```

Then reference it: `columns={[{ renderer: "my.custom" }]}`.

Registering under an existing alias (e.g. `"text"`) silently overwrites the built-in — prefix
aliases (`"my.asterisk"`) to avoid collisions. Built-in renderer aliases: `autocomplete`,
`checkbox`, `date`, `dropdown`, `html`, `numeric`, `password`, `text`, `time`.

### `valueFormatter` (v17+)

For value-only transformations (units, prefixes, date/number formatting), use `valueFormatter`
instead of a renderer — it runs before the renderer and is faster:

```js
valueFormatter(value, cellProperties) => formattedValue
```

```jsx
columns={[{
  data: 'price',
  valueFormatter(value) {
    return value ? `$${value.toFixed(2)}` : '';
  }
}]}
```

You can combine both: `valueFormatter` transforms the value first, then `renderer` receives the
formatted value for DOM work. `valueFormatter` is also the way to attach symbols outside the `Intl`
standard (e.g. ₿, ‰) that `numericFormat` cannot produce.

### Conditional formatting: call the base renderer, then style

When extending a built-in renderer, Handsontable does **not** call the base renderer for you — call
`textRenderer` (plain text) or `htmlRenderer` (trusted HTML) yourself, then mutate the TD (React
example; vanilla is identical apart from JSX):

```tsx
import { BaseRenderer, registerRenderer } from 'handsontable/renderers';
import { textRenderer } from 'handsontable/renderers/textRenderer';

// display losses in an accounting format, so color is not the only signal
const profitRenderer: BaseRenderer = (instance, td, row, col, prop, value, cellProperties) => {
  const amount = Number(value);
  td.classList.remove('loss-cell');

  if (!Number.isFinite(amount)) {
    textRenderer(instance, td, row, col, prop, value, cellProperties);
    return;
  }

  const formatted = amount < 0
    ? `($${Math.abs(amount).toFixed(1)}M)`
    : `$${amount.toFixed(1)}M`;

  textRenderer(instance, td, row, col, prop, formatted, cellProperties);

  if (amount < 0) {
    td.classList.add('loss-cell');
  }
};

registerRenderer('profitRenderer', profitRenderer);
```

Docs: https://handsontable.com/docs/react-data-grid/cell-renderer/ ·
https://handsontable.com/docs/react-data-grid/conditional-formatting/

---

## Custom editors

### React: `useHotEditor` hook

The hook returns `value`, `setValue`, and `finishEditing`, plus lifecycle callbacks (`onOpen`,
`onClose`, `onPrepare`, `onFocus`). Pass the component to the `editor` prop of `HotTable` or
`HotColumn`. Call `event.stopPropagation()` on the editor root's `mousedown` so
`outsideClickDeselects` doesn't close it; you manage positioning yourself via `onPrepare`'s TD:

```tsx
import { useRef } from 'react';
import { HotTable, HotColumn, useHotEditor } from '@handsontable/react-wrapper';

const EditorComponent = () => {
  const mainElementRef = useRef<HTMLDivElement>(null);

  const { value, setValue, finishEditing } = useHotEditor({
    onOpen: () => {
      mainElementRef.current.style.display = 'block';
    },
    onClose: () => {
      mainElementRef.current.style.display = 'none';
    },
    onPrepare: (_row, _column, _prop, TD, _originalValue, _cellProperties) => {
      const tdPosition = TD.getBoundingClientRect();
      mainElementRef.current.style.left = `${tdPosition.left + window.pageXOffset}px`;
      mainElementRef.current.style.top = `${tdPosition.top + window.pageYOffset}px`;
    },
    onFocus: () => {},
  });
  // render an absolutely-positioned div with onMouseDown={(e) => e.stopPropagation()}
};
// usage: <HotColumn width={250} editor={EditorComponent} />
```

### React: `EditorComponent` render-prop pattern (v17+)

Higher-level than `useHotEditor` — handles container creation, positioning, lifecycle, and
shortcuts automatically. Uses a render prop that receives
`{ value, setValue, finishEditing, isOpen, row, col, mainElementRef }`:

```tsx
import { EditorComponent, HotTable, HotColumn } from '@handsontable/react-wrapper';

const MyCustomEditor = () => {
  return (
    <EditorComponent>
      {({ value, setValue, finishEditing }) => (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') finishEditing();
          }}
        />
      )}
    </EditorComponent>
  );
};

// usage: <HotColumn editor={MyCustomEditor} />
```

`EditorComponent` also accepts `onPrepare(row, column, prop, TD, originalValue, cellProperties)`,
`onOpen`, `onClose`, `onFocus`, `shortcutsGroup`, and `shortcuts` props. Shortcut entries have the
shape `{ keys: [['Enter']], callback: ({ value, setValue, finishEditing }, event) => false }` —
return `false` to prevent the default key behavior. TypeScript: `<EditorComponent<number>>` types
the value.

### Class editor extending `TextEditor`

Works in React and vanilla alike. Extend a built-in editor and pass the class to the `editor`
option. **The `data-hot-input` attribute is required** on the input element — without it,
Handsontable treats clicks on the editor as outside clicks and closes it immediately:

```tsx
import { HotTable } from '@handsontable/react-wrapper';
import { TextEditor } from 'handsontable/editors/textEditor';

class CustomEditor extends TextEditor {
  createElements() {
    super.createElements();
    this.TEXTAREA = document.createElement('input');
    this.TEXTAREA.setAttribute('placeholder', 'Custom placeholder');
    this.TEXTAREA.setAttribute('data-hot-input', 'true');
    this.textareaStyle = this.TEXTAREA.style;
    this.TEXTAREA_PARENT.innerText = '';
    this.TEXTAREA_PARENT.appendChild(this.TEXTAREA);
  }
}

// usage: columns={[{ editor: CustomEditor }]}
```

For a fully custom UI, extend `BaseEditor` and implement the abstract methods: `init()` (build DOM,
runs once — editors are singletons per table), `getValue()`, `setValue(newValue)`, `open()`,
`close()`, `focus()`. Register class editors by alias with
`Handsontable.editors.registerEditor('myEditor', MyEditor)` and use `{ editor: 'myEditor' }` —
component-based editors (`useHotEditor`) cannot be registered this way; pass them directly to the
`editor` prop.

Docs: https://handsontable.com/docs/react-data-grid/cell-editor/

---

## Custom validators

A validator receives `(value, callback)` and must call `callback(true|false)` — returning a boolean
does nothing. Async validation works the same way: call the callback whenever the check completes.
A `RegExp` is also accepted directly as a validator:

```tsx
const ipValidatorRegexp =
  /^(?:\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b|null)$/;

const emailValidator = (value: string, callback: (value: boolean) => void) => {
  setTimeout(() => {
    if (/.+@.+/.test(value)) {
      callback(true);
    } else {
      callback(false);
    }
  }, 1000);
};

// usage: columns={[
//   { data: 'ip', validator: ipValidatorRegexp, allowInvalid: true },
//   { data: 'email', validator: emailValidator }]}
```

Inside a plain-function validator, `this` is the cell meta — e.g. check `this.allowEmpty` and call
`callback(true)` for empty values before applying your pattern.

Register by alias (prefix to avoid overwriting the built-ins `autocomplete`, `date`, `dropdown`,
`numeric`, `time`):

```js
Handsontable.validators.registerValidator('my.credit-card', creditCardValidator);
// usage: columns: [{ validator: 'my.credit-card' }]
```

**`allowInvalid` interplay** — two independent outcomes when a validator returns `false`:
with `allowInvalid: true` (the default) the invalid value is committed to the data source and the
editor closes; with `allowInvalid: false` the editor stays open until the value passes. Either
way, failing cells get the `htInvalid` CSS class (customizable via `invalidCellClassName`, per
column or table-wide).

Docs: https://handsontable.com/docs/react-data-grid/cell-validator/

---

## Full custom cell types (v17+ factory API)

`rendererFactory` + `editorFactory` + `registerCellType` bundle a renderer, editor, and optional
validator under a reusable `type` alias (vanilla; usable from React too):

```ts
import { rendererFactory } from 'handsontable/renderers';
import { editorFactory } from 'handsontable/editors';
import { registerCellType } from 'handsontable/cellTypes';

const cellDefinition = {
  renderer: rendererFactory(({ td, value }) => {
    td.innerText = value;
  }),
  validator: (value, callback) => {
    callback(!isNaN(parseInt(value)));
  },
  editor: editorFactory<{input: HTMLInputElement}>({
    init(editor) {
      editor.input = document.createElement('INPUT') as HTMLInputElement;
      // Container is created automatically and `input` is attached automatically
    },
    getValue(editor) {
      return editor.input.value;
    },
    setValue(editor, value) {
      editor.input.value = value;
    }
  })
};

registerCellType('myCellType', cellDefinition);
// then use `type: 'myCellType'` in a column config
```

`rendererFactory` callback params: `instance`, `td`, `row`, `column`, `prop`, `value`,
`cellProperties` — destructure only what you need. `editorFactory` options: `init`, `afterInit`,
`beforeOpen(editor, { row, col, prop, td, originalValue, cellProperties })` (replaces `prepare()`
— read per-cell config here), `afterOpen`, `afterClose`, `getValue`, `setValue`, `onFocus`,
`render`, `shortcuts`, `shortcutsGroup`, `position: 'container' | 'portal'`, and direct `value` /
`config` properties. Positioning is automatic. For dropdowns/popovers rendered outside the
container, assign the element to `editor.preventCloseElement` in `init`/`afterInit` so clicks on
it don't close the editor.

Editor `shortcuts` config (callback returns `false` to block Handsontable's default key action):

```ts
shortcuts: [
  {
    keys: [['Tab']],
    callback: (editor, _event) => {
      let index = editor.config.indexOf(editor.value);
      index = index === editor.config.length - 1 ? 0 : index + 1;
      editor.setValue(editor.config[index]);
      return false; // Prevents default action
    }
  }
]
```

### Worked recipe: radio-button cell type (vanilla, condensed)

A renderer-driven cell type — all interaction lives in the renderer; the editor is a stub that
keeps Handsontable's editing pipeline happy. Per-column options come from `cellProperties`:

```ts
import { rendererFactory } from 'handsontable/renderers';
import { BaseEditor } from 'handsontable/editors/baseEditor';
import { registerCellType } from 'handsontable/cellTypes';

// Minimal editor stub — all interaction is handled by the renderer.
class RadioEditor extends BaseEditor {
  init() { }
  open() { }
  close() { }
  focus() { }
  getValue() { return this.originalValue; }
  setValue(value) { this.originalValue = value; }
}

const radioRenderer = rendererFactory(({ instance, td, row, column, value, cellProperties }) => {
  while (td.firstChild) td.removeChild(td.firstChild);
  const options = cellProperties.options || [];
  const wrapper = document.createElement('div');
  wrapper.setAttribute('role', 'radiogroup');
  options.forEach((opt) => {
    const optValue = typeof opt === 'object' ? opt.value : opt;
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = `radio-r${row}-c${column}`;
    input.value = optValue;
    input.checked = String(optValue) === String(value);
    input.addEventListener('change', (e) => {
      e.stopPropagation();
      instance.setDataAtCell(row, column, e.target.value);
    });
    wrapper.appendChild(input);
  });
  td.appendChild(wrapper);
});

registerCellType('radio', { editor: RadioEditor, renderer: radioRenderer });

// columns: [{ data: 'priority', type: 'radio', options: priorityOptions, width: 160 }]
```

React equivalent recipe (color picker): a `rendererFactory` swatch renderer + an `EditorComponent`
editor + a `(value, callback)` validator wired straight onto one `HotColumn` — no `registerCellType`
needed: `<HotColumn data="color" editor={ColorPickerEditor} hotRenderer={colorCellRenderer}
validator={colorValidator} />`.

Docs: https://handsontable.com/docs/react-data-grid/custom-cells/ ·
https://handsontable.com/docs/react-data-grid/recipes/cell-types/colorful-picker/ ·
https://handsontable.com/docs/javascript-data-grid/recipes/cell-types/radio/

---

## Pitfalls

- **Component renderers require `autoRowSize={false}` and `autoColumnSize={false}`** — those
  options measure cells before render, but component renderers mount after table init.
  `autoColumnSize` is enabled by default, so this bites silently.
- **Validators signal via `callback(true|false)`, never a return value or Promise** — an async
  validator just calls the callback later. Changes are applied only after *all* validators
  (sync and async) from every changed cell have run.
- **`allowInvalid: true` (the default) still writes invalid values to the data source** — the
  `htInvalid` class marks the cell, but the bad value is committed. Set `allowInvalid: false` to
  keep the editor open until input is valid.
- **Custom class editors need `data-hot-input="true"` on their input element** — without it,
  clicks inside the editor count as outside clicks and close it immediately. In factory editors
  the equivalent for external popovers is `editor.preventCloseElement`.
- **Never attach event listeners directly to the TD in a renderer** — renderers run many times per
  cell and TD nodes are recycled during scrolling, so you get duplicate or misplaced listeners.
  Prefer Handsontable events; otherwise wrap content in a `<div>` and listen on the wrapper.
- **Register before use, and prefix aliases** — `registerRenderer` / `registerEditor` /
  `registerValidator` / `registerCellType` must run before the table initializes, and registering
  under an existing alias (e.g. `"text"`, `"date"`) silently overwrites the built-in.
- **Keep renderers fast** — they run for every visible cell on every table render; prefer
  `valueFormatter` (v17+) when you only need to transform the displayed value.

---

## skills/handsontable/references/data-workflows.md

# Data Workflows (Save, Sync, Validate, Import/Export)

> Last verified: July 2026 · against Handsontable 18.0 docs (handsontable/handsontable@develop docs source)

End-to-end data patterns: persisting edits, syncing grids, dependent dropdowns, bulk validation,
import/export, and undo/redo. Framework is labeled per snippet (React uses
`@handsontable/react-wrapper`; vanilla uses `handsontable/base` + `registerAllModules()`).

## Saving to a backend

### The `afterChange` hook and its changes array

Track edits with `afterChange`. It receives `(changes, source)`; **always guard against
`source === 'loadData'`** or the initial data load will trigger a save. Each entry in `changes`
is a tuple `[row, prop, oldValue, newValue]`:

```javascript
afterChange(changes, source) {
  if (source === 'loadData' || !changes) {
    return;
  }
  changes.forEach(([row, prop, oldValue, newValue]) => {
    const column = this.propToCol(prop); // the visual column index
  });
}
```

`prop` is a property name with object data, a column index with array data, and — with function
data sources — the accessor function itself; normalize with `propToCol()`. Inside the hook, POST
`changes` (or `hot.getData()` for the full dataset) to your endpoint.

`afterChange` does **not** fire for structural changes such as row moves — listen to
`afterRowMove` and read the new order with `getData()`. If your save logic writes several
confirmed values back to the grid at once, wrap the writes in `batch()` so it re-renders once.

Docs: https://handsontable.com/docs/react-data-grid/saving-data/

### Debounced auto-save with dirty-row tracking

Condensed from the auto-save recipe (vanilla JS/TS; in React, pass the same handler via the
`afterChange` prop). Track changed *physical* rows in a `Set`, debounce, send only dirty rows:

```typescript
// Vanilla / TypeScript
const dirtyRows = new Set<number>();
let saveTimeout: ReturnType<typeof setTimeout> | null = null;

// in the grid settings:
afterChange(changes, source) {
  if (!changes || source === 'loadData') {
    return;
  }
  changes.forEach(([visualRow, _prop, oldValue, newValue]) => {
    if (oldValue !== newValue) {
      const physicalRow = hot.toPhysicalRow(visualRow as number);
      if (typeof physicalRow === 'number') {
        dirtyRows.add(physicalRow);
      }
    }
  });
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = setTimeout(async () => {
    const physicalRows = Array.from(dirtyRows);
    const rowsToSave = physicalRows
      .map((physicalRow) => hot.getSourceDataAtRow(physicalRow))
      .filter((row) => row !== undefined && row !== null);
    dirtyRows.clear();
    try {
      await saveRowsToBackend(rowsToSave); // e.g. fetch('/api/products', { method: 'PATCH', ... })
    } catch (_error) {
      physicalRows.forEach((physicalRow) => dirtyRows.add(physicalRow)); // retry next debounce
    }
  }, 800);
}
```

Use object rows with a stable primary key (`id`); for save-status UIs, track a request counter
so a stale response can't overwrite a newer one.

Docs: https://handsontable.com/docs/react-data-grid/recipes/data-management/auto-save-backend/

### `loadData()` vs `updateData()`

Both take the new dataset as their only argument — `hot.loadData(newDataset)` /
`hot.updateData(newDataset)` — and differ in what they reset:

| Method | Resets sort order | Resets selection | Resets column order | Use when |
|---|---|---|---|---|
| `loadData()` | Yes | Yes | Yes | Initial load, schema change, or hard reset |
| `updateData()` | No | No | No | Periodic refresh or live-data feed |

- `loadData()` fires `beforeLoadData` / `afterLoadData`; `updateData()` fires `beforeUpdateData`
  / `afterUpdateData`. `updateSettings({ data })` also replaces data; since v12 it uses
  `updateData()` under the hood (except the initial call, which uses `loadData()`).
- Refresh pattern: `loadData()` for the first fetch, `updateData()` for every later refresh so
  the user's sort/selection survives. On a failed refresh, call neither — existing data is valid.
- v17.1+ adds the `dataProvider` option (`rowId`, `fetchRows`, `onRowsCreate`, `onRowsUpdate`,
  `onRowsRemove`) for backend-driven pagination/sorting/CRUD; `multiColumnSorting` is
  incompatible with it — use `columnSorting` only.

Docs: https://handsontable.com/docs/react-data-grid/binding-to-data/ · https://handsontable.com/docs/react-data-grid/recipes/data-management/load-data-rest-api/

## Syncing grids / programmatic writes

To write into a grid programmatically without re-triggering your own `afterChange` logic, pass
a **custom source string** to `setDataAtCell()` and check it in the hook. Condensed from the
sync-two-grids recipe (React):

```jsx
// React
const SOURCE_SYNC_FROM_MASTER = 'sync-from-master';

const syncDetailRow = (rowIndex, rowData) => {
  const detailRow = toDetailRow(rowData); // map master row -> detail row shape
  const detailChanges = Object.entries(detailColumnMap).map(([prop, columnIndex]) => [
    rowIndex,
    columnIndex,
    detailRow[prop],
  ]);
  // one batched call = one render pass; the custom source tags these writes
  detailHot.setDataAtCell(detailChanges, SOURCE_SYNC_FROM_MASTER);
};

const handleMasterAfterChange = (changes, source) => {
  // Ignore init/sync writes to prevent re-entrant updates.
  if (!changes || source === SOURCE_SYNC_FROM_MASTER || source === 'loadData') {
    return;
  }
  const changedRows = new Set();
  changes.forEach(([row]) => changedRows.add(row));
  changedRows.forEach((rowIndex) => {
    syncDetailRow(rowIndex, masterHot.getSourceDataAtRow(rowIndex));
  });
};
```

The source guard prevents the infinite loop; one batched `setDataAtCell(changesArray, source)` call = one render pass per sync.

Docs: https://handsontable.com/docs/react-data-grid/recipes/data-management/sync-two-grids/

## Dependent dropdowns

Drive a child `dropdown` column's `source` from the parent column's value with a per-row
`setCellMeta` swap, then call `render()`. Condensed from the recipe (React):

```jsx
// React
const CATEGORY_COL = 0;
const SUBCATEGORY_COL = 1;

const dependencyMap = {
  Fruit: ['Apple', 'Banana', 'Orange'],
  Vegetable: ['Carrot', 'Pea', 'Broccoli'],
};

const optionsForCategory = (category) => dependencyMap[category] ?? [];

function afterChange(changes, source) {
  if (!hot || source === 'loadData' || !changes) {
    return;
  }
  for (const change of changes) {
    const [row, prop, oldVal, newVal] = change;
    if (prop !== CATEGORY_COL || oldVal === newVal) {
      continue;
    }

    const next = optionsForCategory(String(newVal));
    hot.setCellMeta(row, SUBCATEGORY_COL, 'source', next);
    hot.setDataAtCell(row, SUBCATEGORY_COL, next[0] ?? ''); // reset stale child value
  }
  hot.render();
}
```

`setCellMeta(row, col, 'source', newOptions)` replaces the dropdown options for a single cell
only; `hot.render()` after `setCellMeta` is required for the editor to pick up the new options.
Run the same per-row `setCellMeta` loop from `afterInit` (loop `hot.countRows()`, read each
parent with `getDataAtCell(row, CATEGORY_COL)`) so every row is consistent on load.

Docs: https://handsontable.com/docs/react-data-grid/recipes/editing-validation/dependent-dropdowns/

## Row validation with error summary

Bulk-validate on Submit with a rule map keyed by column index, highlight failures with the
built-in `htInvalid` class via `setCellMeta`, list issues outside the grid, and auto-clear on
re-edit. Condensed from the recipe (React):

```jsx
// React
/** Column index -> returns `null` when valid, otherwise an error message. */
const validationRules = {
  0: (value) => (String(value ?? '').trim().length > 0 ? null : 'Item name is required'),
}; // ...one rule per validated column

function handleSubmit() {
  // 1. clear prior highlights: removeCellMeta(r, c, 'className') / (r, c, 'title')
  //    for every key in invalidCellsRef, then clear the Set
  // 2. scan every row against the rule map
  const newIssues = [];
  for (let row = 0; row < hot.countRows(); row++) {
    for (let col = 0; col < hot.countCols(); col++) {
      const rule = validationRules[col];
      if (!rule) continue;
      const message = rule(hot.getDataAtCell(row, col));
      if (message !== null) newIssues.push({ row, col, message });
    }
  }
  // 3. highlight failures and render
  newIssues.forEach((issue) => {
    hot.setCellMeta(issue.row, issue.col, 'className', 'htInvalid');
    hot.setCellMeta(issue.row, issue.col, 'title', issue.message); // native tooltip
    invalidCellsRef.current.add(cellKey(issue.row, issue.col));
  });
  hot.render();
  setIssues(newIssues); // external error list, e.g. "Row 3, Unit price: must be greater than 0"
}

function afterChange(changes, source) {
  if (!hot || source === 'loadData' || !changes) {
    return;
  }
  for (const change of changes) {
    const [row, prop] = change;
    const col = typeof prop === 'string' ? hot.propToCol(prop) : prop;
    const key = cellKey(row, col);
    if (!invalidCellsRef.current.has(key)) continue;
    // auto-clear the invalid state as soon as the user edits the cell
    hot.removeCellMeta(row, col, 'className');
    hot.removeCellMeta(row, col, 'title');
    invalidCellsRef.current.delete(key);
  }
  hot.render();
}
```

`cellKey(row, col)` is a `` `${row}:${col}` `` helper backing the invalid-cell `Set`. For
async per-edit validation instead of on-Submit, use cell validators.

Docs: https://handsontable.com/docs/react-data-grid/recipes/editing-validation/row-validation-error-summary/

## Import: CSV (PapaParse) and Excel (SheetJS)

Parse in the browser, then rebuild the grid's column shape from the detected header row.

```javascript
// CSV via PapaParse — header row becomes object keys, types inferred
PapaRef.parse(file, {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: 'greedy',
  transformHeader: (h) => h.trim(),
  complete: (results) => { /* results.data + results.meta.fields */ },
});

// Excel via SheetJS — first sheet, row 0 as header line
const workbook = XLSXRef.read(buf, { type: 'array' }); // buf = await file.arrayBuffer()
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const matrix = XLSXRef.utils.sheet_to_json(sheet, { header: 1, defval: null, raw: true });
```

Both parsers converge on `{ headers: string[], rows: object[] }`. Infer column types, then apply
them with `updateSettings()` **before** `loadData()`:

```javascript
function columnsFromHeaders(headers, rows) {
  return headers.map((data) => {
    const values = rows.map((row) => row[data]).filter((v) => v !== null);
    if (values.length > 0 && values.every((v) => typeof v === 'number')) {
      return { data, type: 'numeric' };
    }
    if (values.length > 0 && values.every((v) => typeof v === 'boolean')) {
      return { data, type: 'checkbox' };
    }
    return { data, type: 'text' };
  });
}
// re-import into an existing instance:
hot.updateSettings({ colHeaders: headers, columns });
hot.loadData(rows);
```

`updateSettings` must run before `loadData` so Handsontable knows which keys to read from the row
objects. Normalize empty cells to `null` so the grid shows blanks instead of `"undefined"`.

Docs: https://handsontable.com/docs/react-data-grid/recipes/import-export/import-csv-excel/

## Export: CSV, XLSX, PDF

### CSV — `ExportFile` plugin

Methods: `downloadFile(format, options)` (synchronous, text formats only), `exportAsBlob(format, options)`, `exportAsString(format, options)`.

```jsx
// React
const exportPlugin = hotRef.current?.hotInstance?.getPlugin('exportFile');
exportPlugin?.downloadFile('csv', {
  columnDelimiter: ',',
  colHeaders: false,
  exportHiddenColumns: true,
  exportHiddenRows: true,
  filename: 'Handsontable-CSV-file_[YYYY]-[MM]-[DD]',
  rowDelimiter: '\r\n',
  rowHeaders: true,
  sanitizeValues: true, // OWASP CSV-injection rules; also accepts RegExp or (value) => value
});
```

Other options: `bom` (default `true`), `fileExtension`, `mimeType`, `range`
(`[startRow, startColumn, endRow, endColumn]`, visual indexes). CSV export is raw data only — no
formulas, styling, or formatting. `sanitizeValues` guards against CSV/formula injection;
a `RegExp` escapes matching values, a function replaces them with its return value.

Docs: https://handsontable.com/docs/react-data-grid/export-to-csv/

### XLSX (v17.1+) — `downloadFileAsync` + ExcelJS peer dep

Install ExcelJS (`^4.4.0`), register it as the engine, then use the async methods
(`downloadFile` does not support XLSX):

```jsx
// React
import ExcelJS from 'exceljs';

<HotTable exportFile={{ engines: { xlsx: ExcelJS } }} />

const exportPlugin = hotRef.current?.hotInstance?.getPlugin('exportFile');
await exportPlugin?.downloadFileAsync('xlsx', { filename: 'my-report' });
// or: const blob = await exportPlugin.exportAsBlob('xlsx', { filename: 'my-report' });
```

XLSX export preserves what CSV can't: cell types (`numeric`, `date`, `time`, `checkbox`) as
native Excel types, DOM-derived styling (font, fill, alignment, `CustomBorders`), column/nested
headers, merged cells, frozen panes, and — with `exportFormulas: true` — HyperFormula and
ColumnSummary cells as live Excel formulas. `sheets: [{ instance, name, ... }]` exports multiple
grids into one workbook; the context menu gains an **Export to Excel** item once an ExcelJS
engine is configured.

Docs: https://handsontable.com/docs/react-data-grid/export-to-excel/

### PDF — `getData()` + jsPDF AutoTable

No built-in PDF export; read the grid and hand it to jsPDF + jspdf-autotable:

```javascript
// import { jsPDF } from 'jspdf'; import { autoTable } from 'jspdf-autotable';
const body = hot.getData(); // 2D array in current visual order (sorting included)
const head = [Array.from({ length: hot.countCols() }, (_, col) => String(hot.getColHeader(col)))];
const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
autoTable(doc, { head, body, showHead: 'everyPage' });
doc.save('export.pdf');
```

Docs: https://handsontable.com/docs/react-data-grid/recipes/import-export/export-to-pdf/

## Undo/redo with a custom UI

Enable with `undoRedo: true`, drive it via `getPlugin('undoRedo')`, keep button state in sync
from hooks:

```typescript
// Vanilla (React: same calls via hotRef.current?.hotInstance)
const syncHistoryButtons = () => {
  const undoRedoPlugin = hot.getPlugin('undoRedo');
  undoButton.disabled = !undoRedoPlugin.isUndoAvailable();
  redoButton.disabled = !undoRedoPlugin.isRedoAvailable();
};

undoButton.addEventListener('click', () => hot.getPlugin('undoRedo').undo());
redoButton.addEventListener('click', () => hot.getPlugin('undoRedo').redo());

hot.updateSettings({
  afterChange: () => syncHistoryButtons(),
  afterUndo: () => syncHistoryButtons(),
  afterRedo: () => syncHistoryButtons(),
});
syncHistoryButtons(); // both buttons start disabled — the stack is empty
```

Docs: https://handsontable.com/docs/react-data-grid/recipes/data-management/undo-redo-custom-ui/

## Pitfalls

- **Save loop from a missing source guard.** Any `afterChange` handler that writes data must
  bail on `source === 'loadData'` — and on your own custom source string when its writes land
  back in a grid it observes (`setDataAtCell(changes, 'my-source')` + guard).
- **`loadData()` resets grid state.** Since v12 it resets configuration options and index mapper
  information — sorting, selection, and column order all revert. Use `updateData()` to refresh.
- **`afterChange` misses structural changes.** Row moves don't fire it; listen to `afterRowMove`
  and read the result with `getData()`.
- **`prop` isn't always a column index.** With object data it's a property name; with function
  data sources it's the accessor function — normalize with `hot.propToCol(prop)`.
- **Changing column shape at import time:** call `updateSettings({ colHeaders, columns })`
  *before* `loadData(rows)`, or the grid won't know which keys to read from the new row objects.
- **`setCellMeta` changes aren't visible until `hot.render()`** — dropdown `source` swaps and
  `htInvalid` highlights both need it. Wrap bulk programmatic writes in `batch()`.

Docs index: https://handsontable.com/docs/react-data-grid/recipes/

---

## skills/handsontable/references/docs-map.md

# Handsontable Documentation Map

> Last verified: June 2026 · Aligned with Handsontable 18.0.0

Organized link directory for all Handsontable and HyperFormula (in-grid) documentation. Use these
to point users to the right page. Links default to the React docs; replace `react-data-grid` with
`javascript-data-grid`, `angular-data-grid`, or prefix with `vue3-` for other frameworks.

## Getting Started
- Installation: https://handsontable.com/docs/react-data-grid/installation/
- Demo: https://handsontable.com/docs/react-data-grid/demo/
- Binding to data: https://handsontable.com/docs/react-data-grid/binding-to-data/
- Server-side data fetching (DataProvider, v17.1+): https://handsontable.com/docs/react-data-grid/server-side-data-fetching/
- Saving data: https://handsontable.com/docs/react-data-grid/saving-data/
- Configuration options guide: https://handsontable.com/docs/react-data-grid/configuration-options/
- Grid size: https://handsontable.com/docs/react-data-grid/grid-size/
- Instance methods: https://handsontable.com/docs/react-data-grid/instance-methods/
- Events and hooks: https://handsontable.com/docs/react-data-grid/events-and-hooks/
- License key: https://handsontable.com/docs/react-data-grid/license-key/
- Redux integration: https://handsontable.com/docs/react-data-grid/redux/

## Styling & Themes
- Themes guide: https://handsontable.com/docs/react-data-grid/themes/
- Design system (Figma): https://handsontable.com/docs/react-data-grid/handsontable-design-system/
- Theme customization (CSS vars, tokens): https://handsontable.com/docs/react-data-grid/theme-customization/
- Legacy style (pre-v15): https://handsontable.com/docs/react-data-grid/legacy-style/
- Theme Builder tool: https://handsontable.com/theme-builder
- Figma Theme Generator: https://github.com/handsontable/handsontable-figma

## Columns
- HotColumn component (React): https://handsontable.com/docs/react-data-grid/hot-column/
- Column headers: https://handsontable.com/docs/react-data-grid/column-header/
- Column groups (nested headers): https://handsontable.com/docs/react-data-grid/column-groups/
- Column hiding: https://handsontable.com/docs/react-data-grid/column-hiding/
- Column moving: https://handsontable.com/docs/react-data-grid/column-moving/
- Column freezing: https://handsontable.com/docs/react-data-grid/column-freezing/
- Column widths: https://handsontable.com/docs/react-data-grid/column-width/
- Column summary: https://handsontable.com/docs/react-data-grid/column-summary/
- Column virtualization: https://handsontable.com/docs/react-data-grid/column-virtualization/
- Column menu (dropdown): https://handsontable.com/docs/react-data-grid/column-menu/
- Column filter: https://handsontable.com/docs/react-data-grid/column-filter/

## Rows
- Row headers: https://handsontable.com/docs/react-data-grid/row-header/
- Row parent-child (nested rows): https://handsontable.com/docs/react-data-grid/row-parent-child/
- Row hiding: https://handsontable.com/docs/react-data-grid/row-hiding/
- Row moving: https://handsontable.com/docs/react-data-grid/row-moving/
- Row freezing: https://handsontable.com/docs/react-data-grid/row-freezing/
- Row heights: https://handsontable.com/docs/react-data-grid/row-height/
- Row virtualization: https://handsontable.com/docs/react-data-grid/row-virtualization/
- Rows sorting: https://handsontable.com/docs/react-data-grid/rows-sorting/
- Rows pagination: https://handsontable.com/docs/react-data-grid/rows-pagination/
- Row trimming: https://handsontable.com/docs/react-data-grid/row-trimming/
- Row pre-populating: https://handsontable.com/docs/react-data-grid/row-prepopulating/

## Cell Features
- Clipboard (copy/paste): https://handsontable.com/docs/react-data-grid/basic-clipboard/
- Selection: https://handsontable.com/docs/react-data-grid/selection/
- Merge cells: https://handsontable.com/docs/react-data-grid/merge-cells/
- Conditional formatting: https://handsontable.com/docs/react-data-grid/conditional-formatting/
- Text alignment: https://handsontable.com/docs/react-data-grid/text-alignment/
- Disabled cells: https://handsontable.com/docs/react-data-grid/disabled-cells/
- Comments: https://handsontable.com/docs/react-data-grid/comments/
- Autofill values: https://handsontable.com/docs/react-data-grid/autofill-values/
- Formatting cells: https://handsontable.com/docs/react-data-grid/formatting-cells/

## Cell Functions
- Cell functions overview: https://handsontable.com/docs/react-data-grid/cell-function/
- Cell renderer: https://handsontable.com/docs/react-data-grid/cell-renderer/
- Cell editor: https://handsontable.com/docs/react-data-grid/cell-editor/
- Cell validator: https://handsontable.com/docs/react-data-grid/cell-validator/
- Custom cells (v17+): https://handsontable.com/docs/react-data-grid/custom-cells/

## Cell Types
- Cell type overview: https://handsontable.com/docs/react-data-grid/cell-type/
- Numeric: https://handsontable.com/docs/react-data-grid/numeric-cell-type/
- Date (documents both `date` and its v18+ equivalent `intl-date` — same implementation since v18): https://handsontable.com/docs/react-data-grid/date-cell-type/
- Time (documents both `time` and its v18+ equivalent `intl-time` — same implementation since v18): https://handsontable.com/docs/react-data-grid/time-cell-type/
- Checkbox: https://handsontable.com/docs/react-data-grid/checkbox-cell-type/
- Select: https://handsontable.com/docs/react-data-grid/select-cell-type/
- Dropdown: https://handsontable.com/docs/react-data-grid/dropdown-cell-type/
- Autocomplete: https://handsontable.com/docs/react-data-grid/autocomplete-cell-type/
- MultiSelect (v17+): https://handsontable.com/docs/react-data-grid/multiselect-cell-type/
- Password: https://handsontable.com/docs/react-data-grid/password-cell-type/
- Handsontable (nested grid): https://handsontable.com/docs/react-data-grid/handsontable-cell-type/

## Formulas (HyperFormula in Handsontable)
- Formula calculation guide: https://handsontable.com/docs/react-data-grid/formula-calculation/
- Formulas plugin API: https://handsontable.com/docs/react-data-grid/api/formulas/
- HyperFormula built-in functions list: https://hyperformula.handsontable.com/docs/guide/built-in-functions.html
- HyperFormula configuration options: https://hyperformula.handsontable.com/docs/guide/configuration-options.html
- HyperFormula custom functions: https://hyperformula.handsontable.com/docs/guide/custom-functions.html
- HyperFormula named expressions: https://hyperformula.handsontable.com/docs/guide/cell-references.html#relative-references
- HyperFormula license key: https://hyperformula.handsontable.com/docs/guide/license-key.html

## Navigation
- Keyboard shortcuts: https://handsontable.com/docs/react-data-grid/keyboard-shortcuts/
- Custom shortcuts: https://handsontable.com/docs/react-data-grid/custom-shortcuts/
- Focus scopes: https://handsontable.com/docs/react-data-grid/focus-scopes/
- Searching values: https://handsontable.com/docs/react-data-grid/searching-values/

## Accessibility
- Accessibility guide: https://handsontable.com/docs/react-data-grid/accessibility/

## Menus & Accessories
- Context menu: https://handsontable.com/docs/react-data-grid/context-menu/
- Undo and redo: https://handsontable.com/docs/react-data-grid/undo-redo/
- Icon pack: https://handsontable.com/docs/react-data-grid/icon-pack/
- Export to CSV: https://handsontable.com/docs/react-data-grid/export-to-csv/
- Export to Excel/XLSX (v17.1+): https://handsontable.com/docs/react-data-grid/export-to-excel/
- Notification (v17.1+): https://handsontable.com/docs/react-data-grid/notification/
- Empty data state: https://handsontable.com/docs/react-data-grid/empty-data-state/

## Dialog & Loading
- Dialog: https://handsontable.com/docs/react-data-grid/dialog/
- Loading indicator: https://handsontable.com/docs/react-data-grid/loading/

## Internationalization
- Language: https://handsontable.com/docs/react-data-grid/language/
- Locale: https://handsontable.com/docs/react-data-grid/locale/
- Layout direction (RTL/LTR): https://handsontable.com/docs/react-data-grid/layout-direction/
- IME support: https://handsontable.com/docs/react-data-grid/ime-support/

## Tools & Building
- Modules (tree-shaking): https://handsontable.com/docs/react-data-grid/modules/
- Custom plugins: https://handsontable.com/docs/react-data-grid/custom-plugins/
- Custom builds: https://handsontable.com/docs/react-data-grid/custom-builds/
- Testing: https://handsontable.com/docs/react-data-grid/testing/

## Optimization
- Batch operations: https://handsontable.com/docs/react-data-grid/batch-operations/
- Performance: https://handsontable.com/docs/react-data-grid/performance/
- Bundle size: https://handsontable.com/docs/react-data-grid/bundle-size/

## Security
- Security guide: https://handsontable.com/docs/react-data-grid/security/

## API Reference
- API overview: https://handsontable.com/docs/react-data-grid/api/
- Core (instance methods): https://handsontable.com/docs/react-data-grid/api/core/
- Hooks (all events): https://handsontable.com/docs/react-data-grid/api/hooks/
- Configuration options (all props): https://handsontable.com/docs/react-data-grid/api/options/
- `layout` option (v18+): https://handsontable.com/docs/react-data-grid/api/options/#layout
- Plugins index: https://handsontable.com/docs/react-data-grid/api/plugins/

### TypeScript Type Definitions

There is no dedicated TypeScript guide page on handsontable.com — for the curated public type
surface (settings hierarchy, hook signatures, registry unions, React wrapper types, v17↔v18
differences), read `type-definitions.md` in this references folder. To read the shipped
definitions directly (version-pinned):

- v18 `GridSettings` + hooks: https://cdn.jsdelivr.net/npm/handsontable@18.0.0/core/settings.d.ts
- v18 data types & hierarchy: https://cdn.jsdelivr.net/npm/handsontable@18.0.0/settings.d.ts
- v17 equivalents: https://cdn.jsdelivr.net/npm/handsontable@17.1.0/settings.d.ts
- v18 TypeScript source: https://github.com/handsontable/handsontable/blob/develop/handsontable/src/core/settings.ts

### Individual Plugin APIs
- AutoColumnSize: https://handsontable.com/docs/react-data-grid/api/auto-column-size/
- AutoRowSize: https://handsontable.com/docs/react-data-grid/api/auto-row-size/
- Autofill: https://handsontable.com/docs/react-data-grid/api/autofill/
- BindRowsWithHeaders: https://handsontable.com/docs/react-data-grid/api/bind-rows-with-headers/
- CollapsibleColumns: https://handsontable.com/docs/react-data-grid/api/collapsible-columns/
- ColumnSorting: https://handsontable.com/docs/react-data-grid/api/column-sorting/
- ColumnSummary: https://handsontable.com/docs/react-data-grid/api/column-summary/
- Comments: https://handsontable.com/docs/react-data-grid/api/comments/
- ContextMenu: https://handsontable.com/docs/react-data-grid/api/context-menu/
- CopyPaste: https://handsontable.com/docs/react-data-grid/api/copy-paste/
- CustomBorders: https://handsontable.com/docs/react-data-grid/api/custom-borders/
- DataProvider (v17.1+): https://handsontable.com/docs/react-data-grid/api/data-provider/
- Dialog: https://handsontable.com/docs/react-data-grid/api/dialog/
- DragToScroll: https://handsontable.com/docs/react-data-grid/api/drag-to-scroll/
- DropdownMenu: https://handsontable.com/docs/react-data-grid/api/dropdown-menu/
- EmptyDataState: https://handsontable.com/docs/react-data-grid/api/empty-data-state/
- ExportFile: https://handsontable.com/docs/react-data-grid/api/export-file/
- Filters: https://handsontable.com/docs/react-data-grid/api/filters/
- Formulas: https://handsontable.com/docs/react-data-grid/api/formulas/
- HiddenColumns: https://handsontable.com/docs/react-data-grid/api/hidden-columns/
- HiddenRows: https://handsontable.com/docs/react-data-grid/api/hidden-rows/
- Loading: https://handsontable.com/docs/react-data-grid/api/loading/
- ManualColumnFreeze: https://handsontable.com/docs/react-data-grid/api/manual-column-freeze/
- ManualColumnMove: https://handsontable.com/docs/react-data-grid/api/manual-column-move/
- ManualColumnResize: https://handsontable.com/docs/react-data-grid/api/manual-column-resize/
- ManualRowMove: https://handsontable.com/docs/react-data-grid/api/manual-row-move/
- ManualRowResize: https://handsontable.com/docs/react-data-grid/api/manual-row-resize/
- MergeCells: https://handsontable.com/docs/react-data-grid/api/merge-cells/
- MultiColumnSorting: https://handsontable.com/docs/react-data-grid/api/multi-column-sorting/
- NestedHeaders: https://handsontable.com/docs/react-data-grid/api/nested-headers/
- NestedRows: https://handsontable.com/docs/react-data-grid/api/nested-rows/
- Notification (v17.1+): https://handsontable.com/docs/react-data-grid/api/notification/
- Pagination: https://handsontable.com/docs/react-data-grid/api/pagination/
- Search: https://handsontable.com/docs/react-data-grid/api/search/
- StretchColumns: https://handsontable.com/docs/react-data-grid/api/stretch-columns/
- TrimRows: https://handsontable.com/docs/react-data-grid/api/trim-rows/
- UndoRedo: https://handsontable.com/docs/react-data-grid/api/undo-redo/

## Recipes (new in v17)
- Recipes index: https://handsontable.com/docs/react-data-grid/recipes/
- Load data from a REST API (DataProvider, v17.1+): https://handsontable.com/docs/react-data-grid/recipes/data-management/load-data-rest-api/

## Upgrade & Migration
- Changelog: https://handsontable.com/docs/react-data-grid/changelog/
- Versioning policy: https://handsontable.com/docs/react-data-grid/versioning-policy/
- Deprecation policy: https://handsontable.com/docs/react-data-grid/deprecation-policy/
- Long Term Support (LTS): https://handsontable.com/docs/react-data-grid/long-term-support/
- 17.1 → 18.0 migration: https://handsontable.com/docs/react-data-grid/migration-from-17.1-to-18.0/
- 16.2 → 17.0 migration: https://handsontable.com/docs/react-data-grid/migration-from-16.2-to-17.0/
- 16.0 → 16.1 migration: https://handsontable.com/docs/react-data-grid/migration-from-16.0-to-16.1/
- 15.3 → 16.0 migration: https://handsontable.com/docs/react-data-grid/migration-from-15.3-to-16.0/
- 14.6 → 15.0 migration: https://handsontable.com/docs/react-data-grid/migration-from-14.6-to-15.0/

## Other Framework Installation
- JavaScript: https://handsontable.com/docs/javascript-data-grid/installation/
- Angular: https://handsontable.com/docs/angular-data-grid/installation/
- Vue 3: https://handsontable.com/docs/vue-data-grid/installation/

## SSR Examples (CodeSandbox)
- Next.js: https://codesandbox.io/p/sandbox/kwnjph?file=https://handsontable.com/codesandbox-vm?example-dir=next.js&handsontable-version=18.0preview=true
- Astro: https://codesandbox.io/p/sandbox/gnqcwn?file=https://handsontable.com/codesandbox-vm?example-dir=astro&handsontable-version=18.0preview=true
- Remix: https://codesandbox.io/p/sandbox/njcjlq?file=https://handsontable.com/codesandbox-vm?example-dir=remix&handsontable-version=18.0preview=true
- Nuxt: https://codesandbox.io/p/sandbox/r7qsjc?file=https://handsontable.com/codesandbox-vm?example-dir=nuxt&handsontable-version=18.0preview=true

## CDN Links (jsDelivr) — latest
- JS (full bundle): https://cdn.jsdelivr.net/npm/handsontable/dist/handsontable.full.min.js
- Base CSS: https://cdn.jsdelivr.net/npm/handsontable/styles/handsontable.min.css
- Theme Main: https://cdn.jsdelivr.net/npm/handsontable/styles/ht-theme-main.min.css
- Theme Horizon: https://cdn.jsdelivr.net/npm/handsontable/styles/ht-theme-horizon.min.css
- Theme Classic: https://cdn.jsdelivr.net/npm/handsontable/styles/ht-theme-classic.min.css
- React wrapper: https://cdn.jsdelivr.net/npm/@handsontable/react-wrapper/dist/react-handsontable.min.js
- HyperFormula: https://cdn.jsdelivr.net/npm/hyperformula/dist/hyperformula.full.min.js

Pin versions by adding `@18.0` after the package name (e.g., `handsontable@18.0`).

## Package Registries
- npm: https://www.npmjs.com/package/handsontable
- NuGet: https://www.nuget.org/packages/handsontable

## Community & Support
- Developer Forum: https://forum.handsontable.com/
- GitHub Issues: https://github.com/handsontable/handsontable/issues
- Stack Overflow: https://stackoverflow.com/tags/handsontable
- Commercial support: support@handsontable.com
- Contact form: https://handsontable.com/contact
- Blog / Release Notes: https://handsontable.com/blog/?category=release-notes
- Download page: https://handsontable.com/download

---

## skills/handsontable/references/interaction-plugins.md

# Interaction & Plugin APIs (Menus, Filters, Search, Shortcuts, UI States)

> Last verified: July 2026 · against Handsontable 18.0 docs (handsontable/handsontable@develop docs source)

How to drive Handsontable's interactive plugins from code: custom context menus, the Filters and Search plugin APIs, the ShortcutManager, ColumnSummary, layout persistence, and the UI-state plugins (EmptyDataState, Loading, Dialog). All API access goes through the Handsontable instance — in React, get it via a `HotTable` ref: `hotTableRef.current?.hotInstance`.

## Custom context menu items

`contextMenu: true` enables the default menu. Pass an array of predefined keys to pick built-in items, or an object with `items` for full control. Predefined keys include: `row_above`, `row_below`, `col_left`, `col_right`, `---------` (separator), `remove_row`, `remove_col`, `clear_column`, `undo`, `redo`, `make_read_only`, `alignment`, `cut`, `copy`, `freeze_column`, `unfreeze_column`, `borders`, `commentsAddEdit`, `commentsRemove`, `commentsReadOnly`, `mergeCells`, `add_child`, `detach_from_parent`, `hidden_columns_hide`, `hidden_columns_show`, `hidden_rows_hide`, `hidden_rows_show`, `export_file` — many require their backing plugin (e.g., `undo`/`redo` need `UndoRedo`, `cut`/`copy` need `CopyPaste`). The `filter_*` items only take effect in the dropdown (column) menu, not the context menu.

With an `items` object, the keys you list are the only items that appear — anything omitted is hidden. Item config options: `key`, `name` (string or function; supports HTML; `this` = hot instance), `disabled` (boolean or function, `this`-bound), `hidden` (boolean or function, `this`-bound), `callback(key, selection, clickEvent)`, `submenu` (`{ items: [...] }`, each child key in `parent_key:child_key` format), `renderer` (returns `HTMLElement`), `disableSelection`, `isCommand`.

```jsx
import { HotTable } from '@handsontable/react-wrapper';
import { ContextMenu } from 'handsontable/plugins/contextMenu';

const contextMenuSettings = {
  callback(key, selection, clickEvent) {
    // Common callback for all options
    console.log(key, selection, clickEvent);
  },
  items: {
    row_above: {
      disabled() {
        // Disable option when first row was clicked
        return this.getSelectedLast()?.[0] === 0; // `this` === hot
      },
    },
    sp1: ContextMenu.SEPARATOR, // separator (key must be unique); '-' also works as a value
    row_below: {
      name: 'Click to add row below', // override a predefined item's label
    },
    about: {
      name() {
        return '<b>Custom option</b>'; // Name can contain HTML
      },
      hidden() {
        return this.getSelectedLast()?.[1] == 0; // hide when first column clicked
      },
      callback() {
        setTimeout(() => alert('Hello world!'), 0); // fire after menu close
      },
    },
    colors: {
      name: 'Colors...',
      submenu: {
        items: [
          { key: 'colors:red', name: 'Red', callback() { /* ... */ } },
          { key: 'colors:green', name: 'Green' },
        ],
      },
    },
  },
};

<HotTable contextMenu={contextMenuSettings} /* ... */ />
```

Row-action callbacks receive visual indexes. Convert to physical before touching source data — sorting/filtering can reorder rows:

```js
duplicate_row: {
  name: 'Duplicate row',
  callback(key, selection) {
    const row = selection[0].start.row; // visual row index
    const rowData = hot.getSourceDataAtRow(hot.toPhysicalRow(row));

    hot.alter('insert_row_below', row, 1);
    hot.populateFromArray(row + 1, 0, [Object.values(rowData)]); // expects a 2-D array
  },
},
```

The top-level `contextMenu` object also accepts `uiContainer` (an `HTMLElement`) to control which DOM element the menu is appended to. The same `items` structure works for `dropdownMenu.items`.

Docs: https://handsontable.com/docs/react-data-grid/context-menu/ · recipe: https://handsontable.com/docs/react-data-grid/recipes/context-menu/custom-context-menu/

## Programmatic Filters API

Enable with `filters: true`; pair with `dropdownMenu: true` for the built-in per-column UI, or `dropdownMenu: false` to keep filtering API-only (external panel). Also: `filters: { searchMode: 'apply' }` makes the filter-by-value search input apply the filter on Enter/OK.

```jsx
const filtersPlugin = hotTableRef.current.hotInstance.getPlugin('filters');

filtersPlugin.clearConditions();                          // clear all (or pass a column index)
filtersPlugin.addCondition(0, 'contains', [enteredName]); // (visualColumn, condition, args)
filtersPlugin.addCondition(1, 'eq', [selectedCategory]);
filtersPlugin.addCondition(2, 'between', [Number(minPrice), Number(maxPrice)]);
filtersPlugin.filter();                                   // apply — nothing changes until this runs
hot.render();
```

Condition name strings used across the docs: `'contains'`, `'eq'`, `'between'`, `'gte'`, `'lte'`, `'lt'`, `'gt'`, `'none'` (matches every row — the programmatic equivalent of the UI's **None** operator is `removeConditions(column)`). The full condition list per cell type is in the Filters plugin API reference. Date/time conditions passed via the API take ISO 8601 strings (`YYYY-MM-DD` for dates, `HH:mm` for times).

Combining conditions on one column — the fourth `addCondition()` argument sets the join logic: `'conjunction'` (AND, default) or `'disjunction'` (OR). Apply the same operation to all conditions in a column; don't mix them:

```js
filters.clearConditions(2);
filters.addCondition(2, 'lt', [200], 'disjunction');
filters.addCondition(2, 'gt', [400], 'disjunction');
filters.filter();
```

Other methods:
- `filters.removeConditions(column)` + `filter()` — clear one column's filter.
- `filters.exportConditions()` / `filters.importConditions(stored)` + `filter()` — save/restore filter state. Exported conditions use **physical** column indexes; `addCondition()` takes **visual**.
- After filtering, `getData()` returns only matching rows; use `getSourceData()` for everything.
- Toggle at runtime with `updateSettings({ filters: true/false, dropdownMenu: ... })`.

Server-side filtering — use `beforeFilter` to capture the conditions, send them to the server, and return `false` to block client-side filtering:

```jsx
<HotTable
  beforeFilter={function (conditionsStack) {
    // conditionsStack: [{ column, conditions: [...] }, ...]
    const [lastChanged] = conditionsStack;
    // ...send to server...
    return false; // don't filter on the front end
  }}
/>
```

UI limitation: the dropdown menu shows at most 2 regular conditions plus 1 filter-by-value condition per column; extra conditions added via `addCondition()` still filter the data but aren't visible or editable in the menu.

Docs: https://handsontable.com/docs/react-data-grid/column-filter/ · recipe: https://handsontable.com/docs/react-data-grid/recipes/filtering-search/multi-column-filter-panel/

## Search plugin

Enable with `search: true` (or a config object). The plugin exposes `query(queryStr, [callback], [queryMethod])` — it tests every cell, sets each cell's `isSearchResult` meta flag, and returns an array of `{ row, col, data }` matches (visual indexes). **You must call `hot.render()` after `query()`** — nothing highlights until re-render.

```js
const searchPlugin = hot.getPlugin('search');

searchInput.addEventListener('input', () => {
  searchPlugin.query(searchInput.value);
  hot.render();
});
```

Matching cells get the `htSearchResult` CSS class. Replace it via `search: { searchResultClass: 'my-class' }` or `hot.getPlugin('search').setSearchResultClass('my-class')`. Scope custom classes under the theme and `.handsontable` selectors (e.g., `.ht-theme-main .handsontable .my-class`).

Custom `queryMethod(query, value, cellProperties)` returns `true` for a match. The default is a case-insensitive, locale-aware substring match. Set it at init (`search: { queryMethod: fn }`), via `setQueryMethod(fn)`, or per `query()` call. Custom `callback(instance, row, col, data, testResult)` runs for every cell; the default sets `instance.getCellMeta(row, col).isSearchResult = testResult` — if you override it (e.g., to count matches), call the default behavior manually so highlighting still works. Both `queryMethod` and `callback` can be overridden per cell/column via a `search` object in `columns` or `setCellMeta()`; `searchResultClass` cannot.

Highlight matched fragments with `<mark>` — a custom renderer reading `isSearchResult` (from the recipe; escape HTML and regex before setting `innerHTML`):

```typescript
import { rendererFactory } from 'handsontable/renderers';

const highlightRenderer = rendererFactory(({ td, value, cellProperties }) => {
  const cellText = value === null || value === undefined ? '' : String(value);
  const query = currentSearchTerm.trim();

  if (!query || !cellProperties.isSearchResult) {
    td.textContent = cellText;
    return;
  }

  const escapedCellText = escapeHtml(cellText);
  const escapedQuery = escapeHtml(query);
  const splitter = new RegExp(`(${escapeRegExp(escapedQuery)})`, 'gi');
  const highlighted = escapedCellText
    .split(splitter)
    .map(fragment => (
      fragment.toLocaleLowerCase() === escapedQuery.toLocaleLowerCase()
        ? `<mark>${fragment}</mark>`
        : fragment
    ))
    .join('');

  td.innerHTML = highlighted;
});
// register per column: { data: 'title', renderer: highlightRenderer }
```

Docs: https://handsontable.com/docs/react-data-grid/searching-values/ · recipes: https://handsontable.com/docs/react-data-grid/recipes/filtering-and-search/external-search-box/ · https://handsontable.com/docs/react-data-grid/recipes/filtering-and-search/highlight-search-matches/

## Custom keyboard shortcuts

Use the `ShortcutManager` API. Shortcuts live in contexts — `grid` (navigating the grid; initial), `editor` (cell editor open), `menu` (context menu open), or custom contexts via `addContext()`. Only the active context's shortcuts run.

```js
const gridContext = hot.getShortcutManager().getContext('grid');

gridContext.addShortcut({
  group: 'insertRowBelow',            // required; used for group-level removal
  keys: [['control/meta', 'enter']],  // array of key combinations
  runOnlyIf: () => hot.getSelected() !== void 0, // optional condition
  callback: () => {
    const selected = hot.getSelectedRangeLast();

    if (!selected || selected.highlight.row === null) {
      return;
    }
    hot.alter('insert_row_below', selected.highlight.row);
  },
});
```

- `keys` accepts `KeyboardEvent.key` names (any case, any order). `control/meta` is Handsontable-specific: `Control` on Windows/Linux, `Meta` on macOS. Use `ArrowLeft` etc., not glyphs.
- Ordering vs existing actions on the same keys: `position: 'before' | 'after'` + `relativeToGroup: 'editorManager.handlingEditor'`.
- Remove: `gridContext.removeShortcutsByKeys(['enter'])` or `removeShortcutsByGroup('group_ID')`.
- Replace: `getShortcuts([...])`, remove, mutate `shortcut.keys`, then `gridContext.addShortcuts(modified)`.
- Block a key entirely: return `false` from the `beforeKeyDown` hook.

Docs: https://handsontable.com/docs/react-data-grid/custom-shortcuts/

## ColumnSummary (aggregates)

Set `columnSummary` to an array of summary objects. Built-in `type` values: `'sum'`, `'min'`, `'max'`, `'count'`, `'average'`, `'custom'`.

```jsx
columnSummary={[
  {
    sourceColumn: 0,        // physical index of the column to summarize
    type: 'sum',
    destinationRow: 4,      // physical coordinates of the result cell
    destinationColumn: 0,
    // reversedRowCoords: true  → destinationRow counts from the bottom
    // ranges: [[0, 2], [4], [6, 8]]  → summarize only these physical row ranges
    // roundFloat: 2, forceNumeric: true, suppressDataTypeErrors: false
  },
]}
```

The plugin does **not** add a row for the result — add an empty bottom row yourself and use `reversedRowCoords: true` with an adjusted `destinationRow`. `columnSummary` can also be a function returning the array (useful for generating one summary per visible column, or nested-group subtotals). For `type: 'custom'`, add `customFunction: function(endpoint) { ... }`. Style summary cells via the auto-assigned `columnSummaryResult` class — don't change the summary row's `className` meta. `roundFloat` changes the value returned by `getDataAtCell()` from `number` to `string`.

### Manual alternative: frozen summary row (recipe)

For a pinned totals row with full control, skip the plugin: include one extra row at the end of `data`, freeze it with `fixedRowsBottom: 1`, and recompute on changes:

- Recalculate from `afterInit` and `afterChange`, scanning only data rows above the summary row; write results with `setDataAtRowProp()`.
- **Trap:** writing data inside `afterChange` re-fires `afterChange`. Pass a custom `source` string (e.g., `'updateSummary'`) to `setDataAtRowProp` and have your handler ignore changes with that source — otherwise you get extra refresh passes or feedback loops.
- Use the `cells(row, col, prop)` callback to return meta only for the summary row: `readOnly: true`, a `className` (e.g., `htSummaryRow`), and for text aggregates `type: 'text'` **plus `validator: undefined`** — overriding `type` doesn't clear the column's numeric validator, which would fail on the aggregate text and paint the cell invalid.
- Read-only cells get the built-in `.htDimmed` background with `!important`; your background rule needs equal specificity and `!important` (e.g., `.handsontable .htSummaryRow.htDimmed { ... }`). Prefer theme variables like `--ht-background-secondary-color`.

Docs: https://handsontable.com/docs/react-data-grid/column-summary/ · recipe: https://handsontable.com/docs/react-data-grid/recipes/rendering-styling/frozen-summary-row/

## Persist column layout (widths + order)

Requires `manualColumnResize: true` and `manualColumnMove`. Save on user changes, restore at init (from the recipe):

```javascript
// Save — widths after resize, order after move
afterColumnResize() {
  const widths = hot.getColHeader().map((_, visualIndex) => hot.getColWidth(visualIndex));
  saveLayout(widths, getCurrentOrder());
},
afterColumnMove(_movedColumns, _finalIndex, _dropIndex, _movePossible, movePerformed) {
  if (!movePerformed) return; // drop didn't change the order
  saveLayout(getCurrentWidths(), getCurrentOrder());
},

// Order = visual-to-physical mapping; there is no bulk getter, iterate:
function getCurrentOrder() {
  const order = [];
  for (let visualIndex = 0; visualIndex < hot.countCols(); visualIndex++) {
    order.push(hot.toPhysicalColumn(visualIndex));
  }
  return order;
}
```

Restore at init: `colWidths: savedWidths` and `manualColumnMove: savedOrder || true` — an array of physical indices sets the initial visual order; `true` enables the feature with default order (`null`/`false` would disable it).

Reset at runtime without recreating the grid:

```javascript
hot.columnIndexMapper.setIndexesSequence(DEFAULT_COL_ORDER); // identity sequence e.g. [0,1,2,3,4,5]

const resizePlugin = hot.getPlugin('manualColumnResize');
DEFAULT_COL_WIDTHS.forEach((width, visualIndex) => {
  resizePlugin.setManualSize(visualIndex, width);
});
hot.render();
```

Don't use `updateSettings({ colWidths, manualColumnMove })` for the reset: `manualColumnMove` reapplies as `moveColumns(array, 0)` on the already-reordered state, and `colWidths` doesn't clear the ManualColumnResize plugin's internal width map. Validate anything read back from `localStorage` before use, and version your storage key (`ht-column-layout-v1`) so schema changes fall back to defaults.

Recipe: https://handsontable.com/docs/react-data-grid/recipes/performance/persist-column-layout/

## UI-state plugins: EmptyDataState, Loading, Dialog

Version notes (from the changelog): Dialog and Loading plugins were introduced in v16.1.0; EmptyDataState in v16.2.0 (which also added the Dialog `template` option).

### EmptyDataState (v16.2+)

Shows an overlay when the grid has no data or all rows are hidden by filters. Enable with `emptyDataState: true` or a config object. `message` is an object or a function of the empty-state `source`:

```jsx
emptyDataState={{
  message: (source) => {
    switch (source) {
      case 'filters':
        return {
          title: 'No results found',
          description: 'Your current filters are hiding all results.',
          buttons: [{
            text: 'Clear Filters',
            type: 'secondary',
            callback: () => {
              const filtersPlugin = hotTableRef.current?.hotInstance.getPlugin('filters');
              if (filtersPlugin) {
                filtersPlugin.clearConditions();
                filtersPlugin.filter();
              }
            },
          }],
        };
      default:
        return {
          title: 'No data available',
          description: "There's nothing to display yet.",
          buttons: [{ text: 'Add Sample Data', type: 'primary', callback: () => { /* loadData(...) */ } }],
        };
    }
  },
}}
```

It integrates with the Filters plugin automatically — with `emptyDataState: true` alone, the overlay switches to a filter-specific message with a "Reset filters" button when filters hide all rows. Default labels are translatable via language-dictionary keys (`EMPTY_DATA_STATE_TITLE`, `EMPTY_DATA_STATE_DESCRIPTION`, `EMPTY_DATA_STATE_TITLE_FILTERS`, `EMPTY_DATA_STATE_DESCRIPTION_FILTERS`, `EMPTY_DATA_STATE_BUTTONS_FILTERS_RESET`).

Docs: https://handsontable.com/docs/react-data-grid/empty-data-state/

### Loading (v16.1+)

Loading overlay built on the Dialog plugin — it requires the Dialog plugin to be enabled to function properly. Enable with `loading: true` or a config object (`icon` — SVG string, `title`, `description`). Control it via the plugin:

```js
const loadingPlugin = hotInstance.getPlugin('loading');

loadingPlugin.show();
// ...await data...
loadingPlugin.hide();
```

Translatable label: `LOADING_TITLE = 'Loading...'`. Docs: https://handsontable.com/docs/react-data-grid/loading/

### Dialog (v16.1+)

Modal overlay on the grid. Enable with `dialog: true` or a config object (e.g., `{ content: '...', closable: true }`; `content` accepts plain text, HTML strings, or DOM elements; other options include background variants `solid`/`semi-transparent`, `contentBackground`, and `a11y`). Programmatic control:

```js
const dialogPlugin = hotInstance.getPlugin('dialog');

dialogPlugin.show();
dialogPlugin.hide();

// Predefined templates:
dialogPlugin.showAlert(
  { title: 'Alert', description: 'This is an example of the alert dialog.' },
  () => { dialogPlugin.hide(); }, // OK callback
);

dialogPlugin.showConfirm(
  'Do you want to undo the last action?',
  () => { hotInstance.getPlugin('undoRedo').undo(); dialogPlugin.hide(); }, // confirm
  () => { dialogPlugin.hide(); },                                          // cancel
);
```

Docs: https://handsontable.com/docs/react-data-grid/dialog/

## Module registration (tree-shaking)

Import the base module from `handsontable/base` (not `handsontable`, which is the full distribution), then register only what you use:

```js
import Handsontable from 'handsontable/base';

// cell types
import { registerCellType, NumericCellType } from 'handsontable/cellTypes';
registerCellType(NumericCellType);

// plugins
import { registerPlugin, ContextMenu } from 'handsontable/plugins';
registerPlugin(ContextMenu);

// translations
import { registerLanguageDictionary, plPL } from 'handsontable/i18n';
registerLanguageDictionary(plPL);
```

Fallback — register everything (what most examples do):

```js
import Handsontable from 'handsontable/base';
import { registerAllModules } from 'handsontable/registry';

registerAllModules();
```

Bulk registering functions from `handsontable/registry`: `registerAllCellTypes()`, `registerAllRenderers()`, `registerAllEditors()`, `registerAllValidators()`, `registerAllPlugins()`, `registerAllModules()`. The base module covers only core functionality and the `text` cell type — any cell type or plugin you configure but never import/register is simply not available. Two base-module gotchas from the docs: it doesn't resize columns to fit content (import `AutoColumnSize`/`AutoRowSize`), and the filtering feature needs both `Filters` and `DropdownMenu` plugin modules. The `Formulas` module additionally requires the external `hyperformula` package.

Docs: https://handsontable.com/docs/react-data-grid/modules/

## Pitfalls

- **Forgetting `filter()` / `render()`**: `addCondition()` and `clearConditions()` stage changes only — nothing happens until `filtersPlugin.filter()`. Likewise `searchPlugin.query()` only updates `isSearchResult` meta; highlights appear after `hot.render()`.
- **Stale filter conditions**: before applying a new set of filter conditions, clear the previous ones with `clearConditions()` — the external-panel pattern is clear-all, re-add, `filter()`.
- **Visual vs physical indexes**: context-menu `selection[0].start.row`, `addCondition()`'s column, and search results are visual; `getSourceDataAtRow()`, `columnSummary` coordinates, and `exportConditions()` output are physical. Convert with `toPhysicalRow()` / `toPhysicalColumn()`.
- **`afterChange` feedback loops**: writing cells from inside `afterChange` (summary rows) re-triggers the hook. Pass a custom `source` to `setDataAtRowProp()` and bail out when you see it.
- **`getData()` after filtering** returns only rows that pass the filters — filtering removes non-matching rows from the data map rather than hiding them. Use `getSourceData()` for the full dataset.
- **Overriding `type` in the `cells` callback doesn't clear inherited props**: a summary cell set to `type: 'text'` over a numeric column keeps the column's numeric validator unless you also set `validator: undefined`.

---

## skills/handsontable/references/type-definitions.md

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
