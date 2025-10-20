import { FoodEntry } from "./food-entry.js";

/** GraphQL request structure for /auth/graphql endpoint */
export interface GraphQLRequest {
  token: string;
  query: string;
  variables?: Record<string, unknown>;
}

/** GraphQL response structure */
export interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

/** GraphQL error structure */
export interface GraphQLError {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: string[];
  extensions?: Record<string, unknown>;
}

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

/** GraphQL quick_logs table response structure */
export interface QuickLogData {
  id: string;
  name: string;
  calories: number;
  protein: number;
  createdAt: string;
  updatedAt?: string;
  consumed?: string;
  meal?: string;
  type?: string;
  profile?: string;
}

/** GraphQL mutation response for creating a quick log */
export interface CreateQuickLogData {
  insert_quick_logs_one: QuickLogData;
}

/** GraphQL mutation response for updating a quick log */
export interface UpdateQuickLogData {
  update_quick_logs_by_pk: QuickLogData;
}

/** GraphQL mutation response for deleting a quick log */
export interface DeleteQuickLogData {
  delete_quick_logs_by_pk: {
    id: string;
  };
}

/** GraphQL query response for getting quick logs */
export interface GetQuickLogsData {
  quick_logs: QuickLogData[];
}
