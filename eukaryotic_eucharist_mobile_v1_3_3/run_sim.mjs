// RUN_SIM: the Phase-2 param-injectable headless runner for the auto-tuner.
// Runs the player-free ecology under a PARAM_SPEC override set and emits a compact signature-tape
// (per-sample signature() + systemMatter) plus a determinism hash — the object Phase-4 scoring consumes.
//
// Usage (positional scheme is identical with or without --selftest):
//   node run_sim.mjs [--selftest] [seed=11] [seconds=180] [sampleEverySec=1] [paramsJsonOrPath] [outPath]
//   --selftest runs twice and asserts an identical hash (and refuses an empty tape).
// Prints a one-line RESULT {…} JSON to stdout; writes the full tape to outPath if given.
import * as K from './src/graph_kernel.mjs';
import * as fs from 'node:fs';
import crypto from 'node:crypto';

const argv = process.argv.slice(2);
const selftest = argv[0] === '--selftest';
const a = selftest ? argv.slice(1) : argv;
const SEED = Number(a[0] || 11);
const SECONDS = Number(a[1] || 180);
const SAMPLE_S = Number(a[2] || 1);
const DT = 1 / 60;
if (!(SECONDS > 0) || !(SAMPLE_S > 0)) { console.error(`bad args: seconds=${a[1]} sampleEverySec=${a[2]} (both must be positive numbers)`); process.exit(2); }

function loadParams(arg) {
  if (!arg) return undefined;
  const txt = arg.trim().startsWith('{') ? arg : fs.readFileSync(arg, 'utf8');
  const p = JSON.parse(txt);
  const known = new Set(K.PARAM_SPEC.map(s => s.name));
  const unknown = Object.keys(p).filter(k => !known.has(k));
  if (unknown.length) console.error(`[params] ignoring keys not in PARAM_SPEC: ${unknown.join(', ')}`);
  return p;
}
const PARAMS = loadParams(a[3]);
const OUT = a[4];

// Run the ecology and return { tape, hash }. tape = [{ t, sig, matter }] sampled every SAMPLE_S.
function run() {
  const world = K.createEcologyWorld({ seed: SEED, params: PARAMS });
  const steps = Math.round(SECONDS / DT);
  const sampleEvery = Math.max(1, Math.round(SAMPLE_S / DT));
  const tape = [];
  const h = crypto.createHash('sha256');
  for (let i = 0; i < steps; i++) {
    K.stepEcology(world, DT);
    if (i % sampleEvery === 0) {
      const sig = K.signature(world);
      const m = K.systemMatter(world);
      tape.push({ t: +world.t.toFixed(3), sig, matter: { total: m.total, fields: m.fields, cargo: m.cargo, body: m.body, transit: m.transit }, world: K.fluxGeneSnapshot(world) });
      h.update(JSON.stringify(sig) + '|' + Math.round(m.total));
    }
  }
  return { tape, hash: h.digest('hex'), matterEnd: K.systemMatter(world).total };
}

if (selftest) {
  const r1 = run(), r2 = run();
  const okDet = r1.hash === r2.hash;
  console.log(`SELFTEST ${okDet ? 'OK' : 'FAIL'} — determinism hash ${r1.hash.slice(0, 16)}… ${okDet ? '==' : '!='} ${r2.hash.slice(0, 16)}…`);
  process.exit(okDet ? 0 : 1);
}

const r = run();
if (OUT) fs.writeFileSync(OUT, JSON.stringify({ seed: SEED, seconds: SECONDS, sampleEverySec: SAMPLE_S, params: PARAMS || null, hash: r.hash, tape: r.tape }));
console.log('RESULT ' + JSON.stringify({
  seed: SEED, seconds: SECONDS, samples: r.tape.length, hash: r.hash,
  matterEnd: Math.round(r.matterEnd), castes: r.tape.length ? Object.keys(r.tape[r.tape.length - 1].sig).length : 0,
  out: OUT || null,
}));
