import React, { useState, useEffect } from 'react';
import { PieChart, CreditCard, RefreshCw } from 'lucide-react';

const RevenueAnalysis = () => {
    const [stats, setStats] = useState({ totalRevenue: 0, revenueByMonth: {} });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRevenue();
    }, []);

    const fetchRevenue = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/reports/revenue', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (data.success) {
                setStats(data);
            }
        } catch (err) {
            console.error('Failed to fetch revenue report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#2C1810] font-[Outfit]">Revenue Analysis</h1>
                    <p className="text-[#6D5E57]">Track your revenue growth over time.</p>
                </div>
                <button onClick={fetchRevenue} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <RefreshCw size={20} className="text-slate-600" />
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20">Loading...</div>
            ) : (
                <div className="space-y-8">
                    <div className="bg-[#2C1810] p-10 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-orange-200/80 font-medium mb-2">Total Estimated Revenue (Confirmed Orders)</h2>
                            <p className="text-5xl font-bold font-[Outfit]">₹{stats.totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
                            <PieChart size={200} />
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="font-bold text-lg text-[#2C1810]">Monthly Performance</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#FFF8E7] text-[#4A2C2A] font-bold text-sm uppercase tracking-wider">
                                    <tr>
                                        <th className="p-6">Month</th>
                                        <th className="p-6">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {Object.entries(stats.revenueByMonth).map(([month, amount]) => (
                                        <tr key={month} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-6 text-slate-600 font-medium">{month}</td>
                                            <td className="p-6 text-green-600 font-bold">₹{amount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    {Object.keys(stats.revenueByMonth).length === 0 && (
                                        <tr><td colSpan="2" className="p-8 text-center text-slate-500">No revenue data available</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RevenueAnalysis;
