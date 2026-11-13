import { db } from "./firebase-config.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import { trackView } from "./track-view.js";
import { heartButtonHTML, applyFavoriteState } from "./favorites.js";


const params = new URLSearchParams(window.location.search);
const id = params.get("id");


function setText(elId, value) {
  const el = document.getElementById(elId);
  if (el) el.textContent = value ?? "Not Available";
}


function startCountdown(eventDate) {

  const countdownWrap = document.getElementById("countdownWrap");
  const concludedMsg = document.getElementById("concludedMsg");

  if (!eventDate || isNaN(eventDate.getTime())) {
    countdownWrap.style.display = "none";
    return;
  }

  let timer;

  function tick() {

    const diff = eventDate.getTime() - Date.now();

    if (diff <= 0) {
      countdownWrap.style.display = "none";
      concludedMsg.style.display = "block";
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    setText("cdDays", days);
    setText("cdHours", hours);
    setText("cdMinutes", minutes);
    setText("cdSeconds", seconds);

  }

  tick();
  timer = setInterval(tick, 1000);

}


function showToast() {

  const toast = document.getElementById("edToast");
  if (!toast) return;

  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);

}


async function loadEventDetail() {

  if (!id) {
    document.getElementById("eventName").textContent = "Event not specified";
    document.getElementById("countdownWrap").style.display = "none";
    return;
  }

  try {

    const docSnap = await getDoc(doc(db, "events", id));

    if (!docSnap.exists()) {
      document.getElementById("eventName").textContent = "Event not found";
      document.getElementById("countdownWrap").style.display = "none";
      return;
    }

    const data = docSnap.data();

    document.title = `${data.name || "Event"} | UniCulture`;

    trackView({
      type: "event",
      id: id,
      title: data.name,
      image: data.image || "",
      url: `event_detail.html?id=${id}`
    });

    // HERO
    setText("eventCategory", data.category || "Event");
    setText("eventName", data.name);
    setText("eventVenue", data.venue || "TBA");

    // TICKET DATE BADGE
    const parsedDate = data.date ? new Date(data.date) : null;

    if (parsedDate && !isNaN(parsedDate.getTime())) {

      document.getElementById("ticketMonth").textContent =
        parsedDate.toLocaleString("en-US", { month: "short" });

      document.getElementById("ticketDay").textContent =
        parsedDate.getDate();

      document.getElementById("ticketYear").textContent =
        parsedDate.getFullYear();

    } else {

      document.getElementById("ticketMonth").textContent = "TBA";
      document.getElementById("ticketDay").textContent = "—";
      document.getElementById("ticketYear").textContent = "";

    }

    // ABOUT
    setText("eventDescription", data.description || "No description added yet.");

    // QUICK FACTS
    setText("factDate", data.date || "TBA");
    setText("factVenue", data.venue || "TBA");
    setText("factCategory", data.category || "Not Available");
    setText("factRegion", data.region || "Not Available");

    // HIGHLIGHTS (2x2 box)
    const highlightsBox = document.getElementById("highlightsBox");

    if (Array.isArray(data.highlights) && data.highlights.length) {

      highlightsBox.innerHTML = data.highlights.map((h) => `
        <div class="ed-highlight-item">
          <span class="ed-highlight-icon">${h.icon || "✨"}</span>
          <div>
            <h4>${h.title || ""}</h4>
            <p>${h.text || ""}</p>
          </div>
        </div>
      `).join("");

      highlightsBox.style.display = "grid";

    } else {
      highlightsBox.style.display = "none";
    }

    // CULTURAL HIGHLIGHTS (row)
    const cultureWrap = document.getElementById("cultureWrap");
    const cultureRow = document.getElementById("cultureRow");

    if (Array.isArray(data.culturalHighlights) && data.culturalHighlights.length) {

      cultureRow.innerHTML = data.culturalHighlights.map((h) => `
        <div class="ed-culture-item">
          <span class="ed-culture-icon">${h.icon || "✨"}</span>
          <h4>${h.title || ""}</h4>
          <p>${h.text || ""}</p>
        </div>
      `).join("");

      cultureWrap.style.display = "block";

    } else {
      cultureWrap.style.display = "none";
    }

    // HEART BUTTON
    document.getElementById("favSlot").innerHTML =
      heartButtonHTML("event", id, data.name, data.image);
    applyFavoriteState();

    // SHARE BUTTON

    // COUNTDOWN
    startCountdown(parsedDate);

  } catch (error) {

    console.error("Could not load event:", error);
    document.getElementById("eventName").textContent = "Could not load event";
    document.getElementById("countdownWrap").style.display = "none";

  }

}

loadEventDetail();