/**
 * Error Fallback
 * Displayed when an ErrorBoundary catches a render error.
 */
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorFallback = ({ error, onReset }) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="bg-white rounded-[32px] border border-red-100 shadow-sm p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={28} className="text-red-500" />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">
          Something went wrong
        </h3>
        <p className="text-slate-500 text-sm font-medium mb-6">
          {error?.message || 'An unexpected error occurred in this section.'}
        </p>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
