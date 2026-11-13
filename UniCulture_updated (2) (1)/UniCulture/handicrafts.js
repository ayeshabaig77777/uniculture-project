import { db } from "./firebase-config.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import { heartButtonHTML, applyFavoriteState } from "./favorites.js";


const grid = document.querySelector(".handicrafts-grid");


async function loadHandicrafts(){

try{

const snapshot = await getDocs(collection(db,"handicrafts"));

grid.innerHTML="";


snapshot.forEach((doc)=>{


const data = doc.data();


grid.innerHTML += `


<a href="handicraft_detail.html?id=${doc.id}" class="handicraft-link protected-btn">


<div class="handicraft-card">

${heartButtonHTML("handicraft", doc.id, data.name, data.image)}

<img src="${data.image}" alt="${data.name}">


<div class="handicraft-content">

<h3>${data.name}</h3>

<span>${data.region}</span>

</div>


</div>


</a>


`;


});

applyFavoriteState();

}

catch(error){

console.log(error);

grid.innerHTML=
`
<h2>
Unable to load handicrafts
</h2>
`;

}


}


loadHandicrafts();