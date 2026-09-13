# Ash Forge Companion — Owlbear Rodeo Extension

Imports character builds exported from your Ash Forge (Base44) app, creates
player tokens, and runs Siege/Mobile combat mode with an Attack action.

## What's implemented

- **Import tab**: paste or upload the JSON (either a single build export or
  a full `{ builds: [...] }` backup), lists every build found, "Create Token"
  spawns an image token on the scene using the build's portrait, with the
  raw build data stored as token metadata.
- **Sheet tab**: when you select a token created by this extension, shows
  its derived stats, a Mobile/Siege toggle (persisted on the token itself),
  the matching skill list for its Battle Tactic, and an Attack button.
- **Attack**: rolls an accuracy dice pool (size = Accuracy stat, 4+ hit /
  5+ crit / 3- glance) and a damage roll from the equipped weapon, then
  broadcasts the result to everyone else with the extension open, and logs
  it locally.

## Setup

1. **Host the files.** The whole folder is static — no build step required.
   Easiest option: push it to a GitHub repo and enable GitHub Pages, or
   drop it on Vercel/Netlify as a static site.
2. In Owlbear Rodeo, open a room → **Add Extension** → paste the URL to
   your hosted `manifest.json` (e.g. `https://yourname.github.io/ash-forge-obr/manifest.json`).
3. Click the extension's icon in the top toolbar to open the popover.

### Local development
You can also just run a local static server (`npx serve .` or similar) and
point Owlbear Rodeo's "Add Extension" at `http://localhost:PORT/manifest.json`
— OBR supports loading extensions from localhost for development.

### About the SDK import
`main.js` imports the Owlbear Rodeo SDK straight from a CDN (`esm.sh`) so
there's zero build tooling to get started. This is fine for testing, but
for anything you plan to keep using long-term, switch to the standard
`npm install @owlbear-rodeo/sdk` + Vite setup from the
[official tutorial](https://docs.owlbear.rodeo/extensions/tutorial-hello-world/)
— it's more reliable than depending on a third-party CDN staying up.

## Known gaps / things to double check

These were flagged during development because I didn't have the source data
or logic to confirm them — search for the tags below in the code:

- **`[A1]` in `stats.js`** — attack damage uses the equipped weapon's own
  damage die (from the CSV tier), not the class variant's `firepower`
  field. This matched your Arm Summary screenshot, but I never saw the
  actual combat-resolution code, so please sanity check a few builds.
- **`[A2]` in `stats.js`** — the Siege/Mobile formula (Accuracy ×2 / Evasion
  → 0 / movement locked / spot +50ft in Siege; unchanged in Mobile) was
  reverse-engineered from two screenshots of the same build. It's probably
  right but hasn't been checked against a build with different stats.
- **`[A3]` in `stats.js`** — accuracy dice pool resolution (4+ hit, 5+ crit,
  3- glance) matches the "Accuracy Roll" panel label but I never saw it
  actually used in-app, so the exact hit/crit thresholds are inferred.
- **`[A4]` in `stats.js` / `gamedata.js`** — tactic `bonusStats` (e.g. Frontline
  +10 Mobility) are now applied to combat totals (previously only shown as
  flavor text). Flat bonuses (mobility, threat, hp, accuracy, armor,
  evasion, penetration) add directly; percentage bonuses apply as a
  multiplier on top of the class+retrofit+faction subtotal, computed
  **after** flat bonuses. This order-of-operations is a guess — not
  confirmed against the app. `groundFP`, `firepower`, `critRate`,
  `critDamage`, and `luck` have no matching totals field (damage is
  dice-based, see [A1]) so they're surfaced as `unappliedTacticBonuses` on
  the sheet rather than silently dropped — worth deciding how they should
  actually factor into an attack.
- **`getEffectiveTactic()`'s upgrade check** — assumes `build.doll.tacticUpgrades[tacticId]`
  being truthy means the tier-2 upgrade is unlocked. Every export we've
  seen so far only had `tacticUpgrades: {}`, so this is untested against
  real unlocked data — confirm the actual shape when you have an example.
- **Tactic upgrades**: all 7 tactics (`frontline`, `assault`, `defender`,
  `firesupport`, `ambush`, `coverfire`, `artillery`) now have complete
  base + tier-2 upgrade data in `gamedata.js`, ported from your source
  file's own `getTacticTierData` / `getMaxTacticTier` / `canUpgradeTactic`
  helpers. If the game ever adds a tier 3, that'll need its own entry.
- **Class bonuses** (e.g. Heavy Tank's "+25 Armor vs enemies with +2
  Hostility") aren't applied anywhere — I don't know what triggers them
  (an "enemy hostility" field doesn't appear in the build export), so
  they're stored as flavor text only for now.
- **Retrofit `damageReduction`** is tracked (`damageReductionPct` in
  `computeBuildTotals`) but not yet applied anywhere, since there's no
  "incoming damage" flow in this extension yet — hook it up wherever you
  implement being attacked.

## File structure

- `manifest.json` — extension entry point
- `index.html` / `style.css` — popover UI shell
- `main.js` — UI logic + all Owlbear Rodeo SDK calls
- `gamedata.js` — classes, factions, battle tactics, retrofit tree (ported from your app)
- `weapons.js` / `weapons.csv` — weapon ID resolution (ported + bundled from your app)
- `stats.js` — turns a raw build + mode into final combat numbers
