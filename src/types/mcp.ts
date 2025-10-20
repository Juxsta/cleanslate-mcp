import { FoodEntry } from "./food-entry.js";

/** Input for the log_food MCP tool */
export interface LogFoodInput {
  name: string;
  calories: number;
  protein: number;
}

/** Output from the log_food MCP tool */
export interface LogFoodOutput {
  success: boolean;
  entry: FoodEntry;
  message: string;
}

/** Output from the get_today_log MCP tool */
export interface GetTodayLogOutput {
  success: boolean;
  entries: FoodEntry[];
  count: number;
}

/** Input for the delete_food_entry MCP tool */
export interface DeleteFoodEntryInput {
  entryId: string;
}

/** Output from the delete_food_entry MCP tool */
export interface DeleteFoodEntryOutput {
  success: boolean;
  message: string;
}

/** Input for the edit_food_entry MCP tool */
export interface EditFoodEntryInput {
  entryId: string;
  name?: string;
  calories?: number;
  protein?: number;
}

/** Output from the edit_food_entry MCP tool */
export interface EditFoodEntryOutput {
  success: boolean;
  entry: FoodEntry;
  message: string;
}

/** Output from the get_today_summary MCP tool */
export interface GetTodaySummaryOutput {
  success: boolean;
  summary: {
    totalCalories: number;
    totalProtein: number;
    entryCount: number;
  };
}
