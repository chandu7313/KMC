import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

const BookCallButton = ({ 
  isBooking, 
  handleBookCall, 
  selectedTopic, 
  showConfirmModal // We can use this to temporarily show "Booked!" state if needed
}) => {
  const [successTransient, setSuccessTransient] = useState(false);

  useEffect(() => {
    if (showConfirmModal) {
      setSuccessTransient(true);
      const timer = setTimeout(() => {
        setSuccessTransient(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfirmModal]);

  const isDisabled = !selectedTopic || isBooking || successTransient;

  let btnContent;
  let btnClass = "w-full py-3.5 rounded-lg font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 ";

  if (!selectedTopic) {
    btnContent = "Select a Topic First";
    btnClass += "bg-gray-200 text-gray-500 cursor-not-allowed";
  } else if (isBooking) {
    btnContent = (
      <>
        <Loader2 size={18} className="animate-spin" />
        Booking...
      </>
    );
    btnClass += "bg-[#2a7a3e] text-white opacity-80 cursor-wait";
  } else if (successTransient) {
    btnContent = (
      <>
        <CheckCircle2 size={18} />
        Booked!
      </>
    );
    btnClass += "bg-green-600 text-white";
  } else {
    btnContent = "Book Free Call";
    btnClass += "bg-[#2a7a3e] hover:bg-[#226332] active:scale-[0.98] text-white";
  }

  return (
    <button 
      onClick={handleBookCall} 
      disabled={isDisabled}
      className={btnClass}
    >
      {btnContent}
    </button>
  );
};

export default BookCallButton;
