// sim_experience.mjs — the EXPERIENCE evaluator.
//
// Drives the policy-graph player (sim_player.mjs) through full runs across several seeds and pulls
// evaluation data on the *player experience*, then scores it against the target dramatic arc:
//
//   gentle opening  →  ascending sawtooth of tension  →  CLIMAX right after mitochondria
//                   →  falling action = farming the monstrous deep (the end game)
//
// It records a per-second time-series (progression, tension, reward, depth, deaths) and derives:
//   - how far each run got (the "furthest phase reached" — where the arc stalls)
//   - whether tension ASCENDS toward the climax (with relief valleys = the sawtooth)
//   - whether there's a FALLING ACTION after the climax (lower danger, deep-farm reward)
//   - whether the opening is GENTLE (few early deaths — the foot of the curve)
//   - a scalar arc score (0..100) so tuning can be driven by measurement, not feel.
//
// Deterministic: (worldSeed, playerSeed) fully determine a run. Usage:
//   node sim_experience.mjs [minutes] [seed1 seed2 ...]
//   node sim_experience.mjs 25 1234 77 2025 909

import * as K from './src/graph_kernel.mjs';
import { PolicyPlayer } from './sim_player.mjs';

const DT = 1 / 60;
const MIN = Number(process.argv[2] || 20);
const SEEDS = process.argv.slice(3).map(Number).filter(n => !isNaN(n));
if (!SEEDS.length) SEEDS.push(1234, 77, 2025, 909, 3131);
const CANOPY = K.WORLD.canopy;
const DEPTH_GATE = 2650;

// ---- progression: weighted story milestones (sum to 1.0) — the "how far did the arc get" axis ----
const PROG = [
  ['first_buy', 0.06, r => r.buys >= 1],
  ['bodied', 0.08, r => r.organs.membrane >= 2 || (r.organs.membrane || 0) + (r.organs.membrane_intake || 0) >= 4],
  ['first_bite', 0.10, r => r.hadBite],
  ['first_genome', 0.14, r => r.genomes >= 1],
  ['reached_deep', 0.14, r => r.maxDepth >= DEPTH_GATE],
  ['host_ready', 0.10, r => r.readinessReady],
  ['MITOCHONDRIA', 0.22, r => r.mito],            // THE CLIMAX
  ['first_deep_kill', 0.08, r => r.deepKills >= 1],
  ['deep_farm', 0.08, r => r.deepKills >= 12],    // the falling-action end game
];
const PHASES = ['spawn', 'first_buy', 'bodied', 'first_bite', 'first_genome', 'reached_deep', 'host_ready', 'MITOCHONDRIA', 'first_deep_kill', 'deep_farm'];

function progressScore(state) { let s = 0; for (const [, w, f] of PROG) if (f(state)) s += w; return s; }
function furthestPhase(state) { let ph = 'spawn'; for (const [name, , f] of PROG) if (f(state)) ph = name; return ph; }

// instantaneous state snapshot used by both progression and tension
function snapState(world, player) {
  const p = K.getPlayer(world);
  const organs = p ? { ...p.organelles } : {};
  return {
    buys: player._buys, genomes: world.discoveredSources.size, hadBite: player._hadBite || (p && K.__test.hasRasp(p)),
    mito: p ? K.hasMito(p) : false, maxDepth: player._maxDepthEver || 0, deepKills: player._deepKills,
    readinessReady: p ? K.__test.hostReadiness(p, world).ready : false, organs,
  };
}

// tension in [0,1]: danger from nearby weapon-bearers, recent HP loss, and environmental stress
function tension(world, p, prevHp) {
  if (!p) return 1;
  const c = K.__test.caps(p);
  let threatT = 0;
  for (const e of world.entities) {
    if (!e.alive || e.kind !== 'npc' || e.friendly || e.controller === 'algae') continue;
    if (!K.__test.hasWeapon(e)) continue;
    const d = K.__test.distWrap(p.x, p.y, e.x, e.y);
    if (d > 480) continue;
    const sizeF = Math.min(1.6, K.__test.caps(e).hp / Math.max(1, c.hp));
    threatT = Math.max(threatT, (1 - d / 480) * sizeF);
  }
  const hpLoss = Math.max(0, (prevHp - p.hp)) / Math.max(1, c.hp);   // fraction lost this second
  const hpLow = 1 - p.hp / Math.max(1, c.hp);
  const o2 = Math.max(0, (p.oxygen - K.__test.oxygenTolerance(p))) * 2;
  const starve = (p.cargo.energy < 0.5 && p.cargo.biomass < 6) ? 0.7 : 0;
  return clamp(Math.max(threatT * 0.8 + hpLoss * 3, hpLow * 0.5, o2, starve), 0, 1);
}
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function mean(a) { return a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0; }

