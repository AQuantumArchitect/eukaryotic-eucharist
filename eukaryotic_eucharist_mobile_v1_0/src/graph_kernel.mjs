// Eukaryotic Eucharist v1.0 graph kernel
// Oxygen ecology branch: the kernel owns environment, bodies, fields, progression, actions, and Yuki offerings.

export const VERSION = 'mobile_v1_0_oxygen_eucharist';

export const WORLD = Object.freeze({
  w: 2400,
  h: 5600,
  canopy: 220,
  surfaceZone: 520,
  nurseryTop: 900,
  nurseryBottom: 1600,
  ruptureTop: 1700,
  ruptureBottom: 2900,
  deepTop: 3000
});

export const RESOURCES = Object.freeze(['biomass', 'lipids', 'toxins', 'energy', 'spores', 'enzymes', 'crystals', 'vacuoles', 'dna']);
export const MATTER_RESOURCES = Object.freeze(['biomass', 'lipids', 'toxins', 'energy']);
export const EXOTIC_RESOURCES = Object.freeze(['spores', 'enzymes', 'crystals', 'vacuoles']);

const COLORS = Object.freeze({
  biomass: '#89ef8e',
  lipids: '#f5d47a',
  toxins: '#bcff6f',
  energy: '#86d2ff',
  spores: '#d6a2ff',
  enzymes: '#7fffe0',
  crystals: '#ff9bd2',
  vacuoles: '#b7d6ff',
  dna: '#ffffff',
  oxygen: '#bfe8ff',
  light: '#fff0a5'
});

export const ORGANELLES = Object.freeze({
  membrane: {
    name: 'Anaerobic Membrane', tier: 1, action: null,
    desc: 'Baseline semi-porous boundary. Oxygen diffuses through it; body-radius feeding is possible.'
  },
  cytostome: {
    name: 'Cytostome Bloom', tier: 2, action: 'feed',
    desc: 'Improves membrane feeding radius and flow. Feeding makes the membrane softer and more vulnerable.',
    stats: { feedRadiusBonus: 22, feedRateBonus: 0.58, vulnerabilityBonus: 0.25 }
  },
  flagella: {
    name: 'Flagella Bundle', tier: 2, action: null,
    desc: 'Improves swimming, lift, and escape from rupture fields.',
    stats: { speedBonus: 0.22, lift: 16 }
  },
  lipid_repair_loom: {
    name: 'Lipid Repair Loom', tier: 2, action: 'repair',
    desc: 'Consumes lipids and energy to stitch the membrane. Starter bacteria do not self-repair.',
    stats: { hpPerSecond: 13, lipidCost: 2.1, energyCost: 1.0 }
  },
  oxygen_tolerance: {
    name: 'Oxygen Tolerance Vesicles', tier: 2, action: null,
    desc: 'Raises the internal oxygen level that can be endured before oxidative damage begins.',
    stats: { toleranceBonus: 0.18, porosityReduction: 0.03 }
  },
  oxygen_vacuole: {
    name: 'Oxygen Vacuole', tier: 2, action: null,
    desc: 'Stores oxygen and increases buoyancy. Later it becomes useful for mitochondrial dives.',
    stats: { oxygenCapBonus: 0.38, buoyancy: 26 }
  },
  photosystem: {
    name: 'Photosystem Patch', tier: 2, action: null,
    desc: 'A lichen-like path: light grows biomass but produces oxygen stress and makes you heavier.',
    stats: { biomassGain: 0.85, oxygenWaste: 0.09 }
  },
  buoyancy_vacuole: {
    name: 'Buoyancy Vacuole', tier: 2, action: null,
    desc: 'Offsets biomass weight and helps remain near the surface light layer.',
    stats: { buoyancy: 38 }
  },
  rasping_lamella: {
    name: 'Rasping Lamella', tier: 2, action: 'rasp',
    desc: 'First true attack organ. Active overlap shred; bodies do not attack, organs attack.',
    stats: { dps: 24, energyCost: 5.8, vulnerabilityBonus: 0.18, rupturePower: 0.45 }
  },
  toxin_sac: {
    name: 'Toxin Sac', tier: 2, action: 'acid',
    desc: 'Stores and channels toxins for a directed acid pulse.',
    stats: { toxinCost: 2.2, energyCost: 3.2, dps: 22 }
  },
  toxin_cloud: {
    name: 'Toxin Cloud Gland', tier: 2, action: 'cloud',
    desc: 'Vents stored toxin into a local field. Requires Toxin Sac.',
    stats: { radius: 82, toxinCost: 8, energyCost: 7 }
  },
  dash_vacuole: {
    name: 'Dash Vacuole', tier: 2, action: 'dash',
    desc: 'Burst movement for escaping predators and oxygen stress.',
    stats: { impulse: 410, energyCost: 10 }
  },
  mitochondrion: {
    name: 'Integrated Mitochondrion', tier: 'gate', action: null,
    desc: 'Not purchased. Achieved through Yuki\'s Eucharist. Turns oxygen and lipids into high energy.',
    stackable: true, max: 4,
    stats: { lipidBurn: 1.15, oxygenBurn: 0.09, energyMaxBonus: 42 }
  },
  eucharist_archive: {
    name: 'Eucharist Archive', tier: 3, action: null,
    desc: 'Preserves deep DNA rupture records for future bodies.'
  },
  companion_cell: {
    name: 'Companion Cell Bud', tier: 3, action: null,
    desc: 'Uses DNA information to add a small allied grazer to your machinery.'
  },
  multicell_chassis: {
    name: 'Multicell Chassis', tier: 3, action: null,
    desc: 'A post-mitochondrial body plan assembled from deep DNA evidence.'
  }
});

