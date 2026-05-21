import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '@/app/layouts/Navbar';
import { Trash2, ArrowRight, ShoppingBag, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useGlobalStore } from '@/app/store/globalStore';
import { useCartStore } from '@/modules/ecommerce/store/cartStore';
import API from '@/core/api/api.config';

const CartPage = () => {
    const navigate = useNavigate();
    const { backendUrl, isLoggedin, userData } = useGlobalStore();
  const { setCartItems: setGlobalCartItems } = useCartStore();
    const [cartItems, setCartItems] = useState({});
    const [productsData, setProductsData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch full product details to map with cart items
    const fetchCartData = async () => {
        if (!isLoggedin) {
            setLoading(false);
            return;
        }

        try {
            // First get cart content
            const cartRes = await axios.post(`${backendUrl}${API.CART}/get`, { userId: userData.id });
            if (cartRes.data.success) {
                const cartData = cartRes.data.cartData || cartRes.data.data?.cartData || {};
                setCartItems(cartData);
                setGlobalCartItems(cartData);
                
                // Then fetch product list to cross-reference
                const prodRes = await axios.get(`${backendUrl}${API.PRODUCT}/list`);
                if (prodRes.data.success) {
                    const productsList = prodRes.data.products || prodRes.data.data?.products || [];
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
    }, [isLoggedin]);

    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity <= 0) {
            removeItem(itemId);
            return;
        }

        try {
            const { data } = await axios.post(`${backendUrl}${API.CART}/update`, {
                userId: userData.id,
                itemId,
                quantity: newQuantity
            });

            if (data.success) {
                const updatedCart = { ...cartItems, [itemId]: newQuantity };
                setCartItems(updatedCart);
                setGlobalCartItems(updatedCart);
            }
        } catch (error) {
            toast.error("Failed to update cart");
        }
    };

    const removeItem = async (itemId) => {
        try {
            const { data } = await axios.post(`${backendUrl}${API.CART}/update`, {
                userId: userData.id,
                itemId,
                quantity: 0
            });

            if (data.success) {
                const newCart = { ...cartItems };
                delete newCart[itemId];
                setCartItems(newCart);
                setGlobalCartItems(newCart);
                toast.success("Item removed");
            }
        } catch (error) {
            toast.error("Failed to remove item");
        }
    };

    // Calculate totals based on productsData matching cartItems
    const cartDetails = Object.keys(cartItems).map(itemId => {
        const product = productsData.find(p => p.id === itemId);
        return product ? { ...product, quantity: cartItems[itemId] } : null;
    }).filter(Boolean);

    const subTotal = cartDetails.reduce((acc, item) => acc + ((item.discountedPrice || item.price) * item.quantity), 0);
    const shipping = subTotal > 0 ? (subTotal > 5000 ? 0 : 500) : 0; // Free shipping over 5000
    const total = subTotal + shipping;

    if (loading) {
        return (
             <div className="min-h-screen bg-[#f8fafc]">
                 <Navbar />
                 <div className="flex flex-col items-center justify-center pt-40 space-y-4">
                     <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin"></div>
                     <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Loading Cart...</p>
                 </div>
             </div>
        );
    }

    if (!isLoggedin) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">
                <Navbar />
                <div className="bg-white p-12 rounded-[40px] text-center max-w-md w-full shadow-sm border border-slate-100 flex flex-col items-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <ShoppingBag size={40} className="text-slate-300" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Please Login</h2>
                    <p className="text-slate-500 font-medium mb-8">You need to sign in to view and manage your cart.</p>
                    <button onClick={() => navigate('/login')} className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl hover:bg-emerald-700 transition-colors shadow-xl shadow-emerald-200">
                        Login Now
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-6 pt-32">
                <div className="flex items-center gap-4 mb-10">
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-emerald-700 hover:shadow-md transition-all border border-slate-200"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900">Your Cart</h1>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
                            {cartDetails.length} {cartDetails.length === 1 ? 'Item' : 'Items'}
                        </p>
                    </div>
                </div>

                {cartDetails.length === 0 ? (
                     <div className="bg-white p-20 rounded-[48px] text-center shadow-sm border border-slate-100 flex flex-col items-center">
                        <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-8">
                            <ShoppingBag size={56} className="text-slate-300" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-4">Your cart is empty</h2>
                        <p className="text-slate-500 font-medium mb-10 max-w-md">Looks like you haven't added any agricultural inputs to your cart yet.</p>
                        <button onClick={() => navigate('/fertilizers')} className="bg-slate-900 text-white font-black py-4 px-10 rounded-2xl hover:bg-emerald-600 transition-colors shadow-2xl">
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items List */}
                        <div className="lg:w-2/3 space-y-4">
                            {cartDetails.map(item => (
                                <div key={item.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-6 group">
                                    <div className="w-full sm:w-32 aspect-square rounded-[20px] bg-slate-50 p-4 shrink-0 overflow-hidden relative border border-slate-100">
                                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-2 w-full">
                                        <div className="flex justify-between items-start gap-4 mb-4">
                                            <div>
                                                <h3 className="text-lg font-black text-slate-900 line-clamp-1">{item.name}</h3>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{item.category}</p>
                                            </div>
                                            <button 
                                                onClick={() => removeItem(item.id)}
                                                className="p-3 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-colors shrink-0"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        
                                        <div className="flex flex-wrap items-end justify-between gap-4 mt-auto border-t border-slate-50 pt-4">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-black text-slate-900">₹{item.discountedPrice || item.price}</span>
                                            </div>
                                            
                                            <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl p-1 shadow-inner">
                                                <button 
                                                    className="w-10 h-10 rounded-lg bg-white flex items-center justify-center font-black text-slate-500 hover:text-slate-900 shadow-sm transition-colors"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                ><Minus size={16}/></button>
                                                <span className="w-12 text-center font-black text-slate-900">{item.quantity}</span>
                                                <button 
                                                    className="w-10 h-10 rounded-lg bg-white flex items-center justify-center font-black text-slate-500 hover:text-slate-900 shadow-sm transition-colors"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                ><Plus size={16}/></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:w-1/3">
                            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 sticky top-32">
                                <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                    <ShoppingBag size={24} className="text-emerald-600" /> Order Summary
                                </h3>
                                
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center text-slate-500 font-medium">
                                        <span>Subtotal ({cartDetails.length} items)</span>
                                        <span className="font-bold text-slate-900">₹{subTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-500 font-medium">
                                        <span>Heavy Shipping</span>
                                        <span className={shipping === 0 ? "font-bold text-emerald-600" : "font-bold text-slate-900"}>
                                            {shipping === 0 ? 'Free' : `₹${shipping}`}
                                        </span>
                                    </div>
                                    {subTotal < 5000 && (
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            Add ₹{(5000 - subTotal).toLocaleString()} more for free shipping
                                        </div>
                                    )}
                                </div>
                                
                                <div className="border-t border-slate-200 pt-6 mb-8">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Total Amount</span>
                                        <span className="text-4xl font-black text-emerald-700">₹{total.toLocaleString()}</span>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => navigate('/checkout')}
                                    className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-black py-5 rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                >
                                    Proceed to Checkout <ArrowRight size={20} />
                                </button>
                                
                                <div className="mt-6 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                                     Secure Encrypted Checkout
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CartPage;
