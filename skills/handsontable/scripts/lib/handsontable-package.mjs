// Locates the `handsontable` package a project actually has installed and loads
// the pieces of it the helper scripts read. Every list the scripts check against
// (options, hooks, cell types, license states) comes from that installed copy,
// never from a list kept here, so the answers always match the user's version.

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

/**
 * Finds the installed `handsontable` package directory.
 *
 * @param {object} opts
 * @param {string} [opts.htDir] Explicit package directory (`--ht-dir`).
 * @param {string} [opts.project] Project directory to resolve from (`--project`, default: cwd).
 * @returns {{ dir: string, version: string, require: NodeRequire }}
 */
export function locateHandsontable({ htDir, project } = {}) {
  let dir;

  if (htDir) {
    dir = path.resolve(htDir);
  } else {
    const from = path.resolve(project || process.cwd());
    const req = createRequire(path.join(from, '__resolve__.js'));

    try {
      // `handsontable/package.json` is not in the package's exports map, so
      // resolve the main entry and take its directory.
      dir = path.dirname(req.resolve('handsontable'));
    } catch {
      throw new UsageError(
        `Could not find the "handsontable" package from ${from}.\n` +
        'Run the script from your project root (where node_modules/handsontable is), ' +
        'pass --project <dir>, or pass --ht-dir <path/to/node_modules/handsontable>.'
      );
    }
  }

  const pkgPath = path.join(dir, 'package.json');

  if (!fs.existsSync(pkgPath)) {
    throw new UsageError(`No package.json in ${dir}. Is this a handsontable package directory?`);
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  if (pkg.name !== 'handsontable') {
    throw new UsageError(`${dir} is the "${pkg.name}" package, not "handsontable".`);
  }

  return { dir, version: pkg.version, require: createRequire(pkgPath) };
}

/**
 * Loads a CommonJS module from inside the package by file path. The package's
 * exports map hides these files from bare-specifier imports, so they are
 * loaded by absolute path instead. Returns null when the file is absent (the
 * module moved or does not exist in this version).
 *
 * @param {{ dir: string, require: NodeRequire }} ht
 * @param {string} relPath Path inside the package, e.g. "helpers/mixed.js".
 * @returns {object|null}
 */
export function loadInternal(ht, relPath) {
  const file = path.join(ht.dir, relPath);

  if (!fs.existsSync(file)) {
    return null;
  }

  return ht.require(file);
}

/**
 * Compares two "x.y.z" versions (pre-release suffixes ignored).
 *
 * @returns {number} negative, zero or positive.
 */
export function compareVersions(a, b) {
  const pa = String(a).split('-')[0].split('.').map(Number);
  const pb = String(b).split('-')[0].split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);

    if (d !== 0) {
      return d;
    }
  }

  return 0;
}

/** An error caused by how the script was called; printed without a stack trace. */
export class UsageError extends Error {}

/**
 * Minimal argv parser: `--flag`, `--key value`, `--key=value`, positionals.
 *
 * @param {string[]} argv
 * @param {string[]} valueFlags Flags that take a value.
 */
export function parseArgs(argv, valueFlags = []) {
  const flags = {};
  const positionals = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg.startsWith('--')) {
      const eq = arg.indexOf('=');
      const name = eq === -1 ? arg.slice(2) : arg.slice(2, eq);

      if (eq !== -1) {
        flags[name] = arg.slice(eq + 1);
      } else if (valueFlags.includes(name)) {
        if (i + 1 >= argv.length) {
          throw new UsageError(`--${name} needs a value.`);
        }
        flags[name] = argv[++i];
      } else {
        flags[name] = true;
      }
    } else {
      positionals.push(arg);
    }
  }

  return { flags, positionals };
}

/**
 * Runs a script's main function with uniform error handling.
 *
 * @param {() => Promise<number>|number} main Returns the exit code.
 */
export async function run(main) {
  try {
    process.exitCode = await main();
  } catch (error) {
    if (error instanceof UsageError) {
      console.error(`Error: ${error.message}`);
      process.exitCode = 2;
    } else {
      throw error;
    }
  }
}
