import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getClient, walletProvider } from '../providers';
import { createSafeClient } from '@safe-global/sdk-starter-kit';
import * as fs from 'node:fs';
import type { Memory, State, IAgentRuntime, ModelProviderName } from '@elizaos/core';

// Mock dependencies
vi.mock('@safe-global/sdk-starter-kit', () => ({
    createSafeClient: vi.fn().mockImplementation(async () => {
        // Validate required config first
        return {
            getAddress: vi.fn().mockResolvedValue('0x123...abc'),
            send: vi.fn().mockResolvedValue({ hash: '0xmocked' })
        };
    })
}));

vi.mock('node:fs', () => ({
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn()
}));

vi.mock('viem/accounts', () => ({
    privateKeyToAccount: vi.fn().mockReturnValue({
        address: '0xmockedAddress'
    })
}));

describe('Safe Provider', () => {
    const mockRuntime = {
        name: 'test-runtime',
        memory: new Map(),
        getMemory: vi.fn(),
        setMemory: vi.fn(),
        clearMemory: vi.fn(),
        agentId: 'test-agent-0000-0000-0000-000000000000',
        serverUrl: 'http://test.com',
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        databaseAdapter: {} as any,
        token: 'test-token',
        composeState: vi.fn(),
        generateText: vi.fn(),
        generateObject: vi.fn(),
        updateRecentMessageState: vi.fn(),
        modelProvider: 'openai' as ModelProviderName,
        imageModelProvider: 'openai' as ModelProviderName,
        imageVisionModelProvider: 'openai' as ModelProviderName,
        character: {
            name: 'test-character',
            username: 'test-user',
            settings: {}
        },
        plugins: [],
        actions: [],
        evaluators: [],
        providers: [],
        services: new Map(),
        memoryManagers: new Map(),
        clients: {},
        fetch: vi.fn(),
        cacheManager: {} as any,
        messageManager: {} as any,
        descriptionManager: {} as any,
        loreManager: {} as any,
        documentsManager: {} as any,
        knowledgeManager: {} as any,
        ragKnowledgeManager: {} as any
    } as unknown as IAgentRuntime;

    const mockMemory: Memory = {
        userId: 'test-user-0000-0000-0000-000000000000',
        agentId: 'test-agent-0000-0000-0000-000000000000',
        roomId: 'test-room-0000-0000-0000-000000000000',
        content: {
            text: 'test message',
            attachments: []
        }
    };

    const mockState: State = {
        bio: '',
        lore: '',
        messageDirections: '',
        postDirections: '',
        recentMessages: '',
        recentPosts: '',
        attachments: '',
        actors: '',
        actorsData: [],
        roomId: 'test-room-0000-0000-0000-000000000000',
        goals: '',
        goalsData: [],
        recentMessagesData: []
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Set required environment variables
        process.env.WALLET_PRIVATE_KEY = '0xmockedPrivateKey';
        process.env.RPC_URL = 'https://mock.rpc.url';
    });

    afterEach(() => {
        process.env.WALLET_PRIVATE_KEY = undefined;
        process.env.RPC_URL = undefined;
    });

    describe('getClient', () => {
        it('should create new Safe when no existing Safe address', async () => {
            vi.mocked(fs.existsSync).mockReturnValue(false);

            const client = await getClient();
            
            expect(createSafeClient).toHaveBeenCalledWith({
                provider: 'https://mock.rpc.url',
                signer: '0xmockedPrivateKey',
                owners: ['0xmockedAddress'],
                threshold: 1,
                saltNonce: "0"
            });
            expect(fs.writeFileSync).toHaveBeenCalledWith(
                'wallet_data.txt',
                '0x123...abc'
            );
            expect(client).toBeDefined();
        });

        it('should use existing Safe address when available', async () => {
            vi.mocked(fs.existsSync).mockReturnValue(true);
            vi.mocked(fs.readFileSync).mockReturnValue('0xexistingSafe');

            const client = await getClient();
            
            expect(createSafeClient).toHaveBeenCalledWith({
                provider: 'https://mock.rpc.url',
                signer: '0xmockedPrivateKey',
                safeAddress: '0xexistingSafe'
            });
            expect(fs.writeFileSync).toHaveBeenCalledWith(
                'wallet_data.txt',
                '0x123...abc'
            );
            expect(client).toBeDefined();
        });

        it('should throw error when wallet private key is missing', async () => {
            delete process.env.WALLET_PRIVATE_KEY

            await expect(getClient()).rejects.toThrow(
                'Missing required wallet private key. Please set WALLET_PRIVATE_KEY environment variable.'
            );
        });

        it('should throw error when RPC URL is missing', async () => {
            delete process.env.RPC_URL

            await expect(getClient()).rejects.toThrow(
                'Missing required RPC URL. Please set RPC_URL environment variable.'
            );
        });

        it('should handle file read errors gracefully', async () => {
            vi.mocked(fs.existsSync).mockReturnValue(true);
            vi.mocked(fs.readFileSync).mockImplementation(() => {
                throw new Error('File read error');
            });

            const client = await getClient();
            
            expect(createSafeClient).toHaveBeenCalledWith({
                provider: 'https://mock.rpc.url',
                signer: '0xmockedPrivateKey',
                owners: ['0xmockedAddress'],
                threshold: 1,
                saltNonce: "0"
            });
            expect(client).toBeDefined();
        });
    });

    describe('walletProvider', () => {
        it('should return Safe address', async () => {
            const result = await walletProvider.get(mockRuntime, mockMemory, mockState);
            expect(result).toBe('AgentKit Wallet Address: 0x123...abc');
        });

        it('should handle errors and return error message', async () => {
            vi.mocked(createSafeClient).mockRejectedValueOnce(
                new Error('Configuration failed')
            );

            const result = await walletProvider.get(mockRuntime, mockMemory, mockState);
            expect(result).toBe('Error initializing AgentKit wallet: Failed to initialize Safe client: Configuration failed');
        });
    });
});