import { loadGame } from "./storage.js";
import { startClock } from "./time.js";
import { renderUI } from "./ui.js";
import { state } from "./state.js";
import { openCAS } from "./cas.js";

loadGame();

const sim = state.household?.sims?.[state.household.activeSimId];
if (!sim || sim.name === "New Sim") {
  openCAS("create");
}

startClock();
renderUI();
setInterval(renderUI, 250);
