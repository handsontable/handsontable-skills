// The scanner the migration scripts share: walks a project, runs each script's rules over every
// source file, applies the mechanical fixes with --write, and prints the report. A migration
// script holds only its rules and its package.json checks.

import fs from 'node:fs';
import path from 'node:path';
import { locateHandsontable, parseArgs, run, UsageError } from './handsontable-package.mjs';

const CODE_EXT = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.mts', '.cts', '.vue', '.svelte']);
const STYLE_EXT = new Set(['.css', '.scss', '.sass', '.less']);
const MARKUP_EXT = new Set(['.html', '.htm']);
// Skipped at any depth. Hidden directories (except .storybook) are skipped at any depth as well.
const ALWAYS_SKIP_DIRS = new Set(['node_modules', '.git']);
// Build output and vendored code, skipped only directly under a scan target, so a real source
// folder such as `src/vendor/` or `app/out/` is still scanned. Skips are listed in the summary.
const ROOT_SKIP_DIRS = new Set(['dist', 'build', 'out', 'coverage', 'vendor']);
const BASE_FLAGS = ['project', 'ht-dir', 'write', 'json'];
const MAX_BYTES = 1024 * 1024;

export const MENTIONS_HANDSONTABLE = /handsontable|\bHot(Table|Column)\b|<hot-(table|column)\b/i;
export const WRAPPERS = ['@handsontable/react-wrapper', '@handsontable/angular-wrapper', '@handsontable/vue3'];

/**
 * First number in a version range: "^17.1.0", "~17.1", "^17", "17", ">=17 <19" all give 17.
 * Tags such as "latest" or "workspace:*" give null.
 */
export function rangeMajor(range) {
  const m = String(range ?? '').match(/\d+/);

  return m ? Number(m[0]) : null;
}

/** Parsed package.json of a directory with its merged dependency map, or null. */
export function readPackageJson(dir) {
  const file = path.join(dir, 'package.json');

  try {
    const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));

    return { file, pkg, deps: { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies } };
  } catch {
    return null;
  }
}

export function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

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

/** A rule with `review: true` reports behavior to check, not code that must change. */
function bucket(rule, out) {
  return rule.review ? out.review : out.manual;
}

function scanFile(file, config, opts, out) {
  const kind = kindOf(file);

  if (!kind || fs.statSync(file).size > MAX_BYTES) {
    return;
  }

  const original = fs.readFileSync(file, 'utf8');
  const applies = rule => (!rule.when || rule.when === kind) && (!rule.fileIf || rule.fileIf(original));
  const lineRules = (config.lineRules || []).filter(applies);
  const lines = original.split('\n');
  const next = [];
  let changed = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let deleted = false;

    for (const rule of lineRules) {
      if (!rule.test.test(line)) continue;
      if (rule.exclude && rule.exclude.test(line)) continue;

      const canFix = rule.fix && (!rule.fixIf || rule.fixIf(original)) && (!rule.fixWhen || rule.fixWhen(opts));
      const fixed = canFix ? rule.fix(line, opts) : undefined;

      if (fixed === undefined) {
        bucket(rule, out).push({
          rule: rule.id, file, line: i + 1, text: lines[i].trim(), message: rule.message, url: rule.url,
        });
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

  for (const rule of (config.blockRules || []).filter(applies)) {
    for (const match of original.matchAll(rule.test)) {
      bucket(rule, out).push({
        rule: rule.id, file, line: lineOf(original, match.index), text: match[0].replace(/\s+/g, ' ').slice(0, 100),
        message: rule.message, url: rule.url,
      });
    }
  }

  config.inspectFile?.({ file, kind, text: original }, out);

  if (changed && opts.write) {
    fs.writeFileSync(file, next.join('\n'));
    out.written.add(file);
  }
}

function printGroup(title, list, rel) {
  if (!list.length) {
    return;
  }

  const groups = list.reduce((acc, item) => {
    (acc[item.rule] ||= []).push(item);
    return acc;
  }, {});

  console.log(title);
  for (const items of Object.values(groups)) {
    console.log(`\n  ${items[0].message}`);
    console.log(`  ${items[0].url}`);
    for (const it of items) {
      console.log(`    ${rel(it.file)}${it.line ? `:${it.line}` : ''}${it.text ? `  ${it.text}` : ''}`);
    }
  }
  console.log('');
}

function printReport(out, opts) {
  const rel = f => (f ? path.relative(process.cwd(), f) || f : '');

  if (out.auto.length) {
    const groups = out.auto.reduce((acc, item) => {
      (acc[item.rule] ||= []).push(item);
      return acc;
    }, {});

    console.log(opts.write ? 'Applied automatically:' : 'Will be fixed automatically with --write:');
    for (const items of Object.values(groups)) {
      console.log(`\n  ${items[0].message}`);
      for (const it of items) {
        console.log(`    ${rel(it.file)}:${it.line}`);
        console.log(`      - ${it.text}`);
        console.log(`      + ${it.after}`);
      }
    }
    console.log('');
  }

  printGroup('Needs a manual change:', out.manual, rel);
  printGroup('Review (behavior changed; the code may already be fine):', out.review, rel);

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
    `${opts.write ? ` applied in ${out.written.size} file(s)` : ' available'} · ${out.manual.length} manual item(s)` +
    `${out.review.length ? ` · ${out.review.length} to review` : ''}.`);

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

    const major = rangeMajor(readPackageJson(dir)?.deps.handsontable);

    if (major !== null) {
      return major;
    }
  }

  return null;
}

