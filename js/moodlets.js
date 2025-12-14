import { state, getActiveSim } from "./state.js";

export function addMoodlet(sim, name, mood, strength = 10, duration = 6) {
  sim.moodlets = sim.moodlets || [];
  sim.moodlets.push({
    name,
    mood,
    strength,
    remaining: duration
  });
}

export function tickMoodlets() {
  Object.values(state.household.sims).forEach(sim => {
    if (!sim.moodlets) return;
    sim.moodlets.forEach(m => m.remaining--);
    sim.moodlets = sim.moodlets.filter(m => m.remaining > 0);
  });
}

export function calculateMood(sim) {
  if (!sim.moodlets || sim.moodlets.length === 0) return "Fine";
  const top = [...sim.moodlets].sort((a,b)=>b.strength-a.strength)[0];
  return top.mood;
}
