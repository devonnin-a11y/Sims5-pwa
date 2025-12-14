// Memory model: { event, emotion, strength, decayRate, dayStamp }
import { state } from "./state.js";

export function addMemory(sim, event, emotion = "Fine", strength = 0.5) {
  sim.memories = sim.memories || [];
  sim.memories.unshift({
    event,
    emotion,
    strength: clamp(strength, 0.1, 1),
    decayRate: 0.01, // per tick
    dayStamp: state.time.day
  });

  // keep memories capped
  if (sim.memories.length > 60) sim.memories.length = 60;
}

export function tickMemories() {
  // decay for all sims
  const sims = Object.values(state.household.sims);
  sims.forEach(sim => {
    if (!sim.memories) return;
    sim.memories.forEach(m => {
      m.strength = clamp(m.strength - m.decayRate, 0, 1);
    });
    sim.memories = sim.memories.filter(m => m.strength > 0.05);
  });
}

export function getRecentMemories(sim, count = 5) {
  return (sim.memories || []).slice(0, count);
}

function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
