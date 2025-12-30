import React, { useState } from 'react';
import { Package, DollarSign, Tag, Info, Image as ImageIcon, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

const AddProduct = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Coffee',
        stock: '',
        image: '',
        isBestSeller: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Product added successfully!');
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    category: 'Coffee',
                    stock: '',
                    image: '',
                    isBestSeller: false
                });
            } else {
                setError(data.message || 'Failed to add product');
            }
        } catch (err) {
            setError('Something went wrong. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#2C1810] font-[Outfit]">Add New Product</h1>
                <p className="text-[#6D5E57]">Create a new coffee blend or snack item for your shop.</p>
            </div>

            {error && (
                <div className="mb-6 flex items-center p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl animate-in fade-in slide-in-from-top-4">
                    <AlertCircle size={20} className="mr-2" />
                    <span className="font-medium text-sm">{error}</span>
                </div>
            )}

            {success && (
                <div className="mb-6 flex items-center p-4 bg-green-50 border border-green-100 text-green-600 rounded-2xl animate-in fade-in slide-in-from-top-4">
                    <CheckCircle2 size={20} className="mr-2" />
                    <span className="font-medium text-sm">{success}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
                    <div className="flex items-center space-x-2 text-[#4A2C2A] font-bold mb-2">
                        <Info size={18} />
                        <span>Basic Information</span>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#4A2C2A]">Product Name</label>
                        <div className="relative">
                            <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Espresso Gold"
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#4A2C2A]">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Describe the taste, aroma, and origin..."
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none transition-all"
                            required
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#4A2C2A]">Price (₹)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="299"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#4A2C2A]">Stock Qty</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="50"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none transition-all"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Categorization & Visuals */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6 h-fit">
                    <div className="flex items-center space-x-2 text-[#4A2C2A] font-bold mb-2">
                        <Tag size={18} />
                        <span>Category & Visuals</span>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#4A2C2A]">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none transition-all"
                        >
                            <option value="Coffee">Coffee</option>
                            <option value="Cold Coffee">Cold Coffee</option>
                            <option value="Snacks">Snacks</option>
                            <option value="Combos">Combos</option>
                            <option value="Gift Packs">Gift Packs</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#4A2C2A]">Image URL</label>
                        <div className="relative">
                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://unsplash.com/..."
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none transition-all"
                            />
                        </div>
                        <p className="text-[10px] text-slate-400 italic mt-1">Leave blank to use a default placeholder.</p>
                    </div>

                    <div className="flex items-center p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                        <input
                            type="checkbox"
                            id="isBestSeller"
                            name="isBestSeller"
                            checked={formData.isBestSeller}
                            onChange={handleChange}
                            className="w-5 h-5 rounded border-slate-300 text-[#C97E45] focus:ring-[#C97E45]"
                        />
                        <label htmlFor="isBestSeller" className="ml-3 text-sm font-bold text-[#4A2C2A] cursor-pointer">
                            Mark as Best Seller
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-[#4A2C2A] hover:bg-[#2C1810] text-white py-4 rounded-xl font-bold shadow-xl shadow-[#4A2C2A]/10 transition-all flex items-center justify-center space-x-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <span>Saving Product...</span>
                        ) : (
                            <>
                                <Plus size={20} />
                                <span>Add Product</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
