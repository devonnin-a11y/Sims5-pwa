import { state } from "./state.js";

export function linkSpouses(aId, bId) {
  const a = state.household.sims[aId];
  const b = state.household.sims[bId];
  if (!a || !b) return;

  a.relationships.spouseId = bId;
  b.relationships.spouseId = aId;
}

export function addChild(parentId, childId) {
  const p = state.household.sims[parentId];
  const c = state.household.sims[childId];
  if (!p || !c) return;

  p.relationships.childIds = unique([...(p.relationships.childIds || []), childId]);
  c.relationships.parentIds = unique([...(c.relationships.parentIds || []), parentId]);
}

export function getFamilySummary(sim) {
  const sims = state.household.sims;

  const spouse = sim.relationships?.spouseId ? sims[sim.relationships.spouseId] : null;
  const parents = (sim.relationships?.parentIds || []).map(id => sims[id]).filter(Boolean);
  const children = (sim.relationships?.childIds || []).map(id => sims[id]).filter(Boolean);

  const lines = [];
  lines.push(`<div><b>Spouse:</b> ${spouse ? spouse.name : "—"}</div>`);
  lines.push(`<div><b>Parents:</b> ${parents.length ? parents.map(p => p.name).join(", ") : "—"}</div>`);
  lines.push(`<div><b>Children:</b> ${children.length ? children.map(c => c.name).join(", ") : "—"}</div>`);

  return lines.join("");
}

function unique(arr) { return [...new Set(arr)]; }
