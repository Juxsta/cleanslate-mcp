# Remaining Work Checklist - CleanSlate MCP Server

**Last Updated:** 2025-10-20
**Status:** 27/48 tasks complete (56%)

## Critical Path Items (Must Complete Before Production)

### Task Group 5: MCP Tool Implementations - Part 1

**Estimated Effort:** 6-10 hours

- [ ] **TASK-028: Implement log_food Tool**
  - Create `src/tools/log-food.ts`
  - Validate input using LogFoodSchema
  - Call `apiClient.createFoodEntry()`
  - Return LogFoodOutput with success message
  - Handle errors with judgment-free messages
  - Wire into server.ts request handler

- [ ] **TASK-029: Write log_food Unit Tests**
  - Create `tests/unit/tools/log-food.test.ts`
  - Test valid input creates entry successfully
  - Test validation errors (invalid calories, empty name, etc.)
  - Test API error handling (network failure, 500 error)
  - Mock API client methods
  - Target: 2-5 tests

- [ ] **TASK-030: Implement get_today_log Tool**
  - Create `src/tools/get-today-log.ts`
  - Call `apiClient.getTodayLog()`
  - Return GetTodayLogOutput with entries array and count
  - Handle empty log gracefully (not an error)
  - Handle errors with judgment-free messages
  - Wire into server.ts request handler

- [ ] **TASK-031: Write get_today_log Unit Tests**
  - Create `tests/unit/tools/get-today-log.test.ts`
  - Test successful retrieval with multiple entries
  - Test empty log returns empty array (not error)
  - Test API error handling
  - Mock API client methods
  - Target: 2-5 tests

### Task Group 6: MCP Tool Implementations - Part 2

**Estimated Effort:** 8-12 hours

- [ ] **TASK-032: Implement delete_food_entry Tool**
  - Create `src/tools/delete-food-entry.ts`
  - Validate entryId using DeleteFoodEntrySchema
  - Call `apiClient.deleteFoodEntry(entryId)`
  - Return DeleteFoodEntryOutput with confirmation
  - Handle 404 with judgment-free message
  - Handle invalid UUID in validation
  - Wire into server.ts request handler

- [ ] **TASK-033: Write delete_food_entry Unit Tests**
  - Create `tests/unit/tools/delete-food-entry.test.ts`
  - Test successful deletion
  - Test invalid UUID validation error
  - Test 404 not found error handling
  - Mock API client methods
  - Target: 2-5 tests

- [ ] **TASK-034: Implement edit_food_entry Tool**
  - Create `src/tools/edit-food-entry.ts`
  - Validate input using EditFoodEntrySchema (at least one field required)
  - Call `apiClient.updateFoodEntry(entryId, updates)`
  - Return EditFoodEntryOutput with updated entry
  - Handle validation error when no fields provided
  - Handle 404 with judgment-free message
  - Wire into server.ts request handler

- [ ] **TASK-035: Write edit_food_entry Unit Tests**
  - Create `tests/unit/tools/edit-food-entry.test.ts`
  - Test successful update of calories
  - Test successful update of protein
  - Test successful update of name
  - Test validation error when no fields provided
  - Test 404 not found error handling
  - Mock API client methods
  - Target: 2-5 tests

- [ ] **TASK-036: Implement get_today_summary Tool**
  - Create `src/tools/get-today-summary.ts`
  - Call `apiClient.getTodaySummary()`
  - Return GetTodaySummaryOutput with totals
  - Handle empty log (return zeros, not error)
  - Handle errors with judgment-free messages
  - Wire into server.ts request handler

- [ ] **TASK-037: Write get_today_summary Unit Tests**
  - Create `tests/unit/tools/get-today-summary.test.ts`
  - Test successful summary retrieval
  - Test empty log returns zeros
  - Test API error handling
  - Mock API client methods
  - Target: 2-5 tests

### Task Group 7: Testing & Quality Assurance

