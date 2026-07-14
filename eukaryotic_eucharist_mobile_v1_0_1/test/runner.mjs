/**
 * Eukaryotic Eucharist v1.0.1 — test runner
 * Runs all suites and emits a structured report.
 * Each suite is self-contained; failures in one do not abort others.
 */

import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as K from '../src/graph_kernel.mjs';

const suites = [];
let totalPass = 0, totalFail = 0;

function suite(name, fn) { suites.push({ name, fn }); }
function step60(world, cmds = {}, seconds = 1) { for (let i = 0; i < 60 * seconds; i++) K.step(world, cmds, 1 / 60); }
function richCargo(overrides = {}) {
  return { biomass: 120, lipids: 120, energy: 90, spores: 10, enzymes: 10, crystals: 10, vacuoles: 10, dna: 0, toxins: 30, ...overrides };
}

// ─── World initialisation ────────────────────────────────────────────────────
suite('world.init', () => {
  const w = K.createWorld({ seed: 1 });
  assert.equal(w.version, K.VERSION);
  assert.ok(w.playerId, 'playerId assigned');
  const p = K.getPlayer(w);
  assert.ok(p, 'player entity exists');
  assert.equal(p.kind, 'player');
  assert.ok(p.hp > 0, 'player starts with HP');
  assert.ok(w.entities.filter(e => e.controller === 'scavenger').length >= 6, 'scavengers spawned');
  assert.ok(w.entities.filter(e => e.controller === 'algae').length >= 4, 'algae spawned');
  assert.ok(w.entities.filter(e => e.controller === 'predator').length >= 2, 'predators spawned');
  assert.ok(w.entities.filter(e => e.controller === 'protozoan').length >= 1, 'protozoa spawned');
  assert.ok(w.fields.length >= 3, 'initial rupture fields exist');
});

// ─── Environment gradients ───────────────────────────────────────────────────
suite('env.gradients', () => {
  // Oxygen: high at surface, low at depth
  assert.ok(K.oxygenAt(K.WORLD.canopy + 10) > 0.85, 'surface O2 is high');
  assert.ok(K.oxygenAt(K.WORLD.ruptureTop + 500) < 0.25, 'deep O2 is low');
  assert.ok(K.oxygenAt(K.WORLD.canopy) > K.oxygenAt(K.WORLD.nurseryTop), 'O2 falls with depth');
  // Light: high at surface, near zero at depth
  assert.ok(K.lightAt(K.WORLD.canopy + 10) > 0.95, 'surface light is high');
  assert.ok(K.lightAt(K.WORLD.deepTop) < 0.01, 'deep light is near zero');
  // Pressure: rises with depth
  assert.ok(K.pressureAt(K.WORLD.canopy) === 0, 'pressure zero at canopy');
  assert.ok(K.pressureAt(K.WORLD.h) === 1, 'pressure one at bottom');
});

// ─── Oxygen diffusion ────────────────────────────────────────────────────────
suite('oxygen.diffusion', () => {
  const w = K.createWorld({ seed: 2 });
  const p = K.getPlayer(w);
  p.y = K.WORLD.canopy + 60;
  p.oxygen = 0.02;
  const before = p.oxygen;
  step60(w, {}, 1);
  assert.ok(p.oxygen > before, 'oxygen drifts up toward surface concentration');

  // Diving vents oxygen passively
  const w2 = K.createWorld({ seed: 3 });
  const p2 = K.getPlayer(w2);
  p2.y = K.WORLD.canopy + 60;
  p2.oxygen = 0.80;
  step60(w2, { moveY: 1 }, 2); // drive downward
  assert.ok(p2.oxygen < 0.80, 'oxygen vents passively while diving');
});

// ─── Oxygen damage ───────────────────────────────────────────────────────────
suite('oxygen.damage', () => {
  const w = K.createWorld({ seed: 10 });
  const p = K.getPlayer(w);
  p.y = K.WORLD.canopy + 50;
  p.oxygen = 0.95;   // way above tolerance
  p.grace = 0;
  const hpBefore = p.hp;
  step60(w, {}, 1);
  assert.ok(p.hp < hpBefore, 'surface O2 overload deals damage');

  // Oxygen tolerance organelle should raise the threshold
  const w2 = K.createWorld({ seed: 11 });
  const p2 = K.getPlayer(w2);
  Object.assign(p2.cargo, richCargo());
  K.buyOffering(w2, 'oxygen_tolerance');
  K.buyOffering(w2, 'oxygen_tolerance');
  const tol2 = p2.oxygenTolerance + (p2.organelles.oxygen_tolerance || 0) * 0.18;
  assert.ok(tol2 > 0.32, 'stacked tolerance raises threshold');
});

// ─── Feeding ────────────────────────────────────────────────────────────────
suite('feeding', () => {
  const w = K.createWorld({ seed: 20 });
  const p = K.getPlayer(w);
  p.x = 500; p.y = K.WORLD.ruptureTop + 80;
  w.fields.push({ id: 'f1', x: 500, y: p.y, radius: 80, stock: { biomass: 60, lipids: 30, toxins: 0, energy: 10, spores: 0, enzymes: 0, crystals: 0, vacuoles: 0, dna: 0 }, density: 1, sourceKind: 'test', age: 0, maxAge: 60, decayRate: 0, radiusScale: 8, maxRadius: 180 });
  const f = w.fields.find(x => x.id === 'f1');
  const bBefore = f.stock.biomass;
  step60(w, { feed: true }, 1);
  assert.ok(f.stock.biomass < bBefore, 'feeding drains biomass from field');
  assert.ok(p.cargo.biomass > 12, 'player cargo biomass increased');

  // Toxins are absorbed reluctantly without toxin_sac
  const tField = w.fields.find(x => x.id === 'f1');
  if (tField) {
    tField.stock.toxins = 40;
    const toxBefore = p.cargo.toxins;
    step60(w, { feed: true }, 1);
    const toxFlow = p.cargo.toxins - toxBefore;
    const bioFlow = p.cargo.biomass - 12;
    // toxin affinity is 0.10 vs biomass 1.0 — absorption should be much slower
    assert.ok(toxFlow < bioFlow + 1, 'toxins absorbed much slower than biomass without toxin_sac');
  }
});

// ─── Tier 1 Yuki exchanges ──────────────────────────────────────────────────
suite('yuki.tier1', () => {
  const w = K.createWorld({ seed: 30 });
  const p = K.getPlayer(w);

  // Repair healing
  p.hp = 40; p.cargo.biomass = 20;
  const res = K.buyOffering(w, 'repair');
  assert.equal(res.ok, true, 'repair purchase ok');
  assert.ok(p.hp > 40, 'repair heals HP');

  // Detox
  p.cargo.energy = 20; p.cargo.toxins = 30;
  const toxBefore = p.cargo.toxins;
  const d = K.buyOffering(w, 'detox');
  assert.equal(d.ok, true, 'detox purchase ok');
  assert.ok(p.cargo.toxins < toxBefore, 'detox reduces toxins');

  // Ferment ATP
  p.cargo.biomass = 30; p.cargo.lipids = 20;
  const eBefore = p.cargo.energy;
  const f = K.buyOffering(w, 'buy_energy');
  assert.equal(f.ok, true, 'ferment ATP ok');
  assert.ok(p.cargo.energy > eBefore, 'fermentation produces energy');

  // Cannot buy when broke
  p.cargo.biomass = 0; p.cargo.lipids = 0; p.cargo.energy = 0;
  const broke = K.buyOffering(w, 'repair');
  assert.equal(broke.ok, false, 'broke player cannot repair');
});

// ─── Tier 2 grafts ──────────────────────────────────────────────────────────
suite('yuki.tier2', () => {
  const w = K.createWorld({ seed: 40 });
  const p = K.getPlayer(w);
  Object.assign(p.cargo, richCargo());

  const offerIds = ['cytostome', 'lipid_repair_loom', 'oxygen_tolerance', 'oxygen_vacuole', 'flagella', 'buoyancy_vacuole', 'rasping_lamella', 'toxin_sac', 'dash_vacuole'];
  const offers = K.getYukiOfferings(w);

  for (const id of offerIds) {
    const o = offers.find(x => x.id === id);
    assert.ok(o, `offering ${id} exists`);
    assert.equal(o.locked, false, `${id} should be unlocked with rich cargo: ${o.reasons?.join('; ')}`);
    assert.equal(Object.hasOwn(o.cost ?? {}, 'dna'), false, `${id} must not require DNA`);
  }

  const res = K.buyOffering(w, 'cytostome');
  assert.equal(res.ok, true, 'cytostome purchase succeeds');
  assert.equal(p.organelles.cytostome, 1, 'organelle recorded');

  // toxin_cloud requires toxin_sac
  Object.assign(p.cargo, richCargo());
  const cloud = K.getYukiOfferings(w).find(x => x.id === 'toxin_cloud');
  assert.equal(cloud.locked, true, 'toxin_cloud locked without toxin_sac');
  K.buyOffering(w, 'toxin_sac');
  Object.assign(p.cargo, richCargo());
  const cloudAfter = K.getYukiOfferings(w).find(x => x.id === 'toxin_cloud');
  assert.equal(cloudAfter.locked, false, 'toxin_cloud unlocked after toxin_sac');
});

// ─── Tier 2 stack limits ────────────────────────────────────────────────────
suite('yuki.stackLimits', () => {
  const w = K.createWorld({ seed: 45 });
  const p = K.getPlayer(w);
  for (let i = 0; i < 5; i++) {
    Object.assign(p.cargo, richCargo());
    K.buyOffering(w, 'oxygen_tolerance'); // stackLimit: 3
  }
  assert.ok(p.organelles.oxygen_tolerance <= 3, 'oxygen_tolerance capped at stackLimit 3');
  const locked = K.getYukiOfferings(w).find(x => x.id === 'oxygen_tolerance');
  assert.equal(locked.locked, true, 'oxygen_tolerance offering locks at max stacks');
});

// ─── Actions gating ─────────────────────────────────────────────────────────
suite('actions.gating', () => {
  const w = K.createWorld({ seed: 50 });
  const p = K.getPlayer(w);

  let acts = K.getAvailableActions(w);
  assert.ok(acts.some(a => a.id === 'feed'), 'feed always available');
  assert.ok(!acts.some(a => a.id === 'repair'), 'repair not available at start');
  assert.ok(!acts.some(a => a.id === 'rasp'), 'rasp not available at start');
  assert.ok(!acts.some(a => a.id === 'acid'), 'acid not available at start');
  assert.ok(!acts.some(a => a.id === 'dash'), 'dash not available at start');

  Object.assign(p.cargo, richCargo());
  K.buyOffering(w, 'lipid_repair_loom');
  acts = K.getAvailableActions(w);
  assert.ok(acts.some(a => a.id === 'repair'), 'repair unlocks after graft');

  Object.assign(p.cargo, richCargo());
  K.buyOffering(w, 'rasping_lamella');
  acts = K.getAvailableActions(w);
  assert.ok(acts.some(a => a.id === 'rasp'), 'rasp unlocks after graft');

  Object.assign(p.cargo, richCargo());
  K.buyOffering(w, 'toxin_sac');
  acts = K.getAvailableActions(w);
  assert.ok(acts.some(a => a.id === 'acid'), 'acid unlocks after toxin_sac');
});

