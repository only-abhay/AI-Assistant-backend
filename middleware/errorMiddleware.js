import { ErrorResponse } from '../utils/response.js';

export const notFound = (req, res) => {
  return ErrorResponse(res, 404, `Route not found: ${req.originalUrl}`);
};

export const errorHandler = (error, req, res, next) => {
  console.error('Unhandled server error:', error);

  const statusCode = error.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  const message =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Internal server error'
      : error.message || 'Internal server error';

  return ErrorResponse(res, statusCode, message);
};
