import * as K from './src/graph_kernel.mjs';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const world = K.createWorld({ seed: 133 });
const player = K.getPlayer(world);
assert(K.VERSION.includes('v1_3_3'), 'version should be v1.3.3');
assert(player, 'player exists');
assert(K.orgCount(player, 'anaerobic_processor') === 1, 'starter has one anaerobic processor');
assert(K.orgCount(player, 'dna_memory_vesicle') === 0, 'starter has ZERO DNA storage — you must build a vesicle before harvesting DNA');
let hud = K.getHudProjection(world);
let dna = hud.resources.find(r => r.id === 'dna');
assert(dna.max === 0, 'starter DNA cap is zero (no vesicle)');
assert(K.__test.feedRate(player) < 0.9, 'starter feeding rate is slower than v1.3.2 (two intake pores)');

// Full biomass should create ATP while idle.
player.cargo.energy = 0;
player.cargo.biomass = hud.graphStats.caps.biomass;
for (let i = 0; i < 180; i++) K.step(world, {}, 1 / 60);
assert(player.cargo.energy > 0.20, 'idle full biomass should net-generate ATP');
assert(player.cargo.biomass < hud.graphStats.caps.biomass, 'fermentation consumes biomass');

// DNA (and exotics) are swept up like coins — no feeding action — but only with storage room.
player.organelles.dna_memory_vesicle = 1;
hud = K.getHudProjection(world);
assert(hud.resources.find(r => r.id === 'dna').max === 1, 'one DNA vesicle gives one DNA slot');
player.x = 500; player.y = 1300; player.cargo.dna = 0;
world.particles.push({ id: 'test_dna_pre_mito', kind: 'dna', x: 500, y: 1300, value: 1, vx: 0, vy: 0, age: 0, maxAge: 999, color: '#fff' });
K.step(world, {}, 1 / 60);
assert(player.cargo.dna === 1, 'DNA is auto-collected like a coin with no feed action, given storage room');

// Host readiness is DNA-gated, not oxygen-tolerance gated.
player.cargo.lipids = hud.graphStats.caps.lipids;
player.cargo.spores = 3; player.cargo.enzymes = 2; player.cargo.crystals = 2;
player.organelles.cytostome = 1; player.organelles.lipid_repair_loom = 1; player.organelles.membrane_hardening = 1; player.organelles.oxygen_vacuole = 1;
player.maxDepth = 2400;
player.cargo.dna = 0;
let offering = K.getYukiOfferings(world).find(o => o.id === 'mitochondrial_eucharist');
assert(offering.readiness.reasons.some(r => r.includes('DNA')), 'Eucharist readiness asks for DNA (an unlock, not a carried strand)');
assert(!offering.readiness.reasons.some(r => r.includes('oxygen tolerance')), 'Eucharist readiness no longer asks for oxygen tolerance');
// The Eucharist no longer SPENDS raw DNA — the gate is "have you sequenced anything".
assert(!('dna' in (offering.cost || {})), 'Eucharist costs no raw DNA — it is gated by an unlock, not a strand');
world.discoveredSources.set('velocity_lance', 1.0); // sequence one genome
offering = K.getYukiOfferings(world).find(o => o.id === 'mitochondrial_eucharist');
assert(!offering.readiness.reasons.some(r => r.includes('DNA')), 'one sequenced genome satisfies the DNA precondition');
world.discoveredSources.delete('velocity_lance'); // restore for later tests

// Rasping cost is paid once per body tick, not once per overlapping target.
const wSolo = K.createWorld({ seed: 200 });
const pSolo = K.getPlayer(wSolo);
pSolo.organelles.rasping_lamella = 1; pSolo.cargo.energy = 10;
K.step(wSolo, { rasp: true }, 1 / 60);
const soloCost = 10 - pSolo.cargo.energy;
const wMass = K.createWorld({ seed: 201 });
const pMass = K.getPlayer(wMass);
pMass.organelles.rasping_lamella = 1; pMass.cargo.energy = 10;
K.__test.spawnScavenger(wMass, { x: pMass.x, y: pMass.y });
K.__test.spawnScavenger(wMass, { x: pMass.x, y: pMass.y });
K.step(wMass, { rasp: true }, 1 / 60);
const massCost = 10 - pMass.cargo.energy;
assert(Math.abs(massCost - soloCost) < 0.03, 'rasp cost does not scale with number of targets');

// Predators have more anaerobic support now.
assert(world.entities.some(e => e.controller === 'predator' && K.orgCount(e, 'anaerobic_processor') >= 3), 'predators spawn with extra anaerobic processors');

// ── Act III: DNA discovery endgame ──────────────────────────────────────────
const wD = K.createWorld({ seed: 4040 });
const pD = K.getPlayer(wD);
pD.organelles.dna_memory_vesicle = 1; // grant DNA storage so samples can be ingested (starter now has none)

// discoveredSources initializes as an empty Map (Node has no localStorage → try/catch holds).
assert(wD.discoveredSources instanceof Map, 'world.discoveredSources is a Map of orgId -> potency');
assert(wD.discoveredSources.size === 0, 'no discoveries at world start (Node, no localStorage)');

// A fresh player arrives through the same nursery band as an immigrating scavenger.
assert(pD.x >= 0 && pD.x <= K.WORLD.w, 'player immigration x is inside the world');
assert(pD.y >= K.WORLD.nurseryTop && pD.y <= K.WORLD.nurseryTop + 580,
  'player immigrates through the scavenger nursery band');
assert(!K.nearYuki(wD, pD), 'player must travel to Yuki after immigrating');

// Feeding on strain DNA carries a SAMPLE tagged with that individual's rolled potency.
pD.x = K.__test.YUKI_SPAWN.x; pD.y = K.__test.YUKI_SPAWN.y; pD.cargo.dna = 0;
wD.particles.push({ id: 'tst_vlance', kind: 'dna', x: pD.x, y: pD.y, value: 1, vx: 0, vy: 0, age: 0, maxAge: 999, color: '#ff3d9a', source: 'velocity_lance', potency: 0.95 });
K.step(wD, { feed: true }, 1 / 60);
assert(pD.carriedStrains.has('velocity_lance'), 'feeding on strain DNA carries a pending sample');
assert(Math.abs(pD.carriedStrains.get('velocity_lance') - 0.95) < 1e-6, 'the carried sample keeps the individual mutant\'s rolled potency');
assert(!wD.discoveredSources.has('velocity_lance'), 'sample alone does NOT unlock — discovery waits for Yuki');
assert(wD.events.some(e => e.type === 'sample' && e.source === 'velocity_lance'), 'a sample event fired on collect');

// Genetic selection: a weaker sample of the same trait is ignored, a stronger one is carried.
// (DNA must be ingestible — free the one-slot DNA store between samples.)
pD.cargo.dna = 0;
wD.particles.push({ id: 'tst_weak', kind: 'dna', x: pD.x, y: pD.y, value: 1, vx: 0, vy: 0, age: 0, maxAge: 999, color: '#ff3d9a', source: 'velocity_lance', potency: 0.85 });
K.step(wD, { feed: true }, 1 / 60);
assert(Math.abs(pD.carriedStrains.get('velocity_lance') - 0.95) < 1e-6, 'a weaker genome does not replace a stronger carried sample');
pD.cargo.dna = 0;
wD.particles.push({ id: 'tst_strong', kind: 'dna', x: pD.x, y: pD.y, value: 1, vx: 0, vy: 0, age: 0, maxAge: 999, color: '#ff3d9a', source: 'velocity_lance', potency: 1.18 });
K.step(wD, { feed: true }, 1 / 60);
assert(Math.abs(pD.carriedStrains.get('velocity_lance') - 1.18) < 1e-6, 'a stronger genome upgrades the carried sample (selection)');

// velocity_lance stays gated until sequenced; a Sequence offering appears while carrying samples.
let offersD = K.getYukiOfferings(wD);
assert(offersD.find(o => o.id === 'velocity_lance').undiscovered, 'velocity_lance is gated until sequenced at Yuki');
assert(offersD.some(o => o.id === 'sequence_dna'), 'Sequence Genome offering appears when carrying samples');

// Giving the DNA to Yuki (buy sequence_dna) unlocks it AND locks in the sequenced potency.
pD.cargo.energy = 20;
const seqRes = K.buyOffering(wD, 'sequence_dna');
assert(seqRes.ok && seqRes.sequenced === 1, 'sequencing consumes the carried sample');
assert(wD.discoveredSources.has('velocity_lance'), 'sequencing at Yuki unlocks the organelle');
assert(Math.abs(wD.discoveredSources.get('velocity_lance') - 1.18) < 1e-6, 'the sequenced potency is the best genome you carried');
assert(Math.abs(K.__test.potency(wD, pD, 'velocity_lance') - 1.18) < 1e-6, 'the player now expresses the sequenced potency');
assert(pD.carriedStrains.size === 0, 'sequenced samples are cleared from carry');
assert(wD.events.some(e => e.type === 'discovery' && e.source === 'velocity_lance'), 'discovery event fires at sequencing');
offersD = K.getYukiOfferings(wD);
assert(!offersD.find(o => o.id === 'velocity_lance').undiscovered, 'velocity_lance is unlocked after sequencing');
assert(offersD.find(o => o.id === 'lipid_repair_loom').undiscovered, 'other exotics stay DNA-gated');

// Reset-to-fresh wipes discoveries (the reset-world button also resets the shop).
const wFresh = K.createWorld({ seed: 4040, fresh: true });
assert(wFresh.discoveredSources.size === 0, 'fresh reset clears discovered unlocks — shop returns to locked state');

// A mutant NPC expresses its own individually-rolled potency; baseline organs stay 1.0.
const wPot = K.createWorld({ seed: 4141 });
const mob = K.__test.spawnPredator(wPot, { x: 400, y: 1900 });
mob.strain = 'velocity_lance'; mob.strainPotency = 1.2; mob.organelles.velocity_lance = 1;
assert(Math.abs(K.__test.potency(wPot, mob, 'velocity_lance') - 1.2) < 1e-6, 'a mutant NPC expresses the potency stamped on its own body');
assert(K.__test.potency(wPot, K.getPlayer(wPot), 'anaerobic_processor') === 1, 'baseline anaerobic processor has no potency roll (stays 1.0)');
assert(K.__test.potency(wPot, K.getPlayer(wPot), 'velocity_lance') === 1, 'an unsequenced trait defaults to 1.0 potency for the player');

// Processor variants: virulent runs dirtier than clean under identical fuel.
function toxinAfter(procId, seed) {
  const w = K.createWorld({ seed });
  const p = K.getPlayer(w);
  delete p.organelles.anaerobic_processor;
  p.organelles[procId] = 1;
  p.cargo.energy = 0; p.cargo.toxins = 0;
  p.cargo.biomass = K.__test.caps(p).biomass;
  for (let i = 0; i < 240; i++) K.step(w, {}, 1 / 60);
  return p.cargo.toxins;
}
const cleanTox = toxinAfter('clean_processor', 5051);
const virulentTox = toxinAfter('virulent_processor', 5051);
assert(virulentTox > cleanTox * 3, 'virulent processor makes far more toxin waste than the purified one');
assert(cleanTox >= 0, 'clean processor still produces some (tiny) toxin');

// Lipogenic processor: biomass converts into lipid reserve.
const wL = K.createWorld({ seed: 6060 });
const pL = K.getPlayer(wL);
pL.organelles.lipogenic_processor = 1;
pL.cargo.energy = K.__test.caps(pL).energy;
pL.cargo.biomass = K.__test.caps(pL).biomass;
pL.cargo.lipids = 0;
const lipidsStart = pL.cargo.lipids, biomassStart = pL.cargo.biomass;
for (let i = 0; i < 240; i++) K.step(wL, {}, 1 / 60);
assert(pL.cargo.lipids > lipidsStart + 1, 'lipogenic processor builds lipid reserve from biomass');
assert(pL.cargo.biomass < biomassStart, 'lipogenic processor consumes biomass');

// Strain mutation grafts a signature organelle deterministically via applyStrain.
const wS = K.createWorld({ seed: 7070 });
const strained = K.__test.spawnPredator(wS, { x: 400, y: 1900 });
// Force a strain regardless of RNG by invoking the helper until it takes.
let mutated = strained.strain ? strained : null;
for (let i = 0; i < 40 && !mutated; i++) {
  const c = K.__test.spawnPredator(wS, { x: 400, y: 1900 });
  if (c.strain) mutated = c;
}
assert(mutated && mutated.strain && K.orgCount(mutated, mutated.strain) >= 1, 'strain mutation grafts its signature organelle onto the body');
assert(K.orgCount(mutated, 'anaerobic_processor') >= 3, 'strain graft is additive — baseline predator organs are preserved');

// Leech weapons: the parasite pulls biomass/lipids while dealing minimal damage.
const wP = K.createWorld({ seed: 8080 });
const pP = K.getPlayer(wP);
pP.organelles.leech_rasp = 1;
pP.cargo.energy = 40; pP.cargo.biomass = 0; pP.cargo.lipids = 0;
const host = K.__test.spawnAlgae(wP, { x: pP.x, y: pP.y, mature: true });
host.cargo.biomass = 80; host.cargo.lipids = 40;
// Isolate the leech mechanic: kill the host's photosynthesis (else it regrows the drained biomass)
// and pin it in contact each frame (a fat bloom now sinks away on pure ballast — tested elsewhere).
host.organelles.photosystem = 0; host._capsEpoch = -1;
const hostHpStart = host.hp, hostBioStart = host.cargo.biomass;
for (let i = 0; i < 60; i++) { host.x = pP.x; host.y = pP.y; host.vx = 0; host.vy = 0; K.step(wP, { rasp: true }, 1 / 60); }
assert(pP.cargo.biomass > 1 || pP.cargo.lipids > 1, 'leech rasp pulls biomass/lipids from the host into the parasite');
assert(host.cargo.biomass < hostBioStart, 'the host loses the leeched biomass');
assert((hostHpStart - host.hp) < hostBioStart, 'leeching deals only minimal damage relative to resources drained');

