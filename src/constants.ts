/**
 * Application-wide constants
 */

/** Default CleanSlate API base URL */
export const DEFAULT_API_BASE_URL = "https://api.cleanslate.sh/v1";

/** Default HTTP request timeout in milliseconds */
export const REQUEST_TIMEOUT_MS = 10000;

/** Default maximum retry attempts for failed requests */
export const MAX_RETRIES = 1;

/** API endpoint paths */
export const ENDPOINTS = {
  FOOD_ENTRIES: "/food-entries",
  FOOD_ENTRIES_TODAY: "/food-entries/today",
  FOOD_ENTRIES_TODAY_SUMMARY: "/food-entries/today/summary",
  FOOD_ENTRY_BY_ID: (id: string) => `/food-entries/${id}`,
} as const;

/** HTTP status codes */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
