import React from 'react';
import { Phone, Calendar, Clock, MapPin, User, CheckCircle2, XCircle } from 'lucide-react';

const bookings = [
    { id: 'CB-301', farmer: 'Rajesh Kumar', phone: '+91 98765 43210', type: 'Expert Callback', scheduled: 'Today, 3:00 PM', status: 'Pending', agent: 'Unassigned', location: 'Guntur' },
    { id: 'CB-300', farmer: 'Harpreet Singh', phone: '+91 94567 89012', type: 'Farm Visit Follow-up', scheduled: 'Today, 4:30 PM', status: 'Confirmed', agent: 'Sarah', location: 'Sangrur' },
    { id: 'CB-299', farmer: 'Sukhwinder', phone: '+91 98123 45670', type: 'Soil Report Discussion', scheduled: 'Tomorrow, 10:00 AM', status: 'Confirmed', agent: 'John', location: 'Bathinda' },
    { id: 'CB-298', farmer: 'Amit Verma', phone: '+91 97654 32100', type: 'Order Issue', scheduled: 'Tomorrow, 2:00 PM', status: 'Pending', agent: 'Unassigned', location: 'Khanna' },
    { id: 'CB-297', farmer: 'Balwinder', phone: '+91 99887 65432', type: 'General Inquiry', scheduled: 'Yesterday, 11:00 AM', status: 'Completed', agent: 'Priya', location: 'Ludhiana' },
];

const statusStyle = {
    'Pending': 'bg-amber-100 text-amber-700',
    'Confirmed': 'bg-green-100 text-green-700',
    'Completed': 'bg-slate-100 text-slate-500',
};

const BookingManagement = () => {
    return (
        <div className="max-w-[1400px] mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-black text-slate-800">Call Bookings</h1>
                <p className="text-sm text-slate-500 font-medium mt-1">Manage scheduled farmer callbacks and consultations</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 border-b-4 border-b-amber-400">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pending Today</p>
                    <p className="text-3xl font-black text-slate-800">2</p>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 border-b-4 border-b-green-500">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Confirmed</p>
                    <p className="text-3xl font-black text-slate-800">2</p>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 border-b-4 border-b-slate-300">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Completed This Week</p>
                    <p className="text-3xl font-black text-slate-800">12</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-[10px] uppercase tracking-widest font-bold text-slate-400">
                                <th className="p-4 pl-6">ID</th>
                                <th className="p-4">Farmer</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Scheduled</th>
                                <th className="p-4">Agent</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {bookings.map(b => (
                                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 pl-6 font-black text-[#1a5632]">#{b.id}</td>
                                    <td className="p-4">
                                        <p className="font-semibold text-slate-700">{b.farmer}</p>
                                        <p className="text-xs text-slate-400">{b.phone}</p>
                                    </td>
                                    <td className="p-4 text-slate-600 font-medium">{b.type}</td>
                                    <td className="p-4 text-slate-600 font-medium">{b.scheduled}</td>
                                    <td className="p-4 text-slate-600 font-medium">{b.agent}</td>
                                    <td className="p-4"><span className={`text-[10px] font-bold px-2 py-1 rounded ${statusStyle[b.status]}`}>{b.status}</span></td>
                                    <td className="p-4 pr-6">
                                        <div className="flex gap-1">
                                            <button className="p-1.5 hover:bg-green-50 rounded-lg text-green-600"><CheckCircle2 size={14} /></button>
                                            <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-400"><XCircle size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BookingManagement;
