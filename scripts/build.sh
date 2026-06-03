#!/usr/bin/env bash
# Builds distributable artifacts for each skill.
# Produces two formats per skill into ./dist/:
#   <name>.zip      — zip archive (Cowork / Claude.ai web upload)
#   <name>-rag.md   — single flattened markdown doc (RAG sources)
#
# Source of truth is the raw folder at skills/<name>/. Both outputs are
# regenerated from that folder; nothing is built incrementally.
#
# Usage: ./scripts/build.sh [--skip-links]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
DIST_DIR="$REPO_DIR/dist"
cd "$REPO_DIR"

mkdir -p "$DIST_DIR"

build_skill() {
    local name="$1"                      # e.g. handsontable
    local dir="skills/$name"             # e.g. skills/handsontable
    local zip_output="$DIST_DIR/${name}.zip"

    if [ ! -d "$dir" ]; then
        echo "ERROR: Directory '$dir' not found" >&2
        return 1
    fi

    if [ ! -f "$dir/SKILL.md" ]; then
        echo "ERROR: $dir/SKILL.md not found" >&2
        return 1
    fi

    # Stage clean copy so the archive's top-level directory is just <name>/.
    local tmpdir
    tmpdir="$(mktemp -d)"
    trap "rm -rf '$tmpdir'" RETURN

    # package.json / README.md are npm-distribution metadata (see release.yml);
    # they are not part of the Cowork/Claude.ai skill payload, so keep them out
    # of the zip. The RAG build only reads SKILL.md + references/, so it is
    # unaffected.
    rsync -a --exclude='.DS_Store' --exclude='*.swp' \
        --exclude='package.json' --exclude='README.md' "$dir/" "$tmpdir/$name/"

    # zip for Cowork / Claude.ai web — delete first so removed files don't
    # linger (zip -r updates an existing archive in place).
    rm -f "$zip_output"
    (cd "$tmpdir" && zip -rq "$zip_output" "$name")

    echo "Built $(realpath --relative-to="$REPO_DIR" "$zip_output" 2>/dev/null || echo "${zip_output#$REPO_DIR/}") ($(du -h "$zip_output" | cut -f1))"
}

build_rag() {
    local name="$1"                          # e.g. handsontable
    local dir="skills/$name"
    local rag_output="$DIST_DIR/${name}-rag.md"

    if [ ! -f "$dir/SKILL.md" ]; then
        echo "ERROR: $dir/SKILL.md not found" >&2
        return 1
    fi

    {
        echo "# ${name} skill"
        echo
        echo "_Flattened single-doc build of \`${dir}/\` for RAG ingestion. Source of truth is the skill directory._"
        echo
        echo "---"
        echo
        echo "## ${dir}/SKILL.md"
        echo
        cat "$dir/SKILL.md"

        # Append every markdown file under references/ (sorted), with a heading
        # identifying its original path so filename collisions across skills
        # (e.g. docs-map.md) disappear when loaded into a RAG source.
        if [ -d "$dir/references" ]; then
            while IFS= read -r ref; do
                local rel="${ref#$dir/}"
                echo
                echo "---"
                echo
                echo "## ${dir}/${rel}"
                echo
                cat "$ref"
            done < <(find "$dir/references" -type f -name '*.md' | LC_ALL=C sort)
        fi
    } > "$rag_output"

    echo "Built ${rag_output#$REPO_DIR/} ($(du -h "$rag_output" | cut -f1))"
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

echo "Building zip archives..."
echo ""

build_skill "handsontable"
build_skill "hyperformula"

echo ""
echo "Building RAG docs..."
echo ""

build_rag "handsontable"
build_rag "hyperformula"

echo ""
echo "Done. Verify with: unzip -l dist/<name>.zip  /  head dist/<name>-rag.md"
