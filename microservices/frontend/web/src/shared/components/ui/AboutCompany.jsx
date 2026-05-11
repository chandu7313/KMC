import React from 'react'
import { assets } from '../../../assets/assets'

const team = [
  { name: 'Lead Agronomist', role: 'Researcher', img: assets.header_img },
  { name: 'Crop Analyst', role: 'Core Class', img: assets.header_img },
  { name: 'Data Scientist', role: 'Agri Cloud', img: assets.header_img },
  { name: 'Farm Advisor', role: 'Field Expert', img: assets.header_img },
]

const AboutCompany = () => {
  return (
    <section className="mx-auto w-[90%] px-4 sm:px-6 lg:px-8 mt-50 mb-30">
      {/* Top about block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <div>
          <img src={assets.company_members_img} alt="Team" className="w-full rounded-2xl ring-1 ring-black/10 w-[700px] h-[400px] shadow-sm object-cover"/>
        </div>
        <div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-green-800">About Our Company</h2>
          <h3 className="mt-4 text-xl font-semibold text-green-800">Our Mission & Vision</h3>
          <p className="mt-2 text-slate-700 max-w-xl">
            Empowering farmers with data‑driven insights to foster sustainable, profitable agriculture.
            We combine agronomy expertise with market intelligence to help you make smarter decisions.
          </p>
          <button className="mt-6 inline-flex items-center justify-center rounded-full bg-green-700 px-6 py-2.5 text-white shadow-sm hover:bg-green-800">Core Features</button>
        </div>
      </div>

      {/* Story and team card */}
      <div className="mt-10 rounded-2xl bg-white ring-1 ring-black/10 shadow-sm p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-green-800">Our Story</h4>
            <p className="mt-2 text-slate-700">
              We started AgriDust to bridge the gap between farmers and actionable data. From soil testing
              to real‑time market trends, our platform delivers the right advice at the right time.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-green-800">Meet Our Expert Team</h4>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 items-start">
              {team.map((m, i) => (
                <div key={i} className="text-center">
                  <div className="mx-auto h-16 w-16 overflow-hidden rounded-full ring-2 ring-green-200">
                    <img src={m.img} alt={m.name} className="h-full w-full object-cover"/>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-900 leading-tight">{m.name}</p>
                  <p className="text-xs text-slate-600">{m.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutCompany