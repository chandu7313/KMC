import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

const ExpertCard = ({ expert, isSelected, onSelect, onViewProfile }) => {
  // Badge logic
  let badgeText = '';
  let badgeClass = '';

  if (expert.availabilityStatus === 'available') {
    badgeText = 'Available Now';
    badgeClass = 'bg-green-100 text-green-700';
  } else if (expert.availabilityStatus === 'busy') {
    // Basic format assuming nextSlotTime is a string like "2 PM" or date
    const timeStr = expert.nextAvailableAt 
      ? new Date(expert.nextAvailableAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : 'Later';
    badgeText = `Avail: ${timeStr}`;
    badgeClass = 'bg-gray-200 text-gray-700';
  } else {
    badgeText = 'Offline Today';
    badgeClass = 'bg-red-100 text-red-700';
  }

  return (
    <div 
      onClick={() => onSelect(expert)}
      className={`bg-white rounded-xl border-2 shadow-sm p-5 relative overflow-hidden flex flex-col h-full hover:shadow-md transition-all cursor-pointer ${
        isSelected ? 'border-green-600 ring-1 ring-green-600' : 'border-gray-200 hover:border-green-300'
      }`}
    >
      {/* Selected Indicator Overlay */}
      {isSelected && (
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md border border-green-200 z-10">
          <CheckCircle size={12} className="text-green-600" />
          <span className="text-[10px] font-bold text-green-700">Selected</span>
        </div>
      )}

      {/* Availability Badge */}
      <div className="absolute top-0 right-0 z-10">
        <span className={`inline-block px-3 py-1 text-xs font-bold rounded-bl-lg ${badgeClass}`}>
          {badgeText}
        </span>
      </div>

      <div className="flex gap-4 mb-4 mt-2">
        <img 
          src={expert.photoUrl || 'https://via.placeholder.com/150'} 
          alt={expert.name} 
          className="w-16 h-16 rounded-lg object-cover bg-gray-100" 
        />
        <div>
          <h3 className="font-bold text-gray-900">{expert.name}</h3>
          <p className="text-xs text-gray-500 mb-1">{expert.specialty}</p>
          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-gray-700">{expert.rating || '4.5'}</span>
            <span className="text-xs text-gray-500">({expert.consultCount || 0}+ Consults)</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {(expert.tags || []).map(tag => (
          <span key={tag} className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onViewProfile(expert.id);
          }}
          className="w-full py-2 border border-green-600 text-green-700 hover:bg-green-50 font-bold text-sm rounded-lg transition-colors"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default ExpertCard;
