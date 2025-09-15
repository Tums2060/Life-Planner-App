/**
 * @fileoverview Error Handler Middleware
 * @description Global error handling middleware for consistent error responses
 *
 * @module ErrorHandler
 */

/**
 * Global error handler
 * Formats and sends error responses consistently across the application
 *
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {Response} JSON response with error details
 */