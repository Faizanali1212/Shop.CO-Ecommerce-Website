import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faChevronDown,
  faChevronRight,
  faCircleCheck,
  faEllipsis,
  faSliders,
  faStar as faStarSolid,
} from "@fortawesome/free-solid-svg-icons";
import "../style/productDetail.css";
import { getProductImageUrl, PLACEHOLDER_IMAGE } from "../utils/imageUrl";
import { useCart } from "../context/useCart.js";
const fallbackGallery = [
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
];
const defaultColors = [
  { name: "Olive", value: "#5C5F3A" },
  { name: "Navy", value: "#1B2A34" },
  { name: "Tan", value: "#C2B299" },
  { name: "Cream", value: "#E6E0D6" },
];
const defaultSizes = ["Small", "Medium", "Large", "X-Large"];
const mockReviews = [
  {
    id: 1,
    author: "Samantha D.",
    rating: 5,
    verified: true,
    comment:
      "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt.",
    date: "2023-08-14",
  },
  {
    id: 2,
    author: "Alex M.",
    rating: 5,
    verified: true,
    comment:
      "The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I'm quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me.",
    date: "2023-08-15",
  },
  {
    id: 3,
    author: "Ethan R.",
    rating: 4,
    verified: true,
    comment:
      "This t-shirt is a must-have for anyone who appreciates good design. The minimalist style and soft cotton feel make it a comfortable daily staple.",
    date: "2023-08-16",
  },
  {
    id: 4,
    author: "Olivia P.",
    rating: 5,
    verified: true,
    comment:
      "As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only looks good but also feels premium and easy to wear every day.",
    date: "2023-08-17",
  },
];


