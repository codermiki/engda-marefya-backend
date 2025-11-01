/**
 * Custom application error class for handling operational errors.
 * Adds a status code, operational flag, and clean stack trace.
 */
export default class AppError extends Error {
   /**
    * @param {string} message - Human-readable error message
    * @param {number} statusCode - HTTP status code (e.g., 400, 404, 500)
    * @param {boolean} [isOperational=true] - True if it's an expected (handled) error
    */
   constructor(message, statusCode, isOperational = true) {
      super(message);

      this.statusCode = statusCode;
      this.isOperational = isOperational;

      // Capture stack trace excluding this constructor for cleaner logs
      Error.captureStackTrace(this, this.constructor);
   }
}
