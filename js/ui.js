import { state } from "./state.js";

export function renderUI() {
  document.querySelector("#hunger span").textContent =
    state.sim.needs.hunger;

  document.querySelector("#energy span").textContent =
    state.sim.needs.energy;

  document.querySelector("#social span").textContent =
    state.sim.needs.social;

  document.querySelector("#emotion").textContent =
    state.sim.emotion;
}
