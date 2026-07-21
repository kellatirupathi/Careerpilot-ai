/**
 * A typed application error. The `status` becomes the HTTP status code and the
 * `message` is the ONLY thing sent to the client — never a stack trace.
 */
export class AppError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'AppError';
  }
}

export const badRequest = (msg) => new AppError(400, msg);
export const unauthorized = (msg = 'Not authenticated') => new AppError(401, msg);
export const forbidden = (msg = 'Not allowed') => new AppError(403, msg);
export const notFound = (msg = 'Not found') => new AppError(404, msg);

/** Wraps an async route handler so thrown errors reach the error middleware. */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
