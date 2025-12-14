import { state, getActiveSim } from "./state.js";
import { ObjectRegistry } from "./objectRegistry.js";
import { enqueueType } from "./queue.js";
import { calculateMood } from "./moodlets.js";
import {
  listLots,
  getActiveLot,
  createLot,
  addRoom,
  setActiveLot
} from "./lots.js";

/* ===========================
   CORE RENDER LOOP
=========================== */
export function renderUI() {
  const sim = getActiveSim();
  if (!sim) return;

  const lot = state.lots[sim.location.lotId];
  const room = lot?.rooms?.[sim.location.roomId];

  // Sim meta
  document.getElementById("sim-name").textContent = sim.name;
  document.getElementById("sim-trait").textContent =
    sim.traits?.[0]?.name ?? "Trait";
  document.getElementById("emotion").textContent = calculateMood(sim);

  // Needs
  document.querySelector("#hunger span").textContent = sim.needs.hunger;
  document.querySelector("#energy span").textContent = sim.needs.energy;
  document.querySelector("#social span").textContent = sim.needs.social;

  // Time
  document.getElementById("time").textContent =
    `Day ${state.time.day} — ${String(state.time.hour).padStart(2, "0")}:00`;

  renderQueue(sim);
  renderRoomObjects(room);
  renderLotsCard(sim);
}

/* ===========================
   QUEUE UI (simple + safe)
=========================== */
function renderQueue(sim) {
  const el = document.getElementById("queue");
  if (!el) return;

  el.innerHTML = sim.queue.length
    ? sim.queue.map(a => `<div>• ${a.label}</div>`).join("")
    : `<div style="opacity:.6">No actions queued</div>`;
}

/* ===========================
   ROOM OBJECTS (SIMS CORE)
=========================== */
function renderRoomObjects(room) {
  const el = document.getElementById("room-objects");
  if (!el) return;

  if (!room) {
    el.innerHTML = `<div style="opacity:.6">No room selected</div>`;
    return;
  }

  el.innerHTML = `
    <div style="font-weight:900; margin-bottom:6px;">
      ${room.name}
    </div>
    ${room.objects.map(obj => {
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
              <button class="btn primary"
                onclick="objectAction('${a.action}')">
                ${a.label}
              </button>
            `).join("")}
          </div>
        </div>
      `;
    }).join("")}
  `;
}

export function objectAction(actionType) {
  enqueueType(actionType);
}
window.objectAction = objectAction;

/* ===========================
   LOTS QUICK CARD
=========================== */
function renderLotsCard(sim) {
  const el = document.getElementById("lots");
  if (!el) return;

  const lot = state.lots?.[sim.location.lotId];
  const room = lot?.rooms?.[sim.location.roomId];

  el.innerHTML = `
    <div><b>Lot:</b> ${lot?.name ?? "—"}</div>
    <div><b>Room:</b> ${room?.name ?? "—"}</div>
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

export function renderHouseholdList() {
  const list = document.getElementById("household-list");
  list.innerHTML = "";

  const sims = Object.values(state.household.sims || {});
  sims.forEach(sim => {
    const active = sim.id === state.household.activeSimId;
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `
      <div>
        <div style="font-weight:900">${sim.name}</div>
        <div style="opacity:.7;font-size:12px">
          ${sim.age} • ${sim.traits?.[0]?.name ?? ""}
        </div>
      </div>
      <button class="btn ${active ? "primary" : ""}"
        onclick="switchActiveSim('${sim.id}')">
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

  // Lots
  lotsList.innerHTML = "";
  listLots().forEach(lot => {
    const active = lot.id === state.activeLotId;
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `
      <div>
        <div style="font-weight:900">${lot.name}</div>
        <div style="opacity:.7;font-size:12px">
          ${Object.keys(lot.rooms || {}).length} rooms
        </div>
      </div>
      <button class="btn ${active ? "primary" : ""}"
        onclick="setActiveLotUI('${lot.id}')">
        ${active ? "Active" : "Use"}
      </button>
    `;
    lotsList.appendChild(div);
  });

  // Rooms
  roomsList.innerHTML = "";
  const lot = getActiveLot();
  Object.values(lot.rooms || {}).forEach(room => {
    const here =
      sim.location.lotId === lot.id &&
      sim.location.roomId === room.id;

    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `
      <div>
        <div style="font-weight:900">${room.name}</div>
        <div style="opacity:.7;font-size:12px">
          ${here ? "Sim is here" : "Tap Walk to go"}
        </div>
      </div>
      <button class="btn primary"
        onclick="walkToRoom('${lot.id}','${room.id}')">
        ${here ? "Here" : "Walk"}
      </button>
    `;
    roomsList.appendChild(div);
  });
}

/* ===========================
   LOT / ROOM ACTIONS
=========================== */
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
