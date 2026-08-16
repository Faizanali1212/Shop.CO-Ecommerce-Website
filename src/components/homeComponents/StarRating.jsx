import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

/**

 * @param {number} rating 
 * @param {number} size - 
 */
const StarRating = ({ rating = 5, size = 16 }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push({ icon: faStarSolid, type: "full" });
    } else if (rating >= i - 0.5) {
      stars.push({ icon: faStarHalfStroke, type: "half" });
    } else {
      stars.push({ icon: faStarRegular, type: "empty" });
    }
  }

  return (
    <span className="star-rating" role="img" aria-label={`${rating} out of 5 stars`}>
      {stars.map((star, idx) => (
        <FontAwesomeIcon
          key={idx}
          icon={star.icon}
          className={`star-icon star-icon--${star.type}`}
          style={{ fontSize: size }}
        />
      ))}
    </span>
  );
};

export default StarRating;
