#!/usr/bin/env bash
# Builds .skill packages from raw skill directories.
# Produces three formats per skill:
#   .skill    — gzipped tar archive (Claude Code)
#   .zip      — zip archive (Cowork / drag-and-drop install)
#   -rag.md   — single flattened markdown doc (RAG sources)
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

    # zip for Cowork — delete first so removed files don't linger (zip -r updates in place)
    rm -f "$SCRIPT_DIR/$zip_output"
    (cd "$tmpdir" && zip -rq "$SCRIPT_DIR/$zip_output" "$name")

    echo "Built $tar_output ($(du -h "$tar_output" | cut -f1)) + $zip_output ($(du -h "$zip_output" | cut -f1))"
}

build_rag() {
    local dir="$1"
    local name="${dir%-skill}"
    local rag_output="${name}-rag.md"

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

    echo "Built $rag_output ($(du -h "$rag_output" | cut -f1))"
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
echo "Building RAG docs..."
echo ""

build_rag "handsontable-skill"
build_rag "hyperformula-skill"

echo ""
echo "Done. Verify with: tar tzf <file>.skill  /  unzip -l <file>.zip  /  head <file>-rag.md"
