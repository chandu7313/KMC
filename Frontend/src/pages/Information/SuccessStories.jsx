import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import Navbar from "../../components/Navbar";
import { Award, TrendingUp, MapPin, Sprout } from 'lucide-react';

const SuccessStories = () => {
    const { backendUrl } = useContext(AppContext);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStories = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/success/all');
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
        <div className="bg-slate-50 min-h-screen">
            <Navbar />
            
            <section className="pt-32 pb-24 px-6">
                {/* Heading */}
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 font-black text-[10px] uppercase tracking-[0.3em] px-4 py-1.5 rounded-full mb-2">
                        <Award size={14} /> Farmer Excellence
                    </div>
                    <h2 className="text-6xl font-serif font-bold text-[#1f2d1f] tracking-tight">
                        Real Impact. <span className="text-green-700 italic">Real Results.</span>
                    </h2>
                    <p className="text-lg text-slate-500 font-medium">
                        Transforming farms across the nation through data-backed decisions and modern advisory.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <div className="w-12 h-12 border-4 border-slate-100 border-t-green-700 rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Gathering Stories...</p>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24">
                        {stories.map((story) => (
                            <div
                                key={story._id}
                                className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all group"
                            >
                                <div className="h-64 h-full w-full relative overflow-hidden bg-slate-100">
                                    <img
                                        src={story.image}
                                        alt={story.farmerName}
                                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black text-slate-900 shadow-sm uppercase tracking-widest flex items-center gap-2">
                                            <Sprout size={12} className="text-green-600"/> {story.crop}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-10 space-y-6">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black text-[#1f2d1f]">
                                            {story.farmerName}
                                        </h3>
                                        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                            <MapPin size={14} className="text-green-700"/> {story.district}
                                        </p>
                                    </div>

                                    <p className="text-slate-600 text-sm leading-relaxed font-medium line-clamp-3">
                                        {story.description}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                                        <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
                                            <div className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Before Advisor</div>
                                            <div className="flex items-end gap-1">
                                                <span className="text-xl font-black text-rose-700">{story.beforeYield}</span>
                                                <span className="text-[10px] font-bold text-rose-400 pb-1 uppercase">kg/acre</span>
                                            </div>
                                        </div>
                                        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 border-2 shadow-sm">
                                            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">After Performance</div>
                                            <div className="flex items-end gap-1">
                                                <span className="text-xl font-black text-emerald-700">{story.afterYield}</span>
                                                <span className="text-[10px] font-bold text-emerald-400 pb-1 uppercase">kg/acre</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 pt-2">
                                        <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white shadow-lg shadow-green-100">
                                            <TrendingUp size={18}/>
                                        </div>
                                        <div className="text-sm font-black text-green-800 uppercase tracking-tighter">
                                            {Math.round(((story.afterYield - story.beforeYield) / story.beforeYield) * 100)}% Yield Improvement
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Company Impact Section */}
                <div className="max-w-6xl mx-auto bg-[#1f2d1f] text-white rounded-[56px] p-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-700/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-700/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
                    
                    <div className="space-y-4 relative z-10">
                        <h3 className="text-5xl font-black mb-2 flex flex-col items-center">
                            10,000+
                            <div className="w-8 h-1 bg-green-500 rounded-full mt-2"></div>
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Farmers Supported</p>
                    </div>

                    <div className="space-y-4 relative z-10">
                        <h3 className="text-5xl font-black mb-2 flex flex-col items-center">
                            40%
                            <div className="w-8 h-1 bg-green-500 rounded-full mt-2"></div>
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Avg Yield Increase</p>
                    </div>

                    <div className="space-y-4 relative z-10">
                        <h3 className="text-5xl font-black mb-2 flex flex-col items-center">
                            15+
                            <div className="w-8 h-1 bg-green-500 rounded-full mt-2"></div>
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">States Served</p>
                    </div>

                    <div className="space-y-4 relative z-10">
                        <h3 className="text-5xl font-black mb-2 flex flex-col items-center">
                            95%
                            <div className="w-8 h-1 bg-green-500 rounded-full mt-2"></div>
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Satisfaction Rate</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SuccessStories;
