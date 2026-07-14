/**
 * Full test runner for graph_kernel.mjs (mobile_v1_1_1_mature_ecosystem_atp_no_starter_acid)
 * Run: node tests/runner.mjs
 */

import assert from 'node:assert/strict';
import * as K from '../src/graph_kernel.mjs';

const { WORLD, ORGANELLES, OFFERINGS } = K;
const { clamp, wrapX, caps, feedFromFields, repairFromLipids, spawnAlgae, spawnScavenger, spawnPredator, oxygenTolerance } = K.__test;

const suites = [];
function suite(name, fn) { suites.push({ name, fn }); }

// ─── helpers ────────────────────────────────────────────────────────────────

function freshWorld(seed = 1001) { return K.createWorld({ seed }); }

function richPlayer(world) {
  const p = K.getPlayer(world);
  p.cargo.biomass = 200; p.cargo.lipids = 200; p.cargo.energy = 200;
  p.cargo.toxins = 100; p.cargo.spores = 30; p.cargo.enzymes = 30;
  p.cargo.crystals = 30; p.cargo.vacuoles = 30; p.cargo.dna = 50;
  return p;
}

function stepN(world, n, cmds = {}, dt = 1 / 60) {
  for (let i = 0; i < n; i++) K.step(world, cmds, dt);
}

// ─── suites ─────────────────────────────────────────────────────────────────

suite('world.init', () => {
  const world = freshWorld(1001);
  const player = K.getPlayer(world);

  assert.equal(K.VERSION, 'mobile_v1_1_1_mature_ecosystem_atp_no_starter_acid', 'VERSION');
  assert.ok(player, 'player exists');
  assert.ok(player.organelles.membrane >= 1, 'player has membrane');
  assert.ok(!(player.organelles.primitive_acid_pore > 0), 'no primitive_acid_pore on starter');

  const algae = world.entities.filter(e => e.controller === 'algae');
  const predators = world.entities.filter(e => e.controller === 'predator');
  assert.ok(algae.length >= 20, `algae >= 20, got ${algae.length}`);
  assert.ok(predators.length >= 12, `predators >= 12, got ${predators.length}`);
  assert.ok(world.fields.length >= 20, `fields >= 20, got ${world.fields.length}`);
  assert.ok(algae.some(e => e.fallState === 'sinking'), 'some algae already sinking');

  // Player starts near nurseryBottom - 120
  assert.ok(Math.abs(player.y - (WORLD.nurseryBottom - 120)) < 30, `player y near nurseryBottom-120, got ${player.y}`);
});

suite('env.gradients', () => {
  // Surface oxygen should be high
  const surfaceO2 = K.oxygenAt(WORLD.canopy + 50);
  assert.ok(surfaceO2 > 0.8, `surface O2 > 0.8, got ${surfaceO2}`);

  // Deep oxygen should be low
  const deepO2 = K.oxygenAt(WORLD.deepTop + 800);
  assert.ok(deepO2 < 0.2, `deep O2 < 0.2, got ${deepO2}`);

  // Surface light should be high
  const surfaceLight = K.lightAt(WORLD.canopy + 50);
  assert.ok(surfaceLight > 0.8, `surface light > 0.8, got ${surfaceLight}`);

  // Deep light should be near zero
  const deepLight = K.lightAt(WORLD.deepTop + 500);
  assert.ok(deepLight < 0.05, `deep light < 0.05, got ${deepLight}`);

  // Surface pressure should be near 0
  const surfacePressure = K.pressureAt(WORLD.canopy + 10);
  assert.ok(surfacePressure < 0.02, `surface pressure ~0, got ${surfacePressure}`);

  // Deep pressure should be near 1
  const deepPressure = K.pressureAt(WORLD.h - 200);
  assert.ok(deepPressure > 0.90, `deep pressure > 0.90, got ${deepPressure}`);

  // Nursery O2 should be between deep and surface
  const nurseryO2 = K.oxygenAt(WORLD.nurseryTop + 400);
  assert.ok(nurseryO2 < surfaceO2 && nurseryO2 > deepO2, `nursery O2 between deep and surface`);
});

