import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../layouts/components/Navbar";
import Footer from "../../layouts/components/Footer";
import LanguageModal from '../../shared/components/ui/LanguageModal';
// Icons
import { 
  ArrowRight, Sprout, TrendingUp, FlaskConical, CloudSun, Leaf, 
  MapPin, Check, Phone, ShieldCheck, Calendar, CheckCircle2, 
  ChevronRight, X, AlertCircle, Info, ChevronUp
} from 'lucide-react';
import { assets } from '../../assets/assets';

// Custom Hook for Scroll Animation
const useCountUp = (target, duration = 2000, triggerRef) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!triggerRef.current || hasAnimated) return;
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setHasAnimated(true);
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            setCount(target);
            clearInterval(timer);
          } else {
            setCount(Math.ceil(start));
          }
        }, 16);
      }
    }, { threshold: 0.5 });

    observer.observe(triggerRef.current);
    return () => observer.disconnect();
  }, [target, duration, hasAnimated, triggerRef]);

  return count;
};

// Generic Modal Wrapper
const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-white rounded-full p-1 shadow-sm">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};


const Home = () => {
    const navigate = useNavigate();

    // -- Global State --
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [toasts, setToasts] = useState([]);

    // -- Section Refs --
    const servicesRef = useRef(null);
    const statsRef = useRef(null);
    const processLineRef = useRef(null);
    
    // -- Modal States --
    const [isOtpModalOpen, setOtpModalOpen] = useState(false);
    const [isExpertModalOpen, setExpertModalOpen] = useState(false);
    const [isGovtModalOpen, setGovtModalOpen] = useState(false);
    const [isVisitModalOpen, setVisitModalOpen] = useState(false);
    const [isPricingModalOpen, setPricingModalOpen] = useState(false);
    
    // -- UI Component States --
    const [visitDateSelection, setVisitDateSelection] = useState('Oct 13');
    const [pricingToggle, setPricingToggle] = useState('monthly');
    const [emailInput, setEmailInput] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [processProgress, setProcessProgress] = useState(0);

    // -- Toast Helper --
    const showToast = useCallback((msg, type = 'success') => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, msg, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 3000);
    }, []);

    // -- Global Scroll Logic --
    useEffect(() => {
      const handleScroll = () => {
        const totalScroll = document.documentElement.scrollTop;
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scroll = `${totalScroll / windowHeight}`;
        
        setScrollProgress(scroll * 100);
        setShowBackToTop(totalScroll > 400);

        // Process line fill logic
        if (processLineRef.current) {
          const rect = processLineRef.current.getBoundingClientRect();
          // If the element is within the viewport calculate percentage
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            const visibility = 1 - (rect.bottom / (window.innerHeight + rect.height));
            setProcessProgress(Math.min(Math.max(visibility * 150, 0), 100)); // Scales faster
          }
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    const scrollToServices = () => servicesRef.current?.scrollIntoView({ behavior: 'smooth' });

    // -- Input Formatting --
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // -- Stats Counters --
    const countAcres = useCountUp(42, 2000, statsRef);
    const countConsultants = useCountUp(165, 2000, statsRef);
    const countProfit = useCountUp(46, 2000, statsRef);

    return (
        <div className="bg-[#f9faf9] min-h-screen font-sans selection:bg-green-100 selection:text-green-900 overflow-x-hidden !scroll-smooth">
            {/* Top Auto Progress Bar */}
            <div 
              className="fixed top-0 left-0 h-1 bg-green-500 z-[9999] transition-all duration-150" 
              style={{ width: `${scrollProgress}%` }}
            />

            {/* Back to Top Button */}
            <div className={`fixed bottom-6 right-6 z-[90] transition-all duration-300 ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
              <button 
                onClick={scrollToTop}
                className="w-12 h-12 bg-[#1f2d1f] text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-green-700 hover:scale-110 active:scale-95 transition-all"
              >
                <ChevronUp size={24} />
              </button>
            </div>

            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
              {toasts.map(toast => (
                <div key={toast.id} className="bg-slate-900/95 backdrop-blur text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10 fade-in duration-300">
                  <CheckCircle2 className="text-green-400" size={18} />
                  <span className="text-sm font-medium">{toast.msg}</span>
                </div>
              ))}
            </div>

            <LanguageModal />
            <Navbar /> {/* Ensure Navbar remains mostly untouched via external CSS wrapper if needed, layout handles this */}

            {/* --- HERO SECTION --- */}
            <section className="bg-[#1f2d1f] relative overflow-hidden py-24 -mt-[24px] pt-[120px]">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 text-green-400 font-bold text-xs uppercase tracking-widest">
                             KISAN MITHAR CONSULTANCY
                        </div>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
                            Data-Driven <br/>Farming for a <br/><span className="text-slate-300 italic font-serif">Prosperous</span> <br/>Future.
                        </h1>
                        <p className="text-lg text-white/50 max-w-md font-medium leading-relaxed">
                            Empowering modern estates with precision agricultural insights, real-time market intelligence, and sustainable growth strategies.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                            <button 
                                onClick={() => setOtpModalOpen(true)}
                                className="w-full sm:w-auto bg-[#8ceb78] hover:bg-[#7ddc6a] hover:brightness-90 active:scale-95 text-[#1f2d1f] px-8 py-4 rounded-xl font-bold text-sm transition-all shadow-lg shadow-green-500/20"
                            >
                                Get Started
                            </button>
                            <button 
                                onClick={scrollToServices}
                                className="w-full sm:w-auto bg-transparent border border-white/30 hover:bg-white/10 active:scale-95 text-white px-8 py-4 rounded-xl font-bold text-sm transition-all"
                            >
                                Learn More
                            </button>
                        </div>
                    </div>
                    
                    <div className="relative group cursor-pointer">
                        <div className="rounded-3xl overflow-hidden shadow-2xl relative h-[400px] md:h-[500px]">
                             <img src={assets.hero_image} alt="Farming Sunset" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        {/* 98% Success Rate Badge */}
                        <div className="absolute top-8 -right-4 md:-right-8 bg-white py-3 px-5 rounded-2xl shadow-xl flex items-center gap-3 hover:shadow-green-500/30 hover:ring-2 hover:ring-green-400 transition-all duration-300 z-10 animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <TrendingUp size={16} />
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Proven</div>
                                <div className="text-sm font-bold text-slate-900">98% Success Rate</div>
                            </div>
                        </div>
                        {/* 5000+ Farmers Badge */}
                        <div className="absolute -bottom-8 left-8 bg-white py-3 px-5 rounded-2xl shadow-xl flex items-center gap-3 hover:shadow-green-500/30 hover:ring-2 hover:ring-green-400 transition-all duration-300 z-10">
                            <div className="flex -space-x-2">
                                {[1,2,3].map((_,i) => (
                                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-green-${300 + (i*200)} z-[${3-i}]`}></div>
                                ))}
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Impact</div>
                                <div className="text-sm font-bold text-slate-900">5000+ Farmers</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- MAIN DASHBOARD / SERVICES LAYOUT --- */}
            <section ref={servicesRef} id="services" className="py-24 px-6 max-w-7xl mx-auto scroll-m-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Column: Core Services Grid */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold text-[#1f2d1f]">Our Core Services</h2>
                            <button onClick={()=>navigate('/services')} className="text-slate-500 text-sm font-bold flex items-center gap-2 hover:text-green-700 transition-colors group">
                                Explore all services <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
                            {[
                              { title: 'Soil Testing', desc: 'Detailed nutrient analysis for precision cultivation.', img: assets.soil_testing, link: '/soil-crop-analysis' },
                              { title: 'Fertilizers', desc: 'Customized blends based on act-level requests.', img: assets.services_images?.fertilizers, link: '/fertilizers' },
                              { title: 'Crop Selection', desc: 'Expert advice for region-resilient crop varieties.', img: assets.crop_selection, link: '/crop-selection' },
                              { title: 'Market Prices', desc: 'Live tracking of regional market rates for farmers.', img: assets.mandi_prices, link: '/market-prices' },
                              { title: 'Equipments', desc: 'Leasing and procurement of modern agri tools.', img: assets.equi, link: '/equipments' },
                              { title: 'Insights', desc: 'Deep data analytics for yield forecasting.', img: assets.insights, link: '/insights' }
                            ].map((s,i) => (
                              <div 
                                key={i} 
                                onClick={()=>navigate(s.link)}
                                className="bg-[#f0ede6] rounded-2xl p-4 cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-l-4 hover:border-l-green-500 transition-all duration-300 group border border-transparent"
                              >
                                  <div className="w-full h-32 rounded-xl overflow-hidden mb-4 bg-slate-200">
                                      <img src={s.img || "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=400"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={s.title} />
                                  </div>
                                  <h3 className="font-bold text-slate-900 mb-1">{s.title}</h3>
                                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">{s.desc}</p>
                                  <ArrowRight size={16} className="text-slate-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all"/>
                              </div>
                            ))}
                        </div>

                        {/* Features Row */}
                        <div className="bg-[#f0ede6] rounded-3xl p-10 text-center space-y-8 mt-12 border border-slate-200 shadow-sm">
                            <h3 className="text-2xl font-bold text-[#1f2d1f]">Everything You Need To Scale</h3>
                            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 relative z-10">
                                {[
                                  { title: 'Soil Testing', icon: FlaskConical, tip: 'Analyze NPK levels', link: '/soil-crop-analysis' },
                                  { title: 'Market Prices', icon: TrendingUp, tip: 'Live mandi rates', link: '/market-prices' },
                                  { title: 'Weather Insights', icon: CloudSun, tip: '7-day forecast', link: '/insights' },
                                  { title: 'Crop Advisory', icon: Sprout, tip: 'AI expert guidance', link: '/crop-selection' }
                                ].map((item, i) => (
                                  <div 
                                    key={i} 
                                    className="flex flex-col items-center gap-3 cursor-pointer group relative"
                                    onClick={()=>navigate(item.link)}
                                  >
                                      {/* Tooltip */}
                                      <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-slate-800 text-white text-[10px] px-3 py-1 rounded-full font-bold shadow-lg z-20 pointer-events-none whitespace-nowrap">
                                        {item.tip}
                                      </div>

                                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                                        <item.icon size={24}/>
                                      </div>
                                      <span className="text-xs font-bold text-slate-700 group-hover:text-green-700 transition-colors">{item.title}</span>
                                  </div>
                                ))}
                            </div>
                        </div>

                        {/* From Soil to Scale Section */}
                        <div className="bg-[#1f2d1f] rounded-[2rem] p-10 md:p-16 text-center mt-12 relative overflow-hidden shadow-2xl">
                            <h3 className="text-3xl font-bold text-white mb-2 relative z-10">From Soil to Scale</h3>
                            <p className="text-white/60 text-sm mb-12 relative z-10">Our proprietary framework for agricultural excellence</p>
                            
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10" ref={processLineRef}>
                                {/* Connecting line Background */}
                                <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-white/10 -z-10 rounded-full"/>
                                {/* Connecting line foreground (Animated based on scroll) */}
                                <div 
                                  className="hidden md:block absolute top-[28px] left-[10%] h-[2px] bg-green-500 -z-10 rounded-full transition-all duration-300 ease-out"
                                  style={{ width: `${processProgress * 0.8}%` }} // multiply by 0.8 to cover the 10% to 90% space
                                />

                                {[
                                    { num: '01', title: 'Test' },
                                    { num: '02', title: 'Analyze' },
                                    { num: '03', title: 'Supply' },
                                    { num: '04', title: 'Prosper' }
                                ].map((step, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-4 bg-[#1f2d1f] group cursor-default">
                                        <div className="w-14 h-14 rounded-full border-2 border-green-500 bg-[#1f2d1f] text-green-400 flex items-center justify-center font-bold text-lg shadow-lg shadow-green-900/50 group-hover:ring-4 group-hover:ring-green-500/20 transition-all duration-300">
                                            {step.num}
                                        </div>
                                        <span className="text-sm font-bold text-white uppercase tracking-wider group-hover:text-green-300 transition-colors">{step.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar Widgets */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Talk With Expert Widget */}
                        <div className="bg-[#1f2d1f] rounded-3xl p-6 relative overflow-hidden shadow-xl border border-[#304530]">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                    <Phone size={24} />
                                </div>
                                <div className="w-12 h-12 bg-white/10 rounded-full overflow-hidden border border-white/20">
                                    <img src="https://images.unsplash.com/photo-1594824436998-dd40e4f69d89?auto=format&fit=crop&q=80&w=100&grayscale" className="w-full h-full object-cover" alt="Expert"/>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Talk with Expert</h3>
                            <p className="text-white/50 text-xs mb-6">Connect with Dr. Sharma for immediate soil & crop guidance.</p>
                            <button 
                              onClick={() => setExpertModalOpen(true)}
                              className="w-full bg-[#8ceb78] hover:bg-[#7ddc6a] active:scale-95 text-[#1f2d1f] py-3 rounded-xl font-bold text-sm transition-all shadow-lg"
                            >
                                Book a Call
                            </button>
                        </div>

                        {/* Mandi Prices Widget */}
                        <div className="bg-[#f0ede6] rounded-3xl p-6 border border-slate-200">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold text-slate-900">Mandi Prices</h3>
                                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Live Data"/>
                                </div>
                                <TrendingUp size={16} className="text-green-600"/>
                            </div>
                            <div className="space-y-3 mb-4">
                                {[
                                    { name: 'Cotton', price: '₹6,400', dir: 'up' },
                                    { name: 'Rice', price: '₹2,100', dir: 'down' },
                                    { name: 'Wheat', price: '₹2,450', dir: 'up' }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl text-sm border border-transparent hover:bg-[#e4fcdd] hover:border-green-200 transition-colors cursor-default">
                                        <span className="font-semibold text-slate-700">{item.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-900">{item.price}</span>
                                            {item.dir === 'up' ? <TrendingUp size={14} className="text-green-500"/> : <TrendingUp size={14} className="text-red-500 rotate-180"/>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={()=>navigate('/market-prices')} className="text-[10px] text-green-700 font-bold uppercase tracking-widest hover:text-green-800 transition-colors flex items-center justify-center w-full">
                                View All Prices <ArrowRight size={12} className="ml-1"/>
                            </button>
                        </div>

                        {/* Govt Schemes Widget */}
                        <div className="bg-[#f0ede6] rounded-3xl p-6 border border-slate-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-900">Govt. Schemes</h3>
                                <ShieldCheck size={16} className="text-green-600"/>
                            </div>
                            <div className="space-y-3 mb-6">
                                <div className="group relative flex justify-between items-center bg-white p-3 rounded-xl text-sm hover:border-green-200 border border-transparent transition-colors cursor-help">
                                    <span className="font-semibold text-slate-700">PM KISAN</span>
                                    <span className="bg-green-200 text-green-800 text-[10px] font-bold px-2 py-1 rounded uppercase">Active</span>
                                    {/* Tooltip */}
                                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-slate-800 text-white text-[10px] px-3 py-2 rounded-lg font-bold shadow-lg z-20 w-48 text-center pointer-events-none">
                                        Provides ₹6000/year to landholding farmers.
                                    </div>
                                </div>
                                <div className="group relative flex justify-between items-center bg-white p-3 rounded-xl text-sm hover:border-green-200 border border-transparent transition-colors cursor-help">
                                    <span className="font-semibold text-slate-700">PMFBY</span>
                                    <span className="bg-green-200 text-green-800 text-[10px] font-bold px-2 py-1 rounded uppercase">Active</span>
                                    {/* Tooltip */}
                                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-slate-800 text-white text-[10px] px-3 py-2 rounded-lg font-bold shadow-lg z-20 w-48 text-center pointer-events-none">
                                        Crop insurance scheme against natural risks.
                                    </div>
                                </div>
                            </div>
                            <button 
                              onClick={() => navigate('/government-schemes')}
                              className="w-full bg-[#1f2d1f] hover:bg-slate-800 active:scale-95 text-white py-3 rounded-xl font-bold text-sm transition-all"
                            >
                                View More
                            </button>
                        </div>

                        {/* Book Field Visit Widget */}
                        <div className="bg-[#f0ede6] rounded-3xl p-6 border border-slate-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-900">Book Field Visit</h3>
                                <Calendar size={16} className="text-green-600"/>
                            </div>
                            <div className="flex justify-between gap-2 mb-6 text-center">
                                {['Oct 13', 'Oct 14', 'Oct 15'].map(date => (
                                  <div 
                                    key={date}
                                    onClick={() => setVisitDateSelection(date)}
                                    className={`flex-1 rounded-xl py-3 cursor-pointer transition-all ${
                                      visitDateSelection === date 
                                      ? 'bg-green-700 text-white shadow-md border border-green-800' 
                                      : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-400'
                                    }`}
                                  >
                                      <div className="text-[10px] uppercase font-bold">{date.split(' ')[0]}</div>
                                      <div className="text-lg font-black">{date.split(' ')[1]}</div>
                                  </div>
                                ))}
                            </div>
                            <button 
                              onClick={() => setVisitModalOpen(true)}
                              className="w-full bg-[#1f2d1f] hover:bg-slate-800 active:scale-95 text-white py-3 rounded-xl font-bold text-sm transition-all"
                            >
                                Book Now
                            </button>
                        </div>

                    </div>
                </div>
            </section>

            {/* --- INPUTS & STATS --- */}
            <section className="py-12 px-6 max-w-7xl mx-auto space-y-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <h2 className="text-3xl font-bold text-[#1f2d1f]">High Performance <br/>Inputs</h2>
                        
                        <div 
                          onClick={()=>navigate('/equipments')}
                          className="bg-[#f0ede6] p-6 rounded-3xl flex gap-6 items-center cursor-pointer hover:border-l-4 hover:border-l-green-500 hover:bg-white hover:shadow-lg transition-all border border-transparent group"
                        >
                            <div className="w-16 h-16 bg-[#dbe6df] rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-green-100 transition-colors">
                                <Sprout className="text-[#1f2d1f] group-hover:text-green-700 transition-colors" size={28}/>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-1 group-hover:text-green-800 transition-colors">Modern Equipment</h4>
                                <p className="text-slate-500 text-sm">Access top-tier drones and advanced irrigation systems.</p>
                            </div>
                        </div>

                        <div 
                          onClick={()=>navigate('/fertilizers')}
                          className="bg-[#f0ede6] p-6 rounded-3xl flex gap-6 items-center cursor-pointer hover:border-l-4 hover:border-l-green-500 hover:bg-white hover:shadow-lg transition-all border border-transparent group"
                        >
                            <div className="w-16 h-16 bg-[#dbe6df] rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-green-100 transition-colors">
                                <Leaf className="text-[#1f2d1f] group-hover:text-green-700 transition-colors" size={28}/>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-1 group-hover:text-green-800 transition-colors">Premium Fertilizers</h4>
                                <p className="text-slate-500 text-sm">Bio-engineered fertilizers tailored for Indian soil profiles.</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative rounded-3xl overflow-hidden h-[400px] group shadow-inner">
                        <img src={assets.drone_img} className="w-full h-full object-cover bg-slate-100" alt="Inputs" />
                        <div className="absolute top-8 right-8 bg-[#1f2d1f]/90 backdrop-blur-md text-white p-4 rounded-xl border border-white/10 shadow-2xl transform scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                            <div className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-1">Efficiency Gain</div>
                            <div className="text-3xl font-black">24%</div>
                            <div className="text-xs text-white/50 font-medium">Increased Yield</div>
                        </div>
                    </div>
                </div>

                {/* Dark Stats Banner */}
                <div ref={statsRef} className="bg-[#2a2422] rounded-[2rem] p-12 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"/>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10 relative z-10">
                        <div className="pt-6 md:pt-0 hover:bg-white/5 rounded-xl transition-colors p-4">
                            <div className="text-5xl font-black text-[#a6e297] mb-2">{countAcres + (countAcres > 41 ? '.5' : '')}M+</div>
                            <div className="text-xs font-bold text-white/50 uppercase tracking-widest">SQ. MT TESTED SOIL FT</div>
                        </div>
                        <div className="pt-6 md:pt-0 hover:bg-white/5 rounded-xl transition-colors p-4">
                            <div className="text-5xl font-black text-[#a6e297] mb-2">{countConsultants}</div>
                            <div className="text-xs font-bold text-white/50 uppercase tracking-widest">EXPERT CONSULTANTS</div>
                        </div>
                        <div className="pt-6 md:pt-0 hover:bg-white/5 rounded-xl transition-colors p-4">
                            <div className="text-5xl font-black text-[#a6e297] mb-2">{countProfit}%</div>
                            <div className="text-xs font-bold text-white/50 uppercase tracking-widest">AVG. FARMER PROFIT LIFT</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PRACTICAL INSIGHTS BLOG --- */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-[#1f2d1f] mb-12">Practical Insights</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Blog 1 */}
                    <div onClick={() => navigate('/blog/wheat-blight')} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-green-500 transition-all border border-slate-100 flex flex-col h-full cursor-pointer group">
                        <div className="h-48 w-full bg-slate-200 overflow-hidden">
                            <img src={assets.wheat} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Wheat" />
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="mb-4">
                                <span className="bg-green-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">Crop Care</span>
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 mb-3 group-hover:text-green-700 transition-colors">Managing Wheat Blight in Humid Seasons</h3>
                            <p className="text-sm text-slate-500 mt-auto">Learn the early warning signs and organic treatment options to protect your crop...</p>
                        </div>
                    </div>

                    {/* Blog 2 */}
                    <div onClick={() => navigate('/blog/cotton-outlook')} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500 transition-all border border-slate-100 flex flex-col h-full cursor-pointer group">
                        <div className="h-48 w-full bg-slate-200 overflow-hidden">
                            <img src={assets.cotton} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Cotton" />
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="mb-4">
                                <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">Markets</span>
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">2024 Cotton Market Outlook: What to Expect</h3>
                            <p className="text-sm text-slate-500 mt-auto">Global supply chain shifts are creating new export pathways for Indian growers...</p>
                        </div>
                    </div>

                    {/* Blog 3 */}
                    <div onClick={() => navigate('/blog/drip-irrigation')} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-teal-500 transition-all border border-slate-100 flex flex-col h-full cursor-pointer group">
                        <div className="h-48 w-full bg-slate-200 overflow-hidden">
                            <img src={assets.drip} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Drip" />
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="mb-4">
                                <span className="bg-teal-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">Tech</span>
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 mb-3 group-hover:text-teal-700 transition-colors">Drip Irrigation: A Guide to High Efficiency</h3>
                            <p className="text-sm text-slate-500 mt-auto">Maximize your water usage with these automated IoT systems and save overheads...</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PRICING --- */}
            <section className="py-24 px-6 max-w-6xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-[#1f2d1f] mb-2">Select Your Success</h2>
                <p className="text-slate-500 text-sm mb-8">Plans designed for every stage of agriculture growth.</p>

                {/* Billing Toggle */}
                <div className="flex justify-center items-center gap-4 mb-16">
                    <span className={`text-sm font-bold ${pricingToggle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
                    <button 
                      onClick={() => setPricingToggle(p => p === 'monthly' ? 'yearly' : 'monthly')}
                      className="w-14 h-7 bg-green-600 rounded-full relative p-1 transition-colors"
                    >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${pricingToggle === 'yearly' ? 'translate-x-7' : 'translate-x-0'}`}/>
                    </button>
                    <span className={`text-sm font-bold ${pricingToggle === 'yearly' ? 'text-slate-900' : 'text-slate-400'}`}>Yearly <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-1">-20%</span></span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative z-10">
                    
                    {/* Starter */}
                    <div className="bg-white border border-slate-200 hover:border-green-400 rounded-[3rem] p-10 flex flex-col text-left py-12 transition-all hover:shadow-xl group">
                        <h3 className="text-xl font-bold text-slate-900 text-center mb-6">Starter</h3>
                        <div className="text-center mb-10 flex items-baseline justify-center">
                            <span className="text-4xl font-black text-slate-900 transition-all">
                                {pricingToggle === 'monthly' ? '₹999' : '₹9,590'}
                            </span>
                            <span className="text-slate-400 font-medium text-sm">/{pricingToggle === 'monthly' ? 'mo' : 'yr'}</span>
                        </div>
                        <ul className="space-y-4 mb-10 text-sm font-semibold text-slate-600 flex-grow">
                            <li className="flex items-center gap-3"><CheckCircle2 className="text-[#a6e297]" size={20}/> Basic Soil Analysis</li>
                            <li className="flex items-center gap-3"><CheckCircle2 className="text-[#a6e297]" size={20}/> Market Price Alerts</li>
                            <li className="flex items-center gap-3"><CheckCircle2 className="text-[#a6e297]" size={20}/> Weather Forecasts</li>
                        </ul>
                        <button 
                          onClick={() => setPricingModalOpen(true)}
                          className="w-full py-4 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-colors active:scale-95"
                        >
                            Choose Plan
                        </button>
                    </div>

                    {/* Growth (Middle/Dark) */}
                    <div className="bg-[#1f2d1f] rounded-[3rem] p-10 flex flex-col text-left relative shadow-2xl shadow-green-900/20 py-16 transform md:scale-105 z-10">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#a6e297] text-green-900 font-bold text-[10px] uppercase tracking-widest px-6 py-2 rounded-full shadow-lg whitespace-nowrap">
                            Most Popular
                        </div>
                        <h3 className="text-xl font-bold text-white text-center mb-6">Growth</h3>
                        <div className="text-center mb-10 flex items-baseline justify-center">
                            <span className="text-5xl font-black text-white transition-all">
                                {pricingToggle === 'monthly' ? '₹2,999' : '₹28,790'}
                            </span>
                            <span className="text-white/50 font-medium text-sm">/{pricingToggle === 'monthly' ? 'mo' : 'yr'}</span>
                        </div>
                        <ul className="space-y-5 mb-10 text-sm font-semibold text-white/80 flex-grow">
                            <li className="flex items-center gap-3"><CheckCircle2 className="text-[#a6e297] shrink-0" size={20}/> Detailed Nutrient Maps</li>
                            <li className="flex items-center gap-3"><CheckCircle2 className="text-[#a6e297] shrink-0" size={20}/> Custom Fertilizer Blends</li>
                            <li className="flex items-center gap-3"><CheckCircle2 className="text-[#a6e297] shrink-0" size={20}/> 1x Field Visits/Year</li>
                            <li className="flex items-center gap-3"><CheckCircle2 className="text-[#a6e297] shrink-0" size={20}/> Yield Prediction Reports</li>
                        </ul>
                        <button 
                          onClick={() => navigate(`/checkout?plan=growth&term=${pricingToggle}`)}
                          className="w-full py-4 rounded-xl bg-[#a6e297] hover:bg-green-400 active:scale-95 text-green-900 font-bold shadow-lg transition-all"
                        >
                            Choose Plan
                        </button>
                    </div>

                    {/* Premium */}
                    <div className="bg-white border border-slate-200 hover:border-green-400 rounded-[3rem] p-10 flex flex-col text-left py-12 transition-all hover:shadow-xl group">
                        <h3 className="text-xl font-bold text-slate-900 text-center mb-6">Premium</h3>
                        <div className="text-center mb-10 flex items-baseline justify-center">
                            <span className="text-4xl font-black text-slate-900 transition-all">
                                {pricingToggle === 'monthly' ? '₹5,999' : '₹57,590'}
                            </span>
                            <span className="text-slate-400 font-medium text-sm">/{pricingToggle === 'monthly' ? 'mo' : 'yr'}</span>
                        </div>
                        <ul className="space-y-4 mb-10 text-sm font-semibold text-slate-600 flex-grow">
                            <li className="flex items-center gap-3"><CheckCircle2 className="text-[#a6e297]" size={20}/> Dedicated Expert Hub</li>
                            <li className="flex items-center gap-3"><CheckCircle2 className="text-[#a6e297]" size={20}/> IoT Sensor Integration</li>
                            <li className="flex items-center gap-3"><CheckCircle2 className="text-[#a6e297]" size={20}/> Drone Spray Services</li>
                        </ul>
                        <button 
                          onClick={() => setPricingModalOpen(true)}
                          className="w-full py-4 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-colors active:scale-95"
                        >
                            Choose Plan
                        </button>
                    </div>

                </div>
            </section>

            {/* --- CUSTOM FOOTER OVERRIDE (for Newsletter + Social Interactivity) --- */}
            {/* Note: I'm injecting the exact footer structure here to satisfy the detailed interactive requirements directly within this file scope without needing external complex prop drilling to Footer.jsx */}
            <footer className="bg-[#1f2d1f] pt-20 pb-10 px-6 border-t border-[#304530]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="max-w-xs space-y-4">
                        <h3 className="text-white font-bold text-xl mb-4">AgriConsult</h3>
                        <p className="text-white/50 text-sm leading-relaxed mb-6">Building the future of high-yield precision farming across India. Professional guidance at every seed.</p>
                        
                        {/* Newsletter Input */}
                        <div className="relative">
                            {!isSubscribed ? (
                                <>
                                  <input 
                                      type="email" 
                                      placeholder="Email for Newsletter..." 
                                      value={emailInput}
                                      onChange={(e) => setEmailInput(e.target.value)}
                                      className="w-full bg-[#304530] text-white placeholder-white/40 text-sm rounded-xl py-3 pl-4 pr-12 outline-none border border-transparent focus:border-green-500 transition-colors"
                                  />
                                  <button 
                                      onClick={() => {
                                        if (isValidEmail(emailInput)) {
                                          setIsSubscribed(true);
                                          showToast('Successfully subscribed to newsletter!');
                                        } else {
                                          showToast('Please enter a valid email', 'error');
                                        }
                                      }}
                                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${isValidEmail(emailInput) ? 'bg-green-500 text-white cursor-pointer hover:bg-green-400' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
                                  >
                                      <ArrowRight size={14} />
                                  </button>
                                </>
                            ) : (
                                <div className="w-full bg-green-500/20 text-green-400 border border-green-500/30 text-sm rounded-xl py-3 px-4 font-bold flex items-center justify-center gap-2 animate-in zoom-in fade-in">
                                   <CheckCircle2 size={16}/> Subscribed!
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-4">Services</h4>
                        <ul className="space-y-3">
                            {['Soil Analysis', 'Crop Yields', 'Precision Irrigation'].map(link => (
                              <li key={link}>
                                <button onClick={()=>navigate('/services')} className="text-white/50 hover:text-[#a6e297] hover:translate-x-1 transition-all text-sm">{link}</button>
                              </li>
                            ))}
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-4">Resources</h4>
                        <ul className="space-y-3">
                            {['Expert Advice', 'Privacy Policy', 'Terms of Service'].map(link => (
                              <li key={link}>
                                <button onClick={()=>navigate('/about')} className="text-white/50 hover:text-[#a6e297] hover:translate-x-1 transition-all text-sm">{link}</button>
                              </li>
                            ))}
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-4">Contact</h4>
                        <p className="text-white/50 text-sm hover:text-[#a6e297] transition-colors cursor-pointer">1800-AGRI-SAFE</p>
                        <p className="text-white/50 text-sm hover:text-[#a6e297] transition-colors cursor-pointer">support@agriconsult.com</p>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10">
                    <p className="text-white/30 text-xs">© 2026 AgriConsult Bharat. All rights reserved. Built for scale globally.</p>
                </div>
            </footer>



            {/* =========================================
                MODALS SECTION
            =========================================== */}

            {/* OTP Login Modal */}
            <Modal isOpen={isOtpModalOpen} onClose={() => setOtpModalOpen(false)} title="Quick Login">
                <div className="space-y-4">
                    <p className="text-sm text-slate-500 font-medium">Enter your mobile number to get started instantly.</p>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">+91</span>
                        <input type="tel" placeholder="99999 99999" maxLength="10" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-green-500 focus:bg-white font-bold tracking-widest text-slate-800 transition-colors" />
                    </div>
                    <button 
                      onClick={() => {
                        setOtpModalOpen(false);
                        showToast('OTP sent securely to your device.');
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white py-3.5 rounded-xl font-bold shadow-md transition-all"
                    >
                        Send OTP
                    </button>
                </div>
            </Modal>

            {/* Expert Booking Modal */}
            <Modal isOpen={isExpertModalOpen} onClose={() => setExpertModalOpen(false)} title="Schedule Expert Consulting">
                <div className="space-y-4">
                    <input type="text" placeholder="Full Name" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-green-500 focus:bg-white text-sm font-medium transition-colors" />
                    <input type="tel" placeholder="Mobile Number" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-green-500 focus:bg-white text-sm font-medium transition-colors" />
                    
                    <div className="grid grid-cols-2 gap-3">
                        <input type="date" className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-green-500 text-sm font-medium text-slate-600" />
                        <select className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-green-500 text-sm font-medium text-slate-600">
                            <option>Morning</option>
                            <option>Afternoon</option>
                            <option>Evening</option>
                        </select>
                    </div>

                    <button 
                      onClick={() => {
                        setExpertModalOpen(false);
                        showToast("Booking confirmed! Dr. Sharma's team will call you soon.");
                      }}
                      className="w-full bg-[#1f2d1f] hover:bg-[#141f14] active:scale-95 text-[#8ceb78] py-3.5 rounded-xl font-bold shadow-md transition-all mt-2"
                    >
                        Confirm Booking
                    </button>
                </div>
            </Modal>

            

            {/* Field Visit Booking Modal */}
            <Modal isOpen={isVisitModalOpen} onClose={() => setVisitModalOpen(false)} title="Book Field Visit">
                <div className="space-y-4">
                    <p className="text-sm font-bold text-slate-700 mb-2">Service Type</p>
                    <div className="grid grid-cols-3 gap-2">
                        {['Soil Testing', 'Crop Advice', 'Pest Diag.'].map(type => (
                            <div key={type} className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center cursor-pointer hover:bg-green-50 hover:border-green-300 text-[10px] font-bold text-slate-600 transition-colors">
                                {type}
                            </div>
                        ))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="bg-slate-100 rounded-xl py-3 px-4 text-sm font-bold text-slate-700 select-none">
                            {visitDateSelection}
                        </div>
                        <select className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-green-500 text-sm font-medium text-slate-600">
                            <option>10:00 AM - 1:00 PM</option>
                            <option>2:00 PM - 5:00 PM</option>
                        </select>
                    </div>

                    <textarea placeholder="Any specific issues you want us to look at?" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-green-500 text-sm font-medium transition-colors resize-none h-24"></textarea>

                    <button 
                      onClick={() => {
                        setVisitModalOpen(false);
                        showToast(`Field visit locked for ${visitDateSelection}. See you on the farm!`);
                      }}
                      className="w-full bg-[#1f2d1f] hover:bg-[#141f14] active:scale-95 text-[#8ceb78] py-3.5 rounded-xl font-bold shadow-md transition-all border border-[#304530]"
                    >
                        Confirm Visit
                    </button>
                </div>
            </Modal>

            {/* Pricing Modal */}
            <Modal isOpen={isPricingModalOpen} onClose={() => setPricingModalOpen(false)} title="Confirm Subscription">
                <div className="space-y-5 text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-500 mb-2">
                        <AlertCircle size={32} />
                    </div>
                    <h4 className="font-bold text-lg text-slate-900">Configure Payment</h4>
                    <p className="text-sm text-slate-500">Checkout is handled securely via Razorpay. Due to RBI guidelines, recurring e-mandates require secondary authentication.</p>
                    
                    <button 
                      onClick={() => {
                        setPricingModalOpen(false);
                        navigate('/checkout');
                      }}
                      className="w-full bg-slate-900 hover:bg-black active:scale-95 text-white py-4 rounded-xl font-bold shadow-md transition-all mt-4"
                    >
                        Proceed to Payment
                    </button>
                </div>
            </Modal>

        </div>
    );
};

export default Home;
