// Eukaryotic Eucharist v1.3.3 graph kernel
// Oxygen ecology branch: the kernel owns environment, bodies, fields, progression, actions, and Yuki offerings.

export const VERSION = 'mobile_v1_3_3_predator_flow_eucharist_balance';

export const WORLD = Object.freeze({
  w: 2340,
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

export const COLORS = Object.freeze({
  biomass: '#5fd96b',   // green — construction slurry
  lipids: '#f0a63c',    // amber/orange — membrane fat (shifted off gold to separate from toxins)
  toxins: '#e8e22c',    // acid yellow — waste/venom (was lime, too close to biomass)
  energy: '#49b6ff',    // electric blue — ATP, its own distinct signal
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
  // Algae drift, photosynthesize, and DEFEND — never hunt. Only passive, metabolic,
  // and defensive genes live here: self-mending, oily fuel-synthesis, a thorned skin,
  // an acid pellicle. No spines, no lances, no mouths — a bloom has none of those.
  algae: [
    { org: 'jettison_vesicle', tint: '#a8e0d0' },
    { org: 'lipid_repair_loom', tint: '#4fbf6f' },
    { org: 'lipogenic_processor', tint: '#c9e86f' },
    { org: 'thorn_coat', tint: '#8fbf5f' },
    { org: 'corrosive_pellicle', tint: '#b6ff5a' },
    { org: 'membrane_hardening', tint: '#bfe8ff' },
    { org: 'aerocyst', tint: '#bfe8ff' },
    { org: 'catalase_vesicle', tint: '#8fd6c0' },
    { org: 'photolytic_vacuole', tint: '#8ef19e' },
    { org: 'oxygen_store', tint: '#9fe8c0' },
    { org: 'oxygen_tolerance', tint: '#b6f0a0' },
    { org: 'gas_gland', tint: '#a8f0d0' },
    { org: 'ballast_stone', tint: '#8fb08f' },
    { org: 'lipid_bladder', tint: '#d8e88f' }
  ],
  // Scavengers are foragers and parasites: the feeding mouths, the field-vacuum, the
  // emergency digester, the efficient gut, and BOTH leech organs (they parasitize, they
  // don't fight). The most common, shallowest kill — the on-ramp for utility exotics.
  scavenger: [
    { org: 'cytostome', tint: '#8ef19e' },
    { org: 'selective_membrane', tint: '#8ef19e' },
    { org: 'chemotaxis_cilia', tint: '#6fd6ff' },
    { org: 'enzyme_reserve', tint: '#ffd27a' },
    { org: 'clean_processor', tint: '#c8b6ff' },
    { org: 'leech_rasp', tint: '#8fe37a' },
    { org: 'leech_lance', tint: '#6fce8f' },
    { org: 'countercurrent_gill', tint: '#7fd6d0' },
    { org: 'pressure_bladder', tint: '#8fd0c8' },
    { org: 'ballast_siphon', tint: '#7fc0d6' },
    { org: 'oxidase_vesicle', tint: '#ffd6a0' },
    { org: 'anabolic_vesicle', tint: '#ffe0b0' },
    { org: 'phagosome', tint: '#ffb37a' }
  ],
  // Rupture predators are the armed hunters: charge lance, grinding saw, armor-auger,
  // predatory rasp, the harpoon, the adrenal surge, the dash-charge, and the hot
  // venom-fuel metabolism.
  predator: [
    { org: 'velocity_lance', tint: '#ff3d9a' },
    { org: 'cleavage_furrow', tint: '#ff9ad2' },
    { org: 'saw_lance', tint: '#c07fb0' },
    { org: 'rupture_auger', tint: '#ff5f8f' },
    { org: 'siphon_rasp', tint: '#c0304f' },
    { org: 'harpoon_spine', tint: '#3d9aff' },
    { org: 'adrenal_vesicle', tint: '#ff2d7a' },
    { org: 'spore_jet', tint: '#c9a0ff' },
    { org: 'virulent_processor', tint: '#ff6a4d' },
    { org: 'lance_bristle', tint: '#ff5f7a' },
    { org: 'dash_vacuole', tint: '#ff8f6a' },
    { org: 'lipolytic_vesicle', tint: '#ffb05a' },
    { org: 'combustion_vesicle', tint: '#ff8a3d' },
    { org: 'atp_reservoir', tint: '#ffd24d' }
  ],
  // Deep protozoans are the sophisticated ones: venom guns, electricity, cryo,
  // neurotoxin, homing spores, crystalline armor, necrotic blooms, and the catalytic
  // gut. The exotic-weapon core of the endgame.
  protozoan: [
    { org: 'spore_toxin_launcher', tint: '#b06dff' },
    { org: 'toxin_cloud', tint: '#9d5fff' },
    { org: 'discharge_vesicle', tint: '#ffe86f' },
    { org: 'cryo_vesicle', tint: '#8fd6ff' },
    { org: 'neuro_barb', tint: '#6faaff' },
    { org: 'seeker_gland', tint: '#4db8ff' },
    { org: 'crystal_ward', tint: '#bfe8ff' },
    { org: 'necrosis_gland', tint: '#c88a4d' },
    { org: 'catalytic_processor', tint: '#7fe0d0' },
    { org: 'hydrogenosome', tint: '#9d8fff' },
    { org: 'chemosynthetic_vesicle', tint: '#8fe0b0' },
    { org: 'gas_injector', tint: '#a8d8ff' },
    { org: 'barophilic_sheath', tint: '#7f9ad0' },
    { org: 'toxin_launcher', tint: '#b0d05f' },
    { org: 'mineralizing_gland', tint: '#bfd6e8' }
  ],
  // Colonial metazoans carry the multicellular genes: orbiting daughter-cells, fission
  // budding, whole-body engulfing, and the death-detonation of an unstable colony.
  metazoan: [
    { org: 'orbital_spores', tint: '#ffd24d' },
    { org: 'fission_bud', tint: '#ffc24d' },
    { org: 'phagocyte_maw', tint: '#ff8a3d' },
    { org: 'volatile_vacuole', tint: '#ff4d6a' },
    { org: 'nuclease_vesicle', tint: '#ffb84d' }
  ]
});
// Mutation frequency scales with DEPTH, per spawn: a canopy bloom mutates ~15% of the
// time, and by the deep floor of the rupture layer every body is a mutant. Applied by
// the entity's spawn-y, so it also rises within a species (a deep-rupture predator is
// far more likely mutated than a shallow one). Broods are handled separately — their
// gene (pheromone_gland) is always expressed.
function strainChanceAt(y) {
  const t = clamp((y - WORLD.canopy) / (3800 - WORLD.canopy), 0, 1);
  return 0.15 + t * 0.85;
}

// Every processor is one biomass→ATP flow with its own yield and toxic-waste
// signature; they coexist and stack. A body's metabolic character is the sum of
// which processors it carries. Lipogenic runs backwards and is handled separately.
const PROCESSORS = Object.freeze(['anaerobic_processor', 'clean_processor', 'virulent_processor', 'catalytic_processor', 'hydrogenosome']);
// Forward spines share one impact model; each type tunes damage, reach, and how
// hard it ramps with speed. Saw lances pin speed out entirely for flat grind.
const LANCES = Object.freeze(['lance_bristle', 'velocity_lance', 'saw_lance', 'leech_lance', 'rupture_auger']);
const RASP_ORGANS = Object.freeze(['rasping_lamella', 'siphon_rasp', 'leech_rasp']);
// Overlapping many bodies at once must NOT pay linearly. The k-th body an entity rasps/leeches
// in a single frame is scaled by 1/(1 + K*(k-1)), so total output grows ~logarithmically
// (harmonic-ish) instead of summing. K=1 → 1, ½, ⅓, ¼…; the FIRST victim is always full rate,
// so honest single-target combat is untouched — only "ride a raft of scavengers and drain them
// all at once" gets taxed. Reset per frame in the collision pass.
const OVERLAP_STACK_K = 1.0;
// ── Combustion: lipids are fuel, banked O2 is the oxidizer ───────────────────
// Fire is only as hot as its fuel and oxidizer. A body's O2 tank and lipid reserve
// jointly set a combustion multiplier that scales the Volatile Vacuole blast and the
// flamethrower stream, and firing BURNS that fuel — an empty tank pops weakly, a full,
// oxygen-charged, fat-rich body erupts. Ties combat back into the algal O2/lipid economy.
const FLAME_TICK = 2.4;       // flamethrower damage multiplier per contact tick — substantial reward for the hard-to-aim cone
const COMBUSTION = Object.freeze({
  o2Gain: 1.3,        // full O2 tank adds +130% to fire output
  lipidGain: 0.7,     // full lipid reserve adds +70%
  radiusGain: 0.5,    // full tanks make the fireball up to +50% wider
  blastO2Burn: 0.55,  // fraction of current O2 spent per detonation
  blastLipidBurn: 0.4 // fraction of current lipids spent per detonation
});
// ── Symbiotic colony: independent friendly cells ────────────────────────────
// The cheap, accessible alternative to becoming multicellular. A Multicell Chassis
// fuses archived cells INTO your body and needs the mitochondrial Eucharist; a
// symbiont is its own small cell that swims beside you and fights on your side —
// expendable, bought for plain matter, no Eucharist required. Buy a few and you are
// a swarm; graft the chassis and you are one large organism. Two different answers
// to "stop being alone in the froth."
const COMPANION_CAP = 6; // hard ceiling; the real cap scales with Pheromone Gland count (swarmCap)
const JUNK_DNA_BIOMASS = 10; // fallback biomass per junk strand when you have no exotic storage room
const JUNK_EXOTICS = Object.freeze(['spores', 'enzymes', 'crystals']); // junk DNA is rendered into whichever of these you're shortest on
// Grafting an organ is trauma, not a clean upgrade: the graft inflames the body (toxin
// surge) and tears membrane (HP hit). A gritty "initiation" — you graft, then recover.
const GRAFT_INITIATION = Object.freeze({ hpFrac: 0.09, hpMin: 7, toxins: 6 });
// Ballast trim (the diver's verb): flooding the oxygen vacuoles expels gas so the body
// goes dense and plunges. Venting is free, but it spends the internal O2 you need for
// lift, oxygen tolerance, and aerobic ATP — and you can only re-inflate in oxygenated
// water. So a heavy tank dives cheaply, but the deep is O2-poor and the ascent is earned.
const BALLAST = Object.freeze({ requires: 'oxygen_vacuole', trimRate: 0.16 }); // ballast-GAS pumped/vented per second at full W/S — an ANALOG trim, not a binary flood
const BALLAST_DRIFT_K = 6.0;      // how strongly gas-vs-weight buoyancy drives a ballast cell's vertical drift (submarine feel)
// The deepest creatures are dark-adapted — sunlight burns them like vampires. A body
// tagged photophobic (spawned in the deep) takes HP damage wherever light exceeds the
// threshold, so it cannot chase you up into the lit shallows without cooking. Surface
// dwellers (algae, the player) are never photophobic — light is their element.
// The dark lineages are true light-vampires: the tail is inhabitable, but the bright transition
// burns them quickly enough that light forms a meaningful spatial refuge.
const LIGHT_BURN = Object.freeze({ threshold: 0.30, rate: 90, slope: 22 });
// Oxygen (respiration FUEL) is split from ballast GAS (buoyancy). A bare cell has this base
// O2 fuel volume; more comes from the Oxygen Vesicle. Buoyancy comes only from ballast gas.
const BASE_OXYGEN_CAP = 0.62;
// Cytoplasm baseline: every body holds this much of each fluid with ZERO storage organs — equal to the
// yield of the old all-in-one Storage Vacuole, so a starter body (which no longer carries one) is
// unchanged. Per-fluid vacuoles (Biomass/Lipid/Toxin) and atp_reservoir stack capacity ON TOP. This
// removes the old chicken-and-egg where you needed storage before you could hold anything.
const BASE_BIOMASS_CAP = 22;
const BASE_LIPID_CAP = 14;
const BASE_TOXIN_CAP = 10;
const BASE_ENERGY_CAP = 24;
const BASE_BUOYANCY = 2.0;        // flat lift every body has (replaces the old oxygen×1.5 term)
const BASE_O2_SAFE_FRAC = 0.55;   // fraction of the O2 tank that is safe before overload poisons you
const O2_MITO_FRAC_BONUS = 0.15;  // each mitochondrion raises the safe fraction
const FEED_INHALE_RATE = 0.9;     // active O2 gulp multiplier while feeding in O2-rich water
const GAS_LEAK_K = 0.20;          // ballast-gas leak per unit membrane porosity per second (a trimmed bladder holds)
const MASS_TAX_K = 0.015;         // ATP/s drained per unit of STORED BIOMASS: biomass is metabolically active tissue with a basal upkeep, so hoarding bleeds ATP and biomass must FLOW (refine→lipids, spend→organs, ferment→ATP). Self-regulating: the drain opens ATP headroom → the processor burns biomass to refill → biomass never pools even at idle. A lean body barely feels it; a fat body pays constant rent — the physical basis of the low-biomass archetypes. [PLAYTEST DIAL]
// Ballast gas is produced ONLY as the offgas byproduct of the biomass→ATP processor (see the
// fermentation block) — there is no standalone biomass→gas drain, so a cell at full ATP holds its
// biomass. Buoyancy is about working that offgas + the reserve (vent to dive, ferment to refill).
// Algal bob-lifecycle (tuning): a bloom bloats in the canopy light, sinks under its own weight,
// then in the lightless deep ferments gas FASTER (scaled by depth) so it bottoms out and rides
// back up — a vertical bob whose depth/amplitude escalate with the bloom's size. The bright top
// is a steep heal band (bask to mend); the deep is attrition (climb back to Yuki or dissolve).
const ALGAE_DEEP_FERMENT_K = 1.6; // deep blooms ferment lift-gas up to (1+K)× faster → they bottom out & rise
const ALGAE_LIGHT_GAS_VENT_K = 0.040; // bright-water gas vent / s: the broader shelf still heats/vents a bloated bloom into its next descent
const ALGAE_HEAL = 16;            // HP/s regained per unit light — strong at the canopy, ~0 in the dark
const ALGAE_DEEP_ATTR = 1.4;      // HP/s lost in the true deep (below the rupture), × depth fraction
const ALGAE_BLOAT_K = 0.85;       // radius bloat per √(structural mass) — a fat, deep-diving bloom reads big
// Resource fields drift by what they're made of, so matter stratifies in the column:
// heavy biomass slurry sinks (faster the more biomass it holds — big falls plummet),
// buoyant lipids float up toward the canopy, and volatile ATP/toxins diffuse outward into
// thinning clouds instead of sitting as fixed dots. All read from the patch's own stock —
// no ambient current. Tuning dials, set by sim_eval.
const FIELD_SINK_K = 0.9;         // biomass sink speed = K * biomassFrac * sqrt(biomass)
const FIELD_RISE_K = 1.1;         // lipid rise speed  = K * lipidFrac  * sqrt(lipids)
const FIELD_DIFFUSE_K = 6.0;      // radius spread/sec at full (energy+toxins) fraction
const FIELD_TERMINAL_VY = 30;     // px/s cap on field vertical drift, so patches never teleport
// Each added membrane (HP bar) costs geometrically more than the last — armor gets
// exponentially expensive, so a many-layered tank is a serious investment.
const MEMBRANE_COST_RATIO = (1 + Math.sqrt(5)) / 2; // golden ratio φ ≈ 1.618 per added layer

// ── Exotic cost escalation by organ CATEGORY ────────────────────────────────
// The exotic portion of an organ's price climbs with how many organs you already own IN THE SAME
// FUNCTIONAL CATEGORY — every copy counts. The curve is Fibonacci with a DOUBLE-1 start
// (1,1,2,3,5,8,13,21…): the first two organs in a category are base price, then it rises. Since exotic
// storage tops out at (racks ≤ 13), a category's exotic capstones become prohibitive ~6 organs deep —
// a specialization tax paid in the interesting currency. Only exotic keys escalate (biomass/lipids
// stay flat) and only organs that already cost an exotic pay, but exotic-free organs still count.
// TOXINS is the 4th escalation currency — a *self-manufactured* exotic (dirty fermentation waste), so
// the venom build pays an escalating toxin premium ON TOP of its category signature. Cheap early (you
// have surplus waste to dump), but geometric toxin costs quickly blow past a non-venom body's small
// toxin tank → forcing dedicated toxin storage that eats structure slots. Toxins stays in
// MATTER_RESOURCES for field/feeding/wealth logic (it's still self-made matter); this only makes its
// SHOP cost escalate.
const EXOTIC_KEYS = ['spores', 'enzymes', 'crystals', 'toxins'];
function fib(n) { let a = 1, b = 1; for (let i = 1; i < n; i++) { const t = a + b; a = b; b = t; } return a; }
// Capacity racks are EXEMPT from paying escalation AND from the tally: escalating them would soft-lock
// the economy (2nd rack costs more of an exotic than a 1-rack body can hold), and counting the 13
// racks would explode their own category and lock out its exotic organs.
const CATEGORY_EXEMPT = new Set(['exotic_vacuole', 'dna_memory_vesicle']);
// Functional buckets — mirror of index.html SHOP_GROUPS (keep the two in sync).
const ORGAN_CATEGORY = {
  membrane_intake: 'feeding', selective_membrane: 'feeding', cytostome: 'feeding', chemotaxis_cilia: 'feeding',
  anaerobic_processor: 'metabolism', oxidase_vesicle: 'metabolism', anabolic_vesicle: 'metabolism',
  lipolytic_vesicle: 'metabolism', mineralizing_gland: 'metabolism', clean_processor: 'metabolism',
  virulent_processor: 'metabolism', catalytic_processor: 'metabolism', lipogenic_processor: 'metabolism',
  hydrogenosome: 'metabolism', countercurrent_gill: 'metabolism', chemosynthetic_vesicle: 'metabolism',
  lipid_bladder: 'metabolism', enzyme_reserve: 'metabolism',
  membrane: 'structure', storage_vacuole: 'structure', biomass_vacuole: 'structure', lipid_vacuole: 'structure', toxin_vacuole: 'structure', atp_reservoir: 'structure', nuclease_vesicle: 'structure',
  membrane_hardening: 'structure', lipid_repair_loom: 'structure', thorn_coat: 'structure',
  corrosive_pellicle: 'structure', crystal_ward: 'structure', volatile_vacuole: 'structure',
  barophilic_sheath: 'structure', multicell_chassis: 'structure',
  photosystem: 'oxygen', oxygen_vacuole: 'oxygen', oxygen_store: 'oxygen', oxygen_tolerance: 'oxygen',
  jettison_vesicle: 'oxygen', gas_gland: 'oxygen', pressure_bladder: 'oxygen', ballast_siphon: 'oxygen',
  aerocyst: 'oxygen', catalase_vesicle: 'oxygen', photolytic_vacuole: 'oxygen', ballast_stone: 'oxygen',
  basal_motility: 'movement', flagella: 'movement', dash_vacuole: 'movement', spore_jet: 'movement',
  lance_bristle: 'weapons', rasping_lamella: 'weapons', toxin_launcher: 'weapons', phagosome: 'weapons',
  velocity_lance: 'weapons', saw_lance: 'weapons', rupture_auger: 'weapons', siphon_rasp: 'weapons',
  leech_rasp: 'weapons', leech_lance: 'weapons', spore_toxin_launcher: 'weapons', toxin_cloud: 'weapons',
  harpoon_spine: 'weapons', adrenal_vesicle: 'weapons', discharge_vesicle: 'weapons', cryo_vesicle: 'weapons',
  neuro_barb: 'weapons', seeker_gland: 'weapons', necrosis_gland: 'weapons', phagocyte_maw: 'weapons',
  orbital_spores: 'weapons', gas_injector: 'weapons', combustion_vesicle: 'weapons',
  pheromone_gland: 'swarm', fission_bud: 'swarm',
};
// Total organelle instances (every copy) owned in a category, minus the exempt capacity racks.
function categoryCount(entity, cat) {
  let n = 0;
  for (const [org, c] of Object.entries(entity.organelles || {})) {
    // Membrane is φ-scaled on its own and is bought constantly — counting it here would pollute
    // the 'structure' tally so a Storage Vacuole's crystal price jumps ahead of the 1,1,2,3,5 curve.
    if (CATEGORY_EXEMPT.has(org) || org === 'membrane') continue;
    if (ORGAN_CATEGORY[org] === cat) n += c;
  }
  return n;
}
// The Fibonacci multiplier a category-escalating organ pays right now (1 = base, no escalation).
function categoryMult(entity, offering) {
  const org = offering?.organelle;
  if (!org || org === 'membrane' || CATEGORY_EXEMPT.has(org)) return 1;
  const cat = ORGAN_CATEGORY[org];
  if (!cat) return 1;
  return fib(categoryCount(entity, cat) + 1);
}

function scaledCost(entity, offering) {
  const base = offering?.cost || {};
  const org = offering?.organelle;
  if (!org) return base;                     // exchanges, sequencing, eucharist, companions — untouched
  if (org === 'membrane') {                  // existing whole-cost φ scaling — UNCHANGED
    const f = Math.pow(MEMBRANE_COST_RATIO, Math.max(0, orgCount(entity, 'membrane') - 1));
    const c = {};
    for (const [k, v] of Object.entries(base)) c[k] = Math.ceil(v * f);
    return c;
  }
  const mult = categoryMult(entity, offering);  // exempt racks / uncategorised return 1
  if (mult <= 1) return base;
  const c = {};
  for (const [k, v] of Object.entries(base)) c[k] = EXOTIC_KEYS.includes(k) ? Math.ceil(v * mult) : v;
  return c;                                  // only exotic keys escalate; biomass/lipids/toxins flat
}
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
  projectile: 'ciliate', orbital: 'radial', feed: 'maw', guard: 'spiny', burst: 'jelly'
});

// Exotics are not just graft-currency — they are combustible verbs. Each one fuels
// an active (or automatic) ability that rides an organelle you already carry, so
// spending spores/enzymes/crystals is a moment-to-moment tactical choice.
const CONSUMABLES = Object.freeze({
  bloomDash: { spore: 1, impulseMult: 1.6, cloudRadius: 74, cloudDamage: 14, cloudAge: 2.0 }, // spores: dash → burst + spore cloud
  engulf: { enzyme: 1, energyCost: 2, sizeRatio: 1.15, hpFrac: 0.6, cooldown: 1.0, biomassBase: 10, biomassPerR: 1.2, selfDamageFrac: 0.5 }, // enzymes: instakill-digest, guaranteed genome, recoils for half the victim's remaining HP
  ward: { crystal: 1, energyCost: 3, dur: 5.0, hardness: 0.5, reflect: 0.5, cooldown: 6.0 }, // crystals: armor + reflect + pierce
  surge: { enzyme: 1, threshold: 0.12, convert: 18, efficiency: 3.6, cooldown: 5.0 } // enzymes: auto emergency biomass→ATP
});

// Organelles that express an individually-rolled potency (see potency() / applyStrain).
// Each mutant that carries one of these rolls its own multiplier when it spawns.
const VARIABLE_ORGANS = Object.freeze(['lipid_repair_loom', 'clean_processor', 'virulent_processor', 'lipogenic_processor', 'catalytic_processor', 'velocity_lance', 'saw_lance', 'siphon_rasp', 'spore_toxin_launcher', 'leech_rasp', 'leech_lance', 'rupture_auger', 'adrenal_vesicle', 'thorn_coat', 'corrosive_pellicle', 'discharge_vesicle', 'cryo_vesicle', 'chemotaxis_cilia', 'phagocyte_maw', 'necrosis_gland', 'volatile_vacuole', 'combustion_vesicle', 'seeker_gland', 'harpoon_spine', 'neuro_barb', 'orbital_spores', 'fission_bud', 'pheromone_gland']);

