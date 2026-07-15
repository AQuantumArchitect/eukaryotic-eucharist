# World-space redesign spec (2026-07-14, from playtest dump)

The vision: a **vertical trophic column**. Producers up top, a whale-fall carbon pump feeding the
deep, a rising-fat interception layer in the middle, and a lightless/oxygen-less abyss of ancient
anaerobes. Bigger world = room to drift and brawl. Player is treated fairly (never ambushed by a
spawn popping in above/beside it).

## 1. World dimensions — extend the deep only
- `WORLD.h` 5600 → ~11200 (≈2×), all extension **below the rupture**; canopy/nursery/rupture bands
  stay put, `deepTop` (3000) stays, so the abyss (deepTop→h) becomes a vast ~8000px drift-and-brawl
  zone.
- `WORLD.w` 2340 → ~3200 (a bit wider). X still wraps (cylinder).
- Ripples to audit: `lightAt`/O2 field shoulders, escalation `depthTier /850`, all spawn depths,
  `seedAnalyticAlgaeRegime` depth clamps, `index.html` renderer/camera/minimap (confirm it reads
  `K.WORLD` not hardcoded).

## 2. Spawn model — directional, off-screen, fair
- **Hunters** (predator/protozoan/metazoan/brood) enter from the **bottom band**, swim up.
- **Algae** mint from the **top** (already top-down).
- **Scavengers** drift in from the **sides** (off-screen horizontally; X wraps).
- **Never** spawn within a safe window **above or beside** the player. Below-and-around the cylinder
  is fair: a hunter may spawn below on the far side, swim up, and be there when the player rotates
  around — that is earned, not unfair.
- Spawn **lower** in general. No more "predator popped in next to me at 2400".

## 3. Whale-fall food pump (feed the deep)
- **More & beefier algae** — more standing producer mass, so more falls.
- Big algae deaths drop **biomass falls** that **do NOT naturally decay** (persist and sink) — the
  carbon pump. **Bigger mass falls faster** (square-cube: sink speed scales with mass^(2/3) or
  similar), so a whale-fall plummets.
- **Lipids/fat rise** (buoyant). The whale-fall biomass sinks to feed **deep anaerobic creatures**;
  the rising fat is the mid-column food.
- Use a **square-cube law** for large-death whale-fall (mass → fall speed / field size).

## 4. Oxygen relayer + two scavenger castes
- Current O2 feels wrong. New model: the **entire lit sigmoid sits inside the O2 cloud**; the
  **no-O2 layer is deeper down** (push the O2 cliff below where light ends, into the new deep).
- **O2-tolerant scavengers** (shallow/mid, in the O2 zone) — **includes the player** → add an
  `oxygen_tolerance` organelle to the **default starter kit**.
- **O2-intolerant scavengers** — deeper, "weirder ancient" anaerobic caste in the no-O2 abyss. New
  design space (a second scavenger variant).

## 5. Predator behavior + population
- Mid predators are the **O2-tolerant respirating eukaryotes**: they **hunt lower**, **chase the
  rising fat up** (intercept before it reaches the light), then **return to prowl lower**.
- Predator **population is too high** — thin it (bigger world + edge-spawn helps; also check
  escalation floor).

## 6. Scavengers
- They currently **clump into a mid-column line** — spread them vertically/laterally.

## Coupling note (from the no-player diagnosis)
The deep is already a starvation desert (68% of hunter deaths are starvation; guild survives only on
the immigration floor). A 2× deeper world makes that worse unless §3 (whale-fall) genuinely lands
food in the deep. §3 is therefore load-bearing for §1 and §5 paying off. Measure every chunk with
`npm run ecology`.

## Sequencing
1. World dims (extend deep + widen) + O2 relayer.
2. Directional off-screen spawn model.
3. Whale-fall field physics + beefier/more algae.
4. Two scavenger castes + player starter O2 tolerance.
5. Predator fat-chase AI + population thin.
6. Scavenger spread.
Determinism + NaN-clean + ecology-path sound after each; economy left to the other agent.
