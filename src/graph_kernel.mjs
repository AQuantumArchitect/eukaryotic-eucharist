// Eukaryotic Eucharist v1.3.3 graph kernel
// Oxygen ecology branch: the kernel owns environment, bodies, fields, progression, actions, and Yuki offerings.

export const VERSION = 'mobile_v1_3_3_predator_flow_eucharist_balance';

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
export const EXOTIC_RESOURCES = Object.freeze(['spores', 'enzymes', 'crystals', 'dna']);

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
    name: 'Cell Membrane', tier: 1, action: null, stackable: true, max: 8,
    desc: 'The enclosing bag of the organism. Each membrane unit is the explicit source of HP, permeability, oxygen capacity, and baseline skin hardness.',
    stats: { hp: 105, porosity: 0.18, hardness: 0.18, oxygenCap: 0.62, oxygenTolerance: 0.30, bulk: 0.34 }
  },
  basal_motility: {
    name: 'Basal Motility Motor', tier: 1, action: 'move', stackable: true, max: 3,
    desc: 'The starter locomotion organ. Flagella are added one at a time on top of this basal motion.',
    stats: { speedFactor: 1.0 }
  },
  membrane_intake: {
    name: 'Membrane Intake Pore', tier: 1, action: 'feed', stackable: true, max: 6,
    desc: 'The actual feeding function: while held open, overlapping matter fields flow into the body. More pores increase flow without changing the rule.',
    stats: { feedRate: 0.36, feedRadiusFactor: 1.0, vulnerabilityBonus: 0.08 }
  },
  anaerobic_processor: {
    name: 'Anaerobic Processor', tier: 1, action: null, stackable: true, max: 8,
    desc: 'One organelle-flow: biomass becomes ATP and toxin waste. Every living starter has one; buying another adds one more identical processor.',
    stats: { rate: 0.42, energyPerBiomass: 3.15, toxinPerBiomass: 0.10 }
  },
  cytostome: {
    name: 'Cytostome Bloom', tier: 2, action: 'feed', stackable: true, max: 5,
    desc: 'A larger ingestion morphology. It extends feeding radius and flow, but makes the membrane softer while feeding.',
    stats: { feedRadiusBonus: 10, feedRateBonus: 0.34, vulnerabilityBonus: 0.20 }
  },
  flagella: {
    name: 'Flagellum', tier: 2, action: null, stackable: true, max: 8,
    desc: 'One flagellum. Buy one, grow one. Each adds swimming force and a little lift.',
    stats: { speedBonus: 0.075, lift: 5.2 }
  },
  lance_bristle: {
    name: 'Lance Bristle', tier: 2, action: null, stackable: true, max: 6,
    desc: 'One directional contact spine. Buy one, grow one. Damage scales by alignment, overlap, and movement speed.',
    stats: { damage: 22, length: 48, rupturePower: 0.92, alignmentFloor: 0.32, speedScale: 185, speedFloor: 30 }
  },
  storage_vacuole: {
    name: 'Storage Vacuole', tier: 2, action: null, stackable: true, max: 8,
    desc: 'One general storage organ. Expands biomass, lipids, toxins, and ATP. Also increases body size and swimming cost.',
    stats: { biomass: 22, lipids: 14, toxins: 10, energy: 24, bulk: 0.030 }
  },
  exotic_vacuole: {
    name: 'Exotic Vesicle Rack', tier: 2, action: null, stackable: true, max: 8,
    desc: 'One specialty storage rack. Each rack explicitly provides one slot each for spores, enzymes, and crystals. No rack means no exotic storage.',
    stats: { spores: 1, enzymes: 1, crystals: 1, bulk: 0.016 }
  },
  dna_memory_vesicle: {
    name: 'DNA Memory Vesicle', tier: 3, action: null, stackable: true, max: 8,
    desc: 'A protected information vesicle. Each one explicitly stores one DNA record. DNA can be carried before it can be interpreted.',
    stats: { dna: 1, bulk: 0.012 }
  },
  lipid_repair_loom: {
    name: 'Lipid Repair Loom', tier: 2, action: 'repair', stackable: true, max: 5,
    desc: 'One repair organ. Consumes lipids and ATP to stitch the membrane. Starter bacteria do not self-repair.',
    stats: { hpPerSecond: 2.45, lipidCost: 1.05, energyCost: 3.4 }
  },
  membrane_hardening: {
    name: 'Membrane Hardening Layer', tier: 2, action: null, stackable: true, max: 6,
    desc: 'Adds tougher skin and lowers oxygen permeability. It protects and slows diffusion, but makes feeding and movement slightly clumsier.',
    stats: { hardnessBonus: 0.10, porosityReduction: 0.020, speedPenalty: 0.025, feedPenalty: 0.035 }
  },
  oxygen_tolerance: {
    name: 'Oxygen Tolerance Vesicle', tier: 2, action: null, stackable: true, max: 5,
    desc: 'Raises safe internal oxygen threshold. This is tolerance, not storage.',
    stats: { toleranceBonus: 0.13, porosityReduction: 0.010 }
  },
  oxygen_vacuole: {
    name: 'Oxygen Buoyancy Vacuole', tier: 2, action: null, stackable: true, max: 6,
    desc: 'A single organ that handles oxygen storage and buoyancy. More internal oxygen gives more lift when these vacuoles exist.',
    stats: { oxygenCapBonus: 0.34, buoyancy: 8.0, buoyancyPerOxygen: 37 }
  },
  photosystem: {
    name: 'Photosystem Patch', tier: 2, action: null, stackable: true, max: 5,
    desc: 'The algae road: light grows biomass and exports oxygen stress. It makes abundance, weight, and eventual falling.',
    stats: { biomassGain: 0.78, oxygenWaste: 0.050, oxygenVent: 0.17 }
  },
  rasping_lamella: {
    name: 'Rasping Lamella', tier: 2, action: 'rasp', stackable: true, max: 5,
    desc: 'One active overlap-shred membrane. Damage comes only while rasping and only through overlap.',
    stats: { dps: 12.5, energyCost: 2.0, vulnerabilityBonus: 0.16, rupturePower: 0.72 }
  },
  toxin_launcher: {
    name: 'Toxic Launcher', tier: 2, action: 'acid', stackable: true, max: 3,
    desc: 'A late Tier 2 weapon organ: fires one toxic glob per shot that bursts into a damaging chemical field. It is not edible food.',
    stats: { toxinCost: 2.4, energyCost: 4.2, projectileSpeed: 580, projectileDamage: 28, splashDamage: 17, splashRadius: 38, splashAge: 0.95, toxinCapBonus: 18, cooldown: 0.62 }
  },
  toxin_cloud: {
    name: 'Toxin Cloud Gland', tier: 2, action: 'cloud', stackable: true, max: 3,
    desc: 'Local toxic vent. Requires Toxic Launcher. Count increases available venting hardware.',
    stats: { radius: 74, toxinCost: 7, energyCost: 6 }
  },
  dash_vacuole: {
    name: 'Dash Vacuole', tier: 2, action: 'dash', stackable: true, max: 4,
    desc: 'One burst organ. More dash vacuoles reduce recovery and increase burst capacity through count.',
    stats: { impulse: 310, energyCost: 8 }
  },
  mitochondrion: {
    name: 'Integrated Mitochondrion', tier: 'gate', action: null,
    desc: 'Not purchased. Achieved through Yuki\'s Eucharist. Turns oxygen and lipids into high ATP.',
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
  { id: 'repair', section: 'Tier 1 - Matter survival', kind: 'exchange', name: 'Repair Communion', output: 'hp', desc: 'Yuki patches your membrane. Self-repair is Tier 2; this is external communion.', cost: { biomass: 8 }, effect: { heal: 38 } },
  { id: 'buy_biomass', section: 'Tier 1 - Matter survival', kind: 'exchange', name: 'Render Lipids into Biomass', output: 'biomass', desc: 'Convert stored fat into construction slurry.', cost: { lipids: 8, energy: 3 }, gain: { biomass: 9 } },
  { id: 'buy_lipids', section: 'Tier 1 - Matter survival', kind: 'exchange', name: 'Condense Lipids', output: 'lipids', desc: 'Restock membrane fat from biomass and ATP.', cost: { biomass: 6, energy: 3 }, gain: { lipids: 8 } },
  { id: 'buy_energy', section: 'Tier 1 - Matter survival', kind: 'exchange', name: 'Charge ATP', output: 'energy', desc: 'Yuki refills ATP. No waste is mixed into the output.', cost: { biomass: 4, lipids: 2 }, gain: { energy: 10 } },
  { id: 'buy_toxins', section: 'Tier 1 - Matter survival', kind: 'exchange', name: 'Distill Toxins', output: 'toxins', desc: 'Restock toxin chemistry as a single clean tank.', cost: { biomass: 4, energy: 3 }, gain: { toxins: 7 } },
  { id: 'detox', section: 'Tier 1 - Matter survival', kind: 'exchange', name: 'Yuki Detox', output: 'detox', desc: 'Pass toxins and oxygen stress into the canopy. Not a combat vent.', cost: { energy: 4 }, effect: { detox: 14, oxygenVent: 0.20 } },

  { id: 'membrane', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Cell Membrane', desc: 'Add one explicit membrane layer: more HP, more container surface, and more oxygen volume.', cost: { biomass: 12, lipids: 6 }, organelle: 'membrane', stackLimit: 8 },
  { id: 'membrane_intake', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Membrane Intake Pore', desc: 'Add one more feeding pore: more field flow without inventing a new rule.', cost: { biomass: 8, lipids: 3 }, organelle: 'membrane_intake', stackLimit: 6 },
  { id: 'cytostome', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Cytostome Bloom', desc: 'Larger feeding morphology: radius and flow increase together.', cost: { biomass: 18, lipids: 7, spores: 1 }, organelle: 'cytostome', stackLimit: 5 },
  { id: 'anaerobic_processor', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Anaerobic Processor', desc: 'Add one more biomass-to-ATP organ flow. More processors mean more flow and more toxin waste.', cost: { biomass: 14, enzymes: 1 }, organelle: 'anaerobic_processor', stackLimit: 8 },
  { id: 'storage_vacuole', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Storage Vacuole', desc: 'One main tank expansion for biomass, lipids, toxins, and ATP. It visibly increases body bulk.', cost: { biomass: 10, lipids: 5, crystals: 1 }, organelle: 'storage_vacuole', stackLimit: 8 },
  { id: 'exotic_vacuole', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Exotic Vesicle Rack', desc: 'Each rack adds exactly one spore, one enzyme, and one crystal slot. No invisible exotic capacity exists.', cost: { biomass: 8, spores: 1 }, organelle: 'exotic_vacuole', stackLimit: 8 },
  { id: 'dna_memory_vesicle', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'DNA Memory Vesicle', desc: 'One additional protected DNA slot. It stores information; Tier 3 decides what the information means.', cost: { biomass: 10, crystals: 1 }, organelle: 'dna_memory_vesicle', stackLimit: 8 },
  { id: 'lipid_repair_loom', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Lipid Repair Loom', desc: 'One lipid-to-membrane repair organ. Self-repair is a graft, not a starter exception.', cost: { biomass: 16, lipids: 12, enzymes: 1 }, organelle: 'lipid_repair_loom', stackLimit: 5 },
  { id: 'membrane_hardening', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Membrane Hardening Layer', desc: 'Tougher, less permeable skin. Good for algae armor and predator survival; slows flow a little.', cost: { biomass: 15, lipids: 8, crystals: 1 }, organelle: 'membrane_hardening', stackLimit: 6 },
  { id: 'flagella', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Flagellum', desc: 'One flagellum. Buy one, grow one.', cost: { biomass: 9, lipids: 4, spores: 1 }, organelle: 'flagella', stackLimit: 8 },
  { id: 'dash_vacuole', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Dash Vacuole', desc: 'One burst organ for escaping bad overlaps and oxygen stress.', cost: { biomass: 14, lipids: 12, spores: 1 }, organelle: 'dash_vacuole', stackLimit: 4 },

  { id: 'oxygen_tolerance', section: 'Tier 2B - Algal oxygen path', theme: 'algae', kind: 'organelle', name: 'Oxygen Tolerance Vesicle', desc: 'Raise the safe oxygen threshold. Tolerance is separate from storage.', cost: { biomass: 12, enzymes: 1 }, organelle: 'oxygen_tolerance', stackLimit: 5 },
  { id: 'oxygen_vacuole', section: 'Tier 2B - Algal oxygen path', theme: 'algae', kind: 'organelle', name: 'Oxygen Buoyancy Vacuole', desc: 'Merged oxygen storage and buoyancy. Internal oxygen gives lift only with this organ.', cost: { biomass: 12, lipids: 6, enzymes: 1 }, organelle: 'oxygen_vacuole', stackLimit: 6 },
  { id: 'photosystem', section: 'Tier 2B - Algal oxygen path', theme: 'algae', kind: 'organelle', name: 'Photosystem Patch', desc: 'The algae road: light grows biomass, weight, and oxygen stress.', cost: { biomass: 12, spores: 1, crystals: 1 }, organelle: 'photosystem', stackLimit: 5 },

  { id: 'rasping_lamella', section: 'Tier 2C - Predatory organs', theme: 'attack', kind: 'organelle', name: 'Rasping Lamella', desc: 'One active overlap shred membrane. It only works when bodies actually overlap.', cost: { biomass: 18, crystals: 1, enzymes: 1 }, organelle: 'rasping_lamella', stackLimit: 5 },
  { id: 'lance_bristle', section: 'Tier 2C - Predatory organs', theme: 'attack', kind: 'organelle', name: 'Lance Bristle', desc: 'One forward spine. Buy one, grow one.', cost: { biomass: 16, lipids: 6, crystals: 1 }, organelle: 'lance_bristle', stackLimit: 6 },
  { id: 'toxin_launcher', section: 'Tier 2C - Predatory organs', theme: 'attack', kind: 'organelle', name: 'Toxic Launcher', desc: 'Late Tier 2 toxin weapon: fires one chemical glob that creates a damaging field.', cost: { biomass: 14, toxins: 8, crystals: 1 }, organelle: 'toxin_launcher', stackLimit: 3 },
  { id: 'toxin_cloud', section: 'Tier 2C - Predatory organs', theme: 'attack', kind: 'organelle', name: 'Toxin Cloud Gland', desc: 'Local toxic vent. Requires Toxic Launcher.', cost: { biomass: 16, toxins: 16, enzymes: 1, crystals: 1 }, requiresOrganelle: 'toxin_launcher', organelle: 'toxin_cloud', stackLimit: 3 },

  { id: 'mitochondrial_eucharist', section: 'Eucharist Gate - Mitochondrial endosymbiosis', kind: 'sacrament', name: 'Mitochondrial Eucharist', desc: 'Yuki gives a living endosymbiont seed. Survive incubation; oxygen becomes power.', cost: { biomass: 24, lipids: 24, spores: 3, enzymes: 2, crystals: 2, dna: 1 }, requiresHostReady: true, effect: { beginEucharist: true } },

  { id: 'eucharist_archive', section: 'Tier 3 - DNA information', kind: 'eucharist', name: 'Eucharist Archive', desc: 'Record deep rupture DNA for future bodies.', cost: { dna: 1, energy: 18 }, requiresMito: true, organelle: 'eucharist_archive' },
  { id: 'mitochondrial_stack', section: 'Tier 3 - DNA information', kind: 'eucharist', name: 'Mitochondrial Stack', desc: 'Grow additional mitochondria after the first sacred integration.', cost: { dna: 1, lipids: 26 }, requiresMito: true, effect: { addMito: true } },
  { id: 'multicell_chassis', section: 'Tier 3 - DNA information', kind: 'colony', name: 'Multicell Chassis', desc: 'A larger post-mitochondrial body plan. Expands your lead cell.', cost: { dna: 6, biomass: 64, lipids: 45, energy: 42 }, requiresMito: true, organelle: 'multicell_chassis' }
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
function resourceLabel(k) { return k === 'energy' ? 'ATP' : k; }
function fmtStock(stock = {}) { return Object.entries(stock).filter(([k, v]) => k !== 'oxygen' && v > 0).map(([k, v]) => `${Math.ceil(v)} ${resourceLabel(k)}`).join(', '); }
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
    cellLibrary: [],
    spawn: { algae: 0, npc: 0, exotic: 0, seed: 0 },
    playerId: null
  };
  const player = makeSoftBody(world, 'player', WORLD.w / 2, WORLD.nurseryBottom - 120, {
    r: 22, color: '#86d2ff', controller: 'human', trophicRole: 'anaerobic_scavenger', depthHome: WORLD.nurseryBottom - 120,
    cargo: { biomass: 5, lipids: 4, energy: 18, toxins: 3, spores: 0, enzymes: 0, crystals: 0, dna: 0 },
    organelles: { membrane: 1, basal_motility: 1, membrane_intake: 1, anaerobic_processor: 1, storage_vacuole: 1, exotic_vacuole: 1, dna_memory_vesicle: 1 }, oxygen: 0.15
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
    e.organelles.membrane_hardening = Math.max(e.organelles.membrane_hardening || 0, Math.ceil(rand(world, 2, 5)));
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
  const body = {
    id: id('body'), kind, x: wrapX(x), y: clamp(y, WORLD.canopy + 5, WORLD.h - 40), vx: opts.vx || 0, vy: opts.vy || 0,
    r, baseR: opts.baseR || r, mass: opts.mass || r * 1.2, biomassMass: opts.biomassMass ?? r * 0.7,
    hp: opts.hp ?? 1, maxHp: 1,
    ruptureThreshold: opts.ruptureThreshold ?? 0.35,
    softness: opts.softness ?? 0.7, color: opts.color || '#8ceaa0', controller: opts.controller || 'scavenger', trophicRole: opts.trophicRole || opts.controller || 'scavenger',
    depthHome: opts.depthHome || y, depthBand: opts.depthBand || 420, cargo, organelles: { ...(opts.organelles || {}) },
    oxygen: opts.oxygen ?? oxygenAt(y),
    hunger: rand(world, 0.25, 0.9), targetId: null, feedIntent: false, repairIntent: false, action: null, alive: true, hit: 0,
    phase: rand(world, 0, Math.PI * 2), radiusPulse: rand(world, 0.6, 1.5), friendly: opts.friendly || false,
    fallState: opts.fallState || null, incubating: null, grace: opts.grace ?? 0, cooldowns: {},
    colony: opts.colony ? opts.colony.map(s => ({ ...s })) : []
  };
  // Graph-strict initialization: HP and capacities are derived from organelles.
  body.maxHp = caps(body).hp;
  body.hp = opts.hp == null ? body.maxHp : Math.min(opts.hp, body.maxHp);
  clampCargo(body);
  return body;
}

export function getPlayer(world) { return world.entities.find(e => e.id === world.playerId); }
export function hasOrg(entity, org) { return (entity?.organelles?.[org] || 0) > 0; }
export function orgCount(entity, org) { return entity?.organelles?.[org] || 0; }
export function hasMito(entity) { return orgCount(entity, 'mitochondrion') > 0; }

function colonyOrgs(entity) {
  const merged = {};
  for (const seg of (entity.colony || [])) {
    for (const [k, v] of Object.entries(seg.organelles || {})) {
      merged[k] = (merged[k] || 0) + v;
    }
  }
  return merged;
}

function caps(entity) {
  const extra = colonyOrgs(entity);
  const oc = (id) => (entity.organelles[id] || 0) + (extra[id] || 0);
  const membrane = oc('membrane');
  const mito = oc('mitochondrion');
  const storage = oc('storage_vacuole');
  const exotic = oc('exotic_vacuole');
  const dnaSlots = oc('dna_memory_vesicle');
  const hard = oc('membrane_hardening');
  const s = ORGANELLES.storage_vacuole.stats;
  const x = ORGANELLES.exotic_vacuole.stats;
  const m = ORGANELLES.membrane.stats;
  const ov = ORGANELLES.oxygen_vacuole.stats;
  return {
    hp: membrane * m.hp + hard * 8 + oc('multicell_chassis') * 70,
    energy: storage * s.energy + mito * ORGANELLES.mitochondrion.stats.energyMaxBonus,
    biomass: storage * s.biomass + oc('multicell_chassis') * 80,
    lipids: storage * s.lipids + mito * 30,
    toxins: storage * s.toxins + oc('toxin_launcher') * ORGANELLES.toxin_launcher.stats.toxinCapBonus,
    spores: exotic * x.spores,
    enzymes: exotic * x.enzymes,
    crystals: exotic * x.crystals,
    dna: dnaSlots * ORGANELLES.dna_memory_vesicle.stats.dna,
    oxygen: membrane * m.oxygenCap + oc('oxygen_vacuole') * ov.oxygenCapBonus
  };
}

function clampCargo(entity) {
  const c = caps(entity);
  for (const r of RESOURCES) entity.cargo[r] = clamp(entity.cargo[r] || 0, 0, c[r] ?? 999);
  entity.hp = clamp(entity.hp, 0, c.hp);
  entity.oxygen = clamp(entity.oxygen || 0, 0, c.oxygen);
}

function oxygenTolerance(entity) {
  return orgCount(entity, 'membrane') * ORGANELLES.membrane.stats.oxygenTolerance
    + orgCount(entity, 'oxygen_tolerance') * ORGANELLES.oxygen_tolerance.stats.toleranceBonus
    + orgCount(entity, 'mitochondrion') * 0.18;
}

function membraneHardness(entity) {
  return orgCount(entity, 'membrane') * ORGANELLES.membrane.stats.hardness
    + orgCount(entity, 'membrane_hardening') * ORGANELLES.membrane_hardening.stats.hardnessBonus;
}

function membranePorosity(entity) {
  const base = orgCount(entity, 'membrane') * ORGANELLES.membrane.stats.porosity;
  return clamp(base
    - orgCount(entity, 'oxygen_tolerance') * ORGANELLES.oxygen_tolerance.stats.porosityReduction
    - orgCount(entity, 'membrane_hardening') * ORGANELLES.membrane_hardening.stats.porosityReduction, 0.020, 0.32);
}

function biomassWeight(entity) {
  const cargoFactor = entity.controller === 'algae' ? 0.13 : 0.10;
  const structuralFactor = entity.controller === 'algae' ? 0.18 : 0.040;
  return Math.max(0, (entity.cargo.biomass || 0) * cargoFactor + entity.biomassMass * structuralFactor + Math.pow(entity.r, 1.18) * 0.010);
}

function buoyancy(entity) {
  const legacyLift = 0;
  const oxyOrg = orgCount(entity, 'oxygen_vacuole');
  const oxyStats = ORGANELLES.oxygen_vacuole.stats;
  const oxygenLift = oxyOrg * (oxyStats.buoyancy + (entity.oxygen || 0) * oxyStats.buoyancyPerOxygen);
  // Free dissolved oxygen is not a balloon. It becomes lift only after the body grows oxygen vacuoles.
  return legacyLift + oxygenLift + (entity.oxygen || 0) * 1.5;
}

function speedOf(entity) {
  if ((entity.cargo.energy || 0) <= 0.01) return 0;
  if (orgCount(entity, 'basal_motility') <= 0 && orgCount(entity, 'flagella') <= 0) return 0;
  let sp = entity.baseSpeed || (entity.controller === 'predator' ? 96 : entity.controller === 'protozoan' ? 82 : entity.controller === 'algae' ? 52 : 112);
  sp *= (0.72 + orgCount(entity, 'basal_motility') * 0.28);
  sp *= 1 + orgCount(entity, 'flagella') * ORGANELLES.flagella.stats.speedBonus;
  const c = caps(entity);
  const energyRatio = clamp((entity.cargo.energy || 0) / Math.max(1, c.energy * 0.42), 0, 1);
  sp *= 0.18 + 0.82 * Math.pow(energyRatio, 0.65);
  const carriedMass = (entity.cargo.biomass || 0) * 0.026 + (entity.cargo.lipids || 0) * 0.016 + (entity.cargo.toxins || 0) * 0.010;
  const organMass = Object.entries(entity.organelles || {}).reduce((sum, [id, count]) => {
    if (id === 'membrane') return sum + count * 0.6;
    if (id === 'storage_vacuole') return sum + count * 1.6;
    if (id === 'exotic_vacuole') return sum + count * 0.9;
    if (id === 'membrane_hardening') return sum + count * 1.1;
    return sum + count * 0.42;
  }, 0);
  sp *= 1 / (1 + carriedMass * 0.20 + organMass * 0.035);
  sp *= clamp(1 - orgCount(entity, 'membrane_hardening') * ORGANELLES.membrane_hardening.stats.speedPenalty, 0.65, 1);
  if (entity.feedIntent) sp *= hasOrg(entity, 'cytostome') ? 0.78 : 0.86;
  if (entity.repairIntent) sp *= 0.55;
  if (entity.hp < caps(entity).hp * 0.35) sp *= 0.8;
  return sp;
}

function feedingOrgCount(entity) {
  return orgCount(entity, 'membrane_intake') + orgCount(entity, 'cytostome');
}

function feedRadius(entity) {
  if (feedingOrgCount(entity) <= 0) return 0;
  const base = orgCount(entity, 'membrane_intake') > 0 ? entity.r * ORGANELLES.membrane_intake.stats.feedRadiusFactor : 0;
  return base + orgCount(entity, 'cytostome') * ORGANELLES.cytostome.stats.feedRadiusBonus;
}

function feedRate(entity) {
  if (feedingOrgCount(entity) <= 0) return 0;
  const membraneFlow = orgCount(entity, 'membrane_intake') * ORGANELLES.membrane_intake.stats.feedRate;
  const cytostomeFlow = orgCount(entity, 'cytostome') * ORGANELLES.cytostome.stats.feedRateBonus;
  const hardeningPenalty = 1 - orgCount(entity, 'membrane_hardening') * ORGANELLES.membrane_hardening.stats.feedPenalty;
  return Math.max(0, (membraneFlow + cytostomeFlow) * clamp(hardeningPenalty, 0.55, 1));
}

function targetRadius(entity) {
  const base = entity.baseR || entity.r || 18;
  const c = caps(entity);
  const biomassFill = clamp((entity.cargo.biomass || 0) / Math.max(1, c.biomass), 0, 1);
  const lipidFill = clamp((entity.cargo.lipids || 0) / Math.max(1, c.lipids), 0, 1);
  const energyFill = clamp((entity.cargo.energy || 0) / Math.max(1, c.energy), 0, 1);
  const toxinFill = clamp((entity.cargo.toxins || 0) / Math.max(1, c.toxins), 0, 1);
  const fullness = biomassFill * 0.52 + lipidFill * 0.22 + energyFill * 0.12 + toxinFill * 0.08;
  const organBulk = Object.entries(entity.organelles || {}).reduce((sum, [id, count]) => {
    if (id === 'membrane') return sum + count * 0.25;
    if (id === 'membrane_intake') return sum + count * 0.32;
    if (id === 'storage_vacuole') return sum + count * 2.1;
    if (id === 'exotic_vacuole') return sum + count * 1.25;
    if (id === 'multicell_chassis') return sum + count * 8;
    return sum + count * 0.72;
  }, 0);
  if (entity.controller === 'algae') {
    const massFill = clamp(((entity.cargo.biomass || 0) + (entity.biomassMass || 0) * 0.35) / Math.max(1, c.biomass), 0, 1.35);
    return clamp(base + massFill * 32 + organBulk * 0.35, 16, 118);
  }
  const storageAmplifier = 4.5 + orgCount(entity, 'storage_vacuole') * 4.8 + orgCount(entity, 'exotic_vacuole') * 1.8;
  return clamp(base + organBulk + fullness * storageAmplifier, 10, entity.kind === 'player' ? 74 : 92);
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
  const lipid = clamp((entity.cargo.lipids || 0) / Math.max(12, caps(entity).lipids * 0.65), 0, 1);
  const membrane = clamp((orgCount(entity, 'cytostome') + orgCount(entity, 'lipid_repair_loom') + orgCount(entity, 'membrane_hardening') + orgCount(entity, 'oxygen_vacuole')) / 4, 0, 1);
  const exotics = clamp(((entity.cargo.spores || 0) / 3 + (entity.cargo.enzymes || 0) / 2 + (entity.cargo.crystals || 0) / 2) / 3, 0, 1);
  const dna = clamp((entity.cargo.dna || 0) / 1, 0, 1);
  const depth = clamp((entity.maxDepth || 0) / 1800, 0, 1);
  const score = 0.22 * lipid + 0.25 * membrane + 0.22 * exotics + 0.21 * dna + 0.10 * depth;
  const reasons = [];
  if (lipid < 0.8) reasons.push('needs lipid reserve');
  if (membrane < 0.66) reasons.push('needs host organs');
  if (exotics < 0.72) reasons.push('needs exotic traces');
  if (dna < 1) reasons.push('needs one DNA record');
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
  applyActiveActionCosts(world, dt);
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
    if (e.cooldowns) for (const k of Object.keys(e.cooldowns)) e.cooldowns[k] = Math.max(0, e.cooldowns[k] - dt);
    e.r = targetRadius(e);
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
  const moving = powered && (orgCount(player, 'basal_motility') > 0 || orgCount(player, 'flagella') > 0) && Math.abs(commands.moveX || 0) + Math.abs(commands.moveY || 0) > 0.02;
  player.feedIntent = false;
  player.repairIntent = false;
  player.action = null;

  if (moving) {
    const energyFill = clamp((player.cargo.energy || 0) / Math.max(1, caps(player).energy), 0, 1);
    const motionVolume = 0.34 + 1.36 * Math.pow(energyFill, 1.30);
    const preMitoBurden = hasMito(player) ? 1.0 : 1.42;
    const moveCost = (0.38 + orgCount(player, 'flagella') * 0.090 + (player.cargo.biomass || 0) * 0.016 + Object.values(player.organelles || {}).reduce((a,b)=>a+b,0)*0.017) * motionVolume * preMitoBurden * dt;
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
    const powered = hasEnergy(e) && (orgCount(e, 'basal_motility') > 0 || orgCount(e, 'flagella') > 0);

    if (e.controller === 'algae') {
      updateAlgaeAI(world, e, dt);
      continue;
    }

    const targetField = bestFieldFor(e, world);
    const prey = bestBodyTarget(e, world, player);
    let tx = e.x + Math.cos(e.phase) * 100;
    let ty = e.depthHome;
    let targetMode = 'home';

    if (targetField && (e.hunger > 0.20 || e.controller === 'scavenger')) {
      tx = targetField.x; ty = targetField.y; targetMode = 'field';
      if (powered && distWrap(e.x, e.y, targetField.x, targetField.y) < e.r + targetField.radius * 0.9) {
        e.feedIntent = true;
        feedFromFields(world, e, dt);
        if (e.kind !== 'player') collectParticles(world, e);
      }
    }

    if (prey && (e.controller === 'predator' || e.controller === 'protozoan')) {
      tx = prey.x; ty = prey.y; targetMode = 'prey';
      const preyDist = distWrap(e.x, e.y, prey.x, prey.y);
      if (powered && hasOrg(e, 'toxin_launcher') && preyDist < 520 && e.cargo.energy > ORGANELLES.toxin_launcher.stats.energyCost && e.cargo.toxins > ORGANELLES.toxin_launcher.stats.toxinCost && world.rng() < 0.018) {
        acidPulse(world, e, dxWrap(e.x, prey.x), prey.y - e.y);
      }
      // With collision removed, predators should commit to standing on the target.
      // Rasping is overlap-based; orbiting just outside contact is explicitly wrong.
      if (powered && hasOrg(e, 'rasping_lamella') && preyDist < e.r + prey.r + 42) e.action = 'rasp';
    }

    const oxygenDanger = oxygenAt(e.y) - oxygenTolerance(e);
    if (oxygenDanger > 0.10 && e.controller === 'scavenger') ty += 260;
    const dyHome = e.depthHome - e.y;
    const homeBias = targetMode === 'prey' ? 0.02 : targetMode === 'field' ? 0.18 : 0.38;
    const toward = norm(dxWrap(e.x, tx), (ty - e.y) + dyHome * homeBias);
    const sp = powered ? speedOf(e) * (e.feedIntent ? 0.62 : 1) * (targetMode === 'prey' ? 1.38 : 1) : 0;
    e.vx += toward.x * sp * (targetMode === 'prey' ? 4.2 : 2.5) * dt;
    e.vy += toward.y * sp * (targetMode === 'prey' ? 4.2 : 2.5) * dt;
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
  const fullness = (e.cargo.biomass || 0) / Math.max(1, caps(e).biomass);
  const failing = weight > lift + 2 || fullness > 0.82 || (e.cargo.energy || 0) < 2;
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
    ? clamp((weight - lift) * 0.58 + fullness * 14, 0, 48) + 4
    : clamp((weight - lift) * 0.52 + fullness * 5, -8, 42);
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
      if (e.controller === 'algae') e.biomassMass += light * photo * 0.09 * dt;
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
      const fLevel = Math.max(0, orgCount(e, 'anaerobic_processor'));
      const st = ORGANELLES.anaerobic_processor.stats;
      const biomassFill = clamp((e.cargo.biomass || 0) / Math.max(1, caps(e).biomass), 0, 1);
      // v1.3.3 flow curve: fuller biomass tanks process a larger volume faster,
      // but the conversion is less efficient. Bare reserves are slow but frugal.
      const volumeCurve = 0.10 + 1.60 * Math.pow(biomassFill, 1.35);
      const efficiency = st.energyPerBiomass * (1.16 - 0.34 * biomassFill);
      const atpPerSecond = fLevel * st.rate * volumeCurve;
      const desiredATP = Math.min(atpPerSecond * dt, Math.max(0, caps(e).energy - (e.cargo.energy || 0)));
      const ferment = Math.min(e.cargo.biomass, desiredATP / Math.max(0.1, efficiency));
      if (ferment > 0) {
        e.cargo.biomass -= ferment;
        e.cargo.energy += ferment * efficiency;
        e.cargo.toxins += ferment * st.toxinPerBiomass * (0.65 + 0.9 * biomassFill);
      }
    }

    // Oxygen overload is tick damage unless tolerated or burned by mitochondria.
    const tol = oxygenTolerance(e);
    if (e.grace <= 0 && e.oxygen > tol) {
      const excess = e.oxygen - tol;
      e.hp -= excess * (hasMito(e) ? 3.4 : 7.4) * dt;
      e.hit = Math.max(e.hit, 0.05);
    }

    const toxCap = caps(e).toxins;
    if (toxCap > 0 && e.cargo.toxins > toxCap * 0.68) {
      const toxExcess = (e.cargo.toxins - toxCap * 0.68) / Math.max(1, toxCap);
      e.hp -= (1.8 + 9.5 * toxExcess) * toxExcess * dt;
      e.hit = Math.max(e.hit, 0.045);
    }

    // Vertical ecology: biomass is weight; oxygen vacuoles turn internal O2 into lift. This applies to all bodies.
    const sink = biomassWeight(e) - buoyancy(e) - orgCount(e, 'flagella') * ORGANELLES.flagella.stats.lift * 0.18;
    e.vy += clamp(sink * 0.026, -8, 22) * dt;

    if (e.incubating) updateEucharistIncubation(world, e, dt);

    const massBurden = 1 + (e.cargo.biomass || 0) / Math.max(8, caps(e).biomass) * 0.55 + Object.values(e.organelles || {}).reduce((a,b)=>a+b,0) * 0.012;
    const upkeep = (e.controller === 'algae' ? 0.048 : 0.046) * massBurden * dt;
    e.cargo.energy = Math.max(0, (e.cargo.energy || 0) - upkeep);
    if ((e.cargo.energy || 0) <= 0.01 && (e.cargo.biomass || 0) <= 0.03) hurt(world, e, caps(e).hp + 10, 'energy_biomass_collapse');
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
    if (e.kind === 'player' && world.cellLibrary) {
      world.cellLibrary.push(snapshotCell(e, world));
    }
    world.events.push({ type: 'eucharist_complete', entityId: e.id });
  }
}

function classifyBlueprint(orgs, n) {
  const flagella  = (orgs.flagella || 0);
  const combat    = (orgs.rasping_lamella || 0) + (orgs.lance_bristle || 0) + (orgs.toxin_launcher || 0);
  const storage   = (orgs.storage_vacuole || 0) + (orgs.exotic_vacuole || 0);
  const armor     = (orgs.membrane_hardening || 0) + (orgs.lipid_repair_loom || 0);
  const scores    = { motile: flagella * 2, combat: combat * 2.5, cargo: storage, armored: armor * 2 };
  const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  if (top[1] < 2) return `Archive Cell ${n}`;
  if (top[0] === 'motile')  return 'Motile Swimmer';
  if (top[0] === 'combat')  return (orgs.toxin_launcher || 0) >= 1 ? 'Toxic Lancer' : 'Combat Form';
  if (top[0] === 'cargo')   return 'Cargo Cell';
  if (top[0] === 'armored') return 'Armored Form';
  return `Archive Cell ${n}`;
}

function snapshotCell(entity, world) {
  const n = world.cellLibrary.length + 1;
  return {
    id: id('bp'),
    label: classifyBlueprint(entity.organelles, n),
    organelles: { ...entity.organelles },
    capturedAt: world.t
  };
}

function attachColonyCell(player, blueprint) {
  const maxHp = 60 + (blueprint.organelles.membrane || 0) * 30;
  const r = clamp(16 + (blueprint.organelles.storage_vacuole || 0) * 2, 12, 32);
  player.colony.push({
    id: blueprint.id,
    label: blueprint.label,
    organelles: { ...blueprint.organelles },
    r, hp: maxHp, maxHp
  });
  player.r = Math.min(player.r + r * 0.6, player.baseR + 28);
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


function applyActiveActionCosts(world, dt) {
  for (const e of world.entities) {
    if (!e.alive) continue;
    if (e.action === 'rasp' && hasOrg(e, 'rasping_lamella')) {
      const st = ORGANELLES.rasping_lamella.stats;
      const count = orgCount(e, 'rasping_lamella');
      // Rasping costs are paid once per body per tick, not once per target.
      // Small bodies are efficient grazers; large bodies are better served by lances.
      const sizeFactor = 0.42 + Math.pow(Math.max(8, e.r) / 32, 1.18);
      const cost = st.energyCost * count * sizeFactor * dt;
      if ((e.cargo.energy || 0) >= cost) e.cargo.energy -= cost;
      else { e.cargo.energy = 0; e.action = null; }
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
  // Lances are impact organs, not laser beams. Drift contact should barely hurt;
  // dash-speed impacts should punch far above steady swimming.
  const speedFactor = clamp((impactSpeed - (st.speedFloor || 0)) / st.speedScale, 0, 3.2);
  const dmg = st.damage * count * reachFraction * alignment * speedFactor * vulnerability(target) * dt;
  if (dmg <= 0) return;
  const hardness = membraneHardness(target);
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
  }
  if (dps <= 0) return;
  const facing = { x: Math.cos(attacker.phase), y: Math.sin(attacker.phase) };
  const alignment = clamp((facing.x * nx + facing.y * ny + 1.15) / 2.15, 0.25, 1.0);
  const hardness = membraneHardness(target);
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
  entity.cooldowns ||= {};
  if ((entity.cooldowns.toxinLauncher || 0) > 0) return false;
  if (!hasEnergy(entity, o.energyCost) || (entity.cargo.toxins || 0) < o.toxinCost) return false;
  entity.cargo.toxins -= o.toxinCost;
  entity.cargo.energy -= o.energyCost;
  entity.cooldowns.toxinLauncher = o.cooldown;
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
  if (amount > 0) {
    entity.hit = 0.18;
    if (entity.colony && entity.colony.length > 0) {
      for (let i = entity.colony.length - 1; i >= 0; i--) {
        const seg = entity.colony[i];
        seg.hp = Math.max(0, seg.hp - amount * 0.4);
        if (seg.hp <= 0) {
          entity.colony.splice(i, 1);
          entity.r = Math.max(entity.baseR, entity.r - seg.r * 0.6);
          world.events.push({ type: 'colony_segment_lost', label: seg.label });
        }
      }
    }
  }
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
        r: 22, color: '#86d2ff', controller: 'human', trophicRole: 'anaerobic_scavenger', depthHome: WORLD.nurseryTop + 230,
        cargo: { biomass: 5, lipids: 4, energy: 18, toxins: 3, spores: 0, enzymes: 0, crystals: 0, dna: 0 }, organelles: { membrane: 1, basal_motility: 1, membrane_intake: 1, anaerobic_processor: 1, storage_vacuole: 1, exotic_vacuole: 1, dna_memory_vesicle: 1 }, oxygen: oxygenAt(Math.max(WORLD.nurseryTop, e.y - 160)), grace: 2.0
      });
      if (hasOrg(e, 'eucharist_archive')) {
        next.organelles.eucharist_archive = 1;
        next.colony = e.colony ? e.colony.map(s => ({ ...s })) : [];
      }
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
    // DNA can exist before mitochondria; the Eucharist asks for one deep record.
    // It remains scarce because it only appears from deep rupture events and still
    // requires a DNA Memory Vesicle to carry.
    if (player && deep > 1800 && (e.controller === 'protozoan' || e.controller === 'predator' || e.controller === 'algae') && world.rng() < (hasMito(player) ? 0.95 : 0.46)) {
      spawnParticle(world, 'dna', e.x, e.y, e.controller === 'protozoan' ? 2 : 1);
    }
  }
}

function spawnTick(world, dt) {
  world.spawn.algae -= dt; world.spawn.npc -= dt; world.spawn.exotic -= dt;
  if (world.spawn.algae <= 0 && world.entities.filter(e => e.controller === 'algae').length < 30) {
    world.spawn.algae = rand(world, 0.65, 1.35);
    const mature = world.rng() < 0.38;
    const falling = world.rng() < 0.18;
    spawnAlgae(world, mature ? { mature: true, fallState: falling ? 'sinking' : null, y: falling ? WORLD.nurseryTop + rand(world, 120, 560) : undefined } : {});
  }
  if (world.spawn.npc <= 0 && world.entities.length < 98) {
    world.spawn.npc = rand(world, 1.0, 2.2);
    const r = world.rng();
    if (r < 0.44) spawnScavenger(world);
    else if (r < 0.88) spawnPredator(world);
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
    r, color: '#7ee96f', controller: 'algae', trophicRole: 'photosynthetic_bloom', depthHome: WORLD.canopy + 160,
    organelles: { membrane: mature ? 2 : 1, anaerobic_processor: 1, photosystem: 1 + (mature ? 2 : 0), oxygen_tolerance: mature ? 5 : 3, oxygen_vacuole: mature ? 3 : 1, flagella: mature ? 0 : 1, membrane_hardening: mature ? 3 : 1, storage_vacuole: mature ? 8 : 4, exotic_vacuole: 1 },
    cargo: { biomass, lipids: rand(world, 8, 26), energy: rand(world, 8, 24), toxins: 0 },
    oxygen: oxygenAt(y) * 0.55,
    ruptureThreshold: mature ? 0.55 : 0.35, biomassMass: biomass, fallState: opts.fallState || null
  });
  world.entities.push(e);
  return e;
}

function spawnScavenger(world, opts = {}) {
  const y = opts.y ?? (WORLD.nurseryTop + rand(world, 0, 580));
  const x = opts.x ?? rand(world, 0, WORLD.w);
  const hp = rand(world, 28, 45);
  const e = makeSoftBody(world, 'npc', x, y, {
    r: rand(world, 11, 18), color: '#8ef19e', controller: 'scavenger', trophicRole: 'anaerobic_scavenger', depthHome: y,
    organelles: { membrane: 1, basal_motility: 1, membrane_intake: 1, anaerobic_processor: 1, storage_vacuole: 1, exotic_vacuole: 1 }, cargo: { biomass: rand(world, 2, 12), energy: rand(world, 5, 18), lipids: rand(world, 0, 6) }, oxygen: oxygenAt(y)
  });
  world.entities.push(e); return e;
}

function spawnPredator(world, opts = {}) {
  const y = opts.y ?? (WORLD.ruptureTop + rand(world, 0, 1150));
  const x = opts.x ?? rand(world, 0, WORLD.w);
  const hp = rand(world, 78, 130);
  const e = makeSoftBody(world, 'npc', x, y, {
    r: rand(world, 22, 34), color: '#ff7897', controller: 'predator', trophicRole: 'rupture_predator', depthHome: y,
    organelles: { membrane: 2, anaerobic_processor: 3, flagella: 1, rasping_lamella: 1, storage_vacuole: 4, exotic_vacuole: 1, membrane_hardening: 1 }, cargo: { biomass: rand(world, 24, 44), energy: rand(world, 34, 68), lipids: rand(world, 10, 30) }, oxygen: oxygenAt(y),
    ruptureThreshold: 0.48
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
    r: rand(world, 34, 52), color: '#d892ff', controller: 'protozoan', trophicRole: 'deep_predator', depthHome: y,
    organelles: { membrane: 3, anaerobic_processor: 3, flagella: 1, rasping_lamella: 1, toxin_launcher: 1, mitochondrion: 1, lance_bristle: 1, storage_vacuole: 6, exotic_vacuole: 2, dna_memory_vesicle: 2, membrane_hardening: 2 }, cargo: { biomass: rand(world, 40, 78), energy: rand(world, 70, 120), lipids: rand(world, 24, 58), toxins: rand(world, 4, 18) }, oxygen: oxygenAt(y),
    ruptureThreshold: 0.65
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
    const weak = other.hp / Math.max(1, caps(other).hp) < 0.55 ? 1.3 : 0;
    const score = fallingValue + sizeValue * 1.2 + weak - d / 280 - Math.abs(other.y - entity.depthHome) / 1150;
    if (score > bestScore) { best = other; bestScore = score; }
  }
  return best;
}

function feedFromFields(world, entity, dt) {
  const radius = feedRadius(entity);
  const rate = feedRate(entity);
  if (radius <= 0 || rate <= 0) return 0;
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
  // Exotics and DNA are not coins. They are discrete matter/information
  // particles that must be deliberately ingested while feeding, and they
  // remain in the world if the matching storage organ is full.
  if (!entity.feedIntent || feedingOrgCount(entity) <= 0) return 0;
  let collected = 0;
  const radius = feedRadius(entity);
  for (let i = world.particles.length - 1; i >= 0; i--) {
    const p = world.particles[i];
    if (dist2Wrap(entity.x, entity.y, p.x, p.y) > radius * radius) continue;
    if (entity.kind !== 'player' && p.kind === 'dna') continue;
    const cap = caps(entity)[p.kind] ?? 0;
    const room = cap - (entity.cargo[p.kind] || 0);
    if (room + 1e-9 < p.value) continue;
    entity.cargo[p.kind] = (entity.cargo[p.kind] || 0) + p.value;
    if (p.kind === 'dna') world.stats.dnaRead += p.value;
    world.events.push({ type: 'particle', entityId: entity.id, kind: p.kind, value: p.value });
    world.particles.splice(i, 1);
    collected += p.value;
  }
  return collected;
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
  const actions = [];
  if (orgCount(e, 'basal_motility') > 0 || orgCount(e, 'flagella') > 0) actions.push({ id: 'move', label: 'Swim', enabled: powered });
  if (feedingOrgCount(e) > 0) actions.push({ id: 'feed', label: 'Feed', enabled: powered });
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
  const activeColony = (e.colony || []).length;
  const staticOfferings = OFFERINGS.map(o => {
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
  const deployCost = { dna: 1, biomass: 32, energy: 20 };
  const attachOfferings = (world.cellLibrary || []).map(bp => {
    const alreadyAttached = (e.colony || []).some(s => s.id === bp.id);
    const tooMany = activeColony >= 3;
    const noMito = !hasMito(e);
    const affordable = hasStock(e.cargo, deployCost);
    const locked = noMito || !affordable || tooMany || alreadyAttached;
    const reasons = [];
    if (noMito) reasons.push('requires mitochondrial Eucharist');
    if (tooMany) reasons.push('colony full — max 3 cells');
    if (alreadyAttached) reasons.push('already part of your body');
    if (!affordable) reasons.push(`needs ${fmtStock(missingStock(e.cargo, deployCost))}`);
    const orgSummary = Object.entries(bp.organelles).filter(([, v]) => v > 0)
      .map(([k, v]) => v > 1 ? `${k}×${v}` : k).join(', ');
    return {
      id: `attach_${bp.id}`, section: 'Tier 3 - DNA information', kind: 'colony',
      name: `Attach: ${bp.label}`,
      desc: `Fuse your archived ${bp.label} to your body. Organs: ${orgSummary}`,
      cost: deployCost, costText: fmtStock(deployCost),
      locked, affordable, reasons, tier3: true, owned: false, maxed: false, readiness: null
    };
  });
  return [...staticOfferings, ...attachOfferings];
}

function missingStock(cargo, cost = {}) { const m = {}; for (const [k, v] of Object.entries(cost)) if (k !== 'oxygen' && (cargo[k] || 0) < v) m[k] = v - (cargo[k] || 0); return m; }

export function buyOffering(world, offeringId, entityId = world.playerId) {
  const entity = world.entities.find(x => x.id === entityId);
  if (!entity) return { ok: false, reason: 'missing entity' };
  if (offeringId.startsWith('attach_')) {
    const blueprintId = offeringId.slice(7);
    const blueprint = (world.cellLibrary || []).find(b => b.id === blueprintId);
    if (!blueprint) return { ok: false, reason: 'blueprint not found' };
    if ((entity.colony || []).some(s => s.id === blueprint.id)) return { ok: false, reason: 'already part of your body' };
    if ((entity.colony || []).length >= 3) return { ok: false, reason: 'colony full — max 3 cells' };
    const deployCost = { dna: 1, biomass: 32, energy: 20 };
    if (!hasStock(entity.cargo, deployCost)) return { ok: false, reason: `needs ${fmtStock(missingStock(entity.cargo, deployCost))}` };
    subStock(entity.cargo, deployCost);
    attachColonyCell(entity, blueprint);
    world.events.push({ type: 'buy', entityId, offeringId });
    return { ok: true, offeringId };
  }
  const offering = OFFERINGS.find(o => o.id === offeringId);
  if (!offering) return { ok: false, reason: 'missing offering' };
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
    if (offering.organelle === 'multicell_chassis') { entity.r += 8; entity.hp = Math.min(caps(entity).hp, entity.hp + 70); }
  }
  clampCargo(entity);
  world.events.push({ type: 'buy', entityId, offeringId });
  return { ok: true, offeringId };
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
    resources: RESOURCES.map(r => ({ id: r, label: r === 'energy' ? 'ATP' : r, value: e.cargo[r] || 0, max: c[r] ?? 99, color: COLORS[r] || '#fff' })),
    organelles: Object.entries(e.organelles).map(([id, count]) => ({ id, count, name: ORGANELLES[id]?.name || id, tier: ORGANELLES[id]?.tier || 1, action: ORGANELLES[id]?.action || null })),
    graphStats: { caps: c, hpSource: 'Cell Membrane count × membrane HP + graph armor/chassis', storageSource: 'Storage Vacuole / Exotic Vesicle Rack / DNA Memory Vesicle counts' },
    metabolism: { anaerobicProcessorLevel: orgCount(e, 'anaerobic_processor'), anaerobicRate: orgCount(e, 'anaerobic_processor') * ORGANELLES.anaerobic_processor.stats.rate, energyStarved: (e.cargo.energy || 0) <= 0.01 },
    actions: getAvailableActions(world, entityId),
    nearYuki: nearYuki(world, e),
    tier: hasMito(e) ? 3 : 2,
    hostReadiness: readiness,
    incubating: e.incubating ? { ...e.incubating } : null,
    objective: objectiveText(world, e),
    cellLibrary: world.cellLibrary || [],
    colony: (e.colony || []).map(s => ({ label: s.label, hp: s.hp, maxHp: s.maxHp, r: s.r }))
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
  if (!hasOrg(e, 'lipid_repair_loom')) return 'Anaerobic scavenger: field feeding and default anaerobic processing. You have no attack yet; ATP gates every action. Scavenge rupture edges and return to Yuki for Tier 2 organs.';
  const lib = world.cellLibrary || [];
  if (!hasMito(e)) {
    if (lib.length > 0) return `Second form. Build a specialized body — your archived ${lib[lib.length - 1].label} awaits attachment at Yuki.`;
    return 'Build host-worthiness from repair, exotics, one DNA record, and depth survival. Mitochondria are not bought.';
  }
  if (lib.length === 0) {
    if ((e.cargo.dna || 0) < 3) return 'Mitochondria online. Oxygen and lipids are power; deep ruptures now shed DNA information.';
    if (!hasOrg(e, 'eucharist_archive')) return 'Return to Yuki with DNA to open the Eucharist Archive.';
    return 'Archive online. Your form will be preserved at the next Eucharist.';
  }
  const colony = e.colony || [];
  if (colony.length >= 3) return 'Colony complete. Lead your composite organism into the deep.';
  if (lib.length === 1) return 'Form archived. Attach your legacy at Yuki\'s chamber, or die to begin your second specialization.';
  if (lib.length >= 2) return 'Colony growing. Attach your preserved forms to build a multicellular body.';
  return 'Archive online. Your form will be preserved at the next Eucharist.';
}

export function getRenderProjection(world) {
  const entityProjection = world.entities.map(e => ({ id: e.id, kind: e.kind, x: e.x, y: e.y, vx: e.vx, vy: e.vy, r: e.r, hp: e.hp, maxHp: caps(e).hp, color: e.color, controller: e.controller, trophicRole: e.trophicRole, friendly: e.friendly, phase: e.phase, feedIntent: e.feedIntent, repairIntent: e.repairIntent, action: e.action, organelles: { ...e.organelles }, hit: e.hit, oxygen: e.oxygen, oxygenTolerance: oxygenTolerance(e), toxins: e.cargo.toxins || 0, toxinCap: caps(e).toxins, fallState: e.fallState, incubating: e.incubating ? { ...e.incubating } : null }));
  const colonyRender = [];
  for (const e of world.entities) {
    if (!e.colony || !e.colony.length) continue;
    for (let i = 0; i < e.colony.length; i++) {
      const seg = e.colony[i];
      const ang = (i / e.colony.length) * Math.PI * 2;
      const dist = e.r + seg.r + 4;
      colonyRender.push({
        id: seg.id, kind: 'colony_segment',
        x: e.x + Math.cos(ang) * dist, y: e.y + Math.sin(ang) * dist,
        vx: 0, vy: 0, r: seg.r, hp: seg.hp, maxHp: seg.maxHp,
        color: '#7fffe0', controller: 'colony', trophicRole: 'colony',
        friendly: true, phase: 0, feedIntent: false, repairIntent: false,
        action: null, organelles: {}, hit: 0, oxygen: 0, oxygenTolerance: 0,
        toxins: 0, toxinCap: 0, fallState: null, incubating: null
      });
    }
  }
  return {
    version: VERSION,
    world: WORLD,
    t: world.t,
    environment: { oxygenSurface: oxygenAt(WORLD.canopy + 30), oxygenNursery: oxygenAt(WORLD.nurseryTop + 100), lightSurface: lightAt(WORLD.canopy + 30) },
    entities: [...entityProjection, ...colonyRender],
    fields: world.fields.map(f => ({ id: f.id, x: f.x, y: f.y, radius: f.radius, stock: { ...f.stock }, density: f.density, sourceKind: f.sourceKind, age: f.age, maxAge: f.maxAge })),
    hazards: world.hazards.map(h => ({ id: h.id, kind: h.kind, x: h.x, y: h.y, vx: h.vx, vy: h.vy, radius: h.radius, age: h.age, maxAge: h.maxAge, color: h.color })),
    particles: world.particles.map(p => ({ id: p.id, kind: p.kind, x: p.x, y: p.y, value: p.value, color: p.color, age: p.age, maxAge: p.maxAge })),
    events: world.events.slice()
  };
}


export function killPlayer(world) {
  const player = getPlayer(world);
  if (!player || !player.alive) return { ok: false, reason: 'no living player' };
  hurt(world, player, caps(player).hp + 999, 'self_lysis');
  return { ok: true };
}

export function getDebugProjection(world) {
  const p = getPlayer(world);
  return { version: VERSION, entityCount: world.entities.length, fieldCount: world.fields.length, hazardCount: world.hazards.length, particleCount: world.particles.length, playerCargo: p ? { ...p.cargo } : null, playerOrgans: p ? { ...p.organelles } : null, playerOxygen: p ? p.oxygen : null, readiness: p ? hostReadiness(p) : null, stats: { ...world.stats } };
}

export const __test = { clamp, wrapX, dxWrap, distWrap, feedFromFields, repairFromLipids, caps, fmtStock, hasStock, spawnScavenger, spawnAlgae, spawnPredator, speedOf, feedRadius, feedRate, feedingOrgCount, totalMatter, oxygenTolerance, membraneHardness, membranePorosity, hostReadiness, biomassWeight, buoyancy, classifyBlueprint, snapshotCell, attachColonyCell, colonyOrgs };
