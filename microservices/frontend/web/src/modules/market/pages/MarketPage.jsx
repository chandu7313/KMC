import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { 
  RefreshCcw, ArrowUp, ArrowDown, TrendingUp, AlertTriangle, 
  MapPin, Calendar, LayoutGrid, List, Search, Bell,
  Target, Info, ChevronRight, Gauge
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Legend, Cell, ComposedChart, Line
} from 'recharts';
import Navbar from '@/app/layouts/Navbar';
import { toast } from "react-toastify";
import { useGlobalStore } from '@/app/store/globalStore';
import API from '@/core/api/api.config';

const MarketPrices = () => {
  const { backendUrl, userData } = useGlobalStore();
  const [prices, setPrices] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid'); // grid or list
  const [selectedCrop, setSelectedCrop] = useState("Wheat");
  const [selectedDistrict, setSelectedDistrict] = useState("Gadwal"); // Defaulting to an active district
  const [districts, setDistricts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [comparisons, setComparisons] = useState([]);
  const [realTimeData, setRealTimeData] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState(null);
  const [showSummary, setShowSummary] = useState(false); // Mobile-friendly summary mode

  // Fetch all prices and intelligence
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 1. Fetch current list for dropdowns and general table
      const { data: priceData } = await axios.get(`${backendUrl}${API.MARKET}`);
      if (priceData.success) {
        setPrices(priceData.prices);
        const uniqueDistricts = [...new Set(priceData.prices.map(p => p.district))];
        setDistricts(uniqueDistricts);
        if (!selectedDistrict && uniqueDistricts.length > 0) setSelectedDistrict(uniqueDistricts[0]);
      }

      // 2. Fetch specific Real-Time data
      const { data: rtData } = await axios.get(`${backendUrl}${API.MARKET}/realtime`, {
        params: { crop: selectedCrop, district: selectedDistrict }
      });
      if (rtData.success) {
        setRealTimeData(rtData.data);
      }

      // 3. Fetch Trend Analytics (Line Chart)
      const { data: trendData } = await axios.get(`${backendUrl}${API.MARKET}/trend`, {
        params: { crop: selectedCrop, district: selectedDistrict }
      });
      if (trendData.success) {
        setAnalytics(trendData);
      }

      // 4. Fetch AI Recommendation
      const { data: recData } = await axios.get(`${backendUrl}${API.MARKET}/recommendation`, {
        params: { crop: selectedCrop, district: selectedDistrict }
      });
      if (recData.success) {
        setRecommendation(recData);
      }

      // 5. Fetch comparisons
      const { data: compData } = await axios.get(`${backendUrl}${API.MARKET}/comparison/${selectedCrop}`);
      if (compData.success) {
        setComparisons(compData.prices);
      }

    } catch (error) {
      console.error("Market Intelligence Fetch Error:", error);
      setError("Failed to load market data. Please try again later.");
      toast.error("Network Error: Could not sync market intelligence");
    } finally {
      setLoading(false);
    }
  }, [backendUrl, selectedCrop, selectedDistrict]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = [
    { label: "State Avg", value: `₹${(comparisons.reduce((acc, p) => acc + (p.modal_price || p.price), 0) / (comparisons.length || 1)).toFixed(0)}`, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Best Mandi", value: comparisons[0]?.district || "N/A", sub: `₹${comparisons[0]?.modal_price || comparisons[0]?.price || 0}`, icon: MapPin, color: "text-green-600", bg: "bg-green-50" },
    { label: "Market Sentiment", value: analytics?.prediction?.bestTimeToSell || "Stable", icon: Target, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF6] font-sans">
      <Navbar />
      
      <main className="max-w-[1440px] mx-auto px-6 pt-28 pb-20">
        
        {/* Header Section */}
        <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter">
              Market <span className="text-green-600 italic">Intelligence</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-xl text-lg">
              Predictive price analytics and real-time mandi data to help you make informed selling decisions.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 bg-white p-2 rounded-[24px] shadow-sm border border-slate-100">
             {/* Mobile Summary Toggle */}
             <button 
                onClick={() => setShowSummary(!showSummary)}
                className={`md:hidden flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition ${showSummary ? "bg-green-100 text-green-700" : "bg-slate-50 text-slate-400"}`}
             >
                <Gauge size={18} />
                Summary View
             </button>
             <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl">
               <Calendar size={18} className="text-slate-400" />
               <span className="text-sm font-bold text-slate-700">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
             </div>
             <button 
                onClick={fetchData}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition active:scale-95 disabled:opacity-50"
             >
                <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
                Live Sync
             </button>
          </div>
        </section>

        {loading && !error && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-6" />
            <p className="text-slate-900 font-black text-2xl animate-pulse">Analyzing Market Trends...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-100 rounded-[40px] p-12 text-center mb-12">
             <AlertTriangle size={64} className="text-red-600 mx-auto mb-6" />
             <h3 className="text-3xl font-black text-red-900 mb-4 tracking-tight">Intelligence Outage</h3>
             <p className="text-red-700 font-bold mb-8 max-w-lg mx-auto leading-relaxed">{error}</p>
             <button 
                onClick={fetchData}
                className="px-10 py-4 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 transition shadow-xl shadow-red-200"
             >
                Force Re-Sync
             </button>
          </div>
        )}

        {/* Summary Stats Grid */}
        <section className={`grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 ${(showSummary || !error) ? "block" : "hidden md:block"}`}>
           {/* Modal Price Card */}
           <div className={`bg-white p-8 rounded-[36px] border-2 border-green-100 shadow-xl relative overflow-hidden transition-all ${showSummary ? "scale-105" : ""}`}>
              <div className="absolute top-0 right-0 p-4">
                 <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Live Data
                 </div>
              </div>
              <p className="text-slate-500 font-black text-xs uppercase tracking-widest mb-2">Current Price ({selectedCrop})</p>
              <h3 className="text-4xl font-black text-slate-900">₹{realTimeData?.modal_price || "---"}</h3>
              <div className="flex items-center gap-2 mt-2">
                 <MapPin size={14} className="text-green-600" />
                 <p className="text-slate-400 font-bold text-xs">{realTimeData?.mandi || "Select Mandi"}</p>
              </div>
           </div>

           {stats.map((stat, i) => (
            <div key={i} className={`bg-white p-8 rounded-[36px] border border-slate-100 shadow-sm group hover:shadow-xl transition-all duration-500 ${showSummary && i > 0 ? "hidden md:block" : ""}`}>
               <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                 <stat.icon size={28} />
               </div>
               <p className="text-slate-500 font-black text-xs uppercase tracking-widest mb-2">{stat.label}</p>
               <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
               {stat.sub && <p className="text-green-600 font-bold text-sm mt-1">{stat.sub}</p>}
            </div>
          ))}
        </section>

        {/* Intelligence Core: Trends & Forecast */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-12">
          
          {/* Main Chart Area */}
          <div className="xl:col-span-8 bg-white rounded-[40px] p-6 sm:p-10 border border-slate-100 shadow-sm">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                <div>
                   <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                     Historical Trend (30 Days)
                     <div className={`px-3 py-1 rounded-full text-[10px] uppercase font-black ${analytics?.pctChange >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {analytics?.pctChange >= 0 ? "+" : ""}{analytics?.pctChange}% Change
                     </div>
                   </h2>
                   <p className="text-slate-400 text-xs font-bold mt-1">Moving 7-day average: ₹{analytics?.avg7 || "---"}</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 p-2 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 px-3">
                    <Target size={16} className="text-slate-400" />
                    <select 
                      value={selectedCrop}
                      onChange={(e) => setSelectedCrop(e.target.value)}
                      className="bg-transparent border-none font-bold text-slate-700 text-xs focus:ring-0 cursor-pointer"
                    >
                      {['Wheat', 'Rice', 'Maize', 'Cotton', 'Mustard', 'Soyabean', 'Turmeric'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="w-[1px] h-4 bg-slate-200" />
                  <div className="flex items-center gap-2 px-3">
                    <MapPin size={16} className="text-slate-400" />
                    <select 
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="bg-transparent border-none font-bold text-slate-700 text-xs focus:ring-0 cursor-pointer"
                    >
                      {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
             </div>

             <div className="h-[350px] w-full touch-pan-y">
                {analytics?.success ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics?.trends || []}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#64748b', fontWeight: 'bold', fontSize: 10}}
                        tickFormatter={(str) => new Date(str).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#64748b', fontWeight: 'bold', fontSize: 10}}
                        domain={['auto', 'auto']}
                        tickFormatter={(val) => `₹${val}`}
                      />
                      <Tooltip 
                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}}
                        labelStyle={{fontWeight: 'black', color: '#111827', marginBottom: '4px'}}
                        itemStyle={{fontWeight: 'bold', color: '#16a34a'}}
                        formatter={(val) => [`₹${val}`, 'Mandi Price']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#16a34a" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorPrice)" 
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <AlertTriangle size={48} className="text-slate-300 mb-4" />
                    <p className="text-slate-400 font-bold">No trend data available for this market</p>
                  </div>
                )}
             </div>
          </div>

          {/* Forecast & Advisory */}
          <div className="xl:col-span-4 space-y-6">
            {/* Recommendation Card */}
            <div className={`rounded-[40px] p-8 text-white relative overflow-hidden group shadow-2xl ${
              recommendation?.recommendation === "Hold" ? "bg-orange-600" : 
              recommendation?.recommendation === "Sell Now" ? "bg-green-700" : "bg-slate-900"
            }`}>
               <div className="absolute -top-10 -right-10 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <Gauge size={180} />
               </div>
               <div className="relative z-10">
                  <p className="text-white/60 font-black text-xs uppercase tracking-widest mb-4">Advisory Recommendation</p>
                  <h3 className="text-5xl font-black mb-4 tracking-tighter">{recommendation?.recommendation || "---"}</h3>
                  <div className="p-5 bg-white/10 rounded-3xl mb-8 backdrop-blur-md border border-white/20">
                    <p className="text-white font-medium text-sm leading-relaxed">
                      "{recommendation?.reason || "Fetching market insights..."}"
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-white/40 text-[10px] uppercase font-black mb-1">Confidence Score</p>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full bg-white transition-all duration-1000 ${recommendation?.confidence === 'High' ? 'w-[90%]' : 'w-[50%]'}`} />
                      </div>
                    </div>
                    <span className="font-black text-xs">{recommendation?.confidence || "---"}</span>
                  </div>
               </div>
            </div>

            {/* Price Alert Action */}
            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm flex flex-col items-center text-center">
               <div className="w-16 h-16 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                 <Bell size={28} />
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-2">Price Breakthrough Alert</h3>
               <p className="text-slate-400 font-bold text-xs mb-8 uppercase tracking-widest">Never miss a price spike</p>
               <button className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                 <Target size={20} />
                 Set Smart Alert
               </button>
            </div>
          </div>
        </section>

        {/* Detailed Data Table Section */}
        <section className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-8 sm:p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                 <h2 className="text-2xl font-black text-slate-900">District Price Comparison</h2>
                 <p className="text-slate-500 font-medium text-sm">Real-time breakdown of all mandis in your state.</p>
              </div>
              
              <div className="flex items-center gap-3">
                 <div className="relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input 
                      type="text" 
                      placeholder="Search mandi..."
                      className="pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-green-600 w-full sm:w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                   />
                 </div>
                 <div className="flex items-center p-1 bg-slate-50 rounded-xl">
                   <button onClick={() => setView('grid')} className={`p-2 rounded-lg ${view === 'grid' ? 'bg-white shadow-sm text-green-600' : 'text-slate-400'}`}><LayoutGrid size={20}/></button>
                   <button onClick={() => setView('list')} className={`p-2 rounded-lg ${view === 'list' ? 'bg-white shadow-sm text-green-600' : 'text-slate-400'}`}><List size={20}/></button>
                 </div>
              </div>
           </div>

           <div className="overflow-x-auto">
              {view === 'list' ? (
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    <tr>
                      <th className="px-10 py-5">Crop Info</th>
                      <th className="px-10 py-5">District</th>
                      <th className="px-10 py-5">Range (Min - Max)</th>
                      <th className="px-10 py-5">Current Price</th>
                      <th className="px-10 py-5">24H Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {prices.filter(p => !searchTerm || (p.crop_name && p.crop_name.toLowerCase().includes(searchTerm.toLowerCase())) || (p.district && p.district.toLowerCase().includes(searchTerm.toLowerCase()))).map((item) => (
                      <tr key={item.id} className="hover:bg-green-50/30 transition group">
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                               {item.crop_name ? item.crop_name[0] : '?'}
                             </div>
                             <div>
                               <p className="font-black text-slate-900">{item.crop_name}</p>
                               <p className="text-xs font-bold text-slate-400">{item.variety}</p>
                             </div>
                           </div>
                        </td>
                        <td className="px-10 py-6 font-bold text-slate-600">{item.district}</td>
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-2">
                             <span className="text-xs font-bold text-slate-400">₹{item.min_price || item.modal_price - 50}</span>
                             <div className="h-1 w-12 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[60%]" />
                             </div>
                             <span className="text-xs font-bold text-slate-400">₹{item.max_price || item.modal_price + 50}</span>
                           </div>
                        </td>
                        <td className="px-10 py-6">
                           <span className="text-xl font-black text-slate-900">₹{item.modal_price}</span>
                           <span className="text-[10px] ml-1 font-bold text-slate-400">/{item.unit}</span>
                        </td>
                        <td className="px-10 py-6">
                           <div className={`flex items-center gap-1 font-black ${item.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                             {item.change >= 0 ? <ArrowUp size={16}/> : <ArrowDown size={16}/>}
                             {Math.abs(item.change)}%
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
                   {prices.filter(p => !searchTerm || (p.crop_name && p.crop_name.toLowerCase().includes(searchTerm.toLowerCase())) || (p.district && p.district.toLowerCase().includes(searchTerm.toLowerCase()))).map((item) => (
                      <div key={item.id} className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-500">
                         <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-green-600 shadow-sm">{item.crop_name ? item.crop_name[0] : '?'}</div>
                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${item.change >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                               {item.change >= 0 ? "+" : ""}{item.change}%
                            </div>
                         </div>
                         <h4 className="text-xl font-black text-slate-900 truncate">{item.crop_name}</h4>
                         <p className="text-slate-400 font-bold text-xs mb-6 uppercase tracking-widest">{item.district}</p>
                         
                         <div className="flex items-end justify-between">
                            <div>
                               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Mandi Price</p>
                               <span className="text-2xl font-black text-slate-900">₹{item.modal_price}</span>
                            </div>
                            <button className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition translate-y-2 group-hover:translate-y-0">
                               <ChevronRight size={20} />
                            </button>
                         </div>
                      </div>
                   ))}
                </div>
              )}
           </div>
        </section>

      </main>
      
    </div>
  );
};

export default MarketPrices;
