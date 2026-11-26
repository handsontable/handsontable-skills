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
HT_MAJOR="$(node -p "parseInt(require('$HT_DIR/package.json').version, 10)")"

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
# 19.0.0 removed the non-commercial key: 18.x reads it as `non_commercial`, 19.0+ as `invalid`.
if [ "$HT_MAJOR" -ge 19 ]; then FREE_EXIT=1; FREE_STATE='invalid'; FREE_BLOCKS='true'; FREE_NOTE='free key that Handsontable 19\.0 removed'
else FREE_EXIT=0; FREE_STATE='non_commercial'; FREE_BLOCKS='false'; FREE_NOTE='Before you upgrade'; fi
check "license: non-commercial runs" "$FREE_EXIT" node "$SCRIPTS/license-doctor.mjs" --key non-commercial-and-evaluation --ht-dir "$HT_DIR"
expect "license: non-commercial state" "State: +$FREE_STATE"
expect "license: non-commercial removal note" "$FREE_NOTE"
check "license: second form of the non-commercial key" "$FREE_EXIT" node "$SCRIPTS/license-doctor.mjs" --key ht68e-1f2b7-47158-70b05-0842f --ht-dir "$HT_DIR"
expect "license: second form state" "State: +$FREE_STATE"
check "license: missing blocks" 1 env -u HANDSONTABLE_LICENSE_KEY node "$SCRIPTS/license-doctor.mjs" --ht-dir "$HT_DIR"
expect "license: missing state" 'State: +missing'
check "license: garbage blocks" 1 node "$SCRIPTS/license-doctor.mjs" --key 'not-a-key' --ht-dir "$HT_DIR"
expect "license: invalid state" 'State: +invalid'
check "license: HyperFormula key flagged" 1 node "$SCRIPTS/license-doctor.mjs" --key gpl-v3 --ht-dir "$HT_DIR"
expect "license: HyperFormula hint" 'HyperFormula license key'
check "license: whitespace trimmed" "$FREE_EXIT" node "$SCRIPTS/license-doctor.mjs" --key ' non-commercial-and-evaluation ' --ht-dir "$HT_DIR"
expect "license: whitespace noted" 'leading/trailing whitespace'
check "license: key from env, json" "$FREE_EXIT" env HANDSONTABLE_LICENSE_KEY=non-commercial-and-evaluation node "$SCRIPTS/license-doctor.mjs" --json --ht-dir "$HT_DIR"
expect "license: json blocks" "\"blocks\": $FREE_BLOCKS"

# migrate-v18 (runs on copies so --write does not touch the fixture)
cp -R "$FIXTURES/project" "$WORK/project"
check "migrate: dry run reports" 1 node "$SCRIPTS/migrate-v18.mjs" "$WORK/project"
expect "migrate: common subpath" "handsontable/common"
expect "migrate: Numbro" 'numericFormat\.pattern'
expect "migrate: string dateFormat" "dateFormat: 'DD/MM/YYYY'"
expect "migrate: positional selector" '\.ht-root-wrapper >'
expect "migrate: hyperformula unbundled" 'hyperformula. is not a dependency'
expect "migrate: version bump" 'Bump it to \^18'
expect "migrate: build dir skipped and listed" 'project/build/$'
expect "migrate: nested vendor dir scanned" 'src/vendor/legacy\.ts'
grep -q "handsontable/common" "$WORK/project/src/grid.ts" || { echo "FAIL  migrate: dry run changed a file"; FAIL=1; }
check "migrate: unknown flag is a usage error" 2 node "$SCRIPTS/migrate-v18.mjs" "$WORK/project" --writ
grep -q "handsontable/common" "$WORK/project/src/grid.ts" || { echo "FAIL  migrate: unknown flag wrote"; FAIL=1; }
# Fixture declares handsontable ^17 and has none installed: correctFormat must be reported, not deleted.
check "migrate: --write on 17.x (--project=)" 1 sh -c "cd '$WORK' && node '$SCRIPTS/migrate-v18.mjs' --project='$WORK/project' --write"
grep -q "from 'handsontable';" "$WORK/project/src/grid.ts" && echo "ok    migrate: import rewritten" || { echo "FAIL  migrate: import not rewritten"; FAIL=1; }
grep -q "correctFormat" "$WORK/project/src/grid.ts" && echo "ok    migrate: correctFormat kept on 17.x" || { echo "FAIL  migrate: correctFormat deleted on 17.x"; FAIL=1; }
grep -q -- "--ht-border-radius" "$WORK/project/src/grid.css" && echo "ok    migrate: CSS variable renamed" || { echo "FAIL  migrate: CSS variable not renamed"; FAIL=1; }
grep -q "handsontable/common" "$WORK/project/build/out.js" && echo "ok    migrate: build dir untouched" || { echo "FAIL  migrate: build dir rewritten"; FAIL=1; }
# With 18.x installed the line is deleted, but only in files that mention Handsontable.
check "migrate: --write on 18.x" 1 node "$SCRIPTS/migrate-v18.mjs" --project "$WORK/project" --ht-dir "$HT_DIR" --write
grep -q "correctFormat" "$WORK/project/src/grid.ts" && { echo "FAIL  migrate: correctFormat line kept on 18.x"; FAIL=1; } || echo "ok    migrate: correctFormat line deleted on 18.x"
grep -q "correctFormat" "$WORK/project/src/other-datepicker.ts" && echo "ok    migrate: non-Handsontable file untouched" || { echo "FAIL  migrate: non-Handsontable correctFormat deleted"; FAIL=1; }
check "migrate: second --write is a no-op" 1 node "$SCRIPTS/migrate-v18.mjs" --project "$WORK/project" --ht-dir "$HT_DIR" --write
expect "migrate: nothing left to auto-fix" '0 automatic fix'

