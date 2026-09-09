import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../style/Home.css";
import {
  faBars,
  faMagnifyingGlass,
  faCartShopping,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../context/useCart.js";

const NAV_LINKS = [
  { label: "Shop", to: "/" },
  { label: "On Sale", to: "/" },
  { label: "New Arrivals", to: "/#new-arrivals" },
  { label: "Brands", to: "/" },
  { label: "Casual", to: "/catagory" },
  { label: "Carts", to: "/cart" },
];

const Header = () => {
  // The badge reads from shared cart state so every page stays synchronized.
  const { itemCount } = useCart();
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      return localStorage.getItem("token")?.trim()
        ? JSON.parse(localStorage.getItem("shopco_user")) || null
        : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const updateUser = () => {
      try {
        const token = localStorage.getItem("token");
        setUser(token?.trim() ? JSON.parse(localStorage.getItem("shopco_user")) || null : null);
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("shopco-auth-changed", updateUser);
    window.addEventListener("storage", updateUser);
    return () => {
      window.removeEventListener("shopco-auth-changed", updateUser);
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  const userInitial = (user?.name || user?.email || "U").charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("shopco_user");
    window.dispatchEvent(new Event("shopco-auth-changed"));
    setIsProfileMenuOpen(false);
  };

  return (
    <header className="site-header">
      {showAnnouncement && (
        <div className="announcement-bar">
          <p>
            Sign up and get 20% off to your first order.{" "}
            <a href="#signup" className="announcement-bar__link">
              Sign Up Now
            </a>
          </p>
          <button
            className="announcement-bar__close"
            aria-label="Dismiss announcement"
            onClick={() => setShowAnnouncement(false)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      )}

      <nav className="navbar container">
        <button
          className="navbar__hamburger"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        <a href="/" className="navbar__logo">
          SHOP.CO
        </a>

        <ul className="navbar__links navbar__links--desktop">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link to={link.to}>{link.label}</Link>
            </li>
          ))}
        </ul>

        <div className="navbar__search">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="navbar__search-icon" />
          <input type="text" placeholder="Search for products..." aria-label="Search products" />
        </div>

        <div className="navbar__icons">
          <button
            type="button"
            aria-label="Search products"
            className="navbar__icon-btn navbar__search-trigger"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
          <Link to="/cart" aria-label={`Cart, ${itemCount} items`} className="navbar__icon-btn navbar__cart-link">
            <FontAwesomeIcon icon={faCartShopping} />
            {itemCount > 0 && <span className="navbar__cart-count">{itemCount}</span>}
          </Link>
          <div className="navbar__profile">
            <button
              type="button"
              aria-label="Profile"
              aria-expanded={isProfileMenuOpen}
              className="navbar__icon-btn navbar__avatar"
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            >
              {user ? userInitial : <FontAwesomeIcon icon={faUser} />}
            </button>
            {user && isProfileMenuOpen && (
              <div className="navbar__profile-menu">
                <span className="navbar__profile-name">
                  {user.name || user.email}
                </span>
                <button type="button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
          {!user && (
            <Link to="/signup" className="navbar__signup-link">
              Sign Up
            </Link>
          )}
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="navbar__search navbar__search--mobile">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="navbar__search-icon" />
            <input type="text" placeholder="Search for products..." aria-label="Search products" />
          </div>
          <ul className="mobile-menu__links">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link to={link.to} onClick={() => setIsMobileMenuOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;