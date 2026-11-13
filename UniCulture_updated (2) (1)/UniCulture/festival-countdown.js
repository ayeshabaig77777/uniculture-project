// Countdown to the next upcoming fixed-date Pakistani cultural/national day.
// Note: Eid-ul-Fitr, Eid-ul-Adha, and other lunar (Hijri) calendar festivals
// are intentionally excluded here since their Gregorian dates shift every year
// and can't be reliably hardcoded. Only fixed annual dates are used.

const FESTIVALS = [
  { name: "Kashmir Solidarity Day", month: 2, day: 5 },
  { name: "Pakistan Day", month: 3, day: 23 },
  { name: "Independence Day", month: 8, day: 14 },
  { name: "Defence Day", month: 9, day: 6 },
  { name: "Iqbal Day", month: 11, day: 9 },
  { name: "Quaid-e-Azam Day", month: 12, day: 25 }
];

export function getNextFestival() {

  const now = new Date();
  const thisYear = now.getFullYear();

  let candidates = FESTIVALS.map((f) => {

    let date = new Date(thisYear, f.month - 1, f.day, 0, 0, 0);

    if (date < now) {
      date = new Date(thisYear + 1, f.month - 1, f.day, 0, 0, 0);
    }

    return { name: f.name, date };

  });

  candidates.sort((a, b) => a.date - b.date);

  return candidates[0];

}

function renderCountdown() {

  const container = document.getElementById("festivalCountdown");
  if (!container) return;

  const next = getNextFestival();

  function update() {

    const now = new Date();
    const diff = next.date - now;

    if (diff <= 0) {
      container.innerHTML = `<p>${next.name} is today! 🎉</p>`;
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    container.innerHTML = `

      <div class="countdown-box">

        <h3>Next Up: ${next.name}</h3>

        <div class="countdown-timer">
          <div><strong>${days}</strong><span>Days</span></div>
          <div><strong>${hours}</strong><span>Hours</span></div>
          <div><strong>${minutes}</strong><span>Min</span></div>
          <div><strong>${seconds}</strong><span>Sec</span></div>
        </div>

      </div>

    `;

  }

  update();
  const timer = setInterval(update, 1000);

}

renderCountdown();