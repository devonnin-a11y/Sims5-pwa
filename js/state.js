export const defaultState = {
  time: { day: 1, hour: 8, speed: 1 },

  // ✅ Lots / Rooms
  activeLotId: "lot-1",
  lots: {
    "lot-1": {
      id: "lot-1",
      name: "Starter Lot",
      rooms: {
        "room-1": { id: "room-1", name: "Kitchen" },
        "room-2": { id: "room-2", name: "Bedroom" },
        "room-3": { id: "room-3", name: "Living Room" }
      }
    }
  },

  household: {
    activeSimId: "sim-1",
    sims: {
      "sim-1": {
        id: "sim-1",
        name: "New Sim",
        age: "Young Adult",

        traits: [{ name: "Creative", level: 1, xp: 0 }],

        appearance: {
          body: { height: 0.5, weight: 0.5 },
          face: { jaw: 0.5, eyes: 0.5 }
        },

        // ✅ Where the Sim is in the world
        location: { lotId: "lot-1", roomId: "room-3" },

        needs: { hunger: 80, energy: 80, social: 80 },
        autonomy: true,

        memories: [],
        moodlets: [],
        queue: [],

        relationships: { spouseId: null, parentIds: [], childIds: [] },

        skills: {
          Cooking: { level: 1, xp: 0 },
          Charisma: { level: 1, xp: 0 },
          SelfCare: { level: 1, xp: 0 },
          Mindfulness: { level: 1, xp: 0 }
        },

        career: { track: "Unemployed", level: 0, performance: 0 }
      }
    }
  }
};

export const state = structuredClone(defaultState);

export function resetState() {
  const fresh = structuredClone(defaultState);
  for (const k of Object.keys(state)) delete state[k];
  Object.assign(state, fresh);
}

export function getActiveSim() {
  return state.household.sims[state.household.activeSimId];
}