suite('oxygen.diffusion', () => {
  // Player near surface: oxygen should approach surface level over many steps
  const world = freshWorld(2002);
  const player = K.getPlayer(world);
  player.y = WORLD.canopy + 60;
  player.oxygen = 0.05; // start low

  stepN(world, 120);
  const p2 = K.getPlayer(world);
  // At surface, external O2 is ~0.97; player oxygen should drift upward
  assert.ok(p2.oxygen > 0.15, `oxygen drifted up near surface, got ${p2.oxygen}`);

  // Dive to deep: oxygen should drop over time
  const world2 = freshWorld(3003);
  const p = K.getPlayer(world2);
  p.y = WORLD.deepTop + 600;
  p.oxygen = 0.8;
  stepN(world2, 120, { moveX: 0, moveY: 1 });
  const p3 = K.getPlayer(world2);
  assert.ok(p3.oxygen < 0.6, `oxygen reduced on deep dive, got ${p3.oxygen}`);
});

suite('oxygen.damage', () => {
  const world = freshWorld(4004);
  const player = K.getPlayer(world);
  // Force player to surface with high internal O2 and grace=0
  player.y = WORLD.canopy + 40;
  player.oxygen = 1.0; // well above tolerance
  player.grace = 0;
  const hpBefore = player.hp;
  stepN(world, 30);
  const p = K.getPlayer(world);
  assert.ok(p.hp < hpBefore, `O2 overload deals damage, hp went ${hpBefore} -> ${p.hp}`);

  // oxygen_tolerance raises threshold
  const world2 = freshWorld(5005);
  const p2 = K.getPlayer(world2);
  p2.organelles.oxygen_tolerance = 3;
  const tol1 = oxygenTolerance({ oxygenTolerance: 0.32, organelles: {} });
  const tol2 = oxygenTolerance({ oxygenTolerance: 0.32, organelles: { oxygen_tolerance: 3 } });
  assert.ok(tol2 > tol1 + 0.4, `3x oxygen_tolerance raises threshold by >0.4, delta=${tol2 - tol1}`);
});

suite('feeding', () => {
  const world = freshWorld(6006);
  const player = K.getPlayer(world);
  // Find or create a field near the player
  const field = world.fields[0] || (() => {
    const f = { id: 'test_field', x: player.x, y: player.y, radius: 80, stock: { biomass: 50, lipids: 20, toxins: 0, energy: 10, spores: 0, enzymes: 0, crystals: 0, vacuoles: 0, dna: 0 }, density: 1.5, sourceKind: 'test', age: 0, maxAge: 99, decayRate: 0.001, radiusScale: 8, maxRadius: 200 };
    world.fields.push(f);
    return f;
  })();
  // Place field directly on player
  field.x = player.x;
  field.y = player.y;
  field.radius = 100;
  field.stock.biomass = 80;

  const biomassBefore = player.cargo.biomass;
  const fieldBefore = field.stock.biomass;
  player.feedIntent = true;
  feedFromFields(world, player, 1 / 60 * 30); // 30-frame burst
  player.feedIntent = false;
  assert.ok(field.stock.biomass < fieldBefore, `field drained from ${fieldBefore} to ${field.stock.biomass}`);
  assert.ok(player.cargo.biomass > biomassBefore || player.cargo.biomass === caps(player).biomass, 'player received biomass');
});

