import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";

const AdminSidebar = () => {
  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/admin/users", label: "User Management", icon: "👥" },
    { to: "/admin/farmers", label: "Farmer Management", icon: "🚜" },
    { to: "/admin/market", label: "Market Prices", icon: "📈" },
    { to: "/admin/bookings", label: "Bookings", icon: "📅" },
    { to: "/admin/success-stories", label: "Success Stories", icon: "🌟" },
    { to: "/admin/blogs", label: "Blog Articles", icon: "📝" },
    { to: "/admin/fertilizers", label: "Fertilizer Mgmt", icon: "🌱" },
    { to: "/admin/equipments", label: "Equipment Mgmt", icon: "🚜" },
    { to: "/admin/notifications", label: "Notifications", icon: "🔔" },
    { to: "/admin/analytics", label: "Analytics", icon: "📈" },
    { to: "/", label: "Go to Home", icon: "🏠" },
    // Add more admin links here
  ];

  const linkBase =
    "flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors rounded-lg";
  const linkActive = "bg-green-600 text-white shadow-md";

  return (
    <div className="w-64 bg-slate-900 min-h-screen text-white flex flex-col">
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-center border-b border-slate-800">
         <h1 className="text-xl font-bold tracking-wide">
           <span className="text-green-500">Agri</span>Dust Admin
         </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
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
