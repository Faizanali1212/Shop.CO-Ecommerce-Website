import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../style/Home.css";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faTwitter,
  faFacebookF,
  faInstagram,
  faGithub,
  faCcVisa,
  faCcMastercard,
  faCcPaypal,
  faApplePay,
  faGooglePay,
} from "@fortawesome/free-brands-svg-icons";

const LINK_COLUMNS = [
  {
    title: "Company",
    links: ["About", "Features", "Works", "Career"],
  },
  {
    title: "Help",
    links: ["Customer Support", "Delivery Details", "Terms & Conditions", "Privacy Policy"],
  },
  {
    title: "FAQ",
    links: ["Account", "Manage Deliveries", "Orders", "Payments"],
  },
  {
    title: "Resources",
    links: ["Free eBooks", "Development Tutorial", "How to - Blog", "Youtube Playlist"],
  },
];

const SOCIAL_LINKS = [
  { name: "twitter", icon: faTwitter },
  { name: "facebook", icon: faFacebookF },
  { name: "instagram", icon: faInstagram },
  { name: "github", icon: faGithub },
];

const PAYMENT_METHODS = [
  { name: "Visa", icon: faCcVisa },
  { name: "Mastercard", icon: faCcMastercard },
  { name: "Paypal", icon: faCcPaypal },
  { name: "Apple Pay", icon: faApplePay },
  { name: "Google Pay", icon: faGooglePay },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    // Hook up to newsletter API later
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="newsletter-box">
          <h3 className="newsletter-box__title">
            STAY UPTO DATE ABOUT OUR LATEST OFFERS
          </h3>

          <form className="newsletter-box__form" onSubmit={handleSubscribe}>
            <div className="newsletter-box__input-wrap">
              <FontAwesomeIcon icon={faEnvelope} className="newsletter-box__icon" />
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
            </div>
            <button type="submit" className="btn btn-white">
              {subscribed ? "Subscribed!" : "Subscribe to Newsletter"}
            </button>
          </form>
        </div>
      </div>

      <div className="site-footer__main">
        <div className="container site-footer__grid">
          <div className="site-footer__brand">
            <a href="/" className="site-footer__logo">
              SHOP.CO
            </a>
            <p>
              We have clothes that suits your style and which you're proud to
              wear. From women to men.
            </p>
            <div className="site-footer__socials">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className="site-footer__social-icon"
                  aria-label={social.name}
                >
                  <FontAwesomeIcon icon={social.icon} />
                </a>
              ))}
            </div>
          </div>

          {LINK_COLUMNS.map((col) => (
            <div key={col.title} className="site-footer__col">
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="container site-footer__bottom">
          <p>SHOP.CO &copy; {new Date().getFullYear()}, All Rights Reserved</p>
          <div className="site-footer__payments">
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method.name}
                className="site-footer__payment-badge"
                aria-label={method.name}
                title={method.name}
              >
                <FontAwesomeIcon icon={method.icon} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;