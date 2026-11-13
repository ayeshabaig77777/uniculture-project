import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import {
  getAuth
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
import {
  initializeFirestore
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyCLVJv2Htye9siFXOsm1ckPWciVKCmcGRM",
  authDomain: "uniculture-762fa.firebaseapp.com",
  projectId: "uniculture-762fa",
  storageBucket: "uniculture-762fa.firebasestorage.app",
  messagingSenderId: "1032554956673",
  appId: "1:1032554956673:web:e6103a168bd6ed75920a80",
  measurementId: "G-RTS03HXCZ3"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Some networks/antivirus/browser extensions block Firestore's normal
// WebSocket-style connection, forcing a slow fallback and causing multi-second
// delays on every read. auto-detecting long-polling upfront avoids that stall.
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true
});