// Planning data for the Trip Planner: map coordinates, "where to stay" bases and
// rough cost ranges. Everything here is an ESTIMATE for planning, not a live
// price. To update a number, just edit it here.
//
// Cost ranges are rough planning figures based on public hotel listings
// (Karimabad / Lahore / Karachi), car-hire guides (Gilgit, Hunza, Islamabad,
// Lahore) and general Pakistan travel-cost guides, checked in October 2026.
// Remote-area figures are rougher because those places have few options.

// zone decides which price list applies:
//   city   = big cities and towns with plenty of hotels
//   north  = mountain tourist areas (Swat, Naran, Hunza, Skardu ...)
//   remote = few facilities (camping / basic stays, 4x4 needed)
export const PLACES = {
  "badshahi-mosque":      { lat: 31.5882, lng: 74.3100, zone: "city",   base: "Lahore (near the Walled City or Gulberg)" },
  "lahore-fort":          { lat: 31.5889, lng: 74.3150, zone: "city",   base: "Lahore (near the Walled City or Gulberg)" },
  "minar-e-pakistan":     { lat: 31.5925, lng: 74.3095, zone: "city",   base: "Lahore (near the Walled City or Gulberg)" },
  "shalimar-gardens":     { lat: 31.5864, lng: 74.3796, zone: "city",   base: "Lahore (near the Walled City or Gulberg)" },
  "khewra-salt-mine":     { lat: 32.6494, lng: 73.0083, zone: "city",   base: "Jhelum, or a day trip from Lahore / Islamabad" },
  "noor-mahal":           { lat: 29.3996, lng: 71.6850, zone: "city",   base: "Bahawalpur" },

  "mohenjo-daro":         { lat: 27.3243, lng: 68.1350, zone: "city",   base: "Larkana" },
  "shah-jahan-mosque":    { lat: 24.7461, lng: 67.9186, zone: "city",   base: "Thatta, or a day trip from Karachi" },
  "keenjhar-lake":        { lat: 24.9500, lng: 68.0500, zone: "city",   base: "Thatta, or a day trip from Karachi" },
  "gorakh-hill":          { lat: 26.6600, lng: 67.1300, zone: "remote", base: "Basic stays or camping near the hill (limited), or Dadu" },
  "ranikot-fort":         { lat: 25.5483, lng: 68.0838, zone: "city",   base: "Hyderabad or Jamshoro" },
  "clifton-beach":        { lat: 24.8043, lng: 67.0287, zone: "city",   base: "Karachi" },

  "swat-valley":          { lat: 34.7717, lng: 72.3600, zone: "north",  base: "Mingora or Madyan" },
  "kalam-valley":         { lat: 35.4900, lng: 72.5800, zone: "north",  base: "Kalam" },
  "mahodand-lake":        { lat: 35.5800, lng: 72.6500, zone: "north",  base: "Kalam (day trip by jeep)" },
  "saiful-malook-lake":   { lat: 34.8781, lng: 73.6937, zone: "north",  base: "Naran" },
  "malam-jabba":          { lat: 34.8033, lng: 72.5667, zone: "north",  base: "Malam Jabba or Mingora" },
  "shogran":              { lat: 34.6000, lng: 73.4667, zone: "north",  base: "Shogran or Balakot" },

  "hunza-valley":         { lat: 36.3167, lng: 74.6500, zone: "north",  base: "Karimabad (Hunza)" },
  "fairy-meadows":        { lat: 35.4211, lng: 74.5927, zone: "north",  base: "Fairy Meadows huts or camp, or Chilas" },
  "attabad-lake":         { lat: 36.3270, lng: 74.8630, zone: "north",  base: "Karimabad or Aliabad (Hunza)" },
  "skardu":               { lat: 35.2971, lng: 75.6333, zone: "north",  base: "Skardu" },
  "khunjerab-pass":       { lat: 36.8486, lng: 75.4294, zone: "north",  base: "Sost or Passu (Upper Hunza)" },
  "deosai-plains":        { lat: 35.0200, lng: 75.4000, zone: "north",  base: "Skardu, or camping on the plateau" },

  "hingol-national-park": { lat: 25.4833, lng: 65.5000, zone: "remote", base: "Camping or very basic stays (limited); Karachi is the usual base" },
  "astola-island":        { lat: 25.1167, lng: 63.8500, zone: "remote", base: "Pasni, with camping on the island" },
  "kund-malir-beach":     { lat: 25.3511, lng: 65.4891, zone: "remote", base: "Camping (limited), or a day trip from Karachi" },
  "ziarat-residency":     { lat: 30.3822, lng: 67.7253, zone: "city",   base: "Ziarat" },
  "hanna-lake":           { lat: 30.2167, lng: 67.1000, zone: "city",   base: "Quetta" },
  "gwadar-beach":         { lat: 25.1264, lng: 62.3225, zone: "remote", base: "Gwadar" }
};

