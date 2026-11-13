import { confirmDialog } from "./toast.js";

import { db } from "./firebase-config.js";

import {
  collection,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import { escapeHTML, formatDate } from "./utils.js";

import { ADMIN_UID } from "./admin-config.js";

const PAGE_SIZE = 20;

const listEl = document.getElementById("usersAdminList");

let allUsers = [];
let searchText = "";
let statusFilter = "all";
let visibleCount = PAGE_SIZE;
let shellBuilt = false;


// ================= PAGE SHELL (built only once) =================

function buildShell() {

  listEl.innerHTML = `
    <div class="ad-page">

      <div class="ad-head">
        <h2>Users</h2>
        <p>Banning or unbanning takes effect the next time that user logs in.</p>
      </div>

      <div class="ad-stats" id="adUserStats"></div>

      <div class="ad-toolbar">
        <input id="adUserSearch" class="ad-search" type="search" placeholder="Search by name or email...">
        <select id="adUserStatus" class="ad-select">
          <option value="all">All users</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
        </select>
      </div>

      <div id="adUserTable"></div>

    </div>
  `;

  document.getElementById("adUserSearch").addEventListener("input", (e) => {
    searchText = e.target.value.trim().toLowerCase();
    visibleCount = PAGE_SIZE;
    renderTable();
  });

  document.getElementById("adUserStatus").addEventListener("change", (e) => {
    statusFilter = e.target.value;
    visibleCount = PAGE_SIZE;
    renderTable();
  });

  // Ban / Unban / Show more buttons (event delegation)
  document.getElementById("adUserTable").addEventListener("click", (e) => {

    const banBtn = e.target.closest("[data-ban-uid]");
    if (banBtn) {
      toggleBan(banBtn.dataset.banUid, banBtn);
      return;
    }

    if (e.target.closest("#adUserMore")) {
      visibleCount += PAGE_SIZE;
      renderTable();
    }

  });

  shellBuilt = true;

}


// ================= LOAD =================

export async function loadAdminUsers() {

  if (!listEl) return;

  if (!shellBuilt) buildShell();

  document.getElementById("adUserTable").innerHTML =
    `<div class="ad-empty">Loading users...</div>`;

  try {

    const usersSnap = await getDocs(collection(db, "Users"));

    allUsers = usersSnap.docs.map((d) => ({ uid: d.id, ...d.data() }));

    // Newest users first; users without a joined date go last
    allUsers.sort((a, b) => (b.joinedAt?.seconds || 0) - (a.joinedAt?.seconds || 0));

    renderStats();
    renderTable();

  } catch (error) {

    console.error(error);
    document.getElementById("adUserTable").innerHTML =
      `<div class="ad-empty">Could not load users. Please refresh the page and try again.</div>`;

  }

}


// ================= STATS =================

function renderStats() {

  const total = allUsers.length;
  const banned = allUsers.filter((u) => u.banned === true).length;
  const active = total - banned;

  document.getElementById("adUserStats").innerHTML = `
    <div class="ad-stat"><div class="ad-stat-dot">👥</div><div><strong>${total}</strong><span>Total users</span></div></div>
    <div class="ad-stat is-approved"><div class="ad-stat-dot">✅</div><div><strong>${active}</strong><span>Active users</span></div></div>
    <div class="ad-stat is-banned"><div class="ad-stat-dot">🚫</div><div><strong>${banned}</strong><span>Banned users</span></div></div>
  `;

}


// ================= TABLE =================

function getFilteredUsers() {

  return allUsers.filter((u) => {

    if (statusFilter === "active" && u.banned === true) return false;
    if (statusFilter === "banned" && u.banned !== true) return false;

    if (!searchText) return true;

    const haystack = `${u.name || ""} ${u.email || ""}`.toLowerCase();
    return haystack.includes(searchText);

  });

}

function renderTable() {

  const box = document.getElementById("adUserTable");
  const filtered = getFilteredUsers();

  if (filtered.length === 0) {
    box.innerHTML = `<div class="ad-empty">${
      allUsers.length === 0
        ? "No registered users yet. New signups will appear here."
        : "No users match this search or filter."
    }</div>`;
    return;
  }

  const shown = filtered.slice(0, visibleCount);

  const rows = shown.map((u, i) => {

    const isBanned = u.banned === true;
    const isAdminUser = u.uid === ADMIN_UID;

    const displayName = u.name || (u.email ? u.email.split("@")[0] : "(no name)");
    const initial = displayName.charAt(0).toUpperCase();

    const emailCell = u.email
      ? escapeHTML(u.email)
      : `<span class="ad-muted">No email saved</span>`;

    let actionCell;
    if (isAdminUser) {
      actionCell = `<span class="ad-muted">—</span>`;
    } else {
      actionCell = `
        <button class="ad-btn ${isBanned ? "approve" : "reject"}" data-ban-uid="${escapeHTML(u.uid)}">
          ${isBanned ? "Unban" : "Ban"}
        </button>`;
    }

    return `
      <tr>
        <td class="ad-muted">${i + 1}</td>
        <td>
          <div class="ad-user">
            <span class="ad-avatar ${isBanned ? "is-banned" : ""}">${escapeHTML(initial)}</span>
            <span>${escapeHTML(displayName)}${isAdminUser ? `<span class="ad-you">Admin</span>` : ""}</span>
          </div>
        </td>
        <td>${emailCell}</td>
        <td>${escapeHTML(formatDate(u.joinedAt))}</td>
        <td><span class="ad-badge ${isBanned ? "rejected" : "approved"}">${isBanned ? "Banned" : "Active"}</span></td>
        <td>${actionCell}</td>
      </tr>
    `;

  }).join("");

  const moreBtn = filtered.length > shown.length
    ? `<button id="adUserMore" class="ad-btn ghost ad-more">Show more (${filtered.length - shown.length} remaining)</button>`
    : "";

  box.innerHTML = `
    <div class="ad-table-wrap">
      <table class="ad-table">
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Email</th>
            <th>Joined</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    ${moreBtn}
    <p class="ad-meta" style="margin-top:12px;">Showing ${shown.length} of ${filtered.length} users</p>
  `;

}


// ================= BAN / UNBAN =================

async function toggleBan(uid, btn) {

  const user = allUsers.find((u) => u.uid === uid);
  if (!user) return;

  const isCurrentlyBanned = user.banned === true;
  const action = isCurrentlyBanned ? "unban" : "ban";

  const sure = await confirmDialog(`Are you sure you want to ${action} this user?`, {
    confirmText: isCurrentlyBanned ? "Unban" : "Ban",
    danger: !isCurrentlyBanned
  });
  if (!sure) return;

  btn.disabled = true;
  btn.textContent = "Please wait...";

  try {

    await updateDoc(doc(db, "Users", uid), { banned: !isCurrentlyBanned });

    // Update local data without reloading from Firestore
    user.banned = !isCurrentlyBanned;

    renderStats();
    renderTable();

  } catch (error) {

    console.error(error);
    alert("Could not update user: " + error.message);
    renderTable();

  }

}