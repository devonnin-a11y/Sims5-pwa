import { state, getActiveSim } from "./state.js";
import { linkSpouses, addChild } from "./relationships.js";

export function renderRelationshipUI() {
  const sim = getActiveSim();
  const others = Object.values(state.household.sims).filter(s => s.id !== sim.id);

  return `
    <div>
      <label>Spouse</label>
      ${others.map(o =>
        `<button onclick="setSpouse('${o.id}')">${o.name}</button>`
      ).join("")}
    </div>
  `;
}

export function setSpouse(id) {
  linkSpouses(getActiveSim().id, id);
}

export function setChild(id) {
  addChild(getActiveSim().id, id);
}
