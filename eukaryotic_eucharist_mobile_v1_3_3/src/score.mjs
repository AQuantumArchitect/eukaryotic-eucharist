// SCORE — the Phase-4 objective. Turns a run's signature-tape (from run_sim.mjs or an in-process
// stepEcology loop) into a scalar LOSS that the outer tuner minimises. Three parts, per the plan:
//
//   1. ANATOMY   — signatureDistance() from the run's (back-half, time-averaged) signature to the
//                  authored TARGET cluster. 0 = the right creatures in the right neighbourhoods.
//   2. BREATHING — a fast, dependency-free proxy of umwelt's berry breath-scorer: reward MANY stable
//                  cycles of different varieties at GOLDEN-RATIO periods; punish flat (no motion) and
//                  runaway (no returns). Mirrors the umwelt composite so the JS search loop and the
//                  authoritative Python scorer agree on ranking:
//                    breathing = (1-flatness) * (0.30*hasReturns + 0.30*multiplicity + 0.40*golden)
//   3. GATE      — hard matter-closure + non-extinction reject (loss = REJECT).
//
// loss = anatomy + wBreath*(1 - breathing), or REJECT if the gate trips. Lower is better.
// The breathing proxy is intentionally lean (per-caste Goertzel spectra + golden-pair counting) so the
// optimiser can call it thousands of times; the champion is re-scored against umwelt at the end.

import { TARGET, PHI, signatureDistance } from '../target_ecosystem.mjs';

export const REJECT = 10;                 // loss for a run that fails the hard gate
const WORLD_H = 7840;

// ── Rich (membrane-full) Bloch rows for the umwelt breath-scorer ─────────────────────────────────────
// "Connect umwelt more richly": instead of one (popFill, ATP-phase) channel per caste, lift the whole
// body-state onto the Bloch sphere — population, VITALITY (hp), and DEPTH migration, each riding that
// caste's ATP metabolic phase, optionally radius-weighted by ATP-cohort PURITY (tight cohort → coherent
// vector). This richer joint trajectory is what makes umwelt's verdict robust and hard to game (a single
// population hump can't fake a joint pop+hp+depth cycle). Returns [{key:[fill,phase(,purity)]}, …].
//   level 1: population only · 2: +vitality · 3: +depth · 4: +cohort purity (3rd Bloch-radius term)
export function richRows(tape, { level = 4, transientFrac = 0.25 } = {}) {
  const trimmed = tape.slice(Math.floor(tape.length * transientFrac));
  const maxN = {};
  for (const row of trimmed) for (const k in row.sig) maxN[k] = Math.max(maxN[k] || 0, row.sig[k].n);
  const present = Object.keys(maxN).filter(k => maxN[k] > 2);
  const rows = [];
  for (const row of trimmed) {
    const r = {};
    for (const k of present) {
      const s = row.sig[k]; if (!s) continue;
      const pop = s.n / Math.max(1, maxN[k]);
      const atp = s.energyFill?.mean ?? 0;
      const hp = s.hpFill?.mean ?? 0;
      const z = (s.depth?.mean ?? 0) / WORLD_H;
      const pur = level >= 4 ? clamp01(1 - (s.energyFill?.sd ?? 0)) : null;
      const pair = (a, b) => pur == null ? [a, b] : [a, b, pur];
      r[k] = pair(pop, atp);
      if (level >= 2) r[k + '|hp'] = pair(hp, atp);
      if (level >= 3) r[k + '|z'] = pair(z, atp);
    }
    // OPEN-PREDATOR FLUX + GENETIC channels (if the tape carries them): the predator boundary flux and the
    // genetic composition of the standing pool breathe on their OWN — an evolutionary layer over the
    // population breathing. flux: fill=immigration, phase=emigration (a lagged in/out loop). Per trait:
    // fill=population mean, phase=SELECTION (resident−arriving, recentred) → a trait sweeping in then being
    // selected against traces a Bloch loop. div: fill=genetic diversity, phase=net flux.
    const w = row.world;
    if (w) {
      r['__predFlux'] = [clamp01(w.predIn / 0.6), clamp01(w.predOut / 0.6)];
      for (const k of ['ferocity', 'thrift', 'roam']) r['__gene.' + k] = [clamp01(w.gene.popMean[k]), clamp01(0.5 + w.gene.selection[k] * 5)];
      const div = (w.gene.popVar.ferocity + w.gene.popVar.thrift + w.gene.popVar.roam) / 3;
      r['__geneDiv'] = [clamp01(div * 12), clamp01(0.5 + w.predNet * 2)];
    }
    rows.push(r);
  }
  return rows;
}

