# Eukaryotic Eucharist — Mobile v1.3.2

A mobile-first/offline HTML prototype of the oxygen-field trophic ecology branch.

## Run

```bash
npm start
```

Open `http://localhost:8787`.

Use `npm stop` to clear the local server. `npm start` also clears port 8787 before launching.

## v1.3.2 changes

- Anaerobic ATP production now uses a flow curve: full biomass tanks process faster but less efficiently; low biomass reserves process slowly but more frugally.
- Idle starter metabolism is tuned to be ATP-positive when biomass is available.
- Movement remains ATP-gated, but ATP fullness now controls speed and cost as a curve instead of a flat penalty.
- Predators now commit to overlapping prey; with collision removed, rasping predators try to stand on top of targets instead of orbiting at the edge.
- Feeding fields are slower, making intake-pore and cytostome upgrades matter.
- Exotic particles and DNA are now deliberate ingestion targets: hold Feed over them to collect.
- Exotic/DNA particles remain on the map if the matching storage is full.
- Starter player no longer begins with DNA Memory Vesicle; DNA storage must be grafted.
- Toxin overload now damages bodies and has a green visual stress overlay compatible with blue oxygen overload.
- Lipid Repair Loom is slower and much more ATP-expensive.
- Ongoing ecology pressure increased: mature/falling algae and predators continue spawning so the initial chaos is better maintained.

## Controls

- WASD / arrows: swim
- F or right mouse: feed / ingest fields and particles
- Q: repair, if Lipid Repair Loom is grafted
- R: rasp, if Rasping Lamella is grafted
- X / click: Toxic Launcher, if grafted
- V: toxin cloud, if grafted
- E: open/close Yuki chamber near canopy
- K: self-lysis
- P: reset world

## Design law

Nothing exists unless the graph says it exists. Capacities, HP, feeding, movement, ATP generation, repair, attacks, particle ingestion, and storage are all organelle-derived.
