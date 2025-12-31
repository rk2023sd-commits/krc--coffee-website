import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Shop from './pages/public/Shop';
import Cart from './pages/public/Cart';
import Checkout from './pages/public/Checkout';
import ProductDetails from './pages/public/ProductDetails';
import PublicOffers from './pages/public/Offers';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import FAQs from './pages/public/FAQs';
import BlogList from './pages/public/BlogList';
import BlogPost from './pages/public/BlogPost';
import ForgotPassword from './pages/public/ForgotPassword';
import ResetPassword from './pages/public/ResetPassword';

// Customer Pages
import Addresses from './pages/customer/Addresses';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerHome from './pages/customer/CustomerHome';
import OrderHistory from './pages/customer/OrderHistory';

import CustomerOffers from './pages/customer/Offers';
import CustomerWishlist from './pages/customer/Wishlist';
import NewArrivals from './pages/customer/NewArrivals';
import BestSellers from './pages/customer/BestSellers';
import Notifications from './pages/customer/Notifications';
import Rewards from './pages/customer/Rewards';
import Security from './pages/customer/Security';
import Payments from './pages/customer/Payments';



// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AddProduct from './pages/admin/AddProduct';
import AllProducts from './pages/admin/AllProducts';
import EditProduct from './pages/admin/EditProduct';
import Categories from './pages/admin/Categories';
import Inventory from './pages/admin/Inventory';
import OrdersList from './pages/admin/OrdersList';
import OrderDetails from './pages/admin/OrderDetails';
import Customers from './pages/admin/Customers';
import Staff from './pages/admin/Staff';
import Roles from './pages/admin/Roles';
import SalesReport from './pages/admin/SalesReport';
import RevenueAnalysis from './pages/admin/RevenueAnalysis';
import ProductPerformance from './pages/admin/ProductPerformance';
import CMSPages from './pages/admin/CMSPages';
import PaymentSettings from './pages/admin/PaymentSettings';
import TaxDeliverySettings from './pages/admin/TaxDeliverySettings';
import NotificationSettings from './pages/admin/NotificationSettings';
import SystemLogs from './pages/admin/SystemLogs';
import Offers from './pages/admin/Offers';

// Shared Placeholders
const Placeholder = ({ title }) => (
  <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center">
    <h2 className="text-2xl font-bold text-[#4A2C2A] mb-2">{title} Page</h2>
    <p className="text-slate-500">This module is currently under development to ensure the best experience.</p>
  </div>
);

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="shop/:category" element={<Shop />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="offers" element={<PublicOffers />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faqs" element={<FAQs />} />
          <Route path="blog" element={<BlogList />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="reviews" element={<Placeholder title="Reviews" />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* Customer Routes */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<CustomerHome />} />
          <Route path="home" element={<CustomerHome />} />
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="orders" element={<OrderHistory />} />

          <Route path="cart" element={<Cart />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="addresses" element={<Addresses />} />
          <Route path="payments" element={<Payments />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="security" element={<Security />} />


          <Route path="shop" element={<Shop />} />
          <Route path="new-arrivals" element={<NewArrivals />} />
          <Route path="best-sellers" element={<BestSellers />} />
          <Route path="offers" element={<CustomerOffers />} />
          <Route path="wishlist" element={<CustomerWishlist />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          {/* Products Sub-routes */}
          <Route path="products/all" element={<AllProducts />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/categories" element={<Categories />} />
          <Route path="products/inventory" element={<Inventory />} />

          {/* Orders Sub-routes */}
          <Route path="orders/all" element={<OrdersList statusFilter="All" />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="orders/pending" element={<OrdersList statusFilter="Pending" />} />
          <Route path="orders/delivered" element={<OrdersList statusFilter="Delivered" />} />
          <Route path="orders/cancel" element={<OrdersList statusFilter="Cancelled" />} />

          {/* Users Sub-routes */}
          <Route path="users/customer" element={<Customers />} />
          <Route path="users/staff" element={<Staff />} />
          <Route path="users/roles" element={<Roles />} />

          <Route path="offers" element={<Offers />} />

          {/* Reports Sub-routes */}
          <Route path="reports/sales" element={<SalesReport />} />
          <Route path="reports/revenue" element={<RevenueAnalysis />} />
          <Route path="reports/performance" element={<ProductPerformance />} />

          {/* Settings Sub-routes */}
          <Route path="settings/cms" element={<CMSPages />} />
          <Route path="settings/payments" element={<PaymentSettings />} />
          <Route path="settings/tax" element={<TaxDeliverySettings />} />
          <Route path="settings/notifications" element={<NotificationSettings />} />
          <Route path="settings/logs" element={<SystemLogs />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
