import React, { useState } from 'react'
import Navbar from '../components/Navbar'

const EQUIPMENTS = [
  {
    name: 'Agricultural Drone (UAV) – Precision Spraying',
    efficiency: 'Coverage: up to 10 min/acre',
    cost: 'Cost: ₹5–6 Lakh',
  },
  {
    name: 'Mini Tractor – Tilling & Hauling',
    efficiency: 'Efficiency: 3.5 acres/day',
    cost: 'Cost: ₹1.8–3 Lakh',
  },
  {
    name: 'Rice Transplanter – Seedling Automation',
    efficiency: 'Efficiency: 5 acres/4 hr',
    cost: 'Cost: ₹0.9–1.2 Lakh',
  },
  {
    name: 'Battery Sprayer – Uniform Application',
    efficiency: 'Efficiency: 1 acre/35 min',
    cost: 'Cost: ₹6k–7k',
  },
]

const tabs = ['Crop Type', 'Land Size', 'Farming Stage']

const Equipments = () => {
  const [active, setActive] = useState(tabs[0])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar/>
      <main className="mx-auto w-[90%] px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Modern Equipment Recommendation</h1>

        {/* Tabs */}
        <div className="mt-6 flex items-center gap-8 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`pb-2 text-sm font-medium ${active === t ? 'text-green-700 border-b-2 border-green-700' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Filter hint */}
        <p className="mt-3 text-sm text-slate-600">Filter</p>

        {/* Cards */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {EQUIPMENTS.map((eq, i) => (
            <div key={i} className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm overflow-hidden">
              {/* Placeholder image area */}
              <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-16 w-16 text-green-700 opacity-80">
                  <path d="M3 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18H3v-4.5zM9.75 18v-2.25a3.75 3.75 0 0 0-3.75-3.75H3V9.75A2.25 2.25 0 0 1 5.25 7.5h5.3l2.1-2.1a1.5 1.5 0 0 1 1.06-.44h2.79A2.25 2.25 0 0 1 18.75 7.2v1.8h1.5a.75.75 0 0 1 .7 1.02l-1.47 3.92a2.25 2.25 0 0 1-2.1 1.46H15v1.5a1.5 1.5 0 0 1-1.5 1.5h-3.75z"/>
                </svg>
              </div>
              <div className="p-4">
                <h3 className="text-base font-semibold text-slate-900 leading-snug">{eq.name}</h3>
                <p className="mt-2 text-xs text-slate-600">{eq.efficiency}</p>
                <p className="text-xs text-slate-600">{eq.cost}</p>
                <button className="mt-4 w-full rounded-xl bg-green-700 px-4 py-2 text-white text-sm font-medium hover:bg-green-800">Check Suitability</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Equipments