# Specification: CleanSlate MCP Server - Phase 1 Foundation

## Goal

Create a production-ready MCP (Model Context Protocol) server that wraps the CleanSlate API, enabling AI assistants like Claude to perform judgment-free nutrition tracking through conversational interfaces. This Phase 1 implementation establishes the core project infrastructure and implements 5 essential food logging tools that embody CleanSlate's anti-perfectionism philosophy.

## User Stories

- As a perfectionism-prone user, I want to log food entries conversationally through Claude so that I can track nutrition without the guilt and complexity of traditional diet apps
- As a developer in Claude Code, I want to quickly add food entries without breaking flow state so that tracking becomes frictionless and sustainable
- As a user who makes mistakes, I want to easily edit or delete today's entries so that errors don't derail my tracking efforts
- As a health-conscious user, I want to see only today's log and totals so that I can focus on the present without historical guilt
- As a CleanSlate user, I want to track only calories and protein so that I avoid the overwhelm of monitoring 10+ macro/micronutrients

## Core Requirements

### Functional Requirements

- MCP server that successfully connects to Claude Code and other MCP-compatible clients via stdio transport
- Authentication with CleanSlate API using API key stored in environment variables
- Five core MCP tools for food logging: `log_food`, `get_today_log`, `delete_food_entry`, `edit_food_entry`, `get_today_summary`
- All tools operate on "today only" data, respecting the daily reset philosophy
- Input validation using Zod schemas with clear, judgment-free error messages
- Automatic today's date application for all food logging operations
- Type-safe TypeScript implementation with strict mode enabled

### Non-Functional Requirements

- Response time under 2 seconds for all MCP tool calls (target: sub-5-second user experience including Claude processing)
- Graceful error handling with user-friendly messages that maintain non-judgmental tone
- Test coverage minimum 80% for core business logic
- Clear, actionable error messages that help users recover from mistakes
- In-memory caching for repeated API requests within same session (future optimization)
- Zero tolerance for crashes - all errors caught and handled appropriately
- Code maintainability through TypeScript strict mode, ESLint, and Prettier

## Visual Design

No UI components required. This is a headless MCP server that exposes tools for conversational AI interaction.

## Reusable Components

### Existing Code to Leverage

This is a greenfield project with no existing codebase. However, we will leverage:

- **@modelcontextprotocol/sdk**: Official MCP SDK providing server infrastructure, tool definitions, and protocol handling
- **Zod**: Industry-standard TypeScript validation library for input schemas
- **Node.js native fetch API**: Modern HTTP client (Node 18+) avoiding additional dependencies

### New Components Required

All components are new for this Phase 1 implementation:

- **MCP Server Setup**: Server initialization, lifecycle management, and stdio transport configuration
- **CleanSlate API Client**: HTTP client wrapper for CleanSlate REST API with authentication
- **MCP Tool Implementations**: Five core tools exposing CleanSlate functionality to AI assistants
- **Type Definitions**: TypeScript interfaces for food entries, API requests/responses, and tool schemas
- **Error Handling Layer**: Centralized error handling with judgment-free messaging
- **Validation Schemas**: Zod schemas for all tool inputs

## Technical Approach

### Project Architecture

```
┌─────────────────────────────────────────────┐
│         Claude Code / MCP Client            │
└──────────────────┬──────────────────────────┘
                   │ stdio transport
                   │ MCP Protocol
┌──────────────────▼──────────────────────────┐
│           CleanSlate MCP Server             │
│  ┌────────────────────────────────────────┐ │
│  │   MCP Server (index.ts, server.ts)    │ │
│  └──────────────┬─────────────────────────┘ │
│                 │                            │
│  ┌──────────────▼─────────────────────────┐ │
│  │    MCP Tools Layer (tools/*.ts)        │ │
│  │  - log_food                            │ │
│  │  - get_today_log                       │ │
│  │  - delete_food_entry                   │ │
│  │  - edit_food_entry                     │ │
│  │  - get_today_summary                   │ │
│  └──────────────┬─────────────────────────┘ │
│                 │                            │
│  ┌──────────────▼─────────────────────────┐ │
│  │   CleanSlate API Client (api/*.ts)    │ │
│  │   - Authentication                     │ │
│  │   - HTTP Request Handler              │ │
│  │   - Error Handling                    │ │
│  └──────────────┬─────────────────────────┘ │
└─────────────────┼──────────────────────────┘
                  │ HTTPS
                  │ GraphQL API
┌─────────────────▼──────────────────────────┐
│    CleanSlate GraphQL API (/auth/graphql) │
└────────────────────────────────────────────┘
```

