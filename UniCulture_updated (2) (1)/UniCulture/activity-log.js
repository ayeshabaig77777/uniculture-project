import { db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// type: "submitted" | "approved" | "rejected" | "favorited" | "liked" | "commented"
export async function logActivity(uid, type, title) {

  try {

    await addDoc(collection(db, "Activity"), {
      uid,
      type,
      title,
      createdAt: serverTimestamp()
    });

  } catch (error) {
    console.error("Could not log activity:", error);
  }

}


export async function getAllActivity(uid, maxItems = 200) {
  return getRecentActivity(uid, maxItems);
}


export async function getRecentActivity(uid, maxItems = 6) {

  try {

    const q = query(
      collection(db, "Activity"),
      where("uid", "==", uid),
      orderBy("createdAt", "desc"),
      limit(maxItems)
    );

    const snapshot = await getDocs(q);
    const items = [];

    snapshot.forEach((docSnap) => items.push(docSnap.data()));

    return items;

  } catch (error) {
    console.error("Could not load activity:", error);
    return [];
  }

}


export function activityLabel(item) {

  const labels = {
    submitted: `You submitted "${item.title}"`,
    approved: `Your contribution "${item.title}" was approved`,
    rejected: `Your contribution "${item.title}" was rejected`,
    favorited: `You favorited "${item.title}"`,
    liked: `You liked "${item.title}"`,
    commented: `You commented on "${item.title}"`,
    quiz: `You took the culture quiz — matched "${item.title}"`
  };

  return labels[item.type] || item.title;

}


export function activityIcon(item) {

  const icons = {
    submitted: "📤",
    approved: "✅",
    rejected: "❌",
    favorited: "❤️",
    liked: "👍",
    commented: "💬",
    quiz: "🧭"
  };

  return icons[item.type] || "•";

}


export function activityTime(item) {

  if (!item.createdAt || !item.createdAt.toDate) return "";

  const diffMs = Date.now() - item.createdAt.toDate().getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));

  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;

}