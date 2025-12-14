import { loadGame } from "./storage.js";
import { startClock } from "./time.js";
import { renderUI } from "./ui.js";
import { openCAS } from "./cas.js";
import { state } from "./state.js";

loadGame();

// Force CAS on first run
const active = state.household.sims[state.household.activeSimId];
if (!active || active.name === "New Sim") openCAS("create");

startClock();
setInterval(renderUI, 250);
