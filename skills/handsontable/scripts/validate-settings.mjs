#!/usr/bin/env node
// Checks a Handsontable DataGrid settings object against the option set,
// hook names and cell types of the handsontable version installed in the
// project. Nothing is hard-coded except the short list of removed options
// below; everything else is read from the installed package.
//
// Usage:
//   node validate-settings.mjs <settings.json|settings.mjs|settings.js> [options]
//   cat settings.json | node validate-settings.mjs --stdin [options]
//
// Options:
//   --project <dir>   Resolve handsontable from this project (default: cwd).
//   --ht-dir <dir>    Use this handsontable package directory instead.
//   --allow <a,b>     Custom cell-meta keys you set on purpose; not reported.
//   --json            Machine-readable output.
//
// A .js/.mjs file must export the settings object as its default export or as
// a named `settings` export. TypeScript files are not loaded: export the
// object from a .mjs file or dump it to JSON first.
//
// Exit code: 0 = no errors (warnings allowed), 1 = errors found, 2 = usage error.

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  locateHandsontable, loadInternal, compareVersions, parseArgs, run, UsageError,
} from './lib/handsontable-package.mjs';

// Options removed from the public API. Source: `REMOVED_OPTIONS` in
// handsontable/src/core.ts (18.1.2) for persistentState and correctFormat; the
// 17.1 -> 18.0 migration guide for datePickerConfig, which core.ts leaves out
// only because the date editor warns about it itself.
const REMOVED_OPTIONS = [
  {
    name: 'persistentState',
    version: '17.0.0',
    hint: 'The PersistentState plugin was removed. Store column widths / row heights yourself and pass them back on init.',
    url: 'https://handsontable.com/docs/javascript-data-grid/changelog-17/',
  },
  {
    name: 'correctFormat',
    version: '18.0.0',
    hint: 'Date/time cells take ISO 8601 values and do not reformat input. Use valueParser or valueSetter to correct entered values.',
    url: 'https://handsontable.com/docs/javascript-data-grid/migration-from-17.1-to-18.0/',
  },
  {
    name: 'datePickerConfig',
    version: '18.0.0',
    hint: 'Pikaday was removed; the date editor is the browser\'s native date input. This option has no replacement.',
    url: 'https://handsontable.com/docs/javascript-data-grid/migration-from-17.1-to-18.0/',
  },
];

const MIGRATION_18 = 'https://handsontable.com/docs/javascript-data-grid/migration-from-17.1-to-18.0/';

function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);

  for (let j = 1; j <= b.length; j++) {
    dp[0][j] = j;
  }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }

  return dp[a.length][b.length];
}

function suggest(name, candidates) {
  const lower = name.toLowerCase();
  let best = null;
  let bestDistance = Infinity;

  for (const candidate of candidates) {
    if (candidate.toLowerCase() === lower) {
      return candidate;
    }

    const d = levenshtein(lower, candidate.toLowerCase());

    if (d < bestDistance) {
      best = candidate;
      bestDistance = d;
    }
  }

  // Allow more slack for longer names; never suggest for very short ones.
  const limit = name.length <= 4 ? 1 : name.length <= 10 ? 2 : 3;

  return bestDistance <= limit ? best : null;
}

/** Reads what the installed package considers valid. */
function loadCatalog(ht) {
  const schemaModule = loadInternal(ht, 'dataMap/metaManager/metaSchema.js');

  if (!schemaModule || typeof schemaModule.default !== 'function') {
    throw new UsageError(
      `handsontable ${ht.version} does not ship dataMap/metaManager/metaSchema.js where this script expects it. ` +
      'The script supports handsontable 17.x and later.'
    );
  }

  const options = new Set(Object.keys(schemaModule.default()).filter(k => !k.startsWith('_')));
  const hooksModule = loadInternal(ht, 'core/hooks/constants.js') || {};
  const registeredHooks = new Set(hooksModule.REGISTERED_HOOKS || []);
  const deprecatedHooks = new Map(hooksModule.DEPRECATED_HOOKS || []);
  const removedHooks = new Map(hooksModule.REMOVED_HOOKS || []);

  // Built-in cell type names: each cellTypes/<x>/index.js exports CELL_TYPE
  // (and some a LEGACY_CELL_TYPE alias).
  const cellTypes = new Set();
  const cellTypesDir = path.join(ht.dir, 'cellTypes');

  if (fs.existsSync(cellTypesDir)) {
    for (const entry of fs.readdirSync(cellTypesDir)) {
      const mod = loadInternal(ht, path.join('cellTypes', entry, 'index.js'));

      if (mod) {
        for (const [key, value] of Object.entries(mod)) {
          if (/CELL_TYPE$/.test(key) && typeof value === 'string') {
            cellTypes.add(value);
          }
        }
      }
    }
  }

  return { options, registeredHooks, deprecatedHooks, removedHooks, cellTypes };
}

