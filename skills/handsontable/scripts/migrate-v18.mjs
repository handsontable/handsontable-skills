#!/usr/bin/env node
// Finds what has to change in a project moving to Handsontable DataGrid 18.x
// (from 17.x, or from an older version that already removed the 17.0 items),
// and applies the changes that are purely mechanical.
//
// Every rule maps to a section of the official migration guides:
//   https://handsontable.com/docs/javascript-data-grid/migration-from-17.1-to-18.0/
//   https://handsontable.com/docs/javascript-data-grid/migration-from-16.2-to-17.0/
//
// Usage:
//   node migrate-v18.mjs [paths...] [options]     (default path: the project directory)
//
// Options:
//   --project <dir>  Project root (default: cwd). Paths are resolved from it, its package.json is
//                    checked, and the installed handsontable version is read from it.
//   --ht-dir <dir>   Explicit handsontable package directory, instead of resolving it from --project.
//   --write          Apply the automatic fixes. Without it nothing is changed (dry run).
//   --base           Rewrite `handsontable/common` to `handsontable/base` instead of `handsontable`.
//   --json           Machine-readable output.
// Any other flag is a usage error, so a typo such as `--writ` cannot turn into a silent dry run.
//
// Automatic fixes (with --write):
//   - `handsontable/common` imports  -> `handsontable` (or `handsontable/base`)
//   - `--ht-wrapper-border-radius`   -> `--ht-border-radius`
//   - `wrapperBorderRadius` token    -> `borderRadius` (only in files that use the theme API)
//   - a `correctFormat: true|false,` line is deleted (the option is ignored in 18.0+). Only in files
//     that mention Handsontable, and only once 18.x is installed: in 17.x the option still reformats
//     dates, so before the upgrade it is reported instead.
// Everything else is reported with file:line for a human to change, because the
// right replacement depends on the data or the intent.
//
// Exit code: 0 = nothing left to change by hand, 1 = manual changes reported, 2 = usage error.

import { MENTIONS_HANDSONTABLE, WRAPPERS, rangeMajor, runCodemod } from './lib/codemod.mjs';

const GUIDE_18 = 'https://handsontable.com/docs/javascript-data-grid/migration-from-17.1-to-18.0/';
const GUIDE_17 = 'https://handsontable.com/docs/javascript-data-grid/migration-from-16.2-to-17.0/';

/**
 * Line-based rules. `fix` (optional) returns the rewritten line, or null to
 * delete the line. `when` limits a rule to some file kinds.
 */
