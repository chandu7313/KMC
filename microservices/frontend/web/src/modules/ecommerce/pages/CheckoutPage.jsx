import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
    ArrowLeft, ArrowRight, Plus, Minus, Trash2, MapPin, 
    CreditCard, ShoppingBag, ShieldCheck, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useGlobalStore } from '@/app/store/globalStore';
import { useCartStore } from '@/modules/ecommerce/store/cartStore';
import API from '@/core/api/api.config';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { backendUrl, isLoggedin, userData } = useGlobalStore();
    const { getCartCount, setCartItems: setGlobalCartItems, getCartData } = useCartStore();
    
    const [cartItems, setCartItems] = useState({});
    const [productsData, setProductsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' or 'cod'
    
    // For exact match to design
    const [mockCartDetails, setMockCartDetails] = useState([
        { id: 1, name: 'KMC Nitro-Max Organic Soluble', brand: 'KMC Organic Solutions', price: 850, quantity: 2, image: 'https://placehold.co/200x200?text=Nitro-Max', unit: '500g' },
        { id: 2, name: 'Elite Non-GMO Soybean Seeds', brand: 'KMC Organic Solutions', price: 2450, quantity: 1, image: 'https://placehold.co/200x200?text=Soybean', unit: '50kg Bag' },
        { id: 3, name: 'Precision Micro-Drip Emitter', brand: 'AquaFlow Systems', price: 840, quantity: 10, image: 'https://placehold.co/200x200?text=Emitter', unit: 'Unit' }
    ]);

    const fetchCartData = async () => {
        if (!isLoggedin) {
            setLoading(false);
            return;
        }

        try {
            const cartRes = await axios.get(`${backendUrl}${API.CART}/`, { params: { userId: userData?.id } });
            if (cartRes.data.success) {
                const cartData = cartRes.data.cartData || cartRes.data.data?.cartData || {};
                setCartItems(cartData);
                
                const prodRes = await axios.get(`${backendUrl}${API.PRODUCT}/list`);
                if (prodRes.data.success) {
                    const productsList = Array.isArray(prodRes.data.products) ? prodRes.data.products : (Array.isArray(prodRes.data.data?.products?.products) ? prodRes.data.data.products.products : (Array.isArray(prodRes.data.data?.products) ? prodRes.data.data.products : []));
                    setProductsData(productsList);
                }
            }
        } catch (error) {
            console.error("Cart fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartData();
        window.scrollTo(0, 0);
    }, [isLoggedin]);

    const updateQuantityMock = (id, delta) => {
        setMockCartDetails(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeItemMock = (id) => {
        setMockCartDetails(prev => prev.filter(item => item.id !== id));
    };

    // Calculate totals based on mock data for exact design matching
    const subTotal = mockCartDetails.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = subTotal > 0 ? (subTotal > 5000 ? 0 : 500) : 0;
    const consultancyDiscount = -250; // Mock discount from design
    const total = subTotal + shipping + consultancyDiscount;

    if (loading) {
        return <div className="flex h-screen items-center justify-center bg-white"><div className="w-8 h-8 border-4 border-slate-200 border-t-[#1b5e20] rounded-full animate-spin"></div></div>;
    }

    if (!isLoggedin) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center">
                <div className="bg-white p-12 rounded-[24px] text-center max-w-md w-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <ShoppingBag size={32} className="text-[#1b5e20]" />
                    </div>
                    <h2 className="text-[24px] font-black text-slate-900 mb-2">Please Login</h2>
                    <p className="text-[14px] text-slate-500 font-bold mb-8">Sign in to view and manage your cart securely.</p>
                    <button onClick={() => navigate('/login')} className="w-full bg-[#1b5e20] text-white font-black py-4 rounded-[12px] hover:bg-green-900 transition-colors">
                        Login Now
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans pb-24">
            
            {/* Header */}
            <header className="h-[80px] bg-white border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-[20px] font-black text-[#1b5e20] tracking-tight">Checkout</h1>
                </div>
                <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500">
                    <ShieldCheck size={16} className="text-[#1b5e20]" /> Secure 256-bit Encrypted
                </div>
            </header>
            
            <main className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-12 flex flex-col lg:flex-row gap-10">
                
                {/* Left Column - Main Details */}
                <div className="lg:w-[65%] space-y-10">
                    
                    {/* Your Selection */}
                    <div>
                        <h2 className="text-[22px] font-black text-slate-900 mb-6 tracking-tight flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#1b5e20] text-white flex items-center justify-center text-[14px]">1</span> 
                            Your Selection
                        </h2>
                        
                        <div className="bg-white rounded-[16px] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
                            {mockCartDetails.map((item, index) => (
                                <div key={item.id} className={`p-6 flex flex-col sm:flex-row gap-6 ${index !== mockCartDetails.length - 1 ? 'border-b border-slate-100' : ''}`}>
                                    <div className="w-24 h-24 bg-[#f4f5f4] rounded-[12px] flex items-center justify-center shrink-0 overflow-hidden p-2">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                    </div>
                                    
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-[16px] font-black text-slate-900 leading-snug">{item.name}</h3>
                                                <p className="text-[12px] text-slate-500 font-bold mt-1">{item.brand} • {item.unit}</p>
                                            </div>
                                            <button 
                                                onClick={() => removeItemMock(item.id)}
                                                className="text-slate-400 hover:text-red-500 transition-colors p-2 -mt-2 -mr-2"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center gap-4 border-2 border-slate-100 rounded-[8px] px-1 h-[40px]">
                                                <button onClick={() => updateQuantityMock(item.id, -1)} className="w-8 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded"><Minus size={14} strokeWidth={3}/></button>
                                                <span className="text-[14px] font-black text-slate-900 w-6 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantityMock(item.id, 1)} className="w-8 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded"><Plus size={14} strokeWidth={3}/></button>
                                            </div>
                                            <span className="text-[18px] font-black text-slate-900">₹{(item.price * item.quantity).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {mockCartDetails.length === 0 && (
                                <div className="p-10 text-center text-slate-500 font-bold">Your cart is empty.</div>
                            )}
                        </div>
                    </div>

                    {/* Delivery Details */}
                    <div>
                        <h2 className="text-[22px] font-black text-slate-900 mb-6 tracking-tight flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#1b5e20] text-white flex items-center justify-center text-[14px]">2</span> 
                            Delivery Details
                        </h2>
                        
                        <div className="bg-white rounded-[16px] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#e8f5e9] text-[#1b5e20] flex items-center justify-center shrink-0 mt-1">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-[16px] font-black text-slate-900">Farm Estate - Sector 4</h3>
                                            <span className="bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-[4px]">Primary</span>
                                        </div>
                                        <p className="text-[13px] text-slate-600 font-bold leading-relaxed max-w-md">
                                            KMC Estate Management Plot No. 42, Agricultural Zone C,<br/>
                                            Near Sub-Canal, District Pune, Maharashtra 411042<br/>
                                            <span className="text-slate-900 mt-1 inline-block">Phone: +91 98765 43210</span>
                                        </p>
                                    </div>
                                </div>
                                <button className="text-[#1b5e20] font-black text-[12px] uppercase tracking-wide hover:text-green-900 transition-colors">
                                    Change Address
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                        <h2 className="text-[22px] font-black text-slate-900 mb-6 tracking-tight flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#1b5e20] text-white flex items-center justify-center text-[14px]">3</span> 
                            Payment Method
                        </h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label className={`cursor-pointer rounded-[16px] border-[2px] p-5 flex flex-col gap-4 transition-all ${paymentMethod === 'upi' ? 'border-[#1b5e20] bg-[#f0fdf4]' : 'border-slate-100 bg-white hover:border-slate-300'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <CreditCard size={24} className={paymentMethod === 'upi' ? 'text-[#1b5e20]' : 'text-slate-400'} />
                                        <span className={`text-[15px] font-black ${paymentMethod === 'upi' ? 'text-[#1b5e20]' : 'text-slate-900'}`}>Razorpay UPI / Cards</span>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-[2px] flex items-center justify-center ${paymentMethod === 'upi' ? 'border-[#1b5e20]' : 'border-slate-300'}`}>
                                        {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 rounded-full bg-[#1b5e20]"></div>}
                                    </div>
                                </div>
                                <p className="text-[12px] text-slate-500 font-bold">Pay instantly using Google Pay, PhonePe, Paytm or Credit/Debit Cards via Razorpay.</p>
                                <input type="radio" className="sr-only" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                            </label>
                            
                            <label className={`cursor-pointer rounded-[16px] border-[2px] p-5 flex flex-col gap-4 transition-all ${paymentMethod === 'cod' ? 'border-[#1b5e20] bg-[#f0fdf4]' : 'border-slate-100 bg-white hover:border-slate-300'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-black border ${paymentMethod === 'cod' ? 'border-[#1b5e20] text-[#1b5e20]' : 'border-slate-400 text-slate-400'}`}>₹</div>
                                        <span className={`text-[15px] font-black ${paymentMethod === 'cod' ? 'text-[#1b5e20]' : 'text-slate-900'}`}>Cash on Delivery</span>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-[2px] flex items-center justify-center ${paymentMethod === 'cod' ? 'border-[#1b5e20]' : 'border-slate-300'}`}>
                                        {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-[#1b5e20]"></div>}
                                    </div>
                                </div>
                                <p className="text-[12px] text-slate-500 font-bold">Pay directly to our delivery partner upon receiving your supplies.</p>
                                <input type="radio" className="sr-only" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right Column - Order Summary */}
                <div className="lg:w-[35%]">
                    <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sticky top-28">
                        <h2 className="text-[20px] font-black text-slate-900 mb-6 tracking-tight">Order Summary</h2>
                        
                        <div className="space-y-4 mb-6 pb-6 border-b border-slate-100">
                            <div className="flex justify-between items-center text-[14px]">
                                <span className="text-slate-500 font-bold">Subtotal ({mockCartDetails.length} items)</span>
                                <span className="text-slate-900 font-black">₹{subTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                            <div className="flex justify-between items-center text-[14px]">
                                <span className="text-slate-500 font-bold">Heavy Shipping</span>
                                <span className="text-slate-900 font-black">{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString(undefined, {minimumFractionDigits: 2})}`}</span>
                            </div>
                            <div className="flex justify-between items-center text-[14px]">
                                <span className="text-[#1b5e20] font-bold">Consultancy Discount</span>
                                <span className="text-[#1b5e20] font-black">-₹{Math.abs(consultancyDiscount).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-end mb-8">
                            <span className="text-[16px] font-black text-slate-900">Total Price</span>
                            <span className="text-[32px] font-black text-slate-900 leading-none tracking-tight">₹{total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                        </div>
                        
                        <button 
                            className="w-full h-[60px] bg-[#1a1a1a] hover:bg-black text-white rounded-[12px] font-black text-[16px] flex items-center justify-center gap-2 transition-colors shadow-xl"
                            onClick={() => {
                                toast.success("Order Placed Successfully!");
                                navigate('/marketplace');
                            }}
                        >
                            Place Order <ArrowRight size={18} strokeWidth={3} />
                        </button>
                        
                        <div className="mt-6 flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                                <CheckCircle2 size={14} className="text-[#1b5e20]" /> Original KMC Quality Guaranteed
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                                <CheckCircle2 size={14} className="text-[#1b5e20]" /> Returnable within 7 Days (Unopened)
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CheckoutPage;
