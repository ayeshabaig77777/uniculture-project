import { db } from "./firebase-config.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import { trackView } from "./track-view.js";


function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) {
    console.log("Missing HTML element:", id);
    return;
  }
  el.textContent = value ?? "Coming Soon";
}


async function loadRegionDetail() {

  const region = new URLSearchParams(window.location.search).get("region");

  if (!region) {
    setText("regionTitle", "Region not specified");
    setText("regionOverview", "Please go back to the Cultural Map and pick a region.");
    return;
  }

  let r;

  try {

    const docSnap = await getDoc(doc(db, "Regions", region));

    if (!docSnap.exists()) {
      setText("regionTitle", "Region not found");
      setText("regionOverview", "This region hasn't been added to Firestore yet. Go to the Admin page and click 'Seed Regions' once.");
      return;
    }

    r = docSnap.data();

  } catch (error) {
    console.error("Could not load region from Firestore:", error);
    setText("regionTitle", "Could not load region");
    setText("regionOverview", "Something went wrong fetching this region from Firestore. Check the console for details.");
    return;
  }

  document.title = `${r.title || region} | UniCulture`;

  trackView({
    type: "region",
    id: region,
    title: r.title || region,
    image: r.image || "",
    url: `region-detail.html?region=${region}`
  });

  // =========================
  // HERO
  // =========================

  setText("regionBadge", "Province of Pakistan");
  setText("regionTitle", r.title);
  setText("regionTagline", r.tagline || "");
  setText("regionOverview", r.overview || r.description);
  setText("regionCapital", r.city);

  // =========================
  // OVERVIEW + QUICK FACTS
  // =========================

  setText("regionDescription", r.description || r.overview);
  setText("factCapital", r.city);
  setText("factPopulation", r.population);
  setText("factLanguages", r.languages);
  setText("factArea", r.area);

  // =========================
  // HISTORY / CULTURE
  // =========================

  setText("regionHistory", r.history);
  setText("regionCulture", r.culture);

  // =========================
  // PLACES TO VISIT
  // =========================

  const places = Array.isArray(r.places) ? r.places : [];
  const placesWrap = document.getElementById("regionPlacesWrap");

  if (places.length) {

    placesWrap.innerHTML = places.map((place) => `
      <a href="tourism.html" class="rd-place-card">
        <img src="${place.image}" alt="${place.title}">
        <span>${place.title}</span>
      </a>
    `).join("");

  } else {

    placesWrap.innerHTML = `<p style="grid-column:1/-1;color:#888;">No places added for this region yet.</p>`;

  }

  // =========================
  // FUN FACT
  // =========================

  if (r.funfact) {
    setText("regionFunfact", r.funfact);
    document.getElementById("regionFunfactCard").style.display = "flex";
  }

}

loadRegionDetail();