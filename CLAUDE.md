# Repository rules for Claude

This repo publishes **production skills** consumed by Anthropic customers via Claude Code, Cowork, and the Claude API. Every code example, API signature, configuration option, and URL in `skills/` is read by Claude when answering customer questions about Handsontable or HyperFormula.

**A wrong example is worse than no example.** Customers copy snippets into their own code; fabricated API shapes cause runtime failures and erode trust in both the products and Claude.

## The rule: never fabricate

Do not invent, guess, or "reasonably approximate" any of the following:

- **Method names, function signatures, or return shapes** (e.g., `fetchRows({page, pageSize}) => {rows, totalRows}` — every key matters)
- **Configuration option names or accepted values** (e.g., `dataProvider`, `themeName`, `licenseKey`)
- **Hook / event names and their callback parameters**
- **Plugin names** (singular vs plural matters — `notification` ≠ `notifications`)
- **Documentation URLs** (always verify with `./scripts/check-links.sh`)
- **Version numbers, release dates, feature availability claims**

If you do not have a verified source for a fact you are about to write, **stop and verify** before writing it.

## How to verify

In order of preference:

1. **TypeScript definitions** in the upstream source. Both products are open source:
   - Handsontable: https://github.com/handsontable/handsontable (look in `handsontable/src/plugins/*/` and `handsontable/types/`)
   - HyperFormula: https://github.com/handsontable/hyperformula
2. **Official documentation** at the canonical URLs:
   - Handsontable: https://handsontable.com/docs/
   - HyperFormula: https://hyperformula.handsontable.com/docs/
3. **Release notes / changelogs** for newly added features:
   - Handsontable: https://handsontable.com/docs/react-data-grid/release-notes/
   - HyperFormula: https://hyperformula.handsontable.com/docs/guide/release-notes.html
4. **Cloned local copies** of either repo on disk (faster + works offline).

`./scripts/check-links.sh` will catch broken URLs but it cannot catch wrong method names, wrong parameter shapes, or wrong option keys. Those require reading the source.

## If verification fails

You have three acceptable choices, in order of preference:

1. **Verify properly** — fetch the source, read the docs, find the type definition.
2. **Omit the example** — write prose describing what the plugin does and link to the official guide. No code is better than wrong code.
3. **Ask the user** — surface that you cannot find an authoritative source and ask them to either point you to one or confirm the omission.

Never write `// example — verify against docs before using` and ship it. That is fabrication wearing a disclaimer.

## Workflow checklist for any skill edit

Before committing changes to `skills/`:

- [ ] Every code snippet introduced or modified has been cross-checked against an authoritative source (TS types, official docs, or upstream source).
- [ ] Every URL added passes `./scripts/check-links.sh` (no `--fix-redirects` for new links — they should be correct on first write).
- [ ] Plugin / option names match the casing and pluralization in the official docs.
- [ ] Version-gated features include the version they were introduced in (e.g., "v17.1+").
- [ ] `./scripts/build.sh --skip-links` regenerates `dist/*-rag.md` cleanly.

## Why this matters

This repo's whole purpose is to make Claude a reliable expert on these two products. A skill that confidently asserts a wrong API shape teaches Claude to lie about that API to every future customer who asks. The cost of fabricating once is paid over and over.

When in doubt: read the source.
