import {
  MODULES, RUBRIC, RULES, PLAN, PLAN_NOTE, RECENCY_CHECKLIST,
  PARTY_QUESTIONS, FACT_BANK_SEED, VOCAB, OPTIONS_PROPOSALS, TIERS,
} from "../data/content.js";
import { TOOL_STATIONS } from "../data/tools.js";
import { MODULE_COLORS, SHELF_SHORT } from "../data/palette.js";
import { addDoc, setDocById, deleteDocById, safeId } from "./dataService.js";
import { getMe } from "./auth.js";
import { STATE, notesFor, isDoneBy, toggleProgress, membersWhoDid } from "./store.js";
import { escapeHtml, timeAgo, colorFor } from "./utils.js";

const panelEl = document.getElementById("side-panel");
const contentEl = document.getElementById("panel-content");

let currentSpec = null; // { kind: 'reading'|'module'|'tool', id }
const openNotePanels = new Set();

export function getCurrentSpec() {
  return currentSpec;
}

export function closePanel() {
  panelEl.hidden = true;
  currentSpec = null;
}

export function openReadingPanel(readingId) {
  currentSpec = { kind: "reading", id: readingId };
  render();
}
export function openModulePanel(moduleId) {
  currentSpec = { kind: "module", id: moduleId };
  render();
}
export function openToolPanel(toolId) {
  currentSpec = { kind: "tool", id: toolId };
  render();
}
export function openToolsMenu() {
  currentSpec = { kind: "toolsMenu" };
  render();
}

export function rerenderIfOpen() {
  if (currentSpec) render();
}

document.getElementById("panel-close").addEventListener("click", closePanel);

function render() {
  if (!currentSpec) return;
  panelEl.hidden = false;
  const me = getMe();
  if (currentSpec.kind === "reading") renderReading(currentSpec.id, me);
  else if (currentSpec.kind === "module") renderModule(currentSpec.id, me);
  else if (currentSpec.kind === "tool") renderTool(currentSpec.id, me);
  else if (currentSpec.kind === "toolsMenu") renderToolsMenu();
}

function renderToolsMenu() {
  contentEl.innerHTML = `
    <h2 class="page-title" style="font-size:18px;">🗂 Reference cabinet</h2>
    <p class="page-why" style="font-size:13px;">Your working tools — pick a drawer.</p>
    <div class="tool-menu">
      ${TOOL_STATIONS.map((t) => `
        <button class="tool-menu-item" data-open-tool="${t.id}">
          <span class="tm-icon">${t.icon}</span>
          <span class="tm-text"><span class="tm-name">${escapeHtml(t.label)}</span><span class="tm-desc">${escapeHtml(t.desc)}</span></span>
        </button>`).join("")}
    </div>
  `;
  contentEl.querySelectorAll("[data-open-tool]").forEach((b) => {
    b.addEventListener("click", () => openToolPanel(b.dataset.openTool));
  });
}

// ---------------------------------------------------------------------------
// Notes widget (shared)
// ---------------------------------------------------------------------------

function notesPanelHtml(itemId, placeholder = "Add a takeaway or fact for the team…") {
  const notes = notesFor(itemId);
  const panelId = `notes-${safeId(itemId)}`;
  const isOpen = openNotePanels.has(panelId);
  return `
    <button class="notes-toggle" data-notes-toggle="${panelId}">💬 ${notes.length} note${notes.length === 1 ? "" : "s"}</button>
    <div class="notes-panel" id="${panelId}" ${isOpen ? "" : "hidden"}>
      ${notes.length ? notes.map((n) => `
        <div class="note-item">
          <div class="note-meta">${escapeHtml(n.author)} · ${timeAgo(n.createdAt)}</div>
          ${escapeHtml(n.text)}
        </div>`).join("") : `<p class="empty-hint">No notes yet — add the first one.</p>`}
      <div class="note-form">
        <textarea placeholder="${escapeHtml(placeholder)}" data-note-input="${escapeHtml(itemId)}"></textarea>
        <button data-note-submit="${escapeHtml(itemId)}">Post</button>
      </div>
    </div>
  `;
}

