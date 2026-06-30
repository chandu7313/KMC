import React, { useState, useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Sprout, Package, Landmark, 
    LineChart, HeadphonesIcon, Settings, LogOut, 
    Search, Bell, Menu, X, Plus, Sun, Info, AlertTriangle,
    FlaskConical, Leaf, MapPin, Calendar, Phone, ShieldCheck, Tractor, ShoppingCart, BookOpen, Newspaper, LogIn, Globe
} from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useGlobalStore } from '@/app/store/globalStore';
import { LanguageContext } from '@/app/providers/LanguageContext';
import { FarmerModeContext } from '@/app/providers/FarmerModeContext';

const FarmerLayout = () => {
    const navigate = useNavigate();
    const { userData, backendUrl, setIsLoggedin, setUserData } = useGlobalStore();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { language, changeLanguage } = useContext(LanguageContext);
    const { isFarmerMode, toggleFarmerMode } = useContext(FarmerModeContext);

    const logout = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(backendUrl + "/api/auth/logout");
            if (data.success) {
                setIsLoggedin(false);
                setUserData(false);
                navigate("/");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const navItems = [
        { title: 'Home', icon: LayoutDashboard, path: '/' },
        ...(userData ? [{ title: 'My Farm', icon: Sprout, path: '/farmer/dashboard' }] : []),
        { title: 'Crop Doctor', icon: ShieldCheck, path: '/crop-doctor' },
        { title: 'Agri Shop', icon: ShoppingCart, path: '/marketplace' },
        { title: 'Market Prices', icon: Landmark, path: '/market-prices' },
        { title: 'Soil & Crop', icon: FlaskConical, path: '/soil-crop-analysis' },
        { title: 'Equipments', icon: Tractor, path: '/equipments' },
        { title: 'Fertilizers', icon: Leaf, path: '/fertilizers' },
        { title: 'Orchard Planning', icon: MapPin, path: '/orchard-planning' },
        { title: 'Book Visit', icon: Calendar, path: '/book-farm-visit' },
        { title: 'Expert Consultations & Support', icon: HeadphonesIcon, path: '/farmer/support' },
        { title: 'About Us', icon: Info, path: '/about' },
        { title: 'Success Stories', icon: Newspaper, path: '/success-stories' },
        { title: 'Blogs', icon: BookOpen, path: '/blogs' },
    ];

    return (
        <div className="flex h-screen bg-[#FDFCF6] font-sans overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#115e3b] text-white
                transform transition-transform duration-300 ease-in-out flex flex-col
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo Area */}
                <div className="h-20 flex items-center px-6 shrink-0 cursor-pointer" onClick={() => navigate('/')}>
                    <div>
                        <h1 className="text-xl font-black text-white tracking-tight">KMC</h1>
                        <p className="text-[11px] text-green-200 font-medium">Maharashtra Region</p>
                    </div>
                </div>

                {/* Main Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.title}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-6 py-4 transition-all font-semibold text-sm
                                ${isActive 
                                    ? 'bg-[#0f5334] text-white border-l-4 border-white' 
                                    : 'text-green-100 hover:bg-[#146b43] border-l-4 border-transparent'
                                }
                            `}
                        >
                            <item.icon size={20} strokeWidth={2} />
                            {item.title}
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 space-y-2 shrink-0">
                    <button 
                        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md mb-4"
                    >
                        <AlertTriangle size={16} strokeWidth={3} /> Emergency Support
                    </button>

                    <NavLink
                        to="/farmer/settings"
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold text-sm
                            ${isActive ? 'bg-[#0f5334] text-white' : 'text-green-100 hover:bg-[#146b43]'}
                        `}
                    >
                        <Settings size={18} /> Settings
                    </NavLink>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold text-sm text-green-100 hover:bg-red-500/20 hover:text-red-300"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 z-30">
                    {/* Left: Mobile Menu & Greeting */}
                    <div className="flex items-center gap-4 flex-1 min-w-0 pr-2 lg:pr-4">
                        <button 
                            className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg shrink-0"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        
                        <div className="hidden sm:flex items-center gap-3 divide-x divide-slate-300 min-w-0">
                            <h2 className="text-base lg:text-lg xl:text-xl font-black text-[#1f2d1f] truncate">
                                Good Morning, {userData ? userData.name.split(' ')[0] : 'Farmer'} 🌾
                            </h2>
                            <div className="pl-3 hidden xl:flex items-center gap-1.5 text-sm text-slate-600 font-medium shrink-0 whitespace-nowrap">
                                <Sun size={16} className="text-amber-500 shrink-0" />
                                28°C • {userData?.district || 'Ludhiana'}, Punjab
                            </div>
                        </div>
                    </div>

                    {/* Right: Search, Notifications, Profile */}
                    <div className="flex items-center gap-2 lg:gap-4 shrink-0">
                        <div className="relative hidden md:block">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm font-medium focus:ring-2 focus:ring-[#186036]/20 outline-none w-32 lg:w-48 xl:w-64 transition-all"
                            />
                        </div>

                        {/* Language Selector */}
                        <div className="relative group hidden lg:block z-50">
                            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600">
                                <Globe size={16} />
                                <span className="text-xs font-bold uppercase">{language === 'en' ? 'Eng' : language === 'hi' ? 'Hin' : 'Tel'}</span>
                            </button>
                            <div className="absolute right-0 mt-2 w-32 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300">
                                <div className="bg-white shadow-lg rounded-xl border border-slate-100 p-1">
                                    {[
                                        { code: 'en', label: 'English' },
                                        { code: 'hi', label: 'Hindi' },
                                        { code: 'te', label: 'Telugu' }
                                    ].map(lang => (
                                        <button
                                            key={lang.code}
                                            onClick={() => changeLanguage(lang.code)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all ${language === lang.code ? 'bg-[#e8f5e9] text-[#115e3b]' : 'text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            {lang.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Simple Mode Toggle */}
                        <button 
                            onClick={toggleFarmerMode}
                            className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all border shrink-0 ${isFarmerMode ? 'bg-[#115e3b] text-white border-[#115e3b]' : 'hover:bg-slate-100 border-slate-200 text-slate-600'}`}
                            title="Toggle Farmer Simple Mode"
                        >
                            <Tractor size={16} className={isFarmerMode ? 'animate-bounce' : ''} />
                            <span className="text-xs font-bold uppercase">Simple</span>
                        </button>

                        <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors hidden xl:block shrink-0">
                            <Sun size={20} />
                        </button>
                        <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors shrink-0">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-2 lg:pl-4 border-l border-slate-200">
                            {userData ? (
                                <div 
                                    onClick={() => navigate('/profile')}
                                    className="cursor-pointer hover:ring-2 hover:ring-[#186036] w-10 h-10 rounded-full bg-orange-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center font-bold text-orange-800 transition-all"
                                >
                                    {userData.name ? userData.name.charAt(0).toUpperCase() : 'F'}
                                </div>
                            ) : (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="flex items-center gap-2 bg-[#115e3b] hover:bg-[#146b43] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all"
                                >
                                    Login <LogIn size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content (Scrollable) */}
                <div className="flex-1 overflow-auto p-4 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default FarmerLayout;
