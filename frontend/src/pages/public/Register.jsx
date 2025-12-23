import "./Register.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      // auto login after register
      login(res.data);

      navigate("/customer/home");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="register-page">
      <div className="register-box">

        {/* LEFT BRAND */}
        <div className="register-info">
          <h2>
            Join <span>KRC!</span>
          </h2>
          <p>
            Create your account to enjoy exclusive coffee rewards,
            faster checkout and special offers.
          </p>

          <ul>
            <li>✔ Welcome Gift on Signup</li>
            <li>✔ Order History & Rewards</li>
            <li>✔ Secure & Fast Payments</li>
          </ul>
        </div>

        {/* RIGHT FORM */}
        <div className="register-form">
          <h3>Create Account</h3>

          {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

          <form onSubmit={handleRegister}>
            <div className="input-group">
              <FaUser />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <FaEnvelope />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <FaPhone />
              <input
                type="tel"
                name="phone"
                placeholder="Mobile Number"
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

            <div className="input-group">
              <FaLock />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                onChange={handleChange}
              />
            </div>

            <button className="register-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="terms">
            By signing up, you agree to our <span>Terms</span> &{" "}
            <span>Privacy Policy</span>
          </p>

          <p className="login-text">
            Already have an account?{" "}
            <Link to="/login" className="login-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
