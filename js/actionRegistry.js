import { addMoodlet } from "./moodlets.js";
import { gainSkillXp } from "./skills.js";
import { addMemory } from "./memory.js";

function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

export const ActionRegistry = {
  EAT_SNACK: {
    label: "Get a snack",
    steps: 2,
    tick(sim, item) {
      if (item.stepsDone === 0) addMoodlet(sim, "Thinking about food", "Focused", 8, 3);
      sim.needs.energy = clamp(sim.needs.energy - 1, 0, 100);
      if (item.stepsDone >= item.stepsTotal - 1) {
        sim.needs.hunger = clamp(sim.needs.hunger + 20, 0, 100);
        addMoodlet(sim, "Had a snack", "Fine", 10, 5);
        addMemory(sim, "Grabbed a quick snack", "Fine", 0.35);
      }
      return true;
    }
  },

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

  COOK_MEAL: {
    label: "Cook meal",
    steps: 4,
    tick(sim, item) {
      if (item.stepsDone === 0) addMoodlet(sim, "Cooking...", "Focused", 12, 5);
      sim.needs.energy = clamp(sim.needs.energy - 2, 0, 100);
      if (item.stepsDone >= item.stepsTotal - 1) {
        gainSkillXp(sim, "Cooking", 20);
        addMoodlet(sim, "Made something tasty", "Inspired", 14, 7);
        addMemory(sim, "Cooked a meal", "Inspired", 0.65);
        sim.needs.hunger = clamp(sim.needs.hunger + 10, 0, 100);
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

  NAP: {
    label: "Take a nap",
    steps: 3,
    tick(sim, item) {
      if (item.stepsDone === 0) addMoodlet(sim, "Getting sleepy", "Tired", 10, 4);
      sim.needs.hunger = clamp(sim.needs.hunger - 1, 0, 100);
      if (item.stepsDone >= item.stepsTotal - 1) {
        sim.needs.energy = clamp(sim.needs.energy + 35, 0, 100);
        addMoodlet(sim, "Rested", "Fine", 12, 6);
        addMemory(sim, "Took a nap", "Fine", 0.35);
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
  },

  PRACTICE_CREATIVITY: {
    label: "Practice creativity",
    steps: 4,
    tick(sim, item) {
      if (item.stepsDone === 0) addMoodlet(sim, "Feeling creative", "Inspired", 12, 5);
      if (item.stepsDone >= item.stepsTotal - 1) {
        gainSkillXp(sim, "Cooking", 10);
        addMoodlet(sim, "Expressed creativity", "Inspired", 14, 6);
        addMemory(sim, "Did something creative autonomously", "Inspired", 0.5);
      }
      return true;
    }
  },

  AUTO_EAT: {
    label: "Autonomously eat",
    steps: 3,
    tick(sim, item) {
      if (item.stepsDone === 0) addMoodlet(sim, "Very hungry", "Uncomfortable", 12, 4);
      if (item.stepsDone >= item.stepsTotal - 1) {
        sim.needs.hunger = clamp(sim.needs.hunger + 40, 0, 100);
        addMoodlet(sim, "Relieved hunger", "Fine", 10, 5);
        addMemory(sim, "Ate because hunger was low", "Fine", 0.35);
      }
      return true;
    }
  },

  AUTO_NAP: {
    label: "Autonomously nap",
    steps: 3,
    tick(sim, item) {
      if (item.stepsDone === 0) addMoodlet(sim, "Exhausted", "Tired", 12, 4);
      if (item.stepsDone >= item.stepsTotal - 1) {
        sim.needs.energy = clamp(sim.needs.energy + 35, 0, 100);
        addMoodlet(sim, "Rested", "Fine", 12, 6);
        addMemory(sim, "Napped due to low energy", "Fine", 0.35);
      }
      return true;
    }
  },

  AUTO_SOCIAL: {
    label: "Autonomously socialize",
    steps: 3,
    tick(sim, item) {
      if (item.stepsDone === 0) addMoodlet(sim, "Feeling lonely", "Sad", 10, 4);
      if (item.stepsDone >= item.stepsTotal - 1) {
        sim.needs.social = clamp(sim.needs.social + 25, 0, 100);
        gainSkillXp(sim, "Charisma", 10);
        addMoodlet(sim, "Felt connected", "Happy", 12, 6);
        addMemory(sim, "Socialized due to loneliness", "Happy", 0.45);
      }
      return true;
    }
  }
};
