import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import "../../style/Home.css";
import image from "../../images/Screenshot 2026-08-13 201646.png";

const STATS = [
  { value: "200+", label: "International Brands" },
  { value: "2,000+", label: "High-Quality Products" },
  { value: "30,000+", label: "Happy Customers" },
];

const BRANDS = ["VERSACE", "ZARA", "GUCCI", "PRADA", "Calvin Klein"];

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero__inner container">
        <div className="hero__content">
          <h1 className="hero__headline">
            FIND CLOTHES THAT MATCHES YOUR STYLE
          </h1>
          <p className="hero__description">
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense
            of style.
          </p>
          <a href="#new-arrivals" className="btn btn-black hero__cta">
            Shop Now
          </a>

          <div className="hero__stats">
            {STATS.map((stat) => (
              <div key={stat.label} className="hero__stat">
                <span className="hero__stat-value">{stat.value}</span>
                <span className="hero__stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__image-wrap">
          <img
            src={image}
            alt="Models wearing stylish outfits"
            className="hero__image"
          />
        </div>
      </div>

      <div className="hero__brands">
        <div className="hero__brands-inner container">
          {BRANDS.map((brand) => (
            <span key={brand} className="hero__brand-logo">
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;