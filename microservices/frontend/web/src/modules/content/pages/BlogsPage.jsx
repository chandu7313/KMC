import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { BookOpen, Calendar, User, ArrowRight, Search, Hash } from 'lucide-react';
import { useGlobalStore } from '@/app/store/globalStore';
import API from '@/core/api/api.config';

const BlogsPage = () => {
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
        <div className="bg-[#f9faf9] font-sans -m-4 lg:-m-8 pb-20">
            {/* Hero Section */}
            <section className="relative h-[400px] md:h-[450px] flex flex-col justify-center overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=2000&auto=format&fit=crop')` }} 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
                <div className="relative max-w-7xl mx-auto px-6 sm:px-10 w-full">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 font-black text-[10px] uppercase tracking-[0.3em] px-4 py-1.5 rounded-full mb-4 border border-emerald-500/30">
                            <BookOpen size={14} /> Knowledge Hub
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6 tracking-tight">
                            Insights for the <br />
                            <span className="text-emerald-400 italic">Modern Farmer.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 max-w-xl font-medium leading-relaxed mb-10">
                            Expert opinions, technical guides, and the latest updates from the world of sustainable agriculture.
                        </p>
                    </div>
                </div>
            </section>
            
            <section className="px-6 sm:px-10 -mt-10 relative z-10 max-w-7xl mx-auto mb-16">
                <div className="bg-white rounded-2xl shadow-xl p-4 flex items-center gap-4 max-w-2xl border border-slate-100">
                    <Search className="text-slate-400 ml-2" size={24} />
                    <input 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-slate-900 font-medium text-lg placeholder-slate-400" 
                        placeholder="Search articles, pests, or crops..." 
                    />
                </div>
            </section>

            <section className="px-6 sm:px-10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-white rounded-3xl shadow-xl max-w-7xl mx-auto border border-slate-100">
                        <div className="w-12 h-12 border-4 border-slate-100 border-t-emerald-700 rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Opening Archives...</p>
                    </div>
                ) : filteredBlogs.length === 0 ? (
                    <div className="text-center py-32 space-y-4 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-7xl mx-auto">
                        <div className="text-slate-200 text-6xl font-black">404</div>
                        <p className="text-slate-400 font-bold">No articles found matching your criteria.</p>
                        <button onClick={() => setSearchTerm('')} className="text-emerald-700 font-black hover:underline uppercase tracking-widest text-[10px]">View all articles</button>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredBlogs.map((blog) => (
                            <div
                                key={blog.id}
                                className="group cursor-pointer bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
                                onClick={() => navigate(`/blog/${blog.slug}`)}
                            >
                                <div className="h-60 relative overflow-hidden bg-slate-50 border-b border-slate-100">
                                    <img
                                        src={blog.featured_image}
                                        alt={blog.title}
                                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                    
                                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                                        <div className="flex items-center gap-1.5 font-bold uppercase tracking-widest">
                                            <Calendar size={12}/> {new Date(blog.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                        <div className="flex items-center gap-1.5 font-bold uppercase tracking-widest">
                                            <User size={12}/> {blog.author || 'AgriTeam'}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 flex-1 flex flex-col space-y-4">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {blog.tags?.slice(0, 2).map((tag, idx) => (
                                            <span key={idx} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">
                                        {blog.title}
                                    </h3>

                                    <p className="text-slate-600 font-medium line-clamp-3 leading-relaxed flex-1 text-sm">
                                        {blog.excerpt}
                                    </p>

                                    <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                                        <div className="text-emerald-700 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 group-hover:gap-3 transition-all">
                                            Read Article <ArrowRight size={14} />
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

export default BlogsPage;
