# Task Group 2: Core Type Definitions & Utilities

## Overview
**Task Reference:** Task Group 2 (TASK-008 through TASK-015) from `agent-os/specs/2025-10-20-cleanslate-mcp-init/tasks.md`
**Implemented By:** api-engineer
**Date:** 2025-10-20
**Status:** Complete

### Task Description
Create TypeScript type definitions, interfaces, Zod validation schemas, custom error classes, utility functions, and environment configuration for the CleanSlate MCP Server. These components form the type-safe foundation for all subsequent development.

## Implementation Summary
Implemented a comprehensive type system and utility layer that provides strict type safety, validation, and error handling for the CleanSlate MCP Server. The implementation includes TypeScript interfaces for food entries, API requests/responses, and MCP tool inputs/outputs, along with Zod schemas for runtime validation with judgment-free error messages. Custom error classes maintain CleanSlate's non-judgmental philosophy, while date utilities ensure consistent "today" handling across the application. Environment configuration uses Zod for type-safe validation of required and optional environment variables with helpful error messages when misconfigured.

All error messages and validation feedback maintain CleanSlate's anti-perfectionism philosophy with clear, helpful, non-judgmental language that guides users without blame.

## Files Changed/Created

### New Files
- `/home/ericreyes/github/cleanslate-mcp/src/types/food-entry.ts` - Defines the FoodEntry interface representing a single food log item
- `/home/ericreyes/github/cleanslate-mcp/src/types/api.ts` - API request/response type definitions for CleanSlate API communication
- `/home/ericreyes/github/cleanslate-mcp/src/types/mcp.ts` - MCP tool input/output type definitions for all 5 tools
- `/home/ericreyes/github/cleanslate-mcp/src/utils/validation.ts` - Zod validation schemas with judgment-free error messages
- `/home/ericreyes/github/cleanslate-mcp/src/utils/errors.ts` - Custom error classes maintaining non-judgmental tone
- `/home/ericreyes/github/cleanslate-mcp/src/utils/date.ts` - Date utility functions for "today" calculations
- `/home/ericreyes/github/cleanslate-mcp/src/constants.ts` - Application-wide constants for API endpoints and configuration
- `/home/ericreyes/github/cleanslate-mcp/src/config/environment.ts` - Environment variable validation and loading with Zod
- `/home/ericreyes/github/cleanslate-mcp/tests/unit/utils/date.test.ts` - Unit tests for date utility functions (8 tests)

### Modified Files
None - all files were created new

### Deleted Files
None

## Key Implementation Details

### FoodEntry Type Definitions
**Location:** `/home/ericreyes/github/cleanslate-mcp/src/types/food-entry.ts`

Created the core `FoodEntry` interface with JSDoc comments for each field. This interface represents a single food item logged in CleanSlate with id, name, calories, protein, and timestamp fields. All fields are properly typed with TypeScript primitives, and the timestamp uses ISO 8601 format string for consistency.

**Rationale:** Establishing a single source of truth for food entry structure ensures type safety across API communication, MCP tools, and internal logic. JSDoc comments provide inline documentation for developers.

### API Request/Response Types
**Location:** `/home/ericreyes/github/cleanslate-mcp/src/types/api.ts`

Implemented comprehensive TypeScript interfaces for all CleanSlate API interactions:
- CreateFoodEntryRequest/Response for POST /food-entries
- GetTodayLogResponse for GET /food-entries/today
- DeleteFoodEntryResponse for DELETE /food-entries/:id
- UpdateFoodEntryRequest/Response for PATCH /food-entries/:id
- TodaySummaryResponse for GET /food-entries/today/summary
- ApiError for error responses with statusCode field

All interfaces include detailed JSDoc comments explaining the purpose and structure of each type.

**Rationale:** Type-safe API communication prevents runtime errors and provides excellent IDE support. Separating request and response types clarifies data flow and makes the API contract explicit.

### MCP Tool Input/Output Types
**Location:** `/home/ericreyes/github/cleanslate-mcp/src/types/mcp.ts`

Defined TypeScript interfaces for all 5 MCP tools following a consistent pattern:
- LogFoodInput/Output for adding food entries
- GetTodayLogOutput for retrieving entries (no input required)
- DeleteFoodEntryInput/Output for removing entries
- EditFoodEntryInput/Output for updating entries
- GetTodaySummaryOutput for totals (no input required)

All output types include a `success: boolean` field for consistent response handling, plus a `message` field for user-facing feedback.

**Rationale:** Consistent interface patterns across tools make the codebase easier to understand and maintain. The success field allows tool implementations to uniformly indicate operation status.

### Zod Validation Schemas
**Location:** `/home/ericreyes/github/cleanslate-mcp/src/utils/validation.ts`

