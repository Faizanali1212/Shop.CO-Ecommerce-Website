import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import '../../style/newArrivalsProduct.css';
import { getProductImageUrl, PLACEHOLDER_IMAGE } from '../../utils/imageUrl';
import { useCart } from '../../context/useCart.js';


function ProductCard({ product = {} }) {
  const { addToCart, notice, error } = useCart();
  // Product cards support cart actions without changing the product link.
  const id = product.id ?? product._id ?? product.productId;
  const title = product.ProductTitle || product.title || product.name || product.productName || 'Product';
  const rawImage = product.Image || product.image || (Array.isArray(product.images) && product.images[0]) || product.productImage || '';
  const price = product.Price ?? product.price ?? product.productPrice ?? 0;
  const originalPrice = product.originalPrice;
  const discount = product.discount || product.discountPercentage;
  const ratingScore = Number(product.rating ?? 4.5);
  const finalImageUrl = getProductImageUrl(rawImage);
  const full = Math.floor(ratingScore);
  const half = ratingScore - full >= 0.5 ? 1 : 0;
  const empty = Math.max(0, 5 - full - half);

  return (
    <Link to={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <article className="product-card">
        {}
        <div className="product-card__image-box">
          <img
            className="product-card__image"
            src={finalImageUrl}
            alt={title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = PLACEHOLDER_IMAGE;
            }}
          />
        </div>

        {}
        <h3 className="product-card__title">{title}</h3>

        {}
        <div className="product-card__rating">
          {}
          {Array.from({ length: full }).map((_, i) => (
            <FontAwesomeIcon key={`f${i}`} icon={faStar} className="product-card__star" />
          ))}
          {}
          {half === 1 && <FontAwesomeIcon icon={faStarHalfStroke} className="product-card__star" />}
          {}
          {Array.from({ length: empty }).map((_, i) => (
            <FontAwesomeIcon key={`e${i}`} icon={faStarEmpty} className="product-card__star product-card__star--empty" />
          ))}
          {}
          <span className="product-card__rating-score">{ratingScore}/5</span>
        </div>

        {}
        <div className="product-card__price-row">
          <span className="product-card__price">${price}</span>
          {originalPrice && <span className="product-card__original-price">${originalPrice}</span>}
          {discount && <span className="product-card__discount-badge">-{discount}%</span>}
        </div>
        <button
          type="button"
          className="product-card__add-button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            addToCart(product);
          }}
        >
          Add to Cart
        </button>
        {notice && <span className="product-card__message" role="status">{notice}</span>}
        {error && <span className="product-card__message product-card__message--error" role="alert">{error}</span>}
      </article>
    </Link>
  );
}

export default ProductCard;