const LINE_RULES = [
  {
    id: 'common-subpath',
    when: 'code',
    test: /(['"])handsontable\/common\1/,
    fix: (line, opts) => line.replace(/(['"])handsontable\/common\1/g, `$1${opts.base ? 'handsontable/base' : 'handsontable'}$1`),
    message: 'The `handsontable/common` subpath was removed in 18.0. Every type it had is exported from `handsontable` and `handsontable/base`.',
    url: GUIDE_18,
  },
  {
    id: 'wrapper-border-radius-var',
    test: /--ht-wrapper-border-radius\b/,
    fix: line => line.replace(/--ht-wrapper-border-radius\b/g, '--ht-border-radius'),
    message: '`--ht-wrapper-border-radius` was renamed to `--ht-border-radius` in 18.0.',
    url: GUIDE_18,
  },
  {
    id: 'wrapper-border-radius-token',
    when: 'code',
    test: /\bwrapperBorderRadius\b/,
    fixIf: text => /handsontable|createTheme|registerTheme|\.params\s*\(/.test(text),
    fix: line => line.replace(/\bwrapperBorderRadius\b/g, 'borderRadius'),
    message: 'The `wrapperBorderRadius` theme token was renamed to `borderRadius` in 18.0.',
    url: GUIDE_18,
  },
  {
    id: 'wrapper-border-width-color',
    test: /--ht-wrapper-border-(width|color)\b|\bwrapperBorder(Width|Color)\b/,
    message: '`--ht-wrapper-border-width` / `--ht-wrapper-border-color` (JS tokens `wrapperBorderWidth` / `wrapperBorderColor`) ' +
      'were removed in 18.0. Delete them; if you want a visible wrapper border, add ' +
      '`.ht-theme-main .ht-root-wrapper { box-shadow: 0 0 0 1px <color>; }` (use your theme class).',
    url: GUIDE_18,
  },
  {
    id: 'correct-format',
    when: 'code',
    test: /\bcorrectFormat\b\s*[:=]/,
    fixIf: text => MENTIONS_HANDSONTABLE.test(text),
    fixWhen: opts => opts.on18,
    fix: line => (/^\s*correctFormat\s*:\s*(true|false)\s*,?\s*$/.test(line) ? null : undefined),
    message: '`correctFormat` was removed in 18.0 and is ignored. Date/time cells take ISO 8601 and do not reformat ' +
      'input; use `valueParser` / `valueSetter` to correct entered values.',
    url: GUIDE_18,
  },
  {
    id: 'date-picker-config',
    when: 'code',
    test: /\bdatePickerConfig\b\s*[:=]/,
    message: '`datePickerConfig` (Pikaday) has no effect in 18.0 - the date editor is the native date input. Remove it; there is no replacement.',
    url: GUIDE_18,
  },
  {
    id: 'string-date-time-format',
    when: 'code',
    test: /\b(dateFormat|timeFormat)\s*[:=]\s*\{?\s*['"`]/,
    message: 'A string `dateFormat` / `timeFormat` (moment.js syntax) is not supported in 18.0: the value is shown unformatted. ' +
      'Use an Intl.DateTimeFormat options object (e.g. `{ year: \'numeric\', month: \'2-digit\', day: \'2-digit\' }`) ' +
      'and convert the source data to ISO 8601 (dates `YYYY-MM-DD`, times 24-hour `HH:mm:ss`).',
    url: GUIDE_18,
  },
  {
    id: 'resize-state-methods',
    when: 'code',
    test: /\b(save|load)Manual(ColumnWidths|RowHeights)\s*\(/,
    message: '`saveManualColumnWidths()` / `loadManualColumnWidths()` / `saveManualRowHeights()` / `loadManualRowHeights()` ' +
      'do nothing since 17.0 and are deprecated in 18.0. Remove the calls; persist `columnWidths` / `rowHeights` yourself.',
    url: GUIDE_18,
  },
  {
    id: 'positional-wrapper-selector',
    test: /\.ht-root-wrapper\s*>|\.ht-grid\s*>\s*\.(handsontable|ht-wrapper)\b|\.ht-grid['"]\s*\)\s*\.\s*(firstElementChild|firstChild|children)\b/,
    message: '18.0 added `.ht-grid-content` inside `.ht-grid` and new `.ht-slot-top` / `.ht-slot-bottom` / `.ht-overlay` ' +
      'siblings inside `.ht-root-wrapper`. Selectors or DOM walks that rely on position break. Target classes instead, ' +
      'e.g. `.ht-grid-content > .handsontable` or `querySelector(\'.ht-wrapper.handsontable\')`.',
    url: GUIDE_18,
  },
  {
    id: 'legacy-wrapper-package',
    when: 'code',
    test: /(['"])@handsontable\/(react|angular)\1/,
    message: '`@handsontable/react` and `@handsontable/angular` were removed in 17.0. Use `@handsontable/react-wrapper` / ' +
      '`@handsontable/angular-wrapper` (their APIs differ - follow the 17.0 guide).',
    url: GUIDE_17,
  },
  {
    id: 'legacy-full-css',
    test: /handsontable\/dist\/[\w.-]*\.css|handsontable\.full(\.min)?\.css/,
    message: 'The legacy stylesheet (`dist/handsontable.full.min.css`) was removed in 17.0, and 17.0+ ships no CSS under ' +
      '`dist/`. Switch to a theme, e.g. `import \'handsontable/styles/ht-theme-classic.min.css\'` (or the Theme API).',
    url: GUIDE_17,
  },
];

/** Multi-line patterns that line rules cannot see. */
const BLOCK_RULES = [
  {
    id: 'numbro-numeric-format',
    when: 'code',
    test: /numericFormat\s*[:=]\s*\{?\s*\{[^{}]*\b(pattern|culture)\s*:/g,
    message: '`numericFormat.pattern` / `numericFormat.culture` (Numbro.js) are ignored in 18.0. Rewrite as Intl.NumberFormat ' +
      'options (`style`, `currency`, `minimumFractionDigits`, ...) and move the culture to the `locale` option, ' +
      'e.g. `locale: \'de-DE\', numericFormat: { style: \'currency\', currency: \'EUR\' }`.',
    url: GUIDE_18,
  },
];

function checkPackageJson({ file, deps }, out) {
  const add = (rule, message, url = GUIDE_18) => out.manual.push({ rule, file, line: null, text: '', message, url });
  const major = rangeMajor(deps.handsontable);

  if (deps.handsontable && major !== null && major < 18) {
    const wrappers = WRAPPERS.filter(w => deps[w]);

    add('package-version', `handsontable is "${deps.handsontable}". Bump it to ^18` +
      `${wrappers.length ? ` together with ${wrappers.join(', ')} (the 18.x wrappers peer-require handsontable ^18.0.0)` : ''}` +
      ' once the other items in this report are handled.');
  }

  for (const wrapper of WRAPPERS) {
    if (deps[wrapper] && deps.handsontable && rangeMajor(deps[wrapper]) !== major) {
      add('wrapper-version', `${wrapper} is "${deps[wrapper]}" but handsontable is "${deps.handsontable}". ` +
        'The 18.x wrappers peer-require handsontable ^18; keep the majors aligned.');
    }
  }

  for (const legacy of ['@handsontable/react', '@handsontable/angular']) {
    if (deps[legacy]) {
      add('legacy-wrapper-dependency', `${legacy} was removed in 17.0. Replace it with ${legacy}-wrapper.`, GUIDE_17);
    }
  }

  out.deps = deps;
}

function finish(out, opts) {
  if (!opts.on18 && out.manual.some(item => item.rule === 'correct-format')) {
    out.notes.push('`correctFormat` lines are reported, not deleted, because ' +
      (opts.major === null ? 'the installed handsontable version could not be determined' : `the project is on handsontable ${opts.major}.x`) +
      ': before 18.0 the option still reformats dates. Upgrade to 18.x and run again with --write to remove them.');
  }

  if (out.usesFormulas && out.deps && !out.deps.hyperformula) {
    out.manual.push({
      rule: 'hyperformula-unbundled', file: 'package.json', line: null, text: '',
      message: 'The project configures the Formulas plugin, but `hyperformula` is not a dependency. Since 18.0 ' +
        'handsontable no longer bundles it: `npm install hyperformula` and pass the engine to the plugin ' +
        '(`formulas: { engine: HyperFormula }`).',
      url: GUIDE_18,
    });
  }

  if (!out.hasSanitizer) {
    out.notes.push('No `sanitizer` option found. 18.0 dropped the built-in DOMPurify, so HTML in headers, menu labels, ' +
      'select options, dialogs and pasted content is no longer sanitized. If any of it can come from users, add ' +
      '`sanitizer: (html) => DOMPurify.sanitize(html)` (or your own function). ' + GUIDE_18);
  }
}

runCodemod({
  lineRules: LINE_RULES,
  blockRules: BLOCK_RULES,
  flags: ['base'],
  state: { usesFormulas: false, hasSanitizer: false },
  options: (flags, major) => ({ base: flags.base === true, on18: major !== null && major >= 18 }),
  inspectFile({ kind, text }, out) {
    if (kind !== 'code') return;
    if (/\bformulas\s*[:=]|\bformulas=\{/.test(text)) out.usesFormulas = true;
    if (/\bsanitizer\s*[:=]|\bsanitizer=\{/.test(text)) out.hasSanitizer = true;
  },
  checkPackageJson,
  finish,
});
