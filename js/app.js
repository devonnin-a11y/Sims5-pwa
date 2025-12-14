import { loadGame } from "./storage.js";
import { startClock } from "./time.js";
import { renderUI } from "./ui.js";
import { openCAS } from "./cas.js";
import { state } from "./state.js";
import { playSound } from "./sound.js";

loadGame();

const active = state.household.sims[state.household.activeSimId];
if (!active || active.name === "New Sim") openCAS("create");

document.addEventListener("click", e => {
  if (e.target.closest("button")) {
    playSound("click");
  }
});

startClock();
setInterval(renderUI, 250);
