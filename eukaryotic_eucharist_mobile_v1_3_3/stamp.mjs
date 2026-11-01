// BUILD STAMP / initial-conditions tool. Runs the player-free ecology for N virtual minutes across a
// seed set and reports WHERE IT SETTLES — per-lineage counts + depth bands + algae structure — plus
// how far the seeded t=0 is from that equilibrium (fidelity). Two uses:
//   1. Stamp a build: a repeatable snapshot of the steady state (run before stamping/deploying).
//   2. Re-derive initial conditions: retune seedMatureEcosystem to EMIT this equilibrium at t=0, so a
//      fresh world starts in-medias-res instead of lurching to its true shape over the first minutes.
// Usage: node stamp.mjs [minutes=10] [seeds=3] [dt=.05]
// The last line is a machine-readable RESULT {…} like the other harnesses.

import * as K from './src/graph_kernel.mjs';

const MINUTES = Number(process.argv[2] || 10);
const SEED_COUNT = Number(process.argv[3] || 3);
const DT = Math.min(0.05, Number(process.argv[4] || 0.05));
const SEEDS = [11, 22, 33, 44, 55, 66, 77, 88, 99].slice(0, SEED_COUNT);

const mean = a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0;
const std = a => { const m = mean(a); return Math.sqrt(mean(a.map(x => (x - m) ** 2))); };

// Lineages we care about for initial conditions. Scavengers split by O2 caste; predators are one pool
// (light tolerance varies continuously within it).
const LINEAGES = {
  algae: e => e.controller === 'algae',
  oxic_scavenger: e => e.controller === 'scavenger' && e.trophicRole !== 'abyssal_scavenger',
  abyssal_scavenger: e => e.trophicRole === 'abyssal_scavenger',
  predator: e => e.controller === 'predator',
  protozoan: e => e.controller === 'protozoan',
  metazoan: e => e.controller === 'metazoan',
  brood: e => e.controller === 'brood'
};

function snapshot(world) {
  const alive = world.entities.filter(e => e.alive);
  const out = {};
  for (const [name, pred] of Object.entries(LINEAGES)) {
    const g = alive.filter(pred);
    const ys = g.map(e => e.y);
    out[name] = { n: g.length, depthMean: mean(ys), depthSd: std(ys),
      depthMin: ys.length ? Math.min(...ys) : 0, depthMax: ys.length ? Math.max(...ys) : 0 };
  }
  // Algae size structure (small/med/large by radius) — the bob lifecycle should sort size by depth.
  const algae = alive.filter(LINEAGES.algae);
  out.algae.small = algae.filter(e => e.r < 52).length;
  out.algae.medium = algae.filter(e => e.r >= 52 && e.r < 66).length;
  out.algae.large = algae.filter(e => e.r >= 66).length;
  out.fieldMatter = world.fields.reduce((s, f) => s + (f._matter || 0), 0);
  out.fields = world.fields.length;
  out.pop = alive.length;
  return out;
}

// Average a list of per-seed snapshots into one mean snapshot.
function averageSnaps(snaps) {
  const avg = {};
  for (const key of Object.keys(snaps[0])) {
    if (typeof snaps[0][key] === 'object') {
      avg[key] = {};
      for (const f of Object.keys(snaps[0][key])) avg[key][f] = mean(snaps.map(s => s[key][f]));
    } else {
      avg[key] = mean(snaps.map(s => s[key]));
    }
  }
  return avg;
}

const startSnaps = [], endSnaps = [];
const steps = Math.round((MINUTES * 60) / DT);
for (const seed of SEEDS) {
  const world = K.createEcologyWorld({ seed });
  startSnaps.push(snapshot(world));
  for (let i = 0; i < steps; i++) K.stepEcology(world, DT);
  endSnaps.push(snapshot(world));
}
const start = averageSnaps(startSnaps);
const end = averageSnaps(endSnaps);

console.log(`\n=== BUILD STAMP — ${MINUTES}min × ${SEEDS.length} seeds (dt=${DT}) ===`);
console.log(`world settles to (t=${MINUTES}min): pop ${end.pop.toFixed(0)}, field matter ${end.fieldMatter.toFixed(0)} across ${end.fields.toFixed(0)} fields\n`);
console.log('LINEAGE            seed_n → steady_n   depth (mean±sd) [min..max]        seed→steady gap');
let gapSum = 0, gapCount = 0;
for (const name of Object.keys(LINEAGES)) {
  const s = start[name], e = end[name];
  const gap = s.n > 0.5 || e.n > 0.5 ? Math.abs(e.n - s.n) / Math.max(1, (s.n + e.n) / 2) : 0;
  gapSum += gap; gapCount++;
  console.log(`  ${name.padEnd(17)} ${s.n.toFixed(0).padStart(3)} → ${e.n.toFixed(0).padStart(3)}` +
    `        ${e.depthMean.toFixed(0).padStart(5)}±${e.depthSd.toFixed(0).padStart(4)}  [${e.depthMin.toFixed(0)}..${e.depthMax.toFixed(0)}]`.padEnd(34) +
    `   ${(gap * 100).toFixed(0)}%`);
}
console.log(`\nalgae size @steady: small=${end.algae.small.toFixed(0)} medium=${end.algae.medium.toFixed(0)} large=${end.algae.large.toFixed(0)}`);
const fidelity = gapSum / gapCount;
console.log(`INITIAL-CONDITION FIDELITY  mean |lineage count gap t=0→steady| = ${(fidelity * 100).toFixed(0)}%  ${fidelity < 0.15 ? '(good — t=0 ≈ steady)' : fidelity < 0.30 ? '(fair)' : '(poor — retune the seed)'}`);

// Emit the steady-state as a ready-to-paste seed target.
const seedTarget = {};
for (const name of Object.keys(LINEAGES)) seedTarget[name] = { n: Math.round(end[name].n), depthMean: Math.round(end[name].depthMean), depthSd: Math.round(end[name].depthSd) };
console.log('\nSEED TARGET (emit this distribution at t=0):');
console.log(JSON.stringify(seedTarget));
console.log(`\nRESULT ${JSON.stringify({ minutes: MINUTES, seeds: SEEDS.length, dt: DT, fidelity, steadyPop: Math.round(end.pop), seedTarget })}`);
