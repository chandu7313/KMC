import React from 'react';
import { Lightbulb, ShieldCheck, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#f9faf9] font-sans -m-4 lg:-m-8">
            {/* Hero Section */}
            <section className="relative h-[600px] md:h-[500px] flex flex-col justify-center overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=2000&auto=format&fit=crop')` }} 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                <div className="relative max-w-7xl mx-auto px-6 sm:px-10 w-full">
                    <div className="max-w-2xl">
                        {/* Mobile Header Text */}
                        <h1 className="text-4xl md:hidden font-black text-white leading-tight mb-4 tracking-tight">
                            Empowering the Hands that Feed Us.
                        </h1>
                        <p className="text-lg md:hidden text-slate-200 mb-6 font-medium">
                            Bridging the gap between complex agricultural science and the everyday farmer.
                        </p>
                        
                        {/* Desktop Header Text */}
                        <h1 className="hidden md:block text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6 tracking-tight">
                            Sowing Trust, <br className="hidden lg:block"/>Growing Prosperity.
                        </h1>
                        <p className="hidden md:block text-xl text-slate-200 max-w-xl font-medium leading-relaxed">
                            Kissan Mithar Consultancy is dedicated to transforming Indian agriculture through expert guidance, empowering farmers from soil preparation to successful harvest.
                        </p>
                    </div>
                </div>
            </section>

            {/* Core Values / Pillars */}
            <section className="max-w-7xl mx-auto px-6 sm:px-10 py-20 md:py-28">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-black text-[#1a2a1a] mb-4 tracking-tight">Our Core Values</h2>
                    <p className="text-slate-500 font-medium">The principles that guide every seed we plant and every farmer we advise.</p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: Lightbulb, title: "Innovation", desc: "Bringing modern agricultural science and technology to traditional farming practices." },
                        { icon: ShieldCheck, title: "Integrity", desc: "Honest, transparent advice that prioritizes the long-term success of the farmer." },
                        { icon: Users, title: "Inclusivity", desc: "Accessible expertise for every farmer, regardless of landholding size or region." },
                        { icon: TrendingUp, title: "Impact", desc: "Measurable improvements in crop yield, soil health, and farmer livelihood." }
                    ].map((val, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                            {/* Mobile styling - green left border */}
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#1b5e20] md:hidden" />
                            
                            <div className="w-12 h-12 bg-[#e8f5e9] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <val.icon className="text-[#1b5e20]" size={24} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-3">{val.title}</h3>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                {val.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Our Heritage / Story */}
            <section className="bg-white border-y border-slate-100 py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-6 sm:px-10">
                    <div className="flex flex-col-reverse md:flex-row items-center gap-12 lg:gap-20">
                        {/* Image */}
                        <div className="w-full md:w-1/2">
                            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
                                <img 
                                    src="https://images.unsplash.com/photo-1592982537447-6f2334cb941e?q=80&w=1200&auto=format&fit=crop" 
                                    alt="Farmers collaborating" 
                                    className="w-full h-[400px] lg:h-[500px] object-cover hover:scale-105 transition-transform duration-700" 
                                />
                            </div>
                        </div>

                        {/* Text */}
                        <div className="w-full md:w-1/2">
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 tracking-tight">Our Heritage: From Soil to Sale</h2>
                            <div className="space-y-4 text-slate-600 font-medium leading-relaxed text-sm lg:text-base">
                                <p>
                                    Rooted deeply in the agricultural traditions of India, KMC began with a simple mission: to bridge the gap between generational farming wisdom and modern agronomic science.
                                </p>
                                <p>
                                    Kissan Mithar Consultancy was born out of a simple observation: while agricultural science was advancing rapidly, the everyday farmer was being left behind, struggling with outdated practices and unpredictable yields. We recognized that the barrier wasn't a lack of information, but a lack of accessible, actionable translation.
                                </p>
                                <p>
                                    We understand that farming is not just a business; it's a legacy. Our journey maps the entire lifecycle of agriculture, providing steadfast support from the first soil test to negotiating the final market sale. We are more than consultants; we are partners in prosperity.
                                </p>
                            </div>
                            <div className="mt-8 flex items-center gap-3 bg-[#f0fdf4] text-[#1b5e20] px-5 py-3 rounded-xl border border-[#bbf7d0] inline-flex">
                                <CheckCircle size={20} strokeWidth={2.5} />
                                <span className="font-bold">Established Trust Since 2005</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Banner */}
            <section className="bg-[#0f4d1e] text-white py-16 md:py-20">
                <div className="max-w-7xl mx-auto px-6 sm:px-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/20 text-center">
                        <div className="py-4 md:py-0">
                            <div className="text-5xl md:text-6xl font-black mb-2 tracking-tight">10,000+</div>
                            <div className="text-xs md:text-sm font-bold tracking-[0.2em] text-green-200 uppercase">Farmers Served</div>
                        </div>
                        <div className="py-8 md:py-0">
                            <div className="text-5xl md:text-6xl font-black mb-2 tracking-tight">25%</div>
                            <div className="text-xs md:text-sm font-bold tracking-[0.2em] text-green-200 uppercase">Avg. Yield Increase</div>
                        </div>
                        <div className="py-4 md:py-0">
                            <div className="text-5xl md:text-6xl font-black mb-2 tracking-tight">15+</div>
                            <div className="text-xs md:text-sm font-bold tracking-[0.2em] text-green-200 uppercase">Regions Covered</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Meet the Experts */}
            <section className="max-w-7xl mx-auto px-6 sm:px-10 py-20 md:py-28 text-center">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">Meet the Experts</h2>
                <p className="text-slate-500 font-medium mb-12">The dedicated minds guiding our agricultural strategies.</p>

                <div className="flex justify-center">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 max-w-xs group cursor-pointer hover:shadow-xl transition-all">
                        <div className="h-64 overflow-hidden">
                            <img 
                                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80" 
                                alt="Dr. Ravi Sharma" 
                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-black text-slate-900">Dr. Ravi Sharma</h3>
                            <p className="text-xs font-bold text-[#1b5e20] uppercase tracking-widest mt-1">Chief Agronomist</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-4xl mx-auto px-6 sm:px-10 pb-20 md:pb-28">
                <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-[2rem] p-10 md:p-16 text-center shadow-lg relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute -right-20 -top-20 opacity-10">
                        <svg width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="#1b5e20" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                            <path d="M2 12h20" />
                        </svg>
                    </div>
                    
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-black text-[#1a2a1a] mb-6 tracking-tight">Ready to transform your farm?</h2>
                        <p className="text-slate-600 font-medium mb-10 max-w-lg mx-auto leading-relaxed">
                            Join our community today and gain access to expert guidance, market insights, and sustainable practices.
                        </p>
                        <button 
                            onClick={() => navigate('/login')}
                            className="bg-[#1b5e20] hover:bg-green-900 text-white font-black px-10 py-4 rounded-xl transition-colors shadow-md active:scale-95"
                        >
                            Register Now
                        </button>
                    </div>
                </div>
            </section>

            {/* Minimal Footer for About Page */}
            <footer className="bg-white border-t border-slate-200 py-10 text-center">
                <h3 className="font-black text-xl text-[#1b5e20] mb-4 tracking-tight">KMC</h3>
                <p className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-wider">
                    © 2024 Kissan Mithar Consultancy. All rights reserved.
                </p>
                <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-xs font-bold text-slate-500">
                    <span className="hover:text-slate-900 cursor-pointer transition-colors">Success Stories</span>
                    <span className="hover:text-slate-900 cursor-pointer transition-colors">General Info</span>
                    <span className="hover:text-slate-900 cursor-pointer transition-colors">Privacy Policy</span>
                    <span className="hover:text-slate-900 cursor-pointer transition-colors">Farmer Portal</span>
                    <span className="hover:text-slate-900 cursor-pointer transition-colors">Admin Access</span>
                </div>
            </footer>
        </div>
    );
};

export default AboutPage;
