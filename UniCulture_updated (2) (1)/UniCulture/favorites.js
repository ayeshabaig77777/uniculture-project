import { auth, db } from "./firebase-config.js";

import { logActivity } from "./activity-log.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


let currentUser = null;
let favoritesSet = new Set(); // holds keys like "heritage_abc123"


// Load the current user's favorites once when auth state is known
onAuthStateChanged(auth, async (user) => {

  currentUser = user;
  favoritesSet.clear();

  if (user) {
    await loadUserFavorites(user.uid);
  }

  applyFavoriteState();

});


async function loadUserFavorites(uid) {

  try {

    const q = query(collection(db, "Favorites"), where("uid", "==", uid));
    const snapshot = await getDocs(q);

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      favoritesSet.add(`${data.type}_${data.id}`);
    });

  } catch (error) {
    console.error("Could not load favorites:", error);
  }

}


// Call this after rendering cards, so hearts reflect saved state
export function applyFavoriteState() {

  document.querySelectorAll(".fav-btn").forEach((btn) => {

    const key = `${btn.dataset.type}_${btn.dataset.id}`;

    if (favoritesSet.has(key)) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }

  });

}


// Returns the HTML for a heart button — use inside any card template
export function heartButtonHTML(type, id, title, image) {

  return `
    <button
      class="fav-btn"
      data-type="${type}"
      data-id="${id}"
      data-title="${encodeURIComponent(title || "")}"
      data-image="${encodeURIComponent(image || "")}"
      title="Save to favorites"
    >
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path d="M12 21s-7.5-4.6-10.2-9.1C0 9 1.2 5.5 4.5 4.6c2-.5 4 .3 5.5 2.1 1.5-1.8 3.5-2.6 5.5-2.1 3.3.9 4.5 4.4 2.7 7.3C19.5 16.4 12 21 12 21z"/>
      </svg>
    </button>
  `;

}


// One delegated listener handles clicks for hearts on any page, even ones added later
document.addEventListener("click", async (e) => {

  const btn = e.target.closest(".fav-btn");
  if (!btn) return;

  e.preventDefault();
  e.stopPropagation();

  if (!currentUser) {
    alert("Please login to save favorites.");
    return;
  }

  const type = btn.dataset.type;
  const id = btn.dataset.id;
  const title = decodeURIComponent(btn.dataset.title || "");
  const image = decodeURIComponent(btn.dataset.image || "");

  const key = `${type}_${id}`;
  const favDocId = `${currentUser.uid}_${type}_${id}`;
  const favRef = doc(db, "Favorites", favDocId);

  try {

    if (favoritesSet.has(key)) {

      favoritesSet.delete(key);
      btn.classList.remove("active");
      await deleteDoc(favRef);

    } else {

      favoritesSet.add(key);
      btn.classList.add("active");

      await setDoc(favRef, {
        uid: currentUser.uid,
        type,
        id,
        title,
        image,
        createdAt: serverTimestamp()
      });

      await logActivity(currentUser.uid, "favorited", title);

    }

  } catch (error) {

    console.error("Could not update favorite:", error);
    // revert UI on failure
    applyFavoriteState();

  }

});