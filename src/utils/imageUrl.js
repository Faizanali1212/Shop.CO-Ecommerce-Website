export const BACKEND_URL = "https://shop-co-ecommerce-backend.vercel.app";
export const PLACEHOLDER_IMAGE = "https://placehold.co/100x100?text=No+Image";


export function getProductImageUrl(rawImage) {
  if (!rawImage || typeof rawImage !== "string") {
    return PLACEHOLDER_IMAGE;
  }
  const trimmed = rawImage.trim();
  if (!trimmed) {
    return PLACEHOLDER_IMAGE;
  }
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    return encodeURI(trimmed);
  }
  const cleanPath = trimmed
    .replace(/^(\.\.\/)+/, "")
    .replace(/^(\.\/)+/, "")
    .replace(/^\/+/, "");
  return encodeURI(`${BACKEND_URL}/${cleanPath}`);
}
