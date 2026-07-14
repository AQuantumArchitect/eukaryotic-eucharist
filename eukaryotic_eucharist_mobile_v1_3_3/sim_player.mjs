// sim_player.mjs — a headless "policy-graph" player for Eukaryotic Eucharist.
//
// A substitute for a human player: it reads the same projections the UI reads and emits the same
// step() command object the keyboard/touch controls emit, so it exercises the REAL game loop with
// no special access. It is a finite policy graph over a progression build-order, competent enough
// to walk the intended arc — scavenger → escape the toxic canopy → feed the nursery → dive the
// rupture for exotics → first bite → sequence a genome → host-readiness → Mitochondrial Eucharist
// (the climax) → farm the monstrous deep (the falling action).
//
// Nodes: escape(O2) / forage / gather(exotics+DNA) / hunt / dive / ascend / survive(incubation) /
//        flee. Yuki shopping is modeled as a PAUSE (maybeShop, called by the driver before step),
// because the real game freezes the sim while the shop menu is open — so a fragile early cell isn't
// bled by surface O2 while it decides. Determinism: the player carries its own seeded PRNG.
//
// Driver contract each frame:
//   if (!player.maybeShop(world)) { const cmd = player.update(world, dt); K.step(world, cmd, dt); }
// maybeShop returns true on a frame it shopped (a paused frame — do NOT step or advance time).

import { WORLD } from './src/graph_kernel.mjs';

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

// Depth bands (below canopy). The canopy is O2-toxic to an un-adapted cell; the nursery is the
// safe forage zone; the rupture is where exotic particles + mutant prey live; the deep is endgame.
const SAFE_FORAGE_Y = WORLD.canopy + 850;           // ~1070 abs — O2-SAFE (external O2 below a starter's
                                                    // tolerance, so no slow O2 bleed while recharging);
                                                    // the eased move cost makes the climb from here ~18
                                                    // ATP, under the 24 cap. Only the brief climb touches
                                                    // the toxic O2 band. Never loiter shallower than ~780.
const O2_SAFE_DEPTH = 780;                          // above this depth the canopy O2 starts to poison
const RUPTURE_Y = WORLD.ruptureTop + 100;          // ~1800 abs — upper rupture: reachable exotics + mutants
const DEPTH_GATE = 2650;                            // hostReadiness depth term (below canopy)

export class PolicyPlayer {
  constructor(K, opts = {}) {
    this.K = K;
    this.rng = mulberry32((opts.seed || 1) >>> 0);
    this.skill = opts.skill ?? 1.0;              // 0.5 sloppy .. 1.0 competent .. 1.3 sharp
    this.think = 0;
    this.node = 'forage';
    this.targetId = null;
    this.wander = this.rng() * Math.PI * 2;
    this.lingerT = 0; this.lingerX = 0; this.lingerY = 0;
    this.shopArmed = false;                        // re-arm once we leave Yuki, so we don't re-burst
    this.log = []; this.milestones = {};
    this._seenDisc = 0;
    this._hadBite = false; this._hadMito = false; this._incub = false;
    this._deepKills = 0; this._kills = 0; this._buys = 0; this._sequences = 0;
  }

  mark(t, event, detail) {
    if (this.milestones[event] === undefined) this.milestones[event] = t;
    this.log.push({ t: +t.toFixed(1), event, detail });
  }

  // ---- world reads (through kernel helpers) ---------------------------------------------------
  _caps(e) { return this.K.__test.caps(e); }
  _dist(ax, ay, bx, by) { return this.K.__test.distWrap(ax, ay, bx, by); }
  _dx(ax, bx) { return this.K.__test.dxWrap(ax, bx); }
  _o2over(p) { return (p.oxygen || 0) - this.K.__test.oxygenTolerance(p); }
  // Ascending is now BUOYANCY-ASSISTED: with the trim-responsive ballast, fermented gas floats you up,
  // so the climb costs only a thrust trickle (measured ~5 ATP from depth 1200, vs the old ~26 full-thrust
  // estimate that stranded the bot below the climbable depth and blocked every Yuki visit).
  _climbCost(depth) { return Math.max(0, (depth - 180) * 0.006); }

