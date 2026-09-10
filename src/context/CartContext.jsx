import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cartApi, getAuthToken } from "../utils/api";

const CartContext = createContext(null);

// Product IDs can come from either MongoDB or the frontend product shape.
const getProductId = (product) => product?._id || product?.id;
const ORDER_IMAGE_CACHE_KEY = "shopco_order_images";

const cacheItemImages = (items) => {
  try {
    const cachedImages = JSON.parse(localStorage.getItem(ORDER_IMAGE_CACHE_KEY) || "{}");
    items.forEach((item) => {
      if (item.productId && item.image) cachedImages[item.productId] = item.image;
    });
    localStorage.setItem(ORDER_IMAGE_CACHE_KEY, JSON.stringify(cachedImages));
  } catch {
    // Image caching is only a fallback and must not block cart loading.
  }
};

const extractItems = (payload) => {
  const value = payload?.data ?? payload;
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.cart)) return value.cart;
  if (Array.isArray(value?.cart?.items)) return value.cart.items;
  if (Array.isArray(value?.products)) return value.products;
  return [];
};

const normalizeItem = (item) => {
  const product = item?.product && typeof item.product === "object" ? item.product : {};
  const productId =
    getProductId(product) ||
    (typeof item?.productId === "object" ? getProductId(item.productId) : item?.productId) ||
    item?.id;

  return {
    ...item,
    productId,
    title: product.ProductTitle || product.title || product.name || item?.ProductTitle || item?.title || item?.name || "Product",
    price: Number(product.Price ?? product.price ?? item?.Price ?? item?.price ?? 0),
    image: product.Image || product.image || product.images?.[0] || item?.Image || item?.image || "",
    quantity: Number(item?.quantity ?? item?.qty ?? 1),
  };
};

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

export function CartProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const handleUnauthorized = () => {
    // Clear stale cart data before sending the user to login.
    setItems([]);
    setError("Your session has expired. Please log in again.");
    if (location.pathname !== "/login") navigate("/login", { replace: true });
  };

  // Keep cart state synced after login/logout and load it on app startup.
  const loadCart = async () => {
    const token = getAuthToken();
    if (!token) {
      setItems([]);
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await cartApi.get();
      const normalizedItems = extractItems(response).map(normalizeItem);
      setItems(normalizedItems);
      cacheItemImages(normalizedItems);
    } catch (requestError) {
      if (requestError.response?.status === 401) handleUnauthorized();
      else setError(getErrorMessage(requestError, "Unable to load your cart."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initialLoad = window.setTimeout(() => loadCart(), 0);
    const syncCart = () => loadCart();
    window.addEventListener("shopco-auth-changed", syncCart);
    window.addEventListener("storage", syncCart);
    return () => {
      window.clearTimeout(initialLoad);
      window.removeEventListener("shopco-auth-changed", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const runCartRequest = async (request, successMessage) => {
    if (!getAuthToken()) {
      navigate("/login", { state: { from: location.pathname } });
      return false;
    }

    setError("");
    try {
      // Every mutation updates state from the backend response.
      const response = await request();
      const normalizedItems = extractItems(response).map(normalizeItem);
      setItems(normalizedItems);
      cacheItemImages(normalizedItems);
      setNotice(successMessage);
      window.setTimeout(() => setNotice(""), 2500);
      return true;
    } catch (requestError) {
      if (requestError.response?.status === 401) handleUnauthorized();
      else setError(getErrorMessage(requestError, "Cart request failed. Please try again."));
      return false;
    }
  };

  const addToCart = (product, quantity = 1) => {
    // The backend receives only the product ID and requested quantity.
    const productId = getProductId(product);
    if (!productId) {
      setError("This product is missing an ID and cannot be added to cart.");
      return Promise.resolve(false);
    }
    return runCartRequest(
      () => cartApi.add(productId, quantity),
      `${product?.ProductTitle || product?.title || product?.name || "Product"} added to cart.`,
    );
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return Promise.resolve(false);
    return runCartRequest(() => cartApi.update(productId, quantity), "Cart quantity updated.");
  };

  const removeItem = (productId) =>
    runCartRequest(() => cartApi.remove(productId), "Item removed from cart.");

  const clearCart = () => runCartRequest(() => cartApi.clear(), "Cart cleared.");

  const value = {
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    isLoading,
    error,
    notice,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    loadCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export { CartContext };
