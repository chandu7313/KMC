import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import AdminSidebar from '@/app/layouts/AdminSidebar';
import { ALLOWED_ADMIN_ROLES, ROLE_LABELS } from "@/app/config/permissions";
import { Search, Bell, HelpCircle, ChevronDown } from "lucide-react";
import { useGlobalStore } from '@/app/store/globalStore';

// Roles and labels now imported from config/permissions.js

const AdminLayout = () => {
  const { isLoggedin, userData, loading } = useGlobalStore();
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#1A5319]/20 border-t-[#1A5319] rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium text-sm">Loading admin portal...</p>
        </div>
      </div>
    );
  }

  const userRole = userData?.role || '';
  const isAdminUser = userData?.isAdminUser || false;

  if (!isLoggedin || (!ALLOWED_ADMIN_ROLES.includes(userRole) && !isAdminUser)) {
    return <Navigate to="/login" />;
  }

  const roleLabel = ROLE_LABELS[userRole] || userRole;
  const userName = userData?.name || 'Admin';
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 flex-shrink-0">
          {/* Left: Page Title + Search */}
          <div className="flex items-center gap-6 flex-1">
            <div className="relative max-w-md flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search farmers, orders, tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1A5319]/20 focus:border-[#1A5319]/40 transition-all"
              />
            </div>
          </div>

          {/* Right: Role Badge + Actions + Profile */}
          <div className="flex items-center gap-4">
            {/* Viewing As Badge */}
            <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Viewing as:</span>
              <span className="text-xs font-extrabold text-slate-700">{roleLabel}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Help */}
            <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all">
              <HelpCircle size={20} />
            </button>

            {/* Profile Button */}
            <button className="flex items-center gap-2 bg-[#1A5319] text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-[#2d7a2a] transition-all">
              Profile
            </button>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm border border-slate-300">
              {initials}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
