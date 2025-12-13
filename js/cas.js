import { state } from "./state.js";
import { saveGame } from "./storage.js";

export function openCAS() {
  document.getElementById("cas").style.display = "flex";
}

export function closeCAS() {
  document.getElementById("cas").style.display = "none";
}

export function submitCAS() {
  state.sim.name = document.getElementById("cas-name").value || "Sim";
  state.sim.age = document.getElementById("cas-age").value;
  state.sim.traits = [document.getElementById("cas-trait").value];

  saveGame();
  closeCAS();
}
