import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

const TaxDeliverySettings = () => {
    const [settings, setSettings] = useState({
        taxRate: '',
        shippingFee: '',
        freeShippingThreshold: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/settings/tax', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (data.success && data.data) {
                // Ensure defaults
                setSettings({
                    taxRate: data.data.taxRate || 0,
                    shippingFee: data.data.shippingFee || 0,
                    freeShippingThreshold: data.data.freeShippingThreshold || 0
                });
            }
        } catch (err) {
            console.error('Failed to fetch tax settings');
            toast.error('Failed to fetch settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                taxRate: parseFloat(settings.taxRate) || 0,
                shippingFee: parseFloat(settings.shippingFee) || 0,
                freeShippingThreshold: parseFloat(settings.freeShippingThreshold) || 0
            };

            const res = await fetch('http://localhost:5000/api/settings/tax', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                toast.success('Tax & Delivery settings updated');
            } else {
                toast.error('Failed to save settings');
            }
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#2C1810] font-[Outfit]">Tax & Delivery</h1>
                    <p className="text-[#6D5E57]">Manage tax rates and shipping charges.</p>
                </div>
                <button onClick={fetchSettings} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <RefreshCw size={20} className="text-slate-600" />
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20">Loading...</div>
            ) : (
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="font-bold text-lg text-[#2C1810] mb-4">Tax Configuration</h3>
                        <div>
                            <label className="block text-sm font-bold text-[#4A2C2A] mb-2">Global Tax Rate (%)</label>
                            <input
                                type="number"
                                name="taxRate"
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 outline-none"
                                value={settings.taxRate}
                                onChange={handleChange}
                                placeholder="0"
                            />
                            <p className="text-xs text-slate-500 mt-2">This percentage will be applied to the order subtotal.</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg text-[#2C1810] mb-4 flex items-center">
                            <Truck className="mr-2" size={20} /> Delivery Fees
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-[#4A2C2A] mb-2">Standard Shipping Fee (₹)</label>
                                <input
                                    type="number"
                                    name="shippingFee"
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 outline-none"
                                    value={settings.shippingFee}
                                    onChange={handleChange}
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#4A2C2A] mb-2">Free Shipping Threshold (₹)</label>
                                <input
                                    type="number"
                                    name="freeShippingThreshold"
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 outline-none"
                                    value={settings.freeShippingThreshold}
                                    onChange={handleChange}
                                    placeholder="0"
                                />
                                <p className="text-xs text-slate-500 mt-2">Orders above this amount will get free shipping.</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 pt-4 border-t border-slate-100 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-3 bg-[#4A2C2A] text-white rounded-xl font-bold flex items-center space-x-2 hover:bg-[#2C1810] transition-colors"
                        >
                            <Save size={20} />
                            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaxDeliverySettings;
