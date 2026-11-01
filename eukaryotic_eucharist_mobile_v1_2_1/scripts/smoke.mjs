import * as K from '../src/graph_kernel.mjs';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}
function res(hud, id) {
  return hud.resources.find(r => r.id === id);
}

const world = K.createWorld({ seed: 121 });
assert(K.VERSION.includes('v1_2_1'), 'version should be v1.2.1');
let player = K.getPlayer(world);
assert(player.organelles.fermentation_matrix === 1, 'starter has one fermentation matrix');
assert(!player.organelles.toxin_launcher, 'starter has no toxic launcher');
assert(!player.organelles.rasping_lamella, 'starter has no rasping lamella');
assert(world.entities.length > 45 && world.fields.length > 10, 'mature ecology seeded');

// Fermentation should produce net ATP when biomass is available and the tank is low.
player.cargo.energy = 2;
player.cargo.biomass = K.__test.caps(player).biomass;
const e0 = player.cargo.energy;
for (let i = 0; i < 120; i++) K.step(world, {}, 1 / 60);
player = K.getPlayer(world);
assert(player.cargo.energy > e0 + 0.4, `fermentation should net ATP; got ${player.cargo.energy} from ${e0}`);
assert(player.cargo.biomass < K.__test.caps(player).biomass, 'fermentation consumes biomass');

// Soft bodies should be allowed to overlap; contact is no longer a wall.
const a = K.__test.spawnScavenger(world, { x: 300, y: K.WORLD.nurseryTop + 200 });
const b = K.__test.spawnScavenger(world, { x: 300, y: K.WORLD.nurseryTop + 200 });
a.vx = a.vy = b.vx = b.vy = 0;
K.step(world, {}, 0);
const d = K.__test.distWrap(a.x, a.y, b.x, b.y);
assert(d < a.r + b.r, 'overlapping bodies should not be separated by collision resolution');

// Sinking algae should descend toward the rupture layer.
const alga = K.__test.spawnAlgae(world, { mature: true, y: K.WORLD.nurseryBottom - 80, x: 800, biomass: 210, fallState: 'sinking' });
const y0 = alga.y;
for (let i = 0; i < 180; i++) K.step(world, {}, 1 / 60);
assert(alga.y > y0 + 20, `sinking alga should descend; moved ${alga.y - y0}`);

// Toxic Launcher should be late tier, purchasable as organelle, not a starter action.
let actions = K.getAvailableActions(world);
assert(!actions.some(a => a.id === 'acid'), 'starter has no Toxic Launcher action');
player = K.getPlayer(world);
player.cargo.biomass = 100; player.cargo.toxins = 100; player.cargo.crystals = 20;
const buy = K.buyOffering(world, 'toxin_launcher');
assert(buy.ok, `toxin launcher should be buyable with costs: ${buy.reason || ''}`);
assert(K.getAvailableActions(world).some(a => a.id === 'acid'), 'toxic launcher action appears after graft');

// Self-lysis should produce a new player body on next step.
const oldId = K.getPlayer(world).id;
const killed = K.killPlayer(world);
assert(killed.ok, 'killPlayer succeeds');
K.step(world, {}, 1 / 60);
assert(K.getPlayer(world).id !== oldId, 'self-lysis respawns a new player body');

const hud = K.getHudProjection(world);
assert(res(hud, 'energy').label === 'energy', 'energy resource still projected');
console.log('MOBILE_V1_2_1_OVERLAP_FERMENTATION_SMOKE_OK');
