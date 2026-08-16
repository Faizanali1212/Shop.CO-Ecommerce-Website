import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import "../../style/Home.css";

const TopSellingProducts = () => {
  const [products, setProducts] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Nayi simple API call
  const topSellingFetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4000/api/products/top-selling");
      setProducts(response.data);
    } catch (err) {
      setError(err.message);
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    topSellingFetchProducts();
  }, []);

  const visibleProducts = viewAll ? products : products.slice(0, 4);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="product-section">
      <div className="container">
        <h2 className="section-title">Top Selling</h2>

        <div className="product-grid">
          {visibleProducts.map((product) => (
            <div key={product.id || product.productId}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

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