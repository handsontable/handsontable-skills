#!/usr/bin/env node
// Finds what has to change in a project moving from Handsontable DataGrid 18.1 to 19.0, and
// applies the two changes that are purely mechanical.
//
// Every rule maps to a section of the official migration guide:
//   https://handsontable.com/docs/javascript-data-grid/migration-from-18.1-to-19.0/
// The guide lists more changes than a text scan can find (see the note the report ends with).
//
// Usage:
//   node migrate-v19.mjs [paths...] [options]     (default path: the project directory)
//
// Options:
//   --project <dir>  Project root (default: cwd). Paths are resolved from it, its package.json is
//                    checked, and the installed handsontable version is read from it.
//   --ht-dir <dir>   Explicit handsontable package directory, instead of resolving it from --project.
//   --write          Apply the automatic fixes. Without it nothing is changed (dry run).
//   --json           Machine-readable output.
// Any other flag is a usage error, so a typo such as `--writ` cannot turn into a silent dry run.
//
// Automatic fixes (with --write):
//   - `columnHeaders` -> `colHeaders` in the options of an ExportFile call on the same line
//     (`downloadFile(...)`, `exportAsString(...)`, `exportAsBlob(...)` and their async forms).
//   - the `sr-SP` language -> `sr-Latn-RS` (`'sr-SP'`, `sr-SP.js` / `sr-SP.mjs`, `srSP`). Only in files
//     that mention Handsontable, and only once 19.x is installed: 18.x has no `sr-Latn-RS`.
//
// The report has three parts:
//   - "Needs a manual change": code that stops working in 19.0 or is deprecated. Sets exit code 1.
//   - "Review": places where 19.0 behaves differently and the code may already be fine. A `height`,
//     `rowHeights` or `colToProp()` line stays in the report after you have checked it, so these
//     do not affect the exit code.
//   - Notes.
//
// Exit code: 0 = nothing left to change by hand, 1 = manual changes reported, 2 = usage error.

import fs from 'node:fs';
import path from 'node:path';
import { MENTIONS_HANDSONTABLE, WRAPPERS, lineOf, rangeMajor, runCodemod } from './lib/codemod.mjs';

