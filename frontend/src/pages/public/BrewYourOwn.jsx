import React, { useState, useEffect } from 'react';
import API_URL from '../../config';
import {
    Coffee, Check, ArrowRight, ArrowLeft, Droplets,
    CupSoda, Crown, ShoppingBag, RotateCcw, Sparkles
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const BrewYourOwn = () => {
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Coffee Configuration State
    const [config, setConfig] = useState({
        base: null,
        size: 'Medium',
        milk: 'Full Cream',
        syrup: 'No Sugar',
        toppings: [],
        intensity: 'Medium'
    });

    // Available Options
    const bases = [
        { id: 'espresso', name: 'Espresso', desc: 'Strong & Concentrated', price: 150, color: '#4A2C2A' },
        { id: 'americano', name: 'Americano', desc: 'Hot Water & Espresso', price: 180, color: '#6F4E37' },
        { id: 'latte', name: 'Latte', desc: 'Steamed Milk & Foam', price: 220, color: '#C97E45' },
        { id: 'cappuccino', name: 'Cappuccino', desc: 'Foamy & Rich', price: 220, color: '#A67B5B' },
    ];

    const sizes = [
        { id: 'Small', label: 'Small', icon: 'S', multiplier: 1, oz: '8oz' },
        { id: 'Medium', label: 'Medium', icon: 'M', multiplier: 1.2, oz: '12oz' },
        { id: 'Large', label: 'Large', icon: 'L', multiplier: 1.5, oz: '16oz' }
    ];

    const milks = [
        { id: 'Full Cream', name: 'Full Cream', cost: 0 },
        { id: 'Oat', name: 'Oat Milk', cost: 40 },
        { id: 'Almond', name: 'Almond Milk', cost: 50 },
        { id: 'Soy', name: 'Soy Milk', cost: 30 },
    ];

    const syrups = [
        { id: 'No Sugar', name: 'No Sugar', cost: 0 },
        { id: 'Vanilla', name: 'Vanilla', cost: 30 },
        { id: 'Hazelnut', name: 'Hazelnut', cost: 35 },
        { id: 'Caramel', name: 'Caramel', cost: 35 },
    ];

    // Calculate Total Price
    const calculatePrice = () => {
        if (!config.base) return 0;
        let basePrice = config.base.price;
        // Size multiplier
        const sizeMult = sizes.find(s => s.id === config.size)?.multiplier || 1;
        basePrice = basePrice * sizeMult;

        // Add-ons
        const milkCost = milks.find(m => m.id === config.milk)?.cost || 0;
        const syrupCost = syrups.find(s => s.id === config.syrup)?.cost || 0;

        return Math.round(basePrice + milkCost + syrupCost);
    };

    const handleAddToCart = async () => {
        const token = localStorage.getItem('token');
        if (!token || token === 'undefined' || token === 'null') {
            toast.error("Please login to create your custom brew");
            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        setLoading(true);
        try {
            // Find a real product from DB to link this order to
            // Ideally we should have a "Custom Coffee" product or use the base name
            const response = await fetch(`${API_URL}/api/products`);
            const data = await response.json();

            // Try to find a product that matches the base name or fallback to first coffee
            const productMatch = data.data.find(p => p.name.toLowerCase().includes(config.base.name.toLowerCase())) || data.data[0];

            if (!productMatch) {
                toast.error("Could not configure order. Please try standard shop.");
                return;
            }

            const finalPrice = calculatePrice();
            const customName = `Custom ${config.base.name} (${config.size}, ${config.milk}, ${config.syrup})`;

            addToCart({
                ...productMatch,
                _id: productMatch._id, // Keep original ID for backend validity
                name: customName,
                price: finalPrice,
                image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800', // Generic fancy cup
                // We add these purely for display in cart if supported, or just rely on name
                customAttributes: {
                    base: config.base.name,
                    size: config.size,
                    milk: config.milk,
                    syrup: config.syrup
                }
            });

            toast.success("Your master brew has been added to cart!");
            navigate('/cart');
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Render Steps
    return (
        <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 font-[Outfit]">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1 rounded-full bg-orange-100 text-[#C97E45] text-xs font-bold uppercase tracking-widest mb-4">
                        Be Your Own Barista
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#2C1810] mb-4">Brew Your Perfect Cup</h1>
                    <p className="text-[#6D5E57]">Customize every detail directly from our digital cafe.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* LEFT: Visualizer */}
                    <div className="relative h-[500px] bg-[#E8E4D9] rounded-[3rem] shadow-inner border border-white/50 p-8 flex items-center justify-center overflow-hidden">

                        {/* Custom CSS for specific animations */}
                        <style>{`
                            @keyframes float-steam {
                                0% { transform: translateY(0) scale(1); opacity: 0; }
                                50% { opacity: 0.5; }
                                100% { transform: translateY(-40px) scale(1.5); opacity: 0; }
                            }
                            .animate-steam { animation: float-steam 3s infinite ease-out; }
                            .delay-75 { animation-delay: 0.75s; }
                            .delay-150 { animation-delay: 1.5s; }
                            .glass-reflection {
                                background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.1) 50%, transparent 54%);
                            }
                        `}</style>

                        <div className="relative z-10 transition-all duration-500 flex flex-col items-center justify-end h-80">

                            {/* Steam Animation - Only show if base selected */}
                            {config.base && (
                                <div className="absolute -top-12 flex gap-4 opacity-60">
                                    <div className="w-2 h-16 bg-white blur-md rounded-full animate-steam"></div>
                                    <div className="w-3 h-20 bg-white blur-md rounded-full animate-steam delay-75"></div>
                                    <div className="w-2 h-14 bg-white blur-md rounded-full animate-steam delay-150"></div>
                                </div>
                            )}

                            {/* Cup Container */}
                            <div className={`relative transition-all duration-500 ease-in-out
                                ${config.size === 'Small' ? 'w-40 h-48' : config.size === 'Medium' ? 'w-48 h-60' : 'w-56 h-72'}
                            `}>
                                {/* Glass Body */}
                                <div className="w-full h-full bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-b-[2rem] rounded-t-lg shadow-xl overflow-hidden relative glass-reflection">

                                    {/* Liquid Layers Container */}
                                    <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-col justify-end p-1">

                                        {/* Base Coffee Layer */}
                                        <div
                                            className="w-full rounded-b-[1.8rem] transition-all duration-1000 ease-in-out relative overflow-hidden"
                                            style={{
                                                height: config.base ? '80%' : '0%',
                                                backgroundColor: config.base ? config.base.color : '#F0E6D2',
                                                boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.2)'
                                            }}
                                        >
                                            {/* Bubbles in Coffee */}
                                            <div className="absolute w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

                                            {/* Milk Mixing Effect */}
                                            {config.milk !== 'Full Cream' && (
                                                <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-white/20 to-transparent blur-xl"></div>
                                            )}
                                        </div>

                                        {/* Foam/Cream Layer */}
                                        {config.base && (
                                            <div
                                                className="w-full bg-[#FFFDD0] transition-all duration-700 ease-out"
                                                style={{
                                                    height: config.size === 'Large' || config.base.id === 'cappuccino' ? '20%' : '5%',
                                                    opacity: 0.9,
                                                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                                                }}
                                            >
                                                {/* Syrup Drizzle if selected */}
                                                {config.syrup !== 'No Sugar' && (
                                                    <div className="w-full h-full opacity-60 mix-blend-multiply"
                                                        style={{
                                                            backgroundImage: 'radial-gradient(circle, transparent 20%, #8B4513 22%, transparent 24%)',
                                                            backgroundSize: '20px 20px'
                                                        }}
                                                    ></div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Glass Highlights */}
                                    <div className="absolute top-0 right-3 w-3 h-full bg-gradient-to-l from-white/30 to-transparent blur-[2px]"></div>
                                    <div className="absolute top-0 left-3 w-1 h-full bg-gradient-to-r from-white/40 to-transparent blur-[1px]"></div>
                                </div>

                                {/* Handle */}
                                <div className={`absolute top-1/2 -right-10 -translate-y-1/2 w-12 h-24 border-8 border-white/30 rounded-r-3xl shadow-sm transition-opacity duration-300
                                    ${config.size === 'Small' ? 'opacity-0' : 'opacity-100'}
                                `}></div>
                            </div>

                            {/* Coaster/Shadow */}
                            <div className="absolute -bottom-8 w-40 h-8 bg-black/20 blur-xl rounded-[100%]"></div>
                        </div>

                        {/* Summary Pill */}
                        <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md px-6 py-4 rounded-3xl shadow-lg border border-white/50 min-w-[160px] text-center transform hover:scale-105 transition-all">
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Total Brew Price</p>
                            <p className="text-4xl font-black text-[#2C1810]">₹{calculatePrice()}</p>
                        </div>
                    </div>

                    {/* RIGHT: Controls */}
                    <div className="space-y-8">
                        {/* Progress */}
                        <div className="flex justify-between items-center px-2">
                            {['Base', 'Size', 'Customs'].map((label, i) => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                                        ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-[#C97E45] text-white' : 'bg-slate-100 text-slate-400'}
                                    `}>
                                        {step > i + 1 ? <Check size={16} /> : i + 1}
                                    </div>
                                    <span className={`text-xs font-bold uppercase tracking-widest ${step === i + 1 ? 'text-[#C97E45]' : 'text-slate-400'}`}>{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Step Content */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[300px]">
                            {step === 1 && (
                                <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                                    <h3 className="text-xl font-bold text-[#2C1810] mb-6">Choose your Base</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {bases.map(base => (
                                            <button
                                                key={base.id}
                                                onClick={() => setConfig({ ...config, base })}
                                                className={`p-4 rounded-2xl text-left border-2 transition-all group
                                                    ${config.base?.id === base.id ? 'border-[#C97E45] bg-orange-50' : 'border-slate-100 hover:border-orange-200'}
                                                `}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className={`font-bold ${config.base?.id === base.id ? 'text-[#C97E45]' : 'text-[#2C1810]'}`}>{base.name}</span>
                                                    {config.base?.id === base.id && <CheckCircle2 size={16} className="text-[#C97E45]" />}
                                                </div>
                                                <p className="text-xs text-[#6D5E57] mb-2">{base.desc}</p>
                                                <p className="text-sm font-bold text-[#2C1810]">₹{base.price}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                                    <h3 className="text-xl font-bold text-[#2C1810]">Select Size</h3>
                                    <div className="flex justify-center gap-6 py-4">
                                        {sizes.map(size => (
                                            <button
                                                key={size.id}
                                                onClick={() => setConfig({ ...config, size: size.id })}
                                                className={`relative w-24 h-32 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all
                                                    ${config.size === size.id ? 'border-[#C97E45] bg-orange-50 scale-110' : 'border-slate-100 hover:border-orange-200'}
                                                `}
                                            >
                                                <CupSoda size={size.id === 'Small' ? 24 : size.id === 'Medium' ? 32 : 40}
                                                    className={config.size === size.id ? 'text-[#C97E45]' : 'text-slate-300'}
                                                />
                                                <span className={`text-sm font-bold ${config.size === size.id ? 'text-[#C97E45]' : 'text-slate-500'}`}>{size.label}</span>
                                                <span className="text-[10px] text-slate-400">{size.oz}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                                    <div>
                                        <h3 className="text-lg font-bold text-[#2C1810] mb-3">Choice of Milk</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {milks.map(milk => (
                                                <button
                                                    key={milk.id}
                                                    onClick={() => setConfig({ ...config, milk: milk.id })}
                                                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all
                                                        ${config.milk === milk.id ? 'bg-[#2C1810] text-white border-[#2C1810]' : 'bg-white text-[#6D5E57] border-slate-200 hover:border-[#C97E45]'}
                                                    `}
                                                >
                                                    {milk.name} {milk.cost > 0 && `(+₹${milk.cost})`}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-[#2C1810] mb-3">Sweetener</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {syrups.map(syrup => (
                                                <button
                                                    key={syrup.id}
                                                    onClick={() => setConfig({ ...config, syrup: syrup.id })}
                                                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all
                                                        ${config.syrup === syrup.id ? 'bg-[#C97E45] text-white border-[#C97E45]' : 'bg-white text-[#6D5E57] border-slate-200 hover:border-[#C97E45]'}
                                                    `}
                                                >
                                                    {syrup.name} {syrup.cost > 0 && `(+₹${syrup.cost})`}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center pt-4">
                            <button
                                onClick={() => setStep(Math.max(1, step - 1))}
                                disabled={step === 1}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[#4A2C2A] hover:bg-white transition-colors disabled:opacity-0`}
                            >
                                <ArrowLeft size={20} /> Back
                            </button>

                            {step < 3 ? (
                                <button
                                    onClick={() => config.base && setStep(step + 1)}
                                    disabled={!config.base}
                                    className="flex items-center gap-2 bg-[#4A2C2A] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-[#2C1810] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next Step <ArrowRight size={20} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleAddToCart}
                                    disabled={loading}
                                    className="flex items-center gap-2 bg-[#C97E45] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-[#b06d3a] transition-all"
                                >
                                    {loading ? <Sparkles className="animate-spin" /> : <ShoppingBag size={20} />}
                                    Add to Cart - ₹{calculatePrice()}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Quick helper
const CheckCircle2 = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
);

export default BrewYourOwn;
