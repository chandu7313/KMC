import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
  LayoutDashboard,
  Users,
  Sprout,
  FlaskConical,
  TrendingUp,
  ShoppingCart,
  Package,
  Headphones,
  UserCog,
  IndianRupee,
  FileText,
  Settings,
  LogOut,
  Activity,
  ChevronLeft,
  ChevronRight,
  Leaf,
} from "lucide-react";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setIsLoggedin, setUserData } = useContext(AppContext);
  const [collapsed, setCollapsed] = useState(false);

  const userRole = userData?.role || '';
  const roleLabelMap = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    tech_admin: 'Tech Admin',
    agri_expert: 'Agri Expert',
    ecommerce_manager: 'E-commerce',
    order_manager: 'Order Manager',
    support_agent: 'Support Agent',
    support_manager: 'Support Manager',
    content_manager: 'Content',
    finance_manager: 'Finance',
    field_agent: 'Field Agent',
  };
  const roleLabel = roleLabelMap[userRole] || userRole;

  const mainNavItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/admin/farmers", label: "Farmers", icon: <Users size={20} /> },
    { to: "/admin/soil-tests", label: "Soil", icon: <FlaskConical size={20} /> },
    { to: "/admin/market", label: "Market", icon: <TrendingUp size={20} /> },
    { to: "/admin/inventory", label: "E-commerce", icon: <ShoppingCart size={20} /> },
    { to: "/admin/bookings", label: "Orders", icon: <Package size={20} /> },
    { to: "/admin/support", label: "Support", icon: <Headphones size={20} /> },
    { to: "/admin/users", label: "Agents", icon: <UserCog size={20} /> },
    { to: "/admin/analytics", label: "Finance", icon: <IndianRupee size={20} /> },
    { to: "/admin/blogs", label: "Content", icon: <FileText size={20} /> },
  ];

  // Filter items based on role
  const isSupportStaff = ['support_agent', 'support_manager'].includes(userRole);
  const isAdmin = ['admin', 'super_admin', 'tech_admin'].includes(userRole);

  const filteredItems = mainNavItems.filter(item => {
    if (isSupportStaff && !isAdmin) {
      // Support staff only sees Dashboard and Support
      return ['Dashboard', 'Support'].includes(item.label);
    }
    return true;
  });

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

  return (
    <div
      className={`${collapsed ? 'w-[72px]' : 'w-64'} bg-[#1A5319] min-h-screen text-white flex flex-col transition-all duration-300 relative`}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-20 w-6 h-6 bg-[#1A5319] border-2 border-white/20 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-[#2d7a2a] transition-all shadow-md"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Brand Header */}
      <div className={`h-16 flex items-center border-b border-white/10 ${collapsed ? 'justify-center px-2' : 'px-5 gap-3'}`}>
        <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center flex-shrink-0">
          <Leaf size={18} className="text-green-300" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-base font-extrabold tracking-tight leading-none">KMC Portal</h1>
            <p className="text-[10px] text-green-300/80 font-semibold uppercase tracking-wider">{roleLabel}</p>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className={`flex-1 ${collapsed ? 'px-2' : 'px-3'} py-4 space-y-1 overflow-y-auto scrollbar-thin`}>
        {filteredItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/admin/dashboard"}
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

      {/* Footer Section */}
      <div className={`border-t border-white/10 ${collapsed ? 'px-2' : 'px-3'} py-3 space-y-1`}>
        {/* System Status */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-3'} py-2.5 rounded-lg bg-white/8 text-white/80`}>
          <Activity size={16} className="text-green-400 flex-shrink-0" />
          {!collapsed && (
            <span className="text-xs font-semibold tracking-wide">System Status</span>
          )}
          {!collapsed && (
            <span className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          )}
        </div>

        {/* Settings */}
        <NavLink
          to="/admin/soil-entry"
          className={({ isActive }) =>
            `flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-3'} py-2.5 rounded-lg text-sm font-medium transition-all
            ${isActive
              ? 'bg-white/15 text-white'
              : 'text-white/60 hover:bg-white/8 hover:text-white/90'
            }`
          }
          title={collapsed ? "Settings" : undefined}
        >
          <Settings size={18} className="flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>

        {/* Logout */}
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

export default AdminSidebar;
