import { enqueueType } from "./queue.js";

export function eatSnack() { enqueueType("EAT_SNACK"); }
export function eatMeal() { enqueueType("EAT_MEAL"); }
export function cookMeal() { enqueueType("COOK_MEAL"); }
export function socialize() { enqueueType("SOCIALIZE"); }
export function nap() { enqueueType("NAP"); }
