import "./toast.js";

import { db } from "./firebase-config.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import { trackView } from "./track-view.js";

// ============================================================
// LEARN THIS LANGUAGE
// ============================================================

const CATEGORY_LABELS = {
    people: "👤 People",
    transport: "🚗 Transport",
    food: "🍲 Food",
    places: "📍 Places",
    objects: "🪑 Objects",
    useful: "✅ Useful Words"
};

// ============================================================
// SPEAK — per-language accent configuration
// ============================================================
// Maps each "languages" document id to a priority list of BCP-47
// voice codes to look for on the user's device/browser. The first
// installed voice that matches wins, and the NATIVE-script text is
// spoken with it (real accent for that language). If none of a
// language's codes are installed (most browsers/OSes don't ship
// voices for Sindhi, Pashto, Balochi, Shina, Balti, Burushaski,
// Wakhi, etc.), we fall back to reading the Roman transliteration
// with an English voice — the previous behavior — so playback never
// goes silent. Codes are ordered: dedicated code first, then the
// closest linguistically-related fallback voice (e.g. Saraiki/Hindko
// share script + heavy vocabulary overlap with Urdu; Balti is
// Tibetic so a Tibetan voice is closer than an English one; Wakhi/
// Balochi are Iranian languages so Persian is the closer fallback).
const LANGUAGE_VOICE_CONFIG = {
    "Urdu": ["ur-PK", "ur-IN", "ur"],
    "Punjabi": ["pa-IN", "pa-PK", "pa"],
    "Sindhi": ["sd-PK", "sd-IN", "sd", "ur-PK", "ur"],
    "Pashto": ["ps-AF", "ps-PK", "ps", "fa-IR", "fa"],
    "Saraiki": ["ur-PK", "ur", "pa-IN", "pa"],
    "Kashmiri": ["ks-IN", "ks", "ur-PK", "ur"],
    "Hindko": ["ur-PK", "ur", "pa-IN", "pa"],
    "Balochi": ["fa-IR", "fa", "ur-PK", "ur"],
    "Shina": ["ur-PK", "ur"],
    "Balti": ["bo-CN", "bo", "ur-PK", "ur"],
    "Burushaski": ["ur-PK", "ur"],
    "Wakhi": ["fa-IR", "fa", "ur-PK", "ur"]
};

// Rates a voice: natural / neural / online voices sound much more human
// than the basic voices that are built into the computer.
function voiceQuality(voice) {

    let score = 0;

    if (/natural|neural/i.test(voice.name)) score += 3;
    if (/online|google/i.test(voice.name)) score += 2;
    if (voice.localService === false) score += 1;

    return score;
}

function bestVoice(list) {
    return list.slice().sort((a, b) => voiceQuality(b) - voiceQuality(a))[0];
}

// Finds the best installed voice for the current language from the
// browser's voice list, honoring the priority order above. When several
// voices match, the most natural sounding one is chosen.
function findVoiceForLanguage(languageId) {

    const codes = LANGUAGE_VOICE_CONFIG[languageId];
    if (!codes) return null;

    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;

    for (const code of codes) {

        const base = code.split("-")[0].toLowerCase();

        // Prefer an exact region match first (e.g. "ur-PK"), then
        // fall back to any voice that just matches the base language
        // (e.g. any "ur" voice regardless of region).
        const exact = voices.filter(v => v.lang.toLowerCase() === code.toLowerCase());
        if (exact.length) return bestVoice(exact);

        const baseMatches = voices.filter(v => v.lang.toLowerCase().split("-")[0] === base);
        if (baseMatches.length) return bestVoice(baseMatches);
    }

    return null;
}

// Some browsers load their voice list only after the first request for it.
if ("speechSynthesis" in window) {
    window.speechSynthesis.getVoices();
}