const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeTab, setActiveTab] = useState("reviews");
  const [loading, setLoading] = useState(true);
  const [cartMessage, setCartMessage] = useState("");
  const { addToCart, error: cartError } = useCart();

  
  
  useEffect(() => {
    axios
      .get(`https://shop-co-ecommerce-backend.vercel.app/api/products/${id}`)
      .then((res) => {
        const data = res.data;
        setProduct(data);
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0].name || data.colors[0]);
        } else {
          setSelectedColor(defaultColors[0].name);
        }
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        } else {
          setSelectedSize("Medium");
        }

        setLoading(false);
      })
      .catch((err) => {
        console.log("Error loading product detail from API:", err);
        setLoading(false);
      });
  }, [id]);
  const productTitle = product?.ProductTitle || product?.title || product?.name || "Product";
  const productPrice = product?.Price ?? product?.price ?? 0;
  const productRating = Number(product?.rating ?? 4.5);
  const primaryImage = product?.Image || product?.image || "";

  
  const displayImages =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images
      : primaryImage
      ? [primaryImage]
      : fallbackGallery;

  
  const handleAddToCart = async () => {
    // Add one item here; quantity changes are handled on the cart page.
    const added = await addToCart(product, 1);
    if (added) {
      setCartMessage(`${productTitle} added to cart.`);
      window.setTimeout(() => setCartMessage(""), 2500);
    }
  };

  
  const renderStars = (rating = 5) => {
    return [1, 2, 3, 4, 5].map((starIndex) => (
      <FontAwesomeIcon
        key={`star-${starIndex}`}
        icon={faStarSolid}
        className={starIndex <= Math.round(rating) ? "pdp__star filled" : "pdp__star empty"}
      />
    ));
  };

  if (loading) {
    return <div className="pdp pdp__loading">Loading product details...</div>;
  }

  if (!product) {
    return <div className="pdp pdp__loading">Product not found!</div>;
  }

  const displayColors = product.colors || defaultColors;
  const displaySizes = product.sizes || defaultSizes;

  return (
    <div className="pdp">
      {}
      <nav className="pdp__breadcrumb" aria-label="Breadcrumb navigation">
        <span>Home</span>
        <FontAwesomeIcon icon={faChevronRight} />
        <span>Shop</span>
        <FontAwesomeIcon icon={faChevronRight} />
        <span>Men</span>
        <FontAwesomeIcon icon={faChevronRight} />
        <span className="pdp__breadcrumb-current">T-Shirts</span>
      </nav>

      {}
      <section className="pdp__overview">
        {}
        <div className="pdp__gallery">
          {}
          <div className="pdp__thumbs">
            {displayImages.map((image, index) => (
              <button
                key={`thumb-${index}`}
                type="button"
                className={`pdp__thumb ${selectedImageIndex === index ? "active" : ""}`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <img
                  src={getProductImageUrl(image)}
                  alt={`${productTitle} thumbnail ${index + 1}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = PLACEHOLDER_IMAGE;
                  }}
                />
              </button>
            ))}
          </div>

          {}
          <div className="pdp__main-image">
            <img
              src={getProductImageUrl(displayImages[selectedImageIndex] || displayImages[0])}
              alt={productTitle}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = PLACEHOLDER_IMAGE;
              }}
            />
          </div>
        </div>

        {}
        <div className="pdp__info">
          <h1 className="pdp__title">{productTitle}</h1>

          {}
          <div className="pdp__rating-row">
            <div className="pdp__stars">{renderStars(productRating)}</div>
            <span className="pdp__rating-value">
              {productRating.toFixed(1)}/5
            </span>
          </div>

          {}
          <div className="pdp__price-row">
            <span className="pdp__price">${productPrice}</span>
            {product.originalPrice && (
              <span className="pdp__price-original">${product.originalPrice}</span>
            )}
            {(product.discount || product.discountPercentage) && (
              <span className="pdp__discount-badge">
                -{product.discount || product.discountPercentage}%
              </span>
            )}
          </div>

          {}
          <p className="pdp__description">
            {product.description ||
              "This t-shirt is perfect for any occasion. Crafted from soft fabric for comfort and style."}
          </p>

          <hr className="pdp__divider" />

          {}
          <div className="pdp__selector-block">
            <span className="pdp__selector-label">Select Colors</span>
            <div className="pdp__colors">
              {displayColors.map((colorItem) => {
                const colorName = typeof colorItem === "string" ? colorItem : colorItem.name;
                const colorVal = typeof colorItem === "string" ? colorItem : colorItem.value;
                const isSelected = selectedColor === colorName;

                return (
                  <button
                    key={colorName}
                    type="button"
                    className={`pdp__color-swatch ${isSelected ? "active" : ""}`}
                    style={{ backgroundColor: colorVal || "#000" }}
                    onClick={() => setSelectedColor(colorName)}
                    title={colorName}
                  >
                    {isSelected && <FontAwesomeIcon icon={faCheck} />}
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="pdp__divider" />

          {}
          <div className="pdp__selector-block">
            <span className="pdp__selector-label">Choose Size</span>
            <div className="pdp__sizes">
              {displaySizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`pdp__size-pill ${selectedSize === size ? "active" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <hr className="pdp__divider" />

          {}
          <div className="pdp__action-row">
            <button type="button" className="pdp__add-to-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
          {cartMessage && <p className="pdp__cart-message" role="status">{cartMessage}</p>}
          {cartError && <p className="pdp__cart-message pdp__cart-message--error" role="alert">{cartError}</p>}
        </div>
      </section>

      {}
      <div className="pdp__tabs">
        {[
          { id: "details", label: "Product Details" },
          { id: "reviews", label: "Rating & Reviews" },
          { id: "faqs", label: "FAQs" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`pdp__tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {}
      {activeTab === "details" && (
        <section className="pdp__tab-panel">
          <p className="pdp__tab-copy">
            {product.description || "100% Premium Cotton quality product."}
          </p>
        </section>
      )}

      {}
      {activeTab === "reviews" && (
        <section className="pdp__reviews-panel">
          <div className="pdp__reviews-header">
            <h2 className="pdp__reviews-title">
              All Reviews <span>(451)</span>
            </h2>

            <div className="pdp__reviews-actions">
              {}
              <button type="button" className="pdp__icon-btn" aria-label="Filter reviews">
                <FontAwesomeIcon icon={faSliders} />
              </button>

              {}
              <button type="button" className="pdp__dropdown-btn">
                Latest
                <FontAwesomeIcon icon={faChevronDown} />
              </button>

              {}
              <button type="button" className="pdp__write-review-btn">
                Write a Review
              </button>
            </div>
          </div>

          <div className="pdp__reviews-grid">
            {mockReviews.map((review) => (
              <article key={review.id} className="review-card">
                <div className="review-card__top">
                  <div className="review-card__stars">{renderStars(review.rating)}</div>
                  <button type="button" className="review-card__menu">
                    <FontAwesomeIcon icon={faEllipsis} />
                  </button>
                </div>

                <div className="review-card__author-row">
                  <span className="review-card__name">{review.author}</span>
                  {review.verified && (
                    <FontAwesomeIcon icon={faCircleCheck} className="review-card__verified" />
                  )}
                </div>

                <p className="review-card__comment">"{review.comment}"</p>

                <p className="review-card__date">
                  Posted on{" "}
                  {new Date(review.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      {}
      {activeTab === "faqs" && (
        <section className="pdp__tab-panel">
          <p className="pdp__tab-copy">Q: What is the fabric composition? A: Premium 100% Cotton blend.</p>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;