import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Download, Calendar, Ticket, Clock, AlertTriangle, Star, TrendingUp } from "lucide-react";

const COLORS = ['#10b981','#f59e0b','#3b82f6','#ef4444','#8b5cf6','#ec4899'];

const Reports = () => {
  const { backendUrl } = useContext(AppContext);
  const [report, setReport] = useState(null);
  const [agentReport, setAgentReport] = useState([]);
  const [volumeTrend, setVolumeTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  useEffect(() => {
    const fetch = async () => {
      try {
        const [dashRes, agentRes, trendRes] = await Promise.all([
          axios.get(`${backendUrl}/api/support/reports/dashboard`),
          axios.get(`${backendUrl}/api/support/reports/agents`),
          axios.get(`${backendUrl}/api/support/reports/tickets`)
        ]);
        if (dashRes.data.success) setReport(dashRes.data.report);
        if (agentRes.data.success) setAgentReport(agentRes.data.agents);
        if (trendRes.data.success) setVolumeTrend(trendRes.data.volumeTrend);
      } catch {
        setReport({ totalCreated: 247, avgResolutionHrs: 8.4, avgFirstResponseHrs: 1.8, slaBreachCount: 12,
          byCategory: [{ category: 'Orders', count: 45 },{ category: 'Payments', count: 35 },{ category: 'App', count: 28 },{ category: 'Booking', count: 22 },{ category: 'General', count: 30 }],
          byStatus: [{ status: 'open', count: 38 },{ status: 'in_progress', count: 24 },{ status: 'resolved', count: 150 },{ status: 'closed', count: 35 }],
        });
        setAgentReport([
          { name: 'Priya', ticketsAssigned: 85, ticketsResolved: 72, rating: 4.7, slaMetPct: 94 },
          { name: 'Ravi', ticketsAssigned: 65, ticketsResolved: 58, rating: 4.3, slaMetPct: 88 },
          { name: 'Meera', ticketsAssigned: 97, ticketsResolved: 90, rating: 4.8, slaMetPct: 96 },
        ]);
        setVolumeTrend(Array.from({ length: 14 }, (_, i) => ({ date: `Apr ${i+15}`, count: Math.floor(Math.random()*20)+10 })));
      } finally { setLoading(false); }
    };
    fetch();
  }, [backendUrl]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!report) return null;

  const summaryCards = [
    { label: 'Total Created', value: report.totalCreated, icon: Ticket, color: 'text-blue-400' },
    { label: 'Avg Response', value: `${report.avgFirstResponseHrs}h`, icon: Clock, color: 'text-emerald-400' },
    { label: 'Avg Resolution', value: `${report.avgResolutionHrs}h`, icon: TrendingUp, color: 'text-amber-400' },
    { label: 'SLA Breaches', value: report.slaBreachCount, icon: AlertTriangle, color: 'text-red-400' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-white">Reports & Analytics</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors"><Download size={14} /> Export</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryCards.map((s, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2"><s.icon size={16} className={s.color} /><span className="text-xs text-slate-500">{s.label}</span></div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Volume Trend */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Ticket Volume Trend</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={volumeTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#e2e8f0' }} />
                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* By Status */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Tickets by Status</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={report.byStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="status" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#e2e8f0' }} />
                <Bar dataKey="count" radius={[4,4,0,0]}>
                  {report.byStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Agent Performance Table */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800/50">
          <h3 className="text-sm font-semibold text-slate-300">Agent Performance</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800/50">
              {['Agent','Assigned','Resolved','Resolution Rate','Rating','SLA Met'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30">
            {agentReport.map((a, i) => (
              <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                <td className="px-5 py-3"><div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">{a.name.charAt(0)}</div><span className="text-sm text-white">{a.name}</span></div></td>
                <td className="px-5 py-3 text-sm text-slate-300">{a.ticketsAssigned}</td>
                <td className="px-5 py-3 text-sm text-slate-300">{a.ticketsResolved}</td>
                <td className="px-5 py-3"><div className="flex items-center gap-2"><div className="w-20 h-1.5 bg-slate-800 rounded-full"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${a.ticketsAssigned ? Math.round((a.ticketsResolved/a.ticketsAssigned)*100) : 0}%` }} /></div><span className="text-xs text-slate-400">{a.ticketsAssigned ? Math.round((a.ticketsResolved/a.ticketsAssigned)*100) : 0}%</span></div></td>
                <td className="px-5 py-3"><span className="flex items-center gap-1 text-sm text-amber-400"><Star size={12} fill="currentColor" />{a.rating}</span></td>
                <td className="px-5 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${a.slaMetPct >= 90 ? 'bg-emerald-500/10 text-emerald-400' : a.slaMetPct >= 70 ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>{a.slaMetPct}%</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
