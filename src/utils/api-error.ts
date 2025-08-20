/**
 * ============================================================================
 * Custom API Error Class for Juno Backend
 * ============================================================================
 *
 * Standardized error handling class that extends the native Error class
 * to provide consistent error responses across all API endpoints.
 *
 * Features:
 * - HTTP status code integration
 * - Multiple error message support
 * - Stack trace preservation
 * - JSON serialization for API responses
 * - Type safety with TypeScript
 *
 * @fileoverview Custom API Error implementation
 * @version 1.0.0
 */

/**
 * Interface defining the structure of individual error details
 * Used for validation errors or multiple error scenarios
 */
interface ErrorDetail {
  /** Field name where the error occurred (for validation errors) */
  field?: string;
  /** Human-readable error message */
  message: string;
  /** Error code for programmatic handling */
  code?: string;
}

/**
 * Custom API Error Class
 *
 * Extends the native Error class to provide standardized error handling
 * across all API endpoints. This class is designed
 * to work seamlessly with Express middleware and error handlers.
 *
 * Use Cases:
 * - Authentication failures (401 Unauthorized)
 * - Authorization failures (403 Forbidden)
 * - Resource not found (404 Not Found)
 * - Validation errors (400 Bad Request)
 * - Database connection errors (500 Internal Server Error)
 * - Business logic violations (409 Conflict)
 *
 * @example Basic usage
 * throw new ApiError(404, "Project not found");
 *
 * @example With multiple validation errors
 * throw new ApiError(
 *   400,
 *   "Validation failed",
 *   [
 *     { field: "email", message: "Valid email is required" },
 *     { field: "password", message: "Password must be at least 8 characters" }
 *   ]
 * );
 *
 * @example With custom error code
 * throw new ApiError(409, "Email already exists", [], "", "EMAIL_DUPLICATE");
 */
class ApiError extends Error {
  /** HTTP status code (400, 401, 403, 404, 409, 500, etc.) */
  public readonly statusCode: number;

  /** Always null for error responses - maintains consistency with ApiResponse */
  public readonly data: null = null;

  /** Main error message displayed to clients */
  public override readonly message: string;

  /** Always false for error responses - indicates operation failure */
  public readonly success: false = false;

  /** Array of detailed error information (validation errors, multiple issues) */
  public readonly errors: ErrorDetail[];

  /** Optional error code for programmatic error handling */
  public readonly code?: string;

  /** Timestamp when the error occurred */
  public readonly timestamp: string;

  /** Request correlation ID for debugging (set by middleware) */
  public correlationId?: string;

  /**
   * Creates a new ApiError instance
   *
   * @param statusCode - HTTP status code (400-599)
   * @param message - Primary error message shown to users
   * @param errors - Array of detailed error information
   * @param stack - Custom stack trace (optional)
   * @param code - Error code for programmatic handling (optional)
   *
   * @throws {Error} If statusCode is not a valid HTTP error code
   */
  constructor(
    statusCode: number,
    message: string = 'Something went wrong',
    errors: ErrorDetail[] = [],
    stack?: string,
    code?: string,
  ) {
    // Call parent Error constructor
    super(message);

    // Validate status code range
    if (statusCode < 400 || statusCode > 599) {
      throw new Error(
        `Invalid status code: ${statusCode}. Must be between 400-599`,
      );
    }

    // Set error properties
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.code = code;
    this.timestamp = new Date().toISOString();

    // Set the error name for better debugging
    this.name = this.constructor.name;

    // Handle stack trace
    if (stack) {
      this.stack = stack;
    } else {
      // Capture stack trace excluding this constructor
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Converts the error to a JSON object for API responses
   *
   * This method is automatically called by JSON.stringify()
   * and Express when sending error responses.
   *
   * @returns Structured error object for JSON responses
   */
  toJSON(): object {
    return {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      errors: this.errors,
      ...(this.code && { code: this.code }),
      timestamp: this.timestamp,
      ...(this.correlationId && { correlationId: this.correlationId }),
    };
  }

  /**
   * Static factory methods for common error scenarios
   * Provides convenient ways to create standard HTTP errors
   */

  /** Creates a 400 Bad Request error */
  static badRequest(
    message: string = 'Bad Request',
    errors: ErrorDetail[] = [],
  ): ApiError {
    return new ApiError(400, message, errors, undefined, 'BAD_REQUEST');
  }

  /** Creates a 401 Unauthorized error */
  static unauthorized(message: string = 'Unauthorized access'): ApiError {
    return new ApiError(401, message, [], undefined, 'UNAUTHORIZED');
  }

  /** Creates a 403 Forbidden error */
  static forbidden(message: string = 'Access forbidden'): ApiError {
    return new ApiError(403, message, [], undefined, 'FORBIDDEN');
  }

  /** Creates a 404 Not Found error */
  static notFound(resource: string = 'Resource'): ApiError {
    return new ApiError(
      404,
      `${resource} not found`,
      [],
      undefined,
      'NOT_FOUND',
    );
  }

  /** Creates a 409 Conflict error */
  static conflict(message: string = 'Resource conflict'): ApiError {
    return new ApiError(409, message, [], undefined, 'CONFLICT');
  }

  /** Creates a 422 Unprocessable Entity error */
  static validation(
    message: string = 'Validation failed',
    errors: ErrorDetail[] = [],
  ): ApiError {
    return new ApiError(422, message, errors, undefined, 'VALIDATION_ERROR');
  }

  /** Creates a 500 Internal Server Error */
  static internal(message: string = 'Internal server error'): ApiError {
    return new ApiError(500, message, [], undefined, 'INTERNAL_ERROR');
  }
}

export { ApiError, type ErrorDetail };
