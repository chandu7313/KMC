import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { assets } from '@/assets/assets'
import { useGlobalStore } from '@/app/store/globalStore';
import { 
  FlaskConical, 
  Sprout, 
  Map, 
  BarChart3, 
  Wrench, 
  CloudSun,
  ChevronRight,
  Zap,
  TrendingUp
} from "lucide-react"

const Header = () => {
  const { userData } = useGlobalStore();
  const navigate = useNavigate()
  const [headerIndex, setHeaderIndex] = useState(0)
  const headerImages = assets.header_images || ["/bg_img.png"]

  useEffect(()=>{
    const id = setInterval(()=>{
      setHeaderIndex((i)=> (i + 1) % headerImages.length)
    }, 6000)
    return ()=> clearInterval(id)
  }, [headerImages.length])
  
  const services = [
    { title: 'Soil Testing', desc: 'Know your soil health', url: '/soil-crop-analysis', icon: FlaskConical, color: 'emerald' },
    { title: 'Fertilizers', desc: 'Right inputs, right time', url: '/fertilizers', icon: Sprout, color: 'green' },
    { title: 'Crop Selection', desc: 'Pick crops for your soil', url: '/crop-selection', icon: Map, color: 'lime' },
    { title: 'Market Prices', desc: 'Track market trends', url: '/market-prices', icon: BarChart3, color: 'amber' },
    { title: 'Equipments', desc: 'Expert machinery guidance', url: '/equipments', icon: Wrench, color: 'slate' },
    { title: 'Insights', desc: 'Weather and risk alerts', url: '/whether-insights', icon: CloudSun, color: 'sky' },
  ]

  return (
    <>
    <section id="hero-section" className="mx-auto w-[90%] px-4 sm:px-6 lg:px-8 mt-24">
      <div className="relative overflow-hidden rounded-[32px] shadow-2xl shadow-green-900/10 border border-black/5">
        {/* Background image with gradient overlay */}
        <div className="absolute inset-0">
          <img src={headerImages[headerIndex] || null} alt="Fields" className="h-full w-full object-cover transition-opacity duration-1000 scale-105 animate-slow-pan"/>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"/>
        </div>

        {/* Content */}
        <div className="relative p-8 sm:p-12 lg:p-16">
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-white/90 ring-1 ring-white/20 backdrop-blur-md">
              <Zap size={12} className="text-yellow-400" /> Hey {userData ? userData.name : 'Farmer'} <img src={assets.hand_wave || null} alt="" className="ml-1 w-3.5 h-3.5"/>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold leading-[1.1] text-white tracking-tight">
              Data-Driven Farming for a <span className="text-green-400 italic">Prosperous Future.</span>
            </h1>
            <p className="text-base text-white/70 max-w-lg font-medium leading-relaxed">
              Unlock your field potential with smart advisory, real-time market insights, and precision soil health mapping.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button onClick={()=>navigate('/soil-crop-analysis')} className="bg-green-600 hover:bg-green-500 text-white px-7 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-green-900/40 transition-all active:scale-95">
                Start Analysis
              </button>
              <button onClick={()=>navigate('/about')} className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-7 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all backdrop-blur-md">
                Learn More
              </button>
            </div>
          </div>

          {/* Decorative slider dots */}
          <div className="mt-12 flex items-center gap-2.5">
            {headerImages.map((_, i) => (
              <span key={i} className={`h-1 rounded-full transition-all duration-500 ${i === headerIndex ? 'w-8 bg-green-400' : 'w-1.5 bg-white/20'}`}/>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* --- OUR SERVICES --- */}
    <section className="mx-auto w-[90%] md:w-[94%] max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 mb-20 animate-fade-in-up">
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-6">
            <div className="space-y-2">
                <div className="text-[11px] font-bold text-[#0e783a] uppercase tracking-[0.2em]">Excellence in Agriculture</div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Our Core Services</h2>
            </div>
            <p className="text-gray-500 font-medium max-w-sm text-sm">
                A complete ecosystem of precision tools designed to maximize your yield and simplify your operations.
            </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((s, idx) => {
            const imgSrc =
              s.title === 'Soil Testing' ? assets.services_images.soil :
              s.title === 'Fertilizers' ? assets.services_images.fertilizers :
              s.title === 'Crop Selection' ? assets.services_images.crop_selection :
              s.title === 'Market Prices' ? assets.services_images.market :
              s.title === 'Insights' ? assets.services_images.weather :
              assets.services_images.generic

            return (
              <div 
                key={idx} 
                onClick={() => navigate(s.url)}
                className="group flex flex-col bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_-5px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                  {/* Top Image Part */}
                  <div className="relative h-[200px] w-full overflow-hidden">
                    <img src={imgSrc || null} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"/>
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                    
                    {/* Floating Icon Badge */}
                    <div className="absolute bottom-4 left-5">
                        <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-[#168a44] shadow-md group-hover:bg-[#168a44] group-hover:text-white transition-colors duration-300 border border-gray-100">
                            <s.icon size={20} strokeWidth={2.5} />
                        </div>
                    </div>
                  </div>

                  {/* Content Part */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-[#168a44] transition-colors mb-2 tracking-tight">
                        {s.title}
                    </h3>
                    <p className="text-[13px] text-gray-500 font-semibold mb-6 flex-1">
                        {s.desc}
                    </p>

                    <div className="mt-auto flex items-center gap-1.5 text-[#168a44] font-extrabold text-[10px] uppercase tracking-[0.15em] group-hover:gap-2.5 transition-all">
                      Explore Service <ChevronRight size={14} strokeWidth={3} />
                    </div>
                  </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>

    {/* --- DRONE TECHNOLOGY SECTION --- */}
    <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Full screen background */}
        <div className="absolute inset-0">
            <img src={assets.drone_img || null} className="w-full h-full object-cover scale-105 animate-slow-pan" alt="Drone Agri" />
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-16">
            <div className="space-y-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 text-green-700 font-black text-[9px] uppercase tracking-[0.3em]">
                        <Zap size={12} /> Precision Agriculture
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1f2d1f] tracking-tight leading-[1.1]">
                        Modern Problems. <br/>
                        <span className="text-green-700 italic">Drone Solutions.</span>
                    </h2>
                    <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-lg">
                        KMC is revolutionizing crop protection through autonomous aerial systems, delivering 3x faster pest control with 90% water saving.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button className="bg-[#1f2d1f] hover:bg-black text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95">
                        Get Demo
                    </button>
                    <button className="bg-white border border-slate-200 hover:bg-slate-50 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all">
                        View Pricing
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200/50">
                    <div>
                        <div className="text-2xl font-black text-[#1f2d1f]">2000+</div>
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Acres Covered</div>
                    </div>
                    <div>
                        <div className="text-2xl font-black text-[#1f2d1f]">90%</div>
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Water Saved</div>
                    </div>
                </div>
            </div>

            <div className="relative group">
                <div className="aspect-square rounded-[64px] overflow-hidden shadow-2xl border-[12px] border-white/50 relative">
                    <img src={assets.drone_img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt="Drone Tech" />
                    <div className="absolute inset-0 bg-green-900/10 mix-blend-overlay"></div>
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-[32px] shadow-2xl border border-slate-50 animate-bounce-slow max-w-[200px]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700">
                            <TrendingUp size={16}/>
                        </div>
                        <span className="font-black text-[#1f2d1f] text-xs uppercase">Smart Spraying</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">Precision nozzles ensure 0% wastage of expensive nutrients.</p>
                </div>
            </div>
        </div>
    </section>

    <style jsx="true">{`
        @keyframes slow-pan {
            0% { transform: scale(1.05) translate(0, 0); }
            100% { transform: scale(1.15) translate(-1%, -1%); }
        }
        @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
        }
        .animate-slow-pan {
            animation: slow-pan 30s infinite alternate linear;
        }
        .animate-bounce-slow {
            animation: bounce-slow 5s infinite ease-in-out;
        }
    `}</style>
    </>
  )
}

export default Header