### Project Structure

```
cleanslate-mcp/
├── src/
│   ├── index.ts                 # MCP server entry point
│   ├── server.ts                # MCP server setup and tool registration
│   ├── config/
│   │   └── environment.ts       # Environment variable validation
│   ├── tools/
│   │   ├── log-food.ts          # log_food tool implementation
│   │   ├── get-today-log.ts     # get_today_log tool implementation
│   │   ├── delete-food-entry.ts # delete_food_entry tool implementation
│   │   ├── edit-food-entry.ts   # edit_food_entry tool implementation
│   │   └── get-today-summary.ts # get_today_summary tool implementation
│   ├── api/
│   │   ├── client.ts            # CleanSlate API HTTP client
│   │   ├── auth.ts              # Authentication handling
│   │   └── endpoints.ts         # API endpoint definitions
│   ├── types/
│   │   ├── food-entry.ts        # FoodEntry interface
│   │   ├── api.ts               # API request/response types
│   │   └── mcp.ts               # MCP tool input/output types
│   ├── utils/
│   │   ├── date.ts              # Date utilities (today's date)
│   │   ├── errors.ts            # Custom error classes
│   │   └── validation.ts        # Zod schemas
│   └── constants.ts             # Application constants
├── tests/
│   ├── unit/
│   │   ├── tools/               # Unit tests for tool logic
│   │   ├── api/                 # Unit tests for API client
│   │   └── utils/               # Unit tests for utilities
│   └── integration/
│       └── mcp-protocol.test.ts # MCP protocol compliance tests
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc
├── .env.example
├── README.md
└── LICENSE                      # Apache 2.0
```

### Database

No local database required. All data is managed by the CleanSlate API. The MCP server is stateless except for:
- In-memory session state (future optimization)
- Configuration loaded from environment variables at startup

### API Integration

#### CleanSlate GraphQL API

**Endpoint**: `https://cleanslate.jinocenc.io/auth/graphql`

**Protocol**: GraphQL (not REST)
- All operations use POST requests to the GraphQL endpoint
- Operations defined as GraphQL queries (reads) and mutations (writes)

**Required Operations**:

1. **CREATE_QUICK_LOG** - Create food entry for today
   ```graphql
   mutation CREATE_QUICK_LOG($object: quick_logs_insert_input!) {
     insert_quick_logs_one(object: $object) {
       id name calories protein createdAt
     }
   }
   ```

2. **GET_TODAY_LOGS** - Retrieve today's entries
   ```graphql
   query GET_TODAY_LOGS($today: timestamptz, $tomorrow: timestamptz) {
     quick_logs(where: { createdAt: { _gte: $today, _lte: $tomorrow } }) {
       id name calories protein consumed createdAt meal type
     }
   }
   ```

3. **DELETE_QUICK_LOG** - Delete specific entry
   ```graphql
   mutation DELETE_QUICK_LOG($id: uuid!) {
     delete_quick_logs_by_pk(id: $id) {
       id
     }
   }
   ```

4. **UPDATE_LOG** - Update existing entry
   ```graphql
   mutation UPDATE_LOG($pk_columns: quick_logs_pk_columns_input!, $set: quick_logs_set_input) {
     update_quick_logs_by_pk(pk_columns: $pk_columns, _set: $set) {
       id name calories protein createdAt
     }
   }
   ```

5. **Summary calculation** - Calculated client-side by summing quick_logs results

