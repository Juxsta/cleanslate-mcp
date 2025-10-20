import { FoodEntry } from "./food-entry.js";

/** Request payload for creating a new food entry */
export interface CreateFoodEntryRequest {
  name: string;
  calories: number;
  protein: number;
}

/** Response from creating a food entry */
export interface CreateFoodEntryResponse {
  entry: FoodEntry;
}

/** Response from retrieving today's food log */
export interface GetTodayLogResponse {
  entries: FoodEntry[];
}

/** Response from deleting a food entry */
export interface DeleteFoodEntryResponse {
  success: boolean;
}

/** Request payload for updating an existing food entry */
export interface UpdateFoodEntryRequest {
  name?: string;
  calories?: number;
  protein?: number;
}

/** Response from updating a food entry */
export interface UpdateFoodEntryResponse {
  entry: FoodEntry;
}

/** Response from getting today's summary */
export interface TodaySummaryResponse {
  totalCalories: number;
  totalProtein: number;
  entryCount: number;
}

/** API error response structure */
export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}
