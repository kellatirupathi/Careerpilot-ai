import { AppError } from '../utils/errors.js';

/** 404 for unmatched routes. */
export function notFoundHandler(_req, res) {
  res.status(404).json({ error: 'Route not found' });
}

/**
 * Central error handler. Sends a safe message to the client and logs full
 * details server-side. Never leaks stack traces to the response.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message });
  }

  // Unexpected error — log full detail, return a generic message.
  console.error('[error]', err);
  return res.status(500).json({ error: 'Something went wrong. Please try again.' });
}
