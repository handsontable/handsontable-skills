# Handsontable Skills for Claude

Claude skills for [Handsontable](https://handsontable.com) (data grid component) and [HyperFormula](https://hyperformula.handsontable.com) (headless spreadsheet calculation engine). These skills give Claude deep knowledge of both products so it can help you build, configure, and debug faster.

## Skills included

| Skill | What it covers |
|-------|---------------|
| **handsontable** | The data grid component — React/Angular/Vue/vanilla JS setup, configuration, theming, cell types, sorting, filtering, formulas (via HyperFormula), hooks, performance, and v17 migration. |
| **hyperformula** | The headless calculation engine — instance creation, CRUD, custom functions, named expressions, error handling, batch operations, and Node.js usage. |

**When to use which:** If you're building a visible grid in a web app, use `handsontable`. If you're evaluating formulas programmatically without a UI (server-side calculations, pricing engines, what-if analysis), use `hyperformula`. Both skills cross-reference each other.

## Installation

### Claude Code — plugin marketplace (recommended)

```
/plugin marketplace add handsontable/handsontable-skills
/plugin install handsontable-skills@handsontable-skills
```

This installs both skills together. Claude Code will load `handsontable` and `hyperformula` automatically based on what you ask.

### Cowork / Claude.ai web — zip upload

Download `handsontable.zip` and/or `hyperformula.zip` from the [latest GitHub release](https://github.com/handsontable/handsontable-skills/releases/latest), then drag the zip into the Cowork chat or upload it via Settings → Features → Skills on Claude.ai.

### Claude Code — manual install from source

User-scope (available in every project — recommended for product-knowledge skills like these):

```bash
git clone https://github.com/handsontable/handsontable-skills.git /tmp/handsontable-skills
mkdir -p ~/.claude/skills
cp -r /tmp/handsontable-skills/skills/handsontable ~/.claude/skills/
cp -r /tmp/handsontable-skills/skills/hyperformula ~/.claude/skills/
rm -rf /tmp/handsontable-skills
```

Project-scope (only available in this project — run from your project root):

```bash
git clone https://github.com/handsontable/handsontable-skills.git /tmp/handsontable-skills
mkdir -p .claude/skills
cp -r /tmp/handsontable-skills/skills/handsontable .claude/skills/
cp -r /tmp/handsontable-skills/skills/hyperformula .claude/skills/
rm -rf /tmp/handsontable-skills
```

### Claude API — programmatic upload

Upload `skills/handsontable/` and `skills/hyperformula/` to the Skills API. Each folder contains the `SKILL.md` and `references/` that the API expects.

## Distribution formats

We ship the skills in three forms because Anthropic's surfaces accept different inputs. Use whichever matches the platform you're installing into.

| Format | Where it lives | Use case |
|---|---|---|
| **Raw skill folder** | `skills/<name>/` (this repo) | Source of truth. Used directly by Claude Code (`.claude/skills/`), the Claude API (folder upload), and as the input to every other format. Edit here when contributing. |
| **`.zip` archive** | [GitHub Releases](https://github.com/handsontable/handsontable-skills/releases) (built from source on tag push) | Drag-and-drop install for Cowork and Claude.ai web. Both platforms require zip and reject other archive formats. |
| **`-rag.md` flat doc** | `dist/` (this repo) | Single concatenated markdown of `SKILL.md` + every reference file. For loading the skill into a RAG / vector store / chatbot context window where directory trees aren't supported. |

> Earlier versions also shipped a `.skill` (gzipped tar) artifact. That format isn't accepted by Cowork or Claude.ai web and isn't part of Anthropic's documented spec, so it was removed.

## Repository structure

```
.
├── README.md
├── LICENSE.txt
├── .claude-plugin/
│   └── marketplace.json          ← enables /plugin marketplace add
├── skills/                       ← source of truth
│   ├── handsontable/
│   │   ├── SKILL.md
│   │   └── references/
│   └── hyperformula/
│       ├── SKILL.md
│       └── references/
├── dist/                         ← generated artifacts (some tracked, some gitignored)
│   ├── handsontable-rag.md       ← tracked
│   ├── hyperformula-rag.md       ← tracked
│   ├── handsontable.zip          ← gitignored, built on demand / by CI
│   └── hyperformula.zip          ← gitignored, built on demand / by CI
├── scripts/
│   ├── build.sh                  ← regenerates dist/*.zip and dist/*-rag.md
│   └── check-links.sh            ← verifies all skill URLs return 200
└── .github/workflows/release.yml ← builds zips on tag push, attaches to Release
```

## Building artifacts

After editing files in `skills/`, regenerate the dist artifacts:

```bash
./scripts/build.sh
```

This checks all documentation links for 404s, then writes `dist/handsontable.zip`, `dist/hyperformula.zip`, `dist/handsontable-rag.md`, and `dist/hyperformula-rag.md`.

To skip the link check (e.g., offline, or in CI):

```bash
./scripts/build.sh --skip-links
```

To check links independently, or auto-fix redirects:

```bash
./scripts/check-links.sh
./scripts/check-links.sh --fix-redirects
```

### Releasing a new version

Each skill is tagged independently and the tag's version matches the underlying product version, so `handsontable-skills/handsontable@v17.0.0` is the skill that targets Handsontable 17.0.0. Both skills live in one repo (rather than two) because they cross-reference each other constantly — a change in one almost always wants a paired check in the other, and a monorepo keeps that atomic.

Tag formats:

```bash
# Skill matches a Handsontable / HyperFormula product release
git tag handsontable/v17.0.0   && git push origin handsontable/v17.0.0
git tag hyperformula/v3.2.0    && git push origin hyperformula/v3.2.0

# Skill-only fix (typo, broken link, no product change) — same product version + suffix
git tag handsontable/v17.0.0+skill.1   && git push origin handsontable/v17.0.0+skill.1
```

Each push triggers `.github/workflows/release.yml`, which builds the matching skill's zip and attaches it (plus the flat `-rag.md`) to a GitHub Release named after the tag. The other skill is unaffected.

Regenerate and commit the tracked `dist/*-rag.md` files before tagging so RAG consumers see the same content as the released zip.

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

**Progressive disclosure via `references/`.** Each skill keeps `SKILL.md` short (under ~500 lines) as the always-loaded entry point, and pushes detail into `references/*.md` files that Claude reads on demand. The `handsontable` skill currently uses one `references/docs-map.md` curated link directory; the `hyperformula` skill is split into seven topic-specific reference files (api-quickref, configuration, custom-functions, error-handling, general-pitfalls, getting-started, vue3) plus the docs map. Both patterns are valid — split when one file grows past readability.

**Why this works.** Claude reads `SKILL.md` on every invocation, so it always has the conceptual foundation. For specifics, it follows links from the docs-map (or the topic-specific references) to the live docs. This approach means a new product version typically only requires updating version numbers and adding new entries — not rewriting the skill.

**Standards we followed when creating these skills:**

- Keep SKILL.md under ~500 lines; use reference files for overflow.
- Lead with working code examples that can be copy-pasted.
- Include a "Common Pitfalls" section based on real issues users hit.
- Include a "What this skill does NOT cover" section to help Claude route to the right skill.
- Add "Last verified" dates to docs-map files so staleness is visible.
- Make skill descriptions slightly "pushy" — Claude tends to under-trigger skills, so descriptions should be generous with trigger phrases.
- Cross-reference related skills by name so Claude can point users to the right one.

If you're adding a new skill or updating an existing one, follow these patterns and submit a PR.
