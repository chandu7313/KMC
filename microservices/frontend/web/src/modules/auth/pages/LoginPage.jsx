import { useState } from "react"
import { assets } from '@/assets/assets'
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import axios from "axios"
import { toast } from "react-toastify"
import { useGlobalStore } from '@/app/store/globalStore';
import API from '@/core/api/api.config';
import { DEV_ACCOUNTS, ROLE_ICONS, ROLE_COLORS, getDefaultRoute, isAdminRole } from '@/app/config/permissions';

const Login = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { backendUrl, setIsLoggedin, getUserData } = useGlobalStore();

    const [state, setState] = useState('Login')
    const [authMethod, setAuthMethod] = useState('mobile')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [otp, setOtp] = useState('')
    const [showOtpInput, setShowOtpInput] = useState(false)
    const [loading, setLoading] = useState(false)
    const [devLoginLoading, setDevLoginLoading] = useState(null)

    const syncPreferencesToBackend = async () => {
        try {
            const preferredLanguage = localStorage.getItem('i18nextLng') || 'en';
            const hasCompletedTour = localStorage.getItem('kmc_tour_completed') === 'true' || localStorage.getItem('tourCompleted') === 'true';
            const simpleMode = localStorage.getItem('kmc_farmer_mode') === 'true';

            await axios.post(backendUrl + `${API.USER}/profile/preferences`, {
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
            const { data } = await axios.post(backendUrl + `${API.AUTH}/send-otp`, { phone })
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
            const { data } = await axios.post(backendUrl + `${API.AUTH}/verify-otp`, { phone, otp })
            if (data.success) {
                setIsLoggedin(true)
                await getUserData()
                syncPreferencesToBackend().catch(err => console.warn('Preferences sync skipped', err));
                // Check if farmer needs to complete onboarding survey
                try {
                    const surveyRes = await axios.get(backendUrl + `${API.SURVEY}/status`)
                    if (surveyRes.data.success && !surveyRes.data.data?.hasCompletedSurvey) {
                        navigate("/onboarding-survey")
                        return
                    }
                } catch (err) { console.error("Survey status check failed", err) }
                navigate("/farmer/dashboard")
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
                const { data } = await axios.post(backendUrl + `${API.AUTH}/register`, { name, email, password })
                if (data.success) {
                    setIsLoggedin(true)
                    
                    // Fetch the newly created user's data from DB
                    try {
                        await getUserData()
                    } catch (err) {
                        // If getUserData fails, set user data from registration response
                        console.warn('getUserData after registration failed, using response data', err);
                        if (data.data?.user) {
                            useGlobalStore.setState({ userData: data.data.user, loading: false });
                        }
                    }
                    
                    syncPreferencesToBackend().catch(err => console.warn('Preferences sync skipped', err));
                    
                    // Check if farmer needs to complete onboarding survey
                    try {
                        const surveyRes = await axios.get(backendUrl + `${API.SURVEY}/status`)
                        if (surveyRes.data.success && !surveyRes.data.data?.hasCompletedSurvey) {
                            navigate("/onboarding-survey")
                            return
                        }
                    } catch (err) { console.error("Survey status check failed", err) }
                    
                    navigate("/farmer/dashboard")
                } else {
                    toast.error(data.message)
                }
            } else {
                const { data } = await axios.post(backendUrl + `${API.AUTH}/login`, { email, password })
                if (data.success) {
                    setIsLoggedin(true)
                    await getUserData()
                    syncPreferencesToBackend().catch(err => console.warn('Preferences sync skipped', err));
                    
                    try {
                        const surveyRes = await axios.get(backendUrl + `${API.SURVEY}/status`)
                        if (surveyRes.data.success && !surveyRes.data.data?.hasCompletedSurvey) {
                            navigate("/onboarding-survey")
                            return
                        }
                    } catch (err) { console.error("Survey status check failed", err) }
                    
                    // Route based on user's actual role from getUserData
                    const currentUserData = useGlobalStore.getState().userData;
                    const userRole = currentUserData?.role || 'user';
                    navigateBasedOnRole(userRole);
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setLoading(false)
        }
    }


    const navigateBasedOnRole = (role) => {
        const route = getDefaultRoute(role);
        navigate(route);
    };

    const handleAutoLogin = async (role) => {
        try {
            setDevLoginLoading(role);
            axios.defaults.withCredentials = true;

            const { data } = await axios.post(backendUrl + `${API.AUTH}/auto-login`, { role });
            if (data.success) {
                setIsLoggedin(true);
                try {
                    await getUserData();
                } catch (err) {
                    console.warn('getUserData after auto-login failed, using response data', err);
                    useGlobalStore.setState({
                        userData: data.data?.user || {},
                        loading: false,
                    });
                }
                syncPreferencesToBackend().catch(err => console.warn('Preferences sync skipped', err));
                toast.success(`Logged in as ${data.data?.user?.name || role.replace(/_/g, ' ')}`);
                
                // Navigate to the exact dashboard path returned by the backend
                const dashboard = data.data?.dashboard || getDefaultRoute(data.data?.user?.role || role);
                navigate(dashboard);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Auto login error:", error);
            toast.error(error.response?.data?.message || error.message || "Login failed");
        } finally {
            setDevLoginLoading(null);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-stone-100 via-emerald-50 to-stone-200">
            
            <div className="flex flex-col md:flex-row w-full max-w-[1050px] gap-6 md:gap-14 items-center justify-center animate-in fade-in zoom-in duration-500">
                
                {/* Branding & Info Section */}
                <div className="flex flex-col w-full md:w-[45%] p-4 md:p-8 justify-center items-center md:items-start text-center md:text-left">
                    
                    <div className="relative z-10 flex flex-col items-center md:items-start">
                        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-10">
                            <img src={assets.agridust_logo} alt="KMC Logo" className="w-8 h-8 md:w-14 md:h-14" />
                            <span className="text-lg md:text-3xl font-black tracking-tighter uppercase italic text-emerald-800">KMC</span>
                        </div>
                        
                        <h1 className="text-3xl md:text-6xl font-black leading-tight mb-2 md:mb-8 tracking-tight text-slate-900">
                            Digitalizing the <br className="hidden md:block"/> <span className="text-emerald-600">Heart of India.</span>
                        </h1>
                        <p className="text-slate-500 text-xs md:text-xl font-medium leading-relaxed max-w-[260px] md:max-w-md">
                            Access real-time market prices, expert crop advisory, and high-quality fertilizers delivered directly to your farm.
                        </p>
                    </div>

                    <div className="relative z-10 mt-6 md:mt-16 hidden sm:block">
                        <div className="flex items-center gap-3 md:gap-5 p-4 md:p-6 bg-white/40 rounded-3xl md:rounded-[32px] backdrop-blur-sm border border-white/60 shadow-sm w-fit">
                            <div className="w-8 h-8 md:w-12 md:h-12 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
                                <span className="text-white text-lg md:text-2xl font-bold">✓</span>
                            </div>
                            <div>
                                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-emerald-700 mb-0 md:mb-1">Trusted By</p>
                                <p className="font-extrabold text-slate-800 md:text-slate-900 text-xs md:text-lg">10,000+ Progressive Farmers</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form Container */}
                <div className="w-full max-w-[340px] md:max-w-none md:w-[44%] bg-white/95 backdrop-blur-xl p-6 md:p-12 rounded-[32px] md:rounded-[48px] shadow-2xl border border-white/20 relative">
                    <button onClick={() => navigate("/")} className="hidden md:absolute top-10 right-10 text-slate-400 hover:text-emerald-600 font-bold text-[10px] uppercase tracking-[0.2em] transition-all">
                        Back to Home
                    </button>

                    <div className="mb-6 text-center">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
                             {showOtpInput ? t('verify_otp_title') : (state === 'Login' ? "Welcome Back" : t('create_account'))}
                        </h2>
                        <p className="text-slate-500 text-xs md:text-sm font-medium">
                            {showOtpInput ? `${t('verify_otp_title')} sent to +91 ${phone}` : (state === 'Login' ? "Sign in to continue to KMC" : t('sign_up_to_continue'))}
                        </p>
                    </div>

                    {!showOtpInput && state === 'Login' && (
                        <div className="mb-6">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center mb-3">Quick Developer Login</p>
                            <div className="flex flex-wrap gap-2 justify-center max-h-[160px] overflow-y-auto p-4 border border-slate-100 rounded-2xl bg-white shadow-inner scrollbar-thin">
                                {DEV_ACCOUNTS.map(account => {
                                    const roleInfo = ROLE_COLORS[account.role] || ROLE_COLORS['admin'];
                                    const isSpinning = devLoginLoading === account.role;
                                    return (
                                        <button 
                                            key={account.role}
                                            type="button" 
                                            onClick={() => handleAutoLogin(account.role)}
                                            disabled={devLoginLoading !== null}
                                            className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-2 rounded-xl transition-all border shadow-sm group
                                                ${roleInfo.bg} ${roleInfo.border} ${roleInfo.text} 
                                                hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {isSpinning ? (
                                                <div className={`w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin`}></div>
                                            ) : (
                                                <span className="text-sm">{ROLE_ICONS[account.role]}</span>
                                            )}
                                            {account.label}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="border-b border-slate-100 my-6 relative">
                                <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-white px-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">OR</span>
                            </div>
                        </div>
                    )}

                    {!showOtpInput && (
                        <div className="flex bg-slate-100 p-1 rounded-xl mb-6 shadow-inner overflow-hidden">
                            <button 
                                onClick={() => {setAuthMethod('mobile'); setState('Login')}}
                                className={`flex-1 py-2 rounded-lg text-[10px] md:text-xs font-black transition-all duration-300 uppercase tracking-widest ${authMethod === 'mobile' ? 'bg-white shadow-md text-emerald-700' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {t('mobile_otp')}
                            </button>
                            <button 
                                onClick={() => setAuthMethod('email')}
                                className={`flex-1 py-2 rounded-lg text-[10px] md:text-xs font-black transition-all duration-300 uppercase tracking-widest ${authMethod === 'email' ? 'bg-white shadow-md text-emerald-700' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {t('email')}
                            </button>
                        </div>
                    )}

                    <form onSubmit={showOtpInput ? onVerifyOtp : (authMethod === 'mobile' ? onSendOtp : onEmailAuth)} className="space-y-4">
                        
                        {authMethod === 'email' && state === "Sign Up" && !showOtpInput && (
                            <div className='flex items-center gap-3 w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus-within:border-emerald-500 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-emerald-50 transition-all'>
                                <img src={assets.person_icon} alt="" className="w-5 h-5 opacity-40" />
                                <input value={name} onChange={e => setName(e.target.value)} className="bg-transparent outline-none text-slate-900 placeholder-slate-400 w-full font-medium text-lg" type="text" placeholder={t('full_name')} required />
                            </div>
                        )}

                        {authMethod === 'mobile' ? (
                            <>
                                {!showOtpInput ? (
                                    <div className='flex items-center gap-3 w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus-within:border-emerald-500 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-emerald-50 transition-all'>
                                        <span className="text-slate-400 font-black border-r-2 pr-4 border-slate-100">+91</span>
                                        <input value={phone} onChange={e => setPhone(e.target.value)} className="bg-transparent outline-none text-slate-900 placeholder-slate-400 w-full font-medium text-lg tracking-tight" type="tel" placeholder={t('mobile_number')} required pattern="[0-9]{10}" />
                                    </div>
                                ) : (
                                    <div className='flex flex-col gap-4'>
                                        <div className='flex items-center gap-3 w-full px-6 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus-within:border-emerald-500 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-emerald-50 transition-all'>
                                            <img src={assets.lock_icon} alt="" className="w-6 h-6 opacity-40" />
                                            <input value={otp} onChange={e => setOtp(e.target.value)} className="bg-transparent outline-none text-slate-900 placeholder-slate-400 w-full text-center tracking-[0.6em] text-3xl font-bold" type="text" maxLength="6" placeholder="000000" required autoFocus />
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div className='flex items-center gap-3 w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus-within:border-emerald-500 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-emerald-50 transition-all'>
                                    <img src={assets.mail_icon} alt="" className="w-5 h-5 opacity-40" />
                                    <input value={email} onChange={e => setEmail(e.target.value)} className="bg-transparent outline-none text-slate-900 placeholder-slate-400 w-full font-medium text-lg" type="email" placeholder={t('email')} required />
                                </div>
                                <div className='flex items-center gap-3 w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus-within:border-emerald-500 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-emerald-50 transition-all'>
                                    <img src={assets.lock_icon} alt="" className="w-5 h-5 opacity-40" />
                                    <input value={password} onChange={e => setPassword(e.target.value)} className="bg-transparent outline-none text-slate-900 placeholder-slate-400 w-full font-medium text-lg" type="password" placeholder={t('password')} required />
                                </div>
                                {state === "Login" && (
                                    <div className="flex justify-end">
                                        <p className="text-emerald-700 hover:text-emerald-800 cursor-pointer text-[10px] font-black uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100" onClick={() => navigate("/reset-password")}>
                                            {t('forgot_password')}
                                        </p>
                                    </div>
                                )}
                            </>
                        )}

                        <button 
                            disabled={loading}
                            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all text-white font-black text-base shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 group disabled:bg-slate-300 disabled:shadow-none tracking-wider"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    {showOtpInput ? t('verify_and_login') : (authMethod === 'mobile' ? t('send_otp') : (state === "Sign Up" ? t('create_account') : t('login')))}
                                    <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                                </>
                            )}
                        </button>
                        
                        {showOtpInput && (
                            <button type="button" onClick={() => {setShowOtpInput(false); setOtp("")}} className="w-full text-center text-emerald-700 hover:scale-105 active:scale-95 font-black text-[10px] uppercase tracking-[0.2em] mt-2 transition-all">
                                {t('change_phone')}
                            </button>
                        )}
                    </form>

                    {!showOtpInput && (
                        <div className="mt-12 pt-8 border-t border-slate-50 text-center">
                            <p className="text-slate-400 text-sm font-medium">
                                {state === "Sign Up" ? t('already_have_account') : t('dont_have_account')}{" "}
                                <button className="text-emerald-700 hover:text-emerald-800 font-black underline underline-offset-8 decoration-emerald-100 hover:decoration-emerald-300 transition-all decoration-4"
                                    onClick={() => {
                                        setState(state === 'Sign Up' ? 'Login' : 'Sign Up');
                                        setAuthMethod('email');
                                    }}>
                                    {state === 'Sign Up' ? t('login_here') : t('register_here')}
                                </button>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Login
