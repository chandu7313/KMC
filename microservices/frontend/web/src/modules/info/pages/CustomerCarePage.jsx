import React from 'react'
import Navbar from '@/app/layouts/Navbar'

const Card = ({ title, children }) => (
  <div className="rounded-2xl bg-white ring-1 ring-black/10 shadow-sm p-6 min-h-[280px]">
    <h3 className="text-base font-semibold text-green-800">{title}</h3>
    <div className="mt-4 text-sm text-slate-700">
      {children}
    </div>
  </div>
)

const CustomerCare = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar/>
      <main className="mx-auto w-[90%] px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-green-900 text-center">How can we help today?</h1>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Frequently Asked Questions">
            <ul className="space-y-3">
              <li className="flex items-center gap-3"><span className="text-green-700">🔎</span> Soil Test Upload Guide</li>
              <li className="flex items-center gap-3"><span className="text-green-700">🧪</span> Fertilizer Dosage FAQs</li>
              <li className="flex items-center gap-3"><span className="text-green-700">📈</span> Market Price Updates</li>
              <li className="flex items-center gap-3"><span className="text-green-700">🌾</span> Crop Suitability</li>
            </ul>
          </Card>

          <Card title="Contact Options">
            <div className="flex flex-col items-center">
              <div className="h-14 w-14 rounded-full bg-green-50 ring-1 ring-green-100 text-green-700 flex items-center justify-center">🎧</div>
              <p className="mt-3">Live Chat</p>
              <button className="mt-4 rounded-full bg-green-700 px-4 py-2 text-white text-sm hover:bg-green-800">Email Support Form</button>
            </div>
          </Card>

          <Card title="Knowledge Base">
            <ul className="space-y-3">
              <li className="flex items-center gap-3"><span className="text-green-700">📚</span> Crop Library</li>
              <li className="flex items-center gap-3"><span className="text-green-700">🦠</span> Pest & Disease Guide</li>
              <li className="flex items-center gap-3"><span className="text-green-700">🧑‍🌾</span> Farming Techniques</li>
              <li className="flex items-center gap-3"><span className="text-green-700">🌦️</span> Weather & Risk Tips</li>
            </ul>
          </Card>
        </div>

        {/* Prefer to talk section */}
        <div className="mt-10 rounded-2xl bg-white ring-1 ring-black/10 shadow-sm p-6">
          <h4 className="text-center text-lg font-semibold text-green-800">Prefer to talk?</h4>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl ring-1 ring-slate-200 p-4 text-center">
              <div className="text-green-700">📞</div>
              <p className="mt-2 text-sm text-slate-700">Call Support</p>
              <p className="text-xs text-slate-500">+91 90000 00000</p>
            </div>
            <div className="rounded-xl ring-1 ring-slate-200 p-4 text-center">
              <div className="text-green-700">💬</div>
              <p className="mt-2 text-sm text-slate-700">WhatsApp</p>
              <p className="text-xs text-slate-500">+91 90000 00000</p>
            </div>
            <div className="rounded-xl ring-1 ring-slate-200 p-4 text-center">
              <div className="text-green-700">✉️</div>
              <p className="mt-2 text-sm text-slate-700">Email</p>
              <p className="text-xs text-slate-500">support@agridust.com</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CustomerCare

