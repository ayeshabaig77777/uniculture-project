// Shared helper to track "recently viewed" items across all detail pages.
// Stored in localStorage (per-browser), not tied to a specific Firestore user document,
// so it works even for logged-out browsing and stays fast (no extra database reads).

const STORAGE_KEY = "uniculture_recently_viewed";
const MAX_ITEMS = 8;

export function trackView(item) {

  // item shape: { type, id, title, image, url }

  try {

    let list = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    // remove any existing entry for the same item, then put it at the front
    list = list.filter((i) => !(i.type === item.type && i.id === item.id));
    list.unshift({ ...item, viewedAt: Date.now() });

    if (list.length > MAX_ITEMS) {
      list = list.slice(0, MAX_ITEMS);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

  } catch (error) {
    console.error("Could not track recently viewed item:", error);
  }

}

export function getRecentlyViewed() {

  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    return [];
  }

}