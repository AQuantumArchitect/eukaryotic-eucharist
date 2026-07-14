# Design Constitution v1.3.1 — Strict Graph Stats

Version 1.3.1 is a correction pass after the graph-purity branch. The rule is stricter:

> Nothing exists unless an organelle or environmental field supports it.

## Strict stat law

- HP capacity comes from Cell Membrane count plus graph armor/chassis organs.
- Biomass, lipid, toxin, and ATP capacity come from Storage Vacuole count.
- Spore, enzyme, and crystal capacity come from Exotic Vesicle Rack count.
- DNA capacity comes from DNA Memory Vesicle count.
- Feeding comes from Membrane Intake Pore and Cytostome Bloom.
- ATP generation comes from Anaerobic Processor count or mitochondrial metabolism.
- Movement comes from Basal Motility Motor and Flagellum count.
- Oxygen capacity, tolerance, porosity, hardness, and buoyancy are graph-derived.

There is no base capacity hidden inside the player. Starter capacity exists because the starter body explicitly begins with starter organelles.

## Starter organelles

The starter body has exactly the graph pieces needed to exist as a playable anaerobic scavenger:

- Cell Membrane
- Basal Motility Motor
- Membrane Intake Pore
- Anaerobic Processor
- Storage Vacuole
- Exotic Vesicle Rack
- DNA Memory Vesicle

The starter has no weapon organs, no self-repair organ, and no mitochondrial metabolism.

## Storage law

One Storage Vacuole supports the starter tanks. Removing that organ removes normal storage.
One Exotic Vesicle Rack supports one spore, one enzyme, and one crystal.
One DNA Memory Vesicle supports one DNA record.

## Idle metabolism law

A full-body starter with one Anaerobic Processor is ATP-positive while idle. Activity spends that charge. This preserves the loop:

1. Feed biomass.
2. Sit / drift to charge ATP.
3. Spend ATP to swim, feed, flee, or return to Yuki.

## Frontend law

The frontend renders graph projections. The graph kernel owns capacities, actions, metabolism, oxygen rules, offerings, and death blooms.
