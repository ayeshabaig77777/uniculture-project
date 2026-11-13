// Shared helpers used across UniCulture pages.

// Run any user-written text through this before putting it into HTML.
// It turns things like <script> or <img onerror=...> into plain text (XSS protection).
export function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Allows only http/https links (blocks links like javascript:).
export function safeUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:" ? u.href : "";
  } catch (e) {
    return "";
  }
}

// Converts a Firestore timestamp into a date like "05 Nov 2026".
export function formatDate(ts) {
  if (!ts || !ts.seconds) return "Unknown";
  return new Date(ts.seconds * 1000).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}