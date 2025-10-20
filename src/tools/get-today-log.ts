import { CleanSlateApiClient } from "../api/endpoints.js";
import { GetTodayLogSchema } from "../utils/validation.js";
import type { GetTodayLogOutput } from "../types/mcp.js";
import {
  AuthenticationError,
  NetworkError,
  ApiError,
} from "../utils/errors.js";

/**
 * Get all food entries for today
 * Returns empty array if no entries (not an error)
 */
export async function getTodayLog(
  apiClient: CleanSlateApiClient,
  input: unknown
): Promise<GetTodayLogOutput> {
  try {
    // Validate input (empty object expected)
    GetTodayLogSchema.parse(input);

    // Call API to get today's log
    const response = await apiClient.getTodayLog();

    // Return success response with entries
    // Empty log is NOT an error - return empty array
    return {
      success: true,
      entries: response.entries || [],
      count: response.entries?.length || 0,
    };
  } catch (error) {
    // Handle authentication errors
    if (error instanceof AuthenticationError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof NetworkError) {
      throw new NetworkError(
        "Couldn't load today's log right now. Check your connection and try again."
      );
    }

    // Handle API errors
    if (error instanceof ApiError) {
      throw new ApiError(
        "Couldn't load today's log right now. Try again in a moment."
      );
    }

    // Handle unknown errors
    throw new ApiError(
      "Couldn't load today's log right now. Try again in a moment."
    );
  }
}
