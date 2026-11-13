import { db } from "./firebase-config.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import { esc, buildPrompt, parseReply, fallbackPlan } from "./trip-logic.js";
import { buildRoute, estimateBudget, stayRange, formatDuration, formatPKR, originLeg, transferCosts } from "./trip-calc.js";
import { TIERS, DATA_NOTE, LONG_TRANSFER_KM, ORIGINS, PLACES } from "./trip-data.js";

// Same Cloudflare Worker the AI Guide page already uses.
const WORKER_URL = "https://uniculture-ai.alitareen01981.workers.dev";

const REGION_NAMES = {
  all: "anywhere in Pakistan",
  punjab: "Punjab",
  sindh: "Sindh",
  kpk: "Khyber Pakhtunkhwa",
  gilgit: "Gilgit-Baltistan",
  balochistan: "Balochistan"
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];

const $ = (id) => document.getElementById(id);

const form = $("planForm");
const submitBtn = $("tpSubmit");
const errorBox = $("tpError");
const loadingBox = $("tpLoading");
const loadingText = $("tpLoadingText");
const resultView = $("tpResult");

let allDestinations = null;   // loaded once from Firestore

const MAX_DAYS = 10;

const REGION_IMAGES = {
  all: "images/hunza.jpg", punjab: "images/punjab.jpg", sindh: "images/sindh.jpg",
  kpk: "images/swat.jpg", gilgit: "images/hunza.jpg", balochistan: "images/balochistan.jpg"
};

function toast(msg) {
  const t = $("tpToast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove("show"), 2400);
}

const fmtDate = (d) => d.toISOString().slice(0, 10);
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const prettyDate = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });


// ---------- FROM (starting city) ----------
const RECENT_KEY = "uc_trip_recent_origin";
let origin = "karachi";

try {
  const saved = localStorage.getItem(RECENT_KEY);
  if (saved && ORIGINS[saved]) origin = saved;
} catch (e) {}

const originLabel = (id) => `${ORIGINS[id].name}, ${ORIGINS[id].province}`;

function closeMenus() {
  ["tpFromMenu", "tpTravMenu"].forEach((m) => $(m).classList.remove("open"));
  $("tpFromBtn").classList.remove("open");
  $("tpTravBtn").classList.remove("open");
  $("tpFromBtn").setAttribute("aria-expanded", "false");
  $("tpTravBtn").setAttribute("aria-expanded", "false");
}

function setOrigin(id, remember = true) {
  origin = id;
  $("tpFromVal").textContent = originLabel(id);
  if (remember) { try { localStorage.setItem(RECENT_KEY, id); } catch (e) {} }
  renderFromList();
}

function renderFromList() {
  const q = $("tpFromSearch").value.trim().toLowerCase();
  const rows = Object.entries(ORIGINS).filter(([, o]) => !q || (o.name + " " + o.province).toLowerCase().includes(q));
  const row = ([id, o]) => `
    <button type="button" class="tp-opt ${id === origin ? "sel" : ""}" role="option" data-o="${id}">
      <span>📍</span><span>${esc(o.name)}, <small>${esc(o.province)}</small></span>${id === origin ? '<span class="tp-chk">✓</span>' : ""}
    </button>`;
  $("tpFromList").innerHTML =
    (rows.length ? `<h6>Pakistan cities</h6>${rows.map(row).join("")}` : `<p class="tp-hint">No match. More cities are coming.</p>`) +
    (q ? "" : `<h6>Other</h6><button type="button" class="tp-opt" data-geo="1"><span>🎯</span><span>Use my current location</span></button>`);
}

$("tpFromBtn").addEventListener("click", (e) => {
  e.stopPropagation();
  const open = !$("tpFromMenu").classList.contains("open");
  closeMenus();
  if (open) {
    $("tpFromMenu").classList.add("open");
    $("tpFromBtn").classList.add("open");
    $("tpFromBtn").setAttribute("aria-expanded", "true");
    $("tpFromSearch").value = "";
    renderFromList();
    $("tpFromSearch").focus();
  }
});

$("tpFromSearch").addEventListener("input", renderFromList);

$("tpFromList").addEventListener("click", (e) => {
  const o = e.target.closest("[data-o]");
  if (o) { setOrigin(o.dataset.o); closeMenus(); return; }
  if (e.target.closest("[data-geo]")) {
    if (!navigator.geolocation) { toast("Location is not available in this browser."); return; }
    toast("Finding your nearest city…");
    navigator.geolocation.getCurrentPosition((pos) => {
      let best = null, bestKm = Infinity;
      Object.entries(ORIGINS).forEach(([id, c]) => {
        const dLat = (c.lat - pos.coords.latitude) * 111;
        const dLng = (c.lng - pos.coords.longitude) * 111 * Math.cos(pos.coords.latitude * Math.PI / 180);
        const km = Math.hypot(dLat, dLng);
        if (km < bestKm) { bestKm = km; best = id; }
      });
      setOrigin(best);
      closeMenus();
      toast(`Nearest listed city: ${ORIGINS[best].name}`);
    }, () => toast("Could not get your location."), { timeout: 8000 });
  }
});

$("tpFromVal").textContent = originLabel(origin);


// ---------- TRAVELLERS ----------
const trav = { adults: 2, children: 0 };

