import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2, Search, Upload, Package, ShoppingBag, XCircle, DollarSign, Database, Tag } from 'lucide-react';

const FertilizerManagement = () => {
    const { backendUrl } = useContext(AppContext);
    const [fertilizers, setFertilizers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'orders'
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: ''
    });

    const fetchFertilizers = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.get(backendUrl + '/api/fertilizer/admin-list');
            if (data.success) {
                setFertilizers(data.fertilizers);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const fetchOrders = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.get(backendUrl + '/api/fertilizer/admin-orders');
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchFertilizers();
        fetchOrders();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const fd = new FormData();
            Object.keys(formData).forEach(key => fd.append(key, formData[key]));
            if (image) fd.append('image', image);

            axios.defaults.withCredentials = true;
            let res;
            if (editMode) {
                res = await axios.put(`${backendUrl}/api/fertilizer/update/${selectedId}`, fd);
            } else {
                res = await axios.post(`${backendUrl}/api/fertilizer/add`, fd);
            }

            if (res.data.success) {
                toast.success(res.data.message);
                setShowModal(false);
                fetchFertilizers();
                resetForm();
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this fertilizer?")) return;
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.delete(`${backendUrl}/api/fertilizer/delete/${id}`);
            if (data.success) {
                toast.success(data.message);
                fetchFertilizers();
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(`${backendUrl}/api/fertilizer/update-status`, { orderId, status: newStatus });
            if (data.success) {
                toast.success(data.message);
                fetchOrders();
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', price: '', category: '', stock: '' });
        setImage(false);
        setEditMode(false);
        setSelectedId(null);
    };

    const openEdit = (item) => {
        setEditMode(true);
        setSelectedId(item._id);
        setFormData({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            stock: item.stock
        });
        setShowModal(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Fertilizer Management</h1>
                    <p className="text-slate-500 text-sm italic">Inventory and Sales Tracking</p>
                </div>
                {activeTab === 'inventory' && (
                    <button 
                        onClick={() => { resetForm(); setShowModal(true); }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-95"
                    >
                        <Plus size={18} /> Add Fertilizer
                    </button>
                )}
            </div>

            <div className="flex gap-4 border-b border-slate-100">
                <button onClick={() => setActiveTab('inventory')} className={`pb-3 px-2 text-sm font-bold transition-all ${activeTab === 'inventory' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>
                    Inventory
                </button>
                <button onClick={() => setActiveTab('orders')} className={`pb-3 px-2 text-sm font-bold transition-all ${activeTab === 'orders' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>
                    Orders {orders.filter(o => o.status === 'Pending').length > 0 && <span className="ml-1 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{orders.filter(o => o.status === 'Pending').length}</span>}
                </button>
            </div>

            {activeTab === 'inventory' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {fertilizers.map(item => (
                        <div key={item._id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                            <div className="relative h-48 bg-slate-50">
                                <img src={item.image} alt={item.name} className="w-full h-full object-contain p-4" />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold shadow-sm border border-slate-100">
                                    {item.category}
                                </div>
                            </div>
                            <div className="p-5 space-y-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-slate-800 line-clamp-1">{item.name}</h3>
                                    <div className="text-emerald-600 font-bold">₹{item.price}</div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Database size={12} />
                                    <span>Stock: <span className={`font-bold ${item.stock < 10 ? 'text-rose-500' : 'text-slate-700'}`}>{item.stock}</span> units</span>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button onClick={() => openEdit(item)} className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors flex-1 flex justify-center"><Edit2 size={16}/></button>
                                    <button onClick={() => handleDelete(item._id)} className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-lg transition-colors flex-1 flex justify-center"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {fertilizers.length === 0 && <div className="col-span-full py-20 text-center text-slate-300">No products found.</div>}
                </div>
            ) : (
                <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <th className="px-6 py-4">Farmer</th>
                                <th className="px-6 py-4">Items</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-slate-600">
                            {orders.map(order => (
                                <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-800">{order.userId?.name}</div>
                                        <div className="text-[10px]">{order.userId?.phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs space-y-0.5">
                                            {order.items.map((it, idx) => (
                                                <div key={idx}>{it.fertilizerId?.name} x {it.quantity}</div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900">₹{order.totalAmount}</td>
                                    <td className="px-6 py-4">
                                        <select 
                                            value={order.status} 
                                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                            className={`text-[10px] font-bold px-3 py-1.5 rounded-full border-none outline-none ${
                                                order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 
                                                order.status === 'Cancelled' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-600'
                                            }`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-right text-[10px] font-medium text-slate-400">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {orders.length === 0 && <div className="p-20 text-center text-slate-300">No orders placed yet.</div>}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-300">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-xl font-bold text-slate-900">{editMode ? 'Edit Product' : 'Add Product'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white rounded-full transition-colors"><XCircle className="text-slate-400" /></button>
                        </div>
                        
                        <form onSubmit={handleSave} className="p-8 space-y-5">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Product Name</label>
                                <div className="relative">
                                    <Package className="absolute left-4 top-3 text-slate-400" size={16} />
                                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium" 
                                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. NPK Fertilizer" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Price (₹)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-3 text-slate-400" size={16} />
                                        <input required type="number" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium" 
                                            value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0.00" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Category</label>
                                    <div className="relative">
                                        <Tag className="absolute left-4 top-3 text-slate-400" size={16} />
                                        <input required className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium" 
                                            value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Organic" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Initial Stock</label>
                                    <div className="relative">
                                        <Database className="absolute left-4 top-3 text-slate-400" size={16} />
                                        <input required type="number" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium" 
                                            value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} placeholder="100" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Image</label>
                                    <label className="cursor-pointer group block">
                                        <div className="flex items-center gap-3 bg-slate-50 border-2 border-dashed border-slate-200 group-hover:border-emerald-500 group-hover:bg-emerald-50/50 rounded-2xl p-2.5 transition-all">
                                            <Upload size={16} className="text-slate-400 group-hover:text-emerald-500" />
                                            <span className="text-[10px] font-bold text-slate-500 truncate">{image ? image.name : 'Choose Image'}</span>
                                        </div>
                                        <input type="file" hidden onChange={e => setImage(e.target.files[0])} accept="image/*" />
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Description</label>
                                <textarea required rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm font-medium" 
                                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe properties and usage..." />
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-200 active:scale-95 transition-all">
                                {loading ? 'Saving...' : (editMode ? 'Update Product' : 'Add Product')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FertilizerManagement;
