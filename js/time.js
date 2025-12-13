import { state } from "./state.js";
import { tickNeeds } from "./needs.js";
import { updateEmotion } from "./emotions.js";
import { runAutonomy } from "./autonomy.js";
import { saveGame } from "./storage.js";

export function startClock() {
  setInterval(() => {
    if (state.time.speed === 0) return;

    state.time.hour += state.time.speed;

    if (state.time.hour >= 24) {
      state.time.hour = 0;
      state.time.day += 1;
    }

    tickNeeds();
    updateEmotion();
    runAutonomy();
    saveGame();
  }, 3000);
}

export function setSpeed(speed) {
  state.time.speed = speed;
}
