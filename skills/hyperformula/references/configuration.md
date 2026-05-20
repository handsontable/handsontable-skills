# Configuration

`ConfigParams` + compatibility presets + config-specific pitfalls. Authoritative docs:
- Configuration options guide: https://hyperformula.handsontable.com/docs/guide/configuration-options.html
- ConfigParams (all options): https://hyperformula.handsontable.com/docs/api/interfaces/configparams.html
- Excel compatibility: https://hyperformula.handsontable.com/docs/guide/compatibility-with-microsoft-excel.html
- Google Sheets compatibility: https://hyperformula.handsontable.com/docs/guide/compatibility-with-google-sheets.html

## ConfigParams highlights

Pass as the second argument to any factory method.

```ts
const hf = HyperFormula.buildEmpty({
  licenseKey: 'gpl-v3',           // required — 'gpl-v3' for open source
  precisionRounding: 10,          // decimal rounding precision (default 10; was 14 before v3)
  functionArgSeparator: ',',      // separator between function arguments
  dateFormats: ['DD/MM/YYYY', 'DD-MM-YYYY'],
  nullDate: { year: 1900, month: 1, day: 1 },
  leapYear1900: false,            // Excel bug compat: treat 1900 as leap year
  maxRows: 40000,                 // max rows per sheet (default 40000)
  maxColumns: 18278,              // max columns per sheet (default 18278 = 'ZZZ')
  undoLimit: 20,                  // undo history depth
  maxPendingLazyTransformations: 1000, // v3.3+ — cap accumulated lazy transformations before cleanup
});
```

## Excel compatibility preset

```ts
const hf = HyperFormula.buildEmpty({
  licenseKey: 'gpl-v3',
  useArrayArithmetic: true,
  useWildcards: true,
  evaluateNullToZero: true,
  leapYear1900: true,     // Excel's intentional 1900 leap-year bug
  ignoreWhiteSpace: 'any',
  caseSensitive: false,
  accentSensitive: true,
});
```

## Google Sheets compatibility preset

Defaults already match Google Sheets behavior (`leapYear1900: false`, `useArrayArithmetic: false`).

```ts
const hf = HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' });
```

## Config-specific pitfalls

### Vue 3

Vue 3 requires wrapping the instance with `markRaw` — see [vue3.md](vue3.md) for the full integration guide (React / Angular / Svelte need no special handling).

### `functionArgSeparator` vs `thousandSeparator` collision

These two options **cannot share a character**. European locales that use `,` as thousand separator must change the argument separator:

```ts
const hf = HyperFormula.buildEmpty({
  licenseKey: 'gpl-v3',
  thousandSeparator: ',',
  decimalSeparator: '.',
  functionArgSeparator: ';',  // must differ from thousandSeparator
});
```

### Node.js must have full ICU

String comparisons (used in `MATCH`, `VLOOKUP`, sorting) can silently produce wrong results on Node.js < 13 or builds without full ICU. Verify at startup:

```ts
// Must report 'full' (or a detailed ICU version), not 'small'.
console.log(process.versions.icu);
```

### Tuning `maxPendingLazyTransformations` (v3.3+)

HyperFormula defers some structural transformations (row/column insertions, moves) and applies them lazily. In long-lived instances with heavy mutation throughput — bulk imports, frequent undo/redo, scripted batch edits — the pending queue can grow before cleanup. v3.3 fixed the unbounded-growth leak; this option lets you cap the queue explicitly. Lower values trade memory for more frequent flush work; the default is suitable for typical UI workloads.

### `precisionRounding` default changed in v3

Before v3 the default was `14`. It is now `10`. Calculations relying on the old precision need an explicit override:

```ts
const hf = HyperFormula.buildEmpty({
  licenseKey: 'gpl-v3',
  precisionRounding: 14,  // pre-v3 behavior
});
```
