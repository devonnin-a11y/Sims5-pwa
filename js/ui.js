import { state, getActiveSim } from "./state.js";
import { getRecentMemories } from "./memory.js";
import { getFamilySummary } from "./relationships.js";
import { calculateMood } from "./moodlets.js";
import { listLots, getActiveLot, createLot, addRoom, setActiveLot } from "./lots.js";

export function renderUI() {
  const sim = getActiveSim();

  // Needs
  document.querySelector("#hunger span").textContent = sim.needs.hunger;
  document.querySelector("#energy span").textContent = sim.needs.energy;
  document.querySelector("#social span").textContent = sim.needs.social;

  // Time
  document.getElementById("time").textContent =
    `Day ${state.time.day} — ${String(state.time.hour).padStart(2, "0")}:00`;

  // Sim meta
  document.getElementById("sim-name").textContent = sim.name;
  document.getElementById("sim-trait").textContent = sim.traits?.[0]?.name ?? "Trait";

  // Mood
  document.getElementById("emotion").textContent = calculateMood(sim);

  // Queue
  renderQueue(sim);

  // Skills
  const skillsEl = document.getElementById("skills");
  skillsEl.innerHTML = Object.entries(sim.skills || {})
    .map(([name, s]) => `<div>${name}: Lv ${s.level} (${s.xp}/100)</div>`)
    .join("") || `<div style="opacity:.7">No skills yet</div>`;

  // Career
  const c = sim.career || { track: "Unemployed", level: 0, performance: 0 };
  document.getElementById("career").innerHTML =
    `<div>${c.track} — Lv ${c.level}</div><div>Performance: ${c.performance}/100</div>`;

  // Memories + moodlets
  const mem = getRecentMemories(sim, 5);
  const memoriesHTML = mem.length
    ? mem.map(m => `<div>• ${m.event} <span style="opacity:.7">(${m.emotion})</span></div>`).join("")
    : `<div style="opacity:.7">No memories yet</div>`;

  const moodlets = (sim.moodlets || []);
  const moodletsHTML = moodlets.length
    ? `<div style="margin-top:8px; opacity:.95; font-weight:900;">Moodlets</div>` +
      moodlets.slice(-5).reverse().map(m => `<div>• ${m.name}</div>`).join("")
    : `<div style="margin-top:8px; opacity:.7">No moodlets</div>`;

  document.getElementById("memories").innerHTML = memoriesHTML + moodletsHTML;

  // Family
  document.getElementById("family").innerHTML = getFamilySummary(sim);

  // Lots quick card
  const lot = state.lots?.[sim.location?.lotId] || getActiveLot();
  const room = lot?.rooms?.[sim.location?.roomId];
  const lotsEl = document.getElementById("lots");
  if (lotsEl) {
    lotsEl.innerHTML = `
      <div><b>Lot:</b> ${lot?.name ?? "—"}</div>
      <div><b>Room:</b> ${room?.name ?? "—"}</div>
      <div class="small" style="margin-top:6px;">Tip: Open Lots panel to walk rooms.</div>
    `;
  }
}

/* Queue rendering (progress bars) */
function pct(done, total){
  if (!total || total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
}

function renderQueue(sim){
  const el = document.getElementById("queue");
  if (!el) return;

  sim.queue = sim.queue || [];

  el.innerHTML = sim.queue.length
    ? sim.queue.map((a, i) => {
        const p = pct(a.stepsDone, a.stepsTotal);
        return `
          <div class="queue-item">
            <div class="queue-left">
              <div class="queue-label">${i===0 ? "▶️ " : ""}${a.label}</div>
              <div class="queue-bar"><div class="queue-fill" style="width:${p}%"></div></div>
              <div class="queue-pct">${p}%</div>
            </div>
            <div class="queue-buttons">
              <button onclick="moveAction('${a.id}',-1)" title="Up">⬆</button>
              <button onclick="moveAction('${a.id}',1)" title="Down">⬇</button>
              ${a.cancelable ? `<button onclick="cancelAction('${a.id}')" title="Cancel">✖</button>` : ""}
            </div>
          </div>
        `;
      }).join("")
    : `<div style="opacity:.6">No actions queued</div>`;
}

/* Household Panel */
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
        <div style="font-weight:1000">${sim.name}</div>
        <div class="small">${sim.age} • ${sim.traits?.[0]?.name ?? ""}</div>
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

/* Lots Panel */
export function openLots(){
  document.getElementById("lotsPanel").style.display = "flex";
  renderLotsPanel();
}

export function closeLots(){
  document.getElementById("lotsPanel").style.display = "none";
}

export function renderLotsPanel(){
  const list = document.getElementById("lots-list");
  const rooms = document.getElementById("rooms-list");
  const sim = getActiveSim();

  // Lots list
  list.innerHTML = "";
  listLots().forEach(l => {
    const active = l.id === state.activeLotId;
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `
      <div>
        <div style="font-weight:1000">${l.name}</div>
        <div class="small">${Object.keys(l.rooms||{}).length} rooms</div>
      </div>
      <button class="btn ${active ? "primary" : ""}" onclick="setActiveLotUI('${l.id}')">
        ${active ? "Active" : "Use"}
      </button>
    `;
    list.appendChild(div);
  });

  // Rooms list for active lot
  const lot = state.lots[state.activeLotId];
  rooms.innerHTML = "";

  Object.values(lot.rooms || {}).forEach(r => {
    const isHere = sim.location?.lotId === lot.id && sim.location?.roomId === r.id;
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `
      <div>
        <div style="font-weight:1000">${r.name}</div>
        <div class="small">${isHere ? "Sim is here" : "Tap Walk to go"}</div>
      </div>
      <button class="btn primary" onclick="walkToRoom('${lot.id}','${r.id}')">
        ${isHere ? "Here" : "Walk"}
      </button>
    `;
    rooms.appendChild(div);
  });
}

/* UI helpers exposed globally */
export function createLotUI(){
  const name = prompt("Lot name?", "New Lot") || "New Lot";
  createLot(name);
  renderLotsPanel();
}

export function addRoomUI(){
  const name = prompt("Room name?", "New Room") || "New Room";
  addRoom(state.activeLotId, name);
  renderLotsPanel();
}

export function setActiveLotUI(lotId){
  setActiveLot(lotId);
  renderLotsPanel();
}
