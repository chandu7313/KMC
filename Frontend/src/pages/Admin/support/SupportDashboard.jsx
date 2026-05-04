import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import {
  Ticket, AlertCircle, Clock, CheckCircle2, Timer, Star,
  ArrowUpRight, ArrowDownRight, Activity
} from "lucide-react";

const COLORS = ['#10b981','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#ec4899','#6366f1'];

const StatCard = ({ label, value, icon: Icon, color, trend }) => (
  <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5 hover:border-slate-700/50 transition-all group">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
        <h3 className="text-2xl font-bold text-white mt-1.5">{value}</h3>
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            <span>{Math.abs(trend)}% vs yesterday</span>
          </div>
        )}
      </div>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
        <Icon size={18} />
      </div>
    </div>
  </div>
);

const SupportDashboard = () => {
  const { backendUrl } = useContext(AppContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res } = await axios.get(`${backendUrl}/api/support/dashboard`);
        if (res.success) setData(res);
        else toast.error(res.message);
      } catch (err) {
        console.error(err);
        // Use mock data for initial setup
        setData({
          stats: { total: 247, open: 38, inProgress: 24, resolvedToday: 12, avgResponseHrs: 2.4, satisfaction: 4.6 },
          volumeData: [
            { date: 'Mon', count: 18 }, { date: 'Tue', count: 24 }, { date: 'Wed', count: 15 },
            { date: 'Thu', count: 32 }, { date: 'Fri', count: 28 }, { date: 'Sat', count: 20 }, { date: 'Sun', count: 12 }
          ],
          categoryData: [
            { category: 'Order Issues', count: 45 }, { category: 'App Problems', count: 28 },
            { category: 'Payment Issues', count: 35 }, { category: 'Expert Booking', count: 22 },
            { category: 'Disease Detection', count: 18 }, { category: 'Soil Testing', count: 15 },
            { category: 'General Query', count: 30 }
          ],
          recentActivity: [],
          agents: []
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [backendUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return null;
  const { stats, volumeData, categoryData, recentActivity, agents } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Support Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Overview of your customer support operations</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Activity size={12} className="text-emerald-500 animate-pulse" />
          <span>Live</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard label="Total Tickets" value={stats.total} icon={Ticket} color="bg-blue-500/10 text-blue-400" />
        <StatCard label="Open" value={stats.open} icon={AlertCircle} color="bg-red-500/10 text-red-400" trend={-5} />
        <StatCard label="In Progress" value={stats.inProgress} icon={Clock} color="bg-amber-500/10 text-amber-400" />
        <StatCard label="Resolved Today" value={stats.resolvedToday} icon={CheckCircle2} color="bg-emerald-500/10 text-emerald-400" trend={12} />
        <StatCard label="Avg Response" value={`${stats.avgResponseHrs}h`} icon={Timer} color="bg-purple-500/10 text-purple-400" />
        <StatCard label="Satisfaction" value={`${stats.satisfaction}/5`} icon={Star} color="bg-yellow-500/10 text-yellow-400" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Ticket Volume */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Ticket Volume (Last 7 Days)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#e2e8f0' }} />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Ticket Categories</h3>
          <div className="h-56 flex items-center">
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={70} strokeWidth={2} stroke="#0f172a">
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5">
              {categoryData.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-slate-400 truncate">{item.category}</span>
                  <span className="text-slate-500 ml-auto">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity + Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Recent Activity</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {(recentActivity.length > 0 ? recentActivity : [
              { status: 'open', subject: 'Order not delivered', Farmer: { name: 'Rajesh Kumar' }, category: 'Order Issues' },
              { status: 'resolved', subject: 'Payment refund request', Farmer: { name: 'Suresh Reddy' }, category: 'Payment Issues' },
              { status: 'in_progress', subject: 'App not loading', Farmer: { name: 'Venkat Rao' }, category: 'App Problems' },
              { status: 'open', subject: 'Soil test report missing', Farmer: { name: 'Lakshmi Devi' }, category: 'Soil Testing' },
            ]).map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-800/30 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  item.status === 'open' ? 'bg-blue-400' :
                  item.status === 'resolved' ? 'bg-emerald-400' :
                  item.status === 'in_progress' ? 'bg-amber-400' : 'bg-slate-400'
                }`} />
                <div className="min-w-0">
                  <p className="text-sm text-slate-300 truncate">{item.subject || item.Farmer?.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.Farmer?.name} · {item.category}
                  </p>
                </div>
                <span className={`ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                  item.status === 'open' ? 'bg-blue-500/10 text-blue-400' :
                  item.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400' :
                  'bg-amber-500/10 text-amber-400'
                }`}>{item.status?.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Status */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Agent Status</h3>
          <div className="space-y-3">
            {(agents.length > 0 ? agents : [
              { name: 'Agent Priya', status: 'online', openTickets: 5, resolvedToday: 8 },
              { name: 'Agent Ravi', status: 'busy', openTickets: 3, resolvedToday: 4 },
              { name: 'Agent Meera', status: 'offline', openTickets: 0, resolvedToday: 6 },
            ]).map((agent, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-800/30 transition-colors">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">
                    {agent.name?.charAt(0)}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${
                    agent.status === 'online' ? 'bg-emerald-400' : agent.status === 'busy' ? 'bg-amber-400' : 'bg-slate-500'
                  }`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-300 font-medium truncate">{agent.name}</p>
                  <p className="text-[10px] text-slate-500">{agent.openTickets} open · {agent.resolvedToday} resolved</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportDashboard;
