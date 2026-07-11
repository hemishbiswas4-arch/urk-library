// Unified data layer. Uses Firestore if firebase-config.js has been filled in
// with real values; otherwise transparently falls back to a localStorage-backed
// store (with cross-tab sync via the `storage` event) so the app is fully
// functional standalone, with no setup required.

import { firebaseConfig } from "../firebase-config.js?v=20260711f";

const isConfigured = Object.values(firebaseConfig).every(
  (v) => typeof v === "string" && v && !v.startsWith("YOUR_")
);

export const backendMode = isConfigured ? "firebase" : "local";

let db = null;
let fs = null; // firestore module functions

async function initFirebase() {
  const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js");
  const firestore = await import("https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js");
  const app = initializeApp(firebaseConfig);
  db = firestore.getFirestore(app);
  fs = firestore;
}

// Never let a slow/blocked Firebase CDN hang the app — if it doesn't come up
// within a few seconds, fall back to the local store so login still works.
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(() => resolve("__timeout__"), ms)),
  ]).then((v) => {
    if (v === "__timeout__") {
      console.warn("Firebase init timed out; using local storage for this session.");
      db = null; fs = null;
    }
    return null;
  });
}

const readyPromise = isConfigured
  ? withTimeout(
      initFirebase().catch((err) => {
        console.error("Firebase init failed, falling back to local storage", err);
      }),
      7000
    )
  : Promise.resolve(null);

// ---------------------------------------------------------------------------
// localStorage backend
// ---------------------------------------------------------------------------

function lsKey(collection) {
  return `aenc_${collection}`;
}

function lsRead(collection) {
  try {
    const raw = localStorage.getItem(lsKey(collection));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function lsWrite(collection, docs) {
  localStorage.setItem(lsKey(collection), JSON.stringify(docs));
  window.dispatchEvent(new CustomEvent("aenc-local-change", { detail: { collection } }));
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Subscribe to all docs in a collection. Calls callback(docsArray) immediately
 * and whenever the collection changes. Returns an unsubscribe function.
 */
export function subscribeCollection(collection, callback) {
  let unsub = () => {};
  let cancelled = false;

  readyPromise.then(() => {
    if (cancelled) return;
    if (db && fs) {
      const colRef = fs.collection(db, collection);
      unsub = fs.onSnapshot(colRef, (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        callback(docs);
      }, (err) => {
        console.error(`Firestore subscribe failed for ${collection}`, err);
        callback(lsRead(collection));
      });
    } else {
      const emit = () => callback(lsRead(collection));
      emit();
      const handler = (e) => {
        if (e.detail?.collection === collection) emit();
      };
      const storageHandler = (e) => {
        if (e.key === lsKey(collection)) emit();
      };
      window.addEventListener("aenc-local-change", handler);
      window.addEventListener("storage", storageHandler);
      unsub = () => {
        window.removeEventListener("aenc-local-change", handler);
        window.removeEventListener("storage", storageHandler);
      };
    }
  });

  return () => {
    cancelled = true;
    unsub();
  };
}

export async function addDoc(collection, data) {
  await readyPromise;
  if (db && fs) {
    const colRef = fs.collection(db, collection);
    await fs.addDoc(colRef, { ...data, createdAt: Date.now() });
    return;
  }
  const docs = lsRead(collection);
  docs.push({ id: uid(), ...data, createdAt: Date.now() });
  lsWrite(collection, docs);
}

export async function setDocById(collection, id, data) {
  await readyPromise;
  if (db && fs) {
    const ref = fs.doc(db, collection, id);
    await fs.setDoc(ref, data, { merge: true });
    return;
  }
  const docs = lsRead(collection);
  const idx = docs.findIndex((d) => d.id === id);
  if (idx >= 0) docs[idx] = { ...docs[idx], ...data, id };
  else docs.push({ id, ...data });
  lsWrite(collection, docs);
}

export async function deleteDocById(collection, id) {
  await readyPromise;
  if (db && fs) {
    const ref = fs.doc(db, collection, id);
    await fs.deleteDoc(ref);
    return;
  }
  const docs = lsRead(collection).filter((d) => d.id !== id);
  lsWrite(collection, docs);
}

export function safeId(raw) {
  return String(raw).replace(/[^a-zA-Z0-9_.\-:]/g, "_");
}
