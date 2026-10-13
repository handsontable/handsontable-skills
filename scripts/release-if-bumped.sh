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
# Idempotent: a tag that already has a GitHub Release is left alone; a tag
# without one (an earlier run pushed it, then the dispatch or the release
# failed) is dispatched again. Both skills are always attempted; the exit
# status is non-zero if either failed.
#
# Run by .github/workflows/release-on-merge.yml after every merge to main.
# Needs: tags fetched (fetch-depth: 0), GH_TOKEN with actions:write.
#
# Usage: scripts/release-if-bumped.sh [--dry-run]

set -euo pipefail

DRY_RUN=false
[ "${1:-}" = "--dry-run" ] && DRY_RUN=true

cd "$(dirname "$0")/.."

# Only ever tag what main holds: a manual run of the workflow from a feature
# branch (or a local run) must not release an unreviewed commit. npm versions
# are immutable, and an early tag would also block the reviewed release.
if [ "$DRY_RUN" != true ]; then
    git fetch -q origin main
    if ! git merge-base --is-ancestor HEAD origin/main; then
        echo "::error::HEAD $(git rev-parse --short HEAD) is not on origin/main — refusing to tag. Releases are cut from main only." >&2
        exit 1
    fi
fi

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

# Dispatch the skill's release workflow on the tag. A just-pushed tag can take
# a moment to become dispatchable; retry.
dispatch() { # <skill> <tag>
    local attempt
    for attempt in 1 2 3 4 5 6; do
        if gh workflow run "$(workflow "$1")" --ref "$2"; then
            echo "::notice::$2 — $(workflow "$1") dispatched on the tag"
            return 0
        fi
        echo "  dispatch attempt $attempt failed; retrying in 10 s" >&2
        sleep 10
    done
    echo "::error::could not dispatch $(workflow "$1") on $2 — re-run this workflow (it retries a tag that has no GitHub Release yet), or run the release workflow by hand on the tag" >&2
    return 1
}

failed=0
for skill in handsontable hyperformula; do
    have="$(marker "$skill")"
    if [ -z "$have" ]; then
        echo "::error::could not read the version marker in skills/$skill/SKILL.md — update the pattern in $0 if the marker moved" >&2
        failed=1
        continue
    fi
    tagged="$(newest_tag "$skill")"
    tag="$skill/v$have"

    if git rev-parse -q --verify "refs/tags/$tag" >/dev/null; then
        # Tagged already. Released too? If a previous run pushed the tag but
        # the dispatch (or the release run) failed, there is no GitHub Release
        # yet: dispatch again. The release workflows are idempotent (they
        # update an existing release; npm skips a version already published).
        if gh release view "$tag" >/dev/null 2>&1; then
            echo "$skill: $tag is tagged and released — nothing to do"
        elif [ "$DRY_RUN" = true ]; then
            echo "$skill: $tag is tagged but has no GitHub Release — would dispatch $(workflow "$skill") again"
        else
            echo "$skill: $tag is tagged but has no GitHub Release — dispatching $(workflow "$skill") again"
            dispatch "$skill" "$tag" || failed=1
        fi
        continue
    fi

    if [ -n "$tagged" ] && ! is_newer "$have" "$tagged"; then
        echo "$skill: SKILL.md says $have, newest tag is $skill/v$tagged — nothing to release"
        continue
    fi

    if [ "$DRY_RUN" = true ]; then
        echo "$skill: would tag $(git rev-parse --short HEAD) as $tag and dispatch $(workflow "$skill") (newest tag: ${tagged:-none})"
        continue
    fi

    echo "$skill: SKILL.md says $have, newest tag is ${tagged:-none} — releasing $tag"
    if ! git tag "$tag" HEAD || ! git push origin "refs/tags/$tag"; then
        echo "::error::could not create or push $tag" >&2
        failed=1
        continue
    fi
    dispatch "$skill" "$tag" || failed=1
done

exit "$failed"
