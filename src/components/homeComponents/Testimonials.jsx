import React, { useState, useEffect } from "react";
import StarRating from "./StarRating.jsx";
import "../../style/Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const REVIEWS = [
  {
    id: 1,
    name: "Sarah M.",
    verified: true,
    text:
      "I'm blown away by the quality and style of the clothes I received from SHOP.CO. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
  },
  {
    id: 2,
    name: "Alex K.",
    verified: true,
    text:
      "Finding clothes that align with my personal style used to be a challenge until I discovered SHOP.CO. The range of options they offer is truly remarkable, catering to a variety of tastes.",
  },
  {
    id: 3,
    name: "James L.",
    verified: true,
    text:
      "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon SHOP.CO. The selection of clothes is diverse and the quality is exceptional.",
  },
  {
    id: 4,
    name: "Maria P.",
    verified: true,
    text:
      "Shopping here has genuinely transformed my wardrobe. Fast shipping, true-to-size fits, and customer service that actually cares. I recommend SHOP.CO to everyone I know.",
  },
];

const getVisibleCount = () => (typeof window !== "undefined" && window.innerWidth <= 900 ? 1 : 3);

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(getVisibleCount());

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount());
      setActiveIndex(0);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(REVIEWS.length - visibleCount, 0);

  const goPrev = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  const goNext = () => {
    setActiveIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  return (
    <section className="testimonials">
      <div className="container">
        <div className="testimonials__header">
          <h2 className="section-title testimonials__title">
            Our Happy Customers
          </h2>

          <div className="testimonials__controls">
            <button
              className="testimonials__arrow"
              onClick={goPrev}
              disabled={activeIndex === 0}
              aria-label="Previous testimonials"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <button
              className="testimonials__arrow"
              onClick={goNext}
              disabled={activeIndex === maxIndex}
              aria-label="Next testimonials"
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>

        <div className="testimonials__viewport">
          <div
            className="testimonials__track"
            style={{
              transform: `translateX(calc(-${activeIndex} * (100% / ${visibleCount})))`,
            }}
          >
            {REVIEWS.map((review) => (
              <article key={review.id} className="testimonial-card">
                <StarRating rating={5} size={18} />
                <div className="testimonial-card__name-row">
                  <h4>{review.name}</h4>
                  {review.verified && (
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      className="verified-badge"
                      aria-label="Verified"
                    />
                  )}
                </div>
                <p className="testimonial-card__text">"{review.text}"</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;