import { state, getActiveSim } from "./state.js";
import { ObjectRegistry } from "./objectRegistry.js";
import { enqueueType } from "./queue.js";
import { calculateMood } from "./moodlets.js";
import { listLots, getActiveLot, createLot, addRoom, setActiveLot } from "./lots.js";

/* ======================
   GLOBAL HELPERS
====================== */
function bind(name, fn) {
  window[name] = fn;
}

/* ======================
   MAIN RENDER
====================== */
function renderUI() {
  const sim = getActiveSim();
  if (!sim) return;

  const lot = state.lots?.[sim.location?.lotId];
  const room = lot?.rooms?.[sim.location?.roomId];

  document.getElementById("sim-name").textContent = sim.name;
  document.getElementById("sim-trait").textContent =
    sim.traits?.[0]?.name ?? "Trait";
  document.getElementById("emotion").textContent = calculateMood(sim);

  document.querySelector("#hunger span").textContent = sim.needs.hunger;
  document.querySelector("#energy span").textContent = sim.needs.energy;
  document.querySelector("#social span").textContent = sim.needs.social;

  document.getElementById("time").textContent =
    `Day ${state.time.day} — ${String(state.time.hour).padStart(2, "0")}:00`;

  renderQueue(sim);
  renderRoomObjects(room);
  renderSkills(sim);
}

/* ======================
   QUEUE
====================== */
function renderQueue(sim) {
  const el = document.getElementById("queue");
  if (!el) return;

  el.innerHTML = sim.queue.length
    ? sim.queue.map(a => `<div>• ${a.label}</div>`).join("")
    : `<div style="opacity:.6">No actions queued</div>`;
}

/* ======================
   ROOM OBJECTS
====================== */
function renderRoomObjects(room) {
  const el = document.getElementById("room-objects");
  if (!el) return;

  if (!room) {
    el.innerHTML = `<div style="opacity:.6">No room selected</div>`;
    return;
  }

  el.innerHTML = room.objects.map(obj => {
    const def = ObjectRegistry[obj.type];
    return `
      <div class="object-card">
        <div class="object-header">${def.icon} ${def.name}</div>
        <div class="object-actions">
          ${def.actions.map(a =>
            `<button class="btn primary" onclick="objectAction('${a.action}')">${a.label}</button>`
          ).join("")}
        </div>
      </div>
    `;
  }).join("");
}

/* ======================
   SKILLS
====================== */
function renderSkills(sim) {
  const el = document.getElementById("skills");
  if (!el) return;

  el.innerHTML = Object.entries(sim.skills || {}).map(([k, v]) =>
    `<div>${k} — Lv ${v.level}</div>`
  ).join("") || `<div style="opacity:.6">No skills yet</div>`;
}

/* ======================
   GLOBAL UI ACTIONS
====================== */
bind("renderUI", renderUI);

bind("objectAction", action => enqueueType(action));

bind("openHousehold", () =>
  document.getElementById("household").style.display = "flex"
);
bind("closeHousehold", () =>
  document.getElementById("household").style.display = "none"
);

bind("openLots", () =>
  document.getElementById("lotsPanel").style.display = "flex"
);
bind("closeLots", () =>
  document.getElementById("lotsPanel").style.display = "none"
);

bind("createLotUI", () => {
  const name = prompt("Lot name?", "New Lot");
  if (name) createLot(name);
});

bind("addRoomUI", () => {
  const name = prompt("Room name?", "New Room");
  if (name) addRoom(state.activeLotId, name);
});

export { renderUI };