Implemented Zod schemas for runtime input validation with judgment-free error messages:
- LogFoodSchema: name (1-200 chars), calories (0-10000 integer), protein (0-500)
- DeleteFoodEntrySchema: entryId (UUID validation)
- EditFoodEntrySchema: with refinement requiring at least one field to update
- GetTodayLogSchema and GetTodaySummarySchema: empty objects for tools with no input

All error messages use clear, helpful language without judgment:
- "Food name is required" instead of "Invalid input"
- "Calories must be a whole number" instead of "Type error"
- "Provide at least one field to update (calories, protein, or name)" guides users on next steps

**Rationale:** Runtime validation catches errors before API calls, improving user experience. Judgment-free messages align with CleanSlate's anti-perfectionism philosophy and help users fix issues without feeling blamed.

### Custom Error Classes
**Location:** `/home/ericreyes/github/cleanslate-mcp/src/utils/errors.ts`

Created a hierarchy of error classes extending a base CleanSlateError:
- CleanSlateError: base class with statusCode and originalError properties
- AuthenticationError (401): "Invalid API key. Check your CLEANSLATE_API_KEY configuration."
- ValidationError (400): accepts custom message from validation failures
- NotFoundError (404): "That entry wasn't found. It may have been deleted."
- ApiError (500): "Couldn't complete request right now. Try again in a moment."
- NetworkError: "Network issue. Check your connection and try again."

All classes use Object.setPrototypeOf() to maintain proper prototype chain for instanceof checks.

**Rationale:** Custom error classes allow type-safe error handling and provide context-specific messages. Default messages maintain CleanSlate's non-judgmental tone while suggesting actionable next steps.

### Date Utility Functions
**Location:** `/home/ericreyes/github/cleanslate-mcp/src/utils/date.ts`

Implemented three utility functions for consistent date handling:
- `getTodayISO()`: returns today's date in YYYY-MM-DD format using UTC
- `getCurrentTimestamp()`: returns current timestamp in ISO 8601 format
- `isToday(dateString)`: checks if a date string represents today

All functions use UTC to ensure consistency across timezones and avoid edge cases around midnight.

**Rationale:** Centralizing date logic ensures "today" is calculated consistently across the application. UTC prevents timezone-related bugs and aligns with the "daily reset" philosophy.

### Application Constants
**Location:** `/home/ericreyes/github/cleanslate-mcp/src/constants.ts`

Defined application-wide constants with proper TypeScript typing:
- DEFAULT_API_BASE_URL: 'https://api.cleanslate.sh/v1'
- REQUEST_TIMEOUT_MS: 10000
- MAX_RETRIES: 1
- RETRY_DELAY_MS: 1000
- API_ENDPOINTS object with paths for all endpoints
- HTTP_STATUS object with status codes used in the application

The API_ENDPOINTS.FOOD_ENTRY is a function accepting entryId for dynamic endpoint construction.

**Rationale:** Centralizing constants prevents magic strings/numbers and makes configuration changes easier. TypeScript const assertions ensure immutability and provide better type inference.

### Environment Configuration Loader
**Location:** `/home/ericreyes/github/cleanslate-mcp/src/config/environment.ts`

Implemented Zod-based environment variable validation and loading:
- Required: CLEANSLATE_API_KEY (with helpful error message)
- Optional with defaults: CLEANSLATE_API_BASE_URL, LOG_LEVEL, REQUEST_TIMEOUT_MS, MAX_RETRIES
- Exports Environment type for type-safe access throughout the application
- loadEnvironment() function exits process with formatted error messages if validation fails

Configuration provides clear error messages when required variables are missing or invalid, guiding users to fix their .env setup.

**Rationale:** Validating environment variables at startup prevents runtime errors from misconfiguration. Zod provides type-safe parsing with coercion for numeric values, and helpful error messages guide users to correct setup.

## Database Changes
Not applicable - this task group focuses on TypeScript types and utilities, not database schema.

## Dependencies
None added - all implementations use existing dependencies (TypeScript, Zod) installed in Task Group 1.

## Testing

### Test Files Created/Updated
- `/home/ericreyes/github/cleanslate-mcp/tests/unit/utils/date.test.ts` - Date utility function tests

### Test Coverage
- Unit tests: Complete for date utilities (8 tests covering all functions and edge cases)
- Integration tests: Not applicable for this task group
- Edge cases covered:
  - Date format validation (YYYY-MM-DD and ISO 8601)
  - Same date when called multiple times quickly
  - Timezone information inclusion
  - Yesterday/tomorrow differentiation

