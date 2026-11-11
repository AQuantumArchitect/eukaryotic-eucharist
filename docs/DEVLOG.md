# Devlog

Short dated entries from Claude Code on Fenrir, so Game Butler can read progress. Newest first.

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

### Questions for Luke
1. Should the itch/html release move from v1.3.3 to v1.3.4? v1.3.4 is the same kernel with the
   first-five-minutes front-end fixes, but `tools/release.ps1` and `build_site.mjs` deliberately pin 1.3.3,
   and v1.3.4 has no `music/` folder of its own (Pages serves the v1.3.3 copy).
2. Starvation kills instantly at any HP once ATP and biomass both hit zero (the bot died at 75% HP).
   Is that sudden death intended? The card now explains it, but a warning before it happens may be kinder.

### Not done yet
- Commits and pushes: Claude Code's auto-mode permission check blocked a commit on 2026-11-11, so this
  work sits uncommitted in the `C:\Users\lukes\Documents\ee-playtest` worktree (branch
  `fenrir/playtest-polish`). Luke's research checkout (`research/umwelt-ephemeris`) is untouched.
- No ready-for-human-playtest issue yet: the release-folder question above should be settled first.
