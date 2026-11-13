import { auth } from "./firebase-config.js";

import { ADMIN_UID } from "./admin-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

// Only the admin account (by UID) sees the Admin Panel link

/* REVEAL ANIMATION */

const revealCards = document.querySelectorAll(".reveal");

window.addEventListener("load", () => {

  revealCards.forEach((card, index) => {

    setTimeout(() => {

      card.classList.add("active");

    }, 1000 + index * 350);

  });

});

/* MAP DATA */

function showRegion(region) {

  const data = {

    punjab: {
      city: "Lahore",
      title: "Punjab",
      overview: "Punjab is the cultural heartland of Pakistan.",
      highlights: ["Lahore Fort", "Badshahi Mosque", "Bhangra Dance"],
      population: "110 million",
      languages: "Punjabi, Urdu"
    },

    sindh: {
      city: "Karachi",
      title: "Sindh",
      overview: "Sindh is home to Indus Valley Civilization.",
      highlights: ["Mohenjo-Daro", "Ajrak", "Sufi Music"],
      population: "50 million",
      languages: "Sindhi, Urdu"
    },

    kpk: {
      city: "Peshawar",
      title: "KPK",
      overview: "KPK is famous for mountains and Pashtun culture.",
      highlights: ["Swat Valley", "Pashtun Culture"],
      population: "40 million",
      languages: "Pashto"
    },

    balochistan: {
      city: "Quetta",
      title: "Balochistan",
      overview: "Balochistan is known for tribal culture.",
      highlights: ["Gwadar", "Hingol Park"],
      population: "15 million",
      languages: "Balochi"
    },

    gilgit: {
      city: "Gilgit",
      title: "Gilgit-Baltistan",
      overview: "Gilgit-Baltistan features stunning mountains.",
      highlights: ["Hunza", "K2"],
      population: "2 million",
      languages: "Shina, Balti"
    }

  };

  const r = data[region];

  const regionInfoEl = document.getElementById("regionInfo");
  if (!regionInfoEl) return;

  regionInfoEl.innerHTML = `

    <span class="region-city">${r.city}</span>

    <h2>${r.title}</h2>

    <p class="region-text">${r.overview}</p>

    <h4>Cultural Highlights</h4>

    <div class="region-tags">
      ${r.highlights.map(tag => `<span>${tag}</span>`).join("")}
    </div>

    <div class="region-stats">

      <div>
        <small>Population</small>
        <strong>${r.population}</strong>
      </div>

      <div>
        <small>Languages</small>
        <strong>${r.languages}</strong>
      </div>

    </div>

  `;
}

window.showRegion = showRegion;

// Auto-show a region if the URL includes ?region=xxx (used by the Culture Quiz result page)
const urlRegion = new URLSearchParams(window.location.search).get("region");
if (urlRegion) {
  window.addEventListener("DOMContentLoaded", () => showRegion(urlRegion));
}

/* FIREBASE LOGIN CHECK */

onAuthStateChanged(auth, (user) => {

  const authArea = document.getElementById("auth-area");

  if (!authArea) return;

  if (user) {

    const initial =
    (user.displayName || user.email)
    .charAt(0)
    .toUpperCase();

    const isAdmin = user.uid === ADMIN_UID;

    authArea.innerHTML = `
      <button id="globalMenuToggle" class="hamburger-btn" title="Menu">☰</button>
      <div class="profile-circle">${initial}</div>
    `;

    buildGlobalMenu(user, initial, isAdmin);

  }

  else {

    removeGlobalMenu();

    authArea.innerHTML = `
      <a href="auth.html" class="login-btn" id="navLoginBtn">
        Login
      </a>
    `;

    // Prefer opening the site's popup login/signup modal (matches the
    // experience everywhere else). Falls back to the auth.html page on
    // any screen that doesn't include the modal markup.
    const navLoginBtn = document.getElementById("navLoginBtn");
    const authPopupEl = document.getElementById("authPopup");

    if (navLoginBtn && authPopupEl) {
      navLoginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        authPopupEl.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    }

  }

});


