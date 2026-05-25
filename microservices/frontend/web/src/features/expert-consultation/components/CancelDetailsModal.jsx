import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const CancelDetailsModal = ({ isOpen, onClose, consultation, onBookAgain }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !consultation) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const readableTopic = consultation.topic
    ? consultation.topic.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Consultation';

  const handleBookAgain = () => {
    onClose();
    if (onBookAgain) {
      onBookAgain(consultation.topic);
    }
    // Scroll to booking form
    const bookingEl = document.getElementById('booking-form');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Consultation Details</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Expert</span>
                <span className="text-sm font-bold text-gray-900">{consultation.expertName || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Topic</span>
                <span className="text-sm font-semibold text-gray-700">{readableTopic}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Date</span>
                <span className="text-sm font-semibold text-gray-700">{formatDate(consultation.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-gray-200 text-gray-700">
                  Cancelled
                </span>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Cancelled by</span>
                <span className="text-sm font-semibold text-gray-700">
                  {consultation.cancelledBy || 'Farmer'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Reason</span>
                <span className="text-sm font-semibold text-gray-700">
                  {consultation.cancelReason || 'Not provided'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Cancelled at</span>
                <span className="text-sm font-semibold text-gray-700">
                  {formatDateTime(consultation.cancelledAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100">
            <button
              onClick={handleBookAgain}
              className="w-full py-3 border-2 border-green-600 text-green-700 hover:bg-green-50 font-bold text-sm rounded-xl transition-colors"
            >
              Book Again
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CancelDetailsModal;