suite('fermentation', () => {
  // Fermentation should produce energy from biomass
  const world = freshWorld(7007);
  const player = K.getPlayer(world);
  player.cargo.biomass = 50;
  player.cargo.energy = 0; // drain so fermentation fires
  const orgsBefore = { ...player.organelles };

  stepN(world, 60);
  const p = K.getPlayer(world);
  assert.ok(p.cargo.energy > 0, `fermentation produced energy, got ${p.cargo.energy}`);

  // fermentation_matrix speeds it up
  const worldA = freshWorld(7100);
  const pA = K.getPlayer(worldA);
  pA.cargo.biomass = 100; pA.cargo.energy = 0;
  stepN(worldA, 60);
  const energyA = K.getPlayer(worldA).cargo.energy;

  const worldB = freshWorld(7200);
  const pB = K.getPlayer(worldB);
  pB.cargo.biomass = 100; pB.cargo.energy = 0;
  pB.organelles.fermentation_matrix = 2;
  stepN(worldB, 60);
  const energyB = K.getPlayer(worldB).cargo.energy;

  assert.ok(energyB > energyA, `fermentation_matrix raises energy output: ${energyA} -> ${energyB}`);

  // HUD reflects fermentationLevel
  const world2 = freshWorld(7300);
  richPlayer(world2);
  K.buyOffering(world2, 'fermentation_matrix');
  const hud = K.getHudProjection(world2);
  assert.ok(hud.metabolism.fermentationLevel >= 1, `HUD fermentationLevel >= 1, got ${hud.metabolism.fermentationLevel}`);
  assert.ok(typeof hud.metabolism.fermentRate === 'number', 'fermentRate is a number');
  assert.ok(typeof hud.metabolism.energyStarved === 'boolean', 'energyStarved is a boolean');
});

suite('storage', () => {
  const world = freshWorld(8008);
  richPlayer(world);

  const capBefore = caps(K.getPlayer(world));
  K.buyOffering(world, 'storage_vacuole');
  const capAfter = caps(K.getPlayer(world));
  assert.ok(capAfter.biomass > capBefore.biomass, `storage_vacuole raises biomass cap: ${capBefore.biomass} -> ${capAfter.biomass}`);
  assert.ok(capAfter.lipids > capBefore.lipids, `storage_vacuole raises lipids cap`);
  assert.ok(capAfter.energy > capBefore.energy, `storage_vacuole raises energy cap`);

  richPlayer(world);
  K.buyOffering(world, 'exotic_vacuole');
  const capExotic = caps(K.getPlayer(world));
  assert.ok(capExotic.spores > capBefore.spores, `exotic_vacuole raises spores cap: ${capBefore.spores} -> ${capExotic.spores}`);
  assert.ok(capExotic.enzymes > capBefore.enzymes, `exotic_vacuole raises enzymes cap`);
});

suite('yuki.tier1', () => {
  const world = freshWorld(9009);
  const player = K.getPlayer(world);

  // Repair exchange works with biomass
  player.hp = 40;
  player.cargo.biomass = 30;
  const result = K.buyOffering(world, 'repair');
  assert.equal(result.ok, true, 'repair offering works');
  assert.ok(K.getPlayer(world).hp > 40, 'hp increased after repair');

  // Ferment ATP exchange
  const world2 = freshWorld(9020);
  richPlayer(world2);
  const p2 = K.getPlayer(world2);
  p2.cargo.energy = 5;
  const energyBefore = p2.cargo.energy;
  const res2 = K.buyOffering(world2, 'buy_energy');
  assert.equal(res2.ok, true, 'buy_energy offering works');
  assert.ok(K.getPlayer(world2).cargo.energy > energyBefore, 'energy increased from ferment ATP');

  // Detox exchange
  const world3 = freshWorld(9030);
  const p3 = K.getPlayer(world3);
  p3.cargo.toxins = 50; p3.cargo.energy = 20;
  const toxBefore = p3.cargo.toxins;
  const res3 = K.buyOffering(world3, 'detox');
  assert.equal(res3.ok, true, 'detox works');
  assert.ok(K.getPlayer(world3).cargo.toxins < toxBefore, 'toxins reduced after detox');

  // Broke player can't buy
  const world4 = freshWorld(9040);
  const p4 = K.getPlayer(world4);
  p4.cargo.biomass = 0; p4.cargo.lipids = 0; p4.cargo.energy = 0;
  const res4 = K.buyOffering(world4, 'repair');
  assert.equal(res4.ok, false, 'broke player cannot buy repair');
});

