import type { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const SafeEnvironmentSchema = z.object({
    WALLET_PRIVATE_KEY: z.string().min(1, "Wallet private key is required"),
    RPC_URL: z.string().min(1, "RPC URL is required"),
});

export type SafeConfig = z.infer<typeof SafeEnvironmentSchema>;

export async function validateSafeConfig(runtime: IAgentRuntime): Promise<SafeConfig> {
   try {
    const config = {
        WALLET_PRIVATE_KEY: runtime.getSetting("WALLET_PRIVATE_KEY") || process.env.WALLET_PRIVATE_KEY,
        RPC_URL: runtime.getSetting("RPC_URL") || process.env.RPC_URL,
    };

    return SafeEnvironmentSchema.parse(config);
   } catch (error) {
    if (error instanceof z.ZodError) {
        const errorMessage = error.errors.map((e) => e.message).join("\n");
        throw new Error(`Invalid Safe configuration: ${errorMessage}`);
    }
    throw new Error("Invalid Safe configuration");
   }
};