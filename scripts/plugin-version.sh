#!/usr/bin/env bash
# Keeps the Claude Code plugin version in .claude-plugin/plugin.json moving.
#
# Claude Code only hands users a new copy of the plugin when that version
# changes: `claude plugin update` and auto-update compare it and keep the
# cached copy while it matches. It sat at 1.0.0 for every skill update until
# 1.0.1, so installs never received them.
#
# Usage:
#   scripts/plugin-version.sh bump <base-ref>
#       If the working tree's version is not higher than <base-ref>'s, set it
#       to <base-ref>'s version with the patch bumped. Prints the version.
#       Run by .github/workflows/dist-sync.yml on PRs.
#   scripts/plugin-version.sh check <before> <after>
#       Exit 1 if skills/ or .claude-plugin/ changed between the two commits
#       but the version did not increase. Run by plugin-check.yml on pushes
#       to main, to catch two PRs that both bumped to the same version.

set -euo pipefail

cd "$(dirname "$0")/.."

MANIFEST=.claude-plugin/plugin.json
VERSION_RE='^  "version": "([0-9]+\.[0-9]+\.[0-9]+)",?$'

# Reads the version from manifest text on stdin; fails unless exactly one
# top-level "version" line matches.
read_version() {
    local matches
    matches="$(sed -nE "s/$VERSION_RE/\1/p")"
    if [ -z "$matches" ] || [ "$(printf '%s\n' "$matches" | wc -l)" -ne 1 ]; then
        echo "::error::expected exactly one '\"version\": \"X.Y.Z\"' line in $MANIFEST" >&2
        return 1
    fi
    printf '%s\n' "$matches"
}

# true when $1 is a strictly higher version than $2
is_newer() {
    [ "$1" != "$2" ] && [ "$(printf '%s\n%s\n' "$1" "$2" | sort -V | tail -1)" = "$1" ]
}

case "${1:-}" in
    bump)
        base_ref="${2:?usage: $0 bump <base-ref>}"
        base="$(git show "$base_ref:$MANIFEST" | read_version)"
        have="$(read_version < "$MANIFEST")"
        if is_newer "$have" "$base"; then
            echo "$have"
            exit 0
        fi
        IFS=. read -r major minor patch <<< "$base"
        next="$major.$minor.$((patch + 1))"
        sed -i.bak -E "s/^(  \"version\": \")[0-9]+\.[0-9]+\.[0-9]+(\",?)$/\1$next\2/" "$MANIFEST"
        rm -f "$MANIFEST.bak"
        echo "$next"
        ;;
    check)
        before="${2:?usage: $0 check <before> <after>}"
        after="${3:?usage: $0 check <before> <after>}"
        if git diff --quiet "$before" "$after" -- skills .claude-plugin; then
            echo "skills/ and .claude-plugin/ unchanged — no version bump needed"
            exit 0
        fi
        old="$(git show "$before:$MANIFEST" | read_version)"
        new="$(git show "$after:$MANIFEST" | read_version)"
        if is_newer "$new" "$old"; then
            echo "plugin version $old -> $new"
            exit 0
        fi
        echo "::error::skills/ or .claude-plugin/ changed but the plugin version stayed at $new — pinned installs won't receive it. Open a PR that bumps \"version\" in $MANIFEST." >&2
        exit 1
        ;;
    *)
        echo "usage: $0 bump <base-ref> | check <before> <after>" >&2
        exit 2
        ;;
esac