// ============================================================
// HUMAN RECORDINGS FIRST, COMPUTER VOICE AS BACKUP
// ============================================================
// For every word or phrase the page first looks for a real recording:
//
//     audio/<language>/<word>.mp3     (.m4a, .opus and .wav files also work)
//
// For example the Urdu word "Assalam-o-Alaikum" is looked up as
// audio/urdu/assalam-o-alaikum.mp3. The exact file names are listed in
// audio-checklist.csv. If no recording exists yet, the computer voice
// (browser voice) is used instead, so nothing ever goes silent.

const AUDIO_EXTENSIONS = ["mp3", "m4a", "opus", "wav"];

// Files that were not found, so we do not ask for them again
const missingRecordings = new Set();

let currentRecording = null;
let computerVoiceNoticeShown = false;

// Turns "Assalam-o-Alaikum" into "assalam-o-alaikum" (the recording's file name)
function audioSlug(text) {

    return String(text || "")
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60);
}

// Tries to play the recording. Resolves true if it played, false if there is none.
function tryPlayRecording(languageId, romanText, button) {

    const slug = audioSlug(romanText);

    if (!slug) return Promise.resolve(false);

    const urls = AUDIO_EXTENSIONS
        .map(ext => `audio/${String(languageId).toLowerCase()}/${slug}.${ext}`)
        .filter(url => !missingRecordings.has(url));

    if (urls.length === 0) return Promise.resolve(false);

    // Stop anything that is already playing
    if (currentRecording) {
        currentRecording.pause();
        currentRecording = null;
    }

    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
    }

    function tryUrl(index) {

        if (index >= urls.length) return Promise.resolve(false);

        const url = urls[index];

        return new Promise((resolve) => {

            const audio = new Audio(url);
            let started = false;

            audio.addEventListener("playing", () => {
                started = true;
                currentRecording = audio;
                button.classList.add("speaking");
                resolve(true);
            });

            audio.addEventListener("ended", () => {
                button.classList.remove("speaking");
            });

            const giveUp = () => {
                button.classList.remove("speaking");
                if (!started) {
                    missingRecordings.add(url);
                    resolve(tryUrl(index + 1));
                }
            };

            audio.addEventListener("error", giveUp);
            audio.play().catch(giveUp);
        });
    }

    return tryUrl(0);
}


// The computer (browser) voice, used when there is no recording yet
function speakWithBrowserVoice(speakBtn, romanText, nativeText) {

    if (!("speechSynthesis" in window)) {
        showToast("Voice playback isn't supported in this browser", true);
        return;
    }

    // Try to find a real voice installed for this language
    // (e.g. an actual Sindhi/Pashto/Urdu voice on the user's
    // device). If found, speak the NATIVE-script text with
    // that voice for a genuine native accent. Otherwise fall
    // back to reading the Roman transliteration with an
    // English voice, so playback is never silent even when
    // the device has no voice for this language installed.
    const matchedVoice = findVoiceForLanguage(id);

    const text = matchedVoice && nativeText.trim()
        ? nativeText
        : romanText;

    console.log(
        "[speak] no recording, language =", id,
        "| using voice =", matchedVoice ? matchedVoice.name + " (" + matchedVoice.lang + ")" : "en fallback",
        "| text =", text
    );

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1;

    if (matchedVoice) {
        utterance.voice = matchedVoice;
        utterance.lang = matchedVoice.lang;
    } else {
        utterance.lang = "en-US";

        // Pick an installed English voice when available.
        const voices = window.speechSynthesis.getVoices();
        const englishVoice =
            bestVoice(voices.filter(v => /^en(-|$)/i.test(v.lang))) ||
            voices.find(v => /english/i.test(v.name));

        if (englishVoice) {
            utterance.voice = englishVoice;
        }
    }

    let speechStarted = false;

    utterance.onstart = () => {
        speechStarted = true;
        speakBtn.classList.add("speaking");
    };

    utterance.onend = () => {
        speakBtn.classList.remove("speaking");
    };

    utterance.onerror = (err) => {
        console.log("[speak] speechSynthesis event:", err.error);

        speakBtn.classList.remove("speaking");

        // Chrome sometimes reports canceled/interrupted as an error
        // even when the speech has already played.
        if (
            speechStarted ||
            err.error === "canceled" ||
            err.error === "interrupted"
        ) {
            return;
        }

        showToast("Couldn't play audio — try again", true);
    };

    // Tell the visitor once that this is a computer voice
    if (!computerVoiceNoticeShown) {
        computerVoiceNoticeShown = true;
        showToast("This word is played by a computer voice. Recorded voices are being added.");
    }

    // Avoid the Chrome/Edge cancel()+speak() race only when
    // something is already playing.
    if (
        window.speechSynthesis.speaking ||
        window.speechSynthesis.pending
    ) {
        window.speechSynthesis.cancel();
        setTimeout(() => {
            window.speechSynthesis.speak(utterance);
        }, 80);
    } else {
        window.speechSynthesis.speak(utterance);
    }
}


