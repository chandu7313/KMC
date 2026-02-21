import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { Users, CheckCircle, Clock, Package, MapPin, IndianRupee } from 'lucide-react';

const Dashboard = () => {
  const { t } = useTranslation();
  const { backendUrl } = useContext(AppContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        axios.defaults.withCredentials = true;
        const { data } = await axios.get(backendUrl + "/api/admin/dashboard-stats");
        if (data.success) {
          setData(data);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [backendUrl]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">{t('loading_dashboard')}</div>;
  }
  
  const { stats, recentUsers } = data;
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-8">
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label={t('total_farmers')} value={stats.totalFarmers} icon={<Users size={24}/>} color="bg-green-50 text-green-700" />
        <MetricCard label={t('verified_farmers')} value={stats.verifiedFarmers} icon={<CheckCircle size={24}/>} color="bg-blue-50 text-blue-700" />
        <MetricCard label={t('pending_approvals')} value={stats.pendingApprovals} icon={<Clock size={24}/>} color="bg-yellow-50 text-yellow-700" />
        <MetricCard label={t('active_packages')} value={stats.activePackages} icon={<Package size={24}/>} color="bg-purple-50 text-purple-700" />
        <MetricCard label={t('total_districts')} value={stats.totalDistricts} icon={<MapPin size={24}/>} color="bg-indigo-50 text-indigo-700" />
        <MetricCard label={t('revenue')} value={`₹${stats.revenue.toLocaleString()}`} icon={<IndianRupee size={24}/>} color="bg-emerald-50 text-emerald-700" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Registration Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('registration_trend')}</h3>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={stats.monthlyRegistrations}>
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis dataKey="_id" />
                 <YAxis />
                 <Tooltip />
                 <Legend />
                 <Bar dataKey="count" fill="#10B981" name={t('registrations')} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* District Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('district_distribution')}</h3>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart layout="vertical" data={stats.districtData}>
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis type="number" />
                 <YAxis dataKey="_id" type="category" width={100}/>
                 <Tooltip />
                 <Legend />
                 <Bar dataKey="count" fill="#3B82F6" name={t('farmers')} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      
        {/* Crop Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
           <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('crop_distribution')}</h3>
           <div className="h-64 flex justify-center">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={stats.cropData}
                   cx="50%"
                   cy="50%"
                   labelLine={false}
                   label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                   outerRadius={80}
                   fill="#8884d8"
                   dataKey="count"
                   nameKey="_id"
                 >
                   {stats.cropData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
           </div>
        </div>

      </div>

    </div>
  );
};

const MetricCard = ({ label, value, icon, color }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
    <div>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg ${color} text-xl`}>
      {icon}
    </div>
  </div>
);

export default Dashboard;
