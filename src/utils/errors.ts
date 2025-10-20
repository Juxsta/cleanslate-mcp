/**
 * Base error class for all CleanSlate-related errors
 */
export class CleanSlateError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = "CleanSlateError";
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Authentication error (401/403)
 * Indicates invalid or missing API key
 */
export class AuthenticationError extends CleanSlateError {
  constructor(
    message = "Invalid API key. Check your CLEANSLATE_API_KEY configuration."
  ) {
    super(message, 401);
    this.name = "AuthenticationError";
  }
}

/**
 * Validation error (400)
 * Indicates invalid input data
 */
export class ValidationError extends CleanSlateError {
  constructor(message: string) {
    super(message, 400);
    this.name = "ValidationError";
  }
}

/**
 * Not found error (404)
 * Indicates requested resource doesn't exist
 */
export class NotFoundError extends CleanSlateError {
  constructor(message = "That entry wasn't found. It may have been deleted.") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

/**
 * API error (500)
 * Indicates server-side issue with CleanSlate API
 */
export class ApiError extends CleanSlateError {
  constructor(
    message = "Couldn't complete request right now. Try again in a moment."
  ) {
    super(message, 500);
    this.name = "ApiError";
  }
}

/**
 * Network error
 * Indicates connection or timeout issues
 */
export class NetworkError extends CleanSlateError {
  constructor(message = "Network issue. Check your connection and try again.") {
    super(message);
    this.name = "NetworkError";
  }
}
