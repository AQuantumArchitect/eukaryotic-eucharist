// TUNE-UMWELT — the Phase-4 outer loop, but the BREATHING half of the objective is the authoritative
// umwelt belief engine itself, connected richly. Each candidate: worker runs the ecology + emits
// membrane-full Bloch rows (population + vitality + depth, ATP-phased, cohort-purity weighted) + JS
// anatomy/gate; the MAIN thread scores those rows through a persistent `breath_server.py` (umwelt
// score_breathing) and combines:  loss = anatomy + wBreath·(1 − umwelt_breathing), gated.
// No hardening, no jitter floors — we optimise what umwelt believes is good and let it emerge.
//
// Usage:
//   node tune_umwelt.mjs [--budget=120] [--children=8] [--seeds=11,23] [--seconds=240] [--sigma=0.14]
//        [--minutes=180] [--workers=7] [--richLevel=4] [--out=DIR] [--seed=1]
//        [--umweltSrc=/…/umwelt-breath/src]
import { Worker } from 'node:worker_threads';
import { spawn } from 'node:child_process';
import * as readline from 'node:readline';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as K from './src/graph_kernel.mjs';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const SPEC = K.PARAM_SPEC;
const D = SPEC.length;

const A = Object.fromEntries(process.argv.slice(2).map(s => { const m = s.match(/^--([^=]+)=(.*)$/); return m ? [m[1], m[2]] : [s.replace(/^--/, ''), true]; }));
const BUDGET = Number(A.budget || 120);
const CHILDREN = Number(A.children || 8);
const SEEDS = String(A.seeds || '11,23').split(',').map(Number);
const SECONDS = Number(A.seconds || 240);
const SAMPLE_S = Number(A.sample || 1);
let SIGMA = Number(A.sigma || 0.14);
const MINUTES = Number(A.minutes || 180);
const WORKERS = Number(A.workers || 7);
const RICH = Number(A.richLevel || 4);
const OUT = A.out || path.join(__dir, 'tune_umwelt_out');
const SEARCH_SEED = Number(A.seed || 1);
const UMWELT_SRC = A.umweltSrc || '/tmp/claude-1000/-home-primearchitect-ws-eukarayotic-eucharist/50bf8b7f-dfd3-42b1-80ff-b61207da3e97/scratchpad/umwelt-breath/src';
fs.mkdirSync(OUT, { recursive: true });
const logStream = fs.createWriteStream(path.join(OUT, 'log.jsonl'), { flags: 'w' });

