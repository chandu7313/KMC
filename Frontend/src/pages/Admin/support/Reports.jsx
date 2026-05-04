import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, Users, Ticket, Clock, Star } from 'lucide-react';

const Reports = () => (
    <div className="max-w-[1400px] mx-auto space-y-6">
        <div>
            <h1 className="text-2xl font-black text-slate-800">Reports</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Performance analytics and team metrics</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-3"><TrendingUp size={16} className="text-green-600" /><span className="text-xs font-semibold text-green-600">+12%</span></div>
                <p className="text-2xl font-black text-slate-800">1,247</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Tickets This Month</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-3"><TrendingDown size={16} className="text-green-600" /><span className="text-xs font-semibold text-green-600">-8% (good)</span></div>
                <p className="text-2xl font-black text-slate-800">2.1h</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Avg Resolution Time</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-3"><Star size={16} className="text-amber-500" /></div>
                <p className="text-2xl font-black text-slate-800">4.6/5</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Avg CSAT Score</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-3"><Users size={16} className="text-blue-500" /></div>
                <p className="text-2xl font-black text-slate-800">94%</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">First Contact Resolution</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-bold text-slate-800 mb-4">Agent Performance</h3>
                <div className="space-y-4">
                    {[
                        { name: 'Sarah', resolved: 48, avg: '1.8h', csat: 4.8 },
                        { name: 'John', resolved: 42, avg: '2.1h', csat: 4.5 },
                        { name: 'Priya', resolved: 38, avg: '2.4h', csat: 4.7 },
                        { name: 'Amit', resolved: 35, avg: '2.6h', csat: 4.3 },
                    ].map(a => (
                        <div key={a.name} className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl">
                            <div className="w-9 h-9 rounded-full bg-[#1a5632] text-white flex items-center justify-center font-bold text-sm">{a.name.charAt(0)}</div>
                            <div className="flex-1">
                                <p className="font-semibold text-slate-700 text-sm">{a.name}</p>
                                <p className="text-[10px] text-slate-400">{a.resolved} resolved • Avg {a.avg}</p>
                            </div>
                            <div className="flex items-center gap-1 text-amber-500"><Star size={12} /><span className="text-sm font-bold text-slate-700">{a.csat}</span></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-bold text-slate-800 mb-4">Top Issue Categories</h3>
                <div className="space-y-4">
                    {[
                        { cat: 'Order Issues', pct: 35, color: 'bg-[#1a5632]' },
                        { cat: 'Payment', pct: 25, color: 'bg-green-500' },
                        { cat: 'Delivery', pct: 15, color: 'bg-emerald-400' },
                        { cat: 'App Issues', pct: 10, color: 'bg-amber-400' },
                        { cat: 'Expert', pct: 8, color: 'bg-red-400' },
                        { cat: 'General', pct: 7, color: 'bg-slate-400' },
                    ].map(c => (
                        <div key={c.cat}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-semibold text-slate-700">{c.cat}</span>
                                <span className="font-bold text-slate-800">{c.pct}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.pct}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default Reports;
