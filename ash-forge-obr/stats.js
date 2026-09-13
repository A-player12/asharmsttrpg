// stats.js — turns a raw Base44 build export into final combat numbers.
//
// Formula (per user confirmation): Siege/Mobile mode stats DO include
// retrofit + faction bonuses (fixing the gap where the app's own Combat
// Mode panel currently shows only raw class numbers).
//
// ASSUMPTIONS made where the source app's exact formula wasn't available
// — flagged so they're easy to find and correct later:
//   [A1] Displayed "Firepower" / attack damage uses the equipped WEAPON's
//        damage die (from the CSV tier), not the class variant's own
//        `firepower` field. This matches what the Arm Summary screenshot
//        showed (weapon tier-1 => "1d6" firepower, not the class's "3d6").
//   [A2] Siege mode: Accuracy doubles, Evasion drops to 0, movement locks,
//        spotting range +50ft. Mobile mode: Accuracy/Evasion at their
//        normal totals, free movement, no spotting bonus. Nothing else
//        (HP, Armor, AP, Penetration, Threat) changes between modes.
//   [A3] "Accuracy" total = size of the to-hit dice pool (Nd6), resolved
//        as 4+ hit / 5+ crit / 3- glance, matching the "Accuracy Roll"
//        panel in the screenshots.

import { getClass, getVariant, getFaction, factionBonusApplies, getEffectiveTactic, getRetrofitNode, getEffectiveRange } from "./gamedata.js";
import { getWeapon } from "./weapons.js";

function parseDice(str) {
  // "3d6" -> { count: 3, sides: 6 }
  if (!str || typeof str !== "string") return { count: 0, sides: 6 };
  const m = str.match(/(\d+)\s*d\s*(\d+)/i);
  if (!m) return { count: 0, sides: 6 };
  return { count: parseInt(m[1], 10), sides: parseInt(m[2], 10) };
}

function diceToString(dice) {
  return `${dice.count}d${dice.sides}`;
}

export function rollDice(count, sides) {
  const rolls = [];
  for (let i = 0; i < count; i++) rolls.push(1 + Math.floor(Math.random() * sides));
  return rolls;
}

// Walk the build's unlockedNodes and sum all numeric/dice bonuses.
function sumRetrofitBonuses(unlockedNodes = []) {
  const totals = { armor: 0, maneuverability: 0, evasion: 0, accuracy: 0, penetration: 0, hp: 0, spotting: 0, firepowerDice: 0 };
  let damageReductionPct = 0;
  for (const nodeId of unlockedNodes) {
    if (nodeId === "core") continue;
    const node = getRetrofitNode(nodeId);
    if (!node) continue;
    for (const [key, val] of Object.entries(node.bonuses || {})) {
      if (key === "damageReduction") {
        const pct = parseFloat(String(val).replace("%", "")) || 0;
        damageReductionPct += pct;
      } else if (typeof val === "number") {
        totals[key] = (totals[key] || 0) + val;
      }
    }
  }
  return { ...totals, damageReductionPct };
}

function parseTacticValue(raw) {
  // "+10" -> {type:"flat", value:10}; "-4%" -> {type:"pct", value:-4}
  if (typeof raw === "number") return { type: "flat", value: raw };
  const str = String(raw).trim();
  const isPct = str.endsWith("%");
  const num = parseFloat(str.replace("%", "").replace("+", ""));
  if (isNaN(num)) return null;
  return { type: isPct ? "pct" : "flat", value: num };
}

// [A4] Tactic bonusStats keys that map cleanly onto our totals fields.
// groundFP/firepower/critRate/critDamage/luck have no corresponding totals
// field (damage is dice-based, see [A1]) so they're surfaced separately
// as `unappliedTacticBonuses` for display rather than silently dropped.
// Order of operations (flat first, then % on the running total, applied
// AFTER class+retrofit+faction) is a guess — not confirmed against the app.
const TACTIC_KEY_MAP = { mobility: "maneuverability", threat: "threat", hp: "hp", accuracy: "accuracy", armor: "armor", evasion: "evasion", penetration: "penetration" };
const TACTIC_KEYS_UNMAPPED = ["groundFP", "firepower", "critRate", "critDamage", "luck"];

function applyTacticBonuses(totals, tactic) {
  if (!tactic?.bonusStats) return { totals, unapplied: {} };
  const result = { ...totals };
  const unapplied = {};
  const flats = [];
  const pcts = [];
  for (const [key, raw] of Object.entries(tactic.bonusStats)) {
    if (TACTIC_KEYS_UNMAPPED.includes(key)) { unapplied[key] = raw; continue; }
    const field = TACTIC_KEY_MAP[key];
    if (!field) { unapplied[key] = raw; continue; }
    const parsed = parseTacticValue(raw);
    if (!parsed) continue;
    (parsed.type === "pct" ? pcts : flats).push({ field, value: parsed.value });
  }
  for (const { field, value } of flats) result[field] = (result[field] || 0) + value;
  for (const { field, value } of pcts) result[field] = Math.round((result[field] || 0) * (1 + value / 100));
  return { totals: result, unapplied };
}

