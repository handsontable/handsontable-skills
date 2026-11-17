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

import fs from 'node:fs';
import path from 'node:path';
import { locateHandsontable, parseArgs, run, UsageError } from './lib/handsontable-package.mjs';

const GUIDE_18 = 'https://handsontable.com/docs/javascript-data-grid/migration-from-17.1-to-18.0/';
const GUIDE_17 = 'https://handsontable.com/docs/javascript-data-grid/migration-from-16.2-to-17.0/';

const CODE_EXT = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.mts', '.cts', '.vue', '.svelte']);
const STYLE_EXT = new Set(['.css', '.scss', '.sass', '.less']);
const MARKUP_EXT = new Set(['.html', '.htm']);
// Skipped at any depth. Hidden directories (except .storybook) are skipped at any depth as well.
const ALWAYS_SKIP_DIRS = new Set(['node_modules', '.git']);
// Build output and vendored code, skipped only directly under a scan target, so a real source
// folder such as `src/vendor/` or `app/out/` is still scanned. Skips are listed in the summary.
const ROOT_SKIP_DIRS = new Set(['dist', 'build', 'out', 'coverage', 'vendor']);
const KNOWN_FLAGS = new Set(['project', 'ht-dir', 'write', 'base', 'json']);
const MENTIONS_HANDSONTABLE = /handsontable|\bHot(Table|Column)\b|<hot-(table|column)\b/i;
const MAX_BYTES = 1024 * 1024;

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
    needs18: true,
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

function kindOf(file) {
  const ext = path.extname(file).toLowerCase();

  if (CODE_EXT.has(ext)) return 'code';
  if (STYLE_EXT.has(ext)) return 'style';
  if (MARKUP_EXT.has(ext)) return 'markup';

  return null;
}

function* walk(target, skipped, isRoot = true) {
  const stat = fs.statSync(target);

  if (stat.isFile()) {
    yield target;
    return;
  }

  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    const full = path.join(target, entry.name);

    if (entry.isDirectory()) {
      if (ALWAYS_SKIP_DIRS.has(entry.name) || (entry.name.startsWith('.') && entry.name !== '.storybook')) {
        continue;
      }
      if (isRoot && ROOT_SKIP_DIRS.has(entry.name)) {
        skipped.add(full);
        continue;
      }
      yield* walk(full, skipped, false);
    } else if (entry.isFile()) {
      yield full;
    }
  }
}

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

