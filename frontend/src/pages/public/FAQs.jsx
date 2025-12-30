import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search, Loader2 } from 'lucide-react';

const FAQs = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/cms/faqs');
                const data = await res.json();
                if (data.success) {
                    setFaqs(data.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchFAQs();
    }, []);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const categories = ['All', ...new Set(faqs.map(faq => faq.category || 'General'))];

    const filteredFAQs = faqs.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || (faq.category || 'General') === activeCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-[#4A2C2A]" size={40} /></div>;

    return (
        <div className="bg-[#FDFBF7] min-h-screen py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12 animate-fade-in">
                    <span className="text-[#C97E45] font-bold tracking-widest uppercase text-sm mb-2 block">Support Center</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#2C1810] font-[Outfit] mb-6">Frequently Asked Questions</h1>

                    <div className="max-w-xl mx-auto relative mb-8">
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 rounded-full bg-white shadow-lg border-2 border-transparent focus:border-[#C97E45] focus:outline-none transition-all text-[#4A2C2A]"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    </div>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap justify-center gap-2 animate-slide-up">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeCategory === cat
                                        ? 'bg-[#2C1810] text-white shadow-lg'
                                        : 'bg-white text-slate-500 hover:bg-orange-50'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredFAQs.length === 0 ? (
                    <div className="text-center py-20 animate-fade-in">
                        <h3 className="text-xl font-bold text-slate-500">No matching questions found.</h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20 animate-slide-up items-start">
                        {filteredFAQs.map((faq, index) => (
                            <div key={faq._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-md">
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full text-left p-6 flex items-start justify-between hover:bg-slate-50 transition-colors gap-4"
                                >
                                    <span className="text-lg font-bold text-[#2C1810] flex gap-3 leading-tight">
                                        <HelpCircle className="text-[#C97E45] shrink-0 mt-0.5" size={20} />
                                        {faq.question}
                                    </span>
                                    {activeIndex === index ? <ChevronUp className="text-[#C97E45] shrink-0" /> : <ChevronDown className="text-slate-300 shrink-0" />}
                                </button>
                                <div
                                    className={`transition-all duration-300 ease-in-out overflow-hidden ${activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <div className="p-6 pt-0 text-[#6D5E57] leading-relaxed pl-14 border-t border-dashed border-slate-100 mt-[-5px]">
                                        {faq.answer.split('\n').map((line, i) => (
                                            <p key={i} className="mb-2">{line}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Contact CTA */}
                <div className="bg-[#4A2C2A] rounded-[2.5rem] p-10 text-center text-white relative overflow-hidden animate-fade-in-delay-1">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-4 font-[Outfit]">Still have questions?</h2>
                        <p className="text-white/70 mb-8 max-w-xl mx-auto">Can't find the answer you're looking for? Please seek support from our friendly team.</p>
                        <a href="/contact" className="inline-block bg-[#C97E45] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#b06a36] transition-all">
                            Contact Us
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default FAQs;