// ─── Self repair via lipid loom ─────────────────────────────────────────────
suite('repair.lipidLoom', () => {
  const w = K.createWorld({ seed: 60 });
  const p = K.getPlayer(w);
  Object.assign(p.cargo, richCargo());
  K.buyOffering(w, 'lipid_repair_loom');
  p.hp = 50; p.cargo.lipids = 60; p.cargo.energy = 60;
  const before = p.hp;
  step60(w, { repair: true }, 1);
  assert.ok(p.hp > before, 'lipid loom heals HP over time');
  // Confirm lipid cost was paid
  assert.ok(p.cargo.lipids < 60, 'lipids consumed during repair');
});

// ─── Algae ecosystem ────────────────────────────────────────────────────────
suite('algae.ecosystem', () => {
  const w = K.createWorld({ seed: 4 });
  // 45s: population should be healthy; surface algae should not be dying from O2
  step60(w, {}, 45);
  const algae = K.getRenderProjection(w).entities.filter(e => e.controller === 'algae');
  assert.ok(algae.length >= 6, `algae population persists: got ${algae.length}`);
  for (const a of algae.filter(x => x.y < K.WORLD.nurseryTop).slice(0, 6)) {
    assert.ok(a.oxygen <= a.oxygenTolerance + 0.05, `surface algae O2 within tolerance: ${a.oxygen.toFixed(3)} vs tol ${a.oxygenTolerance.toFixed(3)}`);
  }
  // 90s: biomass-heavy algae should enter fall state; the algal fall pump should deliver
  // at least one corpse field to the rupture zone for scavengers to feed on
  step60(w, {}, 45);
  assert.ok(w.stats.algaeFalls >= 1, 'at least one algae enters fall state');
  assert.ok(w.stats.ruptures >= 1, 'algal fall pump delivers a corpse to the rupture zone');
});

// ─── Corpse bloom ───────────────────────────────────────────────────────────
suite('bloom.death', () => {
  const w = K.createWorld({ seed: 70 });
  const before = w.fields.length;
  // Kill a scavenger by zeroing its HP
  const npc = w.entities.find(e => e.controller === 'scavenger');
  npc.hp = 0;
  K.step(w, {}, 1 / 60);
  assert.ok(w.fields.length > before, 'corpse blooms into a resource field');
});

// ─── Player respawn ──────────────────────────────────────────────────────────
suite('player.respawn', () => {
  const w = K.createWorld({ seed: 80 });
  const p = K.getPlayer(w);
  const idBefore = p.id;
  p.hp = 0;
  K.step(w, {}, 1 / 60);
  const p2 = K.getPlayer(w);
  assert.ok(p2, 'player entity still exists after death');
  assert.ok(p2.id !== idBefore || p2.hp > 0, 'new player body or healed');
  assert.equal(p2.kind, 'player', 'respawned entity is still player');
  assert.ok(p2.hp > 0, 'respawned player has HP');
});

// ─── Eucharist gate (host readiness) ────────────────────────────────────────
suite('eucharist.gate', () => {
  const w = K.createWorld({ seed: 90 });
  const p = K.getPlayer(w);
  // Tier 3 must be locked without mito
  const tier3 = K.getYukiOfferings(w).filter(o => o.section.includes('Tier 3'));
  assert.ok(tier3.every(o => o.locked), 'all Tier 3 offerings locked before mitochondria');
  // Eucharist gate locked at start
  const euch = K.getYukiOfferings(w).find(o => o.id === 'mitochondrial_eucharist');
  assert.ok(euch.locked, 'Eucharist locked at start');
  // Already-integrated player cannot buy again
  p.organelles.mitochondrion = 1;
  const euch2 = K.getYukiOfferings(w).find(o => o.id === 'mitochondrial_eucharist');
  assert.ok(euch2.locked, 'Eucharist locked once already integrated');
});

