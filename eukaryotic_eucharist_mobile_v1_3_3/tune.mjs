// TUNE — the Phase-4 outer loop. Searches PARAM_SPEC for a param set whose player-free ecology scores
// BEST under score.mjs (low anatomy distance to the authored target + high genuine breathing, gated on
// matter-health / non-extinction). A (1+λ) evolution strategy in normalised [0,1] param space: mutate
// the incumbent, evaluate λ children in parallel across a worker pool (multiple seeds averaged for
// robustness), keep the best, adapt the step by the 1/5-success rule, and keep a fraction of wide
// "explorer" children because the breathing landscape around the over-damped default is locally flat.
//
// Usage:
//   node tune.mjs [--budget=160] [--children=7] [--seeds=11,23] [--seconds=220] [--sigma=0.12]
//                 [--minutes=90] [--workers=7] [--out=DIR] [--seed=1]
// Writes <out>/champion.json (params + score), <out>/log.jsonl (every candidate), prints progress + a
// final RESULT line. Determinism of the SEARCH itself is seeded by --seed (independent of sim seeds).
import { Worker } from 'node:worker_threads';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as K from './src/graph_kernel.mjs';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const SPEC = K.PARAM_SPEC;
const D = SPEC.length;

// ── args ────────────────────────────────────────────────────────────────────────────────────────────
const A = Object.fromEntries(process.argv.slice(2).map(s => {
  const m = s.match(/^--([^=]+)=(.*)$/); return m ? [m[1], m[2]] : [s.replace(/^--/, ''), true];
}));
const BUDGET = Number(A.budget || 160);
const CHILDREN = Number(A.children || 7);
const SEEDS = String(A.seeds || '11,23').split(',').map(Number);
const SECONDS = Number(A.seconds || 220);
const SAMPLE_S = Number(A.sample || 1);
let SIGMA = Number(A.sigma || 0.12);
const MINUTES = Number(A.minutes || 90);
const WORKERS = Number(A.workers || 7);
const OUT = A.out || path.join(__dir, 'tune_out');
const SEARCH_SEED = Number(A.seed || 1);
fs.mkdirSync(OUT, { recursive: true });
const logStream = fs.createWriteStream(path.join(OUT, 'log.jsonl'), { flags: 'w' });

