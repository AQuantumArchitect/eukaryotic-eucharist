// BURN-IN: run the player-free ecology to equilibrium and MEASURE the steady-state HP-fill and
// ATP(energy)-fill distributions per lineage, plus counts + depth. These OBSERVED SAMPLES replace the
// wild uniform-random HP/ATP at spawn (see STEADY_STATE in graph_kernel.mjs) so a fresh world — and every
// new arrival — starts looking like an equilibrium member instead of a random guess. Samples are pooled
// across the LAST half of the run (many frames, several seeds) so we capture the equilibrium fluctuation,
// not one snapshot. Usage: node burnin.mjs [minutes=12] [seeds=2] [dt=.05]
import * as K from './src/graph_kernel.mjs';

const MINUTES = Number(process.argv[2] || 12);
const SEED_COUNT = Number(process.argv[3] || 2);
const DT = Math.min(0.05, Number(process.argv[4] || 0.05));
const SEEDS = [11, 22, 33, 44, 55].slice(0, SEED_COUNT);

const mean = a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0;
const std = a => { const m = mean(a); return a.length ? Math.sqrt(mean(a.map(x => (x - m) ** 2))) : 0; };
const clamp01 = x => Math.max(0, Math.min(1, x));

const LINEAGES = {
  algae:             e => e.controller === 'algae' && !e.deepBloom,
  deep_bloom:        e => e.controller === 'algae' && e.deepBloom,
  oxic_scavenger:    e => e.controller === 'scavenger' && e.trophicRole !== 'abyssal_scavenger',
  abyssal_scavenger: e => e.controller === 'scavenger' && e.trophicRole === 'abyssal_scavenger',
  predator:          e => e.controller === 'predator',
  protozoan:         e => e.controller === 'protozoan',
  metazoan:          e => e.controller === 'metazoan',
  brood:             e => e.controller === 'brood',
  swarm_agent:       e => e.controller === 'swarm_agent',
};

// pooled samples per lineage across all seeds/frames
const pool = {};
for (const name of Object.keys(LINEAGES)) pool[name] = { hp: [], energy: [], depth: [], n: [] };
// Deep-pile matter (fields below deepTop+1500 — the same bucket that baits the Horseshroomba Crab)
// sampled across the equilibrium half, so a fresh world can start WITH that pile already there instead
// of waiting for photosynthesis to build it up from zero.
const deepPileSamples = [];
const totalMatterSamples = [];
const DEEP_BUCKET_Y = K.WORLD.deepTop + 1500;

const steps = Math.round((MINUTES * 60) / DT);
const sampleFrom = Math.round(steps * 0.5);      // start sampling at the halfway mark (past the settle)
const sampleEvery = Math.round(20 / DT);          // ~every 20 virtual seconds

for (const seed of SEEDS) {
  const world = K.createEcologyWorld({ seed });
  for (let i = 0; i < steps; i++) {
    K.stepEcology(world, DT);
    if (i >= sampleFrom && i % sampleEvery === 0) {
      const alive = world.entities.filter(e => e.alive);
      for (const [name, pred] of Object.entries(LINEAGES)) {
        const g = alive.filter(pred);
        pool[name].n.push(g.length);
        for (const e of g) {
          const c = K.__test.caps(e);
          if (c.hp > 0) pool[name].hp.push(clamp01(e.hp / c.hp));
          if (c.energy > 0) pool[name].energy.push(clamp01((e.cargo.energy || 0) / c.energy));
          pool[name].depth.push(e.y);
        }
      }
      let deepPile = 0, totalM = 0;
      for (const f of world.fields) { totalM += (f._matter || 0); if (f.y > DEEP_BUCKET_Y) deepPile += (f._matter || 0); }
      deepPileSamples.push(deepPile);
      totalMatterSamples.push(totalM);
    }
  }
}

const steady = {};
for (const name of Object.keys(LINEAGES)) {
  const p = pool[name];
  steady[name] = {
    n: Math.round(mean(p.n)),
    hpFill:     { mean: +mean(p.hp).toFixed(3),     sd: +std(p.hp).toFixed(3) },
    energyFill: { mean: +mean(p.energy).toFixed(3), sd: +std(p.energy).toFixed(3) },
    depthMean: Math.round(mean(p.depth)), depthSd: Math.round(std(p.depth)),
    samples: p.hp.length,
  };
}

console.log(`\n=== BURN-IN — ${MINUTES}min x ${SEEDS.length} seeds (dt=${DT}), sampled over the last half ===`);
console.log('LINEAGE             n    HP-fill(mean+/-sd)   ATP-fill(mean+/-sd)   depth(mean+/-sd)   [samples]');
for (const name of Object.keys(LINEAGES)) {
  const s = steady[name];
  console.log(`  ${name.padEnd(18)} ${String(s.n).padStart(3)}   ` +
    `${s.hpFill.mean.toFixed(2)}+/-${s.hpFill.sd.toFixed(2)}         ` +
    `${s.energyFill.mean.toFixed(2)}+/-${s.energyFill.sd.toFixed(2)}         ` +
    `${String(s.depthMean).padStart(5)}+/-${String(s.depthSd).padStart(4)}   [${s.samples}]`);
}
const deepPile = { mean: Math.round(mean(deepPileSamples)), sd: Math.round(std(deepPileSamples)) };
const totalMatter = { mean: Math.round(mean(totalMatterSamples)), sd: Math.round(std(totalMatterSamples)) };
console.log(`\nDEEP PILE (fields y>${DEEP_BUCKET_Y}, baits the crab): ${deepPile.mean} +/- ${deepPile.sd}   TOTAL FIELD MATTER: ${totalMatter.mean} +/- ${totalMatter.sd}`);
console.log(`\nSTEADY_STATE ${JSON.stringify(steady)}`);
console.log(`DEEP_PILE ${JSON.stringify(deepPile)}`);
