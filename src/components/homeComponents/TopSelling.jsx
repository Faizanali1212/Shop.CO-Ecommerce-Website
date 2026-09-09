  import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import "../../style/Home.css";


const TopSellingProducts = () => {
  const [products, setProducts] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
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
  useEffect(() => {
    topSellingFetchProducts();
  }, []);
  const visibleProducts = viewAll ? products : products.slice(0, 4);

  if (loading) return <p style={{ textAlign: "center", padding: "20px" }}>Loading Top Selling...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red", padding: "20px" }}>Error: {error}</p>;

  return (
    <section className="product-section">
      <div className="container">
        <h2 className="section-title">Top Selling</h2>

        {}
        <div className="product-grid">
          {visibleProducts.map((product, index) => (
            <div key={product._id || product.id || index}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {}
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