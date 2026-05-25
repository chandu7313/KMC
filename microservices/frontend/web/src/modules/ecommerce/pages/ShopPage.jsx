import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
    Search, Bell, LayoutDashboard, Sprout, Database, LineChart, 
    HeadphonesIcon, Settings, LogOut, Plus, ChevronDown, ShoppingCart
} from 'lucide-react';
import { useGlobalStore } from '@/app/store/globalStore';
import { useCartStore } from '@/modules/ecommerce/store/cartStore';
import API from '@/core/api/api.config';

const NavItem = ({ icon, label, active = false }) => (
    <div className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors ${active ? 'bg-[#1b5e20] text-white rounded-r-full mr-4 shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
        {icon}
        <span className="text-[13px] font-bold tracking-wide">{label}</span>
    </div>
);

const Checkbox = ({ label, count, checked, onChange, mutedText }) => (
    <label className="flex items-start gap-3 cursor-pointer group mb-4">
        <div className="relative flex items-center justify-center mt-0.5">
            <input 
                type="checkbox" 
                className="peer sr-only" 
                checked={checked}
                onChange={onChange}
            />
            <div className={`w-[18px] h-[18px] rounded-[4px] border-[2px] transition-colors flex items-center justify-center
                ${checked ? 'bg-[#1b5e20] border-[#1b5e20]' : 'border-slate-300 group-hover:border-[#1b5e20]'}`}>
                {checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
            </div>
        </div>
        <div className="flex flex-col">
            <span className={`text-[13px] font-bold ${checked ? 'text-slate-900' : 'text-slate-700'}`}>{label}</span>
            {mutedText && <span className="text-[10px] text-slate-400 font-medium">{mutedText}</span>}
        </div>
    </label>
);

const ShopPage = () => {
    const navigate = useNavigate();
    const { backendUrl } = useGlobalStore();
    const { getCartCount } = useCartStore();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [inStockOnly, setInStockOnly] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState(['Seeds & Saplings']);
    const [selectedBrands, setSelectedBrands] = useState([]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendUrl}${API.PRODUCT}/list`);
            if (data.success) {
                setProducts(data.products || data.data?.products || []);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const toggleCategory = (cat) => {
        setSelectedCategories(prev => 
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const toggleBrand = (brand) => {
        setSelectedBrands(prev => 
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    const safeProducts = Array.isArray(products) ? products : (products?.items || products?.data || []);
    const filteredProducts = safeProducts.filter(p => {
        const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStock = !inStockOnly || p.stock > 0;
        const matchesCat = selectedCategories.length === 0 || selectedCategories.some(c => p.category?.includes(c) || c.includes(p.category));
        
        return matchesSearch && matchesStock && matchesCat;
    });

    // We will use mock data that strictly aligns with the design if backend is empty
    const displayProducts = filteredProducts.length > 0 ? filteredProducts : [
        { id: 1, name: 'Elite Non-GMO Soybean Seeds', brand: 'KMC Organic Solutions', price: 2450, unit: '50kg Bag', category: 'SEEDS & SAPLINGS', tag: 'BULK AVAILABLE', tagColor: 'bg-red-600', stock: 'In Stock', image: 'https://placehold.co/300x300?text=Soybean' },
        { id: 2, name: 'Precision Micro-Drip Emitter', brand: 'AquaFlow Systems', price: 840, unit: 'Unit', category: 'IRRIGATION TOOLS', tag: null, stock: 'Limited Stock', image: 'https://placehold.co/300x300?text=Irrigation' },
        { id: 3, name: 'NPK 19:19:19 Soluble Mix', brand: 'Bayer Crops', price: 1200, unit: '25kg Bag', category: 'FERTILIZERS', tag: 'TOP RATED', tagColor: 'bg-red-600', stock: 'In Stock', image: 'https://placehold.co/300x300?text=NPK' },
        { id: 4, name: 'Hybrid Pomegranate Sapling', brand: 'KMC Nursery', price: 450, unit: 'Plant', category: 'SEEDS & SAPLINGS', tag: null, stock: 'Sold Out', image: 'https://placehold.co/300x300?text=Sapling' },
        { id: 5, name: 'Bio-Safe Organic Insecticide', brand: 'EcoDefend Labs', price: 4800, unit: '5L Canister', category: 'CROP PROTECTION', tag: 'BULK AVAILABLE', tagColor: 'bg-red-600', stock: 'In Stock', image: 'https://placehold.co/300x300?text=Insecticide' },
        { id: 6, name: 'High-Yield Winter Wheat', brand: 'Mahyco Seeds', price: 3100, unit: '50kg Bag', category: 'SEEDS & SAPLINGS', tag: null, stock: 'In Stock', image: 'https://placehold.co/300x300?text=Wheat' },
    ];

    return (
        <div className="flex h-screen bg-[#fafafa] font-sans overflow-hidden">
            
            {/* Left Sidebar - Estate Management */}
            <aside className="w-[260px] bg-[#f4f5f4] border-r border-slate-200 flex flex-col shrink-0">
                <div className="p-6 pb-8">
                    <h1 className="text-[18px] font-black text-[#1b5e20] tracking-tight mb-0.5">KMC Agriculture</h1>
                    <p className="text-[11px] text-slate-500 font-bold tracking-wide">Premium Estate Management</p>
                </div>

                <nav className="flex-1 overflow-y-auto">
                    <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <NavItem icon={<Sprout size={20} />} label="Crops" />
                    <NavItem icon={<Database size={20} />} label="Inventory" active={true} />
                    <NavItem icon={<LayoutDashboard size={20} className="rotate-180" />} label="Financials" />
                    <NavItem icon={<LineChart size={20} />} label="Analytics" />
                    <NavItem icon={<HeadphonesIcon size={20} />} label="Support" />
                </nav>

                <div className="p-6 space-y-4">
                    <button className="w-full bg-[#1b5e20] hover:bg-green-900 text-white flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-[13px] shadow-sm transition-colors">
                        <Plus size={16} strokeWidth={3} /> New Report
                    </button>
                    <div className="flex items-center gap-3 px-2 py-2 cursor-pointer text-slate-600 hover:text-slate-900 transition-colors">
                        <Settings size={18} /> <span className="text-[13px] font-bold">Settings</span>
                    </div>
                    <div className="flex items-center gap-3 px-2 py-2 cursor-pointer text-slate-600 hover:text-slate-900 transition-colors">
                        <LogOut size={18} /> <span className="text-[13px] font-bold">Logout</span>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-white">
                
                {/* Header */}
                <header className="h-[80px] border-b border-slate-100 flex items-center justify-between px-10 shrink-0">
                    <h2 className="text-[22px] font-black text-[#1b5e20] tracking-tight">KMC Shop</h2>
                    
                    <div className="flex-1 max-w-[600px] px-8">
                        <div className="relative flex items-center w-full bg-[#f4f5f4] rounded-[8px] px-4 py-2.5">
                            <Search className="text-slate-400 mr-3" size={18} />
                            <input 
                                type="text"
                                placeholder="Search inputs, machinery, or seeds..."
                                className="bg-transparent border-none outline-none w-full text-[13px] font-bold text-slate-800 placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative text-slate-600 hover:text-slate-900">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="flex items-center gap-3 border-l border-slate-200 pl-6 cursor-pointer group">
                            <div className="flex flex-col items-end">
                                <span className="text-[12px] font-black text-slate-900 group-hover:text-[#1b5e20] transition-colors">Estate Manager</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase">ID: #88210-KM</span>
                            </div>
                            <div className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400 overflow-hidden bg-slate-50">
                                {/* Using Lucide User icon as placeholder */}
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    
                    {/* Filters Sidebar */}
                    <aside className="w-[280px] bg-white border-r border-slate-100 overflow-y-auto px-8 py-8 shrink-0 no-scrollbar">
                        
                        <div className="mb-10">
                            <h3 className="text-[14px] font-black text-slate-900 mb-5 tracking-wide">Categories</h3>
                            <Checkbox label="Seeds & Saplings" mutedText="बीज और पौधे" checked={selectedCategories.includes('Seeds & Saplings')} onChange={() => toggleCategory('Seeds & Saplings')} />
                            <Checkbox label="Fertilizers" mutedText="उर्वरक" checked={selectedCategories.includes('Fertilizers')} onChange={() => toggleCategory('Fertilizers')} />
                            <Checkbox label="Crop Protection" mutedText="फसल सुरक्षा" checked={selectedCategories.includes('Crop Protection')} onChange={() => toggleCategory('Crop Protection')} />
                            <Checkbox label="Irrigation Tools" mutedText="सिंचाई उपकरण" checked={selectedCategories.includes('Irrigation Tools')} onChange={() => toggleCategory('Irrigation Tools')} />
                        </div>

                        <div className="mb-10">
                            <h3 className="text-[14px] font-black text-slate-900 mb-5 tracking-wide">Price Range</h3>
                            <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-3">
                                <span>₹500</span>
                                <span>₹50,000+</span>
                            </div>
                            {/* Simple mock slider visual */}
                            <div className="relative w-full h-[4px] bg-slate-200 rounded-full mb-6">
                                <div className="absolute left-[20%] right-[30%] h-full bg-[#1b5e20] rounded-full"></div>
                                <div className="absolute left-[20%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-[#1b5e20] rounded-full shadow-sm cursor-pointer"></div>
                                <div className="absolute right-[30%] top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-[#1b5e20] rounded-full shadow-sm cursor-pointer"></div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 bg-[#f4f5f4] rounded-[6px] px-3 py-2">
                                    <span className="text-[11px] text-slate-400 font-bold block mb-0.5">Min</span>
                                    <input type="text" className="w-full bg-transparent border-none outline-none text-[13px] font-bold text-slate-900" placeholder="₹500" />
                                </div>
                                <div className="flex-1 bg-[#f4f5f4] rounded-[6px] px-3 py-2">
                                    <span className="text-[11px] text-slate-400 font-bold block mb-0.5">Max</span>
                                    <input type="text" className="w-full bg-transparent border-none outline-none text-[13px] font-bold text-slate-900" placeholder="₹50,000" />
                                </div>
                            </div>
                        </div>

                        <div className="mb-10">
                            <h3 className="text-[14px] font-black text-slate-900 mb-5 tracking-wide">Brand</h3>
                            <Checkbox label="Bayer Crops" checked={selectedBrands.includes('Bayer Crops')} onChange={() => toggleBrand('Bayer Crops')} />
                            <Checkbox label="KMC Organic" checked={selectedBrands.includes('KMC Organic')} onChange={() => toggleBrand('KMC Organic')} />
                            <Checkbox label="Mahyco Seeds" checked={selectedBrands.includes('Mahyco Seeds')} onChange={() => toggleBrand('Mahyco Seeds')} />
                        </div>

                        <div>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-[13px] font-black text-slate-900">In Stock Only</span>
                                <div className="relative">
                                    <input type="checkbox" className="sr-only" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
                                    <div className={`w-11 h-6 rounded-full transition-colors ${inStockOnly ? 'bg-[#1b5e20]' : 'bg-slate-300'}`}></div>
                                    <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform ${inStockOnly ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </div>
                            </label>
                        </div>
                    </aside>

                    {/* Product Grid Area */}
                    <div className="flex-1 overflow-y-auto bg-[#fafafa] p-10 no-scrollbar">
                        
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <h1 className="text-[32px] font-black text-slate-900 tracking-tight leading-none mb-2">Agricultural Supplies</h1>
                                <p className="text-[13px] text-slate-500 font-bold">Showing 1-12 of 144 premium products</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">SORT BY:</span>
                                <button className="flex items-center gap-2 text-[13px] font-black text-[#1b5e20]">
                                    Recommended <ChevronDown size={16} strokeWidth={3} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displayProducts.map((product) => (
                                <div 
                                    key={product.id} 
                                    className="bg-white rounded-[16px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col h-full cursor-pointer hover:shadow-lg transition-shadow group"
                                    onClick={() => navigate(`/product/${product.id}`)}
                                >
                                    <div className="relative aspect-[4/3] bg-[#f4f5f4] rounded-[12px] mb-5 overflow-hidden flex items-center justify-center">
                                        <img src={product.image || product.images?.[0]} alt={product.name} className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
                                        {product.tag && (
                                            <div className="absolute top-3 left-3">
                                                <span className={`${product.tagColor} text-white text-[9px] font-black px-2.5 py-1 rounded-[4px] tracking-wider uppercase shadow-sm`}>
                                                    {product.tag}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1 flex flex-col">
                                        <span className="text-[#1b5e20] text-[10px] font-black uppercase tracking-widest mb-2">{product.category}</span>
                                        <h3 className="text-[18px] font-black text-slate-900 leading-[1.3] tracking-tight mb-2 line-clamp-2">{product.name}</h3>
                                        <p className="text-[12px] text-slate-500 font-bold mb-5">{product.brand}</p>
                                        
                                        <div className="mt-auto pt-4 flex items-end justify-between border-t border-slate-100">
                                            <div>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-[22px] font-black text-slate-900 tracking-tight">₹{product.price?.toLocaleString()}</span>
                                                    <span className="text-[11px] text-slate-400 font-bold">/ {product.unit || 'Unit'}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`w-2 h-2 rounded-full ${product.stock === 'In Stock' ? 'bg-[#1b5e20]' : product.stock === 'Limited Stock' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                                                    <span className="text-[11px] font-black text-slate-700 tracking-wide">{product.stock}</span>
                                                </div>
                                                <button 
                                                    className="w-10 h-10 bg-[#1b5e20] hover:bg-green-900 text-white rounded-[8px] flex items-center justify-center transition-colors shadow-md"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toast.success(`Added ${product.name} to cart`);
                                                    }}
                                                >
                                                    <ShoppingCart size={18} strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Mock */}
                        <div className="mt-12 flex justify-center items-center gap-2 pb-10">
                            <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900"><ChevronDown size={18} className="rotate-90" /></button>
                            <button className="w-8 h-8 flex items-center justify-center bg-[#1b5e20] text-white rounded-[6px] font-black text-[13px] shadow-sm">1</button>
                            <button className="w-8 h-8 flex items-center justify-center text-slate-600 font-black text-[13px] hover:bg-slate-100 rounded-[6px] transition-colors">2</button>
                            <button className="w-8 h-8 flex items-center justify-center text-slate-600 font-black text-[13px] hover:bg-slate-100 rounded-[6px] transition-colors">3</button>
                            <span className="text-slate-400 mx-1">...</span>
                            <button className="w-8 h-8 flex items-center justify-center text-slate-600 font-black text-[13px] hover:bg-slate-100 rounded-[6px] transition-colors">12</button>
                            <button className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900"><ChevronDown size={18} className="-rotate-90" /></button>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default ShopPage;
