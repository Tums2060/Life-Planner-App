/**
 * @fileoverview Request Logger Middleware
 * @description Logs incoming HTTP requests for debugging and monitoring
 *
 * @module RequestLogger
 */

/**
 * Logs HTTP request details
 * Records method, URL, headers, and timing information
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {void}
 */