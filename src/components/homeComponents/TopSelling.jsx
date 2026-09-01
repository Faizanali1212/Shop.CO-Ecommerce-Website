import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import "../../style/Home.css";

/**
 * ==============================================================================
 * TopSellingProducts Component
 * ==============================================================================
 * YEH COMPONENT KYA KARTA HAI (PURPOSE):
 * 1. Backend endpoint (/api/products/top-selling) se Top Selling products fetch karta hai.
 * 2. Pehle 4 items show karta hai, aur button click par toggle hokar saare products dikhata hai.
 * 3. Products ko <ProductCard /> component mein pass karta hai jo unhein render karta hai.
 */
const TopSellingProducts = () => {
  // State: Top selling products ka data
  const [products, setProducts] = useState([]);

  // State: View All / View Less toggle flag
  const [viewAll, setViewAll] = useState(false);

  // State: API loading state
  const [loading, setLoading] = useState(true);

  // State: Error message holder
  const [error, setError] = useState(null);

  /**
   * API CALL FUNCTION:
   * Backend se top-selling products array le kar aata hai
   */
  const topSellingFetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://shop-co-ecommerce-backend.vercel.app/api/products/top-selling");
      setProducts(response.data);
    } catch (err) {
      setError(err.message);
      console.error("API Error in TopSelling:", err);
    } finally {
      setLoading(false);
    }
  };

  // Component load hone par ek dafa data fetch karega
  useEffect(() => {
    topSellingFetchProducts();
  }, []);

  // Pehle 4 ya saare products slice se nikalna
  const visibleProducts = viewAll ? products : products.slice(0, 4);

  if (loading) return <p style={{ textAlign: "center", padding: "20px" }}>Loading Top Selling...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red", padding: "20px" }}>Error: {error}</p>;

  return (
    <section className="product-section">
      <div className="container">
        <h2 className="section-title">Top Selling</h2>

        {/* Product Grid */}
        <div className="product-grid">
          {visibleProducts.map((product, index) => (
            <div key={product._id || product.id || index}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* View All Button Toggle */}
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

export default TopSellingProducts;