// ── Deep-predator strains: Gaussian genome + representative mechanics ────────
// Potency is a normal distribution centred on 1.0 — most rolls land in 0.8..1.2
// with rare tails, not a hard-capped uniform band.
const gw = K.createWorld({ seed: 24 });
const grolls = [];
for (let i = 0; i < 4000; i++) grolls.push(K.__test.gaussian(gw.rng, 1.0, 0.13));
const gmean = grolls.reduce((a, b) => a + b, 0) / grolls.length;
const gsd = Math.sqrt(grolls.reduce((a, b) => a + (b - gmean) ** 2, 0) / grolls.length);
assert(Math.abs(gmean - 1.0) < 0.02, 'genome potency is centred on 1.0');
assert(Math.abs(gsd - 0.13) < 0.02, 'genome potency SD ~0.13 (0.8..1.2 ≈ 1.5 SD)');
assert(grolls.some(r => r > 1.3) && grolls.some(r => r < 0.7), 'the distribution has real tails (god-rolls and duds exist)');

function deepWorld() { const w = K.createWorld({ seed: 909 }); return [w, K.getPlayer(w)]; }
function foe(w, p, extra = {}) { const e = K.__test.spawnProtozoan(w, { x: p.x, y: p.y + 18 }); e.strain = undefined; Object.assign(e, extra); return e; }

// Adrenal Vesicle: the combat multiplier climbs as HP falls.
{ const [w, p] = deepWorld(); p.organelles.adrenal_vesicle = 1; p.hp = K.__test.caps(p).hp;
  const full = K.__test.adrenalFactor(p); p.hp = K.__test.caps(p).hp * 0.05; const low = K.__test.adrenalFactor(p);
  assert(full === 1 && low > 1.5, 'adrenal vesicle scales damage up sharply near death'); }

// Rupture Auger pierces hardness; a normal saw lance is blunted by the same armor.
{ const [w, p] = deepWorld(); const tank = foe(w, p); tank.organelles.membrane = 5; tank.organelles.membrane_hardening = 6; tank.r = p.r * 2; tank.hp = 400;
  p.organelles.rupture_auger = 1; p.cargo.energy = 40; p.phase = 0; tank.x = p.x + p.r + tank.r; tank.y = p.y;
  const hp0 = tank.hp; for (let i = 0; i < 40; i++) K.step(w, { moveX: 1 }, 1 / 60);
  assert(tank.hp < hp0 - 1, 'rupture auger carves through heavy membrane hardening'); }

// Thorn Coat reflects damage back at the attacker.
{ const [w, p] = deepWorld(); const e = foe(w, p); e.organelles.thorn_coat = 1; e.strainPotency = 1;
  p.organelles.saw_lance = 1; p.cargo.energy = 40; p.phase = Math.atan2(e.y - p.y, e.x - p.x) || 0;
  const hp0 = p.hp; for (let i = 0; i < 40; i++) K.step(w, { moveY: 1 }, 1 / 60);
  assert(p.hp < hp0, 'thorn coat drives damage back into the attacker'); }

// Phagocyte Maw engulfs a small, weakened body into biomass.
// hp is set to 15% of cap: weakened (below the 0.2 engulf threshold) but able to survive one
// metabolic tick — a 1-hp cell now dies to metabolism before the contact phase can engulf it.
{ const [w, p] = deepWorld(); p.organelles.phagocyte_maw = 1; p.r = 42; const e = foe(w, p); e.r = 9; e.hp = K.__test.caps(e).hp * 0.15; e.maxHp = 120;
  const bio0 = p.cargo.biomass; K.step(w, {}, 1 / 60);
  assert(!e.alive && p.cargo.biomass > bio0, 'phagocyte maw swallows weak prey for biomass'); }

// Discharge Vesicle auto-shocks a nearby foe with no input.
{ const [w, p] = deepWorld(); p.organelles.discharge_vesicle = 1; p.cargo.energy = 40; const e = foe(w, p);
  const hp0 = e.hp; for (let i = 0; i < 120; i++) K.step(w, {}, 1 / 60);
  assert(e.hp < hp0, 'discharge vesicle shocks nearby hostiles on its own'); }

// Seeker Gland auto-launches a homing projectile.
{ const [w, p] = deepWorld(); p.organelles.seeker_gland = 1; p.cargo.energy = 40; foe(w, p);
  let fired = false; for (let i = 0; i < 120 && !fired; i++) { K.step(w, {}, 1 / 60); if (w.hazards.some(h => h.kind === 'seeker')) fired = true; }
  assert(fired, 'seeker gland fires homing shots automatically'); }

// Volatile Vacuole detonates on death.
{ const [w, p] = deepWorld(); const e = foe(w, p); e.organelles.volatile_vacuole = 1; e.hp = 0;
  K.step(w, {}, 1 / 60); assert(w.hazards.some(h => h.kind === 'blast'), 'volatile vacuole detonates when the body dies'); }

// Side logic: the player and a fission bud are allies; a wild protozoan is hostile.
{ const [w, p] = deepWorld(); const e = foe(w, p); K.__test.budFriendly(w, p, p.x, p.y);
  const bud = w.entities.find(x => x.friendly && x.friendLife > 0);
  assert(bud && !K.__test.areHostile(p, bud), 'player and its fission bud are on the same side');
  assert(K.__test.areHostile(p, e), 'a wild protozoan is hostile to the player'); }

// ── Symbiotic colony + distinct deep bodies + deep metazoans ─────────────────

// The swarm is gated behind the Pheromone Gland organelle: no gland, no colony.
{ const w = K.createWorld({ seed: 3131 }); const p = K.getPlayer(w);
  p.organelles.storage_vacuole = 4; p.organelles.exotic_vacuole = 4; p.organelles.dna_memory_vesicle = 3;
  p.cargo.biomass = 200; p.cargo.energy = 200; p.cargo.spores = 4;
  const noGland = K.buyOffering(w, 'companion_grazer');
  assert(!noGland.ok && /Pheromone Gland|requires/i.test(noGland.reason), 'no swarm can be raised without a Pheromone Gland');
  assert(K.__test.swarmCap(p) === 0, 'swarm capacity is zero without a gland');
  p.organelles.pheromone_gland = 1;
  assert(K.__test.swarmCap(p) === 3, 'one gland conducts a swarm of 3');
  p.cargo.spores = 0;
  const broke = K.buyOffering(w, 'companion_grazer');
  assert(!broke.ok && /spore/.test(broke.reason), 'the grazer swarm still needs spore-pheromones to raise');
  p.cargo.spores = 4;
  const r = K.buyOffering(w, 'companion_grazer');
  assert(r.ok, 'with a gland and pheromones, a Grazer Swarm is raised');
  const comp = w.entities.find(e => e.controller === 'companion');
  assert(comp && comp.friendly && comp.ownerId === p.id, 'the swarm is an independent friendly cell owned by the player');
  assert(!K.__test.areHostile(p, comp), 'the swarm is on the player\'s side'); }

// The armed swarms are froth-gated: gland PLUS an exotic DNA discovery, not a hard rule.
{ const w = K.createWorld({ seed: 3030 }); const p = K.getPlayer(w);
  p.organelles.storage_vacuole = 6; p.organelles.exotic_vacuole = 6; p.organelles.dna_memory_vesicle = 2;
  p.organelles.pheromone_gland = 1;
  p.cargo.biomass = 300; p.cargo.spores = 8; p.cargo.crystals = 3; p.cargo.dna = 3;
  const early = K.buyOffering(w, 'companion_lancer');
  assert(!early.ok && /Velocity Lance|harvest/i.test(early.reason), 'the lancer swarm is locked until its charge-lance gene is sequenced from the froth');
  assert(early.reason && !/mitochond/i.test(early.reason), 'the swarm is not behind a hard mitochondrial gate');
  w.discoveredSources.set('velocity_lance', 1.0); // sequence the gene harvested in the froth
  const late = K.buyOffering(w, 'companion_lancer');
  assert(late.ok, 'once the lance gene is discovered, the armed swarm can be raised'); }

// Swarm capacity scales with glands; buying past it is refused.
{ const w = K.createWorld({ seed: 3232 }); const p = K.getPlayer(w);
  p.organelles.storage_vacuole = 6; p.organelles.exotic_vacuole = 6; p.organelles.pheromone_gland = 2;
  p.cargo.biomass = 999;
  const cap = K.__test.swarmCap(p);
  assert(cap === 6, 'two glands conduct a swarm of 6');
  for (let i = 0; i < cap; i++) { p.cargo.spores = 6; assert(K.buyOffering(w, 'companion_grazer').ok, 'swarms buy up to the gland-scaled cap'); }
  p.cargo.spores = 6;
  const over = K.buyOffering(w, 'companion_grazer');
  assert(!over.ok && /colony full/.test(over.reason), 'the colony is capped by gland count'); }

// No friendly fire: a rasping swarm overlapping the player deals it no damage.
{ const w = K.createWorld({ seed: 3333 }); const p = K.getPlayer(w);
  p.organelles.storage_vacuole = 4; p.organelles.exotic_vacuole = 4; p.organelles.pheromone_gland = 1; p.cargo.biomass = 200; p.cargo.spores = 4;
  K.buyOffering(w, 'companion_grazer');
  // Isolate the player + its swarm from any wild attacker that happened to spawn nearby
  // (e.g. a mutant leech algae), so this tests friendly-fire only.
  w.entities = w.entities.filter(e => e.kind === 'player' || e.controller === 'companion');
  const comp = w.entities.find(e => e.controller === 'companion');
  p.hp = K.__test.caps(p).hp; const hp0 = p.hp; comp.x = p.x; comp.y = p.y; comp.action = 'rasp';
  for (let i = 0; i < 30; i++) { comp.x = p.x; comp.y = p.y; comp.action = 'rasp'; K.step(w, {}, 1 / 60); }
  assert(K.getPlayer(w).hp >= hp0 - 0.01, 'a friendly swarm never damages the player (no friendly fire)'); }

// Player death scatters the independent colony (swarms do not orphan).
{ const w = K.createWorld({ seed: 3434 }); const p = K.getPlayer(w);
  p.organelles.storage_vacuole = 4; p.organelles.exotic_vacuole = 4; p.organelles.pheromone_gland = 1; p.cargo.biomass = 200; p.cargo.spores = 4;
  K.buyOffering(w, 'companion_grazer');
  assert(K.__test.companionCount(w, p.id) === 1, 'swarm present before death');
  K.killPlayer(w); K.step(w, {}, 1 / 60);
  assert(K.__test.companionCount(w, K.getPlayer(w).id) === 0, 'swarms dissolve when the player dies'); }

// Mark for death: the gland paints a hostile, and a marked target bleeds faster.
{ const w = K.createWorld({ seed: 3535 }); const p = K.getPlayer(w);
  w.entities = w.entities.filter(e => e.kind === 'player'); // isolate the path so the blob can only hit our foe
  p.organelles.pheromone_gland = 1; p.organelles.exotic_vacuole = 2; p.cargo.spores = 4; p.cargo.energy = 40;
  const foe = K.__test.spawnProtozoan(w, { x: p.x + 120, y: p.y }); foe.strain = undefined;
  const vBefore = K.__test.vulnerability(foe);
  let marked = false;
  for (let i = 0; i < 60 && !marked; i++) { foe.x = p.x + 120; foe.y = p.y; K.step(w, { mark: true, aimX: 1, aimY: 0 }, 1 / 60); if ((foe.marked || 0) > 0) marked = true; }
  assert(marked && foe.markedBy === p.id, 'the pheromone blob marks the struck hostile for the player');
  assert(K.__test.vulnerability(foe) > vBefore + 0.4, 'a marked target takes ~50% more damage'); }

// Deep swarm-director: conducts its own hostile swarm and drops the gland gene.
{ const w = K.createWorld({ seed: 3636 }); const p = K.getPlayer(w);
  const brood = K.__test.spawnBrood(w, { x: 400, y: 3600 });
  assert(brood.controller === 'brood' && brood.strain === 'pheromone_gland', 'a director\'s signature gene is the Pheromone Gland');
  assert(w.entities.some(e => e.controller === 'swarm_agent' && e.ownerId === brood.id), 'the director conducts its own swarm of assistants');
  assert(K.__test.areHostile(p, brood), 'a wild director is hostile to the player');
  p.organelles.mitochondrion = 1; // ensure the high DNA-drop roll
  brood.x = p.x; brood.y = p.y + 40; brood.hp = 0; K.step(w, {}, 1 / 60);
  assert(w.particles.some(q => q.kind === 'dna' && q.source === 'pheromone_gland'), 'cracking a director sheds Pheromone Gland DNA'); }

// Foraging return: a symbiont hands surplus matter back to its host.
{ const w = K.createWorld({ seed: 3737 }); const p = K.getPlayer(w);
  p.organelles.storage_vacuole = 4; const owner = p; const bio0 = 5;
  p.cargo.biomass = bio0;
  const comp = K.__test.spawnCompanion(w, p, 'grazer'); comp.x = p.x; comp.y = p.y; comp.cargo.biomass = 40;
  const gained0 = p.cargo.biomass;
  for (let i = 0; i < 60; i++) { comp.x = p.x; comp.y = p.y; K.step(w, {}, 1 / 60); }
  assert(K.getPlayer(w).cargo.biomass > gained0, 'a foraging symbiont delivers surplus biomass to its host'); }

// Distinct deep bodies: deep cells carry a body-plan tag driven by their strain category.
{ const w = K.createWorld({ seed: 3535 }); const p = K.getPlayer(w);
  const proto = K.__test.spawnProtozoan(w, { x: 400, y: 3400 });
  assert(proto.bodyPlan, 'a deep protozoan is assigned a distinct body plan');
  const spiny = K.__test.spawnProtozoan(w, { x: 400, y: 3400 });
  spiny.strain = 'saw_lance'; K.__test.assignBody(spiny);
  assert(spiny.bodyPlan === 'spiny', 'a lance-strain deep cell gets a spiny silhouette');
  const proj = K.getRenderProjection(w);
  assert(proj.entities.some(e => e.bodyPlan), 'the render projection carries bodyPlan for the renderer'); }

