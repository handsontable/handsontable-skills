#!/usr/bin/env bash
# Builds .skill packages from raw skill directories.
# Produces two formats per skill:
#   .skill  — gzipped tar archive (Claude Code)
#   .zip    — zip archive (Cowork / drag-and-drop install)
#
# Usage: ./build.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

build_skill() {
    local dir="$1"
    local name="${dir%-skill}"          # handsontable-skill → handsontable
    local tar_output="${name}.skill"
    local zip_output="${name}.zip"

    if [ ! -d "$dir" ]; then
        echo "ERROR: Directory '$dir' not found" >&2
        return 1
    fi

    if [ ! -f "$dir/SKILL.md" ]; then
        echo "ERROR: $dir/SKILL.md not found" >&2
        return 1
    fi

    # Stage clean copy: handsontable-skill/ → tmp/handsontable/
    local tmpdir
    tmpdir="$(mktemp -d)"
    trap "rm -rf '$tmpdir'" RETURN

    rsync -a --exclude='.DS_Store' --exclude='*.swp' "$dir/" "$tmpdir/$name/"

    # tar.gz for Claude Code
    tar czf "$tar_output" -C "$tmpdir" "$name"

    # zip for Cowork
    (cd "$tmpdir" && zip -rq "$SCRIPT_DIR/$zip_output" "$name")

    echo "Built $tar_output ($(du -h "$tar_output" | cut -f1)) + $zip_output ($(du -h "$zip_output" | cut -f1))"
}

SKIP_LINKS=false
for arg in "$@"; do
    case "$arg" in
        --skip-links) SKIP_LINKS=true ;;
    esac
done

# Check links first (unless skipped)
if [ "$SKIP_LINKS" = false ] && [ -f "$SCRIPT_DIR/check-links.sh" ]; then
    echo "Checking links..."
    echo ""
    "$SCRIPT_DIR/check-links.sh"
    echo ""
fi

echo "Building .skill packages..."
echo ""

build_skill "handsontable-skill"
build_skill "hyperformula-skill"

echo ""
echo "Done. Verify with: tar tzf <file>.skill  /  unzip -l <file>.zip"
