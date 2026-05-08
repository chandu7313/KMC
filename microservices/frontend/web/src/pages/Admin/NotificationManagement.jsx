import { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { Send, Users, MapPin, Sprout, UserCheck, Signal, Wifi, BatteryFull, ChevronDown } from "lucide-react";

const NotificationManagement = () => {
    const { backendUrl } = useContext(AppContext);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    
    // Form States
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        targetType: 'All',
        targetValue: '',
        scheduling: 'now'
    });

    const districtsList = ["Rajkot", "Nagpur", "Junagadh", "Davangere", "Alwar", "Latur", "Guntur", "Karnal", "Dewas", "Muzaffarnagar", "Indore"];
    const cropsList = ["Cotton", "Rice", "Wheat", "Soybean", "Sugarcane", "Mustard", "Groundnut", "Maize", "Pulses"];

    const TARGET_TYPES = [
        { label: 'All', value: 'All', icon: Users },
        { label: 'District', value: 'District', icon: MapPin },
        { label: 'Crop', value: 'Crop', icon: Sprout },
        { label: 'Specific', value: 'Specific', icon: UserCheck }
    ];

    const fetchHistory = useCallback(async () => {
        try {
            setLoading(true);
            axios.defaults.withCredentials = true;
            const { data } = await axios.get(`${backendUrl}/api/admin/notifications`);
            if (data.success) {
                setNotifications(data.notifications);
            }
        } catch (error) {
            console.error("Error fetching notification history", error);
        } finally {
            setLoading(false);
        }
    }, [backendUrl]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTargetTypeChange = (value) => {
        setFormData(prev => ({ ...prev, targetType: value, targetValue: '' }));
    };

    const handleSendNotification = async (e) => {
        e.preventDefault();
        
        let titleToSend = formData.title || (formData.message.substring(0, 20) + (formData.message.length > 20 ? '...' : ''));
        const payload = {
            title: titleToSend,
            message: formData.message,
            targetType: formData.target_type,
            targetValue: formData.target_value || "Global"
        };

        try {
            setSending(true);
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(`${backendUrl}/api/admin/notifications`, payload);
            if (data.success) {
                toast.success(data.message);
                setFormData({ title: '', message: '', targetType: 'All', targetValue: '', scheduling: 'now' });
                fetchHistory();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up">
            
            {/* Left - Composer */}
            <div className="lg:col-span-7">
                <div className="bg-white rounded-3xl p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-100">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Compose SMS</h2>
                        <div className="bg-slate-100 rounded-full p-1 flex items-center gap-1">
                          <button className="bg-white text-green-700 text-[11px] uppercase tracking-wider font-extrabold px-4 py-1.5 rounded-full shadow-sm">English</button>
                          <button className="text-slate-500 hover:text-slate-700 text-[11px] uppercase font-bold px-4 py-1.5 rounded-full transition-colors">हिन्दी</button>
                          <button className="text-slate-500 hover:text-slate-700 text-[11px] uppercase font-bold px-4 py-1.5 rounded-full transition-colors">ಕನ್ನಡ</button>
                        </div>
                    </div>

                    <form onSubmit={handleSendNotification} className="space-y-7">
                        
                        {/* Target Audience */}
                        <div className="space-y-3">
                            <label className="block text-xs font-bold text-slate-500">Target Audience</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {TARGET_TYPES.map(t => (
                                    <button
                                        key={t.value} type="button"
                                        onClick={() => handleTargetTypeChange(t.value)}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                                            formData.target_type === t.value 
                                            ? 'border-green-600 bg-green-50 text-green-800 shadow-sm' 
                                            : 'border-slate-50 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:border-slate-100'
                                        }`}
                                    >
                                        <t.icon size={16} className={formData.target_type === t.value ? "text-green-600" : "text-slate-400"} /> 
                                        <span className="font-extrabold text-[13px]">{t.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Filter Selection */}
                        {formData.target_type !== 'All' && formData.target_type !== 'Specific' && (
                            <div className="space-y-3 animate-fade-in-up">
                            <label className="block text-xs font-bold text-slate-500">Select Filter</label>
                            <div className="relative">
                                <select 
                                    name="targetValue"
                                    value={formData.target_value}
                                    onChange={handleInputChange}
                                    className="w-full border-0 bg-slate-100 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-green-600 outline-none appearance-none cursor-pointer hover:bg-slate-200 transition-colors"
                                    required
                                >
                                    <option value="" disabled className="text-slate-400">Select District or Crop variety...</option>
                                    {formData.target_type === 'District' 
                                        ? districtsList.map(d => <option key={d} value={d}>{d}</option>)
                                        : cropsList.map(c => <option key={c} value={c}>{c}</option>)
                                    }
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                            </div>
                            </div>
                        )}

                        {formData.target_type === 'Specific' && (
                            <div className="space-y-3 animate-fade-in-up">
                            <label className="block text-xs font-bold text-slate-500">Select Filter</label>
                            <input 
                                type="text"
                                name="targetValue"
                                value={formData.target_value}
                                onChange={handleInputChange}
                                placeholder="Enter specific phone number..."
                                className="w-full border-0 bg-slate-100 hover:bg-slate-200 transition-colors rounded-xl px-4 py-3.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-green-600 outline-none"
                                required
                            />
                            </div>
                        )}

                        {/* Message Content */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <label className="block text-xs font-bold text-slate-500">Message Content</label>
                                <span className="text-[10px] font-bold text-slate-500">{formData.message.length} / 160 characters</span>
                            </div>
                            <textarea 
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                required rows="4"
                                placeholder="Write your notification message here..."
                                className="w-full border-0 bg-slate-100 hover:bg-slate-200 focus:bg-white transition-colors rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-800 focus:ring-2 focus:ring-green-600 outline-none resize-none"
                            ></textarea>
                            <p className="text-[10px] text-slate-400 font-medium italic">Note: Messages exceeding 160 characters will be sent as 2 SMS credits.</p>
                        </div>

                        {/* Scheduling */}
                        <div className="space-y-3">
                            <label className="block text-xs font-bold text-slate-500">Scheduling</label>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors group-hover:border-green-500 ${formData.scheduling === 'now' ? 'border-green-600' : 'border-slate-300'}`}>
                                        {formData.scheduling === 'now' && <div className="w-2.5 h-2.5 bg-green-600 rounded-full animate-fade-in-up"></div>}
                                    </div>
                                    <span className="text-[13px] font-bold text-slate-800">Send Now</span>
                                    <input type="radio" name="scheduling" value="now" className="hidden" checked={formData.scheduling === 'now'} onChange={handleInputChange} />
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors group-hover:border-slate-400 ${formData.scheduling === 'later' ? 'border-green-600' : 'border-slate-300'}`}>
                                        {formData.scheduling === 'later' && <div className="w-2.5 h-2.5 bg-green-600 rounded-full animate-fade-in-up"></div>}
                                    </div>
                                    <span className="text-[13px] font-bold text-slate-800">Send Later</span>
                                    <input type="radio" name="scheduling" value="later" className="hidden" checked={formData.scheduling === 'later'} onChange={handleInputChange} />
                                </label>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="border-t border-slate-100 pt-7 mt-8 flex justify-end items-center gap-8">
                            <button type="button" className="text-[13px] font-bold text-slate-500 hover:text-slate-800 transition-colors">Save Draft</button>
                            <button 
                                type="submit" disabled={sending || !formData.message} 
                                className="bg-[#0f682e] hover:bg-[#0c5324] text-white font-bold px-8 py-3.5 rounded-xl xl:rounded-2xl shadow-[0_4px_14px_0_rgba(15,104,46,0.39)] hover:shadow-[0_6px_20px_rgba(15,104,46,0.23)] hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 disabled:shadow-none disabled:translate-y-0"
                            >
                                {sending ? 'Broadcasting...' : 'Broadcast SMS'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right - Live Preview & History */}
            <div className="lg:col-span-5 flex flex-col gap-8">
                
                {/* LIVE PREVIEW container */}
                <div className="bg-white rounded-3xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col items-center flex-shrink-0">
                    <div className="w-full mb-6 relative">
                       <h3 className="text-[11px] font-extrabold tracking-[0.2em] text-slate-600 uppercase">Live Preview</h3>
                    </div>
                    
                    {/* Phone Mockup */}
                    <div className="w-[300px] h-[520px] bg-white border-[14px] border-slate-800 rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col scale-95 transform origin-top xl:scale-100">
                       {/* Notch */}
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-[18px] z-20"></div>
                       
                       {/* Status Bar */}
                       <div className="pt-2 px-5 flex justify-between items-center text-[10px] font-semibold text-slate-800 z-10 relative bg-white">
                          <span>10:45 AM</span>
                          <div className="flex items-center gap-1.5">
                             <Signal size={12} fill="currentColor" strokeWidth={1} />
                             <Wifi size={12} />
                             <BatteryFull size={12} fill="currentColor" strokeWidth={1} />
                          </div>
                       </div>

                       {/* Header */}
                       <div className="flex flex-col items-center pt-8 pb-4 relative z-10 bg-white">
                          <div className="w-12 h-12 bg-green-50 border border-green-100 text-green-700 rounded-full flex items-center justify-center mb-2 shadow-sm">
                             <Users size={18} />
                          </div>
                          <span className="text-[10px] font-extrabold text-slate-800 tracking-wide uppercase">KMC-AGRI</span>
                       </div>

                       {/* Chat Body */}
                       <div className="flex-1 bg-slate-50 p-4 relative z-10 overflow-y-auto w-full">
                          {/* SMS Bubble */}
                          <div className="w-full max-w-[90%] float-left clear-both mt-4 animate-fade-in-up">
                              <div className="bg-white p-4 py-3 rounded-b-2xl rounded-tr-2xl rounded-tl-sm shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border border-slate-100">
                                 <p className="text-[13px] text-slate-700 leading-relaxed font-medium whitespace-pre-wrap break-words">
                                   {formData.message || "Important: Weather alert for Mandya district. Expect heavy rainfall over the next 48 hours. Please protect your harvest."}
                                 </p>
                                 <div className="text-[9px] text-slate-400 font-bold text-right mt-2">10:45 AM</div>
                              </div>
                          </div>
                       </div>

                       {/* Input area */}
                       <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-2 relative z-10 pb-6 w-full">
                          <div className="flex-1 bg-slate-50 border border-slate-100 rounded-full px-4 py-2.5 text-[10px] text-slate-400 font-bold">
                             Text Message...
                          </div>
                          <div className="w-9 h-9 rounded-full bg-[#0f682e] flex items-center justify-center text-white shrink-0 shadow-md">
                             <Send size={14} className="ml-0.5" />
                          </div>
                       </div>
                    </div>
                </div>

                {/* NOTIFICATION HISTORY container */}
                <div className="bg-white rounded-3xl pt-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-100 flex-1 flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center mb-4 px-6">
                        <h3 className="text-[11px] font-extrabold tracking-[0.2em] text-slate-600 uppercase">Notification History</h3>
                        <button className="text-[11px] font-extrabold text-green-700 hover:text-green-800 transition-colors tracking-wide">View All</button>
                    </div>

                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#f8fafc] text-[9px] text-slate-500 font-extrabold uppercase tracking-widest border-y border-slate-100">
                                <tr>
                                    <th className="px-6 py-4">Message</th>
                                    <th className="px-6 py-4 text-center">Recipients</th>
                                    <th className="px-6 py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr><td colSpan="3" className="text-center py-6 text-slate-400 text-xs font-bold">Loading history...</td></tr>
                                ) : notifications.length === 0 ? (
                                    <tr><td colSpan="3" className="text-center py-6 text-slate-400 text-xs font-bold">No records found</td></tr>
                                ) : notifications.slice(0, 4).map((record) => {
                                   let status = record.status || 'DELIVERED';
                                   if (record.title?.includes('Estate:') || status === 'SCHEDULED') status = 'SCHEDULED';
                                   if (record.title?.includes('URGENT:') || status === 'FAILED') status = 'FAILED';

                                   let pillClasses = "bg-green-50 text-green-700 border-green-100"; 
                                   if (status === 'SCHEDULED') pillClasses = "bg-[#fdf2f2] text-rose-500 border-rose-100";
                                   if (status === 'FAILED') pillClasses = "bg-red-50 text-red-600 border-red-100";

                                   return (
                                    <tr key={record.id} className="hover:bg-slate-50 border-b border-slate-50 transition-colors group">
                                        <td className="px-6 py-4 align-top w-1/2">
                                            <div className="font-extrabold text-slate-800 text-xs mb-1 line-clamp-1">{record.title || "Message Update..."}</div>
                                            <div className="text-[10px] text-slate-500 font-semibold">{new Date(record.sentAt).toLocaleString([], { month:'short', day:'2-digit', hour:'2-digit', minute:'2-digit'})}</div>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                             <div className="text-center text-[13px] font-extrabold text-slate-700">
                                                 {(record.recipient_count || 0).toLocaleString()}
                                             </div>
                                        </td>
                                        <td className="px-6 py-4 align-top text-right">
                                             <span className={`inline-flex px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded transition-colors ${pillClasses}`}>
                                                 {status}
                                             </span>
                                        </td>
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default NotificationManagement;
