import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ordersApi } from "../utils/api";
import "../style/checkout.css";

const dataOf = (response) => response?.data ?? response;
const messageOf = (error) => error.response?.data?.message || "Unable to load your orders.";

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [state, setState] = useState({ loading: true, error: "" });
  useEffect(() => { ordersApi.getAll().then((response) => setOrders(dataOf(response)?.orders || dataOf(response) || [])).catch((error) => { if (error.response?.status === 401) navigate("/login", { state: { from: "/orders" } }); else setState({ loading: false, error: messageOf(error) }); }).finally(() => setState((current) => ({ ...current, loading: false }))); }, [navigate]);
  return <main className="checkout-page"><div className="checkout-header"><div><p className="checkout-eyebrow">Account</p><h1>My orders</h1></div><Link to="/" className="checkout-back-link">Continue shopping</Link></div>{state.loading ? <p className="checkout-status">Loading orders...</p> : state.error ? <p className="checkout-error" role="alert">{state.error}</p> : orders.length === 0 ? <p className="checkout-status">You have no orders yet.</p> : <div className="orders-list">{orders.map((order) => <Link className="order-row" to={`/orders/${order._id}`} key={order._id}><span><strong>#{order._id}</strong><small>{new Date(order.createdAt).toLocaleDateString()}</small></span><span>{order.status}</span><strong>${Number(order.total || 0).toFixed(2)}</strong></Link>)}</div>}</main>;
}
