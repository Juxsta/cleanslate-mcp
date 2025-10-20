import { describe, it, expect, beforeEach, vi } from "vitest";
import { CleanSlateApiClient } from "../../src/api/endpoints.js";
import { logFood } from "../../src/tools/log-food.js";
import {
  AuthenticationError,
  ValidationError,
  ApiError,
  NetworkError,
} from "../../src/utils/errors.js";

describe("Error Handling Tests", () => {
  let mockApiClient: any;

  beforeEach(() => {
    mockApiClient = {
      createFoodEntry: vi.fn(),
      getTodayLog: vi.fn(),
      deleteFoodEntry: vi.fn(),
      updateFoodEntry: vi.fn(),
      getTodaySummary: vi.fn(),
    };
  });

  it("should handle authentication failure with judgment-free message", async () => {
    const authError = new AuthenticationError();

    mockApiClient.createFoodEntry.mockRejectedValue(authError);

    // Tool re-throws AuthenticationError as-is
    await expect(
      logFood(mockApiClient, {
        name: "Test Food",
        calories: 100,
        protein: 10,
      })
    ).rejects.toThrow(AuthenticationError);
  });

  it("should handle network timeout with judgment-free message", async () => {
    const networkError = new NetworkError();

    mockApiClient.createFoodEntry.mockRejectedValue(networkError);

    // Tool wraps NetworkError with judgment-free message
    await expect(
      logFood(mockApiClient, {
        name: "Test Food",
        calories: 100,
        protein: 10,
      })
    ).rejects.toThrow("Couldn't save entry right now. Check your connection");
  });

  it("should handle malformed API responses gracefully", async () => {
    // API returns unexpected format
    mockApiClient.createFoodEntry.mockResolvedValue({
      // Missing 'entry' field
      wrongField: "unexpected",
    });

    // Tool should handle this and either throw or return safe error
    const result = await logFood(mockApiClient, {
      name: "Test Food",
      calories: 100,
      protein: 10,
    });

    // Result should be defined even if API response is malformed
    expect(result).toBeDefined();
  });

  it("should ensure validation errors maintain judgment-free tone", async () => {
    // Test that validation error messages are judgment-free
    await expect(
      logFood(mockApiClient, {
        name: "", // Empty name
        calories: 100,
        protein: 10,
      })
    ).rejects.toThrow(ValidationError);

    // Verify the error message is judgment-free (no "invalid", "wrong", "bad")
    try {
      await logFood(mockApiClient, {
        name: "",
        calories: 100,
        protein: 10,
      });
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message.toLowerCase();
        // Message should be constructive, not judgmental
        expect(message).toContain("required");
        expect(message).not.toContain("invalid");
        expect(message).not.toContain("wrong");
        expect(message).not.toContain("bad");
      }
    }
  });

  it("should handle API errors with helpful retry message", async () => {
    const apiError = new ApiError();

    mockApiClient.createFoodEntry.mockRejectedValue(apiError);

    // Tool wraps ApiError with judgment-free message
    await expect(
      logFood(mockApiClient, {
        name: "Test Food",
        calories: 100,
        protein: 10,
      })
    ).rejects.toThrow("Couldn't save entry right now. Try again in a moment");
  });
});
