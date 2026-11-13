import { db } from "./firebase-config.js";

import {
  collection,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

// ============================================================
// FIX HERITAGE CONTENT — backfills missing detail-page fields
// ============================================================
// heritage_detail.html shows 5 fields per site that heritage.js /
// admin-heritage.js already know about: history, significance,
// opening_hours, best_time_to_visit, fun_fact. Many existing
// Heritage documents were created with only the basic fields
// (name, description, image, city, province, category, built_year)
// and these five were left blank, so the detail page shows empty
// sections.
//
// This script reads every document actually in the "Heritage"
// collection (whatever they are — it does not assume a fixed
// list), and for each one:
//   1. Looks up the site by name in KNOWN_SITES below and uses
//      that curated content if there's a match.
//   2. Otherwise builds a sensible fallback from the document's
//      own existing fields (name/city/province/category/built_year)
//      so nothing is left blank.
// It ONLY writes fields that are currently empty/missing on that
// document — anything already filled in (by hand or before) is left
// exactly as it is. Safe to click again.
// ============================================================

const KNOWN_SITES = {

  "badshahi mosque": {
    architectural_style: "Mughal Architecture",
    history: "Commissioned by Mughal Emperor Aurangzeb in 1673, the Badshahi Mosque was completed in under three years and remained the largest mosque in the world for over 300 years. It was built directly across from the Lahore Fort, facing the Alamgiri Gate, as a statement of imperial power at the height of Mughal rule.",
    significance: "The mosque is one of Pakistan's most recognizable landmarks and a masterpiece of Mughal religious architecture, blending Persian, Central Asian and Indian design traditions. It remains an active place of worship and a powerful symbol of Lahore's Mughal-era identity, drawing worshippers and visitors from across the country.",
    opening_hours: "Daily, 6:00 AM – 9:00 PM (closed to visitors during prayer times)",
    best_time_to_visit: "October to March, and early morning or evening for cooler weather and fewer crowds",
    fun_fact: "The mosque's courtyard can hold over 100,000 worshippers at once, making it one of the largest mosque courtyards in the world."
  },

  "lahore fort": {
    architectural_style: "Mughal Architecture",
    history: "Lahore Fort, known locally as Shahi Qila, has origins going back over a thousand years, but the structure seen today was largely built and expanded by Mughal emperors Akbar, Jahangir and Shah Jahan between the 16th and 17th centuries. Each ruler added palaces, gardens and gates, making it a layered record of Mughal architectural evolution.",
    significance: "As a UNESCO World Heritage Site, Lahore Fort represents nearly the full span of Mughal architectural style, from Akbar's early red sandstone structures to Shah Jahan's marble pavilions. It stands alongside the Shalimar Gardens as one of the twin UNESCO sites that define Lahore's Mughal legacy.",
    opening_hours: "Daily, 9:00 AM – 6:00 PM",
    best_time_to_visit: "November to February for pleasant sightseeing weather",
    fun_fact: "The fort's Sheesh Mahal (Palace of Mirrors) is decorated with thousands of small convex mirror pieces that make the entire hall sparkle by candlelight."
  },

  "baltit fort": {
    architectural_style: "Tibetan-influenced Himalayan Architecture",
    history: "Baltit Fort has stood above Karimabad in Hunza for more than 700 years, serving as the residence of the Mirs (rulers) of Hunza. Its architecture shows strong Tibetan influence, brought through marriage ties between the Hunza royal family and Baltistan in the 16th century, and it was restored in the 1990s by the Aga Khan Trust for Culture.",
    significance: "The fort is the cultural centerpiece of the Hunza Valley and a rare surviving example of the region's princely architecture. Its restoration became a model project for heritage conservation in Pakistan's mountain areas, and it now anchors Hunza's identity as a cultural and tourist destination.",
    opening_hours: "Daily, 9:00 AM – 5:00 PM",
    best_time_to_visit: "April to October, especially April for apricot blossoms or October for autumn colours",
    fun_fact: "Baltit Fort sits high enough above Karimabad that its watchtowers once gave rulers a clear view of anyone approaching the valley for miles around."
  },

  "altit fort": {
    architectural_style: "Tibetan-influenced Himalayan Architecture",
    history: "Altit Fort is believed to be over 900 years old, making it the oldest monument in the Hunza Valley and older than Baltit Fort itself. It was the original seat of the Hunza rulers before the court later moved to Baltit.",
    significance: "As the oldest surviving structure in Hunza, Altit Fort is a key reference point for the region's architectural and dynastic history, and its restoration helped revive traditional building crafts in the valley.",
    opening_hours: "Daily, 9:00 AM – 5:00 PM",
    best_time_to_visit: "April to October",
    fun_fact: "The fort's watchtower was built on the edge of a sheer cliff, dropping straight down to the Hunza River below."
  },

  "rohtas fort": {
    architectural_style: "Pashtun–Mughal Military Architecture",
    history: "Rohtas Fort was built by Sher Shah Suri between 1541 and 1548 to secure the Grand Trunk Road and guard against the return of the Mughal emperor Humayun and the rebellious Gakhar tribes of the region. It was never actually taken by force during its active military life.",
    significance: "Recognised as a UNESCO World Heritage Site, Rohtas Fort is considered one of the finest examples of early Muslim military architecture in South Asia, combining Pashtun and Hindu design elements over massive fortified walls stretching several kilometres.",
    opening_hours: "Daily, 8:00 AM – 6:00 PM",
    best_time_to_visit: "October to March for cooler, more comfortable exploring",
    fun_fact: "The fort's outer walls stretch for over 4 kilometres and include 68 bastions and 12 gates, making it one of the largest forts in South Asia."
  },

  "mohenjo-daro": {
    architectural_style: "Indus Valley Civilization Urban Planning",
    history: "Mohenjo-daro was built around 2500 BCE and flourished as one of the largest settlements of the Indus Valley Civilization before being mysteriously abandoned around 1900 BCE. It was rediscovered in the 1920s and remains one of the best-preserved urban sites of the ancient world.",
    significance: "As a UNESCO World Heritage Site, Mohenjo-daro offers unmatched insight into one of the world's earliest urban civilizations, with its grid-planned streets, advanced drainage systems and standardized brick sizes showing a level of urban planning far ahead of its time.",
    opening_hours: "Daily, 9:00 AM – 5:00 PM",
    best_time_to_visit: "November to February, avoiding Sindh's intense summer heat",
    fun_fact: "Mohenjo-daro's Great Bath, built over 4,000 years ago, is considered the earliest known public water tank in the ancient world."
  },

  "ranikot fort": {
    architectural_style: "Talpur-era Fortification",
    history: "Often called the 'Great Wall of Sindh', Ranikot Fort's exact origins are debated, with some structures dated to the Talpur dynasty in the early 19th century, though local tradition holds parts of it are far older. It was built to defend the surrounding Kirthar hill region.",
    significance: "With walls stretching an estimated 26 kilometres, Ranikot is believed to be one of the largest forts in the world, and it stands as a symbol of Sindh's historic frontier defences on Pakistan's UNESCO tentative list.",
    opening_hours: "Daily, 8:00 AM – 5:00 PM",
    best_time_to_visit: "November to February to avoid extreme heat in the surrounding desert terrain",
    fun_fact: "Ranikot Fort's outer perimeter is so vast that it is sometimes compared in scale to the Great Wall of China."
  },

  "makli necropolis": {
    architectural_style: "Sindhi–Islamic Funerary Architecture",
    history: "Makli Necropolis, near Thatta, developed over roughly 400 years starting in the 14th century, serving as the burial ground for Sindh's rulers, saints and scholars under the Samma, Arghun, Tarkhan and Mughal dynasties.",
    significance: "As a UNESCO World Heritage Site, Makli is one of the largest funerary sites in the world, with an estimated half a million tombs. Its intricately carved sandstone and glazed-tile mausoleums reflect the fusion of Persian, Central Asian and local Sindhi craftsmanship.",
    opening_hours: "Daily, 8:00 AM – 6:00 PM",
    best_time_to_visit: "November to February",
    fun_fact: "Makli is considered one of the largest necropolises on Earth, with tombs spread across roughly 10 square kilometres."
  },

  "shah jahan mosque": {
    architectural_style: "Mughal Tile-work Architecture",
    history: "Built in 1647 during the reign of Emperor Shah Jahan, this mosque in Thatta was constructed as a gesture of gratitude to the people of Sindh who had sheltered him during a period of exile before he became emperor.",
    significance: "The mosque is famed for its exceptional glazed-tile work and acoustics, engineered so that a speaker at the mihrab can be heard throughout the prayer hall without amplification, making it a celebrated example of Mughal-era craftsmanship in Sindh.",
    opening_hours: "Daily, 6:00 AM – 8:00 PM (closed to visitors during prayer times)",
    best_time_to_visit: "November to February",
    fun_fact: "The mosque contains over 100 domes, each contributing to its distinctive acoustic design."
  },

  "derawar fort": {
    architectural_style: "Rajput–Islamic Desert Fortification",
    history: "Derawar Fort was originally built in the 9th century by a Bhati Rajput ruler and later rebuilt in the 18th century by Nawab Sadeq Mohammad Khan I of Bahawalpur, whose descendants continued to control it into the 20th century.",
    significance: "Rising dramatically from the Cholistan Desert, Derawar's massive circular bastions make it one of the most striking forts in Pakistan, and it remains closely tied to the history of the Bahawalpur princely state.",
    opening_hours: "Daily, 9:00 AM – 5:00 PM (visitor permission may be required from the Bahawalpur administration)",
    best_time_to_visit: "November to February to avoid the extreme desert heat",
    fun_fact: "Derawar Fort's walls are visible from many kilometres away across the flat Cholistan Desert, with 40 massive bastions circling its perimeter."
  },

  "katas raj temples": {
    architectural_style: "Hindu Temple Architecture",
    history: "The Katas Raj complex dates back over 900 years, with some structures linked to the Hindu Shahi period, and is built around a sacred pond that, according to legend, formed from the tears of the god Shiva after the death of his wife Sati.",
    significance: "The site remains an active pilgrimage destination for Hindus in Pakistan and abroad, and its cluster of temples represents one of the most important surviving groups of Hindu religious architecture in the country.",
    opening_hours: "Daily, 8:00 AM – 6:00 PM",
    best_time_to_visit: "October to March",
    fun_fact: "The sacred pond at Katas Raj is mentioned in the Mahabharata, one of the great epics of Hindu mythology."
  },

  "hiran minar": {
    architectural_style: "Mughal Garden Architecture",
    history: "Built by Emperor Jahangir in the early 17th century, Hiran Minar was constructed as a memorial to his beloved pet antelope, Mansraj, and later expanded with a large tank and pavilion by Shah Jahan.",
    significance: "The monument is a distinctive example of Mughal commemorative architecture and reflects the emperors' fondness for gardens, water features and wildlife, offering a quieter counterpart to Lahore's more grand imperial monuments.",
    opening_hours: "Daily, 9:00 AM – 6:00 PM",
    best_time_to_visit: "October to March",
    fun_fact: "The minaret was built specifically to commemorate an animal, making it one of the few monuments of its kind anywhere in the Mughal world."
  },

  "chaukhandi tombs": {
    architectural_style: "Sindhi Sandstone Funerary Architecture",
    history: "The Chaukhandi Tombs, located near Karachi, were built between the 15th and 18th centuries by the Jokhio and Baloch tribes, showcasing a distinctive tradition of sandstone carving unique to lower Sindh.",
    significance: "The tombs are notable for their intricate geometric and figurative carvings depicting horsemen, jewellery and weapons, offering a rare glimpse into pre-colonial Baloch and Sindhi funerary art traditions.",
    opening_hours: "Daily, 9:00 AM – 5:00 PM",
    best_time_to_visit: "November to February",
    fun_fact: "The carvings on men's graves often depict horses and weapons, while women's graves are marked with jewellery motifs — a visual code that identified the deceased."
  },

  "uch sharif": {
    architectural_style: "Multani–Islamic Shrine Architecture",
    history: "Uch Sharif is one of the oldest cities in Pakistan, with a history tracing back to Alexander the Great, and later flourished as a major centre of Sufism, home to the shrines of saints such as Bibi Jawindi, built in 1494.",
    significance: "The tombs of Uch Sharif share the distinctive blue-tiled dome architecture also seen in Multan, and the site remains an important centre of Sufi devotion and pilgrimage in southern Punjab.",
    opening_hours: "Daily, 8:00 AM – 6:00 PM",
    best_time_to_visit: "November to February",
    fun_fact: "Part of the Bibi Jawindi tomb collapsed into the nearby river in 1817 due to flooding, yet its remaining glazed-tile dome still stands today."
  },

  "harappa": {
    architectural_style: "Indus Valley Civilization Urban Planning",
    history: "Harappa flourished as a major city of the Indus Valley Civilization around 2600 BCE and, alongside Mohenjo-daro, gave its name to the wider Harappan culture. The site was heavily damaged in the 19th century when bricks were removed to build a railway line.",
    significance: "Harappa remains one of the founding sites through which archaeologists first identified the Indus Valley Civilization in the 1920s, making it central to understanding South Asia's earliest urban society.",
    opening_hours: "Daily, 9:00 AM – 5:00 PM",
    best_time_to_visit: "November to February",
    fun_fact: "Harappa gave its name to the entire Indus Valley Civilization, which is often referred to as the 'Harappan Civilization' in archaeology."
  },

  "takht-i-bahi": {
    architectural_style: "Gandhara Buddhist Monastic Architecture",
    history: "Takht-i-Bahi was founded in the 1st century CE as a Buddhist monastic complex and remained in use for several centuries, built on a hilltop in what was then the heart of the ancient Gandhara civilization.",
    significance: "As one of the best-preserved Buddhist monastic complexes from the Gandhara period and a UNESCO World Heritage Site, it offers a rare, largely intact record of Buddhist monastery life and architecture in the region.",
    opening_hours: "Daily, 9:00 AM – 5:00 PM",
    best_time_to_visit: "October to March",
    fun_fact: "The complex sits atop a hill roughly 500 metres above the surrounding plain, chosen deliberately for quiet meditation away from town life."
  },

  "ziarat residency": {
    architectural_style: "Colonial Wooden Architecture",
    history: "Originally built in 1892 as a British colonial retreat, the Ziarat Residency became historically significant as the place where Muhammad Ali Jinnah, Pakistan's founder, spent his final weeks in 1948 before his death.",
    significance: "The Residency is one of Pakistan's most important sites of national memory, preserved as a memorial to the country's founder, though the original structure was severely damaged by arson in 2013 and later rebuilt.",
    opening_hours: "Daily, 9:00 AM – 5:00 PM",
    best_time_to_visit: "April to October, when Ziarat's high-altitude climate is mildest",
    fun_fact: "The building is surrounded by one of the largest juniper forests in the world, some trees estimated to be over 1,000 years old."
  },

  "noor mahal": {
    architectural_style: "Indo-European Palatial Architecture",
    history: "Noor Mahal was built in 1875 by Nawab Sir Muhammad Sadeq Muhammad Khan Abbasi IV of Bahawalpur as a residence for his wife, blending Italian, Corinthian and local architectural styles.",
    significance: "The palace is among the finest examples of the Bahawalpur princely state's architectural legacy and today serves as a museum and cultural landmark reflecting the region's royal history.",
    opening_hours: "Daily, 9:00 AM – 5:00 PM",
    best_time_to_visit: "November to February",
    fun_fact: "According to local legend, Nawab Sadeq Khan's wife refused to live in the palace after learning it was built over a graveyard, and it was rarely used as a residence afterward."
  },

  "minar-e-pakistan": {
    architectural_style: "Modernist Monument Architecture",
    history: "Minar-e-Pakistan was built between 1960 and 1968 on the site where the Lahore Resolution was passed by the All-India Muslim League in 1940, a key step toward the creation of Pakistan.",
    significance: "The tower is a national monument commemorating the resolution that formally called for a separate Muslim homeland, and it remains a central symbol of Pakistan's independence movement.",
    opening_hours: "Daily, 6:00 AM – 10:00 PM",
    best_time_to_visit: "October to March, and evenings for a cooler visit with the tower illuminated",
    fun_fact: "The monument's design blends Mughal and modern architectural elements, and its base incorporates flower patterns representing each of Pakistan's provinces."
  },

  "faisal mosque": {
    architectural_style: "Modernist Islamic Architecture",
    history: "Completed in 1986, Faisal Mosque was designed by Turkish architect Vedat Dalokay and funded by Saudi Arabia's King Faisal, after whom it is named. Its striking tent-like design departed from traditional dome-and-minaret mosque architecture.",
    significance: "For decades the largest mosque in the world, Faisal Mosque is Islamabad's most recognizable landmark and a striking example of modernist Islamic architecture, set dramatically against the Margalla Hills.",
    opening_hours: "Daily, 6:00 AM – 9:00 PM (closed to visitors during prayer times)",
    best_time_to_visit: "October to March",
    fun_fact: "The mosque's design deliberately has no traditional dome, taking the shape of a Bedouin tent instead — a striking break from classical mosque architecture."
  },

  "data darbar": {
    architectural_style: "Islamic Shrine Architecture",
    history: "Data Darbar is the shrine of the 11th-century Sufi saint Ali Hujwiri, popularly known as Data Ganj Bakhsh, who is credited with helping spread Islam in the Punjab region through his teachings and writings.",
    significance: "It is one of the oldest and most visited Muslim shrines in South Asia, drawing pilgrims from across the region and standing as a major centre of Sufi devotional life in Lahore.",
    opening_hours: "Open 24 hours",
    best_time_to_visit: "Year-round; Thursday evenings for the shrine's weekly devotional gatherings",
    fun_fact: "Data Ganj Bakhsh's book 'Kashf al-Mahjub' is considered one of the earliest and most influential Persian treatises on Sufism."
  },

  "wazir khan mosque": {
    architectural_style: "Mughal Tile-work Architecture",
    history: "Built between 1634 and 1641 during the reign of Shah Jahan, Wazir Khan Mosque was commissioned by Hakim Shaikh Ilm-ud-din, known as Wazir Khan, a governor of Lahore under the Mughal court.",
    significance: "The mosque is celebrated for its extensive kashi-kari (glazed tile) work covering nearly its entire surface, making it one of the most richly decorated Mughal-era buildings and a landmark of Lahore's Walled City.",
    opening_hours: "Daily, 6:00 AM – 8:00 PM (closed to visitors during prayer times)",
    best_time_to_visit: "October to March",
    fun_fact: "The mosque's tile work covers nearly every inch of its facade and interior, earning it the nickname 'the mosque of the moon of images' for its decoration."
  },

  "mehrgarh": {
    architectural_style: "Neolithic Settlement Architecture",
    history: "Mehrgarh, in Balochistan, dates back to around 7000 BCE, making it one of the earliest known farming settlements in South Asia and a site that predates the Indus Valley Civilization by thousands of years.",
    significance: "Archaeologists consider Mehrgarh crucial evidence for understanding the roots of the later Indus Valley Civilization, showing early evidence of agriculture, animal domestication and craft production in the region.",
    opening_hours: "Site accessible during daylight hours; check locally as facilities are limited",
    best_time_to_visit: "November to March",
    fun_fact: "Excavations at Mehrgarh uncovered some of the earliest known evidence of dentistry in human history, dated to around 7000 BCE."
  },

  "shalimar gardens": {
    architectural_style: "Mughal Garden Architecture",
    history: "The Shalimar Gardens were laid out in 1642 by Emperor Shah Jahan, built across three descending terraces fed by a canal diverted specifically to supply the gardens' fountains and pools.",
    significance: "A UNESCO World Heritage Site alongside Lahore Fort, the gardens are considered one of the finest surviving examples of Mughal landscape design, reflecting the Persian-inspired charbagh (four-part garden) tradition.",
    opening_hours: "Daily, 9:00 AM – 9:00 PM",
    best_time_to_visit: "March to April for blooming flowers, or October to November for pleasant weather",
    fun_fact: "The gardens originally had over 400 fountains, fed entirely by gravity through a canal built specifically to supply them."
  },

  "khewra salt mine": {
    architectural_style: "Industrial Mining Architecture",
    history: "According to local tradition, salt deposits at Khewra were discovered by Alexander the Great's soldiers around 320 BCE, though large-scale mining began under Mughal rule and was later systematized by the British in 1872.",
    significance: "Khewra is the second-largest salt mine in the world and one of Pakistan's most visited natural landmarks, known for its illuminated salt tunnels, a salt mosque, and pink salt crystal formations.",
    opening_hours: "Daily, 8:00 AM – 6:00 PM",
    best_time_to_visit: "October to March",
    fun_fact: "The mine contains a mosque built entirely from bricks of salt, illuminated to glow pink and white from within."
  }

};

// ------------------------------------------------------------
// Fallback generator for any Heritage document not found above
// (so nothing is ever left blank, even for newly-added sites).
// ------------------------------------------------------------
function buildFallback(data) {
  const name = data.name || "This site";
  const place = [data.city, data.province].filter(Boolean).join(", ") || "Pakistan";
  const category = (data.category || "heritage site").toLowerCase();
  const year = data.built_year ? ` around ${data.built_year}` : "";

  return {
    architectural_style: data.architectural_style || "Traditional Pakistani Architecture",
    history: `${name} is a ${category} located in ${place}, believed to have been built${year}. It stands today as a reminder of the region's layered history and the communities who built and preserved it over the generations.`,
    significance: `${name} holds lasting cultural and historical value for ${place} and for Pakistan's wider heritage. Sites like this help preserve the craftsmanship, stories and traditions of the people who came before, and remain an important link between past and present.`,
    opening_hours: "Timings may vary — check locally before visiting",
    best_time_to_visit: "October to March, when weather across most of Pakistan is cooler and more comfortable for sightseeing",
    fun_fact: `${name} remains one of the lesser-documented sites on record — if you know an interesting fact about it, consider contributing it through the Community page.`
  };
}

function normalize(name) {
  return (name || "").trim().toLowerCase();
}

const seedBtn = document.getElementById("seedHeritageContentBtn");
const statusEl = document.getElementById("seedHeritageContentStatus");

if (seedBtn) {

  seedBtn.addEventListener("click", async () => {

    seedBtn.disabled = true;
    statusEl.textContent = "Checking heritage sites...";

    try {

      const snapshot = await getDocs(collection(db, "Heritage"));

      if (snapshot.empty) {
        statusEl.textContent = "No heritage sites found in Firestore yet.";
        seedBtn.disabled = false;
        return;
      }

      let updatedCount = 0;
      let skippedCount = 0;

      for (const docSnap of snapshot.docs) {

        const data = docSnap.data();
        const key = normalize(data.name);
        const source = KNOWN_SITES[key] || buildFallback(data);

        const missing = {};
        ["architectural_style", "history", "significance", "opening_hours", "best_time_to_visit", "fun_fact"]
          .forEach((field) => {
            if (!data[field] || !String(data[field]).trim()) {
              missing[field] = source[field];
            }
          });

        if (Object.keys(missing).length > 0) {
          await updateDoc(doc(db, "Heritage", docSnap.id), missing);
          updatedCount++;
        } else {
          skippedCount++;
        }

      }

      statusEl.textContent = `✅ Done! Filled missing content for ${updatedCount} site(s), ${skippedCount} already complete.`;

    } catch (error) {

      console.error(error);
      statusEl.textContent = "❌ Failed: " + error.message;

    } finally {

      seedBtn.disabled = false;

    }

  });

}