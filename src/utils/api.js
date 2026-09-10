import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://shop-co-ecommerce-backend.vercel.app";

// Normalize tokens so requests always send exactly one Bearer prefix.
export const getAuthToken = () => {
  const storedToken = localStorage.getItem("token")?.trim();
  if (!storedToken) return "";
  return storedToken.replace(/^Bearer\s+/i, "");
};

// Attach the current auth token to every cart request.
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // A 401 means the saved session is no longer valid.
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("shopco_user");
      window.dispatchEvent(new Event("shopco-auth-changed"));
    }
    return Promise.reject(error);
  },
);

export const cartApi = {
  // Keep all cart endpoints in one reusable API helper.
  get: () => apiClient.get("/api/cart"),
  add: (productId, quantity = 1) => apiClient.post("/api/cart", { productId, quantity }),
  update: (productId, quantity) => apiClient.put(`/api/cart/${productId}`, { quantity }),
  remove: (productId) => apiClient.delete(`/api/cart/${productId}`),
  clear: () => apiClient.delete("/api/cart"),
};

export const loginUser = async (email, password) => {
  const response = await apiClient.post("/api/login", { email, password });
  const data = response.data?.data ?? response.data;
  return {
    token: data?.token,
    user: data?.user,
    message: data?.message,
  };
};

export const checkoutApi = {
  summary: () => apiClient.get("/api/checkout/summary"),
  applyPromo: (promoCode, cartItems) =>
    apiClient.post("/api/checkout/apply-promo", { promoCode, cartItems }),
  createOrder: (orderData) => apiClient.post("/api/orders", orderData),
};

export const ordersApi = {
  getAll: () => apiClient.get("/api/orders"),
  getById: (orderId) => apiClient.get(`/api/orders/${orderId}`),
  delete: (orderId) => apiClient.delete(`/api/orders/${orderId}`),
};

export const productsApi = {
  getAll: () => apiClient.get("/api/products"),
  getById: (productId) => apiClient.get(`/api/products/${productId}`),
  getNewArrivals: () => apiClient.get("/api/products/new-arrivals"),
  getTopSelling: () => apiClient.get("/api/products/top-selling"),
};

export default apiClient;
