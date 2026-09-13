// gamedata.js — ported from the Base44 app's gamedata.js.
// NOTE: Battle Tactics data was captured mid-copy-paste. "ambush" only has
// 2 of its skills, and "coverfire" / "artillery" tactics are referenced by
// CLASSES but have no definition here yet. Anything missing is handled
// gracefully in stats.js / sheet UI (shows "no data yet" instead of crashing).
// Paste the rest into BATTLE_TACTICS below when you find it.

export const CLASSES = [
  {
    id: "light", name: "Light Tank",
    desc: "Fast, stealthy scout. High evasion and spotting, low armor and HP. Best on flanks and in brush.",
    size: 1, tactics: ["frontline", "assault", "defender", "firesupport", "coverfire"],
    rangeFeet: { Short: 50, Medium: 60, Long: 100 }, spottingRange: 200, stealthRange: 75,
    classBonus: "+25 Luck vs other Light Tanks. Smoke screen: 5 tiles in a +, allies in smoke gain -250ft stealth.",
    variants: [
      { id: "prototype-light", name: "Prototype Light Tank", tier: 1, hp: 10, armor: 1, firepower: "1d6", maneuverability: 7, evasion: 12, penetration: 2, ap: 4, accuracy: 8, threat: 3 },
      { id: "light", name: "Light Tank", tier: 2, hp: 14, armor: 2, firepower: "2d6", maneuverability: 7, evasion: 13, penetration: 3, ap: 6, accuracy: 10, threat: 1 },
      { id: "standard-light", name: "Standard Light Tank", tier: 2, hp: 13, armor: 2, firepower: "2d6", maneuverability: 6, evasion: 12, penetration: 3, ap: 6, accuracy: 10, threat: 3 },
      { id: "support-light", name: "Support Light Tank", tier: 2, hp: 15, armor: 2, firepower: "2d6", maneuverability: 6, evasion: 13, penetration: 3, ap: 6, accuracy: 11, threat: 3 },
      { id: "autoloading-light", name: "Autoloading Light Tank", tier: 3, hp: 18, armor: 3, firepower: "3d6", maneuverability: 6, evasion: 12, penetration: 3, ap: 6, accuracy: 14, threat: 3 },
    ],
  },
  {
    id: "medium", name: "Medium Tank",
    desc: "Versatile mainstay. Balanced stats across the board. Can fill many roles effectively.",
    size: 2, tactics: ["frontline", "assault", "defender", "firesupport"],
    rangeFeet: { Short: 75, Medium: 100, Long: 125 }, spottingRange: 125, stealthRange: 125,
    classBonus: "+25 Firepower vs Resetters with +2 Hostility. External Vision System: spot through brush, lowers enemy stealth by 50ft.",
    variants: [
      { id: "prototype-medium", name: "Prototype Medium Tank", tier: 1, hp: 12, armor: 2, firepower: "2d6", maneuverability: 5, evasion: 10, penetration: 3, ap: 4, accuracy: 8, threat: 4 },
      { id: "medium", name: "Medium Tank", tier: 1, hp: 14, armor: 2, firepower: "2d6", maneuverability: 5, evasion: 9, penetration: 3, ap: 4, accuracy: 8, threat: 4 },
      { id: "standard-medium", name: "Standard Medium Tank", tier: 2, hp: 16, armor: 3, firepower: "2d6", maneuverability: 5, evasion: 11, penetration: 3, ap: 4, accuracy: 10, threat: 4 },
      { id: "heavy-medium", name: "Heavy Medium Tank", tier: 2, hp: 22, armor: 4, firepower: "3d6", maneuverability: 4, evasion: 10, penetration: 4, ap: 3, accuracy: 12, threat: 7 },
      { id: "support-medium", name: "Support Medium Tank", tier: 2, hp: 20, armor: 3, firepower: "2d6", maneuverability: 5, evasion: 12, penetration: 4, ap: 4, accuracy: 11, threat: 4 },
      { id: "sniping-medium", name: "Sniping Medium Tank", tier: 3, hp: 18, armor: 3, firepower: "3d6", maneuverability: 5, evasion: 15, penetration: 5, ap: 3, accuracy: 14, threat: 4 },
    ],
  },
  {
    id: "heavy", name: "Heavy Tank",
    desc: "Walking fortress. Superior firepower and armor, but low maneuverability. Vulnerable to fast flankers.",
    size: 2, tactics: ["assault", "defender", "firesupport"],
    rangeFeet: { Short: 50, Medium: 75, Long: 100 }, spottingRange: 100, stealthRange: 200,
    classBonus: "+25 Armor vs enemies with +2 Hostility. -25 Luck vs Light Resetters.",
    variants: [
      { id: "prototype-heavy", name: "Prototype Heavy Tank", tier: 1, hp: 20, armor: 4, firepower: "3d6", maneuverability: 3, evasion: 8, penetration: 4, ap: 3, accuracy: 9, threat: 7 },
      { id: "heavy", name: "Heavy Tank", tier: 2, hp: 26, armor: 4, firepower: "3d6", maneuverability: 3, evasion: 7, penetration: 4, ap: 3, accuracy: 8, threat: 6 },
      { id: "standard-heavy", name: "Standard Heavy Tank", tier: 2, hp: 28, armor: 4, firepower: "3d6", maneuverability: 3, evasion: 7, penetration: 5, ap: 3, accuracy: 8, threat: 7 },
      { id: "heavy-medium-heavy", name: "Heavy Medium Tank", tier: 2, hp: 22, armor: 4, firepower: "3d6", maneuverability: 4, evasion: 10, penetration: 4, ap: 3, accuracy: 10, threat: 4 },
      { id: "support-heavy", name: "Support Heavy Tank", tier: 2, hp: 24, armor: 4, firepower: "4d6", maneuverability: 3, evasion: 8, penetration: 5, ap: 3, accuracy: 8, threat: 7 },
      { id: "super-heavy", name: "Super Heavy Tank", tier: 3, size: 3, hp: 30, armor: 5, firepower: "4d6", maneuverability: 3, evasion: 9, penetration: 5, ap: 3, accuracy: 10, threat: 10 },
    ],
  },
  {
    id: "tankdestroyer", name: "Tank Destroyer",
    desc: "Stealthy sniper with highly accurate guns. Hides in deep brush, devastating at range.",
    size: 2, tactics: ["frontline", "ambush", "firesupport", "coverfire"],
    rangeFeet: { Short: 135, Medium: 140, Long: 150 }, spottingRange: 150, stealthRange: 100,
    classBonus: "High accuracy at long range. Best kept at far distances sniping lightly armored enemies.",
    variants: [
      { id: "prototype-td", name: "Prototype Tank Destroyer", tier: 1, hp: 8, armor: 1, firepower: "1d6", maneuverability: 5, evasion: 11, penetration: 2, ap: 4, accuracy: 9, threat: 1 },
      { id: "light-td", name: "Light Tank Destroyer", tier: 1, size: 1, hp: 9, armor: 2, firepower: "2d6", maneuverability: 4, evasion: 8, penetration: 3, ap: 4, accuracy: 9, threat: 3 },
      { id: "standard-td", name: "Standard Tank Destroyer", tier: 2, hp: 14, armor: 2, firepower: "2d6", maneuverability: 4, evasion: 7, penetration: 3, ap: 4, accuracy: 8, threat: 4 },
      { id: "support-td", name: "Support Tank Destroyer", tier: 2, hp: 22, armor: 3, firepower: "3d6", maneuverability: 4, evasion: 8, penetration: 4, ap: 4, accuracy: 9, threat: 7 },
      { id: "assault-td", name: "Assault Tank Destroyer", tier: 3, hp: 28, armor: 4, firepower: "4d6", maneuverability: 4, evasion: 9, penetration: 5, ap: 4, accuracy: 11, threat: 7 },
    ],
  },
  {
    id: "artillery", name: "Artillery",
    desc: "Long-range bombardment platform. Devastating at distance, but fragile and immobile.",
    size: 2, tactics: ["ambush", "firesupport", "coverfire", "artillery"],
    rangeFeet: { Short: 100, Medium: 150, Long: 200 }, spottingRange: 50, stealthRange: 200,
    classBonus: "+25 Luck vs Resetters with +4 Threat. -30 Luck vs Light Resetters. Friendlies who spot enemies grant infinite spotting range.",
    variants: [
      { id: "prototype-art", name: "Prototype Artillery", tier: 1, hp: 14, armor: 2, firepower: "3d6", maneuverability: 3, evasion: 6, penetration: 3, ap: 3, accuracy: 7, threat: 7 },
      { id: "light-art", name: "Light Artillery", tier: 1, size: 1, hp: 8, armor: 1, firepower: "1d6", maneuverability: 3, evasion: 6, penetration: 2, ap: 3, accuracy: 7, threat: 5 },
      { id: "standard-art", name: "Artillery", tier: 2, hp: 16, armor: 2, firepower: "3d6", maneuverability: 3, evasion: 8, penetration: 3, ap: 0, accuracy: 9, threat: 2 },
      { id: "heavy-art", name: "Heavy Artillery", tier: 2, size: 3, hp: 22, armor: 2, firepower: "3d6", maneuverability: 3, evasion: 6, penetration: 3, ap: 0, accuracy: 8, threat: 7 },
      { id: "autoloading-art", name: "Autoloading Artillery", tier: 3, size: 3, hp: 26, armor: 3, firepower: "4d6", maneuverability: 3, evasion: 7, penetration: 4, ap: 3, accuracy: 11, threat: 4 },
    ],
  },
  {
    id: "supply", name: "Supply Tank",
    desc: "Logistics support vehicle. Provides resources and sustainment to the squad.",
    size: 2, tactics: ["firesupport"],
    rangeFeet: { Short: 50, Medium: 75, Long: 100 }, spottingRange: 150, stealthRange: 100,
    classBonus: "+2 CP Gain per round for all allied units within 100ft. Provides resource sustainment — allied units within range reload 1 AP and resupply 1 ammo per round.",
    variants: [
      { id: "supply", name: "Supply Tank", tier: 1, hp: 16, armor: 1, firepower: "1d6", maneuverability: 6, evasion: 12, penetration: 3, ap: 6, accuracy: 6, threat: 4 },
    ],
  },
];

