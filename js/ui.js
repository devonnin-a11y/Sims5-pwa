import { state, getActiveSim } from "./state.js";
import { ObjectRegistry } from "./objectRegistry.js";
import { enqueueType } from "./queue.js";
import { calculateMood } from "./moodlets.js";

export function renderUI() {
  const sim = getActiveSim();
  const lot = state.lots[sim.location.lotId];
  const room = lot.rooms[sim.location.roomId];

  document.getElementById("sim-name").textContent = sim.name;
  document.getElementById("sim-trait").textContent = sim.traits?.[0]?.name ?? "";
  document.getElementById("emotion").textContent = calculateMood(sim);

  document.querySelector("#hunger span").textContent = sim.needs.hunger;
  document.querySelector("#energy span").textContent = sim.needs.energy;
  document.querySelector("#social span").textContent = sim.needs.social;

  document.getElementById("time").textContent =
    `Day ${state.time.day} — ${String(state.time.hour).padStart(2,"0")}:00`;

  renderQueue(sim);
  renderRoomObjects(room);
}

function renderQueue(sim) {
  const el = document.getElementById("queue");
  if (!el) return;

  el.innerHTML = sim.queue.length
    ? sim.queue.map(a => `<div>• ${a.label}</div>`).join("")
    : `<div style="opacity:.6">No actions queued</div>`;
}

function renderRoomObjects(room) {
  const el = document.getElementById("room-objects");
  if (!el) return;

  el.innerHTML = `
    <div style="font-weight:900; margin-bottom:6px;">
      ${room.name}
    </div>
    ${room.objects.map(obj => {
      const def = ObjectRegistry[obj.type];
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
