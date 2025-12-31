import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Info, Package, DollarSign, Tag, UploadCloud, X, Plus } from 'lucide-react';

const AddProduct = () => {
    const [categories, setCategories] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        isBestSeller: false
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/categories');
                const data = await res.json();
                if (data.success) {
                    setCategories(data.data);
                    // Set default category if available and not already set
                    if (data.data.length > 0 && !formData.category) {
                        setFormData(prev => ({ ...prev, category: data.data[0].name }));
                    }
                }
            } catch (err) {
                console.error('Failed to load categories');
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setPreviewUrl('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Use FormData for file upload
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('category', formData.category);
        data.append('stock', formData.stock);
        data.append('isBestSeller', formData.isBestSeller);
        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                // Content-Type header is not set manually for FormData, fetch does it automatically
                body: data,
            });

            const result = await response.json();

            if (response.ok) {
                setSuccess('Product added successfully!');
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    category: categories.length > 0 ? categories[0].name : '',
                    stock: '',
                    isBestSeller: false
                });
                setImageFile(null);
                setPreviewUrl('');
            } else {
                setError(result.message || 'Failed to add product');
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
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#4A2C2A]">Product Image</label>

                        {!previewUrl ? (
                            <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-[#C97E45] transition-colors">
                                    <UploadCloud size={48} className="mb-4" />
                                    <span className="font-semibold text-sm">Click to upload or drag and drop</span>
                                    <span className="text-xs mt-1">SVG, PNG, JPG or GIF (max. 5MB)</span>
                                </div>
                            </div>
                        ) : (
                            <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full h-64 object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="bg-white/90 p-3 rounded-full text-red-500 hover:bg-white hover:scale-110 transition-all font-bold"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>
                        )}
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
