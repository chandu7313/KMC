import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '@/app/store/globalStore';
import { 
  Tractor, Map, Users, Target, 
  Navigation, CalendarPlus, ClipboardList, AlertTriangle
} from 'lucide-react';

const FieldDashboard = () => {
  const { t } = useTranslation();
  const { userData } = useGlobalStore();

  const stats = [
    { label: 'Farmers Onboarded', value: '450', icon: <Users className="text-emerald-500" />, trend: '+12 this week' },
    { label: 'Completed Visits', value: '28', icon: <Target className="text-blue-500" /> },
    { label: 'Upcoming Visits', value: '14', icon: <CalendarPlus className="text-amber-500" /> },
    { label: 'Total Distance', value: '340 km', icon: <Navigation className="text-purple-500" /> },
  ];

  const actions = [
    { title: 'New Onboarding', icon: <Users className="w-6 h-6 text-emerald-700" />, bg: 'bg-emerald-100', hover: 'hover:bg-emerald-200' },
    { title: 'Plan Route', icon: <Map className="w-6 h-6 text-blue-700" />, bg: 'bg-blue-100', hover: 'hover:bg-blue-200' },
    { title: 'Submit Report', icon: <ClipboardList className="w-6 h-6 text-purple-700" />, bg: 'bg-purple-100', hover: 'hover:bg-purple-200' },
    { title: 'Report Issue', icon: <AlertTriangle className="w-6 h-6 text-rose-700" />, bg: 'bg-rose-100', hover: 'hover:bg-rose-200' },
  ];

  return (
    <div className="p-6 md:p-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Field Operations</h1>
        <p className="text-slate-500 font-medium mt-1">Manage farm visits, farmer onboarding, and field reporting.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
              <div className="p-3 bg-slate-50 rounded-2xl">{stat.icon}</div>
              {stat.trend && (
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                  {stat.trend}
                </span>
              )}
            </div>
            <p className="text-4xl font-black text-slate-900 mt-2">{stat.value}</p>
            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-4">Field Actions</h2>
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

export default FieldDashboard;
