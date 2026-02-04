import { useNavigate, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { MdLogin } from "react-icons/md";

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
        { label: "Soil Test", to: "/soil-crop-analysis" },
        { label: "Fertilizers", to: "/fertilizers" },
        { label: "Equipments", to: "/equipments" },
        { label: "Crop Selection", to: "/crop-selection" },
        { label: "Orchard", to: "/orchard-planning" },
      ],
    },
    { label: "Packages", to: "/packages" },
    { label: "Market Prices", to: "/market-prices" },
    { label: "Success Stories", to: "/success-stories" },
    { label: "Blogs", to: "/blogs" },
    { label: "Contact", to: "/contact" },
  ];

  const linkBase =
    "px-3 py-2 text-sm md:text-base font-medium transition-colors";
  const linkActive = "text-green-700";
  const linkInactive = "text-slate-700 hover:text-green-700";

  return (
    <div className="fixed top-0 inset-x-0 z-50">
      <div className="bg-white shadow-sm">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">

          {/* Logo */}
          <button
            onClick={() => {
              navigate("/");
              setIsMobileOpen(false);
            }}
            className="flex items-center gap-2"
          >
            <img
              src={assets.agridust_logo}
              alt="Kissan Mithar"
              className="w-10"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-lime-500 bg-clip-text text-transparent">
              Kissan Mithar
            </h1>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div key={item.to} className="relative group">
                    <span
                      className={`${linkBase} ${linkInactive} cursor-pointer`}
                    >
                      {item.label}
                    </span>

                    <ul className="absolute left-0 mt-1 w-44 hidden group-hover:block bg-white shadow-lg rounded-xl ring-1 ring-black/5">
                      {item.dropDownOptions.map((each) => (
                        <li key={each.to}>
                          <NavLink
                            to={each.to}
                            className={({ isActive }) =>
                              `${linkBase} block ${
                                isActive ? linkActive : linkInactive
                              }`
                            }
                          >
                            {each.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `${linkBase} ${
                      isActive ? linkActive : linkInactive
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => navigate("/book-farm-visit")} className="flex items-center gap-1 text-slate-700 cursor-pointer bg-yellow-500 text-white font-semibold px-2 py-1 rounded-md">
                  Book Visit
              </button>
            {userData ? (
              <div className="relative group">
                <div className="w-9 h-9 flex justify-center items-center rounded-full bg-green-700 text-white cursor-pointer">
                  {userData.name?.[0]?.toUpperCase()}
                </div>

                <div className="absolute right-0 hidden group-hover:block">
                  <div className="w-32 rounded-xl bg-white shadow-lg ring-1 ring-black/5">
                    <ul className="p-1 text-sm text-slate-700">
                      {!userData.isAccountVerified && (
                        <li
                          className="px-3 py-2 rounded-lg hover:bg-slate-100 cursor-pointer"
                          onClick={sendVerificationOtp}
                        >
                          Verify email
                        </li>
                      )}
                      <li
                        className="px-3 py-2 rounded-lg hover:bg-slate-100 cursor-pointer"
                        onClick={logout}
                      >
                        Logout
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-1 text-slate-700"
              >
                Login <MdLogin />
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileOpen && (
          <div className="md:hidden px-4 pb-4 bg-white shadow-sm">
            {navItems.map((item) => {
              if (item.hasDropdown) {
                const isOpen = openDropdown === item.label;

                return (
                  <div key={item.to}>
                    <button
                      onClick={() =>
                        setOpenDropdown(isOpen ? null : item.label)
                      }
                      className="w-full flex justify-between items-center px-3 py-2 text-base text-slate-700"
                    >
                      {item.label}
                      <span
                        className={`transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      >
                        ▼
                      </span>
                    </button>

                    {isOpen && (
                      <div className="ml-4 space-y-1">
                        {item.dropDownOptions.map((each) => (
                          <NavLink
                            key={each.to}
                            to={each.to}
                            onClick={() => {
                              setIsMobileOpen(false);
                              setOpenDropdown(null);
                            }}
                            className={({ isActive }) =>
                              `block px-3 py-2 text-sm ${
                                isActive
                                  ? linkActive
                                  : linkInactive
                              }`
                            }
                          >
                            {each.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 text-base ${
                      isActive ? linkActive : linkInactive
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              );
            })}

            <div className="mt-2">
              {userData ? (
                <button
                  onClick={logout}
                  className="w-full bg-slate-900 text-white px-3 py-2 rounded-xl"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileOpen(false);
                    navigate("/login");
                  }}
                  className="w-full bg-green-700 text-white px-3 py-2 rounded-xl"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