  nearestField(world, p, maxD = 1100) {
    let best = null, bestScore = -Infinity;
    for (const f of world.fields) {
      const m = this.K.__test.totalMatter(f.stock);
      if (m < 5) continue;
      const d = this._dist(p.x, p.y, f.x, f.y);
      if (d > maxD) continue;
      const score = m / (d + 80);
      if (score > bestScore) { bestScore = score; best = f; }
    }
    return best;
  }

  // Nearest loose particle we can USE and store. kinds: exotics we're short on, and DNA if we have
  // a memory vesicle. Returns {particle, d} or null.
  nearestPickup(world, p, wantExotic, wantDna) {
    const c = this._caps(p);
    let best = null, bestD = Infinity;
    for (const pt of world.particles) {
      let useful = false;
      if (pt.kind === 'dna') { useful = wantDna && (c.dna || 0) - (p.cargo.dna || 0) > 0.5; }
      else if (pt.kind === 'spores' || pt.kind === 'enzymes' || pt.kind === 'crystals') {
        useful = wantExotic && (c[pt.kind] || 0) - (p.cargo[pt.kind] || 0) > 0.5;
      }
      if (!useful) continue;
      const d = this._dist(p.x, p.y, pt.x, pt.y);
      if (d < bestD) { bestD = d; best = pt; }
    }
    return best ? { particle: best, d: bestD } : null;
  }

  bestPrey(world, p, { maxD = 760, wantDna = false, deep = false } = {}) {
    const K = this.K, pr = p.r, pcap = this._caps(p);
    let best = null, bestScore = -Infinity;
    for (const e of world.entities) {
      if (!e.alive || e.id === p.id || e.kind !== 'npc' || e.friendly) continue;
      const deepCaste = e.controller === 'protozoan' || e.controller === 'metazoan' || e.controller === 'brood';
      if (deep && !deepCaste) continue;
      const d = this._dist(p.x, p.y, e.x, e.y);
      if (d > maxD) continue;
      const ecap = K.__test.caps(e);
      const wounded = e.hp < ecap.hp * 0.42;
      const smaller = e.r < pr * (1.12 + 0.10 * (this.skill - 1));
      if (!smaller && !wounded && !deep) continue;
      let score = (e.r / 26 + (e.cargo.biomass || 0) / 60);
      if (e.controller === 'algae') score += 0.6;                 // free food, no fight
      if (wounded) score *= 1.6;
      if (wantDna && e.strain) score += 2.6;
      if (deep && e.strain) score += 1.2;
      const risk = Math.max(0, (ecap.hp / Math.max(1, pcap.hp)) - 0.6) * (deep ? 0.4 : 1.1) / this.skill;
      score = score * (1 - Math.min(0.85, risk)) - d / 900;
      if (score > bestScore) { bestScore = score; best = e; }
    }
    return best;
  }

  nearestThreat(world, p) {
    const K = this.K, pcap = this._caps(p);
    let best = null, bestD = Infinity;
    for (const e of world.entities) {
      if (!e.alive || e.id === p.id || e.kind !== 'npc' || e.friendly) continue;
      if (e.controller === 'algae') continue;
      if (!K.__test.hasWeapon(e)) continue;
      const d = this._dist(p.x, p.y, e.x, e.y);
      const ecap = K.__test.caps(e);
      const scary = ecap.hp > pcap.hp * 0.7 || e.r > p.r * 0.9;
      if (!scary) continue;
      if (d < p.r + e.r + 240 && d < bestD) { bestD = d; best = e; }   // give room to break off before it strikes
    }
    return best;
  }

