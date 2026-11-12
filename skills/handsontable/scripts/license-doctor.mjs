#!/usr/bin/env node
// Tells what a Handsontable DataGrid license key will do in the installed
// version: work silently, show a notice, or block the grid with a modal.
//
// The verdict comes from the installed package's own license classifier
// (`_getLicenseState` in helpers/mixed.js, present in 18.1.0+), so it matches
// what the grid does at runtime. The key never leaves the machine and is never
// printed in full.
//
// Usage:
//   node license-doctor.mjs --key "<key>"           [options]
//   node license-doctor.mjs --key-file .license     [options]
//   HANDSONTABLE_LICENSE_KEY=... node license-doctor.mjs [options]
//   printf '%s' "$KEY" | node license-doctor.mjs --stdin [options]
//
// Options:
//   --project <dir>   Resolve handsontable from this project (default: cwd).
//   --ht-dir <dir>    Use this handsontable package directory instead. Use it
//                     to preview a version you have not upgraded to yet:
//                       npm i --prefix /tmp/ht-next handsontable@latest
//                       node license-doctor.mjs --key ... --ht-dir /tmp/ht-next/node_modules/handsontable
//   --json            Machine-readable output.
//
// Exit code: 0 = the grid will run unblocked, 1 = the grid will be blocked,
// 2 = usage error or the installed version cannot classify keys.

import fs from 'node:fs';
import {
  locateHandsontable, loadInternal, compareVersions, parseArgs, run, UsageError,
} from './lib/handsontable-package.mjs';

// What each state means for the user. Transcribed from handsontable 18.1.2:
// helpers/mixed.ts (console/bottom-bar tables, legacy classifier) and
// utils/licenseBranding/content.ts (badge and lock screen). Whether a state
// BLOCKS is not taken from this table: it is read from the installed
// package's `_BLOCKING_MODAL_STATES`.
const STATE_INFO = {
  non_commercial: 'The non-commercial key. Allowed for non-commercial use and evaluation only. No notice.',
  legacy_valid: 'A valid 25-character key that covers this build. No notice.',
  legacy_expired: 'A 25-character key whose maintenance period ended before this build was released. ' +
    'The grid keeps working; a notice appears below it and an error is logged. ' +
    'Renew the key, or use a version released on or before the date below.',
  missing: 'No key. The grid is covered by a modal that cannot be closed.',
  invalid: 'The key cannot be read as a Handsontable license (typo, truncated, edited, or a key for another product). ' +
    'The grid is covered by a modal that cannot be closed.',
  usage_valid: 'Subscription key inside its term. No notice.',
  usage_notice: 'Subscription key close to its end date. A warning is logged; the grid works.',
  usage_soft_stop: 'Subscription key past its end date. An error is logged; the grid keeps working.',
  usage_hard_stop: 'Subscription key past its end date and grace period. An error is logged; the grid keeps working ' +
    '(a non-trial key never blocks in 18.1).',
  trial_valid: 'Trial key inside its term. A trial badge is shown.',
  trial_notice: 'Trial key close to its end date. A badge and a console warning show the days left.',
  trial_soft_stop: 'Trial key past its end date. An expired-trial badge, a bar below the grid, and a console error. ' +
    'The grid still works until the grace period ends.',
  trial_hard_stop: 'Trial key past its end date and grace period. The grid is covered by a modal that cannot be closed.',
  release_valid: 'Perpetual key whose maintenance date covers this build. No notice.',
  release_expired: 'Perpetual key whose maintenance date is before this build\'s release. The grid keeps working; ' +
    'a notice appears below it and an error is logged. Renew, or use a version released on or before the date below.',
};

// HyperFormula's keys. Handsontable DataGrid does not accept them
// (detectFormat.ts notes that `gpl-v3` is rejected like any unknown string).
const HYPERFORMULA_KEYS = ['gpl-v3', 'internal-use-in-handsontable'];

function readKey(flags) {
  if (typeof flags.key === 'string') {
    return { key: flags.key, from: '--key' };
  }
  if (typeof flags['key-file'] === 'string') {
    if (!fs.existsSync(flags['key-file'])) {
      throw new UsageError(`Key file not found: ${flags['key-file']}`);
    }
    return { key: fs.readFileSync(flags['key-file'], 'utf8'), from: flags['key-file'] };
  }
  if (flags.stdin) {
    return { key: fs.readFileSync(0, 'utf8'), from: 'stdin' };
  }
  if (process.env.HANDSONTABLE_LICENSE_KEY !== undefined) {
    return { key: process.env.HANDSONTABLE_LICENSE_KEY, from: 'HANDSONTABLE_LICENSE_KEY' };
  }

  // No key at all is a legitimate question: "what happens if I ship without one?"
  return { key: undefined, from: '(none)' };
}

function mask(key) {
  if (typeof key !== 'string' || key.trim() === '') {
    return '(empty)';
  }

  const k = key.trim();

  if (k.toLowerCase() === 'non-commercial-and-evaluation' || HYPERFORMULA_KEYS.includes(k.toLowerCase())) {
    return k;
  }
  if (k.length <= 10) {
    return `${k.slice(0, 2)}…`;
  }

  return `${k.slice(0, 5)}…${k.slice(-4)} (${k.length} chars)`;
}

