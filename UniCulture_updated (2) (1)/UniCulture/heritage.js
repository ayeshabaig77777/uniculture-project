import { db } from "./firebase-config.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import { heartButtonHTML, applyFavoriteState } from "./favorites.js";

const grid = document.querySelector(".heritage-grid");

async function loadHeritage() {

    const snapshot = await getDocs(collection(db, "Heritage"));
    console.log("Total documents:", snapshot.size);
    
    grid.innerHTML = "";

    snapshot.forEach((doc)=>{
        console.log(doc.id, doc.data());

        const data = doc.data();

        grid.innerHTML += `

<a href="heritage_detail.html?id=${doc.id}" class="heritage-link protected-btn">

<div class="heritage-card">

${heartButtonHTML("heritage", doc.id, data.name, data.image)}

<img src="${data.image}" alt="${data.name}">

<div class="heritage-content">

<h3>${data.name}</h3>


<span>${data.province}</span>

<button type="button" class="heritage-explore-btn">Explore →</button>

</div>

</div>

</a>

`;

    });

    applyFavoriteState();

}

loadHeritage();