### Manual Testing Performed
Ran `pnpm test` to verify all date utility tests pass successfully. Tests validate:
1. getTodayISO() returns correctly formatted dates
2. getCurrentTimestamp() includes timezone information
3. isToday() correctly identifies today, yesterday, and tomorrow
4. All functions maintain consistency across rapid successive calls

## User Standards & Preferences Compliance

### agent-os/standards/global/coding-style.md
**How Implementation Complies:**
Used meaningful, descriptive names for all types, interfaces, functions, and constants. Applied DRY principle by creating reusable error classes with inheritance. Removed all unused code - no dead code or commented blocks. Functions are small and focused on single tasks (date utilities, validation schemas).

**Deviations:** None

### agent-os/standards/global/commenting.md
**How Implementation Complies:**
All code is self-documenting through clear naming. Added minimal, helpful JSDoc comments to explain the purpose of types and interfaces. Comments are evergreen and informational, not temporal or referencing recent changes. No comments explaining what code does when the code itself is clear.

**Deviations:** None

### agent-os/standards/global/conventions.md
**How Implementation Complies:**
Organized files in a predictable, logical structure (types/, utils/, config/). Environment configuration uses environment variables with clear documentation in .env.example. All dependencies (Zod, TypeScript) are documented through their usage.

**Deviations:** None

### agent-os/standards/global/validation.md
**How Implementation Complies:**
Created Zod schemas for server-side validation that will be enforced before any API calls. Validation schemas use allowlists (specific ranges, string lengths, UUID format) rather than blocklists. Error messages are specific and field-specific, helping users correct their input. All validation happens early in the request flow.

**Deviations:** None

### agent-os/standards/global/error-handling.md
**How Implementation Complies:**
Created custom error classes for different failure scenarios with clear, actionable error messages. All error messages maintain non-judgmental tone and suggest next steps. Error classes include context (statusCode, originalError) for debugging while presenting friendly messages to users.

**Deviations:** None

### agent-os/standards/backend/api.md
**How Implementation Complies:**
Created comprehensive type definitions for all API requests and responses. Defined clear API error types with statusCode and message fields. Types support all CRUD operations for food entries plus summary endpoint.

**Deviations:** None - though implementation is limited to types, not actual API client (that comes in Task Group 3)

### agent-os/standards/global/tech-stack.md
**How Implementation Complies:**
Used TypeScript for all type definitions with strict mode enabled. Leveraged Zod for runtime validation. All code uses ES2022 features compatible with Node.js 18+.

**Deviations:** None

## Integration Points

### Internal Dependencies
- Type definitions are imported by: (will be used by API client and MCP tools in future task groups)
- Validation schemas are used by: (will be used by MCP tool implementations)
- Error classes are thrown by: (will be used by API client for error handling)
- Date utilities are used by: (will be used by MCP tools and API client)
- Environment configuration is loaded by: (will be used by server entry point and API client)

## Known Issues & Limitations

### Issues
None identified

### Limitations
1. **Date Utilities Use System Time**
   - Description: Date utilities rely on system clock, which could cause issues if system time is incorrect
   - Reason: No time server synchronization implemented in Phase 1
   - Future Consideration: Could add NTP time sync validation if this becomes a problem

2. **Environment Validation Only at Startup**
   - Description: Environment variables are only validated once at startup, not monitored for changes
   - Reason: MCP server is designed for single startup configuration per specification
   - Future Consideration: Could add hot-reload if dynamic configuration becomes necessary

## Performance Considerations
All type definitions, validation schemas, and utilities are lightweight with minimal runtime overhead. Zod validation is highly optimized and adds negligible latency. Date utilities use native JavaScript Date object for optimal performance.

## Security Considerations
Environment validation prevents startup with missing API keys, avoiding runtime failures. No sensitive data is logged in error messages. UUID validation in DeleteFoodEntrySchema and EditFoodEntrySchema prevents injection attacks.

## Dependencies for Other Tasks
- Task Group 3 (CleanSlate API Client Implementation): requires all API types, error classes, and environment configuration
- Task Group 4 (MCP Server Foundation): requires environment configuration
- Task Group 5 & 6 (MCP Tool Implementations): require MCP types, validation schemas, and date utilities

## Notes
The implementation successfully maintains CleanSlate's judgment-free philosophy throughout all error messages and validation feedback. All types use ES module imports (.js extensions) as required by the TypeScript configuration. The test suite for date utilities provides good coverage while keeping tests focused and pragmatic (not exhaustive), aligned with the anti-perfectionism approach.

One noteworthy implementation detail: The EditFoodEntrySchema uses Zod's refine() method to ensure at least one field is provided for update, with a helpful error message guiding users on what fields they can update. This is a good example of validation that both enforces business rules and maintains the helpful, non-judgmental tone.
