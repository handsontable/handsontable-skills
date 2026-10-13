#!/usr/bin/env bash
# Release every skill whose version marker moved past its newest release tag.
#
# For each skill, read the version it is aligned with from its SKILL.md
# marker (the same markers handsontable-knowledge's skill-update pipeline
# parses):
#   handsontable  `- **Latest version:** 18.1.2 (October 2026)`
#   hyperformula  `Aligned with HyperFormula 3.5.0.`
# If that version is newer than the highest `<skill>/vX.Y.Z` tag, tag HEAD as
# `<skill>/v<version>`, push the tag, and dispatch the skill's release
# workflow on it.
#
# Why dispatch instead of relying on the tag push: a tag pushed with a
# workflow's GITHUB_TOKEN does not start other workflows (GitHub's guard
# against recursive runs), but workflow_dispatch is exempt from that rule.
# The release workflows keep their file names, so npm trusted publishing
# (bound to hf-skill-release.yml) is unchanged.
#
# Skill-only fix tags (`<skill>/vX.Y.Z+skill.N`) stay manual: they do not
# move the marker, and this script ignores them when finding the newest tag.
#
# Run by .github/workflows/release-on-merge.yml after every merge to main.
# Needs: tags fetched (fetch-depth: 0), GH_TOKEN with actions:write.
#
# Usage: scripts/release-if-bumped.sh [--dry-run]

set -euo pipefail

DRY_RUN=false
[ "${1:-}" = "--dry-run" ] && DRY_RUN=true

cd "$(dirname "$0")/.."

marker() {
    case "$1" in
        handsontable)
            sed -nE 's/.*\*\*Latest version:\*\*[[:space:]]*([0-9]+\.[0-9]+\.[0-9]+).*/\1/p' skills/handsontable/SKILL.md | head -1 ;;
        hyperformula)
            sed -nE 's/.*Aligned with HyperFormula[[:space:]]+([0-9]+\.[0-9]+\.[0-9]+).*/\1/p' skills/hyperformula/SKILL.md | head -1 ;;
    esac
}

workflow() {
    case "$1" in
        handsontable) echo ht-skill-release.yml ;;
        hyperformula) echo hf-skill-release.yml ;;
    esac
}

# Highest plain X.Y.Z tag for the skill ("+skill.N" fix tags excluded).
newest_tag() {
    git tag -l "$1/v*" | sed -E "s#^$1/v##" | grep -E '^[0-9]+\.[0-9]+\.[0-9]+$' | sort -V | tail -1 || true
}

# true when $1 is a strictly higher version than $2
is_newer() {
    [ "$1" != "$2" ] && [ "$(printf '%s\n%s\n' "$1" "$2" | sort -V | tail -1)" = "$1" ]
}

for skill in handsontable hyperformula; do
    have="$(marker "$skill")"
    if [ -z "$have" ]; then
        echo "::error::could not read the version marker in skills/$skill/SKILL.md — update the pattern in $0 if the marker moved" >&2
        exit 1
    fi
    tagged="$(newest_tag "$skill")"

    if [ -n "$tagged" ] && ! is_newer "$have" "$tagged"; then
        echo "$skill: SKILL.md says $have, newest tag is $skill/v$tagged — nothing to release"
        continue
    fi

    tag="$skill/v$have"
    if git rev-parse -q --verify "refs/tags/$tag" >/dev/null; then
        echo "$skill: $tag already exists — nothing to release"
        continue
    fi

    if [ "$DRY_RUN" = true ]; then
        echo "$skill: would tag $(git rev-parse --short HEAD) as $tag and dispatch $(workflow "$skill") (newest tag: ${tagged:-none})"
        continue
    fi

    echo "$skill: SKILL.md says $have, newest tag is ${tagged:-none} — releasing $tag"
    git tag "$tag" HEAD
    git push origin "refs/tags/$tag"
    # A just-pushed tag can take a moment to become dispatchable; retry.
    dispatched=false
    for attempt in 1 2 3 4 5 6; do
        if gh workflow run "$(workflow "$skill")" --ref "$tag"; then dispatched=true; break; fi
        echo "  dispatch attempt $attempt failed; retrying in 10 s" >&2
        sleep 10
    done
    if [ "$dispatched" != true ]; then
        echo "::error::tagged $tag but could not dispatch $(workflow "$skill") — run it by hand on the tag (Actions → Run workflow → use workflow from $tag)" >&2
        exit 1
    fi
    echo "::notice::released $tag — $(workflow "$skill") dispatched on the tag"
done
