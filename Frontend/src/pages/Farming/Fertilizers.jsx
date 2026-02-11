import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { ShoppingCart, Package, Search, Filter, ArrowRight, User, Home, ShoppingBag, X, CheckCircle, Plus } from 'lucide-react';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const Fertilizers = () => {
    const { backendUrl, userData, navigate } = useContext(AppContext);
    const [fertilizers, setFertilizers] = useState([]);
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('All');

    const fetchFertilizers = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/fertilizer/list');
            if (data.success) {
                setFertilizers(data.fertilizers);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchFertilizers();
    }, []);

    const addToCart = (item) => {
        const existing = cart.find(i => i._id === item._id);
        if (existing) {
            if (existing.quantity >= item.stock) {
                toast.warning("Not enough stock available");
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
            toast.error("Please login to place an order");
            navigate('/login');
            return;
        }
        if (!address) {
            toast.error("Please provide delivery address");
            return;
        }
        setLoading(true);
        try {
            axios.defaults.withCredentials = true;
            const items = cart.map(i => ({ fertilizerId: i._id, quantity: i.quantity, price: i.price }));
            const { data } = await axios.post(backendUrl + '/api/fertilizer/place-order', {
                userId: userData._id,
                items,
                totalAmount,
                address
            });
            if (data.success) {
                toast.success("Order placed successfully!");
                setCart([]);
                setShowCart(false);
                setAddress('');
                navigate('/my-orders');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', ...new Set(fertilizers.map(f => f.category))];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#f6f3e8] to-white">
            <Navbar />
            
            <section className="py-28 px-6">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-5xl font-serif font-bold text-[#1f2d1f]">
                        Fertilizers & Nutrients
                    </h2>
                    <p className="text-lg text-slate-600 font-medium">
                        High-quality fertilizers trusted by farmers for better yields.
                    </p>
                    
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-6">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium shadow-sm" placeholder="Search nutrients..." />
                        </div>
                        <button onClick={() => setShowCart(true)} className="relative bg-white p-3 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm group flex items-center gap-2">
                            <ShoppingCart size={24} />
                            <span className="font-bold text-sm hidden md:inline">Cart</span>
                            {cart.length > 0 && <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">{cart.length}</span>}
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="max-w-6xl mx-auto flex gap-3 overflow-x-auto pb-8 no-scrollbar justify-center">
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setFilter(cat)} className={`px-6 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${filter === cat ? 'bg-green-800 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-100 hover:border-green-200'}`}>
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {fertilizers.filter(f => filter === 'All' || f.category === filter).map(item => (
                        <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden">
                            {/* Image */}
                            <div className="h-52 w-full bg-slate-50 relative overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                {item.stock === 0 && (
                                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
                                        <span className="bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Out of Stock</span>
                                    </div>
                                )}
                                <div className="absolute top-3 left-3">
                                    <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-slate-900 shadow-sm uppercase tracking-widest">{item.category}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col justify-between h-56">
                                <div>
                                    <h3 className="text-lg font-bold text-[#1f2d1f] mb-1 line-clamp-1">
                                        {item.name}
                                    </h3>
                                    <p className="text-sm text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                                    <span className="text-2xl font-black text-green-800">
                                        ₹{item.price}
                                    </span>
                                    <button
                                        onClick={() => addToCart(item)}
                                        disabled={item.stock === 0}
                                        className="bg-green-700 text-white p-2.5 rounded-xl hover:bg-green-800 disabled:bg-slate-200 transition-all active:scale-95 shadow-lg shadow-green-100"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Cart Sidebar Overlay */}
            {showCart && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowCart(false)}></div>
                    <div className="relative w-full max-w-md bg-white h-screen shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-2xl font-serif font-bold text-[#1f2d1f] flex items-center gap-3">
                                <ShoppingCart size={24} className="text-green-700" /> Your Cart
                            </h2>
                            <button onClick={() => setShowCart(false)} className="p-2 hover:bg-white rounded-full transition-colors bg-white shadow-sm border border-slate-100"><X size={20} className="text-slate-400" /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-4">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-100">
                                        <ShoppingBag size={48} />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[#1f2d1f] font-bold text-lg">Your cart is empty</p>
                                        <p className="text-slate-400 text-sm">Add some nutrients to get started.</p>
                                    </div>
                                    <button onClick={() => setShowCart(false)} className="text-green-700 font-bold hover:underline">Start Browsing</button>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item._id} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group">
                                        <div className="w-16 h-16 rounded-xl bg-white p-2 flex-shrink-0 border border-slate-100 shadow-sm">
                                            <img src={item.image} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-[#1f2d1f] text-sm truncate">{item.name}</div>
                                            <div className="text-xs text-slate-400 font-bold mt-1">₹{item.price} x {item.quantity}</div>
                                        </div>
                                        <button onClick={() => removeFromCart(item._id)} className="text-slate-300 hover:text-rose-500 transition-colors p-1"><X size={16}/></button>
                                    </div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-8 bg-slate-50 border-t border-slate-200 space-y-8 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.05)]">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Total Amount</span>
                                    <span className="text-3xl font-black text-[#1f2d1f]">₹{totalAmount}</span>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Delivery Address</label>
                                    <textarea 
                                        value={address} 
                                        onChange={e => setAddress(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-600 transition-all text-sm font-medium shadow-sm" 
                                        rows="3" 
                                        placeholder="Full delivery address with pincode..."
                                    />
                                </div>
                                <button 
                                    onClick={placeOrder}
                                    disabled={loading}
                                    className="w-full bg-green-700 hover:bg-green-800 disabled:bg-slate-300 text-white font-bold py-5 rounded-2xl shadow-xl shadow-green-100 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg"
                                >
                                    {loading ? 'Processing...' : (
                                        <>Place Order <ArrowRight size={20}/></>
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

export default Fertilizers;
