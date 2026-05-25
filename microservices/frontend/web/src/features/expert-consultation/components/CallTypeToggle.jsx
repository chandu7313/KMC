import React from 'react';
import { Phone, Video } from 'lucide-react';

const CallTypeToggle = ({ callType, setCallType }) => {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 gap-3 mb-2">
        <button
          onClick={() => setCallType('phone')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 transition-all ${
            callType === 'phone'
              ? 'border-green-600 bg-white text-gray-900 shadow-sm'
              : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'
          }`}
        >
          <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${callType === 'phone' ? 'border-green-600' : 'border-gray-400'}`}>
            {callType === 'phone' && <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />}
          </div>
          <Phone size={16} className={callType === 'phone' ? 'text-green-700' : 'text-gray-500'} />
          <span className={`text-sm font-semibold ${callType === 'phone' ? 'text-gray-900' : 'text-gray-600'}`}>Phone Call</span>
        </button>
        
        <button
          onClick={() => setCallType('video')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 transition-all ${
            callType === 'video'
              ? 'border-green-600 bg-white text-gray-900 shadow-sm'
              : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'
          }`}
        >
          <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${callType === 'video' ? 'border-green-600' : 'border-gray-400'}`}>
            {callType === 'video' && <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />}
          </div>
          <Video size={16} className={callType === 'video' ? 'text-green-700' : 'text-gray-500'} />
          <span className={`text-sm font-semibold ${callType === 'video' ? 'text-gray-900' : 'text-gray-600'}`}>Video Call</span>
        </button>
      </div>
      
      {/* Small amber text for video call requirement */}
      <div className={`transition-all duration-300 overflow-hidden ${callType === 'video' ? 'max-h-8 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-[11px] text-amber-600 font-medium flex items-center gap-1 px-1">
          <span className="text-[10px]">📱</span> Requires good internet connection
        </p>
      </div>
    </div>
  );
};

export default CallTypeToggle;
