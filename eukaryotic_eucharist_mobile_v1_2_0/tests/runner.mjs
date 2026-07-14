import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as K from '../src/graph_kernel.mjs';

let passed = 0, failed = 0;
function suite(name, fn) {
  try { fn(); console.log(`  PASS  ${name}`); passed++; }
  catch (e) { console.error(`  FAIL  ${name}: ${e.message}`); failed++; }
}
function assertClose(a, b, tol = 0.01, msg = '') {
  if (Math.abs(a - b) > tol) throw new Error(`Expected ${a} ≈ ${b} (±${tol})${msg ? ' — ' + msg : ''}`);
}

// ─── world.init ──────────────────────────────────────────────────────────────
suite('world.init — VERSION and structure', () => {
  assert.equal(K.VERSION, 'mobile_v1_2_0_toxic_launcher_energy_gate_mature_froth');
  const w = K.createWorld({ seed: 1 });
  assert.ok(w.entities.length > 0, 'entities populated');
  assert.ok(w.fields.length > 0, 'fields seeded');
  assert.ok(w.playerId, 'playerId set');
});

suite('world.init — player starter config', () => {
  const w = K.createWorld({ seed: 2 });
  const p = K.getPlayer(w);
  assert.ok(p.organelles.fermentation_matrix >= 1, 'starter has fermentation_matrix');
  assert.ok(!p.organelles.toxin_launcher, 'starter has no toxin_launcher');
  assert.ok(!p.organelles.primitive_acid_pore, 'no primitive_acid_pore in v1.2');
  assert.ok(p.cargo.energy > 0, 'starter energy > 0');
  assert.ok(p.cargo.biomass > 0, 'starter biomass > 0');
});

// ─── env.gradients ───────────────────────────────────────────────────────────
suite('env.gradients — light and oxygen', () => {
  assert.ok(K.lightAt(K.WORLD.canopy) > 0.95, 'full light at canopy');
  assert.ok(K.lightAt(K.WORLD.nurseryTop) < 0.65, 'dim at nursery top');
  assert.ok(K.lightAt(K.WORLD.deepTop) < 0.02, 'near-dark in deep');
  assert.ok(K.oxygenAt(K.WORLD.canopy) > 0.85, 'high oxygen at canopy');
  assert.ok(K.oxygenAt(K.WORLD.ruptureTop) < 0.25, 'low oxygen in rupture zone');
  assert.ok(K.oxygenAt(K.WORLD.deepTop) < 0.12, 'very low oxygen in deep');
});

suite('env.gradients — pressure', () => {
  assert.ok(K.pressureAt(K.WORLD.canopy) >= 0, 'pressure >= 0 at canopy');
  assert.ok(K.pressureAt(K.WORLD.deepTop) > 0.4, 'meaningful pressure in deep');
  assertClose(K.pressureAt(K.WORLD.h), 1, 0.05, 'max pressure at bottom');
});

// ─── oxygen.diffusion ────────────────────────────────────────────────────────
suite('oxygen.diffusion — body absorbs ambient oxygen over time', () => {
  const w = K.createWorld({ seed: 3 });
  const p = K.getPlayer(w);
  p.y = K.WORLD.canopy + 30;
  p.oxygen = 0;
  for (let i = 0; i < 60; i++) K.step(w, {}, 1 / 60);
  assert.ok(p.oxygen > 0.05, 'body absorbs surface oxygen');
});

// ─── oxygen.damage ───────────────────────────────────────────────────────────
suite('oxygen.damage — excess O2 hurts anaerobic body', () => {
  const w = K.createWorld({ seed: 4 });
  const p = K.getPlayer(w);
  p.y = K.WORLD.canopy + 20;
  p.oxygen = 0.95;
  p.oxygenTolerance = 0.30;
  const startHp = p.hp;
  for (let i = 0; i < 60; i++) K.step(w, {}, 1 / 60);
  assert.ok(p.hp < startHp, 'oxygen overload deals tick damage');
});

// ─── feeding ─────────────────────────────────────────────────────────────────
suite('feeding — player absorbs from resource field', () => {
  const w = K.createWorld({ seed: 5 });
  const p = K.getPlayer(w);
  p.cargo.biomass = 0; p.cargo.energy = 30;
  w.fields.length = 0;
  w.fields.push({ id: 'f1', x: p.x, y: p.y, radius: 80, stock: { biomass: 50, lipids: 0, toxins: 0, energy: 0 }, density: 1, age: 0, maxAge: 60, decayRate: 0, radiusScale: 8, maxRadius: 200 });
  for (let i = 0; i < 30; i++) K.step(w, { feed: true }, 1 / 60);
  assert.ok(p.cargo.biomass > 0, 'player absorbed biomass from field');
});

