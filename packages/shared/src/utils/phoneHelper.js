/**
 * Indian phone number utilities.
 */

/**
 * Normalizes an Indian phone number to standard +91XXXXXXXXXX format.
 * Strips spaces, dashes, parentheses, and handles local prefixes.
 * 
 * @param {string} phone 
 * @returns {string} Standardized phone string
 */
const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Remove all non-numeric characters except +
  let cleaned = String(phone).replace(/[^\d+]/g, '');

  // Handle local numbers without prefix (assuming India +91)
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }

  // Handle numbers with 0 prefix
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `+91${cleaned.substring(1)}`;
  }

  // Handle numbers with 91 prefix but missing +
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+${cleaned}`;
  }

  return cleaned;
};

/**
 * Validates if the string is a valid Indian mobile number.
 * 
 * @param {string} phone 
 * @returns {boolean}
 */
const validatePhone = (phone) => {
  const formatted = formatPhone(phone);
  // Indian mobile regex: exactly 10 digits starting with 6-9, preceded by +91
  const indianMobileRegex = /^\+91[6-9]\d{9}$/;
  return indianMobileRegex.test(formatted);
};

/**
 * Masks a phone number for privacy logging.
 * Returns: +91 XXXXX 43210
 * 
 * @param {string} phone 
 * @returns {string}
 */
const maskPhone = (phone) => {
  const formatted = formatPhone(phone);
  if (!validatePhone(formatted)) return 'Invalid Phone';

  const prefix = formatted.substring(0, 3); // +91
  const lastFour = formatted.substring(formatted.length - 4);
  
  return `${prefix} XXXXX ${lastFour}`;
};

/**
 * Extracts the 10-digit raw number by removing the country prefix.
 * 
 * @param {string} phone 
 * @returns {string}
 */
const extractPhone = (phone) => {
  const formatted = formatPhone(phone);
  if (formatted.startsWith('+91')) {
    return formatted.substring(3);
  }
  return formatted;
};

module.exports = {
  formatPhone,
  validatePhone,
  maskPhone,
  extractPhone,
};