/**
 * Compute the full derived stat block for a build (independent of Siege/Mobile mode).
 * @param {object} build - a single build object from the Base44 export (build.doll / build.arm / build.retrofit)
 */
export function computeBuildTotals(build) {
  const cls = getClass(build?.arm?.class);
  const variant = cls ? getVariant(cls.id, build.arm.variant) : null;
  const faction = getFaction(build?.doll?.faction);
  const weapon = build?.arm?.mainWeapon ? getWeapon(build.arm.mainWeapon) : null;
  const retro = sumRetrofitBonuses(build?.retrofit?.unlockedNodes);
  const tactic = getEffectiveTactic(build);

  if (!cls || !variant) {
    return { error: "Unknown class/variant — this build may reference data not yet ported.", cls, variant, faction, weapon, tactic };
  }

  const applyFaction = factionBonusApplies(faction, cls.id);
  const fb = applyFaction ? faction.bonusStats || {} : {};

  let totals = {
    hp: variant.hp + (retro.hp || 0), // faction bonuses observed so far don't touch HP
    armor: variant.armor + (retro.armor || 0) + (fb.armor || 0),
    maneuverability: variant.maneuverability + (retro.maneuverability || 0),
    evasion: variant.evasion + (retro.evasion || 0) + (fb.evasion || 0),
    ap: variant.ap,
    accuracy: variant.accuracy + (retro.accuracy || 0),
    threat: variant.threat,
    // Penetration = class base + retrofit + weapon's own penetration + faction (rare)
    penetration: variant.penetration + (retro.penetration || 0) + (weapon?.penetration || 0) + (fb.penetration || 0),
    spotting: (cls.spottingRange || 0) + (retro.spotting || 0),
    damageReductionPct: retro.damageReductionPct || 0,
  };

  // [A4] Fold in the tactic's (or tactic upgrade's) bonusStats.
  const tacticResult = applyTacticBonuses(totals, tactic);
  totals = tacticResult.totals;

  // [A1] Attack damage dice = weapon's damage die + retrofit firepowerDice bonus.
  const weaponDice = weapon ? parseDice(weapon.damage) : parseDice(variant.firepower);
  const damageDice = { count: weaponDice.count + (retro.firepowerDice || 0), sides: weaponDice.sides || 6 };

  const effectiveRange = weapon ? getEffectiveRange(cls, weapon) : null;

  return {
    cls, variant, faction, weapon, tactic,
    factionBonusApplied: applyFaction,
    totals,
    unappliedTacticBonuses: tacticResult.unapplied,
    damageDice,
    damageDiceStr: diceToString(damageDice),
    effectiveRange,
  };
}

/**
 * Apply the Siege/Mobile mode formula on top of computeBuildTotals().
 * @param {"mobile"|"siege"} mode
 */
export function computeModeStats(built, mode) {
  if (built.error) return built;
  const { totals } = built;
  if (mode === "siege") {
    return {
      mode: "siege",
      armor: totals.armor,
      evasion: 0, // [A2]
      accuracy: totals.accuracy * 2, // [A2]
      movementLocked: true,
      spotting: totals.spotting + 50, // [A2]
      hp: totals.hp, ap: totals.ap, penetration: totals.penetration, threat: totals.threat,
    };
  }
  return {
    mode: "mobile",
    armor: totals.armor,
    evasion: totals.evasion,
    accuracy: totals.accuracy,
    movementLocked: false,
    spotting: totals.spotting,
    hp: totals.hp, ap: totals.ap, penetration: totals.penetration, threat: totals.threat,
  };
}

// [A3] Resolve an accuracy dice pool: 4+ hit, 5+ crit, 3- glance.
export function resolveAccuracyRoll(poolSize) {
  const rolls = rollDice(poolSize, 6);
  let hits = 0, crits = 0, glances = 0;
  for (const r of rolls) {
    if (r >= 5) { crits++; hits++; }
    else if (r >= 4) hits++;
    else glances++;
  }
  return { rolls, hits, crits, glances, poolSize };
}

export function rollDamage(dice) {
  const rolls = rollDice(dice.count, dice.sides);
  const total = rolls.reduce((a, b) => a + b, 0);
  return { rolls, total, diceStr: diceToString(dice) };
}
