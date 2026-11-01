# Design Constitution v1.3.0 — Graph Purity and Countable Organelle Units

Version 1.3.0 is a consolidation pass. The rule is simple: if a function exists, it is represented by an organelle or environmental field in the graph. The frontend renders and sends commands; it does not own biological truth.

## Primitive graph objects

The game still has three primitives:

1. **Soft bodies** — player, scavengers, algae, predators, protozoa, companions.
2. **Resource fields** — biomass, lipids, toxins, and ATP-bearing slurry.
3. **Discrete information/exotic particles** — spores, enzymes, crystals, and post-Eucharist DNA.

## No special player rules

The player is a soft body with human input. Movement, feeding, metabolism, repair, weapons, storage, membrane toughness, oxygen handling, and buoyancy all come from organelles. NPCs use the same categories.

## Container is not metabolism

The **Cell Membrane** is the bag/boundary. It controls permeability and structural hardness. It does not secretly generate ATP and does not secretly eat fields.

Separate starter organs now define starter behavior:

- **Basal Motility Motor** — lets the body swim.
- **Membrane Intake Pore** — lets the body feed from overlapping fields.
- **Anaerobic Processor** — converts biomass into ATP and toxin waste.

## Countable organ law

One purchase means one organelle unless the offering explicitly says it is a sacrament or colony event.

- Buy one **Flagellum**, get one flagellum.
- Buy one **Lance Bristle**, get one lance.
- Buy one **Rasping Lamella**, get one active overlap-shred membrane.
- Buy one **Storage Vacuole**, get one storage unit.

Multiple purchases stack as graph counts, not hidden upgrade levels.

## Exotic capacity law

Starter exotic storage is deliberately tiny:

- spores: 1
- enzymes: 1
- crystals: 1
- DNA: 0 before mitochondria

**Exotic Vesicle Rack** increases those capacities. Exotic storage is now a real body graph limitation, not an effectively infinite inventory.

## Oxygen/buoyancy consolidation

There is no separate buoyancy collectible/resource. **Oxygen Buoyancy Vacuole** handles both oxygen storage and oxygen-derived lift. Internal oxygen only helps the body float if this organ exists.

## Membrane hardening and permeability

**Membrane Hardening Layer** raises membrane hardness and lowers oxygen permeability. It protects bodies, helps algae become tougher, and slows some flow/movement. This makes surface organisms, armored predators, and oxygen tolerance feel graph-derived instead of class-derived.

## Mass and motion

Biomass is not just currency. Biomass is weight. More biomass makes a body sink and increases movement burden. Oxygen buoyancy can offset this if oxygen vacuoles exist. Storage organs and hardening layers add body bulk.

## Frontend boundary

The frontend may draw cells, fields, organelles, and shop cards. The kernel owns:

- capacities
- action availability
- costs
- organelle counts
- metabolism
- oxygen diffusion
- feeding flow
- mass/buoyancy
- damage and contact rules
- Yuki offerings
- death blooms

