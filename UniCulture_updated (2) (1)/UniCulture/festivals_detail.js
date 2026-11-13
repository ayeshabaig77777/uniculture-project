import { db } from "./firebase-config.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import { trackView } from "./track-view.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
    alert("Festival not found");
    throw new Error("No document ID");
}

const docRef = doc(db, "festivals", id);
const docSnap = await getDoc(docRef);

if (!docSnap.exists()) {

    document.body.innerHTML =
    `<h1 style="text-align:center;margin-top:100px;">
        Festival not found
    </h1>`;

}
else{

    const data = docSnap.data();

    console.log(data);

    trackView({
      type: "festival",
      id: id,
      title: data.name,
      image: data.image || "",
      url: `festivals_detail.html?id=${id}`
    });

    document.title = `${data.name} | UniCulture`;

    // HERO

    document.getElementById("name").textContent =
    data.name;

    // document.getElementById("hero").style.backgroundImage =
// `url('${data.image}')`;

    // OVERVIEW

    document.getElementById("description").textContent =
    data.description;

    // QUICK INFO

    document.getElementById("region2").textContent =
    data.region;

    document.getElementById("origin").textContent =
    data.origin;

    document.getElementById("features").textContent =
    data.features;

    document.getElementById("type").textContent =
    "Cultural Festival";

    // HISTORY

    document.getElementById("history").textContent =
    data.origin;

    // SIGNIFICANCE

    document.getElementById("significance").textContent =
    data.cultural_significance;

    // ACTIVITIES

    document.getElementById("activities").textContent =
    data.features;

    // DID YOU KNOW

    document.getElementById("funfact").textContent =
    data.fun_fact ||
    "This festival is an important part of Pakistan's cultural heritage and continues to preserve local traditions.";

}