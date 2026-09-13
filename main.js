// main.js — wires up the popover UI to the Owlbear Rodeo SDK.
//
// If the esm.sh import below fails to resolve in your environment, switch
// to a proper bundled build (npm install @owlbear-rodeo/sdk + Vite) — see
// README.md for both options.
import OBR, { buildImage } from "https://esm.sh/@owlbear-rodeo/sdk@3";
import { loadWeapons } from "./weapons.js";
import { computeBuildTotals, computeModeStats, resolveAccuracyRoll, rollDamage } from "./stats.js";

const NS = "com.ashforge.limelight"; // metadata namespace for our extension
const BROADCAST_CHANNEL = `${NS}/attack`;

const state = {
  builds: [],       // parsed builds from the pasted/uploaded JSON
  selectedItem: null, // currently selected OBR item (if it's one of ours)
  mode: "mobile",
};

// ---------- tabs ----------
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
  });
});

// ---------- import parsing ----------
const jsonInput = document.getElementById("json-input");
const fileInput = document.getElementById("file-input");
const parseBtn = document.getElementById("parse-btn");
const parseError = document.getElementById("parse-error");
const buildsList = document.getElementById("builds-list");

fileInput.addEventListener("change", async () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  jsonInput.value = await file.text();
});

parseBtn.addEventListener("click", () => {
  parseError.textContent = "";
  buildsList.innerHTML = "";
  let data;
  try {
    data = JSON.parse(jsonInput.value);
  } catch (e) {
    parseError.textContent = "That doesn't look like valid JSON: " + e.message;
    return;
  }

  // Support both a full backup export ({ builds: [...] }) and a single
  // exported build ({ id, doll, arm, retrofit }).
  let builds;
  if (Array.isArray(data?.builds)) {
    builds = data.builds;
  } else if (data?.doll && data?.arm) {
    builds = [data];
  } else {
    parseError.textContent = "Couldn't find any builds in this JSON — expected a { builds: [...] } backup or a single build export.";
    return;
  }

  state.builds = builds;
  renderBuildsList();
});

function renderBuildsList() {
  buildsList.innerHTML = "";
  if (state.builds.length === 0) {
    buildsList.innerHTML = `<p class="hint">No builds found.</p>`;
    return;
  }
  for (const build of state.builds) {
    const card = document.createElement("div");
    card.className = "build-card";
    const name = build.doll?.name || build.name || "(unnamed)";
    const callsign = build.doll?.callsign ? ` "${build.doll.callsign}"` : "";
    const cls = build.arm?.variant || build.arm?.class || "unknown class";

    const built = computeBuildTotals(build);
    const warn = built.error ? `<div class="warn">${built.error}</div>` : "";

    card.innerHTML = `
      <h3>${escapeHtml(name)}${escapeHtml(callsign)}</h3>
      <div class="meta">${escapeHtml(cls)} · Tactic: ${escapeHtml(build.doll?.battleTactic || "none")}</div>
      ${warn}
      <div class="actions">
        <button class="create-token-btn">Create Token</button>
      </div>
    `;
    card.querySelector(".create-token-btn").addEventListener("click", () => createTokenFromBuild(build));
    buildsList.appendChild(card);
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// ---------- token creation ----------
async function createTokenFromBuild(build) {
  const portraitUrl = build.doll?.portrait || "https://via.placeholder.com/150?text=Ash+Forge";

  const dpi = await OBR.scene.grid.getDpi();
  const dims = await loadImageDimensions(portraitUrl);

  const image = {
    url: portraitUrl,
    width: dims.width,
    height: dims.height,
    mime: guessMime(portraitUrl),
  };
  const grid = { dpi, offset: { x: dims.width / 2, y: dims.height / 2 } };

  const name = build.doll?.name || build.name || "Unnamed";

  const item = buildImage(image, grid)
    .name(name)
    .plainText(build.doll?.callsign || "")
    .layer("CHARACTER")
    .metadata({
      [`${NS}/build`]: build,
      [`${NS}/mode`]: "mobile",
    })
    .build();

  await OBR.scene.items.addItems([item]);
  OBR.notification.show(`Created token for ${name}`, "SUCCESS");
}

function guessMime(url) {
  const ext = url.split(".").pop()?.toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  return "image/jpeg";
}

function loadImageDimensions(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve({ width: img.naturalWidth || 150, height: img.naturalHeight || 150 });
    img.onerror = () => resolve({ width: 150, height: 150 }); // fallback square token
    img.src = url;
  });
}

