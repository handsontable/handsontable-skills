# @handsontable/hyperformula-skill

An agent skill for [**HyperFormula**](https://hyperformula.handsontable.com) — the headless, open-source TypeScript spreadsheet calculation engine. It gives any AI coding agent deep, task-oriented knowledge of HyperFormula so the agent can help you integrate, configure, and debug the engine faster.

This package is the npm distribution of the `hyperformula` skill maintained in [`handsontable/handsontable-skills`](https://github.com/handsontable/handsontable-skills). The package version tracks the HyperFormula product version the skill targets (e.g. `3.3.0` targets HyperFormula 3.3.0).

## What's in the package

A self-contained skill — plain markdown, no runtime dependencies:

```
SKILL.md        ← entry point: concepts, routing, and a docs map (YAML frontmatter + body)
references/     ← task-oriented deep-dives the agent reads on demand
```

`SKILL.md` follows the [Agent Skills](https://claude.com/blog/skills) layout (a YAML frontmatter block with `name`/`description`, followed by markdown instructions). Any agent that can load a skill — or simply read a folder of markdown instructions — can use it.

## Install

```bash
npm install @handsontable/hyperformula-skill
```

The installed package lives at `node_modules/@handsontable/hyperformula-skill`. Resolve that path programmatically with:

```bash
node -p "require.resolve('@handsontable/hyperformula-skill/SKILL.md')"
```

Then make the skill available to your agent using whichever of the following matches it:

### Claude Code

Copy the package into a skills directory. User scope (available in every project):

```bash
cp -r node_modules/@handsontable/hyperformula-skill ~/.claude/skills/hyperformula
```

Or project scope, from your project root:

```bash
cp -r node_modules/@handsontable/hyperformula-skill .claude/skills/hyperformula
```

### Claude API

Upload the package contents (`SKILL.md` + `references/`) to the [Skills API](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview).

### Any other agent

Most coding agents support a skills, rules, or knowledge directory. Copy (or symlink) the package folder into it, for example:

```bash
# Replace <agent-skills-dir> with your agent's skills/knowledge directory
cp -r node_modules/@handsontable/hyperformula-skill <agent-skills-dir>/hyperformula
```

If your agent reads a single instruction file rather than a folder, point it at `SKILL.md`; it links the files under `references/` so the agent can pull them in as needed. For RAG / vector-store setups, ingest `SKILL.md` together with every file under `references/` (the repository also publishes a pre-flattened `hyperformula-rag.md` for this case).

## Other distribution formats

The same skill source is also shipped as a drag-and-drop `.zip` (Cowork / Claude.ai web), a flattened `-rag.md` doc (RAG / vector stores), and a Claude Code plugin marketplace entry. See the [repository README](https://github.com/handsontable/handsontable-skills#readme) for details.

## License

MIT — see the [repository](https://github.com/handsontable/handsontable-skills/blob/main/LICENSE.txt). HyperFormula itself is separately licensed (GPLv3 or commercial); see the [licensing guide](https://hyperformula.handsontable.com/docs/guide/licensing.html).
