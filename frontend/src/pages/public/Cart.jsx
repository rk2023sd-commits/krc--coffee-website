import React from 'react';
import { useCart } from '../../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Trash } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center container mx-auto px-4">
                <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center text-[#C97E45] mb-6">
                    <ShoppingBag size={48} />
                </div>
                <h2 className="text-3xl font-bold text-[#2C1810] font-[Outfit] mb-2">Your Cart is Empty</h2>
                <p className="text-[#6D5E57] mb-8">Looks like you haven't added anything to your cart yet.</p>
                <Link to="/shop/all" className="bg-[#4A2C2A] text-white px-8 py-3 rounded-full font-bold shadow-xl hover:translate-y-[-2px] transition-all">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#FDFBF7] min-h-screen py-12">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-10">
                    <h1 className="text-4xl font-bold text-[#2C1810] font-[Outfit]">Shopping Cart</h1>
                    <button
                        onClick={clearCart}
                        className="text-red-500 flex items-center space-x-2 font-bold text-sm hover:underline"
                    >
                        <Trash size={16} />
                        <span>Clear Cart</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.map((item) => (
                            <div key={item._id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-50">
                                    <img src={item.image || null} alt={item.name} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-[#2C1810] font-[Outfit] mb-1">{item.name}</h3>
                                            <p className="text-xs text-[#C97E45] font-bold uppercase tracking-wider">{item.category}</p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="text-slate-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-end mt-4">
                                        <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                className="p-2 hover:bg-white rounded-lg transition-colors text-[#4A2C2A]"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-10 text-center font-bold text-[#2C1810]">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                className="p-2 hover:bg-white rounded-lg transition-colors text-[#4A2C2A]"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-slate-400 block font-medium">Subtotal</span>
                                            <span className="text-xl font-bold text-[#2C1810]">₹{item.price * item.quantity}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="h-fit">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 sticky top-24">
                            <h2 className="text-2xl font-bold text-[#2C1810] font-[Outfit] mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-[#6D5E57]">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-[#2C1810]">₹{cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-[#6D5E57]">
                                    <span>Delivery Fee</span>
                                    <span className="text-green-600 font-bold uppercase text-xs">Free</span>
                                </div>
                                <div className="flex justify-between text-[#6D5E57]">
                                    <span>Tax (GST)</span>
                                    <span className="font-bold text-[#2C1810]">₹0</span>
                                </div>
                                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                    <span className="text-lg font-bold text-[#2C1810]">Total</span>
                                    <span className="text-3xl font-bold text-[#C97E45]">₹{cartTotal}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-[#4A2C2A] text-white py-4 rounded-2xl font-bold shadow-xl shadow-[#4A2C2A]/20 hover:bg-[#2C1810] flex items-center justify-center group transition-all"
                            >
                                <span>Proceed to Checkout</span>
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                            </button>

                            <p className="text-center text-[10px] text-slate-400 mt-6 font-medium">
                                Secure payment powered by Razorpay / Stripe
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
