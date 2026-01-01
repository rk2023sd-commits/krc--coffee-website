import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Filter, Loader2, Coffee, Search, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import toast from 'react-hot-toast';

const Shop = () => {
    const { category } = useParams();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [addedId, setAddedId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const isCustomer = location.pathname.startsWith('/customer');
    const productBase = isCustomer ? '/customer/product' : '/product';
    const shopBase = isCustomer ? '/customer/shop/all' : '/shop/all';

    const handleAddToCart = (product) => {
        addToCart(product);
        setAddedId(product._id);
        setTimeout(() => setAddedId(null), 2000);
    };

    const handleBuyNow = (product) => {
        const token = localStorage.getItem('token');
        // Do NOT add to cart for direct buy now
        // addToCart(product); 

        // Robust check for token existence
        if (!token || token === 'undefined' || token === 'null') {
            toast.error("Please login to proceed to checkout");
            // Pass the item in state so Login can forward it
            navigate('/login', { state: { from: '/checkout', buyNowItem: { ...product, quantity: 1 } } });
        } else {
            navigate(isCustomer ? '/customer/checkout' : '/checkout', { state: { buyNowItem: { ...product, quantity: 1 } } });
        }
    };

    // Standard search params handling in useEffect below

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5000/api/products');
                const data = await response.json();

                if (response.ok) {
                    let filtered = data.data;

                    // Logic to handle both path param :category and query param ?category
                    const queryParams = new URLSearchParams(window.location.search);
                    const queryCategory = queryParams.get('category');

                    const effectiveCategory = queryCategory || category;

                    if (effectiveCategory && effectiveCategory !== 'all') {
                        if (effectiveCategory === 'best-sellers') {
                            filtered = data.data.filter(p => p.isBestSeller);
                        } else if (effectiveCategory === 'new-arrivals') {
                            filtered = [...data.data].reverse().slice(0, 8);
                        } else {
                            filtered = data.data.filter(p => p.category.toLowerCase().replace(' ', '-') === effectiveCategory);
                        }
                    }
                    setProducts(filtered);
                }
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [category, location.search]);

    const filteredBySearch = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#FDFBF7] py-12">
            <div className="container mx-auto px-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-[#2C1810] font-[Outfit] mb-2 capitalize">
                            {/* Derive title from URL params or path params */}
                            {(() => {
                                const queryParams = new URLSearchParams(window.location.search);
                                const currentCategory = queryParams.get('category') || category;
                                if (currentCategory) return currentCategory.replace('-', ' ');
                                return 'Our Shop';
                            })()}
                        </h1>
                        <p className="text-[#6D5E57]">Premium coffee collections curated for you.</p>
                    </div>

                    <div className="flex items-center space-x-4 w-full md:w-auto">
                        <div className="relative flex-grow md:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none transition-all shadow-sm"
                            />
                        </div>
                        <button className="p-3 bg-white border border-slate-200 rounded-2xl text-[#4A2C2A] hover:bg-[#4A2C2A] hover:text-white transition-all shadow-sm">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <Loader2 className="animate-spin text-[#C97E45] mb-4" size={48} />
                        <p className="text-[#6D5E57] font-medium">Loading our finest brews...</p>
                    </div>
                ) : filteredBySearch.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <Coffee className="mx-auto text-slate-200 mb-4" size={64} />
                        <h2 className="text-2xl font-bold text-[#4A2C2A] mb-2">No Products Found</h2>
                        <p className="text-slate-500">Try searching for something else or browse all products.</p>
                        <Link to={shopBase} className="mt-8 inline-block bg-[#4A2C2A] text-white px-8 py-3 rounded-full font-bold">
                            Back to All Coffee
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredBySearch.map((product) => (
                            <div key={product._id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 group flex flex-col">
                                <div className="h-72 bg-slate-50 relative overflow-hidden flex-shrink-0">
                                    <Link to={`${productBase}/${product._id}`} className="block w-full h-full">
                                        <img
                                            src={product.image || null}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </Link>
                                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                                        <button
                                            onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
                                            className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-slate-400 hover:text-red-500 hover:scale-110 transition-all cursor-pointer z-10 relative"
                                        >
                                            <Heart size={18} className={isInWishlist(product._id) ? "fill-red-500 text-red-500" : ""} />
                                        </button>
                                    </div>
                                    {product.isBestSeller && (
                                        <div className="absolute top-4 left-4 bg-[#C97E45] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg pointer-events-none">
                                            Best Seller
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold text-[#C97E45] uppercase tracking-widest">{product.category}</span>
                                        <div className="flex items-center text-amber-500">
                                            <Star size={12} fill="currentColor" />
                                            <span className="text-[10px] font-bold ml-1">4.8</span>
                                        </div>
                                    </div>
                                    <Link to={`${productBase}/${product._id}`}>
                                        <h3 className="text-xl font-bold text-[#2C1810] mb-2 font-[Outfit] group-hover:text-[#C97E45] transition-colors">{product.name}</h3>
                                    </Link>
                                    <p className="text-sm text-[#6D5E57] line-clamp-2 mb-6 flex-grow">
                                        {product.description}
                                    </p>
                                    <div className="flex flex-col gap-3 pt-4 border-t border-slate-50 mt-auto">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-xs text-slate-400 block mb-0.5 font-medium">Price</span>
                                                <span className="text-2xl font-bold text-[#2C1810]">₹{product.price}</span>
                                            </div>
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className={`p-3 rounded-xl shadow-md transition-all ${addedId === product._id ? 'bg-green-600 text-white' : 'bg-slate-100 text-[#2C1810] hover:bg-[#2C1810] hover:text-white'}`}
                                                title="Add to Cart"
                                            >
                                                {addedId === product._id ? <CheckCircle2 size={20} /> : <ShoppingCart size={20} />}
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleBuyNow(product)}
                                            className="w-full py-3 rounded-xl bg-[#4A2C2A] text-white font-bold text-sm hover:bg-[#C97E45] transition-colors shadow-lg"
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
        </div>
    );
};

export default Shop;
