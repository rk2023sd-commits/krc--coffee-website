import React, { useState, useEffect } from 'react';
import { Package, Search, Save, AlertCircle, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from 'lucide-react';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [updateStatus, setUpdateStatus] = useState({}); // { id: 'saving' | 'success' | 'error' }

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/products');
            const data = await res.json();
            if (data.success) {
                setProducts(data.data);
            }
        } catch (err) {
            console.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleStockChange = (id, newStock) => {
        setProducts(products.map(p =>
            p._id === id ? { ...p, stock: parseInt(newStock) || 0 } : p
        ));
    };

    const saveStock = async (id, newStock) => {
        setUpdateStatus({ ...updateStatus, [id]: 'saving' });

        try {
            const res = await fetch(`http://localhost:5000/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stock: newStock })
            });

            if (res.ok) {
                setUpdateStatus({ ...updateStatus, [id]: 'success' });
                // Clear success status after 2 seconds
                setTimeout(() => {
                    setUpdateStatus(prev => {
                        const next = { ...prev };
                        delete next[id];
                        return next;
                    });
                }, 2000);
            } else {
                setUpdateStatus({ ...updateStatus, [id]: 'error' });
            }
        } catch (err) {
            setUpdateStatus({ ...updateStatus, [id]: 'error' });
        }
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-600' };
        if (stock < 10) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-700' };
        return { label: 'In Stock', color: 'bg-green-100 text-green-700' };
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#2C1810] font-[Outfit]">Inventory Management</h1>
                <p className="text-[#6D5E57]">Track and update product stock levels.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Total Products</p>
                        <h3 className="text-3xl font-bold text-[#2C1810]">{products.length}</h3>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Package size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Low Stock Items</p>
                        <h3 className="text-3xl font-bold text-yellow-600">{products.filter(p => p.stock < 10 && p.stock > 0).length}</h3>
                    </div>
                    <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
                        <AlertTriangle size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Out of Stock</p>
                        <h3 className="text-3xl font-bold text-red-600">{products.filter(p => p.stock === 0).length}</h3>
                    </div>
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                        <TrendingDown size={24} />
                    </div>
                </div>
            </div>

            {/* Search and Table */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#FFF8E7] text-[#4A2C2A] font-bold text-sm uppercase tracking-wider">
                            <tr>
                                <th className="p-6">Product</th>
                                <th className="p-6">Category</th>
                                <th className="p-6">Unit Price</th>
                                <th className="p-6">Current Stock</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-6 text-center text-slate-500">Loading inventory...</td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-6 text-center text-slate-500">No products found.</td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => {
                                    const status = getStockStatus(product.stock);
                                    return (
                                        <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-6">
                                                <div className="flex items-center space-x-4">
                                                    <img
                                                        src={product.image || null}
                                                        alt={product.name}
                                                        className="w-12 h-12 rounded-lg object-cover bg-slate-200"
                                                    />
                                                    <div>
                                                        <p className="font-bold text-[#2C1810]">{product.name}</p>
                                                        <p className="text-xs text-slate-500">ID: {product._id.slice(-6)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className="px-3 py-1 bg-slate-100 rounded-full text-slate-600 text-xs font-bold">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="p-6 font-medium text-slate-700">₹{product.price}</td>
                                            <td className="p-6">
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="number"
                                                        value={product.stock}
                                                        onChange={(e) => handleStockChange(product._id, e.target.value)}
                                                        className="w-24 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none text-center font-bold"
                                                        min="0"
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.color}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right">
                                                <button
                                                    onClick={() => saveStock(product._id, product.stock)}
                                                    className="p-2 bg-[#4A2C2A] text-white rounded-lg hover:bg-[#2C1810] transition-colors relative group"
                                                    title="Save Stock"
                                                >
                                                    {updateStatus[product._id] === 'saving' ? (
                                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    ) : updateStatus[product._id] === 'success' ? (
                                                        <CheckCircle2 size={20} className="text-green-400" />
                                                    ) : updateStatus[product._id] === 'error' ? (
                                                        <AlertCircle size={20} className="text-red-400" />
                                                    ) : (
                                                        <Save size={20} />
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Inventory;
