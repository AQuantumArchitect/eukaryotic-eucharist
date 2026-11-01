import * as K from './src/graph_kernel.mjs';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const world = K.createWorld({ seed: 132 });
const player = K.getPlayer(world);
assert(K.VERSION.includes('v1_3_2'), 'version should be v1.3.2');
assert(player, 'player exists');
assert(K.orgCount(player, 'anaerobic_processor') === 1, 'starter has one anaerobic processor');
assert(K.orgCount(player, 'dna_memory_vesicle') === 0, 'starter has no DNA storage organ');
let hud = K.getHudProjection(world);
let dna = hud.resources.find(r => r.id === 'dna');
assert(dna.max === 0, 'starter DNA cap is zero');

// Full biomass should create ATP while idle.
player.cargo.energy = 0;
player.cargo.biomass = hud.graphStats.caps.biomass;
for (let i = 0; i < 180; i++) K.step(world, {}, 1 / 60);
assert(player.cargo.energy > 0.25, 'idle full biomass should net-generate ATP');
assert(player.cargo.biomass < hud.graphStats.caps.biomass, 'fermentation consumes biomass');

// Exotics require feeding and storage room; no coin pickup while walking.
player.x = 500; player.y = 1300; player.cargo.spores = 0;
world.particles.push({ id: 'test_spore', kind: 'spores', x: 500, y: 1300, value: 1, vx: 0, vy: 0, age: 0, maxAge: 999, color: '#d6a2ff' });
K.step(world, {}, 1 / 60);
assert(player.cargo.spores === 0, 'spore does not collect without feeding');
K.step(world, { feed: true }, 1 / 60);
assert(player.cargo.spores === 1, 'spore collects while feeding if storage exists');
world.particles.push({ id: 'test_spore_full', kind: 'spores', x: player.x, y: player.y, value: 1, vx: 0, vy: 0, age: 0, maxAge: 999, color: '#d6a2ff' });
K.step(world, { feed: true }, 1 / 60);
assert(player.cargo.spores === 1, 'full exotic storage prevents collection');
assert(world.particles.some(p => p.id === 'test_spore_full'), 'full-storage particle remains on map');

// Toxin overload hurts.
player.cargo.toxins = hud.graphStats.caps.toxins;
const hpBefore = player.hp;
for (let i = 0; i < 240; i++) K.step(world, {}, 1 / 60);
assert(player.hp < hpBefore, 'toxin overload causes damage');

// Predators should have contact-capable organs and ecosystem should contain algae pressure.
assert(world.entities.some(e => e.controller === 'predator' && K.orgCount(e, 'rasping_lamella') > 0), 'predators have rasping organs');
assert(world.entities.some(e => e.controller === 'algae'), 'algae exist');
console.log('MOBILE_V1_3_2_FLOW_INGESTION_BALANCE_SMOKE_OK');
