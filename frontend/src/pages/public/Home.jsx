import React, { useState, useEffect } from 'react';
import { ArrowRight, Coffee, Heart, Award, Sparkles, Loader2, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Home = () => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [bestSellers, setBestSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addedId, setAddedId] = useState(null);

    const handleAddToCart = (product) => {
        addToCart(product);
        setAddedId(product._id);
        setTimeout(() => setAddedId(null), 2000);
    };

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                const data = await response.json();
                if (response.ok) {
                    const filtered = data.data.filter(p => p.isBestSeller).slice(0, 4);
                    setBestSellers(filtered);
                }
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBestSellers();
    }, []);

    const features = [
        { icon: <Coffee className="text-[#C97E45]" size={32} />, title: "Premium Quality", desc: "Hand-picked beans from the finest estates." },
        { icon: <Award className="text-[#C97E45]" size={32} />, title: "Expertly Roasted", desc: "Our master roasters carefully roast each batch to perfection." },
        { icon: <Heart className="text-[#C97E45]" size={32} />, title: "Made with Love", desc: "From farm to cup, we pour our heart into every experience." }
    ];

    return (
        <div className="font-[Inter]">
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-between overflow-hidden bg-[#FDFBF7]">
                <div className="container mx-auto px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="space-y-6 ">
                        <span className="inline-block bg-[#F4E4D0] text-[#4A2C2A] px-4 py-1 rounded-full text-sm font-semibold tracking-wide">
                            PREMIUM COFFEE BLENDS
                        </span>
                        <h1 className="text-5xl md:text-7xl font-[Outfit] font-bold text-[#2C1810] leading-tight">
                            Wake Up to <br />
                            <span className="text-[#C97E45]">Perfect Morning</span>
                        </h1>
                        <p className="text-lg text-[#6D5E57] max-w-lg">
                            Experience the rich, aromatic goodness of our hand-picked coffee beans. Roasted to perfection for the ultimate coffee lover in you.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <Link to="/shop/all" className="inline-flex items-center bg-[#4A2C2A] text-white px-8 py-3 rounded-full text-lg shadow-xl hover:translate-y-[-2px] transition-transform font-bold">
                                Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                            <Link to="/about" className="inline-flex items-center px-8 py-3 rounded-full text-lg border-2 border-[#4A2C2A] text-[#4A2C2A] font-bold hover:bg-[#4A2C2A] hover:text-white transition-all">
                                Our Story
                            </Link>
                        </div>
                    </div>
                    <div className="relative hidden md:block flex justify-center">
                        <div className="absolute inset-0 bg-[#C97E45]/10 rounded-full blur-3xl transform scale-75"></div>
                        <img
                            src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80"
                            alt="Premium Coffee"
                            className="relative z-10 w-[80%] max-w-[6000px] mx-auto h-auto object-cover rounded-[30px] shadow-[0_20px_50px_rgba(44,24,16,0.4)] transform rotate-6 hover:rotate-0 transition-all duration-500 hover:scale-105"
                        />
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-1/3 h-full bg-[#faefe4] rounded-bl-[100px] -z-0"></div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="p-8 rounded-2xl bg-[#FFF8E7] hover:bg-[#FFEEC3] transition-colors text-center group cursor-pointer">
                                <div className="w-16 h-16 bg-[#fff] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform text-[#C97E45]">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 font-[Outfit]">{feature.title}</h3>
                                <p className="text-[#6D5E57]">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 bg-[#FDFBF7]">
                <div className="container mx-auto px-12">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold font-[Outfit] mb-4">Our Best Sellers</h2>
                        <p className="text-[#6D5E57]">Discover the favorites that our customers can't get enough of.</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-[#C97E45]" size={40} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {bestSellers.map((product) => (
                                <div key={product._id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all overflow-hidden group border border-[#eee]">
                                    <div className="h-64 bg-[#F9F9F9] relative overflow-hidden">
                                        <Link to={`/product/${product._id}`} className="block w-full h-full">
                                            <img
                                                src={product.image || null}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </Link>
                                        <button
                                            onClick={() => toggleWishlist(product)}
                                            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md cursor-pointer hover:scale-110 transition-all text-slate-400 hover:text-red-500"
                                        >
                                            <Heart size={18} className={isInWishlist(product._id) ? "fill-red-500 text-red-500" : ""} />
                                        </button>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-[#C97E45] text-xs font-bold tracking-wider mb-2 uppercase">{product.category}</p>
                                        <Link to={`/product/${product._id}`}>
                                            <h3 className="text-lg font-bold mb-2 font-[Outfit] group-hover:text-[#C97E45] transition-colors truncate">{product.name}</h3>
                                        </Link>
                                        <div className="flex justify-between items-center mt-4">
                                            <span className="text-xl font-bold text-[#2C1810]">₹{product.price}</span>
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${addedId === product._id ? 'bg-green-600 text-white' : 'bg-[#2C1810] text-white hover:bg-[#C97E45]'}`}
                                            >
                                                {addedId === product._id ? <CheckCircle2 size={16} /> : <ShoppingCart size={16} />}
                                                <span>{addedId === product._id ? 'Added' : 'Add'}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <Link to="/shop/all" className="inline-block px-8 py-3 rounded-full border-2 border-[#4A2C2A] text-[#4A2C2A] font-bold hover:bg-[#4A2C2A] hover:text-white transition-all">View All Products</Link>
                    </div>
                </div>
            </section>

            {/* From The Journal */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-12">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-4xl font-bold font-[Outfit] mb-4">From The Journal</h2>
                            <p className="text-[#6D5E57]">Stories, brewing guides, and news from the world of coffee.</p>
                        </div>
                        <Link to="/blog" className="hidden md:flex items-center text-[#C97E45] font-bold hover:translate-x-1 transition-transform">
                            Read All Stories <ArrowRight size={20} className="ml-2" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Link to="/blog" className="group relative h-80 rounded-[2rem] overflow-hidden cursor-pointer">
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors z-10"></div>
                            <img
                                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80"
                                alt="Coffee Brewing"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute bottom-0 left-0 p-8 z-20 text-white">
                                <span className="px-3 py-1 bg-[#C97E45] text-xs font-bold rounded-full uppercase tracking-wider mb-3 inline-block">Brewing Guide</span>
                                <h3 className="text-2xl font-bold font-[Outfit] mb-2 group-hover:text-orange-100 transition-colors">How to Brew the Perfect Pour-Over</h3>
                                <p className="text-white/80 text-sm line-clamp-2">Master the art of manual brewing with our step-by-step guide...</p>
                            </div>
                        </Link>
                        <Link to="/blog" className="group relative h-80 rounded-[2rem] overflow-hidden cursor-pointer">
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors z-10"></div>
                            <img
                                src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80"
                                alt="Coffee Beans"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute bottom-0 left-0 p-8 z-20 text-white">
                                <span className="px-3 py-1 bg-[#2C1810] text-xs font-bold rounded-full uppercase tracking-wider mb-3 inline-block">Origins</span>
                                <h3 className="text-2xl font-bold font-[Outfit] mb-2 group-hover:text-orange-100 transition-colors">The Journey of Your Coffee Bean</h3>
                                <p className="text-white/80 text-sm line-clamp-2">From the high-altitude estates of Coorg to your morning cup...</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
