import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Loader2, Save, X, Check, MapPin, ChevronRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // Form States
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    // Email Update States
    const [showEmailUpdate, setShowEmailUpdate] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/users/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setUser(data.data);
                setName(data.data.name);
                setPhone(data.data.phone || '');
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, phone })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Profile updated successfully');
                setUser(prev => ({ ...prev, name, phone }));
                // Update local storage user data as well
                const localUser = JSON.parse(localStorage.getItem('user'));
                if (localUser) {
                    localStorage.setItem('user', JSON.stringify({ ...localUser, name, phone }));
                }
            } else {
                toast.error(data.message || 'Update failed');
            }
        } catch (err) {
            toast.error('Connection error');
        } finally {
            setUpdating(false);
        }
    };

    const handleSendOtp = async () => {
        if (!newEmail) return toast.error('Please enter new email');
        if (newEmail === user.email) return toast.error('Please enter a different email');

        setEmailLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/send-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: newEmail })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('OTP sent to ' + newEmail);
                setOtpSent(true);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error('Failed to send OTP');
        } finally {
            setEmailLoading(false);
        }
    };

    const handleVerifyEmail = async () => {
        if (!otp) return toast.error('Please enter OTP');

        setEmailLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/auth/verify-email-change', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email: newEmail, otp })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Email updated successfully');
                setUser(prev => ({ ...prev, email: newEmail }));
                // Update local storage
                const localUser = JSON.parse(localStorage.getItem('user'));
                if (localUser) {
                    localStorage.setItem('user', JSON.stringify({ ...localUser, email: newEmail }));
                }
                setShowEmailUpdate(false);
                setNewEmail('');
                setOtp('');
                setOtpSent(false);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error('Verification failed');
        } finally {
            setEmailLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#C97E45]" size={40} /></div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-[#4A2C2A] font-[Outfit]">My Profile</h1>
                <p className="text-[#6D5E57]">Manage your personal information and account security.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Basic Info Form */}
                <div className="md:col-span-2 space-y-6">
                    {/* Personal Details Card */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-orange-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-[#4A2C2A] flex items-center gap-2">
                                <User className="text-[#C97E45]" size={20} /> Personal Details
                            </h2>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#4A2C2A] ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#4A2C2A] ml-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Add phone number"
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="bg-[#4A2C2A] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#2C1810] transition-all flex items-center gap-2 shadow-lg disabled:opacity-70"
                                >
                                    {updating ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Email & Security Card */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-orange-100">
                        <h2 className="text-xl font-bold text-[#4A2C2A] flex items-center gap-2 mb-6">
                            <ShieldCheck className="text-[#C97E45]" size={20} /> Login & Security
                        </h2>

                        <div className="space-y-6">
                            <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-[#4A2C2A] flex items-center gap-2">
                                            Email Address
                                            <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Verified</span>
                                        </label>
                                        <p className="text-[#6D5E57] font-medium">{user?.email}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowEmailUpdate(!showEmailUpdate)}
                                        className="text-[#C97E45] text-sm font-bold hover:underline"
                                    >
                                        Change
                                    </button>
                                </div>

                                {/* Email Update Form */}
                                {showEmailUpdate && (
                                    <div className="mt-6 pt-6 border-t border-orange-200/50 animate-in fade-in slide-in-from-top-2">
                                        {!otpSent ? (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-[#4A2C2A]">New Email Address</label>
                                                    <div className="flex gap-3">
                                                        <div className="relative flex-grow">
                                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                            <input
                                                                type="email"
                                                                value={newEmail}
                                                                onChange={(e) => setNewEmail(e.target.value)}
                                                                placeholder="Enter new email"
                                                                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none"
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={handleSendOtp}
                                                            disabled={!newEmail || emailLoading}
                                                            className="bg-[#C97E45] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#B06A36] transition-colors whitespace-nowrap disabled:opacity-50"
                                                        >
                                                            {emailLoading ? <Loader2 className="animate-spin" /> : 'Send OTP'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg text-sm mb-2">
                                                    <AlertCircle size={16} /> OTP sent to {newEmail}
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-[#4A2C2A]">Enter Verification Code</label>
                                                    <div className="flex gap-3">
                                                        <input
                                                            type="text"
                                                            value={otp}
                                                            onChange={(e) => setOtp(e.target.value)}
                                                            placeholder="6-digit code"
                                                            className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none tracking-widest text-center font-bold text-lg"
                                                            maxLength={6}
                                                        />
                                                        <button
                                                            onClick={handleVerifyEmail}
                                                            disabled={!otp || emailLoading}
                                                            className="bg-[#4A2C2A] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2C1810] transition-colors whitespace-nowrap disabled:opacity-50"
                                                        >
                                                            {emailLoading ? <Loader2 className="animate-spin" /> : 'Verify & Update'}
                                                        </button>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setOtpSent(false)}
                                                    className="text-xs text-[#6D5E57] hover:text-[#C97E45] underline"
                                                >
                                                    Change email address
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Quick Links */}
                <div className="space-y-6">
                    <div className="bg-[#4A2C2A] p-8 rounded-[2rem] text-white text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-[#C97E45] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 border-4 border-[#3a2220]">
                                {user?.name?.charAt(0)}
                            </div>
                            <h3 className="text-xl font-bold font-[Outfit]">{user?.name}</h3>
                            <p className="text-white/60 text-sm mb-6">Member since {new Date(user?.createdAt).getFullYear()}</p>

                            <div className="bg-[#3a2220] rounded-xl p-4">
                                <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Reward Points</p>
                                <p className="text-2xl font-bold text-[#D4A574]">{user?.rewardPoints || 0}</p>
                            </div>
                        </div>
                        {/* Deco */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C97E45] opacity-20 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#C97E45] opacity-20 rounded-full blur-2xl transform -translate-x-10 translate-y-10"></div>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-orange-100">
                        <h3 className="font-bold text-[#4A2C2A] mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <Link to="/customer/addresses" className="flex items-center justify-between p-3 hover:bg-orange-50 rounded-xl group transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 text-[#C97E45] flex items-center justify-center">
                                        <MapPin size={16} />
                                    </div>
                                    <span className="text-[#6D5E57] font-medium group-hover:text-[#4A2C2A]">Manage Addresses</span>
                                </div>
                                <ChevronRight size={16} className="text-slate-300 group-hover:text-[#C97E45]" />
                            </Link>
                            <Link to="/customer/security" className="flex items-center justify-between p-3 hover:bg-orange-50 rounded-xl group transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 text-[#C97E45] flex items-center justify-center">
                                        <ShieldCheck size={16} />
                                    </div>
                                    <span className="text-[#6D5E57] font-medium group-hover:text-[#4A2C2A]">Change Password</span>
                                </div>
                                <ChevronRight size={16} className="text-slate-300 group-hover:text-[#C97E45]" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
