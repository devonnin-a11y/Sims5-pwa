import { getActiveSim } from "./state.js";
import { enqueueType } from "./queue.js";

/*
  Autonomy:
  - Never mutate needs directly
  - Only enqueue actions
  - Don’t spam: only enqueue if queue is empty
*/

export function runAutonomy() {
  const sim = getActiveSim();
  if (!sim || sim.autonomy === false) return;

  sim.queue = sim.queue || [];
  if (sim.queue.length > 0) return;

  const { hunger, energy, social } = sim.needs;

  // Priority order
  if (hunger < 25) { enqueueType("AUTO_EAT"); return; }
  if (energy < 20) { enqueueType("AUTO_NAP"); return; }
  if (social < 25) { enqueueType("AUTO_SOCIAL"); return; }

  // Trait-based idle
  const trait = sim.traits?.[0]?.name;
  if (trait === "Creative") { enqueueType("PRACTICE_CREATIVITY"); return; }

  // Default idle
  enqueueType("IDLE");
}
