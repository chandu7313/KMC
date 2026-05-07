const { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } = require('../../config/src/constants');

/**
 * Extracts and normalizes pagination parameters from the request query.
 * 
 * @param {Object} query - Express req.query object
 * @returns {Object} { page, limit, offset }
 */
const getPaginationParams = (query) => {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  // Fallback to defaults if NaN or less than 1
  if (isNaN(page) || page < 1) {
    page = 1;
  }
  
  if (isNaN(limit) || limit < 1) {
    limit = DEFAULT_PAGE_SIZE;
  }
  
  // Enforce max limit to prevent huge queries
  if (limit > MAX_PAGE_SIZE) {
    limit = MAX_PAGE_SIZE;
  }

  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

/**
 * Generates standardized pagination metadata block.
 * Useful for building custom paginated responses outside the `sendPaginated` helper.
 * 
 * @param {number} total - Total records in the database
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object}
 */
const getPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

module.exports = {
  getPaginationParams,
  getPaginationMeta,
};
