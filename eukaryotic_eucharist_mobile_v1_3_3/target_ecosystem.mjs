// TARGET ECOSYSTEM — the "feels-good" eukaryotic-eucharist ecology, authored as a SpaceWheat-style cluster
// of caste-icons. Each caste is an icon positioned by its signature vector (population, depth band, HP/ATP
// fill) and given an intended BREATHING cycle. The cycles sit on a GOLDEN-RATIO period ladder
// (T0/φ, T0, T0·φ, T0·φ², T0·φ³) — a maximally non-resonant (KAM) set that never phase-locks into a brittle
// resonance: "many stable cycles of different varieties at golden ratios of each other."
//
// This is the ANATOMY + intended CYCLE STRUCTURE half of the auto-tuning objective (Phase 3). Phase 4 scores
// a run's signature() against targetSignature() (anatomy distance) and feeds previewCycleRows()/a run's own
// caste timeseries through umwelt's berry breath-scorer (breathing), gated on matter closure.
//
// Depths are px (WORLD.h = 7840, canopy ≈ 220). Icons are bare codepoints (SpaceWheat convention).
// CLI:  node target_ecosystem.mjs                 # print the cluster + golden-ratio report
//       node target_ecosystem.mjs --emit-rows f.json [seconds] [dt]   # dump cycle rows for the berry scorer

import * as fs from 'node:fs';

export const PHI = (1 + Math.sqrt(5)) / 2;            // 1.618033988749895
export const WORLD_H = 7840;                          // for depth normalization (kept local so this file is import-light)
const T0 = 40;                                        // fundamental breathing period (seconds) — the ladder's rung 0

// The authored cluster. baseFill = intended mean population/ATP fill (0..1) the caste "sits" at; ampFill = the
// oscillation half-amplitude of that fill; period = intended cycle length (s). Steady base castes carry a tiny
// amp (they are the calm floor the breathers ride on). `rung` records the golden-ratio ladder position.
export const TARGET = Object.freeze({
  name: 'EukaryoticEucharist',
  description: 'A depth-stratified microbial column: a calm photosynthetic canopy and a toxic deep floor, with '
    + 'grazers, scavengers and predators breathing between them at golden-ratio periods.',
  fundamentalPeriod: T0,
  castes: Object.freeze([
    // caste key (signature key)     icon  n   depth  hp    en    baseFill amp   period      rung
    row('photosynthetic_bloom',     '\u{1F33F}', 75,  450, 0.75, 0.05, 0.80, 0.03, T0,          'steady'),
    row('fat_grazer',               '\u{1F7E1}', 28, 1700, 0.75, 0.22, 0.55, 0.28, T0,          '0'),
    row('anaerobic_scavenger',      '\u{1F9A0}', 12, 2300, 0.45, 0.08, 0.35, 0.32, T0 / PHI,    '-1'),
    row('aerobic_wall',             '\u{1F9F1}', 10, 2800, 0.68, 0.10, 0.45, 0.22, T0 * PHI,    '+1'),
    row('deep_toxic_bloom',         '\u{2620}',  16, 4000, 0.35, 0.90, 0.85, 0.05, T0,          'steady'),
    row('deep_predator',            '\u{1F988}',  5, 5000, 0.85, 0.25, 0.40, 0.26, T0 * PHI ** 2, '+2'),
    row('abyssal_scavenger',        '\u{1FABC}',  2, 6700, 0.80, 0.06, 0.30, 0.24, T0 * PHI ** 3, '+3'),
  ]),
});

function row(caste, icon, n, depth, hpFill, energyFill, baseFill, ampFill, period, rung) {
  return Object.freeze({ caste, icon, n, depth, hpFill, energyFill, baseFill, ampFill, period, rung });
}

// ── Anatomy: the target as a signature()-shaped object (means; sds left small/authored) ──────────────
export function targetSignature() {
  const out = {};
  for (const c of TARGET.castes) {
    out[c.caste] = {
      n: c.n,
      hpFill: { mean: c.hpFill, sd: 0 },
      energyFill: { mean: c.energyFill, sd: 0 },
      depth: { mean: c.depth, sd: 0 },
    };
  }
  return out;
}

// Distance from a run's signature() to the target (0 = perfect). Per target caste, a weighted blend of
// population-share error, depth-band error (÷WORLD_H), and HP/ATP-fill error; a caste the run never grows is a
// full miss. Extra castes in the run add a small clutter penalty. Documented + reweightable for Phase 4.
export function signatureDistance(runSig, target = TARGET, opts = {}) {
  const { wPop = 1.0, wDepth = 1.0, wFill = 0.5, missPenalty = 1.0, clutterPenalty = 0.15, worldH = WORLD_H } = opts;
  let acc = 0;
  const targetKeys = new Set(target.castes.map(c => c.caste));
  for (const c of target.castes) {
    const s = runSig[c.caste];
    if (!s || !s.n) { acc += missPenalty; continue; }
    const popErr = Math.min(1, Math.abs(s.n - c.n) / Math.max(4, c.n));
    const depthErr = Math.min(1, Math.abs((s.depth?.mean ?? 0) - c.depth) / worldH);
    const hpErr = Math.abs((s.hpFill?.mean ?? 0) - c.hpFill);
    const enErr = Math.abs((s.energyFill?.mean ?? 0) - c.energyFill);
    acc += (wPop * popErr + wDepth * depthErr + wFill * 0.5 * (hpErr + enErr)) / (wPop + wDepth + wFill);
  }
  let dist = acc / target.castes.length;
  // clutter: run castes with real population that the target doesn't ask for
  for (const k in runSig) if (!targetKeys.has(k) && (runSig[k]?.n || 0) > 2) dist += clutterPenalty / target.castes.length;
  return dist;
}

