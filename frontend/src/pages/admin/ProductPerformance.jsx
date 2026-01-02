import React, { useState, useEffect } from 'react';
import API_URL from '../../config';
import { Package, TrendingUp, RefreshCw, Star } from 'lucide-react';

const ProductPerformance = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPerformance();
    }, []);

    const fetchPerformance = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/reports/performance`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (data.success) {
                setProducts(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch performance report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#2C1810] font-[Outfit]">Product Performance</h1>
                    <p className="text-[#6D5E57]">See which products are your best sellers.</p>
                </div>
                <button onClick={fetchPerformance} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <RefreshCw size={20} className="text-slate-600" />
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20">Loading...</div>
            ) : products.length === 0 ? (
                <div className="bg-white p-16 rounded-[2rem] text-center border border-dashed border-slate-200">
                    <Package className="mx-auto text-slate-300 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-slate-700">No data found</h3>
                    <p className="text-slate-500 mt-2">Sales data is needed to generate performance reports.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Top Performer Highlight */}
                    {products.length > 0 && (
                        <div className="bg-gradient-to-r from-[#C97E45] to-[#B36830] p-8 rounded-3xl text-white shadow-lg flex items-center justify-between">
                            <div>
                                <div className="inline-flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full mb-4">
                                    <Star size={16} className="text-yellow-300 fill-yellow-300" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Top Selling Product</span>
                                </div>
                                <h2 className="text-3xl font-bold mb-1">{products[0].name}</h2>
                                <p className="text-white/80">
                                    {products[0].quantitySold} units sold • ₹{products[0].revenueGenerated.toLocaleString()} revenue
                                </p>
                            </div>
                            <Package size={64} className="text-white/20" />
                        </div>
                    )}

                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#FFF8E7] text-[#4A2C2A] font-bold text-sm uppercase tracking-wider">
                                    <tr>
                                        <th className="p-6">Product Name</th>
                                        <th className="p-6">Units Sold</th>
                                        <th className="p-6">Total Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {products.map((product, index) => (
                                        <tr key={index} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-6 font-bold text-[#2C1810]">
                                                {product.name}
                                            </td>
                                            <td className="p-6 text-slate-600">
                                                {product.quantitySold}
                                            </td>
                                            <td className="p-6 text-[#2C1810] font-bold">
                                                ₹{product.revenueGenerated.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductPerformance;
