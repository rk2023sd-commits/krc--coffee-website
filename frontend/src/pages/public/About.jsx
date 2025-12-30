
import React, { useState, useEffect } from 'react';
import { Loader2, Info, Users, Coffee, Globe, Heart, Award, Leaf } from 'lucide-react';

const About = () => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/cms/pages/cms');
                const data = await res.json();
                if (data.success && data.data && data.data.aboutUs) {
                    setContent(data.data.aboutUs);
                } else {
                    setContent('<p>Welcome to KRC! Coffee. We are passionate about brewing the perfect cup.</p>');
                }
            } catch (error) {
                console.error(error);
                setContent('<p>Welcome to KRC! Coffee.</p>');
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-[#4A2C2A]" size={40} /></div>;

    return (
        <div className="bg-[#FDFBF7] min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2670&auto=format&fit=crop"
                        alt="Coffee Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>
                <div className="relative z-10 text-center text-white px-4 animate-fade-in">
                    <span className="text-[#C97E45] font-bold tracking-[0.2em] uppercase text-sm md:text-base mb-4 block">Since 2010</span>
                    <h1 className="text-5xl md:text-7xl font-bold font-[Outfit] mb-6">Our Story</h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/90 font-light leading-relaxed">
                        From a small plantation in Chikmagalur to your morning cup, we are dedicated to the art of coffee.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-20">
                {/* Mission Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
                    <div className="animate-slide-up">
                        <span className="text-[#C97E45] font-bold tracking-widest uppercase text-sm mb-2 block">Our Mission</span>
                        <h2 className="text-4xl font-bold text-[#2C1810] font-[Outfit] mb-6">Brewing Memories, <br />One Cup at a Time</h2>
                        <p className="text-[#6D5E57] text-lg leading-relaxed mb-6">
                            At KRC! Coffee, we believe that coffee is more than just a beverage; it's a ritual, a conversation starter, and a hug in a mug. Our mission is to bring the authentic taste of Indian coffee to the world, sourcing sustainably and roasting with passion.
                        </p>
                        <div className="flex gap-8">
                            <div>
                                <h4 className="font-bold text-[#2C1810] text-xl mb-1">Authentic</h4>
                                <p className="text-sm text-[#6D5E57]">100% Shade-grown</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-[#2C1810] text-xl mb-1">Sustainable</h4>
                                <p className="text-sm text-[#6D5E57]">Eco-friendly packs</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative animate-fade-in-delay-1">
                        <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-[#F5E6D3] rounded-full z-0"></div>
                        <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-[#4A2C2A] rounded-full opacity-10 z-0"></div>
                        <img
                            src="https://images.unsplash.com/photo-1511537632536-b7a460582209?q=80&w=2574&auto=format&fit=crop"
                            alt="Coffee Pouring"
                            className="rounded-[2.5rem] shadow-2xl relative z-10 w-full object-cover transform hover:scale-[1.02] transition-transform duration-500"
                        />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="bg-[#4A2C2A] rounded-[3rem] p-12 md:p-16 mb-24 text-white relative overflow-hidden animate-slide-up">
                    <div className="absolute top-0 right-0 p-12 opacity-5">
                        <Coffee size={300} />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#C97E45] transition-colors duration-300">
                                <Award className="text-white" size={32} />
                            </div>
                            <div className="text-4xl font-bold font-[Outfit] mb-2">10+</div>
                            <div className="text-white/60 text-sm uppercase tracking-widest font-medium">Years</div>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#C97E45] transition-colors duration-300">
                                <Users className="text-white" size={32} />
                            </div>
                            <div className="text-4xl font-bold font-[Outfit] mb-2">50k+</div>
                            <div className="text-white/60 text-sm uppercase tracking-widest font-medium">Customers</div>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#C97E45] transition-colors duration-300">
                                <Globe className="text-white" size={32} />
                            </div>
                            <div className="text-4xl font-bold font-[Outfit] mb-2">25+</div>
                            <div className="text-white/60 text-sm uppercase tracking-widest font-medium">Outlets</div>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#C97E45] transition-colors duration-300">
                                <Leaf className="text-white" size={32} />
                            </div>
                            <div className="text-4xl font-bold font-[Outfit] mb-2">100%</div>
                            <div className="text-white/60 text-sm uppercase tracking-widest font-medium">Organic</div>
                        </div>
                    </div>
                </div>

                {/* Values Section */}
                <div className="mb-24">
                    <div className="text-center mb-16 animate-slide-up">
                        <span className="text-[#C97E45] font-bold tracking-widest uppercase text-sm mb-2 block">Why Choose Us</span>
                        <h2 className="text-4xl font-bold text-[#2C1810] font-[Outfit]">Our Core Values</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-lg border border-slate-100 hover:-translate-y-3 transition-transform duration-300 group animate-fade-in-delay-1">
                            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center text-[#C97E45] mb-6 group-hover:bg-[#C97E45] group-hover:text-white transition-colors">
                                <Award size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-[#2C1810] mb-4 font-[Outfit]">Quality First</h3>
                            <p className="text-[#6D5E57] leading-relaxed">We source only the finest AAA Grade Arabica beans from the high-altitude estates of Chikmagalur, ensuring every sip is pure perfection.</p>
                        </div>
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-lg border border-slate-100 hover:-translate-y-3 transition-transform duration-300 group animate-fade-in-delay-2">
                            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center text-[#C97E45] mb-6 group-hover:bg-[#C97E45] group-hover:text-white transition-colors">
                                <Users size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-[#2C1810] mb-4 font-[Outfit]">Community</h3>
                            <p className="text-[#6D5E57] leading-relaxed">We believe in giving back. We support local farmers with fair pricing and practice sustainable farming methods to protect our earth.</p>
                        </div>
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-lg border border-slate-100 hover:-translate-y-3 transition-transform duration-300 group animate-fade-in-delay-3">
                            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center text-[#C97E45] mb-6 group-hover:bg-[#C97E45] group-hover:text-white transition-colors">
                                <Heart size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-[#2C1810] mb-4 font-[Outfit]">Passion</h3>
                            <p className="text-[#6D5E57] leading-relaxed">Coffee isn't just a drink; it's an art. Every cup is brewed with love, precision, and an obsession for detail to brighten your day.</p>
                        </div>
                    </div>
                </div>

                {/* Dynamic Content Section */}
                <div className="bg-orange-50/50 rounded-[3rem] p-8 md:p-16 animate-slide-up">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-[#2C1810] mb-8 font-[Outfit] text-center">More About Us</h2>
                        <div
                            className="prose prose-lg max-w-none prose-headings:font-[Outfit] prose-headings:text-[#2C1810] prose-p:text-[#6D5E57] prose-a:text-[#C97E45] bg-white p-8 md:p-12 rounded-[2rem] shadow-sm"
                            dangerouslySetInnerHTML={{ __html: content }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
