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

https://comfy-rolypoly-08764e.netlify.app/manifest.json

Just use this, it does not work on Github for whatever reason.. But this works fairly well, still updating it to make it really good but yeah..
