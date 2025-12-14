import { state, getActiveSim } from "./state.js";
import { getRecentMemories } from "./memory.js";
import { getFamilySummary } from "./relationships.js";

export function renderUI() {
  const sim = getActiveSim();

  document.querySelector("#hunger span").textContent = sim.needs.hunger;
  document.querySelector("#energy span").textContent = sim.needs.energy;
  document.querySelector("#social span").textContent = sim.needs.social;
  document.querySelector("#emotion").textContent = sim.emotion;

  document.getElementById("time").textContent =
    `Day ${state.time.day} — ${String(state.time.hour).padStart(2, "0")}:00`;

  // ✅ Upgrade: show name + trait
  document.getElementById("sim-name").textContent = sim.name;
  document.getElementById("sim-trait").textContent = sim.traits?.[0]?.name ?? "Trait";

  // Skills
  const skillsEl = document.getElementById("skills");
  skillsEl.innerHTML = Object.entries(sim.skills)
    .map(([name, s]) => `<div>${name}: Lv ${s.level} (${s.xp}/100)</div>`)
    .join("");

  // Career
  const c = sim.career;
  document.getElementById("career").innerHTML =
    `<div>${c.track} — Lv ${c.level}</div>
     <div>Performance: ${c.performance}/100</div>`;

  // Memories
  const mem = getRecentMemories(sim, 5);
  document.getElementById("memories").innerHTML =
    mem.length
      ? mem.map(m => `<div>• ${m.event} <span style="opacity:.7">(${m.emotion})</span></div>`).join("")
      : `<div style="opacity:.7">No memories yet</div>`;

  // Family
  document.getElementById("family").innerHTML = getFamilySummary(sim);
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

  const sims = Object.values(state.household.sims);

  sims.forEach(sim => {
    const active = sim.id === state.household.activeSimId;
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `
      <div>
        <div style="font-weight:800">${sim.name}</div>
        <div style="opacity:.8; font-size:12px">${sim.age} • ${sim.traits?.[0]?.name ?? ""}</div>
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
