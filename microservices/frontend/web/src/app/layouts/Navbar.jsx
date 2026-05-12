import { useContext, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { assets } from '@/assets/assets';
import { LanguageContext } from '@/app/providers/LanguageContext';
import { FarmerModeContext } from '@/app/providers/FarmerModeContext';
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-toastify";
import { useGlobalStore } from '@/app/store/globalStore';
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
  Zap,
  Tractor,
  Landmark
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { userData, backendUrl, setUserData, setIsLoggedin } = useGlobalStore();
  const { language, changeLanguage } = useContext(LanguageContext);
  const { isFarmerMode, toggleFarmerMode } = useContext(FarmerModeContext);
  const { t } = useTranslation();

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
    { label: t('home', 'Home'), to: "/" },
    { label: t('about', 'About'), to: "/about" },
    {
      label: t('services', 'Services'),
      to: "/services",
      hasDropdown: true,
      dropDownOptions: [
        { label: t('soil_test', 'Soil Test'), to: "/soil-crop-analysis", icon: FlaskConical },
        { label: 'Crop Doctor', to: '/crop-doctor', icon: Zap },
        { label: t('fertilizers', 'Fertilizers'), to: "/fertilizers", icon: Sprout },
        { label: t('equipments', 'Equipments'), to: "/equipments", icon: Wrench },
        { label: t('crop_selection', 'Crop Selection'), to: "/crop-selection", icon: Map },
        { label: t('orchard', 'Orchard'), to: "/orchard-planning", icon: TreeDeciduous },
        { label: t('gov_schemes', 'Govt. Schemes'), to: "/government-schemes", icon: Landmark },
        { label: t('experts', 'Experts'), to: "/expert-consultations", icon: User },
      ],
    },
    { label: t('market_prices', 'Market Prices'), to: "/market-prices" },
    { label: t('success_stories', 'Success Stories'), to: "/success-stories" },
    { label: t('blogs', 'Blogs'), to: "/blogs" },
  ];

  const linkBase =
    "px-1 lg:px-2 xl:px-3 h-14 flex flex-col items-center justify-center text-[10px] lg:text-[11px] xl:text-xs font-extrabold uppercase tracking-wide transition-all duration-300 relative group/link text-center leading-tight";
  const linkActive = "text-green-700";
  const linkInactive = "text-slate-600 hover:text-green-700";

  return (
    <div className="fixed top-0 inset-x-0 z-50 pointer-events-none">
      {/* Profile Update Prompt Banner */}
      {userData && userData.name === "KMC Farmer" && (
        <div className="bg-emerald-600 text-white text-[9px] py-1.5 px-4 text-center font-black uppercase tracking-widest pointer-events-auto">
            Welcome! Please <span className="underline cursor-pointer font-bold" onClick={() => navigate('/farmers')}>update your profile</span> with your real name.
        </div>
      )}
      
      <div className={`bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-md transition-all duration-500 pointer-events-auto`}>
        <div className="flex items-center justify-between lg:justify-start w-full h-14 px-4 sm:h-16 sm:px-6">
          {/* Logo */}
          <button
            onClick={() => {
              navigate("/");
              setIsMobileOpen(false);
            }}
            className="flex items-center gap-2.5 group shrink-0"
          >
            <div className="relative">
                <img
                  src={assets.agridust_logo || null}
                  alt="Kissan Mithar"
                  className="w-10 h-10 object-contain transition-transform group-hover:rotate-12"
                />
            </div>
            <div className={`flex-col items-start leading-none pointer-events-none ${isHome ? 'flex' : 'hidden md:flex'}`}>
                <span className="text-xl font-black text-[#1f2d1f]">KISSAN</span>
                <span className="text-xs font-black tracking-[0.4em] text-green-600 uppercase">Mithar</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0 lg:gap-1 xl:gap-2 lg:ml-2 xl:ml-6 2xl:ml-12 shrink-0">
            {navItems.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div key={item.to} className="relative group">
                    <div className={`${linkBase.replace('flex-col', 'flex-row')} ${linkInactive} cursor-pointer gap-1 whitespace-nowrap`}>
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
                    `${linkBase} max-w-[80px] lg:max-w-[95px] xl:max-w-[110px] ${isActive ? linkActive : linkInactive}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="line-clamp-2 md:line-clamp-none leading-snug break-words">{item.label}</span>
                      <span className={`absolute bottom-0 left-2 xl:left-3 right-2 xl:right-3 h-[3px] bg-green-600 rounded-full transition-all duration-300 transform scale-x-0 group-hover/link:scale-x-100 ${isActive ? 'scale-x-100' : ''}`}></span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-1.5 xl:gap-3 lg:ml-auto shrink-0">
            <div className="relative group/lang">
                <button className="flex items-center gap-1.5 px-2 xl:px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all border border-slate-100">
                    <Zap size={14} className="text-green-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{language === 'en' ? 'Eng' : language === 'hi' ? 'Hin' : 'Tel'}</span>
                    <ChevronDown size={10} className="text-slate-400 group-hover/lang:rotate-180 transition-transform" />
                </button>
                <div className="absolute right-0 mt-2 w-32 opacity-0 translate-y-2 invisible group-hover/lang:opacity-100 group-hover/lang:translate-y-0 group-hover/lang:visible transition-all duration-300">
                    <div className="bg-white shadow-2xl rounded-xl border border-slate-100 p-1 overflow-hidden">
                        {[
                            { code: 'en', label: 'English' },
                            { code: 'hi', label: 'Hindi' },
                            { code: 'te', label: 'Telugu' }
                        ].map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${language === lang.code ? 'bg-green-50 text-green-700' : 'text-slate-600 hover:bg-slate-50 hover:text-green-700'}`}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button 
                onClick={toggleFarmerMode}
                className={`flex items-center gap-1.5 px-2 xl:px-3 py-1.5 rounded-lg transition-all border ${isFarmerMode ? 'bg-green-600 text-white border-green-700 shadow-inner' : 'hover:bg-slate-50 border-slate-100 text-slate-600'}`}
                title="Toggle Farmer Simple Mode"
            >
                <Tractor size={14} className={isFarmerMode ? 'animate-bounce' : ''} />
                <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Simple Mode</span>
            </button>

            <button 
                id="contact-button"
                onClick={() => navigate("/book-farm-visit")} 
                className="group flex items-center gap-2 bg-[#1f2d1f] hover:bg-green-700 text-white px-3 xl:px-5 py-2 xl:py-2.5 rounded-xl text-[10px] xl:text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-green-900/10 shrink-0 whitespace-nowrap"
            >
                <Calendar size={14} className="group-hover:animate-pulse" />
                Book Visit
            </button>
            
            <div className="w-px h-8 bg-slate-200 ml-2"></div>

            {userData ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-1 pr-2 xl:pr-3 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 shrink-0">
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
                        onClick={() => navigate("/farmer/dashboard")}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-green-700 transition-all"
                    >
                        <LayoutDashboard size={14} /> Dashboard
                    </button>
                    <button 
                        onClick={() => navigate("/cart")}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-green-700 transition-all"
                    >
                        <ShoppingBag size={14} /> My Cart
                    </button>
                    <button 
                        onClick={() => navigate("/my-orders")}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-green-700 transition-all"
                    >
                        <Package size={14} /> My Orders
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
                id="login-button"
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 xl:px-6 py-2 xl:py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap shrink-0"
              >
                Login <LogIn size={14} />
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 text-[#1f2d1f]"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? <X size={24}/> : <Menu size={24}/>}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-500 overflow-hidden bg-white/95 backdrop-blur-2xl px-4 rounded-b-3xl shadow-2xl ${isMobileOpen ? 'max-h-[85vh] opacity-100 py-3 border-t border-slate-100' : 'max-h-0 opacity-0 py-0'}`}>
            <div className="space-y-0.5">
                {navItems.map((item) => {
                  if (item.hasDropdown) {
                    const isOpen = openDropdown === item.label;

                    return (
                      <div key={item.to} className="space-y-0.5">
                        <button
                          onClick={() =>
                            setOpenDropdown(isOpen ? null : item.label)
                          }
                          className={`w-full flex justify-between items-center px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] ${isOpen ? 'bg-slate-50 text-green-700' : 'text-slate-600'}`}
                        >
                          {item.label}
                          <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                        </button>

                        <div className={`overflow-hidden transition-all duration-300 ml-4 ${isOpen ? 'max-h-64' : 'max-h-0'}`}>
                            {item.dropDownOptions.map((each) => (
                              <NavLink
                                key={each.to}
                                to={each.to}
                                onClick={() => setIsMobileOpen(false)}
                                className={({ isActive }) =>
                                  `flex items-center gap-3 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest ${
                                    isActive ? 'text-green-700 bg-green-50' : 'text-slate-500 hover:text-green-600 hover:bg-green-50'
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
                        `block px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] ${
                          isActive ? 'bg-green-50 text-green-700' : 'text-slate-600 hover:bg-slate-50'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  );
                })}
            </div>

            <div className="mt-2 space-y-1.5 pt-3 border-t border-slate-100">
                <button 
                    onClick={() => {setIsMobileOpen(false); navigate("/book-farm-visit")}}
                    className="w-full bg-[#1f2d1f] text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                >
                    <Calendar size={12} /> Book Farm Visit
                </button>
                <div className="flex gap-1.5">
                    <button 
                        onClick={() => {
                            toggleFarmerMode();
                        }}
                        className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2 transition-all ${isFarmerMode ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                    >
                        <Tractor size={12} /> Simple Mode
                    </button>
                    {userData ? (
                      <>
                        <button
                          onClick={() => {
                              setIsMobileOpen(false);
                              navigate("/cart");
                          }}
                          className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2"
                        >
                          <ShoppingBag size={12} /> My Cart
                        </button>
                        <button
                          onClick={logout}
                          className="flex-1 bg-red-50 text-red-600 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2"
                        >
                          <LogOut size={12} /> Logout
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                            setIsMobileOpen(false);
                            navigate("/login");
                        }}
                        className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2"
                      >
                        <LogIn size={12} /> Login
                      </button>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