**Data Table**: `quick_logs`
- Uses CleanSlate's `quick_logs` table (simple calorie/protein tracking)
- Fields: `id`, `name`, `calories`, `protein`, `createdAt`, `consumed`, `meal`, `type`
- Perfect alignment with our calories+protein only philosophy

**Authentication**:
- API Key authentication via `Authorization: Bearer {API_KEY}` header
- API key stored in `CLEANSLATE_API_KEY` environment variable
- All requests over HTTPS

**Request/Response Format**:
- JSON content type for all requests
- GraphQL request format: `{ query: string, variables?: object }`
- GraphQL response format: `{ data?: object, errors?: array }`
- Errors returned in `errors` array, not HTTP status codes

**Error Handling Strategy**:
- **GraphQL Errors**: Check `errors` array in response, extract user-friendly messages
- **Network errors**: Retry once with 1-second delay, then fail gracefully
- **401/403**: Clear authentication error to user about invalid API key
- **404**: Entry not found - inform user entry may have been deleted
- **400**: Validation errors - surface field-specific messages from GraphQL errors
- **5xx**: CleanSlate service issue - inform user to retry later
- **Timeout**: 10-second timeout per request

**Rate Limiting**:
- Respect `X-RateLimit-*` headers if present
- Implement basic client-side throttling (max 10 requests/second)

### Frontend

No frontend required. This is a backend MCP server exposing tools via stdio transport.

### Testing

**Test Strategy**:
- **Unit Tests**: Core business logic, validation, date utilities, error handling
- **Integration Tests**: MCP protocol compliance using official test utilities
- **Mocked API Tests**: CleanSlate API interactions with mocked responses
- **Target Coverage**: 80%+ for core functionality (tools, API client, validation)

**Test Framework**: Vitest (fast, modern, TypeScript-native)

**Mock Strategy**:
- Mock CleanSlate API responses using Vitest's `vi.mock()`
- Mock current date/time for consistent testing
- Mock MCP client interactions for tool testing

**Critical Test Cases**:
1. Each MCP tool correctly formats input and output
2. Zod validation catches invalid inputs
3. API client handles authentication correctly
4. Error messages maintain judgment-free tone
5. Date utilities correctly identify "today"
6. MCP server starts and registers all tools

## MCP Tools Specification

### Tool 1: log_food

**Purpose**: Add a food entry to today's log with calories and protein

**Input Schema** (Zod):
```typescript
{
  name: string,           // Food name/description (1-200 chars)
  calories: number,       // Calories (0-10000, integer)
  protein: number         // Protein in grams (0-500, can be decimal)
}
```

**Output Format**:
```json
{
  "success": true,
  "entry": {
    "id": "entry-uuid",
    "name": "Chicken breast",
    "calories": 165,
    "protein": 31,
    "timestamp": "2025-10-20T14:30:00Z"
  },
  "message": "Added chicken breast to today's log"
}
```

**Error Handling**:
- Invalid calories/protein: "Calories must be between 0 and 10000"
- Empty name: "Food name is required"
- API failure: "Couldn't save entry right now. Try again in a moment."

**Example Usage**:
```
User: "Log chicken breast with 165 calories and 31g protein"
Claude calls: log_food({ name: "Chicken breast", calories: 165, protein: 31 })
Response: "Added chicken breast to today's log (165 cal, 31g protein)"
```

---

### Tool 2: get_today_log

**Purpose**: Retrieve all food entries logged today

**Input Schema** (Zod):
```typescript
{} // No parameters required
```

**Output Format**:
```json
{
  "success": true,
  "entries": [
    {
      "id": "entry-uuid-1",
      "name": "Scrambled eggs",
      "calories": 140,
      "protein": 12,
      "timestamp": "2025-10-20T08:15:00Z"
    },
    {
      "id": "entry-uuid-2",
      "name": "Chicken breast",
      "calories": 165,
      "protein": 31,
      "timestamp": "2025-10-20T14:30:00Z"
    }
  ],
  "count": 2
}
```