// Deep metazoans: multicellular, with their own mitochondria and a real colony body.
{ const w = K.createWorld({ seed: 3636 }); const p = K.getPlayer(w);
  const meta = K.__test.spawnMetazoan(w, { x: 400, y: 3600 });
  assert(meta.controller === 'metazoan' && meta.bodyPlan === 'colonial', 'a metazoan is a colonial deep predator');
  assert(meta.colony && meta.colony.length >= 2, 'a metazoan is built from multiple somatic sub-cells');
  assert(K.hasMito(meta), 'a metazoan carries its own mitochondria');
  const proto = K.__test.spawnProtozoan(w, { x: 800, y: 3600 });
  assert(meta.maxHp > proto.maxHp, 'the multicellular body pools far more HP than a single protozoan');
  assert(K.__test.areHostile(p, meta), 'a wild metazoan is hostile to the player');
  const proj = K.getRenderProjection(w);
  assert(proj.entities.some(e => e.controller === 'metazoan_cell'), 'metazoan somatic cells render around the lead body'); }

// A cracked metazoan is a jackpot: it sheds the richest DNA drop.
{ const w = K.createWorld({ seed: 3737 }); const p = K.getPlayer(w);
  p.organelles.mitochondrion = 1; // guarantee the high DNA-drop roll path
  const meta = K.__test.spawnMetazoan(w, { x: p.x, y: p.y + 40 });
  meta.strain = 'velocity_lance'; meta.strainPotency = 1.1;
  const before = w.particles.filter(q => q.kind === 'dna').length;
  meta.hp = 0; K.step(w, {}, 1 / 60);
  const dna = w.particles.filter(q => q.kind === 'dna');
  assert(dna.length > before, 'a dead metazoan drops DNA'); }

// ── Balance notes: DNA instability, coin pickup, starvation, repair cost ─────

// Exotics are swept up like coins (no feed), but only with storage room.
{ const w = K.createWorld({ seed: 4646 }); const p = K.getPlayer(w);
  p.x = 700; p.y = 1200; p.cargo.spores = 0;
  w.particles.push({ id: 't_sp', kind: 'spores', x: 700, y: 1200, value: 1, vx: 0, vy: 0, age: 0, maxAge: 999, color: '#fff' });
  K.step(w, {}, 1 / 60);
  assert(p.cargo.spores === 1, 'a spore is picked up like a coin with no feed action (starter exotic rack has room)'); }

// Partial pickup: a value-2/3 exotic drop (deep spore clusters) is collectible with a
// single-slot rack — you take what fits and the rest waits. This is the spore-pickup fix.
{ const w = K.createWorld({ seed: 4647 }); const p = K.getPlayer(w);
  p.x = 700; p.y = 1200; p.cargo.spores = 0; // starter exotic rack = 1 spore slot
  w.particles.push({ id: 'sp3', kind: 'spores', x: 700, y: 1200, value: 3, vx: 0, vy: 0, age: 0, maxAge: 999, color: '#fff' });
  K.step(w, {}, 1 / 60);
  assert(p.cargo.spores === 1, 'a value-3 spore cluster still yields one spore into a single slot (no longer un-pickable)');
  const left = w.particles.find(q => q.id === 'sp3');
  assert(left && left.value === 2, 'the remaining spores stay in the water as a reservoir'); }

// DNA is unstable: a short base life, and toxins shred it far faster.
{ const w = K.createWorld({ seed: 4747 });
  const pc = { id: 'dc', kind: 'dna', x: 400, y: 1500, value: 1, vx: 0, vy: 0, age: 0, maxAge: 9, color: '#fff' };
  w.particles.push(pc);
  K.step(w, {}, 1 / 60); // clean water: ages by one dt
  const w2 = K.createWorld({ seed: 4748 });
  const px = { id: 'dt', kind: 'dna', x: 400, y: 1500, value: 1, vx: 0, vy: 0, age: 0, maxAge: 9, color: '#fff' };
  w2.particles.push(px);
  w2.fields.push({ id: 'tf', x: 400, y: 1500, radius: 80, stock: { toxins: 30 }, density: 1, sourceKind: 'tox', age: 0, maxAge: 99, decayRate: 0, radiusScale: 8, maxRadius: 200 });
  K.step(w2, {}, 1 / 60);
  assert(px.age > pc.age + 0.01, 'DNA in a toxic field denatures faster than in clean water'); }

// Predators strip loose DNA for raw biomass instead of storing information.
{ const w = K.createWorld({ seed: 4848 }); const p = K.getPlayer(w);
  const pred = K.__test.spawnPredator(w, { x: 900, y: 2000 }); pred.cargo.biomass = 0;
  w.particles.push({ id: 'dpred', kind: 'dna', x: pred.x, y: pred.y, value: 1, vx: 0, vy: 0, age: 0, maxAge: 999, color: '#fff' });
  const bio0 = pred.cargo.biomass;
  for (let i = 0; i < 3; i++) K.step(w, {}, 1 / 60);
  assert(pred.cargo.biomass > bio0, 'a predator devours loose DNA for biomass');
  assert(!w.particles.some(q => q.id === 'dpred'), 'the eaten DNA strand is consumed'); }

// Starvation: out of ATP with almost no biomass, the body bleeds HP (no idle stall).
{ const w = K.createWorld({ seed: 4949 }); const p = K.getPlayer(w);
  p.cargo.energy = 0; p.cargo.biomass = 0.1; p.hp = K.__test.caps(p).hp; const hp0 = p.hp;
  for (let i = 0; i < 60; i++) { p.cargo.energy = 0; p.cargo.biomass = Math.min(0.1, p.cargo.biomass); K.step(w, {}, 1 / 60); }
  assert(K.getPlayer(w).hp < hp0 - 3, 'a starving cell (no ATP, no biomass) autolyses instead of stalling'); }

// Yuki is a rest point, not a trader: healing while resting near her is FREE (no offering to buy, no
// matter spent) — she just eases HP up while the shop is open.
{ const w = K.createWorld({ seed: 1 });
  assert(!K.getYukiOfferings(w).some(o => o.id === 'repair'), 'repair is no longer a purchasable offering');
  const p = K.getPlayer(w); p.hp = 10; const b0 = p.cargo.biomass, l0 = p.cargo.lipids;
  K.yukiRestore(w, 1 / 60, p.id);
  assert(p.hp > 10, 'resting at Yuki heals for free');
  assert(p.cargo.biomass === b0 && p.cargo.lipids === l0, 'free healing draws no matter'); }

// ── Exotics as consumable verbs ─────────────────────────────────────────────

// Each consumable verb is its own atomic organ. Bloom Dash needs the Spore Jet Vesicle.
{ const w = K.createWorld({ seed: 5151 }); const p = K.getPlayer(w);
  p.organelles.dash_vacuole = 1; p.organelles.exotic_vacuole = 2; p.cargo.energy = 60; p.cargo.spores = 2;
  // Without the Spore Jet organ, a dash does NOT bloom even with spores in the tank.
  K.step(w, { dash: true, moveX: 1 }, 1 / 60);
  assert(!w.events.some(e => e.type === 'bloom_dash') && p.cargo.spores === 2, 'a plain dash does not bloom without the Spore Jet Vesicle');
  p.organelles.spore_jet = 1; p.cargo.energy = 60;
  const sp0 = p.cargo.spores;
  K.step(w, { dash: true, moveX: 1 }, 1 / 60);
  assert(p.cargo.spores === sp0 - 1, 'with the Spore Jet organ, a dash blooms and consumes a spore');
  assert(w.hazards.some(h => h.kind === 'spore_cloud'), 'bloom dash vents a spore cloud');
  assert(w.events.some(e => e.type === 'bloom_dash'), 'a bloom_dash event fires'); }

// Engulf is the Phagosome Gland's atomic function (distinct from the passive Phagocyte Maw).
{ const w = K.createWorld({ seed: 5252 }); const p = K.getPlayer(w);
  w.entities = w.entities.filter(e => e.kind === 'player'); // isolate so engulf can only target our prey
  p.organelles.phagosome = 1; p.organelles.exotic_vacuole = 2; p.cargo.enzymes = 2; p.cargo.energy = 40; p.r = 40;
  const prey = K.__test.spawnProtozoan(w, { x: p.x + 10, y: p.y }); prey.strain = undefined; prey.r = 12; prey.hp = 5;
  const enz0 = p.cargo.enzymes, bio0 = p.cargo.biomass;
  const ok = K.__test.engulfPulse(w, p);
  assert(ok && !prey.alive, 'engulf instakills the eligible overlapping hostile');
  assert(p.cargo.enzymes === enz0 - 1, 'engulf consumes one enzyme');
  assert(p.cargo.biomass > bio0, 'engulf renders the prey into biomass'); }

// Crystal Ward is the Crystalline Ward Lattice's atomic function.
{ const w = K.createWorld({ seed: 5353 }); const p = K.getPlayer(w);
  p.organelles.crystal_ward = 1; p.organelles.exotic_vacuole = 2; p.cargo.crystals = 2; p.cargo.energy = 40;
  const hard0 = K.__test.membraneHardness(p);
  const ok = K.__test.wardPulse(w, p);
  assert(ok && p.warded > 0, 'ward raises a timed shield');
  assert(p.cargo.crystals === 1, 'ward consumes one crystal');
  assert(K.__test.membraneHardness(p) > hard0, 'ward hardens the membrane while active');
  // a warded launcher shot pierces (does not burst on first contact)
  p.organelles.toxin_launcher = 1; p.cargo.toxins = 10;
  K.__test.spawnPredator(w, { x: p.x + 40, y: p.y });
  const before = w.hazards.length;
  K.step(w, { acid: true, aimX: 1, aimY: 0 }, 1 / 60);
  const proj = w.hazards.find(h => h.kind === 'toxic_projectile');
  assert(proj && proj.pierce === true, 'a warded launcher shot is overcharged to pierce'); }

// Enzymatic Surge is the Enzyme Reserve Sac's atomic function (auto when starved).
{ const w = K.createWorld({ seed: 5454 }); const p = K.getPlayer(w);
  p.organelles.enzyme_reserve = 1; p.organelles.exotic_vacuole = 2; p.cargo.enzymes = 2; p.cargo.biomass = 30; p.cargo.energy = 0;
  const enz0 = p.cargo.enzymes;
  let surged = false;
  for (let i = 0; i < 5 && !surged; i++) { K.step(w, {}, 1 / 60); if (w.events.some(e => e.type === 'surge')) surged = true; }
  assert(surged, 'a starved catalytic cell auto-surges');
  assert(p.cargo.enzymes < enz0, 'the surge consumes an enzyme'); }

// ── DNA housekeeping: pick up freely, sort junk vs good at sequencing ────────

// Any DNA is picked up when there is storage room — junk included (sorted later).
{ const w = K.createWorld({ seed: 6262 }); const p = K.getPlayer(w);
  p.organelles.dna_memory_vesicle = 3; p.cargo.dna = 0;
  w.discoveredSources.set('velocity_lance', 1.2); // already known, strong → this strand is junk
  w.particles.push({ id: 'junk', kind: 'dna', x: p.x, y: p.y, value: 1, vx: 0, vy: 0, age: 0, maxAge: 999, color: '#fff', source: 'velocity_lance', potency: 0.9 });
  K.step(w, {}, 1 / 60);
  assert(p.cargo.dna === 1, 'DNA is picked up whenever there is storage room (junk included)');
  assert(!p.carriedStrains.has('velocity_lance'), 'but a worse-than-known strand is not tracked as a good sample'); }

// A FULL DNA store cannot pick up more — storage is the investment / the constraint.
{ const w = K.createWorld({ seed: 6363 }); const p = K.getPlayer(w);
  p.organelles.dna_memory_vesicle = 1; p.cargo.dna = 1; // full
  w.particles.push({ id: 'up', kind: 'dna', x: p.x, y: p.y, value: 1, vx: 0, vy: 0, age: 0, maxAge: 999, color: '#fff', source: 'saw_lance', potency: 1.3 });
  K.step(w, {}, 1 / 60);
  assert(!p.carriedStrains.has('saw_lance') && p.cargo.dna === 1, 'a full DNA store blocks pickup — invest in storage or be choosier on the way down'); }

// Nuclease Vesicle: junk strands digest to biomass on pickup, never taking a DNA slot.
{ const w = K.createWorld({ seed: 6565 }); const p = K.getPlayer(w);
  p.organelles.nuclease_vesicle = 1; p.organelles.storage_vacuole = 3; p.organelles.dna_memory_vesicle = 1;
  w.discoveredSources.set('velocity_lance', 1.2); // known strong → worse strands are junk
  p.cargo.dna = 1; p.cargo.biomass = 0; // DNA store is FULL
  w.particles.push({ id: 'jk', kind: 'dna', x: p.x, y: p.y, value: 1, vx: 0, vy: 0, age: 0, maxAge: 999, color: '#fff', source: 'velocity_lance', potency: 0.8 });
  K.step(w, {}, 1 / 60);
  assert(!w.particles.some(q => q.id === 'jk'), 'the nuclease dissolves a junk strand even with the DNA store full');
  assert(p.cargo.dna === 1 && p.cargo.biomass > 0, 'the junk becomes biomass and takes no DNA slot');
  // Untagged DNA (no genome to unlock) is junk too — the nuclease digests it as well.
  p.cargo.dna = 0; p.cargo.biomass = 0;
  w.particles.push({ id: 'unt', kind: 'dna', x: p.x, y: p.y, value: 1, vx: 0, vy: 0, age: 0, maxAge: 999, color: '#fff' });
  K.step(w, {}, 1 / 60);
  assert(!w.particles.some(q => q.id === 'unt') && p.cargo.dna === 0 && p.cargo.biomass > 0, 'the nuclease also digests untagged DNA into biomass');
  // A genuine upgrade still falls through to normal DNA storage.
  p.cargo.dna = 0;
  w.particles.push({ id: 'gd', kind: 'dna', x: p.x, y: p.y, value: 1, vx: 0, vy: 0, age: 0, maxAge: 999, color: '#fff', source: 'saw_lance', potency: 1.1 });
  K.step(w, {}, 1 / 60);
  assert(p.carriedStrains.get('saw_lance') === 1.1 && p.cargo.dna === 1, 'the nuclease leaves good genomes to bank normally'); }

