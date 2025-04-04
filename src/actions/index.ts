import {
    IAgentRuntime,
    Memory,
    State,
    HandlerCallback,
    elizaLogger,
    Action,
    ActionExample,
} from "@elizaos/core";
import { getClient } from "../providers";

export const getBalance: Action = {
    name: "GET_BALANCE",
    description: "Get the balance of your Safe",
    similes: [
        "GET_BALANCE",
        "CHECK_BALANCE",
        "CHECK_BALANCE_OF",
        "CHECK_BALANCE_OF_ADDRESS",
        "LOOKUP_BALANCE",
        "LOOKUP_BALANCE_OF",
        "LOOKUP_BALANCE_OF_ADDRESS",
        "LIST_BALANCE",
        "LIST_BALANCE_OF",
        "LIST_BALANCE_OF_ADDRESS",
        "GET_BALANCE_OF",
        "GET_BALANCE_OF_ADDRESS",
        "GET_BALANCE_OF_WALLET",
        "GET_BALANCE_OF_WALLET_ADDRESS",
    ],
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        elizaLogger.info("Validating get balance action");
        try {
            const safeWallet = await getClient();
            if (!safeWallet) {
                elizaLogger.error("Failed to initialize the wallet");
                return false;
            }
            return true;
        } catch (error) {
            elizaLogger.error("Error validating get balance action", error);
            return false;
        }
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        elizaLogger.info("Getting balance");

        let currentState: State;
        if (!state) {
            currentState = (await runtime.composeState(message)) as State;
        } else {
            currentState = await runtime.updateRecentMessageState(state);
        }

        try {
            const safeWallet = await getClient();
            if (!safeWallet) {
                elizaLogger.error("Failed to initialize Safe wallet");
                if (callback) {
                    callback({
                        text: "Failed to initialize Safe wallet",
                        content: { error: "Failed to initialize Safe wallet" },
                    });
                }
                return false;
            }

            const balance = await safeWallet.protocolKit.getBalance();

            const constructResponse = `
            Address: ${safeWallet.getAddress()}
            Balance: ${balance} ETH
            Network: ${safeWallet.protocolKit.getChainId()}
            `;

            if (callback) {
                callback({
                    text: constructResponse,
                });
            }

            return true;
        } catch (error) {
            elizaLogger.error("Error getting balance", error);
            if (callback) {
                callback({
                    text: `Error getting balance: ${error}`,
                    content: { error: error },
                });
            }
            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Check my balance of Safe",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I'll help you check your balance of Safe",
                    action: "GET_BALANCE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show my balance",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I'll help you check Safe balance...",
                    action: "GET_BALANCE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Check my wallet balance on Safe",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I'll help you check your wallet balance on Safe",
                    action: "GET_BALANCE",
                },
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What is my balance?",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I'll help you check your balance...",
                },
            }
        ],
    ] as ActionExample[][],
} as Action;