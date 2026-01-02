import React, { useState } from 'react';
import API_URL from '../../config';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, Coffee, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [errors, setErrors] = useState({});

    // Verification States
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [verifying, setVerifying] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
    });

    const validate = () => {
        let tempErrors = {};
        if (!formData.name.trim()) tempErrors.name = "Name is required";
        if (!formData.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) tempErrors.email = "Invalid email format";
        if (!formData.phone.match(/^\d{10}$/)) tempErrors.phone = "Phone must be 10 digits";
        if (formData.password.length < 6) tempErrors.password = "Password must be at least 6 characters";

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
        if (e.target.name === 'email') {
            setIsVerified(false);
            setShowOtpInput(false);
            setOtp('');
        }
    };

    const handleSendVerification = async () => {
        if (!formData.email) {
            setErrors({ ...errors, email: 'Please enter an email first' });
            return;
        }
        // Basic format check
        if (!formData.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            setErrors({ ...errors, email: 'Invalid email format' });
            return;
        }

        setVerifying(true);
        setError('');
        try {
            const res = await fetch(`${API_URL}/api/auth/send-verification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });
            const data = await res.json();
            if (res.ok) {
                setShowOtpInput(true);
                setSuccess('Verification code sent to your email!');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.message || 'Failed to send verification');
            }
        } catch (err) {
            setError('Error sending verification email');
        } finally {
            setVerifying(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) return;
        try {
            const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, otp })
            });
            const data = await res.json();
            if (res.ok) {
                setIsVerified(true);
                setShowOtpInput(false);
                setSuccess('Email Verified Successfully!');
                // Keep success message visible or clear it differently
            } else {
                setError(data.message || 'Invalid OTP');
            }
        } catch (err) {
            setError('Error verifying OTP');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        if (!isVerified) {
            setError('Please verify your email address before registering.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Registration successful! Redirecting to login...');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-[#FDFBF7] relative overflow-hidden">
            {/* Background Texture/Gradient */}
            <div className="absolute inset-0 z-0 opacity-40">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#C97E45] rounded-full mix-blend-multiply filter blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#4A2C2A] rounded-full mix-blend-multiply filter blur-[100px] animate-pulse-slow delay-1000"></div>
            </div>

            <div className="max-w-5xl w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row-reverse border border-white/50 relative z-10 hover:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.15)] transition-shadow duration-500">

                {/* Right Side: Branding */}
                <div className="md:w-5/12 bg-gradient-to-br from-[#2C1810] to-[#4A2C2A] p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#000]/10 pattern-dots opacity-20"></div>
                    <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-12 -translate-y-12">
                        <Coffee size={180} />
                    </div>

                    <div className="relative z-10 animate-fade-in-up">
                        <Link to="/" className="text-2xl font-bold font-[Outfit] flex items-center group">
                            <span className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mr-3 group-hover:bg-[#C97E45] transition-colors duration-300">
                                <Coffee className="text-white" size={20} />
                            </span>
                            <span>KRC! Coffee</span>
                        </Link>

                        <div className="mt-24 space-y-6">
                            <h2 className="text-4xl text-white lg:text-5xl font-bold font-[Outfit] leading-[1.1]">
                                Join the <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C97E45] to-[#E6A470]">Coffee Club</span>
                            </h2>
                            <p className="text-white/70 text-lg font-light leading-relaxed max-w-xs">
                                Where every sip tells a story of passion and perfection.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 mt-12 space-y-4 animate-fade-in-up delay-200">
                        <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
                            <div className="w-10 h-10 rounded-full bg-[#C97E45]/20 flex items-center justify-center text-[#C97E45]">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">Exclusive Perks</h4>
                                <p className="text-xs text-white/60">Early access to new blends.</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
                            <div className="w-10 h-10 rounded-full bg-[#C97E45]/20 flex items-center justify-center text-[#C97E45]">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">Secure Account</h4>
                                <p className="text-xs text-white/60">Your privacy is our priority.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Left Side: Form */}
                <div className="md:w-7/12 p-8 md:p-12 lg:p-16 bg-white/50 backdrop-blur-sm">
                    <div className="mb-8">
                        <h3 className="text-3xl font-bold text-[#2C1810] mb-2 font-[Outfit]">Create Account</h3>
                        <p className="text-[#6D5E57] text-lg">Start your premium experience today.</p>

                        {/* Messages */}
                        {error && (
                            <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-600 animate-slide-in-from-top-4">
                                <div className="mt-0.5"><ShieldCheck size={16} /></div>
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}
                        {success && (
                            <div className="mt-6 p-4 rounded-xl bg-green-50 border border-green-100 flex items-start gap-3 text-green-700 animate-slide-in-from-top-4">
                                <div className="mt-0.5"><CheckCircle2 size={16} /></div>
                                <p className="text-sm font-medium">{success}</p>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Name Field */}
                        <div className={`transition-all duration-300 ${errors.name ? 'animate-shake' : ''}`}>
                            <label className="block text-sm font-bold text-[#4A2C2A] mb-2 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${errors.name ? 'text-red-400' : 'text-slate-400 group-focus-within:text-[#C97E45]'}`} size={20} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Steven Paul"
                                    className={`w-full pl-12 pr-4 py-4 bg-white border-2 rounded-2xl outline-none font-medium text-[#2C1810] placeholder:text-slate-300 transition-all duration-300 
                                    ${errors.name
                                            ? 'border-red-100 focus:border-red-400 focus:ring-4 focus:ring-red-50'
                                            : 'border-slate-100 focus:border-[#C97E45] focus:ring-4 focus:ring-[#C97E45]/10 hover:border-[#C97E45]/30'}`}
                                />
                            </div>
                            {errors.name && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{errors.name}</p>}
                        </div>

                        {/* Email Field with Verification */}
                        <div className={`transition-all duration-300 ${errors.email ? 'animate-shake' : ''}`}>
                            <label className="block text-sm font-bold text-[#4A2C2A] mb-2 ml-1">Email Address</label>

                            <div className="flex gap-3">
                                <div className="relative group flex-grow">
                                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${errors.email ? 'text-red-400' : 'text-slate-400 group-focus-within:text-[#C97E45]'}`} size={20} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        readOnly={isVerified}
                                        placeholder="steven@example.com"
                                        className={`w-full pl-12 pr-4 py-4 bg-white border-2 rounded-2xl outline-none font-medium text-[#2C1810] placeholder:text-slate-300 transition-all duration-300 
                                            ${errors.email ? 'border-red-100 focus:border-red-400' : isVerified ? 'border-green-200 bg-green-50/30' : 'border-slate-100 focus:border-[#C97E45] focus:ring-4 focus:ring-[#C97E45]/10 hover:border-[#C97E45]/30'}`}
                                    />
                                    {isVerified && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center text-green-600 bg-green-100 px-2 py-1 rounded-lg text-xs font-bold gap-1 animate-scale-in">
                                            <CheckCircle2 size={14} /> Verified
                                        </div>
                                    )}
                                </div>

                                {!isVerified && (
                                    <button
                                        type="button"
                                        onClick={handleSendVerification}
                                        disabled={verifying || !formData.email}
                                        className="bg-[#2C1810] text-white px-6 rounded-2xl font-bold text-sm hover:bg-[#C97E45] disabled:opacity-50 disabled:hover:bg-[#2C1810] whitespace-nowrap shadow-lg shadow-[#2c1810]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                        {verifying ? (
                                            <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending</span>
                                        ) : 'Verify'}
                                    </button>
                                )}
                            </div>

                            {errors.email && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{errors.email}</p>}

                            {/* OTP Section */}
                            {showOtpInput && (
                                <div className="mt-4 p-4 bg-orange-50/50 rounded-2xl border-2 border-orange-100/50 animate-fade-in-down">
                                    <p className="text-xs font-bold text-[#C97E45] mb-2 uppercase tracking-wide">Verification Code Sent</p>
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="XXXXXX"
                                            className="flex-grow px-4 py-3 bg-white border-2 border-orange-100 rounded-xl outline-none focus:border-[#C97E45] focus:ring-4 focus:ring-[#C97E45]/10 text-center tracking-[0.5em] font-bold text-xl text-[#2C1810] transition-all"
                                            maxLength={6}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleVerifyOtp}
                                            className="bg-green-600 text-white px-6 rounded-xl font-bold text-sm hover:bg-green-500 shadow-md transition-all active:scale-95"
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label className="block text-sm font-bold text-[#4A2C2A] mb-2 ml-1">Phone Number</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#C97E45] transition-colors duration-300" size={20} />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+91 98765 43210"
                                    className={`w-full pl-12 pr-4 py-4 bg-white border-2 rounded-2xl outline-none font-medium text-[#2C1810] placeholder:text-slate-300 transition-all duration-300 
                                    ${errors.phone ? 'border-red-100 focus:border-red-400' : 'border-slate-100 focus:border-[#C97E45] focus:ring-4 focus:ring-[#C97E45]/10 hover:border-[#C97E45]/30'}`}
                                />
                            </div>
                            {errors.phone && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{errors.phone}</p>}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-bold text-[#4A2C2A] mb-2 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#C97E45] transition-colors duration-300" size={20} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full pl-12 pr-4 py-4 bg-white border-2 rounded-2xl outline-none font-medium text-[#2C1810] placeholder:text-slate-300 transition-all duration-300 
                                    ${errors.password ? 'border-red-100 focus:border-red-400' : 'border-slate-100 focus:border-[#C97E45] focus:ring-4 focus:ring-[#C97E45]/10 hover:border-[#C97E45]/30'}`}
                                />
                            </div>
                            {errors.password && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{errors.password}</p>}
                        </div>

                        {/* Terms */}
                        <div className="flex items-start ml-1 py-2 group">
                            <input type="checkbox" id="terms" className="mt-1.5 w-4 h-4 rounded border-slate-300 text-[#C97E45] focus:ring-[#C97E45] cursor-pointer" required />
                            <label htmlFor="terms" className="ml-3 text-sm text-[#6D5E57] leading-relaxed cursor-pointer select-none">
                                I verify that I am over 18 and agree to the <span className="font-bold text-[#C97E45] hover:underline">Terms of Service</span>.
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !isVerified}
                            className={`w-full bg-gradient-to-r from-[#C97E45] to-[#b06d3a] text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-[#C97E45]/20 hover:shadow-2xl hover:shadow-[#C97E45]/40 transition-all duration-300 flex items-center justify-center group transform hover:-translate-y-1 active:translate-y-0
                            ${(loading || !isVerified) ? 'opacity-60 cursor-not-allowed grayscale' : ''}`}
                        >
                            <span>{loading ? 'Creating Your Account...' : 'Create Account'}</span>
                            {!loading && <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={20} />}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-[#6D5E57]">
                        Already have an account? {' '}
                        <Link to="/login" className="font-bold text-[#4A2C2A] hover:text-[#C97E45] transition-colors relative inline-block after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-[#C97E45] after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