# migrate-v19 (an 18.x project, on a copy)
cp -R "$FIXTURES/project19" "$WORK/project19"
check "migrate19: dry run reports" 1 node "$SCRIPTS/migrate-v19.mjs" --project "$WORK/project19"
expect "migrate19: removed license key" "grid\.ts:10  licenseKey: 'non-commercial-and-evaluation'"
expect "migrate19: removed resize method" 'grid\.ts:30  .*saveManualColumnWidths'
expect "migrate19: removed type" "grid\.ts:3  import type \{ Settings \}"
expect "migrate19: Loading without Dialog" 'grid\.ts:6  registerPlugin\(Loading\)'
expect "migrate19: icon pseudo-element" 'grid\.css:1  \.changeType::before'
expect "migrate19: deprecated spliceCol" 'grid\.ts:36  hot\.spliceCol'
expect "migrate19: version bump" 'Bump it to \^19 together with @handsontable/react-wrapper'
expect "migrate19: browser targets" 'below the 19\.0 minimum: chrome >= 110\.'
expect "migrate19: review height auto" "grid\.ts:12  height: 'auto'"
expect "migrate19: review beforeInit in settings" 'grid\.ts:24  beforeInit\(\)'
expect "migrate19: review dropdown strict false" "grid\.ts:19  type: 'dropdown'"
expect "migrate19: Angular NON_COMMERCIAL_LICENSE" 'grid\.ts:37  import \{ NON_COMMERCIAL_LICENSE \}'
expect "migrate19: removed DataProviderOptions" 'grid\.ts:38  import type \{ DataProviderOptions \}'
expect "migrate19: deprecated iconsMap" 'grid\.ts:39  import \{ iconsMap \}'
expect "migrate19: deprecated srSP dictionary" 'grid\.ts:45  registerLanguageDictionary\(srSP\)'
expect "migrate19: multi-line Settings import" 'grid\.ts:41  import type \{ Settings as ExportSettings, \}'
expect "migrate19: removed helper.sanitize" 'grid\.ts:46  Handsontable\.helper\.sanitize'
expect "migrate19: review getCopyableData" 'grid\.ts:47  hot\.getCopyableData'
expect "migrate19: deprecated Formulas shortcuts" 'grid\.ts:48  .*registerShortcuts\(\)'
expect "migrate19: deprecated MergedCellsCollection method" 'grid\.ts:49  .*getTopMostRowIndex\(\)'
expect "migrate19: other sr-SP to review" "grid\.ts:50  const dateFormat = new Intl\.DateTimeFormat\('sr-SP'\)"
expect "migrate19: review custom editor" 'grid\.ts:51  class StatusEditor extends'
expect "migrate19: wrapper major mismatch" '@handsontable/vue3 is "\^19\.0\.0" but handsontable is "\^18\.1\.0"'
expect "migrate19: beforeInit note" 'it can stop the grid from building'
expect "migrate19: HTML limit note" '1 HTML file\(s\) were scanned only for the checks'
expect "migrate19: counts" '2 automatic fix\(es\) available · 21 manual item\(s\) · 9 to review'
if grep -qE "unrelated\.ts|index\.html|my-card|addHook\('beforeInit'" <<<"$LAST"; then echo "FAIL  migrate19: reported a line it should skip"; FAIL=1; else echo "ok    migrate19: unrelated lines skipped"; fi
grep -q "columnHeaders: true, filename" "$WORK/project19/src/grid.ts" || { echo "FAIL  migrate19: dry run changed a file"; FAIL=1; }
check "migrate19: unknown flag is a usage error" 2 node "$SCRIPTS/migrate-v19.mjs" --project "$WORK/project19" --base
check "migrate19: --write on 18.x" 1 node "$SCRIPTS/migrate-v19.mjs" --project "$WORK/project19" --write
grep -q "{ colHeaders: true, filename" "$WORK/project19/src/grid.ts" && echo "ok    migrate19: export option renamed" || { echo "FAIL  migrate19: export option not renamed"; FAIL=1; }
grep -q "^  columnHeaders: true," "$WORK/project19/src/grid.ts" && echo "ok    migrate19: columnHeaders outside an export call kept" || { echo "FAIL  migrate19: columnHeaders outside an export call rewritten"; FAIL=1; }
grep -q "{ colHeaders: true }" "$WORK/project19/src/export-helper.js" && echo "ok    migrate19: exportFile helper renamed" || { echo "FAIL  migrate19: exportFile helper not renamed"; FAIL=1; }
grep -q "{ columnHeaders: true }" "$WORK/project19/src/unrelated.ts" && echo "ok    migrate19: export call in a non-Handsontable file kept" || { echo "FAIL  migrate19: export call in a non-Handsontable file rewritten"; FAIL=1; }
grep -q "language: 'sr-SP'" "$WORK/project19/src/grid.ts" && echo "ok    migrate19: sr-SP kept on 18.x" || { echo "FAIL  migrate19: sr-SP rewritten on 18.x"; FAIL=1; }
grep -q "non-commercial" "$WORK/project19/build/out.js" && echo "ok    migrate19: build dir untouched" || { echo "FAIL  migrate19: build dir rewritten"; FAIL=1; }
if [ "$HT_MAJOR" -ge 19 ]; then
  check "migrate19: --write on 19.x" 1 node "$SCRIPTS/migrate-v19.mjs" --project "$WORK/project19" --ht-dir "$HT_DIR" --write
  grep -q "language: 'sr-Latn-RS'" "$WORK/project19/src/grid.ts" && grep -q "languages/sr-Latn-RS.js" "$WORK/project19/src/grid.ts" \
    && echo "ok    migrate19: sr-SP rewritten on 19.x" || { echo "FAIL  migrate19: sr-SP not rewritten on 19.x"; FAIL=1; }
  grep -q "registerLanguageDictionary, srLatnRS }" "$WORK/project19/src/grid.ts" && grep -q "registerLanguageDictionary(srLatnRS)" "$WORK/project19/src/grid.ts" \
    && echo "ok    migrate19: srSP renamed with its import" || { echo "FAIL  migrate19: srSP not renamed with its import"; FAIL=1; }
  grep -q "DateTimeFormat('sr-SP')" "$WORK/project19/src/grid.ts" && echo "ok    migrate19: other sr-SP kept on 19.x" || { echo "FAIL  migrate19: other sr-SP rewritten on 19.x"; FAIL=1; }
  expect "migrate19: other sr-SP still reported" "grid\.ts:50  const dateFormat = new Intl\.DateTimeFormat\('sr-SP'\)"
  [ -f "$HT_DIR/languages/sr-Latn-RS.js" ] && echo "ok    migrate19: sr-Latn-RS ships in the package" || { echo "FAIL  migrate19: no languages/sr-Latn-RS.js in the package"; FAIL=1; }
  check "migrate19: second --write is a no-op" 1 node "$SCRIPTS/migrate-v19.mjs" --project "$WORK/project19" --ht-dir "$HT_DIR" --write
  expect "migrate19: nothing left to auto-fix" '0 automatic fix'
fi

if [ "$FAIL" = 0 ]; then echo; echo "All skill script checks passed."; else echo; echo "Some checks failed."; exit 1; fi
