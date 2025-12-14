import { addMoodlet } from "./moodlets.js";
import { gainSkillXp } from "./skills.js";
import { addMemory } from "./memory.js";
import { state } from "./state.js";

function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

export const ActionRegistry = {
  EAT_MEAL: {
    label: "Eat a meal",
    steps: 3,
    tick(sim, item) {
      if (item.stepsDone === 0) addMoodlet(sim, "Preparing food", "Focused", 10, 4);
      sim.needs.energy = clamp(sim.needs.energy - 1, 0, 100);
      if (item.stepsDone >= item.stepsTotal - 1) {
        sim.needs.hunger = clamp(sim.needs.hunger + 40, 0, 100);
        gainSkillXp(sim, "Cooking", 12);
        addMoodlet(sim, "Well fed", "Happy", 14, 7);
        addMemory(sim, "Ate a full meal", "Happy", 0.55);
      }
      return true;
    }
  },

  SOCIALIZE: {
    label: "Chat with someone",
    steps: 3,
    tick(sim, item) {
      if (item.stepsDone === 0) addMoodlet(sim, "Socializing", "Happy", 10, 5);
      sim.needs.energy = clamp(sim.needs.energy - 1, 0, 100);
      if (item.stepsDone >= item.stepsTotal - 1) {
        sim.needs.social = clamp(sim.needs.social + 25, 0, 100);
        gainSkillXp(sim, "Charisma", 14);
        addMoodlet(sim, "Feeling connected", "Happy", 12, 6);
        addMemory(sim, "Had a good conversation", "Happy", 0.50);
      }
      return true;
    }
  },

  /* ✅ NEW: Walk to room (Lots/Rooms) */
  WALK_TO_ROOM: {
    label: "Walk to room",
    steps: 3,
    tick(sim, item) {
      // params: { lotId, roomId }
      const { lotId, roomId } = item.params || {};
      const lot = state.lots?.[lotId];
      const room = lot?.rooms?.[roomId];

      if (item.stepsDone === 0) {
        addMoodlet(sim, "On the move", "Fine", 6, 3);
      }

      // final step: arrive
      if (item.stepsDone >= item.stepsTotal - 1 && lot && room) {
        sim.location = { lotId, roomId };
        addMemory(sim, `Went to ${room.name}`, "Fine", 0.30);
      }
      return true;
    }
  },

  /* ✅ Feel-good actions (Sims 4 style “boosters”) */
  FEEL_GOOD_CLEAN: {
    label: "Tidy up area",
    steps: 3,
    tick(sim, item) {
      if (item.stepsDone === 0) addMoodlet(sim, "Getting organized", "Focused", 10, 4);
      sim.needs.energy = clamp(sim.needs.energy - 2, 0, 100);
      if (item.stepsDone >= item.stepsTotal - 1) {
        addMoodlet(sim, "Space feels fresh", "Happy", 14, 7);
        gainSkillXp(sim, "Mindfulness", 10);
        addMemory(sim, "Tidied up and felt better", "Happy", 0.55);
      }
      return true;
    }
  },

  FEEL_GOOD_SELFCARE: {
    label: "Self-care routine",
    steps: 3,
    tick(sim, item) {
      if (item.stepsDone === 0) addMoodlet(sim, "Taking care of self", "Inspired", 12, 5);
      if (item.stepsDone >= item.stepsTotal - 1) {
        sim.needs.energy = clamp(sim.needs.energy + 15, 0, 100);
        addMoodlet(sim, "Refreshed", "Happy", 16, 8);
        gainSkillXp(sim, "SelfCare", 14);
        addMemory(sim, "Did a self-care routine", "Happy", 0.65);
      }
      return true;
    }
  },

  FEEL_GOOD_READ: {
    label: "Read something fun",
    steps: 3,
    tick(sim, item) {
      if (item.stepsDone === 0) addMoodlet(sim, "Curious", "Inspired", 10, 4);
      if (item.stepsDone >= item.stepsTotal - 1) {
        addMoodlet(sim, "Cozy focus", "Focused", 14, 7);
        gainSkillXp(sim, "Mindfulness", 12);
        addMemory(sim, "Read and felt calmer", "Fine", 0.50);
      }
      return true;
    }
  },

  IDLE: {
    label: "Idle",
    steps: 2,
    tick(sim, item) {
      if (item.stepsDone === 0) addMoodlet(sim, "Idle", "Fine", 5, 2);
      return true;
    }
  }
};
