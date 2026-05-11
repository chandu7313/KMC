/**
 * Currency Formatter
 * Standardized Indian Rupee formatting used across the app.
 */

/**
 * Format a number as Indian Rupees
 * @param {number} amount
 * @param {boolean} showSymbol - Whether to prefix ₹ symbol
 * @returns {string}
 */
export const formatCurrency = (amount, showSymbol = true) => {
  if (amount == null || isNaN(amount)) return showSymbol ? '₹0' : '0';
  const formatted = Number(amount).toLocaleString('en-IN');
  return showSymbol ? `₹${formatted}` : formatted;
};

/**
 * Format a price range
 * @param {number} min
 * @param {number} max
 * @returns {string}
 */
export const formatPriceRange = (min, max) => {
  return `₹${formatCurrency(min, false)} – ₹${formatCurrency(max, false)}`;
};

export default formatCurrency;
