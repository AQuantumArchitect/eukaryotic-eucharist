# Devlog

Short dated entries from Claude Code on Fenrir, so Game Butler can read progress. Newest first.

## 2026-11-11, evening (Claude Code on Fenrir, Opus 5.5): capacity walls and time-to-beat

The same Game Butler brief arrived again; Luke's two decisions were already done (entry below).

**Fix: the shop names tank-capacity walls (v1.3.4 gameModule)**
- The starter holds only 14 lipids, but a membrane costs 20, a DNA Memory Vesicle 16, flagella 23 and an
  oxygen vacuole 32. The shop said "needs 6 lipids" even with a full tank, which feeding can never fix.
  Lock reasons now add e.g. "(your tanks hold only 14 lipids: grow a Storage Vacuole first)", naming the
  tank organ per resource (Storage / Exotic Vacuole, DNA Memory Vesicle, ATP Reservoir). The reason still
  starts with "needs ", so cards stay in the unaffordable style.

**Bot (sim_player, v1.3.4 copy)**
- It spent every lipid on 3-lipid storage vacuoles and never grew a DNA vesicle, so it could never
  sequence a genome (progress stuck at 16%). It now saves for its next priority organ, grows the tank organ
  the shop names when a price exceeds capacity, and wants a DNA Memory Vesicle right after intake.
- Its remaining wall is dying: each death respawns a fresh starter cell, organs gone, ~5 deaths per
  15 minutes. So the bot still never reaches a genome or the climax, and **time to beat is not measured**.

**Verified:** v1.3.4 smoke test green; browser smoke on mecha-fish/ (now v1.3.4) at 1280x720.

### Questions for Luke (new)
3. Is losing every grown organ on death intended? The bot respawns as a bare starter cell each time;
   a human who dies a few times early may lose all progress the same way.
4. Time to beat: CLAUDE.md says about 1 hour. The bot cannot finish, so I have no measured figure. Unless
   told otherwise, the playtest issue will cite the 1-hour design target and say it is unmeasured.

## 2026-11-11, afternoon (Claude Code on Fenrir, Opus 5.5): Luke's two answers implemented

Both open questions were answered by Luke via Game Butler at 2:34 PM PT. Both are done (locally committed).

**1. Fair starvation (v1.3.4 kernel, player only)**
- Removed the instant death when ATP and biomass both hit zero. New rule (`PLAYER_STARVE` in simCore):
  no ATP costs 2.5 HP/s; no biomass ferments the body for ATP at 1.5 HP/s (0.6 ATP per HP), but only up
  to a 2-ATP reserve, so it is a lifeline to swim to food, not an ATP farm (Yuki heals HP for free).
  Both pause while sheltered inside Yuki. Only running out of HP kills.
- From full HP with no food at all, a cell lasts about 36 s; with some biomass but no ATP it lasts ~40 s.
- Other creatures keep their old starvation, so the tuned ecology does not move.
- Death card and starvation warnings now describe this rule: "Out of ATP: your cell is losing HP",
  "No biomass: your cell is fermenting its own body for ATP", "Running dry ..." before either.
- Smoke test updated to the new rule, plus two new asserts (no instant death at full HP; the fermentation
  reserve is never exceeded).
- Bots (`sim_experience.mjs 15`, same six seeds, now also copied into the v1.3.4 folder so they test the
  shipping kernel): deaths per 15 min 7.7 -> 5.2 (4-6), best seed 38% progress, still 0/6 reach the climax.

**2. The itch/html release is now v1.3.4, with the soundtrack**
- `tools/release.ps1`, `deploy/itch/pack.sh` and `tools/build_site.mjs` point at v1.3.4. The soundtrack keeps
  its one home in `eukaryotic_eucharist_mobile_v1_3_3/music` and is copied in as `music/`. The old pack.sh
  never shipped music at all; it does now. release.ps1 fails the build if a track is missing.
- pack.sh now works from Git Bash on Windows (native paths for Windows Python) and only replaces the zip
  once the new one is complete.
- v1.3.4 played from the repo folder (`npm start`) finds the soundtrack in the v1.3.3 folder.
- Verified: `release.ps1 -DryRun` stages index.html, src, 12 tracks, VERSION.txt; the packed zip (18 files,
  12 mp3s, v1.3.4 kernel with the new rule) boots in Edge and the music plays; Pages mecha-fish/ is v1.3.4
  and plays music; `npm test` all green; page check: classic, mecha-fish, immune ok.
- The zip is ~100 MB with music, at GitHub's per-file limit, so I did not commit a regenerated
  `deploy/itch/mecha_fish.zip` (the tracked one is the old music-less pack). Game Butler should pack at release.
- README, RELEASE.md, SPLIT.md and docs/VERSIONS.md updated.

## 2026-11-11 (Claude Code on Fenrir, Opus 5.5)

Started the playtest-to-itch push. The goal is an itch-ready, human-playtestable build by about Nov 22.

