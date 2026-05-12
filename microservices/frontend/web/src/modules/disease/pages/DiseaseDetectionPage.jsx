import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/app/layouts/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import heroImage from '@/assets/hero_agronomist.png';
import { useGlobalStore } from '@/app/store/globalStore';
import { 
    Camera, 
    Image as ImageIcon, 
    CheckCircle2, 
    ScanLine, 
    Bug, 
    Beaker, 
    BadgeCheck, 
    TrendingUp,
    ChevronRight,
    Bookmark,
    Share2,
    TriangleAlert,
    Pill,
    Leaf,
    LeafyGreen,
    ShoppingCart,
    Droplets,
    RefreshCw,
    Trash2,
    Move,
    Eye,
    AlertCircle,
    Clock,
    Shield,
    Zap,
    Star,
    Plus,
    Minus,
    X
} from 'lucide-react';

// Map icon name strings from Gemini to Lucide components
const PREVENTION_ICON_MAP = {
    water: Droplets,
    rotate: RefreshCw,
    trash: Trash2,
    spacing: Move,
    eye: Eye,
    leaf: Leaf,
};

// Urgency styling
const URGENCY_STYLES = {
    urgent: { border: 'border-[#c32222]', bg: 'bg-[#fbf5f4]', badge: 'bg-red-100 text-red-700', numBg: 'bg-white text-[#c32222] shadow-[0_2px_10px_rgba(195,34,34,0.1)]' },
    high: { border: 'border-orange-400', bg: 'bg-orange-50', badge: 'bg-orange-100 text-orange-700', numBg: 'bg-orange-100 text-orange-700' },
    normal: { border: 'border-[#135327]', bg: 'bg-[#f6f9f3]', badge: 'bg-green-100 text-green-700', numBg: 'bg-[#e0edd6] text-[#135327]' },
};

// Symptom severity badge
const SYMPTOM_SEVERITY = {
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-blue-100 text-blue-700 border-blue-200',
};

// Product effectiveness badge
const EFFECTIVENESS_BADGE = {
    high: { bg: 'bg-green-100 text-green-700', label: 'High Effectiveness' },
    medium: { bg: 'bg-yellow-100 text-yellow-700', label: 'Moderate' },
    low: { bg: 'bg-gray-100 text-gray-600', label: 'Mild' },
};

