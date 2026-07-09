import { subscribeCollection, setDocById, safeId } from "./dataService.js";
import { subscribeMembers } from "./auth.js";

export const STATE = {
  members: [],
  notes: [],
  progress: [],
  factbank: [],
  optionsbank: [],
};

const listeners = new Set();
export function onChange(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function emit() {
  listeners.forEach((cb) => cb());
}

let booted = false;
export function bootStore() {
  if (booted) return;
  booted = true;
  subscribeMembers((members) => { STATE.members = members; emit(); });
  subscribeCollection("notes", (docs) => { STATE.notes = docs; emit(); });
  subscribeCollection("progress", (docs) => { STATE.progress = docs; emit(); });
  subscribeCollection("factbank", (docs) => { STATE.factbank = docs; emit(); });
  subscribeCollection("optionsbank", (docs) => { STATE.optionsbank = docs; emit(); });
}

export function notesFor(itemId) {
  return STATE.notes.filter((n) => n.itemId === itemId).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
}

export function noteCountFor(itemId) {
  return STATE.notes.filter((n) => n.itemId === itemId).length;
}

function progressId(itemType, itemId, author) {
  return safeId(`${author.toLowerCase()}::${itemType}::${itemId}`);
}

export function isDoneBy(itemType, itemId, author) {
  const id = progressId(itemType, itemId, author);
  const p = STATE.progress.find((d) => d.id === id);
  return !!p?.done;
}

export function toggleProgress(itemType, itemId, author, checked) {
  const id = progressId(itemType, itemId, author);
  return setDocById("progress", id, { author, itemType, itemId, done: checked, updatedAt: Date.now() });
}

export function doneCountFor(itemType, itemId) {
  return STATE.progress.filter((d) => d.itemType === itemType && d.itemId === itemId && d.done).length;
}

export function membersWhoDid(itemType, itemId) {
  return STATE.members.filter((m) => isDoneBy(itemType, itemId, m.name));
}