**Error Handling**:
- API failure: "Couldn't load today's log right now. Try again in a moment."
- Empty log: Return `{ success: true, entries: [], count: 0 }` (not an error)

**Example Usage**:
```
User: "What have I logged today?"
Claude calls: get_today_log({})
Response: "Today's log: Scrambled eggs (140 cal, 12g protein) at 8:15am, Chicken breast (165 cal, 31g protein) at 2:30pm"
```

---

### Tool 3: delete_food_entry

**Purpose**: Remove a food entry from today's log

**Input Schema** (Zod):
```typescript
{
  entryId: string        // UUID of entry to delete
}
```

**Output Format**:
```json
{
  "success": true,
  "message": "Entry deleted"
}
```

**Error Handling**:
- Entry not found: "That entry wasn't found. It may have already been deleted."
- Invalid UUID: "Entry ID must be a valid identifier"
- API failure: "Couldn't delete entry right now. Try again in a moment."

**Example Usage**:
```
User: "Delete the chicken breast entry"
Claude identifies entry ID from previous get_today_log call
Claude calls: delete_food_entry({ entryId: "entry-uuid-2" })
Response: "Deleted chicken breast from today's log"
```

---

### Tool 4: edit_food_entry

**Purpose**: Update calories and/or protein for an existing entry

**Input Schema** (Zod):
```typescript
{
  entryId: string,            // UUID of entry to edit
  calories?: number,          // Updated calories (optional, 0-10000)
  protein?: number,           // Updated protein (optional, 0-500)
  name?: string              // Updated name (optional, 1-200 chars)
}
```

**Output Format**:
```json
{
  "success": true,
  "entry": {
    "id": "entry-uuid-2",
    "name": "Grilled chicken breast",
    "calories": 180,
    "protein": 35,
    "timestamp": "2025-10-20T14:30:00Z"
  },
  "message": "Entry updated"
}
```

**Error Handling**:
- No changes provided: "Provide at least one field to update (calories, protein, or name)"
- Entry not found: "That entry wasn't found. It may have been deleted."
- Invalid values: "Calories must be between 0 and 10000"
- API failure: "Couldn't update entry right now. Try again in a moment."

**Example Usage**:
```
User: "Actually that was 180 calories, not 165"
Claude calls: edit_food_entry({ entryId: "entry-uuid-2", calories: 180 })
Response: "Updated chicken breast to 180 calories"
```

---

### Tool 5: get_today_summary

**Purpose**: Get total calories and protein for today

**Input Schema** (Zod):
```typescript
{} // No parameters required
```

**Output Format**:
```json
{
  "success": true,
  "summary": {
    "totalCalories": 305,
    "totalProtein": 43,
    "entryCount": 2
  }
}
```

**Error Handling**:
- API failure: "Couldn't load today's summary right now. Try again in a moment."
- Empty log: Return `{ totalCalories: 0, totalProtein: 0, entryCount: 0 }` (not an error)

**Example Usage**:
```
User: "What are my totals for today?"
Claude calls: get_today_summary({})
Response: "Today's totals: 305 calories, 43g protein from 2 entries"
```

## Data Models

### TypeScript Interfaces

```typescript
// types/food-entry.ts
export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  timestamp: string; // ISO 8601 format
}

// types/api.ts
export interface CreateFoodEntryRequest {
  name: string;
  calories: number;
  protein: number;
}

export interface CreateFoodEntryResponse {
  entry: FoodEntry;
}

export interface GetTodayLogResponse {
  entries: FoodEntry[];
}

export interface DeleteFoodEntryResponse {
  success: boolean;
}

export interface UpdateFoodEntryRequest {
  name?: string;
  calories?: number;
  protein?: number;
}

export interface UpdateFoodEntryResponse {
  entry: FoodEntry;
}

export interface TodaySummaryResponse {
  totalCalories: number;
  totalProtein: number;
  entryCount: number;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

// types/mcp.ts
export interface LogFoodInput {
  name: string;
  calories: number;
  protein: number;
}

export interface LogFoodOutput {
  success: boolean;
  entry: FoodEntry;
  message: string;
}

export interface GetTodayLogOutput {
  success: boolean;
  entries: FoodEntry[];
  count: number;
}

export interface DeleteFoodEntryInput {
  entryId: string;
}

export interface DeleteFoodEntryOutput {
  success: boolean;
  message: string;
}

export interface EditFoodEntryInput {
  entryId: string;
  name?: string;
  calories?: number;
  protein?: number;
}

export interface EditFoodEntryOutput {
  success: boolean;
  entry: FoodEntry;
  message: string;
}

export interface GetTodaySummaryOutput {
  success: boolean;
  summary: {
    totalCalories: number;
    totalProtein: number;
    entryCount: number;
  };
}
```

