// One-command no-player world health report. Thin orchestrator: it RUNS the existing player-free
// harnesses (sim_eval.mjs for structure, dynamics_lab.mjs for drift/equilibrium), parses their
// machine-readable RESULT lines, and prints a single consolidated verdict. It adds no game rules and
// no new instrumentation — it only composes what the harnesses already measure.
//
// Usage: node ecology_report.mjs [minutes=8] [seeds=5] [dt=.05]
import { execFileSync } from 'node:child_process';

const MINUTES = Number(process.argv[2] || 8);
const SEEDS = Math.max(1, Math.floor(Number(process.argv[3] || 5)));
const DT = Number(process.argv[4] || 0.05);
const SPECIES = ['algae', 'scavenger', 'predator', 'protozoan', 'metazoan'];
const pad = (s, n) => String(s).padEnd(n);
const padL = (s, n) => String(s).padStart(n);
const pct = x => `${(x * 100).toFixed(0)}%`;

function runHarness(file, args) {
  const out = execFileSync('node', [file, ...args.map(String)], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const line = out.trimEnd().split('\n').reverse().find(l => l.startsWith('RESULT '));
  if (!line) throw new Error(`${file}: no RESULT line`);
  return JSON.parse(line.slice('RESULT '.length));
}

console.log(`\n=== ECOLOGY WORLD REPORT (no player) — ${MINUTES}min × ${SEEDS} seeds, dt=${DT} ===`);
console.log('running sim_eval + dynamics_lab …\n');

// sim_eval carries the structural snapshot (start vs compare, acceptance, flux); dynamics_lab
// carries the drift/minute and the quasi-equilibrium candidate. Match their durations/seed counts.
const evalRes = runHarness('sim_eval.mjs', [MINUTES, 0, SEEDS, DT]);
const dynRes = runHarness('dynamics_lab.mjs', [MINUTES, SEEDS, DT]);
const s = evalRes.start, c = evalRes.compare;
const drift = dynRes.endDriftPerMinute || {};

// ── Populations: t=0 → steady, with per-minute drift and a stability tag ──────────────────
console.log('POPULATIONS            t=0    steady   gap    drift/min');
let gapSum = 0, gapN = 0;
for (const sp of SPECIES) {
  const a = s.pop[sp] ?? 0, b = c.pop[sp] ?? 0;
  const gap = a ? (b - a) / a : 0;
  gapSum += Math.abs(gap); gapN++;
  const d = drift[`pop.${sp}`];
  const tag = b < (sp === 'algae' ? 8 : sp === 'scavenger' ? 6 : 1) ? 'COLLAPSE'
    : Math.abs(gap) > 0.5 ? 'drifting' : 'stable';
  console.log(`  ${pad(sp, 18)} ${padL(a.toFixed(0), 5)} ${padL(b.toFixed(1), 8)} ${padL(pct(gap), 7)} ${padL(d == null ? '—' : d.toFixed(2), 9)}  ${tag}`);
}

// ── Initial-condition fidelity: is t=0 already the steady state? ──────────────────────────
const fidelity = gapN ? gapSum / gapN : 0;
console.log(`\nINITIAL-CONDITION FIDELITY  mean |species gap t=0→steady| = ${pct(fidelity)}  ` +
  `(${fidelity < 0.15 ? 'good — t=0 ≈ steady' : fidelity < 0.35 ? 'fair — some settling' : 'poor — t=0 is not the equilibrium'})`);
const eq = dynRes.equilibrium || {};
console.log(`QUASI-EQUILIBRIUM  candidate t=${eq.t != null ? eq.t.toFixed(0) : '?'}s, ` +
  `normalized drift=${Number.isFinite(eq.norm) ? eq.norm.toFixed(4) : 'n/a (window too short)'}`);

// ── Matter budget + reproduction/migration flux ──────────────────────────────────────────
const fmGap = s.fieldMatter ? (c.fieldMatter - s.fieldMatter) / s.fieldMatter : 0;
console.log(`\nMATTER   field matter ${s.fieldMatter.toFixed(0)} → ${c.fieldMatter.toFixed(0)} (${pct(fmGap)}), fields ${s.fields.toFixed(0)} → ${c.fields.toFixed(0)}`);
console.log(`FLUX     fissions ${JSON.stringify(evalRes.fissions || {})}`);
console.log(`         migration/birth ${JSON.stringify(evalRes.migrations || {})}`);
const deaths = Object.entries(evalRes.deaths || {}).sort((a, b) => b[1] - a[1]).slice(0, 6);
console.log(`         top deaths ${deaths.map(([k, v]) => `${k}=${v}`).join('  ') || '—'}`);

// ── Spatial structure (algae producer shape + hunter stratification) ──────────────────────
console.log(`\nALGAE    size↔depth corr=${(c.sizeDepthCorr ?? 0).toFixed(2)}, small/med/large=${(c.algaeSmall ?? 0).toFixed(0)}/${(c.algaeMedium ?? 0).toFixed(0)}/${(c.algaeLarge ?? 0).toFixed(0)}, ` +
  `bob period=${(evalRes.medianBobPeriod ?? 0).toFixed(0)}s, gas=${pct(c.algaeGasFill ?? 0)}, HP=${pct(c.algaeHpFill ?? 0)}`);
console.log(`HUNTERS  ATP fill=${pct(c.hunterEnergyFill ?? 0)}, depth=${(c.hunterDepth ?? 0).toFixed(0)}±${(c.hunterDepthStd ?? 0).toFixed(0)}, ` +
  `refuge violations: deep-in-light=${(c.deepAboveFourPct ?? 0).toFixed(0)}, tier2-too-shallow=${(c.tier2AboveThirtyFourPct ?? 0).toFixed(0)}`);

// ── Acceptance gate + one-line verdict ────────────────────────────────────────────────────
const acc = evalRes.acceptance || {};
const failed = Object.entries(acc).filter(([, v]) => !v).map(([k]) => k);
console.log(`\nACCEPTANCE  ${failed.length ? `FAIL: ${failed.join(', ')}` : 'all pass'}`);
const collapses = SPECIES.filter(sp => (c.pop[sp] ?? 0) < (sp === 'algae' ? 8 : sp === 'scavenger' ? 6 : 1));
const verdict = collapses.length ? `COLLAPSE in ${collapses.join('/')}`
  : fidelity > 0.35 ? 'LIVELY but t=0 drifts to a different equilibrium — retune initial conditions'
    : failed.length ? 'bounded but fails a structure gate — see ACCEPTANCE'
      : 'bounded, structured, t=0 ≈ steady — healthy froth';
console.log(`VERDICT  ${verdict}`);
console.log(`\nRESULT ${JSON.stringify({ minutes: MINUTES, seeds: SEEDS, dt: DT, fidelity, equilibrium: eq.t, collapses, acceptanceFailed: failed, verdict })}`);
