import { state } from "./state.js";
import { tickNeeds } from "./needs.js";
import { updateEmotion } from "./emotions.js";
import { runAutonomy } from "./autonomy.js";
import { tickMemories } from "./memory.js";
import { tickTraitEvolution } from "./traits.js";
import { tickSkills } from "./skills.js";
import { tickCareer } from "./careers.js";
import { tickMoodlets } from "./moodlets.js";
import { tickAging } from "./aging.js";
import { saveGame } from "./storage.js";

export function startClock() {
  setInterval(() => {
    if (state.time.speed === 0) return;

    state.time.hour += state.time.speed;

    if (state.time.hour >= 24) {
      state.time.hour = 0;
      state.time.day += 1;
    }

    // Core loops
    tickNeeds();
    updateEmotion();
    runAutonomy();

    // Systems
    tickMemories();
    tickTraitEvolution();
    tickSkills();
    tickCareer();

    // NEW: Moodlets + Aging
    tickMoodlets();
    tickAging();

    saveGame();
  }, 3000);
}

export function setSpeed(speed) {
  state.time.speed = speed;
}
