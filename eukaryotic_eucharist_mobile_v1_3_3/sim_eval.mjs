// Player-free ecology evaluator. The fast default dt=.05 is for iteration; confirm finalists at 1/60.
// Usage: node sim_eval.mjs [minutes=8] [warmupSeconds=0] [seedCount=5] [dt=.05]

import * as K from './src/graph_kernel.mjs';

const MINUTES = Number(process.argv[2] || 8);
const WARMUP = Number(process.argv[3] || 0);
const SEED_COUNT = Number(process.argv[4] || 5);
// Production clamps every ecology step to 50 ms. Mirror that cap when sizing
// the frame count so a coarse dt cannot silently shorten the simulated time.
const DT = Math.min(0.05, Number(process.argv[5] || 0.05));
const SEEDS = [11, 22, 33, 44, 55, 66, 77, 88, 99, 111, 222, 333].slice(0, SEED_COUNT);
const SAMPLE_SECONDS = 1;
const TIMELINE_SECONDS = 30;
const HUNTERS = new Set(['predator', 'protozoan', 'metazoan']);
const SPECIES = ['algae', 'scavenger', 'predator', 'protozoan', 'metazoan', 'brood', 'swarm_agent'];
const mean = a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0;
const std = a => { const m = mean(a); return Math.sqrt(mean(a.map(x => (x - m) ** 2))); };
const median = a => a.length ? [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)] : 0;
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
  const states = {}, targets = {}, phases = { basking: 0, sinking: 0, rising: 0 }, cycleBins = Array(12).fill(0);
  for (const e of live) if (e.controller in pop) pop[e.controller]++;
  for (const e of hunters) {
    add(states, e.brainState || 'none');
    const t = e._targetRef;
    add(targets, t?.controller || (t?.radius != null ? 'field' : 'none'));
  }
  const claims = new Map();
  for (const e of hunters) if (e._targetRef?.controller) claims.set(e._targetRef.id, (claims.get(e._targetRef.id) || 0) + 1);
  const claimValues = [...claims.values()];
  for (const e of algae) {
    add(phases, e.vy > 0.4 ? 'sinking' : e.vy < -0.4 ? 'rising' : 'basking');
    const p = ((Math.PI * 2 * w.t / Math.max(1, e.algaeCyclePeriod || 75) + (e.algaeSeedPhase || 0)) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    cycleBins[Math.min(11, Math.floor(p / (Math.PI * 2) * 12))]++;
  }
  const phaseP = Object.values(phases).map(n => n / Math.max(1, algae.length)).filter(p => p > 0);
  const phaseEntropy = phaseP.length > 1 ? -phaseP.reduce((s, p) => s + p * Math.log(p), 0) / Math.log(3) : 0;
  const cycleP = cycleBins.map(n => n / Math.max(1, algae.length)).filter(p => p > 0);
  const cycleEntropy = cycleP.length > 1 ? -cycleP.reduce((s, p) => s + p * Math.log(p), 0) / Math.log(12) : 0;
  const sizes = algae.map(e => e.biomassMass || 0), depths = algae.map(e => e.y - K.WORLD.canopy);
  const hpFills = algae.map(e => e.hp / Math.max(1, K.__test.caps(e).hp));
  const risingHp = algae.filter(e => e.vy < -0.4).map(e => e.hp / Math.max(1, K.__test.caps(e).hp));
  const sinkingHp = algae.filter(e => e.vy > 0.4).map(e => e.hp / Math.max(1, K.__test.caps(e).hp));
  return {
    t: w.t, pop, states, targets, phases,
    algaeBiomass: mean(algae.map(e => e.cargo.biomass || 0)),
    producerMass: K.algaeProducerMass(w),
    giantAlgae: algae.filter(e => (e.biomassMass || 0) >= 210 && (e.algaeCycleCount || 0) >= 11).length,
    algaeStructure: mean(sizes), algaeDepth: mean(depths), algaeDepthStd: std(depths),
    algaeHpFill: mean(hpFills), algaeHpStd: std(hpFills),
    algaeWounded: mean(hpFills.map(x => x < 0.90 ? 1 : 0)),
    algaeCritical: mean(hpFills.map(x => x < 0.50 ? 1 : 0)),
    algaeRisingHp: mean(risingHp), algaeSinkingHp: mean(sinkingHp),
    healthDepthCorr: corr(hpFills, depths),
    algaeShallow: algae.filter(e => e.y < K.WORLD.nurseryTop).length,
    algaeSmall: algae.filter(e => (e.biomassMass || 0) < 70).length,
    algaeMedium: algae.filter(e => (e.biomassMass || 0) >= 70 && (e.biomassMass || 0) < 210).length,
    algaeLarge: algae.filter(e => (e.biomassMass || 0) >= 210).length,
    algaeGasFill: mean(algae.map(e => (e.oxygen || 0) / Math.max(0.001, K.__test.caps(e).oxygen))),
    algaeNetLift: mean(algae.map(e => K.__test.buoyancy(e) - K.__test.biomassWeight(e))),
    sizeDepthCorr: corr(sizes, depths), phaseEntropy, cycleEntropy,
    maxDirectionShare: Math.max(phases.sinking, phases.rising) / Math.max(1, algae.length),
    algaeBoundaryFraction: w.stats.algaeBoundaryHits / Math.max(1, w.stats.algaeBoundarySamples),
    hunterEnergyFill: mean(hunters.map(e => (e.cargo.energy || 0) / Math.max(1, K.__test.caps(e).energy))),
    hunterZeroEnergy: mean(hunters.map(e => (e.cargo.energy || 0) < 0.02 ? 1 : 0)),
    hunterDepth: mean(hunters.map(e => e.y - K.WORLD.canopy)),
    hunterDepthStd: std(hunters.map(e => e.y - K.WORLD.canopy)),
    hunterMiddle: hunters.filter(e => e.y >= K.WORLD.nurseryTop && e.y < K.WORLD.ruptureTop).length,
    deepAboveFourPct: hunters.filter(e => e.controller !== 'predator' && K.lightAt(e.y) > 0.04).length,
    tier2AboveThirtyFourPct: hunters.filter(e => e.controller === 'predator' && K.lightAt(e.y) > 0.34).length,
    claimMean: mean(claimValues), claimMax: claimValues.length ? Math.max(...claimValues) : 0,
    fields: w.fields.length, fieldMatter: w.fields.reduce((s, f) => s + totalMatter(f), 0),
    particles: w.particles.length,
  };
}

