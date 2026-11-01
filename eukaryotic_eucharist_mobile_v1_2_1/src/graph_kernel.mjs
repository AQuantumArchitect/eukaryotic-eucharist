// Eukaryotic Eucharist v1.2.1 graph kernel
// Oxygen ecology branch: the kernel owns environment, bodies, fields, progression, actions, and Yuki offerings.

export const VERSION = 'mobile_v1_2_1_overlap_fermentation_reset';

export const WORLD = Object.freeze({
  w: 1800,
  h: 5600,
  canopy: 220,
  surfaceZone: 520,
  nurseryTop: 900,
  nurseryBottom: 1600,
  ruptureTop: 1700,
  ruptureBottom: 2900,
  deepTop: 3000
});

export const RESOURCES = Object.freeze(['biomass', 'lipids', 'toxins', 'energy', 'spores', 'enzymes', 'crystals', 'dna']);
export const MATTER_RESOURCES = Object.freeze(['biomass', 'lipids', 'toxins', 'energy']);
export const EXOTIC_RESOURCES = Object.freeze(['spores', 'enzymes', 'crystals']);

const COLORS = Object.freeze({
  biomass: '#89ef8e',
  lipids: '#f5d47a',
  toxins: '#bcff6f',
  energy: '#86d2ff',
  spores: '#d6a2ff',
  enzymes: '#7fffe0',
  crystals: '#ff5dba',
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
  lance_bristle: {
    name: 'Lance Bristle', tier: 2, action: null,
    desc: 'A directional contact spine. It points toward attention/mouse and damages by alignment and overlap.',
    stats: { damage: 112, length: 64, rupturePower: 1.20, alignmentFloor: 0.30, speedScale: 95 }
  },
  fermentation_matrix: {
    name: 'Fermentation Matrix', tier: 2, action: null,
    desc: 'One anaerobic flow organ: biomass becomes ATP and toxin waste. Flow scales with biomass fill; more matrices add more identical flow.',
    stats: { rate: 0.62, energyPerBiomass: 3.1, toxinPerBiomass: 0.18 }
  },
  storage_vacuole: {
    name: 'Storage Vacuole Cluster', tier: 2, action: null,
    desc: 'General cargo expansion for biomass, lipids, toxins, and ATP buffering.',
    stats: { biomass: 32, lipids: 28, toxins: 18, energy: 28, bulk: 0.018 }
  },
  exotic_vacuole: {
    name: 'Exotic Vesicle Rack', tier: 2, action: null,
    desc: 'Specialized storage for spores, enzymes, crystals, and later DNA records.',
    stats: { spores: 12, enzymes: 8, crystals: 7, dna: 12, bulk: 0.012 }
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
    desc: 'A lichen-like path: light grows biomass. Photosynthetic oxygen is vented outward; poor hosts still suffer surface oxygen.',
    stats: { biomassGain: 0.85, oxygenWaste: 0.055, oxygenVent: 0.16 }
  },
  buoyancy_vacuole: {
    name: 'Buoyancy Vacuole', tier: 2, action: null,
    desc: 'Offsets biomass weight and helps remain near the surface light layer.',
    stats: { buoyancy: 38 }
  },
  rasping_lamella: {
    name: 'Rasping Lamella', tier: 2, action: 'rasp',
    desc: 'First true attack organ. Active overlap shred; bodies do not attack, organs attack.',
    stats: { dps: 72, energyCost: 4.6, vulnerabilityBonus: 0.18, rupturePower: 1.15 }
  },
  toxin_launcher: {
    name: 'Toxic Launcher', tier: 2, action: 'acid',
    desc: 'A late Tier 2 weapon organ: fires a toxic bolt that bursts into a damaging chemical field. It is not edible food.',
    stats: { toxinCost: 2.4, energyCost: 4.2, projectileSpeed: 720, projectileDamage: 72, splashDamage: 46, splashRadius: 48, splashAge: 1.25, toxinCapBonus: 45 }
  },
  toxin_cloud: {
    name: 'Toxin Cloud Gland', tier: 2, action: 'cloud',
    desc: 'Vents stored toxin into a local field. Requires Toxic Launcher.',
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
  { id: 'repair', section: 'Tier 1 - Matter survival', kind: 'exchange', name: 'Repair Communion', output: 'hp', desc: 'Yuki patches your membrane. Self-repair is Tier 2; this is external communion.', cost: { biomass: 11 }, effect: { heal: 42 } },
  { id: 'buy_biomass', section: 'Tier 1 - Matter survival', kind: 'exchange', name: 'Render Lipids into Biomass', output: 'biomass', desc: 'Convert stored fat into construction slurry.', cost: { lipids: 18, energy: 4 }, gain: { biomass: 14 } },
  { id: 'buy_lipids', section: 'Tier 1 - Matter survival', kind: 'exchange', name: 'Condense Lipids', desc: 'Restock membrane fat from biomass and ATP.', cost: { biomass: 8, energy: 4 }, gain: { lipids: 10 }, output: 'lipids' },
  { id: 'buy_energy', section: 'Tier 1 - Matter survival', kind: 'exchange', name: 'Charge ATP', desc: 'Yuki refills cellular ATP. No waste is mixed into the output.', cost: { biomass: 5, lipids: 4 }, gain: { energy: 16 }, output: 'energy' },
  { id: 'buy_toxins', section: 'Tier 1 - Matter survival', kind: 'exchange', name: 'Distill Toxins', desc: 'Restock toxin chemistry as a single clean tank.', cost: { biomass: 5, energy: 4 }, gain: { toxins: 9 }, output: 'toxins' },
  { id: 'detox', section: 'Tier 1 - Matter survival', kind: 'exchange', name: 'Yuki Detox', output: 'detox', desc: 'Pass toxins and a little oxygen stress into the canopy. Not a combat vent.', cost: { energy: 5 }, effect: { detox: 15, oxygenVent: 0.20 } },

  { id: 'cytostome', section: 'Tier 2 - Adaptation organs', kind: 'organelle', name: 'Cytostome Bloom', desc: 'Better field feeding. Bigger mouth; softer body while feeding.', cost: { biomass: 30, lipids: 10, spores: 1 }, organelle: 'cytostome' },
  { id: 'lipid_repair_loom', section: 'Tier 2 - Adaptation organs', kind: 'organelle', name: 'Lipid Repair Loom', desc: 'Active self-repair using lipids. A key pre-mitochondrial lipid sink.', cost: { biomass: 24, lipids: 24, enzymes: 1 }, organelle: 'lipid_repair_loom' },
  { id: 'oxygen_tolerance', section: 'Tier 2 - Adaptation organs', kind: 'organelle', name: 'Oxygen Tolerance Vesicles', desc: 'Survive higher internal oxygen before tick damage begins.', cost: { biomass: 20, spores: 2, enzymes: 1 }, organelle: 'oxygen_tolerance', stackLimit: 3 },
  { id: 'oxygen_vacuole', section: 'Tier 2 - Adaptation organs', kind: 'organelle', name: 'Oxygen Vacuole', desc: 'Stores oxygen and gives buoyancy. Later useful for mitochondrial dives.', cost: { biomass: 16, lipids: 12, enzymes: 1 }, organelle: 'oxygen_vacuole', stackLimit: 3 },
  { id: 'photosystem', section: 'Tier 2 - Adaptation organs', kind: 'organelle', name: 'Photosystem Patch', desc: 'The algae road: light grows body but creates oxygen stress and weight.', cost: { biomass: 18, spores: 2, crystals: 1 }, organelle: 'photosystem', stackLimit: 3 },
  { id: 'buoyancy_vacuole', section: 'Tier 2 - Adaptation organs', kind: 'organelle', name: 'Buoyancy Vacuole', desc: 'Fight the biomass square-cube trap and remain near the light.', cost: { biomass: 16, lipids: 12, spores: 2 }, organelle: 'buoyancy_vacuole', stackLimit: 4 },
  { id: 'flagella', section: 'Tier 2 - Adaptation organs', kind: 'organelle', name: 'Flagella Bundle', desc: 'Swim, lift, and escape from rupture fields.', cost: { biomass: 20, spores: 2, enzymes: 1 }, organelle: 'flagella', stackLimit: 3 },
  { id: 'lance_bristle', section: 'Tier 2 - Adaptation organs', kind: 'organelle', name: 'Lance Bristle', desc: 'Restores the forward spine game: directional contact damage and better rupture pressure.', cost: { biomass: 24, lipids: 10, crystals: 2 }, organelle: 'lance_bristle', stackLimit: 3 },
  { id: 'fermentation_matrix', section: 'Tier 2 - Adaptation organs', kind: 'organelle', name: 'Fermentation Matrix', desc: 'Upgrades passive anaerobic biomass-to-ATP generation. More flow, less waste.', cost: { biomass: 22, enzymes: 1, spores: 1 }, organelle: 'fermentation_matrix', stackLimit: 4 },
  { id: 'storage_vacuole', section: 'Tier 2 - Adaptation organs', kind: 'organelle', name: 'Storage Vacuole Cluster', desc: 'Expands main tanks: biomass, lipids, toxins, and ATP.', cost: { biomass: 18, lipids: 10, crystals: 1 }, organelle: 'storage_vacuole', stackLimit: 5 },
  { id: 'exotic_vacuole', section: 'Tier 2 - Adaptation organs', kind: 'organelle', name: 'Exotic Vesicle Rack', desc: 'Expands specialty storage for spores, enzymes, crystals, and later DNA.', cost: { biomass: 14, spores: 1, enzymes: 1 }, organelle: 'exotic_vacuole', stackLimit: 4 },
  { id: 'rasping_lamella', section: 'Tier 2 - Adaptation organs', kind: 'organelle', name: 'Rasping Lamella', desc: 'Active overlap shred. This is the first player attack mode.', cost: { biomass: 26, crystals: 2, enzymes: 2 }, organelle: 'rasping_lamella' },
  { id: 'toxin_launcher', section: 'Tier 2 - Adaptation organs', kind: 'organelle', name: 'Toxic Launcher', desc: 'Late Tier 2 toxin weapon: fires chemical bolts that create damaging fields.', cost: { biomass: 18, toxins: 12, crystals: 2 }, organelle: 'toxin_launcher' },
  { id: 'toxin_cloud', section: 'Tier 2 - Adaptation organs', kind: 'organelle', name: 'Toxin Cloud Gland', desc: 'Local toxic vent. Requires Toxic Launcher.', cost: { biomass: 22, toxins: 22, enzymes: 1, crystals: 1 }, requiresOrganelle: 'toxin_launcher', organelle: 'toxin_cloud' },
  { id: 'dash_vacuole', section: 'Tier 2 - Adaptation organs', kind: 'organelle', name: 'Dash Vacuole', desc: 'Burst away from bad overlaps.', cost: { biomass: 18, lipids: 18, spores: 2 }, organelle: 'dash_vacuole' },

  { id: 'mitochondrial_eucharist', section: 'Eucharist Gate - Mitochondrial endosymbiosis', kind: 'sacrament', name: 'Mitochondrial Eucharist', desc: 'Yuki gives a living endosymbiont seed. Survive incubation; oxygen becomes power.', cost: { biomass: 30, lipids: 35, spores: 5, enzymes: 3, crystals: 2 }, requiresHostReady: true, effect: { beginEucharist: true } },

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
    hazards: [],
    events: [],
    stats: { fieldsMerged: 0, deaths: 0, dnaRead: 0, algaeFalls: 0, ruptures: 0, spawnedCompanions: 0, eucharists: 0, toxicHits: 0 },
    spawn: { algae: 0, npc: 0, exotic: 0, seed: 0 },
    playerId: null
  };
  const player = makeSoftBody(world, 'player', WORLD.w / 2, WORLD.nurseryBottom - 120, {
    r: 22, hp: 105, maxHp: 105, color: '#86d2ff', controller: 'human', trophicRole: 'anaerobic_scavenger', depthHome: WORLD.nurseryBottom - 120,
    cargo: { biomass: 5, lipids: 4, energy: 24, toxins: 3, spores: 0, enzymes: 0, crystals: 0, dna: 0 },
    organelles: { membrane: 1, fermentation_matrix: 1 }, oxygen: 0.15, oxygenTolerance: 0.32, porosity: 0.18
  });
  world.playerId = player.id;
  world.entities.push(player);
  seedMatureEcosystem(world);
  return world;
}

function seedMatureEcosystem(world) {
  // v1.1.1 starts in medias res: a mature algal-fall ecology is already
  // running, so the player enters rupture chaos instead of waiting for bloom.
  for (let i = 0; i < 24; i++) spawnScavenger(world, {
    y: WORLD.nurseryTop + rand(world, 120, 850),
    x: rand(world, 0, WORLD.w)
  });

  for (let i = 0; i < 8; i++) spawnAlgae(world, { mature: false });
  for (let i = 0; i < 8; i++) spawnAlgae(world, { mature: true });
  for (let i = 0; i < 7; i++) {
    const e = spawnAlgae(world, {
      mature: true,
      y: WORLD.ruptureTop - 260 + rand(world, -120, 420),
      x: rand(world, 0, WORLD.w),
      biomass: rand(world, 150, 260),
      r: rand(world, 52, 78),
      fallState: 'sinking'
    });
    e.vy = rand(world, 18, 70);
    e.cargo.energy = rand(world, 1, 9);
    e.membraneHardness = rand(world, 0.50, 0.72);
  }

  for (let i = 0; i < 15; i++) spawnPredator(world, {
    y: WORLD.ruptureTop + rand(world, 0, 1250),
    x: rand(world, 0, WORLD.w)
  });
  for (let i = 0; i < 7; i++) spawnProtozoan(world, {
    y: WORLD.deepTop + rand(world, 80, 1500),
    x: rand(world, 0, WORLD.w)
  });

  // Existing rupture fields and corpse slurry give the first seconds real choices.
  for (let i = 0; i < 22; i++) {
    const nearPlayer = i < 6;
    const x = nearPlayer ? WORLD.w / 2 + rand(world, -420, 420) : rand(world, 0, WORLD.w);
    const y = nearPlayer ? WORLD.ruptureTop + rand(world, -90, 520) : WORLD.ruptureTop + rand(world, -140, 1120);
    spawnResourceField(world, x, y, {
      biomass: rand(world, 34, 125),
      lipids: rand(world, 8, 38),
      toxins: rand(world, 0, 12),
      energy: rand(world, 0, 8)
    }, { radius: rand(world, 52, 135), sourceKind: 'mature_rupture_slurry', decayRate: 0.045, maxAge: rand(world, 38, 72), maxRadius: 240 });
  }

  for (let i = 0; i < 20; i++) {
    spawnParticle(world, choice(world, ['spores', 'spores', 'enzymes', 'crystals']), rand(world, 0, WORLD.w), WORLD.ruptureTop + rand(world, 120, 1650), 1);
  }

  world.spawn.algae = rand(world, 0.8, 1.4);
  world.spawn.npc = rand(world, 0.9, 1.6);
  world.spawn.exotic = rand(world, 1.4, 2.4);
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
  const storage = orgCount(entity, 'storage_vacuole');
  const exotic = orgCount(entity, 'exotic_vacuole');
  const storageStats = ORGANELLES.storage_vacuole.stats;
  const exoticStats = ORGANELLES.exotic_vacuole.stats;
  return {
    hp: entity.maxHp + orgCount(entity, 'multicell_chassis') * 70,
    energy: 54 + mito * ORGANELLES.mitochondrion.stats.energyMaxBonus + storage * storageStats.energy,
    biomass: 24 + orgCount(entity, 'multicell_chassis') * 80 + storage * storageStats.biomass,
    lipids: 20 + mito * 30 + storage * storageStats.lipids,
    toxins: 34 + orgCount(entity, 'toxin_launcher') * ORGANELLES.toxin_launcher.stats.toxinCapBonus + storage * storageStats.toxins,
    spores: 28 + exotic * exoticStats.spores,
    enzymes: 22 + exotic * exoticStats.enzymes,
    crystals: 18 + exotic * exoticStats.crystals,
    dna: 99 + exotic * exoticStats.dna,
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
  const cargoFactor = entity.controller === 'algae' ? 0.13 : 0.10;
  const structuralFactor = entity.controller === 'algae' ? 0.18 : 0.040;
  return Math.max(0, (entity.cargo.biomass || 0) * cargoFactor + entity.biomassMass * structuralFactor + Math.pow(entity.r, 1.18) * 0.010);
}

function buoyancy(entity) {
  return orgCount(entity, 'buoyancy_vacuole') * ORGANELLES.buoyancy_vacuole.stats.buoyancy + orgCount(entity, 'oxygen_vacuole') * ORGANELLES.oxygen_vacuole.stats.buoyancy + (entity.oxygen || 0) * 11;
}

function speedOf(entity) {
  if ((entity.cargo.energy || 0) <= 0.01) return 0;
  let sp = entity.kind === 'player' ? 162 : entity.controller === 'predator' ? 104 : entity.controller === 'protozoan' ? 88 : 82;
  sp *= 1 + orgCount(entity, 'flagella') * ORGANELLES.flagella.stats.speedBonus;
  const energyRatio = clamp((entity.cargo.energy || 0) / Math.max(1, caps(entity).energy * 0.28), 0, 1);
  sp *= energyRatio;
  sp *= 1 + Math.min(0.18, (entity.cargo.energy || 0) / 360);
  sp *= clamp(1 - (entity.r - 20) * 0.010, 0.55, 1.1);
  const bulk = orgCount(entity, 'storage_vacuole') * ORGANELLES.storage_vacuole.stats.bulk + orgCount(entity, 'exotic_vacuole') * ORGANELLES.exotic_vacuole.stats.bulk;
  sp *= clamp(1 - bulk, 0.72, 1);
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
  if (!player) return world;
  if (!player.alive) { removeDead(world); return world; }

  spawnTick(world, dt);
  applyPlayerCommands(world, player, commands, dt);
  updateNPCs(world, player, dt);
  updateEnvironmentAndMetabolism(world, dt);
  updateFields(world, dt);
  updateParticles(world, dt);
  updateHazards(world, dt);
  resolveContacts(world, dt);
  removeDead(world);
  for (const e of world.entities) {
    if (e.controller === 'algae' && e.fallState === 'sinking' && e.y < WORLD.ruptureTop + 400) {
      e.y += 14 * dt;
    }
    e.x = wrapX(e.x); e.y = clamp(e.y, WORLD.canopy + 2, WORLD.h - 30);
    e.vx *= Math.pow(0.965, dt * 60); e.vy *= Math.pow(0.965, dt * 60);
    e.hit = Math.max(0, e.hit - dt); e.grace = Math.max(0, (e.grace || 0) - dt);
    e.maxDepth = Math.max(e.maxDepth || 0, e.y - WORLD.canopy);
    clampCargo(e);
  }
  return world;
}

function hasEnergy(entity, min = 0.02) { return (entity.cargo.energy || 0) >= min; }

function applyPlayerCommands(world, player, commands, dt) {
  const move = norm(commands.moveX || 0, commands.moveY || 0);
  if (Number.isFinite(commands.aimX) && Number.isFinite(commands.aimY) && Math.abs(commands.aimX) + Math.abs(commands.aimY) > 0.01) {
    player.phase = Math.atan2(commands.aimY, commands.aimX);
  }
  const powered = hasEnergy(player);
  const moving = powered && Math.abs(commands.moveX || 0) + Math.abs(commands.moveY || 0) > 0.02;
  player.feedIntent = false;
  player.repairIntent = false;
  player.action = null;

  if (moving) {
    const moveCost = (0.50 + orgCount(player, 'flagella') * 0.12) * dt;
    if (player.cargo.energy >= moveCost) {
      player.cargo.energy = Math.max(0, (player.cargo.energy || 0) - moveCost);
      const sp = speedOf(player);
      player.vx += move.x * sp * 3.8 * dt;
      player.vy += move.y * sp * 3.8 * dt;
      if (!(Number.isFinite(commands.aimX) && Number.isFinite(commands.aimY))) player.phase = Math.atan2(move.y, move.x);
    }
  }

  if (powered) {
    player.feedIntent = !!commands.feed;
    player.repairIntent = !!commands.repair;
    if (commands.dash && hasOrg(player, 'dash_vacuole') && player.cargo.energy >= ORGANELLES.dash_vacuole.stats.energyCost) {
      const sp = ORGANELLES.dash_vacuole.stats.impulse;
      player.vx += (move.x || Math.cos(player.phase)) * sp;
      player.vy += (move.y || Math.sin(player.phase)) * sp;
      player.cargo.energy -= ORGANELLES.dash_vacuole.stats.energyCost;
      world.events.push({ type: 'dash', entityId: player.id });
    }
    if (commands.rasp && hasOrg(player, 'rasping_lamella') && player.cargo.energy > 0) player.action = 'rasp';
    if (commands.acid && hasOrg(player, 'toxin_launcher')) acidPulse(world, player, commands.aimX, commands.aimY);
    if (commands.cloud && hasOrg(player, 'toxin_cloud')) toxinCloud(world, player);
  }

  player.x = wrapX(player.x + player.vx * dt);
  player.y += player.vy * dt;
  if (powered && player.feedIntent) feedFromFields(world, player, dt);
  if (powered && player.repairIntent) repairFromLipids(world, player, dt);
  collectParticles(world, player);
}

function updateNPCs(world, player, dt) {
  for (const e of world.entities) {
    if (!e.alive || e.kind === 'player') continue;
    e.hunger = clamp(e.hunger + dt * (e.controller === 'algae' ? 0.012 : 0.04), 0, 1);
    e.feedIntent = false;
    e.repairIntent = false;
    e.action = null;
    const powered = hasEnergy(e);

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
      if (powered && distWrap(e.x, e.y, targetField.x, targetField.y) < e.r + targetField.radius * 0.9) {
        e.feedIntent = true;
        feedFromFields(world, e, dt);
        if (e.kind !== 'player') collectParticles(world, e, { npc: true });
      }
    }

    if (prey && (e.controller === 'predator' || e.controller === 'protozoan')) {
      tx = prey.x; ty = prey.y;
      const preyDist = distWrap(e.x, e.y, prey.x, prey.y);
      if (powered && hasOrg(e, 'toxin_launcher') && preyDist < 520 && e.cargo.energy > ORGANELLES.toxin_launcher.stats.energyCost && e.cargo.toxins > ORGANELLES.toxin_launcher.stats.toxinCost && world.rng() < 0.018) {
        acidPulse(world, e, dxWrap(e.x, prey.x), prey.y - e.y);
      }
      if (powered && hasOrg(e, 'rasping_lamella') && preyDist < e.r + prey.r + 18) e.action = 'rasp';
    }

    const oxygenDanger = oxygenAt(e.y) - oxygenTolerance(e);
    if (oxygenDanger > 0.10 && e.controller === 'scavenger') ty += 260;
    const dyHome = e.depthHome - e.y;
    const toward = norm(dxWrap(e.x, tx), (ty - e.y) + dyHome * 0.38);
    const sp = powered ? speedOf(e) * (e.feedIntent ? 0.62 : 1) : 0;
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
  const sp = speedOf(e) * (e.fallState === 'sinking' ? 0.30 : 0.5);
  e.vx += toward.x * sp * dt;
  e.vy += toward.y * sp * dt;
  // Passive falling if too heavy. Sinking algae must punch through
  // the nursery into the rupture layer instead of hovering at the boundary.
  const sinkForce = e.fallState === 'sinking'
    ? clamp((weight - lift) * 0.55, 0, 42) + 4
    : clamp((weight - lift) * 0.55, -8, 42);
  e.vy += sinkForce * dt;
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
      // Photosynthetic oxygen is mostly exported into the water. Algae are specialized
      // surface organisms, so they vent it especially well instead of self-poisoning.
      e.oxygen += ORGANELLES.photosystem.stats.oxygenWaste * photo * light * dt;
      const vent = ORGANELLES.photosystem.stats.oxygenVent * photo * light * (e.controller === 'algae' ? 1.85 : 0.55) * dt;
      e.oxygen = Math.max(0, e.oxygen - vent);
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
    } else if ((e.cargo.energy || 0) < caps(e).energy && (e.cargo.biomass || 0) > 0.05) {
      const fLevel = Math.max(0, orgCount(e, 'fermentation_matrix'));
      const st = ORGANELLES.fermentation_matrix.stats;
      const biomassFill = clamp((e.cargo.biomass || 0) / Math.max(1, caps(e).biomass), 0, 1);
      // Each matrix is an actual organelle-flow, not a percentage upgrade.
      // Full biomass tanks ferment quickly; empty tanks barely trickle.
      const atpPerSecond = fLevel * st.rate * (0.12 + 1.35 * biomassFill);
      const desiredATP = Math.min(atpPerSecond * dt, Math.max(0, caps(e).energy - (e.cargo.energy || 0)));
      const ferment = Math.min(e.cargo.biomass, desiredATP / st.energyPerBiomass);
      if (ferment > 0) {
        e.cargo.biomass -= ferment;
        e.cargo.energy += ferment * st.energyPerBiomass;
        e.cargo.toxins += ferment * st.toxinPerBiomass;
      }
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

    const upkeep = (e.kind === 'player' ? 0.24 : e.controller === 'algae' ? 0.13 : 0.24) * dt;
    e.cargo.energy = Math.max(0, (e.cargo.energy || 0) - upkeep);
    if ((e.cargo.energy || 0) <= 0.01 && (e.cargo.biomass || 0) <= 0.03) hurt(world, e, e.maxHp + 10, 'energy_biomass_collapse');
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


function updateHazards(world, dt) {
  for (let i = world.hazards.length - 1; i >= 0; i--) {
    const h = world.hazards[i];
    h.age += dt;
    h.x = wrapX(h.x + h.vx * dt); h.y += h.vy * dt;
    h.vx *= Math.pow(0.985, dt * 60); h.vy *= Math.pow(0.985, dt * 60);
    let burst = false;
    for (const e of world.entities) {
      if (!e.alive || e.id === h.sourceId) continue;
      const d = distWrap(h.x, h.y, e.x, e.y);
      if (d > h.radius + e.r) continue;
      if (h.hitOnce && h.hitIds.has(e.id)) continue;
      const overlap = clamp((h.radius + e.r - d) / Math.max(8, h.radius), 0, 1.4);
      hurt(world, e, h.damage * overlap * dt * (h.kind === 'toxic_projectile' ? 18 : 1), h.sourceId || h.id);
      h.hitIds.add(e.id);
      world.stats.toxicHits += 1;
      if (h.kind === 'toxic_projectile') { burst = true; break; }
    }
    if (burst || h.age > h.maxAge || h.y < WORLD.canopy - 40 || h.y > WORLD.h + 80) {
      if (h.kind === 'toxic_projectile') {
        const st = ORGANELLES.toxin_launcher.stats;
        spawnToxicHazard(world, h.x, h.y, { kind: 'toxic_splash', sourceId: h.sourceId, radius: st.splashRadius, damage: st.splashDamage, maxAge: st.splashAge });
      }
      world.hazards.splice(i, 1);
    }
  }
}

function resolveContacts(world, dt) {
  const ents = world.entities.filter(e => e.alive);
  for (let i = 0; i < ents.length; i++) {
    for (let j = i + 1; j < ents.length; j++) {
      const a = ents[i], b = ents[j];
      const dx = dxWrap(a.x, b.x), dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 1;
      const nx = dx / d, ny = dy / d;
      const overlap = a.r + b.r - d;
      // v1.2.1: soft bodies no longer position-collide. They can occupy
      // the same slurry space; overlap is now information for rasping,
      // lances, feeding fights, and damage fields instead of a wall.
      if (overlap > 0) {
        contactDamage(world, a, b, overlap, nx, ny, dt);
        contactDamage(world, b, a, overlap, -nx, -ny, dt);
      }
      lanceDamage(world, a, b, d, nx, ny, dt);
      lanceDamage(world, b, a, d, -nx, -ny, dt);
    }
  }
}

function lanceDamage(world, attacker, target, distance, nx, ny, dt) {
  const count = orgCount(attacker, 'lance_bristle');
  if (!count || !attacker.alive || !target.alive) return;
  const st = ORGANELLES.lance_bristle.stats;
  const reach = attacker.r + target.r + st.length * Math.min(1.65, 0.85 + count * 0.28);
  if (distance > reach) return;
  const facing = { x: Math.cos(attacker.phase), y: Math.sin(attacker.phase) };
  const alignment = facing.x * nx + facing.y * ny;
  if (alignment < st.alignmentFloor) return;
  const reachFraction = clamp((reach - distance) / Math.max(12, st.length), 0, 1.15);
  const impactSpeed = Math.hypot(attacker.vx || 0, attacker.vy || 0);
  const speedFactor = clamp(0.25 + impactSpeed / st.speedScale, 0.25, 4.2);
  const dmg = st.damage * count * reachFraction * alignment * speedFactor * vulnerability(target) * dt;
  if (dmg <= 0) return;
  const hardness = target.membraneHardness || 0;
  const adjusted = st.rupturePower * count < hardness && target.r > attacker.r * 1.35 ? dmg * 0.22 : dmg;
  hurt(world, target, adjusted, attacker.id);
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

function spawnToxicHazard(world, x, y, opts = {}) {
  const h = {
    id: id('hazard'), kind: opts.kind || 'toxic_splash', sourceId: opts.sourceId || null,
    x: wrapX(x), y: clamp(y, WORLD.canopy, WORLD.h), vx: opts.vx || 0, vy: opts.vy || 0,
    radius: opts.radius || 42, damage: opts.damage || 35, age: 0, maxAge: opts.maxAge || 1.2,
    color: opts.color || COLORS.toxins, hitOnce: !!opts.hitOnce, hitIds: new Set()
  };
  world.hazards.push(h);
  return h;
}

function acidPulse(world, entity, aimX = null, aimY = null) {
  if (!hasOrg(entity, 'toxin_launcher')) return false;
  const o = ORGANELLES.toxin_launcher.stats;
  if (!hasEnergy(entity, o.energyCost) || (entity.cargo.toxins || 0) < o.toxinCost) return false;
  entity.cargo.toxins -= o.toxinCost;
  entity.cargo.energy -= o.energyCost;
  let ax = aimX ?? Math.cos(entity.phase), ay = aimY ?? Math.sin(entity.phase);
  const n = norm(ax, ay); ax = n.x; ay = n.y;
  entity.phase = Math.atan2(ay, ax);
  spawnToxicHazard(world, entity.x + ax * (entity.r + 18), entity.y + ay * (entity.r + 18), {
    kind: 'toxic_projectile', sourceId: entity.id, radius: 11, damage: o.projectileDamage,
    vx: ax * o.projectileSpeed + entity.vx * 0.25, vy: ay * o.projectileSpeed + entity.vy * 0.25,
    maxAge: 0.78, hitOnce: true
  });
  world.events.push({ type: 'toxic_launch', entityId: entity.id });
  return true;
}

function toxinCloud(world, entity) {
  const o = ORGANELLES.toxin_cloud.stats;
  if ((entity.cargo.toxins || 0) < o.toxinCost || (entity.cargo.energy || 0) < o.energyCost) return false;
  entity.cargo.toxins -= o.toxinCost; entity.cargo.energy -= o.energyCost;
  spawnToxicHazard(world, entity.x, entity.y, { kind: 'toxin_cloud', sourceId: entity.id, radius: o.radius, damage: 26, maxAge: 3.0 });
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
        cargo: { biomass: 5, lipids: 4, energy: 22, toxins: 3 }, organelles: { membrane: 1, fermentation_matrix: 1 }, oxygen: oxygenAt(Math.max(WORLD.nurseryTop, e.y - 160)), oxygenTolerance: 0.32, grace: 2.0
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
  stock.toxins = Math.max(0, (e.cargo.toxins || 0) * 0.8 + (hasOrg(e, 'toxin_launcher') ? 8 : 0) + (e.oxygen || 0) * 8);
  stock.energy = Math.max(0, (e.cargo.energy || 0) * 0.22);
  spawnResourceField(world, e.x, e.y, stock, { radius: e.r * (e.controller === 'algae' ? 3.0 : 2.2), density: e.controller === 'algae' ? 1.6 : 1.3, sourceKind: `${e.controller || e.kind}_corpse`, maxAge: e.kind === 'player' ? 30 : e.controller === 'algae' ? 42 : 24, maxRadius: e.controller === 'algae' ? 230 : 170 });
  if (e.controller === 'algae') world.stats.ruptures += 1;
  if (e.kind !== 'player') {
    const deep = e.y - WORLD.canopy;
    if (deep > 780 && world.rng() < 0.7) spawnParticle(world, 'spores', e.x, e.y, Math.ceil(deep / 1400));
    if (deep > 1120 && world.rng() < 0.58) spawnParticle(world, choice(world, ['enzymes', 'crystals']), e.x, e.y, 1);
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
    spawnParticle(world, choice(world, ['spores', 'enzymes', 'crystals']), rand(world, 0, WORLD.w), y, 1);
  }
}

function spawnAlgae(world, opts = {}) {
  const mature = !!opts.mature;
  const r = opts.r || (mature ? rand(world, 38, 58) : rand(world, 22, 34));
  const biomass = opts.biomass || (mature ? rand(world, 80, 150) : rand(world, 28, 62));
  const x = opts.x ?? rand(world, 0, WORLD.w);
  const y = opts.y ?? (WORLD.canopy + rand(world, 40, 260));
  const e = makeSoftBody(world, 'npc', x, y, {
    r, hp: opts.hp || r * 4.2, maxHp: opts.maxHp || opts.hp || r * 4.2, color: '#7ee96f', controller: 'algae', trophicRole: 'photosynthetic_bloom', depthHome: WORLD.canopy + 160,
    organelles: { membrane: 1, fermentation_matrix: 1, photosystem: 1 + (mature ? 1 : 0), oxygen_tolerance: 1, buoyancy_vacuole: mature ? 1 : 2, flagella: mature ? 0 : 1 },
    cargo: { biomass, lipids: rand(world, 10, 32), energy: rand(world, 10, 24), toxins: 0 },
    oxygen: oxygenAt(y) * 0.68, oxygenTolerance: mature ? 1.02 : 0.94, porosity: 0.075,
    membraneHardness: mature ? 0.48 : 0.30, ruptureThreshold: mature ? 0.55 : 0.35, biomassMass: biomass, fallState: opts.fallState || null
  });
  world.entities.push(e);
  return e;
}

function spawnScavenger(world, opts = {}) {
  const y = opts.y ?? (WORLD.nurseryTop + rand(world, 0, 580));
  const x = opts.x ?? rand(world, 0, WORLD.w);
  const hp = rand(world, 28, 45);
  const e = makeSoftBody(world, 'npc', x, y, {
    r: rand(world, 11, 18), hp, maxHp: hp, color: '#8ef19e', controller: 'scavenger', trophicRole: 'anaerobic_scavenger', depthHome: y,
    organelles: { membrane: 1, fermentation_matrix: 1 }, cargo: { biomass: rand(world, 2, 12), energy: rand(world, 5, 18), lipids: rand(world, 0, 6) }, oxygen: oxygenAt(y), oxygenTolerance: 0.34, porosity: 0.18
  });
  world.entities.push(e); return e;
}

function spawnPredator(world, opts = {}) {
  const y = opts.y ?? (WORLD.ruptureTop + rand(world, 0, 1150));
  const x = opts.x ?? rand(world, 0, WORLD.w);
  const hp = rand(world, 78, 130);
  const e = makeSoftBody(world, 'npc', x, y, {
    r: rand(world, 22, 34), hp, maxHp: hp, color: '#ff7897', controller: 'predator', trophicRole: 'rupture_predator', depthHome: y,
    organelles: { membrane: 1, fermentation_matrix: 1, flagella: 1, rasping_lamella: 1 }, cargo: { biomass: rand(world, 12, 26), energy: rand(world, 18, 40), lipids: rand(world, 8, 26) }, oxygen: oxygenAt(y), oxygenTolerance: 0.48, porosity: 0.15,
    membraneHardness: 0.36, ruptureThreshold: 0.48
  });
  const roll = world.rng();
  if (roll < 0.42) e.organelles.lance_bristle = 1;
  if (roll > 0.62) { e.organelles.toxin_launcher = 1; e.cargo.toxins = Math.max(e.cargo.toxins || 0, rand(world, 8, 18)); }
  world.entities.push(e); return e;
}

function spawnProtozoan(world, opts = {}) {
  const y = opts.y ?? (WORLD.deepTop + rand(world, 100, 1900));
  const x = opts.x ?? rand(world, 0, WORLD.w);
  const hp = rand(world, 150, 230);
  const e = makeSoftBody(world, 'npc', x, y, {
    r: rand(world, 34, 52), hp, maxHp: hp, color: '#d892ff', controller: 'protozoan', trophicRole: 'deep_predator', depthHome: y,
    organelles: { membrane: 1, fermentation_matrix: 2, flagella: 1, rasping_lamella: 1, toxin_launcher: 1, mitochondrion: 1, lance_bristle: 1 }, cargo: { biomass: rand(world, 28, 62), energy: rand(world, 50, 90), lipids: rand(world, 20, 52), toxins: rand(world, 4, 18) }, oxygen: oxygenAt(y), oxygenTolerance: 0.70, porosity: 0.10,
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
    const toxinPenalty = (f.stock.toxins || 0) * (hasOrg(entity, 'toxin_launcher') ? 0.01 : 0.09);
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
    toxins: hasOrg(entity, 'toxin_launcher') ? 0.55 : 0.10,
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
  const powered = hasEnergy(e);
  const actions = [{ id: 'move', label: 'Swim', enabled: powered }, { id: 'feed', label: 'Feed', enabled: powered }];
  if (hasOrg(e, 'lipid_repair_loom')) actions.push({ id: 'repair', label: 'Repair', enabled: powered && (e.cargo.lipids || 0) > 0 });
  if (hasOrg(e, 'rasping_lamella')) actions.push({ id: 'rasp', label: 'Rasp', enabled: powered });
  if (hasOrg(e, 'dash_vacuole')) actions.push({ id: 'dash', label: 'Dash', enabled: powered && (e.cargo.energy || 0) >= ORGANELLES.dash_vacuole.stats.energyCost });
  if (hasOrg(e, 'toxin_launcher')) { const acidStats = ORGANELLES.toxin_launcher.stats; actions.push({ id: 'acid', label: 'Toxic Launcher', enabled: powered && (e.cargo.toxins || 0) >= acidStats.toxinCost && (e.cargo.energy || 0) >= acidStats.energyCost }); }
  if (hasOrg(e, 'toxin_cloud')) actions.push({ id: 'cloud', label: 'Cloud', enabled: powered && (e.cargo.toxins || 0) >= ORGANELLES.toxin_cloud.stats.toxinCost && (e.cargo.energy || 0) >= ORGANELLES.toxin_cloud.stats.energyCost });
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
    metabolism: { fermentationLevel: orgCount(e, 'fermentation_matrix'), fermentRate: orgCount(e, 'fermentation_matrix') * ORGANELLES.fermentation_matrix.stats.rate, energyStarved: (e.cargo.energy || 0) <= 0.01 },
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
  if (!hasOrg(e, 'lipid_repair_loom')) return 'Anaerobic scavenger: field feeding and default ATP fermentation. You have no attack yet; ATP gates every action. Scavenge rupture edges and return to Yuki for Tier 2 organs.';
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
    hazards: world.hazards.map(h => ({ id: h.id, kind: h.kind, x: h.x, y: h.y, vx: h.vx, vy: h.vy, radius: h.radius, age: h.age, maxAge: h.maxAge, color: h.color })),
    particles: world.particles.map(p => ({ id: p.id, kind: p.kind, x: p.x, y: p.y, value: p.value, color: p.color, age: p.age, maxAge: p.maxAge })),
    events: world.events.slice()
  };
}


export function killPlayer(world) {
  const player = getPlayer(world);
  if (!player || !player.alive) return { ok: false, reason: 'no living player' };
  hurt(world, player, player.maxHp + 999, 'self_lysis');
  return { ok: true };
}

export function getDebugProjection(world) {
  const p = getPlayer(world);
  return { version: VERSION, entityCount: world.entities.length, fieldCount: world.fields.length, hazardCount: world.hazards.length, particleCount: world.particles.length, playerCargo: p ? { ...p.cargo } : null, playerOrgans: p ? { ...p.organelles } : null, playerOxygen: p ? p.oxygen : null, readiness: p ? hostReadiness(p) : null, stats: { ...world.stats } };
}

export const __test = { clamp, wrapX, dxWrap, distWrap, feedFromFields, repairFromLipids, caps, fmtStock, hasStock, spawnScavenger, spawnAlgae, spawnPredator, speedOf, feedRadius, totalMatter, oxygenTolerance, hostReadiness, biomassWeight, buoyancy };
