# Product Roadmap

## Phase 1: Core MCP Server & Simple Logging

1. [x] MCP Server Foundation — Set up TypeScript-based MCP server with CleanSlate API authentication, connection handling, and basic protocol compliance. Includes development environment configuration and initial project structure. `M`

2. [x] Food Logging Tool — Implement `log_food` MCP tool that accepts food name, calories, and protein, validates inputs, calls CleanSlate API to add entry to today's log, and returns confirmation with entry details. `S`

3. [x] Today's Log Retrieval — Implement `get_today_log` MCP tool that fetches all food entries for the current day from CleanSlate API and formats them for conversational display (food name, calories, protein, timestamp). `S`

4. [x] Entry Management — Implement `delete_food_entry` and `edit_food_entry` MCP tools that allow users to remove or modify today's entries by ID, supporting the "mistakes are okay" philosophy. `S`

## Phase 2: Basic Foods & Fast Tracking

5. [ ] Basic Foods Search — Implement `get_basic_foods` MCP tool with search/filter capabilities to query CleanSlate's pre-defined simple foods library, returning food name, default calories, and default protein values. `S`

6. [ ] Quick Add from Basic Foods — Implement `quick_add_basic_food` MCP tool that accepts a Basic Food ID and optional quantity multiplier, automatically adding it to today's log with correct calories/protein calculations. `M`

7. [x] Today's Summary — Implement `get_today_summary` MCP tool that aggregates today's logged foods and returns total calories, total protein, and count of entries with clear, judgment-free formatting. `S`

8. [ ] Custom Basic Foods — Implement `create_basic_food` and `manage_basic_foods` MCP tools allowing users to add their frequently-eaten foods with default nutrition values for future quick-adding. `M`

## Phase 3: Educational Integration

9. [ ] Curriculum Access — Implement `get_curriculum_topic` MCP tool that retrieves CleanSlate's evidence-based educational content on hunger management, exercise, sleep, and sustainable nutrition habits, returning formatted markdown content. `M`

10. [ ] Contextual Tips — Implement smart prompting system that surfaces relevant educational tips based on user's tracking patterns (e.g., low protein days trigger protein education), respecting the non-judgmental philosophy. `L`

11. [ ] Weekly Pattern Summary — Implement `get_weekly_summary` MCP tool that shows gentle weekly patterns (average calories, average protein, tracking consistency) without guilt-inducing historical graphs or failure messaging. `M`

## Phase 4: Advanced Features

12. [ ] Data Export — Implement `export_data` MCP tool that allows users to export their nutrition data in JSON or CSV format for external analysis, supporting data portability and user control. `S`

13. [ ] Voice-Optimized Logging — Enhance all MCP tools with natural language parsing to handle conversational inputs like "I ate two scrambled eggs" or "chicken breast for lunch" with smart calorie/protein inference. `L`

14. [ ] Multi-Day Context (Limited) — Implement `get_recent_patterns` tool that shows last 7 days of summary data (totals only, not detailed entries) to help identify patterns without overwhelming users with historical guilt. `M`

## Phase 5: Polish & Distribution

15. [x] Comprehensive Documentation — Create developer documentation including MCP server setup guide, CleanSlate API integration instructions, available tools reference, and example conversational workflows. `M`

16. [ ] NPM Package Distribution — Package the MCP server as an NPM module with proper versioning, dependency management, and installation instructions for easy deployment in Claude Code and other MCP clients. `S`

17. [ ] Docker Container — Create Dockerized deployment option with environment variable configuration for CleanSlate API credentials, supporting self-hosted installations with full data privacy. `S`

18. [x] Testing & Quality Assurance — Implement comprehensive test suite including MCP protocol compliance tests, CleanSlate API integration tests, and unit tests for all tools, ensuring reliability and correctness. `L`

> Notes
> - Phases are ordered to deliver value incrementally: logging first, speed optimizations second, education third
> - Phase 1-2 create a functional MVP for daily tracking without judgment
> - Phase 3 adds educational value that differentiates from simple calorie counters
> - Phase 4 enhances UX without compromising core simplicity philosophy
> - Phase 5 ensures production-ready quality and easy adoption
> - All features respect CleanSlate's anti-perfectionism philosophy: no features that induce guilt, add unnecessary complexity, or punish mistakes
> - Total estimated timeline: 10-14 weeks for full roadmap completion
