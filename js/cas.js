import { state } from "./state.js";
import { saveGame } from "./storage.js";

export function openCAS() {
  const cas = document.getElementById("cas");
  cas.style.display = "flex";
  hydrateCASFromState();
}

export function closeCAS() {
  document.getElementById("cas").style.display = "none";
}

export function hydrateCASFromState() {
  // Fill fields from current state (which should already be loaded from storage)
  const nameEl = document.getElementById("cas-name");
  const ageEl = document.getElementById("cas-age");
  const traitEl = document.getElementById("cas-trait");
  const btn = document.getElementById("cas-start-btn");

  if (nameEl) nameEl.value = state.sim?.name ?? "";
  if (ageEl) ageEl.value = state.sim?.age ?? "Young Adult";
  if (traitEl) traitEl.value = (state.sim?.traits?.[0]) ?? "Creative";

  // Button label changes if there is a meaningful saved sim
  const hasSaveSim =
    !!state.sim?.name && state.sim.name !== "New Sim" && state.sim.name !== "New Sim";

  if (btn) btn.textContent = hasSaveSim ? "Continue" : "Start Life";
}

export function submitCAS() {
  const name = document.getElementById("cas-name").value?.trim() || "Sim";
  const age = document.getElementById("cas-age").value;
  const trait = document.getElementById("cas-trait").value;

  state.sim.name = name;
  state.sim.age = age;
  state.sim.traits = [trait];

  saveGame();
  closeCAS();
}
