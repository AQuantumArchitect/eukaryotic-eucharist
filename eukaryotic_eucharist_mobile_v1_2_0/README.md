# Eukaryotic Eucharist Mobile v1.2.0

This branch keeps the v1.0 oxygen/depth ecology and v1.1 organelle economy, then corrects the combat, storage, ATP, and exchange rules.

## Run

```bash
npm start
```

Open `http://localhost:8787`.

## Smoke test

```bash
npm run smoke
```

## v1.2.0 changes

- Renamed **Toxin Sac** to **Toxic Launcher**.
- Reworked Toxic Launcher into a gun-like organ that fires toxic projectiles and creates damaging chemical hazards, not edible toxin resource fields.
- Increased Rasping Lamella damage by 12x.
- Increased Lance Bristle damage and made it scale with movement speed.
- Added right-click feeding alongside `F`.
- Reduced default biomass and lipid storage dramatically.
- Added hard ATP gating: no ATP means no movement, feeding, repair, dash, rasp, launcher, or cloud actions.
- No ATP plus no biomass kills the body.
- Removed vacuoles as a collectible resource; vacuoles remain only as organelles/structures.
- Made spores, enzymes, and crystals more visually distinct.
- Reworked fermentation as organelle flow: every starter body has one Fermentation Matrix; each additional matrix adds another identical biomass-to-ATP/toxin flow.
- Added Toxic Launchers and Lance Bristles to some deeper predators.
- Compressed arena width to make the ecology less empty.
- Reworked Yuki Tier 1 exchanges so each button outputs one resource/service type, with color-coded exchange cards.

## Control notes

- `WASD` / joystick: swim, only while ATP is available.
- `F` or right-click: feed fields, only while ATP is available.
- `R`: Rasping Lamella, if grafted.
- `X` or left-click: Toxic Launcher, if grafted.
- `V`: Toxin Cloud, if grafted.
- `Q`: Lipid Repair Loom, if grafted.
- `E`: toggle Yuki chamber near the canopy.
