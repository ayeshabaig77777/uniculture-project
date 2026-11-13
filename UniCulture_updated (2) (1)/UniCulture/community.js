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
  setDoc,
  deleteDoc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import { logActivity } from "./activity-log.js";
import { commentSectionHTML, initComments } from "./comments.js";


const grid = document.getElementById("communityGrid");
const filters = document.getElementById("communityFilters");
const searchInput = document.getElementById("communitySearch");
const loadMoreBtn = document.getElementById("loadMoreBtn");

const PAGE_SIZE = 6;
let visibleCount = PAGE_SIZE;

let allContributions = [];
let currentUser = null;
let likedSet = new Set();


onAuthStateChanged(auth, async (user) => {

  currentUser = user;
  likedSet.clear();

  if (!user) {
    // page-guard.js handles showing the login popup / redirect.
    // Don't fetch or render anything until a user is confirmed.
    grid.innerHTML = "";
    return;
  }

  await loadUserLikes(user.uid);
  await loadCommunityFeed();

});


async function loadUserLikes(uid) {

  try {

    const q = query(collection(db, "Likes"), where("uid", "==", uid));
    const snapshot = await getDocs(q);

    snapshot.forEach((docSnap) => {
      likedSet.add(docSnap.data().contributionId);
    });

  } catch (error) {
    console.error("Could not load likes:", error);
  }

}


