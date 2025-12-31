import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Coffee, ChevronLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/forgotpassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsSubmitted(true);
                toast.success('Reset link sent to your email!');
            } else {
                toast.error(data.message || 'Something went wrong');
            }
        } catch (err) {
            toast.error('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-[#FDFBF7]">
                <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-12 text-center border border-orange-50">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail className="text-green-600" size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-[#4A2C2A] mb-4 font-[Outfit]">Check Your Email</h2>
                    <p className="text-[#6D5E57] mb-8">
                        We have sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
                    </p>
                    <Link
                        to="/login"
                        className="w-full inline-block bg-[#4A2C2A] text-white py-4 rounded-2xl font-bold shadow-xl shadow-[#4A2C2A]/10 hover:shadow-2xl transition-all"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-[#FDFBF7]">
            <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 border border-orange-50 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-[#C97E45] opacity-5 rounded-full blur-2xl"></div>

                <div className="mb-8">
                    <Link to="/login" className="inline-flex items-center text-[#6D5E57] hover:text-[#C97E45] transition-colors mb-6 text-sm font-semibold">
                        <ChevronLeft size={16} className="mr-1" /> Back to Login
                    </Link>
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4 text-[#C97E45]">
                        <Coffee size={24} />
                    </div>
                    <h2 className="text-3xl font-bold text-[#4A2C2A] mb-2 font-[Outfit]">Forgot Password?</h2>
                    <p className="text-[#6D5E57]">
                        Don't worry! It happens. Please enter the email associated with your account.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#4A2C2A] ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] focus:bg-white transition-all outline-none text-[#2C1810]"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-[#4A2C2A] hover:bg-[#2C1810] text-white py-4 rounded-2xl font-bold shadow-xl shadow-[#4A2C2A]/10 hover:shadow-2xl transition-all flex items-center justify-center group ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <span>{loading ? 'Sending...' : 'Send Reset Link'}</span>
                        {!loading && <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
