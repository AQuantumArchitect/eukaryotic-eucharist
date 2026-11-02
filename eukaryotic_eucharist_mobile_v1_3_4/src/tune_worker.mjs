// TUNE WORKER — one worker-thread job = run the player-free ecology under a param set for one seed and
// return the compact SCORE (not the full tape, which would swamp the IPC channel). The main thread's ES
// dispatches many (params, seed) jobs across a pool of these and aggregates.
import { parentPort } from 'node:worker_threads';
import * as K from './graph_kernel.mjs';
import { scoreTape, anatomyAndGate, richRows } from './score.mjs';

const DT = 1 / 60;

function runAndScore({ seed, params, seconds, sampleEverySec, scoreOpts }) {
  const world = K.createEcologyWorld({ seed, params });
  const steps = Math.round(seconds / DT);
  const sampleEvery = Math.max(1, Math.round(sampleEverySec / DT));
  const tape = [];
  let blewUp = false;
  for (let i = 0; i < steps; i++) {
    K.stepEcology(world, DT);
    if (i % sampleEvery === 0) {
      const m = K.systemMatter(world);
      tape.push({ t: world.t, sig: K.signature(world), matter: { total: m.total }, world: K.fluxGeneSnapshot(world) });
      // safety: a pathological param set can balloon entities/fields and make one eval take minutes,
      // stalling the pool. Abort early and let the score's gate reject it — never hang the search.
      const nEnt = world.entities.length, nF = world.fields.length;
      if (nEnt > 4000 || nF > 3000) { blewUp = true; break; }
    }
  }
  if (blewUp || tape.length < 8) {
    return { loss: 11, anatomy: null, breathing: 0, swing: 0, present: 0, reject: blewUp ? 'blowup' : 'short', matterErr: null, periods: [], golden: 0, multiplicity: 0, hasReturns: 0, rows: null };
  }
  // umwelt-native objective: return rich Bloch rows + anatomy/gate; the MAIN thread scores breathing
  // through the umwelt server and combines. (Breathing is deliberately NOT computed in the worker.)
  if (scoreOpts && scoreOpts.objective === 'umwelt') {
    const ag = anatomyAndGate(tape, scoreOpts);
    if (ag.reject) return { reject: ag.reject, anatomy: null, present: ag.present, matterErr: ag.matterErr, rows: null };
    return { reject: null, anatomy: ag.anatomy, present: ag.present, matterErr: ag.matterErr, rows: richRows(tape, { level: scoreOpts.richLevel ?? 4, transientFrac: scoreOpts.transientFrac ?? 0.25 }) };
  }
  const sc = scoreTape(tape, { dt: sampleEverySec, ...scoreOpts });
  // strip the bulky per-caste period arrays before returning; keep the scalar summary
  return {
    loss: sc.loss, anatomy: sc.anatomy, breathing: sc.breathing, swing: sc.swing,
    present: sc.present, reject: sc.reject, matterErr: sc.matterErr,
    periods: sc.breath ? sc.breath.periods.map(p => +p.toFixed(1)) : [],
    golden: sc.breath ? sc.breath.golden : 0, multiplicity: sc.breath ? sc.breath.multiplicity : 0,
    hasReturns: sc.breath ? sc.breath.hasReturns : 0,
  };
}

parentPort.on('message', (job) => {
  try {
    const result = runAndScore(job);
    parentPort.postMessage({ id: job.id, ok: true, result });
  } catch (err) {
    parentPort.postMessage({ id: job.id, ok: false, error: String(err && err.stack || err) });
  }
});
