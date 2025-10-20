import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteFoodEntry } from "../../../src/tools/delete-food-entry.js";
import { CleanSlateApiClient } from "../../../src/api/endpoints.js";
import {
  ValidationError,
  NotFoundError,
  ApiError,
} from "../../../src/utils/errors.js";

// Mock the API client
vi.mock("../../../src/api/endpoints.js", () => {
  return {
    CleanSlateApiClient: vi.fn(),
  };
});

describe("deleteFoodEntry Tool", () => {
  let mockApiClient: any;

  beforeEach(() => {
    // Create mock API client with deleteFoodEntry method
    mockApiClient = {
      deleteFoodEntry: vi.fn(),
    };
  });

  it("should successfully delete a food entry with valid UUID", async () => {
    const input = {
      entryId: "123e4567-e89b-12d3-a456-426614174000",
    };

    const mockResponse = {
      success: true,
    };

    mockApiClient.deleteFoodEntry.mockResolvedValue(mockResponse);

    const result = await deleteFoodEntry(mockApiClient, input);

    expect(result.success).toBe(true);
    expect(result.message).toBe("Entry deleted");
    expect(mockApiClient.deleteFoodEntry).toHaveBeenCalledWith(input.entryId);
  });

  it("should throw ValidationError for invalid UUID format", async () => {
    const input = {
      entryId: "not-a-valid-uuid",
    };

    await expect(deleteFoodEntry(mockApiClient, input)).rejects.toThrow(
      ValidationError
    );
  });

  it("should handle NotFoundError with judgment-free message", async () => {
    const input = {
      entryId: "123e4567-e89b-12d3-a456-426614174000",
    };

    mockApiClient.deleteFoodEntry.mockRejectedValue(
      new NotFoundError("Entry not found")
    );

    await expect(deleteFoodEntry(mockApiClient, input)).rejects.toThrow(
      "That entry wasn't found. It may have already been deleted."
    );
  });

  it("should handle API errors gracefully", async () => {
    const input = {
      entryId: "123e4567-e89b-12d3-a456-426614174000",
    };

    mockApiClient.deleteFoodEntry.mockRejectedValue(
      new ApiError("API is down")
    );

    await expect(deleteFoodEntry(mockApiClient, input)).rejects.toThrow(
      "Couldn't delete entry right now. Try again in a moment."
    );
  });
});
