import { state, getActiveSim, resetState } from "./state.js";
import { saveGame, loadGame, clearSave } from "./storage.js";
import { addMemory } from "./memory.js";

let casMode = "create"; // "create" | "edit"

function ensurePanels() {
  const cas = document.getElementById("cas");
  if (!cas) throw new Error("CAS panel missing in index.html");
}

export function openCAS(mode = "create") {
  ensurePanels();
  casMode = mode;

  const title = document.getElementById("cas-title");
  title.textContent = mode === "edit" ? "Edit Sim" : "Create-A-Sim";

  document.getElementById("cas").style.display = "flex";

  const sim = mode === "edit" ? getActiveSim() : null;

  document.getElementById("cas-name").value = sim?.name ?? "";
  document.getElementById("cas-age").value = sim?.age ?? "Young Adult";
  document.getElementById("cas-trait").value = sim?.traits?.[0]?.name ?? "Creative";

  document.getElementById("cas-save-btn").textContent = mode === "edit" ? "Save Changes" : "Create Sim";
}

export function closeCAS() {
  document.getElementById("cas").style.display = "none";
}

function createId() {
  return "sim-" + Math.random().toString(16).slice(2, 10);
}

export function submitCAS() {
  const name = document.getElementById("cas-name").value.trim() || "Sim";
  const age = document.getElementById("cas-age").value;
  const traitName = document.getElementById("cas-trait").value;

  if (casMode === "edit") {
    const sim = getActiveSim();
    sim.name = name;
    sim.age = age;

    sim.traits = sim.traits?.length ? sim.traits : [{ name: traitName, level: 1, xp: 0 }];
    sim.traits[0].name = traitName;

    addMemory(sim, "Edited identity", "Fine", 0.45);
    saveGame();
    closeCAS();
    return;
  }

  // create new sim
  const id = createId();
  state.household.sims[id] = {
    id,
    name,
    age,
    traits: [{ name: traitName, level: 1, xp: 0 }],
    needs: { hunger: 80, energy: 80, social: 80 },
    emotion: "Fine",
    autonomy: true,
    memories: [],
    relationships: { spouseId: null, parentIds: [], childIds: [] },
    skills: {
      Cooking: { level: 1, xp: 0 },
      Charisma: { level: 1, xp: 0 }
    },
    career: { track: "Unemployed", level: 0, performance: 0 }
  };

  state.household.activeSimId = id;
  saveGame();
  closeCAS();
}

export function newSim() {
  clearSave();
  resetState();
  loadGame(); // will return false but harmless
  openCAS("create");
}
