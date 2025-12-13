import { state } from "./state.js";

export function tickNeeds() {
  state.sim.needs.hunger -= 2;
  state.sim.needs.energy -= 1;
  state.sim.needs.social -= 1;

  Object.keys(state.sim.needs).forEach(n => {
    state.sim.needs[n] = Math.max(0, state.sim.needs[n]);
  });
}
