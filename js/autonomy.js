import { getActiveSim } from "./state.js";
import { gainSkillXp } from "./skills.js";
import { addMemory } from "./memory.js";

export function runAutonomy() {
  const sim = getActiveSim();
  if (!sim.autonomy) return;

  // Auto-eat
  if (sim.needs.hunger < 25) {
    sim.needs.hunger += 25;
    gainSkillXp(sim, "Cooking", 8);
    addMemory(sim, "Ate food", "Fine", 0.35);
  }

  // Auto-rest
  if (sim.needs.energy < 20) {
    sim.needs.energy += 22;
    addMemory(sim, "Took a rest", "Fine", 0.35);
  }

  // Auto-social
  if (sim.needs.social < 20) {
    sim.needs.social += 18;
    gainSkillXp(sim, "Charisma", 8);
    addMemory(sim, "Chatted with someone", "Fine", 0.30);
  }
}
