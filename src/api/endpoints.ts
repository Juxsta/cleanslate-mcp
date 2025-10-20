import { CleanSlateClient } from "./client.js";
import type {
  CreateFoodEntryRequest,
  CreateFoodEntryResponse,
  GetTodayLogResponse,
  DeleteFoodEntryResponse,
  UpdateFoodEntryRequest,
  UpdateFoodEntryResponse,
  TodaySummaryResponse,
  CreateQuickLogData,
  UpdateQuickLogData,
  DeleteQuickLogData,
  GetQuickLogsData,
  QuickLogData,
} from "../types/api.js";
import type { FoodEntry } from "../types/food-entry.js";

/**
 * Convert QuickLogData from GraphQL to FoodEntry format
 */
function mapQuickLogToFoodEntry(log: QuickLogData): FoodEntry {
  return {
    id: log.id,
    name: log.name,
    calories: log.calories,
    protein: log.protein,
    timestamp: log.createdAt,
  };
}

/**
 * Get start and end timestamps for today in ISO format
 */
function getTodayTimestamps(): { today: string; tomorrow: string } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    today: today.toISOString(),
    tomorrow: tomorrow.toISOString(),
  };
}

/**
 * CleanSlate API client with all GraphQL endpoint methods
 */
export class CleanSlateApiClient extends CleanSlateClient {
  /**
   * Create a new food entry using quick_logs
   */
  async createFoodEntry(
    data: CreateFoodEntryRequest
  ): Promise<CreateFoodEntryResponse> {
    const query = `
      mutation CREATE_QUICK_LOG($object: quick_logs_insert_input!) {
        insert_quick_logs_one(object: $object) {
          id
          name
          calories
          protein
          createdAt
        }
      }
    `;

    const variables = {
      object: {
        name: data.name,
        calories: data.calories,
        protein: data.protein,
      },
    };

    const result = await this.executeGraphQL<CreateQuickLogData>(
      query,
      variables
    );

    return {
      entry: mapQuickLogToFoodEntry(result.insert_quick_logs_one),
    };
  }

  /**
   * Get all food entries for today
   */
  async getTodayLog(): Promise<GetTodayLogResponse> {
    const { today, tomorrow } = getTodayTimestamps();

    const query = `
      query GET_TODAY_LOGS($today: timestamptz, $tomorrow: timestamptz) {
        quick_logs(where: { createdAt: { _gte: $today, _lte: $tomorrow } }) {
          id
          name
          calories
          protein
          createdAt
        }
      }
    `;

    const variables = {
      today,
      tomorrow,
    };

    const result = await this.executeGraphQL<GetQuickLogsData>(query, variables);

    return {
      entries: result.quick_logs.map(mapQuickLogToFoodEntry),
    };
  }

  /**
   * Delete a specific food entry
   */
  async deleteFoodEntry(entryId: string): Promise<DeleteFoodEntryResponse> {
    const query = `
      mutation DELETE_QUICK_LOG($id: uuid!) {
        delete_quick_logs_by_pk(id: $id) {
          id
        }
      }
    `;

    const variables = {
      id: entryId,
    };

    await this.executeGraphQL<DeleteQuickLogData>(query, variables);

    return {
      success: true,
    };
  }

  /**
   * Update an existing food entry
   */
  async updateFoodEntry(
    entryId: string,
    updates: UpdateFoodEntryRequest
  ): Promise<UpdateFoodEntryResponse> {
    const query = `
      mutation UPDATE_QUICK_LOG(
        $pk_columns: quick_logs_pk_columns_input!
        $set: quick_logs_set_input
      ) {
        update_quick_logs_by_pk(pk_columns: $pk_columns, _set: $set) {
          id
          name
          calories
          protein
          createdAt
        }
      }
    `;

    const variables = {
      pk_columns: {
        id: entryId,
      },
      set: updates,
    };

    const result = await this.executeGraphQL<UpdateQuickLogData>(
      query,
      variables
    );

    return {
      entry: mapQuickLogToFoodEntry(result.update_quick_logs_by_pk),
    };
  }

  /**
   * Get today's summary (totals) - calculated client-side
   */
  async getTodaySummary(): Promise<TodaySummaryResponse> {
    const { entries } = await this.getTodayLog();

    const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);
    const totalProtein = entries.reduce((sum, entry) => sum + entry.protein, 0);

    return {
      totalCalories,
      totalProtein,
      entryCount: entries.length,
    };
  }
}
