// weapons.js — ported 1:1 from the Base44 app's weaponsdata.js so that
// weapon IDs (e.g. "wpn_1329") resolve to the exact same weapon.
// Loaded from a bundled local copy of tank_guns_grouped_nations.csv
// (avoids depending on the base44.app CDN staying up / CORS).

const CSV_PATH = "./weapons.csv";

const FACTION_MAP = {
  "Stardust (USA)": "stardust",
  "Schwarz Kreuz (Germany)": "schwarzkreuz",
  "Oktyabrskiy (USSR)": "oktyabrskiy",
  "White Roses (UK)": "whiteroses",
  "Far East (Japan)": "fareast",
  "Universal (N/A)": "universal",
};

function tierStats(tier) {
  if (tier <= 2) return { damage: "1d6", penetration: 1 };
  if (tier <= 4) return { damage: "2d6", penetration: 2 };
  if (tier <= 6) return { damage: "2d6", penetration: 3 };
  if (tier <= 8) return { damage: "3d6", penetration: 4 };
  return { damage: "4d6", penetration: 5 };
}

function parseCaliberMm(name) {
  const match = name.match(/(\d+(?:\.\d+)?)\s*(mm|cm)/i);
  if (!match) return null;
  const value = parseFloat(match[1]);
  return match[2].toLowerCase() === "cm" ? value * 10 : value;
}

function parseBarrelLength(name) {
  const match = name.match(/L\/?(\d+)/i);
  if (!match) return null;
  return parseInt(match[1], 10);
}

function caliberRangeBand(name) {
  const mm = parseCaliberMm(name);
  if (mm == null) return "Short";
  if (mm < 75) return "Short";
  if (mm < 88) {
    const barrel = parseBarrelLength(name);
    if (barrel != null && barrel >= 48) return "Long";
    return "Medium";
  }
  return "Long";
}

function parseCSV(text) {
  const lines = text.trim().split("\n");
  let counter = 0;
  const weapons = [];
  let currentFaction = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("=====") || trimmed === "nation, name, tier") continue;
    const parts = trimmed.split(",");
    if (parts.length < 3) continue;
    const nation = parts[0].trim();
    const tier = parseInt(parts[parts.length - 1].trim(), 10);
    const name = parts.slice(1, -1).join(",").trim();
    if (!name || isNaN(tier)) continue;
    const faction = FACTION_MAP[nation] || currentFaction || "universal";
    currentFaction = faction;
    const stats = tierStats(tier);
    weapons.push({
      id: `wpn_${counter++}`,
      name,
      faction,
      tier,
      damage: stats.damage,
      penetration: stats.penetration,
      rangeBand: caliberRangeBand(name),
    });
  }
  return weapons;
}

let _weapons = null;
let _loading = null;

export async function loadWeapons() {
  if (_weapons) return _weapons;
  if (_loading) return _loading;
  _loading = fetch(CSV_PATH)
    .then((r) => r.text())
    .then((text) => {
      _weapons = parseCSV(text);
      return _weapons;
    })
    .catch((err) => {
      console.error("Failed to load weapons.csv", err);
      _weapons = [];
      return [];
    });
  return _loading;
}

export function getWeapon(id) {
  if (!_weapons) return null;
  return _weapons.find((w) => w.id === id) || null;
}

export function getAvailableWeapons(buildFaction, maxTier = 10) {
  if (!_weapons) return [];
  return _weapons.filter(
    (w) => (w.faction === "universal" || w.faction === buildFaction) && w.tier <= maxTier
  );
}
