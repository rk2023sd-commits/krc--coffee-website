import React, { useEffect } from 'react';
import { ShoppingBag, Heart, Trash2, ArrowRight, Coffee } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    const { addToCart } = useCart();
    const { wishlistItems, removeFromWishlist, fetchWishlist } = useWishlist();

    useEffect(() => {
        fetchWishlist();
    }, []);

    const moveToCart = (item) => {
        addToCart(item);
        removeFromWishlist(item._id);
    };



    if (wishlistItems.length === 0) {
        return (
            <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-orange-200 shadow-sm animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
                    <Heart size={40} className="fill-current" />
                </div>
                <h2 className="text-2xl font-bold text-[#4A2C2A] font-[Outfit] mb-2">Your Wishlist is Empty</h2>
                <p className="text-[#6D5E57] mb-8">Save items you love so you can come back to them later.</p>
                <Link to="/customer/shop" className="inline-block bg-[#4A2C2A] text-white px-10 py-3 rounded-full font-bold shadow-xl hover:translate-y-[-2px] transition-all">
                    Explore Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-[#4A2C2A] font-[Outfit]">My Wishlist</h1>
                    <p className="text-[#6D5E57]">Your personal collection of favorites.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl text-sm font-bold text-red-500 border border-red-100 flex items-center gap-2">
                    <Heart size={16} fill="currentColor" />
                    {wishlistItems.length} Items
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((item) => (
                    <div key={item._id} className="bg-white rounded-3xl p-5 shadow-sm border border-orange-50 group hover:shadow-xl transition-all duration-300">
                        <div className="relative h-48 bg-orange-50/50 rounded-2xl overflow-hidden mb-5 flex items-center justify-center">
                            {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <Coffee size={48} className="text-orange-200" />
                            )}
                            <button
                                onClick={() => removeFromWishlist(item._id)}
                                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                                title="Remove"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div>
                            <p className="text-xs font-bold text-[#C97E45] uppercase tracking-widest mb-1">{item.category}</p>
                            <h3 className="text-lg font-bold text-[#4A2C2A] mb-2 line-clamp-1">{item.name}</h3>
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-xl font-bold text-[#4A2C2A]">₹{item.price}</span>
                                <button
                                    onClick={() => moveToCart(item)}
                                    className="flex items-center gap-2 bg-[#4A2C2A] hover:bg-[#2C1810] text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:translate-y-[-2px]"
                                >
                                    <ShoppingBag size={16} />
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