async function loadCommunityFeed() {

  grid.innerHTML = `<p style="text-align:center;padding:60px;">Loading community contributions...</p>`;

  try {

    const q = query(
      collection(db, "Contributions"),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    allContributions = [];

    snapshot.forEach((docSnap) => {
      allContributions.push({ id: docSnap.id, ...docSnap.data() });
    });

    renderGrid(allContributions);
    renderTopContributors();
    renderTrendingTags();
    renderPopularPlaces();

  } catch (error) {

    console.error(error);
    grid.innerHTML = `<p style="text-align:center;padding:60px;">Could not load community contributions right now.</p>`;

  }

}


function timeAgo(timestamp) {

  if (!timestamp || !timestamp.toDate) return "recently";

  const diffMs = Date.now() - timestamp.toDate().getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;

}


function getFilteredItems() {

  const activeBtn = filters.querySelector(".filter-chip.active");
  const filter = activeBtn ? activeBtn.dataset.filter : "all";
  const searchTerm = (searchInput.value || "").trim().toLowerCase();

  let items = filter === "all"
    ? allContributions
    : allContributions.filter((item) => item.category === filter);

  if (searchTerm) {
    items = items.filter((item) => {
      const haystack = `${item.title} ${item.description} ${item.region} ${item.contributorName || ""} ${(item.tags || []).join(" ")}`.toLowerCase();
      return haystack.includes(searchTerm);
    });
  }

  return items;

}


function renderGrid(items) {

  if (!items.length) {
    grid.innerHTML = `
      <div class="empty-box">
        <h3>Nothing Here Yet</h3>
        <p>Be the first to contribute something from the Contribute page!</p>
      </div>
    `;
    loadMoreBtn.style.display = "none";
    return;
  }

  const visibleItems = items.slice(0, visibleCount);

  grid.innerHTML = "";

  visibleItems.forEach((data, index) => {

    const isFeatured = index === 0 && visibleCount === PAGE_SIZE;

    const fileBlock = data.fileURL
      ? `<img src="${escapeHTML(safeUrl(data.fileURL))}" alt="${escapeHTML(data.title)}" class="community-card-img">`
      : `<div class="community-card-img community-card-noimg">No Image</div>`;

    const isLiked = likedSet.has(data.id);
    const likeCount = data.likeCount || 0;
    const commentCount = data.commentCount || 0;
    const initial = (data.contributorName || "C").trim().charAt(0).toUpperCase();
    const timeText = timeAgo(data.createdAt);
    const savedPosts = JSON.parse(localStorage.getItem("uniculture_saved_posts") || "[]");
    const isBookmarked = savedPosts.includes(data.id);

    const tagsHTML = (data.tags || [])
      .map((t) => `<span class="tag-pill">#${escapeHTML(t)}</span>`)
      .join("");

    grid.innerHTML += `

      <div class="community-card ${isFeatured ? "community-card-featured" : ""}">

        <div class="community-card-media">
          ${fileBlock}
          <span class="community-card-badge">${isFeatured ? "Featured" : escapeHTML(data.category)}</span>
        </div>

        <div class="community-card-body">

          ${isFeatured ? `<span class="community-card-category">${escapeHTML(data.category)}</span>` : ""}

          <h3>${escapeHTML(data.title)}</h3>

          <span class="community-card-location">📍 ${escapeHTML(data.region)}</span>

          <p>${escapeHTML(data.description)}</p>

          ${tagsHTML ? `<div class="tag-list">${tagsHTML}</div>` : ""}

          <div class="community-card-author">
            <span class="author-avatar">${escapeHTML(initial)}</span>
            <div>
              <span class="author-name">${escapeHTML(data.contributorName || "Community Member")}</span>
              <span class="author-time">${timeText}</span>
            </div>
          </div>

          <div class="community-card-actions">

            <button class="like-btn ${isLiked ? "active" : ""}" data-id="${data.id}">
              <svg class="like-icon" viewBox="0 0 24 24" width="16" height="16">
                <path d="M12 21s-7.5-4.6-10.2-9.1C0 9 1.2 5.5 4.5 4.6c2-.5 4 .3 5.5 2.1 1.5-1.8 3.5-2.6 5.5-2.1 3.3.9 4.5 4.4 2.7 7.3C19.5 16.4 12 21 12 21z"/>
              </svg>
              <span class="like-count">${likeCount}</span>
            </button>

            <span class="comment-count-label">💬 ${commentCount}</span>

            <button class="bookmark-btn ${isBookmarked ? "active" : ""}" data-id="${data.id}" title="Save for later">🔖</button>

          </div>

          ${commentSectionHTML(data.id)}

        </div>

      </div>

    `;

  });

  loadMoreBtn.style.display = items.length > visibleCount ? "block" : "none";

}


// ================= LIKE BUTTON =================

grid.addEventListener("click", async (e) => {

  const bookmarkBtn = e.target.closest(".bookmark-btn");

  if (bookmarkBtn) {

    const id = bookmarkBtn.dataset.id;
    const saved = JSON.parse(localStorage.getItem("uniculture_saved_posts") || "[]");
    const idx = saved.indexOf(id);

    if (idx === -1) {
      saved.push(id);
      bookmarkBtn.classList.add("active");
    } else {
      saved.splice(idx, 1);
      bookmarkBtn.classList.remove("active");
    }

    localStorage.setItem("uniculture_saved_posts", JSON.stringify(saved));
    return;

  }

  const btn = e.target.closest(".like-btn");
  if (!btn) return;

  if (!currentUser) {
    alert("Please login to like a contribution.");
    return;
  }

  const contributionId = btn.dataset.id;
  const likeDocId = `${currentUser.uid}_${contributionId}`;
  const likeRef = doc(db, "Likes", likeDocId);
  const contributionRef = doc(db, "Contributions", contributionId);

  const countSpan = btn.querySelector(".like-count");
  const item = allContributions.find((c) => c.id === contributionId);

  try {

    if (likedSet.has(contributionId)) {

      likedSet.delete(contributionId);
      btn.classList.remove("active");
      item.likeCount = Math.max(0, (item.likeCount || 1) - 1);
      countSpan.textContent = item.likeCount;

      await deleteDoc(likeRef);
      await updateDoc(contributionRef, { likeCount: increment(-1) });

    } else {

      likedSet.add(contributionId);
      btn.classList.add("active");
      item.likeCount = (item.likeCount || 0) + 1;
      countSpan.textContent = item.likeCount;

      await setDoc(likeRef, {
        uid: currentUser.uid,
        contributionId,
        createdAt: new Date()
      });

      await updateDoc(contributionRef, { likeCount: increment(1) });
      await logActivity(currentUser.uid, "liked", item.title);

    }

  } catch (error) {

    console.error("Could not update like:", error);

  }

});

initComments(grid);


// ================= FILTERS / SEARCH / LOAD MORE =================

filters.addEventListener("click", (e) => {

  const btn = e.target.closest(".filter-chip");
  if (!btn) return;

  filters.querySelectorAll(".filter-chip").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  visibleCount = PAGE_SIZE;
  renderGrid(getFilteredItems());

});

searchInput.addEventListener("input", () => {
  visibleCount = PAGE_SIZE;
  renderGrid(getFilteredItems());
});

loadMoreBtn.addEventListener("click", () => {
  visibleCount += PAGE_SIZE;
  renderGrid(getFilteredItems());
});


// ================= SIDEBAR: TOP CONTRIBUTORS =================

function renderTopContributors() {

  const container = document.getElementById("topContributors");
  const counts = {};

  allContributions.forEach((item) => {
    const name = item.contributorName || "Community Member";
    counts[name] = (counts[name] || 0) + 1;
  });

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  if (!sorted.length) {
    container.innerHTML = `<p class="sidebar-empty">No contributors yet.</p>`;
    return;
  }

  container.innerHTML = sorted.map(([name, count]) => `
    <div class="sidebar-row">
      <span>${escapeHTML(name)}</span>
      <span class="sidebar-count">${count}</span>
    </div>
  `).join("");

}


// ================= SIDEBAR: TRENDING TAGS =================

function renderTrendingTags() {

  const container = document.getElementById("trendingTags");
  const counts = {};

  allContributions.forEach((item) => {
    (item.tags || []).forEach((tag) => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
  });

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);

  if (!sorted.length) {
    container.innerHTML = `<p class="sidebar-empty">No tags yet.</p>`;
    return;
  }

  container.innerHTML = sorted.map(([tag]) => `<span class="tag-pill">#${escapeHTML(tag)}</span>`).join("");

}


// ================= SIDEBAR: POPULAR PLACES =================

async function renderPopularPlaces() {

  const container = document.getElementById("popularPlaces");

  try {

    const snapshot = await getDocs(collection(db, "Favorites"));
    const counts = {};

    snapshot.forEach((docSnap) => {

      const data = docSnap.data();
      const key = `${data.type}_${data.id}`;

      if (!counts[key]) {
        counts[key] = { title: data.title, image: data.image, count: 0 };
      }

      counts[key].count++;

    });

    const sorted = Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 4);

    if (!sorted.length) {
      container.innerHTML = `<p class="sidebar-empty">No favorites yet.</p>`;
      return;
    }

    container.innerHTML = sorted.map((place) => `
      <div class="sidebar-place">
        ${place.image ? `<img src="${escapeHTML(place.image)}" alt="${escapeHTML(place.title)}">` : `<div class="sidebar-place-noimg"></div>`}
        <div>
          <p>${escapeHTML(place.title)}</p>
          <span>${place.count} saves</span>
        </div>
      </div>
    `).join("");

  } catch (error) {

    console.error(error);
    container.innerHTML = `<p class="sidebar-empty">Could not load.</p>`;

  }

}


// Initial load now happens inside onAuthStateChanged above.