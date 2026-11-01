# Eukaryotic Eucharist — Mobile v1.3.1

Strict graph-stats correction branch. This version keeps the v1.3 organism model but removes the remaining hidden capacity/HP allowances.

## Run

```bash
npm start
```

Open:

```text
http://localhost:8787
```

Stop the local server:

```bash
npm stop
```

## What changed in v1.3.1

- Starter normal storage is now explicitly supported by **Storage Vacuole**.
- Starter exotic storage is explicitly supported by **Exotic Vesicle Rack**.
- Starter DNA storage is explicitly supported by **DNA Memory Vesicle**.
- DNA capacity starts at one because the starter owns one DNA Memory Vesicle.
- Removing storage organs removes the corresponding capacity in the kernel.
- HP capacity now comes from **Cell Membrane** count, not an invisible max-HP field.
- **Cell Membrane** can now be bought as a real container/HP organ.
- Oxygen capacity/tolerance/porosity/hardness are graph-derived from membrane and oxygen organs.
- Baseline idle metabolism was fixed: one Anaerobic Processor with full biomass is ATP-positive at rest.
- First upgrades were repriced against the stricter starter tank sizes.
- HUD now exposes graph-derived caps for debugging.

## Core rule

No stat without an organelle. No player exception.

## Smoke test

```bash
npm run smoke
```

Expected output:

```text
MOBILE_V1_3_1_STRICT_GRAPH_STATS_SMOKE_OK
```
