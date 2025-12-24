import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// layouts
import PublicLayout from "../layouts/PublicLayout";
import CustomerLayout from "../layouts/CustomerLayout";
import AdminLayout from "../layouts/AdminLayout";

// public pages
import Home from "../pages/public/Home";
import Shop from "../pages/public/Shop";
import Offers from "../pages/public/Offers";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";

// customer pages
import CustomerHome from "../pages/customer/Home";
import NewArrivals from "../pages/customer/NewArrivals";
import BestSellers from "../pages/customer/BestSellers";
import Wishlist from "../pages/customer/Wishlist";
import Cart from "../pages/customer/Cart";
import MyOrders from "../pages/customer/MyOrders";
import Notifications from "../pages/customer/Notifications";
import CustomerOffers from "../pages/customer/Offers";
import Dashboard from "../pages/customer/profile/Dashboard";
import Addresses from "../pages/customer/profile/Addresses";
import Payments from "../pages/customer/profile/Payments";
import Rewards from "../pages/customer/profile/Rewards";
import Security from "../pages/customer/profile/Security";


// admin pages
import AdminDashboard from "../pages/admin/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        }
      />

      <Route
        path="/shop"
        element={
          <PublicLayout>
            <Shop />
          </PublicLayout>
        }
      />

      <Route
        path="/offers"
        element={
          <PublicLayout>
            <Offers />
          </PublicLayout>
        }
      />

      <Route
        path="/about"
        element={
          <PublicLayout>
            <About />
          </PublicLayout>
        }
      />

      <Route
        path="/contact"
        element={
          <PublicLayout>
            <Contact />
          </PublicLayout>
        }
      />

      <Route
        path="/login"
        element={
          <PublicLayout>
            <Login />
          </PublicLayout>
        }
      />

      <Route
        path="/register"
        element={
          <PublicLayout>
            <Register />
          </PublicLayout>
        }
      />

      {/* ================= CUSTOMER ROUTES ================= */}
     {/* CUSTOMER ROUTES */}
<Route
  path="/customer"
  element={
    <ProtectedRoute role="customer">
      <CustomerLayout />
    </ProtectedRoute>
  }
>
  <Route path="home" element={<CustomerHome />} />
  <Route path="new-arrivals" element={<NewArrivals />} />
  <Route path="best-sellers" element={<BestSellers />} />
  <Route path="offers" element={<CustomerOffers />} />
  <Route path="wishlist" element={<Wishlist />} />
  <Route path="cart" element={<Cart />} />
  <Route path="orders" element={<MyOrders />} />
  <Route path="notifications" element={<Notifications />} />
  <Route path="profile/dashboard" element={<Dashboard />} />
  <Route path="profile/addresses" element={<Addresses />} />
  <Route path="profile/payments" element={<Payments />} />
  <Route path="profile/rewards" element={<Rewards />} />
  <Route path="profile/security" element={<Security />} />
</Route>

      {/* ================= ADMIN ROUTES ================= */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
