import { db } from "./firebase-config.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const languagesGrid = document.getElementById("languagesGrid");

async function loadLanguages() {

    languagesGrid.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "languages"));

    querySnapshot.forEach((doc) => {

        const language = doc.data();

        languagesGrid.innerHTML += `

        <a href="language_detail.html?id=${doc.id}" class="language-link">

            <div class="language-card">

                <img src="${language.image}" alt="${language.name}">

                <div class="language-content">

                    <h3>${language.name}</h3>

                    <p>${language.description}</p>

                    <span>${language.province}</span>

                </div>

            </div>

        </a>

        `;

    });

}

loadLanguages();