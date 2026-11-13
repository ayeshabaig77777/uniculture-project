import "./toast.js";

import { auth, db } from "./firebase-config.js";

import { logActivity } from "./activity-log.js";

import { loadAdminEvents } from "./admin-events.js";

import { loadAdminHeritage } from "./admin-heritage.js";

import { loadAdminUsers } from "./admin-users.js";

import { escapeHTML, safeUrl, formatDate } from "./utils.js";

import { ADMIN_UID } from "./admin-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// Load the CSS file for the new admin design (Contributions + Users)
if (!document.getElementById("adminRedesignCss")) {
  const link = document.createElement("link");
  link.id = "adminRedesignCss";
  link.rel = "stylesheet";
  link.href = "admin-redesign.css?v=1";
  document.head.appendChild(link);
}


// Only this one account (checked by its UID) can ever access the admin panel.

const adminStatus = document.getElementById("adminStatus");
const adminList = document.getElementById("adminList");


// ================= ACCESS CHECK =================

onAuthStateChanged(auth, (user) => {

  if (!user) {

    adminStatus.innerHTML = `<p>Please login to access this page.</p>`;
    adminList.innerHTML = "";
    return;

  }

  if (user.uid !== ADMIN_UID) {

    adminStatus.innerHTML = `<p>You do not have access to this page.</p>`;
    adminList.innerHTML = "";
    return;

  }

  adminStatus.innerHTML = "";
  loadContributions();
  loadAdminEvents();
  loadAdminHeritage();
  loadAdminUsers();
  loadStats();

});


// ================= DASHBOARD STAT CARDS =================

async function loadStats() {

  try {

    const [eventsSnap, heritageSnap, contributionsSnap, commentsSnap, favoritesSnap, usersSnap] = await Promise.all([
      getDocs(collection(db, "events")),
      getDocs(collection(db, "Heritage")),
      getDocs(collection(db, "Contributions")),
      getDocs(collection(db, "Comments")),
      getDocs(collection(db, "Favorites")),
      getDocs(collection(db, "Users"))
    ]);

    const pendingCount = contributionsSnap.docs.filter((d) => d.data().status === "pending").length;

    document.getElementById("statUsersCount").textContent = usersSnap.size;
    document.getElementById("statEventsCount").textContent = eventsSnap.size;
    document.getElementById("statHeritageCount").textContent = heritageSnap.size;
    document.getElementById("statPendingCount").textContent = pendingCount;
    document.getElementById("statCommentsCount").textContent = commentsSnap.size;
    document.getElementById("statFavoritesCount").textContent = favoritesSnap.size;

    const badge = document.getElementById("navPendingBadge");
    badge.textContent = pendingCount > 0 ? pendingCount : "";

    loadRecentContributions(contributionsSnap);

  } catch (error) {
    console.error(error);
  }

}


function loadRecentContributions(contributionsSnap) {

  const box = document.getElementById("recentContributions");

  const recent = contributionsSnap.docs
    .slice()
    .sort((a, b) => (b.data().createdAt?.seconds || 0) - (a.data().createdAt?.seconds || 0))
    .slice(0, 5);

  if (recent.length === 0) {
    box.innerHTML = `<p>No contributions submitted yet.</p>`;
    return;
  }

  box.innerHTML = recent.map((docSnap) => {
    const d = docSnap.data();
    return `
      <div class="admin-recent-row">
        <div>
          <strong>${escapeHTML(d.title)}</strong>
          <p>By ${escapeHTML(d.userEmail || "Unknown")} &nbsp;·&nbsp; ${escapeHTML(d.type || "")}</p>
        </div>
        <span class="status status-${escapeHTML(d.status)}">${escapeHTML(d.status)}</span>
      </div>
    `;
  }).join("");

}


// ================= CONTRIBUTIONS (NEW DESIGN) =================

let allContributions = [];
let statusFilter = "all";
let categoryFilter = "all";
let searchText = "";
let contribShellBuilt = false;

const STATUS_LABELS = {
  all: "All",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected"
};


// The page layout is built only once (so the search box keeps its focus)
function buildContributionsShell() {

  adminList.innerHTML = `
    <div class="ad-page">

      <div class="ad-head">
        <h2>Contributions</h2>
        <p>Review the photos and stories submitted by the community.</p>
      </div>

      <div class="ad-stats" id="adContribStats"></div>

      <div class="ad-toolbar">
        <input id="adContribSearch" class="ad-search" type="search" placeholder="Search by title, user or region...">
        <select id="adContribCategory" class="ad-select">
          <option value="all">All categories</option>
        </select>
      </div>

      <div class="ad-toolbar">
        <div class="ad-chips" id="adContribChips">
          ${Object.keys(STATUS_LABELS).map((key) => `
            <button type="button" class="ad-chip ${key === "all" ? "is-active" : ""}" data-status="${key}">${STATUS_LABELS[key]}</button>
          `).join("")}
        </div>
      </div>

      <div class="ad-list" id="adContribList"></div>

    </div>
  `;

  document.getElementById("adContribSearch").addEventListener("input", (e) => {
    searchText = e.target.value.trim().toLowerCase();
    renderContributions();
  });

  document.getElementById("adContribCategory").addEventListener("change", (e) => {
    categoryFilter = e.target.value;
    renderContributions();
  });

  document.getElementById("adContribChips").addEventListener("click", (e) => {
    const chip = e.target.closest("[data-status]");
    if (!chip) return;

    statusFilter = chip.dataset.status;

    document.querySelectorAll("#adContribChips .ad-chip").forEach((c) => {
      c.classList.toggle("is-active", c === chip);
    });

    renderContributions();
  });

  // Approve / Reject buttons (event delegation)
  document.getElementById("adContribList").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    updateStatus(btn.dataset.id, btn.dataset.action, btn);
  });

  contribShellBuilt = true;

}


