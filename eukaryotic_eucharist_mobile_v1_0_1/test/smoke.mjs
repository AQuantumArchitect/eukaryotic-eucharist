import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as K from '../src/graph_kernel.mjs';

const world = K.createWorld({ seed: 101 });
const player = K.getPlayer(world);
assert.equal(K.VERSION, 'mobile_v1_0_1_oxygen_eucharist_polish');

// Purchase availability: Tier 1 exchange must actually buy when affordable.
player.hp = 40;
let repair = K.getYukiOfferings(world).find(o => o.id === 'repair');
assert.equal(repair.locked, false, `repair unexpectedly locked: ${repair.reasons?.join('; ')}`);
let res = K.buyOffering(world, 'repair');
assert.equal(res.ok, true, res.reason);
assert.ok(player.hp > 40, 'repair should heal the player');

// Purchase availability: rich player should be able to buy Tier 2 grafts without DNA.
Object.assign(player.cargo, { biomass: 120, lipids: 120, energy: 90, spores: 10, enzymes: 10, crystals: 10, vacuoles: 10, dna: 0, toxins: 30 });
let offers = K.getYukiOfferings(world);
for (const id of ['cytostome', 'lipid_repair_loom', 'oxygen_tolerance', 'photosystem', 'rasping_lamella']) {
  const o = offers.find(x => x.id === id);
  assert.ok(o, `missing offering ${id}`);
  assert.equal(o.locked, false, `${id} locked: ${o.reasons?.join('; ')}`);
  assert.equal(Object.hasOwn(o.cost ?? {}, 'dna'), false, `${id} should not require DNA`);
}
assert.equal(K.buyOffering(world, 'cytostome').ok, true, 'cytostome purchase should succeed');

// Algae should be specialized surface organisms: O2 should not kill them at the canopy.
const eco = K.createWorld({ seed: 4 });
for (let i = 0; i < 60 * 45; i++) K.step(eco, {}, 1 / 60);
const algae = K.getRenderProjection(eco).entities.filter(e => e.controller === 'algae');
assert.ok(algae.length >= 8, 'surface algae population should persist');
for (const a of algae.slice(0, 5)) assert.ok(a.oxygen <= a.oxygenTolerance + 0.02, `algae oxygen overload ${a.oxygen} > ${a.oxygenTolerance}`);
for (let i = 0; i < 60 * 45; i++) K.step(eco, {}, 1 / 60);
assert.ok(eco.stats.algaeFalls >= 1, 'at least one biomass-heavy algae should enter fall state');

// UI polish is present in the single-file shell.
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
assert.match(html, /if\(ui\.shopOverlay\.style\.display==='flex'\) closeShop\(\)/, 'E/Yuki controls should toggle out of the shop');
assert.match(html, /exchangeFlow/, 'exchange cards should have tank-like flow styling');
assert.match(html, /data-kind="\$\{o\.kind\}"/, 'offer cards should carry kind metadata for purchase feedback');

console.log('MOBILE_V1_0_1_POLISH_SMOKE_OK');