// ── Per-caste timeseries: population fill (self-relative) + metabolic phase (ATP fill) ──────────────
// Bloch intent: θ ← population fill, φ ← ATP/metabolic phase. A genuine breather traces a LOOP in the
// (fill, phase) plane (they lag, like predator/prey), so the enclosed area certifies a real cycle —
// not a 1-D wobble. Returns { caste: {fill:[…], phase:[…], present:[…], maxN} } over all samples.
export function deriveCasteSeries(tape) {
  const keys = new Set();
  for (const row of tape) for (const k in row.sig) keys.add(k);
  const series = {};
  for (const k of keys) {
    const fillRaw = [], phase = [], present = [];
    let maxN = 0;
    for (const row of tape) {
      const s = row.sig[k];
      const n = s ? s.n : 0;
      if (n > maxN) maxN = n;
      fillRaw.push(n);
      phase.push(s ? (s.energyFill?.mean ?? 0) : 0);
      present.push(n > 2 ? 1 : 0);
    }
    const fill = fillRaw.map(n => n / Math.max(1, maxN));   // self-relative population fullness 0..1
    series[k] = { fill, phase, present, maxN };
  }
  return series;
}

// ── Cycle analysis of one series via autocorrelation ────────────────────────────────────────────────
// A genuine oscillation RETURNS to itself: its normalised autocorrelation shows LOCAL MAXIMA at the
// period (and its multiples). A runaway/monotone trend has a strictly DECAYING autocorrelation with no
// peak, so it correctly scores zero returns — the failure mode a raw DFT (which leaks a trend into
// spurious "periods") could not reject. Peaks must also fit ≥`minCycles` full cycles in the window, so
// a period near the window length (a trend masquerading as one slow cycle) is not counted.
// Returns { amp, flat, periods:[{P, r}], returns } where r∈[0,1] is the autocorrelation return strength.
function analyseCycle(fill, dt, { pMin = 4, ampRef = 0.15, minCycles = 2.5, rMin = 0.3 } = {}) {
  const N = fill.length;
  const amp = std(fill);                                   // swing amplitude of the population fill
  if (N < 12 || amp < 1e-4) return { amp, flat: 1 - clamp01(amp / ampRef), periods: [], returns: 0 };
  const mean = fill.reduce((a, b) => a + b, 0) / N;
  const x = fill.map(v => v - mean);                       // detrend
  const denom = x.reduce((s, v) => s + v * v, 0) || 1e-9;
  const lagMax = Math.min(N - 3, Math.floor(N / minCycles)); // a period must fit ≥minCycles cycles
  const lagMin = Math.max(2, Math.round(pMin / dt));
  const r = new Array(lagMax + 1).fill(0);
  for (let L = lagMin; L <= lagMax; L++) {
    let s = 0; for (let n = 0; n + L < N; n++) s += x[n] * x[n + L];
    r[L] = s / denom;
  }
  // local maxima above rMin → candidate periods, strongest return first
  const peaks = [];
  for (let L = lagMin + 1; L < lagMax; L++) {
    if (r[L] > rMin && r[L] >= r[L - 1] && r[L] >= r[L + 1]) peaks.push({ P: L * dt, r: r[L] });
  }
  peaks.sort((a, b) => b.r - a.r);
  const kept = [];
  for (const pk of peaks) { if (!kept.some(k => Math.abs(k.P - pk.P) / k.P < 0.15)) kept.push(pk); if (kept.length >= 3) break; }
  const returns = kept.length ? kept[0].r : 0;             // strength of the best genuine return
  return { amp, flat: 1 - clamp01(amp / ampRef), periods: kept, returns };
}