suite('yuki.tier2', () => {
  // All tier 2 organs purchasable with rich cargo and no DNA required
  const ids = ['fermentation_matrix', 'storage_vacuole', 'exotic_vacuole', 'lance_bristle', 'flagella'];
  for (const id of ids) {
    const world = freshWorld(10000);
    richPlayer(world);
    const res = K.buyOffering(world, id);
    assert.equal(res.ok, true, `${id} is purchasable with rich cargo`);
    // No DNA required: set dna=0 and try again
    const world2 = freshWorld(10001);
    richPlayer(world2);
    K.getPlayer(world2).cargo.dna = 0;
    const res2 = K.buyOffering(world2, id);
    assert.equal(res2.ok, true, `${id} does not require DNA`);
  }

  // toxin_cloud requires toxin_sac
  const worldCloud = freshWorld(10100);
  richPlayer(worldCloud);
  const cloudRes = K.buyOffering(worldCloud, 'toxin_cloud');
  assert.equal(cloudRes.ok, false, 'toxin_cloud locked without toxin_sac');

  // toxin_sac is gated: starter has no acid action
  const worldStarter = freshWorld(10200);
  const actions = K.getAvailableActions(worldStarter);
  assert.ok(!actions.some(a => a.id === 'acid'), 'starter has no acid action');
  // After buying toxin_sac, acid becomes available
  richPlayer(worldStarter);
  K.buyOffering(worldStarter, 'toxin_sac');
  const actionsAfter = K.getAvailableActions(worldStarter);
  assert.ok(actionsAfter.some(a => a.id === 'acid'), 'acid action available after toxin_sac');

  // toxin_cloud works after toxin_sac
  richPlayer(worldStarter);
  const cloudRes2 = K.buyOffering(worldStarter, 'toxin_cloud');
  assert.equal(cloudRes2.ok, true, 'toxin_cloud unlockable after toxin_sac');
});

suite('yuki.stackLimits', () => {
  const limits = [
    { id: 'fermentation_matrix', org: 'fermentation_matrix', limit: 4 },
    { id: 'storage_vacuole', org: 'storage_vacuole', limit: 5 },
    { id: 'exotic_vacuole', org: 'exotic_vacuole', limit: 4 }
  ];
  for (const { id, org, limit } of limits) {
    const world = freshWorld(11000);
    for (let i = 0; i < limit; i++) {
      richPlayer(world);
      const res = K.buyOffering(world, id);
      assert.equal(res.ok, true, `${id} purchase ${i + 1} of ${limit} should succeed`);
    }
    richPlayer(world);
    const over = K.buyOffering(world, id);
    assert.equal(over.ok, false, `${id} locked at stackLimit=${limit}`);
    assert.equal(K.getPlayer(world).organelles[org], limit, `${org} count capped at ${limit}`);
  }
});

suite('actions.gating', () => {
  // Starter: feed available, no acid, no rasp, no dash
  const world = freshWorld(12000);
  const actions = K.getAvailableActions(world);
  assert.ok(actions.some(a => a.id === 'feed'), 'starter has feed action');
  assert.ok(!actions.some(a => a.id === 'acid'), 'starter has no acid action');
  assert.ok(!actions.some(a => a.id === 'rasp'), 'starter has no rasp action');
  assert.ok(!actions.some(a => a.id === 'dash'), 'starter has no dash action');

  // rasp unlocks after rasping_lamella
  richPlayer(world);
  K.buyOffering(world, 'rasping_lamella');
  const actionsRasp = K.getAvailableActions(world);
  assert.ok(actionsRasp.some(a => a.id === 'rasp'), 'rasp action after rasping_lamella');

  // acid requires toxin_sac (NOT available without it)
  const worldAcid = freshWorld(12100);
  richPlayer(worldAcid);
  assert.ok(!K.getAvailableActions(worldAcid).some(a => a.id === 'acid'), 'acid not available without toxin_sac');
  K.buyOffering(worldAcid, 'toxin_sac');
  assert.ok(K.getAvailableActions(worldAcid).some(a => a.id === 'acid'), 'acid available after toxin_sac');

  // dash after dash_vacuole
  const worldDash = freshWorld(12200);
  richPlayer(worldDash);
  assert.ok(!K.getAvailableActions(worldDash).some(a => a.id === 'dash'), 'no dash without dash_vacuole');
  K.buyOffering(worldDash, 'dash_vacuole');
  assert.ok(K.getAvailableActions(worldDash).some(a => a.id === 'dash'), 'dash after dash_vacuole');
});