export const ORGANELLES = Object.freeze({
  membrane: {
    name: 'Cell Membrane', tier: 1, action: null, stackable: true, max: 8,
    desc: 'The enclosing bag of the organism. Each added layer is pure structure — more HP and a larger body. Oxygen capacity and tolerance come from the dedicated oxygen organs, not from stacking membrane.',
    stats: { hp: 105, porosity: 0.18, hardness: 0.18, bulk: 0.34 }
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
    stats: { rate: 0.60, energyPerBiomass: 3.15, toxinPerBiomass: 0.10, gasPerBiomass: 0.12 }
  },
  cytostome: {
    name: 'Cytostome Bloom', tier: 2, action: 'feed', stackable: true, max: 5, category: 'feed',
    desc: 'A wide, greedy gulp: it extends feeding radius and raw flow so you strip a field fast — but the membrane goes soft and vulnerable while the maw is open.',
    stats: { feedRadiusBonus: 10, feedRateBonus: 0.34, vulnerabilityBonus: 0.20 }
  },
  selective_membrane: {
    name: 'Selective Intake Membrane', tier: 3, action: null, stackable: false, max: 1, category: 'feed',
    desc: 'A discriminating intake skin sequenced from choosy feeders. It pulls ATP fastest, skews between biomass and lipids toward whichever tank is emptier, and screens out toxins — so you can graze fouled fields safely and refuel efficiently.',
    stats: { energyAffinity: 1.55, skew: 0.7, toxinFilter: 0.14 }
  },
  flagella: {
    name: 'Flagellum', tier: 2, action: null, stackable: true, max: 8,
    desc: 'One flagellum. Buy one, grow one. Each adds swimming force and a little lift.',
    stats: { speedBonus: 0.075, lift: 5.2 }
  },
  cleavage_furrow: {
    name: 'Cleavage Furrow', tier: 1, action: 'divide', stackable: false, max: 1,
    desc: 'The engine of binary fission — innate to the predator lineage (and you). Fill your ATP reservoir from the harvest of many kills — OR bank a full reserve of fat — and, with a little body mass to build from, it cleaves you into two cells, SPENDING ALL YOUR ATP and dropping both to lean reserves. Daughters drift genetically, so a self-splitting hunter population EVOLVES under selection: the ones that hunt well divide fastest, the ones that don\'t die out.',
    // Two paths to a division (see fissionReady): a FULL ATP reservoir (the fast, flavourful path — a
    // hunter that has stripped the charge from many kills) or a FULL fat reserve (the slow, robust
    // path). ATP is leaky (it powers weapons and doesn\'t bank), so a pure-ATP gate would starve the
    // prey-poor deep of any reproduction; lipids never burn, so a full-fat reserve is the safety net
    // that keeps a food-starved lineage alive. The split always drains ATP to zero and drops both
    // cells lean — so both immediately hunt hard to recharge (the eager-predator pulse).
    stats: { biomassFrac: 0.08, lipidFrac: 0.90, atpFrac: 0.70, childReserve: 0.15 }
  },
  lance_bristle: {
    name: 'Lance Bristle', tier: 2, action: null, stackable: true, max: 6,
    desc: 'One directional contact spine. Buy one, grow one. Damage scales by alignment, overlap, and movement speed.',
    stats: { damage: 22, length: 48, rupturePower: 0.92, alignmentFloor: 0.32, speedScale: 185, speedFloor: 30 }
  },
  storage_vacuole: {
    name: 'Storage Vacuole', tier: 2, action: null, stackable: true, max: 8,
    desc: 'One general storage organ. Expands biomass, lipids, toxins, and ATP. Also increases body size and swimming cost. (Wild/NPC generalist tank — the player shop stocks the dedicated per-fluid vacuoles instead.)',
    stats: { biomass: 22, lipids: 14, toxins: 10, energy: 24, bulk: 0.030 }
  },
  biomass_vacuole: {
    name: 'Biomass Vacuole', tier: 2, action: null, stackable: true, max: 12,
    desc: 'A dedicated biomass sac — pure construction-slurry capacity, nothing else. The FAT build stacks these into a huge biomass reserve on nothing but biomass (no exotics). A bigger belly means a bigger, slower body that costs more to armor.',
    stats: { biomass: 22, bulk: 0.032 }
  },
  lipid_vacuole: {
    name: 'Lipid Vacuole', tier: 2, action: null, stackable: true, max: 8,
    desc: 'A dedicated fat sac — pure lipid capacity. Fat is your light, tradeable wealth; a deeper lipid reserve also lends lift.',
    stats: { lipids: 16, bulk: 0.022 }
  },
  toxin_vacuole: {
    name: 'Toxin Vacuole', tier: 2, action: null, stackable: true, max: 8,
    desc: 'A dedicated venom sac — pure toxin capacity. The venom build needs it to hold the escalating toxin cost of its weapons without capping out.',
    stats: { toxins: 16, bulk: 0.022 }
  },
  atp_reservoir: {
    name: 'ATP Reservoir', tier: 3, action: null, stackable: true, max: 4, category: 'metabolic',
    desc: 'A dedicated high-capacity charge sac — pure ATP storage, nothing else. Innate to the predator lineage: hunters bank a deep reserve of stolen charge and stay topped-up, leaving the biomass and fat of their kills to the scavengers. Sequenced from a predator, it lets any cell hoard energy the way they do.',
    stats: { energy: 70, bulk: 0.020 }
  },
  exotic_vacuole: {
    name: 'Exotic Vesicle Rack', tier: 2, action: null, stackable: true, max: 13,
    desc: 'One specialty storage rack. Each rack explicitly provides one slot each for spores, enzymes, and crystals. No rack means no exotic storage.',
    stats: { spores: 1, enzymes: 1, crystals: 1, bulk: 0.016 }
  },
  dna_memory_vesicle: {
    name: 'DNA Memory Vesicle', tier: 3, action: null, stackable: true, max: 13,
    desc: 'A protected information vesicle. Each one explicitly stores one DNA record. DNA can be carried before it can be interpreted.',
    stats: { dna: 1, bulk: 0.012 }
  },
  lipid_repair_loom: {
    name: 'Lipid Repair Loom', tier: 3, action: 'repair', stackable: true, max: 5, category: 'metabolic',
    desc: 'A discovered repair organ. Consumes lipids and ATP to stitch the membrane. Harvested from the DNA of resilient, self-mending cells.',
    stats: { hpPerSecond: 2.45, lipidCost: 1.05, energyCost: 3.4 }
  },
  membrane_hardening: {
    name: 'Membrane Hardening Layer', tier: 3, action: null, stackable: true, max: 6, category: 'guard',
    desc: 'Adds tougher skin and lowers oxygen permeability. It protects and slows diffusion, but makes feeding and movement slightly clumsier.',
    stats: { hardnessBonus: 0.10, porosityReduction: 0.020, speedPenalty: 0.025, feedPenalty: 0.035 }
  },
  oxygen_tolerance: {
    name: 'Oxygen Tolerance Vesicle', tier: 2, action: null, stackable: true, max: 5,
    desc: 'Raises the FRACTION of your oxygen tank you can safely hold before it poisons you. Tolerance, not storage.',
    stats: { toleranceFracBonus: 0.09, porosityReduction: 0.010 }
  },
  oxygen_vacuole: {
    name: 'Ballast Bladder', tier: 2, action: null, stackable: true, max: 6,
    desc: 'Your gas-ballast tank. Fermentation byproduct fills it with lift-gas; it turns that gas into buoyancy. Flood it (hold S) to vent gas and dive; release (hold W) to hold trim. Diving needs this organ — nothing else gives lift.',
    stats: { gasCapBonus: 0.34, baseLift: 4.0, liftPerGas: 26 }
  },
  oxygen_store: {
    name: 'Oxygen Vesicle', tier: 2, action: null, stackable: true, max: 5,
    desc: 'Expands the internal oxygen you can bank as respiration FUEL for the oxidase / mitochondrion path. Capacity for the aerobic engine — not lift.',
    stats: { oxygenCapBonus: 0.34 }
  },
  jettison_vesicle: {
    name: 'Jettison Vesicle', tier: 2, action: 'jettison', stackable: true, max: 3,
    desc: 'Punch out a slug of your own biomass on command (T). You lose the mass, lurch upward, and spill a feed-field where you were — a deliberate ascent and an escape from a swarm.',
    stats: { ejectFraction: 0.20, ejectMin: 6, energyCost: 3, structuralShed: 0.5, thrust: 60, cooldown: 1.2 }
  },
  // ── Ballast / respiration organs (for the O2⟂ballast split) ──────────────────
  gas_gland: {
    name: 'Gas Gland', tier: 2, action: null, stackable: true, max: 4, category: 'metabolic',
    desc: 'Accelerates the fermentation of biomass into lift-gas, so you re-inflate your ballast (and float back up) far faster after a dive or a sink.',
    stats: { fermentBonus: 0.7 }
  },
  pressure_bladder: {
    name: 'Pressure Bladder', tier: 2, action: null, stackable: true, max: 5, category: 'guard',
    desc: 'A reinforced gas chamber that lets you pack in MORE ballast gas — a bigger float and a deeper reserve to blow when you dive.',
    stats: { gasCapBonus: 0.30 }
  },
  ballast_siphon: {
    name: 'Ballast Siphon', tier: 2, action: null, stackable: true, max: 4, category: 'guard',
    desc: 'A wide vent that dumps ballast gas faster while flooded — a sharper, quicker dive.',
    stats: { ventBonus: 0.6 }
  },
  aerocyst: {
    name: 'Aerocyst', tier: 3, action: null, stackable: true, max: 5, category: 'guard',
    desc: 'A rigid, permanently gas-filled float that never vents. It sets a lift floor beneath you — you can still dive against it, but you will never be stranded at the bottom.',
    stats: { fixedLift: 6.0 }
  },
  catalase_vesicle: {
    name: 'Catalase Vesicle', tier: 3, action: null, stackable: true, max: 5, category: 'guard',
    desc: 'An antioxidant store that neutralizes oxygen radicals, sharply raising the fraction of your O2 tank you can hold safely — sit in the bright, poisonous surface with a full breath.',
    stats: { toleranceFracBonus: 0.16 }
  },
  countercurrent_gill: {
    name: 'Countercurrent Gill', tier: 3, action: null, stackable: true, max: 5, category: 'metabolic',
    desc: 'A folded exchange membrane that pulls oxygen from the water far faster than bare diffusion — refill a deep breath quickly to fuel the aerobic engine.',
    stats: { uptake: 2.2 }
  },
  hydrogenosome: {
    name: 'Hydrogenosome', tier: 3, action: null, stackable: true, max: 6, category: 'metabolic',
    desc: 'A deep anaerobic organelle: ferments biomass to ATP while venting a heavy gush of lift-gas — a dark-water float engine that needs no light.',
    stats: { rate: 0.44, energyPerBiomass: 2.9, toxinPerBiomass: 0.07, gasPerBiomass: 0.22 }
  },
  photolytic_vacuole: {
    name: 'Photolytic Vacuole', tier: 3, action: null, stackable: true, max: 4, category: 'feed',
    desc: 'Splits water in the light to bank extra internal oxygen as respiration fuel — a photosynthetic breath for the mitochondrial path.',
    stats: { o2PerLight: 0.09 }
  },
  ballast_stone: {
    name: 'Ballast Stone', tier: 2, action: null, stackable: true, max: 4, category: 'guard',
    desc: 'A mineralized weight that makes you heavier — sink faster and hold the deep without constantly venting gas. The committed diver\'s anchor.',
    stats: { weight: 8.0 }
  },
  lipid_bladder: {
    name: 'Lipid Bladder', tier: 2, action: null, stackable: true, max: 5, category: 'metabolic',
    desc: 'A fat-filled float: your stored lipids are lighter than water, so a well-fed reserve gives lift on its own — buoyancy for the mitochondrial (fat-burning) build without fermenting gas.',
    stats: { lipidLift: 12 }
  },
  chemosynthetic_vesicle: {
    name: 'Chemosynthetic Vesicle', tier: 3, action: null, stackable: true, max: 5, category: 'metabolic',
    desc: 'Deep chemosynthesis: oxidizes your stored toxins (with a little biomass) into ATP — clean energy in the dark, and it scrubs the poison as it works.',
    stats: { rate: 0.5, biomassPerToxin: 0.5, atpPerToxin: 4, atpPerBiomass: 2 }
  },
  gas_injector: {
    name: 'Gas Injector', tier: 3, action: null, stackable: true, max: 4, category: 'control',
    desc: 'Pumps buoyant gas into anything you overlap, shoving it UPWARD. Float a deep hunter up into the lit shallows and the light burns it for you — turn the froth against the froth.',
    stats: { shove: 55 }
  },
  barophilic_sheath: {
    name: 'Barophilic Sheath', tier: 3, action: null, stackable: true, max: 4, category: 'guard',
    desc: 'A pressure-loving skin that stiffens as you descend — nearly useless at the surface, but armor plating in the crushing deep. Rewards committing to the dark.',
    stats: { hardnessPerDepth: 0.6 }
  },
  photosystem: {
    name: 'Photosystem Patch', tier: 2, action: null, stackable: true, max: 5,
    desc: 'The algae road: light grows biomass and exports oxygen stress. It makes abundance, weight, and eventual falling.',
    stats: { biomassGain: 1.6, oxygenWaste: 0.050, oxygenVent: 0.17 }
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
    stats: { rate: 0.40, energyPerBiomass: 2.85, toxinPerBiomass: 0.03, gasPerBiomass: 0.10 }
  },
  virulent_processor: {
    name: 'Virulent Processor', tier: 3, action: null, stackable: true, max: 6, category: 'metabolic',
    desc: 'A hot anaerobic flow harvested from venomous hunters: more ATP and more throughput, but it floods the body with toxin waste — ammunition, if you can hold it.',
    stats: { rate: 0.52, energyPerBiomass: 3.65, toxinPerBiomass: 0.24, gasPerBiomass: 0.10 }
  },
  lipogenic_processor: {
    name: 'Lipogenic Processor', tier: 3, action: null, stackable: true, max: 5, category: 'metabolic',
    desc: 'Runs metabolism in reverse: spends biomass and a little ATP to synthesize lipid reserves. Self-sufficient mitochondrial fuel, discovered in oily cells.',
    stats: { rate: 0.34, lipidPerBiomass: 0.62, energyCost: 0.9, biomassPerSecond: 0.55 }
  },
  oxidase_vesicle: {
    name: 'Oxidase Vesicle', tier: 2, action: null, stackable: true, max: 5, category: 'metabolic',
    desc: 'A pre-mitochondrial oxidizer: burns internal oxygen together with biomass to make ATP. Weaker than a mitochondrion, but it gives the oxygen build an ATP payoff without the Eucharist.',
    stats: { rate: 0.9, oxygenPerBiomass: 0.06, atpPerBiomass: 2.7 }
  },
  anabolic_vesicle: {
    name: 'Anabolic Vesicle', tier: 2, action: null, stackable: true, max: 5, category: 'metabolic',
    desc: 'Banks surplus energy as body mass: when your ATP is running high, it spends the excess to build biomass — the mirror of an anaerobic processor.',
    stats: { threshold: 0.7, rate: 0.7, biomassPerATP: 0.5 }
  },
  lipolytic_vesicle: {
    name: 'Lipolytic Vesicle', tier: 2, action: null, stackable: true, max: 5, category: 'metabolic',
    desc: 'Breaks stored fat back into construction slurry: a steady one-way lipids → biomass flow (the reverse of the Lipogenic Processor).',
    stats: { rate: 0.7, biomassPerLipid: 1.1 }
  },
  mineralizing_gland: {
    name: 'Mineralizing Gland', tier: 2, action: null, stackable: true, max: 4, category: 'metabolic',
    desc: 'Precipitates hard crystal from waste: consumes toxins and biomass to grow crystal reserve — turning metabolic poison and bulk into exotic ammunition.',
    stats: { rate: 0.06, toxinPerCrystal: 3, biomassPerCrystal: 4 }
  },
  catalytic_processor: {
    name: 'Catalytic Processor', tier: 3, action: null, stackable: true, max: 6, category: 'metabolic',
    desc: 'An enzyme-accelerated anaerobic flow. Stored enzymes act as catalyst — the more you carry, the faster it runs — consuming a trickle as it works.',
    stats: { rate: 0.30, energyPerBiomass: 3.2, toxinPerBiomass: 0.09, enzymeBoost: 0.85, enzymeDrain: 0.02, gasPerBiomass: 0.10 }
  },
  velocity_lance: {
    name: 'Velocity Lance', tier: 3, action: null, stackable: true, max: 6, category: 'lance',
    desc: 'A charge spine harvested from swift hunters. Almost harmless at a drift, brutal at dash speed — damage ramps hard with impact velocity.',
    stats: { damage: 16, length: 52, rupturePower: 0.9, alignmentFloor: 0.34, speedScale: 95, speedFloor: 40, speedCap: 4.4 }
  },
  saw_lance: {
    name: 'Saw Lance', tier: 3, action: null, stackable: true, max: 6, category: 'lance',
    desc: 'A grinding blade from deep predators. Flat, reliable damage regardless of speed, and it bites from wider angles — but it never spikes.',
    stats: { damage: 18, length: 44, rupturePower: 1.05, alignmentFloor: 0.12, flat: true }
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
  combustion_vesicle: {
    name: 'Combustion Vesicle', tier: 3, action: 'flame', stackable: true, max: 4, category: 'execute',
    desc: 'A flamethrower organ. Sprays a held cone of burning slurry — igniting your lipids (fuel) with banked oxygen (oxidizer) and toxins (accelerant). Runs far hotter the more O2 you carry, and drains all three tanks fast. More vesicles widen and thicken the flame.',
    // Per emitted puff (fires ~1/cooldown while held). Costs are small per-puff but relentless.
    stats: { damage: 24, o2Cost: 0.05, lipidCost: 0.4, toxinCost: 0.35, energyCost: 0.7, cooldown: 0.05, puffRadius: 30, puffLife: 0.34, reach: 96, coneSpread: 0.5 }
  },
  leech_rasp: {
    name: 'Leech Lamella', tier: 3, action: 'rasp', stackable: true, max: 5, category: 'leech',
    desc: 'A parasitic feeding membrane. Deals almost no damage, but while rasping it siphons biomass and lipids straight out of the host — the algae-parasite\'s core organ.',
    stats: { dps: 2.5, energyCost: 1.4, vulnerabilityBonus: 0.12, rupturePower: 0.40, leechRate: 4.5 }
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
    desc: 'An acidic skin fed by your toxin stores. Anything sharing your space dissolves each moment — and the more toxins you hold, the harder it burns (up to several times as strong with a full tank).',
    stats: { dps: 8.0, toxinBoost: 2.5 }
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
    desc: 'A sensory fringe that yanks nearby slurry fields toward you the moment you start feeding — spending one spore per pull. A feeding-build\'s reach, but no longer a free constant vacuum.',
    stats: { radius: 240, yank: 60, cost: 1, cooldown: 1.0 }
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
    desc: 'A pressurized combustion bladder. Each time a membrane layer is torn off you — and again when you die — it erupts in a blast whose size tracks your banked O2 and lipids (and burns that fuel). Full tanks: a devastating fireball. Empty: a weak pop.',
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
    stats: { count: 2, damage: 34, radius: 14, orbitDist: 30, spin: 1.8 }
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
  { id: 'repair', section: 'Tier 1 - Matter survival', kind: 'exchange', name: 'Repair Communion', output: 'hp', desc: 'Yuki patches your membrane from whatever matter you bring — pay a fair share of your biomass and fat, no exact recipe.', value: 10, effect: { heal: 38 } },
  { id: 'buy_biomass', section: 'Tier 1 - Matter survival', kind: 'exchange', name: 'Render Lipids into Biomass', output: 'biomass', desc: 'Convert stored fat into construction slurry.', cost: { lipids: 8, energy: 3 }, gain: { biomass: 9 } },
  { id: 'buy_lipids', section: 'Tier 1 - Matter survival', kind: 'exchange', name: 'Condense Lipids', output: 'lipids', desc: 'Restock membrane fat from biomass and ATP.', cost: { biomass: 6, energy: 3 }, gain: { lipids: 8 } },
  { id: 'buy_energy', section: 'Tier 1 - Matter survival', kind: 'exchange', name: 'Charge ATP', output: 'energy', desc: 'Yuki burns a fair share of your matter into a clean ATP charge — no exact recipe, pay from what you carry.', value: 6, gain: { energy: 10 } },
  { id: 'buy_toxins', section: 'Tier 1 - Matter survival', kind: 'exchange', name: 'Distill Toxins', output: 'toxins', desc: 'Restock toxin chemistry as a single clean tank.', cost: { biomass: 4, energy: 3 }, gain: { toxins: 7 } },
  { id: 'detox', section: 'Tier 1 - Matter survival', kind: 'exchange', name: 'Yuki Detox', output: 'detox', desc: 'Pass toxins and oxygen stress into the canopy — cuts each by two-thirds. Not a combat vent.', cost: { energy: 4 }, effect: { detoxFrac: 2 / 3, oxygenVentFrac: 2 / 3 } },

  { id: 'membrane', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Cell Membrane', desc: 'Add one explicit membrane layer: more HP, more container surface, and more oxygen volume.', cost: { biomass: 12, lipids: 8 }, organelle: 'membrane', stackLimit: 8 },
  { id: 'membrane_intake', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Membrane Intake Pore', desc: 'Add one more feeding pore: more field flow without inventing a new rule.', cost: { biomass: 8, lipids: 4 }, organelle: 'membrane_intake', stackLimit: 6 },
  { id: 'anaerobic_processor', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Anaerobic Processor', desc: 'Add one more biomass-to-ATP organ flow. More processors mean more flow and more toxin waste.', cost: { biomass: 14, lipids: 5, enzymes: 1 }, organelle: 'anaerobic_processor', stackLimit: 8 },
  { id: 'oxidase_vesicle', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Oxidase Vesicle', desc: 'Burns internal oxygen with biomass to make ATP — a pre-mitochondrial oxidizer, an ATP payoff for the oxygen build.', cost: { biomass: 14, lipids: 6 }, organelle: 'oxidase_vesicle', requiresDiscovery: 'oxidase_vesicle', stackLimit: 5 },
  { id: 'anabolic_vesicle', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Anabolic Vesicle', desc: 'Banks surplus ATP as biomass when your energy tank runs high — the inverse of a processor.', cost: { biomass: 14, lipids: 8 }, organelle: 'anabolic_vesicle', requiresDiscovery: 'anabolic_vesicle', stackLimit: 5 },
  { id: 'lipolytic_vesicle', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Lipolytic Vesicle', desc: 'Breaks stored fat back into biomass — a one-way lipids → biomass flow.', cost: { biomass: 12, lipids: 4 }, organelle: 'lipolytic_vesicle', requiresDiscovery: 'lipolytic_vesicle', stackLimit: 5 },
  { id: 'mineralizing_gland', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Mineralizing Gland', desc: 'Precipitates crystal from toxins and biomass — turn metabolic poison and bulk into exotic ammo (needs exotic storage).', cost: { biomass: 16, lipids: 6 }, organelle: 'mineralizing_gland', requiresDiscovery: 'mineralizing_gland', stackLimit: 4 },
  { id: 'biomass_vacuole', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Biomass Vacuole', desc: 'Dedicated biomass capacity — the FAT tank. Pure biomass, no exotics: stack these to hoard a huge reserve. A bigger belly is a bigger, slower body.', cost: { biomass: 12 }, organelle: 'biomass_vacuole', stackLimit: 12 },
  { id: 'lipid_vacuole', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Lipid Vacuole', desc: 'Dedicated fat capacity — your tradeable-wealth tank, and a little extra lift.', cost: { biomass: 6, lipids: 6 }, organelle: 'lipid_vacuole', stackLimit: 8 },
  { id: 'toxin_vacuole', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Toxin Vacuole', desc: 'Dedicated venom capacity — hold the escalating toxin cost of a committed venom build.', cost: { biomass: 8, lipids: 4 }, organelle: 'toxin_vacuole', stackLimit: 8 },
  { id: 'exotic_vacuole', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Exotic Vesicle Rack', desc: 'Each rack adds exactly one spore, one enzyme, and one crystal slot. No invisible exotic capacity exists.', cost: { biomass: 8, lipids: 4, spores: 1 }, organelle: 'exotic_vacuole', stackLimit: 13 },
  { id: 'dna_memory_vesicle', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'DNA Memory Vesicle', desc: 'One additional protected DNA slot. It stores information; Tier 3 decides what the information means.', cost: { biomass: 10, crystals: 1 }, organelle: 'dna_memory_vesicle', stackLimit: 13 },
  { id: 'nuclease_vesicle', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Nuclease Vesicle', desc: 'Digests junk DNA — untagged strands and any genome no better than one you carry or know — into biomass on pickup, keeping your DNA store free for the good stuff.', cost: { biomass: 16, enzymes: 1 }, organelle: 'nuclease_vesicle', requiresDiscovery: 'nuclease_vesicle', stackLimit: 1 },
  { id: 'flagella', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Flagellum', desc: 'One flagellum. Buy one, grow one.', cost: { biomass: 9, lipids: 5, spores: 1 }, organelle: 'flagella', stackLimit: 8 },
  { id: 'dash_vacuole', section: 'Tier 2A - General survival organs', theme: 'general', kind: 'organelle', name: 'Dash Vacuole', desc: 'One burst organ for escaping bad overlaps and oxygen stress.', cost: { biomass: 14, lipids: 12, spores: 1 }, organelle: 'dash_vacuole', requiresDiscovery: 'dash_vacuole', stackLimit: 4 },

  { id: 'photosystem', section: 'Tier 2B - Algal oxygen path', theme: 'algae', kind: 'organelle', name: 'Photosystem Patch', desc: 'The light-harvester: near the lit canopy it grows biomass (and body weight) and vents oxygen. The engine of the buoyant algae life — bask, fatten, then ride your ballast down.', cost: { biomass: 14, lipids: 6 }, organelle: 'photosystem', stackLimit: 5 },
  { id: 'oxygen_vacuole', section: 'Tier 2B - Algal oxygen path', theme: 'algae', kind: 'organelle', name: 'Ballast Bladder', desc: 'Your gas-ballast tank. Fermentation fills it with lift-gas; hold S to flood (vent gas, dive), W to hold trim. Diving needs this organ — nothing else gives lift.', cost: { biomass: 12, lipids: 7 }, organelle: 'oxygen_vacuole', stackLimit: 6 },
  { id: 'oxygen_store', section: 'Tier 2B - Algal oxygen path', theme: 'algae', kind: 'organelle', name: 'Oxygen Vesicle', desc: 'Banks more internal oxygen as respiration fuel for the oxidase / mitochondrion path — capacity, not lift. Lets a diver carry a deep breath.', cost: { biomass: 12, lipids: 5 }, organelle: 'oxygen_store', requiresDiscovery: 'oxygen_store', stackLimit: 5 },
  { id: 'oxygen_tolerance', section: 'Tier 2B - Algal oxygen path', theme: 'algae', kind: 'organelle', name: 'Oxygen Tolerance Vesicle', desc: 'Raises the fraction of your oxygen tank you can safely hold, so a full breath near the bright surface no longer poisons you. Tolerance, not storage.', cost: { biomass: 12, lipids: 4 }, organelle: 'oxygen_tolerance', requiresDiscovery: 'oxygen_tolerance', stackLimit: 5 },
  { id: 'jettison_vesicle', section: 'Tier 2B - Algal oxygen path', theme: 'algae', kind: 'organelle', name: 'Jettison Vesicle', desc: 'Eject a slug of biomass (T): shed weight, lurch upward, and spill a feed-field — a deliberate ascent and an escape from a swarm.', cost: { biomass: 14, lipids: 5 }, organelle: 'jettison_vesicle', requiresDiscovery: 'jettison_vesicle', stackLimit: 3 },
  { id: 'gas_gland', section: 'Tier 2B - Algal oxygen path', theme: 'algae', kind: 'organelle', name: 'Gas Gland', desc: 'Ferments biomass into lift-gas faster, so you re-inflate ballast and float back up quicker after a sink or a dive.', cost: { biomass: 14, lipids: 6 }, organelle: 'gas_gland', requiresDiscovery: 'gas_gland', stackLimit: 4 },
  { id: 'pressure_bladder', section: 'Tier 2B - Algal oxygen path', theme: 'algae', kind: 'organelle', name: 'Pressure Bladder', desc: 'Packs in more ballast gas — a bigger float and a deeper reserve to blow when diving.', cost: { biomass: 13, lipids: 8 }, organelle: 'pressure_bladder', requiresDiscovery: 'pressure_bladder', stackLimit: 5 },
  { id: 'ballast_siphon', section: 'Tier 2B - Algal oxygen path', theme: 'algae', kind: 'organelle', name: 'Ballast Siphon', desc: 'Dumps ballast gas faster while flooded — a sharper, quicker dive.', cost: { biomass: 12, lipids: 6 }, organelle: 'ballast_siphon', requiresDiscovery: 'ballast_siphon', stackLimit: 4 },
  { id: 'ballast_stone', section: 'Tier 2B - Algal oxygen path', theme: 'algae', kind: 'organelle', name: 'Ballast Stone', desc: 'Mineralized weight: sink faster and hold the deep without constantly venting gas — the committed diver\'s anchor.', cost: { biomass: 12, lipids: 4 }, organelle: 'ballast_stone', requiresDiscovery: 'ballast_stone', stackLimit: 4 },
  { id: 'lipid_bladder', section: 'Tier 2B - Algal oxygen path', theme: 'algae', kind: 'organelle', name: 'Lipid Bladder', desc: 'Stored fat is lighter than water: a full lipid reserve gives lift on its own — buoyancy for the fat-burning mitochondrial build without fermenting gas.', cost: { biomass: 12, lipids: 9 }, organelle: 'lipid_bladder', requiresDiscovery: 'lipid_bladder', stackLimit: 5 },

  { id: 'rasping_lamella', section: 'Tier 2C - Predatory organs', theme: 'attack', kind: 'organelle', name: 'Rasping Lamella', desc: 'One active overlap shred membrane. It only works when bodies actually overlap.', cost: { biomass: 18, lipids: 5, crystals: 1, enzymes: 1 }, organelle: 'rasping_lamella', stackLimit: 5 },
  { id: 'lance_bristle', section: 'Tier 2C - Predatory organs', theme: 'attack', kind: 'organelle', name: 'Lance Bristle', desc: 'One forward spine. Buy one, grow one.', cost: { biomass: 16, lipids: 7, crystals: 1 }, organelle: 'lance_bristle', requiresDiscovery: 'lance_bristle', stackLimit: 6 },
  { id: 'toxin_launcher', section: 'Tier 2C - Predatory organs', theme: 'attack', kind: 'organelle', name: 'Toxic Launcher', desc: 'Late Tier 2 toxin weapon: fires one chemical glob that creates a damaging field.', cost: { biomass: 14, toxins: 8, crystals: 1 }, organelle: 'toxin_launcher', requiresDiscovery: 'toxin_launcher', stackLimit: 3 },
  { id: 'phagosome', section: 'Tier 2C - Predatory organs', theme: 'attack', kind: 'organelle', name: 'Phagosome Gland', desc: 'Engulf an overlapping smaller or wounded body on command, spending one enzyme to dissolve it whole into biomass.', cost: { biomass: 18, enzymes: 1, crystals: 1 }, organelle: 'phagosome', requiresDiscovery: 'phagosome', stackLimit: 1 },

  // Exotic traits: locked until you harvest the matching strain's DNA. Discovery
  // is permanent (persists across deaths and sessions); after that they buy like
  // any other organelle. requiresDiscovery matches the organelle's own id.
  { id: 'lipid_repair_loom', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Lipid Repair Loom', desc: 'Self-repair organ: lipids + ATP stitch the membrane. Harvested from resilient, self-mending cells.', cost: { biomass: 16, lipids: 12, enzymes: 1 }, organelle: 'lipid_repair_loom', requiresDiscovery: 'lipid_repair_loom', stackLimit: 5 },
  { id: 'cytostome', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Cytostome Bloom', desc: 'Larger feeding morphology harvested from voracious feeders: radius and flow increase together, at the cost of a softer membrane while gorging.', cost: { biomass: 18, lipids: 9, spores: 1 }, organelle: 'cytostome', requiresDiscovery: 'cytostome', stackLimit: 5 },
  { id: 'selective_membrane', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Selective Intake Membrane', desc: 'A choosy intake skin sequenced from discriminating feeders: pulls ATP fastest, favours the emptier of biomass/lipids, and filters out toxins so fouled fields become safe to graze.', cost: { biomass: 16, lipids: 8, enzymes: 1 }, organelle: 'selective_membrane', requiresDiscovery: 'selective_membrane', stackLimit: 1 },
  { id: 'membrane_hardening', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Membrane Hardening Layer', desc: 'Tougher, less permeable skin sequenced from armored cells: better protection and slower diffusion, at a little flow and speed. Good for algae armor and predator survival.', cost: { biomass: 15, lipids: 11, crystals: 1 }, organelle: 'membrane_hardening', requiresDiscovery: 'membrane_hardening', stackLimit: 6 },
  { id: 'enzyme_reserve', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Enzyme Reserve Sac', desc: 'Emergency catalyst store from hardy cells: auto-spends an enzyme to flash-digest biomass into ATP whenever your energy runs critically low.', cost: { biomass: 14, enzymes: 2 }, organelle: 'enzyme_reserve', requiresDiscovery: 'enzyme_reserve', stackLimit: 1 },
  { id: 'atp_reservoir', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'ATP Reservoir', desc: 'A deep charge sac sequenced from the predator lineage: pure ATP capacity, so you can hoard energy the way the hunters do — bank the harvest of many kills, then spend it all at once (a fission, a long sprint, a burst of costly organs).', cost: { biomass: 12, lipids: 8, crystals: 1 }, organelle: 'atp_reservoir', requiresDiscovery: 'atp_reservoir', stackLimit: 4 },
  { id: 'spore_jet', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Spore Jet Vesicle', desc: 'Wires your dash to a spore charge, sequenced from swift chargers: a stronger lunge that vents a spore cloud. Spends one spore per dash. Needs a Dash Vacuole.', cost: { biomass: 14, spores: 2 }, requiresOrganelle: 'dash_vacuole', requiresDiscovery: 'spore_jet', organelle: 'spore_jet', stackLimit: 1 },
  { id: 'crystal_ward', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Crystalline Ward Lattice', desc: 'Spend a crystal to sheathe the membrane, a lattice grown from armored deep cells: harder skin, reflected damage, and piercing shots for a few seconds.', cost: { biomass: 16, lipids: 6, crystals: 2 }, organelle: 'crystal_ward', requiresDiscovery: 'crystal_ward', stackLimit: 1 },
  { id: 'toxin_cloud', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Toxin Cloud Gland', desc: 'Local toxic vent bred from venomous deep hunters. Requires a Toxic Launcher to route the venom.', cost: { biomass: 16, toxins: 16, enzymes: 1 }, requiresOrganelle: 'toxin_launcher', requiresDiscovery: 'toxin_cloud', organelle: 'toxin_cloud', stackLimit: 3 },
  { id: 'clean_processor', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Purified Processor', desc: 'Biomass to ATP with almost no toxic waste, at a slightly lower yield.', cost: { biomass: 18, enzymes: 1 }, organelle: 'clean_processor', requiresDiscovery: 'clean_processor', stackLimit: 6 },
  { id: 'virulent_processor', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Virulent Processor', desc: 'More ATP and throughput, but floods the body with toxin waste — weapon fuel, if you can hold it.', cost: { biomass: 18, toxins: 6 }, organelle: 'virulent_processor', requiresDiscovery: 'virulent_processor', stackLimit: 6 },
  { id: 'lipogenic_processor', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Lipogenic Processor', desc: 'Spends biomass and a little ATP to synthesize lipid reserve. Self-sufficient mitochondrial fuel.', cost: { biomass: 20, lipids: 6 }, organelle: 'lipogenic_processor', requiresDiscovery: 'lipogenic_processor', stackLimit: 5 },
  { id: 'catalytic_processor', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Catalytic Processor', desc: 'Enzyme-accelerated flow: the more enzymes you carry, the faster it runs.', cost: { biomass: 18, enzymes: 2 }, organelle: 'catalytic_processor', requiresDiscovery: 'catalytic_processor', stackLimit: 6 },
  { id: 'velocity_lance', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Velocity Lance', desc: 'A charge spine — near-harmless at a drift, brutal at dash speed.', cost: { biomass: 18, crystals: 1 }, organelle: 'velocity_lance', requiresDiscovery: 'velocity_lance', stackLimit: 6 },
  { id: 'saw_lance', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Saw Lance', desc: 'A grinding blade: flat, reliable damage regardless of speed, biting from wider angles.', cost: { biomass: 20, crystals: 1 }, organelle: 'saw_lance', requiresDiscovery: 'saw_lance', stackLimit: 6 },
  { id: 'siphon_rasp', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Siphon Rasp', desc: 'A parasitic shred: while rasping, drains the victim\'s biomass and lipids into your cargo.', cost: { biomass: 20, enzymes: 1 }, organelle: 'siphon_rasp', requiresDiscovery: 'siphon_rasp', stackLimit: 5 },
  { id: 'spore_toxin_launcher', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Sporo-Toxic Launcher', desc: 'Combination gun: spends toxins and spores for a heavy glob, wide splash, and a lingering cloud.', cost: { biomass: 22, spores: 2, crystals: 1 }, organelle: 'spore_toxin_launcher', requiresDiscovery: 'spore_toxin_launcher', stackLimit: 3 },
  { id: 'combustion_vesicle', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Combustion Vesicle', desc: 'A flamethrower: a held cone of burning slurry that ignites your lipids with banked O2 and toxins. Runs hotter with more oxygen and drains all three tanks fast.', cost: { biomass: 22, lipids: 10, crystals: 1 }, organelle: 'combustion_vesicle', requiresDiscovery: 'combustion_vesicle', stackLimit: 4 },
  { id: 'leech_rasp', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Leech Lamella', desc: 'Parasite organ: near-zero damage, but rasping siphons biomass and lipids straight out of your host.', cost: { biomass: 14, enzymes: 1 }, organelle: 'leech_rasp', requiresDiscovery: 'leech_rasp', stackLimit: 5 },
  { id: 'leech_lance', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Leech Proboscis', desc: 'Feeding spine: barely wounds, but draws biomass and lipids from prey at range. Parasitize without killing.', cost: { biomass: 16, spores: 1 }, organelle: 'leech_lance', requiresDiscovery: 'leech_lance', stackLimit: 6 },
  { id: 'rupture_auger', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Rupture Auger', desc: 'Armor-piercing spine: ignores membrane hardness entirely.', cost: { biomass: 20, crystals: 1 }, organelle: 'rupture_auger', requiresDiscovery: 'rupture_auger', stackLimit: 6 },
  { id: 'adrenal_vesicle', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Adrenal Vesicle', desc: 'The lower your HP, the harder and faster you strike — up to double near death.', cost: { biomass: 18, enzymes: 1 }, organelle: 'adrenal_vesicle', requiresDiscovery: 'adrenal_vesicle', stackLimit: 4 },
  { id: 'thorn_coat', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Thorn Coat', desc: 'Reflects a share of any damage dealt to you straight back at the attacker.', cost: { biomass: 20, crystals: 1 }, organelle: 'thorn_coat', requiresDiscovery: 'thorn_coat', stackLimit: 5 },
  { id: 'corrosive_pellicle', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Corrosive Pellicle', desc: 'Passive acid skin — anything overlapping you dissolves each moment.', cost: { biomass: 18, toxins: 6 }, organelle: 'corrosive_pellicle', requiresDiscovery: 'corrosive_pellicle', stackLimit: 5 },
  { id: 'discharge_vesicle', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Discharge Vesicle', desc: 'Auto-shocks every nearby body on a timer, spending ATP per pulse.', cost: { biomass: 20, crystals: 1 }, organelle: 'discharge_vesicle', requiresDiscovery: 'discharge_vesicle', stackLimit: 4 },
  { id: 'cryo_vesicle', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Cryo Vesicle', desc: 'Anything you damage is chilled and slowed for a moment.', cost: { biomass: 18, enzymes: 1 }, organelle: 'cryo_vesicle', requiresDiscovery: 'cryo_vesicle', stackLimit: 4 },
  { id: 'chemotaxis_cilia', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Chemotaxis Cilia', desc: 'Vacuums nearby slurry fields and loose particles toward you.', cost: { biomass: 16, spores: 1 }, organelle: 'chemotaxis_cilia', requiresDiscovery: 'chemotaxis_cilia', stackLimit: 4 },
  { id: 'aerocyst', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Aerocyst', desc: 'A rigid, permanently gas-filled float that never vents — a lift floor so you are never stranded at the bottom.', cost: { biomass: 16, lipids: 8 }, organelle: 'aerocyst', requiresDiscovery: 'aerocyst', stackLimit: 5 },
  { id: 'catalase_vesicle', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Catalase Vesicle', desc: 'Neutralizes oxygen radicals — hold a much fuller O2 tank in the bright surface without poisoning.', cost: { biomass: 16, enzymes: 1 }, organelle: 'catalase_vesicle', requiresDiscovery: 'catalase_vesicle', stackLimit: 5 },
  { id: 'countercurrent_gill', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Countercurrent Gill', desc: 'Pulls oxygen from the water far faster than diffusion — refill a deep breath quickly to fuel the aerobic engine.', cost: { biomass: 18, enzymes: 1 }, organelle: 'countercurrent_gill', requiresDiscovery: 'countercurrent_gill', stackLimit: 5 },
  { id: 'hydrogenosome', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Hydrogenosome', desc: 'A deep anaerobic float engine: ferments biomass to ATP while venting a heavy gush of lift-gas — no light required.', cost: { biomass: 20, spores: 1 }, organelle: 'hydrogenosome', requiresDiscovery: 'hydrogenosome', stackLimit: 6 },
  { id: 'photolytic_vacuole', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Photolytic Vacuole', desc: 'Splits water in the light to bank extra internal oxygen as respiration fuel for the mitochondrial path.', cost: { biomass: 18, crystals: 1 }, organelle: 'photolytic_vacuole', requiresDiscovery: 'photolytic_vacuole', stackLimit: 4 },
  { id: 'chemosynthetic_vesicle', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Chemosynthetic Vesicle', desc: 'Deep chemosynthesis: oxidizes stored toxins (+ a little biomass) into ATP — clean energy in the dark that scrubs the poison as it works.', cost: { biomass: 18, enzymes: 1 }, organelle: 'chemosynthetic_vesicle', requiresDiscovery: 'chemosynthetic_vesicle', stackLimit: 5 },
  { id: 'gas_injector', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Gas Injector', desc: 'Pumps buoyant gas into anything you overlap, shoving it upward — float a deep hunter into the lit shallows and the light burns it for you.', cost: { biomass: 18, spores: 1 }, organelle: 'gas_injector', requiresDiscovery: 'gas_injector', stackLimit: 4 },
  { id: 'barophilic_sheath', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Barophilic Sheath', desc: 'A pressure-loving skin that stiffens as you descend — armor plating in the crushing deep, near-useless at the surface. Rewards committing to the dark.', cost: { biomass: 18, crystals: 1 }, organelle: 'barophilic_sheath', requiresDiscovery: 'barophilic_sheath', stackLimit: 4 },
  { id: 'phagocyte_maw', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Phagocyte Maw', desc: 'Engulfs any small, weakened body you overlap — instant biomass.', cost: { biomass: 22, enzymes: 1 }, organelle: 'phagocyte_maw', requiresDiscovery: 'phagocyte_maw', stackLimit: 3 },
  { id: 'necrosis_gland', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Necrosis Gland', desc: 'Anything you kill bursts into a lingering spore-toxin bloom.', cost: { biomass: 20, spores: 2 }, organelle: 'necrosis_gland', requiresDiscovery: 'necrosis_gland', stackLimit: 3 },
  { id: 'volatile_vacuole', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Volatile Vacuole', desc: 'You detonate each time a membrane layer is cracked off you, and again when you die — blasts that take your attackers with you.', cost: { biomass: 18, toxins: 8 }, organelle: 'volatile_vacuole', requiresDiscovery: 'volatile_vacuole', stackLimit: 3 },
  { id: 'seeker_gland', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Seeker Gland', desc: 'Auto-launches slow homing spores that curve after the nearest prey.', cost: { biomass: 20, spores: 2 }, organelle: 'seeker_gland', requiresDiscovery: 'seeker_gland', stackLimit: 4 },
  { id: 'harpoon_spine', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Harpoon Spine', desc: 'Fires a tethered spine that pierces, wounds, and hauls prey toward you.', cost: { biomass: 20, crystals: 1 }, organelle: 'harpoon_spine', requiresDiscovery: 'harpoon_spine', stackLimit: 3 },
  { id: 'neuro_barb', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Neuro-Toxin Barb', desc: 'Struck bodies sometimes turn and fight for you for a while.', cost: { biomass: 22, enzymes: 2 }, organelle: 'neuro_barb', requiresDiscovery: 'neuro_barb', stackLimit: 3 },
  { id: 'orbital_spores', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Orbital Spore-Bodies', desc: 'Daughter cells circle you and grind anything they brush.', cost: { biomass: 22, spores: 2 }, organelle: 'orbital_spores', requiresDiscovery: 'orbital_spores', stackLimit: 3 },
  { id: 'fission_bud', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Fission Bud', desc: 'Each kill may bud a short-lived allied grazer that fights at your side.', cost: { biomass: 22, crystals: 1 }, organelle: 'fission_bud', requiresDiscovery: 'fission_bud', stackLimit: 3 },
  { id: 'cleavage_furrow', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'organelle', name: 'Cleavage Furrow', desc: 'The binary-fission engine sequenced from the predator lineage: gorge a full ATP reservoir (or a full fat reserve) and cleave into a friendly clone — daughters drift genetically. Not innate; you tear this gene from the deep.', cost: { biomass: 20, lipids: 12, enzymes: 1 }, organelle: 'cleavage_furrow', requiresDiscovery: 'cleavage_furrow', stackLimit: 1 },

  // Symbiotic colony: nothing here works without the Pheromone Gland — the swarm-
  // conducting organ you harvest from a deep swarm-director. Graft the gland, then
  // its spore-pheromones marshal swarms of allied bacteria. Each swarm type also
  // teaches the colony a weapon gene you sequenced from the froth.
  { id: 'pheromone_gland', section: 'Tier 2E - Symbiotic colony', theme: 'colony', kind: 'organelle', name: 'Pheromone Gland', desc: 'The swarm-conducting organ, harvested from a deep swarm-director. Graft it to marshal a colony and to paint targets with a sticky death-pheromone. More glands conduct a larger swarm.', cost: { biomass: 20, spores: 2 }, organelle: 'pheromone_gland', requiresDiscovery: 'pheromone_gland', stackLimit: 2 },
  { id: 'companion_grazer', section: 'Tier 2E - Symbiotic colony', theme: 'colony', kind: 'colony', name: 'Grazer Swarm', desc: 'A swarm of grazer bacteria herded by your pheromones. It grazes fields beside you, returns the harvest to your body, and rasps whatever attacks the colony. The entry swarm.', cost: { biomass: 22, spores: 3 }, requiresOrganelle: 'pheromone_gland', companion: 'grazer' },
  { id: 'companion_lancer', section: 'Tier 2E - Symbiotic colony', theme: 'colony', kind: 'colony', name: 'Lancer Swarm', desc: 'A spined bacterial swarm driven by heavier pheromones — fast, it charges hostiles that near your colony. Its spine is grown from a wild charge-lance gene you sequenced.', cost: { biomass: 32, spores: 4, crystals: 1 }, requiresOrganelle: 'pheromone_gland', requiresDiscovery: 'velocity_lance', companion: 'lancer' },
  { id: 'companion_hunter', section: 'Tier 2E - Symbiotic colony', theme: 'colony', kind: 'colony', name: 'Toxic Swarm', desc: 'A venomous bacterial swarm marshalled by the richest pheromones, auto-firing toxic globs at your enemies. Its venom is bred from a sporo-toxic gene you sequenced.', cost: { biomass: 44, spores: 5, crystals: 1 }, requiresOrganelle: 'pheromone_gland', requiresDiscovery: 'spore_toxin_launcher', companion: 'hunter' },

  { id: 'mitochondrial_eucharist', section: 'Eucharist Gate - Mitochondrial endosymbiosis', kind: 'sacrament', name: 'Mitochondrial Eucharist', desc: 'Yuki gives a living endosymbiont seed. Survive incubation; oxygen becomes power. Requires at least one sequenced genome.', cost: { biomass: 24, lipids: 24, spores: 3, enzymes: 2, crystals: 2 }, requiresHostReady: true, effect: { beginEucharist: true } },

  { id: 'eucharist_archive', section: 'Tier 3 - DNA information', kind: 'eucharist', name: 'Eucharist Archive', desc: 'Record deep rupture DNA for future bodies. A costly ritual of matter — no raw DNA spent.', cost: { biomass: 55, lipids: 40, energy: 30 }, requiresMito: true, organelle: 'eucharist_archive' },
  { id: 'mitochondrial_stack', section: 'Tier 3 - DNA information', kind: 'eucharist', name: 'Mitochondrial Stack', desc: 'Grow additional mitochondria after the first sacred integration. A vast investment of matter.', cost: { biomass: 90, lipids: 70, energy: 45 }, requiresMito: true, effect: { addMito: true } },
  { id: 'multicell_chassis', section: 'Tier 3 - DNA information', kind: 'colony', name: 'Multicell Chassis', desc: 'A larger post-mitochondrial body plan. Expands your lead cell — an obscene cost in matter.', cost: { biomass: 160, lipids: 110, energy: 90 }, requiresMito: true, organelle: 'multicell_chassis' }
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

// Fair-distribution exchange payment. Instead of a fixed recipe (7 lipids + 2 biomass — which
// forces the player to shuffle biomass↔lipids to cross a threshold), a value-based exchange has a
// single WORTH price paid from whatever matter you hold, drawing the SAME fraction of each resource.
// Each resource's worth is weighted (lipids denser than biomass); ATP is never spent (matter only).
const RESOURCE_WORTH = Object.freeze({ biomass: 1.0, lipids: 1.35 });
const PAY_RESOURCES = Object.freeze(['biomass', 'lipids']);
function payWorth(cargo) { return PAY_RESOURCES.reduce((s, r) => s + Math.max(0, cargo[r] || 0) * RESOURCE_WORTH[r], 0); }
function canAffordValue(cargo, value) { return payWorth(cargo) + 1e-6 >= value; }
// The matter this exchange would draw RIGHT NOW: the same fraction f of each resource you hold, so
// worth debited = value. Used both to preview the split in the shop and to actually charge it.
function valueSplit(cargo, value) {
  const total = payWorth(cargo);
  if (total <= 1e-6) return {};
  const f = clamp(value / total, 0, 1);
  const out = {};
  for (const r of PAY_RESOURCES) { const amt = (cargo[r] || 0) * f; if (amt > 1e-4) out[r] = amt; }
  return out;
}
function payValue(cargo, value) { if (!canAffordValue(cargo, value)) return false; const split = valueSplit(cargo, value); for (const r of PAY_RESOURCES) cargo[r] = Math.max(0, (cargo[r] || 0) - (split[r] || 0)); return true; }

let nextId = 1;
function id(prefix) { return `${prefix}_${nextId++}`; }

export function lightAt(y) {
  const d = Math.max(0, y - WORLD.canopy);
  const upper = WORLD.nurseryTop - WORLD.canopy;
  const transition = WORLD.ruptureTop - WORLD.canopy;
  // Sigmoid beach at Yuki -> nearly linear usable-light ramp through the nursery/transition ->
  // sigmoid tail into the true dark. The joins stay close in value to avoid numerical shocks.
  if (d <= upper) return clamp(0.78 + 0.22 / (1 + Math.exp((d - 390) / 125)), 0, 1);
  if (d <= transition) return clamp(0.78 - 0.56 * (d - upper) / Math.max(1, transition - upper), 0, 1);
  return clamp(0.44 / (1 + Math.exp((d - transition) / 250)), 0, 1);
  return clamp(Math.exp(-d / 300), 0, 1); // steeper falloff — light is a shallow, canopy-hugging resource
}

export function oxygenAt(y) {
  const d = Math.max(0, y - WORLD.canopy);
  const upper = WORLD.nurseryTop - WORLD.canopy;
  const transition = WORLD.ruptureTop - WORLD.canopy;
  // O2 falls more linearly than light: the lower nursery remains bright but oxygen-poor, while the
  // lower transition still carries respiratory O2 after light has entered its dark tail.
  if (d <= upper) return clamp(0.98 - 0.40 * d / Math.max(1, upper), 0.04, 1);
  if (d <= transition) return clamp(0.58 - 0.16 * (d - upper) / Math.max(1, transition - upper), 0.04, 1);
  return clamp(0.04 + 0.76 / (1 + Math.exp((d - transition) / 600)), 0.04, 1);
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
  const ecologyOnly = options.ecologyOnly === true;
  const world = {
    version: VERSION,
    t: 0,
    rng,
    entities: [],
    fields: [],
    particles: [],
    hazards: [],
    events: [],
    stats: { fieldsMerged: 0, deaths: 0, dnaRead: 0, algaeFalls: 0, ruptures: 0, algaeBirths: 0,
      immigrations: 0, emigrations: 0, fissions: 0, spawnedCompanions: 0, eucharists: 0, toxicHits: 0 },
    cellLibrary: [],
    discoveredSources: ecologyOnly ? new Map() : (options.fresh ? freshDiscoveries() : loadDiscoveries()),
    spawn: { algae: 0, npc: 0, exotic: 0, nursery: 0, seed: 0 },
    escalation: 0,     // ratchets up with the player's progress → the deep releases more, and more
                       // monstrous, predators (the rising danger + the falling-action end game)
    playerId: null,
    ecologyOnly,
    _targetClaims: new Map()
  };
  let player = null;
  if (!ecologyOnly) {
    player = makeSoftBody(world, 'player', YUKI_SPAWN.x, YUKI_SPAWN.y, {
      r: 22, color: '#86d2ff', controller: 'human', trophicRole: 'anaerobic_scavenger', depthHome: YUKI_SPAWN.y,
      cargo: { biomass: 5, lipids: 4, energy: 18, toxins: 3, spores: 0, enzymes: 0, crystals: 0, dna: 0 },
      organelles: { membrane: 1, basal_motility: 1, membrane_intake: 1, anaerobic_processor: 1, exotic_vacuole: 1, rasping_lamella: 1 }, oxygen: oxygenAt(YUKI_SPAWN.y), grace: 2.5
    });
    player.carriedStrains = new Map();
    world.playerId = player.id;
    world.entities.push(player);
  }
  seedMatureEcosystem(world);
  // Start the world "in the middle": the seeded ecology is a cold snapshot, so optionally
  // step it forward N seconds before play begins — blooms photosynthesize, ferment, fall,
  // and shed fields, so the column is already at its lush steady state at t=0 instead of
  // decaying into it over the first minutes. The player is an idle, protected observer
  // during warmup (pinned at spawn, kept alive so the sim keeps running), then restored to
  // a fresh start. Default off, so the smoke tests keep their cold t=0 world.
  if (options.warmup > 0) {
    const p = player;
    const start = p ? { cargo: { ...p.cargo }, oxygen: p.oxygen, ballastGas: p.ballastGas || 0, hp: p.hp, biomassMass: p.biomassMass, r: p.r } : null;
    // Coarse fixed step (the sim's max dt) so warmup is ~3x cheaper — a couple hundred ms of
    // load, not a multi-second freeze — since we only need to reach the steady state, not
    // render it. Gameplay then runs at the fine 1/60 step.
    const WARM_DT = 0.05;
    const frames = Math.round(options.warmup / WARM_DT);
    for (let i = 0; i < frames; i++) {
      if (ecologyOnly) stepEcology(world, WARM_DT);
      else {
        step(world, {}, WARM_DT);
        p.alive = true; p.hp = caps(p).hp;                  // the observer never dies mid-warmup
        p.x = YUKI_SPAWN.x; p.y = YUKI_SPAWN.y; p.vx = 0; p.vy = 0; p.fallState = null;
      }
    }
    if (p) {
      Object.assign(p, start);                              // fresh player, aged world
      p.cargo = start.cargo;
      p.x = YUKI_SPAWN.x; p.y = YUKI_SPAWN.y; p.vx = 0; p.vy = 0; p.grace = 2.5;
      p.maxDepth = 0; p.carriedStrains = new Map(); p.fallState = null; p._capsEpoch = -1;
    }
    // Warmup produces an aged ecology, not an aged session. Gameplay and evaluation begin at t=0
    // with clean counters while the evolved bodies, fields, particles, and RNG state are retained.
    world.t = 0;
    world.events.length = 0;
    for (const k of Object.keys(world.stats)) world.stats[k] = 0;
  }
  return world;
}

// A genuinely player-free ecology world for equilibrium work. No inert player body means no player
// corpse matter, no wasted predator targets, no progression escalation, and no respawn interruptions.
export function createEcologyWorld(options = {}) {
  return createWorld({ ...options, ecologyOnly: true, fresh: true });
}

function seedMatureHunterState(world, e) {
  const c = caps(e);
  e.cargo.energy = c.energy * rand(world, 0.03, 0.34);
  e.cargo.biomass = c.biomass * rand(world, 0.12, 0.55);
  e.cargo.lipids = c.lipids * rand(world, 0.10, 0.52);
  e.hunger = rand(world, 0.58, 1);
  e.hp = c.hp * rand(world, 0.72, 1);
  e.brainState = world.rng() < 0.32 ? 'recover' : 'prowl';
  e._targetRef = null;
  e._commit = 0;
  // Sample the same long wild-generation phase used after division. Otherwise every seeded
  // hunter becomes reproduction-ready together during the opening minute, making t=0 special.
  e.fissionCooldown = rand(world, 0, 66);
  e.reproHeat = rand(world, 0.02, 0.45); // a mature ecology includes cold and recently successful lineages
}

function seedMatureEcosystem(world) {
  // v1.1.1 starts in medias res: a mature algal-fall ecology is already
  // running, so the player enters rupture chaos instead of waiting for bloom.
  // Seed a viable LIVING froth (just an initial condition now — the emergent lifecycles take it
  // from here): a scavenger forager pool, a hunter guild that will fission/select, a deep.
  for (let i = 0; i < SCAV_TARGET; i++) spawnScavenger(world, {
    y: WORLD.nurseryTop + rand(world, 120, 850),
    x: rand(world, 0, WORLD.w)
  });

  // Seed the full crop across the JOINT lifecycle, not as a linear depth/biomass gradient. Gas,
  // velocity, cargo, structural size, and fall direction must agree or the initial spread collapses
  // into one synchronized wave. Stratified phases guarantee coverage; jitter keeps seeds distinct.
  for (let i = 0; i < ALGAE_CAP; i++) {
    const phase = clamp((i + world.rng()) / ALGAE_CAP, 0, 0.9999);
    let u, bm, structural, y, gasFill, fallState, vy;
    if (phase < 0.16) {                         // bask/grow: brief bright interval before the next fall
      u = phase / 0.16;
      bm = 105 + u * 17;
      structural = 78 + u * 18;
      y = WORLD.canopy + 70 + Math.pow(u, 1.5) * 440;
      gasFill = 0.66 - u * 0.30;
      fallState = u > 0.78 ? 'sinking' : null;
      vy = u > 0.78 ? rand(world, 3, 12) : rand(world, -6, 4);
    } else if (phase < 0.77) {                  // long weighted descent: the dominant mature phase
      u = (phase - 0.16) / 0.61;
      bm = 126 - u * 14;
      structural = 94 + u * 20;
      y = WORLD.canopy + 360 + Math.pow(u, 0.90) * 1900;
      gasFill = 0.28 + u * 0.28;
      fallState = 'sinking';
      vy = rand(world, 10, 31);
    } else {                                    // gas-rich ascent: same veteran bloom returning
      u = (phase - 0.77) / 0.23;
      bm = 116 - u * 12;
      structural = 112 - u * 16;
      y = WORLD.canopy + 2180 - Math.pow(u, 0.88) * 1980;
      gasFill = 0.96 - u * 0.28;
      fallState = 'rising';
      vy = -rand(world, 10, 34);
    }
    y = clamp(y + rand(world, -150, 150), WORLD.canopy + 45, WORLD.h - 80);
    const mature = structural > 54;
    const e = spawnAlgae(world, { mature, biomass: bm, y, x: rand(world, 0, WORLD.w), fallState });
    e.biomassMass = structural;
    e.ballastGas = caps(e).ballastGas * gasFill;
    e.vy = vy;
    e.organelles.photosystem = clamp(2 + Math.floor(structural / 38), 2, ORGANELLES.photosystem.max);
    e._capsEpoch = -1;
    if (fallState) e._dove = true;
  }

  // A mature hunter guild is a distribution, not a synchronized healthy platoon. Counts vary by
  // seed and reserves span post-fission recovery through charged prowlers, removing the guaranteed
  // t=0 predator explosion while preserving later food-driven pulses.
  const predN = 3 + Math.floor(world.rng() * 5);   // 3..7
  const protoN = 9 + Math.floor(world.rng() * 5); // 9..13
  const metaN = 2 + Math.floor(world.rng() * 2);  // 2..3
  const broodN = 1 + Math.floor(world.rng() * 2); // 1..2
  for (let i = 0; i < predN; i++) seedMatureHunterState(world, spawnPredator(world, {
    y: WORLD.ruptureTop - 120 + rand(world, 0, 1900), x: rand(world, 0, WORLD.w)
  }));
  for (let i = 0; i < protoN; i++) seedMatureHunterState(world, spawnProtozoan(world, {
    y: WORLD.deepTop + rand(world, 80, 1900), x: rand(world, 0, WORLD.w)
  }));
  for (let i = 0; i < metaN; i++) seedMatureHunterState(world, spawnMetazoan(world, {
    y: WORLD.deepTop + rand(world, 700, 2200), x: rand(world, 0, WORLD.w)
  }));
  for (let i = 0; i < broodN; i++) spawnBrood(world, {
    y: WORLD.deepTop + rand(world, 500, 2000),
    x: rand(world, 0, WORLD.w)
  });

  // Seed the field economy at its steady density (~5000 matter) and stratified across the
  // whole column, so the player spawns among resource patches everywhere — not a sparse few
  // that only thicken minutes later. Richer, wider corpse/rupture slurry from the running fall.
  for (let i = 0; i < 14; i++) {
    const nearPlayer = i < 6;
    const x = nearPlayer ? WORLD.w / 2 + rand(world, -420, 420) : rand(world, 0, WORLD.w);
    const y = nearPlayer ? WORLD.ruptureTop + rand(world, -90, 520) : WORLD.nurseryTop + rand(world, 0, 2600);
    spawnResourceField(world, x, y, {
      biomass: rand(world, 120, 220),
      lipids: rand(world, 20, 42),
      toxins: rand(world, 0, 10),
      energy: rand(world, 0, 8)
    }, { radius: rand(world, 52, 135), sourceKind: 'mature_rupture_slurry', decayRate: 0.045, maxAge: rand(world, 38, 72), maxRadius: 240 });
  }

  // The running ecology maintains a handful of shallow-safe nursery patches. Seed those explicitly
  // so the opening does not spend its first seconds manufacturing a special t=0→t=6 field ramp.
  for (let i = 0; i < 6; i++) {
    spawnResourceField(world, rand(world, 0, WORLD.w), WORLD.canopy + rand(world, 800, 1180),
      { biomass: rand(world, 45, 90), lipids: rand(world, 8, 22), energy: rand(world, 3, 11) },
      { radius: rand(world, 44, 68), sourceKind: 'nursery_slurry', decayRate: 0.05, maxAge: 46, maxRadius: 150 });
  }

  for (let i = 0; i < 20; i++) {
    spawnParticle(world, choice(world, ['spores', 'spores', 'enzymes', 'crystals']), rand(world, 0, WORLD.w), WORLD.ruptureTop + rand(world, 120, 1650), 1);
  }

  world.spawn.algae = rand(world, 0.8, 1.4);
  world.spawn.npc = rand(world, 0.9, 1.6);
  world.spawn.exotic = rand(world, 1.4, 2.4);
  world.spawn.nursery = rand(world, 2.0, 3.8);
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
    ballastGas: opts.ballastGas ?? 0,
    hunger: rand(world, 0.25, 0.9), targetId: null, feedIntent: false, repairIntent: false, action: null, alive: true, hit: 0,
    phase: rand(world, 0, Math.PI * 2), radiusPulse: rand(world, 0.6, 1.5), friendly: opts.friendly || false,
    fallState: opts.fallState || null, incubating: null, grace: opts.grace ?? 0, cooldowns: {},
    colony: opts.colony ? opts.colony.map(s => ({ ...s })) : [],
    // Every optional field an entity can ever grow is declared here at birth, in a fixed order,
    // so ALL bodies (player included) share ONE hidden class. Without this, fields added later
    // and conditionally (marks, chill, lance flags, caps memo…) fork each entity into its own
    // shape and turn every property read in the hot loops megamorphic — the single biggest sim
    // cost under load (V8 LoadIC_Megamorphic). Spawn helpers reassign these slots, never add them.
    strain: opts.strain || null, strainPotency: opts.strainPotency ?? 1, bodyPlan: opts.bodyPlan || null,
    companionType: opts.companionType || null, ownerId: opts.ownerId || null, photophobic: opts.photophobic || false,
    ballast: false, maxDepth: 0, combatHit: 0, warded: 0, fissionCooldown: opts.fissionCooldown || 0,
    chill: 0, chillMult: 1, charmTimer: 0, friendLife: 0, marked: 0, markedBy: null, reproHeat: opts.reproHeat || 0,
    carriedStrains: null, _chemoWasFeeding: false,
    // Policy-graph brain state (free hunters only, but declared on every body to keep one hidden
    // class). brainState = current node; _targetRef = committed prey/threat object (steered toward
    // every frame, re-selected only on the throttled think tick); _think = seconds to next scan;
    // _commit = remaining commitment/give-up clock; aggro/caution = per-individual temperament
    // rolled at spawn; _wander = slow cruise heading offset; _preyScore = last scan's winning score.
    brainState: 'prowl', _targetRef: null, _think: rand(world, 0, 0.18), _commit: 0,
    aggro: 0.5, caution: 0.5, _wander: rand(world, 0, Math.PI * 2), _preyScore: -Infinity, _emigrate: 0,
    _capsEpoch: -1, _capsVal: null, _hasLance: false, _lanceReach: 0, _lanceCands: null, _raspStack: 0
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
    || hasOrg(entity, 'toxin_launcher') || hasOrg(entity, 'spore_toxin_launcher') || hasOrg(entity, 'harpoon_spine')
    || hasOrg(entity, 'combustion_vesicle');
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
  const os = ORGANELLES.oxygen_store.stats;
  return {
    hp: membrane * m.hp + hard * 8 + oc('multicell_chassis') * 70,
    energy: BASE_ENERGY_CAP + storage * s.energy + mito * ORGANELLES.mitochondrion.stats.energyMaxBonus + oc('atp_reservoir') * ORGANELLES.atp_reservoir.stats.energy,
    biomass: BASE_BIOMASS_CAP + storage * s.biomass + oc('biomass_vacuole') * ORGANELLES.biomass_vacuole.stats.biomass + oc('multicell_chassis') * 80,
    lipids: BASE_LIPID_CAP + storage * s.lipids + oc('lipid_vacuole') * ORGANELLES.lipid_vacuole.stats.lipids + mito * 30,
    toxins: BASE_TOXIN_CAP + storage * s.toxins + oc('toxin_vacuole') * ORGANELLES.toxin_vacuole.stats.toxins + oc('toxin_launcher') * ORGANELLES.toxin_launcher.stats.toxinCapBonus + oc('spore_toxin_launcher') * ORGANELLES.spore_toxin_launcher.stats.toxinCapBonus,
    spores: exotic * x.spores,
    enzymes: exotic * x.enzymes,
    crystals: exotic * x.crystals,
    dna: dnaSlots * ORGANELLES.dna_memory_vesicle.stats.dna,
    oxygen: BASE_OXYGEN_CAP + oc('membrane') * 0.12 + oc('oxygen_store') * os.oxygenCapBonus,   // O2 volume: a bigger body (membranes) holds more; Oxygen Vesicles add dedicated fuel capacity
    ballastGas: oc('oxygen_vacuole') * ov.gasCapBonus + oc('pressure_bladder') * ORGANELLES.pressure_bladder.stats.gasCapBonus  // buoyancy GAS capacity
  };
}

function clampCargo(entity) {
  const c = caps(entity);
  for (const r of RESOURCES) entity.cargo[r] = clamp(entity.cargo[r] || 0, 0, c[r] ?? 999);
  entity.hp = clamp(entity.hp, 0, c.hp);
  entity.oxygen = clamp(entity.oxygen || 0, 0, c.oxygen);
  entity.ballastGas = clamp(entity.ballastGas || 0, 0, c.ballastGas);
}

function oxygenTolerance(entity) {
  // Percentage-based: the safe O2 threshold is a FRACTION of the O2 tank, so a bigger tank
  // earns proportional headroom. Returns the absolute threshold so every caller stays correct.
  const frac = clamp(BASE_O2_SAFE_FRAC
    + orgCount(entity, 'oxygen_tolerance') * ORGANELLES.oxygen_tolerance.stats.toleranceFracBonus
    + orgCount(entity, 'catalase_vesicle') * ORGANELLES.catalase_vesicle.stats.toleranceFracBonus
    + orgCount(entity, 'mitochondrion') * O2_MITO_FRAC_BONUS, 0, 0.98);
  return caps(entity).oxygen * frac;
}

function membraneHardness(entity) {
  return orgCount(entity, 'membrane') * ORGANELLES.membrane.stats.hardness
    + orgCount(entity, 'membrane_hardening') * ORGANELLES.membrane_hardening.stats.hardnessBonus
    + orgCount(entity, 'barophilic_sheath') * ORGANELLES.barophilic_sheath.stats.hardnessPerDepth * pressureAt(entity.y) // stiffens with depth
    + ((entity.warded || 0) > 0 ? CONSUMABLES.ward.hardness : 0); // crystalline ward
}

function membranePorosity(entity) {
  const base = orgCount(entity, 'membrane') * ORGANELLES.membrane.stats.porosity;
  return clamp(base
    - orgCount(entity, 'oxygen_tolerance') * ORGANELLES.oxygen_tolerance.stats.porosityReduction
    - orgCount(entity, 'membrane_hardening') * ORGANELLES.membrane_hardening.stats.porosityReduction, 0.020, 0.32);
}

function biomassWeight(entity) {
  // Biomass is heavy now — accumulating it genuinely sinks you, driving the algae's fatten-and-fall.
  const cargoFactor = entity.controller === 'algae' ? 0.16 : 0.11;
  const structuralFactor = entity.controller === 'algae' ? 0.24 : 0.05;
  const stone = orgCount(entity, 'ballast_stone') * ORGANELLES.ballast_stone.stats.weight; // committed-diver anchor
  return Math.max(0, (entity.cargo.biomass || 0) * cargoFactor + entity.biomassMass * structuralFactor + Math.pow(entity.r, 1.18) * 0.010 + stone);
}

function algaeBallastWorkDepth(entity) {
  // Bigger veteran blooms must fall farther before pressure/deep fermentation can reinflate them.
  // This is the amplitude law: size changes the turning depth, while full gas still guarantees return.
  return WORLD.canopy + clamp(300 + (entity.biomassMass || 0) * 13, 520, 2300);
}

function buoyancy(entity) {
  // Lift is stored ballast GAS in the bladder — no oxygen term. A bladder-less body has only
  // the flat BASE_BUOYANCY; a gas-filled bladder floats. Gas comes from fermentation.
  const bladders = orgCount(entity, 'oxygen_vacuole');
  const s = ORGANELLES.oxygen_vacuole.stats;
  // Aerocysts are rigid, always-full floats — a lift floor that never vents.
  const aero = orgCount(entity, 'aerocyst') * ORGANELLES.aerocyst.stats.fixedLift;
  // Lipid Bladder: stored fat is lighter than water — buoyancy scaled by how full your lipid tank is.
  const lb = orgCount(entity, 'lipid_bladder');
  let lipidLift = 0;
  if (lb > 0) { const c = caps(entity); lipidLift = lb * ORGANELLES.lipid_bladder.stats.lipidLift * clamp((entity.cargo.lipids || 0) / Math.max(1, c.lipids), 0, 1); }
  if (entity.controller === 'algae' && bladders > 0) {
    // A viable bloom must always be able to return: full gas beats its current weight, while a big
    // bloom needs a larger fraction of the bladder filled and therefore falls farther before turning.
    // The bladder is one organ, but its physical volume grows with the bloom that carries it.
    const gasCap = Math.max(0.001, caps(entity).ballastGas);
    const gasFill = clamp((entity.ballastGas || 0) / gasCap, 0, 1);
    // Most of a gas bladder only offsets part of a mature bloom's weight. Its
    // final compressed charge gives a smooth recovery margin, so a fully inflated
    // heavy bloom can return from depth without a merely high fill pinning it at Yuki.
    const recoveryMargin = 0.75 + 0.55 * Math.pow(gasFill, 8);
    const weightScaledLift = biomassWeight(entity) * recoveryMargin;
    const bladderLift = Math.max(gasCap * s.liftPerGas, weightScaledLift) * gasFill;
    return BASE_BUOYANCY + aero + lipidLift + bladders * s.baseLift + bladderLift;
  }
  return BASE_BUOYANCY + aero + lipidLift + bladders * (s.baseLift + (entity.ballastGas || 0) * s.liftPerGas);
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
    if (id === 'biomass_vacuole') return sum + count * 1.9; // FAT tanks are heavy — a big belly swims slow
    if (id === 'storage_vacuole' || id === 'lipid_vacuole' || id === 'toxin_vacuole') return sum + count * 1.6;
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
    if (id === 'membrane') return sum + count * 5.2; // each layer dramatically enlarges the body (also drives engulf's size gate)
    if (id === 'membrane_intake') return sum + count * 0.32;
    if (id === 'biomass_vacuole') return sum + count * 2.6; // FAT tanks enlarge the body the most
    if (id === 'storage_vacuole' || id === 'lipid_vacuole' || id === 'toxin_vacuole') return sum + count * 2.1;
    if (id === 'exotic_vacuole') return sum + count * 1.25;
    if (id === 'multicell_chassis') return sum + count * 8;
    return sum + count * 0.72;
  }, 0);
  if (entity.controller === 'algae') {
    const massFill = clamp(((entity.cargo.biomass || 0) + (entity.biomassMass || 0) * 0.35) / Math.max(1, c.biomass), 0, 1.35);
    return clamp(base + massFill * 32 + organBulk * 0.35, 16, 118);
  }
  const storageAmplifier = 4.5 + (orgCount(entity, 'storage_vacuole') + orgCount(entity, 'biomass_vacuole')) * 4.8 + (orgCount(entity, 'lipid_vacuole') + orgCount(entity, 'toxin_vacuole')) * 3.0 + orgCount(entity, 'exotic_vacuole') * 1.8;
  return clamp(base + organBulk + fullness * storageAmplifier, 10, entity.kind === 'player' ? 92 : 108);
}

function vulnerability(entity) {
  let v = 1;
  if (entity.feedIntent) v += 0.18 + orgCount(entity, 'cytostome') * ORGANELLES.cytostome.stats.vulnerabilityBonus;
  if (entity.action === 'rasp') v += ORGANELLES.rasping_lamella.stats.vulnerabilityBonus;
  if (entity.repairIntent) v += 0.10;
  if ((entity.marked || 0) > 0) v += 0.50; // marked for death — the swarm's prey bleeds faster
  return v;
}

function hostReadiness(entity, world) {
  if (!entity) return { score: 0, ready: false, reasons: ['missing body'] };
  if (hasMito(entity)) return { score: 1, ready: false, reasons: ['already integrated'] };
  const lipid = clamp((entity.cargo.lipids || 0) / Math.max(12, caps(entity).lipids * 0.65), 0, 1);
  const membrane = clamp((orgCount(entity, 'cytostome') + orgCount(entity, 'lipid_repair_loom') + orgCount(entity, 'membrane_hardening') + orgCount(entity, 'oxygen_vacuole')) / 4, 0, 1);
  const exotics = clamp(((entity.cargo.spores || 0) / 3 + (entity.cargo.enzymes || 0) / 2 + (entity.cargo.crystals || 0) / 2) / 3, 0, 1);
  // The DNA precondition is now an UNLOCK, not a raw strand to spend: you must have
  // sequenced at least one genome (sequencing empties the tank, so carrying one would be
  // busywork). Falls back to carried DNA count when called without a world (tests).
  const unlockCount = (world && world.discoveredSources) ? world.discoveredSources.size : (entity.cargo.dna || 0);
  const unlocked = clamp(unlockCount / 1, 0, 1);
  // Descent is now a real precondition: the Eucharist demands you carry the pressure
  // of the deep in your body. Full credit only past the rupture layer, into the deep.
  const depth = clamp((entity.maxDepth || 0) / 3000, 0, 1);
  const score = 0.20 * lipid + 0.22 * membrane + 0.20 * exotics + 0.18 * unlocked + 0.20 * depth;
  const reasons = [];
  if (lipid < 0.8) reasons.push('needs lipid reserve');
  if (membrane < 0.66) reasons.push('needs host organs');
  if (exotics < 0.72) reasons.push('needs exotic traces');
  if (unlocked < 1) reasons.push('must sequence a genome — no DNA unlocked yet');
  if (depth < 0.85) reasons.push('must dive deeper into the rupture');
  return { score, ready: score >= 0.70, reasons };
}

export function step(world, commands = {}, dt = 1 / 60) {
  const player = getPlayer(world);
  if (!player) return stepEcology(world, dt);
  dt = clamp(dt, 0, 0.05);
  CAPS_EPOCH++; // invalidate every entity's per-frame caps() memo
  world.t += dt;
  world.events.length = 0;
  if (!player.alive) { removeDead(world); return world; }

  spawnTick(world, dt);
  applyPlayerCommands(world, player, commands, dt);
  return finishWorldStep(world, player, dt);
}

// Advance the autonomous ecology with no player body in the world. This is intentionally the same
// environment/NPC/contact/population pipeline used by gameplay; only player input and respawn are absent.
export function stepEcology(world, dt = 1 / 60) {
  dt = clamp(dt, 0, 0.05);
  CAPS_EPOCH++;
  world.t += dt;
  world.events.length = 0;
  spawnTick(world, dt);
  return finishWorldStep(world, null, dt);
}

function finishWorldStep(world, player, dt) {
  updateNPCs(world, player, dt);
  updateEnvironmentAndMetabolism(world, dt);
  updateFields(world, dt);
  updateParticles(world, dt);
  updateHazards(world, dt);
  applyActiveActionCosts(world, dt);
  updateStrainSystems(world, dt);
  resolveContacts(world, dt);
  removeDead(world);
  populationTick(world, dt); // hunters fission when gorged; scavengers emigrate when starved
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
    const damp = e.kind === 'player' ? 0.986 : 0.965;   // the player coasts (submarine INERTIA); NPCs settle quicker
    e.vx *= Math.pow(damp, dt * 60); e.vy *= Math.pow(damp, dt * 60);
    e.hit = Math.max(0, e.hit - dt); e.combatHit = Math.max(0, (e.combatHit || 0) - dt); e.grace = Math.max(0, (e.grace || 0) - dt);
    e.fissionCooldown = Math.max(0, (e.fissionCooldown || 0) - dt);
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
    // Cost tracks the thrust actually produced — which already falls with reserves via
    // speedOf's identical energyRatio — instead of a separate volume curve that floored
    // out and made low tanks slow AND wasteful. thrustFactor mirrors speedOf exactly, so
    // less thrust always means proportionally less ATP. efficiencyK adds a genuine low-tank
    // bonus: a draining cell pays less per unit thrust, so low reserves are slow-but-EFFICIENT.
    const energyRatio = clamp((player.cargo.energy || 0) / Math.max(1, caps(player).energy * 0.42), 0, 1);
    const thrustFactor = 0.18 + 0.82 * Math.pow(energyRatio, 0.65);
    const efficiencyK = 0.70 + 0.90 * energyRatio;
    const preMitoBurden = hasMito(player) ? 1.0 : 1.25;
    const moveCost = (0.30 + orgCount(player, 'flagella') * 0.090 + (player.cargo.biomass || 0) * 0.016 + Object.values(player.organelles || {}).reduce((a,b)=>a+b,0)*0.008) * thrustFactor * efficiencyK * preMitoBurden * dt;
    if (player.cargo.energy >= moveCost) {
      player.cargo.energy = Math.max(0, (player.cargo.energy || 0) - moveCost);
      const sp = speedOf(player);
      player.vx += move.x * sp * 3.8 * dt;
      player.vy += move.y * sp * 1.5 * dt;   // vertical is mostly BALLAST-driven — direct swim is a weak correction, not a jetpack
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
    if (commands.flame && hasOrg(player, 'combustion_vesicle')) flamePulse(world, player, commands.aimX, commands.aimY);
    if (commands.sporeshot && hasOrg(player, 'spore_toxin_launcher')) sporePulse(world, player, commands.aimX, commands.aimY);
    if (commands.harpoon && hasOrg(player, 'harpoon_spine')) harpoonPulse(world, player, commands.aimX, commands.aimY);
    if (commands.mark && hasOrg(player, 'pheromone_gland')) markPulse(world, player, commands.aimX, commands.aimY);
    if (commands.engulf && hasOrg(player, 'phagosome')) engulfPulse(world, player);
    if (commands.ward && hasOrg(player, 'crystal_ward')) wardPulse(world, player);
    if (commands.cloud && hasOrg(player, 'toxin_cloud')) toxinCloud(world, player);
    if (commands.jettison && hasOrg(player, 'jettison_vesicle')) ventBiomass(world, player);
    if (commands.divide && fissionReady(player) && world.entities.length < POP_CAP) playerFission(world, player);
  }

  // SUBMARINE BALLAST: W/S GRADUALLY pump or vent the gas bladder (an analog trim — a light touch
  // adjusts it slightly, it no longer dumps the whole reserve in an instant). Hold W to fill (grow
  // buoyant → the buoyancy force in updateEnvironment lifts you); hold S to vent (grow heavy → you
  // sink). Neutral holds your trim (minus a slow leak). Gas is the lift you MANAGE — an empty bladder
  // is heavy, so you sink and must pump gas or swim to hold depth. Gated on the oxygen vacuole.
  if (hasOrg(player, BALLAST.requires)) {
    const vy = commands.moveY || 0;   // W = negative (up), S = positive (down)
    const gasCap = caps(player).ballastGas;
    const trim = BALLAST.trimRate * (1 + orgCount(player, 'ballast_siphon') * ORGANELLES.ballast_siphon.stats.ventBonus);
    if (vy > 0.05) player.ballastGas = Math.max(0, (player.ballastGas || 0) - trim * vy * dt);              // S: vent → sink
    else if (vy < -0.05) player.ballastGas = Math.min(gasCap, (player.ballastGas || 0) + trim * (-vy) * dt); // W: pump → rise
    player.ballast = false; // legacy binary-flood flag retired
  }

  player.x = wrapX(player.x + player.vx * dt);
  player.y += player.vy * dt;
  if (powered && player.feedIntent) feedFromFields(world, player, dt);
  if (powered && player.repairIntent) repairFromLipids(world, player, dt);
  collectParticles(world, player);
}

// The free deep hunters run on the policy graph; leashed swarms/companions/broods keep their
// director/leash logic in the classic updateNPCs path below.
// FREE_HUNTERS use the full policy graph. HUNTER_GUILD is the broader trophic family used for
// crowding and cannibalism pressure; broods and their swarm are predators even though their steering
// is specialized. Keeping these concepts separate prevents directors from being scored as easy prey.
const FREE_HUNTERS = new Set(['predator', 'protozoan', 'metazoan']);
const HUNTER_GUILD = new Set(['predator', 'protozoan', 'metazoan', 'brood', 'swarm_agent']);
// A kill strips ATP out of the corpse, but wild hunters assimilate only a fraction of that charge.
// Keeping the player's generous yield preserves combat feel while making an NPC fission event cost
// several successful hunts instead of letting one large algae kill finance an outbreak by itself.
const ATP_HARVEST = Object.freeze({
  playerDrainFrac: 1.0, playerPerRadius: 2.5,
  npcDrainFrac: 0.35, npcPerRadius: 0.15
});
const ATP_HARVESTERS = new Set(['predator', 'protozoan', 'metazoan', 'companion']);

// Predator policy graph — a fixed little state machine ("the game is a graph"). Nodes are the
// keys below; edges are the cheap scalar transitions in updateNpcBrain. Per-node dials: speedMult
// scales max speed, homeBias is how hard the home-depth spring pulls (low = committed chase).
// Top-level scalars are the global feel knobs the user can tune.
const BRAIN = Object.freeze({
  THINK_INTERVAL: 0.18,  // seconds between expensive re-scans; steering stays every-frame
  ACCEPT_BASE: 1.6,      // target score a FED hunter needs to commit (high ⇒ it stands down)
  ACCEPT_SLOPE: 2.4,     // how far hunger lowers that bar: acceptBar = BASE − drive*SLOPE
  STRIKE_PAD: 42,        // px beyond r+r that counts as "in strike range" (rasp reach)
  GIVEUP_DIST: 1180,     // drop a committed target once it strays past this
  FLEE_HP: 0.34,         // HP fraction under which caution can trip a retreat
  FLEE_SIZE: 1.35,       // a close live body this many× my radius can trip a retreat
  RECOVER_ENTER: 0.005,  // only genuinely near-empty bodies pause; low charge otherwise motivates hunting
  RECOVER_EXIT: 0.04,    // enough charge to move and pursue an ATP-bearing meal
  prowl:  { speedMult: 0.55, homeBias: 0.38 },
  stalk:  { speedMult: 1.28, homeBias: 0.05 }, // committed chase — must run down fleeing prey
  strike: { speedMult: 1.12, homeBias: 0.02 },
  feed:   { speedMult: 0.65, homeBias: 0.20 },
  recover:{ speedMult: 0.32, homeBias: 0.52 },
  flee:   { speedMult: 1.25, homeBias: 0.10 }
});

// Roll a hunter's temperament once at spawn (deterministic via world.rng). Deeper spawns skew
// bolder and less cautious — the abyss breeds recklessness. Mutants deviate a touch more.
function initBrain(world, e, depthT = 0) {
  e.aggro = clamp(gaussian(world.rng, 0.45 + depthT * 0.30, 0.16), 0, 1);
  e.caution = clamp(gaussian(world.rng, 0.55 - depthT * 0.20, 0.16), 0, 1);
  if (e.strain) e.aggro = clamp(e.aggro * (0.85 + (e.strainPotency || 1) * 0.15), 0, 1);
  e.brainState = 'prowl';
  e._targetRef = null;
  e._commit = 0;
  e._think = rand(world, 0, BRAIN.THINK_INTERVAL);
  e._wander = rand(world, 0, Math.PI * 2);
  e._preyScore = -Infinity;
}

// Ranged + melee attack gates against a committed prey. Each weapon self-gates on its own range
// and ammo; rasp only flags on contact. Extracted verbatim from the classic prey block so ranged
// hunters still poke during the approach, not only in melee.
function tickChance(world, perFrameChance, dt) {
  return world.rng() < 1 - Math.pow(1 - perFrameChance, dt * 60);
}

function fireOnPrey(world, e, prey, preyDist, dt) {
  // Preserve a small charge reserve. An ATP-vampire can keep stalking with passive lances while low,
  // but it does not repeatedly spend its last molecule on launchers and collapse into immobility.
  if ((e.cargo.energy || 0) / Math.max(1, caps(e).energy) < 0.06) return;
  if (hasOrg(e, 'toxin_launcher') && preyDist < 520 && e.cargo.energy > ORGANELLES.toxin_launcher.stats.energyCost && e.cargo.toxins > ORGANELLES.toxin_launcher.stats.toxinCost && tickChance(world, 0.018, dt)) acidPulse(world, e, dxWrap(e.x, prey.x), prey.y - e.y);
  if (hasOrg(e, 'spore_toxin_launcher') && preyDist < 540 && e.cargo.energy > ORGANELLES.spore_toxin_launcher.stats.energyCost && e.cargo.toxins > ORGANELLES.spore_toxin_launcher.stats.toxinCost && (e.cargo.spores || 0) >= ORGANELLES.spore_toxin_launcher.stats.sporeCost && tickChance(world, 0.014, dt)) sporePulse(world, e, dxWrap(e.x, prey.x), prey.y - e.y);
  if (hasOrg(e, 'harpoon_spine') && preyDist < 480 && e.cargo.energy > ORGANELLES.harpoon_spine.stats.energyCost && tickChance(world, 0.02, dt)) harpoonPulse(world, e, dxWrap(e.x, prey.x), prey.y - e.y);
  if (hasOrg(e, 'combustion_vesicle') && preyDist < e.r + prey.r + ORGANELLES.combustion_vesicle.stats.reach) flamePulse(world, e, dxWrap(e.x, prey.x), prey.y - e.y);
  if (hasOrg(e, 'pheromone_gland') && preyDist < 520 && (e.cargo.spores || 0) >= ORGANELLES.pheromone_gland.stats.sporeCost && (prey.marked || 0) <= 0 && tickChance(world, 0.014, dt)) markPulse(world, e, dxWrap(e.x, prey.x), prey.y - e.y);
  if (hasRasp(e) && preyDist < e.r + prey.r + BRAIN.STRIKE_PAD) e.action = 'rasp';
}

function logistic(x) { return 1 / (1 + Math.exp(-clamp(x, -24, 24))); }

function normalizeWeights(weights) {
  let total = 0;
  for (const value of Object.values(weights)) total += Math.max(0, value);
  const out = {};
  for (const [key, value] of Object.entries(weights)) out[key] = Math.max(0, value) / Math.max(1e-9, total);
  return out;
}

function sampleWeights(world, weights) {
  let roll = world.rng(), last = 'prowl';
  for (const [key, value] of Object.entries(weights)) {
    last = key; roll -= value;
    if (roll <= 0) return key;
  }
  return last;
}

// Threat is a continuous pressure, not a tripwire. Oxygen, light, injury, recent damage, opponent
// size, distance, and temperament all contribute smoothly. `source` only chooses a flee direction;
// the magnitude remains continuous and competes with every other behavioral drive.
function hunterThreatPressure(e, myCapHp) {
  const target = e._targetRef && e._targetRef.alive ? e._targetRef : null;
  const hpFill = clamp(e.hp / Math.max(1, myCapHp), 0, 1);
  const oxygenExcess = oxygenAt(e.y) - oxygenTolerance(e);
  const oxygenRisk = logistic((oxygenExcess - 0.10) * 42);
  const lightRisk = e.photophobic ? logistic((lightAt(e.y) - (LIGHT_BURN.threshold - 0.05)) * 24) : 0;
  const injuryRisk = Math.pow(1 - hpFill, 2.1) * (0.55 + (e.caution || 0.5));
  const combatRisk = clamp((e.combatHit || 0) / 0.18, 0, 1) * Math.pow(1 - hpFill * 0.65, 1.5);
  let bodyRisk = 0;
  if (target) {
    const sizeRatio = target.r / Math.max(4, e.r);
    const proximity = logistic((e.r + target.r + 190 - distWrap(e.x, e.y, target.x, target.y)) * 0.018);
    const targetWeakness = 1 - clamp(target.hp / Math.max(1, caps(target).hp), 0, 1);
    bodyRisk = logistic((sizeRatio - (1.55 + (1 - (e.caution || 0.5)) * 0.55)) * 4.2)
      * proximity * (1 - targetWeakness * 0.72);
  }
  const risk = clamp(1 - (1 - oxygenRisk) * (1 - lightRisk) * (1 - injuryRisk)
    * (1 - combatRisk) * (1 - bodyRisk), 0, 1);
  const dive = oxygenRisk + lightRisk > injuryRisk + combatRisk + bodyRisk;
  return { risk, source: dive ? null : target, dive };
}

function hunterPolicy(world, e, player, energyFill, myCapHp) {
  const prey = bestBodyTarget(e, world, player); // also records the continuous prey score
  const field = feedingOrgCount(e) > 0 ? bestFieldFor(e, world) : null;
  const threat = hunterThreatPressure(e, myCapHp);
  const drive = huntDrive(e);
  const acceptCenter = BRAIN.ACCEPT_BASE - drive * BRAIN.ACCEPT_SLOPE;
  const preyAppeal = prey ? logistic((e._preyScore - acceptCenter) * 1.45) : 0;
  const preyDist = prey ? distWrap(e.x, e.y, prey.x, prey.y) : Infinity;
  const strikeBlend = prey ? logistic((e.r + prey.r + BRAIN.STRIKE_PAD - preyDist) * 0.045) : 0;
  const matter = field ? Math.max(0, field._matter || 0) : 0;
  const fieldAppeal = field ? logistic((Math.log1p(matter) - 2.2) * 1.6) * clamp(e.hunger || 0, 0, 1) : 0;
  const exhaustion = Math.pow(1 - clamp(energyFill, 0, 1), 7);
  const safety = 1 - threat.risk;

  const raw = {
    prowl: 0.10 + 0.62 * (1 - preyAppeal) * (1 - fieldAppeal) + 0.18 * (1 - (e.hunger || 0)),
    stalk: 2.7 * preyAppeal * (1 - strikeBlend * 0.82) * safety,
    strike: 3.3 * preyAppeal * strikeBlend * safety,
    feed: 1.45 * fieldAppeal * (1 - preyAppeal * 0.62) * safety,
    recover: 0.002 + 1.8 * exhaustion * (1 - preyAppeal * 0.72) * (0.45 + safety * 0.55),
    flee: 0.002 + 4.4 * Math.pow(threat.risk, 2.15)
  };
  // Memory is another continuous term: it makes behavior legible without making a state sticky
  // until a timer or threshold fires.
  if (raw[e.brainState] != null) raw[e.brainState] *= 1.8;
  const probabilities = normalizeWeights(raw);
  return { probabilities, prey, field, threat, preyAppeal, strikeBlend };
}

// The policy-graph brain for free hunters. Selection scans (bestBodyTarget/bestFieldFor) run only
// on the throttled think tick; steering toward the committed target/point runs every frame.
function updateNpcBrainThresholdLegacy(world, e, player, dt) {
  const powered = hasEnergy(e) && (orgCount(e, 'basal_motility') > 0 || orgCount(e, 'flagella') > 0);
  const myCapHp = caps(e).hp;
  const energyFill = (e.cargo.energy || 0) / Math.max(1, caps(e).energy);

  // Free-roamers let their home depth drift toward wherever the hunt takes them, so the predator
  // layer follows the algal fall down instead of pinning to the seam where it spawned.
  if (!e.ownerId) {
    e.depthHome += (e.y - e.depthHome) * 0.12 * dt;
    e.depthHome = clamp(e.depthHome, WORLD.ruptureTop - 260, WORLD.h - 220);
  }

  // An exhausted hunter must stop spending and let its processors rebuild charge. Without this node,
  // a zero-ATP body remains committed to strike, loses steering, and becomes part of an inert pile.
  if (e.brainState !== 'flee' && e.brainState !== 'recover' && energyFill < BRAIN.RECOVER_ENTER) {
    e.brainState = 'recover'; e._targetRef = null; e._commit = 0;
  }
  if (e.brainState === 'recover' && energyFill >= BRAIN.RECOVER_EXIT) {
    e.brainState = 'prowl'; e._targetRef = null;
  }

  // Survival overrides every node.
  if (e.brainState !== 'flee') {
    const threat = fleeThreat(world, e, myCapHp);
    if (threat) enterFlee(e, threat);
  }

  e._think -= dt;
  const think = e._think <= 0;
  if (think) e._think = BRAIN.THINK_INTERVAL * rand(world, 0.85, 1.15);

  let tx = e.x + Math.cos(e._wander) * 120, ty = e.depthHome, mode = 'home';
  const node = BRAIN[e.brainState] || BRAIN.prowl;

  switch (e.brainState) {
    case 'prowl': {
      // Organic cruise: a slowly-turning heading (deterministic per individual) around home depth.
      e._wander += Math.sin((world.t + e.phase) * 0.5) * 0.6 * dt;
      tx = e.x + Math.cos(e._wander) * 220; ty = e.depthHome + Math.sin(e._wander) * 60;
      if (think) {
        const drive = huntDrive(e);
        const field = bestFieldFor(e, world);
        const prey = bestBodyTarget(e, world, player); // stashes e._preyScore
        const acceptBar = BRAIN.ACCEPT_BASE - drive * BRAIN.ACCEPT_SLOPE;
        if (prey && e._preyScore > acceptBar) {
          e._targetRef = prey; e.brainState = 'stalk';
          e._commit = 2.5 + drive * 3.0;           // hungrier ⇒ chases longer before giving up
        } else if (field && feedingOrgCount(e) > 0 && e.hunger > 0.15 && (field._matter || 0) > 4) {
          e._targetRef = field; e.brainState = 'feed';
        }
      }
      break;
    }
    case 'stalk': {
      const t = e._targetRef;
      if (!t || !t.alive) { e.brainState = 'prowl'; e._targetRef = null; break; }
      const d = distWrap(e.x, e.y, t.x, t.y);
      tx = t.x; ty = t.y; mode = 'prey';
      e._commit -= dt;
      if (powered) fireOnPrey(world, e, t, d, dt);  // ranged pokes land during the approach
      if (d < e.r + t.r + BRAIN.STRIKE_PAD) e.brainState = 'strike';
      else if (d > BRAIN.GIVEUP_DIST || e._commit <= 0) { e.brainState = 'prowl'; e._targetRef = null; }
      else if (think) {
        const prey = bestBodyTarget(e, world, player);
        if (prey && prey !== t && e._preyScore > BRAIN.ACCEPT_BASE) { e._targetRef = prey; e._commit = Math.max(e._commit, 2.0); }
      }
      break;
    }
    case 'strike': {
      const t = e._targetRef;
      if (!t || !t.alive) {
        // Killed (or lost) → stand down. The KILL's ATP was already ripped into the reservoir at the
        // death blow (see hurt's ATP harvest — that's what the hunter is really after). Here it also
        // takes a mouthful of meat and fat for its OWN upkeep, repair, and fermentation buffer. NOTE:
        // this bite is an abstract restock; it does NOT reduce the corpse field (bloomDeath builds the
        // field from the victim's full cargo), so the scavengers still get the whole body's biomass +
        // lipids regardless — the partition is the ATP-strip, not a smaller bite. A well-fed hunter
        // survives to keep hunting; a starving one dies before it can reproduce.
        if (t && distWrap(e.x, e.y, t.x, t.y) < e.r + t.r + 90) {
          const cap = caps(e);
          const bRoom = cap.biomass - (e.cargo.biomass || 0);
          if (bRoom > 0) e.cargo.biomass = (e.cargo.biomass || 0) + Math.min(bRoom, t.r * 0.7);
          const lRoom = cap.lipids - (e.cargo.lipids || 0);
          if (lRoom > 0) e.cargo.lipids = (e.cargo.lipids || 0) + Math.min(lRoom, t.r * 0.22);
          const mealRelief = clamp(0.25 + (t.r / Math.max(12, e.r)) * 0.28, 0.35, 0.72);
          e.hunger = clamp(e.hunger - mealRelief, 0, 1); // a real kill buys a meaningful satiated interval
        }
        e.brainState = 'prowl'; e._targetRef = null; break;
      }
      const d = distWrap(e.x, e.y, t.x, t.y);
      tx = t.x; ty = t.y; mode = 'prey';
      if (d > (e.r + t.r + BRAIN.STRIKE_PAD) * 1.4) { e.brainState = 'stalk'; e._commit = Math.max(e._commit, 1.5); break; }
      if (powered) fireOnPrey(world, e, t, d, dt);
      break;
    }
    case 'feed': {
      const t = e._targetRef;
      if (think) {
        if (feedingOrgCount(e) <= 0) { e.brainState = 'prowl'; e._targetRef = null; break; }
        const field = bestFieldFor(e, world); // refresh to a live field (never chase a ghost)
        if (!field || e.hunger < 0.10) { e.brainState = 'prowl'; e._targetRef = null; break; }
        e._targetRef = field;
        // Opportunism while grazing: a clearly easy kill still tempts even a feeding hunter.
        const drive = huntDrive(e);
        const prey = bestBodyTarget(e, world, player);
        if (prey && e._preyScore > BRAIN.ACCEPT_BASE - drive * BRAIN.ACCEPT_SLOPE + 0.6) {
          e._targetRef = prey; e.brainState = 'stalk'; e._commit = 2.5 + drive * 3.0; break;
        }
      }
      if (t && t.radius != null) {
        tx = t.x; ty = t.y; mode = 'field';
        if (powered && distWrap(e.x, e.y, t.x, t.y) < e.r + t.radius * 0.9) {
          e.feedIntent = true;
          feedFromFields(world, e, dt);
          collectParticles(world, e);
        }
      }
      break;
    }
    case 'recover': {
      // Recovery is metabolic, not field grazing. It is still predatory: a nearby defenseless bloom
      // can be shadowed with low thrust and struck by a passive lance, but ATP-consuming attacks stay
      // quiet until charge recovers. This reads as ambush/rest rather than an inert pile.
      if (think) {
        const prey = bestBodyTarget(e, world, player);
        e._targetRef = prey && prey.controller === 'algae' && distWrap(e.x, e.y, prey.x, prey.y) < 430 ? prey : null;
      }
      const t = e._targetRef;
      if (t && t.alive && t.controller === 'algae') { tx = t.x; ty = t.y; mode = 'prey'; }
      else {
        e._targetRef = null;
        e._wander += Math.sin((world.t + e.phase) * 0.35) * 0.35 * dt;
        tx = e.x + Math.cos(e._wander) * 90; ty = e.depthHome; mode = 'home';
      }
      break;
    }
    case 'flee': {
      let ax, ay;
      const t = e._targetRef;
      if (t && t.alive) { const aw = norm(dxWrap(t.x, e.x), e.y - t.y); ax = aw.x; ay = aw.y; } // away from the threat
      else { ax = Math.cos(e._wander); ay = Math.sin(e._wander); }
      tx = e.x + ax * 320; ty = e.y + ay * 320; mode = 'prey'; // 'prey' mode = fast, low home bias
      e._commit -= dt;
      if (e._commit <= 0 && !fleeThreat(world, e, myCapHp)) { e.brainState = 'prowl'; e._targetRef = null; }
      break;
    }
  }

  // Steering integrate — the classic updateNPCs tail, node-parameterized.
  const dyHome = e.depthHome - e.y;
  let toward = norm(dxWrap(e.x, tx), (ty - e.y) + dyHome * node.homeBias);
  // Behavioral separation, not hard collision: hunters still overlap prey, but nearby guild-mates
  // bias one another apart so a whole layer does not collapse onto one coordinate.
  let sepX = 0, sepY = 0;
  for (const other of world.entities) {
    if (!other.alive || other.id === e.id || !HUNTER_GUILD.has(other.controller)) continue;
    const dx = dxWrap(e.x, other.x), dy = other.y - e.y;
    const d = Math.hypot(dx, dy) || 1;
    const comfort = e.r + other.r + 70;
    if (d >= comfort) continue;
    const push = (comfort - d) / comfort;
    sepX -= dx / d * push; sepY -= dy / d * push;
  }
  if (Math.abs(sepX) + Math.abs(sepY) > 0.001) toward = norm(toward.x + sepX * 0.58, toward.y + sepY * 0.58);
  const sp = powered ? speedOf(e) * (e.feedIntent ? 0.62 : 1) * node.speedMult : 0;
  const accel = mode === 'prey' ? 4.2 : 2.5;
  e.vx += toward.x * sp * accel * dt;
  e.vy += toward.y * sp * accel * dt;
  e.phase = Math.atan2(toward.y, toward.x);
  e.x = wrapX(e.x + e.vx * dt);
  e.y += e.vy * dt;
}

// Continuous hunter policy. Named states remain as a sampled, observable pose for rendering and
// telemetry, but no threshold edge decides the next action. Each think tick recomputes a probability
// distribution from the body's continuous internal and external pressures; one behavior collapses
// from that distribution. Locomotion parameters are probability-weighted, so even the motion varies
// continuously instead of jumping wholesale when the label changes.
function updateNpcBrain(world, e, player, dt) {
  const powered = hasEnergy(e) && (orgCount(e, 'basal_motility') > 0 || orgCount(e, 'flagella') > 0);
  const cap = caps(e);
  const energyFill = (e.cargo.energy || 0) / Math.max(1, cap.energy);

  if (!e.ownerId) {
    e.depthHome += (e.y - e.depthHome) * 0.12 * dt;
    e.depthHome = clamp(e.depthHome, WORLD.ruptureTop - 260, WORLD.h - 220);
  }

  // A completed hunt pays meat/fat once. ATP itself was transferred at the killing blow in hurt().
  const meal = e._mealRef;
  if (meal && !meal.alive) {
    if (distWrap(e.x, e.y, meal.x, meal.y) < e.r + meal.r + 90) {
      const bRoom = cap.biomass - (e.cargo.biomass || 0);
      if (bRoom > 0) e.cargo.biomass = (e.cargo.biomass || 0) + Math.min(bRoom, meal.r * 0.7);
      const lRoom = cap.lipids - (e.cargo.lipids || 0);
      if (lRoom > 0) e.cargo.lipids = (e.cargo.lipids || 0) + Math.min(lRoom, meal.r * 0.22);
      const mealRelief = clamp(0.25 + (meal.r / Math.max(12, e.r)) * 0.28, 0.35, 0.72);
      e.hunger = clamp(e.hunger - mealRelief, 0, 1);
    }
    e._mealRef = null;
    if (e._targetRef === meal) e._targetRef = null;
  }

  e._think -= dt;
  const think = e._think <= 0;
  if (think) {
    e._think = BRAIN.THINK_INTERVAL * rand(world, 0.85, 1.15);
    const policy = hunterPolicy(world, e, player, energyFill, cap.hp);
    e._policy = policy.probabilities;
    e._policyDrives = { prey: policy.preyAppeal, strike: policy.strikeBlend, threat: policy.threat.risk, energy: energyFill };
    e.brainState = sampleWeights(world, policy.probabilities);

    if ((e.brainState === 'stalk' || e.brainState === 'strike') && policy.prey) {
      e._targetRef = policy.prey;
      e._mealRef = policy.prey;
    } else if (e.brainState === 'feed') {
      e._targetRef = policy.field;
    } else if (e.brainState === 'flee') {
      e._targetRef = policy.threat.source;
      if (!policy.threat.source) e._wander = policy.threat.dive ? Math.PI / 2 : e.phase + Math.PI;
    } else if (e.brainState === 'recover') {
      e._targetRef = policy.prey && policy.prey.controller === 'algae' && world.rng() < policy.preyAppeal * 0.45
        ? policy.prey : null;
    } else {
      e._targetRef = null;
    }
  }

  const probabilities = e._policy || { prowl: 1 };
  let speedMult = 0, homeBias = 0;
  for (const [state, probability] of Object.entries(probabilities)) {
    const settings = BRAIN[state] || BRAIN.prowl;
    speedMult += probability * settings.speedMult;
    homeBias += probability * settings.homeBias;
  }

  let tx = e.x + Math.cos(e._wander) * 120, ty = e.depthHome, mode = 'home';
  const target = e._targetRef;
  switch (e.brainState) {
    case 'stalk':
    case 'strike': {
      if (target && target.alive) {
        const d = distWrap(e.x, e.y, target.x, target.y);
        tx = target.x; ty = target.y; mode = 'prey';
        if (powered) fireOnPrey(world, e, target, d, dt);
      }
      break;
    }
    case 'feed': {
      if (target && target.radius != null) {
        tx = target.x; ty = target.y; mode = 'field';
        if (powered && distWrap(e.x, e.y, target.x, target.y) < e.r + target.radius * 0.9) {
          e.feedIntent = true;
          feedFromFields(world, e, dt);
          collectParticles(world, e);
        }
      }
      break;
    }
    case 'recover': {
      if (target && target.alive) { tx = target.x; ty = target.y; mode = 'prey'; }
      else {
        e._wander += Math.sin((world.t + e.phase) * 0.35) * 0.35 * dt;
        tx = e.x + Math.cos(e._wander) * 90;
      }
      break;
    }
    case 'flee': {
      let ax, ay;
      if (target && target.alive) { const away = norm(dxWrap(target.x, e.x), e.y - target.y); ax = away.x; ay = away.y; }
      else { ax = Math.cos(e._wander); ay = Math.sin(e._wander); }
      tx = e.x + ax * 320; ty = e.y + ay * 320; mode = 'prey';
      break;
    }
    default:
      e._wander += Math.sin((world.t + e.phase) * 0.5) * 0.6 * dt;
      tx = e.x + Math.cos(e._wander) * 220; ty = e.depthHome + Math.sin(e._wander) * 60;
      break;
  }

  const dyHome = e.depthHome - e.y;
  let toward = norm(dxWrap(e.x, tx), (ty - e.y) + dyHome * homeBias);
  let sepX = 0, sepY = 0;
  for (const other of world.entities) {
    if (!other.alive || other.id === e.id || !HUNTER_GUILD.has(other.controller)) continue;
    const dx = dxWrap(e.x, other.x), dy = other.y - e.y;
    const d = Math.hypot(dx, dy) || 1, comfort = e.r + other.r + 70;
    if (d >= comfort) continue;
    const push = (comfort - d) / comfort;
    sepX -= dx / d * push; sepY -= dy / d * push;
  }
  if (Math.abs(sepX) + Math.abs(sepY) > 0.001) toward = norm(toward.x + sepX * 0.58, toward.y + sepY * 0.58);
  const speed = powered ? speedOf(e) * (e.feedIntent ? 0.62 : 1) * speedMult : 0;
  const accel = mode === 'prey' ? 4.2 : 2.5;
  e.vx += toward.x * speed * accel * dt;
  e.vy += toward.y * speed * accel * dt;
  e.phase = Math.atan2(toward.y, toward.x);
  e.x = wrapX(e.x + e.vx * dt);
  e.y += e.vy * dt;
}

// Scavenger brain — a forager, not a hunter (no weapon). Two nodes: forage (seek + graze the best
// field, or wander the nursery) and flee (bolt from an attacker when struck, or dive out of O2-
// toxic shallows). The "flee when taking damage" the froth's prey needs. Throttled scan like the
// hunters; reuses the same _think/_commit/_targetRef/_wander slots.
function updateScavengerBrain(world, e, dt) {
  const powered = hasEnergy(e) && (orgCount(e, 'basal_motility') > 0 || orgCount(e, 'flagella') > 0);

  // Panic: a combat hit (0.18; environmental stress only sets 0.05) → bolt from the attacker;
  // or the shallows are turning O2-toxic → dive back down.
  if (e.brainState !== 'flee') {
    if (e.hit > 0.12) {
      const atk = e.targetId ? world.entities.find(x => x.id === e.targetId && x.alive) : null;
      e.brainState = 'flee'; e._commit = 1.4 + e.caution;
      if (atk) e._targetRef = atk; else { e._targetRef = null; e._wander = e.phase + Math.PI; }
    } else if (oxygenAt(e.y) - oxygenTolerance(e) > 0.10) {
      e.brainState = 'flee'; e._commit = 0.7; e._targetRef = null; e._wander = Math.PI / 2;
    }
  }

  e._think -= dt;
  const think = e._think <= 0;
  if (think) e._think = BRAIN.THINK_INTERVAL * rand(world, 0.85, 1.15);

  let tx = e.x, ty = e.depthHome, mode = 'home', spMul = 0.6;
  if (e.brainState === 'flee') {
    let ax, ay;
    const t = e._targetRef;
    if (t && t.alive) { const aw = norm(dxWrap(t.x, e.x), e.y - t.y); ax = aw.x; ay = aw.y; } // away from the attacker
    else { ax = Math.cos(e._wander); ay = Math.sin(e._wander); }
    tx = e.x + ax * 300; ty = e.y + ay * 300; mode = 'flee'; spMul = 1.1; // darts, but doesn't outrun a committed hunter
    e._commit -= dt;
    if (e._commit <= 0 && e.hit <= 0.12 && oxygenAt(e.y) - oxygenTolerance(e) <= 0.10) { e.brainState = 'forage'; e._targetRef = null; }
  } else {
    let field = (e._targetRef && e._targetRef.radius != null) ? e._targetRef : null;
    if (think) { field = bestFieldFor(e, world); e._targetRef = field; }
    if (field) {
      tx = field.x; ty = field.y; mode = 'field'; spMul = 0.85;
      if (powered && distWrap(e.x, e.y, field.x, field.y) < e.r + field.radius * 0.9) {
        e.feedIntent = true; feedFromFields(world, e, dt); collectParticles(world, e);
      }
    } else {
      e._wander += Math.sin((world.t + e.phase) * 0.5) * 0.6 * dt;
      tx = e.x + Math.cos(e._wander) * 180; ty = e.depthHome + Math.sin(e._wander) * 50; mode = 'home'; spMul = 0.6;
    }
  }

  const dyHome = e.depthHome - e.y;
  const homeBias = mode === 'flee' ? 0.05 : mode === 'field' ? 0.18 : 0.34;
  const toward = norm(dxWrap(e.x, tx), (ty - e.y) + dyHome * homeBias);
  const sp = powered ? speedOf(e) * (e.feedIntent ? 0.62 : 1) * spMul : 0;
  const accel = mode === 'flee' ? 4.0 : 2.5;
  e.vx += toward.x * sp * accel * dt;
  e.vy += toward.y * sp * accel * dt;
  e.phase = Math.atan2(toward.y, toward.x);
  e.x = wrapX(e.x + e.vx * dt);
  e.y += e.vy * dt;
}

function updateNPCs(world, player, dt) {
  // Previous-frame commitments provide a cheap congestion signal during this frame's think scans.
  // Large prey can carry several attackers; small prey should not attract the whole predator layer.
  const claims = new Map();
  for (const e of world.entities) {
    const t = e.alive ? e._targetRef : null;
    if (t && t.controller && t.alive) claims.set(t.id, (claims.get(t.id) || 0) + 1);
  }
  world._targetClaims = claims;
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

    if (e.controller === 'scavenger') { updateScavengerBrain(world, e, dt); continue; }

    if (FREE_HUNTERS.has(e.controller)) { updateNpcBrain(world, e, player, dt); continue; }

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
      e._targetRef = prey; // collision weapons obey this deliberate choice
      tx = prey.x; ty = prey.y; targetMode = 'prey';
      const preyDist = distWrap(e.x, e.y, prey.x, prey.y);
      if (powered) fireOnPrey(world, e, prey, preyDist, dt);
    } else if (hunts && e._targetRef?.controller) e._targetRef = null;

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
  // Algae have NO flagella and no swim — vertical motion is PURE BALLAST. Net buoyancy (ballast
  // gas lift vs biomass weight) is the only thing that moves a bloom up or down. Lean gas-full
  // blooms float to the light and photosynthesize; as they fatten, weight overtakes the gas and
  // they sink; a sunk bloom in the dark ferments its biomass back into lift-gas and can rise
  // again. The froth breathes — and because each bloom's biomass/gas history differs, they cycle
  // out of phase instead of in one giant synchronized wave.
  const weight = biomassWeight(e);
  const lift = buoyancy(e); // ballast gas + base only — no flagella term
  const fullness = (e.cargo.biomass || 0) / Math.max(1, caps(e).biomass);
  const sinkPressure = weight - lift; // >0 sinks, <0 floats

  // Fall event = a bloom the ballast can no longer hold. Wide dead-band so a marginal bloom
  // doesn't chatter its fall flag every frame. Only used for the terminal-plunge accelerant +
  // the algae_fall stat/event; the actual up/down is the buoyancy force below either way.
  const tooFat = sinkPressure > 12 || (fullness > 0.95 && sinkPressure > 0);
  if (tooFat && e.fallState !== 'sinking') {
    e.fallState = 'sinking';
    world.stats.algaeFalls += 1;
    world.events.push({ type: 'algae_fall', entityId: e.id });
  }
  if (e.fallState === 'sinking' && sinkPressure < -3) e.fallState = 'rising';
  if (e.fallState === 'rising' && e.y < WORLD.canopy + 240) e.fallState = null;

  // Horizontal graze drift, per-bloom phase so the crop doesn't slide in lockstep.
  e.vx += Math.cos(world.t * 0.35 + e.phase) * speedOf(e) * 0.28 * dt;
  // Vertical: buoyancy is the sole driver. sinkPressure<0 (buoyant) → up (vy negative);
  // sinkPressure>0 (heavy) → down. Gentle gain + clamp so it's a smooth drift, not a lurch.
  e.vy += clamp(sinkPressure * 0.42, -14, 22) * dt;
  e.vy += Math.sin(world.t * 0.5 + e.phase) * 3 * dt;          // slow bob
  // A committed plunge picks up speed, but the deeper it goes the harder its ballast fights back
  // (deep fermentation, below), so the fall is a bob that bottoms out — not a one-way drop to the
  // floor. Softened from the old runaway accelerant that showered small blooms past the scavengers.
  if (e.fallState === 'sinking') e.vy += (fullness * 5 + 2) * dt;
  // Soft ceiling: a buoyant bloom grazes the lit band instead of pinning to the very roof.
  const ceil = WORLD.canopy + 70;
  if (e.y < ceil) e.vy += (ceil - e.y) * 0.05 * dt;

  e.phase = Math.atan2(e.vy, e.vx || 0.001);
  e.x = wrapX(e.x + e.vx * dt);
  e.y += e.vy * dt;

  // Bloat with mass: a fat bloom swells visibly, so the biggest blooms are the deep divers and
  // the shallow crop reads small — size escalates with depth exactly as the descent sorts them.
  const c = caps(e);
  e.r = clamp(e.baseR * (0.72 + ALGAE_BLOAT_K * Math.sqrt(Math.max(0, e.biomassMass || 0) / 60)), e.baseR * 0.7, e.baseR * 2.6);
  // Yuki's canopy is a steep, strong heal: bask in the bright top band to mend before the next
  // bloat-and-fall. The lightless deep is attrition — a bloom must ride its ballast back up to the
  // light to survive; one that can't recover starves and dissolves into deep slurry for the froth.
  const light = lightAt(e.y);
  e.hp = Math.min(c.hp, e.hp + ALGAE_HEAL * light * dt); // bask: heal ∝ light, so a rising bloom mends on the way up
  const depthFrac = clamp((e.y - WORLD.deepTop) / Math.max(1, WORLD.h - WORLD.deepTop), 0, 1);
  if (depthFrac > 0) {
    e.hp -= ALGAE_DEEP_ATTR * depthFrac * dt; // only the TRUE deep starves a bloom — ride back up or dissolve
    if (e.hp <= 0) e.alive = false; // removeDead turns it into an abyssal feed-field for the deep froth
  }

  // Growth-by-ascension: a bloom that has sunk out of the bright band and then rides back up to the
  // light earns another Photosystem patch (up to the organ's max), and the new patch is structural
  // weight. Blooms therefore GROW over successive bobs — young ones are small and hug the upper
  // reaches; only veterans that have cycled many times get heavy enough to sink into the scavengers'
  // nursery and, largest of all, to fall into the true deep. This stratifies the whole crop by size.
  if (e.y > WORLD.canopy + 300) e._dove = true;
  if (e._dove && light > 0.5 && orgCount(e, 'photosystem') < ORGANELLES.photosystem.max) {
    e.organelles.photosystem = orgCount(e, 'photosystem') + 1;
    e.biomassMass = (e.biomassMass || 0) + 6;
    e._dove = false;
    e._capsEpoch = -1;
  }
}

function updateEnvironmentAndMetabolism(world, dt) {
  for (const e of world.entities) {
    if (!e.alive) continue;
    // Successful hunters retain a fading reproductive heat: it makes a local run of kills capable
    // of producing a pulse, but the opportunity cools away when the food web goes quiet.
    e.reproHeat = Math.max(0, (e.reproHeat || 0) * Math.exp(-0.012 * dt));
    // Mass tax: stored biomass carries a flat basal ATP upkeep (MASS_TAX_K). It self-regulates — the
    // drain opens ATP headroom, the fermentation engine burns biomass to refill it, so biomass FLOWS
    // and can never be hoarded even at idle. Lean bodies barely notice; a fat body pays constant rent.
    // Applies to every body (no player exception) — it is the metabolic basis of the 2×2 archetypes.
    if ((e.cargo.biomass || 0) > 0) {
      e.cargo.energy = Math.max(0, (e.cargo.energy || 0) - (e.cargo.biomass || 0) * MASS_TAX_K * dt);
    }
    const light = lightAt(e.y);
    const extO2 = oxygenAt(e.y);
    const porosity = membranePorosity(e);
    // No passive O2 diffusion any more: your stored O2 stays put unless you BREATHE (feed, which
    // equilibrates it toward the water's saturation — see feedFromFields) or RESPIRE (burn it for
    // ATP below). So you don't bleed oxygen just by sitting in the deep; you manage it by where you feed.
    // Countercurrent Gill: active O2 uptake far beyond bare diffusion, when the water is richer.
    const gill = orgCount(e, 'countercurrent_gill');
    if (gill > 0 && extO2 > e.oxygen) e.oxygen = Math.min(caps(e).oxygen, e.oxygen + (extO2 - e.oxygen) * gill * ORGANELLES.countercurrent_gill.stats.uptake * dt);
    // Ballast gas leaks out through the membrane ∝ porosity — a soft cell deflates fast (bobs),
    // a hardened cell holds its dive. This is the passive sink that lets a fat bloom fall.
    if ((e.ballastGas || 0) > 0) {
      const lightVent = e.controller === 'algae' ? light * ALGAE_LIGHT_GAS_VENT_K * (e.ecologyRate || 1) : 0;
      e.ballastGas = Math.max(0, e.ballastGas - e.ballastGas * (porosity * GAS_LEAK_K + lightVent) * dt);
    }

    // Photosynthesis: surface light turns into biomass but creates oxygen stress/waste and weight.
    const photo = orgCount(e, 'photosystem');
    if (photo > 0) {
      // Growth scales with porosity — a porous membrane grows fast (and leaks gas fast); hardening slows both.
      const lightResponse = light * light / (light * light + 0.04 * 0.04);
      // The broad light shelf feeds algae over a larger vertical span. Lower per-photon
      // throughput keeps the integrated growth budget stable without a biomass ratchet.
      const photoScale = e.controller === 'algae' ? 0.08 : 1;
      const gain = lightResponse * photo * ORGANELLES.photosystem.stats.biomassGain * photoScale * clamp(porosity / 0.32, 0.2, 1.0) * dt;
      const room = caps(e).biomass - (e.cargo.biomass || 0);
      const actual = Math.min(room, gain);
      e.cargo.biomass += actual;
      e.biomassMass += actual * 0.18;
      if (e.controller === 'algae') {
        e.biomassMass += lightResponse * photo * 0.09 * photoScale * dt;
        // Veteran blooms grow larger over successive bobs, but structural tissue has a finite
        // turnover ceiling. Cargo remains the reversible weight that drives each individual cycle.
        e.biomassMass = Math.min(e.biomassMass, 70 + photo * 18);
      }
      // Photosynthetic O2 only matters for ALGAE (they generate it, then vent it to the water as
      // their surface-organism mechanic). For every other body — the PLAYER included — photosynthesis
      // just makes biomass; stored O2 is governed by BREATHING (feeding), not a passive photo drain.
      if (e.controller === 'algae') {
        e.oxygen += ORGANELLES.photosystem.stats.oxygenWaste * photo * light * dt;
        const vent = ORGANELLES.photosystem.stats.oxygenVent * photo * light * 1.85 * dt;
        e.oxygen = Math.max(0, e.oxygen - vent);
      }
      // Photolytic Vacuole: split water in the light to bank extra O2 FUEL (for the mito path). Any body.
      const photol = orgCount(e, 'photolytic_vacuole');
      if (photol > 0) e.oxygen = Math.min(caps(e).oxygen, e.oxygen + photol * ORGANELLES.photolytic_vacuole.stats.o2PerLight * light * dt);
    }

    const mito = orgCount(e, 'mitochondrion');
    if (mito > 0 && (e.cargo.lipids || 0) > 0.04 && (e.cargo.energy || 0) < caps(e).energy && e.oxygen > 0.025) {
      // Smooth homeostatic burn (the fermentation curve, but lipids↔ATP instead of biomass↔ATP): burn
      // FAST when lipids are full and ATP is low; TAPER as ATP fills so a full fat reserve isn't dumped
      // into ATP you can't hold (the old flat rate burned at full speed until ATP hit the exact cap);
      // and SLOW when lipids run low, protecting the fat reserve you need for the deep.
      const atpFill = clamp((e.cargo.energy || 0) / Math.max(1, caps(e).energy), 0, 1);
      const lipidFill = clamp((e.cargo.lipids || 0) / Math.max(1, caps(e).lipids), 0, 1);
      const burnDrive = (0.10 + 1.4 * Math.pow(lipidFill, 1.3)) * (1 - atpFill);
      const lipidBurn = Math.min(e.cargo.lipids, ORGANELLES.mitochondrion.stats.lipidBurn * mito * burnDrive * dt);
      const oxygenBurn = Math.min(e.oxygen, ORGANELLES.mitochondrion.stats.oxygenBurn * mito * dt, lipidBurn * 0.12);
      if (oxygenBurn > 0.001) {
        e.cargo.lipids -= lipidBurn;
        e.oxygen -= oxygenBurn;
        e.cargo.energy += lipidBurn * 3.2 + oxygenBurn * 70;
        e.cargo.toxins = Math.max(0, (e.cargo.toxins || 0) - oxygenBurn * 5);
      }
    } else if (((e.cargo.energy || 0) < caps(e).energy
      || (e.controller === 'algae' && e.fallState === 'sinking' && e.y > algaeBallastWorkDepth(e) && (e.ballastGas || 0) < caps(e).ballastGas * 0.98))
      && (e.cargo.biomass || 0) > 0.05) {
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
        const algaeDepth = e.controller === 'algae'
          ? clamp((e.y - WORLD.ruptureTop) / Math.max(1, WORLD.deepTop - WORLD.ruptureTop), 0, 1)
          : 0;
        const deepBoost = 1 + ALGAE_DEEP_FERMENT_K * algaeDepth;
        // Catalytic processors run faster the more enzymes you carry, spending a trickle.
        const baseRate = (st.enzymeBoost ? st.rate * (1 + st.enzymeBoost * enzymeFill) : st.rate) * potency(world, e, procId);
        const rate = baseRate * (e.controller === 'algae' ? (1 + algaeDepth * 0.65) * (e.ecologyRate || 1) : 1);
        const atpRoom = Math.max(0, caps(e).energy - (e.cargo.energy || 0));
        // A descending bloom may keep fermenting solely to inflate ballast after ATP is full. The
        // excess ATP is dissipated as metabolic work; biomass and gas remain fully accounted.
        const ballastWork = e.controller === 'algae' && e.fallState === 'sinking'
          && e.y > algaeBallastWorkDepth(e) && st.gasPerBiomass;
        const gasRoom = ballastWork ? Math.max(0, caps(e).ballastGas - (e.ballastGas || 0)) : 0;
        const gasBioRoom = ballastWork ? gasRoom / Math.max(0.001, st.gasPerBiomass * deepBoost) : 0;
        const metabolicRoom = atpRoom + gasBioRoom * efficiency;
        if (metabolicRoom <= 0) break;
        const desiredATP = Math.min(level * rate * volumeCurve * dt, metabolicRoom);
        const ferment = Math.min(e.cargo.biomass, desiredATP / Math.max(0.1, efficiency));
        if (ferment <= 0) continue;
        e.cargo.biomass -= ferment;
        e.cargo.energy += Math.min(atpRoom, ferment * efficiency);
        // Dirty fermentation: toxin waste per unit burned climbs sharply with how FULL the biomass tank
        // is — a lean cell burns clean (~0.3×), a gorged one is a sludge factory (~2.0×, a ~6× spread).
        // This makes toxins the natural byproduct/currency of the high-biomass anaerobic (venom) build,
        // while a clean_processor (tiny toxinPerBiomass) stays clean at any fill.
        e.cargo.toxins += ferment * st.toxinPerBiomass * (0.3 + 1.7 * Math.pow(biomassFill, 1.4));
        // Ballast gas is the OFFGAS of this biomass→ATP fermentation, nothing more: it is made
        // ONLY when the engine actually runs (i.e. ATP has headroom), so a cell at full ATP vents
        // no gas and holds its biomass. Buoyancy is then about working the offgas + your reserves
        // (vent to dive, ferment to refill), never a standalone organelle that eats biomass. Deep
        // algae vent offgas harder (depth boost), so a sunk bloom refills its ballast and rides
        // back toward the light — the engine of the algal bob, now driven by the same fermentation.
        if (st.gasPerBiomass) {
          const glandBoost = 1 + orgCount(e, 'gas_gland') * ORGANELLES.gas_gland.stats.fermentBonus; // capture more offgas per ferment
          e.ballastGas = Math.min(caps(e).ballastGas, (e.ballastGas || 0) + ferment * st.gasPerBiomass * deepBoost * glandBoost);
        }
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

    // Oxidase Vesicle: burn internal O2 + biomass → ATP (a weak pre-mitochondrial respiration).
    const oxid = orgCount(e, 'oxidase_vesicle');
    if (oxid > 0 && (e.oxygen || 0) > 0.02 && (e.cargo.biomass || 0) > 0.5 && (e.cargo.energy || 0) < caps(e).energy) {
      const st = ORGANELLES.oxidase_vesicle.stats;
      const room = caps(e).energy - (e.cargo.energy || 0);
      const bioUse = Math.min(e.cargo.biomass, st.rate * oxid * potency(world, e, 'oxidase_vesicle') * dt, (e.oxygen || 0) / st.oxygenPerBiomass, room / st.atpPerBiomass);
      if (bioUse > 0) { e.cargo.biomass -= bioUse; e.oxygen = Math.max(0, e.oxygen - bioUse * st.oxygenPerBiomass); e.cargo.energy += bioUse * st.atpPerBiomass; }
    }

    // Anabolic Vesicle: when ATP runs high, spend the SURPLUS above a threshold to build biomass.
    const ana = orgCount(e, 'anabolic_vesicle');
    if (ana > 0) {
      const st = ORGANELLES.anabolic_vesicle.stats;
      const eCap = caps(e).energy, bCap = caps(e).biomass;
      const surplus = (e.cargo.energy || 0) - eCap * st.threshold;
      if (surplus > 0 && (e.cargo.biomass || 0) < bCap) {
        const atpUse = Math.min(surplus, st.rate * ana * potency(world, e, 'anabolic_vesicle') * dt);
        const made = Math.min(bCap - (e.cargo.biomass || 0), atpUse * st.biomassPerATP);
        if (made > 0) { e.cargo.energy -= made / st.biomassPerATP; e.cargo.biomass += made; }
      }
    }

    // Lipolytic Vesicle: one-way lipids → biomass (the reverse of the lipogenic processor).
    const lys = orgCount(e, 'lipolytic_vesicle');
    if (lys > 0 && (e.cargo.lipids || 0) > 0.5 && (e.cargo.biomass || 0) < caps(e).biomass) {
      const st = ORGANELLES.lipolytic_vesicle.stats;
      const lipUse = Math.min(e.cargo.lipids, st.rate * lys * potency(world, e, 'lipolytic_vesicle') * dt);
      const made = Math.min(caps(e).biomass - (e.cargo.biomass || 0), lipUse * st.biomassPerLipid);
      if (made > 0) { e.cargo.lipids -= made / st.biomassPerLipid; e.cargo.biomass += made; }
    }

    // Mineralizing Gland: biomass + toxins → crystals (waste and bulk become exotic ammo).
    const minz = orgCount(e, 'mineralizing_gland');
    if (minz > 0 && (e.cargo.toxins || 0) > 0.5 && (e.cargo.biomass || 0) > 1 && (e.cargo.crystals || 0) < (caps(e).crystals || 0)) {
      const st = ORGANELLES.mineralizing_gland.stats;
      const made = Math.min((caps(e).crystals || 0) - (e.cargo.crystals || 0), st.rate * minz * potency(world, e, 'mineralizing_gland') * dt, (e.cargo.toxins || 0) / st.toxinPerCrystal, (e.cargo.biomass || 0) / st.biomassPerCrystal);
      if (made > 0) { e.cargo.crystals += made; e.cargo.toxins -= made * st.toxinPerCrystal; e.cargo.biomass -= made * st.biomassPerCrystal; }
    }

    // Chemosynthetic Vesicle: oxidize stored toxins (+ a little biomass) into ATP — clean deep
    // energy that scrubs the poison as it works. No light or O2 needed.
    const chemo = orgCount(e, 'chemosynthetic_vesicle');
    if (chemo > 0 && (e.cargo.toxins || 0) > 0.3 && (e.cargo.energy || 0) < caps(e).energy) {
      const st = ORGANELLES.chemosynthetic_vesicle.stats;
      const room = caps(e).energy - (e.cargo.energy || 0);
      const toxUse = Math.min(e.cargo.toxins, st.rate * chemo * potency(world, e, 'chemosynthetic_vesicle') * dt, room / st.atpPerToxin);
      const bioUse = Math.min(e.cargo.biomass || 0, toxUse * st.biomassPerToxin);
      const atp = toxUse * st.atpPerToxin + bioUse * st.atpPerBiomass;
      if (atp > 0) { e.cargo.toxins -= toxUse; e.cargo.biomass = Math.max(0, (e.cargo.biomass || 0) - bioUse); e.cargo.energy = Math.min(caps(e).energy, (e.cargo.energy || 0) + atp); }
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

    // Vampire burn: a dark-adapted deep body cooks in the light of the shallows.
    if (e.photophobic && e.grace <= 0) {
      const l = lightAt(e.y);
      // A smooth, very steep exposure curve: the dim tail is survivable, the transition hurts,
      // and a real shallow incinerates a dark lineage. No light/no-light cliff is involved.
      const exposure = Math.pow(1 / (1 + Math.exp(-(l - LIGHT_BURN.threshold) * LIGHT_BURN.slope)), 2);
      e.hp -= exposure * LIGHT_BURN.rate * dt;
      e.hit = Math.max(e.hit, exposure * 0.12);
    }

    // Vertical for NON-algae bodies. A BALLAST-equipped cell (the player) is a submarine: its
    // buoyancy is the GAS it manages (plus a whisker of base), NOT the bladder's structural baseLift —
    // so an EMPTY bladder is heavy and SINKS (you fight it by pumping gas or swimming), a filled
    // bladder LIFTS, and a fat cell sinks harder (more biomass weight). This is a strong background
    // force you feel, not the old imperceptible drift. Non-ballast NPCs keep their gentle settling.
    if (e.controller !== 'algae') {
      const bladders = orgCount(e, 'oxygen_vacuole');
      const flagLift = orgCount(e, 'flagella') * ORGANELLES.flagella.stats.lift * 0.18;
      if (bladders > 0) {
        const gasLift = (e.ballastGas || 0) * ORGANELLES.oxygen_vacuole.stats.liftPerGas;
        const sink = biomassWeight(e) - (1.0 + gasLift + flagLift);
        e.vy += clamp(sink * BALLAST_DRIFT_K, -62, 74) * dt;
      } else {
        const sink = biomassWeight(e) - buoyancy(e) - flagLift;
        e.vy += clamp(sink * 0.026, -8, 22) * dt;
      }
    }

    if (e.incubating) updateEucharistIncubation(world, e, dt);

    const massBurden = 1 + (e.cargo.biomass || 0) / Math.max(8, caps(e).biomass) * 0.55 + Object.values(e.organelles || {}).reduce((a,b)=>a+b,0) * 0.012;
    const upkeep = (e.controller === 'algae' ? 0.048 : 0.046) * massBurden * dt;
    e.cargo.energy = Math.max(0, (e.cargo.energy || 0) - upkeep);
    // Starvation: out of ATP with too little biomass to recover, the body autolyses —
    // faster the emptier it is. No more sitting dead-in-the-water waiting on nothing;
    // you feed, you flee, or you dissolve (and the froth already smells you — see starving aggro).
    if ((e.cargo.energy || 0) <= 0.02 && (e.cargo.biomass || 0) < 4) {
      const failedHunter = HUNTER_GUILD.has(e.controller) ? 3.0 : 1.0;
      e.hp -= (5 + 8 * (1 - (e.cargo.biomass || 0) / 4)) * failedHunter * dt;
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
    f._matter = total; // cache for this frame's AI field scans (bestFieldFor)
    // Drift by composition: biomass slurry sinks (faster the more biomass it carries),
    // lipids float, and the net eases into f.vy so patches slide rather than snap.
    if (total > 0) {
      const bio = f.stock.biomass || 0, lip = f.stock.lipids || 0;
      const sink = FIELD_SINK_K * (bio / total) * Math.sqrt(bio);
      const rise = FIELD_RISE_K * (lip / total) * Math.sqrt(lip);
      const targetVy = clamp(sink - rise, -FIELD_TERMINAL_VY, FIELD_TERMINAL_VY);
      f.vy = (f.vy || 0) + (targetVy - (f.vy || 0)) * Math.min(1, 2 * dt);
      f.y = clamp(f.y + f.vy * dt, WORLD.canopy, WORLD.h - 40);
      // Volatile ATP/toxins diffuse: the patch spreads outward (density thins) as those
      // fractions bleed off — a permanent spread that outlives the mass into a fading cloud.
      const diffuseFrac = ((f.stock.energy || 0) + (f.stock.toxins || 0)) / total;
      f.spread = (f.spread || 0) + FIELD_DIFFUSE_K * diffuseFrac * dt;
    }
    const massR = Math.sqrt(Math.max(8, total)) * (f.radiusScale || 8.0);
    f.radius = clamp(massR + (f.spread || 0), 9, f.maxRadius || 180);
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
      for (const e of world.entities) { if (!e.alive || (h.team !== undefined && allegiance(e) === h.team)) continue; const d = distWrap(h.x, h.y, e.x, e.y); if (d < bestD) { bestD = d; best = e; } }
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
      if (h.team !== undefined && allegiance(e) === h.team) continue; // shots never hit the shooter's own group
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
      const flame = h.kind === 'flame';
      // Flame hits EVERYTHING inside its strike zone for FULL damage — no overlap falloff, so a body
      // caught anywhere in the cone burns at full rate (the tricky-to-aim flamethrower earns its keep).
      const overlap = flame ? 1.0 : clamp((h.radius + e.r - d) / Math.max(8, h.radius), 0, 1.4);
      hurt(world, e, h.damage * overlap * dt * (isProjectile ? 18 : flame ? FLAME_TICK : 1), h.sourceId || h.id);
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
        spawnToxicHazard(world, h.x, h.y, { kind: 'toxic_splash', sourceId: h.sourceId, team: h.team, radius: st.splashRadius, damage: st.splashDamage, maxAge: st.splashAge });
      } else if (h.kind === 'spore_projectile') {
        // A heavier burst plus a slow spore-toxin cloud that keeps damaging the area.
        const st = ORGANELLES.spore_toxin_launcher.stats;
        spawnToxicHazard(world, h.x, h.y, { kind: 'toxic_splash', sourceId: h.sourceId, team: h.team, radius: st.splashRadius, damage: st.splashDamage, maxAge: st.splashAge, color: DNA_CATEGORY_COLORS.launcher });
        spawnToxicHazard(world, h.x, h.y, { kind: 'spore_cloud', sourceId: h.sourceId, team: h.team, radius: st.splashRadius * 0.8, damage: 20, maxAge: 2.4, color: DNA_CATEGORY_COLORS.launcher });
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

function deliberateWeaponTarget(attacker, target) {
  if (attacker.kind === 'player') return true;
  const directedHunter = HUNTER_GUILD.has(attacker.controller) || attacker.controller === 'companion';
  if (!directedHunter) return true; // defensive/mutant spines on non-hunters remain contact organs
  return attacker._targetRef === target
    || ((attacker.combatHit || 0) > 0 && attacker.targetId === target.id); // immediate self-defense
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
    e._lanceCands = hasL ? [] : null; // candidate hostiles in reach; we strike the LARGEST we can actually hit
    e._raspStack = 0; // reset the per-frame overlap-output counter (diminishing returns, see contactDamage)
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
      // Lances don't spray every overlap — they gather the hostiles in reach and, after the
      // scan, strike only ONE: the LARGEST one they can actually skewer (in real reach + aligned).
      const hostile = !areAllied(a, b);
      if (a._hasLance && hostile && deliberateWeaponTarget(a, b) && d < a._lanceReach + b.r) a._lanceCands.push({ t: b, d, nx, ny });
      if (b._hasLance && hostile && deliberateWeaponTarget(b, a) && d < b._lanceReach + a.r) b._lanceCands.push({ t: a, d, nx: -nx, ny: -ny });
    }
  }
  for (const a of ents) {
    if (!a._lanceCands || !a._lanceCands.length) continue;
    a._lanceCands.sort((u, v) => v.t.r - u.t.r); // largest first
    // Strike the largest candidate that actually connects; if it's unaligned or out of true
    // reach (lanceDamage returns 0), fall through to the next-largest so lances never whiff.
    for (const c of a._lanceCands) {
      if (lanceDamage(world, a, c.t, c.d, c.nx, c.ny, dt) > 0) break;
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
  if (!attacker.alive || !target.alive) return 0;
  if (areAllied(attacker, target)) return 0; // no friendly fire within a group (player+allies, or a swarm)
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
  return total + leech; // >0 means the lance actually connected with this target this frame
}

function contactDamage(world, attacker, target, overlap, nx, ny, dt) {
  if (!attacker.alive || !target.alive) return;
  if (areAllied(attacker, target)) return; // no friendly fire within a group
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
  // Diminishing returns across simultaneous victims: the first body you rasp/leech this frame
  // pays full, each additional one pays 1/(1+K*(k-1)). Stops a swimmer from draining a whole
  // cluster of scavengers at full rate while leaving genuine 1-on-1 combat exactly as before.
  const k = ++attacker._raspStack;
  const stackFalloff = 1 / (1 + OVERLAP_STACK_K * (k - 1));
  dps *= stackFalloff;
  leech *= stackFalloff;
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

// Allegiance groups decide who never harms whom. The player + its companions, charmed enemies,
// and buds share group 'P'. A wild swarm/brood shares its director's group (via ownerId). EVERY
// other wild body is its own group — so wild bodies genuinely fight EACH OTHER, and to an NPC's
// weapon the player is just one more wild body, treated EXACTLY like a scavenger and never the
// sole enemy of the entire deep. (The old model made the player a lone faction vs. the whole
// world, so every side-gated weapon — seekers, harpoons, blasts, auras — could only target it.)
// friendlySide stays as the player-team identity used by rendering tint and a few UI reads.
function friendlySide(e) { return e.kind === 'player' || !!e.friendly; }
function allegiance(e) { return (e.kind === 'player' || e.friendly) ? 'P' : (e.ownerId ? ('g' + e.ownerId) : ('e' + e.id)); }
function areAllied(a, b) { return allegiance(a) === allegiance(b); }
function areHostile(a, b) { return a.id !== b.id && !areAllied(a, b); }

// Overlap-triggered strain effects, evaluated per overlapping pair (a acting on b).
function overlapAura(world, a, b, dt) {
  if (!a.alive || !b.alive || !areHostile(a, b)) return;
  // Gas Injector: pump buoyant gas into an overlapped hostile, shoving it upward toward the
  // lit shallows (where photophobic deep hunters burn). A fresh event only when it's the player.
  if (hasOrg(a, 'gas_injector')) {
    b.vy -= ORGANELLES.gas_injector.stats.shove * orgCount(a, 'gas_injector') * dt;
  }
  // Corrosive Pellicle: passive acid, fed by stored toxins — a full toxin tank burns far harder.
  if (hasOrg(a, 'corrosive_pellicle')) {
    const cst = ORGANELLES.corrosive_pellicle.stats;
    const toxScale = 1 + clamp((a.cargo.toxins || 0) / Math.max(1, caps(a).toxins || 1), 0, 1) * cst.toxinBoost;
    const dmg = cst.dps * orgCount(a, 'corrosive_pellicle') * potency(world, a, 'corrosive_pellicle') * toxScale * dt;
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
  h.homing = st.turn; h.speed = st.speed;
  world.events.push({ type: 'seeker_launch', entityId: e.id });
}

function chemotaxisPull(world, e, dt) {
  // No longer a free always-on vacuum. It YANKS on the rising edge of feeding — one strong
  // one-shot pull that spends a spore, on a cooldown so tap-spamming can't chain it. Costed,
  // feed-gated, and far weaker overall than the old constant drag.
  const st = ORGANELLES.chemotaxis_cilia.stats;
  const feeding = !!e.feedIntent;
  const started = feeding && !e._chemoWasFeeding;
  e._chemoWasFeeding = feeding;
  if (!started) return;
  e.cooldowns ||= {};
  if ((e.cooldowns.chemo || 0) > 0 || (e.cargo.spores || 0) < st.cost) return;
  e.cargo.spores -= st.cost;
  e.cooldowns.chemo = st.cooldown;
  const yank = st.yank * orgCount(e, 'chemotaxis_cilia') * potency(world, e, 'chemotaxis_cilia');
  for (const f of world.fields) {
    const d = distWrap(e.x, e.y, f.x, f.y); if (d < 6 || d > st.radius) continue;
    const dir = norm(dxWrap(f.x, e.x), e.y - f.y);
    const step = Math.min(yank, d - 4);
    f.x = wrapX(f.x + dir.x * step); f.y += dir.y * step;
  }
  for (const q of world.particles) {
    const d = distWrap(e.x, e.y, q.x, q.y); if (d < 6 || d > st.radius) continue;
    const dir = norm(dxWrap(q.x, e.x), e.y - q.y);
    q.vx += dir.x * yank * 3; q.vy += dir.y * yank * 3;
  }
  if (e.kind === 'player') world.events.push({ type: 'chemo_yank', entityId: e.id });
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
  h.pull = o.pull;
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
  h.markDur = o.markDur * potency(world, entity, 'pheromone_gland');
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
    if (b.r >= e.r) continue; // engulf only bodies SMALLER than you (size = membrane layers + bulk)
    const score = b.r - distWrap(e.x, e.y, b.x, b.y) * 0.02;
    if (score > bestScore) { bestScore = score; best = b; }
  }
  if (!best) return false;
  e.cargo.enzymes -= o.enzyme; e.cargo.energy -= o.energyCost; e.cooldowns.engulf = o.cooldown;
  const bestStrain = best.strain, bestPot = best.strainPotency, bestHp = best.hp;
  const gain = o.biomassBase + best.r * o.biomassPerR;
  e.cargo.biomass = Math.min(caps(e).biomass, (e.cargo.biomass || 0) + gain);
  // Guaranteed genome capture: a mutant's DNA is secured straight into your samples.
  if (bestStrain && ORGANELLES[bestStrain] && e.carriedStrains) {
    const rolled = bestPot || 1;
    const prev = Math.max(e.carriedStrains.get(bestStrain) || 0, (world.discoveredSources && world.discoveredSources.get(bestStrain)) || 0);
    if (rolled > prev + 1e-6) {
      e.carriedStrains.set(bestStrain, rolled);
      e.cargo.dna = Math.min(caps(e).dna, (e.cargo.dna || 0) + 1);
      world.events.push({ type: 'sample', source: bestStrain, name: ORGANELLES[bestStrain].name, potency: rolled, upgrade: !!(world.discoveredSources && world.discoveredSources.has(bestStrain)), entityId: e.id });
    }
  }
  // INSTAKILL — swallow the smaller body whole (that was the fun). Recoil: half its
  // remaining HP flows back onto you (one-time, clamped non-lethal), so it isn't free.
  const recoil = Math.min(Math.max(0, e.hp - 1), bestHp * o.selfDamageFrac);
  hurt(world, best, caps(best).hp + 999, e.id);
  if (recoil > 0) { e.hp -= recoil; e.hit = Math.max(e.hit || 0, 0.08); world.events.push({ type: 'engulf_recoil', entityId: e.id, dmg: recoil }); }
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
  // A hazard carries the ALLEGIANCE of whoever fired it: it never harms that shooter's own group
  // (self, its swarm, or the player's allies) and harms everyone else. Derived from the source so
  // every weapon is consistent; a burst can pass team explicitly to inherit a dead parent's side.
  const src = opts.sourceId ? world.entities.find(e => e.id === opts.sourceId) : null;
  const h = {
    id: id('hazard'), kind: opts.kind || 'toxic_splash', sourceId: opts.sourceId || null,
    x: wrapX(x), y: clamp(y, WORLD.canopy, WORLD.h), vx: opts.vx || 0, vy: opts.vy || 0,
    radius: opts.radius || 42, damage: opts.damage || 35, age: 0, maxAge: opts.maxAge || 1.2,
    color: opts.color || COLORS.toxins, hitOnce: !!opts.hitOnce, hitIds: new Set(),
    team: opts.team !== undefined ? opts.team : (src ? allegiance(src) : undefined)
  };
  world.hazards.push(h);
  return h;
}

// How hot can this body burn right now? Banked O2 (oxidizer) and lipids (fuel) each add
// to a combustion multiplier; a dry, airless body sits at the 1.0 floor (base output).
function combustionMult(entity) {
  const c = caps(entity);
  const oxyFill = clamp((entity.oxygen || 0) / Math.max(1, c.oxygen), 0, 1);
  const lipidFill = clamp((entity.cargo.lipids || 0) / Math.max(1, c.lipids), 0, 1);
  return {
    mult: 1 + COMBUSTION.o2Gain * oxyFill + COMBUSTION.lipidGain * lipidFill,
    rmult: 1 + COMBUSTION.radiusGain * (oxyFill + lipidFill) * 0.5,
    oxyFill, lipidFill
  };
}

// Volatile Vacuole detonation — now a combustion event. The blast's damage AND radius scale
// with the body's O2 + lipid charge, and firing it burns that fuel (so repeated layer-loss
// detonations fade until you refuel). Side-aware so it takes attackers, never your own side.
function detonateVolatile(world, entity) {
  const st = ORGANELLES.volatile_vacuole.stats;
  const cm = combustionMult(entity);
  const power = st.damage * cm.mult * potency(world, entity, 'volatile_vacuole');
  const h = spawnToxicHazard(world, entity.x, entity.y, {
    kind: 'blast', sourceId: entity.id, radius: st.radius * cm.rmult,
    damage: power, maxAge: st.age, color: DNA_CATEGORY_COLORS.execute, hitOnce: true
  });
  entity.oxygen = (entity.oxygen || 0) * (1 - COMBUSTION.blastO2Burn);
  entity.cargo.lipids = (entity.cargo.lipids || 0) * (1 - COMBUSTION.blastLipidBurn);
  if (entity.kind === 'player') world.events.push({ type: 'detonate', entityId: entity.id });
}

// Flamethrower: ignites lipids with banked O2 and toxin accelerant into a forward cone of
// burning slurry. A sustained, fuel-hungry stream — held, not tapped — that runs hotter the
// more O2 you carry. Each puff is a short-lived travelling fire hazard; the cone is the
// overlap of many puffs. More glands widen and thicken the stream.
function flamePulse(world, entity, aimX = null, aimY = null) {
  if (!hasOrg(entity, 'combustion_vesicle')) return false;
  const o = ORGANELLES.combustion_vesicle.stats;
  entity.cooldowns ||= {};
  if ((entity.cooldowns.flame || 0) > 0) return false;
  if ((entity.oxygen || 0) < o.o2Cost || (entity.cargo.lipids || 0) < o.lipidCost
    || (entity.cargo.toxins || 0) < o.toxinCost || !hasEnergy(entity, o.energyCost)) return false;
  entity.oxygen -= o.o2Cost;
  entity.cargo.lipids -= o.lipidCost;
  entity.cargo.toxins -= o.toxinCost;
  entity.cargo.energy -= o.energyCost;
  entity.cooldowns.flame = o.cooldown;
  let ax = aimX ?? Math.cos(entity.phase), ay = aimY ?? Math.sin(entity.phase);
  const n = norm(ax, ay); ax = n.x; ay = n.y;
  entity.phase = Math.atan2(ay, ax);
  const cm = combustionMult(entity);
  const count = orgCount(entity, 'combustion_vesicle');
  const puffs = 1 + Math.min(2, count - 1); // 1 gland → 1 puff; wider/denser with more
  const speed = o.reach / o.puffLife;
  for (let k = 0; k < puffs; k++) {
    const spread = (world.rng() - 0.5) * o.coneSpread;
    const ca = Math.cos(spread), sa = Math.sin(spread);
    const dx = ax * ca - ay * sa, dy = ax * sa + ay * ca;
    const h = spawnToxicHazard(world, entity.x + dx * (entity.r + 8), entity.y + dy * (entity.r + 8), {
      kind: 'flame', sourceId: entity.id, radius: o.puffRadius,
      damage: o.damage * count * cm.mult * potency(world, entity, 'combustion_vesicle'),
      vx: dx * speed + entity.vx * 0.3, vy: dy * speed + entity.vy * 0.3,
      maxAge: o.puffLife, color: DNA_CATEGORY_COLORS.execute
    });
  }
  world.events.push({ type: 'flame', entityId: entity.id });
  return true;
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
    // Remember who struck me (a real attacker, not self/hazard-less): the scavenger brain reads
    // this to bolt away from its attacker. `hit` (0.18 combat vs 0.05 environmental) times the flee.
    if (sourceId && sourceId !== entity.id) entity.targetId = sourceId;
    // Struck by another cell (or its weapon/hazard) → recent combat damage. Hunter policy uses this
    // to disengage from losing exchanges; the renderer also uses it for the player's red hit flash.
    // Environmental stress has no entity source and therefore never trips combat retreat.
    if (sourceId && sourceId !== entity.id && world.entities.some(x => x.id === sourceId)) entity.combatHit = 0.32;
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
    // Layered membrane: the outer layer is armor. Losing a whole layer's worth of HP sheds
    // that layer — spilling mostly lipids — but the underhost survives. Only bites in when
    // you've grown more than one layer; a bare cell just loses HP as before.
    if (entity.hp > 0 && (entity.organelles.membrane || 0) > 1) {
      const layerHp = ORGANELLES.membrane.stats.hp;
      const shouldRemain = Math.max(1, Math.ceil(entity.hp / layerHp));
      if (shouldRemain < entity.organelles.membrane) {
        const peeled = entity.organelles.membrane - shouldRemain;
        entity.organelles.membrane = shouldRemain;
        entity._capsEpoch = -1;
        entity.r = Math.max(entity.baseR || entity.r * 0.6, entity.r - peeled * 5);
        shedMembraneLayers(world, entity, peeled);
        world.events.push({ type: 'membrane_shed', entityId: entity.id, layers: peeled });
        // Volatile Vacuole: cracking a whole plate off you ruptures the bladder here and now —
        // not only on death — a combustion blast whose size tracks your O2/lipid charge, and
        // which burns that fuel (so a shredded body's later plate-pops fade unless it refuels).
        if (hasOrg(entity, 'volatile_vacuole')) detonateVolatile(world, entity);
      }
    }
  }
  if (entity.hp <= 0 && entity.alive) {
    entity.alive = false;
    world.stats.deaths += 1;
    world.events.push({ type: 'death', entityId: entity.id, sourceId });
    // Volatile Vacuole: the dying body detonates, regardless of what killed it. Die with full
    // O2/lipid tanks and the combustion blast is enormous; die dry and it barely pops.
    if (hasOrg(entity, 'volatile_vacuole')) detonateVolatile(world, entity);
    // On-kill riders belonging to the KILLER: necrotic bloom + fission budding.
    const killer = sourceId && sourceId !== entity.id ? world.entities.find(x => x.id === sourceId && x.alive) : null;
    if (killer) {
      // ATP HARVEST — a predator (or the player/companion) rips the victim's stored charge into its
      // own reservoir before the body cools. Runs BEFORE bloomDeath spawns the corpse field, so the
      // field is left biomass+lipids only: the scavengers eat the meat, the hunters keep the charge.
      if (ATP_HARVESTERS.has(killer.controller) || killer.kind === 'player') {
        const room = caps(killer).energy - (killer.cargo.energy || 0);
        const playerYield = killer.kind === 'player' || killer.friendly;
        const drainFrac = playerYield ? ATP_HARVEST.playerDrainFrac : ATP_HARVEST.npcDrainFrac;
        const perRadius = playerYield ? ATP_HARVEST.playerPerRadius : ATP_HARVEST.npcPerRadius;
        if (room > 0) {
          killer.cargo.energy += Math.min(room, (entity.cargo.energy || 0) * drainFrac + entity.r * perRadius);
        }
        entity.cargo.energy = 0; // charge stripped — the corpse field carries no ATP
      }
      if (HUNTER_GUILD.has(killer.controller) && !killer.friendly) {
        const feast = clamp(entity.r / 72 + (entity.cargo.biomass || 0) / 150, 0.10, 1);
        killer.reproHeat = clamp((killer.reproHeat || 0) + 0.10 + 0.28 * feast, 0, 1);
      }
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
  const bud = spawnScavenger(world, { x: x + rand(world, -12, 12), y: y + rand(world, -12, 12), noStrain: true });
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
        cargo: { biomass: 5, lipids: 4, energy: 18, toxins: 3, spores: 0, enzymes: 0, crystals: 0, dna: 0 }, organelles: { membrane: 1, basal_motility: 1, membrane_intake: 1, anaerobic_processor: 1, exotic_vacuole: 1, rasping_lamella: 1 }, oxygen: oxygenAt(YUKI_SPAWN.y), grace: 2.5
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

// A shed membrane layer spills mostly lipids (and a little biomass) into the water where
// it tore — the underhost swims on. Shared by combat, engulf, and algae-peeling.
function shedMembraneLayers(world, e, count) {
  const stock = emptyCargo();
  stock.lipids = 3.5 * count + (e.cargo.lipids || 0) * 0.06 * count;
  stock.biomass = 2 * count;
  spawnResourceField(world, e.x, e.y, stock, { radius: clamp(e.r * 0.9, 18, 90), density: 1.1, sourceKind: 'shed_membrane', maxAge: 20, maxRadius: 120 });
}

// Jettison Vesicle (key T): punch out a slug of biomass — shed real weight (cargo AND
// structural biomassMass), lurch upward, and spill a feed-field where you were. The weight
// drop lets buoyancy win, so it's a deliberate ascent and a swarm-escape.
function ventBiomass(world, e) {
  const st = ORGANELLES.jettison_vesicle.stats;
  e.cooldowns ||= {};
  if ((e.cooldowns.jettison || 0) > 0) return false;
  const amount = Math.max(st.ejectMin, (e.cargo.biomass || 0) * st.ejectFraction);
  if ((e.cargo.biomass || 0) < amount || (e.cargo.energy || 0) < st.energyCost) return false;
  e.cargo.biomass -= amount;
  e.biomassMass = Math.max(0, (e.biomassMass || 0) - amount * st.structuralShed); // real, permanent weight drop
  e.cargo.energy -= st.energyCost;
  e.vy -= st.thrust; // upward lurch
  const stock = emptyCargo(); stock.biomass = amount * 0.9;
  spawnResourceField(world, e.x, e.y, stock, { radius: clamp(e.r * 0.8, 16, 80), density: 1.2, sourceKind: 'jettison', maxAge: 22, maxRadius: 110 });
  e.cooldowns.jettison = st.cooldown;
  world.events.push({ type: 'jettison', entityId: e.id });
  return true;
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
    // Scavengers are the reliable enzyme farm — the common shallow kill that keeps catalyst flowing.
    if (e.controller === 'scavenger' && world.rng() < 0.6) spawnParticle(world, 'enzymes', e.x, e.y, 1);
    const player = getPlayer(world);
    const isMutant = !!(e.strain && ORGANELLES[e.strain]);
    const dnaSpecies = e.controller === 'protozoan' || e.controller === 'predator' || e.controller === 'algae' || e.controller === 'metazoan' || e.controller === 'brood' || e.controller === 'scavenger';
    // A mutant ALWAYS sheds its signature gene when cracked open — hunting a tinted
    // strain is a guaranteed harvest, no drop-roll. Wild (unmutated) kills still roll
    // for plain currency DNA. This removes an entire RNG layer from the discovery loop.
    if (player && dnaSpecies && (isMutant || world.rng() < (hasMito(player) ? 0.95 : 0.46))) {
      const dp = spawnParticle(world, 'dna', e.x, e.y, e.controller === 'metazoan' ? 3 : (e.controller === 'protozoan' || e.controller === 'brood') ? 2 : 1);
      // The tagged DNA carries that organelle's id (the discovery key) and is colored
      // by its category. Wild kills drop plain white DNA — currency, but no unlock.
      if (isMutant) {
        dp.source = e.strain;
        dp.potency = e.strainPotency || 1;
        dp.color = DNA_CATEGORY_COLORS[ORGANELLES[e.strain].category] || COLORS.dna;
      }
    }
  }
}

// Population is EMERGENT, not quota'd. Births are EARNED by binary fission (doFission): a gorged,
// healthy cell cleaves into two, spending its whole ATP charge and most of its reserves — so a
// population grows only while its food lasts and crashes when the food (or the prey) runs out. A
// real petri dish that breathes. POP_CAP is only a performance ceiling (rarely touched). POP_FLOOR
// is a TINY immigration safety net: if a species crashes toward zero a lone cell occasionally
// drifts in, so a wiped layer can recover instead of dying forever — "keep the quota, but small."
const POP_CAP = 150;                // performance ceiling only — normal life sits well below it
const ALGAE_CAP = 72;               // the canopy fungus mints algae up to here (the food base)
const SCAV_TARGET = 26;             // mature seed reference; the running migration target is resource-driven
const POP_FLOOR = Object.freeze({ predator: 3, protozoan: 2, metazoan: 1, brood: 1 }); // fission-guild safety net

function scavengerTarget(world) {
  let detritus = 0, hunterPressure = 0;
  for (const f of world.fields) detritus += (f.stock.biomass || 0) + (f.stock.lipids || 0) + (f.stock.energy || 0);
  for (const e of world.entities) if (e.alive && HUNTER_GUILD.has(e.controller)) hunterPressure++;
  // Open-boundary carrying signal: corpse pulses draw scavengers in; barren or predator-heavy water
  // lets them flow back out. The response is deliberately broad and capped for performance.
  return Math.round(clamp(8 + detritus / 220 - hunterPressure * 0.14, 8, 42));
}

// A hunter is ready to divide when it is GORGED (the user's spec): ATP brimming AND biomass and
// lipids near full. Only the fission guild (predator/protozoan/metazoan + player) carries the
// cleavage_furrow, and they fill their reserves from KILLS (the on-kill bite grants biomass+lipids)
// — so reproduction is fuelled by successful predation, and fission spends it all. Food paces it.
function fissionReady(entity) {
  if (!hasOrg(entity, 'cleavage_furrow')) return false;
  if ((entity.fissionCooldown || 0) > 0) return false;
  const cap = caps(entity), st = ORGANELLES.cleavage_furrow.stats;
  // Must be healthy and carry a little matter to build the daughter from...
  if (entity.hp < cap.hp * 0.6) return false;
  if ((entity.cargo.biomass || 0) < cap.biomass * st.biomassFrac) return false;
  const atpReady = (entity.cargo.energy || 0) >= cap.energy * st.atpFrac;
  const lipidReady = (entity.cargo.lipids || 0) >= cap.lipids * st.lipidFrac;
  return atpReady || lipidReady;
}

// Wild reproduction is a continuous stochastic hazard rather than a reserve tripwire. Every fill
// fraction contributes smoothly; ATP is steepest so a fat but empty hunter is dormant, while a
// repeatedly successful hunter becomes increasingly likely to divide. This is intentionally separate
// from fissionReady(), which is the player's explicit, legible command affordance.
function wildFissionRate(entity) {
  if (!hasOrg(entity, 'cleavage_furrow') || (entity.fissionCooldown || 0) > 0) return 0;
  const cap = caps(entity);
  const hp = clamp(entity.hp / Math.max(1, cap.hp), 0, 1);
  const biomass = clamp((entity.cargo.biomass || 0) / Math.max(1, cap.biomass), 0, 1);
  const energy = clamp((entity.cargo.energy || 0) / Math.max(1, cap.energy), 0, 1);
  const lipids = clamp((entity.cargo.lipids || 0) / Math.max(1, cap.lipids), 0, 1);
  const heat = clamp(entity.reproHeat || 0, 0, 1);
  const pulse = 0.15 + 5.5 * heat * heat;
  return 0.35 * pulse * Math.pow(hp, 2.3) * Math.pow(biomass, 1.5) * Math.pow(energy, 3.2) * Math.pow(lipids, 1.8);
}

// Binary fission: cleave one gorged cell into two. Drains ALL ATP (mitosis is expensive) and
// leaves BOTH the parent and the new daughter at childReserve (15%) biomass/lipids — the rest is
// spent building the second body. Both daughters roll genetic drift (mutateOnFission).
function doFission(world, e) {
  const cap = caps(e), res = ORGANELLES.cleavage_furrow.stats.childReserve;
  const fissionFuel = {
    energy: (e.cargo.energy || 0) / Math.max(1, cap.energy),
    biomass: (e.cargo.biomass || 0) / Math.max(1, cap.biomass),
    lipids: (e.cargo.lipids || 0) / Math.max(1, cap.lipids)
  };
  const daughter = makeSoftBody(world, e.kind, wrapX(e.x + rand(world, -e.r - 6, e.r + 6)), e.y + rand(world, -8, 8), {
    r: e.r, baseR: e.baseR, biomassMass: e.biomassMass, mass: e.mass,
    controller: e.controller, color: e.color, depthHome: e.depthHome, trophicRole: e.trophicRole,
    organelles: { ...e.organelles }, strain: e.strain, strainPotency: e.strainPotency,
    bodyPlan: e.bodyPlan, photophobic: e.photophobic, friendly: e.friendly, ownerId: e.ownerId,
    ruptureThreshold: e.ruptureThreshold, ballastGas: (e.ballastGas || 0) * 0.5, reproHeat: (e.reproHeat || 0) * 0.35,
    cargo: { biomass: cap.biomass * res, lipids: cap.lipids * res, energy: 0 }, grace: 1.6
  });
  e.cargo.biomass = cap.biomass * res;
  e.cargo.lipids = cap.lipids * res;
  e.cargo.energy = 0;
  e.reproHeat = (e.reproHeat || 0) * 0.25;
  // Wild fission is a real reproductive cycle, not an attack cooldown. A longer refractory
  // window lets a successful lineage bloom in visible generations while preventing a rich algae
  // patch from becoming a frame-by-frame doubling cascade. Player/friendly division keeps its
  // responsive original cadence; their supply and command path already pace reproduction.
  const wildHunter = e.kind !== 'player' && !e.friendly;
  const refractory = wildHunter ? rand(world, 48, 72) : rand(world, 14, 22);
  e.fissionCooldown = refractory;
  daughter.fissionCooldown = refractory + rand(world, 0, 5);
  mutateOnFission(world, daughter);
  mutateOnFission(world, e);
  e._capsEpoch = -1; e.hp = Math.min(e.hp, caps(e).hp);
  daughter._capsEpoch = -1; daughter.hp = caps(daughter).hp;
  if (FREE_HUNTERS.has(daughter.controller)) initBrain(world, daughter, clamp((daughter.y - WORLD.ruptureTop) / 1700, 0, 1));
  else if (daughter.controller === 'scavenger') daughter.brainState = 'forage';
  world.entities.push(daughter);
  world.stats.fissions += 1;
  world.events.push({ type: 'fission', entityId: e.id, childId: daughter.id, controller: e.controller, fuel: fissionFuel });
  return daughter;
}

// The player divides on command: a full copy of you, but re-flagged as a FRIENDLY clone (a leashed
// companion that fights at your side) rather than a rival. Same heavy cost — you drop to 15%
// reserves and 0 ATP. The clone's DNA may have drifted (mutateOnFission), so you can breed variants.
function playerFission(world, player) {
  const child = doFission(world, player);
  child.kind = 'npc';
  child.controller = 'companion';
  child.friendly = true;
  child.ownerId = player.id;
  child._capsEpoch = -1;
  world.events.push({ type: 'player_fission', entityId: player.id, childId: child.id });
  return child;
}

// DNA genes drift when a cell divides — the petri dish's engine of variation. A strained lineage
// nudges its potency and can pick up a fresh signature gene; ANY cell (player clones included) can
// gain or lose a copy of a DNA-category organelle. So a splitting population evolves, never xeroxes.
function mutateOnFission(world, e) {
  if (e.strain && ORGANELLES[e.strain] && world.rng() < 0.6) {
    e.strainPotency = clamp(gaussian(world.rng, e.strainPotency || 1, 0.16), 0.5, 1.9);
  }
  if (world.rng() < 0.15) applyStrain(world, e); // may graft/switch a signature gene
  if (world.rng() < 0.25) {                       // copy-number drift on a DNA-category organelle
    const dna = Object.keys(e.organelles).filter(o => ORGANELLES[o] && ORGANELLES[o].category && e.organelles[o] > 0);
    if (dna.length) {
      const pick = dna[Math.floor(world.rng() * dna.length)];
      e.organelles[pick] += world.rng() < 0.5 ? 1 : -1;
      if (e.organelles[pick] <= 0) delete e.organelles[pick];
      e._capsEpoch = -1;
    }
  }
}

// The per-frame population engine: hunters self-replicate when gorged; scavengers emigrate when
// starved. (Algae are minted top-down in spawnTick; the player divides on command.) Iterate a
// captured length so daughters pushed this tick aren't themselves processed until next frame.
function populationTick(world, dt) {
  const n = world.entities.length;
  let emigrants = null;
  let scavN = 0;
  for (const e of world.entities) if (e.alive && e.controller === 'scavenger') scavN++;
  const scavTarget = scavengerTarget(world);
  for (let i = 0; i < n; i++) {
    const e = world.entities[i];
    if (!e.alive || e.kind === 'player' || e.ownerId) continue; // owned buds/companions don't self-divide
    // Fission guild: a gorged hunter cleaves in two → the froth's self-replication + selection.
    const divisionRate = wildFissionRate(e);
    if (divisionRate > 0 && world.rng() < 1 - Math.exp(-divisionRate * dt)) {
      if (world.entities.length < POP_CAP) doFission(world, e);
      continue;
    }
    // Scavengers emigrate once their reserves run out — they drift off to forage elsewhere rather
    // than starving in place. Removed cleanly (no corpse), the outbound half of their migration.
    if (e.controller === 'scavenger') {
      const cap = caps(e);
      const starved = (e.cargo.biomass || 0) < cap.biomass * 0.10 && (e.cargo.energy || 0) < cap.energy * 0.10;
      const overPressure = Math.max(0, (scavN - scavTarget) / Math.max(1, scavTarget));
      if (starved) {
        e._emigrate += dt;
        if (e._emigrate > 4) { e.alive = false; scavN--; (emigrants ||= []).push(e); world.stats.emigrations += 1; world.events.push({ type: 'emigrate', entityId: e.id, controller: e.controller }); }
      } else e._emigrate = 0;
      if (e.alive && overPressure > 0 && world.rng() < overPressure * 0.18 * dt) {
        e.alive = false; scavN--; (emigrants ||= []).push(e); world.stats.emigrations += 1; world.events.push({ type: 'emigrate', entityId: e.id, controller: e.controller });
      }
    }
  }
  if (emigrants) world.entities = world.entities.filter(x => x.alive || !emigrants.includes(x));
}

// ESCALATION — "slowly letting them go deeper and releasing more monstrous predators." A monotonic
// ratchet driven by the player's own progress: every new max depth reached, the mitochondrial
// Eucharist, and each sequenced genome pushes it up, and it NEVER falls back. It scales both the
// NUMBER of deep predators (the floor) and their STRENGTH, and at high tiers tilts the spawn mix
// toward the monstrous castes (metazoan colonies, swarm-directors). This is the engine of the rising
// action into the deep and the "farm ever-worse monsters" end game after the climax.
function escalationLevel(world) {
  const p = getPlayer(world);
  if (p) {
    const depthTier = clamp((p.maxDepth || 0) / 850, 0, 6);      // 0 (canopy) .. ~6 (abyss floor)
    const mitoJump = hasMito(p) ? 3 : 0;                          // the climax throws open the deep
    const genomeTier = clamp((world.discoveredSources?.size || 0) * 0.25, 0, 3);
    const target = depthTier + mitoJump + genomeTier;            // 0 .. ~12
    world.escalation = Math.max(world.escalation || 0, target);  // ratchet — the deep only ever worsens
  }
  return world.escalation || 0;
}

// A deep body spawned under escalation comes in bigger, tankier, and better-armed — the same species,
// grown monstrous. Additive over its base kit and any strain, so it never removes traits.
function applyEscalation(e, esc) {
  if (!esc || esc <= 0) return;
  e.organelles.membrane = (e.organelles.membrane || 1) + Math.round(esc * 0.45);
  e.organelles.membrane_hardening = (e.organelles.membrane_hardening || 0) + Math.round(esc * 0.30);
  e.organelles.anaerobic_processor = (e.organelles.anaerobic_processor || 1) + Math.round(esc * 0.30);
  e.organelles.atp_reservoir = (e.organelles.atp_reservoir || 0) + Math.round(esc * 0.25);
  if (esc > 2) e.organelles.lance_bristle = (e.organelles.lance_bristle || 0) + Math.round((esc - 2) * 0.4);
  e._capsEpoch = -1;
  e.hp = caps(e).hp;   // fill the enlarged HP pool
}

function spawnTick(world, dt) {
  world.spawn.algae -= dt; world.spawn.npc -= dt; world.spawn.exotic -= dt; world.spawn.nursery -= dt;
  // ALGAE — minted top-down by the canopy fungus, the primary producer renewed from the light up
  // to its carrying capacity. Young blooms drift down and live their ballast lifecycle as food.
  let algaeN = 0, scavN = 0;
  for (const e of world.entities) { if (!e.alive) continue; if (e.controller === 'algae') algaeN++; else if (e.controller === 'scavenger') scavN++; }
  if (world.spawn.algae <= 0 && algaeN < ALGAE_CAP) {
    world.spawn.algae = rand(world, 0.5, 1.1);
    spawnAlgae(world, { mature: false, y: WORLD.canopy + rand(world, 40, 170) });
    world.stats.algaeBirths += 1;
    world.events.push({ type: 'algae_birth', controller: 'algae' });
  }
  // SCAVENGERS immigrate toward a soft target (they emigrate when starved, see populationTick) —
  // a migratory forager pool that flows through. Below target the froth draws foragers in.
  // The fission guild (predator/protozoan/metazoan) only gets a tiny immigration FLOOR — their
  // real numbers come from fission — so a crashed hunter layer can still recover.
  if (world.spawn.npc <= 0 && world.entities.length < POP_CAP) {
    world.spawn.npc = rand(world, 0.7, 1.5);
    if (scavN < scavengerTarget(world)) {
      spawnScavenger(world);
      world.stats.immigrations += 1;
      world.events.push({ type: 'immigrate', controller: 'scavenger' });
    }
    else {
      const esc = escalationLevel(world);
      // The deep floor GROWS with escalation, and its mix tilts toward the monstrous castes: at low
      // esc it's mostly lone predators/protozoans; as it climbs, metazoan colonies and swarm-directors
      // become a standing presence. Newly spawned deep bodies also come in stronger (opts.escalation).
      const dynFloor = {
        predator: POP_FLOOR.predator + Math.round(esc * 0.6),
        protozoan: POP_FLOOR.protozoan + Math.round(esc * 0.7),
        metazoan: POP_FLOOR.metazoan + Math.round(Math.max(0, esc - 2) * 0.5),
        brood: POP_FLOOR.brood + Math.round(Math.max(0, esc - 3) * 0.4),
      };
      const counts = {};
      for (const e of world.entities) if (e.alive) counts[e.controller] = (counts[e.controller] || 0) + 1;
      let want = null, worst = 0;
      for (const ctrl in dynFloor) { const d = dynFloor[ctrl] - (counts[ctrl] || 0); if (d > worst) { worst = d; want = ctrl; } }
      if (want === 'predator') spawnPredator(world, { escalation: esc });
      else if (want === 'protozoan') spawnProtozoan(world, { escalation: esc });
      else if (want === 'metazoan') spawnMetazoan(world, { escalation: esc });
      else if (want === 'brood') spawnBrood(world, { escalation: esc });
      if (want) {
        world.stats.immigrations += 1;
        world.events.push({ type: 'immigrate', controller: want });
      }
    }
  }
  if (world.spawn.exotic <= 0) {
    world.spawn.exotic = rand(world, 1.1, 2.2);
    // Exotics (spores/enzymes/crystals) are the keystone of mid-game progress — the bite, storage,
    // processors and the sacrament all need them. They used to spawn only in the killing deep (1720+),
    // gating the whole mid-game behind a suicidal dive for a fragile cell. Now the shallowest drift
    // up into the reachable UPPER RUPTURE, so a bodied player can earn them on a real-but-survivable
    // dive; the richest still lie deep. (This is the first rung of the rising action.)
    const y = WORLD.ruptureTop - 220 + rand(world, 0, 2500);   // ~depth 1280 (upper rupture) .. 3560
    spawnParticle(world, choice(world, ['spores', 'enzymes', 'crystals']), rand(world, 0, WORLD.w), y, 1);
  }
  // NURSERY SLURRY — a gentle, renewable food base for the O2-safe nursery band. The tuned algal
  // ecology funnels nearly all dead matter to the deep floor, leaving the shallow-safe zone a food
  // desert; a young scavenger (and the player's fragile opening) needs somewhere near the light to
  // feed without braving the deep. This keeps a few modest drift-fields in the nursery so the OPENING
  // of the run is survivable — the gentle foot of the difficulty curve. Capped by count so it never
  // floods the ecosystem or replaces the rich (dangerous) deep as the real prize.
  let nurseryFields = 0;
  for (const f of world.fields) { const d = f.y - WORLD.canopy; if (d > 780 && d < 1300) nurseryFields++; }
  if (world.spawn.nursery <= 0 && nurseryFields < 6) {
    world.spawn.nursery = rand(world, 2.0, 3.8);
    // Kept in the O2-SAFE, safely-edible band (deep enough that feeding doesn't inhale poisoning O2,
    // shallow enough that the climb home to Yuki stays affordable) — the gentle foot of the curve.
    spawnResourceField(world, rand(world, 0, WORLD.w), WORLD.canopy + rand(world, 800, 1180),
      { biomass: rand(world, 45, 90), lipids: rand(world, 8, 22), energy: rand(world, 3, 11) },
      { radius: rand(world, 44, 68), sourceKind: 'nursery_slurry', decayRate: 0.05, maxAge: 46, maxRadius: 150 });
  }
}

// Mutate a freshly spawned body into a strain: graft its signature exotic
// organelle (additively — never removing baseline organs), tint it, and seed
// whatever cargo it needs to actually use the trait. The body's `strain` field
// drives its DNA drop and lets the renderer mark it as a mutant worth hunting.
function applyStrain(world, e) {
  const pool = STRAINS[e.controller];
  if (!pool || !pool.length) return;
  if (world.rng() >= strainChanceAt(e.y)) return;
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
  const r = opts.r || (mature ? rand(world, 38, 58) : rand(world, 16, 24));
  const biomass = opts.biomass || (mature ? rand(world, 80, 150) : rand(world, 12, 26)); // young start SMALL and grow
  const x = opts.x ?? rand(world, 0, WORLD.w);
  const y = opts.y ?? (WORLD.canopy + rand(world, 40, 260));
  const e = makeSoftBody(world, 'npc', x, y, {
    r, color: '#7ee96f', controller: 'algae', trophicRole: 'photosynthetic_bloom', depthHome: WORLD.canopy + 160,
    // No flagella: a bloom has no swimming organ — it rises and falls ONLY on ballast (gas in its
    // single Ballast Bladder) versus its own weight. One bladder for every bloom keeps the buoyancy
    // curve linear and legible: gas-full & lean ⇒ floats to the light; fat ⇒ outweighs the gas & sinks.
    organelles: { membrane: mature ? 2 : 1, anaerobic_processor: 1, photosystem: 2 + (mature ? 2 : 0), oxygen_tolerance: mature ? 5 : 3, oxygen_vacuole: 1, membrane_hardening: mature ? 3 : 1, storage_vacuole: mature ? 8 : 4, exotic_vacuole: 1 },
    cargo: { biomass, lipids: rand(world, 8, 26), energy: rand(world, 8, 24), toxins: 0 },
    oxygen: oxygenAt(y) * 0.55,
    ruptureThreshold: mature ? 0.55 : 0.35, biomassMass: biomass, fallState: opts.fallState || null
  });
  // Seed a starting charge of ballast gas so a fresh bloom is mildly buoyant (mature more so).
  e.ballastGas = e.organelles.oxygen_vacuole * ORGANELLES.oxygen_vacuole.stats.gasCapBonus * 0.65;
  // Lineage-scale metabolic variation prevents a shared light/depth field from phase-locking the
  // whole crop into one global bob. It changes period, not the guarantee that full gas can return.
  e.ecologyRate = opts.ecologyRate ?? rand(world, 0.62, 1.48);
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
  if (!opts.noStrain) { applyStrain(world, e); assignBody(e); }
  e.brainState = 'forage';
  world.entities.push(e); return e;
}

function spawnPredator(world, opts = {}) {
  // Ongoing predators enter from the BOTTOM of the rupture layer — up out of the gap at the
  // edge of the abyss — and prowl upward, rather than materializing at the top where the
  // player descends into them. (Seeded in-medias-res predators pass an explicit spread y.)
  // Depth still drives strength: a body formed near the gap is bigger, tougher, better armed.
  const y = opts.y ?? (WORLD.ruptureBottom - rand(world, 0, 450));
  const x = opts.x ?? rand(world, 0, WORLD.w);
  // 0 at the top of the rupture layer, 1 deep — drives every strength stat below.
  const depthT = clamp((y - WORLD.ruptureTop) / 1700, 0, 1);
  const e = makeSoftBody(world, 'npc', x, y, {
    r: rand(world, 20, 30) + depthT * 16, color: '#ff7897', controller: 'predator', trophicRole: 'rupture_predator', depthHome: y,
    organelles: { membrane: 2 + Math.round(depthT * 2), anaerobic_processor: 3 + Math.round(depthT * 2), basal_motility: 1, flagella: 1, rasping_lamella: 1, storage_vacuole: 4, exotic_vacuole: 1, membrane_hardening: 1 + Math.round(depthT * 2), atp_reservoir: 1 + Math.round(depthT), cleavage_furrow: 1 }, cargo: { biomass: rand(world, 24, 44), energy: rand(world, 34, 68), lipids: rand(world, 10, 30) }, oxygen: oxygenAt(y),
    ruptureThreshold: 0.48
  });
  const roll = world.rng();
  if (roll < 0.42 + depthT * 0.3) e.organelles.lance_bristle = 1 + Math.round(depthT);
  if (roll > 0.62 - depthT * 0.2) { e.organelles.toxin_launcher = 1; e.cargo.toxins = Math.max(e.cargo.toxins || 0, rand(world, 8, 18)); }
  e.photophobic = y >= WORLD.ruptureTop; // rupture/deep predators are light-vampires, not surface pursuers
  applyEscalation(e, opts.escalation || 0);
  applyStrain(world, e);
  assignBody(e);
  initBrain(world, e, depthT); // deeper predators roll bolder + less cautious
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
  // Deep predators swim in from off the very bottom of the map — the abyss floor — and rise.
  const y = opts.y ?? (WORLD.h - rand(world, 150, 850));
  const x = opts.x ?? rand(world, 0, WORLD.w);
  const hp = rand(world, 150, 230);
  const e = makeSoftBody(world, 'npc', x, y, {
    r: rand(world, 34, 52), color: '#d892ff', controller: 'protozoan', trophicRole: 'deep_predator', depthHome: y,
    organelles: { membrane: 3, anaerobic_processor: 3, basal_motility: 1, flagella: 1, rasping_lamella: 1, toxin_launcher: 1, mitochondrion: 1, lance_bristle: 1, storage_vacuole: 6, exotic_vacuole: 2, dna_memory_vesicle: 2, membrane_hardening: 2, atp_reservoir: 2, cleavage_furrow: 1 }, cargo: { biomass: rand(world, 40, 78), energy: rand(world, 70, 120), lipids: rand(world, 24, 58), toxins: rand(world, 4, 18) }, oxygen: oxygenAt(y),
    ruptureThreshold: 0.65
  });
  e.photophobic = true; // deep predators are creatures of the dark
  applyEscalation(e, opts.escalation || 0);
  applyStrain(world, e);
  assignBody(e);
  initBrain(world, e, 0.9); // the deep breeds bold hunters
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
    organelles: { membrane: 4, anaerobic_processor: 4, mitochondrion: 1, basal_motility: 1, flagella: 2, lance_bristle: 1, rasping_lamella: 1, toxin_launcher: 1, storage_vacuole: 8, exotic_vacuole: 2, dna_memory_vesicle: 2, membrane_hardening: 3, atp_reservoir: 3, cleavage_furrow: 1 },
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
  applyEscalation(e, opts.escalation || 0);
  applyStrain(world, e); // the lead may mutate; its strain drops the exotic DNA
  e.maxHp = caps(e).hp; e.hp = e.maxHp; // colony membranes fold into a big HP pool
  e.bodyPlan = 'colonial';
  e.photophobic = true; // an abyssal colony — the light is death to it
  initBrain(world, e, 1); // a colossal deep colony: bold, low caution
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
  e.ownerId = brood.id; e.bodyPlan = 'blob'; e.photophobic = !!brood.photophobic;
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
  applyEscalation(e, opts.escalation || 0);
  e.strain = 'pheromone_gland'; // the DNA you hunt it for
  e.strainPotency = clamp(gaussian(world.rng, 1.0, 0.13), 0.5, 1.8);
  e.maxHp = caps(e).hp; e.hp = e.maxHp;
  e.bodyPlan = 'brood';
  e.photophobic = true; // a deep conductor; sunlight unmakes it (and its brood)
  world.entities.push(e);
  for (let i = 0; i < 2; i++) spawnSwarmAgent(world, e);
  return e;
}

function bestFieldFor(entity, world) {
  let best = null, bestScore = -Infinity;
  for (const f of world.fields) {
    const d = distWrap(entity.x, entity.y, f.x, f.y);
    if (d > 1300) continue; // far fields never win matter/(35+d); skip the reduce over stock
    const matter = f._matter || 0; if (matter <= 0.5) continue; // cached in updateFields this frame
    const depthPenalty = Math.abs(f.y - entity.depthHome) * 0.010;
    const toxinPenalty = (f.stock.toxins || 0) * (hasOrg(entity, 'toxin_launcher') ? 0.01 : 0.09);
    const score = matter / (35 + d) - depthPenalty - toxinPenalty;
    if (score > bestScore) { best = f; bestScore = score; }
  }
  return best;
}

// The hunter's appetite. NOT just the hunger clock (which pins high — a predator can't graze the
// corpse fields it makes, so its timer would sit at 1 forever and it'd hunt nonstop). Instead:
// APPETITE = the rising hunger clock MINUS how well-stocked its own biomass/ATP stores are. A
// predator flush from a recent kill feels sated and stands down (prowls); as metabolism burns the
// stores down, appetite climbs and it hunts again — the opportunistic cycle, driven by real
// internal state. Scaled by temperament (bold individuals hunt while barely peckish) with a
// desperation floor when ATP runs dry. Continuous 0..~1.4 — the brain turns it into an acceptance
// bar (hungrier ⇒ commits to worse/riskier/farther prey) and the scorer uses it to discount risk.
function huntDrive(entity) {
  const cap = caps(entity);
  const bmFill = (entity.cargo?.biomass || 0) / Math.max(1, cap.biomass);
  const enFill = (entity.cargo?.energy || 0) / Math.max(1, cap.energy);
  const lipidFill = (entity.cargo?.lipids || 0) / Math.max(1, cap.lipids);
  // Satiation now leans on ATP (charge = the currency predators steal, hoard, and spend on fission).
  // A hunter isn't "stocked" until its reservoir is near full, so a charge-hungry predator keeps
  // hunting to top up — greedy for ATP, indifferent to the biomass/fat it leaves for scavengers.
  // Only a fully-charged cell stands down. This is what keeps them EAGER to kill (esp. ATP-rich prey).
  const stocked = clamp(enFill * 0.75 + lipidFill * 0.13 + bmFill * 0.12, 0, 1);
  const appetite = clamp((entity.hunger || 0) - stocked * 0.90, 0, 1);
  // Greedy-but-CAPABLE: NPCs don't spend ATP to swim, so a low charge is NO reason to rest — they
  // refuel by KILLING, so an empty reservoir should make them hunt harder, not idle and starve. The
  // damper is gone; a hunter always presses when hungry, and its charge climbs kill by kill.
  return clamp(appetite * (0.55 + (entity.aggro ?? 0.5) * 0.9), 0, 1.4);
}

// Opportunistic target scoring: reward × ease − risk. Prefers EASY, rewarding prey (wounded,
// starving, small, close, falling blooms) and shies from anything bigger/tankier than itself
// unless hunger overrides caution. Returns the best body (signature unchanged so the leashed
// controllers still call it) and stashes the winning score in entity._preyScore for the brain's
// acceptance gate. This is the fix for "predators prefer big prey and suicide onto giants".
function bestBodyTarget(entity, world, player) {
  if (!hasWeapon(entity)) { entity._preyScore = -Infinity; return null; }
  const drive = huntDrive(entity);
  const caution = entity.caution ?? 0.5;
  const myCapHp = caps(entity).hp;
  const riskTolerance = 1 - Math.min(0.9, drive * 0.6); // hungrier ⇒ less deterred by big/tanky prey
  let best = null, bestScore = -Infinity;
  for (const other of world.entities) {
    if (!other.alive || other.id === entity.id) continue;
    if (entity.friendly && other.kind === 'player') continue;
    if (entity.friendly && other.friendly) continue; // allies never hunt allies
    if (other.friendly && entity.kind === 'player') continue;
    const d = distWrap(entity.x, entity.y, other.x, other.y);
    // Distant bodies can never win the score (the -d/280 penalty alone sinks them, and
    // marks are only ever painted at close range), so skip the megamorphic stat reads
    // below for anything well out of hunting range. Big cut to the per-NPC scan cost.
    if (d > 1300) continue;
    const oCapHp = caps(other).hp;
    // Reward ≈ how much biomass the kill yields, CAPPED so a giant isn't auto-top-scored.
    const reward = Math.min(2.4, other.r / 26 + (other.cargo.biomass || 0) / 60);
    // Algae are DEFENSELESS food — the froth's easiest, safest meal. Hunters strongly prefer a bloom
    // to another armed hunter, so the deep grazes the algae instead of grinding itself to the floor
    // in attrition wars. A sinking/deep bloom is easier still (it can't drift away).
    const algaeBonus = other.controller === 'algae'
      ? 2.2 + 2.0 * logistic((other.y - WORLD.nurseryBottom) / 240) + (other.fallState === 'sinking' ? 0.35 : 0)
      : 0;
    const otherHpFill = other.hp / Math.max(1, oCapHp);
    const weak = 1.3 * logistic((0.55 - otherHpFill) * 10);
    // Live prey that strays close is aggravating — but a FELLOW HUNTER nearby does NOT trigger the
    // lock-on (that mutual proximity-aggro is what made clustered hunters dogpile each other). Only
    // non-guild bodies (the player, scavengers) provoke the reflex.
    const proximityAggro = (other.controller !== 'algae' && !HUNTER_GUILD.has(other.controller)) ? 3.0 * Math.exp(-d / 150) : 0;
    // The froth smells weakness: a body running out of ATP draws the hunters in (but not fellow hunters).
    const starving = (other.controller !== 'algae' && !HUNTER_GUILD.has(other.controller))
      ? 1.8 * Math.exp(-(other.cargo.energy || 0) / 5) : 0;
    // Death-pheromone: the swarm converges on whatever its own director marked.
    const marked = ((other.marked || 0) > 0 && other.markedBy === entity.ownerId) ? 6.0 : 0;
    // Risk: prey bigger and/or far tankier than me is dangerous. Scaled by my caution and
    // discounted by my drive — a bold, starving hunter charges anyway; a fed, timid one balks.
    const sizeRatio = other.r / Math.max(10, entity.r);
    const tanky = 0.6 * logistic((oCapHp / Math.max(1, myCapHp) - 1.3) * 5);
    const risk = ((sizeRatio > 1 ? sizeRatio - 1 : 0) + tanky) * (2.4 * caution) * riskTolerance;
    // Cannibalism tax: a hunter prefers the food chain (scavengers, falling blooms) to its own
    // guild, so the predator layer competes for prey instead of slaughtering itself down to the
    // floor — but a weak or right-on-top-of-me rival is still fair game (selection still bites).
    const guildTax = (HUNTER_GUILD.has(entity.controller) && HUNTER_GUILD.has(other.controller) && !entity.friendly) ? 14 : 0;
    const rawClaims = world._targetClaims?.get(other.id) || 0;
    const claimsByOthers = Math.max(0, rawClaims - (entity._targetRef === other ? 1 : 0));
    const claimCapacity = Math.max(1, Math.ceil(other.r / 30));
    const crowdTax = Math.max(0, claimsByOthers - claimCapacity + 1) * 1.7;
    const score = reward + algaeBonus + weak + proximityAggro + starving + marked - risk - guildTax - crowdTax - d / 280 - Math.abs(other.y - entity.depthHome) / 1150;
    if (score > bestScore) { best = other; bestScore = score; }
  }
  entity._preyScore = best ? bestScore : -Infinity;
  return best;
}

function feedFromFields(world, entity, dt) {
  const radius = feedRadius(entity);
  const rate = feedRate(entity);
  if (radius <= 0 || rate <= 0) return 0;
  // BREATHE: feeding filters O2 across the open membrane, equilibrating your internal SATURATION
  // toward the WATER'S saturation at this depth. At the O2-rich top you breathe IN (fill); down in
  // the deep dark you breathe OUT (empty). So WHERE you feed sets your oxygen, and it's the only
  // passive O2 flow — otherwise your reserve just sits (until respiration burns it). Generic (NPCs too).
  const cap = caps(entity).oxygen;
  const targetO2 = oxygenAt(entity.y) * cap;   // env saturation (0..1) × your capacity = the volume you equilibrate toward
  entity.oxygen = clamp((entity.oxygen || 0) + (targetO2 - (entity.oxygen || 0)) * FEED_INHALE_RATE * dt, 0, cap);
  const affinity = {
    biomass: 1.0,
    lipids: hasMito(entity) ? 0.95 : 0.55,
    toxins: (hasOrg(entity, 'toxin_launcher') || hasOrg(entity, 'spore_toxin_launcher')) ? 0.55 : 0.10,
    energy: 0.7
  };
  // Selective Gullet: a discriminating intake. Pulls ATP hardest, screens toxins, and
  // skews biomass<->lipids toward whichever tank is emptier (refuel what you lack).
  if (hasOrg(entity, 'selective_membrane')) {
    const c = caps(entity), st = ORGANELLES.selective_membrane.stats;
    affinity.energy = Math.max(affinity.energy, st.energyAffinity);
    affinity.toxins *= st.toxinFilter;
    const bioFill = clamp((entity.cargo.biomass || 0) / Math.max(1, c.biomass), 0, 1);
    const lipFill = clamp((entity.cargo.lipids || 0) / Math.max(1, c.lipids), 0, 1);
    const diff = bioFill - lipFill; // >0: biomass fuller → crave lipids; <0: crave biomass
    affinity.lipids *= 1 + Math.max(0, diff) * st.skew;
    affinity.biomass *= 1 + Math.max(0, -diff) * st.skew;
  }
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
    maxAge: opts.maxAge || 24, decayRate: opts.decayRate ?? 0.10, radiusScale: opts.radiusScale || 8, maxRadius: opts.maxRadius || 180,
    // vy/spread grow during drift; _matter caches totalMatter(stock) so the per-NPC field
    // scan (bestFieldFor) reads a number instead of re-reducing every field's stock each query.
    vy: 0, spread: 0, _matter: 0
  };
  f._matter = totalMatter(f.stock);
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
  if (hasOrg(e, 'combustion_vesicle')) { const st = ORGANELLES.combustion_vesicle.stats; actions.push({ id: 'flame', label: 'Flamethrower', enabled: powered && (e.oxygen || 0) >= st.o2Cost && (e.cargo.lipids || 0) >= st.lipidCost && (e.cargo.toxins || 0) >= st.toxinCost }); }
  if (hasOrg(e, 'pheromone_gland')) { const st = ORGANELLES.pheromone_gland.stats; actions.push({ id: 'mark', label: 'Mark Target', enabled: powered && (e.cargo.energy || 0) >= st.energyCost && (e.cargo.spores || 0) >= st.sporeCost }); }
  if (hasOrg(e, 'phagosome')) { const o = CONSUMABLES.engulf; actions.push({ id: 'engulf', label: 'Engulf', enabled: powered && (e.cargo.enzymes || 0) >= o.enzyme && (e.cargo.energy || 0) >= o.energyCost }); }
  if (hasOrg(e, 'crystal_ward')) { const o = CONSUMABLES.ward; actions.push({ id: 'ward', label: 'Crystal Ward', enabled: powered && (e.cargo.crystals || 0) >= o.crystal && (e.cargo.energy || 0) >= o.energyCost }); }
  if (hasOrg(e, 'toxin_cloud')) actions.push({ id: 'cloud', label: 'Cloud', enabled: powered && (e.cargo.toxins || 0) >= ORGANELLES.toxin_cloud.stats.toxinCost && (e.cargo.energy || 0) >= ORGANELLES.toxin_cloud.stats.energyCost });
  if (hasOrg(e, BALLAST.requires)) actions.push({ id: 'ballast', label: e.ballast ? 'Rise' : 'Dive', enabled: true, active: !!e.ballast });
  if (hasOrg(e, 'jettison_vesicle')) actions.push({ id: 'jettison', label: 'Jettison', enabled: powered && (e.cargo.biomass || 0) >= ORGANELLES.jettison_vesicle.stats.ejectMin });
  if (hasOrg(e, 'cleavage_furrow')) actions.push({ id: 'divide', label: 'Divide', enabled: fissionReady(e) }); // lights up when gorged enough to split
  actions.push({ id: 'yuki', label: 'Yuki', enabled: nearYuki(world, e) });
  return actions;
}

export function nearYuki(world, entity = getPlayer(world)) { return !!entity && entity.y < WORLD.canopy + 220; }

export function getYukiOfferings(world, entityId = world.playerId) {
  CAPS_EPOCH++; // external read entry point — never serve a stale caps() memo
  const e = world.entities.find(x => x.id === entityId);
  const readiness = hostReadiness(e, world);
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
    // Value-based exchange: pay a fair share of your matter (no fixed recipe). cost is the LIVE
    // split it would draw from your current stock, so the shop shows exactly what you'd spend now.
    const isValue = o.value != null;
    const cost = isValue ? valueSplit(e.cargo, o.value) : scaledCost(e, o); // membrane cost grows geometrically with layers already grown
    const affordable = isValue ? canAffordValue(e.cargo, o.value) : hasStock(e.cargo, cost);
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
    if (!affordable) reasons.push(isValue ? `needs ${Math.ceil(o.value)} worth of matter (biomass + fat)` : `needs ${fmtStock(missingStock(e.cargo, cost))}`);
    const category = o.organelle ? ORGANELLES[o.organelle]?.category || null : null;
    // Functional category + the current Fibonacci exotic-cost multiplier (from same-category organs
    // already grown), so the shop can explain why an exotic price has climbed.
    const funcCategory = o.organelle ? ORGAN_CATEGORY[o.organelle] || null : null;
    const catMult = categoryMult(e, o);
    const catOwned = funcCategory ? categoryCount(e, funcCategory) : 0;
    // Sequenced potency of this trait (the genome you locked in), plus the best
    // sample you're currently carrying — so the shop can flag an available upgrade.
    const potencyVal = (o.organelle && world.discoveredSources && world.discoveredSources.get) ? world.discoveredSources.get(o.organelle) ?? null : null;
    const carriedPotency = (o.organelle && e.carriedStrains && e.carriedStrains.get) ? e.carriedStrains.get(o.organelle) ?? null : null;
    return { ...o, cost, costText: fmtStock(cost), locked, affordable, reasons, owned, maxed, undiscovered: needsDiscovery, category, funcCategory, categoryMult: catMult, categoryOwned: catOwned, potency: potencyVal, carriedPotency, tier3: o.section.includes('Tier 3'), readiness: o.id === 'mitochondrial_eucharist' ? readiness : null };
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
  // Sequencing lives in the top exchange bar and is ALWAYS shown — just greyed out when
  // there's no DNA to read, so the player always knows where the genome sink is.
  const canSeq = dnaHeld > 0 || carried.length > 0;
  const affordSeq = hasStock(e.cargo, seqCost);
  const seqReasons = [];
  if (!canSeq) seqReasons.push('no DNA held — harvest genomes from mutant strains');
  else if (!affordSeq) seqReasons.push(`needs ${fmtStock(missingStock(e.cargo, seqCost))}`);
  const sequenceOfferings = [{
    id: 'sequence_dna', section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'sequence',
    name: canSeq ? `Sequence Genome (${dnaHeld})` : 'Sequence Genome', dnaHeld,
    desc: canSeq ? `Yuki reads your ${dnaHeld} DNA record${dnaHeld > 1 ? 's' : ''}: ${carried.length ? carried.map(([s, v]) => `${ORGANELLES[s].name} ${Math.round(v * 100)}%${world.discoveredSources.has(s) ? ' (upgrade)' : ''}`).join(', ') : 'no new traits'}${junkCount > 0 ? `; ${junkCount} junk strand${junkCount > 1 ? 's' : ''} → restock your scarcest exotics` : ''}.` : 'Nothing to sequence yet — harvest DNA from mutant strains, then bring it here.',
    cost: seqCost, costText: fmtStock(seqCost),
    locked: !canSeq || !affordSeq, affordable: affordSeq,
    reasons: seqReasons,
    owned: false, maxed: false, undiscovered: false, category: null, potency: null, tier3: false, readiness: null
  }];
  const deployCost = { biomass: 90, lipids: 40, energy: 60 };
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
    // Every strand that wasn't a good genome is junk. Rather than bulk biomass, Yuki
    // renders each junk strand into whichever exotic you're shortest on (spores/enzymes/
    // crystals), rebalancing as it fills — so junk quietly restocks scarce ammo/catalyst.
    const junkCount = Math.max(0, dnaHeld - carried.length);
    const c = caps(entity);
    const gained = {};
    let junkBiomass = 0;
    for (let i = 0; i < junkCount; i++) {
      let best = null, bestFill = Infinity;
      for (const r of JUNK_EXOTICS) {
        const cap = c[r] ?? 0; if (cap <= 0) continue;
        const room = cap - (entity.cargo[r] || 0); if (room < 1) continue;
        const fill = (entity.cargo[r] || 0) / cap;
        if (fill < bestFill) { bestFill = fill; best = r; }
      }
      if (best) { entity.cargo[best] = (entity.cargo[best] || 0) + 1; gained[best] = (gained[best] || 0) + 1; }
      else { const add = Math.min((c.biomass ?? 0) - (entity.cargo.biomass || 0), JUNK_DNA_BIOMASS); if (add > 0) { entity.cargo.biomass += add; junkBiomass += add; } }
    }
    // The whole tank is consumed — good genomes spent into unlocks, junk into exotics.
    entity.cargo.dna = 0;
    clampCargo(entity);
    saveDiscoveries(world);
    world.events.push({ type: 'sequence', entityId, good: carried.length, junk: junkCount, gained, biomass: junkBiomass });
    world.events.push({ type: 'buy', entityId, offeringId });
    return { ok: true, offeringId, sequenced: carried.length, rendered: junkCount, gained, biomass: junkBiomass };
  }
  if (offeringId.startsWith('attach_')) {
    const blueprintId = offeringId.slice(7);
    const blueprint = (world.cellLibrary || []).find(b => b.id === blueprintId);
    if (!blueprint) return { ok: false, reason: 'blueprint not found' };
    if ((entity.colony || []).some(s => s.id === blueprint.id)) return { ok: false, reason: 'already part of your body' };
    if ((entity.colony || []).length >= 3) return { ok: false, reason: 'colony full — max 3 cells' };
    const deployCost = { biomass: 90, lipids: 40, energy: 60 };
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
  if (offering.value != null) {
    // Value-based exchange: draw a fair share of matter (biomass + fat) rather than a fixed recipe.
    if (!payValue(entity.cargo, offering.value)) return { ok: false, reason: `needs ${Math.ceil(offering.value)} worth of matter` };
  } else {
    subStock(entity.cargo, scaledCost(entity, offering)); // membrane costs scale with layers owned
  }
  if (offering.gain) addStock(entity.cargo, offering.gain);
  if (offering.effect?.heal) entity.hp = Math.min(caps(entity).hp, entity.hp + offering.effect.heal);
  if (offering.effect?.detoxFrac) entity.cargo.toxins = (entity.cargo.toxins || 0) * (1 - offering.effect.detoxFrac);
  if (offering.effect?.oxygenVentFrac) entity.oxygen = (entity.oxygen || 0) * (1 - offering.effect.oxygenVentFrac);
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
    // Initiation trauma: the freshly-spliced organ inflames the body and tears membrane.
    const c = caps(entity);
    entity.cargo.toxins = Math.min(c.toxins, (entity.cargo.toxins || 0) + GRAFT_INITIATION.toxins);
    const hpHit = Math.max(GRAFT_INITIATION.hpMin, c.hp * GRAFT_INITIATION.hpFrac);
    entity.hp = Math.max(1, entity.hp - hpHit);
    world.events.push({ type: 'graft_trauma', entityId, toxins: GRAFT_INITIATION.toxins, hp: hpHit });
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
  const readiness = hostReadiness(e, world);
  return {
    hp: { value: e.hp, max: c.hp, label: 'HP', layers: orgCount(e, 'membrane') },
    oxygen: { value: e.oxygen, max: c.oxygen, external: env.oxygen, tolerance: oxygenTolerance(e), label: 'O2' },
    depth: { value: Math.max(0, e.y - WORLD.canopy), max: WORLD.h - WORLD.canopy, zone: zoneName(e.y), light: env.light, externalOxygen: env.oxygen },
    resources: RESOURCES.map(r => ({ id: r, label: r === 'energy' ? 'ATP' : r, value: e.cargo[r] || 0, max: c[r] ?? 99, color: COLORS[r] || '#fff' })),
    organelles: Object.entries(e.organelles).map(([id, count]) => ({ id, count, name: ORGANELLES[id]?.name || id, tier: ORGANELLES[id]?.tier || 1, action: ORGANELLES[id]?.action || null, desc: ORGANELLES[id]?.desc || '', category: ORGANELLES[id]?.category || null })),
    graphStats: { caps: c, hpSource: 'Cell Membrane count × membrane HP + graph armor/chassis', storageSource: 'Storage Vacuole / Exotic Vesicle Rack / DNA Memory Vesicle counts' },
    metabolism: { anaerobicProcessorLevel: orgCount(e, 'anaerobic_processor'), anaerobicRate: orgCount(e, 'anaerobic_processor') * ORGANELLES.anaerobic_processor.stats.rate, energyStarved: (e.cargo.energy || 0) <= 0.01 },
    actions: getAvailableActions(world, entityId),
    nearYuki: nearYuki(world, e),
    ballast: (() => {
      // Trim = net vertical tendency, centered at 0.5: >0.5 buoyant (rising), <0.5 heavy (sinking).
      // Mirrors the SAME gas-vs-weight the submarine drift uses (gas is lift, biomass is weight; the
      // bladder's structural baseLift is excluded), so the gauge matches how the cell actually drifts.
      const flag = orgCount(e, 'flagella') * ORGANELLES.flagella.stats.lift * 0.18;
      const gasCap = caps(e).ballastGas;
      const bladders = orgCount(e, 'oxygen_vacuole');
      const gasLift = (e.ballastGas || 0) * ORGANELLES.oxygen_vacuole.stats.liftPerGas;
      const net = bladders > 0 ? (1.0 + gasLift + flag - biomassWeight(e)) : (buoyancy(e) + flag - biomassWeight(e));
      const gasFill = clamp((e.ballastGas || 0) / Math.max(0.05, gasCap), 0, 1);
      return { flooded: false, hasOrgan: hasOrg(e, BALLAST.requires), net, trim: clamp(0.5 + net / 12, 0, 1), gas: e.ballastGas || 0, gasCap, gasFill };
    })(),
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
  if (e.incubating) return 'The Eucharist is incubating inside you. Keep lipids and ATP in reserve, and don\'t let oxygen overload you.';
  if (!hasOrg(e, 'lipid_repair_loom')) return 'You are a young algal cell. Bask at the lit canopy to fatten on light, flood your ballast to dive, and rasp rival scavengers off the richest fields. Feeding makes ATP — every action spends it. Then carry your harvest to Yuki to graft real organs.';
  const lib = world.cellLibrary || [];
  if (!hasMito(e)) {
    if (lib.length > 0) return `Your second form. Shape a specialized body — your archived ${lib[lib.length - 1].label} waits at Yuki to be rejoined.`;
    return 'Make yourself worthy to host mitochondria: mend your membrane, graft exotic organs, sequence one strand of DNA, and survive the deep. This gift cannot be bought.';
  }
  if (lib.length === 0) {
    if ((e.cargo.dna || 0) < 3) return 'Mitochondria live in you now. Oxygen and lipids are power — and the deep ruptures shed DNA for the taking.';
    if (!hasOrg(e, 'eucharist_archive')) return 'Carry your DNA up to Yuki to open the Eucharist Archive.';
    return 'The Archive is open. Your form will be preserved at your next Eucharist.';
  }
  const colony = e.colony || [];
  if (colony.length >= 3) return 'Your colony is whole. Lead your many-celled body down into the deep.';
  if (lib.length === 1) return 'Your form is archived. Rejoin your legacy in Yuki\'s chamber, or die to begin a second specialization.';
  if (lib.length >= 2) return 'Your colony is growing. Rejoin your preserved forms to build a many-celled body.';
  return 'The Archive is open. Your form will be preserved at your next Eucharist.';
}

export function getRenderProjection(world) {
  CAPS_EPOCH++; // external read entry point — never serve a stale caps() memo
  const entityProjection = world.entities.map(e => ({ id: e.id, kind: e.kind, x: e.x, y: e.y, vx: e.vx, vy: e.vy, r: e.r, hp: e.hp, maxHp: caps(e).hp, color: e.color, controller: e.controller, trophicRole: e.trophicRole, strain: e.strain || null, bodyPlan: e.bodyPlan || null, companionType: e.companionType || null, ownerId: e.ownerId || null, marked: (e.marked || 0) > 0 ? e.marked : 0, warded: (e.warded || 0) > 0 ? e.warded : 0, ballast: !!e.ballast, ballastGas: e.ballastGas || 0, photophobic: !!e.photophobic, friendly: e.friendly, phase: e.phase, feedIntent: e.feedIntent, repairIntent: e.repairIntent, action: e.action, organelles: { ...e.organelles }, hit: e.hit, combatHit: e.combatHit || 0, oxygen: e.oxygen, oxygenTolerance: oxygenTolerance(e), toxins: e.cargo.toxins || 0, toxinCap: caps(e).toxins, fallState: e.fallState, incubating: e.incubating ? { ...e.incubating } : null }));
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
  return { version: VERSION, escalation: world.escalation || 0, entityCount: world.entities.length, fieldCount: world.fields.length, hazardCount: world.hazards.length, particleCount: world.particles.length, playerCargo: p ? { ...p.cargo } : null, playerOrgans: p ? { ...p.organelles } : null, playerOxygen: p ? p.oxygen : null, readiness: p ? hostReadiness(p, world) : null, stats: { ...world.stats } };
}

export const __test = { clamp, wrapX, dxWrap, distWrap, feedFromFields, repairFromLipids, caps, fmtStock, hasStock, spawnScavenger, spawnAlgae, spawnPredator, spawnProtozoan, speedOf, feedRadius, feedRate, feedingOrgCount, totalMatter, oxygenTolerance, membraneHardness, membranePorosity, hostReadiness, biomassWeight, buoyancy, algaeBallastWorkDepth, classifyBlueprint, snapshotCell, attachColonyCell, colonyOrgs, applyStrain, sporePulse, lanceDamage, contactDamage, hasRasp, STRAINS, potency, drainLeech, YUKI_SPAWN, adrenalFactor, areHostile, overlapAura, updateStrainSystems, harpoonPulse, gaussian, budFriendly, spawnCompanion, spawnMetazoan, companionCount, hasWeapon, assignBody, COMPANION_CAP, spawnBrood, spawnSwarmAgent, markPulse, swarmCap, conductSwarm, deliverToOwner, vulnerability, engulfPulse, wardPulse, membraneHardness, CONSUMABLES, GRAFT_INITIATION, BALLAST, LIGHT_BURN, COLORS, hurt, ventBiomass, resolveContacts, spawnResourceField, flamePulse, combustionMult, detonateVolatile, COMBUSTION, scaledCost, fib, categoryCount, categoryMult, ORGAN_CATEGORY, updateNpcBrain, updateScavengerBrain, initBrain, huntDrive, bestBodyTarget, bestFieldFor, hunterThreatPressure, hunterPolicy, wildFissionRate, BRAIN, FREE_HUNTERS, HUNTER_GUILD, fissionReady, doFission, mutateOnFission, populationTick, playerFission, POP_FLOOR, SCAV_TARGET, scavengerTarget, ALGAE_CAP, POP_CAP, escalationLevel, applyEscalation };
