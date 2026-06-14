import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import {
  Ticket, AlertCircle, Clock, CheckCircle2, Timer, Star,
  TrendingUp, ChevronRight, AlertTriangle, Activity,
  MessageSquare, UserPlus, ArrowUpRight, Lock, CalendarDays
} from 'lucide-react';
import { useSupportDashboard } from '../hooks/useSupportDashboard';
import { useRealtimeSupport } from '../hooks/useRealtimeSupport';

const PERIOD_OPTIONS = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
];

const ACTIVITY_ICONS = {
  resolved: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  replied: { icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  created: { icon: Ticket, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  escalated: { icon: ArrowUpRight, color: 'text-red-400', bg: 'bg-red-500/10' },
  assigned: { icon: UserPlus, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  closed: { icon: Lock, color: 'text-slate-400', bg: 'bg-slate-500/10' },
  sla_breached: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
  auto_escalated: { icon: ArrowUpRight, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  status_changed: { icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  note_added: { icon: MessageSquare, color: 'text-slate-400', bg: 'bg-slate-500/10' },
};

const timeAgo = (date) => {
  if (!date) return '';
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const formatMinutesLeft = (mins) => {
  if (mins < 60) return `${mins}m left`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m left` : `${h}h left`;
};

const getSLABarColor = (mins) => {
  if (mins < 30) return 'bg-red-500';
  if (mins < 60) return 'bg-orange-500';
  if (mins < 120) return 'bg-amber-500';
  return 'bg-emerald-500';
};

const getSLABarPercent = (mins) => {
  return Math.min(100, Math.max(5, (mins / 120) * 100));
};

// Skeleton loader component
const SkeletonCard = () => (
  <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50 animate-pulse">
    <div className="h-3 bg-slate-700 rounded w-20 mb-3" />
    <div className="h-8 bg-slate-700 rounded w-16 mb-2" />
    <div className="h-2 bg-slate-700 rounded w-14" />
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
      <p className="text-white text-sm font-semibold mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

const SupportDashboardPage = () => {
  const navigate = useNavigate();
  const {
    stats, ticketVolume, categoryBreakdown,
    criticalTickets, slaBreaching, liveActivity,
    isLoading, period, setPeriod
  } = useSupportDashboard();

  // Activate realtime subscriptions
  useRealtimeSupport();

  const statCards = useMemo(() => [
    {
      label: 'TOTAL TICKETS', value: stats.totalTickets || 0,
      sub: `↑${stats.todayNewCount || 0} today`,
      icon: Ticket, color: 'from-emerald-500 to-emerald-600',
      border: 'border-emerald-500/30',
      onClick: () => navigate('/admin/support/tickets'),
    },
    {
      label: 'OPEN TICKETS', value: stats.openTickets || 0,
      icon: AlertCircle, color: 'from-red-500 to-rose-600',
      border: (stats.openTickets || 0) > 50 ? 'border-red-500/50' : 'border-red-500/20',
      onClick: () => navigate('/admin/support/tickets?status=open'),
    },
    {
      label: 'IN PROGRESS', value: stats.inProgress || 0,
      icon: Clock, color: 'from-amber-500 to-orange-500',
      border: 'border-amber-500/20',
      onClick: () => navigate('/admin/support/tickets?status=in_progress'),
    },
    {
      label: 'RESOLVED TODAY', value: stats.resolvedToday || 0,
      icon: CheckCircle2, color: 'from-green-500 to-emerald-500',
      border: 'border-green-500/20',
      onClick: () => navigate('/admin/support/tickets?status=resolved'),
    },
    {
      label: 'AVG RESPONSE', value: `${stats.avgResponseHours || 0}`,
      unit: 'h',
      icon: Timer, color: 'from-blue-500 to-indigo-500',
      border: 'border-blue-500/20',
      onClick: () => navigate('/admin/support/reports'),
    },
    {
      label: 'FARMER CSAT', value: `${stats.csatScore || 0}`,
      unit: '/5',
      icon: Star, color: 'from-yellow-500 to-amber-500',
      border: 'border-yellow-500/20',
      onClick: () => navigate('/admin/support/reports'),
    },
  ], [stats, navigate]);

  const totalCategoryTickets = useMemo(() => {
    return categoryBreakdown.reduce((s, c) => s + (c.value || 0), 0);
  }, [categoryBreakdown]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-7 bg-slate-700 rounded w-56 mb-2 animate-pulse" />
            <div className="h-4 bg-slate-700/50 rounded w-80 animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Support Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            Overview of support operations and ticket statuses
          </p>
        </div>
        <div className="relative">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="appearance-none bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-4 py-2.5 pr-10 cursor-pointer hover:border-emerald-500/50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            {PERIOD_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <CalendarDays size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, i) => (
          <button
            key={i}
            onClick={card.onClick}
            className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border ${card.border} hover:border-emerald-500/40 transition-all duration-200 text-left group hover:scale-[1.02] active:scale-[0.98]`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {card.label}
              </span>
              <div className={`p-1.5 rounded-lg bg-gradient-to-br ${card.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                <card.icon size={14} className="text-white" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">{card.value}</span>
              {card.unit && <span className="text-sm text-slate-400 font-medium">{card.unit}</span>}
            </div>
            {card.sub && (
              <span className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
                <TrendingUp size={10} />{card.sub}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Volume Chart */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Ticket Volume</h3>
            <span className="text-xs text-slate-400">Last 7 Days</span>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ticketVolume} barGap={2} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: '#475569' }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: '#475569' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 12 }}
                  formatter={(value) => <span className="text-slate-300">{value}</span>}
                />
                <Bar dataKey="open" name="Open" fill="#ef4444" radius={[2, 2, 0, 0]} />
                <Bar dataKey="inProgress" name="In Progress" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#22c55e" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Donut */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Tickets by Category</h3>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative h-[210px] w-[210px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%" cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color} cursor="pointer" />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} (${Math.round((value / totalCategoryTickets) * 100)}%)`, name]}
                    contentStyle={{
                      background: '#1e293b', border: '1px solid #334155',
                      borderRadius: '8px', color: '#fff', fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-white">{totalCategoryTickets}</span>
                <span className="text-[10px] text-slate-400">Total</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-2">
              {categoryBreakdown.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => navigate(`/admin/support/tickets?category=${cat.name.toLowerCase().replace(/\s+/g, '_')}`)}
                  className="flex items-center gap-2 text-left w-full hover:bg-slate-700/30 rounded-md px-2 py-1 transition-colors"
                >
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: cat.color }} />
                  <span className="text-xs text-slate-300 flex-1 truncate">{cat.name}</span>
                  <span className="text-[11px] text-slate-400 font-medium">{cat.percentage || 0}%</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Critical & High Priority */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-400" />
              <h3 className="text-white font-semibold text-sm">Critical & High Priority</h3>
            </div>
            <span className="bg-red-500/20 text-red-400 text-xs font-bold rounded-full px-2 py-0.5">
              {criticalTickets.length}
            </span>
          </div>
          <div className="divide-y divide-slate-700/30 max-h-[300px] overflow-y-auto">
            {criticalTickets.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">No critical tickets</div>
            ) : (
              criticalTickets.map((ticket, i) => (
                <button
                  key={i}
                  onClick={() => navigate(`/admin/support/tickets/${ticket.id}`)}
                  className="w-full p-4 text-left hover:bg-slate-700/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-emerald-400 text-xs font-bold">
                      #{ticket.ticketRef || ticket.ticket_ref}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {timeAgo(ticket.createdAt || ticket.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 truncate">
                    {ticket.farmerName || ticket.farmer_name} — {ticket.subject}
                  </p>
                  <span className={`inline-block mt-1.5 text-[10px] font-bold rounded px-1.5 py-0.5 ${
                    ticket.priority === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {(ticket.category || '').replace(/_/g, ' ')}
                  </span>
                </button>
              ))
            )}
          </div>
          {criticalTickets.length > 0 && (
            <button
              onClick={() => navigate('/admin/support/tickets?priority=critical,high')}
              className="w-full px-5 py-3 text-xs text-emerald-400 font-semibold border-t border-slate-700/50 hover:bg-slate-700/20 transition-colors flex items-center justify-center gap-1"
            >
              View All <ChevronRight size={12} />
            </button>
          )}
        </div>

        {/* SLA Breaching Soon */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <Timer size={16} className="text-amber-400" />
              <h3 className="text-white font-semibold text-sm">SLA Breaching Soon</h3>
            </div>
          </div>
          <div className="divide-y divide-slate-700/30 max-h-[300px] overflow-y-auto">
            {slaBreaching.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">No tickets near SLA breach</div>
            ) : (
              slaBreaching.map((ticket, i) => (
                <button
                  key={i}
                  onClick={() => navigate(`/admin/support/tickets/${ticket.id}`)}
                  className="w-full p-4 text-left hover:bg-slate-700/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-300 truncate flex-1">
                      <span className="text-emerald-400 font-bold">#{ticket.ticketRef || ticket.ticket_ref}</span>
                      {' — '}{ticket.subject}
                    </span>
                    <span className={`text-[11px] font-bold ml-2 shrink-0 ${
                      ticket.minutesLeft < 30 ? 'text-red-400' : ticket.minutesLeft < 60 ? 'text-orange-400' : 'text-amber-400'
                    }`}>
                      {formatMinutesLeft(ticket.minutesLeft)}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${getSLABarColor(ticket.minutesLeft)} ${
                        ticket.minutesLeft < 30 ? 'animate-pulse' : ''
                      }`}
                      style={{ width: `${getSLABarPercent(ticket.minutesLeft)}%` }}
                    />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Live Activity */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-emerald-400" />
              <h3 className="text-white font-semibold text-sm">Live Activity</h3>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-medium">Live</span>
            </div>
          </div>
          <div className="divide-y divide-slate-700/30 max-h-[300px] overflow-y-auto">
            {liveActivity.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">No recent activity</div>
            ) : (
              liveActivity.slice(0, 10).map((act, i) => {
                const actConfig = ACTIVITY_ICONS[act.action] || ACTIVITY_ICONS.status_changed;
                const ActIcon = actConfig.icon;
                return (
                  <button
                    key={i}
                    onClick={() => act.ticketId && navigate(`/admin/support/tickets/${act.ticketId || act.ticket_id}`)}
                    className="w-full p-3.5 text-left hover:bg-slate-700/20 transition-colors flex items-start gap-3"
                  >
                    <div className={`p-1.5 rounded-lg ${actConfig.bg} shrink-0 mt-0.5`}>
                      <ActIcon size={14} className={actConfig.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-300 leading-relaxed">
                        <span className="font-semibold text-slate-200">{act.agentName || act.agent_name || 'System'}</span>
                        {' '}{act.description || act.action}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {timeAgo(act.createdAt || act.created_at)}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportDashboardPage;
