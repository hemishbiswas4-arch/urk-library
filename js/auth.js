import { subscribeCollection, addDoc, setDocById, safeId } from "./dataService.js?v=20260709b";

const ME_KEY = "aenc_me";

export function getMe() {
  try {
    const raw = localStorage.getItem(ME_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearMe() {
  localStorage.removeItem(ME_KEY);
}

function readTeamPin() {
  return new Promise((resolve) => {
    const unsub = subscribeCollection("meta", (docs) => {
      const pinDoc = docs.find((d) => d.id === "team_pin");
      resolve(pinDoc ? pinDoc.pin : null);
      unsub();
    });
  });
}

/**
 * Attempt login. First person to ever log in sets the team PIN; everyone
 * after must match it. Resolves { ok: true } or { ok: false, error }.
 */
export async function attemptLogin(name, pin) {
  name = name.trim();
  pin = pin.trim();
  if (!name || !pin) return { ok: false, error: "Enter both a name and a PIN." };

  const existingPin = await readTeamPin();

  if (existingPin === null) {
    await setDocById("meta", "team_pin", { pin });
  } else if (existingPin !== pin) {
    return { ok: false, error: "That PIN doesn't match your team's PIN. Ask a teammate." };
  }

  await setDocById("members", safeId(name.toLowerCase()), { name, lastSeen: Date.now() });

  const me = { name };
  localStorage.setItem(ME_KEY, JSON.stringify(me));
  return { ok: true, me };
}

export function subscribeMembers(callback) {
  return subscribeCollection("members", (docs) => {
    callback(docs.sort((a, b) => a.name.localeCompare(b.name)));
  });
}
