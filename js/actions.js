import { enqueueType } from "./queue.js";

function bind(name, fn) {
  window[name] = fn;
}

/* Core actions */
bind("eatMeal", () => enqueueType("EAT_MEAL"));
bind("socialize", () => enqueueType("SOCIALIZE"));

bind("feelGoodClean", () => enqueueType("FEEL_GOOD_CLEAN"));
bind("feelGoodSelfCare", () => enqueueType("FEEL_GOOD_SELFCARE"));
bind("feelGoodRead", () => enqueueType("FEEL_GOOD_READ"));

bind("cookMeal", () => enqueueType("COOK_MEAL"));
bind("nap", () => enqueueType("NAP"));

bind("walkToRoom", (lotId, roomId) =>
  enqueueType("WALK_TO_ROOM", { lotId, roomId })
);
