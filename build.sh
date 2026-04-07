#!/usr/bin/env bash
# Builds .skill packages from raw skill directories.
# Each .skill file is a gzipped tar archive with the skill folder at the root.
#
# Usage: ./build.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

build_skill() {
    local dir="$1"
    local name="${dir%-skill}"          # handsontable-skill → handsontable
    local output="${name}.skill"

    if [ ! -d "$dir" ]; then
        echo "ERROR: Directory '$dir' not found" >&2
        return 1
    fi

    if [ ! -f "$dir/SKILL.md" ]; then
        echo "ERROR: $dir/SKILL.md not found" >&2
        return 1
    fi

    # Create tar with the skill name as the top-level directory
    # e.g., handsontable-skill/ → handsontable/ inside the archive
    tar czf "$output" \
        --transform "s|^${dir}|${name}|" \
        --exclude='.DS_Store' \
        --exclude='*.swp' \
        "$dir"

    echo "Built $output ($(du -h "$output" | cut -f1))"
}

echo "Building .skill packages..."
echo ""

build_skill "handsontable-skill"
build_skill "hyperformula-skill"

echo ""
echo "Done. Verify contents with: tar tzf <file>.skill"
