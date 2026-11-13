import { auth, db } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// ================= SIGNUP =================

const signupForm = document.getElementById("signupForm");

if (signupForm) {

  signupForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = signupForm.querySelector('input[name="email"]').value;
    const password = signupForm.querySelector('input[name="password"]').value;

    try {

      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // Firestore mein user ka record banao (admin dashboard aur ban/unban ke liye)
      try {
        await setDoc(doc(db, "Users", cred.user.uid), {
          name: "",
          email: email,
          joinedAt: serverTimestamp(),
          banned: false
        });
      } catch (recordError) {
        console.error("Could not save user record:", recordError);
      }

      alert("Signup Successful!");

      window.location.reload();

    } catch (error) {

      alert(error.message);

    }

  });

}


// ================= LOGIN =================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

  loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = loginForm.querySelector('input[name="email"]').value;
    const password = loginForm.querySelector('input[name="password"]').value;

    try {

      await signInWithEmailAndPassword(auth, email, password);

      alert("Login Successful!");

      window.location.reload();

    } catch (error) {

      alert(error.message);

    }

  });

}


// ================= NAVBAR AUTH =================

const authArea = document.getElementById("auth-area");

onAuthStateChanged(auth, (user) => {

  if (!authArea) return;

  if (user) {

    const initial = user.email.charAt(0).toUpperCase();

    authArea.innerHTML = `

      <div class="profile-menu">

        <div class="profile-circle" id="profileBtn">
          ${initial}
        </div>

        <div id="dropdown-menu" class="dropdown-menu">

          <p>${user.email}</p>

          <a href="#" id="logoutBtn">Logout</a>

        </div>

      </div>

    `;

    // dropdown

    const profileBtn = document.getElementById("profileBtn");

    profileBtn.addEventListener("click", () => {

      document
        .getElementById("dropdown-menu")
        .classList.toggle("show");

    });

    // logout

    document
      .getElementById("logoutBtn")
      .addEventListener("click", async () => {

        await signOut(auth);

        alert("Logged Out!");

        window.location.reload();

      });

  }

  else {

    authArea.innerHTML = `
      <a href="auth.html" class="login-btn">
        Login
      </a>
    `;

  }

});