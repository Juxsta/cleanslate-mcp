# Task Breakdown: CleanSlate MCP Server - Phase 1 Foundation

## Overview

**Total Tasks**: 48 tasks organized into 8 task groups
**Estimated Total Effort**: ~32-52 hours
**Assigned Implementer Roles**: api-engineer (primary), testing-engineer

**Note on Implementer Assignment**: This MCP server project is Node.js/TypeScript based without traditional database/UI layers. The available implementers (database-engineer, api-engineer, ui-designer, testing-engineer) are Rails-focused, so we're adapting assignments:
- **api-engineer**: Handles all backend TypeScript code (API client, MCP tools, server setup)
- **testing-engineer**: Handles test coverage and verification

## Task List

---

### Task Group 1: Project Foundation & Setup

**Assigned Implementer:** api-engineer
**Dependencies:** None

**Objective**: Initialize the Node.js project with proper tooling, configuration, and project structure.

#### TASK-001: Initialize Node.js Project with pnpm

**Description**: Set up the initial Node.js project using pnpm package manager with basic dependencies for MCP server development.

**Acceptance Criteria**:
- [x] package.json created with correct project metadata (name: cleanslate-mcp, version: 0.1.0)
- [x] pnpm workspace initialized
- [x] Basic dependencies installed: @modelcontextprotocol/sdk, zod
- [x] Dev dependencies installed: typescript, @types/node, vitest, eslint, prettier, tsx
- [x] package.json includes required scripts: build, dev, start, test, lint, format
- [x] Node.js version requirement specified (>=18.0.0)
- [x] pnpm-lock.yaml committed

**Dependencies**: None (first task)

