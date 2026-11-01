// gameModule.mjs — the player-facing shop / Yuki / projection layer, split out of graph_kernel.
// It CALLS the sim; the sim never calls it. All sim-core primitives are pulled in as a namespace and
// destructured so the extracted function bodies read exactly as they did in the monolith.
import * as SC from './simCore.mjs';
const {
  ABYSSAL_ARMOR_RATE, ABYSSAL_ARMOR_YIELD, ALGAE_BLOAT_K, ALGAE_CAP, ALGAE_DEEP_ATTR, ALGAE_DEEP_FERMENT_K, ALGAE_DEV, ALGAE_DEV_CANDIDATES, ALGAE_DEV_KIT, ALGAE_EMERGENCY_CAP, ALGAE_GUN_TARGETS, ALGAE_HEAL, ALGAE_LIGHT_GAS_VENT_K, ATP_HARVEST, ATP_HARVESTERS, BALLAST, BALLAST_BRICK_WEIGHT, BALLAST_DRIFT_K, BALLAST_FLOOD_W, BALLAST_SINK_VY, BARE_GRAFT_FRAC, BARE_GRAFT_MAX, BARE_GRAFT_MIN, BASE_BUOYANCY, BASE_O2_SAFE_FRAC, BASE_OXYGEN_CAP, BIOMASS_FLOOR_DECAY, BIOMASS_MAX_AGE, BIOMASS_SINK_DECAY, BIOMASS_SINK_K, BIOMASS_TO_LIPID, BLOOM_ACID_RECOIL, BOYLE_K, BRAIN, BREATH_PUSH, CATEGORY_EXEMPT, CLING_ANCHOR_VY, CLING_GRAB, CLING_LATERAL, CLING_MASS_FACTOR, COLORS, COMBUSTION, COMFORT_PUSH, COMPANIONS, COMPANION_CAP, CONE_BOTTOM, CONE_TOP, CONSUMABLES, CORE_ORGAN, CRAB_BELLY, CRAB_CURRENT, CRAB_ENGULF_MIN_MASS, CRAB_ENGULF_MIN_R, CRAB_MARCH_SPEED, CRAB_MAW_FRAC, CRAB_SUMMON_THRESHOLD, DEEP_BODY_BY_CATEGORY, DEFAULT_ALGAE_REGIME, DEFAULT_ECOLOGY_TUNING, DNA_CATEGORY_COLORS, EDDY_BANDS, EDDY_FLOOR, EDDY_SURFACE, EXOTIC_KEYS, EXOTIC_RESOURCES, FAT_BAND_LATERAL_K, FAT_BAND_MAX_HALF_WIDTH, FAT_BAND_THICKNESS, FAT_FRICTION, FAT_PROFILE_SLICES, FAT_SHADE_BAND, FAT_SHADE_MAX, FAT_SHADE_SATURATE, FEED_INHALE_RATE, FIELD_DIFFUSE_K, FIELD_ENV_COST, FIELD_MERGE_WINDOW, FIELD_RES, FIELD_SINK_K, FIELD_TERMINAL_VY, FIELD_TYPE, FIRST_COPY_MULT, FLAME_TICK, FREE_HUNTERS, GAS_LEAK_K, GAS_TARGET_RATE, GRAFT_INITIATION, GRAZER_FAT_PULL, GRAZER_FISSION_K, GRAZER_METABOLIC_BURN, HAZARD_KIND_TO_ORGAN, HUNTER_CHOMP_FRAC, HUNTER_GUILD, HUNTER_LIPID_BURN, JUNK_DNA_BIOMASS, JUNK_EXOTICS, LANCES, LIGHT_BURN, LIPID_ATP_YIELD, LIPID_MAX_AGE, LIPID_RISE_K, LIPID_RISE_MAX, LIPID_RISE_MIN, LIPID_SURFACE_DECAY, MANUFACTURING, MASS_TAX_K, MATTER_RESOURCES, MEMBRANE_COST_RATIO, MEMBRANE_LAYER_LIPID, MITO_DEPTH_MARK, MITO_GRAFT, MOTOR_RAMP_TIME, MOVE_ATP_SCALE, NPC_GROWTH, NPC_TARGET_KIT, O2_BREATH_LOW, O2_CLOUD, O2_DARK, O2_FLOOR, O2_MITO_FRAC_BONUS, O2_SHELF, O2_WORK_MIN, O2_ZONE_BOTTOM, OFFERINGS, ORGANELLES, ORGAN_CATEGORY, ORGAN_GRAPH_EDGES, ORGAN_GRAPH_ROLE, ORGAN_REMOVE_REFUND_FRAC, OVERLAP_STACK_K, PASSIVE_MEMBRANE, PAY_RESOURCES, POP_CAP, POP_FLOOR, PROCESSORS, RASP_ORGANS, RESOURCES, RESOURCE_WORTH, RNA_COPY_FRAC, RNA_GRAFT_PREMIUM, SCAV_FLEE_RADIUS, SCAV_MOB_QUORUM, SCAV_MOB_RADIUS, SCAV_PACK_RADIUS, SCAV_TARGET, SPAWN_CLEARANCE, SQUEEZE_SINK_K, STEADY_STATE, STRAINS, TEMPO_DEEP, VARIABLE_ORGANS, VERSION, VERT_GRADIENT, WASH_GUILDS, WHALE_FALL_TERMINAL, WORLD, YUKI_SPAWN, YUKI_TEND, __test, acidPulse, addOxygenO2, addStock, adrenalFactor, afterDamage, algaeBallastGun, algaeBallastWorkDepth, algaeBirthHazard, algaeCyclePhase, algaeDevPressure, algaeDumpPump, algaeOrderChoice, algaePolicy, algaeProducerMass, algaeSynthesizeBallast, algaeTraits, allegiance, applyActiveActionCosts, applyEscalation, applyPlayerCommands, applyStrain, areAllied, areHostile, assignBody, attachColonyCell, ballastPulse, ballastWeight, bestBodyTarget, bestFieldFor, bestWoundedAlgaeForScavenger, biomassCargoWeight, biomassWeight, bloomDeath, breathSteerY, budFriendly, bumpCapsEpoch, buoyancy, canAffordValue, caps, capsCompute, categoryCount, categoryMult, chargeThrustATP, chemotaxisPull, choice, clamp, clampCargo, classifyBlueprint, collectParticles, colonyOrgs, combustionMult, comfortPain, comfortSteerY, compactWaste, companionCount, computeFatShade, conductSwarm, contactDamage, copyFactor, createEcologyWorld, createWorld, deliberateWeaponTarget, deliverToOwner, depthForOxygen, depthTempo, detonateVolatile, dischargePulse, dissolvedToxinAt, dist2Wrap, distWrap, doFission, drainLeech, dxWrap, eddyFlow, eddyIntensity, emptyCargo, engulfPulse, entrySpawn, escalationLevel, fatProfile, fatSteerY, feedFromFields, feedRadius, feedRate, feedingOrgCount, fib, fieldForageScore, finishWorldStep, fireOnPrey, fissionReady, flamePulse, fmtStock, freshDiscoveries, friendlySide, gasLift, gasSqueezeMult, gaussian, gaussianPulseRate, getPlayer, giantAlgaeFactor, grazeWoundedAlgae, harpoonPulse, hasEnergy, hasMito, hasOrg, hasRasp, hasStock, hasWeapon, hash01, hostReadiness, huntDrive, hunterFatMouth, hunterPolicy, hunterThreatPressure, hurt, id, initBrain, lanceDamage, lightAt, lineageKey, lipidBladderLift, lipidize, loadDiscoveries, logistic, makeImmigrantPlayer, makeSoftBody, manufacturingCost, markPulse, massBreakdown, maybeTransformToDeepBloom, meanSd, membraneHardness, membraneLayerLipidCost, membranePorosity, mergeNearbyFields, mulberry32, mutateOnFission, netWeightPressure, norm, normalizeWeights, npcGrowStep, orbitalDamage, orgCount, overlapAura, oxygenAt, oxygenTolerance, payValue, payWorth, placeSeedHunterByLight, playerFission, populationTick, potency, pressureAt, rand, removeDead, repairFromLipids, resolveContacts, resourceLabel, sampleAlgaeDevChoice, sampleAlgaeTraits, sampleWeights, saveDiscoveries, scaledCost, scaledRawCost, scavengerImmigrationLocation, scavengerSituation, scavengerTarget, seedAnalyticAlgaeRegime, seedMatureEcosystem, seedMatureHunterState, seekerAutoFire, shadedLightAt, shedAlgaeWoundMatter, shedMembraneLayers, signature, signatureKey, snapshotCell, spawnAlgae, spawnBrood, spawnCompanion, spawnMetazoan, spawnParticle, spawnPredator, spawnProtozoan, spawnResourceField, spawnScavenger, spawnShroomba, spawnSwarmAgent, spawnTick, spawnToxicHazard, speedOf, sporePulse, steadyFill, step, stepEcology, stepManufacturing, stepWasteCompaction, strainChanceAt, subStock, sunExposure, swarmCap, systemMatter, targetRadius, tickChance, totalMatter, toxinCloud, transformToDeepBloom, updateAlgaeAI, updateDeepBloom, updateEnvironmentAndMetabolism, updateEucharistIncubation, updateFields, updateHazards, updateNPCs, updateNpcBrain, updateNpcBrainThresholdLegacy, updateParticles, updateScavengerBrain, updateShroombaBrain, updateStrainSystems, valueSplit, ventBiomass, verticalGradientMult, vulnerability, wardPulse, widthScale, wildFissionRate, woundedAlgaeScore, wrapX, yAtLight, yukiRestore, yukiStrandX, yukiTendrilLen, yukiTendrilSpawn, yukiTendrilX
} = SC;

