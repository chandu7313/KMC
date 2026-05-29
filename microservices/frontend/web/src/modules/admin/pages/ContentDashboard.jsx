import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '@/app/store/globalStore';
import { 
  FileText, Languages, Eye, ThumbsUp,
  Edit3, Image, Video, Calendar
} from 'lucide-react';

const ContentDashboard = () => {
  const { t } = useTranslation();
  const { userData } = useGlobalStore();

  const stats = [
    { label: 'Published Blogs', value: '124', icon: <FileText className="text-pink-500" /> },
    { label: 'Pending Translation', value: '18', icon: <Languages className="text-amber-500" /> },
    { label: 'Monthly Views', value: '45.2k', icon: <Eye className="text-blue-500" />, trend: '+12%' },
    { label: 'Engagement Rate', value: '8.4%', icon: <ThumbsUp className="text-emerald-500" />, trend: '+1.2%' },
  ];

  const actions = [
    { title: 'Write Blog', icon: <Edit3 className="w-6 h-6 text-pink-700" />, bg: 'bg-pink-100', hover: 'hover:bg-pink-200' },
    { title: 'Manage Banners', icon: <Image className="w-6 h-6 text-purple-700" />, bg: 'bg-purple-100', hover: 'hover:bg-purple-200' },
    { title: 'Success Stories', icon: <Video className="w-6 h-6 text-blue-700" />, bg: 'bg-blue-100', hover: 'hover:bg-blue-200' },
    { title: 'Content Calendar', icon: <Calendar className="w-6 h-6 text-emerald-700" />, bg: 'bg-emerald-100', hover: 'hover:bg-emerald-200' },
  ];

  return (
    <div className="p-6 md:p-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Content & Publishing</h1>
        <p className="text-slate-500 font-medium mt-1">Manage articles, banners, and multilingual content.</p>
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

      <h2 className="text-xl font-bold text-slate-800 mb-4">Content Actions</h2>
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

export default ContentDashboard;
