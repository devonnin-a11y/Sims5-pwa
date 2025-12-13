import { loadGame } from "./storage.js";
import { startClock } from "./time.js";
import { renderUI } from "./ui.js";
import { openCAS } from "./cas.js";

loadGame();
openCAS();
startClock();

setInterval(renderUI, 500);
