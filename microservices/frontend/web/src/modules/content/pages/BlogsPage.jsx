import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import Navbar from '@/app/layouts/Navbar';
import { BookOpen, Calendar, User, ArrowRight, Search, Hash } from 'lucide-react';
import { useGlobalStore } from '@/app/store/globalStore';
import API from '@/core/api/api.config';

const Blogs = () => {
    const { backendUrl } = useGlobalStore();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchBlogs = async () => {
        try {
            const { data } = await axios.get(backendUrl + `${API.BLOG}/all`);
            if (data.success) {
                setBlogs(data.blogs);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const filteredBlogs = blogs.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="bg-white min-h-screen">
            <Navbar />
            
            <section className="pt-32 pb-24 px-6">
                {/* Heading */}
                <div className="text-center max-w-4xl mx-auto mb-20 space-y-6">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 font-black text-[10px] uppercase tracking-[0.3em] px-4 py-1.5 rounded-full mb-2">
                        <BookOpen size={14} /> Knowledge Hub
                    </div>
                    <h2 className="text-6xl font-serif font-bold text-[#1f2d1f] tracking-tight leading-tight">
                        Insights for the <br/><span className="text-emerald-700 italic underline decoration-emerald-200">Modern Farmer.</span>
                    </h2>
                    <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                        Expert opinions, technical guides, and the latest updates from the world of sustainable agriculture.
                    </p>

                    <div className="pt-8 flex justify-center">
                        <div className="relative w-full max-w-lg">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-[32px] py-5 pl-16 pr-8 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-900 shadow-sm" 
                                placeholder="Search articles, pests, or crops..." 
                            />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <div className="w-12 h-12 border-4 border-slate-50 border-t-emerald-700 rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Opening Archives...</p>
                    </div>
                ) : filteredBlogs.length === 0 ? (
                    <div className="text-center py-32 space-y-4">
                        <div className="text-slate-200 text-6xl font-black">404</div>
                        <p className="text-slate-400 font-bold">No articles found matching your criteria.</p>
                        <button onClick={() => setSearchTerm('')} className="text-emerald-700 font-black hover:underline uppercase tracking-widest text-[10px]">View all articles</button>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {filteredBlogs.map((blog) => (
                            <div
                                key={blog.id}
                                className="group cursor-pointer"
                                onClick={() => navigate(`/blog/${blog.slug}`)}
                            >
                                <div className="space-y-6">
                                    <div className="aspect-[16/10] rounded-[48px] overflow-hidden bg-slate-50 border border-slate-100 relative">
                                        <img
                                            src={blog.featured_image}
                                            alt={blog.title}
                                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>

                                    <div className="px-4 space-y-4">
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                                <Calendar size={12} className="text-emerald-600"/> {new Date(blog.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                                <User size={12} className="text-emerald-600"/> {blog.author || 'AgriTeam'}
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-black text-[#1f2d1f] leading-snug group-hover:text-emerald-700 transition-colors">
                                            {blog.title}
                                        </h3>

                                        <p className="text-slate-500 font-medium line-clamp-2 leading-relaxed">
                                            {blog.excerpt}
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            {blog.tags?.slice(0, 3).map((tag, idx) => (
                                                <span key={idx} className="text-[10px] font-black text-slate-400 flex items-center gap-1">
                                                    <Hash size={10} className="text-emerald-400"/> {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="pt-2 flex items-center gap-3 text-emerald-700 font-black text-xs uppercase tracking-[0.2em]">
                                            Continue Reading <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Blogs;
