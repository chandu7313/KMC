import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Search, Filter, X, ChevronLeft, ChevronRight, Download } from "lucide-react";

const STATUS_STYLES = {
  open: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  in_progress: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  waiting: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  closed: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  spam: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const PRIORITY_STYLES = {
  critical: 'border-l-red-500 bg-red-500/5',
  high: 'border-l-orange-500',
  medium: 'border-l-amber-500',
  low: 'border-l-slate-600',
};

const PRIORITY_BADGE = {
  critical: 'bg-red-500/10 text-red-400',
  high: 'bg-orange-500/10 text-orange-400',
  medium: 'bg-amber-500/10 text-amber-400',
  low: 'bg-slate-500/10 text-slate-400',
};

const CATEGORIES = ['Order Issues','App Problems','Payment Issues','Expert Booking','Disease Detection Help','Soil Testing Help','General Query'];

const TicketList = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ status: '', priority: '', category: '', search: '', assignedTo: '' });
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState([]);
  const [agents, setAgents] = useState([]);
  const [newTicket, setNewTicket] = useState({ farmerId: '', category: 'General Query', subject: '', priority: 'medium', message: '' });

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 25 });
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
      const { data } = await axios.get(`${backendUrl}/api/support/tickets?${params}`);
      if (data.success) {
        setTickets(data.tickets); setTotal(data.total); setTotalPages(data.totalPages);
      }
    } catch {
      // Mock data
      setTickets([
        { id: '1', ticketRef: 'TK-247', subject: 'Product not delivered after 7 days', category: 'Order Issues', priority: 'high', status: 'in_progress', createdAt: '2026-04-28T10:30:00Z', Farmer: { name: 'Rajesh Kumar', phone: '+919876543210' }, AssignedAgent: { name: 'Agent Priya' } },
        { id: '2', ticketRef: 'TK-246', subject: 'Payment failed but money deducted', category: 'Payment Issues', priority: 'critical', status: 'open', createdAt: '2026-04-28T09:15:00Z', Farmer: { name: 'Suresh Reddy', phone: '+919876543211' }, AssignedAgent: null },
        { id: '3', ticketRef: 'TK-245', subject: 'Cannot login to app', category: 'App Problems', priority: 'medium', status: 'waiting', createdAt: '2026-04-27T14:00:00Z', Farmer: { name: 'Venkat Rao', phone: '+919876543212' }, AssignedAgent: { name: 'Agent Ravi' } },
        { id: '4', ticketRef: 'TK-244', subject: 'Soil test report not showing', category: 'Soil Testing Help', priority: 'low', status: 'resolved', createdAt: '2026-04-27T11:30:00Z', Farmer: { name: 'Lakshmi Devi', phone: '+919876543213' }, AssignedAgent: { name: 'Agent Meera' } },
        { id: '5', ticketRef: 'TK-243', subject: 'Expert call was not received', category: 'Expert Booking', priority: 'high', status: 'open', createdAt: '2026-04-26T16:45:00Z', Farmer: { name: 'Ramesh Goud', phone: '+919876543214' }, AssignedAgent: null },
      ]);
      setTotal(247); setTotalPages(10);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchTickets(); }, [page, filters, backendUrl]);

  const handleCreate = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/support/tickets`, newTicket);
      if (data.success) { toast.success('Ticket created'); setShowCreate(false); fetchTickets(); }
    } catch (err) { toast.error(err.message); }
  };

  const clearFilters = () => setFilters({ status: '', priority: '', category: '', search: '', assignedTo: '' });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-white">All Tickets</h1>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400">{total}</span>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus size={16} /> Create Ticket
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={filters.search} onChange={e => setFilters(f => ({...f, search: e.target.value}))}
              placeholder="Search by ID, name, phone..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" />
          </div>
          {['open','in_progress','waiting','resolved','closed'].map(s => (
            <button key={s} onClick={() => setFilters(f => ({...f, status: f.status === s ? '' : s}))}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${filters.status === s ? STATUS_STYLES[s] + ' border' : 'border-slate-700/50 text-slate-400 hover:text-white'}`}>
              {s.replace('_', ' ')}
            </button>
          ))}
          <select value={filters.priority} onChange={e => setFilters(f => ({...f, priority: e.target.value}))}
            className="px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-xs text-slate-400 focus:outline-none">
            <option value="">All Priority</option>
            {['critical','high','medium','low'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filters.category} onChange={e => setFilters(f => ({...f, category: e.target.value}))}
            className="px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-xs text-slate-400 focus:outline-none">
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {Object.values(filters).some(Boolean) && (
            <button onClick={clearFilters} className="text-xs text-slate-500 hover:text-white flex items-center gap-1">
              <X size={12} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Ticket Table */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/50">
                  {['ID','Farmer','Category','Subject','Priority','Status','Assigned To','Created'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {tickets.map(ticket => (
                  <tr key={ticket.id} onClick={() => navigate(`/admin/support/tickets/${ticket.id}`)}
                    className={`cursor-pointer hover:bg-slate-800/30 transition-colors border-l-2 ${PRIORITY_STYLES[ticket.priority] || ''}`}>
                    <td className="px-4 py-3 text-sm font-mono text-emerald-400">{ticket.ticketRef}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-slate-300">{ticket.Farmer?.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">{ticket.Farmer?.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">{ticket.category}</td>
                    <td className="px-4 py-3 text-sm text-slate-300 max-w-[200px] truncate">{ticket.subject}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${PRIORITY_BADGE[ticket.priority]}`}>{ticket.priority}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[ticket.status]}`}>{ticket.status?.replace('_',' ')}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">{ticket.AssignedAgent?.name || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800/50">
          <p className="text-xs text-slate-500">Showing {tickets.length} of {total} tickets</p>
          <div className="flex items-center gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p-1)}
              className="p-1.5 rounded-lg border border-slate-700/50 text-slate-400 hover:text-white disabled:opacity-30 transition-colors">
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i+1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${page === p ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>{p}</button>
            ))}
            <button disabled={page >= totalPages} onClick={() => setPage(p => p+1)}
              className="p-1.5 rounded-lg border border-slate-700/50 text-slate-400 hover:text-white disabled:opacity-30 transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Create New Ticket</h2>
            <input placeholder="Subject" value={newTicket.subject} onChange={e => setNewTicket(t => ({...t, subject: e.target.value}))}
              className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" />
            <div className="grid grid-cols-2 gap-3">
              <select value={newTicket.category} onChange={e => setNewTicket(t => ({...t, category: e.target.value}))}
                className="px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={newTicket.priority} onChange={e => setNewTicket(t => ({...t, priority: e.target.value}))}
                className="px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none">
                {['low','medium','high','critical'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <textarea rows={3} placeholder="Initial message..." value={newTicket.message} onChange={e => setNewTicket(t => ({...t, message: e.target.value}))}
              className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 resize-none" />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={handleCreate} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketList;
