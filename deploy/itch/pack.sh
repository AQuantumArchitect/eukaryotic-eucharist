#!/usr/bin/env bash
set -euo pipefail

WORKSPACE="$(cd "$(dirname "$0")/../.." && pwd)"
LATEST=$(ls -d "$WORKSPACE"/eukaryotic_eucharist_mobile_v* 2>/dev/null | sort -V | tail -1)
VERSION=$(basename "$LATEST")
OUT_DIR="$(cd "$(dirname "$0")" && pwd)"
ZIP="$OUT_DIR/mecha_fish.zip"

echo "Packaging $VERSION as Mecha Fish! for itch.io..."
rm -f "$ZIP"

python3 - <<PYEOF
import zipfile, pathlib
src = pathlib.Path("$LATEST")
out = pathlib.Path("$ZIP")
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as zf:
    zf.write(src / 'index.html', 'index.html')
    for f in (src / 'src').rglob('*'):
        if f.is_file():
            zf.write(f, f.relative_to(src))
print(f"Created: {out}  ({out.stat().st_size // 1024} KB)")
PYEOF

echo ""
echo "=== itch.io upload instructions ==="
echo "1. itch.io → Dashboard → Create new project → Kind: HTML"
echo "2. Upload $ZIP (the HTML upload slot)"
echo "3. Viewport: width=960, height=640 | Check 'Mobile Friendly'"
echo "4. Save → View page → test in iframe before publishing"
