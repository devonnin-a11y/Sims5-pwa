export const ObjectRegistry = {
  FRIDGE: {
    name: "Fridge",
    icon: "🧊",
    actions: [
      { label: "Get leftovers", action: "EAT_MEAL" },
      { label: "Cook meal", action: "COOK_MEAL" }
    ]
  },

  BED: {
    name: "Bed",
    icon: "🛏️",
    actions: [
      { label: "Sleep", action: "NAP" }
    ]
  },

  SHOWER: {
    name: "Shower",
    icon: "🚿",
    actions: [
      { label: "Take shower", action: "FEEL_GOOD_SELFCARE" }
    ]
  },

  COUCH: {
    name: "Couch",
    icon: "🛋️",
    actions: [
      { label: "Relax", action: "FEEL_GOOD_READ" },
      { label: "Nap on couch", action: "NAP" }
    ]
  },

  COUNTER: {
    name: "Counter",
    icon: "🍳",
    actions: [
      { label: "Practice cooking", action: "COOK_MEAL" }
    ]
  }
};