**State of main (61d9d80)**
- `npm test`: all 12 builds pass their kernel smoke tests (v1.3.3 and v1.3.4 about 38 s each).
- `tools/page_check.py` with local Edge: classic/, mecha-fish/ and immune/ load, draw and keep moving for 10 s.
  The root index logged one 404 under Edge (most likely the favicon request). CI on Linux was green.
- `tools/browser_smoke.py` at 390x844 and 1280x720: mecha-fish/ (v1.3.3) and versions/v1_3_4/ boot and render.
- mecha-fish/ and the itch release pin are v1.3.3. The first-five-minutes fixes (Yuki compass, phone
  objective banner, verb labels on touch buttons) exist only in v1.3.4, so phone players of the shipping
  build still see "F/RMB" and "LMB" on the touch buttons and a static slogan instead of the objective.

**Ecology research (not for this release)**
- The overnight wide-bands tuning search on `research/umwelt-ephemeris` found a set with much wider
  population swings, but a 60-minute check showed it breaks: the fat-grazer guild dies out and lipids
  pile up all game. Cause found: scavenger surge parties arrive, die in place, and their bodies feed the
  next surge. That work stays on the research branch (uncommitted in Luke's main checkout, untouched)
  until the loop is fixed. Nothing from it is in this build.

**Bot playthroughs (`sim_experience.mjs 15 <seed>`, seeds 1234 77 2025 909 31 4242, main's kernel)**
- Before: 12–14 deaths per 15 min, 5 of 6 stalled at the first bite, 0/6 reached the climax.
- Cause: the bot was stale, not the game. It still treated the shop as a pause, but the game now
  shelters you inside Yuki (healed, O2 eased) while the world runs. The bot hovered beside Yuki in toxic
  canopy O2 and bled ~2.3 HP/s with nothing attacking it.
- Fixed the bot (`sim_player.mjs` + its drivers): near Yuki, when shopping or hurt, it rests inside her
  with `step(..., sheltered=true)` for up to 4 s, and no longer hovers after a visit.
- After: 6–9 deaths per 15 min (mean 7.7), best seed 38% progress (reached the deep), still 0/6 climax.
  Remaining deaths are mostly starvation (ATP 0, biomass ~0) and an algal bloom fighting back when the
  bot rasps it with an empty ATP tank. That is bot skill; it says nothing yet about human difficulty.
- A human idling at the start survives at least 4 minutes in the browser.

**Fix: the game-over card names the cause (v1.3.4, front end only)**
- "Hull Ruptured" now says why: killed by a named body (predator, algal bloom, ...), starved (ATP and
  biomass ran dry, including the instant collapse at any HP), oxygen poisoning, own toxins, or self-lysis.
  The card stays up 2.6 s instead of 0.9 s.
- Self-lysis (K) never showed the card: it kills between frames and the next step clears the event list.
  It now uses the same card.
- Verified: harness over the cause logic (6 cases), self-lysis card in Edge via Playwright (no page errors),
  `npm test` all green, browser smoke at 390x844.

**Later the same day: starvation warning, and the death card made accurate**
- New toast before starvation (v1.3.4 front end): once ATP is under 2 and biomass under 6 (unsheltered), it
  says "Starving ... feed on a field now, or your cell dissolves", at most every 5 s. A fresh player idling
  2 minutes never sees it (starts with 18 ATP). In bot runs it fired 5–21 s before each starvation death.
- Fixed two bugs in my own death card: killer ids are strings (`body_119`), not numbers, so fight deaths
  were mislabelled; and the bot lives above its O2 tolerance most of the time, so starvation was blamed on
  oxygen. The card now names the biggest drain using the kernel's HP rates. Checked against the bot's real
  last frames (7 cases).
- `npm test` v1.3.4 green; page check and the self-lysis card in Edge show no page errors.

### Questions for Luke
(Both answered by Luke on 2026-11-11 at 2:34 PM PT: ship v1.3.4; starvation must drain HP, never kill instantly. Done above.)
1. Should the itch/html release move from v1.3.3 to v1.3.4? v1.3.4 is the same kernel with the
   first-five-minutes front-end fixes, but `tools/release.ps1` and `build_site.mjs` deliberately pin 1.3.3,
   and v1.3.4 has no `music/` folder of its own (Pages serves the v1.3.3 copy).
2. Starvation kills instantly at any HP once ATP and biomass both hit zero (the bot died at 75% HP).
   Is that sudden death intended? The card now explains it, but a warning before it happens may be kinder.

### Not done yet
- Commits and pushes: Claude Code's auto-mode permission check blocked a commit on 2026-11-11, so this
  work sits uncommitted in the `C:\Users\lukes\Documents\ee-playtest` worktree (branch
  `fenrir/playtest-polish`). Luke's research checkout (`research/umwelt-ephemeris`) is untouched.
- No ready-for-human-playtest issue yet: the release folder is settled; next I need a time-to-beat estimate
  (the bot never reaches the climax) and the pushed SHA to cite.
