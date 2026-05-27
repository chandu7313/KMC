import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Sprout, Package, Landmark, 
    LineChart, HeadphonesIcon, Settings, LogOut, 
    Search, Bell, Menu, X, Plus, Sun, Info, AlertTriangle
} from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useGlobalStore } from '@/app/store/globalStore';

const FarmerLayout = () => {
    const navigate = useNavigate();
    const { userData, backendUrl, setIsLoggedin, setUserData } = useGlobalStore();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        { title: 'My Farm', icon: LayoutDashboard, path: '/farmer/dashboard' },
        { title: 'Market & Shop', icon: Package, path: '/market-prices' },
        { title: 'Expert & Support', icon: HeadphonesIcon, path: '/farmer/support' },
        { title: 'Information', icon: Info, path: '/farmer/information' },
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
                    <div className="flex items-center gap-4">
                        <button 
                            className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        
                        <div className="hidden sm:flex items-center gap-3 divide-x divide-slate-300">
                            <h2 className="text-xl font-black text-[#1f2d1f]">
                                Good Morning, {userData ? userData.name.split(' ')[0] : 'Farmer'} 🌾
                            </h2>
                            <div className="pl-3 flex items-center gap-1.5 text-sm text-slate-600 font-medium">
                                <Sun size={16} className="text-amber-500" />
                                28°C • {userData?.district || 'Ludhiana'}, Punjab
                            </div>
                        </div>
                    </div>

                    {/* Right: Search, Notifications, Profile */}
                    <div className="flex items-center gap-4 lg:gap-6">
                        <div className="relative hidden md:block">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search data..." 
                                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm font-medium focus:ring-2 focus:ring-[#186036]/20 outline-none w-64 transition-all"
                            />
                        </div>

                        <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                            <Sun size={20} />
                        </button>
                        <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-2 lg:pl-4 border-l border-slate-200">
                            <div 
                                onClick={() => navigate('/profile')}
                                className="cursor-pointer hover:ring-2 hover:ring-[#186036] w-10 h-10 rounded-full bg-orange-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center font-bold text-orange-800 transition-all"
                            >
                                {userData?.name ? userData.name.charAt(0).toUpperCase() : 'F'}
                            </div>
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
