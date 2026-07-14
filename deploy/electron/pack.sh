#!/usr/bin/env bash
set -euo pipefail

WORKSPACE="$(cd "$(dirname "$0")/../.." && pwd)"
LATEST=$(ls -d "$WORKSPACE"/eukaryotic_eucharist_mobile_v* 2>/dev/null | sort -V | tail -1)
VERSION=$(basename "$LATEST")
EDIR="$(cd "$(dirname "$0")" && pwd)"

echo "Syncing $VERSION → deploy/electron/game/ ..."
mkdir -p "$EDIR/game/src"
cp "$LATEST/index.html"           "$EDIR/game/index.html"
cp "$LATEST/src/graph_kernel.mjs" "$EDIR/game/src/graph_kernel.mjs"
echo "Game files synced."

if [ ! -d "$EDIR/node_modules" ]; then
  echo "Installing deps (electron + electron-builder, ~200MB)..."
  cd "$EDIR" && npm install
  echo "Dependencies installed."
fi

echo ""
echo "Test:  cd deploy/electron && npm start"
echo "Build: cd deploy/electron && npm run dist"
echo "Out:   deploy/electron/dist/"