  // ---- progression: the build-order wishlist --------------------------------------------------
  wishlist(p) {
    const mito = this.K.hasMito(p);
    if (!mito) {
      return [
        { id: 'membrane', upTo: 2 },               // pure matter — HP FIRST, so a nursery predator doesn't one-shot us
        { id: 'membrane_intake', upTo: 2 },        // pure matter — faster feeding, bigger pickup radius
        { id: 'oxygen_vacuole', upTo: 3 },          // pure matter — host-organ readiness term (×3 ⇒ 0.75 > 0.66 gate) + ballast
        { id: 'membrane', upTo: 3 },               // more HP for the deep dives
        { id: 'anaerobic_processor', upTo: 3 },    // enzyme — ATP throughput (faster recharge)
        { id: 'dna_memory_vesicle', upTo: 3 },     // crystal — enable the DNA loop
        { id: 'storage_vacuole', upTo: 4 },        // crystal — carry matter for the sacrament
        { id: 'rasping_lamella', upTo: 1 },        // crystal+enzyme — a bite (hunt for DNA)
        { id: 'exotic_vacuole', upTo: 4 },          // spore — exotic capacity for the sacrament
        { id: 'flagella', upTo: 2 },               // spore — speed
        { id: 'mitochondrial_eucharist', upTo: 1 }, // THE CLIMAX
      ];
    }
    return [
      { id: 'membrane', upTo: 6 }, { id: 'storage_vacuole', upTo: 6 }, { id: 'anaerobic_processor', upTo: 5 },
      { id: 'atp_reservoir', upTo: 3 }, { id: 'lance_bristle', upTo: 3 }, { id: 'membrane_hardening', upTo: 3 },
      { id: 'mitochondrial_stack', upTo: 2 },
    ];
  }

  shopPlan(world, p) {
    const K = this.K;
    const byId = Object.fromEntries(K.getYukiOfferings(world).map(o => [o.id, o]));
    const buyable = []; let savingsGoal = null;
    for (const w of this.wishlist(p)) {
      const o = byId[w.id]; if (!o) continue;
      if (o.organelle && K.orgCount(p, o.organelle) >= w.upTo) continue;
      if (o.id === 'mitochondrial_eucharist' && K.hasMito(p)) continue;
      if (!o.locked) { buyable.push(o.id); continue; }
      const onlyMoney = o.reasons.length && o.reasons.every(r => r.startsWith('needs '));
      if (onlyMoney && !savingsGoal) savingsGoal = o;
    }
    const seq = byId['sequence_dna'];
    const hasSequence = seq && !seq.locked && ((p.carriedStrains && p.carriedStrains.size > 0) || (p.cargo.dna || 0) >= 3);
    return { buyable, savingsGoal, hasSequence };
  }

  wantShop(world, p) {
    const plan = this.shopPlan(world, p);
    const canRepair = p.hp < this._caps(p).hp * 0.6 && ((p.cargo.biomass || 0) + (p.cargo.lipids || 0)) >= 6;  // heal at Yuki (value-based)
    return plan.hasSequence || plan.buyable.length > 0 || canRepair;
  }

  // What exotics/DNA the player should currently be trying to gather (for the next locked purchase).
  gatherNeeds(world, p) {
    const K = this.K, c = this._caps(p);
    const need = { spores: false, enzymes: false, crystals: false, dna: false };
    // DNA: want to carry some to sequence (once we have storage) and we still lack a genome or want more
    if ((c.dna || 0) - (p.cargo.dna || 0) > 0.5) need.dna = true;
    // exotics: look at the first few locked wishlist items and the sacrament, tally missing exotic keys
    const byId = Object.fromEntries(K.getYukiOfferings(world).map(o => [o.id, o]));
    for (const w of this.wishlist(p)) {
      const o = byId[w.id]; if (!o || !o.cost) continue;
      if (o.organelle && K.orgCount(p, o.organelle) >= w.upTo) continue;
      for (const k of ['spores', 'enzymes', 'crystals']) {
        if ((o.cost[k] || 0) > (p.cargo[k] || 0) && (c[k] || 0) - (p.cargo[k] || 0) > 0.5) need[k] = true;
      }
    }
    return need;
  }

  anyGatherNeed(need) { return need.spores || need.enzymes || need.crystals || need.dna; }

