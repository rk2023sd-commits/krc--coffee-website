import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    Coffee
} from 'lucide-react';

const CustomerHome = () => {
    const [user, setUser] = useState(null);
    const [rewardPoints, setRewardPoints] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const token = localStorage.getItem('token') || (userInfo && userInfo.token);
                if (!token) {
                    setLoading(false);
                    return;
                }

                const response = await fetch('http://localhost:5000/api/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();

                if (data.success) {
                    setUser(data.data);
                    setRewardPoints(data.data.rewardPoints || 0);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const features = [
        { title: 'Shop Now', icon: <CupSoda />, link: '/customer/shop', color: 'bg-orange-500', desc: 'Browse our latest coffee blends' },
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

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Hero Section */}
            <div className="relative rounded-[3rem] overflow-hidden bg-[#4A2C2A] text-white p-12 min-h-[400px] flex items-center">
                <div className="relative z-10 max-w-2xl">
                    <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-orange-200 text-xs font-bold uppercase tracking-widest mb-6">Premium Member</span>
                    <h1 className="text-5xl font-bold font-[Outfit] leading-tight mb-4 text-white drop-shadow-md">
                        Hello, {user?.name?.split(' ')[0] || 'Coffee Lover'}!
                    </h1>
                    <p className="text-xl text-orange-100 mb-8 leading-relaxed font-medium drop-shadow-sm">
                        Ready for your daily dose of perfection? We've roasted a fresh batch of Arabica just for you.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link to="/customer/shop/all" className="bg-[#C97E45] hover:bg-[#b06d3a] px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-xl shadow-orange-950/40">
                            Start Ordering <ArrowRight size={20} />
                        </Link>
                        <Link to="/customer/rewards" className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-8 py-4 rounded-2xl font-bold transition-all">
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
            <div className="bg-orange-50 rounded-[3rem] p-10 border border-orange-100 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-8">
                    <div className="w-24 h-24 bg-[#4A2C2A] rounded-full flex items-center justify-center text-white text-4xl shadow-2xl relative shadow-orange-900/20">
                        <Trophy size={40} />
                        <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full border-2 border-white">+50</div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-[#4A2C2A] mb-2">You're close to a free coffee!</h2>
                        <p className="text-[#6D5E57] max-w-md">Earn 150 more points to unlock a free Small Latte. Every purchase counts towards your goal.</p>
                    </div>
                </div>
                <div className="shrink-0">
                    <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm text-center min-w-[200px]">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current Balance</p>
                        <p className="text-4xl font-black text-[#4A2C2A]">{rewardPoints}</p>
                        <p className="text-[10px] text-orange-50 font-bold mt-2 uppercase tracking-tighter bg-orange-500 px-3 py-1 rounded-full inline-block">Gold Tier Member</p>
                    </div>
                </div>
            </div>

            {/* Recommendation Section */}
            <div>
                <div className="flex items-center justify-between mb-8 px-4">
                    <h2 className="text-3xl font-bold text-[#4A2C2A]">Roaster's Choice</h2>
                    <Link to="/customer/shop/best-sellers" className="text-orange-500 font-bold flex items-center gap-1 hover:gap-2 transition-all">
                        Discover More <ArrowRight size={18} />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative h-[300px] rounded-[3rem] overflow-hidden group shadow-lg">
                        <img
                            src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800&auto=format&fit=crop"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            alt="Recommended"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810] via-black/20 to-transparent p-8 flex flex-col justify-end">
                            <span className="text-white/60 text-xs font-bold uppercase mb-2">New Season</span>
                            <h3 className="text-2xl font-bold text-white mb-4">Ethiopian Yirgacheffe</h3>
                            <Link to="/customer/shop/all" className="bg-white text-[#4A2C2A] w-max px-6 py-2 rounded-full font-bold text-sm hover:bg-orange-500 hover:text-white transition-all">
                                Try Now - ₹850
                            </Link>
                        </div>
                    </div>
                    <div className="relative h-[300px] rounded-[3rem] overflow-hidden group shadow-lg">
                        <img
                            src="https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?q=80&w=800&auto=format&fit=crop"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            alt="Recommended"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810] via-black/20 to-transparent p-8 flex flex-col justify-end">
                            <span className="text-white/60 text-xs font-bold uppercase mb-2">Best Seller</span>
                            <h3 className="text-2xl font-bold text-white mb-4">Classic French Press Kit</h3>
                            <Link to="/customer/shop/all" className="bg-white text-[#4A2C2A] w-max px-6 py-2 rounded-full font-bold text-sm hover:bg-orange-500 hover:text-white transition-all">
                                Shop Bundle
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerHome;
