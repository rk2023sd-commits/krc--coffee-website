import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Clock, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

const BlogPost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                // Try fetching by slug/id
                const res = await fetch(`http://localhost:5000/api/blogs/${slug}`);
                const data = await res.json();
                if (data.success) {
                    setBlog(data.data);
                } else {
                    navigate('/blog');
                }
            } catch (error) {
                console.error('Failed to fetch blog post');
                navigate('/blog');
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [slug, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
                <div className="w-16 h-16 border-4 border-[#C97E45] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!blog) return null;

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-[Inter] pb-20">
            {/* Hero Image */}
            <div className="w-full h-[60vh] relative">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-end container mx-auto px-4 pb-16">
                    <div className="max-w-4xl mx-auto w-full text-white">
                        <Link to="/blog" className="inline-flex items-center text-white/80 hover:text-[#C97E45] mb-6 transition-colors font-medium backdrop-blur-md bg-white/10 px-4 py-2 rounded-full w-fit">
                            <ArrowLeft size={18} className="mr-2" /> Back to Journal
                        </Link>
                        <div className="flex flex-wrap gap-4 mb-6">
                            {blog.tags && blog.tags.map((tag, i) => (
                                <span key={i} className="px-4 py-1.5 bg-[#C97E45] text-white text-xs font-bold rounded-full uppercase tracking-widest">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold font-[Outfit] leading-tight mb-6 text-shadow-lg">
                            {blog.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-8 text-sm md:text-base font-medium text-white/90">
                            <div className="flex items-center gap-2">
                                <User size={18} className="text-[#C97E45]" />
                                <span>{blog.author || 'Team KRC'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={18} className="text-[#C97E45]" />
                                <span>{new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={18} className="text-[#C97E45]" />
                                <span>{blog.readTime || 5} min read</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 relative z-30 -mt-10">
                <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-8 md:p-16 shadow-xl border border-slate-100">
                    {/* Share Buttons - Sticky on Desktop */}
                    <div className="hidden lg:flex flex-col gap-4 absolute -left-20 top-0 pt-20">
                        <div className="p-3 bg-white rounded-full shadow-lg text-slate-400 hover:text-[#1877F2] hover:scale-110 transition-all cursor-pointer border border-slate-100">
                            <Facebook size={20} />
                        </div>
                        <div className="p-3 bg-white rounded-full shadow-lg text-slate-400 hover:text-[#1DA1F2] hover:scale-110 transition-all cursor-pointer border border-slate-100">
                            <Twitter size={20} />
                        </div>
                        <div className="p-3 bg-white rounded-full shadow-lg text-slate-400 hover:text-[#0A66C2] hover:scale-110 transition-all cursor-pointer border border-slate-100">
                            <Linkedin size={20} />
                        </div>
                        <div className="p-3 bg-white rounded-full shadow-lg text-slate-400 hover:text-[#C97E45] hover:scale-110 transition-all cursor-pointer border border-slate-100">
                            <Share2 size={20} />
                        </div>
                    </div>

                    <div
                        className="prose prose-lg prose-slate max-w-none 
                        prose-headings:font-[Outfit] prose-headings:text-[#2C1810] 
                        prose-a:text-[#C97E45] hover:prose-a:text-[#B06A36]
                        prose-img:rounded-3xl prose-img:shadow-lg
                        prose-blockquote:border-l-4 prose-blockquote:border-[#C97E45] prose-blockquote:bg-orange-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-[#4A2C2A]
                        "
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    >
                    </div>

                    <div className="mt-16 pt-10 border-t border-slate-100">
                        <h3 className="text-2xl font-bold text-[#2C1810] font-[Outfit] mb-8">Share this story</h3>
                        <div className="flex gap-4">
                            <button className="flex items-center gap-2 px-6 py-3 bg-[#3b5998] text-white rounded-xl font-bold hover:opacity-90 transition-opacity">
                                <Facebook size={20} /> Facebook
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3 bg-[#1DA1F2] text-white rounded-xl font-bold hover:opacity-90 transition-opacity">
                                <Twitter size={20} /> Twitter
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3 bg-[#0e76a8] text-white rounded-xl font-bold hover:opacity-90 transition-opacity">
                                <Linkedin size={20} /> LinkedIn
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default BlogPost;
