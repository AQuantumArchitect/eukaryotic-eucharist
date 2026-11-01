// Ecology dynamics lab: estimates aggregate drift, local sensitivities, cycles, and
// quasi-equilibria from the real player-free kernel. It does not add game rules.
//
// Usage:
//   node dynamics_lab.mjs [minutes=2] [seedCount=3] [dt=.05] [outFile]
//   node dynamics_lab.mjs 8 5 0.0166666667 dynamics_lab_result.json

import * as K from './src/graph_kernel.mjs';

const MINUTES = Number(process.argv[2] || 2);
const SEED_COUNT = Math.max(1, Math.floor(Number(process.argv[3] || 3)));
const DT = Number(process.argv[4] || 0.05);
const OUT_FILE = process.argv[5] || null;
const SEEDS = [11, 22, 33, 44, 55, 66, 77, 88, 99, 111].slice(0, SEED_COUNT);
const HUNTERS = new Set(['predator', 'protozoan', 'metazoan']);
const SPECIES = ['algae', 'scavenger', 'predator', 'protozoan', 'metazoan'];
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
const mean = xs => xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
const std = xs => {
  const m = mean(xs);
  return Math.sqrt(mean(xs.map(x => (x - m) ** 2)));
};
const add = (obj, key, value = 1) => { obj[key] = (obj[key] || 0) + value; };
const fieldMatter = world => world.fields.reduce((sum, field) => sum + K.__test.totalMatter(field.stock), 0);

function snapshot(world) {
  const live = world.entities.filter(e => e.alive);
  const algae = live.filter(e => e.controller === 'algae');
  const hunters = live.filter(e => HUNTERS.has(e.controller));
  const pop = Object.fromEntries(SPECIES.map(kind => [kind, 0]));
  for (const entity of live) if (entity.controller in pop) pop[entity.controller]++;
  return {
    t: world.t,
    pop,
    algaeBiomass: mean(algae.map(e => e.cargo.biomass || 0)),
    algaeDepth: mean(algae.map(e => e.y - K.WORLD.canopy)),
    algaeDepthStd: std(algae.map(e => e.y - K.WORLD.canopy)),
    algaeGas: mean(algae.map(e => (e.ballastGas || 0) / Math.max(0.001, K.__test.caps(e).ballastGas))),
    algaeLift: mean(algae.map(e => K.__test.buoyancy(e) - K.__test.biomassWeight(e))),
    fieldMatter: fieldMatter(world),
    fields: world.fields.length,
    hunterEnergy: mean(hunters.map(e => (e.cargo.energy || 0) / Math.max(1, K.__test.caps(e).energy))),
    hunterHeat: mean(hunters.map(e => e.reproHeat || 0)),
    hunterZeroEnergy: mean(hunters.map(e => (e.cargo.energy || 0) < 0.02 ? 1 : 0))
  };
}

// These are deliberately small, continuous initial displacements. Their observed
// differences approximate local partial derivatives of the aggregate flow.
function perturb(world, kind) {
  if (!kind) return;
  if (kind === 'algae_biomass') {
    for (const e of world.entities) if (e.alive && e.controller === 'algae') {
      e.cargo.biomass = Math.min(K.__test.caps(e).biomass, (e.cargo.biomass || 0) * 1.05 + 0.25);
    }
  }
  if (kind === 'field_matter') {
    for (const field of world.fields) for (const key of Object.keys(field.stock || {})) field.stock[key] *= 1.05;
  }
  if (kind === 'hunter_heat') {
    for (const e of world.entities) if (e.alive && HUNTERS.has(e.controller)) e.reproHeat = clamp((e.reproHeat || 0) + 0.08, 0, 1);
  }
}

