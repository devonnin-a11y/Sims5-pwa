import { state } from "./state.js";

export function updateEmotion() {
  const { hunger, energy, social } = state.sim.needs;

  if (hunger < 30) state.sim.emotion = "Hungry";
  else if (energy < 30) state.sim.emotion = "Tired";
  else if (social < 30) state.sim.emotion = "Lonely";
  else state.sim.emotion = "Fine";
}
