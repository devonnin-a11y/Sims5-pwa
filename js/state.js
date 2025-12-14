export const defaultState = {
  time: {
    day: 1,
    hour: 8,
    speed: 1, // 0=pause,1=normal,2=fast,3=ultra
  },
  sim: {
    name: "New Sim",
    age: "Young Adult",
    traits: ["Creative"],
    needs: {
      hunger: 80,
      energy: 80,
      social: 80
    },
    emotion: "Fine",
    autonomy: true
  }
};

// This is the live mutable state used by the app
export const state = structuredClone(defaultState);

export function resetState() {
  // Reset in-place so imports keep referencing the same object
  const fresh = structuredClone(defaultState);

  // Clear existing keys
  for (const k of Object.keys(state)) delete state[k];

  // Refill
  Object.assign(state, fresh);
}