// ─── HUD projection ──────────────────────────────────────────────────────────
suite('projection.hud', () => {
  const w = K.createWorld({ seed: 100 });
  const hud = K.getHudProjection(w);
  assert.ok(hud, 'HUD projection returned');
  assert.ok(hud.hp.max > 0, 'hp max present');
  assert.ok(Array.isArray(hud.resources), 'resources array');
  assert.ok(hud.resources.some(r => r.id === 'biomass'), 'biomass in resources');
  assert.ok(Array.isArray(hud.organelles), 'organelles array');
  assert.ok(Array.isArray(hud.actions), 'actions array');
  assert.ok(typeof hud.nearYuki === 'boolean', 'nearYuki boolean');
  assert.ok(typeof hud.objective === 'string' && hud.objective.length > 5, 'objective text');
});

// ─── Render projection ───────────────────────────────────────────────────────
suite('projection.render', () => {
  const w = K.createWorld({ seed: 101 });
  const rp = K.getRenderProjection(w);
  assert.ok(rp.entities.length > 0, 'entities in projection');
  assert.ok(rp.fields.length > 0, 'fields in projection');
  for (const e of rp.entities.slice(0, 5)) {
    assert.ok(typeof e.x === 'number', 'entity.x is number');
    assert.ok(typeof e.r === 'number', 'entity.r is number');
    assert.ok(typeof e.color === 'string', 'entity.color is string');
  }
});

// ─── NPC spawn cap ───────────────────────────────────────────────────────────
suite('npc.spawnCap', () => {
  const w = K.createWorld({ seed: 200 });
  step60(w, {}, 30);
  assert.ok(w.entities.length <= 75, `entity count capped: got ${w.entities.length}`);
  assert.ok(w.entities.filter(e => e.controller === 'algae').length <= 16, 'algae count bounded');
});

// ─── World wrap ──────────────────────────────────────────────────────────────
suite('world.wrap', () => {
  const w = K.createWorld({ seed: 300 });
  const p = K.getPlayer(w);
  p.x = K.WORLD.w - 1;
  step60(w, { moveX: 1 }, 0.5);
  assert.ok(p.x >= 0 && p.x < K.WORLD.w, `x stays within world bounds: ${p.x}`);
  p.x = 1;
  step60(w, { moveX: -1 }, 0.5);
  assert.ok(p.x >= 0 && p.x < K.WORLD.w, `x wraps from left: ${p.x}`);
});

// ─── HTML shell checks ───────────────────────────────────────────────────────
suite('shell.html', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /if\(ui\.shopOverlay\.style\.display==='flex'\) closeShop\(\)/, 'E key toggles shop closed');
  assert.match(html, /exchangeFlow/, 'exchange flow styling present');
  assert.match(html, /data-kind="\$\{o\.kind\}"/, 'offer cards carry kind metadata');
  assert.match(html, /v1\.0\.1/, 'version string present in HTML');
  assert.match(html, /graph_kernel\.mjs/, 'kernel import present');
  assert.match(html, /requestAnimationFrame/, 'game loop present');
  assert.match(html, /getHudProjection/, 'HUD projection wired');
  assert.match(html, /getRenderProjection/, 'render projection wired');
});

// ─── Run ─────────────────────────────────────────────────────────────────────
const start = Date.now();
const results = [];

for (const s of suites) {
  let pass = 0, fail = 0;
  const errors = [];
  try {
    s.fn();
    pass = 1;
  } catch (e) {
    fail = 1;
    errors.push(e.message);
  }
  totalPass += pass; totalFail += fail;
  results.push({ name: s.name, pass: pass > 0, error: errors[0] || null });
}

const elapsed = Date.now() - start;
console.log('');
console.log(`  Eukaryotic Eucharist v1.0.1 — test run (${elapsed}ms)`);
console.log('  ─────────────────────────────────────────────────────');
for (const r of results) {
  const icon = r.pass ? '  ✓' : '  ✗';
  console.log(`${icon}  ${r.name}`);
  if (r.error) console.log(`       ${r.error}`);
}
console.log('');
console.log(`  ${totalPass} passed, ${totalFail} failed`);
console.log('');
if (totalFail > 0) process.exit(1);
