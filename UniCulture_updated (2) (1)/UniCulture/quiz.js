import { auth } from "./firebase-config.js";
import { logActivity } from "./activity-log.js";

// ============================================================
// MULTIPLE QUIZZES -- a new one is picked/shown each time so
// repeat visitors keep getting a fresh experience.
// Each quiz's options are index-matched (0-4) to its RESULTS,
// exactly like the original single quiz, so scoring stays simple.
// ============================================================

const QUIZZES = [

  {
    id: "region",
    icon: "\u{1F5FA}\u{FE0F}",
    title: "Which Pakistan lives in you?",
    subtitle: "Five questions, one shareable card. Not science \u2014 just a mirror.",
    exploreLabel: "Explore this culture \u2192",
    questions: [
      {
        text: "Pick your ideal weekend:",
        options: [
          "A wedding with 300 relatives",
          "A poetry mushaira by the river",
          "A hike then guests over for tea",
          "A desert drive at sunset",
          "Reading in an orchard, alone"
        ]
      },
      {
        text: "Your comfort meal is\u2026",
        options: [
          "Butter chicken and naan",
          "Sindhi biryani, extra spice",
          "Chapli kebab with fresh naan",
          "Sajji, salt, and silence",
          "Apricot soup and walnut bread"
        ]
      },
      {
        text: "Sound of home is\u2026",
        options: [
          "Dhol drums",
          "Sufi qawwali at a shrine",
          "Rubab strings",
          "Wind across open land",
          "River, birds, nothing else"
        ]
      },
      {
        text: "Style you're drawn to:",
        options: [
          "Bright, embroidered, celebratory",
          "Ajrak block prints, indigo",
          "Woolen shawls, quiet colours",
          "Mirror-work and jewellery",
          "Handwoven wool, earth tones"
        ]
      },
      {
        text: "You value most:",
        options: [
          "Family and food",
          "Poetry and place",
          "Honour and hospitality",
          "Freedom and land",
          "Peace and patience"
        ]
      }
    ],
    results: [
      { name: "Punjabi soul", quote: "Loud love, louder food.", desc: "You thrive on family, Bhangra beats, and open-arms hospitality.", region: "punjab" },
      { name: "Sindhi spirit", quote: "Poetic, patterned, unhurried.", desc: "You'd sit by the Indus reading Shah Latif and eat biryani at midnight.", region: "sindh" },
      { name: "Pashtun heart", quote: "Fierce, loyal, generous.", desc: "Guest is king, code is honour, chapli kebabs are religion.", region: "kpk" },
      { name: "Balochi wind", quote: "Vast skies, quiet strength.", desc: "You love wide horizons, sajji smoke, and long, honest silences.", region: "balochistan" },
      { name: "Hunzai calm", quote: "Mountain patience, apricot sweetness.", desc: "You'd trade the city for terraced fields under a Karakoram sky.", region: "gilgit" }
    ].map(r => ({ ...r, exploreLink: `cultural-map.html?region=${r.region}` }))
  },

  {
    id: "festival",
    icon: "\u{1F389}",
    title: "What's your festival spirit?",
    subtitle: "Every celebration has a personality. Five questions to find yours.",
    exploreLabel: "See more festivals \u2192",
    questions: [
      {
        text: "Pick a soundtrack for the day:",
        options: [
          "National anthem and marching bands",
          "Laughter, sweets, and shopping bags",
          "Drums, folk dance, and mountain wind",
          "Qawwali swelling into the night",
          "Kite strings snapping in the breeze"
        ]
      },
      {
        text: "Your outfit for the occasion:",
        options: [
          "Green and white, flag pinned to your chest",
          "New, bright, and slightly too many bangles",
          "Embroidered tribal colours and beads",
          "Simple white, ready to whirl",
          "Yellow kurta, basanti and loud"
        ]
      },
      {
        text: "Where would we find you?",
        options: [
          "At a flag-hoisting ceremony, singing along",
          "At grandma's house, plate stacked high",
          "On a mountain plateau, watching polo and dance",
          "At a shrine courtyard, well past midnight",
          "On the rooftop, string in hand, shouting \"bo kaata!\""
        ]
      },
      {
        text: "What matters most to you today?",
        options: [
          "Pride in where you're from",
          "Family, food, and forgiveness",
          "Colour, rhythm, and community",
          "Surrender, music, and devotion",
          "Freedom, fun, and a little chaos"
        ]
      },
      {
        text: "Pick a feeling:",
        options: [
          "Patriotic goosebumps",
          "Warm, full, and a little sleepy",
          "Wild joy",
          "Quiet awe",
          "Pure adrenaline"
        ]
      }
    ],
    results: [
      { name: "Independence Day Patriot", quote: "Flag high, heart higher.", desc: "You feel every anthem in your chest \u2014 Youm-e-Azadi is your favourite kind of loud." },
      { name: "Eid Ka Chand Spirit", quote: "New clothes, old traditions.", desc: "Eidi, seviyan, and a house full of people \u2014 that's your idea of a perfect day." },
      { name: "Shandur & Kalash Soul", quote: "Where the mountains dance too.", desc: "You belong at Shandur's polo ground or a Kalash festival, colour and drums all around you." },
      { name: "Sufi Night Wanderer", quote: "Lost in the dhamaal.", desc: "Urs nights at the shrine, qawwali till dawn \u2014 your spirit is mystic, not loud." },
      { name: "Basant Rooftop Dreamer", quote: "Bo kaata, and gone.", desc: "Spring means kites, rooftops, and shouting into the wind with your whole chest." }
    ].map(r => ({ ...r, exploreLink: "festivals.html" }))
  },

  {
    id: "food",
    icon: "\u{1F372}",
    title: "Which Pakistani dish are you?",
    subtitle: "Tell us your vibe, we'll tell you your flavour.",
    exploreLabel: "Explore more dishes \u2192",
    questions: [
      {
        text: "Your ideal Sunday looks like:",
        options: [
          "Sleeping in, then a huge lunch with everyone",
          "A slow-simmered breakfast that took all night to make",
          "Waking up to open air, fire already lit",
          "Guests arrive unannounced \u2014 you feed them anyway",
          "Working the fields, then a home-cooked plate waiting"
        ]
      },
      {
        text: "How do you handle stress?",
        options: [
          "Layer it, spice it, deal with it dramatically",
          "Let it simmer slowly until it softens",
          "Strip it down to the essentials \u2014 salt, fire, patience",
          "Add more chili and push straight through",
          "Sit with it quietly, the way you'd sit with soil"
        ]
      },
      {
        text: "Pick a texture:",
        options: [
          "Rich, layered, fragrant",
          "Deep, tender, falling apart",
          "Smoky, lean, simple",
          "Juicy, spiced, generous",
          "Hearty, buttery, warm"
        ]
      },
      {
        text: "Your love language is:",
        options: [
          "A plate piled higher than necessary",
          "Something made with hours of unseen effort",
          "A fire, good company, and few words",
          "Feeding you before you even ask",
          "A home-cooked meal, no matter how simple"
        ]
      },
      {
        text: "Pick a mood:",
        options: [
          "Celebratory",
          "Comforting",
          "Rugged",
          "Bold",
          "Grounded"
        ]
      }
    ],
    results: [
      { name: "Biryani", quote: "Bold, layered, dramatic.", desc: "Every layer of you has a story \u2014 and you're never the quiet one at the table." },
      { name: "Nihari", quote: "Slow-cooked, deep, patient.", desc: "You take your time, but what you build lasts \u2014 rich, and worth the wait." },
      { name: "Sajji", quote: "Smoky, minimal, honest.", desc: "No fuss, no extra spice \u2014 just fire, salt, and quiet confidence." },
      { name: "Chapli Kebab", quote: "Spicy, generous, unforgettable.", desc: "You show love loudly, feed people before they ask, and leave an impression." },
      { name: "Saag & Makai Roti", quote: "Earthy, homely, grounded.", desc: "Simple, warm, and always comforting \u2014 you're everyone's idea of home." }
    ].map(r => ({ ...r, exploreLink: "food.html" }))
  },

  {
    id: "travel",
    icon: "\u26F0\u{FE0F}",
    title: "What's your Pakistan travel personality?",
    subtitle: "From peaks to deserts \u2014 find your dream destination.",
    exploreLabel: "Plan your trip \u2192",
    questions: [
      {
        text: "Pick a view to wake up to:",
        options: [
          "Snow-capped peaks over apricot orchards",
          "A green valley folded around a blue river",
          "Golden dunes stretching to the horizon",
          "Wooden houses and painted valley walls",
          "Waves crashing against a busy coastline"
        ]
      },
      {
        text: "Your ideal souvenir:",
        options: [
          "A handwoven Hunza cap and dried apricots",
          "A photo at Malam Jabba or Kalam",
          "A folk instrument from a desert village",
          "Beaded Kalash jewellery",
          "Fresh seafood and a beach sunset photo"
        ]
      },
      {
        text: "Your travel pace is:",
        options: [
          "Slow, terraced, peaceful",
          "Scenic drives, lots of stops",
          "Wide open, nothing to rush for",
          "Curious, wandering between villages",
          "Fast-paced, always something happening"
        ]
      },
      {
        text: "Pick a soundtrack for the road:",
        options: [
          "Silence and wind",
          "A river running beside the highway",
          "Distant folk drums under the stars",
          "Kalash flutes and laughter",
          "Traffic, waves, and city chatter"
        ]
      },
      {
        text: "What do you want most from a trip?",
        options: [
          "Peace and altitude",
          "Beauty you can breathe",
          "Space to think",
          "A culture unlike any other",
          "Energy and variety"
        ]
      }
    ],
    results: [
      { name: "Hunza Explorer", quote: "Mountain patience, sweet air.", desc: "Terraced fields, snow peaks, and apricot blossoms \u2014 that's your kind of peace." },
      { name: "Swat Wanderer", quote: "Green valleys, blue rivers.", desc: "You chase views that feel like a deep breath \u2014 Swat and Kalam were made for you." },
      { name: "Thar Desert Soul", quote: "Wide sky, quiet strength.", desc: "You'd take a starlit desert over a crowded city any day." },
      { name: "Kalash Valley Dreamer", quote: "Colour, culture, curiosity.", desc: "You're drawn to places unlike anywhere else \u2014 Kalash is your kind of wonder." },
      { name: "Karachi Coast Soul", quote: "Waves, energy, seafood.", desc: "You want a trip with buzz \u2014 beaches, food streets, and a city that never slows down." }
    ].map(r => ({ ...r, exploreLink: "tourism.html" }))
  },

  {
    id: "craft",
    icon: "\u{1F3A8}",
    title: "Which traditional art form matches your soul?",
    subtitle: "Every craft tells a story \u2014 which one is yours?",
    exploreLabel: "Discover more crafts \u2192",
    questions: [
      {
        text: "Pick a colour palette:",
        options: [
          "Every colour, all at once, chrome included",
          "Deep indigo, maroon, and block-printed white",
          "Threadwork in reds, oranges, and mirrors",
          "Warm wood tones, walnut and deodar",
          "Earthy browns and unglazed clay"
        ]
      },
      {
        text: "Your idea of beauty is:",
        options: [
          "Loud, joyful, impossible to ignore",
          "Traditional, symbolic, printed by hand",
          "Detailed enough to take weeks to finish",
          "Carved slowly, line by careful line",
          "Shaped on a wheel, imperfect and warm"
        ]
      },
      {
        text: "How do you express yourself?",
        options: [
          "Boldly, and everywhere you can",
          "Through pattern and repetition",
          "Through patient, careful handwork",
          "Through precision and structure",
          "Through touch and shaping with your hands"
        ]
      },
      {
        text: "Pick a workspace:",
        options: [
          "A painted truck, open air, music playing",
          "A block-printing workshop by the river",
          "A quiet room, needle and thread",
          "A wood workshop, shavings on the floor",
          "A potter's wheel, hands covered in clay"
        ]
      },
      {
        text: "What do people say about your work?",
        options: [
          "\"It's a lot \u2014 and I love it\"",
          "\"It tells a story without saying a word\"",
          "\"The detail is unbelievable\"",
          "\"It'll outlast us all\"",
          "\"It feels like home\""
        ]
      }
    ],
    results: [
      { name: "Truck Art Rebel", quote: "Loud, colourful, maximalist.", desc: "You believe more is more \u2014 chrome, colour, and personality on every surface." },
      { name: "Ajrak Artisan", quote: "Patterned, meaningful, timeless.", desc: "You value tradition you can wear \u2014 every block-print carries a story." },
      { name: "Balochi Embroidery Heart", quote: "Detailed, patient, symbolic.", desc: "You put in the hours others skip \u2014 the detail is always the point." },
      { name: "Wood Carving Craftsman", quote: "Precise, structured, lasting.", desc: "You build things meant to outlast trends \u2014 carved carefully, line by line." },
      { name: "Pottery Potter", quote: "Earthy, hand-shaped, warm.", desc: "You're comfortable with imperfection \u2014 shaped by hand, and better for it." }
    ].map(r => ({ ...r, exploreLink: "handicrafts.html" }))
  }

];

