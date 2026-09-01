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
  faMinus,
  faPlus,
  faSliders,
  faStar as faStarSolid,
} from "@fortawesome/free-solid-svg-icons";
import "../style/productDetail.css";
import { getProductImageUrl, PLACEHOLDER_IMAGE } from "../utils/imageUrl";

/* ==========================================================================
   1. FALLBACK DATA CONFIGURATION (Agar backend se koi field na aaye)
   ========================================================================== */

// Fallback gallery images agar kisi product ki images array empty ho
const fallbackGallery = [
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
];

// Fallback Colors
const defaultColors = [
  { name: "Olive", value: "#5C5F3A" },
  { name: "Navy", value: "#1B2A34" },
  { name: "Tan", value: "#C2B299" },
  { name: "Cream", value: "#E6E0D6" },
];

// Fallback Sizes
const defaultSizes = ["Small", "Medium", "Large", "X-Large"];

// Mock Customer Reviews (Rating & Reviews tab ke liye)
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

/* ==========================================================================
   2. MAIN PRODUCT DETAIL COMPONENT
   ========================================================================== */
const ProductDetailPage = () => {
  // useParams() URL path '/product/:id' se id nikaalta hai (e.g. '1' ya MongoDB '_id')
  const { id } = useParams();

  /* ---------------- States ---------------- */
  // Backend se fetch hone wala single product object
  const [product, setProduct] = useState(null);

  // Gallery mein currently selected image index (0 = pehli image, 1 = doosri, etc.)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Selected color & size
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  // Product quantity counter (default 1)
  const [quantity, setQuantity] = useState(1);

  // Active tab state: 'details' | 'reviews' | 'faqs'
  const [activeTab, setActiveTab] = useState("reviews");

  // Loading state
  const [loading, setLoading] = useState(true);

  /* ---------------- API Call ---------------- */
  /**
   * USEEFFECT LOGIC:
   * Jab bhi URL parameter 'id' change ho, yeh backend endpoint:
   * 'https://shop-co-ecommerce-backend.vercel.app/api/products/${id}'
   * ko call karke specific product ki details le aata hai.
   */
  useEffect(() => {
    axios
      .get(`https://shop-co-ecommerce-backend.vercel.app/api/products/${id}`)
      .then((res) => {
        const data = res.data;
        setProduct(data);

        // Agar product ke paas colors array ho toh pehla color select karo, warna default
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0].name || data.colors[0]);
        } else {
          setSelectedColor(defaultColors[0].name);
        }

        // Agar product ke paas sizes array ho toh pehla size select karo, warna "Medium"
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

  /* ---------------- Quantity Handler ---------------- */
  // Quantity barhane (+) ya ghatane (-) ka handler (1 se kam nahi hone dega)
  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity(quantity + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  /* ---------------- Schema Field Extraction & Fallbacks ---------------- */
  // 1. Title: MongoDB field 'ProductTitle', fallback 'title' / 'name'
  const productTitle = product?.ProductTitle || product?.title || product?.name || "Product";

  // 2. Price: MongoDB field 'Price', fallback 'price'
  const productPrice = product?.Price ?? product?.price ?? 0;

  // 3. Rating: MongoDB field 'rating', fallback 4.5
  const productRating = Number(product?.rating ?? 4.5);

  // 4. Main Single Image
  const primaryImage = product?.Image || product?.image || "";

  /**
   * GALLERY IMAGES LOGIC:
   * Backend se 'images' array aata hai (multiple images).
   * 1. Agar 'product.images' array mojood aur non-empty ho, toh usko use karo.
   * 2. Agar na ho lekin single 'Image' ho, toh usko 1-element array bana do [primaryImage].
   * 3. Agar woh bhi na ho, toh fallbackGallery use karo.
   */
  const displayImages =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images
      : primaryImage
      ? [primaryImage]
      : fallbackGallery;

  /* ---------------- Add to Cart Handler ---------------- */
  const handleAddToCart = () => {
    const item = {
      productId: product?.id || product?._id,
      name: productTitle,
      price: productPrice,
      image: getProductImageUrl(displayImages[0]),
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
    };
    console.log("Cart item payload:", item);
    alert(`${productTitle} added to cart!`);
  };

  /* ---------------- Star Rating Helper ---------------- */
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
      {/* Breadcrumb Navigation */}
      <nav className="pdp__breadcrumb" aria-label="Breadcrumb navigation">
        <span>Home</span>
        <FontAwesomeIcon icon={faChevronRight} />
        <span>Shop</span>
        <FontAwesomeIcon icon={faChevronRight} />
        <span>Men</span>
        <FontAwesomeIcon icon={faChevronRight} />
        <span className="pdp__breadcrumb-current">T-Shirts</span>
      </nav>

      {/* Main Product Section */}
      <section className="pdp__overview">
        {/* Gallery: Left side thumbnails and main selected image */}
        <div className="pdp__gallery">
          {/* Thumbnails list */}
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

          {/* Main big preview image */}
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

        {/* Info: Title, Stars, Price, Description, Color/Size options */}
        <div className="pdp__info">
          <h1 className="pdp__title">{productTitle}</h1>

          {/* Rating */}
          <div className="pdp__rating-row">
            <div className="pdp__stars">{renderStars(productRating)}</div>
            <span className="pdp__rating-value">
              {productRating.toFixed(1)}/5
            </span>
          </div>

          {/* Price */}
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

          {/* Description */}
          <p className="pdp__description">
            {product.description ||
              "This t-shirt is perfect for any occasion. Crafted from soft fabric for comfort and style."}
          </p>

          <hr className="pdp__divider" />

          {/* Colors Selection */}
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

          {/* Sizes Selection */}
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

          {/* Action Row: Quantity counter + Add to Cart button */}
          <div className="pdp__action-row">
            <div className="pdp__qty-selector">
              <button type="button" onClick={() => handleQuantityChange("decrease")}>
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <span>{quantity}</span>
              <button type="button" onClick={() => handleQuantityChange("increase")}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>

            <button type="button" className="pdp__add-to-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </section>

      {/* Tabs Navigation (Details, Reviews, FAQs) */}
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

      {/* Tab 1: Details Content */}
      {activeTab === "details" && (
        <section className="pdp__tab-panel">
          <p className="pdp__tab-copy">
            {product.description || "100% Premium Cotton quality product."}
          </p>
        </section>
      )}

      {/* Tab 2: Reviews Content */}
      {activeTab === "reviews" && (
        <section className="pdp__reviews-panel">
          <div className="pdp__reviews-header">
            <h2 className="pdp__reviews-title">
              All Reviews <span>(451)</span>
            </h2>

            <div className="pdp__reviews-actions">
              {/* Filter Slider Icon Button */}
              <button type="button" className="pdp__icon-btn" aria-label="Filter reviews">
                <FontAwesomeIcon icon={faSliders} />
              </button>

              {/* Dropdown Button */}
              <button type="button" className="pdp__dropdown-btn">
                Latest
                <FontAwesomeIcon icon={faChevronDown} />
              </button>

              {/* Write Review Button */}
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

      {/* Tab 3: FAQs Content */}
      {activeTab === "faqs" && (
        <section className="pdp__tab-panel">
          <p className="pdp__tab-copy">Q: What is the fabric composition? A: Premium 100% Cotton blend.</p>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;