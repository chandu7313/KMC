/**
 * Sends a standardized success response.
 * 
 * @param {import('express').Response} res - Express response object
 * @param {any} data - Data payload to return
 * @param {string} [message='Success'] - Optional success message
 * @param {number} [statusCode=200] - HTTP status code
 */
const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Sends a standardized paginated success response.
 * 
 * @param {import('express').Response} res - Express response object
 * @param {Array} data - Array of data items for the current page
 * @param {Object} pagination - Pagination metadata
 * @param {number} pagination.page - Current page number
 * @param {number} pagination.limit - Items per page
 * @param {number} pagination.total - Total items across all pages
 * @param {string} [message='Success'] - Optional success message
 */
const sendPaginated = (res, data, pagination, message = 'Success') => {
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages,
      hasNext: pagination.page < totalPages,
      hasPrev: pagination.page > 1,
    },
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  sendSuccess,
  sendPaginated,
};
