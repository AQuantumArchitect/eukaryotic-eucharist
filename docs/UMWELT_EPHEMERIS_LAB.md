# Umwelt ephemeris ecology lab

Branch: `research/umwelt-ephemeris`

## What was built

The ecology now has a small serializable belief model rather than a hidden seasonal clock. Once per second it observes prey, carrion, producer mass, hunter population/energy/heat, predator flux, wound shedding, deep-bloom births, fissions, and immigration/emigration.

- Continuous signals use alpha-beta level and velocity beliefs.
- A forecast earns influence only when its rolling error beats a persistence forecast.
- Exact ecological events are horizon-zero evidence and decay into a short scent-memory.
- The resulting bounded driver modulates predator immigration demand and already-earned fission hazard. It cannot bypass local gorge, heat, health, or energy physiology.
- The former sine season remains available only as `ecologyEphemerisMode: 'harmonic'` for A/B experiments. Production defaults to `belief`.

This is deliberately a weak shared Umwelt, not an authored director. Most aggregate forecasts do not beat persistence and therefore receive zero authority. Irregular outbreaks are primarily coupled to real rupture, birth, migration, and fission events.

## Supporting ecology corrections

The lab exposed several initial-condition and feedback errors that were larger than the ephemeris effect:

- The initial scavenger and hunter populations exceeded their supported standing pools.
- The old seed preloaded roughly 6,000 loose biomass and half of a crab-summoning whale fall, forcing an opening collapse.
- Linear scavenger demand treated a mature lipid ocean as unlimited population demand.
- Fat grazers targeted the largest merged field and moved as a sheet.
- Deep blooms spawned with 140–260 loose biomass in addition to their structural body, making the opening a compulsory shedding event.
- Photosynthetic gas production pushed ordinary algae against the exact storage clamp.

The fitted `ecologyRegime` now serializes founder counts, algae size/health/phase/trait distributions, deep-bloom reserves, and field reservoirs. Scavenger demand uses a saturating detritus response. Grazer field value saturates per patch and its global lipid-gradient pull blends continuously with nearby food. Photosynthetic gas production now falls smoothly with bladder headroom.

Small algae are sampled from a continuous shallow-biased age/phase distribution with balanced rising and sinking signs; rarer veterans sample the full orbit. No `fallState` or phase bucket controls motion.

## Final 60 Hz result

Command:

```text
node sim_eval.mjs 6.667 0 3 0.0166666667
```

Three shared seeds, t=0 versus t=400 seconds:

| Measure | t=0 | t=400 | Change |
|---|---:|---:|---:|
| Algae count | 82.0 | 86.3 | +5.0% |
| Scavenger count | 30.7 | 33.7 | +8.9% |
| Total producer mass | 6297 | 6711 | +6.2% |
| Mean algae depth | 852 px | 845 px | -0.8% |
| Field matter | 17669 | 16473 | -7.3% |
| Mean algae health | 65.8% | 68.1% | +2.3 points |

Algae motion and guardrails:

- Median physical bob period: 57 seconds.
- Median physical bob amplitude: 302 px.
- Latent phase entropy: 0.98.
- Maximum shared vertical direction: 48.7%.
- Size-to-depth correlation: +0.65.
- Emergency-limit algae-time: 0.19% (previously 66.8%).
- All 222 eligible tracked algae completed a return; 789 cycles were observed.

Consumers and outbreaks:

- Scavengers and all three hunter lineages persisted.
- Across the three worlds there were 36 predator, 60 protozoan, and 31 metazoan fissions.
- The single-seed coarse lab produced a hunter range of 8–21 and 57 fissions; the same seed at 60 Hz produced 7–15 and 40 fissions. Coarse stepping is valid for candidate rejection and gradients, but it overstates outbreak amplitude and must not be used as the final balance oracle.

All automated acceptance checks passed at 60 Hz.

## Reusable commands

```text
npm run test:ephemeris
npm run ephemeris -- 90 3 0.05
npm run ephemeris:events -- 90 3 0.05
node sim_eval.mjs 6.667 0 3 0.05
node sim_eval.mjs 6.667 0 3 0.0166666667
npm run smoke
```

The ephemeris lab accepts `EPHEMERIS_MODES`, `EPHEMERIS_HORIZON`, `EPHEMERIS_GAIN`, `EPHEMERIS_FISSION_GAIN`, `EPHEMERIS_EVENT_GAIN`, `ECOLOGY_REGIME_JSON`, and `ECOLOGY_PARAMS_JSON` environment overrides.

## Next promising experiments

1. Ancient giants are still rare at t=400 (about 0.3 per world) even though six deep giant ruptures occurred across the ensemble. Preserve a larger standing veteran tail by fitting survival/repair and scavenger pounce pressure, not by adding a giant quota.
2. Coarse stepping creates stronger outbreaks than 60 Hz. Express contact/fission opportunity in cadence-stable hazards before trusting coarse amplitude optimization.
3. Aggregate level/velocity forecasts usually lose to persistence. Add spatial or lineage-local beliefs before increasing global forecast gain; a stronger unskilled global forecaster would just be another disguised director.
4. The field count roughly doubles while field matter remains centered. A later performance pass can fit merge/diffusion scale without changing matter or population targets.
5. Run manual playtests for visual independence, perceived giant depth, and whether event-coupled predator outbreaks leave readable opportunities for the player.
