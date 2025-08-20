/**
 * ============================================================================
 * Standardized API Response Class for Juno Backend
 * ============================================================================
 *
 * Provides consistent response structure across all API endpoints.
 * Ensures uniform data format for successful operations.
 *
 * @fileoverview Standardized API Response implementation
 * @version 1.0.0
 */

/**
 * Generic type for API response data
 * Allows type safety while maintaining flexibility
 */
type ApiResponseData<T = any> = T;

/**
 * Metadata interface for pagination and additional response information
 */
interface ResponseMetadata {
  /** Total number of items (for paginated responses) */
  total?: number;
  /** Current page number */
  page?: number;
  /** Number of items per page */
  limit?: number;
  /** Total number of pages */
  totalPages?: number;
  /** Whether there are more items available */
  hasNext?: boolean;
  /** Whether there are previous items available */
  hasPrevious?: boolean;
}

/**
 * Standardized API Response Class
 *
 * Creates consistent response objects for all successful API operations.
 * Works in conjunction with ApiError to provide uniform client experiences.
 *
 * Response Structure:
 * - success: Boolean indicating operation success
 * - statusCode: HTTP status code (200, 201, 204, etc.)
 * - message: Human-readable success message
 * - data: Response payload (typed for better development experience)
 * - metadata: Additional information (pagination, etc.)
 * - timestamp: Response generation time
 *
 * @template T Type of the response data
 *
 * @example Basic success response
 * return new ApiResponse(200, user, "User retrieved successfully");
 *
 * @example Paginated response
 * return new ApiResponse(
 *   200,
 *   projects,
 *   "Projects retrieved successfully",
 *   { total: 50, page: 1, limit: 10, totalPages: 5 }
 * );
 *
 * @example Created resource response
 * return ApiResponse.created(newProject, "Project created successfully");
 */
class ApiResponse<T = any> {
  /** Always true for successful responses */
  public readonly success: true = true;

  /** HTTP status code (200, 201, 204, etc.) */
  public readonly statusCode: number;

  /** Response data payload */
  public readonly data: ApiResponseData<T>;

  /** Human-readable success message */
  public readonly message: string;

  /** Additional response metadata (pagination, etc.) */
  public readonly metadata?: ResponseMetadata;

  /** Response generation timestamp */
  public readonly timestamp: string;

  /**
   * Creates a new ApiResponse instance
   *
   * @param statusCode - HTTP status code for successful operations
   * @param data - Response data payload
   * @param message - Success message displayed to users
   * @param metadata - Optional response metadata
   *
   * @throws {Error} If statusCode is not a successful HTTP status code
   */
  constructor(
    statusCode: number,
    data: ApiResponseData<T>,
    message: string = 'Success',
    metadata?: ResponseMetadata,
  ) {
    // Validate status code range for success responses
    if (statusCode < 200 || statusCode >= 400) {
      throw new Error(
        `Invalid success status code: ${statusCode}. Must be between 200-399`,
      );
    }

    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.metadata = metadata;
    this.timestamp = new Date().toISOString();
  }

  /**
   * Converts the response to a JSON object
   *
   * This method is automatically called by JSON.stringify()
   * and Express when sending responses.
   *
   * @returns Structured response object for JSON responses
   */
  toJSON(): object {
    return {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      ...(this.metadata && { metadata: this.metadata }),
      timestamp: this.timestamp,
    };
  }

  /**
   * Static factory methods for common success scenarios
   * Provides convenient ways to create standard HTTP success responses
   */

  /** Creates a 200 OK response */
  static ok<T>(
    data: ApiResponseData<T>,
    message: string = 'Success',
  ): ApiResponse<T> {
    return new ApiResponse(200, data, message);
  }

  /** Creates a 201 Created response */
  static created<T>(
    data: ApiResponseData<T>,
    message: string = 'Resource created successfully',
  ): ApiResponse<T> {
    return new ApiResponse(201, data, message);
  }

  /** Creates a 204 No Content response */
  static noContent(
    message: string = 'Operation completed successfully',
  ): ApiResponse<null> {
    return new ApiResponse(204, null, message);
  }

  /** Creates a paginated response */
  static paginated<T>(
    data: T[],
    metadata: ResponseMetadata,
    message: string = 'Data retrieved successfully',
  ): ApiResponse<T[]> {
    return new ApiResponse(200, data, message, metadata);
  }
}

export { ApiResponse, type ApiResponseData, type ResponseMetadata };
