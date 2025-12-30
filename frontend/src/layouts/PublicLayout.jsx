import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';

const PublicLayout = () => {
    return (
        <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
            <PublicNavbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <footer className="bg-[#2C1810] text-white py-12">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-2xl font-[Outfit] font-bold mb-4 text-[#C97E45]">KRC! Coffee</h3>
                        <p className="text-gray-400">Premium coffee experience delivered to your doorstep.</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Shop</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>Coffee</li>
                            <li>Cold Coffee</li>
                            <li>Snacks</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Support</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>Contact Us</li>
                            <li>FAQs</li>
                            <li>Shipping Policy</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Newsletter</h4>
                        <p className="text-gray-400 mb-4">Subscribe for latest offers.</p>
                        <div className="flex">
                            <input type="email" placeholder="Your email" className="bg-[#3a2220] border-none text-white px-4 py-2 rounded-l w-full focus:outline-none" />
                            <button className="bg-[#C97E45] px-4 py-2 rounded-r font-bold">JOIN</button>
                        </div>
                    </div>
                </div>
                <div className="text-center text-gray-600 mt-12 pt-8 border-t border-[#3a2220]">
                    © 2024 KRC! Coffee. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
