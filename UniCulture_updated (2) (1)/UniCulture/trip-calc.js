// Route distances, travel time and budget estimates for a finished plan.
// Pure functions (no DOM / Firebase) so they are easy to test.

import {
  PLACES, ORIGINS, STAY_ROOM_NIGHT, FOOD_PERSON_DAY, FOOD_ZONE_MULT, VEHICLE_DAY,
  ENTRY_PERSON_DAY, FUEL_PER_KM, BUS_PER_KM_PERSON, LONG_TRANSFER_KM, RANGE, TIERS
} from "./trip-data.js";

const rad = (d) => (d * Math.PI) / 180;

export function haversineKm(a, b) {
  const R = 6371;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const x = Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

export function zoneOf(id) {
  return PLACES[id]?.zone || "city";
}

// The "hardest" zone of the day decides which price list applies
export function dayZone(day) {
  const zones = day.stops.map((s) => zoneOf(s.place.id));
  if (zones.includes("remote")) return "remote";
  if (zones.includes("north")) return "north";
  return "city";
}

// Estimated road distance and driving time between two destinations.
// We only have straight-line distances, so a road factor is applied. Mountain
// roads wind a lot and the factor grows with distance (valleys are separated by
// ranges), and they are slow. These are rough planning figures, not navigation.
function legFromPoints(a, b) {

  const straight = haversineKm(a, b);

  let factor;
  let speed;

  if (a.zone === "north" || b.zone === "north") {
    factor = straight <= 40 ? 1.5 : straight <= 120 ? 1.8 : 2.1;
    speed = straight * factor > 300 ? 50 : 40;
  } else if (a.zone === "remote" || b.zone === "remote") {
    factor = 1.4;
    speed = 60;
  } else {
    factor = 1.3;
    speed = straight * factor < 30 ? 25 : 55;
  }

  const km = Math.round(straight * factor);
  const minutes = Math.max(10, Math.round((km / speed) * 60));

  return { km, minutes };

}

export function legInfo(fromId, toId) {

  const a = PLACES[fromId];
  const b = PLACES[toId];
  if (!a || !b) return null;

  return legFromPoints(a, b);

}

// Road distance and driving time from the traveller's home city to the first
// stop. Very long trips use a lower road factor than the winding in-valley
// legs above (highways and motorways), otherwise a Karachi to Hunza trip would
// be overestimated by about 50%. Still a planning figure, not navigation.
export function originLeg(originId, placeId) {

  const o = ORIGINS[originId];
  const p = PLACES[placeId];
  if (!o || !p) return null;

  const straight = haversineKm(o, p);

  if (straight <= 500) {
    return legFromPoints({ ...o, zone: "city" }, p);
  }

  const km = Math.round(straight * 1.35);
  const speed = p.zone === "north" ? 55 : 65;

  return { km, minutes: Math.round((km / speed) * 60) };

}

// Rough costs for the long transfer, from the per-km rates in trip-data.js.
export function transferCosts(km) {
  return {
    fuelOneWay: roundTo(km * FUEL_PER_KM, 500),    // per vehicle
    busPerPerson: roundTo(km * BUS_PER_KM_PERSON, 100)
  };
}

export function formatDuration(minutes) {
  if (minutes < 60) return `~${Math.max(5, Math.round(minutes / 5) * 5)} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round((minutes % 60) / 10) * 10;
  return m === 60 ? `~${h + 1} h` : m ? `~${h} h ${m} min` : `~${h} h`;
}

export function formatPKR(n) {
  return "PKR " + Math.round(n).toLocaleString("en-US");
}

const roundTo = (n, step) => Math.round(n / step) * step;

// Legs inside each day, and the transfer from the previous day's last stop
export function buildRoute(plan) {

  let totalKm = 0;
  let totalMinutes = 0;

  const days = plan.days.map((day, i) => {

    const legs = [];

    for (let j = 1; j < day.stops.length; j++) {
      legs.push(legInfo(day.stops[j - 1].place.id, day.stops[j].place.id));
    }

    let transfer = null;

    if (i > 0) {
      const prev = plan.days[i - 1];
      transfer = legInfo(prev.stops[prev.stops.length - 1].place.id, day.stops[0].place.id);
    }

    [...legs, transfer].forEach((l) => {
      if (l) { totalKm += l.km; totalMinutes += l.minutes; }
    });

    const points = day.stops
      .map((s) => PLACES[s.place.id] ? { id: s.place.id, name: s.place.name, lat: PLACES[s.place.id].lat, lng: PLACES[s.place.id].lng } : null)
      .filter(Boolean);

    return {
      legs,
      transfer,
      points,
      zone: dayZone(day),
      base: PLACES[day.stops[day.stops.length - 1].place.id]?.base || ""
    };

  });

  return { days, totalKm, totalMinutes };

}

export function stayRange(tier, zone) {
  const rate = STAY_ROOM_NIGHT[tier][zone];
  return { low: roundTo(rate * 0.8, 500), high: roundTo(rate * 1.25, 500) };
}

export function estimateBudget(plan, route, { travelers, tier }) {

  const days = plan.days.length;
  const nights = Math.max(days - 1, 0);
  const rooms = Math.ceil(travelers / 2);

  // Groups above 4 need a van, which costs more than a car
  const vehicles = travelers <= 4 ? 1 : Math.ceil(travelers / 9);
  const vehicleMult = travelers <= 4 ? 1 : 1.6;

  let stay = 0;
  for (let i = 0; i < nights; i++) {
    stay += STAY_ROOM_NIGHT[tier][route.days[i].zone] * rooms;
  }

  let food = 0;
  let vehicleDays = 0;
  let entry = 0;

  route.days.forEach((d) => {
    food += FOOD_PERSON_DAY[tier] * FOOD_ZONE_MULT[d.zone] * travelers;
    vehicleDays += VEHICLE_DAY[tier][d.zone] * vehicles * vehicleMult;
    entry += ENTRY_PERSON_DAY[tier] * travelers;
  });

  // Fuel (own car with driver) or bus tickets for the long transfers (economy)
  let fuel = 0;

  if (tier === "economy") {
    route.days.forEach((d) => {
      if (d.transfer && d.transfer.km >= LONG_TRANSFER_KM) {
        fuel += d.transfer.km * BUS_PER_KM_PERSON * travelers;
      }
    });
  } else {
    fuel = route.totalKm * FUEL_PER_KM * vehicles;
  }

  const transport = vehicleDays + fuel;

  const items = [
    { key: "stay", label: "Stay", amount: roundTo(stay, 500),
      detail: nights
        ? `${nights} night${nights === 1 ? "" : "s"} × ${rooms} room${rooms === 1 ? "" : "s"} (${TIERS[tier].stayType})`
        : "Day trip, no overnight stay" },
    { key: "food", label: "Food", amount: roundTo(food, 500), detail: `${travelers} × ${days} day${days === 1 ? "" : "s"}, three meals a day` },
    { key: "transport", label: "Local transport", amount: roundTo(transport, 500),
      detail: tier === "economy"
        ? "Shared and local transport, plus bus fares for long transfers"
        : travelers <= 4
          ? "1 car or jeep with driver, plus fuel"
          : `${vehicles} van${vehicles === 1 ? "" : "s"} with driver, plus fuel` },
    { key: "entry", label: "Tickets & activities", amount: roundTo(entry, 500), detail: "Entry fees, boat rides, small guides" }
  ];

  const total = items.reduce((sum, it) => sum + it.amount, 0);

  return {
    tierLabel: TIERS[tier].label,
    days, nights, rooms, vehicles, travelers,
    items,
    total,
    low: roundTo(total * RANGE.low, 1000),
    high: roundTo(total * RANGE.high, 1000),
    perPersonLow: roundTo((total * RANGE.low) / travelers, 500),
    perPersonHigh: roundTo((total * RANGE.high) / travelers, 500)
  };

}