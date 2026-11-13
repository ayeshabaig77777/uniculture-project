import { escapeHTML, safeUrl } from "./utils.js";

import { auth, db } from "./firebase-config.js";

import { logActivity } from "./activity-log.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// ================= CLOUDINARY CONFIG =================

const CLOUDINARY_CLOUD_NAME = "os8n1ams";
const CLOUDINARY_UPLOAD_PRESET = "ml_default_xsx";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;


// Only images and documents are allowed. Audio/video are blocked on purpose
// (large files can cause Firebase Storage bandwidth/size issues on the free plan).
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation"
];

const MAX_FILE_SIZE_MB = 5;

const form = document.getElementById("contributeForm");
const myContributionsBox = document.getElementById("myContributions");
const submitBtn = form.querySelector(".submit-btn");

let currentUser = null;


// ================= AUTH STATE =================

onAuthStateChanged(auth, (user) => {

  currentUser = user;

  if (user) {
    loadMyContributions(user.uid);
  } else {
    myContributionsBox.innerHTML = `
      <div class="empty-box">
        <h3>Login Required</h3>
        <p>Please login to see and submit your contributions.</p>
      </div>
    `;
  }

});


// ================= FORM SUBMIT =================

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  if (!currentUser) {
    alert("Please login before submitting a contribution.");
    return;
  }

  const type = document.getElementById("type").value;
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const region = document.getElementById("region").value;
  const category = document.getElementById("category").value;
  const tagsInput = document.getElementById("tags").value.trim();
  const tags = tagsInput
    ? tagsInput.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
    : [];
  const fileInput = document.getElementById("file");
  const file = fileInput.files[0];

  if (!type || !title || !description || !region || !category) {
    alert("Please fill in all required fields.");
    return;
  }

  // Validate file (optional field, but if provided must pass checks)
  if (file) {

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Only image files (jpg, png, webp, gif) or documents (pdf, doc, docx, ppt, pptx) are allowed. Audio and video files are not supported.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`File is too large. Please upload a file smaller than ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {

    let fileURL = null;
    let fileName = null;

    if (file) {

      fileURL = await uploadToCloudinary(file);
      fileName = file.name;

    }

    await addDoc(collection(db, "Contributions"), {
      type,
      title,
      description,
      region,
      category,
      tags,
      fileURL,
      fileName,
      uid: currentUser.uid,
      userEmail: currentUser.email,
      contributorName: currentUser.displayName || "Community Member",
      status: "pending",
      likeCount: 0,
      commentCount: 0,
      createdAt: serverTimestamp()
    });

    alert("Contribution submitted! It will appear publicly once approved.");

    await logActivity(currentUser.uid, "submitted", title);

    form.reset();
    loadMyContributions(currentUser.uid);

  } catch (error) {

    console.error(error);
    alert("Something went wrong while submitting: " + error.message);

  } finally {

    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Contribution";

  }

});


// ================= CLOUDINARY UPLOAD =================

async function uploadToCloudinary(file) {

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error("Image/document upload failed. Please try again.");
  }

  const data = await response.json();
  return data.secure_url;

}


// ================= LOAD MY CONTRIBUTIONS =================

async function loadMyContributions(uid) {

  myContributionsBox.innerHTML = `<p>Loading your contributions...</p>`;

  try {

    const q = query(
      collection(db, "Contributions"),
      where("uid", "==", uid),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      myContributionsBox.innerHTML = `
        <div class="empty-box">
          <h3>No Contributions Yet</h3>
          <p>Your submitted contributions will appear here.</p>
        </div>
      `;
      return;
    }

    myContributionsBox.innerHTML = "";

    snapshot.forEach((docSnap) => {

      const data = docSnap.data();

      myContributionsBox.innerHTML += `
        <div class="contribution-item">
          <div class="contribution-item-row">
            ${data.fileURL ? `<img src="${escapeHTML(safeUrl(data.fileURL))}" alt="${escapeHTML(data.title)}">` : ""}
            <div>
              <h4>${escapeHTML(data.title)}</h4>
              <p>${escapeHTML(data.category)} • ${escapeHTML(data.region)}</p>
            </div>
          </div>
          <span class="status status-${escapeHTML(data.status)}">${escapeHTML(data.status)}</span>
        </div>
      `;

    });

  } catch (error) {

    console.error(error);
    myContributionsBox.innerHTML = `<p>Could not load your contributions right now.</p>`;

  }

}