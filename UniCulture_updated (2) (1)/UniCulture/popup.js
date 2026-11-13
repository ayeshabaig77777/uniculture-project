import "./toast.js";

import { auth, db } from "./firebase-config.js";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


const popup = document.getElementById("authPopup");

const closePopup = document.getElementById("closePopup");

let loginForm = document.getElementById("loginForm");

let signupForm = document.getElementById("signupForm");


// Set to true while a new account is being created, so the record below is not written twice
let signingUp = false;


// ================= USER RECORD (AUTO-CREATE / FIX) =================
// Runs on every page load for a logged-in user:
//  1. Creates the Firestore "Users" record if it is missing (old accounts).
//  2. Fills in a missing email, name or joined date.
//  3. Logs out a banned user, even if they are already logged in.

async function ensureUserRecord(user) {

  if (!user || signingUp) return;

  try {

    const ref = doc(db, "Users", user.uid);
    const snap = await getDoc(ref);

    const createdAt = user.metadata && user.metadata.creationTime
      ? Timestamp.fromDate(new Date(user.metadata.creationTime))
      : serverTimestamp();

    if (!snap.exists()) {
      await setDoc(ref, {
        name: user.displayName || "",
        email: user.email || "",
        joinedAt: createdAt,
        banned: false
      });
      return;
    }

    const data = snap.data();

    if (data.banned === true) {
      await signOut(auth);
      location.reload();
      return;
    }

    const fixes = {};
    if (!data.email && user.email) fixes.email = user.email;
    if (!data.name && user.displayName) fixes.name = user.displayName;
    if (!data.joinedAt) fixes.joinedAt = createdAt;

    if (Object.keys(fixes).length > 0) {
      await updateDoc(ref, fixes);
    }

  } catch (error) {
    console.error("Could not sync user record:", error);
  }

}

onAuthStateChanged(auth, ensureUserRecord);


// ================= HELPERS =================

// Turns Firebase error codes into simple messages
function friendlyError(error) {
  switch (error.code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "This email is already registered. Try logging in instead.";
    case "auth/weak-password":
      return "Password must be at least 6 characters long.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again in a little while.";
    case "auth/network-request-failed":
      return "Network problem. Please check your internet connection.";
    default:
      return error.message || "Something went wrong. Please try again.";
  }
}

// Shows a red error message inside the form (instead of an alert)
function showError(form, message) {
  let box = form.querySelector(".auth-error");

  if (!box) {
    box = document.createElement("p");
    box.className = "auth-error";
    box.style.color = "#c0392b";
    box.style.fontSize = "14px";
    box.style.margin = "8px 0";
    box.style.textAlign = "center";

    const btn = form.querySelector("button");
    if (btn) {
      form.insertBefore(box, btn);
    } else {
      form.appendChild(box);
    }
  }

  box.textContent = message;
}

function clearError(form) {
  const box = form.querySelector(".auth-error");
  if (box) box.textContent = "";
}

// Puts the button into "Please wait..." mode
function setLoading(form, isLoading, loadingText) {
  const btn = form.querySelector("button");
  if (!btn) return;

  if (isLoading) {
    btn.dataset.originalText = btn.textContent;
    btn.textContent = loadingText;
    btn.disabled = true;
  } else {
    btn.textContent = btn.dataset.originalText || btn.textContent;
    btn.disabled = false;
  }
}


// ================= LOGIN/SIGNUP TAB SWITCH =================

const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

if (loginTab && signupTab && loginForm && signupForm) {

  loginTab.addEventListener("click", () => {
    loginTab.classList.add("active");
    signupTab.classList.remove("active");
    loginForm.style.display = "block";
    signupForm.style.display = "none";
  });

  signupTab.addEventListener("click", () => {
    signupTab.classList.add("active");
    loginTab.classList.remove("active");
    signupForm.style.display = "block";
    loginForm.style.display = "none";
  });

}


// ================= OPEN POPUP =================
// Uses event delegation on document, so this also works for .protected-btn
// elements that get added to the page later (e.g. cards loaded from Firestore).

document.addEventListener("click", (e) => {

  const btn = e.target.closest(".protected-btn");
  if (!btn) return;

  const user = auth.currentUser;

  if (!user) {

    e.preventDefault();

    if (popup) {
      popup.classList.add("active");
      document.body.style.overflow = "hidden";
    }

  }

});


// ================= CLOSE =================

if (closePopup) {

  closePopup.onclick = () => {

    popup.classList.remove("active");
    document.body.style.overflow = "";

  };

}


// ================= LOGIN =================

if (loginForm) {

  loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    clearError(loginForm);

    const email = loginForm.querySelector("input[type=email]").value.trim();
    const password = loginForm.querySelector("input[type=password]").value;

    setLoading(loginForm, true, "Please wait...");

    try {

      const cred = await signInWithEmailAndPassword(auth, email, password);

      // Do not let a banned user in
      try {
        const snap = await getDoc(doc(db, "Users", cred.user.uid));
        if (snap.exists() && snap.data().banned === true) {
          await signOut(auth);
          showError(loginForm, "This account has been banned.");
          setLoading(loginForm, false);
          return;
        }
      } catch (checkError) {
        console.error("Ban check failed:", checkError);
      }

      // Refresh the page right away, no alert
      location.reload();

    } catch (error) {

      showError(loginForm, friendlyError(error));
      setLoading(loginForm, false);

    }

  });

}


// ================= SIGNUP =================

if (signupForm) {

  signupForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    clearError(signupForm);

    const fullName = signupForm.querySelector("input[type=text]").value.trim();
    const email = signupForm.querySelector("input[type=email]").value.trim();
    const password = signupForm.querySelector("input[type=password]").value;

    setLoading(signupForm, true, "Please wait...");

    signingUp = true;

    try {

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (fullName) {
        await updateProfile(userCredential.user, { displayName: fullName });
      }

      // IMPORTANT: keep the await. Without it, the reload below cuts the write off halfway.
      try {
        await setDoc(doc(db, "Users", userCredential.user.uid), {
          name: fullName || "",
          email: email,
          joinedAt: serverTimestamp(),
          banned: false
        });
      } catch (recordError) {
        console.error("Could not save user record:", recordError);
      }

      // Refresh the page right away, no alert
      location.reload();

    } catch (error) {

      signingUp = false;
      showError(signupForm, friendlyError(error));
      setLoading(signupForm, false);

    }

  });

}