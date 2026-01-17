import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../../config';
import {
    ShoppingBag,
    Trophy,
    Wallet,
    MapPin,
    ShieldCheck,
    ArrowRight,
    Star,
    CupSoda,
    LayoutDashboard,
    Coffee,
    Package,
    Loader2
} from 'lucide-react';

const CustomerHome = () => {
    const [user, setUser] = useState(null);
    const [rewardPoints, setRewardPoints] = useState(0);
    const [loading, setLoading] = useState(true);
    const [activeOrder, setActiveOrder] = useState(null);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const token = localStorage.getItem('token') || (userInfo && userInfo.token);

                if (!token) {
                    setLoading(false);
                    return;
                }

                // 1. Fetch Profile
                const profileRes = await fetch(`${API_URL}/api/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const profileData = await profileRes.json();

                if (profileData.success) {
                    setUser(profileData.data);
                    setRewardPoints(profileData.data.rewardPoints || 0);

                    // 2. Fetch Orders to find active one
                    const ordersRes = await fetch(`${API_URL}/api/orders/myorders/${profileData.data._id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const ordersData = await ordersRes.json();
                    if (Array.isArray(ordersData)) {
                        // Find most recent active order (Processing, Shipped, etc.)
                        const active = ordersData
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .find(o => ['Processing', 'Shipped', 'Out for Delivery'].includes(o.status));
                        setActiveOrder(active);
                    }
                }

                // 3. Fetch Recommendations (Best Sellers)
                const productsRes = await fetch(`${API_URL}/api/products`);
                const productsData = await productsRes.json();
                if (productsData.success) {
                    const bestSellers = productsData.data
                        .filter(p => p.isBestSeller)
                        .slice(0, 2); // Take top 2
                    setRecommendations(bestSellers);
                }

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const features = [
        { title: 'Shop Now', icon: <CupSoda />, link: '/customer/shop/all', color: 'bg-orange-500', desc: 'Browse our latest coffee blends' },
        { title: 'Brew Your Own', icon: <Coffee />, link: '/customer/brew-your-own', color: 'bg-[#4A2C2A]', desc: 'Be your own barista' },
        { title: 'Rewards', icon: <Trophy />, link: '/customer/rewards', color: 'bg-yellow-500', desc: `${rewardPoints} Points available` },
        { title: 'Payments', icon: <Wallet />, link: '/customer/payments', color: 'bg-blue-500', desc: 'Manage your saved cards' },
        { title: 'Addresses', icon: <MapPin />, link: '/customer/addresses', color: 'bg-green-500', desc: 'Manage delivery locations' },
        { title: 'Security', icon: <ShieldCheck />, link: '/customer/security', color: 'bg-purple-500', desc: 'Update your password' },
        { title: 'Dashboard', icon: <LayoutDashboard />, link: '/customer/dashboard', color: 'bg-rose-500', desc: 'View your activity' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4A2C2A]"></div>
            </div>
        );
    }

    const nextRewardGoal = 500;
    const progressToReward = Math.min((rewardPoints / nextRewardGoal) * 100, 100);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Hero Section */}
            <div className="relative rounded-[3rem] overflow-hidden bg-[#4A2C2A] text-white p-12 min-h-[400px] flex items-center shadow-2xl shadow-orange-900/20">
                <div className="relative z-10 max-w-2xl">
                    <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-orange-200 text-xs font-bold uppercase tracking-widest mb-6 border border-white/5">
                        {rewardPoints > 1000 ? 'Platinum Member' : 'Gold Member'}
                    </span>
                    <h1 className="text-5xl font-bold font-[Outfit] leading-tight mb-4 text-white drop-shadow-md">
                        Hello, {user?.name?.split(' ')[0] || 'Coffee Lover'}!
                    </h1>
                    <p className="text-xl text-orange-100 mb-8 leading-relaxed font-medium drop-shadow-sm max-w-lg">
                        Ready for your daily dose of perfection? We've roasted a fresh batch of Arabica just for you.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link to="/customer/shop/all" className="bg-[#C97E45] hover:bg-[#b06d3a] px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-xl shadow-orange-950/40 transform hover:-translate-y-1">
                            Start Ordering <ArrowRight size={20} />
                        </Link>
                        <Link to="/customer/rewards" className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-8 py-4 rounded-2xl font-bold transition-all border border-white/10">
                            View Points
                        </Link>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
                    <img
                        src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop"
                        alt="Coffee"
                        className="w-full h-full object-cover rounded-l-full scale-125 translate-x-12 rotate-12"
                    />
                </div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#C97E45] rounded-full blur-[120px] opacity-20"></div>
            </div>

            {/* Active Order Banner (Conditional) */}
            {activeOrder && (
                <div className="bg-white border-l-4 border-blue-500 rounded-r-xl p-6 shadow-sm flex items-center justify-between animate-in slide-in-from-left duration-500">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-50 p-3 rounded-full text-blue-500">
                            <Package size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-[#4A2C2A]">Order #{activeOrder._id.slice(-6).toUpperCase()} is on its way!</h3>
                            <p className="text-sm text-slate-500">Status: <span className="font-semibold text-blue-600">{activeOrder.status}</span> • {activeOrder.orderItems.length} Items</p>
                        </div>
                    </div>
                    <Link to={`/customer/orders/${activeOrder._id}`} className="text-blue-600 font-bold text-sm hover:underline">
                        Track Order
                    </Link>
                </div>
            )}

            {/* Quick Access Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((item, index) => (
                    <Link
                        key={index}
                        to={item.link}
                        className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className={`${item.color} w-16 h-16 rounded-2xl text-white flex items-center justify-center text-3xl shadow-lg ring-4 ring-offset-2 ring-transparent group-hover:ring-offset-2 transition-all`}>
                                {item.icon}
                            </div>
                            <div className="flex text-yellow-400 gap-0.5">
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-[#4A2C2A] mb-2">{item.title}</h3>
                        <p className="text-slate-500 text-sm">{item.desc}</p>
                    </Link>
                ))}
            </div>

            {/* Rewards Banner */}
            <div className="bg-orange-50 rounded-[3rem] p-10 border border-orange-100 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
                <div className="flex items-center gap-8 relative z-10">
                    <div className="w-24 h-24 bg-[#4A2C2A] rounded-full flex items-center justify-center text-white text-4xl shadow-2xl relative shadow-orange-900/20 ring-4 ring-white">
                        <Trophy size={40} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-[#4A2C2A] mb-2">
                            {progressToReward >= 100 ? "You've earned a free coffee!" : "You're close to a free coffee!"}
                        </h2>
                        <div className="w-full max-w-xs bg-orange-200 h-2 rounded-full mt-2 mb-2 overflow-hidden">
                            <div className="bg-orange-500 h-full rounded-full transition-all duration-1000" style={{ width: `${progressToReward}%` }}></div>
                        </div>
                        <p className="text-[#6D5E57] max-w-md text-sm">
                            {progressToReward >= 100
                                ? "Redeem your reward at checkout!"
                                : `Earn ${nextRewardGoal - rewardPoints} more points to unlock a free Small Latte.`}
                        </p>
                    </div>
                </div>
                <div className="shrink-0 relative z-10">
                    <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm text-center min-w-[200px]">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current Balance</p>
                        <p className="text-4xl font-black text-[#4A2C2A]">{rewardPoints}</p>
                        <p className="text-[10px] text-orange-50 font-bold mt-2 uppercase tracking-tighter bg-orange-500 px-3 py-1 rounded-full inline-block">
                            {rewardPoints > 1000 ? 'Platinum Tier' : 'Gold Tier'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Recommendation Section */}
            {recommendations.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-8 px-4">
                        <h2 className="text-3xl font-bold text-[#4A2C2A]">For You</h2>
                        <Link to="/customer/shop/best-sellers" className="text-orange-500 font-bold flex items-center gap-1 hover:gap-2 transition-all">
                            View All <ArrowRight size={18} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {recommendations.map((product) => (
                            <div key={product._id} className="relative h-[300px] rounded-[3rem] overflow-hidden group shadow-lg cursor-pointer">
                                <img
                                    src={product.image}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    alt={product.name}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810] via-black/20 to-transparent p-8 flex flex-col justify-end">
                                    <span className="text-white/60 text-xs font-bold uppercase mb-2">{product.category}</span>
                                    <h3 className="text-2xl font-bold text-white mb-4">{product.name}</h3>
                                    <div className="flex items-center gap-4">
                                        <Link to={`/customer/product/${product._id}`} className="bg-white text-[#4A2C2A] px-6 py-2 rounded-full font-bold text-sm hover:bg-orange-500 hover:text-white transition-all">
                                            Try Now - ₹{product.price}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerHome;
