import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, CreditCard } from 'lucide-react';

const PaymentSettings = () => {
    const [settings, setSettings] = useState({
        enableCOD: true,
        enableStripe: false,
        stripePublicKey: '',
        stripeSecretKey: '',
        currency: 'INR'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/settings/payment', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (data.success && data.data) {
                setSettings({ ...settings, ...data.data });
            }
        } catch (err) {
            console.error('Failed to fetch payment settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('http://localhost:5000/api/settings/payment', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                alert('Payment Settings Saved');
            }
        } catch (err) {
            alert('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#2C1810] font-[Outfit]">Payment Settings</h1>
                    <p className="text-[#6D5E57]">Configure payment gateways and methods.</p>
                </div>
                <button onClick={fetchSettings} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <RefreshCw size={20} className="text-slate-600" />
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20">Loading...</div>
            ) : (
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-8">
                    {/* COD Section */}
                    <div>
                        <h3 className="font-bold text-lg text-[#2C1810] mb-4 flex items-center">
                            <CreditCard className="mr-2 text-[#C97E45]" size={20} /> Cash on Delivery (COD)
                        </h3>
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.enableCOD}
                                onChange={(e) => setSettings({ ...settings, enableCOD: e.target.checked })}
                                className="w-5 h-5 text-[#C97E45] rounded focus:ring-[#C97E45]"
                            />
                            <span className="text-slate-700 font-medium">Enable Cash on Delivery</span>
                        </label>
                    </div>

                    <div className="border-t border-slate-100 my-6"></div>

                    {/* Stripe Section */}
                    <div>
                        <h3 className="font-bold text-lg text-[#2C1810] mb-4 flex items-center">
                            <CreditCard className="mr-2 text-[#C97E45]" size={20} /> Stripe Integration
                        </h3>
                        <div className="space-y-4">
                            <label className="flex items-center space-x-3 cursor-pointer mb-4">
                                <input
                                    type="checkbox"
                                    checked={settings.enableStripe}
                                    onChange={(e) => setSettings({ ...settings, enableStripe: e.target.checked })}
                                    className="w-5 h-5 text-[#C97E45] rounded focus:ring-[#C97E45]"
                                />
                                <span className="text-slate-700 font-medium">Enable Stripe Payments</span>
                            </label>

                            {settings.enableStripe && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold text-[#4A2C2A] mb-2">Currency</label>
                                        <select
                                            className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 outline-none"
                                            value={settings.currency}
                                            onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                        >
                                            <option value="INR">INR (₹)</option>
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                        </select>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-bold text-[#4A2C2A] mb-2">Publishable Key</label>
                                        <input
                                            type="text"
                                            className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 outline-none font-mono text-sm"
                                            value={settings.stripePublicKey}
                                            onChange={(e) => setSettings({ ...settings, stripePublicKey: e.target.value })}
                                            placeholder="pk_test_..."
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-bold text-[#4A2C2A] mb-2">Secret Key</label>
                                        <input
                                            type="password"
                                            className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 outline-none font-mono text-sm"
                                            value={settings.stripeSecretKey}
                                            onChange={(e) => setSettings({ ...settings, stripeSecretKey: e.target.value })}
                                            placeholder="sk_test_..."
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
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

export default PaymentSettings;