async function loadContributions() {

  if (!contribShellBuilt) buildContributionsShell();

  document.getElementById("adContribList").innerHTML =
    `<div class="ad-empty">Loading contributions...</div>`;

  try {

    const q = query(
      collection(db, "Contributions"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    allContributions = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    fillCategoryOptions();
    renderContributionStats();
    renderContributions();

  } catch (error) {

    console.error(error);
    document.getElementById("adContribList").innerHTML =
      `<div class="ad-empty">Could not load contributions. Please refresh the page and try again.</div>`;

  }

}


function fillCategoryOptions() {

  const select = document.getElementById("adContribCategory");

  const categories = [...new Set(
    allContributions.map((c) => c.category).filter(Boolean)
  )].sort();

  select.innerHTML =
    `<option value="all">All categories</option>` +
    categories.map((c) => `<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join("");

  // Keep the selected category if it still exists
  select.value = categories.includes(categoryFilter) ? categoryFilter : "all";
  if (select.value === "all") categoryFilter = "all";

}


function renderContributionStats() {

  const count = (s) => allContributions.filter((c) => c.status === s).length;

  document.getElementById("adContribStats").innerHTML = `
    <div class="ad-stat"><div class="ad-stat-dot">📥</div><div><strong>${allContributions.length}</strong><span>Total</span></div></div>
    <div class="ad-stat is-pending"><div class="ad-stat-dot">🕓</div><div><strong>${count("pending")}</strong><span>Pending review</span></div></div>
    <div class="ad-stat is-approved"><div class="ad-stat-dot">✅</div><div><strong>${count("approved")}</strong><span>Approved</span></div></div>
    <div class="ad-stat is-rejected"><div class="ad-stat-dot">❌</div><div><strong>${count("rejected")}</strong><span>Rejected</span></div></div>
  `;

}


function isImageUrl(url) {
  return /\/image\/upload\/|\.(jpe?g|png|gif|webp|avif|jfif)(\?|$)/i.test(url);
}


function renderContributions() {

  const box = document.getElementById("adContribList");

  const filtered = allContributions.filter((c) => {

    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (categoryFilter !== "all" && c.category !== categoryFilter) return false;

    if (!searchText) return true;

    const haystack =
      `${c.title || ""} ${c.userEmail || ""} ${c.contributorName || ""} ${c.region || ""} ${c.description || ""}`.toLowerCase();

    return haystack.includes(searchText);

  });

  if (filtered.length === 0) {
    box.innerHTML = `<div class="ad-empty">${
      allContributions.length === 0
        ? "No contributions have been submitted yet."
        : "No contributions match this search or filter."
    }</div>`;
    return;
  }

  box.innerHTML = filtered.map((c) => {

    const fileUrl = safeUrl(c.fileURL);

    const thumb = fileUrl && isImageUrl(fileUrl)
      ? `<img src="${escapeHTML(fileUrl)}" alt="${escapeHTML(c.title)}" loading="lazy">`
      : `<span>${fileUrl ? "📎" : "📝"}</span>`;

    const status = ["pending", "approved", "rejected"].includes(c.status) ? c.status : "pending";

    const approveBtn = status !== "approved"
      ? `<button class="ad-btn approve" data-action="approved" data-id="${escapeHTML(c.id)}">Approve</button>`
      : "";

    const rejectBtn = status !== "rejected"
      ? `<button class="ad-btn reject" data-action="rejected" data-id="${escapeHTML(c.id)}">Reject</button>`
      : "";

    const fileLink = fileUrl
      ? `<a href="${escapeHTML(fileUrl)}" target="_blank" rel="noopener noreferrer">View file</a>`
      : `<span>No file attached</span>`;

    return `
      <article class="ad-card">

        <div class="ad-thumb">${thumb}</div>

        <div>

          <div class="ad-card-top">
            <h3>${escapeHTML(c.title)}</h3>
            <span class="ad-badge ${status}">${status}</span>
          </div>

          <div class="ad-tags">
            ${c.type ? `<span class="ad-tag">${escapeHTML(c.type)}</span>` : ""}
            ${c.category ? `<span class="ad-tag">${escapeHTML(c.category)}</span>` : ""}
            ${c.region ? `<span class="ad-tag">📍 ${escapeHTML(c.region)}</span>` : ""}
          </div>

          <p class="ad-desc">${escapeHTML(c.description)}</p>

          <p class="ad-meta">
            ${escapeHTML(c.userEmail || "Unknown")} &nbsp;·&nbsp; ${escapeHTML(formatDate(c.createdAt))} &nbsp;·&nbsp; ${fileLink}
          </p>

          <div class="ad-actions">${approveBtn}${rejectBtn}</div>

        </div>

      </article>
    `;

  }).join("");

  // If the photo fails to load, show an icon
  box.querySelectorAll(".ad-thumb img").forEach((img) => {
    img.addEventListener("error", () => {
      img.parentElement.innerHTML = "<span>🖼️</span>";
    });
  });

}


// ================= APPROVE / REJECT =================

async function updateStatus(id, newStatus, btn) {

  const item = allContributions.find((c) => c.id === id);
  if (!item) return;

  btn.disabled = true;
  btn.textContent = "Please wait...";

  try {

    await updateDoc(doc(db, "Contributions", id), {
      status: newStatus
    });

    if (item.uid) {
      await logActivity(item.uid, newStatus, item.title);
    }

    // Update local data without reloading
    item.status = newStatus;

    renderContributionStats();
    renderContributions();

    // Also refresh the sidebar pending badge and dashboard numbers
    loadStats();

  } catch (error) {

    console.error(error);
    alert("Could not update status: " + error.message);
    renderContributions();

  }

}