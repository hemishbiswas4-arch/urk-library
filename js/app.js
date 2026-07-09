import { MODULES } from "../data/content.js?v=20260709b";
import { TOOL_STATIONS } from "../data/tools.js?v=20260709b";
import { MODULE_COLORS, SHELF_SHORT } from "../data/palette.js?v=20260709b";
import { backendMode } from "./dataService.js?v=20260709b";
import { getMe, clearMe, attemptLogin } from "./auth.js?v=20260709b";
import { bootStore, STATE, onChange, noteCountFor, isDoneBy } from "./store.js?v=20260709b";
import * as panel from "./panel.js?v=20260709b";
import { initLibrary } from "./scene.js?v=20260709b";

let ME = getMe();
let library = null;

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------

const loginScreen = document.getElementById("login-screen");
const appEl = document.getElementById("app");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const backendStatusEl = document.getElementById("backend-status");

backendStatusEl.textContent = backendMode === "firebase"
  ? "🔗 Connected to shared backend — the library syncs across all devices."
  : "💾 Running in local-only mode (no Firebase configured) — this browser only. See README.md to enable cross-device sync.";

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.hidden = true;
  const name = document.getElementById("login-name").value;
  const pin = document.getElementById("login-pin").value;
  const submitBtn = loginForm.querySelector("button");
  submitBtn.disabled = true;
  submitBtn.textContent = "Checking…";
  const result = await attemptLogin(name, pin);
  submitBtn.disabled = false;
  submitBtn.textContent = "Enter the library";
  if (!result.ok) {
    loginError.textContent = result.error;
    loginError.hidden = false;
    return;
  }
  ME = result.me;
  loginScreen.hidden = true;
  appEl.hidden = false;
  boot();
});

document.getElementById("logout-btn").addEventListener("click", () => {
  clearMe();
  ME = null;
  appEl.hidden = true;
  loginScreen.hidden = false;
});

