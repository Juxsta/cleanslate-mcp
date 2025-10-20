import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTodaySummary } from "../../../src/tools/get-today-summary.js";
import { CleanSlateApiClient } from "../../../src/api/endpoints.js";
import { ApiError } from "../../../src/utils/errors.js";

// Mock the API client
vi.mock("../../../src/api/endpoints.js", () => {
  return {
    CleanSlateApiClient: vi.fn(),
  };
});

describe("getTodaySummary Tool", () => {
  let mockApiClient: any;

  beforeEach(() => {
    // Create mock API client with getTodaySummary method
    mockApiClient = {
      getTodaySummary: vi.fn(),
    };
  });

  it("should successfully retrieve today's summary with entries", async () => {
    const mockResponse = {
      totalCalories: 800,
      totalProtein: 55,
      entryCount: 2,
    };

    mockApiClient.getTodaySummary.mockResolvedValue(mockResponse);

    const result = await getTodaySummary(mockApiClient, {});

    expect(result.success).toBe(true);
    expect(result.summary).toEqual(mockResponse);
    expect(mockApiClient.getTodaySummary).toHaveBeenCalled();
  });

  it("should return zeros for empty log (not an error)", async () => {
    const mockResponse = {
      totalCalories: 0,
      totalProtein: 0,
      entryCount: 0,
    };

    mockApiClient.getTodaySummary.mockResolvedValue(mockResponse);

    const result = await getTodaySummary(mockApiClient, {});

    expect(result.success).toBe(true);
    expect(result.summary.totalCalories).toBe(0);
    expect(result.summary.totalProtein).toBe(0);
    expect(result.summary.entryCount).toBe(0);
  });

  it("should handle missing fields gracefully", async () => {
    const mockResponse = {};

    mockApiClient.getTodaySummary.mockResolvedValue(mockResponse);

    const result = await getTodaySummary(mockApiClient, {});

    expect(result.success).toBe(true);
    expect(result.summary.totalCalories).toBe(0);
    expect(result.summary.totalProtein).toBe(0);
    expect(result.summary.entryCount).toBe(0);
  });

  it("should handle API errors with judgment-free message", async () => {
    mockApiClient.getTodaySummary.mockRejectedValue(new ApiError("API is down"));

    await expect(getTodaySummary(mockApiClient, {})).rejects.toThrow(
      "Couldn't load today's summary right now. Try again in a moment."
    );
  });
});
