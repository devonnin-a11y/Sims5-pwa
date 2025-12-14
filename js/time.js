import { state } from "./state.js";
import { tickNeeds } from "./needs.js";
import { runAutonomy } from "./autonomy.js";
import { tickQueue } from "./queue.js";
import { tickMemories } from "./memory.js";
import { tickMoodlets } from "./moodlets.js";
import { tickAging } from "./aging.js";
import { tickSkills } from "./skills.js";
import { tickCareer } from "./careers.js";
import { saveGame } from "./storage.js";

export function startClock() {
  setInterval(() => {
    if (state.time.speed === 0) return;

    state.time.hour += state.time.speed;
    if (state.time.hour >= 24) {
      state.time.hour = 0;
      state.time.day++;
    }

    tickQueue();      // 🎮 PLAYER & AI ACTIONS
    tickNeeds();
    runAutonomy();
    tickMemories();
    tickMoodlets();
    tickSkills();
    tickCareer();
    tickAging();

    saveGame();
  }, 2500);
}

export function setSpeed(speed) {
  state.time.speed = speed;
}