function run(seed) {
  const w = K.createEcologyWorld({ seed, warmup: WARMUP });
  const samples = [snapshot(w)], deaths = {}, fissions = {}, fissionFuel = {}, migrations = {}, stateTicks = {}, targetTicks = {};
  const life = new Map(), bobPeriods = [], bobAmplitudes = [];
  const hunterMotion = new Map();
  let hunterStateTransitions = 0, hunterMiddleTurns = 0;
  // Keep the initially shallowest visible blooms as a literal gameplay-speed cohort.
  // Aggregate turn counters can look healthy even when one surface organism is crawling.
  const shallowIds = w.entities.filter(e => e.alive && e.controller === 'algae')
    .sort((a, b) => a.y - b.y).slice(0, 5).map(e => e.id);
  const traceShallow = () => shallowIds.map(id => {
    const e = w.entities.find(x => x.id === id && x.alive);
    return e ? { id, depth: e.y - K.WORLD.canopy, vy: e.vy, cycles: e.algaeCycleCount || 0,
      period: e.algaeCyclePeriod || 0, mass: e.biomassMass || 0 } : { id, dead: true };
  });
  const shallowTrace = [{ t: w.t, algae: traceShallow() }];
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
      const direction = e.vy > 3 ? 1 : e.vy < -3 ? -1 : 0;
      const previous = hunterMotion.get(e.id);
      if (previous) {
        if (previous.state !== e.brainState) hunterStateTransitions++;
        if (direction && previous.direction && direction !== previous.direction
          && e.y >= K.WORLD.nurseryTop && e.y < K.WORLD.ruptureTop) hunterMiddleTurns++;
      }
      hunterMotion.set(e.id, { state: e.brainState, direction: direction || previous?.direction || 0 });
    }
    if (frame % sampleFrames === 0) {
      for (const e of w.entities) if (e.alive && e.controller === 'algae') {
        const a = life.get(e.id) || { cycleCount: e.algaeCycleCount || 0, returns: 0, lastTurn: null, minDepth: Infinity, maxDepth: -Infinity, maxExcursion: 0 };
        const depth = e.y - K.WORLD.canopy;
        a.minDepth = Math.min(a.minDepth, depth); a.maxDepth = Math.max(a.maxDepth, depth);
        if ((e.algaeCycleCount || 0) > a.cycleCount) {
          const amplitude = a.maxDepth - a.minDepth;
          a.maxExcursion = Math.max(a.maxExcursion, amplitude);
          if (amplitude > 250) {
            bobAmplitudes.push(amplitude); a.returns++;
            if (a.lastTurn != null) bobPeriods.push(w.t - a.lastTurn);
            a.lastTurn = w.t;
          }
          a.cycleCount = e.algaeCycleCount || 0; a.minDepth = depth; a.maxDepth = depth;
        }
        life.set(e.id, a);
      }
      samples.push(snapshot(w));
      shallowTrace.push({ t: w.t, algae: traceShallow() });
    }
  }
  const eligible = [...life.values()].filter(a => a.maxExcursion > 250);
  return { seed, samples, deaths, fissions, fissionFuel, migrations, stateTicks, targetTicks,
    hunterStateTransitions, hunterMiddleTurns, shallowTrace, algaeStats: { ...w.stats },
    cycles: eligible.reduce((s, a) => s + a.returns, 0),
    returners: eligible.filter(a => a.returns > 0).length, eligible: eligible.length, bobPeriods, bobAmplitudes };
}

