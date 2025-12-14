import { enqueueType } from "./queue.js";
import { state, getActiveSim } from "./state.js";

export function eatMeal() { enqueueType("EAT_MEAL"); }
export function socialize() { enqueueType("SOCIALIZE"); }

export function walkToRoom(lotId, roomId) {
  enqueueType("WALK_TO_ROOM", { lotId, roomId });
}

export function feelGoodClean() { enqueueType("FEEL_GOOD_CLEAN"); }
export function feelGoodSelfCare() { enqueueType("FEEL_GOOD_SELFCARE"); }
export function feelGoodRead() { enqueueType("FEEL_GOOD_READ"); }

/* Convenience: go to active lot room by id */
export function walkToRoomInActiveLot(roomId){
  const sim = getActiveSim();
  const lotId = sim.location?.lotId || state.activeLotId;
  walkToRoom(lotId, roomId);
}
