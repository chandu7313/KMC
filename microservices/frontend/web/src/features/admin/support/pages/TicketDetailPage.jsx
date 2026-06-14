import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGlobalStore } from '@/app/store/globalStore';
import {
  useTicketDetail, useUpdateTicket, useAssignTicket,
  useResolveTicket, useCloseTicket, useAddMessage,
  useAddNote
} from '../hooks/useSupportTickets';
import { supportApi } from '../api/support.api';
import {
  ArrowLeft, Clock, User, Phone, CheckCircle2,
  AlertCircle, MessageSquare, Send, Paperclip,
  Lock, AlertTriangle, FileText
} from 'lucide-react';

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useGlobalStore();
  const [replyText, setReplyText] = useState('');
  const [noteText, setNoteText] = useState('');
  const [activeTab, setActiveTab] = useState('reply'); // 'reply' | 'note'
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const { data, isLoading } = useTicketDetail(id);
  const ticket = data?.ticket;
  const messages = data?.messages || [];
  const activities = data?.activities || [];
  const sla = data?.sla;

  const updateMutation = useUpdateTicket();
  const assignMutation = useAssignTicket();
  const resolveMutation = useResolveTicket();
  const addMessageMutation = useAddMessage();
  const addNoteMutation = useAddNote();

  useEffect(() => {
    supportApi.getTemplates().then(res => setTemplates(res.data?.data?.templates || []));
  }, []);

  const handleTemplateChange = (e) => {
    const tmplId = e.target.value;
    setSelectedTemplate(tmplId);
    if (!tmplId) return;
    const tmpl = templates.find(t => t.id === tmplId);
    if (tmpl) {
      let content = tmpl.contentEn || tmpl.content_en;
      content = content.replace('{{farmer_name}}', ticket.farmerName || ticket.farmer_name);
      setReplyText(content);
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    addMessageMutation.mutate({
      ticketId: id,
      data: { message: replyText, templateId: selectedTemplate }
    }, {
      onSuccess: () => {
        setReplyText('');
        setSelectedTemplate('');
      }
    });
  };

  const handleSendNote = () => {
    if (!noteText.trim()) return;
    addNoteMutation.mutate({
      ticketId: id,
      data: { message: noteText }
    }, {
      onSuccess: () => setNoteText('')
    });
  };

  const handleResolve = () => {
    if (!window.confirm('Mark this ticket as resolved?')) return;
    resolveMutation.mutate({ id, data: { resolution: replyText || 'Resolved by agent' } });
  };

  if (isLoading) {
    return <div className="text-white p-6">Loading ticket details...</div>;
  }

  if (!ticket) {
    return <div className="text-white p-6">Ticket not found.</div>;
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/support/tickets')}
            className="p-2 bg-slate-800/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700/50"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white">#{ticket.ticketRef || ticket.ticket_ref}</h1>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full uppercase">
                {ticket.status.replace('_', ' ')}
              </span>
              <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full uppercase">
                {ticket.priority}
              </span>
            </div>
            <h2 className="text-sm text-slate-300 mt-1">{ticket.subject}</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
            <button
              onClick={handleResolve}
              disabled={resolveMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <CheckCircle2 size={16} /> Mark Resolved
            </button>
          )}
          {!ticket.assignedTo && (
            <button
              onClick={() => assignMutation.mutate({ ticketId: id, agentId: userData?.id })}
              disabled={assignMutation.isPending}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Assign to Me
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Left Column - Farmer Info */}
        <div className="lg:col-span-3 space-y-4 overflow-y-auto pr-2">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Requester Info</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-400 font-bold text-lg">
                {(ticket.farmerName || ticket.farmer_name || 'U')[0]}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{ticket.farmerName || ticket.farmer_name}</p>
                <p className="text-xs text-slate-400">Farmer</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Phone size={14} className="text-slate-500" />
                {ticket.farmerPhone || ticket.farmer_phone || 'No phone'}
              </div>
              <button className="w-full mt-4 bg-slate-700/50 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-xs font-semibold transition-colors border border-slate-600/50">
                View Full Profile
              </button>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Ticket Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 mb-1">Category</p>
                <p className="text-sm font-medium text-slate-300">{(ticket.category || '').replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Source</p>
                <p className="text-sm font-medium text-slate-300 capitalize">{ticket.source || 'App'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Created</p>
                <p className="text-sm font-medium text-slate-300">
                  {new Date(ticket.createdAt || ticket.created_at).toLocaleString()}
                </p>
              </div>
              {ticket.linkedOrderId && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Linked Order</p>
                  <p className="text-sm font-medium text-emerald-400 hover:underline cursor-pointer">
                    #{ticket.linkedOrderId}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle Column - Conversation */}
        <div className="lg:col-span-6 flex flex-col bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Original Description */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-700 shrink-0 flex items-center justify-center text-slate-300 font-bold text-xs">
                {(ticket.farmerName || ticket.farmer_name || 'U')[0]}
              </div>
              <div className="flex-1">
                <div className="bg-slate-700/30 rounded-2xl rounded-tl-none p-4 border border-slate-600/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-slate-200">{ticket.farmerName || ticket.farmer_name}</span>
                    <span className="text-xs text-slate-500">{new Date(ticket.createdAt || ticket.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-slate-300 whitespace-pre-wrap">{ticket.description}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-4 ${msg.isInternalNote || msg.is_internal_note ? '' : (msg.senderType || msg.sender_type) === 'agent' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${
                  msg.isInternalNote || msg.is_internal_note
                    ? 'bg-amber-900/50 text-amber-400'
                    : (msg.senderType || msg.sender_type) === 'agent'
                    ? 'bg-emerald-900/50 text-emerald-400'
                    : (msg.senderType || msg.sender_type) === 'system'
                    ? 'bg-slate-700 text-slate-300'
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {msg.isInternalNote || msg.is_internal_note ? <Lock size={12} /> : (msg.senderName || msg.sender_name || 'U')[0]}
                </div>
                <div className="flex-1 max-w-[85%]">
                  <div className={`rounded-2xl p-4 border ${
                    msg.isInternalNote || msg.is_internal_note
                      ? 'bg-amber-900/10 border-amber-500/20 rounded-tl-none'
                      : (msg.senderType || msg.sender_type) === 'agent'
                      ? 'bg-emerald-900/20 border-emerald-500/20 rounded-tr-none'
                      : (msg.senderType || msg.sender_type) === 'system'
                      ? 'bg-slate-800/80 border-slate-700 text-center rounded-xl mx-auto w-fit'
                      : 'bg-slate-700/30 border-slate-600/30 rounded-tl-none'
                  }`}>
                    {(msg.senderType || msg.sender_type) !== 'system' && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-sm text-slate-200">{msg.senderName || msg.sender_name}</span>
                        {msg.isInternalNote || msg.is_internal_note && (
                          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded">Internal Note</span>
                        )}
                        <span className="text-xs text-slate-500 ml-auto">{new Date(msg.createdAt || msg.created_at).toLocaleString()}</span>
                      </div>
                    )}
                    <p className={`text-sm whitespace-pre-wrap ${
                      (msg.senderType || msg.sender_type) === 'system' ? 'text-slate-400 italic text-xs' : 'text-slate-300'
                    }`}>{msg.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reply Box */}
          {ticket.status !== 'closed' && (
            <div className="p-4 border-t border-slate-700/50 bg-slate-900/50 shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => setActiveTab('reply')}
                  className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md transition-colors ${
                    activeTab === 'reply' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  Reply to Farmer
                </button>
                <button
                  onClick={() => setActiveTab('note')}
                  className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md transition-colors ${
                    activeTab === 'note' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  Internal Note
                </button>
              </div>

              {activeTab === 'reply' && (
                <div className="mb-3">
                  <select
                    value={selectedTemplate}
                    onChange={handleTemplateChange}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
                  >
                    <option value="">-- Insert a Template --</option>
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className={`border rounded-xl overflow-hidden focus-within:ring-1 transition-shadow ${
                activeTab === 'reply' ? 'border-emerald-500/30 focus-within:ring-emerald-500/50' : 'border-amber-500/30 focus-within:ring-amber-500/50'
              }`}>
                <textarea
                  value={activeTab === 'reply' ? replyText : noteText}
                  onChange={(e) => activeTab === 'reply' ? setReplyText(e.target.value) : setNoteText(e.target.value)}
                  placeholder={activeTab === 'reply' ? "Type your reply to the farmer..." : "Type an internal note visible only to agents..."}
                  className="w-full bg-slate-900/50 text-slate-200 text-sm p-3 outline-none resize-none min-h-[120px]"
                />
                <div className="bg-slate-800/80 p-2 flex items-center justify-between border-t border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-slate-200 rounded">
                      <Paperclip size={16} />
                    </button>
                  </div>
                  <button
                    onClick={activeTab === 'reply' ? handleSendReply : handleSendNote}
                    disabled={activeTab === 'reply' ? addMessageMutation.isPending : addNoteMutation.isPending}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50 ${
                      activeTab === 'reply' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-amber-600 hover:bg-amber-500'
                    }`}
                  >
                    <Send size={14} />
                    {activeTab === 'reply' ? 'Send Reply' : 'Add Note'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Properties & SLA */}
        <div className="lg:col-span-3 space-y-4 overflow-y-auto pl-2">
          {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">SLA Tracker</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-300">Resolution Due</span>
                {ticket.slaBreached || ticket.sla_breached ? (
                  <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded">Breached</span>
                ) : (
                  <span className="text-xs font-bold text-amber-400">
                    {new Date(ticket.slaDueAt || ticket.sla_due_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2 mb-2">
                <div className={`h-2 rounded-full ${ticket.slaBreached || ticket.sla_breached ? 'bg-red-500 w-full' : 'bg-amber-500 w-2/3'}`} />
              </div>
              <p className="text-xs text-slate-500">
                Target: {sla?.resolutionHours || sla?.resolution_hours} hours
              </p>
            </div>
          )}

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Properties</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Status</label>
                <select
                  value={ticket.status}
                  onChange={(e) => updateMutation.mutate({ id, data: { status: e.target.value } })}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="waiting">Waiting</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Priority</label>
                <select
                  value={ticket.priority}
                  onChange={(e) => updateMutation.mutate({ id, data: { priority: e.target.value } })}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Assignee</label>
                <select
                  value={ticket.assignedTo || ''}
                  onChange={(e) => assignMutation.mutate({ ticketId: id, agentId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
                >
                  <option value="">Unassigned</option>
                  {/* Would normally map over actual agents here, for now just show assigned if exists or me */}
                  {ticket.assignedTo && <option value={ticket.assignedTo}>{ticket.assignedAgentName || ticket.assigned_agent_name}</option>}
                  {ticket.assignedTo !== userData?.id && <option value={userData?.id}>Assign to me ({userData?.name})</option>}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
