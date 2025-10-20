import { CleanSlateClient } from "./client.js";
import { ENDPOINTS } from "../constants.js";
import type {
  CreateFoodEntryRequest,
  CreateFoodEntryResponse,
  GetTodayLogResponse,
  DeleteFoodEntryResponse,
  UpdateFoodEntryRequest,
  UpdateFoodEntryResponse,
  TodaySummaryResponse,
} from "../types/api.js";

/**
 * CleanSlate API client with all endpoint methods
 */
export class CleanSlateApiClient extends CleanSlateClient {
  /**
   * Create a new food entry
   */
  async createFoodEntry(
    data: CreateFoodEntryRequest
  ): Promise<CreateFoodEntryResponse> {
    return this.post<CreateFoodEntryResponse>(ENDPOINTS.FOOD_ENTRIES, data);
  }

  /**
   * Get all food entries for today
   */
  async getTodayLog(): Promise<GetTodayLogResponse> {
    return this.get<GetTodayLogResponse>(ENDPOINTS.FOOD_ENTRIES_TODAY);
  }

  /**
   * Delete a specific food entry
   */
  async deleteFoodEntry(entryId: string): Promise<DeleteFoodEntryResponse> {
    return this.delete<DeleteFoodEntryResponse>(
      ENDPOINTS.FOOD_ENTRY_BY_ID(entryId)
    );
  }

  /**
   * Update an existing food entry
   */
  async updateFoodEntry(
    entryId: string,
    updates: UpdateFoodEntryRequest
  ): Promise<UpdateFoodEntryResponse> {
    return this.patch<UpdateFoodEntryResponse>(
      ENDPOINTS.FOOD_ENTRY_BY_ID(entryId),
      updates
    );
  }

  /**
   * Get today's summary (totals)
   */
  async getTodaySummary(): Promise<TodaySummaryResponse> {
    return this.get<TodaySummaryResponse>(ENDPOINTS.FOOD_ENTRIES_TODAY_SUMMARY);
  }
}
