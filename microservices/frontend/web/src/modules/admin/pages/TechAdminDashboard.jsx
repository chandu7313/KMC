import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '@/app/store/globalStore';
import { 
  Server, Activity, ShieldAlert, Cpu, 
  Terminal, RefreshCw, Database, FileCode 
} from 'lucide-react';

const TechAdminDashboard = () => {
  const { t } = useTranslation();
  const { userData } = useGlobalStore();

  const stats = [
    { label: 'System Uptime', value: '99.99%', icon: <Activity className="text-emerald-500" />, trend: '+0.01%' },
    { label: 'API Health', value: 'Healthy', icon: <Server className="text-blue-500" />, subtext: '45ms avg latency' },
    { label: 'Error Rate', value: '0.04%', icon: <ShieldAlert className="text-rose-500" />, trend: '-0.12%' },
    { label: 'Active Nodes', value: '12/12', icon: <Cpu className="text-amber-500" />, subtext: 'Load balanced' },
  ];

  const actions = [
    { title: 'View Logs', icon: <Terminal className="w-6 h-6 text-slate-700" />, bg: 'bg-slate-100', hover: 'hover:bg-slate-200' },
    { title: 'Restart Services', icon: <RefreshCw className="w-6 h-6 text-blue-700" />, bg: 'bg-blue-100', hover: 'hover:bg-blue-200' },
    { title: 'DB Migrations', icon: <Database className="w-6 h-6 text-purple-700" />, bg: 'bg-purple-100', hover: 'hover:bg-purple-200' },
    { title: 'Deploy Config', icon: <FileCode className="w-6 h-6 text-emerald-700" />, bg: 'bg-emerald-100', hover: 'hover:bg-emerald-200' },
  ];

  return (
    <div className="p-6 md:p-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Tech Admin Portal</h1>
        <p className="text-slate-500 font-medium mt-1">Welcome back, {userData?.name}. Systems are operating normally.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 rounded-2xl">
                {stat.icon}
              </div>
              {stat.trend && (
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {stat.trend}
                </span>
              )}
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">{stat.label}</p>
              {stat.subtext && <p className="text-xs font-medium text-slate-400 mt-2">{stat.subtext}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, i) => (
          <button key={i} className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl ${action.bg} ${action.hover} transition-all active:scale-95 border border-white/50 shadow-sm`}>
            {action.icon}
            <span className="font-bold text-sm text-slate-800">{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TechAdminDashboard;
