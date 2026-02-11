import { useNavigate, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  Menu, 
  X, 
  ChevronDown, 
  LogOut, 
  User, 
  ShoppingBag, 
  Package, 
  Calendar,
  LogIn,
  LayoutDashboard,
  Sprout,
  FlaskConical,
  Wrench,
  Map,
  TreeDeciduous,
  Zap
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(AppContext);

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp"
      );

      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

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
    { to: "/", label: "Home" },
    { label: "About", to: "/about" },
    {
      label: "Services",
      to: "/services",
      hasDropdown: true,
      dropDownOptions: [
        { label: "Soil Test", to: "/soil-crop-analysis", icon: FlaskConical },
        { label: "Fertilizers", to: "/fertilizers", icon: Sprout },
        { label: "Equipments", to: "/equipments", icon: Wrench },
        { label: "Crop Selection", to: "/crop-selection", icon: Map },
        { label: "Orchard", to: "/orchard-planning", icon: TreeDeciduous },
      ],
    },
    { label: "Market Prices", to: "/market-prices" },
    { label: "Success Stories", to: "/success-stories" },
    { label: "Blogs", to: "/blogs" },
  ];

  const linkBase =
    "px-3 py-1.5 text-sm font-extrabold uppercase tracking-widest transition-all duration-300 relative group/link";
  const linkActive = "text-green-700";
  const linkInactive = "text-slate-600 hover:text-green-700";

  return (
    <div className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 pointer-events-none">
      {/* Profile Update Prompt Banner */}
      {userData && userData.name === "KMC Farmer" && (
        <div className="bg-emerald-600 text-white text-[9px] py-1.5 px-4 text-center font-black uppercase tracking-widest rounded-t-2xl pointer-events-auto">
            Welcome! Please <span className="underline cursor-pointer font-bold" onClick={() => navigate('/farmers')}>update your profile</span> with your real name.
        </div>
      )}
      
      <div className={`bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl shadow-green-900/5 transition-all duration-500 pointer-events-auto ${userData && userData.name === "KMC Farmer" ? 'rounded-b-2xl' : 'rounded-2xl'}`}>
        <div className="flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <button
            onClick={() => {
              navigate("/");
              setIsMobileOpen(false);
            }}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative">
                <img
                  src={assets.agridust_logo || null}
                  alt="Kissan Mithar"
                  className="w-10 h-10 object-contain transition-transform group-hover:rotate-12"
                />
            </div>
            <div className="flex flex-col items-start leading-none pointer-events-none">
                <span className="text-xl font-black text-[#1f2d1f]">KISSAN</span>
                <span className="text-xs font-black tracking-[0.4em] text-green-600 uppercase">Mithar</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div key={item.to} className="relative group">
                    <div className={`${linkBase} ${linkInactive} cursor-pointer flex items-center gap-1`}>
                      {item.label}
                      <ChevronDown size={10} className="group-hover:rotate-180 transition-transform" />
                    </div>

                    <div className="absolute left-0 mt-2 w-56 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300">
                      <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-slate-100 p-2 overflow-hidden ring-1 ring-black/5">
                        {item.dropDownOptions.map((each) => (
                          <NavLink
                            key={each.to}
                            to={each.to}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                isActive 
                                  ? 'bg-green-50 text-green-700' 
                                  : 'text-slate-600 hover:bg-slate-50 hover:text-green-700'
                              }`
                            }
                          >
                            <each.icon size={14} strokeWidth={2} />
                            {each.label}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : linkInactive}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      <span className={`absolute -bottom-1 left-3 right-3 h-0.5 bg-green-600 rounded-full transition-all duration-300 transform scale-x-0 group-hover/link:scale-x-100 ${isActive ? 'scale-x-100' : ''}`}></span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <button 
                onClick={() => navigate("/book-farm-visit")} 
                className="group flex items-center gap-2 bg-[#1f2d1f] hover:bg-green-700 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-green-900/10"
            >
                <Calendar size={14} className="group-hover:animate-pulse" />
                Book Visit
            </button>
            
            <div className="w-px h-8 bg-slate-200 ml-2"></div>

            {userData ? (
              <div className="relative group">
                <button className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                  <div className="w-8 h-8 flex justify-center items-center rounded-xl bg-green-700 text-white shadow-lg shadow-green-900/20 font-black text-xs">
                    {userData.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex flex-col items-start text-left leading-tight">
                    <span className="text-[10px] font-black text-[#1f2d1f] uppercase tracking-tighter truncate max-w-[80px]">{userData.name.split(' ')[0]}</span>
                    <span className="text-[8px] font-black text-green-600 uppercase tracking-widest">{userData.role || 'Farmer'}</span>
                  </div>
                </button>

                <div className="absolute right-0 mt-2 w-56 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300">
                  <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-slate-100 p-2 overflow-hidden ring-1 ring-black/5">
                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Hub</p>
                    </div>
                    <button 
                        onClick={() => navigate("/my-orders")}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-green-700 transition-all"
                    >
                        <ShoppingBag size={14} /> My Fertilizers
                    </button>
                    <button 
                        onClick={() => navigate("/my-equipment-orders")}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-green-700 transition-all"
                    >
                        <Package size={14} /> My Equipment
                    </button>
                    {userData.role === 'admin' && (
                         <button 
                            onClick={() => navigate("/admin")}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-green-700 transition-all"
                        >
                            <LayoutDashboard size={14} /> Admin Panel
                        </button>
                    )}
                    <div className="h-px bg-slate-50 my-1 mx-2"></div>
                    <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition-all"
                    >
                        <LogOut size={14} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
              >
                Login <LogIn size={14} />
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="xl:hidden p-2 text-[#1f2d1f]"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? <X size={24}/> : <Menu size={24}/>}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`xl:hidden transition-all duration-500 overflow-hidden ${isMobileOpen ? 'max-h-[85vh] opacity-100 p-6 pt-2 border-t border-slate-50' : 'max-h-0 opacity-0 p-0'}`}>
            <div className="space-y-1">
                {navItems.map((item) => {
                  if (item.hasDropdown) {
                    const isOpen = openDropdown === item.label;

                    return (
                      <div key={item.to} className="space-y-1">
                        <button
                          onClick={() =>
                            setOpenDropdown(isOpen ? null : item.label)
                          }
                          className={`w-full flex justify-between items-center px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] ${isOpen ? 'bg-slate-50 text-green-700' : 'text-slate-600'}`}
                        >
                          {item.label}
                          <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                        </button>

                        <div className={`overflow-hidden transition-all duration-300 ml-4 ${isOpen ? 'max-h-64' : 'max-h-0'}`}>
                            {item.dropDownOptions.map((each) => (
                              <NavLink
                                key={each.to}
                                to={each.to}
                                onClick={() => setIsMobileOpen(false)}
                                className={({ isActive }) =>
                                  `flex items-center gap-3 px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                                    isActive ? 'text-green-700 bg-green-50' : 'text-slate-500'
                                  }`
                                }
                              >
                                <each.icon size={12} />
                                {each.label}
                              </NavLink>
                            ))}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMobileOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-4 rounded-xl text-sm font-black uppercase tracking-[0.2em] ${
                          isActive ? 'bg-green-50 text-green-700' : 'text-slate-600 hover:bg-slate-50'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  );
                })}
            </div>

            <div className="mt-8 space-y-3 pt-6 border-t border-slate-100">
                <button 
                    onClick={() => {setIsMobileOpen(false); navigate("/book-farm-visit")}}
                    className="w-full bg-[#1f2d1f] text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                >
                    <Calendar size={14} /> Book Farm Visit
                </button>
                {userData ? (
                  <button
                    onClick={logout}
                    className="w-full bg-red-50 text-red-600 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                  >
                    <LogOut size={14} /> Logout Account
                  </button>
                ) : (
                  <button
                    onClick={() => {
                        setIsMobileOpen(false);
                        navigate("/login");
                    }}
                    className="w-full bg-green-600 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                  >
                    <LogIn size={14} /> Member Login
                  </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