const quizCard = document.getElementById("quizCard");
const heroTitle = document.getElementById("quizHeroTitle");
const heroSub = document.getElementById("quizHeroSub");

let activeQuiz = null;
let currentQuestion = 0;
let scores = [0, 0, 0, 0, 0];
let answers = [];

// Keep track of quizzes already shown this session so "shuffle"
// favours something fresh instead of repeating the same one.
let recentlyShown = [];

function pickRandomQuiz(excludeId) {
  let pool = QUIZZES.filter(q => q.id !== excludeId);
  if (pool.length === 0) pool = QUIZZES;

  // Prefer quizzes not shown yet this session, when possible.
  const unseen = pool.filter(q => !recentlyShown.includes(q.id));
  const choices = unseen.length ? unseen : pool;

  return choices[Math.floor(Math.random() * choices.length)];
}

function setHero(quiz) {
  if (!heroTitle || !heroSub) return;
  heroTitle.innerHTML = `${quiz.title.replace(/\?$/, "")}<em>?</em>`;
  heroSub.textContent = quiz.subtitle;
}

function resetHero() {
  if (!heroTitle || !heroSub) return;
  heroTitle.innerHTML = `Which culture <em>matches you?</em>`;
  heroSub.textContent = "Pick a quiz below. Five questions, one shareable card. Not science \u2014 just a mirror.";
}