function wireNotes(container, itemType) {
  container.querySelectorAll("[data-notes-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const panelId = btn.dataset.notesToggle;
      const panel = document.getElementById(panelId);
      panel.hidden = !panel.hidden;
      if (panel.hidden) openNotePanels.delete(panelId);
      else openNotePanels.add(panelId);
    });
  });
  container.querySelectorAll("[data-note-submit]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const itemId = btn.dataset.noteSubmit;
      const textarea = container.querySelector(`[data-note-input="${CSS.escape(itemId)}"]`);
      const text = textarea.value.trim();
      if (!text) return;
      openNotePanels.add(`notes-${safeId(itemId)}`);
      btn.disabled = true;
      await addDoc("notes", { itemId, itemType, author: getMe().name, text });
      textarea.value = "";
      btn.disabled = false;
    });
  });
}

function avatarRow(itemType, itemId) {
  const doneBy = membersWhoDid(itemType, itemId);
  if (!doneBy.length) return "";
  return `<span class="who">${doneBy.map((m) => `<span class="avatar-dot active" style="background:${colorFor(m.name)}" title="${escapeHtml(m.name)} done">${m.name[0].toUpperCase()}</span>`).join("")}</span>`;
}

// ---------------------------------------------------------------------------
// Reading panel
// ---------------------------------------------------------------------------

function findReading(id) {
  for (const m of MODULES) {
    const r = m.readings.find((x) => x.id === id);
    if (r) return { reading: r, module: m };
  }
  return null;
}

const DEPTH_WORD = { READ: "Read fully", SKIM: "Skim", REF: "Reference", WATCH: "Watch" };

function renderReading(id, me) {
  const found = findReading(id);
  if (!found) { contentEl.innerHTML = `<p class="empty-hint">Reading not found.</p>`; return; }
  const { reading: r, module: mod } = found;
  const mine = isDoneBy("reading", r.id, me.name);
  const idx = MODULES.indexOf(mod);
  const color = MODULE_COLORS[idx] || "#4fd1c5";

  contentEl.innerHTML = `
    <div class="reading-hero" style="--hero-color:${color}">
      <div class="hero-meta">
        <span class="badge badge-${r.depth}">${r.depth} · ${DEPTH_WORD[r.depth] || ""}</span>
        <span class="hero-module"><span style="display:inline-block;width:9px;height:9px;border-radius:2px;background:${color};margin-right:5px;vertical-align:middle;"></span>${escapeHtml(SHELF_SHORT[mod.id] || mod.title.replace(/^\d\.\s*/, ""))}</span>
      </div>
      <h2>${escapeHtml(r.title)}</h2>
    </div>
    <p class="reading-blurb" style="font-size:13.5px;">${escapeHtml(r.blurb)}</p>
    <a href="${escapeHtml(r.url)}" target="_blank" rel="noopener" class="source-btn">Open source ↗</a>
    <label class="done-toggle" style="margin-top:16px;">
      <input type="checkbox" data-reading-check ${mine ? "checked" : ""} />
      <span style="flex:1;">Mark as done</span>
      ${avatarRow("reading", r.id)}
    </label>
    <div class="card" style="margin-top:12px;">
      ${notesPanelHtml(r.id)}
    </div>
  `;
  contentEl.querySelector("[data-reading-check]").addEventListener("change", (e) => {
    toggleProgress("reading", r.id, me.name, e.target.checked);
  });
  wireNotes(contentEl, "reading");
}

// ---------------------------------------------------------------------------
// Module (shelf reminders) panel
// ---------------------------------------------------------------------------