const runs = SEEDS.map(run);
const keys = ['algaeBiomass', 'producerMass', 'giantAlgae', 'algaeStructure', 'algaeDepth', 'algaeDepthStd', 'algaeHpFill', 'algaeHpStd', 'algaeWounded', 'algaeCritical', 'algaeRisingHp', 'algaeSinkingHp', 'healthDepthCorr', 'algaeShallow', 'algaeSmall', 'algaeMedium', 'algaeLarge', 'algaeGasFill', 'algaeNetLift', 'sizeDepthCorr', 'phaseEntropy', 'cycleEntropy', 'maxDirectionShare', 'algaeBoundaryFraction', 'hunterEnergyFill', 'hunterZeroEnergy', 'hunterDepth', 'hunterDepthStd', 'hunterMiddle', 'deepAboveFourPct', 'tier2AboveThirtyFourPct', 'claimMean', 'claimMax', 'fields', 'fieldMatter', 'particles'];
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
  ['metazoan pop', r => r.pop.metazoan], ['producer mass', r => r.producerMass], ['algae biomass', r => r.algaeBiomass],
  ['algae structure', r => r.algaeStructure], ['algae depth', r => r.algaeDepth],
  ['field matter', r => r.fieldMatter], ['field count', r => r.fields]
]) {
  const a = get(start), b = get(compare);
  console.log(`${label.padEnd(22)} ${a.toFixed(1).padStart(8)} ${b.toFixed(1).padStart(10)} ${pct(gap(a, b)).padStart(8)}`);
}
console.log(`\nalgae: returners ${runs.reduce((s,r)=>s+r.returners,0)}/${runs.reduce((s,r)=>s+r.eligible,0)} eligible; completed cycles=${runs.reduce((s,r)=>s+r.cycles,0)}`);
console.log(`at compare: size↔depth corr=${compare.sizeDepthCorr.toFixed(2)}, phase entropy=${compare.phaseEntropy.toFixed(2)}, depth SD=${compare.algaeDepthStd.toFixed(0)}, gas=${pct(compare.algaeGasFill)}`);
console.log(`producer shape: shallow=${start.algaeShallow.toFixed(0)}→${compare.algaeShallow.toFixed(0)}; small/medium/large=${start.algaeSmall.toFixed(0)}/${start.algaeMedium.toFixed(0)}/${start.algaeLarge.toFixed(0)}→${compare.algaeSmall.toFixed(0)}/${compare.algaeMedium.toFixed(0)}/${compare.algaeLarge.toFixed(0)}`);
console.log(`algae health: mean=${pct(start.algaeHpFill)}→${pct(compare.algaeHpFill)}, SD=${pct(start.algaeHpStd)}→${pct(compare.algaeHpStd)}, wounded=${pct(start.algaeWounded)}→${pct(compare.algaeWounded)}, critical=${pct(start.algaeCritical)}→${pct(compare.algaeCritical)}`);
console.log(`health covariance: depth corr=${start.healthDepthCorr.toFixed(2)}→${compare.healthDepthCorr.toFixed(2)}, rising/sinking=${pct(compare.algaeRisingHp)}/${pct(compare.algaeSinkingHp)}`);
console.log(`algae guards: latent phase entropy=${compare.cycleEntropy.toFixed(2)}, max direction share=${pct(compare.maxDirectionShare)}, emergency-limit time=${pct(compare.algaeBoundaryFraction)}`);
const allBobPeriods = runs.flatMap(r => r.bobPeriods), allBobAmplitudes = runs.flatMap(r => r.bobAmplitudes);
console.log(`physical bobs: median period=${median(allBobPeriods).toFixed(1)}s from ${allBobPeriods.length} cycles; median amplitude=${median(allBobAmplitudes).toFixed(0)}px`);
console.log('initial shallow-cohort trajectories (depth px; † = dead):');
const traceTimes = [0, 30, 60, 90, 120].filter(t => t <= MINUTES * 60 + 0.01);
for (let i = 0; i < runs[0].shallowTrace[0].algae.length; i++) {
  const startAlgae = runs[0].shallowTrace[0].algae[i];
  const points = traceTimes.map(t => {
    const row = runs[0].shallowTrace.reduce((best, x) => Math.abs(x.t - t) < Math.abs(best.t - t) ? x : best, runs[0].shallowTrace[0]);
    const a = row.algae[i];
    return `${t}s:${a.dead ? '†' : a.depth.toFixed(0)}`;
  });
  console.log(`  ${startAlgae.id} T=${startAlgae.period.toFixed(0)}s M=${startAlgae.mass.toFixed(0)}  ${points.join('  ')}`);
}
const shallowWindow = Math.min(30, MINUTES * 60);
const shallowTravel = runs.flatMap(run => {
  const startRow = run.shallowTrace[0];
  const endRow = run.shallowTrace.reduce((best, x) => Math.abs(x.t - shallowWindow) < Math.abs(best.t - shallowWindow) ? x : best, startRow);
  return startRow.algae.flatMap((a, i) => endRow.algae[i].dead ? [] : [endRow.algae[i].depth - a.depth]);
});
console.log(`shallow-cohort ${shallowWindow.toFixed(0)}s net travel across ${runs.length} seed(s): min=${Math.min(...shallowTravel).toFixed(0)}px median=${median(shallowTravel).toFixed(0)}px max=${Math.max(...shallowTravel).toFixed(0)}px`);
console.log(`giants: ${compare.giantAlgae.toFixed(1)} at compare; wound fields=${runs.reduce((s,r)=>s+r.algaeStats.algaeWoundFields,0)}; scavenger graze=${runs.reduce((s,r)=>s+r.algaeStats.scavengerAlgaeGrazes,0).toFixed(1)}; giant ruptures=${runs.reduce((s,r)=>s+r.algaeStats.giantAlgaeRuptures,0)}`);
console.log(`hunters: ATP=${pct(compare.hunterEnergyFill)}, zero-ATP=${pct(compare.hunterZeroEnergy)}, claims mean/max=${compare.claimMean.toFixed(2)}/${compare.claimMax.toFixed(1)}`);
console.log(`hunter vertical spread: depth=${start.hunterDepth.toFixed(0)}±${start.hunterDepthStd.toFixed(0)}→${compare.hunterDepth.toFixed(0)}±${compare.hunterDepthStd.toFixed(0)}; middle-zone raiders=${start.hunterMiddle.toFixed(0)}→${compare.hunterMiddle.toFixed(0)}`);
console.log(`sunlight refuge violations: deep >4%=${start.deepAboveFourPct.toFixed(0)}→${compare.deepAboveFourPct.toFixed(0)}; tier-2 >34%=${start.tier2AboveThirtyFourPct.toFixed(0)}→${compare.tier2AboveThirtyFourPct.toFixed(0)}`);
console.log(`hunter motion: sampled-state changes=${runs.reduce((s,r)=>s+r.hunterStateTransitions,0)}; middle-zone vertical reversals=${runs.reduce((s,r)=>s+r.hunterMiddleTurns,0)}`);
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

