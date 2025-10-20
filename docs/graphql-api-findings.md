# CleanSlate GraphQL API Research

## Overview

CleanSlate uses a **GraphQL API** (not REST) with the following endpoint:
- **Endpoint**: `https://cleanslate.jinocenc.io/auth/graphql`
- **Method**: POST
- **Content-Type**: application/json
- **Authentication**: Bearer token in Authorization header

## Quick Logs Schema

CleanSlate has two types of food logging:
1. **`logs`** - For basic foods and recipes (complex)
2. **`quick_logs`** - For quick entry with calories/protein only (PERFECT FOR US!)

### quick_logs Table Schema

```graphql
fragment quick_log on quick_logs {
  id              # UUID
  createdAt       # timestamptz
  updatedAt       # timestamptz
  profile         # UUID (user ID)
  protein         # numeric
  calories        # numeric
  name            # text
  consumed        # timestamptz
  meal            # text (optional)
  type            # text (optional)
}
```

## GraphQL Operations

### Mutations

#### Create Quick Log
```graphql
mutation CREATE_QUICK_LOG($object: quick_logs_insert_input!) {
  insert_quick_logs_one(object: $object) {
    ...quick_log
  }
}
```

**Input Object:**
```typescript
{
  name: string
  calories: number
  protein: number
  consumed?: timestamptz  // defaults to now
  meal?: string
  type?: string
  profile?: uuid          // user ID (may be auto-filled by auth)
}
```

#### Update Quick Log
```graphql
mutation UPDATE_LOG(
  $pk_columns: quick_logs_pk_columns_input!
  $set: quick_logs_set_input
) {
  update_quick_logs_by_pk(pk_columns: $pk_columns, _set: $set) {
    ...quick_log
  }
}
```

**PK Columns:**
```typescript
{
  id: uuid
}
```

**Set Input:**
```typescript
{
  name?: string
  calories?: number
  protein?: number
  consumed?: timestamptz
  meal?: string
  type?: string
}
```

#### Delete Quick Log
```graphql
mutation DELETE_QUICK_LOG($id: uuid!) {
  delete_quick_logs_by_pk(id: $id) {
    id
  }
}
```

### Queries

#### Get Today's Quick Logs
```graphql
query GET_TODAY_LOGS($today: timestamptz, $tomorrow: timestamptz) {
  quick_logs(where: { createdAt: { _gte: $today, _lte: $tomorrow } }) {
    id
    name
    calories
    protein
    consumed
    createdAt
    meal
    type
  }
}
```

#### Get Summary (calculated client-side)
Since there's no built-in aggregation query, we fetch all logs and calculate:
```typescript
const total Calories = quick_logs.reduce((sum, log) => sum + log.calories, 0)
const totalProtein = quick_logs.reduce((sum, log) => sum + log.protein, 0)
```

## Implementation Notes

1. **Date Range**: CleanSlate uses `$today` and `$tomorrow` timestamps to filter by day
   - `$today`: Start of day (00:00:00)
   - `$tomorrow`: Start of next day (00:00:00)
   - Uses user's timezone from profile settings

2. **Authentication**: The `profile` field may be auto-populated based on the Bearer token

3. **GraphQL Client**: Need to use a GraphQL client (like `graphql-request` or plain fetch with POST)

4. **Error Handling**: GraphQL errors are returned in `errors` array, not HTTP status codes

## Example Request

```bash
curl -X POST "https://cleanslate.jinocenc.io/auth/graphql" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation CREATE_QUICK_LOG($object: quick_logs_insert_input!) { insert_quick_logs_one(object: $object) { id name calories protein createdAt } }",
    "variables": {
      "object": {
        "name": "Chicken Breast",
        "calories": 165,
        "protein": 31
      }
    }
  }'
```

## Changes Required

1. **API Client** (`src/api/`):
   - Remove REST endpoint methods
   - Add GraphQL client with query/mutation execution
   - Update error handling for GraphQL errors

2. **Types** (`src/types/api.ts`):
   - Update to match GraphQL schema
   - Add GraphQL request/response types

3. **Constants** (`src/constants.ts`):
   - Change `CLEANSLATE_API_BASE_URL` default to include `/auth/graphql`
   - Or update client to append `/auth/graphql`

4. **Tests**:
   - Update mocks to return GraphQL responses
   - Test GraphQL query/mutation structure
