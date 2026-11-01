# Eukaryotic Eucharist Mobile v1.0

**v1.0 Oxygen Eucharist** is a mobile-first, kernel-owned branch of the game.

This version implements the oxygen ecology design pass:

- Expanded vertical world.
- Environmental oxygen and light fields.
- Internal oxygen diffusion/stat.
- Oxygen tick damage when internal O2 exceeds tolerance.
- Starter bacteria are anaerobic scavengers: no default attack, no default self-repair.
- Biomass/lipids/toxins remain field-based matter, not coin pickups.
- Algae are soft bodies that grow in light, become heavy, sink, and feed the rupture layer.
- Predators rupture sinking algae and create contested corpse fields.
- Tier 2 has no DNA costs.
- Lipid Repair Loom is Tier 2.
- Mitochondria are not bought as a normal organelle: they are gained through Yuki's Eucharist gate.
- Tier 3 DNA economy unlocks after mitochondrial integration.
- Graph kernel owns progression, actions, environment, resources, and offerings.

## Run

Because the playable file imports the kernel as an ES module, use a local server:

```bash
npm start
```

Then open:

```text
http://localhost:8787
```

## Test

```bash
npm run smoke
```

Expected:

```text
MOBILE_V1_0_OXYGEN_EUCHARIST_SMOKE_OK
```

## Controls

Desktop:

- `WASD` / arrows: swim
- `F`: feed from resource fields
- `Q`: lipid repair, after grafting Lipid Repair Loom
- `R`: rasp, after grafting Rasping Lamella
- `X` / mouse down: acid pulse, after grafting Toxin Sac
- `V`: toxin cloud, after grafting Toxin Cloud Gland
- `Shift`: dash, after grafting Dash Vacuole
- `E`: commune with Yuki when near the canopy

Mobile:

- Left thumb joystick: swim
- Right-side buttons: generated from kernel action projection
- Yuki button: opens bottom-sheet graft chamber when near Yuki

## Design notes

The intended early loop is no longer killing enemies for drops. The starter is a mortal anaerobic scavenger. It waits for photosynthetic bodies to fail, sink, rupture, and become fields. The player feeds from the edges, avoids oxygen and predators, gathers exotics, and returns to Yuki.

The first mitochondrial event is a sacred threshold, not a commodity purchase. After integration, oxygen and lipids become high energy, and the deep DNA game begins.
