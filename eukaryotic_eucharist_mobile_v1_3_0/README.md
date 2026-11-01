# Eukaryotic Eucharist — Mobile v1.3.0

Graph-purity consolidation branch.

This build keeps the oxygen/depth ecology and trophic pump from the v1.x line, but aggressively removes hidden special cases. Every player/NPC function is now represented by a countable graph organelle.

## Run

```bash
npm start
```

Open:

```text
http://localhost:8787
```

Stop the server:

```bash
npm stop
```

## Controls

Desktop:

- WASD / arrows: swim if the body has motility
- F or right mouse: feed if the body has intake organs
- R: repair if Lipid Repair Loom is present
- Space: dash if Dash Vacuole is present
- Shift / hold: rasp if Rasping Lamella is present
- Click / touch action: Toxic Launcher if present
- E: open/close Yuki
- K: self-lysis
- P: reset world to mature initial conditions

Mobile:

- Left thumb: swim
- Action buttons appear from kernel action projection
- Yuki opens as a touch-friendly sheet near the canopy

## v1.3.0 changes

- Renamed and separated starter physiology:
  - Cell Membrane = container/permeability/hardness
  - Basal Motility Motor = movement
  - Membrane Intake Pore = feeding
  - Anaerobic Processor = biomass → ATP + toxin waste
- Removed hidden default functions. Starter behavior comes from organs.
- Base exotic storage is now one each for spores, enzymes, and crystals.
- DNA capacity is zero before mitochondrial Eucharist.
- Exotic Vesicle Rack expands exotic storage.
- Oxygen Buoyancy Vacuole is now the single oxygen-storage/buoyancy organ.
- Removed the separate buoyancy organ/resource path.
- Added Membrane Hardening Layer for toughness and lower oxygen permeability.
- One Flagellum purchase now means one flagellum.
- One Lance Bristle purchase now means one lance.
- Movement and vertical drift now respond more strongly to biomass mass, organ bulk, and oxygen buoyancy.
- Feeding only appears if the body has Membrane Intake Pore or Cytostome.
- Kernel projections remain the source of truth for actions, offerings, and HUD.

## Test

```bash
npm run smoke
```

Expected:

```text
MOBILE_V1_3_0_GRAPH_PURITY_SMOKE_OK
```