export function getClass(id) { return CLASSES.find((c) => c.id === id); }
export function getVariant(classId, variantId) {
  const c = getClass(classId);
  return c?.variants.find((v) => v.id === variantId);
}
export function getEffectiveRange(cls, weapon) {
  if (!cls || !weapon) return null;
  return cls.rangeFeet[weapon.rangeBand] ?? null;
}

// Factions — 5 universities + Universal. Each faction's gear is faction-locked.
export const FACTIONS = [
  { id: "stardust", name: "Stardust Union University", short: "Stardust (US)", desc: "American faction. Specializes in Light and Medium Tanks.", bonus: "+25 Firepower & Evasion for Light Tanks & Medium Tanks", bonusStats: { evasion: 25 }, classes: ["light", "medium"] },
  { id: "whiteroses", name: "Royal White Roses University", short: "White Roses (UK)", desc: "British faction. Specializes in Medium Tanks and Scout Cars.", bonus: "+25 Penetration & Evasion for Medium Tanks & Scout Cars", bonusStats: { penetration: 25, evasion: 25 }, classes: ["medium", "light"] },
  { id: "oktyabrskiy", name: "Oktyabrskiy Soyuz Universitet", short: "Oktyabrskiy (RU)", desc: "Russian faction. Specializes in Medium and Heavy Tanks.", bonus: "+25 Evasion & Armor for Medium Tanks & Heavy Tanks", bonusStats: { evasion: 25, armor: 25 }, classes: ["medium", "heavy"] },
  { id: "schwarzkreuz", name: "Schwarz Kreuz Reichs Universität", short: "Schwarz Kreuz (DE)", desc: "German faction. Specializes in Artillery and Heavy Tanks.", bonus: "+25 Evasion & Armor for Artillery & Heavy Tanks", bonusStats: { evasion: 25, armor: 25 }, classes: ["artillery", "heavy"] },
  { id: "fareast", name: "Far East Heavy Steel University", short: "Far East (JP)", desc: "Japanese faction. Specializes in Light Tanks and Tank Destroyers.", bonus: "+25 Penetration & Evasion for Light Tanks & Tank Destroyers", bonusStats: { penetration: 25, evasion: 25 }, classes: ["light", "tankdestroyer"] },
  { id: "universal", name: "Universal Standard", short: "Universal", desc: "Factionless standard-issue gear. Available to all DOLLS at Level 0.", bonus: "Available to all factions", bonusStats: {}, classes: [] },
];

