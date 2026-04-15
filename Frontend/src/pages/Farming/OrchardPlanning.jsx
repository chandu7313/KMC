import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Droplets, LayoutTemplate, Briefcase, TrendingUp, Check, Microscope, Building, Users, Calendar, CloudLightning } from "lucide-react";

// Imports for our local images
import heroBg from "../../assets/orchard/hero.png";
import soilImg from "../../assets/orchard/soil.png";

const OrchardPlanning = () => {

  // Unsplash fallbacks for images we couldn't generate due to quota
  const expertImages = [
    "https://images.unsplash.com/photo-1594824436998-dd40e4f69d89?auto=format&fit=crop&q=80&w=600&grayscale",
    "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=600&grayscale",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&grayscale"
  ];
  
  const beforeAfterImages = [
    "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1506106673646-d24ebfec05cc?auto=format&fit=crop&q=80&w=800"
  ];

  return (
    <div className="bg-[#f9faf9] min-h-screen text-slate-800 font-sans">
      <Navbar />

      {/* 🎯 HERO SECTION */}
      <section className="relative w-full h-[600px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-8 flex flex-col justify-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-[64px] leading-tight font-bold text-white mb-6">
              Start Your Orchard <br className="hidden md:block"/>
              with <span className="text-green-400">Expert Guidance</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-xl font-light">
              Leverage scientific data and industry expertise to transform your land into a high-yield, sustainable agricultural estate.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3.5 rounded-full transition-colors flex items-center justify-center">
                Start Planning
              </button>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold px-8 py-3.5 rounded-full transition-colors flex items-center justify-center">
                Talk to Expert
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 🛠️ SERVICES SECTION */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20 md:py-28">
        <div className="mb-12">
          <h4 className="text-xs font-bold text-slate-400 tracking-[0.2em] uppercase mb-2">Services</h4>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Precision Consultancy Services</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 h-auto">
          {/* Main Card */}
          <div className="bg-[#f0ede6] rounded-3xl p-8 md:p-12 border border-slate-200 flex flex-col justify-between overflow-hidden relative min-h-[400px]">
             <div className="relative z-10">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <Leaf className="text-green-600 w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Land Analysis</h3>
                <p className="text-slate-600 max-w-md">
                  Comprehensive soil testing and topography mapping for optimal orchard layout.
                </p>
             </div>
             {/* Offset image container like the design */}
             <div className="absolute -bottom-8 left-0 right-0 h-48 md:h-64 px-8 pb-8 z-0">
               <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                  <img src={soilImg} className="w-full h-full object-cover" alt="Soil Analysis" />
               </div>
             </div>
          </div>

          {/* 4 Grid Cards */}
          <div className="grid sm:grid-cols-2 gap-6">
             <div className="bg-[#f0ede6] rounded-3xl p-8 border border-slate-200 flex flex-col justify-center">
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <Droplets className="text-green-600 w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Water Planning</h4>
                <p className="text-sm text-slate-600">Smart irrigation mapping and moisture management.</p>
             </div>
             <div className="bg-[#f0ede6] rounded-3xl p-8 border border-slate-200 flex flex-col justify-center">
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <LayoutTemplate className="text-green-600 w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Crop Selection</h4>
                <p className="text-sm text-slate-600">Species matching based on climate and soil profile.</p>
             </div>
             <div className="bg-[#f0ede6] rounded-3xl p-8 border border-slate-200 flex flex-col justify-center">
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <Briefcase className="text-green-600 w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Market Planning</h4>
                <p className="text-sm text-slate-600">Demand timeline projections for maximum rentability.</p>
             </div>
             <div className="bg-[#f0ede6] rounded-3xl p-8 border border-slate-200 flex flex-col justify-center">
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <TrendingUp className="text-green-600 w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Profit Strategy</h4>
                <p className="text-sm text-slate-600">Long-term financial modeling and yield forecasting.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 🔄 PROCESS SECTION */}
      <section className="bg-white py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-16">Simple 5-Step Process</h2>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-[28px] left-10 right-10 h-0.5 bg-slate-200 border-t border-dashed border-slate-300 z-0" />

            {[
              { title: "Site Audit", desc: "Inspection & Zoning", icon: <Building size={20}/>, active: true },
              { title: "Soil Lab", desc: "Nutrient Analysis", icon: <Microscope size={20}/>, active: false },
              { title: "Design", desc: "Customized Layout", icon: <LayoutTemplate size={20}/>, active: false },
              { title: "Planting", desc: "On-site Supervision", icon: <Leaf size={20}/>, active: false },
              { title: "Returns", desc: "Ongoing Support", icon: <TrendingUp size={20}/>, active: true }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center w-40">
                 <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${step.active ? 'bg-green-700 text-white shadow-xl shadow-green-900/20' : 'bg-[#f0ede6] text-slate-500 hover:bg-slate-200'}`}>
                    {step.icon}
                 </div>
                 <h5 className="font-bold text-slate-900 mb-1">{step.title}</h5>
                 <p className="text-xs font-medium text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 👨‍🔬 EXPERTS SECTION */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Guided by Pioneers</h2>
            <p className="text-slate-600 max-w-xl">
              Our consultants combine decades of traditional wisdom with modern agricultural sciences.
            </p>
          </div>
          <Link to="/expert-consultations" className="text-green-700 hover:text-green-800 font-bold flex items-center gap-2 group whitespace-nowrap">
            Meet Our full team <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Expert 1 */}
          <div className="bg-[#f0ede6] border border-slate-200 p-3 rounded-3xl group cursor-pointer hover:shadow-lg transition-shadow">
            <div className="w-full h-64 md:h-72 rounded-2xl overflow-hidden mb-6 bg-slate-200">
              <img src={expertImages[0]} alt="Dr. Amarya Sharma" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="px-3 pb-4">
              <h4 className="font-bold text-lg text-slate-900">Dr. Amarya Sharma</h4>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Lead Soil Pathologist</p>
              <p className="text-sm text-slate-600">20+ years experience in sub-tropical orchard management and nutrient cycling.</p>
            </div>
          </div>
          
          {/* Expert 2 */}
          <div className="bg-[#f0ede6] border border-slate-200 p-3 rounded-3xl group cursor-pointer hover:shadow-lg transition-shadow">
            <div className="w-full h-64 md:h-72 rounded-2xl overflow-hidden mb-6 bg-slate-200">
              <img src={expertImages[1]} alt="Vikram Singh" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="px-3 pb-4">
              <h4 className="font-bold text-lg text-slate-900">Vikram Singh</h4>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Pomology Specialist</p>
              <p className="text-sm text-slate-600">Expert in high-density mango and citrus planting with 500+ successful projects.</p>
            </div>
          </div>

          {/* Expert 3 */}
          <div className="bg-[#f0ede6] border border-slate-200 p-3 rounded-3xl group cursor-pointer hover:shadow-lg transition-shadow">
            <div className="w-full h-64 md:h-72 rounded-2xl overflow-hidden mb-6 bg-slate-200">
              <img src={expertImages[2]} alt="Meera Krishnan" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="px-3 pb-4">
              <h4 className="font-bold text-lg text-slate-900">Meera Krishnan</h4>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Agri-Economist</p>
              <p className="text-sm text-slate-600">Strategic market analysis and export-quality standard consultancy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ PILLARS SECTION */}
      <section className="bg-white py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid md:grid-cols-3 gap-6">
             <div className="flex items-start gap-4 p-4">
                <div className="w-8 h-8 rounded bg-green-200 flex items-center justify-center flex-shrink-0 text-green-800 mt-1">
                   <TrendingUp size={16} strokeWidth={3}/>
                </div>
                <div>
                   <h5 className="font-bold text-slate-900 mb-1">Higher Yield</h5>
                   <p className="text-sm text-slate-500">Our premium farm layouts typically increase per-acre fruit production by up to 40%.</p>
                </div>
             </div>
             <div className="flex items-start gap-4 p-4">
                <div className="w-8 h-8 rounded bg-green-200 flex items-center justify-center flex-shrink-0 text-green-800 mt-1">
                   <Check size={16} strokeWidth={4}/>
                </div>
                <div>
                   <h5 className="font-bold text-slate-900 mb-1">Better Profit</h5>
                   <p className="text-sm text-slate-500">Optimized space and continuous issues lead to significantly higher crop margins.</p>
                </div>
             </div>
             <div className="flex items-start gap-4 p-4">
                <div className="w-8 h-8 rounded bg-green-200 flex items-center justify-center flex-shrink-0 text-green-800 mt-1">
                   <CloudLightning size={16} strokeWidth={3}/>
                </div>
                <div>
                   <h5 className="font-bold text-slate-900 mb-1">Risk Reduction</h5>
                   <p className="text-sm text-slate-500">Data-driven crop selection minimizes weather and market volatility risks.</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 🚀 RESULTS SECTION */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20 md:py-28">
         <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-16">Transformation Results</h2>
         
         <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left: Images */}
            <div className="flex flex-col gap-4 relative">
               <div className="rounded-2xl overflow-hidden shadow-sm relative h-56 md:h-64 border border-slate-200">
                  <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded z-10">Before Intervention</span>
                  <img src={beforeAfterImages[0]} alt="Barren land" className="w-full h-full object-cover" />
               </div>
               <div className="rounded-2xl overflow-hidden shadow-xl relative h-64 md:h-72 border-4 border-white transform translate-x-4 md:translate-x-12 -translate-y-8 z-10 w-[95%]">
                  <span className="absolute top-4 left-4 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded z-10">After 3 Seasons</span>
                  <img src={beforeAfterImages[1]} alt="Orange orchard" className="w-full h-full object-cover" />
               </div>

               {/* Stat Card */}
               <div className="absolute -bottom-4 md:bottom-4 left-0 md:-left-8 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 z-20 hidden sm:block">
                  <h6 className="font-bold text-sm text-slate-900 mb-0.5">Project Nagpur Citrus Estate</h6>
                  <p className="text-xs text-slate-500 font-medium">Yield Increase: <span className="text-green-600 font-bold">285%</span> | Water saving: <span className="text-blue-500 font-bold">40%</span></p>
               </div>
            </div>

            {/* Right: Text */}
            <div className="lg:pr-8 pt-8 lg:pt-0">
               <h3 className="text-2xl font-bold text-slate-900 mb-4">Scientific Transformation</h3>
               <p className="text-slate-600 leading-relaxed mb-10">
                  We don't just plant trees; we engineer ecosystems. Our Success Stories show consistent year-over-year growth for small and large-scale farmers across India.
               </p>

               <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-[#f9faf9] p-4 rounded-xl border border-slate-200 shadow-sm">
                     <div className="w-6 h-6 rounded-full bg-green-700 flex items-center justify-center flex-shrink-0 text-white">
                        <Check size={14} strokeWidth={3}/>
                     </div>
                     <span className="font-semibold text-slate-800">500+ Orchards Revitalized</span>
                  </div>
                  <div className="flex items-center gap-4 bg-[#f9faf9] p-4 rounded-xl border border-slate-200 shadow-sm">
                     <div className="w-6 h-6 rounded-full bg-green-700 flex items-center justify-center flex-shrink-0 text-white">
                        <Check size={14} strokeWidth={3}/>
                     </div>
                     <span className="font-semibold text-slate-800">Avg. Return on Investment in 3 Years</span>
                  </div>
                  <div className="flex items-center gap-4 bg-[#f9faf9] p-4 rounded-xl border border-slate-200 shadow-sm">
                     <div className="w-6 h-6 rounded-full bg-green-700 flex items-center justify-center flex-shrink-0 text-white">
                        <Check size={14} strokeWidth={3}/>
                     </div>
                     <span className="font-semibold text-slate-800">100% Organic Compatibility</span>
                  </div>
               </div>
            </div>

         </div>
      </section>

      {/* 📣 CTA BANNER */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 pb-24">
         <div className="bg-[#387e41] rounded-[2rem] p-10 md:p-16 relative overflow-hidden shadow-2xl">
            {/* Decorative Gear/Leaf SVG Background Pattern */}
            <div className="absolute -right-20 -top-20 text-white/10 select-none pointer-events-none">
               <svg width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  <circle cx="12" cy="12" r="5"/>
               </svg>
            </div>

            <div className="relative z-10 max-w-2xl">
               <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Need Help on Ground?</h2>
               <p className="text-green-50 text-base md:text-lg mb-10 max-w-lg font-medium">
                  Schedule an in-person site audit with our Lead Consultants. We come to your farm for a comprehensive evaluation.
               </p>
               <Link to="/book-farm-visit" className="inline-flex bg-white hover:bg-slate-50 text-green-800 font-bold px-8 py-4 rounded-xl transition-colors items-center gap-3">
                 <Calendar size={18} /> Book Farm Visit
               </Link>
            </div>
         </div>
      </section>

    </div>
  );
};

export default OrchardPlanning;
