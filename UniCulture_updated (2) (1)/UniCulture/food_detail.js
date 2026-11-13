import { db } from "./firebase-config.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import { trackView } from "./track-view.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
    alert("Food item not found");
    throw new Error("No document ID");
}

// Same Cloudflare Worker (Groq) proxy already used by the AI guide chatbot
// (see ai-guide.js). Reusing it here so we don't need a second API key.
const WORKER_URL = "https://uniculture-ai.alitareen01981.workers.dev";

// =====================================================================
// CURATED RECIPE VIDEOS
// Ms ne kaha tha har food ke page pe uski recipe ki YouTube link laga
// dein. Firestore documents me har food ke liye alag field add karna
// mushkil tha (database live hai), isliye yahan par ek curated list
// bana di hai jo dish ke naam se match karke sahi video dikhati hai.
// Keys ko lowercase aur sabse specific (lamba) pehle rakha gaya hai
// taake "sindhi biryani" pehle match ho "biryani" se pehle.
// =====================================================================

const RECIPE_VIDEOS = [
    { keywords: ["sindhi biryani"], videoId: "C7Je_4rdUlE", channel: "Food Fusion" },
    { keywords: ["chicken biryani", "beef biryani", "mutton biryani", "biryani"], videoId: "GZm7cmKK1bk", channel: "Food Fusion" },
    { keywords: ["chapli kabab", "chapli kebab"], videoId: "mDVJDNrnm7w", channel: "Food Fusion" },
    { keywords: ["seekh kabab", "seekh kebab"], videoId: "ov13Yr3MLCQ", channel: "Food Fusion" },
    { keywords: ["nihari"], videoId: "mZOXDAvMCM4", channel: "Food Fusion" },
    { keywords: ["haleem"], videoId: "8NnEogb5IuI", channel: "Food Fusion" },
    { keywords: ["sajji"], videoId: "lvW7zjrYc6g", channel: "Food Fusion" },
    { keywords: ["sarson", "saag"], videoId: "XH2_pWrguvI", channel: "Food Fusion" },
    { keywords: ["karahi"], videoId: "X_h9QgnY2lQ", channel: "Food Fusion" },
    { keywords: ["halwa puri", "halwa poori", "halwa puree"], videoId: "VMCj22_SewE", channel: "Food Fusion" },
];

function findRecipeVideo(name) {
    if (!name) return null;
    const lower = name.toLowerCase();
    for (const entry of RECIPE_VIDEOS) {
        for (const kw of entry.keywords) {
            if (lower.includes(kw)) {
                return { videoId: entry.videoId, channel: entry.channel };
            }
        }
    }
    return null;
}

// Agar Firestore document me kabhi khud ka "youtube_link" field add ho
// jaye (admin/contribute panel se), to wo curated list se pehle use hoga.
function extractYouTubeId(url) {
    if (!url) return null;
    const patterns = [
        /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
        /(?:youtu\.be\/)([\w-]{11})/,
        /(?:youtube\.com\/embed\/)([\w-]{11})/,
        /(?:youtube\.com\/shorts\/)([\w-]{11})/
    ];
    for (const p of patterns) {
        const m = url.match(p);
        if (m) return m[1];
    }
    return null;
}

function renderVideoArea(data) {
    const videoArea = document.getElementById("videoArea");

    // Priority 1: a youtube_link field manually added on the Firestore doc
    const manualId = extractYouTubeId(data.youtube_link);
    // Priority 2: curated match by dish name
    const curated = findRecipeVideo(data.name);

    const videoId = manualId || (curated ? curated.videoId : null);

    if (videoId) {
        videoArea.innerHTML = `
            <div class="video-embed-wrap">
                <iframe
                    src="https://www.youtube.com/embed/${videoId}"
                    title="${data.name || "Recipe"} video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    loading="lazy">
                </iframe>
            </div>
            <p class="video-caption">
                🎥 Recipe video via
                <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" rel="noopener">YouTube</a>
            </p>
        `;
    } else {
        // Fallback: no exact match found, offer a live YouTube search instead
        const query = encodeURIComponent(`${data.name || ""} recipe Pakistani`);
        videoArea.innerHTML = `
            <div class="video-fallback">
                <div class="fv-icon">🎬</div>
                <p>We don't have a recipe video linked for this dish yet.
                Search YouTube to find one.</p>
                <a class="watch-btn" href="https://www.youtube.com/results?search_query=${query}" target="_blank" rel="noopener">
                    ▶ Search on YouTube
                </a>
            </div>
        `;
    }
}

// =====================================================================
// UNIVERSAL AI RECIPE GENERATOR
// Pehle yeh generator sirf current page ke dish (data.name) tak locked
// tha — har food page ka apna alag "chatbot" jaisa lagta tha jo sirf
// usi dish ki recipe deta tha (e.g. biryani page = sirf biryani).
//
// Ab ismein dish ko hardcode nahi kiya jata. User sirf apne available
// ingredients batata hai, aur AI khud decide karta hai ke inhi
// ingredients se konsi traditional Pakistani dish ban sakti hai (chahe
// wo is page ki dish ho ya koi bhi dosri), phir uski poori recipe
// generate karta hai. Isi ek hi function/prompt ko har food page
// (food_detail.html, sirf ?id= change hota hai) automatically use
// karta hai — is liye ab yeh sach me "universal" generator hai, alag
// alag dish ke liye alag chatbot rakhne ki zaroorat nahi.
// Same worker jo ai-guide.js use karta hai, taake ek hi API/key reuse ho.
// =====================================================================

