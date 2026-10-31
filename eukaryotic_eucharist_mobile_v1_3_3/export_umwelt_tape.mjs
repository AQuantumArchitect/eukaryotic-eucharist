// EXPORT UMWELT TAPE: run the player-free ecology and export a timestamped sensor tape (rows.json +
// manifest.json) in the exact wire format umwelt's replay_sensor_batches expects — [ts_iso, sensor_id,
// value_str, null] rows — so the belief-field engine can be fed this sim's history offline.
//
// Two-tier sampling: a coarse tier (guild populations + physiology + matter pools, every COARSE_S) and a
// fine tier (crab-only continuous state, every FINE_S, only while a crab is alive — CRAB_STARVE_LIMIT is
// 90s, so this needs to be dense enough to see the starve-to-departure ramp's shape). crab_alive is NOT
// periodic: it's two exact ground-truth observations (+1 at shroomba_arrive, -1 at shroomba_depart).
//
// CRITICAL: stepEcology clears world.events as its first line every call — the buffer holds only that
// tick's events, never accumulated. We inspect world.events after EVERY stepEcology() call (every 0.05s),
// not just on sampling ticks, or arrive/depart events would be silently missed between samples.
//
// Usage: node export_umwelt_tape.mjs <seed> <targetGenerations=8> [outDir] [paramsJsonOrPath]
//   paramsJsonOrPath: an inline JSON object of PARAM_SPEC overrides, or a path to a .json file of them.
//   Omitted ⇒ default ecology (byte-identical to the pre-Phase-2 exporter).
import * as K from './src/graph_kernel.mjs';
import * as fs from 'node:fs';
import * as path from 'node:path';

const SEED = Number(process.argv[2] || 11);
const TARGET_GENERATIONS = Number(process.argv[3] || 8);
const OUT_DIR = process.argv[4] || `umwelt_data/seed_${SEED}`;
// Optional tuned parameters (Phase-2 auto-tuning seam). Accept inline JSON or a file path.
function loadParams(arg) {
  if (!arg) return undefined;
  const txt = arg.trim().startsWith('{') ? arg : fs.readFileSync(arg, 'utf8');
  const p = JSON.parse(txt);
  const known = new Set(K.PARAM_SPEC.map(s => s.name));
  const unknown = Object.keys(p).filter(k => !known.has(k));
  if (unknown.length) console.error(`[params] ignoring keys not in PARAM_SPEC: ${unknown.join(', ')}`);
  return p;
}
const PARAMS = loadParams(process.argv[5]);

const DT = 0.05;
const COARSE_S = 5;   // guild/physiology/matter cadence
const FINE_S = 2;      // crab-only cadence, while alive
const MAX_SIM_SECONDS = 60 * 60 * 20; // safety circuit-breaker: 20 sim-hours, in case generations never complete

// Same lineage breakdown as burnin.mjs's LINEAGES, plus predator split by trophicRole (skirmisher vs
// aerobic_wall — burnin.mjs doesn't split it, we do, per the plan).
const LINEAGES = {
  algae_surface:         e => e.controller === 'algae' && !e.deepBloom,
  algae_deep_bloom:      e => e.controller === 'algae' && e.deepBloom,
  scavenger_oxic:        e => e.controller === 'scavenger' && e.trophicRole !== 'abyssal_scavenger',
  scavenger_abyssal:     e => e.controller === 'scavenger' && e.trophicRole === 'abyssal_scavenger',
  predator_skirmisher:   e => e.controller === 'predator' && e.trophicRole === 'skirmisher',
  predator_aerobic_wall: e => e.controller === 'predator' && e.trophicRole === 'aerobic_wall',
  protozoan:             e => e.controller === 'protozoan',
  metazoan:              e => e.controller === 'metazoan',
  brood:                 e => e.controller === 'brood',
  swarm_agent:           e => e.controller === 'swarm_agent',
};
const LINEAGE_NAMES = Object.keys(LINEAGES);

// A synthetic monotonic clock (world.t seconds past a fixed epoch), matching the manifold_game convention
// of a synthetic ISO clock driving umwelt's replay — umwelt cares about relative spacing, not real dates.
const EPOCH_S = Date.parse('2026-01-05T00:00:00Z') / 1000;
function tsIso(simSeconds) { return new Date((EPOCH_S + simSeconds) * 1000).toISOString(); }

const rows = [];
function emit(simSeconds, sensorId, value) { rows.push([tsIso(simSeconds), sensorId, String(value), null]); }

const world = K.createEcologyWorld({ seed: SEED, params: PARAMS });
const generations = [];
let genIndex = 0;
let crabAlive = false;
let nextCoarse = 0;
let nextFine = 0;

