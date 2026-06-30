import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Calendar, User, ArrowLeft, Clock, Share2, Facebook, Twitter, Link as LinkIcon, BookOpen } from 'lucide-react';
import { useGlobalStore } from '@/app/store/globalStore';
import API from '@/core/api/api.config';

const BlogDetailPage = () => {
    const { slug } = useParams();
    const { backendUrl } = useGlobalStore();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchBlog = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}${API.BLOG}/get/${slug}`);
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
            <div className="bg-[#f9faf9] min-h-screen flex flex-col items-center justify-center space-y-4 -m-4 lg:-m-8 pb-20">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-emerald-700 rounded-full animate-spin"></div>
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Retrieving Content...</p>
            </div>
        );
    }

    if (!blog) return null;

    return (
        <div className="bg-[#f9faf9] font-sans -m-4 lg:-m-8 pb-20">
            {/* Minimal Header area */}
            <div className="pt-12 pb-6 px-6 sm:px-10 max-w-7xl mx-auto flex items-center">
                <button 
                    onClick={() => navigate('/blogs')}
                    className="group flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full hover:bg-emerald-100 transition-colors font-black text-[10px] uppercase tracking-widest"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform"/> Back to Library
                </button>
            </div>

            <article className="pb-24">
                {/* Title Section */}
                <div className="max-w-4xl mx-auto px-6 sm:px-10 space-y-8 text-center mt-6">
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <span className="bg-emerald-500/10 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/20">
                            {blog.tags?.[0] || 'Agriculture'}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                            <Calendar size={12}/> {new Date(blog.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                            <Clock size={12}/> 5 Min Read
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
                        {blog.title}
                    </h1>

                    <div className="flex items-center justify-center gap-4 pt-4">
                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-black text-slate-500 text-lg shadow-inner">
                            {blog.author?.[0] || 'A'}
                        </div>
                        <div className="text-left">
                            <div className="text-xs font-black text-slate-900 uppercase tracking-widest">{blog.author || 'AgriTeam Advisor'}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">KMC Editor</div>
                        </div>
                    </div>
                </div>

                {/* Featured Image */}
                <div className="max-w-6xl mx-auto px-6 sm:px-10 my-16">
                    <div className="aspect-[21/9] rounded-[2rem] overflow-hidden bg-slate-100 shadow-2xl border border-slate-200/60">
                        <img 
                            src={blog.featured_image} 
                            alt={blog.title} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-6 sm:px-10">
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Sidebar Share */}
                        <div className="hidden lg:flex flex-col gap-4 sticky top-40 h-fit">
                            <div className="text-[10px] font-black text-slate-400 uppercase vertical-text tracking-[0.3em] mb-2">Share</div>
                            <button className="w-10 h-10 flex items-center justify-center bg-white text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-full border border-slate-200 shadow-sm transition-all hover:scale-110"><Facebook size={16}/></button>
                            <button className="w-10 h-10 flex items-center justify-center bg-white text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-full border border-slate-200 shadow-sm transition-all hover:scale-110"><Twitter size={16}/></button>
                            <button className="w-10 h-10 flex items-center justify-center bg-white text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-full border border-slate-200 shadow-sm transition-all hover:scale-110"><LinkIcon size={16}/></button>
                        </div>

                        <div className="flex-1 space-y-12">
                            <div 
                                className="prose prose-lg prose-slate max-w-none 
                                prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight
                                prose-p:text-slate-600 prose-p:leading-relaxed
                                prose-strong:font-black prose-strong:text-slate-800
                                prose-a:text-emerald-600 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                                prose-img:rounded-[1.5rem] prose-img:shadow-lg prose-img:border prose-img:border-slate-100
                                prose-blockquote:border-l-emerald-500 prose-blockquote:bg-emerald-50/50 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-2xl prose-blockquote:font-medium prose-blockquote:text-slate-700 prose-blockquote:not-italic"
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />

                            <div className="pt-12 border-t border-slate-200/60 space-y-10">
                                <div className="flex flex-wrap gap-2">
                                    {blog.tags?.map((tag, idx) => (
                                        <span key={idx} className="bg-white text-slate-500 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200 shadow-sm">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="bg-gradient-to-br from-emerald-50 to-[#f0fdf4] rounded-[2rem] p-10 flex flex-col md:flex-row items-center gap-8 border border-emerald-100 shadow-sm">
                                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-xl shadow-emerald-200/50 flex-shrink-0">
                                        <BookOpen size={32} />
                                    </div>
                                    <div className="flex-1 text-center md:text-left space-y-2">
                                        <h4 className="text-2xl font-black text-emerald-950 leading-tight tracking-tight">Was this advisory helpful?</h4>
                                        <p className="text-emerald-800/70 font-medium text-sm max-w-sm">Help us improve our knowledge hub by sharing this article with your farming community.</p>
                                    </div>
                                    <button className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap">
                                        <Share2 size={16}/> Share Article
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default BlogDetailPage;
