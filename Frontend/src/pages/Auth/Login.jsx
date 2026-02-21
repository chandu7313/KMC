import { useContext, useState } from "react"
import { assets } from "../../assets/assets"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../../context/AppContext"
import { useTranslation } from "react-i18next"
import axios from "axios"
import { toast } from "react-toastify"

const Login = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext)

    const [state, setState] = useState('Login')
    const [authMethod, setAuthMethod] = useState('mobile')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [otp, setOtp] = useState('')
    const [showOtpInput, setShowOtpInput] = useState(false)
    const [loading, setLoading] = useState(false)

    const syncPreferencesToBackend = async () => {
        try {
            const preferredLanguage = localStorage.getItem('i18nextLng') || 'en';
            const hasCompletedTour = localStorage.getItem('kmc_tour_completed') === 'true' || localStorage.getItem('tourCompleted') === 'true';
            const simpleMode = localStorage.getItem('kmc_farmer_mode') === 'true';

            await axios.post(backendUrl + "/api/user/preferences", {
                preferredLanguage,
                hasCompletedTour,
                simpleMode
            }, { withCredentials: true });
        } catch (error) {
            console.error("Failed to sync preferences to backend:", error);
        }
    }

    const onSendOtp = async (e) => {
        try {
            e.preventDefault()
            setLoading(true)
            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + "/api/auth/send-otp", { phone })
            if (data.success) {
                setShowOtpInput(true)
                if (data.isNewUser) {
                    toast.info("New mobile number detected. Creating your account!")
                }
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const onVerifyOtp = async (e) => {
        try {
            e.preventDefault()
            setLoading(true)
            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + "/api/auth/verify-otp", { phone, otp })
            if (data.success) {
                setIsLoggedin(true)
                getUserData()
                await syncPreferencesToBackend()
                navigate("/")
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const onEmailAuth = async (e) => {
        try {
            e.preventDefault()
            setLoading(true)
            axios.defaults.withCredentials = true
            
            if (state === "Sign Up") {
                const { data } = await axios.post(backendUrl + "/api/auth/register", { name, email, password })
                if (data.success) {
                    setIsLoggedin(true)
                    getUserData()
                    await syncPreferencesToBackend()
                    navigate("/")
                } else {
                    toast.error(data.message)
                }
            } else {
                const { data } = await axios.post(backendUrl + "/api/auth/login", { email, password })
                if (data.success) {
                    setIsLoggedin(true)
                    getUserData()
                    await syncPreferencesToBackend()
                    navigate("/")
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-b from-stone-100 to-emerald-50">
            <img onClick={() => navigate("/")} src={assets.agridust_logo} alt="" className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer" />
            
            <div className="bg-white/95 backdrop-blur p-10 rounded-3xl shadow-2xl w-full sm:w-[400px] text-slate-700 text-sm border border-emerald-100 animate-in fade-in zoom-in duration-300">
                
                <h2 className="text-3xl font-bold text-slate-900 text-center mb-2">
                    {showOtpInput ? t('verify_otp_title') : (state === 'Login' ? t('welcome_back') : t('create_account'))}
                </h2>
                
                <p className="text-center text-slate-500 mb-6 px-4">
                    {showOtpInput ? `${t('verify_otp_title')} sent to +91 ${phone}` : (state === 'Login' ? t('sign_in_to_continue') : t('sign_up_to_continue'))}
                </p>

                {/* Auth Method Toggle */}
                {!showOtpInput && (
                    <div className="flex bg-slate-100 p-1 rounded-xl mb-6 shadow-inner">
                        <button 
                            onClick={() => {setAuthMethod('mobile'); setState('Login')}}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${authMethod === 'mobile' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-400'}`}
                        >
                            {t('mobile_otp')}
                        </button>
                        <button 
                            onClick={() => setAuthMethod('email')}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${authMethod === 'email' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-400'}`}
                        >
                            {t('email')}
                        </button>
                    </div>
                )}

                <form onSubmit={showOtpInput ? onVerifyOtp : (authMethod === 'mobile' ? onSendOtp : onEmailAuth)} className="space-y-4">
                    
                    {authMethod === 'email' && state === "Sign Up" && !showOtpInput && (
                        <div className='flex items-center gap-3 w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-emerald-500 focus-within:bg-white transition-all'>
                            <img src={assets.person_icon} alt="" className="w-5 h-5 opacity-40" />
                            <input value={name} onChange={e => setName(e.target.value)} className="bg-transparent outline-none text-slate-900 placeholder-slate-400 w-full font-medium" type="text" placeholder={t('full_name')} required />
                        </div>
                    )}

                    {authMethod === 'mobile' ? (
                        <>
                            {!showOtpInput ? (
                                <div className='flex items-center gap-3 w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-emerald-500 focus-within:bg-white transition-all'>
                                    <span className="text-slate-400 font-bold border-r pr-3 border-slate-200">+91</span>
                                    <input value={phone} onChange={e => setPhone(e.target.value)} className="bg-transparent outline-none text-slate-900 placeholder-slate-400 w-full font-medium" type="tel" placeholder={t('mobile_number')} required pattern="[0-9]{10}" />
                                </div>
                            ) : (
                                <div className='flex items-center gap-3 w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-emerald-500 focus-within:bg-white transition-all'>
                                    <img src={assets.lock_icon} alt="" className="w-5 h-5 opacity-40" />
                                    <input value={otp} onChange={e => setOtp(e.target.value)} className="bg-transparent outline-none text-slate-900 placeholder-slate-400 w-full text-center tracking-[0.5em] text-2xl font-bold" type="text" maxLength="6" placeholder="000000" required autoFocus />
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className='flex items-center gap-3 w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-emerald-500 focus-within:bg-white transition-all'>
                                <img src={assets.mail_icon} alt="" className="w-5 h-5 opacity-40" />
                                <input value={email} onChange={e => setEmail(e.target.value)} className="bg-transparent outline-none text-slate-900 placeholder-slate-400 w-full font-medium" type="email" placeholder={t('email')} required />
                            </div>
                            <div className='flex items-center gap-3 w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-emerald-500 focus-within:bg-white transition-all'>
                                <img src={assets.lock_icon} alt="" className="w-5 h-5 opacity-40" />
                                <input value={password} onChange={e => setPassword(e.target.value)} className="bg-transparent outline-none text-slate-900 placeholder-slate-400 w-full font-medium" type="password" placeholder={t('password')} required />
                            </div>
                            {state === "Login" && (
                                <p className="text-right text-emerald-700 hover:text-emerald-800 cursor-pointer text-[10px] font-bold uppercase tracking-wider" onClick={() => navigate("/reset-password")}>{t('forgot_password')}</p>
                            )}
                        </>
                    )}

                    <button 
                        disabled={loading}
                        className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all text-white font-bold text-base shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 group"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                {showOtpInput ? t('verify_and_login') : (authMethod === 'mobile' ? t('send_otp') : (state === "Sign Up" ? t('create_account') : t('login')))}
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </>
                        )}
                    </button>
                    
                    {showOtpInput && (
                        <button type="button" onClick={() => {setShowOtpInput(false); setOtp("")}} className="w-full text-center text-emerald-700 hover:underline font-bold text-[10px] uppercase tracking-widest mt-2">
                            {t('change_phone')}
                        </button>
                    )}
                </form>

                {!showOtpInput && (
                    <p className="text-slate-400 text-center text-xs mt-8">
                        {state === "Sign Up" ? t('already_have_account') : t('dont_have_account')}
                        <span className="text-emerald-700 hover:text-emerald-800 cursor-pointer font-bold underline underline-offset-4"
                            onClick={() => {
                                setState(state === 'Sign Up' ? 'Login' : 'Sign Up');
                                setAuthMethod('email'); // Toggle automatically to email for sign up flow
                            }}>
                            {state === 'Sign Up' ? t('login_here') : t('register_here')}
                        </span>
                    </p>
                )}
            </div>
        </div>
    )
}

export default Login
