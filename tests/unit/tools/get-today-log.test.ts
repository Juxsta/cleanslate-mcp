import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTodayLog } from "../../../src/tools/get-today-log.js";
import { CleanSlateApiClient } from "../../../src/api/endpoints.js";
import { ApiError } from "../../../src/utils/errors.js";

// Mock the API client
vi.mock("../../../src/api/endpoints.js", () => {
  return {
    CleanSlateApiClient: vi.fn(),
  };
});

describe("getTodayLog Tool", () => {
  let mockApiClient: any;

  beforeEach(() => {
    // Create mock API client with getTodayLog method
    mockApiClient = {
      getTodayLog: vi.fn(),
    };
  });

  it("should successfully retrieve today's log with entries", async () => {
    const mockResponse = {
      entries: [
        {
          id: "entry-1",
          name: "Breakfast",
          calories: 300,
          protein: 20,
          timestamp: "2025-10-20T08:00:00Z",
        },
        {
          id: "entry-2",
          name: "Lunch",
          calories: 500,
          protein: 35,
          timestamp: "2025-10-20T12:00:00Z",
        },
      ],
    };

    mockApiClient.getTodayLog.mockResolvedValue(mockResponse);

    const result = await getTodayLog(mockApiClient, {});

    expect(result.success).toBe(true);
    expect(result.entries).toEqual(mockResponse.entries);
    expect(result.count).toBe(2);
    expect(mockApiClient.getTodayLog).toHaveBeenCalled();
  });

  it("should return empty array for empty log (not an error)", async () => {
    const mockResponse = {
      entries: [],
    };

    mockApiClient.getTodayLog.mockResolvedValue(mockResponse);

    const result = await getTodayLog(mockApiClient, {});

    expect(result.success).toBe(true);
    expect(result.entries).toEqual([]);
    expect(result.count).toBe(0);
  });

  it("should handle missing entries field gracefully", async () => {
    const mockResponse = {};

    mockApiClient.getTodayLog.mockResolvedValue(mockResponse);

    const result = await getTodayLog(mockApiClient, {});

    expect(result.success).toBe(true);
    expect(result.entries).toEqual([]);
    expect(result.count).toBe(0);
  });

  it("should handle API errors with judgment-free message", async () => {
    mockApiClient.getTodayLog.mockRejectedValue(new ApiError("API is down"));

    await expect(getTodayLog(mockApiClient, {})).rejects.toThrow(
      "Couldn't load today's log right now. Try again in a moment."
    );
  });
});
