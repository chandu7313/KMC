import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Navbar from '@/app/layouts/Navbar';
import { ArrowLeft, CheckCircle2, Wallet, Truck, ShoppingBag, Plus } from 'lucide-react';
import { useGlobalStore } from '@/app/store/globalStore';
import { useCartStore } from '@/modules/ecommerce/store/cartStore';
import API from '@/core/api/api.config';

const Checkout = () => {
    const navigate = useNavigate();
    const { backendUrl, userData, isLoggedin, getUserData } = useGlobalStore();
  const { setCartItems: setGlobalCartItems } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [productsData, setProductsData] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [orderPlaced, setOrderPlaced] = useState(false);

    const addresses = userData?.addresses || [];
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
    const [isAddingNewAddress, setIsAddingNewAddress] = useState(!addresses.length);
    const [newAddress, setNewAddress] = useState({ fullName: userData?.name || '', phone: userData?.phone || '', address: '' });

    useEffect(() => {
        const fetchCart = async () => {
            if (!isLoggedin) {
                navigate('/login');
                return;
            }
            try {
                const cartRes = await axios.post(`${backendUrl}${API.CART}/get`, { userId: userData.id });
                if (cartRes.data.success) {
                    const cartData = cartRes.data.cartData || cartRes.data.data?.cartData || {};
                    setCartItems(cartData);
                    const prodRes = await axios.get(`${backendUrl}${API.PRODUCT}/list`);
                    if (prodRes.data.success) {
                        const productsList = prodRes.data.products || prodRes.data.data?.products || [];
                        setProductsData(productsList);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchCart();

        // Load Razorpay Script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        
        return () => {
            if(document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [isLoggedin]);

    useEffect(() => {
        if (addresses.length > 0 && isAddingNewAddress === false) {
           setIsAddingNewAddress(false);
        } else if (addresses.length === 0) {
            setIsAddingNewAddress(true);
        }
    }, [addresses.length]);

    const cartDetails = Object.keys(cartItems).map(itemId => {
        const product = productsData.find(p => p.id === itemId);
        return product ? { ...product, quantity: cartItems[itemId] } : null;
    }).filter(Boolean);

    const subTotal = cartDetails.reduce((acc, item) => acc + ((item.discountedPrice || item.price) * item.quantity), 0);
    const shipping = subTotal > 0 ? (subTotal > 5000 ? 0 : 500) : 0;
    const total = subTotal + shipping;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        
        if (cartDetails.length === 0) {
            toast.error("Cart is empty");
            return;
        }

        let addressObj = null;
        if (isAddingNewAddress) {
            if (!newAddress.full_name.trim() || !newAddress.phone.trim() || !newAddress.address.trim()) {
                toast.error("Please fill all details for the new address");
                return;
            }
            addressObj = newAddress;
        } else {
            addressObj = addresses[selectedAddressIndex];
        }

        if (!addressObj) {
            toast.error("Please select or add a shipping address");
            return;
        }

        const addressStr = `${addressObj.full_name}, Ph: ${addressObj.phone}, ${addressObj.address}`;

        setLoading(true);
        try {
            // Save address if new
            if (isAddingNewAddress) {
                await axios.post(`${backendUrl}${API.USER}/addresses`, {
                    userId: userData.id,
                    address: addressObj
                });
                await getUserData(); // Refresh user context
            }

            const orderItems = cartDetails.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.discountedPrice || item.price
            }));

            if (paymentMethod === 'ONLINE') {
                const { data } = await axios.post(`${backendUrl}${API.ORDER}/razorpay`, {
                    userId: userData.id,
                    items: orderItems,
                    amount: total,
                    address: addressStr
                });

                if (data.success) {
                    const rzpOrder = data.order;
                    const options = {
                        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                        amount: rzpOrder.amount.toString(),
                        currency: rzpOrder.currency,
                        name: "Kisan Mithar Consultancy",
                        description: "Direct-to-Farm Inputs Order",
                        order_id: rzpOrder.id,
                        handler: async (response) => {
                            try {
                                const verifyRes = await axios.post(`${backendUrl}${API.ORDER}/verify-razorpay`, {
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                    dbOrderId: data.dbOrderId,
                                    userId: userData.id
                                });
                                if (verifyRes.data.success) {
                                    setOrderPlaced(true);
                                    setGlobalCartItems({});
                                    toast.success("Payment Successful & Order Placed!");
                                } else {
                                    toast.error(verifyRes.data.message);
                                }
                            } catch (err) {
                                toast.error("Payment Verification Failed");
                            } finally {
                                setLoading(false);
                            }
                        },
                        prefill: {
                            name: addressObj.full_name,
                            email: userData?.email,
                            contact: addressObj.phone
                        },
                        theme: {
                            color: "#059669"
                        }
                    };
                    const rzp = new window.Razorpay(options);
                    rzp.on('payment.failed', function (response){
                        toast.error("Payment Failed");
                        setLoading(false);
                    });
                    rzp.open();
                } else {
                    toast.error(data.message);
                    setLoading(false);
                }
            } else {
                // COD Flow
                const { data } = await axios.post(`${backendUrl}${API.ORDER}/place`, {
                    userId: userData.id,
                    items: orderItems,
                    amount: total,
                    address: addressStr,
                    paymentMethod: 'COD'
                });

                if (data.success) {
                    setOrderPlaced(true);
                    setGlobalCartItems({});
                    toast.success("Order Placed Successfully!");
                } else {
                    toast.error(data.message);
                }
                setLoading(false);
            }
        } catch (error) {
            toast.error("Error placing order: " + error.message);
            setLoading(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">
                <Navbar />
                <div className="bg-white p-12 rounded-[48px] text-center max-w-lg w-full shadow-2xl border border-emerald-100 flex flex-col items-center animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8 relative">
                        <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
                        <CheckCircle2 size={48} className="text-emerald-500" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Order Confirmed!</h2>
                    <p className="text-slate-500 font-medium mb-10 leading-relaxed text-lg">
                        Thank you for choosing KMC Agri-Mart. Your inputs will be delivered to your farm soon. We've sent a confirmation to your email.
                    </p>
                    <div className="flex flex-col gap-4 w-full">
                        <button 
                            onClick={() => navigate('/my-orders')} 
                            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-slate-800 transition-colors shadow-lg"
                        >
                            View Order Tracking
                        </button>
                        <button 
                            onClick={() => navigate('/marketplace')} 
                            className="w-full bg-emerald-50 text-emerald-700 font-black py-4 rounded-2xl hover:bg-emerald-100 transition-colors"
                        >
                            Return to Shop
                        </button>
                    </div>
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
                        onClick={() => navigate('/cart')}
                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-emerald-700 hover:shadow-md transition-all border border-slate-200"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900">Secure Checkout</h1>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
                            Complete your purchase
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Checkout Form */}
                    <div className="lg:w-2/3 space-y-8">
                        
                        {/* Shipping Address */}
                        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <Truck size={24} className="text-emerald-600" /> Shipping Information
                            </h2>

                            {addresses.length > 0 && (
                                <div className="mb-6 space-y-3">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Saved Addresses</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {addresses.map((addr, index) => (
                                            <label key={index} className={`cursor-pointer border-2 rounded-2xl p-4 transition-all ${!isAddingNewAddress && selectedAddressIndex === index ? 'border-emerald-500 bg-emerald-50/50 shadow-md' : 'border-slate-100 hover:border-emerald-200'}`}>
                                                <div className="flex items-start gap-4">
                                                    <input 
                                                        type="radio" 
                                                        name="addressGroup" 
                                                        checked={!isAddingNewAddress && selectedAddressIndex === index}
                                                        onChange={() => { setSelectedAddressIndex(index); setIsAddingNewAddress(false); }}
                                                        className="mt-1 w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                                    />
                                                    <div>
                                                        <p className="font-bold text-slate-900 leading-tight">{addr.full_name} <span className="text-sm text-slate-500 font-medium">({addr.phone})</span></p>
                                                        <p className="text-xs font-medium text-slate-500 mt-2 line-clamp-2">{addr.address}</p>
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                        <label className={`cursor-pointer border-2 rounded-2xl p-4 flex items-center justify-center transition-all ${isAddingNewAddress ? 'border-emerald-500 bg-emerald-50/50 shadow-md text-emerald-700' : 'border-slate-100 hover:border-emerald-200 text-slate-500'} border-dashed`}>
                                            <div className="flex items-center gap-2">
                                                <input 
                                                        type="radio" 
                                                        name="addressGroup" 
                                                        checked={isAddingNewAddress}
                                                        onChange={() => setIsAddingNewAddress(true)}
                                                        className="hidden"
                                                />
                                                <Plus size={20} />
                                                <span className="font-bold">Add New Address</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {(isAddingNewAddress || addresses.length === 0) && (
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 col-span-2 md:col-span-1">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Full Name</label>
                                            <input 
                                                type="text" 
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                                                value={newAddress.full_name}
                                                onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})}
                                                placeholder="e.g. Ramesh Reddy"
                                            />
                                        </div>
                                        <div className="space-y-2 col-span-2 md:col-span-1">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Phone</label>
                                            <input 
                                                type="text" 
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                                                value={newAddress.phone}
                                                onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                                                placeholder="10-digit mobile number"
                                            />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Farm Delivery Address</label>
                                            <textarea 
                                                rows="3"
                                                placeholder="Enter complete address including landmarks and pincode..."
                                                className="w-full bg-slate-50 border border-slate-200 rounded-[24px] px-6 py-4 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-400 placeholder:font-medium resize-none"
                                                value={newAddress.address}
                                                onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                                                required
                                            ></textarea>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <Wallet size={24} className="text-emerald-600" /> Payment Method
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className={`cursor-pointer rounded-[24px] p-6 border-2 transition-all flex items-center gap-4 ${paymentMethod === 'COD' ? 'border-emerald-500 bg-emerald-50/50 shadow-md scale-[1.02]' : 'border-slate-100 hover:border-emerald-200 bg-white'}`}>
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="COD" 
                                        checked={paymentMethod === 'COD'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                    />
                                    <div>
                                        <p className="font-black text-slate-900 text-lg">Cash on Delivery</p>
                                        <p className="text-xs font-bold text-slate-400">Pay when order arrives at farm</p>
                                    </div>
                                    <div className="ml-auto w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center font-black text-emerald-600 text-xl">₹</div>
                                </label>

                                <label className={`cursor-pointer rounded-[24px] p-6 border-2 transition-all flex items-center gap-4 ${paymentMethod === 'ONLINE' ? 'border-emerald-500 bg-emerald-50/50 shadow-md scale-[1.02]' : 'border-slate-100 hover:border-emerald-200 bg-white'}`}>
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="ONLINE" 
                                        checked={paymentMethod === 'ONLINE'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                    />
                                    <div>
                                        <p className="font-black text-slate-900 text-lg">Pay Online</p>
                                        <p className="text-xs font-bold text-slate-400">UPI, Cards, NetBanking</p>
                                    </div>
                                    <div className="ml-auto flex gap-1">
                                         {/* Mock payment icons */}
                                         <div className="w-8 h-8 bg-[#ED2590] rounded-lg text-white font-black text-[10px] flex justify-center items-center italic">pe</div>
                                         <div className="w-8 h-8 bg-[#00267F] rounded-lg text-white font-black text-[10px] flex justify-center items-center italic">gPay</div>
                                    </div>
                                </label>
                            </div>
                        </div>

                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 sticky top-32">
                            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <ShoppingBag size={24} className="text-emerald-600" /> Summary
                            </h3>
                            
                            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {cartDetails.map(item => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 rounded-xl bg-slate-50 p-2 shrink-0 border border-slate-100">
                                            <img src={item.images[0]} className="w-full h-full object-contain mix-blend-multiply" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-900 text-sm line-clamp-2 leading-tight">{item.name}</p>
                                            <p className="text-xs font-bold text-slate-400 mt-1">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="font-black text-slate-900 text-sm shrink-0">
                                            ₹{(item.discountedPrice || item.price) * item.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 mb-6 pt-6 border-t border-slate-100">
                                <div className="flex justify-between text-slate-500 font-medium">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-slate-900">₹{subTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-slate-500 font-medium">
                                    <span>Shipping</span>
                                    <span className="font-bold text-slate-900">₹{shipping.toLocaleString()}</span>
                                </div>
                            </div>
                            
                            <div className="border-t border-slate-200 pt-6 mb-8">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Total to Pay</span>
                                    <span className="text-4xl font-black text-emerald-700">₹{total.toLocaleString()}</span>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:shadow-none text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-200 active:scale-[0.98] transition-all text-lg"
                            >
                                {loading ? 'Processing...' : `Confirm Order - ₹${total.toLocaleString()}`}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Checkout;
