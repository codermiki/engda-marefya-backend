import rateLimit from "express-rate-limit";
import { logger } from "../utils/logger.js";
import { errorResponse } from "../utils/responseFormatter.js";
import { HTTP_STATUS } from "../constants/http.js";
import { ERROR_CODES } from "../constants/errors.js";

/**
 * Create a configurable, reusable rate limiter instance
 *
 * @param {Object} options - Rate limiter configuration
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.max - Maximum number of requests allowed in the window
 * @param {string} [options.message] - Custom error message
 * @returns {Function} Express middleware
 */
export const rateLimiter = ({
   windowMs = 15 * 60 * 1000, // default: 15 minutes
   max = 100, // default: 100 requests per window per IP
   message = "Too many requests. Please try again later.",
} = {}) => {
   return rateLimit({
      windowMs,
      max,
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
         // Log the rate limit event
         logger.warn(
            `🚨 Rate limit exceeded - IP: ${req.ip}, Path: ${
               req.path
            }, Method: ${req.method}, User-Agent: ${req.get("User-Agent")}`
         );
         errorResponse(res, {
            error: ERROR_CODES.TOO_MANY_REQUESTS,
            message,
            statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
         });
      },
   });
};
