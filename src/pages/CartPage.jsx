import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/Cart.css";
import { ChevronRight, Trash2, Minus, Plus, Tag, ArrowRight } from "lucide-react";
import { useCart } from "../context/useCart.js";
import { ordersApi, productsApi } from "../utils/api";
import { getProductImageUrl, PLACEHOLDER_IMAGE } from "../utils/imageUrl";

const DISCOUNT_RATE = 0.2;
const DELIVERY_FEE = 15;
const ORDER_IMAGE_CACHE_KEY = "shopco_order_images";

const getOrderItemImage = (item) => {
  const directImage = item?.image || item?.Image || item?.product?.image || item?.product?.Image || item?.product?.images?.[0];
  if (directImage) return directImage;
  try {
    const cachedImages = JSON.parse(localStorage.getItem(ORDER_IMAGE_CACHE_KEY) || "{}");
    return cachedImages[item?.productId] || "";
  } catch {
    return "";
  }
};

const getOrderProductId = (item) => {
  if (item?.productId && typeof item.productId === "object") {
    return item.productId._id || item.productId.id || item.productId.productId;
  }
  if (item?.product && typeof item.product === "object") {
    return item.product._id || item.product.id || item.product.productId;
  }
  return item?.productId || item?.product_id || item?.productID || item?.ProductId || item?.id || item?._id || (typeof item?.product === "string" ? item.product : "");
};

const getProductImage = (product) => product?.Image || product?.image || product?.images?.[0] || "";

function CartItem({ item, onRemove, onQtyChange, isUpdating }) {
  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img
          src={getProductImageUrl(item.image)}
          alt={item.title}
          className="cart-item-image__img"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = PLACEHOLDER_IMAGE;
          }}
        />
      </div>
      <div className="cart-item-info">
        <div className="cart-item-top">
          <h3 className="cart-item-name">{item.title}</h3>
          <button
            className="delete-btn"
            type="button"
            onClick={() => onRemove(item.productId)}
            aria-label={`Remove ${item.title}`}
            disabled={isUpdating}
          >
            <Trash2 size={18} />
          </button>
        </div>
        <div className="cart-item-bottom">
          <span className="cart-item-price">${item.price.toFixed(2)}</span>
          <div className="qty-selector" aria-label={`Quantity for ${item.title}`}>
            <button
              className="qty-btn"
              type="button"
              onClick={() => onQtyChange(item.productId, item.quantity - 1)}
              aria-label="Decrease quantity"
              disabled={isUpdating || item.quantity <= 1}
            >
              <Minus size={14} />
            </button>
            <span className="qty-value">{isUpdating ? "..." : item.quantity}</span>
            <button
              className="qty-btn"
              type="button"
              onClick={() => onQtyChange(item.productId, item.quantity + 1)}
              aria-label="Increase quantity"
              disabled={isUpdating}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
        <p className="cart-item-total">Item total: ${(item.price * item.quantity).toFixed(2)}</p>
      </div>
    </div>
  );
}