function drawTravellers() {
  $("tpAdultsN").textContent = trav.adults;
  $("tpChildrenN").textContent = trav.children;
  $("tpTravVal").textContent = `${trav.adults} Adult${trav.adults === 1 ? "" : "s"}, ${trav.children} ${trav.children === 1 ? "Child" : "Children"}`;
}

$("tpTravBtn").addEventListener("click", (e) => {
  e.stopPropagation();
  const open = !$("tpTravMenu").classList.contains("open");
  closeMenus();
  if (open) {
    $("tpTravMenu").classList.add("open");
    $("tpTravBtn").classList.add("open");
    $("tpTravBtn").setAttribute("aria-expanded", "true");
  }
});

$("tpTravMenu").addEventListener("click", (e) => {
  e.stopPropagation();
  const b = e.target.closest("[data-t]");
  if (!b) return;
  const k = b.dataset.t;
  const next = trav[k] + Number(b.dataset.d);
  const min = k === "adults" ? 1 : 0;
  if (next < min || trav.adults + trav.children + Number(b.dataset.d) > 12 && Number(b.dataset.d) > 0) return;
  trav[k] = next;
  drawTravellers();
});

$("tpTravDone").addEventListener("click", closeMenus);
$("tpFromMenu").addEventListener("click", (e) => e.stopPropagation());
document.addEventListener("click", closeMenus);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenus(); });
drawTravellers();


// ---------- DATES ----------
const today = new Date();
$("tpStart").min = fmtDate(today);
$("tpEnd").min = fmtDate(today);
$("tpStart").value = fmtDate(addDays(today, 14));
$("tpEnd").value = fmtDate(addDays(today, 17));

$("tpStart").addEventListener("change", () => {
  const s = $("tpStart").value;
  if (!s) return;
  $("tpEnd").min = s;
  if (!$("tpEnd").value || $("tpEnd").value < s) $("tpEnd").value = s;
});


// ---------- REGION (hero follows the choice) ----------
function updateHero() {
  const r = $("tpRegion").value;
  $("tpHeroRegion").textContent = r === "all" ? "Pakistan" : REGION_NAMES[r];
}


async function loadDestinations() {

  if (allDestinations && allDestinations.length) return allDestinations;

  const snapshot = await getDocs(collection(db, "Tourism"));
  allDestinations = [];

  snapshot.forEach((d) => {
    const data = d.data();
    allDestinations.push({
      id: d.id,
      ...data,
      type: String(data.type || "").toLowerCase().trim(),
      region: String(data.region || "").toLowerCase().trim()
    });
  });

  return allDestinations;

}


// Rotating status text so the wait feels purposeful
let loadingTimer = null;

function startLoading() {

  const steps = [
    "Picking destinations that match you…",
    "Grouping places that are close together…",
    "Checking the best season for your month…",
    "Writing your day-by-day plan…"
  ];

  let i = 0;
  loadingText.textContent = steps[0];
  loadingBox.style.display = "block";
  loadingTimer = setInterval(() => {
    i = (i + 1) % steps.length;
    loadingText.textContent = steps[i];
  }, 1800);

}

function stopLoading() {
  clearInterval(loadingTimer);
  loadingBox.style.display = "none";
}


async function askAI(prompt) {

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {

    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
      signal: controller.signal
    });

    if (!res.ok) throw new Error("Bad response from server");

    const data = await res.json();
    return data.reply || "";

  } finally {
    clearTimeout(timeout);
  }

}


const DAY_COLORS = ["#15603d", "#d97706", "#2563eb", "#c026d3", "#dc2626", "#0891b2", "#7c3aed"];

function gmapsLink(points) {

  if (!points.length) return "";

  if (points.length === 1) {
    return `https://www.google.com/maps/search/?api=1&query=${points[0].lat},${points[0].lng}`;
  }

  const first = points[0];
  const last = points[points.length - 1];
  const waypoints = points.slice(1, -1).map((p) => `${p.lat},${p.lng}`).join("|");

  return `https://www.google.com/maps/dir/?api=1&origin=${first.lat},${first.lng}` +
    `&destination=${last.lat},${last.lng}` +
    (waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : "") +
    "&travelmode=driving";

}


// ---------- MAP (Leaflet + OpenStreetMap, loaded only when a plan is shown) ----------
let leafletPromise = null;
let mapInstance = null;

function loadLeaflet() {

  if (window.L) return Promise.resolve();
  if (leafletPromise) return leafletPromise;

  leafletPromise = new Promise((resolve, reject) => {

    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
    document.head.appendChild(css);

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";
    script.onload = resolve;
    script.onerror = () => { leafletPromise = null; reject(new Error("Leaflet failed to load")); };
    document.head.appendChild(script);

  });

  return leafletPromise;

}

