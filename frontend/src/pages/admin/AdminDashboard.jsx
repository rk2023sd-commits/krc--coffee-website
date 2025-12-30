import React, { useState, useEffect } from 'react';
import {
    TrendingUp, Users, ShoppingCart, DollarSign,
    ArrowUpRight, ArrowDownRight, Package,
    Activity, Calendar, Loader2
} from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        products: 0,
        users: 0,
        orders: 0,
        revenue: 0
    });
    const [loading, setLoading] = useState(true);
    const [recentOrders, setRecentOrders] = useState([]);
    const [chartData, setChartData] = useState([]);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            // Fetch Products
            const pRes = await fetch('http://localhost:5000/api/products');
            const pData = await pRes.json();

            // Fetch Orders
            const oRes = await fetch('http://localhost:5000/api/orders');
            const oData = await oRes.json();

            // Fetch Detailed Revenue for Chart
            const rRes = await fetch('http://localhost:5000/api/reports/revenue', { headers });
            const rData = await rRes.json();

            // Calculate Revenue & Counts
            const revenue = Array.isArray(oData) ? oData.reduce((acc, order) => acc + order.totalPrice, 0) : 0;
            const ordersCount = Array.isArray(oData) ? oData.length : 0;

            setStats({
                products: pData.count || 0,
                users: 1, // Mocked until user count API
                orders: ordersCount,
                revenue: revenue
            });

            if (Array.isArray(oData)) {
                setRecentOrders(oData.slice(0, 4));
            }

            // Process Chart Data (Last 12 Months)
            if (rData.success && rData.revenueByMonth) {
                const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                const currentMonth = new Date().getMonth();
                const processedData = [];
                let maxVal = 0;

                // Create array for last 12 months roughly or just map current year
                // Simplified: Map specific months if available, else 0
                // For a robust chart, we ideally iterate back 12 months.
                for (let i = 0; i < 12; i++) {
                    // Just a placeholder logic to map "Month Year" keys to simple bars
                    // In a real app we'd construct proper keys.
                    // Here we will just take the values we have and fill the rest with 0 or randomized variations for "demo" feel if empty,
                    // but let's try to be real:
                    const key = `${months[i]} ${new Date().getFullYear()}`;
                    const val = rData.revenueByMonth[key] || 0;
                    if (val > maxVal) maxVal = val;
                    processedData.push({ month: months[i].substring(0, 3), value: val });
                }

                // Normalize for height percentages
                const normalizedData = processedData.map(d => ({
                    ...d,
                    height: maxVal > 0 ? (d.value / maxVal) * 100 : 0
                }));
                setChartData(normalizedData);
            }

        } catch (err) {
            console.error('Dashboard fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const adminStats = [
        { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, change: '+100%', isPositive: true, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { label: 'Total Orders', value: stats.orders.toString(), change: `+${stats.orders}`, isPositive: true, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Active Users', value: stats.users.toString(), change: '+1', isPositive: true, icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' },
        { label: 'Products', value: stats.products.toString(), change: `+${stats.products}`, isPositive: true, icon: Package, color: 'text-purple-600', bg: 'bg-purple-100' },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="animate-spin text-[#C97E45] mb-4" size={48} />
                <p className="text-slate-500 font-medium font-[Outfit]">Loading Dashboard Analytics...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#2C1810] font-[Outfit]">Dashboard Overview</h1>
                    <p className="text-slate-500">Real-time statistics for KRC! Coffee platform.</p>
                </div>
                <div className="flex items-center space-x-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
                    <Calendar size={18} className="text-slate-400 ml-2" />
                    <select className="bg-transparent border-none text-sm font-medium text-slate-700 focus:ring-0 cursor-pointer pr-8 outline-none">
                        <option>This Year ({new Date().getFullYear()})</option>
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {adminStats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                                <stat.icon size={24} />
                            </div>
                            <div className={`flex items-center space-x-1 text-xs font-bold ${stat.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                <span>{stat.change}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <h3 className="text-xl font-bold text-slate-800">Revenue Performance</h3>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm text-slate-500">Total Year Revenue</p>
                                <p className="text-xl font-bold text-[#C97E45]">₹{stats.revenue.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-2 px-2 border-b border-dashed border-slate-200 pb-2 relative">
                        {/* Y-axis lines could go here */}
                        {chartData.length > 0 ? chartData.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-default">
                                <div className="relative w-full h-[200px] flex items-end">
                                    <div
                                        className="w-full bg-[#C97E45] rounded-t-lg transition-all duration-1000 group-hover:bg-[#4A2C2A] group-hover:shadow-lg"
                                        style={{ height: `${d.height || 2}%`, minHeight: '4px' }}
                                    ></div>
                                    {/* Tooltip */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        ₹{d.value.toLocaleString()}
                                    </div>
                                </div>
                                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{d.month}</span>
                            </div>
                        )) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                No chart data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 font-[Outfit]">Live Activity</h3>
                    <div className="space-y-6">
                        {recentOrders.length > 0 ? (
                            recentOrders.map((order, i) => (
                                <div
                                    key={order._id}
                                    className="flex gap-4 relative group cursor-pointer"
                                    onClick={() => window.location.href = `/admin/orders/${order._id}`}
                                >
                                    <div className="absolute left-1.5 top-6 bottom-[-24px] w-0.5 bg-slate-100 group-last:hidden"></div>
                                    <div className={`w-3 h-3 rounded-full bg-emerald-500 mt-2 z-10 ring-4 ring-white group-hover:scale-125 transition-transform`}></div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-800 group-hover:text-[#C97E45] transition-colors">
                                            New order of <span className="font-bold">₹{order.totalPrice}</span> placed
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1 flex items-center">
                                            <Activity size={10} className="mr-1" /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-slate-400 text-sm italic">
                                No recent activity
                            </div>
                        )}

                        {/* Filler if needed */}
                        {recentOrders.length === 0 && (
                            <div className="flex gap-4 relative">
                                <div className={`w-3 h-3 rounded-full bg-blue-500 mt-2 z-10 ring-4 ring-white`}></div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800">System initialized</p>
                                    <p className="text-xs text-slate-400 mt-1">Ready for business</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => window.location.href = '/admin/orders/all'}
                        className="w-full mt-8 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                    >
                        View All Orders
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