function run(seed, probe = null) {
  const world = K.createEcologyWorld({ seed });
  perturb(world, probe);
  const samples = [snapshot(world)];
  const fissions = {};
  const frames = Math.round(MINUTES * 60 / DT);
  const sampleFrames = Math.max(1, Math.round(1 / DT));
  for (let frame = 1; frame <= frames; frame++) {
    K.stepEcology(world, DT);
    for (const event of world.events) if (event.type === 'fission') add(fissions, event.controller || 'unknown');
    if (frame % sampleFrames === 0) samples.push(snapshot(world));
  }
  return { seed, samples, fissions };
}

function averageRuns(runs) {
  const length = Math.min(...runs.map(run => run.samples.length));
  const rows = [];
  for (let i = 0; i < length; i++) {
    const row = { t: runs[0].samples[i].t, pop: {} };
    for (const key of ['algaeBiomass', 'algaeDepth', 'algaeDepthStd', 'algaeGas', 'algaeLift', 'fieldMatter', 'fields', 'hunterEnergy', 'hunterHeat', 'hunterZeroEnergy']) row[key] = mean(runs.map(run => run.samples[i][key]));
    for (const kind of SPECIES) row.pop[kind] = mean(runs.map(run => run.samples[i].pop[kind]));
    rows.push(row);
  }
  return rows;
}

function value(row, key) {
  return key.startsWith('pop.') ? row.pop[key.slice(4)] : row[key];
}

function linearSlope(rows, key, center, halfWindow = 15) {
  const window = rows.filter(row => Math.abs(row.t - center) <= halfWindow);
  if (window.length < 2) return 0;
  const mt = mean(window.map(row => row.t));
  const mv = mean(window.map(row => value(row, key)));
  const denom = window.reduce((sum, row) => sum + (row.t - mt) ** 2, 0);
  return denom ? window.reduce((sum, row) => sum + (row.t - mt) * (value(row, key) - mv), 0) / denom : 0;
}

function extrema(rows, key, minProminence) {
  const result = [];
  for (let i = 1; i < rows.length - 1; i++) {
    const before = value(rows[i - 1], key), current = value(rows[i], key), after = value(rows[i + 1], key);
    if (current >= before && current > after && current - Math.min(before, after) >= minProminence) result.push({ type: 'peak', t: rows[i].t, value: current });
    if (current <= before && current < after && Math.max(before, after) - current >= minProminence) result.push({ type: 'trough', t: rows[i].t, value: current });
  }
  return result;
}

function quasiEquilibrium(rows) {
  const keys = ['algaeBiomass', 'fieldMatter', 'pop.scavenger', 'pop.predator', 'pop.protozoan'];
  const scales = Object.fromEntries(keys.map(key => [key, Math.max(1, Math.abs(value(rows[0], key)))]));
  const candidates = rows.filter(row => row.t >= 20 && row.t <= rows.at(-1).t - 15).map(row => {
    const drift = Object.fromEntries(keys.map(key => [key, linearSlope(rows, key, row.t) * 60]));
    const norm = Math.sqrt(keys.reduce((sum, key) => sum + (drift[key] / scales[key]) ** 2, 0));
    return { t: row.t, norm, drift, state: row };
  });
  // A quasi-equilibrium search needs an interior window (t in [20, end-15]); a run shorter than
  // ~35s leaves it empty. Fall back to the last sampled row so the harness degrades gracefully
  // instead of crashing on `equilibrium.t`.
  if (!candidates.length) {
    const last = rows.at(-1);
    return { t: last.t, norm: NaN, drift: Object.fromEntries(keys.map(key => [key, NaN])), state: last, degenerate: true };
  }
  return candidates.reduce((best, candidate) => candidate.norm < best.norm ? candidate : best, candidates[0]);
}

function sensitivity(baseline, perturbed, keys) {
  const base0 = baseline[0], probe0 = perturbed[0];
  const baseEnd = baseline.at(-1), probeEnd = perturbed.at(-1);
  return Object.fromEntries(keys.map(key => {
    const input = value(probe0, key) - value(base0, key);
    const output = value(probeEnd, key) - value(baseEnd, key);
    return [key, { input, output, selfResponse: input ? output / input : 0 }];
  }));
}

