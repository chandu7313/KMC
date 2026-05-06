import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Activity, Server, AlertTriangle, Users, Database, HardDrive, Bell } from 'lucide-react';

const TechDashboard = () => {
  const { backendUrl } = useContext(AppContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuperStats = async () => {
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.get(backendUrl + "/api/admin/super-stats");
        if (res.data.success) {
          setData(res.data.stats);
        }
      } catch (error) {
        console.error("Failed to load tech dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSuperStats();
  }, [backendUrl]);

  if (loading || !data) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#1A5319]/20 border-t-[#1A5319] rounded-full animate-spin"></div>
      </div>
    );
  }

  // Top Metrics Cards
  const topMetrics = [
    { label: 'API Status', value: `${data.apiStatus}%`, sub: '↗ Uptime', icon: <Activity size={16} className="text-emerald-600"/>, border: 'border-l-4 border-emerald-600' },
    { label: 'Server Response', value: data.serverResponse, sub: 'Avg Global', icon: <Server size={16} className="text-slate-500"/>, border: 'border-l-4 border-slate-300' },
    { label: 'Error Rate', value: data.errorRate, sub: 'Last 24h', icon: <AlertTriangle size={16} className="text-amber-500"/>, border: 'border-l-4 border-amber-500' },
    { label: 'Active Users', value: data.totalUsers?.toLocaleString(), sub: `↗ +${data.newToday}%`, icon: <Users size={16} className="text-emerald-600"/>, border: 'border-l-4 border-emerald-600' },
    { label: 'DB Health', value: data.dbHealth, sub: 'Supabase Prod', icon: <Database size={16} className="text-slate-500"/>, border: 'border-l-4 border-emerald-600' },
    { label: 'Storage', value: data.storageUsed, type: 'progress', icon: <HardDrive size={16} className="text-slate-500"/>, border: 'border-l-4 border-slate-800' }
  ];

  // Process Firehose data (simulate log stream)
  const firehoseData = [
    { time: new Date(Date.now() - 1000).toISOString().split('T')[1].slice(0,8) + 'Z', method: 'GET', endpoint: '/api/v1/users/profile', status: 200, latency: '42ms', ip: '192.168.1.104' },
    { time: new Date(Date.now() - 4000).toISOString().split('T')[1].slice(0,8) + 'Z', method: 'POST', endpoint: '/api/v1/reports/new', status: 201, latency: '118ms', ip: 'usr_982jhf92' },
    { time: new Date(Date.now() - 11000).toISOString().split('T')[1].slice(0,8) + 'Z', method: 'GET', endpoint: '/api/v1/ai/predict_disease', status: 500, latency: '2405ms', ip: 'usr_443xna11' },
    { time: new Date(Date.now() - 15000).toISOString().split('T')[1].slice(0,8) + 'Z', method: 'GET', endpoint: '/api/v1/crops/list', status: 200, latency: '31ms', ip: '10.0.0.42' },
    { time: new Date(Date.now() - 18000).toISOString().split('T')[1].slice(0,8) + 'Z', method: 'OPTIONS', endpoint: '/api/v1/upload/image', status: 204, latency: '12ms', ip: 'cors-preflight' },
  ];

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-8">
      
      {/* ── Top Metrics ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {topMetrics.map((card, idx) => (
          <div key={idx} className={`bg-white rounded-lg border border-slate-200 p-4 shadow-sm ${card.border}`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-slate-500">{card.label}</span>
              {card.icon}
            </div>
            <div className="text-2xl font-bold text-slate-800 mb-1">{card.value}</div>
            
            {card.type === 'progress' ? (
              <div className="mt-2">
                 <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-slate-700 h-1.5 rounded-full" style={{ width: card.value }}></div>
                 </div>
              </div>
            ) : (
              <div className={`text-[10px] font-bold ${card.sub.includes('↗') ? 'text-emerald-600' : 'text-slate-400'}`}>
                {card.sub}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* ── API Request Volume Chart ── */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 lg:col-span-6 flex flex-col shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-slate-700"/>
              <h3 className="text-sm font-bold text-slate-800">API Request Volume</h3>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Success</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Failed</div>
            </div>
          </div>
          <div className="h-64 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.apiVolume} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => val > 999 ? (val/1000)+'k' : val} />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="step" dataKey="success" stroke="#10b981" fillOpacity={1} fill="url(#colorSuccess)" strokeWidth={1} />
                <Area type="step" dataKey="failed" stroke="#ef4444" fill="none" strokeWidth={1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Integrations Status ── */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 lg:col-span-3 flex flex-col shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <Server size={16} className="text-slate-700"/>
            <h3 className="text-sm font-bold text-slate-800">Integrations</h3>
          </div>
          <div className="flex-1 flex flex-col justify-between">
            {data.integrations.map((intg, i) => (
              <div key={i} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2">
                  <Database size={14} className="text-slate-400" />
                  <span className="text-sm font-semibold text-slate-700">{intg.name}</span>
                </div>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                  intg.status === 'OPERATIONAL' ? 'bg-emerald-100 text-emerald-800' :
                  intg.status === 'DEGRADED' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                }`}>
                  {intg.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Alerts ── */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 lg:col-span-3 flex flex-col shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-red-500"/>
              <h3 className="text-sm font-bold text-slate-800">Alerts</h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400">Last 24h</span>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto pr-1 scrollbar-thin">
            {data.alerts.map((alert, i) => (
              <div key={i} className={`p-3 rounded-lg border ${
                alert.type === 'critical' ? 'bg-red-50/50 border-red-100' :
                alert.type === 'warning' ? 'bg-amber-50/50 border-amber-100' :
                alert.type === 'success' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-blue-50/50 border-blue-100'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {alert.type === 'critical' ? <AlertTriangle size={12} className="text-red-600"/> :
                   alert.type === 'warning' ? <AlertTriangle size={12} className="text-amber-600"/> :
                   <Activity size={12} className={alert.type === 'success' ? "text-emerald-600" : "text-blue-600"}/>}
                  <h4 className={`text-xs font-bold ${
                    alert.type === 'critical' ? 'text-red-800' :
                    alert.type === 'warning' ? 'text-amber-800' :
                    alert.type === 'success' ? 'text-emerald-800' : 'text-blue-800'
                  }`}>{alert.title}</h4>
                </div>
                <p className={`text-[10px] leading-snug mb-1.5 ${
                    alert.type === 'critical' ? 'text-red-600/80' :
                    alert.type === 'warning' ? 'text-amber-700/80' :
                    alert.type === 'success' ? 'text-emerald-700/80' : 'text-blue-700/80'
                  }`}>{alert.desc}</p>
                <span className={`text-[9px] font-semibold ${
                    alert.type === 'critical' ? 'text-red-500' :
                    alert.type === 'warning' ? 'text-amber-600' :
                    alert.type === 'success' ? 'text-emerald-600' : 'text-blue-500'
                  }`}>{alert.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Live API Firehose ── */}
      <div className="bg-[#1e1e1e] rounded-lg border border-[#333] shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-[#444]">
          <div className="flex items-center gap-3">
            <Activity size={14} className="text-slate-300" />
            <span className="text-xs font-bold text-white tracking-wide">Live API Firehose</span>
            <div className="flex gap-1.5 ml-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            </div>
          </div>
          <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-white transition-colors">
            Pause Stream
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[11px]">
            <thead className="text-[#888] bg-[#252525]">
              <tr>
                <th className="px-4 py-2 font-normal w-40">TIMESTAMP</th>
                <th className="px-4 py-2 font-normal w-24">METHOD</th>
                <th className="px-4 py-2 font-normal">ENDPOINT</th>
                <th className="px-4 py-2 font-normal w-20">STATUS</th>
                <th className="px-4 py-2 font-normal w-24">LATENCY</th>
                <th className="px-4 py-2 font-normal w-32">IP/USER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333]">
              {firehoseData.map((log, i) => (
                <tr key={i} className="hover:bg-[#2a2a2a] transition-colors group">
                  <td className="px-4 py-2 text-[#aaa]">{log.time}</td>
                  <td className={`px-4 py-2 font-bold ${
                    log.method === 'GET' ? 'text-[#10b981]' : 
                    log.method === 'POST' ? 'text-[#f59e0b]' : 'text-[#8b5cf6]'
                  }`}>{log.method}</td>
                  <td className="px-4 py-2 text-[#ddd] group-hover:text-white">{log.endpoint}</td>
                  <td className="px-4 py-2">
                    <span className={`px-1.5 py-0.5 rounded bg-opacity-20 ${
                      log.status < 300 ? 'text-[#10b981] bg-[#10b981]' : 
                      log.status < 500 ? 'text-[#f59e0b] bg-[#f59e0b]' : 'text-[#ef4444] bg-[#ef4444]'
                    }`}>{log.status}</span>
                  </td>
                  <td className="px-4 py-2 text-[#aaa]">{log.latency}</td>
                  <td className="px-4 py-2 text-[#888]">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* ── User Overview Stats ── */}
        <div className="lg:col-span-3 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm flex flex-col justify-center">
            <span className="text-xs font-semibold text-slate-500 mb-1">Total Users</span>
            <span className="text-xl font-bold text-slate-800">{data.totalUsers?.toLocaleString()}</span>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm flex flex-col justify-center">
            <span className="text-xs font-semibold text-slate-500 mb-1">New Today</span>
            <span className="text-xl font-bold text-emerald-600">+{data.newToday}</span>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm flex flex-col justify-center">
            <span className="text-xs font-semibold text-slate-500 mb-1">Active Agents</span>
            <span className="text-xl font-bold text-slate-800">{data.activeAgents}/{data.totalAdminUsers}</span>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm flex flex-col justify-center">
            <span className="text-xs font-semibold text-slate-500 mb-1">Banned</span>
            <span className="text-xl font-bold text-red-600">{data.bannedUsers}</span>
          </div>
        </div>

        {/* ── Recent Admin Activity ── */}
        <div className="bg-white rounded-lg border border-slate-200 p-0 lg:col-span-9 shadow-sm flex flex-col">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/50 rounded-t-lg">
            <h3 className="text-sm font-bold text-slate-800">Recent Admin Activity</h3>
            <button className="text-xs font-bold text-emerald-700 hover:text-emerald-800 uppercase tracking-wide">View All</button>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white border-b border-slate-100 text-slate-500 font-semibold">
                <tr>
                  <th className="px-5 py-3 w-1/4">Admin</th>
                  <th className="px-5 py-3 w-1/4">Action</th>
                  <th className="px-5 py-3 w-1/4">Target</th>
                  <th className="px-5 py-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.adminActivity.map((act, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3 text-slate-700 font-medium">{act.admin}</td>
                    <td className="px-5 py-3 text-slate-600">{act.action}</td>
                    <td className="px-5 py-3 font-mono text-[11px] text-slate-500">{act.target}</td>
                    <td className="px-5 py-3 text-right text-xs text-slate-400">
                      {new Date(act.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};

export default TechDashboard;
