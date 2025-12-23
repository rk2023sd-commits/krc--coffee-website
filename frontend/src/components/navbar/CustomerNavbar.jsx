import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "./CustomerNavbar.css";
import { useAuth } from "../../context/AuthContext";

export default function CustomerNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

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
          <div
            className="logo"
            onClick={() => navigate("/customer/home")}
          >
            KRC<span>!</span> Coffee
          </div>

          {/* ===== Desktop Menu ===== */}
          <nav className="nav-links">
            <Link to="/customer/home">Home</Link>

            {/* Shop Dropdown */}
            <div className="dropdown">
              <span>Shop</span>
              <div className="dropdown-menu">
                <Link to="/customer/new-arrivals">New Arrivals</Link>
                <Link to="/customer/best-sellers">Best Sellers</Link>
                <Link to="/customer/offers">Offers</Link>
                <Link to="/customer/wishlist">Wishlist</Link>
              </div>
            </div>

            <Link to="/customer/orders">My Orders</Link>
            <Link to="/customer/cart">Cart</Link>
            <Link to="/customer/notifications">Notifications</Link>

            {/* Profile Dropdown (TEXT ONLY) */}
            <div className="dropdown">
              <span>{user?.name || "Profile"}</span>
              <div className="dropdown-menu">
                <Link to="/customer/profile/dashboard">Dashboard</Link>
                <Link to="/customer/orders">My Orders</Link>
                <Link to="/customer/profile/addresses">Saved Addresses</Link>
                <Link to="/customer/profile/payments">Payments</Link>
                <Link to="/customer/profile/rewards">Rewards / Points</Link>
                <Link to="/customer/profile/security">Security Settings</Link>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </nav>

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
          <Link to="/customer/home" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          {/* Shop Accordion */}
          <div className="mobile-dropdown">
            <span onClick={() => setShopOpen(!shopOpen)}>Shop</span>
            {shopOpen && (
              <div className="mobile-submenu">
                <Link to="/customer/new-arrivals">New Arrivals</Link>
                <Link to="/customer/best-sellers">Best Sellers</Link>
                <Link to="/customer/offers">Offers</Link>
                <Link to="/customer/wishlist">Wishlist</Link>
              </div>
            )}
          </div>

          <Link to="/customer/orders">My Orders</Link>
          <Link to="/customer/cart">Cart</Link>
          <Link to="/customer/notifications">Notifications</Link>

          {/* Profile Accordion */}
          <div className="mobile-dropdown">
            <span onClick={() => setProfileOpen(!profileOpen)}>
              {user?.name || "Profile"}
            </span>
            {profileOpen && (
              <div className="mobile-submenu">
                <Link to="/customer/profile/dashboard">Dashboard</Link>
                <Link to="/customer/orders">My Orders</Link>
                <Link to="/customer/profile/addresses">Saved Addresses</Link>
                <Link to="/customer/profile/payments">Payments</Link>
                <Link to="/customer/profile/rewards">Rewards / Points</Link>
                <Link to="/customer/profile/security">Security Settings</Link>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
}