function runSeed(seed) {
  const world = K.createWorld({ seed, fresh: true });
  const player = new PolicyPlayer(K, { seed });
  player._maxDepthEver = 0;
  let prevPid = world.playerId, deaths = [], prevHp = 105;
  const series = [];
  const frames = Math.round(MIN * 60 * 60);
  let sec = 0;
  for (let i = 0; i < frames; i++) {
    if (!player.maybeShop(world)) { const cmd = player.update(world, DT); K.step(world, cmd, DT); }
    const p = K.getPlayer(world);
    if (p) player._maxDepthEver = Math.max(player._maxDepthEver, p.y - CANOPY);
    if (world.playerId !== prevPid) { deaths.push(+world.t.toFixed(1)); prevPid = world.playerId; prevHp = 105; }
    if (i % 60 === 0) {                            // one sample per second
      const st = snapState(world, player);
      series.push({ t: world.t, depth: p ? p.y - CANOPY : 0, hp: p ? p.hp / Math.max(1, K.__test.caps(p).hp) : 0,
        prog: progressScore(st), tension: tension(world, p, prevHp), node: player.node });
      if (p) prevHp = p.hp;
      sec++;
    }
  }
  const final = snapState(world, player);
  return { seed, series, deaths, milestones: player.milestones,
    reachedMito: final.mito, mitoT: player.milestones.mitochondria ?? null,
    furthest: furthestPhase(final), progress: progressScore(final),
    maxDepth: player._maxDepthEver, kills: player._kills, deepKills: player._deepKills,
    genomes: final.genomes, buys: player._buys, organs: final.organs };
}

// ---- arc scoring -------------------------------------------------------------------------------
function scoreArc(r) {
  const openingDeaths = r.deaths.filter(t => t < 150).length;    // gentle foot?
  const totalDeaths = r.deaths.length;
  // ascending tension pre-climax: slope of tension vs time up to mito (or whole run if no mito)
  const end = r.mitoT ?? r.series[r.series.length - 1].t;
  const pre = r.series.filter(s => s.t <= end);
  const ascend = pre.length > 20 ? slope(pre.map(s => s.t), pre.map(s => s.tension)) : 0;
  // sawtooth: relief valleys pre-climax (tension isn't a flat line — it rises and falls)
  const sawtooth = pre.length > 20 ? relief(pre.map(s => s.tension)) : 0;
  // falling action: after mito, tension should be LOWER and deep-farm reward present
  const post = r.mitoT ? r.series.filter(s => s.t > r.mitoT) : [];
  const preT = mean(pre.map(s => s.tension)), postT = mean(post.map(s => s.tension));
  const fallingAction = r.reachedMito && post.length > 30 ? clamp((preT - postT) + (r.deepKills >= 6 ? 0.3 : 0), -0.5, 1) : 0;

  let score = 0;
  score += r.progress * 45;                                       // how far the story got (0..45)
  score += r.reachedMito ? 15 : 0;                                // reached the climax
  score += clamp(ascend * 400, -5, 12);                          // ascending tension (slope small; scaled)
  score += clamp(sawtooth * 20, 0, 10);                          // relief valleys (the sawtooth)
  score += clamp(fallingAction * 12, 0, 12);                     // a real denouement
  score += clamp(6 - openingDeaths * 3, -6, 6);                  // gentle opening (few early deaths)
  score -= clamp((totalDeaths - 2) * 1.5, 0, 12);               // churny death-loops are bad experience
  return { score: +clamp(score, 0, 100).toFixed(1), openingDeaths, totalDeaths, ascend: +ascend.toFixed(5), sawtooth: +sawtooth.toFixed(3), preT: +preT.toFixed(3), postT: +postT.toFixed(3), fallingAction: +fallingAction.toFixed(2) };
}
function slope(xs, ys) { const n = xs.length, mx = mean(xs), my = mean(ys); let num = 0, den = 0; for (let i = 0; i < n; i++) { num += (xs[i] - mx) * (ys[i] - my); den += (xs[i] - mx) ** 2; } return den ? num / den : 0; }
function relief(ys) { let v = 0; for (let i = 1; i < ys.length; i++) if (ys[i] < ys[i - 1] - 0.15) v++; return v / ys.length; }

