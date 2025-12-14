import { getActiveSim } from "./state.js";
import { setCareer } from "./careers.js";
import { addMoodlet } from "./moodlets.js";

export function chooseCareer(track) {
  setCareer(getActiveSim(), track);
}

export function goToWork() {
  const sim = getActiveSim();
  sim.career.performance += 15;
  sim.needs.energy -= 20;
  addMoodlet(sim, "Worked hard", "Focused", 12, 6);
}
