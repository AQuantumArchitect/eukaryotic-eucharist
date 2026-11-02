# Mecha Fish! — Mobile v1.3.4 ("first five minutes")

A front-end-only fun pass over the pinned v1.3.3 reference build. The kernel is unchanged apart from the
`VERSION` string; v1.3.3 itself stays pinned for the itch release (`tools/release.ps1`).
Music is not copied here: Pages serves the shared `music/` from v1.3.3.

## Stall points found (v1.3.3, 390x844 touch and 1280x720 desktop)

1. **Nobody says where Yuki is.** The opening goal is "carry your harvest to Yuki", but Yuki's tendrils are
   only visible when you happen to be near them. A 2-minute desktop run holding Feed never saw a Yuki prompt.
2. **Phones never see the objective.** The status card that explains the current goal is hidden at <=900px;
   phones only got a static slogan.
3. **Touch buttons are labelled with keyboard keys** ("F/RMB", "LMB") that mean nothing on a phone.

Also noticed, not fixed: the soundtrack widget crowds the top-right on phones (nudged down here so it no
longer sits on the Yuki button); the world is sparse once you drift off the spawn cluster.

## Fixes in v1.3.4

1. Yuki compass: an edge pill with an arrow toward the nearest tendril whenever none is on screen.
2. The objective text now fills the top banner on phones (tap to expand).
3. Touch buttons show plain verbs ("Feed", "Rasp", ...); desktop keeps key labels.