// Sequencing sorts the whole tank: good genomes unlock the shop, junk restocks scarce exotics.
{ const w = K.createWorld({ seed: 6464 }); const p = K.getPlayer(w);
  p.organelles.dna_memory_vesicle = 6; p.organelles.storage_vacuole = 4; p.organelles.exotic_vacuole = 3; p._capsEpoch = -1;
  p.cargo.energy = 20; p.cargo.spores = 0; p.cargo.enzymes = 0; p.cargo.crystals = 0;
  p.cargo.dna = 4; p.carriedStrains = new Map([['saw_lance', 1.3]]); // 1 good genome + 3 junk strands
  const r = K.buyOffering(w, 'sequence_dna');
  assert(r.ok && r.sequenced === 1 && r.rendered === 3, 'sequencing unlocks 1 good genome and renders 3 junk strands');
  assert(w.discoveredSources.has('saw_lance'), 'the good genome upgrades the shop (unlocked)');
  assert(((p.cargo.spores || 0) + (p.cargo.enzymes || 0) + (p.cargo.crystals || 0)) >= 3, 'the 3 junk strands restock scarce exotics (not biomass)');
  assert(p.carriedStrains.size === 0, 'the sample queue is cleared after sequencing');
  assert(p.cargo.dna === 0, 'the whole DNA tank is consumed — good spent to unlocks, junk to exotics'); }

// Every DNA-locked organelle must be carried by some enemy strain, or it is
// permanently unobtainable. This guards the requiresDiscovery <-> STRAINS contract.
{ const w = K.createWorld({ seed: 909 });
  const gates = [...new Set(K.getYukiOfferings(w).filter(o => o.requiresDiscovery).map(o => o.requiresDiscovery))];
  const carried = new Set(['pheromone_gland']); // brood sets this strain manually
  for (const pool of Object.values(K.__test.STRAINS)) for (const s of pool) carried.add(s.org);
  const orphans = gates.filter(g => !carried.has(g));
  assert(orphans.length === 0, 'every requiresDiscovery gate is carried by an enemy strain (orphans: ' + orphans.join(', ') + ')');
  assert(gates.length >= 30, 'the full exotic roster is gated behind discovery');
}

// Lean starter set: only the minimum kit is buyable at start; everything else — including
// the ballast/respiration organs and the general metabolism base — is DNA-locked. Diving
// is baseline (W/S), so no dive organ is needed in the starter set.
{ const w = K.createWorld({ seed: 4242 });
  const offs = K.getYukiOfferings(w);
  const LEAN_CORE = ['membrane', 'membrane_intake', 'anaerobic_processor', 'flagella', 'photosystem', 'oxygen_vacuole', 'storage_vacuole', 'exotic_vacuole', 'rasping_lamella', 'dna_memory_vesicle', 'ballast_stone'];
  for (const id of LEAN_CORE) {
    const o = offs.find(x => x.id === id);
    assert(o && !o.requiresDiscovery && !o.undiscovered, `lean-core organ ${id} is buyable at start (no discovery gate)`);
  }
  const NEWLY_LOCKED = ['oxidase_vesicle', 'anabolic_vesicle', 'lipolytic_vesicle', 'mineralizing_gland', 'nuclease_vesicle', 'dash_vacuole', 'oxygen_store', 'oxygen_tolerance', 'gas_gland', 'pressure_bladder', 'ballast_siphon', 'lipid_bladder', 'lance_bristle', 'toxin_launcher', 'phagosome', 'biomass_vacuole', 'lipid_vacuole', 'toxin_vacuole'];
  for (const id of NEWLY_LOCKED) {
    const o = offs.find(x => x.id === id);
    assert(o && o.requiresDiscovery === id && o.undiscovered, `${id} is DNA-locked at start`);
  }
  // DNA-economy bootstrap must not soft-lock: the player carries DNA only through the DNA
  // Memory Vesicle (its cap = count * stats.dna), and the player spawns with none — so that
  // organ MUST stay in the buyable lean core or discovery can never begin.
  assert(LEAN_CORE.includes('dna_memory_vesicle'), 'dna_memory_vesicle stays buyable so the discovery loop can bootstrap');
  const p = K.getPlayer(w);
  p.organelles.dna_memory_vesicle = 0; p._capsEpoch = -1;
  assert((K.__test.caps(p).dna || 0) === 0, 'with no DNA Memory Vesicle the DNA carry cap is zero (soft-lock without it)');
  p.organelles.dna_memory_vesicle = 3; p._capsEpoch = -1;
  assert(K.__test.caps(p).dna > 0, 'buying DNA Memory Vesicle opens DNA carry capacity — discovery can proceed');
}

// Resource-field drift physics: fields are decoupled per resource type, each with its own physics —
// a biomass field sinks, a lipid field rises. spawnResourceField() returns only the FIRST field it
// creates (per FIELD_RES order), so look each type up in world.fields by resType instead of trusting
// the return value for anything but the single-resource-stock case.
{ const w = K.createWorld({ seed: 4243 });
  w.fields.length = 0;
  K.__test.spawnResourceField(w, 400, K.WORLD.canopy + 600, { biomass: 120 }, { sourceKind: 'test' });
  K.__test.spawnResourceField(w, 800, K.WORLD.canopy + 600, { lipids: 120 }, { sourceKind: 'test' });
  const bioField = w.fields.find(f => f.resType === 'biomass');
  const lipField = w.fields.find(f => f.resType === 'lipids');
  const by0 = bioField.y, ly0 = lipField.y;
  for (let i = 0; i < 180; i++) K.step(w, {}, 1 / 60);
  assert(bioField.y > by0 + 5, 'a biomass-heavy field sinks over time');
  assert(lipField.y < ly0 - 2, 'a lipid-heavy field floats up over time');
}

// A mutant ALWAYS sheds its tagged gene when killed (guaranteed harvest, no drop-roll).
{ const w = K.createWorld({ seed: 910 });
  const pred = K.__test.spawnPredator(w, { y: 2000, x: 400 });
  pred.strain = 'velocity_lance'; pred.strainPotency = 1.2; // force a known mutant
  const nBefore = w.particles.filter(p => p.kind === 'dna').length;
  K.getPlayer(w).organelles.mitochondrion = 0; // even without mito, a mutant still drops
  pred.hp = 0; K.step(w, {}, 1 / 60);
  const drops = w.particles.filter(p => p.kind === 'dna' && p.source === 'velocity_lance');
  assert(drops.length >= 1, 'a killed mutant always drops its tagged DNA');
  assert(Math.abs(drops[0].potency - 1.2) < 1e-6, 'the drop carries the individual\'s potency');
}

// Grafting is a gritty initiation: installing an organ spikes toxins and tears HP.
{ const w = K.createWorld({ seed: 1201 });
  const p = K.getPlayer(w);
  p.cargo.biomass = 60; p.cargo.lipids = 40; p.cargo.energy = 40; p.cargo.enzymes = 4; p.cargo.toxins = 0;
  p.hp = K.getHudProjection(w).hp.max; // full HP
  const hpBefore = p.hp, toxBefore = p.cargo.toxins || 0;
  const res = K.buyOffering(w, 'membrane'); // a plain organelle graft
  assert(res.ok, 'membrane graft succeeds with stock');
  assert(p.hp < hpBefore, 'grafting damages HP (initiation trauma)');
  assert(hpBefore - p.hp >= K.__test.GRAFT_INITIATION.hpMin - 1e-6, 'HP hit is at least the trauma floor');
  assert((p.cargo.toxins || 0) === toxBefore, 'grafting no longer adds toxins (Yuki is gentle) — only an HP tear');
  assert(w.events.some(e => e.type === 'graft_trauma'), 'a graft_trauma event fires on graft');
  assert(p.hp >= 1, 'graft trauma never kills outright (clamped to 1)');
}

// Ballast is target-seeking: S/down is a fast, direct valve (vents gas immediately); W/up only sets a
// DESIRED gas volume (gasTarget) — the tank itself fills gradually afterward via fermentation, not
// directly from the key press.
{ const w = K.createWorld({ seed: 1301 });
  const p = K.getPlayer(w);
  p.organelles.oxygen_vacuole = 2; p._capsEpoch = -1; p.ballastGas = 0.5; p.cargo.energy = K.__test.caps(p).energy;
  const gas0 = p.ballastGas;
  // ANALOG vent: hold S / down → GRADUALLY vents ballast gas (sink), not a binary flood-dump.
  for (let i = 0; i < 18; i++) K.step(w, { moveY: 1 }, 1 / 60);
  const gasVented = K.getPlayer(w).ballastGas;
  assert(gasVented < gas0, 'holding DOWN gradually vents ballast gas (sink)');
  assert(gasVented > 0.15, 'a short vent does NOT dump the whole reserve — it trims (analog)');
  // Hold W / up → immediately raises the TARGET (an intent), not the gas itself. Venting above already
  // clamped gasTarget down to (at most) the post-vent gas level, so its floor here is gasVented.
  const target0 = p.gasTarget || 0;
  for (let i = 0; i < 18; i++) K.step(w, { moveY: -1 }, 1 / 60);
  assert(p.gasTarget > target0, 'holding UP raises the desired gas target right away');
  // Give it real time + biomass to ferment toward that target — the tank actually follows.
  p.cargo.biomass = Math.max(p.cargo.biomass, 40);
  for (let i = 0; i < 60 * 6; i++) K.step(w, { moveY: -1 }, 1 / 60);
  assert(K.getPlayer(w).ballastGas > gasVented, 'given time, fermentation gradually fills the tank toward the target');
}
{ const w = K.createWorld({ seed: 1302 });
  const p = K.getPlayer(w);
  p.organelles.oxygen_vacuole = 0; p._capsEpoch = -1;
  K.step(w, { moveY: 1 }, 1 / 60);
  assert(!p.ballast, 'no oxygen vacuole → ballast control is inert (the float organ gates it)');
}

// GRADIENT-TRAVERSAL COST MODEL: descending your own weight gradient is free/cheap, climbing against
// it costs real ATP — for the player AND for every NPC brain, via the same shared functions.
{ const run = (orgs, biomass, vy) => { const w = K.createWorld({ seed: 1310 }); const p = K.getPlayer(w);
    p.organelles = orgs; p._capsEpoch = -1; p.cargo.biomass = biomass; p.cargo.energy = 30; p.ballastGas = 0.1;
    const e0 = p.cargo.energy;
    for (let i = 0; i < 60; i++) K.step(w, { moveY: vy }, 1 / 60);
    return e0 - p.cargo.energy; };
  const bladder = { membrane: 1, oxygen_vacuole: 1, storage_vacuole: 1 };
  const spentNeutral = run(bladder, 0, 0), spentVent = run(bladder, 0, 1), spentPump = run(bladder, 0, -1);
  assert(Math.abs(spentVent - spentNeutral) < 1e-6, 'venting ballast (sinking, with the weight gradient) is free — no ATP beyond background metabolism');
  // Ballast is target-seeking now (see the plan/applyPlayerCommands): holding W itself is a free intent
  // (no direct ATP debit from the key press, same as venting) — with zero biomass there's nothing to
  // ferment toward the target, so pumping costs exactly as little as venting here.
  assert(Math.abs(spentPump - spentNeutral) < 1e-6, 'holding UP with no biomass to ferment costs nothing directly — the cost moved into fermentation, not the key press');
  // With real biomass on hand, holding W drives measurably more fermentation (ballastWork, see the
  // PROCESSORS loop) toward the target than sitting neutral with an already-satisfied target — the
  // real cost of "rising" now. (An untouched target defaults to full cap — same as the old always-fill
  // offgas behavior — so both runs start from an explicitly satisfied target for a clean comparison.)
  const runBio = (vy) => { const w = K.createWorld({ seed: 1311 }); const p = K.getPlayer(w);
    p.organelles = { membrane: 1, oxygen_vacuole: 1, storage_vacuole: 1, anaerobic_processor: 2 }; p._capsEpoch = -1;
    p.cargo.biomass = 40; p.cargo.energy = K.__test.caps(p).energy; p.ballastGas = 0.1; p.gasTarget = 0.1;
    const b0 = p.cargo.biomass;
    for (let i = 0; i < 60; i++) K.step(w, { moveY: vy }, 1 / 60);
    return b0 - p.cargo.biomass; };
  assert(runBio(-1) > runBio(0), 'with biomass available, holding UP (raising an already-satisfied target) burns measurably more of it than sitting neutral');
  const heavyOrgs = { membrane: 1, storage_vacuole: 1, basal_motility: 1, ballast_stone: 4 };
  const flat = run(heavyOrgs, 0, 0), up = run(heavyOrgs, 0, -1), down = run(heavyOrgs, 0, 1);
  assert((up - flat) > (down - flat) * 1.5, 'bladderless direct thrust: climbing against a heavy body costs noticeably more than descending with it'); }

// The same gradient-aware price now applies to NPC brains too — a wild body pays ATP to move, not
// just an on/off "powered" gate. Force a scavenger to chase a lure and confirm it spends ATP.
{ const w = K.createWorld({ seed: 1311 }); w.entities = w.entities.filter(e => e.kind === 'player');
  const s = K.__test.spawnScavenger(w, { x: 500, y: 1200 }); s.cargo.energy = 20;
  w.fields.push({ id: 'lure', x: 900, y: 1200, radius: 40, stock: { biomass: 30 }, density: 1, sourceKind: 'test', age: 0, maxAge: 999, resType: 'biomass', decayRate: 0, radiusScale: 8, maxRadius: 200 });
  const e0 = s.cargo.energy;
  for (let i = 0; i < 120; i++) K.step(w, {}, 1 / 60);
  assert(s.cargo.energy < e0 - 0.1, 'an NPC now spends real ATP moving toward a target, same as the player'); }