// Pronounce button: recording first, computer voice if there is none
function playPronunciation(speakBtn, romanText, nativeText) {

    tryPlayRecording(id, romanText, speakBtn).then((played) => {

        if (!played) {
            speakWithBrowserVoice(speakBtn, romanText, nativeText);
        }

    });
}

let learnState = {
    greetings: [],
    numbers: [],
    common_words: {},
    phrases: [],
    activeCategory: ""
};

// Moved up from later in the file: this must be initialized before
// renderLearningSection() -> setupDelegatedButtons() runs during the
// top-level module execution, otherwise it's accessed while still in
// the temporal dead zone (ReferenceError).
let delegatedButtonsBound = false;

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
    alert("Language not found.");
    throw new Error("No ID Found");
}

const docRef = doc(db, "languages", id);
console.time("Firebase");

const docSnap = await getDoc(docRef);

console.timeEnd("Firebase");
// yahan se saare
// document.getElementById(...)
// wale code start hote hain

// last line ke baad

if (!docSnap.exists()) {

    document.body.innerHTML =
        "<h1 style='text-align:center;margin-top:100px;'>Language not found.</h1>";

} else {

    const data = docSnap.data();
    console.log(data);

    trackView({
      type: "language",
      id: id,
      title: data.name,
      image: data.image || "",
      url: `language_detail.html?id=${id}`
    });

    // =========================
    // PAGE TITLE
    // =========================

    document.title = `${data.name} | UniCulture`;

    // =========================
    // HERO
    // =========================

    setText("name", data.name);

    setText("subtitle", `A Proud Language of ${data.province}`);

    // Native Script

const nativeScripts = {
    "balochi": "بلوچی",
    "punjabi": "پنجابی",
    "sindhi": "سنڌي",
    "pashto": "پشتو",
    "saraiki": "سرائیکی",
    "urdu": "اردو",
    "kashmiri": "کشمیری",
    "hindko": "ہندکو",
    "shina": "شینا",
    "balti": "بلتی",
    "burushaski": "بروشسکی",
    "wakhi": "وخی"
};

// Use the document id (the URL "?id=" param) as the primary key
// instead of data.name. The id is guaranteed to exactly match one
// of the keys above (it's literally the Firestore doc id used when
// seeding — see seed-languages.js / seed-language-family.js), while
// data.name is free-typed text that can carry stray spaces or typos
// (this was the actual cause of Kashmiri falling through to the
// data.script fallback and overflowing the hero box).
const languageKeyFromId = String(id || "").trim().toLowerCase();
const languageKeyFromName = String(data.name || "").trim().toLowerCase();

setText(
    "native-script",
    nativeScripts[languageKeyFromId] ||
    nativeScripts[languageKeyFromName] ||
    data.script
);

    // document.getElementById("hero").style.backgroundImage =
//     `url('${data.image}')`;

    // =========================
    // OVERVIEW
    // =========================

    setText("description", data.description);

    // =========================
    // QUICK FACTS
    // =========================

    document.getElementById("province").textContent =
        `${data.province} (${data.region})`;

    document.getElementById("script").textContent =
        data.script;

    document.getElementById("speakers").textContent =
        data.speakers;

    document.getElementById("family").textContent =
        data.language_family || "Coming Soon";

    // =========================
    // HISTORY
    // =========================

    document.getElementById("history").textContent =
        data.history;

    // =========================
    // LITERATURE
    // =========================

    document.getElementById("literature").textContent =
        data.literature;

    document.getElementById("people").textContent =
        data.notable_people;

    // =========================
    // CULTURE
    // =========================

    document.getElementById("practice").textContent =
        data.cultural_practices;

    document.getElementById("food").textContent =
        data.traditional_food;

    document.getElementById("music").textContent =
        data.music_dance;

    // =========================
    // FUN FACT
    // =========================

    document.getElementById("funfact").textContent =
        data.fun_fact;

    // =========================
    // LEARN THIS LANGUAGE
    // =========================

    renderLearningSection(data.language_learning || null);

    function setText(id, value) {
    const el = document.getElementById(id);

    if (!el) {
        console.log("Missing HTML element:", id);
        return;
    }

    el.textContent = value ?? "";
}
}




