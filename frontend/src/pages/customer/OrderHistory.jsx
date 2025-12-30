import React, { useState, useEffect } from 'react';
import { ShoppingBag, Package, Calendar, Clock, MapPin, ChevronRight, Loader2, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                // Get user from localStorage
                const rawUser = localStorage.getItem('user');
                let userId = 'guest';

                if (rawUser) {
                    const parsed = JSON.parse(rawUser);
                    const user = parsed.data || parsed;
                    userId = user._id || user.id || 'guest';
                }

                const response = await fetch(`http://localhost:5000/api/orders/myorders/${userId}`);
                const data = await response.json();

                if (response.ok) {
                    setOrders(data);
                } else {
                    setError(data.message || 'Failed to fetch orders');
                }
            } catch (err) {
                console.error('Fetch orders error:', err);
                setError('Could not connect to the server.');
            } finally {
                setLoading(false);
            }
        };

        fetchMyOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-700';
            case 'Shipped': return 'bg-blue-100 text-blue-700';
            case 'Processing': return 'bg-amber-100 text-amber-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="animate-spin text-[#C97E45] mb-4" size={48} />
                <p className="text-slate-500 font-medium font-[Outfit]">Retrieving your delicious history...</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-orange-200 shadow-sm">
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-[#C97E45] mx-auto mb-6">
                    <ShoppingBag size={40} />
                </div>
                <h2 className="text-2xl font-bold text-[#4A2C2A] font-[Outfit] mb-2">No Orders Yet</h2>
                <p className="text-[#6D5E57] mb-8">Ready to start your coffee journey with us?</p>
                <Link to="/customer/shop" className="inline-block bg-[#4A2C2A] text-white px-10 py-3 rounded-full font-bold shadow-xl hover:translate-y-[-2px] transition-all">
                    Order Your First Cup
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-[#4A2C2A] font-[Outfit]">My Orders</h1>
                    <p className="text-[#6D5E57]">Showing your recent coffee adventures.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl text-sm font-bold text-[#C97E45] border border-orange-100">
                    Total Orders: {orders.length}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {orders.map((order) => (
                    <div key={order._id} className="bg-white rounded-[2.5rem] shadow-sm border border-orange-50 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                        {/* Order Header */}
                        <div className="p-6 md:p-8 border-b border-orange-50 flex flex-wrap justify-between items-center gap-4 bg-orange-50/10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-2xl shadow-sm text-[#4A2C2A]">
                                    <Package size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-orange-900/40 uppercase tracking-widest">Order ID</p>
                                    <h3 className="text-lg font-bold text-[#4A2C2A]">#{order._id.slice(-8).toUpperCase()}</h3>
                                </div>
                            </div>

                            <div className="flex gap-8">
                                <div className="hidden sm:block">
                                    <p className="text-xs font-bold text-orange-900/40 uppercase tracking-widest">Ordered On</p>
                                    <p className="text-sm font-medium text-[#6D5E57]">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-orange-900/40 uppercase tracking-widest">Total Amount</p>
                                    <p className="text-lg font-bold text-[#C97E45]">₹{order.totalPrice}</p>
                                </div>
                                <div className="flex items-center">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Order Content */}
                        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Items List */}
                            <div className="space-y-4">
                                <p className="text-xs font-bold text-orange-900/40 uppercase tracking-widest mb-2">Order Items</p>
                                {order.orderItems.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 bg-orange-50/20 p-3 rounded-2xl">
                                        <div className="w-12 h-12 rounded-xl bg-white flex-shrink-0 overflow-hidden border border-orange-100/50">
                                            {item.image ? (
                                                <img src={item.image || null} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-orange-200">
                                                    <Coffee size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="text-sm font-bold text-[#4A2C2A]">{item.name}</h4>
                                            <p className="text-xs text-[#6D5E57]">Qty: {item.quantity} × ₹{item.price}</p>
                                        </div>
                                        <div className="text-sm font-bold text-[#4A2C2A]">
                                            ₹{item.price * item.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Shipping info */}
                            <div className="bg-slate-50/50 rounded-3xl p-6 flex flex-col justify-between">
                                <div>
                                    <p className="text-xs font-bold text-orange-900/40 uppercase tracking-widest mb-4">Delivery Address</p>
                                    <div className="flex gap-3 text-[#6D5E57]">
                                        <MapPin size={18} className="text-[#C97E45] flex-shrink-0" />
                                        <div className="text-sm">
                                            <p className="font-bold text-[#4A2C2A]">{order.shippingAddress.address}</p>
                                            <p>{order.shippingAddress.city}, {order.shippingAddress.pincode}</p>
                                            <p className="mt-2 text-xs font-medium">Contact: {order.shippingAddress.phone}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-xs font-bold text-[#6D5E57]">
                                        <Clock size={14} />
                                        <span>Status: {order.status === 'Pending' ? 'Arriving Soon' : order.status}</span>
                                    </div>
                                    <button className="flex items-center text-[#C97E45] font-bold text-sm hover:translate-x-1 transition-transform">
                                        View Details <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistory;
