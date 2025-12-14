import { state } from "./state.js";
import { addMoodlet } from "./moodlets.js";

const AGE_DAYS = {
  Child: 5,
  Teen: 7,
  "Young Adult": 12,
  Adult: 14,
  Elder: 8
};

export function tickAging() {
  Object.values(state.household.sims).forEach(sim => {
    sim.ageDays = sim.ageDays ?? 0;
    sim.ageDays++;

    if (sim.ageDays >= AGE_DAYS[sim.age]) {
      advanceAge(sim);
    }
  });
}

function advanceAge(sim) {
  sim.ageDays = 0;

  const order = ["Child","Teen","Young Adult","Adult","Elder"];
  const idx = order.indexOf(sim.age);
  if (idx < order.length - 1) {
    sim.age = order[idx + 1];
    addMoodlet(sim, "Aged up!", "Inspired", 15, 8);
  }
}