// ============================================================
// FIRESTORE DATA → ARRAY CONVERTER
// ============================================================

function toArray(value) {
    if (Array.isArray(value)) {
        return value;
    }

    if (value && typeof value === "object") {
        return Object.values(value);
    }

    return [];
}


// ============================================================
// MAIN LEARNING SECTION
// ============================================================

function renderLearningSection(learning) {

    const greetingsBlock = document.getElementById("learnGreetingsBlock");
    const numbersBlock = document.getElementById("learnNumbersBlock");
    const wordsBlock = document.getElementById("learnWordsBlock");
    const phrasesBlock = document.getElementById("learnPhrasesBlock");
    const searchWrap = document.querySelector(".learn-search-wrap");
    const unavailable = document.getElementById("learnUnavailable");

    console.log("LANGUAGE LEARNING DATA:", learning);

    if (!learning) {

        [greetingsBlock, numbersBlock, wordsBlock, phrasesBlock, searchWrap]
            .forEach(el => {
                if (el) el.style.display = "none";
            });

        if (unavailable) {
            unavailable.style.display = "block";
        }

        return;
    }


    // =========================
    // NORMALIZE DATA
    // =========================

    learnState.greetings = toArray(learning.greetings);

    learnState.numbers = toArray(learning.numbers);

    learnState.phrases = toArray(learning.phrases);


    // =========================
    // COMMON WORDS
    // =========================

    learnState.common_words = {};

    if (
        learning.common_words &&
        typeof learning.common_words === "object"
    ) {

        Object.entries(learning.common_words).forEach(
            ([category, items]) => {

                learnState.common_words[category] =
                    toArray(items);

            }
        );

    }


    console.log("Greetings:", learnState.greetings);
    console.log("Numbers:", learnState.numbers);
    console.log("Common Words:", learnState.common_words);
    console.log("Phrases:", learnState.phrases);


    // =========================
    // CATEGORY
    // =========================

    const categoryKeys =
        Object.keys(learnState.common_words);

    learnState.activeCategory =
        categoryKeys.includes("people")
            ? "people"
            : (categoryKeys[0] || "");


    // =========================
    // RENDER
    // =========================

    renderCategoryTabs(categoryKeys);

    renderGreetings(learnState.greetings);

    renderNumbers(learnState.numbers);

    renderWords(
        learnState.common_words[learnState.activeCategory] || []
    );

    renderPhrases(learnState.phrases);

    setupSearch();

    setupDelegatedButtons();
}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(str) {

    const div = document.createElement("div");

    div.textContent = str ?? "";

    // div.innerHTML escapes & < > but NOT quote characters, which is
    // unsafe when this value is placed inside a quoted HTML attribute
    // like data-copy="..." — escape those too so the attribute can
    // never be broken out of by the source text.
    return div.innerHTML
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}


// ============================================================
// NOTE
// ============================================================

function noteHTML(note) {

    if (!note) {
        return "";
    }

    return `
        <div class="learn-card-note">
            ℹ️ ${escapeHTML(note)}
        </div>
    `;
}


