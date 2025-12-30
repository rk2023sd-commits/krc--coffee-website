import React from 'react';

const PlaceholderPage = ({ title }) => (
    <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-[#4A2C2A] mb-4">{title}</h1>
        <p className="text-lg text-gray-600">This page is under construction.</p>
    </div>
);

export const Shop = () => <PlaceholderPage title="Shop" />;
export const Offers = () => <PlaceholderPage title="Offers" />;
export const About = () => <PlaceholderPage title="About Us" />;
export const Contact = () => <PlaceholderPage title="Contact Us" />;
export const Faqs = () => <PlaceholderPage title="FAQs" />;
export const Blog = () => <PlaceholderPage title="Blog" />;
export const Reviews = () => <PlaceholderPage title="Reviews" />;

export const Login = () => <PlaceholderPage title="Login" />;
export const Register = () => <PlaceholderPage title="Register" />;

// Customer Pages
export const CustomerDashboard = () => <PlaceholderPage title="Customer Dashboard" />;
export const CustomerOrders = () => <PlaceholderPage title="My Orders" />;
export const CustomerCart = () => <PlaceholderPage title="Cart" />;
export const CustomerProfile = () => <PlaceholderPage title="Profile" />;

// Admin Pages
export const AdminDashboard = () => <PlaceholderPage title="Admin Dashboard" />;
export const AdminProducts = () => <PlaceholderPage title="Product Management" />;
export const AdminOrders = () => <PlaceholderPage title="Order Management" />;
export const AdminUsers = () => <PlaceholderPage title="User Management" />;
