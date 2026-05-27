import React from 'react';
import { 
  MapPin, 
  Edit2, 
  BadgeCheck, 
  Download, 
  Ban, 
  User, 
  Tractor, 
  Bell, 
  Shield, 
  ChevronDown,
  Camera,
  Headphones,
  FileText,
  Share2,
  ChevronRight,
  LogOut,
  LayoutGrid,
  Users,
  TrendingUp,
  Sprout,
  Store
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FarmerProfile = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full bg-[#f9fafb] lg:bg-[#f8fafc] min-h-screen relative font-sans">
            
            {/* ─── DESKTOP VIEW ──────────────────────────── */}
            <div className="hidden lg:grid max-w-7xl mx-auto grid-cols-12 gap-6 p-8">
                
                {/* ─── LEFT COLUMN ─────────────────────────── */}
                <div className="col-span-4 space-y-6">
                    
                    {/* Profile Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        {/* Light Green Top */}
                        <div className="h-24 bg-[#f0fdf4]"></div>
                        
                        {/* Avatar & Info */}
                        <div className="relative px-6 pb-6 pt-12 flex flex-col items-center text-center">
                            {/* Avatar */}
                            <div className="absolute -top-12 w-24 h-24 rounded-2xl border-4 border-white overflow-hidden shadow-sm bg-white">
                                <img 
                                    src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=400" 
                                    alt="Rajesh Kumar" 
                                    className="w-full h-full object-cover"
                                />
                                {/* Verified Badge */}
                                <div className="absolute bottom-1 right-1 bg-white rounded-full">
                                    <BadgeCheck className="text-[#15803d] w-6 h-6" fill="currentColor" stroke="white" strokeWidth={2} />
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-slate-900 mt-2">Rajesh Kumar</h2>
                            <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1 mb-5">
                                <MapPin size={14} />
                                <span>Pune, Maharashtra</span>
                            </div>

                            {/* Badges */}
                            <div className="flex items-center justify-center gap-3 w-full mb-6">
                                <div className="flex-1 bg-[#dcfce7] text-[#166534] text-xs font-bold py-2 rounded-full">
                                    ID: AP-992-K
                                </div>
                                <div className="flex-1 bg-[#ffedd5] text-[#9a3412] text-xs font-bold py-2 rounded-full">
                                    Gold Tier
                                </div>
                            </div>

                            {/* Edit Button */}
                            <button className="w-full bg-[#166534] hover:bg-[#14532d] text-white flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
                                <Edit2 size={16} /> Edit Profile
                            </button>
                        </div>
                    </div>

                    {/* Activity Overview */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-sm font-bold text-slate-800 mb-5">Activity Overview</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#f8fafc] border-l-[3px] border-[#166534] rounded-r-lg p-3">
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Scans</p>
                                <p className="text-2xl font-semibold text-slate-900">142</p>
                            </div>
                            <div className="bg-[#f8fafc] border-l-[3px] border-[#15803d] rounded-r-lg p-3">
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Orders</p>
                                <p className="text-2xl font-semibold text-slate-900">28</p>
                            </div>
                            <div className="bg-[#f8fafc] border-l-[3px] border-[#ca8a04] rounded-r-lg p-3">
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Support Calls</p>
                                <p className="text-2xl font-semibold text-slate-900">12</p>
                            </div>
                            <div className="bg-[#f8fafc] border-l-[3px] border-[#d4d4d8] rounded-r-lg p-3">
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Farm Size</p>
                                <p className="text-2xl font-semibold text-slate-900 flex items-baseline gap-1">5 <span className="text-sm font-medium text-slate-600">Acres</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-sm font-bold text-slate-800 mb-5">Preferences</h3>
                        
                        <div className="mb-6">
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Communication Language</p>
                            <div className="flex gap-2">
                                <button className="px-4 py-1.5 rounded-full border border-[#16a34a] text-[#16a34a] bg-[#f0fdf4] text-xs font-semibold">
                                    Marathi
                                </button>
                                <button className="px-4 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium">
                                    Hindi
                                </button>
                                <button className="px-4 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium">
                                    English
                                </button>
                            </div>
                        </div>

                        <div className="space-y-5 pt-5 border-t border-slate-100">
                            <button className="flex items-center gap-3 text-slate-600 hover:text-slate-900 text-sm font-medium w-full group transition-colors">
                                <Download size={18} className="text-slate-400 group-hover:text-slate-600" /> Download Data Report
                            </button>
                            <button className="flex items-center gap-3 text-red-600 hover:text-red-700 text-sm font-medium w-full group transition-colors">
                                <Ban size={18} className="text-red-500 group-hover:text-red-600" /> Suspend Account
                            </button>
                        </div>
                    </div>

                </div>

                {/* ─── RIGHT COLUMN ────────────────────────── */}
                <div className="col-span-8">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full">
                        
                        {/* Tabs */}
                        <div className="flex flex-wrap items-center border-b border-slate-200 px-6">
                            <button className="flex items-center gap-2 px-5 py-4 text-sm font-bold text-[#166534] border-b-2 border-[#166534]">
                                <User size={16} /> My Profile
                            </button>
                            <button className="flex items-center gap-2 px-5 py-4 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors">
                                <Tractor size={16} /> Farm Details
                            </button>
                            <button className="flex items-center gap-2 px-5 py-4 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors">
                                <Bell size={16} /> Notifications 
                                <span className="bg-[#166534] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">3</span>
                            </button>
                            <button className="flex items-center gap-2 px-5 py-4 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors">
                                <Shield size={16} /> Security
                            </button>
                        </div>

                        {/* Tab Content: Personal Information */}
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8 gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
                                    <p className="text-sm text-slate-500 mt-1">Update contact and personal details.</p>
                                </div>
                                <button className="bg-[#427c54] hover:bg-[#346243] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm whitespace-nowrap">
                                    Save Changes
                                </button>
                            </div>

                            {/* Form Grid 1 */}
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2">First Name</label>
                                    <input 
                                        type="text" 
                                        defaultValue="Rajesh" 
                                        className="w-full bg-[#f8fafc] border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2">Last Name</label>
                                    <input 
                                        type="text" 
                                        defaultValue="Kumar" 
                                        className="w-full bg-[#f8fafc] border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2">Phone Number</label>
                                    <div className="flex border border-slate-200 rounded-lg overflow-hidden focus-within:border-[#166534] focus-within:ring-1 focus-within:ring-[#166534]">
                                        <span className="bg-[#e2e8f0] text-slate-600 px-4 py-2.5 text-sm font-medium flex items-center border-r border-slate-200">
                                            +91
                                        </span>
                                        <input 
                                            type="text" 
                                            defaultValue="98765 43210" 
                                            className="w-full bg-[#f8fafc] px-4 py-2.5 text-sm text-slate-900 focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2">Alternate Phone</label>
                                    <input 
                                        type="text" 
                                        placeholder="Optional" 
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534]"
                                    />
                                </div>
                            </div>

                            <div className="h-px bg-slate-200 w-full mb-8"></div>
                            
                            <h3 className="text-base font-bold text-slate-800 mb-6">Location Details</h3>

                            {/* Form Grid 2 */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2">Address Line 1</label>
                                    <input 
                                        type="text" 
                                        defaultValue="Plot 42, Vasant Vihar Agri Zone" 
                                        className="w-full bg-[#f8fafc] border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534]"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2">Village / Block</label>
                                        <input 
                                            type="text" 
                                            defaultValue="Baramati" 
                                            className="w-full bg-[#f8fafc] border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2">District</label>
                                        <input 
                                            type="text" 
                                            defaultValue="Pune" 
                                            className="w-full bg-[#f8fafc] border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534]"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2">State</label>
                                        <div className="relative">
                                            <select 
                                                defaultValue="Maharashtra"
                                                className="w-full bg-[#f8fafc] border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 appearance-none focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534]"
                                            >
                                                <option>Maharashtra</option>
                                                <option>Gujarat</option>
                                                <option>Karnataka</option>
                                            </select>
                                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2">PIN Code</label>
                                        <input 
                                            type="text" 
                                            defaultValue="413102" 
                                            className="w-full bg-[#f8fafc] border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534]"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── MOBILE VIEW ───────────────────────────── */}
            <div className="block lg:hidden w-full max-w-md mx-auto pb-24">
                
                {/* Header */}
                <div className="flex justify-between items-center px-4 py-4 bg-white sticky top-0 z-20">
                    <h1 className="text-xl font-bold text-[#166534]">My Profile</h1>
                    <button className="flex items-center gap-1.5 text-sm font-bold text-slate-700 active:scale-95 transition-transform">
                        <Edit2 size={14} /> Edit
                    </button>
                </div>

                {/* Green Hero */}
                <div className="bg-[#2a7a3b] text-white flex flex-col items-center pt-6 pb-12 px-4 rounded-b-2xl shadow-sm relative z-10">
                    <div className="relative mb-3">
                        <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white shadow-md">
                            <img 
                                src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=400" 
                                alt="Rajesh Kumar" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-sm text-slate-600 border border-slate-200 active:scale-95 transition-transform">
                            <Camera size={14} />
                        </button>
                    </div>
                    <h2 className="text-2xl font-bold flex items-center gap-1.5 tracking-tight">
                        Rajesh Kumar <BadgeCheck size={18} className="text-[#4ade80]" fill="currentColor" stroke="white" />
                    </h2>
                    <p className="text-green-100/90 text-sm mt-1 font-medium">+91 98765 43210</p>
                    <p className="text-green-100/80 text-xs flex items-center gap-1 mt-1 font-medium">
                        <MapPin size={12} /> Shrirampur Village
                    </p>
                </div>

                {/* Stats Row */}
                <div className="px-4 -mt-8 relative z-20 mb-6">
                    <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-100 py-4 px-2 flex justify-between">
                        <div className="flex-1 flex flex-col items-center border-l-2 border-l-[#166534]">
                            <span className="text-lg font-black text-slate-900 leading-tight">12</span>
                            <span className="text-[9px] font-bold uppercase text-slate-600 tracking-wider mt-0.5">Scans</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center border-l-2 border-l-[#4ade80]">
                            <span className="text-lg font-black text-slate-900 leading-tight">8</span>
                            <span className="text-[9px] font-bold uppercase text-slate-600 tracking-wider mt-0.5">Orders</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center border-l-2 border-l-amber-400">
                            <span className="text-lg font-black text-slate-900 leading-tight">3</span>
                            <span className="text-[9px] font-bold uppercase text-slate-600 tracking-wider mt-0.5">Calls</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center border-l-2 border-l-[#166534]">
                            <span className="text-lg font-black text-slate-900 leading-tight">72</span>
                            <span className="text-[9px] font-bold uppercase text-slate-600 tracking-wider mt-0.5">Score</span>
                        </div>
                    </div>
                </div>

                {/* My Farm Details */}
                <div className="mx-4 bg-white rounded-xl shadow-sm border border-slate-100 p-5 mb-6">
                    <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100 text-sm">
                        <Tractor size={18} className="text-[#16a34a]" /> My Farm Details
                    </h3>
                    <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Farm Size</p>
                            <p className="text-sm font-bold text-slate-900">4.5 Acres</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Soil Type</p>
                            <p className="text-sm font-bold text-slate-900">Black Cotton</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Water Source</p>
                            <p className="text-sm font-bold text-slate-900">Borewell & Canal</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Primary Crops</p>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="bg-[#f0fdf4] text-[#16a34a] text-[9px] font-bold px-2 py-0.5 rounded-md leading-tight">Cotton</span>
                                <span className="bg-[#f0fdf4] text-[#16a34a] text-[9px] font-bold px-2 py-0.5 rounded-md leading-tight">Soybean</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Language Preference */}
                <div className="mx-4 mb-6">
                    <h3 className="font-bold text-slate-800 mb-3 text-sm px-1">Language Preference</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <button className="bg-[#f0fdf4] border border-[#16a34a] text-[#166534] font-bold py-2.5 rounded-lg text-sm transition-all active:scale-95 shadow-sm">English</button>
                        <button className="bg-white border border-slate-200 text-slate-600 font-bold py-2.5 rounded-lg text-sm transition-all active:scale-95 shadow-sm">हिंदी</button>
                        <button className="bg-white border border-slate-200 text-slate-600 font-bold py-2.5 rounded-lg text-sm transition-all active:scale-95 shadow-sm">తెలుగు</button>
                    </div>
                </div>

                {/* Notification Toggles */}
                <div className="mx-4 bg-white rounded-xl shadow-sm border border-slate-100 mb-6 divide-y divide-slate-100">
                    <div className="p-4 flex justify-between items-center">
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm mb-0.5">Disease Alerts</h4>
                            <p className="text-[10px] text-slate-500 font-medium">Get notified about crop risks</p>
                        </div>
                        <div className="w-12 h-6 bg-[#16a34a] rounded-full p-1 relative shadow-inner cursor-pointer transition-colors">
                            <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm"></div>
                        </div>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm mb-0.5">Market Price Alerts</h4>
                            <p className="text-[10px] text-slate-500 font-medium">Daily mandi updates</p>
                        </div>
                        <div className="w-12 h-6 bg-slate-200 rounded-full p-1 relative shadow-inner cursor-pointer transition-colors">
                            <div className="w-4 h-4 bg-white rounded-full absolute left-1 shadow-sm"></div>
                        </div>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm mb-0.5">Weather Forecast Notifications</h4>
                            <p className="text-[10px] text-slate-500 font-medium">Rain and storm warnings</p>
                        </div>
                        <div className="w-12 h-6 bg-[#16a34a] rounded-full p-1 relative shadow-inner cursor-pointer transition-colors">
                            <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm"></div>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="mx-4 bg-white rounded-xl shadow-sm border border-slate-100 mb-6 divide-y divide-slate-100">
                    <button className="w-full p-4 flex justify-between items-center text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-3">
                            <Headphones size={18} className="text-slate-600" />
                            <span className="text-sm font-semibold">Contact Support</span>
                        </div>
                        <ChevronRight size={16} className="text-slate-400" />
                    </button>
                    <button className="w-full p-4 flex justify-between items-center text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-3">
                            <FileText size={18} className="text-slate-600" />
                            <span className="text-sm font-semibold">Terms & Privacy</span>
                        </div>
                        <ChevronRight size={16} className="text-slate-400" />
                    </button>
                    <button className="w-full p-4 flex justify-between items-center text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-3">
                            <Share2 size={18} className="text-slate-600" />
                            <span className="text-sm font-semibold">Share App</span>
                        </div>
                        <ChevronRight size={16} className="text-slate-400" />
                    </button>
                </div>

                {/* Log Out */}
                <div className="mx-4 mb-8">
                    <button className="w-full border-2 border-red-600 text-red-600 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 active:bg-red-50 transition-colors bg-white shadow-sm">
                        <LogOut size={18} /> Log Out
                    </button>
                </div>
            </div>

            {/* ─── MOBILE BOTTOM NAVIGATION ─────────────────────── */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center lg:hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div 
                    onClick={() => navigate('/farmer/dashboard')}
                    className="flex flex-col items-center gap-1 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <div className="w-10 h-10 flex items-center justify-center">
                        <LayoutGrid size={22} />
                    </div>
                    <span className="text-[10px] font-semibold">Home</span>
                </div>
                <div className="flex flex-col items-center gap-1 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors">
                    <div className="w-10 h-10 flex items-center justify-center">
                        <Sprout size={22} />
                    </div>
                    <span className="text-[10px] font-semibold">Crops</span>
                </div>
                <div 
                    onClick={() => navigate('/market-prices')}
                    className="flex flex-col items-center gap-1 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <div className="w-10 h-10 flex items-center justify-center">
                        <Store size={22} />
                    </div>
                    <span className="text-[10px] font-semibold">Market</span>
                </div>
                <div className="flex flex-col items-center gap-1 cursor-pointer">
                    <div className="w-10 h-10 bg-[#e6f4ea] rounded-xl flex items-center justify-center text-[#166534] shadow-sm">
                        <User size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-[#166534]">Profile</span>
                </div>
            </div>

        </div>
    );
};

export default FarmerProfile;
