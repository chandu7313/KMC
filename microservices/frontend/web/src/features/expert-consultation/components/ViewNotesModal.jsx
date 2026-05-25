import React, { useEffect, useRef, useState } from 'react';
import { X, FileText, Download, Star, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const ViewNotesModal = ({ isOpen, onClose, notes, consultationId }) => {
  const contentRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !notes) return null;

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(contentRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const dateStr = new Date(notes.createdAt || Date.now()).toISOString().split('T')[0];
      pdf.save(`Consultation_${consultationId || 'Notes'}_${dateStr}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const formattedDate = new Date(notes.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
  
  const readableTopic = notes.topic ? notes.topic.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Consultation';

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col z-50 relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50 shrink-0">
          <div className="flex items-center gap-2 text-gray-900 font-bold">
            <FileText size={20} className="text-green-600" />
            Consultation Notes
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content to be converted to PDF */}
        <div className="flex-1 overflow-y-auto p-8" ref={contentRef}>
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{notes.expertName || 'Expert'}</h2>
            <div className="text-sm text-gray-500 font-medium flex items-center gap-2">
              <span>{formattedDate}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>{readableTopic}</span>
              {notes.durationActualMinutes && (
                <>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>{notes.durationActualMinutes} min</span>
                </>
              )}
            </div>
          </div>

          {!notes.expertNotes && (!notes.recommendations || notes.recommendations.length === 0) ? (
            <div className="py-12 text-center text-gray-500">
              <p className="font-semibold text-gray-700 mb-1">Notes not added yet.</p>
              <p className="text-sm">Expert will add notes within 24 hours of the call.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Expert Notes */}
              {notes.expertNotes && (
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Expert Notes</h3>
                  <div className="bg-green-50/50 rounded-xl p-5 border border-green-100 text-gray-700 text-sm leading-relaxed">
                    {notes.expertNotes}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {notes.recommendations && notes.recommendations.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Recommendations</h3>
                  <ul className="space-y-3">
                    {notes.recommendations.map((rec, index) => (
                      <li key={index} className="flex gap-3 text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {index + 1}
                        </span>
                        <span className="mt-0.5">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Rating Section */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Your Rating</h3>
            {notes.farmerRating ? (
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={20} 
                    className={i < notes.farmerRating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} 
                  />
                ))}
              </div>
            ) : (
              <button className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline">
                Rate this consultation
              </button>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3 shrink-0">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
          >
            Close
          </button>
          <button 
            onClick={handleDownloadPDF}
            disabled={isDownloading || (!notes.expertNotes && (!notes.recommendations || notes.recommendations.length === 0))}
            className="px-5 py-2.5 text-sm font-bold text-white bg-[#2a7a3e] hover:bg-[#226332] active:scale-[0.98] disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all flex items-center gap-2"
          >
            {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {isDownloading ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>
    </>
  );
};

export default ViewNotesModal;
