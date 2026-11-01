# Design Constitution v1.2.2 — Trophic Pressure and Organ Shop Grouping

## Core law

The frontend renders and sends commands. The graph kernel owns resources, organelles, action availability, metabolism, ecology, combat, Yuki offerings, and progression.

## Energy language

The player-facing energy token is ATP. The internal resource key may remain `energy` for compatibility, but HUD and cost text should call it ATP.

## Starter body law

Starter bacteria are anaerobic scavengers. They have:

- membrane feeding
- one Fermentation Matrix
- finite ATP
- no default attack
- no self-repair until Tier 2

Fermentation is not a bonus upgrade. Each Fermentation Matrix is one organelle-flow that converts biomass into ATP and toxin waste. More matrices add more flow. Full biomass tanks ferment faster than nearly empty ones.

## Yuki offering law

Tier 1 exchanges are tank-restock/service transactions. They should be visually color-matched to the output resource.

Tier 2 is divided into functional families:

1. **General survival organs** — storage, feeding, repair, movement, fermentation.
2. **Algal oxygen path** — photosynthesis, oxygen tolerance, oxygen buoyancy/storage.
3. **Predatory organs** — rasping membrane, lance, toxic launcher, toxin cloud.

Tier 2 has no DNA costs.

## Oxygen buoyancy law

Free dissolved oxygen is not automatically lift. Oxygen becomes buoyancy only when the cell has an Oxygen Vacuole. This keeps oxygen management as an organelle commitment.

## Body size law

Bodies should visually express internal machinery. Organelle count establishes the structural floor. Cargo fullness inflates the body toward a higher ceiling. Storage organelles make this inflation more visible.

## Algal fall law

Algae are not static pellets. They are photosynthetic bodies with enough biomass capacity to mature, grow heavy, fail lift, sink, and feed the rupture layer. The ecosystem should start mature and keep replenishing pressure rather than calming into emptiness.

## Combat law

Bodies do not attack by default. Organs attack.

- Rasping Lamella damages by overlap while active.
- Lance Bristle damages by alignment and speed, but should not be a one-touch delete tool.
- Toxic Launcher fires a glob-like damaging projectile/hazard, not an edible toxin field and not a continuous stream.
