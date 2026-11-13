import { db } from "./firebase-config.js";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import { trackView } from "./track-view.js";


const TYPE_LABELS = {
  historical: "Historical Site",
  natural: "Natural Attraction",
  archaeological: "Archaeological Site"
};


function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

// The parts of a place's culture, in the order they appear on the page
const CULTURE_SECTIONS = [
  { key: "food", icon: "🍲", title: "Local Food", c1: "#f59e0b", c2: "#ea580c" },
  { key: "wedding", icon: "💍", title: "Weddings", c1: "#ec4899", c2: "#be185d" },
  { key: "dress", icon: "👗", title: "Dress", c1: "#8b5cf6", c2: "#6d28d9" },
  { key: "language", icon: "🗣", title: "Language", c1: "#3b82f6", c2: "#1d4ed8" },
  { key: "festivals", icon: "🎶", title: "Festivals & Music", c1: "#d946ef", c2: "#a21caf" },
  { key: "crafts", icon: "🧶", title: "Crafts", c1: "#b45309", c2: "#78350f" },
  { key: "etiquette", icon: "🤝", title: "Etiquette", c1: "#14b8a6", c2: "#0f766e" }
];

async function showCulture(placeId) {

  try {

    const q = query(collection(db, "Culture"), where("places", "array-contains", placeId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return;

    const areaDoc = snapshot.docs[0];
    const area = areaDoc.data();
    const sections = area.sections || {};

    // One colourful tile per topic. Tapping a tile opens the Culture Explorer story for this area.
    const tiles = CULTURE_SECTIONS.filter((s) => {
      const sec = sections[s.key];
      return sec && ((sec.items && sec.items.length) || sec.intro);
    }).map((s) => {

      const count = (sections[s.key].items || []).length;

      return `
        <a class="culture-tile" href="city.html?id=${encodeURIComponent(areaDoc.id)}#${s.key === "food" ? "food" : "culture"}"
           style="background:linear-gradient(135deg, ${s.c1}, ${s.c2});">
          <span class="ic">${s.icon}</span>
          <b>${s.title}</b>
          ${count ? `<small>${count} ${count === 1 ? "story" : "stories"}</small>` : ""}
        </a>`;

    });

    // Nothing written for this area yet: show nothing rather than an empty box
    if (!tiles.length) return;

    document.getElementById("cultureTitle").textContent = `Culture of ${area.name}`;

    const chip = document.getElementById("cultureChip");
    const verified = area.status === "verified";
    chip.textContent = verified ? "✓ Verified" : "Draft · being verified";
    chip.className = "culture-chip " + (verified ? "verified" : "draft");

    document.getElementById("cultureTagline").textContent = area.tagline || "";

    const grid = document.getElementById("cultureGrid");
    grid.className = "culture-tiles";
    grid.innerHTML = tiles.join("");

    document.getElementById("cultureSources").innerHTML =
      `<a class="culture-cta" href="city.html?id=${encodeURIComponent(areaDoc.id)}">🧭 Explore the culture of ${esc(area.name)} →</a>`;

    document.getElementById("cultureSection").style.display = "block";

  } catch (error) {
    // e.g. Firestore rules do not allow the Culture collection yet: just hide the section
    console.warn("Culture section not shown:", error.message);
  }

}

function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value || "Not Available";
}


// URL se ID lena

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {

  alert("Destination not found");
  throw new Error("No ID Found");

}


// Firestore document

const docRef = doc(db, "Tourism", id);
const docSnap = await getDoc(docRef);


if (!docSnap.exists()) {

  document.body.innerHTML = `
    <h1 style="text-align:center;margin-top:100px;">
    Destination not found
    </h1>
  `;

} else {

  const data = docSnap.data();

  trackView({
    type: "tourism",
    id: id,
    title: data.name,
    image: data.image || "",
    url: `tourism_detail.html?id=${id}`
  });

  // Page title
  document.title = `${data.name} | UniCulture`;

  // HERO
  setText("name", data.name);
  setText("location2", `${data.city || ""}${data.city && data.province ? ", " : ""}${data.province || ""}`);
  setText("typeBadge", TYPE_LABELS[data.type] || "Destination");

  // OVERVIEW
  setText("description", data.description);

  // QUICK FACTS
  setText("location", data.province);
  setText("category2", TYPE_LABELS[data.type] || data.type);
  setText("besttime", data.best_time_to_visit);
  setText("howtoreach", data.how_to_reach);

  // HISTORY
  setText("history", data.history);

  // VISITOR TIPS
  setText("tips", data.tips);
  setText("city", data.city);

  // THINGS TO DO
  const activitiesWrap = document.getElementById("activitiesWrap");
  const activitiesSection = document.getElementById("activitiesSection");
  const activities = Array.isArray(data.activities) ? data.activities : [];

  if (activities.length) {

    activitiesWrap.innerHTML = activities.map((item) => `<li>${item}</li>`).join("");
    activitiesSection.style.display = "block";

  }

  // FUN FACT
  setText("funfact", data.funfact);

  // NEARBY ATTRACTIONS — only destinations explicitly marked as real
  // geographic neighbors in the "nearby" field (curated in seed-tourism.js),
  // not just "same province". Many provinces are huge, so a same-region
  // match alone would be misleading.
  try {

    const nearbyWrap = document.getElementById("nearbyWrap");
    const nearbySection = document.getElementById("nearbySection");
    const nearbyIds = Array.isArray(data.nearby) ? data.nearby : [];

    if (nearbyIds.length) {

      const nearbyDocs = await Promise.all(
        nearbyIds.map((nid) => getDoc(doc(db, "Tourism", nid)))
      );

      const nearby = nearbyDocs
        .filter((d) => d.exists())
        .map((d) => ({ id: d.id, ...d.data() }));

      if (nearby.length) {

        nearbyWrap.innerHTML = nearby.map((place) => `
          <a href="tourism_detail.html?id=${place.id}" class="nearby-card">
            <img src="${place.image}" alt="${place.name}">
            <span>${place.name}</span>
          </a>
        `).join("");

        nearbySection.style.display = "block";

      }

    }

  } catch (error) {
    console.error("Could not load nearby attractions:", error);
  }

  // CULTURE OF THIS AREA
  await showCulture(id);

  // SCROLL-REVEAL ANIMATION for content sections
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver((entries) => {

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });

    }, { threshold: 0.15 });

    revealEls.forEach((el) => observer.observe(el));

  } else {

    revealEls.forEach((el) => el.classList.add("in-view"));

  }

}