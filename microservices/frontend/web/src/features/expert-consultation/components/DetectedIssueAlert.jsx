import React from 'react';
import { Info, X } from 'lucide-react';

const DetectedIssueAlert = ({ detectedIssue, issueLoading, dismissIssue }) => {
  if (issueLoading) {
    return (
      <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-6 flex gap-3 items-start animate-pulse">
        <div className="w-5 h-5 bg-gray-200 rounded-full shrink-0"></div>
        <div className="w-full">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!detectedIssue) return null;

  const isDisease = detectedIssue.type === 'disease';
  
  const bgClass = isDisease ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100';
  const iconClass = isDisease ? 'text-red-500' : 'text-amber-500';
  const titleClass = isDisease ? 'text-red-800' : 'text-amber-800';
  const textClass = isDisease ? 'text-red-600' : 'text-amber-600';

  const titleText = isDisease
    ? `Detected Issue: ${detectedIssue.name} in ${detectedIssue.crop}`
    : `Detected Issue: ${detectedIssue.name} in soil`;

  const subText = isDisease
    ? 'Auto-selected based on your recent farm scan.'
    : 'Auto-selected based on your recent soil test.';

  return (
    <div className={`${bgClass} border rounded-lg p-4 mb-6 flex gap-3 items-start relative`}>
      <Info className={`${iconClass} shrink-0 mt-0.5`} size={20} />
      <div className="pr-6">
        <h3 className={`${titleClass} font-bold text-sm`}>{titleText}</h3>
        <p className={`${textClass} text-xs mt-1`}>{subText}</p>
      </div>
      <button 
        onClick={dismissIssue} 
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default DetectedIssueAlert;