function renderModule(moduleId, me) {
  const mod = MODULES.find((m) => m.id === moduleId);
  if (!mod) { contentEl.innerHTML = `<p class="empty-hint">Shelf not found.</p>`; return; }
  const done = mod.readings.filter((r) => isDoneBy("reading", r.id, me.name)).length;

  contentEl.innerHTML = `
    <h2 class="page-title" style="font-size:18px;">📌 ${escapeHtml(mod.title.replace(/^\d\.\s*/, ""))}</h2>
    <p class="page-why" style="font-size:13px;">${escapeHtml(mod.why)}</p>
    <div class="progress-mini">
      <div class="progress-track"><div class="progress-fill" style="width:${mod.readings.length ? (done / mod.readings.length) * 100 : 0}%"></div></div>
      <span class="progress-label">${done}/${mod.readings.length} done</span>
    </div>

    <p class="section-heading">Reminders pinned to this shelf</p>
    <div class="card">${notesPanelHtml(mod.id, "Pin a reminder for the team about this module…")}</div>

    <p class="section-heading">Books on this shelf</p>
    ${mod.readings.map((r) => {
      const mine = isDoneBy("reading", r.id, me.name);
      return `
      <div class="reading ${mine ? "done" : ""}" style="padding:10px 12px;">
        <input type="checkbox" data-mini-reading-check="${r.id}" ${mine ? "checked" : ""} />
        <div class="reading-body">
          <div class="reading-title-row">
            <span class="badge badge-${r.depth}">${r.depth}</span>
            <a href="#" data-open-reading="${r.id}">${escapeHtml(r.title)}</a>
          </div>
        </div>
      </div>`;
    }).join("")}
  `;
  document.getElementById(`notes-${safeId(mod.id)}`); // ensure exists before wiring
  wireNotes(contentEl, "module");
  contentEl.querySelectorAll("[data-mini-reading-check]").forEach((cb) => {
    cb.addEventListener("change", (e) => toggleProgress("reading", cb.dataset.miniReadingCheck, me.name, e.target.checked));
  });
  contentEl.querySelectorAll("[data-open-reading]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      openReadingPanel(a.dataset.openReading);
    });
  });
}

// ---------------------------------------------------------------------------
// Tool panels
// ---------------------------------------------------------------------------

function renderTool(toolId, me) {
  const tool = TOOL_STATIONS.find((t) => t.id === toolId);
  const title = tool ? `${tool.icon} ${tool.label}` : toolId;
  const renderers = {
    rules: renderRulesTool,
    plan: renderPlanTool,
    party: renderPartyTool,
    factbank: renderFactBankTool,
    optionsbank: renderOptionsBankTool,
    vocab: renderVocabTool,
    recency: renderRecencyTool,
    tiers: renderTiersTool,
  };
  const fn = renderers[toolId];
  if (!fn) { contentEl.innerHTML = `<p class="empty-hint">Unknown tool.</p>`; return; }
  contentEl.innerHTML = `<button class="panel-back" id="tool-back">‹ All tools</button><h2 class="page-title" style="font-size:18px;">${title}</h2>${tool ? `<p class="page-why" style="font-size:13px;">${escapeHtml(tool.desc)}</p>` : ""}` + fn(me);
  contentEl.querySelector("#tool-back").addEventListener("click", openToolsMenu);
  wireTool(toolId, me);
}

function renderRulesTool() {
  const segColors = { individual: "#7c9eff", team: "#4fd1c5" };
  return `
    <div class="card">
      <strong style="font-size:13px;">Score allocation</strong>
      <div class="rubric-bar">
        ${RUBRIC.individual.items.map((it) => `<span class="rubric-seg" style="width:${it.points}%;background:${segColors.individual};opacity:${0.5 + it.points / 40}"></span>`).join("")}
        ${RUBRIC.team.items.map((it) => `<span class="rubric-seg" style="width:${it.points}%;background:${segColors.team};opacity:${0.5 + it.points / 40}"></span>`).join("")}
      </div>
      <ul class="rubric-list">
        ${[...RUBRIC.individual.items, ...RUBRIC.team.items].map((it) => `<li><span>${escapeHtml(it.label)}</span><span class="pts">${it.points} pts</span></li>`).join("")}
      </ul>
    </div>
    <p class="section-heading">Read with allocator's eyes</p>
    <div class="card">
      <ul style="margin:0;padding-left:18px;color:var(--text-dim);font-size:13px;line-height:1.7;">
        ${RUBRIC.readWithAllocatorsEyes.map((h) => `<li>${escapeHtml(h)}</li>`).join("")}
      </ul>
    </div>
    <p class="section-heading">Rules that should shape prep</p>
    ${RULES.map((r) => `
      <div class="card">
        <strong style="font-size:13px;">${escapeHtml(r.title)}</strong>
        <p style="color:var(--text-dim);font-size:12.5px;line-height:1.6;margin:8px 0 0;">
          ${escapeHtml(r.body).replace(r.email || "___NOPE___", `<a href="mailto:${r.email}" style="color:var(--accent-2)">${r.email}</a>`)}
        </p>
      </div>
    `).join("")}
  `;
}