async function renderMap(route, start) {

  const el = $("tpMap");

  try {
    await loadLeaflet();
  } catch (err) {
    el.textContent = "The map could not load. You can still open each day's route in Google Maps.";
    return;
  }

  if (mapInstance) { mapInstance.remove(); mapInstance = null; }
  el.textContent = "";

  const map = L.map(el, { scrollWheelZoom: false, dragging: !L.Browser.mobile });
  mapInstance = map;

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  const bounds = [];
  let previousLast = null;

  if (start && route.days[0] && route.days[0].points[0]) {
    const f = route.days[0].points[0];
    L.polyline([[start.lat, start.lng], [f.lat, f.lng]], { color: "#888", weight: 2, dashArray: "6 8" }).addTo(map);
    L.marker([start.lat, start.lng], {
      icon: L.divIcon({ className: "tp-pin", html: `<span style="background:#555">S</span>`, iconSize: [26, 26], iconAnchor: [13, 13] })
    }).bindPopup(`<strong>Start</strong><br>${esc(start.name)}`).addTo(map);
    bounds.push([start.lat, start.lng]);
  }

  route.days.forEach((d, i) => {

    const color = DAY_COLORS[i % DAY_COLORS.length];
    const latlngs = d.points.map((p) => [p.lat, p.lng]);

    if (previousLast && latlngs.length) {
      L.polyline([previousLast, latlngs[0]], { color: "#888", weight: 2, dashArray: "6 8" }).addTo(map);
    }

    if (latlngs.length > 1) {
      L.polyline(latlngs, { color, weight: 4, opacity: 0.85 }).addTo(map);
    }

    d.points.forEach((p, k) => {
      L.marker([p.lat, p.lng], {
        icon: L.divIcon({
          className: "tp-pin",
          html: `<span style="background:${color}">${k + 1}</span>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        })
      }).bindPopup(`<strong>Day ${i + 1}</strong><br>${esc(p.name)}`).addTo(map);

      bounds.push([p.lat, p.lng]);
    });

    if (latlngs.length) previousLast = latlngs[latlngs.length - 1];

  });

  const showWholeRoute = () => {
    if (bounds.length === 1) {
      map.setView(bounds[0], 9);
    } else if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [34, 34] });
    }
  };

  showWholeRoute();

  const ResetControl = L.Control.extend({
    onAdd() {
      const button = L.DomUtil.create("button", "tp-map-reset");
      button.type = "button";
      button.textContent = "⤢ Whole route";
      L.DomEvent.disableClickPropagation(button);
      L.DomEvent.on(button, "click", showWholeRoute);
      return button;
    }
  });

  new ResetControl({ position: "topright" }).addTo(map);

  setTimeout(() => map.invalidateSize(), 80);

}



const mapsDir = (a, b) =>
  `https://www.google.com/maps/dir/?api=1&origin=${a.lat},${a.lng}&destination=${b.lat},${b.lng}&travelmode=driving`;

const INTEREST_LINKS = {
  food:        { label: "🍛 Traditional Food",  href: "food.html" },
  museums:     { label: "🖼 Museums & Heritage", href: "heritage.html" },
  festivals:   { label: "🎉 Festivals",          href: "festivals.html" },
  handicrafts: { label: "🧶 Arts & Handicrafts", href: "handicrafts.html" }
};


function renderRoutePanel(plan, route, leg0, originName) {

  const hasRoute = route.totalKm > 0 || leg0;

  $("tpRouteDays").innerHTML =
    (leg0 ? `
      <li>
        <span class="tp-dot" style="background:#888"></span>
        <div>
          <strong>${esc(originName)} → ${esc(plan.days[0].stops[0].place.name)}</strong>
          <small>≈ ${leg0.km.toLocaleString("en-US")} km · ${formatDuration(leg0.minutes)} by road (estimate)</small>
        </div>
      </li>` : "") +
    plan.days.map((day, i) => {

    const r = route.days[i];
    const color = DAY_COLORS[i % DAY_COLORS.length];
    const legs = r.legs.filter(Boolean);
    const km = legs.reduce((s, l) => s + l.km, 0) + (r.transfer ? r.transfer.km : 0);
    const minutes = legs.reduce((s, l) => s + l.minutes, 0) + (r.transfer ? r.transfer.minutes : 0);

    return `
      <li>
        <span class="tp-dot" style="background:${color}"></span>
        <div>
          <strong>Day ${i + 1} · ${esc(day.title)}</strong>
          <small>${day.stops.map((s) => esc(s.place.name)).join(" → ")}</small>
          <small>${km ? `≈ ${km} km · ${formatDuration(minutes)}${r.transfer ? " (includes the transfer from the day before)" : ""}` : "Everything is within a short distance"}</small>
          ${r.points.length ? `<a href="${gmapsLink(r.points)}" target="_blank" rel="noopener">Open in Google Maps ↗</a>` : ""}
        </div>
      </li>`;

  }).join("");

  return hasRoute;

}


function renderBudgetPanel(plan, route, budget) {

  const biggest = Math.max(...budget.items.map((it) => it.amount), 1);

  $("tpBudgetTop").innerHTML = `
    <div>
      <span class="tp-big">${formatPKR(budget.low)} – ${formatPKR(budget.high).replace("PKR ", "")}</span>
      <small>On-the-ground estimate for ${budget.travelers} traveller${budget.travelers === 1 ? "" : "s"} · ${esc(budget.tierLabel)} · ${budget.days} day${budget.days === 1 ? "" : "s"}</small>
    </div>
    <div class="tp-pp"><strong>${formatPKR(budget.perPersonLow)} – ${formatPKR(budget.perPersonHigh).replace("PKR ", "")}</strong><small>per person</small></div>`;

  $("tpBudgetRows").innerHTML = budget.items.map((it) => `
    <div class="tp-brow">
      <b>${esc(it.label)}<small>${esc(it.detail)}</small></b>
      <div class="tp-bar"><i style="width:${Math.max(4, Math.round((it.amount / biggest) * 100))}%"></i></div>
      <em>${formatPKR(it.amount)}</em>
    </div>`).join("");

  const remote = route.days.some((d) => d.zone === "remote");

  $("tpBudgetFine").textContent = DATA_NOTE +
    " This budget covers your days at the destination and does not include the journey from your starting city." +
    (remote ? " Remote areas have very few hotels, so rates there are rougher guesses." : "") +
    " The total is shown as a range around the middle estimate.";

}


// Travel options between the starting city and the first stop. Road figures come
// from our own distance model and the per-km rates in trip-data.js. Flight and
// train prices change daily and we have no source for them, so those cards link
// to the live booking pages instead of showing a made-up number.
function renderOptions(c) {

  const { km, minutes, from, firstName, firstCity, firstPlace, fromCity, travelers } = c;
  const cost = transferCosts(km);
  const short = km < 40;
  const northFirst = firstPlace.zone === "north";

  const cards = [];

  cards.push({
    kind: "flight", icon: "✈️", title: "Flight", tag: "Fastest",
    price: "Live fares", soft: true,
    lines: short ? ["Not needed for such a short distance"]
      : [`${esc(fromCity)} → ${esc(firstCity)}`, northFirst ? "Flights usually land at the nearest airport, then continue by road" : "Compare airlines and dates"],
    cta: "Check fares ↗",
    href: `https://www.google.com/travel/flights?q=${encodeURIComponent(`Flights from ${fromCity} to ${firstCity} Pakistan`)}`
  });

  cards.push({
    kind: "road", icon: "🚗", title: "By Road", tag: "Scenic & flexible",
    price: `≈ ${km.toLocaleString("en-US")} km`,
    lines: [`${formatDuration(minutes)} driving`, `Fuel ≈ ${formatPKR(cost.fuelOneWay)} one way (per vehicle)`],
    cta: "View route ↗",
    href: mapsDir(from, firstPlace)
  });

  cards.push({
    kind: "train", icon: "🚆", title: "By Train", tag: "Budget friendly",
    price: "Live fares", soft: true,
    lines: short ? ["Not needed for such a short distance"]
      : ["Pakistan Railways", northFirst ? "Rail does not reach the northern valleys, so plan a road leg" : "Check routes, timings and classes"],
    cta: "Check timetable ↗",
    href: "https://www.pakrail.gov.pk/"
  });

  cards.push({
    kind: "bus", icon: "🚌", title: "By Bus", tag: "Economical",
    price: short ? "Local transport" : `≈ ${formatPKR(cost.busPerPerson)} / person`,
    soft: short,
    lines: short ? ["Use local transport or ride-hailing"] : [`About the same as road time, plus stops`, `Rough rate-based estimate`],
    cta: "Find bus services ↗",
    href: `https://www.google.com/search?q=${encodeURIComponent(`bus ${fromCity} to ${firstCity}`)}`
  });

  window.__tpOptions = cards;
  drawOptions("all");

  $("tpOptSub").textContent = `Compare ways to get from ${fromCity} to ${firstName}.`;
  $("tpOptFine").textContent = "Road distance, time and cost are estimates from our own model (rate-based, for planning). Flight and train fares change daily, so we link to the live pages instead of guessing a price.";

}

function drawOptions(filter) {
  const list = (window.__tpOptions || []).filter((o) => filter === "all" || o.kind === filter);
  $("tpOpts").innerHTML = list.map((o) => `
    <div class="tp-opt-card">
      <header><i>${o.icon}</i><div><b>${esc(o.title)}</b><small>${esc(o.tag)}</small></div></header>
      <div class="tp-price ${o.soft ? "soft" : ""}">${esc(o.price)}</div>
      <ul>${o.lines.map((l) => `<li>${l.startsWith("&") ? l : l}</li>`).join("")}</ul>
      <a href="${esc(o.href)}" target="_blank" rel="noopener">${esc(o.cta)}</a>
    </div>`).join("");
  document.querySelectorAll("#tpOptTabs .tp-tab").forEach((t) => t.classList.toggle("on", t.dataset.f === filter));
}

$("tpOptTabs").addEventListener("click", (e) => {
  const t = e.target.closest(".tp-tab");
  if (t) drawOptions(t.dataset.f);
});


let lastTrip = null;   // what the Save / Share buttons use

function renderPlan(plan, note, choice) {

  const n = plan.days.length;
  const route = buildRoute(plan);
  const firstId = plan.days[0].stops[0].place.id;
  const firstPlace = PLACES[firstId];
  const o = ORIGINS[choice.origin];
  const leg0 = o && firstPlace ? originLeg(choice.origin, firstId) : null;
  const budget = estimateBudget(plan, route, { travelers: choice.travelers, tier: choice.tier });

  const totalKm = route.totalKm + (leg0 ? leg0.km : 0);
  const totalMin = route.totalMinutes + (leg0 ? leg0.minutes : 0);

  $("tpItinTitle").textContent = `Your Itinerary (${n} Day${n === 1 ? "" : "s"})`;
  $("tpSummary").textContent = plan.summary || "";
  $("tpCtaTitle").textContent = `Ready to explore ${choice.regionName}?`;

  const noteEl = $("tpNote");
  noteEl.textContent = note || "";
  noteEl.style.display = note ? "block" : "none";

  // AT A GLANCE
  $("tpGlance").innerHTML = [
    { i: "🧭", l: "Total distance", v: totalKm ? `≈ ${totalKm.toLocaleString("en-US")} km` : "Short trip", e: leg0 ? "from your start, by road" : "between stops" },
    { i: "⏱", l: "Estimated travel time", v: totalKm ? formatDuration(totalMin) : "—", e: "driving, by road" },
    { i: "📅", l: "Trip duration", v: `${n} Day${n === 1 ? "" : "s"}`, e: `${prettyDate(choice.start)} – ${prettyDate(choice.end)}` },
    { i: "💰", l: "Estimated budget", v: `${formatPKR(budget.low)} – ${formatPKR(budget.high).replace("PKR ", "")}`, e: "at the destination (approx.)" }
  ].map((g) => `<div class="tp-gi"><i>${g.i}</i><div><small>${g.l}</small><strong>${g.v}</strong><em>${g.e}</em></div></div>`).join("");

  // TRAVEL OPTIONS
  if (leg0) {
    renderOptions({
      km: leg0.km, minutes: leg0.minutes, from: o, firstPlace,
      firstName: plan.days[0].stops[0].place.name,
      firstCity: plan.days[0].stops[0].place.city || plan.days[0].stops[0].place.name,
      fromCity: o.name, travelers: choice.travelers
    });
  }

  // ITINERARY
  $("tpDaysWrap").innerHTML = plan.days.map((day, i) => {

    const r = route.days[i];

    let transferHtml = "";
    if (i === 0 && leg0 && leg0.km >= 15) {
      transferHtml = `<div class="tp-transfer">🚗 <b>From ${esc(o.name)}:</b> ≈ ${leg0.km.toLocaleString("en-US")} km · ${formatDuration(leg0.minutes)} by road${leg0.km >= LONG_TRANSFER_KM * 3 ? "<br>This is a long journey. Consider flying part of the way or arriving a day early." : ""}</div>`;
    } else if (r.transfer && r.transfer.km >= 15) {
      transferHtml = `<div class="tp-transfer">🚗 <b>From Day ${i}:</b> ≈ ${r.transfer.km} km · ${formatDuration(r.transfer.minutes)}
        ${r.transfer.km >= LONG_TRANSFER_KM * 2 ? "<br>Very long drive: consider splitting it over two days or flying part of the way." : ""}</div>`;
    }

    const dateLine = prettyDate(fmtDate(addDays(new Date(choice.start + "T00:00:00"), i)));

    return `
    <article class="tp-day">
      <div class="tp-day-head" style="background-image:url('${esc(day.stops[0].place.image)}')">
        <div class="tp-day-label"><span class="tp-day-num">Day ${i + 1}</span> ${esc(day.title)}</div>
      </div>
      <div class="tp-stops">
        <small style="display:block;color:var(--tp-muted);font-size:11.5px;margin:0 0 8px 4px;">${dateLine}</small>
        ${transferHtml}
        ${day.stops.map((s, k) => `
          ${k > 0 && r.legs[k - 1] ? `<div class="tp-leg">≈ ${r.legs[k - 1].km} km · ${formatDuration(r.legs[k - 1].minutes)}</div>` : ""}
          <a class="tp-stop" href="tourism_detail.html?id=${encodeURIComponent(s.place.id)}">
            <img src="${esc(s.place.image)}" alt="${esc(s.place.name)}">
            <div>
              <strong>${esc(s.place.name)}</strong>
              <small>📍 ${esc(s.place.city)}${s.place.province ? ", " + esc(s.place.province) : ""}</small>
              <p>${esc(s.why)}</p>
            </div>
          </a>`).join("")}
      </div>
      ${day.tip ? `<p class="tp-tip">💡 ${esc(day.tip)}</p>` : ""}
    </article>`;

  }).join("");

  // WHERE TO STAY (area suggestions; one per night)
  const nights = plan.days.slice(0, -1);
  $("tpStays").innerHTML = nights.length ? nights.map((day, i) => {
    const r = route.days[i];
    const stay = stayRange(choice.tier, r.zone);
    const area = r.base || day.stops[day.stops.length - 1].place.city || "";
    return `
      <div class="tp-stay">
        <img src="${esc(day.stops[day.stops.length - 1].place.image)}" alt="">
        <div>
          <b>Night ${i + 1}: ${esc(area)}</b>
          <small>${esc(TIERS[choice.tier].label)} · ${esc(TIERS[choice.tier].stayType)}</small>
          <strong>${formatPKR(stay.low)} – ${formatPKR(stay.high).replace("PKR ", "")} / room / night</strong>
          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("hotels in " + area)}" target="_blank" rel="noopener">Find stays nearby ↗</a>
        </div>
      </div>`;
  }).join("") : `<p class="tp-psub" style="margin:0;">This is a day trip, so no overnight stay is needed.</p>`;

  // ATTRACTIONS
  const stops = plan.days.flatMap((d) => d.stops);
  $("tpAttr").innerHTML = stops.map((s) => {
    const p = PLACES[s.place.id];
    return `
      <div class="tp-attr">
        <img src="${esc(s.place.image)}" alt="${esc(s.place.name)}">
        <div><b>${esc(s.place.name)}</b><small>${esc(s.place.city)}${s.place.province ? ", " + esc(s.place.province) : ""}</small></div>
        ${p ? `<a href="https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}" target="_blank" rel="noopener">View on Map ↗</a>` : `<a href="tourism_detail.html?id=${encodeURIComponent(s.place.id)}">Details →</a>`}
      </div>`;
  }).join("");

  // EXTRA INTERESTS (their own UniCulture pages)
  const extras = choice.extraInterests.filter((k) => INTEREST_LINKS[k]);
  $("tpExplorePanel").style.display = extras.length ? "block" : "none";
  $("tpExplore").innerHTML = extras.map((k) => `<a href="${INTEREST_LINKS[k].href}">${INTEREST_LINKS[k].label} →</a>`).join("");

  renderRoutePanel(plan, route, leg0, o ? o.name : "");
  renderBudgetPanel(plan, route, budget);

  $("tpCta").style.display = "flex";
  resultView.style.display = "block";

  lastTrip = { plan, choice, totalKm, totalMin, budget, leg0 };

  setTimeout(() => resultView.scrollIntoView({ behavior: "smooth", block: "start" }), 60);

  renderMap(route, o);

}


function tripSummaryText() {
  if (!lastTrip) return "";
  const { plan, choice, totalKm, budget } = lastTrip;
  const lines = [`UniCulture trip: ${ORIGINS[choice.origin].name} → ${choice.regionName}`,
    `${prettyDate(choice.start)} – ${prettyDate(choice.end)} · ${choice.travelers} traveller${choice.travelers === 1 ? "" : "s"}`];
  plan.days.forEach((d, i) => lines.push(`Day ${i + 1} (${d.title}): ${d.stops.map((s) => s.place.name).join(", ")}`));
  if (totalKm) lines.push(`About ${totalKm.toLocaleString("en-US")} km by road`);
  lines.push(`Budget at the destination: ${formatPKR(budget.low)} – ${formatPKR(budget.high).replace("PKR ", "")} (estimate)`);
  return lines.join("\n");
}

$("tpSave").addEventListener("click", () => {
  if (!lastTrip) return;
  try {
    const list = JSON.parse(localStorage.getItem("uc_saved_trips") || "[]");
    list.unshift({
      savedAt: new Date().toISOString(),
      origin: lastTrip.choice.origin,
      region: lastTrip.choice.regionName,
      start: lastTrip.choice.start,
      end: lastTrip.choice.end,
      days: lastTrip.plan.days.map((d) => ({ title: d.title, stops: d.stops.map((s) => s.place.id) }))
    });
    localStorage.setItem("uc_saved_trips", JSON.stringify(list.slice(0, 20)));
    toast("Itinerary saved on this device");
  } catch (e) {
    toast("Could not save here. Try Download PDF instead.");
  }
});

// ---------- DOWNLOAD PDF (a real file, no print dialog) ----------
let jsPdfPromise = null;

function loadJsPdf() {
  if (window.jspdf) return Promise.resolve();
  if (jsPdfPromise) return jsPdfPromise;
  jsPdfPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    s.onload = resolve;
    s.onerror = () => { jsPdfPromise = null; reject(new Error("jsPDF failed to load")); };
    document.head.appendChild(s);
  });
  return jsPdfPromise;
}

// The built-in PDF fonts only know basic Latin, so symbols are written as plain words.
const pdfText = (t) => String(t ?? "")
  .replace(/[→]/g, "to").replace(/[≈]/g, "about ").replace(/[–—]/g, "-")
  .replace(/[·•]/g, "-").replace(/[’‘]/g, "'").replace(/[“”]/g, '"')
  .replace(/[^\x20-\x7E\n]/g, "");

async function downloadPdf() {

  if (!lastTrip) return;

  try {
    await loadJsPdf();
  } catch (err) {
    toast("Could not load the PDF tool. Opening the print window instead.");
    window.print();
    return;
  }

  const { plan, choice, totalKm, totalMin, budget, leg0 } = lastTrip;
  const doc = new window.jspdf.jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 44;
  let y = 0;

  const ensure = (need) => { if (y + need > H - 50) { doc.addPage(); y = M; } };

  const write = (text, { size = 11, bold = false, color = [40, 50, 45], gap = 4, indent = 0 } = {}) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(pdfText(text), W - M * 2 - indent);
    lines.forEach((ln) => { ensure(size + 4); doc.text(ln, M + indent, y); y += size + 3; });
    y += gap;
  };

  // header band
  doc.setFillColor(38, 84, 48);
  doc.rect(0, 0, W, 78, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold"); doc.setFontSize(20);
  doc.text("UniCulture Trip Plan", M, 38);
  doc.setFont("helvetica", "normal"); doc.setFontSize(11);
  doc.text(pdfText(`${ORIGINS[choice.origin].name} to ${choice.regionName}  |  ${prettyDate(choice.start)} - ${prettyDate(choice.end)}`), M, 58);
  y = 104;

  write(`${plan.days.length} day${plan.days.length === 1 ? "" : "s"}  |  ${choice.travelers} traveller${choice.travelers === 1 ? "" : "s"}  |  ${TIERS[choice.tier].label} budget`, { bold: true, size: 12, color: [21, 96, 61], gap: 6 });
  if (plan.summary) write(plan.summary, { gap: 8 });

  if (totalKm) {
    write(`Journey: about ${totalKm.toLocaleString("en-US")} km, ${formatDuration(totalMin)} of driving in total (estimate).` +
      (leg0 ? ` From ${ORIGINS[choice.origin].name} to the first stop: about ${leg0.km.toLocaleString("en-US")} km, ${formatDuration(leg0.minutes)}.` : ""), { gap: 10 });
  }

  write("Itinerary", { bold: true, size: 14, color: [21, 96, 61], gap: 6 });

  const route = buildRoute(plan);

  plan.days.forEach((day, i) => {
    ensure(60);
    const date = prettyDate(fmtDate(addDays(new Date(choice.start + "T00:00:00"), i)));
    write(`Day ${i + 1}: ${day.title}  (${date})`, { bold: true, size: 12, gap: 3 });
    const tr = i === 0 ? leg0 : route.days[i].transfer;
    if (tr && tr.km >= 15) write(`Drive: about ${tr.km} km, ${formatDuration(tr.minutes)}`, { size: 10, color: [100, 110, 105], indent: 12, gap: 2 });
    day.stops.forEach((s) => {
      write(`- ${s.place.name} (${s.place.city || ""}${s.place.province ? ", " + s.place.province : ""})`, { bold: true, size: 10.5, indent: 12, gap: 1 });
      if (s.why) write(s.why, { size: 10, color: [90, 100, 95], indent: 24, gap: 2 });
    });
    if (day.tip) write(`Tip: ${day.tip}`, { size: 10, color: [90, 100, 95], indent: 12, gap: 2 });
    y += 6;
  });

  const nights = plan.days.slice(0, -1);
  if (nights.length) {
    write("Where to stay (areas, planning prices)", { bold: true, size: 14, color: [21, 96, 61], gap: 6 });
    nights.forEach((day, i) => {
      const r = route.days[i];
      const stay = stayRange(choice.tier, r.zone);
      write(`Night ${i + 1}: ${r.base || day.stops[day.stops.length - 1].place.city}  -  ${formatPKR(stay.low)} to ${formatPKR(stay.high)} per room per night`, { size: 10.5, indent: 12, gap: 2 });
    });
    y += 6;
  }

  write("Estimated budget (at the destination)", { bold: true, size: 14, color: [21, 96, 61], gap: 6 });
  write(`${formatPKR(budget.low)} to ${formatPKR(budget.high)} in total, about ${formatPKR(budget.perPersonLow)} to ${formatPKR(budget.perPersonHigh)} per person.`, { bold: true, gap: 4 });
  budget.items.forEach((it) => write(`${it.label}: ${formatPKR(it.amount)}  (${it.detail})`, { size: 10, indent: 12, gap: 1 }));
  y += 6;
  write(DATA_NOTE + " This budget does not include the journey from your starting city. Flight and train fares are not estimated; check live fares before booking.", { size: 9, color: [110, 120, 115] });

  // footer on every page
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(130, 140, 135);
    doc.text(`UniCulture Trip Planner  -  planning estimates only  -  page ${p} of ${pages}`, M, H - 24);
  }

  doc.save(`UniCulture-trip-${choice.start}.pdf`);
  toast("PDF downloaded");

}

$("tpPrint").addEventListener("click", downloadPdf);

$("tpShare").addEventListener("click", async () => {
  const text = tripSummaryText();
  if (!text) return;
  try {
    if (navigator.share) { await navigator.share({ title: "My UniCulture trip", text, url: location.href }); return; }
    await navigator.clipboard.writeText(text + "\n" + location.href);
    toast("Trip summary copied");
  } catch (e) {
    if (e && e.name !== "AbortError") toast("Could not share. Use Download PDF instead.");
  }
});

$("tpAgain").addEventListener("click", () => {
  resultView.style.display = "none";
  window.scrollTo({ top: 0, behavior: "smooth" });
});


function showError(message) {
  errorBox.textContent = message;
  errorBox.style.display = "block";
}


form.addEventListener("submit", async (e) => {

  e.preventDefault();

  errorBox.style.display = "none";

  const start = $("tpStart").value;
  const end = $("tpEnd").value;

  if (!start || !end || end < start) {
    showError("Please choose your travel dates (the end date can't be before the start date).");
    return;
  }

  const days = Math.round((new Date(end + "T00:00:00") - new Date(start + "T00:00:00")) / 86400000) + 1;

  if (days > MAX_DAYS) {
    showError(`We plan up to ${MAX_DAYS} days at a time. Please shorten your dates, then plan the next part as a second trip.`);
    return;
  }

  const region = $("tpRegion").value;
  const month = MONTHS[new Date(start + "T00:00:00").getMonth()];
  const pace = parseInt(document.querySelector("input[name=pace]:checked").value, 10);
  const travelers = Math.min(12, trav.adults + trav.children);
  const tier = $("tpBudget").value in TIERS ? $("tpBudget").value : "standard";

  const picked = [...document.querySelectorAll("#tpInts input:checked")].map((c) => c.value);
  if (!picked.length) {
    showError("Please pick at least one interest.");
    return;
  }

  const wantHeritage = picked.includes("heritage") || picked.includes("museums");
  const wantNature = picked.includes("nature");
  const extraInterests = picked.filter((k) => INTEREST_LINKS[k]);

  // Our destination library covers heritage sites and nature spots. Food, festivals,
  // handicrafts and museums have their own pages, so they are linked after the plan.
  let types = [];
  if (wantHeritage) types.push("historical", "archaeological");
  if (wantNature) types.push("natural");
  const onlyExtras = !types.length;
  if (onlyExtras) types = ["historical", "archaeological", "natural"];

  submitBtn.disabled = true;
  resultView.style.display = "none";
  startLoading();

  try {

    const everything = await loadDestinations();

    if (!everything.length) {
      console.warn("Trip Planner: the Tourism collection is empty. Open Admin > Setup > Seed Tourism once.");
      stopLoading();
      showError("Destinations are not available yet. Please try again later.");
      return;
    }

    const pool = everything.filter((d) => region === "all" || d.region === region);
    let candidates = pool.filter((d) => types.includes(d.type));
    const notes = [];

    let relaxed = false;

    if (!candidates.length && pool.length) {
      relaxed = true;
      candidates = pool;
      const wantedKind = wantNature && !wantHeritage ? "nature" : "heritage";
      notes.push(`Our library has no ${wantedKind} places in ${REGION_NAMES[region]} yet, so we picked the best sights available there instead.`);
    }

    if (!candidates.length) {

      const found = (key) => [...new Set(everything.map((d) => d[key] || "(empty)"))].join(", ");

      console.warn("Trip Planner: no match.", {
        loaded: everything.length, wantedRegion: region, wantedTypes: types,
        typesInDatabase: found("type"), regionsInDatabase: found("region")
      });

      stopLoading();
      showError("No destinations match these choices yet. Try another region or interest.");
      return;

    }

    if (onlyExtras) {
      notes.push("Food, festivals, handicrafts and museums don't have trip stops in our library yet, so your route uses heritage and nature sights. Their own pages are linked below.");
    }

    const interests = relaxed || onlyExtras
      ? "the best sights available"
      : wantNature && wantHeritage
        ? "history, heritage and nature"
        : wantNature ? "nature and mountains" : "history and heritage";

    const prompt = buildPrompt(candidates, { days, region: REGION_NAMES[region], month, pace, interests });

    let plan = null;

    try {

      const reply = await askAI(prompt);
      plan = parseReply(reply, candidates, days);

      if (!plan) {
        console.warn("Trip Planner: the AI replied, but not in a usable format. Raw reply:", reply);
      }

    } catch (err) {
      console.error("Trip Planner: AI request failed:", err);
    }

    if (!plan) {
      plan = fallbackPlan(candidates, { days, pace, month });
      notes.push("We could not get an AI-written plan this time, so this one is built from places that sit close together.");
    }

    if (plan.days.length < days) {

      const usedAll = candidates.length <= plan.days.length * pace;

      notes.push(usedAll
        ? `We have only ${candidates.length} place${candidates.length === 1 ? "" : "s"} for this choice, so your plan covers ${plan.days.length} of ${days} days.`
        : `Your plan covers ${plan.days.length} of the ${days} days you asked for.`);

    }

    stopLoading();

    try { localStorage.setItem(RECENT_KEY, origin); } catch (err) {}

    renderPlan(plan, notes.join(" "), {
      origin, start, end, days, travelers, tier, extraInterests,
      regionName: region === "all" ? "Pakistan" : REGION_NAMES[region]
    });

  } catch (err) {

    console.error(err);
    stopLoading();
    showError("Something went wrong while loading destinations. Please try again.");

  } finally {

    submitBtn.disabled = false;

  }

});


// HINT under the interests: what the library has for the chosen region
function updateHint() {

  const hint = $("tpHint");
  if (!hint) return;

  if (!allDestinations || !allDestinations.length) { hint.textContent = ""; return; }

  const region = $("tpRegion").value;
  const pool = allDestinations.filter((d) => region === "all" || d.region === region);

  const heritage = pool.filter((d) => d.type === "historical" || d.type === "archaeological").length;
  const nature = pool.filter((d) => d.type === "natural").length;

  const where = region === "all" ? "Pakistan" : REGION_NAMES[region];

  hint.textContent = pool.length
    ? `${where}: ${heritage} heritage site${heritage === 1 ? "" : "s"} and ${nature} nature spot${nature === 1 ? "" : "s"} in our library. Food, Museums, Festivals and Handicrafts open their own UniCulture pages after your plan.`
    : "";

}

$("tpRegion").addEventListener("change", () => { updateHero(); updateHint(); });
loadDestinations().then(updateHint).catch(() => {});
updateHero();


// BUDGET LEVEL hint
const BUDGET_HINTS = {
  economy: "Guesthouses and budget hotels, local food, shared or local transport.",
  standard: "3-star hotels, restaurant meals, a car or jeep with driver.",
  comfortable: "4 or 5-star hotels or resorts, better restaurants, a comfortable SUV with driver."
};

function updateBudgetHint() {
  $("tpBudgetHint").textContent = BUDGET_HINTS[$("tpBudget").value] || "";
}

$("tpBudget").addEventListener("change", updateBudgetHint);
updateBudgetHint();