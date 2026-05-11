import React, { useContext, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../../assets/assets'
import { FarmerModeContext } from '../../../context/FarmerModeContext'
import { Phone, MessageCircle, PlaySquare, Map } from 'lucide-react'

const FloatingSupport = () => {
  const navigate = useNavigate()
  const { isFarmerMode } = useContext(FarmerModeContext)
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
      const handleClickOutside = (event) => {
          if (menuRef.current && !menuRef.current.contains(event.target)) {
              setIsOpen(false);
          }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, []);

  const handleReplayTour = () => {
      localStorage.removeItem('kmc_tour_completed');
      window.location.reload();
  };

  const menuItems = [
      {
          label: 'Website Tour',
          icon: Map,
          onClick: handleReplayTour,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
      },
      {
          label: 'Call Support',
          icon: Phone,
          onClick: () => window.location.href = 'tel:+918000000000',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
      },
      {
          label: 'WhatsApp',
          icon: MessageCircle,
          onClick: () => window.open('https://wa.me/918000000000', '_blank'),
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
      },
      {
          label: 'Training Video',
          icon: PlaySquare,
          onClick: () => window.open('https://youtube.com', '_blank'), // Placeholder link
          color: 'text-red-600',
          bgColor: 'bg-red-50',
      }
  ];

  return (
    <div ref={menuRef} className={`fixed z-50 flex flex-col items-end gap-3 transition-all ${isFarmerMode ? 'bottom-10 right-10' : 'bottom-8 right-8'}`}>
      
      {/* Pop-up Menu */}
      <div 
        className={`flex flex-col gap-2 transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-75 opacity-0 pointer-events-none'}`}
      >
          {menuItems.map((item, index) => (
             <button
                key={index}
                onClick={() => {
                   item.onClick();
                   setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-slate-100 shadow-xl hover:-translate-x-2 transition-transform group ${isFarmerMode ? 'p-5 border-2 border-green-200' : ''}`}
             >
                <div className={`font-black text-slate-700 whitespace-nowrap ${isFarmerMode ? 'text-lg' : 'text-sm'}`}>
                    {item.label}
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bgColor} ${item.color} ${isFarmerMode ? 'w-14 h-14' : ''}`}>
                    <item.icon size={isFarmerMode ? 28 : 20} className="group-hover:scale-110 transition-transform" />
                </div>
             </button>
          ))}
      </div>

      {/* Main Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex flex-col items-center gap-2"
        aria-label="Toggle Help Menu"
        aria-expanded={isOpen}
      >
        <div className="relative">
          <img src={assets.customer_care} alt="Customer care" className={`rounded-full shadow-lg ring-2 ring-green-200 transition-transform ${isOpen ? 'scale-110 ring-4 ring-green-400' : 'group-hover:scale-105'} ${isFarmerMode ? 'w-24 h-24 sm:w-28 sm:h-28 ring-4' : 'w-16 h-16 sm:w-20 sm:h-20'}`}/>
          {!isFarmerMode && <span className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] rounded-full bg-green-700 text-white shadow">Help</span>}
        </div>
        {isFarmerMode && (
           <div className={`bg-green-700 text-white font-black px-6 py-2 rounded-xl text-xl shadow-xl shadow-green-900/30 w-full text-center tracking-widest uppercase transition-all ${isOpen ? 'scale-110 bg-green-800' : 'animate-bounce'}`}>
              {isOpen ? 'CLOSE' : 'HELP'}
           </div>
        )}
      </button>
    </div>
  )
}

export default FloatingSupport

