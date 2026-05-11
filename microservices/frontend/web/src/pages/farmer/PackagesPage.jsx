import React from 'react'
import Navbar from '../../layouts/components/Navbar';

const Packages = () => {
  return (
    <>
    <Navbar/>
    
    <section className="min-h-screen bg-gradient-to-b from-[#f6f3e8] to-white py-20 px-6">
      
      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-5xl font-serif font-bold text-[#1f2d1f] mb-4 mt-10">
          Choose Your Package
        </h2>
        <p className="text-lg text-slate-600">
          Flexible pricing plans designed to meet the needs of farmers at every stage.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">

        {/* Starter */}
        <div className="bg-[#f9f8f3] border border-[#d8e0d2] rounded-2xl p-5 shadow-sm">
          <h3 className="text-2xl font-serif font-semibold text-[#1f2d1f] mb-4">
            Starter
          </h3>

          <p className="text-4xl font-bold text-green-800 mb-1">
            ₹999 <span className="text-base font-normal text-slate-500">/season</span>
          </p>

          <p className="text-slate-600 mb-6">
            Perfect for small landholders getting started
          </p>

          <ul className="space-y-3 text-slate-700 mb-8 text-sm">
            <li>✓ Basic soil testing (1 sample)</li>
            <li>✓ Crop selection advice</li>
            <li>✓ Phone support</li>
            <li>✓ Market price alerts</li>
          </ul>

          <button className="w-full border-2 border-green-800 text-green-800 rounded-xl py-3 font-semibold hover:bg-green-800 hover:text-white transition">
            Get Started
          </button>
        </div>


        {/* Growth (Most Popular) */}
        <div className="relative bg-[#fdfaf2] border-2 border-yellow-500 rounded-2xl p-5 shadow-md">

          {/* Badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-white text-sm px-4 py-1 rounded-full font-semibold shadow">
            ★ Most Popular
          </div>

          <h3 className="text-2xl font-serif font-semibold text-[#1f2d1f] mb-4">
            Growth
          </h3>

          <p className="text-4xl font-bold text-green-800 mb-1">
            ₹2,999 <span className="text-base font-normal text-slate-500">/season</span>
          </p>

          <p className="text-slate-600 mb-6">
            Comprehensive support for growing farms
          </p>

          <ul className="space-y-3 text-slate-700 mb-8  text-sm">
            <li>✓ Advanced soil testing (3 samples)</li>
            <li>✓ Complete crop advisory</li>
            <li>✓ Pest identification & solutions</li>
            <li>✓ Priority phone & WhatsApp support</li>
            <li>✓ 1 farm visit per season</li>
            <li>✓ Training workshop access</li>
          </ul>

          <button className="w-full bg-yellow-500 text-white rounded-xl py-3 font-semibold hover:bg-yellow-600 transition">
            Get Started
          </button>
        </div>


        {/* Premium */}
        <div className="bg-[#f9f8f3] border border-[#d8e0d2] rounded-2xl p-5 shadow-sm">
          <h3 className="text-2xl font-serif font-semibold text-[#1f2d1f] mb-4">
            Premium
          </h3>

          <p className="text-4xl font-bold text-green-800 mb-1">
            ₹5,999 <span className="text-base font-normal text-slate-500">/season</span>
          </p>

          <p className="text-slate-600 mb-6">
            Full-service package for serious farmers
          </p>

          <ul className="space-y-3 text-slate-700 mb-8  text-sm">
            <li>✓ Comprehensive soil analysis (unlimited)</li>
            <li>✓ Year-round crop planning</li>
            <li>✓ Integrated pest management</li>
            <li>✓ Dedicated advisor</li>
            <li>✓ Monthly farm visits</li>
            <li>✓ Market linkage support</li>
            <li>✓ Export quality certification</li>
            <li>✓ Priority training enrollment</li>
          </ul>

          <button className="w-full border-2 border-green-800 text-green-800 rounded-xl py-3 font-semibold hover:bg-green-800 hover:text-white transition">
            Get Started
          </button>
        </div>

      </div>
    </section>
  </>)
}

export default Packages