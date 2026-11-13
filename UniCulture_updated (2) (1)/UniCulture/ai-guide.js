// Real AI guide, powered by Groq — called through a Cloudflare Worker proxy
// so the API key never sits in browser-visible code. See
// cloudflare-worker.js for the proxy you need to deploy.
//
// Chat sessions live in Firestore (private per logged-in user, synced across
// devices, invisible to admin) when signed in, and fall back to localStorage
// (this browser only) for guests who aren't logged in.

import { auth, db } from "./firebase-config.js";

import { escapeHTML } from "./utils.js";

import { showToast } from "./toast.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const WORKER_URL = "https://uniculture-ai.alitareen01981.workers.dev";

const SUGGESTIONS = [
  { icon: "🧵", text: "Ajrak ke baare mein batao" },
  { icon: "🪁", text: "Basant kya hai?" },
  { icon: "🍽️", text: "Behtareen khane kaunse hain?" },
  { icon: "🏔️", text: "Hunza ke baare mein batao" }
];

const GREETING = "Assalam-o-Alaikum! Main UniCulture guide hoon. Mujh se Pakistan ki heritage, khana, tehwar, music, ya languages ke baare mein kuch bhi pooch sakte hain.";

const SESSIONS_KEY = "uniculture_ai_sessions";
const ACTIVE_KEY = "uniculture_ai_active_session";

const messagesEl = document.getElementById("aiMessages");
const suggestionsEl = document.getElementById("aiSuggestions");
const form = document.getElementById("aiGuideForm");
const input = document.getElementById("aiGuideInput");
const newChatBtn = document.getElementById("aiNewChatBtn");
const sidebarToggle = document.getElementById("aiSidebarToggle");
const sidebar = document.getElementById("aiSidebar");
const historyPanel = document.getElementById("aiHistoryPanel");

let sessions = [];
let activeId = null;
let isBusy = false; // true while the AI is writing a reply
let currentUser = null; // null = guest (localStorage), set = signed in (Firestore)


/* ---------- SITE PAGES, REPLY STYLE AND CHAT TITLES ---------- */

// What each UniCulture page is for. Used when a visitor pastes a link to one of our pages.
const PAGE_INFO = {
  "index.html": { name: "Home", desc: "is the main landing page of UniCulture, which introduces the platform and links to all its sections" },
  "heritage.html": { name: "Heritage", desc: "lists the heritage sites of Pakistan with photos and details, and visitors can open a site and save it as a favorite" },
  "festivals.html": { name: "Festivals", desc: "shows the festivals of Pakistan with their details and photos" },
  "food.html": { name: "Traditional Food", desc: "shows the traditional food and dishes of Pakistan with details" },
  "music.html": { name: "Music & Dance", desc: "shows the music and dance traditions of Pakistan" },
  "languages.html": { name: "Languages", desc: "shows the languages spoken in Pakistan with details" },
  "handicrafts.html": { name: "Arts & Handicrafts", desc: "shows the traditional arts and handicrafts of Pakistan" },
  "tourism.html": { name: "Tourism", desc: "shows heritage sites and cultural routes for people who want to travel in Pakistan" },
  "events.html": { name: "Events", desc: "lists festivals and cultural events" },
  "cultural-map.html": { name: "Cultural Map", desc: "is an interactive map of Pakistan's cultural places" },
  "community.html": { name: "Community", desc: "shows photos and stories shared by community members, where logged-in visitors can like and comment" },
  "contribute.html": { name: "Contribute", desc: "is a form where a logged-in visitor can share a photo, story or recipe, which the admin reviews before it appears in the Community" },
  "trip-planner.html": { name: "Trip Planner", desc: "helps visitors plan a trip across Pakistani cities" },
  "culture.html": { name: "Culture", desc: "gives an overview of the culture of Pakistan" },
  "about.html": { name: "About", desc: "explains what the UniCulture project is about" },
  "categories.html": { name: "Categories", desc: "lists the cultural categories visitors can explore" },
  "profile.html": { name: "My Dashboard", desc: "is the visitor's personal dashboard with their favorites, contributions and recent activity" },
  "quiz.html": { name: "Culture Quiz", desc: "is a short quiz that tells the visitor which culture matches them" },
  "city.html": { name: "City Guide", desc: "is a guide page for one Pakistani city" },
  "ai-guide.html": { name: "AI Guide", desc: "is this AI chat page where visitors ask questions about Pakistan's culture" },
  "auth.html": { name: "Login", desc: "is the login and signup page" }
};