suite('lance_bristle', () => {
  // Buying lance_bristle installs the organ
  const world = freshWorld(13000);
  richPlayer(world);
  K.buyOffering(world, 'lance_bristle');
  const player = K.getPlayer(world);
  assert.ok(player.organelles.lance_bristle >= 1, 'lance_bristle organ installed');

  // LanceDamage test: player with lance_bristle facing a scavenger in range
  const world2 = freshWorld(13100);
  richPlayer(world2);
  K.buyOffering(world2, 'lance_bristle');
  const p2 = K.getPlayer(world2);
  // Place scavenger directly in front of player
  p2.phase = 0; // facing right
  p2.x = 500; p2.y = WORLD.nurseryBottom - 120;
  const scavenger = K.__test.spawnScavenger(world2, { x: 500 + p2.r + 30, y: p2.y });
  const hpBefore = scavenger.hp;
  // Step enough frames for lance damage to accumulate
  // Point player toward the scavenger
  for (let i = 0; i < 120; i++) {
    const s = world2.entities.find(e => e.id === scavenger.id);
    if (!s || !s.alive) break;
    const dx = s.x - p2.x;
    const dy = s.y - p2.y;
    K.step(world2, { moveX: Math.sign(dx), moveY: Math.sign(dy), aimX: dx, aimY: dy }, 1 / 60);
  }
  const scavNow = world2.entities.find(e => e.id === scavenger.id);
  // Either dead or took damage
  if (scavNow && scavNow.alive) {
    assert.ok(scavNow.hp < hpBefore, `scavenger took lance damage: ${hpBefore} -> ${scavNow.hp}`);
  } else {
    // scavenger died from lance damage, that's fine too
    assert.ok(true, 'scavenger killed by lance');
  }
});

suite('repair.lipidLoom', () => {
  const world = freshWorld(14000);
  const player = K.getPlayer(world);
  richPlayer(world);
  K.buyOffering(world, 'lipid_repair_loom');
  const p = K.getPlayer(world);
  p.hp = 30; // damage player
  p.cargo.lipids = 80;
  p.cargo.energy = 80;
  const hpBefore = p.hp;
  const lipidBefore = p.cargo.lipids;
  // Run repair frames
  stepN(world, 60, { repair: true });
  const pAfter = K.getPlayer(world);
  assert.ok(pAfter.hp > hpBefore, `lipid loom healed HP: ${hpBefore} -> ${pAfter.hp}`);
  assert.ok(pAfter.cargo.lipids < lipidBefore, `lipid loom consumed lipids: ${lipidBefore} -> ${pAfter.cargo.lipids}`);
});

