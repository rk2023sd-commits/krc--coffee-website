import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    BarChart3, Box, ShoppingCart, Users, Tag,
    Settings, LogOut, Menu, X, ChevronDown,
    ChevronRight, Search, Bell, PieChart,
    Layers, Package, AlertCircle, FileText,
    CreditCard, Truck, BellRing, Terminal
} from 'lucide-react';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Protection Logic
    React.useEffect(() => {
        const token = localStorage.getItem('token');
        const rawUser = localStorage.getItem('user');
        let user = null;
        try {
            user = rawUser ? JSON.parse(rawUser) : null;
            if (user && user.data) user = user.data;
        } catch (e) { }

        if (!token || !user || user.role !== 'admin') {
            navigate('/login', { replace: true });
        }
    }, [navigate]);



    const handleLogout = () => {
        // Direct logout without confirmation to prevent blocking issues
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const [pendingCount, setPendingCount] = useState(0);

    React.useEffect(() => {
        const fetchPending = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch('http://localhost:5000/api/orders?status=Pending', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (Array.isArray(data)) {
                    setPendingCount(data.filter(o => o.status === 'Pending').length);
                }
            } catch (e) { }
        };
        fetchPending();
        const interval = setInterval(fetchPending, 30000);
        return () => clearInterval(interval);
    }, []);

    const menuItems = [
        { icon: BarChart3, label: 'Dashboard', path: '/admin' },
        {
            icon: Box,
            label: 'Products',
            path: '/admin/products',
            subItems: [
                { label: 'All Products', path: '/admin/products/all' },
                { label: 'Add Product', path: '/admin/products/add' },
                { label: 'Categories', path: '/admin/products/categories' },
                { label: 'Inventory', path: '/admin/products/inventory' },
            ]
        },
        {
            icon: ShoppingCart,
            label: 'Orders',
            path: '/admin/orders',
            count: pendingCount,
            subItems: [
                { label: 'All Orders', path: '/admin/orders/all' },
                { label: 'Pending Orders', path: '/admin/orders/pending', count: pendingCount },
                { label: 'Delivered Orders', path: '/admin/orders/delivered' },
                { label: 'Cancel/Refund', path: '/admin/orders/cancel' },
            ]
        },
        {
            icon: Users,
            label: 'Users',
            path: '/admin/users',
            subItems: [
                { label: 'Customer', path: '/admin/users/customer' },
                { label: 'Admin/Staff', path: '/admin/users/staff' },
                { label: 'Roles & Permissions', path: '/admin/users/roles' },
            ]
        },
        { icon: Tag, label: 'Offers', path: '/admin/offers' },
        {
            icon: PieChart,
            label: 'Reports',
            path: '/admin/reports',
            subItems: [
                { label: 'Sales Report', path: '/admin/reports/sales' },
                { label: 'Revenue', path: '/admin/reports/revenue' },
                { label: 'Product Performance', path: '/admin/reports/performance' },
            ]
        },
        {
            icon: Settings,
            label: 'Settings',
            path: '/admin/settings',
            subItems: [
                { label: 'CMS Pages', path: '/admin/settings/cms' },
                { label: 'Payment Settings', path: '/admin/settings/payments' },
                { label: 'Tax & Delivery', path: '/admin/settings/tax' },
                { label: 'Notifications', path: '/admin/settings/notifications' },
                { label: 'System Logs', path: '/admin/settings/logs' },
            ]
        },
    ];

    const [notifications, setNotifications] = useState([]);
    const [lastReadTime, setLastReadTime] = useState(localStorage.getItem('notification_last_read') ? new Date(localStorage.getItem('notification_last_read')) : new Date(0));
    const notificationRef = React.useRef(null);

    React.useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/orders');
                const data = await res.json();
                if (Array.isArray(data)) {
                    // Sort by newest first just in case
                    const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setNotifications(sorted.slice(0, 5));
                }
            } catch (err) {
                console.error("Failed to fetch notifications");
            }
        };
        fetchNotifications();

        // Click outside listener
        function handleClickOutside(event) {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                // Only close if it's currently the notifications menu that is open
                setOpenSubmenu(prev => prev === 'notifications' ? null : prev);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const unreadCount = notifications.filter(n => new Date(n.createdAt) > lastReadTime).length;

    const handleMarkAllRead = () => {
        const now = new Date();
        setLastReadTime(now);
        localStorage.setItem('notification_last_read', now.toISOString());
    };

    const toggleSubmenu = (label) => {
        setOpenSubmenu(openSubmenu === label ? null : label);
    };

    const isActive = (path) => location.pathname === path;

    // Guard: Do not render layout if not authorized
    // Use the values read in useEffect or re-read here
    const authToken = localStorage.getItem('token');
    let authUser = null;
    try {
        const r = localStorage.getItem('user');
        authUser = r ? JSON.parse(r) : null;
        if (authUser && authUser.data) authUser = authUser.data;
    } catch (e) { }

    if (!authToken || !authUser || authUser.role !== 'admin') return null;

    return (
        <div className="min-h-screen bg-slate-50 flex font-[Inter]">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#2C1810] text-gray-300 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-brown-800 flex justify-between items-center">
                        <Link to="/" className="text-2xl font-bold font-[Outfit] text-white">
                            KRC! <span className="text-[#C97E45]">Admin</span>
                        </Link>
                        <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
                            <X size={24} className="text-white" />
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto py-6 px-4">
                        <div className="space-y-2">
                            {menuItems.map((item) => (
                                <div key={item.label}>
                                    {item.subItems ? (
                                        <div>
                                            <button
                                                onClick={() => toggleSubmenu(item.label)}
                                                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors hover:bg-white/10 ${location.pathname.startsWith(item.path) ? 'text-white' : ''}`}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <item.icon size={20} className={location.pathname.startsWith(item.path) ? 'text-[#C97E45]' : ''} />
                                                    <span className="font-medium">{item.label}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    {item.count > 0 && (
                                                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full mr-2">
                                                            {item.count}
                                                        </span>
                                                    )}
                                                    {openSubmenu === item.label ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                                </div>
                                            </button>
                                            <div className={`overflow-hidden transition-all duration-300 ${openSubmenu === item.label ? 'max-h-96 mt-1' : 'max-h-0'}`}>
                                                {item.subItems.map(sub => (
                                                    <Link
                                                        key={sub.label}
                                                        to={sub.path}
                                                        className={`flex items-center justify-between pl-12 pr-4 py-2 rounded-lg text-sm transition-colors ${isActive(sub.path) ? 'text-white bg-[#C97E45]' : 'hover:text-white hover:bg-white/5'}`}
                                                    >
                                                        <span>{sub.label}</span>
                                                        {sub.count > 0 && (
                                                            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                                                {sub.count}
                                                            </span>
                                                        )}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            to={item.path}
                                            className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isActive(item.path) ? 'bg-[#C97E45] text-white' : 'hover:bg-white/10'}`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <item.icon size={20} />
                                                <span className="font-medium">{item.label}</span>
                                            </div>
                                            {item.count > 0 && (
                                                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                                    {item.count}
                                                </span>
                                            )}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 border-t border-white/10">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors font-medium"
                        >
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 md:ml-72 flex flex-col">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="flex items-center space-x-4">
                        <button className="md:hidden p-2 hover:bg-slate-100 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
                            <Menu size={24} className="text-[#2C1810]" />
                        </button>
                        <div className="relative hidden lg:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search products or orders..."
                                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full w-80 text-sm focus:ring-2 focus:ring-[#C97E45]/20 focus:bg-white transition-all outline-none"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const query = e.target.value.trim();
                                        if (query) {
                                            // Simple detection: if 24 chars, might be an ID
                                            if (query.length === 24 && /^[0-9a-fA-F]{24}$/.test(query)) {
                                                navigate(`/admin/orders/${query}`);
                                            } else {
                                                // Otherwise search products
                                                navigate(`/admin/products/all?search=${encodeURIComponent(query)}`);
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="relative" ref={notificationRef}>
                            <button
                                className="relative p-2 hover:bg-slate-100 rounded-full transition-colors"
                                onClick={() => setOpenSubmenu(openSubmenu === 'notifications' ? null : 'notifications')}
                            >
                                <Bell size={20} className="text-slate-600" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                                )}
                            </button>

                            {/* Notification Dropdown */}
                            {openSubmenu === 'notifications' && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center">
                                        <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <span onClick={handleMarkAllRead} className="text-xs text-[#C97E45] font-medium cursor-pointer hover:underline">Mark all read</span>
                                        )}
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map((notif, i) => (
                                                <div
                                                    key={notif._id}
                                                    className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0"
                                                    onClick={() => {
                                                        navigate(`/admin/orders/${notif._id}`);
                                                        setOpenSubmenu(null);
                                                    }}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-2 h-2 mt-1.5 rounded-full bg-[#C97E45] flex-shrink-0"></div>
                                                        <div>
                                                            <p className="text-sm text-slate-800 font-medium">New Order Received</p>
                                                            <p className="text-xs text-slate-500 mt-0.5">Order #{notif._id.slice(-6).toUpperCase()} - ₹{notif.totalPrice}</p>
                                                            <p className="text-[10px] text-slate-400 mt-1">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-8 text-center text-slate-400 text-sm">No new notifications</div>
                                        )}
                                    </div>
                                    <div className="px-4 py-2 border-t border-slate-50 text-center">
                                        <Link to="/admin/orders/all" className="text-xs font-bold text-slate-500 hover:text-[#C97E45]">View All Orders</Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-3 pl-6 border-l border-slate-200">
                            <div className="text-right">
                                <p className="font-bold text-slate-800 text-sm">Super Admin</p>
                                <p className="text-xs text-slate-500">System Manager</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#2C1810] flex items-center justify-center text-white border-2 border-orange-100 shadow-sm">
                                SA
                            </div>
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

export default AdminLayout;
