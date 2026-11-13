import { db } from "./firebase-config.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import { trackView } from "./track-view.js";


const params = new URLSearchParams(window.location.search);

const id = params.get("id");


if(!id){

alert("Handicraft not found");
throw new Error("No ID");

}



const docRef = doc(db,"handicrafts",id);

const docSnap = await getDoc(docRef);



if(!docSnap.exists()){


document.body.innerHTML=
`
<h1 style="text-align:center;margin-top:100px">
Handicraft not found
</h1>
`;


}

else{


const data = docSnap.data();


console.log(data);

trackView({
  type: "handicraft",
  id: id,
  title: data.name,
  image: data.image || "",
  url: `handicraft_detail.html?id=${id}`
});


document.title =
`${data.name} | UniCulture`;



// HERO

document.getElementById("name").textContent =
data.name;



// DESCRIPTION

document.getElementById("description").textContent =
data.description || "";



// QUICK INFO


document.getElementById("region2").textContent =
data.region || "";



document.getElementById("origin").textContent =
data.origin || "";



document.getElementById("features").textContent =
data.features || "";



document.getElementById("type").textContent =
"Traditional Craft";




// HISTORY

document.getElementById("history").textContent =
data.origin || "";



// CULTURE

document.getElementById("significance").textContent =
data.cultural_practices || "";



// USE

document.getElementById("activities").textContent =
data.features || "";



// FUN FACT

document.getElementById("funfact").textContent =
data.region || "";


}