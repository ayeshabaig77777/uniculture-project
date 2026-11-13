import { db } from "./firebase-config.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import { heartButtonHTML, applyFavoriteState } from "./favorites.js";

const grid = document.querySelector(".tourism-grid");
const searchInput = document.getElementById("tourSearch");
const regionButtonsWrap = document.querySelector(".region-buttons");
const typeButtonsWrap = document.querySelector(".type-buttons");

let allDestinations = [];

async function loadTourism() {

  grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#888;">Loading destinations...</p>`;

  try {

    const snapshot = await getDocs(collection(db, "Tourism"));

    allDestinations = [];

    snapshot.forEach((docSnap) => {
      allDestinations.push({ id: docSnap.id, ...docSnap.data() });
    });

    applyFilters();

  } catch (error) {

    console.error("Could not load tourism destinations:", error);
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#888;">Could not load destinations. Please try again later.</p>`;

  }

}

function renderCards(list) {

  if (!list.length) {
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#888;">No destinations match your search or filters.</p>`;
    return;
  }

  grid.innerHTML = list.map((data) => `

    <div class="tour-card" data-region="${data.region}" data-type="${data.type}">
      ${heartButtonHTML("tourism", data.id, data.name, data.image)}
      <img src="${data.image}" alt="${data.name}">
      <h3>${data.name}</h3>
      <p>${data.description || ""}</p>
      <a href="tourism_detail.html?id=${data.id}" class="protected-btn">
        <button type="button" class="details-btn">View Details</button>
      </a>
    </div>

  `).join("");

  applyFavoriteState();

}

function applyFilters() {

  const search = (searchInput?.value || "").toLowerCase().trim();
  const activeRegionBtn = regionButtonsWrap?.querySelector("button.active");
  const activeTypeBtn = typeButtonsWrap?.querySelector("button.active");

  const region = activeRegionBtn ? activeRegionBtn.dataset.region : "all";
  const type = activeTypeBtn ? activeTypeBtn.dataset.type : "all";

  const filtered = allDestinations.filter((d) => {

    const matchesRegion = region === "all" || d.region === region;
    const matchesType = type === "all" || d.type === type;
    const matchesSearch =
      !search ||
      (d.name || "").toLowerCase().includes(search) ||
      (d.description || "").toLowerCase().includes(search) ||
      (d.city || "").toLowerCase().includes(search);

    return matchesRegion && matchesType && matchesSearch;

  });

  renderCards(filtered);

}

// REGION FILTER BUTTONS
regionButtonsWrap?.addEventListener("click", (e) => {

  const btn = e.target.closest("button");
  if (!btn) return;

  regionButtonsWrap.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  applyFilters();

});

// TYPE FILTER BUTTONS
typeButtonsWrap?.addEventListener("click", (e) => {

  const btn = e.target.closest("button");
  if (!btn) return;

  typeButtonsWrap.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  applyFilters();

});

// SEARCH
searchInput?.addEventListener("input", applyFilters);

loadTourism();