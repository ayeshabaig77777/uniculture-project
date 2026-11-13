import { db } from "./firebase-config.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import { heartButtonHTML, applyFavoriteState } from "./favorites.js";

const grid = document.querySelector(".festivals-grid");

async function loadFestivals() {

  try {

    const snapshot = await getDocs(collection(db, "festivals"));

    grid.innerHTML = "";

    snapshot.forEach((doc) => {

      const data = doc.data();

      grid.innerHTML += `

      <a href="festivals_detail.html?id=${doc.id}" class="festival-link protected-btn">

        <div class="festival-card">

          ${heartButtonHTML("festival", doc.id, data.name, data.image)}

          <img src="${data.image}" alt="${data.name}">

          <div class="festival-content">

            <h3>${data.name}</h3>

            <span>${data.region}</span>

          </div>

        </div>

      </a>

      `;

    });

    applyFavoriteState();

  }

  catch (error) {

    console.error(error);

    grid.innerHTML = `
      <h2 style="text-align:center;padding:40px;">
      Unable to load festivals.
      </h2>
    `;

  }

}

loadFestivals();