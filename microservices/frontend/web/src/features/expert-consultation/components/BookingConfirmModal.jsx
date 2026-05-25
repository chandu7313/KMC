import React, { useEffect } from 'react';
import { PartyPopper, Calendar as CalendarIcon, Clock, Phone, Hash, Tag, CheckCircle2 } from 'lucide-react';

const BookingConfirmModal = ({ isOpen, onClose, booking }) => {
  // Handle escape key to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !booking) return null;

  // Format date and time safely
  const slotDate = new Date(booking.slotDatetime || new Date());
  const formattedDate = slotDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  const startTime = slotDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const endTime = new Date(slotDate.getTime() + (booking.durationMinutes || 30) * 60000)
                    .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Make topic readable
  const readableTopic = booking.topic ? booking.topic.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Consultation';

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Modal Content */}
        <div 
          className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-green-600 p-6 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <PartyPopper size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-white">Call Booked Successfully!</h2>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  👨‍⚕️
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Expert</p>
                  <p className="font-bold text-gray-900">{booking.expertName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CalendarIcon className="text-gray-400 mt-0.5 shrink-0" size={18} />
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Date</p>
                    <p className="font-semibold text-gray-900">{formattedDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="text-gray-400 mt-0.5 shrink-0" size={18} />
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Time</p>
                    <p className="font-semibold text-gray-900">{startTime} - {endTime}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Phone className="text-gray-400 mt-0.5 shrink-0" size={18} />
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Phone</p>
                    <p className="font-semibold text-gray-900">{booking.farmerPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Tag className="text-gray-400 mt-0.5 shrink-0" size={18} />
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Topic</p>
                    <p className="font-semibold text-gray-900">{readableTopic}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-gray-200 pt-4 mt-2">
                <Hash className="text-gray-400 mt-0.5 shrink-0" size={18} />
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Booking ID</p>
                  <p className="font-bold text-gray-900">{booking.bookingRef}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-green-700 font-medium text-sm mb-6">
              <CheckCircle2 size={16} />
              Confirmation email sent
            </div>

            <button 
              onClick={onClose}
              className="w-full bg-[#2a7a3e] hover:bg-[#226332] active:scale-[0.98] text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={18} />
              Got it!
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingConfirmModal;