export function startManufacturing(world, offeringId, entityId = world.playerId) {
  const e = world.entities.find(x => x.id === entityId);
  if (!e) return { ok: false, reason: 'missing entity' };
  if (!hasOrg(e, 'organ_manufacturing')) return { ok: false, reason: 'no manufacturing organ' };
  if (e.manufacturing) return { ok: false, reason: 'already building' };
  const offering = OFFERINGS.find(o => o.id === offeringId);
  if (!offering || !offering.organelle) return { ok: false, reason: 'missing offering' };
  // RNA gate: a ribosome can only PRINT an organ whose recipe (RNA) this cell holds. RNA is somatic —
  // gained by buying graft+RNA at Yuki, or expressing a known gene at a DNA rack — and does not cleave.
  if (!(e.knownRNA && e.knownRNA.has(offering.organelle))) {
    return { ok: false, reason: 'no RNA recipe — buy graft+RNA, or express the gene at a DNA rack' };
  }
  const proj = getYukiOfferings(world, entityId).find(o => o.id === offeringId);
  if (!proj) return { ok: false, reason: 'missing offering' };
  if (proj.maxed) return { ok: false, reason: 'already grafted or maxed' };
  const genuinelyLocked = proj.locked && !(proj.reasons && proj.reasons.length && proj.reasons.every(r => r.startsWith('needs ')));
  if (genuinelyLocked) return { ok: false, reason: (proj.reasons || []).join('; ') || 'locked' };
  // Cost from the RAW offering, not `proj` — getYukiOfferings' projection already ran the offering
  // through scaledCost/lipidize (its biomass folded away into a lipids price for Yuki's sticker). Feeding
  // that back into manufacturingCost would silently zero out biomassTotal for every build.
  const { biomassTotal, lipidsTotal, exotics } = manufacturingCost(e, offering);
  for (const [k, v] of Object.entries(exotics)) {
    if ((e.cargo[k] || 0) < v) return { ok: false, reason: `needs ${v} ${k}` };
  }
  for (const [k, v] of Object.entries(exotics)) e.cargo[k] -= v;
  // first copy of this organ type = a full DNA transcription (heavy); a repeat = a cheap RNA translation.
  // Carried on the build record so the HUD can name the two apart. biomassDone/lipidsDone track how much
  // matter has actually flowed in so far — the build completes when they reach the totals (no timer).
  const first = orgCount(e, offering.organelle) === 0;
  e.manufacturing = { organelle: offering.organelle, offeringId, biomassTotal, lipidsTotal, biomassDone: 0, lipidsDone: 0, first };
  world.events.push({ type: 'manufacture_start', entityId: e.id, organelle: offering.organelle, first });
  return { ok: true, first };
}
export function getAvailableActions(world, entityId = world.playerId) {
  bumpCapsEpoch(); // external read entry point — never serve a stale caps() memo
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
  if (hasOrg(e, 'waste_compactor')) { const st = ORGANELLES.waste_compactor.stats; actions.push({ id: 'compact', label: 'Compact Waste', enabled: powered && (e.cargo.biomass || 0) >= st.biomassCost && (e.cargo.energy || 0) >= st.energyCost }); }
  if (hasOrg(e, 'cleavage_furrow')) actions.push({ id: 'divide', label: 'Divide', enabled: fissionReady(e) }); // lights up when gorged enough to split
  actions.push({ id: 'yuki', label: 'Yuki', enabled: nearYuki(world, e) });
  return actions;
}

