import { state } from "./state.js";

export function runAutonomy() {
  if (!state.sim.autonomy) return;

  if (state.sim.needs.hunger < 30) {
    state.sim.needs.hunger += 20;
  }
}
