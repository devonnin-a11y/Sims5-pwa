import { state } from "./state.js";

export function createLot(name) {
  state.lots = state.lots || {};
  const id = "lot-" + crypto.randomUUID();

  state.lots[id] = {
    id,
    name,
    rooms: {}
  };

  state.activeLotId = id;
}

export function addRoom(lotId, roomName) {
  state.lots[lotId].rooms[crypto.randomUUID()] = {
    name: roomName,
    objects: []
  };
}