// ============================================================
// WORD CARD
// ============================================================

function learnCardHTML(item) {

    return `
        <div class="learn-card">

            <div class="learn-card-native">
                ${escapeHTML(item.native)}
            </div>

            <div class="learn-card-roman">
                ${escapeHTML(item.roman)}
            </div>

            <div class="learn-card-english">
                ${escapeHTML(item.english)}
            </div>

            ${noteHTML(item.note)}

            <div class="learn-card-footer">

                <button
                    type="button"
                    class="learn-speak-btn"
                    data-speak="${escapeHTML(item.roman || item.native)}"
                    data-speak-native="${escapeHTML(item.native || "")}"
                    title="Pronounce"
                >
                    🔊
                </button>

                <button
                    type="button"
                    class="learn-copy-btn"
                    data-copy="${escapeHTML(item.native)}"
                >
                    Copy
                </button>

            </div>

        </div>
    `;
}


// ============================================================
// GREETINGS
// ============================================================

function renderGreetings(list) {

    const el = document.getElementById("learnGreetings");

    if (!el) return;

    el.innerHTML = list
        .map(learnCardHTML)
        .join("");

    toggleBlockVisibility(
        "learnGreetingsBlock",
        list.length
    );
}


// ============================================================
// NUMBERS
// ============================================================

function renderNumbers(list) {

    const el = document.getElementById("learnNumbers");

    if (!el) return;

    el.innerHTML = list
        .map(item => {

            return `
                <div class="learn-number-card">

                    <div class="learn-number-digit">
                        ${escapeHTML(item.number)}
                    </div>

                    <div class="learn-number-native">
                        ${escapeHTML(item.native)}
                    </div>

                    <div class="learn-number-roman">
                        ${escapeHTML(item.roman)}
                    </div>

                    <div class="learn-number-english">
                        ${escapeHTML(item.english)}
                    </div>

                </div>
            `;

        })
        .join("");

    toggleBlockVisibility(
        "learnNumbersBlock",
        list.length
    );
}


// ============================================================
// CATEGORY TABS
// ============================================================

function renderCategoryTabs(categoryKeys) {

    const el = document.getElementById(
        "learnCategoryTabs"
    );

    if (!el) return;


    if (!categoryKeys.length) {

        el.innerHTML = "";

        return;
    }


    el.innerHTML = categoryKeys
        .map(key => {

            return `
                <button
                    class="learn-tab ${
                        key === learnState.activeCategory
                            ? "active"
                            : ""
                    }"
                    data-category="${escapeHTML(key)}"
                >
                    ${CATEGORY_LABELS[key] || key}
                </button>
            `;

        })
        .join("");


    el.querySelectorAll(".learn-tab")
        .forEach(btn => {

            btn.addEventListener(
                "click",
                () => {

                    learnState.activeCategory =
                        btn.dataset.category;


                    el.querySelectorAll(".learn-tab")
                        .forEach(b =>
                            b.classList.remove("active")
                        );


                    btn.classList.add("active");


                    const search =
                        document.getElementById(
                            "learnSearch"
                        );

                    if (search) {
                        search.value = "";
                    }


                    renderWords(
                        learnState.common_words[
                            learnState.activeCategory
                        ] || []
                    );

                }
            );

        });
}


// ============================================================
// COMMON WORDS
// ============================================================

function renderWords(list) {

    const el =
        document.getElementById("learnWords");

    if (!el) return;

    el.innerHTML = list
        .map(learnCardHTML)
        .join("");

    toggleBlockVisibility(
        "learnWordsBlock",
        list.length
    );
}


// ============================================================
// PHRASES
// ============================================================

