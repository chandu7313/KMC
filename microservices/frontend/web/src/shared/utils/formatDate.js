/**
 * Date Formatter
 * Standardized date formatting for the KMC application.
 */

/**
 * Format a date string to a readable format
 * @param {string|Date} date
 * @param {string} style - 'short' | 'medium' | 'long'
 * @returns {string}
 */
export const formatDate = (date, style = 'medium') => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const options = {
    short: { day: '2-digit', month: '2-digit', year: '2-digit' },
    medium: { day: 'numeric', month: 'short', year: 'numeric' },
    long: { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' },
  };

  return d.toLocaleDateString('en-IN', options[style] || options.medium);
};

/**
 * Get relative time (e.g., "2 hours ago")
 * @param {string|Date} date
 * @returns {string}
 */
export const timeAgo = (date) => {
  if (!date) return '';
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date, 'medium');
};

export default formatDate;
