/**
 * ============================================================================
 * Juno Backend Application Configuration
 * ============================================================================
 *
 * Main Express application setup with security, middleware configuration,
 * and CORS handling for the Project Camp Backend API.
 *
 * This file serves as the central application configuration that:
 * - Sets up Express middleware for parsing requests
 * - Configures CORS for frontend communication
 * - Establishes security headers and request limits
 * - Provides basic health check endpoints
 *
 * @fileoverview Central Express application configuration
 * @author Juno
 * @version 1.0.0
 */

import healthCheckRouter from '@/routes/healthcheck.routes';
import cors from 'cors';
import express, {
  type Application,
  type Request,
  type Response,
} from 'express';

/**
 * Creates and configures the main Express application instance
 *
 * The application is configured with essential middleware for:
 * - JSON parsing with size limits for security
 * - URL-encoded data parsing for form submissions
 * - Static file serving for uploaded attachments
 * - CORS configuration for frontend integration
 *
 * @returns {Application} Configured Express application instance
 */

const app: Application = express();

/**
 * ========================================================================
 * REQUEST PARSING MIDDLEWARE
 * ========================================================================
 */

/**
 * JSON Parser Middleware
 *
 * Parses incoming JSON payloads and makes them available via req.body.
 * The 16kb limit prevents DoS attacks through oversized request bodies.
 *
 * Use case: All API endpoints that receive JSON data (auth, projects, tasks)
 * Security: Prevents memory exhaustion from large payloads
 */
app.use(
  express.json({
    limit: '16kb',
    type: 'application/json',
  }),
);

/**
 * URL-Encoded Parser Middleware
 *
 * Parses form data (application/x-www-form-urlencoded) for traditional
 * HTML form submissions. Extended: true allows parsing of nested objects.
 *
 * Use case: Form-based authentication, file upload forms
 * Security: Same 16kb limit as JSON parser
 */
app.use(
  express.urlencoded({
    extended: true,
    limit: '16kb',
    type: 'application/x-www-form-urlencoded',
  }),
);

/**
 * Static File Serving Middleware
 *
 * Serves static files from the 'public' directory. This enables:
 * - Task file attachments (public/images/)
 * - Uploaded documents and media files
 * - Any static assets needed by the application
 *
 * Security Note: Files in 'public' are accessible without authentication
 *
 * @example
 * // File at public/images/task-attachment.pdf
 * // Accessible at: http://localhost:3001/images/task-attachment.pdf
 */
app.use(express.static('public'));

/**
 * ========================================================================
 * CORS CONFIGURATION
 * ========================================================================
 */

/**
 * Cross-Origin Resource Sharing (CORS) Configuration
 *
 * Enables the backend API to be accessed by frontend applications running
 * on different domains/ports. Essential for development and production.
 *
 * Configuration breakdown:
 * - origin: Allowed frontend URLs (from environment variable)
 * - credentials: Allows cookies/auth headers in cross-origin requests
 * - methods: HTTP methods the frontend can use
 * - allowedHeaders: Headers the frontend can send
 *
 * Environment Setup:
 * CORS_ORIGIN=http://localhost:3000,http://localhost:5173,https://yourapp.com
 *
 * @example Frontend fetch request
 * fetch('http://localhost:3001/api/v1/auth/login', {
 *   method: 'POST',
 *   credentials: 'include', // Enabled by credentials: true
 *   headers: { 'Content-Type': 'application/json' }
 * })
 */
app.use(
  cors({
    // Parse comma-separated origins from environment variable
    // Supports multiple frontend environments (dev, staging, prod)
    origin: process.env.CORS_ORIGIN?.split(',').map((url) => url.trim()) || [
      'http://localhost:3000',
    ],

    // Allow cookies and authorization headers in cross-origin requests
    // Required for JWT token authentication from frontend
    credentials: true,

    // Allowed HTTP methods for API operations
    // Add PUT, DELETE, PATCH as you implement more CRUD operations
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

    // Headers the frontend is allowed to send
    // Authorization: Required for JWT tokens
    // Content-Type: Required for JSON requests
    allowedHeaders: ['Content-Type', 'Authorization'],

    // How long browsers can cache preflight requests (in seconds)
    maxAge: 600, // 10 min
  }),
);

/**
 * Root Endpoint - Welcome Message
 *
 * Provides basic information about the API and available endpoints.
 * Useful for:
 * - Confirming the server is running
 * - API documentation links
 * - Version information
 *
 * @route GET /
 * @returns {Object} Welcome message with API information
 */
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to Juno Backend API',
    version: '1.0.0',
    documentation: {
      health: '/api/v1/health',
      auth: '/api/v1/auth',
      projects: '/api/v1/projects',
      tasks: '/api/v1/tasks',
    },
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Health Check Endpoint
 *
 * Provides system health status for monitoring and load balancers.
 *
 * @route GET /api/v1/health
 * @returns {Object} System health information
 */

app.use('/api/v1/health', healthCheckRouter);

export default app;
