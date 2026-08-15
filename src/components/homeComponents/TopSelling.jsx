import React, { useState } from "react";
import TopSellingProductCard from "../homeComponents/TopSellingProductCard.jsx";
import "../../style/Home.css";
import { useEffect } from "react";
import axios from "axios";

const topSellingProducts = () => {
  const [products, setProducts] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const topSellingFetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4000/api/products/topSelling");
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

  // Initially show only 4 products.
  // Click "View All" to toggle the list and show the remaining products.
  const visibleProducts = viewAll ? products : products.slice(0, 4);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="product-section">
      <div className="container">
        <h2 className="section-title">Top Selling</h2>

        <div className="product-grid">
          {visibleProducts.map((product) => {
            return (
              <div key={product.productId || product.id}>
                <TopSellingProductCard product={product} />
              </div>
            );
          })}
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

export default topSellingProducts;