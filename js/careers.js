import { state } from "./state.js";
import { addMemory } from "./memory.js";

const TRACKS = {
  Unemployed: { next: null },
  Culinary: { next: "Culinary" },
  Business: { next: "Business" }
};

export function setCareer(sim, track) {
  sim.career.track = track;
  sim.career.level = 1;
  sim.career.performance = 10;
  addMemory(sim, `Started career: ${track}`, "Fine", 0.75);
}

export function tickCareer() {
  Object.values(state.household.sims).forEach(sim => {
    if (!sim.career) return;

    // If unemployed and has cooking skill, start culinary automatically (demo behavior)
    if (sim.career.track === "Unemployed" && (sim.skills?.Cooking?.level || 0) >= 3) {
      setCareer(sim, "Culinary");
    }

    if (sim.career.track === "Unemployed") return;

    // Performance drifts with needs
    const needsPenalty =
      (sim.needs.hunger < 25 ? 8 : 0) +
      (sim.needs.energy < 25 ? 8 : 0) +
      (sim.needs.social < 25 ? 4 : 0);

    sim.career.performance = clamp(sim.career.performance + 6 - needsPenalty, 0, 100);

    // Promotion
    if (sim.career.performance >= 90) {
      sim.career.performance = 30;
      sim.career.level += 1;
      addMemory(sim, `Promoted in ${sim.career.track} to Lv ${sim.career.level}`, "Fine", 0.85);
    }
  });
}

function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
