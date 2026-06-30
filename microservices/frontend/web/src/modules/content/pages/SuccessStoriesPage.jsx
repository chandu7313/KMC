import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Award, TrendingUp, MapPin, Sprout, ArrowRight } from 'lucide-react';
import { useGlobalStore } from '@/app/store/globalStore';
import API from '@/core/api/api.config';
import { Link } from 'react-router-dom';

const SuccessStoriesPage = () => {
    const { backendUrl } = useGlobalStore();
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStories = async () => {
        try {
            const { data } = await axios.get(backendUrl + `${API.SUCCESS_STORY}/all`);
            if (data.success) {
                setStories(data.stories);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStories();
    }, []);

    return (
        <div className="bg-[#f9faf9] font-sans -m-4 lg:-m-8 pb-20">
            {/* Hero Section */}
            <section className="relative h-[400px] md:h-[450px] flex flex-col justify-center overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=2000&auto=format&fit=crop')` }} 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
                <div className="relative max-w-7xl mx-auto px-6 sm:px-10 w-full">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 font-black text-[10px] uppercase tracking-[0.3em] px-4 py-1.5 rounded-full mb-4 border border-green-500/30">
                            <Award size={14} /> Farmer Excellence
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6 tracking-tight">
                            Real Impact. <br />
                            <span className="text-green-400 italic">Real Results.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 max-w-xl font-medium leading-relaxed">
                            Discover how Kissan Mithar Consultancy is transforming farms across the nation through data-backed decisions and modern agricultural advisory.
                        </p>
                    </div>
                </div>
            </section>
            
            <section className="px-6 sm:px-10 -mt-10 relative z-10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-white rounded-3xl shadow-xl max-w-7xl mx-auto border border-slate-100">
                        <div className="w-12 h-12 border-4 border-slate-100 border-t-green-700 rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Gathering Stories...</p>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-24">
                        {stories.length === 0 ? (
                            <div className="col-span-full py-24 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
                                <p className="text-slate-500 font-medium">No success stories published yet. Check back soon!</p>
                            </div>
                        ) : (
                            stories.map((story) => (
                                <div
                                    key={story.id}
                                    className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col"
                                >
                                    <div className="h-60 relative overflow-hidden bg-slate-100">
                                        <img
                                            src={story.image}
                                            alt={story.farmer_name}
                                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black text-slate-900 shadow-sm uppercase tracking-widest flex items-center gap-1.5">
                                                <Sprout size={12} className="text-[#1b5e20]"/> {story.crop}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <h3 className="text-2xl font-black text-white leading-tight">
                                                {story.farmer_name}
                                            </h3>
                                            <p className="text-xs text-white/80 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
                                                <MapPin size={12} /> {story.district}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-8 flex-1 flex flex-col">
                                        <p className="text-slate-600 text-sm leading-relaxed font-medium line-clamp-4 flex-1">
                                            {story.description}
                                        </p>

                                        <div className="grid grid-cols-2 gap-3 pt-6 mt-6 border-t border-slate-100">
                                            <div className="bg-rose-50 p-4 rounded-xl border border-rose-100/50">
                                                <div className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-1">Before KMC</div>
                                                <div className="flex items-end gap-1">
                                                    <span className="text-lg font-black text-rose-700">{story.before_yield}</span>
                                                    <span className="text-[9px] font-bold text-rose-500 pb-1 uppercase">kg/ac</span>
                                                </div>
                                            </div>
                                            <div className="bg-[#f0fdf4] p-4 rounded-xl border border-[#bbf7d0]">
                                                <div className="text-[9px] font-black text-[#1b5e20] uppercase tracking-widest mb-1">After KMC</div>
                                                <div className="flex items-end gap-1">
                                                    <span className="text-lg font-black text-[#1b5e20]">{story.after_yield}</span>
                                                    <span className="text-[9px] font-bold text-[#1b5e20] pb-1 uppercase">kg/ac</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-[#1b5e20] flex items-center justify-center text-white shadow-md shadow-green-900/20">
                                                    <TrendingUp size={14} strokeWidth={3}/>
                                                </div>
                                                <div className="text-xs font-black text-[#1b5e20] uppercase tracking-wider">
                                                    {Math.round(((story.after_yield - story.before_yield) / story.before_yield) * 100)}% Boost
                                                </div>
                                            </div>
                                            <Link to="/contact" className="text-[10px] font-bold text-slate-400 hover:text-[#1b5e20] uppercase tracking-widest flex items-center gap-1 transition-colors">
                                                Get Help <ArrowRight size={10} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Company Impact Section */}
                <div className="max-w-7xl mx-auto bg-[#0f4d1e] text-white rounded-[2rem] p-12 md:p-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6 text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
                    
                    <div className="relative z-10 flex flex-col items-center">
                        <h3 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">10,000+</h3>
                        <div className="w-8 h-1 bg-[#4ade80] rounded-full mb-3"></div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-200">Farmers Supported</p>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <h3 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">40%</h3>
                        <div className="w-8 h-1 bg-[#4ade80] rounded-full mb-3"></div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-200">Avg Yield Increase</p>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <h3 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">15+</h3>
                        <div className="w-8 h-1 bg-[#4ade80] rounded-full mb-3"></div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-200">States Served</p>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <h3 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">95%</h3>
                        <div className="w-8 h-1 bg-[#4ade80] rounded-full mb-3"></div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-200">Satisfaction Rate</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SuccessStoriesPage;