export const OFFERINGS = Object.freeze([
  { id: 'repair', section: 'Tier 1 - Matter survival', kind: 'exchange', name: 'Repair Communion', desc: 'Yuki patches your membrane. Self-repair is Tier 2; this is external communion.', cost: { biomass: 11 }, effect: { heal: 42 } },
  { id: 'buy_biomass', section: 'Tier 1 - Matter survival', kind: 'exchange', name: 'Render Lipids into Biomass', desc: 'Convert stored fat into construction slurry.', cost: { lipids: 18, energy: 4 }, gain: { biomass: 14 } },
  { id: 'buy_energy', section: 'Tier 1 - Matter survival', kind: 'exchange', name: 'Ferment ATP', desc: 'Anaerobic energy: biomass/lipids become ATP and a little waste.', cost: { biomass: 7, lipids: 8 }, gain: { energy: 18, toxins: 2 } },
  { id: 'detox', section: 'Tier 1 - Matter survival', kind: 'exchange', name: 'Yuki Detox', desc: 'Pass toxins and a little oxygen stress into the canopy. Not a combat vent.', cost: { energy: 5 }, effect: { detox: 15, oxygenVent: 0.20 } },

  { id: 'cytostome', section: 'Tier 2 - Adaptation organs', kind: 'organelle', name: 'Cytostome Bloom', desc: 'Better field feeding. Bigger mouth; softer body while feeding.', cost: { biomass: 30, lipids: 10, spores: 1 }, organelle: 'cytostome' },
  { id: 'lipid_repair_loom', section: 'Tier 2 - Adaptation organs', kind: 'organelle', name: 'Lipid Repair Loom', desc: 'Active self-repair using lipids. A key pre-mitochondrial lipid sink.', cost: { biomass: 24, lipids: 24, enzymes: 1 }, organelle: 'lipid_repair_loom' },
  { id: 'oxygen_tolerance', section: 'Tier 2 - Adaptation organs', kind: 'organelle', name: 'Oxygen Tolerance Vesicles', desc: 'Survive higher internal oxygen before tick damage begins.', cost: { biomass: 20, spores: 2, enzymes: 1 }, organelle: 'oxygen_tolerance', stackLimit: 3 },
  { id: 'oxygen_vacuole', section: 'Tier 2 - Adaptation organs', kind: 'organelle', name: 'Oxygen Vacuole', desc: 'Stores oxygen and gives buoyancy. Later useful for mitochondrial dives.', cost: { biomass: 18, lipids: 14, vacuoles: 1 }, organelle: 'oxygen_vacuole', stackLimit: 3 },
  { id: 'photosystem', section: 'Tier 2 - Adaptation organs', kind: 'organelle', name: 'Photosystem Patch', desc: 'The algae road: light grows body but creates oxygen stress and weight.', cost: { biomass: 18, spores: 2, crystals: 1 }, organelle: 'photosystem', stackLimit: 3 },
  { id: 'buoyancy_vacuole', section: 'Tier 2 - Adaptation organs', kind: 'organelle', name: 'Buoyancy Vacuole', desc: 'Fight the biomass square-cube trap and remain near the light.', cost: { biomass: 16, lipids: 12, vacuoles: 2 }, organelle: 'buoyancy_vacuole', stackLimit: 4 },
  { id: 'flagella', section: 'Tier 2 - Adaptation organs', kind: 'organelle', name: 'Flagella Bundle', desc: 'Swim, lift, and escape from rupture fields.', cost: { biomass: 20, spores: 2, enzymes: 1 }, organelle: 'flagella', stackLimit: 3 },
  { id: 'rasping_lamella', section: 'Tier 2 - Adaptation organs', kind: 'organelle', name: 'Rasping Lamella', desc: 'Active overlap shred. This is the first player attack mode.', cost: { biomass: 26, crystals: 2, enzymes: 2 }, organelle: 'rasping_lamella' },
  { id: 'toxin_sac', section: 'Tier 2 - Adaptation organs', kind: 'organelle', name: 'Toxin Sac', desc: 'Stores toxins for directed acid.', cost: { biomass: 18, toxins: 12, crystals: 2 }, organelle: 'toxin_sac' },
  { id: 'toxin_cloud', section: 'Tier 2 - Adaptation organs', kind: 'organelle', name: 'Toxin Cloud Gland', desc: 'Local toxic vent. Requires Toxin Sac.', cost: { biomass: 22, toxins: 22, enzymes: 1, crystals: 1 }, requiresOrganelle: 'toxin_sac', organelle: 'toxin_cloud' },
  { id: 'dash_vacuole', section: 'Tier 2 - Adaptation organs', kind: 'organelle', name: 'Dash Vacuole', desc: 'Burst away from bad overlaps.', cost: { biomass: 18, lipids: 18, spores: 2 }, organelle: 'dash_vacuole' },

  { id: 'mitochondrial_eucharist', section: 'Eucharist Gate - Mitochondrial endosymbiosis', kind: 'sacrament', name: 'Mitochondrial Eucharist', desc: 'Yuki gives a living endosymbiont seed. Survive incubation; oxygen becomes power.', cost: { biomass: 30, lipids: 35, spores: 4, enzymes: 2, crystals: 1, vacuoles: 1 }, requiresHostReady: true, effect: { beginEucharist: true } },

  { id: 'eucharist_archive', section: 'Tier 3 - DNA information', kind: 'eucharist', name: 'Eucharist Archive', desc: 'Record deep rupture DNA for future bodies.', cost: { dna: 3, energy: 22 }, requiresMito: true, organelle: 'eucharist_archive' },
  { id: 'mitochondrial_stack', section: 'Tier 3 - DNA information', kind: 'eucharist', name: 'Mitochondrial Stack', desc: 'Grow additional mitochondria after the first sacred integration.', cost: { dna: 2, lipids: 35, oxygen: 0 }, requiresMito: true, effect: { addMito: true } },
  { id: 'companion_cell', section: 'Tier 3 - DNA information', kind: 'colony', name: 'Companion Cell Bud', desc: 'Grow a small allied grazer from archived deep information.', cost: { dna: 6, biomass: 45, energy: 35 }, requiresMito: true, organelle: 'companion_cell' },
  { id: 'multicell_chassis', section: 'Tier 3 - DNA information', kind: 'colony', name: 'Multicell Chassis', desc: 'A larger post-mitochondrial machine. Expensive and unstable.', cost: { dna: 12, biomass: 80, lipids: 60, energy: 60 }, requiresMito: true, organelle: 'multicell_chassis' }
]);

