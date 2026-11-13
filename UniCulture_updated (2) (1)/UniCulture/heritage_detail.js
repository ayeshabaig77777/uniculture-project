import { db } from "./firebase-config.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import { trackView } from "./track-view.js";


// URL se ID lena

const params = new URLSearchParams(window.location.search);

const id = params.get("id");


if(!id){

    alert("Heritage not found");

    throw new Error("No ID Found");

}



// Firestore document

const docRef = doc(db,"Heritage",id);


const docSnap = await getDoc(docRef);



if(!docSnap.exists()){


    document.body.innerHTML = `

    <h1 style="text-align:center;margin-top:100px;">
    Heritage not found
    </h1>

    `;


}

else{


const data = docSnap.data();

console.log(data);

trackView({
  type: "heritage",
  id: id,
  title: data.name,
  image: data.image || "",
  url: `heritage_detail.html?id=${id}`
});

// Page title

document.title = `${data.name} | UniCulture`;

// HERO

document.getElementById("name").textContent =
data.name;

// Hero Image


// OVERVIEW

document.getElementById("description").textContent =
data.description;

// QUICK FACTS
document.getElementById("location").textContent =
`${data.city}, ${data.province}`;

document.getElementById("category2").textContent =
data.category;

document.getElementById("year").textContent =
data.built_year;

document.getElementById("architecture").textContent =
data.architectural_style || "Mughal Architecture";

// HISTORY

document.getElementById("history").textContent =
data.history;
// SIGNIFICANCE

document.getElementById("significance").textContent =
data.significance;

// VISITOR INFORMATION

document.getElementById("hours").textContent =
data.opening_hours || "Not Available";

document.getElementById("besttime").textContent =
data.best_time_to_visit || "Not Available";
// FUN FACT

document.getElementById("funfact").textContent =
data.fun_fact || "Not Available";

}