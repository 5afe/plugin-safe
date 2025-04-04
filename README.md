# Plugin Safe

 !!! WIP

A Safe wallet plugin for interacting with Safe Protocol Kit and managing wallet operations.

## Features

- Get wallet balance
- View wallet address
- Check network information
- Interact with Safe Protocol Kit

## Installation

```bash
pnpm add plugin-safe
```

## Usage

```typescript
import { getBalance } from 'plugin-safe';

// The plugin provides actions that can be used with ElizaOS
// Example: Using the GET_BALANCE action
const balanceAction = getBalance;
```

## Project Structure

```
plugin-safe/
├── src/
│   ├── index.ts        # Main plugin entry point
│   ├── actions/        # Plugin actions (GET_BALANCE, etc.)
│   ├── providers/      # Safe wallet provider implementations
│   └── types.ts        # Type definitions
├── package.json
└── README.md
```

## Development

1. Install dependencies:
```bash
pnpm install
```

2. Start development mode:
```bash
pnpm dev
```

3. Build the project:
```bash
pnpm build
```

4. Run tests:
```bash
pnpm test
```

## Environment Variables

The plugin requires the following environment variables for Safe wallet integration:

- `SAFE_PRIVATE_KEY`: Private key for the Safe wallet
- `RPC_URL`: RPC URL for the blockchain network
- `CHAIN_ID`: Chain ID of the network (e.g., "1" for Ethereum mainnet)
- `SAFE_ADDRESS`: (Optional) Address of an existing Safe. If not provided, a new Safe will be created

## Testing

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage
```

## Build with

- [Safe Protocol Kit](https://github.com/safe-global/safe-core-sdk)
- Vite
- TypeScript
- Vitest for testing

## License

ISC 