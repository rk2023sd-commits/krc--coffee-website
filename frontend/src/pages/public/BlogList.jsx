import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/blogs');
            const data = await res.json();
            if (data.success) {
                setBlogs(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch blogs');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
                <Loader2 className="animate-spin text-[#C97E45]" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-[Inter]">
            {/* Header */}
            <div className="bg-[#2C1810] text-white py-20 px-4 text-center relative overflow-hidden">
                <div className="relative z-10">
                    <span className="text-[#C97E45] font-bold tracking-widest uppercase text-sm mb-4 block animate-in fade-in slide-in-from-bottom-4">Our Journal</span>
                    <h1 className="text-4xl md:text-6xl font-bold font-[Outfit] mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">Coffee Culture & Stories</h1>
                    <p className="max-w-2xl mx-auto text-white/80 text-lg animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        Discover the art of brewing, latest news from our estates, and stories from the world of coffee.
                    </p>
                </div>
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute right-0 top-0 w-96 h-96 bg-[#C97E45] rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute left-0 bottom-0 w-64 h-64 bg-[#C97E45] rounded-full blur-[80px] transform -translate-x-1/2 translate-y-1/2"></div>
                </div>
            </div>

            {/* Blog Grid */}
            <div className="container mx-auto px-20 py-16">
                {blogs.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-[#6D5E57] text-xl">No stories published yet. Stay tuned!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog, index) => (
                            <Link
                                to={`/blog/${blog.slug || blog._id}`}
                                key={blog._id}
                                className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col h-full animate-in fade-in slide-in-from-bottom-8"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="h-64 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10"></div>
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 z-20 flex gap-2">
                                        {blog.tags && blog.tags.slice(0, 2).map((tag, i) => (
                                            <span key={i} className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#2C1810] text-xs font-bold rounded-full uppercase tracking-wider">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex items-center text-xs text-slate-400 mb-4 gap-4">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            <span>{new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <User size={14} />
                                            <span>{blog.author || 'Team KRC'}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#2C1810] font-[Outfit] mb-3 line-clamp-2 group-hover:text-[#C97E45] transition-colors leading-tight">
                                        {blog.title}
                                    </h3>
                                    <p className="text-[#6D5E57] line-clamp-3 mb-6 flex-grow leading-relaxed">
                                        {blog.content.replace(/<[^>]*>?/gm, '')}
                                    </p>
                                    <div className="flex items-center text-[#C97E45] font-bold group-hover:translate-x-2 transition-transform">
                                        Read Story <ArrowRight size={18} className="ml-2" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogList;
