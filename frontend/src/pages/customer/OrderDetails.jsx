import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ChevronLeft, Package, User, MapPin, CreditCard,
    Calendar, Clock, CheckCircle2, Truck, Loader2, AlertCircle, ShoppingBag
} from 'lucide-react';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) {
                    setOrder(data);
                } else {
                    setError(data.message || 'Failed to fetch order details');
                }
            } catch (err) {
                setError('Could not connect to the server');
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [id]);

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
                <p className="text-slate-500 font-medium font-[Outfit]">Retrieving your order details...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="p-8 bg-white border border-dashed border-red-200 rounded-[2.5rem] text-center max-w-2xl mx-auto shadow-sm">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
                    <AlertCircle size={32} />
                </div>
                <h3 className="text-[#2C1810] font-bold text-xl mb-2">Order Not Found</h3>
                <p className="text-[#6D5E57] mb-8">{error || 'The order you are looking for does not exist.'}</p>
                <Link to="/customer/orders" className="bg-[#4A2C2A] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#2C1810] transition-colors">
                    Back to My Orders
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link to="/customer/orders" className="inline-flex items-center text-slate-500 hover:text-[#C97E45] font-medium mb-4 transition-colors">
                        <ChevronLeft size={20} className="mr-1" /> Back to Orders
                    </Link>
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold text-[#2C1810] font-[Outfit]">Order Details</h1>
                        <span className={`px-4 py-1 rounded-full text-xs font-bold border uppercase tracking-widest ${getStatusStyles(order.status)}`}>
                            {order.status}
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold text-orange-900/40 uppercase tracking-widest">Order ID</p>
                    <p className="text-lg font-bold text-[#6D5E57]">#{order._id.toUpperCase()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content (Order Items) */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center gap-3">
                            <ShoppingBag className="text-[#C97E45]" size={24} />
                            <h3 className="text-xl font-bold text-[#2C1810]">Items in your order</h3>
                        </div>
                        <div className="p-8">
                            <div className="space-y-6">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="flex items-center gap-6 group">
                                        <div className="w-20 h-20 rounded-2xl bg-amber-50 overflow-hidden border border-amber-100 flex-shrink-0 relative">
                                            {item.image && (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="font-bold text-[#2C1810] text-lg mb-1">{item.name}</h4>
                                            <p className="text-slate-500 text-sm font-medium">Qty: {item.quantity} × ₹{item.price}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-[#2C1810]">₹{item.price * item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-amber-50/50 p-8 border-t border-slate-50">
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span className="font-bold">₹{order.totalPrice + (order.discount || 0)}</span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span className="font-bold">-₹{order.discount}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-slate-600">
                                    <span>Delivery</span>
                                    <span className="text-[#C97E45] font-bold">FREE</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-xl font-bold text-[#2C1810] pt-4 border-t border-slate-200">
                                <span>Total Amount</span>
                                <span className="text-3xl text-[#C97E45]">₹{order.totalPrice}</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
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
                                    <div className={`w-4 h-4 rounded-full ${order.status !== 'Pending' ? 'bg-green-500 ring-4 ring-green-100' : 'bg-slate-200'}`}></div>
                                    <div className="w-0.5 h-full bg-slate-100"></div>
                                </div>
                                <div className="pb-6">
                                    <p className={`font-bold ${order.status !== 'Pending' ? 'text-[#2C1810]' : 'text-slate-400'}`}>Processing</p>
                                    <p className="text-xs text-slate-500 mt-1">We are preparing your coffee</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className={`w-4 h-4 rounded-full ${order.status === 'Shipped' || order.status === 'Delivered' ? 'bg-green-500 ring-4 ring-green-100' : 'bg-slate-200'}`}></div>
                                    <div className="w-0.5 h-full bg-slate-100"></div>
                                </div>
                                <div className="pb-6">
                                    <p className={`font-bold ${order.status === 'Shipped' || order.status === 'Delivered' ? 'text-[#2C1810]' : 'text-slate-400'}`}>Shipped</p>
                                    <p className="text-xs text-slate-500 mt-1">On the way to you</p>
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

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Shipping Address */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <MapPin className="text-[#C97E45]" size={24} />
                            <h3 className="text-xl font-bold text-[#2C1810]">Shipping To</h3>
                        </div>
                        <div className="space-y-2">
                            <p className="font-bold text-[#2C1810] leading-relaxed">
                                {order.shippingAddress.address}
                            </p>
                            <p className="text-[#6D5E57] font-medium">
                                {order.shippingAddress.city} - {order.shippingAddress.pincode}
                            </p>
                            <p className="text-[#6D5E57] font-medium mt-2">
                                Contact: {order.shippingAddress.phone}
                            </p>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <CreditCard className="text-[#C97E45]" size={24} />
                            <h3 className="text-xl font-bold text-[#2C1810]">Payment Info</h3>
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
