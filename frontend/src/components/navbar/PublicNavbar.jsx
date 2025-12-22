import { useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";

export default function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const logoutHandler = () => {
    setIsLoggedIn(false);
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <header className="navbar">
        <div className="nav-container">
          {/* Logo */}
          <div className="logo">
            KRC<span>!</span> Coffee
          </div>

          {/* ===== Desktop Menu ===== */}
          <nav className="nav-links">
            {!isLoggedIn ? (
              <>
                <Link to="/">Home</Link>
                <Link to="/gift">Gift</Link>
                <Link to="/order">Order</Link>
                <Link to="/pay">Pay</Link>
                <Link to="/store">Store</Link>
                <Link to="/login">Login</Link>
              </>
            ) : (
              <>
                <Link to="/customer/dashboard">Dashboard</Link>
                <Link to="/customer/orders">My Orders</Link>
                <Link to="/customer/cart">Cart</Link>
                <Link to="/customer/profile">Profile</Link>
                <span className="logout-link" onClick={logoutHandler}>
                  Logout
                </span>
              </>
            )}
          </nav>

          {/* ===== Desktop Icons ===== */}
          <div className="nav-icons desktop-icons">
            <FaUser />
            {!isLoggedIn ? (
              <button
                className="login-btn"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            ) : (
              <button className="login-btn" onClick={logoutHandler}>
                Logout
              </button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="hamburger" onClick={() => setMenuOpen(true)}>
            <FaBars />
          </div>
        </div>
      </header>

      {/* ===== Mobile Slide Menu ===== */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="mobile-header">
          <span>Menu</span>
          <FaTimes onClick={() => setMenuOpen(false)} />
        </div>

        <div className="mobile-content">
          {!isLoggedIn ? (
            <>
              <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/gift" onClick={() => setMenuOpen(false)}>Gift</Link>
              <Link to="/order" onClick={() => setMenuOpen(false)}>Order</Link>
              <Link to="/pay" onClick={() => setMenuOpen(false)}>Pay</Link>
              <Link to="/store" onClick={() => setMenuOpen(false)}>Store</Link>

              <button
                className="login-btn mobile-login"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/login");
                }}
              >
                Login
              </button>
            </>
          ) : (
            <>
              <Link to="/customer/dashboard" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <Link to="/customer/orders" onClick={() => setMenuOpen(false)}>
                My Orders
              </Link>
              <Link to="/customer/cart" onClick={() => setMenuOpen(false)}>
                Cart
              </Link>
              <Link to="/customer/profile" onClick={() => setMenuOpen(false)}>
                Profile
              </Link>

              <button
                className="login-btn mobile-login"
                onClick={logoutHandler}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)}></div>
      )}
    </>
  );
}
