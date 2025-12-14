import { enqueueType } from "./queue.js";

export function eatMeal() { enqueueType("EAT_MEAL"); }
export function socialize() { enqueueType("SOCIALIZE"); }

export function feelGoodClean() { enqueueType("FEEL_GOOD_CLEAN"); }
export function feelGoodSelfCare() { enqueueType("FEEL_GOOD_SELFCARE"); }
export function feelGoodRead() { enqueueType("FEEL_GOOD_READ"); }

export function cookMeal() { enqueueType("COOK_MEAL"); }
export function nap() { enqueueType("NAP"); }

export function walkToRoom(lotId, roomId) {
  enqueueType("WALK_TO_ROOM", { lotId, roomId });
}
