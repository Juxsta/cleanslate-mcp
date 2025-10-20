# Requirements: CleanSlate MCP Server - Project Initialization

## Project Overview

Create an MCP (Model Context Protocol) server that wraps the CleanSlate API, enabling AI assistants like Claude to perform judgment-free nutrition tracking aligned with CleanSlate's core philosophy.

## Core Requirements

### 1. Project Structure & Setup

**Must Have:**
- TypeScript-based Node.js project
- pnpm package manager (aligning with CleanSlate)
- MCP SDK integration (@modelcontextprotocol/sdk)
- Proper TypeScript configuration
- Basic project structure following MCP best practices
- README with setup instructions
- Apache 2.0 license (matching CleanSlate)

### 2. MCP Server Foundation

**Must Have:**
- Functional MCP server that can connect to MCP clients
- Proper server initialization and lifecycle management
- Error handling and logging
- Configuration management (API endpoints, auth, etc.)
- Health check/status capability

### 3. CleanSlate API Integration

**Must Have:**
- Connection to CleanSlate API (https://cleanslate.sh)
- Authentication mechanism
- Basic API client setup
- Error handling for API failures

### 4. Core MCP Tools (Phase 1)

**Tool 1: log_food**
- Add a food entry with calories and protein (ONLY these two metrics)
- Today's date automatically applied (fresh start philosophy)
- Input: food name/description, calories, protein
- Output: Confirmation with entry details

**Tool 2: get_today_log**
- Retrieve all food entries for today
- Returns: List of entries with food name, calories, protein, timestamp
- Sorted by time added

**Tool 3: delete_food_entry**
- Remove a food entry from today's log
- Input: Entry ID
- Output: Confirmation of deletion

**Tool 4: edit_food_entry**
- Update calories/protein for an existing entry
- Input: Entry ID, updated calories/protein
- Output: Updated entry details

**Tool 5: get_today_summary**
- Get total calories and protein for today
- Returns: Total calories, total protein, number of entries

## Philosophy Alignment

All features must respect CleanSlate's core principles:

1. **Only track calories and protein** - No other macros/micros
2. **Daily reset** - Focus on today only, no guilt from historical data
3. **Speed** - Fast, frictionless interactions
4. **Anti-perfectionism** - Forgiving UX, mistakes are okay
5. **Simplicity** - Minimal configuration, easy to use

## Technical Requirements

### Stack (from tech-stack.md)
- Node.js 18+
- TypeScript
- pnpm package manager
- @modelcontextprotocol/sdk
- Zod for validation
- Vitest for testing

### Code Quality
- TypeScript strict mode
- ESLint configuration
- Prettier for formatting
- Type-safe API interactions
- Error handling throughout

### Testing
- Unit tests for core logic
- MCP protocol compliance tests
- API integration tests (mocked for unit tests)

### Documentation
- README with setup and usage instructions
- API documentation for MCP tools
- Code comments for complex logic
- Contributing guide

## Success Criteria

1. MCP server successfully starts and connects to MCP clients
2. All 5 core tools functional and tested
3. Clean integration with CleanSlate API
4. Comprehensive test coverage (>80%)
5. Clear documentation for developers and users
6. Project structure ready for Phase 2 features

## Out of Scope (Future Phases)

- Basic Foods library (Phase 2)
- Educational curriculum access (Phase 3)
- Weekly summaries (Phase 4)
- Voice optimization (Phase 4)
- NPM publishing (Phase 5)

## User Context

- User is building this to enable CleanSlate tracking through Claude Code
- User values CleanSlate's anti-perfectionism philosophy
- Project should be open source (Apache 2.0)
- TypeScript preferred for type safety