// Hidden instructions added to the visitor's latest message (the visitor never sees them)
const STYLE_NOTE =
  "Instructions for you (never mention or quote them): " +
  "If the visitor writes in English, answer in English. " +
  "If the visitor writes in Roman Urdu or Urdu, answer in simple Roman Urdu using Urdu vocabulary " +
  "(Persian and Arabic origin words that Pakistanis use), and do not use Hindi or Sanskrit origin words. " +
  "For example write shukriya, zaban, tareekh, saqafat, mulk, khoobsurat, mashhoor, khaas, ilaqa, lazmi, jashn, mausam, khushi; " +
  "never write dhanyavaad, bhasha, itihas, sanskriti, desh, sundar, prasiddh, vishesh, kshetra, avashyak. " +
  "Keep the answer short and clear. " +
  "To highlight an important word or name use **double asterisks** only, never single asterisks, " +
  "and do not use headings or tables.";


// Finds a link to one of our own pages inside the visitor's message, e.g. http://127.0.0.1:5501/heritage.html
function findSiteLink(text) {

  const match = String(text).match(/([\w-]+\.html)(\?[^\s]*)?/i);
  if (!match) return null;

  const file = match[1].toLowerCase();
  const info = PAGE_INFO[file];
  if (!info) return null;

  let extra = "";

  if (file === "city.html" && match[2]) {
    const id = (new URLSearchParams(match[2]).get("id") || "").replace(/[^\w\s-]/g, "");
    if (id) extra = ` for the city "${id}"`;
  }

  return { file, name: info.name, desc: info.desc, extra };

}


// Adds the hidden instructions (and page info, if the message has a link) to the text sent to the AI
function withInstructions(text) {

  let note = STYLE_NOTE;

  const link = findSiteLink(text);

  if (link) {
    note +=
      ` The visitor shared a link to the UniCulture website's "${link.name}" page${link.extra}. ` +
      `This page ${link.desc}. ` +
      "Explain in two or three short sentences what this page is for and what the visitor can do there, " +
      "then offer to tell them more about that topic. Never say that you cannot open links.";
  }

  return `${text}\n\n[${note}]`;

}


// Quick title shown right after the visitor sends the first message
function quickTitle(text) {

  const link = findSiteLink(text);
  if (link) return `${link.name} page`;

  const clean = String(text).replace(/\s+/g, " ").trim();
  return clean.length > 40 ? clean.slice(0, 40) + "…" : clean;

}


// Turns the AI's answer into a short, clean chat title (empty string if it looks wrong)
function cleanTitle(raw) {

  let title = String(raw || "").split("\n")[0];

  title = title
    .replace(/[*"“”_#`]/g, "")
    .replace(/^(title|chat title)\s*:\s*/i, "")
    .replace(/[.!?:;,\s]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!title || title.length > 40 || title.split(" ").length > 7) return "";

  return title;

}


// Asks the AI for a short meaningful title (2 to 4 words) after the first exchange
async function generateTitle(session, question) {

  try {

    const prompt =
      "Write a short title (2 to 4 words, in English) for a chat that starts with the visitor question below. " +
      "Ignore greetings such as hi or hello and focus on the topic. " +
      "Reply with the title only: no quotes, no asterisks, no full stop.\n\n" +
      `Question: ${question.slice(0, 200)}`;

    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: prompt }] })
    });

    if (!res.ok) return;

    const data = await res.json();
    const title = cleanTitle(data.reply);

    if (!title) return;

    session.title = title;
    persistSession(session);
    renderHistoryPanel();

  } catch (error) {
    // Not important: the quick title stays
  }

}


