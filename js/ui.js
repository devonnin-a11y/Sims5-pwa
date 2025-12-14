import { state, getActiveSim } from "./state.js";
import { cancelAction, moveAction } from "./queue.js";
import { calculateMood } from "./moodlets.js";

export function renderUI() {
  const sim = getActiveSim();

  document.getElementById("sim-name").textContent = sim.name;
  document.getElementById("sim-trait").textContent = sim.traits?.[0]?.name ?? "";

  document.getElementById("time").textContent =
    `Day ${state.time.day} — ${String(state.time.hour).padStart(2,"0")}:00`;

  document.querySelector("#hunger span").textContent = sim.needs.hunger;
  document.querySelector("#energy span").textContent = sim.needs.energy;
  document.querySelector("#social span").textContent = sim.needs.social;

  document.getElementById("emotion").textContent = calculateMood(sim);

  renderQueue(sim);
}

function renderQueue(sim) {
  const el = document.getElementById("queue");
  if (!el) return;

  el.innerHTML = sim.queue?.length
    ? sim.queue.map((a,i)=>`
      <div class="queue-item">
        <span>${i===0 ? "▶️" : ""} ${a.label}</span>
        <div>
          <button onclick="moveAction('${a.id}',-1)">⬆</button>
          <button onclick="moveAction('${a.id}',1)">⬇</button>
          ${a.cancelable ? `<button onclick="cancelAction('${a.id}')">✖</button>` : ""}
        </div>
      </div>
    `).join("")
    : `<div style="opacity:.6">No actions queued</div>`;
}
