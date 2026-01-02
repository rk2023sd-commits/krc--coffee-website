import React, { useState } from 'react';
import API_URL from '../../config';
import { Lock, Unlock, CheckCircle, ShieldCheck, Info, Loader2 } from 'lucide-react';

const Security = () => {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        setLoading(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const token = localStorage.getItem('token') || (userInfo && userInfo.token);

            const response = await fetch(`${API_URL}/api/users/update-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Password updated successfully' });
                setPasswords({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to update password' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#4A2C2A] mb-2">Security Settings</h1>
                <p className="text-slate-500 text-sm">Update your account password to keep your profile secure.</p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {message.text && (
                        <div className={`p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                            {message.type === 'success' ? <CheckCircle size={20} /> : <Info size={20} />}
                            <span className="text-sm font-bold">{message.text}</span>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Current Password</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Lock size={18} />
                            </span>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwords.currentPassword}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4A2C2A]/20 focus:border-[#4A2C2A] transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Unlock size={18} />
                                </span>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwords.newPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4A2C2A]/20 focus:border-[#4A2C2A] transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <CheckCircle size={18} />
                                </span>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwords.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4A2C2A]/20 focus:border-[#4A2C2A] transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-[#4A2C2A] text-white rounded-2xl font-bold hover:bg-[#3d2422] transition-colors flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck size={20} />
                                    Update Password
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-10 p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                    <div className="flex gap-3">
                        <Info className="text-orange-600 shrink-0" size={20} />
                        <div>
                            <p className="text-orange-900 font-bold text-sm">Security Tip</p>
                            <p className="text-orange-700 text-xs mt-1 leading-relaxed">
                                Use a combination of letters, numbers, and symbols to create a strong password. Avoid using common patterns like "123456" or your birth year.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Security;
