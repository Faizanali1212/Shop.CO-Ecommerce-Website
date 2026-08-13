import React from "react";
import ProductCard from "./ProductCard";
import "../../style/Home.css";
// Mock data — replace with API call later
const TOP_SELLING = [
  {
    id: 1,
    title: "Vertical Striped Shirt",
    image: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500&q=80",
    rating: 5,
    ratingScore: 5,
    price: 212,
    oldPrice: 232,
  },
  {
    id: 2,
    title: "Courage Graphic T-shirt",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80",
    rating: 4,
    ratingScore: 4,
    price: 145,
  },
  {
    id: 3,
    title: "Loose Fit Bermuda Shorts",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&q=80",
    rating: 3,
    ratingScore: 3,
    price: 80,
  },
  {
    id: 4,
    title: "Faded Skinny Jeans",
    image: "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=500&q=80",
    rating: 4.5,
    ratingScore: 4.5,
    price: 210,
  },
];

const TopSelling = () => {
  return (
    <section className="product-section">
      <div className="container">
        <h2 className="section-title">Top Selling</h2>

        <div className="product-grid">
          {TOP_SELLING.map((product) => (
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

export default TopSelling;