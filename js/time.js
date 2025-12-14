import { state } from "./state.js";
import { tickQueue } from "./queue.js";

let timer = null;

export function setSpeed(speed) {
  state.time.speed = speed; // 0..3
  restartClock();
}

function restartClock() {
  if (timer) clearInterval(timer);
  if (state.time.speed === 0) return;

  // Speed mapping: higher = more frequent ticks
  const ms = state.time.speed === 1 ? 900 :
             state.time.speed === 2 ? 450 :
             220;

  timer = setInterval(() => {
    // Queue ticks every interval
    tickQueue();

    // Move clock forward slowly (optional)
    // Every ~12 ticks at speed 1 = +1 hour
    if (state.time.speed === 1 && Math.random() < 0.08) advanceHour();
    if (state.time.speed === 2 && Math.random() < 0.14) advanceHour();
    if (state.time.speed === 3 && Math.random() < 0.22) advanceHour();
  }, ms);
}

function advanceHour() {
  state.time.hour += 1;
  if (state.time.hour >= 24) {
    state.time.hour = 0;
    state.time.day += 1;
  }
}

export function startClock() {
  restartClock();
}
