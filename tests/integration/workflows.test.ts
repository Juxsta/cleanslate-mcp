import { describe, it, expect, beforeEach, vi } from "vitest";
import { CleanSlateApiClient } from "../../src/api/endpoints.js";
import { logFood } from "../../src/tools/log-food.js";
import { getTodayLog } from "../../src/tools/get-today-log.js";
import { editFoodEntry } from "../../src/tools/edit-food-entry.js";
import { deleteFoodEntry } from "../../src/tools/delete-food-entry.js";
import { getTodaySummary } from "../../src/tools/get-today-summary.js";

describe("End-to-End Workflow Tests", () => {
  let mockApiClient: any;

  beforeEach(() => {
    // Create mock API client for all workflow tests
    mockApiClient = {
      createFoodEntry: vi.fn(),
      getTodayLog: vi.fn(),
      deleteFoodEntry: vi.fn(),
      updateFoodEntry: vi.fn(),
      getTodaySummary: vi.fn(),
    };
  });

  it("should complete workflow: log food → get log → verify entry appears", async () => {
    // Step 1: Log a food entry
    const loggedEntry = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Grilled Chicken",
      calories: 200,
      protein: 35,
      timestamp: "2025-10-20T12:00:00Z",
    };

    mockApiClient.createFoodEntry.mockResolvedValue({
      entry: loggedEntry,
    });

    const logResult = await logFood(mockApiClient, {
      name: "Grilled Chicken",
      calories: 200,
      protein: 35,
    });

    expect(logResult.success).toBe(true);
    expect(logResult.entry.name).toBe("Grilled Chicken");

    // Step 2: Get today's log
    mockApiClient.getTodayLog.mockResolvedValue({
      entries: [loggedEntry],
    });

    const logResults = await getTodayLog(mockApiClient, {});

    expect(logResults.success).toBe(true);
    expect(logResults.entries).toHaveLength(1);
    expect(logResults.entries[0].id).toBe(
      "123e4567-e89b-12d3-a456-426614174000"
    );
    expect(logResults.entries[0].name).toBe("Grilled Chicken");
  });

  it("should complete workflow: log food → edit entry → verify changes", async () => {
    // Step 1: Log a food entry
    const originalEntry = {
      id: "223e4567-e89b-12d3-a456-426614174001",
      name: "Chicken Breast",
      calories: 165,
      protein: 31,
      timestamp: "2025-10-20T12:00:00Z",
    };

    mockApiClient.createFoodEntry.mockResolvedValue({
      entry: originalEntry,
    });

    const logResult = await logFood(mockApiClient, {
      name: "Chicken Breast",
      calories: 165,
      protein: 31,
    });

    expect(logResult.success).toBe(true);

    // Step 2: Edit the entry (using valid UUID)
    const updatedEntry = {
      ...originalEntry,
      calories: 180,
      protein: 35,
    };

    mockApiClient.updateFoodEntry.mockResolvedValue({
      entry: updatedEntry,
    });

    const editResult = await editFoodEntry(mockApiClient, {
      entryId: "223e4567-e89b-12d3-a456-426614174001",
      calories: 180,
      protein: 35,
    });

    expect(editResult.success).toBe(true);
    expect(editResult.entry.calories).toBe(180);
    expect(editResult.entry.protein).toBe(35);
  });

  it("should complete workflow: log food → delete entry → verify removal", async () => {
    // Step 1: Log a food entry
    const entryToDelete = {
      id: "323e4567-e89b-12d3-a456-426614174002",
      name: "Test Food",
      calories: 100,
      protein: 10,
      timestamp: "2025-10-20T12:00:00Z",
    };

    mockApiClient.createFoodEntry.mockResolvedValue({
      entry: entryToDelete,
    });

    const logResult = await logFood(mockApiClient, {
      name: "Test Food",
      calories: 100,
      protein: 10,
    });

    expect(logResult.success).toBe(true);

    // Step 2: Delete the entry (using valid UUID)
    mockApiClient.deleteFoodEntry.mockResolvedValue({
      success: true,
    });

    const deleteResult = await deleteFoodEntry(mockApiClient, {
      entryId: "323e4567-e89b-12d3-a456-426614174002",
    });

    expect(deleteResult.success).toBe(true);

    // Step 3: Verify entry is gone
    mockApiClient.getTodayLog.mockResolvedValue({
      entries: [],
    });

    const logAfterDelete = await getTodayLog(mockApiClient, {});

    expect(logAfterDelete.entries).toHaveLength(0);
  });

  it("should complete workflow: log multiple foods → get summary → verify totals", async () => {
    // Step 1: Log first food
    mockApiClient.createFoodEntry.mockResolvedValueOnce({
      entry: {
        id: "423e4567-e89b-12d3-a456-426614174003",
        name: "Eggs",
        calories: 140,
        protein: 12,
        timestamp: "2025-10-20T08:00:00Z",
      },
    });

    const firstLog = await logFood(mockApiClient, {
      name: "Eggs",
      calories: 140,
      protein: 12,
    });

    expect(firstLog.success).toBe(true);

    // Step 2: Log second food
    mockApiClient.createFoodEntry.mockResolvedValueOnce({
      entry: {
        id: "523e4567-e89b-12d3-a456-426614174004",
        name: "Chicken",
        calories: 165,
        protein: 31,
        timestamp: "2025-10-20T12:00:00Z",
      },
    });

    const secondLog = await logFood(mockApiClient, {
      name: "Chicken",
      calories: 165,
      protein: 31,
    });

    expect(secondLog.success).toBe(true);

    // Step 3: Get summary
    mockApiClient.getTodaySummary.mockResolvedValue({
      totalCalories: 305,
      totalProtein: 43,
      entryCount: 2,
    });

    const summary = await getTodaySummary(mockApiClient, {});

    expect(summary.success).toBe(true);
    expect(summary.summary.totalCalories).toBe(305);
    expect(summary.summary.totalProtein).toBe(43);
    expect(summary.summary.entryCount).toBe(2);
  });

  it("should handle authentication failure workflow", async () => {
    // Simulate authentication error during log food
    const authError = new Error(
      "Invalid API key. Check your CLEANSLATE_API_KEY configuration."
    );
    authError.name = "AuthenticationError";

    mockApiClient.createFoodEntry.mockRejectedValue(authError);

    // The tool wraps errors, so we expect the judgment-free message
    await expect(
      logFood(mockApiClient, {
        name: "Test Food",
        calories: 100,
        protein: 10,
      })
    ).rejects.toThrow("Couldn't save entry right now");
  });
});
