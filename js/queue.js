import { getActiveSim } from "./state.js";
import { saveGame } from "./storage.js";
import { ActionRegistry } from "./actionRegistry.js";

export function ensureQueue(sim) {
  sim.queue = sim.queue || [];
}

function newId() {
  return "q-" + Math.random().toString(16).slice(2, 10);
}

export function enqueueType(type, params = {}, opts = {}) {
  const sim = getActiveSim();
  ensureQueue(sim);

  const def = ActionRegistry[type];
  if (!def) {
    console.warn("Unknown action type:", type);
    return;
  }

  sim.queue.push({
    id: newId(),
    type,
    label: opts.label || def.label,
    cancelable: opts.cancelable !== false,
    params,
    stepsTotal: opts.stepsTotal || def.steps,
    stepsDone: 0
  });

  saveGame();
}

export function cancelAction(id) {
  const sim = getActiveSim();
  ensureQueue(sim);
  sim.queue = sim.queue.filter(a => a.id !== id);
  saveGame();
}

export function moveAction(id, dir) {
  const sim = getActiveSim();
  ensureQueue(sim);

  const i = sim.queue.findIndex(a => a.id === id);
  if (i < 0) return;

  const j = i + dir;
  if (j < 0 || j >= sim.queue.length) return;

  [sim.queue[i], sim.queue[j]] = [sim.queue[j], sim.queue[i]];
  saveGame();
}

export function tickQueue() {
  const sim = getActiveSim();
  ensureQueue(sim);

  if (sim.queue.length === 0) return;

  const item = sim.queue[0];
  const def = ActionRegistry[item.type];
  if (!def) {
    // drop broken items
    sim.queue.shift();
    saveGame();
    return;
  }

  // Run one "step" of the action per tick
  def.tick(sim, item);

  item.stepsDone = Math.min(item.stepsTotal, item.stepsDone + 1);

  // Done?
  if (item.stepsDone >= item.stepsTotal) {
    sim.queue.shift();
  }

  saveGame();
}
