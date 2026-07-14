# Design Constitution v1.2.1 Amendment

## Soft body contact

Cells are not rigid collision objects. They may overlap in the same slurry. Overlap is not a wall; it is a graph signal used by organs.

- No default contact damage.
- No default collision separation.
- Rasping Lamella damages according to overlap while active.
- Lance Bristle damages according to reach, facing, overlap/proximity, and movement speed.
- Predators are dangerous because their organ graph contains weapons, not because their body type is hard-coded as hostile.

## Fermentation Matrix

Fermentation is not a video-game upgrade multiplier. It is an organelle flow.

Each Fermentation Matrix performs the same transformation:

```text
biomass -> ATP + toxin waste
```

The flow rate scales with biomass fullness. A full biomass tank gives strong ATP production; an empty tank gives almost none. More matrices add more throughput.

## ATP gate

ATP is the foundational cellular energy token. If ATP is empty, the cell cannot move, feed, repair, dash, rasp, launch toxin, or cloud. If ATP and biomass are both empty, the body collapses.

## Reset and death

Two different development controls exist:

- Self-lysis preserves the world and turns the current body into a corpse bloom.
- Full reset regenerates a mature initial ecology.

## Algal fall pump

Sinking algae must reach the rupture layer. Their fall is not decorative; it is the primary food pump for Tier 1 scavenger play.
