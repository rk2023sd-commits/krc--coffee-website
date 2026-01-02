import React, { useState } from 'react';
import API_URL from '../../config';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Coffee, Chrome, Facebook } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({ email: '', password: '' });

    const validate = () => {
        let tempErrors = {};
        if (!formData.email) tempErrors.email = "Email is required";
        if (!formData.password) tempErrors.password = "Password is required";

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

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Save token and user info (for now just localStorage)
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data));

                // Redirect based on role and prior location
                if (data.data.role === 'admin') {
                    navigate('/admin');
                } else {
                    let target = '/customer/dashboard';

                    if (location.state?.from) {
                        // Handle object or string in location.state.from
                        const fromPath = typeof location.state.from === 'string'
                            ? location.state.from
                            : (location.state.from.pathname || '/customer/dashboard');

                        // If coming from public checkout link, redirect to public checkout (which is now gated)
                        // OR if it's the specific buying flow
                        if (fromPath === '/checkout' || fromPath === '/customer/checkout') {
                            target = '/customer/checkout'; // Prefer customer checkout wrapper if logged in
                            // But actually standard /checkout works too if we want public look
                            // Let's stick to customer for better UX
                        } else {
                            target = fromPath;
                        }
                    }

                    // Pass the existing state (which contains buyNowItem) to the target
                    navigate(target, { replace: true, state: location.state });
                }
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        setLoading(true);
        // Simulate API call delay
        const loadingToast = toast.loading(`Connecting to ${provider}...`);

        setTimeout(() => {
            toast.dismiss(loadingToast);
            toast.success(`Successfully logged in with ${provider}!`);

            // Create dummy user data for simulation
            const dummyUser = {
                _id: 'social_user_123',
                name: `Test ${provider} User`,
                email: `user@${provider.toLowerCase()}.com`,
                role: 'costumer',
                token: 'dummy_social_token_' + Date.now()
            };

            // Save to localStorage
            localStorage.setItem('token', dummyUser.token);
            localStorage.setItem('user', JSON.stringify(dummyUser));

            setLoading(false);

            // Redirect logic
            let target = '/customer/dashboard';
            if (location.state?.from) {
                const fromPath = typeof location.state.from === 'string'
                    ? location.state.from
                    : (location.state.from.pathname || '/customer/dashboard');

                if (fromPath === '/checkout' || fromPath === '/customer/checkout') {
                    target = '/customer/checkout';
                } else {
                    target = fromPath;
                }
            }
            navigate(target, { replace: true, state: location.state });
        }, 1500);
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-[#FDFBF7]">
            <div className="max-w-4xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-orange-50">

                {/* Left Side: Illustration & Branding */}
                <div className="md:w-1/2 bg-[#4A2C2A] p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <Link to="/" className="text-2xl font-bold font-[Outfit] flex items-center">
                            <Coffee className="mr-2 text-[#C97E45]" /> KRC! <span className="ml-1 text-[#C97E45]">Coffee</span>
                        </Link>
                        <div className="mt-20">
                            <h2 className="text-4xl text-white font-bold font-[Outfit] leading-tight mb-4">
                                Welcome Back <br />
                                <span className="text-[#D4A574]">Coffee Lover!</span>
                            </h2>
                            <p className="text-orange-200/70 text-lg">
                                Sign in to continue your journey into the world of premium blends and exclusive offers.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 mt-8">
                        <div className="flex -space-x-3 mb-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#4A2C2A] bg-orange-200 flex items-center justify-center text-[#4A2C2A] text-xs font-bold">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-[#4A2C2A] bg-[#C97E45] flex items-center justify-center text-white text-xs font-bold">
                                +1k
                            </div>
                        </div>
                        <p className="text-sm text-orange-200/50 italic">Joined by thousands of coffee enthusiasts daily.</p>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-[#C97E45] opacity-10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-50px] right-[-50px] w-80 h-80 bg-white opacity-5 rounded-full blur-3xl"></div>
                </div>

                {/* Right Side: Form */}
                <div className="md:w-1/2 p-12 bg-white">
                    <div className="mb-10 text-center md:text-left">
                        <h3 className="text-2xl font-bold text-[#2C1810] mb-2 font-[Outfit]">Sign In</h3>
                        <p className="text-[#6D5E57]">Enter your details to access your account</p>
                        {error && <p className="mt-4 text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#4A2C2A] ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@example.com"
                                    className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border ${errors.email ? 'border-red-400' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] focus:bg-white transition-all outline-none text-[#2C1810]`}
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-semibold text-[#4A2C2A]">Password</label>
                                <Link to="/forgot-password" title="Coming Soon" className="text-xs font-bold text-[#C97E45] hover:underline">Forgot?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border ${errors.password ? 'border-red-400' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] focus:bg-white transition-all outline-none text-[#2C1810]`}
                                />
                            </div>
                            {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password}</p>}
                        </div>

                        <div className="flex items-center ml-1">
                            <input type="checkbox" id="remember" className="rounded border-slate-300 text-[#C97E45] focus:ring-[#C97E45]" />
                            <label htmlFor="remember" className="ml-2 text-sm text-[#6D5E57] cursor-pointer">Remember me</label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-[#4A2C2A] hover:bg-[#2C1810] text-white py-4 rounded-2xl font-bold shadow-xl shadow-[#4A2C2A]/10 hover:shadow-2xl transition-all flex items-center justify-center group overflow-hidden relative ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span className="relative z-10 flex items-center">
                                {loading ? 'Authenticating...' : 'Sign In'}
                                {!loading && <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />}
                            </span>
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative flex items-center mb-6">
                            <div className="flex-grow border-t border-slate-100"></div>
                            <span className="flex-shrink-0 mx-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Or continue with</span>
                            <div className="flex-grow border-t border-slate-100"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => handleSocialLogin('Google')} type="button" className="flex items-center justify-center space-x-2 py-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                                <Chrome size={18} className="text-slate-600" />
                                <span className="text-sm font-bold text-slate-600">Google</span>
                            </button>
                            <button onClick={() => handleSocialLogin('Facebook')} type="button" className="flex items-center justify-center space-x-2 py-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                                <Facebook size={18} className="text-blue-600" />
                                <span className="text-sm font-bold text-slate-600">Facebook</span>
                            </button>
                        </div>
                    </div>

                    <p className="mt-10 text-center text-sm text-[#6D5E57]">
                        Don't have an account? {' '}
                        <Link to="/register" className="font-bold text-[#C97E45] hover:underline">Join KRC! Coffee</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
