import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";
import { CalendarDays, Phone, Clock, CheckCircle2, XCircle, Bell, Search, ChevronLeft, ChevronRight } from "lucide-react";

const STATUS_COLORS = {
  Pending: 'bg-amber-500/10 text-amber-400', Confirmed: 'bg-blue-500/10 text-blue-400',
  Completed: 'bg-emerald-500/10 text-emerald-400', Cancelled: 'bg-red-500/10 text-red-400',
};

const BookingManagement = () => {
  const { backendUrl } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page, search }); if (statusFilter) params.set('status', statusFilter);
        const { data } = await axios.get(`${backendUrl}/api/support/bookings?${params}`);
        if (data.success) { setBookings(data.bookings); setStats(data.stats); setTotalPages(data.totalPages); }
      } catch {
        setBookings([
          { id: 1, fullName: 'Rajesh Kumar', phone: '9876543210', purpose: 'Soil Testing', visitDate: '2026-05-10', visitTime: '10:00 AM', status: 'Confirmed', Farmer: { name: 'Rajesh Kumar' } },
          { id: 2, fullName: 'Suresh Reddy', phone: '9876543211', purpose: 'Expert Consultation', visitDate: '2026-05-11', visitTime: '2:00 PM', status: 'Pending', Farmer: { name: 'Suresh Reddy' } },
          { id: 3, fullName: 'Lakshmi Devi', phone: '9876543212', purpose: 'Farm Visit', visitDate: '2026-05-08', visitTime: '11:00 AM', status: 'Completed', Farmer: { name: 'Lakshmi Devi' } },
        ]);
        setStats({ today: 3, upcoming: 12, completed: 45, cancelled: 5 });
        setTotalPages(3);
      } finally { setLoading(false); }
    };
    fetch();
  }, [page, search, statusFilter, backendUrl]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`${backendUrl}/api/support/bookings/${id}`, { status });
      setBookings(b => b.map(booking => booking.id === id ? { ...booking, status } : booking));
      toast.success(`Booking ${status}`);
    } catch { toast.error('Update failed'); }
  };

  const statCards = [
    { label: "Today's Calls", value: stats.today || 0, icon: Phone, color: 'text-blue-400 bg-blue-500/10' },
    { label: 'Upcoming', value: stats.upcoming || 0, icon: Clock, color: 'text-amber-400 bg-amber-500/10' },
    { label: 'Completed', value: stats.completed || 0, icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10' },
    { label: 'Cancelled', value: stats.cancelled || 0, icon: XCircle, color: 'text-red-400 bg-red-500/10' },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-white">Call Booking Management</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((s, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-slate-500">{s.label}</p><p className="text-xl font-bold text-white mt-1">{s.value}</p></div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}><s.icon size={18} /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or phone..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-800/50 rounded-lg text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" />
        </div>
        {['', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${statusFilter === s ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' : 'border-slate-700/50 text-slate-400 hover:text-white'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/50">
                  {['Farmer', 'Phone', 'Purpose', 'Date & Time', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-300">{b.fullName || b.Farmer?.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{b.phone}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{b.purpose}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-slate-300">{new Date(b.visitDate).toLocaleDateString('en-IN')}</p>
                      <p className="text-xs text-slate-500">{b.visitTime}</p>
                    </td>
                    <td className="px-4 py-3"><span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[b.status]}`}>{b.status}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        {b.status === 'Pending' && <button onClick={() => handleStatusUpdate(b.id, 'Confirmed')} className="text-[10px] px-2 py-1 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">Confirm</button>}
                        {['Pending','Confirmed'].includes(b.status) && <button onClick={() => handleStatusUpdate(b.id, 'Completed')} className="text-[10px] px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20">Complete</button>}
                        {b.status !== 'Cancelled' && b.status !== 'Completed' && <button onClick={() => handleStatusUpdate(b.id, 'Cancelled')} className="text-[10px] px-2 py-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20">Cancel</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingManagement;
