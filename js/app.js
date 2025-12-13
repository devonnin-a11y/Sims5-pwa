import { loadGame } from "./storage.js";
import { startClock } from "./time.js";
import { renderUI } from "./ui.js";

loadGame();
renderUI();
startClock();

setInterval(renderUI, 500);
