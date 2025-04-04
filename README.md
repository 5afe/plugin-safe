# Plugin Safe

 !!! WIP

A Safe wallet plugin for interacting with Safe Protocol Kit and managing wallet operations.

## Features

- Get wallet balance
- View wallet address
- Check network information
- Interact with Safe Protocol Kit


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

- `WALLET_PRIVATE_KEY`: Private key for the Safe wallet
- `RPC_URL`: RPC URL for the blockchain network

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