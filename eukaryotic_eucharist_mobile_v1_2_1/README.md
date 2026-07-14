# Eukaryotic Eucharist Mobile v1.2.1

This branch corrects v1.2.0's overlap, fermentation, reset, and startup ergonomics while keeping the oxygen/depth ecology, mature ecosystem spawn, field feeding, Toxic Launcher, and Tier 3 DNA rules.

## Run

```bash
npm start
```

Open `http://localhost:8787`.

Use `npm stop` to clear the local server. The start script also pre-clears port 8787 so Ctrl+Z does not leave a suspended server blocking the next run.

## Smoke test

```bash
npm run smoke
```

Expected:

```text
MOBILE_V1_2_1_OVERLAP_FERMENTATION_SMOKE_OK
```

## v1.2.1 changes

- Removed soft-body collision separation. Cells can now overlap; overlap is the input to rasping, lance contact, and field fights instead of a physical wall.
- Reduced Rasping Lamella damage from the v1.2.0 spike while making it actually work through overlap.
- Fermentation Matrix is now a biomass-dependent organelle flow:
  - starter bodies have one matrix,
  - full biomass tanks produce substantially more ATP,
  - low biomass tanks barely trickle,
  - each additional matrix adds another identical processing flow.
- Reduced passive ATP upkeep so a full biomass tank can net-generate ATP at baseline, while movement/actions still drain ATP.
- Preserved the hard ATP gate: no ATP means no movement/actions.
- Added `K` for self-lysis. The world persists and your corpse blooms.
- Added `P` for full reset to mature initial conditions.
- Strengthened right-click feeding support with document-level context-menu suppression and mouse fallback events.
- Applied the CLI server fix:
  - `npm start` clears port 8787 before serving,
  - `npm stop` kills anything on port 8787.
- Repaired the algal fall pump:
  - sinking algae now get a minimum downward force,
  - final-step descent helps them reach the rupture layer.

## Controls

- `WASD` / joystick: swim, only while ATP is available.
- `F` or right-click: feed fields, only while ATP is available.
- `Q`: Lipid Repair Loom, if grafted.
- `R`: Rasping Lamella, if grafted.
- `X` or left-click: Toxic Launcher, if grafted.
- `V`: Toxin Cloud, if grafted.
- `Shift`: Dash, if grafted.
- `E`: toggle Yuki chamber near the canopy.
- `K`: self-lysis / suicide into a corpse bloom.
- `P`: reset the world to fresh mature initial conditions.

## Design note

The important rule in v1.2.1 is: **soft bodies do not block each other; organs interpret overlap.** This lets the game behave more like cells in slurry rather than billiard balls.
