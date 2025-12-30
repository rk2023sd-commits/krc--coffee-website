import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Home, Briefcase, Loader2, AlertCircle } from 'lucide-react';

const Addresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        pincode: '',
        type: 'Home'
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/auth/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setAddresses(data.data.addresses || []);
            }
        } catch (err) {
            console.error("Failed to fetch addresses", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/users/address', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.success) {
                setAddresses(data.data); // data.data is the updated addresses array
                setShowForm(false);
                setFormData({
                    fullName: '',
                    phone: '',
                    address: '',
                    city: '',
                    pincode: '',
                    type: 'Home'
                });
            } else {
                setError(data.message || 'Failed to add address');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/users/address/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setAddresses(data.data);
            }
        } catch (err) {
            console.error("Failed to delete address", err);
        }
    };

    const getIcon = (type) => {
        return type === 'Work' ? <Briefcase size={20} /> : <Home size={20} />;
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-[#4A2C2A] font-[Outfit]">Saved Addresses</h1>
                    <p className="text-[#6D5E57]">Manage your shipping addresses for faster checkout.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-[#C97E45] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#B06A36] transition-all flex items-center gap-2 shadow-lg hover:translate-y-[-2px]"
                >
                    {showForm ? 'Cancel' : (
                        <>
                            <Plus size={20} /> Add New Address
                        </>
                    )}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-orange-100 animate-in fade-in zoom-in duration-300">
                    <h2 className="text-xl font-bold text-[#4A2C2A] mb-6">Add New Details</h2>
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2">
                            <AlertCircle size={20} /> {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text" name="fullName" placeholder="Full Name" required
                                value={formData.fullName} onChange={handleChange}
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none"
                            />
                            <input
                                type="tel" name="phone" placeholder="Phone Number" required
                                value={formData.phone} onChange={handleChange}
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none"
                            />
                        </div>
                        <textarea
                            name="address" placeholder="Address (House No, Building, Street, Area)" required
                            value={formData.address} onChange={handleChange}
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none"
                        ></textarea>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                                type="text" name="city" placeholder="City" required
                                value={formData.city} onChange={handleChange}
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none"
                            />
                            <input
                                type="text" name="pincode" placeholder="Pincode" required
                                value={formData.pincode} onChange={handleChange}
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none"
                            />
                            <select
                                name="type"
                                value={formData.type} onChange={handleChange}
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none"
                            >
                                <option value="Home">Home</option>
                                <option value="Work">Work</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={formLoading}
                                className="bg-[#4A2C2A] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#2C1810] transition-colors disabled:opacity-50"
                            >
                                {formLoading ? 'Saving...' : 'Save Address'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-[#C97E45]" size={40} />
                </div>
            ) : addresses.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-orange-200">
                    <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-[#C97E45] mx-auto mb-4">
                        <MapPin size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-[#4A2C2A] mb-2">No addresses saved</h3>
                    <p className="text-[#6D5E57]">Add an address to speed up your checkout process.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((addr) => (
                        <div key={addr._id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group hover:border-orange-200 hover:shadow-md transition-all relative">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${addr.type === 'Work' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                        {getIcon(addr.type)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#4A2C2A]">{addr.type}</h3>
                                        <p className="text-xs text-[#6D5E57] font-bold tracking-wider uppercase">{addr.fullName}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(addr._id)}
                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <div className="text-[#6D5E57] text-sm space-y-1 pl-13">
                                <p>{addr.address}</p>
                                <p>{addr.city} - {addr.pincode}</p>
                                <p className="pt-2 font-bold text-[#4A2C2A]">Phone: {addr.phone}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Addresses;
