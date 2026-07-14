import * as K from '../src/graph_kernel.mjs';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}
function res(hud, id) {
  return hud.resources.find(r => r.id === id);
}

const world = K.createWorld({ seed: 122 });
assert(K.VERSION.includes('v1_2_2'), 'version should be v1.2.2');
let player = K.getPlayer(world);
assert(player.organelles.fermentation_matrix === 1, 'starter has one fermentation matrix');
assert(!player.organelles.toxin_launcher, 'starter has no toxic launcher');
assert(!player.organelles.rasping_lamella, 'starter has no rasping lamella');
assert(world.entities.length > 45 && world.fields.length > 10, 'mature ecology seeded');

// Fermentation should produce net ATP when biomass is available and the tank is low.
player.cargo.energy = 1;
player.cargo.biomass = K.__test.caps(player).biomass;
const e0 = player.cargo.energy;
for (let i = 0; i < 240; i++) K.step(world, {}, 1 / 60);
player = K.getPlayer(world);
assert(player.cargo.energy > e0 + 0.45, `fermentation should net ATP; got ${player.cargo.energy} from ${e0}`);
assert(player.cargo.biomass < K.__test.caps(player).biomass, 'fermentation consumes biomass');

// Shop sections are grouped and themed by function.
const offers = K.getYukiOfferings(world);
assert(offers.some(o => o.section.includes('2A') && o.theme === 'general'), 'general tier 2 section exists');
assert(offers.some(o => o.section.includes('2B') && o.theme === 'algae'), 'algae/oxygen tier 2 section exists');
assert(offers.some(o => o.section.includes('2C') && o.theme === 'attack'), 'attack tier 2 section exists');
assert(!offers.some(o => o.id === 'buoyancy_vacuole'), 'separate buoyancy purchase removed; oxygen vacuole handles buoyancy');

// Oxygen vacuole should make oxygen contribute meaningfully to buoyancy.
const b0 = K.__test.buoyancy(player);
player.organelles.oxygen_vacuole = 1;
player.oxygen = 0.85;
const b1 = K.__test.buoyancy(player);
assert(b1 > b0 + 30, 'oxygen vacuole converts internal oxygen into lift');

// Toxic Launcher is cooled down into a glob weapon, not a per-frame stream.
player.cargo.biomass = 100; player.cargo.toxins = 100; player.cargo.crystals = 20; player.cargo.energy = 100;
const buy = K.buyOffering(world, 'toxin_launcher');
assert(buy.ok, `toxin launcher should be buyable: ${buy.reason || ''}`);
let actions = K.getAvailableActions(world);
assert(actions.some(a => a.id === 'acid'), 'toxic launcher action appears after graft');
K.step(world, { acid: true, aimX: 1, aimY: 0 }, 1 / 60);
const h1 = world.hazards.length;
K.step(world, { acid: true, aimX: 1, aimY: 0 }, 1 / 60);
assert(world.hazards.length === h1, 'toxic launcher cooldown prevents stream fire');

// Player radius should grow with organelles and resource fullness.
const r0 = player.r;
player.organelles.storage_vacuole = 2;
player.cargo.biomass = K.__test.caps(player).biomass;
player.cargo.lipids = K.__test.caps(player).lipids;
player.cargo.energy = K.__test.caps(player).energy;
K.step(world, {}, 1 / 60);
assert(K.getPlayer(world).r > r0 + 4, 'player body inflates with storage/organs/fullness');

// Algae should have large growth caps and eventually sink toward rupture.
const alga = K.__test.spawnAlgae(world, { mature: true, y: K.WORLD.canopy + 120, x: 800, biomass: 180 });
assert(K.__test.caps(alga).biomass > 260, 'algae biomass cap supports maturation');
const y0 = alga.y;
alga.cargo.biomass = K.__test.caps(alga).biomass * 0.9;
for (let i = 0; i < 360; i++) K.step(world, {}, 1 / 60);
assert(alga.y > y0 + 30 || alga.fallState === 'sinking', 'mature algae should enter fall pressure');

const hud = K.getHudProjection(world);
assert(res(hud, 'energy').label === 'ATP', 'energy resource is labeled ATP');
console.log('MOBILE_V1_2_2_TROPHIC_PRESSURE_SHOP_GROUPS_SMOKE_OK');
