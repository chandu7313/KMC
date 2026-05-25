import React, { useState, useEffect } from 'react';
import { Edit2, Check, X } from 'lucide-react';

const PhoneInput = ({ phone, setPhone, isEditing, setIsEditing, isValidIndianPhone }) => {
  const [tempPhone, setTempPhone] = useState(phone);
  const [error, setError] = useState('');

  // Format phone for display mode
  const formatPhone = (p) => {
    if (!p) return '';
    const cleaned = p.replace(/\D/g, '');
    const number = cleaned.startsWith('91') ? cleaned.slice(2) : cleaned;
    return `+91 ${number.slice(0,5)} ${number.slice(5)}`;
  };

  useEffect(() => {
    setTempPhone(phone);
  }, [phone, isEditing]);

  const handleSave = () => {
    if (!isValidIndianPhone(tempPhone)) {
      setError('Invalid Indian mobile number');
      return;
    }
    setError('');
    setPhone(tempPhone);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setError('');
    setTempPhone(phone);
    setIsEditing(false);
  };

  return (
    <div className="mb-3">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Contact Details</h3>
      
      {!isEditing ? (
        <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 group">
          <span className="text-sm font-medium text-gray-700">
            {formatPhone(phone) || 'No phone number set'}
          </span>
          <button 
            onClick={() => setIsEditing(true)}
            className="text-gray-400 hover:text-green-600 transition-colors p-1 rounded-md hover:bg-gray-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Edit phone number"
          >
            <Edit2 size={14} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value={tempPhone}
              onChange={(e) => setTempPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              className={`flex-1 border ${error ? 'border-red-500 focus:ring-red-200' : 'border-green-400 focus:ring-green-200'} rounded-lg px-4 py-2 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 transition-all`}
              autoFocus
            />
            <button 
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors flex-shrink-0"
              title="Save"
            >
              <Check size={16} />
            </button>
            <button 
              onClick={handleCancel}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-lg transition-colors flex-shrink-0"
              title="Cancel"
            >
              <X size={16} />
            </button>
          </div>
          {error && <span className="text-xs text-red-500 font-medium ml-1">{error}</span>}
        </div>
      )}
    </div>
  );
};

export default PhoneInput;
