import { db } from "./firebase-config.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// This is a ONE-TIME uploader. After you click "Seed Regions" once, all of
// this content lives in Firestore (Regions collection) and can be edited
// there directly, exactly like your languages/festivals/food documents.
// region-detail.js reads ONLY from Firestore — it does not use this file
// after the initial seed.

const REGIONS = {

  punjab: {
    title: "Punjab",
    tagline: "Land of the Five Rivers",
    city: "Lahore",
    overview: "The cultural heartland of Pakistan, known for its fertile plains, vibrant festivals, and rich Sufi heritage.",
    description: "Punjab is Pakistan's most populous province and its agricultural and cultural heartland. Fed by five great rivers, its fertile plains have supported civilizations for millennia. From the Mughal grandeur of Lahore to the folk fairs of the countryside, Punjab blends deep-rooted tradition with fast-paced modern life.",
    population: "110 million+",
    area: "205,344 km²",
    languages: "Punjabi, Urdu, Saraiki",
    highlights: ["Lahore Fort", "Badshahi Mosque", "Bhangra Dance", "Basant Festival"],
    history: "Punjab's history stretches from the Indus Valley Civilization through the Vedic, Greek, and Mauryan periods, to centuries of Mughal rule that left behind forts, mosques, and gardens across Lahore and Multan. Sikh and later British rule reshaped its politics, before it became the industrial and administrative core of Pakistan after 1947.",
    culture: "Punjab's culture centers on hospitality, Sufi devotion, and celebration. Shrines of saints like Data Ganj Bakhsh draw pilgrims year-round, while folk traditions like Bhangra and Luddi fill weddings and harvest festivals. The province is equally known for its cuisine — from sarson ka saag to hearty Lahori street food — and for keeping alive centuries-old crafts like Multani pottery and Punjabi phulkari embroidery.",
    funfact: "Lahore's Walled City has been continuously inhabited for over a thousand years and is still home to 13 historic gates.",
    image: "images/punjab.jpg",
    places: [
      { image: "images/badshahi.jpg", title: "Badshahi Mosque" },
      { image: "images/lahorefort.webp", title: "Lahore Fort" },
      { image: "images/minar.jpg", title: "Minar-e-Pakistan" },
      { image: "images/shalimar.jpg", title: "Shalimar Gardens" },
      { image: "images/kehwara.jpg", title: "Khewra Salt Mine" },
      { image: "images/noormahal.jpg", title: "Noor Mahal" }
    ]
  },

  sindh: {
    title: "Sindh",
    tagline: "Cradle of an Ancient Civilization",
    city: "Karachi",
    overview: "Home to the 5,000-year-old Indus Valley Civilization, Sindh blends ancient heritage with Sufi mysticism and coastal life.",
    description: "Sindh sits along the mighty Indus River and is one of the oldest continuously inhabited regions on earth. It is home to the ruins of Mohenjo-daro, one of the world's earliest planned cities, as well as a living Sufi culture that shapes its music, poetry, and everyday life. From the bustling port city of Karachi to quiet riverside towns, Sindh carries a deep sense of history.",
    population: "50 million+",
    area: "140,914 km²",
    languages: "Sindhi, Urdu",
    highlights: ["Mohenjo-Daro", "Ajrak", "Sufi Music", "Sindhi Topi"],
    history: "Sindh takes its name from the Indus River and was the seat of the Indus Valley Civilization around 2500 BCE, centered at Mohenjo-daro. Over the centuries it was shaped by Arab conquest, the Sufi movement, and Talpur and British rule, each leaving traces in its architecture, language, and customs that survive today.",
    culture: "Sindhi culture is defined by Sufi devotion — the shrine of Shah Abdul Latif Bhittai in Bhit Shah remains a spiritual and cultural center. The Ajrak (block-printed shawl) and the embroidered Sindhi cap are worn with pride as symbols of identity. Traditional Sindhi biryani, sai bhaji, and folk instruments like the yaktaro accompany festivals and gatherings across the province.",
    funfact: "Mohenjo-daro, meaning 'Mound of the Dead', had one of the world's earliest known urban sanitation systems, built over 4,000 years ago.",
    image: "images/sindh.jpg",
    places: [
      { image: "images/mohenjo.jpg", title: "Mohenjo-Daro" },
      { image: "images/shahjahan.jpg", title: "Shah Jahan Mosque" },
      { image: "images/keenjhar.jpeg", title: "Keenjhar Lake" },
      { image: "images/gorakh.jpg", title: "Gorakh Hill" },
      { image: "images/ranikotfort.jpg", title: "Ranikot Fort" },
      { image: "images/clifton.jpg", title: "Clifton Beach" }
    ]
  },

  kpk: {
    title: "Khyber Pakhtunkhwa",
    tagline: "Land of the Pashtuns",
    city: "Peshawar",
    overview: "A land of rugged mountains, ancient trade routes, and the proud hospitality traditions of the Pashtun people.",
    description: "Khyber Pakhtunkhwa stretches from the fertile Peshawar valley into the towering peaks of the Hindu Kush and Karakoram. Sitting along the historic Silk Road and the Khyber Pass, it has long been a crossroads of trade and empires, and today it remains famous for its mountain scenery and its strong code of hospitality and honor.",
    population: "40 million+",
    area: "101,741 km²",
    languages: "Pashto, Hindko, Saraiki",
    highlights: ["Swat Valley", "Khyber Pass", "Pashtun Culture", "Khattak Dance"],
    history: "The region was once part of ancient Gandhara, a major center of Buddhist art and learning, and later a key link on the Silk Road through the Khyber Pass. It was shaped by Mughal, Sikh, and British frontier rule before becoming a province of Pakistan, retaining a strong tribal and regional identity throughout.",
    culture: "Life in Khyber Pakhtunkhwa is guided by Pashtunwali, a centuries-old code of honor, hospitality, and loyalty. Guests are treated with great respect, and gatherings often feature the energetic Khattak sword dance and Attan. The region has also produced celebrated poets such as Khushal Khan Khattak and Rahman Baba, whose verses remain widely recited.",
    funfact: "Peshawar is considered one of the oldest continuously inhabited cities in South Asia, with a history going back over 2,000 years.",
    image: "images/kpk.jpg",
    places: [
      { image: "images/swat.jpg", title: "Swat Valley" },
      { image: "images/kalam.jpg", title: "Kalam Valley" },
      { image: "images/mahodand.jpg", title: "Mahodand Lake" },
      { image: "images/saifulmalook.jpg", title: "Saif-ul-Malook Lake" },
      { image: "images/malamjabba.jpg", title: "Malam Jabba" },
      { image: "images/Shogran.jpg", title: "Shogran" }
    ]
  },

  balochistan: {
    title: "Balochistan",
    tagline: "Land of Vast Horizons",
    city: "Quetta",
    overview: "Pakistan's largest province by area — a vast land of deserts, mountains, and a proud tribal culture along the Arabian Sea coast.",
    description: "Balochistan covers nearly half of Pakistan's landmass, yet remains its least densely populated province. Its dramatic landscapes range from the coastal cliffs of Gwadar and Hingol to the highlands around Quetta. Life here is shaped by a strong tribal identity, a rich oral tradition, and a deep connection to the land.",
    population: "15 million+",
    area: "347,190 km²",
    languages: "Balochi, Pashto, Brahui",
    highlights: ["Gwadar Port", "Hingol National Park", "Balochi Embroidery", "Sibi Festival"],
    history: "Balochistan's history includes the ancient Mehrgarh settlement, one of the earliest sites of farming in South Asia, and centuries of rule by the Khanate of Kalat. Its position along historic trade and migration routes to Central Asia and the Gulf shaped a distinct tribal social structure that continues to define the region.",
    culture: "Baloch culture places great value on tribal honor, hospitality, and oral poetry passed down through generations. Balochi embroidery, with its intricate mirror-work, is worn on festive occasions, and the Sibi Mela draws visitors for its livestock fairs, folk music, and traditional sports. Coastal communities add a distinct maritime character to the province's culture.",
    funfact: "Balochistan makes up about 44% of Pakistan's total land area but is home to less than 6% of its population.",
    image: "images/balochistan.jpg",
    places: [
      { image: "images/hingolNationalPark.jpg", title: "Hingol National Park" },
      { image: "images/astola-island.jpeg", title: "Astola Island" },
      { image: "images/Kund_Malir_Beach_Pakistan.jpg", title: "Kund Malir Beach" },
      { image: "images/Quaid_e_Azam_Residency_Ziarat.jpg", title: "Ziarat Residency" },
      { image: "images/Hanna_Lake_Quetta.jpg", title: "Hanna Lake" },
      { image: "images/gwadr.webp", title: "Gwadar Beach" }
    ]
  },

  gilgit: {
    title: "Gilgit-Baltistan",
    tagline: "Roof of the World",
    city: "Gilgit",
    overview: "A mountain region of ancient Silk Road heritage, home to K2 and a mosaic of unique languages and cultures found nowhere else in Pakistan.",
    description: "Gilgit-Baltistan sits where the Karakoram, Himalaya, and Hindu Kush ranges meet, making it home to some of the highest peaks on earth, including K2. For centuries it was a key stop on the Silk Road, and it remains a mosaic of small valleys, each with its own language, customs, and history distinct from the rest of Pakistan.",
    population: "2 million+",
    area: "72,971 km²",
    languages: "Shina, Balti, Burushaski, Wakhi",
    highlights: ["Hunza Valley", "K2", "Baltit Fort", "Cultural Festivals"],
    history: "Long a Silk Road crossroads, the region carries traces of ancient Buddhist rock carvings and once housed small princely states such as Hunza and Nagar, ruled from forts like Baltit and Altit. It became part of Pakistan's administrative territory in the years following 1947, while preserving its own distinct languages and governance traditions.",
    culture: "Gilgit-Baltistan is home to languages found nowhere else in the world, including Burushaski, a language isolate unrelated to any other known tongue. Its culture centers on close-knit valley communities, polo festivals played at high altitude, and the apricot harvests of Hunza. Mountaineering and trekking have also become part of its modern cultural identity.",
    funfact: "Gilgit-Baltistan is home to five of the world's fourteen peaks above 8,000 meters, more than anywhere else on earth.",
    image: "images/hunza.jpg",
    places: [
      { image: "images/hunza.jpg", title: "Hunza Valley" },
      { image: "images/FairyMeadows.webp", title: "Fairy Meadows" },
      { image: "images/Attabad.jpg", title: "Attabad Lake" },
      { image: "images/skardu.jpg", title: "Skardu" },
      { image: "images/KhunjerabPass.jpg", title: "Khunjerab Pass" },
      { image: "images/DeosaiPlains.jpg", title: "Deosai Plains" }
    ]
  }

};


const seedBtn = document.getElementById("seedRegionsBtn");
const statusEl = document.getElementById("seedRegionsStatus");

if (seedBtn) {

  seedBtn.addEventListener("click", async () => {

    seedBtn.disabled = true;
    statusEl.textContent = "Seeding...";

    try {

      await Promise.all(
        Object.entries(REGIONS).map(([key, data]) =>
          setDoc(doc(db, "Regions", key), data)
        )
      );

      statusEl.textContent = "✅ Done! 5 regions saved to Firestore.";

    } catch (error) {

      console.error(error);
      statusEl.textContent = "❌ Failed: " + error.message;

    } finally {

      seedBtn.disabled = false;

    }

  });

}