**Estimated Effort:** 14-20 hours

- [ ] **TASK-038: Review Existing Test Coverage**
  - Run `pnpm test:coverage` and analyze gaps
  - Review tests from TASK-013, 022, 029, 031, 033, 035, 037
  - Document critical gaps in `docs/test-coverage-analysis.md`
  - Prioritize gaps by business impact
  - Target missing: validation.ts (0%), auth.ts (0%), environment.ts (0%)

- [ ] **TASK-039: Write Integration Tests for MCP Protocol**
  - Update `tests/integration/mcp-protocol.test.ts`
  - Test tool discovery (list available tools)
  - Test tool invocation request/response for each tool
  - Test invalid tool name handling
  - Test malformed request handling
  - Target: Maximum 5 additional tests

- [ ] **TASK-040: Write End-to-End Workflow Tests**
  - Create `tests/integration/workflows.test.ts`
  - Test: log food → get today log → verify entry appears
  - Test: log food → edit entry → verify changes
  - Test: log food → delete entry → verify removal
  - Test: log multiple foods → get summary → verify totals
  - Mock CleanSlate API responses
  - Target: Maximum 5 tests

- [ ] **TASK-041: Write Error Handling Tests**
  - Create `tests/unit/error-handling.test.ts`
  - Test authentication failure (401 error)
  - Test network timeout handling
  - Test malformed API responses
  - Test validation errors maintain judgment-free tone
  - Mock API client to return errors
  - Target: Maximum 5 tests

- [ ] **TASK-042: Run Full Test Suite and Verify Coverage**
  - Run `pnpm test:coverage`
  - Verify overall coverage >= 80%
  - Verify tools coverage >= 90%
  - Verify API client coverage >= 85%
  - Verify validation coverage >= 90%
  - Ensure all tests pass (estimated 40-50 tests total)
  - Review and commit coverage report

### Task Group 8: Documentation & Final Integration (Remaining)

**Estimated Effort:** 6-10 hours

- [x] **TASK-043: Write Comprehensive README** ✅ Complete
- [x] **TASK-044: Create Tool Usage Examples** ✅ Complete
- [x] **TASK-045: Create CONTRIBUTING.md Guide** ✅ Complete

- [ ] **TASK-046: Manual Integration Test with Claude Code**
  - Configure MCP server in Claude Code (or MCP Inspector)
  - Test log_food tool via conversational command
  - Test get_today_log tool and verify output formatting
  - Test delete_food_entry tool
  - Test edit_food_entry tool
  - Test get_today_summary tool
  - Verify all error messages are judgment-free and helpful
  - Document any issues found and fix before completion

- [ ] **TASK-047: Performance and Error Handling Verification**
  - Test with invalid API key (verify helpful error message)
  - Test with unreachable CleanSlate API (verify retry and failure handling)
  - Test with malformed requests (verify validation errors)
  - Measure response times (should be under 2 seconds per spec)
  - Test graceful shutdown (SIGINT/SIGTERM)
  - Verify no memory leaks during extended operation
  - Document any performance issues

- [ ] **TASK-048: Final Code Review and Cleanup**
  - Run `pnpm lint` and fix all errors (should already pass)
  - Run `pnpm format` to ensure consistent formatting
  - Run `pnpm typecheck` to verify no type errors (should already pass)
  - Remove any TODO comments or dead code
  - Verify all files have appropriate comments
  - Verify no `any` types in production code (should already be clean)
  - Verify all console.log statements are intentional (remove debug logs)
  - Build succeeds: `pnpm build` (should already pass)
  - All tests pass: `pnpm test` (should already pass with new tests)

## Additional Improvements (Optional, Nice to Have)

### Validation Test Coverage
- [ ] Add unit tests for `src/utils/validation.ts` (currently 0% coverage)
  - Test LogFoodSchema with valid/invalid inputs
  - Test EditFoodEntrySchema refinement (at least one field required)
  - Test DeleteFoodEntrySchema UUID validation
  - Estimated: 5-10 tests, 1-2 hours