export function getFaction(id) { return FACTIONS.find((f) => f.id === id); }
// Does this faction's bonus apply to this class? (per the bonusStats "classes" allowlist)
export function factionBonusApplies(faction, classId) {
  return !!faction && Array.isArray(faction.classes) && faction.classes.includes(classId);
}

// Battle Tactics — each grants a skill kit (Mobile + Siege skills) and bonus stats.
// Tier-1 (base) tactics, now complete for all 7.
export const BATTLE_TACTICS = [
  {
    id: "frontline", name: "Frontline",
    desc: "Aggressive close-range combat. Marks targets, executes melee strikes, coordinates pushes.",
    bonusStats: { mobility: "+10", threat: "-3" },
    skills: [
      { name: "Recon Strike", mode: "Mobile", cp: 0, ap: 1, power: "100%", desc: "Attacks the enemy 100ft ahead and marks it for 3 turns. The unit moves back 50ft after the attack." },
      { name: "Melee Strike", mode: "Mobile", cp: 8, ap: 2, power: "100%", desc: "Targets the marked unit and performs a melee attack at point-blank range." },
      { name: "Coordinated Push", mode: "Mobile", cp: 4, ap: 1, power: "75%", desc: "Advances 50ft and attacks all enemies in the path. Allies gain +1 to hit marked targets this round." },
      { name: "Siege Barrage", mode: "Siege", cp: 0, ap: 1, power: "100%", desc: "Stationary bombardment on enemies 100ft ahead. Marks all targets hit for 2 turns." },
      { name: "Overwatch", mode: "Siege", cp: 6, ap: 2, power: "125%", desc: "Locks down a firing lane. Any enemy entering range is automatically attacked at +25% power." },
    ],
  },
  {
    id: "assault", name: "Assault",
    desc: "Relentless aggression and armor-breaking.",
    bonusStats: { groundFP: "+12%", penetration: "+4%", armor: "-4%", accuracy: "+5" },
    skills: [
      { name: "Break Assault", mode: "Mobile", cp: 0, ap: 1, power: "100%", desc: "Attacks the enemy 100ft ahead, then decreases their armor and mobility by 25% for 2 turns." },
      { name: "Cleave", mode: "Mobile", cp: 8, ap: 2, power: "75%", desc: "Melee attack on all enemies 50ft ahead." },
      { name: "Bulldoze", mode: "Mobile", cp: 4, ap: 2, power: "100%", desc: "Charges 100ft forward, dealing damage and knocking back all enemies in the path." },
      { name: "Suppressing Fire", mode: "Siege", cp: 0, ap: 1, power: "100%", desc: "Pins down enemies 100ft ahead, reducing mobility and accuracy by 25% for 2 turns." },
      { name: "Demolisher", mode: "Siege", cp: 10, ap: 2, power: "150%", desc: "Devastating stationary shot that ignores 50% of target armor." },
    ],
  },
  {
    id: "defender", name: "Defender",
    desc: "Stalwart protector of the squad.",
    bonusStats: { armor: "+15%", hp: "+10", mobility: "-5" },
    skills: [
      { name: "Shield Wall", mode: "Mobile", cp: 0, ap: 1, power: "75%", desc: "Allies within 50ft gain +25% armor for 2 turns." },
      { name: "Taunt", mode: "Mobile", cp: 4, ap: 1, power: "—", desc: "Forces enemies within 100ft to target this unit on their next turn." },
      { name: "Counter Charge", mode: "Mobile", cp: 6, ap: 2, power: "125%", desc: "Moves to intercept an enemy attacking an ally within 75ft, dealing counter damage." },
      { name: "Bastion", mode: "Siege", cp: 0, ap: 1, power: "—", desc: "Reduces incoming damage by 50% and reflects 25% of melee damage for 3 turns." },
      { name: "Fortress Bombardment", mode: "Siege", cp: 8, ap: 2, power: "125%", desc: "Heavy stationary shelling on enemies 100ft ahead. Targets lose 25% armor for 2 turns." },
    ],
  },
  {
    id: "firesupport", name: "Fire Support",
    desc: "Long-range artillery and overwatch.",
    bonusStats: { accuracy: "+10", firepower: "+15%", mobility: "-10" },
    skills: [
      { name: "Spotting Round", mode: "Mobile", cp: 0, ap: 1, power: "50%", desc: "Fires a marking round 150ft ahead. Marks all enemies in a 50ft radius for 3 turns." },
      { name: "Indirect Fire", mode: "Mobile", cp: 4, ap: 1, power: "100%", desc: "Lobs shells at a marked target anywhere on the map, ignoring cover." },
      { name: "Smoke Screen", mode: "Mobile", cp: 2, ap: 1, power: "—", desc: "Deploys smoke in a 50ft radius, giving allies inside -125ft stealth." },
      { name: "Bombardment", mode: "Siege", cp: 0, ap: 1, power: "125%", desc: "Stationary barrage on enemies 150ft ahead. Deals 125% firepower in a 75ft area." },
      { name: "Orbital Strike", mode: "Siege", cp: 12, ap: 2, power: "200%", desc: "Long-range bombardment on any marked target. Deals 200% firepower in a 100ft area." },
    ],
  },
  {
    id: "ambush", name: "Ambush",
    desc: "Stealthy hunter — strikes from concealment, then vanishes.",
    bonusStats: { accuracy: "+15", mobility: "-20", threat: "-1" },
    skills: [
      { name: "Sniper Shot", mode: "Mobile", cp: 0, ap: 1, power: "100%", desc: "Attacks the enemy 50ft away. If hidden, gains +25% power." },
      { name: "Mark Removal", mode: "Mobile", cp: 1, ap: 2, power: "—", desc: "Removes any mark on yourself. Decreases provocation, increases dodge by 25% for 2 turns." },
      { name: "Reposition", mode: "Mobile", cp: 2, ap: 1, power: "—", desc: "Moves to any unoccupied position on the map and enters stealth. Cannot attack this turn." },
      { name: "Lying in Wait", mode: "Siege", cp: 0, ap: 1, power: "150%", desc: "Stationary ambush. First attack from stealth deals 150% power and marks the target for 3 turns." },
      { name: "Kill Shot", mode: "Siege", cp: 10, ap: 2, power: "200%", desc: "Devastating precision shot on a marked target. Ignores armor entirely." },
    ],
  },
  {
    id: "coverfire", name: "Cover Fire",
    desc: "Suppressive support — pins enemies and counterattacks during their turn.",
    bonusStats: { groundFP: "+8%", armor: "+4%", accuracy: "+5", threat: "+1" },
    skills: [
      { name: "Suppressing Shot", mode: "Mobile", cp: 0, ap: 1, power: "100%", desc: "Attacks an enemy 50ft ahead. A standard suppressive shot that keeps the enemy pinned." },
      { name: "Focused Bombardment", mode: "Siege", cp: 3, ap: 2, power: "100%", desc: "Attacks a marked enemy. Greatly increases FP and critical rate by 50% for this attack. Marks yourself for 2 turns afterward." },
      { name: "Counter Fire", mode: "Siege", cp: 5, ap: 2, power: "—", desc: "Counterattack up to 2 enemies that attack within 100ft ahead during their turn." },
    ],
  },
  {
    id: "artillery", name: "Artillery",
    desc: "Devastating area-of-effect bombardment platform.",
    bonusStats: { groundFP: "+16%", accuracy: "-10", threat: "+2", critDamage: "+10%" },
    skills: [
      { name: "Area Bombardment", mode: "Mobile", cp: 0, ap: 1, power: "100%", desc: "Attacks an enemy in a 50ft area." },
      { name: "Suppressing Barrage", mode: "Siege", cp: 3, ap: 2, power: "75%", desc: "Attacks all enemies in a 150ft area. Lowers their accuracy and provocation by 25% for 2 turns." },
      { name: "Marked Annihilation", mode: "Siege", cp: 3, ap: 2, power: "75%", desc: "Attacks all marked enemies anywhere on the battlefield." },
    ],
  },
];

