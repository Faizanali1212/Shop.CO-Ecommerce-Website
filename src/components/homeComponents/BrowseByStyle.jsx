import React from "react";
import "../../style/Home.css";
const STYLES = [
  {
    name: "Casual",
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&q=80",
    className: "style-casual",
  },
  {
    name: "Formal",
    image: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=600&q=80",
    className: "style-formal",
  },
  {
    name: "Party",
    image: "https://images.unsplash.com/photo-1519669556878-63bdad8a1a49?w=600&q=80",
    className: "style-party",
  },
  {
    name: "Gym",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
    className: "style-gym",
  },
];

const BrowseByStyle = () => {
  return (
    <section className="browse-style">
      <div className="container">
        <div className="browse-style__card">
          <h2 className="section-title browse-style__title">
            Browse By Dress Style
          </h2>

          <div className="browse-style__grid">
            {STYLES.map((style) => (
              <div
                key={style.name}
                className={`browse-style__item ${style.className}`}
              >
                <img src={style.image} alt={style.name} />
                <span className="browse-style__label">{style.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrowseByStyle;
