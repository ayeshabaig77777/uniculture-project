import { db } from "./firebase-config.js";


import {
collection,
addDoc,
serverTimestamp
}
from 
"https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";



const form = document.getElementById("contactForm");

console.log(form);



form.addEventListener("submit", async(e)=>{


e.preventDefault();



const name =
document.getElementById("name").value;


const email =
document.getElementById("email").value;


const subject =
document.getElementById("subject").value;


const message =
document.getElementById("message").value;



await addDoc(collection(db,"messages"),{


name:name,

email:email,

subject:subject,

message:message,

createdAt:serverTimestamp()


});



alert("Message sent successfully 💚");


form.reset();


});