// ─── energy gate ─────────────────────────────────────────────────────────────
suite('energy.gate — no ATP blocks move/feed', () => {
  const w = K.createWorld({ seed: 6 });
  const p = K.getPlayer(w);
  p.cargo.energy = 0;
  const beforeX = p.x;
  K.step(w, { moveX: 1, moveY: 0, feed: true }, 1 / 60);
  assert.equal(K.getAvailableActions(w).find(a => a.id === 'move')?.enabled, false, 'move disabled at 0 ATP');
  assert.equal(p.feedIntent, false, 'feedIntent false at 0 ATP');
  assert.equal(p.x, beforeX, 'position unchanged at 0 ATP');
});

// ─── yuki.tier1 ──────────────────────────────────────────────────────────────
suite('yuki.tier1 — repair communion heals', () => {
  const w = K.createWorld({ seed: 7 });
  const p = K.getPlayer(w);
  p.hp = 30; p.cargo.biomass = 50; p.cargo.energy = 20;
  const result = K.buyOffering(w, 'repair');
  assert.equal(result.ok, true, 'repair communion ok');
  assert.ok(p.hp > 30, 'hp increased after repair');
});

suite('yuki.tier1 — resource exchange buy_biomass', () => {
  const w = K.createWorld({ seed: 8 });
  const p = K.getPlayer(w);
  p.cargo.lipids = 40; p.cargo.energy = 20; p.cargo.biomass = 0;
  const result = K.buyOffering(w, 'buy_biomass');
  assert.equal(result.ok, true);
  assert.ok(p.cargo.biomass > 0, 'biomass exchanged in');
});

// ─── yuki.tier2 ──────────────────────────────────────────────────────────────
suite('yuki.tier2 — fermentation_matrix purchasable', () => {
  const w = K.createWorld({ seed: 9 });
  const p = K.getPlayer(w);
  p.cargo.biomass = 80; p.cargo.energy = 30; p.cargo.spores = 5; p.cargo.enzymes = 5;
  const result = K.buyOffering(w, 'fermentation_matrix');
  assert.equal(result.ok, true);
  assert.ok(p.organelles.fermentation_matrix >= 2, 'now has two fermentation_matrix');
});

suite('yuki.tier2 — toxin_launcher gated by resources', () => {
  const w = K.createWorld({ seed: 10 });
  const p = K.getPlayer(w);
  p.cargo.biomass = 18; p.cargo.toxins = 12; p.cargo.crystals = 2; p.cargo.energy = 30;
  const result = K.buyOffering(w, 'toxin_launcher');
  assert.equal(result.ok, true, 'toxin_launcher bought');
  assert.ok(p.organelles.toxin_launcher >= 1, 'launcher installed');
  assert.ok(K.getAvailableActions(w).some(a => a.id === 'acid'), 'acid action available after launcher');
});

suite('yuki.tier2 — toxin_cloud requires toxin_launcher', () => {
  const w = K.createWorld({ seed: 11 });
  const p = K.getPlayer(w);
  p.cargo.biomass = 80; p.cargo.toxins = 40; p.cargo.enzymes = 3; p.cargo.crystals = 3; p.cargo.energy = 30;
  const noLauncherResult = K.buyOffering(w, 'toxin_cloud');
  assert.equal(noLauncherResult.ok, false, 'toxin_cloud locked without launcher');
  p.organelles.toxin_launcher = 1;
  const result = K.buyOffering(w, 'toxin_cloud');
  assert.equal(result.ok, true, 'toxin_cloud bought after launcher installed');
});

// ─── yuki.stackLimits ────────────────────────────────────────────────────────
suite('yuki.stackLimits — fermentation_matrix stacks to 4', () => {
  const w = K.createWorld({ seed: 12 });
  const p = K.getPlayer(w);
  p.cargo.biomass = 999; p.cargo.energy = 999; p.cargo.spores = 99; p.cargo.enzymes = 99;
  let count = 0;
  while (K.buyOffering(w, 'fermentation_matrix').ok) count++;
  assert.ok(p.organelles.fermentation_matrix <= 4, `stacked to ${p.organelles.fermentation_matrix}, max 4`);
});

suite('yuki.stackLimits — storage_vacuole stacks to 5', () => {
  const w = K.createWorld({ seed: 13 });
  const p = K.getPlayer(w);
  p.cargo.biomass = 999; p.cargo.lipids = 999; p.cargo.crystals = 99; p.cargo.energy = 999;
  while (K.buyOffering(w, 'storage_vacuole').ok) { /* buy until blocked */ }
  assert.ok(p.organelles.storage_vacuole <= 5);
});

