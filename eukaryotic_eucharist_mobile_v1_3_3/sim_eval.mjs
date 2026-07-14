// Player-free ecology evaluator. The fast default dt=.05 is for iteration; confirm finalists at 1/60.
// Usage: node sim_eval.mjs [minutes=8] [warmupSeconds=0] [seedCount=5] [dt=.05]

import * as K from './src/graph_kernel.mjs';

const MINUTES = Number(process.argv[2] || 8);
const WARMUP = Number(process.argv[3] || 0);
const SEED_COUNT = Number(process.argv[4] || 5);
const DT = Number(process.argv[5] || 0.05);
const SEEDS = [11, 22, 33, 44, 55, 66, 77, 88, 99, 111, 222, 333].slice(0, SEED_COUNT);
const SAMPLE_SECONDS = 1;
const TIMELINE_SECONDS = 30;
const HUNTERS = new Set(['predator', 'protozoan', 'metazoan']);
const SPECIES = ['algae', 'scavenger', 'predator', 'protozoan', 'metazoan', 'brood', 'swarm_agent'];
const mean = a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0;
const std = a => { const m = mean(a); return Math.sqrt(mean(a.map(x => (x - m) ** 2))); };
const add = (o, k, n = 1) => { o[k] = (o[k] || 0) + n; };
const totalMatter = f => K.__test.totalMatter(f.stock);
const pct = x => `${(x * 100).toFixed(1)}%`;

function corr(xs, ys) {
  if (xs.length < 2) return 0;
  const mx = mean(xs), my = mean(ys);
  const num = mean(xs.map((x, i) => (x - mx) * (ys[i] - my)));
  const den = std(xs) * std(ys);
  return den ? num / den : 0;
}

function snapshot(w) {
  const live = w.entities.filter(e => e.alive);
  const algae = live.filter(e => e.controller === 'algae');
  const hunters = live.filter(e => HUNTERS.has(e.controller));
  const pop = Object.fromEntries(SPECIES.map(s => [s, 0]));
  const states = {}, targets = {}, phases = { basking: 0, sinking: 0, rising: 0 };
  for (const e of live) if (e.controller in pop) pop[e.controller]++;
  for (const e of hunters) {
    add(states, e.brainState || 'none');
    const t = e._targetRef;
    add(targets, t?.controller || (t?.radius != null ? 'field' : 'none'));
  }
  const claims = new Map();
  for (const e of hunters) if (e._targetRef?.controller) claims.set(e._targetRef.id, (claims.get(e._targetRef.id) || 0) + 1);
  const claimValues = [...claims.values()];
  for (const e of algae) add(phases, e.fallState === 'sinking' ? 'sinking' : e.fallState === 'rising' ? 'rising' : 'basking');
  const phaseP = Object.values(phases).map(n => n / Math.max(1, algae.length)).filter(p => p > 0);
  const phaseEntropy = phaseP.length > 1 ? -phaseP.reduce((s, p) => s + p * Math.log(p), 0) / Math.log(3) : 0;
  const sizes = algae.map(e => e.biomassMass || 0), depths = algae.map(e => e.y - K.WORLD.canopy);
  return {
    t: w.t, pop, states, targets, phases,
    algaeBiomass: mean(algae.map(e => e.cargo.biomass || 0)),
    algaeStructure: mean(sizes), algaeDepth: mean(depths), algaeDepthStd: std(depths),
    algaeGasFill: mean(algae.map(e => (e.ballastGas || 0) / Math.max(0.001, K.__test.caps(e).ballastGas))),
    algaeNetLift: mean(algae.map(e => K.__test.buoyancy(e) - K.__test.biomassWeight(e))),
    sizeDepthCorr: corr(sizes, depths), phaseEntropy,
    hunterEnergyFill: mean(hunters.map(e => (e.cargo.energy || 0) / Math.max(1, K.__test.caps(e).energy))),
    hunterZeroEnergy: mean(hunters.map(e => (e.cargo.energy || 0) < 0.02 ? 1 : 0)),
    claimMean: mean(claimValues), claimMax: claimValues.length ? Math.max(...claimValues) : 0,
    fields: w.fields.length, fieldMatter: w.fields.reduce((s, f) => s + totalMatter(f), 0),
    particles: w.particles.length,
  };
}

