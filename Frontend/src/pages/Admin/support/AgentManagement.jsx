import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";
import { Plus, Pencil, X, Star, Ticket, Shield, UserPlus } from "lucide-react";

const STATUS_DOT = { online: 'bg-emerald-400', busy: 'bg-amber-400', offline: 'bg-slate-500' };
const ROLE_BADGE = { super_admin: 'bg-red-500/10 text-red-400', support_manager: 'bg-purple-500/10 text-purple-400', support_agent: 'bg-blue-500/10 text-blue-400' };

const AgentManagement = () => {
  const { backendUrl } = useContext(AppContext);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'support_agent', assignedDistricts: '', languagesSpoken: 'en' });

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/support/agents`);
        if (data.success) setAgents(data.agents);
      } catch {
        setAgents([
          { id: '1', name: 'Priya Sharma', email: 'priya@kmc.com', phone: '+91 9123456789', role: 'support_agent', status: 'online', isActive: true, openTickets: 5, resolvedToday: 8, rating: 4.7, assignedDistricts: ['Warangal','Karimnagar'], languagesSpoken: ['en','te'] },
          { id: '2', name: 'Ravi Kumar', email: 'ravi@kmc.com', phone: '+91 9123456780', role: 'support_agent', status: 'busy', isActive: true, openTickets: 3, resolvedToday: 4, rating: 4.3, assignedDistricts: ['Nizamabad'], languagesSpoken: ['en','hi'] },
          { id: '3', name: 'Meera Reddy', email: 'meera@kmc.com', phone: '+91 9123456781', role: 'support_manager', status: 'online', isActive: true, openTickets: 2, resolvedToday: 6, rating: 4.8, assignedDistricts: [], languagesSpoken: ['en','te','hi'] },
        ]);
      } finally { setLoading(false); }
    };
    fetch();
  }, [backendUrl]);

  const openCreate = () => { setEditing(null); setForm({ name: '', email: '', phone: '', password: '', role: 'support_agent', assignedDistricts: '', languagesSpoken: 'en' }); setShowModal(true); };
  const openEdit = (a) => { setEditing(a); setForm({ ...a, password: '', assignedDistricts: (a.assignedDistricts || []).join(', '), languagesSpoken: (a.languagesSpoken || []).join(', ') }); setShowModal(true); };

  const handleSave = async () => {
    try {
      const payload = { ...form, assignedDistricts: form.assignedDistricts.split(',').map(d => d.trim()).filter(Boolean), languagesSpoken: form.languagesSpoken.split(',').map(l => l.trim()).filter(Boolean) };
      if (!payload.password && !editing) payload.password = 'agent123';
      if (editing) {
        const { data } = await axios.put(`${backendUrl}/api/support/agents/${editing.id}`, payload);
        if (data.success) setAgents(prev => prev.map(a => a.id === editing.id ? { ...a, ...data.agent } : a));
      } else {
        const { data } = await axios.post(`${backendUrl}/api/support/agents`, payload);
        if (data.success) setAgents(prev => [...prev, data.agent]);
      }
      toast.success(editing ? 'Agent updated' : 'Agent created');
      setShowModal(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
  };

  const toggleStatus = async (agent) => {
    const next = agent.status === 'online' ? 'busy' : agent.status === 'busy' ? 'offline' : 'online';
    try {
      await axios.put(`${backendUrl}/api/support/agents/${agent.id}/status`, { status: next });
      setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, status: next } : a));
    } catch { /* ignore */ }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-white">Agent Management</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors">
          <UserPlus size={16} /> Add Agent
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {agents.map(agent => (
            <div key={agent.id} className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5 hover:border-slate-700/50 transition-all group">
              <div className="flex items-start gap-3 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-emerald-400 text-lg font-bold">
                    {agent.name?.charAt(0)}
                  </div>
                  <button onClick={() => toggleStatus(agent)}
                    className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 cursor-pointer ${STATUS_DOT[agent.status]}`}
                    title={`Click to change (${agent.status})`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white truncate">{agent.name}</h3>
                    <button onClick={() => openEdit(agent)} className="p-1 rounded text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all"><Pencil size={11} /></button>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{agent.email}</p>
                  <span className={`inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${ROLE_BADGE[agent.role]}`}>{agent.role?.replace('_',' ')}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 rounded-lg bg-slate-800/30">
                  <Ticket size={12} className="text-blue-400 mx-auto" />
                  <p className="text-sm font-bold text-white mt-0.5">{agent.openTickets || 0}</p>
                  <p className="text-[9px] text-slate-500">Open</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-slate-800/30">
                  <Shield size={12} className="text-emerald-400 mx-auto" />
                  <p className="text-sm font-bold text-white mt-0.5">{agent.resolvedToday || 0}</p>
                  <p className="text-[9px] text-slate-500">Resolved</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-slate-800/30">
                  <Star size={12} className="text-amber-400 mx-auto" />
                  <p className="text-sm font-bold text-white mt-0.5">{agent.rating || '—'}</p>
                  <p className="text-[9px] text-slate-500">Rating</p>
                </div>
              </div>

              {(agent.assignedDistricts || []).length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {agent.assignedDistricts.map((d, i) => <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500">{d}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{editing ? 'Edit Agent' : 'Add New Agent'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            {[
              { key: 'name', label: 'Full Name', type: 'text' },
              { key: 'email', label: 'Email', type: 'email' },
              { key: 'phone', label: 'Phone', type: 'text' },
              { key: 'password', label: editing ? 'New Password (leave blank to keep)' : 'Password', type: 'password' },
            ].map(f => (
              <input key={f.key} type={f.type} placeholder={f.label} value={form[f.key]} onChange={e => setForm(prev => ({...prev, [f.key]: e.target.value}))}
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" />
            ))}
            <select value={form.role} onChange={e => setForm(f => ({...f, role: e.target.value}))}
              className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none">
              <option value="support_agent">Support Agent</option>
              <option value="support_manager">Support Manager</option>
              <option value="super_admin">Super Admin</option>
            </select>
            <input placeholder="Assigned Districts (comma-separated)" value={form.assignedDistricts} onChange={e => setForm(f => ({...f, assignedDistricts: e.target.value}))}
              className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" />
            <input placeholder="Languages (comma-separated: en, hi, te)" value={form.languagesSpoken} onChange={e => setForm(f => ({...f, languagesSpoken: e.target.value}))}
              className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
              <button onClick={handleSave} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentManagement;
