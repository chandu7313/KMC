import React from 'react';
import { Bell, Send, Mail, Smartphone } from 'lucide-react';

const notifications = [
    { id: 1, type: 'SMS', to: 'Rajesh Kumar', message: 'Your ticket #TK-247 has been assigned to Agent Sarah', time: '5m ago', status: 'Sent' },
    { id: 2, type: 'Email', to: 'Harpreet Singh', message: 'Your soil report for Field B-4 is ready', time: '15m ago', status: 'Sent' },
    { id: 3, type: 'SMS', to: 'Sukhwinder', message: 'Expert callback scheduled for tomorrow at 10 AM', time: '1h ago', status: 'Sent' },
    { id: 4, type: 'Email', to: 'Amit Verma', message: 'Order #KMC-8821 has been shipped', time: '2h ago', status: 'Failed' },
    { id: 5, type: 'SMS', to: 'Balwinder', message: 'Your refund of ₹1,200 has been processed', time: '3h ago', status: 'Sent' },
];

const Notifications = () => (
    <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-black text-slate-800">Notifications</h1>
                <p className="text-sm text-slate-500 font-medium mt-1">SMS and email notifications sent to farmers</p>
            </div>
            <button className="flex items-center gap-2 bg-[#1a5632] hover:bg-[#145028] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
                <Send size={16} /> Send Notification
            </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 border-b-4 border-b-blue-500">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sent Today</p>
                <p className="text-3xl font-black text-slate-800">24</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 border-b-4 border-b-green-500">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Delivery Rate</p>
                <p className="text-3xl font-black text-slate-800">96%</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 border-b-4 border-b-red-400">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Failed</p>
                <p className="text-3xl font-black text-red-600">1</p>
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-50">
            {notifications.map(n => (
                <div key={n.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${n.type === 'SMS' ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'}`}>
                        {n.type === 'SMS' ? <Smartphone size={16} /> : <Mail size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-700">To: <b>{n.to}</b></p>
                        <p className="text-xs text-slate-500 truncate">{n.message}</p>
                    </div>
                    <span className="text-xs text-slate-400 font-medium shrink-0">{n.time}</span>
                    <span className={`text-[9px] font-bold px-2 py-1 rounded shrink-0 ${n.status === 'Sent' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {n.status}
                    </span>
                </div>
            ))}
        </div>
    </div>
);

export default Notifications;
