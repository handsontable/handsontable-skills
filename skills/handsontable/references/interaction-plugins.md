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
