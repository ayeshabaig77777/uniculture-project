import { auth } from "./firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";


onAuthStateChanged(auth, (user) => {

  if (user) return;

  const popup = document.getElementById("authPopup");
  if (!popup) return;

  popup.style.display = "flex";
  popup.classList.add("popup-locked");
  document.body.style.overflow = "hidden";

  const closeBtn = document.getElementById("closePopup");

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

});