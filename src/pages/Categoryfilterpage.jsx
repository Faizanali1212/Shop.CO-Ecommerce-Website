import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../style/CategoryFilterPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronRight,
    faChevronDown,
    faChevronUp,
    faXmark,
    faSliders,
    faStar as faStarSolid,
    faArrowLeft,
    faArrowRight,
    faCheck,
} from "@fortawesome/free-solid-svg-icons";

/* Helper for dynamic images */
const getImageUrl = (rawImage) => {
    if (!rawImage) return "https://via.placeholder.com/300x300?text=No+Image";
    if (rawImage.startsWith("http")) return encodeURI(rawImage);
    let cleanPath = rawImage.replace(/^(\.\.\/)+/, "").replace(/^\/+/, "");
    return encodeURI(`http://localhost:4000/${cleanPath}`);
};

/* Static Filter Options */
const CATEGORIES = ["T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"];
const COLORS = [
    "#22C55E", "#EF4444", "#F0C808", "#F97316", "#22D3EE",
    "#3B82F6", "#8B5CF6", "#EC4899", "#FFFFFF", "#111111",
];
const SIZES = ["XX-Small", "X-Small", "Small", "Medium", "Large", "X-Large", "3X-Large", "4X-Large"];
const DRESS_STYLES = ["Casual", "Formal", "Party", "Gym"];

