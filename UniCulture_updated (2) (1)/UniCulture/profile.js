import { escapeHTML, safeUrl } from "./utils.js";

import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import { getRecentlyViewed } from "./track-view.js";
import { getAllActivity, activityLabel, activityIcon, activityTime } from "./activity-log.js";


const notLoggedIn = document.getElementById("notLoggedIn");
const dashboardContent = document.getElementById("dashboardContent");
const profileGreeting = document.getElementById("profileGreeting");
const dashboardStats = document.getElementById("dashboardStats");
const myContributionsList = document.getElementById("myContributionsList");
const myFavoritesList = document.getElementById("myFavoritesList");
const recentlyViewedList = document.getElementById("recentlyViewedList");
const progressContainer = document.getElementById("contributionProgress");
const badgesContainer = document.getElementById("badgesList");
const activityContainer = document.getElementById("recentActivityList");

let statsState = { total: 0, approved: 0, pending: 0 };
let favoritesByType = {};
let totalFavorites = 0;

// Point weights for the gamification system (arbitrary, for engagement only)
const POINT_WEIGHTS = {
  submitted: 5,
  approved: 10,
  favorited: 2,
  liked: 1,
  commented: 3,
  rejected: 0,
  quiz: 3
};

const LEVELS = [
  { min: 0, name: "Newcomer", level: 1 },
  { min: 10, name: "Cultural Explorer", level: 2 },
  { min: 25, name: "Heritage Guardian", level: 3 },
  { min: 50, name: "Culture Champion", level: 4 }
];

const BADGES = [
  { key: "helper", name: "Cultural Helper", icon: "🥇", desc: "Complete 1 contribution", test: (s, f) => s.total >= 1 },
  { key: "heritage", name: "Heritage Lover", icon: "🏛️", desc: "Favorite a Heritage item", test: (s, f) => (f.heritage || 0) >= 1 },
  { key: "food", name: "Food Explorer", icon: "🍽️", desc: "Favorite a Food item", test: (s, f) => (f.food || 0) >= 1 },
  { key: "top", name: "Top Contributor", icon: "🏆", desc: "Get 5 approved contributions", test: (s, f) => s.approved >= 5 },
  { key: "guardian", name: "Culture Guardian", icon: "🛡️", desc: "Reach 10 total contributions", test: (s, f) => s.total >= 10 }
];


onAuthStateChanged(auth, (user) => {

  if (!user) {
    notLoggedIn.style.display = "block";
    dashboardContent.style.display = "none";
    return;
  }

  notLoggedIn.style.display = "none";
  dashboardContent.style.display = "flex";

  profileGreeting.textContent = user.displayName || user.email;

  const avatarEl = document.getElementById("profileAvatar");
  if (avatarEl) {
    const initial = (user.displayName || user.email || "?").trim().charAt(0).toUpperCase();
    avatarEl.textContent = initial;
  }

  const memberSinceTag = document.getElementById("memberSinceTag");
  if (memberSinceTag && user.metadata && user.metadata.creationTime) {
    const d = new Date(user.metadata.creationTime);
    const formatted = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    memberSinceTag.textContent = `📅 Member since ${formatted}`;
  }

  loadContributions(user.uid);
  loadFavorites(user.uid);
  loadRecentlyViewed();
  loadActivityAndPoints(user.uid);
  loadSavedPosts();

});


// ================= MY CONTRIBUTIONS =================

