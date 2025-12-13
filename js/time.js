import { tickNeeds } from "./needs.js";
import { updateEmotion } from "./emotions.js";
import { runAutonomy } from "./autonomy.js";
import { saveGame } from "./storage.js";

export function startClock() {
  setInterval(() => {
    tickNeeds();
    updateEmotion();
    runAutonomy();
    saveGame();
  }, 3000);
}
