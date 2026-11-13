import { db } from "./firebase-config.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import { heartButtonHTML, applyFavoriteState } from "./favorites.js";

const grid = document.getElementById("languagesGrid");

async function loadLanguages() {

     grid.innerHTML = `
    <div style="text-align:center;padding:80px;font-size:22px;">
      Loading Languages...
    </div>
  `;

  try {

    const snapshot = await getDocs(collection(db, "languages"));

    grid.innerHTML = "";

    snapshot.forEach((doc) => {

      const data = doc.data();

      grid.innerHTML += `

<a href="language_detail.html?id=${doc.id}" class="protected-btn">

<div class="language-card">

${heartButtonHTML("language", doc.id, data.name, data.image)}

<img src="${data.image}" alt="${data.name}">

<div class="language-content">


<span>${data.province}</span>

</div>

</div>

</a>

`;

    });

    applyFavoriteState();

  }

  catch(error){

    console.error(error);

    grid.innerHTML = `
      <h2 style="text-align:center;color:red;">
      Failed to load languages.
      </h2>
    `;

  }

}

loadLanguages();