// ---------- QUIZ PICKER ----------

function renderPicker() {

  quizCard.classList.remove("quiz-result-mode");
  quizCard.classList.add("quiz-picker-mode");
  resetHero();

  quizCard.innerHTML = `

    <div class="quiz-topbar">
      <a href="index.html" class="quiz-home-btn">\u2190 Back to Home</a>
      <p class="quiz-progress" style="margin:0;">Choose a quiz</p>
    </div>

    <div class="quiz-picker-grid">
      ${QUIZZES.map(q => `
        <button class="quiz-pick-card" data-id="${q.id}">
          <span class="quiz-pick-icon">${q.icon}</span>
          <span class="quiz-pick-title">${q.title}</span>
          <span class="quiz-pick-sub">${q.subtitle}</span>
        </button>
      `).join("")}
    </div>

    <button class="cta-button cta-button-outline quiz-shuffle-btn" id="quizShuffleBtn">\u{1F3B2} Surprise me</button>

  `;

  quizCard.querySelectorAll(".quiz-pick-card").forEach(btn => {
    btn.addEventListener("click", () => {
      const quiz = QUIZZES.find(q => q.id === btn.dataset.id);
      startQuiz(quiz);
    });
  });

  document.getElementById("quizShuffleBtn").addEventListener("click", () => {
    startQuiz(pickRandomQuiz());
  });

}


