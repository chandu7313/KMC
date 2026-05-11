/**
 * Spinner Component
 * Reusable loading spinner extracted from patterns used across CartPage, AdminLayout, etc.
 */
import React from 'react';

const sizeMap = {
  sm: 'w-6 h-6 border-2',
  md: 'w-10 h-10 border-4',
  lg: 'w-12 h-12 border-4',
  xl: 'w-16 h-16 border-[5px]',
};

const Spinner = ({ size = 'md', label = '', className = '' }) => {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div
        className={`${sizeMap[size] || sizeMap.md} border-slate-200 border-t-emerald-600 rounded-full animate-spin`}
      />
      {label && (
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">
          {label}
        </p>
      )}
    </div>
  );
};

export default Spinner;
