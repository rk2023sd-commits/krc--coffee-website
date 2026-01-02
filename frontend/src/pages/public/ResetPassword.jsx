import React, { useState } from 'react';
import API_URL from '../../config';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle, ChevronLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/auth/resetpassword/${token}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsSuccess(true);
                toast.success('Password reset successfully!');
                // Wait a bit before redirecting? Or just show success screen.
            } else {
                toast.error(data.message || 'Invalid or expired token');
            }
        } catch (err) {
            toast.error('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-[#FDFBF7]">
                <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-12 text-center border border-orange-50">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-green-600" size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-[#4A2C2A] mb-4 font-[Outfit]">Password Reset!</h2>
                    <p className="text-[#6D5E57] mb-8">
                        Your password has been successfully reset. You can now login with your new password.
                    </p>
                    <Link
                        to="/login"
                        className="w-full inline-block bg-[#4A2C2A] text-white py-4 rounded-2xl font-bold shadow-xl shadow-[#4A2C2A]/10 hover:shadow-2xl transition-all"
                    >
                        Login Now
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-[#FDFBF7]">
            <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 border border-orange-50 relative overflow-hidden">
                <div className="mb-8">
                    <Link to="/login" className="inline-flex items-center text-[#6D5E57] hover:text-[#C97E45] transition-colors mb-6 text-sm font-semibold">
                        <ChevronLeft size={16} className="mr-1" /> Back to Login
                    </Link>
                    <h2 className="text-3xl font-bold text-[#4A2C2A] mb-2 font-[Outfit]">Set New Password</h2>
                    <p className="text-[#6D5E57]">
                        Your new password must be different from previous used passwords.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#4A2C2A] ml-1">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] focus:bg-white transition-all outline-none text-[#2C1810]"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#4A2C2A] ml-1">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] focus:bg-white transition-all outline-none text-[#2C1810]"
                                required
                            />
                        </div>
                    </div>

                    <p className="text-xs text-slate-500 ml-1">
                        Must be at least 6 characters.
                    </p>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-[#4A2C2A] hover:bg-[#2C1810] text-white py-4 rounded-2xl font-bold shadow-xl shadow-[#4A2C2A]/10 hover:shadow-2xl transition-all flex items-center justify-center group ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <span>{loading ? 'Reseting...' : 'Reset Password'}</span>
                        {!loading && <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
