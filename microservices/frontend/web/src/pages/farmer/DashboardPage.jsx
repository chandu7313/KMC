import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FlaskConical, TrendingUp, ShoppingCart, Calendar,
    ArrowRight, ArrowUpRight, ArrowDownRight, ArrowRight as ArrowFlat,
    CheckCircle2, Download, ExternalLink, Package, Sprout
} from 'lucide-react';
import { assets } from '../../assets/assets';

const FarmerDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
            
            {/* STATS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {/* Stat 1 */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow cursor-pointer border-b-4 border-b-green-700">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-700">
                            <FlaskConical size={20} />
                        </div>
                        <span className="bg-green-700 text-white text-[10px] font-bold px-2 py-1 rounded tracking-wider">ACTIVE</span>
                    </div>
                    <p className="text-slate-500 text-sm font-semibold mb-1">Soil Reports</p>
                    <h3 className="text-2xl font-black text-slate-800">12 Total</h3>
                </div>

                {/* Stat 2 */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow cursor-pointer border-b-4 border-b-rose-500">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
                            <TrendingUp size={20} />
                        </div>
                        <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-1 rounded tracking-wider">8 ALERT</span>
                    </div>
                    <p className="text-slate-500 text-sm font-semibold mb-1">Price Alerts</p>
                    <h3 className="text-2xl font-black text-slate-800">Wheat <span className="text-xl">↑ 4%</span></h3>
                </div>

                {/* Stat 3 */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow cursor-pointer border-b-4 border-b-[#1f2d1f]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-700">
                            <ShoppingCart size={20} />
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm font-semibold mb-1">Orders</p>
                    <h3 className="text-2xl font-black text-slate-800">04 Pending</h3>
                </div>

                {/* Stat 4 */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow cursor-pointer border-b-4 border-b-green-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-700">
                            <Calendar size={20} />
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm font-semibold mb-1">Next Test</p>
                    <h3 className="text-2xl font-black text-slate-800">Oct 24</h3>
                </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                
                {/* LEFT COLUMN: 2 spans */}
                <div className="xl:col-span-2 space-y-6 lg:space-y-8">
                    
                    {/* Mandi Prices */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-800">Mandi Prices: Punjab Region</h3>
                            <button 
                                onClick={() => navigate('/market-prices')}
                                className="text-sm font-bold text-green-700 flex items-center gap-1 hover:text-green-800"
                            >
                                View All <ArrowRight size={16} />
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-widest font-bold">
                                        <th className="p-4 pl-6">Commodity</th>
                                        <th className="p-4">Mandi</th>
                                        <th className="p-4">Price (Per Qtl)</th>
                                        <th className="p-4 pr-6">Trend</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-semibold text-slate-700 divide-y divide-slate-50">
                                    <tr className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 pl-6">Wheat (Kanak)</td>
                                        <td className="p-4 text-slate-500">Khanna</td>
                                        <td className="p-4 font-bold text-slate-900">₹2,125</td>
                                        <td className="p-4 pr-6">
                                            <span className="flex items-center gap-1 text-green-600">
                                                <ArrowUpRight size={16} /> +1.2%
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 pl-6">Basmati Paddy</td>
                                        <td className="p-4 text-slate-500">Amritsar</td>
                                        <td className="p-4 font-bold text-slate-900">₹3,850</td>
                                        <td className="p-4 pr-6">
                                            <span className="flex items-center gap-1 text-rose-500">
                                                <ArrowDownRight size={16} /> -0.5%
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 pl-6">Cotton (Narma)</td>
                                        <td className="p-4 text-slate-500">Bathinda</td>
                                        <td className="p-4 font-bold text-slate-900">₹7,400</td>
                                        <td className="p-4 pr-6">
                                            <span className="flex items-center gap-1 text-green-600">
                                                <ArrowUpRight size={16} /> +2.8%
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 pl-6">Maize</td>
                                        <td className="p-4 text-slate-500">Jalandhar</td>
                                        <td className="p-4 font-bold text-slate-900">₹1,950</td>
                                        <td className="p-4 pr-6">
                                            <span className="flex items-center gap-1 text-slate-400">
                                                <ArrowFlat size={16} /> 0.0%
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-slate-800">Recent Shop Orders</h3>
                            <button 
                                onClick={() => navigate('/my-orders')}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                            >
                                Track All
                            </button>
                        </div>
                        <div className="space-y-4">
                            {/* Order 1 */}
                            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-transparent hover:border-green-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-green-600 shrink-0">
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm mb-1">NPK Fertilizer 10-10-10</h4>
                                        <p className="text-xs text-slate-500 font-medium">Order #KMC-8821 • 12 Bags</p>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end gap-2">
                                    <span className="font-black text-slate-900">₹18,400</span>
                                    <span className="bg-[#186036] text-white text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                        SHIPPED
                                    </span>
                                </div>
                            </div>

                            {/* Order 2 */}
                            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-transparent hover:border-green-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-green-600 shrink-0">
                                        <Sprout size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm mb-1">Organic Neem Pesticide</h4>
                                        <p className="text-xs text-slate-500 font-medium">Order #KMC-8745 • 5 Liters</p>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end gap-2">
                                    <span className="font-black text-slate-900">₹4,200</span>
                                    <span className="bg-slate-200 text-slate-600 text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                        DELIVERED
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: 1 span */}
                <div className="space-y-6 lg:space-y-8">
                    
                    {/* Recent Soil Report */}
                    <div className="bg-[#388e3c] rounded-3xl p-6 relative overflow-hidden shadow-lg border border-[#2e7d32]">
                        {/* Background subtle leaf shape/gradient if needed, matching image */}
                        <div className="absolute -bottom-10 -right-10 text-white/10 opacity-30">
                           <Sprout size={160} />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-green-100 text-[10px] font-bold uppercase tracking-widest mb-4">
                                <CheckCircle2 size={16} className="text-green-300" /> RECENT SOIL REPORT
                            </div>
                            <h2 className="text-3xl font-black text-white leading-tight mb-3">
                                Field A-12 Nutrient Status
                            </h2>
                            <p className="text-sm text-green-100/90 font-medium mb-8 leading-relaxed">
                                Last tested on 12th Sept 2023. Recommendations generated for Rabi season.
                            </p>

                            <div className="space-y-3 mb-8">
                                <div className="flex justify-between items-center bg-white/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10">
                                    <span className="font-semibold text-white text-sm">Nitrogen (N)</span>
                                    <span className="font-bold text-white text-sm uppercase">LOW</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10">
                                    <span className="font-semibold text-white text-sm">Phosphorus (P)</span>
                                    <span className="font-bold text-white text-sm uppercase">OPTIMAL</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10">
                                    <span className="font-semibold text-white text-sm">Potassium (K)</span>
                                    <span className="font-bold text-white text-sm uppercase">HIGH</span>
                                </div>
                            </div>

                            <button className="bg-white hover:bg-slate-50 text-green-800 w-full py-3.5 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95">
                                DOWNLOAD PDF <Download size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Success Story Widget */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col group cursor-pointer" onClick={() => navigate('/success-stories')}>
                        <div className="h-40 w-full bg-slate-200 overflow-hidden">
                            <img 
                                src={assets.hero_image || "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=400"} 
                                alt="Success Story Field" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                            />
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-1.5 text-rose-600 text-[10px] font-bold uppercase tracking-widest mb-3">
                                <ExternalLink size={12} /> SUCCESS STORY
                            </div>
                            <h3 className="font-bold text-lg text-slate-800 mb-3 group-hover:text-green-700 transition-colors">
                                How Harpreet increased yield by 22%
                            </h3>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                                Using KMC's precise soil testing and mandi timing alerts, Farmer Harpreet from Sangrur hit record wheat production this year.
                            </p>
                            <span className="text-sm font-bold text-green-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                                Read the Story <ArrowRight size={14} />
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FarmerDashboard;
