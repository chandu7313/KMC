import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  Users, IndianRupee, ShoppingCart, Headphones,
  FlaskConical, Sprout, TrendingUp, TrendingDown,
  Minus, AlertTriangle, Clock, MoreVertical
} from 'lucide-react';

// ─── Mock data for fields not yet in the API ───
const MOCK_REVENUE_CHART = [
  { month: 'Jan', orders: 12, consultations: 8 },
  { month: 'Feb', orders: 19, consultations: 12 },
  { month: 'Mar', orders: 15, consultations: 18 },
  { month: 'Apr', orders: 25, consultations: 22 },
  { month: 'May', orders: 32, consultations: 28 },
  { month: 'Jun', orders: 38, consultations: 25 },
  { month: 'Jul', orders: 45, consultations: 35 },
];

const MOCK_PLATFORM_ACTIVITY = [
  { name: 'Market Browsing', value: 45, color: '#1A5319' },
  { name: 'Support Chat', value: 30, color: '#F59E0B' },
  { name: 'Advisory Docs', value: 25, color: '#6B7280' },
];

const MOCK_ALERTS = [
  {
    id: 1,
    title: '#TK-8922: Payment Failure',
    description: 'Multiple farmers reporting UPI failures in checkout flow.',
    severity: 'CRITICAL',
    time: '15 mins ago',
  },
  {
    id: 2,
    title: 'Order ORD-5541 Delayed',
    description: 'Fertilizer delivery to Hubli hub is past SLA.',
    severity: 'WARNING',
    time: '2 hrs ago',
  },
  {
    id: 3,
    title: 'SLA Breach: Expert Queue',
    description: 'Wait times exceeding 4 hours for Agronomy support.',
    severity: 'CRITICAL',
    time: '30 mins ago',
  },
];

const Dashboard = () => {
  const { backendUrl, userData } = useContext(AppContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const userName = userData?.name?.split(' ')[0] || 'Admin';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        axios.defaults.withCredentials = true;
        const { data } = await axios.get(backendUrl + "/api/admin/dashboard-stats");
        if (data.success) {
          setData(data);
        }
      } catch (error) {
        // Use mock data if API fails (for AdminUser roles without admin API access)
        console.warn("Dashboard stats API unavailable, using defaults");
        setData({
          stats: {
            totalFarmers: 0,
            revenue: 0,
            activePackages: 0,
            pendingApprovals: 0,
            totalDistricts: 0,
            monthlyRegistrations: [],
            districtData: [],
            cropData: [],
          },
          recentUsers: [],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [backendUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#1A5319]/20 border-t-[#1A5319] rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};

  // Build stat cards from real + mock data
  const statCards = [
    {
      label: 'Total Farmers',
      value: (stats.totalFarmers || 0).toLocaleString(),
      icon: <Users size={20} />,
      trend: 'up',
      trendText: '12% vs last month',
      bgColor: 'bg-white',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
    },
    {
      label: 'Total Revenue',
      value: `₹${((stats.revenue || 0) / 100000).toFixed(2)}L`,
      icon: <IndianRupee size={20} />,
      trend: 'up',
      trendText: '8% vs last month',
      bgColor: 'bg-white',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-700',
    },
    {
      label: 'Active Orders',
      value: (stats.activePackages || 0).toLocaleString(),
      icon: <ShoppingCart size={20} />,
      trend: 'flat',
      trendText: 'Steady',
      bgColor: 'bg-white',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
    },
    {
      label: 'Open Tickets',
      value: '38',
      icon: <Headphones size={20} />,
      trend: 'up',
      trendText: '5 Critical',
      trendColor: 'text-red-600',
      bgColor: 'bg-white',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
    },
    {
      label: 'Disease Scans',
      value: '247',
      icon: <FlaskConical size={20} />,
      trend: 'up',
      trendText: '24% vs last week',
      bgColor: 'bg-white',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
    },
    {
      label: 'Soil Tests',
      value: '89',
      icon: <Sprout size={20} />,
      trend: 'up',
      trendText: 'New requests',
      bgColor: 'bg-white',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
    },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Portal</h1>
        <p className="text-slate-500 text-sm font-medium mt-0.5">{greeting}, {userName}</p>
      </div>

      {/* ── Stat Cards Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider leading-tight">{card.label}</p>
              <div className={`p-1.5 rounded-lg ${card.iconBg} ${card.iconColor}`}>
                {card.icon}
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{card.value}</p>
            <div className="flex items-center gap-1 mt-1.5">
              {card.trend === 'up' && <TrendingUp size={12} className={card.trendColor || 'text-green-600'} />}
              {card.trend === 'down' && <TrendingDown size={12} className="text-red-600" />}
              {card.trend === 'flat' && <Minus size={12} className="text-slate-400" />}
              <span className={`text-[10px] font-semibold ${card.trendColor || (card.trend === 'up' ? 'text-green-600' : card.trend === 'down' ? 'text-red-600' : 'text-slate-400')}`}>
                {card.trendText}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Three Panel Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue Overview — Line Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-slate-800">Revenue Overview</h3>
            <button className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors">
              <MoreVertical size={16} />
            </button>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_REVENUE_CHART}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                    fontSize: '12px',
                  }}
                />
                <Line type="monotone" dataKey="orders" stroke="#1A5319" strokeWidth={2.5} dot={false} name="Orders" />
                <Line type="monotone" dataKey="consultations" stroke="#A3A830" strokeWidth={2.5} dot={false} name="Consultations" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-[#1A5319] rounded-full"></span>
              <span className="text-[10px] text-slate-500 font-medium">Orders</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-[#A3A830] rounded-full"></span>
              <span className="text-[10px] text-slate-500 font-medium">Consultations</span>
            </div>
          </div>
        </div>

        {/* Platform Activity — Donut Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-slate-800">Platform Activity</h3>
          </div>
          <div className="h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_PLATFORM_ACTIVITY}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {MOCK_PLATFORM_ACTIVITY.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold text-[#1A5319]">1.2k</span>
              <span className="text-[10px] text-slate-400 font-semibold">Daily Active</span>
            </div>
          </div>
          {/* Legend */}
          <div className="space-y-2 mt-3">
            {MOCK_PLATFORM_ACTIVITY.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-xs text-slate-600 font-medium">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-700">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Needs Attention — Alerts Panel */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-500" />
              <h3 className="text-sm font-extrabold text-slate-800">Needs Attention</h3>
            </div>
            <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
              {MOCK_ALERTS.length} Alerts
            </span>
          </div>
          <div className="space-y-3">
            {MOCK_ALERTS.map((alert) => (
              <div key={alert.id} className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-xs font-bold text-slate-800 leading-tight">{alert.title}</p>
                  <span className={`text-[9px] font-extrabold tracking-wider flex-shrink-0 ${
                    alert.severity === 'CRITICAL' ? 'text-red-600' : 'text-amber-600'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug mb-1.5">{alert.description}</p>
                <div className="flex items-center gap-1">
                  <Clock size={10} className="text-slate-300" />
                  <span className="text-[10px] text-slate-400 font-medium">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full text-center text-xs font-bold text-[#1A5319] hover:text-[#2d7a2a] mt-3 py-1.5 transition-colors">
            View All Alerts
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