// Algae's photosynthesis O2 vent throttles as ambient O2 approaches saturation (venting into
// already-saturated water fights the gradient, same "against the gradient costs more" principle).
{ const shallow = K.createWorld({ seed: 1312 }); shallow.entities = shallow.entities.filter(e => e.kind === 'player');
  const deep = K.createWorld({ seed: 1313 }); deep.entities = deep.entities.filter(e => e.kind === 'player');
  const aShallow = K.__test.spawnAlgae(shallow, { x: 500, y: K.WORLD.canopy + 50, mature: true });
  const aDeep = K.__test.spawnAlgae(deep, { x: 500, y: K.WORLD.h - 400, mature: true });
  for (let i = 0; i < 60; i++) { aShallow.y = K.WORLD.canopy + 50; aShallow.vy = 0; K.step(shallow, {}, 1 / 60); }
  for (let i = 0; i < 60; i++) { aDeep.y = K.WORLD.h - 400; aDeep.vy = 0; K.step(deep, {}, 1 / 60); }
  assert(aShallow.oxygen > 0, 'shallow (saturated-water) algae still nets some O2 buildup — venting is throttled, not blocked'); }

// O2 field anchors: near-saturated at the canopy, ~85% by the nursery (relief across most of the early
// game), a real cliff resolved by depth 4600, at-floor well before depth 6000.
{ const canopy = K.WORLD.canopy;
  assert(K.oxygenAt(canopy + 0) > 0.90, 'O2 reads as ~saturated at the canopy');
  assert(Math.abs(K.oxygenAt(canopy + 1200) - 0.85) < 0.02, 'O2 sits at the 85% relief anchor by depth 1200');
  assert(K.oxygenAt(canopy + 2500) < K.oxygenAt(canopy + 1200), 'O2 keeps declining well before the cliff — a long gradient, not a plateau');
  assert(Math.abs(K.oxygenAt(canopy + 4600) - 0.05) < 0.02, 'O2 sits at the 5% cliff-resolved anchor by depth 4600');
  assert(K.oxygenAt(canopy + 6000) < 0.05, 'O2 is effectively at floor well past the cliff, not still lingering at depth 6000'); }

// Junk DNA sequences into your scarcest exotic (spores/enzymes/crystals), not bulk biomass.
{ const w = K.createWorld({ seed: 1401 });
  const p = K.getPlayer(w);
  p.organelles.dna_memory_vesicle = 3; p.organelles.exotic_vacuole = 3; p._capsEpoch = -1;
  p.cargo.dna = 3;                 // three strands, all junk (no carriedStrains)
  p.cargo.spores = 0; p.cargo.enzymes = 5; p.cargo.crystals = 5; // spores is scarcest
  const bioBefore = p.cargo.biomass || 0;
  const res = K.buyOffering(w, 'sequence_dna');
  assert(res.ok && res.rendered === 3, 'three junk strands are rendered');
  assert((p.cargo.spores || 0) >= 1, 'junk restocks the scarcest exotic (spores) first');
  assert(Math.abs((p.cargo.biomass || 0) - bioBefore) < 1e-6, 'junk no longer dumps into biomass when exotic room exists');
  assert(w.events.some(e => e.type === 'sequence' && e.gained), 'sequence event reports the exotics gained');
}

// Selective Intake Membrane: pulls ATP hard, filters toxins, skews toward the emptier of bio/lipids.
{ const w = K.createWorld({ seed: 1402 });
  const p = K.getPlayer(w);
  p.organelles.selective_membrane = 1; p._capsEpoch = -1;
  p.cargo.toxins = 0; p.cargo.energy = 0; p.cargo.biomass = 0;
  // Drop a dirty field right on the player and feed for a second.
  const before = { tox: p.cargo.toxins || 0, en: p.cargo.energy || 0 };
  w.fields.length = 0;
  w.fields.push({ id: 'f1', x: p.x, y: p.y, radius: 60, stock: { biomass: 40, lipids: 20, toxins: 40, energy: 20 }, density: 1.4, sourceKind: 'test', age: 0, maxAge: 999 });
  for (let i = 0; i < 60; i++) K.__test.feedFromFields(w, p, 1 / 60);
  const tookTox = (p.cargo.toxins || 0) - before.tox;
  const tookEn = (p.cargo.energy || 0) - before.en;
  assert(tookEn > tookTox, 'selective intake membrane pulls far more ATP than toxin (filters the poison)');
}

// Vampire burn: a photophobic deep body cooks in bright light; a surface body does not.
{ const w = K.createWorld({ seed: 1403 });
  const deep = K.__test.spawnProtozoan(w, { y: K.WORLD.canopy + 40, x: 300 }); // force it into the light
  deep.photophobic = true; deep.grace = 0;
  const hp0 = deep.hp;
  K.step(w, {}, 1 / 60);
  assert(deep.hp < hp0, 'a photophobic body loses HP in bright shallow light');
  const algae = K.__test.spawnAlgae(w, { y: K.WORLD.canopy + 40, x: 500 });
  assert(!algae.photophobic, 'a surface dweller (algae) is never photophobic — light is its element');
}

// Membrane adds O2 VOLUME (a bigger body holds more O2 — the desc's "more oxygen volume"), so the cap
// AND the absolute tolerance (a fixed % of the cap) rise with layers — but the safe FRACTION is unchanged.
{ const w = K.createWorld({ seed: 7001 }); const p = K.getPlayer(w);
  const cap1 = K.__test.caps(p).oxygen, hp1 = K.__test.caps(p).hp, frac1 = K.__test.oxygenTolerance(p) / cap1;
  p.organelles.membrane = 5; p._capsEpoch = -1;
  assert(K.__test.caps(p).oxygen > cap1, 'stacking membrane raises O2 capacity (more oxygen volume)');
  assert(Math.abs(K.__test.oxygenTolerance(p) / K.__test.caps(p).oxygen - frac1) < 1e-9, 'the safe O2 FRACTION is unchanged (tolerance is a % of the tank)');
  assert(K.__test.caps(p).hp > hp1, 'stacking membrane still raises HP'); }

// Chemotaxis Cilia: yanks only on the rising edge of feeding, spending one spore per pull.
{ const w = K.createWorld({ seed: 7002 }); const p = K.getPlayer(w);
  p.organelles.chemotaxis_cilia = 1; p.organelles.exotic_vacuole = 2; p._capsEpoch = -1; p.cargo.spores = 3;
  w.fields.length = 0; w.fields.push({ id: 'f', x: p.x + 200, y: p.y, radius: 30, stock: { biomass: 20 }, density: 1, age: 0, maxAge: 999 });
  const fx0 = w.fields[0].x;
  K.__test.updateStrainSystems(w, 1 / 60); // not feeding
  assert(Math.abs(w.fields[0].x - fx0) < 1e-6 && p.cargo.spores === 3, 'idle chemotaxis does nothing — no feed, no spend');
  p.feedIntent = true;
  K.__test.updateStrainSystems(w, 1 / 60); // feed rising edge
  assert(w.fields[0].x !== fx0 && p.cargo.spores === 2, 'starting to feed yanks the field and spends one spore');
  K.__test.updateStrainSystems(w, 1 / 60); // still holding — no new edge
  assert(p.cargo.spores === 2, 'holding feed does not re-yank every frame (edge + cooldown gated)'); }

// Phagosome engulf: guaranteed genome capture + recoil for half the victim's remaining HP.
{ const w = K.createWorld({ seed: 7003 }); const p = K.getPlayer(w);
  w.entities = w.entities.filter(e => e.kind === 'player'); // isolate: only the player + the prey we spawn
  p.organelles.phagosome = 1; p._capsEpoch = -1; p.cargo.enzymes = 2; p.cargo.energy = 20; p.hp = 200; p.r = 30;
  const prey = K.__test.spawnScavenger(w, { x: p.x, y: p.y });
  prey.x = p.x; prey.y = p.y; prey.strain = 'cytostome'; prey.strainPotency = 1.3; prey.r = 10; prey.hp = 80;
  const hp0 = p.hp;
  const ok = K.__test.engulfPulse(w, p);
  assert(ok, 'engulf fires on an overlapping SMALLER mutant');
  assert(!prey.alive, 'engulf INSTAKILLS a smaller body whole (that was the fun)');
  assert(p.carriedStrains.get('cytostome') === 1.3, 'engulf GUARANTEES the genome capture');
  assert(Math.abs((hp0 - p.hp) - 80 * 0.5) < 1e-6, 'engulf recoils for half the victim\'s remaining HP');
  // Engulf refuses a body your own size or larger.
  const big = K.__test.spawnScavenger(w, { x: p.x, y: p.y }); big.x = p.x; big.y = p.y; big.r = p.r + 5; p.cargo.enzymes = 2; p.cooldowns.engulf = 0;
  assert(!K.__test.engulfPulse(w, p), 'engulf will not swallow a body as big as or bigger than you'); }

// Layered membrane: a whole layer's worth of damage sheds the outer layer (drops lipids), underhost lives.
{ const w = K.createWorld({ seed: 7005 }); const p = K.getPlayer(w);
  p.organelles.membrane = 3; p._capsEpoch = -1; p.hp = K.__test.caps(p).hp;
  p.biomassMass = 40; // above the shed function's structural floor (16) — a fresh spawn's default (r*0.7) sits just under it and would falsely skip this test
  K.__test.hurt(w, p, 120); // eat through the outer layer (> one layer's HP)
  assert(p.organelles.membrane === 2, 'a full layer of damage sheds exactly one membrane layer');
  assert(p.alive && p.hp > 0, 'the underhost survives the peel');
  assert(w.fields.some(f => f.sourceKind === 'shed_membrane'), 'shedding a layer spills a resource field (mostly lipids)'); }

// Yuki scrubs toxins and eases oxygen to a safe level for free while you rest — no purchase, no detox
// offering (she's a rest point, not a trader; see yukiRestore).
{ const w = K.createWorld({ seed: 7004 }); const p = K.getPlayer(w);
  p.organelles.toxin_vacuole = 4; p.organelles.oxygen_store = 2; p._capsEpoch = -1;
  p.cargo.energy = 10; p.cargo.toxins = 30; p.oxygen = 0.9;
  assert(!K.getYukiOfferings(w).some(o => o.id === 'detox'), 'detox is no longer a purchasable offering');
  for (let i = 0; i < 300; i++) K.yukiRestore(w, 1 / 60, p.id);
  assert(p.cargo.toxins < 30, 'resting at Yuki scrubs toxins for free');
  assert(p.oxygen < 0.9, 'resting at Yuki eases oxygen toward a safe level'); }

// The algae opener's core organs plus Ballast Stone (a cheap, category-exempt basic descent tool)
// stay exotic-free. The rest of the oxygen/buoyancy path (gas mechanics, tolerance, capacity) got a
// cost pass — it now carries a signature exotic like every other functional category.
{ const w = K.createWorld({ seed: 7103 });
  for (const id of ['photosystem', 'oxygen_vacuole', 'jettison_vesicle', 'ballast_stone']) {
    const o = K.getYukiOfferings(w).find(x => x.id === id);
    assert(o && !['spores', 'enzymes', 'crystals', 'dna'].some(k => k in (o.cost || {})), `${id} costs no exotics (algae opener stays exotic-free)`);
  }
  for (const id of ['oxygen_store', 'oxygen_tolerance', 'gas_gland', 'pressure_bladder', 'ballast_siphon', 'aerocyst']) {
    const o = K.getYukiOfferings(w).find(x => x.id === id);
    assert(o && ['spores', 'enzymes', 'crystals'].some(k => k in (o.cost || {})), `${id} now carries an exotic (oxygen/buoyancy cost pass)`);
  } }

// Oxidase Vesicle: burns internal O2 + biomass into ATP (pre-mitochondrial respiration).
{ const w = K.createWorld({ seed: 7101 }); const p = K.getPlayer(w);
  p.organelles.anaerobic_processor = 0; p.organelles.photosystem = 0; p.organelles.oxidase_vesicle = 1; p.organelles.storage_vacuole = 4; p.organelles.oxygen_store = 3; p._capsEpoch = -1;
  p.oxygen = 1.0; p.cargo.biomass = 20; p.cargo.energy = 0;
  K.step(w, {}, 0.1);
  assert(p.cargo.energy > 0 && p.cargo.biomass < 20, 'oxidase vesicle turns O2 + biomass into ATP'); }

// Mineralizing Gland: biomass + toxins → crystals (waste and bulk become exotic ammo).
{ const w = K.createWorld({ seed: 7102 }); const p = K.getPlayer(w);
  p.organelles.anaerobic_processor = 0; p.organelles.mineralizing_gland = 1; p.organelles.exotic_vacuole = 2; p.organelles.storage_vacuole = 4; p._capsEpoch = -1;
  p.cargo.toxins = 20; p.cargo.biomass = 30; p.cargo.crystals = 0;
  K.step(w, {}, 0.2);
  assert(p.cargo.crystals > 0 && p.cargo.toxins < 20, 'mineralizing gland precipitates crystals from toxins + biomass'); }

// Membrane (an HP bar) costs geometrically more per layer already grown.
{ const w = K.createWorld({ seed: 7201 }); const p = K.getPlayer(w);
  const c1 = K.getYukiOfferings(w).find(o => o.id === 'membrane').cost;
  p.organelles.membrane = 4; p._capsEpoch = -1;
  const c4 = K.getYukiOfferings(w).find(o => o.id === 'membrane').cost;
  assert((c4.lipids || 0) > (c1.lipids || 0) * 2, 'the 4th membrane layer costs geometrically more than the 1st'); }

// Scavengers are the reliable enzyme farm — killing them frequently drops enzymes.
{ const w = K.createWorld({ seed: 7301 });
  const p = K.getPlayer(w); p.x = 4000; p.y = 250; // park the player far from the kill site
  let drops = 0;
  for (let i = 0; i < 60; i++) {
    w.entities = w.entities.filter(e => e.kind === 'player'); // isolate each kill (no accumulating collectors)
    w.particles = w.particles.filter(pt => pt.kind !== 'enzymes');
    const s = K.__test.spawnScavenger(w, { x: 500, y: K.WORLD.canopy + 300 });
    s.hp = 0; K.step(w, {}, 1 / 60);
    if (w.particles.some(pt => pt.kind === 'enzymes')) drops++;
  }
  assert(drops > 60 * 0.35, `scavengers drop enzymes often (${drops}/60 kills)`); }