async function loadContributions(uid) {

  myContributionsList.innerHTML = `<p>Loading...</p>`;

  try {

    const q = query(
      collection(db, "Contributions"),
      where("uid", "==", uid),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    statsState.total = 0;
    statsState.approved = 0;
    statsState.pending = 0;

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      statsState.total++;
      if (data.status === "approved") statsState.approved++;
      if (data.status === "pending") statsState.pending++;
    });

    renderStatCards();
    renderProgressAndBadges();

    if (snapshot.empty) {
      myContributionsList.innerHTML = `
        <div class="empty-box">
          <h3>No Contributions Yet</h3>
          <p>Share something on the Contribute page!</p>
        </div>
      `;
      return;
    }

    myContributionsList.innerHTML = "";

    snapshot.forEach((docSnap) => {

      const data = docSnap.data();
      const dateStr = data.createdAt && data.createdAt.toDate
        ? data.createdAt.toDate().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        : "";

      myContributionsList.innerHTML += `
        <div class="contribution-item">
          <div class="contribution-item-row">
            ${data.fileURL ? `<img src="${escapeHTML(safeUrl(data.fileURL))}" alt="${escapeHTML(data.title)}">` : ""}
            <div class="contribution-item-info">
              <h4>${escapeHTML(data.title)}</h4>
              <div class="contribution-item-tags">
                <span class="tag-pill">${escapeHTML(data.category)}</span>
                <span class="contribution-item-region">📍 ${escapeHTML(data.region)}</span>
              </div>
              ${dateStr ? `<span class="contribution-item-date">📆 ${dateStr}</span>` : ""}
            </div>
            <span class="status status-${escapeHTML(data.status)}">${escapeHTML(data.status)}</span>
          </div>
        </div>
      `;

    });

  } catch (error) {

    console.error(error);
    myContributionsList.innerHTML = `<p>Could not load your contributions right now.</p>`;

  }

}


function renderStatCards() {

  const recentlyViewedCount = getRecentlyViewed().length;
  const badgesEarnedCount = BADGES.filter((b) => b.test(statsState, favoritesByType)).length;

  dashboardStats.innerHTML = `

    <div class="stat-card-v2">
      <div class="stat-icon stat-icon-blue">📄</div>
      <div><strong>${statsState.total}</strong><span>Total Contributions</span></div>
    </div>

    <div class="stat-card-v2">
      <div class="stat-icon stat-icon-green">✅</div>
      <div><strong>${statsState.approved}</strong><span>Approved</span></div>
    </div>

    <div class="stat-card-v2">
      <div class="stat-icon stat-icon-orange">⏳</div>
      <div><strong>${statsState.pending}</strong><span>Pending Review</span></div>
    </div>

    <div class="stat-card-v2">
      <div class="stat-icon stat-icon-purple">❤️</div>
      <div><strong>${totalFavorites}</strong><span>Total Favorites</span></div>
    </div>

    <div class="stat-card-v2">
      <div class="stat-icon stat-icon-teal">👁️</div>
      <div><strong>${recentlyViewedCount}</strong><span>Recently Viewed</span></div>
    </div>

    <div class="stat-card-v2">
      <div class="stat-icon stat-icon-pink">🏅</div>
      <div><strong>${badgesEarnedCount}</strong><span>Badges Earned</span></div>
    </div>

  `;

}


// ================= MY FAVORITES =================

async function loadFavorites(uid) {

  myFavoritesList.innerHTML = `<p>Loading...</p>`;

  try {

    const q = query(collection(db, "Favorites"), where("uid", "==", uid));
    const snapshot = await getDocs(q);

    const detailPages = {
      heritage: "heritage_detail.html",
      food: "food_detail.html",
      music: "music_detail.html",
      festival: "festivals_detail.html",
      handicraft: "handicraft_detail.html",
      language: "language_detail.html"
    };

    favoritesByType = {};
    totalFavorites = 0;

    if (snapshot.empty) {
      myFavoritesList.innerHTML = `
        <div class="empty-box">
          <h3>No Favorites Yet</h3>
          <p>Tap the heart on any card to save it here.</p>
        </div>
      `;
      renderStatCards();
      renderProgressAndBadges();
      return;
    }

    myFavoritesList.innerHTML = "";

    snapshot.forEach((docSnap) => {

      const data = docSnap.data();
      favoritesByType[data.type] = (favoritesByType[data.type] || 0) + 1;
      totalFavorites++;

      const link = `${detailPages[data.type] || "#"}?id=${encodeURIComponent(data.id)}`;

      myFavoritesList.innerHTML += `
        <a href="${escapeHTML(link)}" class="mini-card">
          <div class="mini-card-img-wrap">
            ${data.image ? `<img src="${escapeHTML(data.image)}" alt="${escapeHTML(data.title)}">` : `<div class="mini-card-noimg"></div>`}
            <span class="mini-card-overlay-icon">❤️</span>
          </div>
          <p class="mini-card-title">${escapeHTML(data.title)}</p>
          <span class="tag-pill">${escapeHTML(data.type)}</span>
        </a>
      `;

    });

    renderStatCards();
    renderProgressAndBadges();

  } catch (error) {

    console.error(error);
    myFavoritesList.innerHTML = `<p>Could not load your favorites right now.</p>`;

  }

}


