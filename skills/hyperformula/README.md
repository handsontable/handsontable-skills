# @handsontable/hyperformula-skill

A Claude skill for [**HyperFormula**](https://hyperformula.handsontable.com) — the headless, open-source TypeScript spreadsheet calculation engine. It gives Claude deep, task-oriented knowledge of HyperFormula so it can help you integrate, configure, and debug the engine faster.

This package is the npm distribution of the `hyperformula` skill maintained in [`handsontable/handsontable-skills`](https://github.com/handsontable/handsontable-skills). The package version tracks the HyperFormula product version the skill targets (e.g. `3.3.0` targets HyperFormula 3.3.0).

## What's in the package

```
SKILL.md        ← always-loaded entry point (concepts, routing, docs map)
references/     ← task-oriented deep-dives loaded on demand
```

## Install

```bash
npm install @handsontable/hyperformula-skill
```

Then make the skill available to Claude Code by copying it into a skills directory. For example, user scope (available in every project):

```bash
cp -r node_modules/@handsontable/hyperformula-skill ~/.claude/skills/hyperformula
```

Or project scope, from your project root:

```bash
cp -r node_modules/@handsontable/hyperformula-skill .claude/skills/hyperformula
```

For the Claude API, upload the package contents (`SKILL.md` + `references/`) to the Skills API.

## Other distribution formats

The same skill source is also shipped as a drag-and-drop `.zip` (Cowork / Claude.ai web), a flattened `-rag.md` doc (RAG / vector stores), and a Claude Code plugin marketplace entry. See the [repository README](https://github.com/handsontable/handsontable-skills#readme) for details.

## License

MIT — see the [repository](https://github.com/handsontable/handsontable-skills/blob/main/LICENSE.txt). HyperFormula itself is separately licensed (GPLv3 or commercial); see the [licensing guide](https://hyperformula.handsontable.com/docs/guide/licensing.html).
