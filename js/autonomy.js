import { enqueue } from "./queue.js";
import { addMoodlet } from "./moodlets.js";
import { gainSkillXp } from "./skills.js";
import { addMemory } from "./memory.js";

/*
  Autonomy RULES:
  - Never directly change needs
  - Only enqueue actions
  - Respect queue length
  - Feel intentional, not spammy
*/

function timedAction({ label, ticks = 3, onStart, onTick, onFinish }) {
  let remaining = ticks;
  let started = false;

  return {
    label,
    cancelable: true,
    run(sim) {
      if (!started) {
        started = true;
        onStart?.(sim);
      }

      onTick?.(sim);
      remaining--;

      if (remaining <= 0) {
        onFinish?.(sim);
        return true;
      }

      return false;
    }
  };
}

export function runAutonomy() {
  // Called every time tick
  const sim = window.__activeSimHack
    ? window.__activeSimHack()
    : null;

  // Fallback if hack not set (safety)
  if (!sim || sim.autonomy === false) return;

  sim.queue = sim.queue || [];

  // Do NOT spam actions
  if (sim.queue.length > 0) return;

  const { hunger, energy, social } = sim.needs;

  /* =========================
     AUTONOMY PRIORITY ORDER
  ========================== */

  // STARVING
  if (hunger < 25) {
    enqueue(
      timedAction({
        label: "Autonomously eat",
        ticks: 3,
        onStart(sim) {
          addMoodlet(sim, "Very hungry", "Uncomfortable", 12, 4);
        },
        onFinish(sim) {
          sim.needs.hunger = Math.min(100, sim.needs.hunger + 40);
          addMoodlet(sim, "Relieved hunger", "Fine", 10, 5);
          addMemory(sim, "Ate because hunger was low", "Fine", 0.35);
        }
      })
    );
    return;
  }

  // EXHAUSTED
  if (energy < 20) {
    enqueue(
      timedAction({
        label: "Autonomously nap",
        ticks: 3,
        onStart(sim) {
          addMoodlet(sim, "Exhausted", "Tired", 12, 4);
        },
        onFinish(sim) {
          sim.needs.energy = Math.min(100, sim.needs.energy + 35);
          addMoodlet(sim, "Rested", "Fine", 12, 6);
          addMemory(sim, "Napped due to low energy", "Fine", 0.35);
        }
      })
    );
    return;
  }

  // LONELY
  if (social < 25) {
    enqueue(
      timedAction({
        label: "Autonomously socialize",
        ticks: 3,
        onStart(sim) {
          addMoodlet(sim, "Feeling lonely", "Sad", 10, 4);
        },
        onFinish(sim) {
          sim.needs.social = Math.min(100, sim.needs.social + 25);
          gainSkillXp(sim, "Charisma", 10);
          addMoodlet(sim, "Felt connected", "Happy", 12, 6);
          addMemory(sim, "Socialized due to loneliness", "Happy", 0.45);
        }
      })
    );
    return;
  }

  /* =========================
     IDLE AUTONOMY (TRAITS)
  ========================== */

  const primaryTrait = sim.traits?.[0]?.name;

  // Creative Sims practice skills when idle
  if (primaryTrait === "Creative") {
    enqueue(
      timedAction({
        label: "Practice creativity",
        ticks: 4,
        onStart(sim) {
          addMoodlet(sim, "Feeling creative", "Inspired", 12, 5);
        },
        onFinish(sim) {
          gainSkillXp(sim, "Cooking", 10);
          addMoodlet(sim, "Expressed creativity", "Inspired", 14, 6);
          addMemory(sim, "Did something creative autonomously", "Inspired", 0.5);
        }
      })
    );
    return;
  }

  // Default idle behavior
  enqueue(
    timedAction({
      label: "Idle",
      ticks: 2,
      onStart(sim) {
        addMoodlet(sim, "Idle", "Fine", 5, 2);
      },
      onFinish() {
        // no-op
      }
    })
  );
}

/* =========================
   BRIDGE: ACTIVE SIM ACCESS
   (keeps autonomy decoupled)
========================== */

// This avoids circular imports while staying safe
import { getActiveSim } from "./state.js";
window.__activeSimHack = () => getActiveSim();
