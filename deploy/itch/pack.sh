#!/usr/bin/env bash
set -euo pipefail

WORKSPACE="$(cd "$(dirname "$0")/../.." && pwd)"
# Pinned to the v1.3.4 reference build, same as tools/release.ps1 -Channel html (Luke, 2026-11-11).
# Newer version folders are Pages-only until the pin is moved on purpose.
LATEST="$WORKSPACE/eukaryotic_eucharist_mobile_v1_3_4"
# Paul Spooner's soundtrack lives once, in the v1.3.3 folder; it ships as music/ beside index.html.
MUSIC="$WORKSPACE/eukaryotic_eucharist_mobile_v1_3_3/music"
VERSION=$(basename "$LATEST")
OUT_DIR="$(cd "$(dirname "$0")" && pwd)"
ZIP="$OUT_DIR/mecha_fish.zip"
[ -f "$LATEST/index.html" ] || { echo "Pinned build missing: $LATEST" >&2; exit 1; }
[ -d "$MUSIC" ] || { echo "Soundtrack missing: $MUSIC" >&2; exit 1; }

echo "Packaging $VERSION as Mecha Fish! for itch.io..."
rm -f "$ZIP.tmp"

# Git Bash on Windows: hand Windows Python native paths (C:/...), not /c/...
native() { if command -v cygpath >/dev/null 2>&1; then cygpath -m "$1"; else printf '%s' "$1"; fi; }
PY=python3; command -v python3 >/dev/null 2>&1 && python3 -c '' 2>/dev/null || PY=python
"$PY" - <<PYEOF
import zipfile, pathlib
src = pathlib.Path("$(native "$LATEST")")
out = pathlib.Path("$(native "$ZIP").tmp")
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as zf:
    zf.write(src / 'index.html', 'index.html')
    for f in (src / 'src').rglob('*'):
        if f.is_file():
            zf.write(f, f.relative_to(src))
    for f in sorted(pathlib.Path("$(native "$MUSIC")").glob('*.mp3')):
        zf.write(f, 'music/' + f.name)
final = pathlib.Path("$(native "$ZIP")"); out.replace(final)
print(f"Created: {final}  ({final.stat().st_size // 1024} KB)")
PYEOF

echo ""
echo "=== itch.io upload instructions ==="
echo "1. itch.io → Dashboard → Create new project → Kind: HTML"
echo "2. Upload $ZIP (the HTML upload slot)"
echo "3. Viewport: width=960, height=640 | Check 'Mobile Friendly'"
echo "4. Save → View page → test in iframe before publishing"