function mulberry32(seed) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function rand(world, min, max) { return min + (max - min) * world.rng(); }
function choice(world, arr) { return arr[Math.floor(world.rng() * arr.length)]; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function wrapX(x) { x %= WORLD.w; if (x < 0) x += WORLD.w; return x; }
function dxWrap(ax, bx) { let dx = bx - ax; if (dx > WORLD.w / 2) dx -= WORLD.w; if (dx < -WORLD.w / 2) dx += WORLD.w; return dx; }
function dist2Wrap(ax, ay, bx, by) { const dx = dxWrap(ax, bx); const dy = by - ay; return dx * dx + dy * dy; }
function distWrap(ax, ay, bx, by) { return Math.sqrt(dist2Wrap(ax, ay, bx, by)); }
function norm(dx, dy) { const d = Math.hypot(dx, dy) || 1; return { x: dx / d, y: dy / d, d }; }
function emptyCargo(values = {}) { const c = {}; for (const r of RESOURCES) c[r] = values[r] || 0; return c; }
function addStock(dst, stock, mult = 1) { for (const k of RESOURCES) if (stock[k]) dst[k] = (dst[k] || 0) + stock[k] * mult; }
function subStock(dst, stock) { for (const k of RESOURCES) if (stock[k]) dst[k] = Math.max(0, (dst[k] || 0) - stock[k]); }
function hasStock(cargo, cost = {}) { for (const [k, v] of Object.entries(cost)) if (k !== 'oxygen' && (cargo[k] || 0) + 1e-9 < v) return false; return true; }
function fmtStock(stock = {}) { return Object.entries(stock).filter(([k, v]) => k !== 'oxygen' && v > 0).map(([k, v]) => `${Math.ceil(v)} ${k}`).join(', '); }
function totalMatter(stock) { return MATTER_RESOURCES.reduce((s, k) => s + Math.max(0, stock[k] || 0), 0); }

let nextId = 1;
function id(prefix) { return `${prefix}_${nextId++}`; }

export function lightAt(y) {
  const d = Math.max(0, y - WORLD.canopy);
  return clamp(Math.exp(-d / 430), 0, 1);
}

export function oxygenAt(y) {
  const d = Math.max(0, y - WORLD.canopy);
  // High at surface, sharply lower in nursery, almost gone by deep layer.
  return clamp(0.08 + 0.90 * Math.exp(-d / 610), 0.035, 1);
}

export function pressureAt(y) {
  return clamp((y - WORLD.canopy) / (WORLD.h - WORLD.canopy), 0, 1);
}

export function createWorld(options = {}) {
  nextId = 1;
  const world = {
    version: VERSION,
    t: 0,
    rng: mulberry32(options.seed || 1001),
    entities: [],
    fields: [],
    particles: [],
    events: [],
    stats: { fieldsMerged: 0, deaths: 0, dnaRead: 0, algaeFalls: 0, ruptures: 0, spawnedCompanions: 0, eucharists: 0 },
    spawn: { algae: 0, npc: 0, exotic: 0, seed: 0 },
    playerId: null
  };
  const player = makeSoftBody(world, 'player', WORLD.w / 2, WORLD.nurseryTop + 220, {
    r: 22, hp: 105, maxHp: 105, color: '#86d2ff', controller: 'human', trophicRole: 'anaerobic_scavenger', depthHome: WORLD.nurseryTop + 230,
    cargo: { biomass: 12, lipids: 8, energy: 24, toxins: 0, spores: 0, enzymes: 0, crystals: 0, vacuoles: 0, dna: 0 },
    organelles: { membrane: 1 }, oxygen: 0.18, oxygenTolerance: 0.32, porosity: 0.18
  });
  world.playerId = player.id;
  world.entities.push(player);
  for (let i = 0; i < 12; i++) spawnScavenger(world);
  for (let i = 0; i < 9; i++) spawnAlgae(world, { mature: i < 2 });
  for (let i = 0; i < 7; i++) spawnPredator(world);
  for (let i = 0; i < 4; i++) spawnProtozoan(world);
  for (let i = 0; i < 10; i++) {
    spawnResourceField(world, rand(world, 0, WORLD.w), WORLD.ruptureTop + rand(world, 80, 780), { biomass: rand(world, 16, 38), lipids: rand(world, 2, 12) }, { radius: rand(world, 32, 70), sourceKind: 'old_slurry', decayRate: 0.07, maxAge: 38 });
  }
  return world;
}

function makeSoftBody(world, kind, x, y, opts = {}) {
  const cargo = emptyCargo(opts.cargo || {});
  const r = opts.r || 18;
  return {
    id: id('body'), kind, x: wrapX(x), y: clamp(y, WORLD.canopy + 5, WORLD.h - 40), vx: opts.vx || 0, vy: opts.vy || 0,
    r, mass: opts.mass || r * 1.2, biomassMass: opts.biomassMass ?? r * 0.7,
    hp: opts.hp || 60, maxHp: opts.maxHp || opts.hp || 60,
    membraneHardness: opts.membraneHardness ?? 0.18,
    ruptureThreshold: opts.ruptureThreshold ?? 0.35,
    softness: opts.softness ?? 0.7, color: opts.color || '#8ceaa0', controller: opts.controller || 'scavenger', trophicRole: opts.trophicRole || opts.controller || 'scavenger',
    depthHome: opts.depthHome || y, depthBand: opts.depthBand || 420, cargo, organelles: { ...(opts.organelles || {}) },
    oxygen: opts.oxygen ?? oxygenAt(y), oxygenTolerance: opts.oxygenTolerance ?? 0.30, porosity: opts.porosity ?? 0.18,
    hunger: rand(world, 0.25, 0.9), targetId: null, feedIntent: false, repairIntent: false, action: null, alive: true, hit: 0,
    phase: rand(world, 0, Math.PI * 2), radiusPulse: rand(world, 0.6, 1.5), friendly: opts.friendly || false,
    fallState: opts.fallState || null, incubating: null, grace: opts.grace ?? 0
  };
}

export function getPlayer(world) { return world.entities.find(e => e.id === world.playerId); }
export function hasOrg(entity, org) { return (entity?.organelles?.[org] || 0) > 0; }
export function orgCount(entity, org) { return entity?.organelles?.[org] || 0; }
export function hasMito(entity) { return orgCount(entity, 'mitochondrion') > 0; }

function caps(entity) {
  const mito = orgCount(entity, 'mitochondrion');
  return {
    hp: entity.maxHp + orgCount(entity, 'multicell_chassis') * 70,
    energy: 70 + mito * ORGANELLES.mitochondrion.stats.energyMaxBonus,
    biomass: 150 + orgCount(entity, 'multicell_chassis') * 80,
    lipids: 135 + mito * 30,
    toxins: 90 + orgCount(entity, 'toxin_sac') * 55,
    spores: 32, enzymes: 24, crystals: 20, vacuoles: 16, dna: 99,
    oxygen: 1.0 + orgCount(entity, 'oxygen_vacuole') * ORGANELLES.oxygen_vacuole.stats.oxygenCapBonus
  };
}

function clampCargo(entity) {
  const c = caps(entity);
  for (const r of RESOURCES) entity.cargo[r] = clamp(entity.cargo[r] || 0, 0, c[r] ?? 999);
  entity.hp = clamp(entity.hp, 0, c.hp);
  entity.oxygen = clamp(entity.oxygen || 0, 0, c.oxygen);
}

function oxygenTolerance(entity) {
  return (entity.oxygenTolerance ?? 0.30) + orgCount(entity, 'oxygen_tolerance') * ORGANELLES.oxygen_tolerance.stats.toleranceBonus + orgCount(entity, 'mitochondrion') * 0.18;
}

function membranePorosity(entity) {
  return clamp((entity.porosity ?? 0.18) - orgCount(entity, 'oxygen_tolerance') * ORGANELLES.oxygen_tolerance.stats.porosityReduction, 0.06, 0.26);
}

function biomassWeight(entity) {
  return Math.max(0, (entity.cargo.biomass || 0) * 0.10 + entity.biomassMass * 0.040 + Math.pow(entity.r, 1.18) * 0.010);
}

function buoyancy(entity) {
  return orgCount(entity, 'buoyancy_vacuole') * ORGANELLES.buoyancy_vacuole.stats.buoyancy + orgCount(entity, 'oxygen_vacuole') * ORGANELLES.oxygen_vacuole.stats.buoyancy + (entity.oxygen || 0) * 11;
}

function speedOf(entity) {
  let sp = entity.kind === 'player' ? 162 : entity.controller === 'predator' ? 104 : entity.controller === 'protozoan' ? 88 : 82;
  sp *= 1 + orgCount(entity, 'flagella') * ORGANELLES.flagella.stats.speedBonus;
  sp *= 1 + Math.min(0.28, (entity.cargo.energy || 0) / 280);
  sp *= clamp(1 - (entity.r - 20) * 0.010, 0.55, 1.1);
  if (entity.feedIntent) sp *= hasOrg(entity, 'cytostome') ? 0.78 : 0.86;
  if (entity.repairIntent) sp *= 0.55;
  if (entity.hp < entity.maxHp * 0.35) sp *= 0.8;
  return sp;
}

function feedRadius(entity) {
  return entity.r + orgCount(entity, 'cytostome') * ORGANELLES.cytostome.stats.feedRadiusBonus;
}

function feedRate(entity) {
  return (entity.kind === 'player' ? 11.5 : 8.4) * (1 + orgCount(entity, 'cytostome') * ORGANELLES.cytostome.stats.feedRateBonus);
}

function vulnerability(entity) {
  let v = 1;
  if (entity.feedIntent) v += 0.18 + orgCount(entity, 'cytostome') * ORGANELLES.cytostome.stats.vulnerabilityBonus;
  if (entity.action === 'rasp') v += ORGANELLES.rasping_lamella.stats.vulnerabilityBonus;
  if (entity.repairIntent) v += 0.10;
  return v;
}

function hostReadiness(entity) {
  if (!entity) return { score: 0, ready: false, reasons: ['missing body'] };
  if (hasMito(entity)) return { score: 1, ready: false, reasons: ['already integrated'] };
  const tol = oxygenTolerance(entity);
  const lipid = clamp((entity.cargo.lipids || 0) / 34, 0, 1);
  const membrane = clamp((orgCount(entity, 'oxygen_tolerance') + orgCount(entity, 'cytostome') + orgCount(entity, 'lipid_repair_loom')) / 3, 0, 1);
  const exotics = clamp(((entity.cargo.spores || 0) / 4 + (entity.cargo.enzymes || 0) / 2 + (entity.cargo.crystals || 0)) / 3, 0, 1);
  const oxygen = clamp((tol - 0.32) / 0.34, 0, 1);
  const depth = clamp((entity.maxDepth || 0) / 1800, 0, 1);
  const score = 0.23 * lipid + 0.27 * membrane + 0.23 * exotics + 0.17 * oxygen + 0.10 * depth;
  const reasons = [];
  if (lipid < 0.8) reasons.push('needs lipid reserve');
  if (membrane < 0.66) reasons.push('needs host organs');
  if (exotics < 0.72) reasons.push('needs exotic traces');
  if (oxygen < 0.45) reasons.push('needs oxygen tolerance');
  return { score, ready: score >= 0.70, reasons };
}

export function step(world, commands = {}, dt = 1 / 60) {
  dt = clamp(dt, 0, 0.05);
  world.t += dt;
  world.events.length = 0;
  const player = getPlayer(world);
  if (!player || !player.alive) return world;

  spawnTick(world, dt);
  applyPlayerCommands(world, player, commands, dt);
  updateNPCs(world, player, dt);
  updateEnvironmentAndMetabolism(world, dt);
  updateFields(world, dt);
  updateParticles(world, dt);
  resolveContacts(world, dt);
  removeDead(world);
  for (const e of world.entities) {
    e.x = wrapX(e.x); e.y = clamp(e.y, WORLD.canopy + 2, WORLD.h - 30);
    e.vx *= Math.pow(0.965, dt * 60); e.vy *= Math.pow(0.965, dt * 60);
    e.hit = Math.max(0, e.hit - dt); e.grace = Math.max(0, (e.grace || 0) - dt);
    e.maxDepth = Math.max(e.maxDepth || 0, e.y - WORLD.canopy);
    clampCargo(e);
  }
  return world;
}

function applyPlayerCommands(world, player, commands, dt) {
  const move = norm(commands.moveX || 0, commands.moveY || 0);
  if (Math.abs(commands.moveX || 0) + Math.abs(commands.moveY || 0) > 0.02) {
    const sp = speedOf(player);
    player.vx += move.x * sp * 3.8 * dt;
    player.vy += move.y * sp * 3.8 * dt;
    player.phase = Math.atan2(move.y, move.x);
  }
  player.feedIntent = !!commands.feed;
  player.repairIntent = !!commands.repair;
  player.action = null;

  if (commands.dash && hasOrg(player, 'dash_vacuole') && player.cargo.energy >= ORGANELLES.dash_vacuole.stats.energyCost) {
    const sp = ORGANELLES.dash_vacuole.stats.impulse;
    player.vx += (move.x || Math.cos(player.phase)) * sp;
    player.vy += (move.y || Math.sin(player.phase)) * sp;
    player.cargo.energy -= ORGANELLES.dash_vacuole.stats.energyCost;
    world.events.push({ type: 'dash', entityId: player.id });
  }
  if (commands.rasp && hasOrg(player, 'rasping_lamella') && player.cargo.energy > 0) player.action = 'rasp';
  if (commands.acid && hasOrg(player, 'toxin_sac')) acidPulse(world, player, commands.aimX, commands.aimY);
  if (commands.cloud && hasOrg(player, 'toxin_cloud')) toxinCloud(world, player);

  player.x = wrapX(player.x + player.vx * dt);
  player.y += player.vy * dt;
  if (player.feedIntent) feedFromFields(world, player, dt);
  if (player.repairIntent) repairFromLipids(world, player, dt);
  collectParticles(world, player);
}

function updateNPCs(world, player, dt) {
  for (const e of world.entities) {
    if (!e.alive || e.kind === 'player') continue;
    e.hunger = clamp(e.hunger + dt * (e.controller === 'algae' ? 0.012 : 0.04), 0, 1);
    e.feedIntent = false;
    e.repairIntent = false;
    e.action = null;

    if (e.controller === 'algae') {
      updateAlgaeAI(world, e, dt);
      continue;
    }

    const targetField = bestFieldFor(e, world);
    const prey = bestBodyTarget(e, world, player);
    let tx = e.x + Math.cos(e.phase) * 100;
    let ty = e.depthHome;

    if (targetField && (e.hunger > 0.20 || e.controller === 'scavenger')) {
      tx = targetField.x; ty = targetField.y;
      if (distWrap(e.x, e.y, targetField.x, targetField.y) < e.r + targetField.radius * 0.9) {
        e.feedIntent = true;
        feedFromFields(world, e, dt);
        if (e.kind !== 'player') collectParticles(world, e, { npc: true });
      }
    }

    if (prey && (e.controller === 'predator' || e.controller === 'protozoan')) {
      tx = prey.x; ty = prey.y;
      if (hasOrg(e, 'rasping_lamella') && distWrap(e.x, e.y, prey.x, prey.y) < e.r + prey.r + 18) e.action = 'rasp';
    }

    const oxygenDanger = oxygenAt(e.y) - oxygenTolerance(e);
    if (oxygenDanger > 0.10 && e.controller === 'scavenger') ty += 260;
    const dyHome = e.depthHome - e.y;
    const toward = norm(dxWrap(e.x, tx), (ty - e.y) + dyHome * 0.38);
    const sp = speedOf(e) * (e.feedIntent ? 0.62 : 1);
    e.vx += toward.x * sp * 2.5 * dt;
    e.vy += toward.y * sp * 2.5 * dt;
    e.phase = Math.atan2(toward.y, toward.x);
    e.x = wrapX(e.x + e.vx * dt);
    e.y += e.vy * dt;
  }
}

function updateAlgaeAI(world, e, dt) {
  // Algae seek light until biomass square-cube pressure overwhelms buoyancy/lift.
  const light = lightAt(e.y);
  const weight = biomassWeight(e);
  const lift = buoyancy(e) + orgCount(e, 'flagella') * ORGANELLES.flagella.stats.lift + (e.cargo.energy || 0) * 0.035;
  const failing = weight > lift + 4 || (e.cargo.energy || 0) < 3;
  if (failing && !e.fallState) {
    e.fallState = 'sinking';
    world.stats.algaeFalls += 1;
    world.events.push({ type: 'algae_fall', entityId: e.id });
  }
  let ty = e.fallState === 'sinking' ? WORLD.ruptureTop + 300 : WORLD.canopy + 140 + rand(world, -15, 15);
  let tx = e.x + Math.cos(e.phase + Math.sin(world.t * 0.4)) * 50;
  const toward = norm(dxWrap(e.x, tx), ty - e.y);
  const sp = speedOf(e) * (e.fallState === 'sinking' ? 0.15 : 0.5);
  e.vx += toward.x * sp * dt;
  e.vy += toward.y * sp * dt;
  // Passive falling if too heavy.
  e.vy += clamp((weight - lift) * 0.20, -8, 32) * dt;
  e.phase = Math.atan2(toward.y, toward.x);
  e.x = wrapX(e.x + e.vx * dt);
  e.y += e.vy * dt;
}

function updateEnvironmentAndMetabolism(world, dt) {
  for (const e of world.entities) {
    if (!e.alive) continue;
    const light = lightAt(e.y);
    const extO2 = oxygenAt(e.y);
    const porosity = membranePorosity(e);
    e.oxygen += (extO2 - e.oxygen) * porosity * dt;

    // Photosynthesis: surface light turns into biomass but creates oxygen stress/waste and weight.
    const photo = orgCount(e, 'photosystem');
    if (photo > 0 && light > 0.04) {
      const gain = light * photo * ORGANELLES.photosystem.stats.biomassGain * dt;
      const room = caps(e).biomass - (e.cargo.biomass || 0);
      const actual = Math.min(room, gain);
      e.cargo.biomass += actual;
      e.biomassMass += actual * 0.18;
      e.oxygen += ORGANELLES.photosystem.stats.oxygenWaste * photo * light * dt;
    }

    const mito = orgCount(e, 'mitochondrion');
    if (mito > 0 && (e.cargo.lipids || 0) > 0.04 && (e.cargo.energy || 0) < caps(e).energy && e.oxygen > 0.025) {
      const lipidBurn = Math.min(e.cargo.lipids, ORGANELLES.mitochondrion.stats.lipidBurn * mito * dt);
      const oxygenBurn = Math.min(e.oxygen, ORGANELLES.mitochondrion.stats.oxygenBurn * mito * dt, lipidBurn * 0.12);
      if (oxygenBurn > 0.001) {
        e.cargo.lipids -= lipidBurn;
        e.oxygen -= oxygenBurn;
        e.cargo.energy += lipidBurn * 3.2 + oxygenBurn * 70;
        e.cargo.toxins = Math.max(0, (e.cargo.toxins || 0) - oxygenBurn * 5);
      }
    } else if ((e.cargo.energy || 0) < caps(e).energy && (e.cargo.biomass || 0) > 1) {
      const ferment = Math.min(e.cargo.biomass, 0.62 * dt);
      e.cargo.biomass -= ferment;
      e.cargo.energy += ferment * 0.92;
      e.cargo.toxins += ferment * 0.16;
    }

    // Oxygen overload is tick damage unless tolerated or burned by mitochondria.
    const tol = oxygenTolerance(e);
    if (e.grace <= 0 && e.oxygen > tol) {
      const excess = e.oxygen - tol;
      e.hp -= excess * (hasMito(e) ? 3.4 : 7.4) * dt;
      e.hit = Math.max(e.hit, 0.05);
    }

    if (e.cargo.toxins > caps(e).toxins * 0.72) e.hp -= (e.cargo.toxins - caps(e).toxins * 0.72) * 0.012 * dt;

    // Vertical ecology: biomass sinks, vacuoles/oxygen/flagella lift. Apply gently to all bodies.
    const sink = biomassWeight(e) - buoyancy(e) - orgCount(e, 'flagella') * ORGANELLES.flagella.stats.lift * 0.15;
    if (e.controller === 'algae' || (e.cargo.biomass || 0) > 70) e.vy += clamp(sink * 0.038, -10, 25) * dt;

    if (e.incubating) updateEucharistIncubation(world, e, dt);

    const upkeep = (e.kind === 'player' ? 0.58 : e.controller === 'algae' ? 0.18 : 0.36) * dt;
    e.cargo.energy = Math.max(0, (e.cargo.energy || 0) - upkeep);
    if (e.hp <= 0) hurt(world, e, 0.01, 'metabolism');
  }
}

function updateEucharistIncubation(world, e, dt) {
  e.incubating.time -= dt;
  e.cargo.energy = Math.max(0, (e.cargo.energy || 0) - 1.3 * dt);
  e.cargo.lipids = Math.max(0, (e.cargo.lipids || 0) - 0.85 * dt);
  e.oxygen += 0.018 * dt;
  if ((e.cargo.energy || 0) <= 0.5 || (e.cargo.lipids || 0) <= 0.5 || e.oxygen > oxygenTolerance(e) + 0.34) {
    e.hp -= 5.0 * dt;
  }
  if (e.incubating.time <= 0) {
    e.incubating = null;
    e.organelles.mitochondrion = 1;
    e.cargo.energy = Math.min(caps(e).energy, e.cargo.energy + 38);
    e.hp = Math.min(caps(e).hp, e.hp + 28);
    world.stats.eucharists += 1;
    world.events.push({ type: 'eucharist_complete', entityId: e.id });
  }
}

function repairFromLipids(world, entity, dt) {
  if (!hasOrg(entity, 'lipid_repair_loom')) return false;
  const o = ORGANELLES.lipid_repair_loom.stats;
  if ((entity.cargo.lipids || 0) <= 0.02 || (entity.cargo.energy || 0) <= 0.02 || entity.hp >= caps(entity).hp) return false;
  const room = caps(entity).hp - entity.hp;
  const repair = Math.min(room, o.hpPerSecond * orgCount(entity, 'lipid_repair_loom') * dt);
  const lipidCost = repair / o.hpPerSecond * o.lipidCost;
  const energyCost = repair / o.hpPerSecond * o.energyCost;
  if (entity.cargo.lipids < lipidCost || entity.cargo.energy < energyCost) return false;
  entity.cargo.lipids -= lipidCost;
  entity.cargo.energy -= energyCost;
  entity.hp += repair;
  world.events.push({ type: 'repair', entityId: entity.id, amount: repair });
  return true;
}

function updateFields(world, dt) {
  for (let i = world.fields.length - 1; i >= 0; i--) {
    const f = world.fields[i];
    f.age += dt;
    const decay = f.decayRate * dt;
    for (const r of MATTER_RESOURCES) f.stock[r] = Math.max(0, (f.stock[r] || 0) - decay * (r === 'toxins' ? 0.35 : 1));
    const total = totalMatter(f.stock);
    f.radius = clamp(Math.sqrt(Math.max(8, total)) * (f.radiusScale || 8.0), 9, f.maxRadius || 180);
    if (total <= 0.35 || f.age > f.maxAge) world.fields.splice(i, 1);
  }
  mergeNearbyFields(world);
}

function updateParticles(world, dt) {
  for (let i = world.particles.length - 1; i >= 0; i--) {
    const p = world.particles[i];
    p.age += dt;
    p.x = wrapX(p.x + p.vx * dt); p.y += p.vy * dt;
    p.vx *= Math.pow(0.96, dt * 60); p.vy *= Math.pow(0.96, dt * 60);
    if (p.age > p.maxAge || p.y < WORLD.canopy - 30 || p.y > WORLD.h + 80) world.particles.splice(i, 1);
  }
}

function resolveContacts(world, dt) {
  const ents = world.entities.filter(e => e.alive);
  for (let i = 0; i < ents.length; i++) {
    for (let j = i + 1; j < ents.length; j++) {
      const a = ents[i], b = ents[j];
      const dx = dxWrap(a.x, b.x), dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 1;
      const overlap = a.r + b.r - d;
      if (overlap <= 0) continue;
      const nx = dx / d, ny = dy / d;
      const push = overlap * 0.5;
      a.x = wrapX(a.x - nx * push * b.softness); a.y -= ny * push * b.softness;
      b.x = wrapX(b.x + nx * push * a.softness); b.y += ny * push * a.softness;
      a.vx -= nx * overlap * 0.35; a.vy -= ny * overlap * 0.35;
      b.vx += nx * overlap * 0.35; b.vy += ny * overlap * 0.35;
      contactDamage(world, a, b, overlap, nx, ny, dt);
      contactDamage(world, b, a, overlap, -nx, -ny, dt);
    }
  }
}

function contactDamage(world, attacker, target, overlap, nx, ny, dt) {
  if (!attacker.alive || !target.alive) return;
  const contactFraction = clamp(overlap / Math.min(attacker.r, target.r), 0, 1.35);
  let dps = 0;
  let rupturePower = 0;
  if (attacker.action === 'rasp' && hasOrg(attacker, 'rasping_lamella') && (attacker.cargo.energy || 0) > 0) {
    dps += ORGANELLES.rasping_lamella.stats.dps * orgCount(attacker, 'rasping_lamella');
    rupturePower += ORGANELLES.rasping_lamella.stats.rupturePower * orgCount(attacker, 'rasping_lamella');
    attacker.cargo.energy = Math.max(0, attacker.cargo.energy - ORGANELLES.rasping_lamella.stats.energyCost * dt);
  }
  if (dps <= 0) return;
  const facing = { x: Math.cos(attacker.phase), y: Math.sin(attacker.phase) };
  const alignment = clamp((facing.x * nx + facing.y * ny + 1.15) / 2.15, 0.25, 1.0);
  const hardness = target.membraneHardness || 0;
  if (rupturePower < hardness && target.r > attacker.r * 1.28) dps *= 0.12;
  const dmg = dps * contactFraction * alignment * vulnerability(target) * dt;
  hurt(world, target, dmg, attacker.id);
  attacker.hunger = Math.max(0, attacker.hunger - dmg * 0.003);
}

function acidPulse(world, entity, aimX = null, aimY = null) {
  const o = ORGANELLES.toxin_sac.stats;
  if ((entity.cargo.toxins || 0) < o.toxinCost || (entity.cargo.energy || 0) < o.energyCost) return false;
  entity.cargo.toxins -= o.toxinCost;
  entity.cargo.energy -= o.energyCost;
  let ax = aimX ?? Math.cos(entity.phase), ay = aimY ?? Math.sin(entity.phase);
  const n = norm(ax, ay); ax = n.x; ay = n.y;
  spawnResourceField(world, entity.x + ax * (entity.r + 16), entity.y + ay * (entity.r + 16), { toxins: 10, energy: 2 }, { radius: 34, density: 1.5, sourceKind: 'acid_pulse', decayRate: 0.9, maxAge: 3.2 });
  world.events.push({ type: 'acid', entityId: entity.id });
  return true;
}

function toxinCloud(world, entity) {
  const o = ORGANELLES.toxin_cloud.stats;
  if ((entity.cargo.toxins || 0) < o.toxinCost || (entity.cargo.energy || 0) < o.energyCost) return false;
  entity.cargo.toxins -= o.toxinCost; entity.cargo.energy -= o.energyCost;
  spawnResourceField(world, entity.x, entity.y, { toxins: 26, energy: 4 }, { radius: o.radius, density: 1.3, sourceKind: 'toxin_cloud', decayRate: 0.65, maxAge: 6 });
  world.events.push({ type: 'cloud', entityId: entity.id });
  return true;
}

function hurt(world, entity, amount, sourceId = null) {
  entity.hp -= amount;
  if (amount > 0) entity.hit = 0.18;
  if (entity.hp <= 0 && entity.alive) {
    entity.alive = false;
    world.stats.deaths += 1;
    world.events.push({ type: 'death', entityId: entity.id, sourceId });
  }
}

function removeDead(world) {
  for (let i = world.entities.length - 1; i >= 0; i--) {
    const e = world.entities[i];
    if (e.alive) continue;
    bloomDeath(world, e);
    if (e.kind === 'player') {
      const next = makeSoftBody(world, 'player', e.x + 38, Math.max(WORLD.nurseryTop, e.y - 160), {
        r: 22, hp: 105, maxHp: 105, color: '#86d2ff', controller: 'human', trophicRole: 'anaerobic_scavenger', depthHome: WORLD.nurseryTop + 230,
        cargo: { biomass: 10, lipids: 8, energy: 24 }, organelles: { membrane: 1 }, oxygen: oxygenAt(Math.max(WORLD.nurseryTop, e.y - 160)), oxygenTolerance: 0.32, grace: 2.0
      });
      if (hasOrg(e, 'eucharist_archive')) next.organelles.eucharist_archive = 1;
      world.entities[i] = next;
      world.playerId = next.id;
    } else {
      world.entities.splice(i, 1);
    }
  }
}

function bloomDeath(world, e) {
  const stock = emptyCargo();
  stock.biomass = e.r * (e.kind === 'player' ? 2.1 : e.controller === 'algae' ? 2.6 : 1.25) + (e.cargo.biomass || 0) * 0.85 + e.biomassMass * 0.8;
  stock.lipids = Math.max(3, e.r * 0.24 + (e.cargo.lipids || 0) * 0.72);
  stock.toxins = Math.max(0, (e.cargo.toxins || 0) * 0.8 + (hasOrg(e, 'toxin_sac') ? 8 : 0) + (e.oxygen || 0) * 8);
  stock.energy = Math.max(0, (e.cargo.energy || 0) * 0.22);
  spawnResourceField(world, e.x, e.y, stock, { radius: e.r * (e.controller === 'algae' ? 3.0 : 2.2), density: e.controller === 'algae' ? 1.6 : 1.3, sourceKind: `${e.controller || e.kind}_corpse`, maxAge: e.kind === 'player' ? 30 : e.controller === 'algae' ? 42 : 24, maxRadius: e.controller === 'algae' ? 230 : 170 });
  if (e.controller === 'algae') world.stats.ruptures += 1;
  if (e.kind !== 'player') {
    const deep = e.y - WORLD.canopy;
    if (deep > 780 && world.rng() < 0.7) spawnParticle(world, 'spores', e.x, e.y, Math.ceil(deep / 1400));
    if (deep > 1120 && world.rng() < 0.58) spawnParticle(world, choice(world, ['enzymes', 'crystals', 'vacuoles']), e.x, e.y, 1);
    const player = getPlayer(world);
    if (player && hasMito(player) && deep > 2400 && (e.controller === 'protozoan' || e.controller === 'predator' || e.controller === 'algae')) {
      spawnParticle(world, 'dna', e.x, e.y, e.controller === 'protozoan' ? 2 : 1);
    }
  }
}

function spawnTick(world, dt) {
  world.spawn.algae -= dt; world.spawn.npc -= dt; world.spawn.exotic -= dt;
  if (world.spawn.algae <= 0 && world.entities.filter(e => e.controller === 'algae').length < 14) {
    world.spawn.algae = rand(world, 1.0, 2.2);
    spawnAlgae(world);
  }
  if (world.spawn.npc <= 0 && world.entities.length < 70) {
    world.spawn.npc = rand(world, 1.4, 2.8);
    const r = world.rng();
    if (r < 0.52) spawnScavenger(world);
    else if (r < 0.84) spawnPredator(world);
    else spawnProtozoan(world);
  }
  if (world.spawn.exotic <= 0) {
    world.spawn.exotic = rand(world, 2.5, 5.2);
    const y = WORLD.nurseryBottom + rand(world, 120, 2500);
    spawnParticle(world, choice(world, ['spores', 'enzymes', 'crystals', 'vacuoles']), rand(world, 0, WORLD.w), y, 1);
  }
}

function spawnAlgae(world, opts = {}) {
  const mature = !!opts.mature;
  const r = mature ? rand(world, 38, 58) : rand(world, 22, 34);
  const biomass = mature ? rand(world, 80, 150) : rand(world, 28, 62);
  const e = makeSoftBody(world, 'npc', rand(world, 0, WORLD.w), WORLD.canopy + rand(world, 40, 260), {
    r, hp: r * 4.2, maxHp: r * 4.2, color: '#7ee96f', controller: 'algae', trophicRole: 'photosynthetic_bloom', depthHome: WORLD.canopy + 160,
    organelles: { membrane: 1, photosystem: 1 + (mature ? 1 : 0), buoyancy_vacuole: mature ? 1 : 2, flagella: mature ? 0 : 1 },
    cargo: { biomass, lipids: rand(world, 10, 32), energy: rand(world, 10, 24), toxins: 0 },
    oxygen: oxygenAt(WORLD.canopy + 120), oxygenTolerance: 0.72, porosity: 0.12,
    membraneHardness: mature ? 0.48 : 0.30, ruptureThreshold: mature ? 0.55 : 0.35, biomassMass: biomass
  });
  world.entities.push(e);
  return e;
}

function spawnScavenger(world) {
  const y = WORLD.nurseryTop + rand(world, 0, 580);
  const e = makeSoftBody(world, 'npc', rand(world, 0, WORLD.w), y, {
    r: rand(world, 11, 18), hp: rand(world, 28, 45), maxHp: rand(world, 28, 45), color: '#8ef19e', controller: 'scavenger', trophicRole: 'anaerobic_scavenger', depthHome: y,
    organelles: { membrane: 1 }, cargo: { biomass: rand(world, 2, 12), energy: rand(world, 5, 18), lipids: rand(world, 0, 6) }, oxygen: oxygenAt(y), oxygenTolerance: 0.34, porosity: 0.18
  });
  world.entities.push(e); return e;
}

function spawnPredator(world) {
  const y = WORLD.ruptureTop + rand(world, 0, 1150);
  const e = makeSoftBody(world, 'npc', rand(world, 0, WORLD.w), y, {
    r: rand(world, 22, 34), hp: rand(world, 78, 130), maxHp: rand(world, 78, 130), color: '#ff7897', controller: 'predator', trophicRole: 'rupture_predator', depthHome: y,
    organelles: { membrane: 1, flagella: 1, rasping_lamella: 1 }, cargo: { biomass: rand(world, 12, 26), energy: rand(world, 18, 40), lipids: rand(world, 8, 26) }, oxygen: oxygenAt(y), oxygenTolerance: 0.48, porosity: 0.15,
    membraneHardness: 0.36, ruptureThreshold: 0.48
  });
  world.entities.push(e); return e;
}

function spawnProtozoan(world) {
  const y = WORLD.deepTop + rand(world, 100, 1900);
  const e = makeSoftBody(world, 'npc', rand(world, 0, WORLD.w), y, {
    r: rand(world, 34, 52), hp: rand(world, 150, 230), maxHp: rand(world, 150, 230), color: '#d892ff', controller: 'protozoan', trophicRole: 'deep_predator', depthHome: y,
    organelles: { membrane: 1, flagella: 1, rasping_lamella: 1, toxin_sac: 1, mitochondrion: 1 }, cargo: { biomass: rand(world, 28, 62), energy: rand(world, 50, 90), lipids: rand(world, 20, 52), toxins: rand(world, 4, 18) }, oxygen: oxygenAt(y), oxygenTolerance: 0.70, porosity: 0.10,
    membraneHardness: 0.56, ruptureThreshold: 0.65
  });
  world.entities.push(e); return e;
}

function bestFieldFor(entity, world) {
  let best = null, bestScore = -Infinity;
  for (const f of world.fields) {
    const matter = totalMatter(f.stock); if (matter <= 0.5) continue;
    const d = distWrap(entity.x, entity.y, f.x, f.y);
    const depthPenalty = Math.abs(f.y - entity.depthHome) * 0.010;
    const toxinPenalty = (f.stock.toxins || 0) * (hasOrg(entity, 'toxin_sac') ? 0.01 : 0.09);
    const score = matter / (35 + d) - depthPenalty - toxinPenalty;
    if (score > bestScore) { best = f; bestScore = score; }
  }
  return best;
}

function bestBodyTarget(entity, world, player) {
  if (!hasOrg(entity, 'rasping_lamella')) return null;
  let best = null, bestScore = -Infinity;
  for (const other of world.entities) {
    if (!other.alive || other.id === entity.id) continue;
    if (entity.friendly && other.kind === 'player') continue;
    if (other.friendly && entity.kind === 'player') continue;
    if (entity.controller === 'predator' && other.controller === 'protozoan') continue;
    const d = distWrap(entity.x, entity.y, other.x, other.y);
    const fallingValue = other.controller === 'algae' && (other.fallState === 'sinking' || other.y > WORLD.nurseryBottom) ? 4.0 : 0;
    const sizeValue = other.r / Math.max(10, entity.r);
    const weak = other.hp / other.maxHp < 0.55 ? 1.3 : 0;
    const score = fallingValue + sizeValue * 1.2 + weak - d / 280 - Math.abs(other.y - entity.depthHome) / 1150;
    if (score > bestScore) { best = other; bestScore = score; }
  }
  return best;
}

function feedFromFields(world, entity, dt) {
  const radius = feedRadius(entity);
  const rate = feedRate(entity);
  const affinity = {
    biomass: 1.0,
    lipids: hasMito(entity) ? 0.95 : 0.55,
    toxins: hasOrg(entity, 'toxin_sac') ? 0.55 : 0.10,
    energy: 0.7
  };
  let totalFlow = 0;
  for (const f of world.fields) {
    const d = distWrap(entity.x, entity.y, f.x, f.y);
    const overlap = radius + f.radius - d;
    if (overlap <= 0) continue;
    const overlapFraction = clamp(overlap / Math.min(radius, f.radius), 0, 1.25);
    for (const r of MATTER_RESOURCES) {
      const stock = f.stock[r] || 0; if (stock <= 0) continue;
      const wantRoom = (caps(entity)[r] ?? 999) - (entity.cargo[r] || 0); if (wantRoom <= 0.01) continue;
      const flow = Math.min(stock, wantRoom, rate * overlapFraction * f.density * (affinity[r] || 1) * dt);
      if (flow > 0) { f.stock[r] -= flow; entity.cargo[r] += flow; totalFlow += flow; }
    }
  }
  if (totalFlow > 0) entity.hunger = Math.max(0, entity.hunger - totalFlow * 0.014);
  return totalFlow;
}

function collectParticles(world, entity) {
  for (let i = world.particles.length - 1; i >= 0; i--) {
    const p = world.particles[i];
    const radius = entity.r + (entity.feedIntent ? 8 : 0);
    if (dist2Wrap(entity.x, entity.y, p.x, p.y) > radius * radius) continue;
    if (p.kind === 'dna' && !hasMito(entity)) continue;
    if (entity.kind !== 'player' && p.kind === 'dna') continue;
    entity.cargo[p.kind] = (entity.cargo[p.kind] || 0) + p.value;
    if (p.kind === 'dna') world.stats.dnaRead += p.value;
    world.events.push({ type: 'particle', entityId: entity.id, kind: p.kind, value: p.value });
    world.particles.splice(i, 1);
  }
}

function spawnResourceField(world, x, y, stock, opts = {}) {
  const f = {
    id: id('field'), x: wrapX(x), y: clamp(y, WORLD.canopy + 5, WORLD.h - 25), radius: opts.radius || 42,
    stock: emptyCargo(stock), density: opts.density || 1, sourceKind: opts.sourceKind || 'slurry', age: 0,
    maxAge: opts.maxAge || 24, decayRate: opts.decayRate ?? 0.10, radiusScale: opts.radiusScale || 8, maxRadius: opts.maxRadius || 180
  };
  world.fields.push(f);
  return f;
}

function mergeNearbyFields(world) {
  for (let i = 0; i < world.fields.length; i++) {
    const a = world.fields[i];
    for (let j = world.fields.length - 1; j > i; j--) {
      const b = world.fields[j];
      const d = distWrap(a.x, a.y, b.x, b.y);
      if (d > Math.min(80, (a.radius + b.radius) * 0.35)) continue;
      const ta = totalMatter(a.stock), tb = totalMatter(b.stock), total = Math.max(1, ta + tb);
      a.x = wrapX(a.x + dxWrap(a.x, b.x) * (tb / total));
      a.y = (a.y * ta + b.y * tb) / total;
      addStock(a.stock, b.stock);
      a.age = Math.min(a.age, b.age);
      a.maxAge = Math.max(a.maxAge, b.maxAge);
      a.maxRadius = Math.max(a.maxRadius, b.maxRadius);
      world.fields.splice(j, 1);
      world.stats.fieldsMerged += 1;
    }
  }
}

function spawnParticle(world, kind, x, y, value = 1) {
  const p = { id: id('particle'), kind, x: wrapX(x + rand(world, -18, 18)), y: clamp(y + rand(world, -18, 18), WORLD.canopy, WORLD.h), value, vx: rand(world, -24, 24), vy: rand(world, -18, 18), age: 0, maxAge: kind === 'dna' ? 36 : 24, color: COLORS[kind] || '#fff' };
  world.particles.push(p);
  return p;
}

export function getAvailableActions(world, entityId = world.playerId) {
  const e = world.entities.find(x => x.id === entityId);
  if (!e) return [];
  const actions = [{ id: 'move', label: 'Swim', enabled: true }, { id: 'feed', label: 'Feed', enabled: true }];
  if (hasOrg(e, 'lipid_repair_loom')) actions.push({ id: 'repair', label: 'Repair', enabled: (e.cargo.lipids || 0) > 0 && (e.cargo.energy || 0) > 0 });
  if (hasOrg(e, 'rasping_lamella')) actions.push({ id: 'rasp', label: 'Rasp', enabled: (e.cargo.energy || 0) > 0 });
  if (hasOrg(e, 'dash_vacuole')) actions.push({ id: 'dash', label: 'Dash', enabled: (e.cargo.energy || 0) >= ORGANELLES.dash_vacuole.stats.energyCost });
  if (hasOrg(e, 'toxin_sac')) actions.push({ id: 'acid', label: 'Acid', enabled: (e.cargo.toxins || 0) >= ORGANELLES.toxin_sac.stats.toxinCost });
  if (hasOrg(e, 'toxin_cloud')) actions.push({ id: 'cloud', label: 'Cloud', enabled: (e.cargo.toxins || 0) >= ORGANELLES.toxin_cloud.stats.toxinCost });
  actions.push({ id: 'yuki', label: 'Yuki', enabled: nearYuki(world, e) });
  return actions;
}

export function nearYuki(world, entity = getPlayer(world)) { return !!entity && entity.y < WORLD.canopy + 220; }

export function getYukiOfferings(world, entityId = world.playerId) {
  const e = world.entities.find(x => x.id === entityId);
  const readiness = hostReadiness(e);
  return OFFERINGS.map(o => {
    const def = o.organelle ? ORGANELLES[o.organelle] : null;
    const limit = o.stackLimit || def?.max || (def?.stackable ? 99 : 1);
    const owned = o.organelle && !def?.stackable && orgCount(e, o.organelle) >= limit;
    const maxed = o.organelle && orgCount(e, o.organelle) >= limit;
    const needsMito = !!o.requiresMito && !hasMito(e);
    const needsNoMito = o.id === 'mitochondrial_eucharist' && hasMito(e);
    const needsOrg = o.requiresOrganelle && !hasOrg(e, o.requiresOrganelle);
    const needsHost = !!o.requiresHostReady && !readiness.ready;
    const incubating = o.id === 'mitochondrial_eucharist' && !!e.incubating;
    const affordable = hasStock(e.cargo, o.cost);
    const locked = !!owned || !!maxed || needsMito || needsNoMito || needsOrg || needsHost || incubating || !affordable;
    const reasons = [];
    if (owned || maxed) reasons.push('already grafted or maxed');
    if (needsMito) reasons.push('requires mitochondrial Eucharist');
    if (needsNoMito) reasons.push('already integrated');
    if (needsOrg) reasons.push(`requires ${ORGANELLES[o.requiresOrganelle]?.name || o.requiresOrganelle}`);
    if (needsHost) reasons.push(...readiness.reasons.slice(0, 3));
    if (incubating) reasons.push('incubation underway');
    if (!affordable) reasons.push(`needs ${fmtStock(missingStock(e.cargo, o.cost))}`);
    return { ...o, costText: fmtStock(o.cost), locked, affordable, reasons, owned, maxed, tier3: o.section.includes('Tier 3'), readiness: o.id === 'mitochondrial_eucharist' ? readiness : null };
  });
}

function missingStock(cargo, cost = {}) { const m = {}; for (const [k, v] of Object.entries(cost)) if (k !== 'oxygen' && (cargo[k] || 0) < v) m[k] = v - (cargo[k] || 0); return m; }

export function buyOffering(world, offeringId, entityId = world.playerId) {
  const entity = world.entities.find(x => x.id === entityId);
  const offering = OFFERINGS.find(o => o.id === offeringId);
  if (!entity || !offering) return { ok: false, reason: 'missing entity or offering' };
  const projected = getYukiOfferings(world, entityId).find(o => o.id === offeringId);
  if (!projected || projected.locked) return { ok: false, reason: projected?.reasons?.join('; ') || 'locked' };
  subStock(entity.cargo, offering.cost || {});
  if (offering.gain) addStock(entity.cargo, offering.gain);
  if (offering.effect?.heal) entity.hp = Math.min(caps(entity).hp, entity.hp + offering.effect.heal);
  if (offering.effect?.detox) entity.cargo.toxins = Math.max(0, (entity.cargo.toxins || 0) - offering.effect.detox);
  if (offering.effect?.oxygenVent) entity.oxygen = Math.max(0, entity.oxygen - offering.effect.oxygenVent);
  if (offering.effect?.beginEucharist) {
    entity.incubating = { time: 16, total: 16 };
    world.events.push({ type: 'eucharist_begin', entityId });
  }
  if (offering.effect?.addMito && orgCount(entity, 'mitochondrion') < ORGANELLES.mitochondrion.max) {
    entity.organelles.mitochondrion = orgCount(entity, 'mitochondrion') + 1;
  }
  if (offering.organelle) {
    entity.organelles[offering.organelle] = (entity.organelles[offering.organelle] || 0) + 1;
    if (offering.organelle === 'companion_cell') spawnCompanion(world, entity);
    if (offering.organelle === 'multicell_chassis') { entity.r += 8; entity.maxHp += 70; entity.hp += 70; }
  }
  clampCargo(entity);
  world.events.push({ type: 'buy', entityId, offeringId });
  return { ok: true, offeringId };
}

function spawnCompanion(world, player) {
  const e = makeSoftBody(world, 'npc', player.x + 55, player.y + 20, { r: 18, hp: 65, maxHp: 65, color: '#7fffe0', controller: 'scavenger', friendly: true, depthHome: player.y, organelles: { membrane: 1, cytostome: 1, flagella: 1 }, cargo: { biomass: 8, energy: 20 }, oxygen: player.oxygen, oxygenTolerance: oxygenTolerance(player) });
  world.entities.push(e); world.stats.spawnedCompanions += 1;
}

export function getHudProjection(world, entityId = world.playerId) {
  const e = world.entities.find(x => x.id === entityId);
  if (!e) return null;
  const c = caps(e);
  const env = { oxygen: oxygenAt(e.y), light: lightAt(e.y), pressure: pressureAt(e.y) };
  const readiness = hostReadiness(e);
  return {
    hp: { value: e.hp, max: c.hp, label: 'HP' },
    oxygen: { value: e.oxygen, max: c.oxygen, external: env.oxygen, tolerance: oxygenTolerance(e), label: 'O2' },
    depth: { value: Math.max(0, e.y - WORLD.canopy), max: WORLD.h - WORLD.canopy, zone: zoneName(e.y), light: env.light, externalOxygen: env.oxygen },
    resources: RESOURCES.map(r => ({ id: r, label: r, value: e.cargo[r] || 0, max: c[r] || 99, color: COLORS[r] || '#fff' })),
    organelles: Object.entries(e.organelles).map(([id, count]) => ({ id, count, name: ORGANELLES[id]?.name || id, tier: ORGANELLES[id]?.tier || 1, action: ORGANELLES[id]?.action || null })),
    actions: getAvailableActions(world, entityId),
    nearYuki: nearYuki(world, e),
    tier: hasMito(e) ? 3 : 2,
    hostReadiness: readiness,
    incubating: e.incubating ? { ...e.incubating } : null,
    objective: objectiveText(world, e)
  };
}

function zoneName(y) {
  const d = y - WORLD.canopy;
  if (d < 420) return 'Oxygen canopy';
  if (d < 900) return 'Oxic transition';
  if (d < 1600) return 'Anaerobic nursery';
  if (d < 2900) return 'Rupture layer';
  if (d < 4100) return 'Deep predator dark';
  return 'Ancestral black';
}

function objectiveText(world, e) {
  if (e.incubating) return 'Eucharist incubating. Keep lipids and energy available; avoid oxygen overload.';
  if (!hasOrg(e, 'lipid_repair_loom')) return 'Anaerobic scavenger: feed from rupture fields, avoid oxygen, return to Yuki for Tier 2 organs.';
  if (!hasMito(e)) return 'Build host-worthiness from repair, oxygen tolerance, exotics, and depth survival. Mitochondria are not bought.';
  if ((e.cargo.dna || 0) < 3) return 'Mitochondria online. Oxygen and lipids are power; deep ruptures now shed DNA information.';
  if (!hasOrg(e, 'eucharist_archive')) return 'Return to Yuki with DNA to open the Eucharist Archive.';
  return 'Archive online. Build companions and multicell machinery from deep information.';
}

export function getRenderProjection(world) {
  return {
    version: VERSION,
    world: WORLD,
    t: world.t,
    environment: { oxygenSurface: oxygenAt(WORLD.canopy + 30), oxygenNursery: oxygenAt(WORLD.nurseryTop + 100), lightSurface: lightAt(WORLD.canopy + 30) },
    entities: world.entities.map(e => ({ id: e.id, kind: e.kind, x: e.x, y: e.y, vx: e.vx, vy: e.vy, r: e.r, hp: e.hp, maxHp: e.maxHp, color: e.color, controller: e.controller, trophicRole: e.trophicRole, friendly: e.friendly, phase: e.phase, feedIntent: e.feedIntent, repairIntent: e.repairIntent, action: e.action, organelles: { ...e.organelles }, hit: e.hit, oxygen: e.oxygen, oxygenTolerance: oxygenTolerance(e), fallState: e.fallState, incubating: e.incubating ? { ...e.incubating } : null })),
    fields: world.fields.map(f => ({ id: f.id, x: f.x, y: f.y, radius: f.radius, stock: { ...f.stock }, density: f.density, sourceKind: f.sourceKind, age: f.age, maxAge: f.maxAge })),
    particles: world.particles.map(p => ({ id: p.id, kind: p.kind, x: p.x, y: p.y, value: p.value, color: p.color, age: p.age, maxAge: p.maxAge })),
    events: world.events.slice()
  };
}

export function getDebugProjection(world) {
  const p = getPlayer(world);
  return { version: VERSION, entityCount: world.entities.length, fieldCount: world.fields.length, particleCount: world.particles.length, playerCargo: p ? { ...p.cargo } : null, playerOrgans: p ? { ...p.organelles } : null, playerOxygen: p ? p.oxygen : null, readiness: p ? hostReadiness(p) : null, stats: { ...world.stats } };
}

export const __test = { clamp, wrapX, dxWrap, distWrap, feedFromFields, repairFromLipids, caps, fmtStock, hasStock, spawnScavenger, spawnAlgae, spawnPredator, speedOf, feedRadius, totalMatter, oxygenTolerance, hostReadiness, biomassWeight, buoyancy };