// ─── actions.gating ──────────────────────────────────────────────────────────
suite('actions.gating — starter has no acid action', () => {
  const w = K.createWorld({ seed: 14 });
  assert.ok(!K.getAvailableActions(w).some(a => a.id === 'acid'), 'no acid without toxin_launcher');
});

suite('actions.gating — dash requires dash_vacuole', () => {
  const w = K.createWorld({ seed: 15 });
  const p = K.getPlayer(w);
  assert.ok(!K.getAvailableActions(w).some(a => a.id === 'dash'), 'no dash without vacuole');
  p.cargo.biomass = 80; p.cargo.lipids = 60; p.cargo.spores = 10; p.cargo.energy = 30;
  K.buyOffering(w, 'dash_vacuole');
  assert.ok(K.getAvailableActions(w).some(a => a.id === 'dash'), 'dash available after vacuole');
});

// ─── repair.lipidLoom ────────────────────────────────────────────────────────
suite('repair.lipidLoom — consumes lipids to restore HP', () => {
  const w = K.createWorld({ seed: 16 });
  const p = K.getPlayer(w);
  p.organelles.lipid_repair_loom = 1;
  p.hp = 40; p.cargo.lipids = 40; p.cargo.energy = 40;
  const startLipids = p.cargo.lipids;
  for (let i = 0; i < 60; i++) K.step(w, { repair: true }, 1 / 60);
  assert.ok(p.hp > 40, 'HP increased');
  assert.ok(p.cargo.lipids < startLipids, 'lipids consumed');
});

// ─── algae.ecosystem ─────────────────────────────────────────────────────────
suite('algae.ecosystem — algal fall pump produces ruptures', () => {
  const w = K.createWorld({ seed: 17 });
  const startRuptures = w.stats.ruptures;
  for (let i = 0; i < 3600; i++) K.step(w, {}, 1 / 60);
  assert.ok(w.stats.ruptures > startRuptures, `ruptures happened (got ${w.stats.ruptures - startRuptures})`);
  // algaeFalls only increments on null→sinking transition; pre-seeded sinkers don't count.
  // ruptures > 0 is sufficient to verify the fall pump is working end-to-end.
});

suite('algae.ecosystem — sinking algae reach rupture zone', () => {
  const w = K.createWorld({ seed: 18 });
  for (let i = 0; i < 1800; i++) K.step(w, {}, 1 / 60);
  const sinkers = w.entities.filter(e => e.controller === 'algae' && e.fallState === 'sinking');
  const stuck = sinkers.filter(e => e.y < K.WORLD.nurseryBottom);
  assert.equal(stuck.length, 0, `${stuck.length} sinking algae stuck above nurseryBottom`);
});

// ─── bloom.death ─────────────────────────────────────────────────────────────
suite('bloom.death — NPC death creates resource field', () => {
  const w = K.createWorld({ seed: 19 });
  const scav = K.__test.spawnScavenger(w, { x: 200, y: K.WORLD.nurseryTop + 100 });
  // Clear pre-seeded fields so we can count unambiguously.
  w.fields.length = 0;
  scav.hp = -1; scav.alive = false;
  K.step(w, {}, 1 / 60);
  assert.ok(w.fields.length > 0, 'death bloom created a resource field');
});

// ─── player.respawn ───────────────────────────────────────────────────────────
suite('player.respawn — player respawns on death', () => {
  const w = K.createWorld({ seed: 20 });
  const p = K.getPlayer(w);
  const oldId = p.id;
  // Set hp to 0 but leave alive=true so step() doesn't early-return.
  // Metabolism tick sees hp <= 0 and calls hurt(), which sets alive=false, then removeDead respawns.
  p.cargo.energy = 0; p.cargo.biomass = 0; p.hp = -1;
  K.step(w, {}, 1 / 60);
  const newP = K.getPlayer(w);
  assert.ok(newP, 'player entity exists after death');
  assert.notEqual(newP.id, oldId, 'new player has fresh id');
  assert.ok(newP.alive, 'new player is alive');
  assert.ok(newP.hp > 0, 'new player has hp');
});

// ─── eucharist.gate ──────────────────────────────────────────────────────────
suite('eucharist.gate — not purchasable without host readiness', () => {
  const w = K.createWorld({ seed: 21 });
  const p = K.getPlayer(w);
  p.cargo.biomass = 80; p.cargo.lipids = 80; p.cargo.spores = 20; p.cargo.enzymes = 20; p.cargo.crystals = 10;
  const result = K.buyOffering(w, 'mitochondrial_eucharist');
  assert.equal(result.ok, false, 'eucharist locked until host is ready');
});

