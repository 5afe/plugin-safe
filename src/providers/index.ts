import type { Provider, IAgentRuntime } from "@elizaos/core";
import { createSafeClient, type SafeClient } from '@safe-global/sdk-starter-kit'
import { privateKeyToAccount } from 'viem/accounts';

export async function getClient(): Promise<SafeClient> {
    // Validate required environment variables first
    const walletKey = process.env.WALLET_PRIVATE_KEY;
    const rpcUrl = process.env.RPC_URL;
    if (!walletKey) {
        throw new Error("Missing required wallet private key. Please set WALLET_PRIVATE_KEY environment variable.");
    }

    if (!rpcUrl) {
        throw new Error("Missing required RPC URL. Please set RPC_URL environment variable.");
    }

    const config = {
        provider: rpcUrl,
        signer: walletKey,
        owners: [privateKeyToAccount(walletKey as `0x${string}`).address],
        threshold: 1,
        saltNonce: "0"
    }

    try {
        const safeClient = await createSafeClient(config)
        // Save wallet data
        return safeClient;
    } catch (error: unknown) {
        console.error("Failed to initialize Safe client:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to initialize Safe client: ${errorMessage}`);
    }
}

export const walletProvider: Provider = {
    async get(_runtime: IAgentRuntime): Promise<string | null> {
        try {
            const client = await getClient();
            const address = await client.getAddress();
            return `AgentKit Wallet Address: ${address}`;
        } catch (error: unknown) {
            console.error("Error in AgentKit provider:", error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return `Error initializing AgentKit wallet: ${errorMessage}`;
        }
    },
};