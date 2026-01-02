import React, { useState, useEffect } from 'react';
import API_URL from '../../config';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Package, User, MapPin, CreditCard,
    Calendar, Clock, CheckCircle2, XCircle,
    Truck, Loader2, AlertCircle, ShoppingBag, Eye
} from 'lucide-react';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await fetch(`${API_URL}/api/orders/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setOrder(data);
                } else {
                    setError(data.message || 'Failed to fetch order details');
                }
            } catch (err) {
                setError('Internal Server Error');
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [id]);

    const updateStatus = async (newStatus) => {
        try {
            setUpdating(true);
            const response = await fetch(`${API_URL}/api/orders/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                const updatedOrder = await response.json();
                setOrder(updatedOrder);
            } else {
                alert('Status update failed');
            }
        } catch (err) {
            alert('Error updating status');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Delivered':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'Cancelled':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'Processing':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Shipped':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            default:
                return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-[#C97E45] mb-4" size={48} />
                <p className="text-slate-500 font-medium font-[Outfit]">Fetching Order Details...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="p-8 bg-red-50 border border-red-100 rounded-3xl text-center max-w-2xl mx-auto">
                <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                <h3 className="text-red-800 font-bold text-xl mb-2">Error Loading Order</h3>
                <p className="text-red-600 mb-6">{error || 'Order not found'}</p>
                <Link to="/admin/orders/all" className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg">
                    Back to Orders
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link to="/admin/orders/all" className="inline-flex items-center text-slate-500 hover:text-[#C97E45] font-medium mb-4 transition-colors">
                        <ChevronLeft size={20} className="mr-1" /> Back to Orders
                    </Link>
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold text-[#2C1810] font-[Outfit]">Order Summary</h1>
                        <span className={`px-4 py-1 rounded-full text-xs font-bold border uppercase tracking-widest ${getStatusStyles(order.status)}`}>
                            {order.status}
                        </span>
                    </div>
                    <p className="text-[#6D5E57] mt-1 font-medium">Order ID: #{order._id.toUpperCase()}</p>
                </div>

                <div className="flex items-center gap-3">
                    {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                        <>
                            <button
                                onClick={() => updateStatus('Cancelled')}
                                disabled={updating}
                                className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all disabled:opacity-50"
                            >
                                <XCircle size={18} /> Cancel Order
                            </button>
                            <button
                                onClick={() => updateStatus('Delivered')}
                                disabled={updating}
                                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-900/20 transition-all disabled:opacity-50"
                            >
                                <CheckCircle2 size={18} /> Mark Delivered
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content (Order Items) */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center gap-3">
                            <ShoppingBag className="text-[#C97E45]" size={24} />
                            <h3 className="text-xl font-bold text-[#2C1810]">Order Items</h3>
                            <span className="ml-auto bg-slate-100 px-3 py-1 rounded-lg text-xs font-bold text-slate-500">
                                {order.orderItems.length} Products
                            </span>
                        </div>
                        <div className="p-8">
                            <div className="space-y-6">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="flex items-center gap-6 group">
                                        <div className="w-20 h-20 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 flex-shrink-0 relative">
                                            <img src={item.image || null} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="font-bold text-[#2C1810] text-lg mb-1">{item.name}</h4>
                                            <p className="text-slate-500 text-sm font-medium">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-widest">Price</p>
                                            <p className="text-lg font-bold text-[#2C1810]">₹{item.price * item.quantity}</p>
                                            <p className="text-slate-400 text-[10px]">₹{item.price} each</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-slate-50 p-8 border-t border-slate-100">
                            <div className="flex justify-between items-center text-xl font-bold text-[#2C1810]">
                                <span>Grand Total</span>
                                <span className="text-3xl text-[#C97E45]">₹{order.totalPrice}</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline / Additional Info */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Clock className="text-[#C97E45]" size={24} />
                            <h3 className="text-xl font-bold text-[#2C1810]">Order Timeline</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-4 h-4 rounded-full bg-green-500 ring-4 ring-green-100"></div>
                                    <div className="w-0.5 h-full bg-slate-100"></div>
                                </div>
                                <div className="pb-6">
                                    <p className="font-bold text-[#2C1810]">Order Placed</p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            day: '2-digit', month: 'long', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className={`w-4 h-4 rounded-full ${order.isPaid ? 'bg-green-500 ring-4 ring-green-100' : 'bg-slate-200'}`}></div>
                                    <div className="w-0.5 h-full bg-slate-100"></div>
                                </div>
                                <div className="pb-6">
                                    <p className={`font-bold ${order.isPaid ? 'text-[#2C1810]' : 'text-slate-400'}`}>Payment Complete</p>
                                    <p className="text-xs text-slate-500 mt-1">{order.isPaid ? 'Verified' : 'Pending Verification'}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className={`w-4 h-4 rounded-full ${order.status === 'Delivered' ? 'bg-green-500 ring-4 ring-green-100' : 'bg-slate-200'}`}></div>
                                </div>
                                <div>
                                    <p className={`font-bold ${order.status === 'Delivered' ? 'text-[#2C1810]' : 'text-slate-400'}`}>Delivered</p>
                                    {order.deliveredAt && (
                                        <p className="text-xs text-slate-500 mt-1">
                                            {new Date(order.deliveredAt).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Customer & Shipping) */}
                <div className="space-y-8">
                    {/* Customer Info */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <User className="text-[#C97E45]" size={24} />
                            <h3 className="text-xl font-bold text-[#2C1810]">Customer</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Name</p>
                                <p className="font-bold text-[#2C1810]">{order.user?.name || 'Guest User'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email</p>
                                <p className="font-medium text-[#6D5E57]">{order.user?.email || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Contact Number</p>
                                <p className="font-medium text-[#6D5E57]">{order.shippingAddress.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <MapPin className="text-[#C97E45]" size={24} />
                            <h3 className="text-xl font-bold text-[#2C1810]">Shipping</h3>
                        </div>
                        <div className="space-y-2">
                            <p className="font-bold text-[#2C1810] leading-relaxed">
                                {order.shippingAddress.address}
                            </p>
                            <p className="text-[#6D5E57] font-medium">
                                {order.shippingAddress.city} - {order.shippingAddress.pincode}
                            </p>
                        </div>
                        <div className="mt-6 pt-6 border-t border-slate-50">
                            <div className="flex items-center gap-2 text-xs font-bold text-[#C97E45] uppercase tracking-widest">
                                <Truck size={16} />
                                <span>Express Delivery</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Status */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <CreditCard className="text-[#C97E45]" size={24} />
                            <h3 className="text-xl font-bold text-[#2C1810]">Payment</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Method</p>
                                <p className="font-bold text-[#2C1810] uppercase">{order.paymentMethod}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</p>
                                <p className={`font-bold ${order.isPaid ? 'text-green-600' : 'text-amber-600'}`}>
                                    {order.isPaid ? 'PAID' : 'PENDING'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
