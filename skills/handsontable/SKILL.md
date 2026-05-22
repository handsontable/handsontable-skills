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

- **Latest version:** 17.1.0 (May 2026)
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

To pin a specific version, add `@17.1` after `handsontable` in the URL (e.g.,
`handsontable@17.1/dist/handsontable.full.min.js`).

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

### Angular (v17–19)

```bash
npm install handsontable @handsontable/angular-wrapper
```

The Angular wrapper was modernized in Handsontable v17.1 to align with Angular 17–19, simplifying setup and reducing dependencies. Earlier Angular versions are no longer the target — upgrade Angular first if you're below v17.

Docs: https://handsontable.com/docs/angular-data-grid/installation/

### Vue 3

```bash
npm install handsontable @handsontable/vue3
```

Docs: https://handsontable.com/docs/react-data-grid/vue3-installation/

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
  `autocomplete`, `password`, `handsontable` (nested grid), `multiselect` (v17+)

```jsx
columns={[
  { data: 'name', type: 'text' },
  { data: 'price', type: 'numeric', numericFormat: { pattern: '$0,0.00' } },
  { data: 'active', type: 'checkbox' },
  { data: 'category', type: 'dropdown', source: ['A', 'B', 'C'] },
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

> **Note:** Starting in Handsontable v18, HyperFormula will no longer be bundled. Install it
> separately and pass it to the Formulas plugin.

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

## Server-side data with DataProvider (v17.1+)

The **DataProvider plugin** (new in v17.1) wires the grid up to a remote data source so rows are fetched, mutated, and persisted server-side instead of held in memory. Use it for datasets too large to load up front, or when the source of truth lives in a backend.

Enable by passing a `dataProvider` table option:

```jsx
<HotTable
  colHeaders={['ID', 'Name', 'Price']}
  height="auto"
  licenseKey="non-commercial-and-evaluation"
  dataProvider={{
    async load({ offset, limit, sortConfig, filters }) {
      const res = await fetch(
        `/api/products?offset=${offset}&limit=${limit}`
      );
      const { rows, total } = await res.json();
      return { rows, total };
    },
    async update({ row, changes }) {
      await fetch(`/api/products/${row.id}`, {
        method: 'PATCH',
        body: JSON.stringify(changes),
      });
    },
  }}
/>
```

The plugin pages rows as the user scrolls and routes edits through your `update` handler — the grid does not own the data. Combine with the Pagination, ColumnSorting, and Filters plugins for fully server-driven sort/filter/paginate.

Plugin docs: https://handsontable.com/docs/react-data-grid/api/data-provider/

## Notifications (v17.1+)

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
- **ExportFile `columnHeaders` renamed**: In v17.1 the ExportFile plugin's `columnHeaders` option was renamed to `colHeaders` to match the table-level option. Update any `exportAsString` / `exportAsBlob` / `downloadFile` calls that pass `columnHeaders: ...`.

---

## Version Awareness

Handsontable docs are versioned. The latest docs live at `/docs/react-data-grid/` (which redirects
to the current version). To link to a specific version, use `/docs/17.0/react-data-grid/`.

When helping a user, check which version they are on — breaking changes between major versions are
common. Point them to the relevant migration guide if they're upgrading.

For the full organized directory of documentation links, read `references/docs-map.md` in this
skill's folder.

### v17.1 changes (latest, May 2026)

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
- Removed the PersistentState plugin.
- Deprecated bundled HyperFormula (will require separate install in v18).
- Deprecated numbro.js, Pikaday, moment.js, DOMPurify — use native alternatives.

Migration guide: https://handsontable.com/docs/react-data-grid/migration-from-16.2-to-17.0/