const acceptance = {
  algaeCountCentered: Math.abs(gap(start.pop.algae, compare.pop.algae)) <= 0.10,
  producerMassCentered: Math.abs(gap(start.producerMass, compare.producerMass)) <= 0.10,
  algaeDepthCentered: Math.abs(gap(start.algaeDepth, compare.algaeDepth)) <= 0.10,
  fieldMatterCentered: Math.abs(gap(start.fieldMatter, compare.fieldMatter)) <= 0.10,
  phaseEntropy: compare.cycleEntropy >= 0.75,
  directionSpread: compare.maxDirectionShare <= 0.75,
  boundaryHeadroom: compare.algaeBoundaryFraction < 0.01,
  bobPeriod: median(allBobPeriods) >= 45 && median(allBobPeriods) <= 120,
  sizeDepth: compare.sizeDepthCorr > 0,
  scavengerPersistence: compare.pop.scavenger > 0,
  hunterPersistence: compare.pop.predator + compare.pop.protozoan + compare.pop.metazoan > 0
};
console.log('acceptance:', JSON.stringify(acceptance));
console.log(`\nRESULT ${JSON.stringify({ minutes: MINUTES, seeds: SEEDS, dt: DT, warmup: WARMUP,
  start, compare, states: stateTotals, targets: targetTotals, fissions: sumMaps('fissions'), fissionFuel: sumMaps('fissionFuel'), migrations: sumMaps('migrations'), deaths: sumMaps('deaths'),
  algaeCycles: runs.reduce((s,r)=>s+r.cycles,0), algaeReturners: runs.reduce((s,r)=>s+r.returners,0), algaeEligible: runs.reduce((s,r)=>s+r.eligible,0),
  medianBobPeriod: median(allBobPeriods), medianBobAmplitude: median(allBobAmplitudes), acceptance })}`);
