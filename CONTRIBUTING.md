# Contributing to CleanSlate MCP

Thank you for your interest in contributing to the CleanSlate MCP server!

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `pnpm install`
3. Copy `.env.example` to `.env` and add your API key
4. Run tests: `pnpm test`

## Code Quality Standards

- **TypeScript Strict Mode**: All code must pass strict type checking
- **Test Coverage**: Maintain minimum 80% coverage for new code
- **ESLint**: Run `pnpm lint` before committing
- **Prettier**: Format code with `pnpm format`
- **No `any` Types**: Use specific types throughout

## Philosophy Alignment

All contributions must maintain CleanSlate's judgment-free, anti-perfectionism philosophy:

- Error messages should be helpful, not blaming
- Keep features simple and focused
- Maintain "today only" tracking approach
- Support easy mistake correction

## Pull Request Process

1. Create a feature branch from `main`
2. Write tests for new functionality
3. Ensure all tests pass: `pnpm test`
4. Run linter: `pnpm lint:fix`
5. Format code: `pnpm format`
6. Submit PR with clear description

## Testing Requirements

- Write focused unit tests (2-5 tests per feature)
- Test critical error paths
- Mock external API calls
- Maintain judgment-free error messages in tests

## Questions?

Open an issue for discussion before starting major changes.
