import { state } from "./state.js";

const KEY = "sims5-save";

export function saveGame() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    Object.assign(state, parsed);
    return true;
  } catch (e) {
    console.warn("Save load failed:", e);
    return false;
  }
}

export function clearSave() {
  localStorage.removeItem(KEY);
}
