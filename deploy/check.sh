#!/usr/bin/env bash
# Verifies all deploy targets contain identical game files to the source version.
# Also checks live MIME type on GitHub Pages.
set -euo pipefail

WORKSPACE="$(cd "$(dirname "$0")/.." && pwd)"
LATEST=$(ls -d "$WORKSPACE"/eukaryotic_eucharist_mobile_v* 2>/dev/null | sort -V | tail -1)
VERSION=$(basename "$LATEST")
DEPLOY="$(cd "$(dirname "$0")" && pwd)"

PASS=0; FAIL=0
ok()  { echo "  [OK]  $1"; PASS=$((PASS+1)); }
fail(){ echo "  [!!]  $1"; FAIL=$((FAIL+1)); }

echo "=== Deploy consistency check ==="
echo "Source: $VERSION"
echo ""

# ── 1. File hashes ────────────────────────────────────────────────────────────
echo "[ File hashes ]"
for RELPATH in "index.html" "src/graph_kernel.mjs"; do
  SRC_HASH=$(md5sum "$LATEST/$RELPATH" | cut -d' ' -f1)

  # GitHub Pages local copy
  if [ -f "$DEPLOY/web/$RELPATH" ]; then
    WEB_HASH=$(md5sum "$DEPLOY/web/$RELPATH" | cut -d' ' -f1)
    if [ "$SRC_HASH" = "$WEB_HASH" ]; then ok "web/$RELPATH matches source"; else fail "web/$RELPATH DIFFERS from source"; fi
  else
    fail "web/$RELPATH missing — run deploy/web/push.sh"
  fi

  # itch.io zip
  if [ -f "$DEPLOY/itch/eukaryotic_eucharist.zip" ]; then
    ZIP_HASH=$(python3 -c "import zipfile,hashlib; print(hashlib.md5(zipfile.ZipFile('$DEPLOY/itch/eukaryotic_eucharist.zip').read('$RELPATH')).hexdigest())")
    if [ "$SRC_HASH" = "$ZIP_HASH" ]; then ok "itch.zip/$RELPATH matches source"; else fail "itch.zip/$RELPATH DIFFERS from source"; fi
  else
    fail "itch/eukaryotic_eucharist.zip missing — run deploy/itch/pack.sh"
  fi

  # Electron game copy
  if [ -f "$DEPLOY/electron/game/$RELPATH" ]; then
    EL_HASH=$(md5sum "$DEPLOY/electron/game/$RELPATH" | cut -d' ' -f1)
    if [ "$SRC_HASH" = "$EL_HASH" ]; then ok "electron/game/$RELPATH matches source"; else fail "electron/game/$RELPATH DIFFERS from source — run deploy/electron/pack.sh"; fi
  else
    echo "  [--]  electron/game/$RELPATH not synced yet (run deploy/electron/pack.sh)"
  fi
done

echo ""

# ── 2. Live MIME type on GitHub Pages ─────────────────────────────────────────
echo "[ GitHub Pages live MIME type ]"
PAGES_URL="https://aquantumarchitect.github.io/eukaryotic-eucharist"
if command -v curl &>/dev/null; then
  CTYPE=$(curl -sI --max-time 8 "$PAGES_URL/src/graph_kernel.mjs" 2>/dev/null | grep -i '^content-type:' | tr -d '\r' | cut -d' ' -f2-)
  if [ -z "$CTYPE" ]; then
    fail "No response from $PAGES_URL (Pages not live yet or network error)"
  elif echo "$CTYPE" | grep -qi "javascript"; then
    ok "graph_kernel.mjs served as: $CTYPE"
  else
    fail "graph_kernel.mjs served as: $CTYPE (expected text/javascript)"
  fi
else
  echo "  [--]  curl not available — skipping live MIME check"
fi

echo ""

# ── 3. Summary ────────────────────────────────────────────────────────────────
echo "=== Result: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
