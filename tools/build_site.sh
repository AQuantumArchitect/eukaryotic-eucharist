#!/usr/bin/env bash
# Assembles the static GitHub Pages site into _site/ (or $1):
#   /               landing page (site/index.html)
#   /mecha-fish/    latest build (v1.3.3)
#   /classic/       v1.3.2, the last build before the Mecha Fish column expansion
#   /immune/        immune incursion prototype
#   /versions/vX/   every older snapshot, playable as shipped
# Pure file copies — no bundler, the games are plain ES modules.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="${1:-$ROOT/_site}"
LATEST="eukaryotic_eucharist_mobile_v1_3_3"
CLASSIC="eukaryotic_eucharist_mobile_v1_3_2"

copy_build() {  # copy_build SRC_DIR DEST_DIR — a build is index.html + src/
  mkdir -p "$2"
  cp "$1/index.html" "$2/"
  [[ -d "$1/src" ]] && cp -r "$1/src" "$2/src"
  return 0
}

rm -rf "$OUT"
mkdir -p "$OUT/versions"
cp "$ROOT/site/index.html" "$OUT/index.html"
cp -r "$ROOT/docs/screenshots" "$OUT/screenshots"
touch "$OUT/.nojekyll"  # serve .mjs as-is

copy_build "$ROOT/$LATEST" "$OUT/mecha-fish"
copy_build "$ROOT/$CLASSIC" "$OUT/classic"
copy_build "$ROOT/immune_incursion" "$OUT/immune"
for dir in "$ROOT"/eukaryotic_eucharist_mobile_v*/; do
  name="$(basename "$dir")"
  copy_build "$dir" "$OUT/versions/${name#eukaryotic_eucharist_mobile_}"
done

echo "Built $(find "$OUT" -name index.html | wc -l) pages into $OUT ($(du -sh "$OUT" | cut -f1))"
