import { describe, it, expect, vi, beforeEach } from "vitest";
import { logFood } from "../../../src/tools/log-food.js";
import { CleanSlateApiClient } from "../../../src/api/endpoints.js";
import { ValidationError, ApiError } from "../../../src/utils/errors.js";

// Mock the API client
vi.mock("../../../src/api/endpoints.js", () => {
  return {
    CleanSlateApiClient: vi.fn(),
  };
});

describe("logFood Tool", () => {
  let mockApiClient: any;

  beforeEach(() => {
    // Create mock API client with createFoodEntry method
    mockApiClient = {
      createFoodEntry: vi.fn(),
    };
  });

  it("should successfully log a food entry with valid input", async () => {
    const input = {
      name: "Chicken breast",
      calories: 165,
      protein: 31,
    };

    const mockResponse = {
      entry: {
        id: "test-uuid-123",
        name: "Chicken breast",
        calories: 165,
        protein: 31,
        timestamp: "2025-10-20T14:30:00Z",
      },
    };

    mockApiClient.createFoodEntry.mockResolvedValue(mockResponse);

    const result = await logFood(mockApiClient, input);

    expect(result.success).toBe(true);
    expect(result.entry).toEqual(mockResponse.entry);
    expect(result.message).toBe("Added Chicken breast to today's log");
    expect(mockApiClient.createFoodEntry).toHaveBeenCalledWith(input);
  });

  it("should throw ValidationError for invalid calories", async () => {
    const input = {
      name: "Test food",
      calories: 15000, // exceeds max of 10000
      protein: 20,
    };

    await expect(logFood(mockApiClient, input)).rejects.toThrow(
      ValidationError
    );
  });

  it("should throw ValidationError for missing food name", async () => {
    const input = {
      name: "",
      calories: 100,
      protein: 10,
    };

    await expect(logFood(mockApiClient, input)).rejects.toThrow(
      ValidationError
    );
  });

  it("should handle API errors gracefully", async () => {
    const input = {
      name: "Test food",
      calories: 100,
      protein: 10,
    };

    mockApiClient.createFoodEntry.mockRejectedValue(
      new ApiError("API is down")
    );

    await expect(logFood(mockApiClient, input)).rejects.toThrow(
      "Couldn't save entry right now. Try again in a moment."
    );
  });

  it("should validate protein is within range", async () => {
    const input = {
      name: "Test food",
      calories: 100,
      protein: 600, // exceeds max of 500
    };

    await expect(logFood(mockApiClient, input)).rejects.toThrow(
      ValidationError
    );
  });
});
