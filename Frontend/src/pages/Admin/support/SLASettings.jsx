import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";
import { Settings, Save, Clock, AlertTriangle, Shield, Info } from "lucide-react";

const PRIORITY_COLORS = {
  critical: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  high: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  medium: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  low: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' },
};

const formatTime = (mins) => {
  if (mins < 60) return `${mins}m`;
  if (mins < 1440) return `${Math.floor(mins/60)}h ${mins%60 > 0 ? `${mins%60}m` : ''}`.trim();
  return `${Math.floor(mins/1440)}d ${Math.floor((mins%1440)/60) > 0 ? `${Math.floor((mins%1440)/60)}h` : ''}`.trim();
};

const SLASettings = () => {
  const { backendUrl } = useContext(AppContext);
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/support/settings/sla`);
        if (data.success) setConfigs(data.config);
      } catch {
        setConfigs([
          { id: '1', priority: 'critical', firstResponseMins: 30, resolutionMins: 240, escalateAfterMins: 120 },
          { id: '2', priority: 'high', firstResponseMins: 120, resolutionMins: 1440, escalateAfterMins: 480 },
          { id: '3', priority: 'medium', firstResponseMins: 480, resolutionMins: 2880, escalateAfterMins: 1440 },
          { id: '4', priority: 'low', firstResponseMins: 1440, resolutionMins: 4320, escalateAfterMins: 2880 },
        ]);
      } finally { setLoading(false); }
    };
    fetch();
  }, [backendUrl]);

  const handleChange = (index, field, value) => {
    setConfigs(prev => prev.map((c, i) => i === index ? { ...c, [field]: parseInt(value) || 0 } : c));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await axios.put(`${backendUrl}/api/support/settings/sla`, { configs });
      if (data.success) { setConfigs(data.config); toast.success('SLA settings saved'); }
    } catch { toast.error('Failed to save SLA settings'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><Settings size={20} /> SLA Configuration</h1>
          <p className="text-sm text-slate-500 mt-0.5">Set response time, resolution time, and auto-escalation rules per priority level</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
          <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 flex items-start gap-3">
        <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-300/80 space-y-1">
          <p><strong>First Response:</strong> Maximum time before an agent sends the first reply.</p>
          <p><strong>Resolution:</strong> Maximum time to fully resolve the ticket.</p>
          <p><strong>Auto-Escalation:</strong> If no response within this time, ticket is auto-escalated to a manager.</p>
        </div>
      </div>

      {/* SLA Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {configs.map((config, index) => {
          const colors = PRIORITY_COLORS[config.priority] || PRIORITY_COLORS.low;
          return (
            <div key={config.id || index} className={`bg-slate-900/50 border ${colors.border} rounded-xl p-5 space-y-4`}>
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.bg}`}>
                  <AlertTriangle size={18} className={colors.text} />
                </div>
                <div>
                  <h3 className={`text-base font-bold uppercase ${colors.text}`}>{config.priority}</h3>
                  <p className="text-[10px] text-slate-500">Priority Level</p>
                </div>
              </div>

              {/* Current Summary */}
              <div className="flex gap-2">
                {[
                  { label: '1st Response', value: formatTime(config.firstResponseMins), icon: Clock },
                  { label: 'Resolution', value: formatTime(config.resolutionMins), icon: Shield },
                  { label: 'Escalation', value: formatTime(config.escalateAfterMins), icon: AlertTriangle },
                ].map((s, i) => (
                  <div key={i} className="flex-1 bg-slate-800/30 rounded-lg p-2 text-center">
                    <s.icon size={12} className="text-slate-500 mx-auto" />
                    <p className="text-sm font-bold text-white mt-0.5">{s.value}</p>
                    <p className="text-[9px] text-slate-500">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Input Fields */}
              <div className="space-y-3">
                {[
                  { key: 'firstResponseMins', label: 'First Response Time (minutes)' },
                  { key: 'resolutionMins', label: 'Resolution Time (minutes)' },
                  { key: 'escalateAfterMins', label: 'Auto-Escalate After (minutes)' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">{field.label}</label>
                    <input type="number" value={config[field.key]} onChange={e => handleChange(index, field.key, e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50" />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Reference */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Quick Reference</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/50">
                {['Priority', 'First Response', 'Resolution', 'Auto-Escalation'].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {configs.map(c => {
                const colors = PRIORITY_COLORS[c.priority] || PRIORITY_COLORS.low;
                return (
                  <tr key={c.priority}>
                    <td className="px-4 py-2.5"><span className={`text-xs font-semibold uppercase ${colors.text}`}>{c.priority}</span></td>
                    <td className="px-4 py-2.5 text-sm text-slate-300">{formatTime(c.firstResponseMins)}</td>
                    <td className="px-4 py-2.5 text-sm text-slate-300">{formatTime(c.resolutionMins)}</td>
                    <td className="px-4 py-2.5 text-sm text-slate-300">{formatTime(c.escalateAfterMins)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SLASettings;
