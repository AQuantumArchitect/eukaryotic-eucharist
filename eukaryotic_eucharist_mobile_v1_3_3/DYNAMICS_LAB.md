# Dynamics lab

`dynamics_lab.mjs` is an equation-free analysis harness for the player-free ecosystem. It estimates the aggregate flow of the existing simulation; it does not introduce balancing rules or substitute a toy model.

```powershell
node dynamics_lab.mjs 2 3 0.05
node dynamics_lab.mjs 8 5 0.0166666667 dynamics_lab_result.json
```

It reports four complementary views:

- **Aggregate drift** — finite-difference estimates of biomass, field matter, populations, and predator reproductive heat per minute.
- **Quasi-equilibrium candidate** — the sampled time with the smallest normalized multi-variable drift. This is a candidate state for mature world seeding, not a claim of global stability.
- **Local sensitivity probes** — small +5% algae-biomass / field-matter displacements and a +0.08 predator-heat displacement. Comparing their ensemble outcomes estimates the local response without hard-coded ecosystem targets.
- **Peak and trough events** — prominence-filtered predator population extrema plus fission counts. Long runs are needed to characterize irregular outbreaks.

The default `.05` timestep is for exploratory sweeps. Confirm any tuning decision at `1/60`, and use enough seeds to make a conclusion about the distribution rather than one dramatic run.

## Continuous parameter screen

`ecology_experiments.mjs` compares small, seeded perturbations of the kernel's
continuous ecology gains. It scores low aggregate drift, bounded populations,
algae phase diversity, and a small capped reward for observed fission pulses.
The reward is diagnostic only: it prevents a search from selecting a sterile
world merely because it is quiet.

```powershell
node ecology_experiments.mjs 1 1 0.05
node ecology_experiments.mjs 1 3 0.0166666667 baseline baseline_60hz.json
```

The exposed `DEFAULT_ECOLOGY_TUNING` fields are photosynthetic conversion,
light-driven algal venting, scavenger response to detritus and hunters, nursery
slurry amplitude, and predator reproductive-heat gain/decay. They preserve the
default game exactly unless supplied to `createEcologyWorld` or `createWorld`.
# Algae regime fitter

`node fit_algae_regime.mjs 90 3 .05 fitted_regime.json` samples the live kernel rather than a surrogate model. It fits a serializable `ecologyRegime` from aggregate producer mass, count, structural/depth distribution, trait spread, and cycle-period distribution. Pass the resulting `ecologyRegime` to `createEcologyWorld` or `createWorld` to reproduce the aggregate regime while still sampling a different individual realization.