// ── Yuki lichen: a hanging tendril curtain defined entirely by a SEEDED EQUATION (no stored object) ──
// A dozen fungal strands root at the canopy and hang to varied depths given by a 3-octave sine of the
// strand's position — an organic, self-similar "lichen curtain"; the deepest strand is a forward base
// down in the nursery. Anywhere within reach of a strand you can duck in and commune with Yuki (shop).
export function nearYuki(world, entity = getPlayer(world)) {
  if (!entity) return false;
  const d = entity.y - WORLD.canopy;
  if (d < YUKI_TEND.matDepth) return d > -30;          // Yuki's mat blankets the canopy top
  for (let i = 0; i < YUKI_TEND.count; i++) {
    if (d > yukiTendrilLen(world, i) + 22) continue;    // below this strand's tip
    if (Math.abs(dxWrap(entity.x, yukiStrandX(world, i, entity.y))) < YUKI_TEND.reach) return true;
  }
  return false;
}
// Proximity to the Horseshroomba crab's fungal shop-on-its-back — mirrors nearYuki but keyed to the LIVE
// crab's moving body. The player communes with the deep merchant when close to its mass.
export function nearCrab(world, entity = getPlayer(world)) {
  if (!entity) return false;
  for (const c of world.entities) {
    if (!c.alive || c.controller !== 'shroomba') continue;
    if (distWrap(entity.x, entity.y, c.x, c.y) < c.r * 0.55 + 60) return true;
  }
  return false;
}
// Projection for the renderer: the strand geometry, computed fresh from the seed (never stored state).
export function getYukiTendrils(world) {
  const out = [];
  for (let i = 0; i < YUKI_TEND.count; i++) {
    const len = yukiTendrilLen(world, i), steps = Math.max(4, Math.round(len / 38)), pts = [];
    for (let k = 0; k <= steps; k++) { const y = WORLD.canopy + len * k / steps; pts.push({ x: yukiStrandX(world, i, y), y }); }
    out.push({ i, rootX: yukiTendrilX(world, i), len, tipY: WORLD.canopy + len, reach: YUKI_TEND.reach, pts });
  }
  return out;
}

// ── Yuki exchange counter: LIPIDS are the currency ──────────────────────────
// Every tradeable resource buys (lipids→R, ▲) and sells (R→lipids, ▼) in fixed chunks. Lipids itself is
// the money (no self-trade). HP can only be BOUGHT (repair — you can't sell your own flesh). Selling
// toxins / O2 is the new "detox" (dump the excess for a little cash). Biomass trades near-symmetric (it's
// the core refine loop); ATP/toxins/O2 carry a spread so trading isn't free arbitrage.
// Each leg has a resource delta `d` (▲ up = +, ▼ down = −) and a lipid delta `lip` (+ = Yuki PAYS you,
// − = you pay Yuki). Biomass/ATP are real value trades (buy costs, sell pays). Toxins are GARBAGE: Yuki
// pays you a little to haul them off (up = +1 lip — the venom build gets paid to stock ammo) and it costs
// a little to dump them back (down = −1). O2 is a cheap utility service, a small fee either way. HP is
// buy-only (repair). Round-trips are ≤0 net lipids, so there's no arbitrage.
// There is NO general exchange any more — Yuki is a rest point + graft shop, nothing else for every OTHER
// resource. She freely restores HP/ATP/O2 and scrubs toxins while you rest (yukiRestore); lipids (the
// graft currency) are harvested by FEEDING on lipid fields, not traded. One deliberate exception, scoped
// narrowly: ballast bricks are uncapped and permanent (see Waste Compactor / capsCompute) — a "sell your
// age away" release valve, or the reverse if you deliberately want to sink. Flat 1:1 both ways.
const YUKI_TRADES = Object.freeze([
  { res: 'ballast', label: 'Ballast', up: { d: 1, lip: -1 }, down: { d: -1, lip: 1 } },
]);
function tradeCur(e, res) { return res === 'hp' ? e.hp : res === 'oxygen' ? (e.oxygen || 0) : (e.cargo[res] || 0); }
function tradeCap(e, res, c) { return res === 'hp' ? c.hp : res === 'oxygen' ? c.oxygen : (c[res] ?? 99); }
function tradeLegOk(e, res, leg, c) {
  if (!leg) return false;
  const cur = tradeCur(e, res), cap = tradeCap(e, res, c);
  const lip = e.cargo.lipids || 0, lipCap = c.lipids ?? 0;
  if (leg.flush) { if (cur <= 1e-6) return false; }            // flush: need something to empty
  else {
    if (leg.d > 0 && cur >= cap - 1e-6) return false;         // resource full
    if (leg.d < 0 && cur < -leg.d - 1e-6) return false;       // not enough resource
  }
  if (leg.lip < 0 && lip < -leg.lip - 1e-6) return false;     // can't afford the fee
  if (leg.lip > 0 && lip >= lipCap - 1e-6) return false;      // lipid tank full (can't take payment)
  return true;
}

