export const FACTS = [
  "Pakistan is home to five of the world's fourteen peaks above 8,000 meters, including K2 — the second-highest mountain on Earth.",
  "The Indus Valley Civilization, one of the world's oldest urban cultures, flourished in what is now Pakistan over 4,500 years ago.",
  "Mohenjo-daro, a UNESCO World Heritage Site in Sindh, had one of the world's earliest known urban sanitation systems.",
  "Pakistan has over 70 languages spoken across its provinces, from Punjabi and Sindhi to Balti and Burushaski.",
  "The Truck Art of Pakistan is internationally recognized as a unique folk art form, turning everyday vehicles into moving galleries.",
  "Lahore's Badshahi Mosque was, at the time of its completion in 1673, one of the largest mosques in the world.",
  "The Hunza Valley in Gilgit-Baltistan is famous not just for its scenery, but for the longevity of its residents.",
  "Sufi shrines across Pakistan host qawwali nights that have shaped South Asian music for centuries.",
  "Pakistan's Basant festival historically filled the skies of Lahore with kites to mark the arrival of spring.",
  "The Khewra Salt Mine in Punjab is one of the oldest and largest salt mines in the world."
];

function showDidYouKnowPopup() {

  const alreadyShown = sessionStorage.getItem("didYouKnowShown");
  if (alreadyShown) return;

  const fact = FACTS[Math.floor(Math.random() * FACTS.length)];

  const popup = document.createElement("div");
  popup.className = "dyk-popup";

  popup.innerHTML = `
    <div class="dyk-box">
      <button class="dyk-close">&times;</button>
      <h4>Did You Know?</h4>
      <p>${fact}</p>
    </div>
  `;

  document.body.appendChild(popup);

  popup.querySelector(".dyk-close").addEventListener("click", () => {
    popup.remove();
  });

  sessionStorage.setItem("didYouKnowShown", "true");

}

// Wait a moment after the page loads so it doesn't compete with the hero animation
window.addEventListener("load", () => {
  setTimeout(showDidYouKnowPopup, 1500);
});