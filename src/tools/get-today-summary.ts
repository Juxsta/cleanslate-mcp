import { CleanSlateApiClient } from "../api/endpoints.js";
import { GetTodaySummarySchema } from "../utils/validation.js";
import type { GetTodaySummaryOutput } from "../types/mcp.js";
import {
  AuthenticationError,
  NetworkError,
  ApiError,
} from "../utils/errors.js";

/**
 * Get today's summary (total calories and protein)
 * Returns zeros if no entries (not an error)
 */
export async function getTodaySummary(
  apiClient: CleanSlateApiClient,
  input: unknown
): Promise<GetTodaySummaryOutput> {
  try {
    // Validate input (empty object expected)
    GetTodaySummarySchema.parse(input);

    // Call API to get today's summary
    const response = await apiClient.getTodaySummary();

    // Return success response with summary
    // Empty log returns zeros (not an error)
    return {
      success: true,
      summary: {
        totalCalories: response.totalCalories || 0,
        totalProtein: response.totalProtein || 0,
        entryCount: response.entryCount || 0,
      },
    };
  } catch (error) {
    // Handle authentication errors
    if (error instanceof AuthenticationError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof NetworkError) {
      throw new NetworkError(
        "Couldn't load today's summary right now. Check your connection and try again."
      );
    }

    // Handle API errors
    if (error instanceof ApiError) {
      throw new ApiError(
        "Couldn't load today's summary right now. Try again in a moment."
      );
    }

    // Handle unknown errors
    throw new ApiError(
      "Couldn't load today's summary right now. Try again in a moment."
    );
  }
}
