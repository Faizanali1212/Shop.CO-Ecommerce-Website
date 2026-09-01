import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import '../../style/newArrivalsProduct.css';
import { getProductImageUrl, PLACEHOLDER_IMAGE } from '../../utils/imageUrl';

/**
 * ==============================================================================
 * ProductCard Component
 * ==============================================================================
 * YEH COMPONENT KYA KARTA HAI (PURPOSE):
 * Yeh reusable component har product card ko display karta hai (New Arrivals, Top Selling, etc.).
 *
 * MONGODB SCHEMA SUPPORT:
 * Backend se aane wale fields:
 * - ProductTitle : product ka naam (e.g. "T-SHIRT WITH TAPE DETAILS")
 * - Price        : product ki qeemat number mein (e.g. 120)
 * - Image        : product ki main image ka path (e.g. "images/NewArrivals-img/image_7.png")
 * - images       : multiple images ka array (e.g. ["images/...", ...])
 * - rating       : product rating number (e.g. 4.5)
 * - _id / id     : product ki unique MongoDB ID
 *
 * FALLBACK SUPPORT (SAFE PROGRAMMING):
 * Humne fallback operators (|| aur ??) use kiye hain taake agar kisi product mein
 * purane field names (jaise 'title', 'name', 'price', 'image') hon toh bhi code kabhi na phate.
 */
function ProductCard({ product = {} }) {
  // 1. Product ID: Pehle 'id' dekhega, agar na mile toh MongoDB '_id', warna 'productId'
  const id = product.id ?? product._id ?? product.productId;

  // 2. Product Title: MongoDB schema field 'ProductTitle' pehle, phir 'title', 'name', 'productName'
  const title = product.ProductTitle || product.title || product.name || product.productName || 'Product';

  // 3. Product Image: 'Image' (MongoDB) ya 'image' ya 'images[0]' (Array) ya fallback
  const rawImage = product.Image || product.image || (Array.isArray(product.images) && product.images[0]) || product.productImage || '';

  // 4. Product Price: 'Price' (MongoDB) ya 'price' ya 'productPrice' (Nullish coalescing ?? se 0 price bhi valid rahega)
  const price = product.Price ?? product.price ?? product.productPrice ?? 0;

  // 5. Original Price & Discount (Agar backend ya discount offer mojood ho)
  const originalPrice = product.originalPrice;
  const discount = product.discount || product.discountPercentage;

  // 6. Rating Score: MongoDB 'rating' (e.g., 4.5). Agar na mile toh default 4.5
  const ratingScore = Number(product.rating ?? 4.5);

  // 7. Image URL Formatting: getProductImageUrl() function relative path ko backend URL ke sath jod deta hai
  const finalImageUrl = getProductImageUrl(rawImage);

  // ==============================================================================
  // RATING STARS CALCULATION LOGIC (Math Explanation):
  // ==============================================================================
  // Example ratingScore = 4.5:
  // - Math.floor(4.5) = 4 (Full stars)
  // - 4.5 - 4 = 0.5 >= 0.5 => half = 1 (Half star)
  // - empty = 5 - 4 - 1 = 0 (Empty stars)
  // Example ratingScore = 3.2:
  // - full = 3, half = 0, empty = 5 - 3 = 2
  const full = Math.floor(ratingScore);
  const half = ratingScore - full >= 0.5 ? 1 : 0;
  const empty = Math.max(0, 5 - full - half);

  return (
    // Link component se product card click hone par `/product/${id}` page par navigate karega
    <Link to={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <article className="product-card">
        {/* Product Image Container */}
        <div className="product-card__image-box">
          <img
            className="product-card__image"
            src={finalImageUrl}
            alt={title}
            // ONERROR HANDLING:
            // Agar network issue ya backend par image file missing hone se image load na ho,
            // toh yeh browser crash hone ke bajaye chupchap '/placeholder.png' load kar dega.
            // 'e.target.onerror = null' isliye zaroori hai taake agar placeholder bhi fail ho toh infinite loop na bane.
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = PLACEHOLDER_IMAGE;
            }}
          />
        </div>

        {/* Product Title */}
        <h3 className="product-card__title">{title}</h3>

        {/* Dynamic Star Rating */}
        <div className="product-card__rating">
          {/* Full Stars */}
          {Array.from({ length: full }).map((_, i) => (
            <FontAwesomeIcon key={`f${i}`} icon={faStar} className="product-card__star" />
          ))}
          {/* Half Star (Agar rating mein .5 ya zyada ho) */}
          {half === 1 && <FontAwesomeIcon icon={faStarHalfStroke} className="product-card__star" />}
          {/* Empty Stars */}
          {Array.from({ length: empty }).map((_, i) => (
            <FontAwesomeIcon key={`e${i}`} icon={faStarEmpty} className="product-card__star product-card__star--empty" />
          ))}
          {/* Numeric Rating Score Display */}
          <span className="product-card__rating-score">{ratingScore}/5</span>
        </div>

        {/* Product Price & Discount Row */}
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