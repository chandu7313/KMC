import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '@/app/layouts/Navbar';
import { Search, ShoppingCart, Filter, ArrowRight, Package, Sprout, Tractor, Leaf } from 'lucide-react';
import { useGlobalStore } from '@/app/store/globalStore';
import { useCartStore } from '@/modules/ecommerce/store/cartStore';

import API from '@/core/api/api.config';

const Fertilizers = () => {
    const navigate = useNavigate();
    const { backendUrl } = useGlobalStore();
  const { getCartCount } = useCartStore();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    
    // Derived categories for fertilizers & seeds
    const categories = ['All', 'Fertilizers', 'Seeds', 'Pesticides'];

    const categoryIcons = {
        'All': <Package size={18} />,
        'Fertilizers': <Leaf size={18} />,
        'Seeds': <Sprout size={18} />,
        'Pesticides': <Filter size={18} />
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendUrl}${API.PRODUCT}/list`);
            if (data.success) {
                const targetCategories = ['Fertilizers', 'Seeds', 'Pesticides'];
                const productsList = Array.isArray(data.products) ? data.products : (Array.isArray(data.data?.products?.products) ? data.data.products.products : (Array.isArray(data.data?.products) ? data.data.products : []));
                const filtered = productsList.filter(p => 
                    targetCategories.includes(p.category) || 
                    targetCategories.includes(p.sub_category)
                );
                setProducts(filtered);
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

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              p.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || p.category === activeCategory || p.sub_category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans">
            <Navbar />
            
        {/* Hero Section */}
            <section className="pt-20 md:pt-24 pb-4 md:pb-6 px-4 md:px-6 bg-gradient-to-b from-emerald-900 to-emerald-800 text-white rounded-b-[24px] md:rounded-b-[32px] shadow-md relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center justify-center text-center gap-2">
                    <div className="inline-flex items-center gap-1.5 bg-emerald-800/50 border border-emerald-700/50 backdrop-blur-md text-emerald-100 px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] shadow-inner">
                        <Leaf size={12} className="text-emerald-400" /> KMC Nutrients
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
                        The Direct-to-Farm <span className="text-emerald-400 italic font-black">Nutrients.</span>
                    </h1>
                    <p className="text-[10px] md:text-sm text-emerald-100/80 font-medium max-w-xl mx-auto">
                        High-quality seeds, fertilizers, and pesticides delivered directly to your farm.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-2 py-16 -mt-10 relative z-20">
                
                {/* Category, Search & Cart Wrapper - STICKY */}
                <div className="sticky top-[56px] sm:top-[64px] z-40 bg-[#f8fafc]/80 backdrop-blur-md -mx-2 px-2 py-4 mb-4 border-b border-slate-200/50">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                        {/* Category Navigation */}
                        <div className="flex items-center justify-start gap-3 overflow-x-auto no-scrollbar w-full lg:w-auto pb-1 lg:pb-0 hide-scrollbar">
                            {categories.map(cat => (
                                <button 
                                    key={cat} 
                                    onClick={() => setActiveCategory(cat)} 
                                    className={`flex items-center shrink-0 gap-2 px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-300 shadow-sm
                                        ${activeCategory === cat 
                                            ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10 scale-105 border border-slate-800' 
                                            : 'bg-white text-slate-500 border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 hover:shadow-md'}`}
                                >
                                    {categoryIcons[cat] || <Package size={16} />}
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Search & Actions */}
                        <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 mt-2 lg:mt-0">
                            <div className="relative group flex-1 lg:w-[240px] xl:w-[320px]">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={16} />
                                <input 
                                    className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-xs text-slate-800 placeholder:text-slate-400 shadow-sm" 
                                    placeholder="Search for inputs..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button 
                                onClick={() => navigate('/cart')}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-xl shadow-lg shadow-emerald-900/10 transition-all flex items-center justify-center active:scale-95 shrink-0 group relative"
                                title="Go To Cart"
                            >
                                <ShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
                                {getCartCount() > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-[#f8fafc] animate-in zoom-in duration-300">
                                        {getCartCount()}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product Status & Loading */}
                {loading ? (
                     <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Loading Catalog...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="bg-white rounded-[40px] border border-slate-100 p-20 text-center shadow-sm flex flex-col items-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                            <Search size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">No products found</h3>
                        <p className="text-slate-500 font-medium max-w-md">Try adjusting your filters or search terms to find what you're looking for.</p>
                        <button 
                            onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                            className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    /* Product Grid */
                    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                        {filteredProducts.map(product => (
                            <div 
                                key={product.id} 
                                onClick={() => navigate(`/product/${product.id}`)}
                                className="bg-white rounded-[16px] md:rounded-[24px] p-1.5 md:p-2 shadow-sm border border-slate-100 hover:shadow-xl hover:border-emerald-100 transition-all duration-300 group cursor-pointer flex flex-col h-full"
                            >
                                {/* Image Container */}
                                <div className="relative aspect-square rounded-[12px] md:rounded-[16px] bg-slate-50 overflow-hidden mb-1.5 md:mb-2 flex items-center justify-center">
                                    <img 
                                        src={product.images[0]} 
                                        alt={product.name} 
                                        className="max-w-full max-h-full object-contain p-2 md:p-4 group-hover:scale-110 transition-transform duration-700 ease-out" 
                                    />
                                    
                                    {/* Badges */}
                                    {product.is_featured && (
                                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                                            <span className="bg-yellow-400 text-yellow-950 px-2 py-1 flex items-center justify-center rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest shadow-sm">
                                                Featured
                                            </span>
                                        </div>
                                    )}

                                    {/* Stock Status Overlay */}
                                    {product.stock === 0 && (
                                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                                            <span className="bg-rose-500 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg">
                                                Out of Stock
                                            </span>
                                        </div>
                                    )}

                                    {/* Quick action button (appears on hover) */}
                                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                                        <button className="w-8 h-8 md:w-10 md:h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-colors shadow-md">
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="px-2 md:px-3 py-1 md:py-2 flex-1 flex flex-col justify-between">
                                    <h3 className="font-black text-slate-900 text-[10px] md:text-sm leading-snug line-clamp-2 mb-1 md:mb-1.5">
                                        {product.name}
                                    </h3>
                                    
                                    <div className="pt-1 border-t border-slate-50 flex items-center justify-between mt-auto">
                                        <div className="flex items-baseline gap-1 md:gap-1.5">
                                            <span className="text-xs md:text-lg font-black text-slate-900">
                                                ₹{product.discountedPrice || product.price}
                                            </span>
                                            {product.discountedPrice && (
                                                <span className="text-[10px] md:text-sm font-bold text-slate-300 line-through">
                                                    ₹{product.price}
                                                </span>
                                            )}
                                        </div>
                                        
                                        {/* Ratings snippet if available */}
                                        {product.ratings > 0 && (
                                            <div className="flex items-center">
                                                <span className="bg-emerald-50 text-emerald-700 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg text-[10px] md:text-xs font-black">
                                                    ★ {product.ratings.toFixed(1)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Fertilizers;
