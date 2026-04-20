---
name: hyperformula
description: >
  Use this skill when the user works with HyperFormula (HF) — a headless,
  open-source TypeScript spreadsheet calculation engine. Use it when the user:
  mentions HyperFormula or HF; wants to integrate Excel-like formulas into a
  JS/TS app; evaluate formulas programmatically in a browser or Node.js;
  simulate spreadsheet or Excel calculation behavior server-side; run
  calculations over data parsed from XLSX files (e.g. via SheetJS) in code;
  build a pricing engine, financial model, or what-if analysis in code; define
  custom spreadsheet functions or named expressions outside of a UI context. Do
  NOT use this skill for: general Excel questions unrelated to HF; general
  Google Sheets questions; generic spreadsheet formula-syntax questions outside
  an HF context; formulas used inside Handsontable (use the "handsontable"
  skill instead).
---

# HyperFormula

HyperFormula is a **headless, open-source TypeScript spreadsheet calculation engine** for embedding spreadsheet logic in any JavaScript/TypeScript application (browser or Node.js). ~400 built-in functions, dependency graph, undo/redo, i18n (17 languages). Dual-licensed: GPLv3 or commercial.

- Docs: https://hyperformula.handsontable.com/
- npm: https://www.npmjs.com/package/hyperformula
- GitHub: https://github.com/handsontable/hyperformula

## Where to go next

Task-oriented references in `references/` (open the one that matches what the user is doing):

- [`getting-started.md`](references/getting-started.md) — how to install, create an instance (`buildFromArray` / `buildFromSheets` / `buildEmpty`), and work with cell addresses. Open this for onboarding questions and first-run errors.
- [`api-quickref.md`](references/api-quickref.md) — runnable examples for CRUD, rows/columns, sheets, exporting data, batching, named expressions, events, undo/redo, clipboard. Open this when implementing or debugging HF API calls.
- [`custom-functions.md`](references/custom-functions.md) — extending HyperFormula via `FunctionPlugin`: minimal plugin, argument types, volatile functions, range arguments, returning arrays, error handling, aliases, localized names. Open this when adding or debugging custom spreadsheet functions.
- [`configuration.md`](references/configuration.md) — `ConfigParams` options, Excel-compatibility preset, Google-Sheets preset, and config-related pitfalls (separator collisions, Node ICU, `precisionRounding` change in v3). Open this when tuning behavior or diagnosing locale issues.
- [`vue3.md`](references/vue3.md) — Vue 3 integration: `markRaw` requirement, Composition API, Pinia/Vuex stores, `destroy()` on unmount. Open this when embedding HF in a Vue 3 app.
- [`general-pitfalls.md`](references/general-pitfalls.md) — cross-cutting gotchas: error handling with `CellError`/`ErrorType`, `destroy()` lifecycle, forcing literal strings, Excel-parity caveats, hard limits. Open this when results look wrong or memory grows unboundedly.

Below this section is the **Documentation map** — the canonical directory of links to the official HyperFormula docs. Use it when pointing the user to authoritative material.

## Documentation map

All links resolve to `hyperformula.handsontable.com` unless noted.

### Introduction
- Welcome / Homepage: https://hyperformula.handsontable.com/
- Demo (mortgage calculator): https://hyperformula.handsontable.com/guide/demo.html

### Overview
- Quality (test coverage, CI): https://hyperformula.handsontable.com/guide/quality.html
- Supported browsers: https://hyperformula.handsontable.com/guide/supported-browsers.html
- Dependencies: https://hyperformula.handsontable.com/guide/dependencies.html
- Licensing (GPLv3 vs commercial): https://hyperformula.handsontable.com/guide/licensing.html
- Support: https://hyperformula.handsontable.com/guide/support.html

### Getting Started
- Client-side installation: https://hyperformula.handsontable.com/guide/client-side-installation.html
- Server-side installation (Node.js): https://hyperformula.handsontable.com/guide/server-side-installation.html
- Basic usage: https://hyperformula.handsontable.com/guide/basic-usage.html
- Advanced usage: https://hyperformula.handsontable.com/guide/advanced-usage.html
- Configuration options guide: https://hyperformula.handsontable.com/guide/configuration-options.html
- License key setup: https://hyperformula.handsontable.com/guide/license-key.html

### Framework Integration
- React: https://hyperformula.handsontable.com/guide/integration-with-react.html
- Vue: https://hyperformula.handsontable.com/guide/integration-with-vue.html
- Angular: https://hyperformula.handsontable.com/guide/integration-with-angular.html
- Svelte: https://hyperformula.handsontable.com/guide/integration-with-svelte.html

