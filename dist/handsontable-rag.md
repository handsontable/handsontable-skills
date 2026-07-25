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
> warning, and `correctFormat` was removed.

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
- **Legacy date/time formatting options removed in v18**: the `date` and `time` cell types were **not** removed — they were reimplemented natively (moment.js and Pikaday are gone), and `intl-date` / `intl-time` are interchangeable names for the same implementations. All four use object-based format options (`Intl.DateTimeFormat` shape) and require ISO 8601 source data (`YYYY-MM-DD` for dates; 24-hour `HH:mm`, `HH:mm:ss`, or `HH:mm:ss.SSS` for times). The old string `dateFormat`/`timeFormat` and `datePickerConfig` options are ignored with a console warning; `correctFormat` was removed. The editor is now a native `<input type="date">` / `<input type="time">`.
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
- **Date/time cell types reimplemented natively.** moment.js and Pikaday were removed, but the `date` and `time` type names remain and are interchangeable with the new `intl-date` / `intl-time` names (same implementation). Formats are `Intl.DateTimeFormat`-shaped option objects, source data must be ISO 8601, and the editor is a native date/time input. String `dateFormat`/`timeFormat` and `datePickerConfig` are ignored with a console warning; `correctFormat` is removed.
- **Legacy numeric formatting removed.** `numericFormat.pattern` and `numericFormat.culture` (numbro syntax) are gone. Use `Intl.NumberFormat` options + `locale`.
- **DOMPurify dropped.** HTML in headers, menus, dialogs, and select editors is no longer auto-sanitized. Pass a `sanitizer: (html) => …` function if you render untrusted HTML.
- **`saveManualColumnWidths()` / `loadManualColumnWidths()` / `saveManualRowHeights()` / `loadManualRowHeights()` are deprecated no-ops.** These ManualColumnResize / ManualRowResize methods lost their storage when the PersistentState plugin was removed in v17.0; in v18.0 they only log a deprecation warning (`load…` returns `[]`). Note: the v18.0 changelog also re-lists the PersistentState plugin and core `hot.undo()` / `hot.redo()` removals, but both actually shipped in v17.0 (see v17.0 Breaking Changes below).
- **New layout system.** New `layout` option orders plugin UI elements in the `top` and `bottom` wrapper slots. New DOM elements (`.ht-slot-top`, `.ht-slot-bottom`, `.ht-overlay`, `.ht-grid-content`) — audit custom CSS.
- **Theme tokens.** `--ht-wrapper-border-radius` renamed to `--ht-border-radius`; `--ht-wrapper-border-width` and `--ht-wrapper-border-color` removed.
- **Angular support broadened.** Angular 16–22 (was 17–19 in v17.1).
- **New options:** `hashRevealDelay` (password cells), `visibleWhen` (nested headers), `layout`.
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