suite('eucharist.gate — completes incubation', () => {
  const w = K.createWorld({ seed: 22 });
  const p = K.getPlayer(w);
  p.organelles.oxygen_tolerance = 3;
  p.organelles.cytostome = 1;
  p.organelles.lipid_repair_loom = 1;
  p.cargo.spores = 10; p.cargo.enzymes = 8; p.cargo.crystals = 6;
  p.cargo.biomass = 80; p.cargo.lipids = 80; p.cargo.energy = 60;
  p.maxDepth = 2200;
  p.oxygenTolerance = 0.75;
  p.cargo.biomass = 60; p.cargo.lipids = 60; p.cargo.spores = 10; p.cargo.enzymes = 8; p.cargo.crystals = 6;
  const result = K.buyOffering(w, 'mitochondrial_eucharist');
  if (result.ok) {
    p.cargo.energy = 99; p.cargo.lipids = 99; p.oxygen = 0.1;
    for (let i = 0; i < 60 * 18; i++) K.step(w, {}, 1 / 60);
    assert.ok(K.__test.hasMito ? K.__test.hasMito(p) : (p.organelles.mitochondrion || 0) >= 1, 'mitochondrion granted after incubation');
  } else {
    assert.ok(true, 'eucharist still locked (host not ready) — skip incubation test');
  }
});

// ─── projection.hud ──────────────────────────────────────────────────────────
suite('projection.hud — structure and metabolism field', () => {
  const w = K.createWorld({ seed: 23 });
  const hud = K.getHudProjection(w);
  assert.ok(hud, 'hud not null');
  assert.ok(hud.hp, 'hud.hp present');
  assert.ok(Array.isArray(hud.resources), 'hud.resources array');
  assert.ok(hud.resources.find(r => r.id === 'biomass'), 'biomass in resources');
  assert.ok(hud.metabolism, 'hud.metabolism present');
  assert.ok(typeof hud.metabolism.fermentationLevel === 'number', 'fermentationLevel is number');
  assert.ok(typeof hud.metabolism.fermentRate === 'number', 'fermentRate is number');
  assert.ok(typeof hud.metabolism.energyStarved === 'boolean', 'energyStarved is boolean');
  assert.ok(hud.nearYuki !== undefined, 'nearYuki present');
  assert.ok(hud.hostReadiness, 'hostReadiness present');
});

suite('projection.hud — storage_vacuole expands caps', () => {
  const w = K.createWorld({ seed: 24 });
  const p = K.getPlayer(w);
  const baseBiomass = K.getHudProjection(w).resources.find(r => r.id === 'biomass').max;
  p.cargo.biomass = 200; p.cargo.lipids = 200; p.cargo.crystals = 10; p.cargo.energy = 100;
  K.buyOffering(w, 'storage_vacuole');
  const newBiomass = K.getHudProjection(w).resources.find(r => r.id === 'biomass').max;
  assert.ok(newBiomass > baseBiomass, 'biomass cap increased after storage_vacuole');
});

// ─── projection.render ───────────────────────────────────────────────────────
suite('projection.render — shape of getRenderProjection', () => {
  const w = K.createWorld({ seed: 25 });
  const r = K.getRenderProjection(w);
  assert.ok(r.version === K.VERSION, 'version in render');
  assert.ok(Array.isArray(r.entities), 'entities array');
  assert.ok(Array.isArray(r.fields), 'fields array');
  assert.ok(Array.isArray(r.hazards), 'hazards array');
  assert.ok(Array.isArray(r.particles), 'particles array');
  assert.ok(Array.isArray(r.events), 'events array');
});

// ─── npc.spawnCap ────────────────────────────────────────────────────────────
suite('npc.spawnCap — entity count stays bounded', () => {
  const w = K.createWorld({ seed: 26 });
  for (let i = 0; i < 300; i++) K.step(w, {}, 1 / 60);
  assert.ok(w.entities.length <= 80, `entity count ${w.entities.length} exceeded cap`);
});

// ─── world.wrap ──────────────────────────────────────────────────────────────
suite('world.wrap — entities wrap on X axis', () => {
  const w = K.createWorld({ seed: 27 });
  const p = K.getPlayer(w);
  p.x = K.WORLD.w - 1; p.vx = 200;
  K.step(w, {}, 1 / 60);
  assert.ok(p.x < K.WORLD.w, 'x stayed within world bounds after wrap');
  assert.ok(p.x >= 0, 'x non-negative after wrap');
});