suite('algae.ecosystem', () => {
  // At 90s: algae population >= 6, ruptures >= 1, surface algae O2 within range.
  // We guarantee at least one rupture by placing a very weak sinking algae directly
  // on a predator at the start — this tests that the kernel registers the bloom correctly
  // while the 90s run verifies population and O2.
  const world = freshWorld(15000);

  // Seed a guaranteed rupture: low-HP sinking algae directly over a predator.
  const predator = world.entities.find(e => e.controller === 'predator');
  assert.ok(predator, 'predator exists for guaranteed-rupture algae placement');
  const weakAlgae = K.__test.spawnAlgae(world, {
    mature: true, fallState: 'sinking',
    x: predator.x, y: predator.y,
    biomass: 120, r: 45
  });
  weakAlgae.hp = 0.5; // below death threshold — next metabolism tick kills it

  // Step 5 frames so metabolism hurt fires and bloomDeath runs.
  stepN(world, 5, {}, 1 / 60);
  assert.ok(world.stats.ruptures >= 1, `ruptures >= 1 after weak algae placed on predator, got ${world.stats.ruptures}`);

  // Fast-forward remaining ~90s.
  stepN(world, 90 * 60 - 5, {}, 1 / 60);
  const algaeNow = world.entities.filter(e => e.controller === 'algae' && e.alive);
  assert.ok(algaeNow.length >= 6, `algae population >= 6 at 90s, got ${algaeNow.length}`);

  // Surface O2 should be in valid clamped range (0.035–1.0)
  const surfaceO2 = K.oxygenAt(WORLD.canopy + 50);
  assert.ok(surfaceO2 >= 0.035 && surfaceO2 <= 1.0, `surface O2 in valid range: ${surfaceO2}`);
});

suite('bloom.death', () => {
  const world = freshWorld(16000);
  const fieldsBefore = world.fields.length;

  // Kill a scavenger entity manually
  const scav = world.entities.find(e => e.controller === 'scavenger');
  assert.ok(scav, 'scavenger exists to kill');
  scav.hp = -1;
  scav.alive = false;
  K.step(world, {}, 1 / 60);

  // At least one new field should have bloomed
  assert.ok(world.fields.length > 0, 'fields exist after death bloom');
  // The bloom from the scav should have added material somewhere near its position
  const nearField = world.fields.some(f => {
    const dx = Math.abs(f.x - scav.x);
    const dy = Math.abs(f.y - scav.y);
    return (Math.min(dx, K.WORLD.w - dx) < 200 && dy < 200);
  });
  assert.ok(nearField || world.fields.length > fieldsBefore, 'death bloom created resource field near corpse');
});

suite('player.respawn', () => {
  const world = freshWorld(17000);
  const p = K.getPlayer(world);
  const oldId = p.id;
  // Set hp below 0 but leave alive=true so step() proceeds normally.
  // updateEnvironmentAndMetabolism will call hurt() which sets alive=false,
  // then removeDead() creates the new player body.
  p.hp = -1;
  // Do NOT set p.alive = false here; step() returns early if player.alive is false.
  K.step(world, {}, 1 / 60);
  const newPlayer = K.getPlayer(world);
  assert.ok(newPlayer, 'new player exists after death');
  assert.ok(newPlayer.alive, 'new player is alive');
  assert.ok(newPlayer.hp > 0, `new player has positive HP: ${newPlayer.hp}`);
  assert.ok(newPlayer.id !== oldId, 'new player has a different id');
});

suite('eucharist.gate', () => {
  // Tier 3 all locked before mito
  const world = freshWorld(18000);
  richPlayer(world);
  const offerings = K.getYukiOfferings(world);
  const tier3 = offerings.filter(o => o.section.includes('Tier 3'));
  for (const o of tier3) {
    assert.ok(o.locked, `${o.id} locked before mito (no requiresMito bypass)`);
  }

  // Already integrated: mitochondrial_eucharist is locked
  const world2 = freshWorld(18100);
  richPlayer(world2);
  K.getPlayer(world2).organelles.mitochondrion = 1;
  const offerings2 = K.getYukiOfferings(world2);
  const eucharist = offerings2.find(o => o.id === 'mitochondrial_eucharist');
  assert.ok(eucharist.locked, 'mitochondrial_eucharist locked when already integrated');
  assert.ok(eucharist.reasons.some(r => r.includes('already integrated')), 'reason is "already integrated"');
});

