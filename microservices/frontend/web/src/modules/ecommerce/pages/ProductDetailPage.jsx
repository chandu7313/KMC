import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
    Search, Bell, LayoutDashboard, Sprout, Database, LineChart, 
    HeadphonesIcon, Settings, LogOut, Plus, Minus, ShoppingCart, 
    Check, FileText, ArrowRight
} from 'lucide-react';
import { useGlobalStore } from '@/app/store/globalStore';
import { useCartStore } from '@/modules/ecommerce/store/cartStore';
import API from '@/core/api/api.config';

const NavItem = ({ icon, label, active = false, onClick }) => (
    <div 
        onClick={onClick}
        className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors ${active ? 'bg-[#1b5e20] text-white rounded-r-full mr-4 shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
        {icon}
        <span className="text-[13px] font-bold tracking-wide">{label}</span>
    </div>
);

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [qty, setQty] = useState(1);
    const { backendUrl, isLoggedin, setIsLoggedin, setUserData } = useGlobalStore();
    const { getCartCount, setCartItems, cartItems, getCartData } = useCartStore();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState('');

    const fetchProductData = async () => {
        try {
            setLoading(true);
            if (!/^[0-9a-fA-F]{24}$/.test(id)) {
                setMockProductData();
                return;
            }
            const { data } = await axios.get(`${backendUrl}${API.PRODUCT}/${id}`);
            if (data.success) {
                const productData = data.product || data.data?.product;
                setProduct(productData);
                if (productData) {
                    setActiveImage(productData.image || productData.images?.[0]);
                    fetchRelatedProducts(productData.category, id);
                }
            } else {
                setMockProductData();
            }
        } catch (error) {
            setMockProductData();
        } finally {
            setLoading(false);
        }
    };

    const setMockProductData = () => {
        const mockData = {
            id: id || 'FERT-0092',
            name: 'Bio-Active Nitrogen Complex NPK 10-10-10',
            brand: 'EstatePure Pro',
            sku: 'KMC-FERT-0092',
            price: 12450.00,
            originalPrice: 14000.00,
            discount: '17%',
            category: 'SOIL NUTRITION',
            stock: 420,
            description: 'Our Bio-Active Nitrogen Complex is an elite-grade granular fertilizer specifically engineered for large-scale estate management. It utilizes a proprietary slow-release technology that ensures your crops receive a steady, sustained flow of nutrients over a 90-day cycle.\n\nOptimized for wheat, paddy, and sugarcane, this NPK 10-10-10 balanced formula promotes vigorous root development and increases overall biomass yield by up to 24% compared to standard generic alternatives.',
            images: [
                'https://placehold.co/600x600/7cb342/ffffff?text=BIO-ACTIVE\nFERTILIZER',
                'https://placehold.co/200x200/e6c27a/ffffff?text=Granules',
                'https://placehold.co/200x200/558b2f/ffffff?text=Field',
                'https://placehold.co/200x200/e0e0e0/000000?text=Bag',
                'https://placehold.co/200x200/3e2723/ffffff?text=Soil'
            ],
            usage: [
                'Measure soil moisture levels before application. Ideal range is 40-60% saturation.',
                'Broadcast granules evenly at a rate of 50kg per acre for initial seasonal dressing.',
                'Irrigate within 12 hours of application to activate the bio-membrane coating.'
            ],
            specs: {
                'Physical State': 'Granular',
                'Nutrient Ratio': '10:10:10',
                'Organic Matter': '15% Min',
                'Release Time': '90 Days',
                'Weight per Bag': '50kg (Net)',
                'Toxicity Level': 'Low / Eco-Safe'
            }
        };
        setProduct(mockData);
        setActiveImage(mockData.images[0]);
        setRelatedProducts(getMockRelated());
    };

    const fetchRelatedProducts = async (category, currentId) => {
        try {
            const { data } = await axios.get(`${backendUrl}${API.PRODUCT}/list`);
            if (data.success) {
                const productsList = data.products || data.data?.products || [];
                const related = productsList
                    .filter(p => p.category === category && p.id !== currentId)
                    .slice(0, 4);
                setRelatedProducts(related.length > 0 ? related : getMockRelated());
            } else {
                setRelatedProducts(getMockRelated());
            }
        } catch (error) {
            setRelatedProducts(getMockRelated());
        }
    };

    const getMockRelated = () => [
        { id: 101, name: 'Neem Guard Liquid Pesticide', price: 4200.00, image: 'https://placehold.co/300x300/4caf50/ffffff?text=Neem+Guard', tag: 'ECO-CERTIFIED' },
        { id: 102, name: 'Hybrid Tomato Seeds V2', price: 850.00, image: 'https://placehold.co/300x300/795548/ffffff?text=Seeds', tag: 'TOP RATED' },
        { id: 103, name: 'Solar Irrigation Controller', price: 28900.00, image: 'https://placehold.co/300x300/03a9f4/ffffff?text=Controller', tag: null },
        { id: 104, name: 'Digital pH & Moisture Meter', price: 3450.00, image: 'https://placehold.co/300x300/607d8b/ffffff?text=Meter', tag: null },
    ];

    const handleAddToCart = async () => {
        if (!isLoggedin) {
            toast.error('Please log in to add items to your cart.');
            return;
        }
        try {
            const currentQty = cartItems[product?.id] || 0;
            const newQty = currentQty + qty;

            const { data } = await axios.post(`${backendUrl}${API.CART}/update`, {
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
            toast.success("Added to cart (Mock)");
        }
    };

    const handleBuyNow = async () => {
        await handleAddToCart();
        navigate('/checkout');
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchProductData();
    }, [id]);

    const handleLogout = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(backendUrl + "/api/auth/logout");
            if (data.success) {
                setIsLoggedin(false);
                setUserData(false);
                navigate("/login");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (loading || !product) {
        return <div className="flex h-screen items-center justify-center bg-white"><div className="w-8 h-8 border-4 border-slate-200 border-t-[#1b5e20] rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="flex h-screen bg-white font-sans overflow-hidden">
            
            {/* Left Sidebar - Estate Management */}
            <aside className="w-[260px] bg-[#f4f5f4] border-r border-slate-200 flex flex-col shrink-0">
                <div className="p-6 pb-8">
                    <h1 className="text-[18px] font-black text-[#1b5e20] tracking-tight mb-0.5">KMC Agriculture</h1>
                    <p className="text-[11px] text-slate-500 font-bold tracking-wide leading-tight">PREMIUM ESTATE<br/>MANAGEMENT</p>
                </div>

                <nav className="flex-1 overflow-y-auto mt-4">
                    <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => navigate('/admin/dashboard')} />
                    <NavItem icon={<Sprout size={20} />} label="Crops" onClick={() => navigate('/admin/crops')} />
                    <NavItem icon={<Database size={20} />} label="Inventory" active={true} onClick={() => navigate('/marketplace')} />
                    <NavItem icon={<LayoutDashboard size={20} className="rotate-180" />} label="Financials" onClick={() => navigate('/admin/analytics')} />
                    <NavItem icon={<LineChart size={20} />} label="Analytics" onClick={() => navigate('/admin/analytics')} />
                    <NavItem icon={<HeadphonesIcon size={20} />} label="Support" onClick={() => navigate('/admin/support')} />
                </nav>

                <div className="p-6 space-y-4">
                    <button 
                        onClick={() => navigate('/admin/reports/new')}
                        className="w-full bg-[#1b5e20] hover:bg-green-900 text-white flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-[13px] shadow-sm transition-colors">
                        <Plus size={16} strokeWidth={3} /> New Report
                    </button>
                    <div 
                        onClick={() => navigate('/admin/settings')}
                        className="flex items-center gap-3 px-2 py-2 cursor-pointer text-slate-600 hover:text-slate-900 transition-colors">
                        <Settings size={18} /> <span className="text-[13px] font-bold">Settings</span>
                    </div>
                    <div 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-2 py-2 cursor-pointer text-slate-600 hover:text-slate-900 transition-colors">
                        <LogOut size={18} /> <span className="text-[13px] font-bold">Logout</span>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
                
                {/* Header */}
                <header className="h-[80px] border-b border-slate-100 flex items-center justify-between px-10 shrink-0 bg-white z-10">
                    <h2 className="text-[20px] font-black text-[#1b5e20] tracking-tight">KMC Shop</h2>
                    
                    <div className="flex-1 max-w-[600px] px-8">
                        <div className="relative flex items-center w-full bg-[#f4f5f4] rounded-[8px] px-4 py-2.5">
                            <Search className="text-slate-400 mr-3" size={18} />
                            <input 
                                type="text"
                                placeholder="Search inputs, seeds, tools..."
                                className="bg-transparent border-none outline-none w-full text-[13px] font-bold text-slate-800 placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative text-slate-600 hover:text-slate-900">
                            <Bell size={20} />
                        </button>
                        <div className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 overflow-hidden bg-white cursor-pointer">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    <div className="max-w-[1200px] mx-auto px-10 py-8">
                        
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 mb-8 text-[12px] font-bold">
                            <span className="text-slate-500 cursor-pointer hover:text-slate-900">Inventory</span>
                            <ChevronRightIcon />
                            <span className="text-slate-500 cursor-pointer hover:text-slate-900">Soil Nutrition</span>
                            <ChevronRightIcon />
                            <span className="text-slate-900">{product.name}</span>
                        </div>

                        {/* Top Section: Image & Basic Info */}
                        <div className="flex flex-col lg:flex-row gap-12 mb-16">
                            
                            {/* Left: Images */}
                            <div className="w-full lg:w-[45%] shrink-0">
                                <div className="bg-[#f0f4f0] aspect-square rounded-[16px] mb-4 overflow-hidden p-6 flex items-center justify-center border border-slate-100">
                                    <img src={activeImage} alt={product.name} className="w-full h-full object-contain mix-blend-multiply drop-shadow-md" />
                                </div>
                                <div className="grid grid-cols-5 gap-3">
                                    {product.images?.map((img, idx) => (
                                        <div 
                                            key={idx} 
                                            onClick={() => setActiveImage(img)}
                                            className={`aspect-square rounded-[8px] overflow-hidden cursor-pointer border-2 transition-all ${activeImage === img ? 'border-[#1b5e20]' : 'border-transparent'}`}
                                        >
                                            <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                                            {idx === 4 && product.images.length > 5 && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-[12px] font-black">
                                                    +{product.images.length - 5}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Info */}
                            <div className="w-full lg:w-[55%] pt-2">
                                <span className="bg-[#e8f5e9] text-[#1b5e20] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-[4px] mb-4 inline-block">
                                    {product.category}
                                </span>
                                
                                <h1 className="text-[32px] font-black text-slate-900 leading-[1.1] mb-3 tracking-tight">
                                    {product.name}
                                </h1>
                                
                                <p className="text-[13px] font-bold text-slate-500 mb-6">
                                    Brand: <span className="text-slate-900 mr-3">{product.brand}</span> • <span className="ml-3">SKU: <span className="text-slate-900">{product.sku}</span></span>
                                </p>
                                
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-[36px] font-black text-[#1b5e20] tracking-tight leading-none">₹{product.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                    {product.originalPrice && (
                                        <>
                                            <span className="text-[18px] font-bold text-slate-400 line-through">₹{product.originalPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                            <span className="text-[11px] font-black text-slate-900 tracking-wider">SAVE {product.discount} <span className="text-slate-500 font-bold ml-1">(बचत करें)</span></span>
                                        </>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 mb-8 text-[13px] font-black text-slate-900">
                                    <Check size={16} className="text-[#1b5e20]" strokeWidth={3} /> 
                                    In Stock <span className="text-slate-500 font-bold ml-1">({product.stock} Units Available)</span>
                                </div>

                                {/* Bulk Pricing */}
                                <div className="bg-[#f4f5f4] rounded-[12px] p-5 mb-8 border border-slate-100">
                                    <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-4">Bulk Order Pricing</h3>
                                    <div className="grid grid-cols-4 gap-2 text-center divide-x divide-slate-200">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-500 font-bold mb-1">1-10 Units</span>
                                            <span className="text-[14px] font-black text-slate-900">₹{product.price.toLocaleString()}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-500 font-bold mb-1">11-50 Units</span>
                                            <span className="text-[14px] font-black text-[#1b5e20]">₹11,800</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-500 font-bold mb-1">51-100 Units</span>
                                            <span className="text-[14px] font-black text-slate-900">₹10,950</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-500 font-bold mb-1">100+ Units</span>
                                            <span className="text-[14px] font-black text-slate-900">Quote</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-start gap-4">
                                    <div className="flex items-center justify-between bg-[#f4f5f4] rounded-[8px] h-[52px] w-[140px] px-2 border border-slate-200">
                                        <button className="w-10 h-full flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors" onClick={() => setQty(Math.max(1, qty-1))}><Minus size={16} strokeWidth={3}/></button>
                                        <span className="text-[16px] font-black text-slate-900">{qty}</span>
                                        <button className="w-10 h-full flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors" onClick={() => setQty(qty+1)}><Plus size={16} strokeWidth={3}/></button>
                                    </div>
                                    <button 
                                        onClick={handleAddToCart}
                                        className="bg-[#1b5e20] hover:bg-green-900 text-white h-[52px] px-8 rounded-[8px] font-black flex items-center gap-3 transition-colors shadow-lg"
                                    >
                                        <ShoppingCart size={18} strokeWidth={2.5}/> 
                                        <div className="flex flex-col text-left">
                                            <span className="text-[14px] leading-tight">Add to Cart</span>
                                            <span className="text-[10px] opacity-80 leading-tight">(कार्ट में डालें)</span>
                                        </div>
                                    </button>
                                    <button 
                                        onClick={handleBuyNow}
                                        className="bg-[#1a1a1a] hover:bg-black text-white h-[52px] px-8 rounded-[8px] font-black flex items-center gap-3 transition-colors shadow-lg"
                                    >
                                        <span className="text-[18px]">⚡</span> 
                                        <div className="flex flex-col text-left">
                                            <span className="text-[14px] leading-tight">Buy Now</span>
                                            <span className="text-[10px] opacity-80 leading-tight">(अभी खरीदें)</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Middle Section: Description & Specs */}
                        <div className="flex flex-col lg:flex-row gap-16 mb-20 border-t border-slate-100 pt-16">
                            
                            {/* Left: Description & Usage */}
                            <div className="w-full lg:w-[60%]">
                                <div className="mb-12">
                                    <h2 className="flex items-center gap-3 text-[22px] font-black text-slate-900 mb-6 tracking-tight">
                                        <div className="w-1.5 h-6 bg-[#1b5e20] rounded-full"></div>
                                        Description
                                    </h2>
                                    <div className="text-[14px] text-slate-600 font-medium leading-[1.8] space-y-4">
                                        {product.description.split('\n\n').map((para, i) => (
                                            <p key={i}>{para}</p>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h2 className="flex items-center gap-3 text-[22px] font-black text-slate-900 mb-6 tracking-tight">
                                        <div className="w-1.5 h-6 bg-[#d81b60] rounded-full"></div>
                                        Usage Instructions
                                    </h2>
                                    <div className="bg-[#f8faf9] rounded-[16px] p-8 space-y-6 border border-slate-100">
                                        {product.usage?.map((instruction, idx) => (
                                            <div key={idx} className="flex gap-5 items-start">
                                                <div className="w-7 h-7 rounded-full bg-white text-[#1b5e20] font-black flex items-center justify-center text-[12px] shadow-sm shrink-0 border border-slate-100 mt-0.5">
                                                    {idx + 1}
                                                </div>
                                                <p className="text-[13px] text-slate-700 font-bold leading-[1.6]">
                                                    {instruction}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Specifications */}
                            <div className="w-full lg:w-[40%]">
                                <div className="bg-white rounded-[16px] p-8 border border-slate-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)]">
                                    <h3 className="text-[18px] font-black text-slate-900 mb-6 tracking-tight">Detailed<br/>Specifications</h3>
                                    
                                    <div className="flex flex-col gap-4 mb-8">
                                        {product.specs && Object.entries(product.specs).map(([key, val]) => (
                                            <div key={key} className="flex items-start justify-between border-b border-slate-50 pb-4">
                                                <span className="text-[13px] text-slate-500 font-bold">{key}</span>
                                                <span className={`text-[13px] font-black text-right max-w-[150px] ${val.includes('Low') || val.includes('Safe') ? 'text-[#1b5e20]' : 'text-slate-900'}`}>
                                                    {val}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="flex items-center gap-3 text-[#1b5e20] font-black text-[12px] uppercase tracking-wide hover:text-green-900 transition-colors w-full p-4 border border-[#e8f5e9] rounded-[8px] bg-[#f0fdf4]">
                                        <FileText size={18} strokeWidth={2.5} className="shrink-0" />
                                        <span className="text-left">Download Safety Data<br/>Sheet</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section: Related Solutions */}
                        <div className="mb-24">
                            <div className="flex items-end justify-between mb-8">
                                <div>
                                    <h2 className="text-[24px] font-black text-slate-900 tracking-tight leading-none mb-2">Related Solutions (संबंधित समाधान)</h2>
                                    <p className="text-[13px] text-slate-500 font-bold">Top-rated additives for your specific crop cycle</p>
                                </div>
                                <button className="text-[#1b5e20] font-black text-[13px] tracking-wide flex items-center hover:text-green-900 transition-colors">
                                    View All Inventory <ArrowRight size={16} strokeWidth={3} className="ml-2" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map(item => (
                                    <div key={item.id} className="bg-white border border-slate-100 rounded-[12px] p-4 flex flex-col h-full hover:shadow-lg transition-shadow cursor-pointer">
                                        <div className="relative aspect-square bg-[#f4f5f4] rounded-[8px] overflow-hidden mb-4">
                                            {item.tag && (
                                                <div className="absolute top-2 left-2 z-10">
                                                    <span className="bg-white text-slate-900 text-[9px] font-black px-2 py-1 rounded-[4px] tracking-widest uppercase shadow-sm">
                                                        {item.tag}
                                                    </span>
                                                </div>
                                            )}
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 hover:scale-105" />
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <h4 className="font-black text-[14px] text-slate-900 leading-[1.3] tracking-tight mb-2">{item.name}</h4>
                                            <p className="font-black text-[15px] text-[#1b5e20] mb-4">₹{item.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                                            
                                            <button className="mt-auto w-full bg-[#1b5e20] hover:bg-green-900 text-white h-[42px] rounded-[6px] font-black text-[13px] transition-colors">
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                    
                    {/* Footer Area */}
                    <footer className="bg-[#fafafa] border-t border-slate-200 py-16 px-10">
                        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                            <div className="col-span-1 md:col-span-1">
                                <h3 className="text-[16px] font-black text-[#1b5e20] mb-4 tracking-tight">KMC Agriculture</h3>
                                <p className="text-[12px] text-slate-500 font-medium leading-[1.8]">
                                    Providing premium agricultural consultancy and supply solutions to India's leading farming estates since 1994.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-[14px] font-black text-slate-900 mb-6 tracking-tight">Quick Links</h4>
                                <ul className="space-y-3 text-[12px] text-slate-500 font-bold">
                                    <li className="cursor-pointer hover:text-slate-900">Track Order</li>
                                    <li className="cursor-pointer hover:text-slate-900">Bulk Quote Request</li>
                                    <li className="cursor-pointer hover:text-slate-900">Estate Consultancy</li>
                                    <li className="cursor-pointer hover:text-slate-900">Terms of Service</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-[14px] font-black text-slate-900 mb-6 tracking-tight">Support</h4>
                                <ul className="space-y-3 text-[12px] text-slate-500 font-bold">
                                    <li className="cursor-pointer hover:text-slate-900">Safety Datasheets</li>
                                    <li className="cursor-pointer hover:text-slate-900">Shipping Policy</li>
                                    <li className="cursor-pointer hover:text-slate-900">Refunds & Returns</li>
                                    <li className="cursor-pointer hover:text-slate-900">Partner Program</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-[14px] font-black text-slate-900 mb-6 tracking-tight">Stay Updated</h4>
                                <div className="flex items-center bg-white border border-slate-200 rounded-[6px] overflow-hidden mb-4">
                                    <input type="email" placeholder="Email address" className="w-full text-[12px] px-3 py-2 outline-none" />
                                    <button className="bg-[#1b5e20] text-white font-black text-[11px] px-4 py-2 hover:bg-green-900">Join</button>
                                </div>
                                <div className="flex gap-3 text-slate-400">
                                    {/* Mock social icons */}
                                    <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                                    <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                                    <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                                </div>
                            </div>
                        </div>
                        <div className="max-w-[1200px] mx-auto border-t border-slate-200 pt-8 text-center text-[10px] font-bold text-slate-400">
                            © 2024 KMC Agriculture Estate Management Services. All Rights Reserved. ISO 9001:2015 Certified.
                        </div>
                    </footer>

                </div>
            </main>
        </div>
    );
};

const ChevronRightIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><path d="m9 18 6-6-6-6"/></svg>
);

export default ProductDetail;