### Zod Validation Schemas

```typescript
// utils/validation.ts
import { z } from 'zod';

export const LogFoodSchema = z.object({
  name: z.string().min(1, "Food name is required").max(200, "Food name too long"),
  calories: z.number().int("Calories must be a whole number").min(0).max(10000, "Calories must be between 0 and 10000"),
  protein: z.number().min(0).max(500, "Protein must be between 0 and 500 grams")
});

export const DeleteFoodEntrySchema = z.object({
  entryId: z.string().uuid("Entry ID must be a valid identifier")
});

export const EditFoodEntrySchema = z.object({
  entryId: z.string().uuid("Entry ID must be a valid identifier"),
  name: z.string().min(1).max(200).optional(),
  calories: z.number().int().min(0).max(10000).optional(),
  protein: z.number().min(0).max(500).optional()
}).refine(
  (data) => data.name !== undefined || data.calories !== undefined || data.protein !== undefined,
  { message: "Provide at least one field to update (calories, protein, or name)" }
);

export const GetTodayLogSchema = z.object({});
export const GetTodaySummarySchema = z.object({});
```

## Configuration

### Environment Variables

**Required**:
- `CLEANSLATE_API_KEY`: API key for CleanSlate authentication (no default)
- `CLEANSLATE_API_BASE_URL`: Base URL for CleanSlate GraphQL API (default: `https://cleanslate.jinocenc.io/auth/graphql`)

**Optional**:
- `LOG_LEVEL`: Logging verbosity (default: `info`, options: `debug`, `info`, `warn`, `error`)
- `REQUEST_TIMEOUT_MS`: HTTP request timeout in milliseconds (default: `10000`)
- `MAX_RETRIES`: Maximum retry attempts for failed requests (default: `1`)

### Configuration File Structure

```typescript
// config/environment.ts
import { z } from 'zod';

const EnvironmentSchema = z.object({
  CLEANSLATE_API_KEY: z.string().min(1, "CLEANSLATE_API_KEY is required"),
  CLEANSLATE_API_BASE_URL: z.string().url().default("https://cleanslate.jinocenc.io/auth/graphql"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  REQUEST_TIMEOUT_MS: z.coerce.number().positive().default(10000),
  MAX_RETRIES: z.coerce.number().int().min(0).max(3).default(1)
});

export type Environment = z.infer<typeof EnvironmentSchema>;

export function loadEnvironment(): Environment {
  const result = EnvironmentSchema.safeParse(process.env);

  if (!result.success) {
    console.error("Configuration error:", result.error.format());
    process.exit(1);
  }

  return result.data;
}
```

### .env.example

```
# CleanSlate GraphQL API Configuration
CLEANSLATE_API_KEY=your_api_key_here
CLEANSLATE_API_BASE_URL=https://cleanslate.jinocenc.io/auth/graphql

# Optional Configuration
LOG_LEVEL=info
REQUEST_TIMEOUT_MS=10000
MAX_RETRIES=1
```

## Error Handling

### Error Types

