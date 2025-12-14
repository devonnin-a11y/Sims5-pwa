import { getActiveSim } from "./state.js";
import { saveGame } from "./storage.js";

export function ensureQueue(sim) {
  sim.queue = sim.queue || [];
}

export function enqueue(action) {
  const sim = getActiveSim();
  ensureQueue(sim);

  sim.queue.push({
    id: crypto.randomUUID(),
    label: action.label,
    run: action.run,
    cancelable: action.cancelable !== false
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

  const current = sim.queue[0];
  const done = current.run(sim);

  if (done) {
    sim.queue.shift();
    saveGame();
  }
}
