import { state } from "./state.js";
import { addMemory } from "./memory.js";

export function tickTraitEvolution() {
  const sims = Object.values(state.household.sims);

  sims.forEach(sim => {
    if (!sim.traits?.length) return;

    // Simple rule: repeated needs pain pushes traits
    const hungry = sim.needs?.hunger < 25;
    const lonely = sim.needs?.social < 25;

    // Trait XP drift
    sim.traits.forEach(t => {
      if (t.name === "Active" && sim.needs.energy > 60) t.xp += 2;
      if (t.name === "Lazy" && sim.needs.energy < 30) t.xp += 2;
      if (t.name === "Family-Oriented" && lonely) t.xp += 2;
      if (t.name === "Genius" && sim.skills?.Cooking?.level >= 3) t.xp += 1;
      if (hungry && t.name === "Creative") t.xp += 1; // stress can deepen creative obsession

      // Level up
      if (t.xp >= 100) {
        t.xp = 0;
        t.level = Math.min(5, (t.level || 1) + 1);
        addMemory(sim, `Trait deepened: ${t.name} Lv${t.level}`, "Fine", 0.65);
      }
    });
  });
}