export default function CartPage() {
  // Cart controls use the shared provider, which keeps state in sync with the API.
  const { items, isLoading, error, notice, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const [updatingId, setUpdatingId] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    let isMounted = true;
    ordersApi.getAll()
      .then(async (response) => {
        if (!isMounted) return;
        const data = response.data?.orders || response.data;
        const loadedOrders = Array.isArray(data) ? data : [];
        setOrders(loadedOrders);
        const catalogResponses = await Promise.allSettled([
          productsApi.getAll(),
          productsApi.getNewArrivals(),
          productsApi.getTopSelling(),
        ]);
        const catalog = catalogResponses.flatMap((result) => {
          if (result.status !== "fulfilled") return [];
          const value = result.value.data?.products || result.value.data;
          return Array.isArray(value) ? value : [];
        });
        const missingImageItems = loadedOrders.flatMap((order) => (order.items || [])
          .filter((item) => !getOrderItemImage(item))
          .map((item) => ({ item, productId: getOrderProductId(item) }))
          .filter(({ item, productId }) => productId || item?.title || item?.price || item?.Price));
        await Promise.all(missingImageItems.map(async ({ item, productId }) => {
          try {
            let product = productId
              ? catalog.find((candidate) => String(candidate._id) === String(productId) || String(candidate.id) === String(productId))
              : null;
            if (!product && productId) {
              const productResponse = await productsApi.getById(productId);
              product = productResponse.data?.product || productResponse.data;
            }
            if (!product) {
              product = catalog.find((candidate) => {
                const candidateTitle = candidate.ProductTitle || candidate.title || candidate.name;
                const itemTitle = item.title || item.ProductTitle || item.name;
                return (itemTitle && candidateTitle === itemTitle) || (Number(item.price || item.Price) === Number(candidate.Price || candidate.price));
              });
            }
            const image = getProductImage(product);
            if (image) {
              item.image = image;
              item.title = item.title || product.ProductTitle || product.title || product.name;
            }
          } catch {
            // Keep the placeholder when an old product is no longer available.
          }
        }));
        if (isMounted) setOrders([...loadedOrders]);
      })
      .catch((requestError) => {
        if (isMounted && requestError.response?.status !== 401) {
          setOrdersError(requestError.response?.data?.message || "Unable to load previous orders.");
        }
      })
      .finally(() => {
        if (isMounted) setOrdersLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const handleQuantityChange = async (productId, quantity) => {
    setUpdatingId(productId);
    await updateQuantity(productId, quantity);
    setUpdatingId(null);
  };

  const handleRemove = async (productId) => {
    setUpdatingId(productId);
    await removeItem(productId);
    setUpdatingId(null);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal * DISCOUNT_RATE;
  const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  return (
    <div className="cart-root">
      <div className="cart-container">
        <div className="breadcrumb">
          <span className="crumb-faint">Home</span>
          <ChevronRight size={13} />
          <span className="crumb-current">Cart</span>
        </div>
        <div className="cart-heading-row">
          <h1 className="cart-heading">YOUR CART</h1>
          {items.length > 0 && (
            <button type="button" className="clear-cart-btn" onClick={clearCart} disabled={isLoading}>
              Clear Cart
            </button>
          )}
        </div>

        {error && <p className="cart-feedback cart-feedback--error" role="alert">{error}</p>}
        {notice && <p className="cart-feedback" role="status">{notice}</p>}
        {isLoading && items.length === 0 ? (
          <div className="empty-cart">Loading your cart...</div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items-card">
              {items.length === 0 ? (
                <div className="empty-cart">Your cart is empty.</div>
              ) : (
                items.map((item, index) => (
                  <React.Fragment key={item.productId || index}>
                    <CartItem
                      item={item}
                      onRemove={handleRemove}
                      onQtyChange={handleQuantityChange}
                      isUpdating={updatingId === item.productId}
                    />
                    {index < items.length - 1 && <div className="item-divider" />}
                  </React.Fragment>
                ))
              )}
            </div>

            <div className="summary-card">
              <h2 className="summary-title">Order Summary</h2>
              <div className="summary-row">
                <span className="summary-label">Subtotal</span>
                <span className="summary-value">${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Discount (-{Math.round(DISCOUNT_RATE * 100)}%)</span>
                <span className="summary-value discount">-${discount.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Delivery Fee</span>
                <span className="summary-value">${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row total-row">
                <span className="summary-label total-label">Total</span>
                <span className="summary-value total-value">${total.toFixed(2)}</span>
              </div>
              <div className="promo-row">
                <div className="promo-input-wrap">
                  <Tag size={16} className="promo-icon" />
                  <input
                    type="text"
                    className="promo-input"
                    placeholder="Add promo code"
                    value={promoCode}
                    onChange={(event) => setPromoCode(event.target.value)}
                  />
                </div>
                <button className="apply-btn" type="button">Apply</button>
              </div>
              <button
                className="checkout-btn"
                type="button"
                disabled={!items.length}
                onClick={() => navigate("/checkout", { state: { promoCode: "WELCOME20" } })}
              >
                Go to Checkout <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        <section className="order-history" aria-labelledby="order-history-title">
          <div className="order-history-heading">
            <div>
              <p className="order-history-eyebrow">Your account</p>
              <h2 id="order-history-title">Previous Orders</h2>
            </div>
            <button type="button" className="order-history-link" onClick={() => navigate("/orders")}>
              View all orders
            </button>
          </div>
          {ordersLoading && <p className="order-history-status">Loading your orders...</p>}
          {ordersError && <p className="order-history-status order-history-status--error" role="alert">{ordersError}</p>}
          {!ordersLoading && !ordersError && orders.length === 0 && (
            <p className="order-history-status">No previous orders yet.</p>
          )}
          {!ordersLoading && !ordersError && orders.map((order) => (
            <article className="order-history-card" key={order._id}>
              <div className="order-history-card__top">
                <div>
                  <h3>Order #{order._id}</h3>
                  <p>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Recent order"}</p>
                </div>
                <span className="order-status">{order.status || "pending"}</span>
              </div>
              <div className="order-history-items">
                {(order.items || []).map((item, index) => (
                  <div className="order-history-item" key={item.productId || item._id || index}>
                    <div className="order-history-item__product">
                      <img
                        src={getProductImageUrl(getOrderItemImage(item))}
                        alt={item.title || item.product?.title || item.product?.ProductTitle || "Product"}
                        className="order-history-item__image"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = PLACEHOLDER_IMAGE;
                        }}
                      />
                      <span>{item.title || item.product?.title || item.product?.ProductTitle || "Product"} x {item.quantity}</span>
                    </div>
                    <strong>${Number(item.price || item.Price || 0).toFixed(2)}</strong>
                  </div>
                ))}
              </div>
              <div className="order-history-total">
                <span>Total</span>
                <strong>${Number(order.total || 0).toFixed(2)}</strong>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