// Shows the bot's text with **bold** and *bold* words as real bold (safe: no innerHTML)
function renderRichText(el, rawText) {

  const text = String(rawText)
    .replace(/^\s{0,3}#{1,6}\s*/gm, "")
    .replace(/^\s*[*-]\s+/gm, "• ");

  el.textContent = "";

  text.split(/(\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g).forEach((part) => {

    if (!part) return;

    const match = part.match(/^\*\*([^*\n]+)\*\*$/) || part.match(/^\*([^*\n]+)\*$/);

    if (match) {
      const strong = document.createElement("strong");
      strong.textContent = match[1];
      el.appendChild(strong);
    } else {
      el.appendChild(document.createTextNode(part));
    }

  });

}

function setBubbleText(bubble, text, sender) {

  if (sender === "bot") {
    renderRichText(bubble, text);
  } else {
    bubble.textContent = text;
  }

}


/* ---------- LOCAL (GUEST) STORAGE ---------- */

function loadLocalSessions() {
  try {
    return JSON.parse(localStorage.getItem(SESSIONS_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveLocalSessions() {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (e) {
    // storage full or unavailable — chat still works, just won't persist
  }
}


/* ---------- CLOUD (LOGGED-IN) STORAGE ---------- */
// Path: ai_chats/{uid}/sessions/{sessionId} — only that uid can read/write
// their own sessions once the matching Firestore security rule is in place.

async function loadCloudSessions(uid) {

  try {

    const q = query(collection(db, "ai_chats", uid, "sessions"), orderBy("updatedAt", "desc"));
    const snap = await getDocs(q);

    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  } catch (error) {
    console.error("Could not load cloud chat sessions:", error);
    return [];
  }

}

async function saveCloudSession(session) {

  if (!currentUser) return;

  try {

    await setDoc(doc(db, "ai_chats", currentUser.uid, "sessions", session.id), {
      title: session.title,
      messages: session.messages,
      updatedAt: session.updatedAt
    });

  } catch (error) {
    console.error("Could not save chat session:", error);
  }

}

async function deleteCloudSession(id) {

  if (!currentUser) return;

  try {
    await deleteDoc(doc(db, "ai_chats", currentUser.uid, "sessions", id));
  } catch (error) {
    console.error("Could not delete chat session:", error);
  }

}


/* ---------- STORAGE ROUTER ---------- */
// Every place that used to touch localStorage directly now goes through
// these two, which pick the right backend based on login state.

function persistSession(session) {
  if (currentUser) {
    saveCloudSession(session);
  } else {
    saveLocalSessions();
  }
}

function persistDelete(id) {
  if (currentUser) {
    deleteCloudSession(id);
  } else {
    saveLocalSessions();
  }
}


function getActiveSession() {
  return sessions.find((s) => s.id === activeId);
}

function setActiveId(id) {
  activeId = id;
  if (!currentUser) {
    try {
      localStorage.setItem(ACTIVE_KEY, id);
    } catch (e) {}
  }
}


/* ---------- SESSION MANAGEMENT ---------- */

function createSession() {

  const session = {
    id: "s_" + Date.now(),
    title: "New chat",
    messages: [{ text: GREETING, sender: "bot" }],
    updatedAt: Date.now()
  };

  sessions.unshift(session);
  setActiveId(session.id);
  persistSession(session);

  return session;

}

function ensureActiveSession() {
  let session = getActiveSession();
  if (!session) {
    session = sessions[0] || createSession();
    setActiveId(session.id);
  }
  return session;
}


/* ---------- RENDERING ---------- */

function updateSuggestionsVisibility() {
  const session = getActiveSession();
  const hasStarted = session.messages.length > 1 || input.value.trim().length > 0;
  suggestionsEl.style.display = hasStarted ? "none" : "grid";
}

const ICON_COPY =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>';

const ICON_EDIT =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';

const ICON_CHECK =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';


// The text that gets copied: the bot's **bold** markers are removed
function plainText(text) {

  return String(text)
    .replace(/^\s{0,3}#{1,6}\s*/gm, "")
    .replace(/^\s*[*-]\s+/gm, "• ")
    .replace(/\*\*([^*\n]+)\*\*/g, "$1")
    .replace(/\*([^*\n]+)\*/g, "$1");

}


// Small Copy (and Edit, for the visitor's own messages) buttons under a message
function buildActions(sender) {

  const bar = document.createElement("div");
  bar.className = "ai-msg-actions";

  bar.innerHTML =
    `<button type="button" class="ai-act-btn" data-act="copy" title="Copy" aria-label="Copy message">${ICON_COPY}</button>` +
    (sender === "user"
      ? `<button type="button" class="ai-act-btn" data-act="edit" title="Edit" aria-label="Edit message">${ICON_EDIT}</button>`
      : "");

  return bar;

}


// One message = a row holding the bubble and its buttons
function createMessageRow(text, sender, index) {

  const row = document.createElement("div");
  row.className = `ai-msg-row ai-msg-row-${sender}`;
  row.dataset.index = String(index);

  const bubble = document.createElement("div");
  bubble.className = `ai-msg ai-msg-${sender}`;
  setBubbleText(bubble, text, sender);

  row.appendChild(bubble);

  // No buttons on the very first greeting message
  if (!(sender === "bot" && index === 0)) {
    row.appendChild(buildActions(sender));
  }

  return { row, bubble };

}


function renderMessages(session) {

  messagesEl.innerHTML = "";

  session.messages.forEach((m, index) => {
    messagesEl.appendChild(createMessageRow(m.text, m.sender, index).row);
  });

  messagesEl.scrollTop = messagesEl.scrollHeight;
  updateSuggestionsVisibility();

}

function addMessage(text, sender) {

  const session = getActiveSession();

  const { row, bubble } = createMessageRow(text, sender, session.messages.length);

  messagesEl.appendChild(row);
  messagesEl.scrollTop = messagesEl.scrollHeight;

  session.messages.push({ text, sender });
  session.updatedAt = Date.now();

  // Title the chat after the visitor's first question
  if (sender === "user" && session.title === "New chat") {
    session.title = quickTitle(text);
  }

  persistSession(session);
  updateSuggestionsVisibility();

  return bubble;

}


// ---------- COPY ----------

async function copyText(text) {

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Older browsers: copy through a temporary text box
    try {
      const box = document.createElement("textarea");
      box.value = text;
      box.style.position = "fixed";
      box.style.opacity = "0";
      document.body.appendChild(box);
      box.select();
      const ok = document.execCommand("copy");
      box.remove();
      return ok;
    } catch (fallbackError) {
      return false;
    }
  }

}


async function handleCopy(btn) {

  const row = btn.closest(".ai-msg-row");
  if (!row) return;

  const message = getActiveSession().messages[Number(row.dataset.index)];
  if (!message) return;

  const text = message.sender === "bot" ? plainText(message.text) : message.text;

  const ok = await copyText(text);

  if (!ok) {
    showToast("Could not copy. Please select the text and copy it by hand.", "error");
    return;
  }

  // Show a tick for a moment
  btn.innerHTML = ICON_CHECK;
  btn.classList.add("is-done");

  setTimeout(() => {
    btn.innerHTML = ICON_COPY;
    btn.classList.remove("is-done");
  }, 1500);

}


// ---------- EDIT (visitor's own message) ----------
// Saving an edit removes that message and everything after it, then asks the AI again.

function startEdit(row) {

  if (isBusy) {
    showToast("Please wait until the answer is finished.", "error");
    return;
  }

  const session = getActiveSession();
  const index = Number(row.dataset.index);
  const original = session.messages[index];

  if (!original || original.sender !== "user") return;

  row.classList.add("is-editing");

  row.innerHTML = `
    <textarea class="ai-edit-input" rows="2" aria-label="Edit your message"></textarea>
    <div class="ai-edit-actions">
      <button type="button" class="ai-edit-cancel">Cancel</button>
      <button type="button" class="ai-edit-send">Send</button>
    </div>
  `;

  const area = row.querySelector(".ai-edit-input");
  area.value = original.text;

  const resize = () => {
    area.style.height = "auto";
    area.style.height = Math.min(area.scrollHeight, 200) + "px";
  };

  resize();
  area.focus();
  area.setSelectionRange(area.value.length, area.value.length);

  const sendBtn = row.querySelector(".ai-edit-send");

  // Send works only when the text is not empty AND is different from the original
  const hasChange = () => {
    const now = area.value.trim();
    return now.length > 0 && now !== original.text.trim();
  };

  sendBtn.disabled = true;

  area.addEventListener("input", () => {
    resize();
    sendBtn.disabled = !hasChange();
  });

  const cancel = () => renderMessages(session);

  const send = () => {

    if (!hasChange()) return;

    const newText = area.value.trim();

    // Keep only the messages before the edited one
    session.messages = session.messages.slice(0, index);

    // If the very first question was edited, the chat gets a new title too
    if (!session.messages.some((m) => m.sender === "user")) {
      session.title = "New chat";
      session.titleTried = false;
    }

    session.updatedAt = Date.now();
    persistSession(session);
    renderMessages(session);
    renderHistoryPanel();

    handleUserMessage(newText);

  };

  row.querySelector(".ai-edit-cancel").addEventListener("click", cancel);
  row.querySelector(".ai-edit-send").addEventListener("click", send);

  area.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {
      cancel();
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }

  });

}


// One listener for all Copy and Edit buttons
messagesEl.addEventListener("click", (e) => {

  const btn = e.target.closest(".ai-act-btn");
  if (!btn) return;

  if (btn.dataset.act === "copy") handleCopy(btn);
  if (btn.dataset.act === "edit") startEdit(btn.closest(".ai-msg-row"));

});


function renderSuggestions() {

  suggestionsEl.innerHTML = SUGGESTIONS
    .map((s) => `<button type="button" class="ai-suggestion-chip" data-text="${s.text}"><span>${s.icon}</span> ${s.text}</button>`)
    .join("");

  suggestionsEl.querySelectorAll(".ai-suggestion-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      handleUserMessage(btn.dataset.text);
    });
  });

}

function renderHistoryPanel() {

  if (sessions.length === 0) {
    historyPanel.innerHTML = `<p class="ai-history-empty">No previous chats yet.</p>`;
    return;
  }

  historyPanel.innerHTML = sessions
    .slice()
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map((s) => `
      <div class="ai-history-item ${s.id === activeId ? "active" : ""}" data-id="${escapeHTML(s.id)}">
        <span class="ai-history-title">${escapeHTML(s.title)}</span>
        <button type="button" class="ai-history-delete" data-delete="${escapeHTML(s.id)}" title="Delete chat">🗑️</button>
      </div>
    `)
    .join("");

  historyPanel.querySelectorAll(".ai-history-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      if (e.target.closest(".ai-history-delete")) return;
      switchSession(item.dataset.id);
    });
  });

  historyPanel.querySelectorAll(".ai-history-delete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteSession(btn.dataset.delete);
    });
  });

}