export function getYukiTrades(world, entityId = world.playerId) {
  bumpCapsEpoch();
  const e = world.entities.find(x => x.id === entityId);
  if (!e) return [];
  const c = caps(e);
  // Lipids leads the counter as a display-only column (the currency itself — you can't trade it for
  // itself, so its arrows render greyed/disabled). Then the tradeable resources.
  const rows = [{
    res: 'lipids', label: 'Lipids', cur: e.cargo.lipids || 0, cap: c.lipids ?? 0,
    color: COLORS.lipids || '#f0c46a', up: null, down: null,
  }];
  for (const t of YUKI_TRADES) rows.push({
    res: t.res, label: t.label, cur: tradeCur(e, t.res), cap: tradeCap(e, t.res, c),
    color: COLORS[t.res] || (t.res === 'hp' ? '#ff6c8e' : t.res === 'oxygen' ? '#bfe8ff' : '#fff'),
    step: t.up ? Math.abs(t.up.d) : (t.down && t.down.d != null ? Math.abs(t.down.d) : null), // resource moved per click
    up: t.up ? { lip: t.up.lip, flush: !!t.up.flush, canDo: tradeLegOk(e, t.res, t.up, c) } : null,
    down: t.down ? { lip: t.down.lip, flush: !!t.down.flush, canDo: tradeLegOk(e, t.res, t.down, c) } : null,
  });
  return rows;
}

export function tradeAtYuki(world, res, dir, entityId = world.playerId) {
  bumpCapsEpoch();
  const e = world.entities.find(x => x.id === entityId);
  if (!e) return { ok: false, reason: 'missing entity' };
  const t = YUKI_TRADES.find(x => x.res === res);
  const leg = t && t[dir];
  if (!leg) return { ok: false, reason: 'not tradeable' };
  const c = caps(e);
  const cur = tradeCur(e, res), cap = tradeCap(e, res, c), lipCap = c.lipids ?? 0;
  const lip = e.cargo.lipids || 0, lab = t.label;
  // Specific, friendly failure reasons (surfaced as a toast on the tap-zone).
  if (leg.flush) { if (cur <= 1e-6) return { ok: false, reason: `no ${lab.toLowerCase()} to empty` }; }
  else if (leg.d > 0 && cur >= cap - 1e-6) return { ok: false, reason: `${lab} already full` };
  else if (leg.d < 0 && cur < -leg.d - 1e-6) return { ok: false, reason: `need ${Math.ceil(-leg.d)} ${lab.toLowerCase()}` };
  if (leg.lip < 0 && lip < -leg.lip - 1e-6) return { ok: false, reason: `need ${Math.ceil(-leg.lip)} lipids` };
  if (leg.lip > 0 && lip >= lipCap - 1e-6) return { ok: false, reason: 'lipid wallet full' };
  const nv = leg.flush ? 0 : clamp(cur + leg.d, 0, cap);       // flush empties the whole tank
  if (res === 'hp') e.hp = nv;
  else if (res === 'oxygen') { const before = e.oxygen; e.oxygen = nv; addOxygenO2(e, nv - before); } // a Yuki trade delivers/vents clean O2, not fermentation filler
  else e.cargo[res] = nv;
  e.cargo.lipids = clamp((e.cargo.lipids || 0) + leg.lip, 0, lipCap);
  clampCargo(e);
  world.events.push({ type: 'buy', entityId, offeringId: `trade_${dir}_${res}` });
  return { ok: true, res, dir };
}


// A gene is "known" (buyable-as-graft, expressible, printable) when it needs no discovery (a base organ)
// or its strain has been sequenced into the permanent discoveredSources ledger. requiresDiscovery lives on
// the OFFERING (for exotics it equals the organelle id). This is the DNA layer — germline, heritable — as
// opposed to knownRNA, the somatic per-cell recipe layer.
function geneKnown(world, offering) {
  if (!offering || !offering.requiresDiscovery) return true;
  return !!(world.discoveredSources && world.discoveredSources.has(offering.requiresDiscovery));
}

