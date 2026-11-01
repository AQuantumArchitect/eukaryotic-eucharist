# Mecha Fish! — Mobile v1.3.3

Original twelve-track soundtrack composed and contributed by **Paul Spooner**.

Player-facing name of the swimming-column playable (light, oxygen, flow).
Split from Eukaryotic Eucharist: this is the packed winner. The bacteria
identity lives in `../immune_incursion/`.

Graph-strict mobile branch with predator-flow and Eucharist-balance corrections.

## Run

```bash
npm start
```

Open:

```text
http://localhost:8787
```

Stop the local server with:

```bash
npm stop
```

## Controls

- WASD / arrows: swim
- F or right mouse: feed
- E: open/close Yuki
- R: repair if Lipid Repair Loom exists
- Space: dash if Dash Vacuole exists
- Q: rasp if Rasping Lamella exists
- Click / touch attack: Toxic Launcher if grafted
- V: toxin cloud if grafted
- K: self-lysis
- P: reset world to mature initial conditions

## v1.3.3 changes

- Slowed baseline feeding again.
- Reduced Cytostome Bloom intake/radius so multiple ingestion organs matter.
- Increased pre-mitochondrial movement cost to reinforce move/feed/recharge pacing.
- Rasping ATP cost is now paid once per body per tick, not once per overlapping target.
- Rasping cost scales with body size, making it a small-body predator solution.
- Lance Bristle damage is now strongly speed gated: slow contact barely hurts, dash impacts hit hard.
- Predator bodies spawn with more Anaerobic Processors/storage so the rupture layer stays active.
- Mitochondrial Eucharist now asks for one DNA record instead of oxygen tolerance.
- DNA can be carried before mitochondria if the player buys DNA Memory Vesicle.

## Kernel law

The frontend renders. `src/graph_kernel.mjs` owns progression, actions, costs, resources, oxygen, fields, bodies, organelles, death bloom, and Yuki offerings.