export default function CategoryFilterPage() {
    /* --- States --- */
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Filter States
    const [activeColor, setActiveColor] = useState("#3B82F6");
    const [activeSize, setActiveSize] = useState("Large");
    const [priceValues, setPriceValues] = useState([50, 200]);
    const [openSections, setOpenSections] = useState({
        price: true,
        colors: true,
        size: true,
        dressStyle: true,
    });

    // Pagination State
    const [page, setPage] = useState(1);

    /* --- API Call --- */
    useEffect(() => {
        axios
            .get("http://localhost:4000/api/all-products/")
                .then((res) => {
                    setProducts(res.data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching products:", err);
                    setLoading(false);
                });
    }, []);

    /* --- Handlers --- */
    const toggleSection = (sectionKey) => {
        setOpenSections((prev) => ({
            ...prev,
            [sectionKey]: !prev[sectionKey],
        }));
    };

    const pct = useCallback((v) => ((v - 0) / (250 - 0)) * 100, []);

    /* --- Internal UI Renderer: Filters Card --- */
    const renderFiltersCard = (isMobile = false) => (
        <div className="filters-card">
            <div className="filters-head">
                <h3>Filters</h3>
                {isMobile ? (
                    <button className="icon-btn" onClick={() => setDrawerOpen(false)} aria-label="Close filters">
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                ) : (
                    <FontAwesomeIcon icon={faSliders} />
                )}
            </div>

            {/* Categories */}
            <div className="cat-list">
                {CATEGORIES.map((c) => (
                    <button key={c} className="cat-item">
                        <span>{c}</span>
                        <FontAwesomeIcon icon={faChevronRight} style={{ color: "rgba(0,0,0,0.4)" }} />
                    </button>
                ))}
            </div>

            {/* Price Section */}
            <div className="filter-section">
                <button className="filter-section-head" onClick={() => toggleSection("price")}>
                    <span>Price</span>
                    <FontAwesomeIcon icon={openSections.price ? faChevronUp : faChevronDown} />
                </button>
                {openSections.price && (
                    <div className="filter-section-body">
                        <div className="price-range">
                            <div className="price-range-track">
                                <div
                                    className="price-range-fill"
                                    style={{
                                        left: `${pct(priceValues[0])}%`,
                                        right: `${100 - pct(priceValues[1])}%`,
                                    }}
                                />
                                <input
                                    type="range"
                                    min={0}
                                    max={250}
                                    value={priceValues[0]}
                                    onChange={(e) =>
                                        setPriceValues([Math.min(Number(e.target.value), priceValues[1] - 1), priceValues[1]])
                                    }
                                    className="range-input"
                                />
                                <input
                                    type="range"
                                    min={0}
                                    max={250}
                                    value={priceValues[1]}
                                    onChange={(e) =>
                                        setPriceValues([priceValues[0], Math.max(Number(e.target.value), priceValues[0] + 1)])
                                    }
                                    className="range-input"
                                />
                            </div>
                            <div className="price-range-labels">
                                <span>${priceValues[0]}</span>
                                <span>${priceValues[1]}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Colors Section */}
            <div className="filter-section">
                <button className="filter-section-head" onClick={() => toggleSection("colors")}>
                    <span>Colors</span>
                    <FontAwesomeIcon icon={openSections.colors ? faChevronUp : faChevronDown} />
                </button>
                {openSections.colors && (
                    <div className="filter-section-body">
                        <div className="color-grid">
                            {COLORS.map((c) => {
                                const active = c === activeColor;
                                const isWhite = c === "#FFFFFF";
                                return (
                                    <button
                                        key={c}
                                        className="swatch"
                                        style={{
                                            backgroundColor: c,
                                            border: isWhite ? "1px solid #E3E3E3" : "none",
                                        }}
                                        onClick={() => setActiveColor(c)}
                                    >
                                        {active && (
                                            <FontAwesomeIcon
                                                icon={faCheck}
                                                style={{ color: isWhite || c === "#F0C808" ? "#111" : "#fff" }}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Size Section */}
            <div className="filter-section">
                <button className="filter-section-head" onClick={() => toggleSection("size")}>
                    <span>Size</span>
                    <FontAwesomeIcon icon={openSections.size ? faChevronUp : faChevronDown} />
                </button>
                {openSections.size && (
                    <div className="filter-section-body">
                        <div className="size-grid">
                            {SIZES.map((s) => (
                                <button
                                    key={s}
                                    className={`size-pill ${activeSize === s ? "active" : ""}`}
                                    onClick={() => setActiveSize(s)}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Dress Style Section */}
            <div className="filter-section no-divider">
                <button className="filter-section-head" onClick={() => toggleSection("dressStyle")}>
                    <span>Dress Style</span>
                    <FontAwesomeIcon icon={openSections.dressStyle ? faChevronUp : faChevronDown} />
                </button>
                {openSections.dressStyle && (
                    <div className="filter-section-body">
                        <div className="cat-list">
                            {DRESS_STYLES.map((d) => (
                                <button key={d} className="cat-item">
                                    <span>{d}</span>
                                    <FontAwesomeIcon icon={faChevronRight} style={{ color: "rgba(0,0,0,0.4)" }} />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <button className="apply-btn">Apply Filter</button>
        </div>
    );

    return (
        <div className="page-root">
            <div className="container">
                {/* Breadcrumb */}
                <div className="breadcrumb">
                    Home <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: "11px" }} />{" "}
                    <span className="current">Casual</span>
                </div>

                {/* Header Row */}
                <div className="header-row">
                    <div className="title-wrap">
                        <h1>Casual</h1>
                        <button
                            className="mobile-filter-btn"
                            onClick={() => setDrawerOpen(true)}
                            aria-label="Open filters"
                        >
                            <FontAwesomeIcon icon={faSliders} />
                        </button>
                    </div>

                    <div className="meta-wrap">
                        <span className="meta-text">
                            Showing 1-{products.length} of {products.length || 100} Products
                        </span>
                        <label className="sort-select">
                            Sort by:
                            <select defaultValue="popular">
                                <option value="popular">Most Popular</option>
                                <option value="newest">Newest</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </label>
                    </div>
                </div>

                {/* Main Grid Layout */}
                <div className="layout">
                    {/* Desktop Sidebar */}
                    <aside className="sidebar-desktop">{renderFiltersCard(false)}</aside>

                    {/* Product Grid Area */}
                    <main className="grid-wrap">
                        {loading ? (
                            <div style={{ padding: "40px", textAlign: "center" }}>Loading products...</div>
                        ) : (
                            <div className="product-grid">
                                {products.map((p) => {
                                    const imgPath =
                                        p.image ||
                                        (p.images && p.images[0]) ||
                                        "https://via.placeholder.com/300x300?text=Product";

                                    return (
                                        <div key={p.id} className="product-card">
                                            <div className="product-image">
                                                <img
                                                    src={getImageUrl(imgPath)}
                                                    alt={p.name}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://via.placeholder.com/300x300?text=Product";
                                                    }}
                                                />
                                            </div>
                                            <h4 className="product-name">{p.name}</h4>

                                            {/* Stars Row */}
                                            <div className="stars">
                                                {[1, 2, 3, 4, 5].map((starIdx) => (
                                                    <FontAwesomeIcon
                                                        key={starIdx}
                                                        icon={faStarSolid}
                                                        style={{
                                                            color: starIdx <= Math.round(p.rating || 4.5) ? "#FFC633" : "#D1D1D1",
                                                            fontSize: "13px",
                                                        }}
                                                    />
                                                ))}
                                                <span className="stars-score">{Number(p.rating || 4.5).toFixed(1)}/5</span>
                                            </div>

                                            {/* Price Row */}
                                            <div className="price-row">
                                                <span className="price-current">${p.price}</span>
                                                {p.originalPrice && <span className="price-old">${p.originalPrice}</span>}
                                                {p.discountPercentage && (
                                                    <span className="discount-badge">-{p.discountPercentage}%</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="pagination">
                            <button
                                className="page-nav"
                                disabled={page === 1}
                                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                            >
                                <FontAwesomeIcon icon={faArrowLeft} /> Previous
                            </button>
                            <div className="page-numbers">
                                {[1, 2, 3, "...", 8, 9, 10].map((p, i) =>
                                    p === "..." ? (
                                        <span key={i} className="page-ellipsis">…</span>
                                    ) : (
                                        <button
                                            key={i}
                                            className={`page-num ${page === p ? "active" : ""}`}
                                            onClick={() => setPage(p)}
                                        >
                                            {p}
                                        </button>
                                    )
                                )}
                            </div>
                            <button
                                className="page-nav"
                                onClick={() => setPage((prev) => Math.min(10, prev + 1))}
                            >
                                Next <FontAwesomeIcon icon={faArrowRight} />
                            </button>
                        </div>
                    </main>
                </div>
            </div>

            {/* Mobile Drawer Filter */}
            {drawerOpen && (
                <div className="drawer-overlay" onClick={() => setDrawerOpen(false)}>
                    <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
                        {renderFiltersCard(true)}
                    </div>
                </div>
            )}
        </div>
    );
}