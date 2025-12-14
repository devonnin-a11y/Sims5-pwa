export function mixTraits(parentA, parentB) {
  const pick = t => t[Math.floor(Math.random()*t.length)];
  return [pick([...parentA.traits, ...parentB.traits])];
}

export function createChildData(parentA, parentB) {
  return {
    age: "Child",
    traits: mixTraits(parentA, parentB),
    needs: { hunger: 90, energy: 90, social: 80 }
  };
}
