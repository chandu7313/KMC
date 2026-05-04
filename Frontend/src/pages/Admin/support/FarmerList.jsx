import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, Phone, Mail, MapPin, ShoppingBag, Ticket } from "lucide-react";

const FarmerList = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${backendUrl}/api/support/farmers?page=${page}&search=${search}`);
        if (data.success) { setFarmers(data.farmers); setTotal(data.total); setTotalPages(data.totalPages); }
      } catch {
        setFarmers([
          { id: '1', name: 'Rajesh Kumar', phone: '+919876543210', email: 'rajesh@gmail.com', district: 'Warangal', language: 'te', createdAt: '2026-01-15', orderCount: 12, ticketCount: 3 },
          { id: '2', name: 'Suresh Reddy', phone: '+919876543211', email: 'suresh@gmail.com', district: 'Karimnagar', language: 'te', createdAt: '2026-02-20', orderCount: 8, ticketCount: 1 },
          { id: '3', name: 'Lakshmi Devi', phone: '+919876543212', email: 'lakshmi@gmail.com', district: 'Nizamabad', language: 'hi', createdAt: '2025-11-10', orderCount: 25, ticketCount: 5 },
          { id: '4', name: 'Ramesh Goud', phone: '+919876543213', email: 'ramesh@gmail.com', district: 'Nalgonda', language: 'te', createdAt: '2026-03-01', orderCount: 4, ticketCount: 0 },
        ]);
        setTotal(156); setTotalPages(7);
      } finally { setLoading(false); }
    };
    fetch();
  }, [page, search, backendUrl]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-white">Farmers</h1>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400">{total}</span>
        </div>
        <div className="relative min-w-[250px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search farmers..." className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-800/50 rounded-lg text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {loading ? (
          <div className="col-span-full flex items-center justify-center h-48"><div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : farmers.map(farmer => (
          <div key={farmer.id} onClick={() => navigate(`/admin/support/farmers/${farmer.id}`)}
            className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 hover:border-emerald-500/20 transition-all cursor-pointer group">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-emerald-400 text-sm font-bold shrink-0">
                {farmer.name?.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">{farmer.name}</h3>
                <div className="space-y-1 mt-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400"><Phone size={11} />{farmer.phone}</div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400"><Mail size={11} />{farmer.email || '—'}</div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400"><MapPin size={11} />{farmer.district || '—'}</div>
                </div>
                <div className="flex gap-3 mt-3">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500"><ShoppingBag size={10} />{farmer.orderCount} orders</div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500"><Ticket size={10} />{farmer.ticketCount} tickets</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between px-2">
        <p className="text-xs text-slate-500">Page {page} of {totalPages}</p>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage(p => p-1)} className="p-1.5 rounded-lg border border-slate-700/50 text-slate-400 disabled:opacity-30"><ChevronLeft size={14} /></button>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p+1)} className="p-1.5 rounded-lg border border-slate-700/50 text-slate-400 disabled:opacity-30"><ChevronRight size={14} /></button>
        </div>
      </div>
    </div>
  );
};

export default FarmerList;
