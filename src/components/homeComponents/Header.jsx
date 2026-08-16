import React, { useState } from "react";
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

const NAV_LINKS = [
  { label: "Shop", to: "/" },
  { label: "On Sale", to: "/" },
  { label: "New Arrivals", to: "/#new-arrivals" },
  { label: "Brands", to: "/" },
  { label: "Casual", to: "/catagory" },
  { label: "Carts", to: "/cart" },
];

const Header = () => {
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <button aria-label="Cart" className="navbar__icon-btn">
            <FontAwesomeIcon icon={faCartShopping} />
          </button>
          <button aria-label="Profile" className="navbar__icon-btn">
            <FontAwesomeIcon icon={faUser} />
          </button>
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