import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, Facebook, Instagram, Twitter } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const [contactInfo, setContactInfo] = useState({});

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/cms/pages/cms');
                const data = await res.json();
                if (data.success && data.data) {
                    setContactInfo(data.data);
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchInfo();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/cms/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Message sent successfully! We will get back to you soon.');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                toast.error(data.message || 'Failed to send message');
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#FDFBF7] min-h-screen py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16 animate-fade-in">
                    <span className="text-[#C97E45] font-bold tracking-widest uppercase text-sm mb-2 block">Get In Touch</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#2C1810] font-[Outfit] mb-6">Contact Us</h1>
                    <p className="text-[#6D5E57] max-w-2xl mx-auto">Have questions about our coffee? Want to partner with us? Reach out to our team and we'll be happy to assist you.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16 animate-slide-up">
                    {/* Contact Info */}
                    <div className="bg-[#4A2C2A] text-white rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden shadow-2xl h-full flex flex-col justify-between">
                        {/* Decor */}
                        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-[#C97E45] opacity-20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-8 font-[Outfit]">Contact Information</h2>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                        <Phone className="text-[#C97E45]" size={22} />
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-sm mb-1 uppercase tracking-wide font-bold">Phone</p>
                                        <p className="text-xl font-medium">{contactInfo.contactPhone || '+91 98765 43210'}</p>
                                        <p className="text-white/50 text-sm">Mon-Fri 9am to 6pm</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                        <Mail className="text-[#C97E45]" size={22} />
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-sm mb-1 uppercase tracking-wide font-bold">Email</p>
                                        <p className="text-xl font-medium">{contactInfo.contactEmail || 'support@krccoffee.com'}</p>
                                        <p className="text-white/50 text-sm">Online Support 24/7</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                        <MapPin className="text-[#C97E45]" size={22} />
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-sm mb-1 uppercase tracking-wide font-bold">Visit Us</p>
                                        <p className="text-xl font-medium leading-relaxed">
                                            {contactInfo.contactAddress || '123 Coffee Estate Road, Chikmagalur, Karnataka, India - 577101'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="relative z-10 mt-12 pt-8 border-t border-white/10">
                            <p className="text-white/60 text-sm mb-4 uppercase tracking-wide font-bold">Follow Us</p>
                            <div className="flex gap-4">
                                <a href={contactInfo.facebookLink || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C97E45] transition-colors">
                                    <Facebook size={20} />
                                </a>
                                <a href={contactInfo.instagramLink || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C97E45] transition-colors">
                                    <Instagram size={20} />
                                </a>
                                <a href={contactInfo.twitterLink || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C97E45] transition-colors">
                                    <Twitter size={20} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-xl border border-slate-100">
                        <h2 className="text-3xl font-bold text-[#2C1810] mb-2 font-[Outfit]">Send a Message</h2>
                        <p className="text-slate-500 mb-8">We'd love to hear from you. Fill out the form below.</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-[#4A2C2A] mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#C97E45] focus:bg-white outline-none transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#4A2C2A] mb-2">Your Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#C97E45] focus:bg-white outline-none transition-all"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#4A2C2A] mb-2">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#C97E45] focus:bg-white outline-none transition-all"
                                    placeholder="How can we help?"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#4A2C2A] mb-2">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#C97E45] focus:bg-white outline-none transition-all resize-none"
                                    placeholder="Write your message here..."
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-[#4A2C2A] text-white rounded-xl font-bold hover:bg-[#2C1810] transition-colors flex items-center justify-center gap-2 group shadow-lg shadow-[#4A2C2A]/20"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} /> Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Message <Send size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Map Section */}
                <div className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-slate-100 mb-16 animate-slide-up">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15545.918901968595!2d75.77537385!3d13.0768487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba4fa6df7650893%3A0xb304918e977f68c3!2sChikkamagaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1716300000000!5m2!1sen!2sin"
                        width="100%"
                        height="400"
                        style={{ border: 0, borderRadius: '2rem' }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>

                {/* FAQ CTA */}
                <div className="text-center bg-orange-50 rounded-[3rem] p-12 animate-slide-up">
                    <h2 className="text-2xl font-bold text-[#2C1810] mb-4 font-[Outfit]">Have Quick Questions?</h2>
                    <p className="text-[#6D5E57] mb-8">You might find the answer you're looking for in our Frequently Asked Questions section.</p>
                    <a href="/faqs" className="inline-block bg-[#C97E45] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#b06a36] transition-all">
                        View FAQs
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Contact;