```typescript
// utils/errors.ts

export class CleanSlateError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'CleanSlateError';
  }
}

export class AuthenticationError extends CleanSlateError {
  constructor(message = "Invalid API key. Check your CLEANSLATE_API_KEY configuration.") {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends CleanSlateError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends CleanSlateError {
  constructor(message = "That entry wasn't found. It may have been deleted.") {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class ApiError extends CleanSlateError {
  constructor(message = "Couldn't complete request right now. Try again in a moment.") {
    super(message, 500);
    this.name = 'ApiError';
  }
}

export class NetworkError extends CleanSlateError {
  constructor(message = "Network issue. Check your connection and try again.") {
    super(message);
    this.name = 'NetworkError';
  }
}
```

### Error Handling Strategy

1. **Input Validation Errors**: Caught by Zod schemas before API calls, return clear field-specific messages
2. **Authentication Errors**: Surfaced immediately with configuration guidance
3. **Not Found Errors**: Non-judgmental message that entry may have been deleted
4. **Server Errors**: Generic message asking user to retry later
5. **Network Errors**: Automatic retry once, then surface connection issue
6. **All Errors**: Logged to console with full details for debugging, but users only see judgment-free messages

### User-Facing Error Messages Philosophy

All error messages must:
- Be clear and actionable
- Avoid technical jargon
- Maintain non-judgmental tone
- Suggest next steps when possible
- Never blame the user

**Good**: "Couldn't save entry right now. Try again in a moment."
**Bad**: "HTTP 500 Internal Server Error - Request failed"

**Good**: "Calories must be between 0 and 10000"
**Bad**: "Invalid input: calories out of range"

**Good**: "That entry wasn't found. It may have been deleted."
**Bad**: "404 Not Found - Resource does not exist"

### Logging Approach

- **Development**: Debug-level logs including request/response bodies
- **Production**: Info-level logs with request IDs, no sensitive data
- **Error Logs**: Full error stack traces with context for troubleshooting
- **Tool Logs**: Log each MCP tool invocation with sanitized inputs

## Testing Strategy

### Unit Test Coverage Targets

- **Tools**: 90%+ coverage (critical user-facing logic)
- **API Client**: 85%+ coverage (handles external dependencies)
- **Validation**: 100% coverage (security-critical)
- **Utilities**: 80%+ coverage (date helpers, error handlers)
- **Overall**: 80%+ coverage

### Integration Test Approach

**MCP Protocol Compliance**:
- Use `@modelcontextprotocol/sdk` test utilities
- Verify server starts and listens on stdio
- Confirm all tools are registered correctly
- Test tool invocation request/response cycle
- Validate tool schema definitions

### Mock Strategy for CleanSlate API

```typescript
// tests/mocks/api.ts
import { vi } from 'vitest';

export const mockCleanSlateApi = {
  createFoodEntry: vi.fn(),
  getTodayLog: vi.fn(),
  deleteFoodEntry: vi.fn(),
  updateFoodEntry: vi.fn(),
  getTodaySummary: vi.fn()
};

// Example test setup
beforeEach(() => {
  mockCleanSlateApi.createFoodEntry.mockResolvedValue({
    entry: {
      id: 'test-uuid',
      name: 'Test Food',
      calories: 100,
      protein: 10,
      timestamp: '2025-10-20T12:00:00Z'
    }
  });
});
```

### Critical Test Scenarios

1. **Happy Path**: Each tool works with valid inputs
2. **Validation Errors**: Zod schemas reject invalid inputs appropriately
3. **API Errors**: Tools handle 4xx/5xx responses gracefully
4. **Network Failures**: Retry logic and timeout behavior
5. **Empty Results**: Tools handle empty logs without errors
6. **Date Boundaries**: "Today" calculation works correctly across timezones
7. **Error Messages**: All error messages maintain judgment-free tone

## Development Workflow

### Setup Instructions

```bash
# Clone repository
git clone https://github.com/yourusername/cleanslate-mcp.git
cd cleanslate-mcp

# Install dependencies with pnpm
pnpm install

# Copy environment template
cp .env.example .env

# Edit .env and add your CleanSlate API key
nano .env

# Build TypeScript
pnpm build

# Run tests
pnpm test

# Run MCP server locally
pnpm start
```

### Build Process

