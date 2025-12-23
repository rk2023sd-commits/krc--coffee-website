import "./Login.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);

      // save token + user in context
      login(res.data);

      // role based redirect
      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/customer/home");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
      <div className="login-box">

        {/* LEFT INFO */}
        <div className="login-info">
          <h2>
            Welcome to <span>KRC!</span>
          </h2>
          <p>
            Login to enjoy premium coffee, exclusive rewards and faster checkout.
          </p>

          <ul>
            <li>✔ Earn Reward Points</li>
            <li>✔ Quick Orders</li>
            <li>✔ Secure Payments</li>
          </ul>
        </div>

        {/* RIGHT FORM */}
        <div className="login-form">
          <h3>Sign In</h3>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <FaUser />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <FaLock />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                onChange={handleChange}
              />
            </div>

            <button className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="forgot">Forgot Password?</p>

          <div className="divider">
            <span>OR</span>
          </div>

          <button className="google-btn">Continue with Google</button>

          {/* REGISTER LINK */}
          <p className="signup-text">
            New to KRC?{" "}
            <Link to="/register" className="signup-link">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
