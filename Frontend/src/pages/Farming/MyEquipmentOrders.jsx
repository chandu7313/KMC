import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { Settings, Truck, CheckCircle, Clock, XCircle, ShoppingBag, ArrowLeft, ExternalLink } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const MyEquipmentOrders = () => {
    const { backendUrl, userData, navigate } = useContext(AppContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.get(`${backendUrl}/api/equipment/user-orders`);
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userData) {
            fetchOrders();
        } else {
            navigate('/login');
        }
    }, [userData]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Cancelled': return 'bg-rose-50 text-rose-500 border-rose-100';
            case 'Shipped': return 'bg-blue-50 text-blue-600 border-blue-100';
            default: return 'bg-amber-50 text-amber-600 border-amber-100';
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />
            <div className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 text-green-700 font-black text-[10px] uppercase tracking-widest mb-2 bg-green-50 px-3 py-1 rounded-full">
                            <Truck size={12} /> Machinery Logistics
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Equipment Purchases</h1>
                        <p className="text-slate-500 font-medium mt-1">Track your machinery deliveries and maintenance</p>
                    </div>
                    <button onClick={() => navigate('/equipments')} className="group flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-slate-200 text-slate-900 font-black text-sm hover:border-green-600 hover:text-green-700 transition-all shadow-sm">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Store Catalog
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <div className="w-12 h-12 border-4 border-slate-100 border-t-green-700 rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Loading Records...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-[48px] p-24 text-center shadow-sm border border-slate-100 space-y-8 flex flex-col items-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
                            <ShoppingBag size={48} className="text-slate-200" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-slate-800">No machinery found</h2>
                            <p className="text-slate-400 font-medium">You haven't purchased any equipments yet.</p>
                        </div>
                        <button onClick={() => navigate('/equipments')} className="bg-slate-900 text-white px-10 py-4 rounded-[40px] font-black text-sm shadow-2xl shadow-slate-200 hover:bg-green-700 transition-all active:scale-95 flex items-center gap-3">
                            Check Catalog <ExternalLink size={18}/>
                        </button>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {orders.map(order => (
                            <div key={order._id} className="bg-white rounded-[48px] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                                <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between gap-10 border-b border-slate-50 bg-slate-50/50">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-10 flex-1">
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deployment ID</div>
                                            <div className="font-bold text-slate-900 text-sm">#{order._id ? order._id.slice(-8).toUpperCase() : 'N/A'}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Purchase Date</div>
                                            <div className="font-bold text-slate-900 text-sm">{order.createdAt ? new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A'}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</div>
                                            <div className="flex items-center">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                                                    {order.status || 'Pending'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end justify-center">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Value</div>
                                        <div className="font-black text-slate-900 text-4xl">₹{order.totalAmount?.toLocaleString() || 0}</div>
                                    </div>
                                </div>
                                <div className="p-8 md:p-12">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                        <div className="space-y-6">
                                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 border-l-4 border-green-700 pl-4 mb-8">Included Machinery</h3>
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-6 bg-slate-50 p-6 rounded-[32px] border border-slate-100 group-hover:bg-white transition-colors">
                                                    <div className="w-20 h-20 rounded-2xl bg-white p-3 border border-slate-100 shadow-sm flex-shrink-0">
                                                        <img src={item.equipmentId?.image} className="w-full h-full object-contain" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-black text-slate-900 text-lg">{item.equipmentId?.name}</div>
                                                        <div className="text-xs text-slate-400 font-bold uppercase mt-1">Quantity: {item.quantity} × ₹{item.price.toLocaleString()}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="lg:border-l lg:border-slate-100 lg:pl-12 flex flex-col justify-end">
                                            <div className="p-8 rounded-[40px] bg-slate-900 text-white space-y-4">
                                                <div className="flex items-center gap-3 text-green-400 text-[10px] font-black uppercase tracking-widest">
                                                    <Truck size={16} /> Delivery Destination
                                                </div>
                                                <p className="text-slate-200 font-medium leading-relaxed">{order.address}</p>
                                                <div className="pt-4 flex gap-4">
                                                    <div className="bg-white/10 px-4 py-3 rounded-2xl flex-1 text-center">
                                                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Estimated</div>
                                                        <div className="text-xs font-bold leading-none mt-1">3-5 Biz Days</div>
                                                    </div>
                                                    <div className="bg-white/10 px-4 py-3 rounded-2xl flex-1 text-center">
                                                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Courier</div>
                                                        <div className="text-xs font-bold leading-none mt-1">AgriLogistics</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default MyEquipmentOrders;
