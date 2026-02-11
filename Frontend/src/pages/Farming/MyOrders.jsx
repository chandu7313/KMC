import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { Package, Truck, CheckCircle, Clock, XCircle, ShoppingBag, ArrowLeft } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const MyOrders = () => {
    const { backendUrl, userData, navigate } = useContext(AppContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.get(backendUrl + '/api/fertilizer/user-orders');
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
            <div className="pt-28 pb-20 px-6 max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Orders</h1>
                        <p className="text-slate-500 font-medium">Track your fertilizer deliveries</p>
                    </div>
                    <button onClick={() => navigate('/fertilizers')} className="flex items-center gap-2 text-emerald-600 font-bold hover:gap-3 transition-all">
                        <ArrowLeft size={18} /> Back to Store
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-[32px] p-20 text-center shadow-sm border border-slate-100 space-y-4">
                        <ShoppingBag size={64} className="mx-auto text-slate-100" />
                        <h2 className="text-xl font-bold text-slate-800">No orders found</h2>
                        <p className="text-slate-400">You haven't purchased any fertilizers yet.</p>
                        <button onClick={() => navigate('/fertilizers')} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all">
                            Shop Now
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={order._id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all">
                                <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6 border-b border-slate-50">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Order ID</div>
                                        <div className="font-bold text-slate-900 text-sm">#{order._id.slice(-8).toUpperCase()}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Order Date</div>
                                        <div className="font-bold text-slate-900 text-sm">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Amount</div>
                                        <div className="font-bold text-emerald-600 text-xl">₹{order.totalAmount}</div>
                                    </div>
                                    <div className="flex items-center">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 md:p-8 bg-slate-50/50">
                                    <div className="space-y-4">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-white p-2 border border-slate-100">
                                                    <img src={item.fertilizerId?.image} className="w-full h-full object-contain" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-slate-800 text-sm">{item.fertilizerId?.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase">Qty: {item.quantity} × ₹{item.price}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-slate-200">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 text-right">Delivery Address</div>
                                        <p className="text-xs text-slate-600 font-medium text-right max-w-md ml-auto leading-relaxed">{order.address}</p>
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

export default MyOrders;