export function getYukiOfferings(world, entityId = world.playerId, source = 'yuki') {
  bumpCapsEpoch(); // external read entry point — never serve a stale caps() memo
  const e = world.entities.find(x => x.id === entityId);
  const readiness = hostReadiness(e, world);
  const activeColony = (e.colony || []).length;
  // The Horseshroomba's fungal shop is a DEEP MERCHANT: it deals only in exotic traits, DNA information,
  // and Tier-3 goods (the rare deep spoils), not the general Tier-2 survival stock Yuki carries.
  const pool = source === 'crab' ? OFFERINGS.filter(o => /Exotic|Tier 3|DNA/i.test(o.section || '')) : OFFERINGS;
  const staticOfferings = pool.map(o => {
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
    // Manufacturing view: organs are GROWN in-body, not bought — their real price is the build cost (mostly
    // biomass; first copy DNA-heavy, repeats cheap RNA), and you can START a build even when short on matter
    // (the pipe pulls what you have). Only the genuine gates + missing EXOTICS block a build, never matter.
    const build = o.kind === 'organelle' ? manufacturingCost(e, o) : null;
    const buildExoticsOk = build ? Object.entries(build.exotics).every(([k, v]) => (e.cargo[k] || 0) >= v) : true;
    const genuineLock = !!owned || !!maxed || needsMito || needsNoMito || needsOrg || needsHost || needsDiscovery || atCompanionCap || incubating;
    const buildable = o.kind === 'organelle' ? (!genuineLock && buildExoticsOk) : !locked;
    const buildCost = build ? { ...(build.biomassTotal > 0 ? { biomass: Math.ceil(build.biomassTotal) } : {}), ...(build.lipidsTotal > 0 ? { lipids: Math.ceil(build.lipidsTotal) } : {}), ...build.exotics } : null;
    const buildCostText = buildCost ? fmtStock(buildCost) : null;
    // Two-tier graft BUY (restored lipid store): a BARE graft (cheap lipids, organelle only) or a GRAFT+RNA
    // (normal lipid price + a premium, ALSO teaches the somatic recipe). Only for gene-known organelles that
    // aren't gate-locked; !genuineLock already folds in the discovery gate, so exotics you haven't sequenced
    // stay DNA-pipeline-only. Membrane keeps its φ armour price on both. hasRNA flags an already-known recipe.
    const hasRNA = !!(o.organelle && e.knownRNA && e.knownRNA.has(o.organelle));
    let graftCost = null, rnaGraftCost = null, graftBuyable = false, rnaBuyable = false;
    if (o.kind === 'organelle' && !isValue) {
      const scaledExotics = {}; for (const k of EXOTIC_KEYS) if (cost[k]) scaledExotics[k] = cost[k];
      if (o.organelle === 'membrane') {
        graftCost = cost; rnaGraftCost = cost;                                  // armour keeps its φ price
      } else {
        const bareLip = clamp(Math.round((cost.lipids || 0) * BARE_GRAFT_FRAC), BARE_GRAFT_MIN, BARE_GRAFT_MAX);
        graftCost = { lipids: bareLip, ...scaledExotics };
        rnaGraftCost = { ...cost, lipids: Math.round((cost.lipids || 0) + RNA_GRAFT_PREMIUM) };
      }
      graftBuyable = !genuineLock && hasStock(e.cargo, graftCost);
      rnaBuyable = !genuineLock && hasStock(e.cargo, rnaGraftCost);
    }
    // EXPRESS (DNA rack route): with a Memory Vesicle you can transcribe this KNOWN gene to a somatic RNA
    // recipe for free — the rack's 2^n capacity bounds the raw-DNA sample tank (caps().dna), not how many
    // recipes you keep, so expression itself just needs a rack + a gene you know but haven't expressed yet.
    // Folded onto the organelle card as an extra action rather than a duplicate card.
    const expressable = o.kind === 'organelle' && hasOrg(e, 'dna_memory_vesicle') && !genuineLock && !hasRNA;
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
    // The mitochondrion is the one violently GRAFTED organ — surface its integration HP tear + a survival
    // warning so the player can commit at full health rather than being caught out at the end of incubation.
    const isMito = o.id === 'mitochondrial_eucharist';
    const mitoTear = isMito ? Math.round(Math.max(MITO_GRAFT.hpMin, caps(e).hp * MITO_GRAFT.hpFrac)) : null;
    const mitoHpAfter = isMito ? Math.max(1, Math.round(e.hp - mitoTear)) : null;
    const mitoRisk = isMito ? (e.hp - mitoTear) <= Math.max(1, caps(e).hp * 0.12) : false;
    return { ...o, cost, costText: fmtStock(cost), locked, affordable, reasons, owned, maxed, undiscovered: needsDiscovery, category, funcCategory, categoryMult: catMult, categoryOwned: catOwned, potency: potencyVal, carriedPotency, tier3: o.section.includes('Tier 3'), readiness: isMito ? readiness : null, mitoTear, mitoHpAfter, mitoRisk, buildable, genuineLock, buildExoticsOk, buildCostText, buildFirst: build ? orgCount(e, o.organelle) === 0 : false, hasRNA, graftCost, graftCostText: graftCost ? fmtStock(graftCost) : null, rnaGraftCost, rnaGraftCostText: rnaGraftCost ? fmtStock(rnaGraftCost) : null, graftBuyable, rnaBuyable, expressable };
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
    locked: !canSeq || !affordSeq, affordable: affordSeq, available: canSeq,
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
  // The crab's DEEP DNA COUNTER: buy a RAW, un-decoded gene sample with matter — a shortcut to genes you
  // haven't hunted down yourself. The crab won't decode it; you carry the sample back to Yuki and sequence
  // it there into a permanent recipe (exactly the same carriedStrains → sequence_dna → discoveredSources
  // path a hunted mutant-drop takes). One entry per still-locked exotic you neither know nor already carry.
  const crabDnaOfferings = source === 'crab' ? OFFERINGS.filter(o =>
    o.organelle && o.requiresDiscovery &&
    !(world.discoveredSources || new Map()).has(o.requiresDiscovery) &&
    !(e.carriedStrains || new Map()).has(o.organelle)
  ).map(o => {
    const org = o.organelle;
    const base = o.cost || {};
    const dnaCost = { biomass: Math.max(18, Math.round((base.biomass || 12) * 1.6)), lipids: Math.max(4, Math.round((base.lipids || 0) + 4)) };
    const affordable = hasStock(e.cargo, dnaCost);
    const reasons = affordable ? [] : [`needs ${fmtStock(missingStock(e.cargo, dnaCost))}`];
    return {
      id: `buy_dna_${org}`, section: 'Tier 2D - Exotic traits (DNA)', theme: 'exotic', kind: 'dna',
      name: `DNA Sample: ${ORGANELLES[org].name}`,
      desc: `A raw ${ORGANELLES[org].name} gene dredged from the deep. Carry it up to Yuki and sequence it to unlock the recipe — the crab traffics in strands, it won't decode them for you.`,
      organelle: org, category: ORGANELLES[org].category || null,
      cost: dnaCost, costText: fmtStock(dnaCost),
      locked: !affordable, affordable, reasons,
      owned: false, maxed: false, undiscovered: true, potency: null, tier3: false, readiness: null
    };
  }) : [];
  return [...sequenceOfferings, ...crabDnaOfferings, ...staticOfferings, ...attachOfferings];
}

function missingStock(cargo, cost = {}) { const m = {}; for (const [k, v] of Object.entries(cost)) if (k !== 'oxygen' && (cargo[k] || 0) < v) m[k] = v - (cargo[k] || 0); return m; }

export function buyOffering(world, offeringId, entityId = world.playerId) {
  bumpCapsEpoch(); // external read/mutate entry point — never serve a stale caps() memo
  const entity = world.entities.find(x => x.id === entityId);
  if (!entity) return { ok: false, reason: 'missing entity' };
  // Crab deep-DNA counter: buy a RAW gene sample with matter. It lands in carriedStrains (a raw sample,
  // potency rolled like a mutant drop) and bumps the DNA tank — then you carry it to Yuki to sequence it
  // into a permanent recipe. The crab never decodes; it only sells strands.
  if (offeringId.startsWith('buy_dna_')) {
    const org = offeringId.slice('buy_dna_'.length);
    const def = ORGANELLES[org];
    if (!def) return { ok: false, reason: 'unknown gene' };
    if ((world.discoveredSources || new Map()).has(org)) return { ok: false, reason: 'already sequenced' };
    if ((entity.carriedStrains || new Map()).has(org)) return { ok: false, reason: 'already carrying that sample' };
    const offering = OFFERINGS.find(o => o.organelle === org);
    const base = offering?.cost || {};
    const dnaCost = { biomass: Math.max(18, Math.round((base.biomass || 12) * 1.6)), lipids: Math.max(4, Math.round((base.lipids || 0) + 4)) };
    if (!hasStock(entity.cargo, dnaCost)) return { ok: false, reason: `needs ${fmtStock(missingStock(entity.cargo, dnaCost))}` };
    subStock(entity.cargo, dnaCost);
    const potency = clamp(gaussian(world.rng, 1.0, 0.13), 0.5, 1.8);
    if (!entity.carriedStrains) entity.carriedStrains = new Map();
    entity.carriedStrains.set(org, potency);
    entity.cargo.dna = (entity.cargo.dna || 0) + 1;
    clampCargo(entity);
    world.events.push({ type: 'buy_dna', entityId, organelle: org, potency });
    return { ok: true, offeringId, organelle: org };
  }
  // Two-tier graft BUY at Yuki (the restored lipid store). A BARE graft grants the organelle only; a
  // GRAFT+RNA also teaches the somatic recipe (adds to knownRNA) so the cell can print more. Prices +
  // gates come straight from the authoritative projection so a client can't spoof a cost.
  if (offeringId.startsWith('buy_graft_') || offeringId.startsWith('buy_rna_')) {
    const withRNA = offeringId.startsWith('buy_rna_');
    const org = offeringId.slice((withRNA ? 'buy_rna_' : 'buy_graft_').length);
    if (!ORGANELLES[org]) return { ok: false, reason: 'unknown graft' };
    const proj = getYukiOfferings(world, entityId).find(o => o.organelle === org && o.kind === 'organelle');
    if (!proj) return { ok: false, reason: 'not available here' };
    if (proj.maxed) return { ok: false, reason: 'already grafted or maxed' };
    if (proj.genuineLock) return { ok: false, reason: (proj.reasons || []).join('; ') || 'locked' };
    const cost = withRNA ? proj.rnaGraftCost : proj.graftCost;
    if (!cost) return { ok: false, reason: 'not buyable' };
    if (!hasStock(entity.cargo, cost)) return { ok: false, reason: `needs ${fmtStock(missingStock(entity.cargo, cost))}` };
    subStock(entity.cargo, cost);
    entity.organelles[org] = (entity.organelles[org] || 0) + 1;
    entity._capsEpoch = -1;
    if (withRNA) { if (!entity.knownRNA) entity.knownRNA = new Set(); entity.knownRNA.add(org); }
    clampCargo(entity);
    world.events.push({ type: withRNA ? 'buy_rna' : 'buy_graft', entityId, organelle: org });
    return { ok: true, offeringId, organelle: org, withRNA };
  }
  // DNA rack EXPRESS: transcribe a known gene into a somatic RNA recipe (adds to knownRNA). Free of matter,
  // but needs a rack with room (2^n DNA capacity). This is the biomass-economy on-ramp — no lipids to Yuki.
  if (offeringId.startsWith('express_')) {
    const org = offeringId.slice('express_'.length);
    if (!ORGANELLES[org]) return { ok: false, reason: 'unknown gene' };
    if (!hasOrg(entity, 'dna_memory_vesicle')) return { ok: false, reason: 'need a DNA Memory Vesicle (rack)' };
    const offering = OFFERINGS.find(o => o.organelle === org && o.kind === 'organelle');
    if (!geneKnown(world, offering)) return { ok: false, reason: 'gene unknown — sequence it at Yuki first' };
    if (entity.knownRNA && entity.knownRNA.has(org)) return { ok: false, reason: 'recipe already expressed' };
    if (!entity.knownRNA) entity.knownRNA = new Set();
    entity.knownRNA.add(org);
    world.events.push({ type: 'express_rna', entityId, organelle: org });
    return { ok: true, offeringId, organelle: org };
  }
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
  // Manufacturing is the ONLY way to gain a Tier-2 organelle now — you grow it in-body from your own
  // matter (startManufacturing), never buy it finished. Reject the graft purchase BEFORE any charge so a
  // stray buy can't take payment and hand back nothing. Tier-3 sacraments (kind 'eucharist'/'colony', which
  // also carry an `organelle`) and companions/exchanges/sequencing are unaffected — they aren't kind:'organelle'.
  if (offering.kind === 'organelle') return { ok: false, reason: 'grow it in-body — tap the organ on your body graph' };
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
    // Only the Tier-3 sacraments (eucharist_archive / multicell_chassis) reach this branch now — plain
    // organs are grown in-body via manufacturing. No graft trauma: the mitochondrion is the only violent
    // graft in the game (see updateEucharistIncubation), and these giant sacraments are their own reward.
    entity.organelles[offering.organelle] = (entity.organelles[offering.organelle] || 0) + 1;
    entity._capsEpoch = -1; // organelles changed — force a caps() recompute
    if (offering.organelle === 'multicell_chassis') { entity.r += 8; entity.hp = Math.min(caps(entity).hp, entity.hp + 70); }
  }
  clampCargo(entity);
  world.events.push({ type: 'buy', entityId, offeringId });
  return { ok: true, offeringId };
}

// Undo a graft — free, no lipid refund (a body-management utility, not an economic transaction). Only
// guard rail: never let this be the removal that zeroes HP capacity (an instant, unrecoverable death) —
// every other "you're now stuck" scenario is recoverable, since removal happens AT Yuki, where you can
// simply re-buy in the same visit.
export function removeOrganelle(world, orgId, entityId = world.playerId) {
  bumpCapsEpoch();
  const entity = world.entities.find(x => x.id === entityId);
  if (!entity) return { ok: false, reason: 'missing entity' };
  const n = entity.organelles[orgId] || 0;
  if (n <= 0) return { ok: false, reason: 'not carried' };
  if (orgId === 'membrane' && n <= 1) return { ok: false, reason: 'cannot shed your last membrane' };
  if (n <= 1) delete entity.organelles[orgId]; else entity.organelles[orgId] = n - 1;
  entity._capsEpoch = -1;
  // Reclaim a share of the biomass this organ cost to build (its authored base cost, not Yuki's lipid
  // price) — capped by whatever room is left in the tank (possibly smaller now, e.g. after shedding a
  // membrane). No longer "free, no refund."
  const offering = OFFERINGS.find(o => o.organelle === orgId);
  const refund = (offering?.cost?.biomass || 0) * ORGAN_REMOVE_REFUND_FRAC;
  if (refund > 0) {
    const room = Math.max(0, caps(entity).biomass - (entity.cargo.biomass || 0));
    entity.cargo.biomass = (entity.cargo.biomass || 0) + Math.min(refund, room);
  }
  clampCargo(entity);
  entity.hp = clamp(entity.hp, 0, caps(entity).hp);
  world.events.push({ type: 'remove_organelle', entityId, organelle: orgId, biomassRefund: refund });
  return { ok: true, orgId };
}

export function getHudProjection(world, entityId = world.playerId) {
  bumpCapsEpoch(); // external read entry point — never serve a stale caps() memo
  const e = world.entities.find(x => x.id === entityId);
  if (!e) return null;
  const c = caps(e);
  const env = { oxygen: oxygenAt(e.y), light: shadedLightAt(world, e.y), pressure: pressureAt(e.y) };
  const readiness = hostReadiness(e, world);
  return {
    hp: { value: e.hp, max: c.hp, label: 'HP', layers: orgCount(e, 'membrane') },
    motorRamp: e.motorRamp || 0, // 0..1 basal-motor onramp (see applyPlayerCommands) — the DAG HUD reads this for a proportional, not boolean, active-draw spring
    // Gas is ONE bag (mechanics read total volume), fed by THREE production pipes tracked as a composition
    // split: o2 = real breathable oxygen (breathing/photosynthesis/photolysis/metabolic burns move this
    // specifically); the rest is inert offgas, itself split into n2 (clean fermentation lift-gas) and
    // toxinGas (the toxin-tainted share, scaled by how loaded the body's toxin tank is). n stays = the whole
    // inert portion for back-compat; n2 + toxinGas subdivide it. All derived, never separately stored.
    oxygen: { value: e.oxygen, max: c.oxygen, external: env.oxygen, tolerance: oxygenTolerance(e), label: 'O2',
      o2: clamp(e.oxygenO2 || 0, 0, e.oxygen),
      n: clamp(e.oxygen - (e.oxygenO2 || 0), 0, e.oxygen),
      toxinGas: clamp(e.oxygen - (e.oxygenO2 || 0), 0, e.oxygen) * clamp((e.cargo.toxins || 0) / Math.max(1, c.toxins), 0, 1) * 0.6,
      n2: clamp(e.oxygen - (e.oxygenO2 || 0), 0, e.oxygen) * (1 - clamp((e.cargo.toxins || 0) / Math.max(1, c.toxins), 0, 1) * 0.6) },
    depth: { value: Math.max(0, e.y - WORLD.canopy), max: WORLD.h - WORLD.canopy, zone: zoneName(e.y), light: env.light, externalOxygen: env.oxygen, photosynthetic: orgCount(e, 'photosystem') > 0 },
    pressure: { value: env.pressure, label: 'Pressure' },
    resources: RESOURCES.map(r => ({ id: r, label: r === 'energy' ? 'ATP' : r, value: e.cargo[r] || 0, max: c[r] ?? 99, color: COLORS[r] || '#fff' })),
    organelles: Object.entries(e.organelles).map(([id, count]) => ({ id, count, name: ORGANELLES[id]?.name || id, tier: ORGANELLES[id]?.tier || 1, action: ORGANELLES[id]?.action || null, desc: ORGANELLES[id]?.desc || '', category: ORGANELLES[id]?.category || null, graphRole: ORGAN_GRAPH_ROLE[id] || 'tune', rna: !!(e.knownRNA && e.knownRNA.has(id)) })),
    // Somatic RNA recipes this cell can print (does NOT cleave). loaded/cap track the DNA rack's 2^n room:
    // expressed recipes occupy rack slots, so the read shows how full the rack is.
    rna: { known: e.knownRNA ? [...e.knownRNA] : [], loaded: e.knownRNA ? e.knownRNA.size : 0, cap: c.dna, hasRack: hasOrg(e, 'dna_memory_vesicle') },
    graphStats: { caps: c, hpSource: 'Cell Membrane count × membrane HP + graph armor/chassis', storageSource: 'Storage Vacuole / Exotic Vesicle Rack / DNA Memory Vesicle counts' },
    metabolism: { anaerobicProcessorLevel: orgCount(e, 'anaerobic_processor'), anaerobicRate: orgCount(e, 'anaerobic_processor') * ORGANELLES.anaerobic_processor.stats.rate, energyStarved: (e.cargo.energy || 0) <= 0.01 },
    actions: getAvailableActions(world, entityId),
    nearYuki: nearYuki(world, e),
    nearCrab: nearCrab(world, e),
    ballast: (() => {
      // Trim = net vertical tendency, centered at 0.5: >0.5 buoyant (rising), <0.5 heavy (sinking).
      // Mirrors the SAME gas-vs-weight the submarine drift uses (gas is lift, biomass is weight; the
      // bladder's structural baseLift is excluded), so the gauge matches how the cell actually drifts.
      const flag = orgCount(e, 'flagella') * ORGANELLES.flagella.stats.lift * 0.18;
      const gasCap = caps(e).oxygen;
      const bladders = orgCount(e, 'oxygen_vacuole');
      const gasLift = (e.oxygen || 0) * ORGANELLES.oxygen_vacuole.stats.liftPerGas;
      const net = bladders > 0 ? (1.0 + gasLift + flag - biomassWeight(e)) : (buoyancy(e) + flag - biomassWeight(e));
      const gasFill = clamp((e.oxygen || 0) / Math.max(0.05, gasCap), 0, 1);
      // Target-seeking: W/S set gasTarget, the fermentation loop fills toward it (pressure-gated). The
      // HUD shows both the actual fill AND the target as a tick, so "am I there yet" reads at a glance.
      const target = e.gasTarget ?? gasCap;
      return { hasOrgan: hasOrg(e, BALLAST.requires), net, trim: clamp(0.5 + net / 12, 0, 1), gas: e.oxygen || 0, gasCap, gasFill, target, targetFill: clamp(target / Math.max(0.05, gasCap), 0, 1) };
    })(),
    // Solid ballast bricks — the repurposed word: dense drop-weight waste compacted on command by the
    // Waste Compactor, real cargo distinct from the gas bladder above. Uncapped by design (see
    // capsCompute) — no cap/fill to report, just the raw count. Jettison (T) drops these first.
    bricks: { value: e.cargo.ballast || 0 },
    // An in-progress waste-compaction pulse, normalized to a 0..1 "how hard is it pulling right now"
    // intensity (rate-at-elapsed divided by the curve's own peak rate) — the DAG HUD reads this directly
    // instead of re-deriving the Gaussian shape client-side.
    compacting: e.compacting ? { intensity: clamp(gaussianPulseRate(e.compacting.elapsed, e.compacting.duration, 1) / gaussianPulseRate(e.compacting.duration / 2, e.compacting.duration, 1), 0, 1) } : null,
    // An in-progress in-body build (Organ Manufacturing) — organelle is the target being grown, progress
    // is 0..1 = matter DEPOSITED so far / total (drives the shadow node's "under construction" grow-in),
    // intensity is how hard the matter pipe is flowing right now (drives the biomass/lipids edge pull); it
    // drops toward 0 when the build stalls for lack of matter.
    manufacturing: e.manufacturing ? {
      organelle: e.manufacturing.organelle,
      progress: clamp(((e.manufacturing.biomassDone || 0) + (e.manufacturing.lipidsDone || 0)) / Math.max(1e-6, e.manufacturing.biomassTotal + e.manufacturing.lipidsTotal), 0, 1),
      intensity: clamp(e.manufacturing.flow || 0, 0, 1),
    } : null,
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
  const light = lightAt(y), oxygen = oxygenAt(y);
  if (light > 0.80) return 'Sunlit water';
  if (light > 0.25) return oxygen < 0.50 ? 'Bright anaerobic water' : 'Fading light';
  if (light > 0.03) return 'Twilight water';
  if (light > 0.003) return 'Rupture dusk';
  return oxygen > 0.18 ? 'Respiring dark' : 'Ancestral black';
}

function objectiveText(world, e) {
  if (e.incubating) return 'The Eucharist is incubating inside you. Keep lipids and ATP in reserve, and don\'t let oxygen overload you.';
  if (!hasOrg(e, 'lipid_repair_loom')) return 'You are a young algal cell. Bask at the lit canopy to fatten on light, flood your ballast to dive, and rasp rival scavengers off the richest fields. Feeding makes ATP — every action spends it. Then carry your harvest to Yuki to graft real organs.';
  const lib = world.cellLibrary || [];
  if (!hasMito(e)) {
    if (lib.length > 0) return `Your second form. Shape a specialized body — your archived ${lib[lib.length - 1].label} waits at Yuki to be rejoined.`;
    return 'Make yourself worthy to host mitochondria: mend your membrane, graft exotic organs, sequence one strand of DNA, and reach the ocean floor. This gift cannot be bought.';
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
  bumpCapsEpoch(); // external read entry point — never serve a stale caps() memo
  const entityProjection = world.entities.map(e => ({ id: e.id, kind: e.kind, x: e.x, y: e.y, vx: e.vx, vy: e.vy, r: e.r, hp: e.hp, maxHp: caps(e).hp, color: e.color, controller: e.controller, trophicRole: e.trophicRole, cellCount: e.cellCount || 0, marchDir: e._marchDir || 0, strain: e.strain || null, bodyPlan: e.bodyPlan || null, companionType: e.companionType || null, ownerId: e.ownerId || null, marked: (e.marked || 0) > 0 ? e.marked : 0, warded: (e.warded || 0) > 0 ? e.warded : 0, ballast: !!e.ballast, sheltered: !!e.sheltered, photophobic: !!e.photophobic, friendly: e.friendly, phase: e.phase, feedIntent: e.feedIntent, repairIntent: e.repairIntent, action: e.action, organelles: { ...e.organelles }, hit: e.hit, combatHit: e.combatHit || 0, oxygen: e.oxygen, oxygenTolerance: oxygenTolerance(e), toxins: e.cargo.toxins || 0, toxinCap: caps(e).toxins, fallState: e.fallState, incubating: e.incubating ? { ...e.incubating } : null }));
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
    fields: world.fields.map(f => ({ id: f.id, resType: f.resType, x: f.x, y: f.y, radius: f.radius, oval: f.oval || 1, stock: { ...f.stock }, density: f.density, sourceKind: f.sourceKind, age: f.age, maxAge: f.maxAge })),
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

