export const defaultState = {
  time: { day: 1, hour: 8, speed: 1 },

  household: {
    activeSimId: "sim-1",
    sims: {
      "sim-1": {
        id: "sim-1",
        name: "New Sim",
        age: "Young Adult",
        traits: [
          { name: "Creative", level: 1, xp: 0 }
        ],
        needs: { hunger: 80, energy: 80, social: 80 },
        emotion: "Fine",
        autonomy: true,

        // Systems
        memories: [],
        relationships: {
          spouseId: null,
          parentIds: [],
          childIds: []
        },
        skills: {
          Cooking: { level: 1, xp: 0 },
          Charisma: { level: 1, xp: 0 }
        },
        career: {
          track: "Unemployed",
          level: 0,
          performance: 0
        }
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
  const id = state.household.activeSimId;
  return state.household.sims[id];
}
