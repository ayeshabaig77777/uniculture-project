import { db } from "./firebase-config.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// CULTURE OF EACH AREA
// One document per culture area (Firestore collection "Culture"). Every tourism
// destination points to its area through the "places" list, so the destination
// page shows "Culture of <area>". Sections that have no content yet are simply
// not shown on the site, so nothing unverified ever appears.
//
//   status: "draft"    -> shown with a "Draft" label until someone has checked it
//   status: "verified" -> shown with a "Verified" label
//   status: "pending"  -> not written yet (the section is hidden)
//
// Each section is { intro: "...", items: [{ name, text }] }.
// Available sections: food, wedding, dress, language, festivals, crafts, etiquette

const CULTURE = {

  // ===================== GILGIT-BALTISTAN =====================

  "hunza": {
    name: "Hunza",
    province: "Gilgit-Baltistan",
    tagline: "A valley of apricots, the Burushaski language and the Ginani harvest festival.",
    places: ["hunza-valley", "attabad-lake", "khunjerab-pass"],
    status: "draft",
    updated: "2026-10",
    sections: {
      food: {
        items: [
          { name: "Chapshuro", short: "Hunza's 'pizza': a savoury pie stuffed with spiced minced meat.", text: "A savoury, crustless pie filled with minced meat, onions and spices, often described as Hunza's answer to pizza." },
          { name: "Harissa", short: "A slow wheat-and-meat dish, served at the Navroz feast.", text: "A wheat-and-meat dish, similar to haleem but with a distinct wheaty taste. It is part of the Navroz feast." },
          { name: "Diram Phitti", short: "A sweet fermented bread cake from sprouted wheat, eaten at Thumushiling.", text: "A sweet, fermented bread cake made with germinated wheat flour, traditionally eaten during the Thumushiling festival." }
        ]
      },
      language: {
        intro: "Three main languages are spoken in Hunza: Burushaski, Wakhi and Shina.",
        items: [
          { name: "Burushaski", short: "A language isolate: it has no known relatives anywhere.", text: "A language isolate, which means it has no known linguistic relatives." },
          { name: "Wakhi", short: "Spoken in Upper Hunza (Gojal), where the harvest festival is called Chineer.", text: "The language of Upper Hunza (Gojal), where the harvest festival is called Chineer." }
        ]
      },
      festivals: {
        items: [
          { name: "Ginani", short: "Harvest festival around 21 June, with ten days of music at Altit Fort before it.", text: "An annual harvest festival of Hunza and Nagar, usually around 21 June. Musicians at Altit Fort play tunes called Hareeps for ten days before Ginani day, and celebrations have included polo, tug-of-war, music and shared food." },
          { name: "Navroz", short: "The spring new year: a big feast and colourful clothes.", text: "The spring new-year festival. Families prepare a special feast with dishes such as Harissa and Chapshuro and wear colourful traditional clothes." }
        ]
      },
      wedding: {
        intro: "Details differ between villages and families. The points below come from published accounts of Hunza weddings.",
        items: [
          { name: "The nikah", short: "Held on the bride's side, with a small, carefully counted guest list.", text: "In one account from Karimabad, the nikah was held on the bride's side, at the jamaat khana nearest to her house, and only a small, carefully counted group of relatives from the groom's side was invited." },
          { name: "Music and dance", short: "Local musicians play and the whole neighbourhood joins the dancing.", text: "Wedding celebrations are accompanied by traditional music played by local musicians, with men and women from the neighbourhood gathering to watch and join in the dancing." },
          { name: "The groom's robe", short: "A long embroidered woollen choga. In nearby Yasin, the family's women make it.", text: "The groom typically wears a long woollen robe (choga), often undyed cream wool with colourful embroidery, with a traditional cap. In nearby Burushaski-speaking Yasin, the women of the household weave and embroider such a robe and present it to their sons at their weddings." }
        ]
      },
      dress: {
        items: [
          { name: "The embroidered cap", short: "Women wear a jewel-decorated embroidered cap under a long chador.", text: "Women of Hunza wear a beautifully embroidered cap, often decorated with jewellery, under a long chador. Girls traditionally learn embroidery from their mothers and grandmothers." },
          { name: "Men's long robe", short: "Long earth-toned gowns with embroidery, worn with a woollen cap.", text: "Men wear long gowns in earthy tones with traditional embroidery as ceremonial robes, together with a woollen cap. Woollen shawls are worn by both men and women in the cold winter months." }
        ]
      },
      crafts: {
        intro: "Hunza has long been known for jewellery, embroidery, pottery, architecture and woodwork.",
        items: [
          { name: "Woodwork", short: "Wood carving thrives in Karimabad, and women artisans now join in.", text: "Wood carving is a living craft in Karimabad. Carpentry was traditionally a male occupation, but female artisans have taken it up in recent years." },
          { name: "Carpets and rugs", short: "Handmade rugs and carpets, woven by both men and women.", text: "Hunza has its own tradition of weaving rugs and carpets, practised by both men and women. They are mostly handmade rather than mass-produced." },
          { name: "Jewellery and embroidery", short: "Hand-set gemstone jewellery and embroidered caps make iconic souvenirs.", text: "Local artisans cut and set gemstones into delicate handmade jewellery, and embroidered caps are one of the most recognisable Hunza souvenirs." },
          { name: "Woollen shawls", short: "Warm shawls, loved as winter wear and as gifts.", text: "Shawls from Hunza are among the most sought-after handicrafts, popular both for winter wear and as gifts." }
        ]
      }
    },
    sources: [
      { title: "Ginani (Wikipedia)", url: "https://en.wikipedia.org/wiki/Ginani" },
      { title: "Phitti (Wikipedia)", url: "https://en.wikipedia.org/wiki/Phitti" },
      { title: "Ginani Festival celebrated in Hunza Valley (Pamir Times)", url: "https://pamirtimes.net/2011/06/21/ginani-festival-celebrated-in-hunza-valley/" },
      { title: "Ginani Festival held at Baltit Fort (GB Eco)", url: "https://gbee.pk/2016/07/ginani-festival-held-at-baltit-fort-in-karimabad-hunza/" },
      { title: "Hidden tastes of Pakistan's north (Gulf News)", url: "https://gulfnews.com/amp/story/travel%2Fdestinations%2Fhidden-tastes-of-pakistans-north-1.1698666" },
      { title: "People of Hunza Valley: Culture and Traditions (Pleiades Travel)", url: "https://gopleiades.com/?p=13229" },
      { title: "Hunza crafts and dress (SMEDA)", url: "https://fon.smeda.org/?p=1227" },
      { title: "Karimabad: Wedding (travel account)", url: "https://en.agustinuswibowo.com/?p=456" },
      { title: "Wedding clothing, Yasin (Horniman Museum)", url: "https://www.horniman.ac.uk/object/2015.7" },
      { title: "Culture of Gilgit-Baltistan (Wikipedia)", url: "https://en.wikipedia.org/wiki/Culture_of_Gilgit-Baltistan" }
    ]
  },

  "baltistan": {
    name: "Skardu & Baltistan",
    province: "Gilgit-Baltistan",
    places: ["skardu", "deosai-plains"],
    status: "pending", sections: {}, sources: []
  },

  "diamer": {
    name: "Diamer & Fairy Meadows",
    province: "Gilgit-Baltistan",
    places: ["fairy-meadows"],
    status: "pending", sections: {}, sources: []
  },

  // ===================== KHYBER PAKHTUNKHWA =====================

  "swat": {
    name: "Swat & Kalam",
    province: "Khyber Pakhtunkhwa",
    places: ["swat-valley", "kalam-valley", "mahodand-lake", "malam-jabba"],
    status: "pending", sections: {}, sources: []
  },

  "kaghan": {
    name: "Kaghan & Naran",
    province: "Khyber Pakhtunkhwa",
    places: ["saiful-malook-lake", "shogran"],
    status: "pending", sections: {}, sources: []
  },

  // ===================== PUNJAB =====================

  "lahore": {
    name: "Lahore",
    province: "Punjab",
    places: ["badshahi-mosque", "lahore-fort", "minar-e-pakistan", "shalimar-gardens"],
    status: "pending", sections: {}, sources: []
  },

  "jhelum": {
    name: "Jhelum & Khewra",
    province: "Punjab",
    places: ["khewra-salt-mine"],
    status: "pending", sections: {}, sources: []
  },

  "bahawalpur": {
    name: "Bahawalpur",
    province: "Punjab",
    places: ["noor-mahal"],
    status: "pending", sections: {}, sources: []
  },

  // ===================== SINDH =====================

  "karachi": {
    name: "Karachi",
    province: "Sindh",
    places: ["clifton-beach"],
    status: "pending", sections: {}, sources: []
  },

  "thatta": {
    name: "Thatta & Jamshoro",
    province: "Sindh",
    places: ["shah-jahan-mosque", "keenjhar-lake", "ranikot-fort"],
    status: "pending", sections: {}, sources: []
  },

  "larkana": {
    name: "Larkana",
    province: "Sindh",
    places: ["mohenjo-daro"],
    status: "pending", sections: {}, sources: []
  },

  "dadu": {
    name: "Dadu & Kirthar",
    province: "Sindh",
    places: ["gorakh-hill"],
    status: "pending", sections: {}, sources: []
  },

  // ===================== BALOCHISTAN =====================

  "quetta": {
    name: "Quetta & Ziarat",
    province: "Balochistan",
    places: ["hanna-lake", "ziarat-residency"],
    status: "pending", sections: {}, sources: []
  },

  "makran": {
    name: "Makran Coast",
    province: "Balochistan",
    places: ["hingol-national-park", "astola-island", "kund-malir-beach", "gwadar-beach"],
    status: "pending", sections: {}, sources: []
  }

};


