// Coarse A/B lab for the ecology's shared belief ephemeris.
//
// It compares three otherwise-identical worlds:
//   belief   — online forecasts earn a bounded influence only if they beat persistence
//   harmonic — the former authored sine season (control)
//   off      — prey-driven immigration with no clock (control)
//
// Usage: node umwelt_ephemeris_lab.mjs [seconds=60] [seeds=1] [dt=.05] [out.json]

import { writeFile } from 'node:fs/promises';
import * as K from './src/graph_kernel.mjs';

const SECONDS = Math.max(10, Number(process.argv[2] || 60));
const SEED_COUNT = Math.max(1, Math.floor(Number(process.argv[3] || 1)));
const DT = Math.min(0.05, Math.max(1 / 240, Number(process.argv[4] || 0.05)));
const OUT = process.argv[5] || null;
const HORIZON = Number(process.env.EPHEMERIS_HORIZON || K.DEFAULT_ECOLOGY_TUNING.predatorEphemerisHorizon);
const GAIN = Number(process.env.EPHEMERIS_GAIN || K.DEFAULT_ECOLOGY_TUNING.predatorEphemerisGain);
const FISSION_GAIN = Number(process.env.EPHEMERIS_FISSION_GAIN || K.DEFAULT_ECOLOGY_TUNING.predatorEphemerisFissionGain);
const EVENT_GAIN = Number(process.env.EPHEMERIS_EVENT_GAIN || K.DEFAULT_ECOLOGY_TUNING.predatorEphemerisEventGain);
const ECOLOGY_REGIME = process.env.ECOLOGY_REGIME_JSON ? JSON.parse(process.env.ECOLOGY_REGIME_JSON) : {};
const PARAMS = process.env.ECOLOGY_PARAMS_JSON ? JSON.parse(process.env.ECOLOGY_PARAMS_JSON) : {};
const SEEDS = [11, 22, 33, 44, 55, 66, 77, 88].slice(0, SEED_COUNT);
const MODES = (process.env.EPHEMERIS_MODES || 'belief,harmonic,off').split(',').map(x => x.trim()).filter(Boolean);
const HUNTERS = new Set(['predator', 'protozoan', 'metazoan']);
const mean = xs => xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
const sd = xs => { const m = mean(xs); return Math.sqrt(mean(xs.map(x => (x - m) ** 2))); };
const cv = xs => mean(xs) ? sd(xs) / Math.abs(mean(xs)) : 0;
const fieldMatter = w => w.fields.reduce((s, f) => s + K.__test.totalMatter(f.stock), 0);

function snap(w) {
  const pop = { algae: 0, scavenger: 0, predator: 0, protozoan: 0, metazoan: 0 };
  const roles = {};
  const hunters = [];
  const grazers = [];
  for (const e of w.entities) if (e.alive) {
    if (e.controller in pop) pop[e.controller]++;
    roles[e.trophicRole || e.controller] = (roles[e.trophicRole || e.controller] || 0) + 1;
    if (HUNTERS.has(e.controller)) hunters.push(e);
    if (e.trophicRole === 'fat_grazer') grazers.push(e);
  }
  const fieldByResource = { biomass: 0, lipids: 0, energy: 0, toxins: 0, ballast: 0 };
  const fieldByDepth = { upper: 0, middle: 0, deep: 0 };
  for (const field of w.fields) {
    const amount = K.__test.totalMatter(field.stock);
    for (const key of Object.keys(fieldByResource)) fieldByResource[key] += field.stock[key] || 0;
    fieldByDepth[field.y < K.WORLD.deepTop ? 'upper' : field.y < K.WORLD.deepTop + 1800 ? 'middle' : 'deep'] += amount;
  }
  const ledger = K.systemMatter(w);
  return {
    t: w.t,
    pop,
    roles,
    hunters: hunters.length,
    hunterEnergy: mean(hunters.map(e => (e.cargo.energy || 0) / Math.max(1, K.__test.caps(e).energy))),
    grazer: {
      n: grazers.length,
      depth: mean(grazers.map(e => e.y)),
      lipidFill: mean(grazers.map(e => (e.cargo.lipids || 0) / Math.max(1, K.__test.caps(e).lipids))),
      energyFill: mean(grazers.map(e => (e.cargo.energy || 0) / Math.max(1, K.__test.caps(e).energy))),
      oxygenFill: mean(grazers.map(e => (e.oxygen || 0) / Math.max(1, K.__test.caps(e).oxygen))),
      feeding: mean(grazers.map(e => e.feedIntent ? 1 : 0))
    },
    matter: fieldMatter(w),
    systemMatter: ledger.total,
    cargoMatter: ledger.cargo,
    bodyMatter: ledger.body,
    fields: w.fields.length,
    fieldByResource,
    fieldByDepth,
    ephemeris: K.ecologyEphemerisSnapshot(w)
  };
}