```json
// package.json scripts
{
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "start": "node dist/index.js",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "format:check": "prettier --check \"src/**/*.ts\"",
    "typecheck": "tsc --noEmit"
  }
}
```

### Testing Commands

```bash
# Run all tests once
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run with coverage report
pnpm test:coverage

# Run specific test file
pnpm test src/tools/log-food.test.ts
```

### Linting and Formatting

```bash
# Check for linting errors
pnpm lint

# Auto-fix linting errors
pnpm lint:fix

# Check formatting
pnpm format:check

# Auto-format code
pnpm format

# Type-check without building
pnpm typecheck
```

## Success Criteria

Phase 1 is complete when:

1. **MCP Server Operational**: Server starts successfully and connects to Claude Code via stdio transport
2. **All Tools Functional**: All 5 tools (`log_food`, `get_today_log`, `delete_food_entry`, `edit_food_entry`, `get_today_summary`) work correctly with CleanSlate API
3. **API Integration Stable**: CleanSlate API authentication works, requests succeed, errors handled gracefully
4. **Test Coverage Met**: Minimum 80% code coverage achieved with all critical paths tested
5. **Documentation Complete**: README includes setup instructions, tool descriptions, and example usage
6. **Type Safety Verified**: TypeScript strict mode enabled, no `any` types in production code
7. **Philosophy Aligned**: All error messages and tool descriptions maintain judgment-free, anti-perfectionism tone
8. **Developer Experience Solid**: Clear setup process, meaningful error messages during development
9. **Code Quality Standards**: ESLint and Prettier configured, all code passes linting
10. **Production Ready**: No known bugs, graceful error handling, appropriate logging

**Acceptance Test**: A developer can install the MCP server, configure it with their CleanSlate API key, connect it to Claude Code, and successfully log food, view today's log, and see totals through conversational commands.

## Future Considerations for Phase 2

Phase 2 will introduce Basic Foods library functionality. The current architecture should support this by:

1. **API Client Extensibility**: Adding new endpoints to `api/endpoints.ts` and methods to `api/client.ts`
2. **New Tool Files**: Adding `get-basic-foods.ts`, `quick-add-basic-food.ts`, `create-basic-food.ts`, `manage-basic-foods.ts` to `src/tools/`
3. **Type Definitions**: Adding `BasicFood` interface to `types/` directory
4. **Caching Layer**: Implementing in-memory cache for Basic Foods (frequently accessed, rarely changes)
5. **Search Functionality**: Adding fuzzy search utilities for finding Basic Foods by name

**No Breaking Changes Expected**: Phase 1 tools will remain unchanged. Phase 2 adds net-new tools without modifying existing ones, maintaining backward compatibility.

## Alignment with CleanSlate Philosophy

This specification ensures every technical decision reflects CleanSlate's core values:

**Track Food Without Judgment**:
- Error messages never blame users ("Try again" vs "You entered invalid data")
- No historical data retrieval - only today's log visible
- Success messages are encouraging, not clinical

**Only Calories and Protein**:
- Tool schemas enforce only these two metrics
- No fields for carbs, fat, micronutrients in data models
- API client validates CleanSlate API responses match this constraint

**Daily Reset**:
- All tools operate on "today only" - no date parameters exposed to users
- Date utilities always use current date in user's timezone
- No historical comparison or trend analysis in Phase 1

**Anti-Perfectionism**:
- Edit and delete tools make mistakes easy to fix
- "Add food" doesn't require exact measurements - accepts estimates
- Test strategy focuses on core flows, not exhaustive edge cases (pragmatic over perfect)

**Speed and Simplicity**:
- Minimal dependencies (only MCP SDK, Zod, native fetch)
- Straightforward project structure - easy to navigate
- Tool interfaces are simple - name, calories, protein only
- No complex configuration - just API key and go

---

## Appendix: Key Dependencies

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "typescript": "^5.3.0",
    "vitest": "^1.0.0",
    "@vitest/coverage-v8": "^1.0.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  }
}
```

---

**End of Specification**
