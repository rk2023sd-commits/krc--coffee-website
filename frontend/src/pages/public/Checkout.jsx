import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, ChevronLeft, CreditCard, Truck, ShieldCheck, CheckCircle2, Loader2, AlertCircle, X, MapPin, Star } from 'lucide-react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    // Enforce Login
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [error, setError] = useState('');

    // Promo code states
    const [promoCode, setPromoCode] = useState('');
    const [appliedOffer, setAppliedOffer] = useState(null);
    const [promoError, setPromoError] = useState('');
    const [isValidatingPromo, setIsValidatingPromo] = useState(false);

    // Rewards states
    const [userPoints, setUserPoints] = useState(0);
    const [isRedeeming, setIsRedeeming] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        pincode: '',
        paymentMethod: 'COD'
    });

    const [savedAddresses, setSavedAddresses] = useState([]);
    const [savedCards, setSavedCards] = useState([]);

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const rawUser = localStorage.getItem('user');
        if (rawUser) {
            try {
                const parsed = JSON.parse(rawUser);
                const user = parsed.data || parsed;
                setFormData(prev => ({
                    ...prev,
                    fullName: user.name || '',
                    email: user.email || '',
                    phone: user.phone || ''
                }));
            } catch (e) {
                console.error("Error parsing user from localStorage", e);
            }
        }
    }, []);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await fetch('http://localhost:5000/api/users/profile', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (data.success) {
                        setSavedAddresses(data.data.addresses || []);
                        setUserPoints(data.data.rewardPoints || 0);

                        // Fetch payment methods
                        const pmRes = await fetch('http://localhost:5000/api/users/payment-methods', {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        const pmData = await pmRes.json();
                        if (pmData.success) {
                            setSavedCards(pmData.data);
                        }
                    }
                } catch (e) { console.error(e); }
            }
        };
        fetchUserProfile();
    }, []);

    const validate = () => {
        let tempErrors = {};
        if (!formData.fullName?.trim()) tempErrors.fullName = "Full Name is required";
        if (!formData.email?.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) tempErrors.email = "Invalid email format";
        if (!formData.phone?.match(/^\d{10}$/)) tempErrors.phone = "Phone must be 10 digits";
        if (!formData.address?.trim()) tempErrors.address = "Address is required";
        if (!formData.city?.trim()) tempErrors.city = "City is required";
        if (!formData.pincode?.match(/^\d{6}$/)) tempErrors.pincode = "Pincode must be 6 digits";

        setErrors(tempErrors);

        if (Object.keys(tempErrors).length > 0) {
            const firstErrorField = document.querySelector(`[name="${Object.keys(tempErrors)[0]}"]`);
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstErrorField.focus();
            }
        }

        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const fillAddress = (addr) => {
        setFormData({
            ...formData,
            fullName: addr.fullName || '',
            phone: addr.phone || '',
            address: addr.address || '',
            city: addr.city || '',
            pincode: addr.pincode || ''
        });
        setErrors({});
    };

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) return;
        setIsValidatingPromo(true);
        setPromoError('');
        setAppliedOffer(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/offers', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                const offer = data.data.find(o => o.code.toUpperCase() === promoCode.toUpperCase() && o.isActive);
                if (offer) {
                    if (cartTotal < offer.minOrderValue) {
                        setPromoError(`Minimum order value for this code is ₹${offer.minOrderValue}`);
                    } else {
                        setAppliedOffer(offer);
                        setPromoError('');
                    }
                } else {
                    setPromoError('Invalid or expired promo code');
                }
            }
        } catch (err) {
            setPromoError('Error validating code');
        } finally {
            setIsValidatingPromo(false);
        }
    };

    const calculateDiscount = () => {
        let disc = 0;
        if (appliedOffer) {
            if (appliedOffer.discountType === 'percentage') {
                disc += (cartTotal * appliedOffer.discountValue) / 100;
            } else {
                disc += appliedOffer.discountValue;
            }
        }
        if (isRedeeming) {
            disc += 10; // Simple reward logic
        }
        return disc;
    };

    const discount = calculateDiscount();
    const finalTotal = Number((cartTotal - discount).toFixed(2));

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            if (!validate()) return;

            setLoading(true);
            setError('');

            const rawUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            let userId = null;

            if (rawUser) {
                try {
                    const parsed = JSON.parse(rawUser);
                    const user = parsed.data || parsed;
                    userId = user._id;
                } catch (e) { console.error(e); }
            }

            const validItems = cartItems?.filter(item => {
                const id = item._id || '';
                return id.length === 24 && /^[0-9a-fA-F]+$/.test(id);
            }) || [];

            if (validItems.length === 0) {
                setError("Cart is empty or contains invalid items.");
                setLoading(false);
                return;
            }

            const orderData = {
                user: userId,
                orderItems: validItems.map(item => ({
                    product: item._id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    image: item.image
                })),
                shippingAddress: {
                    address: formData.address,
                    city: formData.city,
                    pincode: formData.pincode,
                    phone: formData.phone
                },
                paymentMethod: formData.paymentMethod,
                totalPrice: finalTotal,
                discount: discount || 0,
                promoCode: appliedOffer ? appliedOffer.code : undefined,
                redeemedPoints: isRedeeming ? 100 : 0
            };

            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (response.ok) {
                setOrderSuccess(true);
                clearCart();
                // Trigger updates for sidebar counts and notifications
                window.dispatchEvent(new Event('countRefresh'));
                window.dispatchEvent(new Event('notifRefresh'));
            } else {
                setError(data.message || 'Failed to place order.');
            }
        } catch (err) {
            console.error(err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center container mx-auto px-4 text-center">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-8 animate-bounce">
                    <CheckCircle2 size={64} />
                </div>
                <h1 className="text-4xl font-bold text-[#2C1810] font-[Outfit] mb-4">Order Placed Successfully!</h1>
                <p className="text-[#6D5E57] max-w-md mx-auto mb-10 text-lg">
                    Your delicious coffee is on its way. We've sent the order details to your email.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/customer/orders" className="bg-[#4A2C2A] text-white px-10 py-4 rounded-2xl font-bold shadow-xl">
                        Track Order
                    </Link>
                    <Link to={location.pathname.startsWith('/customer') ? '/customer/home' : '/'} className="bg-slate-100 text-[#2C1810] px-10 py-4 rounded-2xl font-bold">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#FDFBF7] min-h-screen py-12">
            <div className="container mx-auto px-4">
                <Link to={location.pathname.startsWith('/customer') ? '/customer/cart' : '/cart'} className="inline-flex items-center text-slate-500 hover:text-[#C97E45] mb-8 font-medium">
                    <ChevronLeft size={20} className="mr-1" /> Back to Cart
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <h1 className="text-3xl font-bold text-[#2C1810] font-[Outfit] mb-2">Checkout Details</h1>
                        <p className="text-[#6D5E57] mb-8">Please provide your delivery information.</p>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 flex items-center gap-3">
                                <AlertCircle size={20} />
                                <span className="text-sm font-bold">{error}</span>
                            </div>
                        )}

                        {savedAddresses.length > 0 && (
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-[#4A2C2A] flex items-center gap-2">
                                        <MapPin size={18} /> Saved Addresses
                                    </h3>
                                    <Link to="/customer/addresses" className="text-xs font-bold text-[#C97E45] hover:underline">Manage</Link>
                                </div>
                                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                    {savedAddresses.map(addr => (
                                        <div
                                            key={addr._id}
                                            onClick={() => fillAddress(addr)}
                                            className="min-w-[200px] bg-white p-4 rounded-xl border border-slate-200 cursor-pointer hover:border-[#C97E45] hover:bg-orange-50/50 transition-all shadow-sm"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">{addr.type}</span>
                                                {formData.address === addr.address && <CheckCircle2 size={16} className="text-[#C97E45]" />}
                                            </div>
                                            <p className="text-sm font-bold text-[#4A2C2A] truncate">{addr.fullName}</p>
                                            <p className="text-xs text-slate-500 truncate">{addr.city}, {addr.pincode}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
                                <div className="flex items-center space-x-2 text-[#4A2C2A] font-bold mb-4">
                                    <Truck size={20} />
                                    <span>Shipping Address</span>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <input
                                            type="text" name="fullName" placeholder="Full Name"
                                            value={formData.fullName} onChange={handleChange}
                                            className={`w-full px-5 py-4 bg-slate-50 border ${errors.fullName ? 'border-red-400' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none`}
                                        />
                                        {errors.fullName && <p className="text-xs text-red-500 ml-2 mt-1">{errors.fullName}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <input
                                                type="email" name="email" placeholder="Email Address"
                                                value={formData.email} onChange={handleChange}
                                                className={`w-full px-5 py-4 bg-slate-50 border ${errors.email ? 'border-red-400' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none`}
                                            />
                                            {errors.email && <p className="text-xs text-red-500 ml-2 mt-1">{errors.email}</p>}
                                        </div>
                                        <div>
                                            <input
                                                type="tel" name="phone" placeholder="Phone Number"
                                                value={formData.phone} onChange={handleChange}
                                                className={`w-full px-5 py-4 bg-slate-50 border ${errors.phone ? 'border-red-400' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none`}
                                            />
                                            {errors.phone && <p className="text-xs text-red-500 ml-2 mt-1">{errors.phone}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <textarea
                                            name="address" placeholder="Full Delivery Address" rows="3"
                                            value={formData.address} onChange={handleChange}
                                            className={`w-full px-5 py-4 bg-slate-50 border ${errors.address ? 'border-red-400' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none`}
                                        ></textarea>
                                        {errors.address && <p className="text-xs text-red-500 ml-2 mt-1">{errors.address}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <input
                                                type="text" name="city" placeholder="City"
                                                value={formData.city} onChange={handleChange}
                                                className={`w-full px-5 py-4 bg-slate-50 border ${errors.city ? 'border-red-400' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none`}
                                            />
                                            {errors.city && <p className="text-xs text-red-500 ml-2 mt-1">{errors.city}</p>}
                                        </div>
                                        <div>
                                            <input
                                                type="text" name="pincode" placeholder="Pincode"
                                                value={formData.pincode} onChange={handleChange}
                                                className={`w-full px-5 py-4 bg-slate-50 border ${errors.pincode ? 'border-red-400' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none`}
                                            />
                                            {errors.pincode && <p className="text-xs text-red-500 ml-2 mt-1">{errors.pincode}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
                                <div className="flex items-center space-x-2 text-[#4A2C2A] font-bold mb-4">
                                    <CreditCard size={20} />
                                    <span>Payment Method</span>
                                </div>
                                <label className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all border-[#C97E45] bg-orange-50`}>
                                    <input
                                        type="radio" name="paymentMethod" value="COD"
                                        checked={true}
                                        readOnly
                                        className="hidden"
                                    />
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 border-[#C97E45]`}>
                                        <div className="w-2.5 h-2.5 bg-[#C97E45] rounded-full"></div>
                                    </div>
                                    <span className="font-bold text-[#2C1810]">Cash on Delivery</span>
                                </label>
                            </div>

                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
                                <div className="flex items-center space-x-2 text-[#4A2C2A] font-bold mb-4">
                                    <ShieldCheck size={20} />
                                    <span>Promo Code</span>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter coupon code"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                        className="flex-1 px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none uppercase font-bold tracking-wider"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleApplyPromo}
                                        disabled={!promoCode || isValidatingPromo || appliedOffer}
                                        className="px-6 py-3 bg-[#4A2C2A] text-white rounded-2xl font-bold disabled:opacity-50 hover:bg-[#3d2422] transition-colors"
                                    >
                                        {isValidatingPromo ? 'Checking...' : appliedOffer ? 'Applied' : 'Apply'}
                                    </button>
                                </div>
                                {promoError && <p className="text-red-500 text-xs font-bold px-2">{promoError}</p>}
                                {appliedOffer && (
                                    <div className="bg-green-50 text-green-700 p-3 rounded-xl border border-green-100 text-sm flex justify-between items-center">
                                        <span>Code <b>{appliedOffer.code}</b> applied!</span>
                                        <button type="button" onClick={() => { setAppliedOffer(null); setPromoCode(''); }} className="p-1 hover:bg-green-100 rounded-full"><X size={14} /></button>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-2 text-[#4A2C2A] font-bold">
                                        <Star size={20} className="text-yellow-500" />
                                        <span>Use Reward Points</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-400">Available: {userPoints}</span>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                                    <div className="flex-grow">
                                        <p className="text-xs font-bold text-[#4A2C2A]">Redeem 100 points</p>
                                        <p className="text-[10px] text-slate-500">Get ₹10 discount on your order</p>
                                    </div>
                                    <button
                                        type="button"
                                        disabled={userPoints < 100}
                                        onClick={() => setIsRedeeming(!isRedeeming)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${isRedeeming ? 'bg-[#4A2C2A] text-white' : 'bg-white text-[#4A2C2A] border border-orange-200 disabled:opacity-50'}`}
                                    >
                                        {isRedeeming ? 'Applied' : 'Apply'}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#C97E45] text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-orange-900/20 hover:bg-[#B06A36] transition-all flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <><Loader2 className="animate-spin" /><span>Confirming Order...</span></>
                                ) : (
                                    <><ShoppingBag size={22} /><span>Place Order (₹{finalTotal.toLocaleString('en-IN')})</span></>
                                )}
                            </button>
                        </form>
                    </div>

                    <div>
                        <div className="bg-[#4A2C2A] text-white p-10 rounded-[3rem] sticky top-24 shadow-2xl overflow-hidden">
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                            <h2 className="text-2xl font-bold font-[Outfit] mb-8 relative z-10 flex items-center gap-2">
                                <ShoppingBag className="text-[#C97E45]" /> Your Order
                            </h2>
                            <div className="space-y-6 mb-10 max-h-80 overflow-y-auto pr-4 relative z-10 scrollbar-hide">
                                {cartItems?.map((item) => (
                                    <div key={item._id} className="flex gap-4">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                                            <img src={item.image || null} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="font-bold text-sm leading-tight">{item.name}</h4>
                                            <p className="text-white/60 text-xs mt-1">₹{item.price} × {item.quantity}</p>
                                        </div>
                                        <div className="text-right font-bold">₹{item.price * item.quantity}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-4 border-t border-white/10 pt-8 relative z-10">
                                <div className="flex justify-between text-white/70"><span>Subtotal</span><span className="font-bold text-white">₹{cartTotal}</span></div>
                                {appliedOffer && (
                                    <div className="flex justify-between text-emerald-400"><span>Discount ({appliedOffer.code})</span><span className="font-bold">-₹{(cartTotal * appliedOffer.discountValue / 100).toFixed(2)}</span></div>
                                )}
                                {isRedeeming && (
                                    <div className="flex justify-between text-yellow-400"><span>Rewards Applied</span><span className="font-bold">-₹10.00</span></div>
                                )}
                                <div className="flex justify-between text-white/70"><span>Delivery</span><span className="text-[#C97E45] font-bold">FREE</span></div>
                                <div className="flex justify-between items-center pt-4"><span className="text-xl font-bold">Grand Total</span><span className="text-4xl font-bold text-[#C97E45]">₹{finalTotal.toLocaleString('en-IN')}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
