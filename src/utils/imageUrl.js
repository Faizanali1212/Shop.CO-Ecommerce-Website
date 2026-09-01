// ==============================================================================
// 1. BACKEND & IMAGE CONFIGURATION
// ==============================================================================
// Backend ka live base URL jahan pe MongoDB se images aur API serve hoti hai.
export const BACKEND_URL = "https://shop-co-ecommerce-backend.vercel.app";

// Agar kisi product ki image na mile ya link toot jaye (broken), toh yeh local fallback image show hogi.
export const PLACEHOLDER_IMAGE = "/placeholder.png";

/**
 * ==============================================================================
 * getProductImageUrl Helper Function
 * ==============================================================================
 * SAMJHNE KE LIYE LOGIC (EXPLANATION):
 * Backend se aane wale image path mukhtalif types ke ho sakte hain, jaise:
 * 1. Relative path: "images/NewArrivals-img/image_7.png"
 * 2. Dot-dot path:  "../images/NewArrivals-img/image_8.png"
 * 3. Slash path:    "/images/NewArrivals-img/image_7.png"
 * 4. Absolute link: "https://example.com/image.png"
 * 5. Khali ya undefined: null / undefined / ""
 *
 * Yeh function:
 * - Pehle check karta hai ke image string mojood hai ya nahi (warna placeholder return karta hai).
 * - Agar image pehle se 'http://' ya 'https://' se shuru ho rahi ho, toh usko wese hi rakhta hai.
 * - Agar '../' ya './' ya '/' shuru mein ho, toh regex se unhein hata karBackend URL ke sath jod deta hai.
 * - 'encodeURI()' use karta hai taake agar path mein spaces ya special characters hon toh browser unhein sahi se load kar sake.
 *
 * @param {string} rawImage - Backend se aane wali image ka string path ya URL
 * @returns {string} Proper workable image URL
 */
export function getProductImageUrl(rawImage) {
  // Step 1: Agar rawImage null, undefined ya string nahi hai toh fallback placeholder do
  if (!rawImage || typeof rawImage !== "string") {
    return PLACEHOLDER_IMAGE;
  }

  // Step 2: Extra spaces khatam karo
  const trimmed = rawImage.trim();
  if (!trimmed) {
    return PLACEHOLDER_IMAGE;
  }

  // Step 3: Agar pehle se poora URL (http/https) ya Base64 Data URI hai, toh direct encode karke return karo
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    return encodeURI(trimmed);
  }

  // Step 4: Relative paths ke shuru se '../', './' ya '/' hatao taake backend URL ke sath double slash na bane
  const cleanPath = trimmed
    .replace(/^(\.\.\/)+/, "") // Shuru ke saare "../" hata dega
    .replace(/^(\.\/)+/, "")   // Shuru ke saare "./" hata dega
    .replace(/^\/+/, "");      // Shuru ke saare "/" hata dega

  // Step 5: Backend URL ke sath clean path jod kar safe URL banayein
  return encodeURI(`${BACKEND_URL}/${cleanPath}`);
}
