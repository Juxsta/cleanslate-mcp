# GraphQL Implementation Summary

## Overview

The CleanSlate MCP Server has been successfully migrated from REST to GraphQL. All API interactions now use the CleanSlate GraphQL endpoint with the `quick_logs` table.

## Changes Made

### 1. Updated Constants (`src/constants.ts`)

- Changed `DEFAULT_API_BASE_URL` from `https://api.cleanslate.sh/v1` to `https://cleanslate.jinocenc.io/auth/graphql`
- Removed REST endpoint constants (`ENDPOINTS`)
- Added `GRAPHQL_OPERATIONS` constants for operation names

### 2. Rewritten API Client (`src/api/client.ts`)

**Before (REST):**
- HTTP methods: `get()`, `post()`, `patch()`, `delete()`
- HTTP status code error handling
- REST endpoint construction

**After (GraphQL):**
- Single method: `executeGraphQL<T>(query, variables)`
- GraphQL error handling (both HTTP and GraphQL-level errors)
- POST requests with JSON body containing `query` and `variables`

**Key Features:**
- Automatic retry logic (preserved from REST)
- Timeout handling (preserved from REST)
- Bearer token authentication (preserved from REST)
- Judgment-free error messages (preserved from REST)
- GraphQL-specific error mapping (new)

### 3. Rewritten API Endpoints (`src/api/endpoints.ts`)

All CRUD operations now use GraphQL mutations and queries:

#### Create Food Entry
```graphql
mutation CREATE_QUICK_LOG($object: quick_logs_insert_input!) {
  insert_quick_logs_one(object: $object) {
    id name calories protein createdAt
  }
}
```

#### Get Today's Log
```graphql
query GET_TODAY_LOGS($today: timestamptz, $tomorrow: timestamptz) {
  quick_logs(where: { createdAt: { _gte: $today, _lte: $tomorrow } }) {
    id name calories protein createdAt
  }
}
```

#### Update Food Entry
```graphql
mutation UPDATE_QUICK_LOG(
  $pk_columns: quick_logs_pk_columns_input!
  $set: quick_logs_set_input
) {
  update_quick_logs_by_pk(pk_columns: $pk_columns, _set: $set) {
    id name calories protein createdAt
  }
}
```

#### Delete Food Entry
```graphql
mutation DELETE_QUICK_LOG($id: uuid!) {
  delete_quick_logs_by_pk(id: $id) { id }
}
```

#### Get Today's Summary
- Now calculated **client-side** by fetching all entries and reducing
- Sums `calories` and `protein` from all entries

**Helper Functions:**
- `mapQuickLogToFoodEntry()`: Converts GraphQL response to `FoodEntry` type
- `getTodayTimestamps()`: Generates today/tomorrow ISO timestamps for date filtering

### 4. Updated Types (`src/types/api.ts`)

**New GraphQL Types:**
- `GraphQLRequest`: Structure for GraphQL requests
- `GraphQLResponse<T>`: Structure for GraphQL responses
- `GraphQLError`: GraphQL error structure
- `QuickLogData`: Maps to `quick_logs` table schema
- `CreateQuickLogData`, `UpdateQuickLogData`, `DeleteQuickLogData`, `GetQuickLogsData`: Operation-specific response types

**Preserved Types:**
- All existing request/response interfaces remain the same for backward compatibility
- Tools and MCP handlers continue to use the same interfaces

### 5. Updated Tests

**Client Tests (`tests/unit/api/client.test.ts`):**
- Tests GraphQL query/mutation execution
- Tests GraphQL-level error handling (errors array)
- Tests HTTP-level error handling (status codes)
- Tests retry logic with GraphQL responses

**Endpoints Tests (`tests/unit/api/endpoints.test.ts`):**
- Tests all CRUD operations with mocked GraphQL responses
- Validates GraphQL query/mutation structure in request body
- Tests date filtering with ISO timestamps
- Tests client-side summary calculation

**All 76 tests pass successfully**

## Technical Details

### GraphQL Request Format
```typescript
{
  query: string,      // GraphQL query or mutation string
  variables: object   // Variables for the query/mutation
}
```

### GraphQL Response Format
```typescript
{
  data?: object,      // Successful response data
  errors?: Array<{    // GraphQL errors (if any)
    message: string,
    locations?: Array<{ line: number, column: number }>,
    path?: string[],
    extensions?: object
  }>
}
```

### Error Handling Strategy

1. **HTTP-level errors** (401, 403, 500): Handled via response status
2. **GraphQL-level errors**: Detected via `errors` array in response
3. **Error mapping**: GraphQL error messages mapped to appropriate error classes:
   - "unauthorized", "forbidden", "authentication" → `AuthenticationError`
   - "invalid", "validation", "constraint" → `ValidationError`
   - "not found" → `NotFoundError`
   - Others → `ApiError`

### Date Filtering

The `getTodayLog()` method filters entries by `createdAt` field using:
- `$today`: Start of current day (00:00:00 in local timezone)
- `$tomorrow`: Start of next day (00:00:00 in local timezone)

Uses ISO 8601 format with timezone offset.

## Benefits of GraphQL Migration

1. **Correct API Usage**: Now using the actual CleanSlate API (not a non-existent REST API)
2. **Simple Data Model**: Using `quick_logs` table (calories/protein only) instead of complex `logs` table
3. **Flexible Queries**: GraphQL allows requesting only needed fields
4. **Single Endpoint**: All operations go through one GraphQL endpoint
5. **No External Dependencies**: Using native `fetch` with POST requests (no GraphQL client library needed)

## Backward Compatibility

The migration maintains **100% backward compatibility** at the tool/MCP level:
- All MCP tools continue to work with the same interfaces
- Response formats remain unchanged
- Error handling preserves judgment-free messages
- All existing tests pass without modification (only API layer tests updated)

## Testing

Run tests:
```bash
pnpm test
```

All 76 tests pass:
- 13 test files
- 76 individual tests
- 100% pass rate

Build:
```bash
pnpm build
```

TypeScript compilation succeeds with no errors.
