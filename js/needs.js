import { getActiveSim } from "./state.js";

export function tickNeeds() {
  const sim = getActiveSim();

  sim.needs.hunger -= 2;
  sim.needs.energy -= 1;
  sim.needs.social -= 1;

  for (const k of Object.keys(sim.needs)) {
    sim.needs[k] = Math.max(0, Math.min(100, sim.needs[k]));
  }
}
