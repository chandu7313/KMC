import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import LanguageModal from '../../components/LanguageModal';
// Using standard lucide icons
import { 
  ArrowRight, Sprout, TrendingUp, FlaskConical, CloudSun, Leaf, 
  MapPin, Check, Phone, ShieldCheck, Calendar, CheckCircle2, ChevronRight
} from 'lucide-react';
import { assets } from '../../assets/assets';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-[#f9faf9] min-h-screen font-sans selection:bg-green-100 selection:text-green-900 overflow-x-hidden">
            <LanguageModal />
            <Navbar />

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
                                onClick={() => navigate('/login')}
                                className="w-full sm:w-auto bg-[#8ceb78] hover:bg-[#7ddc6a] text-[#1f2d1f] px-8 py-4 rounded-xl font-bold text-sm transition-all"
                            >
                                Get Started
                            </button>
                            <button 
                                onClick={() => navigate('/about')}
                                className="w-full sm:w-auto bg-transparent border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold text-sm transition-all"
                            >
                                Learn More
                            </button>
                        </div>
                    </div>
                    
                    <div className="relative">
                        <div className="rounded-3xl overflow-hidden shadow-2xl relative h-[400px] md:h-[500px]">
                             <img src={assets.hero_image} alt="Farming Sunset" className="w-full h-full object-cover" />
                        </div>
                        {/* 98% Success Rate Badge */}
                        <div className="absolute top-8 -right-4 md:-right-8 bg-white py-3 px-5 rounded-2xl shadow-xl flex items-center gap-3 animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <TrendingUp size={16} />
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Proven</div>
                                <div className="text-sm font-bold text-slate-900">98% Success Rate</div>
                            </div>
                        </div>
                        {/* 5000+ Farmers Badge */}
                        <div className="absolute -bottom-8 left-8 bg-white py-3 px-5 rounded-2xl shadow-xl flex items-center gap-3">
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
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Column: Core Services Grid */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold text-[#1f2d1f]">Our Core Services</h2>
                            <button className="text-slate-500 text-sm font-bold flex items-center gap-2 hover:text-[#1f2d1f] transition-colors">
                                Explore all services <ArrowRight size={16}/>
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {/* Service Card 1 */}
                            <div className="bg-[#f0ede6] rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-shadow group">
                                <div className="w-full h-32 rounded-xl overflow-hidden mb-4">
                                    <img src={assets.soil_testing} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Soil" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1">Soil Testing</h3>
                                <p className="text-xs text-slate-500 line-clamp-2 mb-3">Detailed nutrient analysis for precision cultivation.</p>
                                <ArrowRight size={16} className="text-slate-400 group-hover:text-green-600 transition-colors"/>
                            </div>
                            {/* Service Card 2 */}
                            <div className="bg-[#f0ede6] rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-shadow group">
                                <div className="w-full h-32 rounded-xl overflow-hidden mb-4">
                                    <img src={assets.services_images.fertilizers} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Fert" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1">Fertilizers</h3>
                                <p className="text-xs text-slate-500 line-clamp-2 mb-3">Customized blends based on act-level requests.</p>
                                <ArrowRight size={16} className="text-slate-400 group-hover:text-green-600 transition-colors"/>
                            </div>
                            {/* Service Card 3 */}
                            <div className="bg-[#f0ede6] rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-shadow group">
                                <div className="w-full h-32 rounded-xl overflow-hidden mb-4">
                                    <img src={assets.crop_selection} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Crop" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1">Crop Selection</h3>
                                <p className="text-xs text-slate-500 line-clamp-2 mb-3">Expert advice for region-resilient crop varieties.</p>
                                <ArrowRight size={16} className="text-slate-400 group-hover:text-green-600 transition-colors"/>
                            </div>
                            {/* Service Card 4 */}
                            <div className="bg-[#f0ede6] rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-shadow group">
                                <div className="w-full h-32 rounded-xl overflow-hidden mb-4">
                                    <img src={assets.mandi_prices} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Mandi" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1">Mandi Prices</h3>
                                <p className="text-xs text-slate-500 line-clamp-2 mb-3">Live tracking of regional market rates for farmers.</p>
                                <ArrowRight size={16} className="text-slate-400 group-hover:text-green-600 transition-colors"/>
                            </div>
                            {/* Service Card 5 */}
                            <div className="bg-[#f0ede6] rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-shadow group">
                                <div className="w-full h-32 rounded-xl overflow-hidden mb-4">
                                    <img src={assets.equi} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Equip" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1">Equipments</h3>
                                <p className="text-xs text-slate-500 line-clamp-2 mb-3">Leasing and procurement of modern agri tools.</p>
                                <ArrowRight size={16} className="text-slate-400 group-hover:text-green-600 transition-colors"/>
                            </div>
                            {/* Service Card 6 */}
                            <div className="bg-[#f0ede6] rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-shadow group">
                                <div className="w-full h-32 rounded-xl overflow-hidden mb-4">
                                    <img src={assets.insights} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Insight" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1">Insights</h3>
                                <p className="text-xs text-slate-500 line-clamp-2 mb-3">Deep data analytics for yield forecasting.</p>
                                <ArrowRight size={16} className="text-slate-400 group-hover:text-green-600 transition-colors"/>
                            </div>
                        </div>

                        {/* Features Row */}
                        <div className="bg-[#f0ede6] rounded-3xl p-10 text-center space-y-8 mt-12">
                            <h3 className="text-2xl font-bold text-[#1f2d1f]">Everything You Need To Scale</h3>
                            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm"><FlaskConical size={24}/></div>
                                    <span className="text-xs font-bold text-slate-700">Soil Testing</span>
                                </div>
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm"><TrendingUp size={24}/></div>
                                    <span className="text-xs font-bold text-slate-700">Market Prices</span>
                                </div>
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm"><CloudSun size={24}/></div>
                                    <span className="text-xs font-bold text-slate-700">Weather Insights</span>
                                </div>
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm"><Sprout size={24}/></div>
                                    <span className="text-xs font-bold text-slate-700">Crop Advisory</span>
                                </div>
                            </div>
                        </div>

                        {/* From Soil to Scale Section */}
                        <div className="bg-[#1f2d1f] rounded-[2rem] p-10 md:p-16 text-center mt-12 relative overflow-hidden">
                            <h3 className="text-3xl font-bold text-white mb-2 relative z-10">From Soil to Scale</h3>
                            <p className="text-white/60 text-sm mb-12 relative z-10">Our proprietary framework for agricultural excellence</p>
                            
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                                {/* Connecting line */}
                                <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-px bg-white/20 border-t border-dashed border-white/50 -z-10"/>

                                {[
                                    { num: '01', title: 'Test' },
                                    { num: '02', title: 'Analyze' },
                                    { num: '03', title: 'Supply' },
                                    { num: '04', title: 'Prosper' }
                                ].map((step, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-4 bg-[#1f2d1f]">
                                        <div className="w-14 h-14 rounded-full border-2 border-green-500 bg-[#1f2d1f] text-green-400 flex items-center justify-center font-bold text-lg shadow-lg shadow-green-900/50">
                                            {step.num}
                                        </div>
                                        <span className="text-sm font-bold text-white uppercase tracking-wider">{step.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar Widgets */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Talk With Expert Widget */}
                        <div className="bg-[#1f2d1f] rounded-3xl p-6 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white">
                                    <Phone size={24} />
                                </div>
                                <div className="w-12 h-12 bg-white/10 rounded-full overflow-hidden border border-white/20">
                                    <img src="https://images.unsplash.com/photo-1594824436998-dd40e4f69d89?auto=format&fit=crop&q=80&w=100&grayscale" className="w-full h-full object-cover"/>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Talk with Expert</h3>
                            <p className="text-white/50 text-xs mb-6">Connect with Dr. Sharma for immediate soil & crop guidance.</p>
                            <button className="w-full bg-[#8ceb78] hover:bg-[#7ddc6a] text-[#1f2d1f] py-3 rounded-xl font-bold text-sm">
                                Book a Call
                            </button>
                        </div>

                        {/* Mandi Prices Widget */}
                        <div className="bg-[#f0ede6] rounded-3xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-900">Mandi Prices</h3>
                                <TrendingUp size={16} className="text-green-600"/>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { name: 'Cotton', price: '₹6,400', dir: 'up' },
                                    { name: 'Rice', price: '₹2,100', dir: 'down' },
                                    { name: 'Wheat', price: '₹2,450', dir: 'up' }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white/50 p-3 rounded-xl text-sm">
                                        <span className="font-semibold text-slate-700">{item.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-900">{item.price}</span>
                                            {item.dir === 'up' ? <TrendingUp size={14} className="text-green-500"/> : <TrendingUp size={14} className="text-red-500 rotate-180"/>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Govt Schemes Widget */}
                        <div className="bg-[#f0ede6] rounded-3xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-900">Govt. Schemes</h3>
                                <ShieldCheck size={16} className="text-green-600"/>
                            </div>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center bg-white/50 p-3 rounded-xl text-sm">
                                    <span className="font-semibold text-slate-700">PM KISAN</span>
                                    <span className="bg-green-200 text-green-800 text-[10px] font-bold px-2 py-1 rounded uppercase">Active</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/50 p-3 rounded-xl text-sm">
                                    <span className="font-semibold text-slate-700">RKVY</span>
                                    <span className="bg-green-200 text-green-800 text-[10px] font-bold px-2 py-1 rounded uppercase">Active</span>
                                </div>
                            </div>
                            <button className="w-full bg-[#1f2d1f] hover:bg-slate-800 text-white py-3 rounded-xl font-bold text-sm">
                                Check Eligibility
                            </button>
                        </div>

                        {/* Book Field Visit Widget */}
                        <div className="bg-[#f0ede6] rounded-3xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-900">Book Field Visit</h3>
                                <Calendar size={16} className="text-green-600"/>
                            </div>
                            <div className="flex justify-between gap-2 mb-6 text-center">
                                <div className="flex-1 bg-white/50 rounded-xl py-3 border border-slate-200 cursor-pointer hover:bg-white text-slate-400">
                                    <div className="text-[10px] uppercase font-bold">Oct</div>
                                    <div className="text-lg font-black">12</div>
                                </div>
                                <div className="flex-1 bg-green-700 rounded-xl py-3 text-white shadow-md cursor-pointer hover:bg-green-800">
                                    <div className="text-[10px] uppercase font-bold">Oct</div>
                                    <div className="text-lg font-black">13</div>
                                </div>
                                <div className="flex-1 bg-white/50 rounded-xl py-3 border border-slate-200 cursor-pointer hover:bg-white text-slate-400">
                                    <div className="text-[10px] uppercase font-bold">Oct</div>
                                    <div className="text-lg font-black">14</div>
                                </div>
                            </div>
                            <button className="w-full bg-[#1f2d1f] hover:bg-slate-800 text-white py-3 rounded-xl font-bold text-sm">
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
                        
                        <div className="bg-[#f0ede6] p-6 rounded-3xl flex gap-6 items-center">
                            <div className="w-16 h-16 bg-[#dbe6df] rounded-2xl flex items-center justify-center shrink-0">
                                <Sprout className="text-[#1f2d1f]" size={28}/>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-1">Modern Equipment</h4>
                                <p className="text-slate-500 text-sm">Access top-tier drones and advanced irrigation systems.</p>
                            </div>
                        </div>

                        <div className="bg-[#f0ede6] p-6 rounded-3xl flex gap-6 items-center">
                            <div className="w-16 h-16 bg-[#dbe6df] rounded-2xl flex items-center justify-center shrink-0">
                                <Leaf className="text-[#1f2d1f]" size={28}/>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-1">Premium Fertilizers</h4>
                                <p className="text-slate-500 text-sm">Bio-engineered fertilizers tailored for Indian soil profiles.</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative rounded-3xl overflow-hidden h-[400px]">
                        <img src={assets.drone_img} className="w-full h-full object-cover" alt="Inputs" />
                        <div className="absolute top-8 right-8 bg-[#1f2d1f]/90 backdrop-blur-md text-white p-4 rounded-xl border border-white/10 shadow-2xl animate-bounce-slow">
                            <div className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-1">Avg. Efficiency Gain</div>
                            <div className="text-3xl font-black">24%</div>
                            <div className="text-xs text-white/50 font-medium">Increased Yield</div>
                        </div>
                    </div>
                </div>

                {/* Dark Stats Banner */}
                <div className="bg-[#2a2422] rounded-[2rem] p-12 text-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
                        <div className="pt-6 md:pt-0">
                            <div className="text-5xl font-black text-[#a6e297] mb-2">42.5M+</div>
                            <div className="text-xs font-bold text-white/50 uppercase tracking-widest">SQ. MT TESTED SOIL FT</div>
                        </div>
                        <div className="pt-6 md:pt-0">
                            <div className="text-5xl font-black text-[#a6e297] mb-2">165</div>
                            <div className="text-xs font-bold text-white/50 uppercase tracking-widest">EXPERT CONSULTANTS</div>
                        </div>
                        <div className="pt-6 md:pt-0">
                            <div className="text-5xl font-black text-[#a6e297] mb-2">46%</div>
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
                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col h-full cursor-pointer">
                        <div className="h-48 w-full bg-slate-200">
                            <img src={assets.wheat} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="mb-4">
                                <span className="bg-green-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">Crop Care</span>
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 mb-3">Managing Wheat Blight in Humid Seasons</h3>
                            <p className="text-sm text-slate-500 mt-auto">Learn the early warning signs and organic treatment options to protect your crop...</p>
                        </div>
                    </div>

                    {/* Blog 2 */}
                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col h-full cursor-pointer">
                        <div className="h-48 w-full bg-slate-200">
                            <img src={assets.cotton} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="mb-4">
                                <span className="bg-green-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">Markets</span>
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 mb-3">2024 Cotton Market Outlook: What to Expect</h3>
                            <p className="text-sm text-slate-500 mt-auto">Global supply chain shifts are creating new export pathways for Indian growers...</p>
                        </div>
                    </div>

                    {/* Blog 3 */}
                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col h-full cursor-pointer">
                        <div className="h-48 w-full bg-slate-200">
                            <img src={assets.drip} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="mb-4">
                                <span className="bg-green-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">Tech</span>
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 mb-3">Drip Irrigation: A Guide to High Efficiency</h3>
                            <p className="text-sm text-slate-500 mt-auto">Maximize your water usage with these automated IoT systems and save overheads...</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PRICING --- */}
            <section className="py-24 px-6 max-w-6xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-[#1f2d1f] mb-2">Select Your Success</h2>
                <p className="text-slate-500 text-sm mb-16">Plans designed for every stage of agriculture growth.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    
                    {/* Starter */}
                    <div className="bg-white border border-slate-200 rounded-[3rem] p-10 flex flex-col text-left py-12">
                        <h3 className="text-xl font-bold text-slate-900 text-center mb-6">Starter</h3>
                        <div className="text-center mb-10 flex items-baseline justify-center">
                            <span className="text-4xl font-black text-slate-900">₹999</span>
                            <span className="text-slate-400 font-medium text-sm">/mo</span>
                        </div>
                        <ul className="space-y-4 mb-10 text-sm font-semibold text-slate-600 flex-grow">
                            <li className="flex items-center gap-3"><CheckCircle2 className="text-[#a6e297]" size={20}/> Basic Soil Analysis</li>
                            <li className="flex items-center gap-3"><CheckCircle2 className="text-[#a6e297]" size={20}/> Market Price Alerts</li>
                            <li className="flex items-center gap-3"><CheckCircle2 className="text-[#a6e297]" size={20}/> Weather Forecasts</li>
                        </ul>
                        <button className="w-full py-4 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors">
                            Choose Plan
                        </button>
                    </div>

                    {/* Growth (Middle/Dark) */}
                    <div className="bg-[#1f2d1f] rounded-[3rem] p-10 flex flex-col text-left relative shadow-2xl py-16 transform scale-105 z-10">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#a6e297] text-green-900 font-bold text-[10px] uppercase tracking-widest px-6 py-2 rounded-full shadow-lg">
                            Most Popular
                        </div>
                        <h3 className="text-xl font-bold text-white text-center mb-6">Growth</h3>
                        <div className="text-center mb-10 flex items-baseline justify-center">
                            <span className="text-5xl font-black text-white">₹2,999</span>
                            <span className="text-white/50 font-medium text-sm">/mo</span>
                        </div>
                        <ul className="space-y-5 mb-10 text-sm font-semibold text-white/80 flex-grow">
                            <li className="flex items-center gap-3"><CheckCircle2 className="text-[#a6e297] shrink-0" size={20}/> Detailed Nutrient Maps</li>
                            <li className="flex items-center gap-3"><CheckCircle2 className="text-[#a6e297] shrink-0" size={20}/> Custom Fertilizer Blends</li>
                            <li className="flex items-center gap-3"><CheckCircle2 className="text-[#a6e297] shrink-0" size={20}/> 1x Field Visits/Year</li>
                            <li className="flex items-center gap-3"><CheckCircle2 className="text-[#a6e297] shrink-0" size={20}/> Yield Prediction Reports</li>
                        </ul>
                        <button className="w-full py-4 rounded-xl bg-[#a6e297] hover:bg-green-400 text-green-900 font-bold shadow-lg transition-colors">
                            Choose Plan
                        </button>
                    </div>

                    {/* Premium */}
                    <div className="bg-white border border-slate-200 rounded-[3rem] p-10 flex flex-col text-left py-12">
                        <h3 className="text-xl font-bold text-slate-900 text-center mb-6">Premium</h3>
                        <div className="text-center mb-10 flex items-baseline justify-center">
                            <span className="text-4xl font-black text-slate-900">₹5,999</span>
                            <span className="text-slate-400 font-medium text-sm">/mo</span>
                        </div>
                        <ul className="space-y-4 mb-10 text-sm font-semibold text-slate-600 flex-grow">
                            <li className="flex items-center gap-3"><CheckCircle2 className="text-[#a6e297]" size={20}/> Dedicated Expert Hub</li>
                            <li className="flex items-center gap-3"><CheckCircle2 className="text-[#a6e297]" size={20}/> IoT Sensor Integration</li>
                            <li className="flex items-center gap-3"><CheckCircle2 className="text-[#a6e297]" size={20}/> Drone Spray Services</li>
                        </ul>
                        <button className="w-full py-4 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors">
                            Choose Plan
                        </button>
                    </div>

                </div>
            </section>

            <Footer />
            
            <style jsx="true">{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 4s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default Home;