function showLoginIfNeeded() {
  if (ME) {
    loginScreen.hidden = true;
    appEl.hidden = false;
    boot();
  } else {
    loginScreen.hidden = false;
    appEl.hidden = true;
  }
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

let booted = false;
function boot() {
  document.getElementById("whoami").textContent = `👋 ${ME.name}`;
  renderCountdown();
  setInterval(renderCountdown, 60000);

  bootStore();

  if (!library) {
    try {
      library = initScene();
    } catch (err) {
      console.error(err);
      document.getElementById("webgl-error").hidden = false;
      document.getElementById("scene-canvas").hidden = true;
      return;
    }
  }

  if (booted) return;
  booted = true;

  onChange(() => {
    refreshBadges();
    renderDirectory();
    panel.rerenderIfOpen();
  });
  refreshBadges();
  setupDirectory();

  document.getElementById("back-btn").addEventListener("click", () => {
    library.goToOverview();
  });

  setTimeout(() => {
    document.getElementById("hint-toast").classList.add("hidden");
  }, 6000);
}

// ---------------------------------------------------------------------------
// Directory overlay — jump straight to any shelf or desk
// ---------------------------------------------------------------------------

function setupDirectory() {
  const toggle = document.getElementById("index-toggle");
  const panelEl = document.getElementById("index-panel");
  toggle.addEventListener("click", () => {
    const open = panelEl.hidden;
    panelEl.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.style.display = open ? "none" : "block";
    if (open) renderDirectory();
  });
  renderDirectory();
}

function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

function renderDirectory() {
  const panelEl = document.getElementById("index-panel");
  if (!panelEl || panelEl.hidden) return;

  const shelfRows = MODULES.map((mod, i) => {
    const total = mod.readings.length;
    const done = ME ? mod.readings.filter((r) => isDoneBy("reading", r.id, ME.name)).length : 0;
    return `<button class="index-row" data-shelf="${mod.id}">
      <span class="index-dot" style="background:${MODULE_COLORS[i]}"></span>
      <span class="ix-name">${esc(SHELF_SHORT[mod.id] || mod.title)}</span>
      <span class="ix-prog">${done}/${total}</span>
    </button>`;
  }).join("");

  const toolRows = TOOL_STATIONS.map((t) => `
    <button class="index-row" data-tool="${t.id}">
      <span class="ix-emoji">${t.icon}</span>
      <span class="ix-name">${esc(t.label)}</span>
    </button>`).join("");

  panelEl.innerHTML = `
    <button class="index-close" title="Close">×</button>
    <h4>Reading shelves</h4>
    ${shelfRows}
    <h4>Reference cabinet</h4>
    ${toolRows}
    <div class="index-legend">
      <div class="lg-row">
        <span class="lg-bars"><span class="lg-bar" style="height:15px"></span><span class="lg-bar" style="height:11px"></span><span class="lg-bar" style="height:7px"></span></span>
        Book size = how deeply to read (tall = read fully, short = reference)
      </div>
      <div class="lg-row"><span class="lg-gold"></span> Gold glow = you've marked it done</div>
      <div class="lg-row">💬 / 📌 &nbsp;= shared notes on a book / shelf</div>
    </div>
  `;

  panelEl.querySelector(".index-close").addEventListener("click", () => {
    panelEl.hidden = true;
    const toggle = document.getElementById("index-toggle");
    toggle.style.display = "block";
    toggle.setAttribute("aria-expanded", "false");
  });
  panelEl.querySelectorAll("[data-shelf]").forEach((b) => {
    b.addEventListener("click", () => {
      closeDirectory();
      library.goToShelf(b.dataset.shelf);
      panel.openModulePanel(b.dataset.shelf);
    });
  });
  panelEl.querySelectorAll("[data-tool]").forEach((b) => {
    b.addEventListener("click", () => {
      closeDirectory();
      library.goToCabinet();
      panel.openToolPanel(b.dataset.tool);
    });
  });
}

function closeDirectory() {
  const panelEl = document.getElementById("index-panel");
  const toggle = document.getElementById("index-toggle");
  panelEl.hidden = true;
  toggle.style.display = "block";
  toggle.setAttribute("aria-expanded", "false");
}

function renderCountdown() {
  const el = document.getElementById("countdown");
  const comp = new Date("2026-07-17T09:00:00+08:00");
  const now = new Date();
  const days = Math.ceil((comp - now) / 86400000);
  el.textContent = days > 0 ? `⏱ ${days} day${days === 1 ? "" : "s"} to NUS` : "🏁 Competition week";
}

function refreshBadges() {
  if (!library) return;
  MODULES.forEach((mod) => {
    library.setNoteCount("module", mod.id, noteCountFor(mod.id));
    mod.readings.forEach((r) => {
      library.setNoteCount("reading", r.id, noteCountFor(r.id));
      const doneByMe = ME ? STATE.progress.some((d) => d.itemType === "reading" && d.itemId === r.id && d.author === ME.name && d.done) : false;
      library.setReadingDone(r.id, doneByMe);
    });
  });
}

// ---------------------------------------------------------------------------
// Scene wiring
// ---------------------------------------------------------------------------

function setBreadcrumb(text, showBack) {
  document.getElementById("breadcrumb-label").textContent = text;
  document.getElementById("back-btn").hidden = !showBack;
}

function initScene() {
  const canvas = document.getElementById("scene-canvas");
  const badgeLayer = document.getElementById("badge-layer");

  const lib = initLibrary({
    canvas,
    badgeLayer,
    onSelectReading: (id) => panel.openReadingPanel(id),
    onSelectModule: (id) => panel.openModulePanel(id),
    onEnterOverview: () => setBreadcrumb("Library overview", false),
    onEnterShelf: (moduleId) => {
      const mod = MODULES.find((m) => m.id === moduleId);
      setBreadcrumb(mod ? mod.title.replace(/^\d\.\s*/, "") : "Shelf", true);
    },
    onSelectCabinet: () => {
      setBreadcrumb("🗂 Reference cabinet", true);
      panel.openToolsMenu();
    },
  });
  return lib;
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

showLoginIfNeeded();