function renderPlanTool() {
  const todayStr = new Date().toISOString().slice(0, 10);
  return `
    <div class="plan-note-banner">📅 ${escapeHtml(PLAN_NOTE)}</div>
    ${PLAN.map((d) => {
      const isToday = d.actualDate === todayStr;
      return `
      <div class="plan-day ${isToday ? "today" : ""}">
        <div class="plan-day-header">
          <h3 style="font-size:13.5px;">${d.label}</h3>
          <span class="date" style="font-size:11px;">"${d.labelDate}" → ${d.actualDate}</span>
          ${isToday ? `<span class="today-pill">Today</span>` : ""}
        </div>
        ${d.tasks.map((t, i) => {
          const itemId = `day${d.day}_task${i}`;
          const mine = isDoneBy("plan", itemId, getMe().name);
          return `
          <div class="plan-task" style="font-size:12.5px;">
            <input type="checkbox" data-plan-check="${itemId}" ${mine ? "checked" : ""} />
            <span>${escapeHtml(t)}</span>
            ${avatarRow("plan", itemId)}
          </div>`;
        }).join("")}
      </div>`;
    }).join("")}
  `;
}

function renderPartyTool() {
  return PARTY_QUESTIONS.map((p, pIdx) => `
    <div class="party-card">
      <h3 style="font-size:14px;">${escapeHtml(p.party)}</h3>
      ${p.questions.map((q, qIdx) => {
        const itemId = `party${pIdx}_q${qIdx}`;
        return `
        <div class="pq-item card">
          <p class="q" style="font-size:12.5px;">${escapeHtml(q)}</p>
          ${notesPanelHtml(itemId, "Add your answer…")}
        </div>`;
      }).join("")}
    </div>
  `).join("");
}

function renderFactBankTool() {
  return `
    <div class="card">
      <ul class="bank-list">
        ${FACT_BANK_SEED.map((f) => `<li style="font-size:12.5px;">📌 ${escapeHtml(f)}</li>`).join("")}
        ${STATE.factbank.map((f) => `<li style="font-size:12.5px;">${escapeHtml(f.text)} <span style="color:var(--text-dimmer);font-size:10.5px;margin-left:6px;">— ${escapeHtml(f.addedBy || "?")}</span><button class="del" data-del-fact="${f.id}">×</button></li>`).join("")}
      </ul>
      <div class="add-row">
        <input type="text" id="fact-input" placeholder="Add a verified fact…" />
        <button id="fact-add">Add</button>
      </div>
    </div>
  `;
}

function renderOptionsBankTool() {
  return OPTIONS_PROPOSALS.map((prop) => {
    const items = STATE.optionsbank.filter((o) => o.proposalId === prop.id);
    return `
    <p class="options-col-title" style="font-size:12px;">${escapeHtml(prop.label)}</p>
    <div class="card">
      <ul class="bank-list">
        ${items.length ? items.map((o) => `<li style="font-size:12.5px;">${escapeHtml(o.text)} <span style="color:var(--text-dimmer);font-size:10.5px;margin-left:6px;">— ${escapeHtml(o.addedBy || "?")}</span><button class="del" data-del-opt="${o.id}">×</button></li>`).join("") : `<li class="empty-hint">No options yet.</li>`}
      </ul>
      <div class="add-row">
        <input type="text" data-opt-input="${prop.id}" placeholder="Add an option…" />
        <button data-opt-add="${prop.id}">Add</button>
      </div>
    </div>`;
  }).join("");
}

