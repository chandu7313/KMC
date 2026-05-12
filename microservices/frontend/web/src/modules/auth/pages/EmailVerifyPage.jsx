/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react"
import { assets } from '@/assets/assets'
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { AppContext } from '@/app/providers/AppContext'
import axios from "axios"
import { useTranslation } from "react-i18next"

const EmailVerify = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { backendUrl, isLoggedin, userData, getUserData } = useContext(AppContext)
  
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  axios.defaults.withCredentials = true

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault()
      setLoading(true)
      const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { otp })

      if (data.success) {
        toast.success(data.message)
        getUserData()
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    isLoggedin && userData && userData.is_account_verified && navigate('/')
  }, [isLoggedin, userData])

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
              {t('verify_identity').split(' ')[0]} <br className="hidden md:block"/> <span className="text-emerald-600">{t('verify_identity').split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-slate-500 text-xs md:text-xl font-medium leading-relaxed max-w-[260px] md:max-w-md">
              {t('verify_email_subtitle')}
            </p>
          </div>

          <div className="relative z-10 mt-6 md:mt-16 hidden sm:block">
            <div className="flex items-center gap-3 md:gap-5 p-4 md:p-6 bg-white/40 rounded-3xl md:rounded-[32px] backdrop-blur-sm border border-white/60 shadow-sm w-fit">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
                  <span className="text-white text-lg md:text-2xl font-bold">✓</span>
              </div>
              <div>
                  <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-emerald-700 mb-0 md:mb-1">{t('secure')}</p>
                  <p className="font-extrabold text-slate-800 md:text-slate-900 text-xs md:text-lg">{t('bank_grade_encryption')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[340px] md:max-w-none md:w-[44%] bg-white/95 backdrop-blur-xl p-6 md:p-12 rounded-[32px] md:rounded-[48px] shadow-2xl border border-white/20 relative">
          <button onClick={() => navigate("/")} className="hidden md:absolute top-10 right-10 text-slate-400 hover:text-emerald-600 font-bold text-[10px] uppercase tracking-[0.2em] transition-all">
            {t('back_to_home')}
          </button>

          <div className="mb-6 text-center">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
              {t('email_verification')}
            </h2>
            <p className="text-slate-500 text-xs md:text-sm font-medium">
              {t('enter_otp_email')}
            </p>
          </div>

          <form onSubmit={onSubmitHandler} className="space-y-6">
            <div className='flex items-center gap-3 w-full px-6 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus-within:border-emerald-500 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-emerald-50 transition-all'>
              <img src={assets.lock_icon} alt="" className="w-6 h-6 opacity-40" />
              <input 
                value={otp} 
                onChange={e => setOtp(e.target.value)} 
                className="bg-transparent outline-none text-slate-900 placeholder-slate-400 w-full text-center tracking-[0.6em] text-3xl font-bold" 
                type="text" 
                maxLength="6" 
                placeholder="000000" 
                required 
                autoFocus 
              />
            </div>

            <button 
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all text-white font-black text-base shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 group disabled:bg-slate-300 disabled:shadow-none tracking-wider"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {t('verify_email')}
                  <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EmailVerify
