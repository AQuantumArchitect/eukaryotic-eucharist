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

// The player begins and respawns in Yuki's tendrils at the top of the canopy.
const YUKI_SPAWN = Object.freeze({ x: WORLD.w / 2, y: WORLD.canopy + 60 });

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

// Exotic organelles are discovered by harvesting DNA from mutated enemy strains.
// The DNA particle's color tells you the *category* of trait it unlocks, so a
// diver learns to recognize prey by the color of the information they shed.
const DNA_CATEGORY_COLORS = Object.freeze({
  metabolic: '#ffb84d',
  lance: '#ff3d9a',
  rasp: '#ff7a3d',
  launcher: '#b06dff',
  leech: '#8fe37a',
  aura: '#ff5a5a',
  control: '#6fd6ff',
  risk: '#ff2d7a',
  execute: '#ff8a3d',
  projectile: '#4db8ff',
  orbital: '#ffd24d',
  swarm: '#5fe0a0',
  feed: '#8ef19e',
  guard: '#bfe8ff',
  burst: '#c9a0ff'
});

// Each species carries a pool of mutant strains. A strain grafts one signature
// exotic organelle, tints the body, and (on death) sheds DNA tagged with that
// organelle's id — the discovery key. Adding a new enemy variant is one row here
// plus one ORGANELLES entry plus one gated OFFERINGS entry: no infra changes.
const STRAINS = Object.freeze({
  algae: [
    { org: 'lipogenic_processor', tint: '#c9e86f' },
    { org: 'lipid_repair_loom', tint: '#4fbf6f' },
    { org: 'cytostome', tint: '#8ef19e' },
    { org: 'enzyme_reserve', tint: '#ffb84d' }
  ],
  predator: [
    { org: 'virulent_processor', tint: '#ff6a4d' },
    { org: 'velocity_lance', tint: '#ff3d9a' },
    { org: 'siphon_rasp', tint: '#c0304f' },
    { org: 'spore_jet', tint: '#c9a0ff' }
  ],
  protozoan: [
    { org: 'catalytic_processor', tint: '#7fe0d0' },
    { org: 'clean_processor', tint: '#c8b6ff' },
    { org: 'saw_lance', tint: '#9a8fb0' },
    { org: 'leech_rasp', tint: '#8fe37a' },
    { org: 'leech_lance', tint: '#6fce8f' },
    { org: 'rupture_auger', tint: '#ff3d9a' },
    { org: 'adrenal_vesicle', tint: '#ff2d7a' },
    { org: 'thorn_coat', tint: '#ff6a6a' },
    { org: 'corrosive_pellicle', tint: '#ff5a5a' },
    { org: 'discharge_vesicle', tint: '#ffe86f' },
    { org: 'cryo_vesicle', tint: '#8fd6ff' },
    { org: 'chemotaxis_cilia', tint: '#6fd6ff' },
    { org: 'phagocyte_maw', tint: '#ff8a3d' },
    { org: 'necrosis_gland', tint: '#c88a4d' },
    { org: 'volatile_vacuole', tint: '#ff4d6a' },
    { org: 'seeker_gland', tint: '#4db8ff' },
    { org: 'harpoon_spine', tint: '#3d9aff' },
    { org: 'neuro_barb', tint: '#6faaff' },
    { org: 'orbital_spores', tint: '#ffd24d' },
    { org: 'fission_bud', tint: '#ffc24d' },
    { org: 'spore_toxin_launcher', tint: '#b06dff' },
    { org: 'crystal_ward', tint: '#bfe8ff' },
    { org: 'toxin_cloud', tint: '#b06dff' }
  ]
});
// Deep protozoans are the most mutated: half spawn as a strain, drawn from a large
// pool, so the deep froth is a churning mix of exotic genomes to hunt and harvest.
const STRAIN_CHANCE = Object.freeze({ algae: 0.18, predator: 0.28, protozoan: 0.5 });

// Every processor is one biomass→ATP flow with its own yield and toxic-waste
// signature; they coexist and stack. A body's metabolic character is the sum of
// which processors it carries. Lipogenic runs backwards and is handled separately.
const PROCESSORS = Object.freeze(['anaerobic_processor', 'clean_processor', 'virulent_processor', 'catalytic_processor']);
// Forward spines share one impact model; each type tunes damage, reach, and how
// hard it ramps with speed. Saw lances pin speed out entirely for flat grind.
const LANCES = Object.freeze(['lance_bristle', 'velocity_lance', 'saw_lance', 'leech_lance', 'rupture_auger']);
const RASP_ORGANS = Object.freeze(['rasping_lamella', 'siphon_rasp', 'leech_rasp']);
// ── Symbiotic colony: independent friendly cells ────────────────────────────
// The cheap, accessible alternative to becoming multicellular. A Multicell Chassis
// fuses archived cells INTO your body and needs the mitochondrial Eucharist; a
// symbiont is its own small cell that swims beside you and fights on your side —
// expendable, bought for plain matter, no Eucharist required. Buy a few and you are
// a swarm; graft the chassis and you are one large organism. Two different answers
// to "stop being alone in the froth."
const COMPANION_CAP = 6; // hard ceiling; the real cap scales with Pheromone Gland count (swarmCap)
const JUNK_DNA_BIOMASS = 10; // biomass yielded per non-upgrade (junk) DNA record when sequenced
const COMPANIONS = Object.freeze({
  grazer: {
    label: 'Grazer Swarm', color: '#8ef1c0', r: 13, bodyPlan: 'blob',
    organelles: { membrane: 1, basal_motility: 1, membrane_intake: 1, anaerobic_processor: 2, rasping_lamella: 1, storage_vacuole: 2, oxygen_tolerance: 3 },
    cargo: { energy: 28, biomass: 16, lipids: 3 }
  },
  lancer: {
    label: 'Lancer Swarm', color: '#9fd0ff', r: 16, bodyPlan: 'spiny',
    organelles: { membrane: 2, basal_motility: 1, flagella: 1, membrane_intake: 1, anaerobic_processor: 2, lance_bristle: 1, storage_vacuole: 2, membrane_hardening: 1, oxygen_tolerance: 3 },
    cargo: { energy: 46, biomass: 22, lipids: 8 }
  },
  hunter: {
    label: 'Toxic Swarm', color: '#c9a2ff', r: 19, bodyPlan: 'jelly',
    organelles: { membrane: 2, basal_motility: 1, flagella: 1, membrane_intake: 1, anaerobic_processor: 3, toxin_launcher: 1, rasping_lamella: 1, storage_vacuole: 3, exotic_vacuole: 1, oxygen_tolerance: 4 },
    cargo: { energy: 62, biomass: 28, lipids: 10, toxins: 16 }
  }
});

// Deep bodies: a body-plan tag drives a distinct silhouette in the renderer so the
// deep stops being a field of identical blobs. Deep strains inherit a plan from
// their signature organelle's category; wild deep cells default to a ciliate.
const DEEP_BODY_BY_CATEGORY = Object.freeze({
  lance: 'spiny', risk: 'spiny', rasp: 'amoeba', leech: 'amoeba', metabolic: 'ciliate',
  launcher: 'jelly', aura: 'jelly', control: 'jelly', execute: 'maw',
  projectile: 'ciliate', orbital: 'radial'
});

// Exotics are not just graft-currency — they are combustible verbs. Each one fuels
// an active (or automatic) ability that rides an organelle you already carry, so
// spending spores/enzymes/crystals is a moment-to-moment tactical choice.
const CONSUMABLES = Object.freeze({
  bloomDash: { spore: 1, impulseMult: 1.6, cloudRadius: 74, cloudDamage: 14, cloudAge: 2.0 }, // spores: dash → burst + spore cloud
  engulf: { enzyme: 1, energyCost: 2, sizeRatio: 1.15, hpFrac: 0.6, cooldown: 1.0, biomassBase: 10, biomassPerR: 1.2 }, // enzymes: instakill-digest
  ward: { crystal: 1, energyCost: 3, dur: 5.0, hardness: 0.5, reflect: 0.5, cooldown: 6.0 }, // crystals: armor + reflect + pierce
  surge: { enzyme: 1, threshold: 0.12, convert: 18, efficiency: 3.6, cooldown: 5.0 } // enzymes: auto emergency biomass→ATP
});