  // ---- shop as a PAUSE (driver calls this before step) ----------------------------------------
  maybeShop(world) {
    const K = this.K;
    const p = K.getPlayer(world);
    if (!p || !p.alive) return false;
    if (!K.nearYuki(world, p)) { this.shopArmed = true; this._conv = 0; return false; }
    if (!this.shopArmed) return false;              // already shopped this visit; leave before re-arming
    if (!this.wantShop(world, p)) return false;
    // One paused visit: heal, buy/sequence everything we can, top up lipids/ATP, detox if choking.
    let actions = 0;
    for (let g = 0; g < 8; g++) {                                  // Repair Communion (value-based) — heal
      if (p.hp >= this._caps(p).hp * 0.92) break;
      if (!K.buyOffering(world, 'repair').ok) break;               // fails cleanly when matter runs out
      actions++;
    }
    for (let guard = 0; guard < 24; guard++) {
      if (!this.doShop(world, p)) break;
      actions++;
    }
    // Top up just enough ATP to dive back out of the toxic O2 band (Yuki sells charge for matter).
    // Keep it lean — over-buying charge burns the biomass we need for organs. ~10 ATP covers the
    // descent to the safe band with margin.
    for (let g = 0; g < 4; g++) {
      if ((p.cargo.energy || 0) >= 12) break;
      if ((p.cargo.biomass || 0) < 8) break;   // keep a biomass buffer for organs (value-based charge)
      if (!K.buyOffering(world, 'buy_energy').ok) break;
      actions++;
    }
    if (this._o2over(p) > 0.05) K.buyOffering(world, 'detox');   // vent surface O2 before diving off
    this.shopArmed = false;
    if (actions > 0) { this.node = 'dive'; return true; }        // paused frame — driver skips step
    return false;
  }

  doShop(world, p) {
    const K = this.K;
    const plan = this.shopPlan(world, p);
    if (plan.hasSequence) {
      const before = world.discoveredSources.size;
      if (K.buyOffering(world, 'sequence_dna').ok) { this._sequences++; this.mark(world.t, 'sequence', `+${world.discoveredSources.size - before} genome`); return true; }
    }
    if (plan.buyable.length) {
      const id = plan.buyable[0];
      if (K.buyOffering(world, id).ok) {
        this._buys++; this.mark(world.t, 'buy', id);
        if (id === 'mitochondrial_eucharist') this.mark(world.t, 'eucharist_begin', 'incubating');
        return true;
      }
    }
    // Exchange-aware: convert toward the next locked organ's recipe at Yuki. Lipids are often the
    // player's main currency, so a lipid-rich / biomass-short cell renders Lipids→Biomass to afford
    // an organ (and vice-versa). Only for a MATTER shortfall — an exotic-gated organ needs a dive, not
    // a trade. Sized to keep enough of each for the recipe, and the maybeShop loop repeats until it clears.
    const goal = plan.savingsGoal;
    if (goal && goal.cost && (goal.cost.biomass || goal.cost.lipids) && (this._conv || 0) < 3) {
      const bioShort = (goal.cost.biomass || 0) - (p.cargo.biomass || 0);
      const lipShort = (goal.cost.lipids || 0) - (p.cargo.lipids || 0);
      // Only convert when the OTHER resource already covers the recipe — never rob what we still need.
      if (bioShort > 0.5 && lipShort <= 0 && (p.cargo.lipids || 0) >= (goal.cost.lipids || 0) + 8 && (p.cargo.energy || 0) > 3) {
        if (K.buyOffering(world, 'buy_biomass').ok) { this._conv = (this._conv || 0) + 1; return true; }  // Render Lipids→Biomass
      }
      if (lipShort > 0.5 && bioShort <= 0 && (p.cargo.biomass || 0) >= (goal.cost.biomass || 0) + 6 && (p.cargo.energy || 0) > 3) {
        if (K.buyOffering(world, 'buy_lipids').ok) { this._conv = (this._conv || 0) + 1; return true; }  // Condense Lipids
      }
    }
    return false;
  }

