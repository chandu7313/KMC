import React, { useState } from 'react';
import { 
    LayoutDashboard, Database, Leaf, Wallet, LineChart, HeadphonesIcon, Settings, LogOut,
    Search, Bell, Plus, Minus, ShoppingCart, Check, Share, ArrowLeft, ArrowRight, Download, ChevronRight, UserCircle
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '@/app/providers/AppContext';
import { toast } from 'react-toastify';
import Navbar from '@/app/layouts/Navbar';
const NavItem = ({ icon, label, active = false, muted = false, activeClass = "" }) => (
    <div className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer 
        ${active ? activeClass : 'hover:bg-[#2e6b2e] rounded-[6px] transition-colors'} 
        ${!active && muted ? 'text-[#a3a3a3]' : ''}
        ${!active && !muted ? 'text-white' : ''}`}>
        {icon}
        <span className="text-[13px] font-bold tracking-wide">{label}</span>
    </div>
);

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [qty, setQty] = useState(1);
    const { backendUrl, getCartCount, setCartItems, cartItems, getCartData, isLoggedin } = React.useContext(AppContext);
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState('');

    const fetchProductData = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post(`${backendUrl}/api/product/single`, { productId: id });
            if (data.success) {
                setProduct(data.product);
                if (data.product.images && data.product.images.length > 0) {
                    setImage(data.product.images[0]);
                }
                // Once we have product category, fetch related products
                fetchRelatedProducts(data.product.category, id);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedProducts = async (category, currentId) => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/product/list`);
            if (data.success) {
                // Filter by category and exclude current product, then limit to 4
                const related = data.products
                    .filter(p => p.category === category && p.id !== currentId)
                    .slice(0, 4);
                setRelatedProducts(related);
            }
        } catch (error) {
            console.error("Error fetching related products:", error);
        }
    };

    const handleAddToCart = async () => {
        if (!isLoggedin) {
            toast.error('Please log in to add items to your cart.');
            return;
        }
        try {
            const currentQty = cartItems[product?.id] || 0;
            const newQty = currentQty + qty;

            const { data } = await axios.post(`${backendUrl}/api/cart/update`, {
                itemId: product.id,
                quantity: newQty
            });

            if (data.success) {
                toast.success(`Added ${qty} ${product.name} to your cart!`);
                getCartData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleBuyNow = async () => {
        if (!isLoggedin) {
            toast.error('Please log in to purchase.');
            return;
        }
        await handleAddToCart();
        navigate('/cart');
    };

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    React.useEffect(() => {
        if (id) {
            fetchProductData();
        }
    }, [id]);

    if (loading) {
        return <div className="flex flex-col items-center justify-center h-screen w-full bg-[#f8fafc]"><div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div><p className="font-bold text-slate-500 uppercase tracking-widest text-xs">Loading Product...</p></div>;
    }

    if (!product) {
        return <div className="flex items-center justify-center h-screen w-full font-black text-2xl text-slate-800">Product not found.</div>;
    }

    return (
        <div className="flex flex-col h-screen w-full overflow-hidden bg-white text-[#1a1a1a] font-sans !p-0 !m-0">
            <Navbar />

            {/* MAIN CONTENT AREA */}
            <div className="flex-grow flex flex-col overflow-y-auto relative no-scrollbar bg-white mt-20">
                




                <main className="w-full h-full flex flex-col">
                    
                    {/* ===== DESKTOP CONTENT ===== */}
                    <div className="max-w-[1100px] w-full mx-auto px-10 py-10 hidden md:block">
                        

                        {/* Hero 2 Col */}
                        <div className="grid grid-cols-[1fr_1.15fr] gap-14">
                            {/* Left: Images */}
                            <div className="flex flex-col gap-4">
                                <div className="bg-[#f5f5f5] aspect-square rounded-[8px] flex items-center justify-center relative overflow-hidden group">
                                    <img src={image} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-[1.03]" alt={product.name} />
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    {product.images?.map((img, idx) => (
                                        <div key={idx} onClick={() => setImage(img)} className={`aspect-square bg-gray-50 rounded-[6px] overflow-hidden cursor-pointer hover:border-[#4caf50] transition-colors ${img === image ? 'border-[2px] border-[#4caf50] shadow-[0_0_0_1px_rgba(76,175,80,0.2)]' : 'border border-gray-200'}`}>
                                            <img src={img} className="w-full h-full object-contain mix-blend-multiply opacity-70 hover:opacity-100 transition-opacity" alt={`Thumb ${idx}`} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Details */}
                            <div className="flex flex-col pt-1">
                                <div className="flex items-center gap-3 mb-5">
                                    <span className="bg-[#4caf50] text-white text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-full shadow-sm">
                                        {product.category}
                                    </span>
                                </div>
                                
                                <h1 className="text-[36px] leading-[1.1] font-black text-[#1a1a1a] mb-4 tracking-tight">
                                    {product.name}
                                </h1>
                                <p className="text-[14px] text-[#666] font-bold mb-7 tracking-wide flex items-center gap-2">
                                    Brand: <span className="text-[#1a1a1a]">KMC</span> <span className="text-gray-300">•</span> SKU: <span className="text-[#1a1a1a]">{product.id.slice(-8).toUpperCase()}</span>
                                </p>

                                <div className="flex items-end gap-4 mb-4 mt-1">
                                    <span className="text-[44px] font-black text-[#1a1a1a] leading-none tracking-tight">₹{product.price}</span>
                                    {product.discountedPrice && product.discountedPrice !== product.price && (
                                        <>
                                            <span className="text-[20px] text-[#999] line-through font-bold leading-none relative bottom-[6px]">₹{product.price + 200}</span>
                                        </>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 text-[13px] text-[#2e6b2e] font-black mb-8 uppercase tracking-wide">
                                    <div className="bg-[#4caf50] text-white p-[3px] rounded-full shadow-sm">
                                        <Check size={12} strokeWidth={4} />
                                    </div>
                                    {product.stock > 0 ? "In Stock" : "Out of Stock"} <span className="text-[#666] font-bold ml-1 capitalize tracking-normal">({product.stock} Units Available)</span>
                                </div>

                                {/* Bulk Pricing Card */}
                                <div className="bg-[#f5f5f5] rounded-[8px] p-6 mb-10 border border-gray-200">
                                    <h3 className="text-[11px] font-black text-[#666] tracking-[0.15em] uppercase mb-5">Bulk Order Pricing</h3>
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[12px] text-[#666] font-black mb-1.5 uppercase tracking-wider">1-10 Units</span>
                                            <span className="text-[18px] font-black text-[#1a1a1a]">₹{product.price}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[12px] text-[#666] font-black mb-1.5 uppercase tracking-wider">11-50 Units</span>
                                            <span className="text-[18px] font-black text-[#1a1a1a]">₹11,800</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[12px] text-[#666] font-black mb-1.5 uppercase tracking-wider">51-100 Units</span>
                                            <span className="text-[18px] font-black text-[#1a1a1a]">₹10,950</span>
                                        </div>
                                        <div className="flex flex-col border-l-2 border-gray-200 pl-4">
                                            <span className="text-[12px] text-[#666] font-black mb-1.5 uppercase tracking-wider">100+ Units</span>
                                            <span className="text-[18px] font-black text-[#2e6b2e]">Quote</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Add to Cart Actions */}
                                <div className="flex gap-4 items-stretch mb-2 h-[56px]">
                                    <div className="flex items-center border-[2px] border-gray-200 rounded-[6px] bg-white w-[140px] font-black text-lg">
                                        <button className="w-12 h-full flex items-center justify-center text-[#666] hover:text-[#1a1a1a] hover:bg-gray-50 transition-colors rounded-l-[4px]" onClick={() => setQty(Math.max(1, qty-1))}><Minus size={18} strokeWidth={3}/></button>
                                        <span className="flex-1 text-center text-[#1a1a1a]">{qty}</span>
                                        <button className="w-12 h-full flex items-center justify-center text-[#666] hover:text-[#1a1a1a] hover:bg-gray-50 transition-colors rounded-r-[4px]" onClick={() => setQty(qty+1)}><Plus size={18} strokeWidth={3}/></button>
                                    </div>
                                    <button onClick={handleAddToCart} className="flex-1 bg-[#1b3d1b] hover:bg-[#112411] text-white flex items-center justify-center gap-2.5 rounded-[6px] font-black text-[15px] transition-colors shadow-lg px-6 uppercase tracking-wider">
                                        <ShoppingCart size={18} strokeWidth={2.5}/> Add to Cart
                                    </button>
                                    <button onClick={handleBuyNow} className="px-10 bg-[#1a1a1a] hover:bg-black text-white rounded-[6px] font-black text-[15px] transition-colors shadow-lg uppercase tracking-wider">
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* divider */}
                        <hr className="my-[70px] border-gray-200" />

                        {/* Description & Specs Section */}
                        <div className="mb-16">
                            <div className="flex gap-16">
                                <div className="flex-[1.2]">
                                    <div className="flex items-center gap-3.5 mb-7">
                                        <div className="w-[5px] h-7 bg-[#4caf50] rounded-full"></div>
                                        <h2 className="text-[26px] font-black tracking-tight text-[#1a1a1a]">Description</h2>
                                    </div>
                                    <div className="text-[#666] text-[15px] leading-[1.8] font-bold space-y-5">
                                        <p>{product.description}</p>
                                    </div>
                                </div>

                                <div className="flex-1 bg-white">
                                    <div className="mb-8">
                                        <h3 className="text-[19px] font-black mb-6 text-[#1a1a1a]">Detailed Specifications</h3>
                                        <div className="flex flex-col text-[14px]">
                                            {product.specifications ? Object.entries(product.specifications).map(([key, value]) => (
                                                <div key={key} className="flex justify-between border-b border-gray-100 py-3">
                                                  <span className="text-[#666] font-bold">{key}</span>
                                                  <span className="font-black text-[#1a1a1a]">{value}</span>
                                                </div>
                                            )) : (
                                                <div className="py-3 text-[#666] font-bold">No particular specifications provided.</div>
                                            )}
                                        </div>
                                    </div>
                                    <button className="text-[#2e6b2e] font-black flex items-center justify-center gap-2.5 w-full py-4 border-[2px] border-[#2e6b2e] rounded-[6px] hover:bg-[#f0faf0] transition-colors text-[13px] uppercase tracking-[0.1em]">
                                        <Download size={18} strokeWidth={2.5}/> Download Safety Data Sheet
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Usage Instructions */}
                        <div className="mb-20">
                            <div className="flex items-center gap-3.5 mb-7">
                                <div className="w-[5px] h-7 bg-[#4caf50] rounded-full"></div>
                                <h2 className="text-[26px] font-black tracking-tight text-[#1a1a1a]">Usage Instructions</h2>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="bg-[#f5f5f5] p-7 rounded-[8px] border border-gray-200 shadow-sm">
                                    <div className="w-[40px] h-[40px] rounded-full bg-white text-[#2e6b2e] font-black text-lg flex items-center justify-center mb-5 border border-gray-200 shadow-sm leading-none">1</div>
                                    <p className="text-[14px] font-bold text-[#666] leading-[1.7]">
                                        Measure soil moisture levels before application. Ideal range is 40-60% saturation.
                                    </p>
                                </div>
                                <div className="bg-[#f5f5f5] p-7 rounded-[8px] border border-gray-200 shadow-sm">
                                    <div className="w-[40px] h-[40px] rounded-full bg-white text-[#2e6b2e] font-black text-lg flex items-center justify-center mb-5 border border-gray-200 shadow-sm leading-none">2</div>
                                    <p className="text-[14px] font-bold text-[#666] leading-[1.7]">
                                        Broadcast granules evenly at a rate of 50kg per acre for initial seasonal dressing.
                                    </p>
                                </div>
                                <div className="bg-[#f5f5f5] p-7 rounded-[8px] border border-gray-200 shadow-sm">
                                    <div className="w-[40px] h-[40px] rounded-full bg-white text-[#2e6b2e] font-black text-lg flex items-center justify-center mb-5 border border-gray-200 shadow-sm leading-none">3</div>
                                    <p className="text-[14px] font-bold text-[#666] leading-[1.7]">
                                        Irrigate within 12 hours of application to activate the bio-membrane coating.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="h-4"></div>

                        {/* Related Solutions */}
                        <div className="mb-20">
                            <div className="flex items-end justify-between mb-8">
                                <div>
                                    <h2 className="text-[28px] font-black tracking-tight text-[#1a1a1a] mb-1.5">Related Solutions</h2>
                                    <p className="text-[#666] text-[15px] font-bold">Top-rated additives for your specific crop cycle</p>
                                </div>
                                <button className="text-[#2e6b2e] font-black text-[13px] tracking-[0.1em] flex items-center gap-2 hover:text-[#1b3d1b] transition-colors uppercase">
                                    View All Inventory <ArrowRight size={16} strokeWidth={3}/>
                                </button>
                            </div>

                            <div className="grid grid-cols-4 gap-6">
                                {relatedProducts.length > 0 ? relatedProducts.map((item, idx) => (
                                    <div 
                                        key={item.id} 
                                        onClick={() => navigate(`/marketplace/product/${item.id}`)}
                                        className="border border-gray-200 rounded-[8px] p-4 group hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer bg-white"
                                    >
                                        <div className="bg-[#f5f5f5] aspect-square rounded-[6px] mb-4 overflow-hidden relative">
                                            {idx % 2 === 0 && (
                                                <span className="absolute top-2.5 left-2.5 bg-white text-[#2e6b2e] border border-gray-200 text-[10px] font-black px-2 py-0.5 rounded-[4px] shadow-sm tracking-[0.05em]">RECOMMENDED</span>
                                            )}
                                            <img src={item.images?.[0] || 'https://placehold.co/400x400?text=Product'} alt={item.name} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500 mix-blend-multiply" />
                                        </div>
                                        <h4 className="font-black text-[15px] text-[#1a1a1a] mb-1.5 leading-[1.3] tracking-tight line-clamp-2">{item.name}</h4>
                                        <p className="font-black text-[17px] text-[#1a1a1a]">₹{item.price}</p>
                                    </div>
                                )) : (
                                    <div className="col-span-4 py-10 text-center text-[#999] font-bold border-2 border-dashed border-gray-100 rounded-xl">
                                        Discovering more solutions for you...
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <footer className="border-t border-gray-200 pt-16 pb-10">
                            <div className="grid grid-cols-4 gap-12 mb-16">
                                <div className="pr-4">
                                    <h3 className="font-black text-[22px] mb-4 tracking-tight text-[#1a1a1a]">KMC Agriculture</h3>
                                    <p className="text-[14px] text-[#666] font-bold leading-[1.8]">
                                        Premium agricultural consultancy and estate management input supplier since 1994. Elevating yields organically.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-black mb-6 flex items-center gap-2.5 text-[#1a1a1a]"><span className="w-1.5 h-4 bg-[#4caf50] rounded-full inline-block"></span> Quick Links</h4>
                                    <ul className="text-[14px] text-[#666] space-y-4 font-bold">
                                        <li className="hover:text-[#4caf50] cursor-pointer transition-colors w-fit">Track Order</li>
                                        <li className="hover:text-[#4caf50] cursor-pointer transition-colors w-fit">Bulk Quote Request</li>
                                        <li className="hover:text-[#4caf50] cursor-pointer transition-colors w-fit">Estate Consultancy</li>
                                        <li className="hover:text-[#4caf50] cursor-pointer transition-colors w-fit">Terms of Service</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-black mb-6 flex items-center gap-2.5 text-[#1a1a1a]"><span className="w-1.5 h-4 bg-[#4caf50] rounded-full inline-block"></span> Support</h4>
                                    <ul className="text-[14px] text-[#666] space-y-4 font-bold">
                                        <li className="hover:text-[#4caf50] cursor-pointer transition-colors w-fit">Safety Datasheets</li>
                                        <li className="hover:text-[#4caf50] cursor-pointer transition-colors w-fit">Shipping Policy</li>
                                        <li className="hover:text-[#4caf50] cursor-pointer transition-colors w-fit">Refunds & Returns</li>
                                        <li className="hover:text-[#4caf50] cursor-pointer transition-colors w-fit">Partner Program</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-black mb-6 flex items-center gap-2.5 text-[#1a1a1a]"><span className="w-1.5 h-4 bg-[#4caf50] rounded-full inline-block"></span> Stay Updated</h4>
                                    <div className="flex border-[2px] border-gray-200 rounded-[6px] overflow-hidden h-[46px] mb-2 focus-within:border-[#4caf50] transition-colors">
                                        <input type="email" placeholder="Email Address" className="w-full text-sm pl-4 font-bold outline-none placeholder:text-[#999] text-[#1a1a1a]" />
                                        <button className="bg-[#1b3d1b] hover:bg-black text-white px-6 text-[13px] font-black transition-colors tracking-widest uppercase">Join</button>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-gray-200 pt-8 flex items-center justify-between text-[13px] text-[#999] font-bold">
                                <span>© 2024 KMC Agriculture Estate Management Services. All Rights Reserved.</span>
                                <span>ISO 9001:2015 Certified.</span>
                            </div>
                        </footer>
                    </div>

                    {/* ===== MOBILE CONTENT ===== */}
                    <div className="md:hidden block w-full px-0 sm:pb-28 pb-24 relative overflow-x-hidden">
                        {/* Hero Image */}
                        <div className="relative w-full aspect-[4/5] bg-gray-50 overflow-hidden">
                            <img src={image} alt={product.name} className="w-full h-full object-contain" />
                            <div className="absolute bottom-5 left-5">
                                <span className="bg-[#1e4d1e] text-white text-[10px] font-black px-3.5 py-1.5 rounded-full shadow-lg border border-white/20 tracking-wider">
                                    PREMIUM GRADE
                                </span>
                            </div>
                        </div>

                        <div className="px-5 py-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[11px] text-[#999] font-black uppercase tracking-[0.1em]">Agri-Input</span>
                                <span className="text-[#ccc] text-[10px]">/</span>
                                <span className="text-[11px] text-[#666] font-black uppercase tracking-[0.1em]">{product.category}</span>
                            </div>
                            <h1 className="text-[26px] font-black text-[#1a1a1a] mb-2 leading-[1.15] tracking-tight">
                                {product.name}
                            </h1>
                            <p className="text-[12px] text-[#666] font-bold mb-6 flex items-center gap-1.5">
                                Brand: <span className="text-[#1a1a1a]">KMC</span> <span className="text-gray-300">•</span> SKU: <span className="text-[#1a1a1a]">{product.id.slice(-8).toUpperCase()}</span>
                            </p>

                            <div className="flex items-end gap-3 mb-6">
                                <span className="text-[32px] font-black text-[#1a1a1a] leading-none tracking-tight">₹{product.price}</span>
                            </div>

                            <div className="mb-7">
                                <span className="inline-flex items-center gap-2 bg-[#e8f5e9] text-[#2e6b2e] px-3.5 py-1.5 rounded-full text-[12px] font-black border border-[#2e6b2e]/10 tracking-wide">
                                    <Check size={14} strokeWidth={3}/> {product.stock} units available in stock
                                </span>
                            </div>

                            {/* Mobile Quantity selector */}
                            <div className="mb-8">
                                <div className="flex justify-between items-end mb-3">
                                    <span className="text-[11px] font-black text-[#666] tracking-[0.1em] uppercase">Select Quantity</span>
                                    <span className="text-[11px] text-[#999] font-bold">Standard 25kg packaging</span>
                                </div>
                                <div className="flex items-center justify-between border-[2px] border-gray-200 rounded-[8px] bg-white h-[56px] w-full px-2">
                                    <button className="text-[#666] p-3 w-12 h-full flex items-center justify-center hover:bg-gray-50 rounded" onClick={() => setQty(Math.max(1, qty-1))}><Minus size={22} strokeWidth={2.5}/></button>
                                    <span className="font-black text-[20px] text-[#1a1a1a]">{qty}</span>
                                    <button className="text-[#666] p-3 w-12 h-full flex items-center justify-center hover:bg-gray-50 rounded" onClick={() => setQty(qty+1)}><Plus size={22} strokeWidth={2.5}/></button>
                                </div>
                            </div>

                            {/* Mobile Bulk Benefit */}
                            <div className="bg-[#f0faf0] rounded-[10px] p-5 mb-8 border border-[#4caf50]/20 shadow-sm">
                                <h3 className="font-black text-[15px] text-[#1e4d1e] mb-4 flex items-center gap-2 tracking-tight">
                                    <Leaf size={18} className="fill-[#4caf50]/20 text-[#4caf50]"/> Bulk Purchase Benefits
                                </h3>
                                <div className="flex flex-col">
                                    <div className="flex justify-between items-center text-[13px] border-b border-[#2e6b2e]/10 py-3.5">
                                        <span className="font-bold text-[#666]">10 - 49 bags</span>
                                        <div className="flex items-center gap-3">
                                            <span className="font-black text-[#1a1a1a]">₹1,380.00</span>
                                            <span className="text-[#4caf50] font-black bg-white px-2 py-1 rounded-[4px] text-[10px] uppercase tracking-wider min-w-[55px] text-center shadow-sm">5% Off</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-[13px] border-b border-[#2e6b2e]/10 py-3.5">
                                        <span className="font-bold text-[#666]">50 - 99 bags</span>
                                        <div className="flex items-center gap-3">
                                            <span className="font-black text-[#1a1a1a]">₹1,305.00</span>
                                            <span className="text-[#4caf50] font-black bg-white px-2 py-1 rounded-[4px] text-[10px] uppercase tracking-wider min-w-[55px] text-center shadow-sm">10% Off</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-[13px] pt-3.5">
                                        <span className="font-bold text-[#666]">100+ bags</span>
                                        <div className="flex items-center gap-3">
                                            <span className="font-black text-[#1e4d1e] text-[14px]">₹1,230.00</span>
                                            <span className="text-[#4caf50] font-black bg-white px-2 py-1 rounded-[4px] text-[10px] uppercase tracking-wider min-w-[55px] text-center shadow-sm">15% Off</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-10 border-gray-200" />

                            {/* Mobile Product Description */}
                            <div className="mb-12">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-[4px] h-6 bg-[#4caf50] rounded-full mt-0.5"></div>
                                    <h2 className="text-[20px] font-black tracking-tight text-[#1a1a1a]">Product Description</h2>
                                </div>
                                <p className="text-[14px] text-[#666] font-bold leading-[1.7]">
                                    {product.description}
                                </p>
                            </div>

                            {/* Mobile Usage Instructions */}
                            <div className="mb-14">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-[4px] h-6 bg-[#4caf50] rounded-full mt-0.5"></div>
                                    <h2 className="text-[20px] font-black tracking-tight text-[#1a1a1a]">Usage Instructions</h2>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="bg-[#f5f5f5] w-full rounded-[10px] p-5 flex gap-4 items-start border border-gray-200 shadow-sm">
                                        <div className="w-8 h-8 rounded-full bg-white text-[#2e6b2e] font-black flex items-center justify-center text-sm shadow-sm shrink-0 mt-0.5 leading-none">1</div>
                                        <p className="text-[13px] text-[#666] font-bold leading-[1.6]">Dilute 500g of Nitro-Max in 100 liters of water for foliar application.</p>
                                    </div>
                                    <div className="bg-[#f5f5f5] w-full rounded-[10px] p-5 flex gap-4 items-start border border-gray-200 shadow-sm">
                                        <div className="w-8 h-8 rounded-full bg-white text-[#2e6b2e] font-black flex items-center justify-center text-sm shadow-sm shrink-0 mt-0.5 leading-none">2</div>
                                        <p className="text-[13px] text-[#666] font-bold leading-[1.6]">Apply during early morning or late evening to ensure maximum absorption and prevent evaporation.</p>
                                    </div>
                                    <div className="bg-[#f5f5f5] w-full rounded-[10px] p-5 flex gap-4 items-start border border-gray-200 shadow-sm">
                                        <div className="w-8 h-8 rounded-full bg-white text-[#2e6b2e] font-black flex items-center justify-center text-sm shadow-sm shrink-0 mt-0.5 leading-none">3</div>
                                        <p className="text-[13px] text-[#666] font-bold leading-[1.6]">For drip irrigation, ensure the filter system is clean before injecting the solution.</p>
                                    </div>
                                    <div className="bg-[#f5f5f5] w-full rounded-[10px] p-5 flex gap-4 items-start border border-gray-200 shadow-sm">
                                        <div className="w-8 h-8 rounded-full bg-white text-[#2e6b2e] font-black flex items-center justify-center text-sm shadow-sm shrink-0 mt-0.5 leading-none">4</div>
                                        <p className="text-[13px] text-[#666] font-bold leading-[1.6]">Repeat every 15-20 days during the vegetative growth phase of the crop.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Essential Pairings */}
                            <div className="mb-4">
                                <div className="flex items-end justify-between mb-6">
                                    <div>
                                        <h2 className="text-[22px] font-black tracking-tight text-[#1a1a1a]">Essential Pairings</h2>
                                        <p className="text-[#666] text-[13px] font-bold mt-1">Commonly purchased together</p>
                                    </div>
                                    <button className="text-[#2e6b2e] font-black text-[12px] flex items-center uppercase tracking-wide">
                                        View All <ArrowRight size={14} strokeWidth={3} className="ml-1"/>
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {relatedProducts.length > 0 ? relatedProducts.map((item, idx) => (
                                        <div 
                                            key={item.id} 
                                            onClick={() => navigate(`/marketplace/product/${item.id}`)}
                                            className="border border-gray-200 rounded-[8px] p-3.5 text-left bg-white shadow-sm active:scale-95 transition-transform"
                                        >
                                            <div className="bg-[#f5f5f5] aspect-square rounded-[6px] mb-3 relative overflow-hidden">
                                                {idx % 3 === 0 && (
                                                    <span className="absolute top-2 left-2 bg-[#4caf50] text-white text-[9px] font-black px-1.5 py-0.5 rounded-[3px] shadow-sm leading-none tracking-wider uppercase">IN STOCK</span>
                                                )}
                                                <img src={item.images?.[0] || 'https://placehold.co/200x200?text=Product'} className="w-full h-full object-cover mix-blend-multiply opacity-80" alt={item.name} />
                                            </div>
                                            <h4 className="font-black text-[13px] text-[#1a1a1a] mb-1.5 line-clamp-2 leading-[1.3] tracking-tight">{item.name}</h4>
                                            <p className="font-black text-[16px] text-[#1a1a1a]">₹{item.price}</p>
                                        </div>
                                    )) : (
                                        <div className="col-span-2 py-8 text-center text-[10px] text-[#999] font-black uppercase tracking-widest border border-dashed border-gray-200 rounded-lg">
                                            Loading pairings...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Mobile Sticky Bottom Bar */}
                        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 pb-8 z-30 flex gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.06)]">
                            <button onClick={handleAddToCart} className="flex-[0.8] bg-white border-[2px] border-[#2e6b2e] text-[#2e6b2e] h-[54px] rounded-[8px] font-black flex items-center justify-center gap-2 active:bg-[#f0faf0] transition-colors text-[14px]">
                                <ShoppingCart size={18} strokeWidth={3}/> Add to Cart
                            </button>
                            <button onClick={handleBuyNow} className="flex-[1.2] bg-[#1a1a1a] text-white h-[54px] rounded-[8px] font-black flex items-center justify-center gap-2 shadow-xl active:bg-black transition-colors text-[16px]">
                                <span className="text-[20px] leading-none mb-0.5">⚡</span> Buy Now
                            </button>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default ProductDetail;
