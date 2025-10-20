# CleanSlate MCP Server

MCP server for CleanSlate API - judgment-free nutrition tracking through AI assistants.

## Overview

This MCP (Model Context Protocol) server enables AI assistants like Claude to interact with the CleanSlate API for nutrition tracking. It provides a conversational interface for logging food, viewing daily totals, and managing entries without the guilt and complexity of traditional diet apps.

## Features

- **Five core tools** for food logging:
  - `log_food`: Add food entries with calories and protein
  - `get_today_log`: View all entries for today
  - `delete_food_entry`: Remove entries
  - `edit_food_entry`: Update existing entries
  - `get_today_summary`: Get daily totals
- **Judgment-free error messages** that maintain CleanSlate's anti-perfectionism philosophy
- **Today-only tracking** with automatic daily reset
- **Type-safe** TypeScript implementation

## Installation

### Quick Install (Recommended)

Install directly via npm and add to Claude Code in one command:

```bash
claude mcp add --transport stdio cleanslate \
  --env CLEANSLATE_API_KEY=your_api_key_here \
  --env CLEANSLATE_API_BASE_URL=https://your-instance.jinocenc.io/auth/graphql \
  -- npx -y cleanslate-mcp
```

Replace `your_api_key_here` with your CleanSlate API key (found in CleanSlate Settings > API Token) and `your-instance.jinocenc.io` with your CleanSlate instance URL.

### Alternative: Install from Source

```bash
# Clone the repository
git clone https://github.com/Juxsta/cleanslate-mcp.git
cd cleanslate-mcp

# Install dependencies
pnpm install

# Build the project
pnpm build

# Add to Claude Code
claude mcp add --transport stdio cleanslate \
  --env CLEANSLATE_API_KEY=your_api_key_here \
  --env CLEANSLATE_API_BASE_URL=https://your-instance.jinocenc.io/auth/graphql \
  -- node /path/to/cleanslate-mcp/dist/index.js
```

## Configuration

**Getting Your API Key:**
1. Open your CleanSlate instance (e.g., https://cleanslate.jinocenc.io)
2. Go to Settings
3. Find "API Token" in the Information section
4. Copy the token value

**Finding Your Instance URL:**
- If you're using the hosted version: `https://cleanslate.jinocenc.io/auth/graphql`
- If self-hosted: `https://your-domain.com/auth/graphql`

## Development

```bash
# Build the project
pnpm build

# Run tests
pnpm test

# Run with coverage
pnpm test:coverage

# Lint code
pnpm lint

# Format code
pnpm format
```

## Philosophy

This project aligns with CleanSlate's core values:

- **Anti-Perfectionism**: Easy to fix mistakes, no historical guilt
- **Judgment-Free**: Helpful error messages without blame
- **Simplicity**: Only track calories and protein
- **Daily Reset**: Focus on today, not the past

## License

Apache 2.0 - See LICENSE file for details

## Contributing

See CONTRIBUTING.md for contribution guidelines.
