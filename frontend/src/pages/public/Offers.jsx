import React, { useState, useEffect } from 'react';
import { Copy, Check, Loader2, Gift } from 'lucide-react';
import toast from 'react-hot-toast';

const Offers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/offers');
                const data = await res.json();
                if (data.success) {
                    // Filter only active offers
                    setOffers(data.data.filter(offer => offer.isActive));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, []);

    const copyToClipboard = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        toast.success('Coupon code copied!');
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-[#4A2C2A]" size={40} /></div>;

    return (
        <div className="bg-[#FDFBF7] min-h-screen py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16 animate-fade-in">
                    <span className="text-[#C97E45] font-bold tracking-widest uppercase text-sm mb-2 block">Special Deals</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#2C1810] font-[Outfit] mb-6">Current Offers</h1>
                    <p className="text-[#6D5E57] max-w-2xl mx-auto">Grab your favorite coffee at the best prices. Use the coupons below at checkout.</p>
                </div>

                {offers.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[2rem] shadow-sm animate-fade-in">
                        <Gift className="mx-auto text-slate-300 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-slate-500">No active offers at the moment.</h3>
                        <p className="text-slate-400">Please check back later!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 animate-slide-up">
                        {offers.map((offer) => (
                            <div key={offer._id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                                {/* Decor */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[100%] transition-transform group-hover:scale-110"></div>
                                <div className="absolute top-6 right-6 text-[#C97E45]">
                                    <Gift size={28} />
                                </div>

                                <div className="relative z-10">
                                    <div className="text-[#C97E45] font-bold text-sm uppercase tracking-wide mb-2">{offer.title}</div>
                                    <h3 className="text-3xl font-bold text-[#2C1810] mb-4 font-[Outfit]">{offer.discountValue}{offer.discountType === 'percentage' ? '%' : '₹'} OFF</h3>
                                    <p className="text-[#6D5E57] mb-8 text-sm">{offer.description}</p>

                                    <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300 flex items-center justify-between group-hover:border-[#C97E45] transition-colors">
                                        <code className="font-mono font-bold text-lg text-[#2C1810]">{offer.code}</code>
                                        <button
                                            onClick={() => copyToClipboard(offer.code, offer._id)}
                                            className="p-2 hover:bg-[#EADDD5] rounded-lg transition-colors text-[#4A2C2A]"
                                            title="Copy Code"
                                        >
                                            {copiedId === offer._id ? <Check size={20} /> : <Copy size={20} />}
                                        </button>
                                    </div>
                                    <div className="mt-4 text-xs text-slate-400 text-center">
                                        Valid on orders above ₹{offer.minOrderAmount}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* How it Works */}
                <div className="mt-20 mb-16 animate-fade-in-delay-1">
                    <h2 className="text-3xl font-bold text-[#2C1810] text-center mb-12 font-[Outfit]">How to Redeem</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#C97E45] font-bold text-xl">1</div>
                            <h3 className="font-bold text-xl mb-2 text-[#2C1810]">Copy Code</h3>
                            <p className="text-[#6D5E57]">Find a coupon you like and click the copy button.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#C97E45] font-bold text-xl">2</div>
                            <h3 className="font-bold text-xl mb-2 text-[#2C1810]">Fill Your Cart</h3>
                            <p className="text-[#6D5E57]">Add your favorite coffee blends to your shopping cart.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#C97E45] font-bold text-xl">3</div>
                            <h3 className="font-bold text-xl mb-2 text-[#2C1810]">Apply at Checkout</h3>
                            <p className="text-[#6D5E57]">Paste the code at checkout and watch the price drop!</p>
                        </div>
                    </div>
                </div>

                {/* Newsletter */}
                <div className="bg-[#2C1810] rounded-[3rem] p-8 md:p-16 text-center text-white relative overflow-hidden animate-fade-in-delay-2">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=2561&auto=format&fit=crop')] bg-cover opacity-10"></div>
                    <div className="relative z-10 w-full max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-[Outfit]">Never Miss a Deal</h2>
                        <p className="text-orange-100 mb-8">Subscribe to our newsletter and get exclusive coupons delivered straight to your inbox.</p>
                        <div className="flex flex-col sm:flex-row gap-2 bg-white/10 p-2 rounded-3xl sm:rounded-full border border-white/20">
                            <input type="email" placeholder="Enter your email" className="bg-transparent border-none outline-none text-white placeholder-white/50 w-full px-6 py-3" />
                            <button className="bg-[#C97E45] text-white px-8 py-3 rounded-2xl sm:rounded-full font-bold hover:bg-[#b06a36] transition-colors shadow-lg">Subscribe</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Offers;