/* ---------- ACTIONS ---------- */

function switchSession(id) {
  setActiveId(id);
  renderMessages(getActiveSession());
  renderHistoryPanel();
  sidebar.classList.remove("open");
}

function deleteSession(id) {

  sessions = sessions.filter((s) => s.id !== id);
  persistDelete(id);

  if (id === activeId) {
    const next = sessions[0] || createSession();
    setActiveId(next.id);
    renderMessages(getActiveSession());
  }

  renderHistoryPanel();

}

newChatBtn.addEventListener("click", () => {
  createSession();
  renderMessages(getActiveSession());
  renderHistoryPanel();
  sidebar.classList.remove("open");
});

sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});


async function sendMessage(text) {

  addMessage(text, "user");
  renderHistoryPanel();

  const typingBubble = document.createElement("div");
  typingBubble.className = "ai-msg ai-msg-bot ai-msg-typing";
  typingBubble.textContent = "Typing…";
  messagesEl.appendChild(typingBubble);
  messagesEl.scrollTop = messagesEl.scrollHeight;

  const chatSession = getActiveSession();
  const firstQuestion = text;
  let failed = false;
  let finalReply;

  try {

    const session = getActiveSession();

    // Send the whole conversation so far (mapped to the API's role format)
    // so the model has context and remembers things like a language switch.
    const conversation = session.messages.map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text
    }));

    // Add the hidden reply-style instructions (and page info) to the latest question only
    const last = conversation[conversation.length - 1];
    if (last && last.role === "user") {
      last.content = withInstructions(last.content);
    }

    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversation })
    });

    if (!res.ok) throw new Error("Bad response from server");

    const data = await res.json();
    finalReply = data.reply || "Sorry, I couldn't generate a response for that.";
    if (!data.reply) failed = true;

  } catch (err) {

    failed = true;
    finalReply = "Sorry, I couldn't connect right now. Please try again in a moment.";

  }

  typingBubble.remove();
  addMessage(finalReply, "bot");

  // After a successful answer, replace the quick title with a short meaningful one.
  // (Only while the chat still has its quick title, so a title is never overwritten twice.)
  const firstUserMessage = chatSession.messages.find((m) => m.sender === "user");

  if (
    !failed &&
    firstUserMessage &&
    !chatSession.titleTried &&
    chatSession.title === quickTitle(firstUserMessage.text)
  ) {
    chatSession.titleTried = true;
    generateTitle(chatSession, firstUserMessage.text);
  }

}


