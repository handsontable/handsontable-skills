# Handsontable Skills for Claude

Claude skills for [Handsontable](https://handsontable.com) (data grid component) and [HyperFormula](https://hyperformula.handsontable.com) (headless spreadsheet calculation engine). These skills give Claude deep knowledge of both products so it can help you build, configure, and debug faster.

## Skills included

| Skill | What it covers |
|-------|---------------|
| **handsontable** | The data grid component — React/Angular/Vue/vanilla JS setup, configuration, theming, cell types, sorting, filtering, formulas (via HyperFormula), hooks, performance, and v17 migration. |
| **hyperformula** | The headless calculation engine — instance creation, CRUD, custom functions, named expressions, error handling, batch operations, and Node.js usage. |

**When to use which:** If you're building a visible grid in a web app, use `handsontable`. If you're evaluating formulas programmatically without a UI (server-side calculations, pricing engines, what-if analysis), use `hyperformula`. Both skills cross-reference each other.

## Installation

### npm (recommended)

```bash
npm install @handsontable/claude-skills
```

Then copy the skill folders into your project:

```bash
cp -r node_modules/@handsontable/claude-skills/handsontable-skill .claude/skills/handsontable
cp -r node_modules/@handsontable/claude-skills/hyperformula-skill .claude/skills/hyperformula
```

### From GitHub releases

Download the `.skill` file from the [latest release](https://github.com/handsontable/handsontable-skills/releases/latest) and install it:

- **Cowork:** Drag the `.skill` file into the chat, or use the "Save skill" button if presented.
- **Claude Code:** Place the skill folder in your project's `.claude/skills/` directory.

### From source

```bash
git clone https://github.com/handsontable/handsontable-skills.git
cp -r handsontable-skills/handsontable-skill .claude/skills/handsontable
cp -r handsontable-skills/hyperformula-skill .claude/skills/hyperformula
```

## Repository structure

```
├── README.md
├── LICENSE.txt
├── handsontable-skill/         ← raw skill (source of truth)
│   ├── SKILL.md
│   └── references/
│       └── docs-map.md
├── hyperformula-skill/         ← raw skill (source of truth)
│   ├── SKILL.md
│   └── references/
│       └── docs-map.md
├── handsontable.skill          ← installable package (built from raw)
├── hyperformula.skill          ← installable package (built from raw)
├── build.sh                    ← checks links + regenerates .skill files
└── check-links.sh              ← verifies all docs-map URLs return 200
```

## Building `.skill` packages

After editing the raw skill directories, regenerate the installable packages:

```bash
./build.sh
```

This checks all documentation links for 404s, then creates `handsontable.skill` and `hyperformula.skill` as gzipped tar archives that Cowork and Claude Code can install directly.

To skip the link check (e.g., offline or in CI where speed matters):

```bash
./build.sh --skip-links
```

To check links independently, or auto-fix redirects:

```bash
./check-links.sh
./check-links.sh --fix-redirects
```

## Resources

- [Handsontable docs](https://handsontable.com/docs/)
- [HyperFormula docs](https://hyperformula.handsontable.com/)
- [Handsontable GitHub](https://github.com/handsontable/handsontable)
- [HyperFormula GitHub](https://github.com/handsontable/hyperformula)
- [Community forum](https://forum.handsontable.com/)

## License

These skills are provided under the MIT License. See [LICENSE.txt](LICENSE.txt) for details.

Handsontable and HyperFormula themselves are separately licensed products. A commercial Handsontable license includes HyperFormula when used inside the grid. HyperFormula can also be purchased separately for standalone/headless use.

| | Handsontable | HyperFormula |
|---|---|---|
| **Non-commercial** | Free (`licenseKey: 'non-commercial-and-evaluation'`) | Free (GPLv3, `licenseKey: 'gpl-v3'`) |
| **Commercial** | Paid, per developer/year *includes HyperFormula* | Paid, per user/year |
| **Pricing** | [handsontable.com/pricing](https://handsontable.com/pricing) | [sales@handsontable.com](mailto:sales@handsontable.com) |
| **License details** | [License key docs](https://handsontable.com/docs/react-data-grid/license-key/) | [Licensing guide](https://hyperformula.handsontable.com/guide/licensing.html) |

## Contributing

We welcome contributions to improve these skills. A few things to know about how they're designed:

**Design philosophy.** These skills are intentionally conceptual rather than exhaustive. They teach Claude how to think about each product — when to use what, common patterns, pitfalls to avoid — rather than trying to replicate the full documentation. The goal is for the skills to remain useful across product versions with minimal updates.

**The docs-map pattern.** Each skill includes a `references/docs-map.md` file that serves as a curated link directory to the live documentation. When Claude needs specific details (API signatures, configuration options, migration steps), the skill directs it to fetch the relevant docs page rather than embedding those details in the skill itself. This means the real source of truth is always the live documentation, and the skill acts as a knowledgeable guide that knows where to look.

**Why this works.** Claude reads the SKILL.md on every invocation, so it always has the conceptual foundation. For specifics, it follows links from the docs-map to the live docs. This approach means a new product version typically only requires updating version numbers and adding new docs-map entries — not rewriting the skill.

**Standards we followed when creating these skills:**

- Keep SKILL.md under ~500 lines; use reference files for overflow.
- Lead with working code examples that can be copy-pasted.
- Include a "Common Pitfalls" section based on real issues users hit.
- Include a "What this skill does NOT cover" section to help Claude route to the right skill.
- Add "Last verified" dates to docs-map files so staleness is visible.
- Make skill descriptions slightly "pushy" — Claude tends to under-trigger skills, so descriptions should be generous with trigger phrases.
- Cross-reference related skills by name so Claude can point users to the right one.

If you're adding a new skill or updating an existing one, follow these patterns and submit a PR.
