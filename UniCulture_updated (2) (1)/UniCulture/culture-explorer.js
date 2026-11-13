import { db } from "./firebase-config.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// Parts of a place's culture, each with its own colour so the cards feel different
const CULTURE_SECTIONS = [
  { key: "food", icon: "🍲", title: "Local Food", c1: "#f59e0b", c2: "#ea580c" },
  { key: "wedding", icon: "💍", title: "Weddings", c1: "#ec4899", c2: "#be185d" },
  { key: "dress", icon: "👗", title: "Dress", c1: "#8b5cf6", c2: "#6d28d9" },
  { key: "language", icon: "🗣", title: "Language", c1: "#3b82f6", c2: "#1d4ed8" },
  { key: "festivals", icon: "🎶", title: "Festivals & Music", c1: "#d946ef", c2: "#a21caf" },
  { key: "crafts", icon: "🧶", title: "Crafts", c1: "#b45309", c2: "#78350f" },
  { key: "etiquette", icon: "🤝", title: "Etiquette", c1: "#14b8a6", c2: "#0f766e" }
];

const PROVINCES = [
  "Gilgit-Baltistan",
  "Khyber Pakhtunkhwa",
  "Punjab",
  "Sindh",
  "Balochistan"
];

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

const grid = document.getElementById("cxGrid");
const soonWrap = document.getElementById("cxSoonWrap");
const soonList = document.getElementById("cxSoon");
const chipsEl = document.getElementById("cxChips");
const searchEl = document.getElementById("cxSearch");
const emptyEl = document.getElementById("cxEmpty");
const statsEl = document.getElementById("cxStats");
const overlay = document.getElementById("cxOverlay");
const panel = document.getElementById("cxPanel");

let areas = [];
let places = {};
let activeProvince = "All";

// story state
let curArea = null;
let deck = [];
let idx = 0;


function filledSections(area) {

  const sections = area.sections || {};

  return CULTURE_SECTIONS.filter((s) => {
    const sec = sections[s.key];
    return sec && ((sec.items && sec.items.length) || sec.intro);
  });

}

function isReady(area) {
  return area.status !== "pending" && filledSections(area).length > 0;
}

function areaImage(area) {

  for (const id of (area.places || [])) {
    if (places[id] && places[id].image) return places[id].image;
  }

  return "";

}

function badgeFor(area) {

  if (!isReady(area)) return { cls: "pending", text: "Coming soon" };
  if (area.status === "verified") return { cls: "verified", text: "✓ Verified" };
  return { cls: "draft", text: "Draft" };

}


/* ---------- LIST ---------- */

function renderCards() {

  const term = searchEl.value.trim().toLowerCase();

  const list = areas.filter((a) => {

    const okProvince = activeProvince === "All" || a.province === activeProvince;

    const okSearch = !term ||
      (a.name || "").toLowerCase().includes(term) ||
      (a.province || "").toLowerCase().includes(term) ||
      (a.tagline || "").toLowerCase().includes(term);

    return okProvince && okSearch;

  });

  const ready = list.filter(isReady).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  const soon = list.filter((a) => !isReady(a)).sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  emptyEl.style.display = list.length ? "none" : "block";

  grid.innerHTML = ready.map((a) => {

    const badge = badgeFor(a);
    const img = areaImage(a);
    const filled = filledSections(a);
    const count = filled.reduce((n, s) => n + (a.sections[s.key].items || []).length, 0);

    return `
      <div class="cx-card" data-id="${esc(a.id)}">
        <div class="cx-img">
          ${img ? `<img src="${esc(img)}" alt="${esc(a.name)}" loading="lazy">` : ""}
          <span class="cx-badge ${badge.cls}">${badge.text}</span>
          <span class="cx-prov">${esc(a.province)}</span>
        </div>
        <div class="cx-body">
          <h3>${esc(a.name)}</h3>
          <p class="cx-tag">${a.tagline ? esc(a.tagline) : ""}</p>
          <div class="cx-icons">${filled.map((s) => `<span title="${esc(s.title)}">${s.icon}</span>`).join("")}</div>
          <div class="cx-go">▶ ${count} quick stories</div>
        </div>
      </div>`;

  }).join("");

  soonWrap.style.display = soon.length ? "block" : "none";

  soonList.innerHTML = soon.map((a) =>
    `<button class="cx-soon-pill" data-id="${esc(a.id)}">🌱 ${esc(a.name)} <small>${esc(a.province)}</small></button>`
  ).join("");

}

function renderChips() {

  const present = PROVINCES.filter((p) => areas.some((a) => a.province === p));

  chipsEl.innerHTML = ["All", ...present].map((p) =>
    `<button class="cx-pill ${p === activeProvince ? "active" : ""}" data-province="${esc(p)}">${esc(p)}</button>`
  ).join("");

}

