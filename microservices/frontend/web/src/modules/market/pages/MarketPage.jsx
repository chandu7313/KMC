import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { 
  Search, Bell, Sun, LayoutDashboard, ChevronDown, Filter, 
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Info
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { toast } from "react-toastify";
import { useGlobalStore } from '@/app/store/globalStore';
import API from '@/core/api/api.config';

const MarketPage = () => {
  const { backendUrl, userData } = useGlobalStore();
  const [prices, setPrices] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedCrop, setSelectedCrop] = useState("Tomato");
  const [selectedRegion, setSelectedRegion] = useState("Pune APMC");

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch prices
      const { data: priceData } = await axios.get(`${backendUrl}${API.MARKET}/prices`);
      if (priceData.success) {
        setPrices(priceData.prices);
      }

      // Fetch Trend Analytics
      const { data: trendData } = await axios.get(`${backendUrl}${API.MARKET}/trend`, {
        params: { crop: selectedCrop, district: selectedRegion }
      });
      if (trendData.success) {
        setAnalytics(trendData);
      }

    } catch (error) {
      console.error("Market Intelligence Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, [backendUrl, selectedCrop, selectedRegion]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Sync
  const handleSync = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}${API.MARKET}/sync`);
      if (data.success) {
        toast.success(data.message || 'Synced successfully');
        fetchData();
      }
    } catch (e) {
      toast.error('Failed to sync data');
    }
  };

  // Mock data to match exact design when actual data is missing
  const chartData = [
    { day: 'Day 1', price: 1600 },
    { day: 'Day 5', price: 1550 },
    { day: 'Day 10', price: 1700 },
    { day: 'Day 15', price: 1650 },
    { day: 'Day 20', price: 1800 },
    { day: 'Day 25', price: 1750 },
    { day: 'Day 30', price: 1900 },
  ];

  const liveRates = [
    { crop: 'Tomato', today: 1850, yesterday: 1620, change: '+14.2%', trend: 'up', advice: 'SELL NOW', adviceColor: 'bg-green-100 text-green-800' },
    { crop: 'Onion', today: 1200, yesterday: 1310, change: '-8.5%', trend: 'down', advice: 'HOLD', adviceColor: 'bg-red-50 text-red-800' },
    { crop: 'Rice (Basmati)', today: 2450, yesterday: 2440, change: '+0.4%', trend: 'steady', advice: 'WAIT', adviceColor: 'bg-slate-100 text-slate-800' },
    { crop: 'Cotton', today: 7200, yesterday: 7030, change: '+2.4%', trend: 'up', advice: 'PHASED SELL', adviceColor: 'bg-green-100 text-green-800' },
  ];

  // Map real data if available
  const mappedRates = prices?.length > 0 ? prices.slice(0, 4).map(p => ({
    crop: p.cropName,
    today: p.modalPrice,
    yesterday: p.modalPrice - Math.floor(Math.random() * 50), // Mock yesterday
    change: `+${((Math.random() * 5)).toFixed(1)}%`,
    trend: 'up',
    advice: 'HOLD',
    adviceColor: 'bg-slate-100 text-slate-800'
  })) : liveRates;

  return (
    <div className="w-full">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900">Market Intelligence</h1>
          <p className="text-sm text-slate-500">Live APMC Mandi rates and predictive analysis.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
            {selectedRegion} <ChevronDown size={16} className="text-slate-400" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
            All Crops <ChevronDown size={16} className="text-slate-400" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Filter size={16} /> Filter
          </button>
          <button onClick={handleSync} className="hidden sm:block ml-2 text-xs text-green-600 font-bold underline">
            Sync Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Highest Price */}
        <div className="bg-white rounded-xl p-5 border-l-4 border-green-600 shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Highest Price (Quintal)</p>
          <div className="flex justify-between items-end">
            <span className="text-3xl font-bold text-slate-900">₹7,200</span>
            <div className="text-right">
              <span className="text-sm font-bold text-green-600 flex items-center gap-0.5 justify-end"><TrendingUp size={14}/>+2.4%</span>
              <span className="text-[11px] text-slate-500">Cotton</span>
            </div>
          </div>
        </div>
        {/* Biggest Rise */}
        <div className="bg-white rounded-xl p-5 border-l-4 border-green-600 shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Biggest Rise (Today)</p>
          <div className="flex justify-between items-end">
            <span className="text-3xl font-bold text-slate-900">₹1,850</span>
            <div className="text-right">
              <span className="text-sm font-bold text-green-600 flex items-center gap-0.5 justify-end"><TrendingUp size={14}/>+14.2%</span>
              <span className="text-[11px] text-slate-500">Tomato</span>
            </div>
          </div>
        </div>
        {/* Biggest Drop */}
        <div className="bg-white rounded-xl p-5 border-l-4 border-red-600 shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Biggest Drop (Today)</p>
          <div className="flex justify-between items-end">
            <span className="text-3xl font-bold text-slate-900">₹1,200</span>
            <div className="text-right">
              <span className="text-sm font-bold text-red-600 flex items-center gap-0.5 justify-end"><TrendingDown size={14}/>-8.5%</span>
              <span className="text-[11px] text-slate-500">Onion</span>
            </div>
          </div>
        </div>
        {/* My Tracked Crop */}
        <div className="bg-white rounded-xl p-5 border-l-4 border-amber-600 shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">My Tracked Crop</p>
          <div className="flex justify-between items-end">
            <span className="text-3xl font-bold text-slate-900">₹2,450</span>
            <div className="text-right">
              <span className="text-sm font-bold text-slate-500 flex items-center gap-0.5 justify-end">— Steady</span>
              <span className="text-[11px] text-slate-500">Rice (Basmati)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Mandi Live Rates */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900">Mandi Live Rates</h2>
            <button className="text-xs font-bold text-green-700 hover:underline">View Full Board</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
                  <th className="py-3 px-4">Crop</th>
                  <th className="py-3 px-4">Today<br/>(₹/Q)</th>
                  <th className="py-3 px-4">Yesterday</th>
                  <th className="py-3 px-4">Change</th>
                  <th className="py-3 px-4">Trend<br/>(7D)</th>
                  <th className="py-3 px-4">Advice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {liveRates.map((rate, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-4 px-4 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        rate.crop === 'Tomato' ? 'bg-green-100 text-green-600' : 
                        rate.crop === 'Onion' ? 'bg-red-100 text-red-600' : 
                        rate.crop.includes('Rice') ? 'bg-slate-100 text-slate-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {/* Placeholder icons based on crop */}
                        {rate.crop === 'Tomato' ? <div className="w-4 h-4 rounded-full border-2 border-current"/> : 
                         rate.crop === 'Onion' ? <div className="w-4 h-4 rotate-45 border-t-2 border-l-2 border-current"/> : 
                         <div className="w-4 h-4 bg-current rounded-sm opacity-50"/>}
                      </div>
                      <span className="font-bold text-sm text-slate-900">{rate.crop}</span>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">₹{rate.today.toLocaleString()}</td>
                    <td className="py-4 px-4 text-sm text-slate-500">₹{rate.yesterday.toLocaleString()}</td>
                    <td className={`py-4 px-4 font-bold text-sm ${rate.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {rate.change}
                    </td>
                    <td className="py-4 px-4">
                      {/* Simple SVG sparklines matching the design */}
                      {rate.trend === 'up' && (
                        <svg width="40" height="15" viewBox="0 0 40 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 12L12 10L20 12L39 2" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      )}
                      {rate.trend === 'down' && (
                        <svg width="40" height="15" viewBox="0 0 40 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 2L12 4L20 2L39 12" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      )}
                      {rate.trend === 'steady' && (
                        <svg width="40" height="15" viewBox="0 0 40 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 8H15L20 7L25 8H39" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-wider ${rate.adviceColor}`}>
                        {rate.advice}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 30-Day Trend Index */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="font-bold text-slate-900">30-Day Trend Index</h2>
              <p className="text-[11px] text-slate-500">Aggregated market sentiment</p>
            </div>
            <button className="flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-700">
              Tomato <ChevronDown size={14} className="text-slate-400" />
            </button>
          </div>
          <div className="flex-1 min-h-[200px] w-full relative">
             <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#000', fontWeight: 'bold', fontSize: 9}}
                  ticks={['Day 1', 'Day 15', 'Day 30']}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#16a34a" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorTrend)" 
                />
              </AreaChart>
            </ResponsiveContainer>
            {/* Peak Detected Tooltip Mock */}
            <div className="absolute top-4 right-4 bg-white border border-green-200 shadow-sm px-2 py-1 rounded text-[9px] font-bold text-green-700 uppercase tracking-widest">
              Peak Detected
            </div>
          </div>
        </div>
      </div>

      {/* AI Agri-Adviser */}
      <div className="bg-[#f0ede6] border border-orange-100 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-md flex items-center justify-center">
            <LayoutDashboard size={14} />
          </div>
          <h2 className="text-lg font-bold text-slate-900">AI Agri-Adviser</h2>
        </div>
        <p className="text-xs text-slate-600 mb-6 max-w-sm">Based on regional weather patterns, APMC arrival volumes, and historical price elasticity.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Sell Now */}
          <div className="bg-white rounded-lg p-5 border-l-4 border-green-600 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Sell Now</span>
              <div className="w-5 h-5 rounded-full border-2 border-green-600 flex items-center justify-center text-green-600">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Tomato</h3>
            <p className="text-[11px] text-slate-600 mb-4 leading-relaxed">Heavy rains predicted in Karnataka will disrupt supply chain next week. Capitalize on current high.</p>
            <button className="w-full py-2 bg-green-700 hover:bg-green-800 text-white rounded text-xs font-bold transition">Find Buyers</button>
          </div>
          
          {/* Hold Position */}
          <div className="bg-white rounded-lg p-5 border-l-4 border-slate-400 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Hold Position</span>
              <div className="text-slate-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
              </div>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Rice (Basmati)</h3>
            <p className="text-[11px] text-slate-600 mb-4 leading-relaxed">Export quota policy review pending. Prices expected to stabilize post-announcement.</p>
            <button className="w-full py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-bold transition">Set Price Alert</button>
          </div>

          {/* Do Not Sell */}
          <div className="bg-white rounded-lg p-5 border-l-4 border-red-600 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Do Not Sell</span>
              <div className="text-red-600">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
              </div>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Onion</h3>
            <p className="text-[11px] text-slate-600 mb-4 leading-relaxed">Market flooded due to panic harvesting in Nashik. Wait 14 days for buffer stock procurement to begin.</p>
            <button className="w-full py-2 bg-white border border-red-200 hover:bg-red-50 text-red-600 rounded text-xs font-bold transition">View Storage Tips</button>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default MarketPage;
