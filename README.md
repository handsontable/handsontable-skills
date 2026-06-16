# Handsontable Agent Skills

Agent skills for [Handsontable](https://handsontable.com) (data grid component) and [HyperFormula](https://hyperformula.handsontable.com) (headless spreadsheet calculation engine) to use in Claude Code, Codex, and other coding agents. These skills give your agent deep knowledge of both products so it can help you build, configure, and debug faster.

## Skills included

| Skill | What it covers |
|-------|---------------|
| **handsontable** | The data grid component — React/Angular/Vue/vanilla JS setup, configuration, theming, cell types, sorting, filtering, formulas (via HyperFormula), hooks, performance, and v17 migration. |
| **hyperformula** | The headless calculation engine — instance creation, CRUD, custom functions, named expressions, error handling, batch operations, and Node.js usage. |

**When to use which:** If you're building a visible grid in a web app, use `handsontable`. If you're evaluating formulas programmatically without a UI (server-side calculations, pricing engines, what-if analysis), use `hyperformula`. Both skills cross-reference each other.

## Installation

### Claude Code — plugin marketplace (recommended)
Run these as prompts in Claude Code, not as terminal commands. 

```
/plugin marketplace add handsontable/handsontable-skills
/plugin install handsontable-skills@handsontable-skills
```
Then restart Claude Code or prompt with `/reload-plugins` slash command. 

This installs both skills together. Claude Code will load `handsontable` and `hyperformula` automatically based on what you ask.

### Cowork / Claude.ai web — zip upload

Download `handsontable.zip` and/or `hyperformula.zip` from the [latest GitHub release](https://github.com/handsontable/handsontable-skills/releases), then drag the zip into the Cowork chat or upload it via Settings → Features → Skills on Claude.ai.

### Claude Code — manual install from source

Clone the repo somewhere convenient:

```bash
git clone https://github.com/handsontable/handsontable-skills.git
```

Then copy the two skill folders into your Claude Code skills directory. Pick the scope that fits — both assume Claude Code is already set up so `.claude/skills/` exists.

**User-scope** — skills available in every project (recommended for product-knowledge skills like these):

```bash
cp -r handsontable-skills/skills/handsontable ~/.claude/skills/
cp -r handsontable-skills/skills/hyperformula ~/.claude/skills/
```

**Project-scope** — skills available only in one project. From inside that project's root:

```bash
cp -r /path/to/handsontable-skills/skills/handsontable .claude/skills/
cp -r /path/to/handsontable-skills/skills/hyperformula .claude/skills/
```

Keep the cloned repo around to `git pull` updates and re-copy when this skill ships a new release.

### Claude API — programmatic upload

Upload `skills/handsontable/` and `skills/hyperformula/` to the Skills API. Each folder contains the `SKILL.md` and `references/` that the API expects.

### npm — hyperformula skill

The `hyperformula` skill is also published to npm as [`@handsontable/hyperformula-skill`](https://www.npmjs.com/package/@handsontable/hyperformula-skill) for use in any agent toolchain:

```bash
npm install @handsontable/hyperformula-skill
```
See the [package README](skills/hyperformula/README.md) for how to wire it into Claude Code, the Claude API, or any other agent.

### Other coding agents — npx skills installer

The community `skills` CLI can install this repo into agents that support Agent Skills, including Codex.

Install both skills for Codex:

```bash
npx skills add handsontable/handsontable-skills \
  --agent codex \
  --global \
  --skill '*' \
  --copy \
  --yes
```

Install only HyperFormula Skill:
```bash
npx skills add handsontable/handsontable-skills \
  --agent codex \
  --global \
  --skill hyperformula \
  --copy \
  --yes
  ```
Replace codex with another supported agent id from the skills CLI [agent list](https://github.com/vercel-labs/skills#supported-agents). Omit --global for project-scoped installation.

## Distribution formats

We ship the skills in several forms because different agents and surfaces accept different inputs. Use whichever matches the platform you're installing into.

| Format | Where it lives | Use case |
|---|---|---|
| **Raw skill folder** | `skills/<name>/` (this repo) | Source of truth. Used directly by Claude Code (`.claude/skills/`), the Claude API (folder upload), and as the input to every other format. Edit here when contributing. |
| **`.zip` archive** | [GitHub Releases](https://github.com/handsontable/handsontable-skills/releases) (built from source on tag push) | Drag-and-drop install for Cowork and Claude.ai web. Both platforms require zip and reject other archive formats. |
| **`-rag.md` flat doc** | `dist/` (this repo) | Single concatenated markdown of `SKILL.md` + every reference file. For loading the skill into a RAG / vector store / chatbot context window where directory trees aren't supported. |
| **npm package** | [`@handsontable/hyperformula-skill`](https://www.npmjs.com/package/@handsontable/hyperformula-skill) (published on tag push) | `npm install` the skill into a JS/TS toolchain and copy it into your agent's skills directory. Currently the `hyperformula` skill only; the package version tracks the HyperFormula product version. |

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
│       ├── references/
│       ├── package.json          ← npm distribution metadata
│       └── README.md             ← npm package page
├── dist/                         ← generated artifacts (some tracked, some gitignored)
│   ├── handsontable-rag.md       ← tracked
│   ├── hyperformula-rag.md       ← tracked
│   ├── handsontable.zip          ← gitignored, built on demand / by CI
│   └── hyperformula.zip          ← gitignored, built on demand / by CI
├── scripts/
│   ├── build.sh                  ← regenerates dist/*.zip and dist/*-rag.md
│   └── check-links.sh            ← verifies all skill URLs return 200
└── .github/workflows/
    ├── ht-skill-release.yml      ← handsontable: build zip on tag push, attach to Release
    └── hf-skill-release.yml      ← hyperformula: build zip + publish to npm on tag push
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

## How to publish a new version of the skills

Each skill is versioned and released independently. The flow is the same for both skills; only `hyperformula` additionally publishes to npm.

### Versioning convention

A skill's version matches the underlying product version, so the tag `hyperformula/v3.3.0` is the skill that targets HyperFormula 3.3.0 and `handsontable/v17.0.0` targets Handsontable 17.0.0. Both skills live in one repo (rather than two) because they cross-reference each other constantly — a change in one almost always wants a paired check in the other, and a monorepo keeps that atomic.

Tag formats:

```bash
# Skill matches a Handsontable / HyperFormula product release
handsontable/v17.0.0
hyperformula/v3.3.0

# Skill-only fix (typo, broken link, no product change) — same product version + suffix
handsontable/v17.0.0+skill.1
hyperformula/v3.3.0+skill.1
```

### Release steps (both skills)

1. **Edit the skill** under `skills/<name>/`. For `hyperformula` you do **not** bump `skills/hyperformula/package.json` by hand — CI sets the npm version from the tag (keep the committed value at the current product version as a sane default).
2. **Rebuild the dist artifacts** so the tracked RAG doc matches what will ship:

   ```bash
   ./scripts/build.sh
   ```

   This checks links, then regenerates `dist/<name>.zip` and `dist/<name>-rag.md`.
3. **Commit** the source change and the regenerated `dist/*-rag.md` (the `.zip` files are gitignored and rebuilt by CI):

   ```bash
   git add skills/<name> dist/<name>-rag.md
   git commit -m "Update <name> skill for <product> <version>"
   git push
   ```
4. **Tag and push** the release tag. Pushing the tag is what triggers the release — there is no manual build/upload step:

   ```bash
   # Handsontable
   git tag handsontable/v17.0.0   && git push origin handsontable/v17.0.0
   # HyperFormula
   git tag hyperformula/v3.3.0    && git push origin hyperformula/v3.3.0
   # Skill-only fix (either skill)
   git tag hyperformula/v3.3.0+skill.1 && git push origin hyperformula/v3.3.0+skill.1
   ```

### What happens automatically on each tag push

Each skill has its own workflow, so the two release fully independently — tagging one never touches the other.

- **`handsontable/v*`** → [`.github/workflows/ht-skill-release.yml`](.github/workflows/ht-skill-release.yml):
  1. Runs `./scripts/build.sh --skip-links` to build `dist/handsontable.zip` and `dist/handsontable-rag.md`.
  2. Creates a GitHub Release named after the tag (with auto-generated notes) and attaches both files.

- **`hyperformula/v*`** → [`.github/workflows/hf-skill-release.yml`](.github/workflows/hf-skill-release.yml):
  1. Builds `dist/hyperformula.zip` and `dist/hyperformula-rag.md` and attaches them to a GitHub Release, same as above.
  2. **Additionally publishes [`@handsontable/hyperformula-skill`](https://www.npmjs.com/package/@handsontable/hyperformula-skill) to npm** with provenance. The npm version is derived from the tag (`hyperformula/v3.3.0` → `3.3.0`). A skill-only re-tag (`hyperformula/v3.3.0+skill.1`) publishes a prerelease (`3.3.0-skill.1`) under the `skill-fix` dist-tag instead, because npm strips semver build metadata and would otherwise collide with the already-published `3.3.0`; these never overwrite `latest`. Install them explicitly with `npm install @handsontable/hyperformula-skill@skill-fix`.

`handsontable` is not published to npm — only the `hyperformula` folder carries a `package.json`.

### One-time npm setup (hyperformula)

Before the first npm publish, an org owner must:

- **Add the `NPM_TOKEN` secret** — a [granular npm automation token](https://docs.npmjs.com/creating-and-viewing-access-tokens) with publish rights to the `@handsontable` scope, stored under **Settings → Secrets and variables → Actions**.
- **Confirm scope access** — `@handsontable` is a scoped package published with `--access public`; the token's owner must be a member of the `@handsontable` org on npm.

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
| **License details** | [License key docs](https://handsontable.com/docs/react-data-grid/license-key/) | [Licensing guide](https://hyperformula.handsontable.com/docs/guide/licensing.html) |

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