export const TIERS = {
  economy:     { label: "Economy",     stayType: "guesthouse or budget hotel" },
  standard:    { label: "Standard",    stayType: "3-star hotel" },
  comfortable: { label: "Comfortable", stayType: "4 or 5-star hotel or resort" }
};

// PKR per ROOM per night (a room is shared by up to 2 people)
export const STAY_ROOM_NIGHT = {
  economy:     { city: 4000,  north: 6000,  remote: 3500 },
  standard:    { city: 11000, north: 18000, remote: 9000 },
  comfortable: { city: 30000, north: 35000, remote: 20000 }
};

// PKR per PERSON per day (three meals)
export const FOOD_PERSON_DAY = { economy: 1800, standard: 3500, comfortable: 6500 };
export const FOOD_ZONE_MULT  = { city: 1, north: 1.15, remote: 1.15 };

// PKR per VEHICLE per day, with driver (economy = local shared transport / rickshaw / ride-hailing)
export const VEHICLE_DAY = {
  economy:     { city: 2500,  north: 6000,  remote: 6000 },
  standard:    { city: 7500,  north: 10000, remote: 11000 },
  comfortable: { city: 16000, north: 18000, remote: 19000 }
};

// PKR per PERSON per day for tickets, boat rides, guides and small activities
export const ENTRY_PERSON_DAY = { economy: 500, standard: 1200, comfortable: 2500 };

export const FUEL_PER_KM = 25;            // PKR per km per vehicle (standard / comfortable)
export const BUS_PER_KM_PERSON = 8;       // PKR per km per person on long bus transfers (economy)
export const LONG_TRANSFER_KM = 150;      // from here a transfer counts as "long"

// The real total is shown as a range around the estimate
export const RANGE = { low: 0.85, high: 1.25 };

export const DATA_NOTE =
  "Estimates for planning only, based on public hotel, car-hire and travel-cost listings checked in October 2026. " +
  "Real prices change with season, vendor and bargaining. Entry tickets, flights and shopping are not included.";

// Starting cities for the "From" box. Coordinates are city centres.
// The road distance from here to the first stop is estimated the same way as
// every other leg (straight line x a road factor), so it is a planning figure.
export const ORIGINS = {
  karachi:    { name: "Karachi",    province: "Sindh",              lat: 24.8607, lng: 67.0011 },
  lahore:     { name: "Lahore",     province: "Punjab",             lat: 31.5204, lng: 74.3587 },
  islamabad:  { name: "Islamabad",  province: "Capital Territory",  lat: 33.6844, lng: 73.0479 },
  peshawar:   { name: "Peshawar",   province: "Khyber Pakhtunkhwa", lat: 34.0151, lng: 71.5249 },
  quetta:     { name: "Quetta",     province: "Balochistan",        lat: 30.1798, lng: 66.9750 },
  multan:     { name: "Multan",     province: "Punjab",             lat: 30.1575, lng: 71.5249 },
  faisalabad: { name: "Faisalabad", province: "Punjab",             lat: 31.4504, lng: 73.1350 },
  hyderabad:  { name: "Hyderabad",  province: "Sindh",              lat: 25.3960, lng: 68.3578 }
};