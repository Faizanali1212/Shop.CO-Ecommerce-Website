import React from "react";
import ProductCard from "./ProductCard.jsx";
import "../../style/Home.css";
// Mock data — replace with API call later
const NEW_ARRIVALS = [
  {
    id: 1,
    title: "T-shirt with Tape Details",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
    rating: 4.5,
    ratingScore: 4.5,
    price: 120,
  },
  {
    id: 2,
    title: "Skinny Fit Jeans",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80",
    rating: 3.5,
    ratingScore: 3.5,
    price: 240,
    oldPrice: 260,
    discount: 20,
  },
  {
    id: 3,
    title: "Checkered Shirt",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80",
    rating: 4.5,
    ratingScore: 4.5,
    price: 180,
  },
  {
    id: 4,
    title: "Sleeve Striped T-shirt",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500&q=80",
    rating: 4.5,
    ratingScore: 4.5,
    price: 130,
    oldPrice: 160,
    discount: 30,
  },
];

const NewArrivals = () => {
  return (
    <section className="product-section" id="new-arrivals">
      <div className="container">
        <h2 className="section-title">New Arrivals</h2>

        <div className="product-grid">
          {NEW_ARRIVALS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="product-section__footer">
          <button className="btn btn-outline">View All</button>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;