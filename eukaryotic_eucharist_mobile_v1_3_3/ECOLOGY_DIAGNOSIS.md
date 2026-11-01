# No-player world diagnosis — v1.3.3 (`light_oxygen_cloud` WIP)

Measured with the player-free rigging (`createEcologyWorld`/`stepEcology`). Method: 10 min × 5 seeds
at dt=0.05 (`sim_eval.mjs`), cross-checked with `dynamics_lab.mjs`, `ecology_experiments.mjs`, and
targeted death-cause probes. All runs deterministic + NaN-clean. **No balance edits were applied** —
this is diagnosis + recommendations only. Run it yourself with `npm run ecology` (or
`node ecology_report.mjs 10 5`).

> Scope note: the economy rework (lipid currency, repair/detox exchanges) is someone else's work and
> is deliberately untouched — the full `smoke_test.mjs` stays red on those economy assertions. The
> no-player ecology path (`stepEcology` + spawn/brains/metabolism/fields/fission) is verified sound
> in isolation.

## Verdict

**The world with no player is a slow starvation collapse held up by immigration floors — not a
breathing petri dish.** It is seeded 3–5× above what it can sustain, decays monotonically for ~5
minutes, and settles into a sparse steady state where the deep hunter guild survives only because
`POP_FLOOR` immigrates replacements faster than they starve.

## The five findings

### 1. Initial conditions are a *peak*, not a *midpoint* (fidelity 35% = "poor")
Everything except algae count decays monotonically from t=0 and settles by ~t=300s:

| metric | t=0 | steady (t≥300) | note |
|---|---|---|---|
| scavenger pop | 26 | ~9 | seeded ~2.6× carrying capacity |
| predator pop | 5 | **3** | = `POP_FLOOR.predator` |
| protozoan pop | 11 | **2** | = `POP_FLOOR.protozoan` |
| metazoan pop | 3 | **1** | = `POP_FLOOR.metazoan` |
| algae biomass/bloom | 15 | 7 | producers thin by half |
| field matter | 3458 | ~670 | food economy collapses ~5× |
| field count | 73 | ~18 | |

The seed comment (`graph_kernel.mjs:1341`) claims fields are seeded "at steady density (~5000
matter)", but the measured steady field matter is ~670. The initial condition was provisioned for a
world that never materializes. `scavengerTarget = clamp(8 + detritus/220 − …)` (L4013) resolves to
~14 at the real steady detritus and ~9 after hunter pressure — so seeding 26 scavengers guarantees a
~2.6× die-back in the first 4 minutes.

### 2. The deep hunter guild is on life support, not self-sustaining
predator/protozoan/metazoan pin to **exactly** `POP_FLOOR {3,2,1}` and stay there. The only inflow is
immigration (predator +60, protozoan +8, metazoan +3 across 10min×5seeds). **Reproduction is
effectively off: 2 fissions in 50 simulated minutes.** Remove the floor and the guild trends to
extinction.

### 3. The cause is starvation, not combat — 68% of hunter deaths
Death-cause probe (5 seeds × 300s, 96 hunter deaths): **68% starvation** (metabolism / energy-biomass
collapse), 32% combat. Corroborating hunter telemetry at steady state:
- **no target 94%** of the time; **strike only 1.6%** of the time (state occupancy: prowl 58%, flee
  23%, recover 14%, stalk 3.7%, strike 1.6%).
- ATP fill 33%, and 15.7% of hunters sit at **zero ATP**.

Mechanism: producers (algae) live shallow (mean depth ~620px); their death-fields decay
(`maxAge` 38–72s, `graph_kernel.mjs:1353`) faster than they sink to the deep, so field matter
collapses. Deep hunters (depth 3000+) sit in a food desert, burn upkeep ATP (L2960-2962), hit zero,
and autolyse under the **hunter-guild ×3 starvation multiplier** (`failedHunter = 3.0`, L2967).

### 4. The producer base thins even though its count holds
Algae *count* is stable (82–85, minted top-down to cap), but biomass-per-bloom halves (15→7) and the
large/giant tail vanishes (large 2.8→0, giants 2.2→0 at compare). Less matter enters the food web as
the run proceeds — which starves findings 2–3 further.

### 5. The algae bob lifecycle itself is healthy (not the problem)
size↔depth corr 0.83, median bob period 72s (inside the 45–120s accept band), phase entropy 0.70, 0%
boundary-limit time, 498/498 returners complete cycles. The vertical producer ecology works well; the
failure is **downstream** — matter never reaches the consumers.

## Why the two goals are coupled
- **Initial conditions**: you cannot simply seed at the measured steady state — that just starts the
  world *already* impoverished (3 predators, 670 field matter). The seed only becomes a genuine
  "midpoint of a long sim" once the steady state itself is lively.
- **World-space balance**: therefore the primary work is raising the deep's carrying capacity so the
  guild sustains itself off reproduction, not immigration. Fix that first, re-measure the new steady
  state, then set the seed to match it.

## Recommended dial changes (prioritized; none applied)

**Priority 1 — feed the deep / stop the starvation collapse (repairs the steady state):**
1. **Field longevity & flow** — raise field `maxAge` (seed L1353 + spawnTick refills) and/or
   `FIELD_SINK_K` (L292) so biomass corpse-matter persists and sinks into the deep instead of
   decaying in the shallows. Target: steady field matter that doesn't collapse 5×.
2. **Soften the hunter-guild starvation multiplier** `failedHunter = 3.0` → ~1.5–2.0 (L2967). In a
   player-free world the ×3 is a death sentence on any hunter that drifts through a lean patch; a
   gentler taper lets stranded hunters ride it out and resume hunting.
3. **A real deep food source** — the 14 rupture + 6 nursery seed fields (L1344-1362) are all
   shallow/mid; nothing replenishes the deep. Either seed/replenish some deep fields, or let a
   fraction of algae falls survive to the deep before dissolving (`ALGAE_DEEP_ATTR` L246 governs how
   fast a fallen bloom is destroyed above the floor).

**Priority 2 — make reproduction reachable (so the guild grows off the floor):**
4. `wildFissionRate` is ATP^3.2-dominated with a steep heat pulse (L4051); at 33% ATP the hazard is
   ~0. **Fix the food supply first (P1), then re-measure fissions** before touching the curve — the
   low rate is a symptom of starvation, not necessarily a mis-tuned exponent.

**Priority 3 — align initial conditions to the repaired steady state (makes t=0 a true midpoint):**
5. Once P1/P2 give a lively steady state, set the seed to match it: `SCAV_TARGET` (L4010, currently
   26), `predN/protoN/metaN/broodN` (L1320-1323), and the seed field matter (L1344-1362) to the
   measured steady values. Success = `ecology_report` fidelity < 15% ("t=0 ≈ steady").

## The rigging (what to use)
- `npm run ecology` → `ecology_report.mjs [min=8] [seeds=5]` — one-command consolidated readout
  (populations t=0→steady, fidelity, quasi-equilibrium, matter budget, flux, structure, verdict).
- `node sim_eval.mjs [min] [warmup] [seeds] [dt]` — deep structural QA + timeline.
- `node dynamics_lab.mjs [min] [seeds] [dt]` — drift/min, quasi-equilibrium, ±5% sensitivity probes.
- `node ecology_experiments.mjs [min] [seeds] [dt] [candidate|all]` — screen `DEFAULT_ECOLOGY_TUNING`
  directions.

Convention: sweep at dt=0.05, confirm finalists at dt=1/60. (dt=0.05 is the production step cap, so
it is representative, not merely coarse.)
