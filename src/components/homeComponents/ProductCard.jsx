import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import '../../style/newArrivalsProduct.css';

function ProductCard({ product }) {
  const id = product.id || product.productId;
  const title = product.name || product.productName;
  const rawImage = product.image || product.productImage || '';
  const price = product.price || product.productPrice;
  const originalPrice = product.originalPrice;
  const discount = product.discount || product.discountPercentage;
  const ratingScore = Number(product.rating || 5);
  let finalImageUrl = rawImage;

  if (rawImage && !rawImage.startsWith('http')) {
    let cleanPath = rawImage.replace(/^(\.\.\/)+/, '').replace(/^\/+/, '');
    finalImageUrl = `https://shop-co-ecommerce-backend.vercel.app/${cleanPath}`;
  }
  finalImageUrl = encodeURI(finalImageUrl);
  const full = Math.floor(ratingScore);
  const half = ratingScore - full >= 0.5 ? 1 : 0;
  const empty = Math.max(0, 5 - full - half);
  return (
    <Link to={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <article className="product-card">
        <div className="product-card__image-box">
          <img
            className="product-card__image"
            src={finalImageUrl}
            alt={title}
            onError={(e) => {
              console.log("Image load fail for path:", finalImageUrl);
            }}
          />
        </div>

        <h3 className="product-card__title">{title}</h3>

        <div className="product-card__rating">
          {Array.from({ length: full }).map((_, i) => (
            <FontAwesomeIcon key={`f${i}`} icon={faStar} className="product-card__star" />
          ))}
          {half === 1 && <FontAwesomeIcon icon={faStarHalfStroke} className="product-card__star" />}
          {Array.from({ length: empty }).map((_, i) => (
            <FontAwesomeIcon key={`e${i}`} icon={faStarEmpty} className="product-card__star product-card__star--empty" />
          ))}
          <span className="product-card__rating-score">{ratingScore}/5</span>
        </div>

        <div className="product-card__price-row">
          <span className="product-card__price">${price}</span>
          {originalPrice && <span className="product-card__original-price">${originalPrice}</span>}
          {discount && <span className="product-card__discount-badge">-{discount}%</span>}
        </div>
      </article>
    </Link>
  );
}

export default ProductCard;