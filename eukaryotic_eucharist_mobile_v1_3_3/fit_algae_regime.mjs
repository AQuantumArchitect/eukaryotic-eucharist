// Fits a portable algae initial-condition regime from short, coarse runs of the real kernel.
// Usage: node fit_algae_regime.mjs [seconds=90] [seeds=3] [dt=.05] [outFile]
import * as K from './src/graph_kernel.mjs';

const seconds = Number(process.argv[2] || 90);
const seedCount = Math.max(1, Math.floor(Number(process.argv[3] || 3)));
const dt = Number(process.argv[4] || 0.05);
const outFile = process.argv[5] || null;
const seeds = [11, 22, 33, 44, 55].slice(0, seedCount);
const mean = xs => xs.length ? xs.reduce((a, x) => a + x, 0) / xs.length : 0;
const std = xs => { const m = mean(xs); return Math.sqrt(mean(xs.map(x => (x - m) ** 2))); };
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

const observations = [];
for (const seed of seeds) {
  const w = K.createEcologyWorld({ seed });
  const frames = Math.round(seconds / dt);
  for (let i = 0; i < frames; i++) K.stepEcology(w, dt);
  const algae = w.entities.filter(e => e.alive && e.controller === 'algae');
  observations.push({
    count: algae.length,
    producerMass: algae.reduce((s, e) => s + (e.biomassMass || 0) + (e.cargo.biomass || 0) + (e.cargo.lipids || 0) * 0.55, 0),
    structure: algae.map(e => e.biomassMass || 0),
    depth: algae.map(e => e.y - K.WORLD.canopy),
    periods: algae.map(e => e.algaeCyclePeriod || 0),
    traits: algae.map(e => e.algaeTraits || {})
  });
}
const all = key => observations.flatMap(o => o[key]);
const structures = all('structure'), depths = all('depth'), periods = all('periods');
const traitKeys = ['photo', 'vent', 'ferment', 'density', 'cycle'];
const fitted = {
  algaeMeanCount: Math.round(mean(observations.map(o => o.count))),
  algaeCountSpread: Math.max(2, Math.round(std(observations.map(o => o.count)))),
  producerMassTarget: Math.round(mean(observations.map(o => o.producerMass))),
  producerMassSpread: Math.max(200, Math.round(std(observations.map(o => o.producerMass)))),
  cycleMinSeconds: clamp(Math.floor(Math.min(...periods)), 45, 110),
  cycleMaxSeconds: clamp(Math.ceil(Math.max(...periods)), 55, 120),
  depthMin: clamp(Math.round(Math.max(100, mean(depths) - std(depths) * 1.4)), 100, 1000),
  depthMax: clamp(Math.round(mean(depths) + std(depths) * 2.0), 600, 2600),
  structuralMean: Math.round(mean(structures)),
  structuralSpread: Math.max(6, Math.round(std(structures))),
  traitSpread: clamp(mean(traitKeys.map(k => std(all('traits').map(t => t[k] || 1)))), 0.08, 0.35)
};
const result = { config: { seconds, seeds, dt }, observations: observations.map(o => ({ count: o.count, producerMass: o.producerMass })), ecologyRegime: fitted };
console.log(JSON.stringify(result, null, 2));
if (outFile) await import('node:fs/promises').then(fs => fs.writeFile(outFile, JSON.stringify(result, null, 2)));
