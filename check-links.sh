#!/usr/bin/env bash
# Checks all URLs in skill markdown files for broken links (HTTP 4xx/5xx).
# Exits with code 1 if any broken links are found.
#
# Usage: ./check-links.sh [--fix-redirects]
#
# Options:
#   --fix-redirects   Automatically replace URLs that return 301/302 with their redirect target
#
# Notes:
#   - Sends a browser-like User-Agent to avoid false 403s (e.g., npmjs.com)
#   - Timeouts (status 000) are reported as warnings, not failures — they
#     usually mean the network is restricted, not that the URL is broken
#   - Uses xargs for parallel requests (10 at a time)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

FIX_REDIRECTS=false
for arg in "$@"; do
    case "$arg" in
        --fix-redirects) FIX_REDIRECTS=true ;;
    esac
done

UA="Mozilla/5.0 (compatible; link-checker/1.0)"

# Domains that return 403 to automated requests but are not actually broken
ALLOWLIST_403="npmjs.com"

# Collect all URLs from markdown files in skill directories
URLS_FILE=$(mktemp)
RESULTS_FILE=$(mktemp)
trap 'rm -f "$URLS_FILE" "$RESULTS_FILE"' EXIT

# Extract URLs — use grep -oE for macOS/BSD compatibility (no -P flag)
grep -rhoE 'https://[^[:space:])"<>]+' \
    handsontable-skill/ hyperformula-skill/ \
    | sed 's/[.,;:)]*$//' \
    | sort -u > "$URLS_FILE"

TOTAL=$(wc -l < "$URLS_FILE" | tr -d ' ')
echo "Checking $TOTAL unique URLs..."
echo ""

# Check each URL: output "initial_status|final_status|redirect_target|url"
check_one() {
    local url="$1"
    local ua="$2"
    local initial final redirect

    # curl outputs "000" on connection failure; no need for || fallback
    initial=$(curl -o /dev/null -s -w "%{http_code}" -A "$ua" --max-time 15 "$url" 2>/dev/null)
    final=$(curl -o /dev/null -s -w "%{http_code}" -A "$ua" --max-time 15 -L "$url" 2>/dev/null)

    redirect=""
    if [[ "$initial" =~ ^3 ]]; then
        redirect=$(curl -o /dev/null -s -w "%{redirect_url}" -A "$ua" --max-time 15 "$url" 2>/dev/null)
    fi

    echo "${initial}|${final}|${redirect}|${url}"
}
export -f check_one

# Run 10 in parallel via xargs
cat "$URLS_FILE" | xargs -P 10 -I{} bash -c 'check_one "$@"' _ {} "$UA" > "$RESULTS_FILE"

# Process results
BROKEN=()
REDIRECTED=()
TIMEOUTS=()
OK=0

while IFS='|' read -r initial_status final_status redirect_target url; do
    if [[ "$final_status" == "000" ]]; then
        TIMEOUTS+=("$url")
    elif [[ "$final_status" == "403" ]] && echo "$url" | grep -qF "$ALLOWLIST_403"; then
        OK=$((OK + 1))
    elif [[ "$final_status" =~ ^[45] ]]; then
        printf "  BROKEN  %s  %s\n" "$final_status" "$url"
        BROKEN+=("$final_status $url")
    elif [[ "$initial_status" =~ ^3 ]] && [[ "$final_status" =~ ^2 ]]; then
        printf "  REDIRECT  %s→%s  %s\n" "$initial_status" "$final_status" "$url"
        if [[ -n "$redirect_target" ]]; then
            printf "            ↳ %s\n" "$redirect_target"
            REDIRECTED+=("$url → $redirect_target")
        fi
        OK=$((OK + 1))
    elif [[ "$final_status" =~ ^2 ]]; then
        OK=$((OK + 1))
    fi
done < "$RESULTS_FILE"

echo ""
echo "Results: $OK ok, ${#BROKEN[@]} broken, ${#REDIRECTED[@]} redirected, ${#TIMEOUTS[@]} timed out"

if [[ ${#TIMEOUTS[@]} -gt 0 ]]; then
    echo ""
    echo "Timed out (${#TIMEOUTS[@]} URLs — likely network restriction, not broken):"
    SHOWN=0
    for t in "${TIMEOUTS[@]}"; do
        if (( SHOWN < 5 )); then
            echo "  $t"
            SHOWN=$((SHOWN + 1))
        fi
    done
    if (( ${#TIMEOUTS[@]} > 5 )); then
        echo "  ... and $((${#TIMEOUTS[@]} - 5)) more"
    fi
fi

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
            # sed -i differs between GNU and BSD — detect and handle both
            if sed --version 2>/dev/null | grep -q GNU; then
                find handsontable-skill/ hyperformula-skill/ -name '*.md' \
                    -exec sed -i "s|${OLD_URL}|${NEW_URL}|g" {} +
            else
                find handsontable-skill/ hyperformula-skill/ -name '*.md' \
                    -exec sed -i '' "s|${OLD_URL}|${NEW_URL}|g" {} +
            fi
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
if [[ ${#TIMEOUTS[@]} -gt 0 ]]; then
    echo "All reachable links OK. ${#TIMEOUTS[@]} URLs timed out (re-run on an unrestricted network to verify)."
else
    echo "All links OK."
fi