// ── Golden-ratio structure over a set of distinct periods ───────────────────────────────────────────
// Fraction of period pairs whose ratio ≈ φ^k (k≥1) within tolerance — the KAM/golden-ladder reward.
function goldenScore(periods, tol = 0.06) {
  if (periods.length < 2) return 0;
  let golden = 0, pairs = 0;
  for (let i = 0; i < periods.length; i++) for (let j = i + 1; j < periods.length; j++) {
    pairs++;
    const ratio = periods[j] / periods[i];
    const rungs = Math.log(ratio) / Math.log(PHI);
    const k = Math.round(rungs);
    if (k >= 1 && Math.abs(rungs - k) < tol) golden++;
  }
  return pairs ? golden / pairs : 0;
}

// Cluster nearby periods (within relTol) into distinct cycle families.
function clusterPeriods(periods, relTol = 0.12) {
  const sorted = [...periods].sort((a, b) => a - b);
  const out = [];
  for (const P of sorted) { if (!out.some(q => Math.abs(q - P) / q < relTol)) out.push(P); }
  return out;
}

// ── The breathing proxy: composite over all active castes ───────────────────────────────────────────
// `breathing` is the STRICT, umwelt-matching composite (product form): it is ~0 unless castes genuinely
// return to themselves, so a non-cyclic drift scores 0 — this is the number we report and validate
// against the Python berry scorer. `swing` is a separate, always-defined liveliness measure (mean
// non-flatness) the SEARCH loss uses as a faint gradient toward oscillatory regimes, since the local
// landscape around the over-damped default is flat in `breathing` (nothing to climb by small steps).
export function breathingScore(series, dt, opts = {}) {
  const { targetBreathers = TARGET.castes.filter(c => c.rung !== 'steady').length, ampRef = 0.15 } = opts;
  const active = Object.keys(series).filter(k => series[k].present.some(p => p) );
  if (!active.length) return { breathing: 0, swing: 0, flatness: 1, hasReturns: 0, multiplicity: 0, golden: 0, periods: [] };
  let flatSum = 0, swingSum = 0, retSum = 0, retCount = 0;
  const allPeriods = [];
  for (const k of active) {
    const s = series[k];
    const a = analyseCycle(s.fill, dt, opts);
    flatSum += a.flat;
    swingSum += clamp01(a.amp / ampRef);
    if (a.flat < 0.7 && a.periods.length && a.returns > 0) { // a genuinely breathing caste (returns to itself)
      retSum += a.returns; retCount++;
      for (const pk of a.periods.slice(0, 2)) allPeriods.push(pk.P);
    }
  }
  const flatness = flatSum / active.length;
  const swing = swingSum / active.length;
  const distinct = clusterPeriods(allPeriods);
  const hasReturns = retCount ? retSum / retCount : 0;
  const multiplicity = clamp01(distinct.length / Math.max(1, targetBreathers));
  const golden = goldenScore(distinct);
  const breathing = (1 - flatness) * (0.30 * hasReturns + 0.30 * multiplicity + 0.40 * golden);
  return { breathing, swing, flatness, hasReturns, multiplicity, golden, periods: distinct };
}

// ── Anatomy: back-half time-averaged signature → distance to TARGET ─────────────────────────────────
export function aggregateSignature(tape, fromFrac = 0.5) {
  const start = Math.floor(tape.length * fromFrac);
  const slice = tape.slice(start);
  const acc = {};
  for (const row of slice) {
    for (const k in row.sig) {
      const s = row.sig[k];
      const a = acc[k] || (acc[k] = { n: 0, hp: 0, en: 0, y: 0, c: 0 });
      a.n += s.n; a.hp += s.hpFill?.mean ?? 0; a.en += s.energyFill?.mean ?? 0; a.y += s.depth?.mean ?? 0; a.c++;
    }
  }
  const out = {};
  for (const k in acc) {
    const a = acc[k];
    out[k] = { n: a.n / a.c, hpFill: { mean: a.hp / a.c }, energyFill: { mean: a.en / a.c }, depth: { mean: a.y / a.c } };
  }
  return out;
}

