// Parameter-search harness for the player-free ecology.
// It compares candidate continuous tuning vectors with identical seeds and scores
// boundedness, low aggregate drift, vertical algae diversity, and unscripted pulses.
// Usage: node ecology_experiments.mjs [minutes=1] [seedCount=1] [dt=.05] [candidate|all] [outFile]

import * as K from './src/graph_kernel.mjs';

const MINUTES = Number(process.argv[2] || 1);
const SEED_COUNT = Math.max(1, Math.floor(Number(process.argv[3] || 1)));
const DT = Number(process.argv[4] || 0.05);
const REQUESTED = process.argv[5] || 'all';
const OUT_FILE = process.argv[6] || null;
const SEEDS = [11, 22, 33, 44, 55, 66, 77, 88].slice(0, SEED_COUNT);
const HUNTERS = new Set(['predator', 'protozoan', 'metazoan']);
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
const mean = xs => xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
const fieldMatter = world => world.fields.reduce((sum, field) => sum + K.__test.totalMatter(field.stock), 0);

// Each pair is a finite-difference probe around the current kernel. "steady_froth"
// combines only the directions that are plausible from the initial derivative read.
const CANDIDATES = Object.freeze([
  { name: 'baseline', tuning: {} },
  { name: 'photo_minus', tuning: { algaePhotoScale: 0.076 } },
  { name: 'photo_plus', tuning: { algaePhotoScale: 0.084 } },
  { name: 'scavenger_minus', tuning: { scavengerDetritusGain: 0.92, nurserySlurryGain: 0.95 } },
  { name: 'scavenger_plus', tuning: { scavengerDetritusGain: 1.10, nurserySlurryGain: 1.05 } },
  { name: 'pulse_short', tuning: { predatorHeatDecay: 1.18 } },
  { name: 'pulse_long', tuning: { predatorHeatDecay: 0.78 } },
  { name: 'steady_froth', tuning: { algaePhotoScale: 0.084, scavengerDetritusGain: 1.10, nurserySlurryGain: 1.05 } }
]);

function snapshot(world) {
  const live = world.entities.filter(e => e.alive);
  const algae = live.filter(e => e.controller === 'algae');
  const hunters = live.filter(e => HUNTERS.has(e.controller));
  const pop = { algae: 0, scavenger: 0, predator: 0, protozoan: 0, metazoan: 0 };
  const phases = { basking: 0, sinking: 0, rising: 0 };
  for (const e of live) if (e.controller in pop) pop[e.controller]++;
  for (const e of algae) phases[e.fallState === 'sinking' ? 'sinking' : e.fallState === 'rising' ? 'rising' : 'basking']++;
  const p = Object.values(phases).map(n => n / Math.max(1, algae.length)).filter(n => n > 0);
  const phaseEntropy = p.length > 1 ? -p.reduce((sum, n) => sum + n * Math.log(n), 0) / Math.log(3) : 0;
  return {
    t: world.t, pop, phases, phaseEntropy,
    algaeBiomass: mean(algae.map(e => e.cargo.biomass || 0)),
    algaeDepth: mean(algae.map(e => e.y - K.WORLD.canopy)),
    fieldMatter: fieldMatter(world),
    hunterHeat: mean(hunters.map(e => e.reproHeat || 0)),
    hunterZeroEnergy: mean(hunters.map(e => (e.cargo.energy || 0) < 0.02 ? 1 : 0))
  };
}

function run(seed, candidate) {
  const world = K.createEcologyWorld({ seed, ecologyTuning: candidate.tuning });
  const samples = [snapshot(world)], fissions = {};
  const frames = Math.round(MINUTES * 60 / DT);
  const sampleFrames = Math.max(1, Math.round(1 / DT));
  for (let frame = 1; frame <= frames; frame++) {
    K.stepEcology(world, DT);
    for (const event of world.events) if (event.type === 'fission') fissions[event.controller] = (fissions[event.controller] || 0) + 1;
    if (frame % sampleFrames === 0) samples.push(snapshot(world));
  }
  return { seed, samples, fissions };
}

