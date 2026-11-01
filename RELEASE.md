# Eukaryotic Eucharist - release facts (source of truth)

| Field | Value |
|---|---|
| Display name | Eukaryotic Eucharist |
| Repo / canonical folder | WSL `~/ws/eukarayotic_eucharist` (NOTE: no git remote configured - not backed up on GitHub) |
| itch page | https://aquantumarchitect.itch.io/eukaryotic-eucharist (HTML) |
| itch channels | `html` |
| Engine | Plain HTML/JS (no engine). Shipped files: `index.html` + `src/` of the version folder. |
| Current version folder | `eukaryotic_eucharist_mobile_v1_3_3` ("Predator Flow Balance", full body graph). When you bump, change `Source` in `tools/release.ps1`. |
| Mecha Fish | Separate page `mecha-fish`, taken down until it has its own art. |
| Play copy | the itch page itself |
| Release command | `git tag vX.Y.Z; .\tools\release.ps1 -Channel html` |
| Last verified build | `1.3.3-predator-flow`: itch download byte-identical to the pushed zip. Not played in a browser this pass. |