function run(seed) {
  const w = K.createEcologyWorld({ seed, warmup: WARMUP });
  const samples = [snapshot(w)], deaths = {}, fissions = {}, fissionFuel = {}, migrations = {}, stateTicks = {}, targetTicks = {};
  const life = new Map();
  const controllerById = new Map(w.entities.map(e => [e.id, e.controller]));
  const sampleFrames = Math.max(1, Math.round(SAMPLE_SECONDS / DT));
  const frames = Math.round(MINUTES * 60 / DT);
  for (let frame = 1; frame <= frames; frame++) {
    K.stepEcology(w, DT);
    for (const ev of w.events) {
      if (ev.type === 'death') add(deaths, `${controllerById.get(ev.entityId) || 'unknown'}<-${controllerById.get(ev.sourceId) || 'environment'}`);
      if (ev.type === 'fission') {
        add(fissions, ev.controller || 'unknown');
        const f = ev.fuel || {};
        const mode = (f.energy || 0) >= 0.88 ? 'atp' : 'lipid';
        add(fissionFuel, `${ev.controller || 'unknown'}:${mode}`);
        add(fissionFuel, `${ev.controller || 'unknown'}:energy_${Math.floor(Math.min(0.999, f.energy || 0) * 10) * 10}%`);
      }
      if (ev.type === 'immigrate' || ev.type === 'emigrate' || ev.type === 'algae_birth') add(migrations, `${ev.type}:${ev.controller || 'unknown'}`);
    }
    for (const e of w.entities) if (!controllerById.has(e.id)) controllerById.set(e.id, e.controller);
    for (const e of w.entities) if (e.alive && HUNTERS.has(e.controller)) {
      add(stateTicks, e.brainState || 'none');
      const t = e._targetRef; add(targetTicks, t?.controller || (t?.radius != null ? 'field' : 'none'));
    }
    if (frame % sampleFrames === 0) {
      for (const e of w.entities) if (e.alive && e.controller === 'algae') {
        const a = life.get(e.id) || { deep: false, returns: 0, maxDepth: 0 };
        const depth = e.y - K.WORLD.canopy;
        a.maxDepth = Math.max(a.maxDepth, depth);
        if (depth > 500) a.deep = true;
        if (a.deep && depth < 240 && e.vy < 0) { a.returns++; a.deep = false; }
        life.set(e.id, a);
      }
      samples.push(snapshot(w));
    }
  }
  const eligible = [...life.values()].filter(a => a.maxDepth > 500);
  return { seed, samples, deaths, fissions, fissionFuel, migrations, stateTicks, targetTicks,
    cycles: eligible.reduce((s, a) => s + a.returns, 0),
    returners: eligible.filter(a => a.returns > 0).length, eligible: eligible.length };
}

const runs = SEEDS.map(run);
const keys = ['algaeBiomass', 'algaeStructure', 'algaeDepth', 'algaeDepthStd', 'algaeGasFill', 'algaeNetLift', 'sizeDepthCorr', 'phaseEntropy', 'hunterEnergyFill', 'hunterZeroEnergy', 'claimMean', 'claimMax', 'fields', 'fieldMatter', 'particles'];
const n = Math.min(...runs.map(r => r.samples.length));
const avg = [];
for (let i = 0; i < n; i++) {
  const row = { t: runs[0].samples[i].t, pop: {}, phases: {} };
  for (const k of keys) row[k] = mean(runs.map(r => r.samples[i][k]));
  for (const s of SPECIES) row.pop[s] = mean(runs.map(r => r.samples[i].pop[s]));
  for (const p of ['basking', 'sinking', 'rising']) row.phases[p] = mean(runs.map(r => r.samples[i].phases[p]));
  avg.push(row);
}
const at = sec => avg.reduce((best, r) => Math.abs(r.t - sec) < Math.abs(best.t - sec) ? r : best, avg[0]);
const start = avg[0], compare = at(Math.min(400, MINUTES * 60));
const gap = (a, b) => b ? (a - b) / Math.abs(b) : 0;
const sumMaps = key => { const out = {}; for (const r of runs) for (const [k, v] of Object.entries(r[key])) add(out, k, v); return out; };
const stateTotals = sumMaps('stateTicks'), targetTotals = sumMaps('targetTicks');
const stateN = Object.values(stateTotals).reduce((a, b) => a + b, 0) || 1;
const targetN = Object.values(targetTotals).reduce((a, b) => a + b, 0) || 1;

