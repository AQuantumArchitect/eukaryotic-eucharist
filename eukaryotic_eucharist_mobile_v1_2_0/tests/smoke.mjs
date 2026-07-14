import assert from 'node:assert/strict';
import * as K from '../src/graph_kernel.mjs';

const world = K.createWorld({ seed: 120 });
const player = K.getPlayer(world);
assert.equal(K.VERSION, 'mobile_v1_2_0_toxic_launcher_energy_gate_mature_froth');
assert.ok(K.WORLD.w <= 1900, 'arena width should be compressed');
assert.ok(!K.getHudProjection(world).resources.some(r => r.id === 'vacuoles'), 'vacuoles should not be a resource');
assert.ok(player.organelles.fermentation_matrix >= 1, 'starter has one fermentation matrix');
assert.ok(!player.organelles.toxin_launcher, 'starter has no toxic launcher');
assert.ok(!K.getAvailableActions(world).some(a => a.id === 'acid'), 'starter has no acid/toxic launcher action');

const caps = K.__test.caps(player);
assert.ok(caps.biomass <= 30, 'starter biomass capacity is small');
assert.ok(caps.lipids <= 25, 'starter lipid capacity is small');

player.cargo.energy = 0;
let beforeX = player.x;
K.step(world, { moveX: 1, moveY: 0, feed: true }, 1 / 60);
assert.equal(K.getAvailableActions(world).find(a => a.id === 'move')?.enabled, false, 'no ATP blocks movement');
assert.equal(player.feedIntent, false, 'no ATP blocks feeding action');
assert.equal(player.x, beforeX, 'no ATP prevents active movement impulse');

player.cargo.energy = 50;
player.cargo.biomass = 20;
player.cargo.lipids = 12;
player.cargo.toxins = 20;
player.cargo.crystals = 3;
assert.equal(K.buyOffering(world, 'toxin_launcher').ok, true, 'toxic launcher can be bought');
assert.ok(player.organelles.toxin_launcher, 'toxic launcher grafted');
assert.ok(K.getAvailableActions(world).some(a => a.id === 'acid' && a.label === 'Toxic Launcher'), 'launcher action visible');

const fieldCountBefore = world.fields.length;
const hazardCountBefore = world.hazards.length;
K.step(world, { acid: true, aimX: 1, aimY: 0 }, 1 / 60);
assert.ok(world.hazards.length > hazardCountBefore, 'toxic launcher creates hazard/projectile');
assert.equal(world.fields.length, fieldCountBefore, 'toxic launcher should not create edible resource field');

const predator = K.__test.spawnPredator(world, { x: player.x + 10, y: player.y });
player.organelles.rasping_lamella = 1;
player.cargo.energy = 50;
const hpBefore = predator.hp;
K.step(world, { rasp: true }, 1 / 60);
assert.ok(predator.hp < hpBefore - 1, 'rasping damage is materially high');

const starvation = K.createWorld({ seed: 121 });
const starvingPlayer = K.getPlayer(starvation);
starvingPlayer.cargo.energy = 0;
starvingPlayer.cargo.biomass = 0;
K.step(starvation, {}, 1 / 60);
assert.ok(!starvingPlayer.alive, 'zero ATP and zero biomass kills the body');

console.log('MOBILE_V1_2_0_TOXIC_LAUNCHER_ENERGY_GATE_SMOKE_OK');
