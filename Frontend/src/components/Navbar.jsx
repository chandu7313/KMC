import { useNavigate, NavLink } from "react-router-dom"
import { assets } from "../assets/assets"
import { useContext, useState } from "react"
import { AppContext } from "../context/AppContext"
import axios from "axios"
import { toast } from "react-toastify"


const Navbar = () => {

    const navigate = useNavigate()
    const {userData,backendUrl,setUserData,setIsLoggedin} = useContext(AppContext)

    const sendVerificationOtp = async()=>{
      try{

        axios.defaults.withCredentials = true

        const {data} = await axios.post(backendUrl+'/api/auth/send-verify-otp')

        if(data.success){
          navigate('/email-verify')
          toast.success(data.message)
        }else{
          toast.error(data.message)
        }

      }catch(error){
        toast.error(error.message)
      }
    }

    const logout = async ()=>{
      try{
        axios.defaults.withCredentials = true 
        const {data} = await axios.post(backendUrl + '/api/auth/logout')
        data.success && setIsLoggedin(false)
        data.success && setUserData(false)
        navigate('/')

      }catch(error){
        toast.error(error.message)
      }
    }

  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/soil-crop-analysis", label: "Soil & Crop" },
    { to: "/market", label: "Market" },
    { to: "/insights", label: "Insights" },
    { to: "/advisory", label: "Advisory" },
    { to: "/help", label: "Help" },
  ]

  const linkBase = "px-3 py-2 text-sm md:text-base font-medium transition-colors"
  const linkActive = "text-green-700"
  const linkInactive = "text-slate-700 hover:text-green-700"

  return (
    <div className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-4 rounded-2xl bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm ring-1 ring-black/5">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            {/* Logo */}
            <button onClick={() => { navigate('/'); setIsMobileOpen(false) }} className="flex items-center gap-2">
              <img src={assets.agridust_logo} alt="Kissan Mithar" className="w-10 sm:w-10"/>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-lime-500 bg-clip-text text-transparent">Kissan Mithar</h1>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Right actions */}
            <div className="hidden md:flex items-center gap-3">
              {userData ? (
                <div className="relative group">
                  <div className="w-9 h-9 flex justify-center items-center rounded-full bg-green-700 text-white text-sm font-semibold cursor-pointer">
                    {userData.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="absolute right-0 mt-2 hidden group-hover:block">
                    <div className="w-44 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5">
                      <ul className="m-0 p-1 text-sm text-slate-700">
                        {!userData.isAccountVerified && (
                          <li className="px-3 py-2 rounded-lg hover:bg-slate-100 cursor-pointer" onClick={sendVerificationOtp}>Verify email</li>
                        )}
                        <li className="px-3 py-2 rounded-lg hover:bg-slate-100 cursor-pointer" onClick={logout}>Logout</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <button onClick={() => navigate('/login')} className="inline-flex items-center gap-2 rounded-full bg-green-700 px-5 py-2 text-white shadow-sm hover:bg-green-800 focus:outline-none">
                  Login
                  <img src={assets.arrow_icon} alt="" className="w-4 h-4"/>
                </button>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden inline-flex items-center justify-center rounded-xl p-2 text-slate-700 hover:bg-slate-100"
              onClick={() => setIsMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                {isMobileOpen ? (
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M3.75 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75zm0 6a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75zm.75 5.25a.75.75 0 0 0 0 1.5h15a.75.75 0 0 0 0-1.5h-15z" clipRule="evenodd" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {isMobileOpen && (
            <div className="md:hidden px-4 pb-4">
              <div className="space-y-1 rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMobileOpen(false)}
                    className={({ isActive }) => `block rounded-xl px-3 py-2 text-base ${isActive ? linkActive : linkInactive}`}
                  >
                    {item.label}
                  </NavLink>
                ))}
                <div className="pt-1">
                  {userData ? (
                    <button onClick={logout} className="w-full rounded-xl bg-slate-900 px-3 py-2 text-white hover:bg-black">Logout</button>
                  ) : (
                    <button onClick={() => { setIsMobileOpen(false); navigate('/login') }} className="w-full rounded-xl bg-green-700 px-3 py-2 text-white hover:bg-green-800">Login</button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
