// Pure helper logic for the AI Trip Planner (no Firebase / DOM here, so it is
// easy to test). trip-planner.js handles the page, Firestore and the AI call.

export function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

function short(text, max) {
  const t = String(text || "").replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
}

// First sentence of a text, cut at a word boundary (used for clean "why" lines).
export function firstSentence(text, max = 110) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (!clean) return "";
  const m = clean.match(/^.*?[.!?](\s|$)/);
  let s = (m ? m[0] : clean).trim();
  if (s.length > max) {
    s = s.slice(0, max).replace(/\s+\S*$/, "") + "…";
  }
  return s;
}

// Only destinations in `candidates` may ever appear in a plan, so the AI can
// never invent a place that has no page on the site.
export function buildPrompt(candidates, { days, region, month, pace, interests }) {

  const lines = candidates.map((d) =>
    `${d.id} | ${d.name} | ${d.city || ""}, ${d.province || ""} | ${d.type} | best: ${short(d.best_time_to_visit, 70)} | near: ${(d.nearby || []).join(",") || "none"}`
  ).join("\n");

  return `You are a Pakistan travel planner for the UniCulture website. Plan a ${days}-day trip.
Traveller enjoys: ${interests}. Area: ${region}. Travelling in: ${month}. Pace: about ${pace} places per day.

You may ONLY use destinations from this list (use the exact id before the first "|"):
${lines}

Rules:
- Put destinations that are close together on the same day (use the "near" ids and the city). Never make one day jump between far-apart places.
- Prefer destinations whose best season fits ${month}. If a place is a poor fit for ${month}, say so in "why".
- Do not repeat a destination. Keep every "why" under 20 words.
Reply in EXACTLY this plain-text format and nothing else (no introduction, no markdown, no closing remarks):
SUMMARY: one sentence
DAY 1: short title
- exact-id: short reason
- exact-id: short reason
TIP: one practical tip
DAY 2: short title
- exact-id: short reason
TIP: one practical tip

Plan exactly ${days} days if there are enough places, otherwise fewer days.`;
}

// Turns the AI reply into a plan. Returns null when the reply is unusable.
export function parsePlan(reply, candidates, maxDays) {

  if (typeof reply !== "string") return null;

  const start = reply.indexOf("{");
  const end = reply.lastIndexOf("}");
  if (start === -1 || end <= start) return null;

  let data;
  try {
    data = JSON.parse(reply.slice(start, end + 1));
  } catch (e) {
    return null;
  }

  if (!data || !Array.isArray(data.days)) return null;

  const byId = new Map(candidates.map((d) => [d.id, d]));
  const used = new Set();

  const days = data.days.slice(0, maxDays).map((day) => {

    const stops = (Array.isArray(day?.stops) ? day.stops : [])
      .filter((s) => s && byId.has(s.id) && !used.has(s.id))
      .map((s) => {
        used.add(s.id);
        return { place: byId.get(s.id), why: short(s.why, 140) };
      });

    return { title: short(day?.title, 60) || "Explore", stops, tip: short(day?.tip, 160) };

  }).filter((day) => day.stops.length);

  if (!days.length) return null;

  return { summary: short(data.summary, 220), days };

}

// Safety net when the AI is unreachable: groups destinations that sit near
// each other (via the "nearby" field and shared city) and fills the days.
export function fallbackPlan(candidates, { days, pace, month }) {

  const byId = new Map(candidates.map((d) => [d.id, d]));
  const seen = new Set();
  const clusters = [];

  candidates.forEach((d) => {

    if (seen.has(d.id)) return;

    const group = [];
    const queue = [d.id];

    while (queue.length) {

      const id = queue.shift();
      if (seen.has(id) || !byId.has(id)) continue;

      seen.add(id);
      const cur = byId.get(id);
      group.push(cur);

      (cur.nearby || []).forEach((n) => queue.push(n));
      candidates.forEach((o) => { if (!seen.has(o.id) && o.city && o.city === cur.city) queue.push(o.id); });

    }

    clusters.push(group);

  });

  // Every day takes stops from ONE cluster only, so a day never jumps between
  // far-apart places. Big clusters are split into several days; fullest days first.
  const chunks = [];

  clusters.forEach((group) => {
    for (let i = 0; i < group.length; i += pace) {
      chunks.push(group.slice(i, i + pace));
    }
  });

  chunks.sort((a, b) => b.length - a.length);   // stable: ties keep cluster order

  const plan = chunks.slice(0, days).map((group) => {

    const stops = group.map((place) => ({
      place,
      why: firstSentence(place.description)
    }));

    return {
      title: group[0].city || group[0].province || "Explore",
      stops,
      tip: ""
    };

  });

  return {
    summary: `A ${plan.length}-day plan for ${month}, built from destinations that sit close together.`,
    days: plan
  };

}


// Reads the plain-text format. Very forgiving: ignores chatter, bullets, bold
// markers and numbering, accepts a destination's name instead of its id, and
// still returns the days that were complete if the reply was cut short.
export function parseLines(reply, candidates, maxDays) {

  if (typeof reply !== "string") return null;

  const byId = new Map(candidates.map((d) => [d.id, d]));
  const used = new Set();

  const keys = candidates
    .flatMap((d) => [{ key: d.id.toLowerCase(), place: d }, { key: d.name.toLowerCase(), place: d }])
    .sort((x, y) => y.key.length - x.key.length);

  let summary = "";
  const days = [];
  let current = null;

  const clean = (s) => s.replace(/[*_`#]/g, "").trim();

  reply.split(/\r?\n/).forEach((raw) => {

    const line = clean(raw.replace(/^\s*(?:[-•*]|\d+[.)])\s*/, ""));
    if (!line) return;

    let m = line.match(/^summary\s*[:\-–—]\s*(.+)$/i);
    if (m) { summary = m[1]; return; }

    m = line.match(/^day\s*\d+\s*[:\-–—]?\s*(.*)$/i);
    if (m) {
      current = { title: short(m[1], 60) || "Explore", stops: [], tip: "" };
      days.push(current);
      return;
    }

    m = line.match(/^tip\s*[:\-–—]\s*(.+)$/i);
    if (m && current) { current.tip = short(m[1], 160); return; }

    // A stop line starts with a known id or name (ids contain hyphens, so we
    // match against the real list instead of splitting on "-").
    if (current) {

      const lower = line.toLowerCase();

      const hit = keys.find((k) =>
        lower.startsWith(k.key) && /^(\s*[:|\u2013\u2014-]|\s*$)/.test(line.slice(k.key.length))
      );

      if (hit && !used.has(hit.place.id)) {
        used.add(hit.place.id);
        const why = line.slice(hit.key.length).replace(/^\s*[:|\u2013\u2014-]\s*/, "");
        current.stops.push({ place: hit.place, why: short(why, 140) });
      }

    }

  });

  const good = days.filter((d) => d.stops.length).slice(0, maxDays);
  if (!good.length) return null;

  return { summary: short(summary, 220), days: good };

}

// Tries the strict JSON reading first, then the plain-text format.
export function parseReply(reply, candidates, maxDays) {
  return parsePlan(reply, candidates, maxDays) || parseLines(reply, candidates, maxDays);
}