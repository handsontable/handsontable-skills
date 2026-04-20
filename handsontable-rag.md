# handsontable skill

_Flattened single-doc build of `handsontable-skill/` for RAG ingestion. Source of truth is the skill directory._

---

## handsontable-skill/SKILL.md

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

- **Latest version:** 17.0.0 (March 2026)
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

To pin a specific version, add `@17.0` after `handsontable` in the URL (e.g.,
`handsontable@17.0/dist/handsontable.full.min.js`).

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

### Angular (v16+)

```bash
npm install handsontable @handsontable/angular-wrapper
```

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
HyperFormula functions list: https://hyperformula.handsontable.com/guide/built-in-functions.html
HyperFormula version compatibility table: https://handsontable.com/docs/react-data-grid/formula-calculation/#hyperformula-version-support

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

---

## Version Awareness

Handsontable docs are versioned. The latest docs live at `/docs/react-data-grid/` (which redirects
to the current version). To link to a specific version, use `/docs/17.0/react-data-grid/`.

When helping a user, check which version they are on — breaking changes between major versions are
common. Point them to the relevant migration guide if they're upgrading.

For the full organized directory of documentation links, read `references/docs-map.md` in this
skill's folder.

### v17.0 Breaking Changes (latest)

- Removed legacy wrapper packages (`@handsontable/react`, `@handsontable/angular`). Use
  `@handsontable/react-wrapper` and `@handsontable/angular-wrapper`.
- Removed legacy CSS (`handsontable.full.min.css`). Use `handsontable/styles/` imports.
- Removed core-js from dependencies.
- Removed the PersistentState plugin.
- Deprecated bundled HyperFormula (will require separate install in v18).
- Deprecated numbro.js, Pikaday, moment.js, DOMPurify — use native alternatives.

Migration guide: https://handsontable.com/docs/react-data-grid/migration-from-16.2-to-17.0/

---

## handsontable-skill/references/docs-map.md

# Handsontable Documentation Map

> Last verified: March 2026

Organized link directory for all Handsontable and HyperFormula (in-grid) documentation. Use these
to point users to the right page. Links default to the React docs; replace `react-data-grid` with
`javascript-data-grid`, `angular-data-grid`, or prefix with `vue3-` for other frameworks.

## Getting Started
- Installation: https://handsontable.com/docs/react-data-grid/installation/
- Demo: https://handsontable.com/docs/react-data-grid/demo/
- Binding to data: https://handsontable.com/docs/react-data-grid/binding-to-data/
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
- Date: https://handsontable.com/docs/react-data-grid/date-cell-type/
- Time: https://handsontable.com/docs/react-data-grid/time-cell-type/
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
- HyperFormula built-in functions list: https://hyperformula.handsontable.com/guide/built-in-functions.html
- HyperFormula configuration options: https://hyperformula.handsontable.com/guide/configuration-options.html
- HyperFormula custom functions: https://hyperformula.handsontable.com/guide/custom-functions.html
- HyperFormula named expressions: https://hyperformula.handsontable.com/guide/cell-references.html#relative-references
- HyperFormula license key: https://hyperformula.handsontable.com/guide/license-key.html

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
- Plugins index: https://handsontable.com/docs/react-data-grid/api/plugins/

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
- Pagination: https://handsontable.com/docs/react-data-grid/api/pagination/
- Search: https://handsontable.com/docs/react-data-grid/api/search/
- StretchColumns: https://handsontable.com/docs/react-data-grid/api/stretch-columns/
- TrimRows: https://handsontable.com/docs/react-data-grid/api/trim-rows/
- UndoRedo: https://handsontable.com/docs/react-data-grid/api/undo-redo/

## Recipes (new in v17)
- Recipes index: https://handsontable.com/docs/react-data-grid/recipes/

## Upgrade & Migration
- Changelog: https://handsontable.com/docs/react-data-grid/changelog/
- Versioning policy: https://handsontable.com/docs/react-data-grid/versioning-policy/
- Deprecation policy: https://handsontable.com/docs/react-data-grid/deprecation-policy/
- Long Term Support (LTS): https://handsontable.com/docs/react-data-grid/long-term-support/
- 16.2 → 17.0 migration: https://handsontable.com/docs/react-data-grid/migration-from-16.2-to-17.0/
- 16.0 → 16.1 migration: https://handsontable.com/docs/react-data-grid/migration-from-16.0-to-16.1/
- 15.3 → 16.0 migration: https://handsontable.com/docs/react-data-grid/migration-from-15.3-to-16.0/
- 14.6 → 15.0 migration: https://handsontable.com/docs/react-data-grid/migration-from-14.6-to-15.0/

## Other Framework Installation
- JavaScript: https://handsontable.com/docs/javascript-data-grid/installation/
- Angular: https://handsontable.com/docs/angular-data-grid/installation/
- Vue 3: https://handsontable.com/docs/react-data-grid/vue3-installation/

## SSR Examples (CodeSandbox)
- Next.js: https://handsontable.com/codesandbox-vm?example-dir=next.js&handsontable-version=17.0
- Astro: https://handsontable.com/codesandbox-vm?example-dir=astro&handsontable-version=17.0
- Remix: https://handsontable.com/codesandbox-vm?example-dir=remix&handsontable-version=17.0
- Nuxt: https://handsontable.com/codesandbox-vm?example-dir=nuxt&handsontable-version=17.0

## CDN Links (jsDelivr) — latest
- JS (full bundle): https://cdn.jsdelivr.net/npm/handsontable/dist/handsontable.full.min.js
- Base CSS: https://cdn.jsdelivr.net/npm/handsontable/styles/handsontable.min.css
- Theme Main: https://cdn.jsdelivr.net/npm/handsontable/styles/ht-theme-main.min.css
- Theme Horizon: https://cdn.jsdelivr.net/npm/handsontable/styles/ht-theme-horizon.min.css
- Theme Classic: https://cdn.jsdelivr.net/npm/handsontable/styles/ht-theme-classic.min.css
- React wrapper: https://cdn.jsdelivr.net/npm/@handsontable/react-wrapper/dist/react-handsontable.min.js
- HyperFormula: https://cdn.jsdelivr.net/npm/hyperformula/dist/hyperformula.full.min.js

Pin versions by adding `@17.0` after the package name (e.g., `handsontable@17.0`).

## Package Registries
- npm: https://www.npmjs.com/package/handsontable
- NuGet: https://www.nuget.org/packages/handsontable

## Community & Support
- Developer Forum: https://forum.handsontable.com/
- GitHub Issues: https://github.com/handsontable/handsontable/issues
- Stack Overflow: https://stackoverflow.com/tags/handsontable
- Commercial support: support@handsontable.com
- Contact form: https://handsontable.com/contact
- Blog / Release Notes: https://handsontable.com/blog/categories/release-notes
- Download page: https://handsontable.com/download
