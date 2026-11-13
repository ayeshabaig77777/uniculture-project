import { confirmDialog } from "./toast.js";

import { escapeHTML, safeUrl } from "./utils.js";

import { auth, db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  increment,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import { logActivity } from "./activity-log.js";


export function commentSectionHTML(contributionId) {

  return `
    <div class="comment-section" data-id="${contributionId}">

      <button class="toggle-comments-btn" data-id="${contributionId}">View comments</button>

      <div class="comments-box" id="comments-${contributionId}" style="display:none;">

        <div class="comments-list"></div>

        <form class="comment-form" data-id="${contributionId}">
          <input type="text" class="comment-input" placeholder="Add a comment..." required>
          <button type="submit">Post</button>
        </form>

      </div>

    </div>
  `;

}


export function initComments(gridEl) {

  gridEl.addEventListener("click", async (e) => {

    // Delete button on the user's own comment
    const deleteBtn = e.target.closest(".comment-delete-btn");
    if (deleteBtn) {
      await deleteOwnComment(deleteBtn);
      return;
    }

    const toggleBtn = e.target.closest(".toggle-comments-btn");
    if (!toggleBtn) return;

    const id = toggleBtn.dataset.id;
    const box = document.getElementById(`comments-${id}`);

    const isOpen = box.style.display !== "none";

    if (isOpen) {
      box.style.display = "none";
      toggleBtn.textContent = "View comments";
      return;
    }

    box.style.display = "block";
    toggleBtn.textContent = "Hide comments";

    await loadComments(id, box.querySelector(".comments-list"));

  });

  gridEl.addEventListener("submit", async (e) => {

    const form = e.target.closest(".comment-form");
    if (!form) return;

    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {
      alert("Please login to comment.");
      return;
    }

    const contributionId = form.dataset.id;
    const input = form.querySelector(".comment-input");
    const text = input.value.trim();

    if (!text) return;

    try {

      await addDoc(collection(db, "Comments"), {
        contributionId,
        uid: user.uid,
        userName: user.displayName || "Community Member",
        text,
        createdAt: serverTimestamp()
      });

      await updateDoc(doc(db, "Contributions", contributionId), {
        commentCount: increment(1)
      });

      await logActivity(user.uid, "commented", text.slice(0, 40));

      input.value = "";

      adjustCountLabel(contributionId, 1);

      const box = document.getElementById(`comments-${contributionId}`);
      await loadComments(contributionId, box.querySelector(".comments-list"));

    } catch (error) {
      console.error("Could not post comment:", error);
    }

  });

}


async function loadComments(contributionId, listEl) {

  listEl.innerHTML = `<p class="comment-loading">Loading comments...</p>`;

  try {

    const q = query(
      collection(db, "Comments"),
      where("contributionId", "==", contributionId),
      orderBy("createdAt", "asc")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      listEl.innerHTML = `<p class="comment-empty">No comments yet. Be the first!</p>`;
      return;
    }

    const currentUid = auth.currentUser ? auth.currentUser.uid : null;

    listEl.innerHTML = snapshot.docs.map((docSnap) => {

      const data = docSnap.data();

      // Only the person who wrote the comment sees the delete button
      const deleteBtn = currentUid && data.uid === currentUid
        ? `<button type="button" class="comment-delete-btn"
             data-comment-id="${escapeHTML(docSnap.id)}"
             data-contribution-id="${escapeHTML(contributionId)}"
             title="Delete your comment"
             style="background:none;border:0;color:#c0392b;cursor:pointer;font-size:13px;padding:0;">Delete</button>`
        : "";

      return `
        <div class="comment-item">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;">
            <strong>${escapeHTML(data.userName)}</strong>
            ${deleteBtn}
          </div>
          <p>${escapeHTML(data.text)}</p>
        </div>
      `;

    }).join("");

  } catch (error) {

    console.error(error);
    listEl.innerHTML = `<p class="comment-empty">Could not load comments.</p>`;

  }

}


// ================= DELETE OWN COMMENT =================

async function deleteOwnComment(btn) {

  const user = auth.currentUser;
  if (!user) return;

  if (!(await confirmDialog("Delete this comment?", { confirmText: "Delete", danger: true }))) return;

  const commentId = btn.dataset.commentId;
  const contributionId = btn.dataset.contributionId;

  btn.disabled = true;
  btn.textContent = "Deleting...";

  try {

    // Firestore rules also make sure only the owner can delete
    await deleteDoc(doc(db, "Comments", commentId));

  } catch (error) {

    console.error("Could not delete comment:", error);
    alert("Could not delete the comment. Please try again.");
    btn.disabled = false;
    btn.textContent = "Delete";
    return;

  }

  // Lower the comment counter on the post (a failure here is not critical)
  try {
    await updateDoc(doc(db, "Contributions", contributionId), {
      commentCount: increment(-1)
    });
  } catch (error) {
    console.error("Could not update comment count:", error);
  }

  adjustCountLabel(contributionId, -1);

  const box = document.getElementById(`comments-${contributionId}`);
  if (box) {
    await loadComments(contributionId, box.querySelector(".comments-list"));
  }

}


// Updates the "💬 N" label on the post card without reloading the page
function adjustCountLabel(contributionId, delta) {

  const box = document.getElementById(`comments-${contributionId}`);
  if (!box) return;

  const card = box.closest(".community-card");
  if (!card) return;

  const label = card.querySelector(".comment-count-label");
  if (!label) return;

  const current = parseInt(label.textContent.replace(/\D/g, ""), 10) || 0;
  label.textContent = `💬 ${Math.max(0, current + delta)}`;

}