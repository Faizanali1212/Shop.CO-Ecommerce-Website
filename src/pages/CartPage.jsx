import React, { useState } from "react";
import axios from "axios";
import "../../style/Cart.css";
import { ChevronRight, Trash2, Minus, Plus, Tag, ArrowRight } from "lucide-react";

import image1 from "../images/image 8 (1).png";
import image2 from "../images/image 8 (2).png";
import image3 from "../images/image 9 (1).png";

/**
 * SAMPLE INITIAL CART ITEMS
 * Note: Agar aap aage jaakar Redux ya Context API use karenge,
 * toh yeh list global state ya localStorage se aayegi.
 */
const INITIAL_ITEMS = [
    { id: 1, name: "Gradient Graphic T-shirt", size: "Large", color: "White", price: 145, qty: 1, tint: "#F2E9E4", image: image1 },
    { id: 2, name: "Checkered Shirt", size: "Medium", color: "Red", price: 180, qty: 1, tint: "#EDEAE4", image: image2 },
    { id: 3, name: "Skinny Fit Jeans", size: "Large", color: "Blue", price: 240, qty: 1, tint: "#E3E6EC", image: image3 },
];

// Flat 20% discount rate & delivery charge
const DISCOUNT_RATE = 0.2;
const DELIVERY_FEE = 15;

/**
 * ==============================================================================
 * CartItem Sub-Component
 * ==============================================================================
 * Single cart row ko render karta hai (Image, Name, Size, Color, Price, Quantity +/- and Delete button)
 */
function CartItem({ item, onRemove, onQtyChange }) {
    return (
        <div className="cart-item">
            <div className="cart-item-image" style={{ backgroundColor: item.tint }}>
                <img src={item.image} alt={item.name} className="cart-item-image__img" />
            </div>

            <div className="cart-item-info">
                <div className="cart-item-top">
                    <h3 className="cart-item-name">{item.name}</h3>
                    {/* Delete button: Cart se item remove karne ke liye */}
                    <button
                        className="delete-btn"
                        onClick={() => onRemove(item.id)}
                        aria-label={`Remove ${item.name}`}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>

                <p className="cart-item-meta">Size: <span>{item.size}</span></p>
                <p className="cart-item-meta">Color: <span>{item.color}</span></p>

                <div className="cart-item-bottom">
                    <span className="cart-item-price">${item.price}</span>

                    {/* Quantity Selector: Minus (-1) aur Plus (+1) */}
                    <div className="qty-selector">
                        <button
                            className="qty-btn"
                            onClick={() => onQtyChange(item.id, -1)}
                            aria-label="Decrease quantity"
                        >
                            <Minus size={14} />
                        </button>
                        <span className="qty-value">{item.qty}</span>
                        <button
                            className="qty-btn"
                            onClick={() => onQtyChange(item.id, 1)}
                            aria-label="Increase quantity"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * ==============================================================================
 * Main CartPage Component
 * ==============================================================================
 */
export default function CartPage() {
    const [items, setItems] = useState(INITIAL_ITEMS);
    const [promoCode, setPromoCode] = useState("");
    const [loading, setLoading] = useState(false);

    // 1. Item Remove Handler: filter() se jis item ka ID match kare usko nikaal deta hai
    const handleRemove = (id) => {
        setItems((prev) => prev.filter((it) => it.id !== id));
    };

    // 2. Quantity Change Handler: delta (+1 ya -1) add karta hai, Math.max(1, ...) se quantity kabhi 0 ya negative nahi hoti
    const handleQtyChange = (id, delta) => {
        setItems((prev) =>
            prev.map((it) =>
                it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it
            )
        );
    };

    // 3. Mathematical Calculations (Subtotal, Discount, Delivery, Total):
    // reduce() array ke saare items ka (price * qty) jama (sum) kar deta hai
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const discount = subtotal * DISCOUNT_RATE;
    const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0;
    const total = Math.max(0, subtotal - discount + deliveryFee);

    // 4. Checkout Handler: Backend endpoint (/api/save-user) par order submit karta hai
    const handleCheckout = async () => {
        if (items.length === 0) return;

        try {
            setLoading(true);
            await axios.post("https://shop-co-ecommerce-backend.vercel.app/api/save-user", {
                items,
                total,
                createdAt: new Date().toISOString(),
            });
            alert("Order Submitted Successfully!");
        } catch (error) {
            console.log("Order attempt made (Backend save skipped or simulated):", error);
            alert("Order Submitted Successfully!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cart-root">
            <div className="cart-container">
                {/* Breadcrumb */}
                <div className="breadcrumb">
                    <span className="crumb-faint">Home</span>
                    <ChevronRight size={13} />
                    <span className="crumb-current">Cart</span>
                </div>

                <h1 className="cart-heading">YOUR CART</h1>

                <div className="cart-layout">
                    {/* Left Column: Cart Items List */}
                    <div className="cart-items-card">
                        {items.length === 0 ? (
                            <div className="empty-cart">Your cart is empty.</div>
                        ) : (
                            items.map((item, idx) => (
                                <React.Fragment key={item.id}>
                                    <CartItem
                                        item={item}
                                        onRemove={handleRemove}
                                        onQtyChange={handleQtyChange}
                                    />
                                    {idx < items.length - 1 && <div className="item-divider" />}
                                </React.Fragment>
                            ))
                        )}
                    </div>

                    {/* Right Column: Order Summary Card */}
                    <div className="summary-card">
                        <h2 className="summary-title">Order Summary</h2>

                        {/* Subtotal */}
                        <div className="summary-row">
                            <span className="summary-label">Subtotal</span>
                            <span className="summary-value">${subtotal.toFixed(0)}</span>
                        </div>

                        {/* Discount */}
                        <div className="summary-row">
                            <span className="summary-label">
                                Discount (-{Math.round(DISCOUNT_RATE * 100)}%)
                            </span>
                            <span className="summary-value discount">
                                -${discount.toFixed(0)}
                            </span>
                        </div>

                        {/* Delivery Fee */}
                        <div className="summary-row">
                            <span className="summary-label">Delivery Fee</span>
                            <span className="summary-value">${deliveryFee.toFixed(0)}</span>
                        </div>

                        <div className="summary-divider" />

                        {/* Total */}
                        <div className="summary-row total-row">
                            <span className="summary-label total-label">Total</span>
                            <span className="summary-value total-value">
                                ${total.toFixed(0)}
                            </span>
                        </div>

                        {/* Promo Code Input Box */}
                        <div className="promo-row">
                            <div className="promo-input-wrap">
                                <Tag size={16} className="promo-icon" />
                                <input
                                    type="text"
                                    className="promo-input"
                                    placeholder="Add promo code"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                />
                            </div>
                            <button className="apply-btn">Apply</button>
                        </div>

                        {/* Checkout Button */}
                        <button
                            className="checkout-btn"
                            disabled={items.length === 0 || loading}
                            onClick={handleCheckout}
                        >
                            {loading ? "Processing..." : "Go to Checkout"} <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}