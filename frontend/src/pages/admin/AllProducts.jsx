import React, { useState, useEffect } from 'react';
import { Package, Trash2, Edit, ExternalLink, Search, Filter, Loader2, AlertCircle } from 'lucide-react';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/products');
            const data = await response.json();
            if (response.ok) {
                setProducts(data.data);
            } else {
                setError('Failed to load products');
            }
        } catch (err) {
            setError('Could not connect to the server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const search = queryParams.get('search');
        if (search) {
            setSearchTerm(search);
        }
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        // if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`http://localhost:5000/api/products/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setProducts(products.filter(p => p._id !== id));
            } else {
                alert('Delete failed');
            }
        } catch (err) {
            alert('Error deleting product');
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#2C1810] font-[Outfit]">Product Inventory</h1>
                    <p className="text-[#6D5E57]">Total {products.length} active products in your shop.</p>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none transition-all w-64"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="animate-spin text-[#C97E45]" size={40} />
                    <p className="text-slate-500 font-medium">Brewing your product list...</p>
                </div>
            ) : error ? (
                <div className="p-8 bg-red-50 border border-red-100 rounded-3xl text-center">
                    <AlertCircle className="mx-auto text-red-500 mb-4" size={40} />
                    <h3 className="text-red-800 font-bold text-lg mb-2">Error Loading Data</h3>
                    <p className="text-red-600 mb-6">{error}</p>
                    <button onClick={fetchProducts} className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold">Try Again</button>
                </div>
            ) : products.length === 0 ? (
                <div className="p-20 bg-white rounded-[2rem] border border-dashed border-slate-200 text-center">
                    <Package className="mx-auto text-slate-300 mb-4" size={60} />
                    <h3 className="text-xl font-bold text-[#4A2C2A] mb-2">No Products Found</h3>
                    <p className="text-slate-500 mb-8">Start by adding your first coffee blend to the shop.</p>
                    <a href="/admin/products/add" className="bg-[#4A2C2A] text-white px-8 py-3 rounded-xl font-bold inline-flex items-center">
                        Add Product Now
                    </a>
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-5 text-sm font-bold text-[#4A2C2A]">Product</th>
                                <th className="px-6 py-5 text-sm font-bold text-[#4A2C2A]">Category</th>
                                <th className="px-6 py-5 text-sm font-bold text-[#4A2C2A]">Price</th>
                                <th className="px-6 py-5 text-sm font-bold text-[#4A2C2A]">Stock</th>
                                <th className="px-6 py-5 text-sm font-bold text-[#4A2C2A]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredProducts.map((product) => (
                                <tr key={product._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100">
                                                <img src={product.image || null} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-[#2C1810]">{product.name}</div>
                                                <div className="text-xs text-[#C97E45] font-medium uppercase tracking-wider">
                                                    {product.isBestSeller && 'Best Seller'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-orange-50 text-[#C97E45] rounded-full text-xs font-bold border border-orange-100">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-[#2C1810]">
                                        ₹{product.price}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            <span className="font-medium">{product.stock} units</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <a href={`/admin/products/edit/${product._id}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                                                <Edit size={18} />
                                            </a>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            <a href="/shop/all" target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-[#C97E45] hover:bg-orange-50 rounded-lg transition-all" title="View in Shop">
                                                <ExternalLink size={18} />
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AllProducts;