// Corrosive Pellicle burns harder the more toxins you hold.
{ const w = K.createWorld({ seed: 7302 });
  const a = K.__test.spawnScavenger(w, { x: 400, y: 1000 }); a.organelles.corrosive_pellicle = 1; a.organelles.storage_vacuole = 4; a._capsEpoch = -1; a.friendly = false;
  const b = K.__test.spawnScavenger(w, { x: 400, y: 1000 }); b.friendly = true; b.strain = null; // opposite side so the acid applies
  const tox = K.__test.caps(a).toxins;
  a.cargo.toxins = 0; const hpB0 = b.hp; K.__test.overlapAura(w, a, b, 1); const empty = hpB0 - b.hp;
  b.hp = hpB0; a.cargo.toxins = tox; const hpB1 = b.hp; K.__test.overlapAura(w, a, b, 1); const full = hpB1 - b.hp;
  assert(full > empty * 2.5, `corrosive pellicle scales with stored toxins (empty ${empty.toFixed(1)} vs full ${full.toFixed(1)})`); }

// O2/ballast SPLIT: fermentation makes ballast gas; buoyancy comes from gas, not O2.
{ const w = K.createWorld({ seed: 7401 }); const p = K.getPlayer(w);
  p.organelles.oxygen_vacuole = 3; p.organelles.anaerobic_processor = 2; p.organelles.storage_vacuole = 4; p._capsEpoch = -1;
  p.cargo.biomass = 60; p.cargo.energy = 0; p.ballastGas = 0;
  const buoy0 = K.__test.buoyancy(p);
  K.step(w, {}, 0.3); // ferment biomass → ATP + gas
  assert(p.ballastGas > 0, 'fermentation inflates the ballast with gas');
  assert(K.__test.buoyancy(p) > buoy0, 'buoyancy rises as ballast gas accumulates'); }

// Buoyancy is gas-only: a bladder-less body has just BASE_BUOYANCY, and O2 gives NO lift.
{ const w = K.createWorld({ seed: 7402 }); const p = K.getPlayer(w);
  p.organelles.oxygen_vacuole = 0; p.oxygen = 1.0; p.ballastGas = 0; p._capsEpoch = -1;
  assert(Math.abs(K.__test.buoyancy(p) - 2.0) < 1e-6, 'no bladder → buoyancy is just BASE_BUOYANCY (2.0); O2 is not a balloon'); }

// Jettison Vesicle: a VALVE, not a thruster — eject biomass → lose cargo + structural mass, spill a
// field, cheap ATP. No synthetic vy kick; the weight loss makes real buoyancy() lift you next frame.
{ const w = K.createWorld({ seed: 7403 }); const p = K.getPlayer(w);
  p.organelles.jettison_vesicle = 1; p.organelles.storage_vacuole = 6; p._capsEpoch = -1;
  p.cargo.biomass = 80; p.cargo.energy = 20; p.biomassMass = 60; p.vy = 0;
  const bm0 = p.cargo.biomass, mass0 = p.biomassMass, e0 = p.cargo.energy;
  const weight0 = K.__test.biomassWeight(p);
  assert(K.__test.ventBiomass(w, p), 'jettison fires with biomass + energy');
  assert(p.cargo.biomass < bm0 && p.biomassMass < mass0, 'jettison sheds cargo AND structural mass');
  assert(e0 - p.cargo.energy < 0.5, 'jettison is a cheap valve, not a paid thrust');
  assert(K.__test.biomassWeight(p) < weight0, 'shedding mass genuinely lightens the body — real buoyancy follows, no synthetic kick');
  assert(w.fields.some(f => f.sourceKind === 'jettison'), 'jettison spills a feed-field'); }

// Waste Compactor (button-activated, replaces the old passive tick): drains toxinFrac of current toxins
// plus a fixed biomass+ATP cost, into uncapped ballast. Weight-neutral on the biomass side.
{ const w = K.createWorld({ seed: 7405 }); const p = K.getPlayer(w);
  p.organelles.waste_compactor = 1; p._capsEpoch = -1;
  p.cargo.toxins = 20; p.cargo.biomass = 100; p.cargo.energy = 50; p.cargo.ballast = 0;
  const st = K.ORGANELLES.waste_compactor.stats;
  assert(K.__test.compactWaste(w, p), 'compact fires with enough biomass/ATP');
  assert(Math.abs(p.cargo.toxins - 20 * (1 - st.toxinFrac)) < 1e-6, 'drains exactly toxinFrac of current toxins — geometric, not fixed');
  assert(Math.abs(p.cargo.biomass - (100 - st.biomassCost)) < 1e-6, 'costs a fixed slug of biomass regardless of toxin level');
  assert(Math.abs(p.cargo.energy - (50 - st.energyCost)) < 1e-6, 'costs a fixed slug of ATP');
  assert(p.cargo.ballast > 0, 'produces ballast');
  assert(!K.__test.compactWaste(w, p), 'cooldown blocks an immediate re-fire — spammable, not free every frame');
  assert(K.__test.caps(p).ballast === Infinity, 'ballast capacity is uncapped by design — the closest thing a body has to an age');
  for (let i = 0; i < 200; i++) { p.cooldowns.compact = 0; p.cargo.biomass = 200; p.cargo.energy = 200; K.__test.compactWaste(w, p); }
  assert(p.cargo.ballast > 500, 'ballast climbs with no ceiling across many presses'); }

// Weight formula: the biomass half of every brick is weight-neutral (matches biomassWeight's own
// cargoFactor exactly) — this is the actual fix for the old >5x amplifier bug.
{ const w = K.createWorld({ seed: 7406 }); const p = K.getPlayer(w);
  p.organelles.waste_compactor = 1; p._capsEpoch = -1;
  p.cargo.ballast = 0; const w0 = K.__test.biomassWeight(p);
  p.cargo.ballast = 100; const w1 = K.__test.biomassWeight(p);
  assert(Math.abs((w1 - w0) - 100 * 0.11) < 1e-6, '100 ballast adds exactly 100*cargoFactor weight — no amplification'); }

// Jettison prefers dropping carried ballast bricks first — the "drop weight" action, an instant sink
// with no lingering feed-field (processed waste, not food) — and only falls back to biomass when empty.
{ const w = K.createWorld({ seed: 7406 }); const p = K.getPlayer(w);
  p.organelles.jettison_vesicle = 1; p.organelles.storage_vacuole = 6; p._capsEpoch = -1;
  p.cargo.ballast = 8; p.cargo.biomass = 40; p.cargo.energy = 50;
  const bm0 = p.cargo.biomass;
  assert(K.__test.ventBiomass(w, p), 'jettison fires with ballast carried');
  assert(p.cargo.ballast === 0, 'jettison drops the FULL carried ballast in one go — a decisive drop-weight release');
  assert(p.cargo.biomass === bm0, 'ballast-first: biomass cargo is untouched while bricks are still carried');
  assert(w.fields.some(f => f.sourceKind === 'ballast_drop'), 'jettisoned ballast spawns its own dense field');
  w.fields = w.fields.filter(f => f.sourceKind === 'ballast_drop'); // isolate from ambient food fields, which would merge with and skew the comparison field
  const ballastField = w.fields.find(f => f.sourceKind === 'ballast_drop');
  const biomassField = K.__test.spawnResourceField(w, p.x, p.y, { biomass: 8 }, { sourceKind: 'jettison' });
  const by0 = ballastField.y, bmy0 = biomassField.y;
  for (let i = 0; i < 30; i++) K.stepEcology(w, 1 / 60);
  assert((ballastField.y - by0) > (biomassField.y - bmy0) * 3, 'a dropped brick sinks much harder/faster than an equivalent loose-meat field'); }

// Jettison falls back to the original biomass valve once no ballast bricks are carried.
{ const w = K.createWorld({ seed: 7407 }); const p = K.getPlayer(w);
  p.organelles.jettison_vesicle = 1; p.organelles.storage_vacuole = 6; p._capsEpoch = -1;
  p.cargo.ballast = 0; p.cargo.biomass = 40; p.cargo.energy = 50;
  const bm0 = p.cargo.biomass;
  assert(K.__test.ventBiomass(w, p), 'jettison still fires with zero bricks carried');
  assert(p.cargo.biomass < bm0, 'biomass-only fallback still sheds cargo, same as the original valve');
  assert(w.fields.some(f => f.sourceKind === 'jettison'), 'fallback still spills the ordinary feed-field'); }

// O2 overload is percentage-based: a bigger O2 tank raises the absolute safe threshold.
{ const w = K.createWorld({ seed: 7404 }); const p = K.getPlayer(w);
  p.organelles.oxygen_store = 0; p._capsEpoch = -1; const tol0 = K.__test.oxygenTolerance(p);
  p.organelles.oxygen_store = 4; p._capsEpoch = -1; const tol1 = K.__test.oxygenTolerance(p);
  assert(tol1 > tol0, 'a bigger O2 tank gives proportionally more safe headroom (%-based tolerance)'); }

// Lances strike the largest enemy they can ACTUALLY hit — never whiff on an unaligned largest
// while a smaller aligned one is skewered (regression for the "lots of lances, no damage" bug).
{ const w = K.createWorld({ seed: 5 }); w.entities = w.entities.filter(e => e.kind === 'player');
  const p = K.getPlayer(w); p.x = 1000; p.y = 1000; p.r = 24; p.phase = 0; p.cargo.energy = 50; // facing +x (right)
  p.organelles.saw_lance = 2; p.organelles.velocity_lance = 1; p._capsEpoch = -1;
  const small = K.__test.spawnScavenger(w, { x: 1032, y: 1000 }); small.x = 1032; small.y = 1000; small.r = 12; small.hp = 300; small.friendly = false; small.strain = null;
  const big = K.__test.spawnPredator(w, { x: 968, y: 1000 }); big.x = 968; big.y = 1000; big.r = 50; big.hp = 600; big.friendly = false; big.strain = null;
  const s0 = small.hp, b0 = big.hp;
  for (let i = 0; i < 20; i++) K.__test.resolveContacts(w, 1 / 60);
  assert(s0 - small.hp > 0, 'lances hit the SMALL aligned enemy in front (not whiffing on the larger one behind)');
  assert(Math.abs(b0 - big.hp) < 1e-6, 'the larger UNALIGNED enemy behind takes no lance damage'); }

// ── New ballast / respiration organs ────────────────────────────────────────
// Gas Gland: ferments lift-gas faster.
{ const A = () => { const w = K.createWorld({ seed: 8801 }); const p = K.getPlayer(w); p.organelles.oxygen_vacuole = 1; p.organelles.anaerobic_processor = 1; p.organelles.storage_vacuole = 4; p._capsEpoch = -1; p.cargo.biomass = 60; p.ballastGas = 0; return { w, p }; };
  const a = A(); K.step(a.w, {}, 0.1); const base = a.p.ballastGas;
  const b = A(); b.p.organelles.gas_gland = 3; b.p._capsEpoch = -1; K.step(b.w, {}, 0.1); const boosted = b.p.ballastGas;
  assert(boosted > base * 1.5, 'gas gland ferments lift-gas markedly faster'); }

// Pressure Bladder: more ballast-gas capacity.
{ const w = K.createWorld({ seed: 8802 }); const p = K.getPlayer(w);
  p.organelles.oxygen_vacuole = 1; p._capsEpoch = -1; const cap0 = K.__test.caps(p).ballastGas;
  p.organelles.pressure_bladder = 3; p._capsEpoch = -1;
  assert(K.__test.caps(p).ballastGas > cap0 + 0.5, 'pressure bladder raises ballast-gas capacity'); }

// Ballast Siphon: vents gas faster while flooded.
{ const S = () => { const w = K.createWorld({ seed: 8803 }); const p = K.getPlayer(w); p.organelles.oxygen_vacuole = 3; p._capsEpoch = -1; p.ballastGas = 1.0; p.ballast = true; return { w, p }; };
  const a = S(); K.step(a.w, { moveY: 1 }, 1 / 60); const drop0 = 1.0 - a.p.ballastGas;
  const b = S(); b.p.organelles.ballast_siphon = 3; b.p._capsEpoch = -1; K.step(b.w, { moveY: 1 }, 1 / 60); const drop1 = 1.0 - b.p.ballastGas;
  assert(drop1 > drop0 * 1.5, 'ballast siphon dumps gas faster while flooded'); }

// Aerocyst: flat, always-on buoyancy floor.
{ const w = K.createWorld({ seed: 8804 }); const p = K.getPlayer(w);
  p.organelles.oxygen_vacuole = 1; p.ballastGas = 0.1; p._capsEpoch = -1; const b0 = K.__test.buoyancy(p);
  p.organelles.aerocyst = 2; p._capsEpoch = -1;
  assert(K.__test.buoyancy(p) > b0 + 10, 'aerocyst adds a flat lift floor (rigid gas float)'); }

// Catalase Vesicle: raises the safe O2 fraction.
{ const w = K.createWorld({ seed: 8805 }); const p = K.getPlayer(w);
  p.organelles.oxygen_store = 2; p._capsEpoch = -1; const t0 = K.__test.oxygenTolerance(p);
  p.organelles.catalase_vesicle = 2; p._capsEpoch = -1;
  assert(K.__test.oxygenTolerance(p) > t0, 'catalase vesicle raises the safe O2 threshold'); }

// Countercurrent Gill: pulls O2 faster than bare diffusion.
{ const G = () => { const w = K.createWorld({ seed: 8806 }); const p = K.getPlayer(w); p.organelles.oxygen_store = 3; p._capsEpoch = -1; p.oxygen = 0; return { w, p }; };
  const a = G(); K.step(a.w, {}, 0.1); const o0 = a.p.oxygen;
  const b = G(); b.p.organelles.countercurrent_gill = 3; b.p._capsEpoch = -1; K.step(b.w, {}, 0.1); const o1 = b.p.oxygen;
  assert(o1 > o0 * 1.3, 'countercurrent gill pulls O2 faster than diffusion'); }

// Hydrogenosome: ferments biomass → ATP + a gush of lift-gas (no light).
{ const w = K.createWorld({ seed: 8807 }); const p = K.getPlayer(w);
  p.organelles.anaerobic_processor = 0; p.organelles.hydrogenosome = 2; p.organelles.oxygen_vacuole = 2; p.organelles.storage_vacuole = 4; p._capsEpoch = -1;
  p.cargo.biomass = 40; p.cargo.energy = 0; p.ballastGas = 0;
  K.step(w, {}, 0.2);
  assert(p.cargo.energy > 0 && p.ballastGas > 0, 'hydrogenosome makes both ATP and lift-gas from biomass'); }