const baselineRuns = SEEDS.map(seed => run(seed));
const baseline = averageRuns(baselineRuns);
const probes = {};
for (const probe of ['algae_biomass', 'field_matter', 'hunter_heat']) probes[probe] = averageRuns(SEEDS.map(seed => run(seed, probe)));

const equilibrium = quasiEquilibrium(baseline);
const end = baseline.at(-1);
const keys = ['algaeBiomass', 'fieldMatter', 'pop.scavenger', 'pop.predator', 'pop.protozoan', 'hunterHeat'];
const endDriftPerMinute = Object.fromEntries(keys.map(key => [key, linearSlope(baseline, key, end.t, 15) * 60]));
const peakEvents = extrema(baseline, 'pop.predator', 0.35);
const fissions = {};
for (const runResult of baselineRuns) for (const [kind, count] of Object.entries(runResult.fissions)) add(fissions, kind, count);
const probeEffects = Object.fromEntries(Object.entries(probes).map(([probe, rows]) => [probe, {
  endDelta: Object.fromEntries(keys.map(key => [key, value(rows.at(-1), key) - value(end, key)])),
  self: sensitivity(baseline, rows, keys)
}]));

const guesses = [];
if (Math.abs(endDriftPerMinute.algaeBiomass) < 2) guesses.push('Algal standing biomass is locally close to balance; tune its cycle shape before changing productivity.');
else guesses.push(`Algal standing biomass is still drifting ${endDriftPerMinute.algaeBiomass > 0 ? 'up' : 'down'}; adjust a continuous production/turnover rate before adding any control rule.`);
if (endDriftPerMinute['pop.scavenger'] < -0.35) guesses.push('Scavengers are the clearest weak reservoir: inspect continuous immigration/food response before changing predator aggression.');
if ((fissions.predator || 0) === 0) guesses.push('No predator fission occurred in this window; this is a quiet-period sample, not evidence that outbreaks are gone. Measure longer windows before tuning reproductive heat.');
if (peakEvents.filter(event => event.type === 'peak').length === 0) guesses.push('No population-scale predator peak cleared the prominence threshold; outbreak cadence needs longer runs or more seeds, not a scheduled pulse.');

const result = {
  config: { minutes: MINUTES, seeds: SEEDS, dt: DT },
  baseline,
  equilibrium,
  end,
  endDriftPerMinute,
  predatorExtrema: peakEvents,
  fissions,
  probeEffects,
  guesses
};

console.log(`\n=== dynamics lab: ${MINUTES}min × ${SEEDS.length}, dt=${DT} ===`);
console.log(`quasi-equilibrium guess: t=${equilibrium.t.toFixed(0)}s, normalized drift=${equilibrium.norm.toFixed(4)}`);
console.log('state at guess:', JSON.stringify({ algaeBiomass: equilibrium.state.algaeBiomass, fieldMatter: equilibrium.state.fieldMatter, pop: equilibrium.state.pop, hunterHeat: equilibrium.state.hunterHeat }));
console.log('end drift / minute:', JSON.stringify(endDriftPerMinute));
console.log('predator extrema:', JSON.stringify(peakEvents));
console.log('fissions:', JSON.stringify(fissions));
console.log('probe end deltas:', JSON.stringify(Object.fromEntries(Object.entries(probeEffects).map(([name, effect]) => [name, effect.endDelta]))));
for (const guess of guesses) console.log(`guess: ${guess}`);
console.log(`RESULT ${JSON.stringify({ config: result.config, equilibrium: result.equilibrium, end: result.end, endDriftPerMinute: result.endDriftPerMinute, predatorExtrema: result.predatorExtrema, fissions: result.fissions, probeEndDelta: Object.fromEntries(Object.entries(result.probeEffects).map(([name, effect]) => [name, effect.endDelta])), guesses: result.guesses })}`);

if (OUT_FILE) {
  await import('node:fs/promises').then(fs => fs.writeFile(OUT_FILE, JSON.stringify(result, null, 2)));
  console.log(`wrote ${OUT_FILE}`);
}