function average(runs) {
  const n = Math.min(...runs.map(run => run.samples.length));
  return Array.from({ length: n }, (_, i) => {
    const row = { t: runs[0].samples[i].t, pop: {}, phaseEntropy: mean(runs.map(run => run.samples[i].phaseEntropy)) };
    for (const key of ['algaeBiomass', 'algaeDepth', 'fieldMatter', 'hunterHeat', 'hunterZeroEnergy']) row[key] = mean(runs.map(run => run.samples[i][key]));
    for (const kind of ['algae', 'scavenger', 'predator', 'protozoan', 'metazoan']) row.pop[kind] = mean(runs.map(run => run.samples[i].pop[kind]));
    return row;
  });
}

function score(rows, fissions) {
  const start = rows[0], end = rows.at(-1);
  const ratioPenalty = (after, before, scale = 1) => Math.abs(Math.log((after + scale) / (before + scale)));
  const drift =
    ratioPenalty(end.algaeBiomass, start.algaeBiomass, 8) * 2.0 +
    ratioPenalty(end.fieldMatter, start.fieldMatter, 500) * 0.9 +
    ratioPenalty(end.pop.scavenger, start.pop.scavenger, 3) * 1.6 +
    ratioPenalty(end.pop.predator, start.pop.predator, 2) * 1.2 +
    ratioPenalty(end.pop.protozoan, start.pop.protozoan, 2) * 0.7;
  const collapse = (end.pop.scavenger < 8 ? 14 : 0) + (end.pop.predator + end.pop.protozoan < 4 ? 16 : 0);
  const phaseReward = 8 * clamp(end.phaseEntropy, 0, 1);
  // A small reward for observed pulses, capped so the optimizer cannot chase a runaway bloom.
  const pulseCount = Object.values(fissions).reduce((sum, n) => sum + n, 0);
  const pulseReward = 5 * Math.min(2, pulseCount);
  return { value: 100 - 28 * drift - collapse + phaseReward + pulseReward, drift, collapse, phaseReward, pulseReward, pulseCount };
}

function summarize(candidate) {
  const runs = SEEDS.map(seed => run(seed, candidate));
  const rows = average(runs);
  const fissions = {};
  for (const runResult of runs) for (const [kind, n] of Object.entries(runResult.fissions)) fissions[kind] = (fissions[kind] || 0) + n;
  return { name: candidate.name, tuning: { ...K.DEFAULT_ECOLOGY_TUNING, ...candidate.tuning }, start: rows[0], end: rows.at(-1), score: score(rows, fissions), fissions, rows };
}

const selected = CANDIDATES.filter(candidate => REQUESTED === 'all' || candidate.name === REQUESTED);
if (!selected.length) throw new Error(`Unknown candidate "${REQUESTED}". Use one of: ${CANDIDATES.map(c => c.name).join(', ')}`);
const results = selected.map(summarize).sort((a, b) => b.score.value - a.score.value);
const short = results.map(result => ({ name: result.name, score: Number(result.score.value.toFixed(2)), drift: Number(result.score.drift.toFixed(3)), pulses: result.score.pulseCount, end: { algaeBiomass: Number(result.end.algaeBiomass.toFixed(1)), fieldMatter: Math.round(result.end.fieldMatter), scavenger: result.end.pop.scavenger, predator: result.end.pop.predator, protozoan: result.end.pop.protozoan, phaseEntropy: Number(result.end.phaseEntropy.toFixed(2)) } }));
console.log(`\n=== ecology experiment screen: ${MINUTES}min × ${SEEDS.length}, dt=${DT} ===`);
for (const result of short) console.log(`${result.name.padEnd(18)} score=${result.score.toFixed(2)} drift=${result.drift.toFixed(3)} pulses=${result.pulses} end algae=${result.end.algaeBiomass} scav=${result.end.scavenger} pred=${result.end.predator} proto=${result.end.protozoan} entropy=${result.end.phaseEntropy}`);
console.log(`RESULT ${JSON.stringify({ config: { minutes: MINUTES, seeds: SEEDS, dt: DT }, ranking: short, best: short[0] })}`);
if (OUT_FILE) {
  await import('node:fs/promises').then(fs => fs.writeFile(OUT_FILE, JSON.stringify({ config: { minutes: MINUTES, seeds: SEEDS, dt: DT }, results }, null, 2)));
  console.log(`wrote ${OUT_FILE}`);
}