/* GLOBAL HAMBURGER MENU (available on every page once logged in) */

function buildGlobalMenu(user, initial, isAdmin) {

  removeGlobalMenu();

  const authArea = document.getElementById("auth-area");
  authArea.style.position = "relative";

  const panel = document.createElement("div");
  panel.id = "globalMenuPanel";
  panel.className = "global-dropdown-menu";

  panel.innerHTML = `

    <div class="global-menu-header">
      <div class="profile-avatar">${initial}</div>
      <div>
        <p class="global-menu-name">${user.displayName || "Community Member"}</p>
        <span class="global-menu-email">${user.email}</span>
      </div>
    </div>

    <nav class="dash-sidebar-nav">
      ${isAdmin ? `
        <a href="admin.html">🛡️ Admin Panel</a>
      ` : `
        <a href="profile.html">🏠 My Dashboard</a>
        <a href="profile.html#myContributionsBlock">📄 My Contributions</a>
        <a href="profile.html#myFavoritesBlock">❤️ Favorites</a>
        <a href="profile.html#recentlyViewedBlock">👁️ Recently Viewed</a>
        <a href="profile.html#savedPostsBlock">🔖 Saved Posts</a>
      `}
      <a href="#" id="globalLogoutBtn">🚪 Logout</a>
    </nav>

  `;

  authArea.appendChild(panel);

  if (isAdmin) {
    document.body.classList.add("admin-mode");
  }

  const toggleBtn = document.getElementById("globalMenuToggle");
  const logoutBtn = document.getElementById("globalLogoutBtn");

  function open() {
    panel.classList.add("open");
  }

  function close() {
    panel.classList.remove("open");
  }

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    panel.classList.contains("open") ? close() : open();
  });

  document.addEventListener("click", (e) => {
    if (!panel.contains(e.target) && e.target !== toggleBtn) {
      close();
    }
  });

  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    await signOut(auth);
    window.location.href = "index.html";
  });

}

function removeGlobalMenu() {
  document.getElementById("globalMenuPanel")?.remove();
  document.getElementById("globalMenuBackdrop")?.remove();
}


/* FLOATING AI GUIDE BUTTON (every page except the guide itself) */

if (!location.pathname.endsWith("ai-guide.html")) {

  const aiFab = document.createElement("a");
  aiFab.href = "ai-guide.html";
  aiFab.id = "aiGuideFab";
  aiFab.className = "protected-btn";
  aiFab.title = "Ask the AI Guide";
  aiFab.innerHTML = '<img src="images/ai-assistant-icon.png" alt="UniCulture AI Assistant">';

  document.body.appendChild(aiFab);

}


/* TRIP PLANNER LINK (added to the navbar of every page automatically) */

(function addTripPlannerLink() {

  const tourismLink = document.querySelector('.nav-links a[href="tourism.html"]');

  if (!tourismLink || document.querySelector(".nav-planner")) return;

  const link = document.createElement("a");
  link.href = "trip-planner.html";
  link.className = "nav-planner";
  link.textContent = "Trip Planner";

  if (location.pathname.endsWith("trip-planner.html")) {
    link.classList.add("active");
  }

  tourismLink.insertAdjacentElement("afterend", link);

})();


/* CULTURE EXPLORER LINK (added to the navbar of every page automatically) */

(function addCultureLink() {

  const anchor = document.querySelector(".nav-planner") ||
                 document.querySelector('.nav-links a[href="tourism.html"]');

  if (!anchor || document.querySelector(".nav-culture")) return;

  const link = document.createElement("a");
  link.href = "culture.html";
  link.className = "nav-culture";
  link.textContent = "Culture";

  if (location.pathname.endsWith("culture.html")) {
    link.classList.add("active");
    link.style.fontWeight = "800";
  }

  anchor.insertAdjacentElement("afterend", link);

})();