// Photolytic Vacuole: banks extra O2 fuel in the light.
{ const P = () => { const w = K.createWorld({ seed: 8808 }); const p = K.getPlayer(w); p.organelles.photosystem = 1; p.organelles.oxygen_store = 3; p._capsEpoch = -1; p.oxygen = 0.1; p.y = K.WORLD.canopy + 50; return { w, p }; };
  const a = P(); for (let i = 0; i < 6; i++) { a.p.y = K.WORLD.canopy + 50; K.step(a.w, {}, 1 / 30); } const o0 = a.p.oxygen;
  const b = P(); b.p.organelles.photolytic_vacuole = 4; b.p._capsEpoch = -1; for (let i = 0; i < 6; i++) { b.p.y = K.WORLD.canopy + 50; K.step(b.w, {}, 1 / 30); } const o1 = b.p.oxygen;
  assert(o1 > o0, 'photolytic vacuole banks extra O2 fuel from light'); }

// Ballast Stone: adds weight (committed diver's anchor).
{ const w = K.createWorld({ seed: 8809 }); const p = K.getPlayer(w);
  p._capsEpoch = -1; const wt0 = K.__test.biomassWeight(p);
  p.organelles.ballast_stone = 3; p._capsEpoch = -1;
  assert(K.__test.biomassWeight(p) > wt0 + 20, 'ballast stone makes you heavier (3×8)'); }

// Lipid Bladder: stored fat gives buoyancy, scaled by lipid fill.
{ const w = K.createWorld({ seed: 8810 }); const p = K.getPlayer(w);
  p.organelles.storage_vacuole = 4; p.organelles.lipid_bladder = 3; p._capsEpoch = -1;
  p.cargo.lipids = 0; const bEmpty = K.__test.buoyancy(p);
  p.cargo.lipids = K.__test.caps(p).lipids;
  assert(K.__test.buoyancy(p) > bEmpty + 10, 'lipid bladder gives lift scaled by how full the lipid tank is'); }

// Chemosynthetic Vesicle: burns stored toxins (+ biomass) into ATP, scrubbing the poison.
{ const w = K.createWorld({ seed: 8811 }); const p = K.getPlayer(w);
  p.organelles.anaerobic_processor = 0; p.organelles.chemosynthetic_vesicle = 2; p.organelles.storage_vacuole = 4; p._capsEpoch = -1;
  p.cargo.toxins = 20; p.cargo.biomass = 20; p.cargo.energy = 0; const tox0 = p.cargo.toxins;
  K.step(w, {}, 0.2);
  assert(p.cargo.energy > 0 && p.cargo.toxins < tox0, 'chemosynthetic vesicle oxidizes toxins into ATP (and scrubs them)'); }

// Gas Injector: shoves an overlapped hostile UPWARD (toward the deadly light).
{ const w = K.createWorld({ seed: 8812 }); w.entities = w.entities.filter(e => e.kind === 'player');
  const p = K.getPlayer(w); p.x = 1000; p.y = 1500; p.organelles.gas_injector = 2; p._capsEpoch = -1;
  const foe = K.__test.spawnPredator(w, { x: 1000, y: 1500 }); foe.x = 1000; foe.y = 1500; foe.friendly = false; foe.vy = 0;
  const vy0 = foe.vy;
  for (let i = 0; i < 5; i++) { foe.x = 1000; foe.y = 1500; K.__test.overlapAura(w, p, foe, 1 / 60); }
  assert(foe.vy < vy0, 'gas injector shoves an overlapped hostile upward (negative vy = toward surface)'); }

// Barophilic Sheath: membrane hardness rises with depth (near-nothing shallow, armor deep).
{ const w = K.createWorld({ seed: 8813 }); const p = K.getPlayer(w);
  p.organelles.barophilic_sheath = 3; p._capsEpoch = -1;
  p.y = K.WORLD.canopy + 20; const hShallow = K.__test.membraneHardness(p);
  p.y = K.WORLD.h - 40; const hDeep = K.__test.membraneHardness(p);
  assert(hDeep > hShallow + 1, 'barophilic sheath hardens with depth'); }

// Combustion: the Volatile Vacuole blast scales with banked O2 + lipids and burns that fuel.
{ const w = K.createWorld({ seed: 9101 }); const p = K.getPlayer(w);
  p.organelles = { membrane: 3, volatile_vacuole: 1, oxygen_vacuole: 2, storage_vacuole: 6 }; p._capsEpoch = -1;
  const cap = K.__test.caps(p);
  // Dry, airless body: multiplier at the 1.0 floor.
  p.oxygen = 0; p.cargo.lipids = 0;
  const dry = K.__test.combustionMult(p);
  assert(Math.abs(dry.mult - 1) < 1e-6, 'empty tanks → combustion multiplier floor of 1.0');
  // Fully charged: markedly hotter and wider.
  p.oxygen = cap.oxygen; p.cargo.lipids = cap.lipids; p._capsEpoch = -1;
  const full = K.__test.combustionMult(p);
  assert(full.mult > 1.9, 'full O2 + lipids more than double the blast (combustion)');
  assert(full.rmult > 1.2, 'full tanks widen the fireball');
  // Detonating burns the fuel.
  const o2Before = p.oxygen, lipBefore = p.cargo.lipids, hzBefore = w.hazards.length;
  K.__test.detonateVolatile(w, p);
  assert(p.oxygen < o2Before && p.cargo.lipids < lipBefore, 'detonation burns O2 and lipids');
  assert(w.hazards.some(h => h.kind === 'blast'), 'detonation spawns a blast hazard');
}

// Flamethrower: consumes O2 + lipids + toxins, emits fire hazards, and scorches a hostile.
{ const w = K.createWorld({ seed: 9102 }); w.entities = w.entities.filter(e => e.kind === 'player');
  const p = K.getPlayer(w);
  p.organelles = { membrane: 1, combustion_vesicle: 1, storage_vacuole: 6, oxygen_vacuole: 2 }; p._capsEpoch = -1;
  p.x = 500; p.y = 1800; p.phase = 0; p.oxygen = 40; p.cargo.lipids = 40; p.cargo.toxins = 40; p.cargo.energy = 40;
  const o2b = p.oxygen, lipb = p.cargo.lipids, toxb = p.cargo.toxins;
  const fired = K.__test.flamePulse(w, p, 1, 0);
  assert(fired === true, 'flamethrower fires when fuelled');
  assert(p.oxygen < o2b && p.cargo.lipids < lipb && p.cargo.toxins < toxb, 'flame burns O2 + lipids + toxins');
  assert(w.hazards.some(h => h.kind === 'flame'), 'flame emits a burning hazard');
  // A hostile standing in the stream takes fire damage over a few steps.
  const foe = K.__test.spawnScavenger(w, { x: 560, y: 1800, noStrain: true }); foe.hp = 200; foe._capsEpoch = -1;
  const hp0 = foe.hp;
  for (let i = 0; i < 30; i++) { p.cooldowns.flame = 0; K.__test.flamePulse(w, p, 1, 0); K.step(w, {}, 1 / 60); }
  assert(foe.hp < hp0, 'a body caught in the flame stream burns');
  // Out of fuel → no fire.
  p.oxygen = 0; p.cooldowns.flame = 0;
  assert(K.__test.flamePulse(w, p, 1, 0) === false, 'no oxidizer → the flamethrower cannot fire');
}

// Fibonacci category-cost escalation: an organ's price climbs (1,1,2,3,5,8…) with how many organs you
// own in the same functional category. Per Part C (reversed from the earlier "only exotics scale"),
// the WHOLE cost escalates now — lipids climb right alongside the signature exotic (and toxins, for a
// double-cost venom organ) — not just the exotic portion. Capacity racks and companions stay exempt;
// membrane keeps its own φ curve; rack caps are now 13.
{ const w = K.createWorld({ seed: 6001 }); const p = K.getPlayer(w);
  const EXO = ['spores', 'enzymes', 'crystals'];
  const cost = (id) => { const o = K.getYukiOfferings(w).find(x => x.id === id); return o ? o.cost : null; };
  const offer = (id) => K.getYukiOfferings(w).find(x => x.id === id);
  const set = (orgs) => { p.organelles = { ...orgs }; p._capsEpoch = -1; };
  // double-1 Fibonacci start on the Weapons category (toxin_launcher base = 1 crystal)
  set({}); assert(cost('toxin_launcher').crystals === 1, 'weapon exotic base = 1 (own 0 in category)');
  set({ lance_bristle: 1 }); const t1 = cost('toxin_launcher'); assert(t1.crystals === 1, 'double-1: 2nd organ in a category still base');
  set({ lance_bristle: 2 }); assert(cost('toxin_launcher').crystals === 2, '3rd organ in category → ×2');
  set({ lance_bristle: 5 }); const t8 = cost('toxin_launcher');
  assert(t8.crystals === 8, '6th organ in category → ×8 (fib)');
  assert(!('biomass' in t8), 'biomass is off the price list (lipid currency)');
  assert(t8.lipids > t1.lipids, 'the lipid portion escalates too now, not just the signature exotic');
  assert(t8.toxins === t1.toxins * 8, 'venom double-cost: the toxin surcharge escalates in lockstep with the exotic (fib)');
  // exotic-free organ never gains an exotic cost, but still counts toward its category tally
  set({ photosystem: 5 });
  const ps = cost('photosystem'); assert(!EXO.some(k => k in ps), 'exotic-free organ never gains an exotic cost');
  assert(cost('catalase_vesicle').enzymes === 8, 'exotic-free oxygen organs still inflate the oxygen category (×8)');
  // membrane keeps its own whole-cost φ scaling and has no exotic key
  set({ membrane: 1 }); const m1 = cost('membrane');
  set({ membrane: 3 }); const mb = cost('membrane');
  assert(mb.lipids > m1.lipids * 2 && !('biomass' in mb), 'membrane still φ-scales, priced in lipids (armour = a lipid investment)');
  assert(!EXO.some(k => k in mb), 'membrane carries no exotic cost');
  // capacity racks are exempt: flat price, and they do NOT inflate their category
  set({ exotic_vacuole: 5, dna_memory_vesicle: 5 });
  assert(cost('exotic_vacuole').spores === 1, 'exotic rack cost stays flat (exempt)');
  assert(cost('dna_memory_vesicle').crystals === 1, 'DNA rack cost stays flat (exempt)');
  assert(cost('atp_reservoir').crystals === 1, 'capacity racks do not inflate the Structure category');
  // companions (no .organelle) are untouched by escalation
  assert(cost('companion_hunter').spores === 5, 'companion cost is not category-escalated');
  // rack caps are now 13
  set({ dna_memory_vesicle: 12 }); assert(offer('dna_memory_vesicle').maxed === false, 'DNA rack not maxed at 12');
  set({ dna_memory_vesicle: 13 }); assert(offer('dna_memory_vesicle').maxed === true, 'DNA rack maxed at 13');
  set({ exotic_vacuole: 13 }); assert(offer('exotic_vacuole').maxed === true, 'exotic rack maxed at 13');
}