function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rng = mulberry32(SEARCH_SEED);
function gauss() { let u = 0, v = 0; while (!u) u = rng(); while (!v) v = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

const x0 = SPEC.map(s => (s.default - s.lo) / (s.hi - s.lo));
function denorm(x) { const p = {}; for (let i = 0; i < D; i++) p[SPEC[i].name] = SPEC[i].lo + clip01(x[i]) * (SPEC[i].hi - SPEC[i].lo); return p; }
function clip01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
function mutate(x, sigma) { return x.map(v => clip01(v + gauss() * sigma)); }

// ── persistent umwelt breath-scoring server (serialised request→response by id) ───────────────────────
class Umwelt {
  constructor(src) {
    this.proc = spawn('python3', [path.join(__dir, 'breath_server.py')], { env: { ...process.env, PYTHONPATH: src }, stdio: ['pipe', 'pipe', 'inherit'] });
    this.rl = readline.createInterface({ input: this.proc.stdout });
    this.pending = new Map(); this.nextId = 1; this.q = Promise.resolve();
    this.rl.on('line', (line) => { let m; try { m = JSON.parse(line); } catch { return; } const cb = this.pending.get(m.id); if (cb) { this.pending.delete(m.id); cb(m); } });
  }
  score(rows) { // serialise writes so big JSON lines never interleave on the pipe
    this.q = this.q.then(() => new Promise((res) => {
      const id = this.nextId++;
      this.pending.set(id, res);
      this.proc.stdin.write(JSON.stringify({ id, rows }) + '\n');
    }));
    return this.q;
  }
  destroy() { try { this.proc.stdin.end(); this.proc.kill(); } catch {} }
}
const umwelt = new Umwelt(UMWELT_SRC);

// ── worker pool ───────────────────────────────────────────────────────────────────────────────────────
const workerUrl = new URL('./src/tune_worker.mjs', import.meta.url);
class Pool {
  constructor(size) { this.workers = []; this.idle = []; this.queue = []; this.cbs = new Map(); this.nextId = 1;
    for (let i = 0; i < size; i++) { const w = new Worker(workerUrl); w.on('message', (msg) => { const cb = this.cbs.get(msg.id); this.cbs.delete(msg.id); this.idle.push(w); this._drain(); cb(msg); }); w.on('error', e => console.error('worker error', e)); this.workers.push(w); this.idle.push(w); } }
  _drain() { while (this.idle.length && this.queue.length) { const w = this.idle.pop(); const { job, cb } = this.queue.shift(); this.cbs.set(job.id, cb); w.postMessage(job); } }
  run(job) { return new Promise(res => { job.id = this.nextId++; this.queue.push({ job, cb: res }); this._drain(); }); }
  destroy() { for (const w of this.workers) w.terminate(); }
}
const pool = new Pool(WORKERS);
const scoreOpts = { objective: 'umwelt', richLevel: RICH, transientFrac: 0.25 };
const wBreath = 0.6;
const wVar = Number(A.wVar || 0.4);   // cross-seed consistency: penalise breathing that spikes in one world
                                      // but not others (the seed-overfit failure mode), so robust breathers win.

let evalCount = 0;
async function evaluate(x, tag) {
  const params = denorm(x);
  const jobs = SEEDS.map(seed => pool.run({ seed, params, seconds: SECONDS, sampleEverySec: SAMPLE_S, scoreOpts }));
  const msgs = await Promise.all(jobs);
  const perSeed = [];
  for (const m of msgs) {
    const r = m.ok ? m.result : { reject: 'error' };
    if (r.reject || !r.rows) { perSeed.push({ loss: REJECTVAL, breathing: 0, anatomy: null, reject: r.reject || 'norows', present: r.present ?? 0 }); continue; }
    const b = await umwelt.score(r.rows);
    const breathing = b.breathing ?? 0;
    perSeed.push({ loss: r.anatomy + wBreath * (1 - breathing), breathing, anatomy: r.anatomy, golden: b.golden, multiplicity: b.multiplicity, flatness: b.flatness, present: r.present, reject: null });
  }
  const mean = k => perSeed.reduce((s, r) => s + (r[k] ?? 0), 0) / perSeed.length;
  // cross-seed consistency penalty: std of per-seed breathing (0 if a seed rejected → already REJECTVAL-heavy)
  const brs = perSeed.filter(r => !r.reject).map(r => r.breathing);
  const brMean = brs.length ? brs.reduce((a, b) => a + b, 0) / brs.length : 0;
  const brStd = brs.length > 1 ? Math.sqrt(brs.reduce((s, b) => s + (b - brMean) * (b - brMean), 0) / brs.length) : 0;
  const agg = {
    tag, evalN: ++evalCount, loss: mean('loss') + wVar * brStd, breathStd: brStd, anatomy: mean('anatomy'), breathing: mean('breathing'),
    golden: mean('golden'), multiplicity: mean('multiplicity'), present: mean('present'),
    rejects: perSeed.filter(r => r.reject).map(r => r.reject),
    perSeed: perSeed.map(r => ({ loss: +(+r.loss).toFixed(3), br: +(+r.breathing).toFixed(3), an: r.anatomy == null ? null : +(+r.anatomy).toFixed(3), gold: r.golden == null ? null : +(+r.golden).toFixed(3), rej: r.reject || null })),
    params,
  };
  logStream.write(JSON.stringify(agg) + '\n');
  return agg;
}
const REJECTVAL = 10;

const t0 = Date.now();
const elapsedMin = () => (Date.now() - t0) / 60000;
const num = v => v == null ? 'n/a' : (+v).toFixed(3);
const fmt = a => `loss=${a.loss.toFixed(3)} anat=${num(a.anatomy)} breath=${num(a.breathing)}±${num(a.breathStd)} gold=${num(a.golden)} present=${a.present.toFixed(1)}${a.rejects.length ? ' rej=' + a.rejects.join('/') : ''}`;

let parent0Loss = 0;
function writeChampion(c, x) {
  fs.writeFileSync(path.join(OUT, 'champion.json'), JSON.stringify({
    objective: 'umwelt-rich', richLevel: RICH,
    score: { loss: c.loss, anatomy: c.anatomy, breathing: c.breathing, golden: c.golden, multiplicity: c.multiplicity, present: c.present, perSeed: c.perSeed },
    baselineLoss: parent0Loss, seeds: SEEDS, seconds: SECONDS, params: denorm(x),
    changedFromDefault: SPEC.map((s, i) => ({ s, i })).filter(({ i }) => Math.abs(x[i] - x0[i]) > 1e-4).map(({ s, i }) => ({ name: s.name, default: s.default, tuned: +(s.lo + clip01(x[i]) * (s.hi - s.lo)).toFixed(5) })),
  }, null, 2));
}

const run = async () => {
  console.log(`TUNE-UMWELT — D=${D}, seeds=[${SEEDS}], ${SECONDS}s, richLevel=${RICH}, children=${CHILDREN}, budget=${BUDGET}, workers=${WORKERS}`);
  let parent = await evaluate(x0, 'default'); parent0Loss = parent.loss;
  let parentX = x0.slice(), champion = parent, championX = x0.slice();
  writeChampion(champion, championX);
  console.log(`gen 0  DEFAULT   ${fmt(parent)}`);
  let gen = 0;
  while (evalCount < BUDGET && elapsedMin() < MINUTES) {
    gen++;
    const childrenX = [];
    for (let i = 0; i < CHILDREN; i++) childrenX.push(mutate(parentX, i < Math.ceil(CHILDREN * 0.25) ? SIGMA * 2.5 : SIGMA));
    const kids = await Promise.all(childrenX.map((x, i) => evaluate(x, `g${gen}c${i}`)));
    let improved = 0, bestKid = null, bestKidX = null;
    for (let i = 0; i < kids.length; i++) { if (kids[i].loss < parent.loss) improved++; if (!bestKid || kids[i].loss < bestKid.loss) { bestKid = kids[i]; bestKidX = childrenX[i]; } }
    if (bestKid.loss < parent.loss) { parent = bestKid; parentX = bestKidX; }
    if (bestKid.loss < champion.loss) { champion = bestKid; championX = bestKidX; writeChampion(champion, championX); }
    const succ = improved / CHILDREN;
    SIGMA = succ > 0.2 ? Math.min(0.4, SIGMA * 1.5) : Math.max(0.02, SIGMA * 0.85);
    console.log(`gen ${gen}  best-kid ${fmt(bestKid)}  | champ loss=${champion.loss.toFixed(3)} breath=${num(champion.breathing)} sigma=${SIGMA.toFixed(3)} succ=${(succ * 100).toFixed(0)}% evals=${evalCount} ${elapsedMin().toFixed(1)}min`);
  }
  writeChampion(champion, championX);
  const improvePct = (parent0Loss - champion.loss) / parent0Loss * 100;
  console.log(`\nTUNE-UMWELT done — ${evalCount} evals, ${gen} gens, ${elapsedMin().toFixed(1)}min`);
  console.log(`baseline loss=${parent0Loss.toFixed(4)} (breath ${num(parent.breathing)})  →  champion loss=${champion.loss.toFixed(4)} (breath ${num(champion.breathing)})  (${improvePct.toFixed(1)}% better)`);
  console.log('RESULT ' + JSON.stringify({ evals: evalCount, gens: gen, baselineLoss: +parent0Loss.toFixed(4), championLoss: +champion.loss.toFixed(4), improvePct: +improvePct.toFixed(1), championBreathing: +(+champion.breathing).toFixed(4), championAnatomy: +(+champion.anatomy).toFixed(4), out: OUT }));
  logStream.end(); pool.destroy(); umwelt.destroy();
};
run().catch(e => { console.error(e); pool.destroy(); umwelt.destroy(); process.exit(1); });