// ---------- selection / sheet ----------
const sheetEmpty = document.getElementById("sheet-empty");
const sheetContent = document.getElementById("sheet-content");

async function refreshSelection() {
  const selection = await OBR.player.getSelection();
  if (!selection || selection.length === 0) {
    state.selectedItem = null;
    renderSheet();
    return;
  }
  const items = await OBR.scene.items.getItems(selection);
  const item = items.find((it) => it.metadata && it.metadata[`${NS}/build`]);
  state.selectedItem = item || null;
  if (item) state.mode = item.metadata[`${NS}/mode`] || "mobile";
  renderSheet();
}

function renderSheet() {
  if (!state.selectedItem) {
    sheetEmpty.style.display = "block";
    sheetContent.style.display = "none";
    return;
  }
  sheetEmpty.style.display = "none";
  sheetContent.style.display = "block";

  const build = state.selectedItem.metadata[`${NS}/build`];
  const built = computeBuildTotals(build);

  if (built.error) {
    sheetContent.innerHTML = `<div class="error">${built.error}</div>`;
    return;
  }

  const modeStats = computeModeStats(built, state.mode);
  const tactic = built.tactic;
  const weapon = built.weapon;

  sheetContent.innerHTML = `
    <h3 style="margin:0 0 4px">${escapeHtml(build.doll?.name || "Unnamed")}</h3>
    <div class="meta">${escapeHtml(built.variant.name)} · ${escapeHtml(built.faction?.short || "No faction")}${built.factionBonusApplied ? " (faction bonus active)" : ""}</div>
    <div class="meta">Tactic: ${escapeHtml(tactic?.name || "None")}${tactic?.isUpgraded ? " ⭐" : ""}</div>
    ${Object.keys(built.unappliedTacticBonuses || {}).length ? `<div class="warn">Not yet applied to numbers: ${Object.entries(built.unappliedTacticBonuses).map(([k, v]) => `${k} ${v}`).join(", ")}</div>` : ""}

    <div class="mode-toggle">
      <button id="mode-mobile" class="${state.mode === "mobile" ? "active" : ""}">Mobile Mode</button>
      <button id="mode-siege" class="${state.mode === "siege" ? "siege-active" : ""}">Siege Mode</button>
    </div>

    <div class="stat-grid">
      <div class="stat-box"><div class="label">HP</div><div class="value">${modeStats.hp}</div></div>
      <div class="stat-box"><div class="label">Armor</div><div class="value">${modeStats.armor}</div></div>
      <div class="stat-box"><div class="label">Evasion</div><div class="value">${modeStats.evasion}</div></div>
      <div class="stat-box"><div class="label">Accuracy</div><div class="value">${modeStats.accuracy}</div></div>
      <div class="stat-box"><div class="label">Penetration</div><div class="value">${modeStats.penetration}</div></div>
      <div class="stat-box"><div class="label">AP</div><div class="value">${modeStats.ap}</div></div>
    </div>
    <div class="hint">${modeStats.movementLocked ? "⚠ Movement locked" : "✓ Free movement"} · Spot ${modeStats.spotting}ft · Dice pool ${modeStats.accuracy}d6</div>

    <div class="weapon-box">
      <div class="name">${escapeHtml(weapon?.name || "No weapon equipped")}</div>
      ${weapon ? `<div class="detail">DMG ${built.damageDiceStr} · PEN ${built.totals.penetration} · RNG ${weapon.rangeBand}${built.effectiveRange ? ` (${built.effectiveRange}ft)` : ""} · T${weapon.tier}</div>` : ""}
      <button id="attack-btn" ${weapon ? "" : "disabled"} style="margin-top:6px;width:100%">⚔ Attack with Main Weapon</button>
    </div>

    <div id="skills-container"></div>
    <div id="attack-log" class="log"></div>
  `;

  document.getElementById("mode-mobile").addEventListener("click", () => setMode("mobile"));
  document.getElementById("mode-siege").addEventListener("click", () => setMode("siege"));
  document.getElementById("attack-btn").addEventListener("click", () => performAttack(build, built, modeStats));

  renderSkills(tactic, state.mode === "siege" ? "Siege" : "Mobile");
}

