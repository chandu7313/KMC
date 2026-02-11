import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { ShoppingCart, Settings, Search, Filter, ArrowRight, ShoppingBag, X, Plus, Info } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Equipments = () => {
    const { backendUrl, userData, navigate } = useContext(AppContext);
    const [equipments, setEquipments] = useState([]);
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('All');
    const [selectedEquipment, setSelectedEquipment] = useState(null); // For detail modal

    const fetchEquipments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/equipment/list`);
            if (data.success) {
                setEquipments(data.equipments);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchEquipments();
    }, []);

    const addToCart = (item) => {
        const existing = cart.find(i => i._id === item._id);
        if (existing) {
            if (existing.quantity >= item.stock) {
                toast.warning("Maximum stock reached");
                return;
            }
            setCart(cart.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i));
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
        toast.success(`${item.name} added to cart`);
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(i => i._id !== id));
    };

    const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const placeOrder = async () => {
        if (!userData) {
            toast.error("Please login to purchase");
            navigate('/login');
            return;
        }
        if (!address) {
            toast.error("Please enter a shipping address");
            return;
        }
        setLoading(true);
        try {
            axios.defaults.withCredentials = true;
            const items = cart.map(i => ({ equipmentId: i._id, quantity: i.quantity, price: i.price }));
            const { data } = await axios.post(`${backendUrl}/api/equipment/place-order`, {
                userId: userData._id,
                items,
                totalAmount,
                address
            });
            if (data.success) {
                toast.success("Equipment order placed!");
                setCart([]);
                setShowCart(false);
                setAddress('');
                navigate('/my-equipment-orders');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', ...new Set(equipments.map(e => e.category))];

    return (
        <div className="pt-24 pb-20 px-6 sm:px-12 bg-slate-50 min-h-screen">
            <Navbar />
            <div className="max-w-7xl mx-auto space-y-12">
                
                {/* Hero / Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
                    <div className="space-y-4 max-w-xl">
                        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                            <Settings size={14} className="animate-spin-slow" /> Agricultural Machinery
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 leading-tight">Modern Equipments for Modern Farmers</h1>
                        <p className="text-slate-500 font-medium">Buy high-quality tools and machinery with doorstep delivery and installment options.</p>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button onClick={() => setShowCart(true)} className="relative bg-slate-900 text-white p-4 rounded-3xl hover:bg-green-700 transition-all shadow-xl shadow-slate-200 group flex items-center gap-3">
                            <ShoppingCart size={24} />
                            <span className="font-bold text-sm">Cart</span>
                            {cart.length > 0 && <span className="bg-white text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full">{cart.length}</span>}
                        </button>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input className="w-full bg-white border border-slate-200 rounded-3xl py-5 pl-16 pr-6 outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-600 transition-all font-bold text-slate-700" placeholder="Search for tractors, tillers, or drones..." />
                    </div>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setFilter(cat)} className={`px-8 py-4 rounded-3xl text-sm font-black whitespace-nowrap transition-all ${filter === cat ? 'bg-green-700 text-white shadow-lg shadow-green-100' : 'bg-white text-slate-500 border border-slate-100 hover:border-green-200'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {equipments.filter(e => filter === 'All' || e.category === filter).map(item => (
                        <div key={item._id} className="bg-white rounded-[40px] p-2 shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all group relative">
                            <div className="relative aspect-[4/3] rounded-[32px] bg-slate-50 overflow-hidden mb-4">
                                <img src={item.image} alt={item.name} className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-700" />
                                {item.stock === 0 && (
                                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
                                        <span className="bg-rose-500 text-white text-xs font-black px-5 py-2 rounded-full uppercase tracking-[0.2em]">Out of Stock</span>
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black text-slate-900 shadow-sm border border-slate-100 uppercase tracking-widest">{item.category}</span>
                                </div>
                            </div>
                            <div className="px-6 py-4 space-y-4">
                                <div>
                                    <h3 className="font-black text-slate-900 text-lg leading-tight line-clamp-1">{item.name}</h3>
                                    <p className="text-slate-400 text-xs font-medium line-clamp-2 mt-2">{item.description}</p>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                    <div className="text-2xl font-black text-slate-900">₹{item.price?.toLocaleString() || '0'}</div>
                                    <button 
                                        onClick={() => addToCart(item)}
                                        disabled={item.stock === 0}
                                        className="bg-green-700 hover:bg-green-800 disabled:bg-slate-200 text-white p-3.5 rounded-2xl transition-all active:scale-90 shadow-xl shadow-green-100"
                                    >
                                        <Plus size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cart Sidebar */}
            {showCart && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setShowCart(false)}></div>
                    <div className="relative w-full max-w-lg bg-white h-screen shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
                        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                                <ShoppingBag size={32} className="text-green-700" /> Equipment Cart
                            </h2>
                            <button onClick={() => setShowCart(false)} className="p-3 hover:bg-white rounded-full transition-colors bg-white shadow-sm border border-slate-100"><X size={24} className="text-slate-400" /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 space-y-6">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center">
                                        <ShoppingCart size={64} className="text-slate-200" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-slate-900 font-black text-xl">Your cart is empty</p>
                                        <p className="text-slate-400 font-medium">Add some machinery to get started.</p>
                                    </div>
                                    <button onClick={() => setShowCart(false)} className="text-green-700 font-black hover:underline uppercase tracking-widest text-sm">Start Browsing</button>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item._id} className="flex gap-6 p-6 rounded-[32px] bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:shadow-xl hover:border-transparent">
                                        <div className="w-24 h-24 rounded-2xl bg-white p-4 flex-shrink-0 border border-slate-100 shadow-sm">
                                            <img src={item.image} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <div className="font-black text-slate-900 text-base truncate">{item.name}</div>
                                            <div className="text-sm text-slate-400 font-bold mt-1">₹{item.price?.toLocaleString() || '0'} × {item.quantity} units</div>
                                        </div>
                                        <button onClick={() => removeFromCart(item._id)} className="text-slate-300 hover:text-rose-500 transition-colors self-center p-2"><X size={20}/></button>
                                    </div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-10 bg-slate-50 border-t border-slate-200 rounded-t-[48px] space-y-8 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.1)]">
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-slate-400 font-black uppercase tracking-widest text-xs">Total Investment</span>
                                    <span className="text-4xl font-black text-slate-900">₹{totalAmount?.toLocaleString() || '0'}</span>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Shipping Information</label>
                                    <textarea 
                                        value={address} 
                                        onChange={e => setAddress(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-[32px] p-6 outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-600 transition-all text-sm font-bold shadow-sm" 
                                        rows="3" 
                                        placeholder="Full delivery address with pincode..."
                                    />
                                </div>
                                <button 
                                    onClick={placeOrder}
                                    disabled={loading}
                                    className="w-full bg-green-700 hover:bg-green-800 disabled:bg-slate-300 text-white font-black py-6 rounded-[32px] shadow-2xl shadow-green-200 active:scale-95 transition-all flex items-center justify-center gap-4 text-lg"
                                >
                                    {loading ? 'Processing...' : (
                                        <>Proceed to Purchase <ArrowRight size={24}/></>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default Equipments;