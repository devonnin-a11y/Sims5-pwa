import { loadGame } from "./storage.js";
import { startClock } from "./time.js";
import { renderUI } from "./ui.js";
import { openCAS } from "./cas.js";
import { state } from "./state.js";
import { loadMods } from "./mods.js";
await loadMods();

loadGame();

// If only default sim exists and still named "New Sim", force CAS create
const active = state.household.sims[state.household.activeSimId];
const shouldForceCAS = !active || active.name === "New Sim";

if (shouldForceCAS) {
  openCAS("create");
}

startClock();
setInterval(renderUI, 250);



