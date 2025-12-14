import { state, getActiveSim } from "./state.js";
import { ObjectRegistry } from "./objectRegistry.js";
import { enqueueType } from "./queue.js";
import { calculateMood } from "./moodlets.js";
import { listLots, getActiveLot, createLot, addRoom, setActiveLot } from "./lots.js";

/* ===========================
   MAIN RENDER
=========================== */
export function renderUI() {
  const sim = getActiveSim();
  if (!sim) return;

  const lot = state.lots?.[sim.location?.lotId];
  const room = lot?.rooms?.[sim.location?.roomId];

  // Meta
  const nameEl = document.getElementById("sim-name");
  if (nameEl) nameEl.textContent = sim.name;

  const traitEl = document.getElementById("sim-trait");
  if (traitEl) traitEl.textContent = sim.traits?.[0]?.name ?? "Trait";

  const emoEl = document.getElementById("emotion");
  if (emoEl) emoEl.textContent = calculateMood(sim);

  // Needs
  const h = document.querySelector("#hunger span");
  const e = document.querySelector("#energy span");
  const s = document.querySelector("#social span");
  if (h) h.textContent = sim.needs.hunger;
  if (e) e.textContent = sim.needs.energy;
  if (s) s.textContent = sim.needs.social;

  // Time
  const t = document.getElementById("time");
  if (t) t.textContent = `Day ${state.time.day} — ${String(state.time.hour).padStart(2, "0")}:00`;

  renderQueue(sim);
  renderLotsCard(lot, room);
  renderRoomObjects(room);
  renderSkillsBadges(sim);
}

/* ===========================
   QUEUE
=========================== */
function renderQueue(sim) {
  const el = document.getElementById("queue");
  if (!el) return;

  el.innerHTML = sim.queue?.length
    ? sim.queue.map(a => `
        <div style="display:flex; justify-content:space-between; gap:8px; align-items:center; margin-bottom:6px;">
          <div>• ${a.label}</div>
          <div style="display:flex; gap:6px;">
            <button class="btn" onclick="moveAction('${a.id}',-1)">⬆️</button>
            <button class="btn" onclick="moveAction('${a.id}', 1)">⬇️</button>
            <button class="btn danger" onclick="cancelAction('${a.id}')">✖</button>
          </div>
        </div>
      `).join("")
    : `<div style="opacity:.6">No actions queued</div>`;
}

function renderLotsCard(lot, room) {
  const el = document.getElementById("lots");
  if (!el) return;

  el.innerHTML = `
    <div><b>Lot:</b> ${lot?.name ?? "—"}</div>
    <div><b>Room:</b> ${room?.name ?? "—"}</div>
  `;
}

/* ===========================
   ROOM OBJECTS
=========================== */
function renderRoomObjects(room) {
  const el = document.getElementById("room-objects");
  if (!el) return;

  if (!room) {
    el.innerHTML = `<div style="opacity:.6">No room selected</div>`;
    return;
  }

  el.innerHTML = (room.objects || []).map(obj => {
    const def = ObjectRegistry[obj.type];
    if (!def) return "";

    return `
      <div class="object-card">
        <div class="object-header">
          <span>${def.icon}</span>
          <span>${def.name}</span>
        </div>
        <div class="object-actions">
          ${def.actions.map(a => `
            <button class="btn primary" onclick="objectAction('${a.action}')">${a.label}</button>
          `).join("")}
        </div>
      </div>
    `;
  }).join("") || `<div style="opacity:.6">No objects in this room</div>`;
}

export function objectAction(actionType) {
  enqueueType(actionType);
}
window.objectAction = objectAction;

/* ===========================
   SKILLS BADGES
=========================== */
function renderSkillsBadges(sim) {
  const el = document.getElementById("skills");
  if (!el) return;

  const skills = sim.skills || {};
  const entries = Object.entries(skills);

  if (!entries.length) {
    el.innerHTML = `<div style="opacity:.6">No skills yet</div>`;
    return;
  }

  el.innerHTML = `
    <div class="skills-grid">
      ${entries.map(([name, s]) => `
        <div class="skill-badge">
          <div class="skill-name">${name}</div>
          <div class="skill-star">⭐️</div>
          <div class="skill-level">Lv ${s.level} • ${s.xp}/100</div>
        </div>
      `).join("")}
    </div>
  `;
}

/* ===========================
   HOUSEHOLD PANEL
=========================== */
export function openHousehold() {
  document.getElementById("household").style.display = "flex";
  renderHouseholdList();
}

export function closeHousehold() {
  document.getElementById("household").style.display = "none";
}

function renderHouseholdList() {
  const list = document.getElementById("household-list");
  if (!list) return;
  list.innerHTML = "";

  const sims = Object.values(state.household.sims || {});
  sims.forEach(sim => {
    const active = sim.id === state.household.activeSimId;
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `
      <div>
        <div style="font-weight:1000">${sim.name}</div>
        <div style="opacity:.75;font-size:12px">${sim.age} • ${sim.traits?.[0]?.name ?? ""}</div>
      </div>
      <button class="btn ${active ? "primary" : ""}" onclick="switchActiveSim('${sim.id}')">
        ${active ? "Active" : "Switch"}
      </button>
    `;
    list.appendChild(div);
  });
}

export function switchActiveSim(simId) {
  state.household.activeSimId = simId;
  renderHouseholdList();
}

/* ===========================
   LOTS / ROOMS PANEL
=========================== */
export function openLots() {
  document.getElementById("lotsPanel").style.display = "flex";
  renderLotsPanel();
}

export function closeLots() {
  document.getElementById("lotsPanel").style.display = "none";
}

export function renderLotsPanel() {
  const lotsList = document.getElementById("lots-list");
  const roomsList = document.getElementById("rooms-list");
  const sim = getActiveSim();
  if (!lotsList || !roomsList || !sim) return;

  // Lots
  lotsList.innerHTML = "";
  listLots().forEach(lot => {
    const active = lot.id === state.activeLotId;
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `
      <div>
        <div style="font-weight:1000">${lot.name}</div>
        <div style="opacity:.75;font-size:12px">${Object.keys(lot.rooms || {}).length} rooms</div>
      </div>
      <button class="btn ${active ? "primary" : ""}" onclick="setActiveLotUI('${lot.id}')">
        ${active ? "Active" : "Use"}
      </button>
    `;
    lotsList.appendChild(div);
  });

  // Rooms
  roomsList.innerHTML = "";
  const lot = getActiveLot();
  Object.values(lot.rooms || {}).forEach(room => {
    const here = sim.location?.lotId === lot.id && sim.location?.roomId === room.id;

    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `
      <div>
        <div style="font-weight:1000">${room.name}</div>
        <div style="opacity:.75;font-size:12px">${here ? "Sim is here" : "Tap Walk to go"}</div>
      </div>
      <button class="btn primary" onclick="walkToRoom('${lot.id}','${room.id}')">
        ${here ? "Here" : "Walk"}
      </button>
    `;
    roomsList.appendChild(div);
  });
}

export function createLotUI() {
  const name = prompt("Lot name?", "New Lot") || "New Lot";
  createLot(name);
  renderLotsPanel();
}

export function addRoomUI() {
  const name = prompt("Room name?", "New Room") || "New Room";
  addRoom(state.activeLotId, name);
  renderLotsPanel();
}

export function setActiveLotUI(lotId) {
  setActiveLot(lotId);
  renderLotsPanel();
}
