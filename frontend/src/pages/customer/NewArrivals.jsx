import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Star, Loader2, Coffee, CheckCircle2, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const NewArrivals = () => {
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
                const response = await fetch(`${API_URL}/api/products`);
                const data = await response.json();

                if (response.ok) {
                    // Filter: Last 8 added products (Simulated by reversing list for now as IDs/dates usually imply order)
                    // In a real app, backend should support ?sort=-createdAt
                    const newArrivals = [...data.data].reverse().slice(0, 8);
                    setProducts(newArrivals);
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
            <div className="bg-gradient-to-r from-[#2C1810] to-[#4A2C2A] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="text-amber-400" />
                        <span className="text-amber-400 font-bold uppercase tracking-widest text-sm">Just Landed</span>
                    </div>
                    <h1 className="text-4xl text-white font-bold font-[Outfit] mb-4">New Arrivals</h1>
                    <p className="text-orange-100/80">Discover our latest coffee blends, freshly roasted and ready to brew. Be the first to taste perfection.</p>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/5 to-transparent"></div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-[#C97E45] mb-4" size={48} />
                    <p className="text-[#6D5E57] font-medium">Unpacking fresh beans...</p>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-orange-200">
                    <p className="text-slate-500">No new arrivals at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <div key={product._id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-orange-50 group flex flex-col">
                            <div className="h-64 bg-slate-50 relative overflow-hidden flex-shrink-0">
                                <img
                                    src={product.image || null}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                                    New
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
                                        <span className="text-[10px] font-bold ml-1">New</span>
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

export default NewArrivals;