function renderPhrases(list) {

    const el =
        document.getElementById("learnPhrases");

    if (!el) return;


    el.innerHTML = list
        .map(item => {

            return `
                <div class="learn-phrase-card">

                    <div class="learn-phrase-text">

                        <div class="learn-phrase-english">
                            ${escapeHTML(item.english)}
                        </div>

                        <div class="learn-phrase-native">
                            ${escapeHTML(item.native)}
                        </div>

                        <div class="learn-phrase-roman">
                            ${escapeHTML(item.roman)}
                        </div>

                        ${noteHTML(item.note)}

                    </div>


                    <div class="learn-btn-row">

                        <button
                            type="button"
                            class="learn-speak-btn"
                            data-speak="${escapeHTML(item.roman || item.native)}"
                            data-speak-native="${escapeHTML(item.native || "")}"
                        >
                            🔊
                        </button>

                        <button
                            type="button"
                            class="learn-copy-btn"
                            data-copy="${escapeHTML(item.native)}"
                        >
                            Copy
                        </button>

                    </div>

                </div>
            `;

        })
        .join("");


    toggleBlockVisibility(
        "learnPhrasesBlock",
        list.length
    );
}


// ============================================================
// SHOW / HIDE BLOCK
// ============================================================

function toggleBlockVisibility(blockId, count) {

    const block =
        document.getElementById(blockId);

    if (!block) return;

    block.style.display =
        count > 0 ? "" : "none";
}


// ============================================================
// SEARCH MATCH
// ============================================================

function matchesQuery(item, query) {

    return (
        String(item.english || "")
            .toLowerCase()
            .includes(query)
        ||

        String(item.roman || "")
            .toLowerCase()
            .includes(query)
        ||

        String(item.native || "")
            .toLowerCase()
            .includes(query)
    );
}


// ============================================================
// SEARCH
// ============================================================

function setupSearch() {

    const input =
        document.getElementById("learnSearch");

    const countEl =
        document.getElementById(
            "learnSearchCount"
        );

    const emptyEl =
        document.getElementById(
            "learnEmpty"
        );

    const tabsEl =
        document.getElementById(
            "learnCategoryTabs"
        );


    if (!input) return;


    input.addEventListener(
        "input",
        () => {

            const query =
                input.value
                    .trim()
                    .toLowerCase();


            // =========================
            // EMPTY SEARCH
            // =========================

            if (!query) {

                countEl.textContent = "";

                emptyEl.style.display = "none";

                tabsEl.style.display = "";


                renderGreetings(
                    learnState.greetings
                );

                renderNumbers(
                    learnState.numbers
                );

                renderWords(
                    learnState.common_words[
                        learnState.activeCategory
                    ] || []
                );

                renderPhrases(
                    learnState.phrases
                );

                return;
            }


            // =========================
            // SEARCH MODE
            // =========================

            tabsEl.style.display = "none";


            const filteredGreetings =
                learnState.greetings
                    .filter(i =>
                        matchesQuery(i, query)
                    );


            const filteredNumbers =
                learnState.numbers
                    .filter(i =>
                        matchesQuery(i, query)
                    );


            const filteredPhrases =
                learnState.phrases
                    .filter(i =>
                        matchesQuery(i, query)
                    );


            let filteredWords = [];


            Object.values(
                learnState.common_words
            ).forEach(arr => {

                filteredWords =
                    filteredWords.concat(
                        arr.filter(i =>
                            matchesQuery(i, query)
                        )
                    );

            });


            renderGreetings(
                filteredGreetings
            );

            renderNumbers(
                filteredNumbers
            );

            renderWords(
                filteredWords
            );

            renderPhrases(
                filteredPhrases
            );


            const total =
                filteredGreetings.length +
                filteredNumbers.length +
                filteredWords.length +
                filteredPhrases.length;


            countEl.textContent =
                `${total} result${
                    total === 1 ? "" : "s"
                } found`;


            emptyEl.style.display =
                total === 0
                    ? "block"
                    : "none";

        }
    );
}


// ============================================================
// TOAST NOTIFICATION
// ============================================================

