import { getActiveSim } from "./state.js";
import { addMoodlet } from "./moodlets.js";
import { gainSkillXp } from "./skills.js";

export function eatSnack() {
  const sim = getActiveSim();
  sim.needs.hunger += 20;
  addMoodlet(sim, "Had a snack", "Fine", 8, 4);
}

export function eatMeal() {
  const sim = getActiveSim();
  sim.needs.hunger += 40;
  gainSkillXp(sim, "Cooking", 10);
  addMoodlet(sim, "Ate a meal", "Happy", 12, 6);
}

export function socialize() {
  const sim = getActiveSim();
  sim.needs.social += 25;
  gainSkillXp(sim, "Charisma", 10);
  addMoodlet(sim, "Socialized", "Happy", 10, 5);
}
