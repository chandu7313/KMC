
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { 
    Package, 
    Truck, 
    Clock, 
    XCircle, 
    ShoppingBag, 
    ArrowLeft, 
    Filter, 
    ArrowRight, 
    CheckCircle2, 
    HelpCircle, 
    RefreshCw, 
    ShieldCheck 
} from 'lucide-react';
import Navbar from '../../layouts/components/Navbar';

const MyOrders = () => {
    const navigate = useNavigate();
    const { backendUrl, userData, loading: authLoading } = useContext(AppContext);
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');
    
    // Cancellation Modal State
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [cancelReason, setCancelReason] = useState("");
    const [customReason, setCustomReason] = useState("");
    
    const FILTERS = ['All', 'Fertilizers', 'Equipments', 'Seeds', 'Pesticides'];

    const CANCEL_REASONS = [
        "Ordered by mistake",
        "Found a better price elsewhere",
        "Delivery time is too long",
        "Need to change shipping address",
        "Other"
    ];

    const fetchAllOrders = async () => {
        try {
            setLoading(true);
            axios.defaults.withCredentials = true;
            
            // Fetch Marketplace Orders
            const marketplaceRes = await axios.post(backendUrl + '/api/order/userorders', { userId: userData.id });
            
            // Fetch Equipment Orders
            const equipmentRes = await axios.get(backendUrl + '/api/equipment/user-orders');

            // Fetch Fertilizer Orders
            const fertilizerRes = await axios.get(backendUrl + '/api/fertilizer/user-orders');

            let allOrders = [];

            if (marketplaceRes.data.success) {
                const marketplaceOrders = marketplaceRes.data.orders.map(order => ({
                    ...order,
                    orderType: 'Marketplace'
                }));
                allOrders = [...allOrders, ...marketplaceOrders];
            }

            if (equipmentRes.data.success) {
                const equipmentOrders = equipmentRes.data.orders.map(order => ({
                    ...order,
                    orderType: 'Equipment'
                }));
                allOrders = [...allOrders, ...equipmentOrders];
            }

            if (fertilizerRes.data.success) {
                const fertilizerOrders = fertilizerRes.data.orders.map(order => ({
                    ...order,
                    orderType: 'Fertilizer'
                }));
                allOrders = [...allOrders, ...fertilizerOrders];
            }

            // Sort by newest first
            const sortedOrders = allOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setOrders(sortedOrders);
            setFilteredOrders(sortedOrders);
            
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            if (userData) {
                fetchAllOrders();
            } else {
                navigate('/login');
            }
        }
    }, [userData, authLoading]);

    useEffect(() => {
        if (activeFilter === 'All') {
            setFilteredOrders(orders);
        } else {
            const filtered = orders.filter(order => {
                return order.items.some(item => {
                    const productCategory = item.fertilizerId?.category || item.equipmentId?.category || item.productId?.category || '';
                    return productCategory.toLowerCase() === activeFilter.toLowerCase();
                });
            });
            setFilteredOrders(filtered);
        }
    }, [activeFilter, orders]);

    const handleCancelOrder = async () => {
        if(!cancelReason) {
            toast.error("Please select a cancellation reason");
            return;
        }
        
        const finalReason = cancelReason === 'Other' ? customReason : cancelReason;
        
        if(cancelReason === 'Other' && !finalReason.trim()) {
            toast.error("Please write your reason");
            return;
        }

        try {
            const endpoint = selectedOrder.orderType === 'Equipment' 
                ? '/api/equipment/cancel-order' 
                : '/api/order/cancel';

            const { data } = await axios.post(backendUrl + endpoint, {
                userId: userData.id,
                orderId: selectedOrder.id,
                reason: finalReason
            });

            if (data.success) {
                toast.success("Order cancelled");
                setIsCancelModalOpen(false);
                setCancelReason("");
                setCustomReason("");
                setSelectedOrder(null);
                fetchAllOrders();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Shipped': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Processing': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'Cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const getExpectedDelivery = (date) => {
        const d = new Date(date);
        d.setDate(d.getDate() + 7);
        return d.toLocaleDateString(undefined, { dateStyle: 'medium' });
    };

    const TrackingStepper = ({ status }) => {
        const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
        const currentStep = steps.indexOf(status);
        
        if (status === 'Cancelled') return null;

        return (
            <div className="pt-8 pb-4">
                <div className="relative px-2">
                    {/* Connecting Lines */}
                    <div className="absolute top-[11px] left-6 right-6 h-1 bg-slate-100 rounded-full">
                        <div 
                            className="h-full bg-emerald-500 transition-all duration-1000 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" 
                            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                        ></div>
                    </div>
                    
                    {/* Step Icons and Labels */}
                    <div className="flex items-center justify-between relative z-10">
                        {steps.map((step, idx) => {
                            const isCompleted = idx < currentStep;
                            const isCurrent = idx === currentStep;
                            const isPast = idx <= currentStep;

                            return (
                                <div key={step} className="flex flex-col items-center gap-2">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 border-2 bg-white ${
                                        isPast ? 'border-emerald-500 text-emerald-500' : 'border-slate-100 text-slate-300'
                                    } ${isCompleted ? 'bg-emerald-500 !text-white' : ''} ${isCurrent ? 'ring-4 ring-emerald-500/10 scale-110' : ''}`}>
                                        {isCompleted ? <CheckCircle2 size={12} strokeWidth={3} /> : 
                                         idx === 0 ? <Clock size={12} /> :
                                         idx === 1 ? <Package size={12} /> :
                                         idx === 2 ? <Truck size={12} /> :
                                         idx === 3 ? <ShieldCheck size={12} /> :
                                         null}
                                    </div>
                                    <span className={`text-[7px] md:text-[9px] font-black uppercase tracking-widest ${
                                        isPast ? 'text-emerald-700' : 'text-slate-400'
                                    }`}>{step}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="w-12 h-12 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />
            <div className="pt-24 pb-20 px-3 md:px-6 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">My Purchases</h1>
                        <p className="text-[10px] md:text-sm text-slate-500 font-medium tracking-tight">Track all your farming orders in one place</p>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                    {FILTERS.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 md:px-6 py-2 rounded-full text-[9px] md:text-xs font-black uppercase tracking-widest transition-all border whitespace-nowrap shadow-sm
                                ${activeFilter === filter 
                                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-100' 
                                    : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-200 hover:text-emerald-600'}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin"></div>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-[24px] md:rounded-[32px] p-12 md:p-20 text-center shadow-sm border border-slate-100 space-y-4">
                        <ShoppingBag size={48} className="mx-auto text-slate-100" />
                        <h2 className="text-lg md:text-xl font-bold text-slate-800">No orders found</h2>
                        <p className="text-xs md:text-sm text-slate-400">Try changing your filter or visit the store.</p>
                        <button onClick={() => navigate('/marketplace')} className="bg-emerald-600 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all text-xs md:text-base">
                            Visit Store
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:gap-6">
                        {filteredOrders.map(order => (
                            <div key={order.id} className="bg-white rounded-[20px] md:rounded-[32px] overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all">
                                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-50">
                                    {/* Left Side: Order Items */}
                                    <div className="flex-1 p-4 md:p-6 space-y-4">
                                        <div className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Items Purchased</div>
                                        <div className="space-y-3">
                                            {order.items.map((item, idx) => {
                                                const product = item.fertilizerId || item.equipmentId || item.productId;
                                                return (
                                                    <div key={idx} className="flex items-center gap-4 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-50 transition-all hover:bg-white hover:border-emerald-100">
                                                        <div className="w-16 h-16 md:w-28 md:h-28 rounded-xl bg-white p-2 flex-shrink-0 shadow-sm">
                                                            <img src={product?.image || (product?.images && product?.images[0])} className="w-full h-full object-contain" alt={product?.name} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-black text-slate-900 text-[10px] md:text-sm mb-1 leading-tight">{product?.name}</div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[8px] md:text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">Qty: {item.quantity}</span>
                                                                <span className="text-[9px] md:text-xs font-bold text-slate-300 italic">× ₹{item.price?.toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        
                                        {/* Tracking Stepper */}
                                        <TrackingStepper status={order.status} />
                                    </div>

                                    {/* Right Side: Order Info */}
                                    <div className="w-full md:w-[280px] lg:w-[340px] p-4 md:p-6 bg-slate-50/30 space-y-5">
                                        {/* Status & Cancel */}
                                        <div className="flex items-center justify-between gap-3">
                                            <span className={`px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                                                {order.status}
                                            </span>
                                            {order.status === 'Pending' && (
                                                <button 
                                                    onClick={() => { setSelectedOrder(order); setIsCancelModalOpen(true); }}
                                                    className="bg-white border border-rose-100 text-rose-400 hover:text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all gap-1.5 flex items-center shadow-sm opacity-80 hover:opacity-100"
                                                >
                                                    <XCircle size={10} /> Cancel
                                                </button>
                                            )}
                                        </div>

                                        {/* Metadata Grid */}
                                        <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100/50">
                                            <div className="space-y-0.5">
                                                <div className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Order ID</div>
                                                <div className="font-bold text-slate-900 text-[10px] md:text-xs truncate">#{order.id.slice(-8).toUpperCase()}</div>
                                            </div>
                                            <div className="space-y-0.5">
                                                <div className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</div>
                                                <div className="font-bold text-slate-900 text-[10px] md:text-xs">{new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}</div>
                                            </div>
                                            <div className="space-y-0.5">
                                                <div className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</div>
                                                <div className="font-black text-emerald-600 text-sm md:text-base">₹{order.total_amount?.toLocaleString()}</div>
                                            </div>
                                            <div className="space-y-0.5">
                                                <div className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Expected Delivery</div>
                                                <div className="font-bold text-slate-900 text-[10px] md:text-xs">
                                                    {order.status === 'Delivered' ? 'Delivered' : getExpectedDelivery(order.created_at)}
                                                </div>
                                            </div>
                                            <div className="space-y-0.5">
                                                <div className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Payment Mode</div>
                                                <div className="text-[8px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                                    {order.payment_method === 'COD' ? 'Cash on Delivery' : 'Online Paid'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Delivery Info */}
                                        <div className="space-y-2">
                                            <div className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Delivery Address</div>
                                            <p className="text-[9px] md:text-[11px] text-slate-500 font-medium leading-relaxed bg-white/50 p-3 rounded-xl border border-slate-100">{order.address}</p>
                                        </div>

                                        {order.status === 'Cancelled' && order.cancellationReason && (
                                            <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-100 mt-2">
                                                <div className="text-[7px] md:text-[8px] font-black text-rose-400 uppercase tracking-widest mb-1">Cancellation Reason</div>
                                                <p className="text-[9px] md:text-[10px] font-semibold text-rose-600 line-clamp-2">{order.cancellationReason}</p>
                                            </div>
                                        )}

                                        {/* Quick Actions */}
                                        <div className="flex gap-2 pt-2">
                                            <button 
                                                onClick={() => navigate('/marketplace')}
                                                className="flex-1 bg-white border border-slate-200 text-slate-600 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                                            >
                                                <RefreshCw size={12} /> Reorder
                                            </button>
                                            <button 
                                                onClick={() => navigate('/contact')}
                                                className="flex-1 bg-white border border-slate-200 text-slate-600 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                                            >
                                                <HelpCircle size={12} /> Support
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Cancel Order Modal */}
            {isCancelModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsCancelModalOpen(false)}></div>
                    <div className="bg-white rounded-[32px] p-8 max-w-md w-full relative z-10 shadow-2xl border border-slate-100 animate-in zoom-in duration-300">
                         <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-6 text-rose-500">
                             <XCircle size={32} />
                         </div>
                         <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Step Cancel Request</h3>
                         <p className="text-sm font-medium text-slate-500 mb-6">Please tell us why you are cancelling. This cannot be undone.</p>
                         
                         <div className="space-y-3 mb-6">
                             {CANCEL_REASONS.map(reason => (
                                 <label key={reason} className={`block p-4 border rounded-2xl cursor-pointer transition-colors ${cancelReason === reason ? 'border-rose-500 bg-rose-50/30 font-black text-rose-700' : 'border-slate-100 hover:border-slate-300 font-medium text-slate-700'}`}>
                                     <div className="flex items-center gap-3">
                                         <input 
                                             type="radio" 
                                             name="cancelReason" 
                                             value={reason}
                                             checked={cancelReason === reason}
                                             onChange={(e) => setCancelReason(e.target.value)}
                                             className="accent-rose-500"
                                         />
                                         <span className="text-sm">{reason}</span>
                                     </div>
                                 </label>
                             ))}
                         </div>

                         {cancelReason === 'Other' && (
                             <div className="mb-6">
                                 <textarea
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 resize-none transition-all placeholder:text-slate-400"
                                    rows="3"
                                    placeholder="Please elaborate on your reason..."
                                    value={customReason}
                                    onChange={(e) => setCustomReason(e.target.value)}
                                 ></textarea>
                             </div>
                         )}

                         <div className="flex gap-4">
                             <button 
                                onClick={() => setIsCancelModalOpen(false)}
                                className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-2xl hover:bg-slate-50 transition-colors"
                             >
                                 Keep Order
                             </button>
                             <button 
                                onClick={handleCancelOrder}
                                className="flex-1 bg-rose-500 text-white font-black py-4 rounded-2xl hover:bg-rose-600 shadow-xl shadow-rose-100 transition-all active:scale-95"
                             >
                                 Confirm
                             </button>
                         </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOrders;