function startQuiz(quiz) {
  activeQuiz = quiz;
  currentQuestion = 0;
  scores = [0, 0, 0, 0, 0];
  answers = [];

  recentlyShown.push(quiz.id);
  if (recentlyShown.length > QUIZZES.length) recentlyShown.shift();

  quizCard.classList.remove("quiz-picker-mode", "quiz-result-mode");
  setHero(quiz);
  renderQuestion();
}


function renderQuestion() {

  const q = activeQuiz.questions[currentQuestion];

  quizCard.innerHTML = `

    <div class="quiz-topbar">
      <div class="quiz-back-group">
        ${currentQuestion > 0 ? `<button class="quiz-home-btn quiz-allquiz-btn" id="quizPrevBtn">\u2190 Previous</button>` : ``}
        <button class="quiz-home-btn quiz-allquiz-btn" id="quizAllBtn">All quizzes</button>
      </div>
      <p class="quiz-progress" style="margin:0;">Question ${currentQuestion + 1} / ${activeQuiz.questions.length}</p>
    </div>

    <h2 class="quiz-question">${q.text}</h2>

    <div class="quiz-options">
      ${q.options.map((opt, i) => `<button class="quiz-option-btn" data-index="${i}">${opt}</button>`).join("")}
    </div>

  `;

  document.getElementById("quizAllBtn").addEventListener("click", renderPicker);

  const prevBtn = document.getElementById("quizPrevBtn");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      const last = answers.pop();
      if (last !== undefined) scores[last]--;
      currentQuestion--;
      renderQuestion();
    });
  }

  quizCard.querySelectorAll(".quiz-option-btn").forEach((btn) => {

    btn.addEventListener("click", () => {

      const index = parseInt(btn.dataset.index, 10);
      scores[index]++;
      answers.push(index);

      currentQuestion++;

      if (currentQuestion < activeQuiz.questions.length) {
        renderQuestion();
      } else {
        renderResult();
      }

    });

  });

}