/** Problems visible in the raw string, independent of the version. */
function hygiene(raw) {
  const notes = [];

  if (typeof raw !== 'string') {
    return notes;
  }

  const trimmed = raw.trim();

  if (raw !== trimmed) {
    notes.push('The key has leading/trailing whitespace or a newline. 18.1.0+ trims it before validating; ' +
      'strip it anyway, since older versions read such a key as invalid.');
  }
  if (/^['"`‘’“”].*['"`‘’“”]$/s.test(trimmed)) {
    notes.push('The key is wrapped in quotes. That usually means the quotes came from a .env or config file ' +
      'and are now part of the value.');
  }
  if (/[‐-―−]/.test(trimmed)) {
    notes.push('The key contains a typographic dash (–, —, ‑). A word processor or chat app probably replaced ' +
      'a plain "-". Copy the key from the original source.');
  }
  if (/[​-‍﻿ ]/.test(raw)) {
    notes.push('The key contains invisible characters (zero-width space, non-breaking space, or BOM).');
  }
  if (HYPERFORMULA_KEYS.includes(trimmed.toLowerCase())) {
    notes.push(`"${trimmed}" is a HyperFormula license key. Handsontable DataGrid's own \`licenseKey\` needs a ` +
      'Handsontable key or "non-commercial-and-evaluation". The HyperFormula key goes in the HyperFormula config.');
  }

  const blockStart = trimmed.lastIndexOf('[');

  if (blockStart !== -1 && trimmed.indexOf(']', blockStart) !== -1) {
    notes.push('This is an entitlement key (text followed by a bracketed block). Pass the whole thing - text ' +
      'and block - exactly as issued. From 18.1.2 the text is validated too, so a key cut down to the block, ' +
      'or with edited text, is invalid. Rewrapped lines are accepted from 18.1.2 on.');
  }

  return notes;
}

run(async () => {
  const { flags } = parseArgs(process.argv.slice(2), ['project', 'ht-dir', 'key', 'key-file']);
  const ht = locateHandsontable({ htDir: flags['ht-dir'], project: flags.project });
  const { key, from } = readKey(flags);
  const notes = hygiene(key);
  const mixed = loadInternal(ht, 'helpers/mixed.js');
  const canClassify = mixed && typeof mixed._getLicenseState === 'function';

  const report = {
    handsontable: ht.version,
    keySource: from,
    key: mask(key),
    notes,
    state: null,
    blocks: null,
    details: null,
  };

  if (canClassify) {
    // No releaseDate argument on purpose: the published build inlines its release date as the
    // fallback (`releaseDate ?? "<dd/mm/yyyy>"` in helpers/mixed.js), and core passes that same
    // inlined value (utils/licenseBranding/index.ts), so omitting it reproduces the runtime verdict.
    const { lifecycle } = mixed._getLicenseState(key);
    const blocking = Array.isArray(mixed._BLOCKING_MODAL_STATES) ? mixed._BLOCKING_MODAL_STATES : [];

    report.state = lifecycle.state;
    report.blocks = blocking.includes(lifecycle.state);
    report.isTrial = lifecycle.isTrial;
    report.daysRemaining = lifecycle.daysRemaining;
    report.licensedUntil = lifecycle.licensedUntil;
    report.details = STATE_INFO[lifecycle.state] ||
      'This state is newer than this script. Check the release notes for the installed version.';
  } else {
    report.details = compareVersions(ht.version, '18.1.0') < 0
      ? `handsontable ${ht.version} has no built-in license classifier (added in 18.1.0), and it never blocks the grid ` +
        '- a bad or missing key only shows a notice. To see what this key will do after upgrading, install the target ' +
        'version in a scratch folder and pass --ht-dir (see the header of this script).'
      : `handsontable ${ht.version} does not expose the license classifier where this script expects it ` +
        '(helpers/mixed.js `_getLicenseState`). The package layout may have changed.';
  }

  if (flags.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`handsontable ${report.handsontable}  ·  key from ${report.keySource}: ${report.key}\n`);

    if (report.state) {
      console.log(`State:   ${report.state}${report.isTrial ? ' (trial)' : ''}`);
      console.log(`Blocks:  ${report.blocks ? 'YES - the grid is covered by a modal that cannot be closed' : 'no'}`);
      if (report.licensedUntil) {
        console.log(`Date:    ${report.licensedUntil}`);
      }
      if (report.daysRemaining !== null && report.daysRemaining !== undefined) {
        console.log(`Days:    ${report.daysRemaining} left until the last licensed day`);
      }
      console.log('');
    }

    console.log(report.details);

    if (notes.length) {
      console.log('\nAlso noticed:');
      notes.forEach(n => console.log(`- ${n}`));
    }

    if (report.state) {
      console.log('\nReminders: `licenseKey` is read once, when the grid is created - changing it with ' +
        'updateSettings() has no effect, so recreate the instance. Every environment that renders the grid ' +
        '(dev, CI, end-to-end tests, Storybook, demos) needs the key.');
    }
  }

  if (!canClassify) {
    return 2;
  }

  return report.blocks ? 1 : 0;
});
