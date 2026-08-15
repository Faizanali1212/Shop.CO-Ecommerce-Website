import React, { useEffect, useState } from "react";
import NewArrivalsProductCard from "./NewArrivalsProductCard.jsx";
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
      const response = await axios.get("http://localhost:4000/api/products");
      setProducts(response.data);
    } catch (err) {
      setError(err.message);
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Initially show only 4 products.
  // When user clicks "View All", set viewAll to true so all products render.
  const visibleProducts = viewAll ? products : products.slice(0, 4);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="product-section" id="new-arrivals">
      <div className="container">
        <h2 className="section-title">New Arrivals</h2>

        <div className="product-grid">
          {visibleProducts.map((product) => (
            <div key={product.id}>
              <NewArrivalsProductCard product={product} />
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

export default NewArrivals;