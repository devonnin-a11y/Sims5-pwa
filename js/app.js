import { loadGame } from "./storage.js";
import { startClock } from "./time.js";
import { renderUI } from "./ui.js";
import { openCAS, closeCAS, hydrateCASFromState } from "./cas.js";
import { state } from "./state.js";

// Toggle this:
// true = skip CAS if a saved sim exists
// false = always show CAS first
const AUTO_SKIP_CAS_IF_SAVED = true;

loadGame();

// If saved sim exists, optionally skip CAS
const hasSavedSim =
  !!state.sim?.name &&
  state.sim.name !== "New Sim" &&
  state.sim.name !== "New Sim";

if (AUTO_SKIP_CAS_IF_SAVED && hasSavedSim) {
  closeCAS();
} else {
  openCAS();
  hydrateCASFromState();
}

startClock();
setInterval(renderUI, 250);
