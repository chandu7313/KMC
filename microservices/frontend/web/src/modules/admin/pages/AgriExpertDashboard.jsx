import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '@/app/store/globalStore';
import { 
  Leaf, Microscope, Sprout, ClipboardCheck,
  Stethoscope, CalendarCheck, FileText, FlaskConical
} from 'lucide-react';

const AgriExpertDashboard = () => {
  const { t } = useTranslation();
  const { userData } = useGlobalStore();

  const stats = [
    { label: 'Pending Consultations', value: '14', icon: <CalendarCheck className="text-emerald-600" /> },
    { label: 'Disease Reports', value: '28', icon: <Stethoscope className="text-rose-500" /> },
    { label: 'Soil Tests Reviewed', value: '156', icon: <FlaskConical className="text-amber-600" /> },
    { label: 'Active Plans', value: '42', icon: <Sprout className="text-lime-600" /> },
  ];

  const actions = [
    { title: 'Review Reports', icon: <FileText className="w-6 h-6 text-emerald-700" />, bg: 'bg-emerald-100', hover: 'hover:bg-emerald-200' },
    { title: 'Schedule Visit', icon: <CalendarCheck className="w-6 h-6 text-blue-700" />, bg: 'bg-blue-100', hover: 'hover:bg-blue-200' },
    { title: 'Analyze Disease', icon: <Microscope className="w-6 h-6 text-purple-700" />, bg: 'bg-purple-100', hover: 'hover:bg-purple-200' },
    { title: 'Approve Plan', icon: <ClipboardCheck className="w-6 h-6 text-rose-700" />, bg: 'bg-rose-100', hover: 'hover:bg-rose-200' },
  ];

  return (
    <div className="p-6 md:p-8 animate-in fade-in duration-500">
      <div className="mb-8 border-b border-emerald-100 pb-6">
        <h1 className="text-3xl font-black tracking-tight text-emerald-900">Agriculture Expert Portal</h1>
        <p className="text-emerald-600 font-medium mt-1">Hello, {userData?.name}. You have 14 farmers waiting for consultation.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-50 hover:border-emerald-200 transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-slate-50 rounded-2xl shadow-inner">
                {stat.icon}
              </div>
              <div>
                <p className="text-4xl font-black text-slate-800">{stat.value}</p>
              </div>
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-bold text-slate-800 mb-4">Expert Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, i) => (
          <button key={i} className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl ${action.bg} ${action.hover} transition-all active:scale-95 shadow-sm`}>
            {action.icon}
            <span className="font-bold text-sm text-slate-800">{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AgriExpertDashboard;