export function getTactic(id) { return BATTLE_TACTICS.find((t) => t.id === id); }

// Tier-2 tactic upgrades. Only frontline/assault/defender are complete —
// firesupport's data was cut off mid-paste (bonusStats + all skills missing),
// and ambush/coverfire/artillery have no upgrade data at all yet.
export const TACTIC_UPGRADES = {
  frontline: {
    name: "Frontline II",
    bonusStats: { groundFP: "+5%", penetration: "+10%", armor: "-5%", accuracy: "+5", mobility: "+15", threat: "-3", critRate: "+5%", critDamage: "+20%" },
    skills: [
      { name: "Precision Strike", mode: "Mobile", cp: 0, ap: 2, power: "100%", desc: "Attacks the enemy 1-2 tiles ahead and marks it for 3 turns. The unit moves back 1 tile after the attack." },
      { name: "Tactical Concealment", mode: "Mobile", cp: 3, ap: 1, power: "—", desc: "Removes any mark on your unit and goes into siege mode. Increases crit rate by 28% for 2 turns. Enters stealth this turn." },
      { name: "Guardian Overwatch", mode: "Siege", cp: 5, ap: 2, power: "—", desc: "When an enemy 1-4 tiles ahead attacks on their turn, reduce their accuracy by 20% for 1 turn and mark them for 3 turns." },
      { name: "Execution Strike", mode: "Siege", cp: 5, ap: 2, power: "100%", desc: "Targets the marked unit and performs a melee attack anywhere on the map — a teleporting finisher." },
    ],
    upgradeCost: [{ material: "steel", amount: 10 }, { material: "titanium", amount: 5 }, { material: "electronics", amount: 3 }],
  },
  assault: {
    name: "Assault II",
    bonusStats: { groundFP: "+15%", penetration: "+16%", armor: "+11%", accuracy: "+5", mobility: "+8", critRate: "+5%", critDamage: "+20%", luck: "+5" },
    skills: [
      { name: "Break Strike", mode: "Mobile", cp: 0, ap: 1, power: "100%", desc: "Attacks the enemy 2 tiles ahead and inflicts break status. +15% armor for 2 turns after. Break status enemies take -18% armor/mobility before this attack." },
      { name: "Cleave Assault", mode: "Mobile", cp: 5, ap: 1, power: "100%", desc: "Melee attack on the enemy 1-2 tiles ahead, exploiting break status if present. Moves 2 tiles ahead afterward." },
      { name: "Siege Breaker", mode: "Siege", cp: 0, ap: 1, power: "100%", desc: "Attacks the enemy 1-2 tiles ahead and inflicts break status, with bonus FP if medium/heavy class or target is marked." },
      { name: "Bulldoze", mode: "Siege", cp: 8, ap: 2, power: "75%", desc: "Melee attack on all enemies 1 tile ahead, exploiting break status if present." },
    ],
    upgradeCost: [{ material: "steel", amount: 12 }, { material: "titanium", amount: 6 }, { material: "electronics", amount: 4 }],
  },
  defender: {
    name: "Defender II",
    bonusStats: { groundFP: "+10%", armor: "+30%", accuracy: "+15", mobility: "-10", threat: "+3" },
    skills: [
      { name: "Provoking Strike", mode: "Mobile", cp: 3, ap: 1, power: "100%", desc: "Attacks the enemy 1 tile ahead. +25% crit rate and +2 provocation for this attack. +20% damage reduction for the rest of the turn." },
      { name: "Counter Stance", mode: "Mobile", cp: 3, ap: 1, power: "—", desc: "Goes into Siege mode and counterattacks one enemy 1-2 tiles ahead." },
      { name: "Provoking Bombardment", mode: "Siege", cp: 3, ap: 1, power: "100%", desc: "Attacks an enemy 1-2 tiles ahead. +4 provocation for the rest of the turn." },
      { name: "Fortress Counter", mode: "Siege", cp: 5, ap: 1, power: "—", desc: "Counterattacks all enemies attacking 1-2 tiles ahead. Clears most debuffs. +50% armor and +20% damage reduction this turn." },
    ],
    upgradeCost: [{ material: "steel", amount: 15 }, { material: "titanium", amount: 8 }, { material: "electronics", amount: 3 }],
  },
  // firesupport: TODO — bonusStats cut off after "threat:", no skills captured. Paste when found.
};