console.log(`\n=== ecology eval: ${MINUTES}min x ${runs.length}, dt=${DT}, warmup=${WARMUP}s, PLAYER-FREE ===`);
console.log(`comparison: t=0 vs t≈${compare.t.toFixed(0)} (distribution means across seeds)`);
console.log('metric                 t=0       compare    gap');
for (const [label, get] of [
  ['algae pop', r => r.pop.algae], ['scavenger pop', r => r.pop.scavenger],
  ['predator pop', r => r.pop.predator], ['protozoan pop', r => r.pop.protozoan],
  ['metazoan pop', r => r.pop.metazoan], ['algae biomass', r => r.algaeBiomass],
  ['algae structure', r => r.algaeStructure], ['algae depth', r => r.algaeDepth],
  ['field matter', r => r.fieldMatter], ['field count', r => r.fields]
]) {
  const a = get(start), b = get(compare);
  console.log(`${label.padEnd(22)} ${a.toFixed(1).padStart(8)} ${b.toFixed(1).padStart(10)} ${pct(gap(a, b)).padStart(8)}`);
}
console.log(`\nalgae: returners ${runs.reduce((s,r)=>s+r.returners,0)}/${runs.reduce((s,r)=>s+r.eligible,0)} eligible; completed cycles=${runs.reduce((s,r)=>s+r.cycles,0)}`);
console.log(`at compare: size↔depth corr=${compare.sizeDepthCorr.toFixed(2)}, phase entropy=${compare.phaseEntropy.toFixed(2)}, depth SD=${compare.algaeDepthStd.toFixed(0)}, gas=${pct(compare.algaeGasFill)}`);
console.log(`hunters: ATP=${pct(compare.hunterEnergyFill)}, zero-ATP=${pct(compare.hunterZeroEnergy)}, claims mean/max=${compare.claimMean.toFixed(2)}/${compare.claimMax.toFixed(1)}`);
console.log('\nhunter state occupancy:', Object.entries(stateTotals).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k}=${pct(v/stateN)}`).join('  '));
console.log('hunter target occupancy:', Object.entries(targetTotals).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k}=${pct(v/targetN)}`).join('  '));
console.log('fissions:', JSON.stringify(sumMaps('fissions')));
console.log('fission fuel:', JSON.stringify(sumMaps('fissionFuel')));
console.log('migration/birth flux:', JSON.stringify(sumMaps('migrations')));
console.log('deaths:', JSON.stringify(sumMaps('deaths')));

console.log('\ntimeline: t  algae/scav/pred/proto/meta  depth±sd  biomass  fields/matter  phases(B/S/R)');
for (const r of avg.filter((_, i) => i % Math.max(1, Math.round(TIMELINE_SECONDS / SAMPLE_SECONDS)) === 0 || i === avg.length - 1)) {
  console.log(`${r.t.toFixed(0).padStart(4)}  ${r.pop.algae.toFixed(0)}/${r.pop.scavenger.toFixed(0)}/${r.pop.predator.toFixed(0)}/${r.pop.protozoan.toFixed(0)}/${r.pop.metazoan.toFixed(0)}  ${r.algaeDepth.toFixed(0)}±${r.algaeDepthStd.toFixed(0)}  ${r.algaeBiomass.toFixed(1)}  ${r.fields.toFixed(0)}/${r.fieldMatter.toFixed(0)}  ${r.phases.basking.toFixed(0)}/${r.phases.sinking.toFixed(0)}/${r.phases.rising.toFixed(0)}`);
}

console.log(`\nRESULT ${JSON.stringify({ minutes: MINUTES, seeds: SEEDS, dt: DT, warmup: WARMUP,
  start, compare, states: stateTotals, targets: targetTotals, fissions: sumMaps('fissions'), fissionFuel: sumMaps('fissionFuel'), migrations: sumMaps('migrations'), deaths: sumMaps('deaths'),
  algaeCycles: runs.reduce((s,r)=>s+r.cycles,0), algaeReturners: runs.reduce((s,r)=>s+r.returners,0), algaeEligible: runs.reduce((s,r)=>s+r.eligible,0) })}`);
