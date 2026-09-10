import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ordersApi } from "../utils/api";
import { getProductImageUrl, PLACEHOLDER_IMAGE } from "../utils/imageUrl";
import "../style/checkout.css";

const getOrderItemImage = (item) =>
  item?.image ||
  item?.Image ||
  item?.imageUrl ||
  item?.ImageUrl ||
  item?.productId?.image ||
  item?.productId?.Image ||
  item?.product?.image ||
  item?.product?.Image ||
  item?.product?.imageUrl ||
  item?.product?.images?.[0] ||
  "";

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    ordersApi.getById(orderId)
      .then((response) => setOrder(response.data?.order || response.data))
      .catch((requestError) => {
        if (requestError.response?.status === 401) navigate("/login");
        else setError(requestError.response?.data?.message || "Unable to load this order.");
      });
  }, [orderId, navigate]);

  return (
    <main className="checkout-page">
      <Link to="/orders" className="checkout-back-link">Back to orders</Link>
      {error && <p className="checkout-error" role="alert">{error}</p>}
      {!order && !error ? (
        <p className="checkout-status">Loading order...</p>
      ) : order && (
        <section className="checkout-panel order-detail">
          <p className="checkout-eyebrow">Order details</p>
          <h1>#{order._id}</h1>
          <p>Status: <strong>{order.status || order.orderStatus || "Pending"}</strong></p>
          <div className="order-detail-items">
            {(order.items || []).map((item, index) => {
              const itemName = item.productName || item.productTitle || item.title || item.product?.title || "Product";
              return (
                <div className="checkout-item" key={item.productId || index}>
                  <span className="order-detail-product">
                    <img
                      src={getProductImageUrl(getOrderItemImage(item))}
                      alt={itemName}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                    <span>{itemName} x {item.quantity}</span>
                  </span>
                  <strong>${Number(item.price || item.Price || 0).toFixed(2)}</strong>
                </div>
              );
            })}
          </div>
          <div className="checkout-total-row">
            <span>Subtotal</span>
            <strong>${Number(order.subtotal || 0).toFixed(2)}</strong>
          </div>
          <div className="checkout-total-row">
            <span>Discount</span>
            <strong className="checkout-discount">-${Number(order.discount || 0).toFixed(2)}</strong>
          </div>
          <div className="checkout-total-row">
            <span>Delivery Fee</span>
            <strong>${Number(order.deliveryFee || 0).toFixed(2)}</strong>
          </div>
          <div className="checkout-total-row checkout-grand-total">
            <span>Total</span>
            <strong>${Number(order.total || 0).toFixed(2)}</strong>
          </div>
        </section>
      )}
    </main>
  );
}

