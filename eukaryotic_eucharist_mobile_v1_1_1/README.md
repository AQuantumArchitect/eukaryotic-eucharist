# Eukaryotic Eucharist Mobile v1.1.1 — ATP / No Starter Acid / Mature Ecosystem

This is a correction branch on top of v1.1.

## Corrections

- The energy token is now consistently called **ATP** in UI, docs, and descriptions.
- The starter **Primitive Acid Pore** has been removed.
- The player starts as an anaerobic scavenger with membrane feeding and passive ATP fermentation, but no attack action.
- Acid returns only after buying the late Tier 2 **Toxin Sac**.
- The initial world is now seeded as a mature ecosystem instead of starting from small/empty conditions.

## Mature ecosystem seeding

The game now begins in medias res:

- many surface algae already exist,
- several mature algae are already falling,
- predator and protozoan layers are already populated,
- rupture/corpse fields already exist near the nursery/rupture boundary,
- scavenger bacteria are already competing around those fields,
- exotic particles are already present below.

The intent is that the player spawns into an existing trophic pump, not a blank aquarium waiting for the simulation to spin up.

## Current core loop

1. Spawn as an anaerobic scavenger near the rupture boundary.
2. Feed from existing biomass/lipid fields.
3. Avoid oxygen, predators, and deep rupture chaos.
4. Return to Yuki for Tier 1 exchange and Tier 2 organelles.
5. Buy fermentation/storage/movement/repair/predation organs.
6. Acid chemistry is late Tier 2 through Toxin Sac, not a starter weapon.
7. Mitochondrial Eucharist and DNA remain later progression.

## Run

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
MOBILE_V1_1_1_ATP_MATURE_ECOSYSTEM_NO_STARTER_ACID_SMOKE_OK
```
