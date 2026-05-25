import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, Star, MapPin, Calendar, Clock, Loader2, ArrowLeft } from 'lucide-react';
import { expertApi } from '../api/expert.api';

const ExpertProfilePanel = ({ isOpen, onClose, expertId, onSelectExpert }) => {
  // Fetch full expert profile when opened
  const { data: profileRes, isLoading, error } = useQuery({
    queryKey: ['expertProfile', expertId],
    queryFn: () => expertApi.getExpertProfile(expertId),
    enabled: isOpen && !!expertId,
  });

  const profile = profileRes?.data?.expert;

  // Handle escape key to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* Slide Panel */}
      <div 
        className={`fixed inset-y-0 right-0 w-full md:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="font-semibold text-sm">Back</span>
          </button>
          <span className="font-bold text-gray-900">Expert Profile</span>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Loader2 size={32} className="animate-spin mb-4 text-green-600" />
              <p>Loading profile...</p>
            </div>
          ) : error || !profile ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <p className="text-red-500 font-semibold mb-2">Failed to load profile</p>
              <button onClick={onClose} className="text-green-600 underline text-sm">Close and try again</button>
            </div>
          ) : (
            <div className="p-6">
              {/* Profile Header */}
              <div className="flex flex-col items-center text-center mb-8">
                <img 
                  src={profile.photoUrl || 'https://via.placeholder.com/150'} 
                  alt={profile.name} 
                  className="w-24 h-24 rounded-full object-cover shadow-sm mb-4 bg-gray-100 border-2 border-white ring-2 ring-gray-100"
                />
                <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                <p className="text-sm font-semibold text-green-700 mt-1">{profile.specialty}</p>
                <div className="flex items-center gap-1.5 mt-2 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-bold text-yellow-700 text-sm">{profile.rating || '4.5'}</span>
                  <span className="text-xs text-yellow-600">({profile.consultCount || 0}+ Consults)</span>
                </div>
              </div>

              {/* About Section */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-900 mb-2">About</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {profile.description || 'No description provided.'}
                </p>
              </div>

              {/* Specializations & Tags */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {(profile.tags || []).map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Languages Spoken</h3>
                <div className="flex flex-wrap gap-2">
                  {(profile.languages || ['English', 'Hindi']).map(lang => (
                    <span key={lang} className="border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-semibold">
                      {lang.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Availability (Mocked list derived from slots if available) */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar size={16} className="text-green-600" /> 
                  Availability This Week
                </h3>
                <div className="space-y-2">
                  {profile.slots && profile.slots.length > 0 ? (
                    profile.slots.slice(0, 3).map((slot, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50">
                        <span className="text-sm font-medium text-gray-700">
                          {new Date(slot.slotDatetime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-green-700">
                          <Clock size={14} />
                          {new Date(slot.slotDatetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">Available slots will be confirmed upon booking.</p>
                  )}
                </div>
              </div>

              {/* Recent Reviews */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">Recent Reviews</h3>
                <div className="space-y-4">
                  {(profile.reviews || [
                    { id: 1, text: "Very helpful advice for my tomato crops. Highly recommended!", author: "Rajesh K.", rating: 5 },
                    { id: 2, text: "Accurate diagnosis and saved my farm from severe damage.", author: "Sunita P.", rating: 5 }
                  ]).map(review => (
                    <div key={review.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="flex gap-1 mb-2">
                        {[...Array(review.rating || 5)].map((_, i) => (
                          <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-700 italic mb-2">"{review.text}"</p>
                      <p className="text-xs font-semibold text-gray-500">— {review.author}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {profile && (
          <div className="p-6 border-t border-gray-100 bg-white shrink-0">
            <button 
              onClick={() => {
                onSelectExpert(profile);
                onClose();
              }}
              className="w-full bg-[#2a7a3e] hover:bg-[#226332] active:scale-[0.98] text-white font-bold py-3.5 rounded-xl transition-all shadow-md"
            >
              Select This Expert
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ExpertProfilePanel;