// sparkline of a 0..1 series
const SPARK = ' .:-=+*#%@';
function sparkline(vals, width = 60) {
  const out = [];
  const step = Math.max(1, Math.floor(vals.length / width));
  for (let i = 0; i < vals.length; i += step) { const chunk = vals.slice(i, i + step); const m = mean(chunk); out.push(SPARK[clamp(Math.round(m * (SPARK.length - 1)), 0, SPARK.length - 1)]); }
  return out.join('');
}

// ---- run + report ------------------------------------------------------------------------------
const results = SEEDS.map(runSeed);
console.log(`\n===== EXPERIENCE EVAL: ${MIN} min × ${SEEDS.length} seeds =====`);
console.log('target arc: gentle opening → ascending sawtooth → CLIMAX(mito) → falling action(farm deep)\n');

const arcs = results.map(scoreArc);
console.log('per-seed:');
for (let i = 0; i < results.length; i++) {
  const r = results[i], a = arcs[i];
  console.log(`  seed ${String(r.seed).padStart(5)}: score ${String(a.score).padStart(5)}  furthest=${r.furthest.padEnd(14)} prog=${(r.progress * 100).toFixed(0)}%  mito=${r.reachedMito ? '@' + r.mitoT?.toFixed(0) + 's' : 'NO'}  deaths=${r.deaths.length}(open ${a.openingDeaths})  deepKills=${r.deepKills}  maxDepth=${r.maxDepth.toFixed(0)}`);
  console.log(`         tension  ${sparkline(r.series.map(s => s.tension))}`);
  console.log(`         progress ${sparkline(r.series.map(s => s.prog))}`);
  console.log(`         depth    ${sparkline(r.series.map(s => clamp(s.depth / 5000, 0, 1)))}`);
}

// aggregate
const phaseHist = {};
for (const r of results) phaseHist[r.furthest] = (phaseHist[r.furthest] || 0) + 1;
console.log('\nfurthest phase reached (where the arc stalls):');
for (const ph of PHASES) if (phaseHist[ph]) console.log(`  ${ph.padEnd(16)} ${'█'.repeat(phaseHist[ph])} ${phaseHist[ph]}/${SEEDS.length}`);
console.log(`\nmean arc score: ${mean(arcs.map(a => a.score)).toFixed(1)} / 100`);
console.log(`reached climax (mito): ${results.filter(r => r.reachedMito).length}/${SEEDS.length}`);
console.log(`mean deaths/run: ${mean(results.map(r => r.deaths.length)).toFixed(1)}  (opening deaths: ${mean(arcs.map(a => a.openingDeaths)).toFixed(1)})`);
console.log(`mean progression: ${(mean(results.map(r => r.progress)) * 100).toFixed(0)}%   mean deepKills: ${mean(results.map(r => r.deepKills)).toFixed(1)}`);
console.log(`ascending-tension (mean slope×1e3): ${(mean(arcs.map(a => a.ascend)) * 1000).toFixed(2)}   sawtooth: ${mean(arcs.map(a => a.sawtooth)).toFixed(3)}`);

// machine-readable last line for the tuning loop to grep
console.log(`\nRESULT ${JSON.stringify({ meanScore: +mean(arcs.map(a => a.score)).toFixed(1), climaxRate: +(results.filter(r => r.reachedMito).length / SEEDS.length).toFixed(2), meanProg: +mean(results.map(r => r.progress)).toFixed(3), meanDeaths: +mean(results.map(r => r.deaths.length)).toFixed(1), meanDeepKills: +mean(results.map(r => r.deepKills)).toFixed(1) })}`);