// Organelles that express an individually-rolled potency (see potency() / applyStrain).
// Each mutant that carries one of these rolls its own multiplier when it spawns.
const VARIABLE_ORGANS = Object.freeze(['lipid_repair_loom', 'clean_processor', 'virulent_processor', 'lipogenic_processor', 'catalytic_processor', 'velocity_lance', 'saw_lance', 'siphon_rasp', 'spore_toxin_launcher', 'leech_rasp', 'leech_lance', 'rupture_auger', 'adrenal_vesicle', 'thorn_coat', 'corrosive_pellicle', 'discharge_vesicle', 'cryo_vesicle', 'chemotaxis_cilia', 'phagocyte_maw', 'necrosis_gland', 'volatile_vacuole', 'seeker_gland', 'harpoon_spine', 'neuro_barb', 'orbital_spores', 'fission_bud', 'pheromone_gland']);

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
    name: 'Cytostome Bloom', tier: 2, action: 'feed', stackable: true, max: 5, category: 'feed',
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
    name: 'Lipid Repair Loom', tier: 3, action: 'repair', stackable: true, max: 5, category: 'metabolic',
    desc: 'A discovered repair organ. Consumes lipids and ATP to stitch the membrane. Harvested from the DNA of resilient, self-mending cells.',
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
    stats: { toxinCost: 2.4, energyCost: 2.6, projectileSpeed: 580, projectileDamage: 28, splashDamage: 17, splashRadius: 38, splashAge: 0.95, toxinCapBonus: 18, cooldown: 0.62 }
  },
  toxin_cloud: {
    name: 'Toxin Cloud Gland', tier: 2, action: 'cloud', stackable: true, max: 3, category: 'launcher',
    desc: 'Local toxic vent. Requires Toxic Launcher. Count increases available venting hardware.',
    stats: { radius: 74, toxinCost: 7, energyCost: 6 }
  },
  dash_vacuole: {
    name: 'Dash Vacuole', tier: 2, action: 'dash', stackable: true, max: 4,
    desc: 'One burst organ. More dash vacuoles reduce recovery and increase burst capacity through count.',
    stats: { impulse: 310, energyCost: 8 }
  },
  clean_processor: {
    name: 'Purified Processor', tier: 3, action: null, stackable: true, max: 6, category: 'metabolic',
    desc: 'A refined anaerobic flow discovered in efficient deep cells: biomass becomes ATP with almost no toxic waste, at a slightly lower yield.',
    stats: { rate: 0.40, energyPerBiomass: 2.85, toxinPerBiomass: 0.03 }
  },
  virulent_processor: {
    name: 'Virulent Processor', tier: 3, action: null, stackable: true, max: 6, category: 'metabolic',
    desc: 'A hot anaerobic flow harvested from venomous hunters: more ATP and more throughput, but it floods the body with toxin waste — ammunition, if you can hold it.',
    stats: { rate: 0.52, energyPerBiomass: 3.65, toxinPerBiomass: 0.24 }
  },
  lipogenic_processor: {
    name: 'Lipogenic Processor', tier: 3, action: null, stackable: true, max: 5, category: 'metabolic',
    desc: 'Runs metabolism in reverse: spends biomass and a little ATP to synthesize lipid reserves. Self-sufficient mitochondrial fuel, discovered in oily cells.',
    stats: { rate: 0.34, lipidPerBiomass: 0.62, energyCost: 0.9, biomassPerSecond: 0.55 }
  },
  catalytic_processor: {
    name: 'Catalytic Processor', tier: 3, action: null, stackable: true, max: 6, category: 'metabolic',
    desc: 'An enzyme-accelerated anaerobic flow. Stored enzymes act as catalyst — the more you carry, the faster it runs — consuming a trickle as it works.',
    stats: { rate: 0.30, energyPerBiomass: 3.2, toxinPerBiomass: 0.09, enzymeBoost: 0.85, enzymeDrain: 0.02 }
  },
  velocity_lance: {
    name: 'Velocity Lance', tier: 3, action: null, stackable: true, max: 6, category: 'lance',
    desc: 'A charge spine harvested from swift hunters. Almost harmless at a drift, brutal at dash speed — damage ramps hard with impact velocity.',
    stats: { damage: 16, length: 52, rupturePower: 0.9, alignmentFloor: 0.34, speedScale: 95, speedFloor: 40, speedCap: 4.4 }
  },
  saw_lance: {
    name: 'Saw Lance', tier: 3, action: null, stackable: true, max: 6, category: 'lance',
    desc: 'A grinding blade from deep predators. Flat, reliable damage regardless of speed, and it bites from wider angles — but it never spikes.',
    stats: { damage: 30, length: 44, rupturePower: 1.05, alignmentFloor: 0.12, flat: true }
  },
  siphon_rasp: {
    name: 'Siphon Rasp', tier: 3, action: 'rasp', stackable: true, max: 5, category: 'rasp',
    desc: 'A parasitic shredding membrane. While rasping, it drains a share of the victim\'s biomass and lipids straight into your cargo.',
    stats: { dps: 10.5, energyCost: 2.2, vulnerabilityBonus: 0.16, rupturePower: 0.72, stealFraction: 0.5 }
  },
  spore_toxin_launcher: {
    name: 'Sporo-Toxic Launcher', tier: 3, action: 'sporeshot', stackable: true, max: 3, category: 'launcher',
    desc: 'A combination armament: packs toxins and spores into one heavy glob that hits harder, splashes wider, and leaves a lingering spore-toxin cloud.',
    stats: { toxinCost: 3.0, sporeCost: 1, energyCost: 5.0, projectileSpeed: 540, projectileDamage: 44, splashDamage: 26, splashRadius: 58, splashAge: 1.6, toxinCapBonus: 14, cooldown: 0.9 }
  },
  leech_rasp: {
    name: 'Leech Lamella', tier: 3, action: 'rasp', stackable: true, max: 5, category: 'leech',
    desc: 'A parasitic feeding membrane. Deals almost no damage, but while rasping it siphons biomass and lipids straight out of the host — the algae-parasite\'s core organ.',
    stats: { dps: 2.5, energyCost: 1.4, vulnerabilityBonus: 0.12, rupturePower: 0.40, leechRate: 9.0 }
  },
  leech_lance: {
    name: 'Leech Proboscis', tier: 3, action: null, stackable: true, max: 6, category: 'leech',
    desc: 'A feeding spine. Its jab barely wounds, but on contact it draws biomass and lipids at range — parasitize prey without killing it.',
    stats: { damage: 4, length: 50, rupturePower: 0.40, alignmentFloor: 0.30, flat: true, leechRate: 7.0 }
  },

  // ── Deep-predator strains (survivor-like exotic organelles) ────────────────
  rupture_auger: {
    name: 'Rupture Auger', tier: 3, action: null, stackable: true, max: 6, category: 'lance',
    desc: 'A drilling spine that ignores membrane hardness entirely — carves through the toughest deep armor as if it were slurry.',
    stats: { damage: 20, length: 46, rupturePower: 2.0, alignmentFloor: 0.30, speedScale: 120, speedFloor: 30, pierce: true }
  },
  adrenal_vesicle: {
    name: 'Adrenal Vesicle', tier: 3, action: null, stackable: true, max: 4, category: 'risk',
    desc: 'A stress gland. The closer to death you swim, the harder and faster you strike — up to double when the membrane is nearly ruptured.',
    stats: { maxBonus: 1.0, threshold: 0.6 }
  },
  thorn_coat: {
    name: 'Thorn Coat', tier: 3, action: null, stackable: true, max: 5, category: 'aura',
    desc: 'A spined pellicle. A share of any damage dealt to you is driven straight back into whatever touched you.',
    stats: { reflect: 0.40 }
  },
  corrosive_pellicle: {
    name: 'Corrosive Pellicle', tier: 3, action: null, stackable: true, max: 5, category: 'aura',
    desc: 'An acidic skin. Anything sharing your space dissolves a little each moment — no action required, just overlap.',
    stats: { dps: 8.0 }
  },
  discharge_vesicle: {
    name: 'Discharge Vesicle', tier: 3, action: null, stackable: true, max: 4, category: 'aura',
    desc: 'An electric organ that periodically shocks every body around you, spending a little ATP per pulse.',
    stats: { damage: 20, radius: 92, energyCost: 3.0, cooldown: 1.6 }
  },
  cryo_vesicle: {
    name: 'Cryo Vesicle', tier: 3, action: null, stackable: true, max: 4, category: 'control',
    desc: 'A chilling organ. Anything you damage is slowed for a moment — kite the tanky deep cells to death.',
    stats: { slowMult: 0.5, dur: 1.3 }
  },
  chemotaxis_cilia: {
    name: 'Chemotaxis Cilia', tier: 3, action: null, stackable: true, max: 4, category: 'control',
    desc: 'A sensory fringe that drags nearby slurry fields and loose particles toward you — a feeding-build\'s dream vacuum.',
    stats: { radius: 220, pull: 120 }
  },
  phagocyte_maw: {
    name: 'Phagocyte Maw', tier: 3, action: null, stackable: true, max: 3, category: 'execute',
    desc: 'An engulfing morphology. Overlap a small, weakened body and it is swallowed whole — instantly rendered into biomass.',
    stats: { hpFrac: 0.20, sizeRatio: 0.85, cooldown: 0.5, biomassGain: 12 }
  },
  necrosis_gland: {
    name: 'Necrosis Gland', tier: 3, action: null, stackable: true, max: 3, category: 'execute',
    desc: 'Anything you kill ruptures into a lingering spore-toxin bloom — chain your way through a crowd.',
    stats: { radius: 72, damage: 20, age: 1.8 }
  },
  volatile_vacuole: {
    name: 'Volatile Vacuole', tier: 3, action: null, stackable: true, max: 3, category: 'risk',
    desc: 'A pressurized bladder. When you die, you detonate — a final toxin blast that takes your killers with you.',
    stats: { radius: 84, damage: 42, age: 1.2 }
  },
  seeker_gland: {
    name: 'Seeker Gland', tier: 3, action: null, stackable: true, max: 4, category: 'projectile',
    desc: 'An autonomous armament: periodically launches a slow homing spore that curves after the nearest prey. Fires itself.',
    stats: { damage: 16, energyCost: 3.0, speed: 300, turn: 3.4, cooldown: 1.2, range: 480, maxAge: 1.8 }
  },
  harpoon_spine: {
    name: 'Harpoon Spine', tier: 3, action: 'harpoon', stackable: true, max: 3, category: 'projectile',
    desc: 'A launched, tethered spine. It pierces, wounds, and hauls the struck body toward you — set up the kill.',
    stats: { damage: 20, energyCost: 4.0, speed: 640, pull: 320, cooldown: 0.85, maxAge: 0.7 }
  },
  neuro_barb: {
    name: 'Neuro-Toxin Barb', tier: 3, action: null, stackable: true, max: 3, category: 'control',
    desc: 'A neurotoxic sting. Sometimes a struck body turns and fights for you for a while before shaking it off.',
    stats: { chance: 0.22, dur: 4.0 }
  },
  orbital_spores: {
    name: 'Orbital Spore-Bodies', tier: 3, action: null, stackable: true, max: 3, category: 'orbital',
    desc: 'Daughter cells that circle you and grind anything they brush against — a constant, hands-free perimeter.',
    stats: { count: 2, damage: 16, radius: 11, orbitDist: 30, spin: 1.8 }
  },
  fission_bud: {
    name: 'Fission Bud', tier: 3, action: null, stackable: true, max: 3, category: 'orbital',
    desc: 'Each kill may bud off a short-lived allied grazer that fights at your side before dissolving back into the froth.',
    stats: { chance: 0.5, life: 12 }
  },
  nuclease_vesicle: {
    name: 'Nuclease Vesicle', tier: 2, action: null, stackable: false, max: 1,
    desc: 'A DNA-digesting organ. Any junk strand you sweep up — an untagged record, or a genome no better than one you already carry or have sequenced — is dissolved on contact into a scrap of biomass, instead of taking a slot in your DNA store. Good genomes still bank normally.',
    stats: {}
  },
  // ── Consumable-verb organs: each has one atomic function, fuelled by one exotic ──
  spore_jet: {
    name: 'Spore Jet Vesicle', tier: 2, action: null, stackable: false, max: 1, category: 'burst',
    desc: 'A propulsive sac wired to your dash. When you burst it fires a spore charge — a stronger lunge that vents a lingering spore cloud behind you. Spends one spore per dash. Requires a Dash Vacuole to fire.',
    stats: {}
  },
  phagosome: {
    name: 'Phagosome Gland', tier: 2, action: 'engulf', stackable: false, max: 1,
    desc: 'A digestive vesicle. On command it engulfs an overlapping smaller or wounded body, spending one enzyme to dissolve it whole into biomass.',
    stats: {}
  },
  crystal_ward: {
    name: 'Crystalline Ward Lattice', tier: 2, action: 'ward', stackable: false, max: 1, category: 'guard',
    desc: 'A lattice organ. Spend one crystal to sheathe the membrane for a few seconds: harder skin, reflected damage, and overcharged shots that pierce.',
    stats: {}
  },
  enzyme_reserve: {
    name: 'Enzyme Reserve Sac', tier: 2, action: null, stackable: false, max: 1, category: 'metabolic',
    desc: 'An emergency catalyst store. When ATP runs critically low it automatically spends one enzyme to flash-digest biomass into a burst of ATP.',
    stats: {}
  },
  pheromone_gland: {
    name: 'Pheromone Gland', tier: 3, action: 'mark', stackable: true, max: 2, category: 'swarm',
    desc: 'A signaling organ harvested from deep swarm-directors. It marshals a colony of allied bacteria, and paints a target with a sticky death-pheromone that your swarm converges on. Each gland conducts a larger swarm.',
    stats: { markDur: 6.0, markSpeed: 640, markMaxAge: 0.95, sporeCost: 1, energyCost: 2.5, cooldown: 1.2, deliverRate: 7.0, capPerGland: 3 }
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
  { id: 'repair', section: 'Tier 1 - Matter survival', kind: 'exchange', name: 'Repair Communion', output: 'hp', desc: 'Yuki patches your membrane with fat and a little slurry. Self-repair is Tier 2; this is external communion.', cost: { lipids: 7, biomass: 2 }, effect: { heal: 38 } },
  { id: 'buy_biomass', section: 'Tier 1 - Matter survival', kind: 'exchange', name: 'Render Lipids into Biomass', output: 'biomass', desc: 'Convert stored fat into construction slurry.', cost: { lipids: 8, energy: 3 }, gain: { biomass: 9 } },
  { id: 'buy_lipids', section: 'Tier 1 - Matter survival', kind: 'exchange', name: 'Condense Lipids', output: 'lipids', desc: 'Restock membrane fat from biomass and ATP.', cost: { biomass: 6, energy: 3 }, gain: { lipids: 8 } },
  { id: 'buy_energy', section: 'Tier 1 - Matter survival', kind: 'exchange', name: 'Charge ATP', output: 'energy', desc: 'Yuki refills ATP. No waste is mixed into the output.', cost: { biomass: 4, lipids: 2 }, gain: { energy: 10 } },
  { id: 'buy_toxins', section: 'Tier 1 - Matter survival', kind: 'exchange', name: 'Distill Toxins', output: 'toxins', desc: 'Restock toxin chemistry as a single clean tank.', cost: { biomass: 4, energy: 3 }, gain: { toxins: 7 } },
  { id: 'detox', section: 'Tier 1 - Matter survival', kind: 'exchange', name: 'Yuki Detox', output: 'detox', desc: 'Pass toxins and oxygen stress into the canopy. Not a combat vent.', cost: { energy: 4 }, effect: { detox: 14, oxygenVent: 0.20 } },

  { id: 'membrane', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Cell Membrane', desc: 'Add one explicit membrane layer: more HP, more container surface, and more oxygen volume.', cost: { biomass: 12, lipids: 8, energy: 6 }, organelle: 'membrane', stackLimit: 8 },
  { id: 'membrane_intake', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Membrane Intake Pore', desc: 'Add one more feeding pore: more field flow without inventing a new rule.', cost: { biomass: 8, lipids: 4, energy: 5 }, organelle: 'membrane_intake', stackLimit: 6 },
  { id: 'anaerobic_processor', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Anaerobic Processor', desc: 'Add one more biomass-to-ATP organ flow. More processors mean more flow and more toxin waste.', cost: { biomass: 14, lipids: 5, energy: 8, enzymes: 1 }, organelle: 'anaerobic_processor', stackLimit: 8 },
  { id: 'storage_vacuole', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Storage Vacuole', desc: 'One main tank expansion for biomass, lipids, toxins, and ATP. It visibly increases body bulk.', cost: { biomass: 10, lipids: 7, energy: 5, crystals: 1 }, organelle: 'storage_vacuole', stackLimit: 8 },
  { id: 'exotic_vacuole', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Exotic Vesicle Rack', desc: 'Each rack adds exactly one spore, one enzyme, and one crystal slot. No invisible exotic capacity exists.', cost: { biomass: 8, lipids: 4, energy: 5, spores: 1 }, organelle: 'exotic_vacuole', stackLimit: 8 },
  { id: 'dna_memory_vesicle', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'DNA Memory Vesicle', desc: 'One additional protected DNA slot. It stores information; Tier 3 decides what the information means.', cost: { biomass: 10, energy: 6, crystals: 1 }, organelle: 'dna_memory_vesicle', stackLimit: 8 },
  { id: 'nuclease_vesicle', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Nuclease Vesicle', desc: 'Digests junk DNA — untagged strands and any genome no better than one you carry or know — into biomass on pickup, keeping your DNA store free for the good stuff.', cost: { biomass: 16, energy: 8, enzymes: 1 }, organelle: 'nuclease_vesicle', stackLimit: 1 },
  { id: 'membrane_hardening', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Membrane Hardening Layer', desc: 'Tougher, less permeable skin. Good for algae armor and predator survival; slows flow a little.', cost: { biomass: 15, lipids: 11, energy: 8, crystals: 1 }, organelle: 'membrane_hardening', stackLimit: 6 },
  { id: 'flagella', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Flagellum', desc: 'One flagellum. Buy one, grow one.', cost: { biomass: 9, lipids: 5, energy: 7, spores: 1 }, organelle: 'flagella', stackLimit: 8 },
  { id: 'dash_vacuole', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Dash Vacuole', desc: 'One burst organ for escaping bad overlaps and oxygen stress.', cost: { biomass: 14, lipids: 12, energy: 12, spores: 1 }, organelle: 'dash_vacuole', stackLimit: 4 },

  { id: 'oxygen_tolerance', section: 'Tier 2B - Algal oxygen path', theme: 'algae', kind: 'organelle', name: 'Oxygen Tolerance Vesicle', desc: 'Raise the safe oxygen threshold. Tolerance is separate from storage.', cost: { biomass: 12, energy: 6, enzymes: 1 }, organelle: 'oxygen_tolerance', stackLimit: 5 },
  { id: 'oxygen_vacuole', section: 'Tier 2B - Algal oxygen path', theme: 'algae', kind: 'organelle', name: 'Oxygen Buoyancy Vacuole', desc: 'Merged oxygen storage and buoyancy. Internal oxygen gives lift only with this organ.', cost: { biomass: 12, lipids: 7, energy: 7, enzymes: 1 }, organelle: 'oxygen_vacuole', stackLimit: 6 },
  { id: 'photosystem', section: 'Tier 2B - Algal oxygen path', theme: 'algae', kind: 'organelle', name: 'Photosystem Patch', desc: 'The algae road: light grows biomass, weight, and oxygen stress.', cost: { biomass: 12, energy: 6, spores: 1, crystals: 1 }, organelle: 'photosystem', stackLimit: 5 },

  { id: 'rasping_lamella', section: 'Tier 2C - Predatory organs', theme: 'attack', kind: 'organelle', name: 'Rasping Lamella', desc: 'One active overlap shred membrane. It only works when bodies actually overlap.', cost: { biomass: 18, lipids: 5, energy: 8, crystals: 1, enzymes: 1 }, organelle: 'rasping_lamella', stackLimit: 5 },
  { id: 'lance_bristle', section: 'Tier 2C - Predatory organs', theme: 'attack', kind: 'organelle', name: 'Lance Bristle', desc: 'One forward spine. Buy one, grow one.', cost: { biomass: 16, lipids: 7, energy: 8, crystals: 1 }, organelle: 'lance_bristle', stackLimit: 6 },
  { id: 'toxin_launcher', section: 'Tier 2C - Predatory organs', theme: 'attack', kind: 'organelle', name: 'Toxic Launcher', desc: 'Late Tier 2 toxin weapon: fires one chemical glob that creates a damaging field.', cost: { biomass: 14, energy: 10, toxins: 8, crystals: 1 }, organelle: 'toxin_launcher', stackLimit: 3 },
  { id: 'phagosome', section: 'Tier 2C - Predatory organs', theme: 'attack', kind: 'organelle', name: 'Phagosome Gland', desc: 'Engulf an overlapping smaller or wounded body on command, spending one enzyme to dissolve it whole into biomass.', cost: { biomass: 18, energy: 8, enzymes: 1, crystals: 1 }, organelle: 'phagosome', stackLimit: 1 },

  // Exotic traits: locked until you harvest the matching strain's DNA. Discovery
  // is permanent (persists across deaths and sessions); after that they buy like
  // any other organelle. requiresDiscovery matches the organelle's own id.
  { id: 'lipid_repair_loom', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Lipid Repair Loom', desc: 'Self-repair organ: lipids + ATP stitch the membrane. Harvested from resilient, self-mending cells.', cost: { biomass: 16, lipids: 12, enzymes: 1 }, organelle: 'lipid_repair_loom', requiresDiscovery: 'lipid_repair_loom', stackLimit: 5 },
  { id: 'cytostome', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Cytostome Bloom', desc: 'Larger feeding morphology harvested from voracious feeders: radius and flow increase together, at the cost of a softer membrane while gorging.', cost: { biomass: 18, lipids: 9, spores: 1 }, organelle: 'cytostome', requiresDiscovery: 'cytostome', stackLimit: 5 },
  { id: 'enzyme_reserve', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Enzyme Reserve Sac', desc: 'Emergency catalyst store from hardy cells: auto-spends an enzyme to flash-digest biomass into ATP whenever your energy runs critically low.', cost: { biomass: 14, enzymes: 2 }, organelle: 'enzyme_reserve', requiresDiscovery: 'enzyme_reserve', stackLimit: 1 },
  { id: 'spore_jet', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Spore Jet Vesicle', desc: 'Wires your dash to a spore charge, sequenced from swift chargers: a stronger lunge that vents a spore cloud. Spends one spore per dash. Needs a Dash Vacuole.', cost: { biomass: 14, spores: 2 }, requiresOrganelle: 'dash_vacuole', requiresDiscovery: 'spore_jet', organelle: 'spore_jet', stackLimit: 1 },
  { id: 'crystal_ward', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Crystalline Ward Lattice', desc: 'Spend a crystal to sheathe the membrane, a lattice grown from armored deep cells: harder skin, reflected damage, and piercing shots for a few seconds.', cost: { biomass: 16, lipids: 6, crystals: 2 }, organelle: 'crystal_ward', requiresDiscovery: 'crystal_ward', stackLimit: 1 },
  { id: 'toxin_cloud', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Toxin Cloud Gland', desc: 'Local toxic vent bred from venomous deep hunters. Requires a Toxic Launcher to route the venom.', cost: { biomass: 16, energy: 10, toxins: 16, enzymes: 1 }, requiresOrganelle: 'toxin_launcher', requiresDiscovery: 'toxin_cloud', organelle: 'toxin_cloud', stackLimit: 3 },
  { id: 'clean_processor', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Purified Processor', desc: 'Biomass to ATP with almost no toxic waste, at a slightly lower yield.', cost: { biomass: 18, enzymes: 1 }, organelle: 'clean_processor', requiresDiscovery: 'clean_processor', stackLimit: 6 },
  { id: 'virulent_processor', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Virulent Processor', desc: 'More ATP and throughput, but floods the body with toxin waste — weapon fuel, if you can hold it.', cost: { biomass: 18, toxins: 6 }, organelle: 'virulent_processor', requiresDiscovery: 'virulent_processor', stackLimit: 6 },
  { id: 'lipogenic_processor', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Lipogenic Processor', desc: 'Spends biomass and a little ATP to synthesize lipid reserve. Self-sufficient mitochondrial fuel.', cost: { biomass: 20, lipids: 6 }, organelle: 'lipogenic_processor', requiresDiscovery: 'lipogenic_processor', stackLimit: 5 },
  { id: 'catalytic_processor', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Catalytic Processor', desc: 'Enzyme-accelerated flow: the more enzymes you carry, the faster it runs.', cost: { biomass: 18, enzymes: 2 }, organelle: 'catalytic_processor', requiresDiscovery: 'catalytic_processor', stackLimit: 6 },
  { id: 'velocity_lance', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Velocity Lance', desc: 'A charge spine — near-harmless at a drift, brutal at dash speed.', cost: { biomass: 18, crystals: 1 }, organelle: 'velocity_lance', requiresDiscovery: 'velocity_lance', stackLimit: 6 },
  { id: 'saw_lance', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Saw Lance', desc: 'A grinding blade: flat, reliable damage regardless of speed, biting from wider angles.', cost: { biomass: 20, crystals: 1 }, organelle: 'saw_lance', requiresDiscovery: 'saw_lance', stackLimit: 6 },
  { id: 'siphon_rasp', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Siphon Rasp', desc: 'A parasitic shred: while rasping, drains the victim\'s biomass and lipids into your cargo.', cost: { biomass: 20, enzymes: 1 }, organelle: 'siphon_rasp', requiresDiscovery: 'siphon_rasp', stackLimit: 5 },
  { id: 'spore_toxin_launcher', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Sporo-Toxic Launcher', desc: 'Combination gun: spends toxins and spores for a heavy glob, wide splash, and a lingering cloud.', cost: { biomass: 22, spores: 2, crystals: 1 }, organelle: 'spore_toxin_launcher', requiresDiscovery: 'spore_toxin_launcher', stackLimit: 3 },
  { id: 'leech_rasp', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Leech Lamella', desc: 'Parasite organ: near-zero damage, but rasping siphons biomass and lipids straight out of your host.', cost: { biomass: 14, enzymes: 1 }, organelle: 'leech_rasp', requiresDiscovery: 'leech_rasp', stackLimit: 5 },
  { id: 'leech_lance', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Leech Proboscis', desc: 'Feeding spine: barely wounds, but draws biomass and lipids from prey at range. Parasitize without killing.', cost: { biomass: 16, spores: 1 }, organelle: 'leech_lance', requiresDiscovery: 'leech_lance', stackLimit: 6 },
  { id: 'rupture_auger', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Rupture Auger', desc: 'Armor-piercing spine: ignores membrane hardness entirely.', cost: { biomass: 20, crystals: 1 }, organelle: 'rupture_auger', requiresDiscovery: 'rupture_auger', stackLimit: 6 },
  { id: 'adrenal_vesicle', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Adrenal Vesicle', desc: 'The lower your HP, the harder and faster you strike — up to double near death.', cost: { biomass: 18, enzymes: 1 }, organelle: 'adrenal_vesicle', requiresDiscovery: 'adrenal_vesicle', stackLimit: 4 },
  { id: 'thorn_coat', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Thorn Coat', desc: 'Reflects a share of any damage dealt to you straight back at the attacker.', cost: { biomass: 20, crystals: 1 }, organelle: 'thorn_coat', requiresDiscovery: 'thorn_coat', stackLimit: 5 },
  { id: 'corrosive_pellicle', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Corrosive Pellicle', desc: 'Passive acid skin — anything overlapping you dissolves each moment.', cost: { biomass: 18, toxins: 6 }, organelle: 'corrosive_pellicle', requiresDiscovery: 'corrosive_pellicle', stackLimit: 5 },
  { id: 'discharge_vesicle', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Discharge Vesicle', desc: 'Auto-shocks every nearby body on a timer, spending ATP per pulse.', cost: { biomass: 20, crystals: 1 }, organelle: 'discharge_vesicle', requiresDiscovery: 'discharge_vesicle', stackLimit: 4 },
  { id: 'cryo_vesicle', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Cryo Vesicle', desc: 'Anything you damage is chilled and slowed for a moment.', cost: { biomass: 18, enzymes: 1 }, organelle: 'cryo_vesicle', requiresDiscovery: 'cryo_vesicle', stackLimit: 4 },
  { id: 'chemotaxis_cilia', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Chemotaxis Cilia', desc: 'Vacuums nearby slurry fields and loose particles toward you.', cost: { biomass: 16, spores: 1 }, organelle: 'chemotaxis_cilia', requiresDiscovery: 'chemotaxis_cilia', stackLimit: 4 },
  { id: 'phagocyte_maw', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Phagocyte Maw', desc: 'Engulfs any small, weakened body you overlap — instant biomass.', cost: { biomass: 22, enzymes: 1 }, organelle: 'phagocyte_maw', requiresDiscovery: 'phagocyte_maw', stackLimit: 3 },
  { id: 'necrosis_gland', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Necrosis Gland', desc: 'Anything you kill bursts into a lingering spore-toxin bloom.', cost: { biomass: 20, spores: 2 }, organelle: 'necrosis_gland', requiresDiscovery: 'necrosis_gland', stackLimit: 3 },
  { id: 'volatile_vacuole', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Volatile Vacuole', desc: 'You detonate when you die — a final blast that takes your killers with you.', cost: { biomass: 18, toxins: 8 }, organelle: 'volatile_vacuole', requiresDiscovery: 'volatile_vacuole', stackLimit: 3 },
  { id: 'seeker_gland', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Seeker Gland', desc: 'Auto-launches slow homing spores that curve after the nearest prey.', cost: { biomass: 20, spores: 2 }, organelle: 'seeker_gland', requiresDiscovery: 'seeker_gland', stackLimit: 4 },
  { id: 'harpoon_spine', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Harpoon Spine', desc: 'Fires a tethered spine that pierces, wounds, and hauls prey toward you.', cost: { biomass: 20, crystals: 1 }, organelle: 'harpoon_spine', requiresDiscovery: 'harpoon_spine', stackLimit: 3 },
  { id: 'neuro_barb', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Neuro-Toxin Barb', desc: 'Struck bodies sometimes turn and fight for you for a while.', cost: { biomass: 22, enzymes: 2 }, organelle: 'neuro_barb', requiresDiscovery: 'neuro_barb', stackLimit: 3 },
  { id: 'orbital_spores', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Orbital Spore-Bodies', desc: 'Daughter cells circle you and grind anything they brush.', cost: { biomass: 22, spores: 2 }, organelle: 'orbital_spores', requiresDiscovery: 'orbital_spores', stackLimit: 3 },
  { id: 'fission_bud', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Fission Bud', desc: 'Each kill may bud a short-lived allied grazer that fights at your side.', cost: { biomass: 22, crystals: 1 }, organelle: 'fission_bud', requiresDiscovery: 'fission_bud', stackLimit: 3 },

  // Symbiotic colony: nothing here works without the Pheromone Gland — the swarm-
  // conducting organ you harvest from a deep swarm-director. Graft the gland, then
  // its spore-pheromones marshal swarms of allied bacteria. Each swarm type also
  // teaches the colony a weapon gene you sequenced from the froth.
  { id: 'pheromone_gland', section: 'Tier 2E - Symbiotic colony', theme: 'colony', kind: 'organelle', name: 'Pheromone Gland', desc: 'The swarm-conducting organ, harvested from a deep swarm-director. Graft it to marshal a colony and to paint targets with a sticky death-pheromone. More glands conduct a larger swarm.', cost: { biomass: 20, spores: 2 }, organelle: 'pheromone_gland', requiresDiscovery: 'pheromone_gland', stackLimit: 2 },
  { id: 'companion_grazer', section: 'Tier 2E - Symbiotic colony', theme: 'colony', kind: 'colony', name: 'Grazer Swarm', desc: 'A swarm of grazer bacteria herded by your pheromones. It grazes fields beside you, returns the harvest to your body, and rasps whatever attacks the colony. The entry swarm.', cost: { biomass: 22, spores: 3 }, requiresOrganelle: 'pheromone_gland', companion: 'grazer' },
  { id: 'companion_lancer', section: 'Tier 2E - Symbiotic colony', theme: 'colony', kind: 'colony', name: 'Lancer Swarm', desc: 'A spined bacterial swarm driven by heavier pheromones — fast, it charges hostiles that near your colony. Its spine is grown from a wild charge-lance gene you sequenced.', cost: { biomass: 32, spores: 4, crystals: 1 }, requiresOrganelle: 'pheromone_gland', requiresDiscovery: 'velocity_lance', companion: 'lancer' },
  { id: 'companion_hunter', section: 'Tier 2E - Symbiotic colony', theme: 'colony', kind: 'colony', name: 'Toxic Swarm', desc: 'A venomous bacterial swarm marshalled by the richest pheromones, auto-firing toxic globs at your enemies. Its venom is bred from a sporo-toxic gene you sequenced.', cost: { biomass: 44, spores: 5, crystals: 1 }, requiresOrganelle: 'pheromone_gland', requiresDiscovery: 'spore_toxin_launcher', companion: 'hunter' },

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
// Box-Muller normal sample. Genomes cluster near the mean with rare tails, so the
// common 0.8..1.2 band is ~1.5 SD wide and the occasional god-roll (or dud) lives
// beyond it. Soft-clamped so nothing goes negative or absurd.
function gaussian(rng, mean = 0, sd = 1) {
  const u1 = Math.max(1e-9, rng());
  const u2 = rng();
  return mean + sd * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}
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

// Discovered exotic-organelle unlocks persist across deaths and browser sessions.
// Each unlock stores the POTENCY of the individual whose genes you sequenced, so a
// discovery is a Map orgId -> multiplier, not a bare set. Wrapped in try/catch
// because the smoke test runs in Node (no localStorage) — persistence is a no-op there.
function loadDiscoveries() {
  try {
    const saved = JSON.parse(localStorage.getItem('ee_discoveries') || '{}');
    const m = new Map();
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      for (const [k, v] of Object.entries(saved)) if (typeof v === 'number') m.set(k, v);
    } else if (Array.isArray(saved)) {
      for (const k of saved) if (typeof k === 'string') m.set(k, 1); // migrate legacy set-form saves
    }
    return m;
  } catch (_) { return new Map(); }
}

function saveDiscoveries(world) {
  try { localStorage.setItem('ee_discoveries', JSON.stringify(Object.fromEntries(world.discoveredSources))); } catch (_) {}
}

// A true fresh start (the reset-world button) wipes the persisted unlocks too, so
// the Yuki shop returns to its locked, first-run state.
function freshDiscoveries() {
  try { localStorage.removeItem('ee_discoveries'); } catch (_) {}
  return new Map();
}

// Potency is not a per-run constant — it belongs to an individual. A mutant NPC
// expresses the roll stamped on its own body when it spawned; the player expresses
// the potency of whichever genome they sequenced at Yuki. This is the genetic
// selection: better individuals in the froth carry better genes to harvest.
function potency(world, entity, oid) {
  if (entity && entity.strain === oid && typeof entity.strainPotency === 'number') return entity.strainPotency;
  const d = world && world.discoveredSources;
  if (d && typeof d.get === 'function') { const v = d.get(oid); if (typeof v === 'number') return v; }
  return 1;
}

export function createWorld(options = {}) {
  nextId = 1;
  const rng = mulberry32(options.seed || 1001);
  const world = {
    version: VERSION,
    t: 0,
    rng,
    entities: [],
    fields: [],
    particles: [],
    hazards: [],
    events: [],
    stats: { fieldsMerged: 0, deaths: 0, dnaRead: 0, algaeFalls: 0, ruptures: 0, spawnedCompanions: 0, eucharists: 0, toxicHits: 0 },
    cellLibrary: [],
    discoveredSources: options.fresh ? freshDiscoveries() : loadDiscoveries(),
    spawn: { algae: 0, npc: 0, exotic: 0, seed: 0 },
    playerId: null
  };
  const player = makeSoftBody(world, 'player', YUKI_SPAWN.x, YUKI_SPAWN.y, {
    r: 22, color: '#86d2ff', controller: 'human', trophicRole: 'anaerobic_scavenger', depthHome: YUKI_SPAWN.y,
    cargo: { biomass: 5, lipids: 4, energy: 18, toxins: 3, spores: 0, enzymes: 0, crystals: 0, dna: 0 },
    organelles: { membrane: 1, basal_motility: 1, membrane_intake: 1, anaerobic_processor: 1, storage_vacuole: 1, exotic_vacuole: 1 }, oxygen: oxygenAt(YUKI_SPAWN.y), grace: 2.5
  });
  player.carriedStrains = new Map();
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

  for (let i = 0; i < 6; i++) spawnAlgae(world, { mature: false });
  for (let i = 0; i < 5; i++) spawnAlgae(world, { mature: true });
  // A rain of falls already in progress, scattered across the whole column at varied
  // depths — not a single wall of algae dumped at the rupture seam.
  for (let i = 0; i < 6; i++) {
    const e = spawnAlgae(world, {
      mature: true,
      y: WORLD.nurseryTop + rand(world, 0, 2400),
      x: rand(world, 0, WORLD.w),
      biomass: rand(world, 130, 230),
      r: rand(world, 48, 70),
      fallState: 'sinking'
    });
    e.vy = rand(world, 18, 70);
    e.cargo.energy = rand(world, 1, 9);
    e.organelles.membrane_hardening = Math.max(e.organelles.membrane_hardening || 0, Math.ceil(rand(world, 2, 5)));
  }

  // Denser, stratified predator population so the falls actually get cropped.
  for (let i = 0; i < 24; i++) spawnPredator(world, {
    y: WORLD.ruptureTop - 120 + rand(world, 0, 1900),
    x: rand(world, 0, WORLD.w)
  });
  for (let i = 0; i < 9; i++) spawnProtozoan(world, {
    y: WORLD.deepTop + rand(world, 80, 1900),
    x: rand(world, 0, WORLD.w)
  });
  for (let i = 0; i < 3; i++) spawnMetazoan(world, {
    y: WORLD.deepTop + rand(world, 700, 2200),
    x: rand(world, 0, WORLD.w)
  });
  for (let i = 0; i < 2; i++) spawnBrood(world, {
    y: WORLD.deepTop + rand(world, 500, 2000),
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
function hasRasp(entity) { return RASP_ORGANS.some(o => hasOrg(entity, o)); }
// Any organ that lets a body pick and pursue prey (used by NPC/companion targeting).
function hasWeapon(entity) {
  return hasRasp(entity) || LANCES.some(l => hasOrg(entity, l))
    || hasOrg(entity, 'toxin_launcher') || hasOrg(entity, 'spore_toxin_launcher') || hasOrg(entity, 'harpoon_spine');
}
function companionCount(world, ownerId) {
  return world.entities.filter(e => e.alive && e.controller === 'companion' && e.ownerId === ownerId).length;
}
// The colony you can conduct scales with your Pheromone Glands: no gland, no swarm.
function swarmCap(entity) {
  return Math.min(COMPANION_CAP, orgCount(entity, 'pheromone_gland') * ORGANELLES.pheromone_gland.stats.capPerGland);
}

function colonyOrgs(entity) {
  const merged = {};
  for (const seg of (entity.colony || [])) {
    for (const [k, v] of Object.entries(seg.organelles || {})) {
      merged[k] = (merged[k] || 0) + v;
    }
  }
  return merged;
}

// caps() is pure in an entity's organelles + colony, which never change during the
// physics/damage/AI phases of a step — yet it is called O(n²) from lanceDamage,
// resolveContacts, and bestBodyTarget, and each call re-iterates the colony and reads
// a dozen megamorphic organelle slots. Memoize it per step: CAPS_EPOCH bumps once at
// the top of step(), so the first caps() for a body computes and every later call this
// frame returns the cached object. Organelle mutations (buy, graft) stamp _capsEpoch = -1
// to force a recompute the next time. This is the single biggest kernel hot-path win.
let CAPS_EPOCH = 0;
function caps(entity) {
  if (entity._capsEpoch === CAPS_EPOCH && entity._capsVal) return entity._capsVal;
  const result = capsCompute(entity);
  entity._capsEpoch = CAPS_EPOCH;
  entity._capsVal = result;
  return result;
}

function capsCompute(entity) {
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
    toxins: storage * s.toxins + oc('toxin_launcher') * ORGANELLES.toxin_launcher.stats.toxinCapBonus + oc('spore_toxin_launcher') * ORGANELLES.spore_toxin_launcher.stats.toxinCapBonus,
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
    + orgCount(entity, 'membrane_hardening') * ORGANELLES.membrane_hardening.stats.hardnessBonus
    + ((entity.warded || 0) > 0 ? CONSUMABLES.ward.hardness : 0); // crystalline ward
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

// Adrenal Vesicle: a combat multiplier that ramps as HP falls below the threshold,
// reaching (1 + maxBonus) at zero HP. Used for both attack power and swim speed.
function adrenalFactor(entity) {
  const n = orgCount(entity, 'adrenal_vesicle');
  if (n <= 0) return 1;
  const st = ORGANELLES.adrenal_vesicle.stats;
  const hpRatio = clamp((entity.hp || 0) / Math.max(1, caps(entity).hp), 0, 1);
  const missing = Math.max(0, (st.threshold - hpRatio) / st.threshold);
  const p = (entity.strain === 'adrenal_vesicle' && entity.strainPotency) ? entity.strainPotency : 1;
  return 1 + st.maxBonus * missing * p * (1 + 0.25 * (n - 1));
}

function speedOf(entity) {
  if ((entity.cargo.energy || 0) <= 0.01) return 0;
  if (orgCount(entity, 'basal_motility') <= 0 && orgCount(entity, 'flagella') <= 0) return 0;
  let sp = entity.baseSpeed || (entity.controller === 'predator' ? 96 : entity.controller === 'protozoan' ? 82 : entity.controller === 'metazoan' ? 62 : entity.controller === 'brood' ? 66 : entity.controller === 'swarm_agent' ? 122 : entity.controller === 'companion' ? 110 : entity.controller === 'algae' ? 52 : 112);
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
  if ((entity.chill || 0) > 0) sp *= (entity.chillMult ?? ORGANELLES.cryo_vesicle.stats.slowMult); // Cryo Vesicle slow
  sp *= adrenalFactor(entity); // Adrenal Vesicle: faster the closer to death
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
  if ((entity.marked || 0) > 0) v += 0.50; // marked for death — the swarm's prey bleeds faster
  return v;
}

function hostReadiness(entity) {
  if (!entity) return { score: 0, ready: false, reasons: ['missing body'] };
  if (hasMito(entity)) return { score: 1, ready: false, reasons: ['already integrated'] };
  const lipid = clamp((entity.cargo.lipids || 0) / Math.max(12, caps(entity).lipids * 0.65), 0, 1);
  const membrane = clamp((orgCount(entity, 'cytostome') + orgCount(entity, 'lipid_repair_loom') + orgCount(entity, 'membrane_hardening') + orgCount(entity, 'oxygen_vacuole')) / 4, 0, 1);
  const exotics = clamp(((entity.cargo.spores || 0) / 3 + (entity.cargo.enzymes || 0) / 2 + (entity.cargo.crystals || 0) / 2) / 3, 0, 1);
  const dna = clamp((entity.cargo.dna || 0) / 1, 0, 1);
  // Descent is now a real precondition: the Eucharist demands you carry the pressure
  // of the deep in your body. Full credit only past the rupture layer, into the deep.
  const depth = clamp((entity.maxDepth || 0) / 3000, 0, 1);
  const score = 0.20 * lipid + 0.22 * membrane + 0.20 * exotics + 0.18 * dna + 0.20 * depth;
  const reasons = [];
  if (lipid < 0.8) reasons.push('needs lipid reserve');
  if (membrane < 0.66) reasons.push('needs host organs');
  if (exotics < 0.72) reasons.push('needs exotic traces');
  if (dna < 1) reasons.push('needs one DNA record');
  if (depth < 0.85) reasons.push('must dive deeper into the rupture');
  return { score, ready: score >= 0.70, reasons };
}

export function step(world, commands = {}, dt = 1 / 60) {
  dt = clamp(dt, 0, 0.05);
  CAPS_EPOCH++; // invalidate every entity's per-frame caps() memo
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
  updateStrainSystems(world, dt);
  resolveContacts(world, dt);
  removeDead(world);
  for (const e of world.entities) {
    // A bloom that sinks all the way to the world floor uneaten dissolves into a rich
    // deep slurry — its mass rejoins the froth as food for the deep instead of piling
    // up as a static wall of algae at the bottom of the screen.
    if (e.controller === 'algae' && e.y >= WORLD.h - 40) {
      spawnResourceField(world, e.x, e.y, {
        biomass: (e.cargo.biomass || 0) * 0.7 + 12,
        lipids: (e.cargo.lipids || 0) * 0.6 + 4,
        toxins: e.cargo.toxins || 0
      }, { radius: clamp(e.r * 1.4, 40, 150), sourceKind: 'abyssal_fall', decayRate: 0.03, maxAge: 60, maxRadius: 200 });
      e.alive = false;
      continue;
    }
    e.x = wrapX(e.x); e.y = clamp(e.y, WORLD.canopy + 2, WORLD.h - 30);
    e.vx *= Math.pow(0.965, dt * 60); e.vy *= Math.pow(0.965, dt * 60);
    e.hit = Math.max(0, e.hit - dt); e.grace = Math.max(0, (e.grace || 0) - dt);
    e.maxDepth = Math.max(e.maxDepth || 0, e.y - WORLD.canopy);
    if (e.cooldowns) for (const k of Object.keys(e.cooldowns)) e.cooldowns[k] = Math.max(0, e.cooldowns[k] - dt);
    // Strain-effect timers: chill wears off; charm reverts to hostility; a fission bud dissolves.
    if (e.chill > 0) { e.chill = Math.max(0, e.chill - dt); if (e.chill === 0) e.chillMult = 1; }
    if (e.charmTimer > 0) { e.charmTimer = Math.max(0, e.charmTimer - dt); if (e.charmTimer === 0) e.friendly = false; }
    if (e.friendLife > 0) { e.friendLife = Math.max(0, e.friendLife - dt); if (e.friendLife === 0 && e.alive) hurt(world, e, caps(e).hp + 999, null); }
    if (e.marked > 0) { e.marked = Math.max(0, e.marked - dt); if (e.marked === 0) e.markedBy = null; }
    if (e.warded > 0) e.warded = Math.max(0, e.warded - dt);
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
      let sp = ORGANELLES.dash_vacuole.stats.impulse;
      // Bloom Dash: the Spore Jet Vesicle spends a spore for a stronger burst + cloud.
      const bd = CONSUMABLES.bloomDash;
      if (hasOrg(player, 'spore_jet') && (player.cargo.spores || 0) >= bd.spore) {
        player.cargo.spores -= bd.spore;
        sp *= bd.impulseMult;
        const h = spawnToxicHazard(world, player.x, player.y, { kind: 'spore_cloud', sourceId: player.id, radius: bd.cloudRadius, damage: bd.cloudDamage, maxAge: bd.cloudAge, color: DNA_CATEGORY_COLORS.launcher });
        h.side = friendlySide(player);
        world.events.push({ type: 'bloom_dash', entityId: player.id });
      } else {
        world.events.push({ type: 'dash', entityId: player.id });
      }
      player.vx += (move.x || Math.cos(player.phase)) * sp;
      player.vy += (move.y || Math.sin(player.phase)) * sp;
      player.cargo.energy -= ORGANELLES.dash_vacuole.stats.energyCost;
    }
    if (commands.rasp && hasRasp(player) && player.cargo.energy > 0) player.action = 'rasp';
    if (commands.acid && hasOrg(player, 'toxin_launcher')) acidPulse(world, player, commands.aimX, commands.aimY);
    if (commands.sporeshot && hasOrg(player, 'spore_toxin_launcher')) sporePulse(world, player, commands.aimX, commands.aimY);
    if (commands.harpoon && hasOrg(player, 'harpoon_spine')) harpoonPulse(world, player, commands.aimX, commands.aimY);
    if (commands.mark && hasOrg(player, 'pheromone_gland')) markPulse(world, player, commands.aimX, commands.aimY);
    if (commands.engulf && hasOrg(player, 'phagosome')) engulfPulse(world, player);
    if (commands.ward && hasOrg(player, 'crystal_ward')) wardPulse(world, player);
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

    const hunts = ['predator', 'protozoan', 'metazoan', 'companion', 'brood', 'swarm_agent'].includes(e.controller);
    if (prey && hunts) {
      tx = prey.x; ty = prey.y; targetMode = 'prey';
      const preyDist = distWrap(e.x, e.y, prey.x, prey.y);
      if (powered && hasOrg(e, 'toxin_launcher') && preyDist < 520 && e.cargo.energy > ORGANELLES.toxin_launcher.stats.energyCost && e.cargo.toxins > ORGANELLES.toxin_launcher.stats.toxinCost && world.rng() < 0.018) {
        acidPulse(world, e, dxWrap(e.x, prey.x), prey.y - e.y);
      }
      if (powered && hasOrg(e, 'spore_toxin_launcher') && preyDist < 540 && e.cargo.energy > ORGANELLES.spore_toxin_launcher.stats.energyCost && e.cargo.toxins > ORGANELLES.spore_toxin_launcher.stats.toxinCost && (e.cargo.spores || 0) >= ORGANELLES.spore_toxin_launcher.stats.sporeCost && world.rng() < 0.014) {
        sporePulse(world, e, dxWrap(e.x, prey.x), prey.y - e.y);
      }
      if (powered && hasOrg(e, 'harpoon_spine') && preyDist < 480 && e.cargo.energy > ORGANELLES.harpoon_spine.stats.energyCost && world.rng() < 0.02) {
        harpoonPulse(world, e, dxWrap(e.x, prey.x), prey.y - e.y);
      }
      // A swarm-director paints its prey with a death-pheromone so its own swarm converges.
      if (powered && hasOrg(e, 'pheromone_gland') && preyDist < 520 && (e.cargo.spores || 0) >= ORGANELLES.pheromone_gland.stats.sporeCost && (prey.marked || 0) <= 0 && world.rng() < 0.014) {
        markPulse(world, e, dxWrap(e.x, prey.x), prey.y - e.y);
      }
      // With collision removed, predators should commit to standing on the target.
      // Rasping is overlap-based; orbiting just outside contact is explicitly wrong.
      if (powered && hasRasp(e) && preyDist < e.r + prey.r + 42) e.action = 'rasp';
    }

    // Symbionts leash to their owner: they hover near the player and only break off
    // to fight prey that comes close. Stray too far and they abandon the hunt to catch up.
    if (e.ownerId) {
      const owner = world.entities.find(x => x.id === e.ownerId && x.alive);
      if (owner) {
        e.depthHome = owner.y;
        const ownerDist = distWrap(e.x, e.y, owner.x, owner.y);
        // A hostile swarm boils outward and commits to the hunt far from its director;
        // a friendly symbiont hangs close to its host and only breaks off for near prey.
        const leash = e.controller === 'swarm_agent' ? 680 : 300;
        const chasing = targetMode === 'prey' && ownerDist < leash;
        if (!chasing) { tx = owner.x; ty = owner.y; targetMode = ownerDist > 90 ? 'field' : 'home'; }
        // Foraging return: a grazing symbiont hauls surplus matter home to its host.
        if (e.controller === 'companion' && ownerDist < owner.r + e.r + 44) deliverToOwner(world, e, owner, dt);
      }
    }

    // Free-roaming hunters let their home depth drift toward wherever the hunt is
    // taking them, so the predator layer follows the algal fall down and churns
    // through the whole column instead of pinning to the seam where it spawned.
    if ((e.controller === 'predator' || e.controller === 'protozoan') && !e.ownerId) {
      e.depthHome += (e.y - e.depthHome) * 0.12 * dt;
      e.depthHome = clamp(e.depthHome, WORLD.ruptureTop - 260, WORLD.h - 220);
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
  // Algae are pure buoyancy machines: light grows biomass, biomass is weight, and
  // weight over lift pulls them down. Nothing hard-codes where they stop — a heavy
  // bloom just keeps sinking through every layer until a mouth eats it or the world
  // floor claims it. A bloom that metabolizes its load back down grows buoyant and
  // bobs toward the light again. The froth breathes.
  const weight = biomassWeight(e);
  const lift = buoyancy(e) + orgCount(e, 'flagella') * ORGANELLES.flagella.stats.lift + (e.cargo.energy || 0) * 0.035;
  const fullness = (e.cargo.biomass || 0) / Math.max(1, caps(e).biomass);
  const failing = weight > lift + 2 || fullness > 0.82 || (e.cargo.energy || 0) < 2;
  if (failing && !e.fallState) {
    e.fallState = 'sinking';
    world.stats.algaeFalls += 1;
    world.events.push({ type: 'algae_fall', entityId: e.id });
  }
  // Recovery: a sinking bloom that has burned off enough of its load regains lift and
  // starts climbing again — the up half of the bob.
  if (e.fallState === 'sinking' && weight < lift - 4 && fullness < 0.55 && (e.cargo.energy || 0) > 6) {
    e.fallState = null;
  }
  const tx = e.x + Math.cos(e.phase + Math.sin(world.t * 0.4)) * 50;
  const dirx = norm(dxWrap(e.x, tx), 0).x;
  if (e.fallState !== 'sinking') {
    // Buoyant algae swim up toward the lit canopy, riding a gentle bob.
    const ty = WORLD.canopy + 140 + Math.sin(world.t * 0.6 + e.phase) * 40;
    const toward = norm(dxWrap(e.x, tx), ty - e.y);
    const sp = speedOf(e) * 0.5;
    e.vx += toward.x * sp * dt;
    e.vy += toward.y * sp * dt;
  } else {
    // Sinking algae give up on the light — they only drift sideways as they fall.
    e.vx += dirx * speedOf(e) * 0.26 * dt;
  }
  // Square-cube buoyancy force: net weight-over-lift, scaled so the biggest, fullest
  // blooms plummet hardest and the lightest drift up. No floor, no target depth.
  const netSink = weight - lift;
  const buoyForce = e.fallState === 'sinking'
    ? clamp(netSink * 0.62 + fullness * 18 + 5, -6, 82)
    : clamp(netSink * 0.55, -16, 34);
  e.vy += buoyForce * dt;
  e.phase = Math.atan2(e.vy, e.vx || 0.001);
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
      const biomassFill = clamp((e.cargo.biomass || 0) / Math.max(1, caps(e).biomass), 0, 1);
      // v1.3.3 flow curve: fuller biomass tanks process a larger volume faster,
      // but the conversion is less efficient. Bare reserves are slow but frugal.
      const volumeCurve = 0.10 + 1.60 * Math.pow(biomassFill, 1.35);
      const enzymeFill = clamp((e.cargo.enzymes || 0) / Math.max(1, caps(e).enzymes), 0, 1);
      for (const procId of PROCESSORS) {
        const level = orgCount(e, procId);
        if (level <= 0) continue;
        const st = ORGANELLES[procId].stats;
        const efficiency = st.energyPerBiomass * (1.16 - 0.34 * biomassFill);
        // Catalytic processors run faster the more enzymes you carry, spending a trickle.
        const rate = (st.enzymeBoost ? st.rate * (1 + st.enzymeBoost * enzymeFill) : st.rate) * potency(world, e, procId);
        const room = Math.max(0, caps(e).energy - (e.cargo.energy || 0));
        if (room <= 0) break;
        const desiredATP = Math.min(level * rate * volumeCurve * dt, room);
        const ferment = Math.min(e.cargo.biomass, desiredATP / Math.max(0.1, efficiency));
        if (ferment <= 0) continue;
        e.cargo.biomass -= ferment;
        e.cargo.energy += ferment * efficiency;
        e.cargo.toxins += ferment * st.toxinPerBiomass * (0.65 + 0.9 * biomassFill);
        if (st.enzymeDrain && (e.cargo.enzymes || 0) > 0) {
          e.cargo.enzymes = Math.max(0, e.cargo.enzymes - st.enzymeDrain * level * dt);
        }
      }
    }

    // Lipogenic processors reverse metabolism: spend biomass (and a little ATP)
    // to build lipid reserve, letting a mitochondrial cell refuel without Yuki.
    const lipoLevel = orgCount(e, 'lipogenic_processor');
    if (lipoLevel > 0) {
      const lst = ORGANELLES.lipogenic_processor.stats;
      const lipidRoom = Math.max(0, caps(e).lipids - (e.cargo.lipids || 0));
      const biomassAvail = Math.max(0, (e.cargo.biomass || 0) - 2);
      if (lipidRoom > 0.02 && biomassAvail > 0.05 && (e.cargo.energy || 0) > lst.energyCost) {
        const biomassUse = Math.min(biomassAvail, lst.biomassPerSecond * lipoLevel * potency(world, e, 'lipogenic_processor') * dt);
        const lipidsMade = Math.min(lipidRoom, biomassUse * lst.lipidPerBiomass);
        if (lipidsMade > 0) {
          const usedBiomass = lipidsMade / lst.lipidPerBiomass;
          e.cargo.biomass -= usedBiomass;
          e.cargo.lipids += lipidsMade;
          e.cargo.energy = Math.max(0, e.cargo.energy - lst.energyCost * usedBiomass);
        }
      }
    }

    // Enzymatic Surge: when ATP runs critically low, a catalytic cell spends one
    // enzyme to flash-digest biomass into ATP — an automatic emergency respiration.
    const surge = CONSUMABLES.surge;
    e.cooldowns ||= {};
    if ((e.cargo.energy || 0) < caps(e).energy * surge.threshold && hasOrg(e, 'enzyme_reserve')
      && (e.cargo.enzymes || 0) >= surge.enzyme && (e.cargo.biomass || 0) > 2 && (e.cooldowns.surge || 0) <= 0) {
      const used = Math.min(e.cargo.biomass, surge.convert);
      e.cargo.biomass -= used;
      e.cargo.enzymes -= surge.enzyme;
      e.cargo.energy = Math.min(caps(e).energy, (e.cargo.energy || 0) + used * surge.efficiency);
      e.cooldowns.surge = surge.cooldown;
      if (e.kind === 'player') world.events.push({ type: 'surge', entityId: e.id });
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
    // Starvation: out of ATP with too little biomass to recover, the body autolyses —
    // faster the emptier it is. No more sitting dead-in-the-water waiting on nothing;
    // you feed, you flee, or you dissolve (and the froth already smells you — see starving aggro).
    if ((e.cargo.energy || 0) <= 0.02 && (e.cargo.biomass || 0) < 4) {
      e.hp -= (5 + 8 * (1 - (e.cargo.biomass || 0) / 4)) * dt;
      e.hit = Math.max(e.hit, 0.05);
    }
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
  player._capsEpoch = -1; // colony changed — caps() merges colony organelles
  player.r = Math.min(player.r + r * 0.6, player.baseR + 28);
}

function repairFromLipids(world, entity, dt) {
  if (!hasOrg(entity, 'lipid_repair_loom')) return false;
  const o = ORGANELLES.lipid_repair_loom.stats;
  if ((entity.cargo.lipids || 0) <= 0.02 || (entity.cargo.energy || 0) <= 0.02 || entity.hp >= caps(entity).hp) return false;
  const room = caps(entity).hp - entity.hp;
  const hps = o.hpPerSecond * potency(world, entity, 'lipid_repair_loom');
  const repair = Math.min(room, hps * orgCount(entity, 'lipid_repair_loom') * dt);
  const lipidCost = repair / hps * o.lipidCost;
  const energyCost = repair / hps * o.energyCost;
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
    // DNA is a fragile, fought-over molecule. It denatures fast, and toxins shred it
    // faster still — a strand that lands in poison is gone in a blink.
    if (p.kind === 'dna') {
      let toxicity = 0;
      for (const f of world.fields) { if ((f.stock.toxins || 0) > 1 && distWrap(p.x, p.y, f.x, f.y) < f.radius) toxicity += (f.stock.toxins || 0); }
      for (const h of world.hazards) { if ((h.kind === 'toxic_splash' || h.kind === 'toxin_cloud' || h.kind === 'spore_cloud' || h.kind === 'blast') && distWrap(p.x, p.y, h.x, h.y) < h.radius) toxicity += 30; }
      if (toxicity > 0) p.age += Math.min(4.5, toxicity * 0.12) * dt;
      // Predators strip loose DNA for its raw biomass rather than storing information.
      let devoured = false;
      for (const e of world.entities) {
        if (!e.alive || e.kind === 'player' || e.friendly) continue;
        if (!(e.controller === 'predator' || e.controller === 'protozoan' || e.controller === 'metazoan' || e.controller === 'brood')) continue;
        if (distWrap(p.x, p.y, e.x, e.y) > e.r + 10) continue;
        const room = Math.max(0, caps(e).biomass - (e.cargo.biomass || 0));
        if (room <= 0) continue;
        e.cargo.biomass += Math.min(room, p.value * 6);
        devoured = true; break;
      }
      if (devoured) { world.particles.splice(i, 1); continue; }
    }
    if (p.age > p.maxAge || p.y < WORLD.canopy - 30 || p.y > WORLD.h + 80) world.particles.splice(i, 1);
  }
}


function updateHazards(world, dt) {
  for (let i = world.hazards.length - 1; i >= 0; i--) {
    const h = world.hazards[i];
    h.age += dt;
    // Seeker Gland shots steer toward the nearest opposite-side body each tick.
    if (h.homing) {
      let best = null, bestD = 1e9;
      for (const e of world.entities) { if (!e.alive || friendlySide(e) === h.side) continue; const d = distWrap(h.x, h.y, e.x, e.y); if (d < bestD) { bestD = d; best = e; } }
      if (best) {
        const dir = norm(dxWrap(h.x, best.x), best.y - h.y);
        const sp = h.speed || Math.hypot(h.vx, h.vy) || 1;
        const cur = Math.atan2(h.vy, h.vx); let da = Math.atan2(dir.y, dir.x) - cur;
        while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
        const na = cur + clamp(da, -h.homing * dt, h.homing * dt);
        h.vx = Math.cos(na) * sp; h.vy = Math.sin(na) * sp;
      }
    }
    h.x = wrapX(h.x + h.vx * dt); h.y += h.vy * dt;
    if (!h.homing) { h.vx *= Math.pow(0.985, dt * 60); h.vy *= Math.pow(0.985, dt * 60); }
    let burst = false;
    for (const e of world.entities) {
      if (!e.alive || e.id === h.sourceId) continue;
      if (h.side !== undefined && friendlySide(e) === h.side) continue; // side-aware shots never hit allies
      const d = distWrap(h.x, h.y, e.x, e.y);
      if (d > h.radius + e.r) continue;
      if (h.hitOnce && h.hitIds.has(e.id)) continue;
      // Death-pheromone blob: paints the first hostile it touches (no damage), then bursts.
      if (h.kind === 'mark_blob') {
        e.marked = h.markDur; e.markedBy = h.sourceId;
        h.hitIds.add(e.id);
        world.events.push({ type: 'marked', entityId: e.id, by: h.sourceId });
        burst = true; break;
      }
      const isProjectile = h.kind === 'toxic_projectile' || h.kind === 'spore_projectile' || h.kind === 'seeker' || h.kind === 'harpoon';
      const overlap = clamp((h.radius + e.r - d) / Math.max(8, h.radius), 0, 1.4);
      hurt(world, e, h.damage * overlap * dt * (isProjectile ? 18 : 1), h.sourceId || h.id);
      // Harpoon Spine hauls the struck body toward whoever fired it.
      if (h.kind === 'harpoon' && h.pull) {
        const src = world.entities.find(x => x.id === h.sourceId);
        if (src) { const dir = norm(dxWrap(e.x, src.x), src.y - e.y); e.vx += dir.x * h.pull; e.vy += dir.y * h.pull; }
      }
      h.hitIds.add(e.id);
      world.stats.toxicHits += 1;
      if (isProjectile && !h.pierce) { burst = true; break; } // overcharged shots pierce through
      else if (isProjectile) continue; // keep flying, but only hit each body once
    }
    if (burst || h.age > h.maxAge || h.y < WORLD.canopy - 40 || h.y > WORLD.h + 80) {
      if (h.kind === 'toxic_projectile') {
        const st = ORGANELLES.toxin_launcher.stats;
        spawnToxicHazard(world, h.x, h.y, { kind: 'toxic_splash', sourceId: h.sourceId, radius: st.splashRadius, damage: st.splashDamage, maxAge: st.splashAge });
      } else if (h.kind === 'spore_projectile') {
        // A heavier burst plus a slow spore-toxin cloud that keeps damaging the area.
        const st = ORGANELLES.spore_toxin_launcher.stats;
        spawnToxicHazard(world, h.x, h.y, { kind: 'toxic_splash', sourceId: h.sourceId, radius: st.splashRadius, damage: st.splashDamage, maxAge: st.splashAge, color: DNA_CATEGORY_COLORS.launcher });
        spawnToxicHazard(world, h.x, h.y, { kind: 'spore_cloud', sourceId: h.sourceId, radius: st.splashRadius * 0.8, damage: 20, maxAge: 2.4, color: DNA_CATEGORY_COLORS.launcher });
      }
      world.hazards.splice(i, 1);
    }
  }
}


function applyActiveActionCosts(world, dt) {
  for (const e of world.entities) {
    if (!e.alive) continue;
    if (e.action === 'rasp' && hasRasp(e)) {
      // Rasping costs are paid once per body per tick, not once per target.
      // Small bodies are efficient grazers; large bodies are better served by lances.
      const sizeFactor = 0.42 + Math.pow(Math.max(8, e.r) / 32, 1.18);
      let cost = 0;
      for (const raspId of RASP_ORGANS) cost += ORGANELLES[raspId].stats.energyCost * orgCount(e, raspId) * sizeFactor * dt;
      if ((e.cargo.energy || 0) >= cost) e.cargo.energy -= cost;
      else { e.cargo.energy = 0; e.action = null; }
    }
  }
}

function resolveContacts(world, dt) {
  const ents = world.entities.filter(e => e.alive);
  // Broad-phase: the world is 5600px tall and bodies are spread across it, so the vast
  // majority of pairs are far too distant to ever touch. Sort by depth and, since any
  // interaction needs d < (reach) and |dy| <= d, stop the inner scan the moment the
  // vertical gap exceeds the largest reach in play. This collapses the O(n²) pair loop
  // to near-linear and is the dominant performance win under load.
  ents.sort((p, q) => p.y - q.y);
  // Per-frame weapon flags computed once per body: whether it carries a lance and its
  // reach. This keeps the hot pair loop from re-reading megamorphic organelle slots for
  // every pair a body participates in, and lets us skip lanceDamage for unarmed bodies.
  let maxR = 0;
  for (const e of ents) {
    let lr = 0, hasL = false;
    for (const lanceId of LANCES) {
      if ((e.organelles[lanceId] || 0) > 0) { hasL = true; const L = ORGANELLES[lanceId].stats.length; if (L > lr) lr = L; }
    }
    e._hasLance = hasL;
    e._lanceReach = hasL ? e.r + lr * 1.65 : 0;
    if (e.r > maxR) maxR = e.r;
  }
  const WINDOW = 2 * maxR + 100; // exceeds any overlap span or lance reach in the scene
  for (let i = 0; i < ents.length; i++) {
    const a = ents[i];
    for (let j = i + 1; j < ents.length; j++) {
      const b = ents[j];
      if (b.y - a.y > WINDOW) break; // sorted by depth: nothing below b can reach a either
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
        overlapAura(world, a, b, dt);
        overlapAura(world, b, a, dt);
      }
      if (a._hasLance && d < a._lanceReach + b.r) lanceDamage(world, a, b, d, nx, ny, dt);
      if (b._hasLance && d < b._lanceReach + a.r) lanceDamage(world, b, a, d, -nx, -ny, dt);
    }
  }
}

// Post-damage on-hit riders shared by lances and rasps: chilling, charming, and
// the target's own thorns firing back. Kept in one place so every damage source
// gets the same treatment.
function afterDamage(world, attacker, target, dmg) {
  if (dmg <= 0 || !target) return;
  if (hasOrg(attacker, 'cryo_vesicle')) {
    const st = ORGANELLES.cryo_vesicle.stats;
    const p = potency(world, attacker, 'cryo_vesicle');
    target.chill = Math.max(target.chill || 0, st.dur);
    target.chillMult = clamp(1 - (1 - st.slowMult) * p, 0.1, 0.95); // higher potency → stronger slow
  }
  if (hasOrg(attacker, 'neuro_barb') && attacker.kind === 'player' && target.kind !== 'player' && !target.friendly && !target.charmTimer) {
    const st = ORGANELLES.neuro_barb.stats;
    if (world.rng() < st.chance * potency(world, attacker, 'neuro_barb')) {
      target.friendly = true; target.charmTimer = st.dur;
      world.events.push({ type: 'charm', entityId: target.id });
    }
  }
  if (hasOrg(target, 'thorn_coat') && attacker.alive && attacker.id !== target.id) {
    const st = ORGANELLES.thorn_coat.stats;
    hurt(world, attacker, dmg * st.reflect * potency(world, target, 'thorn_coat'), target.id);
  }
  // Crystalline Ward reflects a share of incoming damage while it holds.
  if ((target.warded || 0) > 0 && attacker.alive && attacker.id !== target.id) {
    hurt(world, attacker, dmg * CONSUMABLES.ward.reflect, target.id);
  }
}

function lanceDamage(world, attacker, target, distance, nx, ny, dt) {
  if (!attacker.alive || !target.alive) return;
  if (friendlySide(attacker) && friendlySide(target)) return; // no friendly fire (player, companions, buds, charmed)
  const facing = { x: Math.cos(attacker.phase), y: Math.sin(attacker.phase) };
  const alignmentRaw = facing.x * nx + facing.y * ny;
  const impactSpeed = Math.hypot(attacker.vx || 0, attacker.vy || 0);
  const hardness = membraneHardness(target);
  const vuln = vulnerability(target);
  const adrenal = adrenalFactor(attacker);
  let total = 0;
  let leech = 0;
  for (const lanceId of LANCES) {
    const count = orgCount(attacker, lanceId);
    if (count <= 0) continue;
    const st = ORGANELLES[lanceId].stats;
    const reach = attacker.r + target.r + st.length * Math.min(1.65, 0.85 + count * 0.28);
    if (distance > reach || alignmentRaw < st.alignmentFloor) continue;
    const reachFraction = clamp((reach - distance) / Math.max(12, st.length), 0, 1.15);
    const p = potency(world, attacker, lanceId);
    // A leech proboscis draws resources whenever it's engaged, regardless of its tiny bite.
    if (st.leechRate) leech += st.leechRate * count * p * reachFraction * dt;
    // Lances are impact organs, not laser beams. Charge lances punch far above
    // steady swimming; saw lances (flat) grind at a fixed rate regardless of speed.
    const speedFactor = st.flat ? 1 : clamp((impactSpeed - (st.speedFloor || 0)) / st.speedScale, 0, st.speedCap || 3.2);
    let dmg = st.damage * count * reachFraction * alignmentRaw * speedFactor * vuln * p * adrenal * dt;
    if (dmg <= 0) continue;
    // A Rupture Auger ignores hardness; every other lance is blunted by tough skin.
    if (!st.pierce && st.rupturePower * count < hardness && target.r > attacker.r * 1.35) dmg *= 0.22;
    total += dmg;
  }
  if (total > 0) { hurt(world, target, total, attacker.id); afterDamage(world, attacker, target, total); }
  if (leech > 0) drainLeech(world, attacker, target, leech);
}

function contactDamage(world, attacker, target, overlap, nx, ny, dt) {
  if (!attacker.alive || !target.alive) return;
  if (friendlySide(attacker) && friendlySide(target)) return; // no friendly fire
  const contactFraction = clamp(overlap / Math.min(attacker.r, target.r), 0, 1.35);
  let dps = 0;
  let rupturePower = 0;
  let siphon = 0;
  let leech = 0;
  if (attacker.action === 'rasp' && (attacker.cargo.energy || 0) > 0) {
    for (const raspId of RASP_ORGANS) {
      const rc = orgCount(attacker, raspId);
      if (rc <= 0) continue;
      const rst = ORGANELLES[raspId].stats;
      const p = potency(world, attacker, raspId);
      dps += rst.dps * rc * p;
      rupturePower += rst.rupturePower * rc;
      if (rst.stealFraction) siphon += rst.stealFraction * p;
      if (rst.leechRate) leech += rst.leechRate * rc * p;
    }
  }
  if (dps <= 0 && leech <= 0) return;
  const facing = { x: Math.cos(attacker.phase), y: Math.sin(attacker.phase) };
  const alignment = clamp((facing.x * nx + facing.y * ny + 1.15) / 2.15, 0.25, 1.0);
  const hardness = membraneHardness(target);
  if (rupturePower < hardness && target.r > attacker.r * 1.28) dps *= 0.12;
  const dmg = dps * contactFraction * alignment * vulnerability(target) * adrenalFactor(attacker) * dt;
  if (dmg > 0) { hurt(world, target, dmg, attacker.id); afterDamage(world, attacker, target, dmg); }
  attacker.hunger = Math.max(0, attacker.hunger - dmg * 0.003);
  // A siphon rasp doesn't just shred — it drains the victim's stores into your cargo,
  // proportional to damage dealt. Leech organs drain at a flat rate with near-zero harm.
  if (siphon > 0 && dmg > 0) {
    const cap = caps(attacker);
    for (const res of ['biomass', 'lipids']) {
      const avail = target.cargo[res] || 0;
      if (avail <= 0) continue;
      const room = Math.max(0, (cap[res] ?? 0) - (attacker.cargo[res] || 0));
      const moved = Math.min(avail, room, dmg * siphon);
      if (moved > 0) { target.cargo[res] -= moved; attacker.cargo[res] += moved; }
    }
    if (attacker.kind === 'player') world.events.push({ type: 'siphon', entityId: attacker.id });
  }
  if (leech > 0) drainLeech(world, attacker, target, leech * contactFraction * dt);
}

// Parasite feeding: pull biomass and lipids from the target into the attacker,
// respecting the attacker's caps, independent of any damage dealt. Split evenly.
function drainLeech(world, attacker, target, amount) {
  if (amount <= 0) return;
  const cap = caps(attacker);
  let pulled = 0;
  for (const res of ['biomass', 'lipids']) {
    const avail = target.cargo[res] || 0;
    if (avail <= 0) continue;
    const room = Math.max(0, (cap[res] ?? 0) - (attacker.cargo[res] || 0));
    const moved = Math.min(avail, room, amount * 0.5);
    if (moved > 0) { target.cargo[res] -= moved; attacker.cargo[res] += moved; pulled += moved; }
  }
  if (pulled > 0 && attacker.kind === 'player') world.events.push({ type: 'leech', entityId: attacker.id });
}

// Sides: the player and anything friendly (companions, charmed enemies, buds) are
// one team; everything else is the other. Two bodies are hostile only across sides.
function friendlySide(e) { return e.kind === 'player' || !!e.friendly; }
function areHostile(a, b) { return a.id !== b.id && friendlySide(a) !== friendlySide(b); }

// Overlap-triggered strain effects, evaluated per overlapping pair (a acting on b).
function overlapAura(world, a, b, dt) {
  if (!a.alive || !b.alive || !areHostile(a, b)) return;
  // Corrosive Pellicle: passive acid to anything sharing your space.
  if (hasOrg(a, 'corrosive_pellicle')) {
    const dmg = ORGANELLES.corrosive_pellicle.stats.dps * orgCount(a, 'corrosive_pellicle') * potency(world, a, 'corrosive_pellicle') * dt;
    hurt(world, b, dmg, a.id);
    afterDamage(world, a, b, dmg);
  }
  // Phagocyte Maw: engulf a small, weakened NON-player body whole (never instakills the player).
  if (hasOrg(a, 'phagocyte_maw') && b.alive && b.kind !== 'player') {
    const st = ORGANELLES.phagocyte_maw.stats;
    a.cooldowns ||= {};
    if ((a.cooldowns.phagocyte || 0) <= 0 && b.hp <= caps(b).hp * st.hpFrac && b.r < a.r * st.sizeRatio) {
      a.cargo.biomass = Math.min(caps(a).biomass, (a.cargo.biomass || 0) + st.biomassGain * potency(world, a, 'phagocyte_maw'));
      a.cooldowns.phagocyte = st.cooldown;
      if (a.kind === 'player') world.events.push({ type: 'engulf', entityId: a.id });
      hurt(world, b, caps(b).hp + 999, a.id);
    }
  }
}

// Per-tick strain systems that scan other bodies, fields, or particles.
function updateStrainSystems(world, dt) {
  const living = world.entities.filter(e => e.alive);
  for (const e of living) {
    if (hasOrg(e, 'discharge_vesicle')) dischargePulse(world, e, living);
    if (hasOrg(e, 'seeker_gland')) seekerAutoFire(world, e, living);
    if (hasOrg(e, 'chemotaxis_cilia')) chemotaxisPull(world, e, dt);
    if (hasOrg(e, 'orbital_spores')) orbitalDamage(world, e, living, dt);
    // A Pheromone Gland conducts a swarm. The player conducts by raising swarms at
    // Yuki; a wild director (brood) conducts by budding its own escort here.
    if (hasOrg(e, 'pheromone_gland') && e.kind !== 'player' && !e.friendly) conductSwarm(world, e);
  }
}

function conductSwarm(world, e) {
  e.cooldowns ||= {};
  if ((e.cooldowns.conduct || 0) > 0) return;
  const cap = 5 * orgCount(e, 'pheromone_gland');
  const have = world.entities.filter(x => x.alive && x.controller === 'swarm_agent' && x.ownerId === e.id).length;
  if (have >= cap) return;
  spawnSwarmAgent(world, e);
  e.cooldowns.conduct = 2.0;
}

function dischargePulse(world, e, living) {
  const st = ORGANELLES.discharge_vesicle.stats;
  e.cooldowns ||= {};
  if ((e.cooldowns.discharge || 0) > 0 || (e.cargo.energy || 0) < st.energyCost) return;
  const power = st.damage * orgCount(e, 'discharge_vesicle') * potency(world, e, 'discharge_vesicle');
  let hit = false;
  for (const o of living) {
    if (!areHostile(e, o) || distWrap(e.x, e.y, o.x, o.y) > st.radius + o.r) continue;
    hurt(world, o, power, e.id); afterDamage(world, e, o, power); hit = true;
  }
  if (hit) {
    e.cargo.energy -= st.energyCost;
    e.cooldowns.discharge = st.cooldown;
    spawnToxicHazard(world, e.x, e.y, { kind: 'shock', sourceId: e.id, radius: st.radius, damage: 0, maxAge: 0.22, color: DNA_CATEGORY_COLORS.aura });
    world.events.push({ type: 'discharge', entityId: e.id });
  }
}

function seekerAutoFire(world, e, living) {
  const st = ORGANELLES.seeker_gland.stats;
  e.cooldowns ||= {};
  if ((e.cooldowns.seeker || 0) > 0 || (e.cargo.energy || 0) < st.energyCost) return;
  let best = null, bestD = st.range;
  for (const o of living) { if (!areHostile(e, o)) continue; const d = distWrap(e.x, e.y, o.x, o.y); if (d < bestD) { bestD = d; best = o; } }
  if (!best) return;
  e.cargo.energy -= st.energyCost; e.cooldowns.seeker = st.cooldown;
  const dir = norm(dxWrap(e.x, best.x), best.y - e.y);
  const h = spawnToxicHazard(world, e.x + dir.x * (e.r + 8), e.y + dir.y * (e.r + 8), {
    kind: 'seeker', sourceId: e.id, radius: 9, damage: st.damage * potency(world, e, 'seeker_gland'),
    vx: dir.x * st.speed, vy: dir.y * st.speed, maxAge: st.maxAge, hitOnce: true, color: DNA_CATEGORY_COLORS.projectile
  });
  h.homing = st.turn; h.speed = st.speed; h.side = friendlySide(e);
  world.events.push({ type: 'seeker_launch', entityId: e.id });
}

function chemotaxisPull(world, e, dt) {
  const st = ORGANELLES.chemotaxis_cilia.stats;
  const pull = st.pull * orgCount(e, 'chemotaxis_cilia') * potency(world, e, 'chemotaxis_cilia') * dt;
  for (const f of world.fields) {
    const d = distWrap(e.x, e.y, f.x, f.y); if (d < 6 || d > st.radius) continue;
    const dir = norm(dxWrap(f.x, e.x), e.y - f.y);
    const step = Math.min(pull, d - 4);
    f.x = wrapX(f.x + dir.x * step); f.y += dir.y * step;
  }
  for (const q of world.particles) {
    const d = distWrap(e.x, e.y, q.x, q.y); if (d < 6 || d > st.radius) continue;
    const dir = norm(dxWrap(q.x, e.x), e.y - q.y);
    q.vx += dir.x * pull * 4; q.vy += dir.y * pull * 4;
  }
}

function orbitalDamage(world, e, living, dt) {
  const st = ORGANELLES.orbital_spores.stats;
  const bodies = st.count * orgCount(e, 'orbital_spores');
  const power = st.damage * potency(world, e, 'orbital_spores') * dt;
  for (let k = 0; k < bodies; k++) {
    const ang = world.t * st.spin + (k / bodies) * Math.PI * 2;
    const ox = e.x + Math.cos(ang) * (e.r + st.orbitDist);
    const oy = e.y + Math.sin(ang) * (e.r + st.orbitDist);
    for (const o of living) {
      if (!areHostile(e, o)) continue;
      if (distWrap(ox, oy, o.x, o.y) <= st.radius + o.r) { hurt(world, o, power, e.id); afterDamage(world, e, o, power); }
    }
  }
}

// Harpoon Spine: an aimed, tethered projectile that yanks the struck body toward you.
function harpoonPulse(world, entity, aimX = null, aimY = null) {
  if (!hasOrg(entity, 'harpoon_spine')) return false;
  const o = ORGANELLES.harpoon_spine.stats;
  entity.cooldowns ||= {};
  if ((entity.cooldowns.harpoon || 0) > 0 || !hasEnergy(entity, o.energyCost)) return false;
  entity.cargo.energy -= o.energyCost; entity.cooldowns.harpoon = o.cooldown;
  let ax = aimX ?? Math.cos(entity.phase), ay = aimY ?? Math.sin(entity.phase);
  const n = norm(ax, ay); ax = n.x; ay = n.y;
  entity.phase = Math.atan2(ay, ax);
  const h = spawnToxicHazard(world, entity.x + ax * (entity.r + 12), entity.y + ay * (entity.r + 12), {
    kind: 'harpoon', sourceId: entity.id, radius: 10, damage: o.damage * potency(world, entity, 'harpoon_spine'),
    vx: ax * o.speed + entity.vx * 0.2, vy: ay * o.speed + entity.vy * 0.2, maxAge: o.maxAge, hitOnce: true, color: DNA_CATEGORY_COLORS.projectile
  });
  h.pull = o.pull; h.side = friendlySide(entity);
  world.events.push({ type: 'harpoon_launch', entityId: entity.id });
  return true;
}

// Pheromone Gland: launch a sticky death-pheromone blob. The first hostile it hits
// is "marked" — the owner's swarm converges on it and it bleeds faster (vulnerability).
function markPulse(world, entity, aimX = null, aimY = null) {
  if (!hasOrg(entity, 'pheromone_gland')) return false;
  const o = ORGANELLES.pheromone_gland.stats;
  entity.cooldowns ||= {};
  if ((entity.cooldowns.mark || 0) > 0) return false;
  if (!hasEnergy(entity, o.energyCost) || (entity.cargo.spores || 0) < o.sporeCost) return false;
  entity.cargo.spores -= o.sporeCost; entity.cargo.energy -= o.energyCost; entity.cooldowns.mark = o.cooldown;
  let ax = aimX ?? Math.cos(entity.phase), ay = aimY ?? Math.sin(entity.phase);
  const n = norm(ax, ay); ax = n.x; ay = n.y;
  entity.phase = Math.atan2(ay, ax);
  const h = spawnToxicHazard(world, entity.x + ax * (entity.r + 12), entity.y + ay * (entity.r + 12), {
    kind: 'mark_blob', sourceId: entity.id, radius: 12, damage: 0,
    vx: ax * o.markSpeed + entity.vx * 0.2, vy: ay * o.markSpeed + entity.vy * 0.2, maxAge: o.markMaxAge, hitOnce: true, color: DNA_CATEGORY_COLORS.swarm
  });
  h.side = friendlySide(entity); h.markDur = o.markDur * potency(world, entity, 'pheromone_gland');
  world.events.push({ type: 'mark_launch', entityId: entity.id });
  return true;
}

// Engulf (enzyme-fueled instakill): the phagocyte maw digests an overlapping hostile
// that is smaller than you or already wounded — spend one enzyme, gain its biomass.
function engulfPulse(world, e) {
  if (!hasOrg(e, 'phagosome')) return false;
  const o = CONSUMABLES.engulf;
  e.cooldowns ||= {};
  if ((e.cooldowns.engulf || 0) > 0 || (e.cargo.enzymes || 0) < o.enzyme || !hasEnergy(e, o.energyCost)) return false;
  let best = null, bestScore = -Infinity;
  for (const b of world.entities) {
    if (!b.alive || b.id === e.id || !areHostile(e, b)) continue;
    if (distWrap(e.x, e.y, b.x, b.y) > e.r + b.r) continue;
    const eligible = b.r < e.r * o.sizeRatio || b.hp <= caps(b).hp * o.hpFrac;
    if (!eligible) continue;
    const score = b.r - distWrap(e.x, e.y, b.x, b.y) * 0.02;
    if (score > bestScore) { bestScore = score; best = b; }
  }
  if (!best) return false;
  e.cargo.enzymes -= o.enzyme; e.cargo.energy -= o.energyCost; e.cooldowns.engulf = o.cooldown;
  const gain = o.biomassBase + best.r * o.biomassPerR;
  e.cargo.biomass = Math.min(caps(e).biomass, (e.cargo.biomass || 0) + gain);
  hurt(world, best, caps(best).hp + 999, e.id);
  world.events.push({ type: 'engulf', entityId: e.id });
  return true;
}

// Ward (crystal-fueled): spend a crystal to lattice the membrane for a few seconds —
// harder skin, reflected damage, and your shots pierce while the ward holds.
function wardPulse(world, e) {
  if (!hasOrg(e, 'crystal_ward')) return false;
  const o = CONSUMABLES.ward;
  e.cooldowns ||= {};
  if ((e.cooldowns.ward || 0) > 0 || (e.cargo.crystals || 0) < o.crystal || !hasEnergy(e, o.energyCost)) return false;
  e.cargo.crystals -= o.crystal; e.cargo.energy -= o.energyCost; e.cooldowns.ward = o.cooldown;
  e.warded = o.dur;
  world.events.push({ type: 'ward', entityId: e.id });
  return true;
}

// Foraging return: a symbiont near its host hands over surplus biomass and lipids,
// keeping a small reserve to fuel itself. This is what makes the grazer swarm an economy.
function deliverToOwner(world, e, owner, dt) {
  const rate = ORGANELLES.pheromone_gland.stats.deliverRate;
  const cap = caps(owner);
  let moved = 0;
  for (const [res, keep] of [['biomass', 6], ['lipids', 2]]) {
    const surplus = (e.cargo[res] || 0) - keep;
    if (surplus <= 0.2) continue;
    const room = Math.max(0, (cap[res] ?? 0) - (owner.cargo[res] || 0));
    const amt = Math.min(surplus, room, rate * dt);
    if (amt > 0) { e.cargo[res] -= amt; owner.cargo[res] += amt; moved += amt; }
  }
  if (moved > 0 && owner.kind === 'player') {
    e.cooldowns ||= {};
    if ((e.cooldowns.deliver || 0) <= 0) { world.events.push({ type: 'deliver', entityId: owner.id }); e.cooldowns.deliver = 2.5; }
  }
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
  const th = spawnToxicHazard(world, entity.x + ax * (entity.r + 18), entity.y + ay * (entity.r + 18), {
    kind: 'toxic_projectile', sourceId: entity.id, radius: 11, damage: o.projectileDamage,
    vx: ax * o.projectileSpeed + entity.vx * 0.25, vy: ay * o.projectileSpeed + entity.vy * 0.25,
    maxAge: 0.78, hitOnce: true
  });
  if ((entity.warded || 0) > 0) th.pierce = true; // overcharged: warded shots punch through
  world.events.push({ type: 'toxic_launch', entityId: entity.id });
  return true;
}

// Combination armament: packs toxins AND spores into one heavy glob. Hits harder
// than the plain launcher, splashes wider, and bursts into a lingering cloud.
function sporePulse(world, entity, aimX = null, aimY = null) {
  if (!hasOrg(entity, 'spore_toxin_launcher')) return false;
  const o = ORGANELLES.spore_toxin_launcher.stats;
  entity.cooldowns ||= {};
  if ((entity.cooldowns.sporeLauncher || 0) > 0) return false;
  if (!hasEnergy(entity, o.energyCost) || (entity.cargo.toxins || 0) < o.toxinCost || (entity.cargo.spores || 0) < o.sporeCost) return false;
  entity.cargo.toxins -= o.toxinCost;
  entity.cargo.spores -= o.sporeCost;
  entity.cargo.energy -= o.energyCost;
  entity.cooldowns.sporeLauncher = o.cooldown;
  let ax = aimX ?? Math.cos(entity.phase), ay = aimY ?? Math.sin(entity.phase);
  const n = norm(ax, ay); ax = n.x; ay = n.y;
  entity.phase = Math.atan2(ay, ax);
  const sh = spawnToxicHazard(world, entity.x + ax * (entity.r + 20), entity.y + ay * (entity.r + 20), {
    kind: 'spore_projectile', sourceId: entity.id, radius: 14, damage: o.projectileDamage * potency(world, entity, 'spore_toxin_launcher'),
    color: DNA_CATEGORY_COLORS.launcher,
    vx: ax * o.projectileSpeed + entity.vx * 0.25, vy: ay * o.projectileSpeed + entity.vy * 0.25,
    maxAge: 0.9, hitOnce: true
  });
  if ((entity.warded || 0) > 0) sh.pierce = true; // overcharged: warded shots punch through
  world.events.push({ type: 'spore_launch', entityId: entity.id });
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
          entity._capsEpoch = -1; // colony shrank — caps() must drop its organelles
          entity.r = Math.max(entity.baseR, entity.r - seg.r * 0.6);
          world.events.push({ type: 'colony_segment_lost', entityId: entity.id, label: seg.label });
        }
      }
    }
  }
  if (entity.hp <= 0 && entity.alive) {
    entity.alive = false;
    world.stats.deaths += 1;
    world.events.push({ type: 'death', entityId: entity.id, sourceId });
    // Volatile Vacuole: the dying body detonates, regardless of what killed it.
    if (hasOrg(entity, 'volatile_vacuole')) {
      const st = ORGANELLES.volatile_vacuole.stats;
      spawnToxicHazard(world, entity.x, entity.y, { kind: 'blast', sourceId: null, radius: st.radius, damage: st.damage * potency(world, entity, 'volatile_vacuole'), maxAge: st.age, color: DNA_CATEGORY_COLORS.risk, hitOnce: true });
      if (entity.kind === 'player') world.events.push({ type: 'detonate', entityId: entity.id });
    }
    // On-kill riders belonging to the KILLER: necrotic bloom + fission budding.
    const killer = sourceId && sourceId !== entity.id ? world.entities.find(x => x.id === sourceId && x.alive) : null;
    if (killer) {
      if (hasOrg(killer, 'necrosis_gland')) {
        const st = ORGANELLES.necrosis_gland.stats;
        spawnToxicHazard(world, entity.x, entity.y, { kind: 'spore_cloud', sourceId: killer.id, radius: st.radius, damage: st.damage * potency(world, killer, 'necrosis_gland'), maxAge: st.age, color: DNA_CATEGORY_COLORS.execute });
      }
      if (hasOrg(killer, 'fission_bud') && world.rng() < ORGANELLES.fission_bud.stats.chance * potency(world, killer, 'fission_bud')) {
        budFriendly(world, killer, entity.x, entity.y);
      }
    }
  }
}

// Fission Bud: spawn a short-lived allied grazer that fights on the killer's side.
function budFriendly(world, owner, x, y) {
  const bud = spawnScavenger(world, { x: x + rand(world, -12, 12), y: y + rand(world, -12, 12) });
  bud.friendly = (owner.kind === 'player' || owner.friendly);
  bud.organelles.rasping_lamella = 1;
  bud.friendLife = ORGANELLES.fission_bud.stats.life;
  bud.color = '#7fffe0';
  if (owner.kind === 'player') world.events.push({ type: 'bud', entityId: owner.id });
}

function removeDead(world) {
  let playerReformed = false;
  for (let i = world.entities.length - 1; i >= 0; i--) {
    const e = world.entities[i];
    if (e.alive) continue;
    bloomDeath(world, e);
    if (e.kind === 'player') {
      playerReformed = true;
      // The player always re-forms in Yuki's tendrils at the top of the canopy —
      // the same place they began. Carried-but-unsequenced strain records survive
      // the death, so the long swim home to Yuki is where you bank your discoveries.
      const next = makeSoftBody(world, 'player', YUKI_SPAWN.x, YUKI_SPAWN.y, {
        r: 22, color: '#86d2ff', controller: 'human', trophicRole: 'anaerobic_scavenger', depthHome: YUKI_SPAWN.y,
        cargo: { biomass: 5, lipids: 4, energy: 18, toxins: 3, spores: 0, enzymes: 0, crystals: 0, dna: 0 }, organelles: { membrane: 1, basal_motility: 1, membrane_intake: 1, anaerobic_processor: 1, storage_vacuole: 1, exotic_vacuole: 1 }, oxygen: oxygenAt(YUKI_SPAWN.y), grace: 2.5
      });
      next.carriedStrains = new Map(e.carriedStrains || []);
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
  // When the player dies, their independent colony scatters: symbionts and fission
  // buds dissolve rather than orphaning to a player id that no longer exists.
  if (playerReformed) {
    for (let i = world.entities.length - 1; i >= 0; i--) {
      const e = world.entities[i];
      if (e.controller === 'companion' || e.friendLife > 0) world.entities.splice(i, 1);
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
  if (e.kind !== 'player' && !e.friendly) {
    const deep = e.y - WORLD.canopy;
    if (deep > 780 && world.rng() < 0.7) spawnParticle(world, 'spores', e.x, e.y, Math.ceil(deep / 1400));
    if (deep > 1120 && world.rng() < 0.58) spawnParticle(world, choice(world, ['enzymes', 'crystals']), e.x, e.y, 1);
    const player = getPlayer(world);
    if (player && (e.controller === 'protozoan' || e.controller === 'predator' || e.controller === 'algae' || e.controller === 'metazoan' || e.controller === 'brood') && world.rng() < (hasMito(player) ? 0.95 : 0.46)) {
      const dp = spawnParticle(world, 'dna', e.x, e.y, e.controller === 'metazoan' ? 3 : (e.controller === 'protozoan' || e.controller === 'brood') ? 2 : 1);
      // Mutant strains shed information about their signature organelle: the DNA
      // is tagged with that organelle's id (the discovery key) and colored by its
      // category. Wild kills drop plain white DNA — currency, but no unlock.
      if (e.strain && ORGANELLES[e.strain]) {
        dp.source = e.strain;
        dp.potency = e.strainPotency || 1;
        dp.color = DNA_CATEGORY_COLORS[ORGANELLES[e.strain].category] || COLORS.dna;
      }
    }
  }
}

function spawnTick(world, dt) {
  world.spawn.algae -= dt; world.spawn.npc -= dt; world.spawn.exotic -= dt;
  // A steadier, thinner rain: blooms drift in a few at a time from the canopy rather
  // than flooding the surface all at once.
  if (world.spawn.algae <= 0 && world.entities.filter(e => e.controller === 'algae').length < 20) {
    world.spawn.algae = rand(world, 1.1, 2.1);
    const mature = world.rng() < 0.34;
    spawnAlgae(world, mature ? { mature: true } : {});
  }
  // Predators are the dominant recurring spawn so the falls keep getting cropped.
  if (world.spawn.npc <= 0 && world.entities.length < 104) {
    world.spawn.npc = rand(world, 0.8, 1.7);
    const r = world.rng();
    if (r < 0.28) spawnScavenger(world);
    else if (r < 0.82) spawnPredator(world);
    else if (world.rng() < 0.16) spawnMetazoan(world); // rare deep colonial predator
    else if (world.rng() < 0.16) spawnBrood(world);    // rare deep swarm-director
    else spawnProtozoan(world);
  }
  if (world.spawn.exotic <= 0) {
    world.spawn.exotic = rand(world, 2.5, 5.2);
    const y = WORLD.nurseryBottom + rand(world, 120, 2500);
    spawnParticle(world, choice(world, ['spores', 'enzymes', 'crystals']), rand(world, 0, WORLD.w), y, 1);
  }
}

// Mutate a freshly spawned body into a strain: graft its signature exotic
// organelle (additively — never removing baseline organs), tint it, and seed
// whatever cargo it needs to actually use the trait. The body's `strain` field
// drives its DNA drop and lets the renderer mark it as a mutant worth hunting.
function applyStrain(world, e) {
  const pool = STRAINS[e.controller];
  if (!pool || !pool.length) return;
  if (world.rng() >= (STRAIN_CHANCE[e.controller] ?? 0.2)) return;
  const strain = pool[Math.floor(world.rng() * pool.length)];
  e.organelles[strain.org] = (e.organelles[strain.org] || 0) + 1;
  e.strain = strain.org;
  // This individual's private genome: it expresses (and will bequeath) this potency.
  // Normally distributed around 100% (sd 13%), so most mutants sit in the 80–120%
  // band but rare specimens roll far higher — the god-roll you hunt the froth for.
  e.strainPotency = clamp(gaussian(world.rng, 1.0, 0.13), 0.5, 1.8);
  e.color = strain.tint;
  // Give the strain the resources its signature organelle consumes, so the
  // mutant genuinely fights or metabolizes with the trait the player will loot.
  if (strain.org === 'spore_toxin_launcher') {
    e.cargo.spores = Math.max(e.cargo.spores || 0, 2);
    e.cargo.toxins = Math.max(e.cargo.toxins || 0, rand(world, 8, 16));
  } else if (strain.org === 'virulent_processor') {
    e.cargo.toxins = Math.max(e.cargo.toxins || 0, rand(world, 4, 10));
  } else if (strain.org === 'catalytic_processor') {
    e.cargo.enzymes = Math.max(e.cargo.enzymes || 0, 2);
  }
  clampCargo(e);
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
  applyStrain(world, e);
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
  // Predators stratify: they spawn anywhere from the top of the rupture layer down
  // into the shallow deep, and the deeper a body forms the bigger, tougher, and more
  // heavily armed it is. The column reads as distinct predator bands, not one seam.
  const y = opts.y ?? (WORLD.ruptureTop - 120 + rand(world, 0, 1900));
  const x = opts.x ?? rand(world, 0, WORLD.w);
  // 0 at the top of the rupture layer, 1 deep — drives every strength stat below.
  const depthT = clamp((y - WORLD.ruptureTop) / 1700, 0, 1);
  const e = makeSoftBody(world, 'npc', x, y, {
    r: rand(world, 20, 30) + depthT * 16, color: '#ff7897', controller: 'predator', trophicRole: 'rupture_predator', depthHome: y,
    organelles: { membrane: 2 + Math.round(depthT * 2), anaerobic_processor: 3 + Math.round(depthT * 2), flagella: 1, rasping_lamella: 1, storage_vacuole: 4, exotic_vacuole: 1, membrane_hardening: 1 + Math.round(depthT * 2) }, cargo: { biomass: rand(world, 24, 44), energy: rand(world, 34, 68), lipids: rand(world, 10, 30) }, oxygen: oxygenAt(y),
    ruptureThreshold: 0.48
  });
  const roll = world.rng();
  if (roll < 0.42 + depthT * 0.3) e.organelles.lance_bristle = 1 + Math.round(depthT);
  if (roll > 0.62 - depthT * 0.2) { e.organelles.toxin_launcher = 1; e.cargo.toxins = Math.max(e.cargo.toxins || 0, rand(world, 8, 18)); }
  applyStrain(world, e);
  assignBody(e);
  world.entities.push(e); return e;
}

// A deep body's silhouette comes from its strain's category (or a default plan for
// wild deep cells), so the deep reads as a menagerie instead of recolored blobs.
function assignBody(e) {
  if (e.strain && ORGANELLES[e.strain]) {
    e.bodyPlan = DEEP_BODY_BY_CATEGORY[ORGANELLES[e.strain].category]
      || (e.controller === 'protozoan' ? 'ciliate' : 'amoeba');
  } else if (e.controller === 'protozoan') e.bodyPlan = 'ciliate';
  else if (e.controller === 'predator') e.bodyPlan = 'amoeba';
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
  applyStrain(world, e);
  assignBody(e);
  world.entities.push(e); return e;
}

// Symbiont: an independent friendly cell recruited at Yuki. It swims beside the
// player and fights on the player's side, but it is its own body — it can die.
function spawnCompanion(world, owner, type) {
  const def = COMPANIONS[type] || COMPANIONS.grazer;
  const ang = world.rng() * Math.PI * 2;
  const e = makeSoftBody(world, 'npc', owner.x + Math.cos(ang) * (owner.r + 20), owner.y + Math.sin(ang) * (owner.r + 20), {
    r: def.r, color: def.color, controller: 'companion', trophicRole: 'symbiont', depthHome: owner.y,
    organelles: { ...def.organelles }, cargo: { ...def.cargo }, oxygen: oxygenAt(owner.y) * 0.4, grace: 3.0
  });
  e.friendly = true;
  e.ownerId = owner.id;
  e.companionType = type;
  e.bodyPlan = def.bodyPlan;
  world.entities.push(e);
  return e;
}

// Deep metazoan: the abyss's answer to the player's own colony. A large lead cell
// with its own mitochondria, wearing a body of 2–4 somatic sub-cells (a real
// e.colony, the same structure the player builds). Tanky, slow, and — because its
// lead can mutate — a jackpot of exotic DNA when finally cracked open.
function spawnMetazoan(world, opts = {}) {
  const y = opts.y ?? (WORLD.deepTop + rand(world, 700, 2400));
  const x = opts.x ?? rand(world, 0, WORLD.w);
  const e = makeSoftBody(world, 'npc', x, y, {
    r: rand(world, 42, 60), color: '#b060d0', controller: 'metazoan', trophicRole: 'colonial_predator', depthHome: y,
    organelles: { membrane: 4, anaerobic_processor: 4, mitochondrion: 1, flagella: 2, lance_bristle: 1, rasping_lamella: 1, toxin_launcher: 1, storage_vacuole: 8, exotic_vacuole: 2, dna_memory_vesicle: 2, membrane_hardening: 3 },
    cargo: { biomass: rand(world, 70, 120), energy: rand(world, 90, 150), lipids: rand(world, 40, 80), toxins: rand(world, 10, 24) }, oxygen: oxygenAt(y),
    ruptureThreshold: 0.7
  });
  // Build the multicellular body: each sub-cell is its own small cell with organs.
  const segCount = 2 + Math.floor(world.rng() * 3);
  e.colony = [];
  for (let i = 0; i < segCount; i++) {
    const segOrg = { membrane: 1 + Math.floor(world.rng() * 2), anaerobic_processor: 1 };
    if (world.rng() < 0.5) segOrg.mitochondrion = 1; // some somatic cells keep their own mitochondria
    const w = world.rng();
    if (w < 0.33) segOrg.lance_bristle = 1; else if (w < 0.66) segOrg.rasping_lamella = 1; else segOrg.membrane_hardening = 1;
    const sr = clamp(14 + (segOrg.membrane || 1) * 4, 12, 30);
    const shp = 60 + (segOrg.membrane || 1) * 30;
    e.colony.push({ id: id('seg'), label: 'Somatic Cell', organelles: segOrg, r: sr, hp: shp, maxHp: shp });
  }
  applyStrain(world, e); // the lead may mutate; its strain drops the exotic DNA
  e.maxHp = caps(e).hp; e.hp = e.maxHp; // colony membranes fold into a big HP pool
  e.bodyPlan = 'colonial';
  world.entities.push(e); return e;
}

// One member of a director's swarm: a small, fast, hostile grazer that leashes to its
// brood and rushes the brood's prey. Persists as a wild cell if its director dies.
function spawnSwarmAgent(world, brood) {
  const ang = world.rng() * Math.PI * 2;
  const e = makeSoftBody(world, 'npc', brood.x + Math.cos(ang) * (brood.r + 14), brood.y + Math.sin(ang) * (brood.r + 14), {
    r: rand(world, 9, 12), color: brood.color || '#5fe0a0', controller: 'swarm_agent', trophicRole: 'swarm_agent', depthHome: brood.y,
    organelles: { membrane: 2, basal_motility: 1, anaerobic_processor: 1, rasping_lamella: 1 },
    cargo: { energy: rand(world, 14, 26), biomass: rand(world, 4, 9) }, oxygen: oxygenAt(brood.y), grace: 1.2
  });
  e.ownerId = brood.id; e.bodyPlan = 'blob';
  world.entities.push(e); return e;
}

// Deep swarm-director: a cell that conducts its own hostile swarm and paints you with
// death-pheromones. Its signature gene IS the Pheromone Gland — hunt it to take swarm-
// command for yourself. It seeds an escort immediately and buds more over time.
function spawnBrood(world, opts = {}) {
  const y = opts.y ?? (WORLD.deepTop + rand(world, 500, 2200));
  const x = opts.x ?? rand(world, 0, WORLD.w);
  const e = makeSoftBody(world, 'npc', x, y, {
    r: rand(world, 34, 46), color: '#5fe0a0', controller: 'brood', trophicRole: 'swarm_director', depthHome: y,
    organelles: { membrane: 3, anaerobic_processor: 3, mitochondrion: 1, flagella: 1, rasping_lamella: 1, toxin_launcher: 1, pheromone_gland: 1, storage_vacuole: 5, exotic_vacuole: 3, dna_memory_vesicle: 2, membrane_hardening: 2 },
    cargo: { biomass: rand(world, 50, 90), energy: rand(world, 80, 130), lipids: rand(world, 30, 60), toxins: rand(world, 8, 18), spores: rand(world, 6, 12) }, oxygen: oxygenAt(y),
    ruptureThreshold: 0.66
  });
  e.strain = 'pheromone_gland'; // the DNA you hunt it for
  e.strainPotency = clamp(gaussian(world.rng, 1.0, 0.13), 0.5, 1.8);
  e.maxHp = caps(e).hp; e.hp = e.maxHp;
  e.bodyPlan = 'brood';
  world.entities.push(e);
  for (let i = 0; i < 2; i++) spawnSwarmAgent(world, e);
  return e;
}

function bestFieldFor(entity, world) {
  let best = null, bestScore = -Infinity;
  for (const f of world.fields) {
    const d = distWrap(entity.x, entity.y, f.x, f.y);
    if (d > 1300) continue; // far fields never win matter/(35+d); skip the reduce over stock
    const matter = totalMatter(f.stock); if (matter <= 0.5) continue;
    const depthPenalty = Math.abs(f.y - entity.depthHome) * 0.010;
    const toxinPenalty = (f.stock.toxins || 0) * (hasOrg(entity, 'toxin_launcher') ? 0.01 : 0.09);
    const score = matter / (35 + d) - depthPenalty - toxinPenalty;
    if (score > bestScore) { best = f; bestScore = score; }
  }
  return best;
}

function bestBodyTarget(entity, world, player) {
  if (!hasWeapon(entity)) return null;
  let best = null, bestScore = -Infinity;
  for (const other of world.entities) {
    if (!other.alive || other.id === entity.id) continue;
    if (entity.friendly && other.kind === 'player') continue;
    if (entity.friendly && other.friendly) continue; // allies never hunt allies
    if (other.friendly && entity.kind === 'player') continue;
    if (entity.controller === 'predator' && other.controller === 'protozoan') continue;
    const d = distWrap(entity.x, entity.y, other.x, other.y);
    // Distant bodies can never win the score (the -d/280 penalty alone sinks them, and
    // marks are only ever painted at close range), so skip the megamorphic stat reads
    // below for anything well out of hunting range. Big cut to the per-NPC scan cost.
    if (d > 1300) continue;
    const fallingValue = other.controller === 'algae' && (other.fallState === 'sinking' || other.y > WORLD.nurseryBottom) ? 3.0 : 0;
    const sizeValue = other.r / Math.max(10, entity.r);
    const weak = other.hp / Math.max(1, caps(other).hp) < 0.55 ? 1.3 : 0;
    // Live prey that strays close is aggravating — a predator locks onto whatever
    // swims through its space (the player is no safer than any scavenger).
    const proximityAggro = (other.controller !== 'algae' && d < 270) ? 3.0 * (1 - d / 270) : 0;
    // The froth smells weakness: a body running out of ATP draws the hunters in.
    const starving = (other.controller !== 'algae' && (other.cargo.energy || 0) < 1.5) ? 1.8 : 0;
    // Death-pheromone: the swarm converges on whatever its own director marked.
    const marked = ((other.marked || 0) > 0 && other.markedBy === entity.ownerId) ? 6.0 : 0;
    const score = fallingValue + sizeValue * 1.2 + weak + proximityAggro + starving + marked - d / 280 - Math.abs(other.y - entity.depthHome) / 1150;
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
    toxins: (hasOrg(entity, 'toxin_launcher') || hasOrg(entity, 'spore_toxin_launcher')) ? 0.55 : 0.10,
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
  // Exotics and DNA ARE picked up like coins — any body with an intake pore sweeps
  // up loose particles it swims over, no feeding action required, but only if the
  // matching storage organ has room. (Field matter still needs deliberate feeding.)
  if (feedingOrgCount(entity) <= 0) return 0;
  let collected = 0;
  const radius = feedRadius(entity);
  const c = caps(entity);
  for (let i = world.particles.length - 1; i >= 0; i--) {
    const p = world.particles[i];
    if (dist2Wrap(entity.x, entity.y, p.x, p.y) > radius * radius) continue;

    if (p.kind === 'dna') {
      if (entity.kind !== 'player') continue; // predators strip DNA for biomass in updateParticles
      const strain = (p.source && ORGANELLES[p.source]) ? p.source : null;
      const rolled = typeof p.potency === 'number' ? p.potency : 1;
      const best = strain ? Math.max((entity.carriedStrains && entity.carriedStrains.get(strain)) || 0, world.discoveredSources.get(strain) || 0) : 0;
      // Junk = an untagged strand (no genome to unlock) OR a strain no better than one you
      // carry/know. Nuclease Vesicle dissolves it into a scrap of biomass on contact, so it
      // never takes a DNA slot — works even when the store is full. Good genomes fall through.
      const isJunk = !strain || rolled <= best + 1e-6;
      if (isJunk && hasOrg(entity, 'nuclease_vesicle')) {
        const room = Math.max(0, (c.biomass ?? 0) - (entity.cargo.biomass || 0));
        if (room > 0) entity.cargo.biomass += Math.min(room, p.value);
        world.events.push({ type: 'digest_dna', entityId: entity.id });
        world.particles.splice(i, 1); collected += p.value;
        continue;
      }
      // You sweep up any DNA you have STORAGE room for — junk and treasure alike. What it
      // is worth is decided later, at Yuki: sequencing renders junk to biomass and locks
      // good genomes into the shop. So DNA storage is the real investment, and choosing
      // NOT to top up on junk on the way down (to save room for deep genomes) is the play.
      const dnaRoom = (c.dna ?? 0) - (entity.cargo.dna || 0);
      if (dnaRoom <= 1e-9) continue; // store is full — invest in more storage, or be choosier
      // Partial pickup: take as many records as fit; the rest stays in the water.
      const take = Math.min(dnaRoom, p.value);
      entity.cargo.dna += take; world.stats.dnaRead += take;
      if (strain) {
        entity.carriedStrains ||= new Map();
        // Track the best genome per trait — that's the "good" DNA that will upgrade the shop.
        if (rolled > best + 1e-6) {
          entity.carriedStrains.set(strain, rolled);
          world.events.push({ type: 'sample', source: strain, name: ORGANELLES[strain].name, potency: rolled, upgrade: world.discoveredSources.has(strain) });
        }
      }
      p.value -= take;
      world.events.push({ type: 'particle', entityId: entity.id, kind: 'dna', value: take });
      if (p.value <= 1e-9) world.particles.splice(i, 1);
      collected += take;
      continue;
    }

    // Partial pickup: a body sweeps up as much of a particle as its storage can hold,
    // so a value-2/3 exotic drop (deep spore clusters!) is still collectible one at a
    // time with a single-slot rack. This is THE fix for "spores won't pick up".
    const cap = c[p.kind] ?? 0;
    const room = cap - (entity.cargo[p.kind] || 0);
    if (room <= 1e-9) continue;
    const take = Math.min(room, p.value);
    entity.cargo[p.kind] = (entity.cargo[p.kind] || 0) + take;
    p.value -= take;
    world.events.push({ type: 'particle', entityId: entity.id, kind: p.kind, value: take });
    if (p.value <= 1e-9) world.particles.splice(i, 1);
    collected += take;
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
  const p = { id: id('particle'), kind, x: wrapX(x + rand(world, -18, 18)), y: clamp(y + rand(world, -18, 18), WORLD.canopy, WORLD.h), value, vx: rand(world, -24, 24), vy: rand(world, -18, 18), age: 0, maxAge: kind === 'dna' ? 9 : 24, color: COLORS[kind] || '#fff' };
  world.particles.push(p);
  return p;
}

export function getAvailableActions(world, entityId = world.playerId) {
  CAPS_EPOCH++; // external read entry point — never serve a stale caps() memo
  const e = world.entities.find(x => x.id === entityId);
  if (!e) return [];
  const powered = hasEnergy(e);
  const actions = [];
  if (orgCount(e, 'basal_motility') > 0 || orgCount(e, 'flagella') > 0) actions.push({ id: 'move', label: 'Swim', enabled: powered });
  if (feedingOrgCount(e) > 0) actions.push({ id: 'feed', label: 'Feed', enabled: powered });
  if (hasOrg(e, 'lipid_repair_loom')) actions.push({ id: 'repair', label: 'Repair', enabled: powered && (e.cargo.lipids || 0) > 0 });
  if (hasRasp(e)) { const rl = hasOrg(e, 'rasping_lamella') ? 'Rasp' : hasOrg(e, 'siphon_rasp') ? 'Siphon' : 'Leech'; actions.push({ id: 'rasp', label: rl, enabled: powered }); }
  if (hasOrg(e, 'dash_vacuole')) actions.push({ id: 'dash', label: 'Dash', enabled: powered && (e.cargo.energy || 0) >= ORGANELLES.dash_vacuole.stats.energyCost });
  if (hasOrg(e, 'toxin_launcher')) { const acidStats = ORGANELLES.toxin_launcher.stats; actions.push({ id: 'acid', label: 'Toxic Launcher', enabled: powered && (e.cargo.toxins || 0) >= acidStats.toxinCost && (e.cargo.energy || 0) >= acidStats.energyCost }); }
  if (hasOrg(e, 'spore_toxin_launcher')) { const st = ORGANELLES.spore_toxin_launcher.stats; actions.push({ id: 'sporeshot', label: 'Sporo-Toxic Launcher', enabled: powered && (e.cargo.toxins || 0) >= st.toxinCost && (e.cargo.spores || 0) >= st.sporeCost && (e.cargo.energy || 0) >= st.energyCost }); }
  if (hasOrg(e, 'harpoon_spine')) { const st = ORGANELLES.harpoon_spine.stats; actions.push({ id: 'harpoon', label: 'Harpoon Spine', enabled: powered && (e.cargo.energy || 0) >= st.energyCost }); }
  if (hasOrg(e, 'pheromone_gland')) { const st = ORGANELLES.pheromone_gland.stats; actions.push({ id: 'mark', label: 'Mark Target', enabled: powered && (e.cargo.energy || 0) >= st.energyCost && (e.cargo.spores || 0) >= st.sporeCost }); }
  if (hasOrg(e, 'phagosome')) { const o = CONSUMABLES.engulf; actions.push({ id: 'engulf', label: 'Engulf', enabled: powered && (e.cargo.enzymes || 0) >= o.enzyme && (e.cargo.energy || 0) >= o.energyCost }); }
  if (hasOrg(e, 'crystal_ward')) { const o = CONSUMABLES.ward; actions.push({ id: 'ward', label: 'Crystal Ward', enabled: powered && (e.cargo.crystals || 0) >= o.crystal && (e.cargo.energy || 0) >= o.energyCost }); }
  if (hasOrg(e, 'toxin_cloud')) actions.push({ id: 'cloud', label: 'Cloud', enabled: powered && (e.cargo.toxins || 0) >= ORGANELLES.toxin_cloud.stats.toxinCost && (e.cargo.energy || 0) >= ORGANELLES.toxin_cloud.stats.energyCost });
  actions.push({ id: 'yuki', label: 'Yuki', enabled: nearYuki(world, e) });
  return actions;
}

export function nearYuki(world, entity = getPlayer(world)) { return !!entity && entity.y < WORLD.canopy + 220; }

export function getYukiOfferings(world, entityId = world.playerId) {
  CAPS_EPOCH++; // external read entry point — never serve a stale caps() memo
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
    const needsDiscovery = !!o.requiresDiscovery && !(world.discoveredSources || new Set()).has(o.requiresDiscovery);
    const atCompanionCap = !!o.companion && companionCount(world, entityId) >= swarmCap(e);
    const incubating = o.id === 'mitochondrial_eucharist' && !!e.incubating;
    const affordable = hasStock(e.cargo, o.cost);
    const locked = !!owned || !!maxed || needsMito || needsNoMito || needsOrg || needsHost || needsDiscovery || atCompanionCap || incubating || !affordable;
    const reasons = [];
    if (owned || maxed) reasons.push('already grafted or maxed');
    if (needsMito) reasons.push('requires mitochondrial Eucharist');
    if (needsNoMito) reasons.push('already integrated');
    if (needsOrg) reasons.push(`requires ${ORGANELLES[o.requiresOrganelle]?.name || o.requiresOrganelle}`);
    if (needsDiscovery) reasons.push(`undiscovered — harvest ${ORGANELLES[o.requiresDiscovery]?.name || o.requiresDiscovery} DNA`);
    if (atCompanionCap) reasons.push(swarmCap(e) <= 0 ? 'requires a Pheromone Gland to conduct a swarm' : `colony full — your ${orgCount(e, 'pheromone_gland')} gland(s) conduct ${swarmCap(e)} swarms`);
    if (needsHost) reasons.push(...readiness.reasons.slice(0, 3));
    if (incubating) reasons.push('incubation underway');
    if (!affordable) reasons.push(`needs ${fmtStock(missingStock(e.cargo, o.cost))}`);
    const category = o.organelle ? ORGANELLES[o.organelle]?.category || null : null;
    // Sequenced potency of this trait (the genome you locked in), plus the best
    // sample you're currently carrying — so the shop can flag an available upgrade.
    const potencyVal = (o.organelle && world.discoveredSources && world.discoveredSources.get) ? world.discoveredSources.get(o.organelle) ?? null : null;
    const carriedPotency = (o.organelle && e.carriedStrains && e.carriedStrains.get) ? e.carriedStrains.get(o.organelle) ?? null : null;
    return { ...o, costText: fmtStock(o.cost), locked, affordable, reasons, owned, maxed, undiscovered: needsDiscovery, category, potency: potencyVal, carriedPotency, tier3: o.section.includes('Tier 3'), readiness: o.id === 'mitochondrial_eucharist' ? readiness : null };
  });
  // Yuki sequences the strain records you carried home: one offering that flushes all
  // pending samples into permanent unlocks (or upgrades an already-known trait if the
  // sample rolled higher). This is where discovery happens.
  // Sequencing reads your WHOLE DNA store at once: good genomes (the best sample of each
  // trait) lock into the shop as unlocks/upgrades; every other strand is junk, rendered
  // into biomass. One button empties the tank, so DNA storage is how much you can bank
  // between Yuki visits — and topping up on junk on the way down costs you deep-genome room.
  const carried = [...((e.carriedStrains || new Map()).entries())].filter(([s]) => ORGANELLES[s]);
  const dnaHeld = Math.round(e.cargo.dna || 0);
  const junkCount = Math.max(0, dnaHeld - carried.length);
  const seqCost = { energy: 6 };
  const sequenceOfferings = dnaHeld > 0 ? [{
    id: 'sequence_dna', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'sequence',
    name: `Sequence Genome (${dnaHeld})`,
    desc: `Yuki reads your ${dnaHeld} DNA record${dnaHeld > 1 ? 's' : ''}: ${carried.length ? carried.map(([s, v]) => `${ORGANELLES[s].name} ${Math.round(v * 100)}%${world.discoveredSources.has(s) ? ' (upgrade)' : ''}`).join(', ') : 'no new traits'}${junkCount > 0 ? `; ${junkCount} junk strand${junkCount > 1 ? 's' : ''} → ${junkCount * JUNK_DNA_BIOMASS} biomass` : ''}.`,
    cost: seqCost, costText: fmtStock(seqCost),
    locked: !hasStock(e.cargo, seqCost), affordable: hasStock(e.cargo, seqCost),
    reasons: hasStock(e.cargo, seqCost) ? [] : [`needs ${fmtStock(missingStock(e.cargo, seqCost))}`],
    owned: false, maxed: false, undiscovered: false, category: null, potency: null, tier3: false, readiness: null
  }] : [];
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
  return [...sequenceOfferings, ...staticOfferings, ...attachOfferings];
}

function missingStock(cargo, cost = {}) { const m = {}; for (const [k, v] of Object.entries(cost)) if (k !== 'oxygen' && (cargo[k] || 0) < v) m[k] = v - (cargo[k] || 0); return m; }

export function buyOffering(world, offeringId, entityId = world.playerId) {
  CAPS_EPOCH++; // external read/mutate entry point — never serve a stale caps() memo
  const entity = world.entities.find(x => x.id === entityId);
  if (!entity) return { ok: false, reason: 'missing entity' };
  if (offeringId === 'sequence_dna') {
    const carried = [...((entity.carriedStrains || new Map()).entries())].filter(([s]) => ORGANELLES[s]);
    const dnaHeld = Math.round(entity.cargo.dna || 0);
    if (dnaHeld <= 0 && !carried.length) return { ok: false, reason: 'no DNA to sequence' };
    const cost = { energy: 6 };
    if (!hasStock(entity.cargo, cost)) return { ok: false, reason: `needs ${fmtStock(missingStock(entity.cargo, cost))}` };
    subStock(entity.cargo, cost);
    // Good genomes lock into the shop (the best sample of each trait).
    for (const [s, mult] of carried) {
      const upgrade = world.discoveredSources.has(s);
      world.discoveredSources.set(s, mult);
      entity.carriedStrains.delete(s);
      world.events.push({ type: 'discovery', source: s, name: ORGANELLES[s].name, potency: mult, upgrade });
    }
    // Every strand that wasn't a good genome is junk — Yuki renders it into biomass.
    const junkCount = Math.max(0, dnaHeld - carried.length);
    const biomassGain = junkCount * JUNK_DNA_BIOMASS;
    if (biomassGain > 0) entity.cargo.biomass = Math.min(caps(entity).biomass, (entity.cargo.biomass || 0) + biomassGain);
    // The whole tank is consumed: junk is spent, but the good records stay as graft currency.
    entity.cargo.dna = Math.max(0, dnaHeld - junkCount);
    clampCargo(entity);
    saveDiscoveries(world);
    world.events.push({ type: 'sequence', entityId, good: carried.length, junk: junkCount, biomass: biomassGain });
    world.events.push({ type: 'buy', entityId, offeringId });
    return { ok: true, offeringId, sequenced: carried.length, rendered: junkCount, biomass: biomassGain };
  }
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
  // Symbiotic colony: recruit an independent friendly cell that swims and fights beside you.
  if (offering.companion) {
    subStock(entity.cargo, offering.cost || {});
    spawnCompanion(world, entity, offering.companion);
    entity.organelles.companion_cell = companionCount(world, entityId);
    world.stats.spawnedCompanions += 1;
    clampCargo(entity);
    world.events.push({ type: 'companion', entityId, offeringId, companion: offering.companion });
    return { ok: true, offeringId };
  }
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
    entity._capsEpoch = -1;
  }
  if (offering.organelle) {
    entity.organelles[offering.organelle] = (entity.organelles[offering.organelle] || 0) + 1;
    entity._capsEpoch = -1; // organelles changed — force a caps() recompute
    if (offering.organelle === 'multicell_chassis') { entity.r += 8; entity.hp = Math.min(caps(entity).hp, entity.hp + 70); }
  }
  clampCargo(entity);
  world.events.push({ type: 'buy', entityId, offeringId });
  return { ok: true, offeringId };
}


export function getHudProjection(world, entityId = world.playerId) {
  CAPS_EPOCH++; // external read entry point — never serve a stale caps() memo
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
    discoveredSources: [...((world.discoveredSources || new Map()).entries())].map(([id, potency]) => ({ id, name: ORGANELLES[id]?.name || id, category: ORGANELLES[id]?.category || null, potency })),
    carriedStrains: [...((e.carriedStrains || new Map()).entries())].map(([id, potency]) => ({ id, name: ORGANELLES[id]?.name || id, category: ORGANELLES[id]?.category || null, potency, upgrade: (world.discoveredSources || new Map()).has(id) })),
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
  CAPS_EPOCH++; // external read entry point — never serve a stale caps() memo
  const entityProjection = world.entities.map(e => ({ id: e.id, kind: e.kind, x: e.x, y: e.y, vx: e.vx, vy: e.vy, r: e.r, hp: e.hp, maxHp: caps(e).hp, color: e.color, controller: e.controller, trophicRole: e.trophicRole, strain: e.strain || null, bodyPlan: e.bodyPlan || null, companionType: e.companionType || null, ownerId: e.ownerId || null, marked: (e.marked || 0) > 0 ? e.marked : 0, warded: (e.warded || 0) > 0 ? e.warded : 0, friendly: e.friendly, phase: e.phase, feedIntent: e.feedIntent, repairIntent: e.repairIntent, action: e.action, organelles: { ...e.organelles }, hit: e.hit, oxygen: e.oxygen, oxygenTolerance: oxygenTolerance(e), toxins: e.cargo.toxins || 0, toxinCap: caps(e).toxins, fallState: e.fallState, incubating: e.incubating ? { ...e.incubating } : null }));
  const colonyRender = [];
  for (const e of world.entities) {
    if (!e.colony || !e.colony.length) continue;
    // The same colony structure the player builds also wraps deep metazoans. Friendly
    // colonies read teal; a hostile metazoan's somatic cells wear its own body color.
    const side = friendlySide(e);
    const segColor = side ? '#7fffe0' : (e.color || '#b060d0');
    for (let i = 0; i < e.colony.length; i++) {
      const seg = e.colony[i];
      const ang = (i / e.colony.length) * Math.PI * 2 + (world.t * 0.15) * (side ? 0 : 1);
      const dist = e.r + seg.r + 4;
      colonyRender.push({
        id: seg.id, kind: 'colony_segment',
        x: e.x + Math.cos(ang) * dist, y: e.y + Math.sin(ang) * dist,
        vx: 0, vy: 0, r: seg.r, hp: seg.hp, maxHp: seg.maxHp,
        color: segColor, controller: side ? 'colony' : 'metazoan_cell', trophicRole: 'colony',
        bodyPlan: null, friendly: side, phase: ang, feedIntent: false, repairIntent: false,
        action: null, organelles: {}, hit: 0, oxygen: 0, oxygenTolerance: 0,
        toxins: 0, toxinCap: 0, fallState: null, incubating: null
      });
    }
  }
  // Orbital Spore-Bodies render as small circling daughter cells around their host.
  const orbitalRender = [];
  for (const e of world.entities) {
    if (!e.alive || !hasOrg(e, 'orbital_spores')) continue;
    const st = ORGANELLES.orbital_spores.stats;
    const bodies = st.count * orgCount(e, 'orbital_spores');
    for (let k = 0; k < bodies; k++) {
      const ang = world.t * st.spin + (k / bodies) * Math.PI * 2;
      orbitalRender.push({
        id: `${e.id}_orb${k}`, kind: 'orbital_spore',
        x: e.x + Math.cos(ang) * (e.r + st.orbitDist), y: e.y + Math.sin(ang) * (e.r + st.orbitDist),
        vx: 0, vy: 0, r: st.radius, hp: 1, maxHp: 1,
        color: DNA_CATEGORY_COLORS.orbital, controller: 'orbital', trophicRole: 'orbital',
        friendly: friendlySide(e), phase: ang, feedIntent: false, repairIntent: false,
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
    entities: [...entityProjection, ...colonyRender, ...orbitalRender],
    fields: world.fields.map(f => ({ id: f.id, x: f.x, y: f.y, radius: f.radius, stock: { ...f.stock }, density: f.density, sourceKind: f.sourceKind, age: f.age, maxAge: f.maxAge })),
    hazards: world.hazards.map(h => ({ id: h.id, kind: h.kind, x: h.x, y: h.y, vx: h.vx, vy: h.vy, radius: h.radius, age: h.age, maxAge: h.maxAge, color: h.color })),
    particles: world.particles.map(p => ({ id: p.id, kind: p.kind, x: p.x, y: p.y, value: p.value, color: p.color, source: p.source || null, potency: p.potency || null, age: p.age, maxAge: p.maxAge })),
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

export const __test = { clamp, wrapX, dxWrap, distWrap, feedFromFields, repairFromLipids, caps, fmtStock, hasStock, spawnScavenger, spawnAlgae, spawnPredator, spawnProtozoan, speedOf, feedRadius, feedRate, feedingOrgCount, totalMatter, oxygenTolerance, membraneHardness, membranePorosity, hostReadiness, biomassWeight, buoyancy, classifyBlueprint, snapshotCell, attachColonyCell, colonyOrgs, applyStrain, sporePulse, lanceDamage, contactDamage, hasRasp, STRAINS, potency, drainLeech, YUKI_SPAWN, adrenalFactor, areHostile, overlapAura, updateStrainSystems, harpoonPulse, gaussian, budFriendly, spawnCompanion, spawnMetazoan, companionCount, hasWeapon, assignBody, COMPANION_CAP, spawnBrood, spawnSwarmAgent, markPulse, swarmCap, conductSwarm, deliverToOwner, vulnerability, engulfPulse, wardPulse, membraneHardness, CONSUMABLES };
