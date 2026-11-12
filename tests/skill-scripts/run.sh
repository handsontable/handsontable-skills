#!/usr/bin/env bash
# Runs the helper scripts in skills/handsontable/scripts/ against fixtures and
# a real installed handsontable package. The scripts read internals of the
# installed package (option schema, hook constants, license classifier), so a
# Handsontable release that moves those files shows up here first.
#
# Usage: tests/skill-scripts/run.sh [handsontable-version]   (default: latest)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPTS="$ROOT/skills/handsontable/scripts"
FIXTURES="$ROOT/tests/skill-scripts/fixtures"
VERSION="${1:-latest}"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

echo "Installing handsontable@$VERSION..."
npm install --prefix "$WORK/ht" --no-audit --no-fund --silent "handsontable@$VERSION" >/dev/null
HT_DIR="$WORK/ht/node_modules/handsontable"
echo "Installed $(node -p "require('$HT_DIR/package.json').version")"

FAIL=0
check() { # check <name> <expected-exit> <command...>
  local name="$1" expected="$2"; shift 2
  local out code=0
  out="$("$@" 2>&1)" || code=$?
  if [ "$code" != "$expected" ]; then
    echo "FAIL  $name: exit $code, expected $expected"; echo "$out" | sed 's/^/      /'; FAIL=1
  else
    echo "ok    $name"
  fi
  LAST="$out"
}
expect() { # expect <name> <grep-pattern>
  if grep -qE -- "$2" <<<"$LAST"; then echo "ok    $1"; else echo "FAIL  $1: missing /$2/"; FAIL=1; fi
}

# validate-settings
check "validate: bad settings fail" 1 node "$SCRIPTS/validate-settings.mjs" "$FIXTURES/settings-bad.mjs" --ht-dir "$HT_DIR"
expect "validate: plural plugin typo" 'Did you mean "notification"'
expect "validate: removed option" 'persistentState" was removed in 17.0.0'
expect "validate: removed hook" 'persistentStateSave" hook was removed'
expect "validate: hook typo" 'Did you mean "afterChange"'
expect "validate: hook in column" 'columns\[2\]\.afterChange'
expect "validate: casing typo" 'Did you mean "readOnly"'
expect "validate: Numbro format" 'columns\[0\]\.numericFormat'
expect "validate: string dateFormat" 'columns\[1\]\.dateFormat'
expect "validate: correctFormat" 'correctFormat" was removed in 18.0.0'
expect "validate: missing licenseKey" 'settings\.licenseKey'
check "validate: good settings pass" 0 node "$SCRIPTS/validate-settings.mjs" "$FIXTURES/settings-good.json" --ht-dir "$HT_DIR"
check "validate: stdin + json" 0 sh -c "node '$SCRIPTS/validate-settings.mjs' --stdin --json --ht-dir '$HT_DIR' < '$FIXTURES/settings-good.json'"
check "validate: no handsontable is a usage error" 2 node "$SCRIPTS/validate-settings.mjs" "$FIXTURES/settings-good.json" --project "$WORK"

# license-doctor
check "license: non-commercial runs" 0 node "$SCRIPTS/license-doctor.mjs" --key non-commercial-and-evaluation --ht-dir "$HT_DIR"
expect "license: non-commercial state" 'State: +non_commercial'
check "license: missing blocks" 1 env -u HANDSONTABLE_LICENSE_KEY node "$SCRIPTS/license-doctor.mjs" --ht-dir "$HT_DIR"
expect "license: missing state" 'State: +missing'
check "license: garbage blocks" 1 node "$SCRIPTS/license-doctor.mjs" --key 'not-a-key' --ht-dir "$HT_DIR"
expect "license: invalid state" 'State: +invalid'
check "license: HyperFormula key flagged" 1 node "$SCRIPTS/license-doctor.mjs" --key gpl-v3 --ht-dir "$HT_DIR"
expect "license: HyperFormula hint" 'HyperFormula license key'
check "license: whitespace trimmed" 0 node "$SCRIPTS/license-doctor.mjs" --key ' non-commercial-and-evaluation ' --ht-dir "$HT_DIR"
expect "license: whitespace noted" 'leading/trailing whitespace'
check "license: key from env, json" 0 env HANDSONTABLE_LICENSE_KEY=non-commercial-and-evaluation node "$SCRIPTS/license-doctor.mjs" --json --ht-dir "$HT_DIR"
expect "license: json blocks=false" '"blocks": false'

# migrate-v18 (runs on a copy so --write does not touch the fixture)
cp -R "$FIXTURES/project" "$WORK/project"
check "migrate: dry run reports" 1 node "$SCRIPTS/migrate-v18.mjs" "$WORK/project"
expect "migrate: common subpath" "handsontable/common"
expect "migrate: Numbro" 'numericFormat\.pattern'
expect "migrate: string dateFormat" "dateFormat: 'DD/MM/YYYY'"
expect "migrate: positional selector" '\.ht-root-wrapper >'
expect "migrate: hyperformula unbundled" 'hyperformula. is not a dependency'
expect "migrate: version bump" 'Bump it to \^18'
grep -q "handsontable/common" "$WORK/project/src/grid.ts" || { echo "FAIL  migrate: dry run changed a file"; FAIL=1; }
check "migrate: --write" 1 node "$SCRIPTS/migrate-v18.mjs" "$WORK/project" --write
grep -q "from 'handsontable';" "$WORK/project/src/grid.ts" && echo "ok    migrate: import rewritten" || { echo "FAIL  migrate: import not rewritten"; FAIL=1; }
grep -q "correctFormat" "$WORK/project/src/grid.ts" && { echo "FAIL  migrate: correctFormat line kept"; FAIL=1; } || echo "ok    migrate: correctFormat line deleted"
grep -q -- "--ht-border-radius" "$WORK/project/src/grid.css" && echo "ok    migrate: CSS variable renamed" || { echo "FAIL  migrate: CSS variable not renamed"; FAIL=1; }
check "migrate: second --write is a no-op" 1 node "$SCRIPTS/migrate-v18.mjs" "$WORK/project" --write
expect "migrate: nothing left to auto-fix" '0 automatic fix'

if [ "$FAIL" = 0 ]; then echo; echo "All skill script checks passed."; else echo; echo "Some checks failed."; exit 1; fi