function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// Plain text AI reply ko readable paragraphs/lines me convert karta hai,
// aur "Ingredients:" / "Steps:" jese headings ko bold kar deta hai.
function formatRecipeOutput(text) {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

    const html = lines.map((line) => {
        let safe = escapeHtml(line);

        // Bold simple "Heading:" style lines (short line ending with colon)
        if (/^[A-Za-z][A-Za-z\s]{2,25}:$/.test(line)) {
            safe = `<strong>${safe}</strong>`;
        }
        // Bold known headings even when the value sits on the same line,
        // e.g. "Dish: Chicken Biryani" -> only "Dish:" becomes bold.
        else if (/^(Dish|Ingredients|Steps):/i.test(line)) {
            safe = safe.replace(/^(Dish|Ingredients|Steps):/i, "<strong>$1:</strong>");
        }

        return `<p>${safe}</p>`;
    }).join("");

    return html || `<p>${escapeHtml(text)}</p>`;
}

function initRecipeGenerator(data) {

    const input = document.getElementById("ingredientsInput");
    const btn = document.getElementById("generateRecipeBtn");
    const resultBox = document.getElementById("recipeGenResult");

    if (!input || !btn || !resultBox) return;

    btn.addEventListener("click", async () => {

        const ingredients = input.value.trim();

        if (!ingredients) {
            resultBox.innerHTML = `<div class="recipe-gen-error">Please enter your ingredients first, then click Generate Recipe.</div>`;
            return;
        }

        btn.disabled = true;
        resultBox.innerHTML = `
            <div class="recipe-gen-loading">
                <span class="recipe-gen-spinner"></span>
                Generating your recipe...
            </div>
        `;

        const prompt = `You are a Pakistani cooking assistant on a cultural heritage website.
The user has told you the ingredients they currently have at home: ${ingredients}.

Decide which ONE traditional Pakistani dish is the best match for these ingredients — it can be any Pakistani dish at all (for example biryani, chapli kabab, seekh kabab, nihari, haleem, sajji, saag, karahi, halwa puri, or any other regional dish), not limited to any single dish. Pick whichever dish these ingredients suit best, using as many of them as possible.

Then give a practical, home-cookable recipe for that dish. If something essential for that dish is missing, briefly mention what would help, but still provide the full recipe.

Format your answer exactly like this:
Dish: (name of the dish you chose)
Ingredients: (list)
Steps: (numbered or short steps)

Keep the answer in clear English, straightforward and easy to follow. Don't add greetings or disclaimers.`;

        let finalReply;

        try {

            const res = await fetch(WORKER_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [{ role: "user", content: prompt }] })
            });

            if (!res.ok) throw new Error("Bad response from server");

            const resData = await res.json();
            finalReply = resData.reply || "";

            if (!finalReply.trim()) {
                throw new Error("Empty reply");
            }

            resultBox.innerHTML = `
                <div class="recipe-gen-output">${formatRecipeOutput(finalReply)}</div>
                <p class="recipe-gen-note">✨ Recipe generated by AI — feel free to adjust ingredients to your taste.</p>
            `;

        } catch (err) {

            resultBox.innerHTML = `<div class="recipe-gen-error">Couldn't generate a recipe right now. Please try again in a moment.</div>`;

        } finally {
            btn.disabled = false;
        }

    });

}

const docRef = doc(db, "food", id);
const docSnap = await getDoc(docRef);

if (!docSnap.exists()) {

    document.body.innerHTML = `
    <h1 style="text-align:center;margin-top:100px;">
        Food item not found
    </h1>`;

}
else{

const data = docSnap.data();

console.log(data);

trackView({
  type: "food",
  id: id,
  title: data.name,
  image: data.image || "",
  url: `food_detail.html?id=${id}`
});

document.title=`${data.name} | UniCulture`;

// HERO

document.getElementById("name").textContent=
data.name || "";

document.getElementById("breadcrumbName").textContent=
data.name || "Dish";

document.getElementById("regionBadge").textContent=
data.region ? `📍 ${data.region}` : "📍 Pakistan";

if (data.image) {
    document.getElementById("hero").style.backgroundImage =
        `url('${data.image}')`;
}

// OVERVIEW

document.getElementById("description").textContent=
data.description || "";

// QUICK FACTS

document.getElementById("region2").textContent=
data.region || "";

document.getElementById("origin").textContent=
data.origin || "";

document.getElementById("features").textContent=
data.main_ingredients || "";

document.getElementById("type").textContent=
data.taste || "";

// HISTORY

document.getElementById("history").textContent=
data.preparation_method || "";

// CULTURAL SIGNIFICANCE

document.getElementById("significance").textContent=
data.cultural_importance || "";

// OCCASIONS

document.getElementById("activities").textContent=
data.occasion || "";

// FUN FACT

document.getElementById("funfact").textContent=
data.popular_places || "";

// RECIPE VIDEO

renderVideoArea(data);

// AI RECIPE GENERATOR

initRecipeGenerator(data);

}