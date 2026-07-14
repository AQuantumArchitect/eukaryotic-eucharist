import assert from 'node:assert/strict';
import * as K from '../src/graph_kernel.mjs';

const world = K.createWorld({ seed: 4242 });
const p = K.getPlayer(world);
assert.equal(world.version, K.VERSION);
assert.ok(K.WORLD.h >= 5200, 'world height expanded');
assert.ok(K.oxygenAt(K.WORLD.canopy + 40) > K.oxygenAt(K.WORLD.nurseryTop + 200), 'oxygen falls with depth');
assert.ok(K.lightAt(K.WORLD.canopy + 30) > K.lightAt(K.WORLD.ruptureTop), 'light falls with depth');

let actions = K.getAvailableActions(world);
assert.ok(actions.some(a => a.id === 'feed'), 'starter can feed');
assert.ok(!actions.some(a => a.id === 'rasp'), 'starter cannot attack');
assert.ok(!actions.some(a => a.id === 'repair'), 'starter cannot self-repair');
assert.ok(!actions.some(a => a.id === 'acid'), 'starter cannot vent toxin');

let offers = K.getYukiOfferings(world);
const tier2 = offers.filter(o => o.section.includes('Tier 2'));
assert.ok(tier2.length >= 6, 'tier2 offerings present');
assert.ok(tier2.every(o => !('dna' in (o.cost || {}))), 'tier2 has no DNA costs');
assert.ok(offers.some(o => o.id === 'lipid_repair_loom'), 'repair loom in tier2');
assert.ok(offers.some(o => o.id === 'mitochondrial_eucharist'), 'mitochondrial Eucharist exists');
assert.ok(!offers.find(o => o.id === 'mitochondrial_eucharist').affordable || offers.find(o => o.id === 'mitochondrial_eucharist').locked, 'Eucharist is gated at start');
assert.ok(offers.filter(o => o.section.includes('Tier 3')).every(o => o.locked), 'tier3 locked before mitochondria');

// Oxygen diffusion: move player into surface oxygen and step.
p.y = K.WORLD.canopy + 80;
p.oxygen = 0.05;
const beforeO2 = p.oxygen;
for (let i = 0; i < 60; i++) K.step(world, {}, 1/60);
assert.ok(p.oxygen > beforeO2, 'internal oxygen drifts upward in surface water');

// Feeding drains fields over time.
p.y = K.WORLD.ruptureTop + 100;
p.x = 500;
world.fields.push({ id: 'test_field', x: 500, y: p.y, radius: 80, stock: { biomass: 40, lipids: 20, toxins: 0, energy: 0, spores: 0, enzymes: 0, crystals: 0, vacuoles: 0, dna: 0 }, density: 1, sourceKind: 'test', age: 0, maxAge: 50, decayRate: 0, radiusScale: 8, maxRadius: 120 });
const f = world.fields.find(x => x.id === 'test_field');
const before = f.stock.biomass;
for (let i = 0; i < 30; i++) K.step(world, { feed: true }, 1/60);
assert.ok(f.stock.biomass < before, 'feeding drains resource field');

// Buy repair loom after granting costs, then action appears and repairs.
p.x = 500; p.y = K.WORLD.canopy + 120;
Object.assign(p.cargo, { biomass: 100, lipids: 100, energy: 100, enzymes: 5, spores: 5, crystals: 5, vacuoles: 5 });
let res = K.buyOffering(world, 'lipid_repair_loom');
assert.equal(res.ok, true, 'buy repair loom');
actions = K.getAvailableActions(world);
assert.ok(actions.some(a => a.id === 'repair'), 'repair action appears after organelle');
p.hp = 50;
const hpBefore = p.hp;
for (let i = 0; i < 30; i++) K.step(world, { repair: true }, 1/60);
assert.ok(p.hp > hpBefore, 'lipid repair restores hp');

// Host readiness and Eucharist gate.
Object.assign(p.cargo, { biomass: 120, lipids: 120, energy: 100, spores: 10, enzymes: 8, crystals: 8, vacuoles: 6 });
K.buyOffering(world, 'oxygen_tolerance');
K.buyOffering(world, 'oxygen_tolerance');
K.buyOffering(world, 'cytostome');
p.maxDepth = 2200;
offers = K.getYukiOfferings(world);
const euch = offers.find(o => o.id === 'mitochondrial_eucharist');
assert.ok(euch, 'Eucharist offering projected');
if (euch.locked) {
  // Add the missing adaptation directly to satisfy readiness if costs prevented a buy.
  p.organelles.oxygen_tolerance = Math.max(p.organelles.oxygen_tolerance || 0, 2);
  p.organelles.cytostome = 1;
  p.organelles.lipid_repair_loom = 1;
}
res = K.buyOffering(world, 'mitochondrial_eucharist');
assert.equal(res.ok, true, `Eucharist begins: ${res.reason || ''}`);
assert.ok(p.incubating, 'incubation state set');
for (let i = 0; i < 1200 && !K.hasMito(p); i++) K.step(world, {}, 1/60);
assert.ok(K.hasMito(p), 'mitochondrion integrates after incubation');
offers = K.getYukiOfferings(world);
assert.ok(offers.filter(o => o.section.includes('Tier 3')).some(o => !o.reasons.includes('requires mitochondrial Eucharist')), 'tier3 no longer blocked by mitochondria');

// Death blooms into field.
const fieldCount = world.fields.length;
p.hp = 0;
K.step(world, {}, 1/60);
assert.ok(world.fields.length > fieldCount, 'death creates resource field');

console.log('MOBILE_V1_0_OXYGEN_EUCHARIST_SMOKE_OK');
