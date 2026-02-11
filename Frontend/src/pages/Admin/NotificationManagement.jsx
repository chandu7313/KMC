import { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { Send, History, Users, MapPin, Sprout, Info, Clock } from "lucide-react";

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
        targetValue: ''
    });

    const districtsList = ["Rajkot", "Nagpur", "Junagadh", "Davangere", "Alwar", "Latur", "Guntur", "Karnal", "Dewas", "Muzaffarnagar", "Indore"];
    const cropsList = ["Cotton", "Rice", "Wheat", "Soybean", "Sugarcane", "Mustard", "Groundnut", "Maize", "Pulses"];

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

    const handleSendNotification = async (e) => {
        e.preventDefault();
        try {
            setSending(true);
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(`${backendUrl}/api/admin/notifications`, formData);
            if (data.success) {
                toast.success(data.message);
                setFormData({ title: '', message: '', targetType: 'All', targetValue: '' });
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left - Composer */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-6">
                        <Send size={20} className="text-green-600" />
                        <h2 className="text-xl font-bold text-slate-800">New Notification</h2>
                    </div>

                    <form onSubmit={handleSendNotification} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Title</label>
                            <input 
                                type="text" name="title" required
                                placeholder="E.g., Subsidy Update"
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                value={formData.title}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Message</label>
                            <textarea 
                                name="message" required rows="4"
                                placeholder="Type your message here..."
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none"
                                value={formData.message}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Target</label>
                                <select 
                                    name="targetType"
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                    value={formData.targetType}
                                    onChange={handleInputChange}
                                >
                                    <option value="All">All Farmers</option>
                                    <option value="District">By District</option>
                                    <option value="Crop">By Crop Type</option>
                                </select>
                            </div>

                            {formData.targetType !== 'All' && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Select {formData.targetType}</label>
                                    <select 
                                        name="targetValue" required
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                        value={formData.targetValue}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Choose...</option>
                                        {formData.targetType === 'District' 
                                            ? districtsList.map(d => <option key={d} value={d}>{d}</option>)
                                            : cropsList.map(c => <option key={c} value={c}>{c}</option>)
                                        }
                                    </select>
                                </div>
                            )}
                        </div>

                        <button 
                            type="submit" disabled={sending}
                            className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition font-semibold shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {sending ? 'Sending...' : <><Send size={18} /> Send Notification</>}
                        </button>
                    </form>
                </div>

                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <div className="flex gap-3">
                        <Info className="text-blue-600 mt-1 shrink-0" size={20} />
                        <div>
                            <h4 className="text-blue-800 font-bold text-sm mb-1 text-center">Important Note</h4>
                            <p className="text-blue-700 text-xs leading-relaxed text-center">
                                Targeted notifications allow you to send crop-specific advice or district-level alerts efficiently. 
                                Recipients will see these in their dashboard.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right - History */}
            <div className="lg:col-span-8 flex flex-col h-full">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex-1 flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <History size={20} className="text-slate-400" />
                            <h2 className="text-xl font-bold text-slate-800">Notification History</h2>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">{notifications.length} Sent Total</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4">Status & Details</th>
                                    <th className="px-6 py-4">Targeting</th>
                                    <th className="px-6 py-4">Reach</th>
                                    <th className="px-6 py-4">Sent At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr><td colSpan="4" className="text-center py-20 text-slate-400">Loading history...</td></tr>
                                ) : notifications.length === 0 ? (
                                    <tr><td colSpan="4" className="text-center py-20 text-slate-400">No records found</td></tr>
                                ) : notifications.map((record) => (
                                    <tr key={record._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 max-w-xs">
                                            <div className="font-bold text-slate-900 mb-0.5">{record.title}</div>
                                            <div className="text-xs text-slate-500 line-clamp-1">{record.message}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {record.targetType === 'All' && <Users size={14} className="text-slate-400" />}
                                                {record.targetType === 'District' && <MapPin size={14} className="text-slate-400" />}
                                                {record.targetType === 'Crop' && <Sprout size={14} className="text-slate-400" />}
                                                <span className="font-medium text-slate-700 capitalize">{record.targetType}</span>
                                                {record.targetValue !== 'Global' && (
                                                    <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] text-slate-600 font-bold">{record.targetValue}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-slate-900 font-bold">{record.recipientCount}</span>
                                                <span className="text-[10px] text-slate-400 uppercase font-medium tracking-wider text-center">Recipients</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                                                <Clock size={12} />
                                                {new Date(record.sentAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                            </div>
                                            <div className="text-[10px] text-slate-400 mt-1 uppercase text-center">by {record.sentBy?.name || 'Admin'}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default NotificationManagement;
