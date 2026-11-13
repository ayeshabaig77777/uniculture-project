import { getNextFestival } from "./festival-countdown.js";
import { FACTS } from "./did-you-know.js";


// ================= STATIC "DID YOU KNOW" HERO CARD =================

function renderHeroDidYouKnow() {

  const card = document.getElementById("hero-dyk-card");
  if (!card) return;

  const fact = FACTS[Math.floor(Math.random() * FACTS.length)];

  card.innerHTML = `
    <p class="dyk-static-label">✨ Did You Know</p>
    <p class="dyk-static-text">${fact}</p>
  `;

}

renderHeroDidYouKnow();


// ================= NEXT CELEBRATION CARD =================

function renderNextCelebrationCard() {

  const card = document.getElementById("nextCelebrationCard");
  if (!card) return;

  const next = getNextFestival();

  function update() {

    const now = new Date();
    const diff = next.date - now;

    if (diff <= 0) {
      card.innerHTML = `<p class="side-card-label">📅 Next Celebration</p><p>${next.name} is today! 🎉</p>`;
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    card.innerHTML = `
      <p class="side-card-label">📅 Next Celebration</p>
      <h4 class="side-card-festival-name">${next.name}</h4>
      <div class="mini-countdown">
        <div><strong>${days}</strong><span>Days</span></div>
        <div><strong>${hours}</strong><span>Hrs</span></div>
        <div><strong>${minutes}</strong><span>Min</span></div>
        <div><strong>${seconds}</strong><span>Sec</span></div>
      </div>
    `;

  }

  update();
  const timer = setInterval(update, 1000);

}

renderNextCelebrationCard();