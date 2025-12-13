import { state } from "./state.js";

export function saveGame() {
  localStorage.setItem("sims5-save", JSON.stringify(state));
}

export function loadGame() {
  const save = localStorage.getItem("sims5-save");
  if (save) {
    Object.assign(state, JSON.parse(save));
  }
}
