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

```bash
# Clone the repository
git clone https://github.com/yourusername/cleanslate-mcp.git
cd cleanslate-mcp

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env

# Edit .env and add your CleanSlate API key
nano .env
```

## Configuration

Get your API key from the CleanSlate settings page and add it to `.env`:

```env
CLEANSLATE_API_KEY=your_api_key_here
CLEANSLATE_API_BASE_URL=https://api.cleanslate.sh/v1
```

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

## Usage with Claude Code

Add the server to your Claude Code MCP configuration:

```json
{
  "mcpServers": {
    "cleanslate": {
      "command": "node",
      "args": ["/path/to/cleanslate-mcp/dist/index.js"],
      "env": {
        "CLEANSLATE_API_KEY": "your_api_key_here"
      }
    }
  }
}
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
