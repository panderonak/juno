/**
 * ============================================================================
 * Health Check Controller for Backend API.
 * ============================================================================
 *
 * Simple health check endpoint that confirms the server is operational.
 *
 * @fileoverview Simple health check controller implementation
 * @version 1.0.0
 */

import type { Request, Response } from 'express';
import { ApiResponse } from '@/utils/api-response';
import { asyncHandler } from '@/utils/async-handler';

/**
 * Health Check Controller
 *
 * Simple endpoint that returns server status confirmation.
 * Provides basic "server is running" response for monitoring systems.
 *
 * @route GET /api/v1/health/
 * @access Public
 * @returns {ApiResponse} Simple server status message
 *
 * @example Response
 * {
 *   "success": true,
 *   "statusCode": 200,
 *   "message": "Success",
 *   "data": { "message": "Server is running" },
 *   "timestamp": "2025-08-20T07:28:00.000Z"
 * }
 */
const healthCheck = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json(new ApiResponse(200, { message: 'Server is running.' }));
});

export { healthCheck };