function renderVocabTool(me) {
  const known = VOCAB.filter((term) => isDoneBy("vocab", safeId(term), me.name)).length;
  return `
    <p style="font-size:12px;color:var(--text-dimmer);margin:-6px 0 12px;">${known}/${VOCAB.length} confident</p>
    <div class="vocab-grid">
      ${VOCAB.map((term) => {
        const mine = isDoneBy("vocab", safeId(term), me.name);
        return `<div class="vocab-chip ${mine ? "known" : ""}" data-vocab-term="${escapeHtml(term)}" style="font-size:12px;">${mine ? "✓ " : ""}${escapeHtml(term)}</div>`;
      }).join("")}
    </div>
  `;
}

function renderRecencyTool(me) {
  return `
    <div class="card">
      ${RECENCY_CHECKLIST.map((q, i) => {
        const itemId = `recency${i}`;
        const mine = isDoneBy("recency", itemId, me.name);
        return `
        <div class="recency-item" style="font-size:12.5px;">
          <input type="checkbox" data-recency-check="${itemId}" ${mine ? "checked" : ""} />
          <span>${escapeHtml(q)}</span>
          <a href="https://www.google.com/search?q=${encodeURIComponent(q)}" target="_blank" rel="noopener">Search →</a>
        </div>`;
      }).join("")}
    </div>
  `;
}

function renderTiersTool() {
  return TIERS.map((t) => `
    <div class="card">
      <strong style="font-size:12.5px;">${escapeHtml(t.tier)}</strong>
      <ul style="margin:8px 0 0;padding-left:16px;color:var(--text-dim);font-size:12px;line-height:1.7;">
        ${t.items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}
      </ul>
    </div>
  `).join("");
}

function wireTool(toolId, me) {
  if (toolId === "plan") {
    contentEl.querySelectorAll("[data-plan-check]").forEach((cb) => {
      cb.addEventListener("change", (e) => toggleProgress("plan", cb.dataset.planCheck, me.name, e.target.checked));
    });
  } else if (toolId === "party") {
    wireNotes(contentEl, "party");
  } else if (toolId === "factbank") {
    document.getElementById("fact-add").addEventListener("click", async () => {
      const input = document.getElementById("fact-input");
      const text = input.value.trim();
      if (!text) return;
      await addDoc("factbank", { text, addedBy: me.name });
      input.value = "";
    });
    contentEl.querySelectorAll("[data-del-fact]").forEach((btn) => {
      btn.addEventListener("click", () => deleteDocById("factbank", btn.dataset.delFact));
    });
  } else if (toolId === "optionsbank") {
    contentEl.querySelectorAll("[data-opt-add]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const propId = btn.dataset.optAdd;
        const input = contentEl.querySelector(`[data-opt-input="${propId}"]`);
        const text = input.value.trim();
        if (!text) return;
        await addDoc("optionsbank", { proposalId: propId, text, addedBy: me.name });
        input.value = "";
      });
    });
    contentEl.querySelectorAll("[data-del-opt]").forEach((btn) => {
      btn.addEventListener("click", () => deleteDocById("optionsbank", btn.dataset.delOpt));
    });
  } else if (toolId === "vocab") {
    contentEl.querySelectorAll("[data-vocab-term]").forEach((chip) => {
      chip.addEventListener("click", () => {
        const term = chip.dataset.vocabTerm;
        const mine = isDoneBy("vocab", safeId(term), me.name);
        toggleProgress("vocab", safeId(term), me.name, !mine);
      });
    });
  } else if (toolId === "recency") {
    contentEl.querySelectorAll("[data-recency-check]").forEach((cb) => {
      cb.addEventListener("change", (e) => toggleProgress("recency", cb.dataset.recencyCheck, me.name, e.target.checked));
    });
  }
}
