import { state, getActiveSim } from "./state.js";
import { ActionRegistry } from "./actionRegistry.js";
import { saveGame } from "./storage.js";

function id() {
  return `a-${Math.random().toString(16).slice(2, 10)}`;
}

export function enqueueType(type, params = null) {
  const sim = getActiveSim();
  if (!sim) return;

  sim.queue = sim.queue || [];

  const def = ActionRegistry[type];

  // ✅ Always enqueue, even if missing
  sim.queue.push({
    id: id(),
    type,
    label: def?.label ?? `Unknown: ${type}`,
    stepsTotal: def?.steps ?? 3,
    stepsDone: 0,
    params,
    cancelable: true
  });

  saveGame?.();
}

export function cancelAction(actionId) {
  const sim = getActiveSim();
  if (!sim?.queue) return;
  sim.queue = sim.queue.filter(a => a.id !== actionId);
  saveGame?.();
}

export function moveAction(actionId, dir) {
  const sim = getActiveSim();
  if (!sim?.queue) return;

  const i = sim.queue.findIndex(a => a.id === actionId);
  if (i < 0) return;

  const j = i + dir;
  if (j < 0 || j >= sim.queue.length) return;

  const tmp = sim.queue[i];
  sim.queue[i] = sim.queue[j];
  sim.queue[j] = tmp;

  saveGame?.();
}

export function tickQueue() {
  const sim = getActiveSim();
  if (!sim) return;

  sim.queue = sim.queue || [];
  if (sim.queue.length === 0) return;

  const current = sim.queue[0];
  const def = ActionRegistry[current.type];

  // If action doesn't exist, still "progress" then finish
  if (!def || typeof def.tick !== "function") {
    current.stepsDone += 1;
    if (current.stepsDone >= current.stepsTotal) sim.queue.shift();
    saveGame?.();
    return;
  }

  // Execute step
  def.tick(sim, current);
  current.stepsDone += 1;

  // Done?
  if (current.stepsDone >= current.stepsTotal) {
    sim.queue.shift();
  }

  saveGame?.();
}
