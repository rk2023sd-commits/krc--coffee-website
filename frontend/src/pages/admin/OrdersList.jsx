import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, Truck, CheckCircle, XCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const OrdersList = ({ statusFilter }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/orders');
            const data = await res.json();

            // Sort by date desc
            const sortedData = Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
            setOrders(sortedData);
        } catch (err) {
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        setUpdatingId(id);

        try {
            const res = await fetch(`http://localhost:5000/api/orders/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                // Refresh list locally
                setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus, isDelivered: newStatus === 'Delivered' } : o));
            } else {
                alert('Failed to update status');
            }
        } catch (err) {
            alert('Connection error');
        } finally {
            setUpdatingId(null);
        }
    };

    const getFilteredOrders = () => {
        if (!statusFilter || statusFilter === 'All') return orders;
        if (statusFilter === 'Pending') return orders.filter(o => o.status === 'Pending' || o.status === 'Processing');
        if (statusFilter === 'Delivered') return orders.filter(o => o.status === 'Delivered');
        if (statusFilter === 'Cancelled') return orders.filter(o => o.status === 'Cancelled');
        return orders;
    };

    const filteredOrders = getFilteredOrders();

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Delivered':
                return <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center w-fit"><CheckCircle size={14} className="mr-1" /> Delivered</span>;
            case 'Cancelled':
                return <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center w-fit"><XCircle size={14} className="mr-1" /> Cancelled</span>;
            case 'Shipped':
                return <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center w-fit"><Truck size={14} className="mr-1" /> Shipped</span>;
            default:
                return <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold flex items-center w-fit"><Clock size={14} className="mr-1" /> Pending</span>;
        }
    };

    const pageTitle = statusFilter === 'All' ? 'All Orders' : `${statusFilter} Orders`;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#2C1810] font-[Outfit]">{pageTitle}</h1>
                    <p className="text-[#6D5E57]">Manage and track your customer orders.</p>
                </div>
                <button onClick={fetchOrders} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <RefreshCw size={20} className="text-slate-600" />
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin w-10 h-10 border-4 border-[#C97E45] border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading orders...</p>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="bg-white p-16 rounded-[2rem] text-center border border-dashed border-slate-200">
                    <ShoppingBag className="mx-auto text-slate-300 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-slate-700">No {statusFilter?.toLowerCase()} orders found</h3>
                    <p className="text-slate-500 mt-2">When customers place orders, they will appear here.</p>
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#FFF8E7] text-[#4A2C2A] font-bold text-sm uppercase tracking-wider">
                                <tr>
                                    <th className="p-6">Order ID</th>
                                    <th className="p-6">Customer</th>
                                    <th className="p-6">Date</th>
                                    <th className="p-6">Total</th>
                                    <th className="p-6">Status</th>
                                    <th className="p-6">Payment</th>
                                    <th className="p-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-6 font-mono text-sm text-slate-500">
                                            #{order._id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="p-6">
                                            <div className="font-bold text-[#2C1810]">{order.user?.name || 'Guest User'}</div>
                                            <div className="text-xs text-slate-500">{order.shippingAddress?.phone}</div>
                                        </td>
                                        <td className="p-6 text-sm text-slate-600">
                                            {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="p-6 font-bold text-[#4A2C2A]">
                                            ₹{order.totalPrice}
                                        </td>
                                        <td className="p-6">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="p-6">
                                            <span className="px-2 py-1 rounded bg-slate-100 text-xs font-mono font-semibold text-slate-600">
                                                {order.paymentMethod}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                {/* Action Buttons based on status */}
                                                {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatus(order._id, 'Delivered')}
                                                            disabled={updatingId === order._id}
                                                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                                            title="Mark as Delivered"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(order._id, 'Cancelled')}
                                                            disabled={updatingId === order._id}
                                                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                            title="Cancel Order"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    </>
                                                )}
                                                <Link
                                                    to={`/admin/orders/${order._id}`}
                                                    className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersList;
