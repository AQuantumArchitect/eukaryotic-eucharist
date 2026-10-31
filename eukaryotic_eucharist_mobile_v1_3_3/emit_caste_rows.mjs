// EMIT CASTE ROWS — run the player-free ecology under a param set and dump per-timestep, per-caste
// (fill, phase) rows in the shape umwelt's breath_scorer consumes: [{caste: [fill, phase]}, …], where
// fill = self-relative population fullness and phase = ATP/metabolic fill. Transient-trimmed to match
// how score.mjs reads breathing. Used to validate a tuner champion against the authoritative Python
// berry scorer (the JS proxy's ground truth).
//
// Usage: node emit_caste_rows.mjs [seed=11] [seconds=240] [paramsJsonOrPath] [outPath] [transientFrac=0.25]
import * as K from './src/graph_kernel.mjs';
import { deriveCasteSeries } from './src/score.mjs';
import * as fs from 'node:fs';

const a = process.argv.slice(2);
const SEED = Number(a[0] || 11);
const SECONDS = Number(a[1] || 240);
const PARAMS = a[2] ? JSON.parse(a[2].trim().startsWith('{') ? a[2] : fs.readFileSync(a[2], 'utf8')) : undefined;
// a champion.json has {params:{…}}; accept either the bare param map or the whole champion file
const params = PARAMS && PARAMS.params ? PARAMS.params : PARAMS;
const OUT = a[3] || './caste_rows.json';
const TRANSIENT = Number(a[4] ?? 0.25);
const DT = 1 / 60;

const world = K.createEcologyWorld({ seed: SEED, params });
const steps = Math.round(SECONDS / DT);
const sampleEvery = Math.round(1 / DT);   // 1 s
const tape = [];
for (let i = 0; i < steps; i++) {
  K.stepEcology(world, DT);
  if (i % sampleEvery === 0) tape.push({ t: world.t, sig: K.signature(world), world: K.fluxGeneSnapshot(world) });
}
const trimmed = tape.slice(Math.floor(tape.length * TRANSIENT));
const series = deriveCasteSeries(trimmed);          // { caste: {fill:[…], phase:[…], present, maxN} }
const keys = Object.keys(series).filter(k => series[k].present.some(p => p));
const N = trimmed.length;
const rows = [];
for (let i = 0; i < N; i++) {
  const row = {};
  for (const k of keys) row[k] = [series[k].fill[i], series[k].phase[i]];
  rows.push(row);
}
fs.writeFileSync(OUT, JSON.stringify(rows));
console.log(`wrote ${OUT} — ${rows.length} rows × ${keys.length} castes [${keys.join(', ')}]  (seed ${SEED}, ${SECONDS}s, trim ${TRANSIENT})`);
