import React, { useState } from 'react';
import toast from 'react-hot-toast';
import API_URL from '../config';
import { useCart } from '../context/CartContext';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    Home, ShoppingBag, ClipboardList, Bell, User,
    Heart, Ticket, MapPin, CreditCard, Gift, ShoppingCart,
    ShieldCheck, LogOut, Menu, X, ChevronDown, Sparkles, TrendingUp, Coffee
} from 'lucide-react';

const CustomerLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Protection Logic
    const token = localStorage.getItem('token');

    React.useEffect(() => {
        if (!token) {
            navigate('/login', { replace: true, state: { from: location } });
        }
    }, [token, navigate, location]);



    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const [unreadCount, setUnreadCount] = useState(0);

    React.useEffect(() => {
        const fetchCount = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const res = await fetch(`${API_URL}/api/notifications`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setUnreadCount(data.data.filter(n => !n.isRead).length);
                }
            } catch (err) {
                console.error("Layout notification fetch error", err);
            }
        };

        fetchCount();
        const interval = setInterval(fetchCount, 30000); // Check every 30s

        // Listen for internal notification updates
        window.addEventListener('notifRefresh', fetchCount);

        return () => {
            clearInterval(interval);
            window.removeEventListener('notifRefresh', fetchCount);
        };
    }, [location.pathname]); // Re-check when navigating

    const { cartCount } = useCart();
    const [counts, setCounts] = useState({
        wishlist: 0,
        orders: 0
    });

    React.useEffect(() => {
        const fetchCounts = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                // Wishlist
                const profileRes = await fetch(`${API_URL}/api/users/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const profileData = await profileRes.json();

                // Orders
                const ordersRes = await fetch(`${API_URL}/api/orders/myorders`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const ordersData = await ordersRes.json();

                setCounts({
                    wishlist: profileData.success && profileData.data.wishlist ? profileData.data.wishlist.length : 0,
                    orders: ordersData.success ? ordersData.data.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length : 0
                });
            } catch (e) { console.error(e); }
        };
        fetchCounts();
        // Listen for updates
        window.addEventListener('countRefresh', fetchCounts);
        return () => window.removeEventListener('countRefresh', fetchCounts);
    }, []);

    const menuItems = [
        { icon: Home, label: 'Home Feed', path: '/customer' },
        { icon: Coffee, label: 'Brew Your Own', path: '/customer/brew-your-own', isNew: true },
        { icon: ShoppingBag, label: 'Shop Now', path: '/customer/shop' },
        { icon: Sparkles, label: 'New Arrivals', path: '/customer/new-arrivals' },
        { icon: TrendingUp, label: 'Best Sellers', path: '/customer/best-sellers' },
        { icon: Ticket, label: 'Offers', path: '/customer/offers' },
        { icon: Heart, label: 'My Wishlist', path: '/customer/wishlist', count: counts.wishlist },
        { icon: ShoppingCart, label: 'My Cart', path: '/customer/cart', count: cartCount },
        { icon: ClipboardList, label: 'My Orders', path: '/customer/orders', count: counts.orders },
        { icon: Bell, label: 'Notifications', path: '/customer/notifications', count: unreadCount },
    ];

    // Romantic AI Notification Logic
    React.useEffect(() => {
        const messages = [
            "You + Coffee = The Perfect Blend ☕❤️",
            "Thinking of you... and your next delicious Latte.",
            "You look brew-tiful today! ✨",
            "Just a reminder: You are loved (and so is coffee).",
            "Sending you a warm cup of happiness! 💖",
            "Life happens, coffee helps... but you make it worth it.",
            "You're the cream to my coffee 🥛",
            "Cappuccino kisses coming your way! 💋☕",
            "Stay grounded, stay amazing.",
            "Don't forget to take a sip of joy today!"
        ];

        const triggerRandomMessage = () => {
            const randomMsg = messages[Math.floor(Math.random() * messages.length)];

            toast(randomMsg, {
                icon: '💝',
                style: {
                    borderRadius: '20px',
                    background: '#FFF0F5', // Lavender Blush
                    color: '#D81B60', // Deep Pink
                    border: '1px solid #FFC1E3',
                    padding: '16px',
                    fontWeight: 'bold',
                },
                duration: 5000,
            });

            // Schedule next message (random time between 45s and 3 minutes)
            const nextTime = Math.random() * (180000 - 45000) + 45000;
            timeoutId = setTimeout(triggerRandomMessage, nextTime);
        };

        // Initial delay before first message
        let timeoutId = setTimeout(triggerRandomMessage, 10000);

        return () => clearTimeout(timeoutId);
    }, []);


    const profileItems = [
        { icon: User, label: 'Dashboard', path: '/customer/dashboard' },
        { icon: User, label: 'My Profile', path: '/customer/profile' },
        { icon: ClipboardList, label: 'My Orders', path: '/customer/orders' },
        { icon: MapPin, label: 'Saved Addresses', path: '/customer/addresses' },
        { icon: CreditCard, label: 'My Cards & Wallet', path: '/customer/payments' },
        { icon: Gift, label: 'Rewards/Points', path: '/customer/rewards' },
        { icon: ShieldCheck, label: 'Security Settings', path: '/customer/security' },
    ];

    const isActive = (path) => location.pathname === path;

    if (!localStorage.getItem('token')) return null;

    return (
        <div className="min-h-screen bg-orange-50/30 flex">
            {/* Sidebar for Desktop */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-orange-100 flex justify-between items-center">
                        <Link to="/" className="text-2xl font-bold font-[Outfit] text-[#4A2C2A]">
                            KRC! <span className="text-[#C97E45]">Coffee</span>
                        </Link>
                        <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
                            <X size={24} className="text-[#4A2C2A]" />
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto py-6 px-4 space-y-8">
                        {/* Main Menu */}
                        <div>
                            <p className="text-xs font-bold text-orange-900/40 uppercase tracking-widest mb-4 px-2">Main Menu</p>
                            <div className="space-y-1">
                                {menuItems.map((item) => (
                                    <div key={item.label}>
                                        <Link
                                            to={item.path}
                                            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isActive(item.path) ? 'bg-[#4A2C2A] text-white shadow-lg' : 'text-[#6D5E57] hover:bg-orange-100'}`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <item.icon size={20} />
                                                <span className="font-medium">{item.label}</span>
                                            </div>
                                            {item.count > 0 && (
                                                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.2rem] text-center">
                                                    {item.count}
                                                </span>
                                            )}
                                            {item.isNew && (
                                                <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                                                    NEW
                                                </span>
                                            )}
                                        </Link>
                                        {item.subItems && isActive(item.path) && (
                                            <div className="ml-10 mt-2 space-y-2">
                                                {item.subItems.map(sub => (
                                                    <Link
                                                        key={sub.label}
                                                        to={sub.path}
                                                        className="block text-sm text-orange-800/70 hover:text-[#C97E45] cursor-pointer transition-colors px-2 py-1"
                                                    >
                                                        {sub.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Profile Section */}
                        <div>
                            <p className="text-xs font-bold text-orange-900/40 uppercase tracking-widest mb-4 px-2">Profile & Settings</p>
                            <div className="space-y-1">
                                {profileItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        to={item.path}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive(item.path) ? 'bg-[#C97E45] text-white shadow-lg' : 'text-[#6D5E57] hover:bg-orange-100'}`}
                                    >
                                        <item.icon size={20} />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-orange-100">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium"
                        >
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 md:ml-72 flex flex-col">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-40">
                    <button onClick={() => setIsSidebarOpen(true)}>
                        <Menu size={24} className="text-[#4A2C2A]" />
                    </button>
                    <Link to="/" className="text-xl font-bold font-[Outfit] text-[#4A2C2A]">
                        KRC! <span className="text-[#C97E45]">Coffee</span>
                    </Link>
                    <div className="w-8 h-8 rounded-full bg-orange-200"></div>
                </header>

                {/* Desktop Header / Breadcrumbs */}
                <header className="hidden md:flex items-center justify-between px-8 py-6">
                    <div>
                        <h2 className="text-2xl font-bold text-[#4A2C2A] capitalize">
                            {location.pathname.split('/').pop() || 'Dashboard'}
                        </h2>
                        <p className="text-[#6D5E57] text-sm">Welcome back, Coffee Lover!</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/customer/notifications')}
                            className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow relative"
                        >
                            <Bell size={20} className="text-[#6D5E57]" />
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                            )}
                        </button>
                        <div className="flex items-center space-x-3 pl-4 border-l border-orange-200">
                            {(() => {
                                const rawUser = localStorage.getItem('user');
                                let name = 'Customer';
                                let initials = 'C';
                                let customerId = 'ID: #----';

                                if (rawUser) {
                                    try {
                                        const parsed = JSON.parse(rawUser);
                                        const user = parsed.data || parsed;
                                        name = user.name || 'Customer';
                                        initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                                        customerId = `ID: #${(user._id || user.id || '').slice(-4).toUpperCase()}`;
                                    } catch (e) { }
                                }

                                return (
                                    <>
                                        <div className="text-right">
                                            <p className="font-bold text-[#4A2C2A] text-sm">{name}</p>
                                            <p className="text-xs text-[#6D5E57]">{customerId}</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-[#C97E45] flex items-center justify-center text-white font-bold">
                                            {initials}
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </header>

                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default CustomerLayout;
