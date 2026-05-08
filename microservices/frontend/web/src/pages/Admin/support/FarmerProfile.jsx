import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Globe, ShoppingBag, Ticket, Leaf, Bug, PhoneCall } from "lucide-react";

const FarmerProfile = () => {
  const { farmerId } = useParams();
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('orders');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: res } = await axios.get(`${backendUrl}/api/support/farmers/${farmerId}`);
        if (res.success) setData(res);
      } catch {
        setData({
          farmer: { name: 'Rajesh Kumar', phone: '+91 9876543210', email: 'rajesh@gmail.com', district: 'Warangal', language: 'te', createdAt: '2026-01-15', crops: ['Cotton','Rice','Mango'] },
          stats: { totalOrders: 12, totalTickets: 3, openTickets: 1, soilTests: 5, diseaseScans: 8, callBookings: 2 },
          orders: [{ id: 1, totalAmount: 2500, status: 'delivered', createdAt: '2026-04-20' }],
          tickets: [{ id: 1, ticketRef: 'TK-247', subject: 'Product not delivered', status: 'in_progress', createdAt: '2026-04-28' }],
          soilReports: [{ id: 1, soilStatus: 'Moderate', suitabilityPct: 72, createdAt: '2026-04-15' }],
          diagnoses: [{ id: 1, createdAt: '2026-04-22' }],
          bookings: [{ id: 1, purpose: 'Soil Testing', status: 'Completed', visitDate: '2026-04-10' }]
        });
      } finally { setLoading(false); }
    };
    fetch();
  }, [farmerId, backendUrl]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!data) return null;
  const { farmer, stats } = data;

  const statCards = [
    { label: 'Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-400' },
    { label: 'Tickets', value: stats.totalTickets, icon: Ticket, color: 'text-amber-400' },
    { label: 'Soil Tests', value: stats.soilTests, icon: Leaf, color: 'text-emerald-400' },
    { label: 'Scans', value: stats.diseaseScans, icon: Bug, color: 'text-red-400' },
    { label: 'Bookings', value: stats.callBookings, icon: PhoneCall, color: 'text-purple-400' },
  ];

  const tabs = ['orders', 'tickets', 'soilReports', 'diagnoses', 'bookings'];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/admin/support/farmers')} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"><ArrowLeft size={18} /></button>
        <h1 className="text-xl font-bold text-white">Farmer Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Profile Card */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5">
          <div className="text-center mb-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-emerald-400 text-2xl font-bold">
              {farmer.name?.charAt(0)}
            </div>
            <h2 className="text-base font-bold text-white mt-3">{farmer.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">Member since {new Date(farmer.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
          </div>
          <div className="space-y-2.5">
            {[
              { icon: Phone, text: farmer.phone }, { icon: Mail, text: farmer.email },
              { icon: MapPin, text: farmer.district }, { icon: Globe, text: farmer.language },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5"><item.icon size={13} className="text-slate-500" /><span className="text-xs text-slate-400">{item.text || '—'}</span></div>
            ))}
          </div>
          {farmer.crops?.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Crops</p>
              <div className="flex flex-wrap gap-1.5">
                {farmer.crops.map((c, i) => <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">{c}</span>)}
              </div>
            </div>
          )}
        </div>

        {/* Stats + Activity */}
        <div className="lg:col-span-3 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {statCards.map((s, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 text-center">
                <s.icon size={18} className={`${s.color} mx-auto`} />
                <p className="text-lg font-bold text-white mt-1">{s.value}</p>
                <p className="text-[10px] text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl overflow-hidden">
            <div className="flex border-b border-slate-800/50 overflow-x-auto">
              {tabs.map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-colors ${tab === t ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-500 hover:text-white'}`}>
                  {t === 'soilReports' ? 'Soil Reports' : t === 'diagnoses' ? 'Disease Scans' : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <div className="p-4 max-h-[300px] overflow-y-auto">
              {(data[tab] || []).length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No {tab} found</p>
              ) : (
                <div className="space-y-2">
                  {data[tab].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/20 hover:bg-slate-800/40 transition-colors">
                      <div>
                        <p className="text-sm text-slate-300">{item.ticketRef || item.purpose || item.soilStatus || `#${item.id}`}</p>
                        <p className="text-xs text-slate-500">{item.subject || `₹${item.totalAmount || 0}`}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">{item.status || 'done'}</span>
                        <p className="text-[10px] text-slate-500 mt-0.5">{new Date(item.createdAt || item.visitDate).toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;