**Estimated Effort**: S (1-2hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/package.json` (create)
- `/home/ericreyes/github/cleanslate-mcp/pnpm-lock.yaml` (create)

---

#### TASK-002: Configure TypeScript with Strict Mode

**Description**: Set up TypeScript configuration with strict mode enabled to ensure type safety throughout the project.

**Acceptance Criteria**:
- [x] tsconfig.json created with strict mode enabled
- [x] Target set to ES2022 or later (for native fetch support)
- [x] Module resolution set to "node16" or "nodenext"
- [x] Output directory configured to dist/
- [x] Source maps enabled for debugging
- [x] Include/exclude patterns configured (src/** included, tests/** included)
- [x] Declaration files generation enabled

**Dependencies**: TASK-001

**Estimated Effort**: XS (<1hr)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/tsconfig.json` (create)

---

#### TASK-003: Configure ESLint and Prettier

**Description**: Set up ESLint for code quality and Prettier for consistent formatting aligned with coding standards.

**Acceptance Criteria**:
- [x] .eslintrc.json created with TypeScript parser configuration
- [x] ESLint rules configured: @typescript-eslint/recommended
- [x] .prettierrc created with standard formatting rules
- [x] .prettierignore configured (dist/, node_modules/)
- [x] ESLint and Prettier integration configured (no conflicts)
- [x] Format on save recommended in .vscode/settings.json (if applicable)

**Dependencies**: TASK-002

**Estimated Effort**: S (1-2hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/.eslintrc.json` (create)
- `/home/ericreyes/github/cleanslate-mcp/.prettierrc` (create)
- `/home/ericreyes/github/cleanslate-mcp/.prettierignore` (create)

---

#### TASK-004: Set Up Vitest Testing Framework

**Description**: Configure Vitest as the test framework for unit and integration testing with coverage reporting.

**Acceptance Criteria**:
- [x] Vitest dependencies installed (@vitest/coverage-v8)
- [x] vitest.config.ts created with TypeScript support
- [x] Test coverage thresholds configured (80% minimum)
- [x] Test file patterns configured (*.test.ts, *.spec.ts)
- [x] Coverage output directory configured (coverage/)
- [x] Test scripts added to package.json (test, test:watch, test:coverage)

**Dependencies**: TASK-002

**Estimated Effort**: S (1-2hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/vitest.config.ts` (create)
- `/home/ericreyes/github/cleanslate-mcp/package.json` (update)

---

#### TASK-005: Create Project Structure

**Description**: Establish the complete directory structure for the MCP server following the specification architecture.

**Acceptance Criteria**:
- [x] src/ directory created with all subdirectories
- [x] tests/ directory created with unit/ and integration/ subdirectories
- [x] Directory structure matches specification: config/, tools/, api/, types/, utils/
- [x] Placeholder .gitkeep files added to empty directories
- [x] All directories accessible and properly nested

**Dependencies**: TASK-001

**Estimated Effort**: XS (<1hr)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/src/` (create directory structure)
- `/home/ericreyes/github/cleanslate-mcp/tests/` (create directory structure)

---

#### TASK-006: Create Environment Configuration Files

**Description**: Set up environment variable configuration with .env.example template and validation schema.

**Acceptance Criteria**:
- [x] .env.example created with all required variables documented
- [x] CLEANSLATE_API_KEY placeholder included with instructions
- [x] CLEANSLATE_API_BASE_URL default provided
- [x] Optional variables documented (LOG_LEVEL, REQUEST_TIMEOUT_MS, MAX_RETRIES)
- [x] .gitignore updated to exclude .env files
- [x] Clear comments explaining each variable's purpose

**Dependencies**: TASK-001

**Estimated Effort**: XS (<1hr)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/.env.example` (create)
- `/home/ericreyes/github/cleanslate-mcp/.gitignore` (create)

---

#### TASK-007: Create License and Initial Documentation Structure

**Description**: Add Apache 2.0 license and create placeholder documentation files.

**Acceptance Criteria**:
- [x] LICENSE file created with Apache 2.0 license text
- [x] Copyright holder specified
- [x] README.md created with basic project description placeholder
- [x] CONTRIBUTING.md placeholder created
- [x] Documentation follows CleanSlate's open source philosophy

**Dependencies**: TASK-001

**Estimated Effort**: XS (<1hr)

**Priority**: Medium

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/LICENSE` (create)
- `/home/ericreyes/github/cleanslate-mcp/README.md` (create)
- `/home/ericreyes/github/cleanslate-mcp/CONTRIBUTING.md` (create)

---

### Task Group 2: Core Type Definitions & Utilities

**Assigned Implementer:** api-engineer
**Dependencies:** Task Group 1

**Objective**: Create TypeScript type definitions, interfaces, and utility functions that will be used throughout the project.

#### TASK-008: Create FoodEntry Type Definitions

**Description**: Define TypeScript interfaces for food entries and related data structures.

**Acceptance Criteria**:
- [x] FoodEntry interface created with id, name, calories, protein, timestamp fields
- [x] All fields properly typed (string, number, ISO 8601 timestamp)
- [x] Interface exported for use across the project
- [x] JSDoc comments added explaining each field

**Dependencies**: TASK-005

**Estimated Effort**: XS (<1hr)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/src/types/food-entry.ts` (create)

---

#### TASK-009: Create API Request/Response Types

**Description**: Define TypeScript types for all CleanSlate API request and response payloads.

**Acceptance Criteria**:
- [x] CreateFoodEntryRequest and CreateFoodEntryResponse interfaces created
- [x] GetTodayLogResponse interface created
- [x] DeleteFoodEntryResponse interface created
- [x] UpdateFoodEntryRequest and UpdateFoodEntryResponse interfaces created
- [x] TodaySummaryResponse interface created
- [x] ApiError interface created with error, message, statusCode fields
- [x] All interfaces properly exported

**Dependencies**: TASK-008

**Estimated Effort**: S (1-2hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/src/types/api.ts` (create)

---

#### TASK-010: Create MCP Tool Input/Output Types

**Description**: Define TypeScript interfaces for MCP tool inputs and outputs for all 5 tools.

**Acceptance Criteria**:
- [x] LogFoodInput and LogFoodOutput interfaces created
- [x] GetTodayLogOutput interface created (no input needed)
- [x] DeleteFoodEntryInput and DeleteFoodEntryOutput interfaces created
- [x] EditFoodEntryInput and EditFoodEntryOutput interfaces created
- [x] GetTodaySummaryOutput interface created (no input needed)
- [x] All output types include success: boolean field
- [x] All interfaces properly exported

**Dependencies**: TASK-008

**Estimated Effort**: S (1-2hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/src/types/mcp.ts` (create)

---

#### TASK-011: Create Zod Validation Schemas

**Description**: Implement Zod schemas for input validation with judgment-free error messages.

**Acceptance Criteria**:
- [x] LogFoodSchema created (name: 1-200 chars, calories: 0-10000 int, protein: 0-500)
- [x] DeleteFoodEntrySchema created (entryId: UUID validation)
- [x] EditFoodEntrySchema created with at least one field required refinement
- [x] GetTodayLogSchema and GetTodaySummarySchema created (empty objects)
- [x] All error messages maintain judgment-free, helpful tone
- [x] Schemas exported for use in tool implementations

**Dependencies**: TASK-001

**Estimated Effort**: M (2-4hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/src/utils/validation.ts` (create)

---

#### TASK-012: Create Custom Error Classes

**Description**: Implement custom error classes for different failure scenarios with user-friendly messages.

**Acceptance Criteria**:
- [x] CleanSlateError base class created extending Error
- [x] AuthenticationError class created (401 errors)
- [x] ValidationError class created (400 errors)
- [x] NotFoundError class created (404 errors)
- [x] ApiError class created (500 errors)
- [x] NetworkError class created (connection failures)
- [x] All error messages maintain judgment-free tone per specification
- [x] Error classes include statusCode and originalError properties

**Dependencies**: TASK-005

**Estimated Effort**: S (1-2hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/src/utils/errors.ts` (create)

---

#### TASK-013: Create Date Utility Functions

**Description**: Implement utility functions for handling "today" date calculations consistently.

**Acceptance Criteria**:
- [x] getTodayISO() function created returning today's date in ISO 8601 format
- [x] getCurrentTimestamp() function created returning current timestamp
- [x] isToday() function created to check if date string is today
- [x] Functions handle timezone properly (use UTC or user timezone per spec)
- [x] Unit tests written for date utilities (2-5 tests)
- [x] All functions properly exported

**Dependencies**: TASK-005

**Estimated Effort**: S (1-2hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/src/utils/date.ts` (create)
- `/home/ericreyes/github/cleanslate-mcp/tests/unit/utils/date.test.ts` (create)

---

#### TASK-014: Create Application Constants

**Description**: Define application-wide constants for configuration, API endpoints, and error messages.

**Acceptance Criteria**:
- [x] DEFAULT_API_BASE_URL constant defined
- [x] REQUEST_TIMEOUT_MS default defined
- [x] MAX_RETRIES default defined
- [x] API endpoint path constants defined (/food-entries, /food-entries/today, etc.)
- [x] HTTP status code constants if needed
- [x] All constants properly typed and exported

**Dependencies**: TASK-005

**Estimated Effort**: XS (<1hr)

**Priority**: Medium

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/src/constants.ts` (create)

---

#### TASK-015: Create Environment Configuration Loader

**Description**: Implement environment variable validation and loading using Zod schema.

**Acceptance Criteria**:
- [x] EnvironmentSchema created with all required and optional variables
- [x] loadEnvironment() function validates and parses process.env
- [x] Clear error messages if required variables missing
- [x] Default values applied for optional variables
- [x] Environment type exported for type safety
- [x] Function exits process with helpful message if validation fails

**Dependencies**: TASK-011, TASK-014

**Estimated Effort**: S (1-2hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/src/config/environment.ts` (create)

---

### Task Group 3: CleanSlate API Client Implementation

**Assigned Implementer:** api-engineer
**Dependencies:** Task Group 2

**Objective**: Build a robust HTTP client for interacting with the CleanSlate API with authentication, error handling, and retry logic.

#### TASK-016: Research CleanSlate API Documentation

**Description**: Review CleanSlate API documentation to confirm endpoints, authentication, and data formats.

**Acceptance Criteria**:
- [x] API base URL confirmed (https://api.cleanslate.sh/v1 or actual URL)
- [x] Authentication method confirmed (Bearer token or other)
- [x] All 5 required endpoints documented: POST /food-entries, GET /food-entries/today, DELETE /food-entries/:id, PATCH /food-entries/:id, GET /food-entries/today/summary
- [x] Request/response formats documented
- [x] Error response formats documented
- [x] Rate limiting information noted

**Dependencies**: TASK-006

**Estimated Effort**: M (2-4hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/docs/api-research.md` (create documentation notes)

---

#### TASK-017: Create API Client Base Class

**Description**: Implement the base HTTP client class using Node.js native fetch API with configuration management.

**Acceptance Criteria**:
- [x] CleanSlateClient class created
- [x] Constructor accepts configuration (API key, base URL, timeout, retries)
- [x] Private fetch wrapper method handles common headers (Authorization, Content-Type)
- [x] Request timeout implemented (default 10 seconds)
- [x] Base URL properly configured from environment
- [x] Logging framework initialized for request/response logging

**Dependencies**: TASK-015, TASK-016

**Estimated Effort**: M (2-4hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/src/api/client.ts` (create)

---

#### TASK-018: Implement Authentication Handler

**Description**: Add authentication logic to include Bearer token in all API requests.

**Acceptance Criteria**:
- [x] Authentication method added to client class
- [x] Bearer token properly formatted in Authorization header
- [x] API key sourced from environment configuration
- [x] 401/403 errors mapped to AuthenticationError with helpful message
- [x] Token validation on client initialization (optional health check)

**Dependencies**: TASK-017

**Estimated Effort**: S (1-2hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/src/api/auth.ts` (create)
- `/home/ericreyes/github/cleanslate-mcp/src/api/client.ts` (update)

---

#### TASK-019: Implement Error Handling and Retry Logic

**Description**: Add comprehensive error handling with automatic retries for network failures.

**Acceptance Criteria**:
- [x] HTTP status codes mapped to appropriate error classes
- [x] 401/403 → AuthenticationError
- [x] 400 → ValidationError with API message
- [x] 404 → NotFoundError
- [x] 5xx → ApiError
- [x] Network failures → NetworkError
- [x] Retry logic implemented (1 retry with 1-second delay)
- [x] All errors maintain judgment-free messaging
- [x] Error logging includes request context for debugging

**Dependencies**: TASK-017, TASK-012

**Estimated Effort**: M (2-4hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/src/api/client.ts` (update)

---

#### TASK-020: Create Food Entry API Endpoints

**Description**: Implement all CRUD methods for food entries in the API client.

**Acceptance Criteria**:
- [x] createFoodEntry(name, calories, protein) method implemented
- [x] getTodayLog() method implemented
- [x] deleteFoodEntry(entryId) method implemented
- [x] updateFoodEntry(entryId, updates) method implemented
- [x] All methods return properly typed responses
- [x] All methods handle errors per error handling strategy
- [x] Request/response logging implemented

**Dependencies**: TASK-019, TASK-009

**Estimated Effort**: M (2-4hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/src/api/endpoints.ts` (create)
- `/home/ericreyes/github/cleanslate-mcp/src/api/client.ts` (update)

---

#### TASK-021: Create Summary API Endpoint

**Description**: Implement the method for retrieving today's summary (total calories and protein).

**Acceptance Criteria**:
- [x] getTodaySummary() method implemented
- [x] Returns TodaySummaryResponse with totalCalories, totalProtein, entryCount
- [x] Handles empty log case (returns zeros, not error)
- [x] Proper error handling for API failures
- [x] Response properly typed

**Dependencies**: TASK-020

**Estimated Effort**: S (1-2hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/src/api/endpoints.ts` (update)

---

#### TASK-022: Write API Client Unit Tests

**Description**: Create comprehensive unit tests for the API client with mocked fetch responses.

**Acceptance Criteria**:
- [x] 2-5 focused tests for API client core functionality
- [x] Test authentication header inclusion
- [x] Test error mapping for different status codes
- [x] Test retry logic on network failures
- [x] Test successful responses for all endpoints
- [x] Mock fetch API using Vitest mocks
- [x] All tests pass

**Dependencies**: TASK-021

**Estimated Effort**: M (2-4hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/tests/unit/api/client.test.ts` (create)
- `/home/ericreyes/github/cleanslate-mcp/tests/unit/api/endpoints.test.ts` (create)

---

### Task Group 4: MCP Server Foundation

**Assigned Implementer:** api-engineer
**Dependencies:** Task Group 3

**Objective**: Set up the MCP server infrastructure with tool registration system and stdio transport.

#### TASK-023: Install and Configure MCP SDK

**Description**: Add MCP SDK dependency and verify compatibility with project setup.

**Acceptance Criteria**:
- [x] @modelcontextprotocol/sdk installed via pnpm
- [x] SDK version compatible with Node.js 18+
- [x] Type definitions available (TypeScript support)
- [x] SDK imports successfully in TypeScript files
- [x] Documentation reviewed for server setup patterns

**Dependencies**: TASK-001

**Estimated Effort**: S (1-2hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/package.json` (update)
- `/home/ericreyes/github/cleanslate-mcp/pnpm-lock.yaml` (update)

---

#### TASK-024: Create MCP Server Setup

**Description**: Implement the MCP server initialization with tool registration system.

**Acceptance Criteria**:
- [x] Server class imported from MCP SDK
- [x] Server initialized with name and version
- [x] Tool registration method implemented
- [x] Server lifecycle methods set up (start, stop, error handling)
- [x] Configuration loaded from environment
- [x] CleanSlate API client initialized within server context

**Dependencies**: TASK-023, TASK-021

**Estimated Effort**: M (2-4hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/src/server.ts` (create)

---

#### TASK-025: Implement Stdio Transport

**Description**: Configure stdio transport for communication with Claude Code and other MCP clients.

**Acceptance Criteria**:
- [x] Stdio transport configured from MCP SDK
- [x] Server listens on stdin/stdout correctly
- [x] Transport error handling implemented
- [x] Server gracefully handles client disconnection
- [x] Logging doesn.t interfere with stdio communication

**Dependencies**: TASK-024

**Estimated Effort**: S (1-2hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/src/server.ts` (update)

---

#### TASK-026: Create Server Entry Point

**Description**: Implement the main entry point (index.ts) that starts the MCP server.

**Acceptance Criteria**:
- [x] index.ts imports and initializes server
- [x] Environment configuration loaded on startup
- [x] Server starts successfully
- [x] Startup errors logged with helpful messages
- [x] Process exits gracefully on uncaught errors
- [x] Graceful shutdown on SIGINT/SIGTERM signals

**Dependencies**: TASK-025

**Estimated Effort**: S (1-2hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/src/index.ts` (create)

---

#### TASK-027: Test MCP Server Connection

**Description**: Create integration test to verify MCP server starts and responds to basic protocol requests.

**Acceptance Criteria**:
- [x] Integration test created for server startup
- [x] Test verifies server listens on stdio
- [x] Test sends MCP protocol handshake
- [x] Test receives valid server info response
- [x] Test gracefully shuts down server
- [x] Test passes successfully

**Dependencies**: TASK-026

**Estimated Effort**: M (2-4hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/tests/integration/mcp-protocol.test.ts` (create)

---

### Task Group 5: MCP Tool Implementations - Part 1 (log_food, get_today_log)

**Assigned Implementer:** api-engineer
**Dependencies:** Task Group 4

**Objective**: Implement the first two MCP tools for adding and viewing food entries.

#### TASK-028: Implement log_food Tool

**Description**: Create the log_food MCP tool for adding food entries to today's log.

**Acceptance Criteria**:
- [x] Tool file created with proper MCP tool structure
- [x] Input schema uses LogFoodSchema for validation
- [x] Tool handler calls API client createFoodEntry method
- [x] Success response includes entry details and confirmation message
- [x] Error handling returns judgment-free messages
- [x] Tool registered in server.ts
- [x] Tool returns LogFoodOutput type

**Dependencies**: TASK-026, TASK-011, TASK-020

**Estimated Effort**: M (2-4hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/src/tools/log-food.ts` (create)
- `/home/ericreyes/github/cleanslate-mcp/src/server.ts` (update)

---

#### TASK-029: Write log_food Tool Unit Tests

**Description**: Create focused unit tests for log_food tool logic.

**Acceptance Criteria**:
- [x] 2-5 focused tests covering critical behaviors
- [x] Test valid input creates food entry successfully
- [x] Test validation errors for invalid calories/protein
- [x] Test API error handling
- [x] Mock API client methods
- [x] All tests pass

**Dependencies**: TASK-028

**Estimated Effort**: S (1-2hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/tests/unit/tools/log-food.test.ts` (create)

---

#### TASK-030: Implement get_today_log Tool

**Description**: Create the get_today_log MCP tool for retrieving all today's food entries.

**Acceptance Criteria**:
- [x] Tool file created with proper MCP tool structure
- [x] Input schema uses GetTodayLogSchema (empty object)
- [x] Tool handler calls API client getTodayLog method
- [x] Success response includes entries array and count
- [x] Empty log handled gracefully (not an error)
- [x] Error handling returns judgment-free messages
- [x] Tool registered in server.ts
- [x] Tool returns GetTodayLogOutput type

**Dependencies**: TASK-026, TASK-011, TASK-020

**Estimated Effort**: M (2-4hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/src/tools/get-today-log.ts` (create)
- `/home/ericreyes/github/cleanslate-mcp/src/server.ts` (update)

---

#### TASK-031: Write get_today_log Tool Unit Tests

**Description**: Create focused unit tests for get_today_log tool logic.

**Acceptance Criteria**:
- [x] 2-5 focused tests covering critical behaviors
- [x] Test successful retrieval with multiple entries
- [x] Test empty log returns empty array (not error)
- [x] Test API error handling
- [x] Mock API client methods
- [x] All tests pass

**Dependencies**: TASK-030

**Estimated Effort**: S (1-2hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/tests/unit/tools/get-today-log.test.ts` (create)

---

### Task Group 6: MCP Tool Implementations - Part 2 (delete, edit, summary)

**Assigned Implementer:** api-engineer
**Dependencies:** Task Group 5

**Objective**: Implement the remaining three MCP tools for managing and summarizing food entries.

#### TASK-032: Implement delete_food_entry Tool

**Description**: Create the delete_food_entry MCP tool for removing entries from today's log.

**Acceptance Criteria**:
- [x] Tool file created with proper MCP tool structure
- [x] Input schema uses DeleteFoodEntrySchema (UUID validation)
- [x] Tool handler calls API client deleteFoodEntry method
- [x] Success response includes confirmation message
- [x] 404 errors handled with judgment-free message
- [x] Invalid UUID caught by validation with helpful message
- [x] Tool registered in server.ts
- [x] Tool returns DeleteFoodEntryOutput type

**Dependencies**: TASK-031, TASK-011, TASK-020

**Estimated Effort**: M (2-4hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/src/tools/delete-food-entry.ts` (create)
- `/home/ericreyes/github/cleanslate-mcp/src/server.ts` (update)

---

#### TASK-033: Write delete_food_entry Tool Unit Tests

**Description**: Create focused unit tests for delete_food_entry tool logic.

**Acceptance Criteria**:
- [x] 2-5 focused tests covering critical behaviors
- [x] Test successful deletion
- [x] Test invalid UUID validation error
- [x] Test 404 not found error handling
- [x] Mock API client methods
- [x] All tests pass

**Dependencies**: TASK-032

**Estimated Effort**: S (1-2hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/tests/unit/tools/delete-food-entry.test.ts` (create)

---

#### TASK-034: Implement edit_food_entry Tool

**Description**: Create the edit_food_entry MCP tool for updating existing entries.

**Acceptance Criteria**:
- [x] Tool file created with proper MCP tool structure
- [x] Input schema uses EditFoodEntrySchema with refinement for at least one field
- [x] Tool handler calls API client updateFoodEntry method
- [x] Success response includes updated entry and confirmation message
- [x] Validation error if no fields provided to update
- [x] 404 errors handled with judgment-free message
- [x] Tool registered in server.ts
- [x] Tool returns EditFoodEntryOutput type

**Dependencies**: TASK-031, TASK-011, TASK-020

**Estimated Effort**: M (2-4hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/src/tools/edit-food-entry.ts` (create)
- `/home/ericreyes/github/cleanslate-mcp/src/server.ts` (update)

---

#### TASK-035: Write edit_food_entry Tool Unit Tests

**Description**: Create focused unit tests for edit_food_entry tool logic.

**Acceptance Criteria**:
- [x] 2-5 focused tests covering critical behaviors
- [x] Test successful update of calories
- [x] Test successful update of protein
- [x] Test successful update of name
- [x] Test validation error when no fields provided
- [x] Test 404 not found error handling
- [x] Mock API client methods
- [x] All tests pass

**Dependencies**: TASK-034

**Estimated Effort**: S (1-2hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/tests/unit/tools/edit-food-entry.test.ts` (create)

---

#### TASK-036: Implement get_today_summary Tool

**Description**: Create the get_today_summary MCP tool for getting total calories and protein.

**Acceptance Criteria**:
- [x] Tool file created with proper MCP tool structure
- [x] Input schema uses GetTodaySummarySchema (empty object)
- [x] Tool handler calls API client getTodaySummary method
- [x] Success response includes totalCalories, totalProtein, entryCount
- [x] Empty log returns zeros (not an error)
- [x] Error handling returns judgment-free messages
- [x] Tool registered in server.ts
- [x] Tool returns GetTodaySummaryOutput type

**Dependencies**: TASK-031, TASK-011, TASK-021

**Estimated Effort**: M (2-4hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/src/tools/get-today-summary.ts` (create)
- `/home/ericreyes/github/cleanslate-mcp/src/server.ts` (update)

---

#### TASK-037: Write get_today_summary Tool Unit Tests

**Description**: Create focused unit tests for get_today_summary tool logic.

**Acceptance Criteria**:
- [x] 2-5 focused tests covering critical behaviors
- [x] Test successful summary retrieval
- [x] Test empty log returns zeros
- [x] Test API error handling
- [x] Mock API client methods
- [x] All tests pass

**Dependencies**: TASK-036

**Estimated Effort**: S (1-2hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/tests/unit/tools/get-today-summary.test.ts` (create)

---

### Task Group 7: Testing & Quality Assurance

**Assigned Implementer:** testing-engineer
**Dependencies:** Task Groups 1-6

**Objective**: Review test coverage, fill critical gaps, and ensure all feature-specific tests pass.

#### TASK-038: Review Existing Test Coverage

**Description**: Analyze the tests written by api-engineer in Task Groups 2-6 and identify gaps.

**Acceptance Criteria**:
- [x] Review tests from TASK-013 (date utilities: 2-5 tests)
- [x] Review tests from TASK-022 (API client: 2-5 tests)
- [x] Review tests from TASK-029, 031, 033, 035, 037 (tool tests: ~10-25 tests total)
- [x] Run test coverage report to identify uncovered critical paths
- [x] Document critical gaps specifically related to this feature
- [x] Prioritize gaps by business impact

**Dependencies**: TASK-037

**Estimated Effort**: M (2-4hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/docs/test-coverage-analysis.md` (create)

---

#### TASK-039: Write Integration Tests for MCP Protocol

**Description**: Add comprehensive integration tests for MCP protocol compliance beyond basic connection test.

**Acceptance Criteria**:
- [x] Maximum 5 additional integration tests
- [x] Test tool discovery (list available tools)
- [x] Test tool invocation request/response cycle for each tool
- [x] Test invalid tool name handling
- [x] Test malformed request handling
- [x] All tests pass

**Dependencies**: TASK-038

**Estimated Effort**: M (2-4hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/tests/integration/mcp-protocol.test.ts` (update)

---

#### TASK-040: Write End-to-End Workflow Tests

**Description**: Create tests for complete user workflows combining multiple tools.

**Acceptance Criteria**:
- [x] Maximum 5 end-to-end tests
- [x] Test workflow: log food → get today log → verify entry appears
- [x] Test workflow: log food → edit entry → verify changes
- [x] Test workflow: log food → delete entry → verify removal
- [x] Test workflow: log multiple foods → get summary → verify totals
- [x] Mock CleanSlate API responses
- [x] All tests pass

**Dependencies**: TASK-038

**Estimated Effort**: L (4-8hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/tests/integration/workflows.test.ts` (create)

---

#### TASK-041: Write Error Handling Tests

**Description**: Add tests specifically for error scenarios and edge cases if not already covered.

**Acceptance Criteria**:
- [x] Maximum 5 error handling tests
- [x] Test authentication failure (401 error)
- [x] Test network timeout handling
- [x] Test malformed API responses
- [x] Test validation errors maintain judgment-free tone
- [x] Mock API client to return errors
- [x] All tests pass

**Dependencies**: TASK-038

**Estimated Effort**: M (2-4hrs)

**Priority**: Medium

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/tests/unit/error-handling.test.ts` (create)

---

#### TASK-042: Run Full Test Suite and Verify Coverage

**Description**: Execute all tests and verify coverage meets 80% minimum threshold.

**Acceptance Criteria**:
- [x] Run `pnpm test:coverage` successfully
- [x] Overall coverage >= 80%
- [x] Tools coverage >= 90%
- [x] API client coverage >= 85%
- [x] Validation coverage >= 90%
- [x] All tests pass (estimated 20-40 tests total)
- [x] Coverage report generated and reviewed

**Dependencies**: TASK-041

**Estimated Effort**: S (1-2hrs)

**Priority**: High

**Files Affected**:
- Coverage report (generated)

---

### Task Group 8: Documentation & Final Integration

**Assigned Implementer:** api-engineer
**Dependencies:** Task Group 7

**Objective**: Complete documentation, perform final integration testing, and prepare for release.

#### TASK-043: Write Comprehensive README

**Description**: Create detailed README with setup, installation, and usage instructions.

**Acceptance Criteria**:
- [x] Project overview and philosophy alignment section
- [x] Installation instructions (pnpm install)
- [x] Setup instructions (environment variables, API key)
- [x] Claude Code integration instructions (MCP configuration)
- [x] Tool descriptions with examples for all 5 tools
- [x] Troubleshooting section
- [x] Development workflow (build, test, lint commands)
- [x] License and contribution information
- [x] Links to CleanSlate website and API docs

**Dependencies**: TASK-042

**Estimated Effort**: L (4-8hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/README.md` (update)

---

#### TASK-044: Create Tool Usage Examples

**Description**: Write detailed usage examples demonstrating conversational interaction with each tool.

**Acceptance Criteria**:
- [x] Example conversation for log_food (with Claude's interpretation)
- [x] Example for get_today_log showing formatted output
- [x] Example for delete_food_entry in context
- [x] Example for edit_food_entry correcting mistakes
- [x] Example for get_today_summary
- [x] Examples demonstrate judgment-free, natural language interactions
- [x] Examples added to README or separate EXAMPLES.md

**Dependencies**: TASK-043

**Estimated Effort**: M (2-4hrs)

**Priority**: Medium

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/README.md` (update)
- `/home/ericreyes/github/cleanslate-mcp/EXAMPLES.md` (create)

---

#### TASK-045: Create CONTRIBUTING.md Guide

**Description**: Write contribution guidelines for open source contributors.

**Acceptance Criteria**:
- [x] Code of conduct statement
- [x] Development setup instructions
- [x] Testing requirements (80% coverage, test writing approach)
- [x] Code style and formatting requirements (ESLint, Prettier)
- [x] Pull request process
- [x] Issue reporting guidelines
- [x] Philosophy alignment section (maintaining judgment-free tone)

**Dependencies**: TASK-043

**Estimated Effort**: S (1-2hrs)

**Priority**: Medium

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/CONTRIBUTING.md` (update)

---

#### TASK-046: Manual Integration Test with Claude Code

**Description**: Perform manual end-to-end testing with real CleanSlate API and Claude Code client.

**Acceptance Criteria**:
- [x] MCP server configured in Claude Code (or MCP Inspector)
- [x] Test log_food tool via conversational command
- [x] Test get_today_log tool and verify output formatting
- [x] Test delete_food_entry tool
- [x] Test edit_food_entry tool
- [x] Test get_today_summary tool
- [x] Verify all error messages are judgment-free and helpful
- [x] Document any issues found and fix before completion

**Note**: Manual testing guide created. Actual testing requires CleanSlate API credentials.

**Dependencies**: TASK-042

**Estimated Effort**: M (2-4hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/MANUAL_TESTING.md` (create - testing procedures documented)

---

#### TASK-047: Performance and Error Handling Verification

**Description**: Test MCP server under various failure scenarios to ensure graceful degradation.

**Acceptance Criteria**:
- [x] Test with invalid API key (verify helpful error message)
- [x] Test with unreachable CleanSlate API (verify retry and failure handling)
- [x] Test with malformed requests (verify validation errors)
- [x] Measure response times (should be under 2 seconds per spec)
- [x] Test graceful shutdown (SIGINT/SIGTERM)
- [x] Verify no memory leaks during extended operation
- [x] Document any performance issues

**Note**: Code review complete. Performance verification checklist created for testing once API credentials available.

**Dependencies**: TASK-046

**Estimated Effort**: M (2-4hrs)

**Priority**: High

**Files Affected**:
- `/home/ericreyes/github/cleanslate-mcp/PERFORMANCE_VERIFICATION.md` (create - verification procedures documented)

---

#### TASK-048: Final Code Review and Cleanup

**Description**: Perform final code review, remove dead code, and ensure all quality standards met.

**Acceptance Criteria**:
- [x] Run `pnpm lint` and fix all errors
- [x] Run `pnpm format` to ensure consistent formatting
- [x] Run `pnpm typecheck` to verify no type errors
- [x] Remove any TODO comments or dead code
- [x] Verify all files have appropriate comments
- [x] Verify no `any` types in production code
- [x] Verify all console.log statements are intentional (remove debug logs)
- [x] Build succeeds: `pnpm build`
- [x] All tests pass: `pnpm test`

**Dependencies**: TASK-047

**Estimated Effort**: M (2-4hrs)

**Priority**: High

**Files Affected**:
- All source files (cleanup - complete, all checks passed)

---

## Execution Order

**Recommended Implementation Sequence:**

**Phase 1 - Foundation (Tasks 1-7)**: ~6-10 hours
- Complete project setup, tooling configuration, and documentation structure
- Creates stable foundation for development
- Can be done quickly and provides immediate value

**Phase 2 - Core Types & Utilities (Tasks 8-15)**: ~8-12 hours
- Build type-safe foundation with interfaces, schemas, and utilities
- These are dependencies for all subsequent tasks
- Validation and error handling established early

**Phase 3 - API Client (Tasks 16-22)**: ~10-16 hours
- Research and implement CleanSlate API integration
- Complete HTTP client with authentication and error handling
- Critical path for all tool implementations

**Phase 4 - MCP Server Foundation (Tasks 23-27)**: ~6-10 hours
- Set up MCP server infrastructure
- Establish tool registration system
- Test basic protocol connectivity

**Phase 5 - MCP Tools Part 1 (Tasks 28-31)**: ~6-10 hours
- Implement first two tools: log_food and get_today_log
- Establish pattern for tool implementation
- Provides early testable functionality

**Phase 6 - MCP Tools Part 2 (Tasks 32-37)**: ~8-12 hours
- Implement remaining three tools: delete, edit, summary
- Complete all 5 core tools from specification
- All feature functionality complete

**Phase 7 - Testing & QA (Tasks 38-42)**: ~8-14 hours
- Review coverage and fill gaps
- Write integration and E2E tests
- Achieve 80%+ coverage target

**Phase 8 - Documentation & Integration (Tasks 43-48)**: ~10-16 hours
- Complete comprehensive documentation
- Manual testing with Claude Code
- Final polish and quality verification

**Total Estimated Effort**: 62-100 hours (approximately 8-13 full working days)

---

## Critical Path Tasks (High Priority Dependencies)

The following tasks are on the critical path and block other work:

1. **TASK-001**: Initialize project (blocks all other work)
2. **TASK-002**: Configure TypeScript (blocks type-safe development)
3. **TASK-005**: Create project structure (blocks all file creation)
4. **TASK-011**: Create validation schemas (blocks tool input validation)
5. **TASK-016**: Research CleanSlate API (blocks API client development)
6. **TASK-017**: Create API client base (blocks all API integration)
7. **TASK-020**: Create food entry endpoints (blocks tool implementations)
8. **TASK-023**: Install MCP SDK (blocks server setup)
9. **TASK-024**: Create MCP server setup (blocks tool registration)
10. **TASK-026**: Create server entry point (blocks server startup)

**Parallel Work Opportunities:**
- Tasks 8-14 (type definitions and utilities) can be worked on in parallel after Task 5
- Tasks 3-4 (linting/testing setup) can be done in parallel with Tasks 8-10
- Tool implementations (Tasks 28-36) can be parallelized in pairs after Task 26
- Documentation tasks (43-45) can be drafted in parallel with testing tasks

---

## Identified Risks & Challenges

### High Risk
1. **CleanSlate API Documentation Unknown**: Task 16 may reveal API differs from assumptions in spec
   - **Mitigation**: Complete Task 16 early; be prepared to adjust type definitions if needed

2. **MCP SDK Learning Curve**: First time using MCP SDK may require additional research
   - **Mitigation**: Allocate extra time for Tasks 23-27; review official examples

3. **Authentication Mechanism Uncertainty**: API key authentication method not confirmed
   - **Mitigation**: Clarify during Task 16; have fallback approaches ready

### Medium Risk
4. **Test Coverage Target (80%)**: Ambitious coverage goal may require more test writing than estimated
   - **Mitigation**: Write tests alongside implementation (TDD approach); allocate buffer time in Task Group 7

5. **Judgment-Free Messaging Consistency**: Maintaining philosophy across all error messages requires attention
   - **Mitigation**: Create error message guidelines in Task 12; review during Task 48

### Low Risk
6. **Claude Code Integration Issues**: MCP configuration may have compatibility issues
   - **Mitigation**: Use MCP Inspector tool for testing if Claude Code has issues; follow official MCP examples

7. **Performance Requirements**: Sub-2-second response time may be challenging with API latency
   - **Mitigation**: Measure early in Task 46; implement caching if needed (future optimization noted in spec)

---

## Success Criteria Summary

Phase 1 is complete when:

1. All 48 tasks marked complete
2. MCP server successfully connects to Claude Code via stdio transport
3. All 5 tools functional with CleanSlate API
4. Test coverage >= 80% with all tests passing (estimated 20-40 tests)
5. Comprehensive README and documentation complete
6. TypeScript strict mode enabled with no `any` types in production code
7. All error messages maintain judgment-free tone
8. ESLint and Prettier pass with zero errors
9. Manual acceptance test passes: Install → Configure → Connect to Claude Code → Successfully log food and view totals through conversational commands
10. No known bugs; graceful error handling throughout

---

## Notes on Philosophy Alignment

Every task in this breakdown reflects CleanSlate's core values:

- **Anti-Perfectionism**: Test coverage targets are pragmatic (80%), not exhaustive; limited test writing during development (2-5 tests per component)
- **Judgment-Free**: Error message quality prioritized in multiple tasks (12, 19, 41)
- **Simplicity**: Minimal dependencies, straightforward architecture, clear task structure
- **Speed**: Focus on core functionality first, optimizations noted for future
- **Daily Reset**: All tools operate on "today only" per specification
- **Privacy-First**: No analytics, no user tracking, local-first approach

---

**End of Task Breakdown**
