# Simulated-player experience tuning

A headless loop for shaping the single-cell storyline's *experience curve* — the intended arc is:

> **gentle opening → ascending sawtooth of tension → CLIMAX right after mitochondria → falling action = farming the monstrous deep (end game).**

Two new tools drive it, plus an escalation mechanic in the kernel. Nothing here is deployed; it's all
local evaluation tooling. Everything is deterministic (seeded `world.rng` + a seeded policy PRNG).

## The pieces

### `sim_player.mjs` — the policy-graph "player"
A stand-in for a human. It reads the same projections the UI reads and emits the same `step()` command
object the keyboard/touch controls emit, so it exercises the **real** game loop with no special access.
It's a finite policy graph over a build-order:

- **nodes:** `forage` / `recharge` (ferment an ATP reserve on a field) / `gather` (dive for exotics + DNA)
  / `hunt` / `dive` (push the depth gate / farm the deep) / `ascend` / `shop` / `survive` (incubation) / `flee`.
- **Yuki shopping is modeled as a PAUSE** — like the real UI, which freezes the sim while the shop is
  open — via `player.maybeShop(world)`. On a frame it shops, it returns `true` and the driver must NOT
  step the sim (so a fragile early cell isn't O2-bled while "deciding").

Driver contract (one frame):
```js
if (!player.maybeShop(world)) { const cmd = player.update(world, dt); K.step(world, cmd, dt); }
```
`player.milestones` / `player.log` hold the timeline; `player._buys/_kills/_deepKills` etc. are counters.

### `sim_experience.mjs` — the experience evaluator
Runs the policy across seeds, records a per-second time-series (progression / tension / depth), and
scores the dramatic arc 0–100. Prints per-seed sparklines, a "furthest phase reached" histogram
(where the arc stalls), and a machine-readable `RESULT {...}` last line a loop can grep.

```
node sim_experience.mjs [minutes] [seed1 seed2 ...]
node sim_experience.mjs 15 1234 77 2025 909 3131     # ~5 min; the standard iteration eval
```
Score = progression×45 + climax(mito)15 + ascending-tension + sawtooth-relief + falling-action +
gentle-opening − death-churn. The whole point: **tune by measurement, not by feel.**

### Escalation mechanic (in `src/graph_kernel.mjs`)
`world.escalation` is a **monotonic ratchet** (`escalationLevel(world)`): it rises with the player's
own progress — every new max depth, the mitochondrial Eucharist (a big jump), and each sequenced
genome — and never falls back. It scales the deep-predator **floor** (`spawnTick` `dynFloor`) and the
**strength** of each newly spawned deep body (`applyEscalation`), and tilts the mix toward the
monstrous castes (metazoan colonies, swarm-directors) at higher tiers. This is the engine of the
rising action into the deep and the "farm ever-worse monsters" end game. Exposed at
`getDebugProjection().escalation` and `K.__test.escalationLevel / applyEscalation`.

## Balance changes made this pass (all measured; smoke stays 4-green; NOT deployed)
1. **Opening was a death-loop** (the arc's foot should be gentle; it was the lethal wall). Fixed the
   player-only early move economy so the return-to-Yuki climb is affordable: `preMitoBurden 1.42→1.25`,
   move-cost base `0.38→0.30` (~23% cheaper; no NPC/determinism impact).
2. **Nursery was a food desert** — the tuned algal ecology funnels ~all dead matter to the deep floor,
   so a biteless scavenger had nowhere safe to feed. Added a renewable `nursery_slurry` supply
   (`spawnTick`): ≤6 modest fields in the O2-safe, safely-edible band (depth 800–1180).
3. **Exotics were deep-gated** — crystal/enzyme/spore (the keystone of the whole mid-game: bite,
   storage, processors, sacrament) only spawned at depth 1720+, a suicidal dive. Moved the shallowest
   up into the reachable upper rupture (~depth 1280+) at a faster cadence.
4. **Faster fermentation** — `anaerobic_processor.rate 0.42→0.60` so the recharge/Yuki loop (the
   pace-limiter of progression) is quicker.

## Headline finding (needs a design decision)
Even an optimal policy line can't reach the climax in a reasonable session. Root cause is **structural,
not a single stat**: `removeDead` resets the player to the *starter kit* on death (discoveries persist,
organs don't), so mitochondria must be assembled in ONE life — but the progression is a ~20–30 min
gated chain (3 pure-matter organs → exotic dive → bite → DNA hunt → sequence → the 5-part mito gate →
depth 2650), far longer than the ~5–8 min a fragile cell survives between deaths. The opening fixes
above cut deaths from 8–10 to ~2 per run, but the arc is still a **flat opening grind**, not an ascent
to a climax.

**To make the intended arc real, pick a direction (these are design calls, not autonomous tweaks):**
- **Soften death** — keep a fraction of the build / a checkpoint tier, so a death is a setback not a wipe.
- **Shorten the road to mito** — fewer/cheaper gated steps, or a smaller mito gate.
- **Speed progression ~2–4×** — cheaper organs, bigger early storage, richer nursery, faster economy.
- Any mix. Then this evaluator will show the arc actually ascending to the climax and into the deep-farm
  falling action, and escalation will supply the ever-worse monsters for that end game.

## Handy scratch harnesses (in the session scratchpad)
`playtest.mjs` (full-run milestone timeline), `trace2/trace3.mjs` (per-second economy/HP/O2 traces),
`deathcause.mjs` (death-cause classifier), `climbprobe.mjs` (Yuki-climb ATP cost + regen).