// Only one question at a time: wait until the answer is finished
async function handleUserMessage(text) {

  if (isBusy) return;

  isBusy = true;

  try {
    await sendMessage(text);
  } finally {
    isBusy = false;
  }

}


form.addEventListener("submit", (e) => {

  e.preventDefault();

  if (isBusy) return;

  const text = input.value.trim();
  if (!text) return;

  handleUserMessage(text);
  input.value = "";
  updateSuggestionsVisibility();

});

input.addEventListener("input", updateSuggestionsVisibility);


/* ---------- INIT ---------- */

let initialized = false;

async function initGuest() {

  sessions = loadLocalSessions();
  activeId = localStorage.getItem(ACTIVE_KEY);

  // One-time migration: earlier version stored a single flat chat history
  // under this key. Bring it in as the first session so nothing is lost.
  if (sessions.length === 0) {
    try {
      const oldHistory = JSON.parse(localStorage.getItem("uniculture_ai_chat_history"));
      if (Array.isArray(oldHistory) && oldHistory.length > 0) {
        const firstUserMsg = oldHistory.find((m) => m.sender === "user");
        sessions.push({
          id: "s_" + Date.now(),
          title: firstUserMsg ? (firstUserMsg.text.length > 40 ? firstUserMsg.text.slice(0, 40) + "…" : firstUserMsg.text) : "Previous chat",
          messages: oldHistory,
          updatedAt: Date.now()
        });
        saveLocalSessions();
        localStorage.removeItem("uniculture_ai_chat_history");
      }
    } catch (e) {
      // no old data to migrate, that's fine
    }
  }

  const activeSession = ensureActiveSession();
  renderMessages(activeSession);
  renderHistoryPanel();

}

async function initCloud(uid) {

  sessions = await loadCloudSessions(uid);

  if (sessions.length === 0) {
    createSession(); // also persists the first greeting to Firestore
  } else {
    activeId = sessions[0].id;
  }

  renderMessages(getActiveSession());
  renderHistoryPanel();

}

onAuthStateChanged(auth, async (user) => {

  currentUser = user;

  messagesEl.innerHTML = `<div class="ai-msg ai-msg-bot">Loading your chats…</div>`;

  if (user) {
    await initCloud(user.uid);
  } else {
    await initGuest();
  }

  if (!initialized) {
    renderSuggestions();
    initialized = true;
  }

});