function renderSkills(tactic, modeLabel) {
  const container = document.getElementById("skills-container");
  if (!tactic) {
    container.innerHTML = `<p class="hint">No battle tactic set.</p>`;
    return;
  }
  const skills = tactic.skills.filter((s) => s.mode === modeLabel);
  const incompleteNote = tactic.incomplete ? `<div class="warn">⚠ ${tactic.name} tactic data is incomplete in gamedata.js — some skills may be missing.</div>` : "";
  if (skills.length === 0) {
    container.innerHTML = `${incompleteNote}<p class="hint">No ${modeLabel} skills found for ${escapeHtml(tactic.name)}.</p>`;
    return;
  }
  container.innerHTML = incompleteNote + skills.map((s) => `
    <div class="skill-card">
      <div class="name">${escapeHtml(s.name)} <span class="tags">${s.mode.toUpperCase()} · CP ${s.cp} · AP ${s.ap} · PWR ${s.power}</span></div>
      <div class="desc">${escapeHtml(s.desc)}</div>
    </div>
  `).join("");
}

async function setMode(mode) {
  state.mode = mode;
  await OBR.scene.items.updateItems([state.selectedItem.id], (items) => {
    for (const it of items) it.metadata[`${NS}/mode`] = mode;
  });
  renderSheet();
}

async function performAttack(build, built, modeStats) {
  const accRoll = resolveAccuracyRoll(modeStats.accuracy);
  const dmgRoll = rollDamage(built.damageDice);
  const name = build.doll?.name || "Unnamed";

  const payload = {
    name,
    weapon: built.weapon?.name,
    mode: state.mode,
    accRoll,
    dmgRoll,
    timestamp: Date.now(),
  };

  logAttack(payload);
  try {
    await OBR.broadcast.sendMessage(BROADCAST_CHANNEL, payload, { destination: "ALL" });
  } catch (e) {
    console.warn("Broadcast failed", e);
  }
}

function logAttack(payload) {
  const log = document.getElementById("attack-log");
  if (!log) return;
  const cls = payload.accRoll.crits > 0 ? "crit" : payload.accRoll.hits > 0 ? "hit" : "miss";
  const entry = document.createElement("div");
  entry.className = `entry ${cls}`;
  entry.textContent = `${payload.name} attacks with ${payload.weapon || "?"} [${payload.mode}]: ` +
    `${payload.accRoll.hits} hit(s) (${payload.accRoll.crits} crit) on ${payload.accRoll.poolSize}d6, ` +
    `damage ${payload.dmgRoll.diceStr} = ${payload.dmgRoll.total}`;
  log.prepend(entry);
}

// Show attacks broadcast by other players too
OBR.broadcast.onMessage(BROADCAST_CHANNEL, (event) => {
  logAttack(event.data);
});

// ---------- boot ----------
OBR.onReady(async () => {
  await loadWeapons();
  OBR.player.onChange(refreshSelection);
  refreshSelection();
});
