import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, Coffee, ShieldCheck, Sparkles } from 'lucide-react';

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [errors, setErrors] = useState({});

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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
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
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-[#FDFBF7]">
            <div className="max-w-4xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse border border-orange-50">

                {/* Right Side: Branding (reversed row) */}
                <div className="md:w-1/2 bg-[#C97E45] p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <Link to="/" className="text-2xl font-bold font-[Outfit] flex items-center">
                            <Coffee className="mr-2 text-[#4A2C2A]" /> KRC! <span className="ml-1 text-[#4A2C2A]">Coffee</span>
                        </Link>
                        <div className="mt-20">
                            <h2 className="text-4xl font-bold font-[Outfit] leading-tight mb-4">
                                Start Your <br />
                                <span className="text-[#4A2C2A]">Flavored Journey</span>
                            </h2>
                            <div className="space-y-4 mt-8">
                                <div className="flex items-start space-x-3 bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                                    <Sparkles size={24} className="text-[#4A2C2A] flex-shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-[#4A2C2A]">Exclusive Rewards</h4>
                                        <p className="text-white/80 text-sm">Earn points on every cup and redeem for free treats.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                                    <ShieldCheck size={24} className="text-[#4A2C2A] flex-shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-[#4A2C2A]">Safe & Secure</h4>
                                        <p className="text-white/80 text-sm">Your data and payments are protected with 256-bit encryption.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-[#4A2C2A] opacity-10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-50px] left-[-50px] w-80 h-80 bg-white opacity-20 rounded-full blur-3xl"></div>
                </div>

                {/* Left Side: Form */}
                <div className="md:w-1/2 p-12 bg-white">
                    <div className="mb-10 text-center md:text-left">
                        <h3 className="text-2xl font-bold text-[#2C1810] mb-2 font-[Outfit]">Create Account</h3>
                        <p className="text-[#6D5E57]">Join our community of coffee lovers today.</p>
                        {error && <p className="mt-4 text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}
                        {success && <p className="mt-4 text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">{success}</p>}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#4A2C2A] ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Sunil Verma"
                                    className={`w-full pl-12 pr-4 py-3 bg-slate-50 border ${errors.name ? 'border-red-400' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] focus:bg-white transition-all outline-none text-[#2C1810]`}
                                />
                            </div>
                            {errors.name && <p className="text-xs text-red-500 ml-1">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#4A2C2A] ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="sunil@example.com"
                                    className={`w-full pl-12 pr-4 py-3 bg-slate-50 border ${errors.email ? 'border-red-400' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] focus:bg-white transition-all outline-none text-[#2C1810]`}
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#4A2C2A] ml-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+91 98765 43210"
                                    className={`w-full pl-12 pr-4 py-3 bg-slate-50 border ${errors.phone ? 'border-red-400' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] focus:bg-white transition-all outline-none text-[#2C1810]`}
                                />
                            </div>
                            {errors.phone && <p className="text-xs text-red-500 ml-1">{errors.phone}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#4A2C2A] ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Minimum 8 characters"
                                    className={`w-full pl-12 pr-4 py-3 bg-slate-50 border ${errors.password ? 'border-red-400' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] focus:bg-white transition-all outline-none text-[#2C1810]`}
                                />
                            </div>
                            {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password}</p>}
                        </div>

                        <div className="flex items-start ml-1 py-1">
                            <input type="checkbox" id="terms" className="mt-1 rounded border-slate-300 text-[#C97E45] focus:ring-[#C97E45]" required />
                            <label htmlFor="terms" className="ml-2 text-xs text-[#6D5E57] leading-relaxed">
                                I agree to the <span className="font-bold text-[#C97E45] cursor-pointer">Terms of Service</span> and <span className="font-bold text-[#C97E45] cursor-pointer">Privacy Policy</span>.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-[#C97E45] hover:bg-[#b06d3a] text-white py-4 rounded-2xl font-bold shadow-xl shadow-[#C97E45]/10 hover:shadow-2xl transition-all flex items-center justify-center group ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                            {!loading && <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-[#6D5E57]">
                        Already have an account? {' '}
                        <Link to="/login" className="font-bold text-[#4A2C2A] hover:underline">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