// ---------------------------------------------------------------------------
// Predator policy-graph brains: opportunistic (drive-gated), varied (temperament),
// self-preserving (flee). Free hunters (predator/protozoan/metazoan) only.
// ---------------------------------------------------------------------------
{
  const T = K.__test;
  const clearFroth = w => { w.entities = w.entities.filter(e => e.kind === 'player'); return w; };

  // Uniform hidden class: brain slots exist on every body, and a fresh predator inits its brain.
  {
    const w = K.createWorld({ seed: 5101 });
    const pl = K.getPlayer(w);
    assert(pl.brainState === 'prowl' && pl._targetRef === null, 'brain slots exist on the player too (one hidden class)');
    const pr = T.spawnPredator(w, { y: 1900 });
    assert(pr.brainState === 'prowl' && typeof pr.aggro === 'number' && typeof pr.caution === 'number', 'a fresh predator initializes its brain');
  }

  // Continuous drive-gating (NOT on/off): a well-stocked predator stands down; emptying its
  // stores sharply raises appetite. And a stocked predator won't commit to a far/tough target.
  {
    const w = clearFroth(K.createWorld({ seed: 5102 }));
    const pred = T.spawnPredator(w, { x: 300, y: 1900 });
    const foe = T.spawnPredator(w, { x: 1100, y: 1900, r: 70 }); foe.strain = undefined; // big & far
    pred.hunger = 1; pred.aggro = 0.4; pred.caution = 0.6;
    // Gorged (biomass + LIPIDS + ATP full → fat and fed, ready to divide): stands down.
    pred.cargo.biomass = T.caps(pred).biomass; pred.cargo.lipids = T.caps(pred).lipids; pred.cargo.energy = T.caps(pred).energy;
    const driveFull = T.huntDrive(pred);
    T.bestBodyTarget(pred, w, null); // stashes pred._preyScore
    const barFull = T.BRAIN.ACCEPT_BASE - driveFull * T.BRAIN.ACCEPT_SLOPE;
    assert(pred._preyScore < barFull, 'a well-stocked predator will not commit to a far/tough target (opportunistic, not bloodthirsty)');
    // Empty reserves but ATP to hunt (above the exhausted-rest threshold): appetite spikes.
    pred.cargo.biomass = 0; pred.cargo.lipids = 0; pred.cargo.energy = T.caps(pred).energy * 0.5;
    const driveEmpty = T.huntDrive(pred);
    assert(driveEmpty > driveFull + 0.3, 'emptying a predator\'s reserves sharply raises its hunt drive (continuous appetite)');
  }

  // Opportunistic scoring: prefers the easy wounded small prey over the big healthy one at
  // equal range — the fix for the old "prefer bigger prey, suicide onto giants" formula.
  {
    const w = clearFroth(K.createWorld({ seed: 5103 }));
    const pr = T.spawnPredator(w, { x: 500, y: 1900 });
    pr.hunger = 1; pr.cargo.biomass = 0; pr.cargo.energy = 5; pr.aggro = 0.5; pr.caution = 0.5;
    const easy = T.spawnScavenger(w, { x: 500, y: 1740 }); easy.hp = 4; easy.strain = undefined;
    const tough = T.spawnPredator(w, { x: 500, y: 2060, r: 68 }); tough.strain = undefined;
    assert(T.bestBodyTarget(pr, w, null) === easy, 'opportunistic scoring prefers the easy wounded prey over the big healthy one');
  }

  // Self-preservation: a wounded, outmatched predator flees instead of charging to its death.
  {
    const w = clearFroth(K.createWorld({ seed: 5104 }));
    const small = T.spawnPredator(w, { x: 300, y: 1900, r: 20 });
    small.hunger = 1; small.cargo.energy = 30; small.caution = 0.8; small.hp = T.caps(small).hp * 0.15;
    const giant = T.spawnPredator(w, { x: 340, y: 1900, r: 80 }); giant.strain = undefined;
    let sawFlee = false;
    for (let i = 0; i < 30; i++) { K.step(w, { moveX: 0, moveY: 0 }, 1 / 60); if (small.alive && small.brainState === 'flee') sawFlee = true; }
    assert(sawFlee, 'a wounded, outmatched predator enters flee (self-preservation)');
  }

  // Temperament variety: depth-scaled + per-individual; every roll stays in [0,1].
  {
    const w = K.createWorld({ seed: 5105 });
    const shallow = [], deep = [];
    for (let i = 0; i < 50; i++) { const e = T.spawnPredator(w, { y: K.WORLD.ruptureTop + 40 }); assert(e.aggro >= 0 && e.aggro <= 1 && e.caution >= 0 && e.caution <= 1, 'temperament rolls stay in [0,1]'); shallow.push(e.aggro); }
    for (let i = 0; i < 50; i++) { const e = T.spawnPredator(w, { y: K.WORLD.ruptureBottom - 20 }); deep.push(e.aggro); }
    const mean = a => a.reduce((x, y) => x + y, 0) / a.length;
    assert(mean(deep) > mean(shallow), 'deeper predators roll bolder (higher mean aggro) than shallow ones');
  }

  // Biomass economy preserved: a predator kill still converts the prey into a corpse field.
  {
    const w = clearFroth(K.createWorld({ seed: 5106 }));
    const killer = T.spawnPredator(w, { x: 400, y: 1900 });
    killer.hunger = 1; killer.cargo.biomass = 0; killer.cargo.energy = T.caps(killer).energy;
    const victim = T.spawnScavenger(w, { x: 412, y: 1900 }); victim.hp = 6; victim.strain = undefined;
    let corpse = false;
    for (let i = 0; i < 180 && !corpse; i++) { K.step(w, { moveX: 0, moveY: 0 }, 1 / 60); corpse = w.fields.some(f => String(f.sourceKind || '').includes('corpse')); }
    assert(corpse, 'a predator kill still spawns a corpse resource field (biomass economy preserved)');
  }

  // Determinism: same seed → identical evolution, brains and all.
  {
    const summary = w => w.entities.map(e => `${e.controller}:${e.brainState}:${e.x.toFixed(2)}:${e.y.toFixed(2)}:${e.hp.toFixed(1)}`).join('|');
    const d1 = K.createWorld({ seed: 5107 }), d2 = K.createWorld({ seed: 5107 });
    for (let i = 0; i < 300; i++) { K.step(d1, { moveX: 0.2, moveY: 0.3, feed: true }, 1 / 60); K.step(d2, { moveX: 0.2, moveY: 0.3, feed: true }, 1 / 60); }
    assert(summary(d1) === summary(d2), 'the predator brain is deterministic (same seed → identical evolution)');
  }
}

// ---------------------------------------------------------------------------
// Scavenger flee-on-damage + predator O2 self-preservation + ballast-only algae
// + deficit-driven steady state (the froth holds its shape).
// ---------------------------------------------------------------------------
{
  const T = K.__test;
  const clearFroth = w => { w.entities = w.entities.filter(e => e.kind === 'player'); return w; };

  // Scavenger bolts from whoever struck it.
  {
    const w = clearFroth(K.createWorld({ seed: 6201 }));
    const scav = T.spawnScavenger(w, { x: 400, y: 1200 }); scav.cargo.energy = 30;
    const atk = T.spawnPredator(w, { x: 480, y: 1200 }); // to the RIGHT of the scavenger
    T.hurt(w, scav, 5, atk.id); // combat hit → sets scav.hit + scav.targetId=atk.id
    T.updateScavengerBrain(w, scav, 1 / 60);
    assert(scav.brainState === 'flee', 'a struck scavenger flees');
    assert(scav.vx < 0, 'the fleeing scavenger accelerates away from its attacker');
  }

  // Predator caught in the O2-rich shallows dives instead of suiciding on oxygen.
  {
    const w = clearFroth(K.createWorld({ seed: 6202 }));
    const pred = T.spawnPredator(w, { x: 400, y: 1900 });
    pred.y = K.WORLD.canopy + 60; pred.depthHome = pred.y; pred.cargo.energy = 40; // lifted into the glare
    const pressure = T.hunterThreatPressure(pred, T.caps(pred).hp);
    assert(pressure.dive && pressure.risk > 0.5, 'O2-rich shallow water creates strong continuous dive pressure');
    let dove = false;
    for (let i = 0; i < 20; i++) { T.updateNpcBrain(w, pred, null, 1 / 60); if (pred.brainState === 'flee' && pred.vy > 0) dove = true; }
    assert(dove, 'a predator in the O2 shallows dives back down (no surface suicide)');
  }

  // Algae are ballast-only: no flagella. Large blooms need more gas and therefore turn deeper,
  // but a full bladder must eventually return every viable bloom to the light.
  {
    const w = K.createWorld({ seed: 6203 });
    const young = T.spawnAlgae(w, { mature: false });
    assert(K.orgCount(young, 'flagella') === 0, 'algae carry no flagella (ballast-only vertical motion)');
    young.ballastGas = T.caps(young).ballastGas; young.cargo.biomass = 10; young.biomassMass = 10;
    assert(T.buoyancy(young) > T.biomassWeight(young), 'a lean gas-full bloom is buoyant (rises to the light)');
    const fat = T.spawnAlgae(w, { mature: true, biomass: 160 });
    fat.biomassMass = 160; fat.ballastGas = T.caps(fat).ballastGas * 0.45;
    assert(T.biomassWeight(fat) > T.buoyancy(fat), 'a fat bloom at partial gas still sinks deeper');
    fat.ballastGas = T.caps(fat).ballastGas;
    assert(T.buoyancy(fat) > T.biomassWeight(fat), 'a fully inflated fat bloom can return upward');
  }

  // Emergent population: after a minute of sim, everything stays BOUNDED (no runaway to POP_CAP,
  // no total extinction) — the floors + fission + food limits keep it breathing in a healthy band.
  {
    const w = K.createWorld({ seed: 6204 });
    for (let i = 0; i < 120 * 60; i++) K.step(w, { moveX: 0, moveY: 0 }, 1 / 60);
    const count = c => w.entities.filter(e => e.alive && e.controller === c).length;
    const total = w.entities.filter(e => e.alive && e.kind !== 'player').length;
    assert(total < T.POP_CAP, `population stays under the perf cap, not pinned against it (was ${total}/${T.POP_CAP})`);
    assert(count('algae') <= T.ALGAE_CAP + 2, 'algae stay at/under the fungus mint cap');
    assert(count('scavenger') >= 1, 'scavengers persist (immigration floor holds)');
    assert(count('predator') >= 1 || count('protozoan') >= 1, 'the hunter guild persists (fission + floor, no total extinction)');
  }

  // Binary fission: a gorged hunter cleaves into two lean daughters; ATP is drained.
  {
    const w = clearFroth(K.createWorld({ seed: 6301 }));
    const pred = T.spawnPredator(w, { x: 400, y: 1900 });
    assert(K.hasOrg(pred, 'cleavage_furrow'), 'predators carry the fission organelle');
    const cap = T.caps(pred);
    pred.cargo.lipids = cap.lipids; pred.cargo.biomass = cap.biomass; pred.cargo.energy = cap.energy;
    assert(T.fissionReady(pred), 'a gorged (fat) hunter is ready to divide');
    const n0 = w.entities.length;
    T.doFission(w, pred);
    assert(w.entities.length === n0 + 1, 'fission produces one daughter cell');
    assert(pred.cargo.energy === 0, 'fission drains the parent\'s ATP');
    assert(pred.cargo.lipids <= cap.lipids * 0.2, 'the parent is left at lean reserves');
    const kid = w.entities[w.entities.length - 1];
    assert(kid.controller === 'predator' && K.hasOrg(kid, 'cleavage_furrow'), 'the daughter is a copy of the parent lineage');
  }

  // Fission is the fission GUILD's (only hunters have the furrow — scavengers/algae don't).
  {
    const w = clearFroth(K.createWorld({ seed: 6302 }));
    const scav = T.spawnScavenger(w, { y: 1200 });
    const alga = T.spawnAlgae(w, {});
    assert(!K.hasOrg(scav, 'cleavage_furrow'), 'scavengers do not self-replicate (they migrate)');
    assert(!K.hasOrg(alga, 'cleavage_furrow'), 'algae do not self-replicate (they are minted from the top)');
  }

  // ATP vampire: predators carry a deep ATP reservoir, and a kill STRIPS the victim's charge into
  // the killer while leaving the corpse's biomass/lipids for the scavengers (the niche partition).
  {
    const w = clearFroth(K.createWorld({ seed: 6310 }));
    const pred = T.spawnPredator(w, { x: 300, y: 1900 });
    assert(K.hasOrg(pred, 'atp_reservoir'), 'predators carry an ATP reservoir (the charge sac)');
    const capWith = T.caps(pred).energy;
    const saved = pred.organelles.atp_reservoir; pred.organelles.atp_reservoir = 0; pred._capsEpoch = -1;
    const capWithout = T.caps(pred).energy; pred.organelles.atp_reservoir = saved; pred._capsEpoch = -1;
    assert(capWith > capWithout, 'the ATP reservoir enlarges the ATP capacity');
    const prey = T.spawnScavenger(w, { x: 305, y: 1900, noStrain: true });
    prey.cargo.energy = T.caps(prey).energy; prey.cargo.biomass = 12; prey.cargo.lipids = 6; // charged, meaty victim
    pred.cargo.energy = 0;
    K.__test.hurt(w, prey, T.caps(prey).hp + 100, pred.id);
    assert(!prey.alive, 'the prey is killed');
    assert(prey.cargo.energy === 0, 'the kill strips ALL the victim\'s ATP — none leaks into the corpse field');
    assert(prey.cargo.biomass > 0 && prey.cargo.lipids > 0, 'the corpse keeps its biomass + lipids — the scavengers\' share');
    assert(pred.cargo.energy > 0, 'the predator harvests the kill\'s charge into its reservoir');
  }

  // Fission has TWO paths: a full ATP reservoir (fast) OR a full fat reserve (robust floor). Either
  // alone (with a healthy body and a little biomass) triggers a division.
  {
    const w = clearFroth(K.createWorld({ seed: 6311 }));
    const cap = () => T.caps(a);
    const a = T.spawnPredator(w, { x: 400, y: 1900 });
    a.cargo.biomass = cap().biomass * 0.5;
    a.cargo.energy = cap().energy; a.cargo.lipids = 0;   // ATP path only
    assert(T.fissionReady(a), 'a full ATP reservoir alone earns a division (the fast path)');
    a.cargo.energy = 0; a.cargo.lipids = cap().lipids;   // fat path only
    assert(T.fissionReady(a), 'a full fat reserve alone earns a division (the robust floor)');
    a.cargo.lipids = cap().lipids * 0.3;                 // neither full
    assert(!T.fissionReady(a), 'a half-charged, half-fat hunter is NOT ready — one reserve must be full');
  }

  // The player carries the furrow (pinned to the "predator type") and divides on command into a
  // friendly clone; its DNA may have drifted.
  {
    const w = clearFroth(K.createWorld({ seed: 6303 }));
    const p = K.getPlayer(w);
    assert(!K.hasOrg(p, 'cleavage_furrow'), 'the fission organelle is DNA-locked now, not a birthright');
    p.organelles.cleavage_furrow = 1; p._capsEpoch = -1; // grant it (as if sequenced from a predator) to test the mechanic
    const cap = T.caps(p);
    p.cargo.lipids = cap.lipids; p.cargo.biomass = cap.biomass; p.cargo.energy = cap.energy;
    K.step(w, { divide: true }, 1 / 60);
    const clones = w.entities.filter(e => e.controller === 'companion' && e.ownerId === p.id);
    assert(clones.length === 1, 'the player divides on command into a friendly clone');
    assert(clones[0].friendly && clones[0].kind === 'npc', 'the clone is a friendly ally, not a rival');
  }

  // Scavenger emigration: a scavenger that has run its reserves down leaves the sim (no corpse).
  {
    const w = clearFroth(K.createWorld({ seed: 6304 }));
    const scav = T.spawnScavenger(w, { x: 400, y: 1200 });
    scav.cargo.biomass = 0; scav.cargo.energy = 0.1; scav.cargo.lipids = 0;
    const fields0 = w.fields.length;
    let gone = false;
    for (let i = 0; i < 60 * 6 && !gone; i++) {
      scav.cargo.biomass = 0; scav.cargo.energy = 0.1; // keep it starved
      K.step(w, { moveX: 0, moveY: 0 }, 1 / 60);
      gone = !w.entities.includes(scav);
    }
    assert(gone, 'a starved scavenger emigrates (leaves the froth)');
    assert(w.fields.length <= fields0 + 2, 'emigration leaves no corpse field (it left, it did not die)');
  }
}

console.log('MOBILE_V1_3_3_PREDATOR_FLOW_EUCHARIST_SMOKE_OK');
console.log('ACT_III_DNA_DISCOVERY_SMOKE_OK');
console.log('DEEP_PREDATOR_STRAINS_SMOKE_OK');
console.log('DEEP_COLONY_METAZOAN_SMOKE_OK');
