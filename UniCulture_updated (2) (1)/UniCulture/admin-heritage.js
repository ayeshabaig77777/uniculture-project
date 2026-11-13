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

const listEl = document.getElementById("heritageAdminList");
const formBox = document.getElementById("heritageFormBox");
const form = document.getElementById("heritageForm");

const addBtn = document.getElementById("addHeritageBtn");
const cancelBtn = document.getElementById("cancelHeritageForm");

const fields = {
  docId: document.getElementById("heritageDocId"),
  name: document.getElementById("heritageName"),
  description: document.getElementById("heritageDescription"),
  image: document.getElementById("heritageImage"),
  city: document.getElementById("heritageCity"),
  province: document.getElementById("heritageProvince"),
  category: document.getElementById("heritageCategory"),
  built_year: document.getElementById("heritageBuiltYear"),
  architectural_style: document.getElementById("heritageStyle"),
  history: document.getElementById("heritageHistory"),
  significance: document.getElementById("heritageSignificance"),
  opening_hours: document.getElementById("heritageHours"),
  best_time_to_visit: document.getElementById("heritageBestTime"),
  fun_fact: document.getElementById("heritageFunFact")
};


export async function loadAdminHeritage() {

  listEl.innerHTML = `<p>Loading heritage sites...</p>`;

  try {

    const snapshot = await getDocs(collection(db, "Heritage"));

    if (snapshot.empty) {
      listEl.innerHTML = `<p>No heritage sites yet. Click "+ Add Heritage Site" to create one.</p>`;
      return;
    }

    listEl.innerHTML = "";

    snapshot.forEach((docSnap) => {

      const data = docSnap.data();
      const id = docSnap.id;

      listEl.innerHTML += `
        <div class="admin-card">
          <div class="admin-card-header">
            <h3>${data.name}</h3>
            <span class="status status-approved">${data.category || ""}</span>
          </div>
          <p>${data.description || ""}</p>
          <p class="admin-meta">📍 ${data.city || ""}, ${data.province || ""} &nbsp; · &nbsp; Built: ${data.built_year || "-"}</p>
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
      btn.addEventListener("click", () => deleteHeritage(btn.dataset.delete));
    });

  } catch (error) {

    console.error(error);
    listEl.innerHTML = `<p>Could not load heritage sites right now.</p>`;

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
    fields.image.value = data.image || "";
    fields.city.value = data.city || "";
    fields.province.value = data.province || "Punjab";
    fields.category.value = data.category || "";
    fields.built_year.value = data.built_year || "";
    fields.architectural_style.value = data.architectural_style || "";
    fields.history.value = data.history || "";
    fields.significance.value = data.significance || "";
    fields.opening_hours.value = data.opening_hours || "";
    fields.best_time_to_visit.value = data.best_time_to_visit || "";
    fields.fun_fact.value = data.fun_fact || "";

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

  const heritageData = {
    name: fields.name.value.trim(),
    description: fields.description.value.trim(),
    image: fields.image.value.trim(),
    city: fields.city.value.trim(),
    province: fields.province.value,
    category: fields.category.value.trim(),
    built_year: fields.built_year.value.trim(),
    architectural_style: fields.architectural_style.value.trim(),
    history: fields.history.value.trim(),
    significance: fields.significance.value.trim(),
    opening_hours: fields.opening_hours.value.trim(),
    best_time_to_visit: fields.best_time_to_visit.value.trim(),
    fun_fact: fields.fun_fact.value.trim()
  };

  try {

    if (fields.docId.value) {
      await updateDoc(doc(db, "Heritage", fields.docId.value), heritageData);
    } else {
      await addDoc(collection(db, "Heritage"), heritageData);
    }

    formBox.style.display = "none";
    form.reset();
    loadAdminHeritage();

  } catch (error) {

    console.error(error);
    alert("Could not save heritage site: " + error.message);

  }

});


async function deleteHeritage(id) {

  if (!(await confirmDialog("Delete this heritage site? This cannot be undone.", { confirmText: "Delete", danger: true }))) return;

  try {
    await deleteDoc(doc(db, "Heritage", id));
    loadAdminHeritage();
  } catch (error) {
    console.error(error);
    alert("Could not delete heritage site: " + error.message);
  }

}