export function getTacticUpgrade(id) { return TACTIC_UPGRADES[id] || null; }

// [A4] Assumption: build.doll.tacticUpgrades is keyed by tactic id, and a
// truthy value (any value observed so far was just `{}` empty in your
// exports) means the tier-2 upgrade is unlocked for that tactic. If the
// real structure turns out to be e.g. { frontline: 2 } vs { frontline: false },
// this still works since we only check truthiness — but worth confirming.
export function getEffectiveTactic(build) {
  const baseId = build?.doll?.battleTactic;
  const base = getTactic(baseId);
  if (!base) return null;
  const unlocked = build?.doll?.tacticUpgrades?.[baseId];
  const upgrade = TACTIC_UPGRADES[baseId];
  if (unlocked && upgrade) {
    return { id: baseId, name: upgrade.name, bonusStats: upgrade.bonusStats, skills: upgrade.skills, isUpgraded: true, baseName: base.name };
  }
  return { id: baseId, name: base.name, bonusStats: base.bonusStats, skills: base.skills, isUpgraded: false, incomplete: !upgrade && !!unlocked };
}

// Retrofit tree — additive numeric bonuses stack from every unlocked node
// (excluding "core", which is free/baseline and has no bonuses).
export const RETROFIT_TREE = [
  { id: "core", name: "Core Systems", tier: 0, requires: [], bonuses: {}, desc: "Base rigging systems.", children: ["armor-plating", "engine-boost", "targeting-upgrade", "weapon-calibration", "hull-reinforcement"] },
  { id: "armor-plating", name: "Reinforced Armor", tier: 1, requires: ["core"], bonuses: { armor: 1 }, desc: "+1 Armor.", children: ["composite-armor"] },
  { id: "composite-armor", name: "Composite Armor", tier: 2, requires: ["armor-plating"], bonuses: { armor: 2, maneuverability: -1 }, desc: "+2 Armor, -1 Maneuverability.", children: ["reactive-armor"] },
  { id: "reactive-armor", name: "Reactive Armor", tier: 3, requires: ["composite-armor"], bonuses: { armor: 1, damageReduction: "10%" }, desc: "+1 Armor, 10% damage reduction.", children: [] },
  { id: "engine-boost", name: "Engine Boost", tier: 1, requires: ["core"], bonuses: { maneuverability: 1 }, desc: "+1 Maneuverability.", children: ["turbocharger"] },
  { id: "turbocharger", name: "Turbocharger", tier: 2, requires: ["engine-boost"], bonuses: { maneuverability: 2, evasion: 2 }, desc: "+2 Maneuverability, +2 Evasion.", children: ["nitro"] },
  { id: "nitro", name: "Nitro Injection", tier: 3, requires: ["turbocharger"], bonuses: { maneuverability: 3, evasion: 3 }, desc: "+3 Maneuverability, +3 Evasion.", children: [] },
  { id: "targeting-upgrade", name: "Targeting Upgrade", tier: 1, requires: ["core"], bonuses: { accuracy: 1 }, desc: "+1 Accuracy.", children: ["advanced-optics"] },
  { id: "advanced-optics", name: "Advanced Optics", tier: 2, requires: ["targeting-upgrade"], bonuses: { accuracy: 2, spotting: 50 }, desc: "+2 Accuracy, +50ft spotting.", children: ["ai-targeting"] },
  { id: "ai-targeting", name: "AI Targeting System", tier: 3, requires: ["advanced-optics"], bonuses: { accuracy: 3, penetration: 1 }, desc: "+3 Accuracy, +1 Penetration.", children: [] },
  { id: "weapon-calibration", name: "Weapon Calibration", tier: 1, requires: ["core"], bonuses: { firepowerDice: 1 }, desc: "Upgrade damage by 1d6.", children: ["ammo-types"] },
  { id: "ammo-types", name: "Specialized Ammo", tier: 2, requires: ["weapon-calibration"], bonuses: { penetration: 1 }, desc: "+1 Penetration.", children: ["supercharge"] },
  { id: "supercharge", name: "Supercharged Rounds", tier: 3, requires: ["ammo-types"], bonuses: { firepowerDice: 1, penetration: 1 }, desc: "+1d6 damage, +1 Penetration.", children: [] },
  { id: "hull-reinforcement", name: "Hull Reinforcement", tier: 1, requires: ["core"], bonuses: { hp: 3 }, desc: "+3 HP.", children: ["survival-system"] },
  { id: "survival-system", name: "Survival System", tier: 2, requires: ["hull-reinforcement"], bonuses: { hp: 5, armor: 1 }, desc: "+5 HP, +1 Armor.", children: ["last-stand"] },
  { id: "last-stand", name: "Last Stand Protocol", tier: 3, requires: ["survival-system"], bonuses: { hp: 8, armor: 1, damageReduction: "15%" }, desc: "+8 HP, +1 Armor, 15% damage reduction.", children: [] },
];

export function getRetrofitNode(id) { return RETROFIT_TREE.find((n) => n.id === id); }
