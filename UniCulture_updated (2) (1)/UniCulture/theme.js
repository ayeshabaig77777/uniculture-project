/* =========================================================
   UniCulture — Dark Mode / Light Mode toggle
   Shared across every page. Plain script (not a module) so
   it can run as early as possible, before other page scripts.
   ========================================================= */

(function () {

  var STORAGE_KEY = "uc-theme";

  function getSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* ignore (e.g. private browsing) */
    }
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    updateToggleIcon(theme);
  }

  function updateToggleIcon(theme) {
    var btn = document.getElementById("darkModeToggle");
    if (!btn) return;
    btn.textContent = theme === "dark" ? "☀️" : "🌙";
    btn.title = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    btn.setAttribute("aria-label", btn.title);
  }

  function currentTheme() {
    return document.body.classList.contains("dark-mode") ? "dark" : "light";
  }

  function toggleTheme() {
    var next = currentTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    saveTheme(next);
  }

  // Apply the saved theme as soon as <body> exists (this script tag sits
  // right after the opening <body> tag on every page, so this runs before
  // the rest of the page renders — no flash of the wrong theme).
  var saved = getSavedTheme();
  if (saved === "dark") {
    document.body.classList.add("dark-mode");
  }

  // Build the floating toggle button once the DOM is ready.
  document.addEventListener("DOMContentLoaded", function () {

    if (document.getElementById("darkModeToggle")) return;

    var btn = document.createElement("button");
    btn.id = "darkModeToggle";
    btn.type = "button";
    btn.title = "Toggle dark mode";

    document.body.appendChild(btn);

    updateToggleIcon(currentTheme());

    btn.addEventListener("click", toggleTheme);

  });

  // Expose for other scripts / debugging if ever needed.
  window.ucSetTheme = function (theme) {
    applyTheme(theme);
    saveTheme(theme);
  };

})();
