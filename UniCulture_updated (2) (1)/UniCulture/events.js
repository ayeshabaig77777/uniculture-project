import { db } from "./firebase-config.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import { heartButtonHTML, applyFavoriteState } from "./favorites.js";


// Expected fields on each document in the "events" Firestore collection:
//   name        (string)
//   description (string)
//   category    (string) — Festival | Sports & Culture | Cultural Fair | Religious Festival | National | Sufi Festival
//   date        (string) — e.g. "March 21, 2026"
//   venue       (string) — e.g. "Lahore, Punjab"
//   image       (string) — e.g. "images/basanti.jpg"
//   featured    (boolean) — true = shows in the "Featured Events" section

const featuredGrid = document.getElementById("featuredEvents");
const allEventsWrap = document.getElementById("allEvents");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

let allEvents = [];


// Staggered fade-up, same look as the site's global .reveal class,
// but triggered manually since these cards are added after page load.
function revealStagger(selector) {

  document.querySelectorAll(selector).forEach((el, i) => {

    setTimeout(() => {
      el.classList.add("active");
    }, 80 * i);

  });

}


function renderFeatured(events) {

  const featured = events.filter((e) => e.featured);

  if (!featured.length) {
    featuredGrid.innerHTML = "";
    return;
  }

  featuredGrid.innerHTML = featured.map((data) => `

    <a href="event_detail.html?id=${data.id}" class="event-link protected-btn">
      <div class="event-card reveal">

        ${heartButtonHTML("event", data.id, data.name, data.image)}

        ${data.image ? `<img src="${data.image}" alt="${data.name}">` : ""}

        <span class="event-tag">${data.category || "Event"}</span>

        <h3>${data.name}</h3>


        <div class="event-info">
          📅 ${data.date || "TBA"} &nbsp; · &nbsp; 📍 ${data.venue || "TBA"}
        </div>

      </div>
    </a>

  `).join("");

  revealStagger(".event-card.reveal:not(.active)");

}


function renderAll(events) {

  if (!events.length) {
    allEventsWrap.innerHTML = `
      <div class="empty-box">
        <h3>No Events Found</h3>
        <p>Try a different search or category.</p>
      </div>
    `;
    return;
  }

  allEventsWrap.innerHTML = events.map((data) => `

    <a href="event_detail.html?id=${data.id}" class="event-link protected-btn">
      <div class="event-card reveal">

        ${heartButtonHTML("event", data.id, data.name, data.image)}

        ${data.image ? `<img src="${data.image}" alt="${data.name}">` : ""}

        <span class="event-tag">${data.category || "Event"}</span>

        <h3>${data.name}</h3>


        <div class="event-info">
          📅 ${data.date || "TBA"} &nbsp; · &nbsp; 📍 ${data.venue || "TBA"}
        </div>

      </div>
    </a>

  `).join("");

  revealStagger(".event-card.reveal:not(.active)");

}


function applyFilters() {

  const search = (searchInput?.value || "").toLowerCase().trim();
  const category = categoryFilter?.value || "All";

  const filtered = allEvents.filter((e) => {

    const matchesSearch =
      !search ||
      (e.name || "").toLowerCase().includes(search) ||
      (e.description || "").toLowerCase().includes(search);

    const matchesCategory = category === "All" || e.category === category;

    return matchesSearch && matchesCategory;

  });

  renderAll(filtered);

}


async function loadEvents() {

  featuredGrid.innerHTML = `<p style="padding:20px;">Loading events...</p>`;
  allEventsWrap.innerHTML = "";

  try {

    const snapshot = await getDocs(collection(db, "events"));

    allEvents = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));

    if (!allEvents.length) {

      featuredGrid.innerHTML = "";
      allEventsWrap.innerHTML = `
        <div class="empty-box">
          <h3>No Events Yet</h3>
          <p>Events added in Firestore ("events" collection) will show up here.</p>
        </div>
      `;
      return;

    }

    renderFeatured(allEvents);
    renderAll(allEvents);
    applyFavoriteState();

  } catch (error) {

    console.error("Could not load events:", error);

    featuredGrid.innerHTML = "";
    allEventsWrap.innerHTML = `
      <div class="empty-box">
        <h3>Unable to Load Events</h3>
        <p>Check the console for details.</p>
      </div>
    `;

  }

}


searchInput?.addEventListener("input", applyFilters);
categoryFilter?.addEventListener("change", applyFilters);

loadEvents();