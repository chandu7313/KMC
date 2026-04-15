import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { FarmerModeContext } from '../../context/FarmerModeContext';
import AudioButton from '../../components/AudioButton';
import { assets } from '../../assets/assets';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import LanguageModal from '../../components/LanguageModal';
import OnboardingTour from '../../components/OnboardingTour';
import { useTranslation } from 'react-i18next';
import { 
    ArrowRight, 
    Sprout, 
    Settings, 
    TrendingUp, 
    ShoppingCart, 
    BookOpen, 
    Award,
    ChevronRight,
    Star,
    Globe,
    ShieldCheck,
    FlaskConical,
    BarChart3,
    CloudSun,
    HeartHandshake,
    CheckCircle2,
    PlayCircle,
    Phone,
    MapPin
} from 'lucide-react';

const Home = () => {
    const { t } = useTranslation();
    const { backendUrl, userData, navigate } = useContext(AppContext);
    const { isFarmerMode } = useContext(FarmerModeContext);
    const [blogs, setBlogs] = useState([]);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [blogRes, storyRes] = await Promise.all([
                axios.get(`${backendUrl}/api/blog/all`),
                axios.get(`${backendUrl}/api/success/all`)
            ]);
            if (blogRes.data.success) setBlogs(blogRes.data.blogs.slice(0, 3));
            if (storyRes.data.success) setStories(storyRes.data.stories.slice(0, 3));
        } catch (error) {
            console.error("Home Data Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white min-h-screen font-sans selection:bg-green-100 selection:text-green-900 overflow-x-hidden">
            <LanguageModal />
            <OnboardingTour />
            <Navbar />

            <Header />

            {/* --- COMPREHENSIVE SERVICES GRID --- */}
            <section id="services-section" className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto space-y-16">
                    <div className="text-center space-y-3 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 text-green-700 font-black text-[9px] uppercase tracking-[0.3em]">
                            <Sprout size={12} /> {t('ecosystem_excellence')}
                        </div>
                        <h2 className="text-4xl font-serif font-bold text-[#1f2d1f] tracking-tight">
                            {t('hero_title')}
                            <AudioButton text={t('hero_title')} className="ml-4 align-middle" />
                        </h2>
                        <p className="text-base text-slate-500 font-medium farmer-hide">
                            {t('hero_subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: t('soil_testing'), desc: 'Advanced lab analysis for precise nutrient mapping.', icon: FlaskConical, url: '/soil-crop-analysis' },
                            { title: t('market_prices'), desc: 'Real-time commodity tracking for maximum profit.', icon: BarChart3, url: '/market-prices' },
                            { title: t('weather_insights'), desc: 'Hyper-local forecasting for perfect harvest timing.', icon: CloudSun, url: '/whether-insights' },
                            { title: t('crop_advisory'), desc: 'Personalized AI & Expert guidance for every crop.', icon: HeartHandshake, url: '/crop-selection' }
                        ].map((service, idx) => (
                            <div 
                                key={idx}
                                onClick={() => navigate(service.url)}
                                className="bg-slate-50 p-7 rounded-[20px] border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all cursor-pointer group"
                            >
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-green-700 mb-5 border border-slate-100 shadow-sm group-hover:scale-110 group-hover:bg-green-700 group-hover:text-white transition-all">
                                    <service.icon size={22} />
                                </div>
                                <h3 className="text-lg font-black text-[#1f2d1f] mb-2">
                                    {service.title}
                                    <AudioButton text={service.title} className="ml-2" />
                                </h3>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed farmer-hide">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- PRECISION GROWTH PROCESS MAP --- */}
            <section className="py-24 px-6 bg-[#1f2d1f] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white rounded-full animate-ping"></div>
                </div>

                <div className="max-w-7xl mx-auto space-y-20 relative z-10">
                    <div className="text-center space-y-3 max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 text-green-400 font-black text-[9px] uppercase tracking-[0.3em]">
                            <TrendingUp size={12} /> The KMC Journey
                        </div>
                        <h2 className="text-4xl font-serif font-bold tracking-tight">
                            From Soil to <span className="text-green-500 italic text-5xl">Scale.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[44px] left-[5%] right-[5%] h-px bg-white/10 z-0"></div>

                        {[
                            { step: '01', title: 'Test', desc: 'Ship your soil sample to our certified labs.' },
                            { step: '02', title: 'Analyze', desc: 'Get data-backed crop & nutrient advice.' },
                            { step: '03', title: 'Supply', desc: 'Order certified inputs & tools from the hub.' },
                            { step: '04', title: 'Prosper', desc: 'Watch your yield grow by 40% on average.' }
                        ].map((item, idx) => (
                            <div key={idx} className="relative z-10 space-y-8 flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full bg-[#1f2d1f] border-4 border-green-600 flex items-center justify-center text-3xl font-black shadow-2xl shadow-green-900">
                                    {item.step}
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-2xl font-black">
                                        {item.title}
                                        <AudioButton text={item.title} className="ml-2" />
                                    </h4>
                                    <p className="text-white/40 text-sm font-medium leading-relaxed px-4 farmer-hide">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- MARKETPLACE HUB SECTION --- */}
            <section id="marketplace-section" className="py-24 px-6 bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center overflow-hidden">
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 text-green-700 font-black text-[9px] uppercase tracking-[0.3em]">
                                <ShoppingCart size={12} /> Smart Marketplace
                            </div>
                            <h2 className="text-4xl font-serif font-bold text-[#1f2d1f] tracking-tight leading-tight">
                                High-Performance <br/>Inputs & Machinery.
                                <AudioButton text="High-Performance Inputs and Machinery." className="ml-4 align-middle" />
                            </h2>
                            <p className="text-base text-slate-500 font-medium farmer-hide">
                                Direct access to the highest quality agricultural products, vetted by our agronomy team.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div 
                                onClick={() => navigate('/fertilizers')}
                                className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all cursor-pointer group"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-700 mb-6 border border-green-100 shadow-sm transition-transform group-hover:scale-110">
                                    <Sprout size={28} />
                                </div>
                                <h3 className="text-xl font-black text-[#1f2d1f] mb-2">
                                    Fertilizers
                                    <AudioButton text="Fertilizers" className="ml-2" />
                                </h3>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed farmer-hide">Boost soil performance with organic and chemical nutrients.</p>
                                <div className="mt-6 flex items-center gap-2 text-green-700 font-black text-[9px] uppercase tracking-widest group-hover:gap-3 transition-all">
                                    Browse Nutrients <ArrowRight size={14}/>
                                </div>
                            </div>

                            <div 
                                onClick={() => navigate('/equipments')}
                                className="bg-[#1f2d1f] p-8 rounded-[32px] text-white shadow-2xl hover:shadow-green-900/10 hover:-translate-y-1.5 transition-all cursor-pointer group"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-green-600 flex items-center justify-center text-white mb-6 shadow-xl shadow-green-900/40 transition-transform group-hover:scale-110">
                                    <Settings size={28} />
                                </div>
                                <h3 className="text-xl font-black mb-2">
                                    Equipment
                                    <AudioButton text="Equipment" className="ml-2" />
                                </h3>
                                <p className="text-white/40 text-xs font-medium leading-relaxed farmer-hide">Invest in modern tractors, drones, and precision tools.</p>
                                <div className="mt-6 flex items-center gap-2 text-green-500 font-black text-[9px] uppercase tracking-widest group-hover:gap-3 transition-all">
                                    View Machinery <ArrowRight size={14}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative group overflow-hidden">
                        <div className="aspect-[4/5] rounded-[64px] overflow-hidden shadow-2xl border-8 border-white/50 relative">
                            <img src={assets.drone_img || null} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt="Drone Agri" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            
                            <div className="absolute bottom-12 left-12 right-12 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[40px] space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg">
                                        <TrendingUp size={20}/>
                                    </div>
                                    <div className="font-black text-white text-lg tracking-tight whitespace-nowrap">40% Efficiency Gain</div>
                                </div>
                                <p className="text-white/70 text-sm font-medium">Switch to drones for 3x faster pest control and data collection.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- NARRATIVE MISSION SECTION --- */}
            <section className="py-24 px-6 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1 relative">
                            <div className="absolute -top-16 -left-16 w-52 h-52 bg-green-50 rounded-full blur-3xl -z-10"></div>
                            <div className="aspect-square rounded-[48px] bg-slate-100 overflow-hidden shadow-2xl relative">
                                <img src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=2600&auto=format&fit=crop" className="w-full h-full object-cover" alt="Mission Agri" />
                                <div className="absolute top-8 right-8 bg-white/90 backdrop-blur p-5 rounded-[24px] shadow-xl border border-white/20 max-w-[200px] animate-bounce-slow">
                                    <h5 className="font-black text-[#1f2d1f] text-xs mb-1 uppercase tracking-widest">Our Promise</h5>
                                    <p className="text-slate-500 text-[10px] font-medium italic leading-relaxed">"To bridge the gap between rural farms and global standards through technology."</p>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 space-y-8">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 text-green-700 font-black text-[9px] uppercase tracking-[0.3em]">
                                    <Award size={12} /> Driven by Purpose
                                </div>
                                <h2 className="text-5xl font-serif font-bold text-[#1f2d1f] tracking-tight leading-[1.1]">
                                    A Legacy of <br/><span className="text-green-700 italic">Farmer First.</span>
                                    <AudioButton text="A Legacy of Farmer First." className="ml-4 align-middle" />
                                </h2>
                                <p className="text-lg text-slate-500 font-medium leading-relaxed farmer-hide">
                                    KMC isn't just a platform; it's a movement. We started with a single lab in Pune and now support thousands across the country.
                                </p>
                            </div>
                            
                            <div className="space-y-4">
                                {[
                                    'Lab-certified input testing.',
                                    'Unbiased AI-driven crop advice.',
                                    'Transparent market pricing.',
                                    'Doorstep delivery of machinery.'
                                ].map((bullet, i) => (
                                    <div key={i} className="flex items-center gap-4 text-[#1f2d1f] font-black text-sm uppercase tracking-wider">
                                        <CheckCircle2 className="text-green-600" size={20}/> {bullet}
                                    </div>
                                ))}
                            </div>

                            <button onClick={() => navigate('/about')} className="bg-slate-50 border border-slate-100 hover:bg-slate-100 px-10 py-5 rounded-full text-[#1f2d1f] font-black text-[10px] uppercase tracking-[0.3em] transition-all">
                                Read Our Story
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- VOICES OF GROWTH (SUCCESS STORIES) --- */}
            <section className="py-24 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto space-y-16">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 text-green-700 font-black text-[9px] uppercase tracking-[0.3em]">
                                <Award size={12} /> Voices of Growth
                            </div>
                            <h2 className="text-4xl font-serif font-bold text-[#1f2d1f] tracking-tight leading-tight">
                                Real Impact. <br/><span className="text-green-700 italic text-5xl">Proven Results.</span>
                                <AudioButton text="Real Impact. Proven Results." className="ml-4 align-middle" />
                            </h2>
                        </div>
                        <button onClick={() => navigate('/success-stories')} className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] hover:text-green-700 transition-colors flex items-center gap-3 pb-2">
                           View All Stories <ArrowRight size={16}/>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {loading ? (
                             [1, 2, 3].map(i => <div key={i} className="aspect-[4/5] bg-slate-100 rounded-[48px] animate-pulse"></div>)
                        ) : (
                            stories.map(story => (
                                <div key={story._id} className="group relative aspect-[4/5] rounded-[56px] overflow-hidden shadow-xl hover:shadow-2xl transition-all h-full">
                                    <img src={story.image || null} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                    
                                    <div className="absolute top-8 left-8">
                                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur border border-white/20 px-4 py-1.5 rounded-full text-white font-black text-[8px] uppercase tracking-widest leading-none">
                                            <Star size={10} className="text-yellow-400 fill-yellow-400" /> Success story
                                        </div>
                                    </div>

                                    <div className="absolute bottom-10 left-10 right-10 space-y-4">
                                        <div className="space-y-1">
                                            <div className="text-green-400 font-black text-xs uppercase tracking-widest">{story.crop} Expert</div>
                                            <h3 className="text-3xl font-black text-white">{story.farmerName}</h3>
                                        </div>
                                        <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                                            <div>
                                                <div className="text-white font-black text-xl">{Math.round(((story.afterYield - story.beforeYield) / story.beforeYield) * 100)}%</div>
                                                <div className="text-white/40 font-black text-[8px] uppercase tracking-widest">Yield Boost</div>
                                            </div>
                                            <div className="w-px h-8 bg-white/10"></div>
                                            <div className="text-white/60 text-xs font-medium italic line-clamp-2">"{story.description.slice(0, 60)}..."</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* --- ADVISORY TRUST BAR --- */}
            <section className="py-24 px-6 bg-[#1f2d1f] relative overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                    <div className="flex items-start gap-6 border-b md:border-b-0 md:border-r border-white/10 pb-12 md:pb-0 md:pr-12">
                        <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-green-900/20">
                            <ShieldCheck size={28} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xl font-black text-white">Secure Advisory</h4>
                            <p className="text-white/40 text-sm font-medium leading-relaxed">Your data is yours. We encrypt soil records for complete security.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-6 border-b md:border-b-0 md:border-r border-white/10 pb-12 md:pb-0 md:pr-12">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white shrink-0 border border-white/10 backdrop-blur">
                            <Star size={28} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xl font-black text-white">Expert Curation</h4>
                            <p className="text-white/40 text-sm font-medium leading-relaxed">Every nutrient and tool in our store is lab-certified by technicians.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-6">
                        <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-green-900/20">
                            <Settings size={28} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xl font-black text-white">Fast Logistics</h4>
                            <p className="text-white/40 text-sm font-medium leading-relaxed">Dedicated machinery delivery across 15 states in 5-7 business days.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- LATEST FROM HUB (BLOGS) --- */}
            <section className="py-24 px-6 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto space-y-16">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 text-green-700 font-black text-[9px] uppercase tracking-[0.3em]">
                                <BookOpen size={12} /> Knowledge Hub
                            </div>
                            <h2 className="text-4xl font-serif font-bold text-[#1f2d1f] tracking-tight leading-tight">
                                Practical Insights. <br/><span className="text-green-700 italic">Smarter Farming.</span>
                            </h2>
                        </div>
                        <button onClick={() => navigate('/blogs')} className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] hover:text-green-700 transition-colors flex items-center gap-3 pb-2">
                           Visit The Archives <ArrowRight size={16}/>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {loading ? (
                             [1, 2, 3].map(i => <div key={i} className="space-y-6 animate-pulse">
                                <div className="aspect-[16/10] bg-slate-100 rounded-[32px]"></div>
                                <div className="h-4 bg-slate-100 w-1/3 rounded"></div>
                                <div className="h-8 bg-slate-100 w-3/4 rounded"></div>
                             </div>)
                        ) : (
                            blogs.map(blog => (
                                <div key={blog._id} className="group cursor-pointer" onClick={() => navigate(`/blog/${blog.slug}`)}>
                                    <div className="space-y-6">
                                        <div className="aspect-[16/10] rounded-[40px] overflow-hidden bg-white border border-slate-100 relative shadow-sm group-hover:shadow-2xl transition-all">
                                            <img src={blog.featuredImage || null} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={blog.title} />
                                        </div>
                                        <div className="px-2 space-y-4">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</div>
                                            <h3 className="text-2xl font-black text-[#1f2d1f] group-hover:text-green-700 transition-colors line-clamp-2 leading-tight">{blog.title}</h3>
                                            <p className="text-slate-500 font-medium text-sm line-clamp-2 leading-relaxed">{blog.excerpt}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* --- SELECT YOUR SUCCESS (PACKAGES) --- */}
            <section id="packages-section" className="py-24 px-6 bg-white relative">
                <div className="max-w-6xl mx-auto space-y-20">
                    <div className="text-center space-y-4 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 text-green-700 font-black text-[9px] uppercase tracking-[0.3em]">
                            <Star size={12} /> Flexible Growth Plans
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1f2d1f] tracking-tight">
                            Select Your <span className="text-green-700 italic">Success.</span>
                            <AudioButton text="Select Your Success." className="ml-4 align-middle" />
                        </h2>
                        <p className="text-base text-slate-500 font-medium farmer-hide">
                            Transparent pricing designed to scale with your farm, from initial soil testing to full-scale digital mastery.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Starter',
                                price: '999',
                                period: 'season',
                                desc: 'Perfect for small landholders getting started.',
                                features: [
                                    { text: 'Basic soil testing (1 sample)', icon: FlaskConical },
                                    { text: 'Crop selection advice', icon: CheckCircle2 },
                                    { text: 'Phone support', icon: Phone },
                                    { text: 'Market price alerts', icon: TrendingUp }
                                ],
                                theme: 'light'
                            },
                            {
                                name: 'Growth',
                                price: '2,999',
                                period: 'season',
                                desc: 'Comprehensive support for growing farms.',
                                features: [
                                    { text: 'Advanced soil testing (3 samples)', icon: FlaskConical },
                                    { text: 'Complete crop advisory', icon: CheckCircle2 },
                                    { text: 'Pest identification & solutions', icon: ShieldCheck },
                                    { text: 'Priority WhatsApp support', icon: Globe },
                                    { text: '1 farm visit per season', icon: MapPin },
                                    { text: 'Training workshop access', icon: Award }
                                ],
                                theme: 'dark',
                                popular: true
                            },
                            {
                                name: 'Premium',
                                price: '5,999',
                                period: 'season',
                                desc: 'Full-service package for serious farmers.',
                                features: [
                                    { text: 'Unlimited comprehensive analysis', icon: FlaskConical },
                                    { text: 'Year-round crop planning', icon: CheckCircle2 },
                                    { text: 'Integrated pest management', icon: ShieldCheck },
                                    { text: 'Dedicated personal advisor', icon: HeartHandshake },
                                    { text: 'Monthly on-site farm visits', icon: MapPin },
                                    { text: 'Market linkage & certification', icon: Award }
                                ],
                                theme: 'light'
                            }
                        ].map((pkg, idx) => (
                            <div 
                                key={idx}
                                className={`relative rounded-[40px] p-8 flex flex-col h-full transition-all duration-500 hover:-translate-y-4 ${
                                    pkg.theme === 'dark' 
                                    ? 'bg-[#1f2d1f] text-white shadow-2xl shadow-green-900/40' 
                                    : 'bg-slate-50 border border-slate-100'
                                }`}
                            >
                                {pkg.popular && (
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[9px] font-black uppercase tracking-[0.2em] px-6 py-2.5 rounded-full shadow-xl">
                                        Most Popular
                                    </div>
                                )}

                                <div className="space-y-6 flex-grow">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black">
                                            {pkg.name}
                                            <AudioButton text={pkg.name + " package"} className="ml-2" />
                                        </h3>
                                        <p className={`${pkg.theme === 'dark' ? 'text-white/40' : 'text-slate-400'} text-xs font-medium leading-relaxed farmer-hide`}>
                                            {pkg.desc}
                                        </p>
                                    </div>

                                    <div className="flex items-baseline gap-1">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${pkg.theme === 'dark' ? 'text-green-500' : 'text-green-700'}`}>INR</span>
                                        <span className="text-4xl font-black tabular-nums">{pkg.price}</span>
                                        <span className={`${pkg.theme === 'dark' ? 'text-white/20' : 'text-slate-300'} text-sm font-medium`}>/{pkg.period}</span>
                                    </div>

                                    <div className={`h-px ${pkg.theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'}`}></div>

                                    <ul className="space-y-4">
                                        {pkg.features.map((feat, fIdx) => (
                                            <li key={fIdx} className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                                    pkg.theme === 'dark' ? 'bg-white/5 text-green-500' : 'bg-white text-green-700 shadow-sm border border-slate-100'
                                                }`}>
                                                    <feat.icon size={14} />
                                                </div>
                                                <span className={`text-xs font-semibold ${pkg.theme === 'dark' ? 'text-white/60' : 'text-slate-600'}`}>
                                                    {feat.text}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button 
                                    onClick={() => navigate('/login')}
                                    className={`mt-8 w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 ${
                                        pkg.theme === 'dark'
                                        ? 'bg-green-600 hover:bg-green-500 text-white shadow-xl shadow-green-900/20'
                                        : 'bg-white border border-slate-200 text-[#1f2d1f] hover:bg-slate-100'
                                    }`}
                                >
                                    {t('get_started')}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FINAL IMPACT CTA --- */}
            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-[#1f2d1f] rounded-[48px] p-16 text-center space-y-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-green-600/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-1000"></div>
                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 group-hover:scale-125 transition-transform duration-1000"></div>
                        
                        <div className="space-y-5 relative z-10">
                            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tighter leading-tight">
                                Ready to Transform <br/>Your <span className="text-green-500 italic">Financial Future?</span>
                            </h2>
                            <p className="text-lg text-white/50 max-w-2xl mx-auto font-medium leading-relaxed">
                                Join 10,000+ happy farmers across 15 states who are growing their yield and profits with KMC Advisor.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
                            <button 
                                onClick={() => navigate('/login')}
                                className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-green-900 transition-all active:scale-95"
                            >
                                {t('get_started')}
                            </button>
                            <button 
                                onClick={() => navigate('/contact')}
                                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] transition-all backdrop-blur"
                            >
                                Contact Expert
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
            
            <style jsx="true">{`
                @keyframes slow-zoom {
                    0% { transform: scale(1.05); }
                    100% { transform: scale(1.15); }
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                .animate-slow-zoom {
                    animation: slow-zoom 20s infinite alternate ease-in-out;
                }
                .animate-bounce-slow {
                    animation: bounce-slow 6s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default Home;