// ── Cycle structure: per-caste (fill, phase) rows realizing the authored breathing, for the berry scorer ──
// fill(t) oscillates about baseFill at the caste's period; phase(t) co-oscillates a quarter-turn out (a Lissajous
// Bloch loop) so the berry tape sees a genuine cycle. This is the intended target breathing, not a sim run.
export function previewCycleRows({ seconds = 400, dt = 1 } = {}) {
  const steps = Math.round(seconds / dt);
  const rows = [];
  for (let i = 0; i < steps; i++) {
    const t = i * dt;
    const row = {};
    for (const c of TARGET.castes) {
      const w = 2 * Math.PI / c.period;
      const fill = clamp01(c.baseFill + c.ampFill * Math.sin(w * t));
      const phase = clamp01(0.5 + 0.5 * Math.sin(w * t + Math.PI / 2));
      row[c.caste] = [fill, phase];
    }
    rows.push(row);
  }
  return rows;
}

// The distinct breathing periods and their pairwise ratios vs φ^k — proof the ladder is golden.
export function goldenRatioReport() {
  const breathers = TARGET.castes.filter(c => c.rung !== 'steady');
  const periods = [...new Set(breathers.map(c => +c.period.toFixed(4)))].sort((a, b) => a - b);
  const pairs = [];
  for (let i = 0; i < periods.length; i++) for (let j = i + 1; j < periods.length; j++) {
    const ratio = periods[j] / periods[i];
    const rungs = Math.log(ratio) / Math.log(PHI);
    const k = Math.round(rungs);
    pairs.push({ lo: periods[i], hi: periods[j], ratio: +ratio.toFixed(4), phiRungs: +rungs.toFixed(3), golden: k >= 1 && Math.abs(rungs - k) < 0.06 });
  }
  return { periods, pairs, allGolden: pairs.every(p => p.golden) };
}

// ── Round-trip: author → JSON → reload (identical) ───────────────────────────────────────────────────
export function serialize() { return JSON.stringify({ ...TARGET, castes: TARGET.castes }, null, 2); }
export function load(json) { const o = typeof json === 'string' ? JSON.parse(json) : json; return { ...o, castes: o.castes.map(c => ({ ...c })) }; }

function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }

// ── CLI ──────────────────────────────────────────────────────────────────────────────────────────────
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const emitIdx = args.indexOf('--emit-rows');
  if (emitIdx >= 0) {
    const out = args[emitIdx + 1];
    const seconds = Number(args[emitIdx + 2] || 400), dt = Number(args[emitIdx + 3] || 1);
    fs.writeFileSync(out, JSON.stringify(previewCycleRows({ seconds, dt })));
    console.log(`wrote ${out} — ${Math.round(seconds / dt)} rows of intended cycle (fill,phase) per caste`);
  } else {
    console.log(`TARGET: ${TARGET.name} — ${TARGET.castes.length} caste-icons, T0=${T0}s\n`);
    console.log('icon caste'.padEnd(28), 'n'.padStart(4), 'depth'.padStart(6), 'hp'.padStart(5), 'en'.padStart(5), 'period'.padStart(8), 'rung'.padStart(7));
    for (const c of TARGET.castes) {
      console.log((c.icon + '  ' + c.caste).padEnd(28), String(c.n).padStart(4), String(c.depth).padStart(6),
        c.hpFill.toFixed(2).padStart(5), c.energyFill.toFixed(2).padStart(5), c.period.toFixed(1).padStart(8), String(c.rung).padStart(7));
    }
    const gr = goldenRatioReport();
    console.log(`\nGolden-ratio ladder: periods = [${gr.periods.map(p => p.toFixed(1)).join(', ')}]  allGolden=${gr.allGolden}`);
    for (const p of gr.pairs) console.log(`  ${p.lo.toFixed(1)} : ${p.hi.toFixed(1)}  ratio ${p.ratio}  = φ^${p.phiRungs}  ${p.golden ? '✓ golden' : '·'}`);
    // round-trip self-check
    const rt = load(serialize());
    console.log(`\nround-trip: ${rt.castes.length === TARGET.castes.length && rt.name === TARGET.name ? 'OK' : 'FAIL'}`);
  }
}
