import React, { useState, useEffect } from 'react';
import API_URL from '../../config';
import { Tag, Plus, Trash2, AlertCircle, CheckCircle2, Loader2, FolderTree } from 'lucide-react';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [newCategory, setNewCategory] = useState({
        name: '',
        description: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/categories`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setCategories(data.data);
            } else {
                setError(data.error || data.message || 'Failed to load categories');
            }
        } catch (err) {
            console.error(err);
            setError('Connection error. Please ensure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setError('');
        setSuccess('');

        if (!newCategory.name.trim()) {
            setError('Category name is required');
            setSubmitLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newCategory)
            });
            const data = await res.json();

            if (data.success) {
                setSuccess('Category added successfully!');
                setCategories([data.data, ...categories]); // Add to top
                setNewCategory({ name: '', description: '' });
            } else {
                setError(data.error || data.message || 'Failed to add category');
            }
        } catch (err) {
            console.error(err);
            setError('Something went wrong. check console.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setCategories(categories.filter(c => c._id !== id));
                setSuccess('Category deleted.');
            } else {
                alert(data.error || data.message || 'Failed to delete category');
            }
        } catch (err) {
            alert('Connection error');
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#2C1810] font-[Outfit]">Product Categories</h1>
                    <p className="text-[#6D5E57]">Manage the categories available for your products.</p>
                </div>
            </div>

            {error && (
                <div className="mb-6 flex items-center p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl">
                    <AlertCircle size={20} className="mr-2" />
                    <span className="font-medium text-sm">{error}</span>
                </div>
            )}

            {success && (
                <div className="mb-6 flex items-center p-4 bg-green-50 border border-green-100 text-green-600 rounded-2xl">
                    <CheckCircle2 size={20} className="mr-2" />
                    <span className="font-medium text-sm">{success}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 sticky top-24">
                        <div className="flex items-center space-x-2 text-[#4A2C2A] font-bold mb-6">
                            <Plus size={20} />
                            <span>Add New Category</span>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-[#4A2C2A] mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newCategory.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none transition-all"
                                    placeholder="e.g. Special Blends"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#4A2C2A] mb-1">Description</label>
                                <textarea
                                    name="description"
                                    rows="3"
                                    value={newCategory.description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none transition-all"
                                    placeholder="Optional description..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={submitLoading}
                                className="w-full bg-[#4A2C2A] hover:bg-[#2C1810] text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
                            >
                                {submitLoading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                                <span>Create Category</span>
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="animate-spin text-[#C97E45]" size={40} />
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="bg-white p-12 rounded-[2rem] text-center border border-dashed border-slate-200">
                            <FolderTree className="mx-auto text-slate-300 mb-4" size={48} />
                            <h3 className="text-xl font-bold text-slate-700">No Categories Yet</h3>
                            <p className="text-slate-500 mt-2">Create your first category using the form.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {categories.map((cat) => (
                                <div key={cat._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-[#4A2C2A] mb-1">{cat.name}</h3>
                                        <p className="text-sm text-slate-500 line-clamp-2">{cat.description || 'No description provided.'}</p>
                                        <div className="mt-4 inline-flex items-center px-3 py-1 bg-orange-50 text-[#C97E45] text-xs font-bold rounded-full">
                                            {cat.slug || cat.name.toLowerCase().replace(/ /g, '-')}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(cat._id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        title="Delete Category"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Categories;
