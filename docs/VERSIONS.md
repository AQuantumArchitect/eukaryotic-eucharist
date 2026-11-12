# Versions — which folder is live where

One folder per version stays. Nothing here is deleted; this table says what each folder is for.
The Pages URLs come from `tools/build_site.mjs`; the itch notes come from `RELEASE.md` and
`deploy/itch/pack.sh`. Base URL: `https://aquantumarchitect.github.io/eukaryotic-eucharist/`.

| Folder | Version | Served on Pages | itch | Status |
|---|---|---|---|---|
| `eukaryotic_eucharist_mobile_v1_3_4` | 1.3.4 | `mecha-fish/` and `versions/v1_3_4/` | Reference build for `tools/release.ps1 -Channel html`; `deploy/itch/pack.sh` zips it with the soundtrack as `mecha_fish.zip` (not pushed) | **Current.** Mecha Fish! First-five-minutes pass + fair starvation. Pin moved here by Luke, 2026-11-11. |
| `eukaryotic_eucharist_mobile_v1_3_3` | 1.3.3 | `versions/v1_3_3/` | no (was the reference build until 2026-11-11) | Previous build; tuning/ecology tooling. Only folder with the `music/` soundtrack, which Pages and the v1.3.4 itch zip both ship. |
| `eukaryotic_eucharist_mobile_v1_3_2` | 1.3.2 | `classic/` and `versions/v1_3_2/` | no | **Classic.** Last build before the column expansion. |
| `eukaryotic_eucharist_mobile_v1_3_1` | 1.3.1 | `versions/v1_3_1/` | no | Archive |
| `eukaryotic_eucharist_mobile_v1_3_0` | 1.3.0 | `versions/v1_3_0/` | no | Archive |
| `eukaryotic_eucharist_mobile_v1_2_2` | 1.2.2 | `versions/v1_2_2/` | no | Archive |
| `eukaryotic_eucharist_mobile_v1_2_1` | 1.2.1 | `versions/v1_2_1/` | no | Archive |
| `eukaryotic_eucharist_mobile_v1_2_0` | 1.2.0 | `versions/v1_2_0/` | no | Archive |
| `eukaryotic_eucharist_mobile_v1_1_1` | 1.1.1 | `versions/v1_1_1/` | no | Archive |
| `eukaryotic_eucharist_mobile_v1_0_1` | 1.0.1 | `versions/v1_0_1/` | no | Archive |
| `eukaryotic_eucharist_mobile_v1_0` | 1.0 | `versions/v1_0/` | no | Archive |
| `immune_incursion` | prototype | `immune/` | `deploy/itch/ee_immune.zip` packed, not pushed | Sibling game (see `SPLIT.md`). |

## Rules of thumb

- Every `eukaryotic_eucharist_mobile_v*` folder is copied to `versions/<tag>/` automatically.
- "Latest" and "classic" are hard-coded in `tools/build_site.mjs` (`latest`, `classic`). Change them
  there when a new build ships, then update this table.
- The Pages build and the itch reference are separate: deploying Pages does not touch itch.
- `deploy/itch/pack.sh` and `tools/release.ps1` are both pinned to v1.3.4 and add the v1.3.3 `music/` folder;
  a new version folder changes nothing until the pin is moved on purpose. The packed zip is ~100 MB with
  the soundtrack, at GitHub's per-file limit, so do not commit a regenerated `deploy/itch/mecha_fish.zip`.
- itch page live state: DARK (not checked in this change). `RELEASE.md` records the last verified upload.
