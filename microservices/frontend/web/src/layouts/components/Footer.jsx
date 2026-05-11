import React from 'react'
import { assets } from "../../assets/assets"
import { 
    Facebook, 
    Instagram, 
    Twitter, 
    Linkedin, 
    Mail, 
    Phone, 
    MapPin, 
    ArrowRight,
    Send,
    ShieldCheck,
    Globe
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t } = useTranslation()
  return (
    <footer className="bg-[#1f2d1f] text-white overflow-hidden relative border-t border-white/5">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="mx-auto w-[90%] px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand & Mission Area */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex flex-col items-start leading-none group cursor-pointer">
                <div className="flex items-center gap-2.5 mb-2">
                    <img src={assets.agridust_logo || null} alt="Kissan Mithar" className="w-10 h-10 object-contain" />
                    <span className="text-2xl font-black tracking-tighter text-white">KISSAN</span>
                </div>
                <span className="text-[10px] font-black tracking-[0.4em] text-green-500 uppercase ml-12">Mithar</span>
            </div>
            
            <p className="text-white/50 text-sm leading-relaxed max-w-sm font-medium">
                {t('platform_desc', 'Revolutionizing Indian agriculture through precision data, laboratory insights, and a farmer-first ecosystem. Empowering 10k+ growers across 15 states.')}
            </p>

            <div className="flex items-center gap-4">
                {[
                    { icon: Facebook, url: '#' },
                    { icon: Instagram, url: '#' },
                    { icon: Twitter, url: '#' },
                    { icon: Linkedin, url: '#' }
                ].map((social, i) => (
                    <a 
                        key={i} 
                        href={social.url} 
                        aria-label={social.icon.name}
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-green-600 hover:text-white hover:scale-110 transition-all duration-300"
                    >
                        <social.icon size={18} />
                    </a>
                ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-green-500">{t('platform', 'Platform')}</h4>
            <ul className="space-y-4 text-sm font-medium text-white/60">
              <li><a href="/soil-crop-analysis" className="hover:text-white transition-colors">{t('soil_test', 'Soil Test')}</a></li>
              <li><a href="/fertilizers" className="hover:text-white transition-colors">{t('fertilizers', 'Digital Store')}</a></li>
              <li><a href="/market-prices" className="hover:text-white transition-colors">{t('market_prices', 'Market Pulse')}</a></li>
              <li><a href="/equipments" className="hover:text-white transition-colors">{t('equipments', 'Machinery')}</a></li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-green-500">{t('company', 'Company')}</h4>
            <ul className="space-y-4 text-sm font-medium text-white/60">
              <li><a href="/about" className="hover:text-white transition-colors">{t('about', 'Our Story')}</a></li>
              <li><a href="/blogs" className="hover:text-white transition-colors">{t('blogs', 'Knowledge Hub')}</a></li>
              <li><a href="/success-stories" className="hover:text-white transition-colors">{t('success_stories', 'Impact Stories')}</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">{t('get_help', 'Get Help')}</a></li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10 space-y-6">
                <div className="space-y-2">
                    <h4 className="text-xl font-bold text-white tracking-tight">{t('stay_in_loop', 'Stay in the Loop')}</h4>
                    <p className="text-white/40 text-xs font-medium">{t('newsletter_desc', 'Get the latest crop insights and market trends delivered weekly.')}</p>
                </div>
                
                <div className="relative">
                    <input 
                        type="email" 
                        placeholder="Your email address" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-sm outline-none focus:border-green-600 transition-colors"
                    />
                    <button className="absolute right-2 top-2 bottom-2 bg-green-600 hover:bg-green-500 text-white px-4 rounded-lg transition-colors flex items-center justify-center">
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-6 px-4">
                <div className="flex items-center gap-2.5">
                    <ShieldCheck size={20} className="text-green-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 leading-none">Safe & Secure Payment</span>
                </div>
                <div className="w-px h-4 bg-white/10"></div>
                <div className="flex items-center gap-2.5">
                    <Globe size={20} className="text-green-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 leading-none">PAN India Availability</span>
                </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-medium text-white/30 tracking-wide text-center">
            © {new Date().getFullYear()} KISSAN Mithar (KMC). Designed for Indian Farmers. 
            <span className="mx-2 text-white/10">|</span> 
            Proudly "Made in India"
          </p>
          
          <div className="flex items-center gap-8">
            <a href="/privacy" className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">Terms</a>
            <a href="/security" className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

