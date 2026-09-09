import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import "../../style/Home.css";
import axios from "axios";


const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://shop-co-ecommerce-backend.vercel.app/api/products/new-arrivals");
      setProducts(response.data);
    } catch (err) {
      setError(err.message);
      console.error("API Error in NewArrivals:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  const visibleProducts = viewAll ? products : products.slice(0, 4);
  if (loading) return <p style={{ textAlign: "center", padding: "20px" }}>Loading New Arrivals...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red", padding: "20px" }}>Error: {error}</p>;

  return (
    <section className="product-section" id="new-arrivals">
      <div className="container">
        <h2 className="section-title">New Arrivals</h2>

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

export default NewArrivals;