// ── seeded RNG for the search (independent of the sim's per-run seeds) ────────────────────────────────
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rng = mulberry32(SEARCH_SEED);
function gauss() { let u = 0, v = 0; while (!u) u = rng(); while (!v) v = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

// ── normalised param space ────────────────────────────────────────────────────────────────────────────
const x0 = SPEC.map(s => (s.default - s.lo) / (s.hi - s.lo));
function denorm(x) { const p = {}; for (let i = 0; i < D; i++) p[SPEC[i].name] = SPEC[i].lo + clip01(x[i]) * (SPEC[i].hi - SPEC[i].lo); return p; }
function clip01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
function mutate(x, sigma) { return x.map(v => clip01(v + gauss() * sigma)); }

// ── worker pool ───────────────────────────────────────────────────────────────────────────────────────
const workerUrl = new URL('./src/tune_worker.mjs', import.meta.url);
class Pool {
  constructor(size) {
    this.workers = []; this.idle = []; this.queue = []; this.cbs = new Map(); this.nextId = 1;
    for (let i = 0; i < size; i++) {
      const w = new Worker(workerUrl);
      w.on('message', (msg) => { const cb = this.cbs.get(msg.id); this.cbs.delete(msg.id); this.idle.push(w); this._drain(); cb(msg); });
      w.on('error', (e) => { console.error('worker error', e); });
      this.workers.push(w); this.idle.push(w);
    }
  }
  _drain() { while (this.idle.length && this.queue.length) { const w = this.idle.pop(); const { job, cb } = this.queue.shift(); this.cbs.set(job.id, cb); w.postMessage(job); } }
  run(job) { return new Promise(res => { job.id = this.nextId++; this.queue.push({ job, cb: res }); this._drain(); }); }
  destroy() { for (const w of this.workers) w.terminate(); }
}
const pool = new Pool(WORKERS);
const scoreOpts = { wBreath: 0.6, wSwing: 0.1, transientFrac: 0.25 };

// Evaluate one candidate (normalised x) across all SEEDS, averaged. A REJECT on any seed makes the
// candidate fragile — its loss is the mean (rejects pull it toward REJECT=10), so robust breathers win.
let evalCount = 0;
async function evaluate(x, tag) {
  const params = denorm(x);
  const jobs = SEEDS.map(seed => pool.run({ seed, params, seconds: SECONDS, sampleEverySec: SAMPLE_S, scoreOpts }));
  const msgs = await Promise.all(jobs);
  const results = msgs.map(m => m.ok ? m.result : { loss: 12, reject: 'error', anatomy: null, breathing: 0, swing: 0, present: 0 });
  const mean = k => results.reduce((s, r) => s + (r[k] ?? 0), 0) / results.length;
  const loss = mean('loss');
  const agg = {
    tag, evalN: ++evalCount, loss, anatomy: mean('anatomy'), breathing: mean('breathing'), swing: mean('swing'),
    present: mean('present'), golden: mean('golden'), multiplicity: mean('multiplicity'), hasReturns: mean('hasReturns'),
    rejects: results.filter(r => r.reject).map(r => r.reject), perSeed: results.map(r => ({ loss: +(+r.loss).toFixed(3), br: +(+r.breathing).toFixed(3), an: r.anatomy == null ? null : +(+r.anatomy).toFixed(3), rej: r.reject || null })),
    params,
  };
  logStream.write(JSON.stringify(agg) + '\n');
  return agg;
}

// ── the ES ──────────────────────────────────────────────────────────────────────────────────────────
const t0 = Date.now();
function elapsedMin() { return (Date.now() - t0) / 60000; }
function fmt(a) { return `loss=${a.loss.toFixed(3)} anat=${num(a.anatomy)} breath=${num(a.breathing)} swing=${num(a.swing)} present=${a.present.toFixed(1)}${a.rejects.length ? ' rej=' + a.rejects.join('/') : ''}`; }
function num(v) { return v == null ? 'n/a' : (+v).toFixed(3); }

let parent0Loss = 0;
function writeChampion(c, x) {
  fs.writeFileSync(path.join(OUT, 'champion.json'), JSON.stringify({
    score: { loss: c.loss, anatomy: c.anatomy, breathing: c.breathing, swing: c.swing, present: c.present, golden: c.golden, multiplicity: c.multiplicity, hasReturns: c.hasReturns, perSeed: c.perSeed },
    baselineLoss: parent0Loss, seeds: SEEDS, seconds: SECONDS, params: denorm(x),
    changedFromDefault: SPEC.map((s, i) => ({ s, i })).filter(({ i }) => Math.abs(x[i] - x0[i]) > 1e-4)
      .map(({ s, i }) => ({ name: s.name, default: s.default, tuned: +(s.lo + clip01(x[i]) * (s.hi - s.lo)).toFixed(5) })),
  }, null, 2));
}

const run = async () => {
  console.log(`TUNE start — D=${D} params, seeds=[${SEEDS}], ${SECONDS}s/run, children=${CHILDREN}, budget=${BUDGET}, workers=${WORKERS}`);
  let parent = await evaluate(x0, 'default');       // the default is both the anchor and the first incumbent
  parent0Loss = parent.loss;
  let parentX = x0.slice();
  let champion = parent, championX = x0.slice();
  writeChampion(champion, championX);
  console.log(`gen 0  DEFAULT   ${fmt(parent)}`);

  let gen = 0;
  while (evalCount < BUDGET && elapsedMin() < MINUTES) {
    gen++;
    const childrenX = [];
    for (let i = 0; i < CHILDREN; i++) {
      const explore = i < Math.ceil(CHILDREN * 0.25);         // ~25% wide explorers
      childrenX.push(mutate(parentX, explore ? SIGMA * 2.5 : SIGMA));
    }
    const kids = await Promise.all(childrenX.map((x, i) => evaluate(x, `g${gen}c${i}`)));
    let improved = 0, bestKid = null, bestKidX = null;
    for (let i = 0; i < kids.length; i++) {
      if (kids[i].loss < parent.loss) improved++;
      if (!bestKid || kids[i].loss < bestKid.loss) { bestKid = kids[i]; bestKidX = childrenX[i]; }
    }
    // (1+λ) selection: adopt the best child only if it beats the incumbent
    if (bestKid.loss < parent.loss) { parent = bestKid; parentX = bestKidX; }
    if (bestKid.loss < champion.loss) { champion = bestKid; championX = bestKidX; writeChampion(champion, championX); }
    // 1/5-success rule for the step size
    const successRate = improved / CHILDREN;
    if (successRate > 0.2) SIGMA = Math.min(0.4, SIGMA * 1.5); else SIGMA = Math.max(0.02, SIGMA * 0.85);
    console.log(`gen ${gen}  best-kid ${fmt(bestKid)}  | incumbent loss=${parent.loss.toFixed(3)} champ=${champion.loss.toFixed(3)} sigma=${SIGMA.toFixed(3)} succ=${(successRate * 100).toFixed(0)}% evals=${evalCount} ${elapsedMin().toFixed(1)}min`);
  }

  writeChampion(champion, championX);
  const improvePct = ((parent0Loss - champion.loss) / parent0Loss * 100);
  console.log(`\nTUNE done — ${evalCount} evals, ${gen} gens, ${elapsedMin().toFixed(1)}min`);
  console.log(`baseline(default) loss=${parent0Loss.toFixed(4)}  →  champion loss=${champion.loss.toFixed(4)}  (${improvePct.toFixed(1)}% better)`);
  console.log(`champion: ${fmt(champion)}`);
  console.log(`champion breathing detail: golden=${num(champion.golden)} mult=${num(champion.multiplicity)} returns=${num(champion.hasReturns)}`);
  console.log('RESULT ' + JSON.stringify({ evals: evalCount, gens: gen, baselineLoss: +parent0Loss.toFixed(4), championLoss: +champion.loss.toFixed(4), improvePct: +improvePct.toFixed(1), championAnatomy: +(+champion.anatomy).toFixed(4), championBreathing: +(+champion.breathing).toFixed(4), out: OUT }));
  logStream.end();
  pool.destroy();
};

run().catch(e => { console.error(e); pool.destroy(); process.exit(1); });
