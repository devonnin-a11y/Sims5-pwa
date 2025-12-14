import { getActiveSim } from "./state.js";
import { addMemory } from "./memory.js";

export function updateEmotion() {
  const sim = getActiveSim();
  const { hunger, energy, social } = sim.needs;

  const prev = sim.emotion;

  if (hunger < 30) sim.emotion = "Hungry";
  else if (energy < 30) sim.emotion = "Tired";
  else if (social < 30) sim.emotion = "Lonely";
  else sim.emotion = "Fine";

  if (sim.emotion !== prev) {
    addMemory(sim, `Felt ${sim.emotion}`, sim.emotion, 0.55);
  }
}
