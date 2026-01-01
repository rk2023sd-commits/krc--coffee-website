import React, { useState } from 'react';
import { Sparkles, Coffee, Zap, CloudRain, Smile, ArrowRight, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

const AiBarista = () => {
    const [mood, setMood] = useState(null);
    const [suggestion, setSuggestion] = useState(null);
    const [loading, setLoading] = useState(false);

    const moods = [
        { id: 'sleepy', label: 'Sleepy', icon: <Coffee size={20} />, color: 'bg-amber-800', text: 'text-amber-100' },
        { id: 'energetic', label: 'Energetic', icon: <Zap size={20} />, color: 'bg-yellow-500', text: 'text-yellow-900' },
        { id: 'cozy', label: 'Cozy / Cold', icon: <CloudRain size={20} />, color: 'bg-slate-600', text: 'text-slate-100' },
        { id: 'happy', label: 'Happy', icon: <Smile size={20} />, color: 'bg-orange-400', text: 'text-white' },
    ];

    const getSuggestion = (selectedMood) => {
        setLoading(true);
        // Simulate AI "thinking" time
        setTimeout(() => {
            const suggestions = {
                sleepy: {
                    name: 'Double Shot Espresso',
                    desc: 'A powerful kick to wake you up effectively.',
                    link: '/customer/shop/coffee',
                    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=400&auto=format&fit=crop'
                },
                energetic: {
                    name: 'Iced Americano',
                    desc: 'Keep the momentum going with a cool, refreshing brew.',
                    link: '/customer/shop/cold-coffee',
                    image: 'https://images.unsplash.com/photo-1517701604599-bb29b5aa6095?q=80&w=400&auto=format&fit=crop'
                },
                cozy: {
                    name: 'Hot Hazelnut Latte',
                    desc: 'Warm, nutty, and like a hug in a mug.',
                    link: '/customer/shop/coffee',
                    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=400&auto=format&fit=crop'
                },
                happy: {
                    name: 'Caramel Frappuccino',
                    desc: 'A sweet treat to match your sweet mood.',
                    link: '/customer/shop/cold-coffee',
                    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=400&auto=format&fit=crop'
                }
            };
            setSuggestion(suggestions[selectedMood]);
            setLoading(false);
        }, 1500);
    };

    const handleMoodSelect = (m) => {
        setMood(m);
        getSuggestion(m.id);
    };

    const reset = () => {
        setMood(null);
        setSuggestion(null);
    };

    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-orange-100 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-0"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                    <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#4A2C2A] text-lg">AI Barista</h3>
                        <p className="text-xs text-slate-400">Powered by KRC! Intelligence</p>
                    </div>
                </div>

                {!mood ? (
                    <div className="animate-in fade-in slide-in-from-bottom-2">
                        <p className="text-[#6D5E57] mb-4 text-sm font-medium">How are you feeling right now?</p>
                        <div className="grid grid-cols-2 gap-3">
                            {moods.map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => handleMoodSelect(m)}
                                    className={`${m.color} ${m.text} p-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-sm hover:scale-105 transition-transform`}
                                >
                                    {m.icon}
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : loading ? (
                    <div className="flex flex-col items-center justify-center py-8 animate-in fade-in">
                        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-3"></div>
                        <p className="text-purple-600 text-xs font-bold animate-pulse">Finding your perfect match...</p>
                    </div>
                ) : (
                    <div className="animate-in fade-in zoom-in-95">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Based on "{mood.label}"</p>
                                <h4 className="text-xl font-bold text-[#4A2C2A]">{suggestion.name}</h4>
                            </div>
                            <button onClick={reset} className="text-slate-300 hover:text-slate-500 transition-colors">
                                <RefreshCcw size={16} />
                            </button>
                        </div>

                        <div className="flex gap-4">
                            <img
                                src={suggestion.image}
                                alt={suggestion.name}
                                className="w-20 h-20 rounded-xl object-cover shadow-md"
                            />
                            <div className="flex-1 flex flex-col justify-between">
                                <p className="text-sm text-[#6D5E57] leading-tight">{suggestion.desc}</p>
                                <Link
                                    to={suggestion.link}
                                    className="text-purple-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all mt-2"
                                >
                                    Order Now <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiBarista;
