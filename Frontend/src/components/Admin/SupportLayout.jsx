import { useContext, useState } from "react";
import { Outlet, Navigate, NavLink } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import {
  LayoutDashboard, Ticket, Users, Phone, FileText,
  Bell, BarChart3, UserCog, Settings, ChevronLeft,
  ChevronRight, Headphones, LogOut, Home, Menu, X
} from "lucide-react";

const navItems = [
  { to: "/admin/support", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/support/tickets", label: "Tickets", icon: Ticket },
  { to: "/admin/support/farmers", label: "Farmers", icon: Users },
  { to: "/admin/support/bookings", label: "Call Bookings", icon: Phone },
  { to: "/admin/support/templates", label: "Templates", icon: FileText },
  { to: "/admin/support/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/support/reports", label: "Reports", icon: BarChart3 },
  { to: "/admin/support/agents", label: "Agents", icon: UserCog },
  { to: "/admin/support/settings/sla", label: "SLA Settings", icon: Settings },
];

const SupportLayout = () => {
  const { isLoggedin, userData, loading } = useContext(AppContext);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading Support Portal...</p>
        </div>
      </div>
    );
  }

  const allowedSupportRoles = ['admin', 'super_admin', 'support_agent', 'support_manager'];
  
  if (!isLoggedin || !allowedSupportRoles.includes(userData?.role)) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative z-50 h-full flex flex-col
        bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950
        border-r border-slate-800/50 transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[72px]' : 'w-64'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className={`h-16 flex items-center border-b border-slate-800/50 ${collapsed ? 'justify-center px-2' : 'justify-between px-4'}`}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Headphones size={16} className="text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white leading-none">Support</h1>
                <p className="text-[10px] text-slate-500 leading-none mt-0.5">KMC Portal</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-7 h-7 items-center justify-center rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-slate-400">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-emerald-500/10 text-emerald-400 shadow-sm shadow-emerald-500/5'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <item.icon size={18} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-slate-800/50 space-y-1">
          <NavLink
            to="/admin/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            <Home size={18} className="shrink-0" />
            {!collapsed && <span>Main Admin</span>}
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-14 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden text-slate-400 hover:text-white">
              <Menu size={20} />
            </button>
            <h2 className="text-sm font-semibold text-slate-200">Customer Support Portal</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell size={18} className="text-slate-400 hover:text-white cursor-pointer transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
              {userData?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-slate-950 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SupportLayout;
