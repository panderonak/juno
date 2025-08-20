/**
 * ============================================================================
 * Health Check Routes for Backend API.
 * ============================================================================
 *
 * Provides system health monitoring endpoints for the API.
 *
 * @fileoverview Health check routing configuration
 * @version 1.0.0
 */

import { Router } from 'express';
import { healthCheck } from '@/controllers/healthcheck.controllers';

/**
 * Health Check Router
 *
 * Defines routes for system health monitoring endpoints.
 *
 * Routes:
 * - GET /api/v1/health/ - Basic health status
 *
 * @example Usage in main app
 * app.use('/api/v1/health', healthRoutes);
 *
 * @example External monitoring
 * curl http://localhost:3001/api/v1/health/
 */
const router: Router = Router();

/**
 * GET /api/v1/health/
 *
 * Basic health check endpoint that returns:
 * - Server status (running/stopped)
 *
 * This endpoint should always return 200 OK when the server
 * is operational.
 *
 * @route GET /api/v1/health/
 * @access Public
 * @returns {ApiResponse} Health status information
 */
router.route('/').get(healthCheck);

export default router;