function ensureToastEl() {

    let toast = document.getElementById("uc-toast");

    if (toast) return toast;

    toast = document.createElement("div");
    toast.id = "uc-toast";

    toast.style.cssText = `
        position: fixed;
        left: 50%;
        bottom: 32px;
        transform: translate(-50%, 20px);
        background: #2d5a27;
        color: #fff;
        padding: 12px 22px;
        border-radius: 10px;
        font-size: 14px;
        font-family: Arial, sans-serif;
        box-shadow: 0 8px 20px rgba(0,0,0,.18);
        opacity: 0;
        pointer-events: none;
        transition: opacity .25s ease, transform .25s ease;
        z-index: 9999;
    `;

    document.body.appendChild(toast);

    return toast;
}

let toastTimer = null;

function showToast(message, isError = false) {

    const toast = ensureToastEl();

    toast.textContent = message;
    toast.style.background = isError ? "#a33" : "#2d5a27";

    // Force reflow so the transition re-triggers on repeat clicks
    void toast.offsetWidth;

    toast.style.opacity = "1";
    toast.style.transform = "translate(-50%, 0)";

    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translate(-50%, 20px)";
    }, 1600);
}


// ============================================================
// COPY + SPEAK BUTTONS
// ============================================================

function setupDelegatedButtons() {

    if (delegatedButtonsBound) return;

    delegatedButtonsBound = true;


    document.addEventListener(
        "click",
        (e) => {


            // =========================
            // COPY
            // =========================

            const copyBtn =
                e.target.closest(
                    ".learn-copy-btn"
                );


            if (copyBtn) {

                const text =
                    copyBtn.dataset.copy || "";

                console.log("[copy] button clicked, text =", text);

                if (!text) {
                    console.log("[copy] no data-copy value found on button — nothing to copy");
                }


                const showCopied = () => {

                    const original =
                        copyBtn.textContent;


                    copyBtn.textContent =
                        "Copied!";


                    copyBtn.classList.add(
                        "copied"
                    );

                    showToast(`Copied "${text}" to clipboard`);


                    setTimeout(() => {

                        copyBtn.textContent =
                            original;

                        copyBtn.classList.remove(
                            "copied"
                        );

                    }, 1500);

                };


                const showFailed = () => {

                    copyBtn.textContent =
                        "Failed";

                    showToast("Couldn't copy — try again", true);

                    setTimeout(() => {

                        copyBtn.textContent =
                            "Copy";

                    }, 1500);

                };


                const fallbackCopy = () => {

                    try {

                        const textarea =
                            document.createElement("textarea");

                        textarea.value = text;

                        textarea.style.position = "fixed";
                        textarea.style.top = "-9999px";
                        textarea.style.left = "-9999px";

                        document.body.appendChild(textarea);

                        textarea.focus();
                        textarea.select();

                        const successful =
                            document.execCommand("copy");

                        document.body.removeChild(textarea);

                        if (successful) {
                            showCopied();
                        } else {
                            showFailed();
                        }

                    } catch (err) {

                        console.log(
                            "Fallback copy error:",
                            err
                        );

                        showFailed();
                    }

                };


                if (
                    navigator.clipboard &&
                    navigator.clipboard.writeText &&
                    window.isSecureContext
                ) {

                    console.log("[copy] using navigator.clipboard.writeText");

                    navigator.clipboard
                        .writeText(text)
                        .then(() => {
                            console.log("[copy] clipboard.writeText succeeded");
                            showCopied();
                        })
                        .catch((err) => {

                            console.log(
                                "Clipboard API failed, using fallback:",
                                err
                            );

                            fallbackCopy();

                        });

                } else {

                    console.log("[copy] clipboard API unavailable, using fallback (execCommand)");

                    fallbackCopy();

                }


                return;
            }


            // =========================
            // SPEAK
            // =========================

            const speakBtn =
                e.target.closest(".learn-speak-btn");

            if (speakBtn) {

                const romanText = speakBtn.dataset.speak || "";
                const nativeText = speakBtn.dataset.speakNative || "";

                if (!romanText.trim() && !nativeText.trim()) {
                    console.log("[speak] no text found");
                    return;
                }

                playPronunciation(speakBtn, romanText, nativeText);

                return;
            }
                    }
    );
}