function scanFile(file, opts, out) {
  const kind = kindOf(file);

  if (!kind || fs.statSync(file).size > MAX_BYTES) {
    return;
  }

  const original = fs.readFileSync(file, 'utf8');
  const lines = original.split('\n');
  const next = [];
  let changed = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let deleted = false;

    for (const rule of LINE_RULES) {
      if (rule.when && rule.when !== kind) continue;
      if (!rule.test.test(line)) continue;
      if (rule.exclude && rule.exclude.test(line)) continue;

      const canFix = rule.fix && (!rule.fixIf || rule.fixIf(original)) && (!rule.needs18 || opts.on18);
      const fixed = canFix ? rule.fix(line, opts) : undefined;

      if (fixed === undefined) {
        out.manual.push({ rule: rule.id, file, line: i + 1, text: lines[i].trim(), message: rule.message, url: rule.url });
      } else {
        out.auto.push({
          rule: rule.id, file, line: i + 1, text: lines[i].trim(), after: fixed === null ? '(line deleted)' : fixed.trim(),
          message: rule.message, url: rule.url,
        });
        if (fixed === null) {
          deleted = true;
          break;
        }
        line = fixed;
      }
    }

    if (!deleted) {
      next.push(line);
    }
    if (deleted || line !== lines[i]) {
      changed = true;
    }
  }

  for (const rule of BLOCK_RULES) {
    if (rule.when && rule.when !== kind) continue;
    for (const match of original.matchAll(rule.test)) {
      out.manual.push({
        rule: rule.id, file, line: lineOf(original, match.index), text: match[0].replace(/\s+/g, ' ').slice(0, 100),
        message: rule.message, url: rule.url,
      });
    }
  }

  if (kind === 'code') {
    if (/\bformulas\s*[:=]|\bformulas=\{/.test(original)) out.usesFormulas = true;
    if (/\bsanitizer\s*[:=]|\bsanitizer=\{/.test(original)) out.hasSanitizer = true;
  }

  if (changed && opts.write) {
    fs.writeFileSync(file, next.join('\n'));
    out.written.add(file);
  }
}

function checkPackageJson(dir, out) {
  const file = path.join(dir, 'package.json');

  if (!fs.existsSync(file)) {
    return;
  }

  let pkg;

  try {
    pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return;
  }

  const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
  // First number in the range: "^17.1.0", "~17.1", "^17", "17", ">=17 <19" all give 17. Tags such as
  // "latest" or "workspace:*" give null and are skipped.
  const major = range => {
    const m = String(range).match(/\d+/);

    return m ? Number(m[0]) : null;
  };
  const add = (rule, message, url = GUIDE_18) => out.manual.push({ rule, file, line: null, text: '', message, url });

  if (deps.handsontable && major(deps.handsontable) !== null && major(deps.handsontable) < 18) {
    const wrappers = ['@handsontable/react-wrapper', '@handsontable/angular-wrapper', '@handsontable/vue3'].filter(w => deps[w]);

    add('package-version', `handsontable is "${deps.handsontable}". Bump it to ^18` +
      `${wrappers.length ? ` together with ${wrappers.join(', ')} (the 18.x wrappers peer-require handsontable ^18.0.0)` : ''}` +
      ' once the other items in this report are handled.');
  }

  for (const wrapper of ['@handsontable/react-wrapper', '@handsontable/angular-wrapper', '@handsontable/vue3']) {
    if (deps[wrapper] && deps.handsontable && major(deps[wrapper]) !== major(deps.handsontable)) {
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

function finish(out) {
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

function printReport(out, opts) {
  const rel = f => (f ? path.relative(process.cwd(), f) || f : '');
  const group = list => list.reduce((acc, item) => {
    (acc[item.rule] ||= []).push(item);
    return acc;
  }, {});

  if (out.auto.length) {
    console.log(opts.write ? 'Applied automatically:' : 'Will be fixed automatically with --write:');
    for (const [, items] of Object.entries(group(out.auto))) {
      console.log(`\n  ${items[0].message}`);
      for (const it of items) {
        console.log(`    ${rel(it.file)}:${it.line}`);
        console.log(`      - ${it.text}`);
        console.log(`      + ${it.after}`);
      }
    }
    console.log('');
  }

  if (out.manual.length) {
    console.log('Needs a manual change:');
    for (const [, items] of Object.entries(group(out.manual))) {
      console.log(`\n  ${items[0].message}`);
      console.log(`  ${items[0].url}`);
      for (const it of items) {
        console.log(`    ${rel(it.file)}${it.line ? `:${it.line}` : ''}${it.text ? `  ${it.text}` : ''}`);
      }
    }
    console.log('');
  }

  for (const note of out.notes) {
    console.log(`Note: ${note}\n`);
  }

  if (out.skipped.size) {
    console.log('Not scanned (build output or vendored code; pass the folder as a path to scan it):');
    for (const dir of out.skipped) {
      console.log(`    ${rel(dir)}/`);
    }
    console.log('');
  }

  console.log(`${out.filesScanned} file(s) scanned · ${out.auto.length} automatic fix(es)` +
    `${opts.write ? ` applied in ${out.written.size} file(s)` : ' available'} · ${out.manual.length} manual item(s).`);

  if (!opts.write && out.auto.length) {
    console.log('Run again with --write to apply the automatic fixes.');
  }
}

/**
 * Major version of handsontable the project runs: the installed package if it can be found,
 * otherwise the first number of the range declared in package.json. Tries each directory in
 * order (the project root, then the directories passed as paths). Null when none tells.
 */
function projectMajor(dirs, htDir) {
  if (htDir) {
    return Number(locateHandsontable({ htDir }).version.split('.')[0]);
  }

  for (const dir of dirs) {
    try {
      return Number(locateHandsontable({ project: dir }).version.split('.')[0]);
    } catch {
      // not installed from here; fall back to the declared range below
    }

    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
      const range = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies }.handsontable;
      const m = String(range ?? '').match(/\d+/);

      if (m) {
        return Number(m[0]);
      }
    } catch {
      // no readable package.json here
    }
  }

  return null;
}

run(async () => {
  const { flags, positionals } = parseArgs(process.argv.slice(2), ['project', 'ht-dir']);
  const unknown = Object.keys(flags).filter(name => !KNOWN_FLAGS.has(name));

  if (unknown.length) {
    throw new UsageError(`Unknown option ${unknown.map(n => `--${n}`).join(', ')}. ` +
      `Valid options: ${[...KNOWN_FLAGS].map(n => `--${n}`).join(', ')}.`);
  }
  for (const name of ['project', 'ht-dir']) {
    if (name in flags && typeof flags[name] !== 'string') {
      throw new UsageError(`--${name} needs a value.`);
    }
  }

  const project = path.resolve(flags.project || '.');

  if (!fs.existsSync(project) || !fs.statSync(project).isDirectory()) {
    throw new UsageError(`Project directory not found: ${project}`);
  }

  const targets = positionals.length ? positionals.map(p => path.resolve(project, p)) : [project];

  for (const target of targets) {
    if (!fs.existsSync(target)) {
      throw new UsageError(`Path not found: ${target}`);
    }
  }

  const dirTargets = targets.filter(t => fs.statSync(t).isDirectory());
  const major = projectMajor([project, ...dirTargets], flags['ht-dir']);
  const opts = { write: flags.write === true, base: flags.base === true, on18: major !== null && major >= 18 };
  const out = {
    auto: [], manual: [], notes: [], written: new Set(), skipped: new Set(), filesScanned: 0,
    usesFormulas: false, hasSanitizer: false,
  };

  for (const target of targets) {
    for (const file of walk(target, out.skipped)) {
      if (kindOf(file)) {
        out.filesScanned++;
        scanFile(file, opts, out);
      }
    }
  }

  // package.json of the project root and of every directory passed as a path.
  for (const dir of new Set([project, ...dirTargets])) {
    checkPackageJson(dir, out);
  }

  if (!opts.on18 && out.manual.some(item => item.rule === 'correct-format')) {
    out.notes.push('`correctFormat` lines are reported, not deleted, because ' +
      (major === null ? 'the installed handsontable version could not be determined' : `the project is on handsontable ${major}.x`) +
      ': before 18.0 the option still reformats dates. Upgrade to 18.x and run again with --write to remove them.');
  }

  finish(out);

  if (flags.json) {
    console.log(JSON.stringify({ ...out, written: [...out.written], skipped: [...out.skipped] }, null, 2));
  } else {
    printReport(out, opts);
  }

  return out.manual.length ? 1 : 0;
});