function peaks(rows, key, prominence = 1.5) {
  const out = [];
  for (let i = 2; i < rows.length - 2; i++) {
    const v = rows[i][key];
    if (v >= rows[i - 1][key] && v > rows[i + 1][key]
      && v - Math.min(rows[i - 2][key], rows[i + 2][key]) >= prominence) {
      if (!out.length || rows[i].t - out.at(-1).t >= 6) out.push({ t: rows[i].t, value: v });
    }
  }
  return out;
}

function run(mode, seed) {
  const started = performance.now();
  const w = K.createEcologyWorld({
    seed,
    ecologyEphemerisMode: mode,
    ecologyRegime: ECOLOGY_REGIME,
    params: PARAMS,
    ecologyTuning: {
      predatorEphemerisHorizon: HORIZON,
      predatorEphemerisGain: GAIN,
      predatorEphemerisFissionGain: FISSION_GAIN,
      predatorEphemerisEventGain: EVENT_GAIN
    }
  });
  const rows = [snap(w)];
  const events = { fissions: 0, predIn: 0, predOut: 0, deaths: 0 };
  const frames = Math.round(SECONDS / DT);
  const sampleEvery = Math.max(1, Math.round(1 / DT));
  for (let i = 1; i <= frames; i++) {
    K.stepEcology(w, DT);
    for (const event of w.events) {
      if (event.type === 'fission' && HUNTERS.has(event.controller)) events.fissions++;
      if (event.type === 'immigrate' && HUNTERS.has(event.controller)) events.predIn++;
      if (event.type === 'emigrate' && HUNTERS.has(event.controller)) events.predOut++;
      if (event.type === 'death') events.deaths++;
    }
    if (i % sampleEvery === 0) rows.push(snap(w));
  }
  const hs = rows.map(r => r.hunters);
  const ps = peaks(rows, 'hunters');
  const intervals = ps.slice(1).map((p, i) => p.t - ps[i].t);
  const start = rows[0], end = rows.at(-1);
  const drift = {
    algae: (end.pop.algae - start.pop.algae) / Math.max(1, start.pop.algae),
    scavenger: (end.pop.scavenger - start.pop.scavenger) / Math.max(1, start.pop.scavenger),
    hunters: (end.hunters - start.hunters) / Math.max(1, start.hunters),
    matter: (end.matter - start.matter) / Math.max(1, start.matter)
  };
  return {
    mode, seed, runtimeSeconds: (performance.now() - started) / 1000,
    start, end, rows, events,
    hunterMean: mean(hs), hunterMin: Math.min(...hs), hunterMax: Math.max(...hs), hunterCv: cv(hs),
    peaks: ps, intervalMean: mean(intervals), intervalCv: cv(intervals), drift,
    forecast: end.ephemeris
  };
}

const runs = [];
for (const seed of SEEDS) for (const mode of MODES) {
  const result = run(mode, seed);
  runs.push(result);
  const skill = result.forecast?.forecastSkill || {};
  const positive = Object.entries(skill).filter(([, v]) => v > 0).map(([k]) => k);
  console.log(`${mode.padEnd(8)} seed=${seed} runtime=${result.runtimeSeconds.toFixed(1)}s `
    + `hunters=${result.hunterMin}/${result.hunterMean.toFixed(1)}/${result.hunterMax} cv=${result.hunterCv.toFixed(2)} `
    + `fissions=${result.events.fissions} in/out=${result.events.predIn}/${result.events.predOut} `
    + `driver=${(result.forecast?.driver || 0).toFixed(2)} confidence=${(result.forecast?.confidence || 0).toFixed(2)} `
    + `forecast-wins=[${positive.join(',')}]`);
}

const summary = {};
for (const mode of MODES) {
  const rs = runs.filter(r => r.mode === mode);
  summary[mode] = {
    runtimeSeconds: mean(rs.map(r => r.runtimeSeconds)),
    hunterMean: mean(rs.map(r => r.hunterMean)),
    hunterCv: mean(rs.map(r => r.hunterCv)),
    hunterRange: mean(rs.map(r => r.hunterMax - r.hunterMin)),
    peaks: rs.reduce((s, r) => s + r.peaks.length, 0),
    fissions: rs.reduce((s, r) => s + r.events.fissions, 0),
    predIn: rs.reduce((s, r) => s + r.events.predIn, 0),
    predOut: rs.reduce((s, r) => s + r.events.predOut, 0),
    drift: Object.fromEntries(['algae', 'scavenger', 'hunters', 'matter'].map(k => [k, mean(rs.map(r => r.drift[k]))]))
  };
}

console.log('\nSUMMARY');
for (const mode of MODES) console.log(mode.padEnd(8), JSON.stringify(summary[mode]));
const result = { config: { seconds: SECONDS, seeds: SEEDS, dt: DT, horizon: HORIZON, gain: GAIN,
  fissionGain: FISSION_GAIN, eventGain: EVENT_GAIN, ecologyRegime: ECOLOGY_REGIME, params: PARAMS }, summary, runs };
console.log(`RESULT ${JSON.stringify({ config: result.config, summary })}`);
if (OUT) { await writeFile(OUT, JSON.stringify(result, null, 2)); console.log(`wrote ${OUT}`); }
