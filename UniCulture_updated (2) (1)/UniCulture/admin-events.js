import { confirmDialog } from "./toast.js";

import { db } from "./firebase-config.js";

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const listEl = document.getElementById("eventAdminList");
const formBox = document.getElementById("eventFormBox");
const form = document.getElementById("eventForm");

const addBtn = document.getElementById("addEventBtn");
const cancelBtn = document.getElementById("cancelEventForm");

const fields = {
  docId: document.getElementById("eventDocId"),
  name: document.getElementById("eventName"),
  description: document.getElementById("eventDescription"),
  category: document.getElementById("eventCategory"),
  date: document.getElementById("eventDate"),
  venue: document.getElementById("eventVenue"),
  region: document.getElementById("eventRegion"),
  image: document.getElementById("eventImage"),
  featured: document.getElementById("eventFeatured")
};


// This file only builds the UI/logic. admin.js already checks that the
// logged-in user is an approved admin before this page is usable, so we
// just wire up the buttons here — no separate access check needed.

export async function loadAdminEvents() {

  listEl.innerHTML = `<p>Loading events...</p>`;

  try {

    const snapshot = await getDocs(collection(db, "events"));

    if (snapshot.empty) {
      listEl.innerHTML = `<p>No events yet. Click "+ Add Event" to create one.</p>`;
      return;
    }

    listEl.innerHTML = "";

    snapshot.forEach((docSnap) => {

      const data = docSnap.data();
      const id = docSnap.id;

      listEl.innerHTML += `
        <div class="admin-card" id="event-card-${id}">
          <div class="admin-card-header">
            <h3>${data.name}</h3>
            <span class="status status-approved">${data.category || ""}</span>
          </div>
          <p>${data.description || ""}</p>
          <p class="admin-meta">📅 ${data.date || "TBA"} &nbsp; · &nbsp; 📍 ${data.venue || "TBA"} &nbsp; · &nbsp; Region: ${data.region || "-"} ${data.featured ? " · ⭐ Featured" : ""}</p>
          <div class="admin-actions">
            <button class="approve-btn" data-edit="${id}">Edit</button>
            <button class="reject-btn" data-delete="${id}">Delete</button>
          </div>
        </div>
      `;

    });

    listEl.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () => openForm(btn.dataset.edit, snapshot));
    });

    listEl.querySelectorAll("[data-delete]").forEach((btn) => {
      btn.addEventListener("click", () => deleteEvent(btn.dataset.delete));
    });

  } catch (error) {

    console.error(error);
    listEl.innerHTML = `<p>Could not load events right now.</p>`;

  }

}


function openForm(editId, snapshot) {

  form.reset();
  fields.docId.value = "";

  if (editId) {

    const docSnap = snapshot.docs.find((d) => d.id === editId);
    const data = docSnap.data();

    fields.docId.value = editId;
    fields.name.value = data.name || "";
    fields.description.value = data.description || "";
    fields.category.value = data.category || "";
    fields.date.value = data.date || "";
    fields.venue.value = data.venue || "";
    fields.region.value = data.region || "punjab";
    fields.image.value = data.image || "";
    fields.featured.checked = !!data.featured;

  }

  formBox.style.display = "block";
  formBox.scrollIntoView({ behavior: "smooth", block: "center" });

}


addBtn.addEventListener("click", () => openForm(null, null));

cancelBtn.addEventListener("click", () => {
  formBox.style.display = "none";
  form.reset();
});


form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const eventData = {
    name: fields.name.value.trim(),
    description: fields.description.value.trim(),
    category: fields.category.value.trim(),
    date: fields.date.value.trim(),
    venue: fields.venue.value.trim(),
    region: fields.region.value,
    image: fields.image.value.trim(),
    featured: fields.featured.checked
  };

  try {

    if (fields.docId.value) {
      await updateDoc(doc(db, "events", fields.docId.value), eventData);
    } else {
      await addDoc(collection(db, "events"), eventData);
    }

    formBox.style.display = "none";
    form.reset();
    loadAdminEvents();

  } catch (error) {

    console.error(error);
    alert("Could not save event: " + error.message);

  }

});


async function deleteEvent(id) {

  if (!(await confirmDialog("Delete this event? This cannot be undone.", { confirmText: "Delete", danger: true }))) return;

  try {
    await deleteDoc(doc(db, "events", id));
    loadAdminEvents();
  } catch (error) {
    console.error(error);
    alert("Could not delete event: " + error.message);
  }

}