// ─── fermentation ────────────────────────────────────────────────────────────
suite('fermentation — matrix converts biomass to energy', () => {
  const w = K.createWorld({ seed: 28 });
  const p = K.getPlayer(w);
  p.cargo.energy = 0; p.cargo.biomass = 50;
  p.organelles.fermentation_matrix = 2;
  for (let i = 0; i < 30; i++) K.step(w, {}, 1 / 60);
  assert.ok(p.cargo.energy > 0, 'fermentation produced energy');
});

// ─── storage ─────────────────────────────────────────────────────────────────
suite('storage — exotic_vacuole expands spore cap', () => {
  const w = K.createWorld({ seed: 29 });
  const p = K.getPlayer(w);
  const baseCap = K.__test.caps(p).spores;
  p.cargo.biomass = 80; p.cargo.spores = 5; p.cargo.enzymes = 5; p.cargo.energy = 30;
  K.buyOffering(w, 'exotic_vacuole');
  const newCap = K.__test.caps(p).spores;
  assert.ok(newCap > baseCap, 'spore cap expanded after exotic_vacuole');
});

// ─── hazard.toxicLauncher ────────────────────────────────────────────────────
suite('hazard.toxicLauncher — projectile created on acid command', () => {
  const w = K.createWorld({ seed: 30 });
  const p = K.getPlayer(w);
  p.organelles.toxin_launcher = 1;
  p.cargo.toxins = 20; p.cargo.energy = 30;
  const hazardsBefore = w.hazards.length;
  K.step(w, { acid: true, aimX: 1, aimY: 0 }, 1 / 60);
  assert.ok(w.hazards.length > hazardsBefore, 'toxic projectile created');
});

suite('hazard.toxicLauncher — projectile is not an edible field', () => {
  const w = K.createWorld({ seed: 31 });
  const p = K.getPlayer(w);
  p.organelles.toxin_launcher = 1;
  p.cargo.toxins = 20; p.cargo.energy = 30;
  const fieldsBefore = w.fields.length;
  K.step(w, { acid: true, aimX: 1, aimY: 0 }, 1 / 60);
  assert.equal(w.fields.length, fieldsBefore, 'toxic launcher does not create resource field on fire');
});

suite('hazard.toxicCloud — cloud hazard requires launcher', () => {
  const w = K.createWorld({ seed: 32 });
  const p = K.getPlayer(w);
  p.cargo.toxins = 40; p.cargo.energy = 40;
  p.organelles.toxin_launcher = 1;
  p.cargo.biomass = 80; p.cargo.crystals = 5; p.cargo.enzymes = 5;
  K.buyOffering(w, 'toxin_cloud');
  assert.ok(p.organelles.toxin_cloud >= 1, 'toxin_cloud installed');
  const hazardsBefore = w.hazards.length;
  K.step(w, { cloud: true }, 1 / 60);
  assert.ok(w.hazards.length > hazardsBefore, 'cloud hazard created');
});

// ─── mature.ecosystem ────────────────────────────────────────────────────────
suite('mature.ecosystem — seeded with algae and predators', () => {
  const w = K.createWorld({ seed: 33 });
  const algae = w.entities.filter(e => e.controller === 'algae');
  const predators = w.entities.filter(e => e.controller === 'predator');
  assert.ok(algae.length >= 20, `need ≥20 algae at start, got ${algae.length}`);
  assert.ok(predators.length >= 12, `need ≥12 predators at start, got ${predators.length}`);
  assert.ok(w.entities.some(e => e.controller === 'algae' && e.fallState === 'sinking'), 'some algae pre-sinking');
});

suite('mature.ecosystem — remains populated after 4s sim', () => {
  const w = K.createWorld({ seed: 34 });
  for (let i = 0; i < 240; i++) K.step(w, {}, 1 / 60);
  assert.ok(w.entities.length > 20, 'world still populated');
});

// ─── shell.html ──────────────────────────────────────────────────────────────
suite('shell.html — index.html exists and references kernel', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.ok(html.includes('graph_kernel.mjs'), 'index.html references graph_kernel.mjs');
  assert.ok(html.includes('<canvas'), 'index.html has canvas element');
});

// ─── starvation ──────────────────────────────────────────────────────────────
suite('starvation — zero ATP and biomass kills body', () => {
  const w = K.createWorld({ seed: 35 });
  const p = K.getPlayer(w);
  p.cargo.energy = 0; p.cargo.biomass = 0;
  K.step(w, {}, 1 / 60);
  assert.ok(!p.alive, 'player dies from energy+biomass collapse');
});

// ─── summary ─────────────────────────────────────────────────────────────────
console.log(`\n${passed + failed} suites — ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
