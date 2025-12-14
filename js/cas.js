import { state, getActiveSim, resetState } from "./state.js";
import { saveGame, loadGame, clearSave } from "./storage.js";
import { addMemory } from "./memory.js";

let casMode = "create"; // "create" | "edit"

function ensurePanel() {
  const cas = document.getElementById("cas");
  if (!cas) throw new Error("CAS panel missing in index.html");
}

function ensureAppearance(sim) {
  sim.appearance = sim.appearance || {};
  sim.appearance.body = sim.appearance.body || { height: 0.5, weight: 0.5 };
  sim.appearance.face = sim.appearance.face || { jaw: 0.5, eyes: 0.5 };

  // clamp in case old saves have weird values
  sim.appearance.body.height = clamp(sim.appearance.body.height, 0, 1);
  sim.appearance.body.weight = clamp(sim.appearance.body.weight, 0, 1);
  sim.appearance.face.jaw = clamp(sim.appearance.face.jaw, 0, 1);
  sim.appearance.face.eyes = clamp(sim.appearance.face.eyes, 0, 1);
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, Number(n)));
}

function createId() {
  return "sim-" + Math.random().toString(16).slice(2, 10);
}

// Create the appearance UI lazily (so you don't have to edit index.html again)
function injectAppearanceUI() {
  if (document.getElementById("cas-appearance")) return;

  const cas = document.getElementById("cas");
  const row = cas.querySelector(".row");
  if (!row) return;

  const wrap = document.createElement("div");
  wrap.id = "cas-appearance";
  wrap.innerHTML = `
    <div style="margin-top:14px; font-weight:900;">Appearance (slider-ready)</div>

    <label class="label">Height</label>
    <input id="cas-height" type="range" min="0" max="1" step="0.01" />

    <label class="label">Weight</label>
    <input id="cas-weight" type="range" min="0" max="1" step="0.01" />

    <label class="label">Jaw</label>
    <input id="cas-jaw" type="range" min="0" max="1" step="0.01" />

    <label class="label">Eyes</label>
    <input id="cas-eyes" type="range" min="0" max="1" step="0.01" />
  `;

  // insert right before the bottom button row
  cas.insertBefore(wrap, row);
}

export function openCAS(mode = "create") {
  ensurePanel();
  casMode = mode;

  injectAppearanceUI();

  const title = document.getElementById("cas-title");
  title.textContent = mode === "edit" ? "Edit Sim" : "Create-A-Sim";

  document.getElementById("cas").style.display = "flex";

  const sim = mode === "edit" ? getActiveSim() : null;

  document.getElementById("cas-name").value = sim?.name ?? "";
  document.getElementById("cas-age").value = sim?.age ?? "Young Adult";
  document.getElementById("cas-trait").value = sim?.traits?.[0]?.name ?? "Creative";

  // Appearance sliders
  if (sim) ensureAppearance(sim);
  const appearance = sim?.appearance || {
    body: { height: 0.5, weight: 0.5 },
    face: { jaw: 0.5, eyes: 0.5 }
  };

  const heightEl = document.getElementById("cas-height");
  const weightEl = document.getElementById("cas-weight");
  const jawEl = document.getElementById("cas-jaw");
  const eyesEl = document.getElementById("cas-eyes");

  if (heightEl) heightEl.value = appearance.body.height;
  if (weightEl) weightEl.value = appearance.body.weight;
  if (jawEl) jawEl.value = appearance.face.jaw;
  if (eyesEl) eyesEl.value = appearance.face.eyes;

  document.getElementById("cas-save-btn").textContent =
    mode === "edit" ? "Save Changes" : "Create Sim";
}

export function closeCAS() {
  document.getElementById("cas").style.display = "none";
}

function readAppearanceFromUI() {
  const height = document.getElementById("cas-height")?.value ?? 0.5;
  const weight = document.getElementById("cas-weight")?.value ?? 0.5;
  const jaw = document.getElementById("cas-jaw")?.value ?? 0.5;
  const eyes = document.getElementById("cas-eyes")?.value ?? 0.5;

  return {
    body: { height: clamp(height, 0, 1), weight: clamp(weight, 0, 1) },
    face: { jaw: clamp(jaw, 0, 1), eyes: clamp(eyes, 0, 1) }
  };
}

export function submitCAS() {
  const name = document.getElementById("cas-name").value.trim() || "Sim";
  const age = document.getElementById("cas-age").value;
  const traitName = document.getElementById("cas-trait").value;

  const appearance = readAppearanceFromUI();

  if (casMode === "edit") {
    const sim = getActiveSim();
    sim.name = name;
    sim.age = age;

    sim.traits = sim.traits?.length ? sim.traits : [{ name: traitName, level: 1, xp: 0 }];
    sim.traits[0].name = traitName;

    sim.appearance = appearance;
    ensureAppearance(sim);

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

    appearance,

    needs: { hunger: 80, energy: 80, social: 80 },
    emotion: "Fine",
    autonomy: true,

    memories: [],
    moodlets: [],
    queue: [],

    relationships: { spouseId: null, parentIds: [], childIds: [] },

    skills: {
      Cooking: { level: 1, xp: 0 },
      Charisma: { level: 1, xp: 0 }
    },

    career: { track: "Unemployed", level: 0, performance: 0 }
  };

  // ensure appearance fields are correct
  ensureAppearance(state.household.sims[id]);

  state.household.activeSimId = id;
  saveGame();
  closeCAS();
}

export function newSim() {
  clearSave();
  resetState();
  loadGame(); // harmless if none
  openCAS("create");
}