  // ---- main policy ----------------------------------------------------------------------------
  update(world, dt) {
    const K = this.K;
    const p = K.getPlayer(world);
    if (!p || !p.alive) return {};
    const t = world.t, c = this._caps(p);
    const hpFrac = p.hp / Math.max(1, c.hp);
    const atp = p.cargo.energy || 0, atpFrac = atp / Math.max(1, c.energy);
    const depth = p.y - WORLD.canopy;
    const mito = K.hasMito(p), incub = !!p.incubating;
    const hasBite = K.__test.hasRasp(p) || K.__test.hasWeapon(p);

    if (!this._hadBite && hasBite) { this._hadBite = true; this.mark(t, 'first_bite'); }
    if (!this._hadMito && mito) { this._hadMito = true; this.mark(t, 'mitochondria', 'CLIMAX'); }
    if (!this._incub && incub) { this._incub = true; }
    if (world.discoveredSources.size > this._seenDisc) { this._seenDisc = world.discoveredSources.size; if (!this.milestones.first_genome) this.mark(t, 'first_genome'); }

    this.think -= dt; if (this.lingerT > 0) this.lingerT -= dt;

    if (this.think <= 0) {
      this.think = 0.20 + this.rng() * 0.10;
      const threat = this.nearestThreat(world, p);
      const needDepth = (p.maxDepth || 0) < DEPTH_GATE;
      const needGenome = world.discoveredSources.size < 1;
      const need = this.gatherNeeds(world, p);
      const o2bad = this._o2over(p) > 0.02;
      const atNyuki = K.nearYuki(world, p);
      const canTravel = atpFrac > 0.10 || atNyuki;               // enough charge to swim home
      const ws = this.wantShop(world, p);

      if (threat && (hpFrac < 0.55 || this._dist(p.x, p.y, threat.x, threat.y) < p.r + threat.r + 55)) {
        this.node = 'flee'; this.targetId = threat.id;             // only break off when actually wounded or overlapping — the nursery is hostile now (allegiance), constant fleeing = a death-spiral of no feeding
      } else if (this.node === 'gather' && (need.spores || need.enzymes || need.crystals) &&
                 hpFrac > 0.45 && atp > 2 && !atNyuki && depth < 3200) {
        this.node = 'gather';                                      // STAY committed to the dive — don't let
                                                                   // recharge/shop yo-yo abort it before we
                                                                   // reach the exotics (only flee preempts)
      } else if (ws && atNyuki) {
        this.node = 'shop';                                      // maybeShop handles the paused burst
      } else if (!atNyuki && (K.orgCount(p, "membrane") + K.orgCount(p, "membrane_intake")) >= 3 &&
                 hpFrac > 0.5 && atpFrac > 0.2 && (need.spores || need.enzymes || need.crystals)) {
        // THE SHALLOW→DEEP TRANSITION (rising action): with even a starter body + a bite, commit to a
        // gather dive for the exotics that gate the ENTIRE mid-game (processors, storage, sacrament)
        // OVER grinding shallow pure-matter organs the tight economy can barely afford. The old
        // membrane≥2 + atpFrac>0.28 gate was unreachable in the hostile nursery, so the arc flatlined.
        this.node = 'gather'; this.targetId = null;
      } else if (ws && (atp >= this._climbCost(depth) + 4 || depth < 320)) {
        this.node = 'ascend';                                    // COMMITTED climb — checked before escape,
                                                                 // so passing through the O2 band en route
                                                                 // to Yuki doesn't abort the ascent
      } else if (o2bad && depth < O2_SAFE_DEPTH && !atNyuki) {
        this.node = 'escape';                                    // dip back below the toxic canopy
      } else if (atpFrac < 0.06 && !atNyuki) {
        this.node = 'forage';                                    // truly stranded — must feed to move
      } else if (incub) {
        this.node = 'survive';
      } else if (ws) {
        this.node = 'recharge';                                  // ferment the climb reserve, THEN climb
      } else if (mito) {
        const prey = this.bestPrey(world, p, { maxD: 850, deep: depth > 2400 });
        if (prey && depth > 1900) { this.node = 'hunt'; this.targetId = prey.id; }
        else this.node = 'dive';                                 // endgame: farm the deep
      } else {
        // Pre-mito, nothing to buy right now → bank matter (forage) as the default. Make a targeted
        // exotic/DNA dip only when already matter-rich, and only push the depth gate once we have a
        // real body (bite + armor) and full health, so the deep push isn't a suicide run.
        // Fit enough to brave the rupture (exotics/DNA/depth all live below the safe band). This is
        // the intended rise in danger: once the shallow build is stable, the player MUST venture deep.
        const diveFit = hpFrac > 0.55 && atpFrac > 0.28 && K.orgCount(p, "membrane") + K.orgCount(p, "membrane_intake") >= 2;
        let chose = null;
        if (hasBite) {
          const prey = this.bestPrey(world, p, { maxD: 620, wantDna: needGenome });
          if (prey) { this.node = 'hunt'; this.targetId = prey.id; chose = 'hunt'; }
        }
        if (!chose) {
          if (this.anyGatherNeed(need) && diveFit) { this.node = 'gather'; this.targetId = null; }
          else if (needDepth && diveFit) this.node = 'dive';
          else this.node = 'forage';
        }
      }
    }

    let mx = 0, my = 0, aimX = 0, aimY = 0;
    const cmd = {};
    const target = this.targetId ? world.entities.find(e => e.id === this.targetId) : null;
    const steerTo = (x, y, gain = 1) => { const dx = this._dx(p.x, x), dy = y - p.y, n = Math.hypot(dx, dy) || 1; mx = dx / n * gain; my = dy / n * gain; return n; };

    switch (this.node) {
      case 'flee': {
        // Evade the threat horizontally, but NEVER flee up into the toxic O2 ceiling — hold the
        // O2-safe nursery band. (A fragile early cell that flees up just trades a predator for O2 death.)
        const th = target && target.alive ? target : this.nearestThreat(world, p);
        if (th) { const dx = this._dx(th.x, p.x), dy = p.y - th.y, n = Math.hypot(dx, dy) || 1; mx = dx / n; my = dy / n * 0.4; }
        if (depth < O2_SAFE_DEPTH + 80) my = clamp(my + 0.7, -1, 1);   // stay out of the O2 band
        if (depth > 1600) my = clamp(my - 0.6, -1, 1);                 // and out of the deep
        if (K.hasOrg(p, 'dash_vacuole') && atp >= 8) cmd.dash = true;
        break;
      }
      case 'escape': { my = depth > 900 ? 0 : 1; mx = Math.cos(this.wander) * 0.25; this.wander += (this.rng() - 0.5) * 0.5; break; }
      case 'forage': {
        // Bank matter in the O2-SAFE nursery band. Never chase food up into the toxic canopy O2, nor
        // sink into the deep. A short hop home to spend beats a fat field two zones away.
        let f = this.nearestField(world, p, 1200);
        if (f) { const fd = f.y - WORLD.canopy; if (fd < O2_SAFE_DEPTH || fd > 1750) f = null; }
        if (f) { const d = steerTo(f.x, f.y); if (d < feedR(p) + f.radius + 10) { cmd.feed = true; mx *= 0.1; my *= 0.1; } }
        else { mx = Math.cos(this.wander) * 0.5; this.wander += (this.rng() - 0.5) * 0.6; my = clamp(Math.sign(SAFE_FORAGE_Y - p.y) * 0.6, -1, 1); }
        if (depth < O2_SAFE_DEPTH) my = clamp(my + 0.7, -1, 1);          // dive out of the O2 band
        if (depth > 1500) my = clamp(my - 0.5, -1, 1);                   // don't sink into the deep
        if (atpFrac < 0.1) { mx *= 0.35; my *= 0.35; }
        break;
      }
      case 'gather': {
        const need = this.gatherNeeds(world, p);
        const pick = this.nearestPickup(world, p, (need.spores || need.enzymes || need.crystals), need.dna);
        if (pick && pick.d < 1500) { steerTo(pick.particle.x, pick.particle.y); }
        else { mx = Math.cos(this.wander) * 0.55; this.wander += (this.rng() - 0.5) * 0.6; my = clamp(Math.sign(RUPTURE_Y - p.y) * 0.6, -1, 1); }
        if ((p.y - WORLD.canopy) > 2450) my = clamp(my - 0.6, -1, 1);    // don't sink past the rupture floor
        // opportunistic feeding while gathering, if a field is right here
        const f = this.nearestField(world, p, 260); if (f && this._dist(p.x, p.y, f.x, f.y) < feedR(p) + f.radius + 8) cmd.feed = true;
        break;
      }
      case 'recharge': {
        // Sit on a field and ferment stored biomass into an ATP reserve for the climb. Fermentation
        // ticks while still (upkeep is tiny), so even off-field we just hold and let ATP rise.
        // Commit to the nearest safe-band field and SIT on it, fermenting the climb reserve. Sitting
        // still maximizes regen (no move drain); only trend to the top of the band when there's no
        // field to sit on. Skip fields too deep (the climb after would be unaffordable).
        let f = this.nearestField(world, p, 1400);
        if (f) { const fd = f.y - WORLD.canopy; if (fd < O2_SAFE_DEPTH || fd > 1350) f = null; }
        if (f) {
          const d = steerTo(f.x, f.y, 1);
          if (d < feedR(p) + f.radius + 10) { cmd.feed = true; mx = 0; my = 0; }   // sit and ferment
        } else {
          mx = 0; my = clamp(Math.sign((WORLD.canopy + O2_SAFE_DEPTH + 40) - p.y) * 0.45, -1, 1);
        }
        break;
      }
      case 'ascend': { steerTo(WORLD.w / 2, WORLD.canopy + 40); my = -1; if (K.hasOrg(p, 'dash_vacuole') && atp >= 8 && p.y - WORLD.canopy > 500) cmd.dash = true; break; }
      case 'shop': { my = -0.1; break; }              // hold near Yuki; maybeShop does the buying
      case 'survive': {
        steerTo(WORLD.w / 2, SAFE_FORAGE_Y, 0.4);
        const f = this.nearestField(world, p, 800);
        if (f) { const d = steerTo(f.x, f.y, 0.7); if (d < feedR(p) + f.radius + 8) cmd.feed = true; }
        const th = this.nearestThreat(world, p); if (th) { const dx = this._dx(th.x, p.x); mx += Math.sign(dx) * 0.6; }
        break;
      }
      case 'dive': {
        my = 1; mx = Math.cos(this.wander) * 0.3; this.wander += (this.rng() - 0.5) * 0.5;
        if (hasBite) { const prey = this.bestPrey(world, p, { maxD: 380, deep: depth > 2400 }); if (prey) { this.targetId = prey.id; this.node = 'hunt'; } }
        break;
      }
      case 'hunt': {
        if (!target || !target.alive) { if (target && !target.alive) this._onKill(world, p, target); this.targetId = null; this.node = mito ? 'dive' : 'forage'; break; }
        const dx = this._dx(p.x, target.x), dy = target.y - p.y, n = Math.hypot(dx, dy) || 1, d = this._dist(p.x, p.y, target.x, target.y);
        aimX = dx; aimY = dy;
        if (d < p.r + target.r + 14) { if (K.__test.hasRasp(p)) cmd.rasp = true; mx = dx / n * 0.5; my = dy / n * 0.5; }
        else { mx = dx / n; my = dy / n; if (K.hasOrg(p, 'dash_vacuole') && atp >= 8 && d < 220) cmd.dash = true; }
        if (K.hasOrg(p, 'toxin_launcher') && (p.cargo.toxins || 0) > 8 && d < 260) cmd.acid = true;
        break;
      }
    }

    if (this.lingerT > 0) { const dx = this._dx(p.x, this.lingerX), dy = this.lingerY - p.y, n = Math.hypot(dx, dy) || 1; if (n > 30) { mx = dx / n * 0.6; my = dy / n * 0.6; } cmd.feed = true; }

    cmd.moveX = clamp(mx, -1, 1); cmd.moveY = clamp(my, -1, 1);
    if (aimX || aimY) { cmd.aimX = aimX; cmd.aimY = aimY; }
    return cmd;
  }

  _onKill(world, p, target) {
    this._kills++;
    if (target.controller === 'protozoan' || target.controller === 'metazoan' || target.controller === 'brood') this._deepKills++;
    this.lingerT = 1.0; this.lingerX = target.x; this.lingerY = target.y;
    if (!this.milestones.first_kill) this.mark(world.t, 'first_kill', target.controller);
    if (this._deepKills === 1) this.mark(world.t, 'first_deep_kill');
    if (this._deepKills === 12) this.mark(world.t, 'deep_farm_established');
  }
}

function feedR(p) { return Math.max(p.r + 22, p.r * 1.4); }
