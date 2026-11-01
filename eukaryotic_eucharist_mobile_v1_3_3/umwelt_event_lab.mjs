// Discover which event-level ecological cues lead hunter outbreaks.
// Runs the unforced (no harmonic, no belief feedback) ecology and reports lagged
// correlations. This is identification machinery, not a game rule.
// Usage: node umwelt_event_lab.mjs [seconds=120] [seeds=1] [dt=.05] [out.json]

import { writeFile } from 'node:fs/promises';
import * as K from './src/graph_kernel.mjs';

const SECONDS = Number(process.argv[2] || 120);
const N = Math.max(1, Number(process.argv[3] || 1));
const DT = Math.min(0.05, Number(process.argv[4] || 0.05));
const OUT = process.argv[5] || null;
const SEEDS = [11, 22, 33, 44, 55].slice(0, N);
const HUNTERS = new Set(['predator', 'protozoan', 'metazoan']);
const mean = xs => xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
const corr = (a, b) => {
  if (a.length < 3) return 0;
  const ma = mean(a), mb = mean(b);
  let xy = 0, xx = 0, yy = 0;
  for (let i = 0; i < a.length; i++) { const x = a[i] - ma, y = b[i] - mb; xy += x * y; xx += x * x; yy += y * y; }
  return xx && yy ? xy / Math.sqrt(xx * yy) : 0;
};

function state(w) {
  let prey = 0, hunters = 0, hunterEnergy = 0, hunterHeat = 0, algae = 0, scavengers = 0;
  for (const e of w.entities) if (e.alive) {
    if (e.controller === 'algae') { algae++; if (e.deepBloom) prey += 0.65; }
    if (e.controller === 'scavenger') { scavengers++; prey++; }
    if (HUNTERS.has(e.controller)) {
      hunters++;
      hunterEnergy += (e.cargo.energy || 0) / Math.max(1, K.__test.caps(e).energy);
      hunterHeat += e.reproHeat || 0;
    }
  }
  const matter = w.fields.reduce((s, f) => s + K.__test.totalMatter(f.stock), 0);
  return { prey, hunters, algae, scavengers, logMatter: Math.log1p(matter),
    hunterEnergy: hunters ? hunterEnergy / hunters : 0,
    hunterHeat: hunters ? hunterHeat / hunters : 0 };
}

function run(seed) {
  const w = K.createEcologyWorld({ seed, ecologyEphemerisMode: 'off' });
  const rows = [];
  let bucket = {};
  const add = key => { bucket[key] = (bucket[key] || 0) + 1; };
  const every = Math.max(1, Math.round(1 / DT));
  for (let frame = 1; frame <= Math.round(SECONDS / DT); frame++) {
    K.stepEcology(w, DT);
    for (const e of w.events) {
      if (e.type === 'fission' && HUNTERS.has(e.controller)) add('hunterFission');
      if (e.type === 'fission' && e.controller === 'scavenger') add('scavengerFission');
      if (e.type === 'algae_wound_shed') add('woundShed');
      if (e.type === 'deep_bloom_birth') add('deepBloomBirth');
      if (e.type === 'immigrate' && HUNTERS.has(e.controller)) add('hunterIn');
      if (e.type === 'emigrate' && HUNTERS.has(e.controller)) add('hunterOut');
      if (e.type === 'death') add('death');
    }
    if (frame % every === 0) {
      rows.push({ t: w.t, ...state(w), hunterFission: 0, scavengerFission: 0, woundShed: 0,
        deepBloomBirth: 0, hunterIn: 0, hunterOut: 0, death: 0, ...bucket });
      bucket = {};
    }
  }
  // Population increases include immigration and fission; fissions are the desired outbreak marker.
  for (let i = 0; i < rows.length; i++) rows[i].hunterGrowth = i ? rows[i].hunters - rows[i - 1].hunters : 0;
  return { seed, rows };
}

const runs = SEEDS.map(run);
const features = ['prey', 'logMatter', 'hunterEnergy', 'hunterHeat', 'woundShed', 'deepBloomBirth',
  'scavengerFission', 'hunterIn', 'hunterOut', 'death'];
const outcomes = ['hunterFission', 'hunterGrowth'];
const lags = [];
for (const feature of features) for (const outcome of outcomes) {
  for (let lag = 0; lag <= 30; lag++) {
    const xs = [], ys = [];
    for (const run of runs) for (let i = 0; i + lag < run.rows.length; i++) {
      xs.push(run.rows[i][feature]); ys.push(run.rows[i + lag][outcome]);
    }
    lags.push({ feature, outcome, lag, correlation: corr(xs, ys) });
  }
}
const leaders = [];
for (const feature of features) for (const outcome of outcomes) {
  const candidates = lags.filter(x => x.feature === feature && x.outcome === outcome);
  leaders.push(candidates.reduce((a, b) => Math.abs(b.correlation) > Math.abs(a.correlation) ? b : a));
}
leaders.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
console.log('strongest lead/lag relationships (cue now → outcome later)');
for (const x of leaders.slice(0, 16)) console.log(`${x.feature.padEnd(18)} -> ${x.outcome.padEnd(14)} +${String(x.lag).padStart(2)}s  r=${x.correlation.toFixed(3)}`);
const result = { config: { seconds: SECONDS, seeds: SEEDS, dt: DT }, leaders, lags, runs };
console.log(`RESULT ${JSON.stringify({ config: result.config, leaders: leaders.slice(0, 10) })}`);
if (OUT) { await writeFile(OUT, JSON.stringify(result, null, 2)); console.log(`wrote ${OUT}`); }
