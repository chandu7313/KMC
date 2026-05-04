import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";
import { 
  LayoutDashboard, 
  Users, 
  Tractor, 
  TrendingUp, 
  Calendar, 
  Star, 
  FileText, 
  Sprout, 
  Bell, 
  Home,
  LogOut,
  Headphones
} from "lucide-react";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const AdminSidebar = () => {
  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/admin/users", label: "User Management", icon: <Users size={20} /> },
    { to: "/admin/farmers", label: "Farmer Management", icon: <Tractor size={20} /> },
    { to: "/admin/market", label: "Market Prices", icon: <TrendingUp size={20} /> },
    { to: "/admin/bookings", label: "Bookings", icon: <Calendar size={20} /> },
    { to: "/admin/success-stories", label: "Success Stories", icon: <Star size={20} /> },
    { to: "/admin/blogs", label: "Blog Articles", icon: <FileText size={20} /> },
    { to: "/admin/fertilizers", label: "Fertilizer Mgmt", icon: <Sprout size={20} /> },
    { to: "/admin/equipments", label: "Equipment Mgmt", icon: <Tractor size={20} /> },
    { to: "/admin/soil-tests", label: "Soil Tests", icon: <Sprout size={20} /> },
    { to: "/admin/soil-entry", label: "Manual Soil Entry", icon: <FileText size={20} /> },
    { to: "/admin/notifications", label: "Notifications", icon: <Bell size={20} /> },
    { to: "/admin/analytics", label: "Analytics", icon: <TrendingUp size={20} /> },
    { to: "/admin/support", label: "Support Portal", icon: <Headphones size={20} /> },
    { to: "/", label: "Go to Home", icon: <Home size={20} /> },
  ];

  const { userData } = useContext(AppContext);
  const userRole = userData?.role || '';
  const isSupportStaff = ['super_admin', 'support_agent', 'support_manager'].includes(userRole);
  const isAdmin = userRole === 'admin';

  // Filter items based on role if needed
  const filteredItems = navItems.filter(item => {
    if (isSupportStaff && !isAdmin) {
      // Support staff only sees Support Portal and Home in main sidebar
      return ['Support Portal', 'Go to Home'].includes(item.label);
    }
    return true;
  });

  const linkBase =
    "flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors rounded-lg";
  const linkActive = "bg-green-600 text-white shadow-md";

  return (
    <div className="w-64 bg-slate-900 min-h-screen text-white flex flex-col">
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-center border-b border-slate-800">
         <h1 className="text-xl font-bold tracking-wide">
           <span className="text-green-500">Kisan</span>Mithar Admin
         </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      {/* Footer / Logout could go here */}
      <div className="p-4 border-t border-slate-800">
        <div className="text-xs text-slate-500 text-center">
            &copy; 2026 AgriDust
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
