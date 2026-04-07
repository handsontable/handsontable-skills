#!/usr/bin/env bash
# Checks all URLs in skill markdown files for broken links (HTTP 4xx/5xx).
# Exits with code 1 if any broken links are found.
#
# Usage: ./check-links.sh [--fix-redirects]
#
# Options:
#   --fix-redirects   Automatically replace URLs that return 301/302 with their redirect target

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

FIX_REDIRECTS=false
if [[ "${1:-}" == "--fix-redirects" ]]; then
    FIX_REDIRECTS=true
fi

# Collect all URLs from markdown files in skill directories
URLS=$(grep -rhoP 'https://[^\s)>\]"]+' \
    handsontable-skill/ hyperformula-skill/ \
    | sed 's/[.,;:]*$//' \
    | sort -u)

TOTAL=$(echo "$URLS" | wc -l | tr -d ' ')
echo "Checking $TOTAL unique URLs..."
echo ""

BROKEN=()
REDIRECTED=()
OK=0
SKIPPED=0
COUNT=0

for url in $URLS; do
    COUNT=$((COUNT + 1))

    # Get HTTP status code, follow redirects to check final destination
    # but also capture if initial response was a redirect
    STATUS=$(curl -o /dev/null -s -w "%{http_code}" --max-time 10 -L "$url" 2>/dev/null || echo "000")
    INITIAL_STATUS=$(curl -o /dev/null -s -w "%{http_code}" --max-time 10 "$url" 2>/dev/null || echo "000")

    if [[ "$STATUS" == "000" ]]; then
        printf "  %-4s TIMEOUT  %s\n" "[$COUNT]" "$url"
        BROKEN+=("TIMEOUT $url")
    elif [[ "$STATUS" =~ ^[45] ]]; then
        printf "  %-4s %s  %s\n" "[$COUNT]" "$STATUS" "$url"
        BROKEN+=("$STATUS $url")
    elif [[ "$INITIAL_STATUS" =~ ^3 ]] && [[ "$STATUS" =~ ^2 ]]; then
        REDIRECT_TARGET=$(curl -o /dev/null -s -w "%{redirect_url}" --max-time 10 "$url" 2>/dev/null || echo "")
        printf "  %-4s %s→%s  %s\n" "[$COUNT]" "$INITIAL_STATUS" "$STATUS" "$url"
        if [[ -n "$REDIRECT_TARGET" ]]; then
            printf "        ↳ %s\n" "$REDIRECT_TARGET"
            REDIRECTED+=("$url → $REDIRECT_TARGET")
        fi
        OK=$((OK + 1))
    elif [[ "$STATUS" =~ ^2 ]]; then
        OK=$((OK + 1))
    else
        printf "  %-4s %s  %s\n" "[$COUNT]" "$STATUS" "$url"
        SKIPPED=$((SKIPPED + 1))
    fi
done

echo ""
echo "Results: $OK ok, ${#BROKEN[@]} broken, ${#REDIRECTED[@]} redirected, $SKIPPED other"

if [[ ${#REDIRECTED[@]} -gt 0 ]]; then
    echo ""
    echo "Redirected URLs (consider updating):"
    for r in "${REDIRECTED[@]}"; do
        echo "  $r"
    done

    if [[ "$FIX_REDIRECTS" == true ]]; then
        echo ""
        echo "Fixing redirects in source files..."
        for r in "${REDIRECTED[@]}"; do
            OLD_URL="${r%% →*}"
            NEW_URL="${r##*→ }"
            # Replace in all markdown files
            find handsontable-skill/ hyperformula-skill/ -name '*.md' \
                -exec sed -i "s|${OLD_URL}|${NEW_URL}|g" {} +
            echo "  Fixed: $OLD_URL"
        done
    fi
fi

if [[ ${#BROKEN[@]} -gt 0 ]]; then
    echo ""
    echo "Broken URLs:"
    for b in "${BROKEN[@]}"; do
        echo "  $b"
    done
    echo ""
    echo "FAILED: ${#BROKEN[@]} broken link(s) found."
    exit 1
fi

echo ""
echo "All links OK."
