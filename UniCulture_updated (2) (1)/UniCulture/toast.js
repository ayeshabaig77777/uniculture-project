// Replaces the browser's ugly "127.0.0.1 says..." alert popup with a small
// message that slides in at the bottom of the page and disappears by itself.
// Also gives a nicer in-page confirm dialog (confirmDialog) for delete/ban actions.
//
// Just import it once in a page script:  import "./toast.js";
// After that, every existing alert("...") on that page shows as a toast automatically.

const STYLE_ID = "ucToastStyle";
const BOX_ID = "ucToastBox";

function injectStyle() {

  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;

  style.textContent = `
    #${BOX_ID} {
      position: fixed;
      left: 50%;
      bottom: 24px;
      transform: translateX(-50%);
      z-index: 99999;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      pointer-events: none;
      width: max-content;
      max-width: min(92vw, 440px);
    }

    .uc-toast {
      pointer-events: auto;
      padding: 12px 18px;
      border-radius: 12px;
      background: #1e4d2f;
      color: #ffffff;
      font-size: 15px;
      line-height: 1.4;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
      overflow-wrap: anywhere;
      animation: ucToastIn 0.2s ease-out;
    }

    .uc-toast.error {
      background: #a02626;
    }

    .uc-toast.hide {
      opacity: 0;
      transition: opacity 0.25s ease;
    }

    @keyframes ucToastIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .uc-dialog-overlay {
      position: fixed;
      inset: 0;
      z-index: 100000;
      display: grid;
      place-items: center;
      padding: 16px;
      background: rgba(0, 0, 0, 0.45);
    }

    .uc-dialog {
      width: min(100%, 380px);
      padding: 22px;
      border-radius: 16px;
      background: #ffffff;
      color: #1c2b21;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
    }

    .uc-dialog-text {
      margin: 0 0 18px;
      font-size: 16px;
      line-height: 1.5;
    }

    .uc-dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }

    .uc-dialog-btn {
      padding: 9px 18px;
      border-radius: 10px;
      border: 1px solid #d5ddd6;
      background: transparent;
      color: inherit;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }

    .uc-dialog-btn.confirm {
      border-color: #1e4d2f;
      background: #1e4d2f;
      color: #ffffff;
    }

    .uc-dialog-btn.confirm.danger {
      border-color: #a02626;
      background: #a02626;
    }

    body.dark-mode .uc-dialog {
      background: #1a261e;
      color: #e8efe9;
    }

    body.dark-mode .uc-dialog-btn {
      border-color: #2f4034;
    }

    @media (prefers-reduced-motion: reduce) {
      .uc-toast { animation: none; }
    }
  `;

  document.head.appendChild(style);

}

function getBox() {

  let box = document.getElementById(BOX_ID);

  if (!box) {
    box = document.createElement("div");
    box.id = BOX_ID;
    box.setAttribute("aria-live", "polite");
    document.body.appendChild(box);
  }

  return box;

}


// type: "success" (green) or "error" (red)
export function showToast(message, type = "success", duration = 3500) {

  injectStyle();

  const toast = document.createElement("div");
  toast.className = `uc-toast ${type === "error" ? "error" : ""}`;
  toast.setAttribute("role", "status");
  toast.textContent = String(message ?? "");

  getBox().appendChild(toast);

  setTimeout(() => {
    toast.classList.add("hide");
    setTimeout(() => toast.remove(), 300);
  }, duration);

}


// In-page confirm box. Use it like:  if (!(await confirmDialog("Delete this?"))) return;
export function confirmDialog(message, options = {}) {

  const {
    confirmText = "Confirm",
    cancelText = "Cancel",
    danger = false
  } = options;

  injectStyle();

  return new Promise((resolve) => {

    const overlay = document.createElement("div");
    overlay.className = "uc-dialog-overlay";

    overlay.innerHTML = `
      <div class="uc-dialog" role="dialog" aria-modal="true">
        <p class="uc-dialog-text"></p>
        <div class="uc-dialog-actions">
          <button type="button" class="uc-dialog-btn cancel"></button>
          <button type="button" class="uc-dialog-btn confirm ${danger ? "danger" : ""}"></button>
        </div>
      </div>
    `;

    overlay.querySelector(".uc-dialog-text").textContent = message;

    const cancelBtn = overlay.querySelector(".cancel");
    const confirmBtn = overlay.querySelector(".confirm");

    cancelBtn.textContent = cancelText;
    confirmBtn.textContent = confirmText;

    function close(result) {
      document.removeEventListener("keydown", onKey);
      overlay.remove();
      resolve(result);
    }

    function onKey(e) {
      if (e.key === "Escape") close(false);
    }

    cancelBtn.addEventListener("click", () => close(false));
    confirmBtn.addEventListener("click", () => close(true));

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close(false);
    });

    document.addEventListener("keydown", onKey);

    document.body.appendChild(overlay);
    cancelBtn.focus();

  });

}


// Make every existing alert("...") on the page show as a toast instead
if (!window.__ucAlertPatched) {

  window.__ucAlertPatched = true;

  const errorWords = /could not|can't|cannot|failed|error|invalid|incorrect|wrong|denied|not allowed|too large|must be|already|banned|please (login|log in|fill|upload)|only image|went wrong|not found/i;

  window.alert = function (message) {
    const text = String(message ?? "");
    showToast(text, errorWords.test(text) ? "error" : "success");
  };

}