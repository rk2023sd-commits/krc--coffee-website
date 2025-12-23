import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "./PublicNavbar.css";
import { useAuth } from "../../context/AuthContext";

export default function PublicNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header className="navbar">
        <div className="nav-container">
          {/* Logo */}
          <div className="logo" onClick={() => navigate("/")}>
            KRC<span>!</span> Coffee
          </div>

          {/* ===== Desktop Menu ===== */}
          <nav className="nav-links">
            <Link to="/">Home</Link>

            {/* Shop Dropdown */}
            <div className="dropdown">
              <span>Shop</span>
              <div className="dropdown-menu">
                <Link to="/shop">All Products</Link>
                <Link to="/shop/coffee">Coffee</Link>
                <Link to="/shop/cold-coffee">Cold Coffee</Link>
                <Link to="/shop/snacks">Snacks</Link>
                <Link to="/shop/combos">Combos</Link>
                <Link to="/shop/gift-packs">Gift Packs</Link>
              </div>
            </div>

            <Link to="/offers">Offers</Link>

            {/* Help Dropdown */}
            <div className="dropdown">
              <span>Help</span>
              <div className="dropdown-menu">
                <Link to="/about">About Us</Link>
                <Link to="/contact">Contact Us</Link>
                <Link to="/faqs">FAQs</Link>
                <Link to="/blog">Blog / Coffee Guide</Link>
              </div>
            </div>
          </nav>

          {/* Right Button */}
          <div className="nav-icons desktop-icons">
            {!user ? (
              <button className="login-btn" onClick={() => navigate("/login")}>
                Login
              </button>
            ) : (
              <button className="login-btn" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>

          {/* Hamburger */}
          <div className="hamburger" onClick={() => setMenuOpen(true)}>
            <FaBars />
          </div>
        </div>
      </header>

      {/* ================= MOBILE MENU ================= */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="mobile-header">
          <span>Menu</span>
          <FaTimes onClick={() => setMenuOpen(false)} />
        </div>

        <div className="mobile-content">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>

          {/* Shop Accordion */}
          <div className="mobile-dropdown">
            <span onClick={() => setShopOpen(!shopOpen)}>Shop</span>
            {shopOpen && (
              <div className="mobile-submenu">
                <Link to="/shop">All Products</Link>
                <Link to="/shop/coffee">Coffee</Link>
                <Link to="/shop/cold-coffee">Cold Coffee</Link>
                <Link to="/shop/snacks">Snacks</Link>
                <Link to="/shop/combos">Combos</Link>
                <Link to="/shop/gift-packs">Gift Packs</Link>
              </div>
            )}
          </div>

          <Link to="/offers">Offers</Link>

          {/* Help Accordion */}
          <div className="mobile-dropdown">
            <span onClick={() => setHelpOpen(!helpOpen)}>Help</span>
            {helpOpen && (
              <div className="mobile-submenu">
                <Link to="/about">About Us</Link>
                <Link to="/contact">Contact Us</Link>
                <Link to="/faqs">FAQs</Link>
                <Link to="/blog">Blog / Coffee Guide</Link>
              </div>
            )}
          </div>

          {!user ? (
            <button
              className="login-btn mobile-login"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          ) : (
            <button
              className="login-btn mobile-login"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
}
