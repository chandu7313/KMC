import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '@/app/providers/AppContext';
import { toast } from 'react-toastify';
import Navbar from '@/app/layouts/Navbar';
import { Calendar, User, ArrowLeft, Clock, Share2, Facebook, Twitter, Link } from 'lucide-react';

const BlogDetail = () => {
    const { slug } = useParams();
    const { backendUrl } = useContext(AppContext);
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchBlog = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/blog/get/${slug}`);
            if (data.success) {
                setBlog(data.blog);
            } else {
                toast.error(data.message);
                navigate('/blogs');
            }
        } catch (error) {
            toast.error(error.message);
            navigate('/blogs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlog();
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) {
        return (
            <div className="bg-white min-h-screen">
                <Navbar />
                <div className="flex flex-col items-center justify-center py-64 space-y-4">
                    <div className="w-12 h-12 border-4 border-slate-50 border-t-emerald-700 rounded-full animate-spin"></div>
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Retrieving Content...</p>
            </div>
        </div>
        );
    }

    if (!blog) return null;

    return (
        <div className="bg-white min-h-screen">
            <Navbar />
            
            <article className="pt-32 pb-24">
                {/* Hero Section */}
                <div className="max-w-4xl mx-auto px-6 space-y-12">
                    <button 
                        onClick={() => navigate('/blogs')}
                        className="group flex items-center gap-3 text-slate-400 hover:text-emerald-700 transition-colors font-black text-[10px] uppercase tracking-widest"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Back to Library
                    </button>

                    <div className="space-y-6">
                        <div className="flex flex-wrap items-center gap-6">
                            <span className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                {blog.tags?.[0] || 'Agriculture'}
                            </span>
                            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                <Calendar size={12}/> {new Date(blog.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                <Clock size={12}/> 5 Min Read
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#1f2d1f] tracking-tight leading-[1.1]">
                            {blog.title}
                        </h1>

                        <div className="flex items-center gap-4 pt-4">
                            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xl border border-slate-200">
                                {blog.author?.[0] || 'A'}
                            </div>
                            <div>
                                <div className="text-sm font-black text-[#1f2d1f] uppercase tracking-wider">{blog.author || 'AgriTeam Advisor'}</div>
                                <div className="text-xs text-slate-400 font-medium italic">Contributor at KMC Advisor</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Image */}
                <div className="max-w-6xl mx-auto px-6 my-16">
                    <div className="aspect-[21/9] rounded-[48px] overflow-hidden bg-slate-100 border border-slate-100 shadow-2xl">
                        <img 
                            src={blog.featured_image} 
                            alt={blog.title} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-3xl mx-auto px-6">
                    <div className="flex gap-10">
                        {/* Sidebar Share */}
                        <div className="hidden lg:flex flex-col gap-6 sticky top-40 h-fit">
                            <div className="text-[10px] font-black text-slate-300 uppercase vertical-text tracking-widest mb-4">Share Article</div>
                            <button className="p-3 bg-slate-50 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-2xl border border-slate-100 transition-all"><Facebook size={18}/></button>
                            <button className="p-3 bg-slate-50 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-2xl border border-slate-100 transition-all"><Twitter size={18}/></button>
                            <button className="p-3 bg-slate-50 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-2xl border border-slate-100 transition-all"><Link size={18}/></button>
                        </div>

                        <div className="flex-1 space-y-10">
                            <div 
                                className="prose prose-lg prose-slate max-w-none 
                                prose-headings:font-serif prose-headings:font-bold prose-headings:text-[#1f2d1f]
                                prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium
                                prose-strong:font-black prose-strong:text-[#1f2d1f]
                                prose-img:rounded-[32px] prose-img:shadow-xl prose-img:border prose-img:border-slate-100"
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />

                            <div className="pt-16 border-t border-slate-100 space-y-8">
                                <div className="flex flex-wrap gap-3">
                                    {blog.tags?.map((tag, idx) => (
                                        <span key={idx} className="bg-slate-50 text-slate-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="bg-emerald-50 rounded-[40px] p-10 flex flex-col md:flex-row items-center gap-8 border border-emerald-100">
                                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-xl shadow-emerald-700/5">
                                        <BookOpen size={32} />
                                    </div>
                                    <div className="flex-1 text-center md:text-left space-y-2">
                                        <h4 className="text-xl font-black text-emerald-900 leading-tight">Was this advisory helpful?</h4>
                                        <p className="text-emerald-700/70 font-medium text-sm">Help us improve our knowledge hub by sharing this article with your community.</p>
                                    </div>
                                    <button className="bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-800 transition-all active:scale-95 flex items-center gap-2">
                                        <Share2 size={16}/> Share Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            <Footer />
        </div>
    );
};

export default BlogDetail;
