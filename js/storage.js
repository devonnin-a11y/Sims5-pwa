import { state } from "./state.js";

const KEY = "sims5-save";

export function saveGame() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function loadGame() {
  try {
    const save = localStorage.getItem(KEY);
    if (!save) return;
    const parsed = JSON.parse(save);

    // Merge into current state safely
    Object.assign(state, parsed);
  } catch (e) {
    console.warn("Save load failed:", e);
  }
}

export function clearSave() {
  localStorage.removeItem(KEY);
}
