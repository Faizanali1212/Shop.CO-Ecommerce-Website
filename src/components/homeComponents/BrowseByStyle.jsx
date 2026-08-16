import React from "react";
import "../../style/Home.css";

//images grid box;
import image from  "../../images/image 11.png";
import image2 from "../../images/image 12.png";
import image3 from "../../images/image 13.png";
import image4 from "../../images/image 14.png";
const STYLES = [
  {
    name: "Casual",
    image:image,
    className: "style-casual",
  },
  {
    name: "Formal",
    image: image3,
    className: "style-formal",
  },
  {
    name: "Party",
    image: image2,
    className: "style-party",
  },
  {
    name: "Gym",
    image: image4,
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
