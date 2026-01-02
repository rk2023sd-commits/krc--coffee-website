import React, { useState, useEffect } from 'react';
import API_URL from '../../config';
import {
    Search, Filter, ExternalLink, Trash2, CheckCircle,
    Truck, Clock, Loader2, Package, MoreVertical, Check
} from 'lucide-react';

const AllOrdersAdmin = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const fetchAllOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/orders`);
            const data = await response.json();
            if (response.ok) {
                setOrders(data);
            }
        } catch (err) {
            console.error('Fetch all orders error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            // If delivering, use the specific deliver endpoint
            const url = status === 'Delivered'
                ? `${API_URL}/api/orders/${id}/deliver`
                : `${API_URL}/api/orders/${id}`; // Future endpoint for other status updates

            const response = await fetch(url, {
                method: status === 'Delivered' ? 'PUT' : 'PATCH',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                fetchAllOrders(); // Refresh list
            }
        } catch (err) {
            console.error('Update status error:', err);
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.shippingAddress.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Processing': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="animate-spin text-[#C97E45] mb-4" size={48} />
                <p className="text-slate-500 font-medium">Loading platform orders...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-bold text-[#2C1810] font-[Outfit]">Order Management</h1>
                <p className="text-slate-500">View and update all customer orders from here.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
                <div className="relative flex-grow max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Address..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <Filter size={18} className="text-slate-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white border border-slate-200 py-3 px-4 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#C97E45]/20 outline-none cursor-pointer"
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Order Info</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Customer/Address</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Items</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-orange-100 text-[#C97E45] rounded-xl">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">#{order._id.slice(-6).toUpperCase()}</p>
                                                <p className="text-[10px] text-slate-400 font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-bold text-slate-800">{order.shippingAddress.address}</p>
                                        <p className="text-xs text-slate-500">{order.shippingAddress.city} • {order.shippingAddress.phone}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-bold text-slate-800">{order.orderItems.length} Items</p>
                                        <p className="text-xs text-slate-400 truncate max-w-[150px]">
                                            {order.orderItems.map(item => item.name).join(', ')}
                                        </p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-lg font-bold text-[#2C1810]">₹{order.totalPrice}</p>
                                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">{order.paymentMethod}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {order.status !== 'Delivered' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(order._id, 'Delivered')}
                                                    className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                    title="Mark as Delivered"
                                                >
                                                    <Check size={18} />
                                                </button>
                                            )}
                                            <button className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-[#2C1810] hover:text-white transition-all shadow-sm">
                                                <ExternalLink size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-8 py-12 text-center text-slate-400 font-medium italic">
                                        No orders found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllOrdersAdmin;