/**
 * Runs a migration script.
 *
 * @param {object} config
 * @param {object[]} [config.lineRules] `{ id, test, message, url }` plus optional `when` (file kind),
 *   `fileIf(text)` (skip the rule in other files), `exclude` (regex), `review` (report under "Review",
 *   which does not affect the exit code), and for automatic fixes `fix(line, opts)` (returns the new
 *   line, null to delete it, undefined to report instead), `fixIf(text)` and `fixWhen(opts)`.
 * @param {object[]} [config.blockRules] Multi-line patterns: `{ id, test (global regex), message, url }`.
 * @param {string[]} [config.flags] Boolean flags the script adds to --project, --ht-dir, --write, --json.
 * @param {object} [config.state] Extra fields of the result object.
 * @param {Function} [config.options] `(flags, major) => object` merged into `opts`.
 * @param {Function} [config.inspectFile] `({ file, kind, text }, out)` called for every scanned file.
 * @param {Function} [config.checkPackageJson] `({ file, pkg, deps, dir }, out)` for the project root
 *   and every directory passed as a path.
 * @param {Function} [config.finish] `(out, opts)` called after the scan, before the report.
 */
export function runCodemod(config) {
  const knownFlags = new Set([...BASE_FLAGS, ...(config.flags || [])]);

  return run(async () => {
    const { flags, positionals } = parseArgs(process.argv.slice(2), ['project', 'ht-dir']);
    const unknown = Object.keys(flags).filter(name => !knownFlags.has(name));

    if (unknown.length) {
      throw new UsageError(`Unknown option ${unknown.map(n => `--${n}`).join(', ')}. ` +
        `Valid options: ${[...knownFlags].map(n => `--${n}`).join(', ')}.`);
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
    const opts = { write: flags.write === true, major, ...config.options?.(flags, major) };
    const out = {
      auto: [], manual: [], review: [], notes: [], written: new Set(), skipped: new Set(), filesScanned: 0,
      ...config.state,
    };

    let markupFiles = 0;

    for (const target of targets) {
      for (const file of walk(target, out.skipped)) {
        const kind = kindOf(file);

        if (kind) {
          out.filesScanned++;
          markupFiles += kind === 'markup' ? 1 : 0;
          scanFile(file, config, opts, out);
        }
      }
    }

    for (const dir of new Set([project, ...dirTargets])) {
      const found = readPackageJson(dir);

      if (found) {
        config.checkPackageJson?.({ ...found, dir }, out);
      }
    }

    config.finish?.(out, opts);

    // Rules for JavaScript skip HTML files, so code in an inline <script> is not checked.
    if (markupFiles && (config.lineRules || []).some(rule => rule.when === 'code')) {
      out.notes.push(`${markupFiles} HTML file(s) were scanned only for the checks that apply to every file type ` +
        '(CSS selectors, for example). Code inside inline `<script>` elements was not checked: move it to a ' +
        '.js file and run again, or review it against the migration guide yourself.');
    }

    if (flags.json) {
      console.log(JSON.stringify({ ...out, written: [...out.written], skipped: [...out.skipped] }, null, 2));
    } else {
      printReport(out, opts);
    }

    return out.manual.length ? 1 : 0;
  });
}
