/**
 * Standard success response builder.
 * Ensures every API response follows the same shape.
 */
const successResponse = (res, data = null, message = 'Success', statusCode = 200, meta = null) => {
  const response = {
    success: true,
    message,
    ...(data !== null && { data }),
    ...(meta && { meta }),
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(response);
};

/**
 * Paginated success response.
 */
const paginatedResponse = (res, data, total, page, limit, message = 'Success') => {
  const totalPages = Math.ceil(total / limit);

  return res.status(200).json({
    success: true,
    message,
    data,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    timestamp: new Date().toISOString(),
  });
};

/**
 * Created response (201).
 */
const createdResponse = (res, data, message = 'Resource created successfully') => {
  return successResponse(res, data, message, 201);
};

/**
 * No content response (204).
 */
const noContentResponse = (res) => {
  return res.status(204).end();
};

export { successResponse, paginatedResponse, createdResponse, noContentResponse };
