/**
 * Authentication Handler
 *
 * Handles API authentication using Bearer token in Authorization header.
 * All CleanSlate API requests require authentication.
 */

import { AuthenticationError } from "../utils/errors.js";

/**
 * Configuration for authentication
 */
export interface AuthConfig {
  /**
   * CleanSlate API key
   */
  apiKey: string;
}

/**
 * Creates authentication headers for API requests
 *
 * @param config - Authentication configuration
 * @returns Headers object with Authorization header
 * @throws {AuthenticationError} If API key is missing or invalid
 */
export function createAuthHeaders(config: AuthConfig): Record<string, string> {
  if (!config.apiKey || config.apiKey.trim().length === 0) {
    throw new AuthenticationError(
      "API key is required. Set CLEANSLATE_API_KEY environment variable."
    );
  }

  return {
    Authorization: `Bearer ${config.apiKey}`,
  };
}

/**
 * Validates that an API key is properly formatted
 *
 * @param apiKey - API key to validate
 * @returns true if valid
 * @throws {AuthenticationError} If API key is invalid
 */
export function validateApiKey(apiKey: string): boolean {
  if (!apiKey || typeof apiKey !== "string") {
    throw new AuthenticationError(
      "API key must be a non-empty string. Check your CLEANSLATE_API_KEY configuration."
    );
  }

  if (apiKey.trim().length === 0) {
    throw new AuthenticationError(
      "API key cannot be empty. Check your CLEANSLATE_API_KEY configuration."
    );
  }

  return true;
}
