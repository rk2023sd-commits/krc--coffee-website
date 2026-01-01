import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Power, Calendar, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

const Offers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        minOrderValue: '',
        validUntil: ''
    });

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/offers', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (data.success) {
                setOffers(data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/offers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                setOffers([data.data, ...offers]);
                setShowForm(false);
                setFormData({
                    code: '',
                    description: '',
                    discountType: 'percentage',
                    discountValue: '',
                    minOrderValue: '',
                    validUntil: ''
                });
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert('Failed to create offer');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this offer?')) return;
        try {
            const res = await fetch(`http://localhost:5000/api/offers/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                setOffers(offers.filter(offer => offer._id !== id));
            }
        } catch (err) {
            alert('Failed to delete offer');
        }
    };

    const handleToggle = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/offers/${id}/toggle`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                setOffers(offers.map(offer => {
                    if (offer._id === id) return { ...offer, isActive: !offer.isActive };
                    return offer;
                }));
            }
        } catch (err) {
            alert('Failed to update status');
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#2C1810] font-[Outfit]">Offers & Coupons</h1>
                    <p className="text-[#6D5E57]">Manage discount codes and promotions.</p>
                </div>
                <div className="flex space-x-2">
                    <button onClick={fetchOffers} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        <RefreshCw size={20} className="text-slate-600" />
                    </button>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center space-x-2 px-4 py-2 bg-[#C97E45] text-white rounded-lg hover:bg-[#b06a36] transition-colors font-bold"
                    >
                        <Plus size={20} />
                        <span>Create Offer</span>
                    </button>
                </div>
            </div>

            {/* Create Offer Form */}
            {showForm && (
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 mb-8 animate-fade-in-down">
                    <h3 className="font-bold text-lg text-[#2C1810] mb-4">New Coupon Details</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-[#4A2C2A] mb-2">Coupon Code</label>
                            <input
                                type="text"
                                required
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 outline-none uppercase font-mono"
                                placeholder="SUMMER25"
                                value={formData.code}
                                onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#4A2C2A] mb-2">Description</label>
                            <input
                                type="text"
                                required
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 outline-none"
                                placeholder="Summer Sale Discount"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#4A2C2A] mb-2">Discount Type</label>
                            <select
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 outline-none"
                                value={formData.discountType}
                                onChange={e => setFormData({ ...formData, discountType: e.target.value })}
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount (₹)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#4A2C2A] mb-2">Discount Value</label>
                            <input
                                type="number"
                                required
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 outline-none"
                                placeholder="10"
                                value={formData.discountValue}
                                onChange={e => setFormData({ ...formData, discountValue: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#4A2C2A] mb-2">Min. Order Value (₹)</label>
                            <input
                                type="number"
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 outline-none"
                                placeholder="500"
                                value={formData.minOrderValue}
                                onChange={e => setFormData({ ...formData, minOrderValue: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#4A2C2A] mb-2">Valid Until</label>
                            <input
                                type="date"
                                required
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 outline-none"
                                value={formData.validUntil}
                                onChange={e => setFormData({ ...formData, validUntil: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="mr-4 px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-[#C97E45] text-white rounded-xl font-bold hover:bg-[#b06a36] transition-colors"
                            >
                                Save Offer
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="text-center py-20">Loading...</div>
            ) : offers.length === 0 ? (
                <div className="bg-white p-16 rounded-[2rem] text-center border border-dashed border-slate-200">
                    <Tag className="mx-auto text-slate-300 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-slate-700">No active offers</h3>
                    <p className="text-slate-500 mt-2">Create your first coupon code to boost sales.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers.map(offer => {
                        const isExpired = new Date(offer.validUntil) < new Date();
                        // It is effectively active only if isActive is true AND it is not expired
                        const isEffectiveActive = offer.isActive && !isExpired;

                        return (
                            <div key={offer._id} className={`bg-white p-6 rounded-[2rem] border transition-all ${isEffectiveActive ? 'border-slate-100 shadow-sm' : 'border-slate-100 opacity-60 bg-slate-50'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center">
                                        <div className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold font-mono ${isEffectiveActive ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                                            {offer.code}
                                        </div>
                                        {isExpired && (
                                            <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 text-[10px] font-bold rounded-full uppercase tracking-wide border border-red-200">
                                                Expired
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleToggle(offer._id)}
                                            disabled={isExpired}
                                            className={`p-2 rounded-lg transition-colors ${isEffectiveActive ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-slate-400 bg-slate-100 hover:bg-slate-200'} ${isExpired ? 'cursor-not-allowed opacity-50' : ''}`}
                                            title={isExpired ? 'Coupon Expired' : (offer.isActive ? 'Deactivate' : 'Activate')}
                                        >
                                            <Power size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(offer._id)}
                                            className="p-2 text-red-400 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="font-bold text-[#2C1810] text-lg mb-1">{offer.description}</h3>
                                <p className="text-[#C97E45] font-bold text-2xl mb-4">
                                    {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
                                </p>

                                <div className="space-y-2 text-sm text-slate-500">
                                    <div className="flex items-center">
                                        <Tag size={14} className="mr-2" />
                                        Min. Order: ₹{offer.minOrderValue}
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar size={14} className={`mr-2 ${isExpired ? 'text-red-500' : ''}`} />
                                        <span className={isExpired ? 'text-red-500 font-bold' : ''}>
                                            Valid until: {format(new Date(offer.validUntil), 'MMM dd, yyyy')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};

export default Offers;
