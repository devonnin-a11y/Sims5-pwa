import { state, getActiveSim } from "./state.js";
import { saveGame } from "./storage.js";

function id(prefix){
  return `${prefix}-${Math.random().toString(16).slice(2,10)}`;
}

export function getActiveLot(){
  return state.lots[state.activeLotId];
}

export function listLots(){
  return Object.values(state.lots || {});
}

export function createLot(name = "New Lot"){
  state.lots = state.lots || {};
  const lotId = id("lot");
  state.lots[lotId] = { id: lotId, name, rooms: {} };
  state.activeLotId = lotId;

  // Add a default room
  addRoom(lotId, "Main Room");

  // Move active sim to the new lot
  const sim = getActiveSim();
  const roomId = Object.keys(state.lots[lotId].rooms)[0];
  sim.location = { lotId, roomId };

  saveGame();
}

export function renameLot(lotId, name){
  const lot = state.lots[lotId];
  if (!lot) return;
  lot.name = name;
  saveGame();
}

export function addRoom(lotId, roomName = "New Room"){
  const lot = state.lots[lotId];
  if (!lot) return;
  const roomId = id("room");
  lot.rooms[roomId] = { id: roomId, name: roomName };
  saveGame();
  return roomId;
}

export function renameRoom(lotId, roomId, name){
  const room = state.lots?.[lotId]?.rooms?.[roomId];
  if (!room) return;
  room.name = name;
  saveGame();
}

export function setActiveLot(lotId){
  if (!state.lots[lotId]) return;
  state.activeLotId = lotId;

  // If sim is not on this lot, move them to first room
  const sim = getActiveSim();
  const firstRoomId = Object.keys(state.lots[lotId].rooms || {})[0];
  if (firstRoomId) sim.location = { lotId, roomId: firstRoomId };

  saveGame();
}
