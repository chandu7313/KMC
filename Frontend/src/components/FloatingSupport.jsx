import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const FloatingSupport = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // Hide on customer care page
  if (location.pathname === '/contact') return null

  return (
    <button
      onClick={() => navigate('/contact')}
      className="fixed bottom-8 right-8 z-50 group"
      aria-label="Customer Care"
    >
      <div className="relative">
        <img src={assets.customer_care} alt="Customer care" className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-lg ring-2 ring-green-200 group-hover:scale-105 transition-transform"/>
        <span className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] rounded-full bg-green-700 text-white shadow">Help</span>
      </div>
    </button>
  )
}

export default FloatingSupport

