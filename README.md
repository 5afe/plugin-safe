# Plugin Safe

A secure plugin system for managing safe operations.

## Installation

```bash
pnpm add plugin-safe
```

## Usage

```typescript
import { getSettings } from 'plugin-safe';

// Initialize the plugin with environment settings
const settings = getSettings();
```

## Project Structure

```
plugin-safe/
├── images/
│   ├── logo.jpg        # Plugin branding logo
│   ├── banner.jpg      # Plugin banner image
├── src/
│   ├── index.ts        # Main plugin entry point
│   ├── actions/        # Plugin-specific actions
│   ├── clients/        # Client implementations
│   ├── adapters/       # Adapter implementations
│   ├── types.ts        # Type definitions
│   └── environment.ts  # Runtime settings and validation
├── package.json        # Plugin dependencies
├── vite.config.ts     # Vite configuration
└── README.md          # Plugin documentation
```

## Development

1. Install dependencies:
```bash
pnpm install
```

2. Start development mode (with watch):
```bash
pnpm dev
```

3. Build the project:
```bash
pnpm build
```

4. Run tests:
```bash
# Run tests once
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

5. Type checking:
```bash
pnpm typecheck
```

## Environment Variables

The plugin requires the following environment variables:

- `API_KEY`: Your API key for authentication
- `API_URL`: The base URL for API requests

## Build Information

This project uses:
- Vite for building and bundling
- Vitest for testing
- TypeScript for type safety
- ESM and CommonJS module formats supported

## License

ISC 