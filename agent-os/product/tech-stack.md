# Tech Stack

## Framework & Runtime
- **Application Framework:** Model Context Protocol (MCP) SDK
- **Language/Runtime:** Node.js (v18+) with TypeScript
- **Package Manager:** pnpm (aligns with CleanSlate's package management)

## MCP Protocol
- **MCP SDK:** @modelcontextprotocol/sdk (official TypeScript implementation)
- **Protocol Version:** MCP 1.0 specification
- **Transport:** stdio (standard input/output for Claude Code integration)
- **Tool System:** MCP tools for exposing CleanSlate functionality to AI assistants

## Backend Integration
- **CleanSlate API:** RESTful API integration for food logging, Basic Foods, and curriculum
- **HTTP Client:** Native fetch API (Node.js 18+) or axios for API requests
- **Authentication:** API key-based authentication via environment variables
- **Error Handling:** Graceful error handling with user-friendly messages that maintain judgment-free philosophy

## Data Layer
- **Primary Data Source:** CleanSlate API (no local database needed)
- **Caching:** In-memory caching for Basic Foods and curriculum content to reduce API calls
- **Data Format:** JSON for all API communication
- **Validation:** Zod for runtime type validation and input sanitization

## Development Tools
- **Type System:** TypeScript (strict mode) for type safety across MCP tools and API integration
- **Code Formatting:** Prettier for consistent code style
- **Linting:** ESLint with TypeScript rules for code quality
- **Build Tool:** TypeScript compiler (tsc) for building production artifacts

## Testing & Quality
- **Test Framework:** Vitest (fast, modern alternative to Jest)
- **MCP Testing:** MCP protocol compliance tests using official test utilities
- **API Testing:** Integration tests for CleanSlate API interactions with mocked responses
- **Unit Testing:** Unit tests for business logic, validation, and data transformations
- **Coverage:** Target 80%+ code coverage for core functionality

## Deployment & Distribution
- **NPM Package:** Published to npm registry for easy installation
- **Docker:** Dockerfile for containerized deployment with environment configuration
- **CI/CD:** GitHub Actions for automated testing, linting, and publishing
- **Versioning:** Semantic versioning (semver) for releases

## Configuration & Security
- **Environment Variables:** dotenv for local development configuration
- **Secrets Management:** Environment variables for CleanSlate API credentials (never committed to git)
- **Configuration Schema:** Validated environment configuration with clear error messages
- **HTTPS:** All API communication over HTTPS (enforced by CleanSlate API)

## MCP Tools Exposed

### Core Logging Tools
- `log_food` - Add food entry with calories and protein to today's log
- `get_today_log` - Retrieve all food entries for current day
- `delete_food_entry` - Remove specific entry from today's log
- `edit_food_entry` - Modify existing entry in today's log
- `get_today_summary` - Get aggregated totals (calories + protein) for today

### Basic Foods Tools
- `get_basic_foods` - Search/browse CleanSlate's simple foods library
- `quick_add_basic_food` - Add Basic Food to log with automatic nutrition calculation
- `create_basic_food` - Create custom Basic Food for future quick-adding
- `manage_basic_foods` - List, edit, or delete user's custom Basic Foods

### Educational Tools
- `get_curriculum_topic` - Access evidence-based educational content
- `get_weekly_summary` - View gentle weekly patterns (non-judgmental format)

### Data Tools
- `export_data` - Export nutrition data in JSON or CSV format

## Third-Party Services
- **CleanSlate API:** Core service for all nutrition data, user authentication, and curriculum content
- **Monitoring:** Console logging for development; optional Sentry integration for production error tracking
- **Analytics:** None (privacy-first approach; no user tracking)

## Documentation
- **README:** Setup instructions, CleanSlate API configuration, MCP client integration guide
- **API Reference:** Detailed documentation of all MCP tools with examples
- **Architecture Guide:** System design overview, data flow diagrams, and integration patterns
- **Contributing Guide:** Development setup, testing procedures, and contribution guidelines

## Development Workflow
- **Version Control:** Git with conventional commits for clear history
- **Branching Strategy:** Feature branches with PR reviews before merging to main
- **Code Review:** Required PR approval before merge
- **Release Process:** Automated via GitHub Actions (test, build, publish to npm)
- **Changelog:** Automated changelog generation from conventional commits

## Alignment with CleanSlate Philosophy
- **Speed:** Minimal dependencies and optimized API calls for sub-5-second interactions
- **Simplicity:** TypeScript ensures type safety without runtime bloat
- **Privacy:** No analytics, no user tracking, local-first where possible
- **Open Source:** Apache 2.0 license (matching CleanSlate's licensing)
- **Anti-Perfectionism:** Error messages and responses maintain judgment-free language
