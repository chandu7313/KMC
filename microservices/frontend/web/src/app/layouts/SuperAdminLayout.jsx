import { useState } from "react";
import { Outlet, Navigate, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useGlobalStore } from '@/app/store/globalStore';
import {
  LayoutDashboard,
  Server,
  Users,
  Activity,
  Code,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Leaf
} from "lucide-react";

const SuperAdminSidebar = ({ collapsed, setCollapsed, handleLogout }) => {
  const mainNavItems = [
    { to: "/super-admin/dashboard", label: "Overview", icon: <LayoutDashboard size={20} /> },
    { to: "/super-admin/system", label: "System", icon: <Server size={20} /> },
    { to: "/super-admin/users", label: "Users", icon: <Users size={20} /> },
    { to: "/super-admin/monitoring", label: "Monitoring", icon: <Activity size={20} /> },
    { to: "/super-admin/developer", label: "Developer", icon: <Code size={20} /> },
  ];

  return (
    <div className={`${collapsed ? 'w-[72px]' : 'w-64'} bg-[#1A5319] min-h-screen text-white flex flex-col transition-all duration-300 relative`}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-20 w-6 h-6 bg-[#1A5319] border-2 border-white/20 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-[#2d7a2a] transition-all shadow-md"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className={`h-16 flex items-center border-b border-white/10 ${collapsed ? 'justify-center px-2' : 'px-5 gap-3'}`}>
        <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center flex-shrink-0">
          <Leaf size={18} className="text-green-300" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-base font-extrabold tracking-tight leading-none whitespace-nowrap">Kissan Mithar</h1>
            <p className="text-[10px] text-green-300/80 font-semibold uppercase tracking-wider whitespace-nowrap">Consultancy Admin</p>
          </div>
        )}
      </div>

      <nav className={`flex-1 ${collapsed ? 'px-2' : 'px-3'} py-4 space-y-1 overflow-y-auto scrollbar-thin`}>
        {mainNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/super-admin/dashboard"}
            className={({ isActive }) =>
              `flex items-center ${collapsed ? 'justify-center' : 'gap-3'} ${collapsed ? 'px-0 py-3' : 'px-3 py-2.5'} rounded-lg text-sm font-medium transition-all duration-200 group relative
              ${isActive
                ? 'bg-white/15 text-white shadow-sm border-l-[3px] border-green-300'
                : 'text-white/65 hover:bg-white/8 hover:text-white/90 border-l-[3px] border-transparent'
              }`
            }
            title={collapsed ? item.label : undefined}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className={`border-t border-white/10 ${collapsed ? 'px-2' : 'px-3'} py-3 space-y-1`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-3'} py-2.5 rounded-lg bg-green-900/30 border border-green-800/50 text-white/80`}>
          <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0 shadow-[0_0_8px_rgba(74,222,128,0.6)]"></div>
          {!collapsed && (
            <span className="text-[11px] font-semibold tracking-wide text-green-300 truncate">System Status: OK</span>
          )}
        </div>

        <NavLink
          to="/super-admin/settings"
          className={({ isActive }) =>
            `flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-3'} py-2.5 rounded-lg text-sm font-medium transition-all
            ${isActive ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/8 hover:text-white/90'}`
          }
          title={collapsed ? "Settings" : undefined}
        >
          <Settings size={18} className="flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-3'} py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-red-500/15 hover:text-red-300 transition-all`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

const SuperAdminLayout = () => {
  const { isLoggedin, userData, loading, backendUrl, setIsLoggedin, setUserData } = useGlobalStore();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-3 border-[#1A5319]/20 border-t-[#1A5319] rounded-full animate-spin"></div>
      </div>
    );
  }

  // Allow super_admin and tech_admin roles
  if (!isLoggedin || !['super_admin', 'tech_admin'].includes(userData?.role)) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <SuperAdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} handleLogout={handleLogout} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 flex-shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-xl font-bold text-slate-800">Tech Dashboard</h2>
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-green-700 uppercase tracking-wide">System Status: All Operational</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search systems, logs..."
                className="w-full pl-8 pr-4 py-1.5 bg-slate-100 border-none rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1A5319]/20 transition-all"
              />
            </div>

            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center bg-slate-50">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 bg-[#f8fafc]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
