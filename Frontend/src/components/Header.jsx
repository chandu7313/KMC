import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { assets } from "../assets/assets"
import { AppContext } from "../context/AppContext"

const Header = () => {

  const {userData} = useContext(AppContext)
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
    { title: 'Soil Testing', desc: 'Know your soil health',url:'/soil-crop-analysis' },
    { title: 'Fertilizer Advice', desc: 'Right inputs, right time',url:'/fertilizer-advice' },
    { title: 'Crop Selection', desc: 'Pick crops for your soil',url:'/crop-selection' },
    { title: 'Market Prices', desc: 'Track market trends',url:'/market-prices' },
    { title: 'Equipments', desc: 'Expert agronomy guidance',url:'/equipments' },
    { title: 'Insights', desc: 'Weather and risk alerts',url:'/insights' },
  ]

  return (
    <>
    <section className="mx-auto w-[90%] px-4 sm:px-6 lg:px-8 mt-28">
      <div className="relative overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-sm">
        {/* Background image with gradient overlay */}
        <div className="absolute inset-0">
          <img src={headerImages[headerIndex]} alt="Fields" className="h-full w-full object-cover transition-opacity duration-700"/>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"/>
        </div>

        {/* Content */}
        <div className="relative p-6 sm:p-10 lg:p-14">
          <div className="max-w-xl">
            <div className="mb-3 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 ring-1 ring-white/20 backdrop-blur">
              Hey {userData ? userData.name : 'Farmer'} <img src={assets.hand_wave} alt="" className="ml-2 w-4 h-4"/>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight text-white">
              Data-Driven Farming for a Prosperous Future
            </h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-white/90 max-w-lg">
              Unlock your field potential with smart advisory, market insights, and soil health.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button className="inline-flex items-center justify-center rounded-full bg-green-600 px-6 py-2.5 text-white shadow-sm hover:bg-green-700">
                Get Started
              </button>
              <button className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-white ring-1 ring-white/60 hover:bg-white/10">
                Learn More
              </button>
            </div>
          </div>

          {/* Decorative slider dots */}
          <div className="mt-10 flex items-center gap-2">
            <span className="h-1.5 w-6 rounded-full bg-white/90"/>
            <span className="h-1.5 w-1.5 rounded-full bg-white/60"/>
            <span className="h-1.5 w-1.5 rounded-full bg-white/60"/>
            <span className="h-1.5 w-1.5 rounded-full bg-white/60"/>
          </div>
        </div>
      </div>
    </section>

    {/* Our Services */}
    
    
    <section className="mx-auto w-[90%] px-4 sm:px-6 lg:px-8 mt-8">
      <div className="rounded-2xl bg-white ring-1 ring-black/10 shadow-sm p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Our Services</h2>
          <button className="text-sm font-medium text-green-700 hover:text-green-800">Learn More</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map((s, idx) => {
            const imgSrc =
              s.title === 'Soil Testing' ? assets.services_images.soil :
              s.title === 'Fertilizer Advice' ? assets.services_images.fertilizers :
              s.title === 'Crop Selection' ? assets.services_images.crop_selection :
              s.title === 'Market Prices' ? assets.services_images.market :
              s.title === 'Insights' ? assets.services_images.weather :
              assets.services_images.generic
            return (
              <div key={idx} className="rounded-xl ring-1 ring-slate-200 bg-white p-0 hover:shadow-md transition-shadow">
                <div className="flex items-stretch justify-between gap-0">
                  <div className="min-w-0 p-5">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-700 ring-1 ring-green-100">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                        <path d="M12 13a5 5 0 0 1-5-5V7a1 1 0 0 1 1-1h1a5 5 0 0 1 5 5v7a1 1 0 1 1-2 0v-5Z"/>
                        <path d="M19 5c-3.866 0-7 3.134-7 7 3.866 0 7-3.134 7-7Z"/>
                      </svg>
                    </div>
                    <h3 className="mt-2 text-base font-semibold text-slate-900">{s.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
                    <button onClick={()=>navigate(s.url)} className="cursor-pointer mt-3 inline-flex items-center text-sm font-medium text-green-700 hover:text-green-800">
                      Explore
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-4 w-4">
                        <path fillRule="evenodd" d="M4.5 12a.75.75 0 0 1 .75-.75h11.69l-3.72-3.72a.75.75 0 1 1 1.06-1.06l5 5a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 1 1-1.06-1.06l3.72-3.72H5.25A.75.75 0 0 1 4.5 12z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <div className="relative shrink-0 w-40 sm:w-52 self-stretch overflow-hidden rounded-r-xl">
                    <img src={imgSrc} alt="" className="h-full w-full object-cover"/>
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent opacity-70"/>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
    </>
  )
}

export default Header