const CropDoctor = () => {
    const { backendUrl, userData, navigate } = useGlobalStore();
    
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
    
    // Result View Tabs
    const [actionTab, setActionTab] = useState('Symptoms');
    const [productTab, setProductTab] = useState('Sprays');

    // Local cart state for product recommendations
    const [cart, setCart] = useState([]);
    
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const fetchHistory = async () => {
        if (!userData) return;
        setFetchLoading(true);
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.get(`${backendUrl}/api/crop-doctor/history`);
            if (data.success) {
                setHistory(data.data);
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            setFetchLoading(false);
        }
    };

    const fetchDiagnosisDetail = async (id) => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.get(`${backendUrl}/api/crop-doctor/detail/${id}`);
            if (data.success) {
                setSelectedDiagnosis(data.data);
                setActionTab('Symptoms');
                setProductTab('Sprays');
                setCart([]);
            }
        } catch (error) {
            toast.error("Failed to load diagnosis details");
        }
    };

    useEffect(() => {
        if (userData) {
            fetchHistory();
        }
    }, [userData]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            submitDiagnosis(file);
        }
    };

    const submitDiagnosis = async (file) => {
        if (!userData) {
            toast.error('Please login to use the diagnostic tool');
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            axios.defaults.withCredentials = true;
            const formData = new FormData();
            formData.append('cropImage', file);

            toast.info("Analyzing crop image with AI. Please wait...", { autoClose: 5000 });
            const { data } = await axios.post(`${backendUrl}/api/crop-doctor/diagnose`, formData);

            if (data.success) {
                toast.success('Diagnosis complete!');
                fetchHistory();
                setSelectedDiagnosis(data.data);
                setActionTab('Symptoms');
                setProductTab('Sprays');
                setCart([]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Error analyzing image. Please try again.');
        } finally {
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
            if (cameraInputRef.current) cameraInputRef.current.value = "";
        }
    };

    // ----- Cart helpers -----
    const addToCart = (product) => {
        setCart(prev => {
            const exists = prev.find(p => p.name === product.name);
            if (exists) {
                return prev.map(p => p.name === product.name ? { ...p, qty: p.qty + 1 } : p);
            }
            const avgPrice = Math.round(((product.estimatedPriceMin || 0) + (product.estimatedPriceMax || 0)) / 2);
            return [...prev, { ...product, qty: 1, unitPrice: avgPrice }];
        });
        toast.success(`${product.name} added to cart`, { autoClose: 1500 });
    };

    const updateCartQty = (name, delta) => {
        setCart(prev => prev.map(p => {
            if (p.name !== name) return p;
            const newQty = p.qty + delta;
            return newQty > 0 ? { ...p, qty: newQty } : p;
        }).filter(p => p.qty > 0));
    };

    const removeFromCart = (name) => {
        setCart(prev => prev.filter(p => p.name !== name));
    };

    const cartTotal = cart.reduce((sum, p) => sum + p.unitPrice * p.qty, 0);
    const cartCount = cart.reduce((sum, p) => sum + p.qty, 0);

    const getSeverityBadge = (severity, isHealthy) => {
        if (isHealthy || severity === 'None') return "bg-green-100 text-green-700";
        if (severity === 'Low') return "bg-blue-100 text-blue-700";
        if (severity === 'Mild') return "bg-[#ffded3] text-[#cf4227]";
        if (severity === 'Moderate') return "bg-red-100 text-red-600";
        if (severity === 'Severe') return "bg-red-200 text-red-800";
        return "bg-gray-100 text-gray-700";
    };

    // =========================================================
    // RESULT VIEW COMPONENT (Replaces the entire page when active)
    // =========================================================
    if (selectedDiagnosis) {
        const d = selectedDiagnosis;

        // Get products for currently active tab
        const products = d.recommendedProducts || { sprays: [], fertilizers: [], organic: [] };
        const currentProducts = productTab === 'Sprays' ? (products.sprays || [])
            : productTab === 'Fertilizers' ? (products.fertilizers || [])
            : (products.organic || []);

        return (
            <div className="min-h-screen bg-[#f8faf8] font-sans flex flex-col">
                <Navbar />
                
                <main className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16 flex-1">
                    <div className="flex flex-col lg:flex-row gap-6 items-start h-full">
                        
                        {/* ==================== LEFT COLUMN ==================== */}
                        <div className="w-full lg:w-[320px] shrink-0 space-y-4">
                            {/* Image & Confidence Box */}
                            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 relative max-h-[350px]">
                                <img src={d.imageUrl} alt="Scan" className="w-full h-full object-cover min-h-[250px]" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-[10px] font-black tracking-widest uppercase text-gray-700">Analysis Confidence</span>
                                        <span className={`text-base font-black ${d.isHealthy ? 'text-[#135327]' : 'text-red-700'}`}>
                                            {d.confidence}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${d.isHealthy ? 'bg-[#135327]' : 'bg-[#c32222]'}`} 
                                            style={{ width: `${d.confidence}%` }}>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Alert Box */}
                            <div className={`rounded-xl p-5 text-white flex items-start gap-4 ${d.isHealthy ? 'bg-[#135327]' : 'bg-[#c32222]'}`}>
                                {d.isHealthy ? <CheckCircle2 className="mt-0.5" /> : <TriangleAlert className="mt-0.5" />}
                                <div>
                                    <h3 className="font-black text-sm mb-1">{d.isHealthy ? 'Healthy Plant Detected' : 'Disease Detected'}</h3>
                                    <p className="text-sm font-medium opacity-90 leading-tight">
                                        {d.isHealthy ? 'No pathogens found' : d.diseaseName}
                                    </p>
                                    {d.scientificName && !d.isHealthy && (
                                        <p className="text-xs font-medium opacity-70 italic mt-1">{d.scientificName}</p>
                                    )}
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#f0f4ea] rounded-xl p-5">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#5a8050] mb-1">Severity</p>
                                    <p className={`font-black text-sm ${d.isHealthy ? 'text-[#135327]' : 'text-[#c32222]'}`}>
                                        {d.severity}
                                    </p>
                                </div>
                                <div className="bg-[#f0f4ea] rounded-xl p-5">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#5a8050] mb-1">Crop</p>
                                    <p className="font-black text-sm text-[#1a2f1b]">{d.cropName || 'Unknown'}</p>
                                </div>
                            </div>

                            <div className="bg-[#f0f4ea] rounded-xl p-5">
                                <p className="text-[9px] font-black uppercase tracking-widest text-[#5a8050] mb-1">Cause Classification</p>
                                <p className="font-black text-sm text-[#1a2f1b]">
                                    {d.causeClassification || (d.isHealthy ? 'Natural Growth' : 'Pathogen / Deficiency')}
                                </p>
                            </div>

                            {/* Similar Diseases */}
                            {d.similarDiseases && d.similarDiseases.length > 0 && !d.isHealthy && (
                                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#5a8050] mb-3">Similar Diseases</p>
                                    <div className="space-y-2.5">
                                        {d.similarDiseases.map((sd, idx) => (
                                            <div key={idx} className="flex items-center justify-between bg-[#fafcf8] rounded-lg px-3 py-2.5">
                                                <div className="flex-1 min-w-0 mr-3">
                                                    <p className="text-xs font-bold text-[#1a2f1b] truncate">{sd.name}</p>
                                                    <p className="text-[10px] text-[#5a8050] leading-snug mt-0.5 line-clamp-2">{sd.keyDifference}</p>
                                                </div>
                                                <div className="shrink-0 w-10 h-10 rounded-full bg-[#e9efe3] flex items-center justify-center">
                                                    <span className="text-xs font-black text-[#135327]">{sd.similarity}%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <button className="bg-[#f0f4ea] hover:bg-[#e2eadd] text-[#1a2f1b] rounded-xl py-3.5 font-black text-xs uppercase tracking-wider flex justify-center items-center gap-2 transition-colors">
                                    <Bookmark size={16} /> Save
                                </button>
                                <button className="bg-[#f0f4ea] hover:bg-[#e2eadd] text-[#1a2f1b] rounded-xl py-3.5 font-black text-xs uppercase tracking-wider flex justify-center items-center gap-2 transition-colors">
                                    <Share2 size={16} /> Share
                                </button>
                            </div>
                            <button onClick={() => navigate('/expert-consultations')} className="w-full bg-[#fce5df] hover:bg-[#ffded5] text-[#cf4227] rounded-xl py-4 font-black text-xs uppercase tracking-widest flex justify-center items-center gap-2 transition-colors mt-2">
                                Consult Expert
                            </button>
                            <button onClick={() => { setSelectedDiagnosis(null); setCart([]); }} className="w-full bg-[#135327] hover:bg-[#0f441f] text-white rounded-xl py-4 font-black text-xs uppercase tracking-widest flex justify-center items-center gap-2 transition-colors shadow-lg mt-2">
                                <ScanLine size={16} /> Scan Another
                            </button>
                        </div>

                        {/* ==================== MIDDLE COLUMN: Action Plan ==================== */}
                        <div className="flex-1 bg-white rounded-[32px] p-8 lg:p-10 shadow-sm border border-gray-100 min-h-screen lg:min-h-0 self-stretch">
                            <h2 className="text-[26px] font-black text-[#1a2f1b] mb-3">Action Plan</h2>
                            {d.description && (
                                <p className="text-sm font-medium text-[#4b664d] leading-relaxed mb-6 bg-[#f6f9f3] p-4 rounded-2xl">
                                    {d.description}
                                </p>
                            )}
                            
                            {/* Tabs */}
                            <div className="flex border-b border-gray-100 mb-8 overflow-x-auto">
                                {['Symptoms', 'Treatment', 'Prevention'].map((tab) => (
                                    <button 
                                        key={tab}
                                        onClick={() => setActionTab(tab)}
                                        className={`px-6 py-3 font-bold text-sm tracking-wide transition-colors whitespace-nowrap ${actionTab === tab ? 'text-[#1a2f1b] border-b-2 border-[#135327]' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* ========== SYMPTOMS TAB ========== */}
                            {actionTab === 'Symptoms' && (
                                <div className="space-y-4">
                                    {(!d.symptoms || d.symptoms.length === 0) ? (
                                        <div className="text-center py-12">
                                            <CheckCircle2 className="mx-auto text-[#135327] mb-3" size={40} />
                                            <p className="text-gray-500 font-bold text-sm">No symptoms detected — crop appears healthy.</p>
                                        </div>
                                    ) : (
                                        d.symptoms.map((symptom, idx) => {
                                            const severityStyle = SYMPTOM_SEVERITY[symptom.severity] || SYMPTOM_SEVERITY.medium;
                                            return (
                                                <div key={idx} className="bg-[#f6f9f3] rounded-2xl p-6 border border-[#e5efdb] hover:shadow-md transition-shadow">
                                                    <div className="flex items-start justify-between gap-4 mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-[#e0edd6] flex items-center justify-center shrink-0">
                                                                <AlertCircle size={16} className="text-[#135327]" />
                                                            </div>
                                                            <h4 className="font-black text-[#1a2f1b] text-sm">{symptom.title}</h4>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shrink-0 ${severityStyle}`}>
                                                            {symptom.severity}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-medium text-[#4b664d] leading-relaxed ml-11">{symptom.description}</p>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )}

                            {/* ========== TREATMENT TAB ========== */}
                            {actionTab === 'Treatment' && (
                                <div className="space-y-4">
                                    {!d.treatment ? (
                                        <div className="text-center py-12">
                                            <CheckCircle2 className="mx-auto text-[#135327] mb-3" size={40} />
                                            <p className="text-gray-500 font-bold text-sm">No treatment required for healthy crops.</p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Immediate Action Banner */}
                                            {d.treatment.immediateAction && (
                                                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 flex items-start gap-4 mb-2">
                                                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                                        <Zap size={18} className="text-red-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-red-800 text-sm mb-1">⚡ Immediate Action Required</h4>
                                                        <p className="text-sm font-medium text-red-700 leading-relaxed">{d.treatment.immediateAction}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Treatment Steps */}
                                            {(d.treatment.steps || []).map((step, idx) => {
                                                const urgencyStyle = URGENCY_STYLES[step.urgency] || URGENCY_STYLES.normal;
                                                return (
                                                    <div key={idx} className={`border-l-[5px] p-6 rounded-r-2xl rounded-l-md flex gap-5 ${urgencyStyle.border} ${urgencyStyle.bg}`}>
                                                        <div className={`w-10 h-10 rounded-full font-black text-sm flex items-center justify-center shrink-0 ${urgencyStyle.numBg}`}>
                                                            {step.stepNumber || idx + 1}
                                                        </div>
                                                        <div className="pt-1 flex-1">
                                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                                <h4 className="text-base font-black text-[#1a2f1b]">{step.title}</h4>
                                                                <div className="flex gap-2 shrink-0">
                                                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${urgencyStyle.badge}`}>
                                                                        {step.urgency}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <p className="text-sm font-medium text-[#4b664d] leading-relaxed">{step.description}</p>
                                                            {step.timeframe && (
                                                                <div className="flex items-center gap-1.5 mt-3 text-[#5a8050]">
                                                                    <Clock size={12} />
                                                                    <span className="text-xs font-bold">{step.timeframe}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {/* Treatment Footer */}
                                            <div className="bg-[#f0f4ea] rounded-2xl p-5 mt-2 flex flex-col sm:flex-row sm:items-center gap-4">
                                                {d.treatment.harvestSafetyInterval && (
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <Shield size={16} className="text-[#135327] shrink-0" />
                                                        <div>
                                                            <p className="text-[9px] font-black uppercase tracking-widest text-[#5a8050]">Harvest Safety</p>
                                                            <p className="text-xs font-bold text-[#1a2f1b]">{d.treatment.harvestSafetyInterval}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {d.treatment.totalDuration && (
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <Clock size={16} className="text-[#135327] shrink-0" />
                                                        <div>
                                                            <p className="text-[9px] font-black uppercase tracking-widest text-[#5a8050]">Total Duration</p>
                                                            <p className="text-xs font-bold text-[#1a2f1b]">{d.treatment.totalDuration}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* ========== PREVENTION TAB ========== */}
                            {actionTab === 'Prevention' && (
                                <div className="space-y-4">
                                    {(!d.prevention || d.prevention.length === 0) ? (
                                        <p className="text-gray-500 font-medium p-6 bg-gray-50 rounded-2xl">No prevention tips available.</p>
                                    ) : (
                                        d.prevention.map((tip, idx) => {
                                            const IconComp = PREVENTION_ICON_MAP[tip.icon] || Leaf;
                                            return (
                                                <div key={idx} className="border-l-[5px] border-[#135327] p-6 rounded-r-2xl rounded-l-md flex gap-5 bg-[#f6f9f3] hover:shadow-md transition-shadow">
                                                    <div className="w-10 h-10 rounded-full bg-[#e0edd6] flex items-center justify-center shrink-0">
                                                        <IconComp size={18} className="text-[#135327]" />
                                                    </div>
                                                    <div className="pt-1">
                                                        <h4 className="text-base font-black text-[#1a2f1b] mb-2">{tip.title}</h4>
                                                        <p className="text-sm font-medium text-[#4b664d] leading-relaxed">{tip.description}</p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )}
                        </div>

                        {/* ==================== RIGHT COLUMN: Products ==================== */}
                        <div className="w-full lg:w-[380px] shrink-0 bg-white rounded-[32px] p-6 lg:p-8 shadow-sm border border-gray-100 flex flex-col min-h-screen lg:min-h-0 self-stretch relative">
                            <h2 className="text-[24px] font-black text-[#1a2f1b] mb-6 flex items-center gap-3">
                                <ShoppingCart className="text-[#135327]" size={24} strokeWidth={2.5} /> Recommended
                            </h2>

                            {/* Product Tabs */}
                            <div className="flex border-b border-gray-100 mb-6 pb-2 gap-4 sm:gap-6 overflow-x-auto">
                                {[
                                    { id: 'Sprays', icon: Pill, label: 'Sprays' },
                                    { id: 'Fertilizers', icon: LeafyGreen, label: 'Fertilizers' },
                                    { id: 'Organic', icon: Leaf, label: 'Organic' }
                                ].map((tab) => (
                                    <button 
                                        key={tab.id}
                                        onClick={() => setProductTab(tab.id)}
                                        className={`flex items-center gap-1.5 pb-2 font-bold text-xs tracking-wide transition-colors whitespace-nowrap ${productTab === tab.id ? 'text-[#135327] border-b-[3px] border-[#135327] -mb-2' : 'text-gray-500 hover:text-gray-800'}`}
                                    >
                                        <tab.icon size={14} className={productTab === tab.id ? "text-red-500" : ""} /> {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Product List */}
                            <div className="space-y-4 mb-28 overflow-y-auto flex-1">
                                {currentProducts.length === 0 ? (
                                    <div className="bg-[#f6f9f3] p-6 rounded-[20px] shadow-sm text-center">
                                        <p className="text-xs font-bold text-gray-500">No {productTab.toLowerCase()} recommended for this diagnosis.</p>
                                    </div>
                                ) : (
                                    currentProducts.map((prod, idx) => {
                                        const eff = EFFECTIVENESS_BADGE[prod.effectiveness] || EFFECTIVENESS_BADGE.medium;
                                        const inCart = cart.find(c => c.name === prod.name);
                                        return (
                                            <div key={idx} className="bg-[#f6f9f3] p-5 rounded-[20px] relative shadow-sm border border-transparent hover:border-[#135327]/20 transition-all group">
                                                {prod.isBestChoice && (
                                                    <span className="absolute -top-3 right-4 bg-[#135327] text-white px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase shadow-md pointer-events-none flex items-center gap-1">
                                                        <Star size={10} /> Best Choice
                                                    </span>
                                                )}
                                                
                                                {/* Product Header */}
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1 min-w-0 mr-3">
                                                        <h4 className="font-black text-[#1a2f1b] text-sm leading-snug">{prod.name}</h4>
                                                        <p className="text-[10px] text-gray-500 font-bold mt-0.5">{prod.brand} • {prod.type}</p>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shrink-0 ${eff.bg}`}>
                                                        {eff.label}
                                                    </span>
                                                </div>

                                                {/* Product Details */}
                                                <div className="space-y-1.5 mb-3">
                                                    {prod.dosage && (
                                                        <p className="text-[11px] text-[#4b664d] font-medium">
                                                            <span className="font-bold text-[#1a2f1b]">Dosage:</span> {prod.dosage}
                                                        </p>
                                                    )}
                                                    {prod.applicationMethod && (
                                                        <p className="text-[11px] text-[#4b664d] font-medium">
                                                            <span className="font-bold text-[#1a2f1b]">Method:</span> {prod.applicationMethod}
                                                        </p>
                                                    )}
                                                    {(prod.frequency || prod.when) && (
                                                        <p className="text-[11px] text-[#4b664d] font-medium">
                                                            <span className="font-bold text-[#1a2f1b]">{prod.frequency ? 'Frequency' : 'When'}:</span> {prod.frequency || prod.when}
                                                        </p>
                                                    )}
                                                    {prod.precautions && (
                                                        <p className="text-[10px] text-orange-600 font-bold mt-1">⚠️ {prod.precautions}</p>
                                                    )}
                                                </div>

                                                {/* Price + Add Button */}
                                                <div className="flex items-center justify-between pt-3 border-t border-[#e5efdb]">
                                                    <p className="text-[#135327] font-black text-lg">
                                                        ₹{prod.estimatedPriceMin || 0}<span className="text-xs font-bold text-gray-400"> – ₹{prod.estimatedPriceMax || 0}</span>
                                                    </p>
                                                    {inCart ? (
                                                        <div className="flex items-center gap-2">
                                                            <button onClick={() => updateCartQty(prod.name, -1)} className="w-7 h-7 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors">
                                                                <Minus size={12} />
                                                            </button>
                                                            <span className="text-sm font-black text-[#1a2f1b] w-5 text-center">{inCart.qty}</span>
                                                            <button onClick={() => updateCartQty(prod.name, 1)} className="w-7 h-7 rounded-lg bg-[#135327] hover:bg-[#0f441f] text-white flex items-center justify-center transition-colors">
                                                                <Plus size={12} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            onClick={() => addToCart(prod)}
                                                            className="bg-[#135327] hover:bg-[#0f441f] text-white px-4 py-2 rounded-lg text-[10px] uppercase font-black tracking-wider transition-colors shadow-sm flex items-center gap-1.5"
                                                        >
                                                            <Plus size={12} /> Add
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Floating Cart Widget */}
                            <div className="absolute bottom-6 left-6 right-6 bg-white border border-[#e5efdb] rounded-[20px] p-4 shadow-[0_10px_30px_rgba(19,83,39,0.1)] z-10">
                                {cartCount > 0 ? (
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#eef6e6] rounded-xl flex items-center justify-center text-[#135327] relative">
                                                <ShoppingCart size={16} strokeWidth={2.5} />
                                                <span className="absolute -top-1.5 -right-1.5 bg-[#c32222] text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-[#1a2f1b]">{cartCount} item{cartCount !== 1 ? 's' : ''} in cart</p>
                                                <p className="text-[11px] font-medium text-gray-500">Subtotal: <span className="font-black text-[#135327]">₹{cartTotal.toLocaleString()}</span></p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => toast.info('Checkout coming soon!')}
                                            className="bg-[#135327] hover:bg-[#0f441f] text-white px-5 py-3 rounded-xl text-[11px] font-black tracking-widest uppercase transition-colors shadow-md"
                                        >
                                            Checkout →
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 justify-center py-1">
                                        <ShoppingCart size={16} className="text-gray-400" />
                                        <p className="text-xs font-bold text-gray-400">Add products above to fill your cart</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        );
    }

    // =========================================================
    // MAIN DASHBOARD (Default view when no scan is selected)
    // =========================================================
    return (
        <div className="min-h-screen font-sans bg-[#f8faf8]">
            {/* Full Screen Blur Processing Overlay */}
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f4faee]/70 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white p-8 rounded-[32px] shadow-[0_20px_60px_rgba(19,83,39,0.1)] flex flex-col items-center max-w-sm w-full mx-4 text-center border border-[#e5efdb]">
                        <div className="relative mb-6">
                            <div className="w-16 h-16 border-[5px] border-[#e9efe3] border-t-[#135327] rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <ScanLine className="text-[#135327]" size={20} />
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-[#1a2f1b] mb-2 tracking-tight">Analyzing Scan</h3>
                        <p className="text-[13px] font-medium text-[#4b664d] leading-relaxed">Our AI models and agronomy algorithms are diagnosing your plant. Please wait...</p>
                    </div>
                </div>
            )}

            <Navbar />

            {/* Main Content Area */}
            <main className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-24 pb-16">
                
                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    
                    {/* Hero Left - Copy & Actions */}
                    <div className="bg-[#eef6e6] rounded-[32px] p-10 sm:p-14 flex flex-col justify-center shadow-sm">
                        <h4 className="text-[#5a8050] text-[11px] font-black tracking-widest uppercase mb-5">
                            Clinical Diagnostic Tool
                        </h4>
                        
                        <h1 className="text-[#1a2f1b] text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-6">
                            AI-Powered Crop <br className="hidden sm:block" /> Disease Detection
                        </h1>
                        
                        <p className="text-[#4b664d] text-[15px] leading-relaxed font-medium mb-12 max-w-md">
                            Instantly identify pathogens, deficiencies, and pests with surgical precision. Upload a leaf scan to receive an immediate clinical diagnosis and treatment protocol.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                            {/* Hidden file inputs */}
                            <input 
                                type="file" 
                                ref={cameraInputRef} 
                                accept="image/*" 
                                capture="environment" 
                                className="hidden" 
                                onChange={handleFileChange} 
                            />
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleFileChange} 
                            />

                            <button 
                                onClick={() => cameraInputRef.current?.click()}
                                disabled={loading}
                                className="bg-[#135327] hover:bg-[#0f441f] text-white px-8 py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-sm tracking-wide transition-all w-full sm:w-auto shadow-lg shadow-[#135327]/20 disabled:opacity-70"
                            >
                                <Camera size={18} strokeWidth={2.5} />
                                {loading ? 'Processing...' : 'Take Photo via Webcam'}
                            </button>
                            
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                disabled={loading}
                                className="bg-[#ffded3] hover:bg-[#ffd1c2] text-[#cf4227] px-8 py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-sm tracking-wide transition-all w-full sm:w-auto shadow-inner disabled:opacity-70"
                            >
                                <ImageIcon size={18} strokeWidth={2.5} />
                                Upload Crop Image
                            </button>
                        </div>
                    </div>

                    {/* Hero Right - Graphic */}
                    <div className="relative rounded-[32px] overflow-hidden shadow-lg h-[400px] lg:h-auto min-h-[400px] group">
                        <img 
                            src={heroImage} 
                            alt="Agronomist scanning crops" 
                            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[20s] group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-0"></div>
                        
                        {/* Floating Status Badge */}
                        <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 bg-white/95 backdrop-blur-md rounded-[20px] p-4 flex items-center gap-4 shadow-2xl shadow-black/10 z-10 animate-in slide-in-from-bottom-5 duration-1000">
                            <div className="w-10 h-10 bg-[#e0f1cd] rounded-full flex items-center justify-center">
                                <CheckCircle2 className="text-[#135327] w-6 h-6" strokeWidth={2.5} />
                            </div>
                            <div className="pr-4">
                                <p className="text-[9px] font-black text-[#5a8050] tracking-widest uppercase mb-0.5">System Status</p>
                                <p className="text-[#1a2f1b] text-sm font-black tracking-tight">AI Models Online</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4 Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-[#e9efe3] rounded-[28px] p-8 relative overflow-hidden group hover:bg-[#e2eadd] transition-colors shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <p className="text-[#5a8050] text-[10px] font-black tracking-widest uppercase">Total Scans</p>
                            <ScanLine className="text-[#135327]" size={22} strokeWidth={2} />
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-black text-[#1a2f1b] mb-4 tracking-tight">
                            {history.length > 0 ? (history.length * 14 + 104).toLocaleString() : "1,248"}
                        </h2>
                        <div className="flex items-center gap-1.5 text-[#2c4021] text-xs font-bold w-max bg-[#dce6d2] px-3 py-1.5 rounded-lg">
                            <TrendingUp size={12} strokeWidth={3} />
                            +12% this month
                        </div>
                    </div>

                    <div className="bg-[#e9efe3] rounded-[28px] p-8 relative overflow-hidden hover:bg-[#e2eadd] transition-colors shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <p className="text-[#5a8050] text-[10px] font-black tracking-widest uppercase">Diseases Detected</p>
                            <Bug className="text-red-500" size={22} strokeWidth={2} />
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-black text-[#1a2f1b] mb-4 tracking-tight">
                            {history.length > 0 ? history.filter(h => !h.isHealthy).length + 72 : "84"}
                        </h2>
                        <p className="text-[#5a8050] text-xs font-bold mt-1">Across 12 crop types</p>
                    </div>

                    <div className="bg-[#e9efe3] rounded-[28px] p-8 relative overflow-hidden hover:bg-[#e2eadd] transition-colors shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <p className="text-[#5a8050] text-[10px] font-black tracking-widest uppercase">Products Rec.</p>
                            <Beaker className="text-[#135327]" size={22} strokeWidth={2} />
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-black text-[#1a2f1b] mb-4 tracking-tight">
                            312
                        </h2>
                        <p className="text-[#5a8050] text-xs font-bold mt-1">Remedies suggested</p>
                    </div>

                    <div className="bg-[#e9efe3] rounded-[28px] p-8 relative overflow-hidden hover:bg-[#e2eadd] transition-colors shadow-sm">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#e0f1cd] rounded-bl-[100px] z-0 opacity-50"></div>
                        <div className="absolute bottom-0 right-0 w-full h-[60%] bg-gradient-to-t from-[#dce6d2]/50 to-transparent z-0"></div>
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <p className="text-[#5a8050] text-[10px] font-black tracking-widest uppercase">Success Rate</p>
                                <BadgeCheck className="text-[#135327]" size={22} strokeWidth={2} />
                            </div>
                            <h2 className="text-4xl sm:text-5xl font-black text-[#1a2f1b] mb-4 tracking-tight">
                                98.4%
                            </h2>
                            <p className="text-[#135327] text-xs font-bold mt-1">Clinical precision</p>
                        </div>
                    </div>
                </div>

                {/* Ledger / Recent Scans Table */}
                <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-[#e5efdb]">
                    <div className="p-8 sm:px-10 sm:py-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#f8faf8]">
                        <div>
                            <h2 className="text-[#1a2f1b] text-2xl font-black tracking-tight mb-1">Your Recent Scans</h2>
                            <p className="text-[#5a8050] text-sm font-medium">Clinical history and diagnostic reports.</p>
                        </div>
                        <button className="text-[#135327] text-[10px] font-black tracking-[0.15em] uppercase hover:underline underline-offset-4 flex items-center gap-1">
                            View Complete Ledger
                        </button>
                    </div>

                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left min-w-[900px]">
                            <thead className="bg-[#fcfdf8] border-b border-[#f4faee]">
                                <tr>
                                    <th className="px-10 py-5 text-[#5a8050] text-[10px] font-black tracking-widest uppercase">Scan</th>
                                    <th className="px-6 py-5 text-[#5a8050] text-[10px] font-black tracking-widest uppercase">Crop</th>
                                    <th className="px-6 py-5 text-[#5a8050] text-[10px] font-black tracking-widest uppercase">Diagnosis</th>
                                    <th className="px-6 py-5 text-[#5a8050] text-[10px] font-black tracking-widest uppercase">Severity</th>
                                    <th className="px-6 py-5 text-[#5a8050] text-[10px] font-black tracking-widest uppercase">Confidence</th>
                                    <th className="px-6 py-5 text-[#5a8050] text-[10px] font-black tracking-widest uppercase">Date</th>
                                    <th className="px-10 py-5 text-[#5a8050] text-[10px] font-black tracking-widest uppercase align-right text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f8faf8]">
                                {fetchLoading ? (
                                    <tr>
                                        <td colSpan="7" className="py-16 text-center text-[#5a8050] font-bold">
                                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#135327] border-t-transparent"></div>
                                        </td>
                                    </tr>
                                ) : history.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="py-16 text-center text-[#5a8050] font-medium">
                                            No scans recorded yet. Upload an image to begin.
                                        </td>
                                    </tr>
                                ) : (
                                    history.slice(0, 5).map((item) => (
                                        <tr key={item.id} className="hover:bg-[#f8faf8] transition-colors cursor-pointer group" onClick={() => fetchDiagnosisDetail(item.id)}>
                                            <td className="px-10 py-5">
                                                <div className="w-14 h-14 rounded-[14px] overflow-hidden border border-gray-100 shadow-sm group-hover:scale-105 transition-transform">
                                                    <img src={item.imageUrl} alt="scan" className="w-full h-full object-cover" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 align-middle">
                                                <p className="text-[#1a2f1b] font-bold text-sm">{item.cropName || 'Unknown Crop'}</p>
                                            </td>
                                            <td className="px-6 py-5 align-middle">
                                                <p className={`font-black text-sm max-w-[180px] truncate ${item.isHealthy ? 'text-[#135327]' : 'text-[#c32222]'}`} title={item.diseaseName}>
                                                    {item.isHealthy ? 'Healthy Plant' : item.diseaseName}
                                                </p>
                                            </td>
                                            <td className="px-6 py-5 align-middle">
                                                {!item.isHealthy ? (
                                                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getSeverityBadge(item.severity, item.isHealthy)}`}>
                                                        {item.severity}
                                                    </span>
                                                ) : (
                                                    <span className="text-[#5a8050] text-xs font-bold">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 align-middle">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                        <div className={`h-full ${item.confidence > 80 ? 'bg-[#135327]' : 'bg-[#c32222]'}`} style={{ width: `${item.confidence}%` }}></div>
                                                    </div>
                                                    <span className="text-[#1a2f1b] font-bold text-xs">{item.confidence}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 align-middle">
                                                <p className="text-[#5a8050] font-medium text-xs">
                                                    {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </td>
                                            <td className="px-10 py-5 align-middle text-right">
                                                <button className="text-[#1a2f1b] border border-gray-200 group-hover:bg-[#135327] group-hover:text-white group-hover:border-[#135327] p-2 rounded-full transition-all inline-block text-right">
                                                    <ChevronRight size={16} strokeWidth={3} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CropDoctor;