### Data Operations
- Basic operations (CRUD): https://hyperformula.handsontable.com/guide/basic-operations.html
- Batch operations: https://hyperformula.handsontable.com/guide/batch-operations.html
- Clipboard operations: https://hyperformula.handsontable.com/guide/clipboard-operations.html
- Undo-redo: https://hyperformula.handsontable.com/guide/undo-redo.html
- Sorting data: https://hyperformula.handsontable.com/guide/sorting-data.html

### Formulas
- Specifications and limits: https://hyperformula.handsontable.com/guide/specifications-and-limits.html
- Cell references (relative, absolute, mixed, cross-sheet): https://hyperformula.handsontable.com/guide/cell-references.html
- Types of values: https://hyperformula.handsontable.com/guide/types-of-values.html
- Types of errors: https://hyperformula.handsontable.com/guide/types-of-errors.html
- Types of operators: https://hyperformula.handsontable.com/guide/types-of-operators.html
- Order of precedence: https://hyperformula.handsontable.com/guide/order-of-precendece.html
- Built-in functions (full list, ~400): https://hyperformula.handsontable.com/guide/built-in-functions.html
- Volatile functions: https://hyperformula.handsontable.com/guide/volatile-functions.html
- Named expressions: https://hyperformula.handsontable.com/guide/named-expressions.html
- Array formulas / ARRAYFORMULA: https://hyperformula.handsontable.com/guide/arrays.html

### Internationalization
- i18n features (17 languages): https://hyperformula.handsontable.com/guide/i18n-features.html
- Localizing function names: https://hyperformula.handsontable.com/guide/localizing-functions.html
- Date and time handling: https://hyperformula.handsontable.com/guide/date-and-time-handling.html

### Compatibility
- Microsoft Excel compatibility: https://hyperformula.handsontable.com/guide/compatibility-with-microsoft-excel.html
- Google Sheets compatibility: https://hyperformula.handsontable.com/guide/compatibility-with-google-sheets.html
- Runtime differences (Excel & Sheets): https://hyperformula.handsontable.com/guide/list-of-differences.html

### Advanced Topics
- Key concepts (AST, dependency graph, evaluation): https://hyperformula.handsontable.com/guide/key-concepts.html
- Dependency graph: https://hyperformula.handsontable.com/guide/dependency-graph.html
- Building & testing from source: https://hyperformula.handsontable.com/guide/building.html
- Custom functions (FunctionPlugin): https://hyperformula.handsontable.com/guide/custom-functions.html
- Performance: https://hyperformula.handsontable.com/guide/performance.html
- Known limitations: https://hyperformula.handsontable.com/guide/known-limitations.html
- File import: https://hyperformula.handsontable.com/guide/file-import.html

### Upgrade & Migration
- Release notes / Changelog: https://hyperformula.handsontable.com/guide/release-notes.html
- 0.6 → 1.0 migration: https://hyperformula.handsontable.com/guide/migration-from-0.6-to-1.0.html
- 1.x → 2.0 migration: https://hyperformula.handsontable.com/guide/migration-from-1.x-to-2.0.html
- 2.x → 3.0 migration: https://hyperformula.handsontable.com/guide/migration-from-2.x-to-3.0.html

### API Reference
- API overview: https://hyperformula.handsontable.com/api/
- HyperFormula class (all methods): https://hyperformula.handsontable.com/api/classes/hyperformula.html
- ConfigParams interface (all options): https://hyperformula.handsontable.com/api/interfaces/configparams.html
- Listeners interface (all events): https://hyperformula.handsontable.com/api/interfaces/listeners.html

### npm
- npm page: https://www.npmjs.com/package/hyperformula

### Community & Support
- GitHub repo: https://github.com/handsontable/hyperformula
- GitHub Issues: https://github.com/handsontable/hyperformula/issues
- GitHub Discussions: https://github.com/handsontable/hyperformula/discussions
- Developer Forum: https://forum.handsontable.com/
- Commercial support: support@handsontable.com
- Sales (commercial license): sales@handsontable.com
- Contact form: https://handsontable.com/contact

---

> **Last updated: 2026-04-20 · Aligned with HyperFormula 3.2.0.**
> If the user is on a newer release, confirm API shape against the latest docs (see the **Release notes** link above) before relying on this file.
