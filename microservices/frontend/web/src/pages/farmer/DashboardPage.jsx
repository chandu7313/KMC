import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Sun, 
    Thermometer,
    FlaskConical,
    Store,
    ShoppingBag,
    Headphones,
    CloudSun,
    Megaphone,
    ChevronRight,
    Mountain,
    Activity,
    Truck,
    LayoutGrid,
    Users,
    FileText,
    TrendingUp,
    Sprout
} from 'lucide-react';

const FarmerDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#f9fafb] min-h-screen pb-24 md:pb-8 font-sans w-full max-w-2xl mx-auto xl:max-w-7xl">
            <div className="px-4 pt-4 md:px-8 md:pt-8 space-y-6">
                
                {/* ─── GREEN HERO BANNER ────────────────────────── */}
                <div className="bg-[#185824] rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <h2 className="text-xl md:text-2xl font-bold">Good Morning, Rajesh ji</h2>
                            <Sprout size={20} className="text-yellow-400" />
                        </div>

                        {/* Weather Card */}
                        <div className="bg-[#246b32] rounded-xl p-4 mb-4 flex items-center gap-4 border border-white/10 shadow-inner">
                            <Sun size={32} className="text-yellow-400" />
                            <div>
                                <div className="text-2xl font-bold leading-none mb-1">28°C</div>
                                <div className="text-xs text-white/80 font-medium">Sunny • 65% Humidity</div>
                            </div>
                        </div>

                        {/* Tip of the day */}
                        <div className="border-l-2 border-white pl-3 py-1">
                            <p className="text-xs md:text-sm text-white/90 font-medium italic">
                                <span className="font-bold not-italic">Tip of the day:</span> Light irrigation recommended for tomato crop this evening.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ─── QUICK ACTIONS ────────────────────────────── */}
                <div className="space-y-3">
                    <h3 className="font-bold text-slate-800 px-1">Quick Actions</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                        {/* Crop Doctor */}
                        <div 
                            onClick={() => navigate('/farmer/support')} 
                            className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 transition-transform"
                        >
                            <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center mb-3">
                                <Activity strokeWidth={2.5} />
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm mb-0.5">Crop Doctor</h4>
                            <p className="text-[10px] text-slate-500 font-medium">Detect Disease</p>
                        </div>

                        {/* Soil Test */}
                        <div 
                            className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 transition-transform"
                        >
                            <div className="w-12 h-12 bg-green-100 text-green-500 rounded-2xl flex items-center justify-center mb-3">
                                <FlaskConical strokeWidth={2.5} />
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm mb-0.5">Soil Test</h4>
                            <p className="text-[10px] text-slate-500 font-medium">Check Health</p>
                        </div>

                        {/* Market Price */}
                        <div 
                            onClick={() => navigate('/market-prices')}
                            className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 transition-transform"
                        >
                            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-3">
                                <Store strokeWidth={2.5} />
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm mb-0.5">Market Price</h4>
                            <p className="text-[10px] text-slate-500 font-medium">Today's Rates</p>
                        </div>

                        {/* Shop */}
                        <div 
                            onClick={() => navigate('/marketplace')}
                            className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 transition-transform"
                        >
                            <div className="w-12 h-12 bg-green-100 text-green-500 rounded-2xl flex items-center justify-center mb-3">
                                <ShoppingBag strokeWidth={2.5} />
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm mb-0.5">Shop</h4>
                            <p className="text-[10px] text-slate-500 font-medium">Buy Products</p>
                        </div>

                        {/* Expert Help */}
                        <div 
                            onClick={() => navigate('/farmer/support')}
                            className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 transition-transform"
                        >
                            <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mb-3">
                                <Headphones strokeWidth={2.5} />
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm mb-0.5">Expert Help</h4>
                            <p className="text-[10px] text-slate-500 font-medium">Talk to Expert</p>
                        </div>

                        {/* Weather */}
                        <div 
                            className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 transition-transform"
                        >
                            <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mb-3">
                                <CloudSun strokeWidth={2.5} />
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm mb-0.5">Weather</h4>
                            <p className="text-[10px] text-slate-500 font-medium">7 Day Forecast</p>
                        </div>
                    </div>
                </div>

                {/* ─── GOVT SUBSIDY BANNER ──────────────────────── */}
                <div className="bg-[#fbbf24] rounded-xl p-4 flex items-center justify-between shadow-sm cursor-pointer active:scale-95 transition-transform">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-600 text-amber-50 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                            <Megaphone size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#78350f] text-sm md:text-base">New Govt Subsidy</h4>
                            <p className="text-[11px] md:text-xs text-[#92400e] font-medium leading-tight mt-0.5">
                                Apply for drip irrigation scheme today. Ends soon.
                            </p>
                        </div>
                    </div>
                    <ChevronRight className="text-[#92400e] shrink-0 ml-2" size={20} />
                </div>

                {/* ─── TODAY'S MANDI RATES ──────────────────────── */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                        <h3 className="font-bold text-slate-800">Today's Mandi Rates</h3>
                        <span onClick={() => navigate('/market-prices')} className="text-xs font-bold text-[#16a34a] cursor-pointer">View All</span>
                    </div>
                    <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                        
                        {/* Tomato */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-rose-500 p-4 min-w-[140px] shrink-0">
                            <p className="text-xs font-medium text-slate-500 mb-1">Tomato</p>
                            <p className="text-xl font-bold text-slate-900 mb-1">₹24<span className="text-[10px] text-slate-400 font-medium">/kg</span></p>
                            <p className="text-[10px] font-bold text-rose-500 flex items-center gap-1">
                                ↓ 2.5%
                            </p>
                        </div>

                        {/* Rice */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-[#16a34a] p-4 min-w-[140px] shrink-0">
                            <p className="text-xs font-medium text-slate-500 mb-1">Rice (Paddy)</p>
                            <p className="text-xl font-bold text-slate-900 mb-1">₹2,183<span className="text-[10px] text-slate-400 font-medium">/q</span></p>
                            <p className="text-[10px] font-bold text-[#16a34a] flex items-center gap-1">
                                ↑ 1.2%
                            </p>
                        </div>

                        {/* Onion */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-amber-400 p-4 min-w-[140px] shrink-0">
                            <p className="text-xs font-medium text-slate-500 mb-1">Onion</p>
                            <p className="text-xl font-bold text-slate-900 mb-1">₹45<span className="text-[10px] text-slate-400 font-medium">/kg</span></p>
                            <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                — 0.0%
                            </p>
                        </div>
                    </div>
                </div>

                {/* ─── MY FARM STATUS ─────────────────────────── */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                    <div className="flex items-center gap-2 mb-6">
                        <Mountain size={18} className="text-[#16a34a]" />
                        <h3 className="font-bold text-slate-800 text-sm">My Farm Status</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">TOTAL AREA</p>
                            <p className="font-bold text-slate-900 text-sm">3.5 Acres</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">ACTIVE CROP</p>
                            <p className="font-bold text-slate-900 text-sm">Tomato</p>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SOIL HEALTH</p>
                            <p className="text-[11px] font-bold text-[#16a34a]">72/100 (Good)</p>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className="bg-[#166534] h-2 rounded-full w-[72%]"></div>
                        </div>
                    </div>
                </div>

                {/* ─── RECENT ACTIVITY ──────────────────────────── */}
                <div className="space-y-3">
                    <h3 className="font-bold text-slate-800 px-1">Recent Activity</h3>
                    
                    {/* Activity 1 */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex gap-4">
                        <div className="w-10 h-10 bg-rose-100 text-rose-500 rounded-xl flex items-center justify-center shrink-0">
                            <Activity size={18} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-slate-900 text-sm">Disease Scan Completed</h4>
                                <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap ml-2">2h ago</span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                Early Blight detected. Prescription ready.
                            </p>
                        </div>
                    </div>

                    {/* Activity 2 */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex gap-4">
                        <div className="w-10 h-10 bg-green-100 text-green-500 rounded-xl flex items-center justify-center shrink-0">
                            <Truck size={18} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-slate-900 text-sm">Order Delivered</h4>
                                <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap ml-2">Yesterday</span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                NPK Fertilizer 50kg bag.
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* ─── MOBILE BOTTOM NAVIGATION ─────────────────────── */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center md:hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex flex-col items-center gap-1 cursor-pointer">
                    <div className="w-10 h-10 bg-[#166534] rounded-xl flex items-center justify-center text-white shadow-sm">
                        <LayoutGrid size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-[#166534]">Dashboard</span>
                </div>
                <div className="flex flex-col items-center gap-1 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors">
                    <div className="w-10 h-10 flex items-center justify-center">
                        <Users size={22} />
                    </div>
                    <span className="text-[10px] font-semibold">Portfolios</span>
                </div>
                <div className="flex flex-col items-center gap-1 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors">
                    <div className="w-10 h-10 flex items-center justify-center">
                        <FileText size={22} />
                    </div>
                    <span className="text-[10px] font-semibold">Reports</span>
                </div>
                <div className="flex flex-col items-center gap-1 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors">
                    <div className="w-10 h-10 flex items-center justify-center">
                        <TrendingUp size={22} />
                    </div>
                    <span className="text-[10px] font-semibold">Analytics</span>
                </div>
            </div>

        </div>
    );
};

export default FarmerDashboard;
