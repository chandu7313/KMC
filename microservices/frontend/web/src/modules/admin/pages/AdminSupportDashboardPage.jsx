import React from 'react';
import { 
  Ticket, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Phone,
  TrendingUp,
  MessageSquare
} from 'lucide-react';

const stats = [
  { title: 'Open Tickets', value: '38', icon: Ticket, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+5 today' },
  { title: 'Active Farmers', value: '2,847', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '12% growth' },
  { title: 'Avg Response Time', value: '2.4h', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', trend: '-15 mins' },
  { title: 'Resolved Today', value: '24', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', trend: '+8 vs yesterday' },
];

const recentTickets = [
  { id: 'TK-8922', farmer: 'Rajesh Kumar', issue: 'Payment failure on UPI', priority: 'CRITICAL', time: '15 mins ago' },
  { id: 'TK-8921', farmer: 'Sunil Patil', issue: 'Fertilizer delivery delayed', priority: 'HIGH', time: '32 mins ago' },
  { id: 'TK-8920', farmer: 'Meena Devi', issue: 'Soil test report not visible', priority: 'MEDIUM', time: '1 hour ago' },
  { id: 'TK-8919', farmer: 'Arjun Singh', issue: 'Cannot book expert consultation', priority: 'HIGH', time: '2 hours ago' },
  { id: 'TK-8918', farmer: 'Lakshmi Bai', issue: 'Wrong product received', priority: 'MEDIUM', time: '3 hours ago' },
];

const priorityColors = {
  CRITICAL: 'bg-red-100 text-red-700',
  HIGH: 'bg-orange-100 text-orange-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  LOW: 'bg-green-100 text-green-700',
};

const AdminSupportDashboardPage = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Support Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Manage farmer support tickets and inquiries</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm">
          + New Ticket
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
              </div>
              <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                <stat.icon size={20} className={stat.color} />
              </div>
            </div>
            <p className="text-xs font-medium text-slate-400">{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tickets */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Recent Tickets</h3>
            <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700">View All</button>
          </div>
          <div className="divide-y divide-slate-100">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">#{ticket.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priorityColors[ticket.priority]}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">{ticket.time}</span>
                </div>
                <p className="text-sm font-semibold text-slate-700">{ticket.issue}</p>
                <p className="text-xs text-slate-500 mt-1">Reported by {ticket.farmer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { icon: Phone, label: 'Call Bookings', count: '12 pending', color: 'text-blue-600' },
                { icon: MessageSquare, label: 'Live Chats', count: '3 active', color: 'text-emerald-600' },
                { icon: AlertTriangle, label: 'Escalations', count: '5 critical', color: 'text-red-600' },
                { icon: TrendingUp, label: 'Reports', count: 'This week', color: 'text-purple-600' },
              ].map((action, idx) => (
                <button key={idx} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left">
                  <div className={`p-2 rounded-lg bg-slate-50 ${action.color}`}>
                    <action.icon size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-700">{action.label}</p>
                    <p className="text-xs text-slate-400">{action.count}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* SLA Status */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 mb-3">SLA Compliance</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-600">Critical (≤1h)</span>
                  <span className="font-bold text-green-600">92%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-600">High (≤4h)</span>
                  <span className="font-bold text-amber-600">78%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-600">Medium (≤24h)</span>
                  <span className="font-bold text-green-600">95%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSupportDashboardPage;
