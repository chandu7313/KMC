import React, { useState, useEffect } from 'react';
import Navbar from '@/app/layouts/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Activity, Clipboard, Download, ArrowLeft, Beaker, Sprout } from 'lucide-react';
import { useGlobalStore } from '@/app/store/globalStore';
import API from '@/core/api/api.config';

const SoilHistory = () => {
  const { backendUrl, userData, navigate } = useGlobalStore();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    if (!userData) return;
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(`${backendUrl}${API.SOIL}/history`);
      if (data.success) {
        setHistory(data.data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
      }
    } catch (error) {
      toast.error("Failed to load soil history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) fetchHistory();
  }, [userData]);

  const handleDownload = async (id) => {
    try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${backendUrl}${API.SOIL}/download/${id}`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Soil_Report_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        toast.error("Download failed");
    }
  };

  const chartData = history.map(item => ({
    date: new Date(item.created_at).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
    ph: item.ph,
    n: item.nitrogen,
    p: item.phosphorus,
    k: item.potassium
  }));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-8 pt-24 pb-12">
        
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
            <div>
                <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-900 flex items-center gap-2 mb-4 font-bold text-sm transition-colors">
                    <ArrowLeft size={16} /> Back to dashboard
                </button>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Soil Health Trends</h1>
                <p className="text-slate-500 font-medium mt-1">Comparative analysis of your farm's soil quality over time.</p>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-3xl flex items-center justify-center text-green-600">
                <TrendingUp size={32} />
            </div>
        </div>

        {loading ? (
            <div className="h-96 flex items-center justify-center text-slate-400 font-bold">Analyzing historic data...</div>
        ) : history.length < 2 ? (
            <div className="h-96 flex flex-col items-center justify-center bg-white rounded-[40px] border border-slate-100 p-12 text-center">
                <Beaker size={48} className="text-slate-200 mb-4" />
                <h3 className="text-xl font-black text-slate-900">Insufficient Data</h3>
                <p className="text-slate-500 max-w-xs mt-2">You need at least two soil tests to visualize trends and improvements.</p>
            </div>
        ) : (
            <div className="space-y-8 animate-in fade-in duration-700">
                
                {/* pH Trend Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-[40px] p-8 sm:p-10 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Activity size={16} className="text-green-600" />
                                pH Reaction Trend
                            </h3>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                    <span className="text-[10px] font-black text-slate-400">pH LEVEL</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                                    <YAxis domain={[4, 10]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                                    <Area type="monotone" dataKey="ph" stroke="#16a34a" strokeWidth={4} fillOpacity={1} fill="url(#colorPh)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Stats Summary */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-[#0f172a] rounded-[40px] p-8 text-white">
                            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Health Improvement</h4>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-bold text-slate-400">Baseline pH</p>
                                    <p className="text-2xl font-black">{history[0].ph}</p>
                                </div>
                                <div className="h-px bg-slate-800"></div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400">Current pH</p>
                                    <div className="flex items-center gap-3">
                                        <p className="text-2xl font-black">{history[history.length - 1].ph}</p>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${history[history.length - 1].ph > history[0].ph ? 'bg-green-500/20 text-green-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                            {history[history.length - 1].ph > history[0].ph ? '+ INCREASED' : '- DECREASED'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[40px] p-8 border border-slate-100 flex items-center gap-5">
                            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                                <Sprout size={28} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Growth Factor</p>
                                <p className="text-xl font-black text-slate-900">Optimizing...</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nutrient List Table */}
                <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-50">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                             <Clipboard size={16} className="text-slate-400" />
                             Historic Parameter Table
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <th className="px-8 py-5">Date</th>
                                    <th className="px-8 py-5">pH</th>
                                    <th className="px-8 py-5">Nitrogen</th>
                                    <th className="px-8 py-5">Phosphorus</th>
                                    <th className="px-8 py-5">Potassium</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {[...history].reverse().map(test => (
                                    <tr key={test.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-8 py-5">
                                            <p className="font-bold text-slate-900 text-sm">{new Date(test.created_at).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-8 py-5 font-black text-slate-700">{test.ph}</td>
                                        <td className="px-8 py-5 font-bold text-slate-600">{test.nitrogen} ppm</td>
                                        <td className="px-8 py-5 font-bold text-slate-600">{test.phosphorus} ppm</td>
                                        <td className="px-8 py-5 font-bold text-slate-600">{test.potassium} ppm</td>
                                        <td className="px-8 py-5">
                                            <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-1 rounded ${test.soil_status === 'Neutral' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {test.soil_status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button onClick={() => handleDownload(test.id)} className="text-slate-400 hover:text-green-600 transition-colors">
                                                <Download size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default SoilHistory;
