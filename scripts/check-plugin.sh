#!/usr/bin/env bash
# Installs this repo's Claude Code plugin from the local marketplace and fails
# if Claude Code refuses to load it, or loads it without every skill in skills/.
# Exits with code 1 on any failure.
#
# Usage: ./check-plugin.sh
#
# Notes:
#   - `claude plugin validate` is not enough: it passes manifests that the
#     loader later rejects (e.g. a marketplace entry with "strict": false and a
#     `skills` list next to a plugin.json — "conflicting manifests").
#   - Runs against a throwaway HOME, so it never touches your own Claude Code
#     settings and needs no login.
#   - Requires the `claude` CLI on PATH (CI installs @anthropic-ai/claude-code).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_DIR"

CLAUDE_BIN="$(command -v claude || true)"
if [[ -z "$CLAUDE_BIN" ]]; then
    echo "claude CLI not found on PATH" >&2
    exit 1
fi

TMP_HOME="$(mktemp -d)"
trap 'rm -rf "$TMP_HOME"' EXIT

# Isolated environment: no user settings, no config-dir overrides.
run_claude() {
    env -u CLAUDE_CONFIG_DIR HOME="$TMP_HOME" "$CLAUDE_BIN" "$@"
}

echo "Claude Code $(run_claude --version)"

MARKETPLACE="$(node -p 'require("./.claude-plugin/marketplace.json").name')"
PLUGINS="$(node -p 'require("./.claude-plugin/marketplace.json").plugins.map(p => p.name).join("\n")')"
EXPECTED_SKILLS="$(find skills -mindepth 2 -maxdepth 2 -name SKILL.md -exec dirname {} \; | xargs -n1 basename | sort | paste -sd, -)"

run_claude plugin validate .
run_claude plugin marketplace add ./

failed=0
for plugin in $PLUGINS; do
    id="$plugin@$MARKETPLACE"
    run_claude plugin install "$id"

    errors="$(run_claude plugin list --json | node -e '
        const id = process.argv[1];
        const p = JSON.parse(require("fs").readFileSync(0, "utf8")).find(x => x.id === id);
        if (!p) { console.log("not installed"); process.exit(); }
        console.log((p.errors || []).join("\n"));
    ' "$id")"
    if [[ -n "$errors" ]]; then
        echo "FAIL: $id did not load:" >&2
        echo "$errors" >&2
        failed=1
        continue
    fi

    # `plugin details` has no --json; parse its "Skills (N)  a, b" line.
    loaded_skills="$(run_claude plugin details "$id" | sed -nE 's/^[[:space:]]*Skills \([0-9]+\)[[:space:]]+//p' | tr ',' '\n' | tr -d ' ' | sed '/^$/d' | sort | paste -sd, -)"
    if [[ "$loaded_skills" != "$EXPECTED_SKILLS" ]]; then
        echo "FAIL: $id loaded skills [$loaded_skills], expected [$EXPECTED_SKILLS]" >&2
        failed=1
        continue
    fi

    echo "OK: $id loads with skills [$loaded_skills]"
done

exit "$failed"