### Auth Test Coverage
- [ ] Add unit tests for `src/api/auth.ts` (currently 0% coverage)
  - Test `createAuthHeaders()` formats Bearer token correctly
  - Test `validateApiKey()` catches empty/missing keys
  - Estimated: 2-3 tests, 30 minutes

### Environment Test Coverage
- [ ] Add unit tests for `src/config/environment.ts` (currently 0% coverage)
  - Test valid environment loads successfully
  - Test missing required variable fails with helpful message
  - Test default values applied for optional variables
  - Estimated: 3-5 tests, 1 hour

### Error Message Improvement
- [ ] Replace generic "An error occurred" message in `src/server.ts` line 206
  - Change to: "Something went wrong. Try again in a moment."
  - Maintains conversational, judgment-free tone
  - Estimated: 5 minutes

## Progress Tracking

### By Task Group
- [x] Task Group 1: Project Foundation (7/7 tasks) - 100% ✅
- [x] Task Group 2: Core Types & Utilities (8/8 tasks) - 100% ✅
- [x] Task Group 3: API Client (7/7 tasks) - 100% ✅
- [x] Task Group 4: MCP Server Foundation (5/5 tasks) - 100% ✅
- [ ] Task Group 5: Tools Part 1 (0/4 tasks) - 0% ⏳
- [ ] Task Group 6: Tools Part 2 (0/6 tasks) - 0% ⏳
- [ ] Task Group 7: Testing & QA (0/5 tasks) - 0% ⏳
- [x] Task Group 8: Documentation (3/6 tasks) - 50% ⚠️

### By Priority
- **Critical (blocking production):** 21 tasks remaining
  - Task Groups 5, 6, 7: Tool implementation and testing
  - Task Group 8: Integration testing (TASK-046, 047, 048)

- **High (important for quality):** 0 tasks (all critical items)

- **Medium (nice to have):** 4 optional improvements
  - Validation tests, auth tests, environment tests, error message tweak

### Test Count Progress
- **Current:** 29 tests passing
- **After Task Groups 5-6:** ~45-55 tests (tool unit tests)
- **After Task Group 7:** ~60-75 tests (integration + E2E + error handling)
- **Target:** 40+ tests minimum

### Coverage Progress
- **Current:** 44.28% (FAIL - target 80%)
- **After Task Groups 5-6:** ~65-70% (improving)
- **After Task Group 7:** ~80-85% (PASS ✅)

## Quick Commands

```bash
# Run tests
pnpm test

# Run with coverage
pnpm test:coverage

# Build project
pnpm build

# Type check
pnpm typecheck

# Lint
pnpm lint

# Format
pnpm format

# Run server locally (after tools implemented)
pnpm start
```

## Success Criteria Checklist

Phase 1 complete when:

- [ ] All 48 tasks marked complete in tasks.md
- [ ] MCP server successfully connects to Claude Code via stdio transport
- [ ] All 5 tools functional with CleanSlate API
- [ ] Test coverage >= 80% with all tests passing (estimated 40+ tests)
- [ ] Comprehensive README and documentation complete ✅ (already done)
- [ ] TypeScript strict mode enabled with no `any` types ✅ (already clean)
- [ ] All error messages maintain judgment-free tone ✅ (already excellent)
- [ ] ESLint and Prettier pass with zero errors ✅ (already passing)
- [ ] Manual acceptance test passes: Install → Configure → Connect to Claude Code → Successfully log food and view totals
- [ ] No known bugs; graceful error handling throughout

---

**Status:** 27/48 tasks complete (56%)
**Estimated Remaining Effort:** 34-52 hours (4-7 working days)
**Next Milestone:** Complete Task Group 5 (tools part 1) - 6-10 hours
