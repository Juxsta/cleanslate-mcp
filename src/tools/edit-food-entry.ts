import { z } from "zod";
import { CleanSlateApiClient } from "../api/endpoints.js";
import { EditFoodEntrySchema } from "../utils/validation.js";
import type { EditFoodEntryInput, EditFoodEntryOutput } from "../types/mcp.js";
import {
  ValidationError,
  NotFoundError,
  AuthenticationError,
  NetworkError,
  ApiError,
} from "../utils/errors.js";

/**
 * Edit an existing food entry
 * Requires at least one field to update (validated by schema)
 */
export async function editFoodEntry(
  apiClient: CleanSlateApiClient,
  input: unknown
): Promise<EditFoodEntryOutput> {
  try {
    // Validate input using Zod schema (includes refinement for at least one field)
    const validatedInput = EditFoodEntrySchema.parse(
      input
    ) as EditFoodEntryInput;

    // Build update payload (only include provided fields)
    const updates: {
      name?: string;
      calories?: number;
      protein?: number;
    } = {};

    if (validatedInput.name !== undefined) {
      updates.name = validatedInput.name;
    }
    if (validatedInput.calories !== undefined) {
      updates.calories = validatedInput.calories;
    }
    if (validatedInput.protein !== undefined) {
      updates.protein = validatedInput.protein;
    }

    // Call API to update food entry
    const response = await apiClient.updateFoodEntry(
      validatedInput.entryId,
      updates
    );

    // Return success response with updated entry
    return {
      success: true,
      entry: response.entry,
      message: "Entry updated",
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
        "That entry wasn't found. It may have been deleted."
      );
    }

    // Handle network errors
    if (error instanceof NetworkError) {
      throw new NetworkError(
        "Couldn't update entry right now. Check your connection and try again."
      );
    }

    // Handle API errors
    if (error instanceof ApiError) {
      throw new ApiError(
        "Couldn't update entry right now. Try again in a moment."
      );
    }

    // Handle unknown errors
    throw new ApiError(
      "Couldn't update entry right now. Try again in a moment."
    );
  }
}
