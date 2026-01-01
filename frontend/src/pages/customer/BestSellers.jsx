import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Star, Loader2, Trophy, CheckCircle2, TrendingUp } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const BestSellers = () => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addedId, setAddedId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleAddToCart = (product) => {
        addToCart(product);
        setAddedId(product._id);
        setTimeout(() => setAddedId(null), 2000);
    };

    const handleBuyNow = (product) => {
        const token = localStorage.getItem('token');
        // addToCart(product);

        if (!token || token === 'undefined' || token === 'null') {
            toast.error("Please login to proceed to checkout");
            navigate('/login', { state: { from: '/customer/checkout', buyNowItem: { ...product, quantity: 1 } } });
        } else {
            navigate('/customer/checkout', { state: { buyNowItem: { ...product, quantity: 1 } } });
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5000/api/products');
                const data = await response.json();

                if (response.ok) {
                    // Filter: isBestSeller === true
                    const bestSellers = data.data.filter(p => p.isBestSeller);
                    setProducts(bestSellers);
                }
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Header / Banner */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="text-white" />
                        <span className="text-white/80 font-bold uppercase tracking-widest text-sm">Customer Favorites</span>
                    </div>
                    <h1 className="text-4xl font-bold font-[Outfit] mb-4">Best Sellers</h1>
                    <p className="text-orange-50">Tried, tasted, and loved by thousands. You can't go wrong with these crowd favorites.</p>
                </div>
                {/* Gold Trophy Icon Effect */}
                <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-20 rotate-12">
                    <Trophy size={180} />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-[#C97E45] mb-4" size={48} />
                    <p className="text-[#6D5E57] font-medium">Loading favorites...</p>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-orange-200">
                    <p className="text-slate-500">No best sellers curated yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <div key={product._id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-orange-50 group ring-1 ring-amber-100 flex flex-col">
                            <div className="h-64 bg-slate-50 relative overflow-hidden flex-shrink-0">
                                <img
                                    src={product.image || null}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-1">
                                    <Star size={10} fill="currentColor" /> Best Seller
                                </div>
                                <button
                                    onClick={() => toggleWishlist(product)}
                                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-slate-400 hover:text-red-500 hover:scale-110 transition-all"
                                >
                                    <Heart size={18} className={isInWishlist(product._id) ? "fill-red-500 text-red-500" : ""} />
                                </button>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-bold text-[#C97E45] uppercase tracking-widest">{product.category}</span>
                                    <div className="flex items-center text-amber-500">
                                        <Star size={12} fill="currentColor" />
                                        <span className="text-[10px] font-bold ml-1">5.0</span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-[#2C1810] mb-2 font-[Outfit] group-hover:text-[#C97E45] transition-colors line-clamp-1">{product.name}</h3>
                                <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-slate-50">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-bold text-[#2C1810]">₹{product.price}</span>
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className={`flex items-center space-x-2 px-3 py-2 rounded-xl shadow-lg transition-all ${addedId === product._id ? 'bg-green-600 text-white' : 'bg-[#4A2C2A] text-white hover:bg-[#2C1810]'}`}
                                            title="Add to Cart"
                                        >
                                            {addedId === product._id ? <CheckCircle2 size={16} /> : <ShoppingCart size={16} />}
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleBuyNow(product)}
                                        className="w-full py-2.5 rounded-xl bg-[#4A2C2A] text-white font-bold text-sm hover:bg-[#C97E45] transition-colors shadow-lg"
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BestSellers;
