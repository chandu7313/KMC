import React from 'react';
import { 
  Users, 
  Wallet, 
  Truck, 
  Ticket, 
  ScanLine, 
  FlaskConical,
  TrendingUp,
  Minus,
  AlertCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const revenueData = [
  { name: 'Jan', orders: 4000, consultations: 2400 },
  { name: 'Feb', orders: 3000, consultations: 1398 },
  { name: 'Mar', orders: 2000, consultations: 9800 },
  { name: 'Apr', orders: 2780, consultations: 3908 },
  { name: 'May', orders: 1890, consultations: 4800 },
  { name: 'Jun', orders: 2390, consultations: 3800 },
  { name: 'Jul', orders: 3490, consultations: 4300 },
];

const activityData = [
  { name: 'Market Browsing', value: 45, color: '#16a34a' },
  { name: 'Support Chat', value: 30, color: '#854d0e' },
  { name: 'Advisory Docs', value: 25, color: '#1A5319' },
];

const alerts = [
  { id: '#TK-8922', title: 'Payment Failure', desc: 'Multiple farmers reporting UPI failures in che...', time: '15 mins ago', type: 'CRITICAL' },
  { id: 'Order ORD-5541', title: 'Delayed', desc: 'Fertilizer delivery to Hubli hub is past SLA.', time: '2 hrs ago', type: 'WARNING' },
  { id: 'SLA Breach', title: 'Expert Queue', desc: 'Wait times exceeding 4 hours for Agronomy s...', time: '30 mins ago', type: 'CRITICAL' },
];

const StatCard = ({ title, value, icon: Icon, trend, trendValue, type }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
    <div className="flex justify-between items-start mb-2">
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${
        type === 'warning' ? 'bg-orange-50 text-orange-600' : 
        type === 'danger' ? 'bg-red-50 text-red-600' : 
        'bg-green-50 text-green-600'
      }`}>
        <Icon size={20} />
      </div>
    </div>
    <div className="flex items-center gap-1.5 mt-2">
      {trend === 'up' && <TrendingUp size={14} className="text-green-500" />}
      {trend === 'down' && <TrendingUp size={14} className="text-red-500 transform rotate-180" />}
      {trend === 'steady' && <Minus size={14} className="text-slate-400" />}
      
      <span className={`text-xs font-semibold ${
        trend === 'up' && type !== 'danger' ? 'text-green-600' :
        trend === 'up' && type === 'danger' ? 'text-red-600' :
        trend === 'down' ? 'text-red-600' : 'text-slate-500'
      }`}>
        {trendValue}
      </span>
    </div>
  </div>
);

const AdminDashboardPage = () => {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard 
          title="TOTAL FARMERS" 
          value="2,847" 
          icon={Users} 
          trend="up" 
          trendValue="12% vs last month" 
        />
        <StatCard 
          title="TOTAL REVENUE" 
          value="₹18.24L" 
          icon={Wallet} 
          trend="up" 
          trendValue="8% vs last month" 
        />
        <StatCard 
          title="ACTIVE ORDERS" 
          value="342" 
          icon={Truck} 
          trend="steady" 
          trendValue="Steady" 
          type="warning"
        />
        <StatCard 
          title="OPEN TICKETS" 
          value="38" 
          icon={Ticket} 
          trend="up" 
          trendValue="5 Critical" 
          type="danger"
        />
        <StatCard 
          title="DISEASE SCANS" 
          value="247" 
          icon={ScanLine} 
          trend="up" 
          trendValue="24% vs last week" 
        />
        <StatCard 
          title="SOIL TESTS" 
          value="89" 
          icon={FlaskConical} 
          trend="up" 
          trendValue="New requests" 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Overview */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-800">Revenue Overview</h3>
            <button className="text-slate-400 hover:text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </button>
          </div>
          <div className="flex-1 min-h-[300px] w-full bg-slate-50/50 rounded-lg border border-slate-100 p-4 relative">
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="orders" stroke="#71a171" strokeWidth={4} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="consultations" stroke="#a38c6b" strokeWidth={4} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
              <span className="text-sm font-medium text-slate-500">Line Chart Visualization: Orders vs Consultations</span>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#71a171]"></div>
                <span className="text-xs font-semibold text-slate-600">Orders</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#a38c6b]"></div>
                <span className="text-xs font-semibold text-slate-600">Consultations</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Platform Activity */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[350px]">
            <h3 className="text-sm font-bold text-slate-800 mb-2">Platform Activity</h3>
            <div className="flex-1 flex flex-col items-center justify-center relative">
               <div className="w-40 h-40 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                    <PieChart>
                      <Pie
                        data={activityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {activityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-bold text-green-700">1.2k</span>
                    <span className="text-[10px] font-bold text-slate-500">Daily Active</span>
                  </div>
               </div>
            </div>
            <div className="space-y-2 mt-4">
              {activityData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs font-semibold text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Needs Attention */}
          <div className="bg-white p-0 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle size={18} />
                <h3 className="text-sm font-bold text-slate-800">Needs Attention</h3>
              </div>
              <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">5 Alerts</span>
            </div>
            
            <div className="flex flex-col">
              {alerts.map((alert, index) => (
                <div key={index} className={`p-4 border-b border-slate-100 last:border-0 relative ${alert.type === 'CRITICAL' ? 'bg-red-50/30' : ''}`}>
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${alert.type === 'CRITICAL' ? 'bg-red-500' : 'bg-orange-400'}`}></div>
                  <div className="flex justify-between items-start mb-1 pl-2">
                    <h4 className="text-xs font-bold text-slate-800">{alert.id}: {alert.title}</h4>
                    <span className={`text-[9px] font-bold tracking-wider ${alert.type === 'CRITICAL' ? 'text-red-600' : 'text-orange-600'}`}>
                      {alert.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2 pl-2 leading-relaxed">{alert.desc}</p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 pl-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span>{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-slate-200 text-center">
              <button className="text-xs font-bold text-green-700 hover:text-green-800 transition-colors">
                View All Alerts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