const GUIDE = 'https://handsontable.com/docs/javascript-data-grid/migration-from-18.1-to-19.0/';
const usesHandsontable = text => MENTIONS_HANDSONTABLE.test(text);
const EXPORT_CALL = /\b(downloadFile|exportAsString|exportAsBlob)(Async)?\s*\(/;
// Minimum browser versions of 19.0, keyed by the names Browserslist uses.
const MIN_BROWSERS = { chrome: 130, edge: 130, firefox: 132, safari: 18.2, ios_saf: 18.2, ios: 18.2 };

const LINE_RULES = [
  {
    id: 'removed-license-key',
    test: /non-commercial-and-evaluation|ht68e-1f2b7-47158-70b05-0842f/i,
    message: '19.0 no longer recognizes the `non-commercial-and-evaluation` key or its second form ' +
      '`ht68e-1f2b7-47158-70b05-0842f`: both read as invalid and a lock screen covers the grid. Before you upgrade, ' +
      'pass a trial key (https://handsontable.com/pricing/), a commercial key, or the sponsored key that ' +
      'non-commercial projects apply for.',
    url: GUIDE,
  },
  {
    id: 'angular-non-commercial-constant',
    when: 'code',
    test: /\bNON_COMMERCIAL_LICENSE\b/,
    message: '`NON_COMMERCIAL_LICENSE` from `@handsontable/angular-wrapper` is deprecated and holds the key 19.0 removed, ' +
      'so a grid configured with it shows the lock screen. Pass your own key in `HOT_GLOBAL_CONFIG`.',
    url: GUIDE,
  },
  {
    id: 'resize-state-methods',
    when: 'code',
    test: /\b(save|load)Manual(ColumnWidths|RowHeights)\s*\(/,
    message: '`saveManualColumnWidths()` / `loadManualColumnWidths()` / `saveManualRowHeights()` / `loadManualRowHeights()` ' +
      'were removed in 19.0 and throw `TypeError: ... is not a function`. Remove the calls. To persist sizes, record them ' +
      'in `afterColumnResize` / `afterRowResize` and pass the arrays back through `manualColumnResize` / `manualRowResize`.',
    url: GUIDE,
  },
  {
    id: 'helper-sanitize',
    when: 'code',
    test: /\bhelper\s*\.\s*sanitize\s*\(/,
    fileIf: usesHandsontable,
    message: '`Handsontable.helper.sanitize()` was removed in 19.0 (since 18.0 it returned its input unchanged). Remove the ' +
      'call and use its argument directly; to sanitize the HTML the grid renders, set the `sanitizer` option.',
    url: GUIDE,
  },
  {
    id: 'export-column-headers',
    when: 'code',
    test: /\bcolumnHeaders\s*:/,
    fileIf: text => EXPORT_CALL.test(text) || /\bexportFile\b/.test(text),
    fix: line => (EXPORT_CALL.test(line) ? line.replace(/\bcolumnHeaders(\s*:)/g, 'colHeaders$1') : undefined),
    message: 'The `columnHeaders` export option of the ExportFile plugin was removed in 19.0: it is ignored with a console ' +
      'warning and the export has no header row. Rename it to `colHeaders` (same value). Check that the line belongs ' +
      'to an export call before renaming.',
    url: GUIDE,
  },
  {
    id: 'removed-export-settings-type',
    when: 'code',
    test: /\bSettings\b[^;]*(['"])handsontable\/plugins\/exportFile\1/,
    message: 'The `Settings` type of `handsontable/plugins/exportFile` was removed in 19.0. Import `ExportFileSettings`.',
    url: GUIDE,
  },
  {
    id: 'removed-data-provider-options-type',
    when: 'code',
    test: /\bDataProviderOptions\b/,
    fileIf: usesHandsontable,
    message: 'The `DataProviderOptions` type of `handsontable/plugins/dataProvider` was removed in 19.0. Import ' +
      '`DataProviderFetchOptions`.',
    url: GUIDE,
  },
  {
    id: 'before-init-in-settings',
    when: 'code',
    test: /\bbeforeInit\s*(:|\(|=\s*\{)/,
    exclude: /['"]beforeInit['"]|\.\s*beforeInit\s*\(/,
    fileIf: usesHandsontable,
    review: true,
    message: 'A `beforeInit` callback in the settings object runs in 19.0 (in 18.1 it never ran). The data is not loaded ' +
      'yet, so `countRows()`, `getData()` and `hot.view` methods throw and the grid never finishes building. Move code ' +
      'that reads the grid to `afterInit`.',
    url: GUIDE,
  },
  {
    id: 'height-auto',
    when: 'code',
    test: /\bheight\s*[:=]\s*\{?\s*['"]auto['"]/,
    fileIf: usesHandsontable,
    review: true,
    message: '`height: \'auto\'` no longer clips the grid in 19.0: the grid grows to fit its rows and the page or the ' +
      'nearest scrolling ancestor scrolls it. Set a numeric `height` to keep an inner scrollbar.',
    url: GUIDE,
  },
  {
    id: 'row-heights-exact',
    when: 'code',
    test: /\browHeights\s*[:=]/,
    fileIf: usesHandsontable,
    review: true,
    message: '`rowHeights` sets an exact row height in 19.0 (it was a minimum), so taller content is clipped unless ' +
      '`autoRowSize` is on. Rename it to `minRowHeights` to keep the minimum.',
    url: GUIDE,
  },
  {
    id: 'sizes-physical-index',
    when: 'code',
    test: /\b(colWidths|rowHeights|minRowHeights)\s*[:=]\s*\{?\s*(\[|function\b|\(|[A-Za-z_$][\w$]*\s*=>)/,
    fileIf: usesHandsontable,
    review: true,
    message: 'Array and function `colWidths`, `rowHeights` and `minRowHeights` address columns and rows by physical index ' +
      'in 19.0 (they used the visual one), so a size follows its column or row through a move, sort or filter. List ' +
      'sizes in data order and remove code that re-synced them.',
    url: GUIDE,
  },
  {
    id: 'col-prop-null',
    when: 'code',
    test: /\.\s*(colToProp|propToCol)\s*\(/,
    review: true,
    message: '`colToProp()` and `propToCol()` return `null` for a column that does not exist (they returned the argument). ' +
      'Check the result before using it; for `propToCol()` use `Number.isInteger()`, because `null < countCols()` is true.',
    url: GUIDE,
  },
  {
    id: 'copyable-data-string',
    when: 'code',
    test: /\.\s*getCopyable(Source)?Data\s*\(/,
    review: true,
    message: '`getCopyableData()` returns a string in 19.0 (it returned the stored value), and `getCopyableSourceData()` is ' +
      'typed `unknown`. To read the stored value, call `getDataAtCell()`.',
    url: GUIDE,
  },
  {
    id: 'custom-editor-set-value',
    when: 'code',
    test: /\bextends\s+[\w.]*\b(BaseEditor|TextEditor|HotCellEditorComponent)\b|\beditorFactory\s*\(|\buseHotEditor\s*\(|<EditorComponent\b/,
    fileIf: usesHandsontable,
    review: true,
    message: 'A custom editor\'s `setValue()` receives the cell value in 19.0 (a number, an object, `null`), not a string. ' +
      'This reaches editors that extend `BaseEditor`, are built with `editorFactory`, or extend `TextEditor` and ' +
      'override `setValue()` without `super.setValue()`, and React (`useHotEditor`, `EditorComponent`) and Angular ' +
      '(`HotCellEditorComponent`) editors. Convert it yourself: `value == null ? \'\' : String(value)`.',
    url: GUIDE,
  },
  {
    id: 'icon-pseudo-element',
    test: new RegExp('(\\.htItemWrapper|\\.ht-page-size-section__select-wrapper|\\.changeType|\\.htUISelectCaption|' +
      '\\.htAutocompleteArrow|\\.columnSorting|\\.ht-page-(first|prev|next|last)|span\\.selected|' +
      '\\.htCheckboxRendererInput|\\.(before|after)Hidden(Column|Row)|\\.collapsibleIndicator|\\.ht_nestingButton|' +
      '\\.htUIRadio|\\.ht-multi-select-chip-remove|\\.ht-notification__close|\\.ht-multi-select-editor-item-selected)' +
      '[^{},]*::?(before|after)\\b'),
    message: 'Built-in icons are `<i class="ht-icon ht-icon-<name>">` elements in 19.0, not `::before` / `::after` ' +
      'pseudo-elements, so this selector no longer matches. Target the matching `.ht-icon-<name>` class (the guide has ' +
      'the full mapping), or override the `--ht-icon-<name>` variable to change only the glyph.',
    url: GUIDE,
  },
  {
    id: 'icons-map-helper',
    when: 'code',
    test: /\biconsMap\b/,
    fileIf: usesHandsontable,
    message: 'The `iconsMap` helper is deprecated in 19.0. Custom themes use `iconStyles()` instead.',
    url: GUIDE,
  },
  {
    id: 'splice-col-row',
    when: 'code',
    test: /\.\s*splice(Col|Row)\s*\(/,
    message: '`spliceCol()` and `spliceRow()` are deprecated in 19.0 and removed in 20.0. Change the data yourself and ' +
      'write it back with `populateFromArray()`, or use `alter()` to add or remove whole rows and columns.',
    url: GUIDE,
  },
  {
    id: 'formulas-shortcut-methods',
    when: 'code',
    test: /\.\s*(un)?registerShortcuts\s*\(/,
    fileIf: text => /formulas/i.test(text) && usesHandsontable(text),
    message: '`registerShortcuts()` and `unregisterShortcuts()` of the Formulas plugin do nothing since 19.0 and are removed ' +
      'in 20.0. Remove the calls; nothing replaces them.',
    url: GUIDE,
  },
  {
    id: 'merged-cells-collection-methods',
    when: 'code',
    test: /\.\s*get(StartMostColumn|EndMostColumn|TopMostRow|BottomMostRow)Index\s*\(/,
    message: 'The `getStartMostColumnIndex()`, `getEndMostColumnIndex()`, `getTopMostRowIndex()` and ' +
      '`getBottomMostRowIndex()` methods of `MergedCellsCollection` are deprecated in 19.0 and removed in 20.0. Remove ' +
      'the calls; there is no replacement.',
    url: GUIDE,
  },
  {
    id: 'sr-sp-language',
    when: 'code',
    test: /(['"`])sr-SP\1|\bsr-SP\.m?js\b|\bsrSP\b/,
    fileIf: usesHandsontable,
    fixWhen: opts => opts.on19,
    fix: line => line.replace(/(['"`])sr-SP\1/g, '$1sr-Latn-RS$1').replace(/\bsr-SP(\.m?js)\b/g, 'sr-Latn-RS$1')
      .replace(/\bsrSP\b/g, 'srLatnRS'),
    message: 'The `sr-SP` language code (the `sr-SP.js` file and the `srSP` dictionary) is deprecated in 19.0 and removed ' +
      'in 20.0. Use `sr-Latn-RS` (`sr-Latn-RS.js`, `srLatnRS`), which has the same phrases.',
    url: GUIDE,
  },
];

/** Multi-line patterns that line rules cannot see. */
const BLOCK_RULES = [
  {
    id: 'dropdown-strict-false',
    when: 'code',
    test: /type\s*:\s*['"]dropdown['"][^{}]*?\bstrict\s*:\s*false|\bstrict\s*:\s*false[^{}]*?type\s*:\s*['"]dropdown['"]/g,
    review: true,
    message: 'A `dropdown` column with `strict: false` validates strictly on every path in 19.0, so a value outside ' +
      '`source` that arrives by paste, autofill or the API is marked invalid. To accept such values, use an ' +
      '`autocomplete` column with `strict: false`.',
    url: GUIDE,
  },
];

/** Lowest version a Browserslist query such as "chrome >= 110" or "Safari 14.1" allows, per browser. */
function oldBrowsers(queries) {
  const found = [];

  for (const query of queries) {
    const m = String(query).match(/^\s*(chrome|edge|firefox|safari|ios_saf|ios)\s*(?:>=|>)?\s*(\d+(?:\.\d+)?)\s*$/i);

    if (m && Number(m[2]) < MIN_BROWSERS[m[1].toLowerCase()]) {
      found.push(String(query).trim());
    }
  }

  return found;
}

function browserslistQueries(dir, pkg) {
  const sources = [];
  const list = pkg.browserslist;

  if (Array.isArray(list)) {
    sources.push({ file: path.join(dir, 'package.json'), queries: list });
  } else if (typeof list === 'string') {
    sources.push({ file: path.join(dir, 'package.json'), queries: [list] });
  } else if (list && typeof list === 'object') {
    sources.push({ file: path.join(dir, 'package.json'), queries: Object.values(list).flat() });
  }

  const rc = path.join(dir, '.browserslistrc');

  if (fs.existsSync(rc)) {
    const queries = fs.readFileSync(rc, 'utf8').split('\n').map(l => l.replace(/#.*/, '').trim())
      .filter(l => l && !l.startsWith('['));

    sources.push({ file: rc, queries });
  }

  // One entry can hold several queries: "chrome >= 110, firefox >= 110".
  return sources.map(s => ({ file: s.file, queries: s.queries.flatMap(q => String(q).split(/,|\bor\b/)) }));
}

function checkPackageJson({ file, pkg, deps, dir }, out) {
  const add = (rule, at, message) => out.manual.push({ rule, file: at, line: null, text: '', message, url: GUIDE });
  const major = rangeMajor(deps.handsontable);

  if (deps.handsontable && major !== null && major < 19) {
    const wrappers = WRAPPERS.filter(w => deps[w]);

    add('package-version', file, `handsontable is "${deps.handsontable}". Bump it to ^19` +
      `${wrappers.length ? ` together with ${wrappers.join(', ')} (the 19.x wrappers peer-require handsontable ^19.0.0)` : ''}` +
      ' once the other items in this report are handled.' +
      (major < 18 ? ' This project is older than 18.x: run migrate-v18.mjs first.' : ''));
  }

  for (const wrapper of WRAPPERS) {
    if (deps[wrapper] && deps.handsontable && rangeMajor(deps[wrapper]) !== major) {
      add('wrapper-version', file, `${wrapper} is "${deps[wrapper]}" but handsontable is "${deps.handsontable}". ` +
        'The 19.x wrappers peer-require handsontable ^19; keep the majors aligned.');
    }
  }

  for (const source of browserslistQueries(dir, pkg)) {
    out.hasBrowserslist = true;

    const old = oldBrowsers(source.queries);

    if (old.length) {
      add('browser-targets', source.file, `Browserslist targets below the 19.0 minimum: ${old.join(', ')}. 19.0 runs on ` +
        'Chrome and Edge 130, Firefox 132, and Safari 18.2 (macOS and iOS). Raise the targets, or stay on 18.1.');
    }
  }
}

function finish(out, opts) {
  // Loading throws without Dialog only when modules are registered one by one.
  if (out.loadingAt && !out.registersDialog && !out.registersAll) {
    out.manual.push({
      rule: 'loading-needs-dialog', file: out.loadingAt.file, line: out.loadingAt.line, text: out.loadingAt.text,
      message: '`registerPlugin(Loading)` without `registerPlugin(Dialog)`: in 19.0 `new Handsontable()` throws "The Loading ' +
        'plugin requires the following modules: Dialog (plugin)". Register `Dialog` next to `Loading`.',
      url: GUIDE,
    });
  }

  if (!opts.on19 && out.manual.some(item => item.rule === 'sr-sp-language')) {
    out.notes.push('`sr-SP` is reported, not rewritten, because ' +
      (opts.major === null ? 'the installed handsontable version could not be determined' : `the project is on handsontable ${opts.major}.x`) +
      ', which has no `sr-Latn-RS`. Upgrade to 19.x and run again with --write.');
  }

  out.notes.push('19.0 runs on Chrome and Edge 130, Firefox 132, and Safari 18.2 (macOS and iOS); 18.1 ran on Chrome 110, ' +
    'Firefox 110, and Safari 14.1. ' + (out.hasBrowserslist
    ? 'Only explicit version queries in the Browserslist config were checked; check queries such as `defaults` or ' +
      '`last 2 versions` yourself.'
    : 'No Browserslist config was found, so check the browsers your users run.'));

  out.notes.push('This scan finds code patterns. The guide lists more changes that only show at run time: undo and redo ' +
    'restore a recorded state, confirming an editor without typing writes nothing, the React and Angular wrappers ' +
    'pass only the settings that changed, a hook set to `null` is removed, `editor: false` reaches typed columns, ' +
    'list cells default to one line, and entitlement license keys are checked more strictly (pass the key exactly ' +
    'as issued). Read "Before you upgrade" and "Changes in every grid" in full: ' + GUIDE);
}

runCodemod({
  lineRules: LINE_RULES,
  blockRules: BLOCK_RULES,
  state: { loadingAt: null, registersDialog: false, registersAll: false, hasBrowserslist: false },
  options: (flags, major) => ({ on19: major !== null && major >= 19 }),
  inspectFile({ file, kind, text }, out) {
    if (kind !== 'code') return;

    const loading = text.match(/\bregisterPlugin\s*\(\s*Loading\s*\)/);

    if (loading && !out.loadingAt) {
      out.loadingAt = { file, line: lineOf(text, loading.index), text: loading[0] };
    }
    if (/\bregisterPlugin\s*\(\s*Dialog\s*\)/.test(text)) out.registersDialog = true;
    if (/\bregisterAll(Modules|Plugins)\s*\(/.test(text)) out.registersAll = true;
  },
  checkPackageJson,
  finish,
});
