import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import {
    ShoppingBag, Star, Heart, ArrowLeft, Plus, Minus,
    Share2, Truck, ShieldCheck, Clock, Coffee, CheckCircle2
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import toast from 'react-hot-toast';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const isCustomer = location.pathname.startsWith('/customer');
    const shopAllLink = isCustomer ? '/customer/shop/all' : '/shop/all';
    const homeLink = isCustomer ? '/customer/home' : '/';

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewError, setReviewError] = useState('');

    const fetchReviews = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/products/${id}/reviews`);
            const data = await res.json();
            if (data.success) {
                setReviews(data.data);
            }
        } catch (e) {
            console.error("Failed to fetch reviews", e);
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:5000/api/products/${id}`);
                const data = await response.json();
                if (data.success) {
                    setProduct(data.data);
                } else {
                    navigate(shopAllLink);
                }
            } catch (err) {
                console.error(err);
                navigate(shopAllLink);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
        fetchReviews();
    }, [id, navigate, shopAllLink]);

    const handleAddToCart = () => {
        if (!product) return;
        addToCart({ ...product, quantity });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleBuyNow = () => {
        if (!product) return;
        const token = localStorage.getItem('token');

        if (!token || token === 'undefined' || token === 'null') {
            toast.error("Please login to proceed to checkout");
            navigate('/login', { state: { from: '/checkout', buyNowItem: { ...product, quantity } } });
        } else {
            // Navigate immediately to checkout
            navigate(isCustomer ? '/customer/checkout' : '/checkout', { state: { buyNowItem: { ...product, quantity } } });
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setSubmittingReview(true);
        setReviewError('');

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/products/${id}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newReview)
            });
            const data = await res.json();

            if (res.ok) {
                setNewReview({ rating: 5, comment: '' });
                fetchReviews();
                // Optionally refresh product to get new avg rating
                const pRes = await fetch(`http://localhost:5000/api/products/${id}`);
                const pData = await pRes.json();
                if (pData.success) setProduct(pData.data);
            } else {
                setReviewError(data.message || 'Failed to submit review');
            }
        } catch (err) {
            console.error(err);
            setReviewError('Something went wrong');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-[#C97E45] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="min-h-screen bg-[#FDFBF7] py-12 font-[Inter]">
            <div className="container mx-auto px-20 max-w-6xl">
                {/* Breadcrumbs & Back */}
                <div className="flex items-center justify-between mb-8">
                    <Link to={shopAllLink} className="flex items-center text-[#6D5E57] hover:text-[#C97E45] transition-colors font-medium">
                        <ArrowLeft size={20} className="mr-2" /> Back to Shop
                    </Link>
                    <div className="flex items-center space-x-2 text-sm text-[#6D5E57]">
                        <Link to={homeLink} className="hover:text-[#4A2C2A]">Home</Link>
                        <span>/</span>
                        <Link to={shopAllLink} className="hover:text-[#4A2C2A]">Shop</Link>
                        <span>/</span>
                        <span className="text-[#C97E45] font-bold">{product.name}</span>
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Left: Image Section */}
                        <div className="relative h-[500px] md:h-auto bg-[#F8F5F2] p-8 flex items-center justify-center group">
                            <div className="absolute top-8 left-8 z-10">
                                {product.isBestSeller && (
                                    <span className="bg-[#C97E45] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                                        Best Seller
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => toggleWishlist(product)}
                                className={`absolute top-8 right-8 z-10 p-3 rounded-full bg-white shadow-lg transition-transform hover:scale-110 ${isInWishlist(product._id) ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
                            >
                                <Heart size={20} className={isInWishlist(product._id) ? "fill-current" : ""} />
                            </button>

                            <img
                                src={product.image || 'https://images.unsplash.com/photo-1559496417-e7f25cb244f3?auto=format&fit=crop&q=80&w=800'}
                                alt={product.name}
                                className="w-4/5 max-h-[80%] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                        </div>

                        {/* Right: Details Section */}
                        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                            <div className="flex items-start justify-between mb-4">
                                <span className="text-[#C97E45] font-bold uppercase tracking-widest text-xs bg-orange-50 px-3 py-1 rounded-lg">
                                    {product.category}
                                </span>
                                <div className="flex items-center text-amber-500 bg-amber-50 px-3 py-1 rounded-full">
                                    <Star size={14} fill="currentColor" />
                                    <span className="ml-1 text-sm font-bold">{product.averageRating ? product.averageRating.toFixed(1) : 'New'}</span>
                                    <span className="ml-1 text-xs text-amber-400 font-normal">({product.numReviews} reviews)</span>
                                </div>
                            </div>

                            <h1 className="text-4xl lg:text-5xl font-bold text-[#2C1810] font-[Outfit] mb-4 leading-tight">
                                {product.name}
                            </h1>

                            <div className="flex items-baseline space-x-4 mb-8">
                                <span className="text-3xl font-bold text-[#4A2C2A]">₹{product.price}</span>
                                <span className="text-lg text-slate-400 line-through">₹{Math.floor(product.price * 1.2)}</span>
                                <span className="text-green-600 font-bold text-sm bg-green-50 px-2 py-0.5 rounded">20% OFF</span>
                            </div>

                            {/* Quantity & Actions */}
                            <div className="flex flex-col gap-6 mb-10">
                                <div className="flex flex-col sm:flex-row gap-6">
                                    <div className="flex items-center bg-[#F8F5F2] rounded-2xl p-1 w-fit">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="p-3 hover:bg-white rounded-xl transition-all shadow-sm text-[#4A2C2A]"
                                        >
                                            <Minus size={20} />
                                        </button>
                                        <span className="w-12 text-center font-bold text-lg text-[#2C1810]">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="p-3 hover:bg-white rounded-xl transition-all shadow-sm text-[#4A2C2A]"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleAddToCart}
                                        className={`flex-1 flex items-center justify-center space-x-3 py-4 px-8 rounded-2xl font-bold text-lg shadow-xl shadow-[#4A2C2A]/20 transition-all transform hover:-translate-y-1 ${added ? 'bg-green-600 text-white' : 'bg-[#4A2C2A] text-white hover:bg-[#2C1810]'
                                            }`}
                                    >
                                        {added ? <CheckCircle2 size={24} /> : <ShoppingBag size={24} />}
                                        <span>{added ? 'Added to Cart' : 'Add to Cart'}</span>
                                    </button>
                                </div>
                                <button
                                    onClick={handleBuyNow}
                                    className="w-full py-4 rounded-2xl bg-[#2C1810] text-white font-bold text-lg shadow-xl hover:bg-[#C97E45] transition-all"
                                >
                                    Buy Now
                                </button>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-2 gap-4 mb-10">
                                <div className="flex items-center space-x-3 text-sm text-[#6D5E57]">
                                    <div className="p-2 bg-orange-50 rounded-full text-[#C97E45]"><Truck size={16} /></div>
                                    <span>Free Delivery</span>
                                </div>
                                <div className="flex items-center space-x-3 text-sm text-[#6D5E57]">
                                    <div className="p-2 bg-green-50 rounded-full text-green-600"><ShieldCheck size={16} /></div>
                                    <span>Secure Payment</span>
                                </div>
                                <div className="flex items-center space-x-3 text-sm text-[#6D5E57]">
                                    <div className="p-2 bg-blue-50 rounded-full text-blue-600"><Clock size={16} /></div>
                                    <span>Fast Shipping</span>
                                </div>
                                <div className="flex items-center space-x-3 text-sm text-[#6D5E57]">
                                    <div className="p-2 bg-[#4A2C2A]/10 rounded-full text-[#4A2C2A]"><Coffee size={16} /></div>
                                    <span>Premium Roast</span>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="border-t border-slate-100 pt-8">
                                <div className="flex space-x-8 mb-6 border-b border-slate-100">
                                    {['description', 'details', 'reviews'].map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === tab ? 'text-[#C97E45]' : 'text-slate-400 hover:text-[#4A2C2A]'
                                                }`}
                                        >
                                            {tab === 'description' ? 'Description' : tab === 'details' ? 'Details' : `Reviews (${reviews.length})`}
                                            {activeTab === tab && (
                                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C97E45] rounded-full"></span>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <div className="min-h-[100px] text-[#6D5E57] leading-relaxed">
                                    {activeTab === 'description' && <p>{product.description}</p>}
                                    {activeTab === 'details' && (
                                        <ul className="space-y-2">
                                            <li className="flex items-center space-x-2">
                                                <span className="w-2 h-2 bg-[#C97E45] rounded-full"></span>
                                                <span><strong>Roast Level:</strong> Medium-Dark</span>
                                            </li>
                                            <li className="flex items-center space-x-2">
                                                <span className="w-2 h-2 bg-[#C97E45] rounded-full"></span>
                                                <span><strong>Ingredients:</strong> 100% Arabica Coffee</span>
                                            </li>
                                        </ul>
                                    )}
                                    {activeTab === 'reviews' && (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                                            {/* Reviews List */}
                                            {reviews.length === 0 ? (
                                                <p className="italic text-slate-400">No reviews yet. Be the first to review!</p>
                                            ) : (
                                                <div className="space-y-6">
                                                    {reviews.map(review => (
                                                        <div key={review._id} className="bg-slate-50 p-6 rounded-2xl">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div>
                                                                    <p className="font-bold text-[#2C1810]">{review.user?.name || 'Anonymous'}</p>
                                                                    <div className="flex text-amber-500 text-xs my-1">
                                                                        {[...Array(5)].map((_, i) => (
                                                                            <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-slate-300"} />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <span className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                            <p className="text-sm text-[#6D5E57]">{review.comment}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Add Review Form */}
                                            {localStorage.getItem('token') ? (
                                                <div className="bg-white border-t border-slate-100 pt-6 mt-6">
                                                    <h3 className="text-lg font-bold text-[#2C1810] mb-4">Write a Review</h3>
                                                    {reviewError && <p className="text-red-500 text-sm mb-3">{reviewError}</p>}
                                                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                                                        <div>
                                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Rating</label>
                                                            <div className="flex space-x-2">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <button
                                                                        key={star}
                                                                        type="button"
                                                                        onClick={() => setNewReview({ ...newReview, rating: star })}
                                                                        className={`p-1 transition-transform hover:scale-110 ${newReview.rating >= star ? 'text-amber-500' : 'text-slate-300'}`}
                                                                    >
                                                                        <Star size={24} fill="currentColor" />
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Comment</label>
                                                            <textarea
                                                                rows="3"
                                                                value={newReview.comment}
                                                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                                                className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#C97E45]/20 outline-none resize-none"
                                                                placeholder="How was the coffee?"
                                                                required
                                                            ></textarea>
                                                        </div>
                                                        <button
                                                            type="submit"
                                                            disabled={submittingReview}
                                                            className="px-6 py-2 bg-[#2C1810] text-white rounded-xl font-bold text-sm hover:bg-[#C97E45] transition-colors disabled:opacity-50"
                                                        >
                                                            {submittingReview ? 'Submitting...' : 'Submit Review'}
                                                        </button>
                                                    </form>
                                                </div>
                                            ) : (
                                                <div className="bg-orange-50 p-4 rounded-xl text-center">
                                                    <p className="text-sm text-[#6D5E57] mb-2">Please login to write a review.</p>
                                                    <Link to="/login" className="text-xs font-bold text-[#C97E45] hover:underline">Login Now</Link>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
