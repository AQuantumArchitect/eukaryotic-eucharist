# Eukaryotic Eucharist — Mobile v1.2.2

This branch continues the oxygen/ecology line and cleans up the organelle economy and Yuki shop structure.

## Run

```bash
npm start
```

Open `http://localhost:8787`.

Use `npm stop` to clear the local server from port 8787.

## Controls

- WASD / joystick: swim, only when ATP is available
- F / right mouse: feed from fields
- E / Yuki button: toggle Yuki chamber
- Q: Lipid Repair Loom, if grafted
- R: Rasping Lamella, if grafted
- Shift: Dash, if grafted
- Click / X: Toxic Launcher, if grafted
- V: toxin cloud, if grafted
- K: self-lysis
- P: reset to mature ecosystem initial conditions

## v1.2.2 changes

- Starter bodies explicitly carry one Fermentation Matrix.
- Fermentation output was softened, but remains a real biomass-to-ATP flow when biomass is available.
- Energy is labeled as ATP in the HUD/projections.
- Tier 2 Yuki offerings are reorganized into:
  - Tier 2A — General survival organs
  - Tier 2B — Algal oxygen path
  - Tier 2C — Predatory organs
- Tier 2 organ cards are color-themed by functional family.
- Tier 1 exchange cards remain color-matched to the output resource.
- Oxygen Vacuole is now the buoyancy organ: internal oxygen creates lift only when this organ exists.
- Separate Buoyancy Vacuole purchase was removed from the player-facing shop.
- Toxic Launcher damage was reduced and now has cooldown so a click produces a glob, not a stream.
- Lance damage and speed scaling were reduced.
- Algae now have larger biomass caps and continue maturing into fall pressure instead of flattening out at tiny caps.
- The mature ecology keeps replenishing algae/predator pressure longer.
- Player body radius now grows with organelles and resource fullness, especially storage fullness.

## Validation

```bash
npm run smoke
```

Expected:

```text
MOBILE_V1_2_2_TROPHIC_PRESSURE_SHOP_GROUPS_SMOKE_OK
```
