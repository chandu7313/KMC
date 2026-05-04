import React from 'react';
import { FileText, Copy, Edit2, Trash2 } from 'lucide-react';

const templates = [
    { id: 1, title: 'Order Delay Apology', category: 'Delivery', lang: 'English', lastUsed: '2h ago', usage: 45 },
    { id: 2, title: 'Payment Refund Confirmation', category: 'Payment', lang: 'English', lastUsed: '5h ago', usage: 32 },
    { id: 3, title: 'Soil Report Ready Notification', category: 'Soil Test', lang: 'Hindi', lastUsed: '1d ago', usage: 28 },
    { id: 4, title: 'Expert Callback Scheduled', category: 'Expert', lang: 'English', lastUsed: '3d ago', usage: 21 },
    { id: 5, title: 'Product Exchange Instructions', category: 'Order Issues', lang: 'English', lastUsed: '5d ago', usage: 18 },
    { id: 6, title: 'General Welcome Message', category: 'General', lang: 'Hindi', lastUsed: '1w ago', usage: 56 },
];

const Templates = () => (
    <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-black text-slate-800">Templates</h1>
                <p className="text-sm text-slate-500 font-medium mt-1">Quick-reply templates for common farmer queries</p>
            </div>
            <button className="flex items-center gap-2 bg-[#1a5632] hover:bg-[#145028] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
                <FileText size={16} /> New Template
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {templates.map(t => (
                <div key={t.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-slate-800">{t.title}</h3>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500">{t.category}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium mb-4">Language: {t.lang} • Used {t.usage} times • Last: {t.lastUsed}</p>
                    <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-600 transition-colors"><Copy size={12} /> Copy</button>
                        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-600 transition-colors"><Edit2 size={12} /> Edit</button>
                        <button className="p-2 bg-slate-50 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default Templates;