function renderStats() {

  const ready = areas.filter(isReady).length;
  const items = areas.reduce((n, a) =>
    n + filledSections(a).reduce((m, s) => m + ((a.sections[s.key].items || []).length), 0), 0);

  statsEl.innerHTML = `
    <span class="cx-stat">📍 ${areas.length} areas</span>
    <span class="cx-stat">✨ ${ready} ready to explore</span>
    <span class="cx-stat">📖 ${items} traditions</span>`;

}


/* ---------- STORY PANEL ---------- */

function buildDeck(area) {

  const cards = [];

  filledSections(area).forEach((s) => {

    const sec = area.sections[s.key];

    if (sec.intro) {
      cards.push({ key: s.key, name: s.title, short: sec.intro, text: "" });
    }

    (sec.items || []).forEach((it) => {
      cards.push({
        key: s.key,
        name: it.name,
        short: it.short || it.text,
        text: it.short ? it.text : ""
      });
    });

  });

  return cards;

}

function sectionOf(key) {
  return CULTURE_SECTIONS.find((s) => s.key === key);
}

function openArea(id, tabKey) {

  const area = areas.find((a) => a.id === id);
  if (!area) return;

  curArea = area;
  const ready = isReady(area);
  const img = areaImage(area);
  const badge = badgeFor(area);

  const placeLinks = (area.places || [])
    .filter((pid) => places[pid])
    .map((pid) => `
      <a class="cx-place" href="tourism_detail.html?id=${encodeURIComponent(pid)}">
        ${places[pid].image ? `<img src="${esc(places[pid].image)}" alt="">` : `<span class="ph"></span>`}
        ${esc(places[pid].name)}
      </a>`).join("");

  const sources = (area.sources || []).filter((s) => /^https?:\/\//.test(s.url));

  let storyHtml = "";

  if (ready) {

    deck = buildDeck(area);
    idx = 0;

    if (tabKey) {
      const found = deck.findIndex((c) => c.key === tabKey);
      if (found >= 0) idx = found;
    }

    storyHtml = `
      <div class="cx-bars" id="cxBars">${deck.map(() => `<i></i>`).join("")}</div>

      <div class="cx-story" id="cxStory">
        <div class="cx-story-inner" id="cxStoryInner"></div>
      </div>

      <div class="cx-nav">
        <button class="cx-arrow" id="cxPrev" aria-label="Previous">←</button>
        <div class="cx-tabs" id="cxTabs">
          ${filledSections(area).map((s) => `<button class="cx-tab" data-key="${s.key}" title="${esc(s.title)}">${s.icon}<span>${esc(s.title)}</span></button>`).join("")}
        </div>
        <button class="cx-arrow" id="cxNext" aria-label="Next">→</button>
      </div>`;

  } else {

    storyHtml = `
      <div class="cx-pending-box">
        <div class="big">🌱</div>
        <p>The culture of ${esc(area.name)} has not been written up yet. We only publish what we can back with sources.</p>
        <p>Know this area well? Help us document it.</p>
        <a class="cx-suggest" href="contribute.html">✍ Contribute</a>
      </div>`;

  }

  panel.innerHTML = `
    <button class="cx-close" id="cxClose" aria-label="Close">✕</button>

    <div class="cx-banner">
      ${img ? `<img src="${esc(img)}" alt="${esc(area.name)}">` : ""}
      <div class="cx-banner-text">
        <small>${esc(area.province)} · ${ready ? (badge.cls === "verified" ? "Verified" : "Draft, being verified") : "Coming soon"}</small>
        <h2>${esc(area.name)}</h2>
      </div>
    </div>

    <div class="cx-pbody">

      ${storyHtml}

      ${placeLinks ? `
        <div class="cx-places">
          <h4>📍 Places to visit here</h4>
          <div class="cx-place-row">${placeLinks}</div>
        </div>` : ""}

      ${ready ? `
        <div class="cx-foot">
          <details class="cx-sources">
            <summary>Sources (${sources.length})</summary>
            ${sources.map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a>`).join("")}
          </details>
          <a href="contribute.html" class="cx-suggest">✍ Suggest a correction</a>
        </div>` : ""}

    </div>`;

  if (ready) showCard(idx);

  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
  overlay.scrollTop = 0;

  history.replaceState(null, "", "#" + id);

}

function showCard(i) {

  if (!deck.length) return;

  idx = Math.max(0, Math.min(deck.length - 1, i));

  const card = deck[idx];
  const sec = sectionOf(card.key);
  const inner = document.getElementById("cxStoryInner");
  const story = document.getElementById("cxStory");

  story.style.background = `linear-gradient(135deg, ${sec.c1}, ${sec.c2})`;

  inner.classList.remove("cx-pop");
  void inner.offsetWidth;   // restart the animation
  inner.classList.add("cx-pop");

  inner.innerHTML = `
    <div class="cx-big">${sec.icon}</div>
    <div class="cx-label">${esc(sec.title)}</div>
    <h3>${esc(card.name)}</h3>
    <p class="cx-short">${esc(card.short)}</p>
    ${card.text ? `
      <button class="cx-more" id="cxMore">Read more ▾</button>
      <p class="cx-full" id="cxFull">${esc(card.text)}</p>` : ""}
    <div class="cx-count">${idx + 1} / ${deck.length}</div>`;

  document.querySelectorAll("#cxBars i").forEach((bar, n) => bar.classList.toggle("done", n <= idx));

  document.querySelectorAll("#cxTabs .cx-tab").forEach((b) => b.classList.toggle("active", b.dataset.key === card.key));

  document.getElementById("cxPrev").disabled = idx === 0;
  document.getElementById("cxNext").disabled = idx === deck.length - 1;

}

function closePanel() {

  overlay.classList.remove("open");
  document.body.style.overflow = "";
  curArea = null;
  history.replaceState(null, "", location.pathname + location.search);

}


/* ---------- EVENTS ---------- */

grid.addEventListener("click", (e) => {
  const card = e.target.closest(".cx-card");
  if (card) openArea(card.dataset.id);
});

soonList.addEventListener("click", (e) => {
  const pill = e.target.closest(".cx-soon-pill");
  if (pill) openArea(pill.dataset.id);
});

chipsEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".cx-pill");
  if (!btn) return;
  activeProvince = btn.dataset.province;
  renderChips();
  renderCards();
});

searchEl.addEventListener("input", renderCards);

overlay.addEventListener("click", (e) => {

  if (e.target === overlay || e.target.id === "cxClose") { closePanel(); return; }

  if (e.target.closest("#cxPrev")) { showCard(idx - 1); return; }
  if (e.target.closest("#cxNext")) { showCard(idx + 1); return; }

  const more = e.target.closest("#cxMore");

  if (more) {
    const full = document.getElementById("cxFull");
    const open = full.classList.toggle("show");
    more.textContent = open ? "Show less ▴" : "Read more ▾";
    return;
  }

  const tab = e.target.closest(".cx-tab");

  if (tab) {
    const first = deck.findIndex((c) => c.key === tab.dataset.key);
    if (first >= 0) showCard(first);
    return;
  }

  // tap the left / right side of the story card to go back / forward
  const story = e.target.closest("#cxStory");

  if (story && !e.target.closest("button")) {
    const rect = story.getBoundingClientRect();
    showCard(e.clientX < rect.left + rect.width * 0.35 ? idx - 1 : idx + 1);
  }

});

document.addEventListener("keydown", (e) => {

  if (!overlay.classList.contains("open")) return;

  if (e.key === "Escape") closePanel();
  if (e.key === "ArrowRight") showCard(idx + 1);
  if (e.key === "ArrowLeft") showCard(idx - 1);

});

// swipe on touch screens
let touchX = null;

overlay.addEventListener("touchstart", (e) => {
  touchX = e.target.closest("#cxStory") ? e.touches[0].clientX : null;
}, { passive: true });

overlay.addEventListener("touchend", (e) => {

  if (touchX === null) return;

  const dx = e.changedTouches[0].clientX - touchX;
  touchX = null;

  if (Math.abs(dx) > 50) showCard(dx < 0 ? idx + 1 : idx - 1);

}, { passive: true });


/* ---------- LOAD ---------- */

function openFromHash() {

  // e.g. culture-explorer.html#hunza   or   #hunza/food
  const [areaId, tab] = (location.hash || "").slice(1).split("/");
  if (areaId) openArea(areaId, tab);

}

async function init() {

  try {

    const [cultureSnap, tourismSnap] = await Promise.all([
      getDocs(collection(db, "Culture")),
      getDocs(collection(db, "Tourism"))
    ]);

    tourismSnap.forEach((d) => {
      const t = d.data();
      places[d.id] = { name: t.name, image: t.image || "" };
    });

    areas = cultureSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    if (!areas.length) {
      grid.innerHTML = `<p class="cx-empty" style="display:block;">No culture data yet. Run "Seed Culture" from the admin page.</p>`;
      return;
    }

    renderStats();
    renderChips();
    renderCards();
    openFromHash();

  } catch (error) {

    console.error("Culture Explorer failed:", error);
    grid.innerHTML = `<p class="cx-empty" style="display:block;">Could not load culture data: ${esc(error.message)}</p>`;

  }

}

init();