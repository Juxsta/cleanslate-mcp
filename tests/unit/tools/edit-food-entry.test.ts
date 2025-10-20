import { describe, it, expect, vi, beforeEach } from "vitest";
import { editFoodEntry } from "../../../src/tools/edit-food-entry.js";
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

describe("editFoodEntry Tool", () => {
  let mockApiClient: any;

  beforeEach(() => {
    // Create mock API client with updateFoodEntry method
    mockApiClient = {
      updateFoodEntry: vi.fn(),
    };
  });

  it("should successfully update calories", async () => {
    const input = {
      entryId: "123e4567-e89b-12d3-a456-426614174000",
      calories: 200,
    };

    const mockResponse = {
      entry: {
        id: input.entryId,
        name: "Chicken breast",
        calories: 200,
        protein: 31,
        timestamp: "2025-10-20T14:30:00Z",
      },
    };

    mockApiClient.updateFoodEntry.mockResolvedValue(mockResponse);

    const result = await editFoodEntry(mockApiClient, input);

    expect(result.success).toBe(true);
    expect(result.entry).toEqual(mockResponse.entry);
    expect(result.message).toBe("Entry updated");
    expect(mockApiClient.updateFoodEntry).toHaveBeenCalledWith(input.entryId, {
      calories: 200,
    });
  });

  it("should successfully update protein", async () => {
    const input = {
      entryId: "123e4567-e89b-12d3-a456-426614174000",
      protein: 35,
    };

    const mockResponse = {
      entry: {
        id: input.entryId,
        name: "Chicken breast",
        calories: 165,
        protein: 35,
        timestamp: "2025-10-20T14:30:00Z",
      },
    };

    mockApiClient.updateFoodEntry.mockResolvedValue(mockResponse);

    const result = await editFoodEntry(mockApiClient, input);

    expect(result.success).toBe(true);
    expect(mockApiClient.updateFoodEntry).toHaveBeenCalledWith(input.entryId, {
      protein: 35,
    });
  });

  it("should successfully update name", async () => {
    const input = {
      entryId: "123e4567-e89b-12d3-a456-426614174000",
      name: "Grilled chicken breast",
    };

    const mockResponse = {
      entry: {
        id: input.entryId,
        name: "Grilled chicken breast",
        calories: 165,
        protein: 31,
        timestamp: "2025-10-20T14:30:00Z",
      },
    };

    mockApiClient.updateFoodEntry.mockResolvedValue(mockResponse);

    const result = await editFoodEntry(mockApiClient, input);

    expect(result.success).toBe(true);
    expect(mockApiClient.updateFoodEntry).toHaveBeenCalledWith(input.entryId, {
      name: "Grilled chicken breast",
    });
  });

  it("should throw ValidationError when no fields provided", async () => {
    const input = {
      entryId: "123e4567-e89b-12d3-a456-426614174000",
    };

    await expect(editFoodEntry(mockApiClient, input)).rejects.toThrow(
      ValidationError
    );
  });

  it("should handle NotFoundError with judgment-free message", async () => {
    const input = {
      entryId: "123e4567-e89b-12d3-a456-426614174000",
      calories: 200,
    };

    mockApiClient.updateFoodEntry.mockRejectedValue(
      new NotFoundError("Entry not found")
    );

    await expect(editFoodEntry(mockApiClient, input)).rejects.toThrow(
      "That entry wasn't found. It may have been deleted."
    );
  });

  it("should handle API errors gracefully", async () => {
    const input = {
      entryId: "123e4567-e89b-12d3-a456-426614174000",
      calories: 200,
    };

    mockApiClient.updateFoodEntry.mockRejectedValue(
      new ApiError("API is down")
    );

    await expect(editFoodEntry(mockApiClient, input)).rejects.toThrow(
      "Couldn't update entry right now. Try again in a moment."
    );
  });
});
