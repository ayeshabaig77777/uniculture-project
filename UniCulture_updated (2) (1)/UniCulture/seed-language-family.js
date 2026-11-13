import { db } from "./firebase-config.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

// ============================================================
// SEED LANGUAGE FAMILY — Quick Facts "Language Family" field
// ============================================================
// This does NOT touch any other field of each language document
// (name, province, region, image, script, speakers, description,
// history, writing_direction, dialects, similar_languages, hello,
// thanks, welcome, goodbye, literature, notable_people,
// cultural_practices, traditional_food, music_dance, fun_fact,
// language_learning). It writes ONLY the `language_family` field
// using setDoc(..., { merge: true }), which adds/overwrites just
// that one field and leaves everything else in the document
// exactly as it is.
//
// Document IDs used (must match the existing "languages" collection
// document IDs — confirmed against seed-languages.js, which already
// writes to these same 12 documents): Urdu, Punjabi, Sindhi, Pashto,
// Saraiki, Kashmiri, Hindko, Balochi, Shina, Balti, Burushaski, Wakhi.

const LANGUAGE_FAMILY = {
  "Urdu": "Indo-European > Indo-Iranian > Indo-Aryan (Central zone / Hindustani)",
  "Punjabi": "Indo-European > Indo-Iranian > Indo-Aryan (Northwestern zone / Punjabic)",
  "Sindhi": "Indo-European > Indo-Iranian > Indo-Aryan (Northwestern zone / Sindhic)",
  "Pashto": "Indo-European > Indo-Iranian > Iranian (Eastern Iranian)",
  "Saraiki": "Indo-European > Indo-Iranian > Indo-Aryan (Northwestern zone / Lahnda group)",
  "Kashmiri": "Indo-European > Indo-Iranian > Indo-Aryan (Dardic group)",
  "Hindko": "Indo-European > Indo-Iranian > Indo-Aryan (Northwestern zone / Lahnda group)",
  "Balochi": "Indo-European > Indo-Iranian > Iranian (Northwestern Iranian)",
  "Shina": "Indo-European > Indo-Iranian > Indo-Aryan (Dardic group)",
  "Balti": "Sino-Tibetan > Tibeto-Burman > Tibetic (Ladakhi-Balti group)",
  "Burushaski": "Language isolate (not part of any known language family)",
  "Wakhi": "Indo-European > Indo-Iranian > Iranian (Eastern Iranian / Pamir languages)"
};

const seedBtn = document.getElementById("seedLanguageFamilyBtn");
const statusEl = document.getElementById("seedLanguageFamilyStatus");

if (seedBtn) {

  seedBtn.addEventListener("click", async () => {

    seedBtn.disabled = true;
    statusEl.textContent = "Seeding...";

    try {

      await Promise.all(
        Object.entries(LANGUAGE_FAMILY).map(([key, familyValue]) =>
          setDoc(
            doc(db, "languages", key),
            { language_family: familyValue },
            { merge: true }
          )
        )
      );

      statusEl.textContent = "✅ Done! Language Family added to 12 languages.";

    } catch (error) {

      console.error(error);
      statusEl.textContent = "❌ Failed: " + error.message;

    } finally {

      seedBtn.disabled = false;

    }

  });

}