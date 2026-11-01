# Eukaryotic Eucharist Mobile v1.0.1 — Oxygen Eucharist Polish

This is a polish/fix branch on top of v1.0. It keeps the oxygen ecology, algae-fall pump, resource fields, and kernel-owned progression model, while fixing the first playtest issues in the Yuki interaction layer and algae oxygen balance.

## What changed from v1.0

- `E` now toggles the Yuki chamber open and closed.
- The mobile Yuki button also toggles the chamber closed when already open.
- Purchasing was made more legible and touch-reliable: ready cards now have a ready state, pointer activation, and clearer feedback text.
- Tier 1 exchange offerings now look different from organelle graft cards.
- Exchange cards show a compact tank-flow display: cost pills flowing into gain/service pills.
- Photosynthetic algae are now specialized surface organisms: they vent photosynthetic oxygen instead of self-poisoning too aggressively.
- Algae still become biomass-heavy and can enter the fall state; the oxygen fix is not meant to remove the algae-fall pump.

## Run

Because the game imports the graph kernel as an ES module, run it from a local server:

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

Expected result:

```text
MOBILE_V1_0_1_POLISH_SMOKE_OK
```

## Current design laws

- Starter bodies can feed but cannot attack by default.
- Matter is field-based; spores/exotics/DNA remain particles.
- Oxygen is environmental exposure plus internal state.
- Surface algae tolerate and vent oxygen better than anaerobic scavengers.
- Tier 2 adaptation has no DNA costs.
- Mitochondrial Eucharist is the threshold into Tier 3.
- Tier 3 is the DNA/information game.
- The frontend renders projections; the graph kernel owns game truth.
