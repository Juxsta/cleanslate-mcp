/**
 * Application-wide constants
 */

/** Default CleanSlate API GraphQL endpoint (with token-based authentication) */
export const DEFAULT_API_BASE_URL = "https://cleanslate.jinocenc.io/auth/graphql";

/** Default HTTP request timeout in milliseconds */
export const REQUEST_TIMEOUT_MS = 10000;

/** Default maximum retry attempts for failed requests */
export const MAX_RETRIES = 1;

/** GraphQL operation names */
export const GRAPHQL_OPERATIONS = {
  CREATE_QUICK_LOG: "CREATE_QUICK_LOG",
  UPDATE_QUICK_LOG: "UPDATE_QUICK_LOG",
  DELETE_QUICK_LOG: "DELETE_QUICK_LOG",
  GET_TODAY_LOGS: "GET_TODAY_LOGS",
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