function sampleCoarse(t) {
  const alive = world.entities.filter(e => e.alive);
  let total = 0;
  for (const name of LINEAGE_NAMES) {
    const g = alive.filter(LINEAGES[name]);
    emit(t, `pop_${name}`, g.length);
    total += g.length;
    let hpSum = 0, hpN = 0, atpSum = 0, atpN = 0;
    for (const e of g) {
      const c = K.__test.caps(e);
      if (c.hp > 0) { hpSum += Math.max(0, Math.min(1, e.hp / c.hp)); hpN++; }
      if (c.energy > 0) { atpSum += Math.max(0, Math.min(1, (e.cargo.energy || 0) / c.energy)); atpN++; }
    }
    if (hpN > 0) emit(t, `hpfill_${name}`, (hpSum / hpN).toFixed(4));
    if (atpN > 0) emit(t, `atpfill_${name}`, (atpSum / atpN).toFixed(4));
  }
  emit(t, 'pop_total', total);
  const m = K.systemMatter(world);
  emit(t, 'matter_fields', m.fields.toFixed(1));
  emit(t, 'matter_cargo', m.cargo.toFixed(1));
  emit(t, 'matter_body', m.body.toFixed(1));
  emit(t, 'matter_transit', m.transit.toFixed(1));
  emit(t, 'matter_total', m.total.toFixed(1));
}

function sampleFine(t) {
  const crab = world.entities.find(e => e.alive && e.controller === 'shroomba');
  if (!crab) return;
  emit(t, 'crab_r', crab.r.toFixed(1));
  emit(t, 'crab_swallowed', crab._swallowed.toFixed(1));
  // Departure is lap/belly-based now (see graph_kernel.mjs updateShroombaBrain) — lap fraction is the
  // meaningful "how close to departure" signal, replacing the old starvation clock.
  emit(t, 'crab_lap_frac', Math.min(1, crab._marchDist / K.WORLD.w).toFixed(4));
}

const PROGRESS_EVERY_S = 300; // wall-visible progress line every 5 sim-minutes, so a long background run stays legible
let nextProgress = 0;

const steps = Math.round(MAX_SIM_SECONDS / DT);
let hitCap = true;
for (let i = 0; i < steps; i++) {
  K.stepEcology(world, DT);
  const t = world.t;

  if (t >= nextProgress) {
    console.log(`  [seed ${SEED}] t=${(t / 60).toFixed(1)}min gen=${genIndex}/${TARGET_GENERATIONS} crabAlive=${crabAlive} rows=${rows.length}`);
    nextProgress = t + PROGRESS_EVERY_S;
  }

  for (const ev of world.events) {
    if (ev.type === 'shroomba_arrive') {
      genIndex += 1;
      generations.push({ index: genIndex, arrive_t: t, arrive_r: ev.r, depart_t: null, swallowed: null });
      crabAlive = true;
      emit(t, 'crab_alive', 1);
      emit(t, 'gen_index', genIndex);
      sampleCoarse(t); // pin an exact snapshot at the precise generation-start instant
    }
    if (ev.type === 'shroomba_depart') {
      const g = generations[generations.length - 1];
      // Departure is lap-or-belly (see updateShroombaBrain) — not distinguished here since 'departed'
      // covers both; the 'unexplained' label below is reserved for the one anomaly this WAS built to
      // catch (a death via some other, undiscovered path).
      if (g) { g.depart_t = t; g.swallowed = ev.swallowed; g.exit = 'departed'; }
      crabAlive = false;
      emit(t, 'crab_alive', -1);
    }
  }

  // Defensive safety net: confirm crabAlive against the actual world state every tick, in case some
  // OTHER death path (not yet discovered/fixed) ends a generation without a shroomba_depart event —
  // this happened once already (ordinary combat damage, since fixed) and corrupted the generations
  // table silently. Never trust the event stream alone for something this load-bearing.
  const crabReallyAlive = world.entities.some(e => e.alive && e.controller === 'shroomba');
  if (crabAlive && !crabReallyAlive) {
    const g = generations[generations.length - 1];
    if (g && g.depart_t === null) { g.depart_t = t; g.exit = 'unexplained'; }
    crabAlive = false;
    emit(t, 'crab_alive', -1);
    console.log(`  [seed ${SEED}] WARNING: crab vanished at t=${t.toFixed(1)}s without a shroomba_depart event (gen ${genIndex}) — recorded as exit:'unexplained'`);
  }

  if (t >= nextCoarse) { sampleCoarse(t); nextCoarse = t + COARSE_S; }
  if (crabAlive && t >= nextFine) { sampleFine(t); nextFine = t + FINE_S; }

  if (genIndex >= TARGET_GENERATIONS && !crabAlive) { hitCap = false; break; }
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'rows.json'), JSON.stringify(rows));

const sensorIds = [
  ...LINEAGE_NAMES.map(n => `pop_${n}`), 'pop_total',
  ...LINEAGE_NAMES.map(n => `hpfill_${n}`), ...LINEAGE_NAMES.map(n => `atpfill_${n}`),
  'matter_fields', 'matter_cargo', 'matter_body', 'matter_transit', 'matter_total',
  'crab_r', 'crab_swallowed', 'crab_lap_frac', 'crab_alive',
];
const manifest = {
  seed: SEED, dt: DT, coarse_cadence_s: COARSE_S, fine_cadence_s: FINE_S,
  sim_seconds_total: world.t, rows: rows.length, hit_safety_cap: hitCap,
  start: tsIso(0), sensor_ids: sensorIds, generations,
  params: PARAMS || null,   // Phase-2 provenance: the tuned overrides this tape was produced under (null = defaults)
};
fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));

console.log(`RESULT ${JSON.stringify({ seed: SEED, generations: generations.length, rows: rows.length, sim_seconds: world.t, hit_safety_cap: hitCap, out: OUT_DIR })}`);
