#!/usr/bin/env bash
# Unified deploy pipeline: packs itch.io zip, pushes to GitHub Pages, syncs Electron.
# Run from the workspace root or from deploy/.
# Usage: bash deploy/all.sh [--skip-electron] [--skip-web] [--skip-itch]
set -euo pipefail

WORKSPACE="$(cd "$(dirname "$0")/.." && pwd)"
DEPLOY="$(cd "$(dirname "$0")" && pwd)"
LATEST=$(ls -d "$WORKSPACE"/eukaryotic_eucharist_mobile_v* 2>/dev/null | sort -V | tail -1)
VERSION=$(basename "$LATEST")

SKIP_ITCH=0; SKIP_WEB=0; SKIP_ELECTRON=0
for arg in "$@"; do
  case "$arg" in
    --skip-itch)     SKIP_ITCH=1 ;;
    --skip-web)      SKIP_WEB=1 ;;
    --skip-electron) SKIP_ELECTRON=1 ;;
  esac
done

echo "========================================"
echo " Eukaryotic Eucharist — Deploy pipeline"
echo " Source: $VERSION"
echo "========================================"
echo ""

# ── itch.io ───────────────────────────────────────────────────────────────────
if [ "$SKIP_ITCH" -eq 0 ]; then
  echo "[ 1/3 ] itch.io"
  bash "$DEPLOY/itch/pack.sh"
  echo ""
else
  echo "[ 1/3 ] itch.io  (skipped)"
fi

# ── GitHub Pages ──────────────────────────────────────────────────────────────
if [ "$SKIP_WEB" -eq 0 ]; then
  echo "[ 2/3 ] GitHub Pages"
  bash "$DEPLOY/web/push.sh"
  echo ""
else
  echo "[ 2/3 ] GitHub Pages  (skipped)"
fi

# ── Electron ──────────────────────────────────────────────────────────────────
if [ "$SKIP_ELECTRON" -eq 0 ]; then
  echo "[ 3/3 ] Electron"
  bash "$DEPLOY/electron/pack.sh"
  echo ""
else
  echo "[ 3/3 ] Electron  (skipped)"
fi

# ── Consistency check ─────────────────────────────────────────────────────────
echo "[ verify ] Running consistency check..."
bash "$DEPLOY/check.sh"
echo ""
echo "========================================"
echo " Done. Platforms deployed:"
[ "$SKIP_ITCH" -eq 0 ]     && echo "  itch.io  → upload deploy/itch/eukaryotic_eucharist.zip"
[ "$SKIP_WEB" -eq 0 ]      && echo "  web      → https://aquantumarchitect.github.io/eukaryotic-eucharist/"
[ "$SKIP_ELECTRON" -eq 0 ] && echo "  electron → cd deploy/electron && npm start"
echo "========================================"
