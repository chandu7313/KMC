import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft, Phone, Mail, MapPin, Globe, Calendar, Package,
  Clock, AlertTriangle, Tag, Link2, Send, Paperclip, MessageSquare,
  FileText, CheckCircle2, Lock, AlertCircle, Trash2, Shield
} from "lucide-react";

const STATUS_STYLES = {
  open: 'bg-blue-500/10 text-blue-400', in_progress: 'bg-amber-500/10 text-amber-400',
  waiting: 'bg-purple-500/10 text-purple-400', resolved: 'bg-emerald-500/10 text-emerald-400',
  closed: 'bg-slate-500/10 text-slate-400', spam: 'bg-red-500/10 text-red-400',
};

const PRIORITY_BADGE = {
  critical: 'bg-red-500/10 text-red-400', high: 'bg-orange-500/10 text-orange-400',
  medium: 'bg-amber-500/10 text-amber-400', low: 'bg-slate-500/10 text-slate-400',
};

const TicketDetail = () => {
  const { ticketId } = useParams();
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sla, setSla] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [noteText, setNoteText] = useState('');
  const [activeTab, setActiveTab] = useState('reply');
  const [sending, setSending] = useState(false);

  const fetchTicket = async () => {
    try {
      const [ticketRes, msgRes] = await Promise.all([
        axios.get(`${backendUrl}/api/support/tickets/${ticketId}`),
        axios.get(`${backendUrl}/api/support/tickets/${ticketId}/messages`)
      ]);
      if (ticketRes.data.success) { setTicket(ticketRes.data.ticket); setSla(ticketRes.data.sla); }
      if (msgRes.data.success) setMessages(msgRes.data.messages);
    } catch {
      // Mock data
      setTicket({
        id: ticketId, ticketRef: 'TK-247', subject: 'Product not delivered after 7 days',
        category: 'Order Issues', subCategory: 'Delivery Delay', priority: 'high', status: 'in_progress',
        tags: ['delivery', 'order-892', 'urgent'], source: 'app',
        createdAt: '2026-04-28T10:30:00Z', slaBreached: false,
        Farmer: { id: 'f1', name: 'Rajesh Kumar', phone: '+91 9876543210', email: 'rajesh@gmail.com', district: 'Warangal', language: 'te', createdAt: '2026-01-15T00:00:00Z', crops: ['Cotton', 'Rice'] },
        AssignedAgent: { id: 'a1', name: 'Agent Priya', email: 'priya@kmc.com', phone: '+91 9123456789' },
      });
      setMessages([
        { id: 'm1', senderType: 'farmer', message: 'I ordered Mancozeb 75% WP on April 20 (Order #ORD-892) but still not received. Please help urgently as my crop is diseased.', createdAt: '2026-04-28T10:30:00Z', isInternalNote: false, attachments: [] },
        { id: 'm2', senderType: 'system', message: 'Ticket assigned to Agent Priya', createdAt: '2026-04-28T11:00:00Z', isInternalNote: false },
        { id: 'm3', senderType: 'agent', message: 'Dear Rajesh ji, I have checked your order. It is currently at Hyderabad hub. Expected delivery by tomorrow evening. I apologize for the delay.', createdAt: '2026-04-28T11:15:00Z', isInternalNote: false },
        { id: 'm4', senderType: 'farmer', message: 'OK thank you. Please make it fast.', createdAt: '2026-04-28T12:30:00Z', isInternalNote: false },
      ]);
      setSla({ firstResponseMins: 120, resolutionMins: 1440, escalateAfterMins: 480 });
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchTicket(); }, [ticketId]);

  const handleSendReply = async (updateStatus) => {
    if (!replyText.trim()) return;
    setSending(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/support/tickets/${ticketId}/messages`, {
        message: replyText, updateStatus
      });
      if (data.success) {
        setMessages(prev => [...prev, data.message]);
        setReplyText('');
        if (data.ticket) setTicket(data.ticket);
        toast.success('Reply sent');
      }
    } catch { toast.error('Failed to send'); }
    finally { setSending(false); }
  };

  const handleSaveNote = async () => {
    if (!noteText.trim()) return;
    try {
      const { data } = await axios.post(`${backendUrl}/api/support/tickets/${ticketId}/notes`, { message: noteText });
      if (data.success) { setMessages(prev => [...prev, data.note]); setNoteText(''); toast.success('Note saved'); }
    } catch { toast.error('Failed to save note'); }
  };

  const updateTicketField = async (field, value) => {
    try {
      const { data } = await axios.put(`${backendUrl}/api/support/tickets/${ticketId}`, { [field]: value });
      if (data.success) { setTicket(prev => ({ ...prev, [field]: value })); toast.success('Updated'); }
    } catch { toast.error('Update failed'); }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;
  }
  if (!ticket) return <div className="text-slate-400 text-center py-12">Ticket not found</div>;

  const farmer = ticket.Farmer || {};
  const agent = ticket.AssignedAgent || {};

  // SLA Timer calculation
  const createdTime = new Date(ticket.createdAt).getTime();
  const now = Date.now();
  const elapsedMins = Math.floor((now - createdTime) / 60000);
  const slaResolutionMins = sla?.resolutionMins || 1440;
  const slaRemainingMins = Math.max(0, slaResolutionMins - elapsedMins);
  const slaPercent = Math.min(100, Math.round((elapsedMins / slaResolutionMins) * 100));

  return (
    <div className="space-y-4">
      {/* Back + Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/admin/support/tickets')} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-lg font-bold text-white font-mono">{ticket.ticketRef}</h1>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[ticket.status]}`}>{ticket.status?.replace('_',' ')}</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${PRIORITY_BADGE[ticket.priority]}`}>{ticket.priority}</span>
          </div>
          <p className="text-sm text-slate-400 mt-0.5">{ticket.subject}</p>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT: Farmer Info */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4">
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-emerald-400 text-xl font-bold">
                {farmer.name?.charAt(0) || '?'}
              </div>
              <h3 className="text-sm font-semibold text-white mt-2">{farmer.name}</h3>
            </div>
            <div className="space-y-2.5">
              {[
                { icon: Phone, label: farmer.phone },
                { icon: Mail, label: farmer.email },
                { icon: MapPin, label: farmer.district },
                { icon: Globe, label: farmer.language === 'te' ? 'Telugu 🇮🇳' : farmer.language === 'hi' ? 'Hindi 🇮🇳' : 'English' },
                { icon: Calendar, label: `Joined ${new Date(farmer.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}` },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <item.icon size={13} className="text-slate-500 shrink-0" />
                  <span className="text-xs text-slate-400 truncate">{item.label || '—'}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Links</h4>
            <div className="space-y-1.5">
              {['View All Orders','View Soil Reports','View Disease Scans','View Call Bookings'].map(label => (
                <button key={label} className="w-full text-left text-xs text-emerald-400 hover:text-emerald-300 py-1 transition-colors">{label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER: Conversation */}
        <div className="lg:col-span-6 space-y-3">
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl flex flex-col" style={{ minHeight: '500px' }}>
            {/* Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[400px]">
              {messages.map(msg => {
                if (msg.senderType === 'system') {
                  return (
                    <div key={msg.id} className="text-center">
                      <span className="text-[10px] text-slate-500 italic bg-slate-800/30 px-3 py-1 rounded-full">
                        {msg.message} — {new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                }
                if (msg.isInternalNote) {
                  return (
                    <div key={msg.id} className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-3 mx-4">
                      <div className="flex items-center gap-1.5 mb-1">
                        <FileText size={11} className="text-amber-400" />
                        <span className="text-[10px] font-medium text-amber-400">Internal Note</span>
                        <span className="text-[10px] text-slate-500 ml-auto">{new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs text-amber-200/80">{msg.message}</p>
                    </div>
                  );
                }
                const isFarmer = msg.senderType === 'farmer';
                return (
                  <div key={msg.id} className={`flex ${isFarmer ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] rounded-xl p-3 ${isFarmer ? 'bg-slate-800/50 border border-slate-700/30' : 'bg-emerald-900/30 border border-emerald-800/30'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-semibold text-slate-300">
                          {isFarmer ? `👤 ${farmer.name}` : `👩 ${agent.name || 'Agent'}`}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">{msg.message}</p>
                      {msg.attachments?.length > 0 && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
                          <Paperclip size={11} /> {msg.attachments.length} attachment(s)
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Box */}
            <div className="border-t border-slate-800/50 p-4">
              <div className="flex gap-2 mb-3">
                <button onClick={() => setActiveTab('reply')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === 'reply' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-500 hover:text-white'}`}>
                  <MessageSquare size={12} /> Reply
                </button>
                <button onClick={() => setActiveTab('note')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === 'note' ? 'bg-amber-500/10 text-amber-400' : 'text-slate-500 hover:text-white'}`}>
                  <FileText size={12} /> Internal Note
                </button>
              </div>

              {activeTab === 'reply' ? (
                <div className="space-y-2">
                  <textarea rows={3} value={replyText} onChange={e => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 resize-none" />
                  <div className="flex items-center justify-between">
                    <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors">
                      <Paperclip size={12} /> Attach
                    </button>
                    <div className="flex gap-2">
                      <button onClick={() => handleSendReply(null)} disabled={sending || !replyText.trim()}
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50">
                        <Send size={12} /> Send
                      </button>
                      <button onClick={() => handleSendReply('resolved')} disabled={sending || !replyText.trim()}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors disabled:opacity-50">
                        <CheckCircle2 size={12} /> Send + Resolve
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <textarea rows={3} value={noteText} onChange={e => setNoteText(e.target.value)}
                    placeholder="Write an internal note (not visible to farmer)..."
                    className="w-full px-3 py-2 bg-amber-500/5 border border-amber-500/10 rounded-lg text-sm text-amber-100 placeholder-amber-300/30 focus:outline-none focus:border-amber-500/30 resize-none" />
                  <div className="flex justify-end">
                    <button onClick={handleSaveNote} disabled={!noteText.trim()}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-600/80 hover:bg-amber-500 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50">
                      <FileText size={12} /> Save Note
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Ticket Management */}
        <div className="lg:col-span-3 space-y-3">
          {/* Status & Priority */}
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Details</h4>
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500">Status</label>
              <select value={ticket.status} onChange={e => updateTicketField('status', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-xs text-white focus:outline-none">
                {['open','in_progress','waiting','resolved','closed'].map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500">Priority</label>
              <select value={ticket.priority} onChange={e => updateTicketField('priority', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-xs text-white focus:outline-none">
                {['low','medium','high','critical'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500">Category</label>
              <p className="text-xs text-slate-300">{ticket.category}</p>
            </div>
          </div>

          {/* Assignment */}
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Assignment</h4>
            <p className="text-sm text-white">{agent.name || 'Unassigned'}</p>
            <button className="w-full text-xs text-amber-400 hover:text-amber-300 text-left py-1 flex items-center gap-1.5 transition-colors">
              <AlertTriangle size={11} /> Escalate to Manager
            </button>
          </div>

          {/* SLA Timer */}
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={12} /> SLA Timer
            </h4>
            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-slate-500">Resolution</span>
                <span className={slaPercent > 80 ? 'text-red-400' : slaPercent > 50 ? 'text-amber-400' : 'text-emerald-400'}>
                  {Math.floor(slaRemainingMins / 60)}h {slaRemainingMins % 60}m remaining
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${slaPercent > 80 ? 'bg-red-500' : slaPercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${slaPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Tag size={12} /> Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {(ticket.tags || []).map((tag, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/50">{tag}</span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 space-y-1.5">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Actions</h4>
            {[
              { label: 'Mark Resolved', icon: CheckCircle2, color: 'text-emerald-400 hover:text-emerald-300', action: () => updateTicketField('status','resolved') },
              { label: 'Close Ticket', icon: Lock, color: 'text-slate-400 hover:text-white', action: () => updateTicketField('status','closed') },
              { label: 'Mark as Spam', icon: AlertCircle, color: 'text-red-400 hover:text-red-300', action: () => updateTicketField('status','spam') },
            ].map((item, i) => (
              <button key={i} onClick={item.action}
                className={`w-full text-left flex items-center gap-2 text-xs py-1.5 transition-colors ${item.color}`}>
                <item.icon size={13} /> {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
