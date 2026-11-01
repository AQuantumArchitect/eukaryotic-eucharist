# Eukaryotic Eucharist - release facts (source of truth)

| Field | Value |
|---|---|
| Display name | Eukaryotic Eucharist |
| Repo / canonical folder | `AQuantumArchitect/eukaryotic-eucharist`, Windows `C:\Users\Luke Spooner\ws-win\eukaryotic-eucharist` |
| Canonical branch / Pages | `main`; GitHub Actions builds `_site/` and deploys Pages |
| itch page | https://aquantumarchitect.itch.io/eukaryotic-eucharist (HTML) |
| itch channels | `html` |
| Engine | Plain HTML/JS (no engine). Shipped files: `index.html` + `src/` of the version folder. |
| HTML reference build | `eukaryotic_eucharist_mobile_v1_3_3` (September 1.3.3, "Predator Flow Balance", full body graph). `tools/release.ps1` is deliberately pinned here; do not auto-select a newer folder. |
| Mecha Fish | Separate page `mecha-fish`, taken down until it has its own art. |
| Play copy | the itch page itself |
| Release command | `git tag vX.Y.Z; .\tools\release.ps1 -Channel html` |
| Last verified build | `1.3.3-predator-flow`: itch download byte-identical to the pushed zip. Not played in a browser this pass. |

The Pages build and the itch reference are intentionally separate. Updating the live site does not
change or upload the itch build. Only a deliberate edit to `Source` in `tools/release.ps1` changes
what `-Channel html` stages.