// ── Matter-health gate ──────────────────────────────────────────────────────────────────────────────
// Total matter here is NOT a strict invariant: energy/toxins are minted by photosynthesis and decay, and
// the reset-crab is a deliberate sink (swallowed matter leaves the system). So a healthy run PLATEAUS at
// a bounded level — it neither COLLAPSES to zero (starved/crashed ecology) nor climbs UNBOUNDED
// (production outrunning consumption). The gate rejects only those two pathologies (and NaN), not the
// normal bounded drift of a crab cycle. `err` is the max fractional excursion from the start level.
function matterClosure(tape) {
  if (!tape.length) return { ok: false, err: 1 };
  const totals = tape.map(r => r.matter?.total ?? NaN);
  const first = totals[0];
  if (!totals.every(isFinite) || !(first > 0)) return { ok: false, err: 1 };
  const lo = Math.min(...totals), hi = Math.max(...totals);
  const collapsed = lo < 0.15 * first;                   // ecology starved to near-nothing
  const runaway = hi > 3.0 * first;                      // production runaway
  const err = Math.max(hi - first, first - lo) / first;
  return { ok: !collapsed && !runaway, err, collapsed, runaway };
}

// Anatomy + the hard gate ONLY (breathing supplied externally, e.g. by the umwelt server). Returns a
// reject reason or {anatomy, present, matterErr}. Used by the umwelt-native tuner path.
export function anatomyAndGate(tape, opts = {}) {
  const { minCastesFrac = 0.5 } = opts;
  const mc = matterClosure(tape);
  const aggSig = aggregateSignature(tape);
  const targetKeys = TARGET.castes.map(c => c.caste);
  const present = targetKeys.filter(k => (aggSig[k]?.n || 0) > 2).length;
  if (!mc.ok) return { reject: mc.collapsed ? 'collapse' : mc.runaway ? 'runaway' : 'matter', matterErr: mc.err, present };
  if (present < minCastesFrac * targetKeys.length) return { reject: 'extinction', present, matterErr: mc.err };
  return { reject: null, anatomy: signatureDistance(aggSig, TARGET), present, matterErr: mc.err };
}

// ── The objective ───────────────────────────────────────────────────────────────────────────────────
export function scoreTape(tape, opts = {}) {
  const { dt = 1, wBreath = 0.6, wSwing = 0.1, transientFrac = 0.25, minCastesFrac = 0.5 } = opts;
  const mc = matterClosure(tape);
  const aggSig = aggregateSignature(tape);
  const targetKeys = TARGET.castes.map(c => c.caste);
  const present = targetKeys.filter(k => (aggSig[k]?.n || 0) > 2).length;
  if (!mc.ok) return { loss: REJECT, reject: mc.collapsed ? 'collapse' : mc.runaway ? 'runaway' : 'matter', matterErr: mc.err, anatomy: null, breathing: null };
  if (present < minCastesFrac * targetKeys.length) return { loss: REJECT, reject: 'extinction', present, anatomy: null, breathing: null };
  const anatomy = signatureDistance(aggSig, TARGET);
  // breathing/liveliness are read on the transient-trimmed window (the ecology settles from its seeded
  // start over the first ~quarter of the run; cycles, if any, live in the remainder).
  const trimmed = tape.slice(Math.floor(tape.length * transientFrac));
  const series = deriveCasteSeries(trimmed);
  const b = breathingScore(series, dt, opts);
  const loss = anatomy + wBreath * (1 - b.breathing) - wSwing * b.swing;
  return { loss, anatomy, breathing: b.breathing, swing: b.swing, breath: b, matterErr: mc.err, present, reject: null };
}

// ── helpers ──────────────────────────────────────────────────────────────────────────────────────────
function std(a) { const n = a.length; if (!n) return 0; const m = a.reduce((x, y) => x + y, 0) / n; return Math.sqrt(a.reduce((s, x) => s + (x - m) * (x - m), 0) / n); }
function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
