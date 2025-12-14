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
      if (item.stepsDone === 0) addMoodlet(sim, "Eating", "Happy", 10, 5);
      sim.needs.energy = clamp(sim.needs.energy - 1, 0, 100);

      if (item.stepsDone >= item.stepsTotal - 1) {
        sim.needs.hunger = clamp(sim.needs.hunger + 40, 0, 100);
        gainSkillXp(sim, "Cooking", 8);
        addMoodlet(sim, "Well fed", "Happy", 14, 7);
        addMemory(sim, "Ate a meal", "Happy", 0.55);
      }
      return true;
    }
  },

  SOCIALIZE: {
    label: "Chat with someone",
    steps: 3,
    tick(sim, item) {
      if (item.stepsDone === 0) addMoodlet(sim, "Talking", "Happy", 10, 5);
      sim.needs.energy = clamp(sim.needs.energy - 1, 0, 100);

      if (item.stepsDone >= item.stepsTotal - 1) {
        sim.needs.social = clamp(sim.needs.social + 25, 0, 100);
        gainSkillXp(sim, "Charisma", 10);
        addMoodlet(sim, "Feeling connected", "Happy", 12, 6);
        addMemory(sim, "Socialized", "Happy", 0.50);
      }
      return true;
    }
  },

  // ✅ MISSING ACTION (from your object registry)
  COOK_MEAL: {
    label: "Cook a meal",
    steps: 4,
    tick(sim, item) {
      if (item.stepsDone === 0) addMoodlet(sim, "Cooking", "Focused", 12, 6);
      sim.needs.energy = clamp(sim.needs.energy - 2, 0, 100);

      if (item.stepsDone >= item.stepsTotal - 1) {
        sim.needs.hunger = clamp(sim.needs.hunger + 30, 0, 100);
        gainSkillXp(sim, "Cooking", 18);
        addMoodlet(sim, "Homestyle meal", "Inspired", 14, 7);
        addMemory(sim, "Cooked something tasty", "Inspired", 0.60);
      }
      return true;
    }
  },

  // ✅ MISSING ACTION (from your object registry)
  NAP: {
    label: "Take a nap",
    steps: 4,
    tick(sim, item) {
      if (item.stepsDone === 0) addMoodlet(sim, "Resting", "Fine", 8, 6);

      if (item.stepsDone >= item.stepsTotal - 1) {
        sim.needs.energy = clamp(sim.needs.energy + 35, 0, 100);
        sim.needs.hunger = clamp(sim.needs.hunger - 5, 0, 100);
        addMoodlet(sim, "Recharged", "Happy", 12, 7);
        addMemory(sim, "Took a nap", "Happy", 0.55);
      }
      return true;
    }
  },

  WALK_TO_ROOM: {
    label: "Walk to room",
    steps: 3,
    tick(sim, item) {
      const { lotId, roomId } = item.params || {};
      const lot = state.lots?.[lotId];
      const room = lot?.rooms?.[roomId];

      if (item.stepsDone === 0) addMoodlet(sim, "Heading over", "Fine", 6, 3);

      if (item.stepsDone >= item.stepsTotal - 1 && lot && room) {
        sim.location = { lotId, roomId };
        addMemory(sim, `Went to ${room.name}`, "Fine", 0.30);
      }
      return true;
    }
  },

  FEEL_GOOD_CLEAN: {
    label: "Tidy up",
    steps: 3,
    tick(sim, item) {
      if (item.stepsDone === 0) addMoodlet(sim, "Tidying", "Focused", 10, 5);
      sim.needs.energy = clamp(sim.needs.energy - 2, 0, 100);

      if (item.stepsDone >= item.stepsTotal - 1) {
        addMoodlet(sim, "Fresh space", "Happy", 14, 7);
        gainSkillXp(sim, "SelfCare", 8);
        addMemory(sim, "Tidied up", "Happy", 0.55);
      }
      return true;
    }
  },

  FEEL_GOOD_SELFCARE: {
    label: "Self-care",
    steps: 3,
    tick(sim, item) {
      if (item.stepsDone === 0) addMoodlet(sim, "Self-care", "Inspired", 12, 6);

      if (item.stepsDone >= item.stepsTotal - 1) {
        sim.needs.energy = clamp(sim.needs.energy + 18, 0, 100);
        addMoodlet(sim, "Refreshed", "Happy", 16, 8);
        gainSkillXp(sim, "SelfCare", 14);
        addMemory(sim, "Did self-care", "Happy", 0.65);
      }
      return true;
    }
  },

  FEEL_GOOD_READ: {
    label: "Read & relax",
    steps: 3,
    tick(sim, item) {
      if (item.stepsDone === 0) addMoodlet(sim, "Reading", "Focused", 10, 6);

      if (item.stepsDone >= item.stepsTotal - 1) {
        addMoodlet(sim, "Cozy calm", "Fine", 12, 8);
        gainSkillXp(sim, "Charisma", 6);
        addMemory(sim, "Read something fun", "Fine", 0.50);
      }
      return true;
    }
  }
};
