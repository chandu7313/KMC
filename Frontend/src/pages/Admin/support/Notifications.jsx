import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";
import { Send, Bell, Mail, Smartphone, Clock, Users, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from "lucide-react";

const Notifications = () => {
  const { backendUrl } = useContext(AppContext);
  const [tab, setTab] = useState('send');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [form, setForm] = useState({ title: '', message: '', channel: 'email', targetType: 'all', scheduledAt: '' });

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/support/notifications/history?page=${page}`);
      if (data.success) { setHistory(data.notifications); setTotalPages(data.totalPages); }
    } catch {
      setHistory([
        { id: 1, title: 'System Maintenance', message: 'App will be under maintenance...', channel: 'all', targetType: 'all', sentCount: 1200, status: 'sent', sentAt: '2026-05-01T10:00:00Z', Sender: { name: 'Admin' } },
        { id: 2, title: 'New Feature: Crop Doctor', message: 'Try our new AI disease detection...', channel: 'email', targetType: 'all', sentCount: 980, status: 'sent', sentAt: '2026-04-25T09:00:00Z', Sender: { name: 'Admin' } },
        { id: 3, title: 'Festival Offer', message: '20% off on all products...', channel: 'sms', targetType: 'state', sentCount: 500, status: 'sent', sentAt: '2026-04-15T08:00:00Z', Sender: { name: 'Agent Priya' } },
      ]);
      setTotalPages(2);
    } finally { setLoading(false); }
  };

  useEffect(() => { if (tab === 'history') fetchHistory(); }, [tab, page]);

  const handleSend = async () => {
    if (!form.title || !form.message) return toast.error('Title and message are required');
    try {
      const { data } = await axios.post(`${backendUrl}/api/support/notifications/send`, form);
      if (data.success) { toast.success('Notification sent'); setForm({ title: '', message: '', channel: 'email', targetType: 'all', scheduledAt: '' }); }
    } catch { toast.error('Failed to send'); }
  };

  const CHANNEL_ICONS = { email: Mail, sms: Smartphone, in_app: Bell, all: Send };
  const STATUS_COLORS = { sent: 'text-emerald-400 bg-emerald-500/10', failed: 'text-red-400 bg-red-500/10', pending: 'text-amber-400 bg-amber-500/10', scheduled: 'text-blue-400 bg-blue-500/10' };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Notifications</h1>
        <div className="flex bg-slate-900/50 border border-slate-800/50 rounded-lg p-0.5">
          {['send', 'history'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${tab === t ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>
              {t === 'send' ? '📤 Compose' : '📋 History'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'send' ? (
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 max-w-2xl space-y-4">
          <input placeholder="Notification title" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))}
            className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" />
          <textarea rows={4} placeholder="Message content..." value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))}
            className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 resize-none" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Channel</label>
              <select value={form.channel} onChange={e => setForm(f => ({...f, channel: e.target.value}))}
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none">
                <option value="email">📧 Email</option><option value="sms">📱 SMS</option><option value="in_app">🔔 In-App</option><option value="all">📡 All Channels</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Target Audience</label>
              <select value={form.targetType} onChange={e => setForm(f => ({...f, targetType: e.target.value}))}
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none">
                <option value="all">All Farmers</option><option value="state">By State</option><option value="district">By District</option>
                <option value="open_tickets">With Open Tickets</option><option value="pending_orders">With Pending Orders</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Schedule (optional)</label>
            <input type="datetime-local" value={form.scheduledAt} onChange={e => setForm(f => ({...f, scheduledAt: e.target.value}))}
              className="px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none" />
          </div>
          <button onClick={handleSend} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors">
            <Send size={16} /> {form.scheduledAt ? 'Schedule' : 'Send Now'}
          </button>
        </div>
      ) : (
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48"><div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="divide-y divide-slate-800/30">
              {history.map(n => {
                const Icon = CHANNEL_ICONS[n.channel] || Bell;
                return (
                  <div key={n.id} className="px-5 py-4 hover:bg-slate-800/20 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-400 shrink-0"><Icon size={16} /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-white">{n.title}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${STATUS_COLORS[n.status]}`}>{n.status}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">{n.message}</p>
                        <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
                          <span className="flex items-center gap-1"><Users size={10} />{n.sentCount} sent</span>
                          <span className="flex items-center gap-1"><Clock size={10} />{new Date(n.sentAt).toLocaleDateString('en-IN')}</span>
                          <span>by {n.Sender?.name || 'System'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800/50">
            <p className="text-xs text-slate-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button disabled={page<=1} onClick={() => setPage(p=>p-1)} className="p-1.5 rounded-lg border border-slate-700/50 text-slate-400 disabled:opacity-30"><ChevronLeft size={14} /></button>
              <button disabled={page>=totalPages} onClick={() => setPage(p=>p+1)} className="p-1.5 rounded-lg border border-slate-700/50 text-slate-400 disabled:opacity-30"><ChevronRight size={14} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
