import { db } from "./firebase-config.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import { heartButtonHTML, applyFavoriteState } from "./favorites.js";

const grid = document.getElementById("musicGrid");

grid.innerHTML = `
<div style="text-align:center;padding:70px;font-size:22px;">
Loading Music & Dance...
</div>
`;

async function loadMusic() {

    const snapshot = await getDocs(collection(db, "music_dance"));

    grid.innerHTML = "";

    snapshot.forEach(doc => {

        const item = doc.data();

        grid.innerHTML += `

<a class="music-link protected-btn"
href="music_detail.html?id=${encodeURIComponent(doc.id)}">

<div class="music-card">

${heartButtonHTML("music", doc.id, item.name, item.image)}

<img src="${item.image}" alt="${item.name}">

<div class="music-content">

<h3>${item.name}</h3>

<p>${item.description}</p>

<span>${item.region}</span>

</div>

</div>

</a>

`;

    });

    applyFavoriteState();

}

loadMusic();