const seedBtn = document.getElementById("seedCultureBtn");
const reseedBtn = document.getElementById("reseedCultureBtn");
const statusEl = document.getElementById("seedCultureStatus");

async function seed(overwrite) {

  seedBtn.disabled = true;
  reseedBtn.disabled = true;
  statusEl.textContent = "Saving...";

  try {

    let created = 0;
    let skipped = 0;

    for (const [id, data] of Object.entries(CULTURE)) {

      const ref = doc(db, "Culture", id);

      if (!overwrite && (await getDoc(ref)).exists()) {
        skipped++;
        continue;
      }

      await setDoc(ref, { area: id, ...data });
      created++;

    }

    statusEl.textContent = `✅ Done! ${created} saved, ${skipped} left as they were (already exist).`;

  } catch (error) {

    console.error(error);
    statusEl.textContent = "❌ Failed: " + error.message;

  } finally {

    seedBtn.disabled = false;
    reseedBtn.disabled = false;

  }

}

if (seedBtn && reseedBtn) {

  // Safe button: only creates areas that do not exist yet, never overwrites edits
  seedBtn.addEventListener("click", () => seed(false));

  // Replaces everything with the content in this file (use after we update the text)
  reseedBtn.addEventListener("click", () => {
    if (confirm("This replaces ALL culture areas with the text in the code. Any edits made directly in Firestore will be lost. Continue?")) {
      seed(true);
    }
  });

}