async function loadSettings(file, useStdin) {
  if (useStdin) {
    const text = fs.readFileSync(0, 'utf8');

    try {
      return { settings: JSON.parse(text), source: 'stdin' };
    } catch (e) {
      throw new UsageError(`stdin is not valid JSON: ${e.message}`);
    }
  }

  if (!file) {
    throw new UsageError('Pass a settings file (.json, .mjs, .js, .cjs) or --stdin.');
  }

  const abs = path.resolve(file);

  if (!fs.existsSync(abs)) {
    throw new UsageError(`File not found: ${file}`);
  }

  const ext = path.extname(abs).toLowerCase();

  if (ext === '.json') {
    try {
      return { settings: JSON.parse(fs.readFileSync(abs, 'utf8')), source: file };
    } catch (e) {
      throw new UsageError(`${file} is not valid JSON: ${e.message}`);
    }
  }

  if (['.js', '.mjs', '.cjs'].includes(ext)) {
    const mod = await import(pathToFileURL(abs).href);
    const settings = mod.settings ?? mod.default?.settings ?? mod.default;

    if (!settings || typeof settings !== 'object') {
      throw new UsageError(`${file} must export the settings object as default or as \`settings\`.`);
    }

    return { settings, source: file };
  }

  throw new UsageError(`Unsupported file type "${ext}". Use .json, .mjs, .js or .cjs.`);
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validate(settings, catalog, version, allow) {
  const findings = [];
  const add = (level, where, key, message, extra = {}) => findings.push({ level, where, key, message, ...extra });
  const is18 = compareVersions(version, '18.0.0') >= 0;
  const optionNames = [...catalog.options];
  const hookNames = [...catalog.registeredHooks];

  const checkValue = (where, key, value) => {
    if (key === 'type' && typeof value === 'string' && catalog.cellTypes.size && !catalog.cellTypes.has(value)) {
      const hint = suggest(value, [...catalog.cellTypes]);

      add('warning', where, key,
        `"${value}" is not a built-in cell type in ${version}. Fine if you registered it with registerCellType(); ` +
        `otherwise the cell falls back to defaults.${hint ? ` Did you mean "${hint}"?` : ''}`,
        { builtIn: [...catalog.cellTypes].sort() });
    }

    if (key === 'numericFormat' && isPlainObject(value) && is18 &&
        (value.pattern !== undefined || value.culture !== undefined)) {
      add('error', where, 'numericFormat',
        'numericFormat.pattern / numericFormat.culture (Numbro.js) are not supported in 18.0+; the renderer warns and ignores them. ' +
        'Use Intl.NumberFormat options in numericFormat and move the locale to the `locale` option.',
        { url: MIGRATION_18 });
    }

    if ((key === 'dateFormat' || key === 'timeFormat') && typeof value === 'string' && is18) {
      add('error', where, key,
        `A string ${key} (moment.js syntax) is not supported in 18.0+: the renderer warns once and shows the raw value unformatted. ` +
        'Pass an Intl.DateTimeFormat options object, and keep the source data in ISO 8601.',
        { url: MIGRATION_18 });
    }
  };

  const checkKeys = (obj, where, { allowHooks, skip = [] }) => {
    for (const [key, value] of Object.entries(obj)) {
      if (skip.includes(key) || allow.has(key)) {
        continue;
      }

      const removed = REMOVED_OPTIONS.find(r => r.name === key);

      if (removed && compareVersions(version, removed.version) >= 0) {
        add('error', where, key, `"${key}" was removed in ${removed.version} and is ignored. ${removed.hint}`, { url: removed.url });
        continue;
      }

      if (catalog.options.has(key)) {
        checkValue(where, key, value);
        continue;
      }

      if (catalog.removedHooks.has(key)) {
        add('error', where, key, `The "${key}" hook was removed in ${catalog.removedHooks.get(key)}. The callback never runs.`);
        continue;
      }

      if (catalog.registeredHooks.has(key)) {
        if (!allowHooks) {
          add('error', where, key, `"${key}" is a hook. Hooks are registered only from the top-level settings; here it never runs.`);
        } else if (catalog.deprecatedHooks.has(key)) {
          add('warning', where, key, `The "${key}" hook is deprecated: ${catalog.deprecatedHooks.get(key)}`);
        } else if (typeof value !== 'function' &&
                   !(Array.isArray(value) && value.every(fn => typeof fn === 'function'))) {
          add('error', where, key,
            `"${key}" is a hook, so its value must be a function or an array of functions (got ${value === null ? 'null' : typeof value}).`);
        }
        continue;
      }

      const hint = suggest(key, allowHooks ? [...optionNames, ...hookNames] : optionNames);

      add(hint ? 'error' : 'warning', where, key,
        hint
          ? `Unknown option "${key}". Did you mean "${hint}"? (Pass --allow ${key} if it is intentional custom meta.)`
          : `"${key}" is not a built-in option in ${version}. Handsontable stores unknown keys as custom cell meta ` +
            'without complaint, so a typo here fails silently. Pass --allow ' + key + ' if it is intentional.',
        hint ? { suggestion: hint } : {});
    }
  };

  if (!isPlainObject(settings)) {
    throw new UsageError('The settings must be an object.');
  }

  checkKeys(settings, 'settings', { allowHooks: true });

  if (Array.isArray(settings.columns)) {
    settings.columns.forEach((column, i) => {
      if (isPlainObject(column)) {
        checkKeys(column, `columns[${i}]`, { allowHooks: false });
      }
    });
  } else if (typeof settings.columns === 'function') {
    add('info', 'settings', 'columns', '`columns` is a function, so per-column settings were not checked.');
  }

  if (Array.isArray(settings.cell)) {
    settings.cell.forEach((cell, i) => {
      if (isPlainObject(cell)) {
        checkKeys(cell, `cell[${i}]`, { allowHooks: false, skip: ['row', 'col'] });
      }
    });
  }

  if (typeof settings.cells === 'function') {
    add('info', 'settings', 'cells', '`cells` is a function; what it returns at runtime was not checked.');
  }

  // Alias pairs core warns about (handsontable/src/core.ts, updateSettings).
  if (settings.rowHeights !== undefined && settings.minRowHeights !== undefined && catalog.options.has('minRowHeights')) {
    add('warning', 'settings', 'minRowHeights',
      '`rowHeights` and `minRowHeights` are aliases; with both set, only `rowHeights` is used.');
  }
  if ('theme' in settings && 'themeName' in settings) {
    add('error', 'settings', 'theme',
      '`theme` and `themeName` are aliases and cannot be used together. Keep one.');
  }

  if (!('licenseKey' in settings)) {
    add(compareVersions(version, '18.1.0') >= 0 ? 'error' : 'warning', 'settings', 'licenseKey',
      compareVersions(version, '18.1.0') >= 0
        ? `No licenseKey. In ${version} a missing key covers the grid with a modal that cannot be closed. ` +
          'Run license-doctor.mjs to check the key you plan to use.'
        : 'No licenseKey. The grid shows a license notice; from 18.1 a missing key blocks the grid.');
  }

  return findings;
}

function printReport(findings, { version, dir, source }) {
  const icon = { error: 'ERROR  ', warning: 'WARN   ', info: 'INFO   ' };

  console.log(`Checked ${source} against handsontable ${version} (${dir})\n`);

  if (findings.length === 0) {
    console.log('No problems found.');
    return;
  }

  for (const f of findings) {
    console.log(`${icon[f.level]}${f.where}.${f.key}: ${f.message}`);
    if (f.url) {
      console.log(`       ${f.url}`);
    }
  }

  const count = level => findings.filter(f => f.level === level).length;

  console.log(`\n${count('error')} error(s), ${count('warning')} warning(s), ${count('info')} note(s).`);
}

run(async () => {
  const { flags, positionals } = parseArgs(process.argv.slice(2), ['project', 'ht-dir', 'allow']);
  const ht = locateHandsontable({ htDir: flags['ht-dir'], project: flags.project });
  const catalog = loadCatalog(ht);
  const { settings, source } = await loadSettings(positionals[0], flags.stdin === true);
  const allow = new Set(String(flags.allow || '').split(',').map(s => s.trim()).filter(Boolean));
  const findings = validate(settings, catalog, ht.version, allow);

  if (flags.json) {
    console.log(JSON.stringify({ handsontable: ht.version, source, findings }, null, 2));
  } else {
    printReport(findings, { version: ht.version, dir: ht.dir, source });
  }

  return findings.some(f => f.level === 'error') ? 1 : 0;
});
