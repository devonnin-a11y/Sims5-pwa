import { enqueue } from "./queue.js";
import { addMoodlet } from "./moodlets.js";
import { gainSkillXp } from "./skills.js";
import { addMemory } from "./memory.js";

// Helper: create a timed action that completes after N "ticks"
function timedAction({ label, ticks = 3, onStart, onTick, onFinish }) {
  let remaining = ticks;
  let started = false;

  return {
    label,
    run(sim) {
      if (!started) {
        started = true;
        onStart?.(sim);
      }

      // per-tick
      onTick?.(sim);

      remaining -= 1;

      if (remaining <= 0) {
        onFinish?.(sim);
        return true; // done -> queue pops it
      }

      return false; // keep running
    }
  };
}

/* ============================
   HUNGER ACTIONS
============================ */

export function eatSnack() {
  enqueue(
    timedAction({
      label: "Get a snack",
      ticks: 2,
      onStart(sim) {
        addMoodlet(sim, "Thinking about food", "Focused", 8, 3);
      },
      onTick(sim) {
        // small prep/anticipation
        sim.needs.energy = Math.max(0, sim.needs.energy - 1);
      },
      onFinish(sim) {
        sim.needs.hunger = Math.min(100, sim.needs.hunger + 20);
        addMoodlet(sim, "Had a snack", "Fine", 10, 5);
        addMemory(sim, "Grabbed a quick snack", "Fine", 0.35);
      }
    })
  );
}

export function eatMeal() {
  enqueue(
    timedAction({
      label: "Eat a meal",
      ticks: 3,
      onStart(sim) {
        addMoodlet(sim, "Preparing food", "Focused", 10, 4);
      },
      onTick(sim) {
        // consuming time/energy
        sim.needs.energy = Math.max(0, sim.needs.energy - 1);
      },
      onFinish(sim) {
        sim.needs.hunger = Math.min(100, sim.needs.hunger + 40);
        gainSkillXp(sim, "Cooking", 12);
        addMoodlet(sim, "Well fed", "Happy", 14, 7);
        addMemory(sim, "Ate a full meal", "Happy", 0.55);
      }
    })
  );
}

export function cookMeal() {
  enqueue(
    timedAction({
      label: "Cook meal",
      ticks: 4,
      onStart(sim) {
        addMoodlet(sim, "Cooking...", "Focused", 12, 5);
      },
      onTick(sim) {
        sim.needs.energy = Math.max(0, sim.needs.energy - 2);
      },
      onFinish(sim) {
        gainSkillXp(sim, "Cooking", 20);
        addMoodlet(sim, "Made something tasty", "Inspired", 14, 7);
        addMemory(sim, "Cooked a meal", "Inspired", 0.65);
        // Optional: small hunger from tasting
        sim.needs.hunger = Math.min(100, sim.needs.hunger + 10);
      }
    })
  );
}

/* ============================
   SOCIAL ACTIONS
============================ */

export function socialize() {
  enqueue(
    timedAction({
      label: "Chat with someone",
      ticks: 3,
      onStart(sim) {
        addMoodlet(sim, "Socializing", "Happy", 10, 5);
      },
      onTick(sim) {
        // light cost
        sim.needs.energy = Math.max(0, sim.needs.energy - 1);
      },
      onFinish(sim) {
        sim.needs.social = Math.min(100, sim.needs.social + 25);
        gainSkillXp(sim, "Charisma", 14);
        addMoodlet(sim, "Feeling connected", "Happy", 12, 6);
        addMemory(sim, "Had a good conversation", "Happy", 0.5);
      }
    })
  );
}

/* ============================
   ENERGY ACTIONS (optional hooks)
============================ */

export function nap() {
  enqueue(
    timedAction({
      label: "Take a nap",
      ticks: 3,
      onStart(sim) {
        addMoodlet(sim, "Getting sleepy", "Tired", 10, 4);
      },
      onTick(sim) {
        // while napping, hunger slowly drops
        sim.needs.hunger = Math.max(0, sim.needs.hunger - 1);
      },
      onFinish(sim) {
        sim.needs.energy = Math.min(100, sim.needs.energy + 35);
        addMoodlet(sim, "Rested", "Fine", 12, 6);
        addMemory(sim, "Took a nap", "Fine", 0.35);
      }
    })
  );
}

/* ============================
   DEBUG / DEV UTILITIES
============================ */

export function clearQueueAndDo(label = "Idle") {
  // If you ever add a "hard cancel all" option later
  enqueue(
    timedAction({
      label,
      ticks: 1,
      onFinish(sim) {
        addMoodlet(sim, "Reset action", "Fine", 5, 2);
      }
    })
  );
}
