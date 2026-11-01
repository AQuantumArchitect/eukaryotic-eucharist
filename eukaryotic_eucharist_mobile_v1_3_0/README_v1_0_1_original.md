# Eukaryotic Eucharist Mobile v0.9

This is the kernel realignment + feeding field branch.

## Run

```bash
npm start
```

Then open:

```text
http://localhost:8787
```

The game uses an ES module kernel, so serving it through the local server is preferred over double-clicking the file.

## Test

```bash
npm run smoke
```

Expected output:

```text
MOBILE_V0_9_KERNEL_REALIGNMENT_SMOKE_OK
```

## What changed from v0.8

- `src/graph_kernel.mjs` now owns resources, organelles, Yuki offerings, progression tiers, available actions, feeding, contact damage, NPC behavior, and death blooms.
- Frontend renders kernel projections and sends input commands.
- Biomass, lipids, toxins, and energy are sparse resource fields, not discrete pickups.
- Spores, enzymes, crystals, and DNA are discrete particles.
- Starter player can feed but cannot attack.
- Bodies do not attack by default; organs attack.
- Rasping Lamella is the first active overlap attack organ.
- Toxin Sac enables acid; Toxin Cloud Gland enables cloud venting.
- Tier 2 has no DNA costs.
- Mitochondrion is a Tier 2 exotic organelle and unlocks Tier 3.
- DNA is reserved for Tier 3 post-mitochondrial information exchange.
- NPCs feed from the same fields as the player.
- Death creates persistent resource fields.

## Core loop

1. Feed from Yuki substrate and corpse fields.
2. Dive for spores, enzymes, and crystals.
3. Return to Yuki for Tier 1 survival and Tier 2 organelle grafts.
4. Buy mitochondria to convert lipids into real energy.
5. Dive deeper for rupture events that release DNA.
6. Bring DNA to Yuki for Tier 3 Eucharist and multicell machinery.

## Architecture

The game is now split into:

- `src/graph_kernel.mjs`: canonical simulation and rules.
- `index.html`: mobile-first renderer, input layer, Yuki bottom sheet, and HUD.
- `test/smoke.mjs`: conceptual law tests.

The frontend should not grow new game logic. Add new resources, organelles, actions, costs, unlocks, and NPC behavior to the kernel first, then expose them through projections.
