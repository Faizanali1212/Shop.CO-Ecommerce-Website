import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import "../../style/Home.css";
import axios from "axios";

/**
 * ==============================================================================
 * NewArrivals Component
 * ==============================================================================
 * YEH COMPONENT KYA KARTA HAI (PURPOSE):
 * 1. Live backend endpoint (/api/products/new-arrivals) se New Arrival products fetch karta hai.
 * 2. Pehle 4 products dikhata hai. Agar user "View All" par click kare, toh saare products dikhata hai.
 * 3. Har product ko hamare reusable <ProductCard /> component mein pass karta hai.
 */
const NewArrivals = () => {
  // State: API se aane wale products ki list
  const [products, setProducts] = useState([]);

  // State: Toggle button ke liye (false = 4 items, true = all items)
  const [viewAll, setViewAll] = useState(false);

  // State: API load hone tak loading message show karne ke liye
  const [loading, setLoading] = useState(true);

  // State: Agar API mein error aaye toh usko capture karne ke liye
  const [error, setError] = useState(null);

  /**
   * API CALL FUNCTION:
   * Backend endpoint 'https://shop-co-ecommerce-backend.vercel.app/api/products/new-arrivals'
   * se products fetch karta hai aur response.data state mein store karta hai.
   */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://shop-co-ecommerce-backend.vercel.app/api/products/new-arrivals");
      setProducts(response.data);
    } catch (err) {
      setError(err.message);
      console.error("API Error in NewArrivals:", err);
    } finally {
      // Chahe success ho ya error, loading band kar do
      setLoading(false);
    }
  };

  // Component mount hote hi API call trigger hoti hai (empty dependency array [])
  useEffect(() => {
    fetchProducts();
  }, []);

  // AGAR VIEWALL TRUE HAI TOH SAARE PRODUCTS, WARNA PEHLE 4 PRODUCTS (slice(0, 4))
  const visibleProducts = viewAll ? products : products.slice(0, 4);

  // Loading aur Error screens
  if (loading) return <p style={{ textAlign: "center", padding: "20px" }}>Loading New Arrivals...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red", padding: "20px" }}>Error: {error}</p>;

  return (
    <section className="product-section" id="new-arrivals">
      <div className="container">
        <h2 className="section-title">New Arrivals</h2>

        {/* Product Grid: Map function se har product render hota hai */}
        <div className="product-grid">
          {visibleProducts.map((product, index) => (
            // Key ke liye MongoDB '_id' ya 'id' use ki gayi hai taake React virtual DOM efficient rahe
            <div key={product._id || product.id || index}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* View All / View Less Button: Sirf tab dikhao jab products 4 se zyada hon */}
        {products.length > 4 && (
          <div className="product-section__footer">
            <button className="btn btn-outline" onClick={() => setViewAll(!viewAll)}>
              {viewAll ? "View Less" : "View All"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewArrivals;