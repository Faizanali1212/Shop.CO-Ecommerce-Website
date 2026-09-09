import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { checkoutApi } from "../utils/api";
import { useCart } from "../context/useCart.js";
import "../style/checkout.css";

const initialCustomer = {
  firstName: "",
  userName: "",
  email: "",
  phoneNumber: "",
  address: "",
  pinCode: "",
  city: "",
  country: "",
};

const responseData = (response) => response?.data ?? response;
const errorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

function Summary({ summary }) {
  const items = summary?.items || [];
  return (
    <section className="checkout-panel checkout-summary" aria-labelledby="summary-title">
      <h2 id="summary-title">Order Summary</h2>
      {items.map((item, index) => (
        <div className="checkout-item" key={item.productId || item._id || index}>
          <span>{item.title || item.product?.title || item.product?.ProductTitle || "Product"} x {item.quantity}</span>
          <strong>${Number(item.price || item.Price || 0).toFixed(2)}</strong>
        </div>
      ))}
      <div className="checkout-total-row"><span>Subtotal</span><strong>${Number(summary?.subtotal || 0).toFixed(2)}</strong></div>
      <div className="checkout-total-row"><span>Discount</span><strong className="checkout-discount">-${Number(summary?.discount || 0).toFixed(2)}</strong></div>
      <div className="checkout-total-row"><span>Delivery Fee</span><strong>${Number(summary?.deliveryFee || 0).toFixed(2)}</strong></div>
      <div className="checkout-total-row checkout-grand-total"><span>Total</span><strong>${Number(summary?.total || 0).toFixed(2)}</strong></div>
    </section>
  );
}

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items, loadCart } = useCart();
  const [summary, setSummary] = useState(null);
  const [promoCode, setPromoCode] = useState(location.state?.promoCode || "WELCOME20");
  const [customer, setCustomer] = useState(initialCustomer);
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [loading, setLoading] = useState(true);
  const [promoLoading, setPromoLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [order, setOrder] = useState(null);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await checkoutApi.summary();
      setSummary(responseData(response));
    } catch (requestError) {
      if (requestError.response?.status === 401) navigate("/login", { state: { from: "/checkout" } });
      else setError(errorMessage(requestError, "Unable to load checkout details."));
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const timer = window.setTimeout(loadSummary, 0);
    return () => window.clearTimeout(timer);
  }, [loadSummary]);

  const handleCustomerChange = (event) => {
    setCustomer((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handlePromo = async () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) { setPromoMessage("Enter a promo code first."); return; }
    setPromoLoading(true); setError(""); setPromoMessage("");
    try {
      const response = await checkoutApi.applyPromo(code, items.map((item) => ({ productId: item.productId, quantity: item.quantity })));
      const data = responseData(response);
      setSummary(data);
      setPromoCode(data.promoCode || code);
      setPromoMessage(data.message || "Promo code applied successfully.");
    } catch (requestError) {
      setPromoMessage(errorMessage(requestError, "Invalid or expired promo code."));
    } finally { setPromoLoading(false); }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!Object.values(customer).every((value) => value.trim())) { setError("Please complete all customer and address fields."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) { setError("Please enter a valid email address."); return; }
    if (!/^[+\d][\d\s-]{6,}$/.test(customer.phoneNumber)) { setError("Please enter a valid phone number."); return; }
    setSubmitLoading(true);
    try {
      const response = await checkoutApi.createOrder({ promoCode: promoCode.trim() || undefined, customer, paymentMethod });
      const data = responseData(response);
      setOrder(data.order || data);
      await loadCart();
    } catch (requestError) {
      if (requestError.response?.status === 401) navigate("/login", { state: { from: "/checkout" } });
      else setError(errorMessage(requestError, "Unable to place your order. Please try again."));
    } finally { setSubmitLoading(false); }
  };

  if (order) return (
    <main className="checkout-page"><section className="checkout-confirmation">
      <p className="checkout-eyebrow">Order confirmed</p><h1>Thank you for your order.</h1>
      <p>Your order <strong>#{order._id}</strong> is currently <strong>{order.status}</strong>.</p>
      <Summary summary={order} />
      <Link className="checkout-primary-link" to="/orders">View my orders</Link>
    </section></main>
  );

  return <main className="checkout-page">
    <div className="checkout-header"><div><p className="checkout-eyebrow">Secure checkout</p><h1>Complete your order</h1></div><Link to="/cart" className="checkout-back-link">Back to cart</Link></div>
    {error && <p className="checkout-error" role="alert">{error}</p>}
    {loading ? <p className="checkout-status">Loading checkout details...</p> : <div className="checkout-layout">
      <form className="checkout-panel checkout-form" onSubmit={handleSubmit} noValidate>
        <h2>Customer Details</h2><div className="checkout-fields">
          {[["firstName","First name"],["userName","Username"],["email","Email"],["phoneNumber","Phone number"],["address","Address"],["pinCode","PIN code"],["city","City"],["country","Country"]].map(([name,label]) => <label key={name} className={name === "address" ? "checkout-field checkout-field--wide" : "checkout-field"}>{label}<input name={name} value={customer[name]} onChange={handleCustomerChange} type={name === "email" ? "email" : "text"} required /></label>)}
        </div>
        <h2>Payment</h2><label className="checkout-payment"><input type="radio" name="paymentMethod" checked={paymentMethod === "cash_on_delivery"} onChange={() => setPaymentMethod("cash_on_delivery")} /> Cash on delivery</label>
        <button className="checkout-submit" type="submit" disabled={submitLoading || !items.length}>{submitLoading ? "Placing order..." : "Place order"}</button>
      </form>
      <div><Summary summary={summary} /><section className="checkout-panel promo-panel"><h2>Promo code</h2><div className="promo-control"><input value={promoCode} onChange={(event) => setPromoCode(event.target.value)} aria-label="Promo code" placeholder="WELCOME20" /><button type="button" onClick={handlePromo} disabled={promoLoading}>{promoLoading ? "Applying..." : "Apply"}</button></div>{promoMessage && <p className="checkout-message" role="status">{promoMessage}</p>}</section></div>
    </div>}
  </main>;
}
