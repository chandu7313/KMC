import React from 'react';
import { 
  MapPin, 
  Languages, 
  FileText, 
  ShoppingCart, 
  Bell, 
  Rss,
  Check,
  Package,
  AlertTriangle,
  Edit2,
  User
} from 'lucide-react';
import Navbar from '../../layouts/components/Navbar'; // We'll assume the top Navbar is either the app's default Navbar or we create a custom header.
// Looking at the image, there's a specific simple top header, but we usually embed within the overall layout. 

const FarmerProfile = () => {
    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20">
            {/* Custom Header for Profile just like the image */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 flex justify-between items-center">
                <h1 className="text-2xl font-black text-[#1e4a31] tracking-tight">Farmer Profile</h1>
                <div className="flex items-center gap-4">
                    <button className="bg-[#bbedcc] hover:bg-[#a5e1bb] text-[#1e4a31] transition-colors flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm shadow-sm">
                        <Edit2 size={14} /> Edit Profile
                    </button>
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-600 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
                        <Bell size={18} />
                    </div>
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-600 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
                        <User size={18} />
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT COLUMN */}
                <div className="lg:col-span-4 space-y-8">
                    
                    {/* Profile Card */}
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 relative">
                        {/* Green Banner */}
                        <div className="h-32 bg-[#2d7e48]"></div>
                        
                        {/* Avatar */}
                        <div className="absolute top-12 left-1/2 -translate-x-1/2">
                            <div className="w-32 h-32 rounded-full border-[6px] border-white overflow-hidden shadow-sm bg-white">
                                <img 
                                    src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=400" 
                                    alt="Farmer Rajesh" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="pt-16 pb-8 px-6 text-center">
                            <h2 className="text-[22px] font-extrabold text-slate-800 mb-1">Rajesh Deshmukh</h2>
                            <p className="text-xs font-semibold text-slate-500 mb-4 tracking-wide">Farmer ID: #KMC-4492-IN</p>
                            
                            <div className="flex items-center justify-center gap-1.5 text-[#2d7e48] font-bold text-[13px] mb-8">
                                <MapPin size={14} strokeWidth={2.5} />
                                <span>Nashik, Maharashtra</span>
                            </div>

                            <div className="h-px bg-slate-100 w-full mb-6 max-w-[240px] mx-auto"></div>

                            <div className="space-y-4 max-w-[240px] mx-auto">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-medium">Joined Date</span>
                                    <span className="font-extrabold text-slate-800">12 Oct 2021</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-medium">Status</span>
                                    <span className="bg-[#bbedcc] text-[#1e4a31] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded pr-2">
                                        PREMIUM MEMBER
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preferred Languages */}
                    <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <Languages size={22} className="text-[#2d7e48]" strokeWidth={2} />
                            <h3 className="text-[17px] font-extrabold text-slate-800">Preferred Languages</h3>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <span className="border-2 border-[#2d7e48] bg-white text-slate-800 text-[13px] font-bold px-4 py-2 rounded-lg cursor-pointer">
                                Marathi
                            </span>
                            <span className="bg-slate-100 text-slate-600 text-[13px] font-bold px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors">
                                Hindi
                            </span>
                            <span className="bg-slate-100 text-slate-600 text-[13px] font-bold px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors">
                                English
                            </span>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="lg:col-span-8 space-y-8">
                    
                    {/* Personal Information */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                        <h3 className="text-xl font-extrabold text-slate-800 mb-8">Personal Information</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12 mb-10">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1.5">Mobile Number</p>
                                <p className="text-[15px] font-extrabold text-slate-800">+91 98765 43210</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1.5">Farm Size</p>
                                <p className="text-[15px] font-extrabold text-slate-800">12.5 Acres</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1.5">Village</p>
                                <p className="text-[15px] font-extrabold text-slate-800">Kasabe Sukene</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1.5">District</p>
                                <p className="text-[15px] font-extrabold text-slate-800">Nashik</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1.5">State</p>
                                <p className="text-[15px] font-extrabold text-slate-800">Maharashtra</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1.5">Pincode</p>
                                <p className="text-[15px] font-extrabold text-slate-800">422209</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-3">Current Crops</p>
                            <div className="flex gap-3">
                                {['GRAPES', 'ONIONS', 'MAIZE'].map(crop => (
                                    <span key={crop} className="bg-[#f0fdf4] text-[#16a34a] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded">
                                        {crop}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                            <FileText className="text-[#16a34a] mb-2" size={20} strokeWidth={2.5} />
                            <div className="text-[28px] font-black text-slate-900 leading-none mb-1">24</div>
                            <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">Reports</div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                            <ShoppingCart className="text-[#1e4a31] mb-2" size={20} strokeWidth={2.5} />
                            <div className="text-[28px] font-black text-slate-900 leading-none mb-1">08</div>
                            <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">Orders</div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                            <Bell className="text-[#9f1239] mb-2" size={20} strokeWidth={2.5} />
                            <div className="text-[28px] font-black text-slate-900 leading-none mb-1">03</div>
                            <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">Alerts</div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                            <Rss className="text-[#1e4a31] mb-2" size={20} strokeWidth={2.5} />
                            <div className="text-[28px] font-black text-slate-900 leading-none mb-1">112</div>
                            <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">Blogs Read</div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative">
                        <h3 className="text-xl font-extrabold text-slate-800 mb-8">Recent Activity</h3>
                        
                        <div className="relative pl-3 space-y-10">
                            {/* Line connecting the items */}
                            <div className="absolute left-[27px] top-4 bottom-4 w-px bg-slate-200 z-0"></div>
                            
                            {/* Activity Item 1 */}
                            <div className="relative z-10 flex gap-6 mt-2">
                                <div className="w-[30px] h-[30px] rounded-full bg-[#f0fdf4] border-4 border-white flex items-center justify-center text-[#16a34a] shadow-sm shrink-0">
                                    <Check size={12} strokeWidth={4} />
                                </div>
                                <div className="flex-1 pb-2">
                                    <div className="flex justify-between items-start mb-1.5">
                                        <h4 className="text-[15px] font-extrabold text-slate-800">Soil Health Report Generated</h4>
                                        <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap ml-4">2 hours ago</span>
                                    </div>
                                    <p className="text-[13px] text-slate-600 font-medium leading-relaxed">
                                        Section B plot analysis complete. Nitrogen levels optimum for next crop cycle.
                                    </p>
                                </div>
                            </div>

                            {/* Activity Item 2 */}
                            <div className="relative z-10 flex gap-6">
                                <div className="w-[30px] h-[30px] rounded-full bg-slate-100 border-4 border-white flex items-center justify-center text-slate-600 shadow-sm shrink-0">
                                    <Package size={12} strokeWidth={3} />
                                </div>
                                <div className="flex-1 pb-2">
                                    <div className="flex justify-between items-start mb-1.5">
                                        <h4 className="text-[15px] font-extrabold text-slate-800">Order Delivered</h4>
                                        <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap ml-4">Yesterday</span>
                                    </div>
                                    <p className="text-[13px] text-slate-600 font-medium leading-relaxed">
                                        Organic Fertilizer pack (20kg) delivered to Kasabe Sukene hub.
                                    </p>
                                </div>
                            </div>

                            {/* Activity Item 3 */}
                            <div className="relative z-10 flex gap-6">
                                <div className="w-[30px] h-[30px] rounded-full bg-[#fff1f2] border-4 border-white flex items-center justify-center text-[#e11d48] shadow-sm shrink-0">
                                    <AlertTriangle size={12} strokeWidth={3} />
                                </div>
                                <div className="flex-1 pb-2">
                                    <div className="flex justify-between items-start mb-1.5">
                                        <h4 className="text-[15px] font-extrabold text-slate-800">Pest Alert: Downy Mildew</h4>
                                        <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap ml-4">3 days ago</span>
                                    </div>
                                    <p className="text-[13px] text-slate-600 font-medium leading-relaxed max-w-2xl">
                                        High humidity alert for your region. Preventative spraying recommended for Grapes.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FarmerProfile;
