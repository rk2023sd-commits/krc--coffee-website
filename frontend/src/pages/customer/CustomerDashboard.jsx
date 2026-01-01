import React, { useEffect, useState } from 'react';
import { ShoppingBag, Star, Clock, ArrowRight, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import AiBarista from '../../components/AiBarista';

const CustomerDashboard = () => {
    const { addToCart } = useCart();
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState([
        { label: 'Active Orders', value: '0', icon: ShoppingBag, color: 'bg-blue-500' },
        { label: 'Reward Points', value: '0', icon: Star, color: 'bg-yellow-500' },
        { label: 'Total Spent', value: '₹0', icon: Clock, color: 'bg-green-500' },
    ]);
    const [loading, setLoading] = useState(true);

    // Mock items for wishlist
    const wishlistItems = [
        { _id: 'mock1', name: 'Roasted Arabica', category: 'Beans', price: 650, image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=200&auto=format&fit=crop' },
        { _id: 'mock2', name: 'Caramel Macchiato', category: 'Coffee', price: 250, image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=200&auto=format&fit=crop' }
    ];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const rawUser = localStorage.getItem('user');
                let userId = 'guest';

                if (rawUser) {
                    const parsed = JSON.parse(rawUser);
                    const user = parsed.data || parsed;
                    userId = user._id || user.id || 'guest';
                }

                const res = await fetch(`http://localhost:5000/api/orders/myorders/${userId}`);
                const data = await res.json();

                if (Array.isArray(data)) {
                    // Sort descending by date
                    const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setOrders(sorted);

                    // Calculations
                    const activeCount = sorted.filter(o => o.status === 'Processing' || o.status === 'Shipped').length;
                    const totalSpent = sorted.reduce((acc, curr) => acc + (curr.isPaid || curr.paymentMethod === 'COD' ? curr.totalPrice : 0), 0);
                    const points = Math.floor(totalSpent * 0.1); // 10% points logic

                    setStats([
                        { label: 'Active Orders', value: activeCount.toString(), icon: ShoppingBag, color: 'bg-blue-500' },
                        { label: 'Reward Points', value: points.toString(), icon: Star, color: 'bg-yellow-500' },
                        { label: 'Total Spent', value: `₹${totalSpent.toLocaleString()}`, icon: Clock, color: 'bg-green-500' },
                    ]);
                }
            } catch (err) {
                console.error("Dashboard fetch error", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
        window.addEventListener('countRefresh', fetchDashboardData);
        return () => window.removeEventListener('countRefresh', fetchDashboardData);
    }, []);

    const recentOrders = orders.slice(0, 3);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#4A2C2A] to-[#2C1810] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 max-w-xl">
                    <h1 className="text-3xl font-bold font-[Outfit] mb-2 text-white drop-shadow-md">
                        Hello, {(() => {
                            try {
                                const raw = localStorage.getItem('user');
                                if (raw) {
                                    const parsed = JSON.parse(raw);
                                    const u = parsed.data || parsed;
                                    return u.name ? u.name.split(' ')[0] : 'Coffee Lover';
                                }
                            } catch (e) { }
                            return 'Coffee Lover';
                        })()}! ☕
                    </h1>
                    <p className="text-orange-50 mb-6 font-medium drop-shadow-sm">
                        Your favorite Morning Roast is back in stock. Ready for another cup of perfection?
                    </p>
                    <Link to="/customer/shop/all" className="bg-[#C97E45] hover:bg-[#b06d3a] text-white px-6 py-3 rounded-xl font-bold transition-all inline-flex items-center shadow-lg border border-white/20">
                        Order Again <ArrowRight size={18} className="ml-2" />
                    </Link>
                </div>
                {/* Abstract shapes */}
                <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-20px] left-[30%] w-32 h-32 bg-orange-500/10 rounded-full blur-2xl"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex items-center space-x-4">
                        <div className={`${stat.color} p-3 rounded-xl text-white`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-[#6D5E57] mb-1">{stat.label}</p>
                            <p className="text-2xl font-bold text-[#4A2C2A]">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-orange-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-[#4A2C2A]">Recent Orders</h3>
                        <Link to="/customer/orders" className="text-[#C97E45] text-sm font-bold hover:underline">View All</Link>
                    </div>
                    {recentOrders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-xs text-orange-900/40 uppercase tracking-widest border-b border-orange-50">
                                        <th className="pb-4">Order ID</th>
                                        <th className="pb-4">Date</th>
                                        <th className="pb-4">Items</th>
                                        <th className="pb-4">Amount</th>
                                        <th className="pb-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-orange-50">
                                    {recentOrders.map((order) => (
                                        <tr key={order._id} className="group hover:bg-orange-50/30 transition-colors">
                                            <td className="py-4 font-bold text-sm text-[#4A2C2A]">#{order._id.slice(-6).toUpperCase()}</td>
                                            <td className="py-4 text-sm text-[#6D5E57]">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="py-4 text-sm text-[#6D5E57] max-w-[150px] truncate" title={order.orderItems.map(i => i.name).join(', ')}>
                                                {order.orderItems[0].name} {order.orderItems.length > 1 && `+${order.orderItems.length - 1}`}
                                            </td>
                                            <td className="py-4 font-bold text-sm text-[#4A2C2A]">₹{order.totalPrice}</td>
                                            <td className="py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-slate-400">
                            No orders found.
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* AI Barista Widget */}
                    <AiBarista />

                    {/* Favorite Items / Recommendations */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-orange-100">
                        <h3 className="text-xl font-bold text-[#4A2C2A] mb-6">Wishlist Favorites</h3>
                        <div className="space-y-6">
                            {wishlistItems.map((item) => (
                                <div key={item._id} className="flex items-center space-x-4 group cursor-pointer">
                                    <div className="w-16 h-16 rounded-xl bg-orange-50 overflow-hidden">
                                        <img src={item.image || null} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-[#4A2C2A] text-sm group-hover:text-[#C97E45] transition-colors">{item.name}</h4>
                                        <p className="text-xs text-[#6D5E57]">{item.category}</p>
                                        <p className="text-sm font-bold text-[#C97E45] mt-1">₹{item.price}.00</p>
                                    </div>
                                    <button
                                        onClick={() => addToCart(item)}
                                        className="text-[#C97E45] hover:bg-orange-50 p-2 rounded-lg transition-colors border border-transparent hover:border-orange-100"
                                    >
                                        <ShoppingBag size={18} />
                                    </button>
                                </div>
                            ))}
                            <button className="w-full py-3 border-2 border-dashed border-orange-200 rounded-xl text-orange-400 font-medium hover:bg-orange-50 transition-all">
                                + Discover More
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
