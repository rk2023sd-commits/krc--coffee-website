import React, { useState, useEffect } from 'react';
import { Trophy, ShoppingBag, UserPlus, Lock } from 'lucide-react';

const Rewards = () => {
    const [rewardPoints, setRewardPoints] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRewards();
    }, []);

    const fetchRewards = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const token = localStorage.getItem('token') || (userInfo && userInfo.token);

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await fetch(`${API_URL}/api/users/rewards`, config);
            const data = await response.json();
            if (data.success) {
                setRewardPoints(data.rewardPoints);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching rewards:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4A2C2A]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="bg-[#4A2C2A] rounded-3xl p-8 text-white mb-8 relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                        <Trophy className="text-yellow-400" /> My Rewards
                    </h1>
                    <p className="text-white/80 mb-6">Earn points on every purchase and redeem them for future orders.</p>
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
                            <span className="text-sm font-medium text-white/70 block mb-1">Total Points</span>
                            <span className="text-4xl font-bold">{rewardPoints}</span>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-[#D2B48C]/20 rounded-full blur-2xl"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-[#4A2C2A] mb-4">How to Earn?</h2>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                                <ShoppingBag size={16} />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800 text-sm">Shop Coffee</p>
                                <p className="text-slate-500 text-xs text-pretty">Earn 10 points for every ₹100 you spend on our store.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                <UserPlus size={16} />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800 text-sm">Register</p>
                                <p className="text-slate-500 text-xs text-pretty">Get 50 bonus points when you register for the first time.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-[#4A2C2A] mb-4">Redeem Points</h2>
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-4">
                        <p className="text-slate-600 text-sm mb-2 italic">Coming Soon!</p>
                        <p className="text-slate-500 text-xs leading-relaxed">
                            We are working on a system that allows you to pay for your coffee using your earned points.
                            Stay tuned for updates!
                        </p>
                    </div>
                    <div className="p-4 border border-dashed border-slate-200 rounded-2xl flex items-center justify-between opacity-50">
                        <div>
                            <p className="font-semibold text-slate-800 text-sm">₹50 Discount</p>
                            <p className="text-slate-500 text-xs">500 Points</p>
                        </div>
                        <button disabled className="px-4 py-1.5 bg-slate-200 text-slate-500 rounded-full text-xs font-medium flex items-center gap-1">
                            <Lock size={12} /> Locked
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rewards;
