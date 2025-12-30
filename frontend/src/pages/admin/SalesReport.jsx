import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, RefreshCw } from 'lucide-react';

const SalesReport = () => {
    const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, salesByDate: {} });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/reports/sales', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (data.success) {
                setStats(data);
            }
        } catch (err) {
            console.error('Failed to fetch sales report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#2C1810] font-[Outfit]">Sales Report</h1>
                    <p className="text-[#6D5E57]">Detailed analysis of your delivered orders.</p>
                </div>
                <button onClick={fetchSales} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <RefreshCw size={20} className="text-slate-600" />
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20">Loading...</div>
            ) : (
                <div className="space-y-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-6">
                                <DollarSign size={32} />
                            </div>
                            <div>
                                <h3 className="text-slate-500 font-medium">Total Sales (Delivered)</h3>
                                <p className="text-3xl font-bold text-[#2C1810]">₹{stats.totalSales.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center">
                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-6">
                                <TrendingUp size={32} />
                            </div>
                            <div>
                                <h3 className="text-slate-500 font-medium">Total Orders</h3>
                                <p className="text-3xl font-bold text-[#2C1810]">{stats.totalOrders}</p>
                            </div>
                        </div>
                    </div>

                    {/* Sales Table */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="font-bold text-lg text-[#2C1810]">Daily Breakdown</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#FFF8E7] text-[#4A2C2A] font-bold text-sm uppercase tracking-wider">
                                    <tr>
                                        <th className="p-6">Date</th>
                                        <th className="p-6">Sales Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {Object.entries(stats.salesByDate).map(([date, amount]) => (
                                        <tr key={date} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-6 text-slate-600 font-medium">{date}</td>
                                            <td className="p-6 text-[#2C1810] font-bold">₹{amount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    {Object.keys(stats.salesByDate).length === 0 && (
                                        <tr><td colSpan="2" className="p-8 text-center text-slate-500">No sales data available</td></tr>
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

export default SalesReport;
