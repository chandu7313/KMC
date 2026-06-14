import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTickets, useUpdateTicket, useAssignTicket, useResolveTicket, useCloseTicket } from '../hooks/useSupportTickets';
import { useSupportDashboard } from '../hooks/useSupportDashboard';
import {
  Search, Filter, Ticket, User, Clock, CheckCircle2,
  AlertCircle, ChevronLeft, ChevronRight, MoreVertical,
  X
} from 'lucide-react';

const PRIORITY_COLORS = {
  critical: 'bg-red-500/20 text-red-400',
  high: 'bg-orange-500/20 text-orange-400',
  medium: 'bg-amber-500/20 text-amber-400',
  low: 'bg-emerald-500/20 text-emerald-400',
};

const STATUS_COLORS = {
  open: 'text-red-400 bg-red-500/10',
  in_progress: 'text-amber-400 bg-amber-500/10',
  resolved: 'text-emerald-400 bg-emerald-500/10',
  closed: 'text-slate-400 bg-slate-500/10',
  waiting: 'text-blue-400 bg-blue-500/10',
};

const TicketListPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: '',
    search: '',
  });

  const { data: ticketsData, isLoading } = useTickets({ page, limit: 15, ...filters });
  const { stats } = useSupportDashboard();

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setFilters(prev => ({ ...prev, search: formData.get('search') }));
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tickets</h1>
          <p className="text-sm text-slate-400 mt-1">Manage and respond to support requests</p>
        </div>
        <button
          onClick={() => navigate('/admin/support/tickets/new')}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
        >
          + New Ticket
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between">
        <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px] max-w-md">
          <input
            name="search"
            defaultValue={filters.search}
            placeholder="Search by ID, name, or subject..."
            className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </form>
        <div className="flex items-center gap-3">
          <select
            value={filters.status}
            onChange={(e) => { setFilters(prev => ({ ...prev, status: e.target.value })); setPage(1); }}
            className="bg-slate-900/50 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 outline-none hover:border-slate-600 focus:border-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="waiting">Waiting</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={filters.priority}
            onChange={(e) => { setFilters(prev => ({ ...prev, priority: e.target.value })); setPage(1); }}
            className="bg-slate-900/50 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 outline-none hover:border-slate-600 focus:border-emerald-500"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          {Object.values(filters).some(v => v !== 'all' && v !== '') && (
            <button
              onClick={() => { setFilters({ status: 'all', priority: 'all', category: '', search: '' }); setPage(1); }}
              className="text-slate-400 hover:text-white p-2"
              title="Clear Filters"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700/50 text-slate-400 text-xs uppercase tracking-wider bg-slate-900/20">
                <th className="px-6 py-4 font-semibold">Ticket</th>
                <th className="px-6 py-4 font-semibold">Requester</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Priority</th>
                <th className="px-6 py-4 font-semibold">Assignee</th>
                <th className="px-6 py-4 font-semibold text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      Loading tickets...
                    </div>
                  </td>
                </tr>
              ) : ticketsData?.tickets?.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No tickets found matching your filters.
                  </td>
                </tr>
              ) : (
                ticketsData?.tickets?.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => navigate(`/admin/support/tickets/${ticket.id}`)}
                    className="hover:bg-slate-700/20 cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-emerald-400 font-bold text-sm">#{ticket.ticketRef || ticket.ticket_ref}</span>
                        <span className="text-slate-200 font-medium mt-0.5 group-hover:text-emerald-300 transition-colors">
                          {ticket.subject}
                        </span>
                        <span className="text-slate-500 text-xs mt-1">
                          {(ticket.category || '').replace(/_/g, ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center">
                          <User size={12} className="text-slate-400" />
                        </div>
                        <span className="text-sm text-slate-300">{ticket.farmerName || ticket.farmer_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[ticket.status]}`}>
                        {ticket.status === 'resolved' && <CheckCircle2 size={10} />}
                        {ticket.status === 'open' && <AlertCircle size={10} />}
                        {ticket.status === 'in_progress' && <Clock size={10} />}
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${PRIORITY_COLORS[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {ticket.assignedAgentName || ticket.assigned_agent_name ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-emerald-900 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                            {(ticket.assignedAgentName || ticket.assigned_agent_name).charAt(0)}
                          </div>
                          <span className="text-sm text-slate-300">{ticket.assignedAgentName || ticket.assigned_agent_name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm text-slate-400">
                        {new Date(ticket.createdAt || ticket.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {new Date(ticket.createdAt || ticket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && ticketsData?.total > 0 && (
          <div className="px-6 py-4 border-t border-slate-700/50 flex items-center justify-between bg-slate-900/20">
            <span className="text-sm text-slate-400">
              Showing {(page - 1) * 15 + 1} to {Math.min(page * 15, ticketsData.total)} of {ticketsData.total} tickets
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-400"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm text-slate-300 font-medium px-2">Page {page}</span>
              <button
                disabled={page * 15 >= ticketsData.total}
                onClick={() => setPage(p => p + 1)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-400"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketListPage;
