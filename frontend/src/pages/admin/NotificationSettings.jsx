import React, { useState, useEffect } from 'react';
import API_URL from '../../config';
import { Save, RefreshCw, Bell } from 'lucide-react';

const NotificationSettings = () => {
    const [settings, setSettings] = useState({
        emailOrderConfirmation: true,
        emailShipment: true,
        smsDelivery: false,
        adminNewOrderAlert: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/settings/notifications`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (data.success && data.data) {
                setSettings({ ...settings, ...data.data });
            }
        } catch (err) {
            console.error('Failed to fetch notification settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/api/settings/notifications`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                alert('Notification Settings Saved');
            }
        } catch (err) {
            alert('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const Toggle = ({ label, checked, onChange }) => (
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <span className="font-medium text-slate-700">{label}</span>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C97E45]"></div>
            </label>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#2C1810] font-[Outfit]">Notification Settings</h1>
                    <p className="text-[#6D5E57]">Control what emails and alerts are sent.</p>
                </div>
                <button onClick={fetchSettings} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <RefreshCw size={20} className="text-slate-600" />
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20">Loading...</div>
            ) : (
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
                    <h3 className="font-bold text-lg text-[#2C1810] flex items-center">
                        <Bell className="mr-2" size={20} /> Customer Notifications
                    </h3>
                    <div className="space-y-4">
                        <Toggle
                            label="Order Confirmation Email"
                            checked={settings.emailOrderConfirmation}
                            onChange={(e) => setSettings({ ...settings, emailOrderConfirmation: e.target.checked })}
                        />
                        <Toggle
                            label="Shipment Update Email"
                            checked={settings.emailShipment}
                            onChange={(e) => setSettings({ ...settings, emailShipment: e.target.checked })}
                        />
                        <Toggle
                            label="Delivery SMS Alerts"
                            checked={settings.smsDelivery}
                            onChange={(e) => setSettings({ ...settings, smsDelivery: e.target.checked })}
                        />
                    </div>

                    <div className="border-t border-slate-100 my-6"></div>

                    <h3 className="font-bold text-lg text-[#2C1810] flex items-center">
                        <Bell className="mr-2" size={20} /> Admin Notifications
                    </h3>
                    <div className="space-y-4">
                        <Toggle
                            label="New Order Alerts"
                            checked={settings.adminNewOrderAlert}
                            onChange={(e) => setSettings({ ...settings, adminNewOrderAlert: e.target.checked })}
                        />
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

export default NotificationSettings;