// ================= PROGRESS + BADGES =================

function renderProgressAndBadges() {

  if (!progressContainer || !badgesContainer) return;

  const approved = statsState.approved;
  const goal = 5;
  const progressPct = Math.min(100, Math.round((approved / goal) * 100));

  const earnedBadges = BADGES.map((b) => ({ ...b, earned: b.test(statsState, favoritesByType) }));
  const nextBadge = earnedBadges.find((b) => !b.earned);

  progressContainer.innerHTML = `
    <div class="block-header">
      <h2>Contribution Progress</h2>
      <span class="level-chip" id="progressLevelChip">Level 1</span>
    </div>

    <div class="progress-card-body">

      <div class="progress-text-col">
        <p class="progress-tier-name" id="progressTierName">Cultural Explorer</p>
        <p class="progress-label">Keep sharing and preserving our rich culture!</p>
        <div class="progress-track">
          <div class="progress-fill" style="width:${progressPct}%;"></div>
        </div>
        <p class="progress-count">${approved} / ${goal} approved contributions</p>
      </div>

      <div class="progress-ring" style="background:conic-gradient(#265430 ${progressPct}%, #eee ${progressPct}% 100%);">
        <div class="progress-ring-inner">${progressPct}%</div>
      </div>

    </div>

    <div class="next-badge-panel">
      <p class="next-badge-heading">Next Badge</p>
      ${nextBadge
        ? `<div class="next-badge-row">
             <span class="next-badge-icon">${nextBadge.icon}</span>
             <div>
               <p class="next-badge-name">${nextBadge.name}</p>
               <span class="next-badge-desc">${nextBadge.desc}</span>
             </div>
           </div>`
        : `<p class="next-badge-desc">You've earned every badge! 🎉</p>`
      }
    </div>
  `;

  badgesContainer.innerHTML = earnedBadges.map((b) => `
    <div class="badge-item ${b.earned ? "earned" : "locked"}">
      <div class="badge-icon">${b.earned ? b.icon : "🔒"}</div>
      <span class="badge-name">${b.name}</span>
      <span class="badge-desc">${b.desc}</span>
    </div>
  `).join("");

}


// ================= ACTIVITY + POINTS + LEVEL =================

async function loadActivityAndPoints(uid) {

  activityContainer.innerHTML = `<p>Loading...</p>`;

  const allItems = await getAllActivity(uid, 100);

  // ---- points + level ----
  const totalPoints = allItems.reduce((sum, item) => sum + (POINT_WEIGHTS[item.type] || 0), 0);

  let currentLevel = LEVELS[0];
  LEVELS.forEach((lvl) => {
    if (totalPoints >= lvl.min) currentLevel = lvl;
  });

  const impactPointsEl = document.getElementById("impactPoints");
  if (impactPointsEl) impactPointsEl.textContent = totalPoints;

  const levelTag = document.getElementById("levelTag");
  if (levelTag) levelTag.textContent = `⭐ Level ${currentLevel.level} · ${currentLevel.name}`;

  const chip = document.getElementById("progressLevelChip");
  if (chip) chip.textContent = `Level ${currentLevel.level}`;

  const tierName = document.getElementById("progressTierName");
  if (tierName) tierName.textContent = currentLevel.name;

  // ---- 7-day sparkline ----
  renderSparkline(allItems);

  // ---- recent activity list (latest 6) ----
  const recentSix = allItems.slice(0, 6);

  if (!recentSix.length) {
    activityContainer.innerHTML = `
      <div class="empty-box">
        <h3>No Activity Yet</h3>
        <p>Contribute, favorite, or like something to see it here.</p>
      </div>
    `;
    return;
  }

  activityContainer.innerHTML = recentSix.map((item) => `
    <div class="activity-item">
      <span class="activity-icon">${activityIcon(item)}</span>
      <p>${escapeHTML(activityLabel(item))}</p>
      <span class="activity-time">${activityTime(item)}</span>
    </div>
  `).join("");

}


function renderSparkline(items) {

  const svg = document.getElementById("impactSparkline");
  if (!svg) return;

  const days = 7;
  const counts = new Array(days).fill(0);
  const now = new Date();

  items.forEach((item) => {
    if (!item.createdAt || !item.createdAt.toDate) return;
    const d = item.createdAt.toDate();
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays < days) {
      counts[days - 1 - diffDays]++;
    }
  });

  const max = Math.max(1, ...counts);
  const stepX = 100 / (days - 1);

  const points = counts.map((c, i) => {
    const x = i * stepX;
    const y = 28 - (c / max) * 24;
    return `${x},${y}`;
  }).join(" ");

  svg.innerHTML = `<polyline points="${points}" fill="none" stroke="#7ee79b" stroke-width="2" />`;

}


// ================= SAVED POSTS (Community bookmarks) =================

async function loadSavedPosts() {

  const container = document.getElementById("savedPostsList");
  if (!container) return;

  const savedIds = JSON.parse(localStorage.getItem("uniculture_saved_posts") || "[]");

  if (!savedIds.length) {
    container.innerHTML = `
      <div class="empty-box">
        <h3>No Saved Posts</h3>
        <p>Tap the 🔖 icon on any Community post to save it here.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `<p>Loading...</p>`;

  try {

    const results = await Promise.all(
      savedIds.map((id) => getDoc(doc(db, "Contributions", id)))
    );

    const posts = results.filter((snap) => snap.exists()).map((snap) => snap.data());

    if (!posts.length) {
      container.innerHTML = `
        <div class="empty-box">
          <h3>No Saved Posts</h3>
          <p>Tap the 🔖 icon on any Community post to save it here.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = "";

    posts.forEach((data) => {
      container.innerHTML += `
        <a href="community.html" class="recent-item">
          ${data.fileURL ? `<img src="${escapeHTML(safeUrl(data.fileURL))}" alt="${escapeHTML(data.title)}">` : ""}
          <div>
            <h4>${escapeHTML(data.title)}</h4>
            <span>${escapeHTML(data.category)}</span>
          </div>
        </a>
      `;
    });

  } catch (error) {

    console.error(error);
    container.innerHTML = `<p>Could not load saved posts.</p>`;

  }

}


// ================= RECENTLY VIEWED =================

function loadRecentlyViewed() {

  const items = getRecentlyViewed();

  if (!items.length) {
    recentlyViewedList.innerHTML = `
      <div class="empty-box">
        <h3>Nothing Viewed Yet</h3>
        <p>Explore Heritage, Food, Music and more — your recent visits will show up here.</p>
      </div>
    `;
    return;
  }

  recentlyViewedList.innerHTML = "";

  items.forEach((item) => {

    recentlyViewedList.innerHTML += `
      <a href="${escapeHTML(item.url)}" class="mini-card">
        <div class="mini-card-img-wrap">
          ${item.image ? `<img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}">` : `<div class="mini-card-noimg"></div>`}
          <span class="mini-card-overlay-icon">👁️</span>
        </div>
        <p class="mini-card-title">${escapeHTML(item.title)}</p>
        <span class="tag-pill">${escapeHTML(item.type)}</span>
      </a>
    `;

  });

}