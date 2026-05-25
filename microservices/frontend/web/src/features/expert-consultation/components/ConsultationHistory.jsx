import React from 'react';
import { PhoneCall } from 'lucide-react';

const ConsultationHistory = ({ 
  consultations, 
  historyLoading, 
  handleViewNotes, 
  handleViewDetails 
}) => {
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTopicLabel = (topicStr) => {
    if (!topicStr) return '';
    return topicStr.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-green-100 text-green-800">Completed</span>;
      case 'cancelled':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-gray-200 text-gray-700">Cancelled</span>;
      case 'upcoming':
      case 'confirmed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-800">Upcoming</span>;
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-800">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
            In Progress
          </span>
        );
      case 'no_show':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-red-100 text-red-800">No Show</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const renderAction = (consultation) => {
    switch (consultation.status) {
      case 'completed':
        return (
          <button 
            onClick={() => handleViewNotes(consultation.id)}
            className="text-sm font-bold text-green-700 hover:underline"
          >
            View Notes
          </button>
        );
      case 'cancelled':
        return (
          <button 
            onClick={() => handleViewDetails(consultation)}
            className="text-sm font-bold text-gray-500 hover:underline"
          >
            Details
          </button>
        );
      case 'upcoming':
      case 'confirmed':
        return (
          <div className="flex gap-3 justify-end">
            <button className="text-sm font-bold text-blue-600 hover:underline">Reschedule</button>
            <button className="text-sm font-bold text-red-500 hover:underline">Cancel</button>
          </div>
        );
      case 'in_progress':
        if (consultation.callType === 'video') {
          return (
            <button className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors">
              Join Call
            </button>
          );
        }
        return <span className="text-sm text-gray-400">Ongoing</span>;
      case 'no_show':
        return (
          <button className="text-sm font-bold text-gray-600 hover:underline">
            Rebook
          </button>
        );
      default:
        return null;
    }
  };

  if (historyLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">My Consultation History</h2>
        </div>
        <div className="p-6 space-y-4 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-900">My Consultation History</h2>
      </div>
      
      {(!consultations || consultations.length === 0) ? (
        <div className="px-6 py-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <PhoneCall size={32} className="text-gray-300" />
          </div>
          <h3 className="text-gray-900 font-bold mb-1">No consultations yet</h3>
          <p className="text-sm text-gray-500">Book your first call with an expert!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Expert</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Topic</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {consultations.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-bold">
                    {item.expertName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {getTopicLabel(item.topic)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {renderAction(item)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ConsultationHistory;
