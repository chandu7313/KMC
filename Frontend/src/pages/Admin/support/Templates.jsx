import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2, X, FileText, Globe } from "lucide-react";

const Templates = () => {
  const { backendUrl } = useContext(AppContext);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'General', contentEn: '', contentHi: '', contentTe: '', subjectEn: '', variables: '' });
  const [activeLang, setActiveLang] = useState('en');
  const [filterCategory, setFilterCategory] = useState('');

  const CATEGORIES = ['General', 'Order Issues', 'Payment Issues', 'Call Booking', 'App Problems'];

  useEffect(() => {
    const fetch = async () => {
      try {
        const params = filterCategory ? `?category=${filterCategory}` : '';
        const { data } = await axios.get(`${backendUrl}/api/support/templates${params}`);
        if (data.success) setTemplates(data.templates);
      } catch {
        setTemplates([
          { id: '1', name: 'Order Delay Apology', category: 'Order Issues', contentEn: 'Dear {{farmer_name}}, we apologize for the delay...', contentHi: 'प्रिय {{farmer_name}}...', contentTe: 'ప్రియ {{farmer_name}}...', subjectEn: 'Apology for Delay', variables: ['{{farmer_name}}', '{{order_id}}'] },
          { id: '2', name: 'Ticket Received', category: 'General', contentEn: 'Dear {{farmer_name}}, we received your ticket #{{ticket_ref}}...', contentHi: 'प्रिय {{farmer_name}}...', contentTe: 'ప్రియ {{farmer_name}}...', subjectEn: 'Ticket Received', variables: ['{{farmer_name}}', '{{ticket_ref}}'] },
          { id: '3', name: 'Refund Initiated', category: 'Payment Issues', contentEn: 'Dear {{farmer_name}}, refund for order #{{order_id}} has been initiated...', contentHi: '', contentTe: '', subjectEn: 'Refund Initiated', variables: ['{{farmer_name}}', '{{order_id}}'] },
        ]);
      } finally { setLoading(false); }
    };
    fetch();
  }, [filterCategory, backendUrl]);

  const openCreate = () => { setEditing(null); setForm({ name: '', category: 'General', contentEn: '', contentHi: '', contentTe: '', subjectEn: '', variables: '' }); setShowModal(true); };
  const openEdit = (t) => { setEditing(t); setForm({ ...t, variables: (t.variables || []).join(', ') }); setShowModal(true); };

  const handleSave = async () => {
    try {
      const payload = { ...form, variables: form.variables.split(',').map(v => v.trim()).filter(Boolean) };
      if (editing) {
        await axios.put(`${backendUrl}/api/support/templates/${editing.id}`, payload);
        setTemplates(prev => prev.map(t => t.id === editing.id ? { ...t, ...payload } : t));
      } else {
        const { data } = await axios.post(`${backendUrl}/api/support/templates`, payload);
        if (data.success) setTemplates(prev => [...prev, data.template]);
      }
      toast.success(editing ? 'Template updated' : 'Template created');
      setShowModal(false);
    } catch { toast.error('Failed to save'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this template?')) return;
    try {
      await axios.delete(`${backendUrl}/api/support/templates/${id}`);
      setTemplates(prev => prev.filter(t => t.id !== id));
      toast.success('Template deleted');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-white">Quick Reply Templates</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus size={16} /> New Template
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['', ...CATEGORIES].map(c => (
          <button key={c} onClick={() => setFilterCategory(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${filterCategory === c ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' : 'border-slate-700/50 text-slate-400 hover:text-white'}`}>
            {c || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {templates.map(t => (
            <div key={t.id} className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 hover:border-slate-700/50 transition-all group">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-white">{t.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 mt-1 inline-block">{t.category}</span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"><Pencil size={12} /></button>
                  <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10"><Trash2 size={12} /></button>
                </div>
              </div>
              <p className="text-xs text-slate-400 line-clamp-3 mb-3">{t.contentEn}</p>
              <div className="flex items-center gap-2">
                <Globe size={11} className="text-slate-500" />
                <div className="flex gap-1">
                  {[t.contentEn && 'EN', t.contentHi && 'HI', t.contentTe && 'TE'].filter(Boolean).map(l => (
                    <span key={l} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500">{l}</span>
                  ))}
                </div>
              </div>
              {t.variables?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {t.variables.map((v, i) => <span key={i} className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono">{v}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{editing ? 'Edit' : 'Create'} Template</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Template Name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                className="px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" />
              <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}
                className="px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <input placeholder="Subject" value={form.subjectEn} onChange={e => setForm(f => ({...f, subjectEn: e.target.value}))}
              className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" />

            <div className="flex gap-2">
              {[{k:'en',l:'English'},{k:'hi',l:'Hindi'},{k:'te',l:'Telugu'}].map(({k,l}) => (
                <button key={k} onClick={() => setActiveLang(k)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${activeLang === k ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-500 hover:text-white'}`}>{l}</button>
              ))}
            </div>
            <textarea rows={5}
              value={activeLang === 'en' ? form.contentEn : activeLang === 'hi' ? form.contentHi : form.contentTe}
              onChange={e => setForm(f => ({...f, [activeLang === 'en' ? 'contentEn' : activeLang === 'hi' ? 'contentHi' : 'contentTe']: e.target.value}))}
              placeholder={`Content in ${activeLang === 'en' ? 'English' : activeLang === 'hi' ? 'Hindi' : 'Telugu'}...`}
              className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 resize-none" />
            <input placeholder="Variables (comma-separated): {{farmer_name}}, {{order_id}}" value={form.variables} onChange={e => setForm(f => ({...f, variables: e.target.value}))}
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

export default Templates;
