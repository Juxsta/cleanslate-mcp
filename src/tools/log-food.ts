import { z } from "zod";
import { CleanSlateApiClient } from "../api/endpoints.js";
import { LogFoodSchema } from "../utils/validation.js";
import type { LogFoodInput, LogFoodOutput } from "../types/mcp.js";
import {
  ValidationError,
  NotFoundError,
  AuthenticationError,
  NetworkError,
  ApiError,
} from "../utils/errors.js";

/**
 * Log a food entry to today's log
 * Validates input, calls API, and returns judgment-free responses
 */
export async function logFood(
  apiClient: CleanSlateApiClient,
  input: unknown
): Promise<LogFoodOutput> {
  try {
    // Validate input using Zod schema
    const validatedInput = LogFoodSchema.parse(input) as LogFoodInput;

    // Call API to create food entry
    const response = await apiClient.createFoodEntry({
      name: validatedInput.name,
      calories: validatedInput.calories,
      protein: validatedInput.protein,
    });

    // Return success response with entry details
    return {
      success: true,
      entry: response.entry,
      message: `Added ${validatedInput.name} to today's log`,
    };
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      throw new ValidationError(firstError.message);
    }

    // Handle authentication errors
    if (error instanceof AuthenticationError) {
      throw error;
    }

    // Handle not found errors
    if (error instanceof NotFoundError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof NetworkError) {
      throw new NetworkError(
        "Couldn't save entry right now. Check your connection and try again."
      );
    }

    // Handle API errors
    if (error instanceof ApiError) {
      throw new ApiError(
        "Couldn't save entry right now. Try again in a moment."
      );
    }

    // Handle unknown errors
    throw new ApiError("Couldn't save entry right now. Try again in a moment.");
  }
}
