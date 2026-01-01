import React, { useState, useEffect } from 'react';
import { Tag, Clock, ArrowRight, Gift, Percent, Copy, CheckCircle2, Loader2 } from 'lucide-react';

const Offers = () => {
    const [copiedCode, setCopiedCode] = useState(null);
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5000/api/offers', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (data.success) {
                    setOffers(data.data.filter(o => o.isActive));
                } else {
                    console.warn("Using fallback/empty offers due to API response", data);
                }
            } catch (err) {
                console.error("Failed to fetch offers", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, []);

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const getIcon = (type) => {
        if (type === 'percentage') return Percent;
        return Tag;
    };

    const getStyles = (index) => {
        const styles = [
            { bg: 'bg-orange-50', color: 'bg-orange-500', text: 'text-orange-600' },
            { bg: 'bg-amber-50', color: 'bg-amber-700', text: 'text-amber-700' },
            { bg: 'bg-green-50', color: 'bg-green-600', text: 'text-green-600' },
            { bg: 'bg-blue-50', color: 'bg-blue-500', text: 'text-blue-500' },
        ];
        return styles[index % styles.length];
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="bg-gradient-to-r from-orange-600 to-orange-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold font-[Outfit] mb-2">Exclusive Offers & Rewards 🎁</h1>
                    <p className="text-orange-100 max-w-xl">Grab the best deals on your favorite coffee. Use these coupons at checkout.</p>
                </div>
                <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-48 h-48 bg-orange-400/20 rounded-full blur-2xl"></div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-orange-500" size={40} />
                </div>
            ) : offers.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-orange-200">
                    <p className="text-slate-500">No active offers at the moment. Check back soon!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers.map((offer, index) => {
                        const style = getStyles(index);
                        const Icon = getIcon(offer.discountType);
                        const isUsed = offer.isUsed;

                        return (
                            <div key={offer._id} className={`${isUsed ? 'bg-slate-100 grayscale opacity-70' : style.bg} border-2 border-dashed border-gray-200 rounded-2xl p-6 relative group transition-all ${!isUsed && 'hover:-translate-y-1 hover:shadow-lg'}`}>
                                {isUsed && (
                                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/50 backdrop-blur-[1px] rounded-2xl">
                                        <span className="bg-slate-800 text-white font-bold px-4 py-2 rounded-full transform -rotate-12 shadow-xl">
                                            ALREADY REDEEMED
                                        </span>
                                    </div>
                                )}

                                <div className={`w-12 h-12 rounded-full ${isUsed ? 'bg-slate-400' : style.color} text-white flex items-center justify-center mb-4 shadow-md`}>
                                    <Icon size={24} />
                                </div>

                                <h3 className="text-xl font-bold text-[#4A2C2A] mb-2 font-[Outfit]">{offer.code}</h3>
                                <p className="text-[#6D5E57] text-sm mb-6 leading-relaxed">
                                    {offer.description}
                                </p>

                                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="font-mono font-bold text-[#4A2C2A] tracking-wider text-lg">
                                        {offer.code}
                                    </div>
                                    <button
                                        onClick={() => !isUsed && copyToClipboard(offer.code)}
                                        disabled={isUsed}
                                        className={`p-2 hover:bg-gray-50 rounded-lg transition-colors text-slate-400 ${!isUsed && `hover:${style.text}`} relative`}
                                        title={isUsed ? "Code Already Used" : "Copy Code"}
                                    >
                                        {copiedCode === offer.code ? (
                                            <CheckCircle2 size={20} className="text-green-500" />
                                        ) : (
                                            <Copy size={20} />
                                        )}
                                    </button>
                                </div>

                                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <Clock size={14} />
                                    <span>{isUsed ? 'Coupon Used' : `Valid till ${new Date(offer.validUntil).toLocaleDateString()}`}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Offers;
