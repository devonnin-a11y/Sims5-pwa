import { state } from "./state.js";
import { addMemory } from "./memory.js";

export function gainSkillXp(sim, skillName, amount) {
  sim.skills = sim.skills || {};
  if (!sim.skills[skillName]) sim.skills[skillName] = { level: 1, xp: 0 };

  const skill = sim.skills[skillName];
  skill.xp += amount;

  while (skill.xp >= 100) {
    skill.xp -= 100;
    skill.level = Math.min(10, skill.level + 1);
    addMemory(sim, `Leveled ${skillName} to ${skill.level}`, "Fine", 0.7);
  }
}

export function tickSkills() {
  // Passive growth based on traits/emotions (basic)
  Object.values(state.household.sims).forEach(sim => {
    const primary = sim.traits?.[0]?.name;

    if (primary === "Creative") gainSkillXp(sim, "Cooking", 2);
    if (primary === "Genius") gainSkillXp(sim, "Logic", 2);
    if (primary === "Romantic") gainSkillXp(sim, "Charisma", 2);
  });
}
