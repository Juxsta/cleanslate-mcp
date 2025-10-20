import { z } from "zod";
import { CleanSlateApiClient } from "../api/endpoints.js";
import { DeleteFoodEntrySchema } from "../utils/validation.js";
import type {
  DeleteFoodEntryInput,
  DeleteFoodEntryOutput,
} from "../types/mcp.js";
import {
  ValidationError,
  NotFoundError,
  AuthenticationError,
  NetworkError,
  ApiError,
} from "../utils/errors.js";

/**
 * Delete a food entry from today's log
 * Returns judgment-free message if entry not found
 */
export async function deleteFoodEntry(
  apiClient: CleanSlateApiClient,
  input: unknown
): Promise<DeleteFoodEntryOutput> {
  try {
    // Validate input using Zod schema
    const validatedInput = DeleteFoodEntrySchema.parse(
      input
    ) as DeleteFoodEntryInput;

    // Call API to delete food entry
    await apiClient.deleteFoodEntry(validatedInput.entryId);

    // Return success response
    return {
      success: true,
      message: "Entry deleted",
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

    // Handle not found errors with judgment-free message
    if (error instanceof NotFoundError) {
      throw new NotFoundError(
        "That entry wasn't found. It may have already been deleted."
      );
    }

    // Handle network errors
    if (error instanceof NetworkError) {
      throw new NetworkError(
        "Couldn't delete entry right now. Check your connection and try again."
      );
    }

    // Handle API errors
    if (error instanceof ApiError) {
      throw new ApiError(
        "Couldn't delete entry right now. Try again in a moment."
      );
    }

    // Handle unknown errors
    throw new ApiError(
      "Couldn't delete entry right now. Try again in a moment."
    );
  }
}
