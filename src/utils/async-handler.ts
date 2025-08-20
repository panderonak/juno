/**
 * ============================================================================
 * Async Handler Utility for Juno Backend
 * ============================================================================
 *
 * Higher-order function that wraps Express async route handlers and
 * controllers to automatically catch errors and pass them to Express
 * error handling middleware.
 *
 * This utility eliminates the need for try-catch blocks in every
 * async controller function and ensures consistent error handling
 * across the entire API.
 *
 * @fileoverview Async controller wrapper utility
 * @version 1.0.0
 */

import type { Request, Response, NextFunction } from 'express';

/**
 * Type definition for async Express controller functions
 *
 * Defines the signature for controller functions that:
 * - Accept Express req, res, next parameters
 * - Return a Promise<void>
 * - May throw errors that should be caught
 */
type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

/**
 * Async Handler Wrapper
 *
 * Wraps async Express route handlers and controllers to automatically
 * catch any thrown errors or rejected promises and pass them to the
 * Express error handling middleware.
 *
 * Benefits:
 * - Eliminates repetitive try-catch blocks in controllers
 * - Ensures all async errors are properly handled
 * - Maintains clean, readable controller code
 * - Provides consistent error handling across all routes
 * - Prevents unhandled promise rejections
 *
 * How it works:
 * 1. Takes an async controller function as input
 * 2. Returns a new function that Express can use as middleware
 * 3. Executes the controller inside Promise.resolve()
 * 4. Catches any errors and passes them to next()
 * 5. Express error middleware handles the error appropriately
 *
 * @param requestHandler - Async controller function to wrap
 * @returns Express middleware function that handles errors
 *
 * @example In route definition
 * router.get('/users/:id', authenticateToken, asyncHandler(getUserById));
 *
 * @example Error handling
 * // Any error thrown in the wrapped function will automatically
 * // be caught and passed to your global error handler
 * const createProject = asyncHandler(async (req, res, next) => {
 *   // If this throws an error, asyncHandler catches it
 *   const project = await ProjectModel.create(req.body);
 *   // No try-catch needed!
 * });
 */
const asyncHandler = (requestHandler: AsyncController) => {
  /**
   * Return Express middleware function
   *
   * This returned function is what actually gets called by Express
   * when a route is accessed. It wraps the original controller in
   * error handling logic.
   *
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function for error handling
   */
  return (req: Request, res: Response, next: NextFunction): void => {
    // Wrap the controller execution in Promise.resolve() to handle
    // both synchronous and asynchronous errors consistently
    Promise.resolve(requestHandler(req, res, next)).catch((err: Error) => {
      // If any error occurs (thrown or rejected promise),
      // pass it to Express error handling middleware
      next(err);
    });
  };
};

export { asyncHandler, type AsyncController };