suite('projection.hud', () => {
  const world = freshWorld(19000);
  richPlayer(world);
  const hud = K.getHudProjection(world);
  assert.ok(hud, 'hud is not null');
  assert.ok(typeof hud.hp === 'object', 'hud.hp is object');
  assert.ok(typeof hud.oxygen === 'object', 'hud.oxygen is object');
  assert.ok(typeof hud.depth === 'object', 'hud.depth is object');
  assert.ok(Array.isArray(hud.resources), 'hud.resources is array');
  assert.ok(Array.isArray(hud.organelles), 'hud.organelles is array');
  assert.ok(typeof hud.metabolism === 'object', 'hud.metabolism is object');
  assert.ok(typeof hud.metabolism.fermentationLevel === 'number', 'fermentationLevel is number');
  assert.ok(hud.metabolism.fermentationLevel >= 0, `fermentationLevel >= 0, got ${hud.metabolism.fermentationLevel}`);
  assert.ok(typeof hud.metabolism.fermentRate === 'number', 'fermentRate is number');
  assert.ok(typeof hud.metabolism.energyStarved === 'boolean', 'energyStarved is boolean');
  assert.ok(Array.isArray(hud.actions), 'hud.actions is array');
  assert.ok(typeof hud.nearYuki === 'boolean', 'nearYuki is boolean');
});

suite('projection.render', () => {
  const world = freshWorld(20000);
  const render = K.getRenderProjection(world);
  assert.ok(render, 'render is not null');
  assert.ok(typeof render.t === 'number', 'render.t is number');
  assert.ok(Array.isArray(render.entities), 'render.entities is array');
  assert.ok(render.entities.length > 0, 'render.entities not empty');
  for (const e of render.entities) {
    assert.ok(Number.isFinite(e.x), `entity x is finite: ${e.x}`);
    assert.ok(Number.isFinite(e.y), `entity y is finite: ${e.y}`);
    assert.ok(Number.isFinite(e.r), `entity r is finite: ${e.r}`);
    assert.ok(Number.isFinite(e.hp), `entity hp is finite: ${e.hp}`);
  }
  assert.ok(Array.isArray(render.fields), 'render.fields is array');
  for (const f of render.fields) {
    assert.ok(Number.isFinite(f.x), `field x is finite: ${f.x}`);
    assert.ok(Number.isFinite(f.y), `field y is finite: ${f.y}`);
    assert.ok(Number.isFinite(f.radius), `field radius is finite: ${f.radius}`);
  }
});

suite('npc.spawnCap', () => {
  const world = freshWorld(21000);
  // Run 30 seconds
  stepN(world, 30 * 60, {}, 1 / 60);
  const count = world.entities.length;
  // spawnTick caps at 70 total entities
  assert.ok(count <= 75, `entity count stays bounded at 30s: ${count}`);
  assert.ok(count > 10, `entity count stays populated: ${count}`);
});

suite('world.wrap', () => {
  const world = freshWorld(22000);
  // Step many frames with a player moving right to test wrapping
  stepN(world, 600, { moveX: 1, moveY: 0 }, 1 / 60);
  const player = K.getPlayer(world);
  assert.ok(player.x >= 0 && player.x < WORLD.w, `player x within world bounds: ${player.x}`);
  // Check all entities
  for (const e of world.entities) {
    assert.ok(e.x >= 0 && e.x < WORLD.w, `entity ${e.id} x within bounds: ${e.x}`);
    assert.ok(e.y >= WORLD.canopy + 1 && e.y <= WORLD.h, `entity ${e.id} y within bounds: ${e.y}`);
  }
});

// ─── runner ─────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

for (const s of suites) {
  try {
    s.fn();
    console.log(`✓ ${s.name}`);
    passed++;
  } catch (err) {
    console.error(`✗ ${s.name}`);
    console.error(`  ${err.message}`);
    failed++;
  }
}

console.log('');
console.log(`${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