function getResult() {

  let bestIndex = 0;

  scores.forEach((score, i) => {
    if (score > scores[bestIndex]) bestIndex = i;
  });

  return activeQuiz.results[bestIndex];

}


function renderResult() {

  const result = getResult();

  quizCard.classList.add("quiz-result-mode");

  quizCard.innerHTML = `

    <p class="quiz-progress quiz-match-label">Your Match</p>

    <h2 class="quiz-result-name">${result.name}</h2>

    <p class="quiz-result-quote">"${result.quote}"</p>

    <p class="quiz-result-desc">${result.desc}</p>

    <div class="quiz-result-actions">
      <button id="quizAllResultBtn" class="cta-button cta-button-outline quiz-retake-btn">\u2190 All quizzes</button>
      <a href="index.html" class="cta-button cta-button-outline quiz-home-result-btn">\u{1F3E0} Home</a>
      <button id="quizRetakeBtn" class="cta-button cta-button-outline quiz-retake-btn">\u21BB Take Again</button>
      <button id="quizNextBtn" class="cta-button cta-button-outline quiz-retake-btn">\u{1F3B2} Another Quiz</button>
    </div>

    <a href="${result.exploreLink}" class="see-all-link quiz-explore-link">${activeQuiz.exploreLabel}</a>

  `;

  document.getElementById("quizAllResultBtn").addEventListener("click", renderPicker);

  document.getElementById("quizRetakeBtn").addEventListener("click", () => {
    startQuiz(activeQuiz);
  });

  document.getElementById("quizNextBtn").addEventListener("click", () => {
    startQuiz(pickRandomQuiz(activeQuiz.id));
  });

  if (auth.currentUser) {
    logActivity(auth.currentUser.uid, "quiz", `${result.name} (${activeQuiz.title})`);
  }

}

// Start on the picker so returning visitors see there's more than one quiz.
renderPicker();