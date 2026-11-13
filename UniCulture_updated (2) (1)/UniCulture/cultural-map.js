import { db } from "./firebase-config.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// Fallback data, used only if the "Regions" collection hasn't been seeded yet in Firestore.
const DEFAULTS = {

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

// All 5 regions are fetched ONCE, up front, instead of on every click.
// This removes the per-click Firestore round trip that was causing the delay
// when switching between regions.
let regionsCache = null;
let prefetchPromise = null;


function prefetchRegions() {

  if (prefetchPromise) return prefetchPromise;

  prefetchPromise = (async () => {

    try {

      const snapshot = await getDocs(collection(db, "Regions"));
      const data = {};

      snapshot.forEach((docSnap) => {
        data[docSnap.id] = docSnap.data();
      });

      // Fill in any region that hasn't been seeded yet with the fallback.
      regionsCache = { ...DEFAULTS, ...data };

    } catch (error) {
      console.error("Could not prefetch Regions from Firestore, using defaults:", error);
      regionsCache = DEFAULTS;
    }

  })();

  return prefetchPromise;

}

// Kick off the fetch immediately when the map page loads, in the background,
// while the user is still looking at the map (before they've clicked anything).
prefetchRegions();


async function getRegionInfo(region) {

  if (!regionsCache) await prefetchRegions();

  return regionsCache[region] || DEFAULTS[region];

}


async function showRegion(region) {

  const regionInfoEl = document.getElementById("regionInfo");
  if (!regionInfoEl) return;

  regionInfoEl.innerHTML = `<p>Loading ${region}...</p>`;

  const r = await getRegionInfo(region);

  regionInfoEl.innerHTML = `

    <span class="region-city">${r.city}</span>

    <h2>${r.title}</h2>

    <p class="region-text">${r.overview}</p>

    <h4>Cultural Highlights</h4>

    <div class="region-tags">
      ${(r.highlights || []).map(tag => `<span>${tag}</span>`).join("")}
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

    <a href="region-detail.html?region=${region}" class="cta-button region-explore-btn protected-btn">Explore ${r.title} →</a>

  `;

  document.querySelectorAll(".map-btn").forEach((btn) => btn.classList.remove("active"));
  const activeBtn = document.querySelector(`.map-btn.${region}`);
  if (activeBtn) activeBtn.classList.add("active");

}

window.showRegion = showRegion;


// Auto-show a region if the URL includes ?region=xxx (used by the Culture Quiz result page)
const urlRegion = new URLSearchParams(window.location.search).get("region");
if (urlRegion) {
